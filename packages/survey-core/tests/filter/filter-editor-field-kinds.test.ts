import { describe, test, expect } from "vitest";
import { createFilter } from "./filter-test-helpers";
import { QuestionFilterModel } from "../../src/question_filter";
import { FilterConditionsEditor } from "../../src/filter/filter-conditions-editor";
import { Action } from "../../src/actions/action";

const fields = [
  { name: "category", fieldType: "dropdown", choices: ["a", "b", "c", "d", "e", "f", "g"] },
  { name: "few", fieldType: "dropdown", choices: ["x", "y"] },
  { name: "many", fieldType: "dropdown", choices: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"] },
  { name: "product", fieldType: "dropdown", choices: ["Chai", "Beer"], allowCustomChoices: true },
  { name: "active", fieldType: "boolean", labelTrue: "On", labelFalse: "Off" },
  { name: "strict", fieldType: "boolean", filterOperators: ["equal"] },
  { name: "gender", fieldType: "dropdown", choices: ["male", "female"], filterOperators: ["equal"] },
  { name: "age", fieldType: "text", inputType: "number" }
];
function control(): QuestionFilterModel {
  return createFilter({ fields: fields, items: [] });
}
// An editor of the Filters dialog over one field: its questions are f0_*.
function editor(q: QuestionFilterModel, name: string, onFieldChanged?: () => void): FilterConditionsEditor {
  return new FilterConditionsEditor(q, [name], { useFieldKinds: true, showFieldTitles: true, onFieldChanged: onFieldChanged });
}
function valueQ(e: FilterConditionsEditor): any { return e.survey.getQuestionByName("f0_value"); }
function moreAction(e: FilterConditionsEditor): Action {
  return <Action>e.survey.getPanelByName("f0").getFooterToolbar().getActionById("sv-filter-show-more");
}
// The values the list shows, without its Select All entry.
function shown(e: FilterConditionsEditor): Array<any> {
  return valueQ(e).visibleChoices.filter((c: any) => c !== valueQ(e).selectAllItem).map((c: any) => c.value);
}

describe("Filter editor field kinds: lists of values", () => {
  test("up to 10 values: checkboxes with Select All, the first 4 until Show More", () => {
    const e = editor(control(), "category");
    expect([valueQ(e).getType(), valueQ(e).showSelectAllItem], "#1").toEqual(["checkbox", true]);
    expect(shown(e), "#2").toEqual(["a", "b", "c", "d"]);
    const more = moreAction(e);
    expect([more.visible, more.title], "#3").toEqual([true, "Show More"]);
    more.action();
    expect([shown(e).length, more.title], "#4").toEqual([7, "Show Less"]);
    more.action();
    expect(shown(e).length, "#5").toBe(4);
    e.dispose();
  });
  test("4 values or fewer: no Show More", () => {
    const e = editor(control(), "few");
    expect([shown(e), moreAction(e).visible]).toEqual([["x", "y"], false]);
    e.dispose();
  });
  test("more than 10 values, or values of one's own: a tagbox", () => {
    const q = control();
    const many = editor(q, "many");
    expect([valueQ(many).getType(), valueQ(many).allowCustomChoices, moreAction(many).visible], "#1").toEqual(["tagbox", false, false]);
    const product = editor(q, "product");
    expect([valueQ(product).getType(), valueQ(product).allowCustomChoices], "#2").toEqual(["tagbox", true]);
    many.dispose();
    product.dispose();
  });
  test("anyof's values are checked; the condition is anyof in the list's order; nothing checked is no condition", () => {
    const q = control();
    q.setFieldCondition("category", "anyof", ["c", "a"]);
    const e = editor(q, "category");
    expect(valueQ(e).value, "#1").toEqual(["c", "a"]);
    expect(e.getCondition("category"), "#2").toEqual({ field: "category", operator: "anyof", value: ["a", "c"] });
    valueQ(e).value = [];
    expect(e.getConditions(), "#3").toEqual([]);
    e.dispose();
  });
  test("a value the field does not list is listed after its values and checked", () => {
    const q = control();
    q.setFieldCondition("few", "anyof", ["zz", "x"]);
    const e = editor(q, "few");
    expect(shown(e), "#1").toEqual(["x", "y", "zz"]);
    expect(e.getCondition("few").value, "#2").toEqual(["x", "zz"]);
    e.dispose();
  });
  test("a boolean: its labels; one checked is equal, both are notempty - where the field offers it", () => {
    const q = control();
    const e = editor(q, "active");
    expect([valueQ(e).getType(), valueQ(e).showSelectAllItem, valueQ(e).visibleChoices.map((c: any) => c.text)], "#1")
      .toEqual(["checkbox", false, ["On", "Off"]]);
    valueQ(e).value = [false];
    expect(e.getCondition("active"), "#2").toEqual({ field: "active", operator: "equal", value: false });
    valueQ(e).value = [true, false];
    expect(e.getCondition("active"), "#3").toEqual({ field: "active", operator: "notempty" });
    const strict = editor(q, "strict");
    valueQ(strict).value = [true, false];
    expect(strict.getConditions(), "#4: no notempty - no condition").toEqual([]);
    e.dispose();
    strict.dispose();
  });
  test("a single pick: a dropdown", () => {
    const q = control();
    q.setFieldCondition("gender", "equal", "male");
    const e = editor(q, "gender");
    expect([valueQ(e).getType(), valueQ(e).value], "#1").toEqual(["dropdown", "male"]);
    valueQ(e).value = "female";
    expect(e.getCondition("gender"), "#2").toEqual({ field: "gender", operator: "equal", value: "female" });
    e.dispose();
  });
});

describe("Filter editor field kinds: an operator and a value", () => {
  test("a condition field: the operator and the value in one row", () => {
    const e = editor(control(), "age");
    const operator = e.survey.getQuestionByName("f0_operator");
    expect([operator.getType(), operator.minWidth], "#1").toEqual(["dropdown", "0px"]);
    expect([valueQ(e).startWithNewLine, valueQ(e).minWidth], "#2").toEqual([false, "0px"]);
    e.dispose();
  });
  test("a condition its list cannot show is shown as an operator and a value", () => {
    const q = control();
    q.setFieldCondition("category", "noneof", ["a"]);
    const e = editor(q, "category");
    expect(e.survey.getQuestionByName("f0_operator").value, "#1").toBe("noneof");
    expect(e.getCondition("category"), "#2").toEqual({ field: "category", operator: "noneof", value: ["a"] });
    e.dispose();
  });
});

describe("Filter editor field kinds: setConditions and onFieldChanged", () => {
  test("setConditions shows other conditions as a new start: no change is reported", () => {
    let changes = 0;
    const e = editor(control(), "category", () => { changes++; });
    e.setConditions([{ field: "category", operator: "anyof", value: ["b"] }]);
    expect([valueQ(e).value, changes, e.isModified], "#1").toEqual([["b"], 0, false]);
    e.setConditions([{ field: "category", operator: "noneof", value: ["b"] }]);
    expect(e.survey.getQuestionByName("f0_operator").value, "#2: another form").toBe("noneof");
    e.setConditions([]);
    expect([valueQ(e).getType(), valueQ(e).isEmpty(), moreAction(e).title], "#3: back to the list").toEqual(["checkbox", true, "Show More"]);
    valueQ(e).value = ["a"];
    expect([changes, e.isModified], "#4: the respondent's change").toEqual([1, true]);
    e.dispose();
  });
});
