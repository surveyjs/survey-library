import { describe, test, expect, afterEach } from "vitest";
import { ConditionRunner, settings } from "survey-core";
import type { FilterTreeNode } from "survey-core";
import { toSqlQuery, ISqlQueryOptions, ISqlQuery, IQueryField } from "survey-core/query";

const fields: { [name: string]: IQueryField } = {
  name: {}, price: { type: "number" }, ok: { type: "boolean" }, at: { type: "date" }, tags: { type: "array" }, id: { type: "number" }
};
const datetimeFields: { [name: string]: IQueryField } = { at: { type: "datetime" } };

// Every value is a parameter: besides '' and the LIKE escape, no quoted literal may appear in the text
function expectNoLiteral(q: ISqlQuery): void {
  const rest = q.where.split("''").join("").split("'!'").join("");
  expect(rest.indexOf("'"), q.where).toBe(-1);
}
function sql(filter: string | FilterTreeNode, options?: Partial<ISqlQueryOptions>, request?: any): ISqlQuery {
  const res = toSqlQuery({ filter: filter, ...request }, { fields: fields, ...options });
  expectNoLiteral(res);
  return res;
}
function expectWhere(filter: string | FilterTreeNode, where: string, params: Array<any>, options?: Partial<ISqlQueryOptions>): void {
  expect(sql(filter, options)).toEqual({ where: where, orderBy: "", range: "", params: params });
}

