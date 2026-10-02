import { describe, test, expect, vi } from "vitest";
import { createFilter } from "./filter-test-helpers";
import { SurveyModel } from "../../src/survey";
import { QuestionFilterModel } from "../../src/question_filter";
import { FilterItem } from "../../src/filter/filter-item";
import { settings } from "../../src/settings";
import { Action } from "../../src/actions/action";
import "../../src/localization/german";

function ids(container: any): Array<string> { return container.actions.map((a: any) => a.id); }
function presets(container: any): Array<any> { return container.actions.filter((a: any) => a.id.indexOf("sv-filter-item-") === 0); }
function action(container: any, id: string): any { return container.getActionById(id); }

describe("FilterToolbars: the presets row", () => {
  test("one action per preset, titled by it, the active one marked; Save and Clear at the end", () => {
    const q = createFilter();
    expect(ids(q.itemsToolbar), "#1").toEqual(["sv-filter-item-adults", "sv-filter-item-kids", "sv-filter-save", "sv-filter-clear"]);
    expect(presets(q.itemsToolbar).map((a: any) => a.title), "#2").toEqual(["adults", "kids"]);
    expect(presets(q.itemsToolbar).some((a: any) => a.active), "#3").toBe(false);
    presets(q.itemsToolbar)[1].action();
    expect(q.activeItemName, "#4").toBe("kids");
    expect(presets(q.itemsToolbar).map((a: any) => !!a.active), "#5").toEqual([false, true]);
    presets(q.itemsToolbar)[1].action();
    expect(q.activeItemName, "#6: clicking the active one clears it").toBe("");
  });
  test("a preset added, removed or retitled is reflected", () => {
    const q = createFilter();
    const toolbar = q.itemsToolbar;
    q.items[0].title = "Adults";
    expect(presets(toolbar)[0].title, "#1").toBe("Adults");
    q.items.push(new FilterItem("teens"));
    expect(presets(toolbar).map((a: any) => a.id), "#2").toEqual(["sv-filter-item-adults", "sv-filter-item-kids", "sv-filter-item-teens"]);
    q.items.splice(0, 1);
    expect(presets(toolbar).map((a: any) => a.id), "#3").toEqual(["sv-filter-item-kids", "sv-filter-item-teens"]);
  });
  test("Save and Clear follow canSaveActiveItem / canClearActiveItem on every path", () => {
    const q = createFilter();
    const save = action(q.itemsToolbar, "sv-filter-save");
    const clear = action(q.itemsToolbar, "sv-filter-clear");
    expect([save.visible, clear.visible], "#1: nothing to save or clear").toEqual([false, false]);
    q.toggleItem("adults");
    expect([save.visible, clear.visible], "#2: a preset is on").toEqual([false, true]);
    q.setFieldCondition("age", "greater", 30);
    expect([save.visible, clear.visible], "#3: an edit over it").toEqual([true, true]);
    save.action();
    expect(q.activeItem.expression, "#4: saved into the preset").toBe("{age} > 30");
    expect(save.visible, "#5").toBe(false);
    clear.action();
    expect([save.visible, clear.visible, q.activeItemName], "#6").toEqual([false, false, ""]);
  });
  test("Clear keeps to the right when Save is hidden", () => {
    const q = createFilter();
    const save = action(q.itemsToolbar, "sv-filter-save");
    const clear = action(q.itemsToolbar, "sv-filter-clear");
    q.toggleItem("adults");
    expect([save.needSpace, clear.needSpace], "#1: Save hidden, Clear takes the space").toEqual([false, true]);
    q.setFieldCondition("age", "greater", 30);
    expect([save.needSpace, clear.needSpace], "#2: Save shown, it takes the space").toEqual([true, false]);
  });
  test("single mode: no presets in the row, Save and Clear still come and go with the edits", () => {
    const q = createFilter({ allowMultipleItems: false });
    expect(presets(q.itemsToolbar).length, "#1").toBe(0);
    expect(q.itemsToolbar.hasVisibleActions, "#2").toBe(false);
    q.setFieldCondition("age", "greater", 30);
    expect(action(q.itemsToolbar, "sv-filter-clear").visible, "#3").toBe(true);
    expect(q.itemsToolbar.hasVisibleActions, "#4").toBe(true);
  });
  test("design mode has no Save or Clear", () => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({ elements: [{ type: "filter", name: "f1", fields: [{ name: "age" }], items: [{ name: "p", expression: "{age} > 1" }] }] });
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    expect(ids(q.itemsToolbar), "#1").toEqual(["sv-filter-item-p"]);
  });
});

