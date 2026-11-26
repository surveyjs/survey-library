import { describe, test, expect } from "vitest";
import { createFilter, records } from "./filter-test-helpers";
import { applyFilter } from "../../src/dynamic-data/dynamic-data-filter";
import { FilterPreset } from "../../src/filter/filter-preset";
import { FilterField } from "../../src/filter/filter-field";

describe("QuestionFilterModel: quick search", () => {
  test("a string field searches with contains", () => {
    const q = createFilter({ showSearchBar: true, searchFields: ["name"] });
    q.searchString = "an";
    expect(q.combinedExpression).toBe("{name} contains 'an'");
  });
  test("a choice field matches on display text and expands into anyof", () => {
    const q = createFilter({ showSearchBar: true, searchFields: ["country"] });
    q.searchString = "an";
    expect(q.combinedExpression, "Germany and France, not Great Britain")
      .toBe("{country} anyof ['de', 'fr']");
  });
  test("a search that matches no choice filters everything out", () => {
    const q = createFilter({ showSearchBar: true, searchFields: ["country"] });
    q.searchString = "zz";
    expect(q.combinedExpression, "#1").toBe("false");
    expect(applyFilter(records, q.combinedExpression), "#2").toEqual([]);
  });
  test("a built-in choice item is never expanded into anyof", () => {
    const q = createFilter({ showSearchBar: true, searchFields: ["country"],
      fields: [{ name: "country", fieldType: "dropdown", showOtherItem: true, showNoneItem: true,
        choices: [{ value: "de", text: "Germany" }, { value: "fr", text: "France" }] }] });
    q.searchString = "o";
    // "Other (describe)" and "None" both contain the text, and neither is a value a record holds.
    // Counting them as a match would also take the "false" answer away from the field.
    expect(q.combinedExpression, "#1").toBe("false");
    q.searchString = "an";
    expect(q.combinedExpression, "#2: a real choice still expands").toBe("{country} anyof ['de', 'fr']");
  });
  test("an unknown searchField name is skipped, not turned into a variable", () => {
    const q = createFilter({ showSearchBar: true, searchFields: ["nosuchfield", "name"] });
    q.searchString = "an";
    expect(q.combinedExpression).toBe("{name} contains 'an'");
  });
  test("no field to search leaves the control unfiltered", () => {
    const q = createFilter({ showSearchBar: true, searchFields: ["nosuchfield"] });
    q.searchString = "an";
    expect(q.combinedExpression, "a configuration gap must not hide every record").toBe("");
  });
  test("the search is combined with the selected preset, both sides parenthesized", () => {
    const q = createFilter({ showSearchBar: true, searchFields: ["name"],
      presets: [{ name: "adults", expression: "{age} > 18" }], defaultPreset: "adults" });
    q.searchString = "an";
    expect(q.combinedExpression).toBe("({age} > 18) and ({name} contains 'an')");
  });
  test("showSearchBar false ignores the search text entirely", () => {
    const q = createFilter({ showSearchBar: false, searchFields: ["name"] });
    q.searchString = "an";
    expect(q.combinedExpression).toBe("");
  });

  test("the result actually runs over records", () => {
    const q = createFilter({ showSearchBar: true, searchFields: ["name"] });
    q.searchString = "an";
    expect(applyFilter(records, q.combinedExpression)).toEqual([0, 2]);
  });
  test("an empty searchFields searches every field", () => {
    const q = createFilter({ showSearchBar: true });
    q.searchString = "an";
    expect(q.combinedExpression, "#1")
      .toBe("{name} contains 'an' or {country} anyof ['de', 'fr'] or {age} contains 'an'");
    expect(applyFilter(records, q.combinedExpression), "#2").toEqual([0, 1, 2]);
  });

  test("changing searchFields recomputes the expression", () => {
    const q = createFilter({ showSearchBar: true, searchFields: ["name"] });
    q.searchString = "an";
    q.searchFields = ["country"];
    expect(q.combinedExpression).toBe("{country} anyof ['de', 'fr']");
  });
  test("turning showSearchBar off recomputes the expression", () => {
    const q = createFilter({ showSearchBar: true, searchFields: ["name"] });
    q.searchString = "an";
    expect(q.combinedExpression, "#1").toBe("{name} contains 'an'");
    q.showSearchBar = false;
    expect(q.combinedExpression, "#2").toBe("");
  });
  test("a blank search text is no search", () => {
    const q = createFilter({ showSearchBar: true, searchFields: ["name"] });
    q.searchString = "   ";
    expect(q.combinedExpression).toBe("");
  });
  test("changing the choices of a field is picked up by the search", () => {
    const q = createFilter({ showSearchBar: true, searchFields: ["country"] });
    q.searchString = "an";
    (<any>q.fields[1]).choices = [{ value: "de", text: "Germany" }, { value: "ie", text: "Ireland" }];
    expect(q.combinedExpression).toBe("{country} anyof ['de', 'ie']");
  });
  test("a search text with an apostrophe still parses and runs", () => {
    const q = createFilter({ showSearchBar: true, searchFields: ["name"] });
    q.searchString = "n'A";
    expect(q.combinedExpression, "#1").toBe("{name} contains 'n\\'A'");
    expect(applyFilter([{ name: "Ann'Ann" }, { name: "Bob" }], q.combinedExpression), "#2").toEqual([0]);
  });
  test("a search text with a double quote still parses and runs", () => {
    const q = createFilter({ showSearchBar: true, searchFields: ["name"] });
    q.searchString = "n\"A";
    expect(q.combinedExpression, "#1").toBe("{name} contains 'n\\\"A'");
    expect(applyFilter([{ name: "Ann\"Ann" }, { name: "Bob" }], q.combinedExpression), "#2").toEqual([0]);
  });
  test("the composed expression runs correctly over records", () => {
    const q = createFilter({ showSearchBar: true, searchFields: ["name"],
      presets: [{ name: "adults", expression: "{age} > 18" }], defaultPreset: "adults" });
    q.searchString = "an";
    expect(applyFilter(records, q.combinedExpression)).toEqual([0, 2]);
  });
  test("an or-chained item expression is not swallowed by the search", () => {
    const q = createFilter({ showSearchBar: true, searchFields: ["name"],
      presets: [{ name: "edges", expression: "{age} < 18 or {age} > 35" }], defaultPreset: "edges" });
    q.searchString = "an";
    expect(q.combinedExpression, "#1").toBe("({age} < 18 or {age} > 35) and ({name} contains 'an')");
    expect(applyFilter(records, q.combinedExpression), "#2: Frank is 30 and drops out").toEqual([2]);
  });
});