describe("toSqlQuery: every condition shape (postgres)", () => {
  test("equal and notequal trim and lower the text on both sides", () => {
    expectWhere("{name} = 'Abc '", "(\"name\" IS NOT NULL AND LOWER(TRIM(\"name\")) = $1)", ["abc"]);
    expectWhere("{name} <> 'abc'", "(\"name\" IS NULL OR NOT (LOWER(TRIM(\"name\")) = $1))", ["abc"]);
  });
  test("contains is LIKE with the wildcards and the escape character escaped in the parameter", () => {
    // a backslash in the expression is literal unless a quote follows it: the value is 50%_x\y
    expectWhere("{name} contains '50%_x\\y'", "(\"name\" IS NOT NULL AND LOWER(\"name\") LIKE $1 ESCAPE '!')", ["%50!%!_x\\y%"]);
    expectWhere("{name} contains 'A!b'", "(\"name\" IS NOT NULL AND LOWER(\"name\") LIKE $1 ESCAPE '!')", ["%a!!b%"]);
    expectWhere("{name} notcontains 'a'", "(\"name\" IS NULL OR NOT (LOWER(\"name\") LIKE $1 ESCAPE '!'))", ["%a%"]);
  });
  test("anyof and noneof are IN over the trimmed, lowered text", () => {
    expectWhere("{name} anyof ['A', 'b']", "(\"name\" IS NOT NULL AND LOWER(TRIM(\"name\")) IN ($1, $2))", ["a", "b"]);
    expectWhere("{name} noneof ['a']", "(\"name\" IS NULL OR NOT (LOWER(TRIM(\"name\")) IN ($1)))", ["a"]);
    expectWhere("{price} anyof [1, '2']", "(\"price\" IS NOT NULL AND \"price\" IN ($1, $2))", [1, 2]);
  });
  test("allof on a scalar field is a contains for every item, as ours", () => {
    expectWhere("{name} allof ['A']", "(\"name\" IS NOT NULL AND LOWER(\"name\") LIKE $1 ESCAPE '!')", ["%a%"]);
    expectWhere("{name} allof ['a', 'b']",
      "(\"name\" IS NOT NULL AND LOWER(\"name\") LIKE $1 ESCAPE '!' AND LOWER(\"name\") LIKE $2 ESCAPE '!')", ["%a%", "%b%"]);
  });
  test("empty and notempty test the text for '' and any other type for NULL only", () => {
    expectWhere("{name} empty", "(\"name\" IS NULL OR \"name\" = '')", []);
    expectWhere("{name} notempty", "(\"name\" IS NOT NULL AND \"name\" <> '')", []);
    expectWhere("{price} empty", "(\"price\" IS NULL)", []);
    expectWhere("{price} notempty", "(\"price\" IS NOT NULL)", []);
  });
  test("a value is coerced by the field type", () => {
    expectWhere("{price} > '10'", "(\"price\" IS NOT NULL AND \"price\" > $1)", [10]);
    expectWhere("{ok} = 'true'", "(\"ok\" IS NOT NULL AND \"ok\" = $1)", [true]);
    expectWhere("{ok} = 'False'", "(\"ok\" IS NOT NULL AND \"ok\" = $1)", [false]);
    expectWhere("{at} >= '2026-11-16'", "(\"at\" IS NOT NULL AND \"at\" >= $1)", ["2026-11-16"]);
    expectWhere("{name} = 10", "(\"name\" IS NOT NULL AND LOWER(TRIM(\"name\")) = $1)", ["10"]);
  });
  test("a value that is not of the field type is an error naming the field", () => {
    expect(() => sql("{price} = 'abc'")).toThrow("Cannot build the query: the value of \"price\" is not a number: abc");
    expect(() => sql({ field: "price", op: "equal", value: " " })).toThrow("the value of \"price\" is not a number");
    expect(() => sql("{ok} = 'yes'")).toThrow("the value of \"ok\" is not a boolean: yes");
    expect(() => sql("{at} = '2026-13-01'")).toThrow("the value of \"at\" is not a date: 2026-13-01");
    expect(() => sql("{at} = 'monday'")).toThrow("the value of \"at\" is not a date: monday");
  });
  test("ordering compares the text as is, >= and <= add our trimmed, case-insensitive equality", () => {
    expectWhere("{name} > 'B'", "(\"name\" IS NOT NULL AND \"name\" > $1)", ["B"]);
    expectWhere("{name} < 'B'", "(\"name\" IS NOT NULL AND \"name\" < $1)", ["B"]);
    expectWhere("{name} >= 'B '", "(\"name\" IS NOT NULL AND (LOWER(TRIM(\"name\")) = $1 OR \"name\" > $2))", ["b", "B "]);
    expectWhere("{name} <= 'B'", "(\"name\" IS NOT NULL AND (LOWER(TRIM(\"name\")) = $1 OR \"name\" < $2))", ["b", "B"]);
    expectWhere("{price} <= 5", "(\"price\" IS NOT NULL AND \"price\" <= $1)", [5]);
  });
  test("a date-only value against a datetime field means that whole day", () => {
    const opts = { fields: datetimeFields };
    expectWhere("{at} = '2026-11-16'", "(\"at\" IS NOT NULL AND \"at\" >= $1 AND \"at\" < $2)", ["2026-11-16", "2026-11-17"], opts);
    expectWhere("{at} <> '2026-11-16'", "(\"at\" IS NULL OR NOT (\"at\" >= $1 AND \"at\" < $2))", ["2026-11-16", "2026-11-17"], opts);
    expectWhere("{at} < '2026-11-16'", "(\"at\" IS NOT NULL AND \"at\" < $1)", ["2026-11-16"], opts);
    expectWhere("{at} <= '2026-11-16'", "(\"at\" IS NOT NULL AND \"at\" < $1)", ["2026-11-17"], opts);
    expectWhere("{at} > '2026-11-16'", "(\"at\" IS NOT NULL AND \"at\" >= $1)", ["2026-11-17"], opts);
    expectWhere("{at} >= '2026-11-16'", "(\"at\" IS NOT NULL AND \"at\" >= $1)", ["2026-11-16"], opts);
    expectWhere("{at} anyof ['2026-11-16', '2026-11-18']",
      "(\"at\" IS NOT NULL AND ((\"at\" >= $1 AND \"at\" < $2) OR (\"at\" >= $3 AND \"at\" < $4)))",
      ["2026-11-16", "2026-11-17", "2026-11-18", "2026-11-19"], opts);
  });
  test("the next day is counted on the calendar", () => {
    const opts = { fields: datetimeFields };
    expectWhere("{at} = '2026-12-31'", "(\"at\" IS NOT NULL AND \"at\" >= $1 AND \"at\" < $2)", ["2026-12-31", "2027-01-01"], opts);
    expectWhere("{at} = '2028-02-28'", "(\"at\" IS NOT NULL AND \"at\" >= $1 AND \"at\" < $2)", ["2028-02-28", "2028-02-29"], opts);
    expectWhere("{at} = '2026-03-29'", "(\"at\" IS NOT NULL AND \"at\" >= $1 AND \"at\" < $2)", ["2026-03-29", "2026-03-30"], opts);
  });
  test("a moment against a datetime field is one exact comparison", () => {
    expectWhere("{at} = '2026-11-16T10:00:00.000+02:00'", "(\"at\" IS NOT NULL AND \"at\" = $1)",
      ["2026-11-16T10:00:00.000+02:00"], { fields: datetimeFields });
  });
  test("contains on a number field goes through the text cast, and its value is never coerced", () => {
    expectWhere("{price} contains '1'", "(\"price\" IS NOT NULL AND LOWER(CAST(\"price\" AS TEXT)) LIKE $1 ESCAPE '!')", ["%1%"]);
    // the search of a Filter Control sends its text to every field
    expectWhere("{price} contains 'abc'", "(\"price\" IS NOT NULL AND LOWER(CAST(\"price\" AS TEXT)) LIKE $1 ESCAPE '!')", ["%abc%"]);
  });
  test("not, and, or keep their brackets", () => {
    expectWhere("!({name} = 'abc')", "NOT ((\"name\" IS NOT NULL AND LOWER(TRIM(\"name\")) = $1))", ["abc"]);
    expectWhere("{name} = 'a' and ({price} > 1 or {ok} = true)",
      "((\"name\" IS NOT NULL AND LOWER(TRIM(\"name\")) = $1) AND ((\"price\" IS NOT NULL AND \"price\" > $2) OR (\"ok\" IS NOT NULL AND \"ok\" = $3)))",
      ["a", 1, true]);
  });
  test("the shapes ours answers alike for every value are constants", () => {
    // notcontains '' is false for every scalar value
    expectWhere("{name} notcontains ''", "FALSE", []);
    expectWhere({ field: "name", op: "contains", value: "" }, "FALSE", []);
    expectWhere({ field: "name", op: "contains", value: 0 }, "FALSE", []);
    expectWhere({ field: "name", op: "allof", value: ["a", ""] }, "FALSE", []);
    expectWhere({ field: "name", op: "equal", value: "" }, "(\"name\" IS NULL OR \"name\" = '')", []);
    expectWhere({ field: "name", op: "notequal", value: "" }, "(\"name\" IS NOT NULL AND \"name\" <> '')", []);
    expectWhere({ and: [{ field: "price", op: "greater", value: 1 }, { field: "name", op: "contains", value: "" }] },
      "((\"price\" IS NOT NULL AND \"price\" > $1) AND FALSE)", [1]);
  });
  test("an array field needs render", () => {
    expect(() => sql("{tags} anyof ['x']")).toThrow("the field \"tags\" is an array: it needs render for anyof");
    expect(() => sql("{tags} empty")).toThrow("the field \"tags\" is an array: it needs render for empty");
  });
  test("render replaces the condition, its value() adds a parameter", () => {
    const tags: IQueryField = {
      type: "array", render: (c, value) => "tags && ARRAY[" + (<Array<any>>c.value).map(value).join(", ") + "]::text[]"
    };
    expectWhere("{price} > 1 and {tags} anyof ['x', 'Y']", "((\"price\" IS NOT NULL AND \"price\" > $1) AND (tags && ARRAY[$2, $3]::text[]))",
      [1, "x", "Y"], { fields: { ...fields, tags: tags } });
    const bad: IQueryField = { render: () => <any>{ a: 1 } };
    expect(() => sql("{name} = 'a'", { fields: { name: bad } })).toThrow("render of the field \"name\" did not return a text");
  });
});

