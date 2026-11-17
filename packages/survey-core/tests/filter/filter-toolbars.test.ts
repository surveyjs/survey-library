import { describe, test, expect, vi } from "vitest";
import { createBound, createFilter, pickPreset, presetList } from "./filter-test-helpers";
import { SurveyModel } from "../../src/survey";
import { QuestionFilterModel } from "../../src/question_filter";
import { FilterItem } from "../../src/filter/filter-item";
import { settings } from "../../src/settings";
import { ActionContainer } from "../../src/actions/container";
import { FilterModal } from "../../src/filter/filter-modal";
import { getFilterConditionText } from "../../src/filter/filter-conditions";
import "../../src/localization/german";

function ids(container: any): Array<string> { return container.actions.map((a: any) => a.id); }
function action(container: any, id: string): any { return container.getActionById(id); }
function presetIds(q: QuestionFilterModel): Array<string> { return ids(presetList(q)); }
const badges = ["sv-filter-field-name", "sv-filter-field-country", "sv-filter-field-age"];

describe("FilterToolbars: the chips row", () => {
  test("Filters, the presets' chip, a badge per fast mode field, Show More last", () => {
    const q = createFilter();
    expect(ids(q.chipsToolbar)).toEqual(["sv-filter-filters", "sv-filter-preset"].concat(badges, ["sv-filter-more"]));
  });
  test("Filters stands next to the search box when there is one, and nowhere without advanced mode", () => {
    const q = createFilter({ showSearch: true });
    expect(ids(q.searchToolbar), "#1").toEqual(["sv-filter-filters"]);
    expect(ids(q.chipsToolbar).indexOf("sv-filter-filters"), "#2").toBe(-1);
    q.showSearch = false;
    expect(ids(q.searchToolbar), "#3").toEqual([]);
    expect(ids(q.chipsToolbar)[0], "#4").toBe("sv-filter-filters");
    q.allowAdvancedMode = false;
    expect(ids(q.chipsToolbar).indexOf("sv-filter-filters"), "#5").toBe(-1);
  });
  test("no badges without fast mode", () => {
    const q = createFilter({ allowFastMode: false });
    expect(ids(q.chipsToolbar)).toEqual(["sv-filter-filters", "sv-filter-preset", "sv-filter-more"]);
  });
  test("a badge says its condition and is active with one; a chevron while it opens a popup", () => {
    const q = createFilter({ items: [] });
    const age = action(q.chipsToolbar, "sv-filter-field-age");
    const country = action(q.chipsToolbar, "sv-filter-field-country");
    expect([age.title, !!age.active, age.markerIconName], "#1").toEqual(["age", false, "icon-chevrondown-16x16"]);
    expect(age.component, "#2").toBe("sv-filter-chip");
    q.setFieldCondition("age", "greater", 18);
    q.setFieldCondition("country", "anyof", ["de", "fr"]);
    expect([age.title, age.active], "#3").toEqual(["age: Greater than 18", true]);
    expect(country.title, "#4").toBe("country: 2");
    q.clearFieldCondition("age");
    expect([age.title, !!age.active], "#5").toEqual(["age", false]);
  });
  test("the presets' chip: Preset with a star and a chevron; the active preset's title with a cross", () => {
    const q = createFilter({ items: [{ name: "adults", expression: "{age} > 18" }] });
    const chip = action(q.chipsToolbar, "sv-filter-preset");
    expect([chip.title, chip.iconName, chip.markerIconName, !!chip.active, chip.isClearable, chip.component], "#1")
      .toEqual(["Preset", "icon-star-16x16", "icon-chevrondown-16x16", false, false, "sv-filter-chip"]);
    q.toggleItem("adults");
    expect([chip.title, chip.markerIconName, chip.active, chip.isClearable], "#2").toEqual(["adults", undefined, true, true]);
    expect([chip.clearAction.id, chip.clearAction.ariaLabel], "#3").toEqual(["sv-filter-preset-clear", "Clear adults"]);
    q.items[0].title = "Adults";
    expect(chip.title, "#4: the active preset's title").toBe("Adults");
    chip.clearAction.action();
    expect([q.activeItemName, chip.title, !!chip.active, chip.isClearable], "#5: the cross turns it off").toEqual(["", "Preset", false, false]);
  });
  test("the presets' list: a row per preset, the active one selected; a pick turns it on and closes the list", () => {
    const q = createFilter();
    const chip = action(q.chipsToolbar, "sv-filter-preset");
    chip.action();
    expect(chip.popupModel.isVisible, "#1").toBe(true);
    const list = presetList(q);
    expect([ids(list), list.actions.map((a: any) => a.title), list.selectedItem], "#2")
      .toEqual([["sv-filter-item-adults", "sv-filter-item-kids"], ["adults", "kids"], undefined]);
    pickPreset(q, "kids");
    expect([q.activeItemName, chip.popupModel.isVisible, list.selectedItem.id], "#3").toEqual(["kids", false, "sv-filter-item-kids"]);
    pickPreset(q, "kids");
    expect(q.activeItemName, "#4: the active one stays on").toBe("kids");
    q.clearActiveItem();
    expect(list.selectedItem, "#5").toBe(undefined);
  });
  test("a click on the chip opens the list with the active preset as well", () => {
    const q = createFilter();
    q.toggleItem("adults");
    const chip = action(q.chipsToolbar, "sv-filter-preset");
    chip.action();
    expect([chip.popupModel.isVisible, presetList(q).selectedItem.id]).toEqual([true, "sv-filter-item-adults"]);
  });
  // The list moves the focus to its first preset as it opens: the class shows that focus as the
  // theme shows a hovered item only when a keyboard gave it (sd-filter.scss).
  test("the presets' list has a class of its own, on a desktop and on a phone", () => {
    const q = createFilter();
    const model = action(q.chipsToolbar, "sv-filter-preset").popupModel;
    const chip = action(q.chipsToolbar, "sv-filter-preset");
    chip.action();
    expect([model.displayMode, model.cssClass, model.hideOnFocusOut], "#1: desktop").toEqual(["popup", "sd-filter__chip-popup sd-filter__preset-list", true]);
    chip.action();
    q.isMobile = true;
    chip.action();
    expect([model.displayMode, model.cssClass, model.hideOnFocusOut], "#2: phone").toEqual(["overlay", "sv-popup--sheet sd-filter-popup-sheet sd-filter__preset-list", false]);
  });
  test("the presets' list paints one preset: the focus follows the pointer", () => {
    expect(presetList(createFilter()).focusFollowsPointer).toBe(true);
  });
  test("a preset added or removed is reflected", () => {
    const q = createFilter();
    q.items.push(new FilterItem("teens"));
    expect(presetIds(q), "#1").toEqual(["sv-filter-item-adults", "sv-filter-item-kids", "sv-filter-item-teens"]);
    const adults = presetList(q).getActionById("sv-filter-item-adults");
    q.items.splice(0, 1);
    expect([presetIds(q).indexOf("sv-filter-item-adults"), adults.isDisposed], "#2").toEqual([-1, true]);
    q.items.splice(0, 2);
    expect(ids(q.chipsToolbar).indexOf("sv-filter-preset"), "#3: no presets, no chip").toBe(-1);
    q.items.push(new FilterItem("teens"));
    expect(ids(q.chipsToolbar)[1], "#4").toBe("sv-filter-preset");
  });
  test("two presets with one name get a row each", () => {
    const q = createFilter({ items: [{ name: "p", expression: "{age} > 1" }, { name: "p", expression: "{age} > 2" }] });
    expect(presetIds(q)).toEqual(["sv-filter-item-p", "sv-filter-item-p-2"]);
  });
  test("the chips the first build puts in the row are the ones later updates change", () => {
    // Making the first chip reads the control's css for the first time, which sets its css properties:
    // each is a change of the control, and asks the toolbars for an update while they build the row.
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1", fields: [{ name: "age", fieldType: "text", inputType: "number" }] }] });
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    const age = action(q.chipsToolbar, "sv-filter-field-age");
    q.setFieldCondition("age", "greater", 18);
    expect(age.title).toBe("age: Greater than 18");
  });
  test("single mode shows no presets", () => {
    const q = createFilter({ allowMultipleItems: false });
    expect(ids(q.chipsToolbar)).toEqual(["sv-filter-filters"].concat(badges, ["sv-filter-more"]));
  });
});

