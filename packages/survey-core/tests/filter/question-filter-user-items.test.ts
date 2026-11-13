import { describe, test, expect } from "vitest";
import { createFilter } from "./filter-test-helpers";
import { SurveyModel } from "../../src/survey";
import { QuestionFilterModel } from "../../src/question_filter";
import { Action } from "../../src/actions/action";

// Presets the respondent adds, renames, edits, deletes and resets (the Add Preset and Edit Presets
// dialogs): the control's API they go through.
const presets = [
  { name: "adults", title: "Adults", expression: "{age} > 18" },
  { name: "germans", expression: "{country} = 'de'" },
  { name: "edges", expression: "{age} < 18 or {age} > 35" }];
function control(over: any = {}): QuestionFilterModel {
  return createFilter(Object.assign({ items: presets }, over));
}
function trackEvents(q: QuestionFilterModel): { filter: number, uiState: number } {
  const survey = <SurveyModel>q.survey;
  const res = { filter: 0, uiState: 0 };
  survey.onFilterChanged.add(() => { res.filter++; });
  survey.onUIStateChanged.add((_, o) => { if (o.changedProperty === "filter") res.uiState++; });
  return res;
}
const names = (q: QuestionFilterModel): Array<string> => q.visibleItems.map((item) => item.name);

describe("QuestionFilterModel.addItem", () => {
  test("adds the respondent's preset after the others, not turned on, with one onUIStateChanged", () => {
    const q = control();
    const events = trackEvents(q);
    const item = q.addItem(" Old ", [{ field: "age", operator: "greater", value: "60" }]);
    expect([item.name, item.title, item.expression], "#1: the value normalized as an edit is").toEqual(["userItem1", "Old", "{age} > 60"]);
    expect(names(q), "#2").toEqual(["adults", "germans", "edges", "userItem1"]);
    expect([q.activeItemName, q.filterExpression, q.isUserItem(item), q.isUserItem(q.items[0])], "#3").toEqual(["", "", true, false]);
    expect(events, "#4").toEqual({ filter: 0, uiState: 1 });
    expect(q.toJSON().items.length, "#5: the JSON is the author's").toBe(3);
    q.toggleItem("userItem1");
    expect([q.activeItem, q.filterExpression], "#6: it is a preset like the others").toEqual([item, "{age} > 60"]);
  });
  test("its name is free among every preset; its chip joins the row", () => {
    const q = control({ items: presets.concat([{ name: "userItem1", expression: "{age} > 1" }]) });
    const chips = q.chipsToolbar;
    expect(q.addItem("A", [{ field: "age", operator: "less", value: 5 }]).name, "#1").toBe("userItem2");
    expect(q.addItem("B", [{ field: "age", operator: "less", value: 6 }]).name, "#2").toBe("userItem3");
    expect(chips.actions.map((a: Action) => a.id).filter((id: string) => id.indexOf("sv-filter-item-userItem") === 0), "#3")
      .toEqual(["sv-filter-item-userItem1", "sv-filter-item-userItem2", "sv-filter-item-userItem3"]);
    expect((<Action>chips.getActionById("sv-filter-item-userItem3")).title, "#4").toBe("B");
  });
  test("nothing is added with no condition the fields can hold, where presets cannot be added, or in the designer", () => {
    const q = control();
    const events = trackEvents(q);
    expect(q.addItem("A", []), "#1").toBe(undefined);
    expect(q.addItem("A", [{ field: "nosuchfield", operator: "equal", value: 1 }]), "#2").toBe(undefined);
    expect(control({ allowAddItems: false }).addItem("A", [{ field: "age", operator: "less", value: 5 }]), "#3").toBe(undefined);
    expect(control({ allowMultipleItems: false }).addItem("A", [{ field: "age", operator: "less", value: 5 }]), "#4").toBe(undefined);
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({ elements: [{ type: "filter", name: "f1", fields: [{ name: "age" }] }] });
    expect((<QuestionFilterModel>survey.getQuestionByName("f1")).addItem("A", [{ field: "age", operator: "equal", value: 5 }]), "#5").toBe(undefined);
    expect([names(q), events.uiState], "#6").toEqual([["adults", "germans", "edges"], 0]);
  });
});

describe("QuestionFilterModel.updateItem", () => {
  test("the respondent's preset takes a new title and conditions; on, it filters by them at once", () => {
    const q = control();
    const item = q.addItem("Old", [{ field: "age", operator: "greater", value: 60 }]);
    q.toggleItem(item);
    const events = trackEvents(q);
    q.updateItem(item.name, "Older", [{ field: "age", operator: "greater", value: 70 }]);
    expect([item.title, q.filterExpression, q.isItemModified(item)], "#1").toEqual(["Older", "{age} > 70", false]);
    expect(events, "#2").toEqual({ filter: 1, uiState: 1 });
    q.updateItem(item.name, "Older", [{ field: "age", operator: "greater", value: 70 }]);
    expect(events, "#3: no change, no event").toEqual({ filter: 1, uiState: 1 });
  });
  test("an authored preset remembers what it was: it is modified until it is the JSON's again", () => {
    const q = control();
    const item = q.getItemByName("adults");
    q.updateItem("adults", "Grown-ups", [{ field: "age", operator: "greater", value: 21 }]);
    expect([item.title, item.expression, q.isItemModified(item), q.canResetItem(item)], "#1")
      .toEqual(["Grown-ups", "{age} > 21", true, true]);
    expect(q.getOriginalItemState("adults"), "#2").toEqual({ title: "Adults", conditions: [{ field: "age", operator: "greater", value: 18 }] });
    q.updateItem("adults", "Adults", [{ field: "age", operator: "greater", value: 18 }]);
    expect([item.title, item.expression, q.isItemModified(item)], "#3: changed back is a reset").toEqual(["Adults", "{age} > 18", false]);
  });
  test("a preset that does not decompose takes a title only; nothing changes one that may not be edited", () => {
    const q = control({ items: presets.concat([{ name: "locked", expression: "{age} > 1", allowEdit: false }]) });
    q.updateItem("edges", "Edges", [{ field: "age", operator: "equal", value: 1 }]);
    expect([q.getItemByName("edges").title, q.getItemByName("edges").expression], "#1: new conditions over one that does not decompose")
      .toEqual(["Edges", "{age} = 1"]);
    q.updateItem("germans", "Germans");
    expect([q.getItemByName("germans").title, q.getItemByName("germans").expression], "#2: no conditions given")
      .toEqual(["Germans", "{country} = 'de'"]);
    q.updateItem("locked", "Unlocked", [{ field: "age", operator: "equal", value: 2 }]);
    expect([q.getItemByName("locked").title, q.isItemModified(q.getItemByName("locked"))], "#3").toEqual(["locked", false]);
  });
});