describe("FilterToolbars: the fields row", () => {
  test("a badge per fast mode field, titled by its condition; Advanced last", () => {
    const q = createFilter({ items: [] });
    expect(ids(q.fieldsToolbar), "#1").toEqual(["sv-filter-field-name", "sv-filter-field-country", "sv-filter-field-age", "sv-filter-advanced"]);
    const badge = action(q.fieldsToolbar, "sv-filter-field-age");
    expect(badge.title, "#2").toBe("age");
    expect(!!badge.active, "#3").toBe(false);
    q.setFieldCondition("age", "greater", 18);
    expect(badge.title, "#4").toBe("age: Greater than 18");
    expect(badge.active, "#5").toBe(true);
    q.clearFieldCondition("age");
    expect([!!badge.active, badge.title], "#6").toEqual([false, "age"]);
  });
  test("a badge's popup holds a Clear action that is shown while the field has a condition", () => {
    const q = createFilter({ items: [] });
    const badge = action(q.fieldsToolbar, "sv-filter-field-age");
    const actions = badge.popupModel.contentComponentData.holder.actions;
    const clear = action(actions, "sv-filter-clear-age");
    expect(ids(actions), "#1").toEqual(["sv-filter-clear-age"]);
    expect(clear.title, "#2").toBe("Clear");
    expect(clear.visible, "#3").toBe(false);
    q.setFieldCondition("age", "greater", 18);
    expect(clear.visible, "#4").toBe(true);
    q.clearFieldCondition("age");
    expect(clear.visible, "#5").toBe(false);
  });
  test("Clear in a badge's popup clears the field's condition and closes the popup", () => {
    const q = createFilter({ items: [] });
    q.setFieldCondition("age", "greater", 18);
    const badge = action(q.fieldsToolbar, "sv-filter-field-age");
    const holder = badge.popupModel.contentComponentData.holder;
    badge.action();
    const editor = holder.editor;
    action(holder.actions, "sv-filter-clear-age").action();
    expect(q.getFieldCondition("age"), "#1").toBe(undefined);
    expect(badge.popupModel.isVisible, "#2").toBe(false);
    expect(editor.isDisposed, "#3").toBe(true);
    expect(badge.title, "#4").toBe("age");
  });
  test("Clear shows up as soon as a value is entered in the open popup", () => {
    const q = createFilter({ items: [] });
    const badge = action(q.fieldsToolbar, "sv-filter-field-age");
    const holder = badge.popupModel.contentComponentData.holder;
    badge.action();
    const clear = action(holder.actions, "sv-filter-clear-age");
    expect(clear.visible, "#1").toBe(false);
    holder.editor.survey.getQuestionByName("f0_value").value = 30;
    expect(clear.visible, "#2").toBe(true);
  });
  test("a badge's popup creates its field's editor on show and disposes it on hide", () => {
    const q = createFilter({ items: [] });
    const badge = action(q.fieldsToolbar, "sv-filter-field-country");
    const popup = badge.popupModel;
    const holder = popup.contentComponentData.holder;
    expect(badge.component, "#1").toBe("sv-action-bar-item-dropdown");
    expect(holder.editor, "#2").toBe(undefined);
    badge.action();
    expect(popup.isVisible, "#3: the badge opens its popup").toBe(true);
    const editor = holder.editor;
    expect(editor.fieldNames, "#4").toEqual(["country"]);
    popup.isVisible = false;
    expect(holder.editor, "#5").toBe(undefined);
    expect(editor.isDisposed, "#6").toBe(true);
  });
  test("a badge moved into the overflow menu opens the advanced dialog instead of its popup", () => {
    const saved = settings.showDialog;
    let options: any;
    settings.showDialog = (o: any): any => { options = o; return { model: { hide: () => o.onHide() } }; };
    try {
      const q = createFilter({ items: [] });
      const badge = action(q.fieldsToolbar, "sv-filter-field-country");
      badge.mode = "popup";
      badge.action();
      expect(badge.popupModel.isVisible, "#1").toBe(false);
      expect(!!options && options.data.holder.isAdvanced, "#2").toBe(true);
      options.onHide();
    } finally {
      settings.showDialog = saved;
    }
  });
  test("rebuilding the row closes an open popup and disposes its editor", () => {
    const q = createFilter({ items: [] });
    const badge = action(q.fieldsToolbar, "sv-filter-field-country");
    badge.action();
    const editor = badge.popupModel.contentComponentData.holder.editor;
    q.fields.splice(1, 1);
    expect(editor.isDisposed, "#1").toBe(true);
    expect(ids(q.fieldsToolbar).indexOf("sv-filter-field-country"), "#2").toBe(-1);
    expect(ids(q.fieldsToolbar).indexOf("sv-filter-field-age") > -1, "#3: the others stay").toBe(true);
  });
  test("no clear action over a preset that cannot be edited; Advanced follows allowAdvancedMode; no badges without fast mode", () => {
    const q = createFilter({ items: [{ name: "ai", type: "ai", expression: "{age} > 18" }] });
    q.activeItemName = "ai";
    expect(action(q.fieldsToolbar, "sv-filter-field-age").title, "#1: the badge still says what the preset does").toBe("age: Greater than 18");
    const holder = action(q.fieldsToolbar, "sv-filter-field-age").popupModel.contentComponentData.holder;
    expect(action(holder.actions, "sv-filter-clear-age").visible, "#2").toBe(false);
    q.allowAdvancedMode = false;
    expect(action(q.fieldsToolbar, "sv-filter-advanced").visible, "#3").toBe(false);
    q.allowAdvancedMode = true;
    q.allowFastMode = false;
    expect(ids(q.fieldsToolbar), "#4").toEqual(["sv-filter-advanced"]);
  });
  test("disposing the control releases an open editor", () => {
    const q = createFilter({ items: [] });
    const badge = action(q.fieldsToolbar, "sv-filter-field-age");
    badge.action();
    const holder = badge.popupModel.contentComponentData.holder;
    const editor = holder.editor;
    const clear = action(holder.actions, "sv-filter-clear-age");
    q.dispose();
    expect(editor.isDisposed, "#1").toBe(true);
    expect(clear.isDisposed, "#2: the popup's actions go with it").toBe(true);
  });
});
describe("FilterToolbars: the advanced dialog", () => {
  test("opens through settings.showDialog, applies on Apply and releases the editor on hide", () => {
    const saved = settings.showDialog;
    let options: any;
    let calls = 0;
    settings.showDialog = (o: any): any => { options = o; calls++; return { model: { hide: () => o.onHide() } }; };
    try {
      const q = createFilter({ items: [] });
      action(q.fieldsToolbar, "sv-filter-advanced").action();
      expect(options.componentName, "#1").toBe("sv-filter-conditions-editor");
      const editor = options.data.holder.editor;
      expect(options.data.holder.isAdvanced, "#2").toBe(true);
      expect(editor.fieldNames, "#3").toEqual(["name", "country", "age"]);
      q.showAdvancedEditor();
      expect(calls, "#4: one dialog at a time").toBe(1);
      editor.survey.getQuestionByName("f2_operator").value = "greater";
      editor.survey.getQuestionByName("f2_value").value = 30;
      expect(options.onApply(), "#5").toBe(true);
      expect(q.filterExpression, "#6").toBe("{age} > 30");
      options.onHide();
      expect(editor.isDisposed, "#7").toBe(true);
      expect(options.data.holder.editor, "#8").toBe(undefined);
      q.showAdvancedEditor();
      expect(calls, "#9").toBe(2);
      expect(options.data.holder.editor !== editor && !!options.data.holder.editor, "#10: a fresh editor").toBe(true);
      options.onHide();
    } finally {
      settings.showDialog = saved;
    }
  });
  test("without settings.showDialog there is no dialog to open", () => {
    const saved = settings.showDialog;
    settings.showDialog = undefined;
    try {
      const q = createFilter({ items: [] });
      expect(() => q.showAdvancedEditor(), "#1").not.toThrow();
    } finally {
      settings.showDialog = saved;
    }
  });
});

