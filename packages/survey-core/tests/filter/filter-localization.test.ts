import { describe, test, expect, beforeAll, afterAll } from "vitest";
import { SurveyModel } from "../../src/survey";
import { QuestionFilterModel } from "../../src/question_filter";
import { surveyLocalization } from "../../src/surveyStrings";
import { settings } from "../../src/settings";
import { Action } from "../../src/actions/action";
import { ActionContainer } from "../../src/actions/container";
import { PanelModel } from "../../src/panel";
import { FilterChip } from "../../src/filter/filter-toolbars";
import { FilterConditionsEditor } from "../../src/filter/filter-conditions-editor";
import { getFilterExpressionError } from "../../src/filter/filter-expression-panel";
import { getFilterPresetTitleError } from "../../src/filter/filter-preset-dialog";

// The control's own captions come from the locale dictionary, in the survey's locale: a locale that
// translates them shows its texts, a locale that does not falls back to English. Both locales are the
// tests' own: the l10n job translates every new key into every real locale, so no real one stays
// without these keys.
const yy = { completeText: "Fertig" };
const xx = {
  filterSave: "Speichern",
  filterFilters: "Filtern",
  filterFiltersCount: "Filtern: {0}",
  filterDialogTitle: "Filterdialog",
  filterSearchLabel: "Suche",
  filterSearchPlaceholder: "Suche nach {0}",
  filterSearchFieldsOr: "{0} oder {1}",
  filterSearchFieldsOrLast: "{0} oder {1}",
  filterShowMore: "Mehr",
  filterShowLess: "Weniger",
  filterClearAll: "Alles leeren",
  filterClearChip: "{0} leeren",
  filterPreset: "Vorlage",
  filterSaveAs: "Speichern als...",
  filterSaveAsSave: "Sichern",
  filterAddCustomValue: "\"{0}\" dazu...",
  filterPresetsTitle: "Vorlagen",
  filterShowResultsCount: "{0} Zeilen zeigen",
  filterShowOneResult: "1 Zeile zeigen",
  filterShowResults: "Zeilen zeigen",
  filterAddPresetTitle: "Neue Vorlage",
  filterPresetName: "Bezeichnung",
  filterPresetFieldsLabel: "Felder",
  filterPresetExpressionLabel: "Filterausdruck",
  filterPresetTitleExists: "Die gibt es schon.",
  filterPresetNoConditions: "Keine Bedingung.",
  filterPresetNoExpression: "Kein Ausdruck.",
  filterPresetInvalidExpression: "Falscher Ausdruck.",
  filterEditAsText: "Als Ausdruck",
  filterEditAsFields: "Als Tagbox",
  filterExpressionPlaceholder: "Ausdruck...",
  filterEditPreset: "Vorlage aendern",
  filterDeletePreset: "Loeschen",
  filterAddPreset: "Neu...",
  filterEditSelected: "Auswahl aendern...",
  filterPresetExpression: "Ausdruck von {0}",
  filterEditExpression: "Aendern...",
  filterSearchInFilters: "In Filtern suchen",
  filterNothingFound: "Nichts gefunden",
  filterAiPromptNew: "Mit KI anlegen",
  filterAiPromptEdit: "Mit KI aendern",
  filterAiPromptPlaceholder: "Zum Beispiel: Tee",
  filterAiCreate: "Anlegen",
  filterAiEdit: "Aendern",
  filterAiCreating: "Lege an...",
  filterAiEditing: "Aendere...",
  filterAiError: "KI-Fehler.",
  filterAiEmpty: "KI fand nichts."
};
const fields = [
  { name: "country", title: "Land", fieldType: "dropdown", allowCustomChoices: true, choices: [
    { value: "de", text: "Germany" }, { value: "fr", text: "France" }] },
  { name: "category", fieldType: "dropdown", choices: ["a", "b", "c", "d", "e", "f", "g"] },
  { name: "age", title: "Alter", fieldType: "text", inputType: "number" }
];
const presets = [{ name: "adults", title: "Adults", expression: "{age} > 18" }];
function control(locale: string, over: any = {}): QuestionFilterModel {
  const json = Object.assign({ type: "filter", name: "f1", fields: fields, items: presets }, over);
  const survey = new SurveyModel({ locale: locale, elements: [json] });
  return <QuestionFilterModel>survey.getQuestionByName("f1");
}
function titleOf(container: ActionContainer, id: string): string {
  return container.getActionById(id).title;
}
// The captions of the rows: Filters with its tooltip, Show More, Save, Save as..., Clear All, the
// presets' chip and its cross, which is on while the preset is.
function rowCaptions(q: QuestionFilterModel): Array<string> {
  const filters = q.chipsToolbar.getActionById("sv-filter-filters");
  const preset = <FilterChip>q.chipsToolbar.getActionById("sv-filter-preset");
  return [filters.title, filters.tooltip, titleOf(q.chipsToolbar, "sv-filter-more"), titleOf(q.clearToolbar, "sv-filter-save"),
    titleOf(q.clearToolbar, "sv-filter-save-as"), titleOf(q.clearToolbar, "sv-filter-clear"), preset.title];
}
// What settings.showDialog was asked to show, with a footer the control fills.
function stubDialogs(): { calls: Array<any>, restore: () => void } {
  const saved = settings.showDialog;
  const calls: Array<any> = [];
  settings.showDialog = (o: any): any => {
    const dialog: any = { options: o, footerToolbar: new ActionContainer(), model: { hide: () => o.onHide() } };
    calls.push(dialog);
    return dialog;
  };
  return { calls: calls, restore: () => { settings.showDialog = saved; } };
}

