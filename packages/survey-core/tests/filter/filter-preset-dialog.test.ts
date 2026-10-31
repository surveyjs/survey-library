import { describe, test, expect } from "vitest";
import { createFilter } from "./filter-test-helpers";
import { QuestionFilterModel } from "../../src/question_filter";
import { FilterPresetDialog } from "../../src/filter/filter-preset-dialog";
import { PanelModel } from "../../src/panel";
import { Action } from "../../src/actions/action";

// The Add New Preset dialog: the form (the title and a dropdown of fields per row), the fields'
// editors, and the checks of its Apply.
const presets = [{ name: "adults", title: "Adults", expression: "{age} > 18" }];
function control(over: any = {}): QuestionFilterModel {
  return createFilter(Object.assign({ items: presets }, over));
}
function panel(dialog: FilterPresetDialog): PanelModel {
  return <PanelModel>dialog.form.getPanelByName("contains");
}
// The field each row picks, "" for a row that picks none.
function rows(dialog: FilterPresetDialog): Array<string> {
  return panel(dialog).elements.map((row: any): string => row.value || "");
}
function row(dialog: FilterPresetDialog, index: number): any {
  return panel(dialog).elements[index];
}
function addField(dialog: FilterPresetDialog): Action {
  return panel(dialog).footerActions.filter((a: Action): boolean => a.id === "sv-filter-preset-add-field")[0];
}
function errors(dialog: FilterPresetDialog): Array<string> {
  const title = dialog.form.getQuestionByName("presetTitle").errors.map((e) => e.getText());
  return title.concat(!!panel(dialog) ? panel(dialog).errors.map((e) => e.getText()) : []);
}
const conditions = [{ field: "age", operator: "greater", value: 18 }, { field: "country", operator: "anyof", value: ["de"] }];

describe("FilterPresetDialog: what it opens with", () => {
  test("the conditions it is given: a row per field, in the order of the fields, and their editors", () => {
    const dialog = control().createAddPresetDialog(conditions);
    expect([dialog.title, dialog.form.getValue("presetTitle")], "#1").toEqual(["Add New Preset", undefined]);
    expect(rows(dialog), "#2").toEqual(["country", "age"]);
    expect(dialog.editor.fieldNames, "#3").toEqual(["country", "age"]);
    expect(dialog.editor.getConditions(), "#4").toEqual([{ field: "country", operator: "anyof", value: ["de"] },
      { field: "age", operator: "greater", value: 18 }]);
    expect(dialog.form.getPanelByName("presetName").title, "#5").toBe("Preset Name");
    expect([panel(dialog).title, addField(dialog).title, addField(dialog).visible], "#6").toEqual(["Contains", "Add", true]);
    dialog.dispose();
  });
  test("no conditions: no rows and no editors, and Contains is still there to add one", () => {
    const dialog = control().createAddPresetDialog([]);
    expect([rows(dialog), dialog.editor], "#1").toEqual([[], undefined]);
    expect([panel(dialog).isVisible, addField(dialog).visible], "#2").toEqual([true, true]);
    dialog.dispose();
  });
});

describe("FilterPresetDialog: the rows", () => {
  test("+ Add gives an empty row that offers the fields no other row picked; picking one adds its editor, empty", () => {
    const dialog = control().createAddPresetDialog([{ field: "age", operator: "greater", value: 18 }]);
    addField(dialog).action();
    expect(rows(dialog), "#1").toEqual(["age", ""]);
    expect(row(dialog, 1).choices.map((c: any) => c.value), "#2").toEqual(["name", "country"]);
    expect(row(dialog, 0).choices.map((c: any) => c.value), "#3").toEqual(["name", "country", "age"]);
    row(dialog, 1).value = "country";
    expect(dialog.editor.fieldNames, "#4").toEqual(["age", "country"]);
    expect(dialog.editor.getConditions(), "#5: the new field starts empty, the other keeps its condition")
      .toEqual([{ field: "age", operator: "greater", value: 18 }]);
    expect(row(dialog, 0).choices.map((c: any) => c.value), "#6").toEqual(["name", "age"]);
    dialog.dispose();
  });
  test("the x of a row takes it and its condition away; a row given another field starts that field empty", () => {
    const dialog = control().createAddPresetDialog(conditions);
    row(dialog, 0).clearValue();
    expect([rows(dialog), dialog.editor.fieldNames], "#1").toEqual([["age"], ["age"]]);
    row(dialog, 0).value = "country";
    expect([rows(dialog), dialog.editor.getConditions()], "#2: country does not come back with its old values").toEqual([["country"], []]);
    row(dialog, 0).clearValue();
    expect([rows(dialog), dialog.editor], "#3").toEqual([[], undefined]);
    dialog.dispose();
  });
  test("+ Add is gone once every field has a row", () => {
    const dialog = control().createAddPresetDialog(conditions);
    addField(dialog).action();
    expect(addField(dialog).visible, "#1").toBe(false);
    row(dialog, 2).value = "name";
    row(dialog, 1).clearValue();
    expect(addField(dialog).visible, "#2").toBe(true);
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
    addField(dialog).action();
    row(dialog, 0).value = "age";
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
