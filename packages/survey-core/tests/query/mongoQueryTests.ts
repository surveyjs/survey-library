import { describe, test, expect, afterEach } from "vitest";
import { settings } from "survey-core";
import type { FilterTreeNode } from "survey-core";
import { toMongoQuery, toSqlQuery, IMongoQuery, IQueryOptions, IQueryField } from "survey-core/query";

const fields: { [name: string]: IQueryField } = {
  name: {}, price: { type: "number" }, ok: { type: "boolean" }, at: { type: "date" }, tags: { type: "array" }, id: { type: "number" }
};
const datetimeFields: { [name: string]: IQueryField } = { at: { type: "datetime" } };
const day = (y: number, m: number, d: number): Date => new Date(Date.UTC(y, m - 1, d));

function mongo(filter: string | FilterTreeNode, options?: Partial<IQueryOptions>, request?: any): IMongoQuery {
  return toMongoQuery({ filter: filter, ...request }, { fields: fields, ...options });
}
function expectFilter(filter: string | FilterTreeNode, expected: any, options?: Partial<IQueryOptions>): void {
  expect(mongo(filter, options)).toEqual({ filter: expected, sort: {}, skip: 0, limit: 0 });
}
const ci = (pattern: string): any => ({ $regex: pattern, $options: "i" });