beforeAll(() => {
  surveyLocalization.locales["filterxx"] = xx;
  surveyLocalization.locales["filteryy"] = yy;
});
afterAll(() => {
  delete surveyLocalization.locales["filterxx"];
  delete surveyLocalization.locales["filteryy"];
});

describe("Filter localization: the rows", () => {
  test("Filters, Show More, Save, Save as..., Clear All and the presets' chip", () => {
    const q = control("filterxx");
    expect(rowCaptions(q), "#1").toEqual(["Filtern", "Filtern", "Mehr", "Speichern", "Speichern als...", "Alles leeren", "Vorlage"]);
    q.setFieldCondition("age", "greater", 18);
    expect(q.chipsToolbar.getActionById("sv-filter-filters").title, "#2").toBe("Filtern: 1");
    q.toggleItem("adults");
    const preset = <FilterChip>q.chipsToolbar.getActionById("sv-filter-preset");
    expect([preset.clearAction.ariaLabel, preset.clearAction.tooltip], "#3").toEqual(["Adults leeren", "Adults leeren"]);
    q.chipsLayout.isExpanded = true;
    expect(titleOf(q.chipsToolbar, "sv-filter-more"), "#4").toBe("Weniger");
  });
  test("follow a locale change of the survey", () => {
    const q = control("");
    expect(rowCaptions(q), "#1").toEqual(["All Filters", "All Filters", "Show More", "Save", "Save as...", "Clear All", "Filter Presets"]);
    (<SurveyModel>q.survey).locale = "filterxx";
    expect(rowCaptions(q), "#2").toEqual(["Filtern", "Filtern", "Mehr", "Speichern", "Speichern als...", "Alles leeren", "Vorlage"]);
    (<SurveyModel>q.survey).locale = "";
    expect(rowCaptions(q), "#3").toEqual(["All Filters", "All Filters", "Show More", "Save", "Save as...", "Clear All", "Filter Presets"]);
  });
  test("a locale that does not translate them shows them in English", () => {
    const q = control("filteryy");
    expect(rowCaptions(q)).toEqual(["All Filters", "All Filters", "Show More", "Save", "Save as...", "Clear All", "Filter Presets"]);
  });
  test("the search box: its placeholder names the fields it searches, and its accessible name", () => {
    const q = control("filterxx", { showSearch: true, searchFields: ["age"] });
    expect([q.searchPlaceholder, q.searchLabel], "#1").toEqual(["Suche nach Alter", "Suche"]);
    (<SurveyModel>q.survey).locale = "";
    expect([q.searchPlaceholder, q.searchLabel], "#2").toEqual(["Search by Alter", "Search"]);
  });
  test("the search box's placeholder joins the fields with the locale's \"or\"", () => {
    const q = control("filterxx", { showSearch: true, searchFields: ["country", "age"] });
    expect(q.searchPlaceholder, "#1: two fields").toBe("Suche nach Land oder Alter");
    q.searchFields = ["country", "category", "age"];
    expect(q.searchPlaceholder, "#2: three fields").toBe("Suche nach Land, category oder Alter");
    (<SurveyModel>q.survey).locale = "filteryy";
    expect(q.searchPlaceholder, "#3: no translation").toBe("Search by Land, category, or Alter");
  });
});

