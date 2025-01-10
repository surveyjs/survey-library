import { SurveyModel } from "../src/survey";
import { surveyLocalization } from "../src/surveyStrings";
import { PanelModel } from "../src/panel";
import { settings } from "../src/settings";
import { setOldTheme } from "./oldTheme";

export default QUnit.module("SurveyShowPreviewTests");

settings.autoAdvanceDelay = 0;

QUnit.test("Complete and Preview button visibility", function(assert) {
  var survey = new SurveyModel({ elements: [{ type: "text", name: "q1" }] });
  assert.equal(survey.currentPageNo, 0, "Init current page");
  assert.equal(survey.showPreviewBeforeComplete, false, "no preview");
  assert.equal(
    survey.isCompleteButtonVisible,
    true,
    "complete button: running survey, no preview"
  );
  assert.equal(
    survey.isPreviewButtonVisible,
    false,
    "preview button: running survey, no preview"
  );
  assert.equal(
    survey.isCancelPreviewButtonVisible,
    false,
    "cancel preview button: running survey, no preview"
  );
  survey.showPreviewBeforeComplete = "showAllQuestions";
  assert.equal(survey.showPreviewBeforeComplete, true, "has preview");
  assert.equal(
    survey.isCompleteButtonVisible,
    false,
    "complete button: running survey, has preview"
  );
  assert.equal(
    survey.isPreviewButtonVisible,
    true,
    "preview button: running survey, has preview"
  );
  assert.equal(
    survey.isCancelPreviewButtonVisible,
    false,
    "cancel preview button: running survey, has preview"
  );
  survey.showPreview();
  assert.equal(
    survey.isCompleteButtonVisible,
    true,
    "complete button: running survey, show preview"
  );
  assert.equal(
    survey.isPreviewButtonVisible,
    false,
    "preview button: running survey, show preview"
  );
  assert.equal(
    survey.isCancelPreviewButtonVisible,
    true,
    "cancel preview button: running survey, show preview"
  );
  survey.cancelPreview();
  assert.equal(
    survey.isCompleteButtonVisible,
    false,
    "complete button: running survey, cancel preview"
  );
  assert.equal(
    survey.isPreviewButtonVisible,
    true,
    "preview button: running survey, cancel preview"
  );
  assert.equal(
    survey.isCancelPreviewButtonVisible,
    false,
    "cancel preview button: running survey, cancel preview"
  );
});

QUnit.test(
  "showPreviewBeforeComplete = 'showAllQuestions', do not show preview if there is an error",
  function(assert) {
    var survey = new SurveyModel({
      pages: [
        { elements: [{ type: "text", name: "q1" }] },
        { elements: [{ type: "text", name: "q2", isRequired: true }] },
      ],
    });
    survey.showPreviewBeforeComplete = "showAllQuestions";
    survey.currentPageNo = 1;
    assert.equal(survey.showPreview(), false, "It should show error");
    assert.equal(
      survey.state,
      "running",
      "state is running, there is an error"
    );
    assert.equal(
      survey.getQuestionByName("q2").errors.length,
      1,
      "There is a requried error"
    );
    survey.setValue("q2", "val2");
    assert.equal(survey.showPreview(), true, "There is no errors");
    assert.equal(
      survey.getQuestionByName("q2").errors.length,
      0,
      "There is no requried error"
    );
    assert.equal(
      survey.state,
      "preview",
      "state is preview, there is no errors"
    );
  }
);

