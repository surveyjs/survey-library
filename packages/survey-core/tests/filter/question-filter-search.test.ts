import { describe, test, expect } from "vitest";
import { createFilter, records } from "./filter-test-helpers";
import { applyFilter } from "../../src/dynamic-data/dynamic-data-filter";
import { FilterItem } from "../../src/filter/filter-item";
import { FilterField } from "../../src/filter/filter-field";
import { SurveyModel } from "../../src/survey";
import { QuestionFilterModel } from "../../src/question_filter";

function createDesignFilter(over: any = {}): QuestionFilterModel {
  const survey = new SurveyModel();
  survey.setDesignMode(true);
  survey.fromJSON({ elements: [Object.assign({ type: "filter", name: "f1",
    fields: [{ name: "name" }, { name: "age" }],
    items: [{ name: "adults", expression: "{age} > 18" }], defaultItem: "adults" }, over)] });
  return <QuestionFilterModel>survey.getQuestionByName("f1");
}

describe("QuestionFilterModel: quick search", () => {
  test("a string field searches with contains", () => {
    const q = createFilter({ showSearch: true, searchFields: ["name"] });
    q.searchString = "an";
    expect(q.filterExpression).toBe("{name} contains 'an'");
  });
  test("a choice field matches on display text and expands into anyof", () => {
    const q = createFilter({ showSearch: true, searchFields: ["country"] });
    q.searchString = "an";
    expect(q.filterExpression, "Germany and France, not Great Britain")
      .toBe("{country} anyof ['de', 'fr']");
  });
  test("a search that matches no choice filters everything out", () => {
    const q = createFilter({ showSearch: true, searchFields: ["country"] });
    q.searchString = "zz";
    expect(q.filterExpression, "#1").toBe("false");
    expect(applyFilter(records, q.filterExpression), "#2").toEqual([]);
  });
  test("a built-in choice item is never expanded into anyof", () => {
    const q = createFilter({ showSearch: true, searchFields: ["country"],
      fields: [{ name: "country", fieldType: "dropdown", showOtherItem: true, showNoneItem: true,
        choices: [{ value: "de", text: "Germany" }, { value: "fr", text: "France" }] }] });
    q.searchString = "o";
    // "Other (describe)" and "None" both contain the text, and neither is a value a record holds.
    // Counting them as a match would also take the "false" answer away from the field.
    expect(q.filterExpression, "#1").toBe("false");
    q.searchString = "an";
    expect(q.filterExpression, "#2: a real choice still expands").toBe("{country} anyof ['de', 'fr']");
  });
  test("an unknown searchField name is skipped, not turned into a variable", () => {
    const q = createFilter({ showSearch: true, searchFields: ["nosuchfield", "name"] });
    q.searchString = "an";
    expect(q.filterExpression).toBe("{name} contains 'an'");
  });
  test("no field to search leaves the control unfiltered", () => {
    const q = createFilter({ showSearch: true, searchFields: ["nosuchfield"] });
    q.searchString = "an";
    expect(q.filterExpression, "a configuration gap must not hide every record").toBe("");
  });
  test("the search is combined with the active item, both sides parenthesized", () => {
    const q = createFilter({ showSearch: true, searchFields: ["name"],
      items: [{ name: "adults", expression: "{age} > 18" }], defaultItem: "adults" });
    q.searchString = "an";
    expect(q.filterExpression).toBe("({age} > 18) and ({name} contains 'an')");
  });
  test("showSearch false ignores the search text entirely", () => {
    const q = createFilter({ showSearch: false, searchFields: ["name"] });
    q.searchString = "an";
    expect(q.filterExpression).toBe("");
  });
  test("allowChangeSearchFields false refuses the runtime setter", () => {
    const q = createFilter({ showSearch: true, allowChangeSearchFields: false, searchFields: ["name"] });
    q.setSearchFields(["country"]);
    expect(q.getSearchFields().map((f: any) => f.name)).toEqual(["name"]);
  });
  test("the result actually runs over records", () => {
    const q = createFilter({ showSearch: true, searchFields: ["name"] });
    q.searchString = "an";
    expect(applyFilter(records, q.filterExpression)).toEqual([0, 2]);
  });
  test("an empty searchFields searches every field", () => {
    const q = createFilter({ showSearch: true });
    q.searchString = "an";
    expect(q.filterExpression, "#1")
      .toBe("{name} contains 'an' or {country} anyof ['de', 'fr'] or {age} contains 'an'");
    expect(applyFilter(records, q.filterExpression), "#2").toEqual([0, 1, 2]);
  });
  test("setSearchFields is accepted while allowChangeSearchFields is true", () => {
    const q = createFilter({ showSearch: true, searchFields: ["name"] });
    q.setSearchFields(["country"]);
    q.searchString = "an";
    expect(q.filterExpression).toBe("{country} anyof ['de', 'fr']");
  });
  test("changing searchFields recomputes the expression", () => {
    const q = createFilter({ showSearch: true, searchFields: ["name"] });
    q.searchString = "an";
    q.searchFields = ["country"];
    expect(q.filterExpression).toBe("{country} anyof ['de', 'fr']");
  });
  test("turning showSearch off recomputes the expression", () => {
    const q = createFilter({ showSearch: true, searchFields: ["name"] });
    q.searchString = "an";
    expect(q.filterExpression, "#1").toBe("{name} contains 'an'");
    q.showSearch = false;
    expect(q.filterExpression, "#2").toBe("");
  });
  test("a blank search text is no search", () => {
    const q = createFilter({ showSearch: true, searchFields: ["name"] });
    q.searchString = "   ";
    expect(q.filterExpression).toBe("");
  });
  test("changing the choices of a field is picked up by the search", () => {
    const q = createFilter({ showSearch: true, searchFields: ["country"] });
    q.searchString = "an";
    (<any>q.fields[1]).choices = [{ value: "de", text: "Germany" }, { value: "ie", text: "Ireland" }];
    expect(q.filterExpression).toBe("{country} anyof ['de', 'ie']");
  });
  test("a search text with an apostrophe still parses and runs", () => {
    const q = createFilter({ showSearch: true, searchFields: ["name"] });
    q.searchString = "n'A";
    expect(q.filterExpression, "#1").toBe("{name} contains 'n\\'A'");
    expect(applyFilter([{ name: "Ann'Ann" }, { name: "Bob" }], q.filterExpression), "#2").toEqual([0]);
  });
  test("a search text with a double quote still parses and runs", () => {
    const q = createFilter({ showSearch: true, searchFields: ["name"] });
    q.searchString = "n\"A";
    expect(q.filterExpression, "#1").toBe("{name} contains 'n\\\"A'");
    expect(applyFilter([{ name: "Ann\"Ann" }, { name: "Bob" }], q.filterExpression), "#2").toEqual([0]);
  });
  test("the composed expression runs correctly over records", () => {
    const q = createFilter({ showSearch: true, searchFields: ["name"],
      items: [{ name: "adults", expression: "{age} > 18" }], defaultItem: "adults" });
    q.searchString = "an";
    expect(applyFilter(records, q.filterExpression)).toEqual([0, 2]);
  });
  test("an or-chained item expression is not swallowed by the search", () => {
    const q = createFilter({ showSearch: true, searchFields: ["name"],
      items: [{ name: "edges", expression: "{age} < 18 or {age} > 35" }], defaultItem: "edges" });
    q.searchString = "an";
    expect(q.filterExpression, "#1").toBe("({age} < 18 or {age} > 35) and ({name} contains 'an')");
    expect(applyFilter(records, q.filterExpression), "#2: Frank is 30 and drops out").toEqual([2]);
  });
});

