import { SurveyModel } from "../src/survey";
import { PageModel } from "../src/page";
import { PanelModel } from "../src/panel";
import { Question } from "../src/question";
import { QuestionRatingModel } from "../src/question_rating";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { QuestionSingleInputSummary } from "../src/questionSingleInputSummary";
import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";
import { QuestionMatrixDropdownModel } from "../src/question_matrixdropdown";
import { QuestionCheckboxModel } from "../src/question_checkbox";
import { Serializer } from "../src/jsonobject";

import { describe, test, expect } from "vitest";
describe("Input Per Page Tests", () => {
  function getSingleQuestion(page: PageModel): Question {
    if (page.visibleRows.length === 0) return <any>undefined;
    const q = <Question>page.visibleRows[0].elements[0];
    return q.singleInputQuestion || q;
  }

  test("singleInput should work the same as singleQuestion for standard questions", () => {
    const survey = new SurveyModel({
      questionsOnPageMode: "inputPerPage",
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2" }
      ]
    });
    expect(survey.isSingleVisibleQuestion, "one question per page").toLooseEqual(true);
    const page: PageModel = survey.currentPage;
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion is q1").toLooseEqual("q1");
    expect(page.visibleRows.length, "Just one visible row").toLooseEqual(1);
    expect(page.visibleRows[0].elements[0].name, "visible question is q1").toLooseEqual("q1");
    expect(getSingleQuestion(page).name, "getSingleQuestion is q1").toLooseEqual("q1");
    survey.performNext();
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion is q2").toLooseEqual("q2");
    expect(page.visibleRows[0].elements[0].name, "visible question is q2").toLooseEqual("q2");
    expect(getSingleQuestion(page).name, "getSingleQuestion is q2").toLooseEqual("q2");
  });
  test("singleInput works in designer as standard", () => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({
      questionsOnPageMode: "inputPerPage",
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2" }
      ]
    });
    const page: PageModel = survey.currentPage;
    expect(survey.currentSingleQuestion?.name, "currentSingleQuestion is undefined").toBeFalsy();
    expect(page.visibleRows.length, "There are two rows").toLooseEqual(2);
    expect(page.visibleRows[0].elements[0].name, "visible question is q1").toLooseEqual("q1");
    expect(page.visibleRows[1].elements[0].name, "visible question is q2").toLooseEqual("q2");
  });
  test("singleInput for panel dynamic", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic", name: "panel1", title: "Root Panel",
          displayMode: "tab",
          panelCount: 1,
          templateElements: [
            { type: "text", name: "q1" },
            { type: "text", name: "q2" }
          ]
        },
        { type: "text", name: "q3" }
      ],
      questionsOnPageMode: "inputPerPage",
    });
    survey.css = { question: { nested: "q-nested", withFrame: "q-frame" } };
    expect(survey.isSingleVisibleInput, "isSingleVisibleInput is true").toLooseEqual(true);
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel1");
    expect(panel.panelCount, "panelCount is 1").toLooseEqual(1);
    expect(panel.panels.length, "There is one panel").toLooseEqual(1);
    const page: PageModel = survey.currentPage;
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion is panel1, #1").toLooseEqual("panel1");
    let el = page.visibleRows[0].elements[0];
    expect(el.name, "page visible row is panel1, #1").toLooseEqual("panel1");
    expect(panel.singleInputQuestion.name, "singleInputQuestion, #1.1").toLooseEqual("q1");
    panel.singleInputQuestion.value = "a";
    survey.performNext();
    survey.performNext();
    expect(panel.singleInputQuestion.name, "singleInputQuestion, #1").toLooseEqual("panel1");
    expect(panel.isRenderModeTab, "isRenderModeTab, #1").toLooseEqual(false);
    const rootCss = panel.singleInputQuestion.getRootCss();
    expect(rootCss.indexOf("q-frame") > -1, "rootCss has q-frame, #1").toLooseEqual(false);
    expect(rootCss.indexOf("q-nested") > -1, "rootCss has q-nested, #1").toLooseEqual(false);
    expect(panel.locRenderedTitle.textOrHtml, "panel title, #1").toLooseEqual("Root Panel");
    expect(panel.singleInputSummary, "wrapper panel title, #1").toBeTruthy();

    panel.singleInputSummary.items[0].btnEdit.action();
    el = <PanelModel>page.visibleRows[0].elements[0];
    expect(el.name, "page visible row is panel1, #2").toLooseEqual("panel1");
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion is panel1, #2.1").toLooseEqual("panel1");
    expect(panel.singleInputQuestion.name, "singleInputQuestion, #2.1").toLooseEqual("q1");
    expect(panel.singleInputLocTitle.textOrHtml, "wrapper panel single title, #2.1").toLooseEqual("Panel 1");
    expect(panel.locRenderedTitle.textOrHtml, "wrapper panel title, #2.1").toLooseEqual("Panel 1");

    survey.performNext();
    el = <PanelModel>page.visibleRows[0].elements[0];
    expect(el.name, "page visible row is panel1, #2.2").toLooseEqual("panel1");
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion is panel1, #2.2").toLooseEqual("panel1");
    expect(panel.singleInputQuestion.name, "singleInputQuestion, #2.2").toLooseEqual("q2");

    survey.performPrevious();
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion is panel1, #3").toLooseEqual("panel1");
    expect(panel.singleInputQuestion.name, "singleInputQuestion, #3").toLooseEqual("q1");

    survey.performNext();
    survey.performNext();
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion is panel1, #4").toLooseEqual("panel1");
    expect(panel.singleInputQuestion.name, "singleInputQuestion, #4").toLooseEqual("panel1");

    survey.performNext();
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion is q3, #5").toLooseEqual("q3");
    expect(survey.getQuestionByName("q3").singleInputQuestion?.name, "singleInputQuestion, #5").toBeFalsy();
  });
  test("singleInput and navigation buttons visibilty", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic", name: "panel1",
          panelCount: 1,
          templateElements: [
            { type: "text", name: "q1" },
            { type: "text", name: "q2" },
            { type: "text", name: "q3" }
          ]
        }
      ],
      questionsOnPageMode: "inputPerPage",
    });
    const panel = survey.getQuestionByName("panel1");
    expect(panel.locRemovePanelText.textOrHtml, "locRemovePanelText").toLooseEqual("Remove");
    expect(panel.singleInputQuestion.name, "singleInputQuestion, #0.1").toLooseEqual("q1");
    panel.singleInputQuestion.value = "a";
    survey.performNext();
    survey.performNext();
    survey.performNext();
    expect(panel.singleInputQuestion.name, "singleInputQuestion, #0").toLooseEqual("panel1");
    expect(survey.isShowPrevButton, "prev buttton, #0").toLooseEqual(false);
    expect(survey.isShowNextButton, "next buttton, #0").toLooseEqual(false);
    expect(survey.isCompleteButtonVisible, "complete buttton, #0").toLooseEqual(true);
    panel.singleInputSummary.items[0].btnEdit.action();
    expect(panel.singleInputQuestion.name, "singleInputQuestion, #1").toLooseEqual("q1");
    expect(survey.isShowPrevButton, "prev buttton, #1").toLooseEqual(true);
    expect(survey.isShowNextButton, "next buttton, #1").toLooseEqual(true);
    expect(survey.isCompleteButtonVisible, "complete buttton, #1").toLooseEqual(false);
    survey.performNext();
    expect(panel.singleInputQuestion.name, "singleInputQuestion, #2").toLooseEqual("q2");
    expect(survey.isShowPrevButton, "prev buttton, #2").toLooseEqual(true);
    expect(survey.isShowNextButton, "next buttton, #2").toLooseEqual(true);
    expect(survey.isCompleteButtonVisible, "complete buttton, #2").toLooseEqual(false);
    survey.performNext();
    expect(panel.singleInputQuestion.name, "singleInputQuestion, #3").toLooseEqual("q3");
    expect(survey.isShowPrevButton, "prev buttton, #3").toLooseEqual(true);
    expect(survey.isShowNextButton, "next buttton, #3").toLooseEqual(true);
    expect(survey.isCompleteButtonVisible, "complete buttton, #3").toLooseEqual(false);
    survey.performNext();
    expect(panel.singleInputQuestion.name, "singleInputQuestion, #4").toLooseEqual("panel1");
    expect(survey.isShowPrevButton, "prev buttton, #4").toLooseEqual(false);
    expect(survey.isShowNextButton, "next buttton, #4").toLooseEqual(false);
    expect(survey.isCompleteButtonVisible, "complete buttton, #4").toLooseEqual(true);
    panel.singleInputSummary.items[0].btnEdit.action();
    survey.performNext();
    survey.performNext();
    expect(panel.singleInputQuestion?.name, "singleInputQuestion, #5").toLooseEqual("q3");
    survey.performPrevious();
    expect(panel.singleInputQuestion.name, "singleInputQuestion, #6").toLooseEqual("q2");
    expect(survey.isShowPrevButton, "prev buttton, #6").toLooseEqual(true);
    expect(survey.isShowNextButton, "next buttton, #6").toLooseEqual(true);
    expect(survey.isCompleteButtonVisible, "complete buttton, #6").toLooseEqual(false);
    survey.performPrevious();
    expect(panel.singleInputQuestion.name, "singleInputQuestion, #7").toLooseEqual("q1");
    expect(survey.isShowPrevButton, "prev buttton, #7").toLooseEqual(true);
    expect(survey.isShowNextButton, "next buttton, #7").toLooseEqual(true);
    expect(survey.isCompleteButtonVisible, "complete buttton, #7").toLooseEqual(false);
  });
  test("singleInput and navigation buttons visibilty & visibleIf", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic", name: "panel1",
          panelCount: 1,
          templateElements: [
            { type: "text", name: "q1" },
            { type: "text", name: "q2", visibleIf: "{panel.q1} notempty" },
          ]
        }
      ],
      questionsOnPageMode: "inputPerPage",
    });
    const panel1 = survey.getQuestionByName("panel1");
    const addBtn = survey.navigationBar.getActionById("sv-singleinput-add");
    expect(panel1.singleInputQuestion.name, "singleInputQuestion, #1").toLooseEqual("q1");
    expect(survey.isShowPrevButton, "prev buttton, #1").toLooseEqual(false);
    expect(survey.isShowNextButton, "next buttton, #1").toLooseEqual(true);
    expect(survey.isCompleteButtonVisible, "complete buttton, #1").toLooseEqual(false);
    expect(addBtn.visible, "addBtn visible #1, panel is empty").toLooseEqual(false);
    panel1.singleInputQuestion.value = "a";
    expect(survey.isShowPrevButton, "prev buttton, #2").toLooseEqual(false);
    expect(survey.isShowNextButton, "next buttton, #2").toLooseEqual(true);
    expect(survey.isCompleteButtonVisible, "complete buttton, #2").toLooseEqual(false);
    expect(addBtn.visible, "addBtn visible #2").toLooseEqual(false);
    survey.performNext();
    expect(panel1.singleInputQuestion.name, "singleInputQuestion, #3").toLooseEqual("q2");
    expect(survey.isShowPrevButton, "prev buttton, #3").toLooseEqual(true);
    expect(survey.isShowNextButton, "next buttton, #3").toLooseEqual(true);
    expect(survey.isCompleteButtonVisible, "complete buttton, #3").toLooseEqual(false);
    expect(addBtn.visible, "addBtn visible #3").toLooseEqual(false);
    survey.performNext();
    expect(panel1.singleInputQuestion.name, "singleInputQuestion, #4").toLooseEqual("panel1");
    expect(survey.isShowPrevButton, "prev buttton, #4").toLooseEqual(false);
    expect(survey.isShowNextButton, "next buttton, #4").toLooseEqual(false);
    expect(survey.isCompleteButtonVisible, "complete buttton, #4").toLooseEqual(true);
    expect(addBtn.visible, "addBtn visible #4").toLooseEqual(true);
  });
  test("singleInput and panel dynamic with templateTitle", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic", name: "panel1",
          panelCount: 2,
          templateTitle: "Item: {panelIndex} - {panel.q1}",
          templateElements: [
            { type: "text", name: "q1" },
          ]
        }
      ],
      questionsOnPageMode: "inputPerPage",
    });
    const panel = survey.getQuestionByName("panel1");
    expect(panel.singleInputQuestion.name, "The q1 is in the row, #1").toLooseEqual("q1");
    expect(panel.singleInputLocTitle.textOrHtml, "wrapper panel single title, #1.1").toLooseEqual("Item: 1 - ");
    expect(panel.locRenderedTitle.textOrHtml, "wrapper panel title, #1.1").toLooseEqual("Item: 1 - ");
    let q1 = panel.singleInputQuestion;
    q1.value = "abc";
    expect(panel.singleInputLocTitle.textOrHtml, "wrapper panel single title, #1.2").toLooseEqual("Item: 1 - abc");
    expect(panel.locRenderedTitle.textOrHtml, "wrapper panel title, #1.2").toLooseEqual("Item: 1 - abc");
    survey.performNext();
    expect(panel.singleInputLocTitle.textOrHtml, "wrapper panel single title, #2.2").toLooseEqual("Item: 2 - ");
    expect(panel.locRenderedTitle.textOrHtml, "wrapper panel title, #2.2").toLooseEqual("Item: 2 - ");
    q1 = panel.singleInputQuestion;
    q1.value = "edf";
    expect(panel.singleInputLocTitle.textOrHtml, "wrapper panel single title, #2.2").toLooseEqual("Item: 2 - edf");
    expect(panel.locRenderedTitle.textOrHtml, "wrapper panel title, #2.2").toLooseEqual("Item: 2 - edf");
    survey.performNext();

    expect(survey.currentSingleQuestion.name, "currentSingleQuestion is panel1, #3").toLooseEqual("panel1");
    expect(panel.singleInputQuestion.name, "show summary, #3").toLooseEqual("panel1");
    expect(panel.locRenderedTitle.textOrHtml, "panel title, #3").toLooseEqual("panel1");
    panel.singleInputSummary.items[0].btnEdit.action();
    expect(panel.singleInputQuestion.name, "The q1 is in the row, #4").toLooseEqual("q1");
    survey.performNext();
    survey.performNext();
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion is panel1, #5").toLooseEqual("panel1");
    expect(panel.singleInputQuestion.name, "show summary, #5").toLooseEqual("panel1");
    expect(panel.locRenderedTitle.textOrHtml, "panel title, #5").toLooseEqual("panel1");
    panel.singleInputSummary.items[1].btnEdit.action();
    expect(panel.singleInputQuestion.name, "The q1 is in the row, #6").toLooseEqual("q1");
  });
  test("singleInput and panel dynamic & add panels in navigation bar", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic", name: "panel1",
          panelCount: 2,
          templateElements: [
            { type: "text", name: "q1", defaultValue: "val1" }
          ]
        }
      ],
      questionsOnPageMode: "inputPerPage"
    });
    const panel1 = <QuestionPanelDynamicModel>survey.getQuestionByName("panel1");
    const bar = survey.navigationBar;
    expect(bar.getActionById("sv-singleinput-add"), "addBtn exists, #1").toBeTruthy();
    expect(panel1.singleInputQuestion.name, "singleInputQuestion, #1").toLooseEqual("panel1");
    survey.questionsOnPageMode = "standard";
    expect(bar.getActionById("sv-singleinput-add")?.id, "addBtn exists, #2").toBeFalsy();
    expect(survey.currentSingleQuestion?.name, "currentSingleQuestion #2").toLooseEqual(undefined);
    expect(panel1.singleInputQuestion?.name, "singleInputQuestion, #2").toLooseEqual(undefined);
    survey.questionsOnPageMode = "inputPerPage";
    expect(panel1.singleInputQuestion.name, "singleInputQuestion, #3").toLooseEqual("panel1");
    const addBtn = bar.getActionById("sv-singleinput-add");
    expect(addBtn, "addBtn exists, #3").toBeTruthy();
    panel1.singleInputSummary.items[0].btnEdit.action();
    expect(addBtn.visible, "addBtn visible #1").toLooseEqual(false);
    survey.performNext();
    expect(addBtn.visible, "addBtn visible #2").toLooseEqual(true);
    addBtn.action();
    expect(panel1.panelCount, "New panel is added, #3").toLooseEqual(3);
    expect(addBtn.visible, "addBtn visible #3").toLooseEqual(false);
    panel1.removePanel(0);
    expect(panel1.panelCount, "Last panel is removed").toLooseEqual(2);
    expect(addBtn.visible, "addBtn visible #4").toLooseEqual(false);
    survey.performNext();
    expect(addBtn.visible, "addBtn visible #5").toLooseEqual(true);
  });
  test("singleInput and panel dynamic & empty panel/add panel/remove panel", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic", name: "panel1",
          templateElements: [
            { type: "text", name: "q1" },
            { type: "text", name: "q2" }
          ]
        }
      ],
      questionsOnPageMode: "inputPerPage"
    });
    const panel1 = <QuestionPanelDynamicModel>survey.getQuestionByName("panel1");
    expect(panel1.panelCount, "panelCount #1").toLooseEqual(0);
    const bar = survey.navigationBar;
    const addBtn = bar.getActionById("sv-singleinput-add");
    const page: PageModel = survey.currentPage;
    expect(addBtn.visible, "addBtn visible #1").toLooseEqual(true);
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion, #1").toLooseEqual("panel1");
    expect(page.visibleRows.length, "Just one visible row, #1").toLooseEqual(1);
    expect(page.visibleRows[0].elements[0].name, "visible question in row, #1").toLooseEqual("panel1");
    expect(panel1.singleInputQuestion.name, "singleInputQuestion, #1").toLooseEqual("panel1");
    expect(survey.isShowPrevButton, "prev buttton, #1").toLooseEqual(false);
    expect(survey.isShowNextButton, "next buttton, #1").toLooseEqual(false);
    panel1.addPanelUI();
    expect(panel1.panelCount, "panelCount #2").toLooseEqual(1);
    expect(addBtn.visible, "addBtn visible #2").toLooseEqual(false);
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion, #2").toLooseEqual("panel1");
    expect(panel1.singleInputQuestion.name, "singleInputQuestion, #2").toLooseEqual("q1");
    expect(survey.isShowPrevButton, "prev buttton, #2").toLooseEqual(true);
    expect(survey.isShowNextButton, "next buttton, #2").toLooseEqual(true);
    panel1.removePanel(0);
    expect(panel1.panelCount, "panelCount #3").toLooseEqual(0);
    expect(addBtn.visible, "addBtn visible #3").toLooseEqual(true);
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion, #3").toLooseEqual("panel1");
    expect(page.visibleRows.length, "Just one visible row, #3").toLooseEqual(1);
    expect(page.visibleRows[0].elements[0].name, "visible question in row, #3").toLooseEqual("panel1");
    expect(panel1.singleInputQuestion.name, "singleInputQuestion, #3").toLooseEqual("panel1");
    expect(survey.isShowPrevButton, "prev buttton, #3").toLooseEqual(false);
    expect(survey.isShowNextButton, "next buttton, #3").toLooseEqual(false);
  });
  test("singleInput and panel dynamic & validation", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic", name: "panel1",
          panelCount: 1,
          templateElements: [
            { type: "text", name: "q1", isRequired: true },
            { type: "text", name: "q2", isRequired: true }
          ]
        }
      ],
      questionsOnPageMode: "inputPerPage"
    });
    const panel1 = survey.getQuestionByName("panel1");
    expect(panel1.panelCount, "panelCount #1").toLooseEqual(1);
    const bar = survey.navigationBar;
    const addBtn = bar.getActionById("sv-singleinput-add");
    const page: PageModel = survey.currentPage;
    expect(addBtn.visible, "addBtn visible #1").toLooseEqual(false);
    expect(getSingleQuestion(page).name, "getSingleQuestion is q1").toLooseEqual("q1");
    expect(panel1.singleInputLocTitle.textOrHtml, "wrapper panel title, #1").toLooseEqual("Panel 1");
    expect(survey.performNext(), "next #2").toLooseEqual(false);
    expect(getSingleQuestion(page).name, "getSingleQuestion is q1, #2").toLooseEqual("q1");
    expect(getSingleQuestion(page).errors.length, "getSingleQuestion errors, #2").toLooseEqual(1);
    getSingleQuestion(page).value = "a";
    expect(survey.performNext(), "next #3").toLooseEqual(true);
    expect(getSingleQuestion(page).name, "getSingleQuestion is q2, #3").toLooseEqual("q2");
    expect(addBtn.visible, "addBtn visible #3").toLooseEqual(false);
    survey.performNext();
    addBtn.action();
    expect(getSingleQuestion(page).name, "getSingleQuestion is q2, #4").toLooseEqual("q2");
    expect(getSingleQuestion(page).errors.length, "getSingleQuestion errors, #4").toLooseEqual(1);
    expect(addBtn.visible, "addBtn visible #4").toLooseEqual(false);
    getSingleQuestion(page).value = "b";
    survey.performNext();
    addBtn.action();
    expect(getSingleQuestion(page).name, "getSingleQuestion is q1, #5").toLooseEqual("q1");
    expect(addBtn.visible, "addBtn visible #5").toLooseEqual(false);
    expect(panel1.panelCount, "panelCount #5").toLooseEqual(2);
    expect(panel1.singleInputLocTitle.textOrHtml, "wrapper panel title, #2").toLooseEqual("Panel 2");
    getSingleQuestion(page).value = "c";
    survey.performNext();
    getSingleQuestion(page).value = "d";
    expect(survey.tryComplete(), "compete").toLooseEqual(true);
    expect(survey.data, "survey.data").toEqualValues({ panel1: [{ q1: "a", q2: "b" }, { q1: "c", q2: "d" }] });
  });
  test("singleInput and focus on errors", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic", name: "panel1",
          panelCount: 1,
          templateElements: [
            { type: "text", name: "q1", isRequired: true },
            { type: "text", name: "q2", isRequired: true }
          ]
        }
      ],
      questionsOnPageMode: "inputPerPage"
    });
    const panel1 = survey.getQuestionByName("panel1");
    expect(panel1.panelCount, "panelCount #1").toLooseEqual(1);
    expect(panel1.singleInputQuestion.name, "singleInputQuestion, #0").toLooseEqual("q1");
    survey.validate(true, true);
    expect(panel1.singleInputQuestion.name, "singleInputQuestion, #1").toLooseEqual("q1");
    panel1.singleInputQuestion.value = "a";
    survey.validate(true, true);
    expect(panel1.singleInputQuestion.name, "singleInputQuestion, #2").toLooseEqual("q2");
    panel1.singleInputQuestion.value = "b";
    survey.performNext();
    panel1.addPanel();
    survey.validate(true, true);
    expect(panel1.singleInputQuestion.name, "singleInputQuestion, #4").toLooseEqual("q1");
    panel1.singleInputQuestion.value = "c";
    survey.validate(true, true);
    expect(panel1.singleInputQuestion.name, "singleInputQuestion, #5").toLooseEqual("q2");
    panel1.singleInputQuestion.value = "d";
    survey.performNext();
    expect(survey.tryComplete(), "compete").toLooseEqual(true);
    expect(survey.data, "survey.data").toEqualValues({ panel1: [{ q1: "a", q2: "b" }, { q1: "c", q2: "d" }] });
  });
  test("singleInput and focus on errors on singleInputAddItem & tryComplete", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic", name: "panel1",
          panelCount: 1,
          templateElements: [
            { type: "text", name: "q1", isRequired: true },
            { type: "text", name: "q2", isRequired: true }
          ]
        }
      ],
      questionsOnPageMode: "inputPerPage"
    });
    const panel1 = survey.getQuestionByName("panel1");
    expect(panel1.panelCount, "panelCount #1").toLooseEqual(1);
    expect(panel1.singleInputQuestion.name, "singleInputQuestion, #1").toLooseEqual("q1");
    const errQuestion = panel1.singleInputQuestion;
    errQuestion.value = "a";
    expect(errQuestion.errors.length, "singleInputQuestion, #1.1").toLooseEqual(0);
    survey.validate(true, true);
    expect(panel1.singleInputQuestion.name, "singleInputQuestion, #2").toLooseEqual("q2");
    panel1.singleInputQuestion.value = "b";
    survey.performNext();
    panel1.singleInputAddItem();
    survey.tryComplete();
    expect(panel1.singleInputQuestion.name, "singleInputQuestion, #4").toLooseEqual("q1");
    panel1.singleInputQuestion.value = "c";
    survey.tryComplete();
    expect(panel1.singleInputQuestion.name, "singleInputQuestion, #5").toLooseEqual("q2");
    panel1.singleInputQuestion.value = "d";
    survey.performNext();
    expect(survey.tryComplete(), "compete").toLooseEqual(true);
    expect(survey.data, "survey.data").toEqualValues({ panel1: [{ q1: "a", q2: "b" }, { q1: "c", q2: "d" }] });
  });
  test("singleInput and focus on errors on singleInputAddItem & tryComplete for matrix dynamic", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic", name: "matrix",
          rowCount: 0,
          columns: [
            { cellType: "text", name: "q1", isRequired: true },
            { cellType: "text", name: "q2", isRequired: true }
          ]
        }
      ],
      questionsOnPageMode: "inputPerPage"
    });
    const matrix = survey.getQuestionByName("matrix");
    expect(matrix.singleInputQuestion.name, "singleInputQuestion, #0").toLooseEqual("matrix");
    matrix.singleInputAddItem(true);
    expect(matrix.singleInputQuestion.name, "singleInputQuestion, #1").toLooseEqual("q1");
    matrix.singleInputQuestion.value = "a";
    expect(matrix.singleInputQuestion.errors.length, "singleInputQuestion, #1.1").toLooseEqual(0);
    survey.tryComplete();
    expect(matrix.singleInputQuestion.name, "singleInputQuestion, #2").toLooseEqual("q2");
    expect(matrix.singleInputQuestion.errors.length, "singleInputQuestion, #2").toLooseEqual(1);
    matrix.singleInputQuestion.value = "b";
    expect(matrix.singleInputQuestion.errors.length, "singleInputQuestion, #2.1").toLooseEqual(0);
    survey.performNext();
    matrix.singleInputAddItem();
    expect(matrix.rowCount, "rowCount #2").toLooseEqual(2);
    survey.tryComplete();
    expect(matrix.singleInputQuestion.name, "singleInputQuestion, #4").toLooseEqual("q1");
    matrix.singleInputQuestion.value = "c";
    survey.tryComplete();
    expect(matrix.singleInputQuestion.name, "singleInputQuestion, #5").toLooseEqual("q2");
    matrix.singleInputQuestion.value = "d";
    survey.performNext();
    expect(survey.tryComplete(), "compete").toLooseEqual(true);
    expect(survey.data, "survey.data").toEqualValues({ matrix: [{ q1: "a", q2: "b" }, { q1: "c", q2: "d" }] });
  });
  test("matrixdynamic vs allowRemoveRows = false, Bug#9859", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          defaultValue: [{ q1: "a" }, { q1: "b" }],
          name: "matrix",
          columns: [
            {
              name: "q1",
              cellType: "text"
            }
          ],
          allowAddRows: false,
          allowRemoveRows: false
        }
      ],
      questionsOnPageMode: "inputPerPage",
    });
    const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("matrix");
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion is matrix, #1").toLooseEqual("matrix");
    const summary = matrix.singleInputSummary;
    expect(summary?.items.length, "singleInputSummary.items.length, #1").toLooseEqual(2);
    expect(summary.items[0].showRemove, "singleInputSummary.items[0].showRemove, #1").toLooseEqual(false);
    expect(summary.items[1].showRemove, "singleInputSummary.items[1].showRemove, #1").toLooseEqual(false);
  });
  test("singleInput and matrix dropdown", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown", name: "matrix1",
          columns: [
            { cellType: "text", name: "col1", title: "Column 1" },
            { cellType: "text", name: "col2", title: "Column 2" }
          ],
          rows: [{ value: "row1", text: "Row 1" }, "Row 2"]
        }
      ],
      questionsOnPageMode: "inputPerPage"
    });
    const matrix1 = survey.getQuestionByName("matrix1");
    expect(matrix1.singleInputQuestion.name, "singleInputQuestion.name, #1").toLooseEqual("col1");
    expect(matrix1.singleInputQuestion.title, "singleInputQuestion.title, #1").toLooseEqual("Column 1");
    expect(matrix1.singleInputLocTitle.textOrHtml, "singleInputLocTitle, #1").toLooseEqual("Row 1");
    expect(survey.isCompleteButtonVisible, "isCompleteButtonVisible #1").toLooseEqual(false);
    survey.performNext();
    expect(matrix1.singleInputQuestion.name, "singleInputQuestion.name, #2").toLooseEqual("col2");
    expect(matrix1.singleInputQuestion.title, "singleInputQuestion.title, #2").toLooseEqual("Column 2");
    expect(matrix1.singleInputLocTitle.textOrHtml, "singleInputLocTitle, #2").toLooseEqual("Row 1");
    expect(survey.isCompleteButtonVisible, "isCompleteButtonVisible #2").toLooseEqual(false);
    survey.performNext();
    expect(matrix1.singleInputQuestion.name, "singleInputQuestion.name, #3").toLooseEqual("col1");
    expect(matrix1.singleInputQuestion.title, "singleInputQuestion.title, #3").toLooseEqual("Column 1");
    expect(matrix1.singleInputLocTitle.textOrHtml, "singleInputLocTitle, #3").toLooseEqual("Row 2");
    expect(survey.isCompleteButtonVisible, "isCompleteButtonVisible #3").toLooseEqual(false);
    survey.performNext();
    expect(matrix1.singleInputQuestion.name, "singleInputQuestion.name, #4").toLooseEqual("col2");
    expect(matrix1.singleInputQuestion.title, "singleInputQuestion.title, #4").toLooseEqual("Column 2");
    expect(matrix1.singleInputLocTitle.textOrHtml, "singleInputLocTitle, #4").toLooseEqual("Row 2");
    expect(survey.isCompleteButtonVisible, "isCompleteButtonVisible #4").toLooseEqual(true);
  });
  test("singleInput and matrix dynamic", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic", name: "matrix1",
          rowCount: 0,
          columns: [
            { cellType: "text", name: "col1", title: "Column 1" },
            { cellType: "text", name: "col2", title: "Column 2" }
          ]
        }
      ],
      questionsOnPageMode: "inputPerPage"
    });
    const matrix1 = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix1");
    expect(matrix1.singleInputQuestion.name, "singleInputQuestion.name, #0").toLooseEqual("matrix1");
    expect(survey.isCompleteButtonVisible, "isCompleteButtonVisible #0").toLooseEqual(true);
    matrix1.addRow();
    expect(matrix1.singleInputQuestion.name, "singleInputQuestion.name, #1").toLooseEqual("col1");
    expect(matrix1.singleInputQuestion.title, "singleInputQuestion.title, #1").toLooseEqual("Column 1");
    expect(survey.isCompleteButtonVisible, "isCompleteButtonVisible #1").toLooseEqual(false);
    matrix1.singleInputQuestion.value = "a";
    survey.performNext();
    expect(matrix1.singleInputQuestion.name, "singleInputQuestion.name, #2").toLooseEqual("col2");
    expect(matrix1.singleInputQuestion.title, "singleInputQuestion.title, #2").toLooseEqual("Column 2");
    expect(survey.isCompleteButtonVisible, "isCompleteButtonVisible #2").toLooseEqual(false);
    expect(matrix1.rowCount, "rowCount #2").toLooseEqual(1);
    survey.performNext();
    expect(matrix1.singleInputQuestion.name, "singleInputQuestion.name, #3").toLooseEqual("matrix1");
    expect(survey.isCompleteButtonVisible, "isCompleteButtonVisible #3").toLooseEqual(true);
    matrix1.removeRow(0);
    expect(matrix1.singleInputQuestion.name, "singleInputQuestion.name, #4").toLooseEqual("matrix1");
    expect(survey.isCompleteButtonVisible, "isCompleteButtonVisible #4").toLooseEqual(true);
    matrix1.addRow();
    expect(matrix1.singleInputQuestion.name, "singleInputQuestion.name, #5").toLooseEqual("col1");
    expect(matrix1.singleInputQuestion.title, "singleInputQuestion.title, #5").toLooseEqual("Column 1");
    expect(survey.isCompleteButtonVisible, "isCompleteButtonVisible #5").toLooseEqual(false);
  });
  test("singleInput and matrix dynamic & add/remove rows in navigation bar", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic", name: "matrix1",
          rowCount: 0,
          columns: [
            { cellType: "text", name: "col1", defaultValue: "val1" },
          ]
        }
      ],
      questionsOnPageMode: "inputPerPage"
    });
    const matrix1 = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix1");
    const bar = survey.navigationBar;
    expect(matrix1.singleInputQuestion.name, "singleInputQuestion is empty, #1").toLooseEqual("matrix1");
    matrix1.addRow();
    expect(matrix1.singleInputQuestion.name, "singleInputQuestion, #1").toLooseEqual("col1");
    expect(bar.getActionById("sv-singleinput-add"), "addBtn exists, #1").toBeTruthy();
    survey.questionsOnPageMode = "standard";
    expect(bar.getActionById("sv-singleinput-add"), "addBtn exists, #2").toBeFalsy();
    expect(survey.currentSingleQuestion?.name, "currentSingleQuestion #2").toLooseEqual(undefined);
    expect(matrix1.singleInputQuestion?.name, "singleInputQuestion, #2").toLooseEqual(undefined);
    matrix1.rowCount = 0;
    survey.questionsOnPageMode = "inputPerPage";
    expect(matrix1.singleInputQuestion.name, "singleInputQuestion, #3.1").toLooseEqual("matrix1");
    matrix1.addRow();
    expect(matrix1.singleInputQuestion.name, "singleInputQuestion, #3.2").toLooseEqual("col1");
    const addBtn = bar.getActionById("sv-singleinput-add");
    expect(addBtn, "addBtn exists, #3").toBeTruthy();
    expect(addBtn.visible, "addBtn visible #1").toLooseEqual(false);
    survey.performNext();
    expect(addBtn.visible, "addBtn visible #2").toLooseEqual(true);
    expect(addBtn.title, "addBtn text #2").toLooseEqual("Add Row");
    addBtn.action();
    expect(matrix1.rowCount, "New row is added").toLooseEqual(2);
    expect(addBtn.visible, "addBtn visible #3").toLooseEqual(false);
    matrix1.removeRow(0);
    expect(matrix1.rowCount, "Last row is removed").toLooseEqual(1);
    expect(addBtn.visible, "addBtn visible #4").toLooseEqual(false);
    survey.performNext();
    expect(addBtn.visible, "addBtn visible #5").toLooseEqual(true);
    expect(addBtn.title, "addBtn text #5").toLooseEqual("Add Row");
  });
  test("singleInput and single matrix", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrix", name: "matrix1",
          columns: ["col1", "col2", "col3", "col4"],
          rows: [{ value: "row1", text: "Row 1" }, "row2"]
        }
      ],
      questionsOnPageMode: "inputPerPage"
    });
    survey.css = { question: { nested: "q-nested", withFrame: "q-frame" } };
    const matrix1 = survey.getQuestionByName("matrix1");
    expect(matrix1.singleInputQuestion.name, "singleInputQuestion.name, #1").toLooseEqual("row1");
    expect(matrix1.singleInputQuestion.locTitle.textOrHtml, "singleInputQuestion.title, #1").toLooseEqual("Row 1");
    expect(matrix1.singleInputQuestion.choices.length, "singleInputQuestion.choices.length, #1").toLooseEqual(4);
    expect(survey.isCompleteButtonVisible, "isCompleteButtonVisible #1").toLooseEqual(false);
    expect(matrix1.singleInputQuestion.isRequired, "The question is not required").toLooseEqual(false);
    const rootCss = matrix1.singleInputQuestion.getRootCss();
    expect(rootCss.indexOf("q-frame") > -1, "rootCss has frame, #1").toLooseEqual(true);
    expect(rootCss.indexOf("q-nested") > -1, "rootCss has frame, #1").toLooseEqual(false);
    matrix1.singleInputQuestion.value = "col2";
    survey.performNext();
    expect(matrix1.singleInputQuestion.name, "singleInputQuestion.name, #2").toLooseEqual("row2");
    expect(matrix1.singleInputQuestion.choices.length, "singleInputQuestion.choices.length, #2").toLooseEqual(4);
    expect(survey.isCompleteButtonVisible, "isCompleteButtonVisible #2").toLooseEqual(true);
    matrix1.singleInputQuestion.value = "col3";
    expect(matrix1.value, "matrix1.value").toEqualValues({ row1: "col2", row2: "col3" });
    expect(survey.data, "survey.data").toEqualValues({ matrix1: { row1: "col2", row2: "col3" } });
  });
  test("singleInput and single matrix", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrix", name: "matrix1", eachRowRequired: true,
          columns: ["col1", "col2", "col3", "col4"],
          rows: [{ value: "row1", text: "Row 1" }, "row2"]
        }
      ],
      questionsOnPageMode: "inputPerPage"
    });
    const matrix1 = survey.getQuestionByName("matrix1");
    expect(matrix1.singleInputQuestion.isRequired, "The question is required").toLooseEqual(true);
  });
  test("singleInput and matrix dynamic & navigation buttons visibilty & show matrix question", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic", name: "matrix1",
          rowCount: 0,
          columns: [
            { cellType: "text", name: "col1" },
            { cellType: "text", name: "col2" }
          ]
        }
      ],
      questionsOnPageMode: "inputPerPage",
    });
    const matrix1 = survey.getQuestionByName("matrix1");
    const addBtn = survey.navigationBar.getActionById("sv-singleinput-add");
    expect(matrix1.singleInputQuestion.name, "singleInputQuestion.name, #1").toLooseEqual("matrix1");
    expect(addBtn.visible, "addBtn visible #1").toLooseEqual(true);
    expect(survey.isShowPrevButton, "prev buttton, #1").toLooseEqual(false);
    expect(survey.isShowNextButton, "next buttton, #1").toLooseEqual(false);
    expect(survey.isCompleteButtonVisible, "complete buttton, #1").toLooseEqual(true);
    matrix1.addRow();
    expect(matrix1.singleInputQuestion.name, "singleInputQuestion.name, #2").toLooseEqual("col1");
    expect(addBtn.visible, "addBtn visible #2").toLooseEqual(false);
    expect(survey.isShowPrevButton, "prev buttton, #2").toLooseEqual(true);
    expect(survey.isShowNextButton, "next buttton, #2").toLooseEqual(true);
    expect(survey.isCompleteButtonVisible, "complete buttton, #2").toLooseEqual(false);
    matrix1.singleInputQuestion.value = "a";
    survey.performNext();
    expect(matrix1.singleInputQuestion.name, "singleInputQuestion.name, #3").toLooseEqual("col2");
    expect(addBtn.visible, "addBtn visible #3").toLooseEqual(false);
    expect(survey.isShowPrevButton, "prev buttton, #3").toLooseEqual(true);
    expect(survey.isShowNextButton, "next buttton, #3").toLooseEqual(true);
    expect(survey.isCompleteButtonVisible, "complete buttton, #3").toLooseEqual(false);
    survey.performNext();
    expect(matrix1.rowCount, "rowCount #3").toLooseEqual(1);
    expect(matrix1.singleInputQuestion.name, "singleInputQuestion.name, #4").toLooseEqual("matrix1");
    expect(addBtn.visible, "addBtn visible #4").toLooseEqual(true);
    expect(survey.isShowPrevButton, "prev buttton, #4").toLooseEqual(false);
    expect(survey.isShowNextButton, "next buttton, #4").toLooseEqual(false);
    expect(survey.isCompleteButtonVisible, "complete buttton, #4").toLooseEqual(true);
    matrix1.addRow();
    expect(matrix1.singleInputQuestion.name, "singleInputQuestion.name, #5").toLooseEqual("col1");
    expect(addBtn.visible, "addBtn visible #5").toLooseEqual(false);
    expect(survey.isShowPrevButton, "prev buttton, #5").toLooseEqual(true);
    expect(survey.isShowNextButton, "next buttton, #5").toLooseEqual(true);
    expect(survey.isCompleteButtonVisible, "complete buttton, #5").toLooseEqual(false);
  });

  test("singleInput and matrix dynamic & navigation buttons visibilty & visibleIf", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic", name: "matrix1",
          rowCount: 0,
          columns: [
            { cellType: "text", name: "col1" },
            { cellType: "text", name: "col2", visibleIf: "{row.col1} = 1" },
            { cellType: "text", name: "col3", visibleIf: "{row.col1} notempty" },
          ]
        }
      ],
      questionsOnPageMode: "inputPerPage",
    });
    const matrix1 = survey.getQuestionByName("matrix1");
    expect(matrix1.singleInputQuestion.name, "singleInputQuestion.name, #0").toLooseEqual("matrix1");
    matrix1.addRow();
    const addBtn = survey.navigationBar.getActionById("sv-singleinput-add");
    expect(survey.isShowPrevButton, "prev buttton, #1").toLooseEqual(true);
    expect(survey.isShowNextButton, "next buttton, #1").toLooseEqual(true);
    expect(survey.isCompleteButtonVisible, "complete buttton, #1").toLooseEqual(false);
    expect(matrix1.singleInputQuestion.name, "singleInputQuestion.name, #1").toLooseEqual("col1");
    expect(addBtn.visible, "addBtn visible #1, row is empty").toLooseEqual(false);
    matrix1.singleInputQuestion.value = "a";
    expect(survey.isShowPrevButton, "prev buttton, #2").toLooseEqual(true);
    expect(survey.isShowNextButton, "next buttton, #2").toLooseEqual(true);
    expect(survey.isCompleteButtonVisible, "complete buttton, #2").toLooseEqual(false);
    expect(addBtn.visible, "addBtn visible #2").toLooseEqual(false);
    survey.performNext();
    expect(survey.isShowPrevButton, "prev buttton, #3").toLooseEqual(true);
    expect(survey.isShowNextButton, "next buttton, #3").toLooseEqual(true);
    expect(survey.isCompleteButtonVisible, "complete buttton, #3").toLooseEqual(false);
    expect(matrix1.singleInputQuestion.name, "singleInputQuestion.name, #3").toLooseEqual("col3");
    expect(addBtn.visible, "addBtn visible #3").toLooseEqual(false);
    survey.performNext();
    expect(survey.isShowPrevButton, "prev buttton, #4").toLooseEqual(false);
    expect(survey.isShowNextButton, "next buttton, #4").toLooseEqual(false);
    expect(survey.isCompleteButtonVisible, "complete buttton, #4").toLooseEqual(true);
    expect(matrix1.singleInputQuestion.name, "singleInputQuestion.name, #4").toLooseEqual("matrix1");
    expect(addBtn.visible, "addBtn visible #4").toLooseEqual(true);
  });
  test("singleInput for panel dynamic & singleInputLocTitle", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic", name: "panel1",
          panelCount: 2,
          templateElements: [
            { type: "text", name: "q1" }
          ]
        }
      ]
    });
    const panel = survey.getQuestionByName("panel1");
    expect(panel.panels[0].locTitle.isEmpty, "panels[0] locTitle is empty, #1").toLooseEqual(true);
    expect(panel.panels[1].locTitle.isEmpty, "panels[1] locTitle is empty, #1").toLooseEqual(true);
    survey.questionsOnPageMode = "inputPerPage";
    expect(panel.singleInputLocTitle.textOrHtml, "singleInputLocTitle, #2").toLooseEqual("Panel 1");
    panel.panels[0].getQuestionByName("q1").value = "a";
    survey.performNext();
    expect(panel.singleInputLocTitle.textOrHtml, "singleInputLocTitle, #3").toLooseEqual("Panel 2");
    survey.questionsOnPageMode = "standard";
    expect(panel.panels[0].locTitle.isEmpty, "panels[0] locTitle is empty, #4").toLooseEqual(true);
    expect(panel.panels[1].locTitle.isEmpty, "panels[1] locTitle is empty, #4").toLooseEqual(true);
  });
  test("singleInput for matrix dynamic & singleInputLocTitle, cell question title", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic", name: "matrix1",
          rowCount: 0,
          columns: [{ cellType: "text", name: "col1" }]
        }
      ],
      questionsOnPageMode: "inputPerPage"
    });
    const matrix = survey.getQuestionByName("matrix1");
    expect(matrix.singleInputLocTitle?.name, "singleInputLocTitle, #1").toBeFalsy();
    matrix.addRow();
    expect(matrix.singleInputLocTitle, "singleInputLocTitle, #2").toBeTruthy();
    expect(matrix.singleInputLocTitle.textOrHtml, "singleInputLocTitle, #2").toLooseEqual("Row 1");
    expect(matrix.singleInputQuestion.locTitle.textOrHtml, "singleInputQuestion.title, #2").toLooseEqual("col1");
    matrix.singleInputQuestion.value = "a";
    survey.performNext();
    expect(matrix.singleInputLocTitle?.textOrHtml, "singleInputLocTitle, #3").toBeFalsy();
    matrix.addRow();
    expect(matrix.singleInputLocTitle, "singleInputLocTitle, #4").toBeTruthy();
    expect(matrix.singleInputLocTitle.textOrHtml, "singleInputLocTitle, #4").toLooseEqual("Row 2");
    matrix.singleInputQuestion.value = "b";
    survey.performNext();
    expect(matrix.singleInputLocTitle?.textOrHtml, "singleInputLocTitle, #5").toBeFalsy();
    matrix.addRow();
    expect(matrix.singleInputLocTitle, "singleInputLocTitle, #6").toBeTruthy();
    expect(matrix.singleInputLocTitle.textOrHtml, "singleInputLocTitle, #6").toLooseEqual("Row 3");
    matrix.singleInputQuestion.value = "c";
    survey.performNext();
    matrix.singleInputSummary.items[1].btnEdit.action();
    expect(matrix.singleInputLocTitle.textOrHtml, "singleInputLocTitle, #7").toLooseEqual("Row 2");
  });
  test("singleInput for matrix dynamic & cell question & css", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic", name: "matrix1",
          rowCount: 0,
          columns: [
            { cellType: "text", name: "col1" },
            { cellType: "text", name: "col2" }
          ]
        }
      ],
      questionsOnPageMode: "inputPerPage"
    });
    survey.css = { question: { nested: "q-nested", withFrame: "q-frame" } };
    const matrix = survey.getQuestionByName("matrix1");
    expect(matrix.singleInputQuestion.name, "no singleInputQuestion, #1").toLooseEqual("matrix1");
    matrix.addRow();
    matrix.addRow();
    matrix.visibleRows.forEach(row => {
      row.cells.forEach(cell => {
        const q = cell.question;
        const rootCss = q.getRootCss();
        expect(rootCss.indexOf("q-frame") > -1, "rootCss has frame: name: " + q.name).toLooseEqual(true);
        expect(rootCss.indexOf("q-nested") > -1, "rootCss no nested: name: " + q.name).toLooseEqual(false);
      });
    });
  });

  test("singleInput & singleInputSummary for dynamic matrix", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic", name: "matrix1",
          rowCount: 0,
          columns: [
            { cellType: "text", name: "col1" },
            { cellType: "text", name: "col2" }
          ]
        }
      ],
      questionsOnPageMode: "inputPerPage"
    });
    const matrix = survey.getQuestionByName("matrix1");
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion is matrix1, #1").toLooseEqual("matrix1");
    expect(matrix.singleInputQuestion.name, "singleInputQuestion.name, #1").toLooseEqual("matrix1");
    expect(matrix.singleInputSummary, "singleInputSummary exists, #1").toBeTruthy();
    expect(matrix.singleInputSummary.items.length, "singleInputSummary.items.length, #1").toLooseEqual(0);
    expect(matrix.singleInputLocTitle?.textOrHtml, "singleInputLocTitle, #1").toBeFalsy();
    expect(matrix.locRenderedTitle.textOrHtml, "locRenderedTitle, #1").toLooseEqual("matrix1");
    matrix.addRow();
    expect(matrix.rowCount, "row count, #2").toLooseEqual(1);
    expect(matrix.singleInputSummary?.question.name, "singleInputSummary exists, #2").toBeFalsy();
    expect(matrix.singleInputLocTitle?.textOrHtml, "singleInputLocTitle, #2").toLooseEqual("Row 1");
    expect(matrix.locRenderedTitle.textOrHtml, "locRenderedTitle, #2").toLooseEqual("Row 1");
    matrix.singleInputQuestion.value = "a";
    survey.performNext();
    expect(matrix.singleInputSummary?.question.name, "singleInputSummary exists, #3").toBeFalsy();
    expect(matrix.singleInputLocTitle?.textOrHtml, "singleInputLocTitle, #3").toLooseEqual("Row 1");
    expect(matrix.locRenderedTitle.textOrHtml, "locRenderedTitle, #3").toLooseEqual("Row 1");
    survey.performNext();
    expect(matrix.singleInputSummary, "singleInputSummary exists, #4").toBeTruthy();
    expect(matrix.singleInputSummary.items.length, "singleInputSummary.items.length, #4").toLooseEqual(1);
    expect(matrix.singleInputLocTitle?.textOrHtml, "singleInputLocTitle, #1").toBeFalsy();
    expect(matrix.locRenderedTitle.textOrHtml, "locRenderedTitle, #1").toLooseEqual("matrix1");

    matrix.addRow();
    matrix.singleInputQuestion.value = "b";
    survey.performNext();
    survey.performNext();
    expect(matrix.singleInputSummary, "singleInputSummary exists, #5").toBeTruthy();
    expect(matrix.singleInputSummary.items.length, "singleInputSummary.items.length, #5").toLooseEqual(2);
    expect(matrix.singleInputSummary.items[0].locText.textOrHtml, "singleInputSummary.items[0].locText, #5").toLooseEqual("Row 1");
    expect(matrix.singleInputSummary.items[1].locText.textOrHtml, "singleInputSummary.items[1].locText, #5").toLooseEqual("Row 2");
    expect(matrix.singleInputSummary.items[0].btnEdit.locTitle.textOrHtml, "singleInputSummary.items[0].btnEdit.locTitle, #5").toLooseEqual("Edit");
    matrix.singleInputSummary.items[0].btnEdit.action();
    expect(matrix.singleInputQuestion.name, "singleInputQuestion.name, #6").toLooseEqual("col1");
    expect(matrix.singleInputLocTitle.textOrHtml, "singleInputLocTitle, #6").toLooseEqual("Row 1");
    expect(survey.isShowPrevButton, "prev buttton, #6").toLooseEqual(true);
    expect(survey.isShowNextButton, "next buttton, #6").toLooseEqual(true);
  });
  test("singleInput & singleInputSummary for dynamic panel", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic", name: "panel1",
          templateElements: [
            { type: "text", name: "q1" },
            { type: "text", name: "q2" }
          ]
        }
      ],
      questionsOnPageMode: "inputPerPage"
    });
    const panel = survey.getQuestionByName("panel1");
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion is matrix1, #1").toLooseEqual("panel1");
    expect(panel.singleInputQuestion.name, "singleInputQuestion.name, #1").toLooseEqual("panel1");
    expect(panel.singleInputSummary, "singleInputSummary exists, #1").toBeTruthy();
    expect(panel.singleInputSummary.items.length, "singleInputSummary.items.length, #1").toLooseEqual(0);
    panel.addPanel();
    expect(panel.panelCount, "row count, #2").toLooseEqual(1);
    expect(panel.singleInputSummary?.question.name, "singleInputSummary exists, #2").toBeFalsy();
    panel.singleInputQuestion.value = "a";
    survey.performNext();
    expect(panel.singleInputSummary?.question.name, "singleInputSummary exists, #3").toBeFalsy();
    survey.performNext();
    expect(panel.singleInputSummary, "singleInputSummary exists, #4").toBeTruthy();
    expect(panel.singleInputSummary.items.length, "singleInputSummary.items.length, #4").toLooseEqual(1);
    panel.addPanel();
    panel.singleInputQuestion.value = "b";
    survey.performNext();
    survey.performNext();
    expect(panel.singleInputSummary, "singleInputSummary exists, #5").toBeTruthy();
    expect(panel.singleInputSummary.items.length, "singleInputSummary.items.length, #5").toLooseEqual(2);
    expect(panel.singleInputSummary.items[0].locText.textOrHtml, "singleInputSummary.items[0].locText, #5").toLooseEqual("Panel 1");
    expect(panel.singleInputSummary.items[1].locText.textOrHtml, "singleInputSummary.items[1].locText, #5").toLooseEqual("Panel 2");
    expect(panel.singleInputSummary.items[0].btnEdit.locTitle.textOrHtml, "singleInputSummary.items[0].btnEdit.locTitle, #5").toLooseEqual("Edit");
    panel.singleInputSummary.items[0].btnEdit.action();
    expect(panel.singleInputQuestion.name, "singleInputQuestion.name, #6").toLooseEqual("q1");
    expect(panel.singleInputLocTitle.textOrHtml, "singleInputLocTitle, #6").toLooseEqual("Panel 1");
    expect(survey.isShowPrevButton, "prev buttton, #6").toLooseEqual(true);
    expect(survey.isShowNextButton, "next buttton, #6").toLooseEqual(true);
  });
  test("singleInput & singleInputSummary for nested dynamic panel", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic", name: "panel1",
          templateElements: [
            { type: "text", name: "q1" },
            { type: "paneldynamic", name: "panel2", templateElements: [{ type: "text", name: "q2" }], templateTitle: "#{panelIndex}: {panel.q2}" }
          ]
        }
      ],
      questionsOnPageMode: "inputPerPage"
    });
    survey.data = { panel1: [{ q1: "a", panel2: [{ q2: "b" }, { q2: "c" }] }] };
    const panel1 = survey.getQuestionByName("panel1");
    expect(panel1.singleInputQuestion.name, "panel2.singleInputQuestion.name, #0").toLooseEqual("panel1");
    expect(panel1.singleInputSummary, "singleInputSummary exists, #0").toBeTruthy();
    expect(panel1.singleInputSummary.items.length, "singleInputSummary.items.length, #0").toLooseEqual(1);
    panel1.singleInputSummary.items[0].btnEdit.action();
    survey.performNext();
    expect(panel1.singleInputQuestion.name, "panel2.singleInputQuestion.name, #1").toLooseEqual("panel2");
    const panel2 = panel1.panels[0].getQuestionByName("panel2");
    expect(panel2.singleInputQuestion.name, "panel2.singleInputQuestion.name, #1").toLooseEqual("panel2");
    const summary: QuestionSingleInputSummary = panel2.singleInputSummary;
    expect(summary, "singleInputSummary exists, #2").toBeTruthy();
    const items = summary.items;
    expect(items.length, "singleInputSummary.items.length, #2").toLooseEqual(2);
    expect(items[0].locText.textOrHtml, "items[0].text, #2").toLooseEqual("#1: b");
    expect(items[1].locText.textOrHtml, "items[1].text, #2").toLooseEqual("#2: c");
  });
  test("singleInput & nested matrix dynamic in the panel dynamic", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic", name: "panel1",
          panelCount: 1,
          templateElements: [
            { type: "text", name: "name" },
            {
              type: "matrixdynamic", name: "matrix1", rowCount: 0,
              columns: [
                { cellType: "text", name: "col1" },
                { cellType: "text", name: "col2" }
              ]
            }
          ]
        }
      ],
      questionsOnPageMode: "inputPerPage"
    });
    const addBtn = survey.navigationBar.getActionById("sv-singleinput-add");
    const panel = survey.getQuestionByName("panel1");
    let move = " forward";
    const checkStep1 = () => {
      expect(survey.currentSingleQuestion.name, "currentSingleQuestion is matrix1, #1" + move).toLooseEqual("panel1");
      expect(panel.singleInputQuestion.name, "singleInputQuestion.name, #1" + move).toLooseEqual("name");
      expect(panel.singleInputLocTitle.textOrHtml, "input loc title #1" + move).toLooseEqual("Panel 1");
      expect(survey.isShowPrevButton, "prev buttton, #1" + move).toLooseEqual(false);
      expect(survey.isShowNextButton, "next buttton, #1" + move).toLooseEqual(true);
      expect(addBtn.visible, "addBtn visible #1" + move).toLooseEqual(false);
    };
    checkStep1();
    panel.singleInputQuestion.value = "a";
    survey.performNext();
    let matrix = panel.panels[0].getQuestionByName("matrix1");
    const checkStep2 = () => {
      expect(panel.singleInputQuestion.name, "singleInputQuestion.name, #2" + move).toLooseEqual("matrix1");
      expect(panel.singleInputLocTitle.textOrHtml, "input loc title #2" + move).toLooseEqual("Panel 1");
      expect(survey.isShowPrevButton, "prev buttton, #2" + move).toLooseEqual(true);
      expect(survey.isShowNextButton, "next buttton, #2" + move).toLooseEqual(true);
      expect(matrix.singleInputQuestion.name, "matrix.singleInputQuestion.name, #2" + move).toLooseEqual("matrix1");
      expect(matrix.singleInputLocTitle?.textOrHtml, "matrix.input loc title #2" + move).toBeFalsy();
      expect(matrix.singleInputSummary?.items.length, "matrix.singleInputSummary exists, #2" + move).toLooseEqual(0);
      expect(addBtn.visible, "addBtn visible #2" + move).toLooseEqual(true);
      expect(matrix.visibleRows.length, "matrix.visibleRows.length, #2" + move).toLooseEqual(0);
    };
    checkStep2();

    addBtn.action();
    const checkStep3 = () => {
      expect(matrix.visibleRows.length, "matrix.visibleRows.length, #3" + move).toLooseEqual(1);
      expect(panel.singleInputQuestion.name, "singleInputQuestion.name, #3" + move).toLooseEqual("matrix1");
      expect(panel.singleInputLocTitle.textOrHtml, "input loc title #3" + move).toLooseEqual("Panel 1");
      expect(survey.isShowPrevButton, "prev buttton, #3" + move).toLooseEqual(true);
      expect(survey.isShowNextButton, "next buttton, #3" + move).toLooseEqual(true);
      expect(matrix.singleInputQuestion.name, "matrix.singleInputQuestion.name, #3" + move).toLooseEqual("col1");
      matrix.singleInputQuestion.value = "a";
      expect(matrix.singleInputLocTitle.textOrHtml, "matrix.input loc title #3" + move).toLooseEqual("Row 1");
      expect(matrix.singleInputSummary?.items.length, "matrix.singleInputSummary exists, #3" + move).toLooseEqual(undefined);
      expect(addBtn.visible, "addBtn visible #3" + move).toLooseEqual(false);
    };
    checkStep3();

    survey.performNext();
    const checkStep4 = () => {
      expect(panel.singleInputQuestion.name, "singleInputQuestion.name, #4" + move).toLooseEqual("matrix1");
      expect(panel.singleInputLocTitle.textOrHtml, "input loc title #4" + move).toLooseEqual("Panel 1");
      expect(survey.isShowPrevButton, "prev buttton, #4" + move).toLooseEqual(true);
      expect(survey.isShowNextButton, "next buttton, #4" + move).toLooseEqual(true);
      expect(matrix.singleInputQuestion.name, "matrix.singleInputQuestion.name, #4" + move).toLooseEqual("col2");
      expect(matrix.singleInputLocTitle.textOrHtml, "matrix.input loc title #4" + move).toLooseEqual("Row 1");
      expect(matrix.singleInputSummary?.items.length, "matrix.singleInputSummary exists, #4" + move).toLooseEqual(undefined);
      expect(addBtn.visible, "addBtn visible #4" + move).toLooseEqual(false);
    };
    checkStep4();
    survey.performNext();
    const checkStep5 = () => {
      expect(panel.singleInputQuestion.name, "singleInputQuestion.name, #5" + move).toLooseEqual("matrix1");
      expect(panel.singleInputLocTitle.textOrHtml, "input loc title #5" + move).toLooseEqual("Panel 1");
      expect(survey.isShowPrevButton, "prev buttton, #5" + move).toLooseEqual(true);
      expect(survey.isShowNextButton, "next buttton, #5" + move).toLooseEqual(true);
      expect(matrix.singleInputQuestion.name, "matrix.singleInputQuestion.name, #5" + move).toLooseEqual("matrix1");
      expect(matrix.singleInputLocTitle?.textOrHtml, "matrix.input loc title #5" + move).toBeFalsy();
      expect(matrix.singleInputSummary?.items.length, "matrix.singleInputSummary exists, #5" + move).toLooseEqual(1);
      expect(matrix.singleInputSummary.items[0].locText.renderedHtml, "matrix.singleInputSummary items text, #5" + move).toLooseEqual("Row 1");
      expect(addBtn.visible, "addBtn visible #5" + move).toLooseEqual(true);
    };
    checkStep5();

    survey.performNext();
    const checkStep6 = () => {
      expect(panel.singleInputQuestion.name, "singleInputQuestion.name, #6").toLooseEqual("panel1");
      expect(panel.singleInputLocTitle?.textOrHtml, "input loc title #6").toBeFalsy();
      expect(survey.isShowPrevButton, "prev buttton, #6").toLooseEqual(false);
      expect(survey.isShowNextButton, "next buttton, #6").toLooseEqual(false);
      expect(survey.isCompleteButtonVisible, "complete buttton, #6").toLooseEqual(true);
      expect(panel.singleInputSummary.items.length, "panel.singleInputSummary exists, #6").toLooseEqual(1);
      expect(addBtn.visible, "addBtn visible #6").toLooseEqual(true);
    };
    checkStep6();
  });
  test("singleInput & singleInputSummary, stay on summary on deleting", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic", name: "panel1",
          panelCount: 2,
          templateElements: [
            { type: "text", name: "q1", defaultValue: "a" },
          ]
        }
      ],
      questionsOnPageMode: "inputPerPage"
    });
    const panel = survey.getQuestionByName("panel1");
    survey.performNext();
    survey.performNext();
    expect(panel.singleInputSummary, "singleInputSummary is here, #1").toBeTruthy();
    expect(panel.singleInputSummary.items.length, "singleInputSummary.items.length, #1").toLooseEqual(2);
    panel.singleInputSummary.items[0].btnRemove.action();
    expect(panel.singleInputSummary, "singleInputSummary is here, #2").toBeTruthy();
    expect(panel.singleInputSummary.items.length, "singleInputSummary.items.length, #2").toLooseEqual(1);
    panel.singleInputSummary.items[0].btnRemove.action();
    expect(panel.singleInputSummary, "singleInputSummary is here, #3").toBeTruthy();
    expect(panel.singleInputSummary.items.length, "singleInputSummary.items.length, #3").toLooseEqual(0);
  });
  test("singleInput & singleInputSummary, showRemove", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic", name: "panel1",
          panelCount: 2,
          minPanelCount: 1,
          templateElements: [
            { type: "text", name: "q1", defaultValue: "a" },
          ]
        }
      ],
      questionsOnPageMode: "inputPerPage"
    });
    const panel = survey.getQuestionByName("panel1");
    survey.performNext();
    survey.performNext();
    expect(panel.singleInputSummary.items.length, "singleInputSummary.items.length, #1").toLooseEqual(2);
    expect(panel.singleInputSummary.items[0].showRemove, "singleInputSummary.items[0].showRemove, #1").toLooseEqual(true);
    panel.singleInputSummary.items[0].btnRemove.action();
    expect(panel.singleInputSummary.items.length, "singleInputSummary.items.length, #2").toLooseEqual(1);
    expect(panel.singleInputSummary.items[0].showRemove, "singleInputSummary.items[0].showRemove, #1").toLooseEqual(false);
  });
  test("singleInput & singleInputSummary, showAdd && carousel display mode, Bug##9900", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic", name: "panel1",
          panelCount: 2,
          minPanelCount: 1,
          maxPanelCount: 3,
          templateElements: [
            { type: "text", name: "q1" },
          ],
          displayMode: "carousel"
        },
        { type: "text", name: "q2" }
      ],
      questionsOnPageMode: "inputPerPage"
    });
    const panel = survey.getQuestionByName("panel1");
    const addBtn = survey.navigationBar.getActionById("sv-singleinput-add");
    panel.singleInputQuestion.value = "a";
    survey.performNext();
    panel.singleInputQuestion.value = "b";
    survey.performNext();
    expect(panel.singleInputSummary.items.length, "singleInputSummary.items.length, #1").toLooseEqual(2);
    expect(addBtn.visible, "addBtn visible #1").toLooseEqual(true);
    addBtn.action();
    panel.singleInputQuestion.value = "c";
    survey.performNext();
    expect(addBtn.visible, "addBtn visible #2").toLooseEqual(false);
    survey.doComplete();
    expect(survey.data, "survey.data").toEqualValues({ panel1: [{ q1: "a" }, { q1: "b" }, { q1: "c" }] });
  });
  const nestedJSON = {
    elements: [
      {
        type: "paneldynamic", name: "order",
        title: "Order", description: "Fill all fields to make an order",
        panelCount: 1,
        templateTitle: "Order #{panelIndex}",
        templateElements: [
          { type: "text", name: "buyerName", title: "Buyer name", isRequired: true },
          { type: "paneldynamic", name: "stores", title: "Place to Deliver", description: "Add all places you want to deliver",
            panelCount: 1,
            templateTitle: "Delivery #{panelIndex}",
            templateElements: [
              { type: "text", name: "storeName", title: "Store Name", isRequired: true },
              { type: "matrixdynamic", name: "products", cellType: "text", rowCount: 0,
                title: "Products", description: "Add all products you want to deliver to {panel.storeName}",
                singleInputTitleTemplate: "{row.productName}",
                columns: [{ name: "productName", title: "Product Name", isRequired: true, defaultDisplayValue: "New Product" }, { name: "productCount", title: "Count", isRequired: true }]
              },
              { type: "text", name: "address", title: "Place Address" }
            ]
          }
        ]
      }
    ],
    questionsOnPageMode: "inputPerPage"
  };
  test("singleInput & two nested elements", () => {
    const survey = new SurveyModel(nestedJSON);
    const addBtn = survey.navigationBar.getActionById("sv-singleinput-add");
    const panel = survey.getQuestionByName("order");
    expect(panel.singleInputQuestion.name, "root.singleInputQuestion.name, #1").toLooseEqual("buyerName");
    panel.singleInputQuestion.value = "John";

    survey.performNext();
    expect(panel.singleInputQuestion.name, "root.singleInputQuestion.name, #2").toLooseEqual("stores");
    const storesPanel = panel.singleInputQuestion;
    expect(panel.singleInputQuestion.name, "root.singleInputQuestion.name, #2").toLooseEqual("stores");
    expect(storesPanel.singleInputQuestion.name, "storesPanel.singleInputQuestion.name, #3").toLooseEqual("storeName");
    storesPanel.singleInputQuestion.value = "Store 1";

    survey.performNext();
    expect(panel.singleInputQuestion.name, "root.singleInputQuestion.name, #4").toLooseEqual("stores");
    expect(storesPanel.singleInputQuestion.name, "storesPanel.singleInputQuestion.name, #4").toLooseEqual("products");
    const productsMatrix = storesPanel.singleInputQuestion;
    expect(productsMatrix.singleInputQuestion.name, "productsMatrix.singleInputQuestion.name, #5").toLooseEqual("products");
    expect(addBtn.visible, "addBtn visible #5").toLooseEqual(true);

    addBtn.action();
    expect(panel.singleInputQuestion.name, "root.singleInputQuestion.name, #6").toLooseEqual("stores");
    expect(storesPanel.singleInputQuestion.name, "storesPanel.singleInputQuestion.name, #6").toLooseEqual("products");
    expect(productsMatrix.singleInputQuestion.name, "productsMatrix.singleInputQuestion.name, #6").toLooseEqual("productName");
    expect(addBtn.visible, "addBtn visible #6").toLooseEqual(false);
    productsMatrix.singleInputQuestion.value = "Product 1";

    survey.performNext();
    expect(panel.singleInputQuestion.name, "root.singleInputQuestion.name, #7").toLooseEqual("stores");
    expect(storesPanel.singleInputQuestion.name, "storesPanel.singleInputQuestion.name, #7").toLooseEqual("products");
    expect(productsMatrix.singleInputQuestion.name, "productsMatrix.singleInputQuestion.name, #7").toLooseEqual("productCount");
    expect(addBtn.visible, "addBtn visible #7").toLooseEqual(false);
    productsMatrix.singleInputQuestion.value = 2;

    survey.performNext();
    expect(panel.singleInputQuestion.name, "root.singleInputQuestion.name, #8").toLooseEqual("stores");
    expect(storesPanel.singleInputQuestion.name, "productsMatrix.singleInputQuestion.name, #8").toLooseEqual("products");
    expect(productsMatrix.singleInputQuestion.name, "productsMatrix.singleInputQuestion.name, #8").toLooseEqual("products");
    expect(addBtn.visible, "addBtn visible #8").toLooseEqual(true);
    productsMatrix.singleInputSummary.items[0].btnEdit.action();
    expect(productsMatrix.singleInputQuestion.name, "productsMatrix.singleInputQuestion.name, #8.2").toLooseEqual("productName");
    survey.performNext();
    expect(panel.singleInputQuestion.name, "root.singleInputQuestion.name, #9").toLooseEqual("stores");
    expect(storesPanel.singleInputQuestion.name, "storesPanel.singleInputQuestion.name, #9").toLooseEqual("products");
    expect(productsMatrix.singleInputQuestion.name, "productsMatrix.singleInputQuestion.name, #9").toLooseEqual("productCount");
    expect(addBtn.visible, "addBtn visible #9").toLooseEqual(false);

    survey.performNext();
    expect(panel.singleInputQuestion.name, "root.singleInputQuestion.name, #10").toLooseEqual("stores");
    expect(storesPanel.singleInputQuestion.name, "productsMatrix.singleInputQuestion.name, #10").toLooseEqual("products");
    expect(productsMatrix.singleInputQuestion.name, "productsMatrix.singleInputQuestion.name, #10").toLooseEqual("products");

    survey.performNext();
    expect(panel.singleInputQuestion.name, "root.singleInputQuestion.name, #11").toLooseEqual("stores");
    expect(storesPanel.singleInputQuestion.name, "storesPanel.singleInputQuestion.name, #11").toLooseEqual("address");
    expect(addBtn.visible, "addBtn visible #11").toLooseEqual(false);

    survey.performNext();
    expect(panel.singleInputQuestion.name, "root.singleInputQuestion.name, #12").toLooseEqual("stores");
    expect(storesPanel.singleInputQuestion.name, "storesPanel.singleInputQuestion.name, #12").toLooseEqual("stores");
    expect(addBtn.visible, "addBtn visible #12").toLooseEqual(true);

    survey.performNext();
    expect(panel.singleInputQuestion.name, "root.singleInputQuestion.name, #13").toLooseEqual("order");
    expect(addBtn.visible, "addBtn visible #13").toLooseEqual(true);
    expect(survey.isShowPrevButton, "prev buttton, #13").toLooseEqual(false);
    expect(survey.isShowNextButton, "next buttton, #13").toLooseEqual(false);
    expect(survey.isCompleteButtonVisible, "complete buttton, #13").toLooseEqual(true);
  });
  test("singleInput & two nested elements & actions", () => {
    const survey = new SurveyModel(nestedJSON);
    const addBtn = survey.navigationBar.getActionById("sv-singleinput-add");
    const panel = survey.getQuestionByName("order");
    const check4OneActions = (num: number, isSummary: boolean = true) => {
      const postFix = ", #" + num.toString();
      expect(panel.singleInputHasActions, "singleInputHasActions" + postFix).toLooseEqual(true);
      expect(panel.singleInputActions.actions.length, "singleInputActions.length" + postFix).toLooseEqual(1);
      const orderTitle = isSummary ? "Order" : "Order #1";
      expect(panel.singleInputActions.actions[0].title, "singleInputActions[0].title" + postFix).toLooseEqual(orderTitle);
    };
    const check4TwoActions = (num: number, isSummary: boolean) => {
      const postFix = ", #" + num.toString();
      expect(panel.singleInputHasActions, "singleInputHasActions" + postFix).toLooseEqual(true);
      expect(panel.singleInputActions.actions.length, "singleInputActions.length" + postFix).toLooseEqual(2);
      expect(panel.singleInputActions.actions[0].title, "singleInputActions[0].title" + postFix).toLooseEqual("Order #1");
      const storeTitle = isSummary ? "Place to Deliver" : "Delivery #1";
      expect(panel.singleInputActions.actions[1].title, "singleInputActions[1].title" + postFix).toLooseEqual(storeTitle);
    };
    expect(panel.singleInputQuestion.name, "root.singleInputQuestion.name, #1").toLooseEqual("buyerName");
    expect(panel.hasTitle, "root.hasTitle, #1").toLooseEqual(true);
    panel.singleInputQuestion.value = "John";

    survey.performNext();
    check4OneActions(2, false);
    const storesPanel = panel.singleInputQuestion;
    expect(storesPanel.singleInputQuestion.name, "storesPanel.singleInputQuestion.name, #2.1").toLooseEqual("storeName");
    storesPanel.singleInputQuestion.value = "Store 1";
    survey.performNext();
    const productsMatrix = storesPanel.singleInputQuestion;
    expect(productsMatrix.singleInputQuestion.name, "productsMatrix.singleInputQuestion.name, #3").toLooseEqual("products");
    check4TwoActions(3, false);

    addBtn.action();
    expect(productsMatrix.singleInputQuestion.name, "productsMatrix.singleInputQuestion.name, #4").toLooseEqual("productName");
    check4TwoActions(4, false);
    productsMatrix.singleInputQuestion.value = "Product 1";

    survey.performNext();
    expect(productsMatrix.singleInputQuestion.name, "productsMatrix.singleInputQuestion.name, #5").toLooseEqual("productCount");
    check4TwoActions(5, false);
    productsMatrix.singleInputQuestion.value = 2;

    survey.performNext();
    expect(panel.singleInputQuestion.name, "root.singleInputQuestion.name, #6").toLooseEqual("stores");
    expect(storesPanel.singleInputQuestion.name, "storesPanel.singleInputQuestion.name, #6").toLooseEqual("products");
    check4TwoActions(6, false);

    survey.performNext();
    expect(panel.singleInputQuestion.name, "root.singleInputQuestion.name, #7").toLooseEqual("stores");
    expect(storesPanel.singleInputQuestion.name, "storesPanel.singleInputQuestion.name, #7").toLooseEqual("address");
    check4OneActions(7, false);

    survey.performNext();
    expect(panel.singleInputQuestion.name, "root.singleInputQuestion.name, #8").toLooseEqual("stores");
    check4OneActions(8, false);

    survey.performNext();
    expect(panel.singleInputQuestion.name, "root.singleInputQuestion.name, #9").toLooseEqual("order");
    expect(panel.singleInputActions.actions.length, "singleInputActions.length, #9").toLooseEqual(0);
    panel.singleInputSummary.items[0].btnEdit.action();
    survey.performNext();
    storesPanel.singleInputSummary.items[0].btnEdit.action();
    survey.performNext();
    productsMatrix.singleInputSummary.items[0].btnEdit.action();
    check4TwoActions(10, false);

    panel.singleInputActions.actions[1].action();
    expect(panel.singleInputQuestion.name, "root.singleInputQuestion.name, #11").toLooseEqual("stores");
    expect(storesPanel.singleInputQuestion.name, "storesPanel.singleInputQuestion.name, #11").toLooseEqual("storeName");
    check4OneActions(11, false);

    survey.performNext();
    expect(storesPanel.singleInputQuestion.name, "storesPanel.singleInputQuestion.name, #12").toLooseEqual("products");

    panel.singleInputActions.actions[0].action();
    expect(panel.singleInputQuestion.name, "root.singleInputQuestion.name, #13").toLooseEqual("buyerName");

    survey.performNext();
    expect(panel.singleInputQuestion.name, "root.singleInputQuestion.name, #14").toLooseEqual("stores");
    expect(storesPanel.singleInputQuestion.name, "storesPanel.singleInputQuestion.name, #14").toLooseEqual("storeName");
    check4OneActions(14, false);
  });
  test("singleInput & two nested elements & actions 2", () => {
    const survey = new SurveyModel({
      "questionsOnPageMode": "inputPerPage",
      "title": "Employment History (merging answers from several previous questions)",
      "pages": [
        {
          "name": "employers-page",
          "elements": [
            {
              "type": "matrixdynamic",
              "name": "employerNames",
              "title": "Please add your previous and current employers",
              "singleInputTitleTemplate": "Employee name: {row.employee-name}",
              "valueName": "employers",
              "isRequired": true,
              "showHeader": false,
              "columns": [
                {
                  "name": "employee-name",
                  "cellType": "text",
                  "isRequired": true
                }
              ],
              "minRowCount": 1,
              "rowCount": 1,
              "addRowText": "Add Employer"
            },
            {
              "type": "paneldynamic",
              "name": "employers_info",
              "title": "Details",
              "valueName": "employers",
              "templateElements": [
                {
                  "type": "panel",
                  "name": "panel_employer_address",
                  "elements": [
                    {
                      "type": "text",
                      "name": "city"
                    },
                    {
                      "type": "panel",
                      "name": "workingDate",
                      "elements": [
                        {
                          "type": "text",
                          "name": "startDate",
                          "title": "Start Date",
                          "validators": [
                            {
                              "type": "expression",
                              "expression": "getDate({panel.startDate}) < currentDate()"
                            }
                          ]
                        },
                        {
                          "type": "text",
                          "name": "endDate",
                          "title": "End Date",
                          "validators": [
                            {
                              "type": "expression",
                              "expression": "getDate({panel.endDate}) > getDate({panel.startDate})"
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ],
              "templateTitle": "Employer: {panel.employee-name}",
              "allowAddPanel": false,
              "allowRemovePanel": false
            }
          ]
        }
      ]
    });
    const matrix = survey.getQuestionByName("employerNames");
    const panelDynamic = survey.getQuestionByName("employers_info");
    const bar = survey.navigationBar;
    const addBtn = bar.getActionById("sv-singleinput-add");
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion is matrix1, #1").toLooseEqual("employerNames");
    expect(survey.isShowPrevButton, "isShowPrevButton, #1").toLooseEqual(false);
    expect(survey.isShowNextButton, "isShowNextButton, #1").toLooseEqual(true);
    expect(survey.isCompleteButtonVisible, "isCompleteButtonVisible, #1").toLooseEqual(false);
    expect(matrix.singleInputQuestion?.name, "singleInputQuestion.name, #1").toLooseEqual("employee-name");
    expect(matrix.singleInputQuestion?.getTitleLocation(), "singleInputQuestion.titlelocation, #1").toLooseEqual("hidden");
    expect(addBtn.visible, "addBtn.visible, #1").toLooseEqual(false);
    matrix.singleInputQuestion.value = "emp1";
    survey.performNext();
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion is matrix1, #2").toLooseEqual("employerNames");
    expect(matrix.singleInputSummary.items.length, "singleInputSummary.items.length, #2").toLooseEqual(1);
    expect(matrix.singleInputSummary.items[0]?.locText.renderedHtml, "summary text, #2").toLooseEqual("Employee name: emp1");
    expect(survey.isShowPrevButton, "isShowPrevButton, #2").toLooseEqual(false);
    expect(survey.isShowNextButton, "isShowNextButton, #2").toLooseEqual(true);
    expect(survey.isCompleteButtonVisible, "isCompleteButtonVisible, #2").toLooseEqual(false);
    expect(addBtn.visible, "addBtn.visible, #2").toLooseEqual(true);
    expect(addBtn.title, "addBtn.title, #2").toLooseEqual("Add Employer");
    addBtn.action();
    expect(matrix.singleInputQuestion?.name, "singleInputQuestion.name, #1").toLooseEqual("employee-name");
    matrix.singleInputQuestion.value = "emp2";
    survey.performNext();
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion is matrix1, #4").toLooseEqual("employerNames");
    expect(matrix.singleInputSummary.items.length, "singleInputSummary.items.length, #4").toLooseEqual(2);
    expect(matrix.singleInputSummary.items[1]?.locText.renderedHtml, "summary text, #4").toLooseEqual("Employee name: emp2");
    survey.performNext();
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion is matrix1, #5").toLooseEqual("employers_info");
    expect(survey.isShowPrevButton, "isShowPrevButton, #5").toLooseEqual(true);
    expect(survey.isShowNextButton, "isShowNextButton, #5").toLooseEqual(true);
    expect(survey.isCompleteButtonVisible, "isCompleteButtonVisible, #5").toLooseEqual(false);
    expect(panelDynamic.singleInputQuestion?.name, "singleInputQuestion.name, #5").toLooseEqual("city");
    let panel = panelDynamic.panels[0];
    panel.getQuestionByName("city").value = "city1";
    survey.performNext();
    expect(panelDynamic.singleInputQuestion?.name, "singleInputQuestion.name, #6").toLooseEqual("startDate");
    panel.getQuestionByName("startDate").value = "2023-01-01";
    survey.performNext();
    expect(panelDynamic.singleInputQuestion?.name, "singleInputQuestion.name, #7").toLooseEqual("endDate");
    panel.getQuestionByName("endDate").value = "2023-05-01";
    expect(panel.getQuestionByName("endDate").validate(false, false), "There is not errors, #7").toLooseEqual(true);
    survey.performNext();
    panel = panelDynamic.panels[1];
    expect(panelDynamic.singleInputQuestion?.name, "singleInputQuestion.name, #8").toLooseEqual("city");
    panel.getQuestionByName("city").value = "city2";
    survey.performNext();
    expect(panelDynamic.singleInputQuestion?.name, "singleInputQuestion.name, #9").toLooseEqual("startDate");
    panel.getQuestionByName("startDate").value = "2024-01-01";
    survey.performNext();
    expect(panelDynamic.singleInputQuestion?.name, "singleInputQuestion.name, #10").toLooseEqual("endDate");
    panel.getQuestionByName("endDate").value = "2024-03-01";
    survey.performNext();
    expect(panelDynamic.singleInputQuestion?.name, "singleInputQuestion.name, #11").toLooseEqual("employers_info");
    expect(survey.isShowPrevButton, "isShowPrevButton, #11").toLooseEqual(true);
    expect(survey.isShowNextButton, "isShowNextButton, #11").toLooseEqual(false);
    expect(survey.isCompleteButtonVisible, "isCompleteButtonVisible, #11").toLooseEqual(true);
    expect(addBtn.visible, "addBtn.visible, #11").toLooseEqual(false);
    expect(survey.data, "check survey.data").toEqualValues({
      "employers": [{
        "employee-name": "emp1",
        "city": "city1",
        "startDate": "2023-01-01",
        "endDate": "2023-05-01"
      }, {
        "employee-name": "emp2",
        "city": "city2",
        "startDate": "2024-01-01",
        "endDate": "2024-03-01"
      }] });
  });
  test("singleInput and survey.onCheckSingleInputPerPageMode event", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "multipletext", name: "mt1",
          items: [{ name: "item1" }, { name: "item2" }],
        },
        {
          type: "paneldynamic", name: "panel1",
          panelCount: 1,
          templateElements: [
            { type: "text", name: "q1" },
            { type: "text", name: "q2" }
          ]
        },
        {
          type: "paneldynamic", name: "panel2",
          panelCount: 1,
          templateElements: [
            { type: "text", name: "q1" },
            { type: "text", name: "q2" }
          ]
        }
      ],
      questionsOnPageMode: "inputPerPage",
    });
    survey.onCheckSingleInputPerPageMode.add((survey: SurveyModel, options: any) => {
      options.enabled = options.question.name !== "panel1";
    });
    const getSingleInputName = (): string => {
      return survey.currentSingleQuestion.singleInputQuestion?.name || "";
    };
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion, #1").toLooseEqual("mt1");
    let mt1 = survey.getQuestionByName("mt1");
    expect(getSingleInputName(), "singleInputQuestion.name, #1").toLooseEqual("item1");
    survey.performNext();
    expect(getSingleInputName(), "singleInputQuestion.name, #2").toLooseEqual("item2");
    survey.performNext();
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion, #2").toLooseEqual("panel1");
    expect(getSingleInputName(), "singleInputQuestion.name, #3").toLooseEqual("");
    survey.performNext();
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion, #3").toLooseEqual("panel2");
    expect(getSingleInputName(), "currentSingleQuestion, #3").toLooseEqual("q1");
    survey.performNext();
    expect(getSingleInputName(), "currentSingleQuestion, #4").toLooseEqual("q2");
  });
  test("check singleInputLocTitle reactivity, matrix", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic", name: "matrix",
          rowCount: 1,
          singleInputTitleTemplate: "value: {row.q1}",
          columns: [
            { cellType: "text", name: "q1", defaultDisplayValue: "[not set]" },
            { cellType: "text", name: "q2" }
          ]
        }
      ],
      questionsOnPageMode: "inputPerPage"
    });
    const matrix = survey.getQuestionByName("matrix");
    const locStr = matrix.singleInputLocTitle;
    let counter1 = 0;
    let counter2 = 0;
    locStr.onChanged = () => {
      counter2 ++;
    };
    locStr.onStringChanged.add((sender, options) => {
      counter1 ++;
    });
    expect(counter1, "onStringChanged, #0").toLooseEqual(0);
    expect(counter2, "onChanged, #0").toLooseEqual(0);
    expect(locStr.textOrHtml, "singleInputLocTitle, #1").toLooseEqual("value: [not set]");
    expect(counter1, "onStringChanged, #0.2").toLooseEqual(0);
    expect(counter2, "onChanged, #0.2").toLooseEqual(0);
    matrix.singleInputQuestion.value = "a";
    expect(counter1, "onStringChanged, #1").toLooseEqual(1);
    expect(counter2, "onChanged, #1").toLooseEqual(1);
    expect(matrix.singleInputLocTitle.textOrHtml, "singleInputLocTitle, #2").toLooseEqual("value: a");
  });
  test("check singleInputLocTitle reactivity, panel dynamic", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "p",
          panelCount: 1,
          templateElements: [
            {
              type: "text",
              name: "test",
              defaultDisplayValue: "[not set]"
            }
          ],
          templateTitle: "value: {panel.test}"
        }
      ],
      "questionsOnPageMode": "inputPerPage"
    });
    const panel = survey.getQuestionByName("p");
    const locStr = panel.singleInputLocTitle;
    let counter1 = 0;
    let counter2 = 0;
    locStr.onChanged = () => {
      counter2 ++;
    };
    locStr.onStringChanged.add((sender, options) => {
      counter1 ++;
    });
    expect(counter1, "onStringChanged, #0").toLooseEqual(0);
    expect(counter2, "onChanged, #0").toLooseEqual(0);
    expect(locStr.textOrHtml, "singleInputLocTitle, #1").toLooseEqual("value: [not set]");
    expect(counter1, "onStringChanged, #0.2").toLooseEqual(0);
    expect(counter2, "onChanged, #0.2").toLooseEqual(0);
    panel.singleInputQuestion.value = "a";
    expect(counter1, "onStringChanged, #1").toLooseEqual(1);
    expect(counter2, "onChanged, #1").toLooseEqual(1);
    expect(panel.singleInputLocTitle.textOrHtml, "singleInputLocTitle, #2").toLooseEqual("value: a");
    expect(counter1, "onStringChanged, #2").toLooseEqual(1);
    expect(counter2, "onChanged, #2").toLooseEqual(1);
  });
  test("check singleInputLocTitle reactivity on peformNext(), panel dynamic", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "p1",
          panelCount: 2,
          valueName: "sharedData",
          templateElements: [
            { type: "text", name: "q1" }
          ]
        },
        {
          type: "paneldynamic",
          name: "p2",
          valueName: "sharedData",
          templateElements: [
            { type: "text", name: "q2", isRequired: true }
          ],
          templateTitle: "value: {panel.q1}"
        }
      ],
      "questionsOnPageMode": "inputPerPage"
    });
    survey.currentSingleQuestion.singleInputQuestion.value = "a";
    survey.performNext();
    survey.currentSingleQuestion.singleInputQuestion.value = "b";
    survey.performNext();
    survey.performNext();

    expect(survey.currentSingleQuestion.name, "currentSingleQuestion is p2, #1").toLooseEqual("p2");
    const locStr = survey.currentSingleQuestion.singleInputLocTitle;
    expect(locStr.textOrHtml, "singleInputLocTitle, #1").toLooseEqual("value: a");
    survey.currentSingleQuestion.singleInputQuestion.value = "c";
    let counter1 = 0;
    let counter2 = 0;
    locStr.onChanged = () => {
      counter2 ++;
    };
    locStr.onStringChanged.add((sender, options) => {
      counter1 ++;
    });
    survey.performNext();
    expect(counter1, "onStringChanged, #1").toLooseEqual(1);
    expect(counter2, "onChanged, #1").toLooseEqual(1);
    expect(locStr.textOrHtml, "singleInputLocTitle, #1").toLooseEqual("value: b");
  });
  test("check singleInputTitleTemplate property visibility", () => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({
      elements: [
        {
          type: "matrixdynamic", name: "matrix",
          rowCount: 1,
          singleInputTitleTemplate: "value: {row.q1}",
          columns: [
            { cellType: "text", name: "q1", defaultDisplayValue: "[not set]" },
            { cellType: "text", name: "q2" }
          ]
        }
      ],
    });
    const prop = Serializer.findProperty("matrixdynamic", "singleInputTitleTemplate");
    const matrix = survey.getQuestionByName("matrix");
    expect(prop.visibleIf(matrix), "singleInputTitleTemplate visibleIf, #1").toLooseEqual(false);
    survey.questionsOnPageMode = "inputPerPage";
    expect(prop.visibleIf(matrix), "singleInputTitleTemplate visibleIf, #2").toLooseEqual(true);
    survey.questionsOnPageMode = "questionPerPage";
    expect(prop.visibleIf(matrix), "singleInputTitleTemplate visibleIf, #3").toLooseEqual(false);
  });
  test("ratingItem small mode", () => {
    const survey = new SurveyModel();
    survey.fromJSON({
      elements: [
        {
          type: "matrixdynamic", name: "matrix",
          rowCount: 1,
          columns: [
            { cellType: "rating", name: "q1", rateType: "stars" }
          ]
        }
      ],
      "questionsOnPageMode": "inputPerPage"
    });
    expect(survey.currentSingleQuestion.singleInputQuestion.getType()).toLooseEqual("rating");
    expect((survey.currentSingleQuestion.singleInputQuestion as QuestionRatingModel).itemSmallMode).toBeFalsy();
  });
  test("checkbox vs matrixdropdown", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "checkbox",
          name: "products",
          choices: ["form-library", "survey-creator", "dashboard", "pdf-generator"]
        },
        {
          type: "matrixdropdown",
          name: "matrix",
          rowsVisibleIf: "{products} contains {item}",
          columns: [
            {
              name: "nps",
              cellType: "rating"
            },
            {
              name: "valued-features",
              cellType: "comment"
            }
          ],
          rows: ["form-library", "survey-creator", "dashboard", "pdf-generator"],
          hideIfRowsEmpty: true
        }
      ],
      questionsOnPageMode: "inputPerPage",
    });
    const checkbox = <QuestionCheckboxModel>survey.getQuestionByName("products");
    const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("matrix");
    checkbox.value = ["form-library", "survey-creator"];
    survey.performNext();
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion is matrix, #1").toLooseEqual("matrix");
    expect(matrix.singleInputQuestion.name, "singleInputQuestion is nps, #1").toLooseEqual("nps");
    expect(matrix.singleInputLocTitle.textOrHtml, "matrix.singleInputLocTitle.textOrHtml, #1").toLooseEqual("form-library");
    survey.performPrevious();
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion is products, #2").toLooseEqual("products");
    checkbox.value = ["survey-creator", "dashboard"];
    survey.performNext();
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion is matrix, #3").toLooseEqual("matrix");
    expect(matrix.singleInputQuestion.name, "singleInputQuestion is nps, #3").toLooseEqual("nps");
    expect(matrix.singleInputLocTitle.textOrHtml, "matrix.singleInputLocTitle.textOrHtml, #3").toLooseEqual("survey-creator");
  });
  test("checkbox vs matrixdynamic", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "checkbox",
          name: "products",
          choices: ["form-library", "survey-creator", "dashboard", "pdf-generator"],
          valuePropertyName: "product_id"
        },
        {
          type: "matrixdynamic",
          name: "matrix",
          valueName: "products",
          columns: [
            {
              name: "nps",
              cellType: "rating"
            },
            {
              name: "valued-features",
              cellType: "comment"
            }
          ],
          rowCount: 0,
          singleInputTitleTemplate: "Library {row.product_id}",
          allowAddRows: false,
          allowRemoveRows: false
        }
      ],
      questionsOnPageMode: "inputPerPage",
    });
    const checkbox = <QuestionCheckboxModel>survey.getQuestionByName("products");
    const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("matrix");
    checkbox.renderedValue = ["form-library", "survey-creator"];
    survey.performNext();
    expect(matrix.visibleRows.length, "matrix.visibleRows.length, #1").toLooseEqual(2);
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion is matrix, #1").toLooseEqual("matrix");
    expect(matrix.singleInputQuestion.name, "singleInputQuestion is nps, #1").toLooseEqual("nps");
    matrix.singleInputQuestion.value = 3;
    expect(matrix.singleInputLocTitle.textOrHtml, "matrix.singleInputLocTitle.textOrHtml, #1").toLooseEqual("Library form-library");
    survey.performNext();
    expect(matrix.singleInputQuestion.name, "singleInputQuestion is nps, #2").toLooseEqual("valued-features");
    survey.performNext();
    expect(matrix.singleInputQuestion.name, "singleInputQuestion is nps, #3").toLooseEqual("nps");
    expect(matrix.singleInputQuestion.isEmpty(), "matrix.singleInputQuestion.isEmpty(), #3").toLooseEqual(true);
    expect(matrix.singleInputLocTitle.textOrHtml, "matrix.singleInputLocTitle.textOrHtml, #3").toLooseEqual("Library survey-creator");
  });
  test("checkbox vs matrixdynamic vs an invisible calculated column, Bug#9963", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "checkbox",
          name: "products",
          choices: [{ value: "form-library", text: "Form Library" }, "survey-creator", "dashboard", "pdf-generator"],
          valuePropertyName: "product_id"
        },
        {
          type: "matrixdynamic",
          name: "matrix",
          valueName: "products",
          columns: [
            {
              name: "product_id",
              cellType: "dropdown",
              visible: false,
              choicesFromQuestion: "products"
            },
            {
              name: "nps",
              cellType: "rating"
            },
            {
              name: "valued-features",
              cellType: "comment"
            }
          ],
          rowCount: 0,
          singleInputTitleTemplate: "Library {row.product_id}",
          allowAddRows: false,
          allowRemoveRows: false
        }
      ],
      questionsOnPageMode: "inputPerPage",
    });
    const checkbox = <QuestionCheckboxModel>survey.getQuestionByName("products");
    const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("matrix");
    checkbox.renderedValue = ["form-library"];
    survey.performNext();
    expect(matrix.visibleRows.length, "matrix.visibleRows.length, #1").toLooseEqual(1);
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion is matrix, #1").toLooseEqual("matrix");
    expect(matrix.singleInputQuestion.name, "singleInputQuestion is nps, #1").toLooseEqual("nps");
    expect(matrix.singleInputLocTitle.textOrHtml, "matrix.singleInputLocTitle.textOrHtml, #1").toLooseEqual("Library Form Library");
    matrix.singleInputQuestion.value = 3;
    survey.performNext();
    expect(matrix.singleInputQuestion.name, "singleInputQuestion is nps, #2").toLooseEqual("valued-features");
    survey.performPrevious();
    survey.performPrevious();
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion is matrix, #3").toLooseEqual("products");
    checkbox.renderedValue = [];
    survey.performNext();
    expect(matrix.visibleRows.length, "matrix.visibleRows.length, #4").toLooseEqual(0);
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion is matrix, #4").toLooseEqual("matrix");
    expect(matrix.singleInputQuestion.name, "singleInputQuestion is matrix, #4").toLooseEqual("matrix");
    expect(matrix.singleInputSummary?.items.length, "matrix.singleInputSummary, #4").toLooseEqual(0);
    expect(survey.isShowNextButton, "Next button is not visible, #4").toLooseEqual(false);
    expect(survey.isCompleteButtonVisible, "Complete button is visible, #4").toLooseEqual(true);
  });
  test("checkbox vs paneldynamic vs an invisible calculated question, Bug#9963", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "checkbox",
          name: "products",
          choices: [{ value: "form-library", text: "Form Library" }, "survey-creator", "dashboard", "pdf-generator"],
          valuePropertyName: "product_id"
        },
        {
          type: "paneldynamic",
          name: "panel",
          valueName: "products",
          templateElements: [
            {
              name: "product_id",
              type: "dropdown",
              visible: false,
              choicesFromQuestion: "products"
            },
            {
              name: "nps",
              type: "rating"
            },
            {
              name: "valued-features",
              type: "comment"
            }
          ],
          panelCount: 0,
          templateTitle: "Library {panel.product_id}",
          allowAddPanel: false,
          allowRemovePanel: false
        }
      ],
      questionsOnPageMode: "inputPerPage",
    });
    const checkbox = <QuestionCheckboxModel>survey.getQuestionByName("products");
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    checkbox.renderedValue = ["form-library"];
    survey.performNext();
    expect(panel.panels.length, "panel.panels.length, #1").toLooseEqual(1);
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion is matrix, #1").toLooseEqual("panel");
    expect(panel.singleInputQuestion.name, "singleInputQuestion is nps, #1").toLooseEqual("nps");
    expect(panel.singleInputLocTitle.textOrHtml, "matrix.singleInputLocTitle.textOrHtml, #1").toLooseEqual("Library Form Library");
    panel.singleInputQuestion.value = 3;
    survey.performNext();
    expect(panel.singleInputQuestion.name, "singleInputQuestion is nps, #2").toLooseEqual("valued-features");
    survey.performPrevious();
    survey.performPrevious();
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion is matrix, #3").toLooseEqual("products");
    checkbox.renderedValue = [];
    expect(panel.panels.length, "matrix.visibleRows.length, #4").toLooseEqual(0);
    survey.performNext();
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion is panel, #4").toLooseEqual("panel");
    expect(panel.singleInputQuestion.name, "singleInputQuestion is panel, #4").toLooseEqual("panel");
    expect(panel.singleInputSummary?.items.length, "panel.singleInputSummary, #4").toLooseEqual(0);
    expect(survey.isShowNextButton, "Next button is not visible, #4").toLooseEqual(false);
    expect(survey.isCompleteButtonVisible, "Complete button is visible, #4").toLooseEqual(true);
  });
  test("checkbox vs matrixdynamic: check display text, Bug#9994", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "checkbox",
          name: "products",
          choices: [{ value: "form-library", text: "Form Library" }, "survey-creator", "dashboard", "pdf-generator"],
          valuePropertyName: "product_id"
        },
        {
          type: "matrixdynamic",
          name: "matrix",
          valueName: "products",
          columns: [
            {
              name: "nps",
              cellType: "rating"
            },
            {
              name: "valued-features",
              cellType: "comment"
            }
          ],
          rowCount: 0,
          singleInputTitleTemplate: "Library {row.product_id}",
          allowAddRows: false,
          allowRemoveRows: false
        }
      ],
      questionsOnPageMode: "inputPerPage",
    });
    const checkbox = <QuestionCheckboxModel>survey.getQuestionByName("products");
    const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("matrix");
    checkbox.renderedValue = ["form-library"];
    survey.performNext();
    expect(matrix.visibleRows.length, "matrix.visibleRows.length, #1").toLooseEqual(1);
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion is matrix, #1").toLooseEqual("matrix");
    expect(matrix.singleInputQuestion.name, "singleInputQuestion is nps, #1").toLooseEqual("nps");
    expect(matrix.singleInputLocTitle.textOrHtml, "matrix.singleInputLocTitle.textOrHtml, #1").toLooseEqual("Library Form Library");
  });
  test("checkbox vs paneldynamic: check display text, Bug#9994", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "checkbox",
          name: "products",
          choices: [{ value: "form-library", text: "Form Library" }, "survey-creator", "dashboard", "pdf-generator"],
          valuePropertyName: "product_id"
        },
        {
          type: "paneldynamic",
          name: "panel",
          valueName: "products",
          templateElements: [
            {
              name: "nps",
              type: "rating"
            },
            {
              name: "valued-features",
              type: "comment"
            }
          ],
          panelCount: 0,
          templateTitle: "Library {panel.product_id}",
          allowAddPanel: false,
          allowRemovePanel: false
        }
      ],
      questionsOnPageMode: "inputPerPage",
    });
    const checkbox = <QuestionCheckboxModel>survey.getQuestionByName("products");
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    checkbox.renderedValue = ["form-library"];
    survey.performNext();
    expect(panel.panels.length, "panel.panels.length, #1").toLooseEqual(1);
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion is matrix, #1").toLooseEqual("panel");
    expect(panel.singleInputQuestion.name, "singleInputQuestion is nps, #1").toLooseEqual("nps");
    expect(panel.singleInputLocTitle.textOrHtml, "matrix.singleInputLocTitle.textOrHtml, #1").toLooseEqual("Library Form Library");
  });
  test("matrixdropdown & locRenderingTitle, Bug#9829", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown",
          name: "matrix",
          columns: [
            {
              name: "col1"
            }
          ],
          rows: ["row1", "row2"]
        }
      ],
    });
    const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("matrix");
    expect(matrix.locRenderedTitle.textOrHtml, "locRenderedTitle, #1").toLooseEqual("matrix");
    expect(matrix["isSingleInputActive"], "isSingleInputActive, #1").toLooseEqual(false);
    survey.questionsOnPageMode = "inputPerPage";
    expect(matrix.locRenderedTitle.textOrHtml, "locRenderedTitle, #2").toLooseEqual("row1");
    expect(matrix["isSingleInputActive"], "isSingleInputActive, #2").toLooseEqual(true);
    survey.questionsOnPageMode = "questionPerPage";
    expect(matrix.locRenderedTitle.textOrHtml, "locRenderedTitle, #3").toLooseEqual("matrix");
    expect(matrix["isSingleInputActive"], "isSingleInputActive, #3").toLooseEqual(false);
  });
  test("singleInput and matrix dynamic & css recalculation on error", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "matrixdynamic",
          "name": "q",
          "columns": [
            {
              "name": "column1",
              "cellType": "text",
              "isRequired": true
            }
          ],
          "rowCount": 2
        }
      ],
      questionsOnPageMode: "inputPerPage"
    });
    const singleQuestion = getSingleQuestion(survey.currentPage);
    let ok = false;
    singleQuestion.onPropertyChanged.add((_, options)=> {
      if (options.name == "cssRoot") ok = true;
    });
    survey.performNext();
    expect(ok, "cssRoot recalculated").toBeTruthy();
  });
  test("singleInput show initial record, #1", () => {
    const survey = new SurveyModel({
      "elements": [
        { "type": "text", "name": "q1" },
        {
          "type": "paneldynamic",
          "name": "panel",
          "bindings": {
            "panelCount": "q1"
          },
          "templateElements": [
            { "type": "text", "name": "q2" }
          ],
        }
      ],
      questionsOnPageMode: "inputPerPage"
    });
    const panel = survey.getQuestionByName("panel");
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion is q1, #1").toLooseEqual("q1");
    survey.currentSingleQuestion.value = 1;
    survey.performNext();
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion is panel, #2").toLooseEqual("panel");
    expect(panel.singleInputQuestion.name, "singleInputQuestion is q2, #2").toLooseEqual("q2");
    panel.singleInputQuestion.value = "a";
    survey.performNext();
    expect(getSingleQuestion(survey.currentPage).name, "singleInputQuestion is q2, #3").toLooseEqual("panel");
    expect(panel.singleInputSummary?.items.length, "panel.singleInputSummary, #3").toLooseEqual(1);
    survey.performPrevious();
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion is q1, #4").toLooseEqual("q1");
    survey.currentSingleQuestion.value = 2;
    survey.performNext();
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion is panel, #5").toLooseEqual("panel");
    expect(panel.singleInputQuestion.name, "singleInputQuestion is q2, #5").toLooseEqual("q2");
    expect(panel.singleInputQuestion.isEmpty(), "singleInputQuestion is empty, #5").toLooseEqual(true);
    expect(!!panel.singleInputSummary, "panel.singleInputSummary, #5").toLooseEqual(false);
    expect(survey.isCompleteButtonVisible, "isCompleteButtonVisible, #5").toLooseEqual(false);
  });
  test("A summary view appears empty even though survey.data receives a valid response, Bug#9983", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "paneldynamic", name: "panel", templateElements: [{ type: "text", name: "q2" }, { type: "text", name: "q3" }] }
      ],
      questionsOnPageMode: "inputPerPage"
    });
    survey.data = { panel: [{ q2: "a", q3: "b" }, { q2: "c", q3: "d" }] };
    const panel = survey.getQuestionByName("panel");
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion is panel, #2").toLooseEqual("panel");
    expect(panel.singleInputQuestion.name, "currentSingleQuestion is panel, #2").toLooseEqual("panel");
    expect(panel.singleInputSummary?.items.length, "panel.singleInputSummary, #2").toLooseEqual(2);
  });
  test("singleInput show panel with data as summary page vs several pages, Bug#9984", () => {
    const survey = new SurveyModel({
      pages: [
        { elements: [{ type: "text", name: "q1" }] },
        {
          elements: [
            { type: "paneldynamic", name: "panel", templateElements: [{ type: "text", name: "q2" }, { type: "text", name: "q3" }] }
          ]
        }
      ],
      questionsOnPageMode: "inputPerPage"
    });
    survey.data = { panel: [{ q2: "a", q3: "b" }] };
    const panel = survey.getQuestionByName("panel");
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion is q1, #1").toLooseEqual("q1");
    survey.performNext();
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion is panel, #2").toLooseEqual("panel");
    expect(panel.singleInputQuestion.name, "currentSingleQuestion is panel, #2").toLooseEqual("panel");
    expect(panel.singleInputSummary?.items.length, "panel.singleInputSummary, #2").toLooseEqual(1);
  });
  test("singleInput comback to summary from edit #1, Bug#9982", () => {
    const survey = new SurveyModel({
      pages: [
        { elements: [{ type: "text", name: "q1" }] },
        {
          elements: [
            { type: "paneldynamic", name: "panel", templateElements: [{ type: "text", name: "q2" }, { type: "text", name: "q3", isRequired: true }] }
          ]
        }
      ],
      questionsOnPageMode: "inputPerPage"
    });
    survey.data = { panel: [{ q2: "a" }] };
    const panel = survey.getQuestionByName("panel");
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion is q1, #1").toLooseEqual("q1");
    survey.performNext();
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion is panel, #2").toLooseEqual("panel");
    expect(panel.singleInputQuestion.name, "currentSingleQuestion is panel, #2").toLooseEqual("q2");
    survey.performPrevious();
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion is q1, #1").toLooseEqual("q1");
    survey.performNext();
    survey.performNext();
    expect(panel.singleInputQuestion.name, "currentSingleQuestion is panel, #3").toLooseEqual("q3");
    panel.singleInputQuestion.value = "b";
    survey.performNext();
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion is panel, #4").toLooseEqual("panel");
    expect(panel.singleInputSummary?.items.length, "panel.singleInputSummary, #4").toLooseEqual(1);
    panel.singleInputSummary.items[0].btnEdit.action();
    expect(panel.singleInputQuestion.name, "currentSingleQuestion is panel, #5").toLooseEqual("q2");
    survey.performPrevious();
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion is q1, #6").toLooseEqual("panel");
    expect(panel.singleInputSummary?.items.length, "panel.singleInputSummary, #6").toLooseEqual(1);
    survey.performPrevious();
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion is q1, #7").toLooseEqual("q1");
  });
  test("singleInput comback to summary from edit #2, Bug#9982", () => {
    const survey = new SurveyModel({
      pages: [
        { elements: [{ type: "text", name: "q1" }] },
        {
          elements: [
            { type: "paneldynamic", name: "panel", templateElements: [{ type: "text", name: "q2" }, { type: "text", name: "q3" }] }
          ]
        }
      ],
      questionsOnPageMode: "inputPerPage"
    });
    survey.data = { panel: [{ q2: "a", q3: "b" }] };
    const panel = survey.getQuestionByName("panel");
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion is q1, #1").toLooseEqual("q1");
    survey.performNext();
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion is panel, #2").toLooseEqual("panel");
    expect(panel.singleInputQuestion.name, "currentSingleQuestion is panel, #2").toLooseEqual("panel");
    expect(panel.singleInputSummary?.items.length, "panel.singleInputSummary, #2").toLooseEqual(1);
    panel.singleInputSummary.items[0].btnEdit.action();
    expect(panel.singleInputQuestion.name, "currentSingleQuestion is panel, #3").toLooseEqual("q2");
    survey.performPrevious();
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion is q1, #4").toLooseEqual("panel");
    expect(panel.singleInputSummary?.items.length, "panel.singleInputSummary, #4").toLooseEqual(1);
    survey.performPrevious();
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion is q1, #5").toLooseEqual("q1");
  });
  test("singleInput comback to summary from edit vs required questions #3, Bug#9982", () => {
    const survey = new SurveyModel({
      pages: [
        { elements: [{ type: "text", name: "q1" }] },
        {
          elements: [
            { type: "paneldynamic", name: "panel", templateElements: [
              { type: "text", name: "q2", isRequired: true },
              { type: "text", name: "q3", isRequired: true }] }
          ]
        }
      ],
      questionsOnPageMode: "inputPerPage"
    });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion is q1, #1").toLooseEqual("q1");
    survey.performNext();
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion is panel, #2").toLooseEqual("panel");
    expect(panel.singleInputQuestion.name, "currentSingleQuestion is panel, #2").toLooseEqual("panel");
    expect(panel.singleInputSummary?.items.length, "panel.singleInputSummary, #2").toLooseEqual(0);
    panel.addPanel();
    expect(panel.singleInputQuestion.name, "currentSingleQuestion is panel, #3").toLooseEqual("q2");
    survey.performPrevious();
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion is q1, #4").toLooseEqual("panel");
    expect(panel.singleInputSummary?.items.length, "panel.singleInputSummary, #4").toLooseEqual(1);
    survey.performPrevious();
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion is q1, #5").toLooseEqual("q1");
  });
  test("singleInput navigattion & errors for nested matrix #4, Bug#9982", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "departments",
          title: "Departments List",
          noEntriesText: "Add new department",
          templateElements: [
            {
              type: "text",
              name: "department",
              title: "Department name",
              defaultDisplayValue: "[not set]",
              isRequired: true
            },
            {
              type: "matrixdynamic",
              name: "employees",
              noRowsText: "Add employees to the department",
              title: "Employees",
              columns: [
                {
                  name: "employee-name",
                  title: "Name",
                  cellType: "text",
                  isRequired: true,
                  defaultDisplayValue: "[not set]"
                },
                {
                  name: "employment-date",
                  title: "Employment date",
                  cellType: "text",
                  inputType: "date",
                  isRequired: true
                }
              ],
              singleInputTitleTemplate: "Employee: {row.employee-name}",
              rowCount: 0,
              addRowText: "Add Employee",
              removeRowText: "Remove Employee"
            }
          ],
          templateTitle: "Department: {panel.department}",
          panelCount: 1,
          addPanelText: "Add Department"
        },
        {
          type: "text",
          name: "q1",
          title: "Some question after departments"
        }
      ],
      questionsOnPageMode: "inputPerPage"
    });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("departments");
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion is departments, #1").toLooseEqual("departments");
    expect(panel.singleInputQuestion.name, "singleInputQuestion is department, #1").toLooseEqual("department");
    panel.singleInputQuestion.value = "HR";
    survey.performNext();
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion is department, #2").toLooseEqual("departments");
    expect(panel.singleInputQuestion.name, "singleInputQuestion is department, #2").toLooseEqual("employees");
    const matrix = <QuestionMatrixDynamicModel>panel.singleInputQuestion;
    expect(matrix.singleInputQuestion.name, "singleInputQuestion is employee-name, #2").toLooseEqual("employees");
    expect(matrix.singleInputSummary?.items.length, "matrix.singleInputSummary, #2").toLooseEqual(0);
    matrix.addRow();
    expect(matrix.singleInputQuestion.name, "singleInputQuestion is employee-name, #3").toLooseEqual("employee-name");
    survey.performPrevious();
    expect(matrix.singleInputQuestion.name, "currentSingleQuestion is departments, #4").toLooseEqual("employees");
    expect(matrix.singleInputSummary?.items.length, "matrix.singleInputSummary, #4").toLooseEqual(1);
    expect(survey.isCompleteButtonVisible, "isCompleteButtonVisible, #4").toLooseEqual(false);
    expect(survey.isShowNextButton, "isCompleteButtonVisible, #4").toLooseEqual(true);
    survey.performNext();
    expect(matrix.singleInputQuestion.name, "singleInputQuestion is employee-name, #5").toLooseEqual("employee-name");
    expect(matrix.singleInputQuestion.errors.length, "singleInputQuestion show errors, #5").toLooseEqual(1);
  });
  test("singleInput visibleIf in the container in dynamic panel, Bug#10360", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "paneldynamic", name: "panel", panelCount: 2, templateElements: [
          { type: "text", name: "q1", isRequired: true, defaultValue: "a" },
          { type: "panel", name: "p1", visibleIf: "{panel.q1} = 'a'",
            elements: [{ type: "text", name: "q2", isRequired: true }]
          }
        ]
        }
      ],
      questionsOnPageMode: "inputPerPage"
    });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion is panel, #1").toLooseEqual("panel");
    expect(panel.singleInputQuestion.name, "singleInputQuestion is q1, #1").toLooseEqual("q1");
    survey.performNext();
    expect(panel.singleInputQuestion.name, "singleInputQuestion is q2, #2").toLooseEqual("q2");
    survey.performPrevious();
    expect(panel.singleInputQuestion.name, "singleInputQuestion is q1, #3").toLooseEqual("q1");
    expect(panel.panels[0].getElementByName("p1").isVisible, "p1 is visible, #3").toLooseEqual(true);
    panel.singleInputQuestion.value = "b";
    expect(panel.panels[0].getElementByName("p1").isVisible, "p1 is not visible, #4").toLooseEqual(false);
    expect(panel.panels[0].getQuestionByName("q2").isVisibleInSurvey, "q2 is not visible, #4").toLooseEqual(false);
    survey.performNext();
    expect(panel.singleInputQuestion.name, "singleInputQuestion is q1, #4").toLooseEqual("q1");
    survey.performNext();
    expect(panel.singleInputQuestion.name, "singleInputQuestion is q2, #5").toLooseEqual("q2");
    panel.singleInputQuestion.value = "val1";
    survey.performNext();
    expect(panel.singleInputQuestion.name, "singleInputQuestion is panel - summary, #6").toLooseEqual("panel");
    panel.singleInputSummary?.items[1].btnEdit.action();
    expect(panel.singleInputQuestion.name, "singleInputQuestion is q1, #7").toLooseEqual("q1");
    panel.singleInputQuestion.value = "b";
    survey.performNext();
    expect(panel.singleInputQuestion.name, "singleInputQuestion is panel, #8").toLooseEqual("panel");
    panel.singleInputSummary?.items[1].btnEdit.action();
    expect(panel.singleInputQuestion.name, "singleInputQuestion is q1, #9").toLooseEqual("q1");
    panel.singleInputQuestion.value = "a";
    survey.performNext();
    expect(panel.singleInputQuestion.name, "singleInputQuestion is q2, #10").toLooseEqual("q2");
  });

  // Skipped: pending product spec - singleInput breadcrumb navigation for 3-level dynamic panels (must include summaries). Test body is also incomplete (`topPanel.value =` has no RHS) and needs to be authored once the spec lands.
  test.skip("singleInput bradscrum navigation for 3 level dynamic panels", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "topLevel",
          templateTitle: "Top Level Panel {panelIndex}",
          templateElements: [
            {
              type: "paneldynamic",
              name: "middleLevel",
              templateTitle: "Middle Level Panel {panelIndex}",
              templateElements: [
                {
                  type: "paneldynamic",
                  name: "bottomLevel",
                  templateTitle: "Bottom Level Panel {panelIndex}",
                  templateElements: [
                    {
                      type: "text",
                      name: "q1"
                    }
                  ]
                }
              ]
            }
          ],
          defaultValue: [
            { middleLevel: [{ bottomLevel: [{ q1: "aa" }] }, [{ bottomLevel: [{ q1: "ab" }] }]] },
            { middleLevel: [{ bottomLevel: [{ q1: "ba" }] }, { bottomLevel: [{ q1: "bb" }] }] }
          ]
        }
      ],
      questionsOnPageMode: "inputPerPage"
    });
    const topPanel = <QuestionPanelDynamicModel>survey.getQuestionByName("topLevel");
    topPanel.value =
  expect(survey.currentSingleQuestion.name, "currentSingleQuestion is topLevel, #1").toLooseEqual("topLevel");
    expect(topPanel.singleInputQuestion.name, "currentSingleQuestion is middleLevel, #1").toLooseEqual("topLevel");
    expect(topPanel.singleInputSummary?.items.length, "topPanel.singleInputSummary, #1").toLooseEqual(2);
    topPanel.singleInputSummary.items[1].btnEdit.action();
    expect(topPanel.singleInputQuestion.name, "currentSingleQuestion is middleLevel, #2").toLooseEqual("middleLevel");
    let middlePanel = <QuestionPanelDynamicModel>topPanel.singleInputQuestion;
    expect(middlePanel.singleInputSummary?.items.length, "middlePanel.singleInputSummary, #2").toLooseEqual(2);
    expect(topPanel.singleInputActions.actions.length, "topPanel singleInputActions length, #2").toLooseEqual(1);
    middlePanel.singleInputSummary.items[0].btnEdit.action();
    expect(middlePanel.singleInputQuestion.name, "currentSingleQuestion is bottomLevel, #3").toLooseEqual("bottomLevel");
    let bottomPanel = <QuestionPanelDynamicModel>middlePanel.singleInputQuestion;
    expect(bottomPanel.singleInputSummary?.items.length, "bottomPanel.singleInputSummary, #3").toLooseEqual(1);
    let actions = topPanel.singleInputActions.actions;
    expect(actions.length, "topPanel singleInputActions length, #3").toLooseEqual(2);
    expect(actions[0].title, "actions[0] title, #3").toLooseEqual("Panel 2");
    expect(actions[1].title, "actions[1] title, #3").toLooseEqual("Panel 1");
    actions[1].action();
    expect(topPanel.singleInputQuestion.name, "currentSingleQuestion is middleLevel, #4").toLooseEqual("middleLevel");
    middlePanel = <QuestionPanelDynamicModel>topPanel.singleInputQuestion;
    expect(middlePanel.singleInputSummary?.items.length, "middlePanel.singleInputSummary, #4").toLooseEqual(2);
    expect(topPanel.singleInputActions.actions.length, "topPanel singleInputActions length, #4").toLooseEqual(1);

    middlePanel.singleInputSummary.items[1].btnEdit.action();
    bottomPanel = <QuestionPanelDynamicModel>middlePanel.singleInputQuestion;
    expect(bottomPanel.singleInputSummary?.items.length, "bottomPanel.singleInputSummary, #3").toLooseEqual(1);
    actions = topPanel.singleInputActions.actions;
    expect(actions.length, "topPanel singleInputActions length, #3").toLooseEqual(2);
    expect(actions[0].title, "actions[0] title, #3").toLooseEqual("Panel 2");
    expect(actions[1].title, "actions[1] title, #3").toLooseEqual("Panel 2");
    actions[0].action();
  });
  test("Do not show summary page on request, Issue#10435", () => {
    const survey = new SurveyModel();
    survey.onGetLoopQuestions.add((_, opt) => {
      const question = opt.nestedQuestions;
      for (let i = question.length - 1; i >= 0; i--) {
        if (question[i] === opt.question) {
          question.splice(i, 1);
        }
      }
    });
    survey.fromJSON({
      elements: [
        { type: "paneldynamic", name: "panel", panelCount: 1, templateElements: [
          { type: "text", name: "q1" },
          { type: "text", name: "q2" }]
        },
        { type: "text", name: "q3" }
      ],
      questionsOnPageMode: "inputPerPage"
    });
    const addBtn = survey.navigationBar.getActionById("sv-singleinput-add");
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion is panel, #1").toLooseEqual("panel");
    expect(panel.singleInputQuestion.name, "singleInputQuestion is q1, #1").toLooseEqual("q1");
    expect(addBtn.visible, "addBtn.visible, #1").toLooseEqual(false);
    survey.performNext();
    expect(panel.getSingleInputAddText(), "getSingleInputAddText, #2").toLooseEqual("Add new");
    expect(panel.singleInputQuestion.name, "singleInputQuestion is q2, #2").toLooseEqual("q2");
    expect(addBtn.visible, "addBtn.visible, #2").toLooseEqual(true);
    survey.performNext();
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion is q3, #3").toLooseEqual("q3");
    expect(addBtn.visible, "addBtn.visible, #3").toLooseEqual(false);
  });
  test("Cannot read properties of undefined  with survey.data, Bug #10653", () => {
    const survey = new SurveyModel({
      questionsOnPageMode: "inputPerPage",
      pages: [
        {
          name: "page1",
          elements: [
            {
              type: "matrix",
              name: "qualities",
              title:
            "Please indicate if you agree or disagree with the following statements",
              columns: [
                {
                  value: 5,
                  text: "Strongly agree",
                },
                {
                  value: 4,
                  text: "Agree",
                },
                {
                  value: 3,
                  text: "Neutral",
                },
                {
                  value: 2,
                  text: "Disagree",
                },
                {
                  value: 1,
                  text: "Strongly disagree",
                },
              ],
              rows: [
                {
                  value: "affordable",
                  text: "Product is affordable",
                },
                {
                  value: "does-what-it-claims",
                  text: "Product does what it claims",
                },
                {
                  value: "better-than-others",
                  text: "Product is better than other products on the market",
                },
                {
                  value: "easy-to-use",
                  text: "Product is easy to use",
                },
              ],
            },
            {
              type: "rating",
              name: "satisfaction-score",
              title: "How satisfied are you with our product?",
              minRateDescription: "Not satisfied",
              maxRateDescription: "Completely satisfied",
            },
            {
              type: "rating",
              name: "recommend",
              visibleIf: "{satisfaction-score} > 3",
              title:
            "How likely are you to recommend our product to a friend or co-worker?",
              minRateDescription: "Will not recommend",
              maxRateDescription: "I will recommend",
            },
            {
              type: "comment",
              name: "suggestions",
              title: "What would make you more satisfied with our product?",
            },
          ],
        },
        {
          name: "page2",
          elements: [
            {
              type: "radiogroup",
              name: "price-comparison",
              title: "Compared to our competitors, do you feel our product is:",
              choices: [
                "Less expensive",
                "Priced about the same",
                "More expensive",
                "Not sure",
              ],
            },
            {
              type: "radiogroup",
              name: "current-price",
              title: "Do you feel our current price is merited by our product?",
              choices: [
                {
                  value: "correct",
                  text: "Yes, the price is about right",
                },
                {
                  value: "low",
                  text: "No, the price is too low for your product",
                },
                {
                  value: "high",
                  text: "No, the price is too high for your product",
                },
              ],
            },
            {
              type: "multipletext",
              name: "price-limits",
              title:
            "What is the highest and lowest price you would pay for a product like ours?",
              items: [
                {
                  name: "highest",
                  title: "Highest",
                },
                {
                  name: "lowest",
                  title: "Lowest",
                },
              ],
              itemTitleWidth: "60px",
            },
          ],
        },
        {
          name: "page3",
          elements: [
            {
              type: "text",
              name: "email",
              title:
            "Please leave your email address if you would like us to contact you.",
            },
          ],
        },
      ],
    });
    survey.setIsMobile(true);
    survey.data = {
      qualities: {
        affordable: 3,
        "does-what-it-claims": 5,
        "better-than-others": 3,
        "easy-to-use": 2,
      },
      "satisfaction-score": 4,
    };
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion is qualities, #1").toLooseEqual("qualities");
    expect(survey.currentSingleQuestion.cssClasses, "cssClasses is defined").toBeTruthy();
    const affordable = survey.currentSingleQuestion.singleInputQuestion;
    expect(affordable.name, "singleInputQuestion is affordable, #1").toLooseEqual("affordable");
    expect(affordable.cssClasses, "singleInputQuestion cssClasses is defined").toBeTruthy();
    expect(affordable.cssRoot, "singleInputQuestion cssRoot is defined").toBeTruthy();
  });
  test("singleInput and expanded/collapsed, Bug#10656", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrix", name: "matrix1",
          state: "collapsed",
          columns: ["col1", "col2", "col3", "col4"],
          rows: ["row1", "row2"]
        }
      ],
      questionsOnPageMode: "inputPerPage"
    });
    const matrix1 = survey.getQuestionByName("matrix1");
    const radio = matrix1.singleInputQuestion;
    expect(radio.name, "singleInputQuestion.name").toLooseEqual("row1");
    expect(radio.choices.length, "singleInputQuestion.choices.length").toLooseEqual(4);
    expect(matrix1.state, "matrix1.state is collapsed").toLooseEqual("collapsed");
    expect(matrix1.isExpanded, "matrix1.isExpanded is false").toLooseEqual(false);
    expect(matrix1.isCollapsed, "matrix1.isCollapsed is false").toLooseEqual(false);
    expect(matrix1.getCssTitleExpandableSvg(), "matrix1.getCssTitleExpandableSvg()").toLooseEqual(null);
    expect(radio.isExpanded, "radio.isExpanded is false").toLooseEqual(false);
    expect(radio.isCollapsed, "radio.isCollapsed is false").toLooseEqual(false);
    expect(radio.getCssTitleExpandableSvg(), "radio.getCssTitleExpandableSvg()").toLooseEqual(null);
  });
});
