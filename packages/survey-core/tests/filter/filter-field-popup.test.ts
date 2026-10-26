import { describe, test, expect } from "vitest";
import { createFilter } from "./filter-test-helpers";
import { SurveyModel } from "../../src/survey";
import { QuestionFilterModel } from "../../src/question_filter";
import { FilterFieldPopup } from "../../src/filter/filter-field-popup";
import { Action } from "../../src/actions/action";

const fields = [
  { name: "name" },
  { name: "country", fieldType: "dropdown", choices: [
    { value: "de", text: "Germany" }, { value: "fr", text: "France" }, { value: "gb", text: "Great Britain" }] },
  { name: "gender", fieldType: "dropdown", choices: ["male", "female"], filterOperators: ["equal"] },
  { name: "age", fieldType: "text", inputType: "number" },
  { name: "active", fieldType: "boolean", labelTrue: "On", labelFalse: "Off" },
  { name: "strict", fieldType: "boolean", filterOperators: ["equal"] },
  { name: "product", fieldType: "dropdown", choices: ["Chai", "Beer"], allowCustomChoices: true },
  { name: "pick", fieldType: "dropdown", choices: ["Chai", "Beer"], allowCustomChoices: true, filterOperators: ["equal"] },
  { name: "many", fieldType: "dropdown", choices: ["a", "b", "c", "d", "e", "f", "g"] },
  { name: "few", fieldType: "dropdown", choices: ["a", "b", "c", "d", "e", "f"] }
];
function control(over: any = {}): QuestionFilterModel {
  return createFilter(Object.assign({ fields: fields, items: [] }, over));
}
// A popup together with the number of times it asked to be closed.
function open(q: QuestionFilterModel, key: string): { popup: FilterFieldPopup, closed: () => number } {
  let closed = 0;
  const popup = q.createFieldPopup(key, () => { closed++; });
  return { popup: popup, closed: () => closed };
}
function titles(popup: FilterFieldPopup): Array<string> {
  return popup.list.actions.filter((a: Action) => a.visible).map((a: Action) => a.title);
}
function item(popup: FilterFieldPopup, title: string): Action {
  return popup.list.actions.filter((a: Action) => a.title === title)[0];
}
function checked(popup: FilterFieldPopup): Array<string> {
  return popup.list.actions.filter((a: Action) => popup.list.isItemSelected(a)).map((a: Action) => a.title);
}
function headerAction(popup: FilterFieldPopup): Action {
  return popup.headerToolbar.actions[0];
}

describe("FilterFieldPopup: a condition", () => {
  test("the field's operator and value; nothing is written until Apply, which closes the popup", () => {
    const q = control();
    const { popup, closed } = open(q, "age");
    expect([popup.kind, popup.title], "#1").toEqual(["condition", "age"]);
    expect(popup.list, "#2").toBe(undefined);
    popup.editor.survey.getQuestionByName("f0_operator").value = "greater";
    popup.editor.survey.getQuestionByName("f0_value").value = 30;
    expect(q.filterExpression, "#3").toBe("");
    expect(popup.footerToolbar.actions.map((a: Action) => a.title), "#4").toEqual(["Apply"]);
    popup.footerToolbar.actions[0].action();
    expect(q.filterExpression, "#5").toBe("{age} > 30");
    expect(closed(), "#6").toBe(1);
    popup.dispose();
  });
  test("Clear is there while the field has a condition; it clears it and closes", () => {
    const q = control();
    expect(headerAction(open(q, "age").popup).visible, "#1").toBe(false);
    q.setFieldCondition("age", "greater", 30);
    const { popup, closed } = open(q, "age");
    const clear = headerAction(popup);
    expect([clear.title, clear.visible], "#2").toEqual(["Clear", true]);
    clear.action();
    expect(q.getFieldCondition("age"), "#3").toBe(undefined);
    expect(closed(), "#4").toBe(1);
    popup.dispose();
  });
  test("a field fast mode does not show gets no popup", () => {
    const q = control({ fields: [{ name: "age", showInFastMode: false }] });
    expect(q.createFieldPopup("age", () => { }), "#1").toBe(undefined);
  });
});

