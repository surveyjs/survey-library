import { describe, test, expect } from "vitest";
import { SurveyModel } from "../../src/survey";
import { JsonObject, Serializer } from "../../src/jsonobject";
import { QuestionFilterModel } from "../../src/question_filter";
import { FilterField } from "../../src/filter/filter-field";
import { getFilterFieldTitle } from "../../src/dynamic-data/dynamic-data-filter-fields";
import "../../src/question_matrixdynamic";
import "../../src/question_paneldynamic";
import "../../src/question_multipletext";

// Spec G: the fields of a Filter Control are its fields entries; a target question's fields are a catalog.
describe("Filter fields: an entry in the JSON", () => {
  test("an entry is written as an object, one with nothing but a name too", () => {
    const field = new FilterField("country");
    expect(new JsonObject().toJsonObjectCore(field, null), "#1").toEqual({ name: "country" });
    field.title = "Land";
    expect(new JsonObject().toJsonObjectCore(field, null), "#2").toEqual({ name: "country", title: "Land" });
    expect(field.toJSON(), "#3").toEqual({ name: "country", title: "Land" });
    expect(new FilterField("amount").toJSON(), "#4").toEqual({ name: "amount" });
  });
});

const matrix = (columns: Array<any>): any => ({ type: "matrixdynamic", name: "m", columns: columns });
const filterOf = (survey: SurveyModel): QuestionFilterModel => <QuestionFilterModel>survey.getQuestionByName("f");
const entryNames = (q: QuestionFilterModel): Array<string> => q.fields.map(f => f.name);

describe("Filter fields: set or not", () => {
  test("fields left out of the JSON are not set; [] and entries are", () => {
    const create = (props: any): QuestionFilterModel => filterOf(new SurveyModel({ elements: [
      matrix([{ name: "country" }]), Object.assign({ type: "filter", name: "f", targetQuestion: "m" }, props)] }));
    expect(create({}).isFieldsDefined, "#1").toBe(false);
    expect(create({}).toJSON().fields, "#2").toBeUndefined();
    expect(create({ fields: [] }).isFieldsDefined, "#3").toBe(true);
    expect(create({ fields: [] }).toJSON().fields, "#4").toEqual([]);
    expect(create({ fields: [{ name: "country" }] }).isFieldsDefined, "#5").toBe(true);
  });
  test("entries load from objects and are written as objects", () => {
    const q = filterOf(new SurveyModel({ elements: [matrix([{ name: "country" }, { name: "amount" }]),
      { type: "filter", name: "f", targetQuestion: "m", fields: [{ name: "country" }, { name: "amount", title: "Sum" }] }] }));
    expect(q.fields.map(f => f.getType()), "#1").toEqual(["filterfield", "filterfield"]);
    expect([entryNames(q), q.fields[1].title], "#2").toEqual([["country", "amount"], "Sum"]);
    expect(q.toJSON().fields, "#3").toEqual([{ name: "country" }, { name: "amount", title: "Sum" }]);
  });
  test("a string in the JSON is no entry, and the JSON error says an entry needs a name", () => {
    const survey = new SurveyModel({ elements: [matrix([{ name: "country" }, { name: "amount" }]),
      { type: "filter", name: "f", targetQuestion: "m", fields: ["country", { name: "amount" }] }] });
    const q = filterOf(survey);
    expect([entryNames(q), q.toJSON().fields], "#1").toEqual([["amount"], [{ name: "amount" }]]);
    const error = (survey.jsonErrors || []).filter(e => e.type === "requiredproperty")[0];
    expect(!!error && error.element === q, "#2").toBe(true);
  });
  test("without a target question [] is not written: it means what fields left out mean", () => {
    const q = filterOf(new SurveyModel({ elements: [{ type: "filter", name: "f", fields: [] }] }));
    expect([q.isFieldsDefined, q.toJSON().fields], "#1").toEqual([true, undefined]);
  });
  test("an assignment and an added entry set fields; the setter takes definitions, not strings", () => {
    const survey = new SurveyModel({ elements: [matrix([{ name: "country" }]), { type: "filter", name: "f", targetQuestion: "m" }] });
    const q = filterOf(survey);
    q.fields.push(new FilterField("country"));
    expect(q.isFieldsDefined, "#1: push").toBe(true);
    const q2 = filterOf(new SurveyModel({ elements: [matrix([{ name: "country" }]), { type: "filter", name: "f", targetQuestion: "m" }] }));
    q2.fields = <any>["country", { name: "amount" }, { name: "total", title: "Total" }];
    expect([q2.isFieldsDefined, entryNames(q2), q2.fields[1].title], "#2").toEqual([true, ["amount", "total"], "Total"]);
  });
  test("a definition pushed, unshifted or spliced into fields is an entry; a string is not", () => {
    const q = filterOf(new SurveyModel({ elements: [matrix([{ name: "country" }]), { type: "filter", name: "f", targetQuestion: "m" }] }));
    q.fields.push(<any>{ name: "country" }, <any>"skipped", <any>{ name: "amount", title: "Sum" });
    q.fields.unshift(<any>{ name: "first" }, <any>"skipped");
    q.fields.splice(1, 0, <any>"skipped", <any>{ name: "second" });
    expect(q.fields.map(f => f instanceof FilterField), "#1").toEqual([true, true, true, true]);
    expect([entryNames(q), q.fields[3].title, q.isFieldsDefined], "#2").toEqual([["first", "second", "country", "amount"], "Sum", true]);
    expect(q.fields.every(f => f.fieldOwner === q), "#3: hooked as any entry").toBe(true);
    const entry = new FilterField("x");
    q.fields.push(entry);
    expect(q.fields[4], "#4: an entry stays itself").toBe(entry);
  });
  test("a survey with \"fields\": [] keeps it through toJSON and a new load (no fields)", () => {
    const json = { elements: [matrix([{ name: "country" }]), { type: "filter", name: "f", targetQuestion: "m", fields: [] }] };
    const again = new SurveyModel(new SurveyModel(json).toJSON());
    expect([filterOf(again).isFieldsDefined, filterOf(again).fields.length], "#1").toEqual([true, 0]);
  });
  test("an entry of the JSON still reports an unknown property", () => {
    const survey = new SurveyModel({ elements: [matrix([{ name: "country" }]),
      { type: "filter", name: "f", targetQuestion: "m", fields: [{ name: "country", foo: 1 }] }] });
    expect((survey.jsonErrors || []).some(e => e.type === "unknownproperty"), "#1").toBe(true);
  });
  test("\"fields\": an entry that is not in an array is one entry, and the JSON error says fields is an array", () => {
    const survey = new SurveyModel({ elements: [matrix([{ name: "country" }, { name: "amount" }]),
      { type: "filter", name: "f", targetQuestion: "m", fields: { name: "country" } }] });
    const q = filterOf(survey);
    expect([entryNames(q), q.getFilterFields().map(f => f.name)], "#1").toEqual([["country"], ["country"]]);
    const error = (survey.jsonErrors || []).filter(e => e.type === "arrayproperty")[0];
    expect(!!error && error.element === q, "#2").toBe(true);
  });
  test("the JSON schema takes an entry as an object only", () => {
    const items = (<any>Serializer.generateSchema()).definitions.filter.allOf[1].properties.fields.items;
    expect([items.anyOf, items.$ref], "#1").toEqual([undefined, "filterfield"]);
  });
});

