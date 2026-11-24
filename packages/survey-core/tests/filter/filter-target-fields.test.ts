import { describe, test, expect } from "vitest";
import { SurveyModel } from "../../src/survey";
import { Serializer } from "../../src/jsonobject";
import { QuestionFilterModel } from "../../src/question_filter";
import { ArrayDynamicDataSource } from "../../src/dynamic-data/dynamic-data-sources";
import { getFilterFieldTitle } from "../../src/dynamic-data/dynamic-data-filter-fields";
import { ComponentCollection } from "../../src/question_custom";
import "../../src/question_matrixdynamic";
import "../../src/question_paneldynamic";
import "../../src/question_multipletext";

// The fields entries of a control with a target question: an entry named after a field of the target
// overrides it, any other one is a field of the record the target has no column for.
function create(fields: Array<any>, columns: Array<any> = [{ name: "country" }, { name: "notes", allowFiltering: false }],
  data: Array<any> = [{ country: "de", total: 5, notes: "x" }, { country: "fr", total: 50, notes: "y" }, { country: "gb", total: 500, notes: "z" }]
): { q: QuestionFilterModel, matrix: any } {
  const survey = new SurveyModel({ elements: [
    { type: "matrixdynamic", name: "m", columns: columns },
    { type: "filter", name: "f1", targetQuestion: "m", fields: fields }] });
  const matrix: any = survey.getQuestionByName("m");
  matrix.dataSource = ArrayDynamicDataSource.fromArray(data);
  return { q: <QuestionFilterModel>survey.getQuestionByName("f1"), matrix };
}
const names = (q: QuestionFilterModel): Array<string> => q.getFilterFields().map(f => f.name);
const customers = [
  { customer: { name: "Ann", country: "de" }, total: 5 },
  { customer: { name: "Bob", country: "fr" }, total: 50 },
  { customer: { name: "Cid", country: "de" }, total: 500 }];

