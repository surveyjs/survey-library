import { describe, test, expect } from "vitest";
import { createFilter } from "./filter-test-helpers";
import { SurveyModel } from "../../src/survey";
import { QuestionFilterModel } from "../../src/question_filter";
import { FilterItem } from "../../src/filter/filter-item";
import { FilterModal } from "../../src/filter/filter-modal";
import { Serializer } from "../../src/jsonobject";
import { settings } from "../../src/settings";
import { ActionContainer } from "../../src/actions/container";

function action(container: any, id: string): any { return container.getActionById(id); }
const chipIds = ["sv-filter-filters", "sv-filter-field-name", "sv-filter-field-country", "sv-filter-field-age",
  "sv-filter-item-adults", "sv-filter-item-kids"];
function enabledChips(q: QuestionFilterModel): Array<boolean> {
  return chipIds.map((id: string): boolean => action(q.chipsToolbar, id).enabled);
}
// A stand-in for the dialog host, as in filter-toolbars.test.ts.
function stubDialogs(): { calls: Array<any>, restore: () => void } {
  const saved = settings.showDialog;
  const calls: Array<any> = [];
  settings.showDialog = (o: any): any => {
    const dialog: any = { options: o, footerToolbar: new ActionContainer(), model: { hide: () => o.onHide() } };
    calls.push(dialog);
    return dialog;
  };
  return { calls: calls, restore: () => { settings.showDialog = saved; } };
}

