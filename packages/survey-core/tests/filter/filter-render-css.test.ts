import { describe, test, expect } from "vitest";
import { createFilter } from "./filter-test-helpers";
import { SurveyModel } from "../../src/survey";
import { QuestionFilterModel } from "../../src/question_filter";
import { FilterFieldPopup } from "../../src/filter/filter-field-popup";
import { Action } from "../../src/actions/action";

// The classes and states the renderers read off the models instead of composing them each.
const fields = [
  { name: "country", fieldType: "dropdown", choices: [
    { value: "de", text: "Germany" }, { value: "fr", text: "France" }] },
  { name: "age", fieldType: "text", inputType: "number" }
];
function item(popup: FilterFieldPopup, title: string): Action {
  return popup.list.actions.filter((a: Action) => a.title === title)[0];
}
function designControl(): QuestionFilterModel {
  const survey = new SurveyModel();
  survey.setDesignMode(true);
  survey.fromJSON({ elements: [{ type: "filter", name: "f1", fields: fields, showSearch: true }] });
  return <QuestionFilterModel>survey.getQuestionByName("f1");
}

describe("Filter Control: the renderers' classes", () => {
  test("the root: the mobile class on a phone", () => {
    const q = createFilter({ fields: fields });
    expect(q.getQuestionRootCss(), "#1").toBe("sd-filter");
    q.setIsMobile(true);
    expect(q.getQuestionRootCss(), "#2").toBe("sd-filter sd-filter--mobile");
  });
  test("the search box's root: the text input's root and the control's own class", () => {
    const q = createFilter({ fields: fields, showSearch: true });
    expect(q.searchCss.root.length > 0, "#0: the survey's text root").toBe(true);
    expect(q.searchRootCss, "#1").toBe(q.searchCss.root + " sd-filter__search");
  });
  test("the chips row: expanded by Show More; a disposed control builds no layout", () => {
    const q = createFilter({ fields: fields });
    expect(q.chipsCss, "#1").toBe("sd-filter__chips");
    q.chipsLayout.isExpanded = true;
    expect(q.chipsCss, "#2").toBe("sd-filter__chips sd-filter__chips--expanded");
    const layout = q.chipsLayout;
    q.dispose();
    expect(q.chipsCss, "#3").toBe("sd-filter__chips");
    expect(layout.isDisposed, "#4: the old layout").toBe(true);
    expect((<any>q).toolbarsValue?.layoutValue, "#5: no new layout").toBeUndefined();
  });
  test("a list entry's check: checked by its active flag, read-only in the designer", () => {
    const q = createFilter({ fields: fields, items: [] });
    q.setFieldCondition("country", "anyof", ["fr"]);
    const popup = q.createFieldPopup("country", () => { });
    expect(popup.getItemCheckCss(item(popup, "Germany")), "#1").toBe("sd-checkbox sd-filter-popup__check");
    expect(popup.getItemCheckCss(item(popup, "France")), "#2").toBe("sd-checkbox sd-filter-popup__check sd-checkbox--checked");
    popup.list.onItemClick(item(popup, "Germany"));
    expect(popup.getItemCheckCss(item(popup, "Germany")), "#3").toBe("sd-checkbox sd-filter-popup__check sd-checkbox--checked");
    popup.dispose();
    const design = designControl();
    const designPopup = design.createFieldPopup("country", () => { });
    expect(designPopup.getItemCheckCss(item(designPopup, "Germany")), "#4").toBe("sd-checkbox sd-filter-popup__check sd-checkbox--readonly");
    designPopup.dispose();
  });
  test("the Filters dialog's fields", () => {
    const q = createFilter({ fields: fields });
    const modal = q.createFilterModal();
    expect(modal.editorCss, "#1").toBe("sd-filter-editor sd-filter-modal__editor");
    modal.dispose();
  });
  test("a preset dialog: the control's classes, its content, form and fields", () => {
    const q = createFilter({ fields: fields });
    const dialog = q.createAddPresetDialog([]);
    expect(dialog.cssClasses, "#1").toBe(q.cssClasses);
    expect(dialog.contentCss, "#2").toBe("sd-filter-modal__content sd-filter-preset-dialog__content");
    expect(dialog.formCss, "#3").toBe("sd-filter-editor sd-filter-preset-dialog__form");
    expect(dialog.editorCss, "#4").toBe("sd-filter-editor sd-filter-modal__editor");
    dialog.dispose();
    const edit = q.createEditPresetsDialog();
    expect(edit.contentCss, "#5: Edit Presets").toBe("sd-filter-modal__content sd-filter-preset-dialog__content");
    edit.dispose();
  });
});

describe("Filter Control: the search boxes' disabled state", () => {
  test("the control's box is off in the designer only", () => {
    expect(createFilter({ fields: fields, showSearch: true }).isSearchDisabled, "#1").toBe(false);
    const single = createFilter({ fields: fields, showSearch: true, allowMultipleItems: false,
      items: [{ name: "smart", kind: "ai", expression: "{age} > 18" }], defaultItem: "smart" });
    expect(single.isSearchDisabled, "#2: an active AI preset in single mode").toBe(false);
    expect(designControl().isSearchDisabled, "#3").toBe(true);
  });
  test("the Filters dialog's box is off while its conditions can't be edited", () => {
    const q = createFilter({ fields: fields, showSearch: true });
    const modal = q.createFilterModal();
    expect(modal.isSearchDisabled, "#1").toBe(false);
    modal.dispose();
    const single = createFilter({ fields: fields, showSearch: true, allowMultipleItems: false,
      items: [{ name: "smart", kind: "ai", expression: "{age} > 18" }], defaultItem: "smart" });
    const singleModal = single.createFilterModal();
    expect(singleModal.isReadOnly, "#2").toBe(true);
    expect(singleModal.isSearchDisabled, "#3: an active AI preset in single mode").toBe(true);
    singleModal.dispose();
  });
});
