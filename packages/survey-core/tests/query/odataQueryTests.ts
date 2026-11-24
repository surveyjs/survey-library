import { describe, test, expect, afterEach, vi } from "vitest";
import { settings, SurveyModel, QuestionFilterModel } from "survey-core";
import type { FilterTreeNode } from "survey-core";
import { toODataQuery, IODataQuery, IODataQueryOptions, IQueryField } from "survey-core/query";

const fields: { [name: string]: IQueryField } = {
  name: {}, price: { type: "number" }, ok: { type: "boolean" }, at: { type: "date" }, tags: { type: "array" }, id: { type: "number" }
};
const datetimeFields: { [name: string]: IQueryField } = { at: { type: "datetime" } };

function odata(filter: string | FilterTreeNode, options?: Partial<IODataQueryOptions>, request?: any): IODataQuery {
  return toODataQuery({ filter: filter, ...request }, { fields: fields, ...options });
}
function expectFilter(filter: string | FilterTreeNode, expected: string, options?: Partial<IODataQueryOptions>): void {
  expect(odata(filter, options), typeof filter === "string" ? filter : JSON.stringify(filter)).toEqual({ $filter: expected });
}

afterEach(() => {
  vi.useRealTimers();
  settings.comparator.caseSensitive = false;
  settings.comparator.trimStrings = true;
});

// The public Northwind service, as the filter demo reads it
const northwind: { [name: string]: IQueryField } = {
  name: { column: "ProductName" }, category: { column: "Category/CategoryName" }, quantity: { column: "QuantityPerUnit" },
  price: { type: "number", column: "UnitPrice" }, stock: { type: "number", column: "UnitsInStock" },
  discontinued: { type: "boolean", column: "Discontinued" }, id: { type: "number", column: "ProductID" }
};
const northwindOptions: IODataQueryOptions = { fields: northwind, defaultSort: [{ field: "id" }] };
const northwindFilter = (filter: string): string => toODataQuery({ filter: filter }, northwindOptions).$filter;

describe("toODataQuery: the filter demo's presets and search", () => {
  test("each preset", () => {
    expect(northwindFilter("{category} anyof ['Beverages'] and {price} < 20")).toBe(
      "((Category/CategoryName ne null and (trim(tolower(Category/CategoryName)) eq tolower('Beverages'))) and " +
      "(UnitPrice ne null and UnitPrice lt 20))");
    expect(northwindFilter("{stock} = 0")).toBe("(UnitsInStock ne null and UnitsInStock eq 0)");
    expect(northwindFilter("{stock} > 0 and {discontinued} = false")).toBe(
      "((UnitsInStock ne null and UnitsInStock gt 0) and (Discontinued ne null and Discontinued eq false))");
    expect(northwindFilter("{price} < 10 or {price} > 100")).toBe(
      "((UnitPrice ne null and UnitPrice lt 10) or (UnitPrice ne null and UnitPrice gt 100))");
    expect(northwindFilter("{discontinued} = true")).toBe("(Discontinued ne null and Discontinued eq true)");
  });
  test("a search a real Filter Control composes over name, category and quantity, with the paging request", () => {
    const survey = new SurveyModel({ elements: [
      { type: "filter", name: "f", source: "products", showSearch: true, searchFields: ["name", "category", "quantity"],
        items: [{ name: "cheap", expression: "{category} anyof ['Beverages'] and {price} < 20" }] },
      { type: "matrixdynamic", name: "products", columns: [
        { name: "name", cellType: "text" },
        { name: "category", cellType: "dropdown", choices: ["Beverages", "Condiments"] },
        { name: "quantity", cellType: "text" },
        { name: "price", cellType: "text", inputType: "number" }] }] });
    const filter = <QuestionFilterModel>survey.getQuestionByName("f");
    const expression = filter.composeFilterExpression({ activeItemName: "cheap", searchString: "bev" });
    expect(expression).toBe("({category} anyof ['Beverages'] and {price} < 20) and " +
      "({name} contains 'bev' or {category} anyof ['Beverages'] or {quantity} contains 'bev')");
    const category = "(Category/CategoryName ne null and (trim(tolower(Category/CategoryName)) eq tolower('Beverages')))";
    expect(toODataQuery({ filter: expression, skip: 10, take: 10, sort: [{ field: "price", direction: "desc" }] }, northwindOptions))
      .toEqual({
        $filter: "(" + category + " and (UnitPrice ne null and UnitPrice lt 20) and " +
          "((ProductName ne null and contains(tolower(ProductName), tolower('bev'))) or " + category + " or " +
          "(QuantityPerUnit ne null and contains(tolower(QuantityPerUnit), tolower('bev')))))",
        $orderby: "UnitPrice desc,ProductID asc", $skip: 10, $top: 10
      });
  });
});

