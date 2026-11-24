import type { FilterTreeNode } from "survey-core";
import {
  IQueryOptions, IQueryRequest, IQueryComparator, IPreparedCondition, IQueryFieldInfo,
  getFilterTree, getRange, getSortList, getComparator, prepareCondition, isDateOnly, getNextDay, queryError
} from "./query-common";

// A MongoDB query from a read request: a filter document for find()/countDocuments(), a sort document and the range.
// Values stay BSON values (strings, numbers, booleans, Dates); a text value reaches a $regex only escaped.
// MongoDB comparisons never match a missing or null field, so a positive condition needs no null guard, and every
// negation is a $nor, which matches a missing field: !({f} = 1) keeps the documents without f, as the local filter does.

// limit 0 is no limit, as cursor.limit(0) reads it
export interface IMongoQuery {
  filter: { [key: string]: any };
  sort: { [path: string]: 1 | -1 };
  skip: number;
  limit: number;
}

type MongoFilter = { [key: string]: any };

const trueFilter = (): MongoFilter => ({});
const falseFilter = (): MongoFilter => ({ $expr: false });

// The PCRE metacharacters, and NUL, which MongoDB refuses inside a pattern
function escapeRegex(text: string): string {
  return text.replace(/[\\^$.|?*+()[\]{}]/g, "\\$&").replace(/\0/g, "\\x00");
}
function toDate(val: string): Date {
  if (isDateOnly(val)) {
    const parts = val.split("-");
    return new Date(Date.UTC(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2])));
  }
  return new Date(val);
}
function negate(filter: MongoFilter): MongoFilter {
  const keys = Object.keys(filter);
  if (keys.length === 1 && keys[0] === "$or") return { $nor: filter.$or };
  return { $nor: [filter] };
}
function anyOf(items: Array<MongoFilter>): MongoFilter {
  return items.length === 1 ? items[0] : { $or: items };
}
function allOf(items: Array<MongoFilter>): MongoFilter {
  return items.length === 1 ? items[0] : { $and: items };
}
function isPlainObject(val: any): boolean {
  return !!val && typeof val === "object" && !Array.isArray(val);
}
// The other type our comparator finds equal to an array item: 1 and "1", true and "true"
function getAlternateItem(item: any): any {
  if (typeof item === "number" || typeof item === "boolean") return String(item);
  if (typeof item !== "string") return undefined;
  const text = item.trim();
  const lower = text.toLowerCase();
  if (lower === "true" || lower === "false") return lower === "true";
  const num = Number(text);
  return text !== "" && isFinite(num) && String(num) === text ? num : undefined;
}

