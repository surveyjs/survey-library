import { Base } from "../src/base";
import { SurveyElement } from "../src/survey-element";
import { SurveyModel } from "../src/survey";
import { PageModel } from "../src/page";
import { PanelModel, QuestionRowModel } from "../src/panel";
import { ElementFactory, QuestionFactory } from "../src/questionfactory";
import { Question } from "../src/question";
import { QuestionHtmlModel } from "../src/question_html";
import { QuestionImageModel } from "../src/question_image";
import {
  SurveyTriggerVisible,
  SurveyTriggerComplete,
  SurveyTriggerSetValue,
  SurveyTriggerCopyValue,
  SurveyTriggerRunExpression,
  SurveyTriggerSkip,
} from "../src/trigger";
import { surveyLocalization } from "../src/surveyStrings";
import {
  EmailValidator,
  NumericValidator,
  ExpressionValidator,
  TextValidator,
} from "../src/validator";
import { JsonObject, Serializer } from "../src/jsonobject";
import { QuestionTextModel } from "../src/question_text";
import {
  QuestionMultipleTextModel,
  MultipleTextItemModel,
} from "../src/question_multipletext";
import { QuestionMatrixModel } from "../src/question_matrix";
import { IElement, ISurveyData, LayoutElementContainer } from "../src/base-interfaces";
import { ItemValue } from "../src/itemvalue";
import { QuestionDropdownModel } from "../src/question_dropdown";
import { QuestionCheckboxModel } from "../src/question_checkbox";
import { QuestionRadiogroupModel } from "../src/question_radiogroup";
import { QuestionCommentModel } from "../src/question_comment";
import { QuestionFileModel } from "../src/question_file";
import { QuestionMatrixDropdownModel } from "../src/question_matrixdropdown";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { QuestionRatingModel } from "../src/question_rating";
import { CustomWidgetCollection } from "../src/questionCustomWidgets";
import { surveyCss } from "../src/defaultCss/defaultCss";
import { FunctionFactory } from "../src/functionsfactory";
import { QuestionExpressionModel } from "../src/question_expression";
import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";
import { QuestionImagePickerModel } from "../src/question_imagepicker";
import { HtmlConditionItem, UrlConditionItem } from "../src/expressionItems";
import { AnswerRequiredError } from "../src/error";
import { ConditionsParser } from "../src/conditionsParser";
import {
  Operand,
  Variable,
  BinaryOperand,
  Const,
} from "../src/expressions/expressions";
import { ArrayChanges } from "../src/base";
import { settings } from "../src/settings";
import { CalculatedValue } from "../src/calculatedValue";
import { LocalizableString } from "../src/localizablestring";
import { getRenderedSize, getRenderedStyleSize, increaseHeightByContent, wrapUrlForBackgroundImage } from "../src/utils/utils";
import { Helpers } from "../src/helpers";
import { defaultCss } from "../src/defaultCss/defaultCss";
import { ITheme } from "../src/themes";
import { Cover } from "../src/header";
import { DomWindowHelper } from "../src/global_variables_utils";
import { ListModel } from "../src/list";
import { _setIsTouch } from "../src/utils/devices";
import { oldDefaultTheme, setOldTheme } from "./oldTheme";
import { ConsoleWarnings } from "../src/console-warnings";
import { CustomError } from "../src/error";

export default QUnit.module("Survey");

settings.autoAdvanceDelay = 0;

function getContainerContentFunction(survey: SurveyModel) {
  return (container: LayoutElementContainer) => {
    const content = survey.getContainerContent(container);
    const result: Array<any> = [];
    content.forEach(item => {
      const resItem: any = {};
      Object.keys(item).forEach(key => {
        if (["data", "getData", "processResponsiveness"].indexOf(key) === -1) {
          resItem[key] = item[key];
        }
      });
      result.push(resItem);
    });
    return result;
  };
}

QUnit.test("set data property", function (assert) {
  var survey = new SurveyModel();
  assert.deepEqual(survey.data, {}, "there is no data");
  survey.data = { strVal: "item1", intVal: 5 };
  assert.deepEqual(
    survey.data,
    { strVal: "item1", intVal: 5 },
    "set the object"
  );
  survey.data = null;
  assert.deepEqual(survey.data, {}, "clear data");
});
QUnit.test("merge data property", function (assert) {
  var survey = new SurveyModel();
  survey.mergeData({ strVal: "item1", intVal: 5 });
  assert.deepEqual(
    survey.data,
    { strVal: "item1", intVal: 5 },
    "works as set data for empty data"
  );
  survey.mergeData({ intVal: 7, boolVal: false });
  assert.deepEqual(
    survey.data,
    { strVal: "item1", intVal: 7, boolVal: false },
    "merge the data, overrides values"
  );
  survey.mergeData(null);
  assert.deepEqual(
    survey.data,
    { strVal: "item1", intVal: 7, boolVal: false },
    "do nothing"
  );
});
QUnit.test("merge data for image question", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        type: "file",
        "name": "image",
        "showPreview": true
      }
    ]
  });
  const imageData = [
    {
      name: "maxresdefault.jpg",
      type: "image/jpeg",
      content:
        "data:image/jpeg;base64,=123test"
    }
  ];
  survey.mergeData({ image: imageData });
  const question = <QuestionImageModel>survey.getQuestionByName("image");
  assert.deepEqual(question.value, imageData, "value set correctly");
});
QUnit.test("Add two pages", function (assert) {
  var survey = new SurveyModel();
  survey.addPage(new PageModel("Page 1"));
  survey.addPage(new PageModel("Page 2"));
  assert.equal(survey.PageCount, 2, "Two pages");
});
QUnit.test("create page and make it first", function (assert) {
  var survey = new SurveyModel();
  survey.addPage(new PageModel("Page 1"));
  survey.addPage(new PageModel("Page 2"));
  var newPage = survey.createNewPage("new Page");
  survey.addPage(newPage, 0);
  assert.equal(survey.PageCount, 3, "Three pages");
  assert.equal(
    survey.pages[0].name,
    "new Page",
    "New page is inserted correctly"
  );
  survey.addNewPage("second Page", 1);
  assert.equal(survey.PageCount, 4, "Four pages");
  assert.equal(
    survey.pages[1].name,
    "second Page",
    "Second page is inserted correctly"
  );
});
QUnit.test("Current Page", function (assert) {
  var survey = new SurveyModel();
  survey.addPage(createPageWithQuestion("Page 1"));
  assert.equal(survey.currentPageNo, 0, "the first page is  current");
  survey.currentPage = null;
  assert.equal(survey.currentPageNo, 0, "can't set curent page to null");
  var sPage = createPageWithQuestion("new Page");
  survey.addPage(sPage);
  survey.currentPage = sPage;
  assert.equal(survey.currentPageNo, 1, "second page is current");
  survey.pages.pop();
  assert.equal(
    survey.currentPageNo,
    0,
    "the first page is current after removing the current one"
  );
});
QUnit.test("Set number and name into currentPage property", function (assert) {
  var survey = new SurveyModel();
  survey.addPage(createPageWithQuestion("page1"));
  survey.addPage(createPageWithQuestion("page2"));
  survey.addPage(createPageWithQuestion("page3"));
  assert.equal(survey.currentPage.name, "page1", "The current page is page1");
  survey.currentPage = 1;
  assert.equal(
    survey.currentPage.name,
    "page2",
    "The current page is page2, set by number"
  );
  survey.currentPage = 4;
  assert.equal(
    survey.currentPage.name,
    "page2",
    "The current page is still page2, set by number that doesn't exist"
  );
  survey.currentPage = "page3";
  assert.equal(
    survey.currentPage.name,
    "page3",
    "The current page is page3, set by name"
  );
  survey.currentPage = "page5";
  assert.equal(
    survey.currentPage.name,
    "page3",
    "The current page is still page3, set by name that doesn't exist"
  );
});
QUnit.test("CurrentPageNo", function (assert) {
  var survey = new SurveyModel();
  survey.addPage(createPageWithQuestion("Page 1"));
  assert.equal(survey.currentPageNo, 0, "the first page is  current");
  survey.currentPageNo = -1;
  assert.equal(survey.currentPageNo, 0, "can't set curent page to -1");
  survey.currentPageNo = 1;
  assert.equal(survey.currentPageNo, 0, "can't set curent page to PageNo + 1");
  var sPage = createPageWithQuestion("new Page");
  survey.addPage(sPage);
  survey.currentPageNo = 1;
  assert.equal(survey.currentPageNo, 1, "second page is current");
  survey.pages.pop();
  assert.equal(
    survey.currentPageNo,
    0,
    "the first page is current after removing the current one"
  );
});
QUnit.test(
  "PageModel navigationTitle and navigationDescription properties",
  function (assert) {
    var page = new PageModel("Page 1");
    page.navigationTitle = "Title";
    assert.equal(
      page.locNavigationTitle.renderedHtml,
      "Title",
      "The locNavigationTitle property correspond navigationTitle"
    );
    page.navigationDescription = "Description";
    assert.equal(
      page.locNavigationDescription.renderedHtml,
      "Description",
      "The locNavigationDescription property correspond navigationDescription"
    );
  }
);
QUnit.test("PageModel.renderedNavigationTitle", function (assert) {
  const survey = new SurveyModel({
    pages: [
      { name: "page1" },
      { name: "page2", title: "Page 2" },
      { name: "page3", title: "Page 3", navigationTitle: "NavPage 3" },
      { name: "page4", navigationTitle: "NavPage 4" },
    ]
  });
  assert.equal(survey.pages[0].renderedNavigationTitle, "page1", "page1");
  assert.equal(survey.pages[1].renderedNavigationTitle, "Page 2", "page2");
  assert.equal(survey.pages[2].renderedNavigationTitle, "NavPage 3", "page3");
  assert.equal(survey.pages[3].renderedNavigationTitle, "NavPage 4", "page4");
});

QUnit.test("PageModel.renderedNavigationTitle & piped text", function (assert) {
  const survey = new SurveyModel({
    pages: [
      { name: "page1", elements: [{ type: "text", name: "q1" }] },
      { name: "page2", title: "Page 2", elements: [{ type: "text", name: "q2" }] },
      { name: "page3", title: "Page 3", navigationTitle: "NavPage 3, {q1}", elements: [{ type: "text", name: "q3" }] },
      { name: "page4", navigationTitle: "NavPage 4, {q2}", elements: [{ type: "text", name: "q4" }] },
    ]
  });
  assert.equal(survey.pages[0].renderedNavigationTitle, "page1", "page1, #1");
  assert.equal(survey.pages[1].renderedNavigationTitle, "Page 2", "page2, #1");
  assert.equal(survey.pages[2].renderedNavigationTitle, "NavPage 3, ", "page3, #1");
  assert.equal(survey.pages[3].renderedNavigationTitle, "NavPage 4, ", "page4, #1");
  survey.setValue("q1", "val1");
  survey.setValue("q2", "val2");
  assert.equal(survey.pages[0].renderedNavigationTitle, "page1", "page1, #2");
  assert.equal(survey.pages[1].renderedNavigationTitle, "Page 2", "page2, #2");
  assert.equal(survey.pages[2].renderedNavigationTitle, "NavPage 3, val1", "page3, #2");
  assert.equal(survey.pages[3].renderedNavigationTitle, "NavPage 4, val2", "page4, #2");
});

QUnit.test("Remove Page in design mode", function (assert) {
  var survey = new SurveyModel();
  survey.setDesignMode(true);
  survey.addPage(new PageModel("Page 1"));
  survey.addPage(new PageModel("Page 2"));
  assert.equal(survey.PageCount, 2, "Two pages");
  assert.equal(survey.currentPage.name, "Page 1", "the first page is  current");

  survey.removePage(survey.pages[0]);
  assert.equal(survey.PageCount, 1, "One page left");
  assert.equal(
    survey.currentPage.name,
    "Page 2",
    "the second page is  current"
  );
});
QUnit.test(
  "Do not change currentPage on re-ordering pages in design mode (remove/delete)",
  function (assert) {
    var survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.addNewPage("Page1");
    survey.addNewPage("Page2");
    survey.addNewPage("Page3");
    assert.equal(survey.PageCount, 3, "3 pages");
    assert.equal(survey.currentPage.name, "Page1", "The first page is current");
    survey.onContainsPageCallback = function () {
      return true;
    };
    var page = survey.pages[0];
    survey.pages.splice(0, 1);
    assert.equal(
      survey.currentPage.name,
      "Page1",
      "The first page is still current"
    );
    survey.pages.splice(2, 0, page);
    survey.onContainsPageCallback = null;
    assert.equal(
      survey.currentPage.name,
      "Page1",
      "The first page is still current, # 2"
    );
    assert.equal(
      survey.pages[2].name,
      "Page1",
      "The first page is becomes last in list"
    );
  }
);

QUnit.test("Survey.onValueChanged event, #352", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("page1");
  var q1 = <QuestionDropdownModel>page.addNewQuestion("dropdown", "q1");
  q1.choices = [1, 2, 3];
  q1.hasOther = true;
  var valueChangedCallCounter = 0;
  survey.onValueChanged.add(function (survey, options) {
    valueChangedCallCounter++;
  });
  assert.equal(valueChangedCallCounter, 0, "Nothing happens");
  q1.value = 1;
  assert.equal(valueChangedCallCounter, 1, "Set one value");
  q1.value = q1.otherItem.value;
  assert.equal(valueChangedCallCounter, 2, "Set other value");
  q1.comment = "new comment";
  assert.equal(valueChangedCallCounter, 3, "Set comment to other value");
});
QUnit.test("Do not show errors in display mode", function (assert) {
  var survey = new SurveyModel({
    pages: [
      { name: "p1", elements: [{ type: "html", name: "info" }] },
      { name: "p2", elements: [{ type: "text", name: "q1" }] },
      { name: "p3", elements: [{ type: "text", name: "q2" }] },
    ],
    firstPageIsStarted: true
  });
  survey.mode = "display";
  assert.equal(survey.activePage.name, "p2", "active page page is p2");
  assert.equal(survey.currentPage.name, "p2", "current page page is p2");
  assert.equal(survey.isShowPrevButton, false, "prev, first page");
  assert.equal(survey.isShowNextButton, true, "next, first page");
  assert.equal(survey.isCompleteButtonVisible, false, "complete, display mode");
  survey.nextPage();
  assert.equal(survey.activePage.name, "p3", "active page page is p3");
  assert.equal(survey.currentPage.name, "p3", "current page page is p3");
  assert.equal(survey.isShowPrevButton, true, "prev, second page");
  assert.equal(survey.isShowNextButton, false, "next, second page");
  assert.equal(survey.isCompleteButtonVisible, false, "complete, display mode");
  survey.prevPage();
  assert.equal(survey.activePage.name, "p2", "active page page is p2, #2");
  assert.equal(survey.currentPage.name, "p2", "current page page is p2, #2");
});
QUnit.test("Check page num when first page is started", function (assert) {
  var survey = new SurveyModel({
    pages: [
      { name: "p1", elements: [{ type: "html", name: "info" }] },
      { name: "p2", elements: [{ type: "text", name: "q1" }] },
      { name: "p3", elements: [{ type: "text", name: "q2" }] },
    ],
    firstPageIsStartPage: true
  });
  assert.equal(survey.pages[0].num, -1);
  assert.equal(survey.pages[0].visibleIndex, -1);
  assert.equal(survey.pages[1].num, 1);
  assert.equal(survey.pages[1].visibleIndex, 0);
  assert.equal(survey.pages[2].num, 2);
  assert.equal(survey.pages[2].visibleIndex, 1);
});

QUnit.test("Do not show errors in display mode", function (assert) {
  var survey = twoPageSimplestSurvey();
  (<Question>survey.pages[0].questions[0]).isRequired = true;
  survey.mode = "display";
  survey.nextPage();
  assert.equal(survey.currentPageNo, 1, "Can move into another page");
});
QUnit.test("Do not run triggers in display mode", function (assert) {
  const survey = new SurveyModel({
    "pages": [
      {
        "name": "page1",
        "elements": [
          {
            "type": "text",
            "name": "question1"
          },
          {
            "type": "text",
            "name": "question2"
          }
        ]
      },
      {
        "name": "page2",
        "elements": [
          {
            "type": "text",
            "name": "question3"
          }
        ]
      },
      {
        "name": "page3",
        "elements": [
          {
            "type": "text",
            "name": "question4"
          }
        ]
      }
    ],
    "triggers": [
      {
        "type": "complete",
        "expression": "{question1} = 1"
      },
      {
        "type": "setvalue",
        "expression": "{question2} = 2",
        "setToName": "question3",
        "setValue": "3"
      }
    ]
  });
  (<Question>survey.pages[0].questions[0]).isRequired = true;
  survey.data = { question1: 1 };
  survey.mode = "display";
  survey.setValue("question2", 2);
  survey.nextPage();
  assert.equal(survey.currentPageNo, 1, "Can move into another page");
  assert.equal(survey.state, "running", "survey is running");
  assert.equal(survey.getValue("question3"), undefined, "question3 value is not set");
});
QUnit.test("Do not show errors if ignoreValidation = true", function (
  assert
) {
  const survey = twoPageSimplestSurvey();
  const q1 = survey.pages[0].questions[0];
  q1.isRequired = true;
  survey.pages[1].questions[0].isRequired = true;
  assert.equal(survey.validationEnabled, true, "validationEnabled #1");
  assert.equal(survey.ignoreValidation, false, "ignoreValidation #1");
  survey.ignoreValidation = true;
  assert.equal(survey.validationEnabled, false, "validationEnabled #2");
  assert.equal(survey.ignoreValidation, true, "ignoreValidation #2");
  survey.validationEnabled = true;
  assert.equal(survey.validationEnabled, true, "validationEnabled #3");
  assert.equal(survey.ignoreValidation, false, "ignoreValidation #3");
  survey.validationEnabled = false;
  assert.equal(survey.validationEnabled, false, "validationEnabled #4");
  assert.equal(survey.ignoreValidation, true, "ignoreValidation #4");

  survey.nextPage();
  assert.equal(q1.errors.length, 0, "There is a required error");
  assert.equal(survey.currentPageNo, 1, "Can move into another page");
  survey.tryComplete();
  assert.equal(survey.state, "completed", "Can complete survey with erros");
});
QUnit.test("Show error, but allow to navigate if validationAllowSwitchPages = true and validationAllowComplete=true", function (assert) {
  const survey = new SurveyModel({
    checkErrorsMode: "onValueChanged",
    pages: [
      { elements: [{ type: "text", name: "q1", inputType: "number", max: 10 }] },
      { elements: [{ type: "text", name: "q2" }] }
    ]
  });
  survey.validationAllowSwitchPages = true;
  survey.validationAllowComplete = true;
  const q1 = survey.getQuestionByName("q1");
  q1.value = 12;
  assert.equal(q1.errors.length, 1, "There is an error");
  survey.nextPage();
  assert.equal(survey.currentPageNo, 1, "Can move into another page");
  survey.tryComplete();
  assert.equal(survey.state, "completed", "Can complete survey with erros");
});
QUnit.test("Show error, but allow to navigate if survey.validationAllowSwitchPages = true", function (assert) {
  const survey = new SurveyModel({
    checkErrorsMode: "onValueChanged",
    pages: [
      { elements: [{ type: "text", name: "q1", inputType: "number", max: 10 }] },
      { elements: [{ type: "text", name: "q2" }] }
    ]
  });
  survey.validationAllowSwitchPages = true;
  const q1 = survey.getQuestionByName("q1");
  q1.value = 12;
  assert.equal(q1.errors.length, 1, "There is an error");
  survey.nextPage();
  assert.equal(survey.currentPageNo, 1, "Can move into another page");
  survey.tryComplete();
  assert.equal(survey.currentPageNo, 0, "Move to the first page");
});
QUnit.test("Check pages state on onValueChanged event", function (assert) {
  var survey = new SurveyModel({
    pages: [
      {
        name: "page1",
        elements: [
          {
            type: "radiogroup",
            name: "question1",
            isRequired: true,
            choices: ["1", "2"],
          },
        ],
      },
      {
        name: "page2",
        elements: [
          {
            type: "html",
            name: "question2",
            html: "hello",
          },
        ],
        visibleIf: '{question1} = "2"',
      },
    ],
  });
  assert.equal(survey.currentPageNo, 0, "Init current page");
  survey.onValueChanged.add(() => {
    assert.notOk(survey.isLastPage);
  });
  assert.ok(survey.isLastPage);

  var q1 = survey.getQuestionByName("question1");
  q1.value = "2";
});
QUnit.test("Question is readOnly", function (assert) {
  var survey = twoPageSimplestSurvey();
  var q1 = <Question>(<Question>survey.pages[0].questions[0]);
  assert.equal(q1.isReadOnly, false, "check1. question is not readonly");
  q1.readOnly = true;
  assert.equal(q1.isReadOnly, true, "check2. question is  readonly now");
  q1.readOnly = false;
  survey.mode = "display";
  assert.equal(
    q1.isReadOnly,
    true,
    "check2. question is  readonly because survey in the display mode"
  );
});
QUnit.test("Do not show required error for readOnly questions", function (
  assert
) {
  var survey = twoPageSimplestSurvey();
  var page = survey.pages[0];
  var q1 = <Question>(<Question>page.questions[0]);
  q1.isRequired = true;
  assert.equal(page.hasErrors(), true, "There is a required error");
  q1.readOnly = true;
  assert.equal(
    page.hasErrors(),
    false,
    "There is no errors, the question is readOnly"
  );
});
QUnit.test("DO not change errors array on fireCallback = false", function (
  assert
) {
  var survey = twoPageSimplestSurvey();
  var page = survey.pages[0];
  var q1 = <Question>(<Question>page.questions[0]);
  q1.isRequired = true;
  assert.equal(page.hasErrors(false), true, "There is a required error");
  assert.equal(q1.errors.length, 0, "The errors array is empty");
  page.hasErrors(true);
  assert.equal(q1.errors.length, 1, "The errors array is not empty now");
});
QUnit.test("Do not show required error for value 0 and false, #345", function (
  assert
) {
  var survey = twoPageSimplestSurvey();
  var page = survey.pages[0];
  var q1 = <Question>(<Question>page.questions[0]);
  q1.isRequired = true;
  assert.equal(page.hasErrors(), true, "There is a required error");
  survey.setValue("question1", 0);
  assert.equal(q1.value, 0, "question1.value == 0");
  assert.equal(
    page.hasErrors(),
    false,
    "There is no errors, the question value is 0"
  );
  survey.setValue("question1", false);
  assert.equal(q1.value, false, "question1.value == false");
  assert.equal(
    page.hasErrors(),
    false,
    "There is no errors, the question value is false"
  );
  survey.setValue("question1", null);
  assert.equal(
    page.hasErrors(),
    true,
    "There is a required error, the question value is null"
  );
});
QUnit.test("isFirstPage/isLastPage", function (
  assert
) {
  var survey = new SurveyModel({
    pages: [
      {
        elements: [{ type: "text", name: "q1" }]
      },
      {
        elements: [{ type: "text", name: "q2" }]
      }
    ]
  });
  assert.equal(survey.currentPageNo, 0, "Init current page");
  //change currentPageNo
  assert.equal(survey.isFirstPage, true, "isFirstPage #1");
  assert.equal(survey.isLastPage, false, "isLastPage #1");
  survey.nextPage();
  assert.equal(survey.isFirstPage, false, "isFirstPage #2");
  assert.equal(survey.isLastPage, true, "isLastPage #2");
  survey.currentPageNo = 0;
  assert.equal(survey.isFirstPage, true, "isFirstPage #3");
  assert.equal(survey.isLastPage, false, "isLastPage #3");
  const page = new PageModel("newPage");
  page.addNewQuestion("text", "q3");
  survey.pages.unshift(page);
  assert.equal(survey.isFirstPage, false, "isFirstPage #4");
  assert.equal(survey.isLastPage, false, "isLastPage #4");
  survey.pages.shift();
  assert.equal(survey.pages.length, 2, "We have two pages");
  assert.equal(survey.isFirstPage, true, "isFirstPage #5");
  assert.equal(survey.isLastPage, false, "isLastPage #5");
  survey.pages[1].visible = false;
  assert.equal(survey.isFirstPage, true, "isFirstPage #6");
  assert.equal(survey.isLastPage, true, "isLastPage #6");
});
QUnit.test("isShowNext/Prev/Complete buttons and showPreviewBeforeComplete: showAllQuestions", function (
  assert
) {
  var survey = new SurveyModel({
    showPreviewBeforeComplete: "showAllQuestions",
    pages: [
      {
        elements: [{ type: "text", name: "q1" }]
      },
      {
        elements: [{ type: "text", name: "q2" }]
      }
    ]
  });
  assert.equal(survey.currentPageNo, 0, "Init current page");
  assert.equal(survey.isLastPage, false, "isLastPage #1");
  assert.equal(survey.isShowNextButton, true, "isShowNextButton #1");
  assert.equal(survey.isCompleteButtonVisible, false, "isCompleteButtonVisible #1");
  survey.nextPage();
  assert.equal(survey.isLastPage, true, "isLastPage #2");
  assert.equal(survey.isShowNextButton, false, "isShowNextButton #2");
  assert.equal(survey.isShowPrevButton, true, "isShowPrevButton #1");
  assert.equal(survey.isCompleteButtonVisible, false, "isCompleteButtonVisible #2");
  survey.showPreview();
  assert.equal(survey.isShowPrevButton, false, "isShowPrevButton #2");
  assert.equal(survey.isShowNextButton, false, "isShowNextButton #3");
  assert.equal(survey.isCompleteButtonVisible, true, "isCompleteButtonVisible #3");
  survey.mode = "display";
  assert.equal(survey.isCompleteButtonVisible, false, "isCompleteButtonVisible, read-only #4");
  survey.mode = "edit";
  assert.equal(survey.isCompleteButtonVisible, true, "isCompleteButtonVisible, edit mode #5");
});
QUnit.test("isShowPrevButton/isCompleteButtonVisible & showPrevButton/showCompleteButton", function (
  assert
) {
  const survey = new SurveyModel({
    showPrevButton: false,
    pages: [
      {
        elements: [{ type: "text", name: "q1" }]
      },
      {
        elements: [{ type: "text", name: "q2" }]
      }
    ]
  });
  survey.showCompleteButton = false;

  assert.equal(survey.currentPageNo, 0, "Init current page");
  assert.equal(survey.isShowPrevButton, false, "prev #1");
  assert.equal(survey.isCompleteButtonVisible, false, "complete #1");
  assert.equal(survey.navigationBar.getActionById("sv-nav-prev").isVisible, false, "sv-nav-prev, #1");
  assert.equal(survey.navigationBar.getActionById("sv-nav-complete").isVisible, false, "sv-nav-complete, #1");

  survey.nextPage();
  assert.equal(survey.currentPageNo, 1, "second page");
  assert.equal(survey.isShowPrevButton, false, "prev #2");
  assert.equal(survey.isCompleteButtonVisible, false, "complete #2");
  assert.equal(survey.navigationBar.getActionById("sv-nav-prev").isVisible, false, "sv-nav-prev, #2");
  assert.equal(survey.navigationBar.getActionById("sv-nav-complete").isVisible, false, "sv-nav-complete, #2");

  survey.showPrevButton = true;
  survey.showCompleteButton = true;
  assert.equal(survey.currentPageNo, 1, "second page, #2");
  assert.equal(survey.isShowPrevButton, true, "prev #3");
  assert.equal(survey.isCompleteButtonVisible, true, "complete #3");
  assert.equal(survey.navigationBar.getActionById("sv-nav-prev").isVisible, true, "sv-nav-prev, #3");
  assert.equal(survey.navigationBar.getActionById("sv-nav-complete").isVisible, true, "sv-nav-complete, #3");
});
QUnit.test("Next, Prev, IsFirst and IsLast Page and progressText", function (
  assert
) {
  surveyLocalization.defaultLocale = "en";
  surveyLocalization.currentLocale = "";
  var survey = new SurveyModel();
  assert.equal(survey.progressText, "", "there is pages");
  survey.addPage(createPageWithQuestion("Page 1"));
  survey.addPage(createPageWithQuestion("Second page", "q2"));
  survey.addPage(createPageWithQuestion("Third page", "q3"));
  assert.equal(survey.currentPageNo, 0, "Current Page is  First");
  assert.equal(survey.isFirstPage, true, "Current Page is  First");
  assert.equal(survey.isLastPage, false, "Current Page is  First");
  assert.equal(survey.progressText, "Page 1 of 3", "Current Page is  First");
  survey.nextPage();
  assert.equal(survey.currentPageNo, 1, "Current Page is  Second");
  assert.equal(survey.isFirstPage, false, "Current Page is  Second");
  assert.equal(survey.isLastPage, false, "Current Page is  Second");
  assert.equal(survey.progressText, "Page 2 of 3", "Current Page is  First");
  survey.nextPage();
  assert.equal(survey.currentPageNo, 2, "Current Page is  Third");
  assert.equal(survey.isFirstPage, false, "Current Page is  Third");
  assert.equal(survey.isLastPage, true, "Current Page is  Third");
  assert.equal(survey.progressText, "Page 3 of 3", "Current Page is  First");
  survey.prevPage();
  assert.equal(survey.currentPageNo, 1, "Current Page is  Second");
  assert.equal(survey.isFirstPage, false, "Current Page is  Second");
  assert.equal(survey.isLastPage, false, "Current Page is  Second");
  assert.equal(survey.progressText, "Page 2 of 3", "Current Page is  First");
  survey.prevPage();
  assert.equal(survey.currentPageNo, 0, "Current Page is  First");
  assert.equal(survey.isFirstPage, true, "Current Page is  First");
  assert.equal(survey.isLastPage, false, "Current Page is  First");
  assert.equal(survey.progressText, "Page 1 of 3", "Current Page is  First");
  survey.nextPage();
  assert.equal(survey.progressText, "Page 2 of 3", "Current Page is Second");
  survey.setDesignMode(true);
  survey.nextPage();
  assert.equal(survey.progressText, "Page 3 of 3", "Current Page is last");

  survey.setDesignMode(false);
  survey.currentPageNo = 0;
  survey.progressBarType = "questions";
  assert.equal(
    survey.progressText,
    "Answered 0/3 questions",
    "Questions progress indicator"
  );
  survey.getAllQuestions()[0].value = "Answer 1";
  assert.equal(
    survey.progressText,
    "Answered 1/3 questions",
    "Answered 1 question from 3"
  );
  survey.getAllQuestions()[1].visible = false;
  assert.equal(
    survey.progressText,
    "Answered 1/2 questions",
    "Make one question invisible"
  );
});
QUnit.test("progressText and onProgressText event", function (assert) {
  var survey = new SurveyModel();
  survey.addPage(createPageWithQuestion("Page 1"));
  survey.addPage(createPageWithQuestion("Second page", "q2"));
  survey.addPage(createPageWithQuestion("Third page", "q3"));
  survey.addPage(createPageWithQuestion("Forth page", "q4"));

  var questionCount = -1;
  var answeredQuestionCount = -1;

  survey.onProgressText.add((sender: SurveyModel, options: any) => {
    questionCount = options.questionCount;
    answeredQuestionCount = options.answeredQuestionCount;
    options.text =
      "Answered: " +
      (100 * options.answeredQuestionCount) / options.questionCount +
      "%";
  });
  assert.equal(survey.progressText, "Answered: 0%");
  survey.getAllQuestions()[0].value = "Answer 1";
  assert.equal(survey.progressText, "Answered: 25%");
  assert.equal(questionCount, 4, "There are 4 questions");
  assert.equal(answeredQuestionCount, 1, "One question is answered");
});
QUnit.test(
  "progressText, 'requiredQuestions' type and onProgressText event",
  function (assert) {
    var survey = new SurveyModel();
    survey.addPage(createPageWithQuestion("Page 1", "q1"));
    survey.addPage(createPageWithQuestion("Second page", "q2"));
    survey.addPage(createPageWithQuestion("Third page", "q3"));
    survey.addPage(createPageWithQuestion("Forth page", "q4"));
    survey.getQuestionByName("q1").isRequired = true;
    survey.getQuestionByName("q3").isRequired = true;
    survey.progressBarType = "requiredQuestions";
    assert.equal(survey.progressText, "Answered 0/2 questions");
    survey.setValue("q1", "1");
    assert.equal(survey.progressText, "Answered 1/2 questions");
    survey.setValue("q2", "1");
    assert.equal(
      survey.progressText,
      "Answered 1/2 questions",
      "q2 is not required"
    );
    var questionCount = -1;
    var answeredQuestionCount = -1;
    var requiredQuestionCount = -1;
    var requiredAnsweredQuestionCount = -1;

    survey.onProgressText.add((sender: SurveyModel, options: any) => {
      questionCount = options.questionCount;
      answeredQuestionCount = options.answeredQuestionCount;
      requiredQuestionCount = options.requiredQuestionCount;
      requiredAnsweredQuestionCount = options.requiredQuestionCount;
      options.text =
        "Answered: " +
        (100 * options.requiredAnsweredQuestionCount) /
        options.requiredQuestionCount +
        "%";
    });
    assert.equal(survey.progressText, "Answered: 50%");
  }
);
QUnit.test("onProgressText event and questionOrder in page, Bug#3383", function (assert) {
  var survey = new SurveyModel({
    "pages": [
      {
        name: "page1",
        "elements": [
          {
            "name": "q1",
            "type": "radiogroup",
            "choices": [1, 2, 3],
          },
        ],
      },
      {
        name: "page2",
        "elements": [
          {
            "name": "q2",
            "type": "text",
          },
          {
            "name": "q3",
            "type": "radiogroup",
            choices: [1, 2, 3],
          }
        ]
      },
      {
        name: "page3",
        "elements": [
          {
            "name": "q4",
            "choices": [1, 2, 3],
            "type": "radiogroup"
          },
          {
            "name": "q5",
            "type": "text",
          }
        ],
        "questionOrder": "random"
      }
    ],
  });
  var oldCurrentPageName: string;
  var newCurrentPageName: string;
  survey.onCurrentPageChanged.add((sender, options) => {
    oldCurrentPageName = !!options.oldCurrentPage ? options.oldCurrentPage.name : "";
    newCurrentPageName = !!options.newCurrentPage ? options.newCurrentPage.name : "";
  });
  survey.onProgressText.add(() => { var dummy = 1; });
  survey.nextPage();
  assert.equal(oldCurrentPageName, "page1", "First nextPage, old");
  assert.equal(newCurrentPageName, "page2", "First nextPage, new");
  survey.nextPage();
  assert.equal(survey.currentPageNo, 2, "We are on the last page");
  assert.equal(oldCurrentPageName, "page2", "Second nextPage, old");
  assert.equal(newCurrentPageName, "page3", "Second nextPage, new");
});

QUnit.test("progressText, 'requiredQuestions' type and design mode", function (
  assert
) {
  var survey = new SurveyModel();
  survey.setDesignMode(true);
  survey.addPage(createPageWithQuestion("Page 1", "q1"));
  survey.addPage(createPageWithQuestion("Second page", "q2"));
  survey.addPage(createPageWithQuestion("Third page", "q3"));
  survey.addPage(createPageWithQuestion("Forth page", "q4"));
  survey.getQuestionByName("q1").isRequired = true;
  survey.getQuestionByName("q3").isRequired = true;

  assert.equal(survey.progressText, "Page 1 of 4");
  survey.progressBarType = "questions";
  assert.equal(survey.progressText, "Answered 0/4 questions");
  assert.equal(survey.getProgressTypeComponent(), "sv-progress-questions", "questions component");
  survey.progressBarType = "requiredQuestions";
  assert.equal(survey.getProgressTypeComponent(), "sv-progress-requiredquestions", "requiredQuestions component");
  assert.equal(survey.progressText, "Answered 0/2 questions");
});
QUnit.test("progressText, 'questions' type, invisible cells and data", function (
  assert
) {
  var survey = new SurveyModel({
    progressBarType: "questions",
    elements: [
      { type: "matrixdynamic", name: "matrix",
        columns: [
          { cellType: "text", name: "col1" },
          { cellType: "boolean", name: "col2" },
          { cellType: "text", name: "col3", visibleIf: "{row.col2}=true" },
        ]
      }
    ]
  });
  survey.data = { matrix: [{ col1: "abc1", col2: true, col3: "edf1" }, { col1: "abc1", col2: false }] };
  assert.equal(survey.progressText, "Answered 5/5 questions", "#1");
  const matrix = survey.getQuestionByName("matrix");
  const rows = matrix.visibleRows;
  rows[1].getQuestionByName("col2").value = true;
  assert.equal(survey.progressText, "Answered 5/6 questions", "#2");
  rows[1].getQuestionByName("col3").value = "abc";
  assert.equal(survey.progressText, "Answered 6/6 questions", "#3");
});
QUnit.test("progressText, 'requiredQuestions' type and required matrix dropdown, bug#5375", function (
  assert
) {
  const survey = new SurveyModel({
    progressBarType: "requiredQuestions",
    elements: [
      { type: "text", name: "q1", isRequired: true },
      {
        type: "matrixdropdown", name: "q2", isRequired: true,
        columns: [{ name: "col1", cellType: "text" }], rows: ["row1"]
      }
    ]
  });
  assert.equal(survey.progressText, "Answered 0/2 questions");
  survey.setValue("q1", "1");
  assert.equal(survey.progressText, "Answered 1/2 questions");
  const rows = survey.getQuestionByName("q2").visibleRows;
  rows[0].cells[0].question.value = "2";
  assert.equal(survey.progressText, "Answered 2/2 questions");
});
QUnit.test(
  "survey.progressBarType = 'questions' and non input question, Bug #2108, Bug #2460",
  function (assert) {
    var survey = new SurveyModel({
      progressBarType: "questions",
      elements: [
        {
          type: "text",
          name: "q1",
        },
        {
          type: "html",
          name: "q2",
        },
        {
          type: "text",
          name: "q3",
        },
        {
          type: "expression",
          name: "q4",
        },
      ],
    });
    survey.progressBarType = "questions";
    assert.equal(survey.getProgress(), 0, "The progress is 0");
    assert.equal(survey.progressValue, 0, "The progress is 0, progressValue");
    assert.equal(
      survey.progressText,
      "Answered 0/2 questions",
      "Questions progress indicator"
    );
    survey.getQuestionByName("q1").value = "Answer 1";
    assert.equal(survey.getProgress(), 50, "The progress is 50%");
    assert.equal(
      survey.progressValue,
      50,
      "The progress is 50%, progressValue"
    );
    assert.equal(survey.progressText, "Answered 1/2 questions");
    survey.getQuestionByName("q3").value = "Answer 3";
    assert.equal(survey.getProgress(), 100, "The progress is 100%");
    assert.equal(
      survey.progressValue,
      100,
      "The progress is 100%, progressValue"
    );
    assert.equal(survey.progressText, "Answered 2/2 questions");
    //Add test cases for Bug#2460
    survey.getQuestionByName("q3").clearValue();
    assert.equal(survey.getProgress(), 50, "The progress is 50% again");
    assert.equal(
      survey.progressValue,
      50,
      "The progress is 50% again, progressValue"
    );
    survey.getQuestionByName("q3").visible = false;
    assert.equal(
      survey.getProgress(),
      100,
      "The progress is 100%, the second answer is invisible"
    );
    assert.equal(
      survey.progressValue,
      100,
      "The progress is 100%, the second answer is invisible, progressValue"
    );
  }
);
QUnit.test("survey.progressBarType = 'pages', Bug #6563",
  function (assert) {
    var survey = new SurveyModel({
      progressBarType: "pages",
      pages: [
        { elements: [{ type: "text", name: "q1" }] },
        { elements: [{ type: "text", name: "q2" }] },
        { elements: [{ type: "text", name: "q3" }] },
        { elements: [{ type: "text", name: "q1" }] },
      ]
    });
    assert.equal(survey.getProgress(), 0, "page1 #1");
    assert.equal(survey.progressValue, 0, "page1 #2");
    assert.equal(survey.progressText, "Page 1 of 4", "page1, #3");
    survey.nextPage();
    assert.equal(survey.getProgress(), 25, "page2 #1");
    assert.equal(survey.progressValue, 25, "page2 #2");
    assert.equal(survey.progressText, "Page 2 of 4", "page2, #3");
    survey.nextPage();
    assert.equal(survey.getProgress(), 50, "page3 #1");
    assert.equal(survey.progressValue, 50, "page3 #2");
    assert.equal(survey.progressText, "Page 3 of 4", "page3, #3");
    survey.nextPage();
    assert.equal(survey.getProgress(), 75, "page4 #1");
    assert.equal(survey.progressValue, 75, "page4 #2");
    assert.equal(survey.progressText, "Page 4 of 4", "page4, #3");
  }
);
QUnit.test("Next, Prev, Next", function (assert) {
  var survey = new SurveyModel();
  survey.addPage(createPageWithQuestion("Page 1"));
  survey.addPage(createPageWithQuestion("Page 2"));
  survey.addPage(createPageWithQuestion("Page 3"));
  assert.equal(survey.currentPageNo, 0, "Initial page is  first");
  survey.nextPage();
  assert.equal(
    survey.currentPageNo,
    1,
    "After next the current page is  second"
  );
  survey.prevPage();
  assert.equal(
    survey.currentPageNo,
    0,
    "After the prev the current page is again first"
  );
  survey.nextPage();
  assert.equal(
    survey.currentPageNo,
    1,
    "After second next the current page is  second"
  );
});
QUnit.test("Survey state", function (assert) {
  var survey = new SurveyModel();
  assert.equal(survey.state, "empty", "There is no a visible page");
  survey.addPage(createPageWithQuestion("Page 1"));
  survey.addPage(createPageWithQuestion("Page 2"));
  assert.equal(survey.state, "running", "Survey is in run mode");
  survey.nextPage();
  assert.equal(survey.state, "running", "Survey is in run mode");
  survey.tryComplete();
  assert.equal(survey.state, "completed", "Survey is completed");
});
QUnit.test("Question Creator", function (assert) {
  var inst = QuestionFactory.Instance;
  inst.registerQuestion("question1", (name: string) => {
    return new Question(name);
  });
  inst.registerQuestion("question2", (name: string) => {
    return new Question(name);
  });
  assert.equal(
    inst.createQuestion("question1", "Q1").name,
    "Q1",
    "Create first type of question"
  );
  assert.equal(
    inst.createQuestion("question2", "Q2").name,
    "Q2",
    "Create second type of question"
  );
  assert.equal(
    inst.createQuestion("question3", "Q3"),
    null,
    "Create unexisting type of question"
  );
});
QUnit.test("Question Creator getAllQuestions", function (assert) {
  var inst = QuestionFactory.Instance;
  inst.registerQuestion("question3", (name: string) => {
    return new Question(name);
  });
  inst.registerQuestion("question4", (name: string) => {
    return new Question(name);
  });
  var names = inst.getAllTypes();
  assert.ok(names.indexOf("question3") > -1, "contains a new type");
});
QUnit.test("Add questions to page", function (assert) {
  var page = new PageModel("Page 1");
  page.addNewQuestion("text", "Q1");
  page.addNewQuestion("checkbox", "Q2");
  assert.equal(page.questions.length, 2, "Two questions");
  assert.equal(page.questions[0].getType(), "text", "Text question");
  assert.equal(page.questions[1].getType(), "checkbox", "Checkbox question");
});
QUnit.test("Survey.getQuestionByName", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("Page 1");
  page.addNewQuestion("text", "Q1");
  page.addNewQuestion("checkbox", "Q2");
  page = survey.addNewPage("Page 1");
  page.addNewQuestion("text", "Q3");
  page.addNewQuestion("checkbox", "Q4");

  assert.equal(
    survey.getQuestionByName("Q2").name,
    "Q2",
    "find question on the first page"
  );
  assert.equal(
    survey.getQuestionByName("Q3").name,
    "Q3",
    "find question on the second page"
  );
  assert.equal(survey.getQuestionByName("Q0"), null, "return null");
});
QUnit.test("Survey.getPanelByName", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("Page1");
  var panel1 = page.addNewPanel("Panel1");
  page.addNewPanel("Panel2");
  panel1.addNewPanel("Panel1_1");
  page = survey.addNewPage("Page2");
  var panel3 = page.addNewPanel("Panel3");
  page.addNewPanel("Panel4");
  panel3.addNewPanel("Panel3_1");

  assert.equal(
    survey.getPanelByName("Panel2").name,
    "Panel2",
    "find panel on the first page"
  );
  assert.equal(
    survey.getPanelByName("panel3", true).name,
    "Panel3",
    "find question on the second page"
  );
  assert.equal(
    survey.getPanelByName("Panel1_1").name,
    "Panel1_1",
    "find child panel on the first page"
  );
  assert.equal(
    survey.getPanelByName("panel3_1", true).name,
    "Panel3_1",
    "find child question on the second page"
  );
  assert.equal(survey.getPanelByName("NoPanel"), null, "return null");
});
QUnit.test("Survey.getPageByQuestion/getPageByElement", function (assert) {
  var survey = new SurveyModel();
  var page1 = survey.addNewPage("page1");
  var page2 = survey.addNewPage("page2");
  page1.addNewQuestion("text", "q1");
  var panel1 = page1.addNewPanel("panel1");
  var q2 = panel1.addNewQuestion("text", "q2");
  var panel2 = panel1.addNewPanel("panel2");
  var q3 = panel1.addNewQuestion("text", "q3");
  var q4 = page2.addNewQuestion("text", "q4");
  assert.equal(survey.getPageByQuestion(q2).name, "page1", "q1 - page1");
  assert.equal(survey.getPageByQuestion(q3).name, "page1", "q3 - page1");
  assert.equal(survey.getPageByQuestion(q4).name, "page2", "q4 - page2");
  assert.equal(survey.getPageByElement(panel1).name, "page1", "panel1 - page1");
  assert.equal(survey.getPageByElement(panel2).name, "page1", "panel2 - page1");
});
QUnit.test("Add/remove panel", function (assert) {
  var survey = new SurveyModel();
  var page1 = survey.addNewPage("page1");
  var panel1 = page1.addNewPanel("panel1");
  var q1 = panel1.addNewQuestion("text", "q1");
  var panel2 = panel1.addNewPanel("panel2");
  var q2 = panel2.addNewQuestion("text", "q2");
  assert.equal(page1.elements.length, 1, "There is one element");
  page1.removeElement(panel1);
  assert.equal(page1.elements.length, 0, "There is no elements");
});
QUnit.test("Remove element from nested panel, #321", function (assert) {
  var survey = new SurveyModel();
  var page1 = survey.addNewPage("page1");
  var panel1 = page1.addNewPanel("panel1");
  var q1 = panel1.addNewQuestion("text", "q1");
  assert.equal(panel1.elements.length, 1, "There is one question in the panel");
  page1.removeElement(q1);
  assert.equal(panel1.elements.length, 0, "There no questions in the panel");
});
QUnit.test("Add panel with questions", function (assert) {
  var survey = new SurveyModel();
  var page1 = survey.addNewPage("page1");
  var panel1 = new PanelModel("panel1");
  var q1 = panel1.addNewQuestion("text", "q1");
  var panel2 = panel1.addNewPanel("panel2");
  var q2 = panel2.addNewQuestion("text", "q2");
  page1.addElement(panel1);
  assert.equal(
    panel1.data,
    survey,
    "The data is set correctly in the root panel"
  );
  assert.equal(
    q2.survey,
    survey,
    "The survey is set correctly in the question of the nested root"
  );
});
QUnit.test("SurveyData interface implementation", function (assert) {
  var surveyData: ISurveyData;
  surveyData = new SurveyModel();
  assert.equal(surveyData.getValue("test1"), null, "No data");
  assert.equal(surveyData.getValue("test2"), null, "No data");
  surveyData.setValue("test1", 1, false);
  surveyData.setValue("test2", "1", false);
  assert.equal(surveyData.getValue("test1"), 1, "Has value 1");
  assert.equal(surveyData.getValue("test2"), "1", "Has value '1'");
});
QUnit.test("Store question value in the survey", function (assert) {
  var survey = new SurveyModel();
  survey.addPage(new PageModel("Page 1"));
  var question = <Question>survey.pages[0].addNewQuestion("text", "question");
  assert.equal(survey.getValue("question"), null, "No value");
  assert.equal(question.value, null, "No value");

  question.value = "mytext";
  assert.equal(
    survey.getValue("question"),
    "mytext",
    "set value from question"
  );
  assert.equal(question.value, "mytext", "set value from question");

  survey.setValue("question", "myNewtext");
  assert.equal(
    survey.getValue("question"),
    "myNewtext",
    "set value from survey"
  );
  assert.equal(question.value, "myNewtext", "set value from survey");
});
QUnit.test("Store comments in the survey", function (assert) {
  var survey = new SurveyModel();
  survey.addPage(new PageModel("Page 1"));
  var question = <Question>survey.pages[0].addNewQuestion("text", "question");
  question.hasComment = true;
  assert.equal(survey.getComment("question"), "", "Comment is empty");
  assert.equal(question.comment, "", "Comment is empty");

  question.comment = "myComment";
  assert.equal(
    survey.getComment("question"),
    "myComment",
    "set comment from question"
  );
  assert.equal(question.comment, "myComment", "set comment from question");

  survey.setComment("question", "myNewComment");
  assert.equal(
    survey.getComment("question"),
    "myNewComment",
    "set comment from survey"
  );
  assert.equal(question.comment, "myNewComment", "set comment from survey");
});
QUnit.test(
  "Should set required questions before go on the  next page or finish",
  function (assert) {
    var survey = twoPageSimplestSurvey();
    assert.notEqual(survey, null, "Survey is not  null");
    (<Question>survey.pages[0].questions[0]).isRequired = true;

    assert.equal(survey.nextPage(), false, "Can not go to the next page");
    assert.equal(
      survey.pages[0].questions[0].hasErrors(),
      true,
      "The question is not filled out."
    );
    assert.equal(
      survey.pages[0].hasErrors(),
      true,
      "The page is not filled out."
    );
    (<Question>survey.pages[0].questions[0]).value = "Test";

    assert.equal(survey.nextPage(), true, "Can go to the next page");
    assert.equal(
      survey.pages[0].questions[0].hasErrors(),
      false,
      "The question is filled out."
    );
    assert.equal(survey.pages[0].hasErrors(), false, "The page is filled out.");
  }
);
QUnit.test("survey.checkErrorsMode = 'onValueChanged'", function (assert) {
  var survey = twoPageSimplestSurvey();
  assert.notEqual(survey, null, "Survey is not  null");
  var question = <Question>survey.pages[0].questions[0];
  question.validators.push(new EmailValidator());
  survey.checkErrorsMode = "onValueChanged";
  assert.equal(question.errors.length, 0, "there is no errrors yet");
  survey.setValue(question.name, "it is not e-mail");
  assert.equal(
    question.errors.length,
    1,
    "The error about invalid e-mail is generated"
  );
  survey.setValue(question.name, "a@a.co");
  assert.equal(question.errors.length, 0, "The is not errors again");
});
QUnit.test("survey.checkErrorsMode = 'onValueChanging'", function (assert) {
  var survey = twoPageSimplestSurvey();
  var question = <Question>survey.pages[0].questions[0];
  question.validators.push(new EmailValidator());
  survey.checkErrorsMode = "onValueChanging";
  survey.onValidateQuestion.add(function (sender, options) {
    if (options.name !== "question2") return;
    options.error = options.value.length != 3 ? "Require3Symbols" : null;
  });
  assert.equal(question.errors.length, 0, "there is no errors yet");
  question.value = "it is not e-mail";
  assert.equal(
    question.errors.length,
    1,
    "The error about invalid e-mail is generated"
  );
  assert.equal(
    question.value,
    "it is not e-mail",
    "the value keeps in question"
  );
  assert.notOk(
    survey.getValue(question.name),
    "We do not assign it to survey.data"
  );
  survey.setValue(question.name, "a@a.co");
  assert.equal(question.errors.length, 0, "The is not errors again");
  assert.equal(
    survey.getValue(question.name),
    "a@a.co",
    "set value to survey.data"
  );
  question = survey.getQuestionByName("question2");
  survey.setValue("question2", "val1");
  assert.equal(question.value, "val1", "incorrect value set to question");
  assert.equal(question.errors.length, 1, "error is generated");
  assert.notOk(survey.getValue("question2"), "survey do not have this value");
  survey.setValue("question2", "val");
  assert.equal(question.value, "val", "correct value set to question");
  assert.equal(question.errors.length, 0, "there is no errors");
  assert.equal(
    survey.getValue("question2"),
    "val",
    "set correct value into survey"
  );
});
QUnit.test(
  "survey.checkErrorsMode = 'onValueChanging' and isRequired, Bug#2627",
  function (assert) {
    var survey = twoPageSimplestSurvey();
    var question = <Question>survey.pages[0].questions[0];
    question.isRequired = true;
    question.value = "val1";
    survey.checkErrorsMode = "onValueChanging";
    assert.equal(question.errors.length, 0, "there is no errors yet");
    question.value = "";
    assert.equal(question.errors.length, 1, "The error is required");
    assert.equal(question.value, "", "the value keeps in question");
    assert.equal(
      survey.getValue(question.name),
      "val1",
      "We do not assign it to survey.data"
    );
    survey.setValue(question.name, "val2");
    assert.equal(question.errors.length, 0, "The is not errors again");
    assert.equal(
      survey.getValue(question.name),
      "val2",
      "set value to survey.data"
    );
    assert.equal(question.value, "val2", "set value to survey.data");
    question.value = "";
    assert.equal(question.errors.length, 1, "Show error again");
    assert.equal(
      survey.getValue(question.name),
      "val2",
      "keep old value in survey.data"
    );
    question.value = "val3";
    assert.equal(question.errors.length, 0, "Error is gone");
    assert.equal(
      survey.getValue(question.name),
      "val3",
      "set new value in survey.data"
    );
  }
);
QUnit.test(
  "survey.checkErrorsMode = 'onValueChanged', load from json + defaultValue",
  function (assert) {
    var json = {
      checkErrorsMode: "onValueChanged",
      pages: [
        {
          name: "page1",
          elements: [
            {
              type: "text",
              name: "q1",
              defaultValue: "it is not e-mail",
              validators: [
                {
                  type: "email",
                },
              ],
            },
          ],
        },
      ],
    };
    var survey = new SurveyModel(json);
    var question = <Question>survey.getQuestionByName("q1");
    assert.equal(
      question.errors.length,
      1,
      "The error about invalid e-mail is generated"
    );
  }
);
QUnit.test("survey.checkErrorsMode = 'onValueChanged' & isRequired: true & changing value to empty, #6692", function (assert) {
  const json = {
    checkErrorsMode: "onValueChanged",
    elements: [{ type: "text", name: "q1", isRequired: true }]
  };
  const survey = new SurveyModel(json);
  const question = <Question>survey.getQuestionByName("q1");
  assert.equal(question.errors.length, 0, "No error initially");
  question.value = "abc";
  assert.equal(question.errors.length, 0, "No error, it has value");
  question.value = "";
  assert.equal(question.errors.length, 1, "There is an error");
});
QUnit.test("survey.checkErrorsMode = 'onValueChanged' & , isRequired: true & do not generate error on setting the value, #6692", function (assert) {
  const json = {
    checkErrorsMode: "onValueChanged",
    elements: [{ type: "text", name: "q1", isRequired: true }, { type: "text", name: "q2" }]
  };
  const survey = new SurveyModel(json);
  const question = <Question>survey.getQuestionByName("q1");
  assert.equal(question.errors.length, 0, "No error initially");
  survey.data = { q1: "", q2: "abc" };
  assert.equal(question.errors.length, 0, "No error on setting value to data");
});
QUnit.test(
  "survey.checkErrorsMode = 'onValueChanged', matrix question inside dynamic panel - https://surveyjs.answerdesk.io/ticket/details/T1612",
  function (assert) {
    var json = {
      checkErrorsMode: "onValueChanged",
      pages: [
        {
          name: "generalquestions",
          elements: [
            {
              type: "paneldynamic",
              name: "question2",
              templateElements: [
                {
                  type: "matrixdropdown",
                  name: "question1",
                  validators: [
                    {
                      type: "expression",
                      text: "Error!!!",
                      expression: "{panel.question1.Row1.Column1} > 10",
                    },
                  ],
                  columns: [
                    {
                      name: "Column1",
                    },
                  ],
                  choices: [1, 2, 30],
                  rows: ["Row1", "Row2"],
                },
              ],
              panelCount: 1,
              minPanelCount: 1,
            },
          ],
        },
      ],
    };
    var survey = new SurveyModel(json);
    var panel: any = survey.getQuestionByName("question2");
    var question = panel.panels[0].elements[0];

    //survey.data = {"question2":[{"question1":{"Row1":{"Column1":30}}}]}

    assert.equal(question.errors.length, 0, "No errors at the start");

    question.value = { Row1: { Column1: 2 } };
    assert.equal(question.errors.length, 1, "The error about invalid value");

    question.value = { Row1: { Column1: 30 } };
    assert.equal(question.errors.length, 0, "No errors - chosen right value");
  }
);
QUnit.test("survey.checkErrorsMode = 'onComplete'", function (assert) {
  var json = {
    checkErrorsMode: "onComplete",
    pages: [
      {
        elements: [
          {
            type: "text",
            name: "q1",
            isRequired: true,
            defaultValue: "it is not e-mail",
            validators: [
              {
                type: "email",
              },
            ],
          },
        ],
      },
      {
        elements: [
          {
            type: "text",
            name: "q2",
            isRequired: true,
          },
        ],
      },
    ],
  };
  var survey = new SurveyModel(json);
  survey.nextPage();
  assert.equal(survey.currentPageNo, 1, "Ignore error on the first page");
  survey.tryComplete();
  assert.equal(survey.currentPageNo, 0, "Move to first page with the error");
  survey.afterRenderPage(<HTMLElement>{});

  survey.nextPage();
  assert.equal(survey.currentPageNo, 1, "Ignore error on the first page, #2");
  survey.tryComplete();
  assert.equal(
    survey.currentPageNo,
    0,
    "Move to first page with the error, #2"
  );
  survey.afterRenderPage(<HTMLElement>{});

  survey.setValue("q1", "john.snow@nightwatch.org");
  survey.nextPage();
  survey.tryComplete();
  assert.equal(survey.currentPageNo, 1, "Stay on second page");
  assert.equal(survey.state, "running", "There is an error on the second page");
  survey.setValue("q2", "a");
  survey.tryComplete();
  assert.equal(survey.state, "completed", "No errors, completed");
});

QUnit.test("Should not be errors after prevPage bug#151", function (assert) {
  var survey = new SurveyModel();
  survey.goNextPageAutomatic = true;
  var page = survey.addNewPage("page1");
  var question = <QuestionDropdownModel>page.addNewQuestion("dropdown", "q1");
  question.choices = [1, 2, 3];
  question.isRequired = true;
  page = survey.addNewPage("page2");
  page.addNewQuestion("text", "q2");

  survey.nextPage();
  assert.equal(question.errors.length, 1, "The question is not filled out.");
  question.value = 1;
  assert.equal(question.errors.length, 0, "The question has not errors");
  assert.equal(
    survey.currentPage.name,
    survey.pages[1].name,
    "Go to the next page"
  );
  survey.prevPage();
  assert.equal(question.errors.length, 0, "The question has not errors");
});
QUnit.test("Should not show errors with others bug #2014", function (assert) {
  var survey = new SurveyModel();
  survey.goNextPageAutomatic = true;
  var page = survey.addNewPage("page1");
  var question = <QuestionDropdownModel>page.addNewQuestion("dropdown", "q1");
  question.choices = [1, 2, 3];
  question.isRequired = true;
  question.hasOther = true;
  page = survey.addNewPage("page2");
  page.addNewQuestion("text", "q2");

  assert.equal(survey.currentPageNo, 0, "The first page is shown");
  question.value = question.otherItem.value;
  assert.equal(survey.currentPageNo, 0, "The page is still first");
  assert.equal(question.errors.length, 0, "Do not show any error");
  question.comment = "Some text";
  assert.equal(survey.currentPageNo, 0, "The page is still first, #2");
  question.value = 2;
  assert.equal(survey.currentPageNo, 1, "The second page is shown");
});
QUnit.test(
  "Show error on question value changed if can't go to the next page",
  function (assert) {
    var survey = new SurveyModel({
      goNextPageAutomatic: true,
      pages: [
        {
          elements: [
            { type: "text", name: "q1", isRequired: true },
            {
              type: "text",
              name: "q2",
              validators: [{ type: "numeric", minValue: 10 }],
            },
          ],
        },
        { elements: [{ type: "text", inputType: "date", name: "q3" }] },
      ],
    });
    survey
      .getQuestionByName("q3")
      .validators.push(
        new ExpressionValidator("{q3} >= '" + new Date().toString() + "'")
      );
    survey.setValue("q2", 3);
    assert.equal(survey.currentPageNo, 0, "q1 is empty");
    assert.equal(
      survey.getQuestionByName("q1").errors.length,
      0,
      "We do not show errors for q1"
    );
    assert.equal(
      survey.getQuestionByName("q2").errors.length,
      0,
      "We do not show errors for q2, q1 is empty"
    );
    survey.setValue("q1", 1);
    assert.equal(survey.currentPageNo, 0, "q2 has error, do not move");
    assert.equal(
      survey.getQuestionByName("q1").errors.length,
      0,
      "there is no error"
    );
    assert.equal(
      survey.getQuestionByName("q2").errors.length,
      1,
      "There is an error in q2, we can't move further"
    );
    survey.getQuestionByName("q2").errors.splice(0, 1);
    survey.clear(true, true);
    survey.setValue("q1", 1);
    assert.equal(survey.currentPageNo, 0, "q2 is empty");
    assert.equal(
      survey.getQuestionByName("q2").errors.length,
      0,
      "We do not touch q2 yet"
    );
    survey.setValue("q2", 5);
    assert.equal(survey.currentPageNo, 0, "q2 has error, do not move");
    assert.equal(
      survey.getQuestionByName("q2").errors.length,
      1,
      "Show errors q2 is changed."
    );
    survey.setValue("q2", 11);
    assert.equal(survey.currentPageNo, 1, "q2 has no errors");
    var d = new Date();
    d.setDate(d.getDate() - 5);
    survey.setValue("q3", d);
    assert.equal(
      survey.getQuestionByName("q3").errors.length,
      0,
      "Do not show errors, because input type is date"
    );
  }
);

QUnit.test(
  "Invisible required questions should not be take into account",
  function (assert) {
    var survey = twoPageSimplestSurvey();
    assert.notEqual(survey, null, "Survey is not  null");
    (<Question>survey.pages[0].questions[0]).isRequired = true;
    assert.equal(survey.nextPage(), false, "Can not go to the next page");
    survey.pages[0].questions[0].visible = false;
    assert.equal(survey.nextPage(), true, "You can go to the next page now.");
  }
);
QUnit.test("onValueChanged event", function (assert) {
  var survey = twoPageSimplestSurvey();
  var name = "";
  var newValue = null;
  var counter = 0;
  survey.onValueChanged.add(function (sender: SurveyModel, options: any) {
    name = options.name;
    newValue = options.value;
    counter++;
  });
  survey.setValue("question1", "value1");
  assert.equal(
    name,
    "question1",
    "onValueChanged event, property name is correct"
  );
  assert.equal(
    newValue,
    "value1",
    "onValueChanged event, property newValue is correct"
  );
  assert.equal(counter, 1, "onValueChanged event is called one time");
  (<Question>survey.pages[0].questions[0]).value = "val";
  assert.equal(counter, 2, "onValueChanged event is called one time");
});
QUnit.test("onValueChanged event - do not call on equal value", function (
  assert
) {
  var survey = new SurveyModel();
  var counter = 0;
  survey.onValueChanged.add(function (sender: SurveyModel, options: any) {
    counter++;
  });
  survey.setValue("name", 1);
  assert.equal(counter, 1, "onValueChanged event is called one time");
  survey.setValue("name", 1);
  assert.equal(counter, 1, "1 is the same value");
  survey.setValue("name", { col1: [1, { cel2: "2" }] });
  assert.equal(counter, 2, "onValueChanged event is called two times");
  survey.setValue("name", { col1: [1, { cel2: "2" }] });
  assert.equal(counter, 2, "2, the value is the same");
  survey.setValue("name", { col1: [1, { cel2: "2" }, 3] });
  assert.equal(counter, 3, "onValueChanged event is called three times");
  survey.setValue("name", { col1: [1, { cel2: "2" }, 3] });
  assert.equal(counter, 3, "3, the value is the same");
  var value = survey.getValue("name");
  value.col1.push(4);
  survey.setValue("name", value);
  assert.equal(counter, 4, "onValueChanged event is called fourth times");
});
QUnit.test(
  "onValueChanged event is not called on changing matrix value",
  function (assert) {
    var survey = twoPageSimplestSurvey();
    var matrixQuestion = new QuestionMatrixModel("matrix");
    survey.pages[0].addQuestion(matrixQuestion);
    matrixQuestion.columns = ["col1", "col2"];
    matrixQuestion.rows = ["row1", "row2"];
    var name = "";
    var newValue = null;
    var counter = 0;
    survey.onValueChanged.add(function (sender: SurveyModel, options: any) {
      name = options.name;
      newValue = options.value;
      counter++;
    });
    matrixQuestion.visibleRows[0].value = "col2";
    assert.equal(counter, 1, "onValueChanged event is called one time");
    assert.equal(
      name,
      "matrix",
      "onValueChanged event, property name is correct"
    );
    assert.deepEqual(
      newValue,
      { row1: "col2" },
      "onValueChanged event, property newValue is correct"
    );
  }
);
QUnit.test(
  "onValueChanged event is not called on changing multi text value",
  function (assert) {
    var survey = twoPageSimplestSurvey();
    var multiTextQuestion = new QuestionMultipleTextModel("multitext");
    survey.pages[0].addQuestion(multiTextQuestion);
    multiTextQuestion.items.push(new MultipleTextItemModel("item1"));
    multiTextQuestion.items.push(new MultipleTextItemModel("item2"));
    var name = "";
    var newValue = null;
    var counter = 0;
    survey.onValueChanged.add(function (sender: SurveyModel, options: any) {
      name = options.name;
      newValue = options.value;
      counter++;
    });
    multiTextQuestion.items[1].value = "text1";
    assert.equal(counter, 1, "onValueChanged event is called one time");
    assert.equal(
      name,
      "multitext",
      "onValueChanged event, property name is correct"
    );
    assert.deepEqual(
      newValue,
      { item2: "text1" },
      "onValueChanged event, property newValue is correct"
    );
  }
);
QUnit.test("onValueChanging event", function (assert) {
  var survey = twoPageSimplestSurvey();
  var name = "";
  var questionName = "";
  var newValue = null;
  var counter = 0;
  survey.onValueChanging.add(function (sender: SurveyModel, options: any) {
    name = options.name;
    questionName = !!options.question ? options.question.name : "";
    newValue = options.value;
    if ((options.value = "value0")) options.value = "value";
    counter++;
  });
  survey.setValue("question1", "value1");
  assert.equal(
    name,
    "question1",
    "onValueChanging event, property name is correct"
  );
  assert.equal(
    questionName,
    "question1",
    "onValueChanging event, property question is correct"
  );
  assert.equal(
    newValue,
    "value1",
    "onValueChanging event, property newValue is correct"
  );
  assert.equal(counter, 1, "onValueChanging event is called one time");
  (<Question>survey.pages[0].questions[0]).value = "val";
  assert.equal(counter, 2, "onValueChanging event is called two time");
  survey.setValue("q1", "val");
  assert.equal(counter, 3, "onValueChanging event is called three time");
  survey.setValue("q1", "value0");
  assert.equal(
    survey.getValue("q1"),
    "value",
    "onValueChanging event allows to change value"
  );
});
QUnit.test("onValueChanging event for comment, #8292", function (
  assert
) {
  const survey = new SurveyModel();
  const page = survey.addNewPage("page");
  const q1 = page.addNewQuestion("text", "q1");
  q1.showCommentArea = true;
  let oldComment, newComment, questionName;
  survey.onValueChanging.add((sender, options) => {
    if (options.name == "q1-Comment") {
      questionName = options.question.name;
      oldComment = options.oldValue;
      newComment = options.value;
    }
  });
  q1.comment = "abc";
  assert.equal(questionName, "q1", "question name #1");
  assert.equal(q1.comment, "abc", "comment value #1");
  assert.equal(newComment, "abc", "newComment #1");
  q1.comment = "abcd";
  assert.equal(q1.comment, "abcd", "comment value #2");
  assert.equal(newComment, "abcd", "newComment #2");
  assert.equal(oldComment, "abc", "newComment #2");
});

QUnit.test("onValueChanging event - do not allow clear value, #8292", function (
  assert
) {
  const survey = new SurveyModel();
  const page = survey.addNewPage("page");
  const q1 = page.addNewQuestion("text", "q1");
  q1.showCommentArea = true;
  let counter = 0;
  let oldComment, newComment, questionName;
  survey.onValueChanging.add((sender, options) => {
    if (options.name === "q1-Comment") {
      counter++;
      questionName = options.question.name;
      if (!options.value) {
        options.value = options.oldValue;
      }
      oldComment = options.oldValue;
      newComment = options.value;
    }
  });
  let onValueChangedValue;
  survey.onValueChanged.add((sender, options) => {
    if (options.name === "q1-Comment") {
      onValueChangedValue = options.value;
    }
  });
  q1.comment = "abc";
  assert.equal(counter, 1, "counter #1");
  assert.equal(q1.comment, "abc", "comment value #1");
  q1.comment = "";
  assert.equal(questionName, "q1", "question.name #2");
  assert.equal(oldComment, "abc", "oldComment #2");
  assert.equal(newComment, "abc", "newComment #2");
  assert.equal(counter, 2, "counter #2");
  assert.equal(q1.comment, "abc", "comment value #2");
  assert.equal(survey.getComment("q1"), "abc", "survey.getComment value #2");
  assert.equal(onValueChangedValue, "abc", "onValueChanged options.value");
});
QUnit.test("onValueChanging event - do not allow clear value in comment, #1542", function (
  assert
) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("page");
  var q1 = page.addNewQuestion("text", "q1");
  survey.onValueChanging.add(function (sender, options) {
    if (options.name == "q1" && !options.value) {
      options.value = options.oldValue;
    }
  });
  q1.value = 1;
  assert.equal(q1.value, 1, "The value is 1");
  q1.clearValue();
  assert.equal(
    q1.value,
    1,
    "The value is still 1, onValueChanging does not allow to change the value"
  );
});
QUnit.test("adding, inserting Multiple Text Item correctly", function (assert) {
  var survey = twoPageSimplestSurvey();
  var multiTextQuestion = new QuestionMultipleTextModel("multitext");
  survey.pages[0].addQuestion(multiTextQuestion);
  var item1 = new MultipleTextItemModel("item1");
  var item2 = new MultipleTextItemModel("item2");
  multiTextQuestion.items.push(item1);
  multiTextQuestion.items.splice(0, 0, item2);
  item1.value = "1";
  assert.equal(item1.value, "1", "Check1. data was set correctly");
  item2.value = "2";
  assert.equal(item2.value, "2", "Check2. data was set correctly");
  multiTextQuestion.items = [];
  item1 = multiTextQuestion.addItem("item1");
  item1.value = "3";
  assert.equal(item1.value, "3", "Check3. data was set correctly");
  multiTextQuestion.items.splice(0, 0, item2);
  item2.value = "4";
  assert.equal(item2.value, "4", "Check4. data was set correctly");
});
QUnit.test("Multiple Text required items", function (assert) {
  var survey = twoPageSimplestSurvey();
  var multiTextQuestion = new QuestionMultipleTextModel("multitext");
  survey.pages[0].addQuestion(multiTextQuestion);
  var item1 = multiTextQuestion.addItem("item1");
  var item2 = multiTextQuestion.addItem("item2");
  item1.isRequired = true;
  assert.equal(item1.fullTitle, "item1", "Add isRequired Text");
  assert.equal(item2.fullTitle, "item2", "there is no isRequired Text");
  assert.equal(
    multiTextQuestion.hasErrors(),
    true,
    "item1 is required and it is empty"
  );
  item1.value = 1;
  assert.equal(
    multiTextQuestion.hasErrors(),
    false,
    "item1 is required and it has a value"
  );
});
QUnit.test("onComplete event", function (assert) {
  var survey = twoPageSimplestSurvey();
  var counter = 0;
  survey.onComplete.add(function () {
    counter++;
  });
  survey.nextPage();
  survey.nextPage();
  survey.tryComplete();
  assert.equal(survey.state, "completed", "The survey is completed");
  assert.equal(counter, 1, "onComplete calls one time");
});
QUnit.test("onVisibleChanged event", function (assert) {
  var survey = twoPageSimplestSurvey();
  var name = "";
  var visibility = true;
  var counter = 0;
  survey.onVisibleChanged.add(function (sender: SurveyModel, options: any) {
    name = options.name;
    visibility = options.visible;
    counter++;
  });
  survey.getQuestionByName("question1").visible = false;

  assert.equal(
    name,
    "question1",
    "onVisibleChanged event, property name is correct"
  );
  assert.equal(
    visibility,
    false,
    "onVisibleChanged event, property visibility is correct"
  );
  assert.equal(counter, 1, "onVisibleChanged event is called one time");

  survey.getQuestionByName("question1").visible = true;
  assert.equal(
    name,
    "question1",
    "onVisibleChanged event, property name is correct"
  );
  assert.equal(
    visibility,
    true,
    "onVisibleChanged event, property visibility is correct"
  );
  assert.equal(counter, 2, "onVisibleChanged event is called two time");

  survey.getQuestionByName("question1").visible = true;
  assert.equal(counter, 2, "onVisibleChanged event is called two time");
});
QUnit.test("Question visibleIndex", function (assert) {
  var survey = twoPageSimplestSurvey();
  survey.showQuestionNumbers = "on";
  assert.equal(
    (<Question>survey.getQuestionByName("question1")).visibleIndex,
    0,
    "the first question"
  );
  assert.equal(
    (<Question>survey.getQuestionByName("question3")).visibleIndex,
    2,
    "the third question"
  );
  survey.getQuestionByName("question1").visible = false;
  assert.equal(
    (<Question>survey.getQuestionByName("question3")).visibleIndex,
    1,
    "the third question is now visible as second"
  );
  survey.getQuestionByName("question1").visible = true;
  assert.equal(
    (<Question>survey.getQuestionByName("question3")).visibleIndex,
    2,
    "the third question is third again"
  );
  survey.getQuestionByName("question1").hideNumber = true;
  assert.equal(
    (<Question>survey.getQuestionByName("question1")).visibleIndex,
    -1,
    "Hide the number"
  );
  assert.equal(
    (<Question>survey.getQuestionByName("question3")).visibleIndex,
    1,
    "the first question number is hidden"
  );
  survey.getQuestionByName("question1").hideNumber = false;
  survey.getQuestionByName("question1").visible = false;
  survey.showQuestionNumbers = "off";
  assert.equal(
    (<Question>survey.getQuestionByName("question1")).visibleIndex,
    -1,
    "off:the first question"
  );
  assert.equal(
    (<Question>survey.getQuestionByName("question2")).visibleIndex,
    -1,
    "off:the second question"
  );
  assert.equal(
    (<Question>survey.getQuestionByName("question3")).visibleIndex,
    -1,
    "off:the third question"
  );
  survey.showQuestionNumbers = "onPage";
  assert.equal(
    (<Question>survey.getQuestionByName("question1")).visibleIndex,
    -1,
    "onPage:the first question"
  );
  assert.equal(
    (<Question>survey.getQuestionByName("question2")).visibleIndex,
    0,
    "onPage:the second question"
  );
  assert.equal(
    (<Question>survey.getQuestionByName("question3")).visibleIndex,
    0,
    "onPage:the third question"
  );
});
QUnit.test("Question visibleIndex, add-remove questions", function (assert) {
  var survey = new SurveyModel();
  survey.showQuestionNumbers = "on";
  var page = survey.addNewPage("p1");
  var q1 = new QuestionTextModel("q1");
  page.elements.push(q1);
  page.elements.push(new QuestionTextModel("q2"));
  assert.equal(
    (<Question>survey.getQuestionByName("q1")).visibleIndex,
    0,
    "the first question"
  );
  assert.equal(
    (<Question>survey.getQuestionByName("q2")).visibleIndex,
    1,
    "the second question"
  );
  var q3 = new QuestionTextModel("q3");
  page.elements.splice(0, 1, q3);
  assert.equal(
    (<Question>survey.getQuestionByName("q3")).visibleIndex,
    0,
    "the first question"
  );
  assert.equal(
    (<Question>survey.getQuestionByName("q2")).visibleIndex,
    1,
    "the second question"
  );
});
QUnit.test(
  "Question visibleIndex in onVisibleChanged event, containers",
  function (assert) {
    var survey = new SurveyModel();
    survey.showQuestionNumbers = "on";
    var page = survey.addNewPage("page1");
    var panel = page.addNewPanel("panel1");
    var question = panel.addNewQuestion("text", "q1");
    question.visible = false;
    question.visibleIf = "{state} = 1";
    var visibleIndex = -1;
    survey.onVisibleChanged.add(function (sender, options) {
      visibleIndex = options.question.visibleIndex;
    });
    survey.setValue("state", 1);
    //question.visible = true;
    assert.equal(visibleIndex, 0, "visible index should be 0");
  }
);

QUnit.test("Question/Panel visibleIndex", function (assert) {
  var survey = new SurveyModel();
  survey.showQuestionNumbers = "on";
  var page = survey.addNewPage("page1");
  var q1 = page.addNewQuestion("text", "q1");
  var panel = page.addNewPanel("panel1");
  var q2 = panel.addNewQuestion("text", "q2");
  var q3 = panel.addNewQuestion("text", "q3");
  var q4 = page.addNewQuestion("text", "q4");
  assert.equal(q2.visibleIndex, 1, "second quesiton");
  assert.equal(q4.visibleIndex, 3, "fourth quesiton");
  panel.title = "Some text";
  assert.equal(panel.visibleIndex, -1, "Panel title is empty");
  assert.equal(panel.no, "", "Panel no property,  title is empty");
  panel.showNumber = true;
  assert.equal(panel.visibleIndex, 1, "Panel has visibleIndex");
  assert.equal(panel.no, "2.", "Panel no property");
  assert.equal(q2.visibleIndex, 2, "second quesiton + panel has index");
  assert.equal(q4.visibleIndex, 4, "fourth quesiton + panel has index");
  panel.showQuestionNumbers = "off";
  assert.equal(
    q2.visibleIndex,
    -1,
    "second quesiton + panel has index, questions inside panel have not numbering"
  );
  assert.equal(
    q3.visibleIndex,
    -1,
    "third quesiton + panel has index, questions inside panel have not numbering"
  );
  assert.equal(
    q4.visibleIndex,
    2,
    "fourth quesiton + panel has index, questions inside panel have not numbering"
  );
  panel.showQuestionNumbers = "onpanel";
  assert.equal(
    q2.visibleIndex,
    0,
    "second quesiton + panel has index, questions inside panel have its own numbering"
  );
  assert.equal(
    q3.visibleIndex,
    1,
    "third quesiton + panel has index, questions  inside panel have its own numbering"
  );
  assert.equal(
    q4.visibleIndex,
    2,
    "fourth quesiton + panel has index, questions  inside panel have its own numbering"
  );
  panel.showNumber = false;
  assert.equal(panel.visibleIndex, -1, "Panel showNumber is false");
  assert.equal(panel.no, "", "Panel no property,  showNumber is false");
});

QUnit.test(
  "Question/Panel visibleIndex, the panel is first with showNumber false and showQuestionNumbering onpanel",
  function (assert) {
    var survey = new SurveyModel();
    survey.showQuestionNumbers = "on";
    var page = survey.addNewPage("page1");
    var panel = page.addNewPanel("panel1");
    var q2 = panel.addNewQuestion("text", "q2");
    var q3 = panel.addNewQuestion("text", "q3");
    var q4 = page.addNewQuestion("text", "q4");
    panel.showQuestionNumbers = "onpanel";
    assert.equal(
      q2.visibleIndex,
      0,
      "second quesiton + panel has index, questions inside panel have its own numbering"
    );
    assert.equal(
      q3.visibleIndex,
      1,
      "third quesiton + panel has index, questions  inside panel have its own numbering"
    );
    assert.equal(
      q4.visibleIndex,
      0,
      "fourth quesiton + panel has index, questions  inside panel have its own numbering"
    );
  }
);
QUnit.test("Panel.questionStartIndex", function (assert) {
  var survey = new SurveyModel();
  survey.showQuestionNumbers = "on";
  var page = survey.addNewPage("page1");
  var q1 = page.addNewQuestion("text", "q1");
  var panel = page.addNewPanel("panel1");
  var q2 = panel.addNewQuestion("text", "q2");
  var q3 = panel.addNewQuestion("text", "q3");
  var q4 = page.addNewQuestion("text", "q4");
  survey.questionStartIndex = "1)";
  panel.questionStartIndex = "A.";
  assert.equal(q1.no, "1)", "the first question");
  assert.equal(q2.no, "B.", "second quesiton");
  assert.equal(q3.no, "C.", "the thrid question");
  assert.equal(q4.no, "4)", "the fourth question");
  panel.showQuestionNumbers = "onpanel";
  assert.equal(q2.no, "A.", "second quesiton, onpanel");
  assert.equal(q3.no, "B.", "the thrid question, onpanel");
  assert.equal(q4.no, "2)", "the fourth question, onpanel");
});

QUnit.test("Panel.questionStartIndex, nested Panel", function (assert) {
  var survey = new SurveyModel();
  survey.showQuestionNumbers = "on";
  var page = survey.addNewPage("page1");
  var panel = page.addNewPanel("panel1");
  var nestedPanel = panel.addNewPanel("panel2");
  panel.addNewQuestion("text", "q2");
  nestedPanel.addNewQuestion("text", "q3");
  nestedPanel.title = "title";
  survey.questionStartIndex = "1)";
  panel.questionStartIndex = "A.";
  nestedPanel.showNumber = true;
  assert.equal(nestedPanel.no, "A.", "use panel questionStartIndex");
});
QUnit.test("showQuestionNumbers - accept bool values", function (assert) {
  var survey = twoPageSimplestSurvey();
  survey.showQuestionNumbers = "on";
  assert.equal(survey.showQuestionNumbers, "on");
  survey.showQuestionNumbers = false as any;
  assert.equal(survey.showQuestionNumbers, "off");
  survey.showQuestionNumbers = true as any;
  assert.equal(survey.showQuestionNumbers, "on");
});
QUnit.test("showQuestionNumbers - question fullTitle", function (assert) {
  var survey = twoPageSimplestSurvey();
  survey.showQuestionNumbers = "on";
  assert.equal((<Question>survey.getQuestionByName("question1"))["no"], 1);
  assert.equal(
    (<Question>survey.getQuestionByName("question1")).fullTitle,
    "question1",
    "the first question showQuestionNumbers=on"
  );
  assert.equal((<Question>survey.getQuestionByName("question3"))["no"], 3);
  assert.equal(
    (<Question>survey.getQuestionByName("question3")).fullTitle,
    "question3",
    "the thrid question showQuestionNumbers=on"
  );
  survey.showQuestionNumbers = "onPage";
  assert.equal((<Question>survey.getQuestionByName("question1"))["no"], 1);
  assert.equal(
    (<Question>survey.getQuestionByName("question1")).fullTitle,
    "question1",
    "the first question showQuestionNumbers=onPage"
  );
  assert.equal((<Question>survey.getQuestionByName("question3"))["no"], 1);
  assert.equal(
    (<Question>survey.getQuestionByName("question3")).fullTitle,
    "question3",
    "the thrid question showQuestionNumbers=onPage"
  );
  survey.showQuestionNumbers = "off";
  assert.equal((<Question>survey.getQuestionByName("question1"))["no"], "");
  assert.equal(
    (<Question>survey.getQuestionByName("question1")).fullTitle,
    "question1",
    "the first question showQuestionNumbers=onPage"
  );
  assert.equal((<Question>survey.getQuestionByName("question3"))["no"], "");
  assert.equal(
    (<Question>survey.getQuestionByName("question3")).fullTitle,
    "question3",
    "the thrid question showQuestionNumbers=onPage"
  );
});
QUnit.test("Question visibleIndex and no title question", function (assert) {
  var survey = twoPageSimplestSurvey();
  survey.showQuestionNumbers = "on";
  assert.equal(
    (<Question>survey.getQuestionByName("question1")).visibleIndex,
    0,
    "the first question"
  );
  assert.equal(
    (<Question>survey.getQuestionByName("question3")).visibleIndex,
    2,
    "the third question"
  );
  var question = new QuestionHtmlModel("html1");
  survey.pages[0].addQuestion(question, 0);
  assert.equal(
    (<Question>survey.getQuestionByName("html1")).visibleIndex,
    -1,
    "html question"
  );
  assert.equal(
    (<Question>survey.getQuestionByName("question1")).visibleIndex,
    0,
    "the first question + html question"
  );
  assert.equal(
    (<Question>survey.getQuestionByName("question3")).visibleIndex,
    2,
    "the third question + html question"
  );
});
QUnit.test("Pages visibleIndex and num", function (assert) {
  var survey = twoPageSimplestSurvey();
  survey.addNewPage("page 3").addNewQuestion("text", "q4");
  assert.equal(survey.pages[0].visibleIndex, 0, "start:page 1");
  assert.equal(survey.pages[1].visibleIndex, 1, "start:page 2");
  assert.equal(survey.pages[2].visibleIndex, 2, "start:page 3");
  assert.equal(survey.pages[0].num, 1, "start:page 1, num");
  assert.equal(survey.pages[1].num, 2, "start:page 2, num");
  assert.equal(survey.pages[2].num, 3, "start:page 3, num");

  survey.pages[0].visible = false;
  assert.equal(
    survey.pages[0].visibleIndex,
    -1,
    "page[0].visible=false:page 1"
  );
  assert.equal(survey.pages[1].visibleIndex, 0, "page[0].visible=false:page 2");
  assert.equal(survey.pages[2].visibleIndex, 1, "page[0].visible=false:page 3");
  assert.equal(survey.pages[0].num, -1, "page[0].visible=false:page 1, num");
  assert.equal(survey.pages[1].num, 1, "page[0].visible=false:page 2, num");
  assert.equal(survey.pages[2].num, 2, "page[0].visible=false:page 3, num");
});
QUnit.test("Pages num", function (assert) {
  var survey = twoPageSimplestSurvey();
  assert.equal(survey.pages[0]["canShowPageNumber"](), false, "false:the first page: can't show page number");
  assert.equal(survey.pages[0].num, 1, "the first page");
  assert.equal(survey.pages[1]["canShowPageNumber"](), false, "false:the first page: can't show page number");
  assert.equal(survey.pages[1].num, 2, "the second page");

  survey.showPageNumbers = true;
  assert.equal(survey.pages[0]["canShowPageNumber"](), true, "true:the first page: can show page number");
  assert.equal(survey.pages[0].num, 1, "the first page");
  assert.equal(survey.pages[1]["canShowPageNumber"](), true, "true:the first page: can show page number");
  assert.equal(survey.pages[1].num, 2, "the second page");
});
QUnit.test("Server validation", function (assert) {
  var survey = twoPageSimplestSurvey();
  var serverFunction = function (options) {
    if (options.data["question1"] && options.data["question1"] > 100) {
      options.errors["question1"] = "Question 1 should be higher than 100";
    }
    options.complete();
  };
  survey.onServerValidateQuestions.add(function (sender, options) {
    serverFunction(options);
  });
  survey.setValue("question1", 101);
  survey.nextPage();
  assert.equal(survey.currentPage.visibleIndex, 0, "Get server error");
  survey.setValue("question1", 10);
  survey.nextPage();
  assert.equal(survey.currentPage.visibleIndex, 1, "No errors server error");
});
QUnit.test("Server validation (old api version)", function (assert) {
  var survey = twoPageSimplestSurvey();
  var serverFunction = function (options) {
    if (options.data["question1"] && options.data["question1"] > 100) {
      options.errors["question1"] = "Question 1 should be higher than 100";
    }
    options.complete();
  };
  survey.onServerValidateQuestions = <any>((sender, options) => {
    serverFunction(options);
  });
  survey.setValue("question1", 101);
  survey.nextPage();
  assert.equal(survey.currentPage.visibleIndex, 0, "Get server error");
  survey.setValue("question1", 10);
  survey.nextPage();
  assert.equal(survey.currentPage.visibleIndex, 1, "No errors server error");
});

QUnit.test(
  "Server validation - do not allow to validate multiple times, Bug#2497",
  function (assert) {
    var survey = twoPageSimplestSurvey();
    var opt = null;
    var counter = 0;
    survey.onServerValidateQuestions.add(function (sender, options) {
      opt = options;
      counter++;
    });
    survey.setValue("question1", 101);
    survey.nextPage();
    survey.nextPage();
    assert.equal(
      survey.currentPage.visibleIndex,
      0,
      "The validation is not finished yet"
    );
    opt.complete();
    assert.equal(counter, 1, "server validation should be called one time");
    assert.equal(
      survey.currentPage.visibleIndex,
      1,
      "Validation on next page is completed"
    );
    survey.tryComplete();
    survey.tryComplete();
    assert.equal(
      survey.currentPage.visibleIndex,
      1,
      "The validation on complete is not finished yet"
    );
    opt.complete();
    assert.equal(counter, 2, "server validation should be called two times");
    assert.equal(survey.state, "completed", "Validation is completed");
  }
);

QUnit.test(
  "Server validation - fire onValidatedErrorsOnCurrentPage  event, Bug#2566",
  function (assert) {
    var survey = twoPageSimplestSurvey();
    var opt = null;
    survey.onServerValidateQuestions.add(function (sender, options) {
      opt = options;
    });
    var errorCount = 0;
    survey.onValidatedErrorsOnCurrentPage.add(function (sender, options) {
      errorCount = options.errors.length;
    });
    survey.setValue("question1", 101);
    survey.nextPage();
    assert.equal(errorCount, 0, "There is no errors yet");
    opt.errors["question1"] = "Server error";
    opt.complete();
    assert.equal(errorCount, 1, "There is one error");
  }
);

QUnit.test("onVisibleChanged call validation", function (assert) {
  var survey = twoPageSimplestSurvey();
  survey.onValidateQuestion.add(function (sender, options) {
    if (options.name == "question1" && options.value > 100) {
      options.error = "Question 1 should be higher than 100";
    }
  });

  assert.equal(
    survey.isCurrentPageHasErrors,
    false,
    "There is no error if the value is empty"
  );
  survey.setValue("question1", 1);
  assert.equal(
    survey.isCurrentPageHasErrors,
    false,
    "the value is less than 100"
  );
  survey.setValue("question1", 101);
  assert.equal(
    survey.isCurrentPageHasErrors,
    true,
    "the value is more than 100, has errors"
  );
});
QUnit.test("onValidatePanel test", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("page");
  var panel = page.addNewPanel("panel");
  var q1 = <QuestionTextModel>panel.addNewQuestion("text", "q1");
  var q2 = <QuestionTextModel>panel.addNewQuestion("text", "q2");
  let counter = 0;
  survey.onValidatePanel.add(function (sender, options) {
    counter ++;
    var panel = <PanelModel>options.panel;
    var pq1 = <QuestionTextModel>panel.getQuestionByName("q1");
    var pq2 = <QuestionTextModel>panel.getQuestionByName("q2");
    var sum = pq1.value + pq1.value;
    if (sum < 10 || pq1.isEmpty() || pq2.isEmpty())
      options.error = "q1+q2 should be more than 9";
    if (sum >= 100) options.error = "q1+q2 should be less than 100";
  });

  assert.equal(
    survey.isCurrentPageHasErrors,
    true,
    "failed, values are undefined : 10 < q1.value + q2.value < 100"
  );
  assert.equal(counter, 1, "onValidatePanel calls one time");
  q1.value = 5;
  q2.value = 50;
  assert.equal(
    survey.isCurrentPageHasErrors,
    false,
    "passed: 5 + 50, 10 < q1.value + q2.value < 100"
  );
  assert.equal(counter, 2, "onValidatePanel calls two time");
  q1.value = 55;

  assert.equal(
    survey.isCurrentPageHasErrors,
    true,
    "failed: 55 + 50, 10 < q1.value + q2.value < 100"
  );
  assert.equal(counter, 3, "onValidatePanel calls three time");
});
QUnit.test("survey.onValidatePanel & options.errors", function (assert) {
  const survey = new SurveyModel();
  const page = survey.addNewPage("page");
  const panel = page.addNewPanel("panel");
  const q1 = <QuestionTextModel>panel.addNewQuestion("text", "q1");
  const q2 = <QuestionTextModel>panel.addNewQuestion("text", "q2");
  survey.onValidatePanel.add(function (sender, options) {
    const panel = <PanelModel>options.panel;
    const pq1 = <QuestionTextModel>panel.getQuestionByName("q1");
    const pq2 = <QuestionTextModel>panel.getQuestionByName("q2");
    const sum = pq1.value + pq1.value;
    if (sum < 10 || pq1.isEmpty() || pq2.isEmpty()) {
      options.errors.push(new CustomError("q1+q2 should be more than 9"));
    }
    if (sum >= 100) {
      options.errors.push(new CustomError("q1+q2 should be less than 100"));
    }
  });

  assert.equal(survey.isCurrentPageHasErrors, true, "failed, values are undefined : 10 < q1.value + q2.value < 100");
  assert.equal(panel.errors.length, 1, "panel.errors, #1");
  q1.value = 5;
  q2.value = 50;
  assert.equal(survey.isCurrentPageHasErrors, false, "passed: 5 + 50, 10 < q1.value + q2.value < 100");
  assert.equal(panel.errors.length, 0, "panel.errors, #2");
  q1.value = 55;
  assert.equal(survey.isCurrentPageHasErrors, true, "failed: 55 + 50, 10 < q1.value + q2.value < 100");
  assert.equal(panel.errors.length, 1, "panel.errors, #3");
});
QUnit.test(
  "isCurrentPageHasErrors, required question in the invisible panel, #325",
  function (assert) {
    var survey = twoPageSimplestSurvey();
    var panel = survey.pages[0].addNewPanel("panel");
    var requiredQuestion = <QuestionTextModel>(
      panel.addNewQuestion("text", "requriedQuestion")
    );
    requiredQuestion.isRequired = true;

    assert.equal(
      survey.isCurrentPageHasErrors,
      true,
      "requiredQuestion value is empty"
    );
    panel.visible = false;
    assert.equal(
      survey.isCurrentPageHasErrors,
      false,
      "requiredQuestion value is empty, but the parent panel is invisible"
    );
  }
);

QUnit.test("Page visibility", function (assert) {
  var page = new PageModel("page");
  assert.equal(
    page.isVisible,
    false,
    "page is invisible if there is no questions in it"
  );
  page.addNewQuestion("text", "q1");
  assert.equal(page.isVisible, true, "there is one question");
  page.visible = false;
  assert.equal(page.isVisible, false, "we made the page invisible");
  page.visible = true;
  assert.equal(page.isVisible, true, "we made the page visible");
  page.questions[0].visible = false;
  assert.equal(
    page.isVisible,
    false,
    "there is no visible questions on the page"
  );
  page.questions[0].visible = true;
  assert.equal(page.isVisible, true, "we have made the question visible again");
});
QUnit.test("Survey visiblePages and start using them", function (assert) {
  var survey = twoPageSimplestSurvey();
  assert.equal(survey.visiblePages.length, 2, "All pages are visible");
  assert.equal(survey.currentPage.name, "Page 1", "the first page is current");
  survey.pages[0].visible = false;
  assert.equal(
    survey.visiblePages.length,
    1,
    "The first page becomes invisible"
  );
  assert.equal(
    survey.currentPage.name,
    "Page 2",
    "the second page is current, because the first is invisible"
  );
});
QUnit.test(
  "Survey visiblePages, make second and third invisbile and go the last page on next",
  function (assert) {
    var survey = twoPageSimplestSurvey();
    survey.currentPage = survey.pages[0];
    survey.addNewPage("Page 3").addNewQuestion("text", "p3q1");
    survey.addNewPage("Page 4").addNewQuestion("text", "p4q1");
    survey.pages[1].visible = false;
    survey.pages[2].questions[0].visible = false;
    survey.nextPage();
    assert.equal(
      survey.currentPage.name,
      "Page 4",
      "Bypass two invisible pages"
    );
  }
);
QUnit.test("Visible trigger test", function (assert) {
  var survey = twoPageSimplestSurvey();
  var trigger = new SurveyTriggerVisible();
  survey.triggers.push(trigger);
  trigger.name = "question1";
  trigger.value = "Hello";
  trigger.pages = ["Page 2"];
  trigger.questions = ["question2"];

  survey.setValue("question1", "H");
  assert.equal(
    survey.getQuestionByName("question2").visible,
    false,
    "It is invisible now"
  );
  assert.equal(survey.pages[1].visible, false, "It is invisible now");

  survey.setValue("question1", "Hello");
  assert.equal(
    survey.getQuestionByName("question2").visible,
    true,
    "trigger makes it visible"
  );
  assert.equal(survey.pages[1].visible, true, "trigger makes it visible");

  survey.setValue("question2", "He");
  assert.equal(
    survey.getQuestionByName("question2").visible,
    true,
    "trigger should not be called"
  );
  assert.equal(survey.pages[1].visible, true, "trigger should not be called");
});
QUnit.test("Complete trigger test", function (assert) {
  var survey = twoPageSimplestSurvey();
  var trigger = new SurveyTriggerComplete();
  survey.triggers.push(trigger);
  trigger.name = "question1";
  trigger.value = "Hello";

  survey.setValue("question1", "H");
  assert.equal(survey.state, "running");

  survey.setValue("question1", "Hello");
  assert.equal(survey.state, "running");
  survey.nextPage();
  assert.equal(survey.state, "completed");
});
QUnit.test(
  "Complete trigger test, check isCompleteOnTrigger property",
  function (assert) {
    var survey = twoPageSimplestSurvey();
    var trigger = new SurveyTriggerComplete();
    survey.triggers.push(trigger);
    trigger.name = "question1";
    trigger.value = "Hello";
    var isCompleteOnTrigger_Completing = false;
    var isCompleteOnTrigger_Complete = false;
    survey.onCompleting.add(function (sender, options) {
      isCompleteOnTrigger_Completing = options.isCompleteOnTrigger;
    });
    survey.onComplete.add(function (sender, options) {
      isCompleteOnTrigger_Complete = options.isCompleteOnTrigger;
    });

    survey.setValue("question1", "Hello");
    assert.equal(survey.state, "running");
    assert.equal(survey.isCompleteButtonVisible, true, "complete button is visible");
    assert.equal(survey.isShowNextButton, false, "next button is invisible");
    survey.tryComplete();
    assert.equal(survey.state, "completed");
    assert.equal(
      isCompleteOnTrigger_Completing,
      true,
      "isCompleteOnTrigger property works for onCompleting event"
    );
    assert.equal(
      isCompleteOnTrigger_Complete,
      true,
      "isCompleteOnTrigger property works for onCompleted event"
    );
    survey.clear();
    survey.nextPage();
    survey.tryComplete();
    assert.equal(
      isCompleteOnTrigger_Completing,
      false,
      "isCompleteOnTrigger property works for onCompleting event, #2"
    );
    assert.equal(
      isCompleteOnTrigger_Complete,
      false,
      "isCompleteOnTrigger property works for onCompleted event, #2"
    );
  }
);
QUnit.test(
  "Complete trigger test, settings.executeCompleteTriggerOnValueChanged",
  function (assert) {
    settings.executeCompleteTriggerOnValueChanged = true;
    var survey = twoPageSimplestSurvey();
    var trigger = new SurveyTriggerComplete();
    survey.triggers.push(trigger);
    trigger.name = "question1";
    trigger.value = "Hello";

    survey.setValue("question1", "H");
    assert.equal(survey.state, "running");

    survey.setValue("question1", "Hello");
    assert.equal(survey.state, "completed");
    settings.executeCompleteTriggerOnValueChanged = false;
  }
);
QUnit.test("CompleteTrigger.toString()", function (assert) {
  var trigger = new SurveyTriggerComplete();
  trigger.name = "question1";
  trigger.value = "Hello";
  assert.equal(
    trigger.toString(),
    "complete, {question1} equal 'Hello'",
    "toString function returns correct value"
  );
});
QUnit.test("Complete trigger + matrix test", function (assert) {
  var survey = twoPageSimplestSurvey();
  var matrix = <QuestionMatrixModel>(
    survey.pages[0].addNewQuestion("matrix", "matrix")
  );
  matrix.rows = ["row 1", "row 2"];
  matrix.columns = ["column 1", "column 2"];
  var trigger = new SurveyTriggerComplete();
  survey.triggers.push(trigger);
  trigger.name = "matrix.row 1";
  trigger.value = "column 2";

  survey.setValue("matrix", { "row 1": "column 1" });
  assert.equal(survey.state, "running");

  survey.setValue("matrix", { "row 1": "column 2" });
  assert.equal(survey.state, "running");
  survey.nextPage();
  assert.equal(survey.state, "completed");
});
QUnit.test("survey.onCurrentPageChanging + isNextPage/isPrevPage", function (
  assert
) {
  var survey = twoPageSimplestSurvey();
  var changingOldPage = null;
  var changingNewPage = null;
  var changingCounter = 0;
  var changingBeforeChanged = 0;
  var page = survey.currentPage;
  survey.onCurrentPageChanging.add(function (survey, options) {
    changingOldPage = options.oldCurrentPage;
    changingNewPage = options.newCurrentPage;
    changingCounter++;
    changingBeforeChanged = 1;
  });
  survey.onCurrentPageChanged.add(function (surey, options) {
    if (changingBeforeChanged == 1) {
      changingBeforeChanged = 2;
    }
  });
  survey.nextPage();
  assert.equal(
    changingOldPage.name,
    "Page 1",
    "first nextPage: oldCurrentPage"
  );
  assert.equal(
    changingNewPage.name,
    "Page 2",
    "first nextPage: newCurrentPage"
  );
  assert.equal(changingCounter, 1, "first nextPage: called one time");
  assert.equal(
    changingBeforeChanged,
    2,
    "first nextPage: called before changed"
  );
  survey.prevPage();
  assert.equal(
    changingOldPage.name,
    "Page 2",
    "first prevPage: oldCurrentPage"
  );
  assert.equal(
    changingNewPage.name,
    "Page 1",
    "first prevPage: newCurrentPage"
  );
  assert.equal(changingCounter, 2, "first prevPage: called two time");
  assert.equal(
    changingBeforeChanged,
    2,
    "first prevPage: called before changed"
  );
});

QUnit.test("survey.onCurrentPageChanging/Changed + isNextPage/isPrevPage/isGoingForward/isGoingBackward", function (assert) {
  const survey = twoPageSimplestSurvey();
  survey.addNewPage("page3");
  survey.pages[2].addNewQuestion("text", "q5");
  survey.addNewPage("page4");
  survey.pages[3].addNewQuestion("text", "q6");
  assert.equal(survey.visiblePageCount, 4, "There are 4 pages");
  var isNextPageChangedCounter = 0;
  var isNextPageChangingCounter = 0;
  var isGoingForwardPageChangingCounter = 0;
  var isGoingBackwardPageChangingCounter = 0;
  var isPrevPageChangedCounter = 0;
  var isPrevPageChangingCounter = 0;
  var isGoingForwardPageChangedCounter = 0;
  var isGoingBackwardPageChangedCounter = 0;
  survey.onCurrentPageChanging.add(function (survey, options) {
    if (options.isPrevPage) isPrevPageChangingCounter++;
    if (options.isNextPage) isNextPageChangingCounter++;
    if (options.isGoingBackward) isGoingBackwardPageChangingCounter++;
    if (options.isGoingForward) isGoingForwardPageChangingCounter++;
  });
  survey.onCurrentPageChanged.add(function (surey, options) {
    if (options.isPrevPage) isPrevPageChangedCounter++;
    if (options.isNextPage) isNextPageChangedCounter++;
    if (options.isGoingBackward) isGoingBackwardPageChangedCounter++;
    if (options.isGoingForward) isGoingForwardPageChangedCounter++;
  });
  survey.nextPage();
  assert.equal(isNextPageChangedCounter, 1, "isNextPageChangedCounter, nextPage");
  assert.equal(isPrevPageChangedCounter, 0, "isPrevPageChangedCounter, nextPage");
  assert.equal(isNextPageChangingCounter, 1, "isNextPageChangingCounter, nextPage");
  assert.equal(isPrevPageChangingCounter, 0, "isPrevPageChangingCounter, nextPage");
  assert.equal(isGoingForwardPageChangingCounter, 1, "isGoingForwardPageChangingCounter, nextPage");
  assert.equal(isGoingBackwardPageChangingCounter, 0, "isGoingBackwardPageChangingCounter, nextPage");
  assert.equal(isGoingForwardPageChangedCounter, 1, "isGoingForwardPageChangedCounter, nextPage");
  assert.equal(isGoingBackwardPageChangedCounter, 0, "isGoingBackwardPageChangedCounter, nextPage");
  survey.prevPage();
  assert.equal(isNextPageChangedCounter, 1, "isNextPageChangedCounter, nextPage/prevPage");
  assert.equal(isPrevPageChangedCounter, 1, "isPrevPageChangedCounter, nextPage/prevPage");
  assert.equal(isNextPageChangingCounter, 1, "isNextPageChangingCounter, nextPage/prevPage");
  assert.equal(isPrevPageChangingCounter, 1, "isPrevPageChangingCounter, nextPage/prevPage");
  assert.equal(isGoingForwardPageChangingCounter, 1, "isGoingForwardPageChangingCounter, nextPage/prevPage");
  assert.equal(isGoingBackwardPageChangingCounter, 1, "isGoingBackwardPageChangingCounter, nextPage/prevPage");
  assert.equal(isGoingForwardPageChangedCounter, 1, "isGoingForwardPageChangedCounter, nextPage/prevPage");
  assert.equal(isGoingBackwardPageChangedCounter, 1, "isGoingBackwardPageChangedCounter, nextPage/prevPage");
  survey.currentPageNo = 3;
  assert.equal(survey.currentPage.name, "page4", "goes to have 3");
  assert.equal(isNextPageChangedCounter, 1, "isNextPageChangedCounter, nextPage/prevPage/currentPageNo=3");
  assert.equal(isPrevPageChangedCounter, 1, "isPrevPageChangedCounter, nextPage/prevPage/currentPageNo=3");
  assert.equal(isNextPageChangingCounter, 1, "isNextPageChangingCounter, nextPage/prevPage/currentPageNo=3");
  assert.equal(isPrevPageChangingCounter, 1, "isPrevPageChangingCounter, nextPage/prevPage/currentPageNo=3");
  assert.equal(isGoingForwardPageChangingCounter, 2, "isGoingForwardPageChangingCounter, nextPage/prevPage/currentPageNo=3");
  assert.equal(isGoingBackwardPageChangingCounter, 1, "isGoingBackwardPageChangingCounter, nextPage/prevPage/currentPageNo=3");
  assert.equal(isGoingForwardPageChangedCounter, 2, "isGoingForwardPageChangedCounter, nextPage/prevPage/currentPageNo=3");
  assert.equal(isGoingBackwardPageChangedCounter, 1, "isGoingBackwardPageChangedCounter, nextPage/prevPage/currentPageNo=3");
  survey.currentPageNo = 1;
  assert.equal(isNextPageChangedCounter, 1, "isNextPageChangedCounter, nextPage/prevPage/currentPageNo=3/currentPageNo=1");
  assert.equal(isPrevPageChangedCounter, 1, "isPrevPageChangedCounter, nextPage/prevPage/currentPageNo=3/currentPageNo=1");
  assert.equal(isNextPageChangingCounter, 1, "isNextPageChangingCounter, nextPage/prevPage/currentPageNo=3/currentPageNo=1");
  assert.equal(isPrevPageChangingCounter, 1, "isPrevPageChangingCounter, nextPage/prevPage/currentPageNo=3/currentPageNo=1");
  assert.equal(isGoingForwardPageChangingCounter, 2, "isGoingForwardPageChangingCounter, nextPage/prevPage/currentPageNo=3/currentPageNo=1");
  assert.equal(isGoingBackwardPageChangingCounter, 2, "isGoingBackwardPageChangingCounter, nextPage/prevPage/currentPageNo=3/currentPageNo=1");
  assert.equal(isGoingForwardPageChangedCounter, 2, "isGoingForwardPageChangedCounter, nextPage/prevPage/currentPageNo=3/currentPageNo=1");
  assert.equal(isGoingBackwardPageChangedCounter, 2, "isGoingBackwardPageChangedCounter, nextPage/prevPage/currentPageNo=3/currentPageNo=1");
  survey.currentPageNo = 0;
  assert.equal(isNextPageChangedCounter, 1, "isNextPageChangedCounter, nextPage/prevPage/currentPageNo=3/currentPageNo=1/currentPageNo=0");
  assert.equal(isPrevPageChangedCounter, 2, "isPrevPageChangedCounter, nextPage/prevPage/currentPageNo=3/currentPageNo=1/currentPageNo=0");
  assert.equal(isNextPageChangingCounter, 1, "isNextPageChangingCounter, nextPage/prevPage/currentPageNo=3/currentPageNo=1/currentPageNo=0");
  assert.equal(isPrevPageChangingCounter, 2, "isPrevPageChangingCounter, nextPage/prevPage/currentPageNo=3/currentPageNo=1/currentPageNo=0");
  assert.equal(isGoingForwardPageChangingCounter, 2, "isGoingForwardPageChangingCounter, nextPage/prevPage/currentPageNo=3/currentPageNo=1/currentPageNo=0");
  assert.equal(isGoingBackwardPageChangingCounter, 3, "isGoingBackwardPageChangingCounter, nextPage/prevPage/currentPageNo=3/currentPageNo=1/currentPageNo=0");
  assert.equal(isGoingForwardPageChangedCounter, 2, "isGoingForwardPageChangedCounter, nextPage/prevPage/currentPageNo=3/currentPageNo=1/currentPageNo=0");
  assert.equal(isGoingBackwardPageChangedCounter, 3, "isGoingBackwardPageChangedCounter, nextPage/prevPage/currentPageNo=3/currentPageNo=1/currentPageNo=0");
});

QUnit.test("survey.onCurrentPageChanging, allowChanging option", function (
  assert
) {
  var survey = twoPageSimplestSurvey();
  //get current Page
  survey.currentPage;
  var allowChanging = false;
  survey.onCurrentPageChanging.add(function (survey, options) {
    options.allowChanging = allowChanging;
  });
  assert.equal(survey.currentPageNo, 0, "The first page");
  survey.nextPage();
  assert.equal(survey.currentPageNo, 0, "Still the first page");
  allowChanging = true;
  survey.nextPage();
  assert.equal(survey.currentPageNo, 1, "The second page");
  allowChanging = false;
  survey.prevPage();
  assert.equal(survey.currentPageNo, 1, "Still the second page");
  allowChanging = true;
  survey.prevPage();
  assert.equal(survey.currentPageNo, 0, "The second page again");
});

QUnit.test("survey.onCurrentPageChanging, allow option (use it instead of allowChanging)", function (
  assert
) {
  var survey = twoPageSimplestSurvey();
  //get current Page
  survey.currentPage;
  var allowChanging = false;
  survey.onCurrentPageChanging.add(function (survey, options) {
    options.allow = allowChanging;
  });
  assert.equal(survey.currentPageNo, 0, "The first page");
  survey.nextPage();
  assert.equal(survey.currentPageNo, 0, "Still the first page");
  allowChanging = true;
  survey.nextPage();
  assert.equal(survey.currentPageNo, 1, "The second page");
  allowChanging = false;
  survey.prevPage();
  assert.equal(survey.currentPageNo, 1, "Still the second page");
  allowChanging = true;
  survey.prevPage();
  assert.equal(survey.currentPageNo, 0, "The second page again");
});

QUnit.test("survey.onCompleting, allowComplete option", function (assert) {
  var survey = twoPageSimplestSurvey();
  var allowComplete = false;
  survey.onCompleting.add(function (survey, options) {
    options.allowComplete = allowComplete;
  });
  assert.equal(survey.state, "running", "It is running");
  survey.doComplete();
  assert.equal(survey.state, "running", "It is still running");
  allowComplete = true;
  survey.doComplete();
  assert.equal(survey.state, "completed", "It is completed now");
});

QUnit.test("survey.onCompleting, allow option (use it instead of allowComplete)", function (assert) {
  var survey = twoPageSimplestSurvey();
  var allowComplete = false;
  survey.onCompleting.add(function (survey, options) {
    options.allow = allowComplete;
  });
  assert.equal(survey.state, "running", "It is running");
  survey.doComplete();
  assert.equal(survey.state, "running", "It is still running");
  allowComplete = true;
  survey.doComplete();
  assert.equal(survey.state, "completed", "It is completed now");
});

QUnit.test(
  "Complete trigger, onCurrentPageChange calls after onComplete, Bug#963",
  function (assert) {
    var survey = twoPageSimplestSurvey();
    var trigger = new SurveyTriggerComplete();
    survey.triggers.push(trigger);
    trigger.name = "question1";
    trigger.value = "Hello";
    survey.setValue("question1", "Hello");
    var page = survey.currentPage;

    var firstFiredEvent = null;
    var onCurrentPageChangedCounter = 0;
    var onCompleteCounter = 0;
    survey.onCurrentPageChanged.add(function (survey, options) {
      if (!firstFiredEvent) firstFiredEvent = "onCurrentPageChanged";
      onCurrentPageChangedCounter++;
    });
    survey.onComplete.add(function (survey, options) {
      if (!firstFiredEvent) firstFiredEvent = "onComplete";
      onCompleteCounter++;
    });

    survey.nextPage();
    assert.equal(onCompleteCounter, 1, "onComplete fired one time");
    assert.equal(
      onCurrentPageChangedCounter,
      0,
      "onCurrentPageChanged fired one time"
    );
    assert.equal(firstFiredEvent, "onComplete", "should be called first");
  }
);
QUnit.test("Value trigger test", function (assert) {
  var survey = twoPageSimplestSurvey();
  var trigger = new SurveyTriggerSetValue();
  survey.triggers.push(trigger);
  trigger.name = "question1";
  trigger.value = "Hello";
  trigger.setToName = "name1";
  trigger.setValue = "val1";
  assert.equal(survey.getValue("name1"), null, "value is not set");
  survey.setValue("question1", "Hello");
  assert.equal(survey.getValue("name1"), "val1", "value is set");
});
QUnit.test("Triggers shouldn't fire on data assignment", function (assert) {
  var survey = twoPageSimplestSurvey();
  var trigger = new SurveyTriggerSetValue();
  survey.triggers.push(trigger);
  trigger.name = "question1";
  trigger.value = "Hello";
  trigger.setToName = "name1";
  trigger.setValue = "val1";
  assert.equal(survey.getValue("name1"), null, "value is not set");
  survey.data = { question1: "Hello" };
  assert.equal(survey.getValue("name1"), null, "value still is not set");
});
QUnit.test("Value trigger test, setValue is empty, clear the data", function (
  assert
) {
  var survey = twoPageSimplestSurvey();
  var trigger = new SurveyTriggerSetValue();
  survey.triggers.push(trigger);
  trigger.expression = "{question1}='Hello'";
  trigger.setToName = "question2";
  survey.setValue("question2", "abc");
  assert.equal(survey.getValue("question2"), "abc", "value is set");
  survey.setValue("question1", "Hello");
  assert.notOk(
    survey.getValue("question2"),
    "value is cleard because setValue is empty"
  );
});
QUnit.test("RunExpression trigger test", function (assert) {
  var survey = twoPageSimplestSurvey();
  survey.setValue("val1", 3);
  survey.setValue("val2", 2);
  var trigger = new SurveyTriggerRunExpression();
  survey.triggers.push(trigger);
  trigger.expression = "{question1} = 'Hello'";
  trigger.setToName = "name1";
  trigger.runExpression = "{val1} + {val2}";
  assert.equal(survey.getValue("name1"), null, "value is not set");
  survey.setValue("question1", "Hello");
  assert.equal(survey.getValue("name1"), 5, "value is set as expression");
  survey.setValue("question1", "Hello1");
  trigger.runExpression = "{val2}";
  survey.clearValue("val2");
  trigger.setToName = "";
  survey.setValue("question1", "Hello");
  assert.equal(survey.getValue("name1"), 5, "value is still 5");
});
QUnit.test("Skip trigger test", function (assert) {
  var survey = twoPageSimplestSurvey();
  var trigger = new SurveyTriggerSkip();
  survey.triggers.push(trigger);
  trigger.expression = "{question1} = 'Hello'";
  trigger.gotoName = "question4";
  assert.equal(survey.currentPageNo, 0, "the first page is active");
  survey.setValue("question1", "Hello");
  assert.equal(survey.currentPageNo, 1, "the second page is active now");
});
QUnit.test("Skip trigger test", function (assert) {
  settings.executeSkipTriggerOnValueChanged = false;
  var survey = twoPageSimplestSurvey();
  survey.addPage(createPageWithQuestion("p3", "q10"));
  var trigger = new SurveyTriggerSkip();
  survey.triggers.push(trigger);
  trigger.expression = "{question1} = 'Hello'";
  trigger.gotoName = "q10";
  assert.equal(survey.currentPageNo, 0, "the first page is active");
  survey.setValue("question1", "Hello");
  assert.equal(survey.currentPageNo, 0, "the first page is still active");
  survey.nextPage();
  assert.equal(survey.currentPageNo, 2, "the third page is active");
  settings.executeSkipTriggerOnValueChanged = true;
});
QUnit.test(
  "RunExpression trigger test with custom function, bug#T1734",
  function (assert) {
    function getQuestionValueByTitle(params) {
      if (!params && params.length < 1) return undefined;
      var question = this.survey.getAllQuestions().filter(function (q) {
        return q.title === params[0];
      })[0];
      return question.value;
    }
    function abortSurvey() {
      this.survey.doComplete();
    }
    FunctionFactory.Instance.register(
      "getQuestionValueByTitle",
      getQuestionValueByTitle
    );
    FunctionFactory.Instance.register("abort", abortSurvey);

    var survey = new SurveyModel({
      pages: [
        {
          elements: [{ type: "boolean", name: "q1", title: "abort survey" }],
        },
        {
          elements: [{ type: "text", name: "q2" }],
        },
      ],
      triggers: [
        {
          type: "runexpression",
          expression: "getQuestionValueByTitle('abort survey') = true",
          runExpression: "abort()",
        },
      ],
    });
    survey.setValue("q1", true);
    survey.nextPage();
    assert.equal(survey.state, "completed", "The survey is completed");
    FunctionFactory.Instance.unregister("getQuestionValueByTitle");
    FunctionFactory.Instance.unregister("abort");
  }
);

QUnit.test("Copy value trigger test", function (assert) {
  var survey = twoPageSimplestSurvey();
  var trigger = new SurveyTriggerCopyValue();
  survey.triggers.push(trigger);
  trigger.name = "question1";
  trigger.value = "Hello";

  trigger.setToName = "question2";
  trigger.fromName = "question3";
  survey.setValue("question3", "CopiedValue");

  assert.equal(survey.getValue("question2"), null, "value is not set");
  survey.setValue("question1", "Hello");
  assert.equal(survey.getValue("question2"), "CopiedValue", "value is set");
});
QUnit.test("String format", function (assert) {
  var strResult = surveyLocalization.getString("textMinLength")["format"](10);
  assert.equal(
    strResult,
    "Please enter at least 10 character(s).",
    "The format string is working"
  );
});
QUnit.test("Copy value trigger in dynamic panel, Bug# 1574", function (assert) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "paneldynamic",
        name: "panel1",
        templateElements: [
          {
            type: "text",
            name: "question1",
          },
        ],
        panelCount: 1,
      },
      {
        type: "paneldynamic",
        name: "panel2",
        templateElements: [
          {
            type: "text",
            name: "question2",
          },
        ],
        panelCount: 1,
      },
    ],
    triggers: [
      {
        type: "copyvalue",
        expression: "{panel1[0].question1} notempty",
        setToName: "panel2[0].question2",
        fromName: "panel1[0].question1",
      },
    ],
  });
  var panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel1");
  panel.panels[0].getQuestionByName("question1").value = "valueQ2";
  assert.deepEqual(
    survey.data,
    {
      panel1: [
        {
          question1: "valueQ2",
        },
      ],
      panel2: [
        {
          question2: "valueQ2",
        },
      ],
    },
    "trigger copy the value correctly"
  );
});
QUnit.test("Value trigger with async function", function (assert) {
  var returnResult1: (res: any) => void;
  function asyncFunc1(params: any): any {
    returnResult1 = this.returnResult;
    return false;
  }
  FunctionFactory.Instance.register("asyncFunc1", asyncFunc1, true);
  var survey = twoPageSimplestSurvey();
  var trigger = new SurveyTriggerSetValue();
  survey.triggers.push(trigger);
  trigger.expression = "asyncFunc1({question1}) = 'Hello'";
  trigger.setToName = "name1";
  trigger.setValue = "val1";
  assert.equal(survey.getValue("name1"), null, "value is not set");
  survey.setValue("question1", "Hello");
  assert.equal(
    survey.getValue("name1"),
    null,
    "value is not set, waiting for callback"
  );
  returnResult1(survey.getValue("question1"));
  assert.equal(survey.getValue("name1"), "val1", "value is set");
  FunctionFactory.Instance.unregister("asyncFunc1");
});

QUnit.test("RunExpression trigger test", function (assert) {
  var returnResult1: (res: any) => void;
  var returnResult2: (res: any) => void;
  function asyncFunc1(params: any): any {
    returnResult1 = this.returnResult;
    return false;
  }
  function asyncFunc2(params: any): any {
    returnResult2 = this.returnResult;
    return false;
  }
  FunctionFactory.Instance.register("asyncFunc1", asyncFunc1, true);
  FunctionFactory.Instance.register("asyncFunc2", asyncFunc2, true);
  var survey = twoPageSimplestSurvey();
  survey.setValue("val1", 3);
  survey.setValue("val2", 2);
  var trigger = new SurveyTriggerRunExpression();
  survey.triggers.push(trigger);
  trigger.expression = "asyncFunc1({question1}) = 'Hello'";
  trigger.setToName = "name1";
  trigger.runExpression = "asyncFunc2({val1} + {val2})";

  assert.equal(survey.getValue("name1"), null, "value is not set");
  survey.setValue("question1", "Hello");
  assert.equal(
    survey.getValue("name1"),
    null,
    "value is not set, expression is not completed"
  );
  returnResult1(survey.getValue("question1"));
  assert.equal(
    survey.getValue("name1"),
    null,
    "value is not set, runExpression is not completed"
  );
  returnResult2(survey.getValue("val1") + survey.getValue("val2"));
  assert.equal(survey.getValue("name1"), 5, "value is set as expression");

  FunctionFactory.Instance.unregister("asyncFunc1");
  FunctionFactory.Instance.unregister("asyncFunc2");
});

QUnit.test("Serialize email validator", function (assert) {
  var validator = new EmailValidator();
  var json = new JsonObject().toJsonObject(validator);
  assert.ok(json, "Convert to Json Successful");
  var newValidator = {};
  new JsonObject().toObject(json, newValidator);
  assert.ok(newValidator, "Convert from Json Successful");
});
QUnit.test(
  "Email validator - https://github.com/surveyjs/survey-library/issues/1807",
  function (assert) {
    var validator = new EmailValidator();
    assert.equal(
      validator.validate("test=1@email.com", ""),
      null,
      "valid email"
    );
    assert.notEqual(
      validator.validate("test=1@ema=il.com", ""),
      null,
      "invalid email - = in domain name"
    );
    assert.notEqual(
      validator.validate("test=1@email.c=om", ""),
      null,
      "invalid email - = in domain suffix"
    );
  }
);
QUnit.test("survey.getAllVariables()", function (assert) {
  var survey = twoPageSimplestSurvey();
  survey.setVariable("user", "admin");
  survey.setVariable("type", "2");
  assert.deepEqual(survey.getVariableNames(), ["user", "type"]);
});
QUnit.test("pre process title", function (assert) {
  var survey = twoPageSimplestSurvey();
  survey.data = { name: "John" };
  survey.title = "Hello {name}";
  assert.equal(
    survey.processedTitle,
    "Hello John",
    "process survey title correctly"
  );
  survey.pages[0].title = "Page {PageNo} from {PageCount}.";
  assert.equal(survey.pages[0].processedTitle, "Page 1 from 2.");
  survey.pages[0].addNewQuestion("text", "email");
  survey.setValue("email", "andrew.telnov@gmail.com");
  survey.setVariable("var1", "[it is var1]");
  survey.setValue("val1", "[it is val1]");
  survey.completedHtml = "<div>Your e-mail: <b>{email}</b>{var1}{val1}</div>";
  assert.equal(
    survey.processedCompletedHtml,
    "<div>Your e-mail: <b>andrew.telnov@gmail.com</b>[it is var1][it is val1]</div>"
  );
});
QUnit.test("pre process title where name with dot", function (assert) {
  var survey = twoPageSimplestSurvey();
  survey.data = { "name.dot": "John" };
  survey.title = "Hello {name.dot}";
  assert.equal(
    survey.processedTitle,
    "Hello John",
    "process survey title correctly"
  );
});

QUnit.test("pre process title, 'locale' variable", function (assert) {
  var survey = twoPageSimplestSurvey();
  survey.title = "The current locale is: '{locale}'";
  assert.equal(
    survey.processedTitle,
    "The current locale is: 'en'",
    "process the locale correctly"
  );
  survey.locale = "fr";
  assert.equal(
    survey.processedTitle,
    "The current locale is: 'fr'",
    "process the locale correctly again"
  );
});

QUnit.test("Default value completedHtml, completedBeforeHtml and loadingHtml", function (assert) {
  const survey = new SurveyModel();
  survey.locale = "";
  assert.ok(survey.completedHtml.indexOf("</h3>") > -1, "h3 is here, default completedHtml");
  assert.ok(survey.completedBeforeHtml.indexOf("</h3>") > -1, "h3 is here, default completedBeforeHtml");
  assert.ok(survey.loadingHtml.indexOf("</h3>") > -1, "h3 is here, default loadingHtml");
});

QUnit.test(
  "pre process title with variables in Capital letters, bug#1099",
  function (assert) {
    var survey = new SurveyModel();
    survey.setVariable("Var1", "[My variable]");
    survey.completedHtml = "Your Var1 is: {VaR1}";
    assert.equal(survey.processedCompletedHtml, "Your Var1 is: [My variable]");
  }
);

QUnit.test("pre process completedHtml nested properties and arrays", function (
  assert
) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("page1");

  var multipleText = new QuestionMultipleTextModel("mt");
  multipleText.addItem("t1");
  multipleText.addItem("t2");
  page.addQuestion(multipleText);

  var dynamicMatrix = new QuestionMatrixDynamicModel("matrix");
  dynamicMatrix.addColumn("col1");
  dynamicMatrix.addColumn("col2");
  dynamicMatrix.addColumn("col3");
  page.addQuestion(dynamicMatrix);

  multipleText.value = { t2: "Year" };
  dynamicMatrix.value = [{ col1: 1 }, { col2: 2017 }];

  survey.completedHtml = "{mt.t2}:{matrix[1].col2}";
  assert.equal(survey.processedCompletedHtml, "Year:2017");
});

QUnit.test(
  "pre process completedHtml nested properties and arrays + name with dot",
  function (assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("page1");

    var multipleText = new QuestionMultipleTextModel("m.t");
    multipleText.addItem("t1");
    multipleText.addItem("t2");
    page.addQuestion(multipleText);

    var dynamicMatrix = new QuestionMatrixDynamicModel("matri.x");
    dynamicMatrix.addColumn("col1");
    dynamicMatrix.addColumn("col2");
    dynamicMatrix.addColumn("col3");
    page.addQuestion(dynamicMatrix);

    multipleText.value = { t2: "Year" };
    dynamicMatrix.value = [{ col1: 1 }, { col2: 2017 }];

    survey.completedHtml = "{m.t.t2}:{matri.x[1].col2}";
    assert.equal(survey.processedCompletedHtml, "Year:2017");
  }
);

QUnit.test("question fullTitle", function (assert) {
  var survey = twoPageSimplestSurvey();
  survey.showQuestionNumbers = "on";
  var question = <Question>survey.pages[0].questions[1];
  question.title = "My Title";
  assert.equal(question.fullTitle, "My Title");
  question.isRequired = true;
  assert.equal(question.requiredMark, "*");
  survey.questionStartIndex = "100";
  assert.equal(question.no, "101.");
  survey.questionStartIndex = "A";
  assert.equal(question.no, "B.");
  survey.questionTitleTemplate = "{no}) {title} ({require})";
  assert.equal(question.no, "B)");
  assert.equal(question.requiredMark, "(*)");
});
QUnit.test("question.no and survey.questionStartIndex", function (assert) {
  var survey = twoPageSimplestSurvey();
  survey.showQuestionNumbers = "on";
  var question = <Question>survey.pages[0].questions[1];
  assert.equal(question.no, "2.");
  survey.questionStartIndex = "100";
  assert.equal(question.no, "101.");
  survey.questionStartIndex = "A";
  assert.equal(question.no, "B.");
  survey.questionStartIndex = "10)";
  assert.equal(question.no, "11)");
  survey.questionStartIndex = "(10)";
  assert.equal(question.no, "(11)");
  survey.questionStartIndex = "# 1";
  assert.equal(question.no, "# 2");
  survey.questionStartIndex = "1.2";
  assert.equal(question.no, "1.3");
  survey.questionStartIndex = "1.01";
  assert.equal(question.no, "1.02");
  survey.onGetQuestionNo.add(function (sender, options) {
    options.no = "a.b." + (options.question.visibleIndex + 1) + ")";
  });
  assert.equal(question.no, "a.b.2)", "use event");
});
QUnit.test("survey.onGetPageNumber event", function (assert) {
  const survey = new SurveyModel();
  survey.showPageNumbers = true;
  survey.onGetPageNumber.add((sender, options) => {
    if(options.page.isStartPage) {
      options.number = "";
    } else {
      options.number = (survey.pages.indexOf(options.page) + 1) + "-";
    }
  });
  survey.fromJSON({
    firstPageIsStartPage: true,
    pages: [
      { elements: [{ type: "text", name: "q" }] },
      { title: "Page 1", elements: [{ type: "text", name: "q1" }] },
      { title: "Page 2", elements: [{ type: "text", name: "q2" }] },
      { title: "Page 3", elements: [{ type: "text", name: "q3" }] },
      { title: "Page 4", elements: [{ type: "text", name: "q4" }] }
    ]
  });
  survey.start();
  assert.equal(survey.pages[0].no, "", "pages[0], #1");
  assert.equal(survey.pages[1].no, "2-", "pages[1], #1");
  assert.equal(survey.pages[2].no, "3-", "pages[2], #1");
  assert.equal(survey.pages[3].no, "4-", "pages[3], #1");
  survey.pages[1].visible = false;
  assert.equal(survey.pages[0].no, "", "pages[0], #2");
  assert.equal(survey.pages[1].no, "2-", "pages[1], #2");
  assert.equal(survey.pages[2].no, "3-", "pages[2], #2");
  assert.equal(survey.pages[3].no, "4-", "pages[3], #2");
});
QUnit.test(
  "question.no/queston.visibleIndex and hideNo/hideTitle options",
  function (assert) {
    var survey = new SurveyModel({
      showQuestionNumbers: "on",
      questions: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2" },
        { type: "text", name: "q3" },
      ],
    });
    var q1 = survey.pages[0].questions[0];
    var q2 = survey.pages[0].questions[1];
    var q3 = survey.pages[0].questions[2];
    q2.titleLocation = "hidden";
    assert.equal(
      q2.visibleIndex,
      -1,
      "titleLocation = 'hidden', default behavior"
    );
    assert.equal(q2.no, "", "titleLocation = 'hidden'");
    assert.equal(
      q3.visibleIndex,
      1,
      "previous question titleLocation = 'hidden', default behavior"
    );
    assert.equal(q3.no, "2.", "previous question titleLocation = 'hidden'");
    q1.visible = false;
    settings.setQuestionVisibleIndexForHiddenTitle = true;
    q1.visible = true;
    assert.equal(
      q2.visibleIndex,
      1,
      "titleLocation = 'hidden', setQuestionVisibleIndexForHiddenTitle"
    );
    assert.equal(
      q2.no,
      "",
      "titleLocation = 'hidden', setQuestionVisibleIndexForHiddenTitle"
    );
    assert.equal(
      q3.visibleIndex,
      2,
      "previous question titleLocation = 'hidden', default behavior, setQuestionVisibleIndexForHiddenTitle"
    );
    assert.equal(
      q3.no,
      "3.",
      "previous question titleLocation = 'hidden', setQuestionVisibleIndexForHiddenTitle"
    );
    settings.setQuestionVisibleIndexForHiddenTitle = false;

    q2.titleLocation = "default";
    q2.hideNumber = true;
    assert.equal(q2.visibleIndex, -1, "hideNumber = true, default behavior");
    assert.equal(q2.no, "", "titleLocation = 'hidden'");
    assert.equal(
      q3.visibleIndex,
      1,
      "previous question hideNumber = true, default behavior"
    );
    assert.equal(q3.no, "2.", "previous question hideNumber = true");
    q1.visible = false;
    settings.setQuestionVisibleIndexForHiddenNumber = true;
    q1.visible = true;
    assert.equal(
      q2.visibleIndex,
      1,
      "hideNumber = true, setQuestionVisibleIndexForHiddenNumber"
    );
    assert.equal(
      q2.no,
      "",
      "hideNumber = true, setQuestionVisibleIndexForHiddenNumber"
    );
    assert.equal(
      q3.visibleIndex,
      2,
      "previous question hideNumber = true, default behavior, setQuestionVisibleIndexForHiddenNumber"
    );
    assert.equal(
      q3.no,
      "3.",
      "previous question hideNumber = true, setQuestionVisibleIndexForHiddenNumber"
    );
    settings.setQuestionVisibleIndexForHiddenNumber = false;
  }
);

QUnit.test(
  "update survey.questionStartIndex and survey.requiredMark based on survey.questionTitleTemplate",
  function (assert) {
    var survey = new SurveyModel();
    survey.questionTitleTemplate = "{no}) {title} {require}";
    assert.equal(survey.questionStartIndex, "1)", "{no})");
    survey.questionStartIndex = "a";
    survey.questionTitleTemplate = "{no}) {title} {require}";
    assert.equal(survey.questionStartIndex, "a)", "{no}) + startIndex = 'a'");
    survey.questionTitleTemplate = "{title} ({require})";
    assert.equal(survey.requiredMark, "(*)", "({require})");
    survey.requiredMark = "!!";
    survey.questionTitleTemplate = "{no}) {title} ({require})";
    assert.equal(survey.requiredMark, "(!!)", "({require}) + !!");
  }
);
QUnit.test("clearInvisibleValues", function (assert) {
  var survey = twoPageSimplestSurvey();
  survey.clearInvisibleValues = true;
  var question1 = <Question>survey.pages[0].questions[0];
  question1.value = "myValue";
  var question2 = <Question>survey.pages[0].questions[1];
  question2.value = "myValue";
  question1.visible = false;
  survey.doComplete();
  assert.equal(question1.value, null, "Clear value of an invisible question");
  assert.equal(question2.value, "myValue", "Keep value of a visible question");
});
QUnit.test(
  "clearInvisibleValues is onComplete (default value), visible and invisible questions with the same valueName, #898",
  function (assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("page");
    var q1 = <QuestionTextModel>page.addNewQuestion("text", "q1");
    var q2 = <QuestionTextModel>page.addNewQuestion("text", "q2");
    q1.valueName = "value";
    q2.valueName = "value";
    q1.value = 1;
    q2.visible = false;
    survey.doComplete();
    assert.deepEqual(survey.data, { value: 1 }, "The value should be keeped");
    survey.clear();
    q1.value = 2;
    q1.visible = false;
    survey.doComplete();
    assert.deepEqual(survey.data, {}, "The value should be cleaned");
  }
);
QUnit.test(
  "clearInvisibleValues is onComplete (default value), visible and invisible questions with the same name and valueName",
  function (assert) {
    const survey = new SurveyModel();
    const page = survey.addNewPage("page");
    const q1 = <QuestionTextModel>page.addNewQuestion("text", "q1");
    const q2 = <QuestionTextModel>page.addNewQuestion("text", "q2");
    q2.valueName = "q1";
    q2.value = 1;
    q1.visible = false;
    survey.doComplete();
    assert.deepEqual(survey.data, { q1: 1 }, "The value should be kept");
  }
);
QUnit.test("clearInvisibleValues - comments and other values, #309", function (
  assert
) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("p1");
  var q1 = <QuestionDropdownModel>page.addNewQuestion("dropdown", "q1");
  q1.hasOther = true;
  var q2 = <QuestionTextModel>page.addNewQuestion("text", "q2");
  q2.hasComment = true;
  var q3 = <QuestionTextModel>page.addNewQuestion("text", "q3");
  survey.clearInvisibleValues = true;
  q1.value = q1.otherItem.value;
  q1.comment = "comment1";
  q2.value = "val2";
  q2.comment = "comment2";
  q3.value = "val3";
  q1.visible = false;
  q2.visible = false;
  assert.notDeepEqual(survey.data, { q3: "val3" }, "There are many vlues yet");
  survey.doComplete();
  assert.deepEqual(
    survey.data,
    { q3: "val3" },
    "There should be one value only"
  );
});
QUnit.test(
  "Do not store others value if others is not selected, #311",
  function (assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("p1");
    var q1 = <QuestionDropdownModel>page.addNewQuestion("dropdown", "q1");
    q1.choices = [1];
    q1.hasOther = true;
    q1.value = q1.otherItem.value;
    q1.comment = "comment1";
    q1.value = 1;
    assert.deepEqual(survey.data, { q1: 1 }, "There is no comment already");
    survey.doComplete();
    assert.deepEqual(survey.data, { q1: 1 }, "There no comment");
  }
);
QUnit.test("merge values", function (assert) {
  class MySurvey extends SurveyModel {
    constructor() {
      super();
    }
    public doMergeValues(src: any, dest: any) {
      super.mergeValues(src, dest);
    }
  }
  var survey = new MySurvey();
  var dest = {};
  survey.doMergeValues({ val: 1 }, dest);
  assert.deepEqual(dest, { val: 1 });

  survey.doMergeValues({ val2: { val1: "str" } }, dest);
  assert.deepEqual({ val: 1, val2: { val1: "str" } }, dest);

  survey.doMergeValues({ val2: { val2: 2 } }, dest);
  assert.deepEqual({ val: 1, val2: { val1: "str", val2: 2 } }, dest);
  var a = "test";
  survey.doMergeValues({ val: 1 }, a);
  assert.equal(a, "test", "Do nothing if dest is string");
});
function percentageToNum(width: string): Number {
  width = width.replace("%", "");
  return parseFloat(width);
}
QUnit.test("Several questions in one row", function (assert) {
  var page = new PageModel();
  for (var i = 0; i < 10; i++) page.addNewQuestion("text", "q" + (i + 1));
  assert.equal(page.rows.length, 10, "10 rows for each question");

  page = new PageModel();
  for (var i = 0; i < 10; i++) page.addNewQuestion("text", "q" + (i + 1));
  page.questions[0].startWithNewLine = false;
  assert.equal(page.rows.length, 10, "still 10 rows for each question");
  assert.equal(
    percentageToNum(page.rows[0].elements[0].renderWidth),
    100,
    "the render width is 100%"
  );

  page = new PageModel();
  for (var i = 0; i < 10; i++) page.addNewQuestion("text", "q" + (i + 1));
  for (var i = 0; i < 10; i++) {
    page.questions[i].startWithNewLine = i % 2 == 0;
  }
  assert.equal(
    page.rows.length,
    5,
    "every second has startWithNewLine equals false, there 5 rows now"
  );
  for (var i = 0; i < 5; i++) {
    assert.equal(
      page.rows[i].elements.length,
      2,
      "two questions for every row"
    );
    assert.equal(
      percentageToNum(page.rows[i].elements[0].renderWidth),
      50,
      "the render width is 50%"
    );
    assert.equal(page.rows[i].elements[0].rightIndent, 1, "the indent is 1");
    assert.equal(
      percentageToNum(page.rows[i].elements[1].renderWidth),
      50,
      "the render width is 50%"
    );
    assert.equal(page.rows[i].elements[1].rightIndent, 0, "the indent is 0");
  }
});

QUnit.test("Several questions in one row - defaultV2", function (assert) {
  let survey = new SurveyModel({});
  survey.css = defaultCss;
  let page = survey.addNewPage();
  page.addNewQuestion("text", "q1");
  const q2 = page.addNewQuestion("text", "q2");
  q2.startWithNewLine = false;
  assert.equal(page.rows.length, 1, "only one row");
  assert.equal(page.rows[0].elements.length, 2, "two elements in row");

  assert.equal(page.rows[0].elements[0].rightIndent, 0, "the first indent is 0");
  assert.equal(page.rows[0].elements[1].rightIndent, 0, "the second indent is 0");
});

QUnit.test("Several questions in complex questions row - defaultV2", function (assert) {
  let survey = new SurveyModel({});
  survey.fromJSON({
    "pages": [
      {
        "name": "page1",
        "elements": [
          {
            "type": "paneldynamic",
            "name": "order",
            "templateElements": [
              {
                "type": "text",
                "name": "itemName",
                "title": "Item Name"
              },
              {
                "type": "text",
                "name": "count",
                "startWithNewLine": false,
              }
            ]
          }
        ]
      }
    ]
  });
  assert.equal(survey.getAllQuestions()[0].templateElements[0].rightIndent, 0, "the first indent is 0");

});

QUnit.test(
  "Rendered width with setting width in the same row, using calc",
  function (assert) {
    var page = new PageModel();
    for (var i = 0; i < 5; i++) {
      page.addNewQuestion("text", "q" + (i + 1));
      page.questions[i].startWithNewLine = false;
    }
    assert.equal(
      page.questions[1].renderWidth,
      "20%",
      "the width is 20%"
    );
    page.questions[1].width = "100";
    assert.equal(page.questions[1].renderWidth, "100px", "the width in px");
    page.questions[1].width = "120 px";
    assert.equal(
      page.questions[1].renderWidth,
      "120 px",
      "the width is not changed"
    );
    page.questions[1].width = "10%";
    page.questions[2].width = "120";
    assert.equal(
      page.questions[0].renderWidth,
      "calc((100% - 10% - 120px)/3)",
      "Use calc() function"
    );
    page.questions[3].visible = false;
    page.questions[4].visible = false;
    assert.equal(
      page.questions[0].renderWidth,
      "calc(100% - 10% - 120px)",
      "Do not calc on 1"
    );
  }
);
QUnit.test("Rendered width when all widths for questions are set", function (
  assert
) {
  var page = new PageModel();
  page.addNewQuestion("text", "q1");
  var panel = page.addNewPanel("panel1");
  panel.startWithNewLine = false;
  panel.addNewQuestion("text", "q2");
  page.elements[0].width = "20em";
  assert.equal(page.elements[0].renderWidth, "20em", "q1.renderedWidth");
  assert.equal(
    panel.renderWidth,
    "calc(100% - 20em)",
    "panel1.renderedWidth, calculated"
  );
  panel.width = "calc(100% - 40px)";
  assert.equal(
    panel.renderWidth,
    "calc(100% - 40px)",
    "panel1.renderedWidth, from width"
  );
});
QUnit.test("panel.rederWidth, load from JSON", function (assert) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "text",
        name: "q1",
        width: "120px",
      },
      {
        type: "panel",
        name: "panel1",
        width: "calc(90% - 130px)",
        startWithNewLine: false,
        elements: [
          {
            type: "text",
            name: "q2",
          },
        ],
      },
    ],
  });
  var q1 = survey.getQuestionByName("q1");
  var panel1 = <PanelModel>survey.getPanelByName("panel1");
  assert.equal(q1.renderWidth, "120px", "question.renderWidth is fine");
  assert.equal(
    panel1.width,
    "calc(90% - 130px)",
    "panel1.width loaded correctly"
  );
  assert.equal(
    panel1.renderWidth,
    "calc(90% - 130px)",
    "panel.renderWidth is fine"
  );
});
QUnit.test(
  "Render width should work for strings only - https://surveyjs.answerdesk.io/ticket/details/T2273",
  function (assert) {
    var page = new PageModel();
    var question = <any>page.addNewQuestion("text", "q1");
    question.width = 300;

    assert.equal(
      question.renderWidth,
      "100%",
      "the render width is 100%"
    );
  }
);
QUnit.test("test goNextPageAutomatic property", function (assert) {
  var survey = twoPageSimplestSurvey();

  var dropDownQ = <QuestionDropdownModel>(
    survey.pages[1].addNewQuestion("dropdown", "question5")
  );
  dropDownQ.choices = [1, 2, 3];
  dropDownQ.hasOther = true;
  survey.goNextPageAutomatic = true;
  assert.equal(
    survey.currentPage.name,
    survey.pages[0].name,
    "the first page is default page"
  );
  survey.setValue("question1", 1);
  survey.setValue("question2", 2);
  assert.equal(
    survey.currentPage.name,
    survey.pages[1].name,
    "go to the second page automatically"
  );
  (<Question>survey.currentPage.questions[0]).value = "3";
  (<Question>survey.currentPage.questions[1]).value = "4";
  dropDownQ.value = dropDownQ.otherItem.value;
  assert.equal(
    survey.currentPage.name,
    survey.pages[1].name,
    "stay on the second page"
  );
  assert.notEqual(survey.state, "completed", "survey is still running");
  dropDownQ.comment = "other value";
  assert.notEqual(survey.state, "completed", "survey is still running #2");
  dropDownQ.value = 1;
  assert.equal(survey.state, "completed", "complete the survey");
});
QUnit.test("test goNextPageAutomatic property for boolean/switch", function (
  assert
) {
  var survey = new SurveyModel({
    goNextPageAutomatic: true,
    pages: [
      {
        elements: [{ type: "boolean", name: "q1" }],
      },
      {
        elements: [
          {
            name: "q2",
            type: "text",
          },
        ],
      },
    ],
  });

  survey.goNextPageAutomatic = true;
  assert.equal(
    survey.currentPage.name,
    survey.pages[0].name,
    "the first page is default page"
  );
  survey.setValue("q1", true);
  assert.equal(
    survey.currentPage.name,
    survey.pages[1].name,
    "go to the second page automatically"
  );
  survey.clear();
  survey.getQuestionByName("q1").renderAs = "checkbox";
  assert.equal(
    survey.currentPage.name,
    survey.pages[0].name,
    "the first page is default page, #2"
  );
  survey.setValue("q1", true);
  assert.equal(
    survey.currentPage.name,
    survey.pages[0].name,
    "we do not go to the second page automatically, #2"
  );
});
QUnit.test(
  "test goNextPageAutomatic property - 'autogonext' - go next page automatically but do not submit",
  function (assert) {
    var survey = twoPageSimplestSurvey();

    var dropDownQ = <QuestionDropdownModel>(
      survey.pages[1].addNewQuestion("dropdown", "question5")
    );
    dropDownQ.choices = [1, 2, 3];
    dropDownQ.hasOther = true;
    survey.goNextPageAutomatic = true;
    assert.equal(
      survey.currentPage.name,
      survey.pages[0].name,
      "the first page is default page"
    );
    survey.setValue("question1", 1);
    survey.setValue("question2", 2);
    assert.equal(
      survey.currentPage.name,
      survey.pages[1].name,
      "go to the second page automatically"
    );
    (<Question>survey.currentPage.questions[0]).value = "3";
    (<Question>survey.currentPage.questions[1]).value = "4";
    dropDownQ.value = dropDownQ.otherItem.value;
    assert.equal(
      survey.currentPage.name,
      survey.pages[1].name,
      "stay on the second page"
    );
    assert.notEqual(survey.state, "completed", "survey is still running");
    dropDownQ.comment = "other value";
    assert.notEqual(survey.state, "completed", "survey is still running");
  }
);
QUnit.test("test goNextPageAutomatic property - 'autogonext' - load from survey", function (assert) {
  const survey = new SurveyModel({
    goNextPageAutomatic: "autogonext",
    elements: [
      { type: "text", name: "q1" }
    ]
  });
  assert.equal(survey.goNextPageAutomatic, true, "goNextPageAutomatic set to autogonext on loading correctly");
});
QUnit.test("test goNextPageAutomatic after errors", function (assert) {
  var survey = twoPageSimplestSurvey();

  survey.goNextPageAutomatic = true;
  (<Question>survey.getQuestionByName("question2")).isRequired = true;
  assert.equal(
    survey.currentPage.name,
    survey.pages[0].name,
    "the first page is default page"
  );
  survey.setValue("question1", 1);
  survey.nextPage();
  assert.equal(
    survey.currentPage.name,
    survey.pages[0].name,
    "we are still on the first page. There are errors."
  );
  survey.setValue("question2", 2);
  assert.equal(
    survey.currentPage.name,
    survey.pages[1].name,
    "go to the second page automatically"
  );
});
QUnit.test("goNextPageAutomatic: should not work for complex questions like matrix, checkbox, multiple text", function (assert) {
  var questions = new Array<any>();
  questions.push({
    question: new QuestionCheckboxModel("check"),
    auto: false,
    value: [1],
  });
  questions.push({
    question: new QuestionRadiogroupModel("radio"),
    auto: true,
    value: 1,
  });
  questions.push({
    question: new QuestionDropdownModel("dropdown"),
    auto: true,
    value: 1,
  });
  questions.push({
    question: new QuestionCommentModel("comment"),
    auto: false,
    value: "1",
  });
  questions.push({
    question: new QuestionFileModel("file"),
    auto: false,
    value: "1",
  });
  questions.push({
    question: new QuestionFileModel("html"),
    auto: false,
    value: null,
  });

  var matrix = new QuestionMatrixModel("matrix");
  matrix.rows = ["row1", "row2"];
  matrix.columns = ["col1", "col2"];
  questions.push({ question: matrix, auto: false, value: { row1: "col1" } });
  questions.push({
    question: matrix,
    auto: true,
    value: { row1: "col1", row2: "col1" },
  });

  var dropDownMatrix = new QuestionMatrixDropdownModel("matrixdropdown");
  dropDownMatrix.addColumn("col1");
  dropDownMatrix.rows = ["row1", "row2"];
  questions.push({
    question: dropDownMatrix,
    auto: false,
    value: { row1: { col1: 1 } },
  });
  questions.push({
    question: dropDownMatrix,
    auto: true,
    value: { row1: { col1: 1 }, row2: { col1: 2 } },
  });

  var dynamicMatrix = new QuestionMatrixDynamicModel("matrixdynamic");
  dynamicMatrix.addColumn("col1");
  dynamicMatrix.rowCount = 2;
  questions.push({
    question: dynamicMatrix,
    auto: false,
    value: [{ col1: 1 }],
  });
  questions.push({
    question: dynamicMatrix,
    auto: false,
    value: [{ col1: 1 }, { col1: 1 }],
  });

  var multipleText = new QuestionMultipleTextModel("multitext");
  multipleText.addItem("t1");
  multipleText.addItem("t2");
  questions.push({ question: multipleText, auto: false, value: { t1: "1" } });
  questions.push({
    question: multipleText,
    auto: true,
    value: { t1: "1", t2: "2" },
  });

  questions.push({
    question: new QuestionRatingModel("rating"),
    auto: true,
    value: 1,
  });
  questions.push({
    question: new QuestionTextModel("text"),
    auto: true,
    value: "1",
  });

  var pageIndex = 0;
  for (var i = 0; i < questions.length; i++) {
    var q = questions[i];
    var survey = new SurveyModel();
    var page = survey.addNewPage("firstpage");
    page.addQuestion(q.question);
    survey.goNextPageAutomatic = true;
    if (q.value) {
      q.question.onMouseDown();
      q.question.value = q.value;
    }
    var state = q.auto ? "completed" : "running";
    assert.equal(
      survey.state,
      state,
      "goNextPageAutomatic is incorrect for question: " + q.question.name
    );
  }
});
QUnit.test(
  "goNextPageAutomatic bug #200: https://github.com/surveyjs/surveyjs/issues/200",
  function (assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("page1");
    page.addNewQuestion("html", "q1");
    var q2 = <QuestionDropdownModel>page.addNewQuestion("dropdown", "q2");
    q2.choices = [1, 2, 3];
    page = survey.addNewPage("page2");
    page.addNewQuestion("text", "q3");
    survey.goNextPageAutomatic = true;
    (<Question>survey.getQuestionByName("q2")).value = 1;
    assert.equal(
      survey.currentPage.name,
      survey.pages[1].name,
      "go to the next page"
    );
  }
);

QUnit.test(
  "goNextPageAutomatic and clearInvisibleValues bug #252: https://github.com/surveyjs/surveyjs/issues/252",
  function (assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("page1");
    var q1 = <QuestionDropdownModel>page.addNewQuestion("dropdown", "q1");
    q1.choices = [1, 2, 3];
    var q2 = <QuestionDropdownModel>page.addNewQuestion("dropdown", "q2");
    q2.visible = false;
    q2.value = 1;
    survey.goNextPageAutomatic = true;
    survey.clearInvisibleValues = true;
    (<Question>survey.getQuestionByName("q1")).value = 1;
    assert.equal(survey.state, "completed");
  }
);
QUnit.test("goNextPageAutomatic and autoAdvanceAllowComplete=false", function (assert) {
  const emptySurvey = new SurveyModel();
  assert.equal(emptySurvey.autoAdvanceAllowComplete, true, "autoAdvanceAllowComplete value # 1");
  const survey = new SurveyModel({
    pages: [
      { elements: [{ type: "dropdown", name: "q1", choices: [1, 2, 3] }] },
      { elements: [{ type: "dropdown", name: "q2", choices: [1, 2, 3] }] }
    ],
    goNextPageAutomatic: true,
    allowCompleteSurveyAutomatic: false
  });
  assert.equal(survey.autoAdvanceAllowComplete, false, "autoAdvanceAllowComplete value # 2");
  const q1 = survey.getQuestionByName("q1");
  const q2 = survey.getQuestionByName("q2");
  assert.equal(survey.currentPageNo, 0, "curPage #1");
  q1.value = 1;
  assert.equal(survey.currentPageNo, 1, "curPage #2");
  q2.value = 1;
  assert.equal(survey.currentPageNo, 1, "curPage #2");
});

QUnit.test("goNextPageAutomatic and checkbox wiht valueName bug #70", function (
  assert
) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("page1");
  var q1 = <QuestionDropdownModel>page.addNewQuestion("checkbox", "q1");
  q1.valueName = "v"; //this line produce the issue
  q1.choices = [1, 2, 3];
  survey.goNextPageAutomatic = true;
  (<Question>survey.getQuestionByName("q1")).value = [1];
  assert.notEqual(survey.state, "completed", "it should not be completed");
});

QUnit.test("isNavigationButtonsShowing", function (assert) {
  var survey = twoPageSimplestSurvey();
  assert.equal(
    survey.isNavigationButtonsShowing,
    "bottom",
    "by default buttons are shown"
  );
  assert.equal(
    survey.isNavigationButtonsShowingOnBottom,
    true,
    "by default buttons are shown, #bottom"
  );
  assert.equal(
    survey.isNavigationButtonsShowingOnTop,
    false,
    "by default buttons are shown, #top"
  );
  survey.setDesignMode(true);
  assert.equal(
    survey.isNavigationButtonsShowing,
    "none",
    "do not show buttons at design time"
  );
  assert.equal(
    survey.isNavigationButtonsShowingOnBottom,
    false,
    "do not show buttons at design time, #bottom"
  );
  assert.equal(
    survey.isNavigationButtonsShowingOnTop,
    false,
    "do not show buttons at design time, #top"
  );
  survey.setDesignMode(false);
  assert.equal(
    survey.isNavigationButtonsShowing,
    "bottom",
    "by default buttons are shown"
  );
  assert.equal(
    survey.isNavigationButtonsShowingOnBottom,
    true,
    "by default buttons are shown, #bottom"
  );
  assert.equal(
    survey.isNavigationButtonsShowingOnTop,
    false,
    "by default buttons are shown, #top"
  );
  survey.showNavigationButtons = false;
  assert.equal(
    survey.isNavigationButtonsShowing,
    "none",
    "showNavigationButtons = none"
  );
  assert.equal(
    survey.isNavigationButtonsShowingOnBottom,
    false,
    "showNavigationButtons = none, #bottom"
  );
  assert.equal(
    survey.isNavigationButtonsShowingOnTop,
    false,
    "showNavigationButtons = none, #top"
  );
  survey.pages[0].navigationButtonsVisibility = "show";
  assert.equal(
    survey.isNavigationButtonsShowing,
    "bottom",
    "navigationButtonsVisibility = 'show' && showNavigationButtons = false"
  );
  assert.equal(
    survey.isNavigationButtonsShowingOnBottom,
    true,
    "navigationButtonsVisibility = 'show' && showNavigationButtons = false, #bottom"
  );
  assert.equal(
    survey.isNavigationButtonsShowingOnTop,
    false,
    "navigationButtonsVisibility = 'show' && showNavigationButtons = false, #top"
  );
  survey.showNavigationButtons = true;
  survey.pages[0].navigationButtonsVisibility = "hide";
  assert.equal(
    survey.isNavigationButtonsShowing,
    "none",
    "navigationButtonsVisibility = 'hide' && showNavigationButtons = true"
  );
  assert.equal(
    survey.isNavigationButtonsShowingOnBottom,
    false,
    "navigationButtonsVisibility = 'hide' && showNavigationButtons = true, #bottom"
  );
  survey.showNavigationButtons = true;
  survey.pages[0].navigationButtonsVisibility = "inherit";
  assert.equal(
    survey.isNavigationButtonsShowing,
    "bottom",
    "navigationButtonsVisibility = 'inherit' && showNavigationButtons = true"
  );
  assert.equal(
    survey.isNavigationButtonsShowingOnBottom,
    true,
    "navigationButtonsVisibility = 'inherit' && showNavigationButtons = true, #bottom"
  );

  survey.showNavigationButtons = "both";
  assert.equal(
    survey.isNavigationButtonsShowing,
    "both",
    "navigationButtonsVisibility = 'inherit' && showNavigationButtons = both"
  );
  assert.equal(
    survey.isNavigationButtonsShowingOnBottom,
    true,
    "navigationButtonsVisibility = 'inherit' && showNavigationButtons = both, #bottom"
  );
  assert.equal(
    survey.isNavigationButtonsShowingOnTop,
    true,
    "navigationButtonsVisibility = 'inherit' && showNavigationButtons = both, #top"
  );

  survey.showNavigationButtons = "top";
  assert.equal(
    survey.isNavigationButtonsShowing,
    "top",
    "navigationButtonsVisibility = 'inherit' && showNavigationButtons = top"
  );
  assert.equal(
    survey.isNavigationButtonsShowingOnBottom,
    false,
    "navigationButtonsVisibility = 'inherit' && showNavigationButtons = top, #bottom"
  );
  assert.equal(
    survey.isNavigationButtonsShowingOnTop,
    true,
    "navigationButtonsVisibility = 'inherit' && showNavigationButtons = top, #top"
  );
});

QUnit.test("simple condition test", function (assert) {
  var survey = new SurveyModel({
    pages: [
      {
        name: "page1",
        questions: [
          { type: "checkbox", name: "q1", choices: ["yes", "no"] },
          { type: "checkbox", name: "q2", choices: ["yes", "no"] },
        ],
      },
      {
        name: "page2",
        visibleIf: "{q1} = 'yes' or {q2} = 'no'",
        questions: [
          {
            type: "text",
            name: "q3",
            visibleIf: "{q1} = 'yes' and {q2} = 'no'",
          },
          { type: "text", name: "q4" },
        ],
      },
    ],
  });
  var q3 = survey.getQuestionByName("q3");
  assert.equal(
    survey.pages[1].visible,
    false,
    "initially the page becomes invisible"
  );
  assert.equal(q3.visible, false, "initially q3 becomes invisible");
  survey.setValue("q1", "yes");
  survey.setValue("q2", "no");
  assert.equal(
    survey.pages[1].visible,
    true,
    "the page becomes visible, q1 = 'yes'"
  );
  assert.equal(
    q3.visible,
    true,
    "q3 becomes visible, q1 = 'yes' and q2 = 'no'"
  );
  survey.setValue("q2", "yes");
  assert.equal(
    survey.pages[1].visible,
    true,
    "the page becomes visible, q1 = 'yes'"
  );
  assert.equal(
    q3.visible,
    false,
    "q3 becomes invisible, q1 = 'yes' and q2 = 'yes'"
  );
  survey.setValue("q1", "no");
  assert.equal(
    survey.pages[1].visible,
    false,
    "the page becomes invisible, q1 = 'no'"
  );
  assert.equal(
    q3.visible,
    false,
    "q3becomes invisible, q1 = 'no' and q2 = 'yes'"
  );
});

QUnit.test("simple condition test, page visibility", function (assert) {
  var survey = new SurveyModel({
    pages: [
      {
        name: "page1",
        questions: [{ type: "checkbox", name: "q1", choices: ["yes", "no"] }],
      },
      {
        name: "page2",
        visibleIf: "{q1} contains 'yes'",
        questions: [{ type: "text", name: "q3" }],
      },
    ],
  });
  var page2 = survey.getPageByName("page2");
  assert.equal(page2.visible, false, "the initial page2 is invisible");
  survey.setValue("q1", ["yes"]);
  assert.equal(page2.visible, true, "the page becomes visible, q1 = 'yes'");
});
QUnit.test("Re-run condition on changing the variable", function (assert) {
  var survey = new SurveyModel({
    pages: [
      {
        name: "page1",
        questions: [{ type: "text", name: "q1", visibleIf: "{var1} = 1" }],
      },
    ],
  });
  var q1 = survey.getQuestionByName("q1");
  assert.equal(
    q1.isVisible,
    false,
    "var1 is not exists, question is invisible"
  );
  survey.setVariable("var1", 1);
  assert.equal(q1.isVisible, true, "var1 equals 1, question is visible");
  survey.setVariable("var1", 2);
  assert.equal(
    q1.isVisible,
    false,
    "var1 equals 2, question is not visible now"
  );
});

QUnit.test("visibleIf for question, call onPageVisibleChanged", function (
  assert
) {
  var survey = new SurveyModel({
    pages: [
      {
        name: "page1",
        questions: [{ type: "checkbox", name: "q1", choices: ["yes", "no"] }],
      },
      {
        name: "page2",
        questions: [
          { type: "text", name: "q3", visibleIf: "{q1} contains 'yes'" },
        ],
      },
    ],
  });
  var counter = 0;
  survey.onPageVisibleChanged.add(function () {
    counter++;
  });
  assert.equal(
    survey.pages[0].isVisible,
    true,
    "first page visible by children"
  );
  assert.equal(
    survey.pages[1].isVisible,
    false,
    "second page is not visible by children"
  );
  assert.equal(counter, 0, "nothing happens");
  survey.setValue("q1", ["yes"]);
  assert.equal(counter, 1, "calls one time");
  survey.setValue("q1", ["no"]);
  assert.equal(counter, 2, "calls second time");
  survey.setValue("q1", []);
  assert.equal(counter, 2, "nothing happens");
});
QUnit.test(
  "visibleIf, expression custom function has property this.survey",
  function (assert) {
    function isAllChecksSet(params: any[]): any {
      if (!params && params.length !== 1) return false;
      var q = this.survey.getQuestionByName(params[0]);
      if (!q) return false;
      var val = q.value;
      if (!val || !Array.isArray(val)) return false;
      return val.length == q.visibleChoices.length;
    }
    FunctionFactory.Instance.register("isAllChecksSet", isAllChecksSet);
    var survey = new SurveyModel({
      questions: [
        { type: "checkbox", name: "q1", choices: ["yes", "no"] },
        { type: "text", name: "q2", visibleIf: "isAllChecksSet('q1') == true" },
      ],
    });
    var q = survey.getQuestionByName("q2");
    assert.equal(q.isVisible, false, "all checks are unset");
    survey.setValue("q1", ["yes", "no"]);
    assert.equal(q.isVisible, true, "all checks are set");
    survey.setValue("q1", ["yes"]);
    assert.equal(q.isVisible, false, "not all checks are set");
    FunctionFactory.Instance.unregister("isAllChecksSet");
  }
);
QUnit.test("visibleIf, bug#729", function (assert) {
  var survey = new SurveyModel({
    questions: [
      {
        choices: [
          { value: "true", text: "Yes" },
          { value: "false", text: "No" },
        ],
        type: "radiogroup",
        name: "q1",
      },
      { type: "text", name: "q2", visibleIf: "{q1} = 'true'" },
    ],
  });
  var q1 = <Question>survey.getQuestionByName("q1");
  var q2 = survey.getQuestionByName("q2");
  assert.equal(q2.visible, false, "q2 is not visible by default");
  q1.value = "true";
  assert.equal(q2.visible, true, "q2 should be visible now");
  q1.value = "false";
  assert.equal(q2.visible, false, "q2 should be invisible again");
});
QUnit.test("visibleIf, Does not work with 0, bug#1792", function (assert) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "radiogroup",
        name: "q1",
        choices: ["0", "1", "2"],
      },
      {
        type: "radiogroup",
        name: "q2",
        choices: [0, 1, 2],
      },
      {
        type: "comment",
        name: "q3",
        visibleIf: "{q1} notempty",
      },
      {
        type: "comment",
        name: "q4",
        visibleIf: "{q2} notempty",
      },
    ],
  });
  var q3 = <Question>survey.getQuestionByName("q3");
  var q4 = <Question>survey.getQuestionByName("q4");
  survey.data = { q1: "0", q2: 0 };
  assert.equal(q3.isVisible, true, "'0' is not empty");
  assert.equal(q4.isVisible, true, "0 is not empty");
});
QUnit.test("visibleIf, allow dot in question name", function (assert) {
  var survey = new SurveyModel({
    questions: [
      {
        choices: [
          { value: "true", text: "Yes" },
          { value: "false", text: "No" },
        ],
        type: "radiogroup",
        name: "q1.a",
      },
      { type: "text", name: "q2", visibleIf: "{q1.a} = 'true'" },
    ],
  });
  var q1 = <Question>survey.getQuestionByName("q1.a");
  var q2 = survey.getQuestionByName("q2");
  assert.equal(q2.visible, false, "q2 is not visible by default");
  q1.value = "true";
  assert.equal(q2.visible, true, "q2 should be visible now");
  q1.value = "false";
  assert.equal(q2.visible, false, "q2 should be invisible again");
});
QUnit.test("visibleIf, Does not work with many dots", function (assert) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "radiogroup",
        name: "a.b.c.d",
        choices: [0, 1, 2],
      },
      {
        type: "text",
        name: "q2",
        visibleIf: "{a.b.c.d} = 1",
      },
    ],
  });
  var q1 = <Question>survey.getQuestionByName("a.b.c.d");
  var q2 = <Question>survey.getQuestionByName("q2");
  assert.equal(q2.isVisible, false, "q2 is invisible by default");
  q1.value = 1;
  assert.equal(q2.isVisible, true, "q2 is visible now");
});
QUnit.test("visibleIf, Does not work with many dots (2)", function (assert) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "radiogroup",
        name: "a.b",
        choices: [0, 1, 2],
      },
      {
        type: "radiogroup",
        name: "a.b.c.d",
        choices: [0, 1, 2],
      },
      {
        type: "text",
        name: "q2",
        visibleIf: "{a.b.c.d} = 1",
      },
    ],
  });
  var q1 = <Question>survey.getQuestionByName("a.b.c.d");
  var q2 = <Question>survey.getQuestionByName("q2");
  assert.equal(q2.isVisible, false, "q2 is invisible by default");
  q1.value = 1;
  assert.equal(q2.isVisible, true, "q2 is visible now");
});
QUnit.test("visibleIf, Does not work with many dots (3)", function (assert) {
  var survey = new SurveyModel({
    questions: [
      {
        name: "application.contactMethod",
        type: "text",
      },
      {
        name: "application.contactMethod.Notification.Number",
        type: "text",
      },
      {
        name: "q3",
        type: "text",
        visibleIf: "{application.contactMethod.Notification.Number}>2",
      },
    ],
  });
  var q1 = <Question>survey.getQuestionByName("application.contactMethod");
  var q2 = <Question>(
    survey.getQuestionByName("application.contactMethod.Notification.Number")
  );
  var q3 = <Question>survey.getQuestionByName("q3");
  assert.equal(q3.isVisible, false, "q3 is invisible by default");
  q1.value = 1;
  q2.value = 3;
  assert.equal(q3.isVisible, true, "q3 is visible now");
});

QUnit.test("enableIf for question", function (assert) {
  var survey = new SurveyModel({
    pages: [
      {
        name: "page1",
        questions: [
          { type: "checkbox", name: "q1", choices: ["yes", "no"] },
          { type: "text", name: "q2", enableIf: "{q1} contains 'yes'" },
        ],
      },
    ],
  });
  var q2 = <Question>survey.getQuestionByName("q2");
  assert.equal(q2.isReadOnly, true, "It is readonly initially");
  survey.setValue("q1", ["yes"]);
  assert.equal(q2.isReadOnly, false, "It is not readonly now");
});

QUnit.test("enableIf for matrix questions, Bug#736", function (assert) {
  var survey = new SurveyModel({
    questions: [
      {
        type: "matrixdropdown",
        name: "q1",
        columns: [
          { name: "using", choices: ["Yes", "No"], cellType: "radiogroup" },
        ],
        rows: [{ value: "angularv1" }],
      },
      {
        type: "matrixdropdown",
        name: "q2",
        columns: [
          { name: "using", choices: ["Yes", "No"], cellType: "radiogroup" },
        ],
        rows: [{ value: "angularv2" }, { value: "angularv4" }],
      },
    ],
  });
  var qVisible = null;
  var qEnable = null;
  survey.onMatrixCellCreated.add(function (survey, options) {
    if (options.row.rowName == "angularv2" && options.columnName == "using") {
      qVisible = options.cellQuestion;
      qVisible.visibleIf = "{q1.angularv1.using} = 'Yes'";
    }
    if (options.row.rowName == "angularv4" && options.columnName == "using") {
      qEnable = options.cellQuestion;
      qEnable.enableIf = "{q1.angularv1.using} = 'Yes'";
    }
  });
  var q1 = <QuestionMatrixDropdownModel>survey.getQuestionByName("q1");
  var q2 = <QuestionMatrixDropdownModel>survey.getQuestionByName("q2");
  var rows1 = q1.visibleRows;
  var rows2 = q2.visibleRows;
  assert.ok(qVisible, "visibleIf is set");
  assert.ok(qEnable, "enableIf is set");
  assert.equal(qVisible.visible, false, "The question is invisible on start");
  assert.equal(qEnable.readOnly, true, "The question is readOnly on start");
  rows1[0].cells[0].question.value = "Yes";
  assert.equal(qVisible.visible, true, "The question is visible now");
  assert.equal(qEnable.readOnly, false, "The question is enabled now");
});

QUnit.test(
  "isRequired test, empty array https://github.com/surveyjs/surveyjs/issues/362",
  function (assert) {
    var survey = new SurveyModel({
      pages: [
        {
          name: "page1",
          questions: [
            {
              type: "checkbox",
              isRequired: true,
              name: "q1",
              choices: ["yes", "no"],
            },
          ],
        },
      ],
    });

    var page1 = survey.getPageByName("page1");
    var q1 = <Question>(<Question>page1.questions[0]);
    q1.value = [];
    assert.equal(page1.hasErrors(), true, "There is a required error");
    q1.value = ["yes"];
    assert.equal(page1.hasErrors(), false, "There is no required error");
  }
);

QUnit.test("multiple triger on checkbox stop working.", function (assert) {
  var survey = new SurveyModel({
    pages: [
      {
        questions: [
          {
            type: "checkbox",
            name: "question1",
            choices: ["one", "two", "three"],
          },
          { type: "text", name: "question2", visible: false },
          { type: "text", name: "question3", visible: false },
          { type: "text", name: "question4", visible: false },
        ],
      },
    ],
    triggers: [
      {
        type: "visible",
        operator: "contains",
        value: "one",
        name: "question1",
        questions: ["question2"],
      },
      {
        type: "visible",
        operator: "contains",
        value: "two",
        name: "question1",
        questions: ["question3"],
      },
    ],
  });

  var check = <QuestionCheckboxModel>survey.getQuestionByName("question1");
  var value = ["one"];
  check.value = value;
  assert.equal(
    survey.getQuestionByName("question2").visible,
    true,
    "The second question is visible"
  );
  value.push("two");
  check.value = value;
  assert.equal(
    survey.getQuestionByName("question3").visible,
    true,
    "The third question is visible"
  );
});

QUnit.test(
  "QuestionCheckbox if single value set then convert it to array, #334",
  function (assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("page1");
    var q1 = <QuestionCheckboxModel>page.addNewQuestion("checkbox", "q1");
    survey.setValue("q1", [1]);
    assert.deepEqual(
      survey.getValue("q1"),
      [1],
      "survey.getValue returns array"
    );
    assert.deepEqual(q1.value, [1], "q1.value returns array");
    survey.setValue("q1", 1);
    assert.deepEqual(survey.getValue("q1"), 1, "survey.getValue return value");
    assert.deepEqual(q1.value, [1], "q1.value still returns array");
  }
);

QUnit.test("visibleIf and page rows", function (assert) {
  var survey = new SurveyModel({
    pages: [
      {
        name: "component",
        questions: [
          {
            type: "dropdown",
            choices: [
              { value: "app", text: "Application / Web" },
              { value: "database", text: "Database" },
            ],
            name: "component",
            title: "Component Type",
          },
          {
            type: "dropdown",
            choices: [
              { value: "windows", text: "Windows" },
              { value: "linux", text: "Linux" },
            ],
            name: "componentOs",
            title: "Which operating system are you using?",
            visible: false,
            visibleIf: "{component} = 'app' ",
          },
          {
            type: "text",
            name: "question1",
            title: "Question 1",
            visible: false,
            visibleIf: "{component} = 'app' ",
          },
          {
            type: "text",
            name: "question2",
            title: "Question 2",
            visible: false,
            visibleIf: "{component} = 'app' ",
          },
          {
            type: "text",
            name: "database",
            title: "Database name",
            visible: false,
            visibleIf: "{component} = 'database' ",
          },
        ],
      },
    ],
    questionTitleTemplate: "{title} {require}:",
    requiredText: "(*)",
    sendResultOnPageNext: true,
    showQuestionNumbers: "off",
  });
  var page = survey.currentPage;
  assert.equal(page.rows.length, 5);

  survey.setValue("component", "app");
  assert.equal(page.rows[1].visible, true);
  assert.equal(page.rows[4].visible, false);

  survey.setValue("component", "database");
  assert.equal(page.rows[1].visible, false);
  assert.equal(page.rows[4].visible, true);

  survey.setValue("component", "app");
  assert.equal(page.rows[1].visible, true);
  assert.equal(page.rows[4].visible, false);
});
QUnit.test("assign customWidgets to questions", function (assert) {
  CustomWidgetCollection.Instance.clear();
  CustomWidgetCollection.Instance.addCustomWidget({
    name: "first",
    isFit: (question) => {
      return question.name == "question2";
    },
  });
  CustomWidgetCollection.Instance.addCustomWidget({
    name: "second",
    isFit: (question) => {
      return (<Question>question).getType() == "checkbox";
    },
  });
  var survey = twoPageSimplestSurvey();
  survey.pages[0].addNewQuestion("checkbox", "question5");
  assert.equal(survey.currentPageNo, 0, "the first page is chosen");
  assert.equal(
    (<Question>survey.getQuestionByName("question1")).customWidget,
    null,
    "there is no custom widget for this question"
  );
  assert.equal(
    (<Question>survey.getQuestionByName("question2")).customWidget.name,
    "first",
    "has the first custom widget"
  );
  assert.equal(
    (<Question>survey.getQuestionByName("question5")).customWidget.name,
    "second",
    "has the second custom widget"
  );
  CustomWidgetCollection.Instance.clear();
});
QUnit.test("customWidgets activation types changed", function (assert) {
  CustomWidgetCollection.Instance.clear();
  var lastActivatedBy = "";
  var customWidgetJSON = {
    name: "widget1",
    isFit: (question) => {
      return question.name == "question2";
    },
    activatedByChanged: (activatedBy) => {
      lastActivatedBy = activatedBy;
    },
  };
  CustomWidgetCollection.Instance.addCustomWidget(customWidgetJSON);
  assert.equal(
    lastActivatedBy,
    "property",
    "activatedBy set to 'property' by default"
  );
  CustomWidgetCollection.Instance.setActivatedBy("widget1", "type");
  assert.equal(lastActivatedBy, "type", "activatedBy set to 'type'");
  CustomWidgetCollection.Instance.setActivatedBy("widget1", "customtype");
  assert.equal(
    lastActivatedBy,
    "customtype",
    "activatedBy set to 'customtype'"
  );
  CustomWidgetCollection.Instance.clear();
});

QUnit.test("assign customWidgets to matrix dynamic cell question", function (assert) {
  CustomWidgetCollection.Instance.clear();
  CustomWidgetCollection.Instance.addCustomWidget({
    name: "first",
    isFit: (question) => {
      return question["renderAs"] === "testwidget";
    },
  });
  const oldMartixDropdownRenderAsProperty = Serializer.getProperty("matrixdropdowncolumn", "renderAs");
  const oldDropdownRenderAsProperty = Serializer.getProperty("dropdown", "renderAs");

  Serializer.addProperty("matrixdropdowncolumn", "renderAs");
  Serializer.addProperty("dropdown", {
    name: "renderAs",
    default: "standard",
    choices: ["standard", "chosen"],
  });

  var survey = new SurveyModel({
    questions: [
      {
        type: "matrixdynamic",
        name: "Grid",
        columns: [
          { name: "Type", cellType: "dropdown", renderAs: "testwidget" },
          { name: "Quantity", cellType: "text", inputType: "number" },
        ],
      },
    ],
  });
  var q = <QuestionMatrixDynamicModel>survey.getAllQuestions()[0];
  var rows = q.visibleRows;
  assert.equal(
    rows[0].cells[0].question.customWidget.name,
    "first",
    "the first cell has custom widget"
  );
  assert.equal(
    rows[0].cells[1].question.customWidget,
    null,
    "the second cell has no custom widget"
  );

  Serializer.addProperty("matrixdropdowncolumn", oldMartixDropdownRenderAsProperty);
  Serializer.addProperty("dropdown", oldDropdownRenderAsProperty);

  CustomWidgetCollection.Instance.clear();
});

QUnit.test("customWidgets support displayValue", function (assert) {
  CustomWidgetCollection.Instance.clear();
  CustomWidgetCollection.Instance.addCustomWidget({
    name: "first",
    isFit: (question) => {
      return question.getType() == "text";
    },
    getDisplayValue: (question: Question): string => {
      if (question.value === 1) return "one";
      return "";
    },
  });
  var survey = twoPageSimplestSurvey();
  var question = survey.pages[0].addNewQuestion("text", "text");
  assert.equal(survey.currentPageNo, 0, "the first page is chosen");
  assert.equal(
    question.customWidget.name,
    "first",
    "has the first custom widget"
  );
  question.value = 1;
  assert.equal(
    question.displayValue,
    "one",
    "Use display value of custom widget"
  );
  CustomWidgetCollection.Instance.clear();
});

QUnit.test("customWidgets camel name", function (assert) {
  CustomWidgetCollection.Instance.clear();
  CustomWidgetCollection.Instance.addCustomWidget({
    name: "camelName",
    isFit: (question) => {
      return question.getType() == "camelname";
    },
  });
  if (!Serializer.findClass("camelName")) {
    Serializer.addClass("camelName", [], undefined, "text");
  }

  var survey = new SurveyModel({
    elements: [
      {
        type: "camelName",
        name: "q1",
      },
    ],
  });
  var question = <Question>survey.getQuestionByName("q1");
  assert.equal(
    question.customWidget.name,
    "camelName",
    "the custom custom widget is set"
  );
  CustomWidgetCollection.Instance.clear();
});
QUnit.test("Create custom widget from addQuestion", function (assert) {
  const cType = "newcustomwidget";
  CustomWidgetCollection.Instance.clear();
  CustomWidgetCollection.Instance.addCustomWidget({
    name: cType,
    isFit: (question) => {
      return question.getType() == cType;
    },
  });
  if (!Serializer.findClass(cType)) {
    Serializer.addClass(cType, [], undefined, "text");
    QuestionFactory.Instance.registerCustomQuestion(cType);
  }
  const survey = new SurveyModel();
  const page = survey.addNewPage("p1");
  const question = page.addNewQuestion(cType, "q1");
  assert.equal(question.name, "q1", "name is correct");
  assert.equal(question.getType(), cType, "type is correct");
  CustomWidgetCollection.Instance.clear();
  Serializer.removeClass(cType);
  QuestionFactory.Instance.unregisterElement(cType);
});
QUnit.test("ElementFactory.getAllToolboxTypes()", function (assert) {
  let defaultToolboxNames = ElementFactory.Instance.getAllToolboxTypes();
  let defaultNames = ElementFactory.Instance.getAllTypes();
  assert.deepEqual(defaultToolboxNames, defaultNames, "They are the same by default");
  const type = "toolbox-test-type";
  ElementFactory.Instance.registerElement(type, (name: string): IElement => { return new PanelModel(name); }, false);
  defaultToolboxNames = ElementFactory.Instance.getAllToolboxTypes();
  defaultNames = ElementFactory.Instance.getAllTypes();
  assert.equal(defaultToolboxNames.length + 1, defaultNames.length, "We do use the new type for toolbox");
  ElementFactory.Instance.unregisterElement(type);
});
QUnit.test("readOnlyCallback, bug #1818", function (assert) {
  CustomWidgetCollection.Instance.clear();
  var readOnlyCounter = 0;
  CustomWidgetCollection.Instance.addCustomWidget({
    name: "first",
    isFit: (question) => {
      var res = question.name == "question1";
      if (res) {
        question.readOnlyChangedCallback = () => {
          readOnlyCounter++;
        };
      }
      return res;
    },
  });
  var survey = new SurveyModel({
    elements: [
      {
        type: "panel",
        name: "panel1",
        enableIf: "{question1} != 1",
        elements: [{ type: "text", name: "question1" }],
      },
    ],
  });
  var panel = survey.getPanelByName("panel1");
  var question = survey.getQuestionByName("question1");
  assert.equal(question.customWidget.name, "first", "Custom widget is here");
  assert.equal(readOnlyCounter, 0, "Not called yet");
  question.readOnly = true;
  assert.equal(readOnlyCounter, 1, "question.readOnly = true");
  question.readOnly = false;
  assert.equal(readOnlyCounter, 2, "question.readOnly = false");
  assert.equal(panel.isReadOnly, false, "Panel is not readOnly");
  question.value = 1;
  assert.equal(panel.isReadOnly, true, "Panel is readOnly");
  assert.equal(readOnlyCounter, 3, "Panel is readOnly");
  question.value = 2;
  assert.equal(panel.isReadOnly, false, "Panel is not readOnly");
  assert.equal(readOnlyCounter, 4, "Panel is not readOnly");
  survey.mode = "display";
  assert.equal(readOnlyCounter, 5, "survey.mode = 'display'");
  survey.mode = "edit";
  assert.equal(readOnlyCounter, 6, "survey.mode = 'edit'");

  CustomWidgetCollection.Instance.clear();
});

QUnit.test(
  "Set 0 value for text inputType=number from survey. Bug #267",
  function (assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("Page 1");
    page.addNewQuestion("text", "question1");
    var question = <QuestionTextModel>page.questions[0];
    question.inputType = "number";
    assert.strictEqual(question.value, undefined, "undefined initial value");
    question.value = "0";
    assert.strictEqual(question.value, 0, "zero value");
  }
);

QUnit.test("Survey Localization - check question.title", function (assert) {
  var survey = twoPageSimplestSurvey();
  var q1 = <QuestionTextModel>survey.getQuestionByName("question1");
  q1.title = "val1";
  survey.locale = "de";
  q1.title = "de-val1";
  survey.locale = "fr";
  assert.equal(q1.title, "val1", "Use the default title");
  survey.locale = "de";
  assert.equal(q1.title, "de-val1", "Use 'de' title");
});

QUnit.test(
  "Survey Localization - check page/panel.title and processedTitle",
  function (assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("page1");
    var panel = page.addNewPanel("panel1");
    assert.equal(page.processedTitle, "", "page title is empty");
    assert.equal(panel.processedTitle, "", "panel title is empty");
    survey.setDesignMode(true);
    assert.equal(page.processedTitle, "", "page title is empty at design-time");
    assert.equal(panel.processedTitle, "[panel1]", "panel title uses name");
    page.title = "pageText";
    panel.title = "panelText";
    survey.locale = "de";
    page.title = "de-pageText";
    panel.title = "de-panelText";
    survey.locale = "fr";
    assert.equal(page.title, "pageText", "Use the default page title");
    assert.equal(panel.title, "panelText", "Use the default panel title");
    survey.locale = "de";
    assert.equal(page.title, "de-pageText", "Use the 'de' page title");
    assert.equal(panel.title, "de-panelText", "Use the 'de' panel title");
  }
);

QUnit.test("Survey Localization - dropdown.choices", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("Page 1");
  var q1 = <QuestionDropdownModel>page.addNewQuestion("dropdown", "question1");
  q1.choices = ["val1"];
  q1.choices[0].text = "text1";
  survey.locale = "de";
  q1.choices[0].text = "de-text1";
  assert.equal(q1.choices[0].text, "de-text1", "Use 'de' text");
  survey.locale = "fr";
  assert.equal(q1.choices[0].text, "text1", "Use the default text");
});

QUnit.test("Survey Localization - radiogroup.otheItem", function (assert) {
  var json = {
    questions: [
      {
        type: "radiogroup",
        name: "q1",
        hasOther: true,
        choices: [1, 2],
        otherText: {
          default: "Other",
          es: "Otro",
        },
      },
    ],
  };

  var survey = new SurveyModel(json);
  var q1 = <QuestionRadiogroupModel>survey.getQuestionByName("q1");

  assert.equal(
    q1.visibleChoices[2].locText.textOrHtml,
    "Other",
    "By default it is Other"
  );
  survey.locale = "es";
  assert.equal(
    q1.visibleChoices[2].locText.textOrHtml,
    "Otro",
    "Otro for Spanish"
  );
  survey.locale = "";
  assert.equal(
    q1.visibleChoices[2].locText.textOrHtml,
    "Other",
    "It is default again"
  );
  survey.locale = "es";
  assert.equal(
    q1.visibleChoices[2].locText.textOrHtml,
    "Otro",
    "It is Spanish again"
  );
  survey.locale = "";
});

QUnit.test("Survey Localization - matrix.columns", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("Page 1");
  var q1 = new QuestionMatrixModel("matrix");
  q1.columns = ["col1"];
  page.addQuestion(q1);

  q1.columns[0].text = "text1";
  survey.locale = "de";
  q1.columns[0].text = "de-text1";
  assert.equal(q1.columns[0].text, "de-text1", "Use 'de' text");
  survey.locale = "fr";
  assert.equal(q1.columns[0].text, "text1", "Use the default text");
});

QUnit.test("Survey Localization - dropdownmatrix.columns", function (assert) {
  const survey = new SurveyModel();
  const page = survey.addNewPage("Page 1");
  const q1 = new QuestionMatrixDropdownModel("matrixdropdown");
  const col1 = q1.addColumn("col1");
  q1.rows = ["row1", "row2"];
  page.addQuestion(q1);

  col1["choices"] = ["val1"];
  col1.title = "title1";
  col1["placeholder"] = "caption1";
  col1["choices"][0].text = "text1";
  survey.locale = "de";
  col1.title = "de-title1";
  col1["placeholder"] = "de-caption1";
  col1["choices"][0].text = "de-text1";
  assert.equal(col1.title, "de-title1", "Use 'de' text, title");
  assert.equal(
    col1["placeholder"],
    "de-caption1",
    "Use 'de' text, optionsCaption"
  );
  assert.equal(col1["choices"][0].text, "de-text1", "Use 'de' text, choices");
  survey.locale = "fr";
  assert.equal(col1.title, "title1", "Use default text, title");
  assert.equal(
    col1["placeholder"],
    "caption1",
    "Use default text, optionsCaption"
  );
  assert.equal(col1["choices"][0].text, "text1", "Use the default text");
});

QUnit.test("Survey Localization - multipletext.items", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("Page 1");
  var q1 = new QuestionMultipleTextModel("mText");
  var item = q1.addItem("item1");
  page.addQuestion(q1);
  item.title = "title1";
  item.placeHolder = "caption1";
  survey.locale = "de";
  item.title = "de-title1";
  item.placeHolder = "de-caption1";
  assert.equal(item.title, "de-title1", "Use 'de' text, title");
  assert.equal(item.placeHolder, "de-caption1", "Use 'de' text, placeHolder");
  survey.locale = "fr";
  assert.equal(item.title, "title1", "Use default text, title");
  assert.equal(item.placeHolder, "caption1", "Use default text, placeHolder");
});

QUnit.test(
  "Survey Localization - question.validators[].text, Bug#966",
  function (assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("Page 1");
    var q1 = new QuestionTextModel("q1");
    page.addQuestion(q1);
    var validator = new EmailValidator();
    q1.validators.push(validator);
    validator.text = "default-text";
    survey.locale = "de";
    validator.text = "de-text";
    assert.equal(validator.text, "de-text", "Use 'de' text");
    survey.locale = "fr";
    assert.equal(validator.text, "default-text", "Use default text");
    survey.locale = "";
  }
);

QUnit.test("survey.getUsedLocales()", function (assert) {
  var json = {
    title: {
      fr: "fr-title",
      en: "en-title",
    },
    pages: [
      {
        title: "My title",
        elements: [
          {
            type: "panel",
            elements: [
              {
                type: "multipletext",
                name: "q1",
                items: [
                  {
                    name: "q1_m1",
                    title: { default: "default-item", ru: "ru-item" },
                  },
                ],
              },
              {
                type: "text",
                name: "q2",
                validators: [{ type: "email", text: { es: "es-validator" } }],
              },
            ],
          },
          {
            type: "dropdown",
            name: "q3",
            choices: [{ val: 1, text: { gr: "gr-choice-text" } }],
          },
          {
            type: "matrixdropdown",
            name: "q4",
            columns: [
              {
                name: "col1",
                title: { pt: "pt-columns" },
                cellType: "dropdown",
                choices: [{ val: 1, text: { it: "it-choice-text" } }],
              },
            ],
          },
        ],
      },
    ],
  };
  var survey = new SurveyModel(json);
  assert.equal(surveyLocalization.defaultLocale, "en", "En is default locale");
  var locales = survey.getUsedLocales();
  const checkLocales = ["en", "fr", "es", "ru", "gr", "pt", "it"];
  assert.equal(locales.length, checkLocales.length, "Get all locales");
  for (var i = 0; i < checkLocales.length; i++) {
    assert.ok(
      locales.indexOf(checkLocales[i]) > -1,
      "Locale: " + checkLocales[i] + " not found"
    );
  }
});

QUnit.test(
  "Survey text preprocessing, dropdown/checkbox/radiogroup, issue #499",
  function (assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("Page 1");
    var q1 = <QuestionDropdownModel>page.addNewQuestion("dropdown", "q1");
    q1.choices = [
      { value: 1, text: "Item 1" },
      { value: 2, text: "Item 2" },
    ];
    var q2 = <QuestionCheckboxModel>page.addNewQuestion("checkbox", "q2");
    q2.choices = [
      { value: 3, text: "Item 3" },
      { value: 4, text: "Item 4" },
    ];
    var q3 = <Question>page.addNewQuestion("text", "q3");
    q3.title = "{q1}-{q2}";
    assert.equal(q3.locTitle.renderedHtml, "-", "There is no values");
    q1.value = 1;
    assert.equal(q3.locTitle.renderedHtml, "Item 1-", "Drop down value is set");
    q2.value = [3, 4];
    assert.equal(
      q3.locTitle.renderedHtml,
      "Item 1-Item 3, Item 4",
      "Drop down value is set"
    );
  }
);

QUnit.test(
  "Survey text preprocessing, zero value, issue https://surveyjs.answerdesk.io/ticket/details/t2493",
  function (assert) {
    var survey = new SurveyModel({
      questions: [
        { type: "text", name: "q1", inputType: "number" },
        { type: "text", name: "q2", title: "q1={q1}" },
      ],
    });
    var q1 = <Question>survey.getQuestionByName("q1");
    var q2 = <Question>survey.getQuestionByName("q2");
    q1.value = 0;
    assert.equal(
      q1.getDisplayValue(false),
      "0",
      "Return correct display value"
    );
    assert.equal(q2.locTitle.renderedHtml, "q1=0", "Not is not a null");
  }
);

QUnit.test("Survey text preprocessing, matrix, issue #499", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("Page 1");
  var q1 = <QuestionMatrixModel>page.addNewQuestion("matrix", "q1");
  q1.columns = [
    { value: 1, text: "Col 1" },
    { value: 2, text: "Col 2" },
  ];
  q1.rows = [
    { value: "row1", text: "Row 1" },
    { value: "row2", text: "Row 2" },
  ];
  var q2 = <Question>page.addNewQuestion("text", "q2");
  q2.title = "{q1.row1}";
  q1.value = { row1: 1, row2: 2 };
  assert.equal(q2.locTitle.renderedHtml, "Col 1", "Matrix use text");
});

QUnit.test("Survey text preprocessing, dropdown matrix, issue #499", function (
  assert
) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("Page 1");
  var q1 = <QuestionMatrixDropdownModel>(
    page.addNewQuestion("matrixdropdown", "q1")
  );
  q1.rows = [
    { value: "row1", text: "Row 1" },
    { value: "row2", text: "Row 2" },
  ];
  q1.columns = [];
  q1.addColumn("col1");
  q1.choices = [
    { value: 1, text: "Item 1" },
    { value: 2, text: "Item 2" },
  ];
  var q2 = <Question>page.addNewQuestion("text", "q2");
  q2.title = "{q1.row1.col1}";
  q1.value = { row1: { col1: 1 } };
  assert.equal(
    q2.locTitle.renderedHtml,
    "Item 1",
    "Dropdown Matrix Column use text"
  );
});

QUnit.test("Survey text preprocessing, dynamic matrix, issue #499", function (
  assert
) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("Page 1");
  var q1 = <QuestionMatrixDynamicModel>(
    page.addNewQuestion("matrixdynamic", "q1")
  );
  q1.rowCount = 2;
  q1.columns = [];
  q1.addColumn("col1");
  q1.choices = [
    { value: 1, text: "Item 1" },
    { value: 2, text: "Item 2" },
  ];
  var q2 = <Question>page.addNewQuestion("text", "q2");
  q2.title = "{q1[0].col1}";
  q1.value = [{ col1: 1 }, {}];
  assert.equal(
    q2.locTitle.renderedHtml,
    "Item 1",
    "Dropdown Matrix Column use text"
  );
});
QUnit.test("Survey text preprocessing with camella case, issue #913", function (
  assert
) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "text",
        name: "emailAddress",
        title: "uses uppercase",
      },
      {
        type: "text",
        name: "question1",
        title: "{emailAddress}",
      },
    ],
  });
  var question = <QuestionTextModel>survey.getQuestionByName("emailAddress");
  question.value = "john.snow@nightwatch.com";
  var question1 = <QuestionTextModel>survey.getQuestionByName("question1");
  assert.equal(
    question1.fullTitle,
    "john.snow@nightwatch.com",
    "The value is preprocessed correctly"
  );
});
QUnit.test("Survey text preprocessing complex data without question, issue #4434", function (
  assert
) {
  const survey = new SurveyModel({
    elements: [
      {
        type: "text",
        name: "q1",
        title: "{complex.value1}",
      }
    ]
  });
  survey.data = { complex: { value1: "complexText" } };
  const question = <QuestionTextModel>survey.getQuestionByName("q1");
  assert.equal(question.fullTitle, "complexText", "The complex value is preprocessed correctly");
});

QUnit.test("Survey text preprocessing: survey.onGetQuestionDisplayValue", function (assert) {
  const survey = new SurveyModel({
    elements: [
      { type: "text", name: "q1", title: "Q1" },
      { type: "text", name: "q2", title: "q1: {q1}" }
    ]
  });
  survey.onGetQuestionDisplayValue.add((sender, options) => {
    if (options.question.isEmpty()) {
      options.displayValue = "{" + options.question.title + "}";
    } else {
      options.displayValue = "[" + options.displayValue + "]";
    }
  });
  const q1 = survey.getQuestionByName("q1");
  const q2 = survey.getQuestionByName("q2");
  assert.equal(q1.displayValue, "{Q1}", "Empty value");
  assert.equal(q2.locTitle.renderedHtml, "q1: {Q1}", "title for empty value");
  q1.value = "val1";
  assert.equal(q1.displayValue, "[val1]", "value=val1");
  assert.equal(q2.locTitle.renderedHtml, "q1: [val1]", "title for value=val1");
});

QUnit.test("Survey Markdown - dropdown.choices", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("Page 1");
  var q1 = new QuestionDropdownModel("q1");
  page.addQuestion(q1);
  q1.choices = [
    { value: 1, text: "text1" },
    { value: 1, text: "text2markdown" },
  ];
  survey.onTextMarkdown.add(function (survey, options) {
    if (options.text.indexOf("markdown") > -1)
      options.html = options.text.replace("markdown", "!");
  });
  var loc1 = (<ItemValue>q1.choices[0]).locText;
  var loc2 = (<ItemValue>q1.choices[1]).locText;
  assert.equal(loc1.renderedHtml, "text1", "render standard text");
  assert.equal(loc2.renderedHtml, "text2!", "render markdown text");
});

QUnit.test("Survey Markdown - question title", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("Page 1");
  var q1 = <Question>page.addNewQuestion("text", "q1");
  var q2 = <Question>page.addNewQuestion("text", "q2");
  survey.onTextMarkdown.add(function (survey, options) {
    if (options.name == "commentText") return;
    assert.equal(
      options.name,
      "title",
      "question title markdown preprocessing"
    );
    if (options.text.indexOf("markdown") > -1)
      options.html = options.text.replace("markdown", "!");
  });
  q2.value = "value2";
  var loc = q1.locTitle;
  q1.title = "title1, q2.value is {q2}markdown";
  assert.equal(
    q1.fullTitle,
    "title1, q2.value is value2!",
    "question.title, use markdown and text preprocessing"
  );
  assert.equal(
    loc.renderedHtml,
    "title1, q2.value is value2!",
    "question.locTitle.renderedHtml, use markdown and text preprocessing"
  );
  q1.isRequired = true;
  assert.equal(
    q1.requiredMark,
    "*",
    "question.title requiredMark is not empty"
  );
});

QUnit.test("Survey Markdown - question title, if title is empty and question is required", function (assert) {
  var survey = new SurveyModel();
  survey.setValue("q1", "q1-Value");
  var page = survey.addNewPage("Page 1");
  var q1 = <Question>page.addNewQuestion("text", "q1");
  var q2 = <Question>page.addNewQuestion("text", "q2");
  var q3 = <Question>page.addNewQuestion("text", "q3");
  survey.onTextMarkdown.add((survey, options) => {
    assert.equal(options.name, "title", "question title markdown preprocessing");
    options.html = options.text + "!";
  });
  q1.isRequired = true;
  q2.isRequired = true;
  q2.title = "Q2";
  q3.isRequired = true;
  q3.title = "*Q3 {q1}";

  assert.equal(
    q1.locTitle.renderedHtml,
    "q1!",
    "q1.title, use markdown for requried text, title is empty"
  );
  assert.equal(
    q1.locTitle.hasHtml,
    true,
    "q1.title, use markdown for requried text - hasHtml, title is empty"
  );
  assert.equal(
    q2.locTitle.renderedHtml,
    "Q2!",
    "q2.title, use markdown for requried text, has title"
  );
  assert.equal(
    q2.locTitle.hasHtml,
    true,
    "q2.title, use markdown for requried text - hasHtml, has title"
  );
  assert.equal(
    q3.locTitle.renderedHtml,
    "*Q3 q1-Value!",
    "q3.title, use markdown for requried text and inside title and process text"
  );
  assert.equal(
    q3.locTitle.hasHtml,
    true,
    "q3.title, use markdown for requried text and inside title and process text, hasHtml"
  );
});
QUnit.test("Survey Markdown - question title calls count", function (assert) {
  const survey = new SurveyModel();
  const page = survey.addNewPage("Page1");
  const q1 = <Question>page.addNewQuestion("text", "q1");
  const q2 = <Question>page.addNewQuestion("text", "q2");
  let counter = 0;
  survey.onTextMarkdown.add((survey, options) => {
    counter++;
    if (options.element.name == "q1") {
      options.html = options.text + "!";
    }
  });
  for (var i = 0; i < 10; i++) {
    assert.equal(q1.title, "q1");
    assert.equal(q1.locTitle.renderedHtml, "q1!");
    assert.equal(q2.title, "q2");
    assert.equal(q2.locTitle.renderedHtml, "q2");
  }
  assert.equal(counter, 2, "onTextMarkdown is called two times");
});
QUnit.test("Survey Markdown + processed text", function (assert) {
  const survey = new SurveyModel();
  const page = survey.addNewPage("Page1");
  const q1 = <Question>page.addNewQuestion("text", "q1");
  q1.title = "Q1 {val}";
  survey.setValue("val", "test1");
  survey.onTextMarkdown.add((survey, options) => {
    options.html = options.text + "!";
  });
  assert.equal(q1.locTitle.renderedHtml, "Q1 test1!", "Initial value");
  survey.setValue("val", "test2");
  assert.equal(q1.locTitle.renderedHtml, "Q1 test2!", "Change the value");
});
QUnit.test("Survey Markdown + design model", function (assert) {
  const survey = new SurveyModel({
    pages: [
      { elements: [{ type: "text", name: "q1", title: "Q1" }] },
      { elements: [{ type: "text", name: "q2", title: "Q2" }] }
    ]
  });
  survey.setDesignMode(true);
  survey.onTextMarkdown.add((survey, options) => {
    options.html = options.text + "!";
  });
  const q1 = survey.getQuestionByName("q1");
  const q2 = survey.getQuestionByName("q2");
  assert.equal(q1.locTitle.renderedHtml, "Q1!", "page1");
  assert.equal(q2.locTitle.renderedHtml, "Q2!", "page2");
});

QUnit.test("required question title test", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("Page 1");
  var q1 = <Question>page.addNewQuestion("text", "q1");
  q1.title = "title1";
  assert.equal(q1.locTitle.renderedHtml, "title1", "Just title");
  q1.isRequired = true;
  assert.equal(q1.locTitle.renderedHtml, "title1", "title + required");
  assert.equal(q1.requiredMark, "*", "title + required");
  assert.equal(q1.title, "title1", "We do no have required");
});

QUnit.test("Survey Markdown - page title", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("Page 1");
  var q1 = <Question>page.addNewQuestion("text", "q1");
  survey.onTextMarkdown.add(function (survey, options) {
    if (options.text.indexOf("markdown") > -1)
      options.html = options.text.replace("markdown", "!");
  });
  q1.value = "value1";
  var loc = page.locTitle;
  page.title = "Page 1markdown, q1 is {q1}";
  assert.equal(
    page.processedTitle,
    "Page 1!, q1 is value1",
    "page.processedTitle, use markdown and text preprocessing"
  );
  assert.equal(
    loc.renderedHtml,
    "Page 1!, q1 is value1",
    "page.locTitle.renderedHtml, use markdown and text preprocessing"
  );
});

QUnit.test("Survey Markdown - page title + showPageNumbers = true", function (assert) {
  var survey = new SurveyModel();
  survey.showPageNumbers = true;
  var page = survey.addNewPage("Page 1");
  var q1 = <Question>page.addNewQuestion("text", "q1");
  survey.onTextMarkdown.add(function (survey, options) {
    if (options.name == "commentText") return;
    assert.equal(options.name, "title", "page title markdown preprocessing");
    if (options.text.indexOf("markdown") > -1)
      options.html = options.text.replace("markdown", "!");
  });
  q1.value = "value1";
  var loc = page.locTitle;
  page.title = "Page 1markdown, q1 is {q1}";
  assert.equal(loc.renderedHtml, "Page 1!, q1 is value1", "page.locTitle.renderedHtml, use markdown and text preprocessing");
});

QUnit.test(
  "Survey Markdown and text processing - dropdownmatrix.columns",
  function (assert) {
    var survey = new SurveyModel();
    survey.setValue("val1", "-newvalue-");
    survey.onTextMarkdown.add(function (survey, options) {
      if (options.text.indexOf("markdown") > -1)
        options.html = options.text.replace("markdown", "!");
    });
    var page = survey.addNewPage("Page 1");
    var q1 = new QuestionMatrixDropdownModel("matrixdropdown");
    var col1 = q1.addColumn("col1");
    var col2 = q1.addColumn("col2", "colText2{val1}");
    var col3 = q1.addColumn("col3", "colText3{val1}markdown");
    q1.rows = ["row1", "row2"];
    page.addQuestion(q1);

    var loc1 = col1.locTitle;
    var loc2 = col2.locTitle;
    var loc3 = col3.locTitle;
    assert.equal(loc1.renderedHtml, "col1", "render column name");
    assert.equal(loc2.renderedHtml, "colText2-newvalue-", "render column text");
    assert.equal(
      loc3.renderedHtml,
      "colText3-newvalue-!",
      "render column text as markdown"
    );
  }
);

QUnit.test("Survey Markdown and text processing - nmatrix.rows", function (
  assert
) {
  var survey = new SurveyModel();
  survey.onTextMarkdown.add(function (survey, options) {
    if (options.text.indexOf("markdown") > -1)
      options.html = options.text.replace("markdown", "!");
  });
  var page = survey.addNewPage("Page 1");
  var q1 = new QuestionMatrixModel("matrixdropdown");
  q1.columns = [1];
  q1.rows = ["row1", "row2", "row3"];
  q1.rows[1].text = "rowText2{val1}";
  q1.rows[2].text = "rowText3{val1}markdown";
  page.addQuestion(q1);
  var loc1 = q1.visibleRows[0].locText;
  var loc2 = q1.visibleRows[1].locText;
  var loc3 = q1.visibleRows[2].locText;
  survey.setValue("val1", "-newvalue-");
  assert.equal(loc1.renderedHtml, "row1", "render column name");
  assert.equal(
    loc2.renderedHtml,
    "rowText2-newvalue-",
    "render column text + text processing"
  );
  assert.equal(
    loc3.renderedHtml,
    "rowText3-newvalue-!",
    "render column text as markdown + text processing"
  );
});

QUnit.test("html.html property, text preprocessing", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("page1");
  var html = <QuestionHtmlModel>page.addNewQuestion("html", "q1");
  survey.setVariable("var1", 5);
  html.html = "val: {var1}";
  assert.equal(html.locHtml.renderedHtml, "val: 5", "initial value is set");
  survey.setVariable("var1", 10);
  assert.equal(html.locHtml.renderedHtml, "val: 10", "value is changed");
});

QUnit.test(
  "Kebab-case variable in expressions - https://surveyjs.answerdesk.io/ticket/details/T2211",
  function (assert) {
    var survey = new SurveyModel();
    survey.setVariable("testVariable", false);
    assert.ok(survey.runCondition("{testVariable} = false"), "Should be true");
  }
);

QUnit.test("Survey Markdown - survey title", function (assert) {
  var survey = new SurveyModel();
  survey.onTextMarkdown.add(function (survey, options) {
    assert.equal(options.name, "title", "survey title markdown preprocessing");
    if (options.text.indexOf("markdown") > -1)
      options.html = options.text.replace("markdown", "!");
  });
  survey.setValue("q1", "value1");
  var loc = survey.locTitle;
  survey.title = "Surveymarkdown, q1 is {q1}";
  assert.equal(
    survey.processedTitle,
    "Survey!, q1 is value1",
    "survey.processedTitle, use markdown and text preprocessing"
  );
  assert.equal(
    loc.renderedHtml,
    "Survey!, q1 is value1",
    "survey.locTitle.renderedHtml, use markdown and text preprocessing"
  );
});

QUnit.test("Survey Markdown - question.validators", function (assert) {
  var survey = new SurveyModel();
  survey.onTextMarkdown.add(function (survey, options) {
    if (options.text.indexOf("markdown") > -1)
      options.html = options.text.replace("markdown", "!");
  });
  survey.onValidateQuestion.add(function (servey, options) {
    if (options.name == "q2") options.error = "markdown";
  });
  var page = survey.addNewPage("p1");
  var question1 = <QuestionTextModel>page.addNewQuestion("text", "q1");
  var question2 = <QuestionTextModel>page.addNewQuestion("text", "q2");
  var validator = new EmailValidator();
  validator.text = "errormarkdown";
  question1.validators.push(validator);
  survey.setValue("q1", "val");
  page.hasErrors(true);
  assert.equal(validator.locText.renderedHtml, "error!", "Markdown is working");
  assert.equal(
    question1.errors[0].locText.renderedHtml,
    "error!",
    "Markdown in validators is working"
  );
  assert.equal(
    question2.errors[0].locText.renderedHtml,
    "!",
    "Markdown for event is working"
  );
});

QUnit.test("QuestionRadiogroupModel clears comment - issue #390", function (
  assert
) {
  var question = new QuestionRadiogroupModel("q1");
  question.hasComment = true;
  question.comment = "comment text";
  question.clearUnusedValues();
  assert.equal(question.comment, "comment text");
});

QUnit.test("survey.clearIncorrectValues", function (assert) {
  var json = {
    pages: [
      {
        name: "page1",
        elements: [
          {
            type: "panel",
            name: "panel1",
            elements: [
              {
                type: "radiogroup",
                name: "question1",
                defaultValue: "item3",
                choices: ["item1", "item2"],
              },
            ],
          },
        ],
      },
    ],
  };
  var survey = new SurveyModel(json);
  assert.deepEqual(
    survey.data,
    { question1: "item3" },
    "The default value is set"
  );
  survey.clearIncorrectValues();
  assert.deepEqual(survey.data, {}, "The default value is removed");
});

QUnit.test(
  "survey.clearIncorrectValues with parameter removeNonExisingKeys",
  function (assert) {
    var json = {
      elements: [
        {
          type: "text",
          name: "q1",
        },
        {
          type: "text",
          name: "q2",
        },
      ],
    };
    var survey = new SurveyModel(json);
    survey.setValue("q1", "v1");
    survey.setValue("q2", "v2");
    survey.setValue("q3", "v3");
    assert.deepEqual(
      survey.data,
      { q1: "v1", q2: "v2", q3: "v3" },
      "values set correctly"
    );
    survey.clearIncorrectValues(true);
    assert.deepEqual(
      survey.data,
      { q1: "v1", q2: "v2" },
      "Remove q3 and val3 keys"
    );
  }
);

QUnit.test("Create questions from elements array - issue #395", function (
  assert
) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "comment",
        name: "suggestions",
        title: "What would make you more satisfied with the Product?",
      },
    ],
  });
  assert.equal(survey.pages.length, 1);
  assert.equal(survey.pages[0].questions.length, 1);
  assert.equal(survey.pages[0].questions[0].name, "suggestions");
});

QUnit.test("onMatrixRowAdded", function (assert) {
  var survey = new SurveyModel();
  survey.onMatrixRowAdded.add(function (survey, options) {
    var q = options.question;
    var newValue = {};
    for (var i = q.rowCount - 1; i >= 0; i--) {
      var rowValue = q.getRowValue(i);
      if (rowValue && rowValue["col1"]) {
        newValue["col1"] = rowValue["col1"];
        q.setRowValue(q.rowCount - 1, newValue);
        break;
      }
    }
  });
  var page = survey.addNewPage("Page 1");
  var q1 = new QuestionMatrixDynamicModel("matrixdynamic");
  page.addElement(q1);
  q1.addColumn("col1");
  q1.addColumn("col2");
  q1.addColumn("col3");
  q1.rowCount = 3;
  q1.value = [
    { col1: 1, col2: "1" },
    { col1: 2, col2: "2" },
  ];
  q1.addRow();
  assert.equal(q1.rowCount, 3, "there are 3 rows");
  assert.equal(q1.value[2]["col1"], 2, "get value from previous");
});
QUnit.test("onMatrixRowAdded + copyDefaultValueFromLastEntry", function (assert) {
  var survey = new SurveyModel();
  var visibleRowsCount = -1;
  survey.onMatrixRowAdded.add(function (sender, options) {
    options.row.getQuestionByColumnName("col1").clearValue();
    visibleRowsCount = options.question.visibleRows.length;
  });
  var page = survey.addNewPage("Page 1");
  var q1 = new QuestionMatrixDynamicModel("matrixdynamic");
  q1.copyDefaultValueFromLastEntry = true;
  page.addElement(q1);
  q1.addColumn("col1");
  q1.addColumn("col2");
  q1.addColumn("col3");
  q1.rowCount = 2;
  q1.value = [
    { col1: 1, col2: "1" },
    { col1: 2, col2: "2" },
  ];
  q1.addRow();
  assert.equal(visibleRowsCount, 3, "There are 3 visibleRows in event");
  assert.equal(q1.rowCount, 3, "there are 3 rows");
  assert.equal(q1.value[2]["col2"], "2", "get value from previous");
  assert.notOk(q1.value[2]["col1"], "clear value for this column");
});

QUnit.test("onMatrixBeforeRowAdded -> obsolete", function (assert) {
  var survey = new SurveyModel();
  survey.onMatrixBeforeRowAdded.add(function (sender, options) {
    options.canAddRow = options.question.rowCount < 1;
  });

  var page = survey.addNewPage("Page 1");
  var q1 = new QuestionMatrixDynamicModel("matrixdynamic");
  page.addElement(q1);
  q1.addColumn("col1");
  q1.rowCount = 0;

  q1.addRow();
  assert.equal(q1.rowCount, 1, "there is one row");
  q1.addRow();
  assert.equal(
    q1.rowCount,
    1,
    "there is stil one row because of 'onMatrixBeforeRowAdded' and 'canAddRow'"
  );
});
QUnit.test("onMatrixRowAdding -> replace onMatrixBeforeRowAdded", function (assert) {
  var survey = new SurveyModel();
  survey.onMatrixRowAdding.add(function (sender, options) {
    options.allow = options.question.rowCount < 1;
  });

  var page = survey.addNewPage("Page 1");
  var q1 = new QuestionMatrixDynamicModel("matrixdynamic");
  page.addElement(q1);
  q1.addColumn("col1");
  q1.rowCount = 0;

  q1.addRow();
  assert.equal(q1.rowCount, 1, "there is one row");
  q1.addRow();
  assert.equal(
    q1.rowCount,
    1,
    "there is stil one row because of 'onMatrixBeforeRowAdded' and 'canAddRow'"
  );
});
QUnit.test("onMatrixRowAdding, support options.canAddRow & options.allow", function (assert) {
  const survey = new SurveyModel();
  let allow: any = undefined;
  let canAddRow: any = undefined;
  survey.onMatrixRowAdding.add(function (sender, options) {
    if (allow !== undefined) options.allow = allow;
    if (canAddRow !== undefined) options.canAddRow = canAddRow;
  });
  const page = survey.addNewPage("Page 1");
  const matrix = new QuestionMatrixDynamicModel("matrixdynamic");
  page.addElement(matrix);
  matrix.addColumn("col1");
  matrix.rowCount = 0;
  matrix.allowAddRows = false;
  matrix.addRow();
  assert.equal(matrix.rowCount, 0, "rowCount=0, #1");
  allow = true;
  matrix.addRow();
  assert.equal(matrix.rowCount, 1, "rowCount=1, #2");
  allow = undefined;
  canAddRow = true;
  matrix.addRow();
  assert.equal(matrix.rowCount, 2, "rowCount=2, #3");
  canAddRow = undefined;

  matrix.allowAddRows = true;
  matrix.addRow();
  assert.equal(matrix.rowCount, 3, "rowCount=3, #4");
  allow = undefined;
  canAddRow = true;
  matrix.addRow();
  assert.equal(matrix.rowCount, 4, "rowCount=4, #5");
  canAddRow = undefined;
  matrix.addRow();
  assert.equal(matrix.rowCount, 5, "rowCount=5, #6");

  allow = undefined;
  canAddRow = false;
  matrix.addRow();
  assert.equal(matrix.rowCount, 5, "rowCount=5, #7");
  canAddRow = undefined;
  allow = false;
  matrix.addRow();
  assert.equal(matrix.rowCount, 5, "rowCount=5, #8");
});

QUnit.test("onMatrixRowRemoved. Added a case for Bug#2557", function (assert) {
  var survey = new SurveyModel();
  var removedRowIndex = -1;
  var visibleRowsCount = -1;
  survey.onMatrixRowRemoved.add(function (survey, options) {
    removedRowIndex = options.rowIndex;
    visibleRowsCount = options.question.visibleRows.length;
  });
  var page = survey.addNewPage("Page 1");
  var q1 = new QuestionMatrixDynamicModel("matrixdynamic");
  page.addElement(q1);
  q1.addColumn("col1");
  q1.rowCount = 3;
  q1.removeRow(1);
  assert.equal(q1.rowCount, 2, "there are two rows");
  assert.equal(
    removedRowIndex,
    1,
    "onMatrixRowRemoved event has been fired correctly"
  );
  assert.equal(
    visibleRowsCount,
    2,
    "There should be two visible rows in event"
  );
});

QUnit.test(
  "onUpdatePanelCssClasses keeps original css - https://github.com/surveyjs/surveyjs/issues/1333",
  function (assert) {

    var css = oldDefaultTheme;
    var survey = new SurveyModel();
    survey.setCss(css, false);
    survey.onUpdatePanelCssClasses.add(function (survey, options) {
      if (options.panel.name == "panel1")
        options.cssClasses.panel["container"] = "hereIam";
    });
    var page = survey.addNewPage("page1");
    var panel1 = new PanelModel("panel1");
    var panel2 = new PanelModel("panel2");
    page.addElement(panel1);
    page.addElement(panel2);
    var css1 = panel1.cssClasses;
    assert.equal(css1.panel.container, "hereIam", "panel1 custom class");
    var css2 = panel2.cssClasses;
    assert.equal(
      css2.panel.container,
      "sv_p_container",
      "keep original panel class"
    );
    assert.equal(
      css.panel.container,
      "sv_p_container",
      "keep original main css class"
    );
  }
);

QUnit.test("css sets correctly if src key is object and dest key is string", function (assert) {
  var survey = new SurveyModel();
  survey.css = { text: { root: "custom_class" } };
  assert.equal(survey.css["text"].root, "custom_class");
}
);

QUnit.test("check setCss method without merge", function (assert) {
  var survey = new SurveyModel();
  const newFullCss = {
    navigation: {}
  };
  survey.setCss(newFullCss, false);
  assert.equal(survey.css, newFullCss);
}
);

QUnit.test("Apply css for questions on start page", function (assert) {
  const survey = new SurveyModel({
    firstPageIsStartPage: true,
    pages: [
      { elements: [{ type: "text", name: "q1" }] },
      { elements: [{ type: "text", name: "q2" }] }
    ]
  });
  setOldTheme(survey);
  survey.css = { text: { mainRoot: "custom_class" } };
  const q1 = survey.getQuestionByName("q1");
  const q2 = survey.getQuestionByName("q2");
  assert.equal(q2.cssRoot, "custom_class", "Appy css for the first page");
  assert.equal(q1.cssRoot, "custom_class", "Appy css for the start page");
}
);

QUnit.test("onUpdatePageCssClasses is raised", function (assert) {
  var survey = new SurveyModel();
  var flag = false;
  survey.onUpdatePageCssClasses.add(function (survey, options) {
    flag = true;
  });
  var page = survey.addNewPage("page1");
  page.cssClasses;
  assert.ok(flag, "event is raised");
});

QUnit.test("Survey Elements css", function (assert) {
  const css = oldDefaultTheme;
  css.question.titleRequired = "required";
  const survey = new SurveyModel();
  setOldTheme(survey);
  survey.onUpdateQuestionCssClasses.add(function (survey, options) {
    if (options.question.name === "q2")
      options.cssClasses["newItem"] = "hereIam";
  });
  const page = survey.addNewPage("page1");
  const textQuestion = <QuestionTextModel>page.addNewQuestion("text", "q1");
  const checkQuestion = <QuestionCheckboxModel>(
    page.addNewQuestion("checkbox", "q2")
  );
  let textCss = textQuestion.cssClasses;
  const checkCss = checkQuestion.cssClasses;
  assert.equal(textCss.root, "sv_q_text_root", "text question root class");
  assert.equal(textCss.title, "sv_q_title", "text question title class");
  assert.equal(
    checkCss.root,
    "sv_qcbc sv_qcbx",
    "checkbox question root class"
  );
  assert.equal(checkCss.item, "sv_q_checkbox", "checkbox question title class");
  assert.equal(
    checkCss.newItem,
    "hereIam",
    "checkbox question onUpdateQuestionCssClasses event called correctly"
  );
  textQuestion.isRequired = true;
  textCss = textQuestion.cssClasses;
  assert.equal(
    textCss.title,
    "sv_q_title required",
    "text question title class"
  );
  css.question.titleRequired = "";
});

QUnit.test("Question cssRoot", function (assert) {
  var json = {
    elements: [
      { type: "text", name: "q1" },
      { type: "checkbox", name: "q2" },
    ],
  };
  var survey = new SurveyModel(json);
  setOldTheme(survey);
  assert.equal(
    survey.getQuestionByName("q1").cssRoot,
    "sv_q sv_qstn",
    "text question root class - original"
  );
  assert.equal(
    survey.getQuestionByName("q2").cssRoot,
    "sv_q sv_qstn",
    "checkbox question root class - original"
  );

  survey = new SurveyModel(json);
  setOldTheme(survey);
  survey.onUpdateQuestionCssClasses.add(function (survey, options) {
    if (options.question.getType() == "checkbox") {
      options.cssClasses.mainRoot = "testMainRoot";
      options.cssClasses.root = "testRoot";
    }
  });

  assert.equal(
    survey.getQuestionByName("q1").cssRoot,
    "sv_q sv_qstn",
    "text question root class"
  );
  assert.equal(
    survey.getQuestionByName("q2").cssRoot,
    "testMainRoot",
    "checkbox question root class"
  );
});
QUnit.test("Question onUpdateQuestionCssClasses, modify question props", function (assert) {
  const survey = new SurveyModel();
  survey.onUpdateQuestionCssClasses.add(function (survey, options) {
    options.question.titleLocation = "left";
  });
  survey.fromJSON({
    elements: [
      { type: "text", name: "q1" },
    ],
  });
  const q1 = survey.getQuestionByName("q1");
  assert.equal(q1.titleLocation, "left", "titleLocation is changed");
});

QUnit.test("Use send data to custom server", function (assert) {
  var survey = twoPageSimplestSurvey();
  var onCompleteOptions = null;
  survey.onComplete.add(function (sender, options) {
    onCompleteOptions = options;
    options.showDataSaving();
  });
  survey.data = { question1: "sss" };
  assert.equal(survey.completedState, "", "The complete state is empty");
  survey.doComplete();
  assert.equal(survey.completedState, "saving", "The complete state is saving");
  onCompleteOptions.showDataSavingError();
  assert.equal(survey.completedState, "error", "The complete state is error");
  onCompleteOptions.showDataSavingSuccess();
  assert.equal(
    survey.completedState,
    "success",
    "The complete state is success"
  );
});

QUnit.test("Notify the user about the status of sending data to custom server", function (assert) {
  const survey = twoPageSimplestSurvey();
  let notifierLog = "";
  survey.notify = (msg, type) => {
    notifierLog += msg;
    if (type) {
      notifierLog += " - " + type;
    }
  };

  let onCompleteOptions: any = null;
  survey.onComplete.add(function (sender, options) {
    onCompleteOptions = options;
    options.showDataSaving();
  });
  survey.data = { question1: "sss" };
  assert.equal(survey.completedState, "", "The complete state is empty");
  assert.equal(notifierLog, "");
  notifierLog = "";

  survey.doComplete();
  assert.equal(survey.completedState, "saving", "The complete state is saving");
  assert.equal(notifierLog, "The results are being saved on the server... - saving");
  notifierLog = "";

  onCompleteOptions?.showDataSavingError();
  assert.equal(survey.completedState, "error", "The complete state is error");
  assert.equal(notifierLog, "An error occurred and we could not save the results. - error");
  notifierLog = "";

  onCompleteOptions?.showDataSavingSuccess();
  assert.equal(survey.completedState, "success", "The complete state is success");
  assert.equal(notifierLog, "The results were saved successfully! - success");
  notifierLog = "";
});

QUnit.test("Notifier button", function (assert) {
  const survey = twoPageSimplestSurvey();
  let notifierLog = "";
  survey.notify = (msg, type) => {
    notifierLog += msg;
    if (type) {
      notifierLog += " - " + type;
    }
  };

  let onCompleteOptions: any = null;
  survey.onComplete.add(function (sender, options) {
    onCompleteOptions = options;
    options.showDataSaving();
  });
  survey.data = { question1: "sss" };
  assert.equal(survey.completedState, "", "The complete state is empty");
  assert.equal(notifierLog, "");
  notifierLog = "";

  survey.doComplete();
  assert.equal(survey.completedState, "saving", "The complete state is saving");
  assert.equal(notifierLog, "The results are being saved on the server... - saving");
  notifierLog = "";

  onCompleteOptions?.showDataSavingError();
  assert.equal(survey.completedState, "error", "The complete state is error");
  assert.equal(notifierLog, "An error occurred and we could not save the results. - error");
  notifierLog = "";

  onCompleteOptions?.showDataSavingSuccess();
  assert.equal(survey.completedState, "success", "The complete state is success");
  assert.equal(notifierLog, "The results were saved successfully! - success");
  notifierLog = "";
});

QUnit.test("Pass custom properties to cell question", function (assert) {
  Serializer.addProperty("matrixdropdowncolumn", {
    name: "renderAs",
    default: "default",
    choices: ["default", "select2tagbox"],
  });
  var survey = new SurveyModel({
    questions: [
      {
        type: "matrixdynamic",
        name: "teachersRate",
        title: "Please rate your teachers",
        columnColCount: 1,
        cellType: "radiogroup",
        choices: [
          { value: 1, text: "Yes" },
          { value: 0, text: "No" },
        ],
        columns: [
          {
            name: "subject",
            cellType: "dropdown",
            renderAs: "select2tagbox",
            title: "Select a subject",
            choices: [
              "English: American Literature",
              "World Languages: Japanese",
            ],
          },
        ],
      },
    ],
  });
  var q1: QuestionMatrixDynamicModel = <any>(
    survey.getQuestionByName("teachersRate")
  );
  q1.addRow();
  assert.equal(
    q1.visibleRows[0].cells[0].question["renderAs"],
    "select2tagbox",
    "custom property should be passed to the question"
  );
});

QUnit.test("Pass text as survey json", function (assert) {
  var survey = new SurveyModel(
    '{ "questions": [ {"type": "text", "name": "q1"}]}'
  );
  var q1 = survey.getQuestionByName("q1");
  assert.equal(q1.name, "q1", "The survey created from the string");
});

QUnit.test("Clear value if empty array is set, Bug #608", function (assert) {
  var survey = new SurveyModel();
  survey.setValue("q1", ["1"]);
  assert.deepEqual(survey.data, { q1: ["1"] }, "The array is set");
  survey.setValue("q1", []);
  assert.deepEqual(survey.data, {}, "The value with empty array is removed");
});

QUnit.test(
  "Question description and text processing, variable, Bug #632",
  function (assert) {
    var survey = new SurveyModel();
    survey.addNewPage("p1");
    var question = <Question>survey.pages[0].addNewQuestion("text", "q1");
    question.title = "{var1}";
    question.description = "{var1}";
    survey.setVariable("var1", "It is var1");
    assert.equal(
      question.locTitle.renderedHtml,
      "It is var1",
      "Title: Variable is applied"
    );
    assert.equal(
      question.locDescription.renderedHtml,
      "It is var1",
      "Decription: Variable is applied"
    );
  }
);

QUnit.test(
  "Set defaultValue on loading from JSON, on adding into survey and on setting defaultValue property",
  function (assert) {
    var survey = new SurveyModel({
      questions: [{ type: "text", name: "q1", defaultValue: "your_name" }],
    });
    assert.equal(survey.getValue("q1"), "your_name", "on loading from JSON");
    var q2 = new QuestionTextModel("q2");
    q2.defaultValue = "my_name";
    survey.pages[0].addElement(q2);
    assert.equal(
      survey.getValue("q2"),
      "my_name",
      "on adding question into suvey"
    );
    var q3 = <Question>survey.pages[0].addNewQuestion("text", "q3");
    q3.defaultValue = "her_name";
    assert.equal(
      survey.getValue("q3"),
      "her_name",
      "on setting the default value"
    );
    q3.defaultValue = "his_name";
    assert.equal(
      survey.getValue("q3"),
      "her_name",
      "the value doesn't changed, since it was not empty"
    );
  }
);
QUnit.test("Set defaultValue in design-time", function (assert) {
  var survey = new SurveyModel();
  survey.setDesignMode(true);
  survey.addNewPage("p1");
  var q1 = new QuestionTextModel("q1");
  survey.pages[0].addElement(q1);
  assert.notOk(q1.defaultValue, "There is no default value");
  q1.defaultValue = "my_name";
  assert.equal(survey.getValue("q1"), "my_name", "the value is set");
  q1.defaultValue = null;
  assert.notOk(survey.getValue("q1"), "the value is reset");
});

QUnit.test("defaultValue + survey.clear()", function (assert) {
  var json = {
    elements: [{ type: "text", name: "q1", defaultValue: "defValue" }],
  };
  var survey = new SurveyModel(json);
  assert.equal(survey.getValue("q1"), "defValue", "the value is set");
  survey.doComplete();
  survey.clear(true);
  assert.equal(
    survey.getValue("q1"),
    "defValue",
    "the value is set after clear, #1163"
  );
});

QUnit.test("defaultValue + survey.clear() + 'other'", function (assert) {
  var json = {
    elements: [
      {
        type: "radiogroup",
        name: "q1",
        defaultValue: "other",
        choices: [1],
        hasOther: true,
      },
      {
        type: "checkbox",
        name: "q2",
        defaultValue: ["other"],
        choices: [1],
        hasOther: true,
      },
    ],
  };
  var survey = new SurveyModel(json);
  assert.deepEqual(
    survey.data,
    { q1: "other", q2: ["other"] },
    "check initial state"
  );
  survey.getQuestionByName("q1").comment = "comment1";
  survey.getQuestionByName("q2").comment = "comment2";
  assert.equal(
    survey.getQuestionByName("q1").getPropertyValue("comment"),
    "comment1"
  );
  survey.clear();
  assert.equal(survey.getQuestionByName("q1").getPropertyValue("comment"), "");
  assert.deepEqual(
    survey.data,
    { q1: "other", q2: ["other"] },
    "clear comments"
  );
});

QUnit.test("Dublicate errors", function (assert) {
  var survey = new SurveyModel();
  survey.addNewPage("p1");
  var q = <QuestionTextModel>survey.pages[0].addNewQuestion("text", "q1");
  q.validators.push(new NumericValidator(0, 25));
  var valueChangedCounter = 0;
  survey.onValueChanged.add(function (s, options) {
    valueChangedCounter++;
    options.question.hasErrors(true);
  });
  assert.equal(q.errors.length, 0, "There is no errors so far");
  q.value = "26";
  assert.equal(q.errors.length, 1, "There should be one error");
  assert.equal(valueChangedCounter, 1, "on value changed called one time");
  assert.equal(q.value, 26, "the value is 26");
});

QUnit.test("Auto generate names for question/panel/page", function (assert) {
  var survey = new SurveyModel();
  var page1 = survey.addNewPage();
  assert.equal(survey.pages[0].name, "page1", "the first name is page1");
  var page2 = survey.addNewPage();
  assert.equal(survey.pages[1].name, "page2", "the second name is page2");
  survey.pages[0].name = "newpage";
  var page3 = survey.addNewPage();
  assert.equal(survey.pages[2].name, "page1", "the third name is page1 again");

  page1.addNewQuestion("text");
  page1.addNewQuestion("text");
  page3.addNewQuestion("text");
  assert.equal(
    survey.getAllQuestions()[0].name,
    "question1",
    "the first name is question1"
  );
  assert.equal(
    survey.getAllQuestions()[1].name,
    "question2",
    "the second name is question2"
  );
  assert.equal(
    survey.getAllQuestions()[2].name,
    "question3",
    "the third name is question3"
  );

  var panel1 = page1.addNewPanel();
  var panel2 = panel1.addNewPanel();
  var panel3 = page2.addNewPanel();
  assert.equal(panel1.name, "panel1", "the first name is panel1");
  assert.equal(panel2.name, "panel2", "the second name is panel2");
  assert.equal(panel3.name, "panel3", "the third name is panel3");
});

QUnit.test("clearInvisibleValues", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage();
  var question = <Question>page.addNewQuestion("text");
  assert.equal(survey.clearInvisibleValues, "onComplete", "the default value");
  survey.clearInvisibleValues = true;
  assert.equal(survey.clearInvisibleValues, "onComplete", "true is onComplete");
  survey.clearInvisibleValues = false;
  assert.equal(survey.clearInvisibleValues, "none", "false is none");
  question.value = "val";
  question.visible = false;
  assert.equal(question.value, "val", "none - nothing happened");
  question.visible = true;
  survey.clearInvisibleValues = "onHidden";
  question.visible = false;
  assert.notOk(question.value, "onHidden - clear the value");
  question.visible = true;
  question.value = "val";
  survey.clearInvisibleValues = "onComplete";
  question.visible = false;
  assert.equal(question.value, "val", "onComplete - nothing happened");
  survey.doComplete();
  assert.notOk(question.value, "onComplete - clear on complete");
});
QUnit.test("clearInvisibleValues=onHidden and invisiblePages, #964", function (
  assert
) {
  var survey = new SurveyModel();
  survey.clearInvisibleValues = "onHidden";
  var page1 = survey.addNewPage("p1");
  page1.addNewQuestion("text", "q1");
  var page2 = survey.addNewPage("p2");
  page2.addNewQuestion("text", "q2");
  survey.setValue("q1", "val1");
  survey.setValue("q2", "val2");
  page2.visible = false;
  survey.doComplete();
  assert.deepEqual(
    survey.data,
    { q1: "val1" },
    "Remove value for invisible question q2"
  );
});
QUnit.test("required text can be empty: Bug #693", function (assert) {
  var survey = new SurveyModel();
  assert.equal(survey.requiredMark, "*", "The default value is '*'");
  survey.requiredMark = "";
  assert.equal(survey.requiredMark, "", "The value is empty string");
  survey.requiredMark = null;
  assert.equal(survey.requiredMark, "*", "The value is again default");
});
QUnit.test("Set 0 value into survey.data", function (assert) {
  var survey = new SurveyModel();
  var p = survey.addNewPage();
  var q = <QuestionTextModel>p.addNewQuestion("text", "q1");
  survey.data = { q1: 0 };
  assert.equal(q.value, 0, "0 value is set");
});
QUnit.test("Parent property in question", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("page");
  var panel = page.addNewPanel("panel");
  var panel2 = panel.addNewPanel("panel2");
  var q = panel2.addNewQuestion("text");
  assert.equal(q.parent.name, "panel2");
  panel2.removeElement(q);
  assert.notOk(q.parent);
  panel.addElement(q);
  assert.equal(q.parent.name, "panel");
});
QUnit.test(
  "Remove question from it's previous container before adding to a new one",
  function (assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("page");
    var panel1 = page.addNewPanel("panel1");
    var panel2 = page.addNewPanel("panel2");
    var q = panel1.addNewQuestion("text");
    assert.equal(q.parent.name, "panel1");
    assert.equal(panel1.elements.length, 1, "There is one element");
    panel2.addElement(q);
    assert.equal(q.parent.name, "panel2");
    assert.equal(panel2.elements.length, 1, "There is one element in panel2");
    assert.equal(panel1.elements.length, 0, "There is no elements in panel1");
  }
);
QUnit.test("Page property in question", function (assert) {
  var survey = new SurveyModel();
  var page1 = survey.addNewPage("p1");
  var page2 = survey.addNewPage("p2");
  var panel = page1.addNewPanel("panel");
  var panel2 = panel.addNewPanel("panel2");
  var q = panel2.addNewQuestion("text");
  assert.ok(
    page1.questions.indexOf(q) > -1,
    "The question is in the first page"
  );
  assert.equal(q.page.name, page1.name, "The page is set correctly");
  q.page = page2;
  assert.ok(
    page2.questions.indexOf(q) > -1,
    "The question is in the second page"
  );
  assert.notOk(
    page1.questions.indexOf(q) > -1,
    "The question is not in the first page"
  );
  assert.equal(q.page.name, page2.name, "The page was changed");
});

QUnit.test("Define questionTitleLocation on Panel/Page level", function (
  assert
) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("page");
  var panel = page.addNewPanel("panel");
  var panel2 = panel.addNewPanel("panel2");
  var q = <Question>panel2.addNewQuestion("text");
  assert.equal(q.getTitleLocation(), "top", "get from survey");
  panel2.questionTitleLocation = "bottom";
  assert.equal(q.getTitleLocation(), "bottom", "get from panel 2");
  panel2.questionTitleLocation = "default";
  assert.equal(q.getTitleLocation(), "top", "get from survey");
  panel.questionTitleLocation = "bottom";
  assert.equal(q.getTitleLocation(), "bottom", "get from panel");
  panel.questionTitleLocation = "default";
  assert.equal(q.getTitleLocation(), "top", "get from survey");
  page.questionTitleLocation = "bottom";
  assert.equal(q.getTitleLocation(), "bottom", "get from page");
  page.questionTitleLocation = "default";
  assert.equal(q.getTitleLocation(), "top", "get from survey");
  q.titleLocation = "bottom";
  assert.equal(q.getTitleLocation(), "bottom", "get from question");
  q.titleLocation = "default";
  assert.equal(q.getTitleLocation(), "top", "get from survey again");
});

QUnit.test("Define questionTitleWidth on Panel/Page level", function (assert) {
  const survey = new SurveyModel();
  const page = survey.addNewPage("page");
  const panel = page.addNewPanel("panel");
  const panel2 = panel.addNewPanel("panel2");
  const q = <Question>panel2.addNewQuestion("text");
  page.questionTitleLocation = "left";

  assert.equal(q.titleWidth, undefined, "init");
  page.questionTitleWidth = "500px";
  assert.equal(q.titleWidth, "500px", "get from page");

  panel.questionTitleWidth = "50%";
  assert.equal(q.titleWidth, "50%", "get from panel");

  panel2.questionTitleWidth = "200px";
  assert.equal(q.titleWidth, "200px", "get from panel2");

  panel2.questionTitleWidth = "300";
  assert.equal(q.titleWidth, "300px", "titleWidth with px");

  q.titleLocation = "top";
  assert.equal(q.titleWidth, undefined, "titleWidth available if titleLocation is left");
});

QUnit.test("availableQuestionTitleWidth on Panel/Page", function (assert) {
  const survey = new SurveyModel();
  const page = survey.addNewPage("page");
  const panel = page.addNewPanel("panel");
  const panel2 = panel.addNewPanel("panel2");
  const q = <Question>panel.addNewQuestion("text");

  assert.equal(page.availableQuestionTitleWidth(), false, "page");
  assert.equal(panel.availableQuestionTitleWidth(), false, "panel1");
  assert.equal(panel2.availableQuestionTitleWidth(), false, "panel2");

  q.titleLocation = "left";
  assert.equal(page.availableQuestionTitleWidth(), true, "page");
  assert.equal(panel.availableQuestionTitleWidth(), true, "panel1");
  assert.equal(panel2.availableQuestionTitleWidth(), false, "panel2");

  q.titleLocation = "top";
  page.questionTitleLocation = "left";
  assert.equal(page.availableQuestionTitleWidth(), true, "page");
  assert.equal(panel.availableQuestionTitleWidth(), true, "panel1");
  assert.equal(panel2.availableQuestionTitleWidth(), true, "panel2");
});

QUnit.test("Question property.page getChoices", function (assert) {
  var property = Serializer.findProperty("questionbase", "page");
  assert.ok(property, "page property is here");
  var survey = new SurveyModel();
  survey.addNewPage("p1");
  survey.addNewPage("p2");
  survey.addNewPage("p3");
  var q = survey.pages[0].addNewQuestion("text", "q1");
  assert.equal(property.getChoices(q).length, 3, "There are 3 pages");
});

QUnit.test("firstPageIsStartPage = true", function (assert) {
  var survey = new SurveyModel();
  for (var i = 0; i < 3; i++) {
    let page = survey.addNewPage("p" + i + 1);
    page.addNewQuestion("text");
  }
  assert.equal(survey.visiblePages.length, 3, "There are 3 visible pages");
  assert.equal(survey.pages[0].isVisible, true, "The first page is visible");
  assert.equal(survey.state, "running", "Survey is running");
  survey.firstPageIsStartPage = true;
  assert.equal(survey.pages[0].isVisible, true, "The first page is visible");
  assert.equal(survey.pages[0].isStarted, true, "The first page is started");
  assert.equal(survey.visiblePages.length, 2, "There are 2 visible pages");
  assert.equal(survey.state, "starting", "Survey is showing the start page");
  survey.firstPageIsStartPage = false;
  assert.equal(survey.visiblePages.length, 3, "There are 3 visible pages");
  assert.equal(survey.pages[0].isVisible, true, "The first page is visible");
  assert.equal(survey.state, "running", "Survey is running");
  survey.firstPageIsStartPage = true;
});

QUnit.test("firstPageIsStartPage = true, load from JSON, the flow", function (
  assert
) {
  var json = {
    firstPageIsStarted: true,
    pages: [
      { name: "start", elements: [{ type: "text", name: "q1" }] },
      { name: "page1", elements: [{ type: "text", name: "q2" }] },
    ],
  };
  var survey = new SurveyModel(json);
  var startCounter = 0;
  survey.onStarted.add(function (sender) {
    startCounter++;
  });
  assert.equal(survey.pages[0].isVisible, true, "The first page is visible");
  assert.equal(survey.pages[0].isStarted, true, "The first page is visible");
  assert.equal(survey.visiblePages.length, 1, "There is one visible page");
  assert.equal(survey.state, "starting", "Survey is showing the start page");
  assert.equal(startCounter, 0, "onStarted event was not called yet");
  survey.start();
  assert.equal(startCounter, 1, "onStarted event was called one time");
  assert.equal(survey.state, "running", "Survey is running");
  assert.equal(survey.currentPage.name, "page1", "The page1 is current");
  survey.prevPage();
  assert.equal(
    survey.currentPage.name,
    "page1",
    "Could not come back to the start page"
  );
  assert.equal(survey.state, "running", "Survey is running");
  survey.doComplete();
  survey.clear();
  assert.equal(survey.state, "starting", "Survey is showing the start page");
  assert.equal(startCounter, 1, "onStarted event was called one time total");
});

QUnit.test("question.valueName property", function (assert) {
  var survey = new SurveyModel();
  survey.data = { val: "val1" };
  var page = survey.addNewPage("p1");
  var question = <Question>page.addNewQuestion("text", "q1");
  question.valueName = "val";
  assert.equal(question.value, "val1", "The value is taken by using valueName");
});
QUnit.test("pre process title, with question.valueName", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("p1");
  var question = <Question>page.addNewQuestion("text", "q1");
  question.valueName = "name";
  survey.data = { name: "John" };
  survey.title = "Hello {name}";
  assert.equal(
    survey.processedTitle,
    "Hello John",
    "process survey title correctly"
  );
});

QUnit.test(
  "Survey text preprocessing, dropdown/checkbox/radiogroup, with question.valueName",
  function (assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("Page 1");
    var q1 = <QuestionDropdownModel>page.addNewQuestion("dropdown", "q1");
    q1.valueName = "name1";
    q1.choices = [
      { value: 1, text: "Item 1" },
      { value: 2, text: "Item 2" },
    ];
    var q2 = <QuestionCheckboxModel>page.addNewQuestion("checkbox", "q2");
    q2.valueName = "name2";
    q2.choices = [
      { value: 3, text: "Item 3" },
      { value: 4, text: "Item 4" },
    ];
    var q3 = <Question>page.addNewQuestion("text", "q3");
    q3.title = "{name1}-{name2}";
    assert.equal(q3.locTitle.renderedHtml, "-", "There is no values");
    q1.value = 1;
    assert.equal(q3.locTitle.renderedHtml, "Item 1-", "Drop down value is set");
    q2.value = [3, 4];
    assert.equal(
      q3.locTitle.renderedHtml,
      "Item 1-Item 3, Item 4",
      "Drop down value is set"
    );
  }
);

QUnit.test("Survey show several pages as one", function (assert) {
  var survey = twoPageSimplestSurvey();
  survey.isSinglePage = true;
  assert.equal(survey.visiblePages.length, 1, "You have one page");
  var page = survey.visiblePages[0];
  assert.equal(
    page.elements.length,
    2,
    "two pages has converted into two panels"
  );
  assert.equal(page.questions.length, 4, "there are 4 questions on the page");
});

QUnit.test("Survey show several pages as one, set and reset", function (assert) {
  var survey = twoPageSimplestSurvey();
  survey.isSinglePage = true;
  survey.isSinglePage = false;
  assert.equal(survey.visiblePages.length, 2, "We have still two pages");
  var page = survey.visiblePages[0];
  assert.equal(page.questions.length, 2, "there are 2 questions on the page");
  survey.isSinglePage = true;
  assert.equal(survey.visiblePages.length, 1, "Single page");
  survey.setDesignMode(true);
  assert.equal(survey.visiblePages.length, 2, "We have still two pages again");
});

QUnit.test("Survey show several pages as one + firstPageIsStartPage", function (
  assert
) {
  var survey = twoPageSimplestSurvey();
  var thirdPage = new PageModel("third");
  thirdPage.addNewQuestion("text", "q1");
  thirdPage.addNewQuestion("text", "q2");
  survey.pages.push(thirdPage);
  survey.firstPageIsStartPage = true;
  survey.isSinglePage = true;
  assert.equal(survey.pages.length, 3, "We have two pages here");
  assert.equal(survey.visiblePages.length, 1, "You have one page");
  var page = survey.visiblePages[0];
  assert.equal(page.elements.length, 2, "two pages has converted into two panels");
  assert.equal(page.questions.length, 4, "there are 4 questions on the page");
});

QUnit.test(
  "Survey.isSinglePage = true, question.visibleIndex set incorrectly, bug#925",
  function (assert) {
    var json = {
      showQuestionNumbers: "on",
      pages: [
        {
          elements: [
            {
              type: "radiogroup",
              name: "InvestorType",
              choices: ["entity", "Individual"],
            },
          ],
          name: "section1",
        },
        {
          elements: [
            {
              type: "panel",
              elements: [
                {
                  type: "text",
                  name: "q1",
                  visibleIf: "{InvestorType}='entity'",
                },
              ],
              name: "InvestmentAdvisorPanel",
              visibleIf: "{InvestorType}='entity'",
            },
            {
              type: "panel",
              elements: [
                {
                  type: "text",
                  name: "q2",
                  visibleIf: "{InvestorType}='entity'",
                },
              ],
              name: "FundOfFundsPanel",
              visibleIf: "{InvestorType} <> 'entity'",
            },
          ],
          name: "section2",
          visibleIf: "{InvestorType}='entity'",
        },
        {
          elements: [
            {
              type: "text",
              name: "q3",
              visibleIf: "{InvestorType}='entity'",
            },
          ],
          name: "section3",
          visibleIf: "{InvestorType}='entity'",
        },
      ],
    };
    var survey = new SurveyModel(json);
    survey.isSinglePage = true;
    assert.equal(
      (<Question>survey.getQuestionByName("InvestorType")).visibleIndex,
      0,
      "The first question"
    );
    survey.setValue("InvestorType", "entity");
    var q3 = survey.getQuestionByName("q3");
    assert.equal(
      (<Question>survey.getQuestionByName("q1")).visibleIndex,
      1,
      "The second question"
    );
    assert.equal(
      (<Question>survey.getQuestionByName("q2")).visibleIndex,
      -1,
      "The third question is invisible because of panel"
    );
    assert.equal(
      (<Question>survey.getQuestionByName("q3")).visibleIndex,
      2,
      "The forth question"
    );
  }
);

QUnit.test(
  "Survey.isSinglePage = true, the last page doesn't added, bug#1009",
  function (assert) {
    var json = {
      pages: [
        {
          name: "page1",
          elements: [
            {
              name: "text1",
              type: "text",
            },
          ],
        },
        {
          name: "page2",
          elements: [
            {
              name: "text2",
              type: "text",
            },
          ],
        },
        {
          name: "page3",
          elements: [
            {
              name: "text3",
              type: "text",
            },
          ],
        },
      ],
    };
    var survey = new SurveyModel(json);
    survey.isSinglePage = true;
    assert.equal(
      survey.currentPage.questions.length,
      3,
      "There are 3 elements on the single page"
    );
    assert.equal(
      survey.currentPage.rows.length,
      3,
      "There are 3 rows on the page"
    );
    assert.equal(
      survey.currentPage.rows[2].visible,
      true,
      "The last row is visible"
    );
  }
);

QUnit.test("isSinglePage = true and survey.showPageTitles = false, Bug#1914", function (assert) {
  const survey = twoPageSimplestSurvey();
  survey.pages[0].title = "Page 1";
  survey.pages[1].title = "Page 2";
  survey.showPageTitles = false;
  survey.isSinglePage = true;
  var panels = survey.currentPage.elements;
  assert.equal(panels.length, 2, "There are two panels");
  assert.equal((<PanelModel>panels[0]).hasTitle, false, "Panel1 title is hidden");
  assert.equal((<PanelModel>panels[1]).hasTitle, false, "Panel2 title is hidden");
});
QUnit.test(
  "check synhronization properties isSinglePage and questionsOnPageMode",
  function (assert) {
    var survey = twoPageSimplestSurvey();
    assert.equal(
      survey.isSinglePage,
      false,
      "isSinglePage is false by default"
    );
    assert.equal(
      survey.questionsOnPageMode,
      "standard",
      "questionsOnPageMode is 'standard' by default"
    );
    survey.isSinglePage = true;
    assert.equal(survey.isSinglePage, true, "set isSinglePage to true");
    assert.equal(
      survey.questionsOnPageMode,
      "singlePage",
      "questionsOnPageMode is 'singlePage' on setting isSinglePage to true"
    );
    survey.isSinglePage = false;
    assert.equal(survey.isSinglePage, false, "set isSinglePage to false");
    assert.equal(
      survey.questionsOnPageMode,
      "standard",
      "questionsOnPageMode is 'standard' on setting isSinglePage to false"
    );
    survey.questionsOnPageMode = "singlePage";
    assert.equal(
      survey.questionsOnPageMode,
      "singlePage",
      "set questionsOnPageMode to 'singlePage'"
    );
    assert.equal(
      survey.isSinglePage,
      true,
      "isSinglePage is true on setting questionsOnPageMode to 'singlePage'"
    );
    survey.questionsOnPageMode = "questionPerPage";
    assert.equal(
      survey.questionsOnPageMode,
      "questionPerPage",
      "set questionsOnPageMode to 'questionPerPage'"
    );
    assert.equal(
      survey.isSinglePage,
      false,
      "isSinglePage is false on setting questionsOnPageMode to 'questionPerPage'"
    );
    survey.questionsOnPageMode = "standard";
    assert.equal(
      survey.questionsOnPageMode,
      "standard",
      "set questionsOnPageMode to 'standard'"
    );
    assert.equal(
      survey.isSinglePage,
      false,
      "isSinglePage is false on setting questionsOnPageMode to 'standard'"
    );
  }
);

QUnit.test("survey.isSinglePage revert and other value", function (assert) {
  var survey = new SurveyModel({
    storeOthersAsComment: false,
    elements: [
      {
        type: "checkbox",
        name: "q1",
        hasOther: true,
        choices: [1, 2],
      },
    ],
  });
  var question = <QuestionCheckboxModel>survey.getQuestionByName("q1");
  question.value = "other";
  question.comment = "other2";
  survey.isSinglePage = true;
  assert.equal(
    survey.storeOthersAsComment,
    false,
    "Keep storeOthersAsComment false"
  );
  assert.equal(survey.getValue("q1"), "other2");
  question = <QuestionCheckboxModel>survey.getQuestionByName("q1");
  assert.deepEqual(question.value, ["other2"], "question value");
  assert.deepEqual(question.renderedValue, ["other"], "question renderedValue");
  assert.deepEqual(question.comment, "other2", "question comment");
  assert.deepEqual(survey.getValue("q1"), ["other2"], "survey value");
  assert.deepEqual(survey.getComment("q1"), "", "survey comment");
});

QUnit.test(
  "survey.storeOthersAsComment add checkbox question from code with preset value",
  function (assert) {
    var survey = new SurveyModel({
      storeOthersAsComment: false,
      elements: [{ type: "text", name: "q2" }],
    });
    survey.setValue("q1", ["other2"]);
    var question = new QuestionCheckboxModel("q1");
    question.choices = [1, 2];
    question.hasOther = true;
    survey.pages[0].addQuestion(question);
    assert.deepEqual(question.value, ["other2"], "question value");
    assert.deepEqual(
      question.renderedValue,
      ["other"],
      "question renderedValue"
    );
    assert.deepEqual(question.comment, "other2", "question comment");
    assert.deepEqual(survey.getValue("q1"), ["other2"], "survey value");
    assert.deepEqual(survey.getComment("q1"), "", "survey comment");
  }
);
QUnit.test("survey.questionsOnPageMode = 'questionOnPage', page rows & currentSingleQuestion", function (assert) {
  const survey = twoPageSimplestSurvey();
  const questions = survey.getAllQuestions(true);
  survey.questionsOnPageMode = "questionOnPage";
  assert.equal(survey.pages.length, 2, "We have the same number of pages");
  assert.equal(survey.isSingleVisibleQuestion, true, "it is single visible question mode");
  assert.equal(survey.currentSingleQuestion.name, questions[0].name, "currentSingleQuestion, #1");
  assert.equal(survey.pages[0].rows.length, 1, "rows.length, #1");
  assert.equal(survey.pages[0].rows[0].elements[0].name, questions[0].name, "rows element, #1");
  assert.equal(survey.isShowPrevButton, false, "prev buttton, #1");
  assert.equal(survey.isShowNextButton, true, "next buttton, #1");
  assert.equal(survey.isCompleteButtonVisible, false, "next buttton, #1");
  survey.performNext();
  assert.equal(survey.currentSingleQuestion.name, questions[1].name, "currentSingleQuestion, #2");
  assert.equal(survey.pages[0].rows.length, 1, "rows.length, #2");
  assert.equal(survey.pages[0].rows[0].elements[0].name, questions[1].name, "rows element, #2");
  assert.equal(survey.isShowPrevButton, true, "prev buttton, #2");
  assert.equal(survey.isShowNextButton, true, "next buttton, #2");
  assert.equal(survey.isCompleteButtonVisible, false, "next buttton, #2");
  survey.performNext();
  assert.equal(survey.currentPage.name, "Page 2", "currentSingleQuestion, #3");
  assert.equal(survey.currentSingleQuestion.name, questions[2].name, "currentSingleQuestion, #3");
  assert.equal(survey.pages[1].rows.length, 1, "rows.length, #3");
  assert.equal(survey.pages[1].rows[0].elements[0].name, questions[2].name, "rows element, #3");
  assert.equal(survey.isShowPrevButton, true, "prev buttton, #3");
  assert.equal(survey.isShowNextButton, true, "next buttton, #3");
  assert.equal(survey.isCompleteButtonVisible, false, "next buttton, #3");
  survey.performNext();
  assert.equal(survey.currentPage.name, "Page 2", "currentSingleQuestion, #4");
  assert.equal(survey.currentSingleQuestion.name, questions[3].name, "currentSingleQuestion, #4");
  assert.equal(survey.pages[1].rows.length, 1, "rows.length, #4");
  assert.equal(survey.pages[1].rows[0].elements[0].name, questions[3].name, "rows element, #4");
  assert.equal(survey.isShowPrevButton, true, "prev buttton, #4");
  assert.equal(survey.isShowNextButton, false, "next buttton, #4");
  assert.equal(survey.isCompleteButtonVisible, true, "next buttton, #4");
  survey.performPrevious();
  assert.equal(survey.currentPage.name, "Page 2", "currentSingleQuestion, #5");
  assert.equal(survey.currentSingleQuestion.name, questions[2].name, "currentSingleQuestion, #5");
  assert.equal(survey.pages[1].rows.length, 1, "rows.length, #5");
  assert.equal(survey.pages[1].rows[0].elements[0].name, questions[2].name, "rows element, #5");
  assert.equal(survey.isShowPrevButton, true, "prev buttton, #5");
  assert.equal(survey.isShowNextButton, true, "next buttton, #5");
  assert.equal(survey.isCompleteButtonVisible, false, "next buttton, #5");
  survey.performPrevious();
  assert.equal(survey.currentSingleQuestion.name, questions[1].name, "currentSingleQuestion, #6");
  assert.equal(survey.pages[0].rows.length, 1, "rows.length, #6");
  assert.equal(survey.pages[0].rows[0].elements[0].name, questions[1].name, "rows element, #6");
  assert.equal(survey.isShowPrevButton, true, "prev buttton, #6");
  assert.equal(survey.isShowNextButton, true, "next buttton, #6");
  assert.equal(survey.isCompleteButtonVisible, false, "next buttton, #6");

  survey.questionsOnPageMode = "standard";
  assert.equal(survey.pages[1].rows.length, 2, "page1 standard rows.length");
  assert.equal(survey.pages[1].rows.length, 2, "page2 standard rows.length");
  assert.notOk(survey.currentSingleQuestion, "No current question in standard mode");
  assert.equal(questions[0].page.name, "Page 1", "question1.page #1");

  survey.questionsOnPageMode = "questionOnPage";
  assert.equal(survey.pages.length, 2, "We have the same number of pages");
  assert.equal(survey.currentSingleQuestion.name, questions[0].name, "currentSingleQuestion, #6");
  assert.equal(questions[0].page.name, "Page 1", "question1.page #2");

  survey.questionsOnPageMode = "singlePage";
  assert.equal(survey.visiblePages.length, 1, "one visible page");
  assert.notOk(survey.currentSingleQuestion, "No current question in single page");
  assert.equal(questions[0].page.name, "single-page", "question1.page #3");

  survey.questionsOnPageMode = "questionOnPage";
  assert.equal(survey.pages.length, 2, "We have the same number of pages");
  assert.equal(survey.currentSingleQuestion.name, questions[0].name, "currentSingleQuestion, #7");
  assert.equal(questions[0].page.name, "Page 1", "question1.page #4");
});
QUnit.test("survey.questionsOnPageMode = 'questionOnPage' & survey.clear", function (assert) {
  const survey = twoPageSimplestSurvey();
  const questions = survey.getAllQuestions(true);
  survey.questionsOnPageMode = "questionOnPage";
  survey.performNext();
  survey.performNext();
  assert.equal(survey.currentSingleQuestion.name, questions[2].name, "currentSingleQuestion, #1");
  survey.clear();
  assert.equal(survey.currentSingleQuestion.name, questions[0].name, "currentSingleQuestion, #2");
});

QUnit.test("survey.questionsOnPageMode, property test", function (assert) {
  var survey = twoPageSimplestSurvey();
  var questions = survey.getAllQuestions();
  survey.questionsOnPageMode = "questionOnPage";
  assert.equal(survey.pages.length, 2, "We have the same number of pages");
  assert.equal(survey.isSingleVisibleQuestion, true, "it is single visible question mode");
  assert.equal(survey.currentSingleQuestion.name, questions[0].name, "currentSingleQuestion, #1");
  assert.equal(survey.pages[0].rows.length, 1, "rows.length, #1");
  assert.equal(survey.pages[0].rows[0].elements[0].name, questions[0].name, "rows element, #1");
  assert.equal(survey.isShowPrevButton, false, "prev buttton, #1");
  assert.equal(survey.isShowNextButton, true, "next buttton, #1");
  assert.equal(survey.isCompleteButtonVisible, false, "next buttton, #1");

  survey.questionsOnPageMode = "singlePage";
  assert.equal(survey.visiblePages.length, 1, "We have one page");
  assert.equal(survey.currentPage.questions.length, questions.length, "All questions on single page");
  assert.equal(questions[0].page.name, "single-page", "question1.page #1");

  survey.questionsOnPageMode = "standard";
  assert.equal(survey.visiblePages.length, 2, "Origional pages, #2");
  assert.equal(survey.visiblePages[0].questions.length, 2, "There are two questions on the origional first page, #2");
  assert.equal(questions[0].page.name, "Page 1", "question1.page #2");
});

QUnit.test(
  "survey.questionsOnPageMode=singlePage, defualt value and visibleIf",
  function (assert) {
    var survey = new SurveyModel({
      pages: [
        {
          name: "page1",
          elements: [
            {
              type: "checkbox",
              name: "question1",
              choices: ["item1", "item2", "item3"],
            },
            {
              type: "checkbox",
              name: "question2",
              visibleIf: "{question1} contains ['item2']",
              titleLocation: "hidden",
              defaultValue: ["item1"],
              isRequired: true,
              readOnly: true,
              choices: [
                {
                  value: "item1",
                  visibleIf: "{question1} contains ['item1']",
                },
                "item2",
                "item3",
              ],
            },
          ],
        },
      ],
    });

    survey.questionsOnPageMode = "singlePage";
    var q1 = survey.getQuestionByName("question1");
    var q2 = survey.getQuestionByName("question2");
    q1.value = ["item1"];
    q1.value = ["item1", "item2"];
    assert.deepEqual(q2.value, ["item1"], "Set default value");
    assert.deepEqual(
      q2.renderedValue,
      ["item1"],
      "Set default value into rendered value"
    );
    survey.data = {};
    q1.isRequired = true;
    assert.equal(survey.tryComplete(), false, "You can't complete the last page");
  }
);

QUnit.test("Survey page hasShown", function (assert) {
  var survey = twoPageSimplestSurvey();
  assert.equal(survey.pages[0].hasShown, true, "The first page was shown");
  assert.equal(
    survey.pages[1].hasShown,
    false,
    "The second page was not shown"
  );
  assert.equal(
    survey.pages[1].hasShown,
    false,
    "The second page was not shown"
  );
  survey.nextPage();
  assert.equal(survey.pages[1].hasShown, true, "The second page was shown");
  survey.clear();
  assert.equal(
    survey.pages[1].hasShown,
    false,
    "The second page hasShown is false again"
  );
});
QUnit.test("Questions are randomized", function (assert) {
  var survey = twoPageSimplestSurvey();
  var page = survey.pages[0];
  assert.equal(
    page.areQuestionsRandomized,
    false,
    "By default questions are not randomized"
  );
  page.questionOrder = "random";
  assert.equal(
    page.areQuestionsRandomized,
    true,
    "page.questionOrder = 'random'"
  );
  page.questionOrder = "default";
  assert.equal(
    page.areQuestionsRandomized,
    false,
    "page.questionOrder = 'default'"
  );
  survey.questionOrder = "random";
  assert.equal(
    page.areQuestionsRandomized,
    true,
    "survey.questionOrder = 'random' && page.questionOrder = 'default'"
  );
  page.questionOrder = "initial";
  assert.equal(
    page.areQuestionsRandomized,
    false,
    "page.questionOrder = 'initial'"
  );
});

class HelpTest {
  public static randomizeArray<T>(array: Array<T>): Array<T> {
    if (array.length < 2) return array;
    const el0 = array[0];
    array.splice(0, 1, array[array.length - 1]);
    array.splice(array.length - 1, 1, el0);
    return array;
  }
}

QUnit.test("Randomize questions in page and panels", function (assert) {
  const oldFunc = Helpers.randomizeArray;
  Helpers.randomizeArray = HelpTest.randomizeArray;
  const json: any = {
    pages: [
      {
        questionOrder: "random",
        elements: [
          { type: "text", name: "q1" },
          { type: "panel", name: "p1", elements: [{ type: "text", name: "p1q1" }, { type: "text", name: "p1q2" }] },
          { type: "panel", questionOrder: "initial", name: "p2", elements: [{ type: "text", name: "p2q1" }, { type: "text", name: "p2q2" }] },
          { type: "panel", questionOrder: "random", name: "p3", elements: [{ type: "text", name: "p3q1" }, { type: "text", name: "p3q2" }] },
        ]
      }
    ]
  };
  //Page random
  var survey = new SurveyModel(json);
  var p1 = survey.getPanelByName("p1");
  var p2 = survey.getPanelByName("p2");
  var p3 = survey.getPanelByName("p3");
  var page = survey.pages[0];
  page.setWasShown(true);
  assert.equal(page.elements[0].name, "p3");
  assert.equal(page.elements[3].name, "q1");
  assert.equal(p1.elements[0].name, "p1q2");
  assert.equal(p1.elements[1].name, "p1q1");
  assert.equal(p2.elements[0].name, "p2q1");
  assert.equal(p2.elements[1].name, "p2q2");
  assert.equal(p3.elements[0].name, "p3q2");
  assert.equal(p3.elements[1].name, "p3q1");

  delete json.pages[0].questionOrder;
  survey = new SurveyModel(json);
  page = survey.pages[0];
  p1 = survey.getPanelByName("p1");
  p2 = survey.getPanelByName("p2");
  p3 = survey.getPanelByName("p3");
  page.setWasShown(true);
  assert.equal(page.elements[0].name, "q1");
  assert.equal(page.elements[3].name, "p3");
  assert.equal(p1.elements[0].name, "p1q1");
  assert.equal(p1.elements[1].name, "p1q2");
  assert.equal(p2.elements[0].name, "p2q1");
  assert.equal(p2.elements[1].name, "p2q2");
  assert.equal(p3.elements[0].name, "p3q2");
  assert.equal(p3.elements[1].name, "p3q1");

  Helpers.randomizeArray = oldFunc;
});
QUnit.test("Randomize questions in page and panels & single question per page", function (assert) {
  const oldFunc = Helpers.randomizeArray;
  Helpers.randomizeArray = HelpTest.randomizeArray;

  const survey = new SurveyModel({
    questionsOnPageMode: "questionPerPage",
    questionOrder: "random",
    pages: [
      { elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }, { type: "text", name: "q3" }] },
      { elements: [{ type: "text", name: "q4" }, { type: "text", name: "q5" }, { type: "text", name: "q6" }] },
    ]
  });
  const page = survey.pages[0];
  assert.equal(page.elements[0].name, "q3");
  assert.equal(page.elements[2].name, "q1");
  assert.equal(survey.currentSingleQuestion.name, "q3", "The first question is q3");
  survey.performNext();
  survey.performNext();
  survey.performNext();
  assert.equal(survey.currentSingleQuestion.name, "q6", "The current question is q6");

  Helpers.randomizeArray = oldFunc;
});
QUnit.test("questionPerPage vs nextPage&prevPage", function (assert) {
  const survey = new SurveyModel({
    questionsOnPageMode: "questionPerPage",
    pages: [
      { elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }] },
      { elements: [{ type: "text", name: "q3" }, { type: "text", name: "q4" }] },
    ]
  });
  assert.equal(survey.currentSingleQuestion.name, "q1", "currentSingleQuestion #1");
  survey.nextPage();
  assert.equal(survey.currentSingleQuestion.name, "q2", "currentSingleQuestion #2");
  survey.nextPage();
  assert.equal(survey.currentSingleQuestion.name, "q3", "currentSingleQuestion #3");
  survey.nextPage();
  assert.equal(survey.currentSingleQuestion.name, "q4", "currentSingleQuestion #4");
  survey.prevPage();
  assert.equal(survey.currentSingleQuestion.name, "q3", "currentSingleQuestion #5");
  survey.prevPage();
  assert.equal(survey.currentSingleQuestion.name, "q2", "currentSingleQuestion #6");
  survey.prevPage();
  assert.equal(survey.currentSingleQuestion.name, "q1", "currentSingleQuestion #7");
});

QUnit.test("Quiz, correct, incorrect answers", function (assert) {
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
  assert.equal(
    survey.getAllQuestions().length,
    4,
    "There are 4 questions in total"
  );
  for (var i = 1; i <= 4; i++) {
    (<Question>survey.getQuestionByName("q" + i)).correctAnswer = "q" + i;
  }
  var page = new PageModel("start");
  page.addNewQuestion("text", "name");
  page.addNewQuestion("text", "email");
  survey.pages.unshift(page);
  survey.firstPageIsStartPage = true;
  survey.completedHtml =
    "{correctedAnswers}, {inCorrectedAnswers}, {questionCount}";
  survey.start();
  assert.equal(
    survey.getAllQuestions().length,
    6,
    "There are 6 questions in total"
  );
  assert.equal(
    survey.getCorrectedAnswers(),
    0,
    "The number of corrected answers is 0"
  );
  assert.equal(
    survey.getInCorrectedAnswers(),
    4,
    "The number of incorrected answers is 4"
  );
  survey.getQuestionByName("q1").visible = false;
  assert.equal(
    survey.getInCorrectedAnswers(),
    3,
    "The number of incorrected answers is 3"
  );
  (<Question>survey.getQuestionByName("q2")).value = "q2";
  assert.equal(
    survey.getCorrectedAnswers(),
    1,
    "The number of corrected answers is 1"
  );
  assert.equal(
    survey.getInCorrectedAnswers(),
    2,
    "The number of incorrected answers is 2"
  );
  (<Question>survey.getQuestionByName("q3")).value = "q10";
  (<Question>survey.getQuestionByName("q4")).value = "q4";
  assert.equal(
    survey.getCorrectedAnswers(),
    2,
    "The number of corrected answers is 2"
  );
  assert.equal(
    survey.getInCorrectedAnswers(),
    1,
    "The number of incorrected answers is 1"
  );
  (<Question>survey.getQuestionByName("q4")).visible = false;
  assert.equal(
    survey.getCorrectedAnswers(),
    1,
    "The number of corrected answers is 1"
  );
  assert.equal(
    survey.getInCorrectedAnswers(),
    1,
    "The number of incorrected answers is 1"
  );
  (<Question>survey.getQuestionByName("q4")).visible = true;
  assert.equal(
    survey.processedCompletedHtml,
    "2, 1, 3",
    "competed html is correct"
  );
});
QUnit.test("Quiz, correct, incorrect answers - caseinsensitive", function (
  assert
) {
  settings.comparator.caseSensitive = false;
  var survey = new SurveyModel({
    pages: [
      {
        elements: [{ type: "text", name: "q1", correctAnswer: "MyAnswer" }],
      },
    ],
  });
  assert.equal(survey.getCorrectedAnswers(), 0, "No correct answer");
  survey.setValue("q1", "answer");
  assert.equal(survey.getCorrectedAnswers(), 0, "Still no correct answer");
  survey.setValue("q1", "myanswer");
  assert.equal(survey.getCorrectedAnswers(), 1, "the answer is correct");
});
QUnit.test("Quiz, correct, multiple text", function (assert) {
  const survey = new SurveyModel({
    "elements": [
      {
        "type": "multipletext",
        "name": "root",
        "correctAnswer": {
          "text1": "Text1",
          "text2": "Text2"
        },
        "items": [{
          "name": "text1",
        }, {
          "name": "text2",
        }]
      }
    ]
  });
  assert.equal(survey.getCorrectedAnswers(), 0, "No correct answer");
  survey.setValue("root", {
    "text1": "text1",
    "text2": "text2"
  });
  assert.equal(survey.getCorrectedAnswers(), 1, "Check as case insensitive");
});
QUnit.test("Quiz, correct, incorrect answers, questionCount in expressions", function (
  assert
) {
  var survey = new SurveyModel({
    elements: [
      { type: "text", name: "q1", correctAnswer: "val1" },
      { type: "text", name: "q2", correctAnswer: "val2" },
      { type: "text", name: "q3", correctAnswer: "val3" }
    ],
    calculatedValues: [
      { name: "calc1", expression: "{correctAnswers}" },
      { name: "calc2", expression: "{incorrectAnswers}" },
      { name: "calc3", expression: "{questionCount}" },
    ]
  });
  survey.setValue("q1", "val1");
  survey.setValue("q3", "val_incorrect");
  assert.equal(survey.calculatedValues[0].value, 1, "correctedAnswers");
  assert.equal(survey.calculatedValues[1].value, 2, "inCorrectedAnswers");
  assert.equal(survey.calculatedValues[2].value, 3, "questionCount");
  survey.setValue("q2", "val2");
  assert.equal(survey.calculatedValues[0].value, 2, "correctedAnswers #2");
  assert.equal(survey.calculatedValues[1].value, 1, "inCorrectedAnswers #2");
  assert.equal(survey.calculatedValues[2].value, 3, "questionCount #2");
});
QUnit.test(
  "Store data on the first page, firstPageIsStartPage = true, Bug #1580",
  function (assert) {
    var survey = twoPageSimplestSurvey();
    var questionCount = survey.getAllQuestions().length;
    var page = new PageModel("start");
    page.addNewQuestion("text", "name");
    page.addNewQuestion("text", "email");
    survey.pages.unshift(page);
    assert.equal(
      questionCount + 2,
      survey.getAllQuestions().length,
      "Two questions have been added"
    );
    survey.firstPageIsStartPage = true;
    assert.equal(
      questionCount + 2,
      survey.getAllQuestions().length,
      "Two questions on the first page are still here"
    );
    assert.equal(
      survey.getQuestionByName("name").name,
      "name",
      "Question is here"
    );
    survey.getQuestionByName("name").value = "John";
    survey.getQuestionByName("email").value = "john@gmail.com";
    survey.start();
    assert.deepEqual(
      survey.data,
      { name: "John", email: "john@gmail.com" },
      "Data on the first page is saved"
    );
    survey.doComplete();
    assert.deepEqual(
      survey.data,
      { name: "John", email: "john@gmail.com" },
      "Data on the first page is still here after complete."
    );
  }
);

QUnit.test(
  "Validate questions on the first page, firstPageIsStartPage = true, Bug #1976",
  function (assert) {
    var survey = new SurveyModel({
      firstPageIsStartPage: true,
      pages: [
        {
          name: "Start Page",
          questions: [
            {
              type: "html",
              html: "1",
            },
            {
              type: "text",
              name: "name",
              isRequired: true,
            },
          ],
        },
        {
          name: "First Page",
          questions: [
            {
              type: "text",
              name: "q1",
            },
          ],
        },
      ],
    });
    assert.equal(survey.state, "starting", "We are starting");
    var res = survey.start();
    assert.equal(res, false, "We could not start");
    assert.equal(survey.state, "starting", "We are still starting");
    assert.notEqual(survey.state, "running", "We are not starting yet");
    survey.setValue("name", "some name");
    res = survey.start();
    assert.equal(res, true, "We could start");
    assert.equal(survey.state, "running", "We are running");
    assert.equal(survey.currentPage.name, "First Page");
  }
);

QUnit.test(
  "Quiz, correct, incorrect answers and onIsAnswerCorrect event",
  function (assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("page");
    var q1 = <QuestionCheckboxModel>page.addNewQuestion("checkbox", "q1");
    q1.choices = [1, 2, 3, 4];
    q1.correctAnswer = [2, 3];
    q1.value = [1];
    assert.equal(survey.getQuizQuestions().length, 1, "survey.getQuizQuestions().length");
    assert.equal(survey.getCorrectAnswerCount(), 0, "The answer is incorrect, #1");
    q1.value = [3, 2];
    assert.equal(q1.correctAnswerCount, 1, "q1.correctAnswerCount, #1");
    assert.equal(survey.getCorrectAnswerCount(), 1, "The answer is correct now, #2");
    let counter = 0;
    survey.onIsAnswerCorrect.add(function (survey, options) {
      counter++;
      const q = options.question;
      options.result = Helpers.isTwoValueEquals(q.value, q.correctAnswer, false);
    });
    assert.equal(q1.correctAnswerCount, 0, "q1.correctAnswerCount, #2");
    assert.equal(counter, 1, "counter #1");
    assert.equal(survey.getCorrectedAnswerCount(), 0, "The order is important now, #3");
    assert.equal(counter, 2, "counter #2");
    q1.value = [2, 3];
    assert.equal(survey.getCorrectedAnswerCount(), 1, "The order is correct, #4");
    assert.equal(counter, 3, "counter #3");
  }
);
QUnit.test("Quiz, correct, incorrect answers and onIsAnswerCorrect event", function (assert) {
  const survey = new SurveyModel({
    "elements": [
      {
        "type": "text",
        "name": "q1",
        "correctAnswer": "hi"
      }
    ]
  });
  settings.comparator.caseSensitive = true;
  survey.setValue("q1", "HI");
  assert.equal(survey.getCorrectedAnswerCount(), 0, "It is case sensitive");
  survey.setValue("q1", "hi");
  assert.equal(survey.getCorrectedAnswerCount(), 1, "It is correct");
  settings.comparator.caseSensitive = false;
});
QUnit.test(
  "Quiz, correct, incorrect answers and onIsAnswerCorrect event for matrix, https://surveyjs.answerdesk.io/ticket/details/T2606",
  function (assert) {
    var survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1", correctAnswer: "val1" },
        {
          type: "matrix",
          name: "q2",
          columns: ["col1", "col2"],
          rows: ["row1", "row2", "row3", "row4"],
          correctAnswer: { row1: "col1", row2: "col2", row3: "col1" },
        },
      ],
    });
    assert.equal(
      survey.getCorrectedAnswers(),
      0,
      "There is no correct answers yet"
    );
    assert.equal(survey.getQuizQuestionCount(), 4, "one text + 3 matrix");
    survey.setValue("q1", "val1");
    survey.setValue("q2", { row1: "col1", row2: "col1", row3: "col1" });
    assert.equal(
      survey.getCorrectedAnswers(),
      3,
      "1 in text question + 2 in matrix"
    );
    assert.equal(survey.getInCorrectedAnswers(), 1, "1 in matrix");
  }
);
QUnit.test("question.isCorrectAnswer() and onIsAnswerCorrect event", function (assert) {
  const survey = new SurveyModel({
    elements: [
      { type: "text", name: "q1", correctAnswer: 1 },
      { type: "text", name: "q2", correctAnswer: 2 }
    ]
  });
  let counter = 0;
  survey.onIsAnswerCorrect.add((sender, options) => {
    counter++;
    const q = options.question;
    options.result = Math.abs(q.value - q.correctAnswer) < 2;
  });
  const q1 = survey.getQuestionByName("q1");
  const q2 = survey.getQuestionByName("q2");
  assert.equal(counter, 0, "counter #1");
  assert.equal(q1.isAnswerCorrect(), false, "Value is empty");
  assert.equal(counter, 0, "counter #2");
  q1.value = 1;
  assert.equal(q1.isAnswerCorrect(), true, "q1.value = 1");
  assert.equal(counter, 1, "counter #3");
  q1.value = 5;
  assert.equal(q1.isAnswerCorrect(), false, "q1.value = 5");
  assert.equal(counter, 2, "counter #4");
  q1.value = 2;
  assert.equal(q1.isAnswerCorrect(), true, "q1.value = 2");
  assert.equal(counter, 3, "counter #5");
  q2.value = 3;
  assert.equal(q2.isAnswerCorrect(), true, "q2.value = 3");
  assert.equal(counter, 4, "counter #6");
  assert.equal(q2.isAnswerCorrect(), true, "q2.value = 3");
  assert.equal(counter, 5, "counter #7");
});
QUnit.test(
  "Quiz, correct, trim value on checking correct answers, https://surveyjs.answerdesk.io/ticket/details/T6569",
  function (assert) {
    var survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1", correctAnswer: "val1 " },
        { type: "text", name: "q2", correctAnswer: " val2" },
        { type: "text", name: "q3", correctAnswer: "val3" },
      ],
    });
    assert.equal(
      survey.getCorrectedAnswers(),
      0,
      "There is no correct answers yet"
    );
    survey.setValue("q1", "val1");
    survey.setValue("q2", "val2 ");
    survey.setValue("q3", " val3 ");
    assert.equal(survey.getCorrectedAnswers(), 3, "trim values");
  }
);
QUnit.test(
  "survey.onGetQuestionTitle event. Update unit test for bug: #2298",
  function (assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("page");
    var question = <Question>page.addNewQuestion("text", "question1");
    assert.equal(
      question.fullTitle,
      "question1",
      "by default it is question name if title is empty"
    );
    var questionName = "";
    survey.onGetQuestionTitle.add(function (survey, options) {
      questionName = options.question.name;
      if (options.question.title == options.question.name) options.title = "";
    });
    assert.equal(question.fullTitle, "", "it is empty now");
    //check bug: #2298
    assert.equal(questionName, "question1", "options.question is corrrect");
  }
);

QUnit.test(
  "Do not run conditions (enableIf/visibleIf) at design-time/Editor, Bug #999",
  function (assert) {
    var survey = new SurveyModel();
    var page1 = survey.addNewPage("page1");
    var page2 = survey.addNewPage("page2");
    var panel = page1.addNewPanel("panel");
    var question = <Question>panel.addNewQuestion("text", "question");
    page1.addNewQuestion("text", "q1");
    survey.setDesignMode(true);
    page2.visibleIf = "{q1} = 1";
    panel.visibleIf = "{q1} = 1";
    question.enableIf = "{q1} = 1";
    survey.setValue("q1", 2);
    assert.equal(
      page2.visible,
      true,
      "Page object doesn't run condition at design"
    );
    assert.equal(
      panel.visible,
      true,
      "Panel object doesn't run condition at design"
    );
    assert.equal(
      question.readOnly,
      false,
      "Question object doesn't run condition at design"
    );
  }
);

QUnit.test("condition function isContainerReady", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("page1");
  var panel = page.addNewPanel("panel1");
  var q1 = <QuestionTextModel>panel.addNewQuestion("text", "q1");
  var q2 = <QuestionTextModel>panel.addNewQuestion("text", "q2");
  q1.isRequired = q2.isRequired = true;
  q2.validators.push(new EmailValidator());
  var qTest = <QuestionTextModel>panel.addNewQuestion("text", "qTest");
  qTest.visible = false;
  qTest.visibleIf = "isContainerReady('panel1') = true";
  assert.equal(qTest.isVisible, false, "It is invisible by default");
  q1.value = "1";
  assert.equal(qTest.isVisible, false, "q2 is empty");
  q2.value = "2";
  assert.equal(qTest.isVisible, false, "q2 is not e-mail");
  q2.value = "email@mail.com";
  assert.equal(qTest.isVisible, true, "isContainerReady returns true");
});

QUnit.test("Use 'question' in function context", function (assert) {
  function isFirstLastChoiceSelected(params): boolean {
    if (!this.question || question.isEmpty()) return false;
    var first = question.choices[0].value;
    var last = question.choices[question.choices.length - 1].value;
    return (
      question.value.indexOf(first) > -1 && question.value.indexOf(last) > -1
    );
  }
  FunctionFactory.Instance.register(
    "isFirstLastChoiceSelected",
    isFirstLastChoiceSelected
  );
  var survey = new SurveyModel();
  var page = survey.addNewPage("page1");
  var question = <QuestionCheckboxModel>page.addNewQuestion("checkbox", "q1");
  question.choices = [1, 2, 3, 4, 5];
  question.visibleIf = "isFirstLastChoiceSelected() == true";
  assert.equal(question.isVisible, false, "first and last is not selected");
  question.value = [1, 2];
  assert.equal(question.isVisible, false, "first and last is not selected yet");
  question.value = [1, 3, 5];
  assert.equal(question.isVisible, true, "first and last is selected");
  FunctionFactory.Instance.unregister("isFirstLastChoiceSelected");
});

QUnit.test(
  "Infinitive loop on setting value to checkbox, if there is a text question with the same name, Bug #1015",
  function (assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("p");
    var qCheck = <QuestionCheckboxModel>(
      page.addNewQuestion("checkbox", "onename")
    );
    qCheck.choices = [
      { value: "item1", text: "display 1" },
      { value: "item2", text: "display 2" },
    ];
    var qText = page.addNewQuestion("text", "onename");
    survey.setValue("onename", ["item1"]);
    assert.deepEqual(
      survey.getValue("onename"),
      ["item1"],
      "The value set correctly"
    );
  }
);

QUnit.test(
  "visibleIf and adding/remove elements on changing visible, Bug #1044",
  function (assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("p");
    page.addNewQuestion("text", "q1");
    var q2 = page.addNewQuestion("text", "q2");
    var q3 = page.addNewQuestion("text", "q3");
    q2.visibleIf = "{q1} = 2";
    q3.visibleIf = "{q1} = 3";

    survey.onVisibleChanged.add(function (survey, options) {
      if (options.visible) {
        var question = options.question;
        survey.currentPage.removeQuestion(question);
        survey.currentPage.addQuestion(question);
      }
    });

    assert.equal(q2.isVisible, false, "Initially q2 is invisible");
    assert.equal(q3.isVisible, false, "Initially q3 is invisible");
    survey.setValue("q1", 2);
    assert.equal(q2.isVisible, true, "q1=2, q2 is visible");
    assert.equal(q3.isVisible, false, "q1=2, q3 is invisible");
    survey.setValue("q1", 3);
    assert.equal(q2.isVisible, false, "q1=3, q2 is invisible");
    assert.equal(q3.isVisible, true, "q1=3, q3 is visible");
  }
);
QUnit.test("survey.onVisibleChanged & survey.onQuestionVisibleChanged are same events", function (assert) {
  const survey = new SurveyModel();
  assert.equal(survey.onVisibleChanged.length, 0, "#1 onVisibleChanged.length");
  assert.equal(survey.onQuestionVisibleChanged.length, 0, "#1 onQuestionVisibleChanged.length");
  survey.onQuestionVisibleChanged.add((sender, options) => { });
  assert.equal(survey.onVisibleChanged.length, 1, "#2 onVisibleChanged.length");
  assert.equal(survey.onQuestionVisibleChanged.length, 1, "#2 onQuestionVisibleChanged.length");
  survey.onQuestionVisibleChanged.clear();
  assert.equal(survey.onVisibleChanged.length, 0, "#3 onVisibleChanged.length");
  assert.equal(survey.onQuestionVisibleChanged.length, 0, "#3 onQuestionVisibleChanged.length");
  survey.onVisibleChanged.add((sender, options) => { });
  assert.equal(survey.onVisibleChanged.length, 1, "#4 onVisibleChanged.length");
  assert.equal(survey.onQuestionVisibleChanged.length, 1, "#4 onQuestionVisibleChanged.length");
  survey.onVisibleChanged.clear();
  assert.equal(survey.onVisibleChanged.length, 0, "#5 onVisibleChanged.length");
  assert.equal(survey.onQuestionVisibleChanged.length, 0, "#5 onQuestionVisibleChanged.length");
});

QUnit.test(
  "Process text with question name containing '-' and '+', Bug #1080",
  function (assert) {
    var json = {
      elements: [
        { type: "text", name: "1-2+3" },
        {
          type: "text",
          name: "age",
          visibleIf: "{1-2+3} notempty",
          title: "Hi, {1-2+3}",
        },
      ],
    };
    var survey = new SurveyModel(json);
    var qAge = <Question>survey.getQuestionByName("age");
    assert.equal(qAge.isVisible, false, "It is hidden by default");
    survey.setValue("1-2+3", "John");
    assert.equal(qAge.isVisible, true, "It is visible now");
    assert.equal(
      qAge.locTitle.renderedHtml,
      "Hi, John",
      "title processed correctly"
    );
  }
);

QUnit.test(
  "clearInvisibleValues: 'onHidden' doesn't work. The fix was created by introducing conditionVersion, Bug ##1172. NOTE conditionVersion was removed due refactoring and using different approach",
  function (assert) {
    var json = {
      pages: [
        {
          name: "issueType",
          elements: [
            {
              type: "dropdown",
              name: "issueType",
              choices: [
                {
                  value: "installJaxx",
                  text: "Install",
                },
                {
                  value: "backupPhrase",
                  text: "backup ",
                },
              ],
            },
          ],
        },
        {
          name: "installJaxx",
          elements: [
            {
              type: "radiogroup",
              name: "choosePlatform",
              visibleIf: "{issueType} = 'installJaxx'",
              choices: [
                {
                  value: "linux",
                  text: "Linux",
                },
                {
                  value: "android",
                  text: "Android",
                },
              ],
            },
          ],
        },
        {
          name: "pageInstallLinux",
          elements: [
            {
              type: "text",
              name: "installLinux",
              visibleIf: "{choosePlatform} = 'linux'",
            },
          ],
        },
      ],
      clearInvisibleValues: "onHidden",
    };
    var survey = new SurveyModel(json);
    var qchoosePlatform = <Question>survey.getQuestionByName("choosePlatform");
    var qinstallLinux = <Question>survey.getQuestionByName("installLinux");
    assert.equal(
      qchoosePlatform.isVisible,
      false,
      "choosePlatform is not visible initial"
    );
    assert.equal(
      qinstallLinux.isVisible,
      false,
      "installLinux is not visible initial"
    );
    survey.setValue("issueType", "installJaxx");
    assert.equal(
      qchoosePlatform.isVisible,
      true,
      "choosePlatform is visible step 1"
    );
    assert.equal(
      qinstallLinux.isVisible,
      false,
      "installLinux is not visible step 1"
    );
    survey.setValue("choosePlatform", "linux");
    assert.equal(
      qchoosePlatform.isVisible,
      true,
      "choosePlatform is visible step 2"
    );
    assert.equal(
      qinstallLinux.isVisible,
      true,
      "installLinux is visible step 2"
    );
    survey.setValue("issueType", "backupPhrase");
    assert.equal(
      qchoosePlatform.isVisible,
      false,
      "choosePlatform is visible step 3"
    );
    assert.equal(
      qchoosePlatform.isEmpty(),
      true,
      "choosePlatform is empty step 3"
    );
    assert.equal(
      qinstallLinux.isVisible,
      false,
      "installLinux is not visible step 3"
    );
  }
);

QUnit.test("readOnly, enabledIf for Panels and Pages", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("page");
  var panel1 = page.addNewPanel("panel1");
  var panel2 = panel1.addNewPanel("panel2");
  survey.setValue("val1", 1);
  panel1.enableIf = "{val1} == 1";
  var question1 = <Question>panel1.addNewQuestion("text", "question1");
  var question2 = <Question>panel2.addNewQuestion("text", "question2");
  assert.equal(question2.isReadOnly, false, "It is not readOnly by default");
  survey.setValue("val1", 2);
  assert.equal(question1.isReadOnly, true, "question1 is readOnly");
  assert.equal(question2.isReadOnly, true, "question2 is readOnly");
  assert.equal(panel1.isReadOnly, true, "panel1 is readOnly");
  assert.equal(panel2.isReadOnly, true, "panel2 is readOnly");

  var question3 = <Question>panel2.addNewQuestion("text", "question3");
  assert.equal(question3.isReadOnly, true, "question3 is readOnly");

  survey.setValue("val1", 1);
  assert.equal(question2.isReadOnly, false, "question2 is editable");

  panel2.readOnly = true;
  assert.equal(
    question1.isReadOnly,
    false,
    "question1 is not readOnly, panel2 is ReadOnly"
  );
  assert.equal(
    question2.isReadOnly,
    true,
    "question2 is readOnly, panel2 is ReadOnly"
  );
});

QUnit.test("Hide question numbers on particular page", function (assert) {
  var survey = new SurveyModel();
  survey.addNewPage("page1");
  survey.addNewPage("page2");
  survey.addNewPage("page3");
  survey.pages[0].addNewQuestion("text", "q1");
  survey.pages[1].addNewQuestion("text", "q2");
  survey.pages[2].addNewQuestion("text", "q3");
  var question = <Question>survey.getQuestionByName("q3");
  assert.equal(question.fullTitle, "q3", "It has number 3");
  survey.pages[1].questionTitleLocation = "hidden";
  assert.equal(question.fullTitle, "q3", "It has number 2 now");
});

QUnit.test("Could not assign value into mutlipletext question, #1229", function (
  assert
) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("page1");
  var question = new QuestionMultipleTextModel("q1");
  question.addItem("item1");
  question.addItem("item2");
  page.addQuestion(question);
  survey.data = { q1: { item1: "val1", item2: "val2" } };
  assert.equal(
    question.items[0].editor.value,
    "val1",
    "val1 is set to the question item"
  );
  assert.equal(
    question.items[1].editor.value,
    "val2",
    "val1 is set to the question item"
  );
});

QUnit.test("ProcessTextEx returnedDisplayValue is false, Bug#1243", function (
  assert
) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("page1");
  var q = <QuestionDropdownModel>page.addNewQuestion("dropdown", "region");
  q.choices = ["1", "2", "3"];
  var res = survey.processTextEx({ text: "{region}" });
  assert.ok(res.hasAllValuesOnLastRun === false, "region doesn't exists");
  q.value = 1;
  res = survey.processTextEx({ text: "{region}" });
  assert.ok(res.hasAllValuesOnLastRun === true, "region exists");
});
QUnit.test("ProcessTextEx & nessted obj, Bug#9390", function (assert) {
  const survey = new SurveyModel();
  survey.setVariable("a1", { b2: "abc" });
  assert.equal(survey.processTextEx({ text: "test: {a1.b2}" }).text, "test: abc", "#1");
  assert.equal(survey.processTextEx({ text: "test: {c: {a1.b2}}" }).text, "test: {c: abc}", "#2");
  assert.equal(survey.processTextEx({ text: "test: { c: {a1.b2} }" }).text, "test: { c: abc }", "#3");
  assert.equal(survey.processTextEx({ text: "test: {c: \"{a1.b2}\"}" }).text, "test: {c: \"abc\"}", "#4");
  assert.equal(survey.processTextEx({ text: "test: { c: \"{a1.b2}\" }" }).text, "test: { c: \"abc\" }", "#5.1");
  assert.equal(survey.processTextEx({ text: "test: { c: \"{a1.b2}\" }" }).hasAllValuesOnLastRun, true, "#5.2");
  assert.equal(survey.processTextEx({ text: "inputs={\"car_make\": \"{a1.b2}\"}" }).text, "inputs={\"car_make\": \"abc\"}", "#6.1");
  assert.equal(survey.processTextEx({ text: "inputs={\"car_make\": \"{a1.b2}\"}" }).hasAllValuesOnLastRun, true, "#6.2");
  assert.equal(survey.processTextEx({ text: "inputs={\"car_make\": \"abc\"}" }).text, "inputs={\"car_make\": \"abc\"}", "#7.1");
  assert.equal(survey.processTextEx({ text: "inputs={\"car_make\": \"abc\"}" }).hasAllValuesOnLastRun, true, "#7.2");
});
QUnit.test("ProcessTextEx replaceUndefinedValues is true, Bug#9417", function (assert) {
  const survey = new SurveyModel();
  survey.setVariable("a1", "abc");
  assert.equal(survey.processTextEx({ text: "test: {a1},{a2}" }).text, "test: abc,{a2}", "#1");
  assert.equal(survey.processTextEx({ text: "test: {a1},{a2}", replaceUndefinedValues: true }).text, "test: abc,", "#2");
  assert.equal(survey.processText("test: {a1},{a2}", false), "test: abc,{a2}", "#3");
});
QUnit.test("Empty question value in text processing, Bug#9417", function (assert) {
  const survey = new SurveyModel({
    elements: [
      { type: "text", name: "first-name", title: "Hi {first-name}" },
      { type: "text", name: "last-name", title: "{last-name}" }
    ]
  });
  const q1 = survey.getQuestionByName("first-name");
  const q2 = survey.getQuestionByName("last-name");
  assert.equal(q1.locTitle.renderedHtml, "Hi ", "q1.title #1");
  assert.equal(q2.locTitle.renderedHtml, "", "q2.title #1");
  q1.value = "John";
  q2.value = "Doe";
  assert.equal(q1.locTitle.renderedHtml, "Hi John", "q1.title #2");
  assert.equal(q2.locTitle.renderedHtml, "Doe", "q2.title #3");
  q1.clearValue();
  q2.clearValue();
  assert.equal(q1.locTitle.renderedHtml, "Hi ", "q1.title #3");
  assert.equal(q2.locTitle.renderedHtml, "", "q2.title #3");
});
QUnit.test("Undefined variables in text processing, Bug#9417", function (assert) {
  const survey = new SurveyModel({
    elements: [
      { type: "text", name: "q1", title: "Hi {var1}" },
      { type: "text", name: "q2", title: "{var2}" }
    ]
  });
  const q1 = survey.getQuestionByName("q1");
  const q2 = survey.getQuestionByName("q2");
  assert.equal(q1.locTitle.renderedHtml, "Hi {var1}", "q1.title #1");
  assert.equal(q2.locTitle.renderedHtml, "{var2}", "q2.title #1");
  survey.setVariable("var1", "John");
  survey.setVariable("var2", "Doe");
  assert.equal(q1.locTitle.renderedHtml, "Hi John", "q1.title #2");
  assert.equal(q2.locTitle.renderedHtml, "Doe", "q2.title #3");
  survey.setVariable("var1", "");
  survey.setVariable("var2", "");
  assert.equal(q1.locTitle.renderedHtml, "Hi ", "q1.title #3");
  assert.equal(q2.locTitle.renderedHtml, "", "q2.title #3");
});

QUnit.test("Do not add invisible Panel Dynamic to the data, Bug#1258", function (
  assert
) {
  var json = {
    elements: [
      {
        type: "paneldynamic",
        name: "q1",
        templateElements: [{ type: "text", name: "q2", visible: false }],
        panelCount: 1,
        minPanelCount: 1,
      },
    ],
  };
  var survey = new SurveyModel(json);
  survey.getQuestionByName("q1").visible = false;
  survey.doComplete();
  assert.equal(JSON.stringify(survey.data), "{}", "Panel Dynamic is invisible");
});

QUnit.test("Compete trigger and goNextPageAutomatic option", function (assert) {
  var json = {
    pages: [
      {
        elements: [
          {
            type: "text",
            name: "q1",
          },
          {
            type: "text",
            name: "q2",
            visible: false,
          },
        ],
      },
      {
        elements: [
          {
            type: "text",
            name: "q3",
          },
        ],
      },
    ],
    triggers: [
      {
        type: "complete",
        expression: "{exp1} = true",
      },
    ],
    goNextPageAutomatic: true,
  };
  var survey = new SurveyModel(json);
  var expressionQuestion = new QuestionExpressionModel("exp1");
  expressionQuestion.expression = "iif({q1} = 'a', true, false)";
  survey.pages[0].addElement(expressionQuestion);
  var completedCounter = 0;
  survey.onComplete.add(function () {
    completedCounter++;
  });
  survey.setValue("q2", "b");
  survey.setValue("q1", "a");
  assert.equal(completedCounter, 1, "The survey is completed one time");
});

QUnit.test("Compete trigger with invisible question, Bug #2098", function (
  assert
) {
  var json = {
    pages: [
      {
        elements: [
          {
            type: "text",
            name: "age",
            inputType: "number",
          },
          {
            type: "text",
            name: "status",
            visible: false,
          },
        ],
      },
      {
        elements: [
          {
            type: "text",
            name: "question1",
          },
        ],
      },
      {
        elements: [
          {
            type: "text",
            name: "question2",
          },
        ],
      },
    ],
    triggers: [
      {
        type: "setvalue",
        expression: "{age} > 20",
        setToName: "status",
        setValue: "screenout",
      },
      {
        type: "complete",
        expression: "{status}='screenout'",
      },
    ],
  };
  var survey = new SurveyModel(json);
  survey.getQuestionByName("age").value = 30;
  survey.nextPage();
  assert.equal(survey.state, "completed", "Survey is completed");
});

QUnit.test("Compete trigger with invisible question, #2, Bug #2098", function (
  assert
) {
  var json = {
    pages: [
      {
        elements: [
          {
            type: "text",
            name: "age",
            inputType: "number",
          },
          {
            type: "text",
            name: "status",
            visible: false,
          },
        ],
      },
      {
        elements: [
          {
            type: "text",
            name: "question1",
          },
        ],
      },
      {
        elements: [
          {
            type: "text",
            name: "question2",
          },
        ],
      },
    ],
    triggers: [
      {
        type: "complete",
        expression: "{status}='screenout'",
      },
    ],
  };
  var survey = new SurveyModel(json);
  survey.getQuestionByName("status").value = "screenout";
  survey.nextPage();
  assert.equal(survey.state, "completed", "Survey is completed");
});
QUnit.test("Compete trigger and allowComplete false, Bug #3184", function (
  assert
) {
  var json = {
    pages: [
      {
        elements: [
          {
            type: "text",
            name: "age",
            inputType: "number",
          },
        ],
      },
      {
        elements: [
          {
            type: "text",
            name: "question1",
          },
        ],
      },
      {
        elements: [
          {
            type: "text",
            name: "question2",
          },
        ],
      },
    ],
    triggers: [
      {
        type: "complete",
        expression: "{age}<18",
      },
    ],
  };
  var survey = new SurveyModel(json);
  survey.onCompleting.add((sender, options) => {
    options.allowComplete = false;
  });
  survey.getQuestionByName("age").value = 10;
  assert.equal(survey.currentPageNo, 0);
  survey.nextPage();
  assert.equal(survey.state, "running", "Survey is not completed");
  assert.equal(survey.currentPageNo, 1, "go next page");
});

QUnit.test("textUpdateMode=onTyping and goNextPageAutomatic option", function (
  assert
) {
  var json = {
    pages: [
      {
        elements: [
          {
            type: "text",
            name: "q1",
          },
        ],
      },
      {
        elements: [
          {
            type: "text",
            name: "q2",
          },
        ],
      },
    ],
    textUpdateMode: "onTyping",
    goNextPageAutomatic: true,
  };
  var survey = new SurveyModel(json);
  var question = survey.getQuestionByName("q1");
  question.value = "a";
  assert.equal(survey.currentPageNo, 0, "Stay on the first page");
  question.clearValue();
  question.inputType = "email";
  question.value = "a@a.com";
  assert.equal(survey.currentPageNo, 0, "Stay on the first page");
});
QUnit.test("textUpdateMode=onTyping and visibleIf", function (assert) {
  var json = {
    pages: [
      {
        elements: [
          {
            type: "text",
            name: "q1",
          },
          {
            type: "text",
            name: "q2",
            visibleIf: "{q1} = 'a'",
          },
        ],
      },
      {
        elements: [],
      },
    ],
    textUpdateMode: "onTyping",
  };
  var survey = new SurveyModel(json);
  var q1 = survey.getQuestionByName("q1");
  var q2 = survey.getQuestionByName("q2");
  assert.equal(q2.isVisible, false, "It is invisible by default");
  q1.value = "a";
  assert.equal(q2.isVisible, true, "It is visible now");
});

QUnit.test("Page with numeric name, bug #1293", function (assert) {
  var json = {
    pages: [
      {
        name: "0608",
        questions: [
          {
            type: "text",
            name: "q1",
          },
        ],
      },
      {
        name: "002",
        elements: [
          {
            type: "text",
            name: "q2",
          },
        ],
      },
    ],
  };
  var survey = new SurveyModel(json);
  assert.equal(survey.currentPage.name, "0608", "the current page is correct");
});

QUnit.test("visiblePages and invisible panel, bug #395 (in Editor)", function (
  assert
) {
  var json = {
    pages: [
      {
        name: "page2",
        elements: [
          {
            type: "dropdown",
            name: "question2",
            choices: ["item1", "item2", "item3"],
          },
        ],
      },
      {
        name: "page1",
        elements: [
          {
            type: "panel",
            name: "panel2",
            elements: [
              {
                type: "text",
                name: "question3",
                visibleIf: '{question2} = "item1"',
              },
            ],
          },
        ],
      },
    ],
  };
  var survey = new SurveyModel(json);
  assert.equal(survey.visiblePageCount, 1, "Only one page is visible");
  assert.equal(
    survey.pages[1].isVisible,
    false,
    "The second page is invisible"
  );
  survey.setValue("question2", "item1");
  assert.equal(survey.visiblePageCount, 2, "Two pages are visible");
  survey.setValue("question2", "item2");
  assert.equal(survey.visiblePageCount, 1, "One page is visible again");
});

QUnit.test("Do not process html in design time, bug #396 (in Editor)", function (
  assert
) {
  const json = {
    elements: [
      {
        type: "text",
        name: "question1",
      },
      {
        type: "text",
        name: "question2",
        title: "{question1} test",
      },
    ],
  };
  const survey = new SurveyModel();
  survey.setDesignMode(true);
  survey.fromJSON(json);
  const question = <Question>survey.getQuestionByName("question2");
  assert.equal(
    question.locTitle.renderedHtml,
    "{question1} test",
    "Do not process anything at design time"
  );
});

QUnit.test("survey.showInvisibleElements property", function (assert) {
  var json = {
    pages: [
      {
        elements: [
          {
            type: "text",
            name: "question1",
          },
          {
            type: "text",
            name: "question2",
            visible: false,
          },
        ],
      },
      {
        elements: [
          {
            type: "text",
            name: "question3",
            visibleIf: "{question1} = 'test'",
          },
          {
            type: "checkbox",
            name: "question4",
            choices: ["item1", "item2"],
            visibleIf: "{question1} = 'test'",
            choicesVisibleIf: "{question1} = 'test'",
          },
        ],
      },
    ],
  };
  var survey = new SurveyModel(json);
  assert.equal(survey.visiblePages.length, 1, "There is one visible page");
  assert.equal(
    survey.getQuestionByName("question2").isVisible,
    false,
    "question2 is invisible"
  );
  assert.equal(
    survey.getQuestionByName("question2").getPropertyValue("isVisible"),
    false,
    "question2 is invisible, property value"
  );
  assert.equal(
    survey.getQuestionByName("question4").visibleChoices.length,
    0,
    "There is zero visible choices"
  );
  survey.showInvisibleElements = true;
  assert.equal(survey.visiblePages.length, 2, "There are two visible pages");
  assert.equal(
    survey.getQuestionByName("question2").isVisible,
    true,
    "question2 is visible"
  );
  assert.equal(
    survey.getQuestionByName("question2").getPropertyValue("isVisible"),
    true,
    "question2 is visible, propertyValue"
  );
  assert.equal(
    survey.getQuestionByName("question4").visibleChoices.length,
    2,
    "There are two visible choices"
  );
});

QUnit.test("survey.showInvisibleElements property, Bug#2423", function (assert) {
  var json = {
    elements: [
      {
        type: "checkbox",
        name: "q1",
        choices: ["item1", { value: "item2", visibleIf: "true=false" }],
        choicesVisibleIf: "{question1} = 'test'",
      },
      {
        type: "matrix",
        name: "q2",
        columns: ["item1", { value: "item2", visibleIf: "true=false" }],
        rows: ["item1", { value: "item2", visibleIf: "true=false" }],
        columnsVisibleIf: "{question1} = 'test'",
        rowsVisibleIf: "{question1} = 'test'",
      },
    ],
  };
  var survey = new SurveyModel(json);
  survey.showInvisibleElements = true;
  assert.equal(
    survey.getQuestionByName("q1").visibleChoices.length,
    2,
    "There are two visible choices"
  );
  assert.equal(
    survey.getQuestionByName("q2").visibleColumns.length,
    2,
    "There are two visible columns"
  );
  assert.equal(
    survey.getQuestionByName("q2").visibleRows.length,
    2,
    "There are two visible rows"
  );
});

QUnit.test("survey.showInvisibleElements property & question invisible css style, Bug#9002", function (assert) {
  const survey = new SurveyModel();
  survey.css = { question: { invisible: "sd-element--invisible" } };
  assert.equal(survey.css.question.invisible, "sd-element--invisible", "survey css is updated");
  survey.fromJSON({
    "elements": [
      {
        "type": "text",
        "name": "q2",
        "visibleIf": "{q1} = true"
      },
      {
        "type": "boolean",
        "name": "q1",
        "title": "Show Textbox"
      }
    ]
  });
  survey.showInvisibleElements = true;
  const q1 = survey.getQuestionByName("q1");
  const q2 = survey.getQuestionByName("q2");
  assert.equal(q2.visible, false, "visible is false, #1");
  assert.equal(q2.isVisible, true, "isVisible is true, #1");
  assert.equal(q2.getRootCss().indexOf("sd-element--invisible") > -1, true, "#1");
  q1.value = true;
  assert.equal(q2.visible, true, "visible is false, #2");
  assert.equal(q2.isVisible, true, "isVisible is true, #2");
  assert.equal(q2.getRootCss().indexOf("sd-element--invisible") > -1, false, "#2");
  q1.value = false;
  assert.equal(q2.visible, false, "visible is false, #3");
  assert.equal(q2.isVisible, true, "isVisible is true, #3");
  assert.equal(q2.getRootCss().indexOf("sd-element--invisible") > -1, true, "#3");
  survey.showInvisibleElements = false;
  assert.equal(q2.visible, false, "visible is false, #4");
  assert.equal(q2.isVisible, false, "isVisible is true, #4");
  assert.equal(q2.getRootCss().indexOf("sd-element--invisible") > -1, false, "#4");
});
QUnit.test("survey.showInvisibleElements property & multiple pages", function (assert) {
  const survey = new SurveyModel({
    pages: [
      {
        elements: [
          { type: "radiogroup", name: "q1", choices: ["Yes", "No"] },
          {
            type: "text",
            name: "q2",
            defaultValue: "q2Value",
            visibleIf: "{q1} = 'Yes'",
          },
        ],
      },
      {
        elements: [{ type: "text", name: "q3", visibleIf: "{q1} = 'Yes'" }],
      },
    ],
  });
  assert.equal(survey.navigationBar.getActionById("sv-nav-complete").isVisible, true, "sv-nav-complete, #1");
  assert.equal(survey.navigationBar.getActionById("sv-nav-next").isVisible, false, "sv-nav-next, #1");
  survey.showInvisibleElements = true;
  assert.equal(survey.navigationBar.getActionById("sv-nav-complete").isVisible, false, "sv-nav-complete, #2");
  assert.equal(survey.navigationBar.getActionById("sv-nav-next").isVisible, true, "sv-nav-next, #2");
  survey.showInvisibleElements = false;
  assert.equal(survey.navigationBar.getActionById("sv-nav-complete").isVisible, true, "sv-nav-complete, #3");
  assert.equal(survey.navigationBar.getActionById("sv-nav-next").isVisible, false, "sv-nav-next, #3");
});

QUnit.test(
  "panel.visibleIf doesn't work if it is a single panel on the page, #1329",
  function (assert) {
    var json = {
      pages: [
        {
          name: "page1",
          elements: [
            {
              type: "radiogroup",
              name: "question1",
              choices: ["item1", "item2", "item3"],
            },
          ],
        },
        {
          name: "page2",
          elements: [
            {
              type: "panel",
              name: "panel1",
              elements: [
                {
                  type: "radiogroup",
                  name: "question2",
                  choices: ["item1", "item2", "item3"],
                },
              ],
              visibleIf: "{question1} = 'item1'",
            },
          ],
        },
      ],
    };
    var survey = new SurveyModel(json);
    var counter = 0;
    survey.onPageVisibleChanged.add(function (sender, options) {
      counter++;
    });
    assert.equal(survey.visiblePageCount, 1, "There is one visible page");
    assert.equal(counter, 0, "counter is 0");
    survey.setValue("question1", "item1");
    assert.equal(survey.visiblePageCount, 2, "There are two visible pages");
    assert.equal(counter, 1, "counter is 1");
    survey.setValue("question1", "item2");
    assert.equal(survey.visiblePageCount, 1, "There is one visible page again");
    assert.equal(counter, 2, "counter is 2");
  }
);

QUnit.test("Change renderWidth on width change, Editor Bug #422", function (
  assert
) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("page");
  var panel = page.addNewPanel("p1");
  panel.addNewQuestion("text", "q1");
  var question = page.addNewQuestion("text", "q2");
  question.width = "100px";
  panel.width = "200px";
  assert.equal(
    question.renderWidth,
    "100px",
    "row set question.renderWidth to it's width"
  );
  assert.equal(
    panel.renderWidth,
    "200px",
    "row set panel.renderWidth to it's width"
  );
});
function twoPageSimplestSurvey() {
  var survey = new SurveyModel();
  var page = survey.addNewPage("Page 1");
  page.addNewQuestion("text", "question1");
  page.addNewQuestion("text", "question2");
  page = survey.addNewPage("Page 2");
  page.addNewQuestion("text", "question3");
  page.addNewQuestion("text", "question4");
  return survey;
}
function createPageWithQuestion(
  name: string,
  questionName: string = "q1"
): PageModel {
  var page = new PageModel(name);
  page.addNewQuestion("text", questionName);
  return page;
}

QUnit.test("Survey get full title with values", function (assert) {
  var json = {
    questions: [
      {
        type: "radiogroup",
        name: "q1",
        choices: [
          { value: 1, text: "One" },
          { value: 2, text: "Two" },
        ],
        useDisplayValuesInDynamicTexts: false,
      },
    ],
  };

  var survey = new SurveyModel(json);
  var q1 = <QuestionRadiogroupModel>survey.getQuestionByName("q1");
  q1.value = 1;

  assert.equal(q1.getProcessedText("{q1}"), 1, "Get question value");
});

QUnit.test("Survey get full title with values, bug#5383", function (assert) {
  var json = {
    questions: [
      {
        type: "radiogroup",
        name: "q1",
        choices: [
          { value: 1, text: "One" },
          { value: 2, text: "Two" },
        ],
        useDisplayValuesInDynamicTexts: false,
      },
    ],
  };
  var survey = new SurveyModel(json);
  var q1 = <QuestionRadiogroupModel>survey.getQuestionByName("q1");
  q1.value = 1;

  assert.equal(survey.getProcessedText("{q1}"), 1, "Get question value");
});

QUnit.test(
  "Survey radioGroup remove data on visible items change even if there are other visible questions here, Bug# T1239",
  function (assert) {
    var json = {
      questions: [
        {
          type: "radiogroup",
          name: "group1",
          valueName: "question1",
          choices: [
            {
              value: "answer_possibility_2",
              visibleIf: '{other_question} = "2"', // If this line is removed value is selected
            },
            {
              value: "value_should_be_selected",
              visibleIf: "1=2",
            },
          ],
          visibleIf: '{another_question} = "whatever"',
        },
        {
          type: "radiogroup",
          name: "group2",
          valueName: "question1",
          choices: [
            {
              value: "value_should_be_selected",
            },
          ],
        },
      ],
    };

    var survey = new SurveyModel(json);
    var data = {
      other_question: "2",
      another_question: "blah",
      question1: "value_should_be_selected",
    };
    survey.data = data;
    assert.deepEqual(survey.data, data);
  }
);

QUnit.test(
  "Do not call onValueChanged event onComplete event, Bug# T1239",
  function (assert) {
    var survey = new SurveyModel({
      questions: [
        {
          name: "name",
          type: "text",
          title: "Please enter your name:",
        },
      ],
    });
    var radio = survey.pages[0].addNewQuestion("radiogroup", "test");
    radio.choices = ["Yes", "No"];
    var counter = 0;
    survey.onValueChanged.add(function (sender, options) {
      counter++;
    });
    survey.setValue("name", "name1");
    survey.setValue("test", "Yes");
    assert.deepEqual(counter, 2, "onValueChanged called two times");
    survey.doComplete();
    assert.deepEqual(counter, 2, "onValueChanged called still two times");
  }
);

QUnit.test(
  "Call onValueChanged event onComplete event only one for real field, Bug# T1239",
  function (assert) {
    var survey = new SurveyModel({
      questions: [
        {
          name: "name",
          type: "text",
          title: "Please enter your name:",
        },
      ],
    });
    var radio = survey.pages[0].addNewQuestion("radiogroup", "test");
    radio.choices = ["Yes", "No"];
    radio.value = "Some value";
    radio.visible = false;
    var counter = 0;
    survey.onValueChanged.add(function (sender, options) {
      counter++;
    });
    survey.doComplete();
    assert.equal(counter, 1, "onValueChanged called still two times");
  }
);

QUnit.test("getPlainData", function (assert) {
  var survey = new SurveyModel({
    pages: [
      {
        name: "page1",
        elements: [
          {
            type: "text",
            title: "text",
            name: "question1",
          },
          {
            type: "checkbox",
            title: "checkbox",
            name: "question3",
            choices: ["item1", "item2", "item3"],
          },
          {
            type: "radiogroup",
            title: "radiogroup",
            name: "question4",
            choices: ["item1", "item2", "item3"],
          },
          {
            type: "dropdown",
            title: "dropdown",
            name: "question5",
            choices: ["item1", "item2", "item3"],
          },
          {
            type: "comment",
            title: "comment",
            name: "question6",
          },
          {
            type: "rating",
            title: "rating",
            name: "question7",
          },
          {
            type: "imagepicker",
            title: "imagepicker",
            name: "question8",
            choices: [
              {
                value: "lion",
                imageLink:
                  "https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg",
              },
              {
                value: "giraffe",
                imageLink:
                  "https://surveyjs.io/Content/Images/examples/image-picker/giraffe.jpg",
              },
              {
                value: "panda",
                imageLink:
                  "https://surveyjs.io/Content/Images/examples/image-picker/panda.jpg",
              },
              {
                value: "camel",
                imageLink:
                  "https://surveyjs.io/Content/Images/examples/image-picker/camel.jpg",
              },
            ],
          },
          {
            type: "boolean",
            title: "boolean",
            name: "question9",
          },
          {
            type: "file",
            title: "file",
            name: "question10",
            maxSize: 0,
          },
          {
            type: "matrix",
            title: "matrix",
            name: "question11",
            columns: ["Column 1", "Column 2", "Column 3"],
            rows: ["Row 1", "Row 2"],
          },
          {
            type: "matrixdropdown",
            title: "matrixdropdown",
            name: "question12",
            columns: [
              {
                name: "Column 1",
              },
              {
                name: "Column 2",
                cellType: "radiogroup",
              },
              {
                name: "Column 3",
                cellType: "text",
              },
            ],
            choices: [1, 2, 3, 4, 5],
            rows: ["Row 1", "Row 2"],
          },
          {
            type: "matrixdynamic",
            title: "matrixdynamic",
            name: "question13",
            columns: [
              {
                name: "Column 1",
              },
              {
                name: "Column 2",
                cellType: "boolean",
              },
              {
                name: "Column 3",
                cellType: "radiogroup",
              },
            ],
            choices: [1, 2, 3, 4, 5],
          },
          {
            type: "multipletext",
            title: "multipletext",
            name: "question14",
            items: [
              {
                name: "text1",
              },
              {
                name: "text2",
              },
            ],
          },
          {
            type: "paneldynamic",
            title: "paneldynamic",
            name: "question15",
            templateElements: [
              {
                type: "text",
                name: "question16",
              },
            ],
          },
        ],
      },
      {
        name: "page2",
        elements: [
          {
            type: "radiogroup",
            name: "question2",
            title: "empty radiogroup",
            isRequired: true,
            choices: [
              {
                value: "M",
                text: "Male",
              },
              {
                value: "F",
                text: "Female",
              },
            ],
          },
        ],
      },
    ],
  });
  survey.data = {
    question1: "Answer 1",
    question3: ["item1", "item2"],
    question4: "item3",
    question5: "item2",
    question6: "Answer 5",
    question7: 3,
    question8: "giraffe",
    question9: true,
    question10: [
      {
        name: "favicon.ico",
        type: "image/x-icon",
        content: "data:image/x-icon;base64,A=",
      },
    ],
    question11: { "Row 1": "Column 1", "Row 2": "Column 2" },
    question12: {
      "Row 1": { "Column 1": 1, "Column 2": "2", "Column 3": "Col 3" },
      "Row 2": { "Column 1": 4, "Column 2": "5", "Column 3": "Col 3 - 6" },
    },
    question13: [
      { "Column 1": 1, "Column 3": "2" },
      { "Column 1": 3, "Column 3": "4", "Column 2": false },
    ],
    question14: { text1: "Line 1", text2: "Line 2" },
    question15: [
      { question16: "Panel dynamic content 1" },
      { question16: "Panel dynamic content 2" },
    ],
  };

  var plainData = survey.getPlainData();
  assert.equal(
    plainData.length,
    survey.getAllQuestions().length,
    "all questions are present"
  );
  assert.equal(plainData[0].name, "question1");
  assert.equal(plainData[0].title, "text");
  assert.equal(plainData[0].value, "Answer 1");
  assert.equal(plainData[0].displayValue, "Answer 1");
  assert.notOk(plainData[0].isNode);

  assert.equal(plainData[1].name, "question3");
  assert.equal(plainData[1].title, "checkbox");
  assert.deepEqual(plainData[1].value, ["item1", "item2"]);
  assert.deepEqual(plainData[1].displayValue, "item1, item2");
  assert.ok(plainData[1].isNode);
  assert.equal(plainData[1].data.length, 2);
  assert.equal(plainData[1].data[0].value, "item1");
  assert.equal(plainData[1].data[0].displayValue, "item1");
  assert.equal(plainData[1].data[1].value, "item2");
  assert.equal(plainData[1].data[1].displayValue, "item2");

  assert.equal(plainData[2].name, "question4");
  assert.equal(plainData[2].title, "radiogroup");
  assert.equal(plainData[2].value, "item3");
  assert.ok(plainData[2].isNode);
});

QUnit.test(
  "custom fields in getPlainData - https://surveyjs.answerdesk.io/ticket/details/T1778",
  function (assert) {
    Serializer.addProperty("question", {
      name: "score:number",
    });

    Serializer.addProperty("itemvalue", {
      name: "score:number",
    });

    var q = new QuestionImagePickerModel(null);

    var survey = new SurveyModel({
      questions: [
        {
          type: "rating",
          name: "question11",
          score: 11,
        },
        {
          type: "dropdown",
          name: "question12",
          score: 12,
          choices: [
            {
              value: "item1",
              score: 1,
            },
            {
              value: "item2",
              score: 2,
            },
            {
              value: "item3",
              score: 3,
            },
          ],
        },
        {
          type: "text",
          name: "question13",
          score: 13,
        },
        {
          type: "checkbox",
          name: "question14",
          score: 14,
          choices: [
            {
              value: "item1",
              score: 1,
            },
            {
              value: "item2",
              score: 2,
            },
            {
              value: "item3",
              score: 3,
            },
          ],
        },
        {
          type: "radiogroup",
          name: "question1",
          score: 1,
          choices: [
            {
              value: "item1",
              score: 1,
            },
            {
              value: "item2",
              score: 2,
            },
            {
              value: "item3",
              score: 3,
            },
          ],
        },
        {
          type: "comment",
          name: "question2",
          score: 2,
        },
        {
          type: "imagepicker",
          name: "question3",
          score: 3,
          choices: [
            {
              value: "lion",
              score: 1,
              imageLink:
                "https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg",
            },
            {
              value: "giraffe",
              text: "giraffe22",
              score: 2,
              imageLink:
                "https://surveyjs.io/Content/Images/examples/image-picker/giraffe.jpg",
            },
            {
              value: "panda",
              score: 3,
              imageLink:
                "https://surveyjs.io/Content/Images/examples/image-picker/panda.jpg",
            },
            {
              value: "camel",
              score: 4,
              imageLink:
                "https://surveyjs.io/Content/Images/examples/image-picker/camel.jpg",
            },
          ],
        },
        {
          type: "file",
          name: "question4",
          score: 4,
        },
        {
          type: "multipletext",
          name: "question5",
          score: 5,
          items: [
            {
              name: "text1",
            },
            {
              name: "text2",
            },
          ],
        },
        {
          type: "matrixdropdown",
          name: "question9",
          score: 9,
          columns: [
            {
              name: "Column 1",
            },
            {
              name: "Column 2",
            },
            {
              name: "Column 3",
            },
          ],
          choices: [
            {
              value: 1,
              score: 1,
            },
            {
              value: 2,
              score: 2,
            },
            {
              value: 3,
              score: 3,
            },
            {
              value: 4,
              score: 4,
            },
            {
              value: 5,
              score: 5,
            },
          ],
          rows: ["Row 1", "Row 2"],
        },
        {
          type: "matrix",
          name: "question10",
          score: 10,
          columns: [
            {
              value: "Column 1",
              score: 1,
            },
            {
              value: "Column 2",
              score: 2,
            },
            {
              value: "Column 3",
              score: 3,
            },
          ],
          rows: ["Row 1", "Row 2"],
        },
        {
          type: "panel",
          name: "panel1",
          elements: [
            {
              type: "radiogroup",
              name: "question6",
              score: 6,
              choices: [
                {
                  value: "item1",
                  score: 1,
                },
                {
                  value: "item2",
                  score: 2,
                },
                {
                  value: "item3",
                  score: 3,
                },
              ],
            },
            {
              type: "file",
              name: "question7",
              score: 7,
            },
          ],
        },
        {
          type: "paneldynamic",
          name: "question8",
          score: 8,
          templateElements: [
            {
              type: "text",
              score: 21,
              name: "question21",
            },
          ],
        },
      ],
    });
    survey.data = {
      question11: 3,
      question12: "item2",
      question13: "some text 13",
      question14: ["item2", "item3"],
      question1: "item1",
      question2: "comment2",
      question3: "giraffe",
      question4: [
        {
          name: "favicon.ico",
          type: "image/x-icon",
          content: "data:image/x-icon;base64,A=",
        },
      ],
      question5: { text1: "a", text2: "b" },
      question9: {
        "Row 1": { "Column 1": 1, "Column 2": 2, "Column 3": 3 },
        "Row 2": { "Column 1": 4, "Column 2": 5, "Column 3": 4 },
      },
      question10: { "Row 1": "Column 1", "Row 2": "Column 2" },
      question8: [
        { question21: "Panel dynamic content 1" },
        { question21: "Panel dynamic content 2" },
      ],
    };

    var plainData = survey.getPlainData({
      calculations: [{ propertyName: "score" }],
    });
    assert.equal(plainData.length, 12, "all questions are present");
    assert.deepEqual(plainData[0].value, 3);
    assert.equal(plainData[0].score, 11);
    assert.equal(plainData[0].isNode, false);
    assert.deepEqual(plainData[1].value, "item2");
    assert.equal(plainData[1].score, 12);
    assert.equal(plainData[1].isNode, true);
    assert.equal(plainData[1].data[0].score, 2);
    assert.deepEqual(plainData[2].value, "some text 13");
    assert.equal(plainData[2].score, 13);
    assert.deepEqual(plainData[3].value, ["item2", "item3"]);
    assert.equal(plainData[3].score, 14);
    assert.deepEqual(plainData[4].value, "item1");
    assert.equal(plainData[4].score, 1);
    assert.deepEqual(plainData[5].value, "comment2");
    assert.equal(plainData[5].score, 2);
    assert.deepEqual(plainData[6].value, "giraffe");
    assert.equal(plainData[6].score, 3);
    assert.deepEqual(plainData[7].value, [
      {
        content: "data:image/x-icon;base64,A=",
        name: "favicon.ico",
        type: "image/x-icon",
      },
    ]);
    assert.equal(plainData[7].score, 4);
    assert.deepEqual(plainData[8].value, { text1: "a", text2: "b" });
    assert.equal(plainData[8].score, 5);
    assert.deepEqual(plainData[9].value, {
      "Row 1": { "Column 1": 1, "Column 2": 2, "Column 3": 3 },
      "Row 2": { "Column 1": 4, "Column 2": 5, "Column 3": 4 },
    });
    assert.equal(plainData[9].score, 9);

    assert.deepEqual(plainData[10].value, {
      "Row 1": "Column 1",
      "Row 2": "Column 2",
    });
    assert.equal(plainData[10].score, 10);
    assert.equal(plainData[10].data[0].score, 1);
    assert.equal(plainData[10].data[1].score, 2);

    assert.deepEqual(plainData[11].value, [
      { question21: "Panel dynamic content 1" },
      { question21: "Panel dynamic content 2" },
    ]);
    assert.equal(plainData[11].score, 8);

    assert.ok(plainData[3].isNode);
    assert.equal(plainData[3].data.length, 2);
    assert.equal(plainData[3].data[0].value, "item2");
    assert.equal(plainData[3].data[0].displayValue, "item2");
    assert.equal(plainData[3].data[1].value, "item3");
    assert.equal(plainData[3].data[1].displayValue, "item3");

    Serializer.removeProperty("question", "score");
    Serializer.removeProperty("itemvalue", "score");
  }
);

QUnit.test("question.getPlainData - select base - single", function (assert) {
  Serializer.addProperty("question", {
    name: "score:number",
  });

  Serializer.addProperty("itemvalue", {
    name: "score:number",
  });

  var question = new QuestionImagePickerModel("q1");
  new JsonObject().toObject(
    {
      type: "imagepicker",
      name: "question3",
      score: 3,
      choices: [
        {
          value: "lion",
          score: 1,
          imageLink:
            "https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg",
        },
        {
          value: "giraffe",
          text: "giraffe22",
          score: 2,
          imageLink:
            "https://surveyjs.io/Content/Images/examples/image-picker/giraffe.jpg",
        },
        {
          value: "panda",
          score: 3,
          imageLink:
            "https://surveyjs.io/Content/Images/examples/image-picker/panda.jpg",
        },
        {
          value: "camel",
          score: 4,
          imageLink:
            "https://surveyjs.io/Content/Images/examples/image-picker/camel.jpg",
        },
      ],
    },
    question
  );

  question.value = "giraffe";

  var plainData = question.getPlainData({
    calculations: [{ propertyName: "score" }],
  });
  assert.equal(plainData.score, 3);
  assert.deepEqual(plainData.value, "giraffe");
  assert.equal(plainData.isNode, true);
  assert.equal(plainData.data[0].score, 2);
  assert.deepEqual(plainData.data[0].value, "giraffe");

  Serializer.removeProperty("question", "score");
  Serializer.removeProperty("itemvalue", "score");
});

QUnit.test("question.getPlainData - select base - multiple", function (assert) {
  Serializer.addProperty("question", {
    name: "score:number",
  });

  Serializer.addProperty("itemvalue", {
    name: "score:number",
  });

  var question = new QuestionImagePickerModel("q1");
  new JsonObject().toObject(
    {
      type: "imagepicker",
      name: "question3",
      score: 3,
      multiSelect: true,
      choices: [
        {
          value: "lion",
          score: 1,
          imageLink:
            "https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg",
        },
        {
          value: "giraffe",
          text: "giraffe22",
          score: 2,
          imageLink:
            "https://surveyjs.io/Content/Images/examples/image-picker/giraffe.jpg",
        },
        {
          value: "panda",
          score: 3,
          imageLink:
            "https://surveyjs.io/Content/Images/examples/image-picker/panda.jpg",
        },
        {
          value: "camel",
          score: 4,
          imageLink:
            "https://surveyjs.io/Content/Images/examples/image-picker/camel.jpg",
        },
      ],
    },
    question
  );

  question.value = ["giraffe", "panda"];

  var plainData = question.getPlainData({
    calculations: [{ propertyName: "score" }],
  });
  assert.equal(plainData.score, 3);
  assert.deepEqual(plainData.value, ["giraffe", "panda"]);
  assert.deepEqual(plainData.displayValue, "giraffe22, panda");
  assert.equal(plainData.isNode, true);
  assert.equal(plainData.data[0].score, 2);
  assert.deepEqual(plainData.data[0].value, "giraffe");
  assert.deepEqual(plainData.data[0].displayValue, "giraffe22");
  assert.equal(plainData.data[1].score, 3);
  assert.deepEqual(plainData.data[1].value, "panda");

  Serializer.removeProperty("question", "score");
  Serializer.removeProperty("itemvalue", "score");
});

QUnit.test("question.getPlainData - file", function (assert) {
  Serializer.addProperty("question", {
    name: "score:number",
  });

  var question = new QuestionFileModel("q1");
  question.score = 4;

  question.value = [
    {
      name: "favicon.ico",
      type: "image/x-icon",
      content: "data:image/x-icon;base64,A=",
    },
  ];

  var plainData = question.getPlainData({
    calculations: [{ propertyName: "score" }],
  });
  assert.equal(plainData.score, 4);
  assert.deepEqual(plainData.value, [
    {
      name: "favicon.ico",
      type: "image/x-icon",
      content: "data:image/x-icon;base64,A=",
    },
  ]);
  assert.deepEqual(plainData.displayValue, [
    {
      name: "favicon.ico",
      type: "image/x-icon",
      content: "data:image/x-icon;base64,A=",
    },
  ]);
  assert.equal(plainData.isNode, false);
  assert.deepEqual(plainData.data[0].value, "data:image/x-icon;base64,A=");
  assert.deepEqual(plainData.data[0].displayValue, "favicon.ico");

  Serializer.removeProperty("question", "score");
});

QUnit.test("question.getPlainData - matrix", function (assert) {
  Serializer.addProperty("question", {
    name: "score:number",
  });
  Serializer.addProperty("itemvalue", {
    name: "score:number",
  });

  var question = new QuestionMatrixModel("q1");
  new JsonObject().toObject(
    {
      score: 10,
      columns: [
        {
          value: "Column 1",
          score: 1,
        },
        {
          value: "Column 2",
          score: 2,
        },
        {
          value: "Column 3",
          score: 3,
        },
      ],
      rows: [{ value: "Row 1", text: "Row 1 title" }, "Row 2"],
    },
    question
  );

  question.value = { "Row 1": "Column 1", "Row 2": "Column 2" };

  var plainData = question.getPlainData({
    calculations: [{ propertyName: "score" }],
  });
  assert.equal(plainData.score, 10);
  assert.deepEqual(plainData.value, {
    "Row 1": "Column 1",
    "Row 2": "Column 2",
  });
  assert.deepEqual(plainData.displayValue, {
    "Row 1 title": "Column 1",
    "Row 2": "Column 2",
  });
  assert.equal(plainData.isNode, true);
  assert.deepEqual(plainData.data[0].name, "Row 1");
  assert.deepEqual(plainData.data[0].title, "Row 1 title");
  assert.deepEqual(plainData.data[0].value, "Column 1");
  assert.deepEqual(plainData.data[0].displayValue, "Column 1");
  assert.deepEqual(plainData.data[0].score, 1);
  assert.deepEqual(plainData.data[1].name, "Row 2");
  assert.deepEqual(plainData.data[1].value, "Column 2");
  assert.deepEqual(plainData.data[1].displayValue, "Column 2");
  assert.deepEqual(plainData.data[1].score, 2);

  Serializer.removeProperty("question", "score");
  Serializer.removeProperty("itemvalue", "score");
});

QUnit.test("question.getPlainData - matrixdropdown, fixed bug#3097", function (
  assert
) {
  Serializer.addProperty("question", {
    name: "score:number",
  });
  Serializer.addProperty("itemvalue", {
    name: "score:number",
  });

  var question = new QuestionMatrixDropdownModel("q1");
  new JsonObject().toObject(
    {
      score: 9,
      columns: [
        {
          name: "Column 1",
        },
        {
          name: "Column 2",
        },
        {
          name: "Column 3",
        },
      ],
      choices: [
        {
          value: 1,
          score: 1,
        },
        {
          value: 2,
          score: 2,
        },
        {
          value: 3,
          score: 3,
        },
        {
          value: 4,
          score: 4,
        },
        {
          value: 5,
          score: 5,
        },
      ],
      rows: [{ value: "Row 1", text: "Row 1 Title" }, "Row 2"],
    },
    question
  );

  question.value = {
    "Row 1": { "Column 1": 1, "Column 2": "2", "Column 3": 3 },
    "Row 2": { "Column 1": 4, "Column 2": "5", "Column 3": 4 },
  };

  var plainData = question.getPlainData({
    calculations: [{ propertyName: "score" }],
  });
  assert.equal(plainData.score, 9);
  assert.deepEqual(plainData.value, {
    "Row 1": { "Column 1": 1, "Column 2": "2", "Column 3": 3 },
    "Row 2": { "Column 1": 4, "Column 2": "5", "Column 3": 4 },
  });
  assert.deepEqual(plainData.displayValue, {
    "Row 1 Title": {
      "Column 1": "1",
      "Column 2": "2",
      "Column 3": "3",
    },
    "Row 2": {
      "Column 1": "4",
      "Column 2": "5",
      "Column 3": "4",
    },
  });
  assert.equal(plainData.isNode, true);
  assert.equal(plainData.data.length, 2, "Two rows in matrix");
  assert.deepEqual(plainData.data[0].name, "Row 1");
  assert.deepEqual(plainData.data[0].title, "Row 1 Title");
  assert.deepEqual(plainData.data[0].value, {
    "Column 1": 1,
    "Column 2": 2,
    "Column 3": 3,
  });
  assert.deepEqual(plainData.data[0].displayValue, {
    "Column 1": "1",
    "Column 2": "2",
    "Column 3": "3",
  });
  assert.deepEqual(plainData.data[1].name, "Row 2");
  assert.deepEqual(plainData.data[1].value, {
    "Column 1": 4,
    "Column 2": 5,
    "Column 3": 4,
  });
  assert.deepEqual(plainData.data[1].displayValue, {
    "Column 1": "4",
    "Column 2": "5",
    "Column 3": "4",
  });

  assert.equal(plainData.data[0].isNode, true);
  assert.equal(
    plainData.data[0].data.length,
    3,
    "Three columns (questions) in matrix row"
  );

  assert.equal(plainData.data[0].data[0].name, "Column 1", "column1 name");
  assert.equal(plainData.data[0].data[0].title, "Column 1", "column1 title");
  assert.equal(plainData.data[0].data[0].value, 1);
  assert.equal(plainData.data[0].data[0].displayValue, "1");
  assert.equal(plainData.data[0].data[0].score, undefined);
  assert.equal(plainData.data[0].data[0].isNode, true);

  assert.equal(plainData.data[0].data[0].data[0].score, 1);
  assert.equal(plainData.data[0].data[0].data[0].name, 0);
  assert.equal(plainData.data[0].data[0].data[0].title, "Choice");
  assert.equal(plainData.data[0].data[0].data[0].value, 1);
  assert.equal(plainData.data[0].data[0].data[0].displayValue, "1");

  assert.equal(plainData.data[0].data[1].name, "Column 2", "column2 name");
  assert.equal(plainData.data[0].data[1].title, "Column 2", "column2 title");
  assert.equal(plainData.data[0].data[1].value, 2);
  assert.equal(plainData.data[0].data[1].displayValue, "2");
  assert.equal(plainData.data[0].data[1].score, undefined);
  assert.equal(plainData.data[0].data[1].isNode, true);

  assert.equal(plainData.data[0].data[1].data[0].score, 2);
  assert.equal(plainData.data[0].data[1].data[0].name, 0);
  assert.equal(plainData.data[0].data[1].data[0].title, "Choice");
  assert.equal(plainData.data[0].data[1].data[0].value, 2);
  assert.equal(plainData.data[0].data[1].data[0].displayValue, "2");

  Serializer.removeProperty("question", "score");
  Serializer.removeProperty("itemvalue", "score");
});

QUnit.test("question.getPlainData - panel dynamic", function (assert) {
  Serializer.addProperty("question", {
    name: "score:number",
  });
  Serializer.addProperty("itemvalue", {
    name: "score:number",
  });

  var question = new QuestionPanelDynamicModel("q1");
  new JsonObject().toObject(
    {
      type: "paneldynamic",
      name: "question8",
      score: 8,
      templateElements: [
        {
          type: "text",
          score: 21,
          name: "question21",
        },
      ],
    },
    question
  );

  question.value = [
    { question21: "Panel dynamic content 1" },
    { question21: "Panel dynamic content 2" },
  ];

  var plainData = question.getPlainData({
    calculations: [{ propertyName: "score" }],
  });
  assert.equal(plainData.score, 8);
  assert.deepEqual(plainData.value, [
    { question21: "Panel dynamic content 1" },
    { question21: "Panel dynamic content 2" },
  ]);
  assert.deepEqual(plainData.displayValue, [
    { question21: "Panel dynamic content 1" },
    { question21: "Panel dynamic content 2" },
  ]);
  assert.equal(plainData.isNode, true);
  assert.deepEqual(plainData.data[0].name, 0);
  assert.deepEqual(plainData.data[0].title, "Panel");
  assert.deepEqual(plainData.data[0].value, {
    question21: "Panel dynamic content 1",
  });
  assert.deepEqual(plainData.data[0].displayValue, {
    question21: "Panel dynamic content 1",
  });
  assert.deepEqual(plainData.data[1].name, 1);
  assert.deepEqual(plainData.data[1].value, {
    question21: "Panel dynamic content 2",
  });
  assert.deepEqual(plainData.data[1].displayValue, {
    question21: "Panel dynamic content 2",
  });

  assert.equal(plainData.data[0].isNode, true);

  assert.equal(plainData.data[0].data[0].name, "question21");
  assert.equal(plainData.data[0].data[0].title, "question21");
  assert.equal(plainData.data[0].data[0].value, "Panel dynamic content 1");
  assert.equal(
    plainData.data[0].data[0].displayValue,
    "Panel dynamic content 1"
  );
  assert.equal(plainData.data[0].data[0].score, 21);

  Serializer.removeProperty("question", "score");
  Serializer.removeProperty("itemvalue", "score");
});

QUnit.test(
  "getPlainData - calculate score - https://surveyjs.answerdesk.io/ticket/details/T1778",
  function (assert) {
    Serializer.addProperty("question", {
      name: "score:number",
    });

    Serializer.addProperty("itemvalue", {
      name: "score:number",
    });

    var survey = new SurveyModel({
      questions: [
        {
          type: "rating",
          name: "question11",
          score: 11,
        },
        {
          type: "dropdown",
          name: "question12",
          score: 12,
          choices: [
            {
              value: "item1",
              score: 1,
            },
            {
              value: "item2",
              score: 2,
            },
            {
              value: "item3",
              score: 3,
            },
          ],
        },
        {
          type: "text",
          name: "question13",
          score: 13,
        },
        {
          type: "checkbox",
          name: "question14",
          score: 14,
          choices: [
            {
              value: "item1",
              score: 1,
            },
            {
              value: "item2",
              score: 2,
            },
            {
              value: "item3",
              score: 3,
            },
          ],
        },
        {
          type: "radiogroup",
          name: "question1",
          score: 1,
          choices: [
            {
              value: "item1",
              score: 1,
            },
            {
              value: "item2",
              score: 2,
            },
            {
              value: "item3",
              score: 3,
            },
          ],
        },
        {
          type: "comment",
          name: "question2",
          score: 2,
        },
        {
          type: "imagepicker",
          name: "question3",
          score: 3,
          choices: [
            {
              value: "lion",
              score: 1,
              imageLink:
                "https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg",
            },
            {
              value: "giraffe",
              text: "giraffe22",
              score: 2,
              imageLink:
                "https://surveyjs.io/Content/Images/examples/image-picker/giraffe.jpg",
            },
            {
              value: "panda",
              score: 3,
              imageLink:
                "https://surveyjs.io/Content/Images/examples/image-picker/panda.jpg",
            },
            {
              value: "camel",
              score: 4,
              imageLink:
                "https://surveyjs.io/Content/Images/examples/image-picker/camel.jpg",
            },
          ],
        },
        {
          type: "file",
          name: "question4",
          score: 4,
        },
        {
          type: "multipletext",
          name: "question5",
          score: 5,
          items: [
            {
              name: "text1",
            },
            {
              name: "text2",
            },
          ],
        },
        {
          type: "matrixdropdown",
          name: "question9",
          score: 9,
          columns: [
            {
              name: "Column 1",
            },
            {
              name: "Column 2",
            },
            {
              name: "Column 3",
            },
          ],
          choices: [
            {
              value: 1,
              score: 1,
            },
            {
              value: 2,
              score: 2,
            },
            {
              value: 3,
              score: 3,
            },
            {
              value: 4,
              score: 4,
            },
            {
              value: 5,
              score: 5,
            },
          ],
          rows: ["Row 1", "Row 2"],
        },
        {
          type: "matrix",
          name: "question10",
          score: 10,
          columns: [
            {
              value: "Column 1",
              score: 1,
            },
            {
              value: "Column 2",
              score: 2,
            },
            {
              value: "Column 3",
              score: 3,
            },
          ],
          rows: ["Row 1", "Row 2"],
        },
        {
          type: "panel",
          name: "panel1",
          elements: [
            {
              type: "radiogroup",
              name: "question6",
              score: 6,
              choices: [
                {
                  value: "item1",
                  score: 1,
                },
                {
                  value: "item2",
                  score: 2,
                },
                {
                  value: "item3",
                  score: 3,
                },
              ],
            },
            {
              type: "file",
              name: "question7",
              score: 7,
            },
          ],
        },
        {
          type: "paneldynamic",
          name: "question8",
          score: 8,
          templateElements: [
            {
              type: "text",
              score: 4,
              name: "question21",
            },
          ],
        },
      ],
    });
    survey.data = {
      question11: 3,
      question12: "item2",
      question13: "some text 13",
      question14: ["item2", "item3"],
      question1: "item1",
      question2: "comment2",
      question3: "giraffe",
      question4: [
        {
          name: "favicon.ico",
          type: "image/x-icon",
          content: "data:image/x-icon;base64,A=",
        },
      ],
      question5: { text1: "a", text2: "b" },
      question9: {
        "Row 1": { "Column 1": 1, "Column 2": "2", "Column 3": 3 },
        "Row 2": { "Column 1": 4, "Column 2": "5", "Column 3": 4 },
      },
      question10: { "Row 1": "Column 1", "Row 2": "Column 2" },
      question8: [
        { question21: "Panel dynamic content 1" },
        { question21: "Panel dynamic content 2" },
      ],
    };

    var plainData = survey.getPlainData({
      includeEmpty: false,
      calculations: [{ propertyName: "score" }],
    });

    var calculate = (
      plainData: Array<{
        isNode: boolean,
        score?: number,
        data?: Array<any>,
      }> = []
    ): number => {
      return plainData.reduce((result, current) => {
        var currentScore = current.score;
        if (current.isNode) {
          currentScore = calculate(current.data);
        }
        if (currentScore) {
          return result + currentScore;
        }
        return result;
      }, 0);
    };

    var surveyScore = calculate(plainData);

    assert.equal(
      surveyScore,
      75,
      "overall survey score for answered questions"
    );

    Serializer.removeProperty("question", "score");
    Serializer.removeProperty("itemvalue", "score");
  }
);
QUnit.test("getPlainData - calculate itemvalue.score in rate question, Bug#6804",
  function (assert) {
    Serializer.addProperty("itemvalue", { name: "score:number" });

    var survey = new SurveyModel({
      questions: [
        {
          type: "rating",
          name: "q1",
          rateValues: [{ value: 1, score: 2, text: "Score 2" }, { value: 2, score: 4, text: "Score 4" }]
        },
        {
          type: "dropdown",
          name: "q2",
          choices: [
            {
              value: "item1",
              score: 1,
            },
            {
              value: "item2",
              score: 2,
            },
            {
              value: "item3",
              score: 3,
            },
          ],
        },
        {
          type: "checkbox",
          name: "q3",
          choices: [
            {
              value: "item1",
              score: 1,
            },
            {
              value: "item2",
              score: 2,
            },
            {
              value: "item3",
              score: 3,
            },
          ],
        }
      ]
    });
    survey.data = {
      q1: 2,
      q2: "item2",
      q3: ["item2", "item3"]
    };
    const q1 = survey.getQuestionByName("q1");
    const q1PlainData = q1.getPlainData({ calculations: [{ propertyName: "score" }] });
    assert.equal(q1PlainData.displayValue, "Score 4", "display value is correct");
    assert.equal(q1PlainData.isNode, false, "it is not a node");
    assert.equal((<any>q1PlainData).score, 4, "score is correct");

    const plainData = survey.getPlainData({
      includeEmpty: false,
      calculations: [{ propertyName: "score" }],
    });
    const calculate = (
      plainData: Array<{
        isNode: boolean,
        score?: number,
        data?: Array<any>,
      }> = []
    ): number => {
      return plainData.reduce((result, current) => {
        var currentScore = current.score;
        if (current.isNode) {
          currentScore = calculate(current.data);
        }
        if (currentScore) {
          return result + currentScore;
        }
        return result;
      }, 0);
    };

    const surveyScore = calculate(plainData);
    assert.equal(surveyScore, 11, "overall survey score for answered questions");

    Serializer.removeProperty("itemvalue", "score");
  }
);

QUnit.test(
  "question.getPlainData - select base - multiple select - other",
  function (assert) {
    var question = new QuestionCheckboxModel("q1");
    new JsonObject().toObject(
      {
        type: "checkbox",
        name: "q1",
        hasOther: true,
        choices: [
          {
            value: "lion",
          },
          {
            value: "giraffe",
          },
          {
            value: "panda",
          },
          {
            value: "camel",
          },
        ],
      },
      question
    );

    question.value = ["other", "giraffe"];
    question.comment = "Other value text";

    const plainData = question.getPlainData();
    assert.deepEqual(plainData.value, ["other", "giraffe"]);
    assert.equal(plainData.isNode, true);
    assert.deepEqual(plainData.data.length, 2);
    assert.deepEqual(plainData.data[0].isNode, false);
    assert.deepEqual(plainData.data[0].isOther, true);
    assert.deepEqual(plainData.data[0].value, "other");
    assert.deepEqual(plainData.data[0].title, "Choice");
    assert.deepEqual(plainData.data[0].displayValue, "Other value text");
    assert.deepEqual(plainData.data[1].isNode, false);
    assert.deepEqual(plainData.data[1].value, "giraffe");
    assert.deepEqual(plainData.data[1].title, "Choice");
  }
);

QUnit.test(
  "question.getPlainData - select base - multiple select - comment",
  function (assert) {
    var question = new QuestionCheckboxModel("q1");
    new JsonObject().toObject(
      {
        type: "checkbox",
        name: "q1",
        hasComment: true,
        choices: [
          {
            value: "lion",
          },
          {
            value: "giraffe",
          },
          {
            value: "panda",
          },
          {
            value: "camel",
          },
        ],
      },
      question
    );

    question.value = ["giraffe"];
    question.comment = "Comment text";

    var plainData = question.getPlainData();
    assert.deepEqual(plainData.value, ["giraffe"]);
    assert.equal(plainData.isNode, true);
    assert.deepEqual(plainData.data.length, 2);
    assert.deepEqual(plainData.data[0].isNode, false);
    assert.deepEqual(plainData.data[0].isComment, true);
    assert.deepEqual(plainData.data[0].title, "Comment");
    assert.deepEqual(plainData.data[0].value, "-Comment");
    assert.deepEqual(plainData.data[0].displayValue, "Comment text");
    assert.deepEqual(plainData.data[1].value, "giraffe");
    assert.deepEqual(plainData.data[1].title, "Choice");
  }
);

QUnit.test(
  "question.getPlainData - select base - single select - other",
  function (assert) {
    var question = new QuestionCheckboxModel("q1");
    new JsonObject().toObject(
      {
        type: "radiogroup",
        name: "q1",
        hasOther: true,
        choices: [
          {
            value: "lion",
          },
          {
            value: "giraffe",
          },
          {
            value: "panda",
          },
          {
            value: "camel",
          },
        ],
      },
      question
    );

    question.value = "other";
    question.comment = "Other value text";

    var plainData = question.getPlainData();
    assert.deepEqual(plainData.value, ["other"]);
    assert.equal(plainData.isNode, true);
    assert.deepEqual(plainData.data.length, 1);
    assert.deepEqual(plainData.data[0].isNode, false);
    assert.deepEqual(plainData.data[0].isOther, true);
    assert.deepEqual(plainData.data[0].value, "other");
    assert.deepEqual(plainData.data[0].title, "Choice");
    assert.deepEqual(plainData.data[0].displayValue, "Other value text");
  }
);

QUnit.test(
  "question.getPlainData - select base - single select - comment",
  function (assert) {
    var question = new QuestionCheckboxModel("q1");
    new JsonObject().toObject(
      {
        type: "radiogroup",
        name: "q1",
        hasComment: true,
        choices: [
          {
            value: "lion",
          },
          {
            value: "giraffe",
          },
          {
            value: "panda",
          },
          {
            value: "camel",
          },
        ],
      },
      question
    );

    question.value = "giraffe";
    question.comment = "Comment text";

    var plainData = question.getPlainData();
    assert.deepEqual(plainData.value, ["giraffe"]);
    assert.equal(plainData.isNode, true);
    assert.deepEqual(plainData.data.length, 2);
    assert.deepEqual(plainData.data[0].isNode, false);
    assert.deepEqual(plainData.data[0].isComment, true);
    assert.deepEqual(plainData.data[0].title, "Comment");
    assert.deepEqual(plainData.data[0].value, "-Comment");
    assert.deepEqual(plainData.data[0].displayValue, "Comment text");
    assert.deepEqual(plainData.data[1].value, "giraffe");
    assert.deepEqual(plainData.data[1].title, "Choice");
  }
);

QUnit.test(
  "question.getPlainData - markdown processed titles - T3888 - question#getPlainData() returns markdown-rendered values, but not markdown-rendered titles",
  function (assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("Page 1");
    var question = new QuestionRadiogroupModel("q1");
    new JsonObject().toObject(
      {
        type: "radiogroup",
        name: "q1",
        title: "Title *marked*",
        choices: [
          {
            value: "lion",
            text: "lion *marked*",
          },
          {
            value: "giraffe",
            text: "giraffe *marked*",
          },
        ],
      },
      question
    );
    page.addQuestion(question);
    survey.onTextMarkdown.add(function (survey, options) {
      if (options.text.indexOf("*") > -1)
        options.html = options.text.replace(/\*/g, "<>");
    });

    question.value = "giraffe";

    var plainData = question.getPlainData();
    assert.deepEqual(plainData.value, "giraffe");
    assert.deepEqual(plainData.title, "Title <>marked<>");
    assert.deepEqual(plainData.displayValue, "giraffe <>marked<>");
  }
);

QUnit.test("question.getPlainData - optional question type", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("Page 1");
  var question = new QuestionRadiogroupModel("q1");
  new JsonObject().toObject(
    {
      type: "radiogroup",
      name: "q1",
      choices: [1, 2, 3],
    },
    question
  );
  page.addQuestion(question);
  survey.data = { q1: 2 };

  var plainData = question.getPlainData();
  assert.deepEqual(plainData.name, "q1");
  assert.deepEqual(plainData.questionType, undefined);

  plainData = question.getPlainData({ includeQuestionTypes: true });
  assert.deepEqual(plainData.name, "q1");
  assert.deepEqual(plainData.questionType, "radiogroup");
});

QUnit.test("question.getPlainData - optional survey values", function (assert) {
  var survey = new SurveyModel({
    "pages": [
      {
        "name": "page1",
        "elements": [
          {
            "type": "radiogroup",
            "name": "question1",
            "choices": [1, 2, 3]
          }
        ]
      }
    ]
  });
  survey.data = { question1: 1 };
  survey.setValue("customValue", "test");

  var plainData = survey.getPlainData();
  assert.deepEqual(plainData.length, 1);
  delete plainData[0]["getString"];
  delete plainData[0]["data"];
  assert.deepEqual(plainData[0], {
    "displayValue": "1",
    "isNode": true,
    "name": "question1",
    "title": "question1",
    "value": 1
  }, "Question only");

  plainData = survey.getPlainData({ includeValues: true });
  assert.deepEqual(plainData.length, 2);
  delete plainData[0]["getString"];
  delete plainData[0]["data"];
  delete plainData[1]["getString"];
  delete plainData[1]["data"];
  assert.deepEqual(plainData[0], {
    "displayValue": "1",
    "isNode": true,
    "name": "question1",
    "title": "question1",
    "value": 1
  }, "Question");
  assert.deepEqual(plainData[1], {
    "displayValue": "test",
    "isNode": false,
    "name": "customValue",
    "title": "customValue",
    "value": "test"
  }, "Value");
});

QUnit.test("question.valueName is numeric, Bug# 1432", function (assert) {
  var survey = new SurveyModel({
    questions: [
      {
        name: "name",
        type: "text",
        valueName: 10,
      },
    ],
  });
  var question = survey.getQuestionByValueName("10");
  assert.equal(question.name, "name", "The question has been found");
});

QUnit.test("Show several errors based on validation", function (assert) {
  var survey = new SurveyModel({
    questions: [
      {
        type: "multipletext",
        name: "q1",
        title: "Question 1 - Score",
        isRequired: true,
        requiredErrorText:
          "You must enter a response to the 'Question 1 - Score' question.",
        validators: [
          {
            type: "expression",
            text:
              "You must enter a response to the 'Question 1 - Score' question.",
            expression:
              "{q1.Field1} notempty or ({q1.Field1} empty and {q1.Field1} = 0) or {q1.Field2} notempty or ({q1.Field2} empty and {q1.Field2} = 0)",
          },
          {
            type: "expression",
            text:
              "The response to 'Field 1' must be a number between 0 and 48.",
            expression: "{q1.Field1} <= 48",
          },
          {
            type: "expression",
            text:
              "The response to 'Field 2' must be a number between 0 and 52.",
            expression: "{q1.Field2} <= 52",
          },
          {
            type: "expression",
            text:
              "The response to 'Question 1 - Score' must be an even number between 0 and 100.",
            expression: "({q1.Field1} + {q1.Field2}) <= 100",
          },
          {
            type: "expression",
            expression: "({q1.Field1} + {q1.Field2}) % 2 = 0",
          },
        ],
        items: [
          {
            name: "Field1",
            title: "Field 1",
            validators: [
              {
                type: "regex",
                text:
                  "The response to 'Field 1' must be a number between 0 and 48.",
                regex: "^\\d*\\.?\\d*$",
              },
            ],
          },
          {
            name: "Field2",
            title: "Field 2",
            validators: [
              {
                type: "regex",
                text:
                  "The response to 'Field 2' must be a number between 0 and 52.",
                regex: "^\\d*\\.?\\d*$",
              },
            ],
          },
        ],
      },
    ],
  });
  var question = <Question>survey.getQuestionByValueName("q1");
  question.value = { Field1: 51, Field2: 60 };
  question.hasErrors(true);
  assert.equal(question.errors.length, 4, "There are 4 errors should be shown");
});

QUnit.test("getCustomErrorText for error", function (assert) {
  var survey = new SurveyModel({
    questions: [
      {
        name: "name",
        type: "text",
        title: "Question Name",
        isRequired: true,
      },
    ],
  });
  survey.onErrorCustomText.add(function (sender, options) {
    if (options.name == "required") {
      options.text = "!!!" + options.obj.title;
    }
  });
  var question = survey.currentPage.questions[0];
  survey.pages[0].hasErrors(true);
  assert.equal(
    question.errors[0].getText(),
    "!!!Question Name",
    "survey.onErrorCustomText works"
  );
});
QUnit.test(
  "Value changing/changed call count for empty values, #1564",
  function (assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("p");
    page.addNewQuestion("text", "q1");
    let valueChangedCount = 0;
    let valueChangingCount = 0;
    survey.onValueChanging.add(function (sender, options) {
      valueChangingCount++;
    });
    survey.onValueChanged.add(function (sender, options) {
      valueChangedCount++;
    });
    survey.setValue("q1", null);
    assert.equal(
      valueChangingCount,
      1,
      "value changing call count should be 1"
    );
    assert.equal(valueChangedCount, 0, "value changed call count should be 0");
    survey.setValue("q1", "");
    assert.equal(
      valueChangingCount,
      2,
      "value changing call count should be 2"
    );
    assert.equal(valueChangedCount, 0, "value changed call count should be 0");
  }
);

QUnit.test("Values from invisible rows should be removed, #1644", function (
  assert
) {
  var json = {
    elements: [
      { type: "text", name: "q1" },
      {
        type: "matrix",
        name: "q2",
        columns: ["col1", "col2"],
        rows: [{ value: "row1", visibleIf: "{q1} = 1" }, "row2"],
      },
    ],
  };
  var survey = new SurveyModel(json);
  survey.data = { q1: 2, q2: { row1: "col1", row2: "col2" } };
  survey.doComplete();
  assert.deepEqual(
    survey.data,
    { q1: 2, q2: { row2: "col2" } },
    "Remove value for invisible row"
  );
});

QUnit.test("Values from invisible choices should be removed, #1644", function (
  assert
) {
  var json = {
    elements: [
      { type: "text", name: "q1" },
      {
        type: "radiogroup",
        name: "q2",
        choices: [{ value: "val1", visibleIf: "{q1} = 1" }, "val2"],
      },
      {
        type: "checkbox",
        name: "q3",
        choices: [{ value: "val1", visibleIf: "{q1} = 1" }, "val2"],
      },
    ],
  };
  var survey = new SurveyModel(json);
  survey.data = { q1: 2, q2: "val1", q3: ["val1", "val2"] };
  survey.doComplete();
  assert.deepEqual(
    survey.data,
    { q1: 2, q3: ["val2"] },
    "Remove values for invisible choices"
  );
});

QUnit.test(
  "True/False strings do not work, Bug #https://surveyjs.answerdesk.io/ticket/details/T2425",
  function (assert) {
    var json = {
      questions: [
        {
          name: "bool",
          type: "dropdown",
          isRequired: true,
          choices: ["True", "False"],
        },
        {
          name: "html1",
          type: "html",
          html: "True",
          visibleIf: "{bool}='True'",
        },
        {
          name: "html2",
          type: "html",
          html: "False",
          visibleIf: "{bool}='False'",
        },
      ],
    };
    var survey = new SurveyModel(json);
    var boolQ = survey.getQuestionByName("bool");
    var html1Q = survey.getQuestionByName("html1");
    var html2Q = survey.getQuestionByName("html2");
    assert.equal(html1Q.isVisible, false, "html1 is not visible by default");
    assert.equal(html2Q.isVisible, false, "html2 is not visible by default");
    boolQ.value = "True";
    assert.equal(html1Q.isVisible, true, "True, html1 is visible");
    assert.equal(html2Q.isVisible, false, "True, html2 is invisible");
    boolQ.value = "False";
    assert.equal(boolQ.value, "False", "Value set correctly");
    assert.equal(
      survey.getValue("bool"),
      "False",
      "Value set correctly in survey"
    );
    assert.equal(html1Q.isVisible, false, "False, html1 is invisible");
    assert.equal(html2Q.isVisible, true, "False, html2 is visible");
  }
);

QUnit.test("Test onValidatedErrorsOnCurrentPage event", function (assert) {
  var json = {
    pages: [
      {
        elements: [
          { type: "text", name: "q1", isRequired: true },
          { type: "text", name: "q2", isRequired: true },
        ],
      },
      {
        elements: [
          {
            type: "text",
            name: "q3",
            isRequired: true,
            validators: [{ type: "email" }],
          },
          { type: "text", name: "q4", isRequired: true },
        ],
      },
    ],
  };
  var survey = new SurveyModel(json);
  var counter = 0;
  var errors: any = null;
  var questions: any = null;
  survey.onValidatedErrorsOnCurrentPage.add(function (sender, options) {
    counter++;
    errors = options.errors;
    questions = options.questions;
  });
  assert.equal(counter, 0, "Nothing yet heppend");
  survey.nextPage();
  assert.equal(counter, 1, "called one time");
  assert.equal(errors.length, 2, "there are two errors");
  assert.equal(questions.length, 2, "there are two questions have errors");

  survey.setValue("q1", "val1");
  survey.nextPage();
  assert.equal(counter, 2, "called 2 times");
  assert.equal(errors.length, 1, "there is one error, #1");
  assert.equal(questions.length, 1, "there is one error, #2");

  survey.setValue("q2", "val2");
  survey.nextPage();
  assert.equal(counter, 3, "called three times");
  assert.equal(errors.length, 0, "there is no errors");
  assert.equal(questions.length, 0, "there is no errors");

  survey.checkErrorsMode = "onValueChanged";

  survey.setValue("q3", "val3");
  assert.equal(counter, 4, "called four times");
  assert.equal(errors.length, 1, "there is one error, #3");
  assert.equal(questions.length, 1, "there is one error, #4");

  survey.setValue("q3", "a@b.com");
  assert.equal(counter, 5, "called five times");
  assert.equal(errors.length, 0, "there is no errors");
  assert.equal(questions.length, 0, "there is no errors");

  survey.setValue("q3", "a@c.com");
  assert.equal(counter, 5, "called five times - it doesn't called this time");
  assert.equal(errors.length, 0, "there is no errors");
  assert.equal(questions.length, 0, "there is no errors");

  survey.clearValue("q3");
  assert.equal(counter, 5, "Do not call errors validation on clearing value");
  assert.equal(errors.length, 0, "there is no errors on clearing value");
  survey.tryComplete();
  assert.equal(counter, 6, "called six times");
  assert.equal(errors.length, 2, "there are two errors onComplete, #5");
  assert.equal(questions.length, 2, "there are two question onComplete, #6");
});
QUnit.test("Server validation - do no fire onValidatedErrorsOnCurrentPage  on changing question value, Bug#5194",
  function (assert) {
    const survey = new SurveyModel({ "elements": [{ name: "name", type: "text", isRequired: true }] });
    let counter = 0;
    assert.equal(survey.onValidatePage.length, 0, "onValidate page is emtpy");
    survey.onValidatedErrorsOnCurrentPage.add(function (sender, options) {
      counter++;
    });
    assert.equal(survey.onValidatePage.length, 1, "onValidate page is set");
    survey.tryComplete();
    assert.equal(survey.state, "running");
    assert.equal(counter, 1, "On complete");
    survey.setValue("name", "Jon");
    assert.equal(counter, 1, "We do not make complete");
    survey.tryComplete();
    assert.equal(counter, 2, "Do complete again");
  }
);

QUnit.test("survey.completedHtmlOnCondition", function (assert) {
  var survey = new SurveyModel();
  survey.completedHtml = "1";
  assert.equal(survey.renderedCompletedHtml, "1", "get from completed html");
  survey.completedHtmlOnCondition.push(new HtmlConditionItem("{q1} = 2", "2"));
  survey.completedHtmlOnCondition.push(new HtmlConditionItem("{q1} = 3", "3"));
  assert.ok(survey.completedHtmlOnCondition[0].getSurvey(), "There is survey in completedHtmlOnCondition");
  assert.equal(
    survey.renderedCompletedHtml,
    "1",
    "still get from completed html"
  );
  survey.setValue("q1", 2);
  assert.equal(
    survey.renderedCompletedHtml,
    "2",
    "get from first on Condition"
  );
  survey.setValue("q1", 3);
  assert.equal(
    survey.renderedCompletedHtml,
    "3",
    "get from second on Condition"
  );
  survey.setValue("q1", 5);
  assert.equal(
    survey.renderedCompletedHtml,
    "1",
    "get from completed html again"
  );
});

QUnit.test("survey.completedHtmlOnCondition + localization", function (assert) {
  var json = {
    completedHtml: "1",
    completedHtmlOnCondition: [
      {
        expression: "{q1} = 2",
        html: {
          default: "en-condition",
          fr: "fr-condition",
        },
      },
    ],
  };
  var survey = new SurveyModel(json);
  assert.equal(
    survey.completedHtmlOnCondition.length,
    1,
    "OnCondition restored correctly"
  );
  survey.setValue("q1", 2);
  assert.equal(
    survey.renderedCompletedHtml,
    "en-condition",
    "get on condition en"
  );
  var prevLocale = survey.locale;
  survey.locale = "fr";
  assert.equal(
    survey.renderedCompletedHtml,
    "fr-condition",
    "get on condition fr"
  );
  survey.locale = prevLocale;
});

QUnit.test("survey.navigateToUrlOnCondition", function (assert) {
  var survey = new SurveyModel();
  survey.navigateToUrl = "1";
  assert.equal(survey.getNavigateToUrl(), "1", "get from navigateToUrl");
  survey.navigateToUrlOnCondition.push(new UrlConditionItem("{q1} = 2", "2"));
  survey.navigateToUrlOnCondition.push(new UrlConditionItem("{q1} = 3", "3"));
  assert.equal(survey.getNavigateToUrl(), "1", "still get from navigateToUrl");
  survey.setValue("q1", 2);
  assert.equal(survey.getNavigateToUrl(), "2", "get from first on Condition");
  survey.setValue("q1", 3);
  assert.equal(survey.getNavigateToUrl(), "3", "get from second on Condition");
  survey.setValue("q1", 5);
  assert.equal(survey.getNavigateToUrl(), "1", "get from navigateToUrl again");
});

QUnit.test("survey.navigateToUrlOnCondition + processValue", function (assert) {
  var survey = new SurveyModel({
    elements: [
      { type: "text", name: "q1" },
      { type: "text", name: "q2" },
    ],
  });
  survey.navigateToUrl = "url-{q1}-url";
  survey.navigateToUrlOnCondition.push(
    new UrlConditionItem("{q1} = 2", "url-{q2}-url")
  );
  assert.equal(survey.getNavigateToUrl(), "url--url", "data is empty");
  survey.data = { q1: "value1", q2: "value2" };
  assert.equal(
    survey.getNavigateToUrl(),
    "url-value1-url",
    "use value in navigateToUrl prop"
  );
  survey.setValue("q1", 2);
  assert.equal(
    survey.getNavigateToUrl(),
    "url-value2-url",
    "use value in condition url prop"
  );
});
QUnit.test("survey.navigateToUrlOnCondition + processValue + displayvalue", function (assert) {
  var survey = new SurveyModel({
    elements: [
      { type: "dropdown", name: "q1", choices: [{ value: 1, text: "item 1" }, { value: 2, text: "item 2" }] },
      { type: "text", name: "q2" }
    ],
  });
  survey.navigateToUrl = "url-{q1}-url";
  survey.navigateToUrlOnCondition.push(
    new UrlConditionItem("{q2} = 1", "url-{q1}-url")
  );
  assert.equal(survey.getNavigateToUrl(), "url--url", "data is empty");
  survey.data = { q1: 1, q2: 1 };
  assert.equal(
    survey.getNavigateToUrl(),
    "url-1-url",
    "use value in navigateToUrl prop, #1"
  );
  survey.setValue("q1", 2);
  assert.equal(
    survey.getNavigateToUrl(),
    "url-2-url",
    "use value in condition url prop, #2"
  );
});
QUnit.test("survey.navigateToUrlOnCondition + localization", function (assert) {
  var json = {
    navigateToUrl: "1",
    navigateToUrlOnCondition: [
      {
        expression: "{q1} = 2",
        url: {
          default: "en-condition",
          fr: "fr-condition",
        },
      },
    ],
  };
  var survey = new SurveyModel(json);
  assert.equal(
    survey.navigateToUrlOnCondition.length,
    1,
    "OnCondition restored correctly"
  );
  survey.setValue("q1", 2);
  assert.equal(
    survey.getNavigateToUrl(),
    "en-condition",
    "get on condition en"
  );
  var prevLocale = survey.locale;
  survey.locale = "fr";
  assert.equal(
    survey.getNavigateToUrl(),
    "fr-condition",
    "get on condition fr"
  );
  survey.locale = prevLocale;
});

QUnit.test("survey.navigateTo - calling logic", function (assert) {
  var survey = new SurveyModel({
    elements: [
      { type: "text", name: "q1" },
      { type: "text", name: "q2" },
    ],
  });
  var counter = 0;
  survey.onNavigateToUrl.add(function (sender, options) {
    counter++;
  });
  survey.doComplete();
  assert.equal(counter, 1, "onNavigate has been called one time");
  survey.clear();
  var completeOptions = null;
  survey.onComplete.add(function (sender, options) {
    options.showDataSaving();
    completeOptions = options;
  });
  survey.doComplete();
  assert.equal(
    counter,
    1,
    "onNavigate has been called one time only - wait for showDataSavingSuccess"
  );
  completeOptions.showDataSavingSuccess();
  assert.equal(counter, 2, "onNavigate has been called two times");
});

QUnit.test("page.clearErrors function", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("p");
  var question = page.addNewQuestion("text", "q1");
  question.isRequired = true;
  var dPanel = <QuestionPanelDynamicModel>(
    page.addNewQuestion("paneldynamic", "q2")
  );
  dPanel.template.addNewQuestion("text", "q2_q1").isRequired = true;
  dPanel.panelCount = 2;
  var dMatrix = <QuestionMatrixDynamicModel>(
    page.addNewQuestion("matrixdynamic", "q3")
  );
  dMatrix.columns = [];
  var col = dMatrix.addColumn("col1");
  col.isRequired = true;
  dMatrix.rowCount = 2;
  var rows = dMatrix.visibleRows;
  assert.equal(
    rows[0].cells[0].question.isRequired,
    true,
    "The matrix cell question is required."
  );
  page.hasErrors();
  assert.equal(
    question.errors.length,
    1,
    "There is one error in text question"
  );
  assert.equal(
    dPanel.panels[0].questions[0].errors.length,
    1,
    "There is one error in question in dynamic panel"
  );
  assert.equal(
    rows[0].cells[0].question.errors.length,
    1,
    "There is one error in question cell"
  );
  page.clearErrors();
  assert.equal(question.errors.length, 0, "Error is cleared in text question");
  assert.equal(
    dPanel.panels[0].questions[0].errors.length,
    0,
    "Error is cleared in question in dynamic panel"
  );
  assert.equal(
    rows[0].cells[0].question.errors.length,
    0,
    "Error is cleared in question cell"
  );
});
QUnit.test(
  "multipletext - question is empty for empty string, bug# https://surveyjs.answerdesk.io/ticket/details/T2000",
  function (assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("p");
    var question = <QuestionMultipleTextModel>(
      page.addNewQuestion("multipletext", "q1")
    );
    question.addItem("text1");
    question.addItem("text2");
    question.value = { text1: "val1" };
    assert.deepEqual(
      survey.data,
      { q1: { text1: "val1" } },
      "The data is here"
    );
    question.items[0].value = "";
    assert.deepEqual(survey.data, {}, "survey is empty");
    assert.equal(question.isEmpty(), true, "question is empty");
  }
);

QUnit.test(
  "valueName for matrix dynamic and panel dynamic with different question set, bug# https://surveyjs.answerdesk.io/ticket/details/T2059",
  function (assert) {
    var json = {
      elements: [
        {
          name: "matrix1",
          valueName: "shared",
          type: "matrixdynamic",
          columns: [
            {
              name: "elementId",
              cellType: "expression",
              expression: "{rowIndex}",
            },
            {
              name: "col1",
              cellType: "text",
            },
          ],
          rowCount: 1,
        },
        {
          name: "matrix2",
          valueName: "shared",
          type: "matrixdynamic",
          columns: [
            {
              name: "col2",
              cellType: "text",
            },
          ],
          rowCount: 1,
        },
        {
          name: "panel1",
          valueName: "shared",
          type: "paneldynamic",
          templateElements: [
            {
              name: "ed1",
              type: "text",
            },
            {
              name: "ed2",
              type: "text",
            },
          ],
        },
      ],
    };
    var survey = new SurveyModel(json);
    var matrix1 = <QuestionMatrixDynamicModel>(
      survey.getQuestionByName("matrix1")
    );
    var matrix2 = <QuestionMatrixDynamicModel>(
      survey.getQuestionByName("matrix2")
    );
    var panel1 = <QuestionPanelDynamicModel>survey.getQuestionByName("panel1");
    var rows1 = matrix1.visibleRows;
    var rows2 = matrix2.visibleRows;
    var panels1 = panel1.panels;
    assert.deepEqual(
      survey.data,
      { shared: [{ elementId: 1 }] },
      "The initial value"
    );
    rows1[0].cells[1].value = "col1_Value";
    assert.deepEqual(
      survey.data,
      { shared: [{ elementId: 1, col1: "col1_Value" }] },
      "set matrix1 col1"
    );
    rows2[0].cells[0].value = "col2_Value";
    assert.deepEqual(
      survey.data,
      { shared: [{ elementId: 1, col1: "col1_Value", col2: "col2_Value" }] },
      "set matrix2 col2"
    );
    panels1[0].getQuestionByName("ed1").value = "ed1_Value";
    assert.deepEqual(
      survey.data,
      {
        shared: [
          {
            elementId: 1,
            col1: "col1_Value",
            col2: "col2_Value",
            ed1: "ed1_Value",
          },
        ],
      },
      "set panel1 ed1"
    );
    rows2[0].cells[0].value = "col2_Value2";
    assert.deepEqual(
      survey.data,
      {
        shared: [
          {
            elementId: 1,
            col1: "col1_Value",
            col2: "col2_Value2",
            ed1: "ed1_Value",
          },
        ],
      },
      "replace matrix2 col2"
    );
    survey.clearIncorrectValues();
    assert.deepEqual(
      survey.data,
      {
        shared: [
          {
            elementId: 1,
            col1: "col1_Value",
            col2: "col2_Value2",
            ed1: "ed1_Value",
          },
        ],
      },
      "keep all data since they are all correct"
    );
  }
);
QUnit.test(
  "valueName for matrix dynamic and panel dynamic with different question and display text processing, bug# https://surveyjs.answerdesk.io/ticket/details/T2053",
  function (assert) {
    var json = {
      elements: [
        {
          name: "matrix1",
          valueName: "shared",
          type: "matrixdynamic",
          columns: [
            {
              name: "elementId",
              cellType: "expression",
              expression: "{rowIndex}",
            },
            {
              name: "col1",
              cellType: "dropdown",
              choices: [
                { value: 1, text: "Item 1" },
                { value: 2, text: "Item 2" },
              ],
            },
          ],
          rowCount: 1,
        },
        {
          name: "panel1",
          valueName: "shared",
          type: "paneldynamic",
          templateTitle: "{panel.col1}",
          templateElements: [
            {
              name: "ed1",
              type: "dropdown",
              choices: [
                { value: 1, text: "Item 10" },
                { value: 2, text: "Item 20" },
              ],
            },
          ],
        },
      ],
    };
    var survey = new SurveyModel(json);
    var matrix1 = <QuestionMatrixDynamicModel>(
      survey.getQuestionByName("matrix1")
    );
    var panel1 = <QuestionPanelDynamicModel>survey.getQuestionByName("panel1");
    var rows1 = matrix1.visibleRows;
    rows1[0].cells[1].value = 1;
    assert.deepEqual(
      survey.data,
      { shared: [{ elementId: 1, col1: 1 }] },
      "set matrix1 col1"
    );
    panel1.panels[0].getQuestionByName("ed1").value = 1;
    assert.deepEqual(matrix1.getDisplayValue(false), [
      { elementId: "1", col1: "Item 1", ed1: "Item 10" },
    ]);
    assert.deepEqual(panel1.getDisplayValue(false), [
      { elementId: "1", col1: "Item 1", ed1: "Item 10" },
    ]);
    assert.equal(
      panel1.panels[0].locTitle.renderedHtml,
      "Item 1",
      "Get the display text"
    );
  }
);

QUnit.test("Test element.moveTo function", function (assert) {
  var json = {
    pages: [
      {
        name: "page1",
        elements: [
          {
            name: "q1",
            type: "text",
          },
          {
            name: "p1",
            type: "panel",
            elements: [
              {
                name: "p2",
                type: "panel",
                elements: [{ name: "q2", type: "text" }],
              },
              {
                name: "q3",
                type: "text",
              },
            ],
          },
          {
            name: "q4",
            type: "text",
          },
        ],
      },
      {
        name: "page2",
        elements: [
          {
            name: "q5",
            type: "text",
          },
          {
            name: "p3",
            type: "panel",
            elements: [{ name: "q6", type: "text" }],
          },
          {
            name: "q7",
            type: "text",
          },
        ],
      },
    ],
  };
  var survey = new SurveyModel(json);
  var page2 = survey.pages[1];
  var panel2 = <PanelModel>survey.getPanelByName("p2");
  var q1 = <Question>survey.getQuestionByName("q1");
  assert.equal(q1.parent.name, "page1", "q1.parent = page1");
  q1.moveTo(page2);
  assert.equal(q1.parent.name, "page2", "q1.parent = page1");
  assert.equal(page2.indexOf(q1), 3, "The last element on the page");
  q1.moveTo(page2, survey.getQuestionByName("q5"));
  assert.equal(page2.indexOf(q1), 0, "The first element on the page");
  q1.moveTo(page2, -1);
  assert.equal(page2.indexOf(q1), 3, "The last element on the page again");
  q1.moveTo(page2, 1);
  assert.equal(page2.indexOf(q1), 1, "The second element on the page");
  q1.moveTo(panel2, survey.getQuestionByName("q2"));
  assert.equal(q1.parent.name, "p2", "q1.parent = p1");
  assert.equal(panel2.indexOf(q1), 0, "The first element on panel: p2");
  panel2.moveTo(page2, survey.getPanelByName("p3"));
  assert.equal(panel2.parent.name, "page2", "q1.parent = p1");
  assert.equal(page2.indexOf(panel2), 1, "The second element on page2");
});

QUnit.test("Test question/panel/page delete function", function (assert) {
  var survey = new SurveyModel({
    pages: [
      {
        elements: [
          {
            type: "panel",
            name: "panel1",
            elements: [
              { type: "text", name: "q1" },
              { type: "text", name: "q2" },
            ],
          },
          { type: "text", name: "q3" },
        ],
      },
      {
        elements: [
          { type: "text", name: "q4" },
          { type: "text", name: "q5" },
        ],
      },
    ],
  });
  var panel = <PanelModel>survey.getPanelByName("panel1");
  assert.equal(
    panel.elements.length,
    2,
    "two questions in panel in the beginning"
  );
  panel.questions[0].delete();
  assert.equal(panel.elements.length, 1, "one question in panel now");
  assert.equal(
    survey.pages[0].elements.length,
    2,
    "There are two elements in page1"
  );
  panel.delete();
  assert.equal(
    survey.pages[0].elements.length,
    1,
    "There is one element in page1"
  );
  assert.equal(
    survey.pages[1].elements.length,
    2,
    "There are two elements in page2"
  );
  survey.pages[1].questions[0].delete();
  assert.equal(
    survey.pages[1].elements.length,
    1,
    "There is one element in page2"
  );
  assert.equal(survey.pages.length, 2, "There are two pages in survey");
  survey.pages[0].delete();
  assert.equal(survey.pages.length, 1, "There is one page in survey");
});

QUnit.test("Expression validators with async functions", function (assert) {
  var returnResult1: (res: any) => void;
  var returnResult2: (res: any) => void;
  function asyncFunc1(params: any): any {
    returnResult1 = this.returnResult;
    return false;
  }
  function asyncFunc2(params: any): any {
    returnResult2 = this.returnResult;
    return false;
  }
  FunctionFactory.Instance.register("asyncFunc1", asyncFunc1, true);
  FunctionFactory.Instance.register("asyncFunc2", asyncFunc2, true);
  var survey = twoPageSimplestSurvey();
  var q1 = survey.getQuestionByName("question1");
  var q2 = survey.getQuestionByName("question2");
  var validator1 = new ExpressionValidator();
  validator1.expression = "asyncFunc1() = 1";
  var validator2 = new ExpressionValidator();
  validator2.expression = "asyncFunc2() = 2";
  q1.validators.push(validator1);
  q2.validators.push(validator2);

  survey.nextPage();
  assert.equal(survey.currentPageNo, 0, "First page, 1");
  returnResult1(0);
  returnResult2(0);
  assert.equal(survey.currentPageNo, 0, "First page, 2");
  survey.nextPage();
  assert.equal(survey.currentPageNo, 0, "First page, 3");
  returnResult1(1);
  assert.equal(survey.currentPageNo, 0, "First page, 4");
  returnResult2(2);
  assert.equal(
    survey.currentPageNo,
    1,
    "Second page, async validation is over"
  );

  FunctionFactory.Instance.unregister("asyncFunc1");
  FunctionFactory.Instance.unregister("asyncFunc2");
});

QUnit.test("hasCurrentPageErrors with async", function (assert) {
  var returnResult1: (res: any) => void;
  var returnResult2: (res: any) => void;
  function asyncFunc1(params: any): any {
    returnResult1 = this.returnResult;
    return false;
  }
  function asyncFunc2(params: any): any {
    returnResult2 = this.returnResult;
    return false;
  }
  FunctionFactory.Instance.register("asyncFunc1", asyncFunc1, true);
  FunctionFactory.Instance.register("asyncFunc2", asyncFunc2, true);
  var survey = twoPageSimplestSurvey();
  var q1 = survey.getQuestionByName("question1");
  var q2 = survey.getQuestionByName("question2");
  var validator1 = new ExpressionValidator();
  validator1.expression = "asyncFunc1() = 1";
  var validator2 = new ExpressionValidator();
  validator2.expression = "asyncFunc2() = 2";
  q1.validators.push(validator1);
  q2.validators.push(validator2);

  var asyncHasErrors = undefined;
  var func = (hasErrors: boolean) => {
    asyncHasErrors = hasErrors;
  };
  assert.equal(
    survey.hasCurrentPageErrors(func),
    undefined,
    "We don't know, we return undefined"
  );
  assert.equal(asyncHasErrors, undefined, "It is not executed yet");
  returnResult1(0);
  assert.equal(asyncHasErrors, true, "Has errors");
  asyncHasErrors = undefined;
  survey.hasCurrentPageErrors(func);
  assert.equal(asyncHasErrors, undefined, "It is not executed yet, #2");
  returnResult1(1);
  assert.equal(asyncHasErrors, undefined, "Not all executed, #2");
  returnResult2(2);
  assert.equal(asyncHasErrors, false, "Has no errors");

  FunctionFactory.Instance.unregister("asyncFunc1");
  FunctionFactory.Instance.unregister("asyncFunc2");
});
QUnit.test("hasErrors with async", function (assert) {
  var returnResult1: (res: any) => void;
  var returnResult2: (res: any) => void;
  function asyncFunc1(params: any): any {
    returnResult1 = this.returnResult;
    return false;
  }
  function asyncFunc2(params: any): any {
    returnResult2 = this.returnResult;
    return false;
  }
  FunctionFactory.Instance.register("asyncFunc1", asyncFunc1, true);
  FunctionFactory.Instance.register("asyncFunc2", asyncFunc2, true);
  var survey = twoPageSimplestSurvey();
  var q1 = survey.getQuestionByName("question1");
  var q3 = survey.getQuestionByName("question3");
  var validator1 = new ExpressionValidator();
  validator1.expression = "asyncFunc1() = 1";
  var validator2 = new ExpressionValidator();
  validator2.expression = "asyncFunc2() = 2";
  q1.validators.push(validator1);
  q3.validators.push(validator2);

  var asyncHasErrors = undefined;
  var func = (hasErrors: boolean) => {
    asyncHasErrors = hasErrors;
  };
  assert.equal(
    survey.hasErrors(false, false, func),
    undefined,
    "We don't know, we return undefined"
  );
  assert.equal(asyncHasErrors, undefined, "It is not executed yet");
  returnResult1(0);
  assert.equal(asyncHasErrors, true, "Has errors");
  asyncHasErrors = undefined;
  survey.hasErrors(false, false, func);
  assert.equal(asyncHasErrors, undefined, "It is not executed yet, #2");
  returnResult1(1);
  assert.equal(asyncHasErrors, undefined, "Not all executed, #2");
  returnResult2(2);
  assert.equal(asyncHasErrors, false, "Has no errors");

  FunctionFactory.Instance.unregister("asyncFunc1");
  FunctionFactory.Instance.unregister("asyncFunc2");
});

QUnit.test("visibleIf with async functions", function (assert) {
  var returnResult1: (res: any) => void;
  var returnResult2: (res: any) => void;
  function asyncFunc1(params: any): any {
    returnResult1 = this.returnResult;
    return false;
  }
  function asyncFunc2(params: any): any {
    returnResult2 = this.returnResult;
    return false;
  }
  FunctionFactory.Instance.register("asyncFunc1", asyncFunc1, true);
  FunctionFactory.Instance.register("asyncFunc2", asyncFunc2, true);
  var survey = twoPageSimplestSurvey();
  var q1 = survey.getQuestionByName("question1");
  var q2 = survey.getQuestionByName("question2");

  q1.visibleIf = "asyncFunc1() = 1";
  q2.visibleIf = "asyncFunc2() = 2";
  returnResult1(-1);
  returnResult2(-1);
  assert.equal(q1.isVisible, false, "Hide initially, q1");
  assert.equal(q2.isVisible, false, "Hide initially, q2");
  returnResult1(0);
  returnResult2(0);
  assert.equal(q1.isVisible, false, "Hide, q1 = 0");
  assert.equal(q2.isVisible, false, "Hide, q2 = 0");
  returnResult1(1);
  assert.equal(q1.isVisible, true, "Show, q1 = 1");
  assert.equal(q2.isVisible, false, "Hide, q2 = 0");
  returnResult2(2);
  assert.equal(q1.isVisible, true, "Show, q1 = 1");
  assert.equal(q2.isVisible, true, "Hide, q2 = 2");
  FunctionFactory.Instance.unregister("asyncFunc1");
  FunctionFactory.Instance.unregister("asyncFunc2");
});
QUnit.test(
  "visibleIf with calculated values that uses async functions",
  function (assert) {
    var returnResult1: (res: any) => void;
    function asyncFunc1(params: any): any {
      returnResult1 = this.returnResult;
      return false;
    }
    FunctionFactory.Instance.register("asyncFunc1", asyncFunc1, true);
    var survey = twoPageSimplestSurvey();
    var calcValue = new CalculatedValue("calc1", "asyncFunc1()");
    survey.calculatedValues.push(calcValue);
    var q1 = survey.getQuestionByName("question1");
    q1.visibleIf = "{calc1} = 1";
    assert.equal(q1.isVisible, false, "Hide initially, q1");
    returnResult1(0);
    assert.equal(q1.isVisible, false, "Hide, calc1 = 0");
    returnResult1(1);
    assert.equal(q1.isVisible, true, "Show, calc1 = 1");
    returnResult1(2);
    assert.equal(q1.isVisible, false, "Hide, calc1 = 2");
    FunctionFactory.Instance.unregister("asyncFunc1");
  }
);

QUnit.test("Hide required errors, add tests for Bug#2679", function (assert) {
  var survey = twoPageSimplestSurvey();
  var q1 = survey.getQuestionByName("question1");
  q1.isRequired = true;
  survey.nextPage();
  assert.equal(q1.errors.length, 1, "There is one error");
  assert.equal(q1.errors[0].visible, true, "It is visible");
  assert.equal(q1.hasVisibleErrors, true, "There is a visible error");
  survey.clear(true, true);
  survey.hideRequiredErrors = true;
  survey.nextPage();
  assert.equal(q1.errors.length, 1, "There is one error");
  assert.equal(q1.errors[0].visible, false, "It is invisible");
  assert.equal(q1.hasVisibleErrors, false, "There is no visible Errors");
});
QUnit.test("survey.onSettingQuestionErrors", function (assert) {
  var survey = twoPageSimplestSurvey();
  var q1 = survey.getQuestionByName("question1");
  var q2 = survey.getQuestionByName("question2");
  q1.isRequired = true;
  survey.onSettingQuestionErrors.add(function (sender, options) {
    if (options.question.name == "question1") {
      options.errors[0].visible = false;
    }
    if (options.question.name == "question2") {
      options.errors.push(new AnswerRequiredError());
    }
  });
  survey.nextPage();
  assert.equal(q1.errors.length, 1, "There is one error");
  assert.equal(q1.errors[0].visible, false, "It is invisible");
  assert.equal(q2.errors.length, 1, "Add one error into second question");
});
QUnit.test("survey.onValidateQuestion wors as survey.onSettingQuestionErrors", function (assert) {
  var survey = twoPageSimplestSurvey();
  var q1 = survey.getQuestionByName("question1");
  var q2 = survey.getQuestionByName("question2");
  q1.isRequired = true;
  survey.onValidateQuestion.add(function (sender, options) {
    if (options.question.name == "question1") {
      options.errors[0].visible = false;
    }
    if (options.question.name == "question2") {
      options.errors.push(new AnswerRequiredError());
    }
  });
  survey.nextPage();
  assert.equal(q1.errors.length, 1, "There is one error");
  assert.equal(q1.errors[0].visible, false, "It is invisible");
  assert.equal(q2.errors.length, 1, "Add one error into second question");
});

QUnit.test("Check containsError property", function (assert) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "paneldynamic",
        name: "panel1",
        templateElements: [
          {
            type: "text",
            name: "question1",
            isRequired: true,
          },
        ],
        panelCount: 2,
      },
      {
        type: "panel",
        name: "panel2",
        elements: [
          {
            type: "text",
            name: "question2",
            isRequired: true,
          },
        ],
      },
      {
        type: "text",
        name: "question3",
        isRequired: true,
      },
      {
        type: "multipletext",
        name: "question4",
        items: [{ name: "q1_m1", isRequired: true }],
      },
      {
        type: "matrixdropdown",
        name: "question5",
        columns: [
          {
            name: "col1",
            cellType: "dropdown",
            isRequired: true,
          },
        ],
        choices: [1],
        rows: ["row1"],
      },
    ],
  });
  var panelDynamic = <QuestionPanelDynamicModel>(
    survey.getQuestionByName("panel1")
  );
  var panel = <PanelModel>survey.getPanelByName("panel2");
  var question = survey.getQuestionByName("question3");
  var questionMultiple = survey.getQuestionByName("question4");
  var questionMatrixDropdown = survey.getQuestionByName("question5");
  var rows = questionMatrixDropdown.visibleRows;
  assert.equal(
    panelDynamic.containsErrors,
    false,
    "It doesn't contain errors by default"
  );
  assert.equal(survey.isCurrentPageHasErrors, true, "The page has Errors");
  assert.equal(
    panelDynamic.containsErrors,
    true,
    "Dynamic panel contains errros"
  );
  assert.equal(panel.containsErrors, true, "panel contains errors");
  assert.equal(question.containsErrors, true, "question contains errors");
  assert.equal(
    questionMultiple.items[0].editor.containsErrors,
    true,
    "question multiple item contains errors"
  );
  assert.equal(
    questionMultiple.containsErrors,
    true,
    "question multiple contains errors"
  );
  assert.equal(
    questionMatrixDropdown.containsErrors,
    true,
    "MatrixDropdown contains errors"
  );
  survey.data = {
    panel1: [{ question1: 1 }, { question1: 1 }],
    question2: 2,
    question3: 3,
    question4: { q1_m1: 1 },
    question5: { row1: { col1: 1 } },
  };
  assert.equal(
    panelDynamic.containsErrors,
    true,
    "contains errros is not updated yet"
  );
  assert.equal(survey.isCurrentPageHasErrors, false, "The page has no errors");
  assert.equal(
    panelDynamic.containsErrors,
    false,
    "Dynamic panel contains no errros"
  );
  assert.equal(panel.containsErrors, false, "panel contains no errors");
  assert.equal(question.containsErrors, false, "question contains no errors");
  assert.equal(
    questionMultiple.containsErrors,
    false,
    "question multiple contains no errors"
  );
  assert.equal(
    questionMatrixDropdown.containsErrors,
    false,
    "MatrixDropdown contains no errors"
  );
});
QUnit.test(
  "Check containsError property for panel dynamic with checkErrorsMode: 'onValueChanged'",
  function (assert) {
    var survey = new SurveyModel({
      checkErrorsMode: "onValueChanged",
      elements: [
        {
          type: "paneldynamic",
          name: "panel1",
          templateElements: [
            {
              type: "text",
              name: "question1",
              isRequired: true,
            },
          ],
          panelCount: 1,
        },
      ],
    });
    var panelDynamic = <QuestionPanelDynamicModel>(
      survey.getQuestionByName("panel1")
    );
    var question = panelDynamic.panels[0].questions[0];
    assert.equal(
      panelDynamic.containsErrors,
      false,
      "It doesn't contain errors by default"
    );
    question.value = "1";
    assert.equal(panelDynamic.containsErrors, false, "The panel has no errors");
    question.value = "";
    assert.equal(panelDynamic.containsErrors, true, "We show errors");
    question.value = "1";
    assert.equal(panelDynamic.containsErrors, false, "The panel has no errors again");
    panelDynamic.value = [{}];
    assert.equal(question.isEmpty(), true, "Question is empty");
    assert.equal(panelDynamic.containsErrors, false, "We do not show error on value change in panel itself");
    survey.tryComplete();
    assert.equal(panelDynamic.containsErrors, true,
      "The panel has errors after value changed to empty. Show it on next page event"
    );
  }
);
QUnit.test("Check isAnswered property", function (assert) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "paneldynamic",
        name: "panel1",
        templateElements: [
          {
            type: "text",
            name: "question1",
          },
        ],
        panelCount: 2,
      },
      {
        type: "text",
        name: "question2",
      },
      {
        type: "multipletext",
        name: "question3",
        items: [{ name: "q1_m1" }, { name: "q2_m1" }],
      },
      {
        type: "matrixdropdown",
        name: "question4",
        columns: [
          {
            name: "col1",
            cellType: "dropdown",
          },
          {
            name: "col2",
            cellType: "dropdown",
          },
        ],
        choices: [1],
        rows: ["row1"],
      },
    ],
  });
  var panelDynamic = <QuestionPanelDynamicModel>(
    survey.getQuestionByName("panel1")
  );
  var question = survey.getQuestionByName("question2");
  var questionMultiple = survey.getQuestionByName("question3");
  var questionMatrixDropdown = survey.getQuestionByName("question4");
  var rows = questionMatrixDropdown.visibleRows;
  assert.equal(panelDynamic.isAnswered, false, "Paneldynamic is not answered");
  assert.equal(
    questionMultiple.isAnswered,
    false,
    "Multiple text is not answered"
  );
  assert.equal(question.isAnswered, false, "Question is not  answered");
  assert.equal(
    questionMatrixDropdown.isAnswered,
    false,
    "Paneldynamic is not answered"
  );
  survey.data = {
    panel1: [{ question1: 1 }, {}],
    question2: 3,
    question3: { q1_m1: 1 },
    question4: { row1: { col1: 1 } },
  };
  assert.equal(
    panelDynamic.isAnswered,
    false,
    "Paneldynamic is not fully answered"
  );
  assert.equal(
    questionMultiple.isAnswered,
    false,
    "Multiple text is not fully answered"
  );
  assert.equal(question.isAnswered, true, "Question is answered");
  assert.equal(
    questionMatrixDropdown.isAnswered,
    false,
    "Paneldynamic is not fully answered"
  );
  survey.data = {
    panel1: [{ question1: 1 }, { question1: 2 }],
    question3: { q1_m1: 1, q2_m1: 2 },
    question4: { row1: { col1: 1, col2: 2 } },
  };
  assert.equal(panelDynamic.isAnswered, true, "Paneldynamic is fully answered");
  assert.equal(
    questionMultiple.isAnswered,
    true,
    "Multiple text is fully answered"
  );
  assert.equal(
    questionMatrixDropdown.isAnswered,
    true,
    "Paneldynamic is fully answered"
  );
});

QUnit.test(
  "Two matrix with same valueName, clear values for invisible rows only, Bug# https://surveyjs.answerdesk.io/ticket/details/T2713",
  function (assert) {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrix",
          name: "question1",
          valueName: "a",
          columns: ["1", "2", "3"],
          rows: [
            {
              value: "item1",
              text: "Item 1",
            },
            {
              value: "item2",
              text: "Item 2",
            },
          ],
        },
        {
          type: "matrix",
          name: "question2",
          valueName: "a",
          columns: ["1", "2", "3"],
          rows: [
            {
              value: "item3",
              text: "Item 3",
            },
            {
              value: "item4",
              text: "Item 4",
            },
          ],
        },
      ],
    });
    var m1 = <QuestionMatrixModel>survey.getQuestionByName("question1");
    var m2 = <QuestionMatrixModel>survey.getQuestionByName("question2");
    m1.visibleRows[0].value = "1";
    m1.visibleRows[1].value = "2";
    m2.visibleRows[0].value = "1";
    m2.visibleRows[1].value = "3";
    assert.deepEqual(survey.data, {
      a: { item1: "1", item2: "2", item3: "1", item4: "3" },
    });
    survey.doComplete();
    assert.deepEqual(survey.data, {
      a: { item1: "1", item2: "2", item3: "1", item4: "3" },
    });
  }
);

class ExpressionToDisplayText {
  private currentQuestion: Question;
  constructor(public survey: SurveyModel) { }
  public toDisplayText(expression: string): string {
    var parser = new ConditionsParser();
    var node = parser.parseExpression(expression);
    if (!node) return expression;
    this.currentQuestion = null;
    var self = this;
    var strFunc = function (op: Operand): string {
      if (op.getType() == "variable") {
        return self.getQuestionText(<Variable>op);
      }
      if (op.getType() == "const") {
        return self.getDisplayText(<Const>op);
      }
      if (op.getType() == "binary") {
        self.proceedBinary(<BinaryOperand>op);
      }
      return undefined;
    };
    return node.toString(strFunc);
  }
  private getQuestionText(op: Variable): string {
    var question = this.survey.getQuestionByName(op.variable);
    if (!question || !question.title) return undefined;
    return "{" + question.title + "}";
  }
  private getDisplayText(op: Const): string {
    if (!this.currentQuestion) return undefined;
    var res = this.currentQuestion.getDisplayValue(true, op.correctValue);
    return !!res ? new Const(res).toString() : undefined;
  }
  private proceedBinary(op: BinaryOperand) {
    if (op.isArithmetic || op.isConjunction) {
      this.currentQuestion = null;
      return;
    }
    this.currentQuestion = this.getQuestionFromOperands(
      op.leftOperand,
      op.rightOperand
    );
    if (!this.currentQuestion) {
      this.currentQuestion = this.getQuestionFromOperands(
        op.rightOperand,
        op.leftOperand
      );
    }
  }
  private getQuestionFromOperands(op1: Operand, op2: Operand) {
    if (!op1 || !op2) return null;
    if (op1.getType() != "variable") return null;
    if (
      op2.getType() != "const" &&
      op2.getType() != "function" &&
      op2.getType() != "array"
    )
      return null;
    return this.survey.getQuestionByName((<Variable>op1).variable);
  }
}

QUnit.test(
  "Expression operator get display text using question.title and question.displayValue",
  function (assert) {
    var survey = new SurveyModel({
      elements: [
        {
          type: "radiogroup",
          name: "q1",
          title: "Question 1",
          choices: [
            { value: 1, text: "one" },
            { value: 2, text: "two" },
          ],
        },
        {
          type: "checkbox",
          name: "q2",
          title: "Question 2",
          choices: [
            { value: 1, text: "one" },
            { value: 2, text: "two" },
            { value: 3, text: "three" },
          ],
        },
      ],
    });
    var expressionToDisplay = new ExpressionToDisplayText(survey);
    var str = expressionToDisplay.toDisplayText("{q1} + 1");
    assert.equal(str, "({Question 1} + 1)");
    str = expressionToDisplay.toDisplayText("{q1} = 1");
    assert.equal(str, "({Question 1} == one)");
    str = expressionToDisplay.toDisplayText("{q1} = [1, 2]");
    assert.equal(str, "({Question 1} == [one, two])");
    str = expressionToDisplay.toDisplayText(
      "{q1} = 2 or (1 != {q1} and {q2} contains [1, 2]) or {q3} = 1"
    );
    assert.equal(
      str,
      "((({Question 1} == two) or ((one != {Question 1}) and ({Question 2} contains [one, two]))) or ({q3} == 1))",
      "Use question title and display text"
    );
  }
);

QUnit.test(
  "Expression doesn't work correctly with iif function, Bug#1942",
  function (assert) {
    // prettier-ignore
    var json = {
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "text",
              "name": "question3"
            },
            {
              "type": "radiogroup",
              "name": "question1",
              "choices": [
                {
                  "value": "item1",
                  "text": "item1"
                },
                "item2",
                "item3"
              ]
            },
            {
              "type": "expression",
              "name": "question2",
              "expression": "{question3} + iif( {question1} = \"item2\", \"[\" + {question3} + \"]\", \"x\")",
              "commentText": "Other (describe)"
            }
          ]
        }
      ]
    };
    var survey = new SurveyModel(json);
    survey.setValue("question3", "a");
    survey.setValue("question1", "item2");
    assert.equal(survey.getValue("question2"), "a[a]", "iif true");
    survey.setValue("question1", "item1");
    assert.equal(survey.getValue("question2"), "ax", "iif false");
    survey.clearValue("question3");
    assert.equal(
      survey.getValue("question2"),
      "x",
      "iif false where question3 is empty"
    );
  }
);

QUnit.test("Different css for different surveys", function (assert) {
  var json = { questions: [{ type: "text", name: "q" }] };
  var survey1 = new SurveyModel();
  setOldTheme(survey1);
  var survey2 = new SurveyModel();
  setOldTheme(survey2);
  var defaultQuestionRoot = survey1.css.question.mainRoot;
  survey1.css.question.mainRoot += " class1";
  survey2.css.question.mainRoot += " class2";
  survey1.fromJSON(json);
  survey2.fromJSON(json);
  assert.equal(
    survey1.css.question.mainRoot,
    defaultQuestionRoot + " class1",
    "Correct css name for survey1"
  );
  assert.equal(
    survey2.css.question.mainRoot,
    defaultQuestionRoot + " class2",
    "Correct css name for survey2"
  );
  var question1 = survey1.getQuestionByName("q");
  var question2 = survey2.getQuestionByName("q");
  assert.equal(
    question1.cssRoot,
    defaultQuestionRoot + " class1",
    "Correct css name for question1"
  );
  assert.equal(
    question2.cssRoot,
    defaultQuestionRoot + " class2",
    "Correct css name for question2"
  );
});

QUnit.test("Question css classes", function (assert) {
  var survey = new SurveyModel();
  setOldTheme(survey);
  survey.css.question.hasError = "error";
  survey.css.question.small = "small";
  survey.css.question.title = "title";
  survey.css.question.titleOnError = "onError";
  survey.css.question.titleOnAnswer = "onAnswer";
  survey.fromJSON({
    questions: [{ type: "text", name: "q1", isRequired: true }],
  });
  var q1 = survey.getQuestionByName("q1");
  assert.equal(q1.errors.length, 0, "There is not errors");
  var defaultQuestionRoot = survey.css.question.mainRoot;
  assert.equal(
    q1.cssRoot,
    defaultQuestionRoot + " small",
    "Default question root"
  );
  assert.equal(q1.cssTitle, "title", "Default question title");
  q1.titleLocation = "left";
  var addLeft = " " + survey.css.question.titleLeftRoot;
  assert.equal(
    q1.cssRoot,
    defaultQuestionRoot + addLeft + " small",
    "titleLocation = left"
  );
  q1.width = "40%";
  assert.equal(
    q1.cssRoot,
    defaultQuestionRoot + addLeft,
    "titleLocation = left and remove small"
  );
  q1.titleLocation = "default";
  assert.equal(
    q1.cssRoot,
    defaultQuestionRoot,
    "titleLocation = default and remove small"
  );
  survey.hasErrors();
  var addError = " " + survey.css.question.hasError;
  assert.equal(q1.cssRoot, defaultQuestionRoot + addError, "has error");
  assert.equal(q1.cssTitle, "title onError", "question title, on error");
  q1.value = "somevalue";
  survey.hasErrors();
  assert.equal(q1.cssRoot, defaultQuestionRoot, "no errors");
  assert.equal(q1.cssTitle, "title onAnswer", "question title, on answer");
  q1.clearValue();
  assert.equal(q1.cssTitle, "title", "question title clear");
  q1.value = "somevalue";
  assert.equal(q1.cssTitle, "title onAnswer", "question title on answer 2");
  survey.questionTitleLocation = "left";
  assert.equal(
    q1.cssRoot,
    defaultQuestionRoot + addLeft,
    "survey.questionTitleLocation = left"
  );
});

QUnit.test("Survey<=Base propertyValueChanged", function (assert) {
  var json = { title: "title", questions: [{ type: "text", name: "q" }] };
  var survey = new SurveyModel(json);
  var counter = 0;

  let log = "";
  survey.onPropertyValueChangedCallback = (
    name: string,
    oldValue: any,
    newValue: any,
    sender: SurveyModel,
    arrayChanges: ArrayChanges
  ) => {
    counter++;
    log += "->" + name;
  };

  assert.equal(counter, 0, "initial");

  survey.title = "new";
  assert.equal(counter, 1, "callback called");
  assert.equal(log, "->title", "callback called for title");
});

QUnit.test(
  "Survey.onPropertyValueChangedCallback for validators and triggers",
  function (assert) {
    var json = {
      title: "title",
      questions: [
        {
          type: "text",
          name: "q1",
          validators: [{ type: "text", maxLength: 3 }],
        },
        { type: "text", name: "q2" },
      ],
      triggers: [
        {
          type: "setvalue",
          setToName: "q1",
          expression: "{q2}='1",
          setValue: "2",
        },
      ],
    };
    var survey = new SurveyModel(json);
    var counter = 0;
    var propName = null;
    var testOldValue = null;
    var testNewValue = null;
    var senderType = null;

    survey.onPropertyValueChangedCallback = (
      name: string,
      oldValue: any,
      newValue: any,
      sender: any,
      arrayChanges: ArrayChanges
    ) => {
      counter++;
      propName = name;
      testOldValue = oldValue;
      testNewValue = newValue;
      senderType = sender.getType();
    };

    assert.equal(counter, 0, "initial");

    (<SurveyTriggerSetValue>survey.triggers[0]).setValue = "3";

    assert.equal(counter, 1, "trigger: callback called");
    assert.equal(propName, "setValue", "trigger: property name is correct");
    assert.equal(testOldValue, "2", "trigger: oldValue is correct");
    assert.equal(testNewValue, "3", "trigger: newValue is correct");
    assert.equal(senderType, "setvaluetrigger", "trigger: sender is correct");
    (<TextValidator>survey.getQuestionByName("q1").validators[0]).maxLength = 5;
    assert.equal(counter, 2, "validator: callback called");
    assert.equal(propName, "maxLength", "validator: property name is correct");
    assert.equal(testOldValue, 3, "validator: oldValue is correct");
    assert.equal(testNewValue, 5, "validator: newValue is correct");
    assert.equal(senderType, "textvalidator", "validator: sender is correct");
  }
);

QUnit.test("Survey questionTitleTemplate -> questionTitlePattern", function (
  assert
) {
  var survey = new SurveyModel();
  assert.equal(survey.questionTitlePattern, "numTitleRequire", "default value");
  survey.questionTitleTemplate = "{require} {no}{title}";
  assert.equal(
    survey.questionTitlePattern,
    "requireNumTitle",
    "{require} {no}{title}"
  );
  survey.questionTitleTemplate = "{no}{require} {title}";
  assert.equal(
    survey.questionTitlePattern,
    "numRequireTitle",
    "{no}{require} {title}"
  );
  survey.questionTitleTemplate = "{title}";
  assert.equal(survey.questionTitlePattern, "numTitle", "{title}");
  survey.questionTitleTemplate = "{no}{title}{require}";
  assert.equal(
    survey.questionTitlePattern,
    "numTitleRequire",
    "{no}{title}{require}"
  );
  survey.questionTitleTemplate = "{no}{title}";
  assert.equal(survey.questionTitlePattern, "numTitle", "{no}{title}");
});

QUnit.test("Survey.getQuestionTitlePatternOptions()", function (assert) {
  var survey = new SurveyModel();
  survey.questionStartIndex = "# 1.";
  survey.requiredMark = "(*)";
  var options = survey.getQuestionTitlePatternOptions();
  assert.deepEqual(options, [
    {
      value: "numTitleRequire",
      text: "# 1. Question Title (*)",
    },
    {
      value: "numRequireTitle",
      text: "# 1. (*) Question Title",
    },
    // {
    //   value: "requireNumTitle",
    //   text: "(*) # 1. Question Title",
    // },
    {
      value: "numTitle",
      text: "# 1. Question Title",
    },
  ]);
});

QUnit.test(
  "Survey.getQuestionByName with caseInsensitive equals to true, Bug ##2051",
  function (assert) {
    var survey = new SurveyModel({
      elements: [
        {
          type: "text",
          name: "Q1",
        },
      ],
    });
    assert.ok(survey.getQuestionByName("q1", true), "q1");
    assert.ok(survey.getQuestionByName("Q1", true), "Q1");
  }
);

QUnit.test("Survey hasLogo", function (assert) {
  var survey = new SurveyModel({});
  assert.notOk(survey.hasLogo);
  assert.equal(survey.logoPosition, "left");
  assert.notOk(!!survey.locLogo.renderedHtml);
  survey.logo = "some url";
  assert.ok(survey.hasLogo);
  assert.ok(survey.getPropertyValue("hasLogo"));
});

QUnit.test("Survey hasLogo is reactive", function (assert) {
  var survey = new SurveyModel({
    logo: "an url"
  });
  assert.ok(survey.hasLogo);
  assert.ok(survey.getPropertyValue("hasLogo"));
});

QUnit.test("Survey isLogoBefore/isLogoAfter", function (assert) {
  var survey = new SurveyModel({});
  assert.notOk(!!survey.locLogo.renderedHtml);
  assert.equal(survey.logoPosition, "left");

  assert.notOk(survey.isLogoBefore);
  assert.notOk(survey.isLogoAfter);

  survey.logo = "some url";
  assert.ok(survey.isLogoBefore);
  assert.notOk(survey.isLogoAfter);

  survey.logoPosition = "top";
  assert.ok(survey.isLogoBefore);
  assert.notOk(survey.isLogoAfter);

  survey.logoPosition = "right";
  assert.notOk(survey.isLogoBefore);
  assert.ok(survey.isLogoAfter);

  survey.logoPosition = "bottom";
  assert.notOk(survey.isLogoBefore);
  assert.ok(survey.isLogoAfter);

  survey.logoPosition = "none";
  assert.notOk(survey.isLogoBefore);
  assert.notOk(survey.isLogoAfter);
});

QUnit.test("Survey logoClassNames", function (assert) {

  var survey = new SurveyModel({});
  setOldTheme(survey);
  assert.equal(survey.logoPosition, "left");

  assert.equal(survey.logoClassNames, "sv_logo sv-logo--left");

  survey.logoPosition = "top";
  assert.equal(survey.logoClassNames, "sv_logo sv-logo--top");

  survey.logoPosition = "right";
  assert.equal(survey.logoClassNames, "sv_logo sv-logo--right");

  survey.logoPosition = "bottom";
  assert.equal(survey.logoClassNames, "sv_logo sv-logo--bottom");

  survey.logoPosition = "none";
  assert.equal(survey.logoClassNames, "sv_logo");
});
QUnit.test("Survey.onQuestionCreated", function (assert) {
  var survey = new SurveyModel();
  survey.onQuestionCreated.add(function (sender, options) {
    options.question.tag = "was here";
  });
  survey.fromJSON({
    elements: [
      {
        type: "text",
        name: "q1",
      },
      {
        type: "matrixdynamic",
        name: "q2",
        columns: [
          {
            name: "col1",
          },
        ],
      },
      {
        type: "multipletext",
        name: "q3",
        items: [
          {
            name: "item1",
          },
        ],
      },
      {
        type: "paneldynamic",
        name: "q4",
        templateElements: [
          {
            type: "text",
            name: "question1",
          },
        ],
        panelCount: 1,
      },
    ],
  });
  assert.equal(
    survey.getQuestionByName("q1").tag,
    "was here",
    "onQuestionCreated calls for a standard question"
  );
  assert.equal(
    survey.getQuestionByName("q2").visibleRows[0].cells[0].question.tag,
    "was here",
    "onQuestionCreated calls for a matrix cell question"
  );
  assert.equal(
    survey.getQuestionByName("q3").items[0].editor.tag,
    "was here",
    "onQuestionCreated calls for a multiple text question"
  );
  assert.equal(
    survey.getQuestionByName("q4").panels[0].questions[0].tag,
    "was here",
    "onQuestionCreated calls for a multiple text question"
  );
});
QUnit.test(
  "Survey.checkErrorsMode=onValueChanged, some errors should be shown onNextPage only, matrix",
  function (assert) {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrix",
          name: "question1",
          columns: ["Column 1", "Column 2", "Column 3"],
          rows: ["Row 1", "Row 2"],
          eachRowRequired: true,
        },
      ],
      checkErrorsMode: "onValueChanged",
    });
    var question1 = survey.getQuestionByName("question1");
    question1.value = { "Row 1": "Column 2" };
    assert.equal(question1.errors.length, 0, "There is no errors yet");
    survey.tryComplete();
    assert.equal(
      question1.errors.length,
      1,
      "There is one error, isAllRowRequried"
    );
    question1.value = { "Row 1": "Column 3" };
    assert.equal(question1.errors.length, 1, "The error was not fixed");
    question1.value = { "Row 1": "Column 3", "Row 2": "Column 3" };
    assert.equal(question1.errors.length, 0, "The error is gone");
  }
);
QUnit.test(
  "Survey.checkErrorsMode=onValueChanged, some errors should be shown onNextPage only, multipletext",
  function (assert) {
    var survey = new SurveyModel({
      elements: [
        {
          type: "multipletext",
          name: "question1",
          items: [
            { name: "item1", isRequired: true },
            { name: "item2", isRequired: true },
          ],
        },
      ],
      checkErrorsMode: "onValueChanged",
    });
    var question1 = <QuestionMultipleTextModel>(
      survey.getQuestionByName("question1")
    );
    question1.items[0].editor.value = "value1";
    assert.deepEqual(
      survey.data,
      { question1: { item1: "value1" } },
      "Data set correctly"
    );
    assert.equal(question1.errors.length, 0, "There is no errors yet");
    assert.equal(
      question1.items[1].editor.errors.length,
      0,
      "There is no errors in item2"
    );
    survey.tryComplete();
    assert.equal(
      question1.items[1].editor.errors.length,
      1,
      "There is one error, isRequired"
    );
    question1.items[0].editor.value = "value1_1";
    assert.equal(
      question1.items[0].editor.errors.length,
      0,
      "There is no errors in the first editor"
    );
    assert.equal(
      question1.items[1].editor.errors.length,
      1,
      "The error is not fixed"
    );
    question1.items[1].editor.value = "value2";
    assert.equal(
      question1.items[1].editor.errors.length,
      0,
      "The error is gone"
    );
  }
);
QUnit.test("Remove errors on settings correct values, multipletext", function (
  assert
) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "multipletext",
        name: "question1",
        items: [
          { name: "item1", isRequired: true },
          { name: "item2", isRequired: true },
        ],
      },
    ],
  });
  var question1 = <QuestionMultipleTextModel>(
    survey.getQuestionByName("question1")
  );
  survey.tryComplete();
  assert.equal(
    question1.items[0].editor.errors.length,
    1,
    "There is required error in item1"
  );
  assert.equal(
    question1.items[1].editor.errors.length,
    1,
    "There is required error in item2"
  );
  question1.items[0].editor.value = "val1";
  assert.equal(
    question1.items[0].editor.errors.length,
    0,
    "There is no errors in item1"
  );
  assert.equal(
    question1.items[1].editor.errors.length,
    1,
    "There is still required error in item2"
  );
  question1.items[1].editor.value = "val2";
  assert.equal(
    question1.items[1].editor.errors.length,
    0,
    "There is no errors in item2"
  );
});
QUnit.test("Remove errors on settings correct values, paneldynamic", function (
  assert
) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "paneldynamic",
        name: "panel1",
        panelCount: 1,
        templateElements: [
          {
            type: "text",
            name: "q1",
            isRequired: true,
          },
        ],
      },
    ],
  });
  var panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel1");
  survey.tryComplete();
  assert.equal(
    panel.panels[0].questions[0].errors.length,
    1,
    "There is required error in question"
  );
  panel.panels[0].questions[0].value = "val1";
  assert.equal(
    panel.panels[0].questions[0].errors.length,
    0,
    "There is no errors in question"
  );
});
QUnit.test("Remove errors on settings correct values, matrtixdynamic", function (
  assert
) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic",
        name: "matrix",
        rowCount: 1,
        columns: [{ name: "col1", isRequired: true, cellType: "text" }],
      },
    ],
  });
  var matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
  var question = matrix.visibleRows[0].cells[0].question;
  survey.tryComplete();
  assert.equal(
    question.errors.length,
    1,
    "There is required error in question"
  );
  question.value = "val1";
  assert.equal(question.errors.length, 0, "There is no errors in question");
});
QUnit.test("Survey.checkErrorsMode=onValueChanged, do not set incorrect value #8928, Revert #2141", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        type: "text",
        name: "birthdate",
        isRequired: true,
        maxValueExpression: "getDate('2020-01-01')",
        inputType: "date",
      },
    ],
    checkErrorsMode: "onValueChanged",
  });
  var question1 = survey.getQuestionByName("birthdate");
  question1.value = "2020-01-02";
  assert.equal(question1.errors.length, 1, "There is one error");
  assert.notOk(survey.getValue("birthdate"), "There is no incorrect value in survey data");
  question1.value = "2000-01-02";
  assert.equal(question1.errors.length, 0, "There is no errors");
  assert.ok(survey.getValue("birthdate"), "The value is correct");
});
QUnit.test(
  "Update question errors on value change if question has error already regardless survey.checkErrorsMode property. #2265",
  function (assert) {
    var survey = new SurveyModel({
      elements: [
        {
          type: "text",
          name: "q1",
          isRequired: true,
        },
        {
          type: "text",
          name: "q2",
          isRequired: true,
          validators: [
            {
              type: "email",
            },
          ],
        },
      ],
    });
    var q1 = survey.getQuestionByName("q1");
    var q2 = survey.getQuestionByName("q2");
    survey.tryComplete();
    assert.equal(q1.errors.length, 1, "q1 is required");
    assert.equal(q2.errors.length, 1, "q2 is required");
    assert.equal(
      q2.errors[0].getErrorType(),
      "required",
      "q2 error is require"
    );
    q1.value = "some value";
    q2.value = "some value";
    assert.equal(q1.errors.length, 0, "q1 has value and we remove error");
    assert.equal(
      q2.errors.length,
      1,
      "q2 has value and we remove error required error, but there is e-mail error"
    );
    assert.notEqual(
      q2.errors[0].getErrorType(),
      "required",
      "q2 error - wrong e-mail format"
    );
    q2.value = "jon_snow@nightwatch.org";
    assert.equal(q2.errors.length, 0, "q2 has no errors");
  }
);
QUnit.test(
  "Update question errors on other text change if survey.checkErrorsMode property is 'onValueChanged'. Bug#1854",
  function (assert) {
    var survey = new SurveyModel({
      checkErrorsMode: "onValueChanged",
      elements: [
        {
          type: "dropdown",
          name: "q1",
          choices: [1, 2],
          hasOther: true,
        },
      ],
    });
    var q1 = <QuestionDropdownModel>survey.getQuestionByName("q1");
    q1.value = q1.otherItem.value;
    assert.equal(q1.errors.length, 0, "There is no error yet");
    q1.comment = "some value1";
    assert.equal(q1.errors.length, 0, "There is no error - there is a value");
    q1.comment = "";
    assert.equal(q1.errors.length, 1, "There is an error right now");
    q1.comment = "some value2";
    assert.equal(q1.errors.length, 0, "There is no error again");
    q1.value = 1;
    q1.value = q1.otherItem.value;
    assert.equal(q1.comment, "", "Comment is empty");
    assert.equal(q1.errors.length, 0, "There is no error - comment was cleaned");
  }
);
QUnit.test(
  "Update question errors on other text change if question has error already. Bug #1854",
  function (assert) {
    var survey = new SurveyModel({
      elements: [
        {
          type: "dropdown",
          name: "q1",
          choices: [1, 2],
          hasOther: true,
        },
      ],
    });
    var q1 = <QuestionDropdownModel>survey.getQuestionByName("q1");
    q1.value = q1.otherItem.value;
    survey.tryComplete();
    assert.equal(q1.errors.length, 1, "There is an error right now");
    q1.comment = "some value";
    assert.equal(q1.errors.length, 0, "There is no error now");
  }
);
QUnit.test(
  "dispose survey - https://github.com/surveyjs/survey-library/issues/2131",
  function (assert) {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrix",
          name: "question1",
          columns: ["Column 1", "Column 2", "Column 3"],
          rows: ["Row 1", "Row 2"],
        },
      ],
    });
    assert.equal(survey.pages.length, 1, "One page");
    assert.equal(survey.pages[0].elements.length, 1, "One element");
    survey.dispose();
    if (!!survey.pages) {
      assert.equal(survey.pages.length, 0, "No pages");
    }
  }
);

QUnit.test("visibleIf doens't work correctly, Bug #2193", function (assert) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "text",
        name: "q1",
        visibleIf: "[] contains 'C1'",
      },
    ],
  });
  var question = survey.getQuestionByName("q1");
  assert.equal(question.isVisible, false, "question should be invisible");
});

QUnit.test("Avoid stack overrflow in triggers, Bug #2202", function (assert) {
  var survey = new SurveyModel({
    elements: [
      { type: "text", name: "q1" },
      { type: "text", name: "q2" },
      { type: "text", name: "q3" },
    ],
    triggers: [
      {
        type: "setvalue",
        expression: "{q1} > 0 or {q3} > 1",
        setToName: "q3",
        setValue: 5,
      },
      {
        type: "setvalue",
        expression: "{q2} > 0 or {q3} > 1",
        setToName: "q3",
        setValue: 6,
      },
    ],
  });
  survey.setValue("q1", 1);
  survey.setValue("q2", 2);
  assert.equal(survey.getValue("q1"), 1, "q1 is set, no stackoverflow");
  assert.equal(survey.getValue("q2"), 2, "q2 is set, no stackoverflow");
});

QUnit.test(
  "Question hideNumber visibility depending on parent settings, https://surveyjs.answerdesk.io/ticket/details/t4504/survey-creator-can-we-hide-show-number-property-on-questions-if-numbering-is-off-at-form",
  function (assert) {
    var survey = new SurveyModel({
      showQuestionNumbers: "on",
      elements: [
        {
          type: "panel",
          name: "p1",
          elements: [{ type: "text", name: "q1" }],
        },
      ],
    });
    var panel = <PanelModel>survey.getPanelByName("p1");
    var question = survey.getQuestionByName("q1");
    var property = Serializer.findProperty("question", "showNumber");

    assert.ok(property.visibleIf(question), "Visible by default");

    question.titleLocation = "hidden";
    assert.notOk(property.visibleIf(question), "Invisible for hidden title");

    question.titleLocation = "default";
    panel.showQuestionNumbers = "off";
    assert.notOk(
      property.visibleIf(question),
      "Invisible due to parent settings"
    );

    panel.showQuestionNumbers = "default";
    survey.showQuestionNumbers = "off";
    assert.notOk(
      property.visibleIf(question),
      "Invisible due to survey settings"
    );

    panel.showQuestionNumbers = "onpanel";
    assert.ok(property.visibleIf(question), "Visible because of onpanel");

    var propertyStartIndex = Serializer.findProperty(
      "survey",
      "questionStartIndex"
    );
    assert.notOk(
      propertyStartIndex.visibleIf(survey),
      "Invisible due to survey settings"
    );

    survey.showQuestionNumbers = "default";
    assert.ok(propertyStartIndex.visibleIf(survey), "Visible by default");
  }
);
QUnit.test(
  "Update question title css on changing page.questionTitleLocation",
  function (assert) {
    var survey = new SurveyModel({
      elements: [
        {
          type: "panel",
          name: "p1",
          elements: [{ type: "text", name: "q1" }],
        },
      ],
    });
    setOldTheme(survey);
    var q1 = survey.getQuestionByName("q1");
    survey.pages[0].questionTitleLocation = "left";
    assert.equal(q1.getPropertyValue("cssHeader", "").trim(), "title-left");
  }
);

QUnit.test(
  "Pages visibleIndex doesn't set correctly, https://surveyjs.answerdesk.io/ticket/details/T4506, Bug#2248",
  function (assert) {
    var survey = new SurveyModel({
      pages: [
        {
          name: "CCOP Outage?",
          elements: [
            {
              type: "radiogroup",
              name: "CCOP Outage?",
              choices: ["item1", "item2"],
            },
          ],
        },
        {
          name: "Planned or Unplanned?",
          elements: [
            {
              type: "radiogroup",
              name: "Planned or Unplanned?",
              visibleIf: "{CCOP Outage?} = 'item1'",
              choices: ["item2", "item3"],
            },
          ],
        },
        {
          name: "Enter Parent ticket number:",
          elements: [
            {
              type: "text",
              name: "Enter Parent ticket number:",
              visibleIf: "{Planned or Unplanned?} = 'item2'",
            },
          ],
        },
        {
          name: "Advice planned",
          elements: [
            {
              type: "radiogroup",
              name: "Advice planned",
              visibleIf: "{Planned or Unplanned?} = 'item3'",
              choices: ["item1"],
            },
          ],
        },
        {
          name: "Check modem power",
          elements: [
            {
              type: "radiogroup",
              name: "Check modem power",
              visibleIf: "{CCOP Outage?} = 'item2'",
              choices: ["item1", "item2"],
            },
          ],
        },
        {
          name: "Replace modem",
          elements: [
            {
              type: "radiogroup",
              name: "Replace modem",
              visibleIf: "{Check modem power} = 'item1'",
              hideNumber: true,
              choices: ["item1", "item2", "item3"],
            },
          ],
        },
        {
          name: "Select ticket action 1",
          elements: [
            {
              type: "radiogroup",
              name: "Select ticket action 1",
              visibleIf: "{Replace modem} anyof ['item1', 'item2', 'item3']",
              hideNumber: true,
              choices: ["item1", "item2"],
            },
          ],
          title: "Select ticket action 1",
        },
        {
          name: "Check modem lights",
          elements: [
            {
              type: "radiogroup",
              name: "Check modem lights",
              visibleIf: "{Check modem power} = 'item2'",
              choices: ["item1", "item2", "item3", "item4", "item5", "item6"],
            },
          ],
        },
        {
          name: "Checks",
          elements: [
            {
              type: "checkbox",
              name: "Checks",
              visibleIf:
                "{Check modem lights} anyof ['item1', 'item3', 'item5']",
              title: "Checks",
              hideNumber: true,
              choices: [
                "item1",
                "item2",
                "item3",
                "item4",
                "item5",
                "item6",
                "item7",
              ],
            },
          ],
        },
        {
          elements: [
            {
              type: "radiogroup",
              name: "Please select ticket action",
              visibleIf:
                "{Checks} allof ['item1', 'item2', 'item3', 'item4', 'item5', 'item6', 'item7']",
              choices: ["item1", "item2", "item3"],
            },
          ],
        },
      ],
    });
    survey.setValue("CCOP Outage?", "item2");
    assert.equal(
      survey.pages[1].isVisible,
      false,
      "The second page is invisible"
    );
    assert.equal(
      survey.pages[1].visibleIndex,
      -1,
      "The second page visible index is -1"
    );
    assert.equal(survey.pages[4].isVisible, true, "The 5th page is visible");
    assert.equal(
      survey.pages[4].visibleIndex,
      1,
      "The fourth page visible index is 1"
    );
  }
);
QUnit.test(
  "Change pages visibleIndex on page visibilityChange, https://surveyjs.answerdesk.io/ticket/details/T4506, Bug#2248",
  function (assert) {
    var survey = new SurveyModel({
      pages: [
        {
          elements: [
            {
              type: "radiogroup",
              name: "question1",
              choices: ["item1", "item2"],
            },
          ],
        },
        {
          elements: [
            {
              type: "radiogroup",
              name: "question2",
              visibleIf: "{question1} = 'item1'",
              choices: ["item2", "item3"],
            },
          ],
        },
        {
          elements: [
            {
              type: "radiogroup",
              name: "question3",
              visibleIf: "{question1} = 'item2'",
              choices: ["item2", "item3"],
            },
          ],
        },
      ],
    });
    assert.equal(
      survey.pages[1].isVisible,
      false,
      "The second page is invisible initially"
    );
    assert.equal(
      survey.pages[1].visibleIndex,
      -1,
      "The second page visible index is -1 initially"
    );
    assert.equal(
      survey.pages[2].isVisible,
      false,
      "The third page is invisible initially"
    );
    assert.equal(
      survey.pages[2].visibleIndex,
      -1,
      "The third page visible index is -1 initially"
    );
    survey.setValue("question1", "item2");
    assert.equal(
      survey.pages[1].isVisible,
      false,
      "The second page is invisible"
    );
    assert.equal(
      survey.pages[1].visibleIndex,
      -1,
      "The second page visible index is -1"
    );
    assert.equal(survey.pages[2].isVisible, true, "The third page is visible");
    assert.equal(
      survey.pages[2].visibleIndex,
      1,
      "The third page visible index is 1"
    );
  }
);
QUnit.test("Do allow to set incrorect name", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("p1");
  var panel = page.addNewPanel(" panel1");
  var question = page.addNewQuestion("text", "{q1");
  assert.equal(page.name, "p1", "Remove trailing space from page");
  assert.equal(panel.name, "panel1", "Remove trailing space from panel");
  assert.equal(
    question.name,
    "q1",
    "Remove trailing space and { from question"
  );
  question.name = " {q2} s ";
  assert.equal(
    question.name,
    "q2 s",
    "Remove trailing space and { } from question"
  );
});
QUnit.test(
  "comment doesn't set when storeOthersAsComment equals false, Bug#2353",
  function (assert) {
    var survey = new SurveyModel({
      storeOthersAsComment: false,
      questions: [
        {
          type: "radiogroup",
          name: "test",
          title: "My Test field",
          choices: ["A", "B", "C"],
          hasComment: true,
        },
      ],
    });
    survey.data = {
      test: "B",
      "test-Comment": "ABC",
    };
    var question = survey.getQuestionByName("test");
    assert.equal(question.comment, "ABC", "Comment text set correctly");
  }
);
QUnit.test("question.clickTitleFunction, Bug#2312", function (assert) {
  var survey = new SurveyModel({
    questions: [
      {
        type: "radiogroup",
        name: "q1",
        choices: ["A", "B", "C"],
      },
      {
        type: "expression",
        name: "q2",
        expression: "1+2",
      },
    ],
  });
  var q1 = survey.getQuestionByName("q1");
  var q2 = survey.getQuestionByName("q2");
  assert.ok(q1.clickTitleFunction, "q1 has click title function");
  assert.notOk(
    q2.clickTitleFunction,
    "q2 has not click title function, no input"
  );
});
QUnit.test("survey.getProgressInfo()", function (assert) {
  var survey = new SurveyModel({
    pages: [
      {
        elements: [
          {
            type: "paneldynamic",
            name: "panel",
            templateElements: [
              { type: "text", name: "q1", isRequired: true },
              { type: "text", name: "q2" },
              { type: "text", name: "q3" },
            ],
          },
          { type: "text", name: "tq1", isRequired: true },
        ],
      },
      {
        elements: [
          { type: "text", name: "tq2", isRequired: true },
          { type: "text", name: "tq3" },
        ],
      },
    ],
  });
  survey.data = { panel: [{ q1: "1" }, { q2: "2" }, []], tq2: "3" };
  assert.deepEqual(survey.getProgressInfo(), {
    questionCount: 12,
    answeredQuestionCount: 3,
    requiredQuestionCount: 5,
    requiredAnsweredQuestionCount: 2,
  });
});
QUnit.test("trigger to copy matrix dropdown cell ", function (assert) {
  var survey = new SurveyModel({
    questions: [
      {
        name: "q1",
        type: "matrixdropdown",
        columns: [{ name: "col1" }, { name: "col2" }],
        rows: ["row1", "row2"],
        cellType: "text",
      },
      {
        name: "q2",
        type: "matrixdropdown",
        columns: [{ name: "col3" }, { name: "col4" }],
        rows: ["row3", "row4"],
        cellType: "text",
      },
    ],
    triggers: [
      {
        type: "copyvalue",
        expression: "{q1.row1.col1} notempty",
        fromName: "q1.row1.col1",
        setToName: "q2.row3.col3",
      },
    ],
  });
  var visibleRows = survey.getQuestionByName("q1").visibleRows;
  visibleRows[0].cells[0].value = "cell1";
  assert.deepEqual(
    survey.data,
    { q1: { row1: { col1: "cell1" } }, q2: { row3: { col3: "cell1" } } },
    "trigger works correctly"
  );
});

QUnit.test(
  "defaultValue and survey.clearInvisibleValues='onHidden', Bug#2428",
  function (assert) {
    var survey = new SurveyModel({
      clearInvisibleValues: "onHidden",
      elements: [
        {
          name: "q1",
          type: "text",
          defaultValue: 1,
          visible: false,
        },
      ],
    });
    var q1 = survey.getQuestionByName("q1");
    assert.equal(q1.isEmpty(), true, "Question is invisible");
    q1.visible = true;
    assert.equal(q1.isEmpty(), false, "Question is visible");
    assert.equal(q1.value, 1, "get value from defaultValue");
    q1.visible = false;
    assert.equal(q1.isEmpty(), true, "Question is invisible #2");
    q1.visible = true;
    assert.equal(q1.isEmpty(), false, "Question is visible #2");
    assert.equal(q1.value, 1, "get value from defaultValue #2");
  }
);
QUnit.test(
  "defaultValue and survey.clearInvisibleValues='onHiddenContainer'",
  function (assert) {
    var survey = new SurveyModel({
      clearInvisibleValues: "onHiddenContainer",
      pages: [
        {
          elements: [
            {
              type: "panel",
              name: "p1",
              elements: [
                {
                  name: "q1",
                  type: "text",
                  defaultValue: 5,
                },
                {
                  name: "q2",
                  type: "text",
                },
              ],
            },
            {
              name: "q3",
              type: "text",
            },
          ],
        },
        {
          elements: [{ name: "q4", type: "text" }],
        },
      ],
    });
    var p1 = <PanelModel>survey.getPanelByName("p1");
    survey.data = { q1: 1, q2: 2, q3: 3, q4: 4 };
    p1.visible = false;
    assert.deepEqual(
      survey.data,
      { q3: 3, q4: 4 },
      "Clear values on clearing panel"
    );
    p1.visible = true;
    assert.deepEqual(
      survey.data,
      { q1: 5, q3: 3, q4: 4 },
      "Restore default value on making panel visible"
    );
    survey.data = { q1: 1, q2: 2, q3: 3, q4: 4 };
    survey.pages[0].visible = false;
    assert.deepEqual(survey.data, { q4: 4 }, "Clear values on clearing page");
    survey.pages[0].visible = true;
    assert.deepEqual(
      survey.data,
      { q1: 5, q4: 4 },
      "Restore default value on making page visbile"
    );
  }
);

QUnit.test("Add this.question into custom function for validators", function (
  assert
) {
  var hasQuestion = false;
  FunctionFactory.Instance.register("getCustValue", function getCustValue(
    params
  ) {
    hasQuestion = !!this.question;
    return this.question.value;
  });
  var survey = new SurveyModel({
    elements: [
      {
        name: "q1",
        type: "text",
        validators: [{ type: "expression", expression: "getCustValue() > 5" }],
      },
    ],
  });
  var q1 = survey.getQuestionByName("q1");
  q1.value = 3;
  assert.equal(q1.hasErrors(), true, "value < 5");
  assert.equal(hasQuestion, true, "this.question is not undefined");
  q1.value = 10;
  assert.equal(q1.hasErrors(), false, "value > 5");
  FunctionFactory.Instance.unregister("getCustValue");
  assert.equal(hasQuestion, true, "this.question is not undefined#2");
});
QUnit.test("Peform triggers on value changed manually", function (assert) {
  var survey = new SurveyModel({
    elements: [
      {
        name: "q1",
        type: "text",
      },
      {
        name: "q2",
        type: "text",
      },
      {
        name: "q3",
        type: "text",
      },
      {
        name: "q4",
        type: "text",
      },
    ],
    triggers: [
      {
        type: "copyvalue",
        expression: "{q1} notempty",
        setToName: "q2",
        fromName: "q1",
      },
      {
        type: "runexpression",
        expression: "{q2} notempty",
        setToName: "q3",
        runExpression: "{q1} + {q2}",
      },
      {
        type: "runexpression",
        expression: "{q3} notempty",
        setToName: "q4",
        runExpression: "{q3} + {q3}",
      },
    ],
  });
  survey.data = { q1: 5 };
  survey.runTriggers();
  assert.deepEqual(
    survey.data,
    { q1: 5, q2: 5, q3: 10, q4: 20 },
    "Triggers run successful"
  );
});
QUnit.test("Run expression for date", function (assert) {
  var survey = new SurveyModel({
    elements: [
      {
        name: "q1",
        type: "text",
      },
      {
        name: "q2",
        type: "text",
        inputType: "date"
      }
    ],
    triggers: [
      {
        type: "runexpression",
        expression: "{q1} notempty",
        setToName: "q2",
        runExpression: "today()",
      }
    ],
  });
  const val = Helpers.convertDateToString(new Date());
  survey.setValue("q1", 1);
  assert.equal(survey.getValue("q2"), val, "Set correct date on trigger");
});

QUnit.test("Update progressText on changing locale, Bug#2453", function (
  assert
) {
  var survey = new SurveyModel();
  survey.addPage(createPageWithQuestion("Page 1"));
  survey.addPage(createPageWithQuestion("Second page", "q2"));
  assert.equal(survey.progressText, "Page 1 of 2", "in en");
  var oldLocale = survey.locale;
  survey.locale = "de";
  assert.equal(survey.progressText, "Seite 1 von 2", "in de");
  survey.locale = oldLocale;
});
QUnit.test("Update preview edit button on changing locale, Bug#6523", function (
  assert
) {
  var survey = new SurveyModel({
    elements: [
      { type: "text", name: "q1" }
    ]
  });
  survey.showPreview();
  const panel = <PanelModel>survey.currentPage.elements[0];
  assert.equal(survey.locEditText.textOrHtml, "Edit", "Edit - en");
  const editAction = panel.getFooterToolbar().getActionById("cancel-preview");
  assert.equal(editAction.locTitle.textOrHtml, "Edit", "Action - en");
  survey.locale = "de";
  assert.equal(survey.locEditText.textOrHtml, "Bearbeiten", "Edit - de");
  assert.equal(editAction.locTitle.textOrHtml, "Bearbeiten", "Action - de");
  survey.locale = "";
});
QUnit.test(
  "Focus question on Survey onServerValidateQuestions event, Bug#2464",
  function (assert) {
    var focusedQuestionId = "";
    var oldFunc = SurveyElement.FocusElement;
    SurveyElement.FocusElement = function (elId: string): boolean {
      focusedQuestionId = elId;
      return true;
    };

    var survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1", isRequired: true },
        { type: "text", name: "q2" },
      ],
    });
    survey.onServerValidateQuestions.add(function (sender, options) {
      options.errors["q2"] = "error";
      options.complete();
    });
    survey.tryComplete();
    assert.equal(
      survey.getQuestionByName("q1").inputId,
      focusedQuestionId,
      "q1 is required"
    );
    survey.setValue("q1", "val1");
    focusedQuestionId = "";
    survey.tryComplete();
    assert.equal(
      survey.getQuestionByName("q2").inputId,
      focusedQuestionId,
      "q2 has error"
    );
    SurveyElement.FocusElement = oldFunc;
  }
);
QUnit.test(
  "Focus question on Survey onServerValidateQuestions event, Bug#3343",
  function (assert) {
    var focusedQuestionId = "";
    var oldFunc = SurveyElement.FocusElement;
    SurveyElement.FocusElement = function (elId: string): boolean {
      focusedQuestionId = elId;
      return true;
    };
    var returnResult: (res: any) => void;
    function asyncFunc(params: any): any {
      returnResult = this.returnResult;
      return false;
    }
    FunctionFactory.Instance.register("asyncFunc", asyncFunc, true);
    var survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1", isRequired: true },
        {
          type: "text", name: "q2",
          validators: [
            {
              type: "expression",
              text: "Error!!!",
              expression: "asyncFunc() = 1",
            },
          ],
        },
      ],
    });
    survey.tryComplete();
    returnResult(0);
    assert.equal(
      survey.getQuestionByName("q1").inputId,
      focusedQuestionId,
      "q1 is required"
    );
    survey.setValue("q1", "val1");
    focusedQuestionId = "";
    survey.tryComplete();
    returnResult(0);
    assert.equal(
      survey.getQuestionByName("q2").inputId,
      focusedQuestionId,
      "q2 has error"
    );
    SurveyElement.FocusElement = oldFunc;
  }
);
QUnit.test("Async function with negative result, Bug#7268",
  function (assert) {
    let returnResult: (res: any) => void = (res: any): void => {
      res = false;
    };
    function asyncFunc(params: any): any {
      returnResult = this.returnResult;
      return false;
    }
    FunctionFactory.Instance.register("asyncFunc", asyncFunc, true);
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1", isRequired: true },
        {
          type: "text", name: "q2", visibleIf: "!asyncFunc({q1})"
        }
      ],
    });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    returnResult(true);
    assert.equal(q2.isVisible, false, "visible #1");
    q1.value = 1;
    returnResult(false);
    assert.equal(q2.isVisible, true, "visible #2");
    FunctionFactory.Instance.unregister("asyncFunc");
  }
);

QUnit.test(
  "Focus errored question when checkErrorsMode: `onComplete` + onServerValidateQuestions, Bug#2466",
  function (assert) {
    var focusedQuestionId = "";
    var oldFunc = SurveyElement.FocusElement;
    SurveyElement.FocusElement = function (elId: string): boolean {
      focusedQuestionId = elId;
      return true;
    };

    var survey = new SurveyModel({
      checkErrorsMode: "onComplete",
      pages: [
        {
          elements: [
            { type: "text", name: "q0" },
            { type: "text", name: "q1", isRequired: true },
          ],
        },
        {
          elements: [{ type: "text", name: "q2", isRequired: true }],
        },
        {
          elements: [{ type: "text", name: "q3", isRequired: true }],
        },
      ],
    });
    survey.nextPage();
    survey.nextPage();
    survey.tryComplete();
    survey.afterRenderPage(<HTMLElement>{});
    assert.equal(survey.currentPageNo, 0, "The first page is active");
    assert.equal(
      survey.getQuestionByName("q1").inputId,
      focusedQuestionId,
      "q1 is required and q0 is not"
    );
    SurveyElement.FocusElement = oldFunc;
  }
);
QUnit.test(
  "Focus errored question when checkErrorsMode: `onComplete` + , Bug#2478",
  function (assert) {
    var focusedQuestionId = "";
    var oldFunc = SurveyElement.FocusElement;
    SurveyElement.FocusElement = function (elId: string): boolean {
      focusedQuestionId = elId;
      return true;
    };

    var survey = new SurveyModel({
      checkErrorsMode: "onComplete",
      pages: [
        {
          elements: [
            { type: "text", name: "q0" },
            { type: "text", name: "q1" },
          ],
        },
        {
          elements: [{ type: "text", name: "q2" }],
        },
        {
          elements: [{ type: "text", name: "q3" }],
        },
      ],
    });
    var q1Value = null;
    survey.onServerValidateQuestions.add(function (sender, options) {
      options.errors["q1"] = "error";
      q1Value = options.data["q1"];
      options.complete();
    });

    survey.setValue("q1", "val1");
    survey.nextPage();
    assert.equal(survey.currentPageNo, 1, "Allow to go the second page");
    survey.nextPage();
    assert.equal(survey.currentPageNo, 2, "Allow to go the third page");
    survey.tryComplete();
    assert.equal(survey.currentPageNo, 0, "The first page is active");
    assert.equal(q1Value, "val1", "options.data set correctly");
    assert.equal(
      survey.getQuestionByName("q1").inputId,
      focusedQuestionId,
      "q1 is required and q0 is not"
    );
    SurveyElement.FocusElement = oldFunc;
  }
);
QUnit.test("Focus errored question when checkErrorsMode: `onComplete` & panel required", function (assert) {
  var focusedQuestionId = "";
  const oldFunc = SurveyElement.FocusElement;
  SurveyElement.FocusElement = function (elId: string): boolean {
    focusedQuestionId = elId;
    return true;
  };
  const survey = new SurveyModel({
    checkErrorsMode: "onComplete",
    pages: [
      {
        elements: [
          {
            type: "panel", name: "panel1", isRequired: true,
            elements: [{ type: "text", name: "q1" }]
          }
        ],
      },
      {
        elements: [{ type: "text", name: "q2" }],
      },
      {
        elements: [{ type: "text", name: "q3" }],
      },
    ],
  });
  survey.nextPage();
  survey.nextPage();
  survey.tryComplete();
  assert.equal(survey.currentPageNo, 0, "comeback to the first page");
  assert.equal(survey.getQuestionByName("q1").inputId, focusedQuestionId, "panel is required");
  SurveyElement.FocusElement = oldFunc;
});
QUnit.test("Do not focus errored question when checkErrorsMode: `onComplete` + focusOnFirstError = false, Bug#8322", function (assert) {
  var focusedQuestionId = "";
  const oldFunc = SurveyElement.FocusElement;
  SurveyElement.FocusElement = function (elId: string): boolean {
    focusedQuestionId = elId;
    return true;
  };

  const survey = new SurveyModel({
    checkErrorsMode: "onComplete",
    focusOnFirstError: false,
    pages: [
      {
        elements: [
          { type: "text", name: "q0" },
          { type: "text", name: "q1", isRequired: true },
        ],
      },
      {
        elements: [{ type: "text", name: "q2", isRequired: true }],
      },
      {
        elements: [{ type: "text", name: "q3", isRequired: true }],
      },
    ],
  });
  survey.nextPage();
  survey.nextPage();
  focusedQuestionId = "";
  survey.tryComplete();
  survey.afterRenderPage(<HTMLElement>{});
  assert.equal(survey.currentPageNo, 0, "The first page is active");
  assert.notOk(focusedQuestionId, "do not focus any question");
  SurveyElement.FocusElement = oldFunc;
});
QUnit.test(
  "onServerValidateQuestions doesn't get called for the last page when showPreviewBeforeComplete is set, Bug#2546",
  function (assert) {
    var survey = new SurveyModel({
      pages: [
        {
          name: "page1",
          elements: [
            {
              type: "boolean",
              name: "question1",
            },
          ],
        },
        {
          name: "page2",
          elements: [
            {
              type: "boolean",
              name: "question2",
            },
          ],
        },
        {
          name: "page3",
          elements: [
            {
              type: "boolean",
              name: "question3",
            },
          ],
        },
      ],
      showPreviewBeforeComplete: "showAllQuestions",
    });
    var counter = 0;
    var generateError = false;
    survey.onServerValidateQuestions.add(function (sender, options) {
      counter++;
      if (generateError) {
        options.errors["question3"] = "We have error here";
      }
      options.complete();
    });

    survey.nextPage();
    survey.nextPage();
    assert.equal(counter, 2, "Counter calls 2 times");
    survey.showPreview();
    assert.equal(counter, 3, "Counter calls 3 times");
    assert.equal(survey.state, "preview", "We are in preview state");
    survey.cancelPreview();
    generateError = true;
    survey.showPreview();
    assert.equal(counter, 4, "Counter calls 4 times");
    assert.equal(survey.state, "running", "We have an error");
  }
);
QUnit.test("Several onServerValidateQuestions event, bug#4531",
  function (assert) {
    var survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2" },
      ],
    });
    survey.onServerValidateQuestions.add((sender, options) => {
      options.complete();
    });
    survey.onServerValidateQuestions.add((sender, options) => {
      options.errors["q2"] = "error";
      options.complete();
    });
    survey.tryComplete();
    assert.equal(survey.state, "running", "Survey is not completed");
    assert.equal(survey.getQuestionByName("q2").errors.length, 1, "There is an error in the question");
  }
);
QUnit.test("Several onServerValidateQuestions event without errors, bug#4531 part2",
  function (assert) {
    var survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2" },
      ],
    });
    survey.onServerValidateQuestions.add((sender, options) => {
      options.complete();
    });
    survey.onServerValidateQuestions.add((sender, options) => {
      options.complete();
    });
    survey.tryComplete();
    assert.equal(survey.state, "completed", "Survey is completed");
  }
);
QUnit.test(
  "showPreviewBeforeComplete: 'showAllQuestions' and showProgressBar, Bug#2552",
  function (assert) {
    var survey = new SurveyModel({
      pages: [
        {
          name: "page1",
          elements: [
            {
              type: "boolean",
              name: "question1",
            },
          ],
        },
        {
          name: "page2",
          elements: [
            {
              type: "boolean",
              name: "question2",
            },
          ],
        },
        {
          name: "page3",
          elements: [
            {
              type: "boolean",
              name: "question3",
            },
          ],
        },
      ],
      showPreviewBeforeComplete: "showAllQuestions",
      showProgressBar: "bottom",
    });
    survey.nextPage();
    survey.nextPage();
    assert.equal(
      survey.isShowProgressBarOnBottom,
      true,
      "We need to show progress bar"
    );
    survey.showPreview();
    assert.equal(
      survey.isShowProgressBarOnBottom,
      false,
      "We don't need to show progress bar"
    );
    survey.cancelPreview();
    assert.equal(
      survey.isShowProgressBarOnBottom,
      true,
      "We need to show progress bar again"
    );
  }
);
QUnit.test(
  "Update currentPage on showing the only page, Bug#2496",
  function (assert) {
    var survey = new SurveyModel({
      pages: [
        {
          name: "page1",
          elements: [
            {
              type: "panel",
              name: "panel1",
              elements: [
                {
                  type: "text",
                  name: "question1",
                },
              ],
              visible: false,
            },
          ],
        },
      ],
    });
    assert.notOk(
      survey.getPropertyValue("currentPage"),
      "currentPage is not set"
    );
    (<PanelModel>survey.getPanelByName("panel1")).visible = true;
    assert.ok(
      survey.getPropertyValue("currentPage"),
      "currentPage is the only page"
    );
  }
);

QUnit.test("Expand question on validation error", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("page1");
  var q1 = page.addNewQuestion("text", "q1");
  q1.isRequired = true;
  q1.collapse();
  assert.equal(q1.isCollapsed, true, "Question1 is collapsed");
  q1.hasErrors(true, true);
  assert.equal(q1.isCollapsed, false, "Question1 is not collapsed");
  assert.equal(q1.isExpanded, true, "Question1 is expanded");
});

QUnit.test("Do not show empty required text", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("page1");
  var q1 = page.addNewQuestion("text", "q1");
  q1.isRequired = true;
  assert.equal(q1.isRequireTextBeforeTitle, false, "numTitleRequire - No required text before");
  assert.equal(q1.isRequireTextAfterTitle, true, "numTitleRequire - Required text after");
  survey.questionTitlePattern = "numRequireTitle";
  assert.equal(q1.isRequireTextBeforeTitle, true, "numRequireTitle - Required text before");
  assert.equal(q1.isRequireTextAfterTitle, false, "numRequireTitle - No required text after");
  survey.requiredMark = "";
  assert.equal(q1.isRequireTextBeforeTitle, false, "numRequireTitle - No required text before ''");
  assert.equal(q1.isRequireTextAfterTitle, false, "numRequireTitle - No required text after ''");
  survey.questionTitlePattern = "numTitleRequire";
  assert.equal(q1.isRequireTextBeforeTitle, false, "numTitleRequire - No required text before ''");
  assert.equal(q1.isRequireTextAfterTitle, false, "numTitleRequire - No required text after ''");
});

QUnit.test("Check onGetPanelTitleActions event", (assert) => {
  var survey = new SurveyModel({
    elements: [
      {
        type: "panel",
        name: "panel1",
      },
    ],
  });
  var panel = <PanelModel>survey.getPanelByName("panel1");
  var testActions = [{ title: "simple" }, { title: "simple2" }];
  survey.onGetPanelTitleActions.add((sender, options) => {
    options.titleActions = testActions;
  });
  assert.deepEqual(panel.getTitleActions(), testActions);
});

QUnit.test("Check onGetQuestionTitleActions event", (assert) => {
  var survey = new SurveyModel({
    elements: [
      {
        type: "text",
        name: "text1",
      },
    ],
  });
  var testActions = [{ title: "simple" }, { title: "simple2" }];
  survey.onGetQuestionTitleActions.add((sender, options) => {
    options.actions = testActions;
  });
  var question = <Question>survey.getQuestionByName("text1");
  assert.deepEqual(question.getTitleActions(), testActions);
});

QUnit.test("Check onGetPageTitleActions event", (assert) => {
  var survey = new SurveyModel({
    pages: [{ title: "Page Title" }],
  });
  var testActions = [{ title: "simple" }, { title: "simple2" }];
  survey.onGetPageTitleActions.add((sender, options) => {
    options.titleActions = testActions;
  });
  var page = <PageModel>survey.pages[0];
  assert.deepEqual(page.getTitleActions(), testActions);
});
QUnit.test(
  "Stackoverflow error, https://surveyjs.answerdesk.io//ticket/details/T6023, Bug#2598",
  (assert) => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "boolean",
          name: "q1",
        },
        {
          type: "matrixdynamic",
          name: "q2",
          columns: [
            {
              name: "q3",
              visibleIf: "{q1} = true",
            },
          ],
          rowCount: 1,
        },
      ],
      progressBarType: "buttons",
    });
    assert.ok(survey.getQuestionByName("q1"), "Do not produce stack-overflow");
  }
);
QUnit.test(
  "Do not create otherItem in image picker on loading it from JSON, even if hasOther is true, Bug#2603",
  (assert) => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "radiogroup",
          name: "q1",
          hasOther: true,
          choices: ["item1", "item2", "item3"],
        },
      ],
    });
    var q1 = <QuestionRadiogroupModel>survey.getQuestionByName("q1");
    assert.equal(q1.visibleChoices.length, 4, "There are 4 items");
    var json = q1.toJSON();
    var q2 = new QuestionImagePickerModel("q2");
    q2.fromJSON(json);
    assert.equal(q2.visibleChoices.length, 3, "There are 3 items");
  }
);

QUnit.test("onTextRenderAs event", function (assert) {
  var survey = new SurveyModel();
  const questionName = "any question";
  var locString = new LocalizableString(survey, false, "name");

  var renderAs = survey.getRenderer(questionName);
  assert.equal(locString.renderAs, LocalizableString.defaultRenderer);
  assert.equal(renderAs, undefined);

  survey.setDesignMode(true);
  renderAs = survey.getRenderer(questionName);
  assert.equal(locString.renderAs, LocalizableString.editableRenderer);
  assert.equal(renderAs, LocalizableString.editableRenderer);

  survey.setDesignMode(false);
  renderAs = survey.getRenderer(questionName);
  assert.equal(locString.renderAs, LocalizableString.defaultRenderer);
  assert.equal(renderAs, undefined);

  const customRendererView = "my-custom-renderer-view";
  const customRendererEdit = "my-custom-renderer-edit";
  survey.onTextRenderAs.add((s, e) => {
    if (s.isDesignMode) e.renderAs = customRendererEdit;
    else e.renderAs = customRendererView;
  });

  renderAs = survey.getRenderer(questionName);
  assert.equal(locString.renderAs, customRendererView);
  assert.equal(renderAs, customRendererView);

  survey.setDesignMode(true);
  renderAs = survey.getRenderer(questionName);
  assert.equal(locString.renderAs, customRendererEdit);
  assert.equal(renderAs, customRendererEdit);

  survey.setDesignMode(false);
  renderAs = survey.getRenderer(questionName);
  assert.equal(locString.renderAs, customRendererView);
  assert.equal(renderAs, customRendererView);
});
QUnit.test("onElementWrapperComponentName event vs string getRenderer", function (assert) {
  const survey = new SurveyModel();
  const questionName = "any question";
  const locString = new LocalizableString(survey, false, "name");

  let renderAs = survey.getRenderer(questionName);

  const customRendererView = "my-custom-renderer-view";
  const customRendererEdit = "my-custom-renderer-edit";
  survey.onElementWrapperComponentName.add((s, e) => {
    if (e.wrapperName !== "string") return;
    if (s.isDesignMode) e.componentName = customRendererEdit;
    else e.componentName = customRendererView;
  });

  renderAs = survey.getRenderer(questionName);
  assert.equal(locString.renderAs, customRendererView);
  assert.equal(renderAs, customRendererView);

  survey.setDesignMode(true);
  renderAs = survey.getRenderer(questionName);
  assert.equal(locString.renderAs, customRendererEdit);
  assert.equal(renderAs, customRendererEdit);

  survey.setDesignMode(false);
  renderAs = survey.getRenderer(questionName);
  assert.equal(locString.renderAs, customRendererView);
  assert.equal(renderAs, customRendererView);
});
QUnit.test("onElementWrapperComponentData event vs getRendererContextForString", function (assert) {
  const survey = new SurveyModel();
  survey.addNewPage("page1");
  const locString = new LocalizableString(survey, false, "name");

  survey.onElementWrapperComponentData.add((s, e) => {
    if (e.wrapperName !== "string") return;
    e.data = { str: e.data, el: e.element };
  });
  const res = survey.getRendererContextForString(survey.pages[0], locString);
  assert.equal(res.str.name, "name", "string is correct");
  assert.equal(res.el.name, "page1", "element is correct");
});

QUnit.test("Make inputs read-only in design-mode for V2", function (assert) {
  var survey = new SurveyModel();
  survey.setDesignMode(true);
  survey.fromJSON({
    elements: [
      { type: "text", name: "q1" },
      {
        type: "panel",
        name: "panel1",
        elements: [{ type: "text", name: "q2" }],
      },
    ],
  });
  assert.equal(survey.getQuestionByName("q1").isInputReadOnly, true, "q1");
  assert.equal(survey.getQuestionByName("q2").isInputReadOnly, true, "q2");
});

QUnit.test("forceIsInputReadOnly", function (assert) {
  const survey = new SurveyModel();
  survey.setDesignMode(true);
  survey.fromJSON({
    elements: [
      { type: "text", name: "q1" },
      {
        type: "panel",
        name: "panel1",
        elements: [{ type: "text", name: "q2" }],
      },
    ],
  });
  assert.equal(survey.getQuestionByName("q1").isInputReadOnly, true, "q1");
  assert.equal(survey.getQuestionByName("q2").isInputReadOnly, true, "q2");

  survey.getQuestionByName("q2").forceIsInputReadOnly = false;
  assert.equal(survey.getQuestionByName("q1").isInputReadOnly, true, "q1");
  assert.equal(survey.getQuestionByName("q2").isInputReadOnly, false, "q2 with forceIsInputReadOnly");
});

QUnit.test("onElementContentVisibilityChanged event", function (assert) {
  var json = {
    pages: [
      {
        name: "page1",
        elements: [
          {
            type: "panel",
            name: "panel1",
            state: "collapsed",
          },
        ],
      },
    ],
  };

  let stateChangedCounter = 0;

  var survey = new SurveyModel(json);
  survey.onElementContentVisibilityChanged.add((s, e) => {
    stateChangedCounter++;
  });
  assert.equal(stateChangedCounter, 0);

  var panel: PanelModel = <PanelModel>survey.getAllPanels()[0];
  panel.expand();
  assert.equal(stateChangedCounter, 1);
  panel.expand();
  assert.equal(stateChangedCounter, 1);
  panel.collapse();
  assert.equal(stateChangedCounter, 2);
  panel.collapse();
  assert.equal(stateChangedCounter, 2);
  panel.toggleState();
  assert.equal(stateChangedCounter, 3);
  panel.toggleState();
  assert.equal(stateChangedCounter, 4);
  panel.state = "expanded";
  assert.equal(stateChangedCounter, 5);
});

QUnit.test("base.survey property", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("page1");
  var panel = page.addNewPanel("panel1");
  var question = page.addNewQuestion("text", "q1");
  survey.calculatedValues.push(new CalculatedValue("var1"));
  survey.triggers.push(new SurveyTriggerComplete());
  question.validators.push(new ExpressionValidator(""));
  var matrixDynamic = new QuestionMatrixDynamicModel("matrixdynamic1");
  matrixDynamic.addColumn("col1");
  matrixDynamic.columns[0].choices = [1, 2];
  panel.addElement(matrixDynamic);
  var matrix = new QuestionMatrixModel("matrix1");
  matrix.rows = [1, 2];
  matrix.columns = [1, 2];
  page.addElement(matrix);
  var matrixDropdown = new QuestionMatrixDropdownModel("matrixDropdown1");
  matrixDropdown.rows = [1, 2];
  page.addElement(matrixDropdown);
  var mutlipleText = new QuestionMultipleTextModel("multipletext1");
  mutlipleText.addItem("item1");
  page.addElement(mutlipleText);
  var dropdown = new QuestionDropdownModel("dropdown1");
  page.addElement(dropdown);

  assert.equal(page.survey.state, "running");
  assert.equal(panel.survey.state, "running");
  assert.equal(question.survey.state, "running");
  assert.equal(survey.calculatedValues[0].getSurvey().state, "running");
  assert.equal(survey.triggers[0].getSurvey().state, "running");
  assert.equal(question.validators[0].getSurvey().state, "running");
  assert.equal(matrixDynamic.columns[0].getSurvey().state, "running");
  assert.equal(matrix.rows[0].getSurvey().state, "running");
  assert.equal(matrix.columns[0].getSurvey().state, "running");
  assert.equal(matrixDropdown.rows[0].getSurvey().state, "running");
  assert.equal(
    matrixDynamic.columns[0].templateQuestion.survey.state,
    "running"
  );
  assert.equal(
    matrixDynamic.columns[0].choices[0].getSurvey().state,
    "running"
  );
  assert.equal(mutlipleText.items[0].getSurvey().state, "running");
  assert.equal(dropdown.choicesByUrl.getSurvey().state, "running");
});

QUnit.test("base.getSurvey(live) on removing/adding", function (assert) {
  var survey = new SurveyModel({
    requiredMark: "ok",
    pages: [
      {
        name: "page1",
        elements: [
          {
            type: "text",
            name: "question1",
          },
          {
            type: "matrixdynamic",
            name: "question2",
            columns: [{ name: "col1" }, { name: "col2" }],
          },
          {
            type: "panel",
            name: "panel1",
            elements: [{ type: "text", name: "question3" }],
          },
        ],
      },
      {
        name: "page2",
      },
    ],
  });
  var page1 = survey.pages[0];
  var page2 = survey.pages[1];
  var question1 = survey.getQuestionByName("question1");
  var question2 = survey.getQuestionByName("question2");
  var question3 = survey.getQuestionByName("question3");
  var panel1 = <PanelModel>survey.getPanelByName("panel1");
  var column1 = question2.columns[0];
  var column2 = question2.columns[1];
  var hasSurvey = (obj: Base): string => {
    return !!obj.getSurvey(true) ? "ok" : "";
  };
  assert.ok(hasSurvey(page2), "Page2 is not deleted");
  page2.delete();
  assert.notOk(hasSurvey(page2), "Page2 is deleted");

  assert.ok(hasSurvey(panel1), "panel1 is not deleted");
  assert.ok(hasSurvey(question3), "question3 is not deleted");
  panel1.delete();
  assert.notOk(hasSurvey(panel1), "panel1 is deleted");
  assert.notOk(hasSurvey(question3), "question3 is deleted");

  assert.ok(hasSurvey(question1), "question1 is not deleted");
  question1.delete();
  assert.notOk(hasSurvey(question1), "question1 is deleted");

  assert.ok(hasSurvey(column1), "column11 is not deleted");
  question2.columns.splice(0, 1);
  assert.notOk(hasSurvey(column1), "column1 is deleted");

  assert.ok(hasSurvey(question2), "question2 is not deleted");
  assert.ok(hasSurvey(column2), "column2 is not deleted");
  survey.pages.splice(0, 1);
  assert.notOk(hasSurvey(page1), "Page1 is deleted");
  assert.notOk(hasSurvey(question2), "question2 is deleted");
  assert.notOk(hasSurvey(column2), "column2 is deleted");
  survey.pages.push(page1);
  assert.ok(hasSurvey(page1), "Page1 is not deleted again");
  assert.ok(hasSurvey(question2), "question2 is not deleted again");
  assert.ok(hasSurvey(column2), "column2 is not deleted again");
});
QUnit.test("Dispose object during event", function (assert) {
  var survey = new SurveyModel();
  survey.onValueChanged.add(() => {
    survey.dispose();
  });
  var a = 1;
  survey.onValueChanged.add(() => {
    a = 2;
  });
  survey.setValue("b", 1);
  assert.equal(a, 1, "Do not call an event that is after diposing");
});
QUnit.test("survey.isLazyRendering", function (assert) {
  var survey = new SurveyModel();
  assert.equal(survey.isLazyRendering, false, "Not set");
  settings.lazyRowsRendering = true;
  assert.equal(survey.isLazyRendering, true, "set in settings");
  settings.lazyRowsRendering = false;
  assert.equal(survey.isLazyRendering, false, "Not set 2");
  survey.lazyRenderEnabled = true;
  assert.equal(survey.isLazyRendering, true, "set in survey");
});
QUnit.test("getSize", function (assert) {
  assert.equal(getRenderedSize("300px"), 300, "300px");
  assert.equal(getRenderedStyleSize("300px"), undefined, "300px");
  assert.equal(getRenderedSize("100%"), undefined, "100%");
  assert.equal(getRenderedStyleSize("100%"), "100%", "300px");
  assert.equal(getRenderedSize(100), 100, "100px");
  assert.equal(getRenderedStyleSize(100), undefined, "100");
});
QUnit.test("survey logo size", function (assert) {
  var survey = new SurveyModel();
  assert.equal(survey.logoWidth, "auto", "auto");
  assert.equal(survey.logoHeight, "40px", "40px");
  assert.equal(survey.renderedLogoWidth, undefined);
  assert.equal(survey.renderedLogoHeight, 40);
  assert.equal(survey.renderedStyleLogoWidth, "auto");
  assert.equal(survey.renderedStyleLogoHeight, undefined);
  survey.logoWidth = "100%";
  survey.logoHeight = "auto";
  assert.equal(survey.logoWidth, "100%", "100%");
  assert.equal(survey.renderedLogoWidth, undefined);
  assert.equal(survey.renderedLogoHeight, undefined);
  assert.equal(survey.renderedStyleLogoWidth, "100%");
  assert.equal(survey.renderedStyleLogoHeight, "auto");
});
QUnit.test("element.searchText()", function (assert) {
  var survey = new SurveyModel({
    pages: [
      {
        name: "page1",
        title: "My Page 1",
        elements: [
          {
            type: "text",
            name: "question1",
          },
          {
            type: "checkbox",
            name: "question2",
            title: "My checkbox",
            choices: ["item1", { value: "item2", text: "Item2" }],
          },
          {
            type: "dropdown",
            name: "question3",
            title: "Dropdown",
            choices: ["item1", { value: "item2", text: "Item2" }],
          },
          {
            type: "matrixdropdown",
            name: "question4",
            columns: [{ name: "col1" }, { name: "col2", title: "Column 1" }],
            rows: ["row1", { value: "row2", text: "Row 2" }],
          },
          {
            type: "panel",
            name: "panel1",
            title: "My panel",
            elements: [{ type: "text", name: "question5" }],
          },
        ],
      },
      {
        name: "page2",
      },
    ],
  });
  var findRes = survey.searchText("ques");
  assert.equal(findRes.length, 3, "Find by question title/name");
  findRes = survey.searchText("My");
  assert.equal(findRes.length, 3, "Find by element title");
  findRes = survey.searchText("");
  assert.equal(findRes.length, 0, "Empty string returns nothing");
  findRes = survey.searchText("my");
  assert.equal(findRes.length, 3, "Find by element title, we ignore cases");
  findRes = survey.searchText("item");
  assert.equal(findRes.length, 2, "Find choices");
  assert.equal(findRes[1].element["name"], "question2", "Find choices");
});
QUnit.test("send notification on setLocale change for survey.title", function (
  assert
) {
  var survey = new SurveyModel();
  var newValue;
  survey.onPropertyChanged.add((sender, options) => {
    newValue = options.newValue;
  });
  survey.locTitle.setLocaleText("", "new title");
  assert.equal(survey.title, "new title", "survey title is correct");
  assert.equal(newValue, "new title", "we send notification");
});
QUnit.test("send notification on setLocale change for survey.dataList", function (
  assert
) {
  var survey = new SurveyModel({
    elements: [
      { type: "text", name: "q1", dataList: ["Item 1", "Item 2"] }
    ]
  });
  const q1 = <QuestionTextModel>survey.getAllQuestions()[0];
  var oldValue;
  var newValue;
  q1.onPropertyChanged.add((sender, options) => {
    oldValue = options.oldValue;
    newValue = options.newValue;
  });
  q1.locDataList.setLocaleText("", "Item 1\nItem 2\nItem 3");
  assert.deepEqual(q1.dataList, ["Item 1", "Item 2", "Item 3"], "question dataList is correct");
  assert.deepEqual(newValue, { default: ["Item 1", "Item 2", "Item 3"] }, "we send notification");
  assert.deepEqual(oldValue, { default: ["Item 1", "Item 2"] }, "old Value is correct");
});

QUnit.test(
  "onAfterRenderPage calls incorrect for the first page when there is the started page, Bug #",
  function (assert) {
    var survey = new SurveyModel({
      firstPageIsStartPage: true,
      pages: [
        {
          name: "Start Page",
          questions: [
            {
              type: "html",
              html: "1",
            },
          ],
        },
        {
          name: "First Page",
          questions: [
            {
              type: "text",
              name: "q1",
            },
          ],
        },
      ],
    });
    var pageName;
    survey.onAfterRenderPage.add((sender, options) => {
      pageName = options.page.name;
    });
    survey.afterRenderPage(undefined);
    assert.equal(pageName, "Start Page", "We render the started page");
    survey.start();
    survey.afterRenderPage(undefined);
    assert.equal(pageName, "First Page", "We render the first page");
  }
);
QUnit.test("Custom widget, test canShowInToolbox read-only property", function (
  assert
) {
  CustomWidgetCollection.Instance.clear();

  var readOnlyCounter = 0;
  var widget = CustomWidgetCollection.Instance.addCustomWidget({
    name: "first",
  });
  assert.equal(
    widget.canShowInToolbox,
    false,
    "widget is activated by property"
  );
  widget = CustomWidgetCollection.Instance.addCustomWidget(
    {
      name: "second",
    },
    "customtype"
  );
  assert.equal(
    widget.canShowInToolbox,
    true,
    "widget is activated by customtype"
  );
  var isLoaded = false;
  widget.widgetJson.widgetIsLoaded = (): boolean => {
    return isLoaded;
  };
  assert.equal(widget.canShowInToolbox, false, "widget is not loaded");
  isLoaded = true;
  assert.equal(widget.canShowInToolbox, true, "widget is loaded");
  widget.showInToolbox = false;
  assert.equal(widget.canShowInToolbox, false, "widget is not show in toolbox");
  widget.showInToolbox = true;
  assert.equal(widget.canShowInToolbox, true, "widget is show in toolbox");

  CustomWidgetCollection.Instance.clear();
});
QUnit.test("getElementWrapperComponentName", function (assert) {
  var survey = new SurveyModel();
  assert.deepEqual(
    survey.getElementWrapperComponentName(null),
    SurveyModel.TemplateRendererComponentName,
    "default component"
  );
  assert.deepEqual(
    survey.getElementWrapperComponentName(null, "logo-image"),
    "sv-logo-image",
    "logo-image default component"
  );
});
QUnit.test("getQuestionContentWrapperComponentName", function (assert) {
  var survey = new SurveyModel();
  assert.deepEqual(
    survey.getQuestionContentWrapperComponentName(null),
    SurveyModel.TemplateRendererComponentName,
    "default component"
  );
});
QUnit.test("onElementWrapperComponentName event", function (assert) {
  const survey = new SurveyModel({
    elements: [{ type: "text", name: "q1" }, { type: "checkbox", name: "q2", choices: [1, 2] }]
  });
  const q1 = survey.getQuestionByName("q1");
  const q2 = <QuestionCheckboxModel>survey.getQuestionByName("q2");
  survey.onElementWrapperComponentName.add((sender, options) => {
    if (options.wrapperName === "component" && options.reason === "test1") {
      options.componentName += "#1";
    }
    if (options.wrapperName === "content-component" && options.reason === undefined) {
      options.componentName += "#2";
    }
    if (options.wrapperName === "row" && !!options.element.setIsLazyRendering) {
      options.componentName += "#3";
    }
    if (options.wrapperName === "itemvalue" && options.item?.value === 1) {
      options.componentName += "#4";
    }
  });
  assert.equal(survey.getElementWrapperComponentName(q1, "test1"), "sv-template-renderer#1", "#1");
  assert.equal(survey.getQuestionContentWrapperComponentName(q1), "sv-template-renderer#2", "#2");
  assert.equal(survey.getRowWrapperComponentName(new QuestionRowModel(survey.pages[0])), "sv-template-renderer#3", "#3");
  assert.equal(survey.getItemValueWrapperComponentName(q2.choices[0], q2), "sv-template-renderer#4", "#4");
});
QUnit.test("onElementWrapperComponentName event", function (assert) {
  const survey = new SurveyModel({
    elements: [{ type: "text", name: "q1" }, { type: "checkbox", name: "q2", choices: [1, 2] },
      { type: "matrixdynamic", name: "q3", rowCount: 1, columns: [{ name: "col1" }] }
    ]
  });
  const q1 = survey.getQuestionByName("q1");
  const q2 = <QuestionCheckboxModel>survey.getQuestionByName("q2");
  const q3 = <QuestionMatrixDynamicModel>survey.getQuestionByName("q3");
  survey.onElementWrapperComponentData.add((sender, options) => {
    if (options.wrapperName === "component" && options.reason === "test1") {
      options.data = "#1";
    }
    if (options.wrapperName === "row" && !!options.element.setIsLazyRendering) {
      options.data = "#2";
    }
    if (options.wrapperName === "itemvalue" && options.item?.value === 1) {
      options.data = "#3";
    }
    if (options.wrapperName === "cell" && options.element.name === "col1") {
      options.data = "#4";
    }
  });
  assert.equal(survey.getElementWrapperComponentData(q1, "test1"), "#1", "#1");
  assert.equal(survey.getRowWrapperComponentData(new QuestionRowModel(survey.pages[0])), "#2", "#2");
  assert.equal(survey.getItemValueWrapperComponentData(q2.choices[0], q2), "#3", "#3");
  assert.equal(survey.getMatrixCellTemplateData(q3.visibleRows[0].cells[0]), "#4", "#4");
});
QUnit.test(
  "Skip trigger test and auto focus first question on the page",
  function (assert) {
    var focusedQuestions = [];
    var oldFunc = SurveyElement.FocusElement;
    SurveyElement.FocusElement = function (elId: string): boolean {
      focusedQuestions.push(elId);
      return true;
    };
    var survey = new SurveyModel({
      pages: [
        {
          name: "page1",
          elements: [
            {
              type: "radiogroup",
              name: "q1",
              choices: ["item1", "item2", "item3"],
            },
          ],
        },
        {
          name: "page2",
          elements: [
            {
              type: "text",
              name: "q2",
            },
            {
              type: "text",
              name: "q3",
            },
          ],
        },
      ],
      triggers: [
        {
          type: "skip",
          expression: "{q1} = 'item2'",
          gotoName: "q3",
        },
      ],
    });
    survey.onCurrentPageChanged.add((s, o) => {
      survey.afterRenderPage(undefined as any);
    });
    survey.getQuestionByName("q1").value = "item2";
    assert.equal(survey.currentPage.name, "page2", "We moved to another page");
    assert.equal(focusedQuestions.length, 1, "Only one question was focused");
    assert.equal(
      focusedQuestions[0],
      survey.getQuestionByName("q3").inputId,
      "The third question is focused"
    );
    SurveyElement.FocusElement = oldFunc;
  }
);

QUnit.test("Skip trigger test and navigate back", function (assert) {
  const survey = new SurveyModel({
    pages: [
      {
        name: "page1",
        elements: [
          {
            type: "radiogroup",
            name: "q1",
            choices: ["item1", "item2", "item3"],
          },
        ],
      },
      {
        name: "page2",
        elements: [
          {
            type: "text",
            name: "q2",
          }
        ],
      },
      {
        name: "page3",
        elements: [
          {
            type: "text",
            name: "q3",
          },
        ],
      },
    ],
    triggers: [
      {
        type: "skip",
        expression: "{q1} = 'item2'",
        gotoName: "q3",
      },
    ],
  });
  survey.getQuestionByName("q1").value = "item2";
  assert.equal(survey.currentPage.name, "page3", "We moved to another page");
  survey.prevPage();
  assert.equal(survey.currentPage.name, "page1", "We returned to first page skipping second");
  survey.getQuestionByName("q1").value = "item1";
  survey.nextPage();
  assert.equal(survey.currentPage.name, "page2", "We moved to second page");
  survey.nextPage();
  assert.equal(survey.currentPage.name, "page3", "We moved to third page");
  survey.prevPage();
  assert.equal(survey.currentPage.name, "page2", "We returned to second page");
});

QUnit.test("Two skip triggers test", function (assert) {
  var focusedQuestions: Array<string> = [];
  var oldFunc = SurveyElement.FocusElement;
  SurveyElement.FocusElement = function (elId: string): boolean {
    focusedQuestions.push(elId);
    return true;
  };
  var survey = new SurveyModel({
    elements: [
      {
        type: "radiogroup",
        name: "q1",
        choices: ["item1", "item2", "item3"],
      },
      {
        type: "text",
        name: "q2"
      },
      {
        type: "text",
        name: "q3",
        enableIf: "{q1} = 'item3'"
      }
    ],
    triggers: [
      {
        type: "skip",
        expression: "{q1} = 'item2'",
        gotoName: "q2",
      },
      {
        type: "skip",
        expression: "{q1} = 'item3'",
        gotoName: "q3",
      },
    ],
  });
  survey.getQuestionByName("q1").value = "item2";
  assert.equal(focusedQuestions.length, 1, "First skip");
  assert.equal(
    focusedQuestions[0],
    survey.getQuestionByName("q2").inputId,
    "The second question is focused"
  );
  survey.getQuestionByName("q1").value = "item3";
  assert.equal(focusedQuestions.length, 2, "Second skip");
  assert.equal(
    focusedQuestions[1],
    survey.getQuestionByName("q3").inputId,
    "The third question is focused"
  );
  SurveyElement.FocusElement = oldFunc;
});
QUnit.test("Skip trigger and 'other' value", function (assert) {
  const survey = new SurveyModel({
    pages: [
      {
        name: "page1",
        elements: [
          {
            type: "radiogroup",
            name: "q1",
            showOtherItem: true,
            choices: ["item1", "item2", "item3"],
          },
        ],
      },
      {
        name: "page2",
        elements: [
          {
            type: "text",
            name: "q2",
          }
        ],
      },
      {
        name: "page3",
        elements: [
          {
            type: "text",
            name: "q3",
          },
        ],
      },
    ],
    triggers: [
      {
        type: "skip",
        expression: "{q1} = 'other'",
        gotoName: "q3",
      },
    ],
  });
  survey.getQuestionByName("q1").value = "other";
  assert.equal(survey.currentPage.name, "page1", "We are still on the first page");
  survey.getQuestionByName("q1").comment = "abc";
  assert.equal(survey.currentPage.name, "page3", "We moved to another page");
});
QUnit.test(
  "Test SurveyElement isPage, isPanel and isQuestion properties",
  function (assert) {
    var survey = new SurveyModel({
      elements: [
        {
          type: "panel",
          name: "panel",
          elements: [
            {
              type: "text",
              name: "question",
            },
          ],
        },
      ],
    });
    var page = survey.currentPage;
    var panel = <PanelModel>survey.getPanelByName("panel");
    var question = survey.getQuestionByName("question");
    assert.equal(page.isPage, true, "Page is page");
    assert.equal(page.isPanel, false, "Page is not panel");
    assert.equal(page.isQuestion, false, "Page is not question");
    assert.equal(panel.isPage, false, "Panel is not page");
    assert.equal(panel.isPanel, true, "Panel is panel");
    assert.equal(panel.isQuestion, false, "Panel is not question");
    assert.equal(question.isPage, false, "Question is not page");
    assert.equal(question.isPanel, false, "Question is not panel");
    assert.equal(question.isQuestion, true, "Question is question");
  }
);
QUnit.test("Test survey renderedHasTitle/renderedHasLogo properties", function (
  assert
) {
  var survey = new SurveyModel();
  assert.equal(
    survey["titleIsEmpty"],
    true,
    "titleIsEmpty due to no title"
  );
  assert.equal(
    survey.renderedHasHeader,
    false,
    "hasHeader, title and logo are invisible"
  );
  assert.equal(survey.renderedHasTitle, false, "There is not title");
  survey.title = "title";
  assert.equal(
    survey["titleIsEmpty"],
    false,
    "titleIs not Empty due to title has been set"
  );
  assert.equal(survey.renderedHasTitle, true, "There is title");
  assert.equal(survey.renderedHasHeader, true, "hasHeader, title is visible");
  survey.showTitle = false;
  assert.equal(survey.renderedHasTitle, false, "hasTitle is false");

  assert.equal(survey.renderedHasLogo, false, "There is not logo");
  survey.logo = "logo";
  assert.equal(survey.renderedHasLogo, true, "There is logo");
  survey.logoPosition = "none";
  assert.equal(survey.renderedHasTitle, false, "logo position is 'none'");

  survey.setDesignMode(true);
  assert.equal(survey.renderedHasTitle, true, "There is title, design");
  assert.equal(survey.renderedHasLogo, true, "There is logo, design");
  assert.equal(
    survey.isLogoBefore,
    false,
    "We do not render logo before at design, design"
  );
  assert.equal(
    survey.isLogoAfter,
    true,
    "We do render logo after at design, design"
  );
  assert.equal(
    survey.renderedHasHeader,
    true,
    "hasHeader, properties are visible"
  );

  Serializer.findProperty("survey", "title").visible = false;
  Serializer.findProperty("survey", "logo").visible = false;
  assert.equal(
    survey.renderedHasTitle,
    false,
    "There is no title, design, property invisible"
  );
  assert.equal(
    survey.renderedHasLogo,
    false,
    "There is no logo, design, property invisible"
  );
  assert.equal(
    survey.isLogoAfter,
    false,
    "We do not render logo after since the property is hidden, design"
  );
  assert.equal(
    survey.renderedHasHeader,
    false,
    "hasHeader, properties are invisible"
  );
  Serializer.findProperty("survey", "title").visible = true;
  Serializer.findProperty("survey", "logo").visible = true;
});
QUnit.test("Test survey renderedHasDescription property", function (
  assert
) {
  var survey = new SurveyModel();
  assert.equal(survey.renderedHasDescription, false, "hasDescription, decription is invisible");

  survey.setDesignMode(true);
  assert.equal(survey.renderedHasDescription, true, "description is visible in design mode");

  survey.setDesignMode(false);
  survey.description = "description";
  assert.equal(survey.renderedHasDescription, true, "There is description");
});

QUnit.test("Test survey renderedHasTitle/renderedHasLogo properties", function (
  assert
) {
  var survey = new SurveyModel();
  var trigger = new SurveyTriggerSetValue();
  survey.triggers.push(trigger);

  var surveyPropertyName;
  var triggerPropertyName;
  survey.onPropertyValueChangedCallback = (
    name: string,
    oldValue: any,
    newValue: any,
    sender: Base,
    arrayChanges: any
  ) => {
    surveyPropertyName = name;
  };
  trigger.onPropertyValueChangedCallback = (
    name: string,
    oldValue: any,
    newValue: any,
    sender: Base,
    arrayChanges: any
  ) => {
    triggerPropertyName = name;
  };
  trigger.setValue = "test";
  assert.equal(surveyPropertyName, "setValue", "get notification from survey");
  assert.equal(
    triggerPropertyName,
    "setValue",
    "get notification from trigger"
  );
});
QUnit.test("other and survey.clear", function (assert) {
  const survey = new SurveyModel({
    questions: [
      {
        type: "dropdown",
        name: "q1",
        hasOther: true,
        choices: ["item1", "item2", "item3"],
      },
      {
        type: "checkbox",
        name: "q2",
        hasOther: true,
        choices: ["item1", "item2", "item3"],
      },
    ],
  });
  const q1 = survey.getQuestionByName("q1");
  const q2 = survey.getQuestionByName("q2");
  q1.value = "other";
  q1.comment = "q1-comment";
  q2.value = ["item1", "other"];
  q2.comment = "q2-comment";
  survey.clear();
  assert.notOk(q1.comment, "after clear - dropdown");
  assert.notOk(q2.comment, "after clear - checkbox");
  q1.value = "other";
  q2.value = ["other"];
  assert.notOk(q1.comment, "after set other - dropdown");
  assert.notOk(q2.comment, "after set other - checkbox");
});
QUnit.test("survey.fromJSON with existing model",
  function (assert) {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q1" }] });
    survey.fromJSON({ elements: [{ type: "text", name: "q2" }] });
    assert.equal(survey.pages.length, 1);
    assert.notOk(survey.getQuestionByName("q1"));
    assert.ok(survey.getQuestionByName("q2"));
  }
);
QUnit.test("survey.autoGrowComment", function (assert) {
  let json = {
    autoGrowComment: true,
    pages: [
      {
        elements: [
          {
            type: "comment",
            name: "comment1",
          },
          {
            type: "comment",
            name: "comment2",
            autoGrow: true
          }
        ]
      }
    ]
  };
  let survey = new SurveyModel(json);
  let comment1 = survey.getQuestionByName("comment1") as QuestionCommentModel;
  let comment2 = survey.getQuestionByName("comment2") as QuestionCommentModel;

  assert.equal(survey.autoGrowComment, true, "#1");
  assert.equal(comment1.renderedAutoGrow, true, "#2");
  assert.equal(comment2.renderedAutoGrow, true, "#3");

  survey.autoGrowComment = false;
  assert.equal(comment1.renderedAutoGrow, false, "#4");
  assert.equal(comment2.renderedAutoGrow, true, "#5");
});
QUnit.test("save comment autoGrow && autoResize", function (assert) {
  let json = {
    autoGrowComment: true,
    pages: [
      {
        elements: [
          {
            type: "comment",
            name: "q1",
          }
        ]
      }
    ]
  };
  let survey = new SurveyModel(json);
  let question = survey.getQuestionByName("q1") as QuestionCommentModel;
  assert.deepEqual(question.toJSON(), { name: "q1" }, "#1");
  question.allowResize = false;
  question.autoGrow = false;
  assert.deepEqual(question.toJSON(), { name: "q1", allowResize: false, autoGrow: false }, "#2");
  question.allowResize = true;
  question.autoGrow = true;
  assert.deepEqual(question.toJSON(), { name: "q1", allowResize: true, autoGrow: true }, "#3");
});
QUnit.test("survey.allowResizeComment", function (assert) {
  let json = {
    allowResizeComment: false,
    pages: [
      {
        elements: [
          {
            type: "comment",
            name: "comment1",
          },
          {
            type: "comment",
            name: "comment2",
            allowResize: false
          }
        ]
      }
    ]
  };
  let survey = new SurveyModel(json);
  let comment1 = survey.getQuestionByName("comment1") as QuestionCommentModel;
  let comment2 = survey.getQuestionByName("comment2") as QuestionCommentModel;

  assert.equal(survey.allowResizeComment, false);
  assert.equal(comment1.renderedAllowResize, false, "comment1 survey.allowResizeComment = false, #1");
  assert.equal(comment2.renderedAllowResize, false, "comment2 survey.allowResizeComment = false, #2");

  survey.allowResizeComment = true;
  assert.equal(comment1.renderedAllowResize, true, "comment1 survey.allowResizeComment = true, #3");
  assert.equal(comment2.renderedAllowResize, false, "comment2 survey.allowResizeComment = true, #4");

  survey.showPreview();
  let comment1Preview = survey.getQuestionByName("comment1");
  assert.equal(comment1Preview.renderedAllowResize, true, "#5");
});

QUnit.test("survey.allowResizeComment & survey.autoGrowComment override this properties for individual properties", function (assert) {
  let json = {
    allowResizeComment: false,
    autoGrowComment: false,
    pages: [
      {
        elements: [
          {
            type: "comment",
            name: "comment1",
            autoGrow: true,
            allowResize: true
          },
          {
            type: "comment",
            name: "comment2",
          },
          {
            type: "comment",
            name: "comment3",
            autoGrow: false
          }
        ]
      }
    ]
  };
  let survey = new SurveyModel(json);
  let comment1 = survey.getQuestionByName("comment1") as QuestionCommentModel;
  let comment2 = survey.getQuestionByName("comment2") as QuestionCommentModel;
  let comment3 = survey.getQuestionByName("comment3") as QuestionCommentModel;

  assert.equal(comment1.renderedAllowResize, true, "comment1 survey.allowResizeComment = false, #1");
  assert.equal(comment1.renderedAutoGrow, true, "comment1 survey.autoGrowComment = false, #2");
  assert.equal(comment2.renderedAllowResize, false, "comment2 survey.allowResizeComment = false, #3");
  assert.equal(comment2.renderedAutoGrow, false, "comment2 survey.autoGrowComment = false, #4");
  assert.equal(comment3.renderedAutoGrow, false, "comment2 survey.autoGrowComment = false, #5");

  survey.allowResizeComment = true;
  survey.autoGrowComment = true;
  assert.equal(comment1.renderedAllowResize, true, "comment1 survey.allowResizeComment = true, #6");
  assert.equal(comment1.renderedAutoGrow, true, "comment1 survey.autoGrowComment = true, #7");
  assert.equal(comment2.renderedAllowResize, true, "comment2 survey.allowResizeComment = true, #8");
  assert.equal(comment2.renderedAutoGrow, true, "comment2 survey.autoGrowComment = true, #9");
  assert.equal(comment3.renderedAutoGrow, false, "comment2 survey.autoGrowComment = true, #10");
});

QUnit.test("getDefaultPropertyValue for comment properties autoGrow & allowResize", function (assert) {
  let comment = new QuestionCommentModel("q1");

  assert.strictEqual(comment.getDefaultPropertyValue("autoGrow"), undefined, "autoGrow");
  assert.strictEqual(comment.getDefaultPropertyValue("allowResize"), undefined, "allowResize");
});

QUnit.test("utils.increaseHeightByContent", assert => {
  let element = {
    getBoundingClientRect: () => { return { height: 50, width: 100, x: 10, y: 10 }; },
    scrollHeight: 50,
    style: { height: "50px" }
  };
  let getComputedStyle = () => {
    return {
      "borderTopWidth": "2px",
      "borderBottomWidth": "3px",
    };
  };
  increaseHeightByContent(<HTMLElement>element, getComputedStyle);
  assert.equal(element.style.height, "55px");

  element.scrollHeight = 90;
  increaseHeightByContent(<HTMLElement>element, getComputedStyle);
  assert.equal(element.style.height, "95px");
});
QUnit.test("test titleTagName, survey.cssTitle properties and getTitleOwner", assert => {
  const survey = new SurveyModel({
    elements: [
      {
        type: "panel", name: "p1",
        elements: [{ type: "text", name: "q1" }]
      }
    ]
  });
  setOldTheme(survey);
  assert.equal(survey.getQuestionByName("q1").titleTagName, "h5");
  assert.equal((<PanelModel>survey.getPanelByName("p1")).titleTagName, "h4");
  assert.equal(survey.pages[0].titleTagName, "h4");
  assert.equal(survey.titleTagName, "h3");
  assert.equal(survey.cssTitle, survey.css.title, "survey css");
  assert.equal(survey.pages[0].cssTitle, "sv_page_title", "page css");
  assert.ok(survey.getQuestionByName("q1").getTitleOwner());
  assert.ok((<PanelModel>survey.getPanelByName("p1")).getTitleOwner());
  assert.ok(survey.pages[0].getTitleOwner());
  assert.notOk(survey.getTitleOwner());
});
QUnit.test("settings titleTagName and survey.onGetTitleTagName", assert => {
  const survey = new SurveyModel({
    elements: [
      {
        type: "panel", name: "p1",
        elements: [{ type: "text", name: "q1" }]
      }
    ]
  });
  const savedTitleTags = Helpers.createCopy(settings.titleTags);
  settings.titleTags.survey = "h1";
  settings.titleTags.page = "h2";
  settings.titleTags.panel = "h3";
  settings.titleTags.question = "h4";
  assert.equal(survey.getQuestionByName("q1").titleTagName, "h4");
  assert.equal((<PanelModel>survey.getPanelByName("p1")).titleTagName, "h3");
  assert.equal(survey.pages[0].titleTagName, "h2");
  assert.equal(survey.titleTagName, "h1");
  survey.onGetTitleTagName.add((sender, options) => {
    options.tagName = options.tagName + options.element.getType()[0];
  });
  assert.equal(survey.getQuestionByName("q1").titleTagName, "h4t");
  assert.equal((<PanelModel>survey.getPanelByName("p1")).titleTagName, "h3p");
  assert.equal(survey.pages[0].titleTagName, "h2p");
  assert.equal(survey.titleTagName, "h1s");
  settings.titleTags = savedTitleTags;
});
QUnit.test("hasTitle + designTime", assert => {
  const survey = new SurveyModel({
    elements: [
      {
        type: "panel", name: "p1",
        elements: [{ type: "text", name: "q1" }]
      }
    ]
  });
  assert.ok(survey.getQuestionByName("q1").hasTitle, "question - running");
  assert.notOk((<PanelModel>survey.getPanelByName("p1")).hasTitle, "panel - running");
  assert.notOk(survey.pages[0].hasTitle, "page - running");
  assert.notOk(survey.hasTitle, "survey - running");

  survey.setDesignMode(true);
  assert.ok(survey.getQuestionByName("q1").hasTitle, "question - running");
  assert.notOk((<PanelModel>survey.getPanelByName("p1")).hasTitle, "panel - running");
  assert.ok(survey.pages[0].hasTitle, "page - running");
  assert.ok(survey.hasTitle, "survey - running");
});
QUnit.test("question and titleTabIndex", assert => {
  const survey = new SurveyModel({
    elements: [{ type: "text", name: "q1" }]
  });
  const question = survey.getQuestionByName("q1");
  assert.equal(question.titleTabIndex, undefined, "We do not have tabIndex");
  question.state = "collapsed";
  assert.equal(question.titleTabIndex, 0, "We need tabIndex now");
});
QUnit.test("show panel title if survey.showPageTitles is false", assert => {
  const survey = new SurveyModel({
    showPageTitles: false,
    title: "title page",
    elements: [{
      type: "panel",
      name: "panel",
      title: "title panel",
      elements: [{ type: "text", name: "q1" }]
    }]
  });
  const panel = <PanelModel>survey.getPanelByName("panel");
  const page = survey.pages[0];
  assert.equal(panel.hasTitle, true, "We show title for panels");
  assert.equal(page.hasTitle, false, "We hide title for page");
  survey.setDesignMode(true);
  assert.equal(panel.hasTitle, true, "We show title for panels in design");
  assert.equal(page.hasTitle, true, "We show title for page in design");
});
QUnit.test("Do panel click without actions, but if it has state", assert => {
  const survey = new SurveyModel({
    showPageTitles: false,
    title: "title page",
    elements: [{
      type: "panel",
      name: "panel",
      title: "title panel", state: "collapsed",
      elements: [{ type: "text", name: "q1" }]
    }]
  });
  survey.onGetPanelTitleActions.add((sender, options) => {
    options.titleActions = [];
  });
  const panel = <PanelModel>survey.getPanelByName("panel");
  assert.equal(panel.hasTitleActions, false, "Delete all actions");
  assert.equal(panel.hasTitleEvents, true, "It has non defult state");
  panel.state = "default";
  assert.equal(panel.hasTitleEvents, false, "It has defult state");
});

QUnit.test("Do not panel click with actions, but width 'default' state", assert => {
  const survey = new SurveyModel({
    showPageTitles: false,
    title: "title page",
    elements: [{
      type: "panel",
      name: "panel",
      title: "title panel",
      elements: [{ type: "text", name: "q1" }]
    }]
  });
  survey.onGetPanelTitleActions.add((sender, options) => {
    options.titleActions = [{ id: "action" }];
  });
  const panel = <PanelModel>survey.getPanelByName("panel");
  assert.equal(panel.hasTitleEvents, false, "hasTitleEvents should return false if question has 'default' state");
});

QUnit.test("Set values with trimming and caseSensitive", assert => {
  const survey = new SurveyModel({
    elements: [{ type: "text", name: "q1", title: "Hello" }]
  });
  const question = survey.getAllQuestions()[0];
  const hash = { name: 0, title: 0 };
  question.onPropertyChanged.add((sender, options) => {
    if (hash[options.name] >= 0) {
      hash[options.name] = hash[options.name] + 1;
    }
  });
  question.name = "Q1";
  assert.equal(question.name, "Q1");
  assert.equal(hash["name"], 1);
  question.title = " hello  ";
  assert.equal(question.title, " hello  ");
  assert.equal(hash["title"], 1);
});

QUnit.test("Modify question value, call onValueChanged by ignoring trimming and ", assert => {
  const survey = new SurveyModel({
    elements: [{ type: "text", name: "q1" }]
  });
  const question = survey.getAllQuestions()[0];
  let counter = 0;
  survey.onValueChanged.add((sender, options) => {
    counter++;
  });
  question.value = "q";
  assert.equal(counter, 1);
  question.value = "Q";
  assert.equal(counter, 2);
  question.value = " Q ";
  assert.equal(counter, 3);
  assert.equal(survey.getValue("q1"), " Q ");
});
QUnit.test("Modify question array value, call onValueChanged by ignoring trimming and ", assert => {
  const survey = new SurveyModel({
    elements: [{ type: "matrixdynamic", name: "q1", rowCount: 2, columns: [{ name: "col1", cellType: "text" }] }]
  });
  const question = <QuestionMatrixDynamicModel>survey.getAllQuestions()[0];
  let counter = 0;
  const rows = question.visibleRows;
  rows[0].cells[0].value = "val1";
  rows[1].cells[0].value = "val2";
  survey.onValueChanged.add((sender, options) => {
    counter++;
  });
  rows[1].cells[0].value = "Val2";
  assert.equal(counter, 1);
  rows[1].cells[0].value = " Val2 ";
  assert.equal(counter, 2);
  assert.deepEqual(question.value, [{ col1: "val1" }, { col1: " Val2 " }]);
});
QUnit.test("page.fromJSON() doesn't work correctly, Bug#3331", assert => {
  const survey = new SurveyModel({
    elements: [{ type: "checkbox", name: "q1", choices: ["item1", "item2", "item3"] }]
  });
  const pageJSON = survey.pages[0].toJSON();
  survey.removePage(survey.pages[0]);
  const pg = survey.addNewPage();
  pg.fromJSON(pageJSON);
  const question = <QuestionCheckboxModel>survey.getAllQuestions()[0];
  assert.equal(question.visibleChoices.length, 3, "Visible choices are set");
});
QUnit.test("start page is invisible", assert => {
  const survey = new SurveyModel({
    pages: [
      {
        elements: [
          {
            type: "text",
            name: "name1",
          },
        ],
      },
      {
        elements: [
          {
            type: "text",
            name: "name2",
          },
        ],
      },
    ],
    firstPageIsStartPage: true,
  });
  const startPage = survey.startPage;
  assert.ok(startPage);
  assert.equal(startPage.isVisible, true, "started page is visible");
});
QUnit.test("firstPageIsStartPage = true and prevPage()", function (assert) {
  var survey = new SurveyModel();
  for (var i = 0; i < 3; i++) {
    let page = survey.addNewPage("p" + i + 1);
    page.addNewQuestion("text");
  }
  survey.firstPageIsStartPage = true;
  assert.equal(survey.prevPage(), false);
  survey.start();
  assert.equal(survey.prevPage(), false);
  survey.nextPage();
  assert.equal(survey.prevPage(), true);
  assert.equal(survey.currentPageNo, 0);
});
QUnit.test("firstPageIsStartPage = true and invisible questions and clear", function (assert) {
  var survey = new SurveyModel({
    firstPageIsStartPage: true,
    pages: [
      {
        elements: [
          { type: "radiogroup", name: "q1", choices: [1, 2, 3] },
          { type: "text", name: "q2", visibleIf: "{q1} = 1" }
        ]
      },
      {
        elements: [
          { type: "text", name: "q3" }
        ]
      }
    ]
  });
  const q2 = survey.getQuestionByName("q2");
  assert.equal(q2.isVisible, false, "initially invisible");
  survey.setValue("q1", 1);
  assert.equal(q2.isVisible, true, "visible now");
  survey.nextPage();
  survey.doComplete();
  survey.clear(true, true);
  assert.equal(q2.isVisible, false, "invisible again");
});
QUnit.test("firstPageIsStartPage = true and clear&state='starting'", function (assert) {
  const survey = new SurveyModel({
    firstPageIsStartPage: true,
    goNextPageAutomatic: true,
    showProgressBar: "bottom",
    showTimerPanel: "top",
    maxTimeToFinishPage: 10,
    maxTimeToFinish: 25,
    pages: [
      {
        elements: [
          { type: "text", name: "q1" }
        ]
      },
      {
        elements: [
          { type: "text", name: "q2" }
        ]
      }
    ]
  });
  const startButton = survey.navigationBar.getActionById("sv-nav-start");
  assert.equal(survey.state, "starting", "starting state #1");
  assert.equal(survey.getPropertyValue("isStartedState"), true, "isStartedState #1");
  assert.equal(startButton.isVisible, true, "startButton is visible, #1");
  assert.equal(survey.showNavigationButtons, true, "Show navigation on bottom - true");
  assert.equal(survey.navigationButtonsLocation, "bottom", "Show navigation on bottom");
  survey.start();
  assert.equal(survey.state, "running", "run survey");
  assert.equal(survey.getPropertyValue("isStartedState"), false, "isStartedState #2");
  survey.doComplete();
  assert.equal(survey.state, "completed", "survey is completed");
  assert.equal(survey.getPropertyValue("isStartedState"), false, "isStartedState #3");
  survey.clear();
  assert.equal(survey.state, "starting", "starting state #2");
  assert.equal(survey.getPropertyValue("isStartedState"), true, "isStartedState #4");
  assert.equal(startButton.isVisible, true, "startButton is visible, #2");
  assert.equal(survey.isNavigationButtonsShowing, "bottom", "Show navigation buttons on start");
});
QUnit.test("skeleton component name", function (assert) {
  var survey = new SurveyModel({
    pages: [
      {
        elements: [
          {
            type: "text",
            name: "name1",
          },
        ],
      },
    ]
  });
  const question = survey.getAllQuestions()[0];
  assert.equal(survey.skeletonComponentName, "sv-skeleton");
  assert.equal(question.skeletonComponentName, "sv-skeleton");
  survey.skeletonComponentName = "";
  assert.equal(survey.skeletonComponentName, "");
  assert.equal(question.skeletonComponentName, "");
});
QUnit.test("Make sure to have currentPage on adding new question/page/visibility in code", function (assert) {
  const survey = new SurveyModel();
  assert.equal(survey.getPropertyValue("currentPage"), undefined, "There is no pages");
  const newPage = new PageModel("page1");
  newPage.addNewQuestion("text", "q1");
  survey.pages.push(newPage);
  assert.equal(survey.getPropertyValue("currentPage").name, survey.pages[0].name, "We have added a new current page");
  survey.pages.shift();
  assert.equal(survey.getPropertyValue("currentPage"), undefined, "There is no new pages again");
  survey.addNewPage("page1");
  assert.equal(survey.getPropertyValue("currentPage"), undefined, "There is no visible pages");
  survey.pages[0].addNewQuestion("text", "q1");
  assert.equal(survey.getPropertyValue("currentPage").name, survey.pages[0].name, "There is current page");
  survey.pages[0].visible = false;
  assert.equal(survey.getPropertyValue("currentPage"), undefined, "We make page invisible");
  survey.pages[0].visible = true;
  assert.equal(survey.getPropertyValue("currentPage").name, survey.pages[0].name, "We make the page visible");
});
QUnit.test("Make invisible question visible in the only page", function (assert) {
  const survey = new SurveyModel();
  assert.equal(survey.getPropertyValue("currentPage"), undefined, "There is no pages");
  const newPage = new PageModel("page1");
  newPage.addNewQuestion("text", "q1");
  newPage.addNewQuestion("text", "q2");
  newPage.questions[0].visible = false;
  newPage.questions[1].visible = false;
  survey.pages.push(newPage);
  assert.equal(survey.getPropertyValue("currentPage"), undefined, "There is no visible pages");
  newPage.questions[0].visible = true;
  assert.equal(survey.getPropertyValue("currentPage").name, survey.pages[0].name, "New page is visible now");
  newPage.questions[0].visible = false;
  assert.equal(survey.getPropertyValue("currentPage"), undefined, "There is no visible pages, #2");
  newPage.questions[1].visible = true;
  assert.equal(survey.getPropertyValue("currentPage").name, survey.pages[0].name, "New page is visible now, #2");
});
QUnit.test("clear value for question in invisible panel with non-empty valueName property", function (assert) {
  const survey = new SurveyModel({
    elements: [
      { type: "text", name: "q1" },
      {
        type: "panel", name: "panel", visibleIf: "{q1} empty",
        elements: [
          { type: "text", name: "q2", valueName: "invisible" }
        ]
      }
    ]
  });
  const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("q2");
  matrix.value = "val2";
  assert.deepEqual(survey.data, { invisible: "val2" }, "value is in data");
  survey.setValue("q1", 1);
  survey.doComplete();
  assert.deepEqual(survey.data, { q1: 1 }, "value is empty now");
});
QUnit.test("Randomized questions and onQuestionAdded", function (assert) {
  const survey = new SurveyModel({
    pages: [
      { elements: [{ type: "text", name: "q1" }] },
      {
        questionsOrder: "random",
        elements: [{ type: "text", name: "q2" }, { type: "text", name: "q3" }]
      }
    ]
  });
  var counter = 0;
  survey.onQuestionAdded.add((sender, options) => {
    counter++;
  });
  survey.currentPageNo = 1;
  assert.equal(counter, 0, "onQuestionAdded is not fired");
});
QUnit.test("onQuestionAdded & changing parent", function (assert) {
  const survey = new SurveyModel({
    pages: [
      { elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }] },
      {
        questionsOrder: "random",
        elements: [{ type: "text", name: "q3" }, { type: "text", name: "q4" }]
      }
    ]
  });
  let addedCounter = 0;
  let removedCounter = 0;
  survey.onQuestionAdded.add((sender, options) => {
    addedCounter++;
  });
  survey.onQuestionRemoved.add((sender, options) => {
    removedCounter++;
  });
  assert.equal(addedCounter, 0, "onQuestionAdded is not fired, #1");
  survey.getQuestionByName("q1").page = survey.pages[1];
  survey.getQuestionByName("q3").page = survey.pages[0];
  assert.equal(addedCounter, 0, "onQuestionAdded is not fired, #2");
  const q = new QuestionTextModel("q5");
  q.page = survey.pages[1];
  assert.equal(addedCounter, 1, "onQuestionAdded is fired for q5, #3");
  assert.equal(removedCounter, 0, "onQuestionRemoved #1");
  q.delete();
  assert.equal(removedCounter, 1, "onQuestionRemoved #2");
});
QUnit.test("Set values into radiogroup and checkbox questions before creating them", function (assert) {
  const survey = new SurveyModel();
  survey.data = { q1: 1, q2: [1, 2] };
  survey.fromJSON({
    elements: [
      { type: "radiogroup", name: "q1", choices: [1, 2, 3] },
      { type: "checkbox", name: "q2", choices: [1, 2, 3] },
    ]
  });
  assert.deepEqual(survey.data, { q1: 1, q2: [1, 2] }, "Survey data is correct");
  const q1 = <QuestionRadiogroupModel>survey.getQuestionByName("q1");
  const q2 = <QuestionCheckboxModel>survey.getQuestionByName("q2");
  assert.equal(q1.value, 1, "radiogroup value");
  assert.deepEqual(q2.value, [1, 2], "checkbox value");
  assert.equal(q1.renderedValue, 1, "radiogroup rendered value");
  assert.deepEqual(q2.renderedValue, [1, 2], "checkbox rendered value");
});
QUnit.test("Checkbox, invsible item with default Value", function (assert) {
  const survey = new SurveyModel();
  survey.data = { q1: 1, q2: [1, 2] };
  survey.fromJSON({
    elements: [
      { type: "radiogroup", name: "q1", choices: [1, 2, 3] },
      {
        type: "checkbox", name: "q2", defaultValue: [1], choices: [
          { value: 1, visibleIf: "{q1} = 2" }, 2
        ]
      },
    ]
  });
  const q2 = survey.getQuestionByName("q2");
  assert.equal(q2.isEmpty(), true, "question is empty");
  survey.setValue("q1", 2);
  assert.deepEqual(q2.value, [1], "Respect default value");
  survey.setValue("q1", 1);
  assert.equal(q2.isEmpty(), true, "question is empty again");
  survey.setValue("q1", 2);
  assert.deepEqual(q2.value, [1], "Respect default value again");
  q2.value = [2];
  survey.setValue("q1", 1);
  survey.setValue("q1", 2);
  assert.deepEqual(q2.value, [2], "default value is goine");
});
QUnit.test("clearInvisibleValues: `none` and copyvalue trigger", function (assert) {
  const survey = new SurveyModel({
    "elements": [
      {
        "type": "radiogroup",
        "name": "question1",
        "choices": [
          "item1",
          "item2",
          "item3"
        ]
      },
      {
        "type": "radiogroup",
        "name": "question2",
        "visible": false,
        "choices": [
          "item1",
          "item2",
          "item3"
        ]
      }
    ],
    "triggers": [
      {
        "type": "copyvalue",
        "expression": "{question1} notempty",
        "fromName": "question1",
        "setToName": "question2"
      }
    ],
    "clearInvisibleValues": "none"
  });
  survey.setValue("question1", "item2");
  assert.equal(survey.getValue("question2"), "item2", "Trigger is working");
  assert.deepEqual(survey.data, { question1: "item2", question2: "item2" }, "Data is correct");
  survey.doComplete();
  assert.deepEqual(survey.data, { question1: "item2", question2: "item2" }, "Data is correct after completed");
});
QUnit.test("Assign survey data callback", function (assert) {
  const survey = new SurveyModel();
  let getCounter = 0;
  let setCounter = 0;
  let deleteCounter = 0;
  survey.valueHashGetDataCallback = (valuesHash: any, key: string): any => {
    getCounter++;
    return valuesHash[key];
  };
  survey.valueHashSetDataCallback = (valuesHash: any, key: string, value: any): void => {
    setCounter++;
    valuesHash[key] = value;
  };
  survey.valueHashDeleteDataCallback = (valuesHash: any, key: string): void => {
    deleteCounter++;
    delete valuesHash[key];
  };
  survey.setValue("a", "abc");
  assert.equal(survey.getValue("a"), "abc");
  survey.clearValue("a");
  assert.equal(getCounter > 0, true, "getCounter");
  assert.equal(setCounter, 1, "setCounter");
  assert.equal(deleteCounter, 1, "deleteCounter");
  const oldGetCount = getCounter;
  assert.equal(survey.getValue("a"), undefined);
  assert.equal(getCounter, oldGetCount + 1, "getCounter #2");
});
QUnit.test("Run expressions on changing comments", function (assert) {
  const survey = new SurveyModel({
    "elements": [
      {
        "type": "radiogroup",
        "name": "question1",
        "choices": [
          "item1",
          "item2",
          "item3"
        ],
        hasComment: true
      },
      {
        type: "text",
        name: "question2",
        visibleIf: "{question1-Comment.length} > 3"
      }
    ]
  });
  const question2 = survey.getQuestionByName("question2");
  assert.equal(question2.isVisible, false, "Invisible by default");
  survey.setComment("question1", "abcd");
  assert.equal(question2.isVisible, true, "visible");
  survey.setComment("question1", "abc");
  assert.equal(question2.isVisible, false, "Invisible again");
});

QUnit.test("Check survey resize observer", function (assert) {
  const getComputedStyle = window.getComputedStyle;
  window.getComputedStyle = <any>((el: HTMLElement) => {
    return el.style;
  });
  const rootEl = document.createElement("div");
  window.document.body.appendChild(rootEl);
  const survey = new SurveyModel({
    "elements": [
      {
        type: "text",
        name: "q1",
      }
    ]
  });
  survey.getCss().variables = { mobileWidth: "--test-mobile-width" };
  survey.afterRenderSurvey(rootEl);
  assert.notOk(survey["resizeObserver"]);
  window.getComputedStyle(rootEl).setProperty("--test-mobile-width", "600px");
  survey.afterRenderSurvey(rootEl);
  assert.ok(survey["resizeObserver"]);
  const firstResizeObserver = survey["resizeObserver"];
  let firstResizeObserverIsConnected = true;
  firstResizeObserver.disconnect = () => {
    firstResizeObserverIsConnected = false;
  };
  survey.afterRenderSurvey(rootEl);
  assert.notOk(survey["resizeObserver"] == firstResizeObserver, "check that new resize observer is created after second afterRender");
  assert.notOk(firstResizeObserverIsConnected, "check that old resize observer is disconnected after second afterRender");
  survey.dispose();
  assert.notOk(survey["resizeObserver"]);
  window.getComputedStyle = getComputedStyle;
  rootEl.remove();
});

class CustomResizeObserver {
  constructor(private callback: () => void) { }
  observe() {
    this.call();
  }
  call() {
    this.callback();
  }
}

QUnit.test("Check survey resize observer double process", function (assert) {
  window.requestAnimationFrame = (func: any) => !!func && func();
  const getComputedStyle = window.getComputedStyle;
  window.getComputedStyle = <any>((el: HTMLElement) => {
    return el.style;
  });
  const ResizeObserver = window.ResizeObserver;
  window.ResizeObserver = <any>CustomResizeObserver;
  const rootEl = document.createElement("div");
  window.document.body.appendChild(rootEl);
  const survey = new SurveyModel({
    "elements": [
      {
        type: "text",
        name: "q1",
      }
    ]
  });
  survey.getCss().variables = { mobileWidth: "--test-mobile-width" };
  window.getComputedStyle(rootEl).setProperty("--test-mobile-width", "600px");
  let trace: string = "";
  survey["processResponsiveness"] = () => {
    trace += "->processed";
    return true;
  };
  survey.afterRenderSurvey(rootEl);
  assert.equal(trace, "->processed");
  (<any>survey["resizeObserver"]).call();
  assert.equal(trace, "->processed", "prevent double process");
  (<any>survey["resizeObserver"]).call();
  assert.equal(trace, "->processed->processed");
  window.ResizeObserver = ResizeObserver;
  window.getComputedStyle = getComputedStyle;
  rootEl.remove();
});

QUnit.test("Check survey resize observer do not process if container is not visible", function (assert) {
  const getComputedStyle = window.getComputedStyle;
  window.getComputedStyle = <any>((el: HTMLElement) => {
    return el.style;
  });
  const ResizeObserver = window.ResizeObserver;
  window.ResizeObserver = <any>CustomResizeObserver;
  const rootEl = document.createElement("div");
  window.document.body.appendChild(rootEl);
  const survey = new SurveyModel({
    "elements": [
      {
        type: "text",
        name: "q1",
      }
    ]
  });
  survey.getCss().variables = { mobileWidth: "--test-mobile-width" };
  window.getComputedStyle(rootEl).setProperty("--test-mobile-width", "600px");
  let trace: string = "";
  survey["processResponsiveness"] = () => {
    trace += "->processed";
    return true;
  };
  rootEl.style.display = "none";
  survey.afterRenderSurvey(rootEl);
  assert.equal(trace, "", "do not process responsivness on invisible container");
  rootEl.style.display = "block";
  (<any>survey["resizeObserver"]).call();
  assert.equal(trace, "->processed", "process responsivness on visible container");
  window.ResizeObserver = ResizeObserver;
  window.getComputedStyle = getComputedStyle;
  rootEl.remove();
});

QUnit.test("Check isMobile set via processResponsiveness method", function (assert) {
  const survey = new SurveyModel({
    "elements": [
      {
        type: "text",
        name: "q1",
      }
    ]
  });
  let log = "";
  survey.onResize.add((_, { width, height }) => {
    log += `->width: ${width}; height: ${height}`;
  });
  let isProcessed = survey["processResponsiveness"](500, 600, 800);
  assert.equal(log, "->width: 500; height: 800");
  assert.ok(survey._isMobile);
  assert.ok(isProcessed);

  log = "";
  isProcessed = survey["processResponsiveness"](600, 500, 400);
  assert.equal(log, "->width: 600; height: 400");
  assert.ok(isProcessed);

  log = "";
  isProcessed = survey["processResponsiveness"](800, 500, 300);
  assert.equal(log, "->width: 800; height: 300");
  assert.notOk(survey._isMobile);
  assert.notOk(isProcessed);
});
QUnit.test("Check addNavigationItem", function (assert) {

  const survey = new SurveyModel({
    "elements": [
      {
        type: "text",
        name: "q1",
      }
    ]
  });
  setOldTheme(survey);
  const action1 = survey.addNavigationItem({ id: "custom-btn", visibleIndex: 3 });
  assert.ok(action1 === survey.navigationBar.actions[0]);
  assert.equal(action1.id, "custom-btn");
  assert.equal(action1.innerCss, "sv_nav_btn");
  assert.equal(action1.component, "sv-nav-btn");

  const action2 = survey.addNavigationItem({ id: "custom-btn-2", innerCss: "custom-css", visibleIndex: 11 });
  assert.ok(action2 === survey.navigationBar.actions[2]);
  assert.equal(action2.id, "custom-btn-2");
  assert.equal(action2.innerCss, "custom-css");
  assert.equal(action2.component, "sv-nav-btn");

  const action3 = survey.addNavigationItem({ id: "custom-btn-3", component: "custom-component", visibleIndex: 21 });
  assert.ok(action3 === survey.navigationBar.actions[4]);
  assert.equal(action3.id, "custom-btn-3");
  assert.equal(action3.component, "custom-component");
});

QUnit.test("Check default navigation items relevance", function (assert) {
  const survey = new SurveyModel({
    "elements": [
      {
        type: "text",
        name: "q1",
      }
    ]
  });
  setOldTheme(survey);
  survey.css = { actionBar: { item: "custom-action" }, navigationButton: "custom-css", navigation: { start: "custom-start" } };
  const action = survey.navigationBar.actions[0];
  assert.equal(action.getActionBarItemCss(), "custom-action custom-css custom-start");
  survey.locale = "ru";
  assert.equal(action.title, "Начать");
  survey.locale = "en";
  assert.equal(action.title, "Start");
  survey.startSurveyText = "custom-text";
  assert.equal(action.title, "custom-text");
});
QUnit.test("Check rootCss property", function (assert) {
  const survey = new SurveyModel({
    "elements": [
      {
        type: "text",
        name: "q1",
      }
    ]
  });
  setOldTheme(survey);
  survey.css = { root: "test-root-class" };
  assert.equal(survey.rootCss, "test-root-class sv_progress--pages");
});

QUnit.test("Check navigation bar css update", function (assert) {
  const survey = new SurveyModel({
    "elements": [
      {
        type: "text",
        name: "q1",
      }
    ]
  });
  survey.css = { actionBar: { root: "custom-navigation", defaultSizeMode: "" }, footer: "custom-footer" };
  assert.equal(survey.navigationBar.getRootCss(), "custom-navigation custom-footer");
});
QUnit.test("Check survey getRootCss function - defaultCss", function (assert) {
  settings.animationEnabled = true;
  const survey = new SurveyModel({
    "elements": [
      {
        type: "text",
        name: "q1",
      }
    ]
  });
  survey.css = defaultCss;
  assert.equal(survey.getRootCss(), "sd-root-modern sd-progress--pages sd-root-modern--full-container");

  survey.fitToContainer = false;
  assert.equal(survey.getRootCss(), "sd-root-modern sd-progress--pages");

  survey.setIsMobile(true);
  survey.fitToContainer = true;
  assert.equal(survey.getRootCss(), "sd-root-modern sd-progress--pages sd-root-modern--mobile sd-root-modern--full-container");

  survey.fitToContainer = false;
  assert.equal(survey.getRootCss(), "sd-root-modern sd-progress--pages sd-root-modern--mobile");

  survey.mode = "display";
  survey.fitToContainer = true;
  assert.equal(survey.getRootCss(), "sd-root-modern sd-progress--pages sd-root-modern--mobile sd-root--readonly sd-root-modern--full-container");

  survey.fitToContainer = false;
  assert.equal(survey.getRootCss(), "sd-root-modern sd-progress--pages sd-root-modern--mobile sd-root--readonly");

  survey.mode = "edit";
  survey.setIsMobile(false);
  survey["isCompact"] = true;
  assert.equal(survey.getRootCss(), "sd-root-modern sd-progress--pages sd-root--compact");

  survey.fitToContainer = true;
  assert.equal(survey.getRootCss(), "sd-root-modern sd-progress--pages sd-root--compact sd-root-modern--full-container");
  settings.animationEnabled = false;
});

QUnit.test("Check survey isMobile in design mode", function (assert) {
  const survey = new SurveyModel({
    "elements": [
      {
        type: "text",
        name: "q1",
      },
      {
        type: "multipletext",
        name: "q2",
        items: [
          {
            "name": "text1"
          }
        ]
      },
      {
        type: "checkbox",
        name: "q3",
        choices: ["Item1", "Item2"]
      }
    ]
  });
  survey.css = defaultCss;
  survey.setDesignMode(true);
  const textQuestion = survey.getQuestionByName("q1");
  const multipleTextQuestion = survey.getQuestionByName("q2");
  const checkboxQuestion = survey.getQuestionByName("q3");
  survey.setIsMobile(true);
  assert.ok(survey._isMobile);
  assert.notOk(survey.isMobile);
  assert.notOk(textQuestion.isMobile);
  assert.ok(multipleTextQuestion.isMobile);
  assert.ok(checkboxQuestion.isMobile);
});
QUnit.test("Check survey isMobile is set correctly on adding new question", function (assert) {
  const survey = new SurveyModel({
    "elements": [
      {
        type: "text",
        name: "q1",
      },
    ]
  });
  survey.css = defaultCss;
  survey.setIsMobile(true);
  survey.pages[0].addNewQuestion("text", "q2", 0);
  const question = survey.getQuestionByName("q2");
  assert.ok(question.isMobile);
});
QUnit.test("Check survey isMobile is set correctly on question in nested dynamic panels", function (assert) {
  const survey = new SurveyModel({
    "logoPosition": "right",
    "pages": [
      {
        "name": "page1",
        "elements": [
          {
            "type": "paneldynamic",
            "name": "question1",
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
    ]
  });
  survey.css = defaultCss;
  survey.data = {
    "question1": [
      {}
    ]
  };
  assert.notOk(survey.isMobile);
  survey.setIsMobile(true);
  assert.ok(survey.isMobile);
  assert.ok(survey.getQuestionByName("question1").panels[0].getQuestionByName("question2").isMobile);
});
QUnit.test("Set correct activePage on fromSurvey and update buttons visibility", function (assert) {
  const survey = new SurveyModel({
    "elements": [
      {
        type: "text",
        name: "q1",
      }
    ]
  });
  assert.equal(survey.activePage.id, survey.pages[0].id, "Initially active page is correct");
  assert.equal(survey.navigationBar.getActionById("sv-nav-prev").visible, false, "PrevButton is not shown");
  survey.fromJSON(survey.toJSON());
  assert.equal(survey.activePage.id, survey.pages[0].id, "Initially active page is correct");
  assert.equal(survey.navigationBar.getActionById("sv-nav-prev").visible, false, "PrevButton is not shown #2");
});
QUnit.test("Navigation buttons text from JSON", function (assert) {
  const survey = new SurveyModel({
    completeText: "Submit",
    "elements": [
      {
        type: "text",
        name: "q1",
      }
    ]
  });
  assert.equal(survey.completeText, "Submit", "text is correct");
  assert.equal(survey.navigationBar.getActionById("sv-nav-complete").title, "Submit", "Text in bar is correct");
});

QUnit.test("Do not execute visibleIf in design mode", function (assert) {
  var survey = new SurveyModel();
  survey.setDesignMode(true);
  survey.fromJSON({
    elements: [
      {
        type: "panel",
        name: "panel",
        elements: [
          { type: "text", name: "q1" },
        ],
      }
    ]
  });
  const question = survey.getQuestionByName("q1");
  assert.equal(question.visible, true, "It is visible initially");
  question.visibleIf = "{q2} = 1";
  assert.equal(question.visible, true, "It is still visible");
  const panel = <PanelModel>survey.getPanelByName("panel");
  const panel2 = <PanelModel>panel.clone();
  const question2 = panel2.questions[0];
  assert.equal(question2.visibleIf, "{q2} = 1", "It is visible");
  assert.equal(question2.visible, true, "It is visible");
  survey.pages[0].addElement(panel2);
  assert.equal(question2.visible, true, "It is visible, #2");
  const newPanel = new PanelModel("newPanel");
  newPanel.addNewQuestion("text", "q3_1");
  newPanel.questions[0].visibleIf = "{q2} = 1";
  assert.equal(newPanel.questions[0].visible, true, "new Panel question visible");
  const newPanel2 = <PanelModel>newPanel.clone();
  const newQuestion2 = newPanel2.questions[0];
  assert.equal(newQuestion2.visibleIf, "{q2} = 1", "It is visible");
  assert.equal(newQuestion2.visible, true, "It is visible");
  survey.pages[0].addElement(newPanel2);
  assert.equal(newQuestion2.visible, true, "It is visible, #2");
});
QUnit.test("Ignore firstStartPage if there is only one page", function (assert) {
  var survey = new SurveyModel({
    firstPageIsStarted: true,
    elements: [
      { type: "text", name: "q1" },
      { type: "text", name: "q2" }
    ]
  });
  assert.equal(survey.state, "running", "There is only one page");
  assert.equal(survey.isCompleteButtonVisible, true, "Complete button is visible");
});
QUnit.test("Check survey calculated width mode observability",
  function (assert) {
    const json = {
      "pages": [
        {
          "elements": [
            {
              "type": "text",
              "name": "q1"
            },
            {
              "type": "text",
              "name": "q2"
            },
            {
              "type": "text",
              "name": "q3"
            },
            {
              "type": "text",
              "name": "q4"
            }
          ]
        }
      ]
    };
    const model = new SurveyModel(json);
    model.css.body = "css-body";

    assert.equal(model.calculatedWidthMode, "static");
    assert.equal(model.bodyCss, "css-body css-body--static");
    model.widthMode = "responsive";
    assert.equal(model.calculatedWidthMode, "responsive");
    assert.equal(model.bodyCss, "css-body css-body--responsive");

    model.widthMode = "auto";
    assert.equal(model.calculatedWidthMode, "static");

    model.getAllQuestions()[1].startWithNewLine = false;
    assert.equal(model.calculatedWidthMode, "responsive");

    model.getAllQuestions()[1].startWithNewLine = true;
    assert.equal(model.calculatedWidthMode, "static");

    model.pages[0].addNewQuestion("matrix", "qm");
    assert.equal(model.calculatedWidthMode, "responsive");
  }
);

QUnit.test("Check survey calculated width mode observability with survey changing",
  function (assert) {
    const json = {
      "pages": [
        {
          "elements": [
            {
              "type": "text",
              "name": "q1"
            },
            {
              "type": "text",
              "name": "q2"
            }
          ]
        }
      ]
    };
    const model = new SurveyModel({});
    assert.equal(model.calculatedWidthMode, "static");
    model.fromJSON(json);
    assert.equal(model.calculatedWidthMode, "static");
    model.getAllQuestions()[1].startWithNewLine = false;
    assert.equal(model.calculatedWidthMode, "responsive");
  }
);

QUnit.test("Check survey calculated width mode observability on question added",
  function (assert) {
    const model = new SurveyModel({});
    assert.equal(model.calculatedWidthMode, "static");
    model.addNewPage();
    model.pages[0].addNewQuestion("matrix", "q1");
    assert.equal(model.calculatedWidthMode, "responsive");
  }
);

QUnit.test("Check survey width for different width modes",
  function (assert) {
    const json = {
      "pages": [
        {
          "elements": [
            {
              "type": "text",
              "name": "q1"
            },
            {
              "type": "text",
              "name": "q2"
            },
            {
              "type": "text",
              "name": "q3"
            },
            {
              "type": "text",
              "name": "q4"
            }
          ]
        }
      ]
    };
    const model = new SurveyModel(json);

    assert.equal(model.widthMode, "auto");
    assert.equal(model.calculatedWidthMode, "static");
    assert.equal(model.renderedWidth, undefined, "auto static width undefined");

    model.width = "700px";
    assert.equal(model.calculatedWidthMode, "static");
    assert.equal(model.renderedWidth, "700px", "auto static width 700px");

    model.getAllQuestions()[1].startWithNewLine = false;
    assert.equal(model.calculatedWidthMode, "responsive");
    assert.equal(model.renderedWidth, undefined, "auto responsive width undefined");

    model.widthMode = "static";
    assert.equal(model.renderedWidth, "700px", "static width 700px");

    model.widthMode = "responsive";
    assert.equal(model.renderedWidth, undefined, "responsive width undefined");
  }
);

QUnit.test("Add px to numeric survey width",
  function (assert) {
    const model = new SurveyModel();

    assert.equal(model.widthMode, "auto");
    assert.equal(model.calculatedWidthMode, "static");
    assert.equal(model.renderedWidth, undefined, "auto static width undefined");

    model.width = "700";
    assert.equal(model.calculatedWidthMode, "static");
    assert.equal(model.renderedWidth, "700px", "auto add px 700px");
  }
);

QUnit.test("Survey Localization - check errors update after locale changed", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        type: "text",
        isRequired: true,
        name: "question1"
      },
      {
        type: "text",
        isRequired: true,
        name: "question2",
        requiredErrorText: {
          default: "custom_error_text",
          de: "custom_error_text_deutch"
        }
      },
      {
        type: "text",
        name: "question3",
        maxErrorText: {
          default: "custom_max_error_text {0}",
          de: "custom_max_error_text_deutch {0}"
        },
        inputType: "numeric",
        max: 10,
      },
      {
        type: "text",
        name: "question4",
        minErrorText: {
          default: "custom_min_error_text {0}",
          de: "custom_min_error_text_deutch {0}"
        },
        inputType: "numeric",
        min: 10,
      },
      {
        type: "text",
        name: "question5",
        "validators": [
          {
            text: {
              default: "custom_min_error_text",
              de: "custom_min_error_text_deutch"
            },
            "type": "numeric",
            "minValue": 10,
          }
        ]
      },
      {
        type: "radiogroup",
        name: "question6",
        isRequired: true,
        hasOther: true,
        otherErrorText: {
          default: "custom_other_error_text",
          de: "custom_other_error_text_deutch"
        }
      },
    ]
  });
  const q1 = <QuestionTextModel>survey.getQuestionByName("question1");
  const q2 = <QuestionTextModel>survey.getQuestionByName("question2");
  const q3 = <QuestionTextModel>survey.getQuestionByName("question3");
  const q4 = <QuestionTextModel>survey.getQuestionByName("question4");
  const q5 = <QuestionTextModel>survey.getQuestionByName("question5");
  const q6 = <QuestionTextModel>survey.getQuestionByName("question6");
  q3.value = 11;
  q4.value = 9;
  q5.value = 9;
  q6.value = "other";

  survey.tryComplete();
  assert.equal(q1.errors.length, 1);
  assert.equal(q1.errors[0].locText.renderedHtml, "Response required.");

  assert.equal(q2.errors.length, 1);
  assert.equal(q2.errors[0].locText.renderedHtml, "custom_error_text");

  assert.equal(q3.errors.length, 1);
  assert.equal(q3.errors[0].locText.renderedHtml, "custom_max_error_text 10");

  assert.equal(q4.errors.length, 1);
  assert.equal(q4.errors[0].locText.renderedHtml, "custom_min_error_text 10");

  assert.equal(q5.errors.length, 1);
  assert.equal(q5.errors[0].locText.renderedHtml, "custom_min_error_text");

  assert.equal(q6.errors.length, 1);
  assert.equal(q6.errors[0].locText.renderedHtml, "custom_other_error_text");

  survey.locale = "de";

  assert.equal(q1.errors.length, 1);
  assert.equal(q1.errors[0].locText.renderedHtml, "Bitte beantworten Sie diese Frage.");

  assert.equal(q2.errors.length, 1);
  assert.equal(q2.errors[0].locText.renderedHtml, "custom_error_text_deutch");

  assert.equal(q3.errors.length, 1);
  assert.equal(q3.errors[0].locText.renderedHtml, "custom_max_error_text_deutch 10");

  assert.equal(q4.errors.length, 1);
  assert.equal(q4.errors[0].locText.renderedHtml, "custom_min_error_text_deutch 10");

  assert.equal(q5.errors.length, 1);
  assert.equal(q5.errors[0].locText.renderedHtml, "custom_min_error_text_deutch");

  assert.equal(q6.errors.length, 1);
  assert.equal(q6.errors[0].locText.renderedHtml, "custom_other_error_text_deutch");

  //check that when return to default locale onChange isCalled
  let onChangedCalled = 0;
  q1.errors[0].locText.onChanged = () => {
    onChangedCalled++;
  };
  survey.locale = "en";

  assert.equal(q1.errors.length, 1);
  assert.equal(onChangedCalled, 1);
  assert.equal(q1.errors[0].locText.renderedHtml, "Response required.");
});
QUnit.test("First page with conditions. Make the second only page visible/invisible", function (assert) {
  const survey = new SurveyModel({
    pages: [{
      name: "page1",
      elements: [{
        type: "radiogroup",
        name: "question1",
        choices: [1, 2]
      }]
    },
    {
      name: "page2",
      elements: [{
        type: "text",
        name: "question2"
      }],
      visibleIf: "{question1} = 1"
    }],
    firstPageIsStarted: true
  });
  assert.equal(survey.getPropertyValue("isStartedState"), true, "the state is started");
  assert.equal(survey.startPage.name, "page1", "The started page");
  assert.equal(survey.isShowingPage, true, "show the first page");
  assert.equal(survey.state, "starting", "The state is starting");
});
QUnit.test("hasDescription is not updated on changing locale", function (assert) {
  const survey = new SurveyModel({
    pages: [{
      name: "page1",
      title: "Page title",
      description: {
        "de": "desc"
      },
      elements: [{
        type: "text",
        name: "q1",
        description: {
          "de": "desc"
        },
      }]
    }]
  });
  const page = survey.pages[0];
  const question = survey.getQuestionByName("q1");
  assert.notOk(page.hasDescription, "Page description is not shown for 'en'");
  assert.notOk(question.hasDescription, "Question description is not shown for 'en'");
  survey.locale = "de";
  assert.equal(page.hasDescription, true, "Page description is shown for 'de'");
  assert.equal(question.hasDescription, true, "Question description is shown for 'de'");
  survey.locale = "";
});
QUnit.test("hasDescription is isDesignMode", function (assert) {
  const commentDescriptionProperty = Serializer.getProperty("comment", "description");
  const oldValue = commentDescriptionProperty.placeholder;
  commentDescriptionProperty.placeholder = "Q placeholder";

  const survey = new SurveyModel({});
  survey["_isDesignMode"] = true;
  survey.fromJSON({
    pages: [{
      name: "page1",
      title: "Page title",
      elements: [{
        type: "text",
        name: "q1",
      }, {
        type: "comment",
        name: "q2",
      }]
    }]
  });
  const q1 = survey.getQuestionByName("q1");
  const q2 = survey.getQuestionByName("q2");
  assert.notOk(q1.hasDescription, "text description is not shown");
  assert.ok(q2.hasDescription, "comment description is shown");
  const q3 = survey.currentPage.addNewQuestion("text", "q3");
  const q4 = survey.currentPage.addNewQuestion("comment", "q4");
  assert.notOk(q3.hasDescription, "text description is not shown, on adding question");
  assert.ok(q4.hasDescription, "comment description is shown, on adding question");

  commentDescriptionProperty.placeholder = oldValue;
});
QUnit.test("Test survey with custom type", function (assert) {
  JsonObject.metaData.addClass(
    "sortablelist",
    [
      { name: "hasOther", visible: false },
      { name: "storeOthersAsComment", visible: false },
      { name: "hasNone", visible: false },
      { name: "renderAs", visible: false },
      { name: "checkboxClass", visible: false },
      { name: "hasSelectAll", visible: false },
      { name: "noneText", visible: false },
      { name: "selectAllText", visible: false },
    ],
    null,
    "checkbox"
  );
  const survey = new SurveyModel({
    questions: [
      {
        type: "sortablelist",
        name: "lifepriopity",
        title: "Life Priorities ",
        isRequired: true,
        colCount: 0,
        choices: ["family", "work", "pets", "travels", "games"],
      },
    ],
  });
  assert.equal(survey.getAllQuestions().length, 1);
});
QUnit.test("progress is not changed on the start page", function (assert) {
  const survey = new SurveyModel({
    pages: [
      {
        name: "page1",
        elements: [
          {
            type: "checkbox",
            name: "q1",
            choices: ["1"]
          }
        ]
      },
      {
        name: "page2",
        elements: [
          {
            type: "checkbox",
            name: "q2",
            choices: ["1", "2", "3"]
          },
          {
            type: "checkbox",
            name: "q3",
            visibleIf: "{q2} == ['1']",
            choices: ["1", "2", "3"]
          },
        ]
      },
      {
        name: "page3",
        elements: [
          {
            type: "comment",
            name: "q4",
          }
        ]
      }
    ],

    showProgressBar: "bottom",
    firstPageIsStarted: true,
    questionsOnPageMode: "questionPerPage",
    widthMode: "static"
  });
  const question = survey.pages[0].elements[0] as any;
  let progressChangeCount = 0;
  survey.onPropertyChanged.add((s, o) => {
    if (o.name === "progressText") {
      progressChangeCount++;
    }
  });
  assert.equal(progressChangeCount, 0, "Initial progress call count");
  question.value = ["1"];
  assert.equal(progressChangeCount, 0, "Progress hasn't been called");
});
QUnit.test("Make sure that panel is not collapsed on focusing the question, #2", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        type: "panel",
        name: "p1",
        elements: [
          {
            type: "panel",
            name: "p2",
            elements: [
              { type: "text", name: "q1" }
            ]
          }
        ]
      }
    ],
  });
  const p1 = survey.getPanelByName("p1");
  const p2 = survey.getPanelByName("p1");
  const question = survey.getQuestionByName("q1");
  p1.collapse();
  p2.collapse();
  question.focus();
  assert.equal(p2.isExpanded, true, "Expand panel, p2");
  assert.equal(p1.isExpanded, true, "Expand panel, p1");
});
QUnit.test("Set question choices for disposed survey", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        type: "dropdown",
        name: "q1",
        choices: [1, 2]
      }
    ],
  });
  const question = <QuestionDropdownModel>survey.getQuestionByName("q1");
  survey.dispose();
  question.choices = [1, 2, 3];
  assert.equal(question.choices.length, 2, "There is not errors, choices still the same");
  assert.notOk(question.survey, "Survey is not set");
  assert.notOk(question.data, "data is not set");
});
QUnit.test("Expression for questions with a lot of dots", function (assert) {
  const survey = new SurveyModel({
    elements: [
      { type: "text", name: "q1.1" },
      { type: "text", name: "q1.1.2", visibleIf: "{q1.1} = 'a'" },
      { type: "text", name: "q1.1.2.3", visibleIf: "{q1.1.2} = 'a'" },
      { type: "text", name: "q1.1.2.3.4", visibleIf: "{q1.1.2.3} = 'a'" },
      { type: "text", name: "q1.1.2.3.4.5", visibleIf: "{q1.1.2.3.4} = 'a'" }
    ],
  });
  const question1_1 = survey.getQuestionByName("q1.1");
  const question1_1_2 = survey.getQuestionByName("q1.1.2");
  const question1_1_3_3 = survey.getQuestionByName("q1.1.2.3");
  const question1_1_2_3_4 = survey.getQuestionByName("q1.1.2.3.4");
  const question1_1_2_3_4_5 = survey.getQuestionByName("q1.1.2.3.4.5");
  assert.equal(question1_1_2.visible, false, "question1_1_2 false");
  question1_1.value = "a";
  assert.equal(question1_1_2.visible, true, "question1_1_2 true");
  assert.equal(question1_1_3_3.visible, false, "question1_1_2_3 false");
  question1_1_2.value = "a";
  assert.equal(question1_1_3_3.visible, true, "question1_1_2_3 true");
  assert.equal(question1_1_2_3_4.visible, false, "question1_1_2_3_4 false");
  question1_1_3_3.value = "a";
  assert.equal(question1_1_2_3_4.visible, true, "question1_1_2_3_4 true");
  assert.equal(question1_1_2_3_4_5.visible, false, "question1_1_2_3_4_5 false");
  question1_1_2_3_4.value = "a";
  assert.equal(question1_1_2_3_4_5.visible, true, "question1_1_2_3_4_5 true");
});
QUnit.test("Expression for questions with a lot of dots #2", function (assert) {
  const survey = new SurveyModel({
    "elements": [
      {
        "type": "radiogroup",
        "name": "WF4.1",
        "choices": [
          "Restricted",
          "Confidential",
          "Internal",
          "Public",
          "Do Not Know"
        ]
      },
      {
        "type": "radiogroup",
        "name": "WF4.4",
        "visibleIf": "{WF4.1}='Restricted' or {WF4.1} ='Confidential' or {WF4.1} ='Internal' or {WF4.1} ='Public'",
        "choices": ["Yes", "No"]
      },
      {
        "type": "radiogroup",
        "name": "WF4.4.1",
        "visibleIf": "{WF4.4} = 'Yes'",
        "choices": ["Yes", "No"]
      },
      {
        "type": "radiogroup",
        "name": "WF4.4.1.1",
        "visibleIf": "{WF4.4.1}='Yes'",
        "choices": [1, 2, 3]
      }
    ]
  });
  const questionWF4_1 = survey.getQuestionByName("WF4.1");
  const questionWF4_4 = survey.getQuestionByName("WF4.4");
  const questionWF4_4_1 = survey.getQuestionByName("WF4.4.1");
  const questionWF4_4_1_1 = survey.getQuestionByName("WF4.4.1.1");

  assert.equal(questionWF4_4.visible, false, "questionWF4_4 false");
  questionWF4_1.value = "Public";
  assert.equal(questionWF4_4.visible, true, "questionWF4_4 true");

  assert.equal(questionWF4_4_1.visible, false, "questionWF4_4_1 false");
  questionWF4_4.value = "Yes";
  assert.equal(questionWF4_4_1.visible, true, "questionWF4_4_1 true");

  assert.equal(questionWF4_4_1_1.visible, false, "questionWF4_4_1_1 false");
  questionWF4_4_1.value = "Yes";
  assert.equal(questionWF4_4_1_1.visible, true, "questionWF4_4_1_1 true");
});

QUnit.test("selectbase.keepIncorrectValues & survey.keepIncorrectValues", function (assert) {
  const survey = new SurveyModel({
    "elements": [
      {
        "type": "radiogroup",
        "name": "q1",
        "choices": ["item1", "item2"]
      }
    ]
  });
  const question = <QuestionRadiogroupModel>survey.getQuestionByName("q1");
  question.value = "item3";
  survey.clearIncorrectValues();
  assert.equal(true, question.isEmpty(), "clear incorrect value, #1");
  question.keepIncorrectValues = true;
  question.value = "item3";
  survey.clearIncorrectValues();
  assert.equal("item3", question.value, "keep incorrect value, #2");

  question.keepIncorrectValues = false;
  survey.clearIncorrectValues();
  assert.equal(true, question.isEmpty(), "clear incorrect value, #3");

  survey.keepIncorrectValues = true;
  question.value = "item3";
  survey.clearIncorrectValues();
  assert.equal("item3", question.value, "keep incorrect value, #4");

  survey.keepIncorrectValues = false;
  question.value = "item3";
  survey.clearIncorrectValues();
  assert.equal(true, question.isEmpty(), "clear incorrect value, #5");
});

QUnit.test("no scrolling to page top after focus a question on another page - https://github.com/surveyjs/survey-library/issues/5346", function (assert) {
  const done = assert.async();
  const survey = new SurveyModel({
    "pages": [
      {
        "name": "page1",
        "elements": [
          {
            "type": "radiogroup",
            "name": "question1",
            "choices": [
              "Item 3"
            ]
          }
        ]
      },
      {
        "name": "page2",
        "elements": [
          {
            "type": "dropdown",
            "name": "question66",
            "choices": [
              "Item 1",
            ]
          }
        ]
      }
    ]
  });

  let log = "";
  const qName = "question66";
  survey.onScrollToTop.add((s, o) => {
    log += "->" + o.element.name;
  });
  survey.onCurrentPageChanged.add((s, o) => {
    setTimeout(() => survey.afterRenderPage(undefined as any), 1);
  });
  assert.equal(log, "", "initially no scrolling");
  survey.focusQuestion(qName);
  setTimeout(() => {
    assert.equal(log, "->" + qName, "no scrolling after page changed and focused a question, scroll to the question only");
    done();
  }, 2);
});

QUnit.test("scrolling to page top after current page changed", function (assert) {
  const done1 = assert.async();
  const done2 = assert.async();
  const done3 = assert.async();
  const timeOut = 2;

  const survey = new SurveyModel({
    "pages": [
      {
        "name": "page1",
        "elements": [
          {
            "type": "radiogroup",
            "name": "q1",
            "choices": ["Item 3"]
          }
        ]
      },
      {
        "name": "page2",
        "elements": [
          {
            "type": "dropdown",
            "name": "q2",
            "choices": ["Item 1"]
          }
        ]
      }
    ]
  });
  let scrollCount = 0;
  survey.onScrollingElementToTop.add((s, o) => {
    scrollCount++;
  });

  assert.equal(survey["isCurrentPageRendered"] === undefined, true, "load survey");

  survey.afterRenderPage(<HTMLElement>{});
  assert.equal(survey["isCurrentPageRendered"] === true, true, "render first page #1");

  survey.afterRenderPage(<HTMLElement>{});
  assert.equal(survey["isCurrentPageRendered"] === true, true, "render first page #2");

  setTimeout(() => {
    assert.equal(scrollCount, 0);

    survey.nextPage();
    assert.equal(survey["isCurrentPageRendered"] === false, true, "go to second page");

    survey.afterRenderPage(<HTMLElement>{});
    assert.equal(survey["isCurrentPageRendered"] === true, true, "render second page");

    setTimeout(() => {
      assert.equal(scrollCount, 1, "scrolling after going to second page");

      survey.prevPage();
      assert.equal(survey["isCurrentPageRendered"] === false, true, "go to first page");

      survey.afterRenderPage(<HTMLElement>{});
      assert.equal(survey["isCurrentPageRendered"] === true, true, "render first page #3");

      setTimeout(() => {
        assert.equal(scrollCount, 2, "scrolling after back to first page");

        done3();
      }, timeOut);
      done2();
    }, timeOut);
    done1();
  }, timeOut);
});

QUnit.test("check descriptionLocation change css classes", function (assert) {
  const survey = new SurveyModel({
    "pages": [
      {
        "name": "page1",
        "elements": [
          {
            "type": "text",
            "description": "question-description",
            "descriptionLocation": "hidden",
            "name": "question1",
          }
        ]
      },
    ]
  });
  survey.css = {
    question: {
      description: "description_default",
      descriptionUnderInput: "description_under_input"
    }
  };
  const question = survey.getAllQuestions()[0];
  assert.equal(question.cssDescription, "description_default");
  question.descriptionLocation = "underTitle";
  assert.equal(question.cssDescription, "description_default");
  question.descriptionLocation = "underInput";
  assert.equal(question.cssDescription, "description_default description_under_input");
});
QUnit.test("Get first focused question on collapsed question", function (assert) {
  const survey = new SurveyModel({
    elements: [
      { type: "text", name: "q1", state: "collapsed", isRequired: true },
      { type: "text", name: "q2" }
    ],
  });
  const page = survey.pages[0];
  assert.equal(page.getFirstQuestionToFocus().name, "q2", "q1 is in collapsed panel");
  assert.equal(page.getFirstQuestionToFocus(false, true).name, "q1", "ignore collapsed state");
  page.hasErrors(true);
  assert.equal(page.getFirstQuestionToFocus(true).name, "q1", "q1 has error");
});
QUnit.test("Check getProgressCssClasses method", function (assert) {
  const survey = new SurveyModel({
    "showProgressBar": "top",
    elements: [
      { type: "text", name: "q1", state: "collapsed", isRequired: true },
      { type: "text", name: "q2" }
    ],
  });
  survey.css = {
    progress: "test_progress",
    progressTop: "test_progress_top",
    progressBottom: "test_progress_bottom"
  };
  assert.equal(survey.getProgressCssClasses(), "test_progress test_progress_top");
  survey.showProgressBar = "bottom";
  assert.equal(survey.getProgressCssClasses(), "test_progress test_progress_bottom");
});
QUnit.test("settings.minWidth/maxWidth", function (assert) {
  const oldMinWidth = settings.minWidth;
  const oldMaxWidth = settings.maxWidth;
  settings.minWidth = "0px";
  settings.maxWidth = "500px";
  const survey = new SurveyModel({
    "showProgressBar": "top",
    elements: [
      { type: "text", name: "q1" },
      { type: "text", name: "q2", minWidth: "50px" },
      { type: "text", name: "q3", maxWidth: "90%" },
      { type: "paneldynamic", name: "q4" },
    ],
  });
  const q1 = survey.getQuestionByName("q1");
  const q2 = survey.getQuestionByName("q2");
  const q3 = survey.getQuestionByName("q3");
  const q4 = survey.getQuestionByName("q4");
  assert.equal(q1.minWidth, "0px", "q1 minWidth");
  assert.equal(q1.maxWidth, "500px", "q1 maxWidth");
  assert.equal(q2.minWidth, "50px", "q2 minWidth");
  assert.equal(q2.maxWidth, "500px", "q2 maxWidth");
  assert.equal(q3.minWidth, "0px", "q3 minWidth");
  assert.equal(q3.maxWidth, "90%", "q3 maxWidth");
  assert.equal(q4.minWidth, "auto", "q4 (paneldynamic) minWidth");
  settings.minWidth = oldMinWidth;
  settings.maxWidth = oldMaxWidth;
});

QUnit.test("getContainerContent - navigation", function (assert) {
  const json = {
    pages: [
      {
        "elements": [
          {
            required: true,
            "type": "rating",
            "name": "satisfaction",
          },
          {
            required: true,
            "type": "rating",
            "name": "recommend friends",
          }
        ]
      },
      {
        "elements": [
          {
            "type": "radiogroup",
            "name": "price to competitors",
          },
          {
            "type": "radiogroup",
            "name": "price",
          },
        ]
      },
    ]
  };

  let survey = new SurveyModel(json);
  survey.headerView = "basic";
  const getContainerContent = getContainerContentFunction(survey);

  assert.equal(survey.showNavigationButtons, true);
  assert.equal(survey.navigationButtonsLocation, "bottom");
  assert.equal(survey.progressBarType, "pages");
  assert.equal(survey.showProgressBar, false);

  assert.deepEqual(getContainerContent("header"), [], "default header");
  assert.deepEqual(getContainerContent("footer"), [], "default footer");
  assert.deepEqual(getContainerContent("contentTop"), [], "default contentTop");
  assert.deepEqual(getContainerContent("contentBottom"), [{
    "component": "sv-action-bar",
    "id": "buttons-navigation"
  }], "default contentBottom");
  assert.deepEqual(getContainerContent("left"), [], "default left");
  assert.deepEqual(getContainerContent("right"), [], "default right");

  survey.showNavigationButtons = "top";
  assert.deepEqual(getContainerContent("header"), [], "nav top header");
  assert.deepEqual(getContainerContent("footer"), [], "nav top footer");
  assert.deepEqual(getContainerContent("contentTop"), [{
    "component": "sv-action-bar",
    "id": "buttons-navigation"
  }], "nav top contentTop");
  assert.deepEqual(getContainerContent("contentBottom"), [], "nav top contentBottom");
  assert.deepEqual(getContainerContent("left"), [], "nav top left");
  assert.deepEqual(getContainerContent("right"), [], "nav top right");

  survey.showNavigationButtons = "both";
  assert.deepEqual(getContainerContent("header"), [], "nav both header");
  assert.deepEqual(getContainerContent("footer"), [], "nav both footer");
  assert.deepEqual(getContainerContent("contentTop"), [{
    "component": "sv-action-bar",
    "id": "buttons-navigation"
  }], "nav both contentTop");
  assert.deepEqual(getContainerContent("contentBottom"), [{
    "component": "sv-action-bar",
    "id": "buttons-navigation"
  }], "nav both contentBottom");
  assert.deepEqual(getContainerContent("left"), [], "nav both left");
  assert.deepEqual(getContainerContent("right"), [], "nav both right");

  survey.showTOC = true;
  assert.deepEqual(getContainerContent("header"), [], "nav left header");
  assert.deepEqual(getContainerContent("footer"), [], "nav left footer");
  assert.deepEqual(getContainerContent("contentTop"), [{
    "component": "sv-action-bar",
    "id": "buttons-navigation"
  }], "nav left contentTop");
  assert.deepEqual(getContainerContent("contentBottom"), [{
    "component": "sv-action-bar",
    "id": "buttons-navigation"
  }], "nav left contentBottom");
  assert.deepEqual(getContainerContent("left"), [{
    "component": "sv-navigation-toc",
    "id": "toc-navigation"
  }], "nav left left");
  assert.deepEqual(getContainerContent("right"), [], "nav left right");

  survey.tocLocation = "right";
  assert.deepEqual(getContainerContent("header"), [], "nav right header");
  assert.deepEqual(getContainerContent("footer"), [], "nav right footer");
  assert.deepEqual(getContainerContent("contentTop"), [{
    "component": "sv-action-bar",
    "id": "buttons-navigation"
  }], "nav right contentTop");
  assert.deepEqual(getContainerContent("contentBottom"), [{
    "component": "sv-action-bar",
    "id": "buttons-navigation"
  }], "nav right contentBottom");
  assert.deepEqual(getContainerContent("left"), [], "nav right left");
  assert.deepEqual(getContainerContent("right"), [{
    "component": "sv-navigation-toc",
    "id": "toc-navigation"
  }], "nav right right");

  survey.showProgressBar = "off";
  survey.showNavigationButtons = "none";
  survey.showTOC = false;
  assert.deepEqual(getContainerContent("header"), [], "nav none header");
  assert.deepEqual(getContainerContent("footer"), [], "nav none footer");
  assert.deepEqual(getContainerContent("contentTop"), [], "nav none contentTop");
  assert.deepEqual(getContainerContent("contentBottom"), [], "nav none contentBottom");
  assert.deepEqual(getContainerContent("left"), [], "nav none left");
  assert.deepEqual(getContainerContent("right"), [], "nav none right");
});

QUnit.test("getContainerContent - progress (legacyProgressBarView)", function (assert) {
  const json = {
    showNavigationButtons: "none",
    pages: [
      {
        "elements": [
          {
            required: true,
            "type": "rating",
            "name": "satisfaction",
          },
          {
            required: true,
            "type": "rating",
            "name": "recommend friends",
          }
        ]
      },
      {
        "elements": [
          {
            "type": "radiogroup",
            "name": "price to competitors",
          },
          {
            "type": "radiogroup",
            "name": "price",
          },
        ]
      },
    ]
  };

  try {
    settings.legacyProgressBarView = true;

    let survey = new SurveyModel(json);
    survey.headerView = "basic";
    const getContainerContent = getContainerContentFunction(survey);

    assert.equal(survey.showNavigationButtons, false);
    assert.equal(survey.progressBarType, "pages");
    assert.equal(survey.showProgressBar, false);

    assert.deepEqual(getContainerContent("header"), [], "default header");
    assert.deepEqual(getContainerContent("footer"), [], "default footer");
    assert.deepEqual(getContainerContent("contentTop"), [], "default contentTop");
    assert.deepEqual(getContainerContent("contentBottom"), [], "default contentBottom");
    assert.deepEqual(getContainerContent("left"), [], "default left");
    assert.deepEqual(getContainerContent("right"), [], "default right");

    survey.showProgressBar = "top";
    assert.deepEqual(getContainerContent("header"), [], "progress top header");
    assert.deepEqual(getContainerContent("center"), [{
      "component": "sv-progress-pages",
      "id": "progress-pages"
    }], "progress top center");
    assert.deepEqual(getContainerContent("footer"), [], "progress top footer");
    assert.deepEqual(getContainerContent("contentTop"), [], "progress top contentTop");
    assert.deepEqual(getContainerContent("contentBottom"), [], "progress top contentBottom");
    assert.deepEqual(getContainerContent("left"), [], "progress top left");
    assert.deepEqual(getContainerContent("right"), [], "progress top right");

    survey.showProgressBar = "bottom";
    assert.deepEqual(getContainerContent("header"), [], "progress bottom header");
    assert.deepEqual(getContainerContent("footer"), [{
      "component": "sv-progress-pages",
      "id": "progress-pages"
    }], "progress bottom footer");
    assert.deepEqual(getContainerContent("contentTop"), [], "progress bottom contentTop");
    assert.deepEqual(getContainerContent("contentBottom"), [], "progress bottom contentBottom");
    assert.deepEqual(getContainerContent("left"), [], "progress bottom left");
    assert.deepEqual(getContainerContent("right"), [], "progress bottom right");

    survey.showProgressBar = "both";
    assert.deepEqual(getContainerContent("header"), [], "progress both header");
    assert.deepEqual(getContainerContent("center"), [{
      "component": "sv-progress-pages",
      "id": "progress-pages"
    }], "progress both center");
    assert.deepEqual(getContainerContent("footer"), [{
      "component": "sv-progress-pages",
      "id": "progress-pages"
    }], "progress both footer");
    assert.deepEqual(getContainerContent("contentTop"), [], "progress both contentTop");
    assert.deepEqual(getContainerContent("contentBottom"), [], "progress both contentBottom");
    assert.deepEqual(getContainerContent("left"), [], "progress both left");
    assert.deepEqual(getContainerContent("right"), [], "progress both right");

    survey.progressBarType = "questions";
    assert.deepEqual(getContainerContent("header"), [], "progress questions both header");
    assert.deepEqual(getContainerContent("center"), [{
      "component": "sv-progress-questions",
      "id": "progress-questions"
    }], "progress questions both header");
    assert.deepEqual(getContainerContent("footer"), [{
      "component": "sv-progress-questions",
      "id": "progress-questions"
    }], "progress questions both footer");
    assert.deepEqual(getContainerContent("contentTop"), [], "progress questions both contentTop");
    assert.deepEqual(getContainerContent("contentBottom"), [], "progress questions both contentBottom");
    assert.deepEqual(getContainerContent("left"), [], "progress questions both left");
    assert.deepEqual(getContainerContent("right"), [], "progress questions both right");

    survey.showTOC = true;
    assert.deepEqual(getContainerContent("header"), [], "progress toc both header");
    assert.deepEqual(getContainerContent("center"), [{
      "component": "sv-progress-questions",
      "id": "progress-questions"
    }], "progress toc both center");
    assert.deepEqual(getContainerContent("footer"), [{
      "component": "sv-progress-questions",
      "id": "progress-questions"
    }], "progress toc both footer");
    assert.deepEqual(getContainerContent("contentTop"), [], "progress toc both contentTop");
    assert.deepEqual(getContainerContent("contentBottom"), [], "progress toc both contentBottom");
    assert.deepEqual(getContainerContent("left"), [{
      "component": "sv-navigation-toc",
      "id": "toc-navigation"
    }], "progress toc both left");
    assert.deepEqual(getContainerContent("right"), [], "progress toc both right");

    survey.showProgressBar = "off";
    survey.tocLocation = "left";
    assert.deepEqual(getContainerContent("header"), [], "progress toc left header");
    assert.deepEqual(getContainerContent("footer"), [], "progress toc left footer");
    assert.deepEqual(getContainerContent("contentTop"), [], "progress toc left contentTop");
    assert.deepEqual(getContainerContent("contentBottom"), [], "progress toc left contentBottom");
    assert.deepEqual(getContainerContent("left"), [{
      "component": "sv-navigation-toc",
      "id": "toc-navigation"
    }], "progress toc left left");
    assert.deepEqual(getContainerContent("right"), [], "progress toc left right");

    survey.tocLocation = "right";
    assert.deepEqual(getContainerContent("header"), [], "progress toc right header");
    assert.deepEqual(getContainerContent("footer"), [], "progress toc right footer");
    assert.deepEqual(getContainerContent("contentTop"), [], "progress toc right contentTop");
    assert.deepEqual(getContainerContent("contentBottom"), [], "progress toc right contentBottom");
    assert.deepEqual(getContainerContent("left"), [], "progress toc right left");
    assert.deepEqual(getContainerContent("right"), [{
      "component": "sv-navigation-toc",
      "id": "toc-navigation"
    }], "progress toc right right");

    survey.showTOC = false;
    assert.deepEqual(getContainerContent("header"), [], "default header");
    assert.deepEqual(getContainerContent("footer"), [], "default footer");
    assert.deepEqual(getContainerContent("contentTop"), [], "default contentTop");
    assert.deepEqual(getContainerContent("contentBottom"), [], "default contentBottom");
    assert.deepEqual(getContainerContent("left"), [], "default left");
    assert.deepEqual(getContainerContent("right"), [], "default right");

  }
  finally {
    settings.legacyProgressBarView = false;
  }
});

QUnit.test("getContainerContent - progress", function (assert) {
  surveyCss.currentType = "default";
  const json = {
    showNavigationButtons: "none",
    pages: [
      {
        "elements": [
          {
            required: true,
            "type": "rating",
            "name": "satisfaction",
          },
          {
            required: true,
            "type": "rating",
            "name": "recommend friends",
          }
        ]
      },
      {
        "elements": [
          {
            "type": "radiogroup",
            "name": "price to competitors",
          },
          {
            "type": "radiogroup",
            "name": "price",
          },
        ]
      },
    ]
  };

  let survey = new SurveyModel(json);
  survey.headerView = "basic";
  const getContainerContent = getContainerContentFunction(survey);

  assert.equal(survey.showNavigationButtons, false);
  assert.equal(survey.progressBarType, "pages");
  assert.equal(survey.showProgressBar, false);

  assert.deepEqual(getContainerContent("header"), [], "default header");
  assert.deepEqual(getContainerContent("footer"), [], "default footer");
  assert.deepEqual(getContainerContent("contentTop"), [], "default contentTop");
  assert.deepEqual(getContainerContent("contentBottom"), [], "default contentBottom");
  assert.deepEqual(getContainerContent("left"), [], "default left");
  assert.deepEqual(getContainerContent("right"), [], "default right");

  survey.showProgressBar = "top";
  assert.deepEqual(getContainerContent("header"), [], "progress top header");
  assert.deepEqual(getContainerContent("center"), [{
    "component": "sv-progress-buttons",
    "id": "progress-buttons"
  }], "progress top center");
  assert.deepEqual(getContainerContent("footer"), [], "progress top footer");
  assert.deepEqual(getContainerContent("contentTop"), [], "progress top contentTop");
  assert.deepEqual(getContainerContent("contentBottom"), [], "progress top contentBottom");
  assert.deepEqual(getContainerContent("left"), [], "progress top left");
  assert.deepEqual(getContainerContent("right"), [], "progress top right");

  survey.showProgressBar = "bottom";
  assert.deepEqual(getContainerContent("header"), [], "progress bottom header");
  assert.deepEqual(getContainerContent("footer"), [{
    "component": "sv-progress-buttons",
    "id": "progress-buttons"
  }], "progress bottom footer");
  assert.deepEqual(getContainerContent("contentTop"), [], "progress bottom contentTop");
  assert.deepEqual(getContainerContent("contentBottom"), [], "progress bottom contentBottom");
  assert.deepEqual(getContainerContent("left"), [], "progress bottom left");
  assert.deepEqual(getContainerContent("right"), [], "progress bottom right");

  survey.showProgressBar = "both";
  assert.deepEqual(getContainerContent("header"), [], "progress both header");
  assert.deepEqual(getContainerContent("center"), [{
    "component": "sv-progress-buttons",
    "id": "progress-buttons"
  }], "progress both center");
  assert.deepEqual(getContainerContent("footer"), [{
    "component": "sv-progress-buttons",
    "id": "progress-buttons"
  }], "progress both footer");
  assert.deepEqual(getContainerContent("contentTop"), [], "progress both contentTop");
  assert.deepEqual(getContainerContent("contentBottom"), [], "progress both contentBottom");
  assert.deepEqual(getContainerContent("left"), [], "progress both left");
  assert.deepEqual(getContainerContent("right"), [], "progress both right");

  survey.progressBarType = "questions";
  assert.deepEqual(getContainerContent("header"), [], "progress questions both header");
  assert.deepEqual(getContainerContent("center"), [{
    "component": "sv-progress-questions",
    "id": "progress-questions"
  }], "progress questions both header");
  assert.deepEqual(getContainerContent("footer"), [{
    "component": "sv-progress-questions",
    "id": "progress-questions"
  }], "progress questions both footer");
  assert.deepEqual(getContainerContent("contentTop"), [], "progress questions both contentTop");
  assert.deepEqual(getContainerContent("contentBottom"), [], "progress questions both contentBottom");
  assert.deepEqual(getContainerContent("left"), [], "progress questions both left");
  assert.deepEqual(getContainerContent("right"), [], "progress questions both right");

  survey.showTOC = true;
  assert.deepEqual(getContainerContent("header"), [], "progress toc both header");
  assert.deepEqual(getContainerContent("center"), [{
    "component": "sv-progress-questions",
    "id": "progress-questions"
  }], "progress toc both center");
  assert.deepEqual(getContainerContent("footer"), [{
    "component": "sv-progress-questions",
    "id": "progress-questions"
  }], "progress toc both footer");
  assert.deepEqual(getContainerContent("contentTop"), [], "progress toc both contentTop");
  assert.deepEqual(getContainerContent("contentBottom"), [], "progress toc both contentBottom");
  assert.deepEqual(getContainerContent("left"), [{
    "component": "sv-navigation-toc",
    "id": "toc-navigation"
  }], "progress toc both left");
  assert.deepEqual(getContainerContent("right"), [], "progress toc both right");

  survey.showProgressBar = "off";
  survey.tocLocation = "left";
  assert.deepEqual(getContainerContent("header"), [], "progress toc left header");
  assert.deepEqual(getContainerContent("footer"), [], "progress toc left footer");
  assert.deepEqual(getContainerContent("contentTop"), [], "progress toc left contentTop");
  assert.deepEqual(getContainerContent("contentBottom"), [], "progress toc left contentBottom");
  assert.deepEqual(getContainerContent("left"), [{
    "component": "sv-navigation-toc",
    "id": "toc-navigation"
  }], "progress toc left left");
  assert.deepEqual(getContainerContent("right"), [], "progress toc left right");

  survey.tocLocation = "right";
  assert.deepEqual(getContainerContent("header"), [], "progress toc right header");
  assert.deepEqual(getContainerContent("footer"), [], "progress toc right footer");
  assert.deepEqual(getContainerContent("contentTop"), [], "progress toc right contentTop");
  assert.deepEqual(getContainerContent("contentBottom"), [], "progress toc right contentBottom");
  assert.deepEqual(getContainerContent("left"), [], "progress toc right left");
  assert.deepEqual(getContainerContent("right"), [{
    "component": "sv-navigation-toc",
    "id": "toc-navigation"
  }], "progress toc right right");

  survey.showTOC = false;
  assert.deepEqual(getContainerContent("header"), [], "default header");
  assert.deepEqual(getContainerContent("footer"), [], "default footer");
  assert.deepEqual(getContainerContent("contentTop"), [], "default contentTop");
  assert.deepEqual(getContainerContent("contentBottom"), [], "default contentBottom");
  assert.deepEqual(getContainerContent("left"), [], "default left");
  assert.deepEqual(getContainerContent("right"), [], "default right");
});

QUnit.test("getContainerContent - do not show TOC on preview", function (assert) {
  const json = {
    showTOC: true,
    "showPreviewBeforeComplete": "showAllQuestions",
    pages: [
      {
        "elements": [
          {
            "type": "text",
            "name": "satisfaction",
          },
        ]
      },
      {
        "elements": [
          {
            "type": "radiogroup",
            "name": "price",
          },
        ]
      },
    ]
  };

  let survey = new SurveyModel(json);
  survey.headerView = "basic";
  const getContainerContent = getContainerContentFunction(survey);

  assert.deepEqual(getContainerContent("header"), [], "");
  assert.deepEqual(getContainerContent("footer"), [], "");
  assert.deepEqual(getContainerContent("contentTop"), [], "");
  assert.deepEqual(getContainerContent("contentBottom"), [{
    "component": "sv-action-bar",
    "id": "buttons-navigation"
  }], "");
  assert.deepEqual(getContainerContent("left"), [{
    "component": "sv-navigation-toc",
    "id": "toc-navigation"
  }], "show toc left");
  assert.deepEqual(getContainerContent("right"), [], "");

  survey.nextPage();
  survey.showPreview();

  assert.deepEqual(getContainerContent("header"), [], "");
  assert.deepEqual(getContainerContent("footer"), [], "");
  assert.deepEqual(getContainerContent("contentTop"), [], "");
  assert.deepEqual(getContainerContent("contentBottom"), [{
    "component": "sv-action-bar",
    "id": "buttons-navigation"
  }], "");
  assert.deepEqual(getContainerContent("left"), [], "do not show toc left");
  assert.deepEqual(getContainerContent("right"), [], "");
});

QUnit.test("getContainerContent - do not show TOC on start page", function (assert) {
  const json = {
    showTOC: true,
    firstPageIsStartPage: true,
    pages: [
      {
        "elements": [
          {
            "type": "text",
            "name": "q1",
          },
        ]
      },
      {
        "elements": [
          {
            "type": "text",
            "name": "q2",
          },
        ]
      },
      {
        "elements": [
          {
            "type": "text",
            "name": "q3",
          },
        ]
      }
    ]
  };

  let survey = new SurveyModel(json);
  survey.headerView = "basic";
  const getContainerContent = getContainerContentFunction(survey);

  assert.deepEqual(getContainerContent("header"), [], "");
  assert.deepEqual(getContainerContent("footer"), [], "");
  assert.deepEqual(getContainerContent("contentTop"), [], "");
  assert.deepEqual(getContainerContent("contentBottom"), [{
    "component": "sv-action-bar",
    "id": "buttons-navigation"
  }], "");
  assert.deepEqual(getContainerContent("left"), [], "empty on the start page");

  survey.start();
  assert.deepEqual(getContainerContent("header"), [], "");
  assert.deepEqual(getContainerContent("footer"), [], "");
  assert.deepEqual(getContainerContent("contentTop"), [], "");
  assert.deepEqual(getContainerContent("contentBottom"), [{
    "component": "sv-action-bar",
    "id": "buttons-navigation"
  }], "");
  assert.deepEqual(getContainerContent("left"), [{
    "component": "sv-navigation-toc",
    "id": "toc-navigation"
  }], "show toc left");
  assert.deepEqual(getContainerContent("right"), [], "");
});

QUnit.test("getContainerContent - do not show buttons progress on completed page", function (assert) {
  const json = {
    "progressBarType": "buttons",
    "showProgressBar": "top",
    pages: [
      {
        "elements": [
          {
            "type": "text",
            "name": "q1",
          },
        ]
      },
      {
        "elements": [
          {
            "type": "text",
            "name": "q2",
          },
        ]
      },
      {
        "elements": [
          {
            "type": "text",
            "name": "q3",
          },
        ]
      }
    ]
  };

  let survey = new SurveyModel(json);
  survey.headerView = "basic";
  const getContainerContent = getContainerContentFunction(survey);

  assert.deepEqual(getContainerContent("header"), [], "");
  assert.deepEqual(getContainerContent("footer"), [], "");
  assert.deepEqual(getContainerContent("center"), [{
    "component": "sv-progress-buttons",
    "id": "progress-buttons"
  }], "");
  assert.deepEqual(getContainerContent("contentTop"), [], "");
  assert.deepEqual(getContainerContent("contentBottom"), [{
    "component": "sv-action-bar",
    "id": "buttons-navigation"
  }], "");
  assert.deepEqual(getContainerContent("left"), [], "");
  assert.deepEqual(getContainerContent("right"), [], "");

  survey.doComplete();

  assert.deepEqual(getContainerContent("header"), [], "");
  assert.deepEqual(getContainerContent("footer"), [], "");
  assert.deepEqual(getContainerContent("contentTop"), [], "");
  assert.deepEqual(getContainerContent("contentBottom"), [{
    "component": "sv-action-bar",
    "id": "buttons-navigation"
  }], "");
  assert.deepEqual(getContainerContent("left"), [], "");
  assert.deepEqual(getContainerContent("right"), [], "");
});
QUnit.test("getContainerContent - do not show advanced header on completed page", function (assert) {
  const json = {
    pages: [
      {
        "elements": [
          {
            "type": "text",
            "name": "q1",
          },
        ]
      },
    ]
  };

  let survey = new SurveyModel(json);
  function getContainerContent(container: LayoutElementContainer) {
    let result = survey.getContainerContent(container);
    result.forEach(item => {
      delete item["data"];
      delete item["getData"];
      delete item["processResponsiveness"];
    });
    return result;
  }

  assert.deepEqual(getContainerContent("header"), [{
    "component": "sv-header",
    "container": "header",
    "id": "advanced-header",
    "index": -100
  }], "header for running survey");
  assert.deepEqual(getContainerContent("footer"), [], "");
  assert.deepEqual(getContainerContent("contentTop"), [], "");
  assert.deepEqual(getContainerContent("contentBottom"), [{
    "component": "sv-action-bar",
    "id": "buttons-navigation"
  }], "");
  assert.deepEqual(getContainerContent("left"), [], "");
  assert.deepEqual(getContainerContent("right"), [], "");

  survey.doComplete();

  assert.deepEqual(getContainerContent("header"), [], "header on complete page");
  assert.deepEqual(getContainerContent("footer"), [], "");
  assert.deepEqual(getContainerContent("contentTop"), [], "");
  assert.deepEqual(getContainerContent("contentBottom"), [{
    "component": "sv-action-bar",
    "id": "buttons-navigation"
  }], "");
  assert.deepEqual(getContainerContent("left"), [], "");
  assert.deepEqual(getContainerContent("right"), [], "");
});
QUnit.test("getContainerContent - do show advanced header on completed page if showHeaderOnCompletePage is set", function (assert) {
  const json = {
    pages: [
      {
        "elements": [
          {
            "type": "text",
            "name": "q1",
          },
        ]
      },
    ]
  };

  let survey = new SurveyModel(json);
  function getContainerContent(container: LayoutElementContainer) {
    let result = survey.getContainerContent(container);
    result.forEach(item => {
      delete item["data"];
      delete item["getData"];
      delete item["processResponsiveness"];
    });
    return result;
  }

  assert.equal(survey.showHeaderOnCompletePage, "auto");
  survey.showHeaderOnCompletePage = true;

  assert.deepEqual(getContainerContent("header"), [{
    "component": "sv-header",
    "container": "header",
    "id": "advanced-header",
    "index": -100
  }], "header for running survey");
  assert.deepEqual(getContainerContent("footer"), [], "");
  assert.deepEqual(getContainerContent("contentTop"), [], "");
  assert.deepEqual(getContainerContent("contentBottom"), [{
    "component": "sv-action-bar",
    "id": "buttons-navigation"
  }], "");
  assert.deepEqual(getContainerContent("left"), [], "");
  assert.deepEqual(getContainerContent("right"), [], "");

  survey.doComplete();

  assert.deepEqual(getContainerContent("header"), [{
    "component": "sv-header",
    "container": "header",
    "id": "advanced-header",
    "index": -100
  }], "header on complete page");
  assert.deepEqual(getContainerContent("footer"), [], "");
  assert.deepEqual(getContainerContent("contentTop"), [], "");
  assert.deepEqual(getContainerContent("contentBottom"), [{
    "component": "sv-action-bar",
    "id": "buttons-navigation"
  }], "");
  assert.deepEqual(getContainerContent("left"), [], "");
  assert.deepEqual(getContainerContent("right"), [], "");
});

const structedDataSurveyJSON = {
  pages: [
    {
      name: "page1",
      elements: [
        { type: "text", name: "q1" },
        {
          type: "panel", name: "panel1",
          elements: [
            { type: "text", name: "q2" },
            {
              type: "panel", name: "panel2",
              elements: [{ type: "text", name: "q3" }]
            }
          ]
        }
      ]
    },
    {
      name: "page2",
      elements: [
        { type: "text", name: "q21" },
        {
          type: "panel", name: "panel21",
          elements: [
            { type: "text", name: "q22" }
          ]
        }
      ]
    }
  ]
};
QUnit.test("getStructuredData function", function (assert) {
  const survey = new SurveyModel(structedDataSurveyJSON);
  survey.setValue("q1", 100);
  survey.setValue("q2", 200);
  survey.setValue("q3", 300);
  survey.setValue("q21", 2100);
  survey.setValue("q22", 2200);
  const data = survey.data;
  assert.deepEqual(survey.getStructuredData(true, 0), data, "Level is 0, true");
  assert.deepEqual(survey.getStructuredData(false, 0), data, "Level is 0, false");
  assert.deepEqual(survey.getStructuredData(), {
    page1: { q1: 100, panel1: { q2: 200, panel2: { q3: 300 } } },
    page2: { q21: 2100, panel21: { q22: 2200 } },
  }, "includePages: true, level: -1");
  assert.deepEqual(survey.getStructuredData(false), {
    q1: 100, panel1: { q2: 200, panel2: { q3: 300 } },
    q21: 2100, panel21: { q22: 2200 },
  }, "includePages: false, level: -1");
  assert.deepEqual(survey.getStructuredData(true, 1), {
    page1: { q1: 100, q2: 200, q3: 300 },
    page2: { q21: 2100, q22: 2200 },
  }, "includePages: true, level: 1");
  assert.deepEqual(survey.getStructuredData(false, 1), {
    q1: 100, panel1: { q2: 200, q3: 300 },
    q21: 2100, panel21: { q22: 2200 },
  }, "includePages: false, level: 1");
  assert.deepEqual(survey.getStructuredData(true, 2), {
    page1: { q1: 100, panel1: { q2: 200, q3: 300 } },
    page2: { q21: 2100, panel21: { q22: 2200 } },
  }, "includePages: true, level: 2");
  assert.deepEqual(survey.getStructuredData(false, 2), {
    q1: 100, panel1: { q2: 200, panel2: { q3: 300 } },
    q21: 2100, panel21: { q22: 2200 },
  }, "includePages: false, level: 2");
  assert.deepEqual(survey.getStructuredData(true, 3), {
    page1: { q1: 100, panel1: { q2: 200, panel2: { q3: 300 } } },
    page2: { q21: 2100, panel21: { q22: 2200 } },
  }, "includePages: true, level: 3");
  assert.deepEqual(survey.getStructuredData(false, 3), {
    q1: 100, panel1: { q2: 200, panel2: { q3: 300 } },
    q21: 2100, panel21: { q22: 2200 },
  }, "includePages: false, level: 3");

});
QUnit.test("getData function", function (assert) {
  const survey = new SurveyModel(structedDataSurveyJSON);
  survey.setValue("q1", 100);
  survey.setValue("q2", 200);
  survey.setValue("q3", 300);
  survey.setValue("q21", 2100);
  survey.setValue("q22", 2200);
  const data = survey.data;
  assert.deepEqual(survey.getData(), data, "survey.getData()");
  assert.deepEqual(survey.getData({}), data, "survey.getData({})");
  assert.deepEqual(survey.getData({ includePages: false, includePanels: false }), data, "survey.getData({ includePages: false, includePanels: false })");
  assert.deepEqual(survey.getData({ includePages: true, includePanels: false }), {
    page1: { q1: 100, q2: 200, q3: 300 },
    page2: { q21: 2100, q22: 2200 },
  }, "survey.getData({ includePages: true, includePanels: false })");
  assert.deepEqual(survey.getData({ includePages: true, includePanels: true }), {
    page1: { q1: 100, panel1: { q2: 200, panel2: { q3: 300 } } },
    page2: { q21: 2100, panel21: { q22: 2200 } },
  }, "survey.getData({ includePages: true, includePanels: true })");
  assert.deepEqual(survey.getData({ includePages: false, includePanels: true }), {
    q1: 100, panel1: { q2: 200, panel2: { q3: 300 } },
    q21: 2100, panel21: { q22: 2200 },
  }, "survey.getData({ includePages: true, includePanels: true })");
});
QUnit.test("setStructuredData function", function (assert) {
  const survey = new SurveyModel(structedDataSurveyJSON);
  survey.setStructuredData({
    page1: { q1: 100, panel1: { q2: 200, panel2: { q3: 300 } } },
    page2: { q21: 2100, panel21: { q22: 2200 } }
  });
  assert.deepEqual(survey.data, { q1: 100, q2: 200, q3: 300, q21: 2100, q22: 2200 }, "#1");
  survey.setStructuredData({
    q1: 101, panel1: { q2: 201, panel2: { q3: 301 } },
    q21: 2101, panel21: { q22: 2201 }
  });
  assert.deepEqual(survey.data, { q1: 101, q2: 201, q3: 301, q21: 2101, q22: 2201 }, "#2");
  survey.setStructuredData({
    page1: { q1: 102, q2: 202, q3: 302 },
    page2: { q21: 2102, q22: 2202 },
  });
  assert.deepEqual(survey.data, { q1: 102, q2: 202, q3: 302, q21: 2102, q22: 2202 }, "#3");
  survey.setStructuredData({ page1: { q1: 103 } }, true);
  assert.deepEqual(survey.data, { q1: 103, q2: 202, q3: 302, q21: 2102, q22: 2202 }, "#4");
  survey.setStructuredData({ page1: { q1: 104 } });
  assert.deepEqual(survey.data, { q1: 104 }, "#5");
});

QUnit.test("check titleNumInline cssClass", function (assert) {
  const survey = new SurveyModel({
    showQuestionNumbers: "on",
    questionStartIndex: "1.1.1",
    elements: [{
      type: "panel",
      name: "p1",
      title: "panel",
      showNumber: true,
      elements: [
        {
          type: "html",
          name: "html"
        },
      ]
    },
    {
      type: "text",
      name: "q1"
    }
    ]
  });
  const customInlineClass = "custom_inline_class";
  survey.css = {
    question: {
      titleNumInline: customInlineClass
    },
    panel: {
      titleNumInline: customInlineClass
    }
  };
  const question = survey.getQuestionByName("q1");
  const panel = survey.getPanelByName("p1");
  assert.ok(question.cssTitle.includes(customInlineClass));
  assert.ok(panel.cssTitle.includes(customInlineClass));
  survey.questionStartIndex = "1.1";
  assert.notOk(question.cssTitle.includes(customInlineClass));
  assert.notOk(panel.cssTitle.includes(customInlineClass));
});

QUnit.test("Survey setDesignMode should not trigger pages regeneration if not changed", function (assert) {
  var survey = twoPageSimplestSurvey();
  survey.isSinglePage = true;
  assert.equal(survey.visiblePages.length, 1, "We should have 1 page, #1");
  assert.equal(survey.currentPage.elements.length, 2, "We should have 2 panels, #1");
  survey.setDesignMode(false);
  assert.equal(survey.visiblePages.length, 1, "We should have 1 page, #2");
  assert.equal(survey.currentPage.elements.length, 2, "We should have 2 panels, #2");
  survey.setDesignMode(true);
  assert.equal(survey.visiblePages.length, 2, "We should have 2 pages, #3");
});
QUnit.test("Try again button should call onComplete", function (assert) {
  class SurveyModelTester extends SurveyModel {
    public doErrorAction(): void {
      const action = this.createTryAgainAction().action;
      if (!!action) action();
    }
  }
  var survey = new SurveyModelTester({ elements: [{ type: "text", name: "q1" }] });
  let attempts = 0;
  survey.onComplete.add((sender, options) => {
    attempts++;
    if (attempts < 3) {
      survey.doErrorAction();
    }
  });
  survey.doComplete();
  assert.equal(survey.state, "completed", "the survey is completed");
  assert.equal(attempts, 3, "There were 3 attempts");
});
QUnit.test("Use variables as default values in expression", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        type: "text",
        name: "q2",
        title: "myB = {myB}",
        defaultValueExpression: "{myB}",
      },
      {
        type: "text",
        name: "q1",
        title: "myA = {myA}",
        defaultValueExpression: "{myA}",
      },
      {
        type: "text",
        name: "q3",
        title: "myC = {myC}",
        defaultValueExpression: "{myC}",
      },
    ]
  });
  const q1 = survey.getQuestionByName("q1");
  const q2 = survey.getQuestionByName("q2");
  const q3 = survey.getQuestionByName("q3");
  survey.setValue("myA", "AAA");
  survey.setValue("myB", "BBB");
  survey.setValue("myC", "CCC");
  assert.equal(q1.value, "AAA", "q1.value");
  assert.equal(q2.value, "BBB", "q2.value");
  assert.equal(q3.value, "CCC", "q3.value");
});

QUnit.test("backgroundImage", assert => {
  const imageUrl = "https://image.shutterstock.com/image-photo/agave-cactus-abstract-natural-pattern-600w-1056037874.jpg";
  const survey = new SurveyModel({
    "backgroundImage": imageUrl,
  });
  assert.equal(survey.backgroundImage, imageUrl, "backgroundImage");
  assert.equal(survey.renderBackgroundImage, wrapUrlForBackgroundImage(imageUrl), "renderBackgroundImage");
});

QUnit.test("If localizable string has isLocalizable set to false then it should have only one value", assert => {
  const titleProp = Serializer.findProperty("survey", "title");
  titleProp.isLocalizable = false;
  const survey = new SurveyModel();
  survey.title = "val1";
  survey.locale = "de";
  survey.title = "val2";
  survey.locale = "fr";
  survey.title = "val3";
  assert.equal(survey.locTitle.getJson(), "val3", "It supports only one locale");
  titleProp.isLocalizable = true;
});

QUnit.test("getContainerContent - navigation with page.navigationButtonsVisibility", function (assert) {
  const json = {
    pages: [
      {
        "navigationButtonsVisibility": "hide",
        "elements": [
          {
            required: true,
            "type": "rating",
            "name": "satisfaction",
          },
          {
            required: true,
            "type": "rating",
            "name": "recommend friends",
          }
        ]
      },
      {
        "navigationButtonsVisibility": "show",
        "elements": [
          {
            "type": "radiogroup",
            "name": "price to competitors",
          },
          {
            "type": "radiogroup",
            "name": "price",
          },
        ]
      },
    ]
  };

  let survey = new SurveyModel(json);
  survey.headerView = "basic";
  function getContainerContent(container: LayoutElementContainer) {
    let result = survey.getContainerContent(container);
    result.forEach(item => {
      delete item["data"];
      delete item["getData"];
    });
    return result;
  }

  assert.equal(survey.showNavigationButtons, true);
  assert.equal(survey.navigationButtonsLocation, "bottom");

  assert.deepEqual(getContainerContent("header"), [], "nav none header");
  assert.deepEqual(getContainerContent("footer"), [], "nav none footer");
  assert.deepEqual(getContainerContent("contentTop"), [], "nav none contentTop");
  assert.deepEqual(getContainerContent("contentBottom"), [], "nav none contentBottom");
  assert.deepEqual(getContainerContent("left"), [], "nav none left");
  assert.deepEqual(getContainerContent("right"), [], "nav none right");

  survey.nextPage();
  assert.deepEqual(getContainerContent("header"), [], "default header");
  assert.deepEqual(getContainerContent("footer"), [], "default footer");
  assert.deepEqual(getContainerContent("contentTop"), [], "default contentTop");
  assert.deepEqual(getContainerContent("contentBottom"), [{
    "component": "sv-action-bar",
    "id": "buttons-navigation"
  }], "default contentBottom");
  assert.deepEqual(getContainerContent("left"), [], "default left");
  assert.deepEqual(getContainerContent("right"), [], "default right");

  survey.showNavigationButtons = "none";
  assert.deepEqual(getContainerContent("header"), [], "default header");
  assert.deepEqual(getContainerContent("footer"), [], "default footer");
  assert.deepEqual(getContainerContent("contentTop"), [], "default contentTop");
  assert.deepEqual(getContainerContent("contentBottom"), [{
    "component": "sv-action-bar",
    "id": "buttons-navigation"
  }], "default contentBottom");
  assert.deepEqual(getContainerContent("left"), [], "default left");
  assert.deepEqual(getContainerContent("right"), [], "default right");
});
QUnit.test("survey.showNavigationButtons = 'none', page.navigationButtonsVisibility = 'show' & firstPageIsStarted is true, Bug#9248", function (assert) {
  const survey = new SurveyModel({
    showNavigationButtons: "none",
    firstPageIsStarted: true,
    pages: [
      {
        "navigationButtonsVisibility": "show",
        "elements": [{ type: "text", name: "q1" }]
      },
      {
        "elements": [{ type: "text", name: "q2" }]
      },
      {
        "elements": [{ type: "text", name: "q2" }]
      }
    ]
  });
  assert.equal(survey.state, "starting", "The first page is started");
  assert.equal(survey.isNavigationButtonsShowing, "bottom", "The first page is started");
  survey.start();
  assert.equal(survey.state, "running", "The start button is cliced");
  assert.equal(survey.isNavigationButtonsShowing, "none", "Hide navigation buttons");
});

QUnit.test("getContainerContent - header elements order", function (assert) {
  function getContainerContent(container: LayoutElementContainer) {
    let result = survey.getContainerContent(container);
    result.forEach(item => {
      delete item["processResponsiveness"];
      delete item["data"];
    });
    return result;
  }

  const json = {
    pages: [
      {
        "elements": [
          {
            "type": "rating",
            "name": "satisfaction",
          },
        ]
      },
      {
        "elements": [
          {
            "type": "radiogroup",
            "name": "price to competitors",
          },
        ]
      },
    ]
  };

  let survey = new SurveyModel(json);
  survey.addLayoutElement({
    id: "custom",
    container: "header",
    component: "sv-custom",
  });
  survey.applyTheme({ "headerView": "advanced" } as any);

  assert.deepEqual(getContainerContent("header"), [
    {
      "component": "sv-header",
      "container": "header",
      "id": "advanced-header",
      "index": -100
    },
    {
      "component": "sv-custom",
      "container": "header",
      "id": "custom"
    }
  ], "advanved header first, progress next");
});
QUnit.test("Do not set data in LayoutElement by default", function (assert) {
  const survey = new SurveyModel({
    pages: [
      {
        "elements": [
          {
            "type": "rating",
            "name": "satisfaction",
          },
        ]
      },
      {
        "elements": [
          {
            "type": "radiogroup",
            "name": "price to competitors",
          },
        ]
      },
    ]
  });
  const el = survey.findLayoutElement("toc-navigation");
  assert.ok(el, "toc-navigation is found");
  assert.notOk(el.data, "data is not set");
  survey.showTOC = true;
  const els: Array<any> = survey.getContainerContent("left");
  assert.equal(els.length, 1, "There is one element");
  assert.equal(els[0].id, "toc-navigation", "This element is toc");
  assert.ok(els[0].data, "data is set");
});

QUnit.test("restore header css variable if header is default", function (assert) {
  const json = {
    title: "Title",
    elements: [{ "type": "rating", "name": "satisfaction" }]
  };
  let survey = new SurveyModel(json);
  survey.applyTheme({ "headerView": "advanced", cssVariables: { "--sjs-header-backcolor": "transparent" } } as any);

  const cover = survey.findLayoutElement("advanced-header").data as Cover;
  assert.equal(cover.headerClasses, "sv-header sv-header--height-auto sv-header__without-background sv-header__background-color--none");
});

QUnit.test("check title classes when readOnly changed", function (assert) {
  const survey = new SurveyModel({
    elements: [{
      "type": "text",
      name: "q1"
    }]
  });
  const customDisabledClass = "custom_disabled_class";
  survey.css = {
    question: {
      titleReadOnly: customDisabledClass
    },
  };
  const question = survey.getQuestionByName("q1");
  assert.notOk(question.cssTitle.includes(customDisabledClass));
  question.readOnly = true;
  assert.ok(question.cssTitle.includes(customDisabledClass));
  question.readOnly = false;
  assert.notOk(question.cssTitle.includes(customDisabledClass));
});
QUnit.test("Do not run onComplete twice if complete trigger and tryComplete() is called", function (assert) {
  const survey = new SurveyModel({
    "elements": [
      {
        "type": "text",
        "name": "question1"
      },
      {
        "type": "text",
        "name": "question2"
      }
    ],
    "triggers": [
      {
        "type": "complete",
        "expression": "{question1} = 1"
      }
    ]
  });
  let counter = 0;
  survey.onComplete.add((sender, options) => {
    counter++;
  });
  survey.setValue("question1", 1);
  survey.tryComplete();
  assert.equal(counter, 1, "onComplete called one time");
});

QUnit.test("Check readOnly flag", function (assert) {
  let survey = new SurveyModel({
    readOnly: true,
    "elements": [
      {
        "type": "text",
        "name": "question1"
      },
    ],
  });
  assert.equal(survey.mode, "display");
  assert.ok(survey.readOnly);
  survey.readOnly = false;
  assert.notOk(survey.readOnly);
  survey = new SurveyModel({
    mode: "display",
    "elements": [
      {
        "type": "text",
        "name": "question1"
      },
    ],
  });
  assert.ok(survey.readOnly);
  survey.mode = "edit";
  assert.notOk(survey.readOnly);
});
QUnit.test("Expression with dates & defaultValueExpression & expression question", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        "type": "text",
        "name": "startdate",
        "defaultValueExpression": "today(-2)",
        "inputType": "date"
      },
      {
        "type": "expression",
        "name": "enddate",
        "expression": "today()"
      },
      {
        "type": "expression",
        "name": "check1",
        "expression": "{startdate} <= {enddate}"
      },
      {
        "type": "expression",
        "name": "check2",
        "expression": "{startdate} >= {enddate}"
      },
      {
        "type": "expression",
        "name": "check3",
        "expression": "{startdate} < {enddate}"
      },
      {
        "type": "expression",
        "name": "check4",
        "expression": "{startdate} > {enddate}"
      },
      {
        "type": "expression",
        "name": "check5",
        "expression": "{startdate} = {enddate}"
      }
    ]
  });
  const checkFunc = function (res: Array<boolean>, no: number) {
    for (var i = 0; i < res.length; i++) {
      const name = "check" + (i + 1).toString();
      const val = survey.getValue(name);
      assert.equal(val, res[i], "check no: " + no + ", value name: " + name);
    }
  };
  checkFunc([true, false, true, false, false], 1);

  const startQ = survey.getQuestionByName("startdate");
  const date = new Date();
  date.setDate(date.getDate() + 1);
  startQ.value = Helpers.convertDateToString(date);
  checkFunc([false, true, false, true, false], 2);

  startQ.value = Helpers.convertDateToString(new Date());
  checkFunc([true, true, false, false, true], 3);
});

QUnit.test("Check onPopupVisibleChanged events #1", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        "type": "dropdown",
        "name": "q1",
        "choices": ["Item1", "Item2", "Item3"]
      },
    ]
  });
  let log = "";
  const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
  const popup = question.dropdownListModel.popupModel;
  survey.onPopupVisibleChanged.add((_, options) => {
    assert.equal(options.question, question);
    assert.equal(options.popup, popup);
    log += `->${options.visible}`;
  });
  popup.toggleVisibility();
  assert.equal(log, "->true");
  popup.toggleVisibility();
  assert.equal(log, "->true->false");
});
QUnit.test("Check onPopupVisibleChanged events #2", function (assert) {
  assert.equal(settings.comparator.caseSensitive, false, "comparator.caseSensitive is false");
  const survey = new SurveyModel({ elements: [{ "type": "text", "name": "q1" }] });
  const q = survey.getQuestionByName("q1");
  survey.onValueChanging.add((sender, options) => {
    options.value = options.value.toUpperCase();
  });
  q.value = "abc";
  assert.equal(q.value, "ABC", "Convert to upper case");
});

QUnit.test("Check onOpenDropdownMenu events", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        "type": "dropdown",
        "name": "q1",
        "choices": ["Item1", "Item2", "Item3"]
      },
    ]
  });
  const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
  const popup = question.dropdownListModel.popupModel;
  survey.onOpenDropdownMenu.add((_, options) => {
    assert.equal(options.question, question);
    assert.equal(options.menuType, "dropdown");

    options.menuType = "overlay";
  });

  assert.equal(popup.displayMode, "popup");
  assert.equal(popup.overlayDisplayMode, "auto");

  popup.toggleVisibility();
  assert.equal(popup.displayMode, "overlay");
  assert.equal(popup.overlayDisplayMode, "dropdown-overlay");
});

QUnit.test("Search disabled & onOpenDropdownMenu events", function (assert) {
  _setIsTouch(true);
  const survey = new SurveyModel({
    elements: [
      {
        type: "dropdown",
        name: "car",
        choices: ["Ford", "Vauxhall", "Volkswagen", "Nissan", "Audi", "Mercedes-Benz", "BMW", "Peugeot", "Toyota", "Citroen"],
        allowClear: false,
        searchEnabled: false,
      },
    ]
  });
  const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
  const popup = question.dropdownListModel.popupModel;
  const list: ListModel = popup.contentComponentData.model as ListModel;
  survey.onOpenDropdownMenu.add((_, options) => {
    options.menuType = "dropdown";
  });

  assert.equal(popup.displayMode, "overlay", "#1");
  assert.equal(popup.setWidthByTarget, false, "#2");
  assert.equal(list.showFilter, false, "#3");
  assert.equal(list.searchEnabled, false, "#4");

  popup.show();
  assert.equal(popup.displayMode, "popup", "#1.1");
  assert.equal(popup.setWidthByTarget, true, "#2.1");
  assert.equal(list.showFilter, false, "#3.1");
  assert.equal(list.searchEnabled, false, "#4.1");

  _setIsTouch(false);
});

QUnit.test("Search disabled after change popup displayMode", function (assert) {
  _setIsTouch(true);
  const survey = new SurveyModel({
    elements: [
      {
        type: "dropdown",
        name: "car",
        choices: ["Ford", "Vauxhall", "Volkswagen", "Nissan", "Audi", "Mercedes-Benz", "BMW", "Peugeot", "Toyota", "Citroen"],
      },
    ]
  });
  const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
  const popup = question.dropdownListModel.popupModel;
  const list: ListModel = popup.contentComponentData.model as ListModel;
  survey.onOpenDropdownMenu.add((_, options) => {
    options.menuType = "dropdown";
  });

  assert.equal(popup.displayMode, "overlay", "#1");
  assert.equal(popup.setWidthByTarget, false, "#2");
  assert.equal(list.showFilter, true, "#3");
  assert.equal(list.searchEnabled, true, "#4");

  popup.show();
  assert.equal(popup.displayMode, "popup", "#1.1");
  assert.equal(popup.setWidthByTarget, true, "#2.1");
  assert.equal(list.showFilter, false, "#3.1");
  assert.equal(list.searchEnabled, false, "#4.1");

  _setIsTouch(false);
});

QUnit.test("Shared data #6584", (assert) => {
  const json = {
    logoPosition: "right",
    pages: [
      {
        name: "page1",
        elements: [
          {
            type: "paneldynamic",
            name: "panel1",
            valueName: "sharedData",
            templateElements: [
              {
                type: "text",
                name: "name",
                defaultValueExpression: '({panelindex} + 1) +  " name"'
              },
            ],
          },
          {
            type: "paneldynamic",
            name: "panel2",
            valueName: "sharedData",
            templateElements: [
              {
                type: "matrixdynamic",
                name: "matrix1",
                rowCount: 1,
                columns: [
                  {
                    name: "b_eil_nr",
                    cellType: "text",
                    readOnly: true,
                    defaultValueExpression: "{panelindex} + 1",
                    inputType: "number"
                  },
                  {
                    name: "b_name",
                    cellType: "text",
                    readOnly: true,
                    defaultValueExpression: "{panel.name}"
                  }
                ],
                cellType: "text"
              }
            ]
          }
        ]
      }
    ]
  };
  const survey = new SurveyModel(json);
  const p1 = survey.getAllQuestions()[0];
  const p2 = survey.getAllQuestions()[1];
  p1.addPanel();
  assert.deepEqual(survey.data, { sharedData: [{ name: "1 name", matrix1: [{ b_eil_nr: 1, b_name: "1 name" }] }] }, "survey.data");
  assert.deepEqual(p2.value, [{ name: "1 name", matrix1: [{ b_eil_nr: 1, b_name: "1 name" }] }], "panel2.data");
  const matrix = <QuestionMatrixDynamicModel>p2.panels[0].questions[0];
  assert.deepEqual(matrix.value, [{ b_eil_nr: 1, b_name: "1 name" }], "panel2[0].matrix1.data");
  const table = matrix.renderedTable;
  assert.equal(table.rows.length, 2, "One row in rendered table");
  assert.equal(table.rows[1].cells[0].question.value, 1);
  assert.equal(table.rows[1].cells[1].question.value, "1 name");
  const rows = matrix.visibleRows;
  assert.equal(rows.length, 1, "one row is added, rowCount: 1");
  assert.equal(rows[0].cells[0].question.value, 1, "cell [0,0]");
  assert.equal(rows[0].cells[1].question.value, "1 name", "cell [0,1]");
});
QUnit.test("survey.getNestedQuestions", function (assert) {
  const survey = new SurveyModel({
    elements: [
      { type: "text", name: "q1" },
      { type: "multipletext", name: "q2", items: [{ name: "q2_item1" }, { name: "q2_item2" }] }
    ]
  });
  const questions = survey.getAllQuestions(false, false, true);
  assert.equal(questions.length, 4, "3 questions");
  assert.equal(questions[0].name, "q1", "#1");
  assert.equal(questions[1].name, "q2", "#2");
  assert.equal(questions[2].name, "q2_item1", "#3");
  assert.equal(questions[3].name, "q2_item2", "#4");
});
QUnit.test("survey.applyTheme", function (assert) {
  const survey = new SurveyModel({
    elements: [
      { type: "text", name: "q1" },
      { type: "multipletext", name: "q2", items: [{ name: "q2_item1" }, { name: "q2_item2" }] }
    ]
  });

  assert.equal(Object.keys(survey.themeVariables).length, 0, "before applyTheme");
  assert.equal(!!survey.backgroundImage, false, "before applyTheme");
  assert.equal(survey.backgroundImageFit, "cover", "before applyTheme");
  assert.equal(survey.backgroundImageAttachment, "scroll", "before applyTheme");
  assert.equal(survey.backgroundOpacity, 1, "before applyTheme");
  assert.equal(survey["isCompact"], false, "before applyTheme");
  assert.equal(survey.headerView, "advanced", "before applyTheme");

  survey.applyTheme({
    "cssVariables": {
      "--sjs-general-backcolor": "rgba(255, 255, 255, 1)",
      "--sjs-general-backcolor-dark": "rgba(248, 248, 248, 1)",
      "--sjs-general-backcolor-dim": "rgba(243, 243, 243, 1)",
      "--sjs-general-backcolor-dim-light": "rgba(249, 249, 249, 1)",
      "--sjs-general-backcolor-dim-dark": "rgba(243, 243, 243, 1)",
    },
    "backgroundImage": "data:image/png;base64,dgoldfk",
    "backgroundOpacity": 0.6,
    "backgroundImageAttachment": "fixed",
    "backgroundImageFit": "cover",
    "isPanelless": true
  });

  assert.equal(Object.keys(survey.themeVariables).length, 5);
  assert.equal(!!survey.backgroundImage, true);
  assert.equal(survey.backgroundImageFit, "cover");
  assert.equal(survey.backgroundImageAttachment, "fixed");
  assert.equal(survey.backgroundOpacity, 0.6);
  assert.equal(survey["isCompact"], true);
  assert.equal(survey.headerView, "advanced", "after applyTheme");
});
QUnit.test("survey.applyTheme respects headerView", function (assert) {
  const survey = new SurveyModel({
    elements: [
      { type: "text", name: "q1" },
      { type: "multipletext", name: "q2", items: [{ name: "q2_item1" }, { name: "q2_item2" }] }
    ]
  });

  assert.equal(survey.headerView, "advanced", "before applyTheme");
  survey.applyTheme({
    "headerView": "basic"
  });
  assert.equal(survey.headerView, "basic", "apply basic header");

  survey.applyTheme({
    "headerView": "advanced"
  });
  assert.equal(survey.headerView, "advanced", "apply advanced header");

  survey.applyTheme({});
  assert.equal(survey.headerView, "advanced", "apply empty theme");
});
QUnit.test("page/panel delete do it recursively", function (assert) {
  const survey = new SurveyModel({
    elements: [{
      type: "panel", name: "p1",
      elements: [
        { type: "text", name: "q1" },
      ]
    },
    {
      type: "panel", name: "p2",
      elements: [
        { type: "text", name: "q2" },
      ]
    }
    ]
  });
  const p1 = survey.getPanelByName("p1");
  const p2 = survey.getPanelByName("p2");
  const q1 = survey.getQuestionByName("q1");
  const q2 = survey.getQuestionByName("q2");
  p2.delete();
  assert.equal(p2.isDisposed, true, "p2.isDisposed");
  assert.equal(q2.isDisposed, true, "q2.isDisposed");
  survey.currentPage.delete();
  assert.equal(p1.isDisposed, true, "p1.isDisposed");
  assert.equal(q1.isDisposed, true, "q1.isDisposed");
});
QUnit.test("SurveyModel: Check that popups inside survey are closed when scrolling container", (assert): any => {
  const model = new SurveyModel({ elements: [{ type: "dropdown", name: "q1", choices: ["Item1", "Item2", "Item3"] }] });
  const question = <QuestionDropdownModel>model.getAllQuestions()[0];
  question.dropdownListModel.popupModel.toggleVisibility();
  assert.ok(model["onScrollCallback"]);
  assert.ok(question.dropdownListModel.popupModel.isVisible);
  model.onScroll();
  assert.notOk(question.dropdownListModel.popupModel.isVisible);
  assert.notOk(model["onScrollCallback"]);
  model.onScroll();
});
QUnit.test("Copy panel with invisible questions at design-time", (assert): any => {
  const survey = new SurveyModel();
  survey.setDesignMode(true);
  survey.fromJSON({
    elements: [
      {
        type: "panel", name: "panel1",
        elements: [
          { type: "text", name: "q1", visible: false },
          { type: "text", name: "q2" }
        ]
      }
    ]
  });
  const panel1 = survey.getPanelByName("panel1");
  const panel2 = Serializer.createClass("panel");
  panel2.fromJSON(panel1.toJSON());
  panel2.name = "panel2";
  panel2.questions[0].name = "q3";
  panel2.questions[1].name = "q4";
  survey.pages[0].addElement(panel2);
  const q1 = survey.getQuestionByName("q1");
  const q3 = survey.getQuestionByName("q3");
  assert.equal(q1.visible, false, "q1.visible = false");
  assert.equal(q1.isVisible, true, "q1.isVisible = true");
  assert.equal(q1.getPropertyValue("isVisible"), true, "q1.isVisible via getPropertyValue");
  assert.equal(q3.visible, false, "q3.visible = false");
  assert.equal(q3.isVisible, true, "q3.isVisible = true");
  assert.equal(q3.getPropertyValue("isVisible"), true, "q3.isVisible via getPropertyValue");
});
QUnit.test("Use variables as default values in expression", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        type: "text",
        name: "q1",
        defaultValueExpression: "1",
      }]
  });
  survey.data = { q1: 2 };
  const q1 = survey.getQuestionByName("q1");
  assert.equal(q1.value, 2, "Get data from survey");
});
QUnit.test("Test displayValue() function", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        type: "checkbox",
        name: "q1",
        choices: [{ value: 1, text: "Item 1" }, { value: 2, text: "Item 2" }, { value: 3, text: "Item 3" }]
      },
      {
        type: "expression",
        name: "q1_exp",
        expression: "displayValue('q1')"
      },
      {
        type: "paneldynamic",
        name: "q2",
        templateElements: [{
          type: "checkbox",
          name: "q2_q1",
          choices: [{ value: 1, text: "Item 1" }, { value: 2, text: "Item 2" }, { value: 3, text: "Item 3" }]
        },
        {
          type: "expression",
          name: "q2_q1_exp",
          expression: "displayValue('q2_q1')"
        }]
      },
      {
        type: "matrixdynamic",
        name: "q3",
        rowCount: 0,
        columns: [{
          cellType: "checkbox",
          name: "col1",
          choices: [{ value: 1, text: "Item 1" }, { value: 2, text: "Item 2" }, { value: 3, text: "Item 3" }]
        },
        {
          cellType: "expression",
          name: "col1_exp",
          expression: "displayValue('col1')"
        }],
        detailPanelMode: "underRow",
        detailElements: [{
          type: "checkbox",
          name: "q3_q1",
          choices: [{ value: 1, text: "Item 1" }, { value: 2, text: "Item 2" }, { value: 3, text: "Item 3" }]
        },
        {
          type: "expression",
          name: "q3_q1_exp",
          expression: "displayValue('q3_q1')"
        }],
      }
    ]
  });
  survey.data = { q1: [1, 2], q2: [{ q2_q1: [2, 3] }] };
  const panel = survey.getQuestionByName("q2");
  assert.equal(panel.panels[0].questions[0].isReady, true, "Check box is ready");
  const matrix = survey.getQuestionByName("q3");
  matrix.addRow();
  const row = matrix.visibleRows[0];
  row.showDetailPanel();
  row.getQuestionByName("col1").value = [1, 3];
  row.getQuestionByName("q3_q1").value = [1, 2, 3];
  assert.deepEqual(survey.data, {
    q1: [1, 2], q1_exp: "Item 1, Item 2",
    q2: [{ q2_q1: [2, 3], q2_q1_exp: "Item 2, Item 3" }],
    q3: [{ col1: [1, 3], col1_exp: "Item 1, Item 3", q3_q1: [1, 2, 3], q3_q1_exp: "Item 1, Item 2, Item 3" }]
  }, "displayValue works correctly");
});
QUnit.test("Test displayValue() function with value parameter", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        type: "checkbox",
        name: "q1",
        choices: [{ value: 1, text: "Item check 1" }, { value: 2, text: "Item check 2" }, { value: 3, text: "Item check 3" }]
      },
      {
        type: "dropdown",
        name: "q2",
        choices: [{ value: 1, text: "Item 1" }, { value: 2, text: "Item 2" }, { value: 3, text: "Item 3" }]
      },
      {
        type: "matrixdynamic",
        name: "matrix",
        columns: [
          { cellType: "text", name: "col1" },
          { cellType: "expression", name: "col2", expression: "displayValue('q1', {row.col1})" },
          { cellType: "expression", name: "col3", expression: "displayValue('q2', {row.col1})" }
        ]
      }
    ]
  });
  const matrix = survey.getQuestionByName("matrix");
  matrix.rowCount = 3;
  const rows = matrix.visibleRows;
  rows[0].cells[0].value = 2;
  rows[1].cells[0].value = 3;
  rows[2].cells[0].value = 1;
  assert.equal(rows[0].cells[1].value, "Item check 2", "cells[0,1].value");
  assert.equal(rows[0].cells[2].value, "Item 2", "cells[0,2].value");
  assert.equal(rows[1].cells[1].value, "Item check 3", "cells[1,1].value");
  assert.equal(rows[1].cells[2].value, "Item 3", "cells[1,2].value");
  assert.equal(rows[2].cells[1].value, "Item check 1", "cells[2,1].value");
  assert.equal(rows[2].cells[2].value, "Item 1", "cells[2,2].value");
});
QUnit.test("Test displayValue() function with value parameter & 0 value, Bug#8603", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        type: "checkbox",
        name: "q1",
        choices: [{ value: 0, text: "Item check 0" }, { value: 1, text: "Item check 1" }, { value: 2, text: "Item check 2" }]
      },
      {
        type: "matrixdynamic",
        name: "matrix",
        columns: [
          { cellType: "text", name: "col1" },
          { cellType: "expression", name: "col2", expression: "displayValue('q1', {row.col1})" }
        ]
      }
    ]
  });
  survey.setValue("q1", [0, 1, 2]);
  const matrix = survey.getQuestionByName("matrix");
  matrix.rowCount = 3;
  const rows = matrix.visibleRows;
  rows[0].cells[0].value = 0;
  rows[1].cells[0].value = 1;
  rows[2].cells[0].value = 2;
  assert.equal(rows[0].cells[1].value, "Item check 0", "cells[0,1].value");
  assert.equal(rows[1].cells[1].value, "Item check 1", "cells[1,1].value");
  assert.equal(rows[2].cells[1].value, "Item check 2", "cells[2,1].value");
});
QUnit.test("Test displayValue() function with 'non-ready' question , Bug#8763", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        type: "dropdown",
        name: "q1",
        choices: [{ value: 1, text: "Item check 1" }, { value: 2, text: "Item check 2" }]
      },
      {
        type: "expression",
        name: "q2",
        expression: "displayValue('q1')"
      }
    ]
  });
  const q1 = survey.getQuestionByName("q1");
  const q2 = survey.getQuestionByName("q2");
  let isQ1Ready = false;
  q1["getIsQuestionReady"] = (): boolean => { return isQ1Ready; };
  q1["updateIsReady"]();
  survey.mergeData({ q1: 1, q2: "abc" });
  assert.equal(q2.value, "abc", "#1");
  isQ1Ready = true;
  q1["updateIsReady"]();
  assert.equal(q2.value, "Item check 1", "#1");
});
QUnit.test("Test displayValue() function in survey.runExpression, Bug#8858", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        type: "radiogroup",
        name: "q1",
        choices: [{ value: 1, text: "Item 1" }, { value: 2, text: "Item 2" }]
      }
    ]
  });
  survey.setValue("q1", 2);
  assert.equal(survey.runExpression("displayValue('q1'"), "Item 2", "#1");
  let funcRes = undefined;
  survey.setValue("q1", 1);
  survey.runExpression("displayValue('q1'", (res: any): void => funcRes = res);
  assert.equal(funcRes, "Item 1", "#2");
});
QUnit.test("Test propertyValue() function", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        type: "text",
        name: "q1",
        title: "Q1"
      },
      {
        type: "expression",
        name: "q1_exp",
        expression: "propertyValue('q1', 'title')"
      },
      {
        type: "paneldynamic",
        name: "q2",
        templateElements: [{
          type: "text",
          name: "q2_q1",
          title: "Q2_Q1"
        },
        {
          type: "expression",
          name: "q2_q1_exp",
          expression: "propertyValue('q2_q1', 'title')"
        }]
      },
      {
        type: "matrixdynamic",
        name: "q3",
        rowCount: 0,
        columns: [{
          cellType: "text",
          title: "Column 1",
          name: "col1"
        },
        {
          cellType: "expression",
          name: "col1_exp",
          expression: "propertyValue('col1', 'title')"
        }]
      }
    ]
  });
  survey.getQuestionByName("q2").addPanel();
  survey.getQuestionByName("q3").addRow();
  assert.deepEqual(survey.data, {
    q1_exp: "Q1",
    q2: [{ q2_q1_exp: "Q2_Q1" }],
    q3: [{ col1_exp: "Column 1" }]
  }, "propertyValue works correctly");
});
QUnit.test("Error on pre-processing localizable string Bug#6967", function (assert) {
  const prevVal = surveyLocalization.locales.en.completeText;
  surveyLocalization.locales.en.completeText = "{q1}";
  const survey = new SurveyModel({
    elements: [
      {
        type: "text",
        name: "q1"
      }]
  });
  survey.data = { q1: 2 };
  assert.equal(survey.locCompleteText.renderedHtml, "2", "Preprocess correctly");
  surveyLocalization.locales.en.completeText = prevVal;
});
QUnit.test("clearInvisibleValues onHiddenContainer breaks defaultValueExpression for text input #7010", function (assert) {
  const survey = new SurveyModel({
    "elements": [
      {
        "type": "radiogroup",
        "name": "q1",
        "choices": [
          "A",
          "B"
        ]
      },
      {
        "type": "panel",
        "name": "panel1",
        "elements": [
          {
            "type": "text",
            "name": "q2",
            "defaultValueExpression": "iif({q1} = 'A', 42, iif({q1} = 'B', 24, 0))"
          }
        ],
        "visibleIf": "{q1} anyof ['other', 'A', 'B']"
      }
    ],
    "clearInvisibleValues": "onHiddenContainer"
  });
  const q1 = survey.getQuestionByName("q1");
  const q2 = survey.getQuestionByName("q2");
  assert.equal(q2.isEmpty(), true, "initial value on loading and clear on becoming invisible");
  q1.value = "A";
  assert.equal(q2.value, 42, "q1.value = A");
  q1.value = "B";
  assert.equal(q2.value, 24, "q1.value = B");
});

QUnit.test("survey.toJSON() doesn't work correctly if questionsOnPageMode=singlePage is used #7359, #1", function (assert) {
  const surveyJson = {
    "questionsOnPageMode": "singlePage",
    "pages": [
      {
        "name": "page1",
        "elements": [
          {
            "type": "text",
            "name": "first-name",
          },
          {
            "type": "text",
            "name": "last-name",
          },
          {
            "type": "text",
            "name": "birthdate",
            "inputType": "date"
          },
        ]
      }
    ],
  };

  const survey = new SurveyModel(surveyJson);
  const prepareJSON = survey.toJSON();

  assert.equal(surveyJson.pages[0].elements.length, 3, "surveyJson elements count");
  assert.equal(prepareJSON.pages[0].elements.length, 3, "prepareJSON elements count");

  assert.deepEqual(surveyJson, prepareJSON);
});
QUnit.test("survey.toJSON() doesn't work correctly if questionsOnPageMode=questionPerPage is used #7359, #2", function (assert) {
  const surveyJson = {
    "questionsOnPageMode": "questionPerPage",
    "pages": [
      {
        "name": "page1",
        "elements": [
          {
            "type": "text",
            "name": "first-name",
          },
          {
            "type": "text",
            "name": "last-name",
          },
          {
            "type": "text",
            "name": "birthdate",
            "inputType": "date"
          },
        ]
      }
    ],
  };

  const survey = new SurveyModel(surveyJson);
  const prepareJSON = survey.toJSON();

  assert.equal(surveyJson.pages.length, 1, "surveyJson pages count");
  assert.equal(prepareJSON.pages.length, 1, "prepareJSON pages count");
  assert.equal(surveyJson.pages[0].elements.length, 3, "surveyJson elements count");
  assert.equal(prepareJSON.pages[0].elements.length, 3, "prepareJSON elements count");

  assert.deepEqual(surveyJson, prepareJSON);
});
QUnit.test("questionsOnPageMode=questionPerPage & skip doesn't work correctly, Bug #9276", function (assert) {
  const surveyJson = {
    "questionsOnPageMode": "questionPerPage",
    "pages": [
      {
        "elements": [
          { "type": "text", "name": "q1" },
          { "type": "text", "name": "q2" }
        ]
      },
      {
        "elements": [
          { "type": "text", "name": "q3" },
          { "type": "text", "name": "q4" }
        ]
      }
    ],
    "triggers": [
      {
        "type": "skip",
        "expression": "{q1} = 'a'",
        "gotoName": "q4"
      }]
  };

  const survey = new SurveyModel(surveyJson);
  assert.equal(survey.currentSingleQuestion.name, "q1", "#1");
  survey.currentSingleQuestion.value = "a";
  assert.equal(survey.currentSingleQuestion.name, "q4", "#2");
});
QUnit.test("defaultValue & visibleIf issues if questionsOnPageMode=questionPerPage is used #7932", function (assert) {
  const surveyJson = {
    elements: [
      {
        type: "panel",
        name: "panel1",
        elements: [
          {
            type: "radiogroup",
            name: "q1_1",
            choices: ["A", "B"],
            defaultValue: "A",
          },
          {
            type: "text",
            name: "q1_2",
            visibleIf:
              "{q1_1} equals 'A'",
          },
        ],
      },
      {
        type: "panel",
        name: "panel2",
        elements: [
          {
            type: "radiogroup",
            name: "q2_1",
            choices: ["A", "B"],
            defaultValue: "A",
          },
          {
            type: "text",
            name: "q2_2",
            visibleIf:
              "{q2_1} equals 'A'",
          },
        ],
      }
    ],
    questionsOnPageMode: "questionPerPage",
  };

  const survey = new SurveyModel(surveyJson);
  assert.deepEqual(survey.data, { q1_1: "A", q2_1: "A" }, "survey.data");
  survey.setValue("q3", "B");
  const q1_1 = survey.getQuestionByName("q1_1");
  const q2_1 = survey.getQuestionByName("q2_1");
  const q1_2 = survey.getQuestionByName("q1_2");
  const q2_2 = survey.getQuestionByName("q2_2");

  assert.equal(q1_1.value, "A", "q1_1.value");
  assert.equal(q2_1.value, "A", "q2_1.value");
  assert.equal(q1_2.visible, true, "q1_2.visible");
  assert.equal(q2_2.visible, true, "q2_2.visible");
});

QUnit.test("goNextPageAutomatic & questionsOnPageMode=questionPerPage is used #9315", function (assert) {
  const survey = new SurveyModel({
    elements: [
      { type: "dropdown", name: "q1", choices: ["A", "B"] },
      { type: "dropdown", name: "q2", choices: ["A", "B"] },
      { type: "dropdown", name: "q3", choices: ["A", "B"] }
    ],
    questionsOnPageMode: "questionPerPage",
    goNextPageAutomatic: true,
  });
  assert.equal(survey.currentSingleQuestion.name, "q1", "survey.currentSingleQuestion.name #1");
  survey.setValue("q1", "A");
  assert.equal(survey.currentSingleQuestion.name, "q2", "survey.currentSingleQuestion.name #2");
  survey.setValue("q2", "A");
  assert.equal(survey.currentSingleQuestion.name, "q3", "survey.currentSingleQuestion.name #3");
  survey.setValue("q3", "A");
  assert.equal(survey.state, "completed", "survey.state #4");
});

QUnit.test("Bug on loading json with collapsed panel. It was fixed in v1.9.117, #7355", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        type: "panel",
        name: "panel1",
        elements: [
          {
            type: "matrixdropdown",
            name: "q1",
            columns: [
              {
                name: "Column 1",
                cellType: "radiogroup",
                showInMultipleColumns: true,
                choices: ["item1", "item2", "item3"]
              }
            ],
            rows: ["Row 1", "Row 2"]
          }
        ],
        state: "collapsed"
      }
    ]
  });
  const question = survey.getQuestionByName("q1");
  const panel = survey.getPanelByName("panel1");
  assert.equal(question.name, "q1", "Loaded correctly");
  assert.equal(panel.isCollapsed, true, "panel is collapsed");
  panel.expand();
  assert.equal(panel.isCollapsed, false, "panel is not collapsed");
});
QUnit.test("Expression bug with complex path, #7396", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        type: "matrix",
        name: "Q1.1",
        columns: [1, 2],
        rows: [1, 2, 3]
      },
      {
        type: "matrix",
        name: "Q1.1.16",
        columns: [1, 2, 3],
        rows: ["16"]
      },
      {
        type: "text",
        name: "Q1.1.16.A",
        visibleIf: "{Q1.1.16.16} anyof [1, 2, 3]"
      }
    ]
  });
  const q1 = survey.getQuestionByName("Q1.1");
  const q2 = survey.getQuestionByName("Q1.1.16");
  const q3 = survey.getQuestionByName("Q1.1.16.A");
  assert.equal(q3.isVisible, false, "visible #1");
  q1.value = { "1": 1, "2": 2 };
  assert.equal(q3.isVisible, false, "visible #2");
  q2.value = { "16": 2 };
  assert.equal(q3.isVisible, true, "visible #3");
});
QUnit.test("Do not run defaultValueExpression on survey.data, #7423", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        type: "text",
        name: "q1",
        defaultValueExpression: "value1"
      },
      {
        type: "text",
        name: "q2",
        defaultValueExpression: "value2"
      },
      {
        type: "checkbox",
        name: "q3",
        choices: ["item1", "item2", "item3"],
        defaultValueExpression: "['item1', 'item3']"
      },
      {
        type: "dropdown",
        name: "q4",
        choices: ["item1", "item2", "item3"],
        defaultValueExpression: "item2"
      }
    ]
  });
  const q1 = survey.getQuestionByName("q1");
  const q2 = survey.getQuestionByName("q2");
  const q3 = survey.getQuestionByName("q3");
  const q4 = survey.getQuestionByName("q4");
  assert.equal(q1.value, "value1", "q1.value #1");
  assert.equal(q2.value, "value2", "q2.value #1");
  assert.deepEqual(q3.value, ["item1", "item3"], "q3.value #1");
  assert.equal(q4.value, "item2", "q4.value #1");
  survey.data = { q1: "val1" };
  assert.equal(q1.value, "val1", "q1.value #2");
  assert.notOk(q2.value, "q2.value #2");
  assert.deepEqual(q3.value, [], "q3.value #2");
  assert.notOk(q4.value, "q4.value #2");
  q2.value = "val2";
  assert.equal(q1.value, "val1", "q1.value #3");
  assert.equal(q2.value, "val2", "q2.value #3");
  assert.deepEqual(q3.value, [], "q3.value #3");
  assert.notOk(q4.value, "q4.value #3");
});
QUnit.test("theme assignment doesn't affect headerView", function (assert) {
  let survey = new SurveyModel({});
  assert.equal(survey.headerView, "advanced", "default value");
  survey.theme = { header: {} } as any;
  assert.equal(survey.headerView, "advanced", "keep default value");
});
QUnit.test("defaultValueExpression expression stops working after survey.clear(), #7448", function (assert) {
  const survey = new SurveyModel({
    elements: [
      { type: "text", name: "q1" },
      { type: "text", name: "q2", defaultValueExpression: "{q1}" }
    ]
  });
  const q1 = survey.getQuestionByName("q1");
  const q2 = survey.getQuestionByName("q2");
  q1.value = 1;
  assert.equal(q2.value, 1, "defaultValueExpression is working");
  survey.clear();
  q1.value = 2;
  assert.equal(q2.value, 2, "defaultValueExpression is still working");
  q2.value = 3;
  assert.equal(q2.value, 3, "set value directly");
  survey.clear();
  q1.value = 4;
  assert.equal(q2.value, 4, "defaultValueExpression is working after set value directly & clear");
});
QUnit.test("emptySurveyText, make it writable, #7456", function (assert) {
  const survey = new SurveyModel();
  const defaultText = "The survey doesn't contain any visible elements.";
  assert.equal(survey.emptySurveyText, defaultText, "#1");
  survey.emptySurveyText = "Empty";
  assert.equal(survey.emptySurveyText, "Empty", "#2");
  survey.resetPropertyValue("emptySurveyText");
  assert.equal(survey.emptySurveyText, defaultText, "#3");
});

QUnit.test("getContainerContent - progress + advanced header (legacyProgressBarView)", function (assert) {
  const json = {
    title: "My Survey",
    showNavigationButtons: "none",
    pages: [
      {
        "elements": [
          {
            required: true,
            "type": "rating",
            "name": "satisfaction",
          },
          {
            required: true,
            "type": "rating",
            "name": "recommend friends",
          }
        ]
      },
      {
        "elements": [
          {
            "type": "radiogroup",
            "name": "price to competitors",
          },
          {
            "type": "radiogroup",
            "name": "price",
          },
        ]
      },
    ]
  };

  try {
    settings.legacyProgressBarView = true;

    let survey = new SurveyModel(json);
    const getContainerContent = getContainerContentFunction(survey);

    survey.applyTheme({
      header: {},
      cssVariables: {
        "--sjs-header-backcolor": "var(--sjs-primary-backcolor)"
      }
    } as any);

    assert.equal(survey.showNavigationButtons, false);
    assert.equal(survey.progressBarType, "pages");
    assert.equal(survey.showProgressBar, false);

    assert.deepEqual(getContainerContent("header"), [{
      "component": "sv-header",
      "container": "header",
      "id": "advanced-header",
      "index": -100
    }], "default header");
    assert.deepEqual(getContainerContent("center"), [], "default center");
    assert.deepEqual(getContainerContent("footer"), [], "default footer");
    assert.deepEqual(getContainerContent("contentTop"), [], "default contentTop");
    assert.deepEqual(getContainerContent("contentBottom"), [], "default contentBottom");
    assert.deepEqual(getContainerContent("left"), [], "default left");
    assert.deepEqual(getContainerContent("right"), [], "default right");

    survey.showProgressBar = "top";
    assert.deepEqual(getContainerContent("header"), [{
      "component": "sv-header",
      "container": "header",
      "id": "advanced-header",
      "index": -100
    }], "progress top header alone");
    assert.deepEqual(getContainerContent("center"), [{
      "component": "sv-progress-pages",
      "id": "progress-pages"
    }], "progress top center alone");
    assert.deepEqual(getContainerContent("footer"), [], "progress top footer alone");
    assert.deepEqual(getContainerContent("contentTop"), [], "progress top contentTop alone");
    assert.deepEqual(getContainerContent("contentBottom"), [], "progress top contentBottom alone");
    assert.deepEqual(getContainerContent("left"), [], "progress top left alone");
    assert.deepEqual(getContainerContent("right"), [], "progress top right alone");

    survey.applyTheme({
      header: {},
      cssVariables: {
        "--sjs-header-backcolor": "transparent"
      }
    } as any);
    assert.deepEqual(getContainerContent("header"), [{
      "component": "sv-progress-pages",
      "id": "progress-pages",
      "index": -150
    }, {
      "component": "sv-header",
      "container": "header",
      "id": "advanced-header",
      "index": -100
    }], "progress top header");
    assert.deepEqual(getContainerContent("center"), [], "progress top center");
    assert.deepEqual(getContainerContent("footer"), [], "progress top footer");
    assert.deepEqual(getContainerContent("contentTop"), [], "progress top contentTop");
    assert.deepEqual(getContainerContent("contentBottom"), [], "progress top contentBottom");
    assert.deepEqual(getContainerContent("left"), [], "progress top left");
    assert.deepEqual(getContainerContent("right"), [], "progress top right");

    survey.showProgressBar = "belowHeader";
    assert.deepEqual(getContainerContent("header"), [{
      "component": "sv-header",
      "container": "header",
      "id": "advanced-header",
      "index": -100
    }], "progress top header");
    assert.deepEqual(getContainerContent("center"), [{
      "component": "sv-progress-pages",
      "id": "progress-pages",
    }], "progress top center");
    assert.deepEqual(getContainerContent("footer"), [], "progress top footer");
    assert.deepEqual(getContainerContent("contentTop"), [], "progress top contentTop");
    assert.deepEqual(getContainerContent("contentBottom"), [], "progress top contentBottom");
    assert.deepEqual(getContainerContent("left"), [], "progress top left");
    assert.deepEqual(getContainerContent("right"), [], "progress top right");
  }
  finally {
    settings.legacyProgressBarView = false;
  }
});

QUnit.test("getContainerContent - progress + advanced header", function (assert) {
  surveyCss.currentType = "default";
  const json = {
    title: "My Survey",
    showNavigationButtons: "none",
    pages: [
      {
        "elements": [
          {
            required: true,
            "type": "rating",
            "name": "satisfaction",
          },
          {
            required: true,
            "type": "rating",
            "name": "recommend friends",
          }
        ]
      },
      {
        "elements": [
          {
            "type": "radiogroup",
            "name": "price to competitors",
          },
          {
            "type": "radiogroup",
            "name": "price",
          },
        ]
      },
    ]
  };

  let survey = new SurveyModel(json);
  const getContainerContent = getContainerContentFunction(survey);
  survey.applyTheme({
    header: {},
    cssVariables: {
      "--sjs-header-backcolor": "var(--sjs-primary-backcolor)"
    }
  } as any);

  assert.equal(survey.showNavigationButtons, false);
  assert.equal(survey.progressBarType, "pages");
  assert.equal(survey.showProgressBar, false);

  assert.deepEqual(getContainerContent("header"), [{
    "component": "sv-header",
    "container": "header",
    "id": "advanced-header",
    "index": -100
  }], "default header");
  assert.deepEqual(getContainerContent("center"), [], "default center");
  assert.deepEqual(getContainerContent("footer"), [], "default footer");
  assert.deepEqual(getContainerContent("contentTop"), [], "default contentTop");
  assert.deepEqual(getContainerContent("contentBottom"), [], "default contentBottom");
  assert.deepEqual(getContainerContent("left"), [], "default left");
  assert.deepEqual(getContainerContent("right"), [], "default right");

  survey.showProgressBar = "top";
  assert.deepEqual(getContainerContent("header"), [{
    "component": "sv-header",
    "container": "header",
    "id": "advanced-header",
    "index": -100
  }], "progress top header alone");
  assert.deepEqual(getContainerContent("center"), [{
    "component": "sv-progress-buttons",
    "id": "progress-buttons"
  }], "progress top center alone");
  assert.deepEqual(getContainerContent("footer"), [], "progress top footer alone");
  assert.deepEqual(getContainerContent("contentTop"), [], "progress top contentTop alone");
  assert.deepEqual(getContainerContent("contentBottom"), [], "progress top contentBottom alone");
  assert.deepEqual(getContainerContent("left"), [], "progress top left alone");
  assert.deepEqual(getContainerContent("right"), [], "progress top right alone");

  survey.applyTheme({
    header: {},
    cssVariables: {
      "--sjs-header-backcolor": "transparent"
    }
  } as any);
  assert.deepEqual(getContainerContent("header"), [{
    "component": "sv-progress-buttons",
    "id": "progress-buttons",
    "index": -150
  }, {
    "component": "sv-header",
    "container": "header",
    "id": "advanced-header",
    "index": -100
  }], "progress top header");
  assert.deepEqual(getContainerContent("center"), [], "progress top center");
  assert.deepEqual(getContainerContent("footer"), [], "progress top footer");
  assert.deepEqual(getContainerContent("contentTop"), [], "progress top contentTop");
  assert.deepEqual(getContainerContent("contentBottom"), [], "progress top contentBottom");
  assert.deepEqual(getContainerContent("left"), [], "progress top left");
  assert.deepEqual(getContainerContent("right"), [], "progress top right");
});

QUnit.test("getContainerContent - do not show timer panel in display mode", function (assert) {
  const json = {
    "pages": [
      {
        "name": "Seite1",
        "elements": [
          {
            "type": "radiogroup",
            "name": "question1",
            "isRequired": true,
            "choices": [
              {
                "value": "true",
              },
              {
                "value": "false",
              }
            ]
          }
        ]
      }
    ],
    "maxTimeToFinish": 10,
    "showTimerPanel": "top",
    "showTimerPanelMode": "survey"
  };
  let survey = new SurveyModel(json);
  survey.headerView = "basic";
  const getContainerContent = getContainerContentFunction(survey);

  assert.deepEqual(getContainerContent("header"), [{
    "component": "sv-timerpanel",
    "id": "timerpanel",
    "template": "survey-timerpanel"
  }], "default header");
  assert.deepEqual(getContainerContent("center"), [], "default center");
  assert.deepEqual(getContainerContent("footer"), [], "default footer");
  assert.deepEqual(getContainerContent("contentTop"), [], "default contentTop");
  assert.deepEqual(getContainerContent("contentBottom"), [{
    "component": "sv-action-bar",
    "id": "buttons-navigation"
  }], "default contentBottom");
  assert.deepEqual(getContainerContent("left"), [], "default left");
  assert.deepEqual(getContainerContent("right"), [], "default right");

  survey.mode = "display";
  assert.deepEqual(getContainerContent("header"), [], "default header");
  assert.deepEqual(getContainerContent("center"), [], "default center");
  assert.deepEqual(getContainerContent("footer"), [], "default footer");
  assert.deepEqual(getContainerContent("contentTop"), [], "default contentTop");
  assert.deepEqual(getContainerContent("contentBottom"), [{
    "component": "sv-action-bar",
    "id": "buttons-navigation"
  }], "default contentBottom");
  assert.deepEqual(getContainerContent("left"), [], "default left");
  assert.deepEqual(getContainerContent("right"), [], "default right");
});

QUnit.test("Check triggerReponsiveness is called when isCompact changed", function (assert) {
  const json = {
    title: "My Survey",
    showNavigationButtons: "none",
    pages: [
      {
        "elements": [
          {
            type: "text",
            name: "q1"
          }
        ]
      },
      {
        "elements": [
          {
            type: "text",
            name: "q2"
          }
        ]
      },
    ]
  };
  const survey = new SurveyModel(json);
  let log = "";
  survey.getAllQuestions().forEach(q => {
    q["triggerResponsivenessCallback"] = (hard: boolean) => {
      log += `->${q.name}:${hard}`;
    };
  });
  survey["isCompact"] = true;
  assert.equal(log, "->q1:true->q2:true");
  log = "";
  survey["isCompact"] = false;
  assert.equal(log, "->q1:true->q2:true");
});
QUnit.test("element.wasREndered", function (assert) {
  const json = {
    pages: [
      {
        "elements": [
          {
            type: "text",
            name: "q1"
          }
        ]
      },
      {
        "elements": [
          {
            type: "text",
            name: "q2"
          }
        ]
      },
    ]
  };
  const survey = new SurveyModel(json);
  assert.equal(survey.pages[0].wasRendered, true, "page1 wasRendered");
  assert.equal(survey.getQuestionByName("q1").wasRendered, true, "q1 wasRendered");
  const q3 = survey.pages[0].addNewQuestion("text", "q3");
  assert.equal(q3.wasRendered, true, "q3 wasRendered");
  const panel1 = survey.pages[0].addNewPanel("panel1");
  assert.equal(panel1.wasRendered, true, "panel1 wasRendered");
  const q4 = panel1.addNewQuestion("text", "q4");
  assert.equal(q4.wasRendered, true, "q4 wasRendered");

  assert.equal(survey.pages[1].wasRendered, false, "page2 wasRendered, #1");
  assert.equal(survey.getQuestionByName("q2").wasRendered, false, "q2 wasRendered, #1");
  const q5 = survey.pages[1].addNewQuestion("text", "q5");
  assert.equal(q5.wasRendered, false, "q5 wasRendered, #1");
  const panel2 = survey.pages[1].addNewPanel("panel1");
  assert.equal(panel2.wasRendered, false, "panel2 wasRendered, #1");
  const q6 = panel2.addNewQuestion("text", "q6");
  assert.equal(q6.wasRendered, false, "q6 wasRendered, #1");

  survey.nextPage();
  assert.equal(survey.pages[1].wasRendered, true, "page2 wasRendered, #2");
  assert.equal(survey.getQuestionByName("q2").wasRendered, true, "q2 wasRendered, #2");
  assert.equal(q5.wasRendered, true, "q5 wasRendered, #2");
  assert.equal(panel2.wasRendered, true, "panel2 wasRendered, #2");
  assert.equal(q6.wasRendered, true, "q6 wasRendered, #2");
});

QUnit.test("getContainerContent - progress settings", function (assert) {
  surveyCss.currentType = "default";
  const json = {
    showNavigationButtons: "none",
    pages: [
      {
        "elements": [
          {
            required: true,
            "type": "rating",
            "name": "satisfaction",
          },
          {
            required: true,
            "type": "rating",
            "name": "recommend friends",
          }
        ]
      },
      {
        "elements": [
          {
            "type": "radiogroup",
            "name": "price to competitors",
          },
          {
            "type": "radiogroup",
            "name": "price",
          },
        ]
      },
    ]
  };

  let survey = new SurveyModel(json);
  survey.headerView = "basic";
  const getContainerContent = getContainerContentFunction(survey);

  assert.equal(settings.legacyProgressBarView, false, "show buttons progress for pages by default");
  assert.equal(survey.showProgressBar, false, "default show progress bar");
  assert.equal(survey.progressBarType, "pages", "default progress bar type");
  assert.equal(survey.progressBarShowPageNumbers, false, "don't show page numbers in progress by default");
  assert.equal(survey.progressBarShowPageTitles, false, "don't show page titles in progress by default");

  assert.deepEqual(getContainerContent("header"), [], "empty header");
  assert.deepEqual(getContainerContent("footer"), [], "empty footer");
  assert.deepEqual(getContainerContent("contentTop"), [], "empty contentTop");
  assert.deepEqual(getContainerContent("contentBottom"), [], "empty contentBottom");
  assert.deepEqual(getContainerContent("left"), [], "empty left");
  assert.deepEqual(getContainerContent("right"), [], "empty right");
  assert.deepEqual(getContainerContent("center"), [], "empty center");

  survey.showProgressBar = "auto";
  assert.deepEqual(getContainerContent("header"), [], "auto pages header");
  assert.deepEqual(getContainerContent("footer"), [], "auto pages footer");
  assert.deepEqual(getContainerContent("contentTop"), [], "auto pages contentTop");
  assert.deepEqual(getContainerContent("contentBottom"), [], "auto pages contentBottom");
  assert.deepEqual(getContainerContent("left"), [], "auto pages left");
  assert.deepEqual(getContainerContent("right"), [], "auto pages right");
  assert.deepEqual(getContainerContent("center"), [{
    "component": "sv-progress-buttons",
    "id": "progress-buttons"
  }], "auto pages center");

  survey.progressBarType = "buttons";

  assert.equal(survey.progressBarShowPageTitles, true, "show page titles in progress for buttons");

  assert.deepEqual(getContainerContent("header"), [], "auto buttons header");
  assert.deepEqual(getContainerContent("footer"), [], "auto buttons footer");
  assert.deepEqual(getContainerContent("contentTop"), [], "auto buttons contentTop");
  assert.deepEqual(getContainerContent("contentBottom"), [], "auto buttons contentBottom");
  assert.deepEqual(getContainerContent("left"), [], "auto buttons left");
  assert.deepEqual(getContainerContent("right"), [], "auto buttons right");
  assert.deepEqual(getContainerContent("center"), [{
    "component": "sv-progress-buttons",
    "id": "progress-buttons"
  }], "auto buttons center");

  survey.progressBarType = "pages";

  survey.showProgressBar = "aboveHeader";
  assert.deepEqual(getContainerContent("header"), [{
    "component": "sv-progress-buttons",
    "id": "progress-buttons",
    "index": -150
  }], "aboveHeader pages header");
  assert.deepEqual(getContainerContent("footer"), [], "aboveHeader pages footer");
  assert.deepEqual(getContainerContent("contentTop"), [], "aboveHeader pages contentTop");
  assert.deepEqual(getContainerContent("contentBottom"), [], "aboveHeader pages contentBottom");
  assert.deepEqual(getContainerContent("left"), [], "aboveHeader pages left");
  assert.deepEqual(getContainerContent("right"), [], "aboveHeader pages right");
  assert.deepEqual(getContainerContent("center"), [], "aboveHeader pages center");

  survey.showProgressBar = "belowHeader";
  assert.deepEqual(getContainerContent("header"), [], "belowHeader pages header");
  assert.deepEqual(getContainerContent("footer"), [], "belowHeader pages footer");
  assert.deepEqual(getContainerContent("contentTop"), [], "belowHeader pages contentTop");
  assert.deepEqual(getContainerContent("contentBottom"), [], "belowHeader pages contentBottom");
  assert.deepEqual(getContainerContent("left"), [], "belowHeader pages left");
  assert.deepEqual(getContainerContent("right"), [], "belowHeader pages right");
  assert.deepEqual(getContainerContent("center"), [{
    "component": "sv-progress-buttons",
    "id": "progress-buttons"
  }], "belowHeader pages center");

  survey.showProgressBar = "topBottom";
  assert.deepEqual(getContainerContent("header"), [], "topBottom pages header");
  assert.deepEqual(getContainerContent("footer"), [{
    "component": "sv-progress-buttons",
    "id": "progress-buttons"
  }], "topBottom pages footer");
  assert.deepEqual(getContainerContent("contentTop"), [], "topBottom pages contentTop");
  assert.deepEqual(getContainerContent("contentBottom"), [], "topBottom pages contentBottom");
  assert.deepEqual(getContainerContent("left"), [], "topBottom pages left");
  assert.deepEqual(getContainerContent("right"), [], "topBottom pages right");
  assert.deepEqual(getContainerContent("center"), [{
    "component": "sv-progress-buttons",
    "id": "progress-buttons"
  }], "topBottom pages center");
});

QUnit.test("getContainerContent - show advanced header on start page", function (assert) {
  surveyCss.currentType = "default";
  const json = {
    showNavigationButtons: "none",
    "firstPageIsStartPage": true,
    title: "My title",
    pages: [
      {
        "elements": [
          {
            required: true,
            "type": "rating",
            "name": "satisfaction",
          },
        ]
      },
      {
        "elements": [
          {
            "type": "radiogroup",
            "name": "price to competitors",
          },
        ]
      },
    ]
  };

  let survey = new SurveyModel(json);
  const getContainerContent = getContainerContentFunction(survey);

  assert.deepEqual(getContainerContent("header"), [{
    "component": "sv-header",
    "container": "header",
    "id": "advanced-header",
    "index": -100
  }], "advanced header");
  assert.deepEqual(getContainerContent("footer"), [], "advanced footer");
  assert.deepEqual(getContainerContent("contentTop"), [], "advanced contentTop");
  assert.deepEqual(getContainerContent("contentBottom"), [], "advanced contentBottom");
  assert.deepEqual(getContainerContent("left"), [], "advanced left");
  assert.deepEqual(getContainerContent("right"), [], "advanced right");
  assert.deepEqual(getContainerContent("center"), [], "advanced center");

  survey.headerView = "basic";
  assert.deepEqual(getContainerContent("header"), [], "empty header");
  assert.deepEqual(getContainerContent("footer"), [], "empty footer");
  assert.deepEqual(getContainerContent("contentTop"), [], "empty contentTop");
  assert.deepEqual(getContainerContent("contentBottom"), [], "empty contentBottom");
  assert.deepEqual(getContainerContent("left"), [], "empty left");
  assert.deepEqual(getContainerContent("right"), [], "empty right");
  assert.deepEqual(getContainerContent("center"), [], "empty center");
});

QUnit.test("survey.runExpressions(), #7694", function (assert) {
  function func1(params: any[]): any {
    return 1;
  }
  const survey = new SurveyModel({
    elements: [
      {
        "name": "q1",
        "type": "expression",
        "expression": "func1()",
      },
      {
        "name": "q2",
        "type": "text",
        "visibleIf": "func1() = 1",
      }
    ]
  });
  const q1 = survey.getQuestionByName("q1");
  const q2 = survey.getQuestionByName("q2");
  assert.equal(q1.value, undefined, "q1.value #1");
  assert.equal(q2.isVisible, false, "q2.isVisible #1");

  FunctionFactory.Instance.register("func1", func1);
  survey.runExpressions();
  assert.equal(q1.value, 1, "q1.value #2");
  assert.equal(q2.isVisible, true, "q2.isVisible #2");

  FunctionFactory.Instance.unregister("func1");
});
QUnit.test("survey.locale, default locale is not en and design-time, #7765", function (assert) {
  const defautlLocale = surveyLocalization.defaultLocale;
  surveyLocalization.defaultLocale = "fr";
  const json = {
    elements: [
      {
        type: "text",
        name: "q1",
        title: {
          de: "German title",
          en: "English question title",
        },
        description: {
          de: "German description",
          en: "English element description",
        }
      }
    ],
    locale: "de",
  };
  const survey = new SurveyModel();
  survey.setDesignMode(true);
  survey.fromJSON(json);
  const q1 = survey.getQuestionByName("q1");
  assert.equal(q1.hasDescription, true, "Description loaded correctly");
  surveyLocalization.defaultLocale = defautlLocale;
});
QUnit.test("onOpenFileChooser fires", function (assert) {
  const survey = new SurveyModel();
  let log = "";
  let lastContext;
  let lastContextElement;
  let lastContextPropertyName;
  survey.onOpenFileChooser.add((s, o) => {
    log += "->onOpenFileChooser";
    lastContextElement = o.element;
    lastContextPropertyName = o.propertyName;
    lastContext = (o as any).context;
    o.callback([]);
  });
  assert.equal(log, "");
  survey.chooseFiles(document.createElement("input"), () => { }, { element: { a: 1 }, propertyName: "a" } as any);
  assert.equal(log, "->onOpenFileChooser");
  assert.deepEqual(lastContext, { element: { a: 1 }, propertyName: "a" });
  assert.deepEqual(lastContextElement, { a: 1 });
  assert.equal(lastContextPropertyName, "a");
});
QUnit.test("Advanced header title/description color", function (assert) {
  const survey = new SurveyModel();

  const accHeaderBackTheme: any = { "cssVariables": {}, "header": {}, "headerView": "advanced" };
  survey.applyTheme(accHeaderBackTheme);
  let headerLayoutElement = survey.findLayoutElement("advanced-header");
  let headerModel = headerLayoutElement.data as Cover;
  assert.equal(headerModel.headerClasses, "sv-header sv-header--height-auto sv-header__without-background sv-header__background-color--none");

  headerModel.height = 256;
  assert.equal(headerModel.headerClasses, "sv-header sv-header__without-background sv-header__background-color--none");
  // assert.equal(survey.themeVariables["--sjs-font-headertitle-color"], undefined);
  // assert.equal(survey.themeVariables["--sjs-font-headertitle-color"], undefined);
  // assert.equal(survey.themeVariables["--sjs-font-headerdescription-color"], undefined);
  // assert.equal(accHeaderBackTheme.cssVariables["--sjs-font-headertitle-color"], undefined);
  // assert.equal(accHeaderBackTheme.cssVariables["--sjs-font-headerdescription-color"], undefined);

  const noneHeaderBackTheme: any = { "cssVariables": { "--sjs-header-backcolor": "transparent" }, "header": {}, "headerView": "advanced" };
  survey.applyTheme(noneHeaderBackTheme);
  headerLayoutElement = survey.findLayoutElement("advanced-header");
  headerModel = headerLayoutElement.data as Cover;
  assert.equal(headerModel.headerClasses, "sv-header sv-header--height-auto sv-header__without-background sv-header__background-color--none");

  const customNotSetHeaderBackTheme: any = { "cssVariables": { "--sjs-header-backcolor": "transparent" }, "header": {}, "headerView": "advanced" };
  survey.applyTheme(customNotSetHeaderBackTheme);
  headerLayoutElement = survey.findLayoutElement("advanced-header");
  headerModel = headerLayoutElement.data as Cover;
  assert.equal(headerModel.headerClasses, "sv-header sv-header--height-auto sv-header__without-background sv-header__background-color--none");

  const customHeaderBackTheme: any = { "cssVariables": { "--sjs-header-backcolor": "rgba(0, 255, 0, 1)" }, "header": {}, "headerView": "advanced" };
  survey.applyTheme(customHeaderBackTheme);
  headerLayoutElement = survey.findLayoutElement("advanced-header");
  headerModel = headerLayoutElement.data as Cover;
  assert.equal(headerModel.headerClasses, "sv-header sv-header--height-auto sv-header__background-color--custom");

  const customNotSetHeaderBackAndTitleTheme: any = { "cssVariables": { "--sjs-font-headertitle-color": "rgba(255, 0, 0, 1)", "--sjs-font-headerdescription-color": "rgba(255, 0, 0, 1)", "--sjs-header-backcolor": "transparent" }, "header": {}, "headerView": "advanced" };
  survey.applyTheme(customNotSetHeaderBackAndTitleTheme);
  headerLayoutElement = survey.findLayoutElement("advanced-header");
  headerModel = headerLayoutElement.data as Cover;
  assert.equal(headerModel.headerClasses, "sv-header sv-header--height-auto sv-header__without-background");

  const customHeaderBackAndTitleTheme: any = { "cssVariables": { "--sjs-font-headertitle-color": "rgba(255, 0, 0, 1)", "--sjs-font-headerdescription-color": "rgba(255, 0, 0, 1)", "--sjs-header-backcolor": "rgba(0, 255, 0, 1)" }, "header": {}, "headerView": "advanced" };
  survey.applyTheme(customHeaderBackAndTitleTheme);
  headerLayoutElement = survey.findLayoutElement("advanced-header");
  headerModel = headerLayoutElement.data as Cover;
  assert.equal(headerModel.headerClasses, "sv-header sv-header--height-auto");
});
QUnit.test("Display mode in design time", function (assert) {
  const survey = new SurveyModel();
  settings.animationEnabled = true;
  assert.equal(survey.css.rootReadOnly, "sd-root--readonly");
  assert.equal(survey.mode, "edit");
  assert.equal(survey.isDisplayMode, false);
  assert.equal(survey.getRootCss(), "sd-root-modern sd-progress--pages sd-root-modern--full-container");

  survey.mode = "display";
  assert.equal(survey.mode, "display");
  assert.equal(survey.isDisplayMode, true);
  assert.ok(survey.getRootCss().indexOf(survey.css.rootReadOnly) !== -1);

  survey.setDesignMode(true);
  assert.equal(survey.mode, "display");
  assert.equal(survey.isDisplayMode, false);
  assert.equal(survey.getRootCss(), "sd-root-modern sd-progress--pages sd-root-modern--full-container");
  settings.animationEnabled = false;
});

QUnit.test("PageModel passed property", function (assert) {
  var json = {
    pages: [
      {
        name: "page1",
        elements: [
          {
            type: "text",
            name: "question1",
          },
        ],
      },
      {
        name: "page2",
        elements: [
          {
            type: "text",
            name: "question2",
          },
        ],
      },
      {
        name: "page3",
        elements: [
          {
            type: "text",
            name: "question3",
          },
        ],
      },
    ],
  };
  var survey = new SurveyModel(json);
  assert.equal(survey.pages[0].passed, false, "1) Page 1 isn't passed");
  assert.equal(survey.pages[1].passed, false, "1) Page 2 isn't passed");
  assert.equal(survey.pages[2].passed, false, "1) Page 3 isn't passed");

  survey.nextPage();
  assert.equal(survey.pages[0].passed, true, "2) Page 1 is passed");
  assert.equal(survey.pages[1].passed, false, "2) Page 2 isn't passed");
  assert.equal(survey.pages[2].passed, false, "2) Page 3 isn't passed");

  survey.nextPage();
  assert.equal(survey.pages[0].passed, true, "3) Page 1 is passed");
  assert.equal(survey.pages[1].passed, true, "3) Page 2 is passed");
  assert.equal(survey.pages[2].passed, false, "3) Page 3 isn't passed");

  survey.prevPage();
  assert.equal(survey.pages[0].passed, true, "4) Page 1 is passed");
  assert.equal(survey.pages[1].passed, true, "4) Page 2 is passed");
  assert.equal(survey.pages[2].passed, true, "4) Page 3 is passed");

  survey.nextPage();
  survey.tryComplete();
  assert.equal(survey.pages[0].passed, true, "5) Page 1 is passed");
  assert.equal(survey.pages[1].passed, true, "5) Page 2 is passed");
  assert.equal(survey.pages[2].passed, true, "5) Page 3 is passed");
});

QUnit.test("page passed", function (assert) {
  var survey = new SurveyModel({
    "pages": [
      {
        name: "page1",
        "elements": [
          {
            "name": "q1",
            "type": "radiogroup",
            "choices": [1, 2, 3],
          },
        ],
      },
      {
        name: "page2",
        "elements": [
          {
            "name": "q2",
            "type": "text",
            "isRequired": true,
          },
          {
            "name": "q3",
            "type": "radiogroup",
            choices: [1, 2, 3],
          }
        ]
      },
    ],
  });
  survey.nextPage();
  assert.ok(survey.pages[0].passed, "First page passed");
  assert.notOk(survey.pages[1].passed, "Second page not passed");
  survey.prevPage();
  assert.ok(survey.pages[0].passed, "First page passed");
  assert.notOk(survey.pages[1].passed, "Second page not passed");
  survey.nextPage();
  assert.ok(survey.pages[0].passed, "First page passed");
  assert.notOk(survey.pages[1].passed, "Second page not passed");
  survey.getQuestionByName("q2").value = "entered text";
  survey.prevPage();
  assert.ok(survey.pages[0].passed, "First page passed");
  assert.ok(survey.pages[1].passed, "Second page passed");
});
QUnit.test("showPreview & updateProgress & updateVisibleIndexes", function (
  assert
) {
  const survey = new SurveyModel({
    showProgressBar: "top",
    progressBarType: "buttons",
    progressBarShowPageTitles: true,
    pages: [
      {
        elements: [{ type: "text", name: "q1" }]
      },
      {
        elements: [
          {
            type: "paneldynamic", name: "q2", panelCount: 10,
            elements: [{ type: "text", name: "q3", visibleIf: "{q1} = 1" }]
          },
          { type: "text", name: "q4", visibleIf: "{q1} = 1" }
        ]
      }
    ]
  });
  survey.data = { q1: 1 };
  let progressCounter = 0;
  let visibleChangedCounter = 0;
  survey.onProgressText.add((sender, options) => {
    progressCounter++;
  });
  survey.onQuestionVisibleChanged.add((sender, options) => {
    visibleChangedCounter++;
  });
  survey.showPreview();
  assert.equal(survey.progressText, "Page 1 of 1", "progressText");
  assert.equal(progressCounter, 1, "progressCounter");
  assert.equal(visibleChangedCounter, 0, "visibleChangedCounter");
});

QUnit.test("showPreview & dynamic panel? single page", function (
  assert
) {
  const survey = new SurveyModel({
    "pages": [
      {
        "name": "page1",
        "elements": [
          {
            "type": "paneldynamic",
            "name": "question1",
            "defaultValue": [
              {
                "question2": "q"
              }
            ],
            "templateElements": [
              {
                "type": "text",
                "name": "question2"
              }
            ]
          }
        ]
      }
    ],
    "questionsOnPageMode": "singlePage",
    "showPreviewBeforeComplete": "showAllQuestions"
  });
  survey.showPreview();
  assert.notOk((survey.getQuestionByName("question1") as QuestionPanelDynamicModel).panels[0].showPanelAsPage);
});

QUnit.test("check panel's visibleRows are updated sync when running condidtions after loading from json", (assert) => {
  settings.animationEnabled = true;
  const survey = new SurveyModel({
    "elements": [
      {
        "type": "panel",
        "name": "nps-panel",
        "elements": [
          {
            "type": "rating",
            "name": "nps-score",
            "rateMin": 0,
            "rateMax": 10,
          },
          {
            "type": "comment",
            "name": "disappointing-experience",
            "visibleIf": "{nps-score} <= 5",
          },
        ]
      },
    ],
    "showQuestionNumbers": false,
    "questionsOnPageMode": "questionPerPage"
  });
  const panel = survey.getPanelByName("nps-panel");
  assert.equal(panel.visibleRows.length, 1);
  assert.equal(panel.visibleRows[0].visibleElements[0].name, "nps-score");
  settings.animationEnabled = false;
});

QUnit.test("getContainerContent - do not show buttons progress in the single page mode", function (assert) {
  const json = {
    showNavigationButtons: "none",
    showProgressBar: "auto",
    pages: [
      {
        "elements": [
          {
            "type": "text",
            "name": "q1",
          },
        ]
      },
    ]
  };

  let survey = new SurveyModel(json);
  survey.headerView = "basic";
  const getContainerContent = getContainerContentFunction(survey);

  assert.equal(survey.progressBarType, "pages");
  assert.equal(survey.questionsOnPageMode, "standard");
  assert.equal(survey.showProgressBar, true);
  assert.equal(survey.progressBarLocation, "auto");
  assert.deepEqual(getContainerContent("header"), [], "");
  assert.deepEqual(getContainerContent("center"), [{
    "component": "sv-progress-buttons",
    "id": "progress-buttons"
  }], "Progress is shown");
  assert.deepEqual(getContainerContent("footer"), [], "");
  assert.deepEqual(getContainerContent("contentTop"), [], "");
  assert.deepEqual(getContainerContent("contentBottom"), [], "");
  assert.deepEqual(getContainerContent("left"), [], "");
  assert.deepEqual(getContainerContent("right"), [], "");

  survey.questionsOnPageMode = "singlePage";

  assert.deepEqual(getContainerContent("header"), [], "");
  assert.deepEqual(getContainerContent("center"), [], "Buttons progress is not shown in the single page mode");
  assert.deepEqual(getContainerContent("footer"), [], "");
  assert.deepEqual(getContainerContent("contentTop"), [], "");
  assert.deepEqual(getContainerContent("contentBottom"), [], "");
  assert.deepEqual(getContainerContent("left"), [], "");
  assert.deepEqual(getContainerContent("right"), [], "");

  survey.progressBarType = "questions";

  assert.deepEqual(getContainerContent("header"), [], "");
  assert.deepEqual(getContainerContent("center"), [{
    "component": "sv-progress-questions",
    "id": "progress-questions"
  }], "Buttons progress is shown in the single page mode for questions mode");
  assert.deepEqual(getContainerContent("footer"), [], "");
  assert.deepEqual(getContainerContent("contentTop"), [], "");
  assert.deepEqual(getContainerContent("contentBottom"), [], "");
  assert.deepEqual(getContainerContent("left"), [], "");
  assert.deepEqual(getContainerContent("right"), [], "");

  survey.showProgressBar = "bottom";

  assert.deepEqual(getContainerContent("header"), [], "");
  assert.deepEqual(getContainerContent("center"), [], "");
  assert.deepEqual(getContainerContent("footer"), [{
    "component": "sv-progress-questions",
    "id": "progress-questions"
  }], "Buttons progress is shown in the single page mode for questions mode in bottom");
  assert.deepEqual(getContainerContent("contentTop"), [], "");
  assert.deepEqual(getContainerContent("contentBottom"), [], "");
  assert.deepEqual(getContainerContent("left"), [], "");
  assert.deepEqual(getContainerContent("right"), [], "");
});
QUnit.test("Display mode in design time 2", function (assert) {
  const survey = new SurveyModel();
  assert.equal(survey.wrapperFormCss, "sd-root-modern__wrapper");

  survey.backgroundImage = "abc";
  assert.equal(survey.wrapperFormCss, "sd-root-modern__wrapper sd-root-modern__wrapper--has-image");

  survey.backgroundImageAttachment = "fixed";
  assert.equal(survey.wrapperFormCss, "sd-root-modern__wrapper sd-root-modern__wrapper--has-image sd-root-modern__wrapper--fixed");
});
QUnit.test("Delete panel with questions", (assert) => {
  const survey = new SurveyModel({
    "elements": [
      {
        "type": "panel",
        "name": "panel1",
        "elements": [
          {
            "type": "text",
            "name": "question1"
          },
          {
            "type": "text",
            "name": "question2"
          }
        ]
      },
    ]
  });
  assert.ok(survey.getPanelByName("panel1"), "#1");
  assert.ok(survey.getQuestionByName("question1"), "#2");
  assert.ok(survey.getQuestionByName("question2"), "#3");
  survey.getQuestionByName("question2").delete();
  assert.notOk(survey.getQuestionByName("question2"), "#4");
  survey.getPanelByName("panel1").delete();
  assert.notOk(survey.getPanelByName("panel1"), "#5");
  assert.notOk(survey.getQuestionByName("question1"), "#6");
});
QUnit.test("_isElementShouldBeSticky", (assert) => {
  const survey = new SurveyModel({});
  const topStickyContainer: any = {
    getBoundingClientRect: () => ({ y: 64 })
  };
  const rootElement: any = {
    getBoundingClientRect: () => ({ y: 64 }),
    querySelector: () => topStickyContainer,
    scrollTop: 0
  };
  survey.rootElement = rootElement;

  assert.notOk(survey._isElementShouldBeSticky(".test"), "no scrolling");

  rootElement.scrollTop = 50;
  assert.ok(survey._isElementShouldBeSticky(".test"), "content is scrolled");

  assert.notOk(survey._isElementShouldBeSticky(""), "empty selector - always false (with scroll)");

  rootElement.scrollTop = 0;
  assert.notOk(survey._isElementShouldBeSticky(""), "empty selector - always false (no scroll)");
});
QUnit.test("survey navigateToUrl encode url", function (assert) {
  var survey = new SurveyModel({
    questions: [
      {
        type: "text",
        name: "q1",
      }
    ],
    "navigateToUrl": "javascript:alert(2)",
  });

  const location: Location = {} as any;
  DomWindowHelper.getLocation = <any>(() => location);

  survey.doComplete();
  assert.equal(location.href, "javascript%3Aalert(2)", "encoded URL");
});
QUnit.test("Question is not in the hash with it is on the first page & questionsOnPageMode is 'questionPerPage', Bug#8583", function (assert) {
  const survey = new SurveyModel({
    "pages": [{
      "elements": [{
        "type": "text",
        "name": "q1"
      }
      ]
    },
    {
      "elements": [{
        "type": "text",
        "name": "q2"
      }] }],
    "firstPageIsStartPage": true,
    "questionsOnPageMode": "questionPerPage",
  });

  const q = survey.getQuestionByName("q1");
  assert.equal(q.name, "q1", "q1 name is here");
});
QUnit.test("questionsOnPageMode: `questionPerPage` & complete trigger & required questions on the same page, Bug#9289", function (assert) {
  const survey = new SurveyModel({
    "elements": [
      { "type": "text", "name": "q1", "isRequired": true },
      { "type": "text", "name": "q2", "isRequired": true }
    ],
    "questionsOnPageMode": "questionPerPage",
    "triggers": [
      {
        "type": "complete",
        "expression": "{q1} = 'a'"
      }
    ]
  });
  const btnComplete = survey.navigationBar.getActionById("sv-nav-complete");
  assert.equal(btnComplete.visible, false, "Complete button is visible, #1");
  assert.equal(survey.currentSingleQuestion.name, "q1", "currentSingleQuestion");
  survey.currentSingleQuestion.value = "a";
  assert.equal(btnComplete.visible, true, "Complete button is visible, #2");
  assert.equal(survey.state, "running", "Survey is running");
  btnComplete.action();
  assert.equal(survey.state, "completed", "Survey is completed");
});
QUnit.test("questionsOnPageMode: `questionPerPage` & custom complete trigger , #9376", function (assert) {
  class ScreenoutTrigger extends SurveyTriggerComplete {
    getType() { return "screenouttrigger"; }

    onSuccess(values: any, properties: any) {
      if (this.isRealExecution()) {
        this.owner.setTriggerValue("result", "screenout", false);
      }
      // Parent call
      super.onSuccess(values, properties);
    }
  }
  Serializer.addClass("screenouttrigger", [], () => { return new ScreenoutTrigger(); }, "completetrigger");

  const survey = new SurveyModel({
    "elements": [
      { "type": "text", "name": "q1", "isRequired": true },
      { "type": "text", "name": "q2", "isRequired": true }
    ],
    "questionsOnPageMode": "questionPerPage",
    "triggers": [
      {
        "type": "screenout",
        "expression": "{q1} = 'a'"
      }
    ]
  });
  const btnComplete = survey.navigationBar.getActionById("sv-nav-complete");
  assert.equal(btnComplete.visible, false, "Complete button is visible, #1");
  assert.equal(survey.currentSingleQuestion.name, "q1", "currentSingleQuestion");
  survey.currentSingleQuestion.value = "a";
  assert.equal(btnComplete.visible, true, "Complete button is visible, #2");
  assert.equal(survey.state, "running", "Survey is running");
  btnComplete.action();
  assert.equal(survey.state, "completed", "Survey is completed");

  Serializer.removeClass("screenouttrigger");
});
QUnit.test("Do not use questionsOnPageMode in design-mode, Bug#9274", function (assert) {
  const json = {
    "pages": [{
      "elements": [
        { "type": "text", "name": "q1" },
        { "type": "text", "name": "q2" }
      ]
    },
    {
      "elements": [
        { "type": "text", "name": "q3" },
        { "type": "text", "name": "q4" }
      ]
    }],
    "questionsOnPageMode": "questionPerPage",
  };
  const survey = new SurveyModel();
  survey.setDesignMode(true);
  survey.fromJSON(json);
  assert.equal(survey.questionsOnPageMode, "questionPerPage", "the property set correctly");
  assert.equal(survey.currentSingleQuestion?.name, undefined, "It is the design mode");
});
QUnit.test("survey.currentSingleQuestion & Page events, Bug#9381", function (assert) {
  const json = {
    "pages": [{
      "elements": [
        { "type": "text", "name": "q1" },
        { "type": "text", "name": "q2" }
      ]
    },
    {
      "elements": [
        { "type": "text", "name": "q3" },
        { "type": "text", "name": "q4" }
      ]
    }],
    "questionsOnPageMode": "questionPerPage",
  };
  const survey = new SurveyModel(json);
  const onPageChanged = new Array<any>();
  const onPageChanging = new Array<any>();
  const addToOnPages = (array, options: any) => {
    array.push({ newPage: options.newCurrentPage.name, oldPage: options.oldCurrentPage?.name,
      newQuestion: options.newCurrentQuestion?.name, oldQuestion: options.oldCurrentQuestion?.name,
      forward: options.isGoingForward, backward: options.isGoingBackward });
  };
  survey.onCurrentPageChanged.add((sender, options) => {
    addToOnPages(onPageChanged, options);
  });
  let doAllow = true;
  survey.onCurrentPageChanging.add((sender, options) => {
    options.allow = doAllow;
    addToOnPages(onPageChanging, options);
  });
  assert.equal(survey.currentSingleQuestion?.name, "q1", "currentSingleQuestion #1");
  survey.performNext();
  assert.equal(survey.currentSingleQuestion?.name, "q2", "currentSingleQuestion #2");
  survey.performNext();
  assert.equal(survey.currentSingleQuestion?.name, "q3", "currentSingleQuestion #3");
  survey.performNext();
  assert.equal(survey.currentSingleQuestion?.name, "q4", "currentSingleQuestion #4");
  survey.performPrevious();
  assert.equal(survey.currentSingleQuestion?.name, "q3", "currentSingleQuestion #5");
  survey.performPrevious();
  assert.equal(survey.currentSingleQuestion?.name, "q2", "currentSingleQuestion #6");
  survey.performPrevious();
  assert.equal(survey.currentSingleQuestion?.name, "q1", "currentSingleQuestion #7");
  const result = [{ newPage: "page1", oldPage: "page1", newQuestion: "q2", oldQuestion: "q1", forward: true, backward: false },
    { newPage: "page2", oldPage: "page1", newQuestion: "q3", oldQuestion: "q2", forward: true, backward: false },
    { newPage: "page2", oldPage: "page2", newQuestion: "q4", oldQuestion: "q3", forward: true, backward: false },
    { newPage: "page2", oldPage: "page2", newQuestion: "q3", oldQuestion: "q4", forward: false, backward: true },
    { newPage: "page1", oldPage: "page2", newQuestion: "q2", oldQuestion: "q3", forward: false, backward: true },
    { newPage: "page1", oldPage: "page1", newQuestion: "q1", oldQuestion: "q2", forward: false, backward: true },
  ];
  assert.deepEqual(onPageChanging, result, "onChanged #1");
  assert.deepEqual(onPageChanged, result, "onChanging #1");
  onPageChanging.splice(0, onPageChanging.length);
  onPageChanged.splice(0, onPageChanged.length);
  doAllow = false;
  survey.performNext();
  assert.equal(survey.currentSingleQuestion?.name, "q1", "currentSingleQuestion #8");
  assert.deepEqual(onPageChanged, [], "onChanged #2");
  assert.deepEqual(onPageChanging, [{ newPage: "page1", oldPage: "page1", newQuestion: "q2", oldQuestion: "q1", forward: true, backward: false }], "onChanging #2");
});

QUnit.test("Question is not in the hash with it is on the first page & questionsOnPageMode is 'singlePage', Bug#8583", function (assert) {
  const survey = new SurveyModel({
    "pages": [{
      "elements": [{
        "type": "text",
        "name": "q1"
      }
      ]
    },
    {
      "elements": [{
        "type": "text",
        "name": "q2"
      }] }],
    "firstPageIsStartPage": true,
    "questionsOnPageMode": "singlePage",
  });

  const q = survey.getQuestionByName("q1");
  assert.equal(q.name, "q1", "q1 name is here");
});
QUnit.test("Check showPageTitles & questionsOnPageMode is 'singlePage' on switching locales, Bug#9048", function (assert) {
  const survey = new SurveyModel({
    "pages": [{
      "title": {
        "default": "Page 1",
        "de": "Page 1, de"
      },
      "elements": [{
        "type": "text",
        "name": "q1"
      }
      ]
    },
    {
      "title": {
        "default": "Page 2",
        "de": "Page 2, de"
      },
      "elements": [{
        "type": "text",
        "name": "q2"
      }] }],
    "showPageTitles": false,
    "questionsOnPageMode": "singlePage",
  });
  const panels = survey.currentPage.elements;
  assert.equal(panels.length, 2, "There are two panels");
  assert.equal((<PanelModel>panels[0]).hasTitle, false, "panels[0], locale en");
  assert.equal((<PanelModel>panels[1]).hasTitle, false, "panels[1], locale en");
  survey.locale = "de";
  assert.equal((<PanelModel>panels[0]).hasTitle, false, "panels[0], locale de");
  assert.equal((<PanelModel>panels[1]).hasTitle, false, "panels[1], locale de");
  survey.locale = "";
  assert.equal((<PanelModel>panels[0]).hasTitle, false, "panels[0], locale ''");
  assert.equal((<PanelModel>panels[1]).hasTitle, false, "panels[1], locale ''");
});
QUnit.test("Check questionsOnPageMode is 'singlePage' on switching locales, Bug#9048", function (assert) {
  const survey = new SurveyModel({
    "pages": [{
      "title": {
        "default": "Page 1",
        "de": "Page 1, de"
      },
      "elements": [{
        "type": "text",
        "name": "q1"
      }
      ]
    },
    {
      "title": {
        "default": "Page 2",
        "de": "Page 2, de"
      },
      "elements": [{
        "type": "text",
        "name": "q2"
      }] }],
    "questionsOnPageMode": "singlePage",
  });
  const panels = survey.currentPage.elements;
  assert.equal(panels.length, 2, "There are two panels");
  assert.equal((<PanelModel>panels[0]).hasTitle, true, "panels[0], locale en");
  assert.equal((<PanelModel>panels[1]).hasTitle, true, "panels[1], locale en");
  survey.locale = "de";
  assert.equal((<PanelModel>panels[0]).hasTitle, true, "panels[0], locale de");
  assert.equal((<PanelModel>panels[1]).hasTitle, true, "panels[1], locale de");
  survey.locale = "";
  assert.equal((<PanelModel>panels[0]).hasTitle, true, "panels[0], locale ''");
  assert.equal((<PanelModel>panels[1]).hasTitle, true, "panels[1], locale ''");
});
QUnit.test("Check questionsOnPageMode is 'singlePage' & buttons visibility", function (assert) {
  const survey = new SurveyModel({
    "pages": [{
      "elements": [{
        "type": "text",
        "name": "q1"
      }
      ]
    },
    {
      "elements": [{
        "type": "text",
        "name": "q2"
      }] }],
    "questionsOnPageMode": "singlePage",
  });
  assert.equal(survey.isShowNextButton, false, "Next button is hidden");
  assert.equal(survey.isShowPrevButton, false, "Prev button is hidden");
  assert.equal(survey.isCompleteButtonVisible, true, "Complete button is visible");
});

QUnit.test("Check questionsOnPageMode is 'singlePage' & showPreview", function (assert) {
  const survey = new SurveyModel({
    "pages": [{
      "elements": [
        { "type": "text", "name": "q1" },
        { "type": "text", "name": "q2" }
      ]
    },
    {
      "elements": [
        { "type": "text", "name": "q3" },
        { "type": "text", "name": "q4" }
      ] }],
    "questionsOnPageMode": "singlePage",
    "showPreviewBeforeComplete": "showAllQuestions"
  });
  assert.equal(survey.visiblePageCount, 1, "There is one visible page, #1");
  assert.equal(survey.visiblePages[0].name, "single-page", "The name is single-page, #1");
  survey.showPreview();
  assert.equal(survey.visiblePageCount, 1, "There is one visible page");
  assert.equal(survey.visiblePages[0].name, "preview-page", "The name is preview-page");
  assert.equal(survey.visiblePages[0].elements.length, 1, "It has only one element");
  let singlePage = <PageModel>survey.visiblePages[0].elements[0];
  const singlePageId = singlePage.id;
  assert.equal(singlePage.getType(), "page", "It is a page");
  assert.equal(singlePage.name, "single-page", "It is a single page in the preview, page name");
  assert.equal(singlePage.isPage, false, "Single page in not a page in the preview");
  assert.equal(singlePage.isPanel, true, "Single page in not a panel in the preview");
  assert.equal(singlePage.elements.length, 2, "Two pages in the single page");
  assert.equal(singlePage.elements[0].getType(), "page", "Panel is page");
  assert.equal(singlePage.hasEditButton, true, "Single page has the cancel preview button");
  assert.ok(singlePage.getFooterToolbar().getActionById("cancel-preview"), "single page has Cancel preview button");
  assert.equal((<PageModel>singlePage.elements[0]).getFooterToolbar().actions.length, 0, "original pages don't have Cancel preview button");
  assert.equal((<PageModel>singlePage.elements[0]).hasEditButton, false, "original page doesn't have the cancel preview button");

  singlePage.cancelPreview();
  assert.equal(survey.visiblePageCount, 1, "There is one visible page, #2");
  assert.equal(survey.visiblePages[0].name, "single-page", "The name is single-page, #2");
  assert.equal(survey.visiblePages[0].id, singlePageId, "We do not re-create the single-page, #2");
});

QUnit.test("The Start Page has -1 index when enabling auto-numeration for survey pages, Bug#8983", function (assert) {
  const survey = new SurveyModel({
    "pages": [{
      "elements": [{
        "type": "text",
        "name": "q1"
      }
      ]
    },
    {
      "elements": [{
        "type": "text",
        "name": "q2"
      }] }],
    "showPageNumbers": true,
    "firstPageIsStartPage": true,
  });
  assert.equal(survey.pages[0].no, "", "start page should be empty, #1");
  assert.equal(survey.pages[1].no, "1. ", "pages[1], #1");
  survey.firstPageIsStartPage = false;
  assert.equal(survey.pages[0].no, "1. ", "pages[0], #2");
  assert.equal(survey.pages[1].no, "2. ", "pages[1], #2");
});
QUnit.test("Trim key in setting the data, Bug#8586", function (assert) {
  const survey = new SurveyModel({
    elements: [
      { type: "text", name: "q1\n" },
      { type: "text", name: "\nq2 " },
      { type: "text", name: " q3\n\n" },
      { type: "text", name: "\nq4\n" }
    ]
  });
  survey.data = { "q1\n": "a", "\nq2 ": "b", " q3\n\n": "c", q4: "d" };
  assert.equal(survey.getQuestionByName("q1").value, "a", "q1.value");
  assert.equal(survey.getQuestionByName("q2").value, "b", "q2.value");
  assert.equal(survey.getQuestionByName("q3").value, "c", "q3.value");
  assert.equal(survey.getQuestionByName("q4").value, "d", "q3.value");
});

QUnit.test("Check that focusInput works correctly with shadow dom", function (assert) {
  const survey = new SurveyModel({
    elements: [
      { type: "text", name: "q1" },
    ]
  });
  const root = document.createElement("div");
  root.attachShadow({ mode: "open" });
  const question = survey.getAllQuestions()[0];
  survey.rootElement = document.createElement("div");
  const input = document.createElement("input");
  input.id = question.inputId;
  survey.rootElement.appendChild(input);
  root.shadowRoot?.appendChild(survey.rootElement);
  document.body.appendChild(root);
  document.body.focus();
  assert.equal(document.activeElement, document.body);
  question.focusInputElement(false);
  assert.equal(document.activeElement, root);
  assert.equal(root.shadowRoot?.activeElement, input);
  root.remove();
});
QUnit.test("Check page is cleared only after unmount", function (assert) {
  const survey = new SurveyModel({
    pages: [
      {
        name: "p1",
        elements: [
          { type: "text", name: "q1" },
        ]
      },
      {
        name: "p2",
        elements: [
          { type: "text", name: "q2" },
        ]
      },
      {
        name: "p3",
        elements: [
          { type: "text", name: "q3" },
        ]
      }
    ]
  });
  const page1 = survey.getPageByName("p1");
  page1.supportOnElementRerenderedEvent = true;
  page1.enableOnElementRerenderedEvent();
  survey.removePage(page1);
  assert.ok(!!page1.survey);
  page1.disableOnElementRerenderedEvent();
  assert.notOk(!!page1.survey);

  const page2 = survey.getPageByName("p2");
  page2.supportOnElementRerenderedEvent = true;
  page2.enableOnElementRerenderedEvent();
  survey.removePage(page2);
  survey.addPage(page2);
  assert.ok(!!page2.survey);
  page2.disableOnElementRerenderedEvent();
  assert.ok(!!page2.survey);

  const page3 = survey.getPageByName("p3");
  page3.supportOnElementRerenderedEvent = true;
  survey.removePage(page3);
  assert.notOk(!!page3.survey);
});
QUnit.test("Reduce the number of calls of setVisibleIndexes function", function (assert) {
  const survey = new SurveyModel();
  survey.setDesignMode(true);
  let counter = 0;
  survey.onProgressText.add((sender, options) => {
    counter++;
  });
  survey.fromJSON({
    pages: [{
      elements: [
        {
          name: "p1_q1",
          type: "paneldynamic",
          templateElements: [
            { type: "text", name: "p1_q2" },
            {
              name: "p1_q3",
              type: "paneldynamic",
              templateElements: [
                { type: "text", name: "p1_q4" },
                { type: "text", name: "p1_q5" }],
            }
          ]
        }
      ]
    },
    {
      elements: [
        {
          name: "p2_q1",
          type: "paneldynamic",
          templateElements: [
            { type: "text", name: "p2_q2" },
            {
              name: "p2_q3",
              type: "paneldynamic",
              templateElements: [
                { type: "text", name: "p2_q4" },
                { type: "text", name: "p2_q5" }],
            }
          ]
        }
      ]
    }]
  });
  assert.equal(survey.progressText, "Page 1 of 2", "progressText");
  assert.equal(counter, 1, "On loading");
  survey.pages[1].onFirstRendering();
  assert.equal(counter, 1, "page[1].onFirstRendering(), do nothing");
});
QUnit.test("Do not include questions.values into survey.getFilteredValue in design time", function (assert) {
  const survey = new SurveyModel({
    elements: [{ type: "text", name: "q1", defaultValue: 1 }],
    calculatedValues: [{ name: "val1", expression: "2" }]
  });
  assert.deepEqual(survey.getFilteredValues(), { q1: 1, val1: 2 }, "survey in running state");
  survey.setDesignMode(true);
  assert.deepEqual(survey.getFilteredValues(), { val1: 2 }, "survey at design time");
});
QUnit.test("onValueChanged event & isExpressionRunning parameter", function (assert) {
  const survey = new SurveyModel({
    elements: [
      { type: "text", name: "q1" },
      { type: "text", name: "q2", setValueExpression: "{q1} + 1" },
      { type: "text", name: "q3", defaultValueExpression: "{q1} + 2" },
      { type: "text", name: "q4", resetValueIf: "{q1} > 0" },
      { type: "text", name: "q5", resetValueIf: "{q1} > 0" }
    ],
    triggers: [
      { type: "setvalue", setToName: "q5", expression: "{q4} = 2", setValue: 5 },
      { type: "runexpression", setToName: "q5", expression: "{q4} = 3", runExpression: "{q4} + 5" },
    ]
  });
  survey.getQuestionByName("q4").value = 4;
  const logs: Array<any> = [];
  survey.onValueChanged.add((sender, options) => {
    logs.push({ name: options.name, val: options.value,
      reason: options.reason
    });
  });
  survey.getQuestionByName("q1").value = 1;
  assert.deepEqual(survey.data, { q1: 1, q2: 2, q3: 3 }, "survey.data #1");
  assert.deepEqual(logs, [
    { name: "q3", val: 3, reason: "expression" },
    { name: "q2", val: 2, reason: "expression" },
    { name: "q4", val: undefined, reason: "expression" },
    { name: "q1", val: 1, reason: undefined }], "logs #1");

  logs.splice(0, logs.length);
  survey.getQuestionByName("q4").value = 2;
  assert.deepEqual(survey.data, { q1: 1, q2: 2, q3: 3, q4: 2, q5: 5 }, "survey.data #2");
  assert.deepEqual(logs, [
    { name: "q5", val: 5, reason: "trigger" },
    { name: "q4", val: 2, reason: undefined }], "logs #2");

  logs.splice(0, logs.length);
  survey.getQuestionByName("q4").value = 3;
  assert.deepEqual(survey.data, { q1: 1, q2: 2, q3: 3, q4: 3, q5: 8 }, "survey.data #3");
  assert.deepEqual(logs, [
    { name: "q5", val: 8, reason: "trigger" },
    { name: "q4", val: 3, reason: undefined }], "logs #3");
});

QUnit.test("#9110 check focus question inside paneldynamic works correctly", function (assert) {
  let log = "";
  const oldScrollElementToViewCore = SurveyElement.ScrollElementToViewCore;
  const oldScrollElementToTop = SurveyElement.ScrollElementToTop;
  SurveyElement.ScrollElementToViewCore = ((el, _, __, ___, doneCallback) => {
    log += `->${el.id}`;
    doneCallback();
  }) as any;
  SurveyElement.ScrollElementToTop = ((elId, _, __, doneCallback) => {
    (SurveyElement as any).ScrollElementToViewCore({ id: elId }, null, null, null, doneCallback);
  }) as any;
  const survey = new SurveyModel({
    "elements": [
      {
        type: "paneldynamic",
        name: "p1",
        templateElements: [
          {
            type: "text",
            name: "text"
          }
        ],
        panelCount: 1
      },
    ],
  });
  const panelDynamic = <QuestionPanelDynamicModel>survey.getAllQuestions()[0];
  const rootElement = document.createElement("div");
  const rootWrapper = document.createElement("div");
  rootWrapper.id = "root-wrapper";
  rootWrapper.className = survey.css.rootWrapper;
  rootElement.appendChild(rootWrapper);
  survey.rootElement = rootElement;
  const quesiton = panelDynamic.panels[0].questions[0];
  survey.scrollElementToTop(quesiton, quesiton, null as any, "text_question_id", false, null, null, () => {
    log += "->focused text question";
  });
  assert.equal(log, "->text_question_id->focused text question");
  SurveyElement.ScrollElementToViewCore = oldScrollElementToViewCore;
  SurveyElement.ScrollElementToTop = oldScrollElementToTop;
});
QUnit.test("Show warning on loadig JSON created in higher version of Creator", function (assert) {
  const oldVersion = settings.version;
  const prevWarn = ConsoleWarnings.warn;
  let reportText: string = "";
  ConsoleWarnings.warn = (text: string) => {
    reportText = text;
  };
  const checkFunc = (jsonVer: string, sjsVer: string, showWarn: boolean): void => {
    reportText = "";
    settings.version = sjsVer;
    new SurveyModel({
      sjsVersion: jsonVer
    });
    assert.equal(!!reportText, showWarn, "jsonVersion: " + jsonVer + ", sjsVer: " + sjsVer);
  };
  checkFunc("1.12.19", "2.0.2", false);
  checkFunc("2.0.2", "1.12.19", true);
  checkFunc("2.0.2", "2.0.2", false);
  checkFunc("2.0.3", "2.0.2", true);
  ConsoleWarnings.warn = prevWarn;
  settings.version = oldVersion;
});