describe("FilterToolbars: a badge's clear button", () => {
  test("an active badge has a clear button in place of the chevron", () => {
    const q = createFilter({ items: [] });
    const age = action(q.chipsToolbar, "sv-filter-field-age");
    expect([age.markerIconName, age.clearAction.visible], "#1").toEqual(["icon-chevrondown-16x16", false]);
    q.setFieldCondition("age", "greater", 18);
    expect([age.markerIconName, age.clearAction.visible, age.isClearable], "#2").toEqual([undefined, true, true]);
    const clear = age.clearAction;
    expect([clear.id, clear.iconName, clear.ariaLabel, clear.tooltip], "#3")
      .toEqual(["sv-filter-clear-age", "icon-close-16x16", "Clear age", "Clear age"]);
    q.clearFieldCondition("age");
    expect([age.markerIconName, age.clearAction.visible], "#4").toEqual(["icon-chevrondown-16x16", false]);
  });
  test("it clears its own field and nothing else", () => {
    const q = createFilter({ items: [] });
    q.setFieldCondition("age", "greater", 18);
    q.setFieldCondition("country", "anyof", ["de", "fr"]);
    const age = action(q.chipsToolbar, "sv-filter-field-age");
    age.clearAction.action();
    expect(q.ownConditions, "#1").toEqual([{ field: "country", operator: "anyof", value: ["de", "fr"] }]);
    expect([age.title, !!age.active, age.popupModel.isVisible], "#2: no popup opens").toEqual(["age", false, false]);
  });
  test("over an active preset it turns the preset off and keeps the preset's other conditions", () => {
    const q = createFilter({ items: [{ name: "two", expression: "{age} > 18 and {country} anyof ['de']" }] });
    q.toggleItem("two");
    action(q.chipsToolbar, "sv-filter-field-age").clearAction.action();
    expect([q.activeItemName, q.ownConditions], "#1").toEqual(["", [{ field: "country", operator: "anyof", value: ["de"] }]]);
  });
  test("none while the badges are locked or the control is read-only", () => {
    const q = createFilter({ items: [raw] });
    q.toggleItem("raw");
    const age = action(q.chipsToolbar, "sv-filter-field-age");
    expect(age.clearAction.visible, "#1: locked").toBe(false);
    q.clearActiveItem();
    q.setFieldCondition("age", "greater", 18);
    q.readOnly = true;
    expect(age.clearAction.visible, "#2: read-only").toBe(false);
    age.clearAction.action();
    expect(q.ownConditions.length, "#3: a click changes nothing").toBe(1);
  });
  test("a badge the row no longer shows takes its clear button with it", () => {
    const q = createFilter({ items: [] });
    q.setFieldCondition("age", "greater", 18);
    const clear = action(q.chipsToolbar, "sv-filter-field-age").clearAction;
    q.fields.splice(2, 1);
    expect(clear.isDisposed).toBe(true);
  });
});

