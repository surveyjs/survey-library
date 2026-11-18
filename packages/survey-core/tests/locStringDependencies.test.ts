import { describe, test, expect, afterEach } from "vitest";
import { Base, PropertyAccessTracker, IPropertyArrayValueChangedEvent } from "../src/base";
import { SurveyModel } from "../src/survey";
import { LocalizableString } from "../src/localizablestring";
import { ChangedKeys } from "../src/conditions/conditionProcessValue";
import { settings } from "../src/settings";
import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { QuestionDropdownModel } from "../src/question_dropdown";
import { PageModel } from "../src/page";
export * from "../src/question_text";
export * from "../src/question_html";
export * from "../src/question_checkbox";

// How many times a string has refreshed (strChanged fired onStringChanged) since the call
function countRefreshes(locStr: LocalizableString): { count: number } {
  const res = { count: 0 };
  locStr.renderedHtml;
  locStr.onStringChanged.add(() => res.count++);
  return res;
}
function createTracker(): { tracker: PropertyAccessTracker, log: Array<{ model: Base, name: string }> } {
  const log: Array<{ model: Base, name: string }> = [];
  const tracker = new PropertyAccessTracker((model: Base, options: IPropertyArrayValueChangedEvent) => {
    log.push({ model, name: options.name });
  });
  return { tracker, log };
}
function renderAndSubscribe(read: () => void): { tracker: PropertyAccessTracker, log: Array<{ model: Base, name: string }> } {
  const res = createTracker();
  res.tracker.startTracking();
  try {
    read();
  } finally {
    res.tracker.stopTracking();
  }
  res.tracker.subscribe();
  return res;
}

describe("A localizable string keeps the names of its text", () => {
  test("the names of a text, none for a text without placeholders, and new ones after a text change", () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q1", title: "Hello {q2} and { q3 }, {q2} again, {a:b}" }] });
    const locTitle = survey.getQuestionByName("q1").locTitle;
    expect(locTitle.getTextNames()).toEqual(["q2", "q3"]);
    locTitle.text = "No placeholders";
    expect(locTitle.getTextNames()).toEqual([]);
    expect(locTitle["textNamesInfo"], "nothing is kept for a text without placeholders").toBeUndefined();
    locTitle.text = "Bye {q4}";
    expect(locTitle.getTextNames()).toEqual(["q4"]);
  });
  test("a locale change gives the names of the text in the new locale", () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q1", title: { default: "Hello {q2}", de: "Hallo {q3}" } }] });
    const locTitle = survey.getQuestionByName("q1").locTitle;
    expect(locTitle.getTextNames()).toEqual(["q2"]);
    survey.locale = "de";
    expect(locTitle.getTextNames()).toEqual(["q3"]);
    survey.locale = "";
  });
  test("the names follow the variable delimiters", () => {
    const prev = settings.expressionVariableDelimiters;
    settings.expressionVariableDelimiters = { start: "{{", end: "}}" };
    try {
      const survey = new SurveyModel({ elements: [{ type: "text", name: "q1", title: "Hello {{q2}} {q3}" }] });
      expect(survey.getQuestionByName("q1").locTitle.getTextNames()).toEqual(["q2"]);
    } finally {
      settings.expressionVariableDelimiters = prev;
    }
  });
});