describe("toODataQuery: what the hand-written translation got wrong", () => {
  test("notcontains keeps the rows where the field is null", () => {
    expectFilter("{name} notcontains 'x'", "(name eq null or not (contains(tolower(name), tolower('x'))))");
  });
  test("empty on a text is null or ''", () => {
    expectFilter("{name} empty", "(name eq null or name eq '')");
  });
  test("equal on a text is case-insensitive and trimmed, lowered on the service", () => {
    expectFilter("{name} = 'CHAI'", "(name ne null and trim(tolower(name)) eq tolower('CHAI'))");
  });
  test("a quoted number against a number field is a number literal", () => {
    expectFilter("{price} = '18'", "(price ne null and price eq 18)");
  });
  test("today(-7) against a date field is an Edm.Date literal", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 10, 23, 10, 0, 0));
    expectFilter("{at} >= today(-7)", "(at ne null and at ge 2026-11-16)");
  });
  test("a constant on the left is turned around", () => {
    expectFilter("10 < {price}", "(price ne null and price gt 10)");
  });
  test("allof on an array field is one any() per item", () => {
    expectFilter("{tags} allof ['x', 'y']",
      "(tags/any(x: trim(tolower(x)) eq tolower('x')) and tags/any(x: trim(tolower(x)) eq tolower('y')))");
  });
  test("a sort by a field that is not in the list is an error", () => {
    expect(() => toODataQuery({ sort: [{ field: "x" }] }, northwindOptions))
      .toThrow("Cannot build the query: the field \"x\" is not in the field list");
  });
  test("the tie-breaker sorts last", () => {
    expect(toODataQuery({ sort: [{ field: "price", direction: "desc" }] }, northwindOptions)).toEqual({ $orderby: "UnitPrice desc,ProductID asc" });
  });
});