class MongoRenderer {
  private comparator: IQueryComparator;
  constructor(private options: IQueryOptions) {
    this.comparator = getComparator(options);
  }
  public path(info: IQueryFieldInfo): string {
    return info.field.column || info.name;
  }
  public node(node: FilterTreeNode): MongoFilter {
    const item = <any>node;
    // never merged into one object: two conditions on one path would overwrite each other's key
    if ("and" in item) return { $and: item.and.map((child: FilterTreeNode) => this.node(child)) };
    if ("or" in item) return { $or: item.or.map((child: FilterTreeNode) => this.node(child)) };
    if ("not" in item) return { $nor: [this.node(item.not)] };
    if ("const" in item) return item.const ? trueFilter() : falseFilter();
    const prepared = prepareCondition(this.options, item, "native");
    if (typeof prepared === "boolean") return prepared ? trueFilter() : falseFilter();
    return this.condition(prepared);
  }
  private get hasComparator(): boolean {
    return !this.comparator.caseSensitive || this.comparator.trimStrings;
  }
  private regex(path: string, pattern: string): MongoFilter {
    const res: MongoFilter = { $regex: pattern };
    if (!this.comparator.caseSensitive) res.$options = "i";
    return { [path]: res };
  }
  // ours: = on texts compares them trimmed and by case, as the comparator says. \z, not $: $ also matches
  // before a final newline
  private textEqual(path: string, text: string): MongoFilter {
    if (!this.hasComparator) return { [path]: text };
    const trim = this.comparator.trimStrings;
    const space = trim ? "\\s*" : "";
    return this.regex(path, "^" + space + escapeRegex(trim ? text.trim() : text) + space + "\\z");
  }
  // ours: contains is a substring of the text, by case, untrimmed. A number, a boolean or a date matches its text,
  // which $convert makes; onError/onNull keep a stray value from failing the whole query (MongoDB 4.2+)
  private contains(info: IQueryFieldInfo, path: string, text: string): MongoFilter {
    if (info.type === "string") return this.regex(path, escapeRegex(text));
    const match: MongoFilter = {
      input: { $convert: { input: "$" + path, to: "string", onError: "", onNull: "" } },
      regex: escapeRegex(text)
    };
    if (!this.comparator.caseSensitive) match.options = "i";
    return { $expr: { $regexMatch: match } };
  }
  // an element equal to the item, by our comparator; a number item also finds its text and the reverse
  private elementEqual(path: string, item: any): MongoFilter {
    const alternate = getAlternateItem(item);
    const own = typeof item === "string" ? this.textEqual(path, item) : { [path]: item };
    if (alternate === undefined) return own;
    const other = typeof alternate === "string" ? this.textEqual(path, alternate) : { [path]: alternate };
    return { $or: [own, other] };
  }
  private plainElements(items: Array<any>): Array<any> | undefined {
    if (this.hasComparator) return undefined;
    const res: Array<any> = [];
    items.forEach(item => {
      res.push(item);
      const alternate = getAlternateItem(item);
      if (alternate !== undefined) res.push(alternate);
    });
    return res;
  }
  private arrayCondition(cond: IPreparedCondition, path: string): MongoFilter {
    const val = cond.value;
    switch(cond.op) {
      case "empty": return { $or: [{ [path]: null }, { [path]: { $size: 0 } }] };
      case "notempty": return { $nor: [{ [path]: null }, { [path]: { $size: 0 } }] };
      case "contains": return this.elementEqual(path, val);
      case "notcontains":
        // ours: false for a missing field and for an empty or null element, true for []
        if (val === "") return { $and: [{ [path]: { $ne: null } }, negate(this.elementEqual(path, ""))] };
        return negate(this.elementEqual(path, val));
      case "anyof":
      case "noneof": {
        const plain = this.plainElements(cond.values);
        const res = plain ? { [path]: { $in: plain } } : anyOf(cond.values.map(item => this.elementEqual(path, item)));
        return cond.op === "anyof" ? res : negate(res);
      }
      case "allof": {
        const plain = this.plainElements(cond.values);
        if (plain && plain.length === cond.values.length) return { [path]: { $all: plain } };
        return allOf(cond.values.map(item => this.elementEqual(path, item)));
      }
    }
    return queryError("unknown operator: " + String(cond.op));
  }
  private condition(cond: IPreparedCondition): MongoFilter {
    const info = cond.info;
    if (info.field.render) {
      const res = info.field.render(cond.condition, (v: any) => v);
      if (!isPlainObject(res)) queryError("render of the field \"" + info.name + "\" did not return an object");
      return <MongoFilter>res;
    }
    const path = this.path(info);
    if (info.type === "array") return this.arrayCondition(cond, path);
    const isText = info.type === "string";
    const isDate = info.type === "date" || info.type === "datetime";
    const bson = (val: any): any => isDate ? toDate(val) : val;
    // a date-only value against a field of moments means that whole day, from UTC midnight
    const isDay = (val: any): boolean => info.type === "datetime" && isDateOnly(val);
    const compare = (sign: string, val: any): MongoFilter => ({ [path]: { [sign]: bson(val) } });
    const equalTo = (val: any): MongoFilter => {
      if (isDay(val)) return { [path]: { $gte: toDate(val), $lt: toDate(getNextDay(val)) } };
      return isText ? this.textEqual(path, val) : { [path]: bson(val) };
    };
    // ours: >= is equal (trimmed, by case) or greater (as is); without the comparator's changes that is plain $gte
    const orEqual = (sign: string, val: any): MongoFilter => {
      if (!isText || !this.hasComparator) return compare(sign + "e", val);
      return { $or: [this.textEqual(path, val), compare(sign, val)] };
    };
    const anyOfValues = (values: Array<any>): MongoFilter => {
      if (values.some(isDay) || (isText && this.hasComparator)) return anyOf(values.map(equalTo));
      return { [path]: { $in: values.map(bson) } };
    };
    const val = cond.value;
    switch(cond.op) {
      case "equal": return equalTo(val);
      case "notequal": return negate(equalTo(val));
      case "greater": return isDay(val) ? compare("$gte", getNextDay(val)) : compare("$gt", val);
      case "less": return compare("$lt", val);
      case "lessorequal": return isDay(val) ? compare("$lt", getNextDay(val)) : orEqual("$lt", val);
      case "greaterorequal": return isDay(val) ? compare("$gte", val) : orEqual("$gt", val);
      case "contains": return this.contains(info, path, val);
      case "notcontains": return negate(this.contains(info, path, val));
      case "allof": return allOf(cond.values.map(item => this.contains(info, path, item)));
      case "anyof": return anyOfValues(cond.values);
      case "noneof": return negate(anyOfValues(cond.values));
      case "empty": return isText ? { $or: [{ [path]: null }, { [path]: "" }] } : { [path]: null };
      case "notempty": return isText ? { $nor: [{ [path]: null }, { [path]: "" }] } : { [path]: { $ne: null } };
    }
    return queryError("unknown operator: " + String(cond.op));
  }
}

export function toMongoQuery(request: IQueryRequest, options: IQueryOptions): IMongoQuery {
  if (!options) queryError("options are required");
  const renderer = new MongoRenderer(options);
  const range = getRange(request);
  const sortList = getSortList(request, options);
  const tree = getFilterTree(request);
  // in sort order; a path that two fields share sorts once, by the first. An integer-like path ("0") would move
  // to the front of the object: JavaScript orders such keys first
  const sort: { [path: string]: 1 | -1 } = {};
  sortList.forEach(item => {
    const path = renderer.path(item.info);
    if (!Object.prototype.hasOwnProperty.call(sort, path)) sort[path] = item.descending ? -1 : 1;
  });
  return { filter: tree ? renderer.node(tree) : {}, sort: sort, skip: range.skip, limit: range.take };
}