QUnit.test(
  "showPreviewBeforeComplete = 'showAllQuestions', check currentPage on showing preview",
  function(assert) {
    var survey = new SurveyModel({
      pages: [
        { elements: [{ type: "text", name: "q1" }] },
        { elements: [{ type: "text", name: "q2" }] },
      ],
    });
    survey.showPreviewBeforeComplete = "showAllQuestions";
    survey.currentPageNo = 1;
    survey.showPreview();
    assert.equal(survey.visiblePages.length, 1, "We have one page now");
    assert.equal(
      survey.visiblePages[0].getPanels().length,
      2,
      "There are two panels - one panel per page"
    );
    var question = survey.visiblePages[0].getPanels()[0].elements[0];
    assert.equal(question.name, "q1", "First panel contains first question");
    assert.equal(
      question.isReadOnly,
      true,
      "Question are read-only in preview mode"
    );
    survey.cancelPreview();
    assert.equal(survey.visiblePages.length, 2, "There are two pages");
    assert.equal(
      survey.visiblePages[0].getPanels().length,
      0,
      "There is no panel in origional page"
    );
    question = survey.visiblePages[0].elements[0];
    assert.equal(question.name, "q1", "First page contains first question");
    assert.equal(
      question.isReadOnly,
      false,
      "Question is not read-only in running mode"
    );
    assert.equal(
      survey.currentPageNo,
      1,
      "The current page number is the same, the last one"
    );
  }
);
QUnit.test(
  "showPreviewBeforeComplete = 'showAllQuestions', restore pages before onComplete",
  function(assert) {
    var survey = new SurveyModel({
      pages: [
        { elements: [{ type: "text", name: "q1" }] },
        { elements: [{ type: "text", name: "q2" }] },
      ],
    });
    survey.showPreviewBeforeComplete = "showAllQuestions";
    survey.currentPageNo = 1;
    survey.showPreview();
    survey.tryComplete();
    assert.equal(survey.visiblePages.length, 2, "We have two pages again");
    assert.equal(survey.currentPageNo, 1, "Current page is the last one");
  }
);
QUnit.test(
  "showPreviewBeforeComplete = 'showAllQuestions', and do noting onCompleting, options.allowComplete = false",
  function(assert) {
    var survey = new SurveyModel({
      pages: [
        { elements: [{ type: "text", name: "q1" }] },
        { elements: [{ type: "text", name: "q2" }] },
      ],
    });
    survey.showPreviewBeforeComplete = "showAllQuestions";
    var allowComplete = false;
    survey.onCompleting.add((sender, options) => {
      options.allowComplete = allowComplete;
    });
    survey.currentPageNo = 1;
    survey.showPreview();
    assert.equal(survey.state, "preview");
    survey.tryComplete();
    assert.equal(survey.state, "preview", "Keep showing preview");
    allowComplete = true;
    survey.tryComplete();
    assert.equal(survey.state, "completed");
  }
);

