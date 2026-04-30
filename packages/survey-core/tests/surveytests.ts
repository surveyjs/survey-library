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
import { ConditionsParser } from "../src/conditions/conditionsParser";
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
import { getRenderedSize, getRenderedStyleSize } from "../src/utils/utils";
import { wrapUrlForBackgroundImage } from "../src/utils/dom-utils";
import { increaseHeightByContent } from "../src/utils/text-area";
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
import { Action } from "../src/actions/action";
import { ActionContainer } from "../src/actions/container";

import { describe, test, expect, vi } from "vitest";
describe("Survey", () => {
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

  test("set data property", () => {
    var survey = new SurveyModel();
    expect(survey.data, "there is no data").toEqualValues({});
    survey.data = { strVal: "item1", intVal: 5 };
    expect(survey.data, "set the object").toEqualValues({ strVal: "item1", intVal: 5 });
    survey.data = null;
    expect(survey.data, "clear data").toEqualValues({});
  });
  test("merge data property", () => {
    var survey = new SurveyModel();
    survey.mergeData({ strVal: "item1", intVal: 5 });
    expect(survey.data, "works as set data for empty data").toEqualValues({ strVal: "item1", intVal: 5 });
    survey.mergeData({ intVal: 7, boolVal: false });
    expect(survey.data, "merge the data, overrides values").toEqualValues({ strVal: "item1", intVal: 7, boolVal: false });
    survey.mergeData(null);
    expect(survey.data, "do nothing").toEqualValues({ strVal: "item1", intVal: 7, boolVal: false });
  });
  test("merge data for image question", () => {
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
    expect(question.value, "value set correctly").toEqualValues(imageData);
  });
  test("Add two pages", () => {
    var survey = new SurveyModel();
    survey.addPage(new PageModel("Page 1"));
    survey.addPage(new PageModel("Page 2"));
    expect(survey.PageCount, "Two pages").toLooseEqual(2);
  });
  test("create page and make it first", () => {
    var survey = new SurveyModel();
    survey.addPage(new PageModel("Page 1"));
    survey.addPage(new PageModel("Page 2"));
    var newPage = survey.createNewPage("new Page");
    survey.addPage(newPage, 0);
    expect(survey.PageCount, "Three pages").toLooseEqual(3);
    expect(survey.pages[0].name, "New page is inserted correctly").toLooseEqual("new Page");
    survey.addNewPage("second Page", 1);
    expect(survey.PageCount, "Four pages").toLooseEqual(4);
    expect(survey.pages[1].name, "Second page is inserted correctly").toLooseEqual("second Page");
  });
  test("Current Page", () => {
    var survey = new SurveyModel();
    survey.addPage(createPageWithQuestion("Page 1"));
    expect(survey.currentPageNo, "the first page is  current").toLooseEqual(0);
    survey.currentPage = null;
    expect(survey.currentPageNo, "can't set curent page to null").toLooseEqual(0);
    var sPage = createPageWithQuestion("new Page");
    survey.addPage(sPage);
    survey.currentPage = sPage;
    expect(survey.currentPageNo, "second page is current").toLooseEqual(1);
    survey.pages.pop();
    expect(survey.currentPageNo, "the first page is current after removing the current one").toLooseEqual(0);
  });
  test("Set number and name into currentPage property", () => {
    var survey = new SurveyModel();
    survey.addPage(createPageWithQuestion("page1"));
    survey.addPage(createPageWithQuestion("page2"));
    survey.addPage(createPageWithQuestion("page3"));
    expect(survey.currentPage.name, "The current page is page1").toLooseEqual("page1");
    survey.currentPage = 1;
    expect(survey.currentPage.name, "The current page is page2, set by number").toLooseEqual("page2");
    survey.currentPage = 4;
    expect(survey.currentPage.name, "The current page is still page2, set by number that doesn't exist").toLooseEqual("page2");
    survey.currentPage = "page3";
    expect(survey.currentPage.name, "The current page is page3, set by name").toLooseEqual("page3");
    survey.currentPage = "page5";
    expect(survey.currentPage.name, "The current page is still page3, set by name that doesn't exist").toLooseEqual("page3");
  });
  test("CurrentPageNo", () => {
    var survey = new SurveyModel();
    survey.addPage(createPageWithQuestion("Page 1"));
    expect(survey.currentPageNo, "the first page is  current").toLooseEqual(0);
    survey.currentPageNo = -1;
    expect(survey.currentPageNo, "can't set curent page to -1").toLooseEqual(0);
    survey.currentPageNo = 1;
    expect(survey.currentPageNo, "can't set curent page to PageNo + 1").toLooseEqual(0);
    var sPage = createPageWithQuestion("new Page");
    survey.addPage(sPage);
    survey.currentPageNo = 1;
    expect(survey.currentPageNo, "second page is current").toLooseEqual(1);
    survey.pages.pop();
    expect(survey.currentPageNo, "the first page is current after removing the current one").toLooseEqual(0);
  });
  test("PageModel navigationTitle and navigationDescription properties", () => {
    var page = new PageModel("Page 1");
    page.navigationTitle = "Title";
    expect(page.locNavigationTitle.renderedHtml, "The locNavigationTitle property correspond navigationTitle").toLooseEqual("Title");
    page.navigationDescription = "Description";
    expect(page.getLocalizableString("navigationDescription").renderedHtml, "The locNavigationDescription property correspond navigationDescription").toLooseEqual("Description");
  });
  test("PageModel.renderedNavigationTitle", () => {
    const survey = new SurveyModel({
      pages: [
        { name: "page1" },
        { name: "page2", title: "Page 2" },
        { name: "page3", title: "Page 3", navigationTitle: "NavPage 3" },
        { name: "page4", navigationTitle: "NavPage 4" },
      ]
    });
    expect(survey.pages[0].renderedNavigationTitle, "page1").toLooseEqual("page1");
    expect(survey.pages[1].renderedNavigationTitle, "page2").toLooseEqual("Page 2");
    expect(survey.pages[2].renderedNavigationTitle, "page3").toLooseEqual("NavPage 3");
    expect(survey.pages[3].renderedNavigationTitle, "page4").toLooseEqual("NavPage 4");
  });

  test("PageModel.renderedNavigationTitle & piped text", () => {
    const survey = new SurveyModel({
      pages: [
        { name: "page1", elements: [{ type: "text", name: "q1" }] },
        { name: "page2", title: "Page 2", elements: [{ type: "text", name: "q2" }] },
        { name: "page3", title: "Page 3", navigationTitle: "NavPage 3, {q1}", elements: [{ type: "text", name: "q3" }] },
        { name: "page4", navigationTitle: "NavPage 4, {q2}", elements: [{ type: "text", name: "q4" }] },
      ]
    });
    expect(survey.pages[0].renderedNavigationTitle, "page1, #1").toLooseEqual("page1");
    expect(survey.pages[1].renderedNavigationTitle, "page2, #1").toLooseEqual("Page 2");
    expect(survey.pages[2].renderedNavigationTitle, "page3, #1").toLooseEqual("NavPage 3, ");
    expect(survey.pages[3].renderedNavigationTitle, "page4, #1").toLooseEqual("NavPage 4, ");
    survey.setValue("q1", "val1");
    survey.setValue("q2", "val2");
    expect(survey.pages[0].renderedNavigationTitle, "page1, #2").toLooseEqual("page1");
    expect(survey.pages[1].renderedNavigationTitle, "page2, #2").toLooseEqual("Page 2");
    expect(survey.pages[2].renderedNavigationTitle, "page3, #2").toLooseEqual("NavPage 3, val1");
    expect(survey.pages[3].renderedNavigationTitle, "page4, #2").toLooseEqual("NavPage 4, val2");
  });

  test("Remove Page in design mode", () => {
    var survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.addPage(new PageModel("Page 1"));
    survey.addPage(new PageModel("Page 2"));
    expect(survey.PageCount, "Two pages").toLooseEqual(2);
    expect(survey.currentPage.name, "the first page is  current").toLooseEqual("Page 1");

    survey.removePage(survey.pages[0]);
    expect(survey.PageCount, "One page left").toLooseEqual(1);
    expect(survey.currentPage.name, "the second page is  current").toLooseEqual("Page 2");
  });
  test("Do not change currentPage on re-ordering pages in design mode (remove/delete)", () => {
    var survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.addNewPage("Page1");
    survey.addNewPage("Page2");
    survey.addNewPage("Page3");
    expect(survey.PageCount, "3 pages").toLooseEqual(3);
    expect(survey.currentPage.name, "The first page is current").toLooseEqual("Page1");
    survey.onContainsPageCallback = function () {
      return true;
    };
    var page = survey.pages[0];
    survey.pages.splice(0, 1);
    expect(survey.currentPage.name, "The first page is still current").toLooseEqual("Page1");
    survey.pages.splice(2, 0, page);
    survey.onContainsPageCallback = null;
    expect(survey.currentPage.name, "The first page is still current, # 2").toLooseEqual("Page1");
    expect(survey.pages[2].name, "The first page is becomes last in list").toLooseEqual("Page1");
  });

  test("Survey.onValueChanged event, #352", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("page1");
    var q1 = <QuestionDropdownModel>page.addNewQuestion("dropdown", "q1");
    q1.choices = [1, 2, 3];
    q1.showOtherItem = true;
    var valueChangedCallCounter = 0;
    survey.onValueChanged.add(function (survey, options) {
      valueChangedCallCounter++;
    });
    expect(valueChangedCallCounter, "Nothing happens").toLooseEqual(0);
    q1.value = 1;
    expect(valueChangedCallCounter, "Set one value").toLooseEqual(1);
    q1.value = q1.otherItem.value;
    expect(valueChangedCallCounter, "Set other value").toLooseEqual(2);
    q1.otherValue = "new comment";
    expect(valueChangedCallCounter, "Set comment to other value").toLooseEqual(3);
  });
  test("Do not show errors in display mode", () => {
    var survey = new SurveyModel({
      pages: [
        { name: "p1", elements: [{ type: "html", name: "info" }] },
        { name: "p2", elements: [{ type: "text", name: "q1" }] },
        { name: "p3", elements: [{ type: "text", name: "q2" }] },
      ],
      firstPageIsStartPage: true
    });
    survey.readOnly = true;
    expect(survey.activePage.name, "active page page is p2").toLooseEqual("p2");
    expect(survey.currentPage.name, "current page page is p2").toLooseEqual("p2");
    expect(survey.isShowPrevButton, "prev, first page").toLooseEqual(false);
    expect(survey.isShowNextButton, "next, first page").toLooseEqual(true);
    expect(survey.isCompleteButtonVisible, "complete, display mode").toLooseEqual(false);
    survey.nextPage();
    expect(survey.activePage.name, "active page page is p3").toLooseEqual("p3");
    expect(survey.currentPage.name, "current page page is p3").toLooseEqual("p3");
    expect(survey.isShowPrevButton, "prev, second page").toLooseEqual(true);
    expect(survey.isShowNextButton, "next, second page").toLooseEqual(false);
    expect(survey.isCompleteButtonVisible, "complete, display mode").toLooseEqual(false);
    survey.prevPage();
    expect(survey.activePage.name, "active page page is p2, #2").toLooseEqual("p2");
    expect(survey.currentPage.name, "current page page is p2, #2").toLooseEqual("p2");
  });
  test("firstPageIsStartPage & questionsOnPageMode, Bug#9510", () => {
    var survey = new SurveyModel({
      pages: [
        { name: "p1", elements: [{ type: "text", name: "info1" }, { type: "text", name: "info2" }] },
        { name: "p2", elements: [{ type: "text", name: "q1" }] },
        { name: "p3", elements: [{ type: "text", name: "q2" }, { type: "text", name: "q3" }] },
      ],
      firstPageIsStartPage: true,
      questionsOnPageMode: "questionPerPage"
    });
    expect(survey.activePage.name, "active page #1").toLooseEqual("p1");
    expect(survey.activePage.rows.length, "rows #1").toLooseEqual(2);
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion #1").toLooseEqual("q1");
    survey.start();
    expect(survey.activePage.name, "active page #2").toLooseEqual("p2");
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion #2").toLooseEqual("q1");
    expect(survey.activePage.rows.length, "rows #2").toLooseEqual(1);
    expect(survey.isShowPrevButton, "isShowPrevButton #2").toLooseEqual(false);
    survey.performNext();
    expect(survey.activePage.name, "active page #3").toLooseEqual("p3");
    expect(survey.activePage.rows.length, "rows #3").toLooseEqual(1);
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion #3").toLooseEqual("q2");
    expect(survey.isShowPrevButton, "isShowPrevButton #3").toLooseEqual(true);
    survey.performNext();
    expect(survey.activePage.name, "active page #4").toLooseEqual("p3");
    expect(survey.activePage.rows.length, "rows #4").toLooseEqual(1);
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion #4").toLooseEqual("q3");
    expect(survey.isShowPrevButton, "isShowPrevButton #4").toLooseEqual(true);
    survey.performPrevious();
    expect(survey.activePage.name, "active page #5").toLooseEqual("p3");
    expect(survey.activePage.rows.length, "rows #5").toLooseEqual(1);
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion #5").toLooseEqual("q2");
    expect(survey.isShowPrevButton, "isShowPrevButton #5").toLooseEqual(true);
    survey.performPrevious();
    expect(survey.activePage.name, "active page #6").toLooseEqual("p2");
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion #6").toLooseEqual("q1");
    expect(survey.activePage.rows.length, "rows #6").toLooseEqual(1);
    expect(survey.isShowPrevButton, "isShowPrevButton #6").toLooseEqual(false);
  });
  test("Check page num when first page is started", () => {
    var survey = new SurveyModel({
      pages: [
        { name: "p1", elements: [{ type: "html", name: "info" }] },
        { name: "p2", elements: [{ type: "text", name: "q1" }] },
        { name: "p3", elements: [{ type: "text", name: "q2" }] },
      ],
      firstPageIsStartPage: true
    });
    expect(survey.pages[0].num).toLooseEqual(-1);
    expect(survey.pages[0].visibleIndex).toLooseEqual(-1);
    expect(survey.pages[1].num).toLooseEqual(1);
    expect(survey.pages[1].visibleIndex).toLooseEqual(0);
    expect(survey.pages[2].num).toLooseEqual(2);
    expect(survey.pages[2].visibleIndex).toLooseEqual(1);
  });

  test("Do not show errors in display mode", () => {
    var survey = twoPageSimplestSurvey();
    (<Question>survey.pages[0].questions[0]).isRequired = true;
    survey.readOnly = true;
    survey.nextPage();
    expect(survey.currentPageNo, "Can move into another page").toLooseEqual(1);
  });
  test("Do not run triggers in display mode", () => {
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
    survey.readOnly = true;
    survey.setValue("question2", 2);
    survey.nextPage();
    expect(survey.currentPageNo, "Can move into another page").toLooseEqual(1);
    expect(survey.state, "survey is running").toLooseEqual("running");
    expect(survey.getValue("question3"), "question3 value is not set").toLooseEqual(undefined);
  });
  test("Do not show errors if ignoreValidation = true", () => {
    const survey = twoPageSimplestSurvey();
    const q1 = survey.pages[0].questions[0];
    q1.isRequired = true;
    survey.pages[1].questions[0].isRequired = true;
    expect(survey.validationEnabled, "validationEnabled #1").toLooseEqual(true);
    expect(survey.ignoreValidation, "ignoreValidation #1").toLooseEqual(false);
    survey.ignoreValidation = true;
    expect(survey.validationEnabled, "validationEnabled #2").toLooseEqual(false);
    expect(survey.ignoreValidation, "ignoreValidation #2").toLooseEqual(true);
    survey.validationEnabled = true;
    expect(survey.validationEnabled, "validationEnabled #3").toLooseEqual(true);
    expect(survey.ignoreValidation, "ignoreValidation #3").toLooseEqual(false);
    survey.validationEnabled = false;
    expect(survey.validationEnabled, "validationEnabled #4").toLooseEqual(false);
    expect(survey.ignoreValidation, "ignoreValidation #4").toLooseEqual(true);

    survey.nextPage();
    expect(q1.errors.length, "There is a required error").toLooseEqual(0);
    expect(survey.currentPageNo, "Can move into another page").toLooseEqual(1);
    survey.tryComplete();
    expect(survey.state, "Can complete survey with erros").toLooseEqual("completed");
  });
  test("Show error, but allow to navigate if validationAllowSwitchPages = true and validationAllowComplete=true", () => {
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
    expect(q1.errors.length, "There is an error").toLooseEqual(1);
    survey.nextPage();
    expect(survey.currentPageNo, "Can move into another page").toLooseEqual(1);
    survey.tryComplete();
    expect(survey.state, "Can complete survey with erros").toLooseEqual("completed");
  });
  test("Show error, but allow to navigate if survey.validationAllowSwitchPages = true", () => {
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
    expect(q1.errors.length, "There is an error").toLooseEqual(1);
    survey.nextPage();
    expect(survey.currentPageNo, "Can move into another page").toLooseEqual(1);
    survey.tryComplete();
    expect(survey.currentPageNo, "Move to the first page").toLooseEqual(0);
  });
  test("Check pages state on onValueChanged event", () => {
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
    expect(survey.currentPageNo, "Init current page").toLooseEqual(0);
    survey.onValueChanged.add(() => {
      expect(survey.isLastPage).toBeFalsy();
    });
    expect(survey.isLastPage).toBeTruthy();

    var q1 = survey.getQuestionByName("question1");
    q1.value = "2";
  });
  test("Question is readOnly", () => {
    var survey = twoPageSimplestSurvey();
    var q1 = <Question>(<Question>survey.pages[0].questions[0]);
    expect(q1.isReadOnly, "check1. question is not readonly").toLooseEqual(false);
    q1.readOnly = true;
    expect(q1.isReadOnly, "check2. question is  readonly now").toLooseEqual(true);
    q1.readOnly = false;
    survey.readOnly = true;
    expect(q1.isReadOnly, "check2. question is  readonly because survey in the display mode").toLooseEqual(true);
  });
  test("Do not show required error for readOnly questions", () => {
    var survey = twoPageSimplestSurvey();
    var page = survey.pages[0];
    var q1 = <Question>(<Question>page.questions[0]);
    q1.isRequired = true;
    expect(page.validate(), "There is a required error").toLooseEqual(false);
    q1.readOnly = true;
    expect(page.validate(), "There is no errors, the question is readOnly").toLooseEqual(true);
  });
  test("DO not change errors array on fireCallback = false", () => {
    var survey = twoPageSimplestSurvey();
    var page = survey.pages[0];
    var q1 = <Question>(<Question>page.questions[0]);
    q1.isRequired = true;
    expect(page.validate(false), "There is a required error").toLooseEqual(false);
    expect(q1.errors.length, "The errors array is empty").toLooseEqual(0);
    page.validate(true);
    expect(q1.errors.length, "The errors array is not empty now").toLooseEqual(1);
  });
  test("Do not show required error for value 0 and false, #345", () => {
    var survey = twoPageSimplestSurvey();
    var page = survey.pages[0];
    var q1 = <Question>(<Question>page.questions[0]);
    q1.isRequired = true;
    expect(page.validate(), "There is a required error").toLooseEqual(false);
    survey.setValue("question1", 0);
    expect(q1.value, "question1.value == 0").toLooseEqual(0);
    expect(page.validate(), "There is no errors, the question value is 0").toLooseEqual(true);
    survey.setValue("question1", false);
    expect(q1.value, "question1.value == false").toLooseEqual(false);
    expect(page.validate(), "There is no errors, the question value is false").toLooseEqual(true);
    survey.setValue("question1", null);
    expect(page.validate(), "There is a required error, the question value is null").toLooseEqual(false);
  });
  test("isFirstPage/isLastPage", () => {
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
    expect(survey.currentPageNo, "Init current page").toLooseEqual(0);
    //change currentPageNo
    expect(survey.isFirstPage, "isFirstPage #1").toLooseEqual(true);
    expect(survey.isLastPage, "isLastPage #1").toLooseEqual(false);
    survey.nextPage();
    expect(survey.isFirstPage, "isFirstPage #2").toLooseEqual(false);
    expect(survey.isLastPage, "isLastPage #2").toLooseEqual(true);
    survey.currentPageNo = 0;
    expect(survey.isFirstPage, "isFirstPage #3").toLooseEqual(true);
    expect(survey.isLastPage, "isLastPage #3").toLooseEqual(false);
    const page = new PageModel("newPage");
    page.addNewQuestion("text", "q3");
    survey.pages.unshift(page);
    expect(survey.isFirstPage, "isFirstPage #4").toLooseEqual(false);
    expect(survey.isLastPage, "isLastPage #4").toLooseEqual(false);
    survey.pages.shift();
    expect(survey.pages.length, "We have two pages").toLooseEqual(2);
    expect(survey.isFirstPage, "isFirstPage #5").toLooseEqual(true);
    expect(survey.isLastPage, "isLastPage #5").toLooseEqual(false);
    survey.pages[1].visible = false;
    expect(survey.isFirstPage, "isFirstPage #6").toLooseEqual(true);
    expect(survey.isLastPage, "isLastPage #6").toLooseEqual(true);
  });
  test("isShowNext/Prev/Complete buttons and showPreviewBeforeComplete: true", () => {
    var survey = new SurveyModel({
      showPreviewBeforeComplete: true,
      pages: [
        {
          elements: [{ type: "text", name: "q1" }]
        },
        {
          elements: [{ type: "text", name: "q2" }]
        }
      ]
    });
    expect(survey.currentPageNo, "Init current page").toLooseEqual(0);
    expect(survey.isLastPage, "isLastPage #1").toLooseEqual(false);
    expect(survey.isShowNextButton, "isShowNextButton #1").toLooseEqual(true);
    expect(survey.isCompleteButtonVisible, "isCompleteButtonVisible #1").toLooseEqual(false);
    survey.nextPage();
    expect(survey.isLastPage, "isLastPage #2").toLooseEqual(true);
    expect(survey.isShowNextButton, "isShowNextButton #2").toLooseEqual(false);
    expect(survey.isShowPrevButton, "isShowPrevButton #1").toLooseEqual(true);
    expect(survey.isCompleteButtonVisible, "isCompleteButtonVisible #2").toLooseEqual(false);
    survey.showPreview();
    expect(survey.isShowPrevButton, "isShowPrevButton #2").toLooseEqual(false);
    expect(survey.isShowNextButton, "isShowNextButton #3").toLooseEqual(false);
    expect(survey.isCompleteButtonVisible, "isCompleteButtonVisible #3").toLooseEqual(true);
    survey.readOnly = true;
    expect(survey.isCompleteButtonVisible, "isCompleteButtonVisible, read-only #4").toLooseEqual(false);
    survey.readOnly = false;
    expect(survey.isCompleteButtonVisible, "isCompleteButtonVisible, edit mode #5").toLooseEqual(true);
  });
  test("isShowPrevButton/isCompleteButtonVisible & showPrevButton/showCompleteButton", () => {
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

    expect(survey.currentPageNo, "Init current page").toLooseEqual(0);
    expect(survey.isShowPrevButton, "prev #1").toLooseEqual(false);
    expect(survey.isCompleteButtonVisible, "complete #1").toLooseEqual(false);
    expect(survey.navigationBar.getActionById("sv-nav-prev").isVisible, "sv-nav-prev, #1").toLooseEqual(false);
    expect(survey.navigationBar.getActionById("sv-nav-complete").isVisible, "sv-nav-complete, #1").toLooseEqual(false);

    survey.nextPage();
    expect(survey.currentPageNo, "second page").toLooseEqual(1);
    expect(survey.isShowPrevButton, "prev #2").toLooseEqual(false);
    expect(survey.isCompleteButtonVisible, "complete #2").toLooseEqual(false);
    expect(survey.navigationBar.getActionById("sv-nav-prev").isVisible, "sv-nav-prev, #2").toLooseEqual(false);
    expect(survey.navigationBar.getActionById("sv-nav-complete").isVisible, "sv-nav-complete, #2").toLooseEqual(false);

    survey.showPrevButton = true;
    survey.showCompleteButton = true;
    expect(survey.currentPageNo, "second page, #2").toLooseEqual(1);
    expect(survey.isShowPrevButton, "prev #3").toLooseEqual(true);
    expect(survey.isCompleteButtonVisible, "complete #3").toLooseEqual(true);
    expect(survey.navigationBar.getActionById("sv-nav-prev").isVisible, "sv-nav-prev, #3").toLooseEqual(true);
    expect(survey.navigationBar.getActionById("sv-nav-complete").isVisible, "sv-nav-complete, #3").toLooseEqual(true);
  });
  test("Next, Prev, IsFirst and IsLast Page and progressText", () => {
    surveyLocalization.defaultLocale = "en";
    surveyLocalization.currentLocale = "";
    var survey = new SurveyModel();
    expect(survey.progressText, "there is pages").toLooseEqual("");
    survey.addPage(createPageWithQuestion("Page 1"));
    survey.addPage(createPageWithQuestion("Second page", "q2"));
    survey.addPage(createPageWithQuestion("Third page", "q3"));
    expect(survey.currentPageNo, "Current Page is  First").toLooseEqual(0);
    expect(survey.isFirstPage, "Current Page is  First").toLooseEqual(true);
    expect(survey.isLastPage, "Current Page is  First").toLooseEqual(false);
    expect(survey.progressText, "Current Page is  First").toLooseEqual("Page 1 of 3");
    survey.nextPage();
    expect(survey.currentPageNo, "Current Page is  Second").toLooseEqual(1);
    expect(survey.isFirstPage, "Current Page is  Second").toLooseEqual(false);
    expect(survey.isLastPage, "Current Page is  Second").toLooseEqual(false);
    expect(survey.progressText, "Current Page is  First").toLooseEqual("Page 2 of 3");
    survey.nextPage();
    expect(survey.currentPageNo, "Current Page is  Third").toLooseEqual(2);
    expect(survey.isFirstPage, "Current Page is  Third").toLooseEqual(false);
    expect(survey.isLastPage, "Current Page is  Third").toLooseEqual(true);
    expect(survey.progressText, "Current Page is  First").toLooseEqual("Page 3 of 3");
    survey.prevPage();
    expect(survey.currentPageNo, "Current Page is  Second").toLooseEqual(1);
    expect(survey.isFirstPage, "Current Page is  Second").toLooseEqual(false);
    expect(survey.isLastPage, "Current Page is  Second").toLooseEqual(false);
    expect(survey.progressText, "Current Page is  First").toLooseEqual("Page 2 of 3");
    survey.prevPage();
    expect(survey.currentPageNo, "Current Page is  First").toLooseEqual(0);
    expect(survey.isFirstPage, "Current Page is  First").toLooseEqual(true);
    expect(survey.isLastPage, "Current Page is  First").toLooseEqual(false);
    expect(survey.progressText, "Current Page is  First").toLooseEqual("Page 1 of 3");
    survey.nextPage();
    expect(survey.progressText, "Current Page is Second").toLooseEqual("Page 2 of 3");
    survey.setDesignMode(true);
    survey.nextPage();
    expect(survey.progressText, "Current Page is last").toLooseEqual("Page 3 of 3");

    survey.setDesignMode(false);
    survey.currentPageNo = 0;
    survey.progressBarType = "questions";
    expect(survey.progressText, "Questions progress indicator").toLooseEqual("Answered 0/3 questions");
    survey.getAllQuestions()[0].value = "Answer 1";
    expect(survey.progressText, "Answered 1 question from 3").toLooseEqual("Answered 1/3 questions");
    survey.getAllQuestions()[1].visible = false;
    expect(survey.progressText, "Make one question invisible").toLooseEqual("Answered 1/2 questions");
  });
  test("progressText and onGetProgressText event", () => {
    var survey = new SurveyModel();
    survey.addPage(createPageWithQuestion("Page 1"));
    survey.addPage(createPageWithQuestion("Second page", "q2"));
    survey.addPage(createPageWithQuestion("Third page", "q3"));
    survey.addPage(createPageWithQuestion("Forth page", "q4"));

    var questionCount = -1;
    var answeredQuestionCount = -1;

    survey.onGetProgressText.add((sender: SurveyModel, options: any) => {
      questionCount = options.questionCount;
      answeredQuestionCount = options.answeredQuestionCount;
      options.text =
      "Answered: " +
      (100 * options.answeredQuestionCount) / options.questionCount +
      "%";
    });
    expect(survey.progressText).toLooseEqual("Answered: 0%");
    survey.getAllQuestions()[0].value = "Answer 1";
    expect(survey.progressText).toLooseEqual("Answered: 25%");
    expect(questionCount, "There are 4 questions").toLooseEqual(4);
    expect(answeredQuestionCount, "One question is answered").toLooseEqual(1);
  });
  test("progressText, 'requiredQuestions' type and onGetProgressText event", () => {
    var survey = new SurveyModel();
    survey.addPage(createPageWithQuestion("Page 1", "q1"));
    survey.addPage(createPageWithQuestion("Second page", "q2"));
    survey.addPage(createPageWithQuestion("Third page", "q3"));
    survey.addPage(createPageWithQuestion("Forth page", "q4"));
    survey.getQuestionByName("q1").isRequired = true;
    survey.getQuestionByName("q3").isRequired = true;
    survey.progressBarType = "requiredQuestions";
    expect(survey.progressText).toLooseEqual("Answered 0/2 questions");
    survey.setValue("q1", "1");
    expect(survey.progressText).toLooseEqual("Answered 1/2 questions");
    survey.setValue("q2", "1");
    expect(survey.progressText, "q2 is not required").toLooseEqual("Answered 1/2 questions");
    var questionCount = -1;
    var answeredQuestionCount = -1;
    var requiredQuestionCount = -1;
    var requiredAnsweredQuestionCount = -1;

    survey.onGetProgressText.add((sender: SurveyModel, options: any) => {
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
    expect(survey.progressText).toLooseEqual("Answered: 50%");
  });
  test("onProgressText event and questionOrder in page, Bug#3383", () => {
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
    survey.onGetProgressText.add(() => { var dummy = 1; });
    survey.nextPage();
    expect(oldCurrentPageName, "First nextPage, old").toLooseEqual("page1");
    expect(newCurrentPageName, "First nextPage, new").toLooseEqual("page2");
    survey.nextPage();
    expect(survey.currentPageNo, "We are on the last page").toLooseEqual(2);
    expect(oldCurrentPageName, "Second nextPage, old").toLooseEqual("page2");
    expect(newCurrentPageName, "Second nextPage, new").toLooseEqual("page3");
  });

  test("progressText, 'requiredQuestions' type and design mode", () => {
    var survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.addPage(createPageWithQuestion("Page 1", "q1"));
    survey.addPage(createPageWithQuestion("Second page", "q2"));
    survey.addPage(createPageWithQuestion("Third page", "q3"));
    survey.addPage(createPageWithQuestion("Forth page", "q4"));
    survey.getQuestionByName("q1").isRequired = true;
    survey.getQuestionByName("q3").isRequired = true;

    expect(survey.progressText).toLooseEqual("Page 1 of 4");
    survey.progressBarType = "questions";
    expect(survey.progressText).toLooseEqual("Answered 0/4 questions");
    expect(survey.getProgressTypeComponent(), "questions component").toLooseEqual("sv-progress-questions");
    survey.progressBarType = "requiredQuestions";
    expect(survey.getProgressTypeComponent(), "requiredQuestions component").toLooseEqual("sv-progress-requiredquestions");
    expect(survey.progressText).toLooseEqual("Answered 0/2 questions");
  });
  test("progressText, 'questions' type, invisible cells and data", () => {
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
    expect(survey.progressText, "#1").toLooseEqual("Answered 5/5 questions");
    const matrix = survey.getQuestionByName("matrix");
    const rows = matrix.visibleRows;
    rows[1].getQuestionByName("col2").value = true;
    expect(survey.progressText, "#2").toLooseEqual("Answered 5/6 questions");
    rows[1].getQuestionByName("col3").value = "abc";
    expect(survey.progressText, "#3").toLooseEqual("Answered 6/6 questions");
  });
  test("progressText, 'requiredQuestions' type and required matrix dropdown, bug#5375", () => {
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
    expect(survey.progressText).toLooseEqual("Answered 0/2 questions");
    survey.setValue("q1", "1");
    expect(survey.progressText).toLooseEqual("Answered 1/2 questions");
    const rows = survey.getQuestionByName("q2").visibleRows;
    rows[0].cells[0].question.value = "2";
    expect(survey.progressText).toLooseEqual("Answered 2/2 questions");
  });
  test("survey.progressBarType = 'questions' and non input question, Bug #2108, Bug #2460", () => {
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
    expect(survey.getProgress(), "The progress is 0").toLooseEqual(0);
    expect(survey.progressValue, "The progress is 0, progressValue").toLooseEqual(0);
    expect(survey.progressText, "Questions progress indicator").toLooseEqual("Answered 0/2 questions");
    survey.getQuestionByName("q1").value = "Answer 1";
    expect(survey.getProgress(), "The progress is 50%").toLooseEqual(50);
    expect(survey.progressValue, "The progress is 50%, progressValue").toLooseEqual(50);
    expect(survey.progressText).toLooseEqual("Answered 1/2 questions");
    survey.getQuestionByName("q3").value = "Answer 3";
    expect(survey.getProgress(), "The progress is 100%").toLooseEqual(100);
    expect(survey.progressValue, "The progress is 100%, progressValue").toLooseEqual(100);
    expect(survey.progressText).toLooseEqual("Answered 2/2 questions");
    //Add test cases for Bug#2460
    survey.getQuestionByName("q3").clearValue();
    expect(survey.getProgress(), "The progress is 50% again").toLooseEqual(50);
    expect(survey.progressValue, "The progress is 50% again, progressValue").toLooseEqual(50);
    survey.getQuestionByName("q3").visible = false;
    expect(survey.getProgress(), "The progress is 100%, the second answer is invisible").toLooseEqual(100);
    expect(survey.progressValue, "The progress is 100%, the second answer is invisible, progressValue").toLooseEqual(100);
  });
  test("survey.progressBarType = 'pages', Bug #6563", () => {
    var survey = new SurveyModel({
      progressBarType: "pages",
      pages: [
        { elements: [{ type: "text", name: "q1" }] },
        { elements: [{ type: "text", name: "q2" }] },
        { elements: [{ type: "text", name: "q3" }] },
        { elements: [{ type: "text", name: "q1" }] },
      ]
    });
    expect(survey.getProgress(), "page1 #1").toLooseEqual(0);
    expect(survey.progressValue, "page1 #2").toLooseEqual(0);
    expect(survey.progressText, "page1, #3").toLooseEqual("Page 1 of 4");
    survey.nextPage();
    expect(survey.getProgress(), "page2 #1").toLooseEqual(25);
    expect(survey.progressValue, "page2 #2").toLooseEqual(25);
    expect(survey.progressText, "page2, #3").toLooseEqual("Page 2 of 4");
    survey.nextPage();
    expect(survey.getProgress(), "page3 #1").toLooseEqual(50);
    expect(survey.progressValue, "page3 #2").toLooseEqual(50);
    expect(survey.progressText, "page3, #3").toLooseEqual("Page 3 of 4");
    survey.nextPage();
    expect(survey.getProgress(), "page4 #1").toLooseEqual(75);
    expect(survey.progressValue, "page4 #2").toLooseEqual(75);
    expect(survey.progressText, "page4, #3").toLooseEqual("Page 4 of 4");
  });
  test("survey.progressBarType = 'value', Bug #9532", () => {
    const survey = new SurveyModel({
      progressBarType: "questions",
      elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }],
    });
    let progressValue = 0;
    expect(survey.progressValue, "progressValue #1").toLooseEqual(0);
    survey.onValueChanged.add((sender, options) => {
      progressValue = sender.progressValue;
    });
    survey.getQuestionByName("q1").value = "1";
    expect(progressValue, "progressValue #2").toLooseEqual(50);
    survey.getQuestionByName("q2").value = "2";
    expect(progressValue, "progressValue #3").toLooseEqual(100);
  });
  test("Next, Prev, Next", () => {
    var survey = new SurveyModel();
    survey.addPage(createPageWithQuestion("Page 1"));
    survey.addPage(createPageWithQuestion("Page 2"));
    survey.addPage(createPageWithQuestion("Page 3"));
    expect(survey.currentPageNo, "Initial page is  first").toLooseEqual(0);
    survey.nextPage();
    expect(survey.currentPageNo, "After next the current page is  second").toLooseEqual(1);
    survey.prevPage();
    expect(survey.currentPageNo, "After the prev the current page is again first").toLooseEqual(0);
    survey.nextPage();
    expect(survey.currentPageNo, "After second next the current page is  second").toLooseEqual(1);
  });
  test("Survey state", () => {
    var survey = new SurveyModel();
    expect(survey.state, "There is no a visible page").toLooseEqual("empty");
    survey.addPage(createPageWithQuestion("Page 1"));
    survey.addPage(createPageWithQuestion("Page 2"));
    expect(survey.state, "Survey is in run mode").toLooseEqual("running");
    survey.nextPage();
    expect(survey.state, "Survey is in run mode").toLooseEqual("running");
    survey.tryComplete();
    expect(survey.state, "Survey is completed").toLooseEqual("completed");
  });
  test("Question Creator", () => {
    var inst = QuestionFactory.Instance;
    inst.registerQuestion("question1", (name: string) => {
      return new Question(name);
    });
    inst.registerQuestion("question2", (name: string) => {
      return new Question(name);
    });
    expect(inst.createQuestion("question1", "Q1").name, "Create first type of question").toLooseEqual("Q1");
    expect(inst.createQuestion("question2", "Q2").name, "Create second type of question").toLooseEqual("Q2");
    expect(inst.createQuestion("question3", "Q3"), "Create unexisting type of question").toLooseEqual(null);
  });
  test("Question Creator getAllQuestions", () => {
    var inst = QuestionFactory.Instance;
    inst.registerQuestion("question3", (name: string) => {
      return new Question(name);
    });
    inst.registerQuestion("question4", (name: string) => {
      return new Question(name);
    });
    var names = inst.getAllTypes();
    expect(names.indexOf("question3") > -1, "contains a new type").toBeTruthy();
  });
  test("Add questions to page", () => {
    var page = new PageModel("Page 1");
    page.addNewQuestion("text", "Q1");
    page.addNewQuestion("checkbox", "Q2");
    expect(page.questions.length, "Two questions").toLooseEqual(2);
    expect(page.questions[0].getType(), "Text question").toLooseEqual("text");
    expect(page.questions[1].getType(), "Checkbox question").toLooseEqual("checkbox");
  });
  test("Survey.getQuestionByName", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("Page 1");
    page.addNewQuestion("text", "Q1");
    page.addNewQuestion("checkbox", "Q2");
    page = survey.addNewPage("Page 1");
    page.addNewQuestion("text", "Q3");
    page.addNewQuestion("checkbox", "Q4");

    expect(survey.getQuestionByName("Q2").name, "find question on the first page").toLooseEqual("Q2");
    expect(survey.getQuestionByName("Q3").name, "find question on the second page").toLooseEqual("Q3");
    expect(survey.getQuestionByName("Q0"), "return null").toLooseEqual(null);
  });
  test("Survey.getPanelByName", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("Page1");
    var panel1 = page.addNewPanel("Panel1");
    page.addNewPanel("Panel2");
    panel1.addNewPanel("Panel1_1");
    page = survey.addNewPage("Page2");
    var panel3 = page.addNewPanel("Panel3");
    page.addNewPanel("Panel4");
    panel3.addNewPanel("Panel3_1");

    expect(survey.getPanelByName("Panel2").name, "find panel on the first page").toLooseEqual("Panel2");
    expect(survey.getPanelByName("panel3", true).name, "find question on the second page").toLooseEqual("Panel3");
    expect(survey.getPanelByName("Panel1_1").name, "find child panel on the first page").toLooseEqual("Panel1_1");
    expect(survey.getPanelByName("panel3_1", true).name, "find child question on the second page").toLooseEqual("Panel3_1");
    expect(survey.getPanelByName("NoPanel"), "return null").toLooseEqual(null);
  });
  test("Survey.getPageByQuestion/getPageByElement", () => {
    var survey = new SurveyModel();
    var page1 = survey.addNewPage("page1");
    var page2 = survey.addNewPage("page2");
    page1.addNewQuestion("text", "q1");
    var panel1 = page1.addNewPanel("panel1");
    var q2 = panel1.addNewQuestion("text", "q2");
    var panel2 = panel1.addNewPanel("panel2");
    var q3 = panel1.addNewQuestion("text", "q3");
    var q4 = page2.addNewQuestion("text", "q4");
    expect(survey.getPageByQuestion(q2).name, "q1 - page1").toLooseEqual("page1");
    expect(survey.getPageByQuestion(q3).name, "q3 - page1").toLooseEqual("page1");
    expect(survey.getPageByQuestion(q4).name, "q4 - page2").toLooseEqual("page2");
    expect(survey.getPageByElement(panel1).name, "panel1 - page1").toLooseEqual("page1");
    expect(survey.getPageByElement(panel2).name, "panel2 - page1").toLooseEqual("page1");
  });
  test("Add/remove panel", () => {
    var survey = new SurveyModel();
    var page1 = survey.addNewPage("page1");
    var panel1 = page1.addNewPanel("panel1");
    var q1 = panel1.addNewQuestion("text", "q1");
    var panel2 = panel1.addNewPanel("panel2");
    var q2 = panel2.addNewQuestion("text", "q2");
    expect(page1.elements.length, "There is one element").toLooseEqual(1);
    page1.removeElement(panel1);
    expect(page1.elements.length, "There is no elements").toLooseEqual(0);
  });
  test("Remove element from nested panel, #321", () => {
    var survey = new SurveyModel();
    var page1 = survey.addNewPage("page1");
    var panel1 = page1.addNewPanel("panel1");
    var q1 = panel1.addNewQuestion("text", "q1");
    expect(panel1.elements.length, "There is one question in the panel").toLooseEqual(1);
    page1.removeElement(q1);
    expect(panel1.elements.length, "There no questions in the panel").toLooseEqual(0);
  });
  test("Add panel with questions", () => {
    var survey = new SurveyModel();
    var page1 = survey.addNewPage("page1");
    var panel1 = new PanelModel("panel1");
    var q1 = panel1.addNewQuestion("text", "q1");
    var panel2 = panel1.addNewPanel("panel2");
    var q2 = panel2.addNewQuestion("text", "q2");
    page1.addElement(panel1);
    expect(panel1.data, "The data is set correctly in the root panel").toLooseEqual(survey);
    expect(q2.survey, "The survey is set correctly in the question of the nested root").toLooseEqual(survey);
  });
  test("SurveyData interface implementation", () => {
    var surveyData: ISurveyData;
    surveyData = new SurveyModel();
    expect(surveyData.getValue("test1"), "No data").toLooseEqual(null);
    expect(surveyData.getValue("test2"), "No data").toLooseEqual(null);
    surveyData.setValue("test1", 1, false);
    surveyData.setValue("test2", "1", false);
    expect(surveyData.getValue("test1"), "Has value 1").toLooseEqual(1);
    expect(surveyData.getValue("test2"), "Has value '1'").toLooseEqual("1");
  });
  test("Store question value in the survey", () => {
    var survey = new SurveyModel();
    survey.addPage(new PageModel("Page 1"));
    var question = <Question>survey.pages[0].addNewQuestion("text", "question");
    expect(survey.getValue("question"), "No value").toLooseEqual(null);
    expect(question.value, "No value").toLooseEqual(null);

    question.value = "mytext";
    expect(survey.getValue("question"), "set value from question").toLooseEqual("mytext");
    expect(question.value, "set value from question").toLooseEqual("mytext");

    survey.setValue("question", "myNewtext");
    expect(survey.getValue("question"), "set value from survey").toLooseEqual("myNewtext");
    expect(question.value, "set value from survey").toLooseEqual("myNewtext");
  });
  test("Store comments in the survey", () => {
    var survey = new SurveyModel();
    survey.addPage(new PageModel("Page 1"));
    var question = <Question>survey.pages[0].addNewQuestion("text", "question");
    question.showCommentArea = true;
    expect(survey.getComment("question"), "Comment is empty").toLooseEqual("");
    expect(question.comment, "Comment is empty").toLooseEqual("");

    question.comment = "myComment";
    expect(survey.getComment("question"), "set comment from question").toLooseEqual("myComment");
    expect(question.comment, "set comment from question").toLooseEqual("myComment");

    survey.setComment("question", "myNewComment");
    expect(survey.getComment("question"), "set comment from survey").toLooseEqual("myNewComment");
    expect(question.comment, "set comment from survey").toLooseEqual("myNewComment");
  });
  test("Should set required questions before go on the  next page or finish", () => {
    var survey = twoPageSimplestSurvey();
    expect(survey, "Survey is not  null").not.toLooseEqual(null);
    (<Question>survey.pages[0].questions[0]).isRequired = true;

    expect(survey.nextPage(), "Can not go to the next page").toLooseEqual(false);
    expect(survey.pages[0].questions[0].validate(), "The question is not filled out.").toLooseEqual(false);
    expect(survey.pages[0].validate(), "The page is not filled out.").toLooseEqual(false);
    (<Question>survey.pages[0].questions[0]).value = "Test";

    expect(survey.nextPage(), "Can go to the next page").toLooseEqual(true);
    expect(survey.pages[0].questions[0].validate(), "The question is filled out.").toLooseEqual(true);
    expect(survey.pages[0].validate(), "The page is filled out.").toLooseEqual(true);
  });
  test("survey.checkErrorsMode = 'onValueChanged'", () => {
    var survey = twoPageSimplestSurvey();
    expect(survey, "Survey is not  null").not.toLooseEqual(null);
    var question = <Question>survey.pages[0].questions[0];
    question.validators.push(new EmailValidator());
    survey.checkErrorsMode = "onValueChanged";
    expect(question.errors.length, "there is no errrors yet").toLooseEqual(0);
    survey.setValue(question.name, "it is not e-mail");
    expect(question.errors.length, "The error about invalid e-mail is generated").toLooseEqual(1);
    survey.setValue(question.name, "a@a.co");
    expect(question.errors.length, "The is not errors again").toLooseEqual(0);
  });
  test("survey.checkErrorsMode = 'onValueChanging'", () => {
    var survey = twoPageSimplestSurvey();
    var question = <Question>survey.pages[0].questions[0];
    question.validators.push(new EmailValidator());
    survey.checkErrorsMode = "onValueChanging";
    survey.onValidateQuestion.add(function (sender, options) {
      if (options.name !== "question2") return;
      options.error = options.value.length != 3 ? "Require3Symbols" : null;
    });
    expect(question.errors.length, "there is no errors yet").toLooseEqual(0);
    question.value = "it is not e-mail";
    expect(question.errors.length, "The error about invalid e-mail is generated").toLooseEqual(1);
    expect(question.value, "the value keeps in question").toLooseEqual("it is not e-mail");
    expect(survey.getValue(question.name), "We do not assign it to survey.data").toBeFalsy();
    survey.setValue(question.name, "a@a.co");
    expect(question.errors.length, "The is not errors again").toLooseEqual(0);
    expect(survey.getValue(question.name), "set value to survey.data").toLooseEqual("a@a.co");
    question = survey.getQuestionByName("question2");
    survey.setValue("question2", "val1");
    expect(question.value, "incorrect value set to question").toLooseEqual("val1");
    expect(question.errors.length, "error is generated").toLooseEqual(1);
    expect(survey.getValue("question2"), "survey do not have this value").toBeFalsy();
    survey.setValue("question2", "val");
    expect(question.value, "correct value set to question").toLooseEqual("val");
    expect(question.errors.length, "there is no errors").toLooseEqual(0);
    expect(survey.getValue("question2"), "set correct value into survey").toLooseEqual("val");
  });
  test("survey.checkErrorsMode = 'onValueChanging' and isRequired, Bug#2627", () => {
    var survey = twoPageSimplestSurvey();
    var question = <Question>survey.pages[0].questions[0];
    question.isRequired = true;
    question.value = "val1";
    survey.checkErrorsMode = "onValueChanging";
    expect(question.errors.length, "there is no errors yet").toLooseEqual(0);
    question.value = "";
    expect(question.errors.length, "The error is required").toLooseEqual(1);
    expect(question.value, "the value keeps in question").toLooseEqual("");
    expect(survey.getValue(question.name), "We do not assign it to survey.data").toLooseEqual("val1");
    survey.setValue(question.name, "val2");
    expect(question.errors.length, "The is not errors again").toLooseEqual(0);
    expect(survey.getValue(question.name), "set value to survey.data").toLooseEqual("val2");
    expect(question.value, "set value to survey.data").toLooseEqual("val2");
    question.value = "";
    expect(question.errors.length, "Show error again").toLooseEqual(1);
    expect(survey.getValue(question.name), "keep old value in survey.data").toLooseEqual("val2");
    question.value = "val3";
    expect(question.errors.length, "Error is gone").toLooseEqual(0);
    expect(survey.getValue(question.name), "set new value in survey.data").toLooseEqual("val3");
  });
  test("survey.checkErrorsMode = 'onValueChanged', load from json + defaultValue", () => {
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
    expect(question.errors.length, "The error about invalid e-mail is generated").toLooseEqual(1);
  });
  test("survey.checkErrorsMode = 'onValueChanged' & isRequired: true & changing value to empty, #6692", () => {
    const json = {
      checkErrorsMode: "onValueChanged",
      elements: [{ type: "text", name: "q1", isRequired: true }]
    };
    const survey = new SurveyModel(json);
    const question = <Question>survey.getQuestionByName("q1");
    expect(question.errors.length, "No error initially").toLooseEqual(0);
    question.value = "abc";
    expect(question.errors.length, "No error, it has value").toLooseEqual(0);
    question.value = "";
    expect(question.errors.length, "There is an error").toLooseEqual(1);
  });
  test("survey.checkErrorsMode = 'onValueChanged' & , isRequired: true & do not generate error on setting the value, #6692", () => {
    const json = {
      checkErrorsMode: "onValueChanged",
      elements: [{ type: "text", name: "q1", isRequired: true }, { type: "text", name: "q2" }]
    };
    const survey = new SurveyModel(json);
    const question = <Question>survey.getQuestionByName("q1");
    expect(question.errors.length, "No error initially").toLooseEqual(0);
    survey.data = { q1: "", q2: "abc" };
    expect(question.errors.length, "No error on setting value to data").toLooseEqual(0);
  });
  test("survey.checkErrorsMode = 'onValueChanged', matrix question inside dynamic panel - https://surveyjs.answerdesk.io/ticket/details/T1612", () => {
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

    expect(question.errors.length, "No errors at the start").toLooseEqual(0);

    question.value = { Row1: { Column1: 2 } };
    expect(question.errors.length, "The error about invalid value").toLooseEqual(1);

    question.value = { Row1: { Column1: 30 } };
    expect(question.errors.length, "No errors - chosen right value").toLooseEqual(0);
  });
  test("survey.checkErrorsMode = 'onComplete'", () => {
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
    expect(survey.currentPageNo, "Ignore error on the first page").toLooseEqual(1);
    survey.tryComplete();
    expect(survey.currentPageNo, "Move to first page with the error").toLooseEqual(0);
    survey.afterRenderPage(<HTMLElement>{});

    survey.nextPage();
    expect(survey.currentPageNo, "Ignore error on the first page, #2").toLooseEqual(1);
    survey.tryComplete();
    expect(survey.currentPageNo, "Move to first page with the error, #2").toLooseEqual(0);
    survey.afterRenderPage(<HTMLElement>{});

    survey.setValue("q1", "john.snow@nightwatch.org");
    survey.nextPage();
    survey.tryComplete();
    expect(survey.currentPageNo, "Stay on second page").toLooseEqual(1);
    expect(survey.state, "There is an error on the second page").toLooseEqual("running");
    survey.setValue("q2", "a");
    survey.tryComplete();
    expect(survey.state, "No errors, completed").toLooseEqual("completed");
  });

  test("Should not be errors after prevPage bug#151", () => {
    var survey = new SurveyModel();
    survey.autoAdvanceEnabled = true;
    var page = survey.addNewPage("page1");
    var question = <QuestionDropdownModel>page.addNewQuestion("dropdown", "q1");
    question.choices = [1, 2, 3];
    question.isRequired = true;
    page = survey.addNewPage("page2");
    page.addNewQuestion("text", "q2");

    survey.nextPage();
    expect(question.errors.length, "The question is not filled out.").toLooseEqual(1);
    question.value = 1;
    expect(question.errors.length, "The question has not errors").toLooseEqual(0);
    expect(survey.currentPage.name, "Go to the next page").toLooseEqual(survey.pages[1].name);
    survey.prevPage();
    expect(question.errors.length, "The question has not errors").toLooseEqual(0);
  });
  test("Should not show errors with others bug #2014", () => {
    var survey = new SurveyModel();
    survey.autoAdvanceEnabled = true;
    var page = survey.addNewPage("page1");
    var question = <QuestionDropdownModel>page.addNewQuestion("dropdown", "q1");
    question.choices = [1, 2, 3];
    question.isRequired = true;
    question.showOtherItem = true;
    page = survey.addNewPage("page2");
    page.addNewQuestion("text", "q2");

    expect(survey.currentPageNo, "The first page is shown").toLooseEqual(0);
    question.value = question.otherItem.value;
    expect(survey.currentPageNo, "The page is still first").toLooseEqual(0);
    expect(question.errors.length, "Do not show any error").toLooseEqual(0);
    question.otherValue = "Some text";
    expect(survey.currentPageNo, "The page is still first, #2").toLooseEqual(0);
    question.value = 2;
    expect(survey.currentPageNo, "The second page is shown").toLooseEqual(1);
  });
  test("Show error on question value changed if can't go to the next page", () => {
    var survey = new SurveyModel({
      autoAdvanceEnabled: true,
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
    expect(survey.currentPageNo, "q1 is empty").toLooseEqual(0);
    expect(survey.getQuestionByName("q1").errors.length, "We do not show errors for q1").toLooseEqual(0);
    expect(survey.getQuestionByName("q2").errors.length, "We do not show errors for q2, q1 is empty").toLooseEqual(0);
    survey.setValue("q1", 1);
    expect(survey.currentPageNo, "q2 has error, do not move").toLooseEqual(0);
    expect(survey.getQuestionByName("q1").errors.length, "there is no error").toLooseEqual(0);
    expect(survey.getQuestionByName("q2").errors.length, "There is an error in q2, we can't move further").toLooseEqual(1);
    survey.getQuestionByName("q2").errors.splice(0, 1);
    survey.clear(true, true);
    survey.setValue("q1", 1);
    expect(survey.currentPageNo, "q2 is empty").toLooseEqual(0);
    expect(survey.getQuestionByName("q2").errors.length, "We do not touch q2 yet").toLooseEqual(0);
    survey.setValue("q2", 5);
    expect(survey.currentPageNo, "q2 has error, do not move").toLooseEqual(0);
    expect(survey.getQuestionByName("q2").errors.length, "Show errors q2 is changed.").toLooseEqual(1);
    survey.setValue("q2", 11);
    expect(survey.currentPageNo, "q2 has no errors").toLooseEqual(1);
    var d = new Date();
    d.setDate(d.getDate() - 5);
    survey.setValue("q3", d);
    expect(survey.getQuestionByName("q3").errors.length, "Do not show errors, because input type is date").toLooseEqual(0);
  });

  test("Invisible required questions should not be take into account", () => {
    var survey = twoPageSimplestSurvey();
    expect(survey, "Survey is not  null").not.toLooseEqual(null);
    (<Question>survey.pages[0].questions[0]).isRequired = true;
    expect(survey.nextPage(), "Can not go to the next page").toLooseEqual(false);
    survey.pages[0].questions[0].visible = false;
    expect(survey.nextPage(), "You can go to the next page now.").toLooseEqual(true);
  });
  test("onValueChanged event", () => {
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
    expect(name, "onValueChanged event, property name is correct").toLooseEqual("question1");
    expect(newValue, "onValueChanged event, property newValue is correct").toLooseEqual("value1");
    expect(counter, "onValueChanged event is called one time").toLooseEqual(1);
    (<Question>survey.pages[0].questions[0]).value = "val";
    expect(counter, "onValueChanged event is called one time").toLooseEqual(2);
  });
  test("onValueChanged event - do not call on equal value", () => {
    var survey = new SurveyModel();
    var counter = 0;
    survey.onValueChanged.add(function (sender: SurveyModel, options: any) {
      counter++;
    });
    survey.setValue("name", 1);
    expect(counter, "onValueChanged event is called one time").toLooseEqual(1);
    survey.setValue("name", 1);
    expect(counter, "1 is the same value").toLooseEqual(1);
    survey.setValue("name", { col1: [1, { cel2: "2" }] });
    expect(counter, "onValueChanged event is called two times").toLooseEqual(2);
    survey.setValue("name", { col1: [1, { cel2: "2" }] });
    expect(counter, "2, the value is the same").toLooseEqual(2);
    survey.setValue("name", { col1: [1, { cel2: "2" }, 3] });
    expect(counter, "onValueChanged event is called three times").toLooseEqual(3);
    survey.setValue("name", { col1: [1, { cel2: "2" }, 3] });
    expect(counter, "3, the value is the same").toLooseEqual(3);
    var value = survey.getValue("name");
    value.col1.push(4);
    survey.setValue("name", value);
    expect(counter, "onValueChanged event is called fourth times").toLooseEqual(4);
  });
  test("onValueChanged event is not called on changing matrix value", () => {
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
    expect(counter, "onValueChanged event is called one time").toLooseEqual(1);
    expect(name, "onValueChanged event, property name is correct").toLooseEqual("matrix");
    expect(newValue, "onValueChanged event, property newValue is correct").toEqualValues({ row1: "col2" });
  });
  test("onValueChanged event is not called on changing multi text value", () => {
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
    expect(counter, "onValueChanged event is called one time").toLooseEqual(1);
    expect(name, "onValueChanged event, property name is correct").toLooseEqual("multitext");
    expect(newValue, "onValueChanged event, property newValue is correct").toEqualValues({ item2: "text1" });
  });
  test("onValueChanging event", () => {
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
    expect(name, "onValueChanging event, property name is correct").toLooseEqual("question1");
    expect(questionName, "onValueChanging event, property question is correct").toLooseEqual("question1");
    expect(newValue, "onValueChanging event, property newValue is correct").toLooseEqual("value1");
    expect(counter, "onValueChanging event is called one time").toLooseEqual(1);
    (<Question>survey.pages[0].questions[0]).value = "val";
    expect(counter, "onValueChanging event is called two time").toLooseEqual(2);
    survey.setValue("q1", "val");
    expect(counter, "onValueChanging event is called three time").toLooseEqual(3);
    survey.setValue("q1", "value0");
    expect(survey.getValue("q1"), "onValueChanging event allows to change value").toLooseEqual("value");
  });
  test("onValueChanging event for comment, #8292", () => {
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
    expect(questionName, "question name #1").toLooseEqual("q1");
    expect(q1.comment, "comment value #1").toLooseEqual("abc");
    expect(newComment, "newComment #1").toLooseEqual("abc");
    q1.comment = "abcd";
    expect(q1.comment, "comment value #2").toLooseEqual("abcd");
    expect(newComment, "newComment #2").toLooseEqual("abcd");
    expect(oldComment, "newComment #2").toLooseEqual("abc");
  });

  test("onValueChanging event - do not allow clear value, #8292", () => {
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
    expect(counter, "counter #1").toLooseEqual(1);
    expect(q1.comment, "comment value #1").toLooseEqual("abc");
    q1.comment = "";
    expect(questionName, "question.name #2").toLooseEqual("q1");
    expect(oldComment, "oldComment #2").toLooseEqual("abc");
    expect(newComment, "newComment #2").toLooseEqual("abc");
    expect(counter, "counter #2").toLooseEqual(2);
    expect(q1.comment, "comment value #2").toLooseEqual("abc");
    expect(survey.getComment("q1"), "survey.getComment value #2").toLooseEqual("abc");
    expect(onValueChangedValue, "onValueChanged options.value").toLooseEqual("abc");
  });
  test("onValueChanging event - do not allow clear value in comment, #1542", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("page");
    var q1 = page.addNewQuestion("text", "q1");
    survey.onValueChanging.add(function (sender, options) {
      if (options.name == "q1" && !options.value) {
        options.value = options.oldValue;
      }
    });
    q1.value = 1;
    expect(q1.value, "The value is 1").toLooseEqual(1);
    q1.clearValue();
    expect(q1.value, "The value is still 1, onValueChanging does not allow to change the value").toLooseEqual(1);
  });
  test("adding, inserting Multiple Text Item correctly", () => {
    var survey = twoPageSimplestSurvey();
    var multiTextQuestion = new QuestionMultipleTextModel("multitext");
    survey.pages[0].addQuestion(multiTextQuestion);
    var item1 = new MultipleTextItemModel("item1");
    var item2 = new MultipleTextItemModel("item2");
    multiTextQuestion.items.push(item1);
    multiTextQuestion.items.splice(0, 0, item2);
    item1.value = "1";
    expect(item1.value, "Check1. data was set correctly").toLooseEqual("1");
    item2.value = "2";
    expect(item2.value, "Check2. data was set correctly").toLooseEqual("2");
    multiTextQuestion.items = [];
    item1 = multiTextQuestion.addItem("item1");
    item1.value = "3";
    expect(item1.value, "Check3. data was set correctly").toLooseEqual("3");
    multiTextQuestion.items.splice(0, 0, item2);
    item2.value = "4";
    expect(item2.value, "Check4. data was set correctly").toLooseEqual("4");
  });
  test("Multiple Text required items", () => {
    var survey = twoPageSimplestSurvey();
    var multiTextQuestion = new QuestionMultipleTextModel("multitext");
    survey.pages[0].addQuestion(multiTextQuestion);
    var item1 = multiTextQuestion.addItem("item1");
    var item2 = multiTextQuestion.addItem("item2");
    item1.isRequired = true;
    expect(item1.fullTitle, "Add isRequired Text").toLooseEqual("item1");
    expect(item2.fullTitle, "there is no isRequired Text").toLooseEqual("item2");
    expect(multiTextQuestion.validate(), "item1 is required and it is empty").toLooseEqual(false);
    item1.value = 1;
    expect(multiTextQuestion.validate(), "item1 is required and it has a value").toLooseEqual(true);
  });
  test("onComplete event", () => {
    var survey = twoPageSimplestSurvey();
    var counter = 0;
    survey.onComplete.add(function () {
      counter++;
    });
    survey.nextPage();
    survey.nextPage();
    survey.tryComplete();
    expect(survey.state, "The survey is completed").toLooseEqual("completed");
    expect(counter, "onComplete calls one time").toLooseEqual(1);
  });
  test("onVisibleChanged event", () => {
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

    expect(name, "onVisibleChanged event, property name is correct").toLooseEqual("question1");
    expect(visibility, "onVisibleChanged event, property visibility is correct").toLooseEqual(false);
    expect(counter, "onVisibleChanged event is called one time").toLooseEqual(1);

    survey.getQuestionByName("question1").visible = true;
    expect(name, "onVisibleChanged event, property name is correct").toLooseEqual("question1");
    expect(visibility, "onVisibleChanged event, property visibility is correct").toLooseEqual(true);
    expect(counter, "onVisibleChanged event is called two time").toLooseEqual(2);

    survey.getQuestionByName("question1").visible = true;
    expect(counter, "onVisibleChanged event is called two time").toLooseEqual(2);
  });
  test("Question visibleIndex", () => {
    var survey = twoPageSimplestSurvey();
    survey.showQuestionNumbers = "on";
    expect((<Question>survey.getQuestionByName("question1")).visibleIndex, "the first question").toLooseEqual(0);
    expect((<Question>survey.getQuestionByName("question3")).visibleIndex, "the third question").toLooseEqual(2);
    survey.getQuestionByName("question1").visible = false;
    expect((<Question>survey.getQuestionByName("question3")).visibleIndex, "the third question is now visible as second").toLooseEqual(1);
    survey.getQuestionByName("question1").visible = true;
    expect((<Question>survey.getQuestionByName("question3")).visibleIndex, "the third question is third again").toLooseEqual(2);
    survey.getQuestionByName("question1").showNumber = false;
    expect((<Question>survey.getQuestionByName("question1")).visibleIndex, "Hide the number").toLooseEqual(-1);
    expect((<Question>survey.getQuestionByName("question3")).visibleIndex, "the first question number is hidden").toLooseEqual(1);
    survey.getQuestionByName("question1").showNumber = true;
    survey.getQuestionByName("question1").visible = false;
    survey.showQuestionNumbers = "off";
    expect((<Question>survey.getQuestionByName("question1")).visibleIndex, "off:the first question").toLooseEqual(-1);
    expect((<Question>survey.getQuestionByName("question2")).visibleIndex, "off:the second question").toLooseEqual(-1);
    expect((<Question>survey.getQuestionByName("question3")).visibleIndex, "off:the third question").toLooseEqual(-1);
    survey.showQuestionNumbers = "onPage";
    expect((<Question>survey.getQuestionByName("question1")).visibleIndex, "onPage:the first question").toLooseEqual(-1);
    expect((<Question>survey.getQuestionByName("question2")).visibleIndex, "onPage:the second question").toLooseEqual(0);
    expect((<Question>survey.getQuestionByName("question3")).visibleIndex, "onPage:the third question").toLooseEqual(0);
  });
  test("Question visibleIndex, add-remove questions", () => {
    var survey = new SurveyModel();
    survey.showQuestionNumbers = "on";
    var page = survey.addNewPage("p1");
    var q1 = new QuestionTextModel("q1");
    page.elements.push(q1);
    page.elements.push(new QuestionTextModel("q2"));
    expect((<Question>survey.getQuestionByName("q1")).visibleIndex, "the first question").toLooseEqual(0);
    expect((<Question>survey.getQuestionByName("q2")).visibleIndex, "the second question").toLooseEqual(1);
    var q3 = new QuestionTextModel("q3");
    page.elements.splice(0, 1, q3);
    expect((<Question>survey.getQuestionByName("q3")).visibleIndex, "the first question").toLooseEqual(0);
    expect((<Question>survey.getQuestionByName("q2")).visibleIndex, "the second question").toLooseEqual(1);
  });
  test("Question visibleIndex in onVisibleChanged event, containers", () => {
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
    expect(visibleIndex, "visible index should be 0").toLooseEqual(0);
  });

  test("Question/Panel visibleIndex", () => {
    var survey = new SurveyModel();
    survey.showQuestionNumbers = "on";
    var page = survey.addNewPage("page1");
    var q1 = page.addNewQuestion("text", "q1");
    var panel = page.addNewPanel("panel1");
    var q2 = panel.addNewQuestion("text", "q2");
    var q3 = panel.addNewQuestion("text", "q3");
    var q4 = page.addNewQuestion("text", "q4");
    expect(q2.visibleIndex, "second quesiton").toLooseEqual(1);
    expect(q4.visibleIndex, "fourth quesiton").toLooseEqual(3);
    panel.title = "Some text";
    expect(panel.visibleIndex, "Panel title is empty").toLooseEqual(-1);
    expect(panel.no, "Panel no property,  title is empty").toLooseEqual("");
    panel.showNumber = true;
    expect(panel.visibleIndex, "Panel has visibleIndex").toLooseEqual(1);
    expect(panel.no, "Panel no property").toLooseEqual("2.");
    expect(q2.visibleIndex, "second quesiton + panel has index").toLooseEqual(2);
    expect(q4.visibleIndex, "fourth quesiton + panel has index").toLooseEqual(4);
    panel.showQuestionNumbers = "off";
    expect(q2.visibleIndex, "second quesiton + panel has index, questions inside panel have not numbering").toLooseEqual(-1);
    expect(q3.visibleIndex, "third quesiton + panel has index, questions inside panel have not numbering").toLooseEqual(-1);
    expect(q4.visibleIndex, "fourth quesiton + panel has index, questions inside panel have not numbering").toLooseEqual(2);
    panel.showQuestionNumbers = "onpanel";
    expect(q2.visibleIndex, "second quesiton + panel has index, questions inside panel have its own numbering").toLooseEqual(0);
    expect(q3.visibleIndex, "third quesiton + panel has index, questions  inside panel have its own numbering").toLooseEqual(1);
    expect(q4.visibleIndex, "fourth quesiton + panel has index, questions  inside panel have its own numbering").toLooseEqual(2);
    panel.showNumber = false;
    expect(panel.visibleIndex, "Panel showNumber is false").toLooseEqual(-1);
    expect(panel.no, "Panel no property,  showNumber is false").toLooseEqual("");
  });

  test("Question/Panel visibleIndex, the panel is first with showNumber false and showQuestionNumbering onpanel", () => {
    var survey = new SurveyModel();
    survey.showQuestionNumbers = "on";
    var page = survey.addNewPage("page1");
    var panel = page.addNewPanel("panel1");
    var q2 = panel.addNewQuestion("text", "q2");
    var q3 = panel.addNewQuestion("text", "q3");
    var q4 = page.addNewQuestion("text", "q4");
    panel.showQuestionNumbers = "onpanel";
    expect(q2.visibleIndex, "second quesiton + panel has index, questions inside panel have its own numbering").toLooseEqual(0);
    expect(q3.visibleIndex, "third quesiton + panel has index, questions  inside panel have its own numbering").toLooseEqual(1);
    expect(q4.visibleIndex, "fourth quesiton + panel has index, questions  inside panel have its own numbering").toLooseEqual(0);
  });
  test("Panel.questionStartIndex", () => {
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
    expect(q1.no, "the first question").toLooseEqual("1)");
    expect(q2.no, "second quesiton").toLooseEqual("B.");
    expect(q3.no, "the thrid question").toLooseEqual("C.");
    expect(q4.no, "the fourth question").toLooseEqual("4)");
    panel.showQuestionNumbers = "onpanel";
    expect(q2.no, "second quesiton, onpanel").toLooseEqual("A.");
    expect(q3.no, "the thrid question, onpanel").toLooseEqual("B.");
    expect(q4.no, "the fourth question, onpanel").toLooseEqual("2)");
  });

  test("Panel.questionStartIndex, nested Panel", () => {
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
    expect(nestedPanel.no, "use panel questionStartIndex").toLooseEqual("A.");
  });
  test("showQuestionNumbers - accept bool values", () => {
    var survey = twoPageSimplestSurvey();
    survey.showQuestionNumbers = "on";
    expect(survey.showQuestionNumbers).toLooseEqual("on");
    survey.showQuestionNumbers = false as any;
    expect(survey.showQuestionNumbers).toLooseEqual("off");
    survey.showQuestionNumbers = true as any;
    expect(survey.showQuestionNumbers).toLooseEqual("on");
  });
  test("showQuestionNumbers - question fullTitle", () => {
    var survey = twoPageSimplestSurvey();
    survey.showQuestionNumbers = "on";
    expect((<Question>survey.getQuestionByName("question1"))["no"]).toLooseEqual(1);
    expect((<Question>survey.getQuestionByName("question1")).fullTitle, "the first question showQuestionNumbers=on").toLooseEqual("question1");
    expect((<Question>survey.getQuestionByName("question3"))["no"]).toLooseEqual(3);
    expect((<Question>survey.getQuestionByName("question3")).fullTitle, "the thrid question showQuestionNumbers=on").toLooseEqual("question3");
    survey.showQuestionNumbers = "onPage";
    expect((<Question>survey.getQuestionByName("question1"))["no"]).toLooseEqual(1);
    expect((<Question>survey.getQuestionByName("question1")).fullTitle, "the first question showQuestionNumbers=onPage").toLooseEqual("question1");
    expect((<Question>survey.getQuestionByName("question3"))["no"]).toLooseEqual(1);
    expect((<Question>survey.getQuestionByName("question3")).fullTitle, "the thrid question showQuestionNumbers=onPage").toLooseEqual("question3");
    survey.showQuestionNumbers = "off";
    expect((<Question>survey.getQuestionByName("question1"))["no"]).toLooseEqual("");
    expect((<Question>survey.getQuestionByName("question1")).fullTitle, "the first question showQuestionNumbers=onPage").toLooseEqual("question1");
    expect((<Question>survey.getQuestionByName("question3"))["no"]).toLooseEqual("");
    expect((<Question>survey.getQuestionByName("question3")).fullTitle, "the thrid question showQuestionNumbers=onPage").toLooseEqual("question3");
  });
  test("Question visibleIndex and no title question", () => {
    var survey = twoPageSimplestSurvey();
    survey.showQuestionNumbers = "on";
    expect((<Question>survey.getQuestionByName("question1")).visibleIndex, "the first question").toLooseEqual(0);
    expect((<Question>survey.getQuestionByName("question3")).visibleIndex, "the third question").toLooseEqual(2);
    var question = new QuestionHtmlModel("html1");
    survey.pages[0].addQuestion(question, 0);
    expect((<Question>survey.getQuestionByName("html1")).visibleIndex, "html question").toLooseEqual(-1);
    expect((<Question>survey.getQuestionByName("question1")).visibleIndex, "the first question + html question").toLooseEqual(0);
    expect((<Question>survey.getQuestionByName("question3")).visibleIndex, "the third question + html question").toLooseEqual(2);
  });
  test("Pages visibleIndex and num", () => {
    var survey = twoPageSimplestSurvey();
    survey.addNewPage("page 3").addNewQuestion("text", "q4");
    expect(survey.pages[0].visibleIndex, "start:page 1").toLooseEqual(0);
    expect(survey.pages[1].visibleIndex, "start:page 2").toLooseEqual(1);
    expect(survey.pages[2].visibleIndex, "start:page 3").toLooseEqual(2);
    expect(survey.pages[0].num, "start:page 1, num").toLooseEqual(1);
    expect(survey.pages[1].num, "start:page 2, num").toLooseEqual(2);
    expect(survey.pages[2].num, "start:page 3, num").toLooseEqual(3);

    survey.pages[0].visible = false;
    expect(survey.pages[0].visibleIndex, "page[0].visible=false:page 1").toLooseEqual(-1);
    expect(survey.pages[1].visibleIndex, "page[0].visible=false:page 2").toLooseEqual(0);
    expect(survey.pages[2].visibleIndex, "page[0].visible=false:page 3").toLooseEqual(1);
    expect(survey.pages[0].num, "page[0].visible=false:page 1, num").toLooseEqual(-1);
    expect(survey.pages[1].num, "page[0].visible=false:page 2, num").toLooseEqual(1);
    expect(survey.pages[2].num, "page[0].visible=false:page 3, num").toLooseEqual(2);
  });
  test("Pages num", () => {
    var survey = twoPageSimplestSurvey();
    expect(survey.pages[0]["canShowPageNumber"](), "false:the first page: can't show page number").toLooseEqual(false);
    expect(survey.pages[0].num, "the first page").toLooseEqual(1);
    expect(survey.pages[1]["canShowPageNumber"](), "false:the first page: can't show page number").toLooseEqual(false);
    expect(survey.pages[1].num, "the second page").toLooseEqual(2);

    survey.showPageNumbers = true;
    expect(survey.pages[0]["canShowPageNumber"](), "true:the first page: can show page number").toLooseEqual(true);
    expect(survey.pages[0].num, "the first page").toLooseEqual(1);
    expect(survey.pages[1]["canShowPageNumber"](), "true:the first page: can show page number").toLooseEqual(true);
    expect(survey.pages[1].num, "the second page").toLooseEqual(2);
  });
  test("Server validation", () => {
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
    expect(survey.currentPage.visibleIndex, "Get server error").toLooseEqual(0);
    survey.setValue("question1", 10);
    survey.nextPage();
    expect(survey.currentPage.visibleIndex, "No errors server error").toLooseEqual(1);
  });
  test("Server validation (old api version)", () => {
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
    expect(survey.currentPage.visibleIndex, "Get server error").toLooseEqual(0);
    survey.setValue("question1", 10);
    survey.nextPage();
    expect(survey.currentPage.visibleIndex, "No errors server error").toLooseEqual(1);
  });

  test("Server validation - do not allow to validate multiple times, Bug#2497", () => {
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
    expect(survey.currentPage.visibleIndex, "The validation is not finished yet").toLooseEqual(0);
    opt.complete();
    expect(counter, "server validation should be called one time").toLooseEqual(1);
    expect(survey.currentPage.visibleIndex, "Validation on next page is completed").toLooseEqual(1);
    survey.tryComplete();
    survey.tryComplete();
    expect(survey.currentPage.visibleIndex, "The validation on complete is not finished yet").toLooseEqual(1);
    opt.complete();
    expect(counter, "server validation should be called two times").toLooseEqual(2);
    expect(survey.state, "Validation is completed").toLooseEqual("completed");
  });

  test("Server validation - fire onValidatePage  event, Bug#2566", () => {
    var survey = twoPageSimplestSurvey();
    var opt = null;
    survey.onServerValidateQuestions.add(function (sender, options) {
      opt = options;
    });
    var errorCount = 0;
    survey.onValidatePage.add(function (sender, options) {
      errorCount = options.errors.length;
    });
    survey.setValue("question1", 101);
    survey.nextPage();
    expect(errorCount, "There is no errors yet").toLooseEqual(0);
    opt.errors["question1"] = "Server error";
    opt.complete();
    expect(errorCount, "There is one error").toLooseEqual(1);
  });

  test("onVisibleChanged call validation", () => {
    var survey = twoPageSimplestSurvey();
    survey.onValidateQuestion.add(function (sender, options) {
      if (options.name == "question1" && options.value > 100) {
        options.error = "Question 1 should be higher than 100";
      }
    });

    expect(survey.isCurrentPageHasErrors, "There is no error if the value is empty").toLooseEqual(false);
    survey.setValue("question1", 1);
    expect(survey.isCurrentPageHasErrors, "the value is less than 100").toLooseEqual(false);
    survey.setValue("question1", 101);
    expect(survey.isCurrentPageHasErrors, "the value is more than 100, has errors").toLooseEqual(true);
  });
  test("onValidatePanel test", () => {
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

    expect(survey.isCurrentPageHasErrors, "failed, values are undefined : 10 < q1.value + q2.value < 100").toLooseEqual(true);
    expect(counter, "onValidatePanel calls one time").toLooseEqual(1);
    q1.value = 5;
    q2.value = 50;
    expect(survey.isCurrentPageHasErrors, "passed: 5 + 50, 10 < q1.value + q2.value < 100").toLooseEqual(false);
    expect(counter, "onValidatePanel calls two time").toLooseEqual(2);
    q1.value = 55;

    expect(survey.isCurrentPageHasErrors, "failed: 55 + 50, 10 < q1.value + q2.value < 100").toLooseEqual(true);
    expect(counter, "onValidatePanel calls three time").toLooseEqual(3);
  });
  test("survey.onValidatePanel & options.errors", () => {
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

    expect(survey.isCurrentPageHasErrors, "failed, values are undefined : 10 < q1.value + q2.value < 100").toLooseEqual(true);
    expect(panel.errors.length, "panel.errors, #1").toLooseEqual(1);
    q1.value = 5;
    q2.value = 50;
    expect(survey.isCurrentPageHasErrors, "passed: 5 + 50, 10 < q1.value + q2.value < 100").toLooseEqual(false);
    expect(panel.errors.length, "panel.errors, #2").toLooseEqual(0);
    q1.value = 55;
    expect(survey.isCurrentPageHasErrors, "failed: 55 + 50, 10 < q1.value + q2.value < 100").toLooseEqual(true);
    expect(panel.errors.length, "panel.errors, #3").toLooseEqual(1);
  });
  test("isCurrentPageHasErrors, required question in the invisible panel, #325", () => {
    var survey = twoPageSimplestSurvey();
    var panel = survey.pages[0].addNewPanel("panel");
    var requiredQuestion = <QuestionTextModel>(
      panel.addNewQuestion("text", "requriedQuestion")
    );
    requiredQuestion.isRequired = true;

    expect(survey.isCurrentPageHasErrors, "requiredQuestion value is empty").toLooseEqual(true);
    panel.visible = false;
    expect(survey.isCurrentPageHasErrors, "requiredQuestion value is empty, but the parent panel is invisible").toLooseEqual(false);
  });

  test("Page visibility", () => {
    var page = new PageModel("page");
    expect(page.isVisible, "page is invisible if there is no questions in it").toLooseEqual(false);
    page.addNewQuestion("text", "q1");
    expect(page.isVisible, "there is one question").toLooseEqual(true);
    page.visible = false;
    expect(page.isVisible, "we made the page invisible").toLooseEqual(false);
    page.visible = true;
    expect(page.isVisible, "we made the page visible").toLooseEqual(true);
    page.questions[0].visible = false;
    expect(page.isVisible, "there is no visible questions on the page").toLooseEqual(false);
    page.questions[0].visible = true;
    expect(page.isVisible, "we have made the question visible again").toLooseEqual(true);
  });
  test("Survey visiblePages and start using them", () => {
    var survey = twoPageSimplestSurvey();
    expect(survey.visiblePages.length, "All pages are visible").toLooseEqual(2);
    expect(survey.currentPage.name, "the first page is current").toLooseEqual("Page 1");
    survey.pages[0].visible = false;
    expect(survey.visiblePages.length, "The first page becomes invisible").toLooseEqual(1);
    expect(survey.currentPage.name, "the second page is current, because the first is invisible").toLooseEqual("Page 2");
  });
  test("Survey visiblePages, make second and third invisbile and go the last page on next", () => {
    var survey = twoPageSimplestSurvey();
    survey.currentPage = survey.pages[0];
    survey.addNewPage("Page 3").addNewQuestion("text", "p3q1");
    survey.addNewPage("Page 4").addNewQuestion("text", "p4q1");
    survey.pages[1].visible = false;
    survey.pages[2].questions[0].visible = false;
    survey.nextPage();
    expect(survey.currentPage.name, "Bypass two invisible pages").toLooseEqual("Page 4");
  });
  test("Visible trigger test", () => {
    var survey = twoPageSimplestSurvey();
    var trigger = new SurveyTriggerVisible();
    survey.triggers.push(trigger);
    trigger.name = "question1";
    trigger.value = "Hello";
    trigger.pages = ["Page 2"];
    trigger.questions = ["question2"];

    survey.setValue("question1", "H");
    expect(survey.getQuestionByName("question2").visible, "It is invisible now").toLooseEqual(false);
    expect(survey.pages[1].visible, "It is invisible now").toLooseEqual(false);

    survey.setValue("question1", "Hello");
    expect(survey.getQuestionByName("question2").visible, "trigger makes it visible").toLooseEqual(true);
    expect(survey.pages[1].visible, "trigger makes it visible").toLooseEqual(true);

    survey.setValue("question2", "He");
    expect(survey.getQuestionByName("question2").visible, "trigger should not be called").toLooseEqual(true);
    expect(survey.pages[1].visible, "trigger should not be called").toLooseEqual(true);
  });
  test("Complete trigger test", () => {
    var survey = twoPageSimplestSurvey();
    var trigger = new SurveyTriggerComplete();
    survey.triggers.push(trigger);
    trigger.name = "question1";
    trigger.value = "Hello";

    survey.setValue("question1", "H");
    expect(survey.state).toLooseEqual("running");

    survey.setValue("question1", "Hello");
    expect(survey.state).toLooseEqual("running");
    survey.nextPage();
    expect(survey.state).toLooseEqual("completed");
  });
  test("Complete trigger test, check isCompleteOnTrigger property", () => {
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
    expect(survey.state).toLooseEqual("running");
    expect(survey.isCompleteButtonVisible, "complete button is visible").toLooseEqual(true);
    expect(survey.isShowNextButton, "next button is invisible").toLooseEqual(false);
    survey.tryComplete();
    expect(survey.state).toLooseEqual("completed");
    expect(isCompleteOnTrigger_Completing, "isCompleteOnTrigger property works for onCompleting event").toLooseEqual(true);
    expect(isCompleteOnTrigger_Complete, "isCompleteOnTrigger property works for onCompleted event").toLooseEqual(true);
    survey.clear();
    survey.nextPage();
    survey.tryComplete();
    expect(isCompleteOnTrigger_Completing, "isCompleteOnTrigger property works for onCompleting event, #2").toLooseEqual(false);
    expect(isCompleteOnTrigger_Complete, "isCompleteOnTrigger property works for onCompleted event, #2").toLooseEqual(false);
  });
  test("Complete trigger test, settings.executeCompleteTriggerOnValueChanged", () => {
    settings.executeCompleteTriggerOnValueChanged = true;
    var survey = twoPageSimplestSurvey();
    var trigger = new SurveyTriggerComplete();
    survey.triggers.push(trigger);
    trigger.name = "question1";
    trigger.value = "Hello";

    survey.setValue("question1", "H");
    expect(survey.state).toLooseEqual("running");

    survey.setValue("question1", "Hello");
    expect(survey.state).toLooseEqual("completed");
    settings.executeCompleteTriggerOnValueChanged = false;
  });
  test("CompleteTrigger.toString()", () => {
    var trigger = new SurveyTriggerComplete();
    trigger.name = "question1";
    trigger.value = "Hello";
    expect(trigger.toString(), "toString function returns correct value").toLooseEqual("complete, {question1} equal 'Hello'");
  });
  test("Complete trigger + matrix test", () => {
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
    expect(survey.state).toLooseEqual("running");

    survey.setValue("matrix", { "row 1": "column 2" });
    expect(survey.state).toLooseEqual("running");
    survey.nextPage();
    expect(survey.state).toLooseEqual("completed");
  });
  test("survey.onCurrentPageChanging + isNextPage/isPrevPage", () => {
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
    expect(changingOldPage.name, "first nextPage: oldCurrentPage").toLooseEqual("Page 1");
    expect(changingNewPage.name, "first nextPage: newCurrentPage").toLooseEqual("Page 2");
    expect(changingCounter, "first nextPage: called one time").toLooseEqual(1);
    expect(changingBeforeChanged, "first nextPage: called before changed").toLooseEqual(2);
    survey.prevPage();
    expect(changingOldPage.name, "first prevPage: oldCurrentPage").toLooseEqual("Page 2");
    expect(changingNewPage.name, "first prevPage: newCurrentPage").toLooseEqual("Page 1");
    expect(changingCounter, "first prevPage: called two time").toLooseEqual(2);
    expect(changingBeforeChanged, "first prevPage: called before changed").toLooseEqual(2);
  });

  test("survey.onCurrentPageChanging/Changed + isNextPage/isPrevPage/isGoingForward/isGoingBackward", () => {
    const survey = twoPageSimplestSurvey();
    survey.addNewPage("page3");
    survey.pages[2].addNewQuestion("text", "q5");
    survey.addNewPage("page4");
    survey.pages[3].addNewQuestion("text", "q6");
    expect(survey.visiblePageCount, "There are 4 pages").toLooseEqual(4);
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
    expect(isNextPageChangedCounter, "isNextPageChangedCounter, nextPage").toLooseEqual(1);
    expect(isPrevPageChangedCounter, "isPrevPageChangedCounter, nextPage").toLooseEqual(0);
    expect(isNextPageChangingCounter, "isNextPageChangingCounter, nextPage").toLooseEqual(1);
    expect(isPrevPageChangingCounter, "isPrevPageChangingCounter, nextPage").toLooseEqual(0);
    expect(isGoingForwardPageChangingCounter, "isGoingForwardPageChangingCounter, nextPage").toLooseEqual(1);
    expect(isGoingBackwardPageChangingCounter, "isGoingBackwardPageChangingCounter, nextPage").toLooseEqual(0);
    expect(isGoingForwardPageChangedCounter, "isGoingForwardPageChangedCounter, nextPage").toLooseEqual(1);
    expect(isGoingBackwardPageChangedCounter, "isGoingBackwardPageChangedCounter, nextPage").toLooseEqual(0);
    survey.prevPage();
    expect(isNextPageChangedCounter, "isNextPageChangedCounter, nextPage/prevPage").toLooseEqual(1);
    expect(isPrevPageChangedCounter, "isPrevPageChangedCounter, nextPage/prevPage").toLooseEqual(1);
    expect(isNextPageChangingCounter, "isNextPageChangingCounter, nextPage/prevPage").toLooseEqual(1);
    expect(isPrevPageChangingCounter, "isPrevPageChangingCounter, nextPage/prevPage").toLooseEqual(1);
    expect(isGoingForwardPageChangingCounter, "isGoingForwardPageChangingCounter, nextPage/prevPage").toLooseEqual(1);
    expect(isGoingBackwardPageChangingCounter, "isGoingBackwardPageChangingCounter, nextPage/prevPage").toLooseEqual(1);
    expect(isGoingForwardPageChangedCounter, "isGoingForwardPageChangedCounter, nextPage/prevPage").toLooseEqual(1);
    expect(isGoingBackwardPageChangedCounter, "isGoingBackwardPageChangedCounter, nextPage/prevPage").toLooseEqual(1);
    survey.currentPageNo = 3;
    expect(survey.currentPage.name, "goes to have 3").toLooseEqual("page4");
    expect(isNextPageChangedCounter, "isNextPageChangedCounter, nextPage/prevPage/currentPageNo=3").toLooseEqual(1);
    expect(isPrevPageChangedCounter, "isPrevPageChangedCounter, nextPage/prevPage/currentPageNo=3").toLooseEqual(1);
    expect(isNextPageChangingCounter, "isNextPageChangingCounter, nextPage/prevPage/currentPageNo=3").toLooseEqual(1);
    expect(isPrevPageChangingCounter, "isPrevPageChangingCounter, nextPage/prevPage/currentPageNo=3").toLooseEqual(1);
    expect(isGoingForwardPageChangingCounter, "isGoingForwardPageChangingCounter, nextPage/prevPage/currentPageNo=3").toLooseEqual(2);
    expect(isGoingBackwardPageChangingCounter, "isGoingBackwardPageChangingCounter, nextPage/prevPage/currentPageNo=3").toLooseEqual(1);
    expect(isGoingForwardPageChangedCounter, "isGoingForwardPageChangedCounter, nextPage/prevPage/currentPageNo=3").toLooseEqual(2);
    expect(isGoingBackwardPageChangedCounter, "isGoingBackwardPageChangedCounter, nextPage/prevPage/currentPageNo=3").toLooseEqual(1);
    survey.currentPageNo = 1;
    expect(isNextPageChangedCounter, "isNextPageChangedCounter, nextPage/prevPage/currentPageNo=3/currentPageNo=1").toLooseEqual(1);
    expect(isPrevPageChangedCounter, "isPrevPageChangedCounter, nextPage/prevPage/currentPageNo=3/currentPageNo=1").toLooseEqual(1);
    expect(isNextPageChangingCounter, "isNextPageChangingCounter, nextPage/prevPage/currentPageNo=3/currentPageNo=1").toLooseEqual(1);
    expect(isPrevPageChangingCounter, "isPrevPageChangingCounter, nextPage/prevPage/currentPageNo=3/currentPageNo=1").toLooseEqual(1);
    expect(isGoingForwardPageChangingCounter, "isGoingForwardPageChangingCounter, nextPage/prevPage/currentPageNo=3/currentPageNo=1").toLooseEqual(2);
    expect(isGoingBackwardPageChangingCounter, "isGoingBackwardPageChangingCounter, nextPage/prevPage/currentPageNo=3/currentPageNo=1").toLooseEqual(2);
    expect(isGoingForwardPageChangedCounter, "isGoingForwardPageChangedCounter, nextPage/prevPage/currentPageNo=3/currentPageNo=1").toLooseEqual(2);
    expect(isGoingBackwardPageChangedCounter, "isGoingBackwardPageChangedCounter, nextPage/prevPage/currentPageNo=3/currentPageNo=1").toLooseEqual(2);
    survey.currentPageNo = 0;
    expect(isNextPageChangedCounter, "isNextPageChangedCounter, nextPage/prevPage/currentPageNo=3/currentPageNo=1/currentPageNo=0").toLooseEqual(1);
    expect(isPrevPageChangedCounter, "isPrevPageChangedCounter, nextPage/prevPage/currentPageNo=3/currentPageNo=1/currentPageNo=0").toLooseEqual(2);
    expect(isNextPageChangingCounter, "isNextPageChangingCounter, nextPage/prevPage/currentPageNo=3/currentPageNo=1/currentPageNo=0").toLooseEqual(1);
    expect(isPrevPageChangingCounter, "isPrevPageChangingCounter, nextPage/prevPage/currentPageNo=3/currentPageNo=1/currentPageNo=0").toLooseEqual(2);
    expect(isGoingForwardPageChangingCounter, "isGoingForwardPageChangingCounter, nextPage/prevPage/currentPageNo=3/currentPageNo=1/currentPageNo=0").toLooseEqual(2);
    expect(isGoingBackwardPageChangingCounter, "isGoingBackwardPageChangingCounter, nextPage/prevPage/currentPageNo=3/currentPageNo=1/currentPageNo=0").toLooseEqual(3);
    expect(isGoingForwardPageChangedCounter, "isGoingForwardPageChangedCounter, nextPage/prevPage/currentPageNo=3/currentPageNo=1/currentPageNo=0").toLooseEqual(2);
    expect(isGoingBackwardPageChangedCounter, "isGoingBackwardPageChangedCounter, nextPage/prevPage/currentPageNo=3/currentPageNo=1/currentPageNo=0").toLooseEqual(3);
  });

  test("survey.onCurrentPageChanging, allowChanging option", () => {
    var survey = twoPageSimplestSurvey();
    //get current Page
    survey.currentPage;
    var allowChanging = false;
    survey.onCurrentPageChanging.add(function (survey, options) {
      options.allowChanging = allowChanging;
    });
    expect(survey.currentPageNo, "The first page").toLooseEqual(0);
    survey.nextPage();
    expect(survey.currentPageNo, "Still the first page").toLooseEqual(0);
    allowChanging = true;
    survey.nextPage();
    expect(survey.currentPageNo, "The second page").toLooseEqual(1);
    allowChanging = false;
    survey.prevPage();
    expect(survey.currentPageNo, "Still the second page").toLooseEqual(1);
    allowChanging = true;
    survey.prevPage();
    expect(survey.currentPageNo, "The second page again").toLooseEqual(0);
  });
  test("survey.onCurrentPageChanging async calls, Issue#10645", async () => {
    vi.useFakeTimers();
    try {
      const survey = new SurveyModel({
        pages: [
          { name: "page1", elements: [{ type: "text", name: "q1" }] },
          { name: "page2", elements: [{ type: "text", name: "q2" }] },
          { name: "page3", elements: [{ type: "text", name: "q3" }] }
        ],
      });
      expect(survey.currentPageNo, "The first page").toLooseEqual(0);
      const messages: Array<any> = [];
      survey.notify = (message: string, type: string) => {
        messages.push({ message, type });
      };
      const prevAction = survey.navigationBar.getActionById("sv-nav-prev");
      const nextAction = survey.navigationBar.getActionById("sv-nav-next");
      let allowChanging = false;
      let messageToShow: string = "";
      survey.onCurrentPageChanging.add((survey, options): Promise<void> => {
        return new Promise<void>((resolve) => {
          options.allow = allowChanging;
          options.message = messageToShow;
          resolve();
        });
      });
      allowChanging = true;
      survey.nextPage();
      expect(survey.currentPageNo, "Still the first page, we are waiting for a callback").toLooseEqual(0);
      expect(survey.getPropertyValue("isNavigationBlocked"), "isCurrentPageChanging = true, #1").toLooseEqual(true);
      expect(nextAction.enabled, "next action is disabled during navigation, #1").toLooseEqual(false);
      await vi.advanceTimersByTimeAsync(0);
      expect(survey.getPropertyValue("isNavigationBlocked"), "isCurrentPageChanging = false, #1").toLooseEqual(false);
      expect(survey.currentPageNo, "The second page").toLooseEqual(1);
      expect(nextAction.enabled, "next action is enabled after navigation, #1").toLooseEqual(true);

      allowChanging = false;
      survey.nextPage();
      expect(survey.getPropertyValue("isNavigationBlocked"), "isCurrentPageChanging = true, #2").toLooseEqual(true);
      expect(nextAction.enabled, "next action is disabled during navigation, #2").toLooseEqual(false);
      expect(prevAction.enabled, "prev action is disabled during navigation, #2").toLooseEqual(false);
      expect(survey.currentPageNo, "Still the second page, we are waiting for a callback").toLooseEqual(1);
      await vi.advanceTimersByTimeAsync(0);
      expect(survey.getPropertyValue("isNavigationBlocked"), "isCurrentPageChanging = false, #2").toLooseEqual(false);
      expect(nextAction.enabled, "next action is enabled after navigation, #2").toLooseEqual(true);
      expect(prevAction.enabled, "prev action is enabled after navigation, #2").toLooseEqual(true);
      expect(survey.currentPageNo, "We do not move from the second page").toLooseEqual(1);

      expect(messages, "There is no messages yet").toEqualValues([]);
      messageToShow = "Test error";
      allowChanging = false;
      survey.nextPage();
      await vi.advanceTimersByTimeAsync(0);
      allowChanging = true;
      messageToShow = "Saving text";
      survey.nextPage();
      await vi.advanceTimersByTimeAsync(0);
      expect(messages).toEqualValues([
        { message: "Test error", type: "error" },
        { message: "Saving text", type: "success" }
      ]);
      expect(survey.currentPageNo, "We are on the last page now").toLooseEqual(2);
    } finally {
      vi.useRealTimers();
    }
  });

  test("survey.onCompleting async calls, Issue#10645", async () => {
    vi.useFakeTimers();
    try {
      const survey = new SurveyModel({
        pages: [
          { name: "page1", elements: [{ type: "text", name: "q1" }] },
        ],
      });

      const messages: Array<any> = [];
      survey.notify = (message: string, type: string) => {
        messages.push({ message, type });
      };
      const completeAction = survey.navigationBar.getActionById("sv-nav-complete");
      let allowComplete = false;
      let messageToShow: string = "";
      survey.onCompleting.add((survey, options): Promise<void> => {
        return new Promise<void>((resolve) => {
          options.allow = allowComplete;
          options.message = messageToShow;
          resolve();
        });
      });

      messageToShow = "Test error on complete";
      survey.tryComplete();
      expect(survey.state, "Survey is not completed yet, we are waiting for a callback").toLooseEqual("running");
      expect(survey.getPropertyValue("isNavigationBlocked"), "isCurrentPageChanging = true, #1").toLooseEqual(true);
      expect(completeAction.enabled, "next action is disabled during navigation, #1").toLooseEqual(false);
      await vi.advanceTimersByTimeAsync(0);
      expect(survey.getPropertyValue("isNavigationBlocked"), "isCurrentPageChanging = false, #1").toLooseEqual(false);
      expect(survey.state, "Do not allow complete").toLooseEqual("running");
      expect(completeAction.enabled, "next action is enabled after navigation, #1").toLooseEqual(true);

      allowComplete = true;
      messageToShow = "Test success on complete";
      survey.tryComplete();
      expect(survey.getPropertyValue("isNavigationBlocked"), "isCurrentPageChanging = true, #2").toLooseEqual(true);
      expect(completeAction.enabled, "next action is disabled during navigation, #2").toLooseEqual(false);
      expect(survey.state, "Do not allow complete #2").toLooseEqual("running");
      await vi.advanceTimersByTimeAsync(0);
      expect(survey.getPropertyValue("isNavigationBlocked"), "isCurrentPageChanging = false, #2").toLooseEqual(false);
      expect(completeAction.enabled, "next action is enabled after navigation, #2").toLooseEqual(true);
      expect(survey.state, "Survey is completed now").toLooseEqual("completed");
      expect(messages).toEqualValues([
        { message: "Test error on complete", type: "error" },
        { message: "Test success on complete", type: "success" }
      ]);
    } finally {
      vi.useRealTimers();
    }
  });

  test("survey.onCurrentPageChanging, allow option (use it instead of allowChanging)", () => {
    var survey = twoPageSimplestSurvey();
    //get current Page
    survey.currentPage;
    var allowChanging = false;
    survey.onCurrentPageChanging.add(function (survey, options) {
      options.allow = allowChanging;
    });
    expect(survey.currentPageNo, "The first page").toLooseEqual(0);
    survey.nextPage();
    expect(survey.currentPageNo, "Still the first page").toLooseEqual(0);
    allowChanging = true;
    survey.nextPage();
    expect(survey.currentPageNo, "The second page").toLooseEqual(1);
    allowChanging = false;
    survey.prevPage();
    expect(survey.currentPageNo, "Still the second page").toLooseEqual(1);
    allowChanging = true;
    survey.prevPage();
    expect(survey.currentPageNo, "The second page again").toLooseEqual(0);
  });

  test("survey.onCompleting, allow option", () => {
    var survey = twoPageSimplestSurvey();
    var allowComplete = false;
    survey.onCompleting.add(function (survey, options) {
      options.allow = allowComplete;
    });
    expect(survey.state, "It is running").toLooseEqual("running");
    survey.doComplete();
    expect(survey.state, "It is still running").toLooseEqual("running");
    allowComplete = true;
    survey.doComplete();
    expect(survey.state, "It is completed now").toLooseEqual("completed");
  });

  test("survey.onCompleting, allow option (use it instead of allowComplete)", () => {
    var survey = twoPageSimplestSurvey();
    var allowComplete = false;
    survey.onCompleting.add(function (survey, options) {
      options.allow = allowComplete;
    });
    expect(survey.state, "It is running").toLooseEqual("running");
    survey.doComplete();
    expect(survey.state, "It is still running").toLooseEqual("running");
    allowComplete = true;
    survey.doComplete();
    expect(survey.state, "It is completed now").toLooseEqual("completed");
  });

  test("Complete trigger, onCurrentPageChange calls after onComplete, Bug#963", () => {
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
    expect(onCompleteCounter, "onComplete fired one time").toLooseEqual(1);
    expect(onCurrentPageChangedCounter, "onCurrentPageChanged fired one time").toLooseEqual(0);
    expect(firstFiredEvent, "should be called first").toLooseEqual("onComplete");
  });
  test("Value trigger test", () => {
    const survey = twoPageSimplestSurvey();
    const trigger = new SurveyTriggerSetValue();
    survey.triggers.push(trigger);
    trigger.name = "question1";
    trigger.value = "Hello";
    trigger.setToName = "name1";
    trigger.setValue = "val1";
    expect(survey.getValue("name1"), "value is not set").toLooseEqual(null);
    survey.setValue("question1", "Hello");
    expect(survey.getValue("name1"), "value is set").toLooseEqual("val1");
  });
  test("Triggers shouldn't fire on data assignment", () => {
    var survey = twoPageSimplestSurvey();
    var trigger = new SurveyTriggerSetValue();
    survey.triggers.push(trigger);
    trigger.name = "question1";
    trigger.value = "Hello";
    trigger.setToName = "name1";
    trigger.setValue = "val1";
    expect(survey.getValue("name1"), "value is not set").toLooseEqual(null);
    survey.data = { question1: "Hello" };
    expect(survey.getValue("name1"), "value still is not set").toLooseEqual(null);
  });
  test("Value trigger test, setValue is empty, clear the data", () => {
    var survey = twoPageSimplestSurvey();
    var trigger = new SurveyTriggerSetValue();
    survey.triggers.push(trigger);
    trigger.expression = "{question1}='Hello'";
    trigger.setToName = "question2";
    survey.setValue("question2", "abc");
    expect(survey.getValue("question2"), "value is set").toLooseEqual("abc");
    survey.setValue("question1", "Hello");
    expect(survey.getValue("question2"), "value is cleard because setValue is empty").toBeFalsy();
  });
  test("RunExpression trigger test", () => {
    var survey = twoPageSimplestSurvey();
    survey.setValue("val1", 3);
    survey.setValue("val2", 2);
    var trigger = new SurveyTriggerRunExpression();
    survey.triggers.push(trigger);
    trigger.expression = "{question1} = 'Hello'";
    trigger.setToName = "name1";
    trigger.runExpression = "{val1} + {val2}";
    expect(survey.getValue("name1"), "value is not set").toLooseEqual(null);
    survey.setValue("question1", "Hello");
    expect(survey.getValue("name1"), "value is set as expression").toLooseEqual(5);
    survey.setValue("question1", "Hello1");
    trigger.runExpression = "{val2}";
    survey.clearValue("val2");
    trigger.setToName = "";
    survey.setValue("question1", "Hello");
    expect(survey.getValue("name1"), "value is still 5").toLooseEqual(5);
  });
  test("Skip trigger test", () => {
    var survey = twoPageSimplestSurvey();
    var trigger = new SurveyTriggerSkip();
    survey.triggers.push(trigger);
    trigger.expression = "{question1} = 'Hello'";
    trigger.gotoName = "question4";
    expect(survey.currentPageNo, "the first page is active").toLooseEqual(0);
    survey.setValue("question1", "Hello");
    expect(survey.currentPageNo, "the second page is active now").toLooseEqual(1);
  });
  test("Skip trigger test", () => {
    settings.executeSkipTriggerOnValueChanged = false;
    var survey = twoPageSimplestSurvey();
    survey.addPage(createPageWithQuestion("p3", "q10"));
    var trigger = new SurveyTriggerSkip();
    survey.triggers.push(trigger);
    trigger.expression = "{question1} = 'Hello'";
    trigger.gotoName = "q10";
    expect(survey.currentPageNo, "the first page is active").toLooseEqual(0);
    survey.setValue("question1", "Hello");
    expect(survey.currentPageNo, "the first page is still active").toLooseEqual(0);
    survey.nextPage();
    expect(survey.currentPageNo, "the third page is active").toLooseEqual(2);
    settings.executeSkipTriggerOnValueChanged = true;
  });
  test("RunExpression trigger test with custom function, bug#T1734", () => {
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
    expect(survey.state, "The survey is completed").toLooseEqual("completed");
    FunctionFactory.Instance.unregister("getQuestionValueByTitle");
    FunctionFactory.Instance.unregister("abort");
  });
  test("Add propertyName into function properties, #10323", () => {
    function getValueByProperty(params) {
      if (this.propertyName === "visibleIf") return 10;
      if (this.propertyName === "enableIf") return 20;
      if (this.propertyName === "expression") return 25;
      if (this.propertyName === "defaultValueExpression") return 30;
      return 0;
    }
    FunctionFactory.Instance.register("getValueByProperty",
      getValueByProperty
    );
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1", visibleIf: "getValueByProperty() = 10", enableIf: "getValueByProperty() = 20", defaultValueExpression: "getValueByProperty()" },
        { type: "expression", name: "q2", expression: "getValueByProperty()" }]
    });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    expect(q1.isVisible, "visibleIf works").toLooseEqual(true);
    expect(q1.isReadOnly, "enableIf works").toLooseEqual(false);
    expect(q1.value, "defaultValueExpression works").toLooseEqual(30);
    expect(q2.value, "expression works").toLooseEqual(25);

    FunctionFactory.Instance.unregister("getValueByProperty");
  });

  test("Copy value trigger test", () => {
    var survey = twoPageSimplestSurvey();
    var trigger = new SurveyTriggerCopyValue();
    survey.triggers.push(trigger);
    trigger.name = "question1";
    trigger.value = "Hello";

    trigger.setToName = "question2";
    trigger.fromName = "question3";
    survey.setValue("question3", "CopiedValue");

    expect(survey.getValue("question2"), "value is not set").toLooseEqual(null);
    survey.setValue("question1", "Hello");
    expect(survey.getValue("question2"), "value is set").toLooseEqual("CopiedValue");
  });
  test("String format", () => {
    var strResult = surveyLocalization.getString("textMinLength")["format"](10);
    expect(strResult, "The format string is working").toLooseEqual("Please enter at least 10 character(s).");
  });
  test("Copy value trigger in dynamic panel, Bug# 1574", () => {
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
    expect(survey.data, "trigger copy the value correctly").toEqualValues({
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
    });
  });
  test("Value trigger with async function", () => {
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
    expect(survey.getValue("name1"), "value is not set").toLooseEqual(null);
    survey.setValue("question1", "Hello");
    expect(survey.getValue("name1"), "value is not set, waiting for callback").toLooseEqual(null);
    returnResult1(survey.getValue("question1"));
    expect(survey.getValue("name1"), "value is set").toLooseEqual("val1");
    FunctionFactory.Instance.unregister("asyncFunc1");
  });

  test("RunExpression trigger test", () => {
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

    expect(survey.getValue("name1"), "value is not set").toLooseEqual(null);
    survey.setValue("question1", "Hello");
    expect(survey.getValue("name1"), "value is not set, expression is not completed").toLooseEqual(null);
    returnResult1(survey.getValue("question1"));
    expect(survey.getValue("name1"), "value is not set, runExpression is not completed").toLooseEqual(null);
    returnResult2(survey.getValue("val1") + survey.getValue("val2"));
    expect(survey.getValue("name1"), "value is set as expression").toLooseEqual(5);

    FunctionFactory.Instance.unregister("asyncFunc1");
    FunctionFactory.Instance.unregister("asyncFunc2");
  });

  test("Serialize email validator", () => {
    var validator = new EmailValidator();
    var json = new JsonObject().toJsonObject(validator);
    expect(json, "Convert to Json Successful").toBeTruthy();
    var newValidator = {};
    new JsonObject().toObject(json, newValidator);
    expect(newValidator, "Convert from Json Successful").toBeTruthy();
  });
  test("Email validator - https://github.com/surveyjs/survey-library/issues/1807", () => {
    var validator = new EmailValidator();
    expect(validator.validate("test=1@email.com", ""), "valid email").toLooseEqual(null);
    expect(validator.validate("test=1@ema=il.com", ""), "invalid email - = in domain name").not.toLooseEqual(null);
    expect(validator.validate("test=1@email.c=om", ""), "invalid email - = in domain suffix").not.toLooseEqual(null);
  });
  test("survey.getAllVariables()", () => {
    var survey = twoPageSimplestSurvey();
    survey.setVariable("user", "admin");
    survey.setVariable("type", "2");
    expect(survey.getVariableNames()).toEqualValues(["user", "type"]);
  });
  test("pre process title", () => {
    var survey = twoPageSimplestSurvey();
    survey.data = { name: "John" };
    survey.title = "Hello {name}";
    expect(survey.processedTitle, "process survey title correctly").toLooseEqual("Hello John");
    survey.pages[0].title = "Page {PageNo} from {PageCount}.";
    expect(survey.pages[0].processedTitle).toLooseEqual("Page 1 from 2.");
    survey.pages[0].addNewQuestion("text", "email");
    survey.setValue("email", "andrew.telnov@gmail.com");
    survey.setVariable("var1", "[it is var1]");
    survey.setValue("val1", "[it is val1]");
    survey.completedHtml = "<div>Your e-mail: <b>{email}</b>{var1}{val1}</div>";
    expect(survey.processedCompletedHtml).toLooseEqual("<div>Your e-mail: <b>andrew.telnov@gmail.com</b>[it is var1][it is val1]</div>");
  });
  test("pre process title where name with dot", () => {
    var survey = twoPageSimplestSurvey();
    survey.data = { "name.dot": "John" };
    survey.title = "Hello {name.dot}";
    expect(survey.processedTitle, "process survey title correctly").toLooseEqual("Hello John");
  });

  test("pre process title, 'locale' variable", () => {
    var survey = twoPageSimplestSurvey();
    survey.title = "The current locale is: '{locale}'";
    expect(survey.processedTitle, "process the locale correctly").toLooseEqual("The current locale is: 'en'");
    survey.locale = "fr";
    expect(survey.processedTitle, "process the locale correctly again").toLooseEqual("The current locale is: 'fr'");
  });

  test("pre process title with variables in Capital letters, bug#1099", () => {
    var survey = new SurveyModel();
    survey.setVariable("Var1", "[My variable]");
    survey.completedHtml = "Your Var1 is: {VaR1}";
    expect(survey.processedCompletedHtml).toLooseEqual("Your Var1 is: [My variable]");
  });

  test("pre process completedHtml nested properties and arrays", () => {
    const survey = new SurveyModel();
    const page = survey.addNewPage("page1");

    const multipleText = new QuestionMultipleTextModel("mt");
    multipleText.addItem("t1");
    multipleText.addItem("t2");
    page.addQuestion(multipleText);

    const dynamicMatrix = new QuestionMatrixDynamicModel("matrix");
    dynamicMatrix.addColumn("col1");
    dynamicMatrix.addColumn("col2");
    dynamicMatrix.addColumn("col3");
    page.addQuestion(dynamicMatrix);

    multipleText.value = { t2: "Year" };
    dynamicMatrix.value = [{ col1: 1 }, { col2: 2017 }];

    survey.completedHtml = "{mt.t2}:{matrix[1].col2}";
    expect(survey.processedCompletedHtml).toLooseEqual("Year:2017");
  });

  test("pre process completedHtml nested properties and arrays + name with dot", () => {
    const survey = new SurveyModel();
    const page = survey.addNewPage("page1");

    const multipleText = new QuestionMultipleTextModel("m.t");
    multipleText.addItem("t1");
    multipleText.addItem("t2");
    page.addQuestion(multipleText);

    const dynamicMatrix = new QuestionMatrixDynamicModel("matri.x");
    dynamicMatrix.addColumn("col1");
    dynamicMatrix.addColumn("col2");
    dynamicMatrix.addColumn("col3");
    page.addQuestion(dynamicMatrix);

    multipleText.value = { t2: "Year" };
    dynamicMatrix.value = [{ col1: 1 }, { col2: 2017 }];

    survey.completedHtml = "{m.t.t2}:{matri.x[1].col2}";
    expect(survey.processedCompletedHtml).toLooseEqual("Year:2017");
  });

  test("question fullTitle", () => {
    var survey = twoPageSimplestSurvey();
    survey.showQuestionNumbers = "on";
    var question = <Question>survey.pages[0].questions[1];
    question.title = "My Title";
    expect(question.fullTitle).toLooseEqual("My Title");
    question.isRequired = true;
    expect(question.requiredMark).toLooseEqual("*");
    survey.questionStartIndex = "100";
    expect(question.no).toLooseEqual("101");
    survey.questionStartIndex = "100.";
    expect(question.no).toLooseEqual("101.");
    survey.questionStartIndex = "A";
    expect(question.no).toLooseEqual("B");
    survey.questionStartIndex = "A.";
    expect(question.no).toLooseEqual("B.");
    survey.questionStartIndex = "A";
    survey.questionTitleTemplate = "{no}) {title} ({require})";
    expect(question.no).toLooseEqual("B)");
    expect(question.requiredMark).toLooseEqual("(*)");
  });
  test("question.no and survey.questionStartIndex", () => {
    var survey = twoPageSimplestSurvey();
    survey.showQuestionNumbers = "on";
    var question = <Question>survey.pages[0].questions[1];
    expect(question.no).toLooseEqual("2.");
    survey.questionStartIndex = "100";
    expect(question.no).toLooseEqual("101");
    survey.questionStartIndex = "100.";
    expect(question.no).toLooseEqual("101.");
    survey.questionStartIndex = "A";
    expect(question.no).toLooseEqual("B");
    survey.questionStartIndex = "A.";
    expect(question.no).toLooseEqual("B.");
    survey.questionStartIndex = "10)";
    expect(question.no).toLooseEqual("11)");
    survey.questionStartIndex = "(10)";
    expect(question.no).toLooseEqual("(11)");
    survey.questionStartIndex = "# 1";
    expect(question.no).toLooseEqual("# 2");
    survey.questionStartIndex = "1.2";
    expect(question.no).toLooseEqual("1.3");
    survey.questionStartIndex = "1.01";
    expect(question.no).toLooseEqual("1.02");
    survey.onGetQuestionNumber.add(function (sender, options) {
      options.number = "a.b." + (options.question.visibleIndex + 1) + ")";
    });
    expect(question.no, "use event").toLooseEqual("a.b.2)");
  });
  test("question.no and survey.questionStartIndex and showQuestionNumbers 'recursive' vs design-time, Bug#10476", () => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({
      pages: [
        {
          elements: [
            { type: "text", name: "q1" },
            { type: "text", name: "q2" }
          ]
        },
        {
          elements: [
            { type: "text", name: "q3" },
            { type: "text", name: "q4" },
            { type: "panel", name: "p1", title: "panel", showNumber: true, elements: [
              { type: "text", name: "q5" }
            ] }
          ]
        }
      ],
      showQuestionNumbers: "recursive",
      questionStartIndex: "1.1"
    });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    const q3 = survey.getQuestionByName("q3");
    const q4 = survey.getQuestionByName("q4");
    const q5 = survey.getQuestionByName("q5");
    const panel = survey.getPanelByName("p1");
    expect(q1.no, "q1, #1").toLooseEqual("1.1");
    expect(q2.no, "q2, #1").toLooseEqual("1.2");
    expect(q3.no, "q3, #1").toLooseEqual("2.1");
    expect(q4.no, "q4, #1").toLooseEqual("2.2");
    expect(panel.no, "panel, #1").toLooseEqual("2.3");
    expect(q5.no, "q5, #1").toLooseEqual("2.3.1");
  });
  test("question.no and survey.questionStartIndex and showQuestionNumbers 'recursive' & pages titles, Bug#10476", () => {
    const survey = new SurveyModel({
      pages: [
        {
          title: "Page 1",
          elements: [
            { type: "text", name: "q1" },
            { type: "text", name: "q2" }
          ]
        },
        {
          title: "Page 2",
          elements: [
            { type: "text", name: "q3" },
            { type: "text", name: "q4" },
            { type: "panel", name: "p1", title: "panel", showNumber: true, elements: [
              { type: "text", name: "q5" }
            ] }
          ]
        }
      ],
      showQuestionNumbers: "recursive",
      questionStartIndex: "1.1"
    });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    const q3 = survey.getQuestionByName("q3");
    const q4 = survey.getQuestionByName("q4");
    const q5 = survey.getQuestionByName("q5");
    const panel = survey.getPanelByName("p1");
    expect(q1.no, "q1, #1").toLooseEqual("1.1");
    expect(q2.no, "q2, #1").toLooseEqual("1.2");
    expect(q3.no, "q3, #1").toLooseEqual("2.1");
    expect(q4.no, "q4, #1").toLooseEqual("2.2");
    expect(panel.no, "panel, #1").toLooseEqual("2.3");
    expect(q5.no, "q5, #1").toLooseEqual("2.3.1");
  });
  test("question.no and survey.questionStartIndex and showQuestionNumbers 'recursive' & panel recursive startIndex = ' a', Bug#10517", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "text",
          name: "q1"
        },
        {
          type: "text",
          name: "q2"
        },
        {
          type: "panel", name: "p1", title: "Panel", showQuestionNumbers: "recursive", questionStartIndex: " a",
          elements: [
            { type: "text", name: "q3" },
            { type: "text", name: "q4" }
          ]
        },
        {
          type: "panel", name: "p2", title: "Panel", showQuestionNumbers: "recursive", questionStartIndex: "_a",
          elements: [
            { type: "text", name: "q5" },
            { type: "text", name: "q6" }
          ]
        },
        {
          type: "panel", name: "p3", title: "Panel", showQuestionNumbers: "recursive", questionStartIndex: "#a",
          elements: [
            { type: "text", name: "q7" },
            { type: "text", name: "q8" }
          ]
        }
      ],
      showQuestionNumbers: "on",
      questionStartIndex: "1.1"
    });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    const q3 = survey.getQuestionByName("q3");
    const q4 = survey.getQuestionByName("q4");
    const q5 = survey.getQuestionByName("q5");
    const q6 = survey.getQuestionByName("q6");
    const q7 = survey.getQuestionByName("q7");
    const q8 = survey.getQuestionByName("q8");
    const p1 = survey.getPanelByName("p1");
    const p2 = survey.getPanelByName("p2");
    const p3 = survey.getPanelByName("p3");

    expect(q1.no, "q1, #1").toLooseEqual("1.1");
    expect(q2.no, "q2, #1").toLooseEqual("1.2");
    expect(p1.no, "panel, #1").toLooseEqual("1.3");
    expect(q3.no, "q3, #1").toLooseEqual("1.3 a");
    expect(q4.no, "q4, #1").toLooseEqual("1.3 b");
    expect(p2.no, "panel, #2").toLooseEqual("1.4");
    expect(q5.no, "q5, #1").toLooseEqual("1.4_a");
    expect(q6.no, "q6, #2").toLooseEqual("1.4_b");
    expect(p3.no, "panel, #3").toLooseEqual("1.5");
    expect(q7.no, "q7, #1").toLooseEqual("1.5#a");
    expect(q8.no, "q8, #2").toLooseEqual("1.5#b");
  });
  test("question.no and survey.questionStartIndex = 'A.1' and showQuestionNumbers 'recursive'", () => {
    const survey = new SurveyModel({
      pages: [{
        elements: [
          {
            type: "text",
            name: "q1"
          },
          {
            type: "text",
            name: "q2"
          },
          {
            type: "panel", name: "p1", title: "Panel",
            elements: [
              { type: "text", name: "q3" },
              { type: "text", name: "q4" }
            ]
          },
        ] },
      { elements: [
        { type: "text", name: "q5" },
        {
          type: "panel", name: "p2", title: "Panel",
          elements: [
            { type: "text", name: "q6" },
            { type: "text", name: "q7" }
          ]
        }]
      }],
      showQuestionNumbers: "recursive",
      questionStartIndex: "A.1"
    });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    const q3 = survey.getQuestionByName("q3");
    const q4 = survey.getQuestionByName("q4");
    const q5 = survey.getQuestionByName("q5");
    const q6 = survey.getQuestionByName("q6");
    const q7 = survey.getQuestionByName("q7");
    const p1 = survey.getPanelByName("p1");
    const p2 = survey.getPanelByName("p2");

    expect(q1.no, "q1, #1").toLooseEqual("A.1");
    expect(q2.no, "q2, #1").toLooseEqual("A.2");
    expect(p1.no, "panel1, #1").toLooseEqual("A.3");
    expect(q3.no, "q3, #1").toLooseEqual("A.3.1");
    expect(q4.no, "q4, #1").toLooseEqual("A.3.2");
    expect(q5.no, "q5, #1").toLooseEqual("B.1");
    expect(p2.no, "panel2, #1").toLooseEqual("B.2");
    expect(q6.no, "q6, #1").toLooseEqual("B.2.1");
    expect(q7.no, "q7, #1").toLooseEqual("B.2.2");
  });
  test("survey.onGetPageNumber event", () => {
    const survey = new SurveyModel();
    survey.showPageNumbers = true;
    survey.onGetPageNumber.add((sender, options) => {
      if (options.page.isStartPage) {
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
    expect(survey.pages[0].no, "pages[0], #1").toLooseEqual("");
    expect(survey.pages[1].no, "pages[1], #1").toLooseEqual("2-");
    expect(survey.pages[2].no, "pages[2], #1").toLooseEqual("3-");
    expect(survey.pages[3].no, "pages[3], #1").toLooseEqual("4-");
    survey.pages[1].visible = false;
    expect(survey.pages[0].no, "pages[0], #2").toLooseEqual("");
    expect(survey.pages[1].no, "pages[1], #2").toLooseEqual("2-");
    expect(survey.pages[2].no, "pages[2], #2").toLooseEqual("3-");
    expect(survey.pages[3].no, "pages[3], #2").toLooseEqual("4-");
  });
  test("question.no/queston.visibleIndex and hideNo/hideTitle options", () => {
    var survey = new SurveyModel({
      showQuestionNumbers: true,
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2" },
        { type: "text", name: "q3" },
      ],
    });
    var q1 = survey.pages[0].questions[0];
    var q2 = survey.pages[0].questions[1];
    var q3 = survey.pages[0].questions[2];
    q2.titleLocation = "hidden";
    expect(q2.visibleIndex, "titleLocation = 'hidden', default behavior").toLooseEqual(-1);
    expect(q2.no, "titleLocation = 'hidden'").toLooseEqual("");
    expect(q3.visibleIndex, "previous question titleLocation = 'hidden', default behavior").toLooseEqual(1);
    expect(q3.no, "previous question titleLocation = 'hidden'").toLooseEqual("2.");
    q1.visible = false;
    settings.setQuestionVisibleIndexForHiddenTitle = true;
    q1.visible = true;
    expect(q2.visibleIndex, "titleLocation = 'hidden', setQuestionVisibleIndexForHiddenTitle").toLooseEqual(1);
    expect(q2.no, "titleLocation = 'hidden', setQuestionVisibleIndexForHiddenTitle").toLooseEqual("");
    expect(q3.visibleIndex, "previous question titleLocation = 'hidden', default behavior, setQuestionVisibleIndexForHiddenTitle").toLooseEqual(2);
    expect(q3.no, "previous question titleLocation = 'hidden', setQuestionVisibleIndexForHiddenTitle").toLooseEqual("3.");
    settings.setQuestionVisibleIndexForHiddenTitle = false;

    q2.titleLocation = "default";
    q2.showNumber = false;
    expect(q2.visibleIndex, "showNumber = false, default behavior").toLooseEqual(-1);
    expect(q2.no, "titleLocation = 'hidden'").toLooseEqual("");
    expect(q3.visibleIndex, "previous question showNumber = false, default behavior").toLooseEqual(1);
    expect(q3.no, "previous question showNumber = false").toLooseEqual("2.");
    q1.visible = false;
    settings.setQuestionVisibleIndexForHiddenNumber = true;
    q1.visible = true;
    expect(q2.visibleIndex, "showNumber = false, setQuestionVisibleIndexForHiddenNumber").toLooseEqual(1);
    expect(q2.no, "showNumber = false, setQuestionVisibleIndexForHiddenNumber").toLooseEqual("");
    expect(q3.visibleIndex, "previous question showNumber = false, default behavior, setQuestionVisibleIndexForHiddenNumber").toLooseEqual(2);
    expect(q3.no, "previous question showNumber = false, setQuestionVisibleIndexForHiddenNumber").toLooseEqual("3.");
    settings.setQuestionVisibleIndexForHiddenNumber = false;
  });

  test("update survey.questionStartIndex and survey.requiredMark based on survey.questionTitleTemplate", () => {
    var survey = new SurveyModel();
    survey.questionTitleTemplate = "{no}) {title} {require}";
    expect(survey.questionStartIndex, "{no})").toLooseEqual("1)");
    survey.questionStartIndex = "a";
    survey.questionTitleTemplate = "{no}) {title} {require}";
    expect(survey.questionStartIndex, "{no}) + startIndex = 'a'").toLooseEqual("a)");
    survey.questionTitleTemplate = "{title} ({require})";
    expect(survey.requiredMark, "({require})").toLooseEqual("(*)");
    survey.requiredMark = "!!";
    survey.questionTitleTemplate = "{no}) {title} ({require})";
    expect(survey.requiredMark, "({require}) + !!").toLooseEqual("(!!)");
  });
  test("clearInvisibleValues", () => {
    var survey = twoPageSimplestSurvey();
    survey.clearInvisibleValues = true;
    var question1 = <Question>survey.pages[0].questions[0];
    question1.value = "myValue";
    var question2 = <Question>survey.pages[0].questions[1];
    question2.value = "myValue";
    question1.visible = false;
    survey.doComplete();
    expect(question1.value, "Clear value of an invisible question").toLooseEqual(null);
    expect(question2.value, "Keep value of a visible question").toLooseEqual("myValue");
  });
  test("clearInvisibleValues is onComplete (default value), visible and invisible questions with the same valueName, #898", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("page");
    var q1 = <QuestionTextModel>page.addNewQuestion("text", "q1");
    var q2 = <QuestionTextModel>page.addNewQuestion("text", "q2");
    q1.valueName = "value";
    q2.valueName = "value";
    q1.value = 1;
    q2.visible = false;
    survey.doComplete();
    expect(survey.data, "The value should be keeped").toEqualValues({ value: 1 });
    survey.clear();
    q1.value = 2;
    q1.visible = false;
    survey.doComplete();
    expect(survey.data, "The value should be cleaned").toEqualValues({});
  });
  test("clearInvisibleValues is onComplete (default value), visible and invisible questions with the same name and valueName", () => {
    const survey = new SurveyModel();
    const page = survey.addNewPage("page");
    const q1 = <QuestionTextModel>page.addNewQuestion("text", "q1");
    const q2 = <QuestionTextModel>page.addNewQuestion("text", "q2");
    q2.valueName = "q1";
    q2.value = 1;
    q1.visible = false;
    survey.doComplete();
    expect(survey.data, "The value should be kept").toEqualValues({ q1: 1 });
  });
  test("clearInvisibleValues - comments and other values, #309", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("p1");
    var q1 = <QuestionDropdownModel>page.addNewQuestion("dropdown", "q1");
    q1.showOtherItem = true;
    var q2 = <QuestionTextModel>page.addNewQuestion("text", "q2");
    q2.showCommentArea = true;
    var q3 = <QuestionTextModel>page.addNewQuestion("text", "q3");
    survey.clearInvisibleValues = true;
    q1.value = q1.otherItem.value;
    q1.otherValue = "comment1";
    q2.value = "val2";
    q2.comment = "comment2";
    q3.value = "val3";
    q1.visible = false;
    q2.visible = false;
    expect(survey.data, "There are many vlues yet").not.toEqualValues({ q3: "val3" });
    survey.doComplete();
    expect(survey.data, "There should be one value only").toEqualValues({ q3: "val3" });
  });
  test("Do not store others value if others is not selected, #311", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("p1");
    var q1 = <QuestionDropdownModel>page.addNewQuestion("dropdown", "q1");
    q1.choices = [1];
    q1.showOtherItem = true;
    q1.value = q1.otherItem.value;
    q1.otherValue = "comment1";
    q1.value = 1;
    expect(survey.data, "There is no comment already").toEqualValues({ q1: 1 });
    survey.doComplete();
    expect(survey.data, "There no comment").toEqualValues({ q1: 1 });
  });
  test("merge values", () => {
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
    expect(dest).toEqualValues({ val: 1 });

    survey.doMergeValues({ val2: { val1: "str" } }, dest);
    expect({ val: 1, val2: { val1: "str" } }).toEqualValues(dest);

    survey.doMergeValues({ val2: { val2: 2 } }, dest);
    expect({ val: 1, val2: { val1: "str", val2: 2 } }).toEqualValues(dest);
    var a = "test";
    survey.doMergeValues({ val: 1 }, a);
    expect(a, "Do nothing if dest is string").toLooseEqual("test");
  });
  function percentageToNum(width: string): number {
    width = width.replace("%", "");
    return parseFloat(width);
  }

  test("Several questions in one row - defaultV2", () => {
    let survey = new SurveyModel({});
    survey.css = defaultCss;
    let page = survey.addNewPage();
    page.addNewQuestion("text", "q1");
    const q2 = page.addNewQuestion("text", "q2");
    q2.startWithNewLine = false;
    expect(page.rows.length, "only one row").toLooseEqual(1);
    expect(page.rows[0].elements.length, "two elements in row").toLooseEqual(2);

    expect(page.rows[0].elements[0].rightIndent, "the first indent is 0").toLooseEqual(0);
    expect(page.rows[0].elements[1].rightIndent, "the second indent is 0").toLooseEqual(0);
  });

  test("Several questions in complex questions row - defaultV2", () => {
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
    expect(survey.getAllQuestions()[0].templateElements[0].rightIndent, "the first indent is 0").toLooseEqual(0);

  });

  test("Rendered width with setting width in the same row, using calc", () => {
    var page = new PageModel();
    for (var i = 0; i < 5; i++) {
      page.addNewQuestion("text", "q" + (i + 1));
      page.questions[i].startWithNewLine = false;
    }
    expect(page.questions[1].renderWidth, "the width is 20%").toLooseEqual("20%");
    page.questions[1].width = "100";
    expect(page.questions[1].renderWidth, "the width in px").toLooseEqual("100px");
    page.questions[1].width = "120 px";
    expect(page.questions[1].renderWidth, "the width is not changed").toLooseEqual("120 px");
    page.questions[1].width = "10%";
    page.questions[2].width = "120";
    expect(page.questions[0].renderWidth, "Use calc() function").toLooseEqual("calc((100% - 10% - 120px)/3)");
    page.questions[3].visible = false;
    page.questions[4].visible = false;
    expect(page.questions[0].renderWidth, "Do not calc on 1").toLooseEqual("calc(100% - 10% - 120px)");
  });
  test("Rendered width when all widths for questions are set", () => {
    var page = new PageModel();
    page.addNewQuestion("text", "q1");
    var panel = page.addNewPanel("panel1");
    panel.startWithNewLine = false;
    panel.addNewQuestion("text", "q2");
    page.elements[0].width = "20em";
    expect(page.elements[0].renderWidth, "q1.renderedWidth").toLooseEqual("20em");
    expect(panel.renderWidth, "panel1.renderedWidth, calculated").toLooseEqual("calc(100% - 20em)");
    panel.width = "calc(100% - 40px)";
    expect(panel.renderWidth, "panel1.renderedWidth, from width").toLooseEqual("calc(100% - 40px)");
  });
  test("panel.rederWidth, load from JSON", () => {
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
    expect(q1.renderWidth, "question.renderWidth is fine").toLooseEqual("120px");
    expect(panel1.width, "panel1.width loaded correctly").toLooseEqual("calc(90% - 130px)");
    expect(panel1.renderWidth, "panel.renderWidth is fine").toLooseEqual("calc(90% - 130px)");
  });
  test("Render width should work for strings only - https://surveyjs.answerdesk.io/ticket/details/T2273", () => {
    var page = new PageModel();
    var question = <any>page.addNewQuestion("text", "q1");
    question.width = 300;

    expect(question.renderWidth, "the render width is 100%").toLooseEqual("100%");
  });
  test("test autoAdvanceEnabled property", () => {
    var survey = twoPageSimplestSurvey();

    var dropDownQ = <QuestionDropdownModel>(
    survey.pages[1].addNewQuestion("dropdown", "question5")
  );
    dropDownQ.choices = [1, 2, 3];
    dropDownQ.showOtherItem = true;
    survey.autoAdvanceEnabled = true;
    expect(survey.currentPage.name, "the first page is default page").toLooseEqual(survey.pages[0].name);
    survey.setValue("question1", 1);
    survey.setValue("question2", 2);
    expect(survey.currentPage.name, "go to the second page automatically").toLooseEqual(survey.pages[1].name);
    (<Question>survey.currentPage.questions[0]).value = "3";
    (<Question>survey.currentPage.questions[1]).value = "4";
    dropDownQ.value = dropDownQ.otherItem.value;
    expect(survey.currentPage.name, "stay on the second page").toLooseEqual(survey.pages[1].name);
    expect(survey.state, "survey is still running").not.toLooseEqual("completed");
    dropDownQ.otherValue = "other value";
    expect(survey.state, "survey is still running #2").not.toLooseEqual("completed");
    dropDownQ.value = 1;
    expect(survey.state, "complete the survey").toLooseEqual("completed");
  });
  test("test autoAdvanceEnabled property for boolean/switch", () => {
    var survey = new SurveyModel({
      autoAdvanceEnabled: true,
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

    survey.autoAdvanceEnabled = true;
    expect(survey.currentPage.name, "the first page is default page").toLooseEqual(survey.pages[0].name);
    survey.setValue("q1", true);
    expect(survey.currentPage.name, "go to the second page automatically").toLooseEqual(survey.pages[1].name);
    survey.clear();
    survey.getQuestionByName("q1").renderAs = "checkbox";
    expect(survey.currentPage.name, "the first page is default page, #2").toLooseEqual(survey.pages[0].name);
    survey.setValue("q1", true);
    expect(survey.currentPage.name, "we do not go to the second page automatically, #2").toLooseEqual(survey.pages[0].name);
  });
  test("test autoAdvanceEnabled property - 'autogonext' - go next page automatically but do not submit", () => {
    var survey = twoPageSimplestSurvey();

    var dropDownQ = <QuestionDropdownModel>(
      survey.pages[1].addNewQuestion("dropdown", "question5")
    );
    dropDownQ.choices = [1, 2, 3];
    dropDownQ.showOtherItem = true;
    survey.autoAdvanceEnabled = true;
    expect(survey.currentPage.name, "the first page is default page").toLooseEqual(survey.pages[0].name);
    survey.setValue("question1", 1);
    survey.setValue("question2", 2);
    expect(survey.currentPage.name, "go to the second page automatically").toLooseEqual(survey.pages[1].name);
    (<Question>survey.currentPage.questions[0]).value = "3";
    (<Question>survey.currentPage.questions[1]).value = "4";
    dropDownQ.value = dropDownQ.otherItem.value;
    expect(survey.currentPage.name, "stay on the second page").toLooseEqual(survey.pages[1].name);
    expect(survey.state, "survey is still running").not.toLooseEqual("completed");
    dropDownQ.otherValue = "other value";
    expect(survey.state, "survey is still running").not.toLooseEqual("completed");
  });
  test("test autoAdvanceEnabled property - 'autogonext' - load from survey", () => {
    const survey = new SurveyModel({
      autoAdvanceEnabled: "autogonext",
      elements: [
        { type: "text", name: "q1" }
      ]
    });
    expect(survey.autoAdvanceEnabled, "autoAdvanceEnabled set to autogonext on loading correctly").toLooseEqual(true);
  });
  test("test autoAdvanceEnabled after errors", () => {
    var survey = twoPageSimplestSurvey();

    survey.autoAdvanceEnabled = true;
    (<Question>survey.getQuestionByName("question2")).isRequired = true;
    expect(survey.currentPage.name, "the first page is default page").toLooseEqual(survey.pages[0].name);
    survey.setValue("question1", 1);
    survey.nextPage();
    expect(survey.currentPage.name, "we are still on the first page. There are errors.").toLooseEqual(survey.pages[0].name);
    survey.setValue("question2", 2);
    expect(survey.currentPage.name, "go to the second page automatically").toLooseEqual(survey.pages[1].name);
  });
  test("autoAdvanceEnabled: should not work for complex questions like matrix, checkbox, multiple text", () => {
    var questions = new Array<any>();
    const checkboxQuestion = new QuestionCheckboxModel("check");
    checkboxQuestion.choices = [1, 2, 3];
    questions.push({
      question: checkboxQuestion,
      auto: false,
      value: [1],
    });
    const radioQuestion = new QuestionRadiogroupModel("radio");
    radioQuestion.choices = [1, 2, 3];
    questions.push({
      question: radioQuestion,
      auto: true,
      value: 1,
    });
    const dropdownQuestion = new QuestionDropdownModel("dropdown");
    dropdownQuestion.choices = [1, 2, 3];
    questions.push({
      question: dropdownQuestion,
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
    dropDownMatrix.choices = [1, 2, 3];
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
    dynamicMatrix.choices = [1, 2, 3];
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
      survey.autoAdvanceEnabled = true;
      if (q.value) {
        q.question.onMouseDown();
        q.question.value = q.value;
      }
      var state = q.auto ? "completed" : "running";
      expect(survey.state, "autoAdvanceEnabled is incorrect for question: " + q.question.name).toLooseEqual(state);
    }
  });
  test("autoAdvanceEnabled bug #200: https://github.com/surveyjs/surveyjs/issues/200", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("page1");
    page.addNewQuestion("html", "q1");
    var q2 = <QuestionDropdownModel>page.addNewQuestion("dropdown", "q2");
    q2.choices = [1, 2, 3];
    page = survey.addNewPage("page2");
    page.addNewQuestion("text", "q3");
    survey.autoAdvanceEnabled = true;
    (<Question>survey.getQuestionByName("q2")).value = 1;
    expect(survey.currentPage.name, "go to the next page").toLooseEqual(survey.pages[1].name);
  });

  test("autoAdvanceEnabled and clearInvisibleValues bug #252: https://github.com/surveyjs/surveyjs/issues/252", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("page1");
    var q1 = <QuestionDropdownModel>page.addNewQuestion("dropdown", "q1");
    q1.choices = [1, 2, 3];
    var q2 = <QuestionDropdownModel>page.addNewQuestion("dropdown", "q2");
    q2.visible = false;
    q2.value = 1;
    survey.autoAdvanceEnabled = true;
    survey.clearInvisibleValues = true;
    (<Question>survey.getQuestionByName("q1")).value = 1;
    expect(survey.state).toLooseEqual("completed");
  });
  test("autoAdvanceEnabled and autoAdvanceAllowComplete=false", () => {
    const emptySurvey = new SurveyModel();
    expect(emptySurvey.autoAdvanceAllowComplete, "autoAdvanceAllowComplete value # 1").toLooseEqual(true);
    const survey = new SurveyModel({
      pages: [
        { elements: [{ type: "dropdown", name: "q1", choices: [1, 2, 3] }] },
        { elements: [{ type: "dropdown", name: "q2", choices: [1, 2, 3] }] }
      ],
      autoAdvanceEnabled: true,
      autoAdvanceAllowComplete: false
    });
    expect(survey.autoAdvanceAllowComplete, "autoAdvanceAllowComplete value # 2").toLooseEqual(false);
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    expect(survey.currentPageNo, "curPage #1").toLooseEqual(0);
    q1.value = 1;
    expect(survey.currentPageNo, "curPage #2").toLooseEqual(1);
    q2.value = 1;
    expect(survey.currentPageNo, "curPage #2").toLooseEqual(1);
  });

  test("autoAdvanceEnabled and checkbox wiht valueName bug #70", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("page1");
    var q1 = <QuestionDropdownModel>page.addNewQuestion("checkbox", "q1");
    q1.valueName = "v"; //this line produce the issue
    q1.choices = [1, 2, 3];
    survey.autoAdvanceEnabled = true;
    (<Question>survey.getQuestionByName("q1")).value = [1];
    expect(survey.state, "it should not be completed").not.toLooseEqual("completed");
  });
  test("Compatibility  showNavigationButtons: 'both'", () => {
    const survey = new SurveyModel({
      showNavigationButtons: "both"
    });
    expect(survey.showNavigationButtons, "showNavigationButtons is true").toLooseEqual(true);
    expect(survey.navigationButtonsLocation, "navigationButtonsLocation is topBottom").toLooseEqual("topBottom");
  });
  test("isNavigationButtonsShowing", () => {
    var survey = twoPageSimplestSurvey();
    expect(survey.isNavigationButtonsShowing, "by default buttons are shown").toLooseEqual("bottom");
    expect(survey.isNavigationButtonsShowingOnBottom, "by default buttons are shown, #bottom").toLooseEqual(true);
    expect(survey.isNavigationButtonsShowingOnTop, "by default buttons are shown, #top").toLooseEqual(false);
    survey.setDesignMode(true);
    expect(survey.isNavigationButtonsShowing, "do not show buttons at design time").toLooseEqual("none");
    expect(survey.isNavigationButtonsShowingOnBottom, "do not show buttons at design time, #bottom").toLooseEqual(false);
    expect(survey.isNavigationButtonsShowingOnTop, "do not show buttons at design time, #top").toLooseEqual(false);
    survey.setDesignMode(false);
    expect(survey.isNavigationButtonsShowing, "by default buttons are shown").toLooseEqual("bottom");
    expect(survey.isNavigationButtonsShowingOnBottom, "by default buttons are shown, #bottom").toLooseEqual(true);
    expect(survey.isNavigationButtonsShowingOnTop, "by default buttons are shown, #top").toLooseEqual(false);
    survey.showNavigationButtons = false;
    expect(survey.isNavigationButtonsShowing, "showNavigationButtons = none").toLooseEqual("none");
    expect(survey.isNavigationButtonsShowingOnBottom, "showNavigationButtons = none, #bottom").toLooseEqual(false);
    expect(survey.isNavigationButtonsShowingOnTop, "showNavigationButtons = none, #top").toLooseEqual(false);
    survey.pages[0].showNavigationButtons = true;
    expect(survey.isNavigationButtonsShowing, "showNavigationButtons = true && showNavigationButtons = false").toLooseEqual("bottom");
    expect(survey.isNavigationButtonsShowingOnBottom, "showNavigationButtons = true && showNavigationButtons = false, #bottom").toLooseEqual(true);
    expect(survey.isNavigationButtonsShowingOnTop, "showNavigationButtons = true && showNavigationButtons = false, #top").toLooseEqual(false);
    survey.showNavigationButtons = false;
    survey.pages[0].showNavigationButtons = false;
    expect(survey.isNavigationButtonsShowing, "showNavigationButtons = false && showNavigationButtons = false").toLooseEqual("none");
    expect(survey.isNavigationButtonsShowingOnBottom, "showNavigationButtons = false && showNavigationButtons = false, #bottom").toLooseEqual(false);
    survey.showNavigationButtons = true;
    survey.pages[0].showNavigationButtons = "inherit";
    expect(survey.isNavigationButtonsShowing, "showNavigationButtons = 'inherit' && showNavigationButtons = true").toLooseEqual("bottom");
    expect(survey.isNavigationButtonsShowingOnBottom, "showNavigationButtons = 'inherit' && showNavigationButtons = true, #bottom").toLooseEqual(true);

    survey.showNavigationButtons = "both";
    expect(survey.showNavigationButtons, "showNavigationButtons is true showNavigationButtons = both").toLooseEqual(true);
    expect(survey.navigationButtonsLocation, "navigationButtonsLocation is topBottom showNavigationButtons = both").toLooseEqual("topBottom");
    expect(survey.isNavigationButtonsShowing, "showNavigationButtons = undefined && showNavigationButtons = both").toLooseEqual("topBottom");
    expect(survey.isNavigationButtonsShowingOnBottom, "showNavigationButtons = 'inherit' && showNavigationButtons = both, #bottom").toLooseEqual(true);
    expect(survey.isNavigationButtonsShowingOnTop, "showNavigationButtons = undefined && showNavigationButtons = both, #top").toLooseEqual(true);

    survey.showNavigationButtons = true;
    survey.navigationButtonsLocation = "top";
    expect(survey.isNavigationButtonsShowing, "showNavigationButtons = undefined && showNavigationButtons = top").toLooseEqual("top");
    expect(survey.isNavigationButtonsShowingOnBottom, "showNavigationButtons = undefined && showNavigationButtons = top, #bottom").toLooseEqual(false);
    expect(survey.isNavigationButtonsShowingOnTop, "showNavigationButtons = undefined && showNavigationButtons = top, #top").toLooseEqual(true);
  });

  test("isNavigationButtonsShowingOnBottom & isNavigationButtonsShowingOnTop, navigationButtonsLocation is `topBottom`, Bug#9812", () => {
    const survey = new SurveyModel({
      elements: [{ type: "text", name: "question1" }],
      navigationButtonsLocation: "topBottom",
    });
    expect(survey.isNavigationButtonsShowingOnBottom, "isNavigationButtonsShowingOnBottom is true").toLooseEqual(true);
    expect(survey.isNavigationButtonsShowingOnTop, "isNavigationButtonsShowingOnTop is true").toLooseEqual(true);
    const getContainerContent = getContainerContentFunction(survey);
    expect(getContainerContent("contentTop"), "nav both contentTop").toEqualValues([{
      "component": "sv-action-bar",
      "id": "buttons-navigation-top"
    }]);
    expect(getContainerContent("contentBottom"), "nav both contentBottom").toEqualValues([{
      "component": "sv-action-bar",
      "id": "buttons-navigation"
    }]);
  });

  test("simple condition test", () => {
    const survey = new SurveyModel({
      pages: [
        {
          name: "page1",
          elements: [
            { type: "radiogroup", name: "q1", choices: ["yes", "no"] },
            { type: "radiogroup", name: "q2", choices: ["yes", "no"] },
          ],
        },
        {
          name: "page2",
          visibleIf: "{q1} = 'yes' or {q2} = 'no'",
          elements: [
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
    const q3 = survey.getQuestionByName("q3");
    expect(survey.pages[1].visible, "initially the page becomes invisible").toLooseEqual(false);
    expect(q3.visible, "initially q3 becomes invisible").toLooseEqual(false);
    survey.setValue("q1", "yes");
    survey.setValue("q2", "no");
    expect(survey.getQuestionByName("q1").value, "q1 = 'yes'").toLooseEqual("yes");
    expect(survey.getQuestionByName("q2").value, "q2 = 'no'").toLooseEqual("no");
    expect(survey.pages[1].visible, "the page becomes visible, q1 = 'yes'").toLooseEqual(true);
    expect(q3.visible, "q3 becomes visible, q1 = 'yes' and q2 = 'no'").toLooseEqual(true);
    survey.setValue("q2", "yes");
    expect(survey.pages[1].visible, "the page becomes visible, q1 = 'yes'").toLooseEqual(true);
    expect(q3.visible, "q3 becomes invisible, q1 = 'yes' and q2 = 'yes'").toLooseEqual(false);
    survey.setValue("q1", "no");
    expect(survey.pages[1].visible, "the page becomes invisible, q1 = 'no'").toLooseEqual(false);
    expect(q3.visible, "q3 becomes invisible, q1 = 'no' and q2 = 'yes'").toLooseEqual(false);
  });

  test("simple condition test, page visibility", () => {
    var survey = new SurveyModel({
      pages: [
        {
          name: "page1",
          elements: [{ type: "checkbox", name: "q1", choices: ["yes", "no"] }],
        },
        {
          name: "page2",
          visibleIf: "{q1} contains 'yes'",
          elements: [{ type: "text", name: "q3" }],
        },
      ],
    });
    var page2 = survey.getPageByName("page2");
    expect(page2.visible, "the initial page2 is invisible").toLooseEqual(false);
    survey.setValue("q1", ["yes"]);
    expect(page2.visible, "the page becomes visible, q1 = 'yes'").toLooseEqual(true);
  });
  test("Re-run condition on changing the variable", () => {
    var survey = new SurveyModel({
      pages: [
        {
          name: "page1",
          elements: [{ type: "text", name: "q1", visibleIf: "{var1} = 1" }],
        },
      ],
    });
    var q1 = survey.getQuestionByName("q1");
    expect(q1.isVisible, "var1 is not exists, question is invisible").toLooseEqual(false);
    survey.setVariable("var1", 1);
    expect(q1.isVisible, "var1 equals 1, question is visible").toLooseEqual(true);
    survey.setVariable("var1", 2);
    expect(q1.isVisible, "var1 equals 2, question is not visible now").toLooseEqual(false);
  });

  test("visibleIf for question, call onPageVisibleChanged", () => {
    var survey = new SurveyModel({
      pages: [
        {
          name: "page1",
          elements: [{ type: "checkbox", name: "q1", choices: ["yes", "no"] }],
        },
        {
          name: "page2",
          elements: [
            { type: "text", name: "q3", visibleIf: "{q1} contains 'yes'" },
          ],
        },
      ],
    });
    var counter = 0;
    survey.onPageVisibleChanged.add(function () {
      counter++;
    });
    expect(survey.pages[0].isVisible, "first page visible by children").toLooseEqual(true);
    expect(survey.pages[1].isVisible, "second page is not visible by children").toLooseEqual(false);
    expect(counter, "nothing happens").toLooseEqual(0);
    survey.setValue("q1", ["yes"]);
    expect(counter, "calls one time").toLooseEqual(1);
    survey.setValue("q1", ["no"]);
    expect(counter, "calls second time").toLooseEqual(2);
    survey.setValue("q1", []);
    expect(counter, "nothing happens").toLooseEqual(2);
  });
  test("visibleIf, expression custom function has property this.survey", () => {
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
      elements: [
        { type: "checkbox", name: "q1", choices: ["yes", "no"] },
        { type: "text", name: "q2", visibleIf: "isAllChecksSet('q1') == true" },
      ],
    });
    var q = survey.getQuestionByName("q2");
    expect(q.isVisible, "all checks are unset").toLooseEqual(false);
    survey.setValue("q1", ["yes", "no"]);
    expect(q.isVisible, "all checks are set").toLooseEqual(true);
    survey.setValue("q1", ["yes"]);
    expect(q.isVisible, "not all checks are set").toLooseEqual(false);
    FunctionFactory.Instance.unregister("isAllChecksSet");
  });
  test("visibleIf, bug#729", () => {
    var survey = new SurveyModel({
      elements: [
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
    expect(q2.visible, "q2 is not visible by default").toLooseEqual(false);
    q1.value = "true";
    expect(q2.visible, "q2 should be visible now").toLooseEqual(true);
    q1.value = "false";
    expect(q2.visible, "q2 should be invisible again").toLooseEqual(false);
  });
  test("visibleIf, Does not work with 0, bug#1792", () => {
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
    expect(q3.isVisible, "'0' is not empty").toLooseEqual(true);
    expect(q4.isVisible, "0 is not empty").toLooseEqual(true);
  });
  test("visibleIf, allow dot in question name", () => {
    var survey = new SurveyModel({
      elements: [
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
    expect(q2.visible, "q2 is not visible by default").toLooseEqual(false);
    q1.value = "true";
    expect(q2.visible, "q2 should be visible now").toLooseEqual(true);
    q1.value = "false";
    expect(q2.visible, "q2 should be invisible again").toLooseEqual(false);
  });
  test("visibleIf, Does not work with many dots", () => {
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
    expect(q2.isVisible, "q2 is invisible by default").toLooseEqual(false);
    q1.value = 1;
    expect(q2.isVisible, "q2 is visible now").toLooseEqual(true);
  });
  test("visibleIf, Does not work with many dots (2)", () => {
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
    expect(q2.isVisible, "q2 is invisible by default").toLooseEqual(false);
    q1.value = 1;
    expect(q2.isVisible, "q2 is visible now").toLooseEqual(true);
  });
  test("visibleIf, Does not work with many dots (3)", () => {
    var survey = new SurveyModel({
      elements: [
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
    expect(q3.isVisible, "q3 is invisible by default").toLooseEqual(false);
    q1.value = 1;
    q2.value = 3;
    expect(q3.isVisible, "q3 is visible now").toLooseEqual(true);
  });

  test("enableIf for question", () => {
    var survey = new SurveyModel({
      pages: [
        {
          name: "page1",
          elements: [
            { type: "checkbox", name: "q1", choices: ["yes", "no"] },
            { type: "text", name: "q2", enableIf: "{q1} contains 'yes'" },
          ],
        },
      ],
    });
    var q2 = <Question>survey.getQuestionByName("q2");
    expect(q2.isReadOnly, "It is readonly initially").toLooseEqual(true);
    survey.setValue("q1", ["yes"]);
    expect(q2.isReadOnly, "It is not readonly now").toLooseEqual(false);
  });

  test("enableIf for matrix questions, Bug#736", () => {
    var survey = new SurveyModel({
      elements: [
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
    expect(qVisible, "visibleIf is set").toBeTruthy();
    expect(qEnable, "enableIf is set").toBeTruthy();
    expect(qVisible.visible, "The question is invisible on start").toLooseEqual(false);
    expect(qEnable.readOnly, "The question is readOnly on start").toLooseEqual(true);
    rows1[0].cells[0].question.value = "Yes";
    expect(qVisible.visible, "The question is visible now").toLooseEqual(true);
    expect(qEnable.readOnly, "The question is enabled now").toLooseEqual(false);
  });

  test("isRequired test, empty array https://github.com/surveyjs/surveyjs/issues/362", () => {
    var survey = new SurveyModel({
      pages: [
        {
          name: "page1",
          elements: [
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
    expect(page1.validate(), "There is a required error").toLooseEqual(false);
    q1.value = ["yes"];
    expect(page1.validate(), "There is no required error").toLooseEqual(true);
  });

  test("multiple triger on checkbox stop working.", () => {
    var survey = new SurveyModel({
      pages: [
        {
          elements: [
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
    expect(survey.getQuestionByName("question2").visible, "The second question is visible").toLooseEqual(true);
    value.push("two");
    check.value = value;
    expect(survey.getQuestionByName("question3").visible, "The third question is visible").toLooseEqual(true);
  });

  test("QuestionCheckbox if single value set then convert it to array, #334", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("page1");
    var q1 = <QuestionCheckboxModel>page.addNewQuestion("checkbox", "q1");
    survey.setValue("q1", [1]);
    expect(survey.getValue("q1"), "survey.getValue returns array").toEqualValues([1]);
    expect(q1.value, "q1.value returns array").toEqualValues([1]);
    survey.setValue("q1", 1);
    expect(survey.getValue("q1"), "survey.getValue return value").toEqualValues(1);
    expect(q1.value, "q1.value still returns array").toEqualValues([1]);
  });

  test("visibleIf and page rows", () => {
    var survey = new SurveyModel({
      pages: [
        {
          name: "component",
          elements: [
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
      requiredMark: "(*)",
      partialSendEnabled: true,
      showQuestionNumbers: false,
    });
    var page = survey.currentPage;
    expect(page.rows.length).toLooseEqual(5);

    survey.setValue("component", "app");
    expect(page.rows[1].visible).toLooseEqual(true);
    expect(page.rows[4].visible).toLooseEqual(false);

    survey.setValue("component", "database");
    expect(page.rows[1].visible).toLooseEqual(false);
    expect(page.rows[4].visible).toLooseEqual(true);

    survey.setValue("component", "app");
    expect(page.rows[1].visible).toLooseEqual(true);
    expect(page.rows[4].visible).toLooseEqual(false);
  });
  test("assign customWidgets to questions", () => {
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
    expect(survey.currentPageNo, "the first page is chosen").toLooseEqual(0);
    expect((<Question>survey.getQuestionByName("question1")).customWidget, "there is no custom widget for this question").toLooseEqual(null);
    expect((<Question>survey.getQuestionByName("question2")).customWidget.name, "has the first custom widget").toLooseEqual("first");
    expect((<Question>survey.getQuestionByName("question5")).customWidget.name, "has the second custom widget").toLooseEqual("second");
    CustomWidgetCollection.Instance.clear();
  });
  test("customWidgets activation types changed", () => {
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
    expect(lastActivatedBy, "activatedBy set to 'property' by default").toLooseEqual("property");
    CustomWidgetCollection.Instance.setActivatedBy("widget1", "type");
    expect(lastActivatedBy, "activatedBy set to 'type'").toLooseEqual("type");
    CustomWidgetCollection.Instance.setActivatedBy("widget1", "customtype");
    expect(lastActivatedBy, "activatedBy set to 'customtype'").toLooseEqual("customtype");
    CustomWidgetCollection.Instance.clear();
  });

  test("assign customWidgets to matrix dynamic cell question", () => {
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
      elements: [
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
    expect(rows[0].cells[0].question.customWidget.name, "the first cell has custom widget").toLooseEqual("first");
    expect(rows[0].cells[1].question.customWidget, "the second cell has no custom widget").toLooseEqual(null);

    Serializer.addProperty("matrixdropdowncolumn", oldMartixDropdownRenderAsProperty);
    Serializer.addProperty("dropdown", oldDropdownRenderAsProperty);

    CustomWidgetCollection.Instance.clear();
  });

  test("customWidgets support displayValue", () => {
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
    expect(survey.currentPageNo, "the first page is chosen").toLooseEqual(0);
    expect(question.customWidget.name, "has the first custom widget").toLooseEqual("first");
    question.value = 1;
    expect(question.displayValue, "Use display value of custom widget").toLooseEqual("one");
    CustomWidgetCollection.Instance.clear();
  });

  test("customWidgets camel name", () => {
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
    expect(question.customWidget.name, "the custom custom widget is set").toLooseEqual("camelName");
    CustomWidgetCollection.Instance.clear();
  });
  test("Create custom widget from addQuestion", () => {
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
    expect(question.name, "name is correct").toLooseEqual("q1");
    expect(question.getType(), "type is correct").toLooseEqual(cType);
    CustomWidgetCollection.Instance.clear();
    Serializer.removeClass(cType);
    QuestionFactory.Instance.unregisterElement(cType);
  });
  test("ElementFactory.getAllToolboxTypes()", () => {
    let defaultToolboxNames = ElementFactory.Instance.getAllToolboxTypes();
    let defaultNames = ElementFactory.Instance.getAllTypes();
    expect(defaultToolboxNames, "They are the same by default").toEqualValues(defaultNames);
    const type = "toolbox-test-type";
    ElementFactory.Instance.registerElement(type, (name: string): IElement => { return new PanelModel(name); }, false);
    defaultToolboxNames = ElementFactory.Instance.getAllToolboxTypes();
    defaultNames = ElementFactory.Instance.getAllTypes();
    expect(defaultToolboxNames.length + 1, "We do use the new type for toolbox").toLooseEqual(defaultNames.length);
    ElementFactory.Instance.unregisterElement(type);
  });
  test("readOnlyCallback, bug #1818", () => {
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
    expect(question.customWidget.name, "Custom widget is here").toLooseEqual("first");
    expect(readOnlyCounter, "Not called yet").toLooseEqual(0);
    question.readOnly = true;
    expect(readOnlyCounter, "question.readOnly = true").toLooseEqual(1);
    question.readOnly = false;
    expect(readOnlyCounter, "question.readOnly = false").toLooseEqual(2);
    expect(panel.isReadOnly, "Panel is not readOnly").toLooseEqual(false);
    question.value = 1;
    expect(panel.isReadOnly, "Panel is readOnly").toLooseEqual(true);
    expect(readOnlyCounter, "Panel is readOnly").toLooseEqual(3);
    question.value = 2;
    expect(panel.isReadOnly, "Panel is not readOnly").toLooseEqual(false);
    expect(readOnlyCounter, "Panel is not readOnly").toLooseEqual(4);
    survey.readOnly = true;
    expect(readOnlyCounter, "survey.mode = 'display'").toLooseEqual(5);
    survey.readOnly = false;
    expect(readOnlyCounter, "survey.mode = 'edit'").toLooseEqual(6);

    CustomWidgetCollection.Instance.clear();
  });

  test("Set 0 value for text inputType=number from survey. Bug #267", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("Page 1");
    page.addNewQuestion("text", "question1");
    var question = <QuestionTextModel>page.questions[0];
    question.inputType = "number";
    expect(question.value, "undefined initial value").toBe(undefined);
    question.value = "0";
    expect(question.value, "zero value").toBe(0);
  });

  test("Survey Localization - check question.title", () => {
    var survey = twoPageSimplestSurvey();
    var q1 = <QuestionTextModel>survey.getQuestionByName("question1");
    q1.title = "val1";
    survey.locale = "de";
    q1.title = "de-val1";
    survey.locale = "fr";
    expect(q1.title, "Use the default title").toLooseEqual("val1");
    survey.locale = "de";
    expect(q1.title, "Use 'de' title").toLooseEqual("de-val1");
  });

  test("Survey Localization - check page/panel.title and processedTitle", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("page1");
    var panel = page.addNewPanel("panel1");
    expect(page.processedTitle, "page title is empty").toLooseEqual("");
    expect(panel.processedTitle, "panel title is empty").toLooseEqual("");
    survey.setDesignMode(true);
    expect(page.processedTitle, "page title is empty at design-time").toLooseEqual("");
    expect(panel.processedTitle, "panel title uses name").toLooseEqual("[panel1]");
    page.title = "pageText";
    panel.title = "panelText";
    survey.locale = "de";
    page.title = "de-pageText";
    panel.title = "de-panelText";
    survey.locale = "fr";
    expect(page.title, "Use the default page title").toLooseEqual("pageText");
    expect(panel.title, "Use the default panel title").toLooseEqual("panelText");
    survey.locale = "de";
    expect(page.title, "Use the 'de' page title").toLooseEqual("de-pageText");
    expect(panel.title, "Use the 'de' panel title").toLooseEqual("de-panelText");
  });

  test("Survey Localization - dropdown.choices", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("Page 1");
    var q1 = <QuestionDropdownModel>page.addNewQuestion("dropdown", "question1");
    q1.choices = ["val1"];
    q1.choices[0].text = "text1";
    survey.locale = "de";
    q1.choices[0].text = "de-text1";
    expect(q1.choices[0].text, "Use 'de' text").toLooseEqual("de-text1");
    survey.locale = "fr";
    expect(q1.choices[0].text, "Use the default text").toLooseEqual("text1");
  });

  test("Survey Localization - radiogroup.otheItem", () => {
    var json = {
      elements: [
        {
          type: "radiogroup",
          name: "q1",
          showOtherItem: true,
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

    expect(q1.visibleChoices[2].locText.textOrHtml, "By default it is Other").toLooseEqual("Other");
    survey.locale = "es";
    expect(q1.visibleChoices[2].locText.textOrHtml, "Otro for Spanish").toLooseEqual("Otro");
    survey.locale = "";
    expect(q1.visibleChoices[2].locText.textOrHtml, "It is default again").toLooseEqual("Other");
    survey.locale = "es";
    expect(q1.visibleChoices[2].locText.textOrHtml, "It is Spanish again").toLooseEqual("Otro");
    survey.locale = "";
  });

  test("Survey Localization - matrix.columns", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("Page 1");
    var q1 = new QuestionMatrixModel("matrix");
    q1.columns = ["col1"];
    page.addQuestion(q1);

    q1.columns[0].text = "text1";
    survey.locale = "de";
    q1.columns[0].text = "de-text1";
    expect(q1.columns[0].text, "Use 'de' text").toLooseEqual("de-text1");
    survey.locale = "fr";
    expect(q1.columns[0].text, "Use the default text").toLooseEqual("text1");
  });

  test("Survey Localization - dropdownmatrix.columns", () => {
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
    expect(col1.title, "Use 'de' text, title").toLooseEqual("de-title1");
    expect(col1["placeholder"], "Use 'de' text, placeholder").toLooseEqual("de-caption1");
    expect(col1["choices"][0].text, "Use 'de' text, choices").toLooseEqual("de-text1");
    survey.locale = "fr";
    expect(col1.title, "Use default text, title").toLooseEqual("title1");
    expect(col1["placeholder"], "Use default text, placeholder").toLooseEqual("caption1");
    expect(col1["choices"][0].text, "Use the default text").toLooseEqual("text1");
  });

  test("Survey Localization - multipletext.items", () => {
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
    expect(item.title, "Use 'de' text, title").toLooseEqual("de-title1");
    expect(item.placeHolder, "Use 'de' text, placeHolder").toLooseEqual("de-caption1");
    survey.locale = "fr";
    expect(item.title, "Use default text, title").toLooseEqual("title1");
    expect(item.placeHolder, "Use default text, placeHolder").toLooseEqual("caption1");
  });

  test("Survey Localization - question.validators[].text, Bug#966", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("Page 1");
    var q1 = new QuestionTextModel("q1");
    page.addQuestion(q1);
    var validator = new EmailValidator();
    q1.validators.push(validator);
    validator.text = "default-text";
    survey.locale = "de";
    validator.text = "de-text";
    expect(validator.text, "Use 'de' text").toLooseEqual("de-text");
    survey.locale = "fr";
    expect(validator.text, "Use default text").toLooseEqual("default-text");
    survey.locale = "";
  });

  test("survey.getUsedLocales()", () => {
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
    expect(surveyLocalization.defaultLocale, "En is default locale").toLooseEqual("en");
    var locales = survey.getUsedLocales();
    const checkLocales = ["en", "fr", "es", "ru", "gr", "pt", "it"];
    expect(locales.length, "Get all locales").toLooseEqual(checkLocales.length);
    for (var i = 0; i < checkLocales.length; i++) {
      expect(locales.indexOf(checkLocales[i]) > -1, "Locale: " + checkLocales[i] + " not found").toBeTruthy();
    }
  });

  test("Survey text preprocessing, dropdown/checkbox/radiogroup, issue #499", () => {
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
    expect(q3.locTitle.renderedHtml, "There is no values").toLooseEqual("-");
    q1.value = 1;
    expect(q3.locTitle.renderedHtml, "Drop down value is set").toLooseEqual("Item 1-");
    q2.value = [3, 4];
    expect(q3.locTitle.renderedHtml, "Drop down value is set").toLooseEqual("Item 1-Item 3, Item 4");
  });

  test("Survey text preprocessing, zero value, issue https://surveyjs.answerdesk.io/ticket/details/t2493", () => {
    var survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1", inputType: "number" },
        { type: "text", name: "q2", title: "q1={q1}" },
      ],
    });
    var q1 = <Question>survey.getQuestionByName("q1");
    var q2 = <Question>survey.getQuestionByName("q2");
    q1.value = 0;
    expect(q1.getDisplayValue(false), "Return correct display value").toLooseEqual("0");
    expect(q2.locTitle.renderedHtml, "Not is not a null").toLooseEqual("q1=0");
  });

  test("Survey text preprocessing, matrix, issue #499", () => {
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
    expect(q2.locTitle.renderedHtml, "Matrix use text").toLooseEqual("Col 1");
  });

  test("Survey text preprocessing, dropdown matrix, issue #499", () => {
    const survey = new SurveyModel();
    const page = survey.addNewPage("Page 1");
    const q1 = <QuestionMatrixDropdownModel>(
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
    const q2 = <Question>page.addNewQuestion("text", "q2");
    q2.title = "{q1.row1.col1}";
    q1.value = { row1: { col1: 1 } };
    expect(q2.locTitle.renderedHtml, "Dropdown Matrix Column use text").toLooseEqual("Item 1");
  });

  test("Survey text preprocessing, dynamic matrix, issue #499", () => {
    const survey = new SurveyModel();
    const page = survey.addNewPage("Page 1");
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
    const q2 = <Question>page.addNewQuestion("text", "q2");
    q2.title = "{q1[0].col1}";
    q1.value = [{ col1: 1 }, {}];
    expect(q2.locTitle.renderedHtml, "Dynamic Matrix Column use text").toLooseEqual("Item 1");
  });
  test("Survey text preprocessing with camella case, issue #913", () => {
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
    expect(question1.fullTitle, "The value is preprocessed correctly").toLooseEqual("john.snow@nightwatch.com");
  });
  test("Survey text preprocessing complex data without question, issue #4434", () => {
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
    expect(question.fullTitle, "The complex value is preprocessed correctly").toLooseEqual("complexText");
  });

  test("Survey text preprocessing: survey.onGetQuestionDisplayValue", () => {
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
    expect(q1.displayValue, "Empty value").toLooseEqual("{Q1}");
    expect(q2.locTitle.renderedHtml, "title for empty value").toLooseEqual("q1: {Q1}");
    q1.value = "val1";
    expect(q1.displayValue, "value=val1").toLooseEqual("[val1]");
    expect(q2.locTitle.renderedHtml, "title for value=val1").toLooseEqual("q1: [val1]");
  });

  test("Survey Markdown - dropdown.choices", () => {
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
    expect(loc1.renderedHtml, "render standard text").toLooseEqual("text1");
    expect(loc2.renderedHtml, "render markdown text").toLooseEqual("text2!");
  });

  test("Survey Markdown - question title", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("Page 1");
    var q1 = <Question>page.addNewQuestion("text", "q1");
    var q2 = <Question>page.addNewQuestion("text", "q2");
    survey.onTextMarkdown.add(function (survey, options) {
      if (options.name == "commentText") return;
      expect(options.name, "question title markdown preprocessing").toLooseEqual("title");
      if (options.text.indexOf("markdown") > -1)
        options.html = options.text.replace("markdown", "!");
    });
    q2.value = "value2";
    var loc = q1.locTitle;
    q1.title = "title1, q2.value is {q2}markdown";
    expect(q1.fullTitle, "question.title, use markdown and text preprocessing").toLooseEqual("title1, q2.value is value2!");
    expect(loc.renderedHtml, "question.locTitle.renderedHtml, use markdown and text preprocessing").toLooseEqual("title1, q2.value is value2!");
    q1.isRequired = true;
    expect(q1.requiredMark, "question.title requiredMark is not empty").toLooseEqual("*");
  });

  test("Survey Markdown - question title, if title is empty and question is required", () => {
    var survey = new SurveyModel();
    survey.setValue("q1", "q1-Value");
    var page = survey.addNewPage("Page 1");
    var q1 = <Question>page.addNewQuestion("text", "q1");
    var q2 = <Question>page.addNewQuestion("text", "q2");
    var q3 = <Question>page.addNewQuestion("text", "q3");
    survey.onTextMarkdown.add((survey, options) => {
      expect(options.name, "question title markdown preprocessing").toLooseEqual("title");
      options.html = options.text + "!";
    });
    q1.isRequired = true;
    q2.isRequired = true;
    q2.title = "Q2";
    q3.isRequired = true;
    q3.title = "*Q3 {q1}";

    expect(q1.locTitle.renderedHtml, "q1.title, use markdown for requried text, title is empty").toLooseEqual("q1!");
    expect(q1.locTitle.hasHtml, "q1.title, use markdown for requried text - hasHtml, title is empty").toLooseEqual(true);
    expect(q2.locTitle.renderedHtml, "q2.title, use markdown for requried text, has title").toLooseEqual("Q2!");
    expect(q2.locTitle.hasHtml, "q2.title, use markdown for requried text - hasHtml, has title").toLooseEqual(true);
    expect(q3.locTitle.renderedHtml, "q3.title, use markdown for requried text and inside title and process text").toLooseEqual("*Q3 q1-Value!");
    expect(q3.locTitle.hasHtml, "q3.title, use markdown for requried text and inside title and process text, hasHtml").toLooseEqual(true);
  });
  test("Survey Markdown - question title calls count", () => {
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
      expect(q1.title).toLooseEqual("q1");
      expect(q1.locTitle.renderedHtml).toLooseEqual("q1!");
      expect(q2.title).toLooseEqual("q2");
      expect(q2.locTitle.renderedHtml).toLooseEqual("q2");
    }
    expect(counter, "onTextMarkdown is called two times").toLooseEqual(2);
  });
  test("Survey Markdown + processed text", () => {
    const survey = new SurveyModel();
    const page = survey.addNewPage("Page1");
    const q1 = <Question>page.addNewQuestion("text", "q1");
    q1.title = "Q1 {val}";
    survey.setValue("val", "test1");
    survey.onTextMarkdown.add((survey, options) => {
      options.html = options.text + "!";
    });
    expect(q1.locTitle.renderedHtml, "Initial value").toLooseEqual("Q1 test1!");
    survey.setValue("val", "test2");
    expect(q1.locTitle.renderedHtml, "Change the value").toLooseEqual("Q1 test2!");
  });
  test("Survey Markdown + design model", () => {
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
    expect(q1.locTitle.renderedHtml, "page1").toLooseEqual("Q1!");
    expect(q2.locTitle.renderedHtml, "page2").toLooseEqual("Q2!");
  });

  test("required question title test", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("Page 1");
    var q1 = <Question>page.addNewQuestion("text", "q1");
    q1.title = "title1";
    expect(q1.locTitle.renderedHtml, "Just title").toLooseEqual("title1");
    q1.isRequired = true;
    expect(q1.locTitle.renderedHtml, "title + required").toLooseEqual("title1");
    expect(q1.requiredMark, "title + required").toLooseEqual("*");
    expect(q1.title, "We do no have required").toLooseEqual("title1");
  });

  test("Survey Markdown - page title", () => {
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
    expect(page.processedTitle, "page.processedTitle, use markdown and text preprocessing").toLooseEqual("Page 1!, q1 is value1");
    expect(loc.renderedHtml, "page.locTitle.renderedHtml, use markdown and text preprocessing").toLooseEqual("Page 1!, q1 is value1");
  });

  test("Survey Markdown - page title + showPageNumbers = true", () => {
    var survey = new SurveyModel();
    survey.showPageNumbers = true;
    var page = survey.addNewPage("Page 1");
    var q1 = <Question>page.addNewQuestion("text", "q1");
    survey.onTextMarkdown.add(function (survey, options) {
      if (options.name == "commentText") return;
      expect(options.name, "page title markdown preprocessing").toLooseEqual("title");
      if (options.text.indexOf("markdown") > -1)
        options.html = options.text.replace("markdown", "!");
    });
    q1.value = "value1";
    var loc = page.locTitle;
    page.title = "Page 1markdown, q1 is {q1}";
    expect(loc.renderedHtml, "page.locTitle.renderedHtml, use markdown and text preprocessing").toLooseEqual("Page 1!, q1 is value1");
  });

  test("Survey Markdown and text processing - dropdownmatrix.columns", () => {
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
    expect(loc1.renderedHtml, "render column name").toLooseEqual("col1");
    expect(loc2.renderedHtml, "render column text").toLooseEqual("colText2-newvalue-");
    expect(loc3.renderedHtml, "render column text as markdown").toLooseEqual("colText3-newvalue-!");
  });

  test("Survey Markdown and text processing - nmatrix.rows", () => {
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
    expect(loc1.renderedHtml, "render column name").toLooseEqual("row1");
    expect(loc2.renderedHtml, "render column text + text processing").toLooseEqual("rowText2-newvalue-");
    expect(loc3.renderedHtml, "render column text as markdown + text processing").toLooseEqual("rowText3-newvalue-!");
  });

  test("html.html property, text preprocessing", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("page1");
    var html = <QuestionHtmlModel>page.addNewQuestion("html", "q1");
    survey.setVariable("var1", 5);
    html.html = "val: {var1}";
    expect(html.locHtml.renderedHtml, "initial value is set").toLooseEqual("val: 5");
    survey.setVariable("var1", 10);
    expect(html.locHtml.renderedHtml, "value is changed").toLooseEqual("val: 10");
  });

  test("Kebab-case variable in expressions - https://surveyjs.answerdesk.io/ticket/details/T2211", () => {
    var survey = new SurveyModel();
    survey.setVariable("testVariable", false);
    expect(survey.runCondition("{testVariable} = false"), "Should be true").toBeTruthy();
  });

  test("Survey Markdown - survey title", () => {
    var survey = new SurveyModel();
    survey.onTextMarkdown.add(function (survey, options) {
      expect(options.name, "survey title markdown preprocessing").toLooseEqual("title");
      if (options.text.indexOf("markdown") > -1)
        options.html = options.text.replace("markdown", "!");
    });
    survey.setValue("q1", "value1");
    var loc = survey.locTitle;
    survey.title = "Surveymarkdown, q1 is {q1}";
    expect(survey.processedTitle, "survey.processedTitle, use markdown and text preprocessing").toLooseEqual("Survey!, q1 is value1");
    expect(loc.renderedHtml, "survey.locTitle.renderedHtml, use markdown and text preprocessing").toLooseEqual("Survey!, q1 is value1");
  });

  test("Survey Markdown - question.validators", () => {
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
    page.validate(true);
    expect(validator.locText.renderedHtml, "Markdown is working").toLooseEqual("error!");
    expect(question1.errors[0].locText.renderedHtml, "Markdown in validators is working").toLooseEqual("error!");
    expect(question2.errors[0].locText.renderedHtml, "Markdown for event is working").toLooseEqual("!");
  });

  test("QuestionRadiogroupModel clears comment - issue #390", () => {
    var question = new QuestionRadiogroupModel("q1");
    question.showCommentArea = true;
    question.comment = "comment text";
    question.clearUnusedValues();
    expect(question.comment).toLooseEqual("comment text");
  });

  test("survey.clearIncorrectValues", () => {
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
    expect(survey.data, "The default value is set").toEqualValues({ question1: "item3" });
    survey.clearIncorrectValues();
    expect(survey.data, "The default value is removed").toEqualValues({});
  });

  test("survey.clearIncorrectValues with parameter removeNonExisingKeys", () => {
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
    expect(survey.data, "values set correctly").toEqualValues({ q1: "v1", q2: "v2", q3: "v3" });
    survey.clearIncorrectValues(true);
    expect(survey.data, "Remove q3 and val3 keys").toEqualValues({ q1: "v1", q2: "v2" });
  });

  test("Create questions from elements array - issue #395", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "comment",
          name: "suggestions",
          title: "What would make you more satisfied with the Product?",
        },
      ],
    });
    expect(survey.pages.length).toLooseEqual(1);
    expect(survey.pages[0].questions.length).toLooseEqual(1);
    expect(survey.pages[0].questions[0].name).toLooseEqual("suggestions");
  });

  test("onMatrixRowAdded", () => {
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
    expect(q1.rowCount, "there are 3 rows").toLooseEqual(3);
    expect(q1.value[2]["col1"], "get value from previous").toLooseEqual(2);
  });
  test("onMatrixRowAdded + copyDefaultValueFromLastEntry", () => {
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
    expect(visibleRowsCount, "There are 3 visibleRows in event").toLooseEqual(3);
    expect(q1.rowCount, "there are 3 rows").toLooseEqual(3);
    expect(q1.value[2]["col2"], "get value from previous").toLooseEqual("2");
    expect(q1.value[2]["col1"], "clear value for this column").toBeFalsy();
  });

  test("onMatrixBeforeRowAdded -> obsolete", () => {
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
    expect(q1.rowCount, "there is one row").toLooseEqual(1);
    q1.addRow();
    expect(q1.rowCount, "there is stil one row because of 'onMatrixBeforeRowAdded' and 'canAddRow'").toLooseEqual(1);
  });
  test("onMatrixRowAdding -> replace onMatrixBeforeRowAdded", () => {
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
    expect(q1.rowCount, "there is one row").toLooseEqual(1);
    q1.addRow();
    expect(q1.rowCount, "there is stil one row because of 'onMatrixBeforeRowAdded' and 'canAddRow'").toLooseEqual(1);
  });
  test("onMatrixRowAdding, support options.canAddRow & options.allow", () => {
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
    expect(matrix.rowCount, "rowCount=0, #1").toLooseEqual(0);
    allow = true;
    matrix.addRow();
    expect(matrix.rowCount, "rowCount=1, #2").toLooseEqual(1);
    allow = undefined;
    canAddRow = true;
    matrix.addRow();
    expect(matrix.rowCount, "rowCount=2, #3").toLooseEqual(2);
    canAddRow = undefined;

    matrix.allowAddRows = true;
    matrix.addRow();
    expect(matrix.rowCount, "rowCount=3, #4").toLooseEqual(3);
    allow = undefined;
    canAddRow = true;
    matrix.addRow();
    expect(matrix.rowCount, "rowCount=4, #5").toLooseEqual(4);
    canAddRow = undefined;
    matrix.addRow();
    expect(matrix.rowCount, "rowCount=5, #6").toLooseEqual(5);

    allow = undefined;
    canAddRow = false;
    matrix.addRow();
    expect(matrix.rowCount, "rowCount=5, #7").toLooseEqual(5);
    canAddRow = undefined;
    allow = false;
    matrix.addRow();
    expect(matrix.rowCount, "rowCount=5, #8").toLooseEqual(5);
  });

  test("onMatrixRowRemoved. Added a case for Bug#2557", () => {
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
    expect(q1.rowCount, "there are two rows").toLooseEqual(2);
    expect(removedRowIndex, "onMatrixRowRemoved event has been fired correctly").toLooseEqual(1);
    expect(visibleRowsCount, "There should be two visible rows in event").toLooseEqual(2);
  });

  test("onUpdatePanelCssClasses keeps original css - https://github.com/surveyjs/surveyjs/issues/1333", () => {

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
    expect(css1.panel.container, "panel1 custom class").toLooseEqual("hereIam");
    var css2 = panel2.cssClasses;
    expect(css2.panel.container, "keep original panel class").toLooseEqual("sv_p_container");
    expect(css.panel.container, "keep original main css class").toLooseEqual("sv_p_container");
  });

  test("css sets correctly if src key is object and dest key is string", () => {
    var survey = new SurveyModel();
    survey.css = { text: { root: "custom_class" } };
    expect(survey.css["text"].root).toLooseEqual("custom_class");
  });

  test("check setCss method without merge", () => {
    var survey = new SurveyModel();
    const newFullCss = {
      navigation: {}
    };
    survey.setCss(newFullCss, false);
    expect(survey.css).toLooseEqual(newFullCss);
  });

  test("Apply css for questions on start page", () => {
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
    expect(q2.cssRoot, "Appy css for the first page").toLooseEqual("custom_class");
    expect(q1.cssRoot, "Appy css for the start page").toLooseEqual("custom_class");
  });

  test("onUpdatePageCssClasses is raised", () => {
    var survey = new SurveyModel();
    var flag = false;
    survey.onUpdatePageCssClasses.add(function (survey, options) {
      flag = true;
    });
    var page = survey.addNewPage("page1");
    page.cssClasses;
    expect(flag, "event is raised").toBeTruthy();
  });

  test("Survey Elements css", () => {
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
    expect(textCss.root, "text question root class").toLooseEqual("sv_q_text_root");
    expect(textCss.title, "text question title class").toLooseEqual("sv_q_title");
    expect(checkCss.root, "checkbox question root class").toLooseEqual("sv_qcbc sv_qcbx");
    expect(checkCss.item, "checkbox question title class").toLooseEqual("sv_q_checkbox");
    expect(checkCss.newItem, "checkbox question onUpdateQuestionCssClasses event called correctly").toLooseEqual("hereIam");
    textQuestion.isRequired = true;
    textCss = textQuestion.cssClasses;
    expect(textCss.title, "text question title class").toLooseEqual("sv_q_title required");
    css.question.titleRequired = "";
  });

  test("Question cssRoot", () => {
    var json = {
      elements: [
        { type: "text", name: "q1" },
        { type: "checkbox", name: "q2" },
      ],
    };
    var survey = new SurveyModel(json);
    setOldTheme(survey);
    expect(survey.getQuestionByName("q1").cssRoot, "text question root class - original").toLooseEqual("sv_q sv_qstn");
    expect(survey.getQuestionByName("q2").cssRoot, "checkbox question root class - original").toLooseEqual("sv_q sv_qstn");

    survey = new SurveyModel(json);
    setOldTheme(survey);
    survey.onUpdateQuestionCssClasses.add(function (survey, options) {
      if (options.question.getType() == "checkbox") {
        options.cssClasses.mainRoot = "testMainRoot";
        options.cssClasses.root = "testRoot";
      }
    });

    expect(survey.getQuestionByName("q1").cssRoot, "text question root class").toLooseEqual("sv_q sv_qstn");
    expect(survey.getQuestionByName("q2").cssRoot, "checkbox question root class").toLooseEqual("testMainRoot");
  });
  test("Question onUpdateQuestionCssClasses, modify question props", () => {
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
    expect(q1.cssClasses, "cssClasses is created").toBeTruthy();
    expect(q1.titleLocation, "titleLocation is changed").toLooseEqual("left");
  });

  test("Use send data to custom server", () => {
    var survey = twoPageSimplestSurvey();
    var onCompleteOptions = null;
    survey.onComplete.add(function (sender, options) {
      onCompleteOptions = options;
      options.showSaveInProgress();
    });
    survey.data = { question1: "sss" };
    expect(survey.completedState, "The complete state is empty").toLooseEqual("");
    survey.doComplete();
    expect(survey.completedState, "The complete state is saving").toLooseEqual("saving");
    onCompleteOptions.showSaveError();
    expect(survey.completedState, "The complete state is error").toLooseEqual("error");
    onCompleteOptions.showSaveSuccess();
    expect(survey.completedState, "The complete state is success").toLooseEqual("success");
  });

  test("Notify the user about the status of sending data to custom server", () => {
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
      options.showSaveInProgress();
    });
    survey.data = { question1: "sss" };
    expect(survey.completedState, "The complete state is empty").toLooseEqual("");
    expect(notifierLog).toLooseEqual("");
    notifierLog = "";

    survey.doComplete();
    expect(survey.completedState, "The complete state is saving").toLooseEqual("saving");
    expect(notifierLog).toLooseEqual("The results are being saved on the server... - saving");
    notifierLog = "";

    onCompleteOptions?.showDataSavingError();
    expect(survey.completedState, "The complete state is error").toLooseEqual("error");
    expect(notifierLog).toLooseEqual("An error occurred and we could not save the results. - error");
    notifierLog = "";

    onCompleteOptions?.showDataSavingSuccess();
    expect(survey.completedState, "The complete state is success").toLooseEqual("success");
    expect(notifierLog).toLooseEqual("The results were saved successfully! - success");
    notifierLog = "";
  });

  test("Notifier button", () => {
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
      options.showSaveInProgress();
    });
    survey.data = { question1: "sss" };
    expect(survey.completedState, "The complete state is empty").toLooseEqual("");
    expect(notifierLog).toLooseEqual("");
    notifierLog = "";

    survey.doComplete();
    expect(survey.completedState, "The complete state is saving").toLooseEqual("saving");
    expect(notifierLog).toLooseEqual("The results are being saved on the server... - saving");
    notifierLog = "";

    onCompleteOptions?.showSaveError();
    expect(survey.completedState, "The complete state is error").toLooseEqual("error");
    expect(notifierLog).toLooseEqual("An error occurred and we could not save the results. - error");
    notifierLog = "";

    onCompleteOptions?.showSaveSuccess();
    expect(survey.completedState, "The complete state is success").toLooseEqual("success");
    expect(notifierLog).toLooseEqual("The results were saved successfully! - success");
    notifierLog = "";
  });

  test("Pass custom properties to cell question", () => {
    Serializer.addProperty("matrixdropdowncolumn", {
      name: "renderAs",
      default: "default",
      choices: ["default", "select2tagbox"],
    });
    var survey = new SurveyModel({
      elements: [
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
    expect(q1.visibleRows[0].cells[0].question["renderAs"], "custom property should be passed to the question").toLooseEqual("select2tagbox");
  });

  test("Pass text as survey json", () => {
    var survey = new SurveyModel(
      '{ "elements": [ {"type": "text", "name": "q1"}]}'
    );
    var q1 = survey.getQuestionByName("q1");
    expect(q1.name, "The survey created from the string").toLooseEqual("q1");
  });

  test("Clear value if empty array is set, Bug #608", () => {
    var survey = new SurveyModel();
    survey.setValue("q1", ["1"]);
    expect(survey.data, "The array is set").toEqualValues({ q1: ["1"] });
    survey.setValue("q1", []);
    expect(survey.data, "The value with empty array is removed").toEqualValues({});
  });

  test("Question description and text processing, variable, Bug #632", () => {
    var survey = new SurveyModel();
    survey.addNewPage("p1");
    var question = <Question>survey.pages[0].addNewQuestion("text", "q1");
    question.title = "{var1}";
    question.description = "{var1}";
    survey.setVariable("var1", "It is var1");
    expect(question.locTitle.renderedHtml, "Title: Variable is applied").toLooseEqual("It is var1");
    expect(question.locDescription.renderedHtml, "Decription: Variable is applied").toLooseEqual("It is var1");
  });

  test("Set defaultValue on loading from JSON, on adding into survey and on setting defaultValue property", () => {
    var survey = new SurveyModel({
      elements: [{ type: "text", name: "q1", defaultValue: "your_name" }],
    });
    expect(survey.getValue("q1"), "on loading from JSON").toLooseEqual("your_name");
    var q2 = new QuestionTextModel("q2");
    q2.defaultValue = "my_name";
    survey.pages[0].addElement(q2);
    expect(survey.getValue("q2"), "on adding question into suvey").toLooseEqual("my_name");
    var q3 = <Question>survey.pages[0].addNewQuestion("text", "q3");
    q3.defaultValue = "her_name";
    expect(survey.getValue("q3"), "on setting the default value").toLooseEqual("her_name");
    q3.defaultValue = "his_name";
    expect(survey.getValue("q3"), "the value doesn't changed, since it was not empty").toLooseEqual("her_name");
  });
  test("Set defaultValue in design-time", () => {
    var survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.addNewPage("p1");
    var q1 = new QuestionTextModel("q1");
    survey.pages[0].addElement(q1);
    expect(q1.defaultValue, "There is no default value").toBeFalsy();
    q1.defaultValue = "my_name";
    expect(survey.getValue("q1"), "the value is set").toLooseEqual("my_name");
    q1.defaultValue = null;
    expect(survey.getValue("q1"), "the value is reset").toBeFalsy();
  });

  test("defaultValue + survey.clear()", () => {
    var json = {
      elements: [{ type: "text", name: "q1", defaultValue: "defValue" }],
    };
    var survey = new SurveyModel(json);
    expect(survey.getValue("q1"), "the value is set").toLooseEqual("defValue");
    survey.doComplete();
    survey.clear(true);
    expect(survey.getValue("q1"), "the value is set after clear, #1163").toLooseEqual("defValue");
  });

  test("defaultValue + survey.clear() + 'other'", () => {
    var json = {
      elements: [
        {
          type: "radiogroup",
          name: "q1",
          defaultValue: "other",
          choices: [1],
          showOtherItem: true,
        },
        {
          type: "checkbox",
          name: "q2",
          defaultValue: ["other"],
          choices: [1],
          showOtherItem: true,
        },
      ],
    };
    var survey = new SurveyModel(json);
    expect(survey.data, "check initial state").toEqualValues({ q1: "other", q2: ["other"] });
    survey.getQuestionByName("q1").otherValue = "comment1";
    survey.getQuestionByName("q2").otherValue = "comment2";
    expect(survey.getQuestionByName("q1").getPropertyValue("comment")).toLooseEqual("comment1");
    survey.clear();
    expect(survey.getQuestionByName("q1").getPropertyValue("comment")).toLooseEqual("");
    expect(survey.data, "clear comments").toEqualValues({ q1: "other", q2: ["other"] });
  });

  test("Dublicate errors", () => {
    var survey = new SurveyModel();
    survey.addNewPage("p1");
    var q = <QuestionTextModel>survey.pages[0].addNewQuestion("text", "q1");
    q.validators.push(new NumericValidator(0, 25));
    var valueChangedCounter = 0;
    survey.onValueChanged.add(function (s, options) {
      valueChangedCounter++;
      options.question.validate(true);
    });
    expect(q.errors.length, "There is no errors so far").toLooseEqual(0);
    q.value = "26";
    expect(q.errors.length, "There should be one error").toLooseEqual(1);
    expect(valueChangedCounter, "on value changed called one time").toLooseEqual(1);
    expect(q.value, "the value is 26").toLooseEqual(26);
  });

  test("Auto generate names for question/panel/page", () => {
    var survey = new SurveyModel();
    var page1 = survey.addNewPage();
    expect(survey.pages[0].name, "the first name is page1").toLooseEqual("page1");
    var page2 = survey.addNewPage();
    expect(survey.pages[1].name, "the second name is page2").toLooseEqual("page2");
    survey.pages[0].name = "newpage";
    var page3 = survey.addNewPage();
    expect(survey.pages[2].name, "the third name is page1 again").toLooseEqual("page1");

    page1.addNewQuestion("text");
    page1.addNewQuestion("text");
    page3.addNewQuestion("text");
    expect(survey.getAllQuestions()[0].name, "the first name is question1").toLooseEqual("question1");
    expect(survey.getAllQuestions()[1].name, "the second name is question2").toLooseEqual("question2");
    expect(survey.getAllQuestions()[2].name, "the third name is question3").toLooseEqual("question3");

    var panel1 = page1.addNewPanel();
    var panel2 = panel1.addNewPanel();
    var panel3 = page2.addNewPanel();
    expect(panel1.name, "the first name is panel1").toLooseEqual("panel1");
    expect(panel2.name, "the second name is panel2").toLooseEqual("panel2");
    expect(panel3.name, "the third name is panel3").toLooseEqual("panel3");
  });

  test("clearInvisibleValues", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage();
    var question = <Question>page.addNewQuestion("text");
    expect(survey.clearInvisibleValues, "the default value").toLooseEqual("onComplete");
    survey.clearInvisibleValues = true;
    expect(survey.clearInvisibleValues, "true is onComplete").toLooseEqual("onComplete");
    survey.clearInvisibleValues = false;
    expect(survey.clearInvisibleValues, "false is none").toLooseEqual("none");
    question.value = "val";
    question.visible = false;
    expect(question.value, "none - nothing happened").toLooseEqual("val");
    question.visible = true;
    survey.clearInvisibleValues = "onHidden";
    question.visible = false;
    expect(question.value, "onHidden - clear the value").toBeFalsy();
    question.visible = true;
    question.value = "val";
    survey.clearInvisibleValues = "onComplete";
    question.visible = false;
    expect(question.value, "onComplete - nothing happened").toLooseEqual("val");
    survey.doComplete();
    expect(question.value, "onComplete - clear on complete").toBeFalsy();
  });
  test("clearInvisibleValues=onHidden and invisiblePages, #964", () => {
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
    expect(survey.data, "Remove value for invisible question q2").toEqualValues({ q1: "val1" });
  });
  test("required text can be empty: Bug #693", () => {
    var survey = new SurveyModel();
    expect(survey.requiredMark, "The default value is '*'").toLooseEqual("*");
    survey.requiredMark = "";
    expect(survey.requiredMark, "The value is empty string").toLooseEqual("");
    survey.requiredMark = null;
    expect(survey.requiredMark, "The value is again default").toLooseEqual("*");
  });
  test("Set 0 value into survey.data", () => {
    var survey = new SurveyModel();
    var p = survey.addNewPage();
    var q = <QuestionTextModel>p.addNewQuestion("text", "q1");
    survey.data = { q1: 0 };
    expect(q.value, "0 value is set").toLooseEqual(0);
  });
  test("Parent property in question", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("page");
    var panel = page.addNewPanel("panel");
    var panel2 = panel.addNewPanel("panel2");
    var q = panel2.addNewQuestion("text");
    expect(q.parent.name).toLooseEqual("panel2");
    panel2.removeElement(q);
    expect(q.parent).toBeFalsy();
    panel.addElement(q);
    expect(q.parent.name).toLooseEqual("panel");
  });
  test("Remove question from it's previous container before adding to a new one", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("page");
    var panel1 = page.addNewPanel("panel1");
    var panel2 = page.addNewPanel("panel2");
    var q = panel1.addNewQuestion("text");
    expect(q.parent.name).toLooseEqual("panel1");
    expect(panel1.elements.length, "There is one element").toLooseEqual(1);
    panel2.addElement(q);
    expect(q.parent.name).toLooseEqual("panel2");
    expect(panel2.elements.length, "There is one element in panel2").toLooseEqual(1);
    expect(panel1.elements.length, "There is no elements in panel1").toLooseEqual(0);
  });
  test("Page property in question", () => {
    var survey = new SurveyModel();
    var page1 = survey.addNewPage("p1");
    var page2 = survey.addNewPage("p2");
    var panel = page1.addNewPanel("panel");
    var panel2 = panel.addNewPanel("panel2");
    var q = panel2.addNewQuestion("text");
    expect(page1.questions.indexOf(q) > -1, "The question is in the first page").toBeTruthy();
    expect(q.page.name, "The page is set correctly").toLooseEqual(page1.name);
    q.page = page2;
    expect(page2.questions.indexOf(q) > -1, "The question is in the second page").toBeTruthy();
    expect(page1.questions.indexOf(q) > -1, "The question is not in the first page").toBeFalsy();
    expect(q.page.name, "The page was changed").toLooseEqual(page2.name);
  });

  test("Define questionTitleLocation on Panel/Page level", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("page");
    var panel = page.addNewPanel("panel");
    var panel2 = panel.addNewPanel("panel2");
    var q = <Question>panel2.addNewQuestion("text");
    expect(q.getTitleLocation(), "get from survey").toLooseEqual("top");
    panel2.questionTitleLocation = "bottom";
    expect(q.getTitleLocation(), "get from panel 2").toLooseEqual("bottom");
    panel2.questionTitleLocation = "default";
    expect(q.getTitleLocation(), "get from survey").toLooseEqual("top");
    panel.questionTitleLocation = "bottom";
    expect(q.getTitleLocation(), "get from panel").toLooseEqual("bottom");
    panel.questionTitleLocation = "default";
    expect(q.getTitleLocation(), "get from survey").toLooseEqual("top");
    page.questionTitleLocation = "bottom";
    expect(q.getTitleLocation(), "get from page").toLooseEqual("bottom");
    page.questionTitleLocation = "default";
    expect(q.getTitleLocation(), "get from survey").toLooseEqual("top");
    q.titleLocation = "bottom";
    expect(q.getTitleLocation(), "get from question").toLooseEqual("bottom");
    q.titleLocation = "default";
    expect(q.getTitleLocation(), "get from survey again").toLooseEqual("top");
  });

  test("Define questionTitleWidth on Panel/Page level", () => {
    const survey = new SurveyModel();
    const page = survey.addNewPage("page");
    const panel = page.addNewPanel("panel");
    const panel2 = panel.addNewPanel("panel2");
    const q = <Question>panel2.addNewQuestion("text");
    page.questionTitleLocation = "left";

    expect(q.titleWidth, "init").toLooseEqual(undefined);
    page.questionTitleWidth = "500px";
    expect(q.titleWidth, "get from page").toLooseEqual("500px");

    panel.questionTitleWidth = "50%";
    expect(q.titleWidth, "get from panel").toLooseEqual("50%");

    panel2.questionTitleWidth = "200px";
    expect(q.titleWidth, "get from panel2").toLooseEqual("200px");

    panel2.questionTitleWidth = "300";
    expect(q.titleWidth, "titleWidth with px").toLooseEqual("300px");

    q.titleLocation = "top";
    expect(q.titleWidth, "titleWidth available if titleLocation is left").toLooseEqual(undefined);
  });

  test("availableQuestionTitleWidth on Panel/Page", () => {
    const survey = new SurveyModel();
    const page = survey.addNewPage("page");
    const panel = page.addNewPanel("panel");
    const panel2 = panel.addNewPanel("panel2");
    const q = <Question>panel.addNewQuestion("text");

    expect(page.availableQuestionTitleWidth(), "page").toLooseEqual(false);
    expect(panel.availableQuestionTitleWidth(), "panel1").toLooseEqual(false);
    expect(panel2.availableQuestionTitleWidth(), "panel2").toLooseEqual(false);

    q.titleLocation = "left";
    expect(page.availableQuestionTitleWidth(), "page").toLooseEqual(true);
    expect(panel.availableQuestionTitleWidth(), "panel1").toLooseEqual(true);
    expect(panel2.availableQuestionTitleWidth(), "panel2").toLooseEqual(false);

    q.titleLocation = "top";
    page.questionTitleLocation = "left";
    expect(page.availableQuestionTitleWidth(), "page").toLooseEqual(true);
    expect(panel.availableQuestionTitleWidth(), "panel1").toLooseEqual(true);
    expect(panel2.availableQuestionTitleWidth(), "panel2").toLooseEqual(true);
  });

  test("Question property.page getChoices", () => {
    var property = Serializer.findProperty("questionbase", "page");
    expect(property, "page property is here").toBeTruthy();
    var survey = new SurveyModel();
    survey.addNewPage("p1");
    survey.addNewPage("p2");
    survey.addNewPage("p3");
    var q = survey.pages[0].addNewQuestion("text", "q1");
    expect(property.getChoices(q).length, "There are 3 pages").toLooseEqual(3);
  });

  test("firstPageIsStartPage = true", () => {
    var survey = new SurveyModel();
    for (var i = 0; i < 3; i++) {
      let page = survey.addNewPage("p" + i + 1);
      page.addNewQuestion("text");
    }
    expect(survey.visiblePages.length, "There are 3 visible pages").toLooseEqual(3);
    expect(survey.pages[0].isVisible, "The first page is visible").toLooseEqual(true);
    expect(survey.state, "Survey is running").toLooseEqual("running");
    survey.firstPageIsStartPage = true;
    expect(survey.pages[0].isVisible, "The first page is visible").toLooseEqual(true);
    expect(survey.pages[0].isStarted, "The first page is started").toLooseEqual(true);
    expect(survey.visiblePages.length, "There are 2 visible pages").toLooseEqual(2);
    expect(survey.state, "Survey is showing the start page").toLooseEqual("starting");
    survey.firstPageIsStartPage = false;
    expect(survey.visiblePages.length, "There are 3 visible pages").toLooseEqual(3);
    expect(survey.pages[0].isVisible, "The first page is visible").toLooseEqual(true);
    expect(survey.state, "Survey is running").toLooseEqual("running");
    survey.firstPageIsStartPage = true;
  });

  test("firstPageIsStartPage = true, load from JSON, the flow", () => {
    var json = {
      firstPageIsStartPage: true,
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
    expect(survey.pages[0].isVisible, "The first page is visible").toLooseEqual(true);
    expect(survey.pages[0].isStarted, "The first page is visible").toLooseEqual(true);
    expect(survey.visiblePages.length, "There is one visible page").toLooseEqual(1);
    expect(survey.state, "Survey is showing the start page").toLooseEqual("starting");
    expect(startCounter, "onStarted event was not called yet").toLooseEqual(0);
    survey.start();
    expect(startCounter, "onStarted event was called one time").toLooseEqual(1);
    expect(survey.state, "Survey is running").toLooseEqual("running");
    expect(survey.currentPage.name, "The page1 is current").toLooseEqual("page1");
    survey.prevPage();
    expect(survey.currentPage.name, "Could not come back to the start page").toLooseEqual("page1");
    expect(survey.state, "Survey is running").toLooseEqual("running");
    survey.doComplete();
    survey.clear();
    expect(survey.state, "Survey is showing the start page").toLooseEqual("starting");
    expect(startCounter, "onStarted event was called one time total").toLooseEqual(1);
  });

  test("question.valueName property", () => {
    var survey = new SurveyModel();
    survey.data = { val: "val1" };
    var page = survey.addNewPage("p1");
    var question = <Question>page.addNewQuestion("text", "q1");
    question.valueName = "val";
    expect(question.value, "The value is taken by using valueName").toLooseEqual("val1");
  });
  test("pre process title, with question.valueName", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("p1");
    var question = <Question>page.addNewQuestion("text", "q1");
    question.valueName = "name";
    survey.data = { name: "John" };
    survey.title = "Hello {name}";
    expect(survey.processedTitle, "process survey title correctly").toLooseEqual("Hello John");
  });

  test("Survey text preprocessing, dropdown/checkbox/radiogroup, with question.valueName", () => {
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
    expect(q3.locTitle.renderedHtml, "There is no values").toLooseEqual("-");
    q1.value = 1;
    expect(q3.locTitle.renderedHtml, "Drop down value is set").toLooseEqual("Item 1-");
    q2.value = [3, 4];
    expect(q3.locTitle.renderedHtml, "Drop down value is set").toLooseEqual("Item 1-Item 3, Item 4");
  });

  test("Survey show several pages as one", () => {
    var survey = twoPageSimplestSurvey();
    survey.isSinglePage = true;
    expect(survey.visiblePages.length, "You have one page").toLooseEqual(1);
    var page = survey.visiblePages[0];
    expect(page.elements.length, "two pages has converted into two panels").toLooseEqual(2);
    expect(page.questions.length, "there are 4 questions on the page").toLooseEqual(4);
  });

  test("Survey show several pages as one, set and reset", () => {
    var survey = twoPageSimplestSurvey();
    survey.isSinglePage = true;
    survey.isSinglePage = false;
    expect(survey.visiblePages.length, "We have still two pages").toLooseEqual(2);
    var page = survey.visiblePages[0];
    expect(page.questions.length, "there are 2 questions on the page").toLooseEqual(2);
    survey.isSinglePage = true;
    expect(survey.visiblePages.length, "Single page").toLooseEqual(1);
    survey.setDesignMode(true);
    expect(survey.visiblePages.length, "We have still two pages again").toLooseEqual(2);
  });

  test("Survey show several pages as one + firstPageIsStartPage", () => {
    var survey = twoPageSimplestSurvey();
    var thirdPage = new PageModel("third");
    thirdPage.addNewQuestion("text", "q1");
    thirdPage.addNewQuestion("text", "q2");
    survey.pages.push(thirdPage);
    survey.firstPageIsStartPage = true;
    survey.isSinglePage = true;
    expect(survey.pages.length, "We have two pages here").toLooseEqual(3);
    expect(survey.visiblePages.length, "You have one page").toLooseEqual(1);
    var page = survey.visiblePages[0];
    expect(page.elements.length, "two pages has converted into two panels").toLooseEqual(2);
    expect(page.questions.length, "there are 4 questions on the page").toLooseEqual(4);
  });

  test("Survey.isSinglePage = true, question.visibleIndex set incorrectly, bug#925", () => {
    var json = {
      showQuestionNumbers: true,
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
    expect((<Question>survey.getQuestionByName("InvestorType")).visibleIndex, "The first question").toLooseEqual(0);
    survey.setValue("InvestorType", "entity");
    var q3 = survey.getQuestionByName("q3");
    expect((<Question>survey.getQuestionByName("q1")).visibleIndex, "The second question").toLooseEqual(1);
    expect((<Question>survey.getQuestionByName("q2")).visibleIndex, "The third question is invisible because of panel").toLooseEqual(-1);
    expect((<Question>survey.getQuestionByName("q3")).visibleIndex, "The forth question").toLooseEqual(2);
  });

  test("Survey.isSinglePage = true, the last page doesn't added, bug#1009", () => {
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
    expect(survey.currentPage.questions.length, "There are 3 elements on the single page").toLooseEqual(3);
    expect(survey.currentPage.rows.length, "There are 3 rows on the page").toLooseEqual(3);
    expect(survey.currentPage.rows[2].visible, "The last row is visible").toLooseEqual(true);
  });

  test("isSinglePage = true and survey.showPageTitles = false, Bug#1914", () => {
    const survey = twoPageSimplestSurvey();
    survey.pages[0].title = "Page 1";
    survey.pages[1].title = "Page 2";
    survey.showPageTitles = false;
    survey.isSinglePage = true;
    var panels = survey.currentPage.elements;
    expect(panels.length, "There are two panels").toLooseEqual(2);
    expect((<PanelModel>panels[0]).hasTitle, "Panel1 title is hidden").toLooseEqual(false);
    expect((<PanelModel>panels[1]).hasTitle, "Panel2 title is hidden").toLooseEqual(false);
  });
  test("check synhronization properties isSinglePage and questionsOnPageMode", () => {
    var survey = twoPageSimplestSurvey();
    expect(survey.isSinglePage, "isSinglePage is false by default").toLooseEqual(false);
    expect(survey.questionsOnPageMode, "questionsOnPageMode is 'standard' by default").toLooseEqual("standard");
    survey.isSinglePage = true;
    expect(survey.isSinglePage, "set isSinglePage to true").toLooseEqual(true);
    expect(survey.questionsOnPageMode, "questionsOnPageMode is 'singlePage' on setting isSinglePage to true").toLooseEqual("singlePage");
    survey.isSinglePage = false;
    expect(survey.isSinglePage, "set isSinglePage to false").toLooseEqual(false);
    expect(survey.questionsOnPageMode, "questionsOnPageMode is 'standard' on setting isSinglePage to false").toLooseEqual("standard");
    survey.questionsOnPageMode = "singlePage";
    expect(survey.questionsOnPageMode, "set questionsOnPageMode to 'singlePage'").toLooseEqual("singlePage");
    expect(survey.isSinglePage, "isSinglePage is true on setting questionsOnPageMode to 'singlePage'").toLooseEqual(true);
    survey.questionsOnPageMode = "questionPerPage";
    expect(survey.questionsOnPageMode, "set questionsOnPageMode to 'questionPerPage'").toLooseEqual("questionPerPage");
    expect(survey.isSinglePage, "isSinglePage is false on setting questionsOnPageMode to 'questionPerPage'").toLooseEqual(false);
    survey.questionsOnPageMode = "standard";
    expect(survey.questionsOnPageMode, "set questionsOnPageMode to 'standard'").toLooseEqual("standard");
    expect(survey.isSinglePage, "isSinglePage is false on setting questionsOnPageMode to 'standard'").toLooseEqual(false);
  });

  test("survey.isSinglePage revert and other value", () => {
    var survey = new SurveyModel({
      storeOthersAsComment: false,
      elements: [
        {
          type: "checkbox",
          name: "q1",
          showOtherItem: true,
          choices: [1, 2],
        },
      ],
    });
    var question = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    question.value = "other";
    question.otherValue = "other2";
    survey.isSinglePage = true;
    expect(survey.storeOthersAsComment, "Keep storeOthersAsComment false").toLooseEqual(false);
    expect(survey.getValue("q1")).toLooseEqual("other2");
    question = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    expect(question.value, "question value").toEqualValues(["other2"]);
    expect(question.renderedValue, "question renderedValue").toEqualValues(["other"]);
    expect(question.comment, "question comment").toEqualValues("other2");
    expect(survey.getValue("q1"), "survey value").toEqualValues(["other2"]);
    expect(survey.getComment("q1"), "survey comment").toEqualValues("");
  });

  test("survey.storeOthersAsComment add checkbox question from code with preset value", () => {
    var survey = new SurveyModel({
      storeOthersAsComment: false,
      elements: [{ type: "text", name: "q2" }],
    });
    survey.setValue("q1", ["other2"]);
    var question = new QuestionCheckboxModel("q1");
    question.choices = [1, 2];
    question.showOtherItem = true;
    survey.pages[0].addQuestion(question);
    expect(question.value, "question value").toEqualValues(["other2"]);
    expect(question.renderedValue, "question renderedValue").toEqualValues(["other"]);
    expect(question.comment, "question comment").toEqualValues("other2");
    expect(survey.getValue("q1"), "survey value").toEqualValues(["other2"]);
    expect(survey.getComment("q1"), "survey comment").toEqualValues("");
  });
  test("survey.questionsOnPageMode = 'questionOnPage', page rows & currentSingleQuestion", () => {
    const survey = twoPageSimplestSurvey();
    const questions = survey.getAllQuestions(true);
    survey.questionsOnPageMode = "questionOnPage";
    expect(survey.pages.length, "We have the same number of pages").toLooseEqual(2);
    expect(survey.isSingleVisibleQuestion, "it is single visible question mode").toLooseEqual(true);
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion, #1").toLooseEqual(questions[0].name);
    expect(survey.pages[0].rows.length, "rows.length, #1").toLooseEqual(1);
    expect(survey.pages[0].rows[0].elements[0].name, "rows element, #1").toLooseEqual(questions[0].name);
    expect(survey.isShowPrevButton, "prev buttton, #1").toLooseEqual(false);
    expect(survey.isShowNextButton, "next buttton, #1").toLooseEqual(true);
    expect(survey.isCompleteButtonVisible, "next buttton, #1").toLooseEqual(false);
    survey.performNext();
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion, #2").toLooseEqual(questions[1].name);
    expect(survey.pages[0].rows.length, "rows.length, #2").toLooseEqual(1);
    expect(survey.pages[0].rows[0].elements[0].name, "rows element, #2").toLooseEqual(questions[1].name);
    expect(survey.isShowPrevButton, "prev buttton, #2").toLooseEqual(true);
    expect(survey.isShowNextButton, "next buttton, #2").toLooseEqual(true);
    expect(survey.isCompleteButtonVisible, "next buttton, #2").toLooseEqual(false);
    survey.performNext();
    expect(survey.currentPage.name, "currentSingleQuestion, #3").toLooseEqual("Page 2");
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion, #3").toLooseEqual(questions[2].name);
    expect(survey.pages[1].rows.length, "rows.length, #3").toLooseEqual(1);
    expect(survey.pages[1].rows[0].elements[0].name, "rows element, #3").toLooseEqual(questions[2].name);
    expect(survey.isShowPrevButton, "prev buttton, #3").toLooseEqual(true);
    expect(survey.isShowNextButton, "next buttton, #3").toLooseEqual(true);
    expect(survey.isCompleteButtonVisible, "next buttton, #3").toLooseEqual(false);
    survey.performNext();
    expect(survey.currentPage.name, "currentSingleQuestion, #4").toLooseEqual("Page 2");
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion, #4").toLooseEqual(questions[3].name);
    expect(survey.pages[1].rows.length, "rows.length, #4").toLooseEqual(1);
    expect(survey.pages[1].rows[0].elements[0].name, "rows element, #4").toLooseEqual(questions[3].name);
    expect(survey.isShowPrevButton, "prev buttton, #4").toLooseEqual(true);
    expect(survey.isShowNextButton, "next buttton, #4").toLooseEqual(false);
    expect(survey.isCompleteButtonVisible, "next buttton, #4").toLooseEqual(true);
    survey.performPrevious();
    expect(survey.currentPage.name, "currentSingleQuestion, #5").toLooseEqual("Page 2");
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion, #5").toLooseEqual(questions[2].name);
    expect(survey.pages[1].rows.length, "rows.length, #5").toLooseEqual(1);
    expect(survey.pages[1].rows[0].elements[0].name, "rows element, #5").toLooseEqual(questions[2].name);
    expect(survey.isShowPrevButton, "prev buttton, #5").toLooseEqual(true);
    expect(survey.isShowNextButton, "next buttton, #5").toLooseEqual(true);
    expect(survey.isCompleteButtonVisible, "next buttton, #5").toLooseEqual(false);
    survey.performPrevious();
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion, #6").toLooseEqual(questions[1].name);
    expect(survey.pages[0].rows.length, "rows.length, #6").toLooseEqual(1);
    expect(survey.pages[0].rows[0].elements[0].name, "rows element, #6").toLooseEqual(questions[1].name);
    expect(survey.isShowPrevButton, "prev buttton, #6").toLooseEqual(true);
    expect(survey.isShowNextButton, "next buttton, #6").toLooseEqual(true);
    expect(survey.isCompleteButtonVisible, "next buttton, #6").toLooseEqual(false);

    survey.questionsOnPageMode = "standard";
    expect(survey.pages[1].rows.length, "page1 standard rows.length").toLooseEqual(2);
    expect(survey.pages[1].rows.length, "page2 standard rows.length").toLooseEqual(2);
    expect(survey.currentSingleQuestion, "No current question in standard mode").toBeFalsy();
    expect(questions[0].page.name, "question1.page #1").toLooseEqual("Page 1");

    survey.questionsOnPageMode = "questionOnPage";
    expect(survey.pages.length, "We have the same number of pages").toLooseEqual(2);
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion, #6").toLooseEqual(questions[0].name);
    expect(questions[0].page.name, "question1.page #2").toLooseEqual("Page 1");

    survey.questionsOnPageMode = "singlePage";
    expect(survey.visiblePages.length, "one visible page").toLooseEqual(1);
    expect(survey.currentSingleQuestion, "No current question in single page").toBeFalsy();
    expect(questions[0].page.name, "question1.page #3").toLooseEqual("single-page");

    survey.questionsOnPageMode = "questionOnPage";
    expect(survey.pages.length, "We have the same number of pages").toLooseEqual(2);
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion, #7").toLooseEqual(questions[0].name);
    expect(questions[0].page.name, "question1.page #4").toLooseEqual("Page 1");
  });
  test("survey.questionsOnPageMode = 'questionOnPage' & survey.clear", () => {
    const survey = twoPageSimplestSurvey();
    const questions = survey.getAllQuestions(true);
    survey.questionsOnPageMode = "questionOnPage";
    survey.performNext();
    survey.performNext();
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion, #1").toLooseEqual(questions[2].name);
    survey.clear();
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion, #2").toLooseEqual(questions[0].name);
  });

  test("survey.questionsOnPageMode, property test", () => {
    var survey = twoPageSimplestSurvey();
    var questions = survey.getAllQuestions();
    survey.questionsOnPageMode = "questionOnPage";
    expect(survey.pages.length, "We have the same number of pages").toLooseEqual(2);
    expect(survey.isSingleVisibleQuestion, "it is single visible question mode").toLooseEqual(true);
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion, #1").toLooseEqual(questions[0].name);
    expect(survey.pages[0].rows.length, "rows.length, #1").toLooseEqual(1);
    expect(survey.pages[0].rows[0].elements[0].name, "rows element, #1").toLooseEqual(questions[0].name);
    expect(survey.isShowPrevButton, "prev buttton, #1").toLooseEqual(false);
    expect(survey.isShowNextButton, "next buttton, #1").toLooseEqual(true);
    expect(survey.isCompleteButtonVisible, "next buttton, #1").toLooseEqual(false);

    survey.questionsOnPageMode = "singlePage";
    expect(survey.visiblePages.length, "We have one page").toLooseEqual(1);
    expect(survey.currentPage.questions.length, "All questions on single page").toLooseEqual(questions.length);
    expect(questions[0].page.name, "question1.page #1").toLooseEqual("single-page");

    survey.questionsOnPageMode = "standard";
    expect(survey.visiblePages.length, "Origional pages, #2").toLooseEqual(2);
    expect(survey.visiblePages[0].questions.length, "There are two questions on the origional first page, #2").toLooseEqual(2);
    expect(questions[0].page.name, "question1.page #2").toLooseEqual("Page 1");
  });

  test("survey.questionsOnPageMode=singlePage, defualt value and visibleIf", () => {
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
    expect(q2.value, "Set default value").toEqualValues(["item1"]);
    expect(q2.renderedValue, "Set default value into rendered value").toEqualValues(["item1"]);
    survey.data = {};
    q1.isRequired = true;
    expect(survey.tryComplete(), "You can't complete the last page").toLooseEqual(false);
  });

  test("Survey page hasShown", () => {
    var survey = twoPageSimplestSurvey();
    expect(survey.pages[0].hasShown, "The first page was shown").toLooseEqual(true);
    expect(survey.pages[1].hasShown, "The second page was not shown").toLooseEqual(false);
    expect(survey.pages[1].hasShown, "The second page was not shown").toLooseEqual(false);
    survey.nextPage();
    expect(survey.pages[1].hasShown, "The second page was shown").toLooseEqual(true);
    survey.clear();
    expect(survey.pages[1].hasShown, "The second page hasShown is false again").toLooseEqual(false);
  });
  test("Questions are randomized", () => {
    var survey = twoPageSimplestSurvey();
    var page = survey.pages[0];
    expect(page.areQuestionsRandomized, "By default questions are not randomized").toLooseEqual(false);
    page.questionOrder = "random";
    expect(page.areQuestionsRandomized, "page.questionOrder = 'random'").toLooseEqual(true);
    page.questionOrder = "default";
    expect(page.areQuestionsRandomized, "page.questionOrder = 'default'").toLooseEqual(false);
    survey.questionOrder = "random";
    expect(page.areQuestionsRandomized, "survey.questionOrder = 'random' && page.questionOrder = 'default'").toLooseEqual(true);
    page.questionOrder = "initial";
    expect(page.areQuestionsRandomized, "page.questionOrder = 'initial'").toLooseEqual(false);
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

  test("Randomize questions in page and panels", () => {
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
    page.onFirstRendering();
    expect(page.elements[0].name).toLooseEqual("p3");
    expect(page.elements[3].name).toLooseEqual("q1");
    expect(p1.elements[0].name).toLooseEqual("p1q2");
    expect(p1.elements[1].name).toLooseEqual("p1q1");
    expect(p2.elements[0].name).toLooseEqual("p2q1");
    expect(p2.elements[1].name).toLooseEqual("p2q2");
    expect(p3.elements[0].name).toLooseEqual("p3q2");
    expect(p3.elements[1].name).toLooseEqual("p3q1");

    delete json.pages[0].questionOrder;
    survey = new SurveyModel(json);
    page = survey.pages[0];
    p1 = survey.getPanelByName("p1");
    p2 = survey.getPanelByName("p2");
    p3 = survey.getPanelByName("p3");
    page.onFirstRendering();
    expect(page.elements[0].name).toLooseEqual("q1");
    expect(page.elements[3].name).toLooseEqual("p3");
    expect(p1.elements[0].name).toLooseEqual("p1q1");
    expect(p1.elements[1].name).toLooseEqual("p1q2");
    expect(p2.elements[0].name).toLooseEqual("p2q1");
    expect(p2.elements[1].name).toLooseEqual("p2q2");
    expect(p3.elements[0].name).toLooseEqual("p3q2");
    expect(p3.elements[1].name).toLooseEqual("p3q1");

    Helpers.randomizeArray = oldFunc;
  });
  test("Randomize questions in page and panels & single question per page", () => {
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
    expect(page.elements[0].name).toLooseEqual("q3");
    expect(page.elements[2].name).toLooseEqual("q1");
    expect(survey.currentSingleQuestion.name, "The first question is q3").toLooseEqual("q3");
    survey.performNext();
    survey.performNext();
    survey.performNext();
    expect(survey.currentSingleQuestion.name, "The current question is q6").toLooseEqual("q6");

    Helpers.randomizeArray = oldFunc;
  });
  test("questionPerPage vs nextPage&prevPage & Bug#9617 (isLastPage/isFirstPage)", () => {
    const survey = new SurveyModel({
      questionsOnPageMode: "questionPerPage",
      pages: [
        { elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }] },
        { elements: [{ type: "text", name: "q3" }, { type: "text", name: "q4" }] },
      ]
    });
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion #1").toLooseEqual("q1");
    expect(survey.isFirstPage, "isFirstPage #1").toLooseEqual(true);
    expect(survey.isLastPage, "isLastPage #1").toLooseEqual(false);
    survey.nextPage();
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion #2").toLooseEqual("q2");
    expect(survey.isFirstPage, "isFirstPage #2").toLooseEqual(false);
    expect(survey.isLastPage, "isLastPage #2").toLooseEqual(false);
    survey.nextPage();
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion #3").toLooseEqual("q3");
    expect(survey.isFirstPage, "isFirstPage #3").toLooseEqual(false);
    expect(survey.isLastPage, "isLastPage #3").toLooseEqual(false);
    survey.nextPage();
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion #4").toLooseEqual("q4");
    expect(survey.isFirstPage, "isFirstPage #4").toLooseEqual(false);
    expect(survey.isLastPage, "isLastPage #4").toLooseEqual(true);
    survey.prevPage();
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion #5").toLooseEqual("q3");
    expect(survey.isFirstPage, "isFirstPage #5").toLooseEqual(false);
    expect(survey.isLastPage, "isLastPage #5").toLooseEqual(false);
    survey.prevPage();
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion #6").toLooseEqual("q2");
    expect(survey.isFirstPage, "isFirstPage #6").toLooseEqual(false);
    expect(survey.isLastPage, "isLastPage #6").toLooseEqual(false);
    survey.prevPage();
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion #7").toLooseEqual("q1");
    expect(survey.isFirstPage, "isFirstPage #7").toLooseEqual(true);
    expect(survey.isLastPage, "isLastPage #7").toLooseEqual(false);
  });

  test("Quiz, correct, incorrect answers", () => {
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
    expect(survey.getAllQuestions().length, "There are 4 questions in total").toLooseEqual(4);
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
    expect(survey.getAllQuestions().length, "There are 6 questions in total").toLooseEqual(6);
    expect(survey.getCorrectedAnswers(), "The number of corrected answers is 0").toLooseEqual(0);
    expect(survey.getInCorrectedAnswers(), "The number of incorrected answers is 4").toLooseEqual(4);
    survey.getQuestionByName("q1").visible = false;
    expect(survey.getInCorrectedAnswers(), "The number of incorrected answers is 3").toLooseEqual(3);
    (<Question>survey.getQuestionByName("q2")).value = "q2";
    expect(survey.getCorrectedAnswers(), "The number of corrected answers is 1").toLooseEqual(1);
    expect(survey.getInCorrectedAnswers(), "The number of incorrected answers is 2").toLooseEqual(2);
    (<Question>survey.getQuestionByName("q3")).value = "q10";
    (<Question>survey.getQuestionByName("q4")).value = "q4";
    expect(survey.getCorrectedAnswers(), "The number of corrected answers is 2").toLooseEqual(2);
    expect(survey.getInCorrectedAnswers(), "The number of incorrected answers is 1").toLooseEqual(1);
    (<Question>survey.getQuestionByName("q4")).visible = false;
    expect(survey.getCorrectedAnswers(), "The number of corrected answers is 1").toLooseEqual(1);
    expect(survey.getInCorrectedAnswers(), "The number of incorrected answers is 1").toLooseEqual(1);
    (<Question>survey.getQuestionByName("q4")).visible = true;
    expect(survey.processedCompletedHtml, "competed html is correct").toLooseEqual("2, 1, 3");
  });
  test("Quiz, correct, incorrect answers - caseinsensitive", () => {
    settings.comparator.caseSensitive = false;
    var survey = new SurveyModel({
      pages: [
        {
          elements: [{ type: "text", name: "q1", correctAnswer: "MyAnswer" }],
        },
      ],
    });
    expect(survey.getCorrectedAnswers(), "No correct answer").toLooseEqual(0);
    survey.setValue("q1", "answer");
    expect(survey.getCorrectedAnswers(), "Still no correct answer").toLooseEqual(0);
    survey.setValue("q1", "myanswer");
    expect(survey.getCorrectedAnswers(), "the answer is correct").toLooseEqual(1);
  });
  test("Quiz, correct, multiple text", () => {
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
    expect(survey.getCorrectedAnswers(), "No correct answer").toLooseEqual(0);
    survey.setValue("root", {
      "text1": "text1",
      "text2": "text2"
    });
    expect(survey.getCorrectedAnswers(), "Check as case insensitive").toLooseEqual(1);
  });
  test("Quiz, correct, incorrect answers, questionCount in expressions", () => {
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
    expect(survey.calculatedValues[0].value, "correctedAnswers").toLooseEqual(1);
    expect(survey.calculatedValues[1].value, "inCorrectedAnswers").toLooseEqual(2);
    expect(survey.calculatedValues[2].value, "questionCount").toLooseEqual(3);
    survey.setValue("q2", "val2");
    expect(survey.calculatedValues[0].value, "correctedAnswers #2").toLooseEqual(2);
    expect(survey.calculatedValues[1].value, "inCorrectedAnswers #2").toLooseEqual(1);
    expect(survey.calculatedValues[2].value, "questionCount #2").toLooseEqual(3);
  });
  test("Store data on the first page, firstPageIsStartPage = true, Bug #1580", () => {
    var survey = twoPageSimplestSurvey();
    var questionCount = survey.getAllQuestions().length;
    var page = new PageModel("start");
    page.addNewQuestion("text", "name");
    page.addNewQuestion("text", "email");
    survey.pages.unshift(page);
    expect(questionCount + 2, "Two questions have been added").toLooseEqual(survey.getAllQuestions().length);
    survey.firstPageIsStartPage = true;
    expect(questionCount + 2, "Two questions on the first page are still here").toLooseEqual(survey.getAllQuestions().length);
    expect(survey.getQuestionByName("name").name, "Question is here").toLooseEqual("name");
    survey.getQuestionByName("name").value = "John";
    survey.getQuestionByName("email").value = "john@gmail.com";
    survey.start();
    expect(survey.data, "Data on the first page is saved").toEqualValues({ name: "John", email: "john@gmail.com" });
    survey.doComplete();
    expect(survey.data, "Data on the first page is still here after complete.").toEqualValues({ name: "John", email: "john@gmail.com" });
  });

  test("Validate questions on the first page, firstPageIsStartPage = true, Bug #1976", () => {
    var survey = new SurveyModel({
      firstPageIsStartPage: true,
      pages: [
        {
          name: "Start Page",
          elements: [
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
          elements: [
            {
              type: "text",
              name: "q1",
            },
          ],
        },
      ],
    });
    expect(survey.state, "We are starting").toLooseEqual("starting");
    var res = survey.start();
    expect(res, "We could not start").toLooseEqual(false);
    expect(survey.state, "We are still starting").toLooseEqual("starting");
    expect(survey.state, "We are not starting yet").not.toLooseEqual("running");
    survey.setValue("name", "some name");
    res = survey.start();
    expect(res, "We could start").toLooseEqual(true);
    expect(survey.state, "We are running").toLooseEqual("running");
    expect(survey.currentPage.name).toLooseEqual("First Page");
  });

  test("Quiz, correct, incorrect answers and onCheckAnswerCorrect event", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("page");
    var q1 = <QuestionCheckboxModel>page.addNewQuestion("checkbox", "q1");
    q1.choices = [1, 2, 3, 4];
    q1.correctAnswer = [2, 3];
    q1.value = [1];
    expect(survey.getQuizQuestions().length, "survey.getQuizQuestions().length").toLooseEqual(1);
    expect(survey.getCorrectAnswerCount(), "The answer is incorrect, #1").toLooseEqual(0);
    q1.value = [3, 2];
    expect(q1.correctAnswerCount, "q1.correctAnswerCount, #1").toLooseEqual(1);
    expect(survey.getCorrectAnswerCount(), "The answer is correct now, #2").toLooseEqual(1);
    let counter = 0;
    survey.onCheckAnswerCorrect.add(function (survey, options) {
      counter++;
      const q = options.question;
      options.result = Helpers.isTwoValueEquals(q.value, q.correctAnswer, false);
    });
    expect(q1.correctAnswerCount, "q1.correctAnswerCount, #2").toLooseEqual(0);
    expect(counter, "counter #1").toLooseEqual(1);
    expect(survey.getCorrectedAnswerCount(), "The order is important now, #3").toLooseEqual(0);
    expect(counter, "counter #2").toLooseEqual(2);
    q1.value = [2, 3];
    expect(survey.getCorrectedAnswerCount(), "The order is correct, #4").toLooseEqual(1);
    expect(counter, "counter #3").toLooseEqual(3);
  });
  test("Quiz, correct, incorrect answers and onCheckAnswerCorrect event", () => {
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
    expect(survey.getCorrectedAnswerCount(), "It is case sensitive").toLooseEqual(0);
    survey.setValue("q1", "hi");
    expect(survey.getCorrectedAnswerCount(), "It is correct").toLooseEqual(1);
    settings.comparator.caseSensitive = false;
  });
  test("Quiz, correct, incorrect answers and onCheckAnswerCorrect event for matrix, https://surveyjs.answerdesk.io/ticket/details/T2606", () => {
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
    expect(survey.getCorrectedAnswers(), "There is no correct answers yet").toLooseEqual(0);
    expect(survey.getQuizQuestionCount(), "one text + 3 matrix").toLooseEqual(4);
    survey.setValue("q1", "val1");
    survey.setValue("q2", { row1: "col1", row2: "col1", row3: "col1" });
    expect(survey.getCorrectedAnswers(), "1 in text question + 2 in matrix").toLooseEqual(3);
    expect(survey.getInCorrectedAnswers(), "1 in matrix").toLooseEqual(1);
  });
  test("question.isCorrectAnswer() and onCheckAnswerCorrect event", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1", correctAnswer: 1 },
        { type: "text", name: "q2", correctAnswer: 2 }
      ]
    });
    let counter = 0;
    survey.onCheckAnswerCorrect.add((sender, options) => {
      counter++;
      const q = options.question;
      options.result = Math.abs(q.value - q.correctAnswer) < 2;
    });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    expect(counter, "counter #1").toLooseEqual(0);
    expect(q1.isAnswerCorrect(), "Value is empty").toLooseEqual(false);
    expect(counter, "counter #2").toLooseEqual(0);
    q1.value = 1;
    expect(q1.isAnswerCorrect(), "q1.value = 1").toLooseEqual(true);
    expect(counter, "counter #3").toLooseEqual(1);
    q1.value = 5;
    expect(q1.isAnswerCorrect(), "q1.value = 5").toLooseEqual(false);
    expect(counter, "counter #4").toLooseEqual(2);
    q1.value = 2;
    expect(q1.isAnswerCorrect(), "q1.value = 2").toLooseEqual(true);
    expect(counter, "counter #5").toLooseEqual(3);
    q2.value = 3;
    expect(q2.isAnswerCorrect(), "q2.value = 3").toLooseEqual(true);
    expect(counter, "counter #6").toLooseEqual(4);
    expect(q2.isAnswerCorrect(), "q2.value = 3").toLooseEqual(true);
    expect(counter, "counter #7").toLooseEqual(5);
  });
  test("Quiz, correct, trim value on checking correct answers, https://surveyjs.answerdesk.io/ticket/details/T6569", () => {
    var survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1", correctAnswer: "val1 " },
        { type: "text", name: "q2", correctAnswer: " val2" },
        { type: "text", name: "q3", correctAnswer: "val3" },
      ],
    });
    expect(survey.getCorrectedAnswers(), "There is no correct answers yet").toLooseEqual(0);
    survey.setValue("q1", "val1");
    survey.setValue("q2", "val2 ");
    survey.setValue("q3", " val3 ");
    expect(survey.getCorrectedAnswers(), "trim values").toLooseEqual(3);
  });
  test("survey.onGetQuestionTitle event. Update unit test for bug: #2298", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("page");
    var question = <Question>page.addNewQuestion("text", "question1");
    expect(question.fullTitle, "by default it is question name if title is empty").toLooseEqual("question1");
    var questionName = "";
    survey.onGetQuestionTitle.add(function (survey, options) {
      questionName = options.question.name;
      if (options.question.title == options.question.name) options.title = "";
    });
    expect(question.fullTitle, "it is empty now").toLooseEqual("");
    //check bug: #2298
    expect(questionName, "options.question is corrrect").toLooseEqual("question1");
  });

  test("Do not run conditions (enableIf/visibleIf) at design-time/Editor, Bug #999", () => {
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
    expect(page2.visible, "Page object doesn't run condition at design").toLooseEqual(true);
    expect(panel.visible, "Panel object doesn't run condition at design").toLooseEqual(true);
    expect(question.readOnly, "Question object doesn't run condition at design").toLooseEqual(false);
  });

  test("condition function isContainerReady", () => {
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
    expect(qTest.isVisible, "It is invisible by default").toLooseEqual(false);
    q1.value = "1";
    expect(qTest.isVisible, "q2 is empty").toLooseEqual(false);
    q2.value = "2";
    expect(qTest.isVisible, "q2 is not e-mail").toLooseEqual(false);
    q2.value = "email@mail.com";
    expect(qTest.isVisible, "isContainerReady returns true").toLooseEqual(true);
  });

  test("Use 'question' in function context", () => {
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
    expect(question.isVisible, "first and last is not selected").toLooseEqual(false);
    question.value = [1, 2];
    expect(question.isVisible, "first and last is not selected yet").toLooseEqual(false);
    question.value = [1, 3, 5];
    expect(question.isVisible, "first and last is selected").toLooseEqual(true);
    FunctionFactory.Instance.unregister("isFirstLastChoiceSelected");
  });

  test("Infinitive loop on setting value to checkbox, if there is a text question with the same name, Bug #1015", () => {
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
    expect(survey.getValue("onename"), "The value set correctly").toEqualValues(["item1"]);
  });

  test("visibleIf and adding/remove elements on changing visible, Bug #1044", () => {
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

    expect(q2.isVisible, "Initially q2 is invisible").toLooseEqual(false);
    expect(q3.isVisible, "Initially q3 is invisible").toLooseEqual(false);
    survey.setValue("q1", 2);
    expect(q2.isVisible, "q1=2, q2 is visible").toLooseEqual(true);
    expect(q3.isVisible, "q1=2, q3 is invisible").toLooseEqual(false);
    survey.setValue("q1", 3);
    expect(q2.isVisible, "q1=3, q2 is invisible").toLooseEqual(false);
    expect(q3.isVisible, "q1=3, q3 is visible").toLooseEqual(true);
  });
  test("survey.onVisibleChanged & survey.onQuestionVisibleChanged are same events", () => {
    const survey = new SurveyModel();
    expect(survey.onVisibleChanged.length, "#1 onVisibleChanged.length").toLooseEqual(0);
    expect(survey.onQuestionVisibleChanged.length, "#1 onQuestionVisibleChanged.length").toLooseEqual(0);
    survey.onQuestionVisibleChanged.add((sender, options) => { });
    expect(survey.onVisibleChanged.length, "#2 onVisibleChanged.length").toLooseEqual(1);
    expect(survey.onQuestionVisibleChanged.length, "#2 onQuestionVisibleChanged.length").toLooseEqual(1);
    survey.onQuestionVisibleChanged.clear();
    expect(survey.onVisibleChanged.length, "#3 onVisibleChanged.length").toLooseEqual(0);
    expect(survey.onQuestionVisibleChanged.length, "#3 onQuestionVisibleChanged.length").toLooseEqual(0);
    survey.onVisibleChanged.add((sender, options) => { });
    expect(survey.onVisibleChanged.length, "#4 onVisibleChanged.length").toLooseEqual(1);
    expect(survey.onQuestionVisibleChanged.length, "#4 onQuestionVisibleChanged.length").toLooseEqual(1);
    survey.onVisibleChanged.clear();
    expect(survey.onVisibleChanged.length, "#5 onVisibleChanged.length").toLooseEqual(0);
    expect(survey.onQuestionVisibleChanged.length, "#5 onQuestionVisibleChanged.length").toLooseEqual(0);
  });

  test("Process text with question name containing '-' and '+', Bug #1080", () => {
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
    expect(qAge.isVisible, "It is hidden by default").toLooseEqual(false);
    survey.setValue("1-2+3", "John");
    expect(qAge.isVisible, "It is visible now").toLooseEqual(true);
    expect(qAge.locTitle.renderedHtml, "title processed correctly").toLooseEqual("Hi, John");
  });

  test("clearInvisibleValues: 'onHidden' doesn't work. The fix was created by introducing conditionVersion, Bug ##1172. NOTE conditionVersion was removed due refactoring and using different approach", () => {
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
    expect(qchoosePlatform.isVisible, "choosePlatform is not visible initial").toLooseEqual(false);
    expect(qinstallLinux.isVisible, "installLinux is not visible initial").toLooseEqual(false);
    survey.setValue("issueType", "installJaxx");
    expect(qchoosePlatform.isVisible, "choosePlatform is visible step 1").toLooseEqual(true);
    expect(qinstallLinux.isVisible, "installLinux is not visible step 1").toLooseEqual(false);
    survey.setValue("choosePlatform", "linux");
    expect(qchoosePlatform.isVisible, "choosePlatform is visible step 2").toLooseEqual(true);
    expect(qinstallLinux.isVisible, "installLinux is visible step 2").toLooseEqual(true);
    survey.setValue("issueType", "backupPhrase");
    expect(qchoosePlatform.isVisible, "choosePlatform is visible step 3").toLooseEqual(false);
    expect(qchoosePlatform.isEmpty(), "choosePlatform is empty step 3").toLooseEqual(true);
    expect(qinstallLinux.isVisible, "installLinux is not visible step 3").toLooseEqual(false);
  });

  test("readOnly, enabledIf for Panels and Pages", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("page");
    var panel1 = page.addNewPanel("panel1");
    var panel2 = panel1.addNewPanel("panel2");
    survey.setValue("val1", 1);
    panel1.enableIf = "{val1} == 1";
    var question1 = <Question>panel1.addNewQuestion("text", "question1");
    var question2 = <Question>panel2.addNewQuestion("text", "question2");
    expect(question2.isReadOnly, "It is not readOnly by default").toLooseEqual(false);
    survey.setValue("val1", 2);
    expect(question1.isReadOnly, "question1 is readOnly").toLooseEqual(true);
    expect(question2.isReadOnly, "question2 is readOnly").toLooseEqual(true);
    expect(panel1.isReadOnly, "panel1 is readOnly").toLooseEqual(true);
    expect(panel2.isReadOnly, "panel2 is readOnly").toLooseEqual(true);

    var question3 = <Question>panel2.addNewQuestion("text", "question3");
    expect(question3.isReadOnly, "question3 is readOnly").toLooseEqual(true);

    survey.setValue("val1", 1);
    expect(question2.isReadOnly, "question2 is editable").toLooseEqual(false);

    panel2.readOnly = true;
    expect(question1.isReadOnly, "question1 is not readOnly, panel2 is ReadOnly").toLooseEqual(false);
    expect(question2.isReadOnly, "question2 is readOnly, panel2 is ReadOnly").toLooseEqual(true);
  });

  test("Hide question numbers on particular page", () => {
    var survey = new SurveyModel();
    survey.addNewPage("page1");
    survey.addNewPage("page2");
    survey.addNewPage("page3");
    survey.pages[0].addNewQuestion("text", "q1");
    survey.pages[1].addNewQuestion("text", "q2");
    survey.pages[2].addNewQuestion("text", "q3");
    var question = <Question>survey.getQuestionByName("q3");
    expect(question.fullTitle, "It has number 3").toLooseEqual("q3");
    survey.pages[1].questionTitleLocation = "hidden";
    expect(question.fullTitle, "It has number 2 now").toLooseEqual("q3");
  });

  test("Could not assign value into mutlipletext question, #1229", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("page1");
    var question = new QuestionMultipleTextModel("q1");
    question.addItem("item1");
    question.addItem("item2");
    page.addQuestion(question);
    survey.data = { q1: { item1: "val1", item2: "val2" } };
    expect(question.items[0].editor.value, "val1 is set to the question item").toLooseEqual("val1");
    expect(question.items[1].editor.value, "val1 is set to the question item").toLooseEqual("val2");
  });

  test("ProcessTextEx returnedDisplayValue is false, Bug#1243", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("page1");
    var q = <QuestionDropdownModel>page.addNewQuestion("dropdown", "region");
    q.choices = ["1", "2", "3"];
    var res = survey.processTextEx({ text: "{region}" });
    expect(res.hasAllValuesOnLastRun === false, "region doesn't exists").toBeTruthy();
    q.value = 1;
    res = survey.processTextEx({ text: "{region}" });
    expect(res.hasAllValuesOnLastRun === true, "region exists").toBeTruthy();
  });
  test("ProcessTextEx & nessted obj, Bug#9390", () => {
    const survey = new SurveyModel();
    survey.setVariable("a1", { b2: "abc" });
    expect(survey.processTextEx({ text: "test: {a1.b2}" }).text, "#1").toLooseEqual("test: abc");
    expect(survey.processTextEx({ text: "test: {c: {a1.b2}}" }).text, "#2").toLooseEqual("test: {c: abc}");
    expect(survey.processTextEx({ text: "test: { c: {a1.b2} }" }).text, "#3").toLooseEqual("test: { c: abc }");
    expect(survey.processTextEx({ text: "test: {c: \"{a1.b2}\"}" }).text, "#4").toLooseEqual("test: {c: \"abc\"}");
    expect(survey.processTextEx({ text: "test: { c: \"{a1.b2}\" }" }).text, "#5.1").toLooseEqual("test: { c: \"abc\" }");
    expect(survey.processTextEx({ text: "test: { c: \"{a1.b2}\" }" }).hasAllValuesOnLastRun, "#5.2").toLooseEqual(true);
    expect(survey.processTextEx({ text: "inputs={\"car_make\": \"{a1.b2}\"}" }).text, "#6.1").toLooseEqual("inputs={\"car_make\": \"abc\"}");
    expect(survey.processTextEx({ text: "inputs={\"car_make\": \"{a1.b2}\"}" }).hasAllValuesOnLastRun, "#6.2").toLooseEqual(true);
    expect(survey.processTextEx({ text: "inputs={\"car_make\": \"abc\"}" }).text, "#7.1").toLooseEqual("inputs={\"car_make\": \"abc\"}");
    expect(survey.processTextEx({ text: "inputs={\"car_make\": \"abc\"}" }).hasAllValuesOnLastRun, "#7.2").toLooseEqual(true);
  });
  test("ProcessTextEx replaceUndefinedValues is true, Bug#9417", () => {
    const survey = new SurveyModel();
    survey.setVariable("a1", "abc");
    expect(survey.processTextEx({ text: "test: {a1},{a2}" }).text, "#1").toLooseEqual("test: abc,{a2}");
    expect(survey.processTextEx({ text: "test: {a1},{a2}", replaceUndefinedValues: true }).text, "#2").toLooseEqual("test: abc,");
    expect(survey.processText("test: {a1},{a2}", false), "#3").toLooseEqual("test: abc,{a2}");
  });
  test("Empty question value in text processing, Bug#9417", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "first-name", title: "Hi {first-name}" },
        { type: "text", name: "last-name", title: "{last-name}" }
      ]
    });
    const q1 = survey.getQuestionByName("first-name");
    const q2 = survey.getQuestionByName("last-name");
    expect(q1.locTitle.renderedHtml, "q1.title #1").toLooseEqual("Hi ");
    expect(q2.locTitle.renderedHtml, "q2.title #1").toLooseEqual("");
    q1.value = "John";
    q2.value = "Doe";
    expect(q1.locTitle.renderedHtml, "q1.title #2").toLooseEqual("Hi John");
    expect(q2.locTitle.renderedHtml, "q2.title #3").toLooseEqual("Doe");
    q1.clearValue();
    q2.clearValue();
    expect(q1.locTitle.renderedHtml, "q1.title #3").toLooseEqual("Hi ");
    expect(q2.locTitle.renderedHtml, "q2.title #3").toLooseEqual("");
  });
  test("Undefined variables in text processing, Bug#9417", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1", title: "Hi {var1}" },
        { type: "text", name: "q2", title: "{var2}" }
      ]
    });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    expect(q1.locTitle.renderedHtml, "q1.title #1").toLooseEqual("Hi {var1}");
    expect(q2.locTitle.renderedHtml, "q2.title #1").toLooseEqual("{var2}");
    survey.setVariable("var1", "John");
    survey.setVariable("var2", "Doe");
    expect(q1.locTitle.renderedHtml, "q1.title #2").toLooseEqual("Hi John");
    expect(q2.locTitle.renderedHtml, "q2.title #3").toLooseEqual("Doe");
    survey.setVariable("var1", "");
    survey.setVariable("var2", "");
    expect(q1.locTitle.renderedHtml, "q1.title #3").toLooseEqual("Hi ");
    expect(q2.locTitle.renderedHtml, "q2.title #3").toLooseEqual("");
  });
  test("Question name is one symbol in text processing, Bug#10164", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "radiogroup", name: "a", choices: [{ value: 1, text: "Item1" }, { value: 2, text: "Item2" }] },
        { type: "text", name: "q1", title: "test:{a}" }
      ]
    });
    const qa = survey.getQuestionByName("a");
    const q1 = survey.getQuestionByName("q1");
    expect(q1.locTitle.renderedHtml, "q1.title #1").toLooseEqual("test:");
    qa.value = 1;
    expect(q1.locTitle.renderedHtml, "q1.title #2").toLooseEqual("test:Item1");
  });

  test("Do not add invisible Panel Dynamic to the data, Bug#1258", () => {
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
    expect(JSON.stringify(survey.data), "Panel Dynamic is invisible").toLooseEqual("{}");
  });

  test("Compete trigger and autoAdvanceEnabled option", () => {
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
      autoAdvanceEnabled: true,
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
    expect(completedCounter, "The survey is completed one time").toLooseEqual(1);
  });

  test("Compete trigger with invisible question, Bug #2098", () => {
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
    expect(survey.state, "Survey is completed").toLooseEqual("completed");
  });

  test("Compete trigger with invisible question, #2, Bug #2098", () => {
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
    expect(survey.state, "Survey is completed").toLooseEqual("completed");
  });
  test("Compete trigger and allowComplete false, Bug #3184", () => {
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
      options.allow = false;
    });
    survey.getQuestionByName("age").value = 10;
    expect(survey.currentPageNo).toLooseEqual(0);
    survey.nextPage();
    expect(survey.state, "Survey is not completed").toLooseEqual("running");
    expect(survey.currentPageNo, "go next page").toLooseEqual(1);
  });

  test("textUpdateMode=onTyping and autoAdvanceEnabled option", () => {
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
      autoAdvanceEnabled: true,
    };
    var survey = new SurveyModel(json);
    var question = survey.getQuestionByName("q1");
    question.value = "a";
    expect(survey.currentPageNo, "Stay on the first page").toLooseEqual(0);
    question.clearValue();
    question.inputType = "email";
    question.value = "a@a.com";
    expect(survey.currentPageNo, "Stay on the first page").toLooseEqual(0);
  });
  test("textUpdateMode=onTyping and visibleIf", () => {
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
    expect(q2.isVisible, "It is invisible by default").toLooseEqual(false);
    q1.value = "a";
    expect(q2.isVisible, "It is visible now").toLooseEqual(true);
  });

  test("Page with numeric name, bug #1293", () => {
    var json = {
      pages: [
        {
          name: "0608",
          elements: [
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
    expect(survey.currentPage.name, "the current page is correct").toLooseEqual("0608");
  });

  test("visiblePages and invisible panel, bug #395 (in Editor)", () => {
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
    expect(survey.visiblePageCount, "Only one page is visible").toLooseEqual(1);
    expect(survey.pages[1].isVisible, "The second page is invisible").toLooseEqual(false);
    survey.setValue("question2", "item1");
    expect(survey.visiblePageCount, "Two pages are visible").toLooseEqual(2);
    survey.setValue("question2", "item2");
    expect(survey.visiblePageCount, "One page is visible again").toLooseEqual(1);
  });

  test("Do not process html in design time, bug #396 (in Editor)", () => {
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
    expect(question.locTitle.renderedHtml, "Do not process anything at design time").toLooseEqual("{question1} test");
  });

  test("survey.showInvisibleElements property", () => {
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
    expect(survey.visiblePages.length, "There is one visible page").toLooseEqual(1);
    expect(survey.getQuestionByName("question2").isVisible, "question2 is invisible").toLooseEqual(false);
    expect(survey.getQuestionByName("question2").getPropertyValue("isVisible"), "question2 is invisible, property value").toLooseEqual(false);
    expect(survey.getQuestionByName("question4").visibleChoices.length, "There is zero visible choices").toLooseEqual(0);
    survey.showInvisibleElements = true;
    expect(survey.visiblePages.length, "There are two visible pages").toLooseEqual(2);
    expect(survey.getQuestionByName("question2").isVisible, "question2 is visible").toLooseEqual(true);
    expect(survey.getQuestionByName("question2").getPropertyValue("isVisible"), "question2 is visible, propertyValue").toLooseEqual(true);
    expect(survey.getQuestionByName("question4").visibleChoices.length, "There are two visible choices").toLooseEqual(2);
  });

  test("survey.showInvisibleElements property, Bug#2423", () => {
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
    expect(survey.getQuestionByName("q1").visibleChoices.length, "There are two visible choices").toLooseEqual(2);
    expect(survey.getQuestionByName("q2").visibleColumns.length, "There are two visible columns").toLooseEqual(2);
    expect(survey.getQuestionByName("q2").visibleRows.length, "There are two visible rows").toLooseEqual(2);
  });

  test("survey.showInvisibleElements property & question invisible css style, Bug#9002", () => {
    const survey = new SurveyModel();
    survey.css = { question: { invisible: "sd-element--invisible" } };
    expect(survey.css.question.invisible, "survey css is updated").toLooseEqual("sd-element--invisible");
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
    expect(q2.visible, "visible is false, #1").toLooseEqual(false);
    expect(q2.isVisible, "isVisible is true, #1").toLooseEqual(true);
    expect(q2.getRootCss().indexOf("sd-element--invisible") > -1, "#1").toLooseEqual(true);
    q1.value = true;
    expect(q2.visible, "visible is false, #2").toLooseEqual(true);
    expect(q2.isVisible, "isVisible is true, #2").toLooseEqual(true);
    expect(q2.getRootCss().indexOf("sd-element--invisible") > -1, "#2").toLooseEqual(false);
    q1.value = false;
    expect(q2.visible, "visible is false, #3").toLooseEqual(false);
    expect(q2.isVisible, "isVisible is true, #3").toLooseEqual(true);
    expect(q2.getRootCss().indexOf("sd-element--invisible") > -1, "#3").toLooseEqual(true);
    survey.showInvisibleElements = false;
    expect(q2.visible, "visible is false, #4").toLooseEqual(false);
    expect(q2.isVisible, "isVisible is true, #4").toLooseEqual(false);
    expect(q2.getRootCss().indexOf("sd-element--invisible") > -1, "#4").toLooseEqual(false);
  });
  test("survey.showInvisibleElements property & multiple pages", () => {
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
    expect(survey.navigationBar.getActionById("sv-nav-complete").isVisible, "sv-nav-complete, #1").toLooseEqual(true);
    expect(survey.navigationBar.getActionById("sv-nav-next").isVisible, "sv-nav-next, #1").toLooseEqual(false);
    survey.showInvisibleElements = true;
    expect(survey.navigationBar.getActionById("sv-nav-complete").isVisible, "sv-nav-complete, #2").toLooseEqual(false);
    expect(survey.navigationBar.getActionById("sv-nav-next").isVisible, "sv-nav-next, #2").toLooseEqual(true);
    survey.showInvisibleElements = false;
    expect(survey.navigationBar.getActionById("sv-nav-complete").isVisible, "sv-nav-complete, #3").toLooseEqual(true);
    expect(survey.navigationBar.getActionById("sv-nav-next").isVisible, "sv-nav-next, #3").toLooseEqual(false);
  });

  test("panel.visibleIf doesn't work if it is a single panel on the page, #1329", () => {
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
    expect(survey.visiblePageCount, "There is one visible page").toLooseEqual(1);
    expect(counter, "counter is 0").toLooseEqual(0);
    survey.setValue("question1", "item1");
    expect(survey.visiblePageCount, "There are two visible pages").toLooseEqual(2);
    expect(counter, "counter is 1").toLooseEqual(1);
    survey.setValue("question1", "item2");
    expect(survey.visiblePageCount, "There is one visible page again").toLooseEqual(1);
    expect(counter, "counter is 2").toLooseEqual(2);
  });

  test("Change renderWidth on width change, Editor Bug #422", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("page");
    var panel = page.addNewPanel("p1");
    panel.addNewQuestion("text", "q1");
    var question = page.addNewQuestion("text", "q2");
    question.width = "100px";
    panel.width = "200px";
    expect(question.renderWidth, "row set question.renderWidth to it's width").toLooseEqual("100px");
    expect(panel.renderWidth, "row set panel.renderWidth to it's width").toLooseEqual("200px");
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

  test("Survey get full title with values", () => {
    var json = {
      elements: [
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

    expect(q1.getProcessedText("{q1}"), "Get question value").toLooseEqual(1);
  });

  test("Survey get full title with values, bug#5383", () => {
    var json = {
      elements: [
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

    expect(survey.getProcessedText("{q1}"), "Get question value").toLooseEqual(1);
  });
  test("Process text for question with value, no value and non existing", () => {
    const survey = new SurveyModel({
      elements: [{ type: "text", name: "q1", defaultValue: "val" }, { type: "text", name: "q2" }]
    });
    expect(survey.getProcessedText("{q1}+{q2}+{q3}"), "show value, show empty string, show as it is").toLooseEqual("val++{q3}");
  });

  test("Survey radioGroup remove data on visible items change even if there are other visible questions here, Bug# T1239", () => {
    var json = {
      elements: [
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
    expect(survey.data).toEqualValues(data);
  });

  test("Do not call onValueChanged event onComplete event, Bug# T1239", () => {
    var survey = new SurveyModel({
      elements: [
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
    expect(counter, "onValueChanged called two times").toEqualValues(2);
    survey.doComplete();
    expect(counter, "onValueChanged called still two times").toEqualValues(2);
  });

  test("Call onValueChanged event onComplete event only one for real field, Bug# T1239", () => {
    var survey = new SurveyModel({
      elements: [
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
    expect(counter, "onValueChanged called still two times").toLooseEqual(1);
  });

  test("getPlainData", () => {
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
    expect(plainData.length, "all questions are present").toLooseEqual(survey.getAllQuestions().length);
    expect(plainData[0].name).toLooseEqual("question1");
    expect(plainData[0].title).toLooseEqual("text");
    expect(plainData[0].value).toLooseEqual("Answer 1");
    expect(plainData[0].displayValue).toLooseEqual("Answer 1");
    expect(plainData[0].isNode).toBeFalsy();

    expect(plainData[1].name).toLooseEqual("question3");
    expect(plainData[1].title).toLooseEqual("checkbox");
    expect(plainData[1].value).toEqualValues(["item1", "item2"]);
    expect(plainData[1].displayValue).toEqualValues("item1, item2");
    expect(plainData[1].isNode).toBeTruthy();
    expect(plainData[1].data.length).toLooseEqual(2);
    expect(plainData[1].data[0].value).toLooseEqual("item1");
    expect(plainData[1].data[0].displayValue).toLooseEqual("item1");
    expect(plainData[1].data[1].value).toLooseEqual("item2");
    expect(plainData[1].data[1].displayValue).toLooseEqual("item2");

    expect(plainData[2].name).toLooseEqual("question4");
    expect(plainData[2].title).toLooseEqual("radiogroup");
    expect(plainData[2].value).toLooseEqual("item3");
    expect(plainData[2].isNode).toBeTruthy();
  });

  test("custom fields in getPlainData - https://surveyjs.answerdesk.io/ticket/details/T1778", () => {
    Serializer.addProperty("question", {
      name: "score:number",
    });

    Serializer.addProperty("itemvalue", {
      name: "score:number",
    });

    var q = new QuestionImagePickerModel(null);

    var survey = new SurveyModel({
      elements: [
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
    expect(plainData.length, "all questions are present").toLooseEqual(12);
    expect(plainData[0].value).toEqualValues(3);
    expect(plainData[0].score).toLooseEqual(11);
    expect(plainData[0].isNode).toLooseEqual(false);
    expect(plainData[1].value).toEqualValues("item2");
    expect(plainData[1].score).toLooseEqual(12);
    expect(plainData[1].isNode).toLooseEqual(true);
    expect(plainData[1].data[0].score).toLooseEqual(2);
    expect(plainData[2].value).toEqualValues("some text 13");
    expect(plainData[2].score).toLooseEqual(13);
    expect(plainData[3].value).toEqualValues(["item2", "item3"]);
    expect(plainData[3].score).toLooseEqual(14);
    expect(plainData[4].value).toEqualValues("item1");
    expect(plainData[4].score).toLooseEqual(1);
    expect(plainData[5].value).toEqualValues("comment2");
    expect(plainData[5].score).toLooseEqual(2);
    expect(plainData[6].value).toEqualValues("giraffe");
    expect(plainData[6].score).toLooseEqual(3);
    expect(plainData[7].value).toEqualValues([
      {
        content: "data:image/x-icon;base64,A=",
        name: "favicon.ico",
        type: "image/x-icon",
      },
    ]);
    expect(plainData[7].score).toLooseEqual(4);
    expect(plainData[8].value).toEqualValues({ text1: "a", text2: "b" });
    expect(plainData[8].score).toLooseEqual(5);
    expect(plainData[9].value).toEqualValues({
      "Row 1": { "Column 1": 1, "Column 2": 2, "Column 3": 3 },
      "Row 2": { "Column 1": 4, "Column 2": 5, "Column 3": 4 },
    });
    expect(plainData[9].score).toLooseEqual(9);

    expect(plainData[10].value).toEqualValues({
      "Row 1": "Column 1",
      "Row 2": "Column 2",
    });
    expect(plainData[10].score).toLooseEqual(10);
    expect(plainData[10].data[0].score).toLooseEqual(1);
    expect(plainData[10].data[1].score).toLooseEqual(2);

    expect(plainData[11].value).toEqualValues([
      { question21: "Panel dynamic content 1" },
      { question21: "Panel dynamic content 2" },
    ]);
    expect(plainData[11].score).toLooseEqual(8);

    expect(plainData[3].isNode).toBeTruthy();
    expect(plainData[3].data.length).toLooseEqual(2);
    expect(plainData[3].data[0].value).toLooseEqual("item2");
    expect(plainData[3].data[0].displayValue).toLooseEqual("item2");
    expect(plainData[3].data[1].value).toLooseEqual("item3");
    expect(plainData[3].data[1].displayValue).toLooseEqual("item3");

    Serializer.removeProperty("question", "score");
    Serializer.removeProperty("itemvalue", "score");
  });

  test("question.getPlainData - select base - single", () => {
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
    expect(plainData.score).toLooseEqual(3);
    expect(plainData.value).toEqualValues("giraffe");
    expect(plainData.isNode).toLooseEqual(true);
    expect(plainData.data[0].score).toLooseEqual(2);
    expect(plainData.data[0].value).toEqualValues("giraffe");

    Serializer.removeProperty("question", "score");
    Serializer.removeProperty("itemvalue", "score");
  });

  test("question.getPlainData - select base - multiple", () => {
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
    expect(plainData.score).toLooseEqual(3);
    expect(plainData.value).toEqualValues(["giraffe", "panda"]);
    expect(plainData.displayValue).toEqualValues("giraffe22, panda");
    expect(plainData.isNode).toLooseEqual(true);
    expect(plainData.data[0].score).toLooseEqual(2);
    expect(plainData.data[0].value).toEqualValues("giraffe");
    expect(plainData.data[0].displayValue).toEqualValues("giraffe22");
    expect(plainData.data[1].score).toLooseEqual(3);
    expect(plainData.data[1].value).toEqualValues("panda");

    Serializer.removeProperty("question", "score");
    Serializer.removeProperty("itemvalue", "score");
  });

  test("question.getPlainData - file", () => {
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
    expect(plainData.score).toLooseEqual(4);
    expect(plainData.value).toEqualValues([
      {
        name: "favicon.ico",
        type: "image/x-icon",
        content: "data:image/x-icon;base64,A=",
      },
    ]);
    expect(plainData.displayValue).toEqualValues([
      {
        name: "favicon.ico",
        type: "image/x-icon",
        content: "data:image/x-icon;base64,A=",
      },
    ]);
    expect(plainData.isNode).toLooseEqual(false);
    expect(plainData.data[0].value).toEqualValues("data:image/x-icon;base64,A=");
    expect(plainData.data[0].displayValue).toEqualValues("favicon.ico");

    Serializer.removeProperty("question", "score");
  });

  test("question.getPlainData - matrix", () => {
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
    expect(plainData.score).toLooseEqual(10);
    expect(plainData.value).toEqualValues({
      "Row 1": "Column 1",
      "Row 2": "Column 2",
    });
    expect(plainData.displayValue).toEqualValues({
      "Row 1 title": "Column 1",
      "Row 2": "Column 2",
    });
    expect(plainData.isNode).toLooseEqual(true);
    expect(plainData.data[0].name).toEqualValues("Row 1");
    expect(plainData.data[0].title).toEqualValues("Row 1 title");
    expect(plainData.data[0].value).toEqualValues("Column 1");
    expect(plainData.data[0].displayValue).toEqualValues("Column 1");
    expect(plainData.data[0].score).toEqualValues(1);
    expect(plainData.data[1].name).toEqualValues("Row 2");
    expect(plainData.data[1].value).toEqualValues("Column 2");
    expect(plainData.data[1].displayValue).toEqualValues("Column 2");
    expect(plainData.data[1].score).toEqualValues(2);

    Serializer.removeProperty("question", "score");
    Serializer.removeProperty("itemvalue", "score");
  });

  test("question.getPlainData - matrixdropdown, fixed bug#3097", () => {
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
    expect(plainData.score).toLooseEqual(9);
    expect(plainData.value).toEqualValues({
      "Row 1": { "Column 1": 1, "Column 2": "2", "Column 3": 3 },
      "Row 2": { "Column 1": 4, "Column 2": "5", "Column 3": 4 },
    });
    expect(plainData.displayValue).toEqualValues({
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
    expect(plainData.isNode).toLooseEqual(true);
    expect(plainData.data.length, "Two rows in matrix").toLooseEqual(2);
    expect(plainData.data[0].name).toEqualValues("Row 1");
    expect(plainData.data[0].title).toEqualValues("Row 1 Title");
    expect(plainData.data[0].value).toEqualValues({
      "Column 1": 1,
      "Column 2": 2,
      "Column 3": 3,
    });
    expect(plainData.data[0].displayValue).toEqualValues({
      "Column 1": "1",
      "Column 2": "2",
      "Column 3": "3",
    });
    expect(plainData.data[1].name).toEqualValues("Row 2");
    expect(plainData.data[1].value).toEqualValues({
      "Column 1": 4,
      "Column 2": 5,
      "Column 3": 4,
    });
    expect(plainData.data[1].displayValue).toEqualValues({
      "Column 1": "4",
      "Column 2": "5",
      "Column 3": "4",
    });

    expect(plainData.data[0].isNode).toLooseEqual(true);
    expect(plainData.data[0].data.length, "Three columns (questions) in matrix row").toLooseEqual(3);

    expect(plainData.data[0].data[0].name, "column1 name").toLooseEqual("Column 1");
    expect(plainData.data[0].data[0].title, "column1 title").toLooseEqual("Column 1");
    expect(plainData.data[0].data[0].value).toLooseEqual(1);
    expect(plainData.data[0].data[0].displayValue).toLooseEqual("1");
    expect(plainData.data[0].data[0].score).toLooseEqual(undefined);
    expect(plainData.data[0].data[0].isNode).toLooseEqual(true);

    expect(plainData.data[0].data[0].data[0].score).toLooseEqual(1);
    expect(plainData.data[0].data[0].data[0].name).toLooseEqual(0);
    expect(plainData.data[0].data[0].data[0].title).toLooseEqual("Choice option");
    expect(plainData.data[0].data[0].data[0].value).toLooseEqual(1);
    expect(plainData.data[0].data[0].data[0].displayValue).toLooseEqual("1");

    expect(plainData.data[0].data[1].name, "column2 name").toLooseEqual("Column 2");
    expect(plainData.data[0].data[1].title, "column2 title").toLooseEqual("Column 2");
    expect(plainData.data[0].data[1].value).toLooseEqual(2);
    expect(plainData.data[0].data[1].displayValue).toLooseEqual("2");
    expect(plainData.data[0].data[1].score).toLooseEqual(undefined);
    expect(plainData.data[0].data[1].isNode).toLooseEqual(true);

    expect(plainData.data[0].data[1].data[0].score).toLooseEqual(2);
    expect(plainData.data[0].data[1].data[0].name).toLooseEqual(0);
    expect(plainData.data[0].data[1].data[0].title).toLooseEqual("Choice option");
    expect(plainData.data[0].data[1].data[0].value).toLooseEqual(2);
    expect(plainData.data[0].data[1].data[0].displayValue).toLooseEqual("2");

    Serializer.removeProperty("question", "score");
    Serializer.removeProperty("itemvalue", "score");
  });

  test("question.getPlainData - panel dynamic", () => {
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
    expect(plainData.score).toLooseEqual(8);
    expect(plainData.value).toEqualValues([
      { question21: "Panel dynamic content 1" },
      { question21: "Panel dynamic content 2" },
    ]);
    expect(plainData.displayValue).toEqualValues([
      { question21: "Panel dynamic content 1" },
      { question21: "Panel dynamic content 2" },
    ]);
    expect(plainData.isNode).toLooseEqual(true);
    expect(plainData.data[0].name).toEqualValues(0);
    expect(plainData.data[0].title).toEqualValues("Panel");
    expect(plainData.data[0].value).toEqualValues({
      question21: "Panel dynamic content 1",
    });
    expect(plainData.data[0].displayValue).toEqualValues({
      question21: "Panel dynamic content 1",
    });
    expect(plainData.data[1].name).toEqualValues(1);
    expect(plainData.data[1].value).toEqualValues({
      question21: "Panel dynamic content 2",
    });
    expect(plainData.data[1].displayValue).toEqualValues({
      question21: "Panel dynamic content 2",
    });

    expect(plainData.data[0].isNode).toLooseEqual(true);

    expect(plainData.data[0].data[0].name).toLooseEqual("question21");
    expect(plainData.data[0].data[0].title).toLooseEqual("question21");
    expect(plainData.data[0].data[0].value).toLooseEqual("Panel dynamic content 1");
    expect(plainData.data[0].data[0].displayValue).toLooseEqual("Panel dynamic content 1");
    expect(plainData.data[0].data[0].score).toLooseEqual(21);

    Serializer.removeProperty("question", "score");
    Serializer.removeProperty("itemvalue", "score");
  });

  test("getPlainData - calculate score - https://surveyjs.answerdesk.io/ticket/details/T1778", () => {
    Serializer.addProperty("question", {
      name: "score:number",
    });

    Serializer.addProperty("itemvalue", {
      name: "score:number",
    });

    var survey = new SurveyModel({
      elements: [
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

    expect(surveyScore, "overall survey score for answered questions").toLooseEqual(75);

    Serializer.removeProperty("question", "score");
    Serializer.removeProperty("itemvalue", "score");
  });
  test("getPlainData - calculate itemvalue.score in rate question, Bug#6804", () => {
    Serializer.addProperty("itemvalue", { name: "score:number" });

    var survey = new SurveyModel({
      elements: [
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
    expect(q1PlainData.displayValue, "display value is correct").toLooseEqual("Score 4");
    expect(q1PlainData.isNode, "it is not a node").toLooseEqual(false);
    expect((<any>q1PlainData).score, "score is correct").toLooseEqual(4);

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
    expect(surveyScore, "overall survey score for answered questions").toLooseEqual(11);

    Serializer.removeProperty("itemvalue", "score");
  });

  test("question.getPlainData - select base - multiple select - other", () => {
    var question = new QuestionCheckboxModel("q1");
    new JsonObject().toObject(
      {
        type: "checkbox",
        name: "q1",
        showOtherItem: true,
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
    question.otherValue = "Other value text";

    const plainData = question.getPlainData();
    expect(plainData.value).toEqualValues(["other", "giraffe"]);
    expect(plainData.isNode).toLooseEqual(true);
    expect(plainData.data.length).toEqualValues(2);
    expect(plainData.data[0].isNode).toEqualValues(false);
    expect(plainData.data[0].isOther).toEqualValues(true);
    expect(plainData.data[0].value).toEqualValues("other");
    expect(plainData.data[0].title).toEqualValues("Choice option");
    expect(plainData.data[0].displayValue).toEqualValues("Other value text");
    expect(plainData.data[1].isNode).toEqualValues(false);
    expect(plainData.data[1].value).toEqualValues("giraffe");
    expect(plainData.data[1].title).toEqualValues("Choice option");
  });

  test("question.getPlainData - select base - multiple select - comment", () => {
    var question = new QuestionCheckboxModel("q1");
    new JsonObject().toObject(
      {
        type: "checkbox",
        name: "q1",
        showCommentArea: true,
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
    expect(plainData.value).toEqualValues(["giraffe"]);
    expect(plainData.isNode).toLooseEqual(true);
    expect(plainData.data.length).toEqualValues(2);
    expect(plainData.data[0].isNode).toEqualValues(false);
    expect(plainData.data[0].isComment).toEqualValues(true);
    expect(plainData.data[0].title).toEqualValues("Comment");
    expect(plainData.data[0].value).toEqualValues("-Comment");
    expect(plainData.data[0].displayValue).toEqualValues("Comment text");
    expect(plainData.data[1].value).toEqualValues("giraffe");
    expect(plainData.data[1].title).toEqualValues("Choice option");
  });

  test("question.getPlainData - select base - single select - other", () => {
    var question = new QuestionCheckboxModel("q1");
    new JsonObject().toObject(
      {
        type: "radiogroup",
        name: "q1",
        showOtherItem: true,
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
    question.otherValue = "Other value text";

    var plainData = question.getPlainData();
    expect(plainData.value).toEqualValues(["other"]);
    expect(plainData.isNode).toLooseEqual(true);
    expect(plainData.data.length).toEqualValues(1);
    expect(plainData.data[0].isNode).toEqualValues(false);
    expect(plainData.data[0].isOther).toEqualValues(true);
    expect(plainData.data[0].value).toEqualValues("other");
    expect(plainData.data[0].title).toEqualValues("Choice option");
    expect(plainData.data[0].displayValue).toEqualValues("Other value text");
  });

  test("question.getPlainData - select base - single select - comment", () => {
    var question = new QuestionCheckboxModel("q1");
    new JsonObject().toObject(
      {
        type: "radiogroup",
        name: "q1",
        showCommentArea: true,
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
    expect(plainData.value).toEqualValues(["giraffe"]);
    expect(plainData.isNode).toLooseEqual(true);
    expect(plainData.data.length).toEqualValues(2);
    expect(plainData.data[0].isNode).toEqualValues(false);
    expect(plainData.data[0].isComment).toEqualValues(true);
    expect(plainData.data[0].title).toEqualValues("Comment");
    expect(plainData.data[0].value).toEqualValues("-Comment");
    expect(plainData.data[0].displayValue).toEqualValues("Comment text");
    expect(plainData.data[1].value).toEqualValues("giraffe");
    expect(plainData.data[1].title).toEqualValues("Choice option");
  });

  test("question.getPlainData - markdown processed titles - T3888 - question#getPlainData() returns markdown-rendered values, but not markdown-rendered titles", () => {
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
    expect(plainData.value).toEqualValues("giraffe");
    expect(plainData.title).toEqualValues("Title <>marked<>");
    expect(plainData.displayValue).toEqualValues("giraffe <>marked<>");
  });

  test("question.getPlainData - optional question type", () => {
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
    expect(plainData.name).toEqualValues("q1");
    expect(plainData.questionType).toEqualValues(undefined);

    plainData = question.getPlainData({ includeQuestionTypes: true });
    expect(plainData.name).toEqualValues("q1");
    expect(plainData.questionType).toEqualValues("radiogroup");
  });

  test("question.getPlainData - optional survey values", () => {
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
    expect(plainData.length).toEqualValues(1);
    delete plainData[0]["getString"];
    delete plainData[0]["data"];
    expect(plainData[0], "Question only").toEqualValues({
      "displayValue": "1",
      "isNode": true,
      "name": "question1",
      "title": "question1",
      "value": 1
    });

    plainData = survey.getPlainData({ includeValues: true });
    expect(plainData.length).toEqualValues(2);
    delete plainData[0]["getString"];
    delete plainData[0]["data"];
    delete plainData[1]["getString"];
    delete plainData[1]["data"];
    expect(plainData[0], "Question").toEqualValues({
      "displayValue": "1",
      "isNode": true,
      "name": "question1",
      "title": "question1",
      "value": 1
    });
    expect(plainData[1], "Value").toEqualValues({
      "displayValue": "test",
      "isNode": false,
      "name": "customValue",
      "title": "customValue",
      "value": "test"
    });
  });

  test("question.getPlainData - matrix includeEmpty, #11052", () => {
    var question = new QuestionMatrixModel("q1");
    new JsonObject().toObject(
      {
        columns: [
          { value: "Column 1" },
          { value: "Column 2" },
          { value: "Column 3" },
        ],
        rows: [{ value: "Row 1", text: "Row 1 title" }, "Row 2", "Row 3"],
      },
      question
    );
    question.value = { "Row 1": "Column 1" };

    var plainData = question.getPlainData({ includeEmpty: true });
    expect(plainData.isNode).toLooseEqual(true);
    expect(plainData.data.length, "All 3 rows are included with includeEmpty: true").toLooseEqual(3);
    expect(plainData.data[0].name).toLooseEqual("Row 1");
    expect(plainData.data[0].title).toLooseEqual("Row 1 title");
    expect(plainData.data[0].value).toLooseEqual("Column 1");
    expect(plainData.data[0].displayValue).toLooseEqual("Column 1");
    expect(plainData.data[1].name).toLooseEqual("Row 2");
    expect(plainData.data[1].title).toLooseEqual("Row 2");
    expect(plainData.data[1].value, "Empty row value is undefined").toLooseEqual(undefined);
    expect(plainData.data[2].name).toLooseEqual("Row 3");
    expect(plainData.data[2].title).toLooseEqual("Row 3");
    expect(plainData.data[2].value, "Empty row value is undefined").toLooseEqual(undefined);
  });

  test("question.getPlainData - matrixdropdown includeEmpty, #11052", () => {
    var question = new QuestionMatrixDropdownModel("q1");
    new JsonObject().toObject(
      {
        columns: [
          { name: "Column 1" },
          { name: "Column 2" },
          { name: "Column 3" },
        ],
        choices: [1, 2, 3, 4, 5],
        rows: [{ value: "Row 1", text: "Row 1 Title" }, "Row 2"],
      },
      question
    );
    question.value = {
      "Row 1": { "Column 1": 1 },
    };

    var plainData = question.getPlainData({ includeEmpty: true });
    expect(plainData.isNode).toLooseEqual(true);
    expect(plainData.data.length, "Both rows are included").toLooseEqual(2);
    expect(plainData.data[0].name).toLooseEqual("Row 1");
    expect(plainData.data[0].title).toLooseEqual("Row 1 Title");
    expect(plainData.data[0].data.length, "All 3 columns in Row 1 with includeEmpty").toLooseEqual(3);
    expect(plainData.data[0].data[0].name).toLooseEqual("Column 1");
    expect(plainData.data[0].data[0].value, "Column 1 has value").toLooseEqual(1);
    expect(plainData.data[0].data[1].name).toLooseEqual("Column 2");
    expect(plainData.data[0].data[1].value, "Column 2 is empty").toLooseEqual(undefined);
    expect(plainData.data[0].data[2].name).toLooseEqual("Column 3");
    expect(plainData.data[0].data[2].value, "Column 3 is empty").toLooseEqual(undefined);
    expect(plainData.data[1].name).toLooseEqual("Row 2");
    expect(plainData.data[1].data.length, "All 3 columns in Row 2 with includeEmpty").toLooseEqual(3);
    expect(plainData.data[1].data[0].name).toLooseEqual("Column 1");
    expect(plainData.data[1].data[0].value, "Row 2 Column 1 is empty").toLooseEqual(undefined);
    expect(plainData.data[1].data[1].name).toLooseEqual("Column 2");
    expect(plainData.data[1].data[1].value, "Row 2 Column 2 is empty").toLooseEqual(undefined);
    expect(plainData.data[1].data[2].name).toLooseEqual("Column 3");
    expect(plainData.data[1].data[2].value, "Row 2 Column 3 is empty").toLooseEqual(undefined);
  });

  test("question.getPlainData - matrixdropdown includeEmpty false, #11052", () => {
    var question = new QuestionMatrixDropdownModel("q1");
    new JsonObject().toObject(
      {
        columns: [
          { name: "Column 1" },
          { name: "Column 2" },
          { name: "Column 3" },
        ],
        choices: [1, 2, 3, 4, 5],
        rows: [{ value: "Row 1", text: "Row 1 Title" }, "Row 2"],
      },
      question
    );
    question.value = {
      "Row 1": { "Column 1": 1 },
    };

    var plainData = question.getPlainData({ includeEmpty: false });
    expect(plainData.isNode).toLooseEqual(true);
    expect(plainData.data.length, "Both rows are included").toLooseEqual(2);
    expect(plainData.data[0].name).toLooseEqual("Row 1");
    expect(plainData.data[0].title).toLooseEqual("Row 1 Title");
    expect(plainData.data[0].data.length, "Only 1 column with value in Row 1").toLooseEqual(1);
    expect(plainData.data[0].data[0].name).toLooseEqual("Column 1");
    expect(plainData.data[0].data[0].value, "Column 1 has value").toLooseEqual(1);
    expect(plainData.data[1].name).toLooseEqual("Row 2");
    expect(plainData.data[1].data.length, "No columns with values in Row 2").toLooseEqual(0);
  });

  test("question.valueName is numeric, Bug# 1432", () => {
    var survey = new SurveyModel({
      elements: [
        {
          name: "name",
          type: "text",
          valueName: 10,
        },
      ],
    });
    var question = survey.getQuestionByValueName("10");
    expect(question.name, "The question has been found").toLooseEqual("name");
  });

  test("Show several errors based on validation", () => {
    var survey = new SurveyModel({
      elements: [
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
    question.validate(true);
    expect(question.errors.length, "There are 4 errors should be shown").toLooseEqual(4);
  });

  test("getCustomErrorText for error", () => {
    var survey = new SurveyModel({
      elements: [
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
    survey.pages[0].validate(true);
    expect(question.errors[0].getText(), "survey.onErrorCustomText works").toLooseEqual("!!!Question Name");
  });
  test("Value changing/changed call count for empty values, #1564", () => {
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
    expect(valueChangingCount, "value changing call count should be 1").toLooseEqual(1);
    expect(valueChangedCount, "value changed call count should be 0").toLooseEqual(0);
    survey.setValue("q1", "");
    expect(valueChangingCount, "value changing call count should be 2").toLooseEqual(2);
    expect(valueChangedCount, "value changed call count should be 0").toLooseEqual(0);
  });

  test("Values from invisible rows should be removed, #1644", () => {
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
    expect(survey.data, "Remove value for invisible row").toEqualValues({ q1: 2, q2: { row2: "col2" } });
  });

  test("Values from invisible choices should be removed, #1644", () => {
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
    expect(survey.data, "Remove values for invisible choices").toEqualValues({ q1: 2, q3: ["val2"] });
  });

  test("True/False strings do not work, Bug #https://surveyjs.answerdesk.io/ticket/details/T2425", () => {
    var json = {
      elements: [
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
    expect(html1Q.isVisible, "html1 is not visible by default").toLooseEqual(false);
    expect(html2Q.isVisible, "html2 is not visible by default").toLooseEqual(false);
    boolQ.value = "True";
    expect(html1Q.isVisible, "True, html1 is visible").toLooseEqual(true);
    expect(html2Q.isVisible, "True, html2 is invisible").toLooseEqual(false);
    boolQ.value = "False";
    expect(boolQ.value, "Value set correctly").toLooseEqual("False");
    expect(survey.getValue("bool"), "Value set correctly in survey").toLooseEqual("False");
    expect(html1Q.isVisible, "False, html1 is invisible").toLooseEqual(false);
    expect(html2Q.isVisible, "False, html2 is visible").toLooseEqual(true);
  });

  test("Test onValidatePage event", () => {
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
    survey.onValidatePage.add(function (sender, options) {
      counter++;
      errors = options.errors;
      questions = options.questions;
    });
    expect(counter, "Nothing yet heppend").toLooseEqual(0);
    survey.nextPage();
    expect(counter, "called one time").toLooseEqual(1);
    expect(errors.length, "there are two errors").toLooseEqual(2);
    expect(questions.length, "there are two questions have errors").toLooseEqual(2);

    survey.setValue("q1", "val1");
    survey.nextPage();
    expect(counter, "called 2 times").toLooseEqual(2);
    expect(errors.length, "there is one error, #1").toLooseEqual(1);
    expect(questions.length, "there is one error, #2").toLooseEqual(1);

    survey.setValue("q2", "val2");
    survey.nextPage();
    expect(counter, "called three times").toLooseEqual(3);
    expect(errors.length, "there is no errors").toLooseEqual(0);
    expect(questions.length, "there is no errors").toLooseEqual(0);

    survey.checkErrorsMode = "onValueChanged";

    survey.setValue("q3", "val3");
    expect(counter, "called four times").toLooseEqual(4);
    expect(errors.length, "there is one error, #3").toLooseEqual(1);
    expect(questions.length, "there is one error, #4").toLooseEqual(1);

    survey.setValue("q3", "a@b.com");
    expect(counter, "called five times").toLooseEqual(5);
    expect(errors.length, "there is no errors").toLooseEqual(0);
    expect(questions.length, "there is no errors").toLooseEqual(0);

    survey.setValue("q3", "a@c.com");
    expect(counter, "called five times - it doesn't called this time").toLooseEqual(5);
    expect(errors.length, "there is no errors").toLooseEqual(0);
    expect(questions.length, "there is no errors").toLooseEqual(0);

    survey.clearValue("q3");
    expect(counter, "Do not call errors validation on clearing value").toLooseEqual(5);
    expect(errors.length, "there is no errors on clearing value").toLooseEqual(0);
    survey.tryComplete();
    expect(counter, "called six times").toLooseEqual(6);
    expect(errors.length, "there are two errors onComplete, #5").toLooseEqual(2);
    expect(questions.length, "there are two question onComplete, #6").toLooseEqual(2);
  });
  test("Server validation - do no fire onValidatedErrorsOnCurrentPage  on changing question value, Bug#5194", () => {
    const survey = new SurveyModel({ "elements": [{ name: "name", type: "text", isRequired: true }] });
    let counter = 0;
    expect(survey.onValidatePage.length, "onValidate page is emtpy").toLooseEqual(0);
    survey.onValidatedErrorsOnCurrentPage.add(function (sender, options) {
      counter++;
    });
    expect(survey.onValidatePage.length, "onValidate page is set").toLooseEqual(1);
    survey.tryComplete();
    expect(survey.state).toLooseEqual("running");
    expect(counter, "On complete").toLooseEqual(1);
    survey.setValue("name", "Jon");
    expect(counter, "We do not make complete").toLooseEqual(1);
    survey.tryComplete();
    expect(counter, "Do complete again").toLooseEqual(2);
  });
  test("onValidatePage doesn't include internal question errors, Bug#9331", () => {
    const survey = new SurveyModel({ "elements": [{ name: "name", type: "matrixdynamic", columns: [{ name: "col1", cellType: "text", isRequired: true }], rowCount: 2 }] });
    let counter = 0;
    let errorCount = 0;
    let questionCount = 0;
    survey.onValidatePage.add(function (sender, options) {
      errorCount = options.errors.length;
      questionCount = options.questions.length;
      counter++;
    });
    survey.tryComplete();
    expect(survey.state).toLooseEqual("running");
    expect(counter, "On complete").toLooseEqual(1);
    expect(errorCount, "options.errors.length").toLooseEqual(2);
    expect(questionCount, "options.questions.length").toLooseEqual(2);
  });
  test("onValidatePage doesn't include internal question errors, Bug#9565", () => {
    const survey = new SurveyModel({ "elements": [{
      name: "q1",
      type: "multipletext",
      isRequired: true,
      items: [{ name: "minvalue", isRequired: true }, { name: "maxvalue", isRequired: true }] }] });
    let counter = 0;
    let errorCount = 0;
    let questions = undefined;
    survey.onValidatePage.add(function (sender, options) {
      errorCount = options.errors.length;
      questions = options.questions;
      counter++;
    });
    survey.tryComplete();
    expect(survey.state).toLooseEqual("running");
    expect(counter, "On complete").toLooseEqual(1);
    expect(errorCount, "options.errors.length").toLooseEqual(3);
    expect(questions.length, "options.questions.length").toLooseEqual(3);
    expect(questions[0].name, "questions[0].name").toLooseEqual("q1");
    expect(questions[1].name, "questions[1].name").toLooseEqual("minvalue");
    expect(questions[2].name, "questions[2].name").toLooseEqual("maxvalue");
  });
  test("Adding errors in onValidatePage handler should prevent navigation, Bug#11171", () => {
    const survey = new SurveyModel({
      pages: [
        {
          name: "page1",
          elements: [
            { type: "text", name: "q1" },
            { type: "text", name: "q2" },
          ],
        },
        {
          name: "page2",
          elements: [
            { type: "text", name: "q3" },
          ],
        },
      ],
    });
    survey.onValidatePage.add(function (sender, options) {
      const q1Val = Number(survey.getValue("q1")) || 0;
      const q2Val = Number(survey.getValue("q2")) || 0;
      if (q1Val + q2Val > 100) {
        options.errors.push(new CustomError("The total must not exceed 100"));
        options.questions = options.page.questions;
      }
    });
    survey.setValue("q1", 60);
    survey.setValue("q2", 50);
    expect(survey.currentPageNo, "Start on page 0").toLooseEqual(0);
    survey.nextPage();
    expect(survey.currentPageNo, "Should stay on page 0 because onValidatePage added errors").toLooseEqual(0);
    survey.setValue("q2", 30);
    survey.nextPage();
    expect(survey.currentPageNo, "Should move to page 1 when total <= 100").toLooseEqual(1);
  });

  test("survey.completedHtmlOnCondition", () => {
    var survey = new SurveyModel();
    survey.completedHtml = "1";
    expect(survey.renderedCompletedHtml, "get from completed html").toLooseEqual("1");
    survey.completedHtmlOnCondition.push(new HtmlConditionItem("{q1} = 2", "2"));
    survey.completedHtmlOnCondition.push(new HtmlConditionItem("{q1} = 3", "3"));
    expect(survey.completedHtmlOnCondition[0].getSurvey(), "There is survey in completedHtmlOnCondition").toBeTruthy();
    expect(survey.renderedCompletedHtml, "still get from completed html").toLooseEqual("1");
    survey.setValue("q1", 2);
    expect(survey.renderedCompletedHtml, "get from first on Condition").toLooseEqual("2");
    survey.setValue("q1", 3);
    expect(survey.renderedCompletedHtml, "get from second on Condition").toLooseEqual("3");
    survey.setValue("q1", 5);
    expect(survey.renderedCompletedHtml, "get from completed html again").toLooseEqual("1");
  });

  test("survey.completedHtmlOnCondition + localization", () => {
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
    expect(survey.completedHtmlOnCondition.length, "OnCondition restored correctly").toLooseEqual(1);
    survey.setValue("q1", 2);
    expect(survey.renderedCompletedHtml, "get on condition en").toLooseEqual("en-condition");
    var prevLocale = survey.locale;
    survey.locale = "fr";
    expect(survey.renderedCompletedHtml, "get on condition fr").toLooseEqual("fr-condition");
    survey.locale = prevLocale;
  });

  test("survey.navigateToUrlOnCondition", () => {
    var survey = new SurveyModel();
    survey.navigateToUrl = "1";
    expect(survey.getNavigateToUrl(), "get from navigateToUrl").toLooseEqual("1");
    survey.navigateToUrlOnCondition.push(new UrlConditionItem("{q1} = 2", "2"));
    survey.navigateToUrlOnCondition.push(new UrlConditionItem("{q1} = 3", "3"));
    expect(survey.getNavigateToUrl(), "still get from navigateToUrl").toLooseEqual("1");
    survey.setValue("q1", 2);
    expect(survey.getNavigateToUrl(), "get from first on Condition").toLooseEqual("2");
    survey.setValue("q1", 3);
    expect(survey.getNavigateToUrl(), "get from second on Condition").toLooseEqual("3");
    survey.setValue("q1", 5);
    expect(survey.getNavigateToUrl(), "get from navigateToUrl again").toLooseEqual("1");
  });

  test("survey.navigateToUrlOnCondition + processValue", () => {
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
    expect(survey.getNavigateToUrl(), "data is empty").toLooseEqual("url--url");
    survey.data = { q1: "value1", q2: "value2" };
    expect(survey.getNavigateToUrl(), "use value in navigateToUrl prop").toLooseEqual("url-value1-url");
    survey.setValue("q1", 2);
    expect(survey.getNavigateToUrl(), "use value in condition url prop").toLooseEqual("url-value2-url");
  });
  test("survey.navigateToUrlOnCondition + processValue + displayvalue", () => {
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
    expect(survey.getNavigateToUrl(), "data is empty").toLooseEqual("url--url");
    survey.data = { q1: 1, q2: 1 };
    expect(survey.getNavigateToUrl(), "use value in navigateToUrl prop, #1").toLooseEqual("url-1-url");
    survey.setValue("q1", 2);
    expect(survey.getNavigateToUrl(), "use value in condition url prop, #2").toLooseEqual("url-2-url");
  });
  test("survey.navigateToUrlOnCondition + localization", () => {
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
    expect(survey.navigateToUrlOnCondition.length, "OnCondition restored correctly").toLooseEqual(1);
    survey.setValue("q1", 2);
    expect(survey.getNavigateToUrl(), "get on condition en").toLooseEqual("en-condition");
    var prevLocale = survey.locale;
    survey.locale = "fr";
    expect(survey.getNavigateToUrl(), "get on condition fr").toLooseEqual("fr-condition");
    survey.locale = prevLocale;
  });

  test("survey.navigateTo - calling logic", () => {
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
    expect(counter, "onNavigate has been called one time").toLooseEqual(1);
    survey.clear();
    var completeOptions = null;
    survey.onComplete.add(function (sender, options) {
      options.showSaveInProgress();
      completeOptions = options;
    });
    survey.doComplete();
    expect(counter, "onNavigate has been called one time only - wait for showDataSavingSuccess").toLooseEqual(1);
    completeOptions.showSaveSuccess();
    expect(counter, "onNavigate has been called two times").toLooseEqual(2);
  });

  test("page.clearErrors function", () => {
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
    expect(rows[0].cells[0].question.isRequired, "The matrix cell question is required.").toLooseEqual(true);
    page.validate();
    expect(question.errors.length, "There is one error in text question").toLooseEqual(1);
    expect(dPanel.panels[0].questions[0].errors.length, "There is one error in question in dynamic panel").toLooseEqual(1);
    expect(rows[0].cells[0].question.errors.length, "There is one error in question cell").toLooseEqual(1);
    page.clearErrors();
    expect(question.errors.length, "Error is cleared in text question").toLooseEqual(0);
    expect(dPanel.panels[0].questions[0].errors.length, "Error is cleared in question in dynamic panel").toLooseEqual(0);
    expect(rows[0].cells[0].question.errors.length, "Error is cleared in question cell").toLooseEqual(0);
  });
  test("multipletext - question is empty for empty string, bug# https://surveyjs.answerdesk.io/ticket/details/T2000", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("p");
    var question = <QuestionMultipleTextModel>(
      page.addNewQuestion("multipletext", "q1")
    );
    question.addItem("text1");
    question.addItem("text2");
    question.value = { text1: "val1" };
    expect(survey.data, "The data is here").toEqualValues({ q1: { text1: "val1" } });
    question.items[0].value = "";
    expect(survey.data, "survey is empty").toEqualValues({});
    expect(question.isEmpty(), "question is empty").toLooseEqual(true);
  });

  test("valueName for matrix dynamic and panel dynamic with different question set, bug# https://surveyjs.answerdesk.io/ticket/details/T2059", () => {
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
    expect(survey.data, "The initial value").toEqualValues({ shared: [{ elementId: 1 }] });
    rows1[0].cells[1].value = "col1_Value";
    expect(survey.data, "set matrix1 col1").toEqualValues({ shared: [{ elementId: 1, col1: "col1_Value" }] });
    rows2[0].cells[0].value = "col2_Value";
    expect(survey.data, "set matrix2 col2").toEqualValues({ shared: [{ elementId: 1, col1: "col1_Value", col2: "col2_Value" }] });
    panels1[0].getQuestionByName("ed1").value = "ed1_Value";
    expect(survey.data, "set panel1 ed1").toEqualValues({
      shared: [
        {
          elementId: 1,
          col1: "col1_Value",
          col2: "col2_Value",
          ed1: "ed1_Value",
        },
      ],
    });
    rows2[0].cells[0].value = "col2_Value2";
    expect(survey.data, "replace matrix2 col2").toEqualValues({
      shared: [
        {
          elementId: 1,
          col1: "col1_Value",
          col2: "col2_Value2",
          ed1: "ed1_Value",
        },
      ],
    });
    survey.clearIncorrectValues();
    expect(survey.data, "keep all data since they are all correct").toEqualValues({
      shared: [
        {
          elementId: 1,
          col1: "col1_Value",
          col2: "col2_Value2",
          ed1: "ed1_Value",
        },
      ],
    });
  });
  test("valueName for matrix dynamic and panel dynamic with different question and display text processing, bug# https://surveyjs.answerdesk.io/ticket/details/T2053", () => {
    const survey = new SurveyModel({
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
    });
    const matrix1 = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix1");
    const panel1 = <QuestionPanelDynamicModel>survey.getQuestionByName("panel1");
    const rows1 = matrix1.visibleRows;
    rows1[0].cells[1].value = 1;
    expect(survey.data, "set matrix1 col1").toEqualValues({ shared: [{ elementId: 1, col1: 1 }] });
    panel1.panels[0].getQuestionByName("ed1").value = 1;
    expect(matrix1.getDisplayValue(false)).toEqualValues([{ elementId: "1", col1: "Item 1", ed1: "Item 10" }]);
    expect(panel1.getDisplayValue(false)).toEqualValues([{ elementId: "1", col1: "Item 1", ed1: "Item 10" }]);
    expect(panel1.panels[0].locTitle.renderedHtml, "Get the display text").toLooseEqual("Item 1");
  });

  test("Test element.moveTo function", () => {
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
    expect(q1.parent.name, "q1.parent = page1").toLooseEqual("page1");
    q1.moveTo(page2);
    expect(q1.parent.name, "q1.parent = page1").toLooseEqual("page2");
    expect(page2.indexOf(q1), "The last element on the page").toLooseEqual(3);
    q1.moveTo(page2, survey.getQuestionByName("q5"));
    expect(page2.indexOf(q1), "The first element on the page").toLooseEqual(0);
    q1.moveTo(page2, -1);
    expect(page2.indexOf(q1), "The last element on the page again").toLooseEqual(3);
    q1.moveTo(page2, 1);
    expect(page2.indexOf(q1), "The second element on the page").toLooseEqual(1);
    q1.moveTo(panel2, survey.getQuestionByName("q2"));
    expect(q1.parent.name, "q1.parent = p1").toLooseEqual("p2");
    expect(panel2.indexOf(q1), "The first element on panel: p2").toLooseEqual(0);
    panel2.moveTo(page2, survey.getPanelByName("p3"));
    expect(panel2.parent.name, "q1.parent = p1").toLooseEqual("page2");
    expect(page2.indexOf(panel2), "The second element on page2").toLooseEqual(1);
  });

  test("Test question/panel/page delete function", () => {
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
    expect(panel.elements.length, "two questions in panel in the beginning").toLooseEqual(2);
    panel.questions[0].delete();
    expect(panel.elements.length, "one question in panel now").toLooseEqual(1);
    expect(survey.pages[0].elements.length, "There are two elements in page1").toLooseEqual(2);
    panel.delete();
    expect(survey.pages[0].elements.length, "There is one element in page1").toLooseEqual(1);
    expect(survey.pages[1].elements.length, "There are two elements in page2").toLooseEqual(2);
    survey.pages[1].questions[0].delete();
    expect(survey.pages[1].elements.length, "There is one element in page2").toLooseEqual(1);
    expect(survey.pages.length, "There are two pages in survey").toLooseEqual(2);
    survey.pages[0].delete();
    expect(survey.pages.length, "There is one page in survey").toLooseEqual(1);
  });

  test("Expression validators with async functions", () => {
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
    expect(survey.currentPageNo, "First page, 1").toLooseEqual(0);
    returnResult1(0);
    returnResult2(0);
    expect(survey.currentPageNo, "First page, 2").toLooseEqual(0);
    survey.nextPage();
    expect(survey.currentPageNo, "First page, 3").toLooseEqual(0);
    returnResult1(1);
    expect(survey.currentPageNo, "First page, 4").toLooseEqual(0);
    returnResult2(2);
    expect(survey.currentPageNo, "Second page, async validation is over").toLooseEqual(1);

    FunctionFactory.Instance.unregister("asyncFunc1");
    FunctionFactory.Instance.unregister("asyncFunc2");
  });

  test("hasCurrentPageErrors with async", () => {
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
    expect(survey.hasCurrentPageErrors(func), "We don't know, we return undefined").toLooseEqual(undefined);
    expect(asyncHasErrors, "It is not executed yet").toLooseEqual(undefined);
    returnResult1(0);
    expect(asyncHasErrors, "Has errors").toLooseEqual(true);
    asyncHasErrors = undefined;
    survey.hasCurrentPageErrors(func);
    expect(asyncHasErrors, "It is not executed yet, #2").toLooseEqual(undefined);
    returnResult1(1);
    expect(asyncHasErrors, "Not all executed, #2").toLooseEqual(undefined);
    returnResult2(2);
    expect(asyncHasErrors, "Has no errors").toLooseEqual(false);

    FunctionFactory.Instance.unregister("asyncFunc1");
    FunctionFactory.Instance.unregister("asyncFunc2");
  });
  test("validate with async", () => {
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
    expect(survey.validate(false, false, func), "We don't know, we return undefined").toLooseEqual(undefined);
    expect(asyncHasErrors, "It is not executed yet").toLooseEqual(undefined);
    returnResult1(0);
    expect(asyncHasErrors, "Has errors").toLooseEqual(true);
    asyncHasErrors = undefined;
    survey.validate(false, false, func);
    expect(asyncHasErrors, "It is not executed yet, #2").toLooseEqual(undefined);
    returnResult1(1);
    expect(asyncHasErrors, "Not all executed, #2").toLooseEqual(undefined);
    returnResult2(2);
    expect(asyncHasErrors, "Has no errors").toLooseEqual(false);

    FunctionFactory.Instance.unregister("asyncFunc1");
    FunctionFactory.Instance.unregister("asyncFunc2");
  });

  test("visibleIf with async functions", () => {
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
    expect(q1.isVisible, "Hide initially, q1").toLooseEqual(false);
    expect(q2.isVisible, "Hide initially, q2").toLooseEqual(false);
    returnResult1(0);
    returnResult2(0);
    expect(q1.isVisible, "Hide, q1 = 0").toLooseEqual(false);
    expect(q2.isVisible, "Hide, q2 = 0").toLooseEqual(false);
    returnResult1(1);
    expect(q1.isVisible, "Show, q1 = 1").toLooseEqual(true);
    expect(q2.isVisible, "Hide, q2 = 0").toLooseEqual(false);
    returnResult2(2);
    expect(q1.isVisible, "Show, q1 = 1").toLooseEqual(true);
    expect(q2.isVisible, "Hide, q2 = 2").toLooseEqual(true);
    FunctionFactory.Instance.unregister("asyncFunc1");
    FunctionFactory.Instance.unregister("asyncFunc2");
  });
  test("visibleIf with calculated values that uses async functions", () => {
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
    expect(q1.isVisible, "Hide initially, q1").toLooseEqual(false);
    returnResult1(0);
    expect(q1.isVisible, "Hide, calc1 = 0").toLooseEqual(false);
    returnResult1(1);
    expect(q1.isVisible, "Show, calc1 = 1").toLooseEqual(true);
    returnResult1(2);
    expect(q1.isVisible, "Hide, calc1 = 2").toLooseEqual(false);
    FunctionFactory.Instance.unregister("asyncFunc1");
  });

  test("Hide required errors, add tests for Bug#2679", () => {
    var survey = twoPageSimplestSurvey();
    var q1 = survey.getQuestionByName("question1");
    q1.isRequired = true;
    survey.nextPage();
    expect(q1.errors.length, "There is one error").toLooseEqual(1);
    expect(q1.errors[0].visible, "It is visible").toLooseEqual(true);
    expect(q1.hasVisibleErrors, "There is a visible error").toLooseEqual(true);
    survey.clear(true, true);
    survey.hideRequiredErrors = true;
    survey.nextPage();
    expect(q1.errors.length, "There is one error").toLooseEqual(1);
    expect(q1.errors[0].visible, "It is invisible").toLooseEqual(false);
    expect(q1.hasVisibleErrors, "There is no visible Errors").toLooseEqual(false);
  });
  test("survey.onSettingQuestionErrors", () => {
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
    expect(q1.errors.length, "There is one error").toLooseEqual(1);
    expect(q1.errors[0].visible, "It is invisible").toLooseEqual(false);
    expect(q2.errors.length, "Add one error into second question").toLooseEqual(1);
  });
  test("survey.onValidateQuestion wors as survey.onSettingQuestionErrors", () => {
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
    expect(q1.errors.length, "There is one error").toLooseEqual(1);
    expect(q1.errors[0].visible, "It is invisible").toLooseEqual(false);
    expect(q2.errors.length, "Add one error into second question").toLooseEqual(1);
  });

  test("Check containsError property", () => {
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
    expect(panelDynamic.containsErrors, "It doesn't contain errors by default").toLooseEqual(false);
    expect(survey.isCurrentPageHasErrors, "The page has Errors").toLooseEqual(true);
    expect(panelDynamic.containsErrors, "Dynamic panel contains errros").toLooseEqual(true);
    expect(panel.containsErrors, "panel contains errors").toLooseEqual(true);
    expect(question.containsErrors, "question contains errors").toLooseEqual(true);
    expect(questionMultiple.items[0].editor.containsErrors, "question multiple item contains errors").toLooseEqual(true);
    expect(questionMultiple.containsErrors, "question multiple contains errors").toLooseEqual(true);
    expect(questionMatrixDropdown.containsErrors, "MatrixDropdown contains errors").toLooseEqual(true);
    survey.data = {
      panel1: [{ question1: 1 }, { question1: 1 }],
      question2: 2,
      question3: 3,
      question4: { q1_m1: 1 },
      question5: { row1: { col1: 1 } },
    };
    expect(panelDynamic.containsErrors, "contains errros is not updated yet").toLooseEqual(true);
    expect(survey.isCurrentPageHasErrors, "The page has no errors").toLooseEqual(false);
    expect(panelDynamic.containsErrors, "Dynamic panel contains no errros").toLooseEqual(false);
    expect(panel.containsErrors, "panel contains no errors").toLooseEqual(false);
    expect(question.containsErrors, "question contains no errors").toLooseEqual(false);
    expect(questionMultiple.containsErrors, "question multiple contains no errors").toLooseEqual(false);
    expect(questionMatrixDropdown.containsErrors, "MatrixDropdown contains no errors").toLooseEqual(false);
  });
  test("Check containsError property for panel dynamic with checkErrorsMode: 'onValueChanged'", () => {
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
    expect(panelDynamic.containsErrors, "It doesn't contain errors by default").toLooseEqual(false);
    question.value = "1";
    expect(panelDynamic.containsErrors, "The panel has no errors").toLooseEqual(false);
    question.value = "";
    expect(panelDynamic.containsErrors, "We show errors").toLooseEqual(true);
    question.value = "1";
    expect(panelDynamic.containsErrors, "The panel has no errors again").toLooseEqual(false);
    panelDynamic.value = [{}];
    expect(question.isEmpty(), "Question is empty").toLooseEqual(true);
    expect(panelDynamic.containsErrors, "We do not show error on value change in panel itself").toLooseEqual(false);
    survey.tryComplete();
    expect(panelDynamic.containsErrors, "The panel has errors after value changed to empty. Show it on next page event").toLooseEqual(true);
  });
  test("Check isAnswered property", () => {
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
    expect(panelDynamic.isAnswered, "Paneldynamic is not answered").toLooseEqual(false);
    expect(questionMultiple.isAnswered, "Multiple text is not answered").toLooseEqual(false);
    expect(question.isAnswered, "Question is not  answered").toLooseEqual(false);
    expect(questionMatrixDropdown.isAnswered, "Paneldynamic is not answered").toLooseEqual(false);
    survey.data = {
      panel1: [{ question1: 1 }, {}],
      question2: 3,
      question3: { q1_m1: 1 },
      question4: { row1: { col1: 1 } },
    };
    expect(panelDynamic.isAnswered, "Paneldynamic is not fully answered").toLooseEqual(false);
    expect(questionMultiple.isAnswered, "Multiple text is not fully answered").toLooseEqual(false);
    expect(question.isAnswered, "Question is answered").toLooseEqual(true);
    expect(questionMatrixDropdown.isAnswered, "Paneldynamic is not fully answered").toLooseEqual(false);
    survey.data = {
      panel1: [{ question1: 1 }, { question1: 2 }],
      question3: { q1_m1: 1, q2_m1: 2 },
      question4: { row1: { col1: 1, col2: 2 } },
    };
    expect(panelDynamic.isAnswered, "Paneldynamic is fully answered").toLooseEqual(true);
    expect(questionMultiple.isAnswered, "Multiple text is fully answered").toLooseEqual(true);
    expect(questionMatrixDropdown.isAnswered, "Paneldynamic is fully answered").toLooseEqual(true);
  });

  test("Two matrix with same valueName, clear values for invisible rows only, Bug# https://surveyjs.answerdesk.io/ticket/details/T2713", () => {
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
    expect(survey.data).toEqualValues({
      a: { item1: "1", item2: "2", item3: "1", item4: "3" },
    });
    survey.doComplete();
    expect(survey.data).toEqualValues({
      a: { item1: "1", item2: "2", item3: "1", item4: "3" },
    });
  });

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

  test("Expression operator get display text using question.title and question.displayValue", () => {
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
    expect(str).toLooseEqual("({Question 1} + 1)");
    str = expressionToDisplay.toDisplayText("{q1} = 1");
    expect(str).toLooseEqual("({Question 1} == one)");
    str = expressionToDisplay.toDisplayText("{q1} = [1, 2]");
    expect(str).toLooseEqual("({Question 1} == [one, two])");
    str = expressionToDisplay.toDisplayText(
      "{q1} = 2 or (1 != {q1} and {q2} contains [1, 2]) or {q3} = 1"
    );
    expect(str, "Use question title and display text").toLooseEqual("((({Question 1} == two) or ((one != {Question 1}) and ({Question 2} contains [one, two]))) or ({q3} == 1))");
  });

  test("Expression doesn't work correctly with iif function, Bug#1942", () => {
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
    expect(survey.getValue("question2"), "iif true").toLooseEqual("a[a]");
    survey.setValue("question1", "item1");
    expect(survey.getValue("question2"), "iif false").toLooseEqual("ax");
    survey.clearValue("question3");
    expect(survey.getValue("question2"), "iif false where question3 is empty").toLooseEqual("x");
  });

  test("Different css for different surveys", () => {
    var json = { elements: [{ type: "text", name: "q" }] };
    var survey1 = new SurveyModel();
    setOldTheme(survey1);
    var survey2 = new SurveyModel();
    setOldTheme(survey2);
    var defaultQuestionRoot = survey1.css.question.mainRoot;
    survey1.css.question.mainRoot += " class1";
    survey2.css.question.mainRoot += " class2";
    survey1.fromJSON(json);
    survey2.fromJSON(json);
    expect(survey1.css.question.mainRoot, "Correct css name for survey1").toLooseEqual(defaultQuestionRoot + " class1");
    expect(survey2.css.question.mainRoot, "Correct css name for survey2").toLooseEqual(defaultQuestionRoot + " class2");
    var question1 = survey1.getQuestionByName("q");
    var question2 = survey2.getQuestionByName("q");
    expect(question1.cssRoot, "Correct css name for question1").toLooseEqual(defaultQuestionRoot + " class1");
    expect(question2.cssRoot, "Correct css name for question2").toLooseEqual(defaultQuestionRoot + " class2");
  });

  test("Question css classes", () => {
    var survey = new SurveyModel();
    setOldTheme(survey);
    survey.css.question.hasError = "error";
    survey.css.question.small = "small";
    survey.css.question.title = "title";
    survey.css.question.titleOnError = "onError";
    survey.css.question.titleOnAnswer = "onAnswer";
    survey.fromJSON({
      elements: [{ type: "text", name: "q1", isRequired: true }],
    });
    var q1 = survey.getQuestionByName("q1");
    expect(q1.errors.length, "There is not errors").toLooseEqual(0);
    var defaultQuestionRoot = survey.css.question.mainRoot;
    expect(q1.cssRoot, "Default question root").toLooseEqual(defaultQuestionRoot + " small");
    expect(q1.cssTitle, "Default question title").toLooseEqual("title");
    q1.titleLocation = "left";
    var addLeft = " " + survey.css.question.titleLeftRoot;
    expect(q1.cssRoot, "titleLocation = left").toLooseEqual(defaultQuestionRoot + addLeft + " small");
    q1.width = "40%";
    expect(q1.cssRoot, "titleLocation = left and remove small").toLooseEqual(defaultQuestionRoot + addLeft);
    q1.titleLocation = "default";
    expect(q1.cssRoot, "titleLocation = default and remove small").toLooseEqual(defaultQuestionRoot);
    survey.validate();
    var addError = " " + survey.css.question.hasError;
    expect(q1.cssRoot, "has error").toLooseEqual(defaultQuestionRoot + addError);
    expect(q1.cssTitle, "question title, on error").toLooseEqual("title onError");
    q1.value = "somevalue";
    survey.validate();
    expect(q1.cssRoot, "no errors").toLooseEqual(defaultQuestionRoot);
    expect(q1.cssTitle, "question title, on answer").toLooseEqual("title onAnswer");
    q1.clearValue();
    expect(q1.cssTitle, "question title clear").toLooseEqual("title");
    q1.value = "somevalue";
    expect(q1.cssTitle, "question title on answer 2").toLooseEqual("title onAnswer");
    survey.questionTitleLocation = "left";
    expect(q1.cssRoot, "survey.questionTitleLocation = left").toLooseEqual(defaultQuestionRoot + addLeft);
  });

  test("Survey<=Base propertyValueChanged", () => {
    var json = { title: "title", elements: [{ type: "text", name: "q" }] };
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

    expect(counter, "initial").toLooseEqual(0);

    survey.title = "new";
    expect(counter, "callback called").toLooseEqual(1);
    expect(log, "callback called for title").toLooseEqual("->title");
  });

  test("Survey.onPropertyValueChangedCallback for validators and triggers", () => {
    var json = {
      title: "title",
      elements: [
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

    expect(counter, "initial").toLooseEqual(0);

    (<SurveyTriggerSetValue>survey.triggers[0]).setValue = "3";

    expect(counter, "trigger: callback called").toLooseEqual(1);
    expect(propName, "trigger: property name is correct").toLooseEqual("setValue");
    expect(testOldValue, "trigger: oldValue is correct").toLooseEqual("2");
    expect(testNewValue, "trigger: newValue is correct").toLooseEqual("3");
    expect(senderType, "trigger: sender is correct").toLooseEqual("setvaluetrigger");
    (<TextValidator>survey.getQuestionByName("q1").validators[0]).maxLength = 5;
    expect(counter, "validator: callback called").toLooseEqual(2);
    expect(propName, "validator: property name is correct").toLooseEqual("maxLength");
    expect(testOldValue, "validator: oldValue is correct").toLooseEqual(3);
    expect(testNewValue, "validator: newValue is correct").toLooseEqual(5);
    expect(senderType, "validator: sender is correct").toLooseEqual("textvalidator");
  });

  test("Survey questionTitleTemplate -> questionTitlePattern", () => {
    var survey = new SurveyModel();
    expect(survey.questionTitlePattern, "default value").toLooseEqual("numTitleRequire");
    survey.questionTitleTemplate = "{require} {no}{title}";
    expect(survey.questionTitlePattern, "{require} {no}{title}").toLooseEqual("requireNumTitle");
    survey.questionTitleTemplate = "{no}{require} {title}";
    expect(survey.questionTitlePattern, "{no}{require} {title}").toLooseEqual("numRequireTitle");
    survey.questionTitleTemplate = "{title}";
    expect(survey.questionTitlePattern, "{title}").toLooseEqual("numTitle");
    survey.questionTitleTemplate = "{no}{title}{require}";
    expect(survey.questionTitlePattern, "{no}{title}{require}").toLooseEqual("numTitleRequire");
    survey.questionTitleTemplate = "{no}{title}";
    expect(survey.questionTitlePattern, "{no}{title}").toLooseEqual("numTitle");
  });

  test("Survey.getQuestionTitlePatternOptions()", () => {
    var survey = new SurveyModel();
    survey.questionStartIndex = "# 1.";
    survey.requiredMark = "(*)";
    var options = survey.getQuestionTitlePatternOptions();
    expect(options).toEqualValues([
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

  test("Survey.getQuestionByName with caseInsensitive equals to true, Bug ##2051", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "text",
          name: "Q1",
        },
      ],
    });
    expect(survey.getQuestionByName("q1", true), "q1").toBeTruthy();
    expect(survey.getQuestionByName("Q1", true), "Q1").toBeTruthy();
  });

  test("Survey hasLogo", () => {
    var survey = new SurveyModel({});
    expect(survey.hasLogo).toBeFalsy();
    expect(survey.logoPosition).toLooseEqual("left");
    expect(!!survey.locLogo.renderedHtml).toBeFalsy();
    survey.logo = "some url";
    expect(survey.hasLogo).toBeTruthy();
    expect(survey.getPropertyValue("hasLogo")).toBeTruthy();
  });

  test("Survey hasLogo is reactive", () => {
    var survey = new SurveyModel({
      logo: "an url"
    });
    expect(survey.hasLogo).toBeTruthy();
    expect(survey.getPropertyValue("hasLogo")).toBeTruthy();
  });

  test("Survey isLogoBefore/isLogoAfter", () => {
    var survey = new SurveyModel({});
    expect(!!survey.locLogo.renderedHtml).toBeFalsy();
    expect(survey.logoPosition).toLooseEqual("left");

    expect(survey.isLogoBefore).toBeFalsy();
    expect(survey.isLogoAfter).toBeFalsy();

    survey.logo = "some url";
    expect(survey.isLogoBefore).toBeTruthy();
    expect(survey.isLogoAfter).toBeFalsy();

    survey.logoPosition = "top";
    expect(survey.isLogoBefore).toBeTruthy();
    expect(survey.isLogoAfter).toBeFalsy();

    survey.logoPosition = "right";
    expect(survey.isLogoBefore).toBeFalsy();
    expect(survey.isLogoAfter).toBeTruthy();

    survey.logoPosition = "bottom";
    expect(survey.isLogoBefore).toBeFalsy();
    expect(survey.isLogoAfter).toBeTruthy();

    survey.logoPosition = "none";
    expect(survey.isLogoBefore).toBeFalsy();
    expect(survey.isLogoAfter).toBeFalsy();
  });

  test("Survey logoClassNames", () => {

    var survey = new SurveyModel({});
    setOldTheme(survey);
    expect(survey.logoPosition).toLooseEqual("left");

    expect(survey.logoClassNames).toLooseEqual("sv_logo sv-logo--left");

    survey.logoPosition = "top";
    expect(survey.logoClassNames).toLooseEqual("sv_logo sv-logo--top");

    survey.logoPosition = "right";
    expect(survey.logoClassNames).toLooseEqual("sv_logo sv-logo--right");

    survey.logoPosition = "bottom";
    expect(survey.logoClassNames).toLooseEqual("sv_logo sv-logo--bottom");

    survey.logoPosition = "none";
    expect(survey.logoClassNames).toLooseEqual("sv_logo");
  });
  test("Survey.onQuestionCreated", () => {
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
    expect(survey.getQuestionByName("q1").tag, "onQuestionCreated calls for a standard question").toLooseEqual("was here");
    expect(survey.getQuestionByName("q2").visibleRows[0].cells[0].question.tag, "onQuestionCreated calls for a matrix cell question").toLooseEqual("was here");
    expect(survey.getQuestionByName("q3").items[0].editor.tag, "onQuestionCreated calls for a multiple text question").toLooseEqual("was here");
    expect(survey.getQuestionByName("q4").panels[0].questions[0].tag, "onQuestionCreated calls for a multiple text question").toLooseEqual("was here");
  });
  test("Survey.checkErrorsMode=onValueChanged, some errors should be shown onNextPage only, matrix", () => {
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
    expect(question1.errors.length, "There is no errors yet").toLooseEqual(0);
    survey.tryComplete();
    expect(question1.errors.length, "There is one error, isAllRowRequried").toLooseEqual(1);
    question1.value = { "Row 1": "Column 3" };
    expect(question1.errors.length, "The error was not fixed").toLooseEqual(1);
    question1.value = { "Row 1": "Column 3", "Row 2": "Column 3" };
    expect(question1.errors.length, "The error is gone").toLooseEqual(0);
  });
  test("Survey.checkErrorsMode=onValueChanged, some errors should be shown onNextPage only, multipletext", () => {
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
    expect(survey.data, "Data set correctly").toEqualValues({ question1: { item1: "value1" } });
    expect(question1.errors.length, "There is no errors yet").toLooseEqual(0);
    expect(question1.items[1].editor.errors.length, "There is no errors in item2").toLooseEqual(0);
    survey.tryComplete();
    expect(question1.items[1].editor.errors.length, "There is one error, isRequired").toLooseEqual(1);
    question1.items[0].editor.value = "value1_1";
    expect(question1.items[0].editor.errors.length, "There is no errors in the first editor").toLooseEqual(0);
    expect(question1.items[1].editor.errors.length, "The error is not fixed").toLooseEqual(1);
    question1.items[1].editor.value = "value2";
    expect(question1.items[1].editor.errors.length, "The error is gone").toLooseEqual(0);
  });
  test("Remove errors on settings correct values, multipletext", () => {
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
    expect(question1.items[0].editor.errors.length, "There is required error in item1").toLooseEqual(1);
    expect(question1.items[1].editor.errors.length, "There is required error in item2").toLooseEqual(1);
    question1.items[0].editor.value = "val1";
    expect(question1.items[0].editor.errors.length, "There is no errors in item1").toLooseEqual(0);
    expect(question1.items[1].editor.errors.length, "There is still required error in item2").toLooseEqual(1);
    question1.items[1].editor.value = "val2";
    expect(question1.items[1].editor.errors.length, "There is no errors in item2").toLooseEqual(0);
  });
  test("Remove errors on settings correct values, paneldynamic", () => {
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
    expect(panel.panels[0].questions[0].errors.length, "There is required error in question").toLooseEqual(1);
    panel.panels[0].questions[0].value = "val1";
    expect(panel.panels[0].questions[0].errors.length, "There is no errors in question").toLooseEqual(0);
  });
  test("Remove errors on settings correct values, matrtixdynamic", () => {
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
    expect(question.errors.length, "There is required error in question").toLooseEqual(1);
    question.value = "val1";
    expect(question.errors.length, "There is no errors in question").toLooseEqual(0);
  });
  test("Survey.checkErrorsMode=onValueChanged, do not set incorrect value #8928, Revert #2141", () => {
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
    expect(question1.errors.length, "There is one error").toLooseEqual(1);
    expect(survey.getValue("birthdate"), "There is no incorrect value in survey data").toBeFalsy();
    question1.value = "2000-01-02";
    expect(question1.errors.length, "There is no errors").toLooseEqual(0);
    expect(survey.getValue("birthdate"), "The value is correct").toBeTruthy();
  });
  test("Update question errors on value change if question has error already regardless survey.checkErrorsMode property. #2265", () => {
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
    expect(q1.errors.length, "q1 is required").toLooseEqual(1);
    expect(q2.errors.length, "q2 is required").toLooseEqual(1);
    expect(q2.errors[0].getErrorType(), "q2 error is require").toLooseEqual("required");
    q1.value = "some value";
    q2.value = "some value";
    expect(q1.errors.length, "q1 has value and we remove error").toLooseEqual(0);
    expect(q2.errors.length, "q2 has value and we remove error required error, but there is e-mail error").toLooseEqual(1);
    expect(q2.errors[0].getErrorType(), "q2 error - wrong e-mail format").not.toLooseEqual("required");
    q2.value = "jon_snow@nightwatch.org";
    expect(q2.errors.length, "q2 has no errors").toLooseEqual(0);
  });
  test("Update question errors on other text change if survey.checkErrorsMode property is 'onValueChanged'. Bug#1854", () => {
    const survey = new SurveyModel({
      checkErrorsMode: "onValueChanged",
      elements: [
        {
          type: "dropdown",
          name: "q1",
          choices: [1, 2],
          showOtherItem: true,
        },
      ],
    });
    const q1 = <QuestionDropdownModel>survey.getQuestionByName("q1");
    q1.value = q1.otherItem.value;
    expect(q1.errors.length, "There is no error yet, #1").toLooseEqual(0);
    q1.otherValue = "some value1";
    expect(q1.errors.length, "There is no error - there is a value, #2").toLooseEqual(0);
    q1.otherValue = "";
    expect(q1.errors.length, "There is an error right now, #3").toLooseEqual(1);
    q1.otherValue = "some value2";
    expect(q1.errors.length, "There is no error again, #4").toLooseEqual(0);
    q1.value = 1;
    q1.value = q1.otherItem.value;
    expect(q1.otherValue, "Comment is empty").toLooseEqual("");
    expect(q1.errors.length, "There is no error - comment was cleaned, #5").toLooseEqual(0);
  });
  test("Update question errors on other text change if question has error already. Bug #1854", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "dropdown",
          name: "q1",
          choices: [1, 2],
          showOtherItem: true,
        },
      ],
    });
    var q1 = <QuestionDropdownModel>survey.getQuestionByName("q1");
    q1.value = q1.otherItem.value;
    survey.tryComplete();
    expect(q1.errors.length, "There is an error right now").toLooseEqual(1);
    q1.otherValue = "some value";
    expect(q1.errors.length, "There is no error now").toLooseEqual(0);
  });
  test("dispose survey - https://github.com/surveyjs/survey-library/issues/2131", () => {
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
    expect(survey.pages.length, "One page").toLooseEqual(1);
    expect(survey.pages[0].elements.length, "One element").toLooseEqual(1);
    survey.dispose();
    if (!!survey.pages) {
      expect(survey.pages.length, "No pages").toLooseEqual(0);
    }
  });

  test("visibleIf doens't work correctly, Bug #2193", () => {
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
    expect(question.isVisible, "question should be invisible").toLooseEqual(false);
  });

  test("Avoid stack overrflow in triggers, Bug #2202", () => {
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
    expect(survey.getValue("q1"), "q1 is set, no stackoverflow").toLooseEqual(1);
    expect(survey.getValue("q2"), "q2 is set, no stackoverflow").toLooseEqual(2);
  });

  test("Question showNumber visibility depending on parent settings, https://surveyjs.answerdesk.io/ticket/details/t4504/survey-creator-can-we-hide-show-number-property-on-questions-if-numbering-is-off-at-form", () => {
    var survey = new SurveyModel({
      showQuestionNumbers: true,
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

    expect(property.visibleIf(question), "Visible by default").toBeTruthy();

    question.titleLocation = "hidden";
    expect(property.visibleIf(question), "Invisible for hidden title").toBeFalsy();

    question.titleLocation = "default";
    panel.showQuestionNumbers = "off";
    expect(property.visibleIf(question), "Invisible due to parent settings").toBeFalsy();

    panel.showQuestionNumbers = "default";
    survey.showQuestionNumbers = "off";
    expect(property.visibleIf(question), "Invisible due to survey settings").toBeFalsy();

    panel.showQuestionNumbers = "onpanel";
    expect(property.visibleIf(question), "Visible because of onpanel").toBeTruthy();

    var propertyStartIndex = Serializer.findProperty(
      "survey",
      "questionStartIndex"
    );
    expect(propertyStartIndex.visibleIf(survey), "Invisible due to survey settings").toBeFalsy();

    survey.showQuestionNumbers = "default";
    expect(propertyStartIndex.visibleIf(survey), "Visible by default").toBeTruthy();
  });
  test("Update question title css on changing page.questionTitleLocation", () => {
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
    expect(q1.getPropertyValue("cssHeader", "").trim()).toLooseEqual("title-left");
  });

  test("Pages visibleIndex doesn't set correctly, https://surveyjs.answerdesk.io/ticket/details/T4506, Bug#2248", () => {
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
              showNumber: false,
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
              showNumber: false,
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
              showNumber: false,
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
    expect(survey.pages[1].isVisible, "The second page is invisible").toLooseEqual(false);
    expect(survey.pages[1].visibleIndex, "The second page visible index is -1").toLooseEqual(-1);
    expect(survey.pages[4].isVisible, "The 5th page is visible").toLooseEqual(true);
    expect(survey.pages[4].visibleIndex, "The fourth page visible index is 1").toLooseEqual(1);
  });
  test("Change pages visibleIndex on page visibilityChange, https://surveyjs.answerdesk.io/ticket/details/T4506, Bug#2248", () => {
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
    expect(survey.pages[1].isVisible, "The second page is invisible initially").toLooseEqual(false);
    expect(survey.pages[1].visibleIndex, "The second page visible index is -1 initially").toLooseEqual(-1);
    expect(survey.pages[2].isVisible, "The third page is invisible initially").toLooseEqual(false);
    expect(survey.pages[2].visibleIndex, "The third page visible index is -1 initially").toLooseEqual(-1);
    survey.setValue("question1", "item2");
    expect(survey.pages[1].isVisible, "The second page is invisible").toLooseEqual(false);
    expect(survey.pages[1].visibleIndex, "The second page visible index is -1").toLooseEqual(-1);
    expect(survey.pages[2].isVisible, "The third page is visible").toLooseEqual(true);
    expect(survey.pages[2].visibleIndex, "The third page visible index is 1").toLooseEqual(1);
  });
  test("Do allow to set incrorect name", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("p1");
    var panel = page.addNewPanel(" panel1");
    var question = page.addNewQuestion("text", "{q1");
    expect(page.name, "Remove trailing space from page").toLooseEqual("p1");
    expect(panel.name, "Remove trailing space from panel").toLooseEqual("panel1");
    expect(question.name, "Remove trailing space and { from question").toLooseEqual("q1");
    question.name = " {q2} s ";
    expect(question.name, "Remove trailing space and { } from question").toLooseEqual("q2 s");
  });
  test("comment doesn't set when storeOthersAsComment equals false, Bug#2353", () => {
    var survey = new SurveyModel({
      storeOthersAsComment: false,
      elements: [
        {
          type: "radiogroup",
          name: "test",
          title: "My Test field",
          choices: ["A", "B", "C"],
          showCommentArea: true,
        },
      ],
    });
    survey.data = {
      test: "B",
      "test-Comment": "ABC",
    };
    var question = survey.getQuestionByName("test");
    expect(question.comment, "Comment text set correctly").toLooseEqual("ABC");
  });
  test("question.clickTitleFunction, Bug#2312", () => {
    var survey = new SurveyModel({
      elements: [
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
    expect(q1.clickTitleFunction, "q1 has click title function").toBeTruthy();
    expect(q2.clickTitleFunction, "q2 has not click title function, no input").toBeFalsy();
  });
  test("survey.getProgressInfo()", () => {
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
    expect(survey.getProgressInfo()).toEqualValues({
      questionCount: 12,
      answeredQuestionCount: 3,
      requiredQuestionCount: 5,
      requiredAnsweredQuestionCount: 2,
    });
  });
  test("trigger to copy matrix dropdown cell ", () => {
    var survey = new SurveyModel({
      elements: [
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
    expect(survey.data, "trigger works correctly").toEqualValues({ q1: { row1: { col1: "cell1" } }, q2: { row3: { col3: "cell1" } } });
  });

  test("defaultValue and survey.clearInvisibleValues='onHidden', Bug#2428", () => {
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
    expect(q1.isEmpty(), "Question is invisible").toLooseEqual(true);
    q1.visible = true;
    expect(q1.isEmpty(), "Question is visible").toLooseEqual(false);
    expect(q1.value, "get value from defaultValue").toLooseEqual(1);
    q1.visible = false;
    expect(q1.isEmpty(), "Question is invisible #2").toLooseEqual(true);
    q1.visible = true;
    expect(q1.isEmpty(), "Question is visible #2").toLooseEqual(false);
    expect(q1.value, "get value from defaultValue #2").toLooseEqual(1);
  });
  test("defaultValue and survey.clearInvisibleValues='onHiddenContainer'", () => {
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
    expect(survey.data, "Clear values on clearing panel").toEqualValues({ q3: 3, q4: 4 });
    p1.visible = true;
    expect(survey.data, "Restore default value on making panel visible").toEqualValues({ q1: 5, q3: 3, q4: 4 });
    survey.data = { q1: 1, q2: 2, q3: 3, q4: 4 };
    survey.pages[0].visible = false;
    expect(survey.data, "Clear values on clearing page").toEqualValues({ q4: 4 });
    survey.pages[0].visible = true;
    expect(survey.data, "Restore default value on making page visbile").toEqualValues({ q1: 5, q4: 4 });
  });

  test("Add this.question into custom function for validators", () => {
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
    expect(q1.validate(), "value < 5").toLooseEqual(false);
    expect(hasQuestion, "this.question is not undefined").toLooseEqual(true);
    q1.value = 10;
    expect(q1.validate(), "value > 5").toLooseEqual(true);
    FunctionFactory.Instance.unregister("getCustValue");
    expect(hasQuestion, "this.question is not undefined#2").toLooseEqual(true);
  });
  test("Peform triggers on value changed manually", () => {
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
    expect(survey.data, "Triggers run successful").toEqualValues({ q1: 5, q2: 5, q3: 10, q4: 20 });
  });
  test("Run expression for date", () => {
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
    expect(survey.getValue("q2"), "Set correct date on trigger").toLooseEqual(val);
  });

  test("Update progressText on changing locale, Bug#2453", () => {
    var survey = new SurveyModel();
    survey.addPage(createPageWithQuestion("Page 1"));
    survey.addPage(createPageWithQuestion("Second page", "q2"));
    expect(survey.progressText, "in en").toLooseEqual("Page 1 of 2");
    var oldLocale = survey.locale;
    survey.locale = "de";
    expect(survey.progressText, "in de").toLooseEqual("Seite 1 von 2");
    survey.locale = oldLocale;
  });
  test("Update preview edit button on changing locale, Bug#6523", () => {
    var survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" }
      ]
    });
    survey.showPreview();
    const panel = <PanelModel>survey.currentPage.elements[0];
    expect(survey.locEditText.textOrHtml, "Edit - en").toLooseEqual("Edit");
    const editAction = panel.getFooterToolbar().getActionById("cancel-preview");
    expect(editAction.locTitle.textOrHtml, "Action - en").toLooseEqual("Edit");
    survey.locale = "de";
    expect(survey.locEditText.textOrHtml, "Edit - de").toLooseEqual("Bearbeiten");
    expect(editAction.locTitle.textOrHtml, "Action - de").toLooseEqual("Bearbeiten");
    survey.locale = "";
  });
  test("Focus question on Survey onServerValidateQuestions event, Bug#2464", () => {
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
    expect(survey.getQuestionByName("q1").inputId, "q1 is required").toLooseEqual(focusedQuestionId);
    survey.setValue("q1", "val1");
    focusedQuestionId = "";
    survey.tryComplete();
    expect(survey.getQuestionByName("q2").inputId, "q2 has error").toLooseEqual(focusedQuestionId);
    SurveyElement.FocusElement = oldFunc;
  });
  test("Focus question on Survey onServerValidateQuestions event, Bug#3343", () => {
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
    expect(survey.getQuestionByName("q1").inputId, "q1 is required").toLooseEqual(focusedQuestionId);
    survey.setValue("q1", "val1");
    focusedQuestionId = "";
    survey.tryComplete();
    returnResult(0);
    expect(survey.getQuestionByName("q2").inputId, "q2 has error").toLooseEqual(focusedQuestionId);
    SurveyElement.FocusElement = oldFunc;
  });
  test("Async function with negative result, Bug#7268", () => {
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
    expect(q2.isVisible, "visible #1").toLooseEqual(false);
    q1.value = 1;
    returnResult(false);
    expect(q2.isVisible, "visible #2").toLooseEqual(true);
    FunctionFactory.Instance.unregister("asyncFunc");
  });

  test("Focus errored question when checkErrorsMode: `onComplete` + onServerValidateQuestions, Bug#2466", () => {
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
    expect(survey.currentPageNo, "The first page is active").toLooseEqual(0);
    expect(survey.getQuestionByName("q1").inputId, "q1 is required and q0 is not").toLooseEqual(focusedQuestionId);
    SurveyElement.FocusElement = oldFunc;
  });
  test("Focus errored question when checkErrorsMode: `onComplete` + , Bug#2478", () => {
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
    expect(survey.currentPageNo, "Allow to go the second page").toLooseEqual(1);
    survey.nextPage();
    expect(survey.currentPageNo, "Allow to go the third page").toLooseEqual(2);
    survey.tryComplete();
    expect(survey.currentPageNo, "The first page is active").toLooseEqual(0);
    expect(q1Value, "options.data set correctly").toLooseEqual("val1");
    expect(survey.getQuestionByName("q1").inputId, "q1 is required and q0 is not").toLooseEqual(focusedQuestionId);
    SurveyElement.FocusElement = oldFunc;
  });
  test("Focus errored question when checkErrorsMode: `onComplete` & panel required", () => {
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
    let focusedQuestionName = "";
    let counter = 0;
    let isOnError = false;
    const oldQuestion = survey.focusQuestionByInstance;
    survey.focusQuestionByInstance = (question: Question, onError: boolean = false): boolean => {
      counter ++;
      focusedQuestionName = question.name;
      isOnError = onError;
      return oldQuestion.call(survey, question, onError);
    };
    survey.nextPage();
    survey.nextPage();
    survey.tryComplete();
    expect(survey.currentPageNo, "comeback to the first page").toLooseEqual(0);
    expect(survey.getQuestionByName("q1").name, "panel is required").toLooseEqual(focusedQuestionName);
    expect(counter, "focusQuestion called one time").toLooseEqual(1);
    expect(isOnError, "focusQuestion called with onError = true").toLooseEqual(true);
  });
  test("Do not focus errored question when checkErrorsMode: `onComplete` + autoFocusFirstError = false, Bug#8322", () => {
    var focusedQuestionId = "";
    const oldFunc = SurveyElement.FocusElement;
    SurveyElement.FocusElement = function (elId: string): boolean {
      focusedQuestionId = elId;
      return true;
    };

    const survey = new SurveyModel({
      checkErrorsMode: "onComplete",
      autoFocusFirstError: false,
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
    expect(survey.currentPageNo, "survey.currentPageNo = 1").toLooseEqual(1);
    survey.nextPage();
    expect(survey.currentPageNo, "survey.currentPageNo = 2").toLooseEqual(2);
    focusedQuestionId = "";
    survey.tryComplete();
    survey.afterRenderPage(<HTMLElement>{});
    expect(survey.currentPageNo, "The first page is active").toLooseEqual(0);
    expect(focusedQuestionId, "do not focus any question").toBeFalsy();
    SurveyElement.FocusElement = oldFunc;
  });
  test("onServerValidateQuestions doesn't get called for the last page when showPreviewBeforeComplete is set, Bug#2546", () => {
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
      showPreviewBeforeComplete: true,
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
    expect(counter, "Counter calls 2 times").toLooseEqual(2);
    survey.showPreview();
    expect(counter, "Counter calls 3 times").toLooseEqual(3);
    expect(survey.state, "We are in preview state").toLooseEqual("preview");
    survey.cancelPreview();
    generateError = true;
    survey.showPreview();
    expect(counter, "Counter calls 4 times").toLooseEqual(4);
    expect(survey.state, "We have an error").toLooseEqual("running");
  });
  test("Several onServerValidateQuestions event, bug#4531", () => {
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
    expect(survey.state, "Survey is not completed").toLooseEqual("running");
    expect(survey.getQuestionByName("q2").errors.length, "There is an error in the question").toLooseEqual(1);
  });
  test("Several onServerValidateQuestions event without errors, bug#4531 part2", () => {
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
    expect(survey.state, "Survey is completed").toLooseEqual("completed");
  });
  test("showPreviewBeforeComplete and showProgressBar, Bug#2552", () => {
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
      showPreviewBeforeComplete: true,
      showProgressBar: true,
      progressBarLocation: "bottom",
    });
    survey.nextPage();
    survey.nextPage();
    expect(survey.isShowProgressBarOnBottom, "We need to show progress bar").toLooseEqual(true);
    survey.showPreview();
    expect(survey.isShowProgressBarOnBottom, "We don't need to show progress bar").toLooseEqual(false);
    survey.cancelPreview();
    expect(survey.isShowProgressBarOnBottom, "We need to show progress bar again").toLooseEqual(true);
  });
  test("Update currentPage on showing the only page, Bug#2496", () => {
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
    expect(survey.getPropertyValue("currentPage"), "currentPage is not set").toBeFalsy();
    (<PanelModel>survey.getPanelByName("panel1")).visible = true;
    expect(survey.getPropertyValue("currentPage"), "currentPage is the only page").toBeTruthy();
  });

  test("Expand question on validation error", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("page1");
    var q1 = page.addNewQuestion("text", "q1");
    q1.isRequired = true;
    q1.collapse();
    expect(q1.isCollapsed, "Question1 is collapsed").toLooseEqual(true);
    q1.validate(true);
    expect(q1.isCollapsed, "Question1 is not collapsed").toLooseEqual(false);
    expect(q1.isExpanded, "Question1 is expanded").toLooseEqual(true);
  });

  test("Do not show empty required text", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("page1");
    var q1 = page.addNewQuestion("text", "q1");
    q1.isRequired = true;
    expect(q1.isRequireTextBeforeTitle, "numTitleRequire - No required text before").toLooseEqual(false);
    expect(q1.isRequireTextAfterTitle, "numTitleRequire - Required text after").toLooseEqual(true);
    survey.questionTitlePattern = "numRequireTitle";
    expect(q1.isRequireTextBeforeTitle, "numRequireTitle - Required text before").toLooseEqual(true);
    expect(q1.isRequireTextAfterTitle, "numRequireTitle - No required text after").toLooseEqual(false);
    survey.requiredMark = "";
    expect(q1.isRequireTextBeforeTitle, "numRequireTitle - No required text before ''").toLooseEqual(false);
    expect(q1.isRequireTextAfterTitle, "numRequireTitle - No required text after ''").toLooseEqual(false);
    survey.questionTitlePattern = "numTitleRequire";
    expect(q1.isRequireTextBeforeTitle, "numTitleRequire - No required text before ''").toLooseEqual(false);
    expect(q1.isRequireTextAfterTitle, "numTitleRequire - No required text after ''").toLooseEqual(false);
  });

  test("Check onGetPanelTitleActions event", () => {
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
      options.actions = testActions;
    });
    expect(panel.getTitleActions()).toEqualValues(testActions);
  });

  test("Check onGetQuestionTitleActions event", () => {
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
    expect(question.getTitleActions()).toEqualValues(testActions);
  });

  test("Check onGetPageTitleActions event", () => {
    var survey = new SurveyModel({
      pages: [{ title: "Page Title" }],
    });
    var testActions = [{ title: "simple" }, { title: "simple2" }];
    survey.onGetPageTitleActions.add((sender, options) => {
      options.actions = testActions;
    });
    var page = <PageModel>survey.pages[0];
    expect(page.getTitleActions()).toEqualValues(testActions);
  });
  test("Stackoverflow error, https://surveyjs.answerdesk.io//ticket/details/T6023, Bug#2598", () => {
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
      progressBarType: "pages",
      progressBarShowPageTitles: true
    });
    expect(survey.getQuestionByName("q1"), "Do not produce stack-overflow").toBeTruthy();
  });
  test("Do not create otherItem in image picker on loading it from JSON, even if showOtherItem is true, Bug#2603", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "radiogroup",
          name: "q1",
          showOtherItem: true,
          choices: ["item1", "item2", "item3"],
        },
      ],
    });
    var q1 = <QuestionRadiogroupModel>survey.getQuestionByName("q1");
    expect(q1.visibleChoices.length, "There are 4 items").toLooseEqual(4);
    var json = q1.toJSON();
    var q2 = new QuestionImagePickerModel("q2");
    q2.fromJSON(json);
    expect(q2.visibleChoices.length, "There are 3 items").toLooseEqual(3);
  });

  test("onTextRenderAs event", () => {
    var survey = new SurveyModel();
    const questionName = "any question";
    var locString = new LocalizableString(survey, false, "name");

    var renderAs = survey.getRenderer(questionName);
    expect(locString.renderAs).toLooseEqual(LocalizableString.defaultRenderer);
    expect(renderAs).toLooseEqual(undefined);

    survey.setDesignMode(true);
    renderAs = survey.getRenderer(questionName);
    expect(locString.renderAs).toLooseEqual(LocalizableString.editableRenderer);
    expect(renderAs).toLooseEqual(LocalizableString.editableRenderer);

    survey.setDesignMode(false);
    renderAs = survey.getRenderer(questionName);
    expect(locString.renderAs).toLooseEqual(LocalizableString.defaultRenderer);
    expect(renderAs).toLooseEqual(undefined);

    const customRendererView = "my-custom-renderer-view";
    const customRendererEdit = "my-custom-renderer-edit";
    survey.onTextRenderAs.add((s, e) => {
      if (s.isDesignMode) e.renderAs = customRendererEdit;
      else e.renderAs = customRendererView;
    });

    renderAs = survey.getRenderer(questionName);
    expect(locString.renderAs).toLooseEqual(customRendererView);
    expect(renderAs).toLooseEqual(customRendererView);

    survey.setDesignMode(true);
    renderAs = survey.getRenderer(questionName);
    expect(locString.renderAs).toLooseEqual(customRendererEdit);
    expect(renderAs).toLooseEqual(customRendererEdit);

    survey.setDesignMode(false);
    renderAs = survey.getRenderer(questionName);
    expect(locString.renderAs).toLooseEqual(customRendererView);
    expect(renderAs).toLooseEqual(customRendererView);
  });
  test("onElementWrapperComponentName event vs string getRenderer", () => {
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
    expect(locString.renderAs).toLooseEqual(customRendererView);
    expect(renderAs).toLooseEqual(customRendererView);

    survey.setDesignMode(true);
    renderAs = survey.getRenderer(questionName);
    expect(locString.renderAs).toLooseEqual(customRendererEdit);
    expect(renderAs).toLooseEqual(customRendererEdit);

    survey.setDesignMode(false);
    renderAs = survey.getRenderer(questionName);
    expect(locString.renderAs).toLooseEqual(customRendererView);
    expect(renderAs).toLooseEqual(customRendererView);
  });
  test("onElementWrapperComponentData event vs getRendererContextForString", () => {
    const survey = new SurveyModel();
    survey.addNewPage("page1");
    const locString = new LocalizableString(survey, false, "name");

    survey.onElementWrapperComponentData.add((s, e) => {
      if (e.wrapperName !== "string") return;
      e.data = { str: e.data, el: e.element };
    });
    const res = survey.getRendererContextForString(survey.pages[0], locString);
    expect(res.str.name, "string is correct").toLooseEqual("name");
    expect(res.el.name, "element is correct").toLooseEqual("page1");
  });

  test("Make inputs read-only in design-mode for V2", () => {
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
    expect(survey.getQuestionByName("q1").isInputReadOnly, "q1").toLooseEqual(true);
    expect(survey.getQuestionByName("q2").isInputReadOnly, "q2").toLooseEqual(true);
  });

  test("forceIsInputReadOnly", () => {
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
    expect(survey.getQuestionByName("q1").isInputReadOnly, "q1").toLooseEqual(true);
    expect(survey.getQuestionByName("q2").isInputReadOnly, "q2").toLooseEqual(true);

    survey.getQuestionByName("q2").forceIsInputReadOnly = false;
    expect(survey.getQuestionByName("q1").isInputReadOnly, "q1").toLooseEqual(true);
    expect(survey.getQuestionByName("q2").isInputReadOnly, "q2 with forceIsInputReadOnly").toLooseEqual(false);
  });

  test("onElementContentVisibilityChanged event", () => {
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
    expect(stateChangedCounter).toLooseEqual(0);

    var panel: PanelModel = <PanelModel>survey.getAllPanels()[0];
    panel.expand();
    expect(stateChangedCounter).toLooseEqual(1);
    panel.expand();
    expect(stateChangedCounter).toLooseEqual(1);
    panel.collapse();
    expect(stateChangedCounter).toLooseEqual(2);
    panel.collapse();
    expect(stateChangedCounter).toLooseEqual(2);
    panel.toggleState();
    expect(stateChangedCounter).toLooseEqual(3);
    panel.toggleState();
    expect(stateChangedCounter).toLooseEqual(4);
    panel.state = "expanded";
    expect(stateChangedCounter).toLooseEqual(5);
  });

  test("base.survey property", () => {
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

    expect(page.survey.state).toLooseEqual("running");
    expect(panel.survey.state).toLooseEqual("running");
    expect(question.survey.state).toLooseEqual("running");
    expect(survey.calculatedValues[0].getSurvey().state).toLooseEqual("running");
    expect(survey.triggers[0].getSurvey().state).toLooseEqual("running");
    expect(question.validators[0].getSurvey().state).toLooseEqual("running");
    expect(matrixDynamic.columns[0].getSurvey().state).toLooseEqual("running");
    expect(matrix.rows[0].getSurvey().state).toLooseEqual("running");
    expect(matrix.columns[0].getSurvey().state).toLooseEqual("running");
    expect(matrixDropdown.rows[0].getSurvey().state).toLooseEqual("running");
    expect(matrixDynamic.columns[0].templateQuestion.survey.state).toLooseEqual("running");
    expect(matrixDynamic.columns[0].choices[0].getSurvey().state).toLooseEqual("running");
    expect(mutlipleText.items[0].getSurvey().state).toLooseEqual("running");
    expect(dropdown.choicesByUrl.getSurvey().state).toLooseEqual("running");
  });

  test("base.getSurvey(live) on removing/adding", () => {
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
    expect(hasSurvey(page2), "Page2 is not deleted").toBeTruthy();
    page2.delete();
    expect(hasSurvey(page2), "Page2 is deleted").toBeFalsy();

    expect(hasSurvey(panel1), "panel1 is not deleted").toBeTruthy();
    expect(hasSurvey(question3), "question3 is not deleted").toBeTruthy();
    panel1.delete();
    expect(hasSurvey(panel1), "panel1 is deleted").toBeFalsy();
    expect(hasSurvey(question3), "question3 is deleted").toBeFalsy();

    expect(hasSurvey(question1), "question1 is not deleted").toBeTruthy();
    question1.delete();
    expect(hasSurvey(question1), "question1 is deleted").toBeFalsy();

    expect(hasSurvey(column1), "column11 is not deleted").toBeTruthy();
    question2.columns.splice(0, 1);
    expect(hasSurvey(column1), "column1 is deleted").toBeFalsy();

    expect(hasSurvey(question2), "question2 is not deleted").toBeTruthy();
    expect(hasSurvey(column2), "column2 is not deleted").toBeTruthy();
    survey.pages.splice(0, 1);
    expect(hasSurvey(page1), "Page1 is deleted").toBeFalsy();
    expect(hasSurvey(question2), "question2 is deleted").toBeFalsy();
    expect(hasSurvey(column2), "column2 is deleted").toBeFalsy();
    survey.pages.push(page1);
    expect(hasSurvey(page1), "Page1 is not deleted again").toBeTruthy();
    expect(hasSurvey(question2), "question2 is not deleted again").toBeTruthy();
    expect(hasSurvey(column2), "column2 is not deleted again").toBeTruthy();
  });
  test("Dispose object during event", () => {
    var survey = new SurveyModel();
    survey.onValueChanged.add(() => {
      survey.dispose();
    });
    var a = 1;
    survey.onValueChanged.add(() => {
      a = 2;
    });
    survey.setValue("b", 1);
    expect(a, "Do not call an event that is after diposing").toLooseEqual(1);
  });
  test("survey.isLazyRendering", () => {
    var survey = new SurveyModel();
    expect(survey.isLazyRendering, "Not set").toLooseEqual(false);
    settings.lazyRowsRendering = true;
    expect(survey.isLazyRendering, "set in settings").toLooseEqual(true);
    settings.lazyRowsRendering = false;
    expect(survey.isLazyRendering, "Not set 2").toLooseEqual(false);
    survey.lazyRenderEnabled = true;
    expect(survey.isLazyRendering, "set in survey").toLooseEqual(true);
  });
  test("getSize", () => {
    expect(getRenderedSize("300px"), "300px").toLooseEqual(300);
    expect(getRenderedStyleSize("300px"), "300px").toLooseEqual(undefined);
    expect(getRenderedSize("100%"), "100%").toLooseEqual(undefined);
    expect(getRenderedStyleSize("100%"), "300px").toLooseEqual("100%");
    expect(getRenderedSize(100), "100px").toLooseEqual(100);
    expect(getRenderedStyleSize(100), "100").toLooseEqual(undefined);
  });
  test("survey logo size", () => {
    var survey = new SurveyModel();
    expect(survey.logoWidth, "auto").toLooseEqual("auto");
    expect(survey.logoHeight, "40px").toLooseEqual("40px");
    expect(survey.renderedLogoWidth).toLooseEqual(undefined);
    expect(survey.renderedLogoHeight).toLooseEqual(40);
    expect(survey.renderedStyleLogoWidth).toLooseEqual("auto");
    expect(survey.renderedStyleLogoHeight).toLooseEqual(undefined);
    survey.logoWidth = "100%";
    survey.logoHeight = "auto";
    expect(survey.logoWidth, "100%").toLooseEqual("100%");
    expect(survey.renderedLogoWidth).toLooseEqual(undefined);
    expect(survey.renderedLogoHeight).toLooseEqual(undefined);
    expect(survey.renderedStyleLogoWidth).toLooseEqual("100%");
    expect(survey.renderedStyleLogoHeight).toLooseEqual("auto");
  });
  test("element.searchText()", () => {
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
    expect(findRes.length, "Find by question title/name").toLooseEqual(3);
    findRes = survey.searchText("My");
    expect(findRes.length, "Find by element title").toLooseEqual(3);
    findRes = survey.searchText("");
    expect(findRes.length, "Empty string returns nothing").toLooseEqual(0);
    findRes = survey.searchText("my");
    expect(findRes.length, "Find by element title, we ignore cases").toLooseEqual(3);
    findRes = survey.searchText("item");
    expect(findRes.length, "Find choices").toLooseEqual(2);
    expect(findRes[1].element["name"], "Find choices").toLooseEqual("question2");
  });
  test("send notification on setLocale change for survey.title", () => {
    var survey = new SurveyModel();
    var newValue;
    survey.onPropertyChanged.add((sender, options) => {
      newValue = options.newValue;
    });
    survey.locTitle.setLocaleText("", "new title");
    expect(survey.title, "survey title is correct").toLooseEqual("new title");
    expect(newValue, "we send notification").toLooseEqual("new title");
  });
  test("send notification on setLocale change for survey.dataList", () => {
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
    expect(q1.dataList, "question dataList is correct").toEqualValues(["Item 1", "Item 2", "Item 3"]);
    expect(newValue, "we send notification").toEqualValues({ default: ["Item 1", "Item 2", "Item 3"] });
    expect(oldValue, "old Value is correct").toEqualValues({ default: ["Item 1", "Item 2"] });
  });

  test("onAfterRenderPage calls incorrect for the first page when there is the started page, Bug #", () => {
    var survey = new SurveyModel({
      firstPageIsStartPage: true,
      pages: [
        {
          name: "Start Page",
          elements: [
            {
              type: "html",
              html: "1",
            },
          ],
        },
        {
          name: "First Page",
          elements: [
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
    expect(pageName, "We render the started page").toLooseEqual("Start Page");
    survey.start();
    survey.afterRenderPage(undefined);
    expect(pageName, "We render the first page").toLooseEqual("First Page");
  });
  test("Custom widget, test canShowInToolbox read-only property", () => {
    CustomWidgetCollection.Instance.clear();

    var readOnlyCounter = 0;
    var widget = CustomWidgetCollection.Instance.addCustomWidget({
      name: "first",
    });
    expect(widget.canShowInToolbox, "widget is activated by property").toLooseEqual(false);
    widget = CustomWidgetCollection.Instance.addCustomWidget(
      {
        name: "second",
      },
      "customtype"
    );
    expect(widget.canShowInToolbox, "widget is activated by customtype").toLooseEqual(true);
    var isLoaded = false;
    widget.widgetJson.widgetIsLoaded = (): boolean => {
      return isLoaded;
    };
    expect(widget.canShowInToolbox, "widget is not loaded").toLooseEqual(false);
    isLoaded = true;
    expect(widget.canShowInToolbox, "widget is loaded").toLooseEqual(true);
    widget.showInToolbox = false;
    expect(widget.canShowInToolbox, "widget is not show in toolbox").toLooseEqual(false);
    widget.showInToolbox = true;
    expect(widget.canShowInToolbox, "widget is show in toolbox").toLooseEqual(true);

    CustomWidgetCollection.Instance.clear();
  });
  test("getElementWrapperComponentName", () => {
    var survey = new SurveyModel();
    expect(survey.getElementWrapperComponentName(null), "default component").toEqualValues(SurveyModel.TemplateRendererComponentName);
    expect(survey.getElementWrapperComponentName(null, "logo-image"), "logo-image default component").toEqualValues("sv-logo-image");
  });
  test("getQuestionContentWrapperComponentName", () => {
    var survey = new SurveyModel();
    expect(survey.getQuestionContentWrapperComponentName(null), "default component").toEqualValues(SurveyModel.TemplateRendererComponentName);
  });
  test("onElementWrapperComponentName event", () => {
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
    expect(survey.getElementWrapperComponentName(q1, "test1"), "#1").toLooseEqual("sv-template-renderer#1");
    expect(survey.getQuestionContentWrapperComponentName(q1), "#2").toLooseEqual("sv-template-renderer#2");
    expect(survey.getRowWrapperComponentName(new QuestionRowModel(survey.pages[0])), "#3").toLooseEqual("sv-template-renderer#3");
    expect(survey.getItemValueWrapperComponentName(q2.choices[0], q2), "#4").toLooseEqual("sv-template-renderer#4");
  });
  test("onElementWrapperComponentName event", () => {
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
    expect(survey.getElementWrapperComponentData(q1, "test1"), "#1").toLooseEqual("#1");
    expect(survey.getRowWrapperComponentData(new QuestionRowModel(survey.pages[0])), "#2").toLooseEqual("#2");
    expect(survey.getItemValueWrapperComponentData(q2.choices[0], q2), "#3").toLooseEqual("#3");
    expect(survey.getMatrixCellTemplateData(q3.visibleRows[0].cells[0]), "#4").toLooseEqual("#4");
  });
  test("Skip trigger test and auto focus first question on the page", () => {
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
    expect(survey.currentPage.name, "We moved to another page").toLooseEqual("page2");
    expect(focusedQuestions.length, "Only one question was focused").toLooseEqual(1);
    expect(focusedQuestions[0], "The third question is focused").toLooseEqual(survey.getQuestionByName("q3").inputId);
    SurveyElement.FocusElement = oldFunc;
  });

  test("Skip trigger test and navigate back", () => {
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
    expect(survey.currentPage.name, "We moved to another page").toLooseEqual("page3");
    survey.prevPage();
    expect(survey.currentPage.name, "We returned to first page skipping second").toLooseEqual("page1");
    survey.getQuestionByName("q1").value = "item1";
    survey.nextPage();
    expect(survey.currentPage.name, "We moved to second page").toLooseEqual("page2");
    survey.nextPage();
    expect(survey.currentPage.name, "We moved to third page").toLooseEqual("page3");
    survey.prevPage();
    expect(survey.currentPage.name, "We returned to second page").toLooseEqual("page2");
  });
  test("Skip trigger test and navigate back & questionPerPage, Bug#9886", () => {
    const survey = new SurveyModel({
      questionsOnPageMode: "questionPerPage",
      elements: [
        {
          type: "radiogroup",
          name: "q1",
          choices: ["item1", "item2", "item3"],
        },
        {
          type: "text",
          name: "q2",
        },
        {
          type: "text",
          name: "q3",
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
    expect(survey.currentSingleQuestion.name, "We moved to another page").toLooseEqual("q3");
    survey.prevPage();
    expect(survey.currentSingleQuestion.name, "We returned to first page skipping second").toLooseEqual("q1");
    survey.getQuestionByName("q1").value = "item1";
    survey.nextPage();
    expect(survey.currentSingleQuestion.name, "We moved to second page").toLooseEqual("q2");
    survey.nextPage();
    expect(survey.currentSingleQuestion.name, "We moved to third page").toLooseEqual("q3");
    survey.prevPage();
    expect(survey.currentSingleQuestion.name, "We returned to second page").toLooseEqual("q2");
  });

  test("Two skip triggers test", () => {
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
    expect(focusedQuestions.length, "First skip").toLooseEqual(1);
    expect(focusedQuestions[0], "The second question is focused").toLooseEqual(survey.getQuestionByName("q2").inputId);
    survey.getQuestionByName("q1").value = "item3";
    expect(focusedQuestions.length, "Second skip").toLooseEqual(2);
    expect(focusedQuestions[1], "The third question is focused").toLooseEqual(survey.getQuestionByName("q3").inputId);
    SurveyElement.FocusElement = oldFunc;
  });
  test("Skip trigger and 'other' value", () => {
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
    expect(survey.currentPage.name, "We are still on the first page").toLooseEqual("page1");
    survey.getQuestionByName("q1").otherValue = "abc";
    expect(survey.currentPage.name, "We moved to another page").toLooseEqual("page3");
  });
  test("Skip trigger and calculated values, Bug#10376", () => {
    const survey = new SurveyModel({
      pages: [
        {
          elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }, { type: "text", name: "q3" }
          ]
        },
        { elements: [{ type: "text", name: "q4" }] },
        { elements: [{ type: "text", name: "q5" }] },
      ],
      calculatedValues: [
        { name: "var1", expression: "iif({q1} empty, 0, 1)" },
        { name: "var2", expression: "iif({q2} empty, 0, 1)" },
        { name: "var3", expression: "{var1} + {var2}" },
        { name: "var4", expression: "{var3} > 1" }
      ],
      triggers: [
        {
          type: "skip",
          expression: "{var4} = true",
          gotoName: "q5",
        },
      ],
    });
    expect(survey.currentPage.visibleIndex, "We are on the first page").toLooseEqual(0);
    let counter = 0;
    survey.onCurrentPageChanged.add((sender, options) => {
      counter++;
    });
    survey.getQuestionByName("q1").value = "a";
    survey.getQuestionByName("q2").value = "b";
    expect(survey.getVariable("var1"), "var1 value").toLooseEqual(1);
    expect(survey.getVariable("var2"), "var2 value").toLooseEqual(1);
    expect(survey.getVariable("var3"), "var3 value").toLooseEqual(2);
    expect(survey.getVariable("var4"), "var4 value").toLooseEqual(true);
    expect(survey.currentPage.visibleIndex, "We are on the last page").toLooseEqual(2);
    expect(counter, "We changed the page only one time").toLooseEqual(1);
  });
  test("Test SurveyElement isPage, isPanel and isQuestion properties", () => {
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
    expect(page.isPage, "Page is page").toLooseEqual(true);
    expect(page.isPanel, "Page is not panel").toLooseEqual(false);
    expect(page.isQuestion, "Page is not question").toLooseEqual(false);
    expect(panel.isPage, "Panel is not page").toLooseEqual(false);
    expect(panel.isPanel, "Panel is panel").toLooseEqual(true);
    expect(panel.isQuestion, "Panel is not question").toLooseEqual(false);
    expect(question.isPage, "Question is not page").toLooseEqual(false);
    expect(question.isPanel, "Question is not panel").toLooseEqual(false);
    expect(question.isQuestion, "Question is question").toLooseEqual(true);
  });
  test("Test survey renderedHasTitle/renderedHasLogo properties", () => {
    var survey = new SurveyModel();
    expect(survey["titleIsEmpty"], "titleIsEmpty due to no title").toLooseEqual(true);
    expect(survey.renderedHasHeader, "hasHeader, title and logo are invisible").toLooseEqual(false);
    expect(survey.renderedHasTitle, "There is not title").toLooseEqual(false);
    survey.title = "title";
    expect(survey["titleIsEmpty"], "titleIs not Empty due to title has been set").toLooseEqual(false);
    expect(survey.renderedHasTitle, "There is title").toLooseEqual(true);
    expect(survey.renderedHasHeader, "hasHeader, title is visible").toLooseEqual(true);
    survey.showTitle = false;
    expect(survey.renderedHasTitle, "hasTitle is false").toLooseEqual(false);

    expect(survey.renderedHasLogo, "There is not logo").toLooseEqual(false);
    survey.logo = "logo";
    expect(survey.renderedHasLogo, "There is logo").toLooseEqual(true);
    survey.logoPosition = "none";
    expect(survey.renderedHasTitle, "logo position is 'none'").toLooseEqual(false);

    survey.setDesignMode(true);
    expect(survey.renderedHasTitle, "There is title, design").toLooseEqual(true);
    expect(survey.renderedHasLogo, "There is logo, design").toLooseEqual(true);
    expect(survey.isLogoBefore, "We do not render logo before at design, design").toLooseEqual(false);
    expect(survey.isLogoAfter, "We do render logo after at design, design").toLooseEqual(true);
    expect(survey.renderedHasHeader, "hasHeader, properties are visible").toLooseEqual(true);

    Serializer.findProperty("survey", "title").visible = false;
    Serializer.findProperty("survey", "logo").visible = false;
    expect(survey.renderedHasTitle, "There is no title, design, property invisible").toLooseEqual(false);
    expect(survey.renderedHasLogo, "There is no logo, design, property invisible").toLooseEqual(false);
    expect(survey.isLogoAfter, "We do not render logo after since the property is hidden, design").toLooseEqual(false);
    expect(survey.renderedHasHeader, "hasHeader, properties are invisible").toLooseEqual(false);
    Serializer.findProperty("survey", "title").visible = true;
    Serializer.findProperty("survey", "logo").visible = true;
  });
  test("Test survey renderedHasDescription property", () => {
    var survey = new SurveyModel();
    expect(survey.renderedHasDescription, "hasDescription, decription is invisible").toLooseEqual(false);

    survey.setDesignMode(true);
    expect(survey.renderedHasDescription, "description is visible in design mode").toLooseEqual(true);

    survey.setDesignMode(false);
    survey.description = "description";
    expect(survey.renderedHasDescription, "There is description").toLooseEqual(true);
  });

  test("Test survey renderedHasTitle/renderedHasLogo properties", () => {
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
    expect(surveyPropertyName, "get notification from survey").toLooseEqual("setValue");
    expect(triggerPropertyName, "get notification from trigger").toLooseEqual("setValue");
  });
  test("other and survey.clear", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "dropdown",
          name: "q1",
          showOtherItem: true,
          choices: ["item1", "item2", "item3"],
        },
        {
          type: "checkbox",
          name: "q2",
          showOtherItem: true,
          choices: ["item1", "item2", "item3"],
        },
      ],
    });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    q1.value = "other";
    q1.otherValue = "q1-comment";
    q2.value = ["item1", "other"];
    q2.otherValue = "q2-comment";
    survey.clear();
    expect(q1.otherValue, "after clear - dropdown").toBeFalsy();
    expect(q2.otherValue, "after clear - checkbox").toBeFalsy();
    q1.value = "other";
    q2.value = ["other"];
    expect(q1.otherValue, "after set other - dropdown").toBeFalsy();
    expect(q2.otherValue, "after set other - checkbox").toBeFalsy();
  });
  test("survey.fromJSON with existing model", () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q1" }] });
    survey.fromJSON({ elements: [{ type: "text", name: "q2" }] });
    expect(survey.pages.length).toLooseEqual(1);
    expect(survey.getQuestionByName("q1")).toBeFalsy();
    expect(survey.getQuestionByName("q2")).toBeTruthy();
  });
  test("survey.autoGrowComment", () => {
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

    expect(survey.autoGrowComment, "#1").toLooseEqual(true);
    expect(comment1.renderedAutoGrow, "#2").toLooseEqual(true);
    expect(comment2.renderedAutoGrow, "#3").toLooseEqual(true);

    survey.autoGrowComment = false;
    expect(comment1.renderedAutoGrow, "#4").toLooseEqual(false);
    expect(comment2.renderedAutoGrow, "#5").toLooseEqual(true);
  });
  test("save comment autoGrow && autoResize", () => {
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
    expect(question.toJSON(), "#1").toEqualValues({ name: "q1" });
    question.allowResize = false;
    question.autoGrow = false;
    expect(question.toJSON(), "#2").toEqualValues({ name: "q1", allowResize: false, autoGrow: false });
    question.allowResize = true;
    question.autoGrow = true;
    expect(question.toJSON(), "#3").toEqualValues({ name: "q1", allowResize: true, autoGrow: true });
  });
  test("survey.allowResizeComment", () => {
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

    expect(survey.allowResizeComment).toLooseEqual(false);
    expect(comment1.renderedAllowResize, "comment1 survey.allowResizeComment = false, #1").toLooseEqual(false);
    expect(comment2.renderedAllowResize, "comment2 survey.allowResizeComment = false, #2").toLooseEqual(false);

    survey.allowResizeComment = true;
    expect(comment1.renderedAllowResize, "comment1 survey.allowResizeComment = true, #3").toLooseEqual(true);
    expect(comment2.renderedAllowResize, "comment2 survey.allowResizeComment = true, #4").toLooseEqual(false);

    survey.showPreview();
    let comment1Preview = survey.getQuestionByName("comment1");
    expect(comment1Preview.renderedAllowResize, "#5").toLooseEqual(true);
  });

  test("survey.allowResizeComment & survey.autoGrowComment override this properties for individual properties", () => {
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

    expect(comment1.renderedAllowResize, "comment1 survey.allowResizeComment = false, #1").toLooseEqual(true);
    expect(comment1.renderedAutoGrow, "comment1 survey.autoGrowComment = false, #2").toLooseEqual(true);
    expect(comment2.renderedAllowResize, "comment2 survey.allowResizeComment = false, #3").toLooseEqual(false);
    expect(comment2.renderedAutoGrow, "comment2 survey.autoGrowComment = false, #4").toLooseEqual(false);
    expect(comment3.renderedAutoGrow, "comment2 survey.autoGrowComment = false, #5").toLooseEqual(false);

    survey.allowResizeComment = true;
    survey.autoGrowComment = true;
    expect(comment1.renderedAllowResize, "comment1 survey.allowResizeComment = true, #6").toLooseEqual(true);
    expect(comment1.renderedAutoGrow, "comment1 survey.autoGrowComment = true, #7").toLooseEqual(true);
    expect(comment2.renderedAllowResize, "comment2 survey.allowResizeComment = true, #8").toLooseEqual(true);
    expect(comment2.renderedAutoGrow, "comment2 survey.autoGrowComment = true, #9").toLooseEqual(true);
    expect(comment3.renderedAutoGrow, "comment2 survey.autoGrowComment = true, #10").toLooseEqual(false);
  });

  test("getDefaultPropertyValue for comment properties autoGrow & allowResize", () => {
    let comment = new QuestionCommentModel("q1");

    expect(comment.getDefaultPropertyValue("autoGrow"), "autoGrow").toBe(undefined);
    expect(comment.getDefaultPropertyValue("allowResize"), "allowResize").toBe(undefined);
  });

  test("utils.increaseHeightByContent", () => {
    let element = {
      getBoundingClientRect: () => { return { height: 50, width: 100, x: 10, y: 10 }; },
      scrollHeight: 103,
      get offsetHeight() {
        return this.style.height ? parseFloat(this.style.height) : 79;
      },
      style: { height: null as any },
      getAttribute: (attr: string) => "2"
    };
    let getComputedStyle = () => {
      return {
        "lineHeight": "24px",
        "borderTopWidth": "2px",
        "paddingTop": "12px",
        "paddingBottom": "14px",
        "borderBottomWidth": "3px",
      };
    };
    increaseHeightByContent(<HTMLElement>element, getComputedStyle);
    expect(element.style.height).toLooseEqual("103px");

    element = {
      getBoundingClientRect: () => { return { height: 50, width: 100, x: 10, y: 10 }; },
      get scrollHeight() {
        return this.style.height ? parseFloat(this.style.height) : 103;
      },
      get offsetHeight() {
        return this.style.height ? parseFloat(this.style.height) : 103;
      },
      style: { height: null as any },
      getAttribute: (attr: string) => "2"
    };
    increaseHeightByContent(<HTMLElement>element, getComputedStyle);
    expect(element.style.height).toLooseEqual("79px");

    element = {
      getBoundingClientRect: () => { return { height: 50, width: 100, x: 10, y: 10 }; },
      get scrollHeight() {
        const height = this.style.height ? parseFloat(this.style.height) : 127;
        return Math.max(height, 103);
      },
      get offsetHeight() {
        return this.style.height ? parseFloat(this.style.height) : 127;
      },
      style: { height: null as any },
      getAttribute: (attr: string) => "2"
    };
    increaseHeightByContent(<HTMLElement>element, getComputedStyle);
    expect(element.style.height).toLooseEqual("103px");

  });
  test("test titleTagName, survey.cssTitle properties and getTitleOwner", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "panel", name: "p1",
          elements: [{ type: "text", name: "q1" }]
        }
      ]
    });
    setOldTheme(survey);
    expect(survey.getQuestionByName("q1").titleTagName).toLooseEqual("div");
    expect((<PanelModel>survey.getPanelByName("p1")).titleTagName).toLooseEqual("div");
    expect(survey.pages[0].titleTagName).toLooseEqual("div");
    expect(survey.titleTagName).toLooseEqual("div");
    expect(survey.cssTitle, "survey css").toLooseEqual(survey.css.title);
    expect(survey.pages[0].cssTitle, "page css").toLooseEqual("sv_page_title");
    expect(survey.getQuestionByName("q1").getTitleOwner()).toBeTruthy();
    expect((<PanelModel>survey.getPanelByName("p1")).getTitleOwner()).toBeTruthy();
    expect(survey.pages[0].getTitleOwner()).toBeTruthy();
    expect(survey.getTitleOwner()).toBeFalsy();
  });
  test("settings titleTagName and survey.onGetTitleTagName", () => {
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
    expect(survey.getQuestionByName("q1").titleTagName).toLooseEqual("h4");
    expect((<PanelModel>survey.getPanelByName("p1")).titleTagName).toLooseEqual("h3");
    expect(survey.pages[0].titleTagName).toLooseEqual("h2");
    expect(survey.titleTagName).toLooseEqual("h1");
    survey.onGetTitleTagName.add((sender, options) => {
      options.tagName = options.tagName + options.element.getType()[0];
    });
    expect(survey.getQuestionByName("q1").titleTagName).toLooseEqual("h4t");
    expect((<PanelModel>survey.getPanelByName("p1")).titleTagName).toLooseEqual("h3p");
    expect(survey.pages[0].titleTagName).toLooseEqual("h2p");
    expect(survey.titleTagName).toLooseEqual("h1s");
    settings.titleTags = savedTitleTags;
  });
  test("hasTitle + designTime", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "panel", name: "p1",
          elements: [{ type: "text", name: "q1" }]
        }
      ]
    });
    expect(survey.getQuestionByName("q1").hasTitle, "question - running").toBeTruthy();
    expect((<PanelModel>survey.getPanelByName("p1")).hasTitle, "panel - running").toBeFalsy();
    expect(survey.pages[0].hasTitle, "page - running").toBeFalsy();
    expect(survey.hasTitle, "survey - running").toBeFalsy();

    survey.setDesignMode(true);
    expect(survey.getQuestionByName("q1").hasTitle, "question - running").toBeTruthy();
    expect((<PanelModel>survey.getPanelByName("p1")).hasTitle, "panel - running").toBeFalsy();
    expect(survey.pages[0].hasTitle, "page - running").toBeTruthy();
    expect(survey.hasTitle, "survey - running").toBeTruthy();
  });
  test("question and titleTabIndex", () => {
    const survey = new SurveyModel({
      elements: [{ type: "text", name: "q1" }]
    });
    const question = survey.getQuestionByName("q1");
    expect(question.titleTabIndex, "We do not have tabIndex").toLooseEqual(undefined);
    question.state = "collapsed";
    expect(question.titleTabIndex, "We need tabIndex now").toLooseEqual(0);
  });
  test("show panel title if survey.showPageTitles is false", () => {
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
    expect(panel.hasTitle, "We show title for panels").toLooseEqual(true);
    expect(page.hasTitle, "We hide title for page").toLooseEqual(false);
    survey.setDesignMode(true);
    expect(panel.hasTitle, "We show title for panels in design").toLooseEqual(true);
    expect(page.hasTitle, "We show title for page in design").toLooseEqual(true);
  });
  test("Do panel click without actions, but if it has state", () => {
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
      options.actions = [];
    });
    const panel = <PanelModel>survey.getPanelByName("panel");
    expect(panel.hasTitleActions, "Delete all actions").toLooseEqual(false);
    expect(panel.hasTitleEvents, "It has non defult state").toLooseEqual(true);
    panel.state = "default";
    expect(panel.hasTitleEvents, "It has defult state").toLooseEqual(false);
  });

  test("Do not panel click with actions, but width 'default' state", () => {
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
      options.actions = [{ id: "action" }];
    });
    const panel = <PanelModel>survey.getPanelByName("panel");
    expect(panel.hasTitleEvents, "hasTitleEvents should return false if question has 'default' state").toLooseEqual(false);
  });

  test("Set values with trimming and caseSensitive", () => {
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
    expect(question.name).toLooseEqual("Q1");
    expect(hash["name"]).toLooseEqual(1);
    question.title = " hello  ";
    expect(question.title).toLooseEqual(" hello  ");
    expect(hash["title"]).toLooseEqual(1);
  });

  test("Modify question value, call onValueChanged by ignoring trimming and ", () => {
    const survey = new SurveyModel({
      elements: [{ type: "text", name: "q1" }]
    });
    const question = survey.getAllQuestions()[0];
    let counter = 0;
    survey.onValueChanged.add((sender, options) => {
      counter++;
    });
    question.value = "q";
    expect(counter).toLooseEqual(1);
    question.value = "Q";
    expect(counter).toLooseEqual(2);
    question.value = " Q ";
    expect(counter).toLooseEqual(3);
    expect(survey.getValue("q1")).toLooseEqual(" Q ");
  });
  test("Modify question array value, call onValueChanged by ignoring trimming and ", () => {
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
    expect(counter).toLooseEqual(1);
    rows[1].cells[0].value = " Val2 ";
    expect(counter).toLooseEqual(2);
    expect(question.value).toEqualValues([{ col1: "val1" }, { col1: " Val2 " }]);
  });
  test("page.fromJSON() doesn't work correctly, Bug#3331", () => {
    const survey = new SurveyModel({
      elements: [{ type: "checkbox", name: "q1", choices: ["item1", "item2", "item3"] }]
    });
    const pageJSON = survey.pages[0].toJSON();
    survey.removePage(survey.pages[0]);
    const pg = survey.addNewPage();
    pg.fromJSON(pageJSON);
    const question = <QuestionCheckboxModel>survey.getAllQuestions()[0];
    expect(question.visibleChoices.length, "Visible choices are set").toLooseEqual(3);
  });
  test("start page is invisible", () => {
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
    expect(startPage).toBeTruthy();
    expect(startPage.isVisible, "started page is visible").toLooseEqual(true);
  });
  test("firstPageIsStartPage = true and prevPage()", () => {
    var survey = new SurveyModel();
    for (var i = 0; i < 3; i++) {
      let page = survey.addNewPage("p" + i + 1);
      page.addNewQuestion("text");
    }
    survey.firstPageIsStartPage = true;
    expect(survey.prevPage()).toLooseEqual(false);
    survey.start();
    expect(survey.prevPage()).toLooseEqual(false);
    survey.nextPage();
    expect(survey.prevPage()).toLooseEqual(true);
    expect(survey.currentPageNo).toLooseEqual(0);
  });
  test("firstPageIsStartPage = true and invisible questions and clear", () => {
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
    expect(q2.isVisible, "initially invisible").toLooseEqual(false);
    survey.setValue("q1", 1);
    expect(q2.isVisible, "visible now").toLooseEqual(true);
    survey.nextPage();
    survey.doComplete();
    survey.clear(true, true);
    expect(q2.isVisible, "invisible again").toLooseEqual(false);
  });
  test("firstPageIsStartPage = true and clear&state='starting'", () => {
    const survey = new SurveyModel({
      firstPageIsStartPage: true,
      autoAdvanceEnabled: true,
      showProgressBar: true,
      progressBarLocation: "bottom",
      showTimer: true,
      timeLimitPerPage: 10,
      timeLimit: 25,
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
    expect(survey.state, "starting state #1").toLooseEqual("starting");
    expect(survey.getPropertyValue("isStartedState"), "isStartedState #1").toLooseEqual(true);
    expect(startButton.isVisible, "startButton is visible, #1").toLooseEqual(true);
    expect(survey.showNavigationButtons, "Show navigation on bottom - true").toLooseEqual(true);
    expect(survey.navigationButtonsLocation, "Show navigation on bottom").toLooseEqual("bottom");
    survey.start();
    expect(survey.state, "run survey").toLooseEqual("running");
    expect(survey.getPropertyValue("isStartedState"), "isStartedState #2").toLooseEqual(false);
    survey.doComplete();
    expect(survey.state, "survey is completed").toLooseEqual("completed");
    expect(survey.getPropertyValue("isStartedState"), "isStartedState #3").toLooseEqual(false);
    survey.clear();
    expect(survey.state, "starting state #2").toLooseEqual("starting");
    expect(survey.getPropertyValue("isStartedState"), "isStartedState #4").toLooseEqual(true);
    expect(startButton.isVisible, "startButton is visible, #2").toLooseEqual(true);
    expect(survey.isNavigationButtonsShowing, "Show navigation buttons on start").toLooseEqual("bottom");
  });
  test("skeleton component name", () => {
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
    expect(survey.skeletonComponentName).toLooseEqual("sv-skeleton");
    expect(question.skeletonComponentName).toLooseEqual("sv-skeleton");
    survey.skeletonComponentName = "";
    expect(survey.skeletonComponentName).toLooseEqual("");
    expect(question.skeletonComponentName).toLooseEqual("");
  });
  test("Make sure to have currentPage on adding new question/page/visibility in code", () => {
    const survey = new SurveyModel();
    expect(survey.getPropertyValue("currentPage"), "There is no pages").toLooseEqual(undefined);
    const newPage = new PageModel("page1");
    newPage.addNewQuestion("text", "q1");
    survey.pages.push(newPage);
    expect(survey.getPropertyValue("currentPage").name, "We have added a new current page").toLooseEqual(survey.pages[0].name);
    survey.pages.shift();
    expect(survey.getPropertyValue("currentPage"), "There is no new pages again").toLooseEqual(undefined);
    survey.addNewPage("page1");
    expect(survey.getPropertyValue("currentPage"), "There is no visible pages").toLooseEqual(undefined);
    survey.pages[0].addNewQuestion("text", "q1");
    expect(survey.getPropertyValue("currentPage").name, "There is current page").toLooseEqual(survey.pages[0].name);
    survey.pages[0].visible = false;
    expect(survey.getPropertyValue("currentPage"), "We make page invisible").toLooseEqual(undefined);
    survey.pages[0].visible = true;
    expect(survey.getPropertyValue("currentPage").name, "We make the page visible").toLooseEqual(survey.pages[0].name);
  });
  test("Make invisible question visible in the only page", () => {
    const survey = new SurveyModel();
    expect(survey.getPropertyValue("currentPage"), "There is no pages").toLooseEqual(undefined);
    const newPage = new PageModel("page1");
    newPage.addNewQuestion("text", "q1");
    newPage.addNewQuestion("text", "q2");
    newPage.questions[0].visible = false;
    newPage.questions[1].visible = false;
    survey.pages.push(newPage);
    expect(survey.getPropertyValue("currentPage"), "There is no visible pages").toLooseEqual(undefined);
    newPage.questions[0].visible = true;
    expect(survey.getPropertyValue("currentPage").name, "New page is visible now").toLooseEqual(survey.pages[0].name);
    newPage.questions[0].visible = false;
    expect(survey.getPropertyValue("currentPage"), "There is no visible pages, #2").toLooseEqual(undefined);
    newPage.questions[1].visible = true;
    expect(survey.getPropertyValue("currentPage").name, "New page is visible now, #2").toLooseEqual(survey.pages[0].name);
  });
  test("clear value for question in invisible panel with non-empty valueName property", () => {
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
    expect(survey.data, "value is in data").toEqualValues({ invisible: "val2" });
    survey.setValue("q1", 1);
    survey.doComplete();
    expect(survey.data, "value is empty now").toEqualValues({ q1: 1 });
  });
  test("Randomized questions and onQuestionAdded", () => {
    const survey = new SurveyModel({
      pages: [
        { elements: [{ type: "text", name: "q1" }] },
        {
          questionOrder: "random",
          elements: [{ type: "text", name: "q2" }, { type: "text", name: "q3" }]
        }
      ]
    });
    var counter = 0;
    survey.onQuestionAdded.add((sender, options) => {
      counter++;
    });
    survey.currentPageNo = 1;
    expect(counter, "onQuestionAdded is not fired").toLooseEqual(0);
  });
  test("onQuestionAdded & changing parent", () => {
    const survey = new SurveyModel({
      pages: [
        { elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }] },
        {
          questionOrder: "random",
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
    expect(addedCounter, "onQuestionAdded is not fired, #1").toLooseEqual(0);
    survey.getQuestionByName("q1").page = survey.pages[1];
    survey.getQuestionByName("q3").page = survey.pages[0];
    expect(addedCounter, "onQuestionAdded is not fired, #2").toLooseEqual(0);
    const q = new QuestionTextModel("q5");
    q.page = survey.pages[1];
    expect(addedCounter, "onQuestionAdded is fired for q5, #3").toLooseEqual(1);
    expect(removedCounter, "onQuestionRemoved #1").toLooseEqual(0);
    q.delete();
    expect(removedCounter, "onQuestionRemoved #2").toLooseEqual(1);
  });
  test("Set values into radiogroup and checkbox questions before creating them", () => {
    const survey = new SurveyModel();
    survey.data = { q1: 1, q2: [1, 2] };
    survey.fromJSON({
      elements: [
        { type: "radiogroup", name: "q1", choices: [1, 2, 3] },
        { type: "checkbox", name: "q2", choices: [1, 2, 3] },
      ]
    });
    expect(survey.data, "Survey data is correct").toEqualValues({ q1: 1, q2: [1, 2] });
    const q1 = <QuestionRadiogroupModel>survey.getQuestionByName("q1");
    const q2 = <QuestionCheckboxModel>survey.getQuestionByName("q2");
    expect(q1.value, "radiogroup value").toLooseEqual(1);
    expect(q2.value, "checkbox value").toEqualValues([1, 2]);
    expect(q1.renderedValue, "radiogroup rendered value").toLooseEqual(1);
    expect(q2.renderedValue, "checkbox rendered value").toEqualValues([1, 2]);
  });
  test("Checkbox, invsible item with default Value", () => {
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
    expect(q2.isEmpty(), "question is empty").toLooseEqual(true);
    survey.setValue("q1", 2);
    expect(q2.value, "Respect default value").toEqualValues([1]);
    survey.setValue("q1", 1);
    expect(q2.isEmpty(), "question is empty again").toLooseEqual(true);
    survey.setValue("q1", 2);
    expect(q2.value, "Respect default value again").toEqualValues([1]);
    q2.value = [2];
    survey.setValue("q1", 1);
    survey.setValue("q1", 2);
    expect(q2.value, "default value is goine").toEqualValues([2]);
  });
  test("clearInvisibleValues: `none` and copyvalue trigger", () => {
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
    expect(survey.getValue("question2"), "Trigger is working").toLooseEqual("item2");
    expect(survey.data, "Data is correct").toEqualValues({ question1: "item2", question2: "item2" });
    survey.doComplete();
    expect(survey.data, "Data is correct after completed").toEqualValues({ question1: "item2", question2: "item2" });
  });
  test("Assign survey data callback", () => {
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
    expect(survey.getValue("a")).toLooseEqual("abc");
    survey.clearValue("a");
    expect(getCounter > 0, "getCounter").toLooseEqual(true);
    expect(setCounter, "setCounter").toLooseEqual(1);
    expect(deleteCounter, "deleteCounter").toLooseEqual(1);
    const oldGetCount = getCounter;
    expect(survey.getValue("a")).toLooseEqual(undefined);
    expect(getCounter, "getCounter #2").toLooseEqual(oldGetCount + 1);
  });
  test("Run expressions on changing comments", () => {
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
          showCommentArea: true
        },
        {
          type: "text",
          name: "question2",
          visibleIf: "{question1-Comment.length} > 3"
        }
      ]
    });
    const question2 = survey.getQuestionByName("question2");
    expect(question2.isVisible, "Invisible by default").toLooseEqual(false);
    survey.setComment("question1", "abcd");
    expect(survey.data, "Check comment value").toEqualValues({ "question1-Comment": "abcd" });
    expect(question2.isVisible, "visible").toLooseEqual(true);
    survey.setComment("question1", "abc");
    expect(question2.isVisible, "Invisible again").toLooseEqual(false);
  });

  test("Check survey resize observer", () => {
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
    expect(survey["resizeObserver"]).toBeFalsy();
    window.getComputedStyle(rootEl).setProperty("--test-mobile-width", "600px");
    survey.afterRenderSurvey(rootEl);
    expect(survey["resizeObserver"]).toBeTruthy();
    const firstResizeObserver = survey["resizeObserver"];
    let firstResizeObserverIsConnected = true;
    firstResizeObserver.disconnect = () => {
      firstResizeObserverIsConnected = false;
    };
    survey.afterRenderSurvey(rootEl);
    expect(survey["resizeObserver"] == firstResizeObserver, "check that new resize observer is created after second afterRender").toBeFalsy();
    expect(firstResizeObserverIsConnected, "check that old resize observer is disconnected after second afterRender").toBeFalsy();
    survey.dispose();
    expect(survey["resizeObserver"]).toBeFalsy();
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

  test("Check survey resize observer double process", () => {
    window.requestAnimationFrame = (func: any) => !!func && func();
    const getComputedStyle = window.getComputedStyle;
    window.getComputedStyle = <any>((el: HTMLElement) => {
      return el.style;
    });
    const ResizeObserver = window.ResizeObserver;
    window.ResizeObserver = <any>CustomResizeObserver;
    const rootEl = document.createElement("div");
    // jsdom does not perform layout; mark the element as visible for isContainerVisible().
    Object.defineProperty(rootEl, "offsetWidth", { configurable: true, value: 800 });
    Object.defineProperty(rootEl, "offsetHeight", { configurable: true, value: 600 });
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
    expect(trace).toLooseEqual("->processed");
    (<any>survey["resizeObserver"]).call();
    expect(trace, "prevent double process").toLooseEqual("->processed");
    (<any>survey["resizeObserver"]).call();
    expect(trace).toLooseEqual("->processed->processed");
    window.ResizeObserver = ResizeObserver;
    window.getComputedStyle = getComputedStyle;
    rootEl.remove();
  });

  test("Check survey resize observer do not process if container is not visible", () => {
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
    // jsdom does not honor display:none for offset metrics; toggle the stub instead.
    let __visible = false;
    Object.defineProperty(rootEl, "offsetWidth", { configurable: true, get: () => __visible ? 800 : 0 });
    Object.defineProperty(rootEl, "offsetHeight", { configurable: true, get: () => __visible ? 600 : 0 });
    survey.afterRenderSurvey(rootEl);
    expect(trace, "do not process responsivness on invisible container").toLooseEqual("");
    rootEl.style.display = "block";
    __visible = true;
    (<any>survey["resizeObserver"]).call();
    expect(trace, "process responsivness on visible container").toLooseEqual("->processed");
    window.ResizeObserver = ResizeObserver;
    window.getComputedStyle = getComputedStyle;
    rootEl.remove();
  });

  test("Check isMobile set via processResponsiveness method", () => {
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
    expect(log).toLooseEqual("->width: 500; height: 800");
    expect(survey._isMobile).toBeTruthy();
    expect(isProcessed).toBeTruthy();

    log = "";
    isProcessed = survey["processResponsiveness"](600, 500, 400);
    expect(log).toLooseEqual("->width: 600; height: 400");
    expect(isProcessed).toBeTruthy();

    log = "";
    isProcessed = survey["processResponsiveness"](800, 500, 300);
    expect(log).toLooseEqual("->width: 800; height: 300");
    expect(survey._isMobile).toBeFalsy();
    expect(isProcessed).toBeFalsy();
  });
  test("Check addNavigationItem", () => {

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
    expect(action1 === survey.navigationBar.actions[0]).toBeTruthy();
    expect(action1.id).toLooseEqual("custom-btn");
    expect(action1.innerCss).toLooseEqual("sv_nav_btn");
    expect(action1.component).toLooseEqual("sv-nav-btn");

    const action2 = survey.addNavigationItem({ id: "custom-btn-2", innerCss: "custom-css", visibleIndex: 11 });
    expect(action2 === survey.navigationBar.actions[2]).toBeTruthy();
    expect(action2.id).toLooseEqual("custom-btn-2");
    expect(action2.innerCss).toLooseEqual("custom-css");
    expect(action2.component).toLooseEqual("sv-nav-btn");

    const action3 = survey.addNavigationItem({ id: "custom-btn-3", component: "custom-component", visibleIndex: 21 });
    expect(action3 === survey.navigationBar.actions[4]).toBeTruthy();
    expect(action3.id).toLooseEqual("custom-btn-3");
    expect(action3.component).toLooseEqual("custom-component");
  });

  test("Check addNavigationItem with taskManager.waitAndExecute", () => {
    vi.useFakeTimers();
    try {
      const survey = new SurveyModel({
        "elements": [
          {
            type: "text",
            name: "q1",
          }
        ]
      });
      setOldTheme(survey);

      let actionExecuted = false;
      let actionExecutionOrder: string[] = [];

      const action = survey.addNavigationItem({
        id: "test-btn",
        action: () => {
          actionExecutionOrder.push("action-executed");
          actionExecuted = true;
        }
      });
      expect(action === survey.navigationBar.actions[survey.navigationBar.actions.length - 1], "Action should be added to navigationBar").toBeTruthy();
      expect(action.id, "Action should have correct id").toLooseEqual("test-btn");
      expect(action.component, "Action should have default component").toLooseEqual("sv-nav-btn");
      expect(action.innerCss, "Action should have default innerCss").toLooseEqual("sv_nav_btn");

      survey["taskManager"].runTask("test-task", (completed) => {
        actionExecutionOrder.push("task-started");
        setTimeout(() => {
          actionExecutionOrder.push("task-completed");
          completed();
        }, 10);
      });

      expect(actionExecuted, "Action should not be executed immediately when there are active tasks").toBeFalsy();
      expect(actionExecutionOrder.length, "Only task-started should be in execution order").toLooseEqual(1);
      expect(actionExecutionOrder[0], "First should be task-started").toLooseEqual("task-started");

      action.action();

      vi.advanceTimersByTime(50);
      expect(actionExecuted, "Action should be executed after task completion").toBeTruthy();
      expect(actionExecutionOrder.length, "Should have 3 execution steps").toLooseEqual(3);
      expect(actionExecutionOrder[0], "First should be task-started").toLooseEqual("task-started");
      expect(actionExecutionOrder[1], "Second should be task-completed").toLooseEqual("task-completed");
      expect(actionExecutionOrder[2], "Third should be action-executed").toLooseEqual("action-executed");
    } finally {
      vi.useRealTimers();
    }
  });

  test("Check addNavigationItem without active tasks", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          type: "text",
          name: "q1",
        }
      ]
    });
    setOldTheme(survey);

    let actionExecuted = false;
    let actionExecutionOrder: string[] = [];

    const action = survey.addNavigationItem({
      id: "test-btn-2",
      action: () => {
        actionExecutionOrder.push("action-executed");
        actionExecuted = true;
      }
    });
    expect(action === survey.navigationBar.actions[survey.navigationBar.actions.length - 1], "Action should be added to navigationBar").toBeTruthy();
    expect(action.id, "Action should have correct id").toLooseEqual("test-btn-2");

    action.action();

    expect(actionExecuted, "Action should be executed immediately when there are no active tasks").toBeTruthy();
    expect(actionExecutionOrder.length, "Should have 1 execution step").toLooseEqual(1);
    expect(actionExecutionOrder[0], "Should be action-executed").toLooseEqual("action-executed");

  });

  test("Check addNavigationItem for Action instance", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          type: "text",
          name: "q1",
        }
      ]
    });
    setOldTheme(survey);

    let actionExecuted = false;
    let actionExecutionOrder: string[] = [];

    const action = survey.addNavigationItem(new Action({
      id: "test-btn-2",
      action: () => {
        actionExecutionOrder.push("action-executed");
        actionExecuted = true;
      }
    }));
    expect(action === survey.navigationBar.actions[survey.navigationBar.actions.length - 1], "Action should be added to navigationBar").toBeTruthy();
    expect(action.id, "Action should have correct id").toLooseEqual("test-btn-2");

    action.action();

    expect(actionExecuted, "Action should be executed immediately when there are no active tasks").toBeTruthy();
    expect(actionExecutionOrder.length, "Should have 1 execution step").toLooseEqual(1);
    expect(actionExecutionOrder[0], "Should be action-executed").toLooseEqual("action-executed");

  });

  test("Check default navigation items relevance", () => {
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
    expect(action.getActionBarItemCss()).toLooseEqual("custom-action custom-css custom-start");
    survey.locale = "ru";
    expect(action.title).toLooseEqual("Начать"); // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
    survey.locale = "en";
    expect(action.title).toLooseEqual("Start");
    survey.startSurveyText = "custom-text";
    expect(action.title).toLooseEqual("custom-text");
  });
  test("Check rootCss property", () => {
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
    expect(survey.rootCss).toLooseEqual("test-root-class sv_progress--pages");
  });

  test("Check navigation bar css update", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          type: "text",
          name: "q1",
        }
      ]
    });
    survey.css = { actionBar: { root: "custom-navigation", defaultSizeMode: "" }, footer: "custom-footer" };
    survey.navigationBar.flushUpdates();
    expect(survey.navigationBar.getRootCss()).toLooseEqual("custom-navigation custom-footer");
  });
  test("Check survey getRootCss function - defaultCss", () => {
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
    expect(survey.getRootCss()).toLooseEqual("sd-root-modern sd-progress--pages sd-root-modern--full-container");

    survey.fitToContainer = false;
    expect(survey.getRootCss()).toLooseEqual("sd-root-modern sd-progress--pages");

    survey.setIsMobile(true);
    survey.fitToContainer = true;
    expect(survey.getRootCss()).toLooseEqual("sd-root-modern sd-progress--pages sd-root-modern--mobile sd-root-modern--full-container");

    survey.fitToContainer = false;
    expect(survey.getRootCss()).toLooseEqual("sd-root-modern sd-progress--pages sd-root-modern--mobile");

    survey.readOnly = true;
    survey.fitToContainer = true;
    expect(survey.getRootCss()).toLooseEqual("sd-root-modern sd-progress--pages sd-root-modern--mobile sd-root--readonly sd-root-modern--full-container");

    survey.fitToContainer = false;
    expect(survey.getRootCss()).toLooseEqual("sd-root-modern sd-progress--pages sd-root-modern--mobile sd-root--readonly");

    survey.readOnly = false;
    survey.setIsMobile(false);
    survey["isCompact"] = true;
    expect(survey.getRootCss()).toLooseEqual("sd-root-modern sd-progress--pages sd-root--compact");

    survey.fitToContainer = true;
    expect(survey.getRootCss()).toLooseEqual("sd-root-modern sd-progress--pages sd-root--compact sd-root-modern--full-container");
    settings.animationEnabled = false;
  });

  test("Check survey isMobile in design mode", () => {
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
    expect(survey._isMobile).toBeTruthy();
    expect(survey.isMobile).toBeFalsy();
    expect(textQuestion.isMobile).toBeFalsy();
    expect(multipleTextQuestion.isMobile).toBeTruthy();
    expect(checkboxQuestion.isMobile).toBeTruthy();
  });
  test("Check survey isMobile is set correctly on adding new question", () => {
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
    expect(question.isMobile).toBeTruthy();
  });
  test("Check survey isMobile is set correctly on question in nested dynamic panels", () => {
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
    expect(survey.isMobile).toBeFalsy();
    survey.setIsMobile(true);
    expect(survey.isMobile).toBeTruthy();
    expect(survey.getQuestionByName("question1").panels[0].getQuestionByName("question2").isMobile).toBeTruthy();
  });
  test("Set correct activePage on fromSurvey and update buttons visibility", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          type: "text",
          name: "q1",
        }
      ]
    });
    expect(survey.activePage.id, "Initially active page is correct").toLooseEqual(survey.pages[0].id);
    expect(survey.navigationBar.getActionById("sv-nav-prev").visible, "PrevButton is not shown").toLooseEqual(false);
    survey.fromJSON(survey.toJSON());
    expect(survey.activePage.id, "Initially active page is correct").toLooseEqual(survey.pages[0].id);
    expect(survey.navigationBar.getActionById("sv-nav-prev").visible, "PrevButton is not shown #2").toLooseEqual(false);
  });
  test("Navigation buttons text from JSON", () => {
    const survey = new SurveyModel({
      completeText: "Submit",
      "elements": [
        {
          type: "text",
          name: "q1",
        }
      ]
    });
    expect(survey.completeText, "text is correct").toLooseEqual("Submit");
    expect(survey.navigationBar.getActionById("sv-nav-complete").title, "Text in bar is correct").toLooseEqual("Submit");
  });

  test("Do not execute visibleIf in design mode", () => {
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
    expect(question.visible, "It is visible initially").toLooseEqual(true);
    question.visibleIf = "{q2} = 1";
    expect(question.visible, "It is still visible").toLooseEqual(true);
    const panel = <PanelModel>survey.getPanelByName("panel");
    const panel2 = <PanelModel>panel.clone();
    const question2 = panel2.questions[0];
    expect(question2.visibleIf, "It is visible").toLooseEqual("{q2} = 1");
    expect(question2.visible, "It is visible").toLooseEqual(true);
    survey.pages[0].addElement(panel2);
    expect(question2.visible, "It is visible, #2").toLooseEqual(true);
    const newPanel = new PanelModel("newPanel");
    newPanel.addNewQuestion("text", "q3_1");
    newPanel.questions[0].visibleIf = "{q2} = 1";
    expect(newPanel.questions[0].visible, "new Panel question visible").toLooseEqual(true);
    const newPanel2 = <PanelModel>newPanel.clone();
    const newQuestion2 = newPanel2.questions[0];
    expect(newQuestion2.visibleIf, "It is visible").toLooseEqual("{q2} = 1");
    expect(newQuestion2.visible, "It is visible").toLooseEqual(true);
    survey.pages[0].addElement(newPanel2);
    expect(newQuestion2.visible, "It is visible, #2").toLooseEqual(true);
  });
  test("Ignore firstStartPage if there is only one page", () => {
    var survey = new SurveyModel({
      firstPageIsStartPage: true,
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2" }
      ]
    });
    expect(survey.state, "There is only one page").toLooseEqual("running");
    expect(survey.isCompleteButtonVisible, "Complete button is visible").toLooseEqual(true);
  });
  test("Check survey calculated width mode observability", () => {
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

    expect(model.calculatedWidthMode).toLooseEqual("static");
    expect(model.bodyCss).toLooseEqual("css-body css-body--static");
    model.widthMode = "responsive";
    expect(model.calculatedWidthMode).toLooseEqual("responsive");
    expect(model.bodyCss).toLooseEqual("css-body css-body--responsive");

    model.widthMode = "auto";
    expect(model.calculatedWidthMode).toLooseEqual("static");

    model.getAllQuestions()[1].startWithNewLine = false;
    expect(model.calculatedWidthMode).toLooseEqual("responsive");

    model.getAllQuestions()[1].startWithNewLine = true;
    expect(model.calculatedWidthMode).toLooseEqual("static");

    model.pages[0].addNewQuestion("matrix", "qm");
    expect(model.calculatedWidthMode).toLooseEqual("responsive");
  });

  test("Check survey calculated width mode observability with survey changing", () => {
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
    expect(model.calculatedWidthMode).toLooseEqual("static");
    model.fromJSON(json);
    expect(model.calculatedWidthMode).toLooseEqual("static");
    model.getAllQuestions()[1].startWithNewLine = false;
    expect(model.calculatedWidthMode).toLooseEqual("responsive");
  });

  test("Check survey calculated width mode observability on question added", () => {
    const model = new SurveyModel({});
    expect(model.calculatedWidthMode).toLooseEqual("static");
    model.addNewPage();
    model.pages[0].addNewQuestion("matrix", "q1");
    expect(model.calculatedWidthMode).toLooseEqual("responsive");
  });

  test("Check survey width for different width modes", () => {
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

    expect(model.widthMode).toLooseEqual("auto");
    expect(model.calculatedWidthMode).toLooseEqual("static");
    expect(model.renderedWidth, "auto static width undefined").toLooseEqual(undefined);

    model.width = "700px";
    expect(model.calculatedWidthMode).toLooseEqual("static");
    expect(model.renderedWidth, "auto static width 700px").toLooseEqual("700px");

    model.getAllQuestions()[1].startWithNewLine = false;
    expect(model.calculatedWidthMode).toLooseEqual("responsive");
    expect(model.renderedWidth, "auto responsive width undefined").toLooseEqual(undefined);

    model.widthMode = "static";
    expect(model.renderedWidth, "static width 700px").toLooseEqual("700px");

    model.widthMode = "responsive";
    expect(model.renderedWidth, "responsive width undefined").toLooseEqual(undefined);
  });

  test("Add px to numeric survey width", () => {
    const model = new SurveyModel();

    expect(model.widthMode).toLooseEqual("auto");
    expect(model.calculatedWidthMode).toLooseEqual("static");
    expect(model.renderedWidth, "auto static width undefined").toLooseEqual(undefined);

    model.width = "700";
    expect(model.calculatedWidthMode).toLooseEqual("static");
    expect(model.renderedWidth, "auto add px 700px").toLooseEqual("700px");
  });

  test("Survey Localization - check errors update after locale changed", () => {
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
          showOtherItem: true,
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
    expect(q1.errors.length).toLooseEqual(1);
    expect(q1.errors[0].locText.renderedHtml).toLooseEqual("Response required.");

    expect(q2.errors.length).toLooseEqual(1);
    expect(q2.errors[0].locText.renderedHtml).toLooseEqual("custom_error_text");

    expect(q3.errors.length).toLooseEqual(1);
    expect(q3.errors[0].locText.renderedHtml).toLooseEqual("custom_max_error_text 10");

    expect(q4.errors.length).toLooseEqual(1);
    expect(q4.errors[0].locText.renderedHtml).toLooseEqual("custom_min_error_text 10");

    expect(q5.errors.length).toLooseEqual(1);
    expect(q5.errors[0].locText.renderedHtml).toLooseEqual("custom_min_error_text");

    expect(q6.errors.length).toLooseEqual(1);
    expect(q6.errors[0].locText.renderedHtml).toLooseEqual("custom_other_error_text");

    survey.locale = "de";

    expect(q1.errors.length).toLooseEqual(1);
    expect(q1.errors[0].locText.renderedHtml).toLooseEqual("Bitte beantworten Sie diese Frage.");

    expect(q2.errors.length).toLooseEqual(1);
    expect(q2.errors[0].locText.renderedHtml).toLooseEqual("custom_error_text_deutch");

    expect(q3.errors.length).toLooseEqual(1);
    expect(q3.errors[0].locText.renderedHtml).toLooseEqual("custom_max_error_text_deutch 10");

    expect(q4.errors.length).toLooseEqual(1);
    expect(q4.errors[0].locText.renderedHtml).toLooseEqual("custom_min_error_text_deutch 10");

    expect(q5.errors.length).toLooseEqual(1);
    expect(q5.errors[0].locText.renderedHtml).toLooseEqual("custom_min_error_text_deutch");

    expect(q6.errors.length).toLooseEqual(1);
    expect(q6.errors[0].locText.renderedHtml).toLooseEqual("custom_other_error_text_deutch");

    //check that when return to default locale onChange isCalled
    let onChangedCalled = 0;
    q1.errors[0].locText.onChanged = () => {
      onChangedCalled++;
    };
    survey.locale = "en";

    expect(q1.errors.length).toLooseEqual(1);
    expect(onChangedCalled).toLooseEqual(1);
    expect(q1.errors[0].locText.renderedHtml).toLooseEqual("Response required.");
  });
  test("First page with conditions. Make the second only page visible/invisible", () => {
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
      firstPageIsStartPage: true
    });
    expect(survey.getPropertyValue("isStartedState"), "the state is started").toLooseEqual(true);
    expect(survey.startPage.name, "The started page").toLooseEqual("page1");
    expect(survey.isShowingPage, "show the first page").toLooseEqual(true);
    expect(survey.state, "The state is starting").toLooseEqual("starting");
  });
  test("hasDescription is not updated on changing locale", () => {
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
    expect(page.hasDescription, "Page description is not shown for 'en'").toBeFalsy();
    expect(question.hasDescription, "Question description is not shown for 'en'").toBeFalsy();
    survey.locale = "de";
    expect(page.hasDescription, "Page description is shown for 'de'").toLooseEqual(true);
    expect(question.hasDescription, "Question description is shown for 'de'").toLooseEqual(true);
    survey.locale = "";
  });
  test("hasDescription is isDesignMode", () => {
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
    expect(q1.hasDescription, "text description is not shown").toBeFalsy();
    expect(q2.hasDescription, "comment description is shown").toBeTruthy();
    const q3 = survey.currentPage.addNewQuestion("text", "q3");
    const q4 = survey.currentPage.addNewQuestion("comment", "q4");
    expect(q3.hasDescription, "text description is not shown, on adding question").toBeFalsy();
    expect(q4.hasDescription, "comment description is shown, on adding question").toBeTruthy();

    commentDescriptionProperty.placeholder = oldValue;
  });
  test("Test survey with custom type", () => {
    JsonObject.metaData.addClass(
      "sortablelist",
      [
        { name: "showOtherItem", visible: false },
        { name: "storeOthersAsComment", visible: false },
        { name: "showNoneItem", visible: false },
        { name: "renderAs", visible: false },
        { name: "checkboxClass", visible: false },
        { name: "showSelectAllItem", visible: false },
        { name: "noneText", visible: false },
        { name: "selectAllText", visible: false },
      ],
      null,
      "checkbox"
    );
    const survey = new SurveyModel({
      elements: [
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
    expect(survey.getAllQuestions().length).toLooseEqual(1);
  });
  test("progress is not changed on the start page", () => {
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

      showProgressBar: true,
      progressBarLocation: "bottom",
      firstPageIsStartPage: true,
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
    expect(progressChangeCount, "Initial progress call count").toLooseEqual(0);
    question.value = ["1"];
    expect(progressChangeCount, "Progress hasn't been called").toLooseEqual(0);
  });
  test("Make sure that panel is not collapsed on focusing the question, #2", () => {
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
    expect(p2.isExpanded, "Expand panel, p2").toLooseEqual(true);
    expect(p1.isExpanded, "Expand panel, p1").toLooseEqual(true);
  });
  test("Set question choices for disposed survey", () => {
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
    expect(question.choices.length, "There is not errors, choices still the same").toLooseEqual(2);
    expect(question.survey, "Survey is not set").toBeFalsy();
    expect(question.data, "data is not set").toBeFalsy();
  });
  test("Expression for questions with a lot of dots", () => {
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
    expect(question1_1_2.visible, "question1_1_2 false").toLooseEqual(false);
    question1_1.value = "a";
    expect(question1_1_2.visible, "question1_1_2 true").toLooseEqual(true);
    expect(question1_1_3_3.visible, "question1_1_2_3 false").toLooseEqual(false);
    question1_1_2.value = "a";
    expect(question1_1_3_3.visible, "question1_1_2_3 true").toLooseEqual(true);
    expect(question1_1_2_3_4.visible, "question1_1_2_3_4 false").toLooseEqual(false);
    question1_1_3_3.value = "a";
    expect(question1_1_2_3_4.visible, "question1_1_2_3_4 true").toLooseEqual(true);
    expect(question1_1_2_3_4_5.visible, "question1_1_2_3_4_5 false").toLooseEqual(false);
    question1_1_2_3_4.value = "a";
    expect(question1_1_2_3_4_5.visible, "question1_1_2_3_4_5 true").toLooseEqual(true);
  });
  test("Expression for questions with a lot of dots #2", () => {
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

    expect(questionWF4_4.visible, "questionWF4_4 false").toLooseEqual(false);
    questionWF4_1.value = "Public";
    expect(questionWF4_4.visible, "questionWF4_4 true").toLooseEqual(true);

    expect(questionWF4_4_1.visible, "questionWF4_4_1 false").toLooseEqual(false);
    questionWF4_4.value = "Yes";
    expect(questionWF4_4_1.visible, "questionWF4_4_1 true").toLooseEqual(true);

    expect(questionWF4_4_1_1.visible, "questionWF4_4_1_1 false").toLooseEqual(false);
    questionWF4_4_1.value = "Yes";
    expect(questionWF4_4_1_1.visible, "questionWF4_4_1_1 true").toLooseEqual(true);
  });

  test("selectbase.keepIncorrectValues & survey.keepIncorrectValues", () => {
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
    expect(true, "clear incorrect value, #1").toLooseEqual(question.isEmpty());
    question.keepIncorrectValues = true;
    question.value = "item3";
    survey.clearIncorrectValues();
    expect("item3", "keep incorrect value, #2").toLooseEqual(question.value);

    question.keepIncorrectValues = false;
    survey.clearIncorrectValues();
    expect(true, "clear incorrect value, #3").toLooseEqual(question.isEmpty());

    survey.keepIncorrectValues = true;
    question.value = "item3";
    survey.clearIncorrectValues();
    expect("item3", "keep incorrect value, #4").toLooseEqual(question.value);

    survey.keepIncorrectValues = false;
    question.value = "item3";
    survey.clearIncorrectValues();
    expect(true, "clear incorrect value, #5").toLooseEqual(question.isEmpty());
  });

  test("no scrolling to page top after focus a question on another page - https://github.com/surveyjs/survey-library/issues/5346", () => {
    vi.useFakeTimers();
    try {
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
      expect(log, "initially no scrolling").toLooseEqual("");
      survey.focusQuestion(qName);
      vi.advanceTimersByTime(2);
      expect(log, "no scrolling after page changed and focused a question, scroll to the question only").toLooseEqual("->" + qName);
    } finally {
      vi.useRealTimers();
    }
  });

  test("scrolling to page top after current page changed", () => {
    vi.useFakeTimers();
    try {
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
      survey.onScrollToTop.add((s, o) => {
        scrollCount++;
      });

      expect(survey["isCurrentPageRendered"] === undefined, "load survey").toLooseEqual(true);

      survey.afterRenderPage(<HTMLElement>{});
      expect(survey["isCurrentPageRendered"] === true, "render first page #1").toLooseEqual(true);

      survey.afterRenderPage(<HTMLElement>{});
      expect(survey["isCurrentPageRendered"] === true, "render first page #2").toLooseEqual(true);

      vi.advanceTimersByTime(timeOut);
      expect(scrollCount).toLooseEqual(0);

      survey.nextPage();
      expect(survey["isCurrentPageRendered"] === false, "go to second page").toLooseEqual(true);

      survey.afterRenderPage(<HTMLElement>{});
      expect(survey["isCurrentPageRendered"] === true, "render second page").toLooseEqual(true);

      vi.advanceTimersByTime(timeOut);
      expect(scrollCount, "scrolling after going to second page").toLooseEqual(1);

      survey.prevPage();
      expect(survey["isCurrentPageRendered"] === false, "go to first page").toLooseEqual(true);

      survey.afterRenderPage(<HTMLElement>{});
      expect(survey["isCurrentPageRendered"] === true, "render first page #3").toLooseEqual(true);

      vi.advanceTimersByTime(timeOut);
      expect(scrollCount, "scrolling after back to first page").toLooseEqual(2);
    } finally {
      vi.useRealTimers();
    }
  });

  test("check descriptionLocation change css classes", () => {
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
    expect(question.cssDescription).toLooseEqual("description_default");
    question.descriptionLocation = "underTitle";
    expect(question.cssDescription).toLooseEqual("description_default");
    question.descriptionLocation = "underInput";
    expect(question.cssDescription).toLooseEqual("description_default description_under_input");
  });
  test("Get first focused question on collapsed question", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1", state: "collapsed", isRequired: true },
        { type: "text", name: "q2" }
      ],
    });
    const page = survey.pages[0];
    expect(page.getFirstQuestionToFocus().name, "q1 is in collapsed panel").toLooseEqual("q2");
    expect(page.getFirstQuestionToFocus(false, true).name, "ignore collapsed state").toLooseEqual("q1");
    page.validate(true);
    expect(page.getFirstQuestionToFocus(true).name, "q1 has error").toLooseEqual("q1");
  });
  test("Check getProgressCssClasses method", () => {
    const survey = new SurveyModel({
      "showProgressBar": true,
      "progressBarLocation": "top",
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
    expect(survey.getProgressCssClasses()).toLooseEqual("test_progress test_progress_top");
    survey.showProgressBar = "bottom";
    expect(survey.getProgressCssClasses()).toLooseEqual("test_progress test_progress_bottom");
  });
  test("settings.minWidth/maxWidth", () => {
    const oldMinWidth = settings.minWidth;
    const oldMaxWidth = settings.maxWidth;
    settings.minWidth = "0px";
    settings.maxWidth = "500px";
    const survey = new SurveyModel({
      "showProgressBar": true,
      "progressBarLocation": "top",
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
    expect(q1.minWidth, "q1 minWidth").toLooseEqual("0px");
    expect(q1.maxWidth, "q1 maxWidth").toLooseEqual("500px");
    expect(q2.minWidth, "q2 minWidth").toLooseEqual("50px");
    expect(q2.maxWidth, "q2 maxWidth").toLooseEqual("500px");
    expect(q3.minWidth, "q3 minWidth").toLooseEqual("0px");
    expect(q3.maxWidth, "q3 maxWidth").toLooseEqual("90%");
    expect(q4.minWidth, "q4 (paneldynamic) minWidth").toLooseEqual("auto");
    settings.minWidth = oldMinWidth;
    settings.maxWidth = oldMaxWidth;
  });

  test("getContainerContent - navigation", () => {
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

    expect(survey.showNavigationButtons).toLooseEqual(true);
    expect(survey.navigationButtonsLocation).toLooseEqual("bottom");
    expect(survey.progressBarType).toLooseEqual("pages");
    expect(survey.showProgressBar).toLooseEqual(false);

    expect(getContainerContent("header"), "default header").toEqualValues([]);
    expect(getContainerContent("footer"), "default footer").toEqualValues([]);
    expect(getContainerContent("contentTop"), "default contentTop").toEqualValues([]);
    expect(getContainerContent("contentBottom"), "default contentBottom").toEqualValues([{
      "component": "sv-action-bar",
      "id": "buttons-navigation"
    }]);
    expect(getContainerContent("left"), "default left").toEqualValues([]);
    expect(getContainerContent("right"), "default right").toEqualValues([]);

    survey.showNavigationButtons = true;
    survey.navigationButtonsLocation = "top";
    expect(getContainerContent("header"), "nav top header").toEqualValues([]);
    expect(getContainerContent("footer"), "nav top footer").toEqualValues([]);
    expect(getContainerContent("contentTop"), "nav top contentTop").toEqualValues([{
      "component": "sv-action-bar",
      "id": "buttons-navigation-top"
    }]);
    expect(getContainerContent("contentBottom"), "nav top contentBottom").toEqualValues([]);
    expect(getContainerContent("left"), "nav top left").toEqualValues([]);
    expect(getContainerContent("right"), "nav top right").toEqualValues([]);

    survey.showNavigationButtons = true;
    survey.navigationButtonsLocation = "topBottom";
    expect(getContainerContent("header"), "nav both header").toEqualValues([]);
    expect(getContainerContent("footer"), "nav both footer").toEqualValues([]);
    expect(getContainerContent("contentTop"), "nav both contentTop").toEqualValues([{
      "component": "sv-action-bar",
      "id": "buttons-navigation-top"
    }]);
    expect(getContainerContent("contentBottom"), "nav both contentBottom").toEqualValues([{
      "component": "sv-action-bar",
      "id": "buttons-navigation"
    }]);
    expect(getContainerContent("left"), "nav both left").toEqualValues([]);
    expect(getContainerContent("right"), "nav both right").toEqualValues([]);

    survey.showTOC = true;
    expect(getContainerContent("header"), "nav left header").toEqualValues([]);
    expect(getContainerContent("footer"), "nav left footer").toEqualValues([]);
    expect(getContainerContent("contentTop"), "nav left contentTop").toEqualValues([{
      "component": "sv-action-bar",
      "id": "buttons-navigation-top"
    }]);
    expect(getContainerContent("contentBottom"), "nav left contentBottom").toEqualValues([{
      "component": "sv-action-bar",
      "id": "buttons-navigation"
    }]);
    expect(getContainerContent("left"), "nav left left").toEqualValues([{
      "component": "sv-navigation-toc",
      "id": "toc-navigation"
    }]);
    expect(getContainerContent("right"), "nav left right").toEqualValues([]);

    survey.tocLocation = "right";
    expect(getContainerContent("header"), "nav right header").toEqualValues([]);
    expect(getContainerContent("footer"), "nav right footer").toEqualValues([]);
    expect(getContainerContent("contentTop"), "nav right contentTop").toEqualValues([{
      "component": "sv-action-bar",
      "id": "buttons-navigation-top"
    }]);
    expect(getContainerContent("contentBottom"), "nav right contentBottom").toEqualValues([{
      "component": "sv-action-bar",
      "id": "buttons-navigation"
    }]);
    expect(getContainerContent("left"), "nav right left").toEqualValues([]);
    expect(getContainerContent("right"), "nav right right").toEqualValues([{
      "component": "sv-navigation-toc",
      "id": "toc-navigation"
    }]);

    survey.showProgressBar = false;
    survey.showNavigationButtons = false;
    survey.showTOC = false;
    expect(getContainerContent("header"), "nav none header").toEqualValues([]);
    expect(getContainerContent("footer"), "nav none footer").toEqualValues([]);
    expect(getContainerContent("contentTop"), "nav none contentTop").toEqualValues([]);
    expect(getContainerContent("contentBottom"), "nav none contentBottom").toEqualValues([]);
    expect(getContainerContent("left"), "nav none left").toEqualValues([]);
    expect(getContainerContent("right"), "nav none right").toEqualValues([]);
  });

  test("getContainerContent - progress (legacyProgressBarView)", () => {
    const json = {
      showNavigationButtons: false,
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

      expect(survey.showNavigationButtons).toLooseEqual(false);
      expect(survey.progressBarType).toLooseEqual("pages");
      expect(survey.showProgressBar).toLooseEqual(false);

      expect(getContainerContent("header"), "default header").toEqualValues([]);
      expect(getContainerContent("footer"), "default footer").toEqualValues([]);
      expect(getContainerContent("contentTop"), "default contentTop").toEqualValues([]);
      expect(getContainerContent("contentBottom"), "default contentBottom").toEqualValues([]);
      expect(getContainerContent("left"), "default left").toEqualValues([]);
      expect(getContainerContent("right"), "default right").toEqualValues([]);

      survey.showProgressBar = "top";
      expect(getContainerContent("header"), "progress top header").toEqualValues([]);
      expect(getContainerContent("center"), "progress top center").toEqualValues([{
        "component": "sv-progress-pages",
        "id": "progress-pages"
      }]);
      expect(getContainerContent("footer"), "progress top footer").toEqualValues([]);
      expect(getContainerContent("contentTop"), "progress top contentTop").toEqualValues([]);
      expect(getContainerContent("contentBottom"), "progress top contentBottom").toEqualValues([]);
      expect(getContainerContent("left"), "progress top left").toEqualValues([]);
      expect(getContainerContent("right"), "progress top right").toEqualValues([]);

      survey.showProgressBar = "bottom";
      expect(getContainerContent("header"), "progress bottom header").toEqualValues([]);
      expect(getContainerContent("footer"), "progress bottom footer").toEqualValues([{
        "component": "sv-progress-pages",
        "id": "progress-pages"
      }]);
      expect(getContainerContent("contentTop"), "progress bottom contentTop").toEqualValues([]);
      expect(getContainerContent("contentBottom"), "progress bottom contentBottom").toEqualValues([]);
      expect(getContainerContent("left"), "progress bottom left").toEqualValues([]);
      expect(getContainerContent("right"), "progress bottom right").toEqualValues([]);

      survey.showProgressBar = "both";
      expect(getContainerContent("header"), "progress both header").toEqualValues([]);
      expect(getContainerContent("center"), "progress both center").toEqualValues([{
        "component": "sv-progress-pages",
        "id": "progress-pages"
      }]);
      expect(getContainerContent("footer"), "progress both footer").toEqualValues([{
        "component": "sv-progress-pages",
        "id": "progress-pages"
      }]);
      expect(getContainerContent("contentTop"), "progress both contentTop").toEqualValues([]);
      expect(getContainerContent("contentBottom"), "progress both contentBottom").toEqualValues([]);
      expect(getContainerContent("left"), "progress both left").toEqualValues([]);
      expect(getContainerContent("right"), "progress both right").toEqualValues([]);

      survey.progressBarType = "questions";
      expect(getContainerContent("header"), "progress questions both header").toEqualValues([]);
      expect(getContainerContent("center"), "progress questions both header").toEqualValues([{
        "component": "sv-progress-questions",
        "id": "progress-questions"
      }]);
      expect(getContainerContent("footer"), "progress questions both footer").toEqualValues([{
        "component": "sv-progress-questions",
        "id": "progress-questions"
      }]);
      expect(getContainerContent("contentTop"), "progress questions both contentTop").toEqualValues([]);
      expect(getContainerContent("contentBottom"), "progress questions both contentBottom").toEqualValues([]);
      expect(getContainerContent("left"), "progress questions both left").toEqualValues([]);
      expect(getContainerContent("right"), "progress questions both right").toEqualValues([]);

      survey.showTOC = true;
      expect(getContainerContent("header"), "progress toc both header").toEqualValues([]);
      expect(getContainerContent("center"), "progress toc both center").toEqualValues([{
        "component": "sv-progress-questions",
        "id": "progress-questions"
      }]);
      expect(getContainerContent("footer"), "progress toc both footer").toEqualValues([{
        "component": "sv-progress-questions",
        "id": "progress-questions"
      }]);
      expect(getContainerContent("contentTop"), "progress toc both contentTop").toEqualValues([]);
      expect(getContainerContent("contentBottom"), "progress toc both contentBottom").toEqualValues([]);
      expect(getContainerContent("left"), "progress toc both left").toEqualValues([{
        "component": "sv-navigation-toc",
        "id": "toc-navigation"
      }]);
      expect(getContainerContent("right"), "progress toc both right").toEqualValues([]);

      survey.showProgressBar = false;
      survey.tocLocation = "left";
      expect(getContainerContent("header"), "progress toc left header").toEqualValues([]);
      expect(getContainerContent("footer"), "progress toc left footer").toEqualValues([]);
      expect(getContainerContent("contentTop"), "progress toc left contentTop").toEqualValues([]);
      expect(getContainerContent("contentBottom"), "progress toc left contentBottom").toEqualValues([]);
      expect(getContainerContent("left"), "progress toc left left").toEqualValues([{
        "component": "sv-navigation-toc",
        "id": "toc-navigation"
      }]);
      expect(getContainerContent("right"), "progress toc left right").toEqualValues([]);

      survey.tocLocation = "right";
      expect(getContainerContent("header"), "progress toc right header").toEqualValues([]);
      expect(getContainerContent("footer"), "progress toc right footer").toEqualValues([]);
      expect(getContainerContent("contentTop"), "progress toc right contentTop").toEqualValues([]);
      expect(getContainerContent("contentBottom"), "progress toc right contentBottom").toEqualValues([]);
      expect(getContainerContent("left"), "progress toc right left").toEqualValues([]);
      expect(getContainerContent("right"), "progress toc right right").toEqualValues([{
        "component": "sv-navigation-toc",
        "id": "toc-navigation"
      }]);

      survey.showTOC = false;
      expect(getContainerContent("header"), "default header").toEqualValues([]);
      expect(getContainerContent("footer"), "default footer").toEqualValues([]);
      expect(getContainerContent("contentTop"), "default contentTop").toEqualValues([]);
      expect(getContainerContent("contentBottom"), "default contentBottom").toEqualValues([]);
      expect(getContainerContent("left"), "default left").toEqualValues([]);
      expect(getContainerContent("right"), "default right").toEqualValues([]);

    } finally {
      settings.legacyProgressBarView = false;
    }
  });

  test("getContainerContent - progress", () => {
    surveyCss.currentType = "default";
    const json = {
      showNavigationButtons: false,
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

    expect(survey.showNavigationButtons).toLooseEqual(false);
    expect(survey.progressBarType).toLooseEqual("pages");
    expect(survey.showProgressBar).toLooseEqual(false);

    expect(getContainerContent("header"), "default header").toEqualValues([]);
    expect(getContainerContent("footer"), "default footer").toEqualValues([]);
    expect(getContainerContent("contentTop"), "default contentTop").toEqualValues([]);
    expect(getContainerContent("contentBottom"), "default contentBottom").toEqualValues([]);
    expect(getContainerContent("left"), "default left").toEqualValues([]);
    expect(getContainerContent("right"), "default right").toEqualValues([]);

    survey.showProgressBar = "top";
    expect(getContainerContent("header"), "progress top header").toEqualValues([]);
    expect(getContainerContent("center"), "progress top center").toEqualValues([{
      "component": "sv-progress-buttons",
      "id": "progress-buttons"
    }]);
    expect(getContainerContent("footer"), "progress top footer").toEqualValues([]);
    expect(getContainerContent("contentTop"), "progress top contentTop").toEqualValues([]);
    expect(getContainerContent("contentBottom"), "progress top contentBottom").toEqualValues([]);
    expect(getContainerContent("left"), "progress top left").toEqualValues([]);
    expect(getContainerContent("right"), "progress top right").toEqualValues([]);

    survey.showProgressBar = "bottom";
    expect(getContainerContent("header"), "progress bottom header").toEqualValues([]);
    expect(getContainerContent("footer"), "progress bottom footer").toEqualValues([{
      "component": "sv-progress-buttons",
      "id": "progress-buttons"
    }]);
    expect(getContainerContent("contentTop"), "progress bottom contentTop").toEqualValues([]);
    expect(getContainerContent("contentBottom"), "progress bottom contentBottom").toEqualValues([]);
    expect(getContainerContent("left"), "progress bottom left").toEqualValues([]);
    expect(getContainerContent("right"), "progress bottom right").toEqualValues([]);

    survey.showProgressBar = "both";
    expect(getContainerContent("header"), "progress both header").toEqualValues([]);
    expect(getContainerContent("center"), "progress both center").toEqualValues([{
      "component": "sv-progress-buttons",
      "id": "progress-buttons"
    }]);
    expect(getContainerContent("footer"), "progress both footer").toEqualValues([{
      "component": "sv-progress-buttons",
      "id": "progress-buttons"
    }]);
    expect(getContainerContent("contentTop"), "progress both contentTop").toEqualValues([]);
    expect(getContainerContent("contentBottom"), "progress both contentBottom").toEqualValues([]);
    expect(getContainerContent("left"), "progress both left").toEqualValues([]);
    expect(getContainerContent("right"), "progress both right").toEqualValues([]);

    survey.progressBarType = "questions";
    expect(getContainerContent("header"), "progress questions both header").toEqualValues([]);
    expect(getContainerContent("center"), "progress questions both header").toEqualValues([{
      "component": "sv-progress-questions",
      "id": "progress-questions"
    }]);
    expect(getContainerContent("footer"), "progress questions both footer").toEqualValues([{
      "component": "sv-progress-questions",
      "id": "progress-questions"
    }]);
    expect(getContainerContent("contentTop"), "progress questions both contentTop").toEqualValues([]);
    expect(getContainerContent("contentBottom"), "progress questions both contentBottom").toEqualValues([]);
    expect(getContainerContent("left"), "progress questions both left").toEqualValues([]);
    expect(getContainerContent("right"), "progress questions both right").toEqualValues([]);

    survey.showTOC = true;
    expect(getContainerContent("header"), "progress toc both header").toEqualValues([]);
    expect(getContainerContent("center"), "progress toc both center").toEqualValues([{
      "component": "sv-progress-questions",
      "id": "progress-questions"
    }]);
    expect(getContainerContent("footer"), "progress toc both footer").toEqualValues([{
      "component": "sv-progress-questions",
      "id": "progress-questions"
    }]);
    expect(getContainerContent("contentTop"), "progress toc both contentTop").toEqualValues([]);
    expect(getContainerContent("contentBottom"), "progress toc both contentBottom").toEqualValues([]);
    expect(getContainerContent("left"), "progress toc both left").toEqualValues([{
      "component": "sv-navigation-toc",
      "id": "toc-navigation"
    }]);
    expect(getContainerContent("right"), "progress toc both right").toEqualValues([]);

    survey.showProgressBar = false;
    survey.tocLocation = "left";
    expect(getContainerContent("header"), "progress toc left header").toEqualValues([]);
    expect(getContainerContent("footer"), "progress toc left footer").toEqualValues([]);
    expect(getContainerContent("contentTop"), "progress toc left contentTop").toEqualValues([]);
    expect(getContainerContent("contentBottom"), "progress toc left contentBottom").toEqualValues([]);
    expect(getContainerContent("left"), "progress toc left left").toEqualValues([{
      "component": "sv-navigation-toc",
      "id": "toc-navigation"
    }]);
    expect(getContainerContent("right"), "progress toc left right").toEqualValues([]);

    survey.tocLocation = "right";
    expect(getContainerContent("header"), "progress toc right header").toEqualValues([]);
    expect(getContainerContent("footer"), "progress toc right footer").toEqualValues([]);
    expect(getContainerContent("contentTop"), "progress toc right contentTop").toEqualValues([]);
    expect(getContainerContent("contentBottom"), "progress toc right contentBottom").toEqualValues([]);
    expect(getContainerContent("left"), "progress toc right left").toEqualValues([]);
    expect(getContainerContent("right"), "progress toc right right").toEqualValues([{
      "component": "sv-navigation-toc",
      "id": "toc-navigation"
    }]);

    survey.showTOC = false;
    expect(getContainerContent("header"), "default header").toEqualValues([]);
    expect(getContainerContent("footer"), "default footer").toEqualValues([]);
    expect(getContainerContent("contentTop"), "default contentTop").toEqualValues([]);
    expect(getContainerContent("contentBottom"), "default contentBottom").toEqualValues([]);
    expect(getContainerContent("left"), "default left").toEqualValues([]);
    expect(getContainerContent("right"), "default right").toEqualValues([]);
  });

  test("getContainerContent - do not show TOC on preview", () => {
    const json = {
      showTOC: true,
      "showPreviewBeforeComplete": true,
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

    expect(getContainerContent("header"), "").toEqualValues([]);
    expect(getContainerContent("footer"), "").toEqualValues([]);
    expect(getContainerContent("contentTop"), "").toEqualValues([]);
    expect(getContainerContent("contentBottom"), "").toEqualValues([{
      "component": "sv-action-bar",
      "id": "buttons-navigation"
    }]);
    expect(getContainerContent("left"), "show toc left").toEqualValues([{
      "component": "sv-navigation-toc",
      "id": "toc-navigation"
    }]);
    expect(getContainerContent("right"), "").toEqualValues([]);

    survey.nextPage();
    survey.showPreview();

    expect(getContainerContent("header"), "").toEqualValues([]);
    expect(getContainerContent("footer"), "").toEqualValues([]);
    expect(getContainerContent("contentTop"), "").toEqualValues([]);
    expect(getContainerContent("contentBottom"), "").toEqualValues([{
      "component": "sv-action-bar",
      "id": "buttons-navigation"
    }]);
    expect(getContainerContent("left"), "do not show toc left").toEqualValues([]);
    expect(getContainerContent("right"), "").toEqualValues([]);
  });

  test("getContainerContent - do not show TOC on start page", () => {
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

    expect(getContainerContent("header"), "").toEqualValues([]);
    expect(getContainerContent("footer"), "").toEqualValues([]);
    expect(getContainerContent("contentTop"), "").toEqualValues([]);
    expect(getContainerContent("contentBottom"), "").toEqualValues([{
      "component": "sv-action-bar",
      "id": "buttons-navigation"
    }]);
    expect(getContainerContent("left"), "empty on the start page").toEqualValues([]);

    survey.start();
    expect(getContainerContent("header"), "").toEqualValues([]);
    expect(getContainerContent("footer"), "").toEqualValues([]);
    expect(getContainerContent("contentTop"), "").toEqualValues([]);
    expect(getContainerContent("contentBottom"), "").toEqualValues([{
      "component": "sv-action-bar",
      "id": "buttons-navigation"
    }]);
    expect(getContainerContent("left"), "show toc left").toEqualValues([{
      "component": "sv-navigation-toc",
      "id": "toc-navigation"
    }]);
    expect(getContainerContent("right"), "").toEqualValues([]);
  });

  test("getContainerContent - do not show buttons progress on completed page", () => {
    const json = {
      "progressBarType": "pages",
      "progressBarShowPageTitles": true,
      "showProgressBar": true,
      "progressBarLocation": "top",
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

    expect(getContainerContent("header"), "").toEqualValues([]);
    expect(getContainerContent("footer"), "").toEqualValues([]);
    expect(getContainerContent("center"), "").toEqualValues([{
      "component": "sv-progress-buttons",
      "id": "progress-buttons"
    }]);
    expect(getContainerContent("contentTop"), "").toEqualValues([]);
    expect(getContainerContent("contentBottom"), "").toEqualValues([{
      "component": "sv-action-bar",
      "id": "buttons-navigation"
    }]);
    expect(getContainerContent("left"), "").toEqualValues([]);
    expect(getContainerContent("right"), "").toEqualValues([]);

    survey.doComplete();

    expect(getContainerContent("header"), "").toEqualValues([]);
    expect(getContainerContent("footer"), "").toEqualValues([]);
    expect(getContainerContent("contentTop"), "").toEqualValues([]);
    expect(getContainerContent("contentBottom"), "").toEqualValues([{
      "component": "sv-action-bar",
      "id": "buttons-navigation"
    }]);
    expect(getContainerContent("left"), "").toEqualValues([]);
    expect(getContainerContent("right"), "").toEqualValues([]);
  });
  test("getContainerContent - do not show advanced header on completed page", () => {
    const json = {
      headerView: "advanced",
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

    expect(getContainerContent("header"), "header for running survey").toEqualValues([{
      "component": "sv-header",
      "container": "header",
      "id": "advanced-header",
      "index": -100
    }]);
    expect(getContainerContent("footer"), "").toEqualValues([]);
    expect(getContainerContent("contentTop"), "").toEqualValues([]);
    expect(getContainerContent("contentBottom"), "").toEqualValues([{
      "component": "sv-action-bar",
      "id": "buttons-navigation"
    }]);
    expect(getContainerContent("left"), "").toEqualValues([]);
    expect(getContainerContent("right"), "").toEqualValues([]);

    survey.doComplete();

    expect(getContainerContent("header"), "header on complete page").toEqualValues([]);
    expect(getContainerContent("footer"), "").toEqualValues([]);
    expect(getContainerContent("contentTop"), "").toEqualValues([]);
    expect(getContainerContent("contentBottom"), "").toEqualValues([{
      "component": "sv-action-bar",
      "id": "buttons-navigation"
    }]);
    expect(getContainerContent("left"), "").toEqualValues([]);
    expect(getContainerContent("right"), "").toEqualValues([]);
  });
  test("getContainerContent - do show advanced header on completed page if showHeaderOnCompletePage is set", () => {
    const json = {
      headerView: "advanced",
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
    survey.applyTheme({ cssVariables: { "--sjs-header-backcolor": "red" }, "headerView": "advanced" } as any);
    function getContainerContent(container: LayoutElementContainer) {
      let result = survey.getContainerContent(container);
      result.forEach(item => {
        delete item["data"];
        delete item["getData"];
        delete item["processResponsiveness"];
      });
      return result;
    }

    expect(survey.showHeaderOnCompletePage).toLooseEqual("auto");
    survey.showHeaderOnCompletePage = true;

    expect(getContainerContent("header"), "header for running survey").toEqualValues([{
      "component": "sv-header",
      "container": "header",
      "id": "advanced-header",
      "index": -100
    }]);
    expect(getContainerContent("footer"), "").toEqualValues([]);
    expect(getContainerContent("contentTop"), "").toEqualValues([]);
    expect(getContainerContent("contentBottom"), "").toEqualValues([{
      "component": "sv-action-bar",
      "id": "buttons-navigation"
    }]);
    expect(getContainerContent("left"), "").toEqualValues([]);
    expect(getContainerContent("right"), "").toEqualValues([]);

    survey.doComplete();

    expect(getContainerContent("header"), "header on complete page").toEqualValues([{
      "component": "sv-header",
      "container": "header",
      "id": "advanced-header",
      "index": -100
    }]);
    expect(getContainerContent("footer"), "").toEqualValues([]);
    expect(getContainerContent("contentTop"), "").toEqualValues([]);
    expect(getContainerContent("contentBottom"), "").toEqualValues([{
      "component": "sv-action-bar",
      "id": "buttons-navigation"
    }]);
    expect(getContainerContent("left"), "").toEqualValues([]);
    expect(getContainerContent("right"), "").toEqualValues([]);
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
  test("getStructuredData function", () => {
    const survey = new SurveyModel(structedDataSurveyJSON);
    survey.setValue("q1", 100);
    survey.setValue("q2", 200);
    survey.setValue("q3", 300);
    survey.setValue("q21", 2100);
    survey.setValue("q22", 2200);
    const data = survey.data;
    expect(survey.getStructuredData(true, 0), "Level is 0, true").toEqualValues(data);
    expect(survey.getStructuredData(false, 0), "Level is 0, false").toEqualValues(data);
    expect(survey.getStructuredData(), "includePages: true, level: -1").toEqualValues({
      page1: { q1: 100, panel1: { q2: 200, panel2: { q3: 300 } } },
      page2: { q21: 2100, panel21: { q22: 2200 } },
    });
    expect(survey.getStructuredData(false), "includePages: false, level: -1").toEqualValues({
      q1: 100, panel1: { q2: 200, panel2: { q3: 300 } },
      q21: 2100, panel21: { q22: 2200 },
    });
    expect(survey.getStructuredData(true, 1), "includePages: true, level: 1").toEqualValues({
      page1: { q1: 100, q2: 200, q3: 300 },
      page2: { q21: 2100, q22: 2200 },
    });
    expect(survey.getStructuredData(false, 1), "includePages: false, level: 1").toEqualValues({
      q1: 100, panel1: { q2: 200, q3: 300 },
      q21: 2100, panel21: { q22: 2200 },
    });
    expect(survey.getStructuredData(true, 2), "includePages: true, level: 2").toEqualValues({
      page1: { q1: 100, panel1: { q2: 200, q3: 300 } },
      page2: { q21: 2100, panel21: { q22: 2200 } },
    });
    expect(survey.getStructuredData(false, 2), "includePages: false, level: 2").toEqualValues({
      q1: 100, panel1: { q2: 200, panel2: { q3: 300 } },
      q21: 2100, panel21: { q22: 2200 },
    });
    expect(survey.getStructuredData(true, 3), "includePages: true, level: 3").toEqualValues({
      page1: { q1: 100, panel1: { q2: 200, panel2: { q3: 300 } } },
      page2: { q21: 2100, panel21: { q22: 2200 } },
    });
    expect(survey.getStructuredData(false, 3), "includePages: false, level: 3").toEqualValues({
      q1: 100, panel1: { q2: 200, panel2: { q3: 300 } },
      q21: 2100, panel21: { q22: 2200 },
    });

  });
  test("getData function", () => {
    const survey = new SurveyModel(structedDataSurveyJSON);
    survey.setValue("q1", 100);
    survey.setValue("q2", 200);
    survey.setValue("q3", 300);
    survey.setValue("q21", 2100);
    survey.setValue("q22", 2200);
    const data = survey.data;
    expect(survey.getData(), "survey.getData()").toEqualValues(data);
    expect(survey.getData({}), "survey.getData({})").toEqualValues(data);
    expect(survey.getData({ includePages: false, includePanels: false }), "survey.getData({ includePages: false, includePanels: false })").toEqualValues(data);
    expect(survey.getData({ includePages: true, includePanels: false }), "survey.getData({ includePages: true, includePanels: false })").toEqualValues({
      page1: { q1: 100, q2: 200, q3: 300 },
      page2: { q21: 2100, q22: 2200 },
    });
    expect(survey.getData({ includePages: true, includePanels: true }), "survey.getData({ includePages: true, includePanels: true })").toEqualValues({
      page1: { q1: 100, panel1: { q2: 200, panel2: { q3: 300 } } },
      page2: { q21: 2100, panel21: { q22: 2200 } },
    });
    expect(survey.getData({ includePages: false, includePanels: true }), "survey.getData({ includePages: true, includePanels: true })").toEqualValues({
      q1: 100, panel1: { q2: 200, panel2: { q3: 300 } },
      q21: 2100, panel21: { q22: 2200 },
    });
  });
  test("setStructuredData function", () => {
    const survey = new SurveyModel(structedDataSurveyJSON);
    survey.setStructuredData({
      page1: { q1: 100, panel1: { q2: 200, panel2: { q3: 300 } } },
      page2: { q21: 2100, panel21: { q22: 2200 } }
    });
    expect(survey.data, "#1").toEqualValues({ q1: 100, q2: 200, q3: 300, q21: 2100, q22: 2200 });
    survey.setStructuredData({
      q1: 101, panel1: { q2: 201, panel2: { q3: 301 } },
      q21: 2101, panel21: { q22: 2201 }
    });
    expect(survey.data, "#2").toEqualValues({ q1: 101, q2: 201, q3: 301, q21: 2101, q22: 2201 });
    survey.setStructuredData({
      page1: { q1: 102, q2: 202, q3: 302 },
      page2: { q21: 2102, q22: 2202 },
    });
    expect(survey.data, "#3").toEqualValues({ q1: 102, q2: 202, q3: 302, q21: 2102, q22: 2202 });
    survey.setStructuredData({ page1: { q1: 103 } }, true);
    expect(survey.data, "#4").toEqualValues({ q1: 103, q2: 202, q3: 302, q21: 2102, q22: 2202 });
    survey.setStructuredData({ page1: { q1: 104 } });
    expect(survey.data, "#5").toEqualValues({ q1: 104 });
  });

  test("check titleNumInline cssClass", () => {
    const survey = new SurveyModel({
      showQuestionNumbers: true,
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
    expect(question.cssTitle.includes(customInlineClass), "#1").toBeTruthy();
    expect(panel.cssTitle.includes(customInlineClass), "#2").toBeTruthy();
    survey.questionStartIndex = "1.1";
    expect(question.cssTitle.includes(customInlineClass), "#3").toBeFalsy();
    expect(panel.cssTitle.includes(customInlineClass), "#4").toBeFalsy();
  });
  test("check titleNumInline cssClass, Bug#10775", () => {
    const survey = new SurveyModel({
      showQuestionNumbers: "on",
      questionStartIndex: "Question 1",
      elements: [{
        type: "text",
        name: "q1"
      },
      {
        type: "text",
        name: "q2",
        visibleIf: "{q1} = 1"
      }
      ]
    });
    const customInlineClass = "custom_inline_class";
    survey.css = {
      question: {
        titleNumInline: customInlineClass
      }
    };
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    expect(q1.cssTitle.includes(customInlineClass), "q1 titleNumInline class check #1").toBeTruthy();
    q1.value = 1;
    expect(q2.isVisible).toBeTruthy();
    expect(q2.cssTitle.includes(customInlineClass), "q2 titleNumInline class check #2").toBeTruthy();
    q1.value = 2;
    expect(q2.isVisible).toBeFalsy();
    q1.value = 1;
    expect(q2.isVisible).toBeTruthy();
    expect(q2.cssTitle.includes(customInlineClass), "q2 titleNumInline class check #3").toBeTruthy();
  });
  test("Survey setDesignMode should not trigger pages regeneration if not changed", () => {
    var survey = twoPageSimplestSurvey();
    survey.isSinglePage = true;
    expect(survey.visiblePages.length, "We should have 1 page, #1").toLooseEqual(1);
    expect(survey.currentPage.elements.length, "We should have 2 panels, #1").toLooseEqual(2);
    survey.setDesignMode(false);
    expect(survey.visiblePages.length, "We should have 1 page, #2").toLooseEqual(1);
    expect(survey.currentPage.elements.length, "We should have 2 panels, #2").toLooseEqual(2);
    survey.setDesignMode(true);
    expect(survey.visiblePages.length, "We should have 2 pages, #3").toLooseEqual(2);
  });
  test("Try again button should call onComplete", () => {
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
    expect(survey.state, "the survey is completed").toLooseEqual("completed");
    expect(attempts, "There were 3 attempts").toLooseEqual(3);
  });
  test("Use variables as default values in expression", () => {
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
    expect(q1.value, "q1.value").toLooseEqual("AAA");
    expect(q2.value, "q2.value").toLooseEqual("BBB");
    expect(q3.value, "q3.value").toLooseEqual("CCC");
  });

  test("backgroundImage", () => {
    const imageUrl = "https://image.shutterstock.com/image-photo/agave-cactus-abstract-natural-pattern-600w-1056037874.jpg";
    const survey = new SurveyModel({
      "backgroundImage": imageUrl,
    });
    expect(survey.backgroundImage, "backgroundImage").toLooseEqual(imageUrl);
    expect(survey.renderBackgroundImage, "renderBackgroundImage").toLooseEqual(wrapUrlForBackgroundImage(imageUrl));
  });

  test("If localizable string has isLocalizable set to false then it should have only one value", () => {
    const titleProp = Serializer.findProperty("survey", "title");
    titleProp.isLocalizable = false;
    const survey = new SurveyModel();
    survey.title = "val1";
    survey.locale = "de";
    survey.title = "val2";
    survey.locale = "fr";
    survey.title = "val3";
    expect(survey.locTitle.getJson(), "It supports only one locale").toLooseEqual("val3");
    titleProp.isLocalizable = true;
  });

  test("getContainerContent - navigation with page.showNavigationButtons", () => {
    const json = {
      pages: [
        {
          "showNavigationButtons": false,
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
          "showNavigationButtons": true,
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

    expect(survey.showNavigationButtons).toLooseEqual(true);
    expect(survey.navigationButtonsLocation).toLooseEqual("bottom");

    expect(getContainerContent("header"), "nav none header").toEqualValues([]);
    expect(getContainerContent("footer"), "nav none footer").toEqualValues([]);
    expect(getContainerContent("contentTop"), "nav none contentTop").toEqualValues([]);
    expect(getContainerContent("contentBottom"), "nav none contentBottom").toEqualValues([]);
    expect(getContainerContent("left"), "nav none left").toEqualValues([]);
    expect(getContainerContent("right"), "nav none right").toEqualValues([]);

    survey.nextPage();
    expect(getContainerContent("header"), "default header").toEqualValues([]);
    expect(getContainerContent("footer"), "default footer").toEqualValues([]);
    expect(getContainerContent("contentTop"), "default contentTop").toEqualValues([]);
    expect(getContainerContent("contentBottom"), "default contentBottom").toEqualValues([{
      "component": "sv-action-bar",
      "id": "buttons-navigation"
    }]);
    expect(getContainerContent("left"), "default left").toEqualValues([]);
    expect(getContainerContent("right"), "default right").toEqualValues([]);

    survey.showNavigationButtons = false;
    expect(getContainerContent("header"), "default header").toEqualValues([]);
    expect(getContainerContent("footer"), "default footer").toEqualValues([]);
    expect(getContainerContent("contentTop"), "default contentTop").toEqualValues([]);
    expect(getContainerContent("contentBottom"), "default contentBottom").toEqualValues([{
      "component": "sv-action-bar",
      "id": "buttons-navigation"
    }]);
    expect(getContainerContent("left"), "default left").toEqualValues([]);
    expect(getContainerContent("right"), "default right").toEqualValues([]);
  });
  test("survey.showNavigationButtons = 'none', page.showNavigationButtons = true & firstPageIsStartPage is true, Bug#9248", () => {
    const survey = new SurveyModel({
      showNavigationButtons: false,
      firstPageIsStartPage: true,
      pages: [
        {
          "showNavigationButtons": true,
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
    expect(survey.state, "The first page is started").toLooseEqual("starting");
    expect(survey.isNavigationButtonsShowing, "The first page is started").toLooseEqual("bottom");
    survey.start();
    expect(survey.state, "The start button is cliced").toLooseEqual("running");
    expect(survey.isNavigationButtonsShowing, "Hide navigation buttons").toLooseEqual("none");
  });

  test("getContainerContent - header elements order", () => {
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
    survey.applyTheme({ cssVariables: { "--sjs-header-backcolor": "red" }, "headerView": "advanced" } as any);

    expect(getContainerContent("header"), "advanved header first, progress next").toEqualValues([
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
    ]);
  });
  test("Do not set data in LayoutElement by default", () => {
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
    expect(el, "toc-navigation is found").toBeTruthy();
    expect(el.data, "data is not set").toBeFalsy();
    survey.showTOC = true;
    const els: Array<any> = survey.getContainerContent("left");
    expect(els.length, "There is one element").toLooseEqual(1);
    expect(els[0].id, "This element is toc").toLooseEqual("toc-navigation");
    expect(els[0].data, "data is set").toBeTruthy();
  });

  test("restore header css variable if header is default", () => {
    const json = {
      title: "Title",
      elements: [{ "type": "rating", "name": "satisfaction" }]
    };
    let survey = new SurveyModel(json);
    survey.applyTheme({ "headerView": "advanced", cssVariables: { "--sjs-header-backcolor": "transparent" } } as any);

    const cover = survey.findLayoutElement("advanced-header").data as Cover;
    expect(cover.headerClasses).toLooseEqual("sv-header sv-header--height-auto sv-header__without-background sv-header__background-color--none");
  });

  test("check title classes when readOnly changed", () => {
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
    expect(question.cssTitle.includes(customDisabledClass)).toBeFalsy();
    question.readOnly = true;
    expect(question.cssTitle.includes(customDisabledClass)).toBeTruthy();
    question.readOnly = false;
    expect(question.cssTitle.includes(customDisabledClass)).toBeFalsy();
  });
  test("Do not run onComplete twice if complete trigger and tryComplete() is called", () => {
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
    expect(counter, "onComplete called one time").toLooseEqual(1);
  });

  test("Check readOnly flag", () => {
    let survey = new SurveyModel({
      readOnly: true,
      "elements": [
        {
          "type": "text",
          "name": "question1"
        },
      ],
    });
    expect(survey.mode).toLooseEqual("display");
    expect(survey.readOnly).toBeTruthy();
    survey.readOnly = false;
    expect(survey.readOnly).toBeFalsy();
    survey = new SurveyModel({
      mode: "display",
      "elements": [
        {
          "type": "text",
          "name": "question1"
        },
      ],
    });
    expect(survey.readOnly).toBeTruthy();
    survey.readOnly = false;
    expect(survey.readOnly).toBeFalsy();
  });
  test("Expression with dates & defaultValueExpression & expression question", () => {
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
        expect(val, "check no: " + no + ", value name: " + name).toLooseEqual(res[i]);
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

  test("Check onPopupVisibleChanged events #1", () => {
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
      expect(options.question).toLooseEqual(question);
      expect(options.popup).toLooseEqual(popup);
      log += `->${options.visible}`;
    });
    popup.toggleVisibility();
    expect(log).toLooseEqual("->true");
    popup.toggleVisibility();
    expect(log).toLooseEqual("->true->false");
  });
  test("Check onPopupVisibleChanged events #2", () => {
    expect(settings.comparator.caseSensitive, "comparator.caseSensitive is false").toLooseEqual(false);
    const survey = new SurveyModel({ elements: [{ "type": "text", "name": "q1" }] });
    const q = survey.getQuestionByName("q1");
    survey.onValueChanging.add((sender, options) => {
      options.value = options.value.toUpperCase();
    });
    q.value = "abc";
    expect(q.value, "Convert to upper case").toLooseEqual("ABC");
  });
  test("survey onValueChaging & trigger, Bug#10219", () => {
    const survey = new SurveyModel({ elements: [
      { "type": "text", "name": "q1" },
      { "type": "text", "name": "q2" }
    ],
    triggers: [
      { type: "setvalue", setToName: "q2", expression: "{q1} = 'a'", setValue: "b" }
    ] });
    survey.onValueChanging.add((sender, options) => {
      if (options.name === "q1" && options.value !== "a") {
        options.value = "a";
      }
    });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    q1.value = "a";
    expect(q1.value, "q1.value is #1").toLooseEqual("a");
    expect(q2.value, "q2.value is #1").toLooseEqual("b");
    q2.value = "";
    q1.value = "c";
    expect(q1.value, "q1.value is #2").toLooseEqual("a");
    expect(q2.value, "q2.value #2").toLooseEqual("");
  });

  test("Check onOpenDropdownMenu events", () => {
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
      expect(options.question).toLooseEqual(question);
      expect(options.menuType, "options.menuType").toLooseEqual("dropdown");

      options.menuType = "overlay";
    });

    expect(popup.displayMode, "displayMode #0").toLooseEqual("popup");
    expect(popup.overlayDisplayMode, "overlayDisplayMode #0").toLooseEqual("auto");

    popup.toggleVisibility();
    expect(popup.displayMode, "displayMode #1").toLooseEqual("overlay");
    expect(popup.overlayDisplayMode, "overlayDisplayMode #1").toLooseEqual("dropdown-overlay");
  });

  test("Search disabled & onOpenDropdownMenu events", () => {
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

    expect(popup.displayMode, "#1").toLooseEqual("overlay");
    expect(popup.setWidthByTarget, "#2").toLooseEqual(false);
    expect(list.showFilter, "#3").toLooseEqual(false);
    expect(list.searchEnabled, "#4").toLooseEqual(false);

    popup.show();
    expect(popup.displayMode, "#1.1").toLooseEqual("popup");
    expect(popup.setWidthByTarget, "#2.1").toLooseEqual(true);
    expect(list.showFilter, "#3.1").toLooseEqual(false);
    expect(list.searchEnabled, "#4.1").toLooseEqual(false);

    _setIsTouch(false);
  });

  test("Search disabled after change popup displayMode", () => {
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
    let menuType = "popup";
    survey.onOpenDropdownMenu.add((_, options) => {
      options.menuType = menuType as any;
    });

    list.flushUpdates();

    expect(popup.displayMode, "#1").toLooseEqual("overlay");
    expect(popup.setWidthByTarget, "#2").toLooseEqual(false);
    expect(list.showFilter, "#3").toLooseEqual(false);
    expect(list.searchEnabled, "#4").toLooseEqual(true);

    question.choices.push(new ItemValue("Renault"));
    popup.show();
    expect(list.showFilter, "#5").toLooseEqual(true);
    popup.hide();

    menuType = "dropdown";
    popup.show();
    expect(popup.displayMode, "#1.1").toLooseEqual("popup");
    expect(popup.setWidthByTarget, "#2.1").toLooseEqual(true);
    expect(list.showFilter, "#3.1").toLooseEqual(false);
    expect(list.searchEnabled, "#4.1").toLooseEqual(false);

    _setIsTouch(false);
  });

  test("Dropdown with the 'dropdown' popup style is closed immediatelly", () => {
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
    survey.onOpenDropdownMenu.add((_, options) => {
      options.menuType = "dropdown";
    });

    expect(popup.displayMode, "#1").toLooseEqual("overlay");
    expect(popup.setWidthByTarget, "#2").toLooseEqual(false);
    expect(popup.isFocusedContent, "#3").toLooseEqual(true);
    expect(popup.isFocusedContainer, "#4").toLooseEqual(false);

    popup.show();
    expect(popup.displayMode, "#1.1").toLooseEqual("popup");
    expect(popup.setWidthByTarget, "#2.1").toLooseEqual(true);
    expect(popup.isFocusedContent, "#3.1").toLooseEqual(false);
    expect(popup.isFocusedContainer, "#4.1").toLooseEqual(false);

    _setIsTouch(false);
  });

  test("Shared data #6584", () => {
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
    expect(survey.data, "survey.data").toEqualValues({ sharedData: [{ name: "1 name", matrix1: [{ b_eil_nr: 1, b_name: "1 name" }] }] });
    expect(p2.value, "panel2.data").toEqualValues([{ name: "1 name", matrix1: [{ b_eil_nr: 1, b_name: "1 name" }] }]);
    const matrix = <QuestionMatrixDynamicModel>p2.panels[0].questions[0];
    expect(matrix.value, "panel2[0].matrix1.data").toEqualValues([{ b_eil_nr: 1, b_name: "1 name" }]);
    const table = matrix.renderedTable;
    expect(table.rows.length, "One row in rendered table").toLooseEqual(2);
    expect(table.rows[1].cells[0].question.value).toLooseEqual(1);
    expect(table.rows[1].cells[1].question.value).toLooseEqual("1 name");
    const rows = matrix.visibleRows;
    expect(rows.length, "one row is added, rowCount: 1").toLooseEqual(1);
    expect(rows[0].cells[0].question.value, "cell [0,0]").toLooseEqual(1);
    expect(rows[0].cells[1].question.value, "cell [0,1]").toLooseEqual("1 name");
  });
  test("survey.getNestedQuestions", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        { type: "multipletext", name: "q2", items: [{ name: "q2_item1" }, { name: "q2_item2" }] }
      ]
    });
    const questions = survey.getAllQuestions(false, false, true);
    expect(questions.length, "3 questions").toLooseEqual(4);
    expect(questions[0].name, "#1").toLooseEqual("q1");
    expect(questions[1].name, "#2").toLooseEqual("q2");
    expect(questions[2].name, "#3").toLooseEqual("q2_item1");
    expect(questions[3].name, "#4").toLooseEqual("q2_item2");
  });
  test("survey.applyTheme", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        { type: "multipletext", name: "q2", items: [{ name: "q2_item1" }, { name: "q2_item2" }] }
      ]
    });

    expect(Object.keys(survey.themeVariables).length, "before applyTheme").toLooseEqual(0);
    expect(!!survey.backgroundImage, "before applyTheme").toLooseEqual(false);
    expect(survey.backgroundImageFit, "before applyTheme").toLooseEqual("cover");
    expect(survey.backgroundImageAttachment, "before applyTheme").toLooseEqual("scroll");
    expect(survey.backgroundOpacity, "before applyTheme").toLooseEqual(1);
    expect(survey["isCompact"], "before applyTheme").toLooseEqual(false);
    expect(survey.headerView, "before applyTheme").toLooseEqual("basic");

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

    expect(Object.keys(survey.themeVariables).length).toLooseEqual(5);
    expect(!!survey.backgroundImage).toLooseEqual(true);
    expect(survey.backgroundImageFit).toLooseEqual("cover");
    expect(survey.backgroundImageAttachment).toLooseEqual("fixed");
    expect(survey.backgroundOpacity).toLooseEqual(0.6);
    expect(survey["isCompact"]).toLooseEqual(true);
    expect(survey.headerView, "after applyTheme").toLooseEqual("basic");
  });
  test("survey.applyTheme respects headerView", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        { type: "multipletext", name: "q2", items: [{ name: "q2_item1" }, { name: "q2_item2" }] }
      ]
    });

    expect(survey.headerView, "before applyTheme").toLooseEqual("basic");

    survey.applyTheme({
      "headerView": "advanced"
    });
    expect(survey.headerView, "apply advanced header").toLooseEqual("advanced");

    survey.applyTheme({
      "headerView": "basic"
    });
    expect(survey.headerView, "apply basic header").toLooseEqual("basic");

    survey.applyTheme({});
    expect(survey.headerView, "apply empty theme").toLooseEqual("basic");

    survey.applyTheme({ header: {} });
    expect(survey.headerView, "apply theme with header").toLooseEqual("advanced");
  });
  test("page/panel delete do it recursively", () => {
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
    expect(p2.isDisposed, "p2.isDisposed").toLooseEqual(true);
    expect(q2.isDisposed, "q2.isDisposed").toLooseEqual(true);
    survey.currentPage.delete();
    expect(p1.isDisposed, "p1.isDisposed").toLooseEqual(true);
    expect(q1.isDisposed, "q1.isDisposed").toLooseEqual(true);
  });
  test("SurveyModel: Check that popups inside survey are closed when scrolling container", (assert): any => {
    const model = new SurveyModel({ elements: [{ type: "dropdown", name: "q1", choices: ["Item1", "Item2", "Item3"] }] });
    const question = <QuestionDropdownModel>model.getAllQuestions()[0];
    question.dropdownListModel.popupModel.toggleVisibility();
    expect(model["onScrollCallback"]).toBeTruthy();
    expect(question.dropdownListModel.popupModel.isVisible).toBeTruthy();
    model.onScroll();
    expect(question.dropdownListModel.popupModel.isVisible).toBeFalsy();
    expect(model["onScrollCallback"]).toBeFalsy();
    model.onScroll();
  });
  test("Do not create dropdownListModel for disposed questions", (assert): any => {
    const survey = new SurveyModel({ elements: [
      { type: "dropdown", name: "q1", choices: ["Item1", "Item2", "Item3"] },
      { type: "rating", name: "q2", renderAs: "dropdown" },
      { type: "tagbox", name: "q3", choices: ["Item1", "Item2", "Item3"] },
      { type: "buttongroup", name: "q4", choices: ["Item1", "Item2", "Item3"] },
    ] });

    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    const q3 = survey.getQuestionByName("q3");
    const q4 = survey.getQuestionByName("q4");
    survey.dispose();
    expect(q1.dropdownListModel, "dropdownListModel dropdown q1").toBeFalsy();
    expect(q2.dropdownListModel, "dropdownListModel rating q2").toBeFalsy();
    expect(q3.dropdownListModel, "dropdownListModel tagbox q3").toBeFalsy();
    expect(q4.getType(), "buttongroup q4").toLooseEqual("buttongroup");
    expect(q4.dropdownListModel, "dropdownListModel buttongroup q4").toBeFalsy();
  });
  test("Copy panel with invisible questions at design-time", (assert): any => {
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
    expect(q1.visible, "q1.visible = false").toLooseEqual(false);
    expect(q1.isVisible, "q1.isVisible = true").toLooseEqual(true);
    expect(q1.getPropertyValue("isVisible"), "q1.isVisible via getPropertyValue").toLooseEqual(true);
    expect(q3.visible, "q3.visible = false").toLooseEqual(false);
    expect(q3.isVisible, "q3.isVisible = true").toLooseEqual(true);
    expect(q3.getPropertyValue("isVisible"), "q3.isVisible via getPropertyValue").toLooseEqual(true);
  });
  test("Use variables as default values in expression", () => {
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
    expect(q1.value, "Get data from survey").toLooseEqual(2);
  });
  test("Test displayValue() function", () => {
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
    expect(panel.panels[0].questions[0].isReady, "Check box is ready").toLooseEqual(true);
    const matrix = survey.getQuestionByName("q3");
    matrix.addRow();
    const row = matrix.visibleRows[0];
    row.showDetailPanel();
    row.getQuestionByName("col1").value = [1, 3];
    row.getQuestionByName("q3_q1").value = [1, 2, 3];
    expect(survey.data, "displayValue works correctly").toEqualValues({
      q1: [1, 2], q1_exp: "Item 1, Item 2",
      q2: [{ q2_q1: [2, 3], q2_q1_exp: "Item 2, Item 3" }],
      q3: [{ col1: [1, 3], col1_exp: "Item 1, Item 3", q3_q1: [1, 2, 3], q3_q1_exp: "Item 1, Item 2, Item 3" }]
    });
  });
  test("Test displayValue() function with value parameter", () => {
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
    expect(rows[0].cells[1].value, "cells[0,1].value").toLooseEqual("Item check 2");
    expect(rows[0].cells[2].value, "cells[0,2].value").toLooseEqual("Item 2");
    expect(rows[1].cells[1].value, "cells[1,1].value").toLooseEqual("Item check 3");
    expect(rows[1].cells[2].value, "cells[1,2].value").toLooseEqual("Item 3");
    expect(rows[2].cells[1].value, "cells[2,1].value").toLooseEqual("Item check 1");
    expect(rows[2].cells[2].value, "cells[2,2].value").toLooseEqual("Item 1");
  });
  test("Test displayValue() function with value parameter & 0 value, Bug#8603", () => {
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
    expect(rows[0].cells[1].value, "cells[0,1].value").toLooseEqual("Item check 0");
    expect(rows[1].cells[1].value, "cells[1,1].value").toLooseEqual("Item check 1");
    expect(rows[2].cells[1].value, "cells[2,1].value").toLooseEqual("Item check 2");
  });
  test("Test displayValue() function with 'non-ready' question , Bug#8763", () => {
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
    expect(q2.value, "#1").toLooseEqual("abc");
    isQ1Ready = true;
    q1["updateIsReady"]();
    expect(q2.value, "#1").toLooseEqual("Item check 1");
  });
  test("Test displayValue() function in survey.runExpression, Bug#8858", () => {
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
    expect(survey.runExpression("displayValue('q1')"), "#1").toLooseEqual("Item 2");
    let funcRes = undefined;
    survey.setValue("q1", 1);
    survey.runExpression("displayValue('q1')", (res: any): void => funcRes = res);
    expect(funcRes, "#2").toLooseEqual("Item 1");
  });
  test("Test propertyValue() function", () => {
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
    expect(survey.data, "propertyValue works correctly").toEqualValues({
      q1_exp: "Q1",
      q2: [{ q2_q1_exp: "Q2_Q1" }],
      q3: [{ col1_exp: "Column 1" }]
    });
  });
  test("Error on pre-processing localizable string Bug#6967", () => {
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
    expect(survey.locCompleteText.renderedHtml, "Preprocess correctly").toLooseEqual("2");
    surveyLocalization.locales.en.completeText = prevVal;
  });
  test("clearInvisibleValues onHiddenContainer breaks defaultValueExpression for text input #7010", () => {
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
    expect(q2.isEmpty(), "initial value on loading and clear on becoming invisible").toLooseEqual(true);
    q1.value = "A";
    expect(q2.value, "q1.value = A").toLooseEqual(42);
    q1.value = "B";
    expect(q2.value, "q1.value = B").toLooseEqual(24);
  });

  test("survey.toJSON() doesn't work correctly if questionsOnPageMode=singlePage is used #7359, #1", () => {
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

    expect(surveyJson.pages[0].elements.length, "surveyJson elements count").toLooseEqual(3);
    expect(prepareJSON.pages[0].elements.length, "prepareJSON elements count").toLooseEqual(3);

    expect(surveyJson).toEqualValues(prepareJSON);
  });
  test("survey.toJSON() doesn't work correctly if questionsOnPageMode=questionPerPage is used #7359, #2", () => {
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

    expect(surveyJson.pages.length, "surveyJson pages count").toLooseEqual(1);
    expect(prepareJSON.pages.length, "prepareJSON pages count").toLooseEqual(1);
    expect(surveyJson.pages[0].elements.length, "surveyJson elements count").toLooseEqual(3);
    expect(prepareJSON.pages[0].elements.length, "prepareJSON elements count").toLooseEqual(3);

    expect(surveyJson).toEqualValues(prepareJSON);
  });
  test("questionsOnPageMode=questionPerPage & skip doesn't work correctly, Bug #9276", () => {
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
    expect(survey.currentSingleQuestion.name, "#1").toLooseEqual("q1");
    survey.currentSingleQuestion.value = "a";
    expect(survey.currentSingleQuestion.name, "#2").toLooseEqual("q4");
  });
  test("questionsOnPageMode=questionPerPage & skip doesn't work correctly, Bug #9826", () => {
    const surveyJson = {
      "questionsOnPageMode": "questionPerPage",
      "elements": [
        { "type": "text", "name": "q1" },
        { "type": "text", "name": "q2" },
        { "type": "text", "name": "q3" },
        { "type": "text", "name": "q4" }
      ],
      "triggers": [
        {
          "type": "skip",
          "expression": "{q1} = 'a'",
          "gotoName": "q4"
        }]
    };

    const survey = new SurveyModel(surveyJson);
    expect(survey.currentSingleQuestion.name, "#1").toLooseEqual("q1");
    survey.currentSingleQuestion.value = "a";
    expect(survey.currentSingleQuestion.name, "#2").toLooseEqual("q4");
  });
  test("questionsOnPageMode=questionPerPage & skip doesn't work correctly if executeSkipOnValueChanged = false, Bug #9903", () => {
    settings.triggers.executeSkipOnValueChanged = false;
    const surveyJson = {
      "questionsOnPageMode": "questionPerPage",
      "elements": [
        { "type": "text", "name": "q1" },
        { "type": "text", "name": "q2" },
        { "type": "text", "name": "q3" },
        { "type": "text", "name": "q4" }
      ],
      "triggers": [
        {
          "type": "skip",
          "expression": "{q1} = 'a'",
          "gotoName": "q4"
        }]
    };

    const survey = new SurveyModel(surveyJson);
    expect(survey.currentSingleQuestion.name, "#1").toLooseEqual("q1");
    survey.currentSingleQuestion.value = "a";
    expect(survey.currentSingleQuestion.name, "#2").toLooseEqual("q1");
    survey.performNext();
    expect(survey.currentSingleQuestion.name, "#3").toLooseEqual("q4");
    settings.triggers.executeSkipOnValueChanged = true;
  });
  test("defaultValue & visibleIf issues if questionsOnPageMode=questionPerPage is used #7932", () => {
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
    expect(survey.data, "survey.data").toEqualValues({ q1_1: "A", q2_1: "A" });
    survey.setValue("q3", "B");
    const q1_1 = survey.getQuestionByName("q1_1");
    const q2_1 = survey.getQuestionByName("q2_1");
    const q1_2 = survey.getQuestionByName("q1_2");
    const q2_2 = survey.getQuestionByName("q2_2");

    expect(q1_1.value, "q1_1.value").toLooseEqual("A");
    expect(q2_1.value, "q2_1.value").toLooseEqual("A");
    expect(q1_2.visible, "q1_2.visible").toLooseEqual(true);
    expect(q2_2.visible, "q2_2.visible").toLooseEqual(true);
  });

  test("autoAdvanceEnabled & questionsOnPageMode=questionPerPage is used #9315", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "dropdown", name: "q1", choices: ["A", "B"] },
        { type: "dropdown", name: "q2", choices: ["A", "B"] },
        { type: "dropdown", name: "q3", choices: ["A", "B"] }
      ],
      questionsOnPageMode: "questionPerPage",
      autoAdvanceEnabled: true,
    });
    expect(survey.currentSingleQuestion.name, "survey.currentSingleQuestion.name #1").toLooseEqual("q1");
    survey.setValue("q1", "A");
    expect(survey.currentSingleQuestion.name, "survey.currentSingleQuestion.name #2").toLooseEqual("q2");
    survey.setValue("q2", "A");
    expect(survey.currentSingleQuestion.name, "survey.currentSingleQuestion.name #3").toLooseEqual("q3");
    survey.setValue("q3", "A");
    expect(survey.state, "survey.state #4").toLooseEqual("completed");
  });

  test("Bug on loading json with collapsed panel. It was fixed in v1.9.117, #7355", () => {
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
    expect(question.name, "Loaded correctly").toLooseEqual("q1");
    expect(panel.isCollapsed, "panel is collapsed").toLooseEqual(true);
    panel.expand();
    expect(panel.isCollapsed, "panel is not collapsed").toLooseEqual(false);
  });
  test("Expression bug with complex path, #7396", () => {
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
    expect(q3.isVisible, "visible #1").toLooseEqual(false);
    q1.value = { "1": 1, "2": 2 };
    expect(q3.isVisible, "visible #2").toLooseEqual(false);
    q2.value = { "16": 2 };
    expect(q3.isVisible, "visible #3").toLooseEqual(true);
  });
  test("Do not run defaultValueExpression on survey.data, #7423", () => {
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
    expect(q1.value, "q1.value #1").toLooseEqual("value1");
    expect(q2.value, "q2.value #1").toLooseEqual("value2");
    expect(q3.value, "q3.value #1").toEqualValues(["item1", "item3"]);
    expect(q4.value, "q4.value #1").toLooseEqual("item2");
    survey.data = { q1: "val1" };
    expect(q1.value, "q1.value #2").toLooseEqual("val1");
    expect(q2.value, "q2.value #2").toBeFalsy();
    expect(q3.value, "q3.value #2").toEqualValues([]);
    expect(q4.value, "q4.value #2").toBeFalsy();
    q2.value = "val2";
    expect(q1.value, "q1.value #3").toLooseEqual("val1");
    expect(q2.value, "q2.value #3").toLooseEqual("val2");
    expect(q3.value, "q3.value #3").toEqualValues([]);
    expect(q4.value, "q4.value #3").toBeFalsy();
  });
  test("theme assignment affects headerView", () => {
    let survey = new SurveyModel({});
    expect(survey.headerView, "default value").toLooseEqual("basic");
    survey.applyTheme({ header: {} } as any);
    expect(survey.headerView, "changed to advanced").toLooseEqual("advanced");
  });
  test("defaultValueExpression expression stops working after survey.clear(), #7448", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2", defaultValueExpression: "{q1}" }
      ]
    });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    q1.value = 1;
    expect(q2.value, "defaultValueExpression is working").toLooseEqual(1);
    survey.clear();
    q1.value = 2;
    expect(q2.value, "defaultValueExpression is still working").toLooseEqual(2);
    q2.value = 3;
    expect(q2.value, "set value directly").toLooseEqual(3);
    survey.clear();
    q1.value = 4;
    expect(q2.value, "defaultValueExpression is working after set value directly & clear").toLooseEqual(4);
  });
  test("emptySurveyText, make it writable, #7456", () => {
    const survey = new SurveyModel();
    const defaultText = "The survey doesn't contain any visible elements.";
    expect(survey.emptySurveyText, "#1").toLooseEqual(defaultText);
    survey.emptySurveyText = "Empty";
    expect(survey.emptySurveyText, "#2").toLooseEqual("Empty");
    survey.resetPropertyValue("emptySurveyText");
    expect(survey.emptySurveyText, "#3").toLooseEqual(defaultText);
  });

  test("getContainerContent - progress + advanced header (legacyProgressBarView)", () => {
    const json = {
      title: "My Survey",
      showNavigationButtons: false,
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

      expect(survey.showNavigationButtons).toLooseEqual(false);
      expect(survey.progressBarType).toLooseEqual("pages");
      expect(survey.showProgressBar).toLooseEqual(false);

      expect(getContainerContent("header"), "default header").toEqualValues([{
        "component": "sv-header",
        "container": "header",
        "id": "advanced-header",
        "index": -100
      }]);
      expect(getContainerContent("center"), "default center").toEqualValues([]);
      expect(getContainerContent("footer"), "default footer").toEqualValues([]);
      expect(getContainerContent("contentTop"), "default contentTop").toEqualValues([]);
      expect(getContainerContent("contentBottom"), "default contentBottom").toEqualValues([]);
      expect(getContainerContent("left"), "default left").toEqualValues([]);
      expect(getContainerContent("right"), "default right").toEqualValues([]);

      survey.showProgressBar = "top";
      expect(getContainerContent("header"), "progress top header alone").toEqualValues([{
        "component": "sv-header",
        "container": "header",
        "id": "advanced-header",
        "index": -100
      }]);
      expect(getContainerContent("center"), "progress top center alone").toEqualValues([{
        "component": "sv-progress-pages",
        "id": "progress-pages"
      }]);
      expect(getContainerContent("footer"), "progress top footer alone").toEqualValues([]);
      expect(getContainerContent("contentTop"), "progress top contentTop alone").toEqualValues([]);
      expect(getContainerContent("contentBottom"), "progress top contentBottom alone").toEqualValues([]);
      expect(getContainerContent("left"), "progress top left alone").toEqualValues([]);
      expect(getContainerContent("right"), "progress top right alone").toEqualValues([]);

      survey.applyTheme({
        header: {},
        cssVariables: {
          "--sjs-header-backcolor": "transparent"
        }
      } as any);
      expect(getContainerContent("header"), "progress top header").toEqualValues([{
        "component": "sv-progress-pages",
        "id": "progress-pages",
        "index": -150
      }, {
        "component": "sv-header",
        "container": "header",
        "id": "advanced-header",
        "index": -100
      }]);
      expect(getContainerContent("center"), "progress top center").toEqualValues([]);
      expect(getContainerContent("footer"), "progress top footer").toEqualValues([]);
      expect(getContainerContent("contentTop"), "progress top contentTop").toEqualValues([]);
      expect(getContainerContent("contentBottom"), "progress top contentBottom").toEqualValues([]);
      expect(getContainerContent("left"), "progress top left").toEqualValues([]);
      expect(getContainerContent("right"), "progress top right").toEqualValues([]);

      survey.showProgressBar = "belowHeader";
      expect(getContainerContent("header"), "progress top header").toEqualValues([{
        "component": "sv-header",
        "container": "header",
        "id": "advanced-header",
        "index": -100
      }]);
      expect(getContainerContent("center"), "progress top center").toEqualValues([{
        "component": "sv-progress-pages",
        "id": "progress-pages",
      }]);
      expect(getContainerContent("footer"), "progress top footer").toEqualValues([]);
      expect(getContainerContent("contentTop"), "progress top contentTop").toEqualValues([]);
      expect(getContainerContent("contentBottom"), "progress top contentBottom").toEqualValues([]);
      expect(getContainerContent("left"), "progress top left").toEqualValues([]);
      expect(getContainerContent("right"), "progress top right").toEqualValues([]);
    } finally {
      settings.legacyProgressBarView = false;
    }
  });

  test("getContainerContent - progress + advanced header", () => {
    surveyCss.currentType = "default";
    const json = {
      title: "My Survey",
      showNavigationButtons: false,
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

    expect(survey.showNavigationButtons).toLooseEqual(false);
    expect(survey.progressBarType).toLooseEqual("pages");
    expect(survey.showProgressBar).toLooseEqual(false);

    expect(getContainerContent("header"), "default header").toEqualValues([{
      "component": "sv-header",
      "container": "header",
      "id": "advanced-header",
      "index": -100
    }]);
    expect(getContainerContent("center"), "default center").toEqualValues([]);
    expect(getContainerContent("footer"), "default footer").toEqualValues([]);
    expect(getContainerContent("contentTop"), "default contentTop").toEqualValues([]);
    expect(getContainerContent("contentBottom"), "default contentBottom").toEqualValues([]);
    expect(getContainerContent("left"), "default left").toEqualValues([]);
    expect(getContainerContent("right"), "default right").toEqualValues([]);

    survey.showProgressBar = "top";
    expect(getContainerContent("header"), "progress top header alone").toEqualValues([{
      "component": "sv-header",
      "container": "header",
      "id": "advanced-header",
      "index": -100
    }]);
    expect(getContainerContent("center"), "progress top center alone").toEqualValues([{
      "component": "sv-progress-buttons",
      "id": "progress-buttons"
    }]);
    expect(getContainerContent("footer"), "progress top footer alone").toEqualValues([]);
    expect(getContainerContent("contentTop"), "progress top contentTop alone").toEqualValues([]);
    expect(getContainerContent("contentBottom"), "progress top contentBottom alone").toEqualValues([]);
    expect(getContainerContent("left"), "progress top left alone").toEqualValues([]);
    expect(getContainerContent("right"), "progress top right alone").toEqualValues([]);

    survey.applyTheme({
      header: {},
      cssVariables: {
        "--sjs-header-backcolor": "transparent"
      }
    } as any);
    expect(getContainerContent("header"), "progress top header").toEqualValues([{
      "component": "sv-progress-buttons",
      "id": "progress-buttons",
      "index": -150
    }, {
      "component": "sv-header",
      "container": "header",
      "id": "advanced-header",
      "index": -100
    }]);
    expect(getContainerContent("center"), "progress top center").toEqualValues([]);
    expect(getContainerContent("footer"), "progress top footer").toEqualValues([]);
    expect(getContainerContent("contentTop"), "progress top contentTop").toEqualValues([]);
    expect(getContainerContent("contentBottom"), "progress top contentBottom").toEqualValues([]);
    expect(getContainerContent("left"), "progress top left").toEqualValues([]);
    expect(getContainerContent("right"), "progress top right").toEqualValues([]);
  });

  test("getContainerContent - do not show timer panel in display mode", () => {
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
      "timeLimit": 10,
      "showTimer": true,
      "timerInfoMode": "survey"
    };
    let survey = new SurveyModel(json);
    survey.headerView = "basic";
    const getContainerContent = getContainerContentFunction(survey);

    expect(getContainerContent("header"), "default header").toEqualValues([{
      "component": "sv-timerpanel",
      "id": "timerpanel",
      "template": "survey-timerpanel"
    }]);
    expect(getContainerContent("center"), "default center").toEqualValues([]);
    expect(getContainerContent("footer"), "default footer").toEqualValues([]);
    expect(getContainerContent("contentTop"), "default contentTop").toEqualValues([]);
    expect(getContainerContent("contentBottom"), "default contentBottom").toEqualValues([{
      "component": "sv-action-bar",
      "id": "buttons-navigation"
    }]);
    expect(getContainerContent("left"), "default left").toEqualValues([]);
    expect(getContainerContent("right"), "default right").toEqualValues([]);

    survey.readOnly = true;
    expect(getContainerContent("header"), "default header").toEqualValues([]);
    expect(getContainerContent("center"), "default center").toEqualValues([]);
    expect(getContainerContent("footer"), "default footer").toEqualValues([]);
    expect(getContainerContent("contentTop"), "default contentTop").toEqualValues([]);
    expect(getContainerContent("contentBottom"), "default contentBottom").toEqualValues([{
      "component": "sv-action-bar",
      "id": "buttons-navigation"
    }]);
    expect(getContainerContent("left"), "default left").toEqualValues([]);
    expect(getContainerContent("right"), "default right").toEqualValues([]);
  });

  test("Check triggerReponsiveness is called when isCompact changed", () => {
    const json = {
      title: "My Survey",
      showNavigationButtons: false,
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
    expect(log).toLooseEqual("->q1:true->q2:true");
    log = "";
    survey["isCompact"] = false;
    expect(log).toLooseEqual("->q1:true->q2:true");
  });
  test("element.wasREndered", () => {
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
    expect(survey.pages[0].wasRendered, "page1 wasRendered").toLooseEqual(true);
    expect(survey.getQuestionByName("q1").wasRendered, "q1 wasRendered").toLooseEqual(true);
    const q3 = survey.pages[0].addNewQuestion("text", "q3");
    expect(q3.wasRendered, "q3 wasRendered").toLooseEqual(true);
    const panel1 = survey.pages[0].addNewPanel("panel1");
    expect(panel1.wasRendered, "panel1 wasRendered").toLooseEqual(true);
    const q4 = panel1.addNewQuestion("text", "q4");
    expect(q4.wasRendered, "q4 wasRendered").toLooseEqual(true);

    expect(survey.pages[1].wasRendered, "page2 wasRendered, #1").toLooseEqual(false);
    expect(survey.getQuestionByName("q2").wasRendered, "q2 wasRendered, #1").toLooseEqual(false);
    const q5 = survey.pages[1].addNewQuestion("text", "q5");
    expect(q5.wasRendered, "q5 wasRendered, #1").toLooseEqual(false);
    const panel2 = survey.pages[1].addNewPanel("panel1");
    expect(panel2.wasRendered, "panel2 wasRendered, #1").toLooseEqual(false);
    const q6 = panel2.addNewQuestion("text", "q6");
    expect(q6.wasRendered, "q6 wasRendered, #1").toLooseEqual(false);

    survey.nextPage();
    expect(survey.pages[1].wasRendered, "page2 wasRendered, #2").toLooseEqual(true);
    expect(survey.getQuestionByName("q2").wasRendered, "q2 wasRendered, #2").toLooseEqual(true);
    expect(q5.wasRendered, "q5 wasRendered, #2").toLooseEqual(true);
    expect(panel2.wasRendered, "panel2 wasRendered, #2").toLooseEqual(true);
    expect(q6.wasRendered, "q6 wasRendered, #2").toLooseEqual(true);
  });

  test("getContainerContent - progress settings", () => {
    surveyCss.currentType = "default";
    const json = {
      showNavigationButtons: false,
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

    expect(settings.legacyProgressBarView, "show buttons progress for pages by default").toLooseEqual(false);
    expect(survey.showProgressBar, "default show progress bar").toLooseEqual(false);
    expect(survey.progressBarType, "default progress bar type").toLooseEqual("pages");
    expect(survey.progressBarShowPageNumbers, "don't show page numbers in progress by default").toLooseEqual(false);
    expect(survey.progressBarShowPageTitles, "don't show page titles in progress by default").toLooseEqual(false);

    expect(getContainerContent("header"), "empty header").toEqualValues([]);
    expect(getContainerContent("footer"), "empty footer").toEqualValues([]);
    expect(getContainerContent("contentTop"), "empty contentTop").toEqualValues([]);
    expect(getContainerContent("contentBottom"), "empty contentBottom").toEqualValues([]);
    expect(getContainerContent("left"), "empty left").toEqualValues([]);
    expect(getContainerContent("right"), "empty right").toEqualValues([]);
    expect(getContainerContent("center"), "empty center").toEqualValues([]);

    survey.showProgressBar = "auto";
    expect(getContainerContent("header"), "auto pages header").toEqualValues([]);
    expect(getContainerContent("footer"), "auto pages footer").toEqualValues([]);
    expect(getContainerContent("contentTop"), "auto pages contentTop").toEqualValues([]);
    expect(getContainerContent("contentBottom"), "auto pages contentBottom").toEqualValues([]);
    expect(getContainerContent("left"), "auto pages left").toEqualValues([]);
    expect(getContainerContent("right"), "auto pages right").toEqualValues([]);
    expect(getContainerContent("center"), "auto pages center").toEqualValues([{
      "component": "sv-progress-buttons",
      "id": "progress-buttons"
    }]);

    survey.progressBarType = "buttons";

    expect(survey.progressBarShowPageTitles, "show page titles in progress for buttons").toLooseEqual(true);

    expect(getContainerContent("header"), "auto buttons header").toEqualValues([]);
    expect(getContainerContent("footer"), "auto buttons footer").toEqualValues([]);
    expect(getContainerContent("contentTop"), "auto buttons contentTop").toEqualValues([]);
    expect(getContainerContent("contentBottom"), "auto buttons contentBottom").toEqualValues([]);
    expect(getContainerContent("left"), "auto buttons left").toEqualValues([]);
    expect(getContainerContent("right"), "auto buttons right").toEqualValues([]);
    expect(getContainerContent("center"), "auto buttons center").toEqualValues([{
      "component": "sv-progress-buttons",
      "id": "progress-buttons"
    }]);

    survey.progressBarType = "pages";

    survey.showProgressBar = "aboveHeader";
    expect(getContainerContent("header"), "aboveHeader pages header").toEqualValues([{
      "component": "sv-progress-buttons",
      "id": "progress-buttons",
      "index": -150
    }]);
    expect(getContainerContent("footer"), "aboveHeader pages footer").toEqualValues([]);
    expect(getContainerContent("contentTop"), "aboveHeader pages contentTop").toEqualValues([]);
    expect(getContainerContent("contentBottom"), "aboveHeader pages contentBottom").toEqualValues([]);
    expect(getContainerContent("left"), "aboveHeader pages left").toEqualValues([]);
    expect(getContainerContent("right"), "aboveHeader pages right").toEqualValues([]);
    expect(getContainerContent("center"), "aboveHeader pages center").toEqualValues([]);

    survey.showProgressBar = "belowHeader";
    expect(getContainerContent("header"), "belowHeader pages header").toEqualValues([]);
    expect(getContainerContent("footer"), "belowHeader pages footer").toEqualValues([]);
    expect(getContainerContent("contentTop"), "belowHeader pages contentTop").toEqualValues([]);
    expect(getContainerContent("contentBottom"), "belowHeader pages contentBottom").toEqualValues([]);
    expect(getContainerContent("left"), "belowHeader pages left").toEqualValues([]);
    expect(getContainerContent("right"), "belowHeader pages right").toEqualValues([]);
    expect(getContainerContent("center"), "belowHeader pages center").toEqualValues([{
      "component": "sv-progress-buttons",
      "id": "progress-buttons"
    }]);

    survey.showProgressBar = "topBottom";
    expect(getContainerContent("header"), "topBottom pages header").toEqualValues([]);
    expect(getContainerContent("footer"), "topBottom pages footer").toEqualValues([{
      "component": "sv-progress-buttons",
      "id": "progress-buttons"
    }]);
    expect(getContainerContent("contentTop"), "topBottom pages contentTop").toEqualValues([]);
    expect(getContainerContent("contentBottom"), "topBottom pages contentBottom").toEqualValues([]);
    expect(getContainerContent("left"), "topBottom pages left").toEqualValues([]);
    expect(getContainerContent("right"), "topBottom pages right").toEqualValues([]);
    expect(getContainerContent("center"), "topBottom pages center").toEqualValues([{
      "component": "sv-progress-buttons",
      "id": "progress-buttons"
    }]);
  });

  test("getContainerContent - show advanced header on start page", () => {
    surveyCss.currentType = "default";
    const json = {
      showNavigationButtons: false,
      "firstPageIsStartPage": true,
      headerView: "advanced",
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
    survey.applyTheme({ cssVariables: { "--sjs-header-backcolor": "red" } });
    const getContainerContent = getContainerContentFunction(survey);

    expect(getContainerContent("header"), "advanced header").toEqualValues([{
      "component": "sv-header",
      "container": "header",
      "id": "advanced-header",
      "index": -100
    }]);
    expect(getContainerContent("footer"), "advanced footer").toEqualValues([]);
    expect(getContainerContent("contentTop"), "advanced contentTop").toEqualValues([]);
    expect(getContainerContent("contentBottom"), "advanced contentBottom").toEqualValues([]);
    expect(getContainerContent("left"), "advanced left").toEqualValues([]);
    expect(getContainerContent("right"), "advanced right").toEqualValues([]);
    expect(getContainerContent("center"), "advanced center").toEqualValues([]);

    survey.headerView = "basic";
    expect(getContainerContent("header"), "empty header").toEqualValues([]);
    expect(getContainerContent("footer"), "empty footer").toEqualValues([]);
    expect(getContainerContent("contentTop"), "empty contentTop").toEqualValues([]);
    expect(getContainerContent("contentBottom"), "empty contentBottom").toEqualValues([]);
    expect(getContainerContent("left"), "empty left").toEqualValues([]);
    expect(getContainerContent("right"), "empty right").toEqualValues([]);
    expect(getContainerContent("center"), "empty center").toEqualValues([]);
  });

  test("survey.runExpressions(), #7694", () => {
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
    expect(q1.value, "q1.value #1").toLooseEqual(undefined);
    expect(q2.isVisible, "q2.isVisible #1").toLooseEqual(false);

    FunctionFactory.Instance.register("func1", func1);
    survey.runExpressions();
    expect(q1.value, "q1.value #2").toLooseEqual(1);
    expect(q2.isVisible, "q2.isVisible #2").toLooseEqual(true);

    FunctionFactory.Instance.unregister("func1");
  });
  test("survey.locale, default locale is not en and design-time, #7765", () => {
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
    expect(q1.hasDescription, "Description loaded correctly").toLooseEqual(true);
    surveyLocalization.defaultLocale = defautlLocale;
  });
  test("onOpenFileChooser fires", () => {
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
    expect(log).toLooseEqual("");
    survey.chooseFiles(document.createElement("input"), () => { }, { element: { a: 1 }, propertyName: "a" } as any);
    expect(log).toLooseEqual("->onOpenFileChooser");
    expect(lastContext).toEqualValues({ element: { a: 1 }, propertyName: "a" });
    expect(lastContextElement).toEqualValues({ a: 1 });
    expect(lastContextPropertyName).toLooseEqual("a");
  });
  test("Advanced header title/description color", () => {
    const survey = new SurveyModel();

    const accHeaderBackTheme: any = { "cssVariables": {}, "header": {}, "headerView": "advanced" };
    survey.applyTheme(accHeaderBackTheme);
    let headerLayoutElement = survey.findLayoutElement("advanced-header");
    let headerModel = headerLayoutElement.data as Cover;
    expect(headerModel.headerClasses).toLooseEqual("sv-header sv-header--height-auto sv-header__without-background sv-header__background-color--none");

    headerModel.height = 256;
    expect(headerModel.headerClasses).toLooseEqual("sv-header sv-header__without-background sv-header__background-color--none");
    // expect(survey.themeVariables["--sjs-font-headertitle-color"]).toLooseEqual(undefined);
    // expect(survey.themeVariables["--sjs-font-headertitle-color"]).toLooseEqual(undefined);
    // expect(survey.themeVariables["--sjs-font-headerdescription-color"]).toLooseEqual(undefined);
    // expect(accHeaderBackTheme.cssVariables["--sjs-font-headertitle-color"]).toLooseEqual(undefined);
    // expect(accHeaderBackTheme.cssVariables["--sjs-font-headerdescription-color"]).toLooseEqual(undefined);

    const noneHeaderBackTheme: any = { "cssVariables": { "--sjs-header-backcolor": "transparent" }, "header": {}, "headerView": "advanced" };
    survey.applyTheme(noneHeaderBackTheme);
    headerLayoutElement = survey.findLayoutElement("advanced-header");
    headerModel = headerLayoutElement.data as Cover;
    expect(headerModel.headerClasses).toLooseEqual("sv-header sv-header--height-auto sv-header__without-background sv-header__background-color--none");

    const customNotSetHeaderBackTheme: any = { "cssVariables": { "--sjs-header-backcolor": "transparent" }, "header": {}, "headerView": "advanced" };
    survey.applyTheme(customNotSetHeaderBackTheme);
    headerLayoutElement = survey.findLayoutElement("advanced-header");
    headerModel = headerLayoutElement.data as Cover;
    expect(headerModel.headerClasses).toLooseEqual("sv-header sv-header--height-auto sv-header__without-background sv-header__background-color--none");

    const customHeaderBackTheme: any = { "cssVariables": { "--sjs-header-backcolor": "rgba(0, 255, 0, 1)" }, "header": {}, "headerView": "advanced" };
    survey.applyTheme(customHeaderBackTheme);
    headerLayoutElement = survey.findLayoutElement("advanced-header");
    headerModel = headerLayoutElement.data as Cover;
    expect(headerModel.headerClasses).toLooseEqual("sv-header sv-header--height-auto sv-header__background-color--custom");

    const customNotSetHeaderBackAndTitleTheme: any = { "cssVariables": { "--sjs-font-headertitle-color": "rgba(255, 0, 0, 1)", "--sjs-font-headerdescription-color": "rgba(255, 0, 0, 1)", "--sjs-header-backcolor": "transparent" }, "header": {}, "headerView": "advanced" };
    survey.applyTheme(customNotSetHeaderBackAndTitleTheme);
    headerLayoutElement = survey.findLayoutElement("advanced-header");
    headerModel = headerLayoutElement.data as Cover;
    expect(headerModel.headerClasses).toLooseEqual("sv-header sv-header--height-auto sv-header__without-background");

    const customHeaderBackAndTitleTheme: any = { "cssVariables": { "--sjs-font-headertitle-color": "rgba(255, 0, 0, 1)", "--sjs-font-headerdescription-color": "rgba(255, 0, 0, 1)", "--sjs-header-backcolor": "rgba(0, 255, 0, 1)" }, "header": {}, "headerView": "advanced" };
    survey.applyTheme(customHeaderBackAndTitleTheme);
    headerLayoutElement = survey.findLayoutElement("advanced-header");
    headerModel = headerLayoutElement.data as Cover;
    expect(headerModel.headerClasses).toLooseEqual("sv-header sv-header--height-auto");
  });
  test("Display mode in design time", () => {
    const survey = new SurveyModel();
    settings.animationEnabled = true;
    expect(survey.css.rootReadOnly).toLooseEqual("sd-root--readonly");
    expect(survey.mode).toLooseEqual("edit");
    expect(survey.isDisplayMode).toLooseEqual(false);
    expect(survey.getRootCss()).toLooseEqual("sd-root-modern sd-progress--pages sd-root-modern--full-container");

    survey.readOnly = true;
    expect(survey.mode).toLooseEqual("display");
    expect(survey.isDisplayMode).toLooseEqual(true);
    expect(survey.getRootCss().indexOf(survey.css.rootReadOnly) !== -1).toBeTruthy();

    survey.setDesignMode(true);
    expect(survey.mode).toLooseEqual("display");
    expect(survey.isDisplayMode).toLooseEqual(false);
    expect(survey.getRootCss()).toLooseEqual("sd-root-modern sd-progress--pages sd-root-modern--full-container");
    settings.animationEnabled = false;
  });

  test("PageModel passed property", () => {
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
    expect(survey.pages[0].passed, "1) Page 1 isn't passed").toLooseEqual(false);
    expect(survey.pages[1].passed, "1) Page 2 isn't passed").toLooseEqual(false);
    expect(survey.pages[2].passed, "1) Page 3 isn't passed").toLooseEqual(false);

    survey.nextPage();
    expect(survey.pages[0].passed, "2) Page 1 is passed").toLooseEqual(true);
    expect(survey.pages[1].passed, "2) Page 2 isn't passed").toLooseEqual(false);
    expect(survey.pages[2].passed, "2) Page 3 isn't passed").toLooseEqual(false);

    survey.nextPage();
    expect(survey.pages[0].passed, "3) Page 1 is passed").toLooseEqual(true);
    expect(survey.pages[1].passed, "3) Page 2 is passed").toLooseEqual(true);
    expect(survey.pages[2].passed, "3) Page 3 isn't passed").toLooseEqual(false);

    survey.prevPage();
    expect(survey.pages[0].passed, "4) Page 1 is passed").toLooseEqual(true);
    expect(survey.pages[1].passed, "4) Page 2 is passed").toLooseEqual(true);
    expect(survey.pages[2].passed, "4) Page 3 is passed").toLooseEqual(true);

    survey.nextPage();
    survey.tryComplete();
    expect(survey.pages[0].passed, "5) Page 1 is passed").toLooseEqual(true);
    expect(survey.pages[1].passed, "5) Page 2 is passed").toLooseEqual(true);
    expect(survey.pages[2].passed, "5) Page 3 is passed").toLooseEqual(true);
  });

  test("page passed", () => {
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
    expect(survey.pages[0].passed, "First page passed").toBeTruthy();
    expect(survey.pages[1].passed, "Second page not passed").toBeFalsy();
    survey.prevPage();
    expect(survey.pages[0].passed, "First page passed").toBeTruthy();
    expect(survey.pages[1].passed, "Second page not passed").toBeFalsy();
    survey.nextPage();
    expect(survey.pages[0].passed, "First page passed").toBeTruthy();
    expect(survey.pages[1].passed, "Second page not passed").toBeFalsy();
    survey.getQuestionByName("q2").value = "entered text";
    survey.prevPage();
    expect(survey.pages[0].passed, "First page passed").toBeTruthy();
    expect(survey.pages[1].passed, "Second page passed").toBeTruthy();
  });
  test("showPreview & updateProgress & updateVisibleIndexes", () => {
    const survey = new SurveyModel({
      showProgressBar: true,
      progressBarLocation: "top",
      progressBarType: "pages",
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
    survey.onGetProgressText.add((sender, options) => {
      progressCounter++;
    });
    survey.onQuestionVisibleChanged.add((sender, options) => {
      visibleChangedCounter++;
    });
    survey.showPreview();
    expect(survey.progressText, "progressText").toLooseEqual("Page 1 of 1");
    expect(progressCounter, "progressCounter").toLooseEqual(1);
    expect(visibleChangedCounter, "visibleChangedCounter").toLooseEqual(0);
  });

  test("showPreview & dynamic panel? single page", () => {
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
      "showPreviewBeforeComplete": true
    });
    survey.showPreview();
    expect((survey.getQuestionByName("question1") as QuestionPanelDynamicModel).panels[0].showPanelAsPage).toBeFalsy();
  });

  test("check panel's visibleRows are updated sync when running condidtions after loading from json", () => {
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
    expect(panel.visibleRows.length).toLooseEqual(1);
    expect(panel.visibleRows[0].visibleElements[0].name).toLooseEqual("nps-score");
    settings.animationEnabled = false;
  });

  test("getContainerContent - do not show buttons progress in the single page mode", () => {
    const json = {
      showNavigationButtons: false,
      showProgressBar: true,
      progressBarLocation: "auto",
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

    expect(survey.progressBarType).toLooseEqual("pages");
    expect(survey.questionsOnPageMode).toLooseEqual("standard");
    expect(survey.showProgressBar).toLooseEqual(true);
    expect(survey.progressBarLocation).toLooseEqual("auto");
    expect(getContainerContent("header"), "").toEqualValues([]);
    expect(getContainerContent("center"), "Progress is shown").toEqualValues([{
      "component": "sv-progress-buttons",
      "id": "progress-buttons"
    }]);
    expect(getContainerContent("footer"), "").toEqualValues([]);
    expect(getContainerContent("contentTop"), "").toEqualValues([]);
    expect(getContainerContent("contentBottom"), "").toEqualValues([]);
    expect(getContainerContent("left"), "").toEqualValues([]);
    expect(getContainerContent("right"), "").toEqualValues([]);

    survey.questionsOnPageMode = "singlePage";

    expect(getContainerContent("header"), "").toEqualValues([]);
    expect(getContainerContent("center"), "Buttons progress is not shown in the single page mode").toEqualValues([]);
    expect(getContainerContent("footer"), "").toEqualValues([]);
    expect(getContainerContent("contentTop"), "").toEqualValues([]);
    expect(getContainerContent("contentBottom"), "").toEqualValues([]);
    expect(getContainerContent("left"), "").toEqualValues([]);
    expect(getContainerContent("right"), "").toEqualValues([]);

    survey.progressBarType = "questions";

    expect(getContainerContent("header"), "").toEqualValues([]);
    expect(getContainerContent("center"), "Buttons progress is shown in the single page mode for questions mode").toEqualValues([{
      "component": "sv-progress-questions",
      "id": "progress-questions"
    }]);
    expect(getContainerContent("footer"), "").toEqualValues([]);
    expect(getContainerContent("contentTop"), "").toEqualValues([]);
    expect(getContainerContent("contentBottom"), "").toEqualValues([]);
    expect(getContainerContent("left"), "").toEqualValues([]);
    expect(getContainerContent("right"), "").toEqualValues([]);

    survey.showProgressBar = "bottom";

    expect(getContainerContent("header"), "").toEqualValues([]);
    expect(getContainerContent("center"), "").toEqualValues([]);
    expect(getContainerContent("footer"), "Buttons progress is shown in the single page mode for questions mode in bottom").toEqualValues([{
      "component": "sv-progress-questions",
      "id": "progress-questions"
    }]);
    expect(getContainerContent("contentTop"), "").toEqualValues([]);
    expect(getContainerContent("contentBottom"), "").toEqualValues([]);
    expect(getContainerContent("left"), "").toEqualValues([]);
    expect(getContainerContent("right"), "").toEqualValues([]);
  });

  test("getContainerContent - show advanced header in content top container if no header background", () => {
    const json = {
      "title": "Survey",
      "pages": [
        { name: "page1", elements: [{ name: "q1", type: "html" }] },
        { name: "page2", elements: [{ name: "q2", type: "text" }] },
      ],
      "showTOC": true,
      "headerView": "advanced",
    };

    let survey = new SurveyModel(json);
    const getContainerContent = getContainerContentFunction(survey);

    expect(survey.progressBarType).toLooseEqual("pages");
    expect(survey.questionsOnPageMode).toLooseEqual("standard");
    expect(survey.showProgressBar).toLooseEqual(false);
    expect(survey.progressBarLocation).toLooseEqual("auto");
    expect(getContainerContent("header"), "header").toEqualValues([]);
    expect(getContainerContent("center"), "center").toEqualValues([]);
    expect(getContainerContent("footer"), "footer").toEqualValues([]);
    expect(getContainerContent("contentTop"), "header in center top").toEqualValues([{
      "component": "sv-header",
      "container": "header",
      "id": "advanced-header",
      "index": -100
    }]);
    expect(getContainerContent("contentBottom"), "center bottom").toEqualValues([{
      "component": "sv-action-bar",
      "id": "buttons-navigation"
    }]);
    expect(getContainerContent("left"), "left").toEqualValues([{
      "component": "sv-navigation-toc",
      "id": "toc-navigation"
    }]);
    expect(getContainerContent("right"), "right").toEqualValues([]);
  });

  test("getContainerContent - show advanced header in header container if header background is set", () => {
    const json = {
      "title": "Survey",
      "pages": [
        { name: "page1", elements: [{ name: "q1", type: "html" }] },
        { name: "page2", elements: [{ name: "q2", type: "text" }] },
      ],
      "showTOC": true,
      "headerView": "advanced",
    };

    let survey = new SurveyModel(json);
    survey.applyTheme({ cssVariables: { "--sjs-header-backcolor": "red" } });
    const getContainerContent = getContainerContentFunction(survey);

    expect(survey.progressBarType).toLooseEqual("pages");
    expect(survey.questionsOnPageMode).toLooseEqual("standard");
    expect(survey.showProgressBar).toLooseEqual(false);
    expect(survey.progressBarLocation).toLooseEqual("auto");
    expect(getContainerContent("header"), "header in header").toEqualValues([{
      "component": "sv-header",
      "container": "header",
      "id": "advanced-header",
      "index": -100
    }]);
    expect(getContainerContent("center"), "Progress is shown").toEqualValues([]);
    expect(getContainerContent("footer"), "footer").toEqualValues([]);
    expect(getContainerContent("contentTop"), "center top").toEqualValues([]);
    expect(getContainerContent("contentBottom"), "center bottom").toEqualValues([{
      "component": "sv-action-bar",
      "id": "buttons-navigation"
    }]);
    expect(getContainerContent("left"), "left").toEqualValues([{
      "component": "sv-navigation-toc",
      "id": "toc-navigation"
    }]);
    expect(getContainerContent("right"), "right").toEqualValues([]);
  });

  test("Display mode in design time 2", () => {
    const survey = new SurveyModel();
    expect(survey.wrapperFormCss).toLooseEqual("sd-root-modern__wrapper");

    survey.backgroundImage = "abc";
    expect(survey.wrapperFormCss).toLooseEqual("sd-root-modern__wrapper sd-root-modern__wrapper--has-image");

    survey.backgroundImageAttachment = "fixed";
    expect(survey.wrapperFormCss).toLooseEqual("sd-root-modern__wrapper sd-root-modern__wrapper--has-image sd-root-modern__wrapper--fixed");
  });
  test("Delete panel with questions", () => {
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
    expect(survey.getPanelByName("panel1"), "#1").toBeTruthy();
    expect(survey.getQuestionByName("question1"), "#2").toBeTruthy();
    expect(survey.getQuestionByName("question2"), "#3").toBeTruthy();
    survey.getQuestionByName("question2").delete();
    expect(survey.getQuestionByName("question2"), "#4").toBeFalsy();
    survey.getPanelByName("panel1").delete();
    expect(survey.getPanelByName("panel1"), "#5").toBeFalsy();
    expect(survey.getQuestionByName("question1"), "#6").toBeFalsy();
  });
  test("_isElementShouldBeSticky", () => {
    const survey = new SurveyModel({});
    const topStickyContainer: any = {
      getBoundingClientRect: () => ({ y: 64 })
    };
    const rootElement: any = {
      getBoundingClientRect: () => ({ y: 64 }),
      querySelector: () => topStickyContainer,
      scrollTop: 0
    };
    survey.scrollerElement = rootElement;

    expect(survey._isElementShouldBeSticky(".test"), "no scrolling").toBeFalsy();

    rootElement.scrollTop = 50;
    expect(survey._isElementShouldBeSticky(".test"), "content is scrolled").toBeTruthy();

    expect(survey._isElementShouldBeSticky(""), "empty selector - always false (with scroll)").toBeFalsy();

    rootElement.scrollTop = 0;
    expect(survey._isElementShouldBeSticky(""), "empty selector - always false (no scroll)").toBeFalsy();
  });
  test("survey navigateToUrl encode url", () => {
    var survey = new SurveyModel({
      elements: [
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
    expect(location.href, "encoded URL").toLooseEqual("javascript%3Aalert(2)");
  });
  test("Question is not in the hash with it is on the first page & questionsOnPageMode is 'questionPerPage', Bug#8583", () => {
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
    expect(q.name, "q1 name is here").toLooseEqual("q1");
  });
  test("questionsOnPageMode: `questionPerPage` & complete trigger & required questions on the same page, Bug#9289", () => {
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
    expect(btnComplete.visible, "Complete button is visible, #1").toLooseEqual(false);
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion").toLooseEqual("q1");
    survey.currentSingleQuestion.value = "a";
    expect(btnComplete.visible, "Complete button is visible, #2").toLooseEqual(true);
    expect(survey.state, "Survey is running").toLooseEqual("running");
    btnComplete.action();
    expect(survey.state, "Survey is completed").toLooseEqual("completed");
  });
  test("questionsOnPageMode: `questionPerPage` & custom complete trigger , #9376", () => {
    class ScreenoutTrigger extends SurveyTriggerComplete {
      getType() { return "screenouttrigger"; }

      onSuccess(properties: any) {
        if (this.isRealExecution()) {
          this.owner.setTriggerValue("result", "screenout", false);
        }
        // Parent call
        super.onSuccess(properties);
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
    expect(btnComplete.visible, "Complete button is visible, #1").toLooseEqual(false);
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion").toLooseEqual("q1");
    survey.currentSingleQuestion.value = "a";
    expect(btnComplete.visible, "Complete button is visible, #2").toLooseEqual(true);
    expect(survey.state, "Survey is running").toLooseEqual("running");
    btnComplete.action();
    expect(survey.state, "Survey is completed").toLooseEqual("completed");

    Serializer.removeClass("screenouttrigger");
  });
  test("questionsOnPageMode: `questionPerPage` & custom complete trigger , #9483", () => {
    class ScreenoutTrigger extends SurveyTriggerComplete {
      getType() { return "screenouttrigger"; }

      onSuccess(properties: any) {
        if (this.isRealExecution()) {
          this.owner.setCompleted(this);
        }
        // Parent call
        super.onSuccess(properties);
      }
    }
    Serializer.addClass("screenouttrigger", [], () => { return new ScreenoutTrigger(); }, "completetrigger");
    settings.triggers.changeNavigationButtonsOnComplete = false;
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
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion").toLooseEqual("q1");
    survey.currentSingleQuestion.value = "a";
    survey.performNext();
    expect(survey.state, "Survey is completed").toLooseEqual("completed");

    settings.triggers.changeNavigationButtonsOnComplete = true;
    Serializer.removeClass("screenouttrigger");
  });
  test("questionsOnPageMode & question.isVisible", () => {
    const json = {
      elements: [
        { type: "radiogroup", "name": "q1", choices: [1, 2, 3] },
        { type: "radiogroup", "name": "q2", choices: [1, 3, 5], hideIfChoicesEmpty: true, choicesVisibleIf: "{q1} contains {item}" },
      ],
      questionsOnPageMode: "questionPerPage",
    };
    const survey = new SurveyModel(json);
    const question = survey.currentSingleQuestion;
    const q2 = survey.getQuestionByName("q2");
    expect(question.name, "currentSingleQuestion").toLooseEqual("q1");
    expect(q2.isVisible, "q2.isVisible, #1").toLooseEqual(false);
    expect(survey.isShowNextButton, "Next button is hidden, #1").toLooseEqual(false);
    expect(survey.isCompleteButtonVisible, "Complete button is shown, #1").toLooseEqual(true);
    question.value = 1;
    expect(q2.isVisible, "q2.isVisible, #2").toLooseEqual(true);
    expect(survey.isShowNextButton, "Next button is shown, #2").toLooseEqual(true);
    expect(survey.isCompleteButtonVisible, "Complete button is hidden, #2").toLooseEqual(false);
    question.value = 2;
    expect(q2.isVisible, "q2.isVisible, #3").toLooseEqual(false);
    expect(survey.isShowNextButton, "Next button is hidden, #3").toLooseEqual(false);
    expect(survey.isCompleteButtonVisible, "Complete button is shown, #3").toLooseEqual(true);
  });
  test("Do not use questionsOnPageMode in design-mode, Bug#9274", () => {
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
    expect(survey.questionsOnPageMode, "the property set correctly").toLooseEqual("questionPerPage");
    expect(survey.currentSingleQuestion?.name, "It is the design mode").toLooseEqual(undefined);
  });
  test("questionsOnPageMode - panel should be displayed as a question", () => {
    const json = {
      "elements": [
        { type: "panel", name: "panel1", elements: [{ "type": "text", "name": "q1" }, { "type": "text", "name": "q2" }] },
        { "type": "text", "name": "q3" },
        { type: "panel", name: "panel2", elements: [{ "type": "text", "name": "q4" }, { "type": "text", "name": "q5" }] }
      ],
      "questionsOnPageMode": "questionPerPage",
    };
    const survey = new SurveyModel(json);
    expect(survey.currentSingleElement.name, "currentSingleQuestion #1").toLooseEqual("panel1");
    survey.performNext();
    expect(survey.currentSingleElement.name, "currentSingleQuestion #2").toLooseEqual("q3");
    survey.performNext();
    expect(survey.currentSingleElement.name, "currentSingleQuestion #3").toLooseEqual("panel2");
    survey.performPrevious();
    expect(survey.currentSingleElement.name, "currentSingleQuestion #4").toLooseEqual("q3");
    survey.performPrevious();
    expect(survey.currentSingleElement.name, "currentSingleQuestion #5").toLooseEqual("panel1");
  });
  test("question.canHaveFrameStyles should return true for questionsOnPageMode", () => {
    const json = {
      "elements": [{ type: "panel", name: "panel1", elements: [{ "type": "text", "name": "q1" }] }],
      "questionsOnPageMode": "questionPerPage",
    };
    const survey = new SurveyModel(json);
    const question = survey.getQuestionByName("q1");
    expect(survey.currentSingleElement.name, "currentSingleQuestion").toLooseEqual("panel1");
    expect(survey.currentSingleElement["canHaveFrameStyles"](), "canHaveFrameStyles - panel").toLooseEqual(true);
    expect(question["canHaveFrameStyles"](), "canHaveFrameStyles - question").toLooseEqual(false);
  });
  test("question.canHaveFrameStyles should return false for questionsOnPageMode for question in dynamic panel, Bug#9572", () => {
    const json = {
      elements: [{ type: "paneldynamic", name: "panel1", panelCount: 1, templateElements: [{ "type": "text", "name": "q1" }] }],
      questionsOnPageMode: "questionPerPage",
    };
    const survey = new SurveyModel(json);
    const question = survey.currentSingleQuestion;
    expect(question.name, "currentSingleQuestion").toLooseEqual("panel1");
    expect(question["canHaveFrameStyles"](), "canHaveFrameStyles").toLooseEqual(true);
    const q1 = question.panels[0].getQuestionByName("q1");
    expect(q1["canHaveFrameStyles"](), "canHaveFrameStyles").toLooseEqual(false);
  });
  test("questionsOnPageMode & validationEnabled , Bug#9558", () => {
    const json = {
      elements: [
        { type: "text", name: "q1", isRequired: true },
        { type: "text", name: "q2", isRequired: true }
      ],
      questionsOnPageMode: "questionPerPage"
    };
    const survey = new SurveyModel(json);
    survey.validationEnabled = false;
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion #1").toLooseEqual("q1");
    expect(survey.performNext(), "Can go futher").toLooseEqual(true);
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion #2").toLooseEqual("q2");
    expect(survey.tryComplete(), "Survey is completed").toLooseEqual(true);
  });
  test("questionsOnPageMode & visibility questions, Bug#9641", () => {
    const json = {
      elements: [
        { type: "text", name: "q1", visibleIf: "false" },
        { type: "text", name: "q2" },
        { type: "text", name: "q3" },
      ],
      questionsOnPageMode: "questionPerPage"
    };
    const survey = new SurveyModel(json);
    expect(survey.currentSingleQuestion.name, "the first question is invisible").toLooseEqual("q2");
    survey.getQuestionByName("q2").visible = false;
    expect(survey.currentSingleQuestion.name, "the second question is invisible").toLooseEqual("q3");
  });
  test("questionsOnPageMode & visibility panels, Bug#9641", () => {
    const json = {
      elements: [
        { type: "panel", name: "p1", elements: [{ type: "text", name: "q1", visibleIf: "false" }] },
        { type: "panel", name: "p2", elements: [{ type: "text", name: "q2" }] },
        { type: "panel", name: "p3", elements: [{ type: "text", name: "q3" }] },
        { type: "text", name: "q4" },
      ],
      questionsOnPageMode: "questionPerPage"
    };
    const survey = new SurveyModel(json);
    expect(survey.currentSingleElement.name, "the first panel is invisible").toLooseEqual("p2");
    survey.getPanelByName("p2").visible = false;
    expect(survey.currentSingleElement.name, "the second panel is invisible").toLooseEqual("p3");
    survey.getQuestionByName("q3").visible = false;
    expect(survey.currentSingleElement.name, "the third panel is invisible").toLooseEqual("q4");
  });
  test("questionsOnPageMode & visibility pages, Bug#9641", () => {
    const json = {
      pages: [
        { name: "page1", visibleIf: "false", elements: [{ type: "text", name: "q1" }] },
        { name: "page2", elements: [{ type: "text", name: "q2" }] },
        { name: "page3", elements: [{ type: "text", name: "q3" }] }
      ],
      questionsOnPageMode: "questionPerPage"
    };
    const survey = new SurveyModel(json);
    expect(survey.currentSingleElement.name, "the second question is viaible").toLooseEqual("q2");
    expect(survey.currentPage.name, "the second page is visible").toLooseEqual("page2");
  });
  test("survey.currentSingleQuestion & Page events, Bug#9381", () => {
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
    expect(survey.currentSingleQuestion?.name, "currentSingleQuestion #1").toLooseEqual("q1");
    survey.performNext();
    expect(survey.currentSingleQuestion?.name, "currentSingleQuestion #2").toLooseEqual("q2");
    survey.performNext();
    expect(survey.currentSingleQuestion?.name, "currentSingleQuestion #3").toLooseEqual("q3");
    survey.performNext();
    expect(survey.currentSingleQuestion?.name, "currentSingleQuestion #4").toLooseEqual("q4");
    survey.performPrevious();
    expect(survey.currentSingleQuestion?.name, "currentSingleQuestion #5").toLooseEqual("q3");
    survey.performPrevious();
    expect(survey.currentSingleQuestion?.name, "currentSingleQuestion #6").toLooseEqual("q2");
    survey.performPrevious();
    expect(survey.currentSingleQuestion?.name, "currentSingleQuestion #7").toLooseEqual("q1");
    const result = [{ newPage: "page1", oldPage: "page1", newQuestion: "q2", oldQuestion: "q1", forward: true, backward: false },
      { newPage: "page2", oldPage: "page1", newQuestion: "q3", oldQuestion: "q2", forward: true, backward: false },
      { newPage: "page2", oldPage: "page2", newQuestion: "q4", oldQuestion: "q3", forward: true, backward: false },
      { newPage: "page2", oldPage: "page2", newQuestion: "q3", oldQuestion: "q4", forward: false, backward: true },
      { newPage: "page1", oldPage: "page2", newQuestion: "q2", oldQuestion: "q3", forward: false, backward: true },
      { newPage: "page1", oldPage: "page1", newQuestion: "q1", oldQuestion: "q2", forward: false, backward: true },
    ];
    expect(onPageChanging, "onChanged #1").toEqualValues(result);
    expect(onPageChanged, "onChanging #1").toEqualValues(result);
    onPageChanging.splice(0, onPageChanging.length);
    onPageChanged.splice(0, onPageChanged.length);
    doAllow = false;
    survey.performNext();
    expect(survey.currentSingleQuestion?.name, "currentSingleQuestion #8").toLooseEqual("q1");
    expect(onPageChanged, "onChanged #2").toEqualValues([]);
    expect(onPageChanging, "onChanging #2").toEqualValues([{ newPage: "page1", oldPage: "page1", newQuestion: "q2", oldQuestion: "q1", forward: true, backward: false }]);
  });

  test("Question is not in the hash with it is on the first page & questionsOnPageMode is 'singlePage', Bug#8583", () => {
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
    expect(q.name, "q1 name is here").toLooseEqual("q1");
  });
  test("Check showPageTitles & questionsOnPageMode is 'singlePage' on switching locales, Bug#9048", () => {
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
    expect(panels.length, "There are two panels").toLooseEqual(2);
    expect((<PanelModel>panels[0]).hasTitle, "panels[0], locale en").toLooseEqual(false);
    expect((<PanelModel>panels[1]).hasTitle, "panels[1], locale en").toLooseEqual(false);
    survey.locale = "de";
    expect((<PanelModel>panels[0]).hasTitle, "panels[0], locale de").toLooseEqual(false);
    expect((<PanelModel>panels[1]).hasTitle, "panels[1], locale de").toLooseEqual(false);
    survey.locale = "";
    expect((<PanelModel>panels[0]).hasTitle, "panels[0], locale ''").toLooseEqual(false);
    expect((<PanelModel>panels[1]).hasTitle, "panels[1], locale ''").toLooseEqual(false);
  });
  test("Check questionsOnPageMode is 'singlePage' on switching locales, Bug#9048", () => {
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
    expect(panels.length, "There are two panels").toLooseEqual(2);
    expect((<PanelModel>panels[0]).hasTitle, "panels[0], locale en").toLooseEqual(true);
    expect((<PanelModel>panels[1]).hasTitle, "panels[1], locale en").toLooseEqual(true);
    survey.locale = "de";
    expect((<PanelModel>panels[0]).hasTitle, "panels[0], locale de").toLooseEqual(true);
    expect((<PanelModel>panels[1]).hasTitle, "panels[1], locale de").toLooseEqual(true);
    survey.locale = "";
    expect((<PanelModel>panels[0]).hasTitle, "panels[0], locale ''").toLooseEqual(true);
    expect((<PanelModel>panels[1]).hasTitle, "panels[1], locale ''").toLooseEqual(true);
  });
  test("Check questionsOnPageMode is 'singlePage' & buttons visibility", () => {
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
    expect(survey.isShowNextButton, "Next button is hidden").toLooseEqual(false);
    expect(survey.isShowPrevButton, "Prev button is hidden").toLooseEqual(false);
    expect(survey.isCompleteButtonVisible, "Complete button is visible").toLooseEqual(true);
  });

  test("Check questionsOnPageMode is 'singlePage' & showPreview", () => {
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
      "showPreviewBeforeComplete": true
    });
    expect(survey.visiblePageCount, "There is one visible page, #1").toLooseEqual(1);
    expect(survey.visiblePages[0].name, "The name is single-page, #1").toLooseEqual("single-page");
    survey.showPreview();
    expect(survey.visiblePageCount, "There is one visible page").toLooseEqual(1);
    expect(survey.visiblePages[0].name, "The name is preview-page").toLooseEqual("preview-page");
    expect(survey.visiblePages[0].elements.length, "It has only one element").toLooseEqual(1);
    let singlePage = <PageModel>survey.visiblePages[0].elements[0];
    const singlePageId = singlePage.id;
    expect(singlePage.getType(), "It is a page").toLooseEqual("page");
    expect(singlePage.name, "It is a single page in the preview, page name").toLooseEqual("single-page");
    expect(singlePage.isPage, "Single page in not a page in the preview").toLooseEqual(false);
    expect(singlePage.isPanel, "Single page in not a panel in the preview").toLooseEqual(true);
    expect(singlePage.elements.length, "Two pages in the single page").toLooseEqual(2);
    expect(singlePage.elements[0].getType(), "Panel is page").toLooseEqual("page");
    expect(singlePage.hasEditButton, "Single page has the cancel preview button").toLooseEqual(true);
    expect(singlePage.getFooterToolbar().getActionById("cancel-preview"), "single page has Cancel preview button").toBeTruthy();
    expect((<PageModel>singlePage.elements[0]).getFooterToolbar().actions.length, "original pages don't have Cancel preview button").toLooseEqual(0);
    expect((<PageModel>singlePage.elements[0]).hasEditButton, "original page doesn't have the cancel preview button").toLooseEqual(false);

    singlePage.cancelPreview();
    expect(survey.visiblePageCount, "There is one visible page, #2").toLooseEqual(1);
    expect(survey.visiblePages[0].name, "The name is single-page, #2").toLooseEqual("single-page");
    expect(survey.visiblePages[0].id, "We do not re-create the single-page, #2").toLooseEqual(singlePageId);
  });
  test("The Start Page & changing the question visibility, Bug#9520", () => {
    const survey = new SurveyModel({
      pages: [
        { elements: [{ type: "text", name: "q1" }] },
        { name: "p1", visibleIf: "{q1}='a'", elements: [{ type: "text", name: "q2" }] },
        { name: "p2", elements: [{ type: "text", name: "q1" }] }
      ],
      firstPageIsStartPage: true,
    });
    expect(survey.visiblePages.length, "visiblePages #1").toLooseEqual(1);
    survey.setValue("q1", "a");
    survey.start();
    expect(survey.currentPage.name, "p1 is the current page").toLooseEqual("p1");
  });
  test("The Start Page has -1 index when enabling auto-numeration for survey pages, Bug#8983", () => {
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
    expect(survey.pages[0].no, "start page should be empty, #1").toLooseEqual("");
    expect(survey.pages[1].no, "pages[1], #1").toLooseEqual("1. ");
    survey.firstPageIsStartPage = false;
    expect(survey.pages[0].no, "pages[0], #2").toLooseEqual("1. ");
    expect(survey.pages[1].no, "pages[1], #2").toLooseEqual("2. ");
  });
  test("Trim key in setting the data, Bug#8586", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1\n" },
        { type: "text", name: "\nq2 " },
        { type: "text", name: " q3\n\n" },
        { type: "text", name: "\nq4\n" }
      ]
    });
    survey.data = { "q1\n": "a", "\nq2 ": "b", " q3\n\n": "c", q4: "d" };
    expect(survey.getQuestionByName("q1").value, "q1.value").toLooseEqual("a");
    expect(survey.getQuestionByName("q2").value, "q2.value").toLooseEqual("b");
    expect(survey.getQuestionByName("q3").value, "q3.value").toLooseEqual("c");
    expect(survey.getQuestionByName("q4").value, "q3.value").toLooseEqual("d");
  });

  test("Check that focusInput works correctly with shadow dom", () => {
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
    // jsdom does not perform layout, so `offsetParent` is always null and
    // SurveyElement.focusElementCore() bails out before calling focus().
    Object.defineProperty(input, "offsetParent", { configurable: true, get: () => survey.rootElement });
    survey.rootElement.appendChild(input);
    root.shadowRoot?.appendChild(survey.rootElement);
    document.body.appendChild(root);
    document.body.focus();
    expect(document.activeElement).toLooseEqual(document.body);
    question.focusInputElement(false);
    expect(document.activeElement).toLooseEqual(root);
    expect(root.shadowRoot?.activeElement).toLooseEqual(input);
    root.remove();
  });
  test("Check page is cleared only after unmount", () => {
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
    expect(!!page1.survey).toBeTruthy();
    page1.disableOnElementRerenderedEvent();
    expect(!!page1.survey).toBeFalsy();

    const page2 = survey.getPageByName("p2");
    page2.supportOnElementRerenderedEvent = true;
    page2.enableOnElementRerenderedEvent();
    survey.removePage(page2);
    survey.addPage(page2);
    expect(!!page2.survey).toBeTruthy();
    page2.disableOnElementRerenderedEvent();
    expect(!!page2.survey).toBeTruthy();

    const page3 = survey.getPageByName("p3");
    page3.supportOnElementRerenderedEvent = true;
    survey.removePage(page3);
    expect(!!page3.survey).toBeFalsy();
  });
  test("Reduce the number of calls of setVisibleIndexes function", () => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    let counter = 0;
    survey.onGetProgressText.add((sender, options) => {
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
    expect(survey.progressText, "progressText").toLooseEqual("Page 1 of 2");
    expect(counter, "On loading").toLooseEqual(1);
    survey.pages[1].onFirstRendering();
    expect(counter, "page[1].onFirstRendering(), do nothing").toLooseEqual(1);
  });
  test("Do not include questions.values into survey.getFilteredValue in design time", () => {
    const survey = new SurveyModel({
      elements: [{ type: "text", name: "q1", defaultValue: 1 }],
      calculatedValues: [{ name: "val1", expression: "2" }]
    });
    expect(survey.getFilteredValues(), "survey in running state").toEqualValues({ q1: 1, val1: 2 });
    survey.setDesignMode(true);
    expect(survey.getFilteredValues(), "survey at design time").toEqualValues({ val1: 2 });
  });
  test("onValueChanged event & isExpressionRunning parameter", () => {
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
    expect(survey.data, "survey.data #1").toEqualValues({ q1: 1, q2: 2, q3: 3 });
    expect(logs, "logs #1").toEqualValues([
      { name: "q3", val: 3, reason: "expression" },
      { name: "q4", val: undefined, reason: "expression" },
      { name: "q2", val: 2, reason: "expression" },
      { name: "q1", val: 1, reason: undefined }]);

    logs.splice(0, logs.length);
    survey.getQuestionByName("q4").value = 2;
    expect(survey.data, "survey.data #2").toEqualValues({ q1: 1, q2: 2, q3: 3, q4: 2, q5: 5 });
    expect(logs, "logs #2").toEqualValues([
      { name: "q5", val: 5, reason: "trigger" },
      { name: "q4", val: 2, reason: undefined }]);

    logs.splice(0, logs.length);
    survey.getQuestionByName("q4").value = 3;
    expect(survey.data, "survey.data #3").toEqualValues({ q1: 1, q2: 2, q3: 3, q4: 3, q5: 8 });
    expect(logs, "logs #3").toEqualValues([
      { name: "q5", val: 8, reason: "trigger" },
      { name: "q4", val: 3, reason: undefined }]);
  });

  test("#9110 check focus question inside paneldynamic works correctly", () => {
    let log = "";
    const oldScrollElementToViewCore = SurveyElement.ScrollElementToViewCore;
    const oldScrollElementToTop = SurveyElement.ScrollElementToTop;
    SurveyElement.ScrollElementToViewCore = ((el, _, __, ___, doneCallback) => {
      log += `->${el.id}`;
      doneCallback();
    }) as any;
    SurveyElement.ScrollElementToTop = ((el, _, __, doneCallback) => {
      (SurveyElement as any).ScrollElementToViewCore(el, null, null, null, doneCallback);
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
    const textElement = document.createElement("div");
    textElement.id = "text_question_id";
    rootWrapper.id = "root-wrapper";
    rootWrapper.className = survey.css.rootWrapper;
    rootElement.appendChild(rootWrapper);
    rootWrapper.appendChild(textElement);
    survey.rootElement = rootElement;
    const quesiton = panelDynamic.panels[0].questions[0];
    survey.scrollElementToTop({ element: quesiton, question: quesiton, id: "text_question_id", scrollIfVisible: false, onScolledCallback: () => {
      log += "->focused text question";
    } });
    expect(log).toLooseEqual("->text_question_id->focused text question");
    SurveyElement.ScrollElementToViewCore = oldScrollElementToViewCore;
    SurveyElement.ScrollElementToTop = oldScrollElementToTop;
    rootElement.remove();
  });
  test("Show warning on loadig JSON created in higher version of Creator", () => {
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
      expect(!!reportText, "jsonVersion: " + jsonVer + ", sjsVer: " + sjsVer).toLooseEqual(showWarn);
    };
    checkFunc("1.12.19", "2.0.2", false);
    checkFunc("2.0.2", "1.12.19", true);
    checkFunc("2.0.2", "2.0.2", false);
    checkFunc("2.0.3", "2.0.2", true);
    ConsoleWarnings.warn = prevWarn;
    settings.version = oldVersion;
  });
  test("Advanced header from theme", () => {
    const survey = new SurveyModel();
    const advancedHeaderTheme: any = { "cssVariables": {}, "header": {}, "headerView": "advanced" };
    const basicHeaderTheme: any = { "cssVariables": {}, "header": {}, "headerView": "basic" };
    const advancedHeaderThemeWithoutHeaderView: any = { "cssVariables": {}, "header": {} };

    expect(survey.headerView, "By default headerView is basic").toLooseEqual("basic");
    expect(survey.findLayoutElement("advanced-header") == undefined, "By default header is absent").toBeTruthy();

    survey.applyTheme(advancedHeaderTheme);
    expect(survey.headerView, "After apply advanced headerView is advanced").toLooseEqual("advanced");
    expect(survey.findLayoutElement("advanced-header") != undefined, "After apply advanced header is present").toBeTruthy();

    survey.applyTheme(basicHeaderTheme);
    expect(survey.headerView, "After apply basic headerView is advanced").toLooseEqual("basic");
    expect(survey.findLayoutElement("advanced-header") == undefined, "After apply basic header is absent").toBeTruthy();

    survey.applyTheme(advancedHeaderThemeWithoutHeaderView);
    expect(survey.headerView, "After apply empty headerView is advanced").toLooseEqual("advanced");
    expect(survey.findLayoutElement("advanced-header") != undefined, "After apply empty headerView advanced header is present").toBeTruthy();
  });

  test("Change advanced header properties by theme", () => {
    const survey = new SurveyModel();
    const advancedHeaderThemeWithAccentBackgroundColor: any = { headerView: "advanced", "cssVariables": { "--sjs-header-backcolor": "var(--sjs-primary-backcolor)" } };
    const advancedHeaderThemeWithOverlapEnabled: any = { headerView: "advanced", "cssVariables": {}, "header": { overlapEnabled: true } };
    const advancedHeaderThemeWithoutOverlapEnabled: any = { headerView: "advanced", "cssVariables": {} };

    survey.applyTheme(advancedHeaderThemeWithAccentBackgroundColor);
    expect(survey.findLayoutElement("advanced-header").data.backgroundColor, "#1 backgroundColor accent").toLooseEqual("var(--sjs-primary-backcolor)");
    expect(survey.findLayoutElement("advanced-header").data.overlapEnabled === false, "#1 overlapEnabled false").toBeTruthy();

    survey.applyTheme(advancedHeaderThemeWithOverlapEnabled);
    expect(survey.findLayoutElement("advanced-header").data.backgroundColor, "#2 backgroundColor transparent").toLooseEqual("transparent");
    expect(survey.findLayoutElement("advanced-header").data.overlapEnabled === true, "#2 overlapEnabled true").toBeTruthy();

    survey.applyTheme(advancedHeaderThemeWithoutOverlapEnabled);
    expect(survey.findLayoutElement("advanced-header").data.backgroundColor, "#3 backgroundColor transparent").toLooseEqual("transparent");
    expect(survey.findLayoutElement("advanced-header").data.overlapEnabled === false, "#3 overlapEnabled false").toBeTruthy();
  });

  test("Don't rise onPageAdded when mooving question", () => {
    const survey = new SurveyModel({
      pages: [{ name: "page1" }, { name: "page2" }]
    });
    let pageAddedRaisedCount = 0;
    survey.onPageAdded.add((sender, options) => {
      pageAddedRaisedCount++;
    });
    expect(pageAddedRaisedCount, "onPageAdded is not raised").toLooseEqual(0);
    expect(survey.pages[0].name, "page1 is the first page").toLooseEqual("page1");
    survey.startMovingPage();
    const page = survey.pages[1];
    survey.pages.splice(1, 1);
    survey.pages.splice(0, 0, page);
    survey.stopMovingPage();
    expect(pageAddedRaisedCount, "onPageAdded is not raised").toLooseEqual(0);
    expect(survey.pages[0].name, "page2 is the first page").toLooseEqual("page2");
  });

  test("Update hasTitle on load from JSON", () => {
    const survey = new SurveyModel();
    expect(survey.hasTitle, "no title in empty survey").toLooseEqual(false);
    survey.fromJSON({
      title: "title",
      elements: [{ name: "q1", type: "text" }]
    });
    expect(survey.hasTitle, "title presents").toLooseEqual(true);
  });
  test("survey.onPartialSend for regular survey, Bug#9737", () => {
    const survey = new SurveyModel({
      pages: [
        { name: "page1", elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }] },
        { name: "page2", elements: [{ type: "text", name: "q3" }, { type: "text", name: "q4" }] }
      ]
    });
    survey.partialSendEnabled = true;
    let counter = 0;
    survey.onPartialSend.add((sender, options) => {
      counter++;
    });
    survey.setValue("q1", "val1");
    survey.nextPage();
    expect(counter, "onPartialSend is raised").toLooseEqual(1);
    survey.setValue("q3", "val3");
    survey.tryComplete();
    expect(counter, "onPartialSend is not raised").toLooseEqual(1);
  });
  test("survey.onPartialSend for regular survey, Bug#9737", () => {
    const survey = new SurveyModel({
      questionsOnPageMode: "questionPerPage",
      pages: [
        { name: "page1", elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }] },
        { name: "page2", elements: [{ type: "text", name: "q3" }, { type: "text", name: "q4" }] }
      ]
    });
    survey.partialSendEnabled = true;
    let counter = 0;
    survey.onPartialSend.add((sender, options) => {
      counter++;
    });
    survey.setValue("q1", "val1");
    survey.performNext();
    expect(counter, "onPartialSend is raised").toLooseEqual(1);
    survey.setValue("q2", "val2");
    survey.performNext();
    expect(counter, "onPartialSend is raised").toLooseEqual(2);
    survey.setValue("q3", "val3");
    survey.performNext();
    expect(counter, "onPartialSend is raised").toLooseEqual(3);
  });
  test("Move into another page by code in questionPerPage mode, Bug#9917", () => {
    const survey = new SurveyModel({
      questionsOnPageMode: "questionPerPage",
      pages: [
        { name: "p1", elements: [{ type: "text", name: "q1" }] },
        { name: "p2", elements: [{ type: "text", name: "q2" }] },
        { name: "p3", elements: [{ type: "text", name: "q3" }] }
      ]
    });
    expect(survey.currentPage.name, "current page #1").toLooseEqual("p1");
    expect(survey.currentSingleElement.name, "current question #1").toLooseEqual("q1");
    survey.nextPage();
    expect(survey.currentPage.name, "current page #2").toLooseEqual("p2");
    expect(survey.currentSingleElement.name, "current question #2").toLooseEqual("q2");
    survey.currentPageNo = 2;
    expect(survey.currentPage.name, "current page #3").toLooseEqual("p3");
    expect(survey.currentSingleElement.name, "current question #3").toLooseEqual("q3");
    survey.currentPageNo = 0;
    expect(survey.currentPage.name, "current page #4").toLooseEqual("p1");
    expect(survey.currentSingleElement.name, "current question #4").toLooseEqual("q1");
  });
  test("survey.currentElementName", () => {
    const survey = new SurveyModel({
      pages: [
        { name: "p1", elements: [{ type: "text", name: "q1_1" }, { type: "text", name: "q1_2" }] },
        { name: "p2", elements: [{ type: "text", name: "q2_1" }, { type: "text", name: "q2_2" }] },
        { name: "p3", elements: [{ type: "text", name: "q3_1" }, { type: "text", name: "q3_2" }] }
      ]
    });
    expect(survey.currentElementName, "current element name #1").toLooseEqual("p1");
    expect(survey.currentElement.name, "current element #1").toLooseEqual("p1");
    survey.currentElementName = "p3";
    expect(survey.currentElementName, "current element name #2").toLooseEqual("p3");
    expect(survey.currentElement.name, "current element #2").toLooseEqual("p3");
    survey.currentElementName = "q2_1";
    expect(survey.currentElementName, "current element name #3").toLooseEqual("p2");
    expect(survey.currentElement.name, "current element #3").toLooseEqual("p2");
    survey.currentElementName = "nothing";
    expect(survey.currentElementName, "current element name #3_2").toLooseEqual("p2");
    expect(survey.currentElement.name, "current element #3_2").toLooseEqual("p2");
    survey.questionsOnPageMode = "questionPerPage";
    expect(survey.currentElementName, "current element name #4").toLooseEqual("q1_1");
    expect(survey.currentElement.name, "current element #4").toLooseEqual("q1_1");
    survey.currentElementName = "q3_2";
    expect(survey.currentElementName, "current element name #5").toLooseEqual("q3_2");
    expect(survey.currentElement.name, "current element #5").toLooseEqual("q3_2");
    survey.currentElementName = "p1";
    expect(survey.currentElementName, "current element name #6").toLooseEqual("q1_1");
    expect(survey.currentElement.name, "current element #6").toLooseEqual("q1_1");
    survey.questionsOnPageMode = "inputPerPage";
    survey.currentElementName = "q2_1";
    expect(survey.currentElementName, "current element name #7").toLooseEqual("q2_1");
    expect(survey.currentElement.name, "current element #7").toLooseEqual("q2_1");
    survey.currentElementName = "p3";
    expect(survey.currentElementName, "current element name #8").toLooseEqual("q3_1");
    expect(survey.currentElement.name, "current element #8").toLooseEqual("q3_1");
    survey.currentElementName = "nothing";
    expect(survey.currentElementName, "current element name #9").toLooseEqual("q3_1");
    expect(survey.currentElement.name, "current element #9").toLooseEqual("q3_1");
  });
  test("questionPerPage & questionOrder = 'random', Bug#9817", () => {
    const oldFunc = Helpers.randomizeArray;
    Helpers.randomizeArray = HelpTest.randomizeArray;
    const survey = new SurveyModel({
      "pages": [
        {
          "elements": [
            {
              "type": "checkbox",
              "name": "V001",
              "choices": [1, 2, 3]
            }
          ]
        },
        {
          "questionOrder": "random",
          "elements": [
            {
              "type": "radiogroup",
              "name": "question1",
              "visibleIf": "{V001} contains 1",
              "choices": [1, 2]
            },
            {
              "type": "radiogroup",
              "name": "question2",
              "visibleIf": "{V001} contains 2",
              "choices": [1, 2]
            },
            {
              "type": "radiogroup",
              "name": "question3",
              "visibleIf": "{V001} contains 3",
              "choices": [1, 2]
            }
          ]
        }
      ],
      "questionsOnPageMode": "questionPerPage",
    });
    survey.setValue("V001", [2]);
    survey.performNext();
    const page = survey.currentPage;
    expect(page.name, "page2 is the current page").toLooseEqual("page2");
    expect(survey.currentSingleQuestion.name, "question2 is the current question").toLooseEqual("question2");
    expect(page.rows.length, "one row").toLooseEqual(1);
    expect(page.rows[0].elements.length, "one element in the row").toLooseEqual(1);
    expect(page.rows[0].elements[0].name, "question2 is the current question in the row").toLooseEqual("question2");
    Helpers.randomizeArray = oldFunc;
  });
  test("questionPerPage & focusing question inside the panel, Bug#10113", () => {
    const survey = new SurveyModel({
      "pages": [
        {
          "elements": [
            {
              "type": "radiogroup",
              "name": "question1",
              "choices": [1, 2]
            }
          ]
        },
        {
          "elements": [
            {
              "type": "radiogroup",
              "name": "question2",
              "choices": [1, 2]
            }
          ]
        },
        {
          "elements": [
            {
              "type": "panel",
              "name": "panel1",
              "elements": [
                {
                  "type": "html",
                  "name": "question3",
                  "html": "Test"
                },
                {
                  "type": "radiogroup",
                  "name": "question4",
                  "choices": [
                    "Item 1",
                    "Item 2",
                    "Item 3"
                  ]
                }
              ]
            },
            {
              "type": "radiogroup",
              "name": "question5",
              "choices": [
                "Item 1",
                "Item 2",
                "Item 3"
              ]
            }
          ]
        }
      ],
      "triggers": [
        {
          "type": "skip",
          "expression": "{question1} = 1",
          "gotoName": "question4"
        }
      ],
      "questionsOnPageMode": "questionPerPage"
    });
    survey.setValue("question1", 1);
    expect(survey.currentPage.name, "page2 is the current page").toLooseEqual("page3");
    expect(survey.currentSingleElement.name, "panel1 is the current element").toLooseEqual("panel1");
  });
  test("questionPerPage &  panel validation, Bug#10426", () => {
    const survey = new SurveyModel({
      "pages": [
        {
          "elements": [
            { "type": "panel", "name": "panel1", "isRequired": true, "elements": [{ "type": "text", "name": "q1" }] }
          ] },
        {
          "elements": [
            {
              "type": "text",
              "name": "q3"
            }
          ]
        }
      ],
      "questionsOnPageMode": "questionPerPage"
    });
    expect(survey.currentPage.name, "page1 is the current page, #1").toLooseEqual("page1");
    expect(survey.currentSingleElement.name, "panel1 is the current element, #1").toLooseEqual("panel1");
    survey.performNext();
    expect(survey.currentPage.name, "page1 is the current page, #2").toLooseEqual("page1");
    expect(survey.currentSingleElement.name, "panel1 is the current element, #2").toLooseEqual("panel1");
    const panel = survey.getPanelByName("panel1");
    expect(panel.errors.length, "panel has one error").toLooseEqual(1);
    panel.getQuestionByName("q1").value = "val1";
    survey.performNext();
    expect(panel.errors.length, "panel has no errors").toLooseEqual(0);
    expect(survey.currentPage.name, "page2 is the current page, #3").toLooseEqual("page2");
    expect(survey.currentSingleElement.name, "q3 is the current element").toLooseEqual("q3");
  });
  test("questionPerPage & asyc validation, Bug#10163", () => {
    let returnResultFunc = undefined;
    function isItCorrect([value]) {
      returnResultFunc = this.returnResult;
    }

    FunctionFactory.Instance.register("isItCorrect", isItCorrect, true);
    const survey = new SurveyModel({
      elements: [
        {
          type: "text",
          name: "q1",
          isRequired: true,
          title: "Allows 'abc' only",
          validators: [
            {
              type: "expression",
              expression: "isItCorrect({q1})",
            },
          ],
        },
        {
          type: "text",
          name: "q2"
        }
      ],
      questionsOnPageMode: "questionPerPage",
    });
    const q1 = survey.getQuestionByName("q1");
    expect(survey.currentSingleQuestion.name, "current question, #1").toLooseEqual("q1");
    q1.value = "abcd";
    survey.performNext();
    expect(survey.currentSingleQuestion.name, "current question, #2").toLooseEqual("q1");
    returnResultFunc(false);
    expect(survey.currentSingleQuestion.name, "current question, #3").toLooseEqual("q1");
    q1.value = "abc";
    survey.performNext();
    expect(survey.currentSingleQuestion.name, "current question, #4").toLooseEqual("q1");
    returnResultFunc(true);
    expect(survey.currentSingleQuestion.name, "current question, #5").toLooseEqual("q2");

    FunctionFactory.Instance.unregister("isItCorrect");
  });
  test("questionPerPage & asyc validation & using panel, Bug#10163 #2 (panel)", () => {
    let returnResultFunc = undefined;
    function isItCorrect([value]) {
      returnResultFunc = this.returnResult;
    }

    FunctionFactory.Instance.register("isItCorrect", isItCorrect, true);
    const survey = new SurveyModel({
      elements: [
        { type: "panel", name: "panel1", elements: [{
          type: "text",
          name: "q1",
          isRequired: true,
          title: "Allows 'abc' only",
          validators: [
            {
              type: "expression",
              expression: "isItCorrect({q1})",
            },
          ],
        }] },
        {
          type: "text",
          name: "q2"
        }
      ],
      questionsOnPageMode: "questionPerPage",
    });
    const q1 = survey.getQuestionByName("q1");
    expect(survey.currentSingleElement.name, "current question, #1").toLooseEqual("panel1");
    q1.value = "abcd";
    survey.performNext();
    expect(survey.currentSingleElement.name, "current question, #2").toLooseEqual("panel1");
    returnResultFunc(false);
    expect(survey.currentSingleElement.name, "current question, #3").toLooseEqual("panel1");
    q1.value = "abc";
    survey.performNext();
    expect(survey.currentSingleElement.name, "current question, #4").toLooseEqual("panel1");
    returnResultFunc(true);
    expect(survey.currentSingleElement.name, "current question, #5").toLooseEqual("q2");

    FunctionFactory.Instance.unregister("isItCorrect");
  });
  test("survey.getAllQuestions, get nested questions & creating nested questions on demand, Bug#9844", () => {
    const survey = new SurveyModel({
      pages: [
        {
          elements: [{ type: "text", name: "q1" }]
        },
        {
          elements: [
            {
              type: "paneldynamic", name: "q2",
              templateElements: [
                { type: "text", name: "q3" },
              ],
              panelCount: 1,
            }
          ]
        }
      ]
    });
    expect(survey.getAllQuestions().length, "2 root questions in the survey").toLooseEqual(2);
    const questions = survey.getAllQuestions(true, false, true);
    expect(questions.length, "3 questions in the survey").toLooseEqual(3);
    expect(questions[2].name, "the last question is nested").toLooseEqual("q3");
  });

  test("getContainerContent - TOC + title + progress above", () => {
    const json = {
      "title": "Some title text",
      "pages": [
        {
          "name": "page2",
          "elements": [
            {
              "type": "checkbox",
              "name": "question2",
            },
          ]
        },
        {
          "name": "page1",
          "elements": [
            {
              "type": "radiogroup",
              "name": "question1",
            }
          ]
        },
      ],
      "showProgressBar": true,
      "progressBarLocation": "aboveheader",
      "progressBarType": "questions",
      "showTOC": true,
      "headerView": "advanced"
    };

    let survey = new SurveyModel(json);
    const getContainerContent = getContainerContentFunction(survey);

    expect(getContainerContent("header"), "header is empty").toEqualValues([]);
    expect(getContainerContent("center"), "progress + toc in center").toEqualValues([{
      "component": "sv-progress-questions",
      "id": "progress-questions",
      "index": -150
    }]);
    expect(getContainerContent("footer"), "footer is empty").toEqualValues([]);
    expect(getContainerContent("contentTop"), "header in content top").toEqualValues([{
      "component": "sv-header",
      "container": "header",
      "id": "advanced-header",
      "index": -100
    }]);
    expect(getContainerContent("contentBottom"), "nav buttons in content bottom").toEqualValues([{
      "component": "sv-action-bar",
      "id": "buttons-navigation"
    }]);
    expect(getContainerContent("left"), "show toc left").toEqualValues([{
      "component": "sv-navigation-toc",
      "id": "toc-navigation"
    }]);
    expect(getContainerContent("right"), "right is empty").toEqualValues([]);
  });
  test("Warn in console if the expression has invalid function in a question, #981", () => {
    const prev = ConsoleWarnings.warn;
    const reportTexts = new Array<string>();
    const survey = new SurveyModel({
      pages: [
        {
          elements: [
            { type: "text", name: "q1", defaultValueExpression: "invalFunc1({q2})" },
            { type: "text", name: "q2" }
          ],
        },
      ],
      triggers: [
        { type: "setvalue", setToName: "q1", expression: "invalFunc2({q2})", setValue: 5 }
      ]
    });

    ConsoleWarnings.warn = (text: string) => {
      reportTexts.push(text);
    };
    survey.setValue("q2", "test");
    expect(reportTexts, "show warnings with the quesiton info").toEqualValues(["Unknown function name: 'invalFunc1'. It is used in the question: 'q1'.",
      "Unknown function name: 'invalFunc2'."]);
    ConsoleWarnings.warn = prev;
  });
  test("Warn in console if the expression is invalide in a question, #981", () => {
    const prev = ConsoleWarnings.warn;
    let reportText = "";
    ConsoleWarnings.warn = (text: string) => {
      reportText = text;
    };
    const survey = new SurveyModel({
      elements: [{ type: "text", name: "q1", defaultValueExpression: "{a} ++" }]
    });

    expect(reportText, "show warnings with the quesiton info").toLooseEqual("Invalid expression: '{a} ++'. It is used in the question: 'q1'.");
    ConsoleWarnings.warn = prev;
  });
  test("Do not serialize mode:display property, #10281", () => {
    const survey1 = new SurveyModel({ readOnly: true });
    expect(survey1.mode, "mode #1").toLooseEqual("display");
    expect(survey1.readOnly, "readOnly #1").toLooseEqual(true);
    const survey2 = new SurveyModel({ mode: "display" });
    expect(survey2.mode, "mode #2").toLooseEqual("display");
    expect(survey2.readOnly, "readOnly #2").toLooseEqual(true);
    const survey3 = new SurveyModel();
    survey3.readOnly = true;
    expect(survey3.mode, "mode #3").toLooseEqual("display");
    expect(survey3.readOnly, "readOnly #3").toLooseEqual(true);
    survey3.readOnly = false;
    expect(survey3.mode, "mode #4").toLooseEqual("edit");
    expect(survey3.readOnly, "readOnly #4").toLooseEqual(false);
    survey3.readOnly = true;
    expect(survey3.toJSON(), "survey3 is serialized correctly").toEqualValues({
      readOnly: true
    });
  });
  test("Do not allow to set name vs |, #10424", () => {
    const page = new PageModel("p1|mode");
    expect(page.name, "the | is removed, #1").toLooseEqual("p1mode");
    page.name = "p2|mode";
    expect(page.name, "the | is removed, #2").toLooseEqual("p2mode");
    const panel = new PanelModel("p1|mode");
    expect(panel.name, "the | is removed, #3").toLooseEqual("p1mode");
    panel.name = "p2|mode";
    expect(panel.name, "the | is removed, #4").toLooseEqual("p2mode");
    const question = new QuestionTextModel("q1|mode");
    expect(question.name, "the | is removed, #5").toLooseEqual("q1mode");
    question.name = "q2|mode";
    expect(question.name, "the | is removed, #6").toLooseEqual("q2mode");
  });
  test("Create custom NavigationBar", () => {
    class CustomNavigationBar extends ActionContainer {
      constructor() {
        super();
      }
      public customProp1: string = "checkThisProp";
    }
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" }
      ]
    });
    survey.createNavigationBarCallback = () => new CustomNavigationBar();
    expect(survey.navigationBar instanceof CustomNavigationBar, "navigationBar is CustomNavigationBar").toBeTruthy();
    expect((survey.navigationBar as CustomNavigationBar).customProp1, "customProp1 is set correctly").toLooseEqual("checkThisProp");
    expect(survey.navigationBar.locOwner, "locOwner is set correctly").toLooseEqual(survey);
  });
  test("Do not create layoutElements in creator", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" }
      ]
    });
    let le = survey.getPropertyValue("layoutElements");
    expect(le?.length, "There is no layout elements in survey").toLooseEqual(undefined);
    const progressElement = survey.findLayoutElement("progress-questions");
    expect(progressElement.id, "There is no progress-questions layout element in survey").toLooseEqual("progress-questions");
    le = survey.getPropertyValue("layoutElements");
    expect(le.length > 3, "There is  layout elements in survey after finding layout element").toLooseEqual(true);
  });
  test("Do not create timerValue in contructor", () => {
    const survey: any = new SurveyModel();
    expect(survey.timerModelValue, "timerValue is undefined").toLooseEqual(undefined);
    expect(survey.timerModel.isRunning, "timerModel is not started").toLooseEqual(false);
    expect(survey.timerModelValue, "timerValue is not undefined").toBeTruthy();
  });
  test("Do not create notifierValue in contructor", () => {
    const survey: any = new SurveyModel();
    expect(survey.notifierValue, "notifierValue is undefined").toLooseEqual(undefined);
    survey.notify("abc");
    expect(survey.notifierValue, "notifierValue is not undefined").toBeTruthy();
  });
  test("Make array properties on demand", () => {
    const survey: any = new SurveyModel();
    expect(survey.getPropertyValue("triggers"), "triggers is undefined on loading").toLooseEqual(undefined);
    expect(survey.getPropertyValue("calculatedValues"), "calculatedValues is undefined on loading").toLooseEqual(undefined);
    expect(survey.getPropertyValue("completedHtmlOnCondition"), "completedHtmlOnCondition is undefined on loading").toLooseEqual(undefined);
    expect(survey.getPropertyValue("navigateToUrlOnCondition"), "navigateToUrlOnCondition is undefined on loading").toLooseEqual(undefined);
    survey.toJSON();
    expect(survey.getPropertyValue("triggers"), "triggers is undefined after serialization").toLooseEqual(undefined);
    expect(survey.getPropertyValue("calculatedValues"), "calculatedValues is undefined after serialization").toLooseEqual(undefined);
    expect(survey.getPropertyValue("completedHtmlOnCondition"), "completedHtmlOnCondition is undefined after serialization").toLooseEqual(undefined);
    expect(survey.getPropertyValue("navigateToUrlOnCondition"), "navigateToUrlOnCondition is undefined after serialization").toLooseEqual(undefined);
  });
  test("Re-run expressions on changing the related object properties, Bug#10776", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1", visibleIf: "{$survey.locale} = 'de'" },
        { type: "text", name: "q2", visibleIf: "{$survey.readOnly} = false" },
        { type: "radiogroup", name: "q3",
          choices: ["item1",
            { value: "item2", visibleIf: "{$survey.locale} = 'de'" },
            { value: "item3", visibleIf: "{$survey.readOnly} = false" }] }
      ]
    });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    const q3 = survey.getQuestionByName("q3");
    expect(q1.visible, "q1 is invisible by default").toLooseEqual(false);
    expect(q2.visible, "q2 is visible by default").toLooseEqual(true);
    expect(q3.visibleChoices.length, "q3 has two visible choices by default").toLooseEqual(2);
    survey.locale = "de";
    expect(q1.visible, "q1 is visible after locale change to 'de'").toLooseEqual(true);
    expect(q2.visible, "q2 is visible after locale change to 'de'").toLooseEqual(true);
    expect(q3.visibleChoices.length, "q3 has three visible choices after locale change to 'de'").toLooseEqual(3);
    survey.readOnly = true;
    expect(q1.visible, "q1 is visible after making survey readOnly").toLooseEqual(true);
    expect(q2.visible, "q2 is invisible after making survey readOnly").toLooseEqual(false);
    expect(q3.visibleChoices.length, "q3 has two visible choices after making survey readOnly").toLooseEqual(2);
    survey.readOnly = false;
    expect(q1.visible, "q1 is visible after making survey readOnly").toLooseEqual(true);
    expect(q2.visible, "q2 is visible after making survey readOnly").toLooseEqual(true);
    expect(q3.visibleChoices.length, "q3 has three visible choices after making survey readOnly").toLooseEqual(3);
    survey.locale = "";
    expect(q1.visible, "q1 is invisible after locale change to ''").toLooseEqual(false);
    expect(q2.visible, "q2 is visible after locale change to ''").toLooseEqual(true);
    expect(q3.visibleChoices.length, "q3 has two visible choices after locale change to ''").toLooseEqual(2);
  });
  test("visibleIf with $q.containsErrors and checkErrorsMode=onValueChanged", () => {
    const survey = new SurveyModel({
      checkErrorsMode: "onValueChanged",
      elements: [
        {
          type: "text",
          name: "q1",
          inputType: "number",
          min: 10
        },
        {
          type: "text",
          name: "q2",
          visibleIf: "{q1} notempty and {$q1.containsErrors} = false"
        }
      ]
    });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    expect(q2.isVisible, "q2 is invisible initially, q1 is empty").toLooseEqual(false);
    q1.value = 20;
    expect(q1.errors.length, "q1 has no errors, value=20 >= min=10").toLooseEqual(0);
    expect(q2.isVisible, "q2 is visible, q1=20 and no errors").toLooseEqual(true);
    q1.value = 5;
    expect(q1.errors.length, "q1 has error, value=5 < min=10").toLooseEqual(1);
    expect(q2.isVisible, "q2 is invisible, q1=5 contains errors").toLooseEqual(false);
  }); test("Panel visibleIf with $q.containsErrors and checkErrorsMode=onValueChanged", () => {
    const survey = new SurveyModel({
      checkErrorsMode: "onValueChanged",
      elements: [
        {
          type: "text",
          name: "q1",
          inputType: "number",
          min: 10
        },
        {
          type: "panel",
          name: "panel1",
          visibleIf: "{q1} notempty and {$q1.containsErrors} = false",
          elements: [{ type: "text", name: "q2" }]
        }
      ]
    });
    const q1 = survey.getQuestionByName("q1");
    const panel1 = survey.getPanelByName("panel1");
    expect(panel1.isVisible, "panel1 is invisible initially, q1 is empty").toLooseEqual(false);
    q1.value = 20;
    expect(q1.errors.length, "q1 has no errors, value=20 >= min=10").toLooseEqual(0);
    expect(panel1.isVisible, "panel1 is visible, q1=20 and no errors").toLooseEqual(true);
    q1.value = 5;
    expect(q1.errors.length, "q1 has error, value=5 < min=10").toLooseEqual(1);
    expect(panel1.isVisible, "panel1 is invisible, q1=5 contains errors").toLooseEqual(false);
  });
});
