import { describe, test, expect } from "vitest";
import { createFilter } from "./filter-test-helpers";
import { SurveyModel } from "../../src/survey";
import { QuestionFilterModel } from "../../src/question_filter";
import { FilterPresetDialog, FilterEditPresetsDialog } from "../../src/filter/filter-preset-dialog";
import { FilterModal } from "../../src/filter/filter-modal";
import { PanelModel } from "../../src/panel";
import { Action } from "../../src/actions/action";
import { ActionContainer } from "../../src/actions/container";
import { FunctionFactory } from "../../src/functionsfactory";
import { settings } from "../../src/settings";
import { buildFilterAIContext, buildFilterAISystemPrompt } from "../../src/filter/filter-ai";

// AI is one more way to write a preset: the description and its button in Add New Preset and in
// every editable tab of Edit Presets, while the application answers onAIFilterRequest. The model's
// filter is the preset's - as fields where it decomposes, as text otherwise.
function open(over: any = {}, withHandler: boolean = true): { q: QuestionFilterModel, dialog: FilterPresetDialog, calls: Array<any> } {
  const q = createFilter(Object.assign({ items: [{ name: "adults", title: "Adults", expression: "{age} > 18" }] }, over));
  const calls: Array<any> = [];
  if (withHandler) {
    (<SurveyModel>q.survey).onAIFilterRequest.add((_: SurveyModel, options: any): void => { calls.push(options); });
  }
  return { q: q, dialog: q.createAddPresetDialog([]), calls: calls };
}
const answer = (expression: string, title: string = "", explanation: string = "") =>
  ({ data: { expression: expression, title: title, explanation: explanation } });
function rows(dialog: FilterPresetDialog): Array<string> {
  const panel = <PanelModel>dialog.form.getPanelByName("contains");
  return !!panel ? panel.elements.map((row: any): string => row.value || "") : undefined;
}
const text = (dialog: FilterPresetDialog): string => dialog.form.getValue("expression");
const name = (dialog: FilterPresetDialog): string => dialog.form.getValue("presetTitle");

describe("Add New Preset: the AI description before the first answer", () => {
  test("the description and the request button", () => {
    const { dialog } = open();
    const prompt = dialog.aiPrompt;
    expect([prompt.isModify, prompt.promptTitle], "#1").toEqual([false, "Describe what you need - AI will do the rest."]);
    expect([prompt.requestAction.title, prompt.requestAction.enabled, prompt.requestAction.iconName], "#2")
      .toEqual(["Create new filter", false, "icon-sparkle-24x24"]);
    expect([dialog.survey.getQuestionByName("prompt").getType(), dialog.survey.getQuestionByName("prompt").maxLength], "#3").toEqual(["comment", 500]);
    prompt.prompt = "adults";
    expect(prompt.requestAction.enabled, "#4").toBe(true);
    prompt.prompt = "   ";
    expect(prompt.requestAction.enabled, "#5: a blank description").toBe(false);
    expect([dialog.editor, dialog.hasSurveyContent, dialog.canApply], "#6").toEqual([undefined, true, true]);
    dialog.dispose();
  });
  test("the description is in a panel of its own, after the fields' frame", () => {
    const { dialog } = open();
    const question = dialog.survey.getQuestionByName("prompt");
    expect([question.parent.isPanel, question.parent.name, dialog.survey.pages[0].elements.map((e: any): string => e.name)])
      .toEqual([true, "promptPanel", ["fields", "promptPanel"]]);
    dialog.dispose();
  });
  test("the description is survey elements only: the panel's title, its comment and the button in its footer", () => {
    const { q, dialog } = open();
    const prompt = dialog.aiPrompt;
    const panel = prompt.panel;
    const question = dialog.survey.getQuestionByName("prompt");
    expect([panel.title, question.title, question.titleLocation], "#1: the hidden title is the accessible name")
      .toEqual(["Describe what you need - AI will do the rest.", "Describe what you need - AI will do the rest.", "hidden"]);
    const footer = panel.getFooterToolbar();
    expect([footer.actions.length, footer.actions[0] === prompt.requestAction, panel.allowAdaptiveActions], "#2").toEqual([1, true, false]);
    expect(footer.containerCss.split(" ").indexOf(q.cssClasses.aiPromptRequest) > -1, "#3").toBe(true);
    expect(panel.getContainerCss().split(" ").indexOf(q.cssClasses.aiPrompt) > -1, "#4: the frame").toBe(true);
    dialog.dispose();
  });
  test("errorText is the description's error", () => {
    const { dialog } = open();
    const question = dialog.survey.getQuestionByName("prompt");
    dialog.aiPrompt.errorText = "quota";
    expect([question.errors.length, question.errors[0].getText(), question.getErrorLocation()], "#1").toEqual([1, "quota", "bottom"]);
    dialog.aiPrompt.errorText = "";
    expect(question.errors.length, "#2").toBe(0);
    dialog.dispose();
  });
  test("none while the application does not answer AI requests", () => {
    const { dialog } = open({}, false);
    expect([dialog.aiPrompt, dialog.hasSurveyContent]).toEqual([undefined, false]);
    dialog.dispose();
  });
  test("a filter the respondent put together is one to change: Make Changes", () => {
    const { dialog } = open();
    dialog.editAsText();
    dialog.form.getQuestionByName("expression").value = "{age} > 1 or {age} < 0";
    expect([dialog.aiPrompt.isModify, dialog.aiPrompt.requestAction.title]).toEqual([true, "Make Changes"]);
    dialog.dispose();
  });
});

