import { SurveyModel } from "../src/survey";
import { SurveyElement } from "../src/survey-element";
import { QuestionFileModel, QuestionFilePage } from "../src/question_file";

import { describe, test, expect, afterEach, vi } from "vitest";

// Element roots render renderedId (elementIdPrefix + id), and survey-core looks them up by the same value.
// Creator issue #8140: the property grid (prefix "pg-") scrolled to the designer's (prefix "d-") question,
// because both roots rendered the bare id "sq_0" and the lookup fell back to document.body.

const json = {
  elements: [
    { type: "text", name: "q1" },
    { type: "text", name: "q2" },
    { type: "panel", name: "panel1", elements: [{ type: "text", name: "q3" }] },
  ]
};

const addedNodes: Array<HTMLElement> = [];
function addDiv(parent: HTMLElement, id: string, name?: string): HTMLElement {
  const div = document.createElement("div");
  div.id = id;
  if (name) div.setAttribute("data-name", name);
  parent.appendChild(div);
  if (parent === document.body) addedNodes.push(div);
  return div;
}
// Records what SurveyElement.ScrollElementToTop got, as primitives (an id / data-name or null).
function spyScrollToTop(): Array<string | null> {
  const log: Array<string | null> = [];
  vi.spyOn(SurveyElement, "ScrollElementToTop").mockImplementation(((el: Element, _a: any, _b: any, done?: () => void) => {
    log.push(el ? (el.getAttribute("data-name") || el.id) : null);
    done && done();
    return true;
  }) as any);
  return log;
}