describe("toSqlQuery: comparator options", () => {
  const saved = { ...settings.comparator };
  afterEach(() => {
    settings.comparator.caseSensitive = saved.caseSensitive;
    settings.comparator.trimStrings = saved.trimStrings;
  });
  test("case-sensitive, untrimmed: no LOWER, no TRIM, values as typed", () => {
    const opts = { comparator: { caseSensitive: true, trimStrings: false } };
    expectWhere("{name} = 'Abc '", "(\"name\" IS NOT NULL AND \"name\" = $1)", ["Abc "], opts);
    expectWhere("{name} contains 'AbC'", "(\"name\" IS NOT NULL AND \"name\" LIKE $1 ESCAPE '!')", ["%AbC%"], opts);
    expectWhere("{name} anyof ['A ']", "(\"name\" IS NOT NULL AND \"name\" IN ($1))", ["A "], opts);
    expectWhere("{name} >= 'B'", "(\"name\" IS NOT NULL AND \"name\" >= $1)", ["B"], opts);
  });
  test("the default follows settings.comparator, key by key", () => {
    settings.comparator.caseSensitive = true;
    expectWhere("{name} = 'Abc '", "(\"name\" IS NOT NULL AND TRIM(\"name\") = $1)", ["Abc"]);
    expectWhere("{name} = 'Abc '", "(\"name\" IS NOT NULL AND LOWER(\"name\") = $1)", ["abc "], { comparator: { caseSensitive: false, trimStrings: false } });
    settings.comparator.trimStrings = false;
    expectWhere("{name} = 'Abc '", "(\"name\" IS NOT NULL AND LOWER(\"name\") = $1)", ["abc "], { comparator: { caseSensitive: false } });
  });
});