const raw = { name: "raw", expression: "{age} < 18 or {age} > 35" };

describe("FilterToolbars: an active preset", () => {
  test("lights its chip where it stands; the badges show its conditions and open their popups", () => {
    const q = createFilter();
    q.toggleItem("kids");
    expect(ids(q.chipsToolbar), "#1").toEqual(["sv-filter-filters", "sv-filter-preset"].concat(badges, ["sv-filter-more"]));
    expect(action(q.chipsToolbar, "sv-filter-preset").active, "#1.1").toBe(true);
    const age = action(q.chipsToolbar, "sv-filter-field-age");
    expect([age.title, age.active, age.clearAction.visible], "#2").toEqual(["age: Less than or equal to 18", true, true]);
    age.action();
    expect([age.popupModel.isVisible, q.activeItemName], "#3: the preset stays on").toEqual([true, "kids"]);
  });
  test("an edit in a badge turns only the preset's chip off: what it filtered by stays on", () => {
    const q = createFilter({ items: [{ name: "two", expression: "{age} > 18 and {country} anyof ['de']" }] });
    q.toggleItem("two");
    const country = action(q.chipsToolbar, "sv-filter-field-country");
    country.action();
    const popup = country.popupModel.contentComponentData.holder.fieldPopup;
    popup.list.onItemClick(popup.list.actions[1]);
    popup.apply();
    expect([q.activeItemName, !!action(q.chipsToolbar, "sv-filter-preset").active], "#1").toEqual(["", false]);
    expect([action(q.chipsToolbar, "sv-filter-field-age").title, country.title], "#2").toEqual(["age: Greater than 18", "country: 2"]);
    expect(q.ownConditions, "#3").toEqual([{ field: "age", operator: "greater", value: 18 },
      { field: "country", operator: "anyof", value: ["de", "fr"] }]);
  });
  test("another preset picked in the list switches to it; the chip's cross turns it off", () => {
    const q = createFilter();
    q.toggleItem("adults");
    pickPreset(q, "kids");
    expect(q.activeItemName, "#1").toBe("kids");
    action(q.chipsToolbar, "sv-filter-preset").clearAction.action();
    expect([q.activeItemName, q.filterExpression], "#2").toEqual(["", ""]);
  });
  test("a preset with no conditions to show locks the badges: no chevron, a click turns it off", () => {
    const q = createFilter({ items: [raw, { name: "kids", expression: "{age} <= 18" }] });
    q.toggleItem("raw");
    const age = action(q.chipsToolbar, "sv-filter-field-age");
    expect([!!age.active, age.markerIconName], "#1").toEqual([false, undefined]);
    age.action();
    expect([q.activeItemName, age.popupModel.isVisible], "#2: no popup").toEqual(["", false]);
    expect(age.markerIconName, "#3: unlocked again").toBe("icon-chevrondown-16x16");
    q.toggleItem("raw");
    const chip = action(q.chipsToolbar, "sv-filter-preset");
    expect([chip.active, chip.isClearable], "#4: the presets' chip is not locked").toEqual([true, true]);
    chip.action();
    pickPreset(q, "kids");
    expect(q.activeItemName, "#5: the list still switches").toBe("kids");
  });
  test("a locking preset the host takes away unlocks the badges", () => {
    const q = createFilter({ items: [raw, { name: "kids", expression: "{age} <= 18" }] });
    q.toggleItem("raw");
    expect(action(q.chipsToolbar, "sv-filter-field-age").markerIconName, "#1").toBe(undefined);
    q.items = [q.getItemByName("kids")];
    expect([q.isLocked, action(q.chipsToolbar, "sv-filter-field-age").markerIconName], "#2").toEqual([false, "icon-chevrondown-16x16"]);
  });
  test("an active preset the host takes away takes Clear All with it", () => {
    const q = createFilter();
    const clear = action(q.clearToolbar, "sv-filter-clear");
    q.toggleItem("adults");
    expect(clear.visible, "#1").toBe(true);
    q.items = [q.getItemByName("kids")];
    expect([q.filterExpression, q.canClearActiveItem, clear.visible], "#2: nothing filters").toEqual(["", false, false]);
  });
  test("turning on a locking preset closes a badge's open popup", () => {
    const q = createFilter({ items: [raw] });
    const age = action(q.chipsToolbar, "sv-filter-field-age");
    age.action();
    expect(age.popupModel.isVisible, "#1").toBe(true);
    q.toggleItem("raw");
    expect(age.popupModel.isVisible, "#2").toBe(false);
  });
});