describe("Element roots use renderedId", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
    addedNodes.splice(0).forEach(n => n.remove());
  });

  test("Bug#8140: focus() in a not rendered prefixed survey doesn't scroll to another survey's element", () => {
    const surveyA = new SurveyModel(json);
    surveyA.elementIdPrefix = "d-";
    const surveyB = new SurveyModel(json);
    surveyB.elementIdPrefix = "pg-";
    // A's roots as they were rendered before the fix: the bare id
    surveyA.getAllQuestions().forEach(q => addDiv(document.body, q.id, "A-" + q.name));
    const qB = surveyB.getQuestionByName("q1");
    expect(qB.id).toBe("sq_0");
    expect(qB.renderedId).toBe("pg-sq_0");
    expect(surveyB.rootElement).toBeFalsy();

    const ids: Array<string> = [];
    surveyB.onScrollToTop.add((_, options) => { ids.push(options.elementId); });
    const log = spyScrollToTop();
    qB.focus();
    expect(ids).toEqual(["pg-sq_0"]);
    expect(log).toEqual([null]);
  });

  test("focus() in a rendered prefixed survey scrolls to the survey's own root", () => {
    const surveyA = new SurveyModel(json);
    surveyA.elementIdPrefix = "d-";
    const surveyB = new SurveyModel(json);
    surveyB.elementIdPrefix = "pg-";
    surveyA.getAllQuestions().forEach(q => addDiv(document.body, q.id, "A-" + q.name));
    const rootB = addDiv(document.body, "rootB");
    surveyB.getAllQuestions().forEach(q => addDiv(rootB, q.renderedId, "B-" + q.name));
    surveyB.rootElement = rootB;

    const log = spyScrollToTop();
    surveyB.getQuestionByName("q2").focus();
    expect(log).toEqual(["B-q2"]);
  });

  test("onScrollToTop gets the prefixed elementId; a handler that prefixes it itself doesn't double the prefix", () => {
    const survey = new SurveyModel(json);
    survey.elementIdPrefix = "x-";
    const root = addDiv(document.body, "root");
    survey.getAllQuestions().forEach(q => addDiv(root, q.renderedId, q.name));
    survey.rootElement = root;
    const ids: Array<string> = [];
    survey.onScrollToTop.add((sender, options) => {
      ids.push(options.elementId);
      // The workaround from the #8140 report
      options.elementId = sender.getElementId((options.element as any).id);
    });
    const log = spyScrollToTop();
    survey.getQuestionByName("q3").focus();
    expect(ids).toEqual(["x-sq_2"]);
    expect(log).toEqual(["q3"]);
  });

  test("Without elementIdPrefix, onScrollToTop gets the bare id, as before", () => {
    const survey = new SurveyModel(json);
    const root = addDiv(document.body, "root");
    survey.getAllQuestions().forEach(q => addDiv(root, q.renderedId, q.name));
    survey.rootElement = root;
    const ids: Array<string> = [];
    survey.onScrollToTop.add((_, options) => { ids.push(options.elementId); });
    const log = spyScrollToTop();
    const q2 = survey.getQuestionByName("q2");
    expect(q2.renderedId).toBe(q2.id);
    q2.focus();
    expect(ids).toEqual(["sq_1"]);
    expect(log).toEqual(["q2"]);
  });

  test("A prefix that starts with a digit is a valid selector", () => {
    const survey = new SurveyModel(json);
    survey.elementIdPrefix = "1-";
    const root = addDiv(document.body, "root");
    survey.getAllQuestions().forEach(q => addDiv(root, q.renderedId, q.name));
    survey.rootElement = root;
    const log = spyScrollToTop();
    survey.getQuestionByName("q1").focus();
    expect(log).toEqual(["q1"]);
  });

  test("Lazy rendering: focus() finds the real element that replaces the skeleton", () => {
    vi.useFakeTimers();
    const elements: Array<any> = [];
    for (let i = 0; i < 30; i++) elements.push({ type: "text", name: "q" + i });
    const survey = new SurveyModel({ elements });
    survey.elementIdPrefix = "x-";
    survey.lazyRenderEnabled = true;
    const page = survey.pages[0];
    page.onFirstRendering();
    const q = survey.getQuestionByName("q29");
    const row = page.findRowByElement(q);
    expect(row.isNeedRender).toBe(false);

    const root = addDiv(document.body, "root");
    addDiv(root, page.renderedId);
    const skeleton = addDiv(root, q.renderedId, "skeleton");
    survey.rootElement = root;
    // The renderer: once the row has to render, the question's root replaces its skeleton (same id)
    row.registerPropertyChangedHandlers(["isNeedRender"], () => {
      if (!row.isNeedRender) return;
      const real = document.createElement("div");
      real.id = q.renderedId;
      real.setAttribute("data-name", "real-" + q.name);
      skeleton.replaceWith(real);
    });

    const log = spyScrollToTop();
    q.focus();
    vi.advanceTimersByTime(200);
    expect(row.isNeedRender).toBe(true);
    expect(log).toEqual(["real-q29"]);
  });

  test("page.scrollToTop() looks the page up by its renderedId", () => {
    const surveyA = new SurveyModel(json);
    const surveyB = new SurveyModel(json);
    surveyB.elementIdPrefix = "x-";
    // Another (unprefixed) survey's page root comes first in the document
    addDiv(document.body, surveyA.pages[0].id, "A-page");
    addDiv(document.body, surveyB.pages[0].renderedId, "B-page");
    expect(surveyB.pages[0].renderedId).toBe("x-sp_0");
    const ids: Array<string> = [];
    surveyB.onScrollToTop.add((_, options) => { ids.push(options.elementId); });
    const log = spyScrollToTop();
    surveyB.pages[0].scrollToTop();
    expect(ids).toEqual(["x-sp_0"]);
    expect(log).toEqual(["B-page"]);
  });

  test("The file question finds its page element by renderedId", () => {
    const survey = new SurveyModel({ elements: [{ type: "file", name: "f1" }] });
    survey.elementIdPrefix = "x-";
    const q = <QuestionFileModel>survey.getQuestionByName("f1");
    const page = new QuestionFilePage(q, 0);
    expect(page.renderedId.indexOf("x-sv_sfp")).toBe(0);
    const content = addDiv(document.body, "content");
    addDiv(content, page.id, "bare");
    addDiv(content, page.renderedId, "prefixed");
    (q as any).contentElement = content;
    const el: HTMLElement = (q as any).getPagesAnimationOptions().getAnimatedElement(page);
    expect(el ? el.getAttribute("data-name") : null).toBe("prefixed");
  });
});
