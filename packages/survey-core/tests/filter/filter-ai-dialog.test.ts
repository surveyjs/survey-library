import { describe, test, expect } from "vitest";
import { createFilter } from "./filter-test-helpers";
import { SurveyModel } from "../../src/survey";
import { PanelModel } from "../../src/panel";
import { QuestionFilterModel } from "../../src/question_filter";
import { conditionsToExpression } from "../../src/filter/filter-conditions";
import { FilterAIDialog, makeFilterAITitle } from "../../src/filter/filter-ai-dialog";

// The Create custom filter dialog: a description, the model's filter as the fields' editors, Make
// Changes, and Apply, which adds it as an AI preset.
function open(over: any = {}): { q: QuestionFilterModel, dialog: FilterAIDialog, calls: Array<any> } {
  const q = createFilter(Object.assign({ items: [{ name: "adults", title: "Adults", expression: "{age} > 18" }] }, over));
  const calls: Array<any> = [];
  (<SurveyModel>q.survey).onAIFilterRequest.add((_: SurveyModel, options: any): void => { calls.push(options); });
  return { q: q, dialog: q.createAIDialog(), calls: calls };
}
const answer = (expression: string, title: string = "", explanation: string = "") =>
  ({ data: { expression: expression, title: title, explanation: explanation } });

describe("FilterAIDialog: before the first answer", () => {
  test("the description, the request button and nothing to apply", () => {
    const { dialog } = open();
    const prompt = dialog.aiPrompt;
    expect([dialog.title, prompt.isModify, prompt.promptTitle], "#1")
      .toEqual(["Create custom filter", false, "Describe what you need - AI will do the rest."]);
    expect([prompt.requestAction.title, prompt.requestAction.enabled, prompt.requestAction.iconName], "#2")
      .toEqual(["Create new filter", false, "icon-sparkle-24x24"]);
    expect([dialog.survey.getQuestionByName("prompt").getType(), dialog.survey.getQuestionByName("prompt").maxLength], "#3").toEqual(["comment", 500]);
    prompt.prompt = "adults";
    expect(prompt.requestAction.enabled, "#4").toBe(true);
    prompt.prompt = "   ";
    expect(prompt.requestAction.enabled, "#5: a blank description").toBe(false);
    expect([dialog.editor, dialog.canApply, dialog.apply()], "#6").toEqual([undefined, false, false]);
    dialog.dispose();
  });
  test("the description is in a panel of its own: a question outside a panel gets a frame, the mockup has none", () => {
    const { dialog } = open();
    const question = dialog.survey.getQuestionByName("prompt");
    expect([question.parent.isPanel, question.parent.name]).toEqual([true, "promptPanel"]);
    dialog.dispose();
  });
  test("the description is survey elements only: the panel's title, its comment and the button in its footer", () => {
    const { q, dialog } = open();
    const prompt = dialog.aiPrompt;
    const panel = prompt.panel;
    const question = dialog.survey.getQuestionByName("prompt");
    expect([panel.name, panel.title, question.title, question.titleLocation], "#1: the hidden title is the accessible name")
      .toEqual(["promptPanel", "Describe what you need - AI will do the rest.", "Describe what you need - AI will do the rest.", "hidden"]);
    const footer = panel.getFooterToolbar();
    expect([footer.actions.length, footer.actions[0] === prompt.requestAction, panel.allowAdaptiveActions], "#2").toEqual([1, true, false]);
    const css = prompt.requestAction.getActionBarItemCss();
    expect([css.indexOf("sd-action--brand") > -1, css.indexOf("sd-action--secondary") > -1], "#3: the mockup's light brand button").toEqual([true, true]);
    expect(footer.containerCss.split(" ").indexOf(q.cssClasses.aiPromptRequest) > -1, "#4").toBe(true);
    expect(panel.getContainerCss().split(" ").indexOf(q.cssClasses.aiPrompt) > -1, "#5: the frame").toBe(true);
    dialog.dispose();
  });
  test("errorText is the description's error", () => {
    const { dialog } = open();
    const prompt = dialog.aiPrompt;
    const question = dialog.survey.getQuestionByName("prompt");
    prompt.errorText = "quota";
    expect([question.errors.length, question.errors[0].getText(), question.getErrorLocation()], "#1").toEqual([1, "quota", "bottom"]);
    prompt.errorText = "";
    expect(question.errors.length, "#2").toBe(0);
    dialog.dispose();
  });
});

