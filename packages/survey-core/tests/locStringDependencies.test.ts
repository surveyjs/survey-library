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
import { Question } from "../src/question";
import { Serializer } from "../src/jsonobject";
import { QuestionRatingModel } from "../src/question_rating";
import { PanelModel } from "../src/panel";
export * from "../src/question_text";
export * from "../src/question_html";
export * from "../src/question_checkbox";
export * from "../src/question_comment";
export * from "../src/question_multipletext";
export * from "../src/question_expression";
export * from "../src/question_rating";

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
  });
  test("an onProcessDynamicText handler makes a value change refresh every string", () => {
    const survey = new SurveyModel({ elements: [
      { type: "text", name: "q1", title: "Shows {q3}" },
      { type: "text", name: "q2", title: "Plain title" }
    ] });
    const q1 = countRefreshes(survey.getQuestionByName("q1").locTitle);
    const q2 = countRefreshes(survey.getQuestionByName("q2").locTitle);
    survey.onProcessDynamicText.add(() => { });
    survey.setValue("q4", 2);
    expect(q1.count).toBe(1);
    expect(q2.count, "a string without names too").toBe(1);
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
  test("a name of a custom question class refreshes on any value change: its display value can come from anything", () => {
    class QuestionOwnDisplayModel extends Question {
      public getType(): string { return "owndisplay"; }
      protected getDisplayValueCore(keysAsText: boolean, value: any): any {
        return value + " of " + (<any>this.survey).getValue("q0");
      }
    }
    Serializer.addClass("owndisplay", [], () => new QuestionOwnDisplayModel(""), "question");
    try {
      const survey = new SurveyModel({ elements: [
        { type: "text", name: "q0" },
        { type: "owndisplay", name: "q1" },
        { type: "text", name: "q2", title: "Shown: {q1}" }
      ] });
      survey.setValue("q1", 5);
      const locTitle = survey.getQuestionByName("q2").locTitle;
      const refreshes = countRefreshes(locTitle);
      survey.setValue("q0", 10);
      expect(refreshes.count).toBe(1);
      expect(locTitle.renderedHtml).toBe("Shown: 5 of 10");
    } finally {
      Serializer.removeClass("owndisplay");
    }
  });
  test("a question whose display value is its value does not ask for a refresh on other values", () => {
    const survey = new SurveyModel({ elements: [
      { type: "text", name: "q1" }, { type: "comment", name: "q2" }, { type: "html", name: "q3" },
      { type: "dropdown", name: "q4" }, { type: "multipletext", name: "q5" }, { type: "expression", name: "q6" }
    ] });
    const res = survey.getAllQuestions().map(q => q.name + ":" + q.hasDisplayTexts());
    expect(res).toEqual(["q1:false", "q2:false", "q3:false", "q4:true", "q5:true", "q6:true"]);
  });
  test("an onGetQuestionTitle handler makes a value change refresh every string", () => {
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
  test("an onProcessHtml handler makes a value change refresh every string", () => {
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
  test("a new logo that still shows an image does not notify hasLogo; a hidden logo position does", () => {
    const survey = new SurveyModel({ logo: "a.png", elements: [{ type: "text", name: "q1" }] });
    const { tracker, log } = renderAndSubscribe(() => { survey.hasLogo; });
    survey.logo = "b.png";
    expect(log).toHaveLength(0);
    survey.logoPosition = "none";
    expect(log.map(item => item.name)).toEqual(["hasLogo"]);
    expect(survey.hasLogo).toBe(false);
    survey.logoPosition = "right";
    survey.logo = "";
    expect(survey.hasLogo).toBe(false);
    tracker.unsubscribe();
  });
  test("a survey title follows its rendered text: a set or cleared text and a value it shows", () => {
    const survey = new SurveyModel({ title: "abc", elements: [{ type: "text", name: "q1" }] });
    expect(survey.titleIsEmpty).toBe(false);
    survey.title = "";
    expect(survey.titleIsEmpty, "cleared").toBe(true);
    survey.title = "{q1}";
    expect(survey.titleIsEmpty, "a value it shows is empty").toBe(true);
    const { tracker, log } = renderAndSubscribe(() => { survey.titleIsEmpty; });
    survey.setValue("q1", "A");
    expect(log.map(item => item.name)).toEqual(["titleIsEmpty"]);
    expect(survey.titleIsEmpty).toBe(false);
    log.length = 0;
    survey.title = "Survey {q1}";
    expect(log, "still not empty").toHaveLength(0);
    tracker.unsubscribe();
  });
  test("a survey title in another locale only is empty in the current locale", () => {
    const survey = new SurveyModel({ title: { de: "Titel" } });
    expect(survey.titleIsEmpty).toBe(true);
    survey.locale = "de";
    expect(survey.titleIsEmpty).toBe(false);
    survey.locale = "";
  });
  test("a description follows its rendered text at runtime and its text in design mode", () => {
    const json = { description: "{v1}", elements: [{ type: "text", name: "q1", description: "{v1}" }] };
    const survey = new SurveyModel(json);
    survey.setVariable("v1", "");
    const q1 = survey.getQuestionByName("q1");
    expect(q1.hasDescription).toBe(false);
    expect(survey.hasDescription).toBe(false);
    const { tracker, log } = renderAndSubscribe(() => { q1.hasDescription; survey.hasDescription; });
    survey.setVariable("v1", "Some text");
    expect(log.map(item => item.name).sort()).toEqual(["hasDescription", "hasDescription"]);
    expect(q1.hasDescription).toBe(true);
    expect(survey.hasDescription).toBe(true);
    log.length = 0;
    q1.description = "Other {v1}";
    expect(log, "still has a description").toHaveLength(0);
    tracker.unsubscribe();

    const designSurvey = new SurveyModel();
    designSurvey.setDesignMode(true);
    designSurvey.fromJSON(json);
    expect(designSurvey.getQuestionByName("q1").hasDescription, "a designer sees the text").toBe(true);
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
  test("a new text that renders as before notifies the UI once: a component may show the raw text", () => {
    const survey = new SurveyModel({ elements: [
      { type: "text", name: "q1", defaultValue: "A" },
      { type: "text", name: "q2", title: "Hello {q1}" }
    ] });
    const q2 = survey.getQuestionByName("q2");
    expect(q2.locTitle.renderedHtml).toBe("Hello A");
    const { tracker, log } = renderAndSubscribe(() => { q2.title; });
    q2.title = "Hello A";
    expect(q2.locTitle.renderedHtml).toBe("Hello A");
    expect(log.map(item => item.name)).toEqual(["title"]);
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

describe("Rating descriptions and panel and page titles follow their rendered text", () => {
  const names = (log: Array<{ name: string }>): Array<string> => log.map(item => item.name);
  test("a rating description cleared before it was rendered is hidden", () => {
    const survey = new SurveyModel({ elements: [{ type: "rating", name: "q1", minRateDescription: "Low", maxRateDescription: "High" }] });
    const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
    expect(q1.hasMinRateDescription).toBe(true);
    expect(q1.hasMaxRateDescription).toBe(true);
    q1.minRateDescription = "";
    q1.maxRateDescription = "";
    expect(q1.hasMinRateDescription).toBe(false);
    expect(q1.hasMaxRateDescription).toBe(false);
  });
  test("a rating description in another locale only is hidden in the current locale and shown in that locale", () => {
    const survey = new SurveyModel({ elements: [{ type: "rating", name: "q1", minRateDescription: { de: "Niedrig" } }] });
    const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
    expect(q1.hasMinRateDescription).toBe(false);
    survey.locale = "fr";
    expect(q1.hasMinRateDescription, "fr").toBe(false);
    survey.locale = "";
    expect(q1.hasMinRateDescription, "back to the default locale").toBe(false);
    survey.locale = "de";
    expect(q1.hasMinRateDescription, "de").toBe(true);
    survey.locale = "";
  });
  test("a panel title and a page title in one locale only: no title header in another locale, and back", () => {
    const survey = new SurveyModel({ pages: [{ name: "page1", title: { en: "Page" },
      elements: [{ type: "panel", name: "panel1", title: { en: "Panel" }, elements: [{ type: "text", name: "q1" }] }] }] });
    const page = survey.pages[0];
    const panel = <PanelModel>survey.getPanelByName("panel1");
    expect(panel.hasTitle).toBe(true);
    expect(page.hasTitle).toBe(true);
    survey.locale = "fr";
    expect(panel.hasTextInTitle, "panel, fr").toBe(false);
    expect(panel.hasTitle, "panel, fr").toBe(false);
    expect(page.hasTextInTitle, "page, fr").toBe(false);
    expect(page.hasTitle, "page, fr").toBe(false);
    survey.locale = "";
    expect(panel.hasTitle, "panel, back").toBe(true);
    expect(page.hasTitle, "page, back").toBe(true);
  });
  test("a text that resolves to an empty string shows no rating description and no panel or page title header", () => {
    const survey = new SurveyModel({ pages: [{ name: "page1", title: "{v}", elements: [
      { type: "rating", name: "q1", minRateDescription: "{v}", maxRateDescription: "{v}", displayRateDescriptionsAsExtremeItems: true },
      { type: "panel", name: "panel1", title: "{v}", elements: [{ type: "text", name: "q2" }] }
    ] }] });
    survey.setVariable("v", "");
    const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
    const page = survey.pages[0];
    const panel = <PanelModel>survey.getPanelByName("panel1");
    expect(q1.hasMinRateDescription).toBe(false);
    expect(q1.hasMaxRateDescription).toBe(false);
    expect(q1.visibleChoices[0].locText.renderedHtml, "the first item falls back to its value").toBe("1");
    expect(q1.visibleChoices[4].locText.renderedHtml, "the last item falls back to its value").toBe("5");
    expect(panel.hasTitle).toBe(false);
    expect(page.hasTitle).toBe(false);
    const { tracker, log } = renderAndSubscribe(() => {
      q1.hasMinRateDescription; q1.hasMaxRateDescription; panel.hasTitle; page.hasTitle;
    });
    survey.setVariable("v", "Text");
    expect(names(log)).toContain("hasMinRateDescription");
    expect(names(log)).toContain("hasMaxRateDescription");
    expect(log.filter(item => item.name === "hasTextInTitle").map(item => item.model)).toEqual([page, panel]);
    expect(q1.hasMinRateDescription).toBe(true);
    expect(q1.visibleChoices[0].locText.renderedHtml, "the first item shows the description").toBe("Text");
    expect(panel.hasTitle).toBe(true);
    expect(page.hasTitle).toBe(true);
    tracker.unsubscribe();
  });
  test("a new non-empty text notifies neither flag", () => {
    const survey = new SurveyModel({ elements: [
      { type: "rating", name: "q1", minRateDescription: "Low" },
      { type: "panel", name: "panel1", title: "Panel", elements: [{ type: "text", name: "q2" }] }
    ] });
    const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
    const panel = <PanelModel>survey.getPanelByName("panel1");
    const { tracker, log } = renderAndSubscribe(() => { q1.hasMinRateDescription; panel.hasTitle; });
    q1.minRateDescription = "Lowest";
    panel.title = "Other panel";
    expect(names(log)).not.toContain("hasMinRateDescription");
    expect(names(log)).not.toContain("hasTextInTitle");
    expect(q1.hasMinRateDescription).toBe(true);
    expect(panel.hasTitle).toBe(true);
    tracker.unsubscribe();
  });
  test("in design mode a text that resolves to an empty string keeps the rating description and the panel title", () => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({ elements: [
      { type: "rating", name: "q1", minRateDescription: "{v}", maxRateDescription: "{v}" },
      { type: "panel", name: "panel1", title: "{v}", elements: [{ type: "text", name: "q2" }] }
    ] });
    survey.setVariable("v", "");
    const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
    const panel = <PanelModel>survey.getPanelByName("panel1");
    expect(q1.hasMinRateDescription).toBe(true);
    expect(q1.hasMaxRateDescription).toBe(true);
    expect(panel.hasTextInTitle).toBe(true);
    expect(panel.hasTitle).toBe(true);
  });
  test("in design mode a written hasTextInTitle stays after locale changes, and a title change recalculates it", () => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({ elements: [{ type: "panel", name: "panel1", title: { de: "Titel" }, elements: [{ type: "text", name: "q1" }] }] });
    const panel = <PanelModel>survey.getPanelByName("panel1");
    expect(panel.hasTextInTitle).toBe(false);
    panel.setPropertyValue("hasTextInTitle", true);
    survey.locale = "de";
    survey.locale = "fr";
    survey.locale = "";
    expect(panel.hasTextInTitle).toBe(true);
    panel.title = "Panel";
    panel.title = "";
    expect(panel.hasTextInTitle).toBe(false);
  });
  test("a collapsible panel without a title shows its name", () => {
    const survey = new SurveyModel({ elements: [{ type: "panel", name: "panel1", elements: [{ type: "text", name: "q1" }] }] });
    const panel = <PanelModel>survey.getPanelByName("panel1");
    expect(panel.hasTitle).toBe(false);
    const { tracker, log } = renderAndSubscribe(() => { panel.hasTitle; });
    panel.state = "collapsed";
    expect(names(log)).toContain("hasTextInTitle");
    expect(panel.locTitle.renderedHtml).toBe("panel1");
    expect(panel.hasTitle).toBe(true);
    tracker.unsubscribe();
  });
  test("a rating description and a panel title read before joining a survey follow the values of that survey", () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q1" }] });
    survey.setVariable("v", "");
    const q2 = new QuestionRatingModel("q2");
    q2.minRateDescription = "{v}";
    const panel = new PanelModel("panel1");
    panel.title = "{v}";
    expect(q2.hasMinRateDescription, "a detached question shows the text as is").toBe(true);
    expect(panel.hasTextInTitle, "a detached panel shows the text as is").toBe(true);
    survey.pages[0].addElement(q2);
    survey.pages[0].addElement(panel);
    expect(q2.hasMinRateDescription).toBe(false);
    expect(panel.hasTextInTitle).toBe(false);
    expect(panel.hasTitle).toBe(false);
  });
});