describe("Add New Preset: the answer", () => {
  test("an answer of the fields form fills Contains, names the preset, and the button becomes Make Changes", () => {
    const { dialog, calls } = open();
    const prompt = dialog.aiPrompt;
    prompt.prompt = "adults";
    prompt.request();
    expect([calls.length, calls[0].action, calls[0].userPrompt, calls[0].expression, prompt.isBusy, dialog.canApply], "#1")
      .toEqual([1, "generate", "adults", "", true, false]);
    expect(prompt.requestAction.title, "#1a: the button says it is busy").toBe("Creating filter...");
    calls[0].callback(answer("{age} > 18 and {country} anyof ['de']", "German adults"));
    expect([rows(dialog), dialog.editor.getConditions(), name(dialog)], "#2").toEqual([["country", "age"],
      [{ field: "country", operator: "anyof", value: ["de"] }, { field: "age", operator: "greater", value: 18 }], "German adults"]);
    expect([prompt.isBusy, prompt.isModify, prompt.requestAction.title, prompt.promptTitle, prompt.prompt, dialog.canApply], "#3")
      .toEqual([false, true, "Make Changes", "Describe what to change - AI will do the rest.", "adults", true]);
    dialog.dispose();
  });
  test("an answer that does not decompose is the preset's text; with no title the fields it names give one", () => {
    const { dialog, calls } = open();
    dialog.aiPrompt.prompt = "the very young and the old";
    dialog.aiPrompt.request();
    calls[0].callback(answer("{age} < 5 or {age} > 90"));
    expect([dialog.isTextMode, text(dialog), name(dialog), dialog.aiPrompt.isModify]).toEqual([true, "{age} < 5 or {age} > 90", "age", true]);
    dialog.dispose();
  });
  test("Make Changes sends the filter as it is now, with what to change", () => {
    const { dialog, calls } = open();
    dialog.aiPrompt.prompt = "adults";
    dialog.aiPrompt.request();
    calls[0].callback(answer("{age} > 18"));
    dialog.editor.survey.getQuestionByName("f0_value").value = 21;
    dialog.aiPrompt.prompt = "and from France";
    dialog.aiPrompt.request();
    expect(dialog.aiPrompt.requestAction.title, "#0: busy").toBe("Making changes...");
    expect([calls[1].action, calls[1].userPrompt, calls[1].expression], "#1").toEqual(["modify", "and from France", "{age} > 21"]);
    calls[1].callback(answer("{age} > 21 and {country} = 'fr'"));
    expect(rows(dialog), "#2").toEqual(["country", "age"]);
    dialog.editAsText();
    dialog.aiPrompt.prompt = "or very old";
    dialog.aiPrompt.request();
    expect(calls[2].expression, "#3: a text goes as it is").toBe("{country} = 'fr' and {age} > 21");
    dialog.dispose();
  });
  test("a name the respondent typed stays; a model's title another preset has gets a number", () => {
    const first = open();
    first.dialog.form.setValue("presetTitle", "Mine");
    first.dialog.aiPrompt.prompt = "adults";
    first.dialog.aiPrompt.request();
    first.calls[0].callback(answer("{age} > 18", "Grown-ups"));
    expect(name(first.dialog), "#1").toBe("Mine");
    first.dialog.dispose();
    const second = open();
    second.dialog.aiPrompt.prompt = "adults";
    second.dialog.aiPrompt.request();
    second.calls[0].callback(answer("{age} > 21", "adults"));
    expect(name(second.dialog), "#2").toBe("adults 2");
    second.dialog.dispose();
  });
  test("Apply adds the answer as a preset", () => {
    const { q, dialog, calls } = open();
    dialog.aiPrompt.prompt = "the very young and the old";
    dialog.aiPrompt.request();
    calls[0].callback(answer("{age} < 5 or {age} > 90", "Ends"));
    expect(dialog.apply(), "#1").toBe(true);
    const item = q.getItemByName("userItem1");
    expect([item.title, item.expression], "#2").toEqual(["Ends", "{age} < 5 or {age} > 90"]);
    dialog.dispose();
  });
});