describe("QuestionFilterModel: update item", () => {
  test("the search becomes part of the item and the search box is cleared", () => {
    const q = createFilter({ showSearch: true, searchFields: ["name"],
      items: [{ name: "adults", expression: "{age} > 18" }], defaultItem: "adults" });
    q.searchString = "an";
    expect(q.canUpdateActiveItem, "#1").toBe(true);
    q.updateActiveItem();
    expect(q.activeItem.expression, "#2").toBe("({age} > 18) and ({name} contains 'an')");
    expect(q.searchString, "#3").toBe("");
    expect(q.filterExpression, "#4").toBe("({age} > 18) and ({name} contains 'an')");
  });
  test("there is nothing to update without a search text", () => {
    const q = createFilter({ showSearch: true, searchFields: ["name"],
      items: [{ name: "adults", expression: "{age} > 18" }], defaultItem: "adults" });
    expect(q.canUpdateActiveItem, "#1").toBe(false);
    q.updateActiveItem();
    expect(q.activeItem.expression, "#2").toBe("{age} > 18");
  });
  test("an item that refuses editing is not updated", () => {
    const q = createFilter({ showSearch: true, searchFields: ["name"],
      items: [{ name: "adults", expression: "{age} > 18", allowEdit: false }], defaultItem: "adults" });
    q.searchString = "an";
    expect(q.canUpdateActiveItem, "#1").toBe(false);
    q.updateActiveItem();
    expect(q.activeItem.expression, "#2").toBe("{age} > 18");
    expect(q.searchString, "#3").toBe("an");
  });
  // filterExpression is never composed in design mode, so it is "" there: updating the item from
  // it would overwrite the authored expression with nothing, and expression is serialized.
  test("an item is not updated in design mode", () => {
    const q = createDesignFilter({ showSearch: true, searchFields: ["name"] });
    q.searchString = "an";
    expect(q.filterExpression, "#1").toBe("");
    expect(q.canUpdateActiveItem, "#2").toBe(false);
    q.updateActiveItem();
    expect(q.activeItem.expression, "#3").toBe("{age} > 18");
  });
  test("there is nothing to update without an active item", () => {
    const q = createFilter({ showSearch: true, searchFields: ["name"] });
    q.searchString = "an";
    expect(q.canUpdateActiveItem, "#1").toBe(false);
    q.updateActiveItem();
    expect(q.filterExpression, "#2").toBe("{name} contains 'an'");
  });
});

