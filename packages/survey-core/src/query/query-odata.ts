import type { FilterTreeNode } from "survey-core";
import {
  IQueryOptions, IQueryRequest, IQueryComparator, IPreparedCondition, IQueryFieldInfo,
  getFilterTree, getRange, getSortList, getComparator, prepareCondition, isDateOnly, getNextDay, queryError
} from "./query-common";

// OData v4 system query options from a read request. Every value of the request becomes a literal: a text is quoted
// with ' doubled, a number, a boolean and a checked date are written as is. Each condition renders as a two-valued
// predicate, as in SQL: a positive one is (C ne null and P), a negative one (C eq null or not (P)). A comparison with
// null is two-valued in OData already, but contains() of null is null, and not null drops the row on a service that
// keeps relational null semantics.
// column is the property path (Category/CategoryName); a field name with a dot is no OData path, so it needs column.

export interface IODataQueryOptions extends IQueryOptions {
  // anyof as "in (...)": that operator is OData 4.01, and many 4.0 services (the public Northwind one among them)
  // refuse it. The items of a list are literals, lowered in JavaScript, where equality lowers on the service
  useIn?: boolean;
}
// A key only when it has a value. The caller encodes each value for the URL:
// `for (const key in q) params.push(key + "=" + encodeURIComponent(q[key]))`
export interface IODataQuery {
  $filter?: string;
  $orderby?: string;
  $skip?: number;
  $top?: number;
}

function quoteText(text: string): string {
  return "'" + text.split("'").join("''") + "'";
}
// The literal of a value by its JavaScript type: what render's value(v) returns
function literal(val: any): string {
  if (typeof val === "string") return quoteText(val);
  if (typeof val === "number" && isFinite(val)) return String(val);
  if (typeof val === "boolean") return val ? "true" : "false";
  if (val === null) return "null";
  return queryError("there is no OData literal for the value: " + String(val));
}