describe("toODataQuery: every condition shape", () => {
  test("a text literal doubles its apostrophes", () => {
    expectFilter("{name} = 'it\\'s'", "(name ne null and trim(tolower(name)) eq tolower('it''s'))");
    expectFilter("{name} contains \"''\"", "(name ne null and contains(tolower(name), tolower('''''')))");
  });
  test("the value is trimmed for equality, not for contains", () => {
    expectFilter("{name} = ' Abc '", "(name ne null and trim(tolower(name)) eq tolower('Abc'))");
    expectFilter("{name} <> 'abc'", "(name eq null or not (trim(tolower(name)) eq tolower('abc')))");
    expectFilter("{name} contains ' a'", "(name ne null and contains(tolower(name), tolower(' a')))");
  });
  test("anyof and noneof are equalities in one null guard", () => {
    expectFilter("{name} anyof ['A', 'b']",
      "(name ne null and (trim(tolower(name)) eq tolower('A') or trim(tolower(name)) eq tolower('b')))");
    expectFilter("{name} noneof ['a']", "(name eq null or not ((trim(tolower(name)) eq tolower('a'))))");
    expectFilter("{price} anyof [1, '2']", "(price ne null and (price eq 1 or price eq 2))");
  });
  test("allof on a scalar field is a contains for every item, as ours", () => {
    expectFilter("{name} allof ['a', 'b']", "(name ne null and contains(tolower(name), tolower('a')) and contains(tolower(name), tolower('b')))");
  });
  test("empty and notempty test the text for '' and any other type for null only", () => {
    expectFilter("{name} notempty", "(name ne null and name ne '')");
    expectFilter("{price} empty", "price eq null");
    expectFilter("{price} notempty", "price ne null");
  });
  test("a value is coerced by the field type", () => {
    expectFilter("{price} > '10.5'", "(price ne null and price gt 10.5)");
    expectFilter("{ok} = 'True'", "(ok ne null and ok eq true)");
    expectFilter("{at} < '2026-11-16'", "(at ne null and at lt 2026-11-16)");
    expectFilter("{name} = 10", "(name ne null and trim(tolower(name)) eq tolower('10'))");
    expect(() => odata("{price} = 'abc'")).toThrow("Cannot build the query: the value of \"price\" is not a number: abc");
    expect(() => odata("{at} = 'monday'")).toThrow("the value of \"at\" is not a date: monday");
  });
  test("a moment is a DateTimeOffset literal, against a date field too", () => {
    expectFilter("{at} = '2026-11-16T10:30:00+02:00'", "(at ne null and at eq 2026-11-16T10:30:00+02:00)", { fields: datetimeFields });
    expectFilter("{at} < '2026-11-16T10:30Z'", "(at ne null and at lt 2026-11-16T10:30Z)");
  });
  test("a date-only value against a datetime field means that whole day, from UTC midnight", () => {
    const opts = { fields: datetimeFields };
    const d16 = "2026-11-16T00:00:00Z", d17 = "2026-11-17T00:00:00Z";
    expectFilter("{at} = '2026-11-16'", "(at ne null and at ge " + d16 + " and at lt " + d17 + ")", opts);
    expectFilter("{at} <> '2026-11-16'", "(at eq null or not (at ge " + d16 + " and at lt " + d17 + "))", opts);
    expectFilter("{at} < '2026-11-16'", "(at ne null and at lt " + d16 + ")", opts);
    expectFilter("{at} <= '2026-11-16'", "(at ne null and at lt " + d17 + ")", opts);
    expectFilter("{at} > '2026-11-16'", "(at ne null and at ge " + d17 + ")", opts);
    expectFilter("{at} >= '2026-11-16'", "(at ne null and at ge " + d16 + ")", opts);
    expectFilter("{at} = '2026-12-31'", "(at ne null and at ge 2026-12-31T00:00:00Z and at lt 2027-01-01T00:00:00Z)", opts);
    expectFilter("{at} anyof ['2026-11-16', '2026-11-16T10:00:00Z']",
      "(at ne null and ((at ge " + d16 + " and at lt " + d17 + ") or (at eq 2026-11-16T10:00:00Z)))", opts);
  });
  test("ordering compares the text as is, ge and le add our trimmed, case-insensitive equality", () => {
    expectFilter("{name} > 'B'", "(name ne null and name gt 'B')");
    expectFilter("{name} < 'B'", "(name ne null and name lt 'B')");
    expectFilter("{name} >= 'B '", "(name ne null and (trim(tolower(name)) eq tolower('B') or name gt 'B '))");
    expectFilter("{name} <= 'B'", "(name ne null and (trim(tolower(name)) eq tolower('B') or name lt 'B'))");
    expectFilter("{price} >= 5", "(price ne null and price ge 5)");
    expectFilter("{price} <= 5", "(price ne null and price le 5)");
  });
  test("contains on a number, boolean or date field goes through cast", () => {
    expectFilter("{price} contains '1'", "(price ne null and contains(tolower(cast(price, Edm.String)), tolower('1')))");
    expectFilter("{ok} contains 'tru'", "(ok ne null and contains(tolower(cast(ok, Edm.String)), tolower('tru')))");
    expectFilter("{at} notcontains '2026-11'", "(at eq null or not (contains(tolower(cast(at, Edm.String)), tolower('2026-11'))))");
  });
  test("not, and, or keep their brackets", () => {
    expectFilter("!({price} > 5)", "not ((price ne null and price gt 5))");
    expectFilter("{price} = 1 or !({name} empty and {ok} = true)",
      "((price ne null and price eq 1) or not (((name eq null or name eq '') and (ok ne null and ok eq true))))");
  });
  test("the shapes ours answers alike for every value are constants, at any depth", () => {
    expectFilter("{name} notcontains ''", "false");
    expectFilter({ field: "name", op: "contains", value: 0 }, "false");
    expectFilter({ field: "name", op: "allof", value: ["a", ""] }, "false");
    expectFilter({ field: "name", op: "equal", value: "" }, "(name eq null or name eq '')");
    expectFilter({ and: [{ field: "price", op: "greater", value: 1 }, { field: "name", op: "contains", value: "" }] },
      "((price ne null and price gt 1) and false)");
    expectFilter({ not: { const: false } }, "not (false)");
  });
  test("render replaces the condition, value() returns the literal, the text is bracketed", () => {
    const opts = { fields: { ...fields, name: <IQueryField>{
      render: (cond, value) => "search.ismatch(" + value(cond.value) + ") or " + value(1) + " eq " + value(true)
    } } };
    expectFilter("{price} > 1 and {name} contains 'it\\'s'",
      "((price ne null and price gt 1) and (search.ismatch('it''s') or 1 eq true))", opts);
    expectFilter("!({name} = 'x')", "not ((search.ismatch('x') or 1 eq true))", opts);
    const bad = { fields: { name: <IQueryField>{ render: () => <any>{ a: 1 } } } };
    expect(() => odata("{name} = 'x'", bad)).toThrow("Cannot build the query: render of the field \"name\" did not return a text");
    const noLiteral = { fields: { name: <IQueryField>{ render: (cond, value) => value(<any>{}) } } };
    expect(() => odata("{name} = 'x'", noLiteral)).toThrow("there is no OData literal for the value: [object Object]");
  });
});

