import { describe, test, expect, vi } from "vitest";
import { createBound, createFilter } from "./filter-test-helpers";
import { SurveyModel } from "../../src/survey";
import { QuestionFilterModel } from "../../src/question_filter";
import { FilterItem } from "../../src/filter/filter-item";
import { settings } from "../../src/settings";
import { ActionContainer } from "../../src/actions/container";
import { FilterModal } from "../../src/filter/filter-modal";
import "../../src/localization/german";

function ids(container: any): Array<string> { return container.actions.map((a: any) => a.id); }
function action(container: any, id: string): any { return container.getActionById(id); }
const badges = ["sv-filter-field-name", "sv-filter-field-country", "sv-filter-field-age"];

describe("FilterToolbars: the chips row", () => {
  test("Filters, a badge per fast mode field, the presets, Show More last", () => {
    const q = createFilter();
    expect(ids(q.chipsToolbar)).toEqual(["sv-filter-filters"].concat(badges,
      ["sv-filter-item-adults", "sv-filter-item-kids", "sv-filter-more"]));
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
    expect(ids(q.chipsToolbar)).toEqual(["sv-filter-filters", "sv-filter-item-adults", "sv-filter-item-kids", "sv-filter-more"]);
  });
  test("a badge says its condition and is active with one; a chevron while it opens a popup", () => {
    const q = createFilter({ items: [] });
    const age = action(q.chipsToolbar, "sv-filter-field-age");
    const country = action(q.chipsToolbar, "sv-filter-field-country");
    expect([age.title, !!age.active, age.markerIconName], "#1").toEqual(["age", false, "icon-chevrondown-24x24"]);
    expect(age.component, "#2").toBe("sv-filter-chip");
    q.setFieldCondition("age", "greater", 18);
    q.setFieldCondition("country", "anyof", ["de", "fr"]);
    expect([age.title, age.active], "#3").toEqual(["age: Greater than 18", true]);
    expect(country.title, "#4").toBe("country: 2");
    q.clearFieldCondition("age");
    expect([age.title, !!age.active], "#5").toEqual(["age", false]);
  });
  test("a preset's chip: titled by it, active while it is on, a sparkle for an ai preset", () => {
    const q = createFilter({ items: [{ name: "adults", expression: "{age} > 18" }, { name: "ai", type: "ai", expression: "{age} > 60" }] });
    const adults = action(q.chipsToolbar, "sv-filter-item-adults");
    const ai = action(q.chipsToolbar, "sv-filter-item-ai");
    expect([adults.title, !!adults.active, adults.iconName], "#1").toEqual(["adults", false, undefined]);
    expect(ai.iconName, "#2").toBe("icon-sparkle-16x16");
    adults.action();
    expect([q.activeItemName, adults.active], "#3").toEqual(["adults", true]);
    q.items[0].title = "Adults";
    expect(adults.title, "#4: the chip borrows the preset's title").toBe("Adults");
  });
  test("a preset added or removed is reflected", () => {
    const q = createFilter();
    q.items.push(new FilterItem("teens"));
    expect(ids(q.chipsToolbar).slice(-2), "#1").toEqual(["sv-filter-item-teens", "sv-filter-more"]);
    q.items.splice(0, 1);
    expect(ids(q.chipsToolbar).indexOf("sv-filter-item-adults"), "#2").toBe(-1);
  });
  test("two presets with one name get a chip each", () => {
    const q = createFilter({ items: [{ name: "p", expression: "{age} > 1" }, { name: "p", expression: "{age} > 2" }] });
    expect(ids(q.chipsToolbar).filter((id: string) => id.indexOf("sv-filter-item-") === 0)).toEqual(["sv-filter-item-p", "sv-filter-item-p-2"]);
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

const raw = { name: "raw", expression: "{age} < 18 or {age} > 35" };

describe("FilterToolbars: an active preset", () => {
  test("lights its chip where it stands; the badges show its conditions and open their popups", () => {
    const q = createFilter();
    q.toggleItem("kids");
    expect(ids(q.chipsToolbar), "#1").toEqual(["sv-filter-filters"].concat(badges,
      ["sv-filter-item-adults", "sv-filter-item-kids", "sv-filter-more"]));
    const age = action(q.chipsToolbar, "sv-filter-field-age");
    expect([age.title, age.active, age.markerIconName], "#2").toEqual(["age: Less than or equal to 18", true, "icon-chevrondown-24x24"]);
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
    expect([q.activeItemName, !!action(q.chipsToolbar, "sv-filter-item-two").active], "#1").toEqual(["", false]);
    expect([action(q.chipsToolbar, "sv-filter-field-age").title, country.title], "#2").toEqual(["age: Greater than 18", "country: 2"]);
    expect(q.ownConditions, "#3").toEqual([{ field: "age", operator: "greater", value: 18 },
      { field: "country", operator: "anyof", value: ["de", "fr"] }]);
  });
  test("another preset's chip switches to it; the active one's chip turns it off", () => {
    const q = createFilter();
    q.toggleItem("adults");
    action(q.chipsToolbar, "sv-filter-item-kids").action();
    expect(q.activeItemName, "#1").toBe("kids");
    action(q.chipsToolbar, "sv-filter-item-kids").action();
    expect([q.activeItemName, q.filterExpression], "#2").toEqual(["", ""]);
  });
  test("a preset with no conditions to show locks the badges: no chevron, a click turns it off", () => {
    const q = createFilter({ items: [raw, { name: "kids", expression: "{age} <= 18" }] });
    q.toggleItem("raw");
    const age = action(q.chipsToolbar, "sv-filter-field-age");
    expect([!!age.active, age.markerIconName], "#1").toEqual([false, undefined]);
    age.action();
    expect([q.activeItemName, age.popupModel.isVisible], "#2: no popup").toEqual(["", false]);
    expect(age.markerIconName, "#3: unlocked again").toBe("icon-chevrondown-24x24");
    q.toggleItem("raw");
    action(q.chipsToolbar, "sv-filter-item-kids").action();
    expect(q.activeItemName, "#4: a preset's chip still switches").toBe("kids");
  });
  test("a locking preset the host takes away unlocks the badges", () => {
    const q = createFilter({ items: [raw, { name: "kids", expression: "{age} <= 18" }] });
    q.toggleItem("raw");
    expect(action(q.chipsToolbar, "sv-filter-field-age").markerIconName, "#1").toBe(undefined);
    q.items = [q.getItemByName("kids")];
    expect([q.isLocked, action(q.chipsToolbar, "sv-filter-field-age").markerIconName], "#2").toEqual([false, "icon-chevrondown-24x24"]);
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
});

describe("FilterToolbars: Filters, Clear All and Save", () => {
  test("Filters counts the conditions the filter is made of", () => {
    const q = createFilter({ items: [{ name: "two", expression: "{age} > 18 and {country} = 'de'" }] });
    const filters = action(q.chipsToolbar, "sv-filter-filters");
    expect([filters.title, filters.iconName], "#1").toEqual(["Filters", "icon-filter-24x24"]);
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
    expect(hidden(), "#2").toEqual(["sv-filter-field-age", "sv-filter-item-adults", "sv-filter-item-kids"]);
    expect([more.css, more.title], "#3").toEqual([undefined, "Show More"]);
    more.action();
    expect([hidden(), more.title], "#4: expanded").toEqual([[], "Show Less"]);
    more.action();
    expect(hidden().length, "#5: collapsed again").toBe(3);
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
});

describe("QuestionFilterModel: what the renderer shows besides the toolbars", () => {
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
    const preset = action(q.chipsToolbar, "sv-filter-item-adults");
    q.toggleItem("adults");
    const badge = action(q.chipsToolbar, "sv-filter-field-age");
    expect([preset.title, badge.title], "#1").toEqual(["Adults", "age: Greater than 18"]);
    survey.locale = "de";
    expect(preset.title, "#2").toBe("Erwachsene");
    expect(badge.title, "#3: composed again, in the survey's locale").toBe(q.getFieldConditionText("age"));
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
