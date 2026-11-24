import { describe, test, expect } from "vitest";
import { createFilter } from "./filter-test-helpers";
import { FilterConditionsEditor } from "../../src/filter/filter-conditions-editor";
import { Question } from "../../src/question";

// A filter input's id (sq_<n>i) is the same in every survey, and a browser offers what was typed into
// an input with that id on any site - so the filter's own inputs turn the browser's suggestions off.
const autocomplete = (q: Question): string => (<any>q).autocomplete;
const valueQ = (editor: FilterConditionsEditor): Question => editor.survey.getQuestionByName("f0_value");
const age = { name: "age", fieldType: "text", inputType: "number" };

describe("Filter inputs and the browser's autocomplete", () => {
  test("a field's value editor turns it off, and so does the one made for a new operator", () => {
    const q = createFilter({ presets: [], fields: [age] });
    const editor = q.createQuickFilterEditor("age");
    expect(autocomplete(valueQ(editor)), "#1").toBe("off");
    editor.survey.getQuestionByName("f0_operator").value = "less";
    expect(autocomplete(valueQ(editor)), "#2: the editor made for the new operator").toBe("off");
    editor.dispose();
  });
  test("a field whose author set autocomplete keeps it", () => {
    const q = createFilter({ presets: [], fields: [{ name: "customer", fieldType: "text", autocomplete: "name" }] });
    const editor = q.createQuickFilterEditor("customer");
    expect(autocomplete(valueQ(editor))).toBe("name");
    editor.dispose();
  });
  test("the All Filters editor's search box turns it off", () => {
    const q = createFilter({ presets: [], showSearchBar: true, fields: [age] });
    const editor = q.createAllFiltersEditor();
    expect(autocomplete(editor.survey.getQuestionByName("search"))).toBe("off");
    editor.dispose();
  });
  test("the preset name of Save as and of a preset dialog turns it off", () => {
    const q = createFilter({ presets: [], allowAddPresets: true, fields: [age] });
    q.setFieldCondition("age", "greater", 60);
    const popup = q.createSaveAsPopup(() => { });
    const dialog = q.createAddPresetDialog([]);
    expect([autocomplete(popup.survey.getQuestionByName("presetTitle")),
      autocomplete(dialog.form.getQuestionByName("presetTitle"))]).toEqual(["off", "off"]);
    popup.dispose();
    dialog.dispose();
  });
});
