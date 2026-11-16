import { describe, test, expect } from "vitest";
import { createFilter } from "./filter-test-helpers";
import { SurveyModel } from "../../src/survey";
import { QuestionFilterModel } from "../../src/question_filter";

// "Save as..." at the end of the chips row (filters v2): the conditions the respondent set with no
// preset on, saved as a new preset of theirs - named in the popup under the button - and turned on.
function action(container: any, id: string): any { return container.getActionById(id); }
function ids(container: any): Array<string> { return container.actions.map((a: any) => a.id); }
function saveAsOf(q: QuestionFilterModel): any { return action(q.clearToolbar, "sv-filter-save-as"); }
function openSaveAs(q: QuestionFilterModel): any {
  const saveAs = saveAsOf(q);
  saveAs.action();
  return saveAs.popupModel.contentComponentData.holder.saveAsPopup;
}
function errorsOf(popup: any): Array<string> {
  return popup.survey.getQuestionByName("presetTitle").errors.map((e: any) => e.getText());
}

describe("FilterToolbars: Save as", () => {
  test("stands before Clear All while there are conditions and no preset, where presets may be added", () => {
    const q = createFilter();
    const saveAs = saveAsOf(q);
    expect(ids(q.clearToolbar), "#1").toEqual(["sv-filter-save", "sv-filter-save-as", "sv-filter-clear"]);
    expect([saveAs.visible, saveAs.title], "#2: nothing to save").toEqual([false, "Save as..."]);
    q.setFieldCondition("age", "greater", 18);
    expect(saveAs.visible, "#3").toBe(true);
    q.toggleItem("kids");
    expect(saveAs.visible, "#4: a preset is on").toBe(false);
    q.setFieldCondition("age", "less", 5);
    expect([q.activeItemName, saveAs.visible], "#5: an edit turns the preset off").toEqual(["", true]);
    q.allowAddItems = false;
    expect(saveAs.visible, "#6: presets may not be added").toBe(false);
  });
  test("none in single mode, in the designer or while the control is read-only", () => {
    const single = createFilter({ allowMultipleItems: false });
    single.setFieldCondition("age", "greater", 18);
    expect(saveAsOf(single).visible, "#1").toBe(false);
    const q = createFilter();
    q.setFieldCondition("age", "greater", 18);
    q.readOnly = true;
    expect(saveAsOf(q).visible, "#2").toBe(false);
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({ elements: [{ type: "filter", name: "f1", fields: [{ name: "age" }] }] });
    expect(saveAsOf(<QuestionFilterModel>survey.getQuestionByName("f1")).visible, "#3").toBe(false);
  });
  test("its popup asks for a name; Save adds a preset of the conditions, turns it on and closes the popup", () => {
    const q = createFilter();
    q.setFieldCondition("age", "greater", 60);
    const saveAs = saveAsOf(q);
    const popup = openSaveAs(q);
    expect(saveAs.popupModel.isVisible, "#1").toBe(true);
    expect(popup.footerToolbar.actions.map((a: any) => [a.id, a.title]), "#2").toEqual([["sv-filter-save-as-save", "Save"]]);
    const name = popup.survey.getQuestionByName("presetTitle");
    expect([name.maxLength, name.isVisible], "#3").toEqual([32, true]);
    name.value = " Seniors ";
    popup.footerToolbar.actions[0].action();
    const item = q.getItemByName("userItem1");
    expect([item.title, item.expression, q.isUserItem(item)], "#4").toEqual(["Seniors", "{age} > 60", true]);
    expect([q.activeItemName, saveAs.popupModel.isVisible, saveAs.visible], "#5").toEqual(["userItem1", false, false]);
    expect(popup.isDisposed, "#6: made when the popup shows, disposed when it hides").toBe(true);
  });
  test("the name is required, at most 32 characters long and no other preset's: nothing is saved otherwise", () => {
    const q = createFilter();
    q.setFieldCondition("age", "greater", 60);
    const popup = openSaveAs(q);
    const save = (): void => { popup.footerToolbar.actions[0].action(); };
    save();
    expect(errorsOf(popup), "#1").toEqual(["Response required."]);
    popup.survey.setValue("presetTitle", "ADULTS ");
    save();
    expect(errorsOf(popup), "#2").toEqual(["A preset with this name already exists."]);
    popup.survey.setValue("presetTitle", "x".repeat(33));
    save();
    expect(errorsOf(popup), "#3").toEqual(["Please enter no more than 32 character(s)."]);
    expect([q.visibleItems.length, saveAsOf(q).popupModel.isVisible, popup.isDisposed], "#4").toEqual([2, true, false]);
  });
  test("opens as a sheet on a phone, under the button elsewhere", () => {
    const q = createFilter();
    q.setFieldCondition("age", "greater", 60);
    const saveAs = saveAsOf(q);
    saveAs.action();
    expect(saveAs.popupModel.displayMode, "#1").toBe("popup");
    saveAs.popupModel.hide();
    q.setIsMobile(true);
    saveAs.action();
    expect([saveAs.popupModel.displayMode, saveAs.popupModel.cssClass], "#2").toEqual(["overlay", "sv-popup--sheet sd-filter-popup-sheet"]);
  });
});