describe("QuestionFilterModel: read-only (FR08)", () => {
  test("readOnly in JSON: the chips are disabled and do nothing, the active preset still filters", () => {
    const dialogs = stubDialogs();
    try {
      const q = createFilter({ readOnly: true, defaultItem: "adults" });
      expect(q.isControlReadOnly, "#1").toBe(true);
      expect(q.filterExpression, "#2: the active preset filters").toBe("{age} > 18");
      expect(enabledChips(q), "#3").toEqual([false, false, false, false, false, false]);
      expect(action(q.chipsToolbar, "sv-filter-item-adults").active, "#4: the chips show the active filter").toBe(true);
      action(q.chipsToolbar, "sv-filter-item-kids").action();
      expect(q.activeItemName, "#5: no toggling").toBe("adults");
      action(q.chipsToolbar, "sv-filter-filters").action();
      expect(dialogs.calls.length, "#6: no Filters dialog").toBe(0);
      const age = action(q.chipsToolbar, "sv-filter-field-age");
      age.action();
      expect(age.popupModel.isVisible, "#7: no popup").toBe(false);
      expect(q.isSearchDisabled, "#8: no search typing").toBe(true);
      q.setFieldCondition("age", "greater", 30);
      expect(action(q.clearToolbar, "sv-filter-clear").visible, "#9: no Clear All").toBe(false);
      expect(action(q.chipsToolbar, "sv-filter-more").enabled, "#10: Show More works").not.toBe(false);
    } finally {
      dialogs.restore();
    }
  });
  test("single mode: Save is hidden while locked", () => {
    const q = createFilter({ allowMultipleItems: false, defaultItem: "adults" });
    q.setFieldCondition("age", "greater", 30);
    expect(action(q.clearToolbar, "sv-filter-save").visible, "#1").toBe(true);
    q.readOnly = true;
    expect([action(q.clearToolbar, "sv-filter-save").visible, action(q.clearToolbar, "sv-filter-clear").visible], "#2")
      .toEqual([false, false]);
  });
  test("an editor and the Filters dialog opened from code are read-only, so is the dialog's search", () => {
    const dialogs = stubDialogs();
    try {
      const q = createFilter({ readOnly: true, showSearch: true });
      expect(q.createFastModeEditor("age").isReadOnly, "#1").toBe(true);
      expect(q.createAdvancedModeEditor().isReadOnly, "#2").toBe(true);
      q.showAdvancedEditor();
      const modal: FilterModal = dialogs.calls[0].options.data.holder.modal;
      expect([modal.isReadOnly, modal.isSearchDisabled], "#3").toEqual([true, true]);
      expect(dialogs.calls[0].footerToolbar.actions.length, "#4: nothing to apply").toBe(0);
    } finally {
      dialogs.restore();
    }
  });
  test("enableIf that turns false locks the control, and turning true again unlocks it", () => {
    const survey = new SurveyModel({ elements: [
      { type: "text", name: "x" },
      { type: "filter", name: "f1", enableIf: "{x} = 1", fields: [{ name: "age" }],
        items: [{ name: "adults", expression: "{age} > 18" }] }] });
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    expect([q.isControlReadOnly, action(q.chipsToolbar, "sv-filter-item-adults").enabled], "#1").toEqual([true, false]);
    survey.setValue("x", 1);
    expect([q.isControlReadOnly, action(q.chipsToolbar, "sv-filter-item-adults").enabled, q.isSearchDisabled], "#2")
      .toEqual([false, true, false]);
    action(q.chipsToolbar, "sv-filter-item-adults").action();
    expect(q.activeItemName, "#3").toBe("adults");
    survey.setValue("x", 2);
    expect([q.isControlReadOnly, action(q.chipsToolbar, "sv-filter-item-adults").enabled], "#4").toEqual([true, false]);
  });
  test("survey display mode and a read-only parent panel do not lock it", () => {
    const survey = new SurveyModel({ elements: [
      { type: "panel", name: "p", readOnly: true, elements: [
        { type: "filter", name: "f1", fields: [{ name: "age" }], items: [{ name: "adults", expression: "{age} > 18" }] }] }] });
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    expect([q.isReadOnly, q.isControlReadOnly], "#1: the panel").toEqual([true, false]);
    survey.mode = "display";
    expect(q.isControlReadOnly, "#2: display mode").toBe(false);
    action(q.chipsToolbar, "sv-filter-item-adults").action();
    expect([q.activeItemName, q.isSearchDisabled], "#3").toEqual(["adults", false]);
  });
  test("a locked control restores its uiState, and an application's calls still work", () => {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1", readOnly: true, fields: [{ name: "age" }],
      items: [{ name: "adults", expression: "{age} > 18" }] }] });
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    survey.uiState = { questions: { f1: { filter: { conditions: [{ field: "age", operator: "less", value: 5 }] } } } };
    expect(q.filterExpression, "#1: restored").toBe("{age} < 5");
    q.setFieldCondition("age", "greater", 30);
    expect(q.filterExpression, "#2: from code").toBe("{age} > 30");
  });
  test("an open field popup is hidden and an open Filters dialog closed when the lock turns on", () => {
    const dialogs = stubDialogs();
    try {
      const q = createFilter();
      const age = action(q.chipsToolbar, "sv-filter-field-age");
      age.action();
      expect(age.popupModel.isVisible, "#1").toBe(true);
      q.readOnly = true;
      expect(age.popupModel.isVisible, "#2").toBe(false);
      q.readOnly = false;
      q.showAdvancedEditor();
      const holder = dialogs.calls[0].options.data.holder;
      const modal: FilterModal = holder.modal;
      q.readOnly = true;
      expect([modal.isDisposed, holder.modal], "#3: closed and released").toEqual([true, undefined]);
      q.showAdvancedEditor();
      expect(dialogs.calls.length, "#4: opens again, read-only").toBe(2);
      expect(dialogs.calls[1].options.data.holder.modal.isReadOnly, "#5").toBe(true);
    } finally {
      dialogs.restore();
    }
  });
  test("in the designer readOnly changes nothing: every click still reports to the designer", () => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({ elements: [{ type: "filter", name: "f1", readOnly: true, fields: [{ name: "age" }],
      items: [{ name: "adults", expression: "{age} > 18" }] }] });
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    const clicked: Array<FilterItem> = [];
    q.setDesignItemClickCallback((item?: FilterItem): void => { clicked.push(item); });
    expect(q.isControlReadOnly, "#1").toBe(false);
    expect(action(q.chipsToolbar, "sv-filter-item-adults").enabled, "#2").not.toBe(false);
    action(q.chipsToolbar, "sv-filter-item-adults").action();
    action(q.chipsToolbar, "sv-filter-filters").action();
    expect(clicked.map((item?: FilterItem): string => !!item ? item.name : ""), "#3").toEqual(["adults", ""]);
  });
  test("the property grid: readOnly and enableIf are shown, readOnlyMode is not", () => {
    const q = createFilter({ readOnly: true });
    const visible = (name: string): boolean => Serializer.findProperty("filter", name).isVisible("", q);
    expect([visible("readOnly"), visible("enableIf"), visible("readOnlyMode")], "#1").toEqual([true, true, false]);
    expect(Serializer.findProperty("html", "readOnly").isVisible("", null), "#2: other non-value questions keep it hidden").toBe(false);
  });
});