describe("toODataQuery: an array field is a lambda over its elements", () => {
  test("contains and anyof look for an element equal to the item as text", () => {
    expectFilter("{tags} contains 'X '", "tags/any(x: trim(tolower(x)) eq tolower('X'))");
    expectFilter("{tags} anyof ['x', 'y']", "tags/any(x: trim(tolower(x)) eq tolower('x') or trim(tolower(x)) eq tolower('y'))");
    expectFilter("{tags} allof ['x']", "tags/any(x: trim(tolower(x)) eq tolower('x'))");
  });
  test("notcontains and noneof are not any(), with no null guard: a collection is never null", () => {
    expectFilter("{tags} notcontains 'x'", "not (tags/any(x: trim(tolower(x)) eq tolower('x')))");
    expectFilter("{tags} noneof ['x', 'y']", "not (tags/any(x: trim(tolower(x)) eq tolower('x') or trim(tolower(x)) eq tolower('y')))");
  });
  test("a number item is its text: a collection of numbers needs render", () => {
    expectFilter("{tags} contains 1", "tags/any(x: trim(tolower(x)) eq tolower('1'))");
    expectFilter({ field: "tags", op: "contains", value: 0 }, "tags/any(x: trim(tolower(x)) eq tolower('0'))");
  });
  test("notcontains '' is false for an empty or a null element", () => {
    expectFilter("{tags} notcontains ''", "not (tags/any(x: x eq null or trim(tolower(x)) eq tolower('')))");
    expectFilter({ field: "tags", op: "contains", value: "" }, "false");
  });
  test("empty is no element", () => {
    expectFilter("{tags} empty", "not (tags/any())");
    expectFilter("{tags} notempty", "tags/any()");
    expectFilter({ field: "tags", op: "equal", value: "" }, "not (tags/any())");
  });
  test("equal and ordering on an array field need render", () => {
    expect(() => odata("{tags} = 'x'")).toThrow("Cannot build the query: the field \"tags\" is an array: it needs render for equal");
    expect(() => odata("{tags} > 'x'")).toThrow("the field \"tags\" is an array: it needs render for greater");
  });
  test("the comparator applies to the element", () => {
    expectFilter("{tags} contains 'X '", "tags/any(x: x eq 'X ')", { comparator: { caseSensitive: true, trimStrings: false } });
  });
});

describe("toODataQuery: useIn", () => {
  test("anyof and noneof are one in, its items lowered and trimmed in JavaScript", () => {
    const opts = { useIn: true };
    expectFilter("{name} anyof ['A ', 'b']", "(name ne null and trim(tolower(name)) in ('a', 'b'))", opts);
    expectFilter("{name} noneof ['it\\'s']", "(name eq null or not (trim(tolower(name)) in ('it''s')))", opts);
    expectFilter("{price} anyof [1, '2']", "(price ne null and price in (1, 2))", opts);
    expectFilter("{name} anyof ['A ']", "(name ne null and name in ('A '))", { ...opts, comparator: { caseSensitive: true, trimStrings: false } });
  });
  test("a date-only value against a datetime field stays a day range", () => {
    expectFilter("{at} anyof ['2026-11-16']", "(at ne null and ((at ge 2026-11-16T00:00:00Z and at lt 2026-11-17T00:00:00Z)))",
      { useIn: true, fields: datetimeFields });
  });
});

