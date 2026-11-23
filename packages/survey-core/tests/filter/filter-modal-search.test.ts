import { describe, test, expect } from "vitest";
import { createFilter } from "./filter-test-helpers";
import { QuestionFilterModel } from "../../src/question_filter";
import { FilterModal } from "../../src/filter/filter-modal";
import { Action } from "../../src/actions/action";

// "Search in Filters" (filters v2): the Filters dialog's search box looks among the filters, not in
// the records. A field whose title has the text shows as it is; one with values that have it shows
// them - only those, for a list of checkboxes - and any other is hidden; the presets show by their
// titles. Nothing found says so.
const products = ["Chai", "Beer", "Coffee", "Tea", "Milk", "Juice", "Water", "Soda", "Wine", "Cider", "Lemonade"];
const categories = ["Beverages", "Condiments", "Confections", "Dairy Products", "Grains/Cereals", "Meat/Poultry"];
function control(over: any = {}): QuestionFilterModel {
  return createFilter(Object.assign({
    fields: [
      { name: "product", title: "Product", fieldType: "dropdown", choices: products },
      { name: "category", title: "Category", fieldType: "dropdown", choices: categories },
      { name: "price", title: "Price", fieldType: "text", inputType: "number" },
      { name: "discontinued", title: "Discontinued", fieldType: "boolean" }],
    items: [{ name: "cheap", title: "Cheap Beverages", expression: "{price} < 10" }, { name: "low", title: "Low Stock", expression: "{price} > 1" }]
  }, over));
}
function shownFields(modal: FilterModal): Array<string> {
  return [0, 1, 2, 3].map((i: number): any => modal.editor.survey.getPanelByName("f" + i))
    .filter((panel: any): boolean => panel.visible).map((panel: any): string => panel.title);
}
function renderedCategories(modal: FilterModal): Array<string> {
  return (<any>modal.editor.survey.getQuestionByName("f1_value")).renderedChoices.map((c: any): string => c.text);
}
function showMore(modal: FilterModal): Action {
  return (<any>modal.editor.survey.getPanelByName("f1")).footerActions.filter((a: Action): boolean => a.id === "sv-filter-show-more")[0];
}
function shownPresets(modal: FilterModal): Array<string> {
  return modal.presetsToolbar.actions.filter((a: Action): boolean => a.isVisible).map((a: Action): string => a.id);
}

describe("FilterModal: Search in Filters", () => {
  test("is the dialog's search box: always there, and not the records' search", () => {
    const q = control({ showSearch: false });
    const modal = q.createFilterModal();
    expect([modal.filterText, modal.searchPlaceholder, modal.isNothingFound], "#1").toEqual(["", "Search in filters and presets", false]);
    modal.dispose();
    const searched = control({ showSearch: true });
    searched.searchString = "an";
    const other = searched.createFilterModal();
    other.filterText = "price";
    expect([other.state.searchString, searched.searchString], "#2: the records' search is the control's").toEqual(["an", "an"]);
    other.dispose();
  });
  test("a field shows whole when its title has the text, and with its values that have it otherwise", () => {
    const modal = control().createFilterModal();
    expect([shownFields(modal), renderedCategories(modal), showMore(modal).visible], "#1")
      .toEqual([["Product", "Category", "Price", "Discontinued"], ["Select All", "Beverages", "Condiments", "Confections", "Dairy Products"], true]);
    modal.filterText = "product";
    expect(shownFields(modal), "#2: Product by its title, Category by a value").toEqual(["Product", "Category"]);
    expect([renderedCategories(modal), showMore(modal).visible], "#3: only that value, no Select All, no Show More").toEqual([["Dairy Products"], false]);
    modal.filterText = "TEA";
    expect(shownFields(modal), "#4: a tagbox with the value shows whole").toEqual(["Product"]);
    modal.filterText = "categ";
    expect([shownFields(modal), renderedCategories(modal)], "#5").toEqual([["Category"], ["Select All", "Beverages", "Condiments", "Confections", "Dairy Products"]]);
    modal.filterText = "";
    expect([shownFields(modal), renderedCategories(modal).length, showMore(modal).visible], "#6: every field again, folded").toEqual([["Product", "Category", "Price", "Discontinued"], 5, true]);
    modal.dispose();
  });
  test("the presets show by their titles; Add New and Edit Selected hide while it looks", () => {
    const q = control();
    const modal = q.createFilterModal();
    modal.togglePreset(q.getItemByName("cheap"));
    expect(shownPresets(modal), "#1").toEqual(["sv-filter-modal-item-cheap", "sv-filter-modal-item-low", "sv-filter-modal-add-preset", "sv-filter-modal-edit-preset"]);
    modal.filterText = "beverage";
    expect([shownPresets(modal), shownFields(modal), renderedCategories(modal)], "#2")
      .toEqual([["sv-filter-modal-item-cheap"], ["Category"], ["Beverages"]]);
    modal.filterText = "";
    expect(shownPresets(modal).length, "#3").toBe(4);
    modal.dispose();
  });
  test("its cross clears it", () => {
    const modal = control().createFilterModal();
    const clear = modal.searchClearAction;
    expect([modal.showSearchClear, clear.id, clear.iconName, clear.title, clear.hasTitle], "#1")
      .toEqual([false, "sv-filter-modal-search-clear", "icon-cancel-24x24", "Clear", false]);
    modal.filterText = "price";
    expect(modal.showSearchClear, "#2").toBe(true);
    clear.action();
    expect([modal.filterText, modal.showSearchClear, shownFields(modal).length], "#3").toEqual(["", false, 4]);
    modal.dispose();
    expect(clear.isDisposed, "#4: it goes with the dialog").toBe(true);
  });
  test("nothing found says so", () => {
    const modal = control().createFilterModal();
    modal.filterText = "zzz";
    expect([modal.isNothingFound, shownFields(modal), shownPresets(modal), modal.nothingFoundText], "#1")
      .toEqual([true, [], [], "Nothing found, try different keywords"]);
    modal.filterText = "low";
    expect(modal.isNothingFound, "#2: a preset is found").toBe(false);
    modal.dispose();
  });
  test("what it hides keeps its value, and a preset turned on while it looks is searched too", () => {
    const q = control();
    const modal = q.createFilterModal();
    modal.filterText = "dairy";
    modal.editor.survey.getQuestionByName("f2_value").value = 5;
    modal.togglePreset(q.getItemByName("cheap"));
    expect([shownFields(modal), renderedCategories(modal)], "#1").toEqual([["Category"], ["Dairy Products"]]);
    modal.togglePreset(q.getItemByName("cheap"));
    modal.filterText = "";
    modal.editor.survey.getQuestionByName("f2_operator").value = "less";
    modal.editor.survey.getQuestionByName("f2_value").value = 7;
    modal.filterText = "dairy";
    expect(modal.state.conditions, "#2").toEqual([{ field: "price", operator: "less", value: 7 }]);
    modal.dispose();
  });
});