describe("FilterToolbars: a badge's popup", () => {
  test("made when it shows, released when it hides", () => {
    const q = createFilter({ items: [] });
    const badge = action(q.chipsToolbar, "sv-filter-field-country");
    const holder = badge.popupModel.contentComponentData.holder;
    expect(badge.popupModel.contentComponentName, "#1").toBe("sv-filter-field-popup");
    expect(holder.fieldPopup, "#2").toBe(undefined);
    badge.action();
    const popup = holder.fieldPopup;
    expect([popup.key, popup.kind], "#3").toEqual(["country", "multi"]);
    expect(holder.cssClasses.popup, "#4: the control's classes").toBe("sd-filter-popup");
    badge.popupModel.isVisible = false;
    expect([holder.fieldPopup, popup.isDisposed], "#5").toEqual([undefined, true]);
  });
  test("Apply in the popup writes the field's condition and closes the popup", () => {
    const q = createFilter({ items: [] });
    const badge = action(q.chipsToolbar, "sv-filter-field-country");
    badge.action();
    const popup = badge.popupModel.contentComponentData.holder.fieldPopup;
    popup.list.onItemClick(popup.list.actions[1]);
    popup.apply();
    expect(q.getFieldCondition("country"), "#1").toEqual({ field: "country", operator: "anyof", value: ["fr"] });
    expect(badge.popupModel.isVisible, "#2").toBe(false);
    expect(badge.title, "#3").toBe("country: France");
  });
  test("a field that goes away takes its chip and its open popup with it", () => {
    const q = createFilter({ items: [] });
    const badge = action(q.chipsToolbar, "sv-filter-field-country");
    badge.action();
    const popup = badge.popupModel.contentComponentData.holder.fieldPopup;
    q.fields.splice(1, 1);
    expect(popup.isDisposed, "#1").toBe(true);
    expect(ids(q.chipsToolbar).indexOf("sv-filter-field-country"), "#2").toBe(-1);
    expect(ids(q.chipsToolbar).indexOf("sv-filter-field-age") > -1, "#3: the others stay").toBe(true);
  });
  test("disposing the control releases an open popup", () => {
    const q = createFilter({ items: [] });
    const badge = action(q.chipsToolbar, "sv-filter-field-age");
    badge.action();
    const popup = badge.popupModel.contentComponentData.holder.fieldPopup;
    q.dispose();
    expect(popup.isDisposed).toBe(true);
  });
  // On a desktop the class puts the menu 8px off the badge and lets a click outside it reach the page
  // (sd-filter.scss): the menu hides as the focus leaves it, so one click closes it and works.
  test("a menu under the badge on a desktop, a sheet that does not raise the keyboard on a phone", () => {
    const q = createFilter({ items: [] });
    const badge = action(q.chipsToolbar, "sv-filter-field-country");
    const model = badge.popupModel;
    const mode = () => [model.displayMode, model.cssClass, model.isFocusedContent, model.hideOnFocusOut];
    badge.action();
    expect(mode(), "#1: desktop").toEqual(["popup", "sd-filter__chip-popup", true, true]);
    badge.action();
    q.isMobile = true;
    badge.action();
    expect(mode(), "#2: phone").toEqual(["overlay", "sv-popup--sheet sd-filter-popup-sheet", false, false]);
    expect(model.getDisplayMode(), "#3: at the bottom of the screen").toBe("menu-overlay");
    badge.action();
    q.isMobile = false;
    badge.action();
    expect(mode(), "#4: the mode is chosen on every open").toEqual(["popup", "sd-filter__chip-popup", true, true]);
  });
  test("the sheet's footer has no Cancel: Apply is the popup's own", () => {
    const q = createFilter({ items: [] });
    const model = action(q.chipsToolbar, "sv-filter-field-country").popupModel;
    expect(model.updateFooterActions([{ id: "cancel" }])).toEqual([]);
  });
});