describe("Add New Preset: what can go wrong", () => {
  test("an answer after the dialog is gone changes nothing", () => {
    const { q, dialog, calls } = open();
    const count = q.visibleItems.length;
    dialog.aiPrompt.prompt = "adults";
    dialog.aiPrompt.request();
    dialog.dispose();
    expect(() => calls[0].callback(answer("{age} > 18")), "#1").not.toThrow();
    expect([q.visibleItems.length, dialog.editor], "#2").toEqual([count, undefined]);
  });
  test("an answer to a cancelled request is ignored", () => {
    const { dialog, calls } = open();
    const prompt = dialog.aiPrompt;
    prompt.prompt = "adults";
    prompt.request();
    prompt.cancel();
    expect(prompt.isBusy, "#1").toBe(false);
    prompt.request();
    calls[0].callback(answer("{age} > 18"));
    expect([dialog.editor, prompt.isBusy], "#2").toEqual([undefined, true]);
    calls[1].callback(answer("{age} < 10"));
    expect(dialog.editor.getConditions(), "#3").toEqual([{ field: "age", operator: "less", value: 10 }]);
    dialog.dispose();
  });
  test("a handler that throws, an error, and an empty answer", () => {
    const q = createFilter();
    let mode = "throw";
    (<SurveyModel>q.survey).onAIFilterRequest.add((_: SurveyModel, options: any): void => {
      if (mode === "throw") throw new Error("x");
      if (mode === "error") options.callback({ error: "quota" });
      if (mode === "empty") options.callback(answer("", "", "no such field"));
      if (mode === "silent") options.callback(answer(""));
    });
    const dialog = q.createAddPresetDialog([]);
    const prompt = dialog.aiPrompt;
    prompt.prompt = "adults";
    prompt.request();
    expect([prompt.isBusy, prompt.errorText], "#1").toEqual([false, "AI could not make a filter. Try again."]);
    mode = "error";
    prompt.request();
    expect(prompt.errorText, "#2").toBe("AI could not make a filter. Try again.");
    mode = "empty";
    prompt.request();
    expect([prompt.errorText, prompt.isModify], "#3").toEqual(["no such field", false]);
    mode = "silent";
    prompt.request();
    expect(prompt.errorText, "#4").toBe("AI could not make a filter of this description.");
    dialog.dispose();
  });
});