describe("toSqlQuery: dialects", () => {
  const request = { filter: "{name} = 'a' and {ok} = true", sort: [{ field: "price", direction: "desc" }], skip: 20, take: 10 };
  const run = (dialect: any, req: any = request, extra?: Partial<ISqlQueryOptions>): ISqlQuery =>
    toSqlQuery(req, { dialect: dialect, fields: fields, ...extra });
  test("postgres", () => {
    expect(run("postgres")).toEqual({
      where: "((\"name\" IS NOT NULL AND LOWER(TRIM(\"name\")) = $1) AND (\"ok\" IS NOT NULL AND \"ok\" = $2))",
      orderBy: "\"price\" DESC", range: "LIMIT 10 OFFSET 20", params: ["a", true]
    });
    expect(run(undefined)).toEqual(run("postgres"));
  });
  test("mysql", () => {
    expect(run("mysql")).toEqual({
      where: "((`name` IS NOT NULL AND LOWER(TRIM(`name`)) = ?) AND (`ok` IS NOT NULL AND `ok` = ?))",
      orderBy: "`price` DESC", range: "LIMIT 10 OFFSET 20", params: ["a", true]
    });
  });
  test("sqlite: a boolean is the number 1 or 0", () => {
    expect(run("sqlite")).toEqual({
      where: "((\"name\" IS NOT NULL AND LOWER(TRIM(\"name\")) = ?) AND (\"ok\" IS NOT NULL AND \"ok\" = ?))",
      orderBy: "\"price\" DESC", range: "LIMIT 10 OFFSET 20", params: ["a", 1]
    });
  });
  test("mssql: 0-based named parameters, brackets, OFFSET FETCH, [ escaped in LIKE", () => {
    expect(run("mssql")).toEqual({
      where: "(([name] IS NOT NULL AND LOWER(TRIM([name])) = @p0) AND ([ok] IS NOT NULL AND [ok] = @p1))",
      orderBy: "[price] DESC", range: "OFFSET 20 ROWS FETCH NEXT 10 ROWS ONLY", params: ["a", true]
    });
    expect(run("mssql", { filter: "{name} contains '[a]%'" })).toEqual({
      where: "([name] IS NOT NULL AND LOWER([name]) LIKE @p0 ESCAPE '!')", orderBy: "", range: "", params: ["%![a]!%%"]
    });
    expect(run("mssql", { filter: "{price} contains '1'" }).where).toBe("([price] IS NOT NULL AND LOWER(CAST([price] AS NVARCHAR(100))) LIKE @p0 ESCAPE '!')");
  });
  test("oracle: the text null test reads the trimmed text, empty is NULL, a boolean is 1 or 0", () => {
    expect(run("oracle")).toEqual({
      where: "((LOWER(TRIM(\"name\")) IS NOT NULL AND LOWER(TRIM(\"name\")) = :1) AND (\"ok\" IS NOT NULL AND \"ok\" = :2))",
      orderBy: "\"price\" DESC", range: "OFFSET 20 ROWS FETCH NEXT 10 ROWS ONLY", params: ["a", 1]
    });
    expect(run("oracle", { filter: "{name} empty" }).where).toBe("(\"name\" IS NULL)");
    expect(run("oracle", { filter: "{name} notempty" }).where).toBe("(\"name\" IS NOT NULL)");
    expect(run("oracle", { filter: "{name} noneof ['a']" }).where).toBe("(LOWER(TRIM(\"name\")) IS NULL OR NOT (LOWER(TRIM(\"name\")) IN (:1)))");
    expect(run("oracle", { filter: "{price} contains '1'" }).where).toBe("(\"price\" IS NOT NULL AND LOWER(TO_CHAR(\"price\")) LIKE :1 ESCAPE '!')");
  });
  test("a constant filter is the dialect's true or false", () => {
    const where = (dialect: string, val: boolean): string => run(dialect, { filter: { const: val } }).where;
    expect(["postgres", "mysql", "sqlite", "mssql", "oracle"].map(d => where(d, true))).toEqual(["TRUE", "TRUE", "1=1", "1=1", "1=1"]);
    expect(["postgres", "mysql", "sqlite", "mssql", "oracle"].map(d => where(d, false))).toEqual(["FALSE", "FALSE", "1=0", "1=0", "1=0"]);
    expect(run("postgres", { filter: "false" }).where).toBe("FALSE");
  });
  test("the range of every dialect: take 0 is every record from skip", () => {
    const range = (dialect: string, skip: number, take: number): string => run(dialect, { skip: skip, take: take, sort: [{ field: "id" }] }).range;
    expect(range("postgres", 20, 0)).toBe("OFFSET 20");
    expect(range("mysql", 20, 0)).toBe("LIMIT 18446744073709551615 OFFSET 20");
    expect(range("sqlite", 20, 0)).toBe("LIMIT -1 OFFSET 20");
    expect(range("mssql", 20, 0)).toBe("OFFSET 20 ROWS");
    expect(range("oracle", 20, 0)).toBe("OFFSET 20 ROWS");
    expect(range("postgres", 0, 10)).toBe("LIMIT 10");
    expect(range("mysql", 0, 10)).toBe("LIMIT 10");
    expect(range("mssql", 0, 10)).toBe("OFFSET 0 ROWS FETCH NEXT 10 ROWS ONLY");
    expect(["postgres", "mysql", "sqlite", "mssql", "oracle"].map(d => range(d, 0, 0))).toEqual(["", "", "", "", ""]);
  });
  test("mssql needs an ORDER BY for a range, oracle does not", () => {
    expect(run("mssql", { take: 10 })).toEqual({ where: "", orderBy: "(SELECT NULL)", range: "OFFSET 0 ROWS FETCH NEXT 10 ROWS ONLY", params: [] });
    expect(run("mssql", {})).toEqual({ where: "", orderBy: "", range: "", params: [] });
    expect(run("oracle", { take: 10 })).toEqual({ where: "", orderBy: "", range: "OFFSET 0 ROWS FETCH NEXT 10 ROWS ONLY", params: [] });
  });
  test("placeholder and quote replace the dialect's", () => {
    const res = run("mssql", { filter: "{name} = 'a' and {price} > 1", sort: [{ field: "name" }] },
      { placeholder: (i: number) => ":p" + i, quote: (name: string) => "<" + name + ">" });
    expect(res).toEqual({
      where: "((<name> IS NOT NULL AND LOWER(TRIM(<name>)) = :p0) AND (<price> IS NOT NULL AND <price> > :p1))",
      orderBy: "<name> ASC", range: "", params: ["a", 1]
    });
  });
  test("an unknown dialect is an error", () => {
    expect(() => run("db2")).toThrow("Cannot build the query: unknown dialect: db2");
  });
});