describe("QuestionFilterModel: filterExpression staleness", () => {
  // items = [] goes through Base.setArrayPropertyDirectly -> setArray, which empties the
  // destination through the prototype splice, so the wrapped onRemove never fires.
  test("assigning an empty items array clears the expression", () => {
    const q = createFilter({ items: [{ name: "adults", expression: "{age} > 18" }], defaultItem: "adults" });
    expect(q.filterExpression, "#1").toBe("{age} > 18");
    q.items = [];
    expect(q.activeItem, "#2").toBe(undefined);
    expect(q.filterExpression, "#3").toBe("");
  });
  test("replacing the items array recomputes the expression", () => {
    const q = createFilter({ items: [{ name: "adults", expression: "{age} > 18" }], defaultItem: "adults" });
    const item = new FilterItem("adults");
    item.expression = "{age} > 21";
    q.items = [item];
    expect(q.filterExpression).toBe("{age} > 21");
  });
  // fields takes the same setArray path as items: the prototype splice skips onFieldRemoved and
  // an empty src pushes nothing, so only the property change itself can report it.
  test("assigning an empty fields array clears the expression", () => {
    const q = createFilter({ showSearch: true, searchFields: ["name"] });
    q.searchString = "an";
    expect(q.filterExpression, "#1").toBe("{name} contains 'an'");
    q.fields = [];
    expect(q.getSearchFields().length, "#2").toBe(0);
    expect(q.filterExpression, "#3: zero fields cannot still filter by one").toBe("");
  });
  test("replacing the fields array recomputes the expression", () => {
    const q = createFilter({ showSearch: true, searchFields: ["name"] });
    q.searchString = "an";
    const field = new FilterField("name");
    field.valueName = "fullName";
    q.fields = [field];
    expect(q.filterExpression).toBe("{fullName} contains 'an'");
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
    const q = createFilter({ showSearch: true, searchFields: ["name"],
      fields: [{ name: "name", valueName: "fullName" }] });
    q.searchString = "an";
    expect(q.filterExpression).toBe("{fullName} contains 'an'");
  });
});
