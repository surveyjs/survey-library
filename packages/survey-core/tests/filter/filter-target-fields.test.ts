import { describe, test, expect } from "vitest";
import { SurveyModel } from "../../src/survey";
import { Serializer } from "../../src/jsonobject";
import { QuestionFilterModel } from "../../src/question_filter";
import { ArrayDynamicDataSource } from "../../src/dynamic-data/dynamic-data-sources";
import { getFilterFieldTitle } from "../../src/dynamic-data/dynamic-data-filter-fields";
import "../../src/question_matrixdynamic";
import "../../src/question_paneldynamic";
import "../../src/question_multipletext";

// The fields entries of a control with a target question: an entry named after a field of the target
// overrides it, any other one is a field of the record the target has no column for.
function create(fields: Array<any>, columns: Array<any> = [{ name: "country" }, { name: "notes", allowFiltering: false }]): { q: QuestionFilterModel, matrix: any } {
  const survey = new SurveyModel({ elements: [
    { type: "matrixdynamic", name: "m", columns: columns },
    { type: "filter", name: "f1", targetQuestion: "m", fields: fields }] });
  const matrix: any = survey.getQuestionByName("m");
  matrix.dataSource = ArrayDynamicDataSource.fromArray([
    { country: "de", total: 5, notes: "x" }, { country: "fr", total: 50, notes: "y" }, { country: "gb", total: 500, notes: "z" }]);
  return { q: <QuestionFilterModel>survey.getQuestionByName("f1"), matrix };
}
const names = (q: QuestionFilterModel): Array<string> => q.getFilterFields().map(f => f.name);

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

describe("hasRecordField of a target question", () => {
  test("a matrix: a column by name or valueName, filtered or not, and a path into one", () => {
    const { matrix } = create([], [{ name: "country" }, { name: "notes", allowFiltering: false }, { name: "price", valueName: "amount" }]);
    expect(["country", "notes", "amount", "price", "amount.x", "total", ""].map((n: string) => matrix.hasRecordField(n)))
      .toEqual([true, true, true, true, true, false, false]);
  });
  test("a Dynamic Panel: a template question by name or valueName, and a path into one", () => {
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "p", templateElements: [
      { type: "text", name: "a", allowFiltering: false }, { type: "text", name: "b", valueName: "bv" },
      { type: "multipletext", name: "address", items: [{ name: "city" }] }] }] });
    const panel: any = survey.getQuestionByName("p");
    expect(["a", "b", "bv", "address.city", "zip"].map((n: string) => panel.hasRecordField(n))).toEqual([true, true, true, true, false]);
  });
});