describe("toSqlQuery: the field list and the request are checked", () => {
  test("an unknown or a non-filterable field in the filter", () => {
    expect(() => sql("{nope} = 1")).toThrow("Cannot build the query: the field \"nope\" is not in the field list");
    expect(() => sql("{toString} = 1")).toThrow("the field \"toString\" is not in the field list");
    expect(() => sql("{name} = 'a'", { fields: { name: { filterable: false } } })).toThrow("the field \"name\" is not filterable");
  });
  test("an unknown or a non-sortable field in the sort, a bad direction", () => {
    expect(() => sql("", {}, { sort: [{ field: "nope" }] })).toThrow("the field \"nope\" is not in the field list");
    expect(() => sql("", { fields: { name: { sortable: false } } }, { sort: [{ field: "name" }] })).toThrow("the field \"name\" is not sortable");
    expect(() => sql("", {}, { sort: [{ field: "name", direction: "up" }] }))
      .toThrow("the sort direction of \"name\" is not \"asc\" or \"desc\": up");
    expect(() => sql("", {}, { sort: "name" })).toThrow("sort is not an array");
  });
  test("skip and take are non-negative integers", () => {
    expect(() => sql("", {}, { skip: -1 })).toThrow("Cannot build the query: skip is not a non-negative integer: -1");
    expect(() => sql("", {}, { take: 1.5 })).toThrow("take is not a non-negative integer: 1.5");
    expect(() => sql("", {}, { take: "10" })).toThrow("take is not a non-negative integer: 10");
    expect(toSqlQuery({}, { fields: fields })).toEqual({ where: "", orderBy: "", range: "", params: [] });
  });
  test("a text that does not convert is the tree builder's error", () => {
    expect(() => sql("{price} + 1 > 2")).toThrow("Cannot convert the filter: arithmetic");
  });
  test("column is used as is", () => {
    expectWhere("{name} = 'a'", "(c.category_name IS NOT NULL AND LOWER(TRIM(c.category_name)) = $1)", ["a"],
      { fields: { name: { column: "c.category_name" } } });
  });
  test("a field name with the quote character in it has the quote doubled", () => {
    const one = (name: string, dialect: any): string => toSqlQuery({ sort: [{ field: name }] }, { dialect: dialect, fields: { [name]: {} } }).orderBy;
    expect(one("na\"me", "postgres")).toBe("\"na\"\"me\" ASC");
    expect(one("na]me", "mssql")).toBe("[na]]me] ASC");
    expect(one("na`me", "mysql")).toBe("`na``me` ASC");
    expect(sql("{na\"me} empty", { fields: { "na\"me": {} } }).where).toBe("(\"na\"\"me\" IS NULL OR \"na\"\"me\" = '')");
  });
  test("defaultSort breaks ties without repeating a field", () => {
    const res = sql("", { defaultSort: [{ field: "price" }, { field: "id" }] }, { sort: [{ field: "price", direction: "desc" }] });
    expect(res).toEqual({ where: "", orderBy: "\"price\" DESC, \"id\" ASC", range: "", params: [] });
  });
});