describe("FilterFieldPopup: a single pick", () => {
  test("the field's values, the condition's one picked; a pick is written at once and closes", () => {
    const q = control();
    q.setFieldCondition("gender", "equal", "male");
    const { popup, closed } = open(q, "gender");
    expect(popup.kind, "#1").toBe("single");
    expect(titles(popup), "#2").toEqual(["male", "female"]);
    expect(checked(popup), "#3").toEqual(["male"]);
    expect(popup.footerToolbar.actions.length, "#4: no Apply").toBe(0);
    popup.list.onItemClick(item(popup, "female"));
    expect(q.getFieldCondition("gender"), "#5").toEqual({ field: "gender", operator: "equal", value: "female" });
    expect(closed(), "#6").toBe(1);
    popup.dispose();
  });
  test("picking the picked value changes nothing", () => {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1", fields: fields, items: [] }] });
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    q.setFieldCondition("gender", "equal", "male");
    let events = 0;
    survey.onFilterChanged.add(() => { events++; });
    const { popup } = open(q, "gender");
    popup.list.onItemClick(item(popup, "male"));
    expect(events).toBe(0);
    popup.dispose();
  });
});

describe("FilterFieldPopup: checkboxes", () => {
  test("anyof's values are checked; checking writes nothing; Apply writes them in the list's order", () => {
    const q = control();
    q.setFieldCondition("country", "anyof", ["gb"]);
    const { popup, closed } = open(q, "country");
    expect(popup.kind, "#1").toBe("multi");
    expect(popup.list.itemComponent, "#2").toBe("sv-filter-list-item");
    expect(checked(popup), "#3").toEqual(["Great Britain"]);
    popup.list.onItemClick(item(popup, "Germany"));
    expect(q.getFieldCondition("country").value, "#4: not yet").toEqual(["gb"]);
    popup.apply();
    expect(q.getFieldCondition("country"), "#5").toEqual({ field: "country", operator: "anyof", value: ["de", "gb"] });
    expect(closed(), "#6").toBe(1);
    popup.dispose();
  });
  test("a checked entry is marked active, so its row is redrawn", () => {
    const q = control();
    q.setFieldCondition("country", "anyof", ["gb"]);
    const { popup } = open(q, "country");
    const actives = () => popup.list.actions.map((a: Action) => !!a.active);
    expect(actives(), "#1").toEqual([false, false, true]);
    popup.list.onItemClick(item(popup, "Germany"));
    expect(actives(), "#2").toEqual([true, false, true]);
    headerAction(popup).action();
    expect(actives(), "#3: Select All").toEqual([true, true, true]);
    popup.dispose();
  });
  test("nothing checked clears the condition", () => {
    const q = control();
    q.setFieldCondition("country", "anyof", ["gb"]);
    const { popup } = open(q, "country");
    popup.list.onItemClick(item(popup, "Great Britain"));
    popup.apply();
    expect(q.getFieldCondition("country")).toBe(undefined);
    popup.dispose();
  });
  test("Select All checks every value and turns into Clear All", () => {
    const q = control();
    const { popup } = open(q, "country");
    const link = headerAction(popup);
    expect(link.title, "#1").toBe("Select All");
    link.action();
    expect(checked(popup), "#2").toEqual(["Germany", "France", "Great Britain"]);
    expect(link.title, "#3").toBe("Clear All");
    link.action();
    expect(checked(popup), "#4").toEqual([]);
    popup.list.onItemClick(item(popup, "Germany"));
    popup.list.onItemClick(item(popup, "France"));
    popup.list.onItemClick(item(popup, "Great Britain"));
    expect(link.title, "#5: checked one by one").toBe("Clear All");
    popup.dispose();
  });
  test("a condition the list cannot show opens empty; Apply replaces it", () => {
    const q = control();
    q.setFieldCondition("country", "noneof", ["de"]);
    const { popup } = open(q, "country");
    expect(checked(popup), "#1").toEqual([]);
    popup.list.onItemClick(item(popup, "France"));
    popup.apply();
    expect(q.getFieldCondition("country"), "#2").toEqual({ field: "country", operator: "anyof", value: ["fr"] });
    popup.dispose();
  });
  test("a boolean: its labels; both checked is notempty, one is equal", () => {
    const q = control();
    const { popup } = open(q, "active");
    expect([popup.kind, titles(popup)], "#1").toEqual(["boolean", ["On", "Off"]]);
    headerAction(popup).action();
    popup.apply();
    expect(q.getFieldCondition("active"), "#2").toEqual({ field: "active", operator: "notempty", value: undefined });
    popup.dispose();
    const second = open(q, "active").popup;
    expect(checked(second), "#3").toEqual(["On", "Off"]);
    second.list.onItemClick(item(second, "On"));
    second.apply();
    expect(q.getFieldCondition("active"), "#4").toEqual({ field: "active", operator: "equal", value: false });
    second.dispose();
  });
  test("a boolean that does not offer notempty has no Select All", () => {
    const { popup } = open(control(), "strict");
    expect(popup.headerToolbar.actions.length).toBe(0);
    popup.dispose();
  });
});