describe("Filter fields of a target question", () => {
  test("an entry named after a column overrides its title, operators and quick-filter flag", () => {
    const { q } = create([{ name: "country", title: "Land", operators: ["equal"], showInQuickFilters: false }]);
    const f = q.getFieldByName("country");
    expect([getFilterFieldTitle(f), f.operators, f.showInQuickFilters], "#1").toEqual(["Land", ["equal"], false]);
    expect(q.getQuickFilterFields().map(x => x.name), "#2").toEqual([]);
    expect(names(q), "#3: no second field of that name").toEqual(["country"]);
  });
  test("an override with no title or operators keeps the column's", () => {
    const { q } = create([{ name: "country" }], [{ name: "country", title: "Country of origin", filterOperators: ["equal", "notequal"] }]);
    const f = q.getFieldByName("country");
    expect([getFilterFieldTitle(f), f.operators, f.showInQuickFilters !== false]).toEqual(["Country of origin", ["equal", "notequal"], true]);
  });
  test("the type, the choices and the variable stay the column's", () => {
    const { q } = create([{ name: "price", title: "Cost", fieldType: "dropdown" }],
      [{ name: "price", cellType: "text", inputType: "number", valueName: "amount" }]);
    const f = q.getFieldByName("price");
    expect([f.valueType, f.fieldType, f.valueName]).toEqual(["number", "text", "amount"]);
  });
  test("an entry is matched by the column's valueName too", () => {
    const { q } = create([{ name: "amount", title: "Cost" }], [{ name: "price", valueName: "amount" }]);
    expect([names(q), getFilterFieldTitle(q.getFieldByName("price"))]).toEqual([["price"], "Cost"]);
  });
  test("an entry with no column is a field of the record, after the columns; it filters the records", () => {
    const { q, matrix } = create([{ name: "total", valueType: "number" }]);
    expect(names(q), "#1").toEqual(["country", "total"]);
    expect(q.getFieldByName("total").valueType, "#2").toBe("number");
    q.applyFilter("{total} > 10");
    expect(q.filterExpression, "#3: the fields show it").toBe("{total} > 10");
    expect((<any>q).getFieldCondition("total"), "#4").toBeTruthy();
    expect(matrix.visibleRows.length, "#5").toBe(2);
  });
  test("an external field with no type is text", () => {
    const { q } = create([{ name: "city" }]);
    const f = q.getFieldByName("city");
    expect([f.valueType, f.fieldType, f.isTypeless], "#1").toEqual(["string", "text", true]);
  });
  test("an external field is counted", async () => {
    const { q } = create([{ name: "total", valueType: "number" }]);
    expect(await q.countFilterResults("{total} > 10")).toBe(2);
  });
  test("an entry named after a column the filter leaves out is ignored", () => {
    const { q } = create([{ name: "notes" }]);
    expect(names(q)).toEqual(["country"]);
  });
  test("an entry naming a path into a column the filter offers is a field of the record; it filters and is counted", async () => {
    const { q, matrix } = create([{ name: "customer.country", title: "Country" }], [{ name: "customer" }], customers);
    expect(names(q), "#1").toEqual(["customer", "customer.country"]);
    expect(getFilterFieldTitle(q.getFieldByName("customer.country")), "#2").toBe("Country");
    expect(await q.countFilterResults("{customer.country} = 'de'"), "#3").toBe(2);
    q.applyFilter("{customer.country} = 'de'");
    expect(matrix.visibleRows.length, "#4").toBe(2);
  });
  test("an entry naming a path into a column the filter leaves out is ignored", () => {
    const { q } = create([{ name: "customer.country" }], [{ name: "customer", allowFiltering: false }], customers);
    expect(names(q), "#1").toEqual([]);
    expect(q.getFieldOfEntry(q.fields[0]), "#2").toBeUndefined();
  });
  test("an entry naming a path into a Dynamic Panel's record question past its items is a field of the record", () => {
    const survey = new SurveyModel({ elements: [
      { type: "paneldynamic", name: "p", panelCount: 2, templateElements: [{ type: "multipletext", name: "address", items: [{ name: "city" }] }] },
      { type: "filter", name: "f1", targetQuestion: "p", fields: [{ name: "address.zip", title: "ZIP" }] }] });
    const panel: any = survey.getQuestionByName("p");
    panel.value = [{ address: { city: "Berlin", zip: "10115" } }, { address: { city: "Paris", zip: "75001" } }];
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    expect(names(q), "#1").toEqual(["city", "address.zip"]);
    expect(q.getFieldByName("address.zip").valueName, "#2").toBe("address.zip");
    q.applyFilter("{address.zip} = '10115'");
    expect(panel.visiblePanels.length, "#3").toBe(1);
  });
  test("a second entry for a nested field is no field of its own", () => {
    const survey = new SurveyModel({ elements: [
      { type: "paneldynamic", name: "p", templateElements: [{ type: "multipletext", name: "address", items: [{ name: "city" }] }] },
      { type: "filter", name: "f1", targetQuestion: "p", fields: [{ name: "city", title: "Town" }, { name: "address.city", title: "Other" }] }] });
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    expect(names(q), "#1").toEqual(["city"]);
    expect(getFilterFieldTitle(q.getFieldByName("address.city")), "#2").toBe("Town");
  });
  test("an entry finds a nested field of a Dynamic Panel by its path", () => {
    const survey = new SurveyModel({ elements: [
      { type: "paneldynamic", name: "p", templateElements: [{ type: "multipletext", name: "address", items: [{ name: "city" }] }] },
      { type: "filter", name: "f1", targetQuestion: "p", fields: [{ name: "address.city", title: "Town" }, { name: "zip" }] }] });
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    expect(getFilterFieldTitle(q.getFieldByName("address.city")), "#1").toBe("Town");
    expect(names(q), "#2").toEqual(["city", "zip"]);
  });
  test("a changed entry updates the chip at once", () => {
    const { q } = create([{ name: "country", title: "Land" }]);
    const chip: any = q.chipsToolbar.getActionById("sv-filter-field-country");
    expect(chip.title, "#1").toBe("Land");
    q.fields[0].title = "Nation";
    expect(chip.title, "#2").toBe("Nation");
  });
  test("with no target the fields are the control's own, as before", () => {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1", fields: [{ name: "a" }, { name: "b", fieldType: "dropdown", choices: [1, 2] }] }] });
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    expect([names(q), q.getFieldByName("b").fieldType]).toEqual([["a", "b"], "dropdown"]);
  });
  test("fields and the four field properties are visible; the type stays hidden", () => {
    expect(Serializer.findProperty("filter", "fields").visible, "#1").toBe(true);
    ["name", "title", "operators", "showInQuickFilters"].forEach((n: string) => expect(Serializer.findProperty("filterfield", n).visible, n).toBe(true));
    ["fieldType", "valueType", "valueName"].forEach((n: string) => expect(Serializer.findProperty("filterfield", n).visible, n).toBe(false));
  });
  test("an entry's operator choices are those of the field it overrides", () => {
    const { q } = create([{ name: "price" }, { name: "city" }], [{ name: "price", cellType: "text", inputType: "number" }]);
    const operators = Serializer.findProperty("filterfield", "operators");
    const ofPrice: Array<string> = operators.getChoices(q.fields[0]);
    expect([ofPrice.indexOf("greater") > -1, ofPrice.indexOf("contains") > -1], "#1: a number").toEqual([true, false]);
    const ofCity: Array<string> = operators.getChoices(q.fields[1]);
    expect(ofCity.indexOf("contains") > -1, "#2: an external text field").toBe(true);
  });
});