describe("toODataQuery: comparator options", () => {
  test("case-sensitive drops tolower, untrimmed drops trim, both: plain comparisons", () => {
    expectFilter("{name} = 'Abc '", "(name ne null and trim(name) eq 'Abc')", { comparator: { caseSensitive: true } });
    expectFilter("{name} = 'Abc '", "(name ne null and tolower(name) eq tolower('Abc '))", { comparator: { trimStrings: false } });
    const plain = { comparator: { caseSensitive: true, trimStrings: false } };
    expectFilter("{name} = 'Abc '", "(name ne null and name eq 'Abc ')", plain);
    expectFilter("{name} >= 'B'", "(name ne null and name ge 'B')", plain);
    expectFilter("{name} contains 'A'", "(name ne null and contains(name, 'A'))", plain);
    expectFilter("{price} contains '1'", "(price ne null and contains(cast(price, Edm.String), '1'))", plain);
  });
  test("the default follows settings.comparator, key by key", () => {
    settings.comparator.caseSensitive = true;
    expectFilter("{name} = 'a'", "(name ne null and trim(name) eq 'a')");
    expectFilter("{name} = 'a'", "(name ne null and trim(tolower(name)) eq tolower('a'))", { comparator: { caseSensitive: false } });
  });
});

describe("toODataQuery: the sort, the range and the request", () => {
  test("orderby is the property path in sort order, the tie-breaker last, a field once", () => {
    expect(toODataQuery({ sort: [{ field: "price", direction: "desc" }, { field: "name" }] },
      { fields: fields, defaultSort: [{ field: "id" }, { field: "price" }] })).toEqual({ $orderby: "price desc,name asc,id asc" });
  });
  test("two fields on one path sort once, by the first", () => {
    const opts = { fields: { a: { column: "X/Y" }, b: { column: "X/Y" } }, defaultSort: [{ field: "b", direction: <const>"desc" }] };
    expect(toODataQuery({ sort: [{ field: "a" }] }, opts)).toEqual({ $orderby: "X/Y asc" });
  });
  test("column is the property path, in the filter and in the sort", () => {
    const opts = { fields: { name: { column: "Customer/Name" } } };
    expect(toODataQuery({ filter: "{name} empty", sort: [{ field: "name" }] }, opts))
      .toEqual({ $filter: "(Customer/Name eq null or Customer/Name eq '')", $orderby: "Customer/Name asc" });
  });
  test("skip and top only when greater than 0", () => {
    expect(toODataQuery({ skip: 20, take: 10 }, { fields: fields })).toEqual({ $skip: 20, $top: 10 });
    expect(toODataQuery({ skip: 0, take: 5 }, { fields: fields })).toEqual({ $top: 5 });
    expect(toODataQuery({ skip: 20 }, { fields: fields })).toEqual({ $skip: 20 });
    expect(() => toODataQuery({ take: <any>"10" }, { fields: fields })).toThrow("take is not a non-negative integer: 10");
  });
  test("a filter that is the constant true or false, and no filter", () => {
    expectFilter("1 = 1", "true");
    expectFilter("1 = 2", "false");
    expectFilter({ const: true }, "true");
    expect(toODataQuery({ filter: null }, { fields: fields })).toEqual({});
    expect(toODataQuery({ filter: "" }, { fields: fields })).toEqual({});
    expect(toODataQuery({}, { fields: fields })).toEqual({});
  });
  test("a tree gives the same query as its text", () => {
    const text = "{name} contains 'a' and !({price} anyof [1, 2])";
    const tree: FilterTreeNode = { and: [{ field: "name", op: "contains", value: "a" }, { not: { field: "price", op: "anyof", value: [1, 2] } }] };
    expect(odata(tree)).toEqual(odata(text));
  });
  test("an unknown or a non-filterable field in the filter, an unknown or a non-sortable one in the sort", () => {
    expect(() => odata("{x} = 1")).toThrow("Cannot build the query: the field \"x\" is not in the field list");
    expect(() => odata("{id} = 1", { fields: { id: { type: "number", filterable: false } } })).toThrow("the field \"id\" is not filterable");
    expect(() => toODataQuery({ sort: [{ field: "id" }] }, { fields: { id: { sortable: false } } })).toThrow("the field \"id\" is not sortable");
    expect(() => toODataQuery({ sort: [{ field: "id", direction: <any>"up" }] }, { fields: fields })).toThrow("is not \"asc\" or \"desc\": up");
  });
  test("a node that is not of the schema is an error naming it", () => {
    expect(() => odata(<any>{ and: [{ field: "price", op: "equal", value: 1 }] })).toThrow("Cannot build the query: not a filter tree node");
    expect(() => odata(<any>{ field: "price", op: "equal", value: "1) or (true" })).toThrow("the value of \"price\" is not a number");
  });
  test("options are required", () => {
    expect(() => toODataQuery({}, <any>undefined)).toThrow("Cannot build the query: options are required");
  });
});