describe("toMongoQuery: every condition shape", () => {
  test("equal is an anchored, escaped regex: trimmed by \\s*, case by i", () => {
    expectFilter("{name} = 'Abc '", { name: ci("^\\s*Abc\\s*\\z") });
    expectFilter("{name} = 'a.b'", { name: ci("^\\s*a\\.b\\s*\\z") });
    expectFilter("{name} = ' '", { name: ci("^\\s*\\s*\\z") });
    expectFilter("{name} <> 'abc'", { $nor: [{ name: ci("^\\s*abc\\s*\\z") }] });
  });
  test("contains is an unanchored escaped regex", () => {
    expectFilter("{name} contains 'a.b*'", { name: ci("a\\.b\\*") });
    expectFilter({ field: "name", op: "contains", value: " ^(x|y)[0-9]{2}$?+\\" },
      { name: ci(" \\^\\(x\\|y\\)\\[0-9\\]\\{2\\}\\$\\?\\+\\\\") });
    expectFilter("{name} notcontains 'a'", { $nor: [{ name: ci("a") }] });
  });
  test("an escaped value matches its own text and nothing a metacharacter would add", () => {
    // RegExp stands in for PCRE: these escapes mean the same in both
    ["a.b", "(x|y)", "[0-9]+", "^$", "a\\b", "{2}", "?*", "a\u0000b"].forEach(text => {
      const pattern = mongo({ field: "name", op: "contains", value: text }).filter.name.$regex;
      expect(new RegExp(pattern).test("<" + text + ">"), text).toBe(true);
      expect(new RegExp(pattern).test(text.replace(/[^a-z0-9]/g, "")), text).toBe(false);
    });
  });
  test("a NUL in a value is escaped, MongoDB refuses it inside a pattern", () => {
    expectFilter({ field: "name", op: "contains", value: "a\u0000b" }, { name: ci("a\\x00b") });
  });
  test("anyof and noneof on a text field are the equal regexes in $or and $nor", () => {
    expectFilter("{name} anyof ['A', 'b']", { $or: [{ name: ci("^\\s*A\\s*\\z") }, { name: ci("^\\s*b\\s*\\z") }] });
    expectFilter("{name} anyof ['a']", { name: ci("^\\s*a\\s*\\z") });
    expectFilter("{name} noneof ['a', 'b']", { $nor: [{ name: ci("^\\s*a\\s*\\z") }, { name: ci("^\\s*b\\s*\\z") }] });
    expectFilter("{price} anyof [1, '2']", { price: { $in: [1, 2] } });
    expectFilter("{price} noneof [1]", { $nor: [{ price: { $in: [1] } }] });
  });
  test("allof on a scalar field is a contains for every item, as ours", () => {
    expectFilter("{name} allof ['A']", { name: ci("A") });
    expectFilter("{name} allof ['a', 'b']", { $and: [{ name: ci("a") }, { name: ci("b") }] });
  });
  test("empty and notempty test the text for '' and any other type for null only", () => {
    expectFilter("{name} empty", { $or: [{ name: null }, { name: "" }] });
    expectFilter("{name} notempty", { $nor: [{ name: null }, { name: "" }] });
    expectFilter("{price} empty", { price: null });
    expectFilter("{price} notempty", { price: { $ne: null } });
  });
  test("a value is coerced by the field type, dates become Date objects at UTC midnight", () => {
    expectFilter("{price} > '10'", { price: { $gt: 10 } });
    expectFilter("{price} = 10", { price: 10 });
    expectFilter("{ok} = 'true'", { ok: true });
    expectFilter("{ok} = 'False'", { ok: false });
    expectFilter("{at} >= '2026-11-16'", { at: { $gte: day(2026, 11, 16) } });
    expectFilter("{at} = '2026-11-16'", { at: day(2026, 11, 16) });
    expectFilter("{at} anyof ['2026-11-16', '2026-11-18']", { at: { $in: [day(2026, 11, 16), day(2026, 11, 18)] } });
    expectFilter("{name} = 10", { name: ci("^\\s*10\\s*\\z") });
  });
  test("a moment is the exact Date", () => {
    expectFilter("{at} < '2026-11-16T10:30:00+02:00'", { at: { $lt: new Date(Date.UTC(2026, 10, 16, 8, 30)) } }, { fields: datetimeFields });
    expectFilter("{at} = '2026-11-16T10:30Z'", { at: new Date(Date.UTC(2026, 10, 16, 10, 30)) }, { fields: datetimeFields });
  });
  test("a value that is not of the field type is an error naming the field", () => {
    expect(() => mongo("{price} = 'abc'")).toThrow("Cannot build the query: the value of \"price\" is not a number: abc");
    expect(() => mongo("{ok} = 'yes'")).toThrow("the value of \"ok\" is not a boolean: yes");
    expect(() => mongo("{at} = 'monday'")).toThrow("the value of \"at\" is not a date: monday");
  });
  test("ordering compares the text as is, >= and <= add our trimmed, case-insensitive equality", () => {
    expectFilter("{name} > 'B'", { name: { $gt: "B" } });
    expectFilter("{name} < 'B'", { name: { $lt: "B" } });
    expectFilter("{name} >= 'B '", { $or: [{ name: ci("^\\s*B\\s*\\z") }, { name: { $gt: "B " } }] });
    expectFilter("{name} <= 'B'", { $or: [{ name: ci("^\\s*B\\s*\\z") }, { name: { $lt: "B" } }] });
    expectFilter("{price} <= 5", { price: { $lte: 5 } });
    expectFilter("{price} >= 5", { price: { $gte: 5 } });
  });
  test("a date-only value against a datetime field means that whole day, from UTC midnight", () => {
    const opts = { fields: datetimeFields };
    const d16 = day(2026, 11, 16), d17 = day(2026, 11, 17);
    expectFilter("{at} = '2026-11-16'", { at: { $gte: d16, $lt: d17 } }, opts);
    expectFilter("{at} <> '2026-11-16'", { $nor: [{ at: { $gte: d16, $lt: d17 } }] }, opts);
    expectFilter("{at} < '2026-11-16'", { at: { $lt: d16 } }, opts);
    expectFilter("{at} <= '2026-11-16'", { at: { $lt: d17 } }, opts);
    expectFilter("{at} > '2026-11-16'", { at: { $gte: d17 } }, opts);
    expectFilter("{at} >= '2026-11-16'", { at: { $gte: d16 } }, opts);
    expectFilter("{at} anyof ['2026-11-16', '2026-12-31']",
      { $or: [{ at: { $gte: d16, $lt: d17 } }, { at: { $gte: day(2026, 12, 31), $lt: day(2027, 1, 1) } }] }, opts);
    expectFilter("{at} noneof ['2026-11-16']", { $nor: [{ at: { $gte: d16, $lt: d17 } }] }, opts);
  });
  test("contains on a number, boolean or date field matches its text through $convert", () => {
    const expr = (path: string, regex: string): any => ({ $expr: { $regexMatch: {
      input: { $convert: { input: path, to: "string", onError: "", onNull: "" } }, regex: regex, options: "i"
    } } });
    expectFilter("{price} contains '1'", expr("$price", "1"));
    expectFilter("{price} contains 1.5", expr("$price", "1\\.5"));
    expectFilter("{ok} contains 'tru'", expr("$ok", "tru"));
    expectFilter("{at} contains '2026-11'", expr("$at", "2026-11"));
    expectFilter("{price} notcontains '1'", { $nor: [expr("$price", "1")] });
    expectFilter("{price} allof ['1', '2']", { $and: [expr("$price", "1"), expr("$price", "2")] });
  });
  test("not is $nor, and and or keep every item", () => {
    expectFilter("!({price} > 5)", { $nor: [{ price: { $gt: 5 } }] });
    expectFilter("{price} > 5 and {price} < 10", { $and: [{ price: { $gt: 5 } }, { price: { $lt: 10 } }] });
    expectFilter("{price} = 1 or !({name} empty and {ok} = true)", { $or: [{ price: 1 },
      { $nor: [{ $and: [{ $or: [{ name: null }, { name: "" }] }, { ok: true }] }] }] });
  });
  test("the shapes ours answers alike for every value are constants", () => {
    expectFilter("{name} contains ''", { $expr: false });
    expectFilter("{name} notcontains ''", { $expr: false });
    expectFilter({ field: "price", op: "contains", value: 0 }, { $expr: false });
    expectFilter({ field: "name", op: "allof", value: ["a", ""] }, { $expr: false });
    expectFilter({ field: "name", op: "equal", value: "" }, { $or: [{ name: null }, { name: "" }] });
    expectFilter({ field: "name", op: "notequal", value: "" }, { $nor: [{ name: null }, { name: "" }] });
    expectFilter({ or: [{ field: "price", op: "contains", value: 0 }, { field: "price", op: "equal", value: 1 }] },
      { $or: [{ $expr: false }, { price: 1 }] });
  });
  test("render replaces the condition, value() returns the value, the object is used as is", () => {
    const search = { $text: { $search: "x" } };
    const opts = { fields: { ...fields, name: { render: (cond: any, value: (v: any) => any) => ({ $text: { $search: value(cond.value) } }) } } };
    expectFilter("{name} contains 'x'", search, opts);
    expectFilter("!({name} = 'x')", { $nor: [search] }, opts);
    const bad = { fields: { name: { render: (): any => "name = 'x'" } } };
    expect(() => mongo("{name} = 'x'", bad)).toThrow("Cannot build the query: render of the field \"name\" did not return an object");
    const arr = { fields: { name: { render: (): any => [] } } };
    expect(() => mongo("{name} = 'x'", arr)).toThrow("did not return an object");
  });
});