describe("Filter localization: the popups of the chips", () => {
  test("a field's popup: Clear All once every value is checked, and Add for a typed value", () => {
    const q = control("filterxx");
    const popup = q.createFieldPopup("country", () => { });
    const link = popup.headerToolbar.actions[0];
    link.action();
    expect(link.title, "#1").toBe("Alles leeren");
    popup.list.filterString = "Oreo";
    expect(popup.list.actions.filter((a: Action) => popup.list.isItemVisible(a)).map((a: Action) => a.title), "#2").toEqual(["\"Oreo\" dazu..."]);
    popup.dispose();
  });
  test("Save as...: the name's placeholder and the button", () => {
    const q = control("filterxx");
    const popup = q.createSaveAsPopup(() => { });
    const question = popup.survey.getQuestionByName("presetTitle");
    expect([question.title, question.placeholder, titleOf(popup.footerToolbar, "sv-filter-save-as-save")])
      .toEqual(["Bezeichnung", "Bezeichnung", "Sichern"]);
    popup.dispose();
  });
});

describe("Filter localization: the Filters dialog", () => {
  test("its title, search, presets' buttons, footer and the main button's counts", () => {
    const dialogs = stubDialogs();
    try {
      const q = control("filterxx");
      q.showAdvancedEditor();
      const host = dialogs.calls[0];
      const modal = host.options.data.holder.modal;
      expect([host.options.title, titleOf(host.footerToolbar, "sv-filter-modal-clear")], "#1").toEqual(["Filterdialog", "Alles leeren"]);
      expect([modal.searchPlaceholder, modal.nothingFoundText, modal.presetsTitle], "#2").toEqual(["In Filtern suchen", "Nichts gefunden", "Vorlagen"]);
      expect([titleOf(modal.presetsToolbar, "sv-filter-modal-add-preset"), titleOf(modal.presetsToolbar, "sv-filter-modal-edit-preset"),
        titleOf(modal.expressionToolbar, "sv-filter-modal-edit-expression")], "#3").toEqual(["Neu...", "Auswahl aendern...", "Aendern..."]);
      modal.isCounting = true;
      expect(modal.showResultsText, "#4").toBe("Zeilen zeigen");
      modal.isCounting = false;
      modal.resultCount = 1;
      expect(modal.showResultsText, "#5").toBe("1 Zeile zeigen");
      modal.resultCount = 12;
      expect(modal.showResultsText, "#6").toBe("12 Zeilen zeigen");
      modal.togglePreset(q.getItemByName("adults"));
      expect(modal.expressionTitle, "#7").toBe("Ausdruck von Adults");
      host.model.hide();
    } finally {
      dialogs.restore();
    }
  });
  test("Show More and Show Less of a long list of values", () => {
    const q = control("filterxx");
    const editor = new FilterConditionsEditor(q, ["category"], { useFieldKinds: true, showFieldTitles: true });
    const more = <Action>editor.survey.getPanelByName("f0").getFooterToolbar().getActionById("sv-filter-show-more");
    expect(more.title, "#1").toBe("Mehr");
    more.action();
    expect(more.title, "#2").toBe("Weniger");
    editor.dispose();
  });
});