// No OData service runs in the tests, so no round trip runs. Each row is the expression of the local-filter semantic
// table, the $filter it renders, and the OData rule that makes the rows it matches the records ours keeps.
// f is a text field, t an array field, n a number field.
describe("toODataQuery: the semantic table, row by row", () => {
  const tableFields: { [name: string]: IQueryField } = { f: {}, t: { type: "array" }, n: { type: "number" } };
  const row = (expression: string, expected: string): void => {
    expect(toODataQuery({ filter: expression }, { fields: tableFields }).$filter, expression).toBe(expected);
  };
  const eqAbc = "trim(tolower(f)) eq tolower('abc')";
  test("text field", () => {
    // the guard drops null; trim and tolower on both sides give "abc", "ABC", " abc " and not "xabcx"
    row("{f} = 'abc'", "(f ne null and " + eqAbc + ")");
    // eq null or not: null is kept, as ours
    row("{f} <> 'abc'", "(f eq null or not (" + eqAbc + "))");
    // contains() is a substring: "xabcx" matches; a null field never reaches contains(), whose null would drop the row
    row("{f} contains 'abc'", "(f ne null and contains(tolower(f), tolower('abc')))");
    row("{f} notcontains 'abc'", "(f eq null or not (contains(tolower(f), tolower('abc'))))");
    row("{f} anyof ['abc']", "(f ne null and (" + eqAbc + "))");
    row("{f} noneof ['abc']", "(f eq null or not ((" + eqAbc + ")))");
    // every item a substring, as ours on a scalar
    row("{f} allof ['abc', 'd']", "(f ne null and contains(tolower(f), tolower('abc')) and contains(tolower(f), tolower('d')))");
    // the value as text: "10" matches; a number column under a text field would be refused by the service
    row("{f} = 10", "(f ne null and trim(tolower(f)) eq tolower('10'))");
    row("{f} = '10'", "(f ne null and trim(tolower(f)) eq tolower('10'))");
    row("{f} <> 10", "(f eq null or not (trim(tolower(f)) eq tolower('10')))");
    // "" and null; "  " is not empty, as ours
    row("{f} empty", "(f eq null or f eq '')");
    row("{f} notempty", "(f ne null and f ne '')");
    row("!({f} = 'abc')", "not ((f ne null and " + eqAbc + "))");
  });
  test("number field", () => {
    row("{n} = 10", "(n ne null and n eq 10)");
    row("{n} = '10'", "(n ne null and n eq 10)");
    row("{n} <> 10", "(n eq null or not (n eq 10))");
    row("{n} > 5", "(n ne null and n gt 5)");
    // ours: "" < 5 is true by JS coercion; a number property holds no "" (documented)
    row("{n} < 5", "(n ne null and n lt 5)");
    row("{n} empty", "n eq null");
    row("{n} notempty", "n ne null");
  });
  test("array field", () => {
    // any() over the elements: ["abc","d"] matches, ["xabcx"] does not
    row("{t} contains 'abc'", "t/any(x: trim(tolower(x)) eq tolower('abc'))");
    row("{t} notcontains 'abc'", "not (t/any(x: trim(tolower(x)) eq tolower('abc')))");
    row("{t} anyof ['abc']", "t/any(x: trim(tolower(x)) eq tolower('abc'))");
    row("{t} noneof ['abc']", "not (t/any(x: trim(tolower(x)) eq tolower('abc')))");
    row("{t} allof ['abc', 'd']", "(t/any(x: trim(tolower(x)) eq tolower('abc')) and t/any(x: trim(tolower(x)) eq tolower('d')))");
    // [] has no element; a collection is never null in OData
    row("{t} empty", "not (t/any())");
    row("{t} notempty", "t/any()");
  });
});