describe("A value change refreshes the strings that show the changed names", () => {
  test("only the strings with a changed name refresh; a string without names does not", () => {
    const survey = new SurveyModel({ elements: [
      { type: "text", name: "q1" },
      { type: "text", name: "q2", title: "Q2 shows {q1}" },
      { type: "text", name: "q3", title: "Q3 shows {q4}" },
      { type: "text", name: "q4", title: "Plain title" }
    ] });
    const q2 = countRefreshes(survey.getQuestionByName("q2").locTitle);
    const q3 = countRefreshes(survey.getQuestionByName("q3").locTitle);
    const q4 = countRefreshes(survey.getQuestionByName("q4").locTitle);
    survey.setValue("q1", "A");
    expect(q2.count, "q2's title shows q1").toBe(1);
    expect(q3.count, "q3's title shows q4").toBe(0);
    expect(q4.count, "a title without names").toBe(0);
    expect(survey.getQuestionByName("q2").locTitle.renderedHtml).toBe("Q2 shows A");
    survey.setValue("q4", "B");
    expect(q2.count).toBe(1);
    expect(q3.count).toBe(1);
    expect(survey.getQuestionByName("q3").locTitle.renderedHtml).toBe("Q3 shows B");
  });
  test("a variable change refreshes the strings that show the variable, in any letter case", () => {
    const survey = new SurveyModel({ elements: [
      { type: "text", name: "q1", title: "Var: {myVar}" },
      { type: "text", name: "q2", title: "Other: {other}" }
    ] });
    const q1 = countRefreshes(survey.getQuestionByName("q1").locTitle);
    const q2 = countRefreshes(survey.getQuestionByName("q2").locTitle);
    survey.setVariable("MyVar", 5);
    expect(q1.count).toBe(1);
    expect(q2.count).toBe(0);
    expect(survey.getQuestionByName("q1").locTitle.renderedHtml).toBe("Var: 5");
    survey.setVariables({ other: 7 });
    expect(q1.count).toBe(1);
    expect(q2.count).toBe(1);
    expect(survey.getQuestionByName("q2").locTitle.renderedHtml).toBe("Other: 7");
  });
  test("a path under a cleared value refreshes", () => {
    const survey = new SurveyModel({ elements: [
      { type: "text", name: "q2", title: "Value: {obj.a}" }
    ] });
    survey.setValue("obj", { a: 1 });
    const locTitle = survey.getQuestionByName("q2").locTitle;
    expect(locTitle.renderedHtml).toBe("Value: 1");
    survey.clearValue("obj");
    expect(locTitle.renderedHtml, "a name without a value stays in the text").toBe("Value: {obj.a}");
  });
  test("a calculated value set inside a conditions pass refreshes the strings that show it", () => {
    const survey = new SurveyModel({
      calculatedValues: [{ name: "total", expression: "{q1} + 1" }],
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2", title: "Total: {total}" },
        { type: "text", name: "q3", title: "Other: {other}" }
      ] });
    const q2 = countRefreshes(survey.getQuestionByName("q2").locTitle);
    const q3 = countRefreshes(survey.getQuestionByName("q3").locTitle);
    survey.setValue("q1", 2);
    expect(survey.getQuestionByName("q2").locTitle.renderedHtml).toBe("Total: 3");
    expect(q2.count > 0).toBe(true);
    expect(q3.count).toBe(0);
  });
  test("unknown keys refresh every string with names", () => {
    const survey = new SurveyModel({ elements: [
      { type: "text", name: "q1", title: "Shows {q3}" },
      { type: "text", name: "q2", title: "Plain title" }
    ] });
    const q1 = countRefreshes(survey.getQuestionByName("q1").locTitle);
    const q2 = countRefreshes(survey.getQuestionByName("q2").locTitle);
    survey.mergeData({ q4: 1 });
    expect(q1.count, "setDataCore does not know the changed names").toBe(1);
    expect(q2.count).toBe(0);
    survey.onProcessDynamicText.add(() => { });
    survey.setValue("q4", 2);
    expect(q1.count, "an onProcessDynamicText handler can show any value").toBe(2);
    expect(q2.count).toBe(0);
  });
  test("a locale change and a new onTextMarkdown handler refresh every string", () => {
    const survey = new SurveyModel({ elements: [
      { type: "text", name: "q1", title: "Shows {q3}" },
      { type: "text", name: "q2", title: "Plain title" }
    ] });
    const q1 = countRefreshes(survey.getQuestionByName("q1").locTitle);
    const q2 = countRefreshes(survey.getQuestionByName("q2").locTitle);
    survey.locale = "de";
    expect(q1.count).toBe(1);
    expect(q2.count).toBe(1);
    survey.locale = "";
    survey.onTextMarkdown.add((_, options) => { options.html = "<b>" + options.text + "</b>"; });
    expect(q1.count).toBe(3);
    expect(q2.count).toBe(3);
    expect(survey.getQuestionByName("q2").locTitle.renderedHtml).toBe("<b>Plain title</b>");
  });
  test("a built-in name refreshes on any value change", () => {
    const survey = new SurveyModel({ elements: [
      { type: "text", name: "q1", correctAnswer: "a" },
      { type: "text", name: "q2", title: "Page {pageno}, correct: {correctanswers}" },
      { type: "text", name: "q3", title: "Plain title" }
    ] });
    const q2 = countRefreshes(survey.getQuestionByName("q2").locTitle);
    const q3 = countRefreshes(survey.getQuestionByName("q3").locTitle);
    survey.setValue("q1", "a");
    expect(q2.count).toBe(1);
    expect(q3.count).toBe(0);
    expect(survey.getQuestionByName("q2").locTitle.renderedHtml).toBe("Page 1, correct: 1");
  });
  test("a name of a question that shows a choice text refreshes on any value change", () => {
    const survey = new SurveyModel({ elements: [
      { type: "text", name: "q0" },
      { type: "dropdown", name: "q1", choices: [{ value: 1, text: "Hello {q0}" }] },
      { type: "text", name: "q2", title: "You chose: {q1}" },
      { type: "text", name: "q3", title: "Text value: {q4}" },
      { type: "text", name: "q4" }
    ] });
    survey.setValue("q1", 1);
    const locTitle = survey.getQuestionByName("q2").locTitle;
    const q3 = countRefreshes(survey.getQuestionByName("q3").locTitle);
    survey.setValue("q0", "Ann");
    expect(survey.getQuestionByName("q1").displayValue).toBe("Hello Ann");
    expect(locTitle.renderedHtml).toBe("You chose: Hello Ann");
    expect(q3.count, "a text question's value is shown as it is").toBe(0);
  });
  test("an onGetQuestionTitle handler makes every question title refresh on any value change", () => {
    const survey = new SurveyModel({ elements: [
      { type: "text", name: "q1" },
      { type: "text", name: "q2", title: "Plain title" }
    ] });
    survey.onGetQuestionTitle.add((_, options) => {
      if (options.question.name === "q2") options.title += " (" + (survey.getValue("q1") || "") + ")";
    });
    const locTitle = survey.getQuestionByName("q2").locTitle;
    expect(locTitle.renderedHtml).toBe("Plain title ()");
    survey.setValue("q1", "A");
    expect(locTitle.renderedHtml).toBe("Plain title (A)");
  });
  test("an onProcessHtml handler makes an html question refresh on any value change", () => {
    const survey = new SurveyModel({ elements: [
      { type: "text", name: "q1" },
      { type: "html", name: "q2", html: "<p>Static</p>" }
    ] });
    survey.onProcessHtml.add((_, options) => {
      if (options.reason === "html-question") options.html += "<p>" + (survey.getValue("q1") || "") + "</p>";
    });
    const locHtml = survey.getQuestionByName("q2").locHtml;
    const counter = countRefreshes(locHtml);
    survey.setValue("q1", "A");
    expect(counter.count).toBe(1);
    expect(locHtml.renderedHtml).toBe("<p>Static</p><p>A</p>");
  });
});