QUnit.test(
  "showPreviewBeforeComplete = 'showAllQuestions', questionsOnPageMode = 'singlePage'",
  function(assert) {
    var survey = new SurveyModel({
      pages: [
        { elements: [{ type: "text", name: "q1" }] },
        { elements: [{ type: "text", name: "q2" }] },
      ],
    });
    survey.questionsOnPageMode = "singlePage";
    survey.showPreviewBeforeComplete = "showAllQuestions";
    survey.currentPageNo = 1;
    survey.showPreview();
    survey.cancelPreview();
    assert.equal(survey.visiblePages.length, 1, "We have one page");
    assert.equal(survey.currentPage.elements.length, 2, "There are two panels");
    assert.equal(survey.getAllQuestions().length, 2, "There are two questions");
    assert.equal(
      survey.getAllQuestions()[0].isReadOnly,
      false,
      "Questions are not readonly"
    );
  }
);
QUnit.test(
  "showPreviewBeforeComplete = 'showAllQuestions', questionsOnPageMode = 'questionPerPage'",
  function(assert) {
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
    survey.showPreviewBeforeComplete = "showAllQuestions";
    survey.currentPageNo = 1;
    survey.showPreview();
    assert.equal(survey.visiblePages.length, 1, "We have one page");
    assert.equal(survey.currentPage.elements.length, 2, "There are two pages");
    assert.equal(
      survey.getAllQuestions().length,
      4,
      "There are four questions"
    );
    assert.equal(
      survey.getAllQuestions()[0].isReadOnly,
      true,
      "Questions are readonly"
    );
    survey.cancelPreview();
    assert.equal(survey.visiblePages.length, 2, "We two pages");
    assert.equal(survey.currentSingleQuestion.name, "q1", "the single question is set correctly");
    assert.equal(survey.getAllPanels().length, 0, "There is no panels");
    assert.equal(
      survey.getAllQuestions().length,
      4,
      "There are four questions"
    );
    assert.equal(
      survey.getAllQuestions()[0].isReadOnly,
      false,
      "Questions are not readonly"
    );
  }
);
QUnit.test("showPreviewBeforeComplete = 'showAnsweredQuestions' set property", function(
  assert
) {
  var survey = new SurveyModel({
    pages: [
      { elements: [{ type: "text", name: "q1" }] },
      { elements: [{ type: "text", name: "q2" }] },
    ],
  });
  survey.setValue("q2", "va1");
  survey.showPreviewBeforeComplete = "showAnsweredQuestions";
  survey.currentPageNo = 1;
  survey.showPreview();
  const panels = survey.currentPage.elements;
  assert.equal(survey.visiblePages.length, 1, "We have one page");
  assert.equal(panels.length, 2, "There are two panels");
  assert.equal(survey.getAllQuestions().length, 2, "There are two questions");
  assert.equal(panels[0].isVisible, false, "question inside is empty");
  assert.equal(survey.getAllQuestions()[0].isVisible, false, "question is empty");
  assert.equal(panels[1].isVisible, true, "question inside is not empty");
  assert.equal(survey.getAllQuestions()[1].isVisible, true, "question is not empty");
});
QUnit.test(
  "showPreviewBeforeComplete = 'showAllQuestions', edit page, #2",
  function(assert) {
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
    survey.showPreviewBeforeComplete = "showAllQuestions";
    survey.currentPageNo = 2;
    assert.equal(survey.getAllPanels().length, 1, "There is one panel");
    assert.equal(
      (<PanelModel>survey.getAllPanels()[0]).hasEditButton,
      false,
      "The panel is not editable"
    );
    assert.equal(
      (<PanelModel>survey.getAllPanels()[0]).getFooterToolbar().hasActions,
      false,
      "The panel is not editable, footerToolBar is empty"
    );
    survey.showPreview();
    assert.equal(survey.visiblePageCount, 1, "Show preview");
    assert.equal(survey.currentPage.elements.length, 3, "There are 3 pages");
    assert.equal(
      (<PanelModel>survey.currentPage.elements[0]).hasEditButton,
      true,
      "The panel is editable"
    );
    const actionContainer = (<PanelModel>survey.currentPage.elements[1]).getFooterToolbar();
    assert.equal(
      actionContainer.hasActions,
      true,
      "The panel is editable, footerToolBar is not empty"
    );
    assert.equal(
      actionContainer.getRootCss(),
      "sv-action-bar sv-action-bar--default-size-mode sv_p_footer",
      "The panel is editable, footerToolBar is not empty"
    );
    var action = actionContainer.actions[0];
    assert.equal(action.title, "Edit");
    assert.equal(action.innerCss, "sv_nav_btn sv_edit_btn");
    var panel = <PanelModel>survey.currentPage.elements[1].elements[0];
    assert.equal(panel.hasEditButton, false, "The standard panel doesn't have edit button");
    action.action();
    assert.equal(survey.state, "running", "Preview is canceled");
    assert.equal(survey.visiblePageCount, 3, "There are three visible pages");
    assert.equal(survey.currentPageNo, 1, "We are editing the second page");
  }
);
QUnit.test(
  "showPreviewBeforeComplete = 'showAllQuestions', edit page",
  function (assert) {
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
      "showPreviewBeforeComplete": "showAllQuestions"
    });
    survey.showPreviewBeforeComplete = "showAllQuestions";
    survey.currentPageNo = 0;
    assert.notOk(survey.getAllQuestions()[0].visiblePanels[0].elements[0].hasEditButton, "There is no edit button");
    survey.showPreview();

    assert.notOk(survey.getAllQuestions()[0].visiblePanels[0].elements[0].hasEditButton, "There is no edit button on preview");
  }
);
QUnit.test(
  "showPreviewBeforeComplete = 'showAnsweredQuestions', edit page",
  function(assert) {
    var survey = new SurveyModel({
      pages: [
        { name: "p1", elements: [{ type: "text", name: "q1" }] },
        { name: "p2", elements: [{ type: "text", name: "q2" }] },
        { name: "p3", elements: [{ type: "text", name: "q3" }] },
      ],
    });
    survey.showPreviewBeforeComplete = "showAnsweredQuestions";
    survey.data = { q2: "2", q3: "3" };
    survey.currentPageNo = 2;
    survey.showPreview();
    assert.equal(survey.visiblePageCount, 1, "Show preview");
    assert.equal(survey.currentPage.elements.length, 3, "There are three panels");
    (<PanelModel>survey.currentPage.elements[1]).cancelPreview();
    assert.equal(survey.state, "running", "Preview is canceled");
    assert.equal(survey.visiblePageCount, 3, "There are three visible pages");
    assert.equal(survey.currentPage.name, "p2", "We are editing the second page");
  }
);
QUnit.test("showPreviewBeforeComplete = 'showAnsweredQuestions', onCurrentPageChanging/onCurrentPageChanged, bug#6564", function(assert) {
  const survey = new SurveyModel({
    pages: [
      { name: "p1", elements: [{ type: "text", name: "q1" }] },
      { name: "p2", elements: [{ type: "text", name: "q2" }] },
      { name: "p3", elements: [{ type: "text", name: "q3" }] },
    ],
  });
  survey.showPreviewBeforeComplete = "showAnsweredQuestions";
  survey.data = { q2: "2", q3: "3" };
  survey.currentPageNo = 2;
  survey.showPreview();
  let changingCounter = 0;
  let changedCounter = 0;
  let changingIsAfterPreview = 0;
  let changedIsAfterPreview = 0;
  survey.onCurrentPageChanging.add((sender, options) => {
    changingCounter ++;
    if(options.isAfterPreview) changingIsAfterPreview ++;
  });
  survey.onCurrentPageChanged.add((sender, options) => {
    changedCounter ++;
    if(options.isAfterPreview) changedIsAfterPreview ++;
  });
  survey.cancelPreview(survey.pages[1]);
  assert.equal(changingCounter, 1, "onChanging is called one time");
  assert.equal(changedCounter, 1, "onChanging is called one time");
  assert.equal(changingIsAfterPreview, 1, "changingIsAfterPreview is called one time");
  assert.equal(changedIsAfterPreview, 1, "changedIsAfterPreview is called one time");
  survey.showPreview();
  survey.cancelPreview(survey.pages[2]);
  assert.equal(changingCounter, 2, "onChanging is called two times");
  assert.equal(changedCounter, 2, "onChanging is called two times");
  assert.equal(changingIsAfterPreview, 2, "changingIsAfterPreview is called two times");
  assert.equal(changedIsAfterPreview, 2, "changedIsAfterPreview is called two times");
  survey.showPreview();
  survey.cancelPreview(survey.pages[2]);
  assert.equal(changingCounter, 3, "onChanging is called three times");
  assert.equal(changedCounter, 3, "onChanging is called three times");
  assert.equal(changingIsAfterPreview, 3, "changingIsAfterPreview is called three times");
  assert.equal(changedIsAfterPreview, 3, "changedIsAfterPreview is called three times");
});
QUnit.test(
  "showPreviewBeforeComplete = 'showAnsweredQuestions', do not hide questions on running state",
  function(assert) {
    var survey = new SurveyModel({
      pages: [
        { elements: [{ type: "text", name: "q1" }] },
        { elements: [{ type: "text", name: "q2" }] },
        { elements: [{ type: "text", name: "q3" }] },
      ],
    });
    survey.showPreviewBeforeComplete = "showAnsweredQuestions";
    assert.equal(survey.visiblePageCount, 3, "There are 3 visible pages");
  }
);
QUnit.test(
  "showPreviewBeforeComplete = 'showAnsweredQuestions', Bug#2190",
  function(assert) {
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
    survey.showPreviewBeforeComplete = "showAnsweredQuestions";
    survey.currentPageNo = 1;
    survey.showPreview();
    (<PanelModel>survey.currentPage.elements[0]).cancelPreview();
    assert.equal(survey.currentPageNo, 0, "Go to the first page");
  }
);
QUnit.test("showPreviewBeforeComplete = 'showAllQuestions' invisible Page, Bug#2385", function(assert) {
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
    showPreviewBeforeComplete: "showAllQuestions",
  });
  survey.setValue("mybool", false);
  survey.showPreview();
  const panels = survey.currentPage.elements;
  assert.equal(panels[2].name, "page_visible_always", "It is always visible panel"
  );
  panels[2].cancelPreview();
  assert.equal(survey.currentPage.name, "page_visible_always", "Go to correct page");
});
QUnit.test("showPreviewBeforeComplete = 'showAllQuestions' onShowingPreview event",
  function(assert) {
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
      options.allowShowPreview = allowShowPreview;
    });
    survey.showPreview();
    assert.equal(survey.state, "running", "We do not allow to show preview");
    allowShowPreview = true;
    survey.showPreview();
    assert.equal(survey.state, "preview", "We allow to show preview");
  }
);
QUnit.test("showPreviewBeforeComplete = 'showAllQuestions' onShowingPreview event, use options.allow",
  function(assert) {
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
    assert.equal(survey.state, "running", "We do not allow to show preview");
    allowShowPreview = true;
    survey.showPreview();
    assert.equal(survey.state, "preview", "We allow to show preview");
  }
);

