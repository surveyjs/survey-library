import type { FilterTreeNode } from "survey-core";
import {
  IQueryOptions, IQueryRequest, IQueryComparator, IPreparedCondition, IQueryFieldInfo,
  getFilterTree, getRange, getSortList, getComparator, prepareCondition, isDateOnly, getNextDay, queryError
} from "./query-common";

// A parameterized SQL query from a read request. Every value of the request becomes a parameter; only the checked
// skip/take integers and the code's own column expressions reach the text. Each condition renders as a two-valued
// predicate: a positive one is (col IS NOT NULL AND P), a negative one (col IS NULL OR NOT (P)), so NOT, AND and OR
// above it never meet an UNKNOWN and !({f} = 'abc') keeps the null rows the way the local filter does.

export interface ISqlQueryOptions extends IQueryOptions {
  dialect?: "postgres" | "mysql" | "sqlite" | "mssql" | "oracle";
  // index is the 0-based position of the value in params
  placeholder?(index: number): string;
  quote?(name: string): string;
}
// where, orderBy and range come without their keywords and are "" when there is nothing:
// `SELECT ... ${q.where && "WHERE " + q.where} ${q.orderBy && "ORDER BY " + q.orderBy} ${q.range}`
export interface ISqlQuery {
  where: string;
  orderBy: string;
  range: string;
  params: Array<any>;
}

interface ISqlDialect {
  placeholder(index: number): string;
  quote(name: string): string;
  trueText: string;
  falseText: string;
  textCast(column: string): string;
  range(skip: number, take: number): string;
  // SQL Server's OFFSET needs an ORDER BY
  orderByForRange?: string;
  // Oracle stores '' as NULL: an empty text is a NULL there
  emptyTextIsNull?: boolean;
  // sqlite and Oracle (before 23ai) have no boolean parameter
  booleanAsNumber?: boolean;
  // characters that LIKE reads as wildcards besides % and _
  likeSpecials?: string;
}

function quoteWith(open: string, close: string): (name: string) => string {
  return (name: string): string => open + name.split(close).join(close + close) + close;
}
function limitOffset(noTake: string): (skip: number, take: number) => string {
  return (skip: number, take: number): string => {
    if (!take) return skip ? (noTake ? noTake + " OFFSET " + skip : "OFFSET " + skip) : "";
    return "LIMIT " + take + (skip ? " OFFSET " + skip : "");
  };
}
function offsetFetch(skip: number, take: number): string {
  if (!skip && !take) return "";
  return "OFFSET " + skip + " ROWS" + (take ? " FETCH NEXT " + take + " ROWS ONLY" : "");
}
const dialects: { [name: string]: ISqlDialect } = {
  postgres: {
    placeholder: (index: number) => "$" + (index + 1), quote: quoteWith("\"", "\""), trueText: "TRUE", falseText: "FALSE",
    textCast: (col: string) => "CAST(" + col + " AS TEXT)", range: limitOffset("")
  },
  mysql: {
    placeholder: () => "?", quote: quoteWith("`", "`"), trueText: "TRUE", falseText: "FALSE",
    textCast: (col: string) => "CAST(" + col + " AS CHAR)", range: limitOffset("LIMIT 18446744073709551615")
  },
  sqlite: {
    placeholder: () => "?", quote: quoteWith("\"", "\""), trueText: "1=1", falseText: "1=0",
    textCast: (col: string) => "CAST(" + col + " AS TEXT)", range: limitOffset("LIMIT -1"), booleanAsNumber: true
  },
  mssql: {
    placeholder: (index: number) => "@p" + index, quote: quoteWith("[", "]"), trueText: "1=1", falseText: "1=0",
    textCast: (col: string) => "CAST(" + col + " AS NVARCHAR(100))", range: offsetFetch, orderByForRange: "(SELECT NULL)",
    likeSpecials: "["
  },
  oracle: {
    placeholder: (index: number) => ":" + (index + 1), quote: quoteWith("\"", "\""), trueText: "1=1", falseText: "1=0",
    textCast: (col: string) => "TO_CHAR(" + col + ")", range: offsetFetch, emptyTextIsNull: true, booleanAsNumber: true
  }
};

// '!' is the escape character in every dialect: a backslash is an escape inside a MySQL string literal by default,
// so ESCAPE '\' does not parse there, and '\\' breaks under NO_BACKSLASH_ESCAPES.
const likeEscape = "!";