class ODataRenderer {
  private comparator: IQueryComparator;
  constructor(private options: IODataQueryOptions) {
    this.comparator = getComparator(options);
  }
  public path(info: IQueryFieldInfo): string {
    return info.field.column || info.name;
  }
  public node(node: FilterTreeNode): string {
    const item = <any>node;
    if ("and" in item) return "(" + item.and.map((child: FilterTreeNode) => this.node(child)).join(" and ") + ")";
    if ("or" in item) return "(" + item.or.map((child: FilterTreeNode) => this.node(child)).join(" or ") + ")";
    if ("not" in item) return "not (" + this.node(item.not) + ")";
    if ("const" in item) return item.const ? "true" : "false";
    const prepared = prepareCondition(this.options, item, "native");
    if (typeof prepared === "boolean") return prepared ? "true" : "false";
    return this.condition(prepared);
  }
  // A text as our equality compares it, trimmed and lowered by the comparator
  private textColumn(expr: string): string {
    const lowered = this.comparator.caseSensitive ? expr : "tolower(" + expr + ")";
    return this.comparator.trimStrings ? "trim(" + lowered + ")" : lowered;
  }
  // The value is trimmed here and lowered by the service: JavaScript lowers the Turkish dotted capital I (U+0130)
  // to two characters, a service's tolower to one, so only the same function on both sides keeps a text equal to itself
  private textValue(text: string): string {
    const val = quoteText(this.comparator.trimStrings ? text.trim() : text);
    return this.comparator.caseSensitive ? val : "tolower(" + val + ")";
  }
  // An item of an "in" list must be a literal, so there it is lowered in JavaScript (a documented difference for U+0130)
  private textListValue(text: string): string {
    if (this.comparator.trimStrings) text = text.trim();
    return quoteText(this.comparator.caseSensitive ? text : text.toLowerCase());
  }
  // A checked date-only value is an Edm.Date literal, a checked moment a DateTimeOffset one; against a datetime
  // field a date-only value is its UTC midnight
  private typed(info: IQueryFieldInfo, val: any): string {
    if (info.type === "date" || info.type === "datetime") {
      return info.type === "datetime" && isDateOnly(val) ? val + "T00:00:00Z" : val;
    }
    return literal(val);
  }
  // ours: contains is a substring of the text, by case, untrimmed. A number, a boolean or a date matches its text
  // through cast(), which some services refuse (the public Northwind one does)
  private contains(info: IQueryFieldInfo, col: string, text: string): string {
    const subject = info.type === "string" ? col : "cast(" + col + ", Edm.String)";
    if (this.comparator.caseSensitive) return "contains(" + subject + ", " + quoteText(text) + ")";
    return "contains(tolower(" + subject + "), tolower(" + quoteText(text) + "))";
  }
  private condition(cond: IPreparedCondition): string {
    const info = cond.info;
    if (info.field.render) {
      const text = info.field.render(cond.condition, literal);
      if (typeof text !== "string") queryError("render of the field \"" + info.name + "\" did not return a text");
      return "(" + text + ")";
    }
    const col = this.path(info);
    if (info.type === "array") return this.arrayCondition(cond, col);
    const isText = info.type === "string";
    const eqColumn = isText ? this.textColumn(col) : col;
    const eqValue = (val: any): string => isText ? this.textValue(val) : this.typed(info, val);
    const positive = (p: string): string => "(" + col + " ne null and " + p + ")";
    const negative = (p: string): string => "(" + col + " eq null or not (" + p + "))";
    const compare = (op: string, val: any): string => col + " " + op + " " + this.typed(info, val);
    // a date-only value against a field of moments means that whole day, from UTC midnight
    const isDay = (val: any): boolean => info.type === "datetime" && isDateOnly(val);
    const equalTo = (val: any): string => {
      if (isDay(val)) return compare("ge", val) + " and " + compare("lt", getNextDay(val));
      return eqColumn + " eq " + eqValue(val);
    };
    // ours: >= is equal (trimmed, by case) or greater (as is); without the comparator's changes that is plain ge
    const orEqual = (op: "lt" | "gt", val: any): string => {
      if (eqColumn === col) return compare(op === "lt" ? "le" : "ge", val);
      return "(" + equalTo(val) + " or " + compare(op, val) + ")";
    };
    const anyOf = (values: Array<any>): string => {
      if (values.some(isDay)) return "(" + values.map(item => "(" + equalTo(item) + ")").join(" or ") + ")";
      if (this.options.useIn) {
        const items = values.map(item => isText ? this.textListValue(item) : this.typed(info, item));
        return eqColumn + " in (" + items.join(", ") + ")";
      }
      return "(" + values.map(equalTo).join(" or ") + ")";
    };
    const val = cond.value;
    switch(cond.op) {
      case "equal": return positive(equalTo(val));
      case "notequal": return negative(equalTo(val));
      case "greater": return positive(isDay(val) ? compare("ge", getNextDay(val)) : compare("gt", val));
      case "less": return positive(compare("lt", val));
      case "lessorequal": return positive(isDay(val) ? compare("lt", getNextDay(val)) : orEqual("lt", val));
      case "greaterorequal": return positive(isDay(val) ? compare("ge", val) : orEqual("gt", val));
      case "contains": return positive(this.contains(info, col, val));
      case "notcontains": return negative(this.contains(info, col, val));
      case "allof": return positive(cond.values.map(item => this.contains(info, col, item)).join(" and "));
      case "anyof": return positive(anyOf(cond.values));
      case "noneof": return negative(anyOf(cond.values));
      case "empty": return isText ? "(" + col + " eq null or " + col + " eq '')" : col + " eq null";
      case "notempty": return isText ? "(" + col + " ne null and " + col + " ne '')" : col + " ne null";
    }
    return queryError("unknown operator: " + String(cond.op));
  }
  // ours on an array: an element equal to the item. A collection is never null and any() is two-valued, so there is
  // no null guard (ne null on a collection is an error). The items are text literals, compared as text by the
  // comparator: a collection of numbers needs render, OData refuses to compare Edm.String with a number
  private arrayCondition(cond: IPreparedCondition, col: string): string {
    const element = (item: any): string => this.textColumn("x") + " eq " + this.textValue(String(item));
    const any = (items: Array<any>): string => col + "/any(x: " + items.map(element).join(" or ") + ")";
    const val = cond.value;
    switch(cond.op) {
      case "empty": return "not (" + col + "/any())";
      case "notempty": return col + "/any()";
      case "contains": return any([val]);
      case "notcontains":
        // ours: false for an empty or a null element, true for []
        if (val === "") return "not (" + col + "/any(x: x eq null or " + element("") + "))";
        return "not (" + any([val]) + ")";
      case "anyof": return any(cond.values);
      case "noneof": return "not (" + any(cond.values) + ")";
      case "allof": {
        const items = cond.values.map(item => any([item]));
        return items.length === 1 ? items[0] : "(" + items.join(" and ") + ")";
      }
    }
    return queryError("unknown operator: " + String(cond.op));
  }
}

export function toODataQuery(request: IQueryRequest, options: IODataQueryOptions): IODataQuery {
  if (!options) queryError("options are required");
  const renderer = new ODataRenderer(options);
  const range = getRange(request);
  const sortList = getSortList(request, options);
  const tree = getFilterTree(request);
  const res: IODataQuery = {};
  if (tree) res.$filter = renderer.node(tree);
  // in sort order; a path that two fields share sorts once, by the first: some services refuse a property twice
  const paths: Array<string> = [];
  const orderBy: Array<string> = [];
  sortList.forEach(item => {
    const path = renderer.path(item.info);
    if (paths.indexOf(path) > -1) return;
    paths.push(path);
    orderBy.push(path + (item.descending ? " desc" : " asc"));
  });
  if (orderBy.length) res.$orderby = orderBy.join(",");
  if (range.skip > 0) res.$skip = range.skip;
  if (range.take > 0) res.$top = range.take;
  return res;
}