// The chips' popups are drawn next to the chips' row, not inside the chips: on a phone the row scrolls
// sideways, and iOS Safari keeps a fixed popup inside such a row - the sheet is cut to the row.
describe("FilterToolbars: the chips' popups, drawn next to the row", () => {
  const popupChipIds = (q: QuestionFilterModel): Array<string> => q.popupChips.map((c: any) => c.id);
  test("the chips that open a popup, in their order: the presets' chip, the badges, Save as", () => {
    const q = createFilter();
    q.chipsToolbar;
    q.clearToolbar;
    expect(popupChipIds(q)).toEqual(["sv-filter-preset"].concat(badges, ["sv-filter-save-as"]));
  });
  test("a chip that comes or goes comes or goes with them; a chip that goes is not there before it is disposed", () => {
    const q = createFilter({ items: [] });
    q.chipsToolbar;
    q.clearToolbar;
    expect(popupChipIds(q), "#1: no presets, no presets' chip").toEqual(badges.concat(["sv-filter-save-as"]));
    const country = action(q.chipsToolbar, "sv-filter-field-country");
    let isDisposedWhenGone: boolean;
    q.onPropertyChanged.add((_: any, options: any): void => {
      if (options.name === "popupChips" && q.popupChips.indexOf(country) < 0) isDisposedWhenGone = country.isDisposed;
    });
    q.fields.splice(1, 1);
    expect(popupChipIds(q), "#2").toEqual(["sv-filter-field-name", "sv-filter-field-age", "sv-filter-save-as"]);
    expect([isDisposedWhenGone, country.isDisposed], "#3").toEqual([false, true]);
    q.items.push(new FilterItem("teens"));
    expect(popupChipIds(q)[0], "#4").toBe("sv-filter-preset");
  });
  test("a chip's popup stands against the chip's own button, wherever the popup is drawn", () => {
    const q = createFilter();
    q.chipsToolbar;
    q.clearToolbar;
    q.popupChips.forEach((chip: any): void => {
      const button = document.createElement("button");
      chip.setInputElement(button);
      expect(chip.popupModel.getTargetCallback(document.createElement("div")), chip.id).toBe(button);
    });
  });
});

describe("FilterToolbars: Filters, Clear All and Save", () => {
  test("Filters counts the conditions the filter is made of", () => {
    const q = createFilter({ items: [{ name: "two", expression: "{age} > 18 and {country} = 'de'" }] });
    const filters = action(q.chipsToolbar, "sv-filter-filters");
    expect([filters.title, filters.iconName], "#1").toEqual(["Filters", "icon-filter-16x16"]);
    q.toggleItem("two");
    expect(filters.title, "#2").toBe("Filters: 2");
    q.clearActiveItem();
    q.setFieldCondition("name", "contains", "an");
    expect(filters.title, "#3").toBe("Filters: 1");
  });
  test("on a phone without a search box Filters keeps its caption in the chips row", () => {
    const q = createFilter();
    q.isMobile = true;
    q.setFieldCondition("name", "contains", "an");
    expect(action(q.chipsToolbar, "sv-filter-filters").title).toBe("Filters: 1");
  });
  test("on a phone the search row's Filters shows the icon and the number only", () => {
    const q = createFilter({ showSearch: true });
    q.isMobile = true;
    const filters = action(q.searchToolbar, "sv-filter-filters");
    expect(filters.title, "#1").toBe("");
    q.setFieldCondition("name", "contains", "an");
    expect(filters.title, "#2").toBe("1");
    expect(q.chipsLayout.isMobile, "#3: and the chips row scrolls").toBe(true);
  });
  test("Filters next to the search box is a small action, as tall as the box", () => {
    const q = createFilter({ showSearch: true });
    expect(action(q.searchToolbar, "sv-filter-filters").predefinedAppearance.size).toBe("small");
  });
  test("Clear All follows canClearActiveItem and keeps the search", () => {
    const q = createFilter({ showSearch: true });
    const clear = action(q.clearToolbar, "sv-filter-clear");
    expect([clear.title, clear.visible], "#1").toEqual(["Clear All", false]);
    q.toggleItem("adults");
    q.searchString = "an";
    expect(clear.visible, "#2").toBe(true);
    clear.action();
    expect([q.activeItemName, q.searchString, clear.visible], "#3").toEqual(["", "an", false]);
  });
  test("Clear All in the chips row is a neutral tertiary-surface action without a fill at rest", () => {
    const q = createFilter();
    const clear = action(q.clearToolbar, "sv-filter-clear");
    expect(Object.assign({}, clear.predefinedAppearance, clear.appearance))
      .toEqual({ style: "neutral", mode: "tertiary-surface", size: "small", showBorder: true });
  });
  test("Save is there in single mode only, while there are edits to save", () => {
    const q = createFilter({ allowMultipleItems: false });
    const save = action(q.clearToolbar, "sv-filter-save");
    expect(save.visible, "#1").toBe(false);
    q.setFieldCondition("age", "greater", 30);
    expect(save.visible, "#2").toBe(true);
    save.action();
    expect(q.activeItem.expression, "#3").toBe("{age} > 30");
    const multi = createFilter();
    multi.toggleItem("adults");
    multi.setFieldCondition("age", "greater", 30);
    expect(action(multi.clearToolbar, "sv-filter-save").visible, "#4").toBe(false);
  });
  test("design mode shows no Clear All or Save", () => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({ elements: [{ type: "filter", name: "f1", fields: [{ name: "age" }], items: [{ name: "p", expression: "{age} > 1" }], defaultItem: "p" }] });
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    expect([action(q.clearToolbar, "sv-filter-clear").visible, action(q.clearToolbar, "sv-filter-save").visible]).toEqual([false, false]);
  });
});