describe("Filter fields: the catalog of a target question", () => {
  const visibility = (fields: Array<any>): Array<any> => fields.map(f => [f.valueName, f.isVisible !== false]);
  test("a matrix: a hidden column and a hidden detail question are in the catalog as hidden", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", detailPanelMode: "underRow",
      columns: [{ name: "a" }, { name: "b", visible: false }],
      detailElements: [{ type: "text", name: "c" }, { type: "text", name: "d", visible: false }] }] });
    expect(visibility((<any>survey.getQuestionByName("m")).getFilterFields())).toEqual([["a", true], ["b", false], ["c", true], ["d", false]]);
  });
  test("a dynamic panel: a hidden question, a question of a hidden panel and a nested field of a hidden record", () => {
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "p", templateElements: [
      { type: "text", name: "a" }, { type: "text", name: "b", visible: false },
      { type: "panel", name: "inner", visible: false, elements: [{ type: "text", name: "c" }] },
      { type: "multipletext", name: "addr", visible: false, items: [{ name: "city" }] },
      { type: "text", name: "e", visibleIf: "{x} = 1" }] }] });
    expect(visibility((<any>survey.getQuestionByName("p")).getFilterFields()), "visibleIf does not hide a field")
      .toEqual([["a", true], ["b", false], ["c", false], ["addr.city", false], ["e", true]]);
  });
});