describe("toSqlQuery: a tree as the filter", () => {
  test("a tree gives the same query as its text", () => {
    const text = "({name} contains 'x' or {price} >= 10) and !({ok} = true)";
    const tree: FilterTreeNode = {
      and: [
        { or: [{ field: "name", op: "contains", value: "x" }, { field: "price", op: "greaterorequal", value: 10 }] },
        { not: { field: "ok", op: "equal", value: true } }
      ]
    };
    expect(sql(tree)).toEqual(sql(text));
  });
  test("what the schema accepts and the tree builder never builds still renders", () => {
    expectWhere({ and: [{ and: [{ const: true }, { field: "price", op: "less", value: 2 }] }, { not: { not: { field: "price", op: "empty" } } }] },
      "((TRUE AND (\"price\" IS NOT NULL AND \"price\" < $1)) AND NOT (NOT ((\"price\" IS NULL))))", [2]);
  });
  test("a node that is not of the schema is an error naming it", () => {
    const bad = (tree: any, text: string): void => {
      expect(() => sql(tree)).toThrow("Cannot build the query: not a filter tree node: " + text);
    };
    bad({ and: [{ field: "name", op: "empty" }] }, "{\"and\":[{\"field\":\"name\",\"op\":\"empty\"}]}");
    bad({ or: [{ const: true }, { field: "name", op: "eq", value: 1 }] }, "{\"field\":\"name\",\"op\":\"eq\",\"value\":1}");
    bad({ or: "x" }, "{\"or\":\"x\"}");
    bad({ field: "name", op: "equal", value: "a", extra: 1 }, "{\"field\":\"name\",\"op\":\"equal\",\"value\":\"a\",\"extra\":1}");
    bad({ field: "name", op: "empty", value: "a" }, "{\"field\":\"name\",\"op\":\"empty\",\"value\":\"a\"}");
    bad({ field: "name", op: "anyof", value: [] }, "{\"field\":\"name\",\"op\":\"anyof\",\"value\":[]}");
    bad({ field: "name", op: "anyof", value: [["a"]] }, "{\"field\":\"name\",\"op\":\"anyof\",\"value\":[[\"a\"]]}");
    bad({ field: "name", op: "equal", value: null }, "{\"field\":\"name\",\"op\":\"equal\",\"value\":null}");
    bad({ field: "", op: "empty" }, "{\"field\":\"\",\"op\":\"empty\"}");
    bad({ not: { field: "name", op: "equal" } }, "{\"field\":\"name\",\"op\":\"equal\"}");
    bad({ const: "true" }, "{\"const\":\"true\"}");
    bad({ and: [{ const: true }, { const: false }], or: [] }, "{\"and\":[{\"const\":true},{\"const\":false}],\"or\":[]}");
    bad([], "[]");
  });
});