describe("FilterToolbars: one row while collapsed", () => {
  test("the chips past the ones that fit are taken out of the flow, Show More shows", () => {
    const q = createFilter();
    const more = action(q.chipsToolbar, "sv-filter-more");
    const hidden = (): Array<string> => q.chipsToolbar.actions.filter((a: any) => a.css === "sd-filter__chip--overflow").map((a: any) => a.id);
    expect([more.css, hidden()], "#1: everything fits").toEqual(["sd-filter__chip--overflow", ["sv-filter-more"]]);
    q.chipsLayout.fitCount = 3;
    expect(hidden(), "#2").toEqual(["sv-filter-field-country", "sv-filter-field-age"]);
    expect([more.css, more.title], "#3").toEqual([undefined, "Show More"]);
    more.action();
    expect([hidden(), more.title], "#4: expanded").toEqual([[], "Show Less"]);
    more.action();
    expect(hidden().length, "#5: collapsed again").toBe(2);
  });
});

describe("FilterToolbars: the Filters dialog", () => {
  // A stand-in for the dialog host: the options it was given, its footer and its apply, which hides
  // the dialog when onApply allows it - as PopupModalViewModel does.
  function stubDialogs(): { calls: Array<any>, restore: () => void } {
    const saved = settings.showDialog;
    const calls: Array<any> = [];
    settings.showDialog = (o: any): any => {
      const dialog: any = { options: o, footerToolbar: new ActionContainer(), model: { hide: () => o.onHide() } };
      dialog.apply = (): void => { if (o.onApply()) o.onHide(); };
      calls.push(dialog);
      return dialog;
    };
    return { calls: calls, restore: () => { settings.showDialog = saved; } };
  }
  test("Filters opens the dialog: its content, title, close button and size", () => {
    const dialogs = stubDialogs();
    try {
      const q = createFilter();
      action(q.chipsToolbar, "sv-filter-filters").action();
      const o = dialogs.calls[0].options;
      expect([o.componentName, o.title, o.showCloseButton, o.displayMode, o.cssClass], "#1")
        .toEqual(["sv-filter-modal", "Filters", true, "popup", "sd-filter-modal"]);
      expect(o.data.holder.modal instanceof FilterModal, "#2").toBe(true);
      expect(o.data.holder.cssClasses.modalSection, "#3: the control's classes").toBe("sd-filter-modal__section");
      q.showAdvancedEditor();
      expect(dialogs.calls.length, "#4: one dialog at a time").toBe(1);
    } finally {
      dialogs.restore();
    }
  });
  test("the footer: Clear All, and the main button that applies the dialog and closes it", () => {
    const dialogs = stubDialogs();
    try {
      const q = createFilter();
      q.showAdvancedEditor();
      const dialog = dialogs.calls[0];
      const modal: FilterModal = dialog.options.data.holder.modal;
      expect(ids(dialog.footerToolbar), "#1").toEqual(["sv-filter-modal-clear", "sv-filter-modal-apply"]);
      const apply = action(dialog.footerToolbar, "sv-filter-modal-apply");
      expect([apply.title, apply.needSpace], "#2: a standalone control cannot count").toEqual(["Show results", true]);
      expect(action(dialog.footerToolbar, "sv-filter-modal-clear").appearance, "#2a: Clear All has no fill at rest")
        .toEqual({ style: "neutral", mode: "tertiary", showBorder: true });
      modal.togglePreset(q.getItemByName("adults"));
      action(dialog.footerToolbar, "sv-filter-modal-clear").action();
      expect(modal.activeItemName, "#3: Clear All").toBe("");
      modal.togglePreset(q.getItemByName("adults"));
      apply.action();
      expect([q.activeItemName, modal.isDisposed, dialog.options.data.holder.modal], "#4: applied, closed, released")
        .toEqual(["adults", true, undefined]);
    } finally {
      dialogs.restore();
    }
  });
  test("the main button says how many records it will show", async () => {
    const dialogs = stubDialogs();
    try {
      const survey = createBound();
      const q = <QuestionFilterModel>survey.getQuestionByName("f1");
      q.showAdvancedEditor();
      await Promise.resolve();
      expect(action(dialogs.calls[0].footerToolbar, "sv-filter-modal-apply").title).toBe("Show 3 items");
    } finally {
      dialogs.restore();
    }
  });
  test("on a phone the dialog covers the screen; in the designer it has nothing to apply", () => {
    const dialogs = stubDialogs();
    try {
      const q = createFilter();
      q.isMobile = true;
      q.showAdvancedEditor();
      expect([dialogs.calls[0].options.displayMode, dialogs.calls[0].options.cssClass], "#1").toEqual(["popup", "sd-filter-modal sd-filter-modal--mobile"]);
      const survey = new SurveyModel();
      survey.setDesignMode(true);
      survey.fromJSON({ elements: [{ type: "filter", name: "f1", fields: [{ name: "age" }] }] });
      (<QuestionFilterModel>survey.getQuestionByName("f1")).showAdvancedEditor();
      expect(ids(dialogs.calls[1].footerToolbar), "#2").toEqual([]);
    } finally {
      dialogs.restore();
    }
  });
  test("closing it any other way applies nothing and releases the dialog", () => {
    const dialogs = stubDialogs();
    try {
      const q = createFilter();
      q.showAdvancedEditor();
      const o = dialogs.calls[0].options;
      const modal: FilterModal = o.data.holder.modal;
      modal.togglePreset(q.getItemByName("adults"));
      o.onHide();
      expect([q.activeItemName, modal.isDisposed], "#1").toEqual(["", true]);
      q.showAdvancedEditor();
      expect(dialogs.calls.length, "#2: it opens again").toBe(2);
    } finally {
      dialogs.restore();
    }
  });
  test("without settings.showDialog there is no dialog to open", () => {
    const saved = settings.showDialog;
    settings.showDialog = undefined;
    try {
      expect(() => createFilter({ items: [] }).showAdvancedEditor()).not.toThrow();
    } finally {
      settings.showDialog = saved;
    }
  });
  // The renderers read a holder's slots without asking whether what they hold is disposed: a slot is
  // emptied before what it held is disposed, on every way it goes.
  describe("a holder never holds a disposed model", () => {
    // isDisposed of what each emptied slot held, at the moment it was emptied.
    function watch(holder: any): Array<boolean> {
      const res: Array<boolean> = [];
      holder.onPropertyChanged.add((_: any, o: any): void => {
        if (!o.newValue && !!o.oldValue) res.push(o.oldValue.isDisposed);
      });
      return res;
    }
    function openAll(q: QuestionFilterModel, dialogs: { calls: Array<any> }): { modal: Array<boolean>, preset: Array<boolean>, field: Array<boolean> } {
      const badge = action(q.chipsToolbar, "sv-filter-field-country");
      const fieldHolder = badge.popupModel.contentComponentData.holder;
      const field = watch(fieldHolder);
      badge.action();
      expect(!!fieldHolder.fieldPopup, "field popup open").toBe(true);
      q.showAdvancedEditor();
      const modalHolder = dialogs.calls[0].options.data.holder;
      const modal = watch(modalHolder);
      q.showPresetDialog(modalHolder.modal, false);
      const presetHolder = dialogs.calls[1].options.data.holder;
      const preset = watch(presetHolder);
      expect(!!presetHolder.presetDialog, "preset dialog open").toBe(true);
      return { modal: modal, preset: preset, field: field };
    }
    test("on close", () => {
      const dialogs = stubDialogs();
      try {
        const q = createFilter({ items: [] });
        const emptied = openAll(q, dialogs);
        dialogs.calls[1].model.hide();
        dialogs.calls[0].model.hide();
        action(q.chipsToolbar, "sv-filter-field-country").popupModel.isVisible = false;
        expect(emptied, "#1").toEqual({ modal: [false], preset: [false], field: [false] });
      } finally {
        dialogs.restore();
      }
    });
    test("on a gone chip", () => {
      const q = createFilter({ items: [] });
      const badge = action(q.chipsToolbar, "sv-filter-field-country");
      const holder = badge.popupModel.contentComponentData.holder;
      const emptied = watch(holder);
      badge.action();
      const popup = holder.fieldPopup;
      q.allowFastMode = false;
      expect([emptied, popup.isDisposed], "#1").toEqual([[false], true]);
    });
    test("on the control's dispose", () => {
      const dialogs = stubDialogs();
      try {
        const q = createFilter({ items: [] });
        const emptied = openAll(q, dialogs);
        q.dispose();
        expect(emptied, "#1").toEqual({ modal: [false], preset: [false], field: [false] });
      } finally {
        dialogs.restore();
      }
    });
  });
});