describe("A matrix detail panel as a source of fields", () => {
  test("a fields entry overrides a detail panel field and the filter reads the detail value", () => {
    const survey = new SurveyModel({ elements: [
      { type: "matrixdynamic", name: "m", columns: [{ name: "c1" }], detailPanelMode: "underRow",
        detailElements: [{ type: "dropdown", name: "project", choices: ["A", "B"] }] },
      { type: "filter", name: "f1", targetQuestion: "m", fields: [{ name: "project", title: "Proj", showInQuickFilters: false }] }] });
    const matrix: any = survey.getQuestionByName("m");
    matrix.value = [{ c1: 1, project: "A" }, { c1: 2, project: "B" }];
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    expect(names(q), "#1: one field, not a standalone one next to it").toEqual(["c1", "project"]);
    expect(q.getFieldByName("project").fieldType, "#2: the detail question's editor").toBe("dropdown");
    expect(getFilterFieldTitle(q.getFieldByName("project")), "#3").toBe("Proj");
    expect(q.getQuickFilterFields().map(f => f.name), "#4").toEqual(["c1"]);
    q.applyFilter("{project} = 'A'");
    expect(matrix.visibleRows.length, "#5").toBe(1);
  });
});

describe("A target question that has no hasRecordField", () => {
  test("an entry that names no field of its list is a field of the record", () => {
    const { q, matrix } = create([{ name: "total", fieldType: "text", inputType: "number" }]);
    matrix.hasRecordField = undefined;
    expect(names(q), "#1").toEqual(["country", "total"]);
    expect(q.getFieldOfEntry(q.fields[0]).name, "#2").toBe("total");
  });
});

describe("hasRecordField of a target question", () => {
  test("a matrix: a column by name or valueName, filtered or not, and a path into one the filter leaves out", () => {
    const { matrix } = create([], [{ name: "country" }, { name: "notes", allowFiltering: false }, { name: "price", valueName: "amount" }]);
    expect(["country", "notes", "amount", "price", "amount.x", "notes.x", "total", ""].map((n: string) => matrix.hasRecordField(n)))
      .toEqual([true, true, true, true, false, true, false, false]);
  });
  test("a Dynamic Panel: a template question by name or valueName, a child's path, and a path into one the filter leaves out", () => {
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "p", templateElements: [
      { type: "text", name: "a", allowFiltering: false }, { type: "text", name: "b", valueName: "bv" },
      { type: "multipletext", name: "address", items: [{ name: "city" }] }] }] });
    const panel: any = survey.getQuestionByName("p");
    expect(["a", "b", "bv", "address.city", "address.zip", "a.x", "zip"].map((n: string) => panel.hasRecordField(n)))
      .toEqual([true, true, true, true, false, true, false]);
  });
  test("a composite in a template: its children's paths are taken, a path into an excluded child too, a path past them is not", () => {
    ComponentCollection.Instance.add({ name: "customerinfo", elementsJSON: [
      { type: "text", name: "firstName" }, { type: "text", name: "lastName", allowFiltering: false }] });
    try {
      const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "p", templateElements: [{ type: "customerinfo", name: "c" }] }] });
      const panel: any = survey.getQuestionByName("p");
      expect(["c", "c.firstName", "c.lastName", "c.lastName.x", "c.email"].map((n: string) => panel.hasRecordField(n)))
        .toEqual([true, true, true, true, false]);
    } finally {
      ComponentCollection.Instance.clear();
    }
  });
});