describe("FilterAIDialog: one survey", () => {
  test("the dialog draws one survey: the prompt is in it, with no title, numbers, navigation or theme root", () => {
    const { q, dialog } = open();
    const survey = dialog.survey;
    expect([dialog.aiPrompt.panel.survey === survey, survey.pages.length, survey.pages[0].elements.map((e: any): string => e.name)], "#1")
      .toEqual([true, 1, ["promptPanel"]]);
    expect([survey.state, survey.currentPage === survey.pages[0]], "#1a: a page to draw").toEqual(["running", true]);
    expect([survey.showNavigationButtons, survey.showQuestionNumbers, survey.css.rootTheme], "#2")
      .toEqual([false, "off", ""]);
    expect(survey.getRootCss().split(" ").filter((c: string): boolean => c === q.cssClasses.editor || c === q.cssClasses.modalEditor), "#3")
      .toEqual([q.cssClasses.editor, q.cssClasses.modalEditor]);
    dialog.dispose();
    expect(survey.isDisposed, "#4: the dialog owns it").toBe(true);
  });
  test("an answer puts the fields' panels over the prompt's, and the next answer replaces them", () => {
    const { dialog, calls } = open();
    const survey = dialog.survey;
    const names = (): Array<string> => survey.pages[0].elements.map((e: any): string => e.name);
    dialog.aiPrompt.prompt = "adults";
    dialog.aiPrompt.request();
    calls[0].callback(answer("{age} > 18 and {country} anyof ['de']"));
    expect([dialog.editor.survey === survey, names()], "#1").toEqual([true, ["f0", "f1", "promptPanel"]]);
    dialog.aiPrompt.request();
    calls[1].callback(answer("{age} < 10"));
    expect([names(), survey.getAllQuestions().map((qn: any): string => qn.name)], "#2")
      .toEqual([["f0", "promptPanel"], ["f0_operator", "f0_value", "prompt"]]);
    expect([survey.getValue("f1_value"), survey.getValue("prompt")], "#3: the old fields leave no values").toEqual([undefined, "adults"]);
    dialog.removeField("age");
    expect([names(), dialog.editor], "#4").toEqual([["promptPanel"], undefined]);
    dialog.dispose();
  });
});

