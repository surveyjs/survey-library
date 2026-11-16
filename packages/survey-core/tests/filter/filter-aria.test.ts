import { describe, test, expect } from "vitest";
import { createFilter } from "./filter-test-helpers";
import { Action } from "../../src/actions/action";

// What a screen reader is told about the toggles of the Filter Control: the presets' list is a menu of
// radio items, a preset chip of the Filters dialog is a checkbox (aria-checked is not allowed on the
// default button role), and a dialog section is a group named by its visible title.
describe("Filter Control: ARIA", () => {
  test("the presets' list is a menu of radio items, the active preset's checked", () => {
    const q = createFilter();
    const list = (<Action>q.chipsToolbar.getActionById("sv-filter-preset")).popupModel.contentComponentData.model;
    const adults = list.getActionById("sv-filter-item-adults");
    const kids = list.getActionById("sv-filter-item-kids");
    expect([list.listRole, list.listItemRole, list.getA11yItemAriaChecked(adults), list.getA11yItemAriaChecked(kids)], "#1")
      .toEqual(["menu", "menuitemradio", "false", "false"]);
    q.toggleItem("adults");
    expect([list.getA11yItemAriaChecked(adults), list.getA11yItemAriaChecked(kids)], "#2").toEqual(["true", "false"]);
    const chip = <Action>q.chipsToolbar.getActionById("sv-filter-preset");
    const age = <Action>q.chipsToolbar.getActionById("sv-filter-field-age");
    expect([chip.ariaRole, chip.ariaChecked, age.ariaRole, age.ariaChecked], "#3: the chips open popups, no checked state")
      .toEqual(["button", undefined, "button", undefined]);
  });
  test("a preset chip in the Filters dialog is a checkbox too", () => {
    const q = createFilter({ defaultItem: "kids" });
    const modal = q.createFilterModal();
    const chip = (name: string): Action => <Action>modal.presetsToolbar.getActionById("sv-filter-modal-item-" + name);
    expect([chip("adults").ariaRole, chip("adults").ariaChecked, chip("kids").ariaChecked], "#1").toEqual(["checkbox", false, true]);
    modal.togglePreset(q.getItemByName("adults"));
    expect([chip("adults").ariaChecked, chip("kids").ariaChecked], "#2").toEqual([true, false]);
    modal.dispose();
  });
  test("a chip's popup names its list by the field's title", () => {
    const q = createFilter();
    const popup = q.createFieldPopup("country", () => { });
    expect(popup.list.listAriaLabel, "#1").toBe(popup.title);
    expect(!!popup.title, "#2").toBe(true);
    popup.dispose();
  });
  test("a dialog section is named by its title: an id of its own per dialog", () => {
    const q = createFilter();
    const first = q.createFilterModal();
    const second = q.createFilterModal();
    expect(!!first.presetsTitleId, "#1").toBe(true);
    expect(first.presetsTitleId === second.presetsTitleId, "#2: unique").toBe(false);
    expect(first.presetsTitleId.indexOf(first.id), "#3: made of the dialog's own element id").toBe(0);
    [first, second].forEach((d: any): void => d.dispose());
  });
});