describe("QuestionFilterModel: what the renderer shows besides the toolbars", () => {
  test("noteText: a preset that cannot be edited, a preset with no conditions to show, nothing else", () => {
    const q = createFilter({ items: [{ name: "ai", type: "ai", expression: "{age} > 18" },
      { name: "raw", expression: "{age} < 18 or {age} > 35" }, { name: "plain", expression: "{age} > 18" }] });
    expect(q.noteText, "#1: no preset").toBe("");
    q.activeItemName = "ai";
    expect(q.noteText, "#2").toBe("This preset cannot be edited.");
    q.activeItemName = "raw";
    expect(q.noteText, "#3").toBe("This preset has no editable conditions: the first edit starts a new filter.");
    q.setFieldCondition("age", "greater", 5);
    expect(q.noteText, "#4: edited, it has conditions now").toBe("");
    q.activeItemName = "plain";
    expect(q.noteText, "#5").toBe("");
  });
  test("the search box is drawn the way a text question is", () => {
    const q = createFilter({ showSearch: true });
    expect(q.searchCss, "#1").toEqual({ root: "sd-formbox sd-text", control: "sd-formbox__input" });
  });
  test("the search box's placeholder names the fields it searches", () => {
    const q = createFilter({ showSearch: true, fields: [{ name: "name", title: "Product" },
      { name: "country", title: "Country", fieldType: "dropdown", choices: ["de"] }, { name: "age", fieldType: "text", inputType: "number" }] });
    expect(q.searchPlaceholder, "#1: every field").toBe("Search by Product, Country, age");
    q.searchFields = ["country", "name"];
    expect(q.searchPlaceholder, "#2: the searchFields, in their order").toBe("Search by Country, Product");
    q.searchFields = ["nosuchfield"];
    expect(q.searchPlaceholder, "#3: no field to name, the library's own").toBe("Type to search...");
  });
  test("a locale change retitles Clear, the presets and the badges", () => {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1",
      fields: [{ name: "age", fieldType: "text", inputType: "number" }],
      items: [{ name: "adults", title: { default: "Adults", de: "Erwachsene" }, expression: "{age} > 18" }] }] });
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    const clear = action(q.itemsToolbar, "sv-filter-clear");
    const preset = action(q.itemsToolbar, "sv-filter-item-adults");
    q.toggleItem("adults");
    const badge = action(q.fieldsToolbar, "sv-filter-field-age");
    expect([clear.title, preset.title, badge.title], "#1").toEqual(["Clear", "Adults", "age: Greater than 18"]);
    survey.locale = "de";
    expect(clear.title, "#2").toBe("Auswahl entfernen");
    expect(q.items[0].title, "#3: the preset itself speaks the survey's locale").toBe("Erwachsene");
    expect(preset.title, "#4").toBe("Erwachsene");
    survey.locale = "";
    expect([clear.title, preset.title, badge.title], "#5").toEqual(["Clear", "Adults", "age: Greater than 18"]);
  });
});