describe("Filter fields: the list of a control with a target question", () => {
  const create = (columns: Array<any>, props: any = {}): QuestionFilterModel => filterOf(new SurveyModel({ elements: [
    { type: "matrixdynamic", name: "m", columns: columns }, Object.assign({ type: "filter", name: "f", targetQuestion: "m" }, props)] }));
  const names = (q: QuestionFilterModel): Array<string> => q.getFilterFields().map(f => f.name);
  test("fields left out: the visible fields of the target", () => {
    expect(names(create([{ name: "a" }, { name: "b", visible: false }, { name: "c" }]))).toEqual(["a", "c"]);
  });
  test("fields: [] - no fields, no field chips; the All Filters button stays", () => {
    const q = create([{ name: "a" }], { fields: [] });
    expect([names(q), q.getQuickFilterFields().length], "#1").toEqual([[], 0]);
    expect(!!q.chipsToolbar.getActionById("sv-filter-all-filters"), "#2: only showAllFiltersButton hides it").toBe(true);
  });
  test("the entries in their order, a field of the record among them; a hidden column listed is a field", () => {
    const q = create([{ name: "a" }, { name: "b", visible: false }, { name: "c" }], { fields: [{ name: "c" }, { name: "total" }, { name: "b" }] });
    expect(names(q)).toEqual(["c", "total", "b"]);
  });
  test("an entry finds its field by valueName, then by name", () => {
    const q = create([{ name: "price", valueName: "amount" }, { name: "c" }], { fields: [{ name: "amount" }, { name: "c", title: "C!" }] });
    expect(q.getFilterFields().map(f => [f.name, f.valueName]), "#1").toEqual([["price", "amount"], ["c", "c"]]);
    expect(names(create([{ name: "price", valueName: "amount" }], { fields: [{ name: "price" }] })), "#2: by name").toEqual(["price"]);
  });
  test("a second entry of a field adds nothing", () => {
    expect(names(create([{ name: "a" }], { fields: [{ name: "a" }, { name: "a", title: "Again" }] }))).toEqual(["a"]);
  });
  test("an entry naming a column the filter cannot compare (a file) is ignored", () => {
    expect(names(create([{ name: "a" }, { name: "doc", cellType: "file" }], { fields: [{ name: "a" }, { name: "doc" }] }))).toEqual(["a"]);
  });
  test("a nested field is named by its path", () => {
    const q = filterOf(new SurveyModel({ elements: [{ type: "paneldynamic", name: "p", templateElements: [
      { type: "multipletext", name: "addr", items: [{ name: "city" }] }] },
    { type: "filter", name: "f", targetQuestion: "p", fields: [{ name: "addr.city", title: "City" }] }] }));
    expect(q.getFilterFields().map(f => [f.valueName, getFilterFieldTitle(f)])).toEqual([["addr.city", "City"]]);
  });
  test("a column added to the target: a field while fields are left out, not one when they are set", () => {
    const left = create([{ name: "a" }]);
    const set = create([{ name: "a" }], { fields: [{ name: "a" }] });
    [left, set].forEach(q => (<any>q.survey.getQuestionByName("m")).addColumn("b"));
    expect([names(left), names(set)]).toEqual([["a", "b"], ["a"]]);
  });
  test("design entries: the entries when fields are set, an entry per visible field of the target otherwise", () => {
    const left = create([{ name: "price", valueName: "amount" }, { name: "b", visible: false }]);
    const design = left.getDesignFieldEntries();
    expect([design.map(e => e.name), design[0].designOwner === left, left.fields.length], "#1").toEqual([["amount"], true, 0]);
    expect(left.getFieldOfEntry(design[0]).valueName, "#2").toBe("amount");
    const set = create([{ name: "a" }], { fields: [{ name: "a" }, { name: "total" }] });
    expect(set.getDesignFieldEntries(), "#3").toEqual(set.fields);
    expect(set.getTargetFilterFields().map(f => f.name), "#4: the catalog").toEqual(["a"]);
    expect(left.getTargetFilterFields(undefined, true).map(f => f.name), "#5: visible only").toEqual(["price"]);
    expect(left.findTargetFilterField("amount").name, "#6").toBe("price");
  });
});

describe("Filter fields: no filter properties on questions and columns", () => {
  test("allowFiltering and filterOperators are gone from a question and a column", () => {
    ["question", "matrixdropdowncolumn", "text"].forEach(cls => {
      expect([!!Serializer.findProperty(cls, "allowFiltering"), !!Serializer.findProperty(cls, "filterOperators")], cls).toEqual([false, false]);
    });
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m",
      columns: [{ name: "a", allowFiltering: false, filterOperators: ["equal"] }] }, { type: "filter", name: "f", targetQuestion: "m" }] });
    expect(survey.jsonErrors.filter(e => e.type === "unknownproperty").length, "#1: not loaded").toBe(2);
    const f = filterOf(survey).getFieldByName("a");
    expect([!!f, f.operators], "#2: still a field, every operator").toEqual([true, undefined]);
  });
});