QUnit.test(
  "onShowingPreview && onServerValidateQuestions events",
  function(assert) {
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
    assert.equal(counterServer, 0, "We do not call Server validation yet");
    assert.equal(counterPreview, 0, "We do not call showing preview yet");
    survey.showPreview();
    assert.equal(survey.state, "preview", "We allow to show preview");
    assert.equal(counterServer, 1, "Server validation is called");
    assert.equal(counterPreview, 1, "Showing preview is called");
  }
);
QUnit.test(
  "showPreviewBeforeComplete = 'showAnsweredQuestions' and invisible matrix dropdown, Bug#3176",
  function(assert) {
    var survey = new SurveyModel({
      showPreviewBeforeComplete: "showAnsweredQuestions",
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
              useDisplayValuesInTitle: false,
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
    assert.equal(survey.state, "preview", "There is no errors");
  }
);
QUnit.test(
  "showPreviewBeforeComplete = 'showAnsweredQuestions' and goNextPageAutomatic, Bug#3450",
  function(assert) {
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
      "goNextPageAutomatic": true,
      "showPreviewBeforeComplete": "showAnsweredQuestions"
    });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    assert.equal(survey.currentPageNo, 0, "The first page");
    q1.onMouseDown();
    q1.value = "item1";
    assert.equal(survey.currentPageNo, 1, "The second page");
    q2.onMouseDown();
    q2.value = "item2";
    assert.equal(survey.state, "preview", "We are in preview mode");
  }
);
QUnit.test(
  "showPreviewBeforeComplete = 'showAnsweredQuestions' and all questions are empty, Bug#6497",
  function(assert) {
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
      "showPreviewBeforeComplete": "showAnsweredQuestions"
    });
    survey.nextPage();
    survey.showPreview();
    assert.equal(survey.state, "preview", "There is no errors");
    assert.equal(survey.getAllQuestions(true).length, 2, "Show all questions");
  }
);
QUnit.test("showPreviewBeforeComplete = 'showAnsweredQuestions' and all questions are empty, bug#6608",
  function(assert) {
    const survey = new SurveyModel({
      "elements": [{ "type": "text", "name": "q1", "isRequired": true }],
      "showPreviewBeforeComplete": "showAnsweredQuestions"
    });
    survey.showPreview();
    assert.equal(survey.state, "running", "There is an error");
    survey.checkErrorsMode = "onComplete";
    survey.showPreview();
    assert.equal(survey.state, "preview", "We do not check for errors");
    survey.cancelPreview();
    assert.equal(survey.state, "running", "running again");
    survey.tryComplete();
    assert.equal(survey.state, "running", "We have errors, we can't fix errors");
    survey.setValue("q1", "a");
    survey.tryComplete();
    assert.equal(survey.state, "completed", "No errors");
  }
);
QUnit.test("showPreviewBeforeComplete = 'showAnsweredQuestions' & checkErrorsMode = 'onComplete' and all questions are empty, bug#6608",
  function(assert) {
    const survey = new SurveyModel({
      "pages": [
        { "elements": [{ "type": "text", "name": "q1", "isRequired": true }] },
        { "elements": [{ "type": "text", "name": "q2" }] },
      ],
      "showPreviewBeforeComplete": "showAnsweredQuestions",
      "checkErrorsMode": "onComplete"
    });
    survey.nextPage();
    survey.showPreview();
    survey.tryComplete();
    assert.equal(survey.state, "running", "We have errors, we can't fix errors");
    survey.setValue("q1", "a");
    survey.tryComplete();
    assert.equal(survey.state, "completed", "No errors");
  }
);
