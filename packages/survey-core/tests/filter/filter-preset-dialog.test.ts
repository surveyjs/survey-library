import { describe, test, expect } from "vitest";
import { createFilter } from "./filter-test-helpers";
import { QuestionFilterModel } from "../../src/question_filter";
import { FilterPresetDialog } from "../../src/filter/filter-preset-dialog";
import { PanelModel } from "../../src/panel";

// The New Preset dialog: the form (the name and a tagbox of the fields the preset contains), the
// fields' editors, and the checks of its Apply.
const presets = [{ name: "adults", title: "Adults", expression: "{age} > 18" }];
function control(over: any = {}): QuestionFilterModel {
  return createFilter(Object.assign({ items: presets }, over));
}
function panel(dialog: FilterPresetDialog): PanelModel {
  return <PanelModel>dialog.form.getPanelByName("contains");
}
function tagbox(dialog: FilterPresetDialog): any {
  return dialog.form.getQuestionByName("presetFields");
}
// The fields the tagbox picks, in its order.
function picked(dialog: FilterPresetDialog): Array<string> {
  return tagbox(dialog).value || [];
}
function errors(dialog: FilterPresetDialog): Array<string> {
  const title = dialog.form.getQuestionByName("presetTitle").errors.map((e) => e.getText());
  return title.concat(!!panel(dialog) ? panel(dialog).errors.map((e) => e.getText()) : []);
}
const conditions = [{ field: "age", operator: "greater", value: 18 }, { field: "country", operator: "anyof", value: ["de"] }];

describe("FilterPresetDialog: what it opens with", () => {
  test("the conditions it is given: their fields picked in the tagbox, in the order of the fields, and their editors", () => {
    const dialog = control().createAddPresetDialog(conditions);
    expect([dialog.title, dialog.form.getValue("presetTitle")], "#1").toEqual(["New Preset", undefined]);
    expect(picked(dialog), "#2").toEqual(["country", "age"]);
    expect(dialog.editor.fieldNames, "#3").toEqual(["country", "age"]);
    expect(dialog.editor.getConditions(), "#4").toEqual([{ field: "country", operator: "anyof", value: ["de"] },
      { field: "age", operator: "greater", value: 18 }]);
    expect(dialog.form.getPanelByName("presetName").title, "#5").toBe("Name");
    expect(panel(dialog).title, "#6").toBe("Contains");
    dialog.dispose();
  });
  test("the tagbox offers every field by its title; its hidden title is its accessible name", () => {
    const dialog = control().createAddPresetDialog([]);
    const q = tagbox(dialog);
    expect([q.getType(), q.parent.name, q.titleLocation, q.title, q.placeholder], "#1")
      .toEqual(["tagbox", "contains", "hidden", "Contains", "Select..."]);
    expect(q.choices.map((c: any) => [c.value, c.text]), "#2").toEqual([["name", "name"], ["country", "country"], ["age", "age"]]);
    dialog.dispose();
  });
  test("no conditions: nothing picked, no editors, and Contains is there to pick a field", () => {
    const dialog = control().createAddPresetDialog([]);
    expect([picked(dialog), dialog.editor], "#1").toEqual([[], undefined]);
    expect([panel(dialog).isVisible, tagbox(dialog).isVisible], "#2").toEqual([true, true]);
    dialog.dispose();
  });
});

describe("FilterPresetDialog: the fields picked", () => {
  test("a field picked gets its editor, empty, after the others, which keep their conditions", () => {
    const dialog = control().createAddPresetDialog([{ field: "age", operator: "greater", value: 18 }]);
    tagbox(dialog).value = ["age", "country"];
    expect(dialog.editor.fieldNames, "#1").toEqual(["age", "country"]);
    expect(dialog.editor.getConditions(), "#2: the new field starts empty, the other keeps its condition")
      .toEqual([{ field: "age", operator: "greater", value: 18 }]);
    dialog.dispose();
  });
  test("a field taken out takes its condition away, and picked again starts empty; none picked, no editors", () => {
    const dialog = control().createAddPresetDialog(conditions);
    tagbox(dialog).value = ["age"];
    expect([dialog.editor.fieldNames, dialog.editor.getConditions()], "#1").toEqual([["age"], [{ field: "age", operator: "greater", value: 18 }]]);
    tagbox(dialog).value = ["age", "country"];
    expect(dialog.editor.getConditions(), "#2: country does not come back with its old values").toEqual([{ field: "age", operator: "greater", value: 18 }]);
    tagbox(dialog).clearValue();
    expect([picked(dialog), dialog.editor], "#3").toEqual([[], undefined]);
    dialog.dispose();
  });
  test("there is no row of its own per field, and no + Add", () => {
    const dialog = control().createAddPresetDialog(conditions);
    expect([panel(dialog).elements.map((e: any) => e.name), panel(dialog).footerActions.length]).toEqual([["presetFields"], 0]);
    dialog.dispose();
  });
});

describe("FilterPresetDialog: Apply", () => {
  test("adds the preset with its title and the editors' conditions, last and not turned on", () => {
    const q = control();
    const dialog = q.createAddPresetDialog(conditions);
    dialog.form.setValue("presetTitle", "  German adults ");
    expect(dialog.apply(), "#1").toBe(true);
    const item = q.visibleItems[1];
    expect([item.title, item.expression, q.activeItemName], "#2").toEqual(["German adults", "{country} anyof ['de'] and {age} > 18", ""]);
    dialog.dispose();
  });
  test("a title that is missing, too long or another preset's, and no condition, are errors and add nothing", () => {
    const q = control();
    const dialog = q.createAddPresetDialog([]);
    expect([dialog.apply(), errors(dialog)], "#1").toEqual([false, ["Response required.", "Add at least one condition."]]);
    dialog.form.setValue("presetTitle", "x".repeat(33));
    dialog.apply();
    expect(errors(dialog)[0], "#2").toBe("Please enter no more than 32 character(s).");
    dialog.form.setValue("presetTitle", " ADULTS ");
    dialog.apply();
    expect(errors(dialog)[0], "#3").toBe("A preset with this name already exists.");
    tagbox(dialog).value = ["age"];
    dialog.form.setValue("presetTitle", "Mine");
    expect([dialog.apply(), q.visibleItems.length], "#4: a field with no value is no condition").toEqual([false, 1]);
    dialog.dispose();
  });
  test("apply() of a closed dialog does nothing", () => {
    const q = control();
    const dialog = q.createAddPresetDialog(conditions);
    dialog.form.setValue("presetTitle", "Mine");
    dialog.dispose();
    expect([dialog.apply(), q.visibleItems.length], "#1").toEqual([false, 1]);
  });
});