describe("toMongoQuery: an array field is read natively, element by element", () => {
  test("contains, anyof and allof look for an element equal to the item", () => {
    expectFilter("{tags} contains 'X '", { tags: ci("^\\s*X\\s*\\z") });
    expectFilter("{tags} anyof ['x', 'y']", { $or: [{ tags: ci("^\\s*x\\s*\\z") }, { tags: ci("^\\s*y\\s*\\z") }] });
    expectFilter("{tags} allof ['x', 'y']", { $and: [{ tags: ci("^\\s*x\\s*\\z") }, { tags: ci("^\\s*y\\s*\\z") }] });
  });
  test("notcontains and noneof are their $nor", () => {
    expectFilter("{tags} notcontains 'x'", { $nor: [{ tags: ci("^\\s*x\\s*\\z") }] });
    expectFilter("{tags} noneof ['x', 'y']", { $nor: [{ tags: ci("^\\s*x\\s*\\z") }, { tags: ci("^\\s*y\\s*\\z") }] });
  });
  test("a number item also finds its text and a numeric text its number, as our comparator", () => {
    expectFilter("{tags} contains 1", { $or: [{ tags: 1 }, { tags: ci("^\\s*1\\s*\\z") }] });
    expectFilter("{tags} anyof ['2']", { $or: [{ tags: ci("^\\s*2\\s*\\z") }, { tags: 2 }] });
    expectFilter({ field: "tags", op: "contains", value: true }, { $or: [{ tags: true }, { tags: ci("^\\s*true\\s*\\z") }] });
  });
  test("the scalar folds do not apply: a falsy item is looked for", () => {
    expectFilter({ field: "tags", op: "contains", value: 0 }, { $or: [{ tags: 0 }, { tags: ci("^\\s*0\\s*\\z") }] });
    expectFilter({ field: "tags", op: "allof", value: ["a", ""] }, { $and: [{ tags: ci("^\\s*a\\s*\\z") }, { tags: ci("^\\s*\\s*\\z") }] });
    // ours: false for a missing field and for an empty or a null element, true for []
    expectFilter("{tags} notcontains ''", { $and: [{ tags: { $ne: null } }, { $nor: [{ tags: ci("^\\s*\\s*\\z") }] }] });
    // contains '' stays false, as toFilterTree builds it from the text
    expectFilter({ field: "tags", op: "contains", value: "" }, { $expr: false });
  });
  test("empty is null or an empty array", () => {
    expectFilter("{tags} empty", { $or: [{ tags: null }, { tags: { $size: 0 } }] });
    expectFilter("{tags} notempty", { $nor: [{ tags: null }, { tags: { $size: 0 } }] });
  });
  test("without the comparator's changes the items are $in and $all", () => {
    const opts = { comparator: { caseSensitive: true, trimStrings: false } };
    expectFilter("{tags} anyof ['x', 'y']", { tags: { $in: ["x", "y"] } }, opts);
    expectFilter("{tags} noneof ['x', 1]", { $nor: [{ tags: { $in: ["x", 1, "1"] } }] }, opts);
    expectFilter("{tags} allof ['x', 'y']", { tags: { $all: ["x", "y"] } }, opts);
    expectFilter("{tags} allof ['x', 1]", { $and: [{ tags: "x" }, { $or: [{ tags: 1 }, { tags: "1" }] }] }, opts);
  });
  test("equal and ordering on an array field need render", () => {
    expect(() => mongo("{tags} = 'x'")).toThrow("Cannot build the query: the field \"tags\" is an array: it needs render for equal");
    expect(() => mongo("{tags} > 'x'")).toThrow("the field \"tags\" is an array: it needs render for greater");
    expectFilter({ field: "tags", op: "equal", value: "" }, { $or: [{ tags: null }, { tags: { $size: 0 } }] });
  });
  test("SQL still needs render for an array field", () => {
    expect(() => toSqlQuery({ filter: "{tags} contains 'x'" }, { fields: fields })).toThrow("it needs render for contains");
  });
});