describe("A value change and the strings of the other pages", () => {
  const json = { pages: [
    { elements: [{ type: "text", name: "q1" }] },
    { elements: [{ type: "text", name: "q2", title: "Hello {q1}" }] }
  ] };
  test("a title on page 2 shows the new value after the page change, also with a markdown handler", () => {
    const survey = new SurveyModel(json);
    survey.onTextMarkdown.add((_, options) => { options.html = "<b>" + options.text + "</b>"; });
    const locTitle = survey.getQuestionByName("q2").locTitle;
    survey.setValue("q1", "A");
    survey.nextPage();
    expect(locTitle.renderedHtml).toBe("<b>Hello A</b>");
    survey.prevPage();
    survey.setValue("q1", "B");
    survey.nextPage();
    expect(locTitle.renderedHtml).toBe("<b>Hello B</b>");
  });
  test("in the singlePage mode a title updates at once", () => {
    const survey = new SurveyModel(json);
    survey.questionsOnPageMode = "singlePage";
    survey.onTextMarkdown.add((_, options) => { options.html = "<b>" + options.text + "</b>"; });
    const locTitle = survey.getQuestionByName("q2").locTitle;
    expect(locTitle.renderedHtml).toBe("<b>Hello </b>");
    survey.setValue("q1", "A");
    expect(locTitle.renderedHtml).toBe("<b>Hello A</b>");
  });
});