describe("toSqlQuery: no value reaches the text", () => {
  test("hostile values are parameters only", () => {
    const hostile = ["'; DROP TABLE t; --", "a\"b]", "x' OR '1'='1"];
    const tree: FilterTreeNode = {
      or: [
        { field: "name", op: "equal", value: hostile[0] },
        { field: "name", op: "contains", value: hostile[1] },
        { field: "name", op: "anyof", value: [hostile[2]] },
        { field: "price", op: "equal", value: 987654321 }
      ]
    };
    ["postgres", "mysql", "sqlite", "mssql", "oracle"].forEach((dialect: any) => {
      const res = sql(tree, { dialect: dialect });
      expect(res.params.length).toBe(4);
      expect(res.where.indexOf("DROP")).toBe(-1);
      expect(res.where.indexOf("a\"b")).toBe(-1);
      expect(res.where.indexOf("987654321")).toBe(-1);
      expect(res.params[3]).toBe(987654321);
    });
  });
});

// node:sqlite is built into Node 22.13+ (22.5 behind a flag). Vite strips the "node:" prefix of an import,
// so it is loaded through process.getBuiltinModule.
function loadSqlite(): any {
  try {
    const proc: any = (<any>globalThis).process;
    return proc && proc.getBuiltinModule ? proc.getBuiltinModule("node:sqlite") : undefined;
  } catch{
    return undefined;
  }
}
const sqlite = loadSqlite();