describe("QuestionFilterModel.resetItem and deleteItem", () => {
  test("reset brings back the JSON's title - localized as it was - and expression; on, it filters by it", () => {
    const q = control({ items: [{ name: "adults", title: { default: "Adults", de: "Erwachsene" }, expression: "{age} > 18" }] });
    const item = q.getItemByName("adults");
    q.updateItem("adults", "Mine", [{ field: "age", operator: "greater", value: 30 }]);
    q.toggleItem("adults");
    (<SurveyModel>q.survey).locale = "de";
    expect(item.title, "#1: the respondent's title in every locale").toBe("Mine");
    const events = trackEvents(q);
    q.resetItem("adults");
    expect([item.title, q.filterExpression, q.isItemModified(item), q.canResetItem(item)], "#2").toEqual(["Erwachsene", "{age} > 18", false, false]);
    expect(events, "#3").toEqual({ filter: 1, uiState: 1 });
    q.resetItem("adults");
    expect(events, "#4: nothing to reset").toEqual({ filter: 1, uiState: 1 });
    (<SurveyModel>q.survey).locale = "";
  });
  test("delete takes the respondent's preset away and hides an authored one; one that is on goes off with the filter", () => {
    const q = control();
    const item = q.addItem("Old", [{ field: "age", operator: "greater", value: 60 }]);
    q.toggleItem("germans");
    const events = trackEvents(q);
    q.deleteItem("germans");
    expect([names(q), q.getItemByName("germans"), q.activeItemName, q.filterExpression], "#1").toEqual([["adults", "edges", "userItem1"], undefined, "", ""]);
    expect(events, "#2").toEqual({ filter: 1, uiState: 1 });
    expect(q.items.length, "#3: the JSON keeps it").toBe(3);
    q.deleteItem(item.name);
    expect([names(q), q.getItemByName(item.name), events.uiState], "#4").toEqual([["adults", "edges"], undefined, 2]);
    expect(q.chipsToolbar.getActionById("sv-filter-item-germans"), "#5: no chip").toBeFalsy();
  });
  test("nothing is deleted that may not be, nor in single mode", () => {
    const q = control({ items: presets.concat([{ name: "kept", expression: "{age} > 1", allowDelete: false }]) });
    q.deleteItem("kept");
    expect(names(q).indexOf("kept"), "#1").toBe(3);
    const single = control({ allowMultipleItems: false });
    single.deleteItem("adults");
    expect(single.activeItem.name, "#2").toBe("adults");
  });
  test("a deleted default preset is not applied, and a new preset never takes a deleted one's name", () => {
    const q = control({ defaultItem: "adults", items: [{ name: "adults", expression: "{age} > 18" }, { name: "userItem1", expression: "{age} > 1" }] });
    q.deleteItem("userItem1");
    q.deleteItem("adults");
    expect([q.activeItemName, q.filterExpression], "#1").toEqual(["", ""]);
    expect(q.addItem("A", [{ field: "age", operator: "less", value: 5 }]).name, "#2").toBe("userItem2");
  });
});

describe("QuestionFilterModel.applyItemEdits and getEditableItems", () => {
  test("several presets changed as one: one onFilterChanged and one onUIStateChanged", () => {
    const q = control();
    q.addItem("Old", [{ field: "age", operator: "greater", value: 60 }]);
    q.updateItem("germans", "Germans");
    q.toggleItem("adults");
    const events = trackEvents(q);
    q.applyItemEdits([
      { name: "adults", title: "Adults", conditions: [{ field: "age", operator: "greater", value: 21 }] },
      { name: "germans", isReset: true },
      { name: "userItem1", isDeleted: true }]);
    expect([names(q), q.filterExpression, q.getItemByName("germans").title], "#1").toEqual([["adults", "germans", "edges"], "{age} > 21", "germans"]);
    expect(events, "#2").toEqual({ filter: 1, uiState: 1 });
    q.applyItemEdits([{ name: "adults", title: "Adults", conditions: [{ field: "age", operator: "greater", value: 21 }] }]);
    expect(events, "#3: no change").toEqual({ filter: 1, uiState: 1 });
  });
  test("the presets that can be changed, deleted or reset", () => {
    const q = control({ items: presets.concat([{ name: "fixed", expression: "{age} > 1", allowEdit: false, allowDelete: false }]) });
    expect(q.getEditableItems().map((item) => item.name), "#1").toEqual(["adults", "germans", "edges"]);
    expect(control({ allowMultipleItems: false }).getEditableItems(), "#2: single mode has no list").toEqual([]);
  });
});