describe("Context names in texts", () => {
  test("a dynamic panel's templateTitle with {panel.q1} updates when the panel's question changes", () => {
    const survey = new SurveyModel({ elements: [
      { type: "paneldynamic", name: "pd", panelCount: 2, templateTitle: "Item: {panel.q1}", templateElements: [{ type: "text", name: "q1" }] },
      { type: "text", name: "other" }
    ] });
    const pd = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    const panel = pd.panels[0];
    expect(panel.locTitle.renderedHtml).toBe("Item: ");
    panel.getQuestionByName("q1").value = "A";
    expect(panel.locTitle.renderedHtml).toBe("Item: A");
    expect(pd.panels[1].locTitle.renderedHtml).toBe("Item: ");
  });
  test("a matrix cell question and a detail panel question title with {row.x} update when the row changes", () => {
    const survey = new SurveyModel({ elements: [
      { type: "matrixdynamic", name: "m", rowCount: 1, detailPanelMode: "underRow",
        columns: [{ name: "x", cellType: "text" }, { name: "y", cellType: "text", title: "Y of {row.x}" }],
        detailElements: [{ type: "text", name: "d1", title: "Detail of {row.x}" }] }
    ] });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    const row = matrix.visibleRows[0];
    row.showDetailPanel();
    const detailTitle = row.detailPanel.getQuestionByName("d1").locTitle;
    expect(detailTitle.renderedHtml).toBe("Detail of ");
    row.getQuestionByColumnName("x").value = "A";
    expect(detailTitle.renderedHtml).toBe("Detail of A");
  });
  test("a choice text with {q1} updates when q1 changes", () => {
    const survey = new SurveyModel({ elements: [
      { type: "text", name: "q1" },
      { type: "dropdown", name: "q2", choices: [{ value: 1, text: "Hello {q1}" }, { value: 2, text: "Plain" }] }
    ] });
    const q2 = <QuestionDropdownModel>survey.getQuestionByName("q2");
    const choiceText = q2.choices[0].locText;
    const plain = countRefreshes(q2.choices[1].locText);
    expect(choiceText.renderedHtml).toBe("Hello ");
    survey.setValue("q1", "A");
    expect(choiceText.renderedHtml).toBe("Hello A");
    expect(plain.count).toBe(0);
  });
  test("a page's navigationTitle with {q1} updates while the TOC is shown", () => {
    const survey = new SurveyModel({ showTOC: true, pages: [
      { name: "p1", navigationTitle: "Start {q1}", elements: [{ type: "text", name: "q1" }] },
      { name: "p2", elements: [{ type: "text", name: "q2" }] }
    ] });
    const page = <PageModel>survey.pages[0];
    expect(page.renderedNavigationTitle).toBe("Start ");
    survey.setValue("q1", "A");
    expect(page.renderedNavigationTitle).toBe("Start A");
  });
});