describe("toMongoQuery: comparator options", () => {
  afterEach(() => {
    settings.comparator.caseSensitive = false;
    settings.comparator.trimStrings = true;
  });
  test("case-sensitive drops i, untrimmed drops \\s*, both: the value as is", () => {
    expectFilter("{name} = 'Abc '", { name: { $regex: "^\\s*Abc\\s*\\z" } }, { comparator: { caseSensitive: true } });
    expectFilter("{name} = 'Abc '", { name: ci("^Abc \\z") }, { comparator: { trimStrings: false } });
    const plain = { comparator: { caseSensitive: true, trimStrings: false } };
    expectFilter("{name} = 'Abc '", { name: "Abc " }, plain);
    expectFilter("{name} anyof ['a', 'b']", { name: { $in: ["a", "b"] } }, plain);
    expectFilter("{name} >= 'B'", { name: { $gte: "B" } }, plain);
    expectFilter("{name} contains 'A'", { name: { $regex: "A" } }, plain);
    expectFilter("{price} contains '1'", { $expr: { $regexMatch: {
      input: { $convert: { input: "$price", to: "string", onError: "", onNull: "" } }, regex: "1"
    } } }, plain);
  });
  test("the default follows settings.comparator, key by key", () => {
    settings.comparator.caseSensitive = true;
    expectFilter("{name} = 'a'", { name: { $regex: "^\\s*a\\s*\\z" } });
    expectFilter("{name} = 'a'", { name: ci("^\\s*a\\s*\\z") }, { comparator: { caseSensitive: false } });
  });
});