describe.skipIf(!sqlite)("toSqlQuery: the records SQLite returns are the records the local filter keeps", () => {
  // the text column s is the field f, the INTEGER column n the field g (a REAL column would cast 10 to "10.0")
  const texts = [null, "", "  ", "abc", "ABC", " abc ", "xabcx", "a%b", "a_b", "10", "abcd", "d abc", "C", "c "];
  const numbers = [null, 0, 10, 5, 15, -1, 100, 10, null, 1, 2, 3, 50, 4];
  const queryFields: { [name: string]: IQueryField } = { f: { column: "s" }, g: { type: "number", column: "n" } };
  const textExpressions = [
    "{f} = 'abc'", "{f} <> 'abc'", "{f} contains 'abc'", "{f} notcontains 'abc'", "{f} anyof ['abc']", "{f} noneof ['abc']",
    "{f} allof ['abc', 'd']", "{f} allof ['abc']", "{f} = 10", "{f} = '10'", "{f} <> 10", "{f} empty", "{f} notempty",
    "{f} contains '%'", "{f} contains '_'", "{f} notcontains ''", "{f} > 'b'", "{f} >= 'abc'", "{f} < 'b'", "{f} <= 'abc'",
    "{f} anyof ['abc', 'c']", "{f} = 'abc' or {f} empty",
    "{f} > 5", "{f} < 5"
  ];
  // Documented differences, each excluded by name
  const excluded = [
    // ours reads the record's numeric text "10" as the number 10, and 10 < 'b' is false; as texts "10" < "b"
    "{f} < 'b'",
    // the same record: 10 <= 'abc' is false for ours, "10" < "abc" as texts
    "{f} <= 'abc'",
    // the same reading: 10 > 5 for ours, while the texts "10" < "5"
    "{f} > 5",
    // ours: "" < 5 and "  " < 5 by JS coercion; a text column compares texts
    "{f} < 5"
  ];
  const numberExpressions = [
    "{g} = 10", "{g} = '10'", "{g} <> 10", "{g} > 5", "{g} < 5", "{g} >= 10", "{g} <= 10", "{g} empty", "{g} notempty",
    "{g} contains '1'", "{g} notcontains '1'", "{g} anyof [10, 5]", "{g} noneof [10]", "{g} contains '0'"
  ];
  let db: any;
  const sqliteIds = (expression: string): Array<number> => {
    const q = toSqlQuery({ filter: expression }, { dialect: "sqlite", fields: queryFields });
    const rows = db.prepare("SELECT id FROM t" + (q.where ? " WHERE " + q.where : "") + " ORDER BY id").all(...q.params);
    return rows.map((row: any) => row.id);
  };
  const localIds = (expression: string, column: "f" | "g"): Array<number> => {
    const runner = new ConditionRunner(expression);
    const values = column === "f" ? texts : numbers;
    return values.map((val, i) => runner.runValues({ [column]: val }) ? i : -1).filter(id => id > -1);
  };
  const run = (list: Array<string>, column: "f" | "g"): number => {
    db = new sqlite.DatabaseSync(":memory:");
    db.exec("CREATE TABLE t (id INTEGER PRIMARY KEY, s TEXT, n INTEGER)");
    const insert = db.prepare("INSERT INTO t (id, s, n) VALUES (?, ?, ?)");
    texts.forEach((text, i) => insert.run(i, text, numbers[i]));
    let count = 0;
    list.filter(expr => excluded.indexOf(expr) < 0).forEach(expr => {
      [expr, "!(" + expr + ")"].forEach(item => {
        expect(sqliteIds(item), item).toEqual(localIds(item, column));
        count++;
      });
    });
    db.close();
    return count;
  };
  test("text column", () => {
    expect(run(textExpressions, "f")).toBe((textExpressions.length - excluded.length) * 2);
  });
  test("number column", () => {
    expect(run(numberExpressions, "g")).toBe(numberExpressions.length * 2);
  });
});