describe("FilterFieldPopup: search and typed values", () => {
  test("the search box shows from 7 values on", () => {
    const q = control();
    const many = open(q, "many").popup;
    const few = open(q, "few").popup;
    expect([many.showSearch, few.showSearch], "#1").toEqual([true, false]);
    expect(many.list.showFilter, "#2: the popup draws the box, not the list").toBe(false);
    many.dispose();
    few.dispose();
  });
  test("a field that takes custom choices: search always; typed text that is no value gives Add", () => {
    const q = control();
    const { popup } = open(q, "product");
    expect(popup.showSearch, "#1").toBe(true);
    expect(titles(popup), "#2").toEqual(["Chai", "Beer"]);
    popup.list.filterString = "Oreo";
    expect(titles(popup), "#3").toEqual(["Chai", "Beer", "Add \"Oreo\"..."]);
    popup.list.filterString = "beer";
    expect(titles(popup), "#4: a known value").toEqual(["Chai", "Beer"]);
    popup.list.filterString = "Oreo";
    popup.list.onItemClick(item(popup, "Add \"Oreo\"..."));
    expect(checked(popup), "#5").toEqual(["Oreo"]);
    expect(popup.list.filterString, "#6").toBe("");
    expect(titles(popup), "#7").toEqual(["Chai", "Beer", "Oreo"]);
    popup.apply();
    expect(q.getFieldCondition("product"), "#8").toEqual({ field: "product", operator: "anyof", value: ["Oreo"] });
    popup.dispose();
  });
  test("a typed value comes back checked, and can be removed", () => {
    const q = control();
    q.setFieldCondition("product", "anyof", ["Chai", "Oreo"]);
    const { popup } = open(q, "product");
    expect(titles(popup), "#1").toEqual(["Chai", "Beer", "Oreo"]);
    expect(checked(popup), "#2").toEqual(["Chai", "Oreo"]);
    expect(item(popup, "Oreo").data.isCustom, "#3").toBe(true);
    popup.removeCustomItem(item(popup, "Oreo"));
    expect(titles(popup), "#4").toEqual(["Chai", "Beer"]);
    popup.apply();
    expect(q.getFieldCondition("product").value, "#5").toEqual(["Chai"]);
    popup.dispose();
  });
  test("a single pick takes the typed text at once", () => {
    const q = control();
    const { popup, closed } = open(q, "pick");
    popup.list.filterString = "Oreo";
    popup.list.onItemClick(item(popup, "Add \"Oreo\"..."));
    expect(q.getFieldCondition("pick"), "#1").toEqual({ field: "pick", operator: "equal", value: "Oreo" });
    expect(closed(), "#2").toBe(1);
    popup.dispose();
  });
});

describe("FilterFieldPopup: read-only and dispose", () => {
  test("in the designer: no links, no Apply, no item can be clicked", () => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({ elements: [{ type: "filter", name: "f1", fields: fields }] });
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    const { popup } = open(q, "country");
    expect([popup.isReadOnly, popup.headerToolbar.actions.length, popup.footerToolbar.actions.length], "#1").toEqual([true, 0, 0]);
    expect(popup.list.isItemDisabled(item(popup, "Germany")), "#2").toBe(true);
    popup.dispose();
  });
  test("Apply on a popup that is already closed and disposed writes nothing", () => {
    const q = control();
    const { popup, closed } = open(q, "country");
    popup.list.onItemClick(item(popup, "Germany"));
    popup.dispose();
    expect(() => popup.apply(), "#1").not.toThrow();
    expect([q.getFieldCondition("country"), closed()], "#2").toEqual([undefined, 0]);
  });
  test("dispose() disposes the editor and the list", () => {
    const q = control();
    const condition = open(q, "age").popup;
    const editor = condition.editor;
    condition.dispose();
    expect(editor.isDisposed, "#1").toBe(true);
    const multi = open(q, "country").popup;
    const list = multi.list;
    multi.dispose();
    expect(list.isDisposed, "#2").toBe(true);
  });
});