describe("QuestionFilterModel: filterExpression staleness", () => {
  // items = [] goes through Base.setArrayPropertyDirectly -> setArray, which empties the
  // destination through the prototype splice, so the wrapped onRemove never fires.
  test("assigning an empty items array clears the expression", () => {
    const q = createFilter({ presets: [{ name: "adults", expression: "{age} > 18" }], defaultPreset: "adults" });
    expect(q.combinedExpression, "#1").toBe("{age} > 18");
    q.presets = [];
    expect(q.activePreset, "#2").toBe(undefined);
    expect(q.combinedExpression, "#3").toBe("");
  });
  test("replacing the items array recomputes the expression", () => {
    const q = createFilter({ presets: [{ name: "adults", expression: "{age} > 18" }], defaultPreset: "adults" });
    const item = new FilterPreset("adults");
    item.expression = "{age} > 21";
    q.presets = [item];
    expect(q.combinedExpression).toBe("{age} > 21");
  });
  // fields takes the same setArray path as presets: the prototype splice skips onFieldRemoved and
  // an empty src pushes nothing, so only the property change itself can report it.
  test("assigning an empty fields array clears the expression", () => {
    const q = createFilter({ showSearchBar: true, searchFields: ["name"] });
    q.searchString = "an";
    expect(q.combinedExpression, "#1").toBe("{name} contains 'an'");
    q.fields = [];
    expect(q.getSearchFields().length, "#2").toBe(0);
    expect(q.combinedExpression, "#3: zero fields cannot still filter by one").toBe("");
  });
  test("replacing the fields array recomputes the expression", () => {
    const q = createFilter({ showSearchBar: true, searchFields: ["name"] });
    q.searchString = "an";
    const field = new FilterField("name");
    field.valueName = "fullName";
    q.fields = [field];
    expect(q.combinedExpression).toBe("{fullName} contains 'an'");
  });
});

describe("QuestionFilterModel: fields", () => {
  test("getFilterFields describes the standalone fields", () => {
    const q = createFilter({});
    const fields = q.getFilterFields();
    expect(fields.map((f) => f.name), "#1").toEqual(["name", "country", "age"]);
    expect(fields[1].fieldType, "#2").toBe("dropdown");
    expect(fields[0].valueName, "#3").toBe("name");
  });
  test("a field with a valueName is searched by its valueName", () => {
    const q = createFilter({ showSearchBar: true, searchFields: ["name"],
      fields: [{ name: "name", valueName: "fullName" }] });
    q.searchString = "an";
    expect(q.combinedExpression).toBe("{fullName} contains 'an'");
  });
});