// What Creator's Fields table shows (getDesignFieldEntries): a row per field of the target, the entry
// that overrides it or one made for the row that is not in fields, then the other entries.
describe("The designer's fields entries", () => {
  test("a row per column in its order - the authored entry where there is one - then the other entries", () => {
    const { q } = create([{ name: "city" }, { name: "country", title: "Land" }],
      [{ name: "country" }, { name: "price", cellType: "text", inputType: "number" }]);
    const authored = [].concat(q.fields);
    const rows = q.getDesignFieldEntries();
    expect(rows.map(e => e.name), "#1").toEqual(["country", "price", "city"]);
    expect(rows[0], "#2: the override itself").toBe(authored[1]);
    expect(rows[2], "#3: the field of the record").toBe(authored[0]);
    expect([q.fields.indexOf(rows[1]), rows[1].designOwner === q, rows[1].getSurvey()], "#4: a new entry, not in fields, that knows no survey").toEqual([-1, true, null]);
    expect(q.toJSON().fields, "#5: the JSON is as it was").toEqual([{ name: "city" }, { name: "country", title: "Land" }]);
    expect(q.getDesignFieldEntries()[0], "#6").toBe(authored[1]);
  });
  test("a row's entry offers the operators of its column, and once in fields it overrides that column", () => {
    const { q } = create([], [{ name: "country" }, { name: "price", cellType: "text", inputType: "number" }]);
    const price = q.getDesignFieldEntries()[1];
    const choices: Array<string> = Serializer.findProperty("filterfield", "operators").getChoices(price);
    expect([choices.indexOf("greater") > -1, choices.indexOf("contains") > -1], "#1").toEqual([true, false]);
    expect(q.getFieldOfEntry(price).valueName, "#2").toBe("price");
    price.title = "Cost";
    q.fields.push(price);
    expect(getFilterFieldTitle(q.getFieldByName("price")), "#3").toBe("Cost");
    expect(names(q), "#4").toEqual(["country", "price"]);
  });
  test("two nested fields of the same name are rows by their paths", () => {
    const survey = new SurveyModel({ elements: [
      { type: "paneldynamic", name: "p", templateElements: [
        { type: "multipletext", name: "home", items: [{ name: "city" }] },
        { type: "multipletext", name: "work", items: [{ name: "city" }, { name: "zip" }] }] },
      { type: "filter", name: "f1", targetQuestion: "p" }] });
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    const rows = q.getDesignFieldEntries();
    expect(rows.map(e => e.name), "#1").toEqual(["home.city", "work.city", "zip"]);
    rows[1].title = "Office";
    q.fields.push(rows[1]);
    const titles = q.getFilterFields().map(f => getFilterFieldTitle(f));
    expect(titles, "#2: the second one only").toEqual(["city", "Office", "zip"]);
  });
  test("with no target the rows are the fields entries", () => {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1", fields: [{ name: "a" }, { name: "b" }] }] });
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    const rows = q.getDesignFieldEntries();
    expect(rows, "#1").toEqual(q.fields);
    expect(rows === q.fields, "#2: a copy").toBe(false);
  });
  test("an entry of another control or none has no field", () => {
    const { q } = create([], [{ name: "country" }]);
    const other = create([], [{ name: "country" }]).q;
    expect(q.getFieldOfEntry(other.getDesignFieldEntries()[0]), "#1").toBeUndefined();
  });
});