class SqlRenderer {
  public params: Array<any> = [];
  private dialect: ISqlDialect;
  private comparator: IQueryComparator;
  constructor(private options: ISqlQueryOptions) {
    const dialect = dialects[options.dialect || "postgres"];
    if (!dialect) queryError("unknown dialect: " + String(options.dialect));
    this.dialect = dialect;
    this.comparator = getComparator(options);
  }
  public get rangeOrderBy(): string {
    return this.dialect.orderByForRange || "";
  }
  public range(skip: number, take: number): string {
    return this.dialect.range(skip, take);
  }
  public quote(name: string): string {
    return this.options.quote ? this.options.quote(name) : this.dialect.quote(name);
  }
  public column(info: IQueryFieldInfo): string {
    return info.field.column || this.quote(info.name);
  }
  public value(val: any): string {
    if (typeof val === "boolean" && this.dialect.booleanAsNumber) val = val ? 1 : 0;
    const index = this.params.length;
    this.params.push(val);
    return this.options.placeholder ? this.options.placeholder(index) : this.dialect.placeholder(index);
  }
  public node(node: FilterTreeNode): string {
    const item = <any>node;
    if ("and" in item) return "(" + item.and.map((child: FilterTreeNode) => this.node(child)).join(" AND ") + ")";
    if ("or" in item) return "(" + item.or.map((child: FilterTreeNode) => this.node(child)).join(" OR ") + ")";
    if ("not" in item) return "NOT (" + this.node(item.not) + ")";
    if ("const" in item) return this.bool(item.const);
    const prepared = prepareCondition(this.options, item);
    return typeof prepared === "boolean" ? this.bool(prepared) : this.condition(prepared);
  }
  private bool(val: boolean): string {
    return val ? this.dialect.trueText : this.dialect.falseText;
  }
  private condition(cond: IPreparedCondition): string {
    const info = cond.info;
    if (info.field.render) {
      const text = info.field.render(cond.condition, (v: any) => this.value(v));
      if (typeof text !== "string") queryError("render of the field \"" + info.name + "\" did not return a text");
      return "(" + text + ")";
    }
    const col = this.column(info);
    const isText = info.type === "string";
    const lower = (text: string): string => this.comparator.caseSensitive ? text : "LOWER(" + text + ")";
    const lowerValue = (text: string): string => this.comparator.caseSensitive ? text : text.toLowerCase();
    // the column and the value as our equality compares them: trimmed and lowered by the comparator
    const eqColumn = isText ? lower(this.comparator.trimStrings ? "TRIM(" + col + ")" : col) : col;
    const eqValue = (val: any): string => {
      if (isText && this.comparator.trimStrings) val = val.trim();
      return this.value(isText ? lowerValue(val) : val);
    };
    // contains is a substring of the text, a number or a date goes through the dialect's text cast
    const likeColumn = lower(isText ? col : this.dialect.textCast(col));
    const like = (text: string): string => likeColumn + " LIKE " + this.value("%" + this.escapeLike(lowerValue(text)) + "%") +
      " ESCAPE '" + likeEscape + "'";
    // In Oracle TRIM('  ') is NULL: the null test reads the same expression P reads
    const nullTested = this.dialect.emptyTextIsNull && isText ? eqColumn : col;
    const positive = (p: string, tested: string = col): string => "(" + tested + " IS NOT NULL AND " + p + ")";
    const negative = (p: string, tested: string = col): string => "(" + tested + " IS NULL OR NOT (" + p + "))";
    // a date-only value against a column of moments means that whole day
    const isDay = (val: any): boolean => info.type === "datetime" && isDateOnly(val);
    const dayRange = (val: string): string => col + " >= " + this.value(val) + " AND " + col + " < " + this.value(getNextDay(val));
    const equalTo = (val: any): string => isDay(val) ? dayRange(val) : eqColumn + " = " + eqValue(val);
    const val = cond.value;
    switch(cond.op) {
      case "equal": return positive(equalTo(val), nullTested);
      case "notequal": return negative(equalTo(val), nullTested);
      case "greater": return positive(isDay(val) ? col + " >= " + this.value(getNextDay(val)) : col + " > " + this.value(val));
      case "less": return positive(col + " < " + this.value(val));
      case "lessorequal":
        if (isDay(val)) return positive(col + " < " + this.value(getNextDay(val)));
        return positive(this.orEqual(col, eqColumn, "<", val, eqValue));
      case "greaterorequal":
        if (isDay(val)) return positive(col + " >= " + this.value(val));
        return positive(this.orEqual(col, eqColumn, ">", val, eqValue));
      case "contains": return positive(like(val));
      case "notcontains": return negative(like(val));
      case "allof": return positive(cond.values.map(like).join(" AND "));
      case "anyof": return positive(this.anyOf(cond.values, eqColumn, eqValue, isDay, equalTo), nullTested);
      case "noneof": return negative(this.anyOf(cond.values, eqColumn, eqValue, isDay, equalTo), nullTested);
      case "empty":
        return isText && !this.dialect.emptyTextIsNull ? "(" + col + " IS NULL OR " + col + " = '')" : "(" + col + " IS NULL)";
      case "notempty":
        return isText && !this.dialect.emptyTextIsNull ? "(" + col + " IS NOT NULL AND " + col + " <> '')" : "(" + col + " IS NOT NULL)";
    }
    return queryError("unknown operator: " + String(cond.op));
  }
  // ours: >= is equal (trimmed, by case) or greater (as is); without the comparator's changes that is plain >=
  private orEqual(col: string, eqColumn: string, sign: string, val: any, eqValue: (val: any) => string): string {
    if (eqColumn === col) return col + " " + sign + "= " + this.value(val);
    return "(" + eqColumn + " = " + eqValue(val) + " OR " + col + " " + sign + " " + this.value(val) + ")";
  }
  private anyOf(values: Array<any>, eqColumn: string, eqValue: (val: any) => string,
    isDay: (val: any) => boolean, equalTo: (val: any) => string): string {
    if (values.some(isDay)) return "(" + values.map(item => "(" + equalTo(item) + ")").join(" OR ") + ")";
    return eqColumn + " IN (" + values.map(eqValue).join(", ") + ")";
  }
  private escapeLike(text: string): string {
    const specials = likeEscape + "%_" + (this.dialect.likeSpecials || "");
    let res = "";
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      res += specials.indexOf(ch) > -1 ? likeEscape + ch : ch;
    }
    return res;
  }
}

export function toSqlQuery(request: IQueryRequest, options: ISqlQueryOptions): ISqlQuery {
  if (!options) queryError("options are required");
  const renderer = new SqlRenderer(options);
  const range = getRange(request);
  const sort = getSortList(request, options);
  const tree = getFilterTree(request);
  const where = tree ? renderer.node(tree) : "";
  let orderBy = sort.map(item => renderer.column(item.info) + (item.descending ? " DESC" : " ASC")).join(", ");
  const rangeText = renderer.range(range.skip, range.take);
  if (!orderBy && rangeText) orderBy = renderer.rangeOrderBy;
  return { where: where, orderBy: orderBy, range: rangeText, params: renderer.params };
}