describe("QuestionFilterModel: what the renderer shows besides the toolbars", () => {
  test("the search box's clear button: an icon button there while there is text to clear and the box is on", () => {
    const q = createFilter({ showSearch: true });
    const clear = q.searchClearAction;
    expect([q.showSearchClear, clear.id, clear.iconName, clear.title, clear.hasTitle, clear.getTooltip()], "#1")
      .toEqual([false, "sv-filter-search-clear", "icon-cancel-24x24", "Clear", false, "Clear"]);
    expect(clear.getActionBarItemCss().split(" "), "#2").toEqual(expect.arrayContaining(["sd-action", "sd-filter__search-clear"]));
    q.searchString = "an";
    expect(q.showSearchClear, "#3").toBe(true);
    clear.action();
    expect([q.searchString, q.showSearchClear], "#4").toEqual(["", false]);
    q.searchString = "an";
    q.readOnly = true;
    expect(q.showSearchClear, "#5: the box is off").toBe(false);
    clear.action();
    expect(q.searchString, "#6: a click changes nothing").toBe("an");
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
  test("a locale change retitles the presets and the badges", () => {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1",
      fields: [{ name: "age", fieldType: "text", inputType: "number" }],
      items: [{ name: "adults", title: { default: "Adults", de: "Erwachsene" }, expression: "{age} > 18" }] }] });
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    const preset = action(q.chipsToolbar, "sv-filter-preset");
    q.toggleItem("adults");
    const badge = action(q.chipsToolbar, "sv-filter-field-age");
    expect([preset.title, badge.title], "#1").toEqual(["Adults", "age: Greater than 18"]);
    survey.locale = "de";
    expect(preset.title, "#2").toBe("Erwachsene");
    expect(badge.title, "#3: composed again, in the survey's locale").toBe(getFilterConditionText(q.getFieldByName("age"), q.getFieldCondition("age"), "de"));
    survey.locale = "";
    expect([preset.title, badge.title], "#4").toEqual(["Adults", "age: Greater than 18"]);
  });
  test("one update reads the field list a constant number of times, however many fields there are", () => {
    const fields: Array<any> = [];
    for (let i = 0; i < 20; i++) fields.push({ name: "f" + i, fieldType: "text", inputType: "number" });
    const q = createFilter({ fields: fields, items: [] });
    q.setFieldCondition("f3", "greater", 1);
    expect(action(q.chipsToolbar, "sv-filter-field-f3").title, "#1").toBe("f3: Greater than 1");
    const spy = vi.spyOn(q, "getFilterFields");
    q.allowAddItems = false;
    const calls = spy.mock.calls.length;
    spy.mockRestore();
    expect(calls <= 4, "#2: calls = " + calls).toBe(true);
  });
});