describe("toMongoQuery: the sort, the range and the request", () => {
  test("sort is the document path in sort order, the tie-breaker last, a field once", () => {
    const res = toMongoQuery({ sort: [{ field: "price", direction: "desc" }, { field: "name" }] },
      { fields: fields, defaultSort: [{ field: "id" }, { field: "price" }] });
    expect(res).toEqual({ filter: {}, sort: { price: -1, name: 1, id: 1 }, skip: 0, limit: 0 });
    expect(Object.keys(res.sort)).toEqual(["price", "name", "id"]);
  });
  test("column is the document path, in the filter, in $expr and in the sort", () => {
    const opts = { fields: { name: { column: "customer.name" }, price: { type: <const>"number", column: "total.amount" } } };
    expect(toMongoQuery({ filter: "{name} = 'a' and {price} contains '1'", sort: [{ field: "price" }] }, opts)).toEqual({
      filter: { $and: [{ "customer.name": ci("^\\s*a\\s*\\z") }, { $expr: { $regexMatch: {
        input: { $convert: { input: "$total.amount", to: "string", onError: "", onNull: "" } }, regex: "1", options: "i"
      } } }] },
      sort: { "total.amount": 1 }, skip: 0, limit: 0
    });
  });
  test("two fields on one path sort once, by the first", () => {
    const opts = { fields: { a: { column: "x" }, b: { column: "x" } }, defaultSort: [{ field: "b", direction: <const>"desc" }] };
    expect(toMongoQuery({ sort: [{ field: "a" }] }, opts).sort).toEqual({ x: 1 });
  });
  test("skip and take are skip and limit, take 0 is no limit", () => {
    expect(toMongoQuery({ skip: 20, take: 10 }, { fields: fields })).toEqual({ filter: {}, sort: {}, skip: 20, limit: 10 });
    expect(toMongoQuery({ skip: 20 }, { fields: fields })).toEqual({ filter: {}, sort: {}, skip: 20, limit: 0 });
    expect(() => toMongoQuery({ take: <any>"10" }, { fields: fields })).toThrow("take is not a non-negative integer: 10");
  });
  test("a filter that is the constant true or false", () => {
    expectFilter("1 = 1", {});
    expectFilter("1 = 2", { $expr: false });
    expectFilter({ const: true }, {});
    expect(toMongoQuery({ filter: null }, { fields: fields }).filter).toEqual({});
    expect(toMongoQuery({}, { fields: fields }).filter).toEqual({});
  });
  test("a constant inside a tree a client sent renders in place", () => {
    expectFilter({ and: [{ const: true }, { field: "price", op: "equal", value: 1 }] }, { $and: [{}, { price: 1 }] });
    expectFilter({ not: { const: false } }, { $nor: [{ $expr: false }] });
  });
  test("a tree gives the same query as its text", () => {
    const text = "{name} contains 'a' and !({price} anyof [1, 2])";
    const tree: FilterTreeNode = { and: [{ field: "name", op: "contains", value: "a" }, { not: { field: "price", op: "anyof", value: [1, 2] } }] };
    expect(mongo(tree)).toEqual(mongo(text));
  });
  test("an unknown or a non-filterable field in the filter, an unknown or a non-sortable one in the sort", () => {
    expect(() => mongo("{x} = 1")).toThrow("Cannot build the query: the field \"x\" is not in the field list");
    expect(() => mongo("{id} = 1", { fields: { id: { type: "number", filterable: false } } })).toThrow("the field \"id\" is not filterable");
    expect(() => toMongoQuery({ sort: [{ field: "x" }] }, { fields: fields })).toThrow("the field \"x\" is not in the field list");
    expect(() => toMongoQuery({ sort: [{ field: "id" }] }, { fields: { id: { sortable: false } } })).toThrow("the field \"id\" is not sortable");
    expect(() => toMongoQuery({ sort: [{ field: "id", direction: <any>"up" }] }, { fields: fields })).toThrow("is not \"asc\" or \"desc\": up");
  });
  test("a node that is not of the schema is an error naming it", () => {
    expect(() => mongo(<any>{ and: [{ field: "price", op: "equal", value: 1 }] })).toThrow("Cannot build the query: not a filter tree node");
    expect(() => mongo(<any>{ field: "price", op: "$where", value: "1" })).toThrow("not a filter tree node: {\"field\":\"price\",\"op\":\"$where\",\"value\":\"1\"}");
    expect(() => mongo(<any>{ field: "price", op: "equal", value: { $gt: 0 } })).toThrow("not a filter tree node");
  });
  test("the key field is sorted by without being filterable", () => {
    const res = toMongoQuery({ filter: "{name} = 'a'" }, { fields: { name: {}, _id: { filterable: false } }, defaultSort: [{ field: "_id" }] });
    expect(res).toEqual({ filter: { name: ci("^\\s*a\\s*\\z") }, sort: { _id: 1 }, skip: 0, limit: 0 });
  });
  test("options are required", () => {
    expect(() => toMongoQuery({}, <any>undefined)).toThrow("Cannot build the query: options are required");
  });
});

