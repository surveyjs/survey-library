import { SurveyModel } from "../src/survey";
import { PanelModel } from "../src/panel";
import { settings } from "../src/settings";
import { setOldTheme } from "./oldTheme";

import { describe, test, expect } from "vitest";
describe("SurveyShowPreviewTests", () => {
  settings.autoAdvanceDelay = 0;

  test("Complete and Preview button visibility", () => {
    var survey = new SurveyModel({ elements: [{ type: "text", name: "q1" }] });
    expect(survey.currentPageNo, "Init current page").toLooseEqual(0);
    expect(survey.showPreviewBeforeComplete, "no preview").toLooseEqual(false);
    expect(survey.isCompleteButtonVisible, "complete button: running survey, no preview").toLooseEqual(true);
    expect(survey.isPreviewButtonVisible, "preview button: running survey, no preview").toLooseEqual(false);
    expect(survey.isCancelPreviewButtonVisible, "cancel preview button: running survey, no preview").toLooseEqual(false);
    survey.showPreviewBeforeComplete = true;
    expect(survey.showPreviewBeforeComplete, "has preview").toLooseEqual(true);
    expect(survey.isCompleteButtonVisible, "complete button: running survey, has preview").toLooseEqual(false);
    expect(survey.isPreviewButtonVisible, "preview button: running survey, has preview").toLooseEqual(true);
    expect(survey.isCancelPreviewButtonVisible, "cancel preview button: running survey, has preview").toLooseEqual(false);
    survey.showPreview();
    expect(survey.isCompleteButtonVisible, "complete button: running survey, show preview").toLooseEqual(true);
    expect(survey.isPreviewButtonVisible, "preview button: running survey, show preview").toLooseEqual(false);
    expect(survey.isCancelPreviewButtonVisible, "cancel preview button: running survey, show preview").toLooseEqual(true);
    survey.cancelPreview();
    expect(survey.isCompleteButtonVisible, "complete button: running survey, cancel preview").toLooseEqual(false);
    expect(survey.isPreviewButtonVisible, "preview button: running survey, cancel preview").toLooseEqual(true);
    expect(survey.isCancelPreviewButtonVisible, "cancel preview button: running survey, cancel preview").toLooseEqual(false);
  });

  test("showPreviewBeforeComplete = true, do not show preview if there is an error", () => {
    var survey = new SurveyModel({
      pages: [
        { elements: [{ type: "text", name: "q1" }] },
        { elements: [{ type: "text", name: "q2", isRequired: true }] },
      ],
    });
    survey.showPreviewBeforeComplete = true;
    survey.currentPageNo = 1;
    expect(survey.showPreview(), "It should show error").toLooseEqual(false);
    expect(survey.state, "state is running, there is an error").toLooseEqual("running");
    expect(survey.getQuestionByName("q2").errors.length, "There is a requried error").toLooseEqual(1);
    survey.setValue("q2", "val2");
    expect(survey.showPreview(), "There is no errors").toLooseEqual(true);
    expect(survey.getQuestionByName("q2").errors.length, "There is no requried error").toLooseEqual(0);
    expect(survey.state, "state is preview, there is no errors").toLooseEqual("preview");
  });

  test("showPreviewBeforeComplete = true, check currentPage on showing preview", () => {
    var survey = new SurveyModel({
      pages: [
        { elements: [{ type: "text", name: "q1" }] },
        { elements: [{ type: "text", name: "q2" }] },
      ],
    });
    survey.showPreviewBeforeComplete = true;
    survey.currentPageNo = 1;
    survey.showPreview();
    expect(survey.visiblePages.length, "We have one page now").toLooseEqual(1);
    expect(survey.visiblePages[0].getPanels().length, "There are two panels - one panel per page").toLooseEqual(2);
    var question = survey.visiblePages[0].getPanels()[0].elements[0];
    expect(question.name, "First panel contains first question").toLooseEqual("q1");
    expect(question.isReadOnly, "Question are read-only in preview mode").toLooseEqual(true);
    survey.cancelPreview();
    expect(survey.visiblePages.length, "There are two pages").toLooseEqual(2);
    expect(survey.visiblePages[0].getPanels().length, "There is no panel in origional page").toLooseEqual(0);
    question = survey.visiblePages[0].elements[0];
    expect(question.name, "First page contains first question").toLooseEqual("q1");
    expect(question.isReadOnly, "Question is not read-only in running mode").toLooseEqual(false);
    expect(survey.currentPageNo, "The current page number is the same, the last one").toLooseEqual(1);
  });
  test("showPreviewBeforeComplete = true, restore pages before onComplete", () => {
    var survey = new SurveyModel({
      pages: [
        { elements: [{ type: "text", name: "q1" }] },
        { elements: [{ type: "text", name: "q2" }] },
      ],
    });
    survey.showPreviewBeforeComplete = true;
    survey.currentPageNo = 1;
    survey.showPreview();
    survey.tryComplete();
    expect(survey.visiblePages.length, "We have two pages again").toLooseEqual(2);
    expect(survey.currentPageNo, "Current page is the last one").toLooseEqual(1);
  });
  test("showPreviewBeforeComplete = true, check onCurrentPageChanging and onCurrentPageChanged calls count", () => {
    const survey = new SurveyModel({
      pages: [
        { elements: [{ type: "text", name: "q1" }] },
        { elements: [{ type: "text", name: "q2" }] },
      ],
    });
    survey.showPreviewBeforeComplete = true;
    const calls = [0, 0];
    survey.onCurrentPageChanging.add(() => { calls[0]++; });
    survey.onCurrentPageChanged.add(() => { calls[1]++; });
    expect(calls, "There is no calls yet").toEqualValues([0, 0]);
    survey.nextPage();
    expect(calls, "must be called one time on nextPage").toEqualValues([1, 1]);
    survey.showPreview();
    expect(calls, "no extra calls on showPreview").toEqualValues([1, 1]);
    survey.tryComplete();
    expect(calls, "extra calls on tryComplete").toEqualValues([2, 2]);
  });
  test("showPreviewBeforeComplete = true, check async onCurrentPageChanging and async onCurrentPageChanged calls count", () => {
    return new Promise(function(resolve) {
      let __remaining = 3;
      const __done = function() { if (--__remaining <= 0) resolve(); };

      const done = __done;
      const survey = new SurveyModel({
        pages: [
          { elements: [{ type: "text", name: "q1" }] },
          { elements: [{ type: "text", name: "q2" }] },
        ],
      });
      survey.showPreviewBeforeComplete = true;
      const calls = [0, 0];
      survey.onCurrentPageChanging.add(async () => { calls[0]++; });
      survey.onCurrentPageChanged.add(async () => { calls[1]++; });
      expect(calls, "There is no calls yet").toEqualValues([0, 0]);
      survey.nextPage();
      setTimeout(() => {
        expect(calls, "must be called one time on nextPage").toEqualValues([1, 1]);
        done();
        survey.showPreview();
        setTimeout(() => {
          expect(calls, "no extra calls on showPreview").toEqualValues([1, 1]);
          done();
          survey.tryComplete();
          setTimeout(() => {
            expect(calls, "extra calls on tryComplete").toEqualValues([2, 2]);
            done();
          }, 100);
        }, 100);
      }, 100);
    });
  });
  test("showPreviewBeforeComplete = true, and do noting onCompleting, options.allowComplete = false", () => {
    var survey = new SurveyModel({
      pages: [
        { elements: [{ type: "text", name: "q1" }] },
        { elements: [{ type: "text", name: "q2" }] },
      ],
    });
    survey.showPreviewBeforeComplete = true;
    var allowComplete = false;
    survey.onCompleting.add((sender, options) => {
      options.allow = allowComplete;
    });
    survey.currentPageNo = 1;
    survey.showPreview();
    expect(survey.state).toLooseEqual("preview");
    expect(survey.tryComplete(), "can't complete").toLooseEqual(false);
    expect(survey.state, "Keep showing preview").toLooseEqual("preview");
    allowComplete = true;
    expect(survey.tryComplete(), "can complete").toLooseEqual(true);
    expect(survey.state).toLooseEqual("completed");
  });

  test("showPreviewBeforeComplete = true, questionsOnPageMode = 'singlePage'", () => {
    var survey = new SurveyModel({
      pages: [
        { elements: [{ type: "text", name: "q1" }] },
        { elements: [{ type: "text", name: "q2" }] },
      ],
    });
    survey.questionsOnPageMode = "singlePage";
    survey.showPreviewBeforeComplete = true;
    survey.currentPageNo = 1;
    survey.showPreview();
    survey.cancelPreview();
    expect(survey.visiblePages.length, "We have one page").toLooseEqual(1);
    expect(survey.currentPage.elements.length, "There are two panels").toLooseEqual(2);
    expect(survey.getAllQuestions().length, "There are two questions").toLooseEqual(2);
    expect(survey.getAllQuestions()[0].isReadOnly, "Questions are not readonly").toLooseEqual(false);
  });
  test("showPreviewBeforeComplete = true, questionsOnPageMode = 'questionPerPage'", () => {
    var survey = new SurveyModel({
      pages: [
        {
          elements: [
            { type: "text", name: "q1" },
            { type: "text", name: "q2" },
          ],
        },
        {
          elements: [
            { type: "text", name: "q3" },
            { type: "text", name: "q4" },
          ],
        },
      ],
    });
    survey.questionsOnPageMode = "questionPerPage";
    survey.showPreviewBeforeComplete = true;
    survey.currentPageNo = 1;
    survey.showPreview();
    expect(survey.visiblePages.length, "We have one page").toLooseEqual(1);
    expect(survey.currentPage.elements.length, "There are two pages").toLooseEqual(2);
    expect(survey.currentSingleQuestion?.name, "There is no current single question").toLooseEqual(undefined);
    expect(survey.pages[0].rows.length, "There are two rows in the first page").toLooseEqual(2);
    expect(survey.pages[1].rows.length, "There are two rows in the second page").toLooseEqual(2);
    expect(survey.getAllQuestions().length, "There are four questions").toLooseEqual(4);
    expect(survey.getAllQuestions()[0].isReadOnly, "Questions are readonly").toLooseEqual(true);
    survey.cancelPreview();
    expect(survey.visiblePages.length, "We two pages").toLooseEqual(2);
    expect(survey.currentSingleQuestion.name, "the single question is set correctly").toLooseEqual("q3");
    expect(survey.pages[1].rows.length, "There is one row only in the current page").toLooseEqual(1);
    expect(survey.getAllPanels().length, "There is no panels").toLooseEqual(0);
    expect(survey.getAllQuestions().length, "There are four questions").toLooseEqual(4);
    expect(survey.getAllQuestions()[0].isReadOnly, "Questions are not readonly").toLooseEqual(false);
  });
  test("showPreviewBeforeComplete = true set property ", () => {
    var survey = new SurveyModel({
      pages: [
        { elements: [{ type: "text", name: "q1" }] },
        { elements: [{ type: "text", name: "q2" }] },
      ],
    });
    survey.setValue("q2", "va1");
    survey.showPreviewBeforeComplete = true;
    survey.previewMode = "answeredQuestions";
    survey.currentPageNo = 1;
    survey.showPreview();
    const panels = survey.currentPage.elements;
    expect(survey.visiblePages.length, "We have one page").toLooseEqual(1);
    expect(panels.length, "There are two panels").toLooseEqual(2);
    expect(survey.getAllQuestions().length, "There are two questions").toLooseEqual(2);
    expect(panels[0].isVisible, "question inside is empty").toLooseEqual(false);
    expect(survey.getAllQuestions()[0].isVisible, "question is empty").toLooseEqual(false);
    expect(panels[1].isVisible, "question inside is not empty").toLooseEqual(true);
    expect(survey.getAllQuestions()[1].isVisible, "question is not empty").toLooseEqual(true);
  });
  test("showPreviewBeforeComplete = true, edit page, #2", () => {
    var survey = new SurveyModel({
      pages: [
        { elements: [{ type: "text", name: "q1" }] },
        {
          elements: [
            {
              type: "panel",
              name: "panel1",
              elements: [{ type: "text", name: "q2" }],
            },
          ],
        },
        { elements: [{ type: "text", name: "q3" }] },
      ],
    });
    setOldTheme(survey);
    survey.showPreviewBeforeComplete = true;
    survey.currentPageNo = 2;
    expect(survey.getAllPanels().length, "There is one panel").toLooseEqual(1);
    expect((<PanelModel>survey.getAllPanels()[0]).hasEditButton, "The panel is not editable").toLooseEqual(false);
    expect((<PanelModel>survey.getAllPanels()[0]).getFooterToolbar().hasActions, "The panel is not editable, footerToolBar is empty").toLooseEqual(false);
    survey.showPreview();
    expect(survey.visiblePageCount, "Show preview").toLooseEqual(1);
    expect(survey.currentPage.elements.length, "There are 3 pages").toLooseEqual(3);
    expect((<PanelModel>survey.currentPage.elements[0]).hasEditButton, "The panel is editable").toLooseEqual(true);
    const actionContainer = (<PanelModel>survey.currentPage.elements[1]).getFooterToolbar();
    expect(actionContainer.hasActions, "The panel is editable, footerToolBar is not empty").toLooseEqual(true);
    expect(actionContainer.getRootCss(), "The panel is editable, footerToolBar is not empty").toLooseEqual("sv-action-bar sv-action-bar--default-size-mode sv_p_footer");
    var action = actionContainer.actions[0];
    expect(action.title).toLooseEqual("Edit");
    expect(action.innerCss).toLooseEqual("sv_nav_btn sv_edit_btn");
    var panel = <PanelModel>survey.currentPage.elements[1].elements[0];
    expect(panel.hasEditButton, "The standard panel doesn't have edit button").toLooseEqual(false);
    action.action();
    expect(survey.state, "Preview is canceled").toLooseEqual("running");
    expect(survey.visiblePageCount, "There are three visible pages").toLooseEqual(3);
    expect(survey.currentPageNo, "We are editing the second page").toLooseEqual(1);
  });
  test("showPreviewBeforeComplete = true, edit page", () => {
    var survey = new SurveyModel({
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "paneldynamic",
              "name": "question1",
              "defaultValue": [
                {
                  "question2": "qwe"
                }
              ],
              "templateElements": [
                {
                  "type": "panel",
                  "name": "panel1",
                  "elements": [
                    {
                      "type": "text",
                      "name": "question2"
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      "showPreviewBeforeComplete": true
    });
    survey.showPreviewBeforeComplete = true;
    survey.currentPageNo = 0;
    expect(survey.getAllQuestions()[0].visiblePanels[0].elements[0].hasEditButton, "There is no edit button").toBeFalsy();
    survey.showPreview();

    expect(survey.getAllQuestions()[0].visiblePanels[0].elements[0].hasEditButton, "There is no edit button on preview").toBeFalsy();
  });
  test("showPreviewBeforeComplete = true, edit page", () => {
    var survey = new SurveyModel({
      pages: [
        { name: "p1", elements: [{ type: "text", name: "q1" }] },
        { name: "p2", elements: [{ type: "text", name: "q2" }] },
        { name: "p3", elements: [{ type: "text", name: "q3" }] },
      ],
    });
    survey.showPreviewBeforeComplete = true;
    survey.data = { q2: "2", q3: "3" };
    survey.currentPageNo = 2;
    survey.showPreview();
    expect(survey.visiblePageCount, "Show preview").toLooseEqual(1);
    expect(survey.currentPage.elements.length, "There are three panels").toLooseEqual(3);
    (<PanelModel>survey.currentPage.elements[1]).cancelPreview();
    expect(survey.state, "Preview is canceled").toLooseEqual("running");
    expect(survey.visiblePageCount, "There are three visible pages").toLooseEqual(3);
    expect(survey.currentPage.name, "We are editing the second page").toLooseEqual("p2");
  });
  test("showPreviewBeforeComplete = true, onCurrentPageChanging/onCurrentPageChanged, bug#6564", () => {
    const survey = new SurveyModel({
      pages: [
        { name: "p1", elements: [{ type: "text", name: "q1" }] },
        { name: "p2", elements: [{ type: "text", name: "q2" }] },
        { name: "p3", elements: [{ type: "text", name: "q3" }] },
      ],
    });
    survey.showPreviewBeforeComplete = true;
    survey.data = { q2: "2", q3: "3" };
    survey.currentPageNo = 2;
    survey.showPreview();
    let changingCounter = 0;
    let changedCounter = 0;
    let changingIsAfterPreview = 0;
    let changedIsAfterPreview = 0;
    survey.onCurrentPageChanging.add((sender, options) => {
      changingCounter ++;
      if (options.isAfterPreview) changingIsAfterPreview ++;
    });
    survey.onCurrentPageChanged.add((sender, options) => {
      changedCounter ++;
      if (options.isAfterPreview) changedIsAfterPreview ++;
    });
    survey.cancelPreview(survey.pages[1]);
    expect(changingCounter, "onChanging is called one time").toLooseEqual(1);
    expect(changedCounter, "onChanging is called one time").toLooseEqual(1);
    expect(changingIsAfterPreview, "changingIsAfterPreview is called one time").toLooseEqual(1);
    expect(changedIsAfterPreview, "changedIsAfterPreview is called one time").toLooseEqual(1);
    survey.showPreview();
    survey.cancelPreview(survey.pages[2]);
    expect(changingCounter, "onChanging is called two times").toLooseEqual(2);
    expect(changedCounter, "onChanging is called two times").toLooseEqual(2);
    expect(changingIsAfterPreview, "changingIsAfterPreview is called two times").toLooseEqual(2);
    expect(changedIsAfterPreview, "changedIsAfterPreview is called two times").toLooseEqual(2);
    survey.showPreview();
    survey.cancelPreview(survey.pages[2]);
    expect(changingCounter, "onChanging is called three times").toLooseEqual(3);
    expect(changedCounter, "onChanging is called three times").toLooseEqual(3);
    expect(changingIsAfterPreview, "changingIsAfterPreview is called three times").toLooseEqual(3);
    expect(changedIsAfterPreview, "changedIsAfterPreview is called three times").toLooseEqual(3);
  });
  test("showPreviewBeforeComplete = true, do not hide questions on running state", () => {
    var survey = new SurveyModel({
      pages: [
        { elements: [{ type: "text", name: "q1" }] },
        { elements: [{ type: "text", name: "q2" }] },
        { elements: [{ type: "text", name: "q3" }] },
      ],
    });
    survey.showPreviewBeforeComplete = true;
    expect(survey.visiblePageCount, "There are 3 visible pages").toLooseEqual(3);
  });
  test("showPreviewBeforeComplete = true, Bug#2190", () => {
    var survey = new SurveyModel({
      pages: [
        {
          elements: [
            { type: "text", name: "question1", defaultValue: "A" },
            { type: "text", name: "question2" },
          ],
        },
        {
          elements: [
            { type: "text", name: "question3", defaultValue: "B" },
            { type: "text", name: "question4" },
            { type: "text", name: "question5" },
          ],
        },
      ],
    });
    survey.showPreviewBeforeComplete = true;
    survey.currentPageNo = 1;
    survey.showPreview();
    (<PanelModel>survey.currentPage.elements[0]).cancelPreview();
    expect(survey.currentPageNo, "Go to the first page").toLooseEqual(0);
  });
  test("showPreviewBeforeComplete = true invisible Page, Bug#2385", () => {
    const survey = new SurveyModel({
      pages: [
        {
          elements: [
            {
              type: "boolean",
              name: "mybool",
              isRequired: true,
            },
          ],
        },
        {
          elements: [
            {
              type: "text",
              name: "not_visible",
            },
          ],
          visibleIf: "{mybool}  = true",
        },
        {
          name: "page_visible_always",
          elements: [
            {
              type: "text",
              name: "q_visible",
            },
          ],
        },
        {
          elements: [
            {
              type: "text",
              name: "text",
            },
          ],
        },
      ],
      showPreviewBeforeComplete: true,
    });
    survey.setValue("mybool", false);
    survey.showPreview();
    const panels = survey.currentPage.elements;
    expect(panels[2].name, "It is always visible panel").toLooseEqual("page_visible_always");
    panels[2].cancelPreview();
    expect(survey.currentPage.name, "Go to correct page").toLooseEqual("page_visible_always");
  });
  test("showPreviewBeforeComplete = true onShowingPreview event", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "text",
          name: "q1",
        },
      ],
    });
    var allowShowPreview = false;
    survey.onShowingPreview.add((sender, options) => {
      options.allow = allowShowPreview;
    });
    survey.showPreview();
    expect(survey.state, "We do not allow to show preview").toLooseEqual("running");
    allowShowPreview = true;
    survey.showPreview();
    expect(survey.state, "We allow to show preview").toLooseEqual("preview");
  });
  test("showPreviewBeforeComplete = true onShowingPreview event, use options.allow", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "text",
          name: "q1",
        },
      ],
    });
    var allowShowPreview = false;
    survey.onShowingPreview.add((sender, options) => {
      options.allow = allowShowPreview;
    });
    survey.showPreview();
    expect(survey.state, "We do not allow to show preview").toLooseEqual("running");
    allowShowPreview = true;
    survey.showPreview();
    expect(survey.state, "We allow to show preview").toLooseEqual("preview");
  });

  test("onShowingPreview && onServerValidateQuestions events", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "text",
          name: "q1",
        },
      ],
    });
    let counterPreview = 0;
    let counterServer = 0;
    survey.onServerValidateQuestions.add(function (sender, options) {
      counterServer ++;
      options.complete();
    });
    survey.onShowingPreview.add((sender, options) => {
      counterPreview ++;
    });
    expect(counterServer, "We do not call Server validation yet").toLooseEqual(0);
    expect(counterPreview, "We do not call showing preview yet").toLooseEqual(0);
    survey.showPreview();
    expect(survey.state, "We allow to show preview").toLooseEqual("preview");
    expect(counterServer, "Server validation is called").toLooseEqual(1);
    expect(counterPreview, "Showing preview is called").toLooseEqual(1);
  });
  test("showPreviewBeforeComplete = true and invisible matrix dropdown, Bug#3176", () => {
    var survey = new SurveyModel({
      showPreviewBeforeComplete: true,
      previewMode: "answeredQuestions",
      pages: [
        {
          elements: [
            { type: "text", name: "question1" },
            {
              type: "html",
              name: "question4",
              html: "{question3.item1.col1}",
            },
          ],
        },
        {
          elements: [
            { type: "text", name: "question2" },
            {
              type: "matrixdropdown",
              name: "question3",
              useDisplayValuesInDynamicTexts: false,
              isRequired: true,
              defaultValue: { item1: { col1: "val1" } },
              columns: [{ cellType: "text", name: "col1" }],
              rows: ["item1"],
              visible: false,
            },
          ],
        },
      ],
    });
    survey.data = { question1: "q1", question2: "q2" };
    survey.nextPage();
    survey.showPreview();
    expect(survey.state, "There is no errors").toLooseEqual("preview");
  });
  test("showPreviewBeforeComplete = true and autoAdvanceEnabled, Bug#3450", () => {
    const survey = new SurveyModel({
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "radiogroup",
              "name": "q1",
              "choices": ["item1", "item2", "item3"]
            }
          ]
        },
        {
          "name": "page2",
          "elements": [
            {
              "type": "radiogroup",
              "name": "q2",
              "choices": ["item1", "item2", "item3"]
            }
          ]
        }
      ],
      "autoAdvanceEnabled": true,
      "showPreviewBeforeComplete": true,
      "previewMode": "answeredQuestions",
    });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    expect(survey.currentPageNo, "The first page").toLooseEqual(0);
    q1.onMouseDown();
    q1.value = "item1";
    expect(survey.currentPageNo, "The second page").toLooseEqual(1);
    q2.onMouseDown();
    q2.value = "item2";
    expect(survey.state, "We are in preview mode").toLooseEqual("preview");
  });
  test("showPreviewBeforeComplete = true and all questions are empty, Bug#6497", () => {
    const survey = new SurveyModel({
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "radiogroup",
              "name": "q1",
              "choices": ["item1", "item2", "item3"]
            }
          ]
        },
        {
          "name": "page2",
          "elements": [
            {
              "type": "radiogroup",
              "name": "q2",
              "choices": ["item1", "item2", "item3"]
            }
          ]
        }
      ],
      "showPreviewBeforeComplete": true,
      "previewMode": "answeredQuestions",
    });
    survey.nextPage();
    survey.showPreview();
    expect(survey.state, "There is no errors").toLooseEqual("preview");
    expect(survey.getAllQuestions(true).length, "Show all questions").toLooseEqual(2);
  });
  test("showPreviewBeforeComplete = true and all questions are empty, bug#6608", () => {
    const survey = new SurveyModel({
      "elements": [{ "type": "text", "name": "q1", "isRequired": true }],
      "showPreviewBeforeComplete": true,
      "previewMode": "answeredQuestions",
    });
    survey.showPreview();
    expect(survey.state, "There is an error").toLooseEqual("running");
    survey.checkErrorsMode = "onComplete";
    survey.showPreview();
    expect(survey.state, "We do not check for errors").toLooseEqual("preview");
    survey.cancelPreview();
    expect(survey.state, "running again").toLooseEqual("running");
    survey.tryComplete();
    expect(survey.state, "We have errors, we can't fix errors").toLooseEqual("running");
    survey.setValue("q1", "a");
    survey.tryComplete();
    expect(survey.state, "No errors").toLooseEqual("completed");
  });
  test("showPreviewBeforeComplete = true & checkErrorsMode = 'onComplete' and all questions are empty, bug#6608", () => {
    const survey = new SurveyModel({
      "pages": [
        { "elements": [{ "type": "text", "name": "q1", "isRequired": true }] },
        { "elements": [{ "type": "text", "name": "q2" }] },
      ],
      "showPreviewBeforeComplete": true,
      "previewMode": "answeredQuestions",
      "checkErrorsMode": "onComplete"
    });
    survey.nextPage();
    survey.showPreview();
    survey.tryComplete();
    expect(survey.state, "We have errors, we can't fix errors").toLooseEqual("running");
    survey.setValue("q1", "a");
    survey.tryComplete();
    expect(survey.state, "No errors").toLooseEqual("completed");
  });

  test("showAllQuestions - pages css after cancelPreview", () => {
    const survey = new SurveyModel({
      title: "Test",
      pages: [
        {
          name: "page1",
          title: "Q1",
          description: "Please complete the following fields",
          elements: [
            {
              type: "text",
              name: "question1",
              title: "Name of process",
            }
          ],
        },
        {
          name: "page2",
          title: "Q2",
          description: "Please complete the following fields",
          elements: [
            {
              type: "text",
              name: "question2",
              title: "Name of process",
            }
          ],
        },
      ],
      showPreviewBeforeComplete: true,
    });
    expect(survey.pages[0].cssClasses.page).toBeTruthy();
    expect(survey.pages[1].cssClasses.page).toBeTruthy();
    survey.showPreview();
    expect(survey.pages[0].cssClasses.panel).toBeTruthy();
    expect(survey.pages[1].cssClasses.panel).toBeTruthy();
    (<PanelModel>survey.currentPage.elements[0]).cancelPreview();
    expect(survey.pages[0].cssClasses.page).toBeTruthy();
    expect(survey.pages[1].cssClasses.page).toBeTruthy();
  });

  test("Add row button on showPreview", () => {
    const survey = new SurveyModel({
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "text",
              "name": "question1"
            }
          ]
        },
        {
          "name": "page2",
          "elements": [
            {
              "type": "matrixdynamic",
              "name": "question2",
              "columns": []
            }
          ]
        }
      ]
    });
    survey.showPreview();
    expect(survey.getAllQuestions()[1].renderedTable.showAddRowOnBottom, "do not show AddRow on preview (matrix rendered first time)").toBeFalsy();
    (<PanelModel>survey.currentPage.elements[0]).cancelPreview();
    expect(survey.getAllQuestions()[1].renderedTable.showAddRowOnBottom, "show AddRow on cancel preview").toBeTruthy();

    survey.getAllQuestions()[1].resetRenderedTable();
    expect(survey.getAllQuestions()[1].renderedTable.showAddRowOnBottom, "show AddRow").toBeTruthy();
    survey.showPreview();
    expect(survey.getAllQuestions()[1].renderedTable.showAddRowOnBottom, "do not show AddRow on preview (matrix has been rendered already)").toBeFalsy();
    (<PanelModel>survey.currentPage.elements[0]).cancelPreview();
    expect(survey.getAllQuestions()[1].renderedTable.showAddRowOnBottom, "show AddRow on cancel preview again").toBeTruthy();
  });

  test("Questions within hidden pages persist in a survey response, Bug#11174", () => {
    const survey = new SurveyModel({
      pages: [
        {
          name: "page1",
          elements: [
            { type: "dropdown", name: "q1", choices: ["a", "b"] }
          ]
        },
        {
          name: "page2",
          visibleIf: "{q1} = 'a'",
          elements: [
            { type: "text", name: "q2" },
            { type: "text", name: "q3" }
          ]
        },
        {
          name: "page3",
          elements: [
            { type: "text", name: "q4" }
          ]
        }
      ],
      showPreviewBeforeComplete: "showAnsweredQuestions"
    });
    survey.data = { q1: "a", q2: "val2", q3: "val3", q4: "val4" };
    expect(survey.getPageByName("page2").isVisible, "page2 is visible initially").toLooseEqual(true);
    survey.setValue("q1", "b");
    expect(survey.getPageByName("page2").isVisible, "page2 is hidden after changing q1").toLooseEqual(false);
    survey.currentPageNo = survey.pages.indexOf(survey.getPageByName("page3"));
    survey.showPreview();
    expect(survey.state, "Survey is in preview state").toLooseEqual("preview");
    survey.tryComplete();
    expect(survey.state, "Survey is completed").toLooseEqual("completed");
    expect(survey.data, "Data should not contain values from hidden page2 questions").toEqualValues({ q1: "b", q4: "val4" });
  });
});