describe("Filter localization: the preset dialogs", () => {
  test("New Preset: its title, the form's panels, Switch to Expression and the checks", () => {
    const q = control("filterxx");
    const dialog = q.createAddPresetDialog([]);
    const contains = <PanelModel>dialog.form.getPanelByName("contains");
    expect([dialog.title, (<PanelModel>dialog.form.getPanelByName("presetName")).title, contains.title], "#1")
      .toEqual(["Neue Vorlage", "Bezeichnung", "Felder"]);
    const toText = (<Array<Action>>contains.getTitleActions()).filter((a: Action) => a.id === "sv-filter-preset-edit-as-text")[0];
    expect(toText.title, "#2").toBe("Als Ausdruck");
    dialog.form.validate();
    expect(contains.errors.map((e: any): string => e.getText()), "#3").toEqual(["Keine Bedingung."]);
    toText.action();
    const expression = <PanelModel>dialog.form.getPanelByName("expression");
    const toFields = (<Array<Action>>expression.getTitleActions()).filter((a: Action) => a.id === "sv-filter-preset-edit-as-fields")[0];
    expect([expression.title, toFields.title, dialog.form.getQuestionByName("expression").placeholder], "#4")
      .toEqual(["Filterausdruck", "Als Tagbox", "Ausdruck..."]);
    dialog.dispose();
  });
  test("Edit Preset: its title and Delete", () => {
    const q = control("filterxx");
    // The dialog edits the preset that is on as it opens.
    q.toggleItem("adults");
    const modal = q.createFilterModal();
    const dialogs = stubDialogs();
    try {
      q.showPresetDialog(modal, true);
      const host = dialogs.calls[0];
      expect([host.options.title, titleOf(host.footerToolbar, "sv-filter-preset-delete")]).toEqual(["Vorlage aendern", "Loeschen"]);
      host.model.hide();
    } finally {
      dialogs.restore();
    }
    modal.dispose();
  });
  test("the checks of a preset's name and text", () => {
    expect(getFilterPresetTitleError("Adults", ["Adults"], "filterxx"), "#1").toBe("Die gibt es schon.");
    expect([getFilterExpressionError("", "filterxx"), getFilterExpressionError("{age} >", "filterxx")], "#2")
      .toEqual(["Kein Ausdruck.", "Falscher Ausdruck."]);
    expect(getFilterExpressionError("", "filteryy"), "#3: no translation").toBe("Enter an expression.");
  });
  test("the AI description: its caption, placeholder, button and errors", () => {
    const q = control("filterxx");
    const calls: Array<any> = [];
    (<SurveyModel>q.survey).onAIFilterRequest.add((_: SurveyModel, options: any): void => { calls.push(options); });
    const dialog = q.createAddPresetDialog([]);
    const prompt = dialog.aiPrompt;
    expect([prompt.promptTitle, prompt.requestAction.title, dialog.survey.getQuestionByName("prompt").placeholder], "#1")
      .toEqual(["Mit KI anlegen", "Anlegen", "Zum Beispiel: Tee"]);
    prompt.prompt = "adults";
    prompt.request();
    expect(prompt.requestAction.title, "#2").toBe("Lege an...");
    calls[0].callback({ data: { expression: "" } });
    expect(prompt.errorText, "#3").toBe("KI fand nichts.");
    prompt.request();
    calls[1].callback({ error: "quota" });
    expect(prompt.errorText, "#4").toBe("KI-Fehler.");
    dialog.dispose();
    const edited = q.createAddPresetDialog([], "{age} > 1 or {age} < 0");
    expect([edited.aiPrompt.promptTitle, edited.aiPrompt.requestAction.title], "#5").toEqual(["Mit KI aendern", "Aendern"]);
    edited.dispose();
  });
});