describe("FilterAIDialog: the answer", () => {
  test("shows the filter as the fields' editors, and the button becomes Make Changes", () => {
    const { dialog, calls } = open();
    const prompt = dialog.aiPrompt;
    prompt.prompt = "adults";
    prompt.request();
    expect([calls.length, calls[0].action, calls[0].userPrompt, prompt.isBusy, prompt.requestAction.enabled, dialog.canApply], "#1")
      .toEqual([1, "generate", "adults", true, false, false]);
    expect(prompt.requestAction.title, "#1a: the button says it is busy").toBe("Creating filter...");
    calls[0].callback(answer("{age} > 18 and {country} anyof ['de']", "Adults"));
    expect([prompt.isBusy, prompt.isModify, prompt.errorText], "#2").toEqual([false, true, ""]);
    expect(dialog.editor.fieldNames, "#3").toEqual(["country", "age"]);
    expect(dialog.conditions, "#4").toEqual([{ field: "country", operator: "anyof", value: ["de"] }, { field: "age", operator: "greater", value: 18 }]);
    expect([prompt.requestAction.title, prompt.promptTitle, prompt.prompt, dialog.canApply], "#5")
      .toEqual(["Make Changes", "Describe what to change - if needed.", "adults", true]);
    dialog.dispose();
  });
  test("Make Changes sends the filter as it is with the new description, and the editors are made anew", () => {
    const { q, dialog, calls } = open();
    const prompt = dialog.aiPrompt;
    prompt.prompt = "adults";
    prompt.request();
    calls[0].callback(answer("{age} > 18 and {country} anyof ['de']", "Adults"));
    const before = dialog.conditions;
    const editor = dialog.editor;
    prompt.prompt = "adults from France";
    prompt.request();
    expect(prompt.requestAction.title, "#0: busy").toBe("Making changes...");
    expect([calls[1].action, calls[1].userPrompt, calls[1].expression], "#1")
      .toEqual(["modify", "adults from France", conditionsToExpression(before, q.getFilterFields())]);
    calls[1].callback(answer("{age} > 18 and {country} anyof ['fr']", "Adults from France"));
    expect(dialog.editor !== editor, "#2").toBe(true);
    expect(dialog.conditions, "#3").toEqual([{ field: "country", operator: "anyof", value: ["fr"] }, { field: "age", operator: "greater", value: 18 }]);
    dialog.dispose();
  });
  test("the trash of a field takes its condition away", () => {
    const { dialog, calls } = open();
    dialog.aiPrompt.prompt = "adults";
    dialog.aiPrompt.request();
    calls[0].callback(answer("{age} > 18 and {country} anyof ['de']"));
    const panel = <PanelModel>dialog.editor.survey.getPanelByName("f0");
    const trash = panel.getTitleActions().filter((a: any): boolean => a.id === "sv-filter-ai-remove")[0];
    expect([!!trash, trash.iconName], "#1: the mockup's 16px bin").toEqual([true, "icon-delete-16x16"]);
    trash.action();
    expect([dialog.editor.fieldNames, dialog.conditions], "#2").toEqual([["age"], [{ field: "age", operator: "greater", value: 18 }]]);
    dialog.removeField("age");
    expect([dialog.editor, dialog.canApply], "#3: nothing left").toEqual([undefined, false]);
    dialog.dispose();
  });
  test("Make Changes once the trash took every field away asks for a new filter", () => {
    const { dialog, calls } = open();
    dialog.aiPrompt.prompt = "adults";
    dialog.aiPrompt.request();
    calls[0].callback(answer("{age} > 18"));
    dialog.removeField("age");
    expect([dialog.editor, dialog.aiPrompt.isModify, dialog.aiPrompt.requestAction.title], "#1").toEqual([undefined, true, "Make Changes"]);
    dialog.aiPrompt.request();
    expect([calls[1].action, calls[1].userPrompt], "#2").toEqual(["generate", "adults"]);
    dialog.dispose();
  });
  test("Apply adds an AI preset with the description and the model's title", () => {
    const { q, dialog, calls } = open();
    dialog.aiPrompt.prompt = "adults from France";
    dialog.aiPrompt.request();
    calls[0].callback(answer("{age} > 18 and {country} anyof ['fr']", "French adults"));
    expect(dialog.apply(), "#1").toBe(true);
    const item = dialog.createdItem;
    expect([item.kind, item.prompt, item.title, item.expression], "#2")
      .toEqual(["ai", "adults from France", "French adults", "{country} anyof ['fr'] and {age} > 18"]);
    expect(q.visibleItems[q.visibleItems.length - 1], "#3").toBe(item);
    dialog.dispose();
  });
  test("an answer to Make Changes with no title keeps the title the model gave before", () => {
    const { dialog, calls } = open();
    dialog.aiPrompt.prompt = "countries";
    dialog.aiPrompt.request();
    calls[0].callback(answer("{country} anyof ['de']", "Country"));
    dialog.aiPrompt.request();
    calls[1].callback(answer("{country} anyof ['de'] and {age} > 18", ""));
    dialog.apply();
    expect(dialog.createdItem.title).toBe("Country");
    dialog.dispose();
  });
  test("a title the model gives that is taken gets a number", () => {
    const { dialog, calls } = open();
    dialog.aiPrompt.prompt = "adults";
    dialog.aiPrompt.request();
    calls[0].callback(answer("{age} > 18", "adults"));
    dialog.apply();
    expect(dialog.createdItem.title).toBe("adults 2");
    dialog.dispose();
  });
});

describe("FilterAIDialog: what can go wrong", () => {
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
    expect(dialog.conditions, "#3").toEqual([{ field: "age", operator: "less", value: 10 }]);
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
    const dialog = q.createAIDialog();
    const prompt = dialog.aiPrompt;
    prompt.prompt = "adults";
    prompt.request();
    expect([prompt.isBusy, prompt.errorText, dialog.canApply], "#1").toEqual([false, "AI could not make a filter. Try again.", false]);
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

describe("makeFilterAITitle", () => {
  test("the model's title, cut to a preset's length", () => {
    expect(makeFilterAITitle("A very long title that is longer than allowed", [], [])).toBe("A very long title that is longer");
  });
  test("the fields' titles when the model gave none", () => {
    expect(makeFilterAITitle("", ["Country", "Age"], [])).toBe("Country, Age");
  });
  test("a taken title gets a number, still within the length", () => {
    expect(makeFilterAITitle("Adults", [], ["adults"]), "#1").toBe("Adults 2");
    expect(makeFilterAITitle("Adults", [], ["Adults", "Adults 2"]), "#2").toBe("Adults 3");
    const long = "x".repeat(32);
    const res = makeFilterAITitle(long, [], [long]);
    expect([res.length, res.substring(res.length - 2)], "#3").toEqual([32, " 2"]);
  });
});