describe("FilterToolbars: in the designer", () => {
  const json = { type: "filter", name: "f1", fields: [{ name: "age" }, { name: "country" }],
    items: [{ name: "adults", expression: "{age} > 18" }, { name: "kids", expression: "{age} < 12" }] };
  function createDesigned(): QuestionFilterModel {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({ elements: [json] });
    return <QuestionFilterModel>survey.getQuestionByName("f1");
  }
  test("a badge and Filters open nothing; Show More still works", () => {
    const saved = settings.showDialog;
    let dialogs = 0;
    settings.showDialog = (): any => { dialogs++; return undefined; };
    try {
      const q = createDesigned();
      const age = action(q.chipsToolbar, "sv-filter-field-age");
      age.action();
      expect(age.popupModel.isVisible, "#1: no popup").toBe(false);
      action(q.chipsToolbar, "sv-filter-filters").action();
      expect(dialogs, "#2: no dialog").toBe(0);
      q.chipsLayout.fitCount = 1;
      action(q.chipsToolbar, "sv-filter-more").action();
      expect(q.chipsLayout.isExpanded, "#3").toBe(true);
    } finally {
      settings.showDialog = saved;
    }
  });
  test("the presets' chip opens nothing and reports a click on the control, or on the preset it shows", () => {
    const q = createDesigned();
    const clicked: Array<any> = [];
    q.setDesignItemClickCallback((item?: FilterItem): void => { clicked.push(item); });
    const chip = action(q.chipsToolbar, "sv-filter-preset");
    chip.action();
    expect([clicked, chip.popupModel.isVisible, q.activeItemName], "#1").toEqual([[undefined], false, ""]);
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({ elements: [Object.assign({}, json, { defaultItem: "kids" })] });
    const q2 = <QuestionFilterModel>survey.getQuestionByName("f1");
    const shown: Array<any> = [];
    q2.setDesignItemClickCallback((item?: FilterItem): void => { shown.push(item); });
    action(q2.chipsToolbar, "sv-filter-preset").action();
    expect(shown.map((item: FilterItem) => item.name), "#2").toEqual(["kids"]);
    q2.setDesignItemClickCallback(undefined);
    action(q2.chipsToolbar, "sv-filter-preset").action();
    expect([shown.length, q2.activeItemName], "#3: no callback, nothing happens").toEqual([1, "kids"]);
  });
  test("a badge, Filters and Show More report a click on the control itself", () => {
    const saved = settings.showDialog;
    settings.showDialog = (): any => undefined;
    try {
      const q = createDesigned();
      const clicked: Array<any> = [];
      q.setDesignItemClickCallback((item?: FilterItem): void => { clicked.push(item); });
      action(q.chipsToolbar, "sv-filter-field-age").action();
      action(q.chipsToolbar, "sv-filter-filters").action();
      action(q.chipsToolbar, "sv-filter-more").action();
      expect(clicked, "#1: the designer selects the control").toEqual([undefined, undefined, undefined]);
      expect(q.chipsLayout.isExpanded, "#2: Show More still works").toBe(true);
    } finally {
      settings.showDialog = saved;
    }
  });
  test("a badge's clear button is drawn and reports a click on the control itself", () => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({ elements: [Object.assign({}, json, { defaultItem: "adults" })] });
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    const clicked: Array<any> = [];
    q.setDesignItemClickCallback((item?: FilterItem): void => { clicked.push(item); });
    const age = action(q.chipsToolbar, "sv-filter-field-age");
    expect(age.clearAction.visible, "#1").toBe(true);
    age.clearAction.action();
    expect([clicked, q.activeItemName], "#2").toEqual([[undefined], "adults"]);
  });
  test("out of the designer the presets' chip opens its list and reports nothing", () => {
    const survey = new SurveyModel({ elements: [json] });
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    const clicked: Array<FilterItem> = [];
    q.setDesignItemClickCallback((item: FilterItem): void => { clicked.push(item); });
    action(q.chipsToolbar, "sv-filter-preset").action();
    pickPreset(q, "kids");
    expect([q.activeItemName, clicked.length]).toEqual(["kids", 0]);
  });
});