// There is no MongoDB in the dev dependencies (no mongodb, no mingo), so no round trip runs. Each row is the
// expression of the local-filter semantic table, the query it renders, and the MongoDB rule that makes the documents
// it matches the records ours keeps. f is a text field, t an array field, n a number field.
describe("toMongoQuery: the semantic table, row by row", () => {
  const tableFields: { [name: string]: IQueryField } = { f: {}, t: { type: "array" }, n: { type: "number" } };
  const row = (expression: string, expected: any): void => {
    expect(toMongoQuery({ filter: expression }, { fields: tableFields }).filter, expression).toEqual(expected);
  };
  test("text field", () => {
    // a regex never matches null or a missing field; \s* and i give "abc", "ABC", " abc " and not "xabcx"
    row("{f} = 'abc'", { f: ci("^\\s*abc\\s*\\z") });
    // $nor matches null and a missing field, as ours
    row("{f} <> 'abc'", { $nor: [{ f: ci("^\\s*abc\\s*\\z") }] });
    // unanchored: "xabcx" matches
    row("{f} contains 'abc'", { f: ci("abc") });
    row("{f} notcontains 'abc'", { $nor: [{ f: ci("abc") }] });
    row("{f} anyof ['abc']", { f: ci("^\\s*abc\\s*\\z") });
    row("{f} noneof ['abc']", { $nor: [{ f: ci("^\\s*abc\\s*\\z") }] });
    // every item a substring, as ours on a scalar
    row("{f} allof ['abc', 'd']", { $and: [{ f: ci("abc") }, { f: ci("d") }] });
    // the value as text: "10" matches; a number 10 stored in a text field does not (type brackets, documented)
    row("{f} = 10", { f: ci("^\\s*10\\s*\\z") });
    row("{f} = '10'", { f: ci("^\\s*10\\s*\\z") });
    row("{f} <> 10", { $nor: [{ f: ci("^\\s*10\\s*\\z") }] });
    // "" and null; "  " is not empty, as ours
    row("{f} empty", { $or: [{ f: null }, { f: "" }] });
    row("{f} notempty", { $nor: [{ f: null }, { f: "" }] });
    row("!({f} = 'abc')", { $nor: [{ f: ci("^\\s*abc\\s*\\z") }] });
  });
  test("number field", () => {
    // equality and ordering of numbers; a missing field never compares
    row("{n} = 10", { n: 10 });
    row("{n} = '10'", { n: 10 });
    row("{n} <> 10", { $nor: [{ n: 10 }] });
    row("{n} > 5", { n: { $gt: 5 } });
    // ours: "" < 5 is true by JS coercion; a number field holds no "" (documented)
    row("{n} < 5", { n: { $lt: 5 } });
    row("{n} empty", { n: null });
    row("{n} notempty", { n: { $ne: null } });
  });
  test("array field", () => {
    // a regex on an array path matches when an element matches: ["abc","d"] matches, ["xabcx"] does not
    row("{t} contains 'abc'", { t: ci("^\\s*abc\\s*\\z") });
    row("{t} notcontains 'abc'", { $nor: [{ t: ci("^\\s*abc\\s*\\z") }] });
    row("{t} anyof ['abc']", { t: ci("^\\s*abc\\s*\\z") });
    row("{t} noneof ['abc']", { $nor: [{ t: ci("^\\s*abc\\s*\\z") }] });
    row("{t} allof ['abc', 'd']", { $and: [{ t: ci("^\\s*abc\\s*\\z") }, { t: ci("^\\s*d\\s*\\z") }] });
    // null, a missing field and []; [null] matches { t: null } too (ours: not empty, documented)
    row("{t} empty", { $or: [{ t: null }, { t: { $size: 0 } }] });
    row("{t} notempty", { $nor: [{ t: null }, { t: { $size: 0 } }] });
  });
});