describe("Edit Presets: AI and a preset edited as text", () => {
  const presets = [
    { name: "adults", title: "Adults", expression: "{age} > 18" },
    { name: "edges", title: "Edges", expression: "{age} < 18 or {age} > 35" }];
  function edit(selected: string): { q: QuestionFilterModel, dialog: FilterEditPresetsDialog, calls: Array<any> } {
    const q = createFilter({ items: presets });
    const calls: Array<any> = [];
    (<SurveyModel>q.survey).onAIFilterRequest.add((_: SurveyModel, options: any): void => { calls.push(options); });
    return { q: q, dialog: q.createEditPresetsDialog(selected), calls: calls };
  }
  test("Make Changes on a text tab sends its text; an answer of the fields form shows as fields", () => {
    const { q, dialog, calls } = edit("edges");
    dialog.aiPrompt.prompt = "only the young";
    dialog.aiPrompt.request();
    expect([calls[0].action, calls[0].expression], "#1").toEqual(["modify", "{age} < 18 or {age} > 35"]);
    calls[0].callback(answer("{age} < 18"));
    expect([dialog.isTextMode, rows(dialog), (<any>dialog).tabs[1].isTouched, name(dialog)], "#2").toEqual([false, ["age"], true, "Edges"]);
    expect(dialog.apply(), "#3").toBe(true);
    expect(q.getItemByName("edges").expression, "#4").toBe("{age} < 18");
    dialog.dispose();
  });
  test("an answer that does not decompose turns a fields tab into text", () => {
    const { dialog, calls } = edit("adults");
    dialog.aiPrompt.prompt = "or babies";
    dialog.aiPrompt.request();
    calls[0].callback(answer("{age} > 18 or {age} < 2"));
    expect([dialog.isTextMode, text(dialog), !!dialog.aiPrompt, dialog.aiPrompt.prompt]).toEqual([true, "{age} > 18 or {age} < 2", true, "or babies"]);
    dialog.dispose();
  });
});

describe("FilterToolbars: Add New Preset with AI over the Filters dialog", () => {
  function stubDialogs(): { calls: Array<any>, restore: () => void } {
    const saved = settings.showDialog;
    const calls: Array<any> = [];
    settings.showDialog = (o: any): any => {
      const dialog: any = { options: o, footerToolbar: new ActionContainer(), model: { hide: () => o.onHide() } };
      dialog.cancel = (): void => { o.onCancel(); o.onHide(); };
      calls.push(dialog);
      return dialog;
    };
    return { calls: calls, restore: () => { settings.showDialog = saved; } };
  }
  test("its Apply is off while the model answers; closed meanwhile, the answer changes nothing", () => {
    const dialogs = stubDialogs();
    try {
      const { q, calls } = open();
      q.showAdvancedEditor();
      const modal: FilterModal = dialogs.calls[0].options.data.holder.modal;
      (<Action>modal.creationToolbar.getActionById("sv-filter-modal-add-preset")).action();
      const add: FilterPresetDialog = dialogs.calls[1].options.data.holder.presetDialog;
      const apply: Action = dialogs.calls[1].footerToolbar.actions[1];
      add.aiPrompt.prompt = "kids";
      add.aiPrompt.request();
      expect(apply.enabled, "#1").toBe(false);
      dialogs.calls[1].cancel();
      expect(add.isDisposed, "#2").toBe(true);
      expect(() => calls[0].callback(answer("{age} < 10")), "#3").not.toThrow();
      expect(modal.presetsToolbar.actions.map((a: Action): string => a.title), "#4").toEqual(["Adults"]);
      dialogs.calls[0].cancel();
    } finally {
      dialogs.restore();
    }
  });
});

describe("buildFilterAISystemPrompt: the fields form and the text form", () => {
  test("prefers the fields form, allows any expression over the fields, and carries the syntax guide and the functions", () => {
    FunctionFactory.Instance.register("filterTestAsync", function () { this.returnResult(1); }, true);
    try {
      const prompt = buildFilterAISystemPrompt(buildFilterAIContext(createFilter()));
      expect([prompt.indexOf("Prefer the fields form") > -1, prompt.indexOf("fields form: {price} > 100") > -1,
        prompt.indexOf("text form: {price} > 10 or {country} = 'de'") > -1], "#1").toEqual([true, true, true]);
      expect(["## Literals", "## Logic", "## Arithmetic", "## Functions", "## References", "## Scopes", "## Derived keys"]
        .map((title: string): boolean => prompt.indexOf("\n" + title + "\n") > -1), "#2: no sections about survey questions")
        .toEqual([true, true, true, true, false, false, false]);
      expect([prompt.indexOf("- iif(") > -1, prompt.indexOf("filterTestAsync") > -1], "#3: synchronous functions only").toEqual([true, false]);
    } finally {
      FunctionFactory.Instance.unregister("filterTestAsync");
    }
  });
});