describe("The UI is notified under the string's name", () => {
  afterEach(() => {
    Base.currentPropertyAccessListener = undefined as any;
  });
  test("a render of the complete page is notified under completedHtml when {responseId} changes, and not for another variable", () => {
    const survey = new SurveyModel({ completedHtml: "<h3>ID: {responseId}</h3>", elements: [{ type: "text", name: "q1" }] });
    survey.doComplete();
    const { tracker, log } = renderAndSubscribe(() => { survey.processedCompletedHtml; });
    survey.setVariable("other", 1);
    expect(log, "another variable").toHaveLength(0);
    survey.setVariable("responseId", 42);
    expect(log.map(item => item.name)).toEqual(["completedHtml"]);
    expect(log[0].model).toBe(survey);
    expect(survey.processedCompletedHtml).toBe("<h3>ID: 42</h3>");
    tracker.unsubscribe();
  });
  test("a completedHtmlOnCondition item's html shows a variable that changes after completion", () => {
    const survey = new SurveyModel({
      completedHtmlOnCondition: [{ expression: "{q1} = 1", html: "<h3>Item: {responseId}</h3>" }],
      elements: [{ type: "text", name: "q1" }]
    });
    survey.setValue("q1", 1);
    survey.doComplete();
    const { tracker, log } = renderAndSubscribe(() => { survey.processedCompletedHtml; });
    survey.setVariable("other", 1);
    expect(log).toHaveLength(0);
    survey.setVariable("responseId", 42);
    expect(log.map(item => item.name)).toEqual(["completedHtml"]);
    expect(survey.processedCompletedHtml).toBe("<h3>Item: 42</h3>");
    tracker.unsubscribe();
  });
  test("the complete page is notified when the condition item it shows switches", () => {
    const survey = new SurveyModel({
      completedHtml: "<h3>Default</h3>",
      completedHtmlOnCondition: [{ expression: "{mode} = 1", html: "<h3>Mode 1</h3>" }],
      elements: [{ type: "text", name: "q1" }]
    });
    survey.doComplete();
    const { tracker, log } = renderAndSubscribe(() => { survey.processedCompletedHtml; });
    expect(survey.processedCompletedHtml).toBe("<h3>Default</h3>");
    survey.setVariable("mode", 1);
    expect(log.map(item => item.name)).toEqual(["completedHtml"]);
    expect(survey.processedCompletedHtml).toBe("<h3>Mode 1</h3>");
    tracker.unsubscribe();
  });
  test("a value change that no logo or title text uses does not notify hasLogo or titleIsEmpty", () => {
    const survey = new SurveyModel({ title: "Survey title", logo: "logo.png", elements: [{ type: "text", name: "q1" }] });
    const { tracker, log } = renderAndSubscribe(() => { survey.hasLogo; survey.titleIsEmpty; });
    survey.setValue("q1", "A");
    survey.setVariable("v1", 1);
    expect(log).toHaveLength(0);
    tracker.unsubscribe();
  });
  test("a logo that shows a value is recalculated when the value changes", () => {
    const survey = new SurveyModel({ logo: "{logoUrl}", elements: [{ type: "text", name: "q1" }] });
    survey.setVariable("logoUrl", "");
    const { tracker, log } = renderAndSubscribe(() => { survey.hasLogo; });
    expect(survey.hasLogo).toBe(false);
    survey.setValue("q1", "A");
    expect(log).toHaveLength(0);
    survey.setVariable("logoUrl", "logo.png");
    expect(log.map(item => item.name)).toEqual(["hasLogo"]);
    expect(survey.hasLogo).toBe(true);
    tracker.unsubscribe();
  });
  test("a render that reads a question title is notified under title when a name of the title changes", () => {
    const survey = new SurveyModel({ elements: [
      { type: "text", name: "q1" },
      { type: "text", name: "q2", title: "Hello {q1}" }
    ] });
    const q2 = survey.getQuestionByName("q2");
    q2.locTitle.renderedHtml;
    const { tracker, log } = renderAndSubscribe(() => { q2.title; });
    survey.setValue("q1", "A");
    expect(log.map(item => item.name)).toEqual(["title"]);
    expect(log[0].model).toBe(q2);
    tracker.unsubscribe();
  });
  test("a set text notifies the UI once", () => {
    const survey = new SurveyModel({ completedHtml: "first", elements: [{ type: "text", name: "q1" }] });
    const { tracker, log } = renderAndSubscribe(() => { survey.processedCompletedHtml; });
    survey.completedHtml = "second";
    expect(log.map(item => item.name)).toEqual(["completedHtml"]);
    tracker.unsubscribe();
  });
});

describe("Design mode refreshes every string", () => {
  test("a value change in design mode refreshes a string without names", () => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({ elements: [{ type: "text", name: "q1", title: "Plain title" }] });
    const counter = countRefreshes(survey.getQuestionByName("q1").locTitle);
    survey.setValue("q2", 1);
    expect(counter.count).toBe(1);
  });
});

describe("A string whose owner cannot check the names", () => {
  test("refreshes on a value change when its text has names, and not when it has none", () => {
    const owner: any = { getLocale: () => "", getMarkdownHtml: () => undefined, getProcessedText: (text: string) => text, getRenderer: () => undefined, getRendererContext: (locStr: any) => locStr };
    const withNames = new LocalizableString(owner, false, "a");
    withNames.text = "Hello {q1}";
    const withoutNames = new LocalizableString(owner, false, "b");
    withoutNames.text = "Plain";
    const a = countRefreshes(withNames);
    const b = countRefreshes(withoutNames);
    const changes = new ChangedKeys({ q2: 1 });
    withNames.strChanged(changes);
    withoutNames.strChanged(changes);
    expect(a.count).toBe(1);
    expect(b.count).toBe(0);
  });
});