describe("FilterToolbars: the overflow menu", () => {
  // An adaptive container's "..." menu makes its items anew from each hidden action's innerItem, the
  // options the action was created from - the copy made here is the one the menu makes.
  test("a copy made from an action's innerItem shows the action's current state", () => {
    const q = createFilter();
    q.toggleItem("adults");
    q.setFieldCondition("age", "greater", 30);
    const badge = new Action(action(q.fieldsToolbar, "sv-filter-field-age").innerItem);
    expect([badge.title, badge.active], "#1").toEqual(["age: Greater than 30", true]);
    const preset = new Action(action(q.itemsToolbar, "sv-filter-item-adults").innerItem);
    expect([preset.title, preset.active], "#3").toEqual(["adults", true]);
    const save = new Action(action(q.itemsToolbar, "sv-filter-save").innerItem);
    expect(save.visible, "#4").toBe(true);
    q.clearFieldCondition("age");
    const cleared = new Action(action(q.fieldsToolbar, "sv-filter-field-age").innerItem);
    expect([cleared.title, !!cleared.active], "#5").toEqual(["age", false]);
  });
});

describe("FilterToolbars: review fixes", () => {
  test("a badge's copy in the overflow menu is a plain menu item: no dropdown component, no popup of its own", () => {
    const q = createFilter({ items: [] });
    const copy = new Action(action(q.fieldsToolbar, "sv-filter-field-age").innerItem);
    expect(copy.component, "#1").toBeFalsy();
    expect(copy.popupModel, "#2").toBeFalsy();
    const badge = action(q.fieldsToolbar, "sv-filter-field-age");
    expect(badge.component, "#3: the badge itself still is a dropdown").toBe("sv-action-bar-item-dropdown");
    expect(!!badge.popupModel, "#4").toBe(true);
  });
  test("a badge whose popup is open is kept out of the overflow menu", () => {
    const q = createFilter({ items: [] });
    const badge = action(q.fieldsToolbar, "sv-filter-field-age");
    expect(!!badge.disableHide, "#1").toBe(false);
    badge.action();
    expect(badge.disableHide, "#2: pinned while open").toBe(true);
    badge.popupModel.isVisible = false;
    expect(!!badge.disableHide, "#3: released when closed").toBe(false);
  });
  test("copies of a preset's action do not subscribe to the preset's own title", () => {
    const q = createFilter();
    const preset = action(q.itemsToolbar, "sv-filter-item-adults");
    const before = q.items[0].locTitle.onStringChanged.length;
    for (let i = 0; i < 10; i++) {
      new Action(preset.innerItem);
    }
    expect(q.items[0].locTitle.onStringChanged.length, "#1").toBe(before);
    q.items[0].title = "Adults";
    expect(preset.title, "#2: a retitled preset still reaches its button").toBe("Adults");
  });
  test("one update reads the field list a constant number of times, however many fields there are", () => {
    const fields: Array<any> = [];
    for (let i = 0; i < 20; i++) fields.push({ name: "f" + i, fieldType: "text", inputType: "number" });
    const q = createFilter({ fields: fields, items: [] });
    q.setFieldCondition("f3", "greater", 1);
    expect(action(q.fieldsToolbar, "sv-filter-field-f3").title, "#1").toBe("f3: Greater than 1");
    const spy = vi.spyOn(q, "getFilterFields");
    q.allowAddItems = false;
    const calls = spy.mock.calls.length;
    spy.mockRestore();
    expect(calls <= 4, "#2: calls = " + calls).toBe(true);
  });
});
