import { Base } from "../src/base";
import { SurveyElement } from "../src/survey-element";
import { SurveyModel, DefaultTheme } from "../src/survey";
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
    expect(survey.data, "there is no data").toEqual({});
    survey.data = { strVal: "item1", intVal: 5 };
    expect(survey.data, "set the object").toEqual({ strVal: "item1", intVal: 5 });
    survey.data = null;
    expect(survey.data, "clear data").toEqual({});
  });
  test("merge data property", () => {
    var survey = new SurveyModel();
    survey.mergeData({ strVal: "item1", intVal: 5 });
    expect(survey.data, "works as set data for empty data").toEqual({ strVal: "item1", intVal: 5 });
    survey.mergeData({ intVal: 7, boolVal: false });
    expect(survey.data, "merge the data, overrides values").toEqual({ strVal: "item1", intVal: 7, boolVal: false });
    survey.mergeData(null);
    expect(survey.data, "do nothing").toEqual({ strVal: "item1", intVal: 7, boolVal: false });
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
    expect(question.value, "value set correctly").toEqual(imageData);
  });
  test("Add two pages", () => {
    var survey = new SurveyModel();
    survey.addPage(new PageModel("Page 1"));
    survey.addPage(new PageModel("Page 2"));
    expect(survey.PageCount, "Two pages").toBe(2);
  });
  test("create page and make it first", () => {
    var survey = new SurveyModel();
    survey.addPage(new PageModel("Page 1"));
    survey.addPage(new PageModel("Page 2"));
    var newPage = survey.createNewPage("new Page");
    survey.addPage(newPage, 0);
    expect(survey.PageCount, "Three pages").toBe(3);
    expect(survey.pages[0].name, "New page is inserted correctly").toBe("new Page");
    survey.addNewPage("second Page", 1);
    expect(survey.PageCount, "Four pages").toBe(4);
    expect(survey.pages[1].name, "Second page is inserted correctly").toBe("second Page");
  });
  test("Current Page", () => {
    var survey = new SurveyModel();
    survey.addPage(createPageWithQuestion("Page 1"));
    expect(survey.currentPageNo, "the first page is  current").toBe(0);
    survey.currentPage = null;
    expect(survey.currentPageNo, "can't set curent page to null").toBe(0);
    var sPage = createPageWithQuestion("new Page");
    survey.addPage(sPage);
    survey.currentPage = sPage;
    expect(survey.currentPageNo, "second page is current").toBe(1);
    survey.pages.pop();
    expect(survey.currentPageNo, "the first page is current after removing the current one").toBe(0);
  });
  test("Set number and name into currentPage property", () => {
    var survey = new SurveyModel();
    survey.addPage(createPageWithQuestion("page1"));
    survey.addPage(createPageWithQuestion("page2"));
    survey.addPage(createPageWithQuestion("page3"));
    expect(survey.currentPage.name, "The current page is page1").toBe("page1");
    survey.currentPage = 1;
    expect(survey.currentPage.name, "The current page is page2, set by number").toBe("page2");
    survey.currentPage = 4;
    expect(survey.currentPage.name, "The current page is still page2, set by number that doesn't exist").toBe("page2");
    survey.currentPage = "page3";
    expect(survey.currentPage.name, "The current page is page3, set by name").toBe("page3");
    survey.currentPage = "page5";
    expect(survey.currentPage.name, "The current page is still page3, set by name that doesn't exist").toBe("page3");
  });
  test("CurrentPageNo", () => {
    var survey = new SurveyModel();
    survey.addPage(createPageWithQuestion("Page 1"));
    expect(survey.currentPageNo, "the first page is  current").toBe(0);
    survey.currentPageNo = -1;
    expect(survey.currentPageNo, "can't set curent page to -1").toBe(0);
    survey.currentPageNo = 1;
    expect(survey.currentPageNo, "can't set curent page to PageNo + 1").toBe(0);
    var sPage = createPageWithQuestion("new Page");
    survey.addPage(sPage);
    survey.currentPageNo = 1;
    expect(survey.currentPageNo, "second page is current").toBe(1);
    survey.pages.pop();
    expect(survey.currentPageNo, "the first page is current after removing the current one").toBe(0);
  });
  test("PageModel navigationTitle and navigationDescription properties", () => {
    var page = new PageModel("Page 1");
    page.navigationTitle = "Title";
    expect(page.locNavigationTitle.renderedHtml, "The locNavigationTitle property correspond navigationTitle").toBe("Title");
    page.navigationDescription = "Description";
    expect(page.getLocalizableString("navigationDescription").renderedHtml, "The locNavigationDescription property correspond navigationDescription").toBe("Description");
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
    expect(survey.pages[0].renderedNavigationTitle, "page1").toBe("page1");
    expect(survey.pages[1].renderedNavigationTitle, "page2").toBe("Page 2");
    expect(survey.pages[2].renderedNavigationTitle, "page3").toBe("NavPage 3");
    expect(survey.pages[3].renderedNavigationTitle, "page4").toBe("NavPage 4");
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
    expect(survey.pages[0].renderedNavigationTitle, "page1, #1").toBe("page1");
    expect(survey.pages[1].renderedNavigationTitle, "page2, #1").toBe("Page 2");
    expect(survey.pages[2].renderedNavigationTitle, "page3, #1").toBe("NavPage 3, ");
    expect(survey.pages[3].renderedNavigationTitle, "page4, #1").toBe("NavPage 4, ");
    survey.setValue("q1", "val1");
    survey.setValue("q2", "val2");
    expect(survey.pages[0].renderedNavigationTitle, "page1, #2").toBe("page1");
    expect(survey.pages[1].renderedNavigationTitle, "page2, #2").toBe("Page 2");
    expect(survey.pages[2].renderedNavigationTitle, "page3, #2").toBe("NavPage 3, val1");
    expect(survey.pages[3].renderedNavigationTitle, "page4, #2").toBe("NavPage 4, val2");
  });

  test("Remove Page in design mode", () => {
    var survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.addPage(new PageModel("Page 1"));
    survey.addPage(new PageModel("Page 2"));
    expect(survey.PageCount, "Two pages").toBe(2);
    expect(survey.currentPage.name, "the first page is  current").toBe("Page 1");

    survey.removePage(survey.pages[0]);
    expect(survey.PageCount, "One page left").toBe(1);
    expect(survey.currentPage.name, "the second page is  current").toBe("Page 2");
  });
  test("Do not change currentPage on re-ordering pages in design mode (remove/delete)", () => {
    var survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.addNewPage("Page1");
    survey.addNewPage("Page2");
    survey.addNewPage("Page3");
    expect(survey.PageCount, "3 pages").toBe(3);
    expect(survey.currentPage.name, "The first page is current").toBe("Page1");
    survey.onContainsPageCallback = function () {
      return true;
    };
    var page = survey.pages[0];
    survey.pages.splice(0, 1);
    expect(survey.currentPage.name, "The first page is still current").toBe("Page1");
    survey.pages.splice(2, 0, page);
    survey.onContainsPageCallback = null;
    expect(survey.currentPage.name, "The first page is still current, # 2").toBe("Page1");
    expect(survey.pages[2].name, "The first page is becomes last in list").toBe("Page1");
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
    expect(valueChangedCallCounter, "Nothing happens").toBe(0);
    q1.value = 1;
    expect(valueChangedCallCounter, "Set one value").toBe(1);
    q1.value = q1.otherItem.value;
    expect(valueChangedCallCounter, "Set other value").toBe(2);
    q1.otherValue = "new comment";
    expect(valueChangedCallCounter, "Set comment to other value").toBe(3);
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
    expect(survey.activePage.name, "active page page is p2").toBe("p2");
    expect(survey.currentPage.name, "current page page is p2").toBe("p2");
    expect(survey.isShowPrevButton, "prev, first page").toBe(false);
    expect(survey.isShowNextButton, "next, first page").toBe(true);
    expect(survey.isCompleteButtonVisible, "complete, display mode").toBe(false);
    survey.nextPage();
    expect(survey.activePage.name, "active page page is p3").toBe("p3");
    expect(survey.currentPage.name, "current page page is p3").toBe("p3");
    expect(survey.isShowPrevButton, "prev, second page").toBe(true);
    expect(survey.isShowNextButton, "next, second page").toBe(false);
    expect(survey.isCompleteButtonVisible, "complete, display mode").toBe(false);
    survey.prevPage();
    expect(survey.activePage.name, "active page page is p2, #2").toBe("p2");
    expect(survey.currentPage.name, "current page page is p2, #2").toBe("p2");
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
    expect(survey.activePage.name, "active page #1").toBe("p1");
    expect(survey.activePage.rows.length, "rows #1").toBe(2);
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion #1").toBe("q1");
    survey.start();
    expect(survey.activePage.name, "active page #2").toBe("p2");
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion #2").toBe("q1");
    expect(survey.activePage.rows.length, "rows #2").toBe(1);
    expect(survey.isShowPrevButton, "isShowPrevButton #2").toBe(false);
    survey.performNext();
    expect(survey.activePage.name, "active page #3").toBe("p3");
    expect(survey.activePage.rows.length, "rows #3").toBe(1);
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion #3").toBe("q2");
    expect(survey.isShowPrevButton, "isShowPrevButton #3").toBe(true);
    survey.performNext();
    expect(survey.activePage.name, "active page #4").toBe("p3");
    expect(survey.activePage.rows.length, "rows #4").toBe(1);
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion #4").toBe("q3");
    expect(survey.isShowPrevButton, "isShowPrevButton #4").toBe(true);
    survey.performPrevious();
    expect(survey.activePage.name, "active page #5").toBe("p3");
    expect(survey.activePage.rows.length, "rows #5").toBe(1);
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion #5").toBe("q2");
    expect(survey.isShowPrevButton, "isShowPrevButton #5").toBe(true);
    survey.performPrevious();
    expect(survey.activePage.name, "active page #6").toBe("p2");
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion #6").toBe("q1");
    expect(survey.activePage.rows.length, "rows #6").toBe(1);
    expect(survey.isShowPrevButton, "isShowPrevButton #6").toBe(false);
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
    expect(survey.pages[0].num).toBe(-1);
    expect(survey.pages[0].visibleIndex).toBe(-1);
    expect(survey.pages[1].num).toBe(1);
    expect(survey.pages[1].visibleIndex).toBe(0);
    expect(survey.pages[2].num).toBe(2);
    expect(survey.pages[2].visibleIndex).toBe(1);
  });

  test("Do not show errors in display mode", () => {
    var survey = twoPageSimplestSurvey();
    (<Question>survey.pages[0].questions[0]).isRequired = true;
    survey.readOnly = true;
    survey.nextPage();
    expect(survey.currentPageNo, "Can move into another page").toBe(1);
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
    expect(survey.currentPageNo, "Can move into another page").toBe(1);
    expect(survey.state, "survey is running").toBe("running");
    expect(survey.getValue("question3"), "question3 value is not set").toBeUndefined();
  });
  test("Do not show errors if ignoreValidation = true", () => {
    const survey = twoPageSimplestSurvey();
    const q1 = survey.pages[0].questions[0];
    q1.isRequired = true;
    survey.pages[1].questions[0].isRequired = true;
    expect(survey.validationEnabled, "validationEnabled #1").toBe(true);
    expect(survey.ignoreValidation, "ignoreValidation #1").toBe(false);
    survey.ignoreValidation = true;
    expect(survey.validationEnabled, "validationEnabled #2").toBe(false);
    expect(survey.ignoreValidation, "ignoreValidation #2").toBe(true);
    survey.validationEnabled = true;
    expect(survey.validationEnabled, "validationEnabled #3").toBe(true);
    expect(survey.ignoreValidation, "ignoreValidation #3").toBe(false);
    survey.validationEnabled = false;
    expect(survey.validationEnabled, "validationEnabled #4").toBe(false);
    expect(survey.ignoreValidation, "ignoreValidation #4").toBe(true);

    survey.nextPage();
    expect(q1.errors.length, "There is a required error").toBe(0);
    expect(survey.currentPageNo, "Can move into another page").toBe(1);
    survey.tryComplete();
    expect(survey.state, "Can complete survey with erros").toBe("completed");
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
    expect(q1.errors.length, "There is an error").toBe(1);
    survey.nextPage();
    expect(survey.currentPageNo, "Can move into another page").toBe(1);
    survey.tryComplete();
    expect(survey.state, "Can complete survey with erros").toBe("completed");
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
    expect(q1.errors.length, "There is an error").toBe(1);
    survey.nextPage();
    expect(survey.currentPageNo, "Can move into another page").toBe(1);
    survey.tryComplete();
    expect(survey.currentPageNo, "Move to the first page").toBe(0);
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
    expect(survey.currentPageNo, "Init current page").toBe(0);
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
    expect(q1.isReadOnly, "check1. question is not readonly").toBe(false);
    q1.readOnly = true;
    expect(q1.isReadOnly, "check2. question is  readonly now").toBe(true);
    q1.readOnly = false;
    survey.readOnly = true;
    expect(q1.isReadOnly, "check2. question is  readonly because survey in the display mode").toBe(true);
  });
  test("Do not show required error for readOnly questions", () => {
    var survey = twoPageSimplestSurvey();
    var page = survey.pages[0];
    var q1 = <Question>(<Question>page.questions[0]);
    q1.isRequired = true;
    expect(page.validate(), "There is a required error").toBe(false);
    q1.readOnly = true;
    expect(page.validate(), "There is no errors, the question is readOnly").toBe(true);
  });
  test("DO not change errors array on fireCallback = false", () => {
    var survey = twoPageSimplestSurvey();
    var page = survey.pages[0];
    var q1 = <Question>(<Question>page.questions[0]);
    q1.isRequired = true;
    expect(page.validate(false), "There is a required error").toBe(false);
    expect(q1.errors.length, "The errors array is empty").toBe(0);
    page.validate(true);
    expect(q1.errors.length, "The errors array is not empty now").toBe(1);
  });
  test("Do not show required error for value 0 and false, #345", () => {
    var survey = twoPageSimplestSurvey();
    var page = survey.pages[0];
    var q1 = <Question>(<Question>page.questions[0]);
    q1.isRequired = true;
    expect(page.validate(), "There is a required error").toBe(false);
    survey.setValue("question1", 0);
    expect(q1.value, "question1.value == 0").toBe(0);
    expect(page.validate(), "There is no errors, the question value is 0").toBe(true);
    survey.setValue("question1", false);
    expect(q1.value, "question1.value == false").toBe(false);
    expect(page.validate(), "There is no errors, the question value is false").toBe(true);
    survey.setValue("question1", null);
    expect(page.validate(), "There is a required error, the question value is null").toBe(false);
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
    expect(survey.currentPageNo, "Init current page").toBe(0);
    //change currentPageNo
    expect(survey.isFirstPage, "isFirstPage #1").toBe(true);
    expect(survey.isLastPage, "isLastPage #1").toBe(false);
    survey.nextPage();
    expect(survey.isFirstPage, "isFirstPage #2").toBe(false);
    expect(survey.isLastPage, "isLastPage #2").toBe(true);
    survey.currentPageNo = 0;
    expect(survey.isFirstPage, "isFirstPage #3").toBe(true);
    expect(survey.isLastPage, "isLastPage #3").toBe(false);
    const page = new PageModel("newPage");
    page.addNewQuestion("text", "q3");
    survey.pages.unshift(page);
    expect(survey.isFirstPage, "isFirstPage #4").toBe(false);
    expect(survey.isLastPage, "isLastPage #4").toBe(false);
    survey.pages.shift();
    expect(survey.pages.length, "We have two pages").toBe(2);
    expect(survey.isFirstPage, "isFirstPage #5").toBe(true);
    expect(survey.isLastPage, "isLastPage #5").toBe(false);
    survey.pages[1].visible = false;
    expect(survey.isFirstPage, "isFirstPage #6").toBe(true);
    expect(survey.isLastPage, "isLastPage #6").toBe(true);
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
    expect(survey.currentPageNo, "Init current page").toBe(0);
    expect(survey.isLastPage, "isLastPage #1").toBe(false);
    expect(survey.isShowNextButton, "isShowNextButton #1").toBe(true);
    expect(survey.isCompleteButtonVisible, "isCompleteButtonVisible #1").toBe(false);
    survey.nextPage();
    expect(survey.isLastPage, "isLastPage #2").toBe(true);
    expect(survey.isShowNextButton, "isShowNextButton #2").toBe(false);
    expect(survey.isShowPrevButton, "isShowPrevButton #1").toBe(true);
    expect(survey.isCompleteButtonVisible, "isCompleteButtonVisible #2").toBe(false);
    survey.showPreview();
    expect(survey.isShowPrevButton, "isShowPrevButton #2").toBe(false);
    expect(survey.isShowNextButton, "isShowNextButton #3").toBe(false);
    expect(survey.isCompleteButtonVisible, "isCompleteButtonVisible #3").toBe(true);
    survey.readOnly = true;
    expect(survey.isCompleteButtonVisible, "isCompleteButtonVisible, read-only #4").toBe(false);
    survey.readOnly = false;
    expect(survey.isCompleteButtonVisible, "isCompleteButtonVisible, edit mode #5").toBe(true);
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

    expect(survey.currentPageNo, "Init current page").toBe(0);
    expect(survey.isShowPrevButton, "prev #1").toBe(false);
    expect(survey.isCompleteButtonVisible, "complete #1").toBe(false);
    expect(survey.navigationBar.getActionById("sv-nav-prev").isVisible, "sv-nav-prev, #1").toBe(false);
    expect(survey.navigationBar.getActionById("sv-nav-complete").isVisible, "sv-nav-complete, #1").toBe(false);

    survey.nextPage();
    expect(survey.currentPageNo, "second page").toBe(1);
    expect(survey.isShowPrevButton, "prev #2").toBe(false);
    expect(survey.isCompleteButtonVisible, "complete #2").toBe(false);
    expect(survey.navigationBar.getActionById("sv-nav-prev").isVisible, "sv-nav-prev, #2").toBe(false);
    expect(survey.navigationBar.getActionById("sv-nav-complete").isVisible, "sv-nav-complete, #2").toBe(false);

    survey.showPrevButton = true;
    survey.showCompleteButton = true;
    expect(survey.currentPageNo, "second page, #2").toBe(1);
    expect(survey.isShowPrevButton, "prev #3").toBe(true);
    expect(survey.isCompleteButtonVisible, "complete #3").toBe(true);
    expect(survey.navigationBar.getActionById("sv-nav-prev").isVisible, "sv-nav-prev, #3").toBe(true);
    expect(survey.navigationBar.getActionById("sv-nav-complete").isVisible, "sv-nav-complete, #3").toBe(true);
  });
  test("Next, Prev, IsFirst and IsLast Page and progressText", () => {
    surveyLocalization.defaultLocale = "en";
    surveyLocalization.currentLocale = "";
    var survey = new SurveyModel();
    expect(survey.progressText, "there is pages").toBe("");
    survey.addPage(createPageWithQuestion("Page 1"));
    survey.addPage(createPageWithQuestion("Second page", "q2"));
    survey.addPage(createPageWithQuestion("Third page", "q3"));
    expect(survey.currentPageNo, "Current Page is  First").toBe(0);
    expect(survey.isFirstPage, "Current Page is  First").toBe(true);
    expect(survey.isLastPage, "Current Page is  First").toBe(false);
    expect(survey.progressText, "Current Page is  First").toBe("Page 1 of 3");
    survey.nextPage();
    expect(survey.currentPageNo, "Current Page is  Second").toBe(1);
    expect(survey.isFirstPage, "Current Page is  Second").toBe(false);
    expect(survey.isLastPage, "Current Page is  Second").toBe(false);
    expect(survey.progressText, "Current Page is  First").toBe("Page 2 of 3");
    survey.nextPage();
    expect(survey.currentPageNo, "Current Page is  Third").toBe(2);
    expect(survey.isFirstPage, "Current Page is  Third").toBe(false);
    expect(survey.isLastPage, "Current Page is  Third").toBe(true);
    expect(survey.progressText, "Current Page is  First").toBe("Page 3 of 3");
    survey.prevPage();
    expect(survey.currentPageNo, "Current Page is  Second").toBe(1);
    expect(survey.isFirstPage, "Current Page is  Second").toBe(false);
    expect(survey.isLastPage, "Current Page is  Second").toBe(false);
    expect(survey.progressText, "Current Page is  First").toBe("Page 2 of 3");
    survey.prevPage();
    expect(survey.currentPageNo, "Current Page is  First").toBe(0);
    expect(survey.isFirstPage, "Current Page is  First").toBe(true);
    expect(survey.isLastPage, "Current Page is  First").toBe(false);
    expect(survey.progressText, "Current Page is  First").toBe("Page 1 of 3");
    survey.nextPage();
    expect(survey.progressText, "Current Page is Second").toBe("Page 2 of 3");
    survey.setDesignMode(true);
    survey.nextPage();
    expect(survey.progressText, "Current Page is last").toBe("Page 3 of 3");

    survey.setDesignMode(false);
    survey.currentPageNo = 0;
    survey.progressBarType = "questions";
    expect(survey.progressText, "Questions progress indicator").toBe("Answered 0/3 questions");
    survey.getAllQuestions()[0].value = "Answer 1";
    expect(survey.progressText, "Answered 1 question from 3").toBe("Answered 1/3 questions");
    survey.getAllQuestions()[1].visible = false;
    expect(survey.progressText, "Make one question invisible").toBe("Answered 1/2 questions");
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
    expect(survey.progressText).toBe("Answered: 0%");
    survey.getAllQuestions()[0].value = "Answer 1";
    expect(survey.progressText).toBe("Answered: 25%");
    expect(questionCount, "There are 4 questions").toBe(4);
    expect(answeredQuestionCount, "One question is answered").toBe(1);
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
    expect(survey.progressText).toBe("Answered 0/2 questions");
    survey.setValue("q1", "1");
    expect(survey.progressText).toBe("Answered 1/2 questions");
    survey.setValue("q2", "1");
    expect(survey.progressText, "q2 is not required").toBe("Answered 1/2 questions");
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
    expect(survey.progressText).toBe("Answered: 50%");
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
    expect(oldCurrentPageName, "First nextPage, old").toBe("page1");
    expect(newCurrentPageName, "First nextPage, new").toBe("page2");
    survey.nextPage();
    expect(survey.currentPageNo, "We are on the last page").toBe(2);
    expect(oldCurrentPageName, "Second nextPage, old").toBe("page2");
    expect(newCurrentPageName, "Second nextPage, new").toBe("page3");
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

    expect(survey.progressText).toBe("Page 1 of 4");
    survey.progressBarType = "questions";
    expect(survey.progressText).toBe("Answered 0/4 questions");
    expect(survey.getProgressTypeComponent(), "questions component").toBe("sv-progress-questions");
    survey.progressBarType = "requiredQuestions";
    expect(survey.getProgressTypeComponent(), "requiredQuestions component").toBe("sv-progress-requiredquestions");
    expect(survey.progressText).toBe("Answered 0/2 questions");
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
    expect(survey.progressText, "#1").toBe("Answered 5/5 questions");
    const matrix = survey.getQuestionByName("matrix");
    const rows = matrix.visibleRows;
    rows[1].getQuestionByName("col2").value = true;
    expect(survey.progressText, "#2").toBe("Answered 5/6 questions");
    rows[1].getQuestionByName("col3").value = "abc";
    expect(survey.progressText, "#3").toBe("Answered 6/6 questions");
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
    expect(survey.progressText).toBe("Answered 0/2 questions");
    survey.setValue("q1", "1");
    expect(survey.progressText).toBe("Answered 1/2 questions");
    const rows = survey.getQuestionByName("q2").visibleRows;
    rows[0].cells[0].question.value = "2";
    expect(survey.progressText).toBe("Answered 2/2 questions");
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
    expect(survey.getProgress(), "The progress is 0").toBe(0);
    expect(survey.progressValue, "The progress is 0, progressValue").toBe(0);
    expect(survey.progressText, "Questions progress indicator").toBe("Answered 0/2 questions");
    survey.getQuestionByName("q1").value = "Answer 1";
    expect(survey.getProgress(), "The progress is 50%").toBe(50);
    expect(survey.progressValue, "The progress is 50%, progressValue").toBe(50);
    expect(survey.progressText).toBe("Answered 1/2 questions");
    survey.getQuestionByName("q3").value = "Answer 3";
    expect(survey.getProgress(), "The progress is 100%").toBe(100);
    expect(survey.progressValue, "The progress is 100%, progressValue").toBe(100);
    expect(survey.progressText).toBe("Answered 2/2 questions");
    //Add test cases for Bug#2460
    survey.getQuestionByName("q3").clearValue();
    expect(survey.getProgress(), "The progress is 50% again").toBe(50);
    expect(survey.progressValue, "The progress is 50% again, progressValue").toBe(50);
    survey.getQuestionByName("q3").visible = false;
    expect(survey.getProgress(), "The progress is 100%, the second answer is invisible").toBe(100);
    expect(survey.progressValue, "The progress is 100%, the second answer is invisible, progressValue").toBe(100);
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
    expect(survey.getProgress(), "page1 #1").toBe(0);
    expect(survey.progressValue, "page1 #2").toBe(0);
    expect(survey.progressText, "page1, #3").toBe("Page 1 of 4");
    survey.nextPage();
    expect(survey.getProgress(), "page2 #1").toBe(25);
    expect(survey.progressValue, "page2 #2").toBe(25);
    expect(survey.progressText, "page2, #3").toBe("Page 2 of 4");
    survey.nextPage();
    expect(survey.getProgress(), "page3 #1").toBe(50);
    expect(survey.progressValue, "page3 #2").toBe(50);
    expect(survey.progressText, "page3, #3").toBe("Page 3 of 4");
    survey.nextPage();
    expect(survey.getProgress(), "page4 #1").toBe(75);
    expect(survey.progressValue, "page4 #2").toBe(75);
    expect(survey.progressText, "page4, #3").toBe("Page 4 of 4");
  });
  test("survey.progressBarType = 'value', Bug #9532", () => {
    const survey = new SurveyModel({
      progressBarType: "questions",
      elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }],
    });
    let progressValue = 0;
    expect(survey.progressValue, "progressValue #1").toBe(0);
    survey.onValueChanged.add((sender, options) => {
      progressValue = sender.progressValue;
    });
    survey.getQuestionByName("q1").value = "1";
    expect(progressValue, "progressValue #2").toBe(50);
    survey.getQuestionByName("q2").value = "2";
    expect(progressValue, "progressValue #3").toBe(100);
  });
  test("Next, Prev, Next", () => {
    var survey = new SurveyModel();
    survey.addPage(createPageWithQuestion("Page 1"));
    survey.addPage(createPageWithQuestion("Page 2"));
    survey.addPage(createPageWithQuestion("Page 3"));
    expect(survey.currentPageNo, "Initial page is  first").toBe(0);
    survey.nextPage();
    expect(survey.currentPageNo, "After next the current page is  second").toBe(1);
    survey.prevPage();
    expect(survey.currentPageNo, "After the prev the current page is again first").toBe(0);
    survey.nextPage();
    expect(survey.currentPageNo, "After second next the current page is  second").toBe(1);
  });
  test("Survey state", () => {
    var survey = new SurveyModel();
    expect(survey.state, "There is no a visible page").toBe("empty");
    survey.addPage(createPageWithQuestion("Page 1"));
    survey.addPage(createPageWithQuestion("Page 2"));
    expect(survey.state, "Survey is in run mode").toBe("running");
    survey.nextPage();
    expect(survey.state, "Survey is in run mode").toBe("running");
    survey.tryComplete();
    expect(survey.state, "Survey is completed").toBe("completed");
  });
  test("Question Creator", () => {
    var inst = QuestionFactory.Instance;
    inst.registerQuestion("question1", (name: string) => {
      return new Question(name);
    });
    inst.registerQuestion("question2", (name: string) => {
      return new Question(name);
    });
    expect(inst.createQuestion("question1", "Q1").name, "Create first type of question").toBe("Q1");
    expect(inst.createQuestion("question2", "Q2").name, "Create second type of question").toBe("Q2");
    expect(inst.createQuestion("question3", "Q3"), "Create unexisting type of question").toBeNull();
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
    expect(page.questions.length, "Two questions").toBe(2);
    expect(page.questions[0].getType(), "Text question").toBe("text");
    expect(page.questions[1].getType(), "Checkbox question").toBe("checkbox");
  });
  test("Survey.getQuestionByName", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("Page 1");
    page.addNewQuestion("text", "Q1");
    page.addNewQuestion("checkbox", "Q2");
    page = survey.addNewPage("Page 1");
    page.addNewQuestion("text", "Q3");
    page.addNewQuestion("checkbox", "Q4");

    expect(survey.getQuestionByName("Q2").name, "find question on the first page").toBe("Q2");
    expect(survey.getQuestionByName("Q3").name, "find question on the second page").toBe("Q3");
    expect(survey.getQuestionByName("Q0"), "return null").toBeNull();
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

    expect(survey.getPanelByName("Panel2").name, "find panel on the first page").toBe("Panel2");
    expect(survey.getPanelByName("panel3", true).name, "find question on the second page").toBe("Panel3");
    expect(survey.getPanelByName("Panel1_1").name, "find child panel on the first page").toBe("Panel1_1");
    expect(survey.getPanelByName("panel3_1", true).name, "find child question on the second page").toBe("Panel3_1");
    expect(survey.getPanelByName("NoPanel"), "return null").toBeNull();
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
    expect(survey.getPageByQuestion(q2).name, "q1 - page1").toBe("page1");
    expect(survey.getPageByQuestion(q3).name, "q3 - page1").toBe("page1");
    expect(survey.getPageByQuestion(q4).name, "q4 - page2").toBe("page2");
    expect(survey.getPageByElement(panel1).name, "panel1 - page1").toBe("page1");
    expect(survey.getPageByElement(panel2).name, "panel2 - page1").toBe("page1");
  });
  test("Add/remove panel", () => {
    var survey = new SurveyModel();
    var page1 = survey.addNewPage("page1");
    var panel1 = page1.addNewPanel("panel1");
    var q1 = panel1.addNewQuestion("text", "q1");
    var panel2 = panel1.addNewPanel("panel2");
    var q2 = panel2.addNewQuestion("text", "q2");
    expect(page1.elements.length, "There is one element").toBe(1);
    page1.removeElement(panel1);
    expect(page1.elements.length, "There is no elements").toBe(0);
  });
  test("Remove element from nested panel, #321", () => {
    var survey = new SurveyModel();
    var page1 = survey.addNewPage("page1");
    var panel1 = page1.addNewPanel("panel1");
    var q1 = panel1.addNewQuestion("text", "q1");
    expect(panel1.elements.length, "There is one question in the panel").toBe(1);
    page1.removeElement(q1);
    expect(panel1.elements.length, "There no questions in the panel").toBe(0);
  });
  test("Add panel with questions", () => {
    var survey = new SurveyModel();
    var page1 = survey.addNewPage("page1");
    var panel1 = new PanelModel("panel1");
    var q1 = panel1.addNewQuestion("text", "q1");
    var panel2 = panel1.addNewPanel("panel2");
    var q2 = panel2.addNewQuestion("text", "q2");
    page1.addElement(panel1);
    expect(panel1.data, "The data is set correctly in the root panel").toBe(survey);
    expect(q2.survey, "The survey is set correctly in the question of the nested root").toBe(survey);
  });
  test("SurveyData interface implementation", () => {
    var surveyData: ISurveyData;
    surveyData = new SurveyModel();
    expect(surveyData.getValue("test1"), "No data").toBeUndefined();
    expect(surveyData.getValue("test2"), "No data").toBeUndefined();
    surveyData.setValue("test1", 1, false);
    surveyData.setValue("test2", "1", false);
    expect(surveyData.getValue("test1"), "Has value 1").toBe(1);
    expect(surveyData.getValue("test2"), "Has value '1'").toBe("1");
  });
  test("Store question value in the survey", () => {
    var survey = new SurveyModel();
    survey.addPage(new PageModel("Page 1"));
    var question = <Question>survey.pages[0].addNewQuestion("text", "question");
    expect(survey.getValue("question"), "No value").toBeUndefined();
    expect(question.value, "No value").toBeUndefined();

    question.value = "mytext";
    expect(survey.getValue("question"), "set value from question").toBe("mytext");
    expect(question.value, "set value from question").toBe("mytext");

    survey.setValue("question", "myNewtext");
    expect(survey.getValue("question"), "set value from survey").toBe("myNewtext");
    expect(question.value, "set value from survey").toBe("myNewtext");
  });
  test("Store comments in the survey", () => {
    var survey = new SurveyModel();
    survey.addPage(new PageModel("Page 1"));
    var question = <Question>survey.pages[0].addNewQuestion("text", "question");
    question.showCommentArea = true;
    expect(survey.getComment("question"), "Comment is empty").toBe("");
    expect(question.comment, "Comment is empty").toBe("");

    question.comment = "myComment";
    expect(survey.getComment("question"), "set comment from question").toBe("myComment");
    expect(question.comment, "set comment from question").toBe("myComment");

    survey.setComment("question", "myNewComment");
    expect(survey.getComment("question"), "set comment from survey").toBe("myNewComment");
    expect(question.comment, "set comment from survey").toBe("myNewComment");
  });
  test("Should set required questions before go on the  next page or finish", () => {
    var survey = twoPageSimplestSurvey();
    expect(survey, "Survey is not  null").not.toBeNull();
    (<Question>survey.pages[0].questions[0]).isRequired = true;

    expect(survey.nextPage(), "Can not go to the next page").toBe(false);
    expect(survey.pages[0].questions[0].validate(), "The question is not filled out.").toBe(false);
    expect(survey.pages[0].validate(), "The page is not filled out.").toBe(false);
    (<Question>survey.pages[0].questions[0]).value = "Test";

    expect(survey.nextPage(), "Can go to the next page").toBe(true);
    expect(survey.pages[0].questions[0].validate(), "The question is filled out.").toBe(true);
    expect(survey.pages[0].validate(), "The page is filled out.").toBe(true);
  });
  test("survey.checkErrorsMode = 'onValueChanged'", () => {
    var survey = twoPageSimplestSurvey();
    expect(survey, "Survey is not  null").not.toBeNull();
    var question = <Question>survey.pages[0].questions[0];
    question.validators.push(new EmailValidator());
    survey.checkErrorsMode = "onValueChanged";
    expect(question.errors.length, "there is no errrors yet").toBe(0);
    survey.setValue(question.name, "it is not e-mail");
    expect(question.errors.length, "The error about invalid e-mail is generated").toBe(1);
    survey.setValue(question.name, "a@a.co");
    expect(question.errors.length, "The is not errors again").toBe(0);
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
    expect(question.errors.length, "there is no errors yet").toBe(0);
    question.value = "it is not e-mail";
    expect(question.errors.length, "The error about invalid e-mail is generated").toBe(1);
    expect(question.value, "the value keeps in question").toBe("it is not e-mail");
    expect(survey.getValue(question.name), "We do not assign it to survey.data").toBeFalsy();
    survey.setValue(question.name, "a@a.co");
    expect(question.errors.length, "The is not errors again").toBe(0);
    expect(survey.getValue(question.name), "set value to survey.data").toBe("a@a.co");
    question = survey.getQuestionByName("question2");
    survey.setValue("question2", "val1");
    expect(question.value, "incorrect value set to question").toBe("val1");
    expect(question.errors.length, "error is generated").toBe(1);
    expect(survey.getValue("question2"), "survey do not have this value").toBeFalsy();
    survey.setValue("question2", "val");
    expect(question.value, "correct value set to question").toBe("val");
    expect(question.errors.length, "there is no errors").toBe(0);
    expect(survey.getValue("question2"), "set correct value into survey").toBe("val");
  });
  test("survey.checkErrorsMode = 'onValueChanging' and isRequired, Bug#2627", () => {
    var survey = twoPageSimplestSurvey();
    var question = <Question>survey.pages[0].questions[0];
    question.isRequired = true;
    question.value = "val1";
    survey.checkErrorsMode = "onValueChanging";
    expect(question.errors.length, "there is no errors yet").toBe(0);
    question.value = "";
    expect(question.errors.length, "The error is required").toBe(1);
    expect(question.value, "the value keeps in question").toBe("");
    expect(survey.getValue(question.name), "We do not assign it to survey.data").toBe("val1");
    survey.setValue(question.name, "val2");
    expect(question.errors.length, "The is not errors again").toBe(0);
    expect(survey.getValue(question.name), "set value to survey.data").toBe("val2");
    expect(question.value, "set value to survey.data").toBe("val2");
    question.value = "";
    expect(question.errors.length, "Show error again").toBe(1);
    expect(survey.getValue(question.name), "keep old value in survey.data").toBe("val2");
    question.value = "val3";
    expect(question.errors.length, "Error is gone").toBe(0);
    expect(survey.getValue(question.name), "set new value in survey.data").toBe("val3");
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
    expect(question.errors.length, "The error about invalid e-mail is generated").toBe(1);
  });
  test("survey.checkErrorsMode = 'onValueChanged' & isRequired: true & changing value to empty, #6692", () => {
    const json = {
      checkErrorsMode: "onValueChanged",
      elements: [{ type: "text", name: "q1", isRequired: true }]
    };
    const survey = new SurveyModel(json);
    const question = <Question>survey.getQuestionByName("q1");
    expect(question.errors.length, "No error initially").toBe(0);
    question.value = "abc";
    expect(question.errors.length, "No error, it has value").toBe(0);
    question.value = "";
    expect(question.errors.length, "There is an error").toBe(1);
  });
  test("survey.checkErrorsMode = 'onValueChanged' & , isRequired: true & do not generate error on setting the value, #6692", () => {
    const json = {
      checkErrorsMode: "onValueChanged",
      elements: [{ type: "text", name: "q1", isRequired: true }, { type: "text", name: "q2" }]
    };
    const survey = new SurveyModel(json);
    const question = <Question>survey.getQuestionByName("q1");
    expect(question.errors.length, "No error initially").toBe(0);
    survey.data = { q1: "", q2: "abc" };
    expect(question.errors.length, "No error on setting value to data").toBe(0);
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

    expect(question.errors.length, "No errors at the start").toBe(0);

    question.value = { Row1: { Column1: 2 } };
    expect(question.errors.length, "The error about invalid value").toBe(1);

    question.value = { Row1: { Column1: 30 } };
    expect(question.errors.length, "No errors - chosen right value").toBe(0);
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
    expect(survey.currentPageNo, "Ignore error on the first page").toBe(1);
    survey.tryComplete();
    expect(survey.currentPageNo, "Move to first page with the error").toBe(0);
    survey.afterRenderPage(<HTMLElement>{});

    survey.nextPage();
    expect(survey.currentPageNo, "Ignore error on the first page, #2").toBe(1);
    survey.tryComplete();
    expect(survey.currentPageNo, "Move to first page with the error, #2").toBe(0);
    survey.afterRenderPage(<HTMLElement>{});

    survey.setValue("q1", "john.snow@nightwatch.org");
    survey.nextPage();
    survey.tryComplete();
    expect(survey.currentPageNo, "Stay on second page").toBe(1);
    expect(survey.state, "There is an error on the second page").toBe("running");
    survey.setValue("q2", "a");
    survey.tryComplete();
    expect(survey.state, "No errors, completed").toBe("completed");
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
    expect(question.errors.length, "The question is not filled out.").toBe(1);
    question.value = 1;
    expect(question.errors.length, "The question has not errors").toBe(0);
    expect(survey.currentPage.name, "Go to the next page").toBe(survey.pages[1].name);
    survey.prevPage();
    expect(question.errors.length, "The question has not errors").toBe(0);
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

    expect(survey.currentPageNo, "The first page is shown").toBe(0);
    question.value = question.otherItem.value;
    expect(survey.currentPageNo, "The page is still first").toBe(0);
    expect(question.errors.length, "Do not show any error").toBe(0);
    question.otherValue = "Some text";
    expect(survey.currentPageNo, "The page is still first, #2").toBe(0);
    question.value = 2;
    expect(survey.currentPageNo, "The second page is shown").toBe(1);
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
    expect(survey.currentPageNo, "q1 is empty").toBe(0);
    expect(survey.getQuestionByName("q1").errors.length, "We do not show errors for q1").toBe(0);
    expect(survey.getQuestionByName("q2").errors.length, "We do not show errors for q2, q1 is empty").toBe(0);
    survey.setValue("q1", 1);
    expect(survey.currentPageNo, "q2 has error, do not move").toBe(0);
    expect(survey.getQuestionByName("q1").errors.length, "there is no error").toBe(0);
    expect(survey.getQuestionByName("q2").errors.length, "There is an error in q2, we can't move further").toBe(1);
    survey.getQuestionByName("q2").errors.splice(0, 1);
    survey.clear(true, true);
    survey.setValue("q1", 1);
    expect(survey.currentPageNo, "q2 is empty").toBe(0);
    expect(survey.getQuestionByName("q2").errors.length, "We do not touch q2 yet").toBe(0);
    survey.setValue("q2", 5);
    expect(survey.currentPageNo, "q2 has error, do not move").toBe(0);
    expect(survey.getQuestionByName("q2").errors.length, "Show errors q2 is changed.").toBe(1);
    survey.setValue("q2", 11);
    expect(survey.currentPageNo, "q2 has no errors").toBe(1);
    var d = new Date();
    d.setDate(d.getDate() - 5);
    survey.setValue("q3", d);
    expect(survey.getQuestionByName("q3").errors.length, "Do not show errors, because input type is date").toBe(0);
  });

  test("Invisible required questions should not be take into account", () => {
    var survey = twoPageSimplestSurvey();
    expect(survey, "Survey is not  null").not.toBeNull();
    (<Question>survey.pages[0].questions[0]).isRequired = true;
    expect(survey.nextPage(), "Can not go to the next page").toBe(false);
    survey.pages[0].questions[0].visible = false;
    expect(survey.nextPage(), "You can go to the next page now.").toBe(true);
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
    expect(name, "onValueChanged event, property name is correct").toBe("question1");
    expect(newValue, "onValueChanged event, property newValue is correct").toBe("value1");
    expect(counter, "onValueChanged event is called one time").toBe(1);
    (<Question>survey.pages[0].questions[0]).value = "val";
    expect(counter, "onValueChanged event is called one time").toBe(2);
  });
  test("onValueChanged event - do not call on equal value", () => {
    var survey = new SurveyModel();
    var counter = 0;
    survey.onValueChanged.add(function (sender: SurveyModel, options: any) {
      counter++;
    });
    survey.setValue("name", 1);
    expect(counter, "onValueChanged event is called one time").toBe(1);
    survey.setValue("name", 1);
    expect(counter, "1 is the same value").toBe(1);
    survey.setValue("name", { col1: [1, { cel2: "2" }] });
    expect(counter, "onValueChanged event is called two times").toBe(2);
    survey.setValue("name", { col1: [1, { cel2: "2" }] });
    expect(counter, "2, the value is the same").toBe(2);
    survey.setValue("name", { col1: [1, { cel2: "2" }, 3] });
    expect(counter, "onValueChanged event is called three times").toBe(3);
    survey.setValue("name", { col1: [1, { cel2: "2" }, 3] });
    expect(counter, "3, the value is the same").toBe(3);
    var value = survey.getValue("name");
    value.col1.push(4);
    survey.setValue("name", value);
    expect(counter, "onValueChanged event is called fourth times").toBe(4);
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
    expect(counter, "onValueChanged event is called one time").toBe(1);
    expect(name, "onValueChanged event, property name is correct").toBe("matrix");
    expect(newValue, "onValueChanged event, property newValue is correct").toEqual({ row1: "col2" });
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
    expect(counter, "onValueChanged event is called one time").toBe(1);
    expect(name, "onValueChanged event, property name is correct").toBe("multitext");
    expect(newValue, "onValueChanged event, property newValue is correct").toEqual({ item2: "text1" });
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
    expect(name, "onValueChanging event, property name is correct").toBe("question1");
    expect(questionName, "onValueChanging event, property question is correct").toBe("question1");
    expect(newValue, "onValueChanging event, property newValue is correct").toBe("value1");
    expect(counter, "onValueChanging event is called one time").toBe(1);
    (<Question>survey.pages[0].questions[0]).value = "val";
    expect(counter, "onValueChanging event is called two time").toBe(2);
    survey.setValue("q1", "val");
    expect(counter, "onValueChanging event is called three time").toBe(3);
    survey.setValue("q1", "value0");
    expect(survey.getValue("q1"), "onValueChanging event allows to change value").toBe("value");
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
    expect(questionName, "question name #1").toBe("q1");
    expect(q1.comment, "comment value #1").toBe("abc");
    expect(newComment, "newComment #1").toBe("abc");
    q1.comment = "abcd";
    expect(q1.comment, "comment value #2").toBe("abcd");
    expect(newComment, "newComment #2").toBe("abcd");
    expect(oldComment, "newComment #2").toBe("abc");
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
    expect(counter, "counter #1").toBe(1);
    expect(q1.comment, "comment value #1").toBe("abc");
    q1.comment = "";
    expect(questionName, "question.name #2").toBe("q1");
    expect(oldComment, "oldComment #2").toBe("abc");
    expect(newComment, "newComment #2").toBe("abc");
    expect(counter, "counter #2").toBe(2);
    expect(q1.comment, "comment value #2").toBe("abc");
    expect(survey.getComment("q1"), "survey.getComment value #2").toBe("abc");
    expect(onValueChangedValue, "onValueChanged options.value").toBe("abc");
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
    expect(q1.value, "The value is 1").toBe(1);
    q1.clearValue();
    expect(q1.value, "The value is still 1, onValueChanging does not allow to change the value").toBe(1);
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
    expect(item1.value, "Check1. data was set correctly").toBe("1");
    item2.value = "2";
    expect(item2.value, "Check2. data was set correctly").toBe("2");
    multiTextQuestion.items = [];
    item1 = multiTextQuestion.addItem("item1");
    item1.value = "3";
    expect(item1.value, "Check3. data was set correctly").toBe("3");
    multiTextQuestion.items.splice(0, 0, item2);
    item2.value = "4";
    expect(item2.value, "Check4. data was set correctly").toBe("4");
  });
  test("Multiple Text required items", () => {
    var survey = twoPageSimplestSurvey();
    var multiTextQuestion = new QuestionMultipleTextModel("multitext");
    survey.pages[0].addQuestion(multiTextQuestion);
    var item1 = multiTextQuestion.addItem("item1");
    var item2 = multiTextQuestion.addItem("item2");
    item1.isRequired = true;
    expect(item1.fullTitle, "Add isRequired Text").toBe("item1");
    expect(item2.fullTitle, "there is no isRequired Text").toBe("item2");
    expect(multiTextQuestion.validate(), "item1 is required and it is empty").toBe(false);
    item1.value = 1;
    expect(multiTextQuestion.validate(), "item1 is required and it has a value").toBe(true);
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
    expect(survey.state, "The survey is completed").toBe("completed");
    expect(counter, "onComplete calls one time").toBe(1);
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

    expect(name, "onVisibleChanged event, property name is correct").toBe("question1");
    expect(visibility, "onVisibleChanged event, property visibility is correct").toBe(false);
    expect(counter, "onVisibleChanged event is called one time").toBe(1);

    survey.getQuestionByName("question1").visible = true;
    expect(name, "onVisibleChanged event, property name is correct").toBe("question1");
    expect(visibility, "onVisibleChanged event, property visibility is correct").toBe(true);
    expect(counter, "onVisibleChanged event is called two time").toBe(2);

    survey.getQuestionByName("question1").visible = true;
    expect(counter, "onVisibleChanged event is called two time").toBe(2);
  });
  test("Question visibleIndex", () => {
    var survey = twoPageSimplestSurvey();
    survey.showQuestionNumbers = "on";
    expect((<Question>survey.getQuestionByName("question1")).visibleIndex, "the first question").toBe(0);
    expect((<Question>survey.getQuestionByName("question3")).visibleIndex, "the third question").toBe(2);
    survey.getQuestionByName("question1").visible = false;
    expect((<Question>survey.getQuestionByName("question3")).visibleIndex, "the third question is now visible as second").toBe(1);
    survey.getQuestionByName("question1").visible = true;
    expect((<Question>survey.getQuestionByName("question3")).visibleIndex, "the third question is third again").toBe(2);
    survey.getQuestionByName("question1").showNumber = false;
    expect((<Question>survey.getQuestionByName("question1")).visibleIndex, "Hide the number").toBe(-1);
    expect((<Question>survey.getQuestionByName("question3")).visibleIndex, "the first question number is hidden").toBe(1);
    survey.getQuestionByName("question1").showNumber = true;
    survey.getQuestionByName("question1").visible = false;
    survey.showQuestionNumbers = "off";
    expect((<Question>survey.getQuestionByName("question1")).visibleIndex, "off:the first question").toBe(-1);
    expect((<Question>survey.getQuestionByName("question2")).visibleIndex, "off:the second question").toBe(-1);
    expect((<Question>survey.getQuestionByName("question3")).visibleIndex, "off:the third question").toBe(-1);
    survey.showQuestionNumbers = "onPage";
    expect((<Question>survey.getQuestionByName("question1")).visibleIndex, "onPage:the first question").toBe(-1);
    expect((<Question>survey.getQuestionByName("question2")).visibleIndex, "onPage:the second question").toBe(0);
    expect((<Question>survey.getQuestionByName("question3")).visibleIndex, "onPage:the third question").toBe(0);
  });
  test("Question visibleIndex, add-remove questions", () => {
    var survey = new SurveyModel();
    survey.showQuestionNumbers = "on";
    var page = survey.addNewPage("p1");
    var q1 = new QuestionTextModel("q1");
    page.elements.push(q1);
    page.elements.push(new QuestionTextModel("q2"));
    expect((<Question>survey.getQuestionByName("q1")).visibleIndex, "the first question").toBe(0);
    expect((<Question>survey.getQuestionByName("q2")).visibleIndex, "the second question").toBe(1);
    var q3 = new QuestionTextModel("q3");
    page.elements.splice(0, 1, q3);
    expect((<Question>survey.getQuestionByName("q3")).visibleIndex, "the first question").toBe(0);
    expect((<Question>survey.getQuestionByName("q2")).visibleIndex, "the second question").toBe(1);
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
    expect(visibleIndex, "visible index should be 0").toBe(0);
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
    expect(q2.visibleIndex, "second quesiton").toBe(1);
    expect(q4.visibleIndex, "fourth quesiton").toBe(3);
    panel.title = "Some text";
    expect(panel.visibleIndex, "Panel title is empty").toBe(-1);
    expect(panel.no, "Panel no property,  title is empty").toBe("");
    panel.showNumber = true;
    expect(panel.visibleIndex, "Panel has visibleIndex").toBe(1);
    expect(panel.no, "Panel no property").toBe("2.");
    expect(q2.visibleIndex, "second quesiton + panel has index").toBe(2);
    expect(q4.visibleIndex, "fourth quesiton + panel has index").toBe(4);
    panel.showQuestionNumbers = "off";
    expect(q2.visibleIndex, "second quesiton + panel has index, questions inside panel have not numbering").toBe(-1);
    expect(q3.visibleIndex, "third quesiton + panel has index, questions inside panel have not numbering").toBe(-1);
    expect(q4.visibleIndex, "fourth quesiton + panel has index, questions inside panel have not numbering").toBe(2);
    panel.showQuestionNumbers = "onpanel";
    expect(q2.visibleIndex, "second quesiton + panel has index, questions inside panel have its own numbering").toBe(0);
    expect(q3.visibleIndex, "third quesiton + panel has index, questions  inside panel have its own numbering").toBe(1);
    expect(q4.visibleIndex, "fourth quesiton + panel has index, questions  inside panel have its own numbering").toBe(2);
    panel.showNumber = false;
    expect(panel.visibleIndex, "Panel showNumber is false").toBe(-1);
    expect(panel.no, "Panel no property,  showNumber is false").toBe("");
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
    expect(q2.visibleIndex, "second quesiton + panel has index, questions inside panel have its own numbering").toBe(0);
    expect(q3.visibleIndex, "third quesiton + panel has index, questions  inside panel have its own numbering").toBe(1);
    expect(q4.visibleIndex, "fourth quesiton + panel has index, questions  inside panel have its own numbering").toBe(0);
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
    expect(q1.no, "the first question").toBe("1)");
    expect(q2.no, "second quesiton").toBe("B.");
    expect(q3.no, "the thrid question").toBe("C.");
    expect(q4.no, "the fourth question").toBe("4)");
    panel.showQuestionNumbers = "onpanel";
    expect(q2.no, "second quesiton, onpanel").toBe("A.");
    expect(q3.no, "the thrid question, onpanel").toBe("B.");
    expect(q4.no, "the fourth question, onpanel").toBe("2)");
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
    expect(nestedPanel.no, "use panel questionStartIndex").toBe("A.");
  });
  test("showQuestionNumbers - accept bool values", () => {
    var survey = twoPageSimplestSurvey();
    survey.showQuestionNumbers = "on";
    expect(survey.showQuestionNumbers).toBe("on");
    survey.showQuestionNumbers = false as any;
    expect(survey.showQuestionNumbers).toBe("off");
    survey.showQuestionNumbers = true as any;
    expect(survey.showQuestionNumbers).toBe("on");
  });
  test("showQuestionNumbers - question fullTitle", () => {
    var survey = twoPageSimplestSurvey();
    survey.showQuestionNumbers = "on";
    expect((<Question>survey.getQuestionByName("question1"))["no"]).toBe("1.");
    expect((<Question>survey.getQuestionByName("question1")).fullTitle, "the first question showQuestionNumbers=on").toBe("question1");
    expect((<Question>survey.getQuestionByName("question3"))["no"]).toBe("3.");
    expect((<Question>survey.getQuestionByName("question3")).fullTitle, "the thrid question showQuestionNumbers=on").toBe("question3");
    survey.showQuestionNumbers = "onPage";
    expect((<Question>survey.getQuestionByName("question1"))["no"]).toBe("1.");
    expect((<Question>survey.getQuestionByName("question1")).fullTitle, "the first question showQuestionNumbers=onPage").toBe("question1");
    expect((<Question>survey.getQuestionByName("question3"))["no"]).toBe("1.");
    expect((<Question>survey.getQuestionByName("question3")).fullTitle, "the thrid question showQuestionNumbers=onPage").toBe("question3");
    survey.showQuestionNumbers = "off";
    expect((<Question>survey.getQuestionByName("question1"))["no"]).toBe("");
    expect((<Question>survey.getQuestionByName("question1")).fullTitle, "the first question showQuestionNumbers=onPage").toBe("question1");
    expect((<Question>survey.getQuestionByName("question3"))["no"]).toBe("");
    expect((<Question>survey.getQuestionByName("question3")).fullTitle, "the thrid question showQuestionNumbers=onPage").toBe("question3");
  });
  test("Question visibleIndex and no title question", () => {
    var survey = twoPageSimplestSurvey();
    survey.showQuestionNumbers = "on";
    expect((<Question>survey.getQuestionByName("question1")).visibleIndex, "the first question").toBe(0);
    expect((<Question>survey.getQuestionByName("question3")).visibleIndex, "the third question").toBe(2);
    var question = new QuestionHtmlModel("html1");
    survey.pages[0].addQuestion(question, 0);
    expect((<Question>survey.getQuestionByName("html1")).visibleIndex, "html question").toBe(-1);
    expect((<Question>survey.getQuestionByName("question1")).visibleIndex, "the first question + html question").toBe(0);
    expect((<Question>survey.getQuestionByName("question3")).visibleIndex, "the third question + html question").toBe(2);
  });
  test("Pages visibleIndex and num", () => {
    var survey = twoPageSimplestSurvey();
    survey.addNewPage("page 3").addNewQuestion("text", "q4");
    expect(survey.pages[0].visibleIndex, "start:page 1").toBe(0);
    expect(survey.pages[1].visibleIndex, "start:page 2").toBe(1);
    expect(survey.pages[2].visibleIndex, "start:page 3").toBe(2);
    expect(survey.pages[0].num, "start:page 1, num").toBe(1);
    expect(survey.pages[1].num, "start:page 2, num").toBe(2);
    expect(survey.pages[2].num, "start:page 3, num").toBe(3);

    survey.pages[0].visible = false;
    expect(survey.pages[0].visibleIndex, "page[0].visible=false:page 1").toBe(-1);
    expect(survey.pages[1].visibleIndex, "page[0].visible=false:page 2").toBe(0);
    expect(survey.pages[2].visibleIndex, "page[0].visible=false:page 3").toBe(1);
    expect(survey.pages[0].num, "page[0].visible=false:page 1, num").toBe(-1);
    expect(survey.pages[1].num, "page[0].visible=false:page 2, num").toBe(1);
    expect(survey.pages[2].num, "page[0].visible=false:page 3, num").toBe(2);
  });
  test("Pages num", () => {
    var survey = twoPageSimplestSurvey();
    expect(survey.pages[0]["canShowPageNumber"](), "false:the first page: can't show page number").toBe(false);
    expect(survey.pages[0].num, "the first page").toBe(1);
    expect(survey.pages[1]["canShowPageNumber"](), "false:the first page: can't show page number").toBe(false);
    expect(survey.pages[1].num, "the second page").toBe(2);

    survey.showPageNumbers = true;
    expect(survey.pages[0]["canShowPageNumber"](), "true:the first page: can show page number").toBe(true);
    expect(survey.pages[0].num, "the first page").toBe(1);
    expect(survey.pages[1]["canShowPageNumber"](), "true:the first page: can show page number").toBe(true);
    expect(survey.pages[1].num, "the second page").toBe(2);
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
    expect(survey.currentPage.visibleIndex, "Get server error").toBe(0);
    survey.setValue("question1", 10);
    survey.nextPage();
    expect(survey.currentPage.visibleIndex, "No errors server error").toBe(1);
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
    expect(survey.currentPage.visibleIndex, "Get server error").toBe(0);
    survey.setValue("question1", 10);
    survey.nextPage();
    expect(survey.currentPage.visibleIndex, "No errors server error").toBe(1);
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
    expect(survey.currentPage.visibleIndex, "The validation is not finished yet").toBe(0);
    opt.complete();
    expect(counter, "server validation should be called one time").toBe(1);
    expect(survey.currentPage.visibleIndex, "Validation on next page is completed").toBe(1);
    survey.tryComplete();
    survey.tryComplete();
    expect(survey.currentPage.visibleIndex, "The validation on complete is not finished yet").toBe(1);
    opt.complete();
    expect(counter, "server validation should be called two times").toBe(2);
    expect(survey.state, "Validation is completed").toBe("completed");
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
    expect(errorCount, "There is no errors yet").toBe(0);
    opt.errors["question1"] = "Server error";
    opt.complete();
    expect(errorCount, "There is one error").toBe(1);
  });

  test("onVisibleChanged call validation", () => {
    var survey = twoPageSimplestSurvey();
    survey.onValidateQuestion.add(function (sender, options) {
      if (options.name == "question1" && options.value > 100) {
        options.error = "Question 1 should be higher than 100";
      }
    });

    expect(survey.isCurrentPageHasErrors, "There is no error if the value is empty").toBe(false);
    survey.setValue("question1", 1);
    expect(survey.isCurrentPageHasErrors, "the value is less than 100").toBe(false);
    survey.setValue("question1", 101);
    expect(survey.isCurrentPageHasErrors, "the value is more than 100, has errors").toBe(true);
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

    expect(survey.isCurrentPageHasErrors, "failed, values are undefined : 10 < q1.value + q2.value < 100").toBe(true);
    expect(counter, "onValidatePanel calls one time").toBe(1);
    q1.value = 5;
    q2.value = 50;
    expect(survey.isCurrentPageHasErrors, "passed: 5 + 50, 10 < q1.value + q2.value < 100").toBe(false);
    expect(counter, "onValidatePanel calls two time").toBe(2);
    q1.value = 55;

    expect(survey.isCurrentPageHasErrors, "failed: 55 + 50, 10 < q1.value + q2.value < 100").toBe(true);
    expect(counter, "onValidatePanel calls three time").toBe(3);
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

    expect(survey.isCurrentPageHasErrors, "failed, values are undefined : 10 < q1.value + q2.value < 100").toBe(true);
    expect(panel.errors.length, "panel.errors, #1").toBe(1);
    q1.value = 5;
    q2.value = 50;
    expect(survey.isCurrentPageHasErrors, "passed: 5 + 50, 10 < q1.value + q2.value < 100").toBe(false);
    expect(panel.errors.length, "panel.errors, #2").toBe(0);
    q1.value = 55;
    expect(survey.isCurrentPageHasErrors, "failed: 55 + 50, 10 < q1.value + q2.value < 100").toBe(true);
    expect(panel.errors.length, "panel.errors, #3").toBe(1);
  });
  test("isCurrentPageHasErrors, required question in the invisible panel, #325", () => {
    var survey = twoPageSimplestSurvey();
    var panel = survey.pages[0].addNewPanel("panel");
    var requiredQuestion = <QuestionTextModel>(
      panel.addNewQuestion("text", "requriedQuestion")
    );
    requiredQuestion.isRequired = true;

    expect(survey.isCurrentPageHasErrors, "requiredQuestion value is empty").toBe(true);
    panel.visible = false;
    expect(survey.isCurrentPageHasErrors, "requiredQuestion value is empty, but the parent panel is invisible").toBe(false);
  });

  test("Page visibility", () => {
    var page = new PageModel("page");
    expect(page.isVisible, "page is invisible if there is no questions in it").toBe(false);
    page.addNewQuestion("text", "q1");
    expect(page.isVisible, "there is one question").toBe(true);
    page.visible = false;
    expect(page.isVisible, "we made the page invisible").toBe(false);
    page.visible = true;
    expect(page.isVisible, "we made the page visible").toBe(true);
    page.questions[0].visible = false;
    expect(page.isVisible, "there is no visible questions on the page").toBe(false);
    page.questions[0].visible = true;
    expect(page.isVisible, "we have made the question visible again").toBe(true);
  });
  test("Survey visiblePages and start using them", () => {
    var survey = twoPageSimplestSurvey();
    expect(survey.visiblePages.length, "All pages are visible").toBe(2);
    expect(survey.currentPage.name, "the first page is current").toBe("Page 1");
    survey.pages[0].visible = false;
    expect(survey.visiblePages.length, "The first page becomes invisible").toBe(1);
    expect(survey.currentPage.name, "the second page is current, because the first is invisible").toBe("Page 2");
  });
  test("Survey visiblePages, make second and third invisbile and go the last page on next", () => {
    var survey = twoPageSimplestSurvey();
    survey.currentPage = survey.pages[0];
    survey.addNewPage("Page 3").addNewQuestion("text", "p3q1");
    survey.addNewPage("Page 4").addNewQuestion("text", "p4q1");
    survey.pages[1].visible = false;
    survey.pages[2].questions[0].visible = false;
    survey.nextPage();
    expect(survey.currentPage.name, "Bypass two invisible pages").toBe("Page 4");
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
    expect(survey.getQuestionByName("question2").visible, "It is invisible now").toBe(false);
    expect(survey.pages[1].visible, "It is invisible now").toBe(false);

    survey.setValue("question1", "Hello");
    expect(survey.getQuestionByName("question2").visible, "trigger makes it visible").toBe(true);
    expect(survey.pages[1].visible, "trigger makes it visible").toBe(true);

    survey.setValue("question2", "He");
    expect(survey.getQuestionByName("question2").visible, "trigger should not be called").toBe(true);
    expect(survey.pages[1].visible, "trigger should not be called").toBe(true);
  });
  test("Complete trigger test", () => {
    var survey = twoPageSimplestSurvey();
    var trigger = new SurveyTriggerComplete();
    survey.triggers.push(trigger);
    trigger.name = "question1";
    trigger.value = "Hello";

    survey.setValue("question1", "H");
    expect(survey.state).toBe("running");

    survey.setValue("question1", "Hello");
    expect(survey.state).toBe("running");
    survey.nextPage();
    expect(survey.state).toBe("completed");
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
    expect(survey.state).toBe("running");
    expect(survey.isCompleteButtonVisible, "complete button is visible").toBe(true);
    expect(survey.isShowNextButton, "next button is invisible").toBe(false);
    survey.tryComplete();
    expect(survey.state).toBe("completed");
    expect(isCompleteOnTrigger_Completing, "isCompleteOnTrigger property works for onCompleting event").toBe(true);
    expect(isCompleteOnTrigger_Complete, "isCompleteOnTrigger property works for onCompleted event").toBe(true);
    survey.clear();
    survey.nextPage();
    survey.tryComplete();
    expect(isCompleteOnTrigger_Completing, "isCompleteOnTrigger property works for onCompleting event, #2").toBe(false);
    expect(isCompleteOnTrigger_Complete, "isCompleteOnTrigger property works for onCompleted event, #2").toBe(false);
  });
  test("Complete trigger test, settings.executeCompleteTriggerOnValueChanged", () => {
    settings.executeCompleteTriggerOnValueChanged = true;
    var survey = twoPageSimplestSurvey();
    var trigger = new SurveyTriggerComplete();
    survey.triggers.push(trigger);
    trigger.name = "question1";
    trigger.value = "Hello";

    survey.setValue("question1", "H");
    expect(survey.state).toBe("running");

    survey.setValue("question1", "Hello");
    expect(survey.state).toBe("completed");
    settings.executeCompleteTriggerOnValueChanged = false;
  });
  test("CompleteTrigger.toString()", () => {
    var trigger = new SurveyTriggerComplete();
    trigger.name = "question1";
    trigger.value = "Hello";
    expect(trigger.toString(), "toString function returns correct value").toBe("complete, {question1} equal 'Hello'");
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
    expect(survey.state).toBe("running");

    survey.setValue("matrix", { "row 1": "column 2" });
    expect(survey.state).toBe("running");
    survey.nextPage();
    expect(survey.state).toBe("completed");
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
    expect(changingOldPage.name, "first nextPage: oldCurrentPage").toBe("Page 1");
    expect(changingNewPage.name, "first nextPage: newCurrentPage").toBe("Page 2");
    expect(changingCounter, "first nextPage: called one time").toBe(1);
    expect(changingBeforeChanged, "first nextPage: called before changed").toBe(2);
    survey.prevPage();
    expect(changingOldPage.name, "first prevPage: oldCurrentPage").toBe("Page 2");
    expect(changingNewPage.name, "first prevPage: newCurrentPage").toBe("Page 1");
    expect(changingCounter, "first prevPage: called two time").toBe(2);
    expect(changingBeforeChanged, "first prevPage: called before changed").toBe(2);
  });

  test("survey.onCurrentPageChanging/Changed + isNextPage/isPrevPage/isGoingForward/isGoingBackward", () => {
    const survey = twoPageSimplestSurvey();
    survey.addNewPage("page3");
    survey.pages[2].addNewQuestion("text", "q5");
    survey.addNewPage("page4");
    survey.pages[3].addNewQuestion("text", "q6");
    expect(survey.visiblePageCount, "There are 4 pages").toBe(4);
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
    expect(isNextPageChangedCounter, "isNextPageChangedCounter, nextPage").toBe(1);
    expect(isPrevPageChangedCounter, "isPrevPageChangedCounter, nextPage").toBe(0);
    expect(isNextPageChangingCounter, "isNextPageChangingCounter, nextPage").toBe(1);
    expect(isPrevPageChangingCounter, "isPrevPageChangingCounter, nextPage").toBe(0);
    expect(isGoingForwardPageChangingCounter, "isGoingForwardPageChangingCounter, nextPage").toBe(1);
    expect(isGoingBackwardPageChangingCounter, "isGoingBackwardPageChangingCounter, nextPage").toBe(0);
    expect(isGoingForwardPageChangedCounter, "isGoingForwardPageChangedCounter, nextPage").toBe(1);
    expect(isGoingBackwardPageChangedCounter, "isGoingBackwardPageChangedCounter, nextPage").toBe(0);
    survey.prevPage();
    expect(isNextPageChangedCounter, "isNextPageChangedCounter, nextPage/prevPage").toBe(1);
    expect(isPrevPageChangedCounter, "isPrevPageChangedCounter, nextPage/prevPage").toBe(1);
    expect(isNextPageChangingCounter, "isNextPageChangingCounter, nextPage/prevPage").toBe(1);
    expect(isPrevPageChangingCounter, "isPrevPageChangingCounter, nextPage/prevPage").toBe(1);
    expect(isGoingForwardPageChangingCounter, "isGoingForwardPageChangingCounter, nextPage/prevPage").toBe(1);
    expect(isGoingBackwardPageChangingCounter, "isGoingBackwardPageChangingCounter, nextPage/prevPage").toBe(1);
    expect(isGoingForwardPageChangedCounter, "isGoingForwardPageChangedCounter, nextPage/prevPage").toBe(1);
    expect(isGoingBackwardPageChangedCounter, "isGoingBackwardPageChangedCounter, nextPage/prevPage").toBe(1);
    survey.currentPageNo = 3;
    expect(survey.currentPage.name, "goes to have 3").toBe("page4");
    expect(isNextPageChangedCounter, "isNextPageChangedCounter, nextPage/prevPage/currentPageNo=3").toBe(1);
    expect(isPrevPageChangedCounter, "isPrevPageChangedCounter, nextPage/prevPage/currentPageNo=3").toBe(1);
    expect(isNextPageChangingCounter, "isNextPageChangingCounter, nextPage/prevPage/currentPageNo=3").toBe(1);
    expect(isPrevPageChangingCounter, "isPrevPageChangingCounter, nextPage/prevPage/currentPageNo=3").toBe(1);
    expect(isGoingForwardPageChangingCounter, "isGoingForwardPageChangingCounter, nextPage/prevPage/currentPageNo=3").toBe(2);
    expect(isGoingBackwardPageChangingCounter, "isGoingBackwardPageChangingCounter, nextPage/prevPage/currentPageNo=3").toBe(1);
    expect(isGoingForwardPageChangedCounter, "isGoingForwardPageChangedCounter, nextPage/prevPage/currentPageNo=3").toBe(2);
    expect(isGoingBackwardPageChangedCounter, "isGoingBackwardPageChangedCounter, nextPage/prevPage/currentPageNo=3").toBe(1);
    survey.currentPageNo = 1;
    expect(isNextPageChangedCounter, "isNextPageChangedCounter, nextPage/prevPage/currentPageNo=3/currentPageNo=1").toBe(1);
    expect(isPrevPageChangedCounter, "isPrevPageChangedCounter, nextPage/prevPage/currentPageNo=3/currentPageNo=1").toBe(1);
    expect(isNextPageChangingCounter, "isNextPageChangingCounter, nextPage/prevPage/currentPageNo=3/currentPageNo=1").toBe(1);
    expect(isPrevPageChangingCounter, "isPrevPageChangingCounter, nextPage/prevPage/currentPageNo=3/currentPageNo=1").toBe(1);
    expect(isGoingForwardPageChangingCounter, "isGoingForwardPageChangingCounter, nextPage/prevPage/currentPageNo=3/currentPageNo=1").toBe(2);
    expect(isGoingBackwardPageChangingCounter, "isGoingBackwardPageChangingCounter, nextPage/prevPage/currentPageNo=3/currentPageNo=1").toBe(2);
    expect(isGoingForwardPageChangedCounter, "isGoingForwardPageChangedCounter, nextPage/prevPage/currentPageNo=3/currentPageNo=1").toBe(2);
    expect(isGoingBackwardPageChangedCounter, "isGoingBackwardPageChangedCounter, nextPage/prevPage/currentPageNo=3/currentPageNo=1").toBe(2);
    survey.currentPageNo = 0;
    expect(isNextPageChangedCounter, "isNextPageChangedCounter, nextPage/prevPage/currentPageNo=3/currentPageNo=1/currentPageNo=0").toBe(1);
    expect(isPrevPageChangedCounter, "isPrevPageChangedCounter, nextPage/prevPage/currentPageNo=3/currentPageNo=1/currentPageNo=0").toBe(2);
    expect(isNextPageChangingCounter, "isNextPageChangingCounter, nextPage/prevPage/currentPageNo=3/currentPageNo=1/currentPageNo=0").toBe(1);
    expect(isPrevPageChangingCounter, "isPrevPageChangingCounter, nextPage/prevPage/currentPageNo=3/currentPageNo=1/currentPageNo=0").toBe(2);
    expect(isGoingForwardPageChangingCounter, "isGoingForwardPageChangingCounter, nextPage/prevPage/currentPageNo=3/currentPageNo=1/currentPageNo=0").toBe(2);
    expect(isGoingBackwardPageChangingCounter, "isGoingBackwardPageChangingCounter, nextPage/prevPage/currentPageNo=3/currentPageNo=1/currentPageNo=0").toBe(3);
    expect(isGoingForwardPageChangedCounter, "isGoingForwardPageChangedCounter, nextPage/prevPage/currentPageNo=3/currentPageNo=1/currentPageNo=0").toBe(2);
    expect(isGoingBackwardPageChangedCounter, "isGoingBackwardPageChangedCounter, nextPage/prevPage/currentPageNo=3/currentPageNo=1/currentPageNo=0").toBe(3);
  });

  test("survey.onCurrentPageChanging, allowChanging option", () => {
    var survey = twoPageSimplestSurvey();
    //get current Page
    survey.currentPage;
    var allowChanging = false;
    survey.onCurrentPageChanging.add(function (survey, options) {
      options.allowChanging = allowChanging;
    });
    expect(survey.currentPageNo, "The first page").toBe(0);
    survey.nextPage();
    expect(survey.currentPageNo, "Still the first page").toBe(0);
    allowChanging = true;
    survey.nextPage();
    expect(survey.currentPageNo, "The second page").toBe(1);
    allowChanging = false;
    survey.prevPage();
    expect(survey.currentPageNo, "Still the second page").toBe(1);
    allowChanging = true;
    survey.prevPage();
    expect(survey.currentPageNo, "The second page again").toBe(0);
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
      expect(survey.currentPageNo, "The first page").toBe(0);
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
      expect(survey.currentPageNo, "Still the first page, we are waiting for a callback").toBe(0);
      expect(survey.getPropertyValue("isNavigationBlocked"), "isCurrentPageChanging = true, #1").toBe(true);
      expect(nextAction.enabled, "next action is disabled during navigation, #1").toBe(false);
      await vi.advanceTimersByTimeAsync(0);
      expect(survey.getPropertyValue("isNavigationBlocked"), "isCurrentPageChanging = false, #1").toBe(false);
      expect(survey.currentPageNo, "The second page").toBe(1);
      expect(nextAction.enabled, "next action is enabled after navigation, #1").toBe(true);

      allowChanging = false;
      survey.nextPage();
      expect(survey.getPropertyValue("isNavigationBlocked"), "isCurrentPageChanging = true, #2").toBe(true);
      expect(nextAction.enabled, "next action is disabled during navigation, #2").toBe(false);
      expect(prevAction.enabled, "prev action is disabled during navigation, #2").toBe(false);
      expect(survey.currentPageNo, "Still the second page, we are waiting for a callback").toBe(1);
      await vi.advanceTimersByTimeAsync(0);
      expect(survey.getPropertyValue("isNavigationBlocked"), "isCurrentPageChanging = false, #2").toBe(false);
      expect(nextAction.enabled, "next action is enabled after navigation, #2").toBe(true);
      expect(prevAction.enabled, "prev action is enabled after navigation, #2").toBe(true);
      expect(survey.currentPageNo, "We do not move from the second page").toBe(1);

      expect(messages, "There is no messages yet").toEqual([]);
      messageToShow = "Test error";
      allowChanging = false;
      survey.nextPage();
      await vi.advanceTimersByTimeAsync(0);
      allowChanging = true;
      messageToShow = "Saving text";
      survey.nextPage();
      await vi.advanceTimersByTimeAsync(0);
      expect(messages).toEqual([
        { message: "Test error", type: "error" },
        { message: "Saving text", type: "success" }
      ]);
      expect(survey.currentPageNo, "We are on the last page now").toBe(2);
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
      expect(survey.state, "Survey is not completed yet, we are waiting for a callback").toBe("running");
      expect(survey.getPropertyValue("isNavigationBlocked"), "isCurrentPageChanging = true, #1").toBe(true);
      expect(completeAction.enabled, "next action is disabled during navigation, #1").toBe(false);
      await vi.advanceTimersByTimeAsync(0);
      expect(survey.getPropertyValue("isNavigationBlocked"), "isCurrentPageChanging = false, #1").toBe(false);
      expect(survey.state, "Do not allow complete").toBe("running");
      expect(completeAction.enabled, "next action is enabled after navigation, #1").toBe(true);

      allowComplete = true;
      messageToShow = "Test success on complete";
      survey.tryComplete();
      expect(survey.getPropertyValue("isNavigationBlocked"), "isCurrentPageChanging = true, #2").toBe(true);
      expect(completeAction.enabled, "next action is disabled during navigation, #2").toBe(false);
      expect(survey.state, "Do not allow complete #2").toBe("running");
      await vi.advanceTimersByTimeAsync(0);
      expect(survey.getPropertyValue("isNavigationBlocked"), "isCurrentPageChanging = false, #2").toBe(false);
      expect(completeAction.enabled, "next action is enabled after navigation, #2").toBe(true);
      expect(survey.state, "Survey is completed now").toBe("completed");
      expect(messages).toEqual([
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
    expect(survey.currentPageNo, "The first page").toBe(0);
    survey.nextPage();
    expect(survey.currentPageNo, "Still the first page").toBe(0);
    allowChanging = true;
    survey.nextPage();
    expect(survey.currentPageNo, "The second page").toBe(1);
    allowChanging = false;
    survey.prevPage();
    expect(survey.currentPageNo, "Still the second page").toBe(1);
    allowChanging = true;
    survey.prevPage();
    expect(survey.currentPageNo, "The second page again").toBe(0);
  });

  test("survey.onCompleting, allow option", () => {
    var survey = twoPageSimplestSurvey();
    var allowComplete = false;
    survey.onCompleting.add(function (survey, options) {
      options.allow = allowComplete;
    });
    expect(survey.state, "It is running").toBe("running");
    survey.doComplete();
    expect(survey.state, "It is still running").toBe("running");
    allowComplete = true;
    survey.doComplete();
    expect(survey.state, "It is completed now").toBe("completed");
  });

  test("survey.onCompleting, allow option (use it instead of allowComplete)", () => {
    var survey = twoPageSimplestSurvey();
    var allowComplete = false;
    survey.onCompleting.add(function (survey, options) {
      options.allow = allowComplete;
    });
    expect(survey.state, "It is running").toBe("running");
    survey.doComplete();
    expect(survey.state, "It is still running").toBe("running");
    allowComplete = true;
    survey.doComplete();
    expect(survey.state, "It is completed now").toBe("completed");
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
    expect(onCompleteCounter, "onComplete fired one time").toBe(1);
    expect(onCurrentPageChangedCounter, "onCurrentPageChanged fired one time").toBe(0);
    expect(firstFiredEvent, "should be called first").toBe("onComplete");
  });
  test("Value trigger test", () => {
    const survey = twoPageSimplestSurvey();
    const trigger = new SurveyTriggerSetValue();
    survey.triggers.push(trigger);
    trigger.name = "question1";
    trigger.value = "Hello";
    trigger.setToName = "name1";
    trigger.setValue = "val1";
    expect(survey.getValue("name1"), "value is not set").toBeUndefined();
    survey.setValue("question1", "Hello");
    expect(survey.getValue("name1"), "value is set").toBe("val1");
  });
  test("Triggers shouldn't fire on data assignment", () => {
    var survey = twoPageSimplestSurvey();
    var trigger = new SurveyTriggerSetValue();
    survey.triggers.push(trigger);
    trigger.name = "question1";
    trigger.value = "Hello";
    trigger.setToName = "name1";
    trigger.setValue = "val1";
    expect(survey.getValue("name1"), "value is not set").toBeUndefined();
    survey.data = { question1: "Hello" };
    expect(survey.getValue("name1"), "value still is not set").toBeUndefined();
  });
  test("Value trigger test, setValue is empty, clear the data", () => {
    var survey = twoPageSimplestSurvey();
    var trigger = new SurveyTriggerSetValue();
    survey.triggers.push(trigger);
    trigger.expression = "{question1}='Hello'";
    trigger.setToName = "question2";
    survey.setValue("question2", "abc");
    expect(survey.getValue("question2"), "value is set").toBe("abc");
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
    expect(survey.getValue("name1"), "value is not set").toBeUndefined();
    survey.setValue("question1", "Hello");
    expect(survey.getValue("name1"), "value is set as expression").toBe(5);
    survey.setValue("question1", "Hello1");
    trigger.runExpression = "{val2}";
    survey.clearValue("val2");
    trigger.setToName = "";
    survey.setValue("question1", "Hello");
    expect(survey.getValue("name1"), "value is still 5").toBe(5);
  });
  test("Skip trigger test", () => {
    var survey = twoPageSimplestSurvey();
    var trigger = new SurveyTriggerSkip();
    survey.triggers.push(trigger);
    trigger.expression = "{question1} = 'Hello'";
    trigger.gotoName = "question4";
    expect(survey.currentPageNo, "the first page is active").toBe(0);
    survey.setValue("question1", "Hello");
    expect(survey.currentPageNo, "the second page is active now").toBe(1);
  });
  test("Skip trigger test", () => {
    settings.executeSkipTriggerOnValueChanged = false;
    var survey = twoPageSimplestSurvey();
    survey.addPage(createPageWithQuestion("p3", "q10"));
    var trigger = new SurveyTriggerSkip();
    survey.triggers.push(trigger);
    trigger.expression = "{question1} = 'Hello'";
    trigger.gotoName = "q10";
    expect(survey.currentPageNo, "the first page is active").toBe(0);
    survey.setValue("question1", "Hello");
    expect(survey.currentPageNo, "the first page is still active").toBe(0);
    survey.nextPage();
    expect(survey.currentPageNo, "the third page is active").toBe(2);
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
    expect(survey.state, "The survey is completed").toBe("completed");
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
    expect(q1.isVisible, "visibleIf works").toBe(true);
    expect(q1.isReadOnly, "enableIf works").toBe(false);
    expect(q1.value, "defaultValueExpression works").toBe(30);
    expect(q2.value, "expression works").toBe(25);

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

    expect(survey.getValue("question2"), "value is not set").toBeUndefined();
    survey.setValue("question1", "Hello");
    expect(survey.getValue("question2"), "value is set").toBe("CopiedValue");
  });
  test("String format", () => {
    var strResult = surveyLocalization.getString("textMinLength")["format"](10);
    expect(strResult, "The format string is working").toBe("Please enter at least 10 character(s).");
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
    expect(survey.data, "trigger copy the value correctly").toEqual({
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
    expect(survey.getValue("name1"), "value is not set").toBeUndefined();
    survey.setValue("question1", "Hello");
    expect(survey.getValue("name1"), "value is not set, waiting for callback").toBeUndefined();
    returnResult1(survey.getValue("question1"));
    expect(survey.getValue("name1"), "value is set").toBe("val1");
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

    expect(survey.getValue("name1"), "value is not set").toBeUndefined();
    survey.setValue("question1", "Hello");
    expect(survey.getValue("name1"), "value is not set, expression is not completed").toBeUndefined();
    returnResult1(survey.getValue("question1"));
    expect(survey.getValue("name1"), "value is not set, runExpression is not completed").toBeUndefined();
    returnResult2(survey.getValue("val1") + survey.getValue("val2"));
    expect(survey.getValue("name1"), "value is set as expression").toBe(5);

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
    expect(validator.validate("test=1@email.com", ""), "valid email").toBeNull();
    expect(validator.validate("test=1@ema=il.com", ""), "invalid email - = in domain name").not.toBeNull();
    expect(validator.validate("test=1@email.c=om", ""), "invalid email - = in domain suffix").not.toBeNull();
  });
  test("survey.getAllVariables()", () => {
    var survey = twoPageSimplestSurvey();
    survey.setVariable("user", "admin");
    survey.setVariable("type", "2");
    expect(survey.getVariableNames()).toEqual(["user", "type"]);
  });
  test("pre process title", () => {
    var survey = twoPageSimplestSurvey();
    survey.data = { name: "John" };
    survey.title = "Hello {name}";
    expect(survey.processedTitle, "process survey title correctly").toBe("Hello John");
    survey.pages[0].title = "Page {PageNo} from {PageCount}.";
    expect(survey.pages[0].processedTitle).toBe("Page 1 from 2.");
    survey.pages[0].addNewQuestion("text", "email");
    survey.setValue("email", "andrew.telnov@gmail.com");
    survey.setVariable("var1", "[it is var1]");
    survey.setValue("val1", "[it is val1]");
    survey.completedHtml = "<div>Your e-mail: <b>{email}</b>{var1}{val1}</div>";
    expect(survey.processedCompletedHtml).toBe("<div>Your e-mail: <b>andrew.telnov@gmail.com</b>[it is var1][it is val1]</div>");
  });
  test("pre process title where name with dot", () => {
    var survey = twoPageSimplestSurvey();
    survey.data = { "name.dot": "John" };
    survey.title = "Hello {name.dot}";
    expect(survey.processedTitle, "process survey title correctly").toBe("Hello John");
  });

  test("pre process title, 'locale' variable", () => {
    var survey = twoPageSimplestSurvey();
    survey.title = "The current locale is: '{locale}'";
    expect(survey.processedTitle, "process the locale correctly").toBe("The current locale is: 'en'");
    survey.locale = "fr";
    expect(survey.processedTitle, "process the locale correctly again").toBe("The current locale is: 'fr'");
  });

  test("pre process title with variables in Capital letters, bug#1099", () => {
    var survey = new SurveyModel();
    survey.setVariable("Var1", "[My variable]");
    survey.completedHtml = "Your Var1 is: {VaR1}";
    expect(survey.processedCompletedHtml).toBe("Your Var1 is: [My variable]");
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
    expect(survey.processedCompletedHtml).toBe("Year:2017");
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
    expect(survey.processedCompletedHtml).toBe("Year:2017");
  });

  test("question fullTitle", () => {
    var survey = twoPageSimplestSurvey();
    survey.showQuestionNumbers = "on";
    var question = <Question>survey.pages[0].questions[1];
    question.title = "My Title";
    expect(question.fullTitle).toBe("My Title");
    question.isRequired = true;
    expect(question.requiredMark).toBe("*");
    survey.questionStartIndex = "100";
    expect(question.no).toBe("101");
    survey.questionStartIndex = "100.";
    expect(question.no).toBe("101.");
    survey.questionStartIndex = "A";
    expect(question.no).toBe("B");
    survey.questionStartIndex = "A.";
    expect(question.no).toBe("B.");
    survey.questionStartIndex = "A";
    survey.questionTitleTemplate = "{no}) {title} ({require})";
    expect(question.no).toBe("B)");
    expect(question.requiredMark).toBe("(*)");
  });
  test("question.no and survey.questionStartIndex", () => {
    var survey = twoPageSimplestSurvey();
    survey.showQuestionNumbers = "on";
    var question = <Question>survey.pages[0].questions[1];
    expect(question.no).toBe("2.");
    survey.questionStartIndex = "100";
    expect(question.no).toBe("101");
    survey.questionStartIndex = "100.";
    expect(question.no).toBe("101.");
    survey.questionStartIndex = "A";
    expect(question.no).toBe("B");
    survey.questionStartIndex = "A.";
    expect(question.no).toBe("B.");
    survey.questionStartIndex = "10)";
    expect(question.no).toBe("11)");
    survey.questionStartIndex = "(10)";
    expect(question.no).toBe("(11)");
    survey.questionStartIndex = "# 1";
    expect(question.no).toBe("# 2");
    survey.questionStartIndex = "1.2";
    expect(question.no).toBe("1.3");
    survey.questionStartIndex = "1.01";
    expect(question.no).toBe("1.02");
    survey.onGetQuestionNumber.add(function (sender, options) {
      options.number = "a.b." + (options.question.visibleIndex + 1) + ")";
    });
    expect(question.no, "use event").toBe("a.b.2)");
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
    expect(q1.no, "q1, #1").toBe("1.1");
    expect(q2.no, "q2, #1").toBe("1.2");
    expect(q3.no, "q3, #1").toBe("2.1");
    expect(q4.no, "q4, #1").toBe("2.2");
    expect(panel.no, "panel, #1").toBe("2.3");
    expect(q5.no, "q5, #1").toBe("2.3.1");
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
    expect(q1.no, "q1, #1").toBe("1.1");
    expect(q2.no, "q2, #1").toBe("1.2");
    expect(q3.no, "q3, #1").toBe("2.1");
    expect(q4.no, "q4, #1").toBe("2.2");
    expect(panel.no, "panel, #1").toBe("2.3");
    expect(q5.no, "q5, #1").toBe("2.3.1");
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

    expect(q1.no, "q1, #1").toBe("1.1");
    expect(q2.no, "q2, #1").toBe("1.2");
    expect(p1.no, "panel, #1").toBe("1.3");
    expect(q3.no, "q3, #1").toBe("1.3 a");
    expect(q4.no, "q4, #1").toBe("1.3 b");
    expect(p2.no, "panel, #2").toBe("1.4");
    expect(q5.no, "q5, #1").toBe("1.4_a");
    expect(q6.no, "q6, #2").toBe("1.4_b");
    expect(p3.no, "panel, #3").toBe("1.5");
    expect(q7.no, "q7, #1").toBe("1.5#a");
    expect(q8.no, "q8, #2").toBe("1.5#b");
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

    expect(q1.no, "q1, #1").toBe("A.1");
    expect(q2.no, "q2, #1").toBe("A.2");
    expect(p1.no, "panel1, #1").toBe("A.3");
    expect(q3.no, "q3, #1").toBe("A.3.1");
    expect(q4.no, "q4, #1").toBe("A.3.2");
    expect(q5.no, "q5, #1").toBe("B.1");
    expect(p2.no, "panel2, #1").toBe("B.2");
    expect(q6.no, "q6, #1").toBe("B.2.1");
    expect(q7.no, "q7, #1").toBe("B.2.2");
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
    expect(survey.pages[0].no, "pages[0], #1").toBe("");
    expect(survey.pages[1].no, "pages[1], #1").toBe("2-");
    expect(survey.pages[2].no, "pages[2], #1").toBe("3-");
    expect(survey.pages[3].no, "pages[3], #1").toBe("4-");
    survey.pages[1].visible = false;
    expect(survey.pages[0].no, "pages[0], #2").toBe("");
    expect(survey.pages[1].no, "pages[1], #2").toBe("2-");
    expect(survey.pages[2].no, "pages[2], #2").toBe("3-");
    expect(survey.pages[3].no, "pages[3], #2").toBe("4-");
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
    expect(q2.visibleIndex, "titleLocation = 'hidden', default behavior").toBe(-1);
    expect(q2.no, "titleLocation = 'hidden'").toBe("");
    expect(q3.visibleIndex, "previous question titleLocation = 'hidden', default behavior").toBe(1);
    expect(q3.no, "previous question titleLocation = 'hidden'").toBe("2.");
    q1.visible = false;
    settings.setQuestionVisibleIndexForHiddenTitle = true;
    q1.visible = true;
    expect(q2.visibleIndex, "titleLocation = 'hidden', setQuestionVisibleIndexForHiddenTitle").toBe(1);
    expect(q2.no, "titleLocation = 'hidden', setQuestionVisibleIndexForHiddenTitle").toBe("");
    expect(q3.visibleIndex, "previous question titleLocation = 'hidden', default behavior, setQuestionVisibleIndexForHiddenTitle").toBe(2);
    expect(q3.no, "previous question titleLocation = 'hidden', setQuestionVisibleIndexForHiddenTitle").toBe("3.");
    settings.setQuestionVisibleIndexForHiddenTitle = false;

    q2.titleLocation = "default";
    q2.showNumber = false;
    expect(q2.visibleIndex, "showNumber = false, default behavior").toBe(-1);
    expect(q2.no, "titleLocation = 'hidden'").toBe("");
    expect(q3.visibleIndex, "previous question showNumber = false, default behavior").toBe(1);
    expect(q3.no, "previous question showNumber = false").toBe("2.");
    q1.visible = false;
    settings.setQuestionVisibleIndexForHiddenNumber = true;
    q1.visible = true;
    expect(q2.visibleIndex, "showNumber = false, setQuestionVisibleIndexForHiddenNumber").toBe(1);
    expect(q2.no, "showNumber = false, setQuestionVisibleIndexForHiddenNumber").toBe("");
    expect(q3.visibleIndex, "previous question showNumber = false, default behavior, setQuestionVisibleIndexForHiddenNumber").toBe(2);
    expect(q3.no, "previous question showNumber = false, setQuestionVisibleIndexForHiddenNumber").toBe("3.");
    settings.setQuestionVisibleIndexForHiddenNumber = false;
  });

  test("update survey.questionStartIndex and survey.requiredMark based on survey.questionTitleTemplate", () => {
    var survey = new SurveyModel();
    survey.questionTitleTemplate = "{no}) {title} {require}";
    expect(survey.questionStartIndex, "{no})").toBe("1)");
    survey.questionStartIndex = "a";
    survey.questionTitleTemplate = "{no}) {title} {require}";
    expect(survey.questionStartIndex, "{no}) + startIndex = 'a'").toBe("a)");
    survey.questionTitleTemplate = "{title} ({require})";
    expect(survey.requiredMark, "({require})").toBe("(*)");
    survey.requiredMark = "!!";
    survey.questionTitleTemplate = "{no}) {title} ({require})";
    expect(survey.requiredMark, "({require}) + !!").toBe("(!!)");
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
    expect(question1.value, "Clear value of an invisible question").toBeUndefined();
    expect(question2.value, "Keep value of a visible question").toBe("myValue");
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
    expect(survey.data, "The value should be keeped").toEqual({ value: 1 });
    survey.clear();
    q1.value = 2;
    q1.visible = false;
    survey.doComplete();
    expect(survey.data, "The value should be cleaned").toEqual({});
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
    expect(survey.data, "The value should be kept").toEqual({ q1: 1 });
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
    expect(survey.data, "There are many vlues yet").not.toEqual({ q3: "val3" });
    survey.doComplete();
    expect(survey.data, "There should be one value only").toEqual({ q3: "val3" });
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
    expect(survey.data, "There is no comment already").toEqual({ q1: 1 });
    survey.doComplete();
    expect(survey.data, "There no comment").toEqual({ q1: 1 });
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
    expect(dest).toEqual({ val: 1 });

    survey.doMergeValues({ val2: { val1: "str" } }, dest);
    expect({ val: 1, val2: { val1: "str" } }).toEqual(dest);

    survey.doMergeValues({ val2: { val2: 2 } }, dest);
    expect({ val: 1, val2: { val1: "str", val2: 2 } }).toEqual(dest);
    var a = "test";
    survey.doMergeValues({ val: 1 }, a);
    expect(a, "Do nothing if dest is string").toBe("test");
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
    expect(page.rows.length, "only one row").toBe(1);
    expect(page.rows[0].elements.length, "two elements in row").toBe(2);

    expect(page.rows[0].elements[0].rightIndent, "the first indent is 0").toBe(0);
    expect(page.rows[0].elements[1].rightIndent, "the second indent is 0").toBe(0);
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
    expect(survey.getAllQuestions()[0].templateElements[0].rightIndent, "the first indent is 0").toBe(0);

  });

  test("Rendered width with setting width in the same row, using calc", () => {
    var page = new PageModel();
    for (var i = 0; i < 5; i++) {
      page.addNewQuestion("text", "q" + (i + 1));
      page.questions[i].startWithNewLine = false;
    }
    expect(page.questions[1].renderWidth, "the width is 20%").toBe("20%");
    page.questions[1].width = "100";
    expect(page.questions[1].renderWidth, "the width in px").toBe("100px");
    page.questions[1].width = "120 px";
    expect(page.questions[1].renderWidth, "the width is not changed").toBe("120 px");
    page.questions[1].width = "10%";
    page.questions[2].width = "120";
    expect(page.questions[0].renderWidth, "Use calc() function").toBe("calc((100% - 10% - 120px)/3)");
    page.questions[3].visible = false;
    page.questions[4].visible = false;
    expect(page.questions[0].renderWidth, "Do not calc on 1").toBe("calc(100% - 10% - 120px)");
  });
  test("Rendered width when all widths for questions are set", () => {
    var page = new PageModel();
    page.addNewQuestion("text", "q1");
    var panel = page.addNewPanel("panel1");
    panel.startWithNewLine = false;
    panel.addNewQuestion("text", "q2");
    page.elements[0].width = "20em";
    expect(page.elements[0].renderWidth, "q1.renderedWidth").toBe("20em");
    expect(panel.renderWidth, "panel1.renderedWidth, calculated").toBe("calc(100% - 20em)");
    panel.width = "calc(100% - 40px)";
    expect(panel.renderWidth, "panel1.renderedWidth, from width").toBe("calc(100% - 40px)");
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
    expect(q1.renderWidth, "question.renderWidth is fine").toBe("120px");
    expect(panel1.width, "panel1.width loaded correctly").toBe("calc(90% - 130px)");
    expect(panel1.renderWidth, "panel.renderWidth is fine").toBe("calc(90% - 130px)");
  });
  test("Render width should work for strings only - https://surveyjs.answerdesk.io/ticket/details/T2273", () => {
    var page = new PageModel();
    var question = <any>page.addNewQuestion("text", "q1");
    question.width = 300;

    expect(question.renderWidth, "the render width is 100%").toBe("100%");
  });
  test("test autoAdvanceEnabled property", () => {
    var survey = twoPageSimplestSurvey();

    var dropDownQ = <QuestionDropdownModel>(
    survey.pages[1].addNewQuestion("dropdown", "question5")
  );
    dropDownQ.choices = [1, 2, 3];
    dropDownQ.showOtherItem = true;
    survey.autoAdvanceEnabled = true;
    expect(survey.currentPage.name, "the first page is default page").toBe(survey.pages[0].name);
    survey.setValue("question1", 1);
    survey.setValue("question2", 2);
    expect(survey.currentPage.name, "go to the second page automatically").toBe(survey.pages[1].name);
    (<Question>survey.currentPage.questions[0]).value = "3";
    (<Question>survey.currentPage.questions[1]).value = "4";
    dropDownQ.value = dropDownQ.otherItem.value;
    expect(survey.currentPage.name, "stay on the second page").toBe(survey.pages[1].name);
    expect(survey.state, "survey is still running").not.toBe("completed");
    dropDownQ.otherValue = "other value";
    expect(survey.state, "survey is still running #2").not.toBe("completed");
    dropDownQ.value = 1;
    expect(survey.state, "complete the survey").toBe("completed");
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
    expect(survey.currentPage.name, "the first page is default page").toBe(survey.pages[0].name);
    survey.setValue("q1", true);
    expect(survey.currentPage.name, "go to the second page automatically").toBe(survey.pages[1].name);
    survey.clear();
    survey.getQuestionByName("q1").renderAs = "checkbox";
    expect(survey.currentPage.name, "the first page is default page, #2").toBe(survey.pages[0].name);
    survey.setValue("q1", true);
    expect(survey.currentPage.name, "we do not go to the second page automatically, #2").toBe(survey.pages[0].name);
  });
  test("test autoAdvanceEnabled property - 'autogonext' - go next page automatically but do not submit", () => {
    var survey = twoPageSimplestSurvey();

    var dropDownQ = <QuestionDropdownModel>(
      survey.pages[1].addNewQuestion("dropdown", "question5")
    );
    dropDownQ.choices = [1, 2, 3];
    dropDownQ.showOtherItem = true;
    survey.autoAdvanceEnabled = true;
    expect(survey.currentPage.name, "the first page is default page").toBe(survey.pages[0].name);
    survey.setValue("question1", 1);
    survey.setValue("question2", 2);
    expect(survey.currentPage.name, "go to the second page automatically").toBe(survey.pages[1].name);
    (<Question>survey.currentPage.questions[0]).value = "3";
    (<Question>survey.currentPage.questions[1]).value = "4";
    dropDownQ.value = dropDownQ.otherItem.value;
    expect(survey.currentPage.name, "stay on the second page").toBe(survey.pages[1].name);
    expect(survey.state, "survey is still running").not.toBe("completed");
    dropDownQ.otherValue = "other value";
    expect(survey.state, "survey is still running").not.toBe("completed");
  });
  test("test autoAdvanceEnabled property - 'autogonext' - load from survey", () => {
    const survey = new SurveyModel({
      autoAdvanceEnabled: "autogonext",
      elements: [
        { type: "text", name: "q1" }
      ]
    });
    expect(survey.autoAdvanceEnabled, "autoAdvanceEnabled set to autogonext on loading correctly").toBe(true);
  });
  test("test autoAdvanceEnabled after errors", () => {
    var survey = twoPageSimplestSurvey();

    survey.autoAdvanceEnabled = true;
    (<Question>survey.getQuestionByName("question2")).isRequired = true;
    expect(survey.currentPage.name, "the first page is default page").toBe(survey.pages[0].name);
    survey.setValue("question1", 1);
    survey.nextPage();
    expect(survey.currentPage.name, "we are still on the first page. There are errors.").toBe(survey.pages[0].name);
    survey.setValue("question2", 2);
    expect(survey.currentPage.name, "go to the second page automatically").toBe(survey.pages[1].name);
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
      expect(survey.state, "autoAdvanceEnabled is incorrect for question: " + q.question.name).toBe(state);
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
    expect(survey.currentPage.name, "go to the next page").toBe(survey.pages[1].name);
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
    expect(survey.state).toBe("completed");
  });
  test("autoAdvanceEnabled and autoAdvanceAllowComplete=false", () => {
    const emptySurvey = new SurveyModel();
    expect(emptySurvey.autoAdvanceAllowComplete, "autoAdvanceAllowComplete value # 1").toBe(true);
    const survey = new SurveyModel({
      pages: [
        { elements: [{ type: "dropdown", name: "q1", choices: [1, 2, 3] }] },
        { elements: [{ type: "dropdown", name: "q2", choices: [1, 2, 3] }] }
      ],
      autoAdvanceEnabled: true,
      autoAdvanceAllowComplete: false
    });
    expect(survey.autoAdvanceAllowComplete, "autoAdvanceAllowComplete value # 2").toBe(false);
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    expect(survey.currentPageNo, "curPage #1").toBe(0);
    q1.value = 1;
    expect(survey.currentPageNo, "curPage #2").toBe(1);
    q2.value = 1;
    expect(survey.currentPageNo, "curPage #2").toBe(1);
  });

  test("autoAdvanceEnabled and checkbox wiht valueName bug #70", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("page1");
    var q1 = <QuestionDropdownModel>page.addNewQuestion("checkbox", "q1");
    q1.valueName = "v"; //this line produce the issue
    q1.choices = [1, 2, 3];
    survey.autoAdvanceEnabled = true;
    (<Question>survey.getQuestionByName("q1")).value = [1];
    expect(survey.state, "it should not be completed").not.toBe("completed");
  });
  test("Compatibility  showNavigationButtons: 'both'", () => {
    const survey = new SurveyModel({
      showNavigationButtons: "both"
    });
    expect(survey.showNavigationButtons, "showNavigationButtons is true").toBe(true);
    expect(survey.navigationButtonsLocation, "navigationButtonsLocation is topBottom").toBe("topBottom");
  });
  test("isNavigationButtonsShowing", () => {
    var survey = twoPageSimplestSurvey();
    expect(survey.isNavigationButtonsShowing, "by default buttons are shown").toBe("bottom");
    expect(survey.isNavigationButtonsShowingOnBottom, "by default buttons are shown, #bottom").toBe(true);
    expect(survey.isNavigationButtonsShowingOnTop, "by default buttons are shown, #top").toBe(false);
    survey.setDesignMode(true);
    expect(survey.isNavigationButtonsShowing, "do not show buttons at design time").toBe("none");
    expect(survey.isNavigationButtonsShowingOnBottom, "do not show buttons at design time, #bottom").toBe(false);
    expect(survey.isNavigationButtonsShowingOnTop, "do not show buttons at design time, #top").toBe(false);
    survey.setDesignMode(false);
    expect(survey.isNavigationButtonsShowing, "by default buttons are shown").toBe("bottom");
    expect(survey.isNavigationButtonsShowingOnBottom, "by default buttons are shown, #bottom").toBe(true);
    expect(survey.isNavigationButtonsShowingOnTop, "by default buttons are shown, #top").toBe(false);
    survey.showNavigationButtons = false;
    expect(survey.isNavigationButtonsShowing, "showNavigationButtons = none").toBe("none");
    expect(survey.isNavigationButtonsShowingOnBottom, "showNavigationButtons = none, #bottom").toBe(false);
    expect(survey.isNavigationButtonsShowingOnTop, "showNavigationButtons = none, #top").toBe(false);
    survey.pages[0].showNavigationButtons = true;
    expect(survey.isNavigationButtonsShowing, "showNavigationButtons = true && showNavigationButtons = false").toBe("bottom");
    expect(survey.isNavigationButtonsShowingOnBottom, "showNavigationButtons = true && showNavigationButtons = false, #bottom").toBe(true);
    expect(survey.isNavigationButtonsShowingOnTop, "showNavigationButtons = true && showNavigationButtons = false, #top").toBe(false);
    survey.showNavigationButtons = false;
    survey.pages[0].showNavigationButtons = false;
    expect(survey.isNavigationButtonsShowing, "showNavigationButtons = false && showNavigationButtons = false").toBe("none");
    expect(survey.isNavigationButtonsShowingOnBottom, "showNavigationButtons = false && showNavigationButtons = false, #bottom").toBe(false);
    survey.showNavigationButtons = true;
    survey.pages[0].showNavigationButtons = "inherit";
    expect(survey.isNavigationButtonsShowing, "showNavigationButtons = 'inherit' && showNavigationButtons = true").toBe("bottom");
    expect(survey.isNavigationButtonsShowingOnBottom, "showNavigationButtons = 'inherit' && showNavigationButtons = true, #bottom").toBe(true);

    survey.showNavigationButtons = "both";
    expect(survey.showNavigationButtons, "showNavigationButtons is true showNavigationButtons = both").toBe(true);
    expect(survey.navigationButtonsLocation, "navigationButtonsLocation is topBottom showNavigationButtons = both").toBe("topBottom");
    expect(survey.isNavigationButtonsShowing, "showNavigationButtons = undefined && showNavigationButtons = both").toBe("topBottom");
    expect(survey.isNavigationButtonsShowingOnBottom, "showNavigationButtons = 'inherit' && showNavigationButtons = both, #bottom").toBe(true);
    expect(survey.isNavigationButtonsShowingOnTop, "showNavigationButtons = undefined && showNavigationButtons = both, #top").toBe(true);

    survey.showNavigationButtons = true;
    survey.navigationButtonsLocation = "top";
    expect(survey.isNavigationButtonsShowing, "showNavigationButtons = undefined && showNavigationButtons = top").toBe("top");
    expect(survey.isNavigationButtonsShowingOnBottom, "showNavigationButtons = undefined && showNavigationButtons = top, #bottom").toBe(false);
    expect(survey.isNavigationButtonsShowingOnTop, "showNavigationButtons = undefined && showNavigationButtons = top, #top").toBe(true);
  });

  test("isNavigationButtonsShowingOnBottom & isNavigationButtonsShowingOnTop, navigationButtonsLocation is `topBottom`, Bug#9812", () => {
    const survey = new SurveyModel({
      elements: [{ type: "text", name: "question1" }],
      navigationButtonsLocation: "topBottom",
    });
    expect(survey.isNavigationButtonsShowingOnBottom, "isNavigationButtonsShowingOnBottom is true").toBe(true);
    expect(survey.isNavigationButtonsShowingOnTop, "isNavigationButtonsShowingOnTop is true").toBe(true);
    const getContainerContent = getContainerContentFunction(survey);
    expect(getContainerContent("contentTop"), "nav both contentTop").toEqual([{
      "component": "sv-action-bar",
      "id": "buttons-navigation-top"
    }]);
    expect(getContainerContent("contentBottom"), "nav both contentBottom").toEqual([{
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
    expect(survey.pages[1].visible, "initially the page becomes invisible").toBe(false);
    expect(q3.visible, "initially q3 becomes invisible").toBe(false);
    survey.setValue("q1", "yes");
    survey.setValue("q2", "no");
    expect(survey.getQuestionByName("q1").value, "q1 = 'yes'").toBe("yes");
    expect(survey.getQuestionByName("q2").value, "q2 = 'no'").toBe("no");
    expect(survey.pages[1].visible, "the page becomes visible, q1 = 'yes'").toBe(true);
    expect(q3.visible, "q3 becomes visible, q1 = 'yes' and q2 = 'no'").toBe(true);
    survey.setValue("q2", "yes");
    expect(survey.pages[1].visible, "the page becomes visible, q1 = 'yes'").toBe(true);
    expect(q3.visible, "q3 becomes invisible, q1 = 'yes' and q2 = 'yes'").toBe(false);
    survey.setValue("q1", "no");
    expect(survey.pages[1].visible, "the page becomes invisible, q1 = 'no'").toBe(false);
    expect(q3.visible, "q3 becomes invisible, q1 = 'no' and q2 = 'yes'").toBe(false);
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
    expect(page2.visible, "the initial page2 is invisible").toBe(false);
    survey.setValue("q1", ["yes"]);
    expect(page2.visible, "the page becomes visible, q1 = 'yes'").toBe(true);
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
    expect(q1.isVisible, "var1 is not exists, question is invisible").toBe(false);
    survey.setVariable("var1", 1);
    expect(q1.isVisible, "var1 equals 1, question is visible").toBe(true);
    survey.setVariable("var1", 2);
    expect(q1.isVisible, "var1 equals 2, question is not visible now").toBe(false);
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
    expect(survey.pages[0].isVisible, "first page visible by children").toBe(true);
    expect(survey.pages[1].isVisible, "second page is not visible by children").toBe(false);
    expect(counter, "nothing happens").toBe(0);
    survey.setValue("q1", ["yes"]);
    expect(counter, "calls one time").toBe(1);
    survey.setValue("q1", ["no"]);
    expect(counter, "calls second time").toBe(2);
    survey.setValue("q1", []);
    expect(counter, "nothing happens").toBe(2);
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
    expect(q.isVisible, "all checks are unset").toBe(false);
    survey.setValue("q1", ["yes", "no"]);
    expect(q.isVisible, "all checks are set").toBe(true);
    survey.setValue("q1", ["yes"]);
    expect(q.isVisible, "not all checks are set").toBe(false);
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
    expect(q2.visible, "q2 is not visible by default").toBe(false);
    q1.value = "true";
    expect(q2.visible, "q2 should be visible now").toBe(true);
    q1.value = "false";
    expect(q2.visible, "q2 should be invisible again").toBe(false);
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
    expect(q3.isVisible, "'0' is not empty").toBe(true);
    expect(q4.isVisible, "0 is not empty").toBe(true);
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
    expect(q2.visible, "q2 is not visible by default").toBe(false);
    q1.value = "true";
    expect(q2.visible, "q2 should be visible now").toBe(true);
    q1.value = "false";
    expect(q2.visible, "q2 should be invisible again").toBe(false);
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
    expect(q2.isVisible, "q2 is invisible by default").toBe(false);
    q1.value = 1;
    expect(q2.isVisible, "q2 is visible now").toBe(true);
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
    expect(q2.isVisible, "q2 is invisible by default").toBe(false);
    q1.value = 1;
    expect(q2.isVisible, "q2 is visible now").toBe(true);
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
    expect(q3.isVisible, "q3 is invisible by default").toBe(false);
    q1.value = 1;
    q2.value = 3;
    expect(q3.isVisible, "q3 is visible now").toBe(true);
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
    expect(q2.isReadOnly, "It is readonly initially").toBe(true);
    survey.setValue("q1", ["yes"]);
    expect(q2.isReadOnly, "It is not readonly now").toBe(false);
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
    expect(qVisible.visible, "The question is invisible on start").toBe(false);
    expect(qEnable.readOnly, "The question is readOnly on start").toBe(true);
    rows1[0].cells[0].question.value = "Yes";
    expect(qVisible.visible, "The question is visible now").toBe(true);
    expect(qEnable.readOnly, "The question is enabled now").toBe(false);
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
    expect(page1.validate(), "There is a required error").toBe(false);
    q1.value = ["yes"];
    expect(page1.validate(), "There is no required error").toBe(true);
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
    expect(survey.getQuestionByName("question2").visible, "The second question is visible").toBe(true);
    value.push("two");
    check.value = value;
    expect(survey.getQuestionByName("question3").visible, "The third question is visible").toBe(true);
  });

  test("QuestionCheckbox if single value set then convert it to array, #334", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("page1");
    var q1 = <QuestionCheckboxModel>page.addNewQuestion("checkbox", "q1");
    survey.setValue("q1", [1]);
    expect(survey.getValue("q1"), "survey.getValue returns array").toEqual([1]);
    expect([...(q1.value)], "q1.value returns array").toEqual([1]);
    survey.setValue("q1", 1);
    expect(survey.getValue("q1"), "survey.getValue return value").toEqual(1);
    expect([...(q1.value)], "q1.value still returns array").toEqual([1]);
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
    expect(page.rows.length).toBe(5);

    survey.setValue("component", "app");
    expect(page.rows[1].visible).toBe(true);
    expect(page.rows[4].visible).toBe(false);

    survey.setValue("component", "database");
    expect(page.rows[1].visible).toBe(false);
    expect(page.rows[4].visible).toBe(true);

    survey.setValue("component", "app");
    expect(page.rows[1].visible).toBe(true);
    expect(page.rows[4].visible).toBe(false);
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
    expect(survey.currentPageNo, "the first page is chosen").toBe(0);
    expect((<Question>survey.getQuestionByName("question1")).customWidget, "there is no custom widget for this question").toBeNull();
    expect((<Question>survey.getQuestionByName("question2")).customWidget.name, "has the first custom widget").toBe("first");
    expect((<Question>survey.getQuestionByName("question5")).customWidget.name, "has the second custom widget").toBe("second");
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
    expect(lastActivatedBy, "activatedBy set to 'property' by default").toBe("property");
    CustomWidgetCollection.Instance.setActivatedBy("widget1", "type");
    expect(lastActivatedBy, "activatedBy set to 'type'").toBe("type");
    CustomWidgetCollection.Instance.setActivatedBy("widget1", "customtype");
    expect(lastActivatedBy, "activatedBy set to 'customtype'").toBe("customtype");
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
    expect(rows[0].cells[0].question.customWidget.name, "the first cell has custom widget").toBe("first");
    expect(rows[0].cells[1].question.customWidget, "the second cell has no custom widget").toBeNull();

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
    expect(survey.currentPageNo, "the first page is chosen").toBe(0);
    expect(question.customWidget.name, "has the first custom widget").toBe("first");
    question.value = 1;
    expect(question.displayValue, "Use display value of custom widget").toBe("one");
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
    expect(question.customWidget.name, "the custom custom widget is set").toBe("camelName");
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
    expect(question.name, "name is correct").toBe("q1");
    expect(question.getType(), "type is correct").toBe(cType);
    CustomWidgetCollection.Instance.clear();
    Serializer.removeClass(cType);
    QuestionFactory.Instance.unregisterElement(cType);
  });
  test("ElementFactory.getAllToolboxTypes()", () => {
    let defaultToolboxNames = ElementFactory.Instance.getAllToolboxTypes();
    let defaultNames = ElementFactory.Instance.getAllTypes();
    expect(defaultToolboxNames, "They are the same by default").toEqual(defaultNames);
    const type = "toolbox-test-type";
    ElementFactory.Instance.registerElement(type, (name: string): IElement => { return new PanelModel(name); }, false);
    defaultToolboxNames = ElementFactory.Instance.getAllToolboxTypes();
    defaultNames = ElementFactory.Instance.getAllTypes();
    expect(defaultToolboxNames.length + 1, "We do use the new type for toolbox").toBe(defaultNames.length);
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
    expect(question.customWidget.name, "Custom widget is here").toBe("first");
    expect(readOnlyCounter, "Not called yet").toBe(0);
    question.readOnly = true;
    expect(readOnlyCounter, "question.readOnly = true").toBe(1);
    question.readOnly = false;
    expect(readOnlyCounter, "question.readOnly = false").toBe(2);
    expect(panel.isReadOnly, "Panel is not readOnly").toBe(false);
    question.value = 1;
    expect(panel.isReadOnly, "Panel is readOnly").toBe(true);
    expect(readOnlyCounter, "Panel is readOnly").toBe(3);
    question.value = 2;
    expect(panel.isReadOnly, "Panel is not readOnly").toBe(false);
    expect(readOnlyCounter, "Panel is not readOnly").toBe(4);
    survey.readOnly = true;
    expect(readOnlyCounter, "survey.mode = 'display'").toBe(5);
    survey.readOnly = false;
    expect(readOnlyCounter, "survey.mode = 'edit'").toBe(6);

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
    expect(q1.title, "Use the default title").toBe("val1");
    survey.locale = "de";
    expect(q1.title, "Use 'de' title").toBe("de-val1");
  });

  test("Survey Localization - check page/panel.title and processedTitle", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("page1");
    var panel = page.addNewPanel("panel1");
    expect(page.processedTitle, "page title is empty").toBe("");
    expect(panel.processedTitle, "panel title is empty").toBe("");
    survey.setDesignMode(true);
    expect(page.processedTitle, "page title is empty at design-time").toBe("");
    expect(panel.processedTitle, "panel title uses name").toBe("[panel1]");
    page.title = "pageText";
    panel.title = "panelText";
    survey.locale = "de";
    page.title = "de-pageText";
    panel.title = "de-panelText";
    survey.locale = "fr";
    expect(page.title, "Use the default page title").toBe("pageText");
    expect(panel.title, "Use the default panel title").toBe("panelText");
    survey.locale = "de";
    expect(page.title, "Use the 'de' page title").toBe("de-pageText");
    expect(panel.title, "Use the 'de' panel title").toBe("de-panelText");
  });

  test("Survey Localization - dropdown.choices", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("Page 1");
    var q1 = <QuestionDropdownModel>page.addNewQuestion("dropdown", "question1");
    q1.choices = ["val1"];
    q1.choices[0].text = "text1";
    survey.locale = "de";
    q1.choices[0].text = "de-text1";
    expect(q1.choices[0].text, "Use 'de' text").toBe("de-text1");
    survey.locale = "fr";
    expect(q1.choices[0].text, "Use the default text").toBe("text1");
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

    expect(q1.visibleChoices[2].locText.textOrHtml, "By default it is Other").toBe("Other");
    survey.locale = "es";
    expect(q1.visibleChoices[2].locText.textOrHtml, "Otro for Spanish").toBe("Otro");
    survey.locale = "";
    expect(q1.visibleChoices[2].locText.textOrHtml, "It is default again").toBe("Other");
    survey.locale = "es";
    expect(q1.visibleChoices[2].locText.textOrHtml, "It is Spanish again").toBe("Otro");
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
    expect(q1.columns[0].text, "Use 'de' text").toBe("de-text1");
    survey.locale = "fr";
    expect(q1.columns[0].text, "Use the default text").toBe("text1");
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
    expect(col1.title, "Use 'de' text, title").toBe("de-title1");
    expect(col1["placeholder"], "Use 'de' text, placeholder").toBe("de-caption1");
    expect(col1["choices"][0].text, "Use 'de' text, choices").toBe("de-text1");
    survey.locale = "fr";
    expect(col1.title, "Use default text, title").toBe("title1");
    expect(col1["placeholder"], "Use default text, placeholder").toBe("caption1");
    expect(col1["choices"][0].text, "Use the default text").toBe("text1");
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
    expect(item.title, "Use 'de' text, title").toBe("de-title1");
    expect(item.placeHolder, "Use 'de' text, placeHolder").toBe("de-caption1");
    survey.locale = "fr";
    expect(item.title, "Use default text, title").toBe("title1");
    expect(item.placeHolder, "Use default text, placeHolder").toBe("caption1");
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
    expect(validator.text, "Use 'de' text").toBe("de-text");
    survey.locale = "fr";
    expect(validator.text, "Use default text").toBe("default-text");
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
    expect(surveyLocalization.defaultLocale, "En is default locale").toBe("en");
    var locales = survey.getUsedLocales();
    const checkLocales = ["en", "fr", "es", "ru", "gr", "pt", "it"];
    expect(locales.length, "Get all locales").toBe(checkLocales.length);
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
    expect(q3.locTitle.renderedHtml, "There is no values").toBe("-");
    q1.value = 1;
    expect(q3.locTitle.renderedHtml, "Drop down value is set").toBe("Item 1-");
    q2.value = [3, 4];
    expect(q3.locTitle.renderedHtml, "Drop down value is set").toBe("Item 1-Item 3, Item 4");
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
    expect(q1.getDisplayValue(false), "Return correct display value").toBe(0);
    expect(q2.locTitle.renderedHtml, "Not is not a null").toBe("q1=0");
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
    expect(q2.locTitle.renderedHtml, "Matrix use text").toBe("Col 1");
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
    expect(q2.locTitle.renderedHtml, "Dropdown Matrix Column use text").toBe("Item 1");
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
    expect(q2.locTitle.renderedHtml, "Dynamic Matrix Column use text").toBe("Item 1");
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
    expect(question1.fullTitle, "The value is preprocessed correctly").toBe("john.snow@nightwatch.com");
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
    expect(question.fullTitle, "The complex value is preprocessed correctly").toBe("complexText");
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
    expect(q1.displayValue, "Empty value").toBe("{Q1}");
    expect(q2.locTitle.renderedHtml, "title for empty value").toBe("q1: {Q1}");
    q1.value = "val1";
    expect(q1.displayValue, "value=val1").toBe("[val1]");
    expect(q2.locTitle.renderedHtml, "title for value=val1").toBe("q1: [val1]");
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
    expect(loc1.renderedHtml, "render standard text").toBe("text1");
    expect(loc2.renderedHtml, "render markdown text").toBe("text2!");
  });

  test("Survey Markdown - question title", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("Page 1");
    var q1 = <Question>page.addNewQuestion("text", "q1");
    var q2 = <Question>page.addNewQuestion("text", "q2");
    survey.onTextMarkdown.add(function (survey, options) {
      if (options.name == "commentText") return;
      expect(options.name, "question title markdown preprocessing").toBe("title");
      if (options.text.indexOf("markdown") > -1)
        options.html = options.text.replace("markdown", "!");
    });
    q2.value = "value2";
    var loc = q1.locTitle;
    q1.title = "title1, q2.value is {q2}markdown";
    expect(q1.fullTitle, "question.title, use markdown and text preprocessing").toBe("title1, q2.value is value2!");
    expect(loc.renderedHtml, "question.locTitle.renderedHtml, use markdown and text preprocessing").toBe("title1, q2.value is value2!");
    q1.isRequired = true;
    expect(q1.requiredMark, "question.title requiredMark is not empty").toBe("*");
  });

  test("Survey Markdown - question title, if title is empty and question is required", () => {
    var survey = new SurveyModel();
    survey.setValue("q1", "q1-Value");
    var page = survey.addNewPage("Page 1");
    var q1 = <Question>page.addNewQuestion("text", "q1");
    var q2 = <Question>page.addNewQuestion("text", "q2");
    var q3 = <Question>page.addNewQuestion("text", "q3");
    survey.onTextMarkdown.add((survey, options) => {
      expect(options.name, "question title markdown preprocessing").toBe("title");
      options.html = options.text + "!";
    });
    q1.isRequired = true;
    q2.isRequired = true;
    q2.title = "Q2";
    q3.isRequired = true;
    q3.title = "*Q3 {q1}";

    expect(q1.locTitle.renderedHtml, "q1.title, use markdown for requried text, title is empty").toBe("q1!");
    expect(q1.locTitle.hasHtml, "q1.title, use markdown for requried text - hasHtml, title is empty").toBe(true);
    expect(q2.locTitle.renderedHtml, "q2.title, use markdown for requried text, has title").toBe("Q2!");
    expect(q2.locTitle.hasHtml, "q2.title, use markdown for requried text - hasHtml, has title").toBe(true);
    expect(q3.locTitle.renderedHtml, "q3.title, use markdown for requried text and inside title and process text").toBe("*Q3 q1-Value!");
    expect(q3.locTitle.hasHtml, "q3.title, use markdown for requried text and inside title and process text, hasHtml").toBe(true);
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
      expect(q1.title).toBe("q1");
      expect(q1.locTitle.renderedHtml).toBe("q1!");
      expect(q2.title).toBe("q2");
      expect(q2.locTitle.renderedHtml).toBe("q2");
    }
    expect(counter, "onTextMarkdown is called two times").toBe(2);
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
    expect(q1.locTitle.renderedHtml, "Initial value").toBe("Q1 test1!");
    survey.setValue("val", "test2");
    expect(q1.locTitle.renderedHtml, "Change the value").toBe("Q1 test2!");
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
    expect(q1.locTitle.renderedHtml, "page1").toBe("Q1!");
    expect(q2.locTitle.renderedHtml, "page2").toBe("Q2!");
  });

  test("required question title test", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("Page 1");
    var q1 = <Question>page.addNewQuestion("text", "q1");
    q1.title = "title1";
    expect(q1.locTitle.renderedHtml, "Just title").toBe("title1");
    q1.isRequired = true;
    expect(q1.locTitle.renderedHtml, "title + required").toBe("title1");
    expect(q1.requiredMark, "title + required").toBe("*");
    expect(q1.title, "We do no have required").toBe("title1");
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
    expect(page.processedTitle, "page.processedTitle, use markdown and text preprocessing").toBe("Page 1!, q1 is value1");
    expect(loc.renderedHtml, "page.locTitle.renderedHtml, use markdown and text preprocessing").toBe("Page 1!, q1 is value1");
  });

  test("Survey Markdown - page title + showPageNumbers = true", () => {
    var survey = new SurveyModel();
    survey.showPageNumbers = true;
    var page = survey.addNewPage("Page 1");
    var q1 = <Question>page.addNewQuestion("text", "q1");
    survey.onTextMarkdown.add(function (survey, options) {
      if (options.name == "commentText") return;
      expect(options.name, "page title markdown preprocessing").toBe("title");
      if (options.text.indexOf("markdown") > -1)
        options.html = options.text.replace("markdown", "!");
    });
    q1.value = "value1";
    var loc = page.locTitle;
    page.title = "Page 1markdown, q1 is {q1}";
    expect(loc.renderedHtml, "page.locTitle.renderedHtml, use markdown and text preprocessing").toBe("Page 1!, q1 is value1");
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
    expect(loc1.renderedHtml, "render column name").toBe("col1");
    expect(loc2.renderedHtml, "render column text").toBe("colText2-newvalue-");
    expect(loc3.renderedHtml, "render column text as markdown").toBe("colText3-newvalue-!");
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
    expect(loc1.renderedHtml, "render column name").toBe("row1");
    expect(loc2.renderedHtml, "render column text + text processing").toBe("rowText2-newvalue-");
    expect(loc3.renderedHtml, "render column text as markdown + text processing").toBe("rowText3-newvalue-!");
  });

  test("html.html property, text preprocessing", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("page1");
    var html = <QuestionHtmlModel>page.addNewQuestion("html", "q1");
    survey.setVariable("var1", 5);
    html.html = "val: {var1}";
    expect(html.locHtml.renderedHtml, "initial value is set").toBe("val: 5");
    survey.setVariable("var1", 10);
    expect(html.locHtml.renderedHtml, "value is changed").toBe("val: 10");
  });

  test("Kebab-case variable in expressions - https://surveyjs.answerdesk.io/ticket/details/T2211", () => {
    var survey = new SurveyModel();
    survey.setVariable("testVariable", false);
    expect(survey.runCondition("{testVariable} = false"), "Should be true").toBeTruthy();
  });

  test("Survey Markdown - survey title", () => {
    var survey = new SurveyModel();
    survey.onTextMarkdown.add(function (survey, options) {
      expect(options.name, "survey title markdown preprocessing").toBe("title");
      if (options.text.indexOf("markdown") > -1)
        options.html = options.text.replace("markdown", "!");
    });
    survey.setValue("q1", "value1");
    var loc = survey.locTitle;
    survey.title = "Surveymarkdown, q1 is {q1}";
    expect(survey.processedTitle, "survey.processedTitle, use markdown and text preprocessing").toBe("Survey!, q1 is value1");
    expect(loc.renderedHtml, "survey.locTitle.renderedHtml, use markdown and text preprocessing").toBe("Survey!, q1 is value1");
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
    expect(validator.locText.renderedHtml, "Markdown is working").toBe("error!");
    expect(question1.errors[0].locText.renderedHtml, "Markdown in validators is working").toBe("error!");
    expect(question2.errors[0].locText.renderedHtml, "Markdown for event is working").toBe("!");
  });

  test("QuestionRadiogroupModel clears comment - issue #390", () => {
    var question = new QuestionRadiogroupModel("q1");
    question.showCommentArea = true;
    question.comment = "comment text";
    question.clearUnusedValues();
    expect(question.comment).toBe("comment text");
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
    expect(survey.data, "The default value is set").toEqual({ question1: "item3" });
    survey.clearIncorrectValues();
    expect(survey.data, "The default value is removed").toEqual({});
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
    expect(survey.data, "values set correctly").toEqual({ q1: "v1", q2: "v2", q3: "v3" });
    survey.clearIncorrectValues(true);
    expect(survey.data, "Remove q3 and val3 keys").toEqual({ q1: "v1", q2: "v2" });
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
    expect(survey.pages.length).toBe(1);
    expect(survey.pages[0].questions.length).toBe(1);
    expect(survey.pages[0].questions[0].name).toBe("suggestions");
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
    expect(q1.rowCount, "there are 3 rows").toBe(3);
    expect(q1.value[2]["col1"], "get value from previous").toBe(2);
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
    expect(visibleRowsCount, "There are 3 visibleRows in event").toBe(3);
    expect(q1.rowCount, "there are 3 rows").toBe(3);
    expect(q1.value[2]["col2"], "get value from previous").toBe("2");
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
    expect(q1.rowCount, "there is one row").toBe(1);
    q1.addRow();
    expect(q1.rowCount, "there is stil one row because of 'onMatrixBeforeRowAdded' and 'canAddRow'").toBe(1);
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
    expect(q1.rowCount, "there is one row").toBe(1);
    q1.addRow();
    expect(q1.rowCount, "there is stil one row because of 'onMatrixBeforeRowAdded' and 'canAddRow'").toBe(1);
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
    expect(matrix.rowCount, "rowCount=0, #1").toBe(0);
    allow = true;
    matrix.addRow();
    expect(matrix.rowCount, "rowCount=1, #2").toBe(1);
    allow = undefined;
    canAddRow = true;
    matrix.addRow();
    expect(matrix.rowCount, "rowCount=2, #3").toBe(2);
    canAddRow = undefined;

    matrix.allowAddRows = true;
    matrix.addRow();
    expect(matrix.rowCount, "rowCount=3, #4").toBe(3);
    allow = undefined;
    canAddRow = true;
    matrix.addRow();
    expect(matrix.rowCount, "rowCount=4, #5").toBe(4);
    canAddRow = undefined;
    matrix.addRow();
    expect(matrix.rowCount, "rowCount=5, #6").toBe(5);

    allow = undefined;
    canAddRow = false;
    matrix.addRow();
    expect(matrix.rowCount, "rowCount=5, #7").toBe(5);
    canAddRow = undefined;
    allow = false;
    matrix.addRow();
    expect(matrix.rowCount, "rowCount=5, #8").toBe(5);
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
    expect(q1.rowCount, "there are two rows").toBe(2);
    expect(removedRowIndex, "onMatrixRowRemoved event has been fired correctly").toBe(1);
    expect(visibleRowsCount, "There should be two visible rows in event").toBe(2);
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
    expect(css1.panel.container, "panel1 custom class").toBe("hereIam");
    var css2 = panel2.cssClasses;
    expect(css2.panel.container, "keep original panel class").toBe("sv_p_container");
    expect(css.panel.container, "keep original main css class").toBe("sv_p_container");
  });

  test("css sets correctly if src key is object and dest key is string", () => {
    var survey = new SurveyModel();
    survey.css = { text: { root: "custom_class" } };
    expect(survey.css["text"].root).toBe("custom_class");
  });

  test("check setCss method without merge", () => {
    var survey = new SurveyModel();
    const newFullCss = {
      navigation: {}
    };
    survey.setCss(newFullCss, false);
    expect(survey.css).toBe(newFullCss);
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
    expect(q2.cssRoot, "Appy css for the first page").toBe("custom_class");
    expect(q1.cssRoot, "Appy css for the start page").toBe("custom_class");
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
    expect(textCss.root, "text question root class").toBe("sv_q_text_root");
    expect(textCss.title, "text question title class").toBe("sv_q_title");
    expect(checkCss.root, "checkbox question root class").toBe("sv_qcbc sv_qcbx");
    expect(checkCss.item, "checkbox question title class").toBe("sv_q_checkbox");
    expect(checkCss.newItem, "checkbox question onUpdateQuestionCssClasses event called correctly").toBe("hereIam");
    textQuestion.isRequired = true;
    textCss = textQuestion.cssClasses;
    expect(textCss.title, "text question title class").toBe("sv_q_title required");
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
    expect(survey.getQuestionByName("q1").cssRoot, "text question root class - original").toBe("sv_q sv_qstn");
    expect(survey.getQuestionByName("q2").cssRoot, "checkbox question root class - original").toBe("sv_q sv_qstn");

    survey = new SurveyModel(json);
    setOldTheme(survey);
    survey.onUpdateQuestionCssClasses.add(function (survey, options) {
      if (options.question.getType() == "checkbox") {
        options.cssClasses.mainRoot = "testMainRoot";
        options.cssClasses.root = "testRoot";
      }
    });

    expect(survey.getQuestionByName("q1").cssRoot, "text question root class").toBe("sv_q sv_qstn");
    expect(survey.getQuestionByName("q2").cssRoot, "checkbox question root class").toBe("testMainRoot");
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
    expect(q1.titleLocation, "titleLocation is changed").toBe("left");
  });

  test("Use send data to custom server", () => {
    var survey = twoPageSimplestSurvey();
    var onCompleteOptions = null;
    survey.onComplete.add(function (sender, options) {
      onCompleteOptions = options;
      options.showSaveInProgress();
    });
    survey.data = { question1: "sss" };
    expect(survey.completedState, "The complete state is empty").toBe("");
    survey.doComplete();
    expect(survey.completedState, "The complete state is saving").toBe("saving");
    onCompleteOptions.showSaveError();
    expect(survey.completedState, "The complete state is error").toBe("error");
    onCompleteOptions.showSaveSuccess();
    expect(survey.completedState, "The complete state is success").toBe("success");
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
    expect(survey.completedState, "The complete state is empty").toBe("");
    expect(notifierLog).toBe("");
    notifierLog = "";

    survey.doComplete();
    expect(survey.completedState, "The complete state is saving").toBe("saving");
    expect(notifierLog).toBe("The results are being saved on the server... - saving");
    notifierLog = "";

    onCompleteOptions?.showDataSavingError();
    expect(survey.completedState, "The complete state is error").toBe("error");
    expect(notifierLog).toBe("An error occurred and we could not save the results. - error");
    notifierLog = "";

    onCompleteOptions?.showDataSavingSuccess();
    expect(survey.completedState, "The complete state is success").toBe("success");
    expect(notifierLog).toBe("The results were saved successfully! - success");
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
    expect(survey.completedState, "The complete state is empty").toBe("");
    expect(notifierLog).toBe("");
    notifierLog = "";

    survey.doComplete();
    expect(survey.completedState, "The complete state is saving").toBe("saving");
    expect(notifierLog).toBe("The results are being saved on the server... - saving");
    notifierLog = "";

    onCompleteOptions?.showSaveError();
    expect(survey.completedState, "The complete state is error").toBe("error");
    expect(notifierLog).toBe("An error occurred and we could not save the results. - error");
    notifierLog = "";

    onCompleteOptions?.showSaveSuccess();
    expect(survey.completedState, "The complete state is success").toBe("success");
    expect(notifierLog).toBe("The results were saved successfully! - success");
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
    expect(q1.visibleRows[0].cells[0].question["renderAs"], "custom property should be passed to the question").toBe("select2tagbox");
  });

  test("Pass text as survey json", () => {
    var survey = new SurveyModel(
      '{ "elements": [ {"type": "text", "name": "q1"}]}'
    );
    var q1 = survey.getQuestionByName("q1");
    expect(q1.name, "The survey created from the string").toBe("q1");
  });

  test("Clear value if empty array is set, Bug #608", () => {
    var survey = new SurveyModel();
    survey.setValue("q1", ["1"]);
    expect(survey.data, "The array is set").toEqual({ q1: ["1"] });
    survey.setValue("q1", []);
    expect(survey.data, "The value with empty array is removed").toEqual({});
  });

  test("Question description and text processing, variable, Bug #632", () => {
    var survey = new SurveyModel();
    survey.addNewPage("p1");
    var question = <Question>survey.pages[0].addNewQuestion("text", "q1");
    question.title = "{var1}";
    question.description = "{var1}";
    survey.setVariable("var1", "It is var1");
    expect(question.locTitle.renderedHtml, "Title: Variable is applied").toBe("It is var1");
    expect(question.locDescription.renderedHtml, "Decription: Variable is applied").toBe("It is var1");
  });

  test("Set defaultValue on loading from JSON, on adding into survey and on setting defaultValue property", () => {
    var survey = new SurveyModel({
      elements: [{ type: "text", name: "q1", defaultValue: "your_name" }],
    });
    expect(survey.getValue("q1"), "on loading from JSON").toBe("your_name");
    var q2 = new QuestionTextModel("q2");
    q2.defaultValue = "my_name";
    survey.pages[0].addElement(q2);
    expect(survey.getValue("q2"), "on adding question into suvey").toBe("my_name");
    var q3 = <Question>survey.pages[0].addNewQuestion("text", "q3");
    q3.defaultValue = "her_name";
    expect(survey.getValue("q3"), "on setting the default value").toBe("her_name");
    q3.defaultValue = "his_name";
    expect(survey.getValue("q3"), "the value doesn't changed, since it was not empty").toBe("her_name");
  });
  test("Set defaultValue in design-time", () => {
    var survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.addNewPage("p1");
    var q1 = new QuestionTextModel("q1");
    survey.pages[0].addElement(q1);
    expect(q1.defaultValue, "There is no default value").toBeFalsy();
    q1.defaultValue = "my_name";
    expect(survey.getValue("q1"), "the value is set").toBe("my_name");
    q1.defaultValue = null;
    expect(survey.getValue("q1"), "the value is reset").toBeFalsy();
  });

  test("defaultValue + survey.clear()", () => {
    var json = {
      elements: [{ type: "text", name: "q1", defaultValue: "defValue" }],
    };
    var survey = new SurveyModel(json);
    expect(survey.getValue("q1"), "the value is set").toBe("defValue");
    survey.doComplete();
    survey.clear(true);
    expect(survey.getValue("q1"), "the value is set after clear, #1163").toBe("defValue");
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
    expect(survey.data, "check initial state").toEqual({ q1: "other", q2: ["other"] });
    survey.getQuestionByName("q1").otherValue = "comment1";
    survey.getQuestionByName("q2").otherValue = "comment2";
    expect(survey.getQuestionByName("q1").getPropertyValue("comment")).toBe("comment1");
    survey.clear();
    expect(survey.getQuestionByName("q1").getPropertyValue("comment")).toBe("");
    expect(survey.data, "clear comments").toEqual({ q1: "other", q2: ["other"] });
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
    expect(q.errors.length, "There is no errors so far").toBe(0);
    q.value = "26";
    expect(q.errors.length, "There should be one error").toBe(1);
    expect(valueChangedCounter, "on value changed called one time").toBe(1);
    expect(q.value, "the value is 26").toBe("26");
  });

  test("Auto generate names for question/panel/page", () => {
    var survey = new SurveyModel();
    var page1 = survey.addNewPage();
    expect(survey.pages[0].name, "the first name is page1").toBe("page1");
    var page2 = survey.addNewPage();
    expect(survey.pages[1].name, "the second name is page2").toBe("page2");
    survey.pages[0].name = "newpage";
    var page3 = survey.addNewPage();
    expect(survey.pages[2].name, "the third name is page1 again").toBe("page1");

    page1.addNewQuestion("text");
    page1.addNewQuestion("text");
    page3.addNewQuestion("text");
    expect(survey.getAllQuestions()[0].name, "the first name is question1").toBe("question1");
    expect(survey.getAllQuestions()[1].name, "the second name is question2").toBe("question2");
    expect(survey.getAllQuestions()[2].name, "the third name is question3").toBe("question3");

    var panel1 = page1.addNewPanel();
    var panel2 = panel1.addNewPanel();
    var panel3 = page2.addNewPanel();
    expect(panel1.name, "the first name is panel1").toBe("panel1");
    expect(panel2.name, "the second name is panel2").toBe("panel2");
    expect(panel3.name, "the third name is panel3").toBe("panel3");
  });

  test("clearInvisibleValues", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage();
    var question = <Question>page.addNewQuestion("text");
    expect(survey.clearInvisibleValues, "the default value").toBe("onComplete");
    survey.clearInvisibleValues = true;
    expect(survey.clearInvisibleValues, "true is onComplete").toBe("onComplete");
    survey.clearInvisibleValues = false;
    expect(survey.clearInvisibleValues, "false is none").toBe("none");
    question.value = "val";
    question.visible = false;
    expect(question.value, "none - nothing happened").toBe("val");
    question.visible = true;
    survey.clearInvisibleValues = "onHidden";
    question.visible = false;
    expect(question.value, "onHidden - clear the value").toBeFalsy();
    question.visible = true;
    question.value = "val";
    survey.clearInvisibleValues = "onComplete";
    question.visible = false;
    expect(question.value, "onComplete - nothing happened").toBe("val");
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
    expect(survey.data, "Remove value for invisible question q2").toEqual({ q1: "val1" });
  });
  test("required text can be empty: Bug #693", () => {
    var survey = new SurveyModel();
    expect(survey.requiredMark, "The default value is '*'").toBe("*");
    survey.requiredMark = "";
    expect(survey.requiredMark, "The value is empty string").toBe("");
    survey.requiredMark = null;
    expect(survey.requiredMark, "The value is again default").toBe("*");
  });
  test("Set 0 value into survey.data", () => {
    var survey = new SurveyModel();
    var p = survey.addNewPage();
    var q = <QuestionTextModel>p.addNewQuestion("text", "q1");
    survey.data = { q1: 0 };
    expect(q.value, "0 value is set").toBe(0);
  });
  test("Parent property in question", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("page");
    var panel = page.addNewPanel("panel");
    var panel2 = panel.addNewPanel("panel2");
    var q = panel2.addNewQuestion("text");
    expect(q.parent.name).toBe("panel2");
    panel2.removeElement(q);
    expect(q.parent).toBeFalsy();
    panel.addElement(q);
    expect(q.parent.name).toBe("panel");
  });
  test("Remove question from it's previous container before adding to a new one", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("page");
    var panel1 = page.addNewPanel("panel1");
    var panel2 = page.addNewPanel("panel2");
    var q = panel1.addNewQuestion("text");
    expect(q.parent.name).toBe("panel1");
    expect(panel1.elements.length, "There is one element").toBe(1);
    panel2.addElement(q);
    expect(q.parent.name).toBe("panel2");
    expect(panel2.elements.length, "There is one element in panel2").toBe(1);
    expect(panel1.elements.length, "There is no elements in panel1").toBe(0);
  });
  test("Page property in question", () => {
    var survey = new SurveyModel();
    var page1 = survey.addNewPage("p1");
    var page2 = survey.addNewPage("p2");
    var panel = page1.addNewPanel("panel");
    var panel2 = panel.addNewPanel("panel2");
    var q = panel2.addNewQuestion("text");
    expect(page1.questions.indexOf(q) > -1, "The question is in the first page").toBeTruthy();
    expect(q.page.name, "The page is set correctly").toBe(page1.name);
    q.page = page2;
    expect(page2.questions.indexOf(q) > -1, "The question is in the second page").toBeTruthy();
    expect(page1.questions.indexOf(q) > -1, "The question is not in the first page").toBeFalsy();
    expect(q.page.name, "The page was changed").toBe(page2.name);
  });

  test("Define questionTitleLocation on Panel/Page level", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("page");
    var panel = page.addNewPanel("panel");
    var panel2 = panel.addNewPanel("panel2");
    var q = <Question>panel2.addNewQuestion("text");
    expect(q.getTitleLocation(), "get from survey").toBe("top");
    panel2.questionTitleLocation = "bottom";
    expect(q.getTitleLocation(), "get from panel 2").toBe("bottom");
    panel2.questionTitleLocation = "default";
    expect(q.getTitleLocation(), "get from survey").toBe("top");
    panel.questionTitleLocation = "bottom";
    expect(q.getTitleLocation(), "get from panel").toBe("bottom");
    panel.questionTitleLocation = "default";
    expect(q.getTitleLocation(), "get from survey").toBe("top");
    page.questionTitleLocation = "bottom";
    expect(q.getTitleLocation(), "get from page").toBe("bottom");
    page.questionTitleLocation = "default";
    expect(q.getTitleLocation(), "get from survey").toBe("top");
    q.titleLocation = "bottom";
    expect(q.getTitleLocation(), "get from question").toBe("bottom");
    q.titleLocation = "default";
    expect(q.getTitleLocation(), "get from survey again").toBe("top");
  });

  test("Define questionTitleWidth on Panel/Page level", () => {
    const survey = new SurveyModel();
    const page = survey.addNewPage("page");
    const panel = page.addNewPanel("panel");
    const panel2 = panel.addNewPanel("panel2");
    const q = <Question>panel2.addNewQuestion("text");
    page.questionTitleLocation = "left";

    expect(q.titleWidth, "init").toBeUndefined();
    page.questionTitleWidth = "500px";
    expect(q.titleWidth, "get from page").toBe("500px");

    panel.questionTitleWidth = "50%";
    expect(q.titleWidth, "get from panel").toBe("50%");

    panel2.questionTitleWidth = "200px";
    expect(q.titleWidth, "get from panel2").toBe("200px");

    panel2.questionTitleWidth = "300";
    expect(q.titleWidth, "titleWidth with px").toBe("300px");

    q.titleLocation = "top";
    expect(q.titleWidth, "titleWidth available if titleLocation is left").toBeUndefined();
  });

  test("availableQuestionTitleWidth on Panel/Page", () => {
    const survey = new SurveyModel();
    const page = survey.addNewPage("page");
    const panel = page.addNewPanel("panel");
    const panel2 = panel.addNewPanel("panel2");
    const q = <Question>panel.addNewQuestion("text");

    expect(page.availableQuestionTitleWidth(), "page").toBe(false);
    expect(panel.availableQuestionTitleWidth(), "panel1").toBe(false);
    expect(panel2.availableQuestionTitleWidth(), "panel2").toBe(false);

    q.titleLocation = "left";
    expect(page.availableQuestionTitleWidth(), "page").toBe(true);
    expect(panel.availableQuestionTitleWidth(), "panel1").toBe(true);
    expect(panel2.availableQuestionTitleWidth(), "panel2").toBe(false);

    q.titleLocation = "top";
    page.questionTitleLocation = "left";
    expect(page.availableQuestionTitleWidth(), "page").toBe(true);
    expect(panel.availableQuestionTitleWidth(), "panel1").toBe(true);
    expect(panel2.availableQuestionTitleWidth(), "panel2").toBe(true);
  });

  test("Question property.page getChoices", () => {
    var property = Serializer.findProperty("questionbase", "page");
    expect(property, "page property is here").toBeTruthy();
    var survey = new SurveyModel();
    survey.addNewPage("p1");
    survey.addNewPage("p2");
    survey.addNewPage("p3");
    var q = survey.pages[0].addNewQuestion("text", "q1");
    expect(property.getChoices(q).length, "There are 3 pages").toBe(3);
  });

  test("firstPageIsStartPage = true", () => {
    var survey = new SurveyModel();
    for (var i = 0; i < 3; i++) {
      let page = survey.addNewPage("p" + i + 1);
      page.addNewQuestion("text");
    }
    expect(survey.visiblePages.length, "There are 3 visible pages").toBe(3);
    expect(survey.pages[0].isVisible, "The first page is visible").toBe(true);
    expect(survey.state, "Survey is running").toBe("running");
    survey.firstPageIsStartPage = true;
    expect(survey.pages[0].isVisible, "The first page is visible").toBe(true);
    expect(survey.pages[0].isStarted, "The first page is started").toBe(true);
    expect(survey.visiblePages.length, "There are 2 visible pages").toBe(2);
    expect(survey.state, "Survey is showing the start page").toBe("starting");
    survey.firstPageIsStartPage = false;
    expect(survey.visiblePages.length, "There are 3 visible pages").toBe(3);
    expect(survey.pages[0].isVisible, "The first page is visible").toBe(true);
    expect(survey.state, "Survey is running").toBe("running");
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
    expect(survey.pages[0].isVisible, "The first page is visible").toBe(true);
    expect(survey.pages[0].isStarted, "The first page is visible").toBe(true);
    expect(survey.visiblePages.length, "There is one visible page").toBe(1);
    expect(survey.state, "Survey is showing the start page").toBe("starting");
    expect(startCounter, "onStarted event was not called yet").toBe(0);
    survey.start();
    expect(startCounter, "onStarted event was called one time").toBe(1);
    expect(survey.state, "Survey is running").toBe("running");
    expect(survey.currentPage.name, "The page1 is current").toBe("page1");
    survey.prevPage();
    expect(survey.currentPage.name, "Could not come back to the start page").toBe("page1");
    expect(survey.state, "Survey is running").toBe("running");
    survey.doComplete();
    survey.clear();
    expect(survey.state, "Survey is showing the start page").toBe("starting");
    expect(startCounter, "onStarted event was called one time total").toBe(1);
  });

  test("question.valueName property", () => {
    var survey = new SurveyModel();
    survey.data = { val: "val1" };
    var page = survey.addNewPage("p1");
    var question = <Question>page.addNewQuestion("text", "q1");
    question.valueName = "val";
    expect(question.value, "The value is taken by using valueName").toBe("val1");
  });
  test("pre process title, with question.valueName", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("p1");
    var question = <Question>page.addNewQuestion("text", "q1");
    question.valueName = "name";
    survey.data = { name: "John" };
    survey.title = "Hello {name}";
    expect(survey.processedTitle, "process survey title correctly").toBe("Hello John");
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
    expect(q3.locTitle.renderedHtml, "There is no values").toBe("-");
    q1.value = 1;
    expect(q3.locTitle.renderedHtml, "Drop down value is set").toBe("Item 1-");
    q2.value = [3, 4];
    expect(q3.locTitle.renderedHtml, "Drop down value is set").toBe("Item 1-Item 3, Item 4");
  });

  test("Survey show several pages as one", () => {
    var survey = twoPageSimplestSurvey();
    survey.isSinglePage = true;
    expect(survey.visiblePages.length, "You have one page").toBe(1);
    var page = survey.visiblePages[0];
    expect(page.elements.length, "two pages has converted into two panels").toBe(2);
    expect(page.questions.length, "there are 4 questions on the page").toBe(4);
  });

  test("Survey show several pages as one, set and reset", () => {
    var survey = twoPageSimplestSurvey();
    survey.isSinglePage = true;
    survey.isSinglePage = false;
    expect(survey.visiblePages.length, "We have still two pages").toBe(2);
    var page = survey.visiblePages[0];
    expect(page.questions.length, "there are 2 questions on the page").toBe(2);
    survey.isSinglePage = true;
    expect(survey.visiblePages.length, "Single page").toBe(1);
    survey.setDesignMode(true);
    expect(survey.visiblePages.length, "We have still two pages again").toBe(2);
  });

  test("Survey show several pages as one + firstPageIsStartPage", () => {
    var survey = twoPageSimplestSurvey();
    var thirdPage = new PageModel("third");
    thirdPage.addNewQuestion("text", "q1");
    thirdPage.addNewQuestion("text", "q2");
    survey.pages.push(thirdPage);
    survey.firstPageIsStartPage = true;
    survey.isSinglePage = true;
    expect(survey.pages.length, "We have two pages here").toBe(3);
    expect(survey.visiblePages.length, "You have one page").toBe(1);
    var page = survey.visiblePages[0];
    expect(page.elements.length, "two pages has converted into two panels").toBe(2);
    expect(page.questions.length, "there are 4 questions on the page").toBe(4);
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
    expect((<Question>survey.getQuestionByName("InvestorType")).visibleIndex, "The first question").toBe(0);
    survey.setValue("InvestorType", "entity");
    var q3 = survey.getQuestionByName("q3");
    expect((<Question>survey.getQuestionByName("q1")).visibleIndex, "The second question").toBe(1);
    expect((<Question>survey.getQuestionByName("q2")).visibleIndex, "The third question is invisible because of panel").toBe(-1);
    expect((<Question>survey.getQuestionByName("q3")).visibleIndex, "The forth question").toBe(2);
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
    expect(survey.currentPage.questions.length, "There are 3 elements on the single page").toBe(3);
    expect(survey.currentPage.rows.length, "There are 3 rows on the page").toBe(3);
    expect(survey.currentPage.rows[2].visible, "The last row is visible").toBe(true);
  });

  test("isSinglePage = true and survey.showPageTitles = false, Bug#1914", () => {
    const survey = twoPageSimplestSurvey();
    survey.pages[0].title = "Page 1";
    survey.pages[1].title = "Page 2";
    survey.showPageTitles = false;
    survey.isSinglePage = true;
    var panels = survey.currentPage.elements;
    expect(panels.length, "There are two panels").toBe(2);
    expect((<PanelModel>panels[0]).hasTitle, "Panel1 title is hidden").toBe(false);
    expect((<PanelModel>panels[1]).hasTitle, "Panel2 title is hidden").toBe(false);
  });
  test("check synhronization properties isSinglePage and questionsOnPageMode", () => {
    var survey = twoPageSimplestSurvey();
    expect(survey.isSinglePage, "isSinglePage is false by default").toBe(false);
    expect(survey.questionsOnPageMode, "questionsOnPageMode is 'standard' by default").toBe("standard");
    survey.isSinglePage = true;
    expect(survey.isSinglePage, "set isSinglePage to true").toBe(true);
    expect(survey.questionsOnPageMode, "questionsOnPageMode is 'singlePage' on setting isSinglePage to true").toBe("singlePage");
    survey.isSinglePage = false;
    expect(survey.isSinglePage, "set isSinglePage to false").toBe(false);
    expect(survey.questionsOnPageMode, "questionsOnPageMode is 'standard' on setting isSinglePage to false").toBe("standard");
    survey.questionsOnPageMode = "singlePage";
    expect(survey.questionsOnPageMode, "set questionsOnPageMode to 'singlePage'").toBe("singlePage");
    expect(survey.isSinglePage, "isSinglePage is true on setting questionsOnPageMode to 'singlePage'").toBe(true);
    survey.questionsOnPageMode = "questionPerPage";
    expect(survey.questionsOnPageMode, "set questionsOnPageMode to 'questionPerPage'").toBe("questionPerPage");
    expect(survey.isSinglePage, "isSinglePage is false on setting questionsOnPageMode to 'questionPerPage'").toBe(false);
    survey.questionsOnPageMode = "standard";
    expect(survey.questionsOnPageMode, "set questionsOnPageMode to 'standard'").toBe("standard");
    expect(survey.isSinglePage, "isSinglePage is false on setting questionsOnPageMode to 'standard'").toBe(false);
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
    expect(survey.storeOthersAsComment, "Keep storeOthersAsComment false").toBe(false);
    expect(survey.getValue("q1")).toEqual(["other2"]);
    question = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    expect([...(question.value)], "question value").toEqual(["other2"]);
    expect([...(question.renderedValue)], "question renderedValue").toEqual(["other"]);
    expect(question.comment, "question comment").toEqual("other2");
    expect(survey.getValue("q1"), "survey value").toEqual(["other2"]);
    expect(survey.getComment("q1"), "survey comment").toEqual("");
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
    expect([...(question.value)], "question value").toEqual(["other2"]);
    expect([...(question.renderedValue)], "question renderedValue").toEqual(["other"]);
    expect(question.comment, "question comment").toEqual("other2");
    expect(survey.getValue("q1"), "survey value").toEqual(["other2"]);
    expect(survey.getComment("q1"), "survey comment").toEqual("");
  });
  test("survey.questionsOnPageMode = 'questionOnPage', page rows & currentSingleQuestion", () => {
    const survey = twoPageSimplestSurvey();
    const questions = survey.getAllQuestions(true);
    survey.questionsOnPageMode = "questionOnPage";
    expect(survey.pages.length, "We have the same number of pages").toBe(2);
    expect(survey.isSingleVisibleQuestion, "it is single visible question mode").toBe(true);
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion, #1").toBe(questions[0].name);
    expect(survey.pages[0].rows.length, "rows.length, #1").toBe(1);
    expect(survey.pages[0].rows[0].elements[0].name, "rows element, #1").toBe(questions[0].name);
    expect(survey.isShowPrevButton, "prev buttton, #1").toBe(false);
    expect(survey.isShowNextButton, "next buttton, #1").toBe(true);
    expect(survey.isCompleteButtonVisible, "next buttton, #1").toBe(false);
    survey.performNext();
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion, #2").toBe(questions[1].name);
    expect(survey.pages[0].rows.length, "rows.length, #2").toBe(1);
    expect(survey.pages[0].rows[0].elements[0].name, "rows element, #2").toBe(questions[1].name);
    expect(survey.isShowPrevButton, "prev buttton, #2").toBe(true);
    expect(survey.isShowNextButton, "next buttton, #2").toBe(true);
    expect(survey.isCompleteButtonVisible, "next buttton, #2").toBe(false);
    survey.performNext();
    expect(survey.currentPage.name, "currentSingleQuestion, #3").toBe("Page 2");
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion, #3").toBe(questions[2].name);
    expect(survey.pages[1].rows.length, "rows.length, #3").toBe(1);
    expect(survey.pages[1].rows[0].elements[0].name, "rows element, #3").toBe(questions[2].name);
    expect(survey.isShowPrevButton, "prev buttton, #3").toBe(true);
    expect(survey.isShowNextButton, "next buttton, #3").toBe(true);
    expect(survey.isCompleteButtonVisible, "next buttton, #3").toBe(false);
    survey.performNext();
    expect(survey.currentPage.name, "currentSingleQuestion, #4").toBe("Page 2");
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion, #4").toBe(questions[3].name);
    expect(survey.pages[1].rows.length, "rows.length, #4").toBe(1);
    expect(survey.pages[1].rows[0].elements[0].name, "rows element, #4").toBe(questions[3].name);
    expect(survey.isShowPrevButton, "prev buttton, #4").toBe(true);
    expect(survey.isShowNextButton, "next buttton, #4").toBe(false);
    expect(survey.isCompleteButtonVisible, "next buttton, #4").toBe(true);
    survey.performPrevious();
    expect(survey.currentPage.name, "currentSingleQuestion, #5").toBe("Page 2");
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion, #5").toBe(questions[2].name);
    expect(survey.pages[1].rows.length, "rows.length, #5").toBe(1);
    expect(survey.pages[1].rows[0].elements[0].name, "rows element, #5").toBe(questions[2].name);
    expect(survey.isShowPrevButton, "prev buttton, #5").toBe(true);
    expect(survey.isShowNextButton, "next buttton, #5").toBe(true);
    expect(survey.isCompleteButtonVisible, "next buttton, #5").toBe(false);
    survey.performPrevious();
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion, #6").toBe(questions[1].name);
    expect(survey.pages[0].rows.length, "rows.length, #6").toBe(1);
    expect(survey.pages[0].rows[0].elements[0].name, "rows element, #6").toBe(questions[1].name);
    expect(survey.isShowPrevButton, "prev buttton, #6").toBe(true);
    expect(survey.isShowNextButton, "next buttton, #6").toBe(true);
    expect(survey.isCompleteButtonVisible, "next buttton, #6").toBe(false);

    survey.questionsOnPageMode = "standard";
    expect(survey.pages[1].rows.length, "page1 standard rows.length").toBe(2);
    expect(survey.pages[1].rows.length, "page2 standard rows.length").toBe(2);
    expect(survey.currentSingleQuestion, "No current question in standard mode").toBeFalsy();
    expect(questions[0].page.name, "question1.page #1").toBe("Page 1");

    survey.questionsOnPageMode = "questionOnPage";
    expect(survey.pages.length, "We have the same number of pages").toBe(2);
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion, #6").toBe(questions[0].name);
    expect(questions[0].page.name, "question1.page #2").toBe("Page 1");

    survey.questionsOnPageMode = "singlePage";
    expect(survey.visiblePages.length, "one visible page").toBe(1);
    expect(survey.currentSingleQuestion, "No current question in single page").toBeFalsy();
    expect(questions[0].page.name, "question1.page #3").toBe("single-page");

    survey.questionsOnPageMode = "questionOnPage";
    expect(survey.pages.length, "We have the same number of pages").toBe(2);
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion, #7").toBe(questions[0].name);
    expect(questions[0].page.name, "question1.page #4").toBe("Page 1");
  });
  test("survey.questionsOnPageMode = 'questionOnPage' & survey.clear", () => {
    const survey = twoPageSimplestSurvey();
    const questions = survey.getAllQuestions(true);
    survey.questionsOnPageMode = "questionOnPage";
    survey.performNext();
    survey.performNext();
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion, #1").toBe(questions[2].name);
    survey.clear();
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion, #2").toBe(questions[0].name);
  });

  test("survey.questionsOnPageMode, property test", () => {
    var survey = twoPageSimplestSurvey();
    var questions = survey.getAllQuestions();
    survey.questionsOnPageMode = "questionOnPage";
    expect(survey.pages.length, "We have the same number of pages").toBe(2);
    expect(survey.isSingleVisibleQuestion, "it is single visible question mode").toBe(true);
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion, #1").toBe(questions[0].name);
    expect(survey.pages[0].rows.length, "rows.length, #1").toBe(1);
    expect(survey.pages[0].rows[0].elements[0].name, "rows element, #1").toBe(questions[0].name);
    expect(survey.isShowPrevButton, "prev buttton, #1").toBe(false);
    expect(survey.isShowNextButton, "next buttton, #1").toBe(true);
    expect(survey.isCompleteButtonVisible, "next buttton, #1").toBe(false);

    survey.questionsOnPageMode = "singlePage";
    expect(survey.visiblePages.length, "We have one page").toBe(1);
    expect(survey.currentPage.questions.length, "All questions on single page").toBe(questions.length);
    expect(questions[0].page.name, "question1.page #1").toBe("single-page");

    survey.questionsOnPageMode = "standard";
    expect(survey.visiblePages.length, "Origional pages, #2").toBe(2);
    expect(survey.visiblePages[0].questions.length, "There are two questions on the origional first page, #2").toBe(2);
    expect(questions[0].page.name, "question1.page #2").toBe("Page 1");
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
    expect([...(q2.value)], "Set default value").toEqual(["item1"]);
    expect([...(q2.renderedValue)], "Set default value into rendered value").toEqual(["item1"]);
    survey.data = {};
    q1.isRequired = true;
    expect(survey.tryComplete(), "You can't complete the last page").toBe(false);
  });

  test("Survey page hasShown", () => {
    var survey = twoPageSimplestSurvey();
    expect(survey.pages[0].hasShown, "The first page was shown").toBe(true);
    expect(survey.pages[1].hasShown, "The second page was not shown").toBe(false);
    expect(survey.pages[1].hasShown, "The second page was not shown").toBe(false);
    survey.nextPage();
    expect(survey.pages[1].hasShown, "The second page was shown").toBe(true);
    survey.clear();
    expect(survey.pages[1].hasShown, "The second page hasShown is false again").toBe(false);
  });
  test("Questions are randomized", () => {
    var survey = twoPageSimplestSurvey();
    var page = survey.pages[0];
    expect(page.areQuestionsRandomized, "By default questions are not randomized").toBe(false);
    page.questionOrder = "random";
    expect(page.areQuestionsRandomized, "page.questionOrder = 'random'").toBe(true);
    page.questionOrder = "default";
    expect(page.areQuestionsRandomized, "page.questionOrder = 'default'").toBe(false);
    survey.questionOrder = "random";
    expect(page.areQuestionsRandomized, "survey.questionOrder = 'random' && page.questionOrder = 'default'").toBe(true);
    page.questionOrder = "initial";
    expect(page.areQuestionsRandomized, "page.questionOrder = 'initial'").toBe(false);
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
    expect(page.elements[0].name).toBe("p3");
    expect(page.elements[3].name).toBe("q1");
    expect(p1.elements[0].name).toBe("p1q2");
    expect(p1.elements[1].name).toBe("p1q1");
    expect(p2.elements[0].name).toBe("p2q1");
    expect(p2.elements[1].name).toBe("p2q2");
    expect(p3.elements[0].name).toBe("p3q2");
    expect(p3.elements[1].name).toBe("p3q1");

    delete json.pages[0].questionOrder;
    survey = new SurveyModel(json);
    page = survey.pages[0];
    p1 = survey.getPanelByName("p1");
    p2 = survey.getPanelByName("p2");
    p3 = survey.getPanelByName("p3");
    page.onFirstRendering();
    expect(page.elements[0].name).toBe("q1");
    expect(page.elements[3].name).toBe("p3");
    expect(p1.elements[0].name).toBe("p1q1");
    expect(p1.elements[1].name).toBe("p1q2");
    expect(p2.elements[0].name).toBe("p2q1");
    expect(p2.elements[1].name).toBe("p2q2");
    expect(p3.elements[0].name).toBe("p3q2");
    expect(p3.elements[1].name).toBe("p3q1");

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
    expect(page.elements[0].name).toBe("q3");
    expect(page.elements[2].name).toBe("q1");
    expect(survey.currentSingleQuestion.name, "The first question is q3").toBe("q3");
    survey.performNext();
    survey.performNext();
    survey.performNext();
    expect(survey.currentSingleQuestion.name, "The current question is q6").toBe("q6");

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
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion #1").toBe("q1");
    expect(survey.isFirstPage, "isFirstPage #1").toBe(true);
    expect(survey.isLastPage, "isLastPage #1").toBe(false);
    survey.nextPage();
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion #2").toBe("q2");
    expect(survey.isFirstPage, "isFirstPage #2").toBe(false);
    expect(survey.isLastPage, "isLastPage #2").toBe(false);
    survey.nextPage();
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion #3").toBe("q3");
    expect(survey.isFirstPage, "isFirstPage #3").toBe(false);
    expect(survey.isLastPage, "isLastPage #3").toBe(false);
    survey.nextPage();
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion #4").toBe("q4");
    expect(survey.isFirstPage, "isFirstPage #4").toBe(false);
    expect(survey.isLastPage, "isLastPage #4").toBe(true);
    survey.prevPage();
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion #5").toBe("q3");
    expect(survey.isFirstPage, "isFirstPage #5").toBe(false);
    expect(survey.isLastPage, "isLastPage #5").toBe(false);
    survey.prevPage();
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion #6").toBe("q2");
    expect(survey.isFirstPage, "isFirstPage #6").toBe(false);
    expect(survey.isLastPage, "isLastPage #6").toBe(false);
    survey.prevPage();
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion #7").toBe("q1");
    expect(survey.isFirstPage, "isFirstPage #7").toBe(true);
    expect(survey.isLastPage, "isLastPage #7").toBe(false);
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
    expect(survey.getAllQuestions().length, "There are 4 questions in total").toBe(4);
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
    expect(survey.getAllQuestions().length, "There are 6 questions in total").toBe(6);
    expect(survey.getCorrectedAnswers(), "The number of corrected answers is 0").toBe(0);
    expect(survey.getInCorrectedAnswers(), "The number of incorrected answers is 4").toBe(4);
    survey.getQuestionByName("q1").visible = false;
    expect(survey.getInCorrectedAnswers(), "The number of incorrected answers is 3").toBe(3);
    (<Question>survey.getQuestionByName("q2")).value = "q2";
    expect(survey.getCorrectedAnswers(), "The number of corrected answers is 1").toBe(1);
    expect(survey.getInCorrectedAnswers(), "The number of incorrected answers is 2").toBe(2);
    (<Question>survey.getQuestionByName("q3")).value = "q10";
    (<Question>survey.getQuestionByName("q4")).value = "q4";
    expect(survey.getCorrectedAnswers(), "The number of corrected answers is 2").toBe(2);
    expect(survey.getInCorrectedAnswers(), "The number of incorrected answers is 1").toBe(1);
    (<Question>survey.getQuestionByName("q4")).visible = false;
    expect(survey.getCorrectedAnswers(), "The number of corrected answers is 1").toBe(1);
    expect(survey.getInCorrectedAnswers(), "The number of incorrected answers is 1").toBe(1);
    (<Question>survey.getQuestionByName("q4")).visible = true;
    expect(survey.processedCompletedHtml, "competed html is correct").toBe("2, 1, 3");
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
    expect(survey.getCorrectedAnswers(), "No correct answer").toBe(0);
    survey.setValue("q1", "answer");
    expect(survey.getCorrectedAnswers(), "Still no correct answer").toBe(0);
    survey.setValue("q1", "myanswer");
    expect(survey.getCorrectedAnswers(), "the answer is correct").toBe(1);
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
    expect(survey.getCorrectedAnswers(), "No correct answer").toBe(0);
    survey.setValue("root", {
      "text1": "text1",
      "text2": "text2"
    });
    expect(survey.getCorrectedAnswers(), "Check as case insensitive").toBe(1);
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
    expect(survey.calculatedValues[0].value, "correctedAnswers").toBe(1);
    expect(survey.calculatedValues[1].value, "inCorrectedAnswers").toBe(2);
    expect(survey.calculatedValues[2].value, "questionCount").toBe(3);
    survey.setValue("q2", "val2");
    expect(survey.calculatedValues[0].value, "correctedAnswers #2").toBe(2);
    expect(survey.calculatedValues[1].value, "inCorrectedAnswers #2").toBe(1);
    expect(survey.calculatedValues[2].value, "questionCount #2").toBe(3);
  });
  test("Store data on the first page, firstPageIsStartPage = true, Bug #1580", () => {
    var survey = twoPageSimplestSurvey();
    var questionCount = survey.getAllQuestions().length;
    var page = new PageModel("start");
    page.addNewQuestion("text", "name");
    page.addNewQuestion("text", "email");
    survey.pages.unshift(page);
    expect(questionCount + 2, "Two questions have been added").toBe(survey.getAllQuestions().length);
    survey.firstPageIsStartPage = true;
    expect(questionCount + 2, "Two questions on the first page are still here").toBe(survey.getAllQuestions().length);
    expect(survey.getQuestionByName("name").name, "Question is here").toBe("name");
    survey.getQuestionByName("name").value = "John";
    survey.getQuestionByName("email").value = "john@gmail.com";
    survey.start();
    expect(survey.data, "Data on the first page is saved").toEqual({ name: "John", email: "john@gmail.com" });
    survey.doComplete();
    expect(survey.data, "Data on the first page is still here after complete.").toEqual({ name: "John", email: "john@gmail.com" });
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
    expect(survey.state, "We are starting").toBe("starting");
    var res = survey.start();
    expect(res, "We could not start").toBe(false);
    expect(survey.state, "We are still starting").toBe("starting");
    expect(survey.state, "We are not starting yet").not.toBe("running");
    survey.setValue("name", "some name");
    res = survey.start();
    expect(res, "We could start").toBe(true);
    expect(survey.state, "We are running").toBe("running");
    expect(survey.currentPage.name).toBe("First Page");
  });

  test("Quiz, correct, incorrect answers and onCheckAnswerCorrect event", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("page");
    var q1 = <QuestionCheckboxModel>page.addNewQuestion("checkbox", "q1");
    q1.choices = [1, 2, 3, 4];
    q1.correctAnswer = [2, 3];
    q1.value = [1];
    expect(survey.getQuizQuestions().length, "survey.getQuizQuestions().length").toBe(1);
    expect(survey.getCorrectAnswerCount(), "The answer is incorrect, #1").toBe(0);
    q1.value = [3, 2];
    expect(q1.correctAnswerCount, "q1.correctAnswerCount, #1").toBe(1);
    expect(survey.getCorrectAnswerCount(), "The answer is correct now, #2").toBe(1);
    let counter = 0;
    survey.onCheckAnswerCorrect.add(function (survey, options) {
      counter++;
      const q = options.question;
      options.result = Helpers.isTwoValueEquals(q.value, q.correctAnswer, false);
    });
    expect(q1.correctAnswerCount, "q1.correctAnswerCount, #2").toBe(0);
    expect(counter, "counter #1").toBe(1);
    expect(survey.getCorrectedAnswerCount(), "The order is important now, #3").toBe(0);
    expect(counter, "counter #2").toBe(2);
    q1.value = [2, 3];
    expect(survey.getCorrectedAnswerCount(), "The order is correct, #4").toBe(1);
    expect(counter, "counter #3").toBe(3);
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
    expect(survey.getCorrectedAnswerCount(), "It is case sensitive").toBe(0);
    survey.setValue("q1", "hi");
    expect(survey.getCorrectedAnswerCount(), "It is correct").toBe(1);
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
    expect(survey.getCorrectedAnswers(), "There is no correct answers yet").toBe(0);
    expect(survey.getQuizQuestionCount(), "one text + 3 matrix").toBe(4);
    survey.setValue("q1", "val1");
    survey.setValue("q2", { row1: "col1", row2: "col1", row3: "col1" });
    expect(survey.getCorrectedAnswers(), "1 in text question + 2 in matrix").toBe(3);
    expect(survey.getInCorrectedAnswers(), "1 in matrix").toBe(1);
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
    expect(counter, "counter #1").toBe(0);
    expect(q1.isAnswerCorrect(), "Value is empty").toBe(false);
    expect(counter, "counter #2").toBe(0);
    q1.value = 1;
    expect(q1.isAnswerCorrect(), "q1.value = 1").toBe(true);
    expect(counter, "counter #3").toBe(1);
    q1.value = 5;
    expect(q1.isAnswerCorrect(), "q1.value = 5").toBe(false);
    expect(counter, "counter #4").toBe(2);
    q1.value = 2;
    expect(q1.isAnswerCorrect(), "q1.value = 2").toBe(true);
    expect(counter, "counter #5").toBe(3);
    q2.value = 3;
    expect(q2.isAnswerCorrect(), "q2.value = 3").toBe(true);
    expect(counter, "counter #6").toBe(4);
    expect(q2.isAnswerCorrect(), "q2.value = 3").toBe(true);
    expect(counter, "counter #7").toBe(5);
  });
  test("Quiz, correct, trim value on checking correct answers, https://surveyjs.answerdesk.io/ticket/details/T6569", () => {
    var survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1", correctAnswer: "val1 " },
        { type: "text", name: "q2", correctAnswer: " val2" },
        { type: "text", name: "q3", correctAnswer: "val3" },
      ],
    });
    expect(survey.getCorrectedAnswers(), "There is no correct answers yet").toBe(0);
    survey.setValue("q1", "val1");
    survey.setValue("q2", "val2 ");
    survey.setValue("q3", " val3 ");
    expect(survey.getCorrectedAnswers(), "trim values").toBe(3);
  });
  test("survey.onGetQuestionTitle event. Update unit test for bug: #2298", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("page");
    var question = <Question>page.addNewQuestion("text", "question1");
    expect(question.fullTitle, "by default it is question name if title is empty").toBe("question1");
    var questionName = "";
    survey.onGetQuestionTitle.add(function (survey, options) {
      questionName = options.question.name;
      if (options.question.title == options.question.name) options.title = "";
    });
    expect(question.fullTitle, "it is empty now").toBe("");
    //check bug: #2298
    expect(questionName, "options.question is corrrect").toBe("question1");
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
    expect(page2.visible, "Page object doesn't run condition at design").toBe(true);
    expect(panel.visible, "Panel object doesn't run condition at design").toBe(true);
    expect(question.readOnly, "Question object doesn't run condition at design").toBe(false);
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
    expect(qTest.isVisible, "It is invisible by default").toBe(false);
    q1.value = "1";
    expect(qTest.isVisible, "q2 is empty").toBe(false);
    q2.value = "2";
    expect(qTest.isVisible, "q2 is not e-mail").toBe(false);
    q2.value = "email@mail.com";
    expect(qTest.isVisible, "isContainerReady returns true").toBe(true);
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
    expect(question.isVisible, "first and last is not selected").toBe(false);
    question.value = [1, 2];
    expect(question.isVisible, "first and last is not selected yet").toBe(false);
    question.value = [1, 3, 5];
    expect(question.isVisible, "first and last is selected").toBe(true);
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
    expect(survey.getValue("onename"), "The value set correctly").toEqual(["item1"]);
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

    expect(q2.isVisible, "Initially q2 is invisible").toBe(false);
    expect(q3.isVisible, "Initially q3 is invisible").toBe(false);
    survey.setValue("q1", 2);
    expect(q2.isVisible, "q1=2, q2 is visible").toBe(true);
    expect(q3.isVisible, "q1=2, q3 is invisible").toBe(false);
    survey.setValue("q1", 3);
    expect(q2.isVisible, "q1=3, q2 is invisible").toBe(false);
    expect(q3.isVisible, "q1=3, q3 is visible").toBe(true);
  });
  test("survey.onVisibleChanged & survey.onQuestionVisibleChanged are same events", () => {
    const survey = new SurveyModel();
    expect(survey.onVisibleChanged.length, "#1 onVisibleChanged.length").toBe(0);
    expect(survey.onQuestionVisibleChanged.length, "#1 onQuestionVisibleChanged.length").toBe(0);
    survey.onQuestionVisibleChanged.add((sender, options) => { });
    expect(survey.onVisibleChanged.length, "#2 onVisibleChanged.length").toBe(1);
    expect(survey.onQuestionVisibleChanged.length, "#2 onQuestionVisibleChanged.length").toBe(1);
    survey.onQuestionVisibleChanged.clear();
    expect(survey.onVisibleChanged.length, "#3 onVisibleChanged.length").toBe(0);
    expect(survey.onQuestionVisibleChanged.length, "#3 onQuestionVisibleChanged.length").toBe(0);
    survey.onVisibleChanged.add((sender, options) => { });
    expect(survey.onVisibleChanged.length, "#4 onVisibleChanged.length").toBe(1);
    expect(survey.onQuestionVisibleChanged.length, "#4 onQuestionVisibleChanged.length").toBe(1);
    survey.onVisibleChanged.clear();
    expect(survey.onVisibleChanged.length, "#5 onVisibleChanged.length").toBe(0);
    expect(survey.onQuestionVisibleChanged.length, "#5 onQuestionVisibleChanged.length").toBe(0);
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
    expect(qAge.isVisible, "It is hidden by default").toBe(false);
    survey.setValue("1-2+3", "John");
    expect(qAge.isVisible, "It is visible now").toBe(true);
    expect(qAge.locTitle.renderedHtml, "title processed correctly").toBe("Hi, John");
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
    expect(qchoosePlatform.isVisible, "choosePlatform is not visible initial").toBe(false);
    expect(qinstallLinux.isVisible, "installLinux is not visible initial").toBe(false);
    survey.setValue("issueType", "installJaxx");
    expect(qchoosePlatform.isVisible, "choosePlatform is visible step 1").toBe(true);
    expect(qinstallLinux.isVisible, "installLinux is not visible step 1").toBe(false);
    survey.setValue("choosePlatform", "linux");
    expect(qchoosePlatform.isVisible, "choosePlatform is visible step 2").toBe(true);
    expect(qinstallLinux.isVisible, "installLinux is visible step 2").toBe(true);
    survey.setValue("issueType", "backupPhrase");
    expect(qchoosePlatform.isVisible, "choosePlatform is visible step 3").toBe(false);
    expect(qchoosePlatform.isEmpty(), "choosePlatform is empty step 3").toBe(true);
    expect(qinstallLinux.isVisible, "installLinux is not visible step 3").toBe(false);
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
    expect(question2.isReadOnly, "It is not readOnly by default").toBe(false);
    survey.setValue("val1", 2);
    expect(question1.isReadOnly, "question1 is readOnly").toBe(true);
    expect(question2.isReadOnly, "question2 is readOnly").toBe(true);
    expect(panel1.isReadOnly, "panel1 is readOnly").toBe(true);
    expect(panel2.isReadOnly, "panel2 is readOnly").toBe(true);

    var question3 = <Question>panel2.addNewQuestion("text", "question3");
    expect(question3.isReadOnly, "question3 is readOnly").toBe(true);

    survey.setValue("val1", 1);
    expect(question2.isReadOnly, "question2 is editable").toBe(false);

    panel2.readOnly = true;
    expect(question1.isReadOnly, "question1 is not readOnly, panel2 is ReadOnly").toBe(false);
    expect(question2.isReadOnly, "question2 is readOnly, panel2 is ReadOnly").toBe(true);
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
    expect(question.fullTitle, "It has number 3").toBe("q3");
    survey.pages[1].questionTitleLocation = "hidden";
    expect(question.fullTitle, "It has number 2 now").toBe("q3");
  });

  test("Could not assign value into mutlipletext question, #1229", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("page1");
    var question = new QuestionMultipleTextModel("q1");
    question.addItem("item1");
    question.addItem("item2");
    page.addQuestion(question);
    survey.data = { q1: { item1: "val1", item2: "val2" } };
    expect(question.items[0].editor.value, "val1 is set to the question item").toBe("val1");
    expect(question.items[1].editor.value, "val1 is set to the question item").toBe("val2");
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
    expect(survey.processTextEx({ text: "test: {a1.b2}" }).text, "#1").toBe("test: abc");
    expect(survey.processTextEx({ text: "test: {c: {a1.b2}}" }).text, "#2").toBe("test: {c: abc}");
    expect(survey.processTextEx({ text: "test: { c: {a1.b2} }" }).text, "#3").toBe("test: { c: abc }");
    expect(survey.processTextEx({ text: "test: {c: \"{a1.b2}\"}" }).text, "#4").toBe("test: {c: \"abc\"}");
    expect(survey.processTextEx({ text: "test: { c: \"{a1.b2}\" }" }).text, "#5.1").toBe("test: { c: \"abc\" }");
    expect(survey.processTextEx({ text: "test: { c: \"{a1.b2}\" }" }).hasAllValuesOnLastRun, "#5.2").toBe(true);
    expect(survey.processTextEx({ text: "inputs={\"car_make\": \"{a1.b2}\"}" }).text, "#6.1").toBe("inputs={\"car_make\": \"abc\"}");
    expect(survey.processTextEx({ text: "inputs={\"car_make\": \"{a1.b2}\"}" }).hasAllValuesOnLastRun, "#6.2").toBe(true);
    expect(survey.processTextEx({ text: "inputs={\"car_make\": \"abc\"}" }).text, "#7.1").toBe("inputs={\"car_make\": \"abc\"}");
    expect(survey.processTextEx({ text: "inputs={\"car_make\": \"abc\"}" }).hasAllValuesOnLastRun, "#7.2").toBe(true);
  });
  test("ProcessTextEx replaceUndefinedValues is true, Bug#9417", () => {
    const survey = new SurveyModel();
    survey.setVariable("a1", "abc");
    expect(survey.processTextEx({ text: "test: {a1},{a2}" }).text, "#1").toBe("test: abc,{a2}");
    expect(survey.processTextEx({ text: "test: {a1},{a2}", replaceUndefinedValues: true }).text, "#2").toBe("test: abc,");
    expect(survey.processText("test: {a1},{a2}", false), "#3").toBe("test: abc,{a2}");
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
    expect(q1.locTitle.renderedHtml, "q1.title #1").toBe("Hi ");
    expect(q2.locTitle.renderedHtml, "q2.title #1").toBe("");
    q1.value = "John";
    q2.value = "Doe";
    expect(q1.locTitle.renderedHtml, "q1.title #2").toBe("Hi John");
    expect(q2.locTitle.renderedHtml, "q2.title #3").toBe("Doe");
    q1.clearValue();
    q2.clearValue();
    expect(q1.locTitle.renderedHtml, "q1.title #3").toBe("Hi ");
    expect(q2.locTitle.renderedHtml, "q2.title #3").toBe("");
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
    expect(q1.locTitle.renderedHtml, "q1.title #1").toBe("Hi {var1}");
    expect(q2.locTitle.renderedHtml, "q2.title #1").toBe("{var2}");
    survey.setVariable("var1", "John");
    survey.setVariable("var2", "Doe");
    expect(q1.locTitle.renderedHtml, "q1.title #2").toBe("Hi John");
    expect(q2.locTitle.renderedHtml, "q2.title #3").toBe("Doe");
    survey.setVariable("var1", "");
    survey.setVariable("var2", "");
    expect(q1.locTitle.renderedHtml, "q1.title #3").toBe("Hi ");
    expect(q2.locTitle.renderedHtml, "q2.title #3").toBe("");
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
    expect(q1.locTitle.renderedHtml, "q1.title #1").toBe("test:");
    qa.value = 1;
    expect(q1.locTitle.renderedHtml, "q1.title #2").toBe("test:Item1");
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
    expect(JSON.stringify(survey.data), "Panel Dynamic is invisible").toBe("{}");
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
    expect(completedCounter, "The survey is completed one time").toBe(1);
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
    expect(survey.state, "Survey is completed").toBe("completed");
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
    expect(survey.state, "Survey is completed").toBe("completed");
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
    expect(survey.currentPageNo).toBe(0);
    survey.nextPage();
    expect(survey.state, "Survey is not completed").toBe("running");
    expect(survey.currentPageNo, "go next page").toBe(1);
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
    expect(survey.currentPageNo, "Stay on the first page").toBe(0);
    question.clearValue();
    question.inputType = "email";
    question.value = "a@a.com";
    expect(survey.currentPageNo, "Stay on the first page").toBe(0);
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
    expect(q2.isVisible, "It is invisible by default").toBe(false);
    q1.value = "a";
    expect(q2.isVisible, "It is visible now").toBe(true);
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
    expect(survey.currentPage.name, "the current page is correct").toBe("0608");
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
    expect(survey.visiblePageCount, "Only one page is visible").toBe(1);
    expect(survey.pages[1].isVisible, "The second page is invisible").toBe(false);
    survey.setValue("question2", "item1");
    expect(survey.visiblePageCount, "Two pages are visible").toBe(2);
    survey.setValue("question2", "item2");
    expect(survey.visiblePageCount, "One page is visible again").toBe(1);
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
    expect(question.locTitle.renderedHtml, "Do not process anything at design time").toBe("{question1} test");
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
    expect(survey.visiblePages.length, "There is one visible page").toBe(1);
    expect(survey.getQuestionByName("question2").isVisible, "question2 is invisible").toBe(false);
    expect(survey.getQuestionByName("question2").getPropertyValue("isVisible"), "question2 is invisible, property value").toBe(false);
    expect(survey.getQuestionByName("question4").visibleChoices.length, "There is zero visible choices").toBe(0);
    survey.showInvisibleElements = true;
    expect(survey.visiblePages.length, "There are two visible pages").toBe(2);
    expect(survey.getQuestionByName("question2").isVisible, "question2 is visible").toBe(true);
    expect(survey.getQuestionByName("question2").getPropertyValue("isVisible"), "question2 is visible, propertyValue").toBe(true);
    expect(survey.getQuestionByName("question4").visibleChoices.length, "There are two visible choices").toBe(2);
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
    expect(survey.getQuestionByName("q1").visibleChoices.length, "There are two visible choices").toBe(2);
    expect(survey.getQuestionByName("q2").visibleColumns.length, "There are two visible columns").toBe(2);
    expect(survey.getQuestionByName("q2").visibleRows.length, "There are two visible rows").toBe(2);
  });

  test("survey.showInvisibleElements property & question invisible css style, Bug#9002", () => {
    const survey = new SurveyModel();
    survey.css = { question: { invisible: "sd-element--invisible" } };
    expect(survey.css.question.invisible, "survey css is updated").toBe("sd-element--invisible");
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
    expect(q2.visible, "visible is false, #1").toBe(false);
    expect(q2.isVisible, "isVisible is true, #1").toBe(true);
    expect(q2.getRootCss().indexOf("sd-element--invisible") > -1, "#1").toBe(true);
    q1.value = true;
    expect(q2.visible, "visible is false, #2").toBe(true);
    expect(q2.isVisible, "isVisible is true, #2").toBe(true);
    expect(q2.getRootCss().indexOf("sd-element--invisible") > -1, "#2").toBe(false);
    q1.value = false;
    expect(q2.visible, "visible is false, #3").toBe(false);
    expect(q2.isVisible, "isVisible is true, #3").toBe(true);
    expect(q2.getRootCss().indexOf("sd-element--invisible") > -1, "#3").toBe(true);
    survey.showInvisibleElements = false;
    expect(q2.visible, "visible is false, #4").toBe(false);
    expect(q2.isVisible, "isVisible is true, #4").toBe(false);
    expect(q2.getRootCss().indexOf("sd-element--invisible") > -1, "#4").toBe(false);
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
    expect(survey.navigationBar.getActionById("sv-nav-complete").isVisible, "sv-nav-complete, #1").toBe(true);
    expect(survey.navigationBar.getActionById("sv-nav-next").isVisible, "sv-nav-next, #1").toBe(false);
    survey.showInvisibleElements = true;
    expect(survey.navigationBar.getActionById("sv-nav-complete").isVisible, "sv-nav-complete, #2").toBe(false);
    expect(survey.navigationBar.getActionById("sv-nav-next").isVisible, "sv-nav-next, #2").toBe(true);
    survey.showInvisibleElements = false;
    expect(survey.navigationBar.getActionById("sv-nav-complete").isVisible, "sv-nav-complete, #3").toBe(true);
    expect(survey.navigationBar.getActionById("sv-nav-next").isVisible, "sv-nav-next, #3").toBe(false);
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
    expect(survey.visiblePageCount, "There is one visible page").toBe(1);
    expect(counter, "counter is 0").toBe(0);
    survey.setValue("question1", "item1");
    expect(survey.visiblePageCount, "There are two visible pages").toBe(2);
    expect(counter, "counter is 1").toBe(1);
    survey.setValue("question1", "item2");
    expect(survey.visiblePageCount, "There is one visible page again").toBe(1);
    expect(counter, "counter is 2").toBe(2);
  });

  test("Change renderWidth on width change, Editor Bug #422", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("page");
    var panel = page.addNewPanel("p1");
    panel.addNewQuestion("text", "q1");
    var question = page.addNewQuestion("text", "q2");
    question.width = "100px";
    panel.width = "200px";
    expect(question.renderWidth, "row set question.renderWidth to it's width").toBe("100px");
    expect(panel.renderWidth, "row set panel.renderWidth to it's width").toBe("200px");
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

    expect(q1.getProcessedText("{q1}"), "Get question value").toBe("1");
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

    expect(survey.getProcessedText("{q1}"), "Get question value").toBe("1");
  });
  test("Process text for question with value, no value and non existing", () => {
    const survey = new SurveyModel({
      elements: [{ type: "text", name: "q1", defaultValue: "val" }, { type: "text", name: "q2" }]
    });
    expect(survey.getProcessedText("{q1}+{q2}+{q3}"), "show value, show empty string, show as it is").toBe("val++{q3}");
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
    expect(survey.data).toEqual(data);
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
    expect(counter, "onValueChanged called two times").toEqual(2);
    survey.doComplete();
    expect(counter, "onValueChanged called still two times").toEqual(2);
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
    expect(counter, "onValueChanged called still two times").toBe(1);
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
    expect(plainData.length, "all questions are present").toBe(survey.getAllQuestions().length);
    expect(plainData[0].name).toBe("question1");
    expect(plainData[0].title).toBe("text");
    expect(plainData[0].value).toBe("Answer 1");
    expect(plainData[0].displayValue).toBe("Answer 1");
    expect(plainData[0].isNode).toBeFalsy();

    expect(plainData[1].name).toBe("question3");
    expect(plainData[1].title).toBe("checkbox");
    expect([...(plainData[1].value)]).toEqual(["item1", "item2"]);
    expect(plainData[1].displayValue).toEqual("item1, item2");
    expect(plainData[1].isNode).toBeTruthy();
    expect(plainData[1].data.length).toBe(2);
    expect(plainData[1].data[0].value).toBe("item1");
    expect(plainData[1].data[0].displayValue).toBe("item1");
    expect(plainData[1].data[1].value).toBe("item2");
    expect(plainData[1].data[1].displayValue).toBe("item2");

    expect(plainData[2].name).toBe("question4");
    expect(plainData[2].title).toBe("radiogroup");
    expect(plainData[2].value).toBe("item3");
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
    expect(plainData.length, "all questions are present").toBe(12);
    expect(plainData[0].value).toEqual(3);
    expect(plainData[0].score).toBe(11);
    expect(plainData[0].isNode).toBe(false);
    expect(plainData[1].value).toEqual("item2");
    expect(plainData[1].score).toBe(12);
    expect(plainData[1].isNode).toBe(true);
    expect(plainData[1].data[0].score).toBe(2);
    expect(plainData[2].value).toEqual("some text 13");
    expect(plainData[2].score).toBe(13);
    expect([...(plainData[3].value)]).toEqual(["item2", "item3"]);
    expect(plainData[3].score).toBe(14);
    expect(plainData[4].value).toEqual("item1");
    expect(plainData[4].score).toBe(1);
    expect(plainData[5].value).toEqual("comment2");
    expect(plainData[5].score).toBe(2);
    expect(plainData[6].value).toEqual("giraffe");
    expect(plainData[6].score).toBe(3);
    expect(plainData[7].value).toEqual([
      {
        content: "data:image/x-icon;base64,A=",
        name: "favicon.ico",
        type: "image/x-icon",
      },
    ]);
    expect(plainData[7].score).toBe(4);
    expect(plainData[8].value).toEqual({ text1: "a", text2: "b" });
    expect(plainData[8].score).toBe(5);
    expect(plainData[9].value).toEqual({
      "Row 1": { "Column 1": 1, "Column 2": 2, "Column 3": 3 },
      "Row 2": { "Column 1": 4, "Column 2": 5, "Column 3": 4 },
    });
    expect(plainData[9].score).toBe(9);

    expect(plainData[10].value).toEqual({
      "Row 1": "Column 1",
      "Row 2": "Column 2",
    });
    expect(plainData[10].score).toBe(10);
    expect(plainData[10].data[0].score).toBe(1);
    expect(plainData[10].data[1].score).toBe(2);

    expect(plainData[11].value).toEqual([
      { question21: "Panel dynamic content 1" },
      { question21: "Panel dynamic content 2" },
    ]);
    expect(plainData[11].score).toBe(8);

    expect(plainData[3].isNode).toBeTruthy();
    expect(plainData[3].data.length).toBe(2);
    expect(plainData[3].data[0].value).toBe("item2");
    expect(plainData[3].data[0].displayValue).toBe("item2");
    expect(plainData[3].data[1].value).toBe("item3");
    expect(plainData[3].data[1].displayValue).toBe("item3");

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
    expect(plainData.score).toBe(3);
    expect(plainData.value).toEqual("giraffe");
    expect(plainData.isNode).toBe(true);
    expect(plainData.data[0].score).toBe(2);
    expect(plainData.data[0].value).toEqual("giraffe");

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
    expect(plainData.score).toBe(3);
    expect([...(plainData.value)]).toEqual(["giraffe", "panda"]);
    expect(plainData.displayValue).toEqual("giraffe22, panda");
    expect(plainData.isNode).toBe(true);
    expect(plainData.data[0].score).toBe(2);
    expect(plainData.data[0].value).toEqual("giraffe");
    expect(plainData.data[0].displayValue).toEqual("giraffe22");
    expect(plainData.data[1].score).toBe(3);
    expect(plainData.data[1].value).toEqual("panda");

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
    expect(plainData.score).toBe(4);
    expect(plainData.value).toEqual([
      {
        name: "favicon.ico",
        type: "image/x-icon",
        content: "data:image/x-icon;base64,A=",
      },
    ]);
    expect(plainData.displayValue).toEqual([
      {
        name: "favicon.ico",
        type: "image/x-icon",
        content: "data:image/x-icon;base64,A=",
      },
    ]);
    expect(plainData.isNode).toBe(false);
    expect(plainData.data[0].value).toEqual("data:image/x-icon;base64,A=");
    expect(plainData.data[0].displayValue).toEqual("favicon.ico");

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
    expect(plainData.score).toBe(10);
    expect(plainData.value).toEqual({
      "Row 1": "Column 1",
      "Row 2": "Column 2",
    });
    expect(plainData.displayValue).toEqual({
      "Row 1 title": "Column 1",
      "Row 2": "Column 2",
    });
    expect(plainData.isNode).toBe(true);
    expect(plainData.data[0].name).toEqual("Row 1");
    expect(plainData.data[0].title).toEqual("Row 1 title");
    expect(plainData.data[0].value).toEqual("Column 1");
    expect(plainData.data[0].displayValue).toEqual("Column 1");
    expect(plainData.data[0].score).toEqual(1);
    expect(plainData.data[1].name).toEqual("Row 2");
    expect(plainData.data[1].value).toEqual("Column 2");
    expect(plainData.data[1].displayValue).toEqual("Column 2");
    expect(plainData.data[1].score).toEqual(2);

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
    expect(plainData.score).toBe(9);
    expect(plainData.value).toEqual({
      "Row 1": { "Column 1": 1, "Column 2": "2", "Column 3": 3 },
      "Row 2": { "Column 1": 4, "Column 2": "5", "Column 3": 4 },
    });
    expect(plainData.displayValue).toEqual({
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
    expect(plainData.isNode).toBe(true);
    expect(plainData.data.length, "Two rows in matrix").toBe(2);
    expect(plainData.data[0].name).toEqual("Row 1");
    expect(plainData.data[0].title).toEqual("Row 1 Title");
    expect(plainData.data[0].value).toEqual({
      "Column 1": 1,
      "Column 2": 2,
      "Column 3": 3,
    });
    expect(plainData.data[0].displayValue).toEqual({
      "Column 1": "1",
      "Column 2": "2",
      "Column 3": "3",
    });
    expect(plainData.data[1].name).toEqual("Row 2");
    expect(plainData.data[1].value).toEqual({
      "Column 1": 4,
      "Column 2": 5,
      "Column 3": 4,
    });
    expect(plainData.data[1].displayValue).toEqual({
      "Column 1": "4",
      "Column 2": "5",
      "Column 3": "4",
    });

    expect(plainData.data[0].isNode).toBe(true);
    expect(plainData.data[0].data.length, "Three columns (questions) in matrix row").toBe(3);

    expect(plainData.data[0].data[0].name, "column1 name").toBe("Column 1");
    expect(plainData.data[0].data[0].title, "column1 title").toBe("Column 1");
    expect(plainData.data[0].data[0].value).toBe(1);
    expect(plainData.data[0].data[0].displayValue).toBe("1");
    expect(plainData.data[0].data[0].score).toBeUndefined();
    expect(plainData.data[0].data[0].isNode).toBe(true);

    expect(plainData.data[0].data[0].data[0].score).toBe(1);
    expect(plainData.data[0].data[0].data[0].name).toBe(0);
    expect(plainData.data[0].data[0].data[0].title).toBe("Choice option");
    expect(plainData.data[0].data[0].data[0].value).toBe(1);
    expect(plainData.data[0].data[0].data[0].displayValue).toBe("1");

    expect(plainData.data[0].data[1].name, "column2 name").toBe("Column 2");
    expect(plainData.data[0].data[1].title, "column2 title").toBe("Column 2");
    expect(plainData.data[0].data[1].value).toBe(2);
    expect(plainData.data[0].data[1].displayValue).toBe("2");
    expect(plainData.data[0].data[1].score).toBeUndefined();
    expect(plainData.data[0].data[1].isNode).toBe(true);

    expect(plainData.data[0].data[1].data[0].score).toBe(2);
    expect(plainData.data[0].data[1].data[0].name).toBe(0);
    expect(plainData.data[0].data[1].data[0].title).toBe("Choice option");
    expect(plainData.data[0].data[1].data[0].value).toBe(2);
    expect(plainData.data[0].data[1].data[0].displayValue).toBe("2");

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
    expect(plainData.score).toBe(8);
    expect(plainData.value).toEqual([
      { question21: "Panel dynamic content 1" },
      { question21: "Panel dynamic content 2" },
    ]);
    expect(plainData.displayValue).toEqual([
      { question21: "Panel dynamic content 1" },
      { question21: "Panel dynamic content 2" },
    ]);
    expect(plainData.isNode).toBe(true);
    expect(plainData.data[0].name).toEqual(0);
    expect(plainData.data[0].title).toEqual("Panel");
    expect(plainData.data[0].value).toEqual({
      question21: "Panel dynamic content 1",
    });
    expect(plainData.data[0].displayValue).toEqual({
      question21: "Panel dynamic content 1",
    });
    expect(plainData.data[1].name).toEqual(1);
    expect(plainData.data[1].value).toEqual({
      question21: "Panel dynamic content 2",
    });
    expect(plainData.data[1].displayValue).toEqual({
      question21: "Panel dynamic content 2",
    });

    expect(plainData.data[0].isNode).toBe(true);

    expect(plainData.data[0].data[0].name).toBe("question21");
    expect(plainData.data[0].data[0].title).toBe("question21");
    expect(plainData.data[0].data[0].value).toBe("Panel dynamic content 1");
    expect(plainData.data[0].data[0].displayValue).toBe("Panel dynamic content 1");
    expect(plainData.data[0].data[0].score).toBe(21);

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

    expect(surveyScore, "overall survey score for answered questions").toBe(75);

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
    expect(q1PlainData.displayValue, "display value is correct").toBe("Score 4");
    expect(q1PlainData.isNode, "it is not a node").toBe(false);
    expect((<any>q1PlainData).score, "score is correct").toBe(4);

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
    expect(surveyScore, "overall survey score for answered questions").toBe(11);

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
    expect([...(plainData.value)]).toEqual(["other", "giraffe"]);
    expect(plainData.isNode).toBe(true);
    expect(plainData.data.length).toEqual(2);
    expect(plainData.data[0].isNode).toEqual(false);
    expect(plainData.data[0].isOther).toEqual(true);
    expect(plainData.data[0].value).toEqual("other");
    expect(plainData.data[0].title).toEqual("Choice option");
    expect(plainData.data[0].displayValue).toEqual("Other value text");
    expect(plainData.data[1].isNode).toEqual(false);
    expect(plainData.data[1].value).toEqual("giraffe");
    expect(plainData.data[1].title).toEqual("Choice option");
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
    expect([...(plainData.value)]).toEqual(["giraffe"]);
    expect(plainData.isNode).toBe(true);
    expect(plainData.data.length).toEqual(2);
    expect(plainData.data[0].isNode).toEqual(false);
    expect(plainData.data[0].isComment).toEqual(true);
    expect(plainData.data[0].title).toEqual("Comment");
    expect(plainData.data[0].value).toEqual("-Comment");
    expect(plainData.data[0].displayValue).toEqual("Comment text");
    expect(plainData.data[1].value).toEqual("giraffe");
    expect(plainData.data[1].title).toEqual("Choice option");
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
    expect([...(plainData.value)]).toEqual(["other"]);
    expect(plainData.isNode).toBe(true);
    expect(plainData.data.length).toEqual(1);
    expect(plainData.data[0].isNode).toEqual(false);
    expect(plainData.data[0].isOther).toEqual(true);
    expect(plainData.data[0].value).toEqual("other");
    expect(plainData.data[0].title).toEqual("Choice option");
    expect(plainData.data[0].displayValue).toEqual("Other value text");
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
    expect([...(plainData.value)]).toEqual(["giraffe"]);
    expect(plainData.isNode).toBe(true);
    expect(plainData.data.length).toEqual(2);
    expect(plainData.data[0].isNode).toEqual(false);
    expect(plainData.data[0].isComment).toEqual(true);
    expect(plainData.data[0].title).toEqual("Comment");
    expect(plainData.data[0].value).toEqual("-Comment");
    expect(plainData.data[0].displayValue).toEqual("Comment text");
    expect(plainData.data[1].value).toEqual("giraffe");
    expect(plainData.data[1].title).toEqual("Choice option");
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
    expect(plainData.value).toEqual("giraffe");
    expect(plainData.title).toEqual("Title <>marked<>");
    expect(plainData.displayValue).toEqual("giraffe <>marked<>");
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
    expect(plainData.name).toEqual("q1");
    expect(plainData.questionType).toEqual(undefined);

    plainData = question.getPlainData({ includeQuestionTypes: true });
    expect(plainData.name).toEqual("q1");
    expect(plainData.questionType).toEqual("radiogroup");
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
    expect(plainData.length).toEqual(1);
    delete plainData[0]["getString"];
    delete plainData[0]["data"];
    expect(plainData[0], "Question only").toEqual({
      "displayValue": "1",
      "isNode": true,
      "name": "question1",
      "title": "question1",
      "value": 1
    });

    plainData = survey.getPlainData({ includeValues: true });
    expect(plainData.length).toEqual(2);
    delete plainData[0]["getString"];
    delete plainData[0]["data"];
    delete plainData[1]["getString"];
    delete plainData[1]["data"];
    expect(plainData[0], "Question").toEqual({
      "displayValue": "1",
      "isNode": true,
      "name": "question1",
      "title": "question1",
      "value": 1
    });
    expect(plainData[1], "Value").toEqual({
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
    expect(plainData.isNode).toBe(true);
    expect(plainData.data.length, "All 3 rows are included with includeEmpty: true").toBe(3);
    expect(plainData.data[0].name).toBe("Row 1");
    expect(plainData.data[0].title).toBe("Row 1 title");
    expect(plainData.data[0].value).toBe("Column 1");
    expect(plainData.data[0].displayValue).toBe("Column 1");
    expect(plainData.data[1].name).toBe("Row 2");
    expect(plainData.data[1].title).toBe("Row 2");
    expect(plainData.data[1].value, "Empty row value is undefined").toBeUndefined();
    expect(plainData.data[2].name).toBe("Row 3");
    expect(plainData.data[2].title).toBe("Row 3");
    expect(plainData.data[2].value, "Empty row value is undefined").toBeUndefined();
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
    expect(plainData.isNode).toBe(true);
    expect(plainData.data.length, "Both rows are included").toBe(2);
    expect(plainData.data[0].name).toBe("Row 1");
    expect(plainData.data[0].title).toBe("Row 1 Title");
    expect(plainData.data[0].data.length, "All 3 columns in Row 1 with includeEmpty").toBe(3);
    expect(plainData.data[0].data[0].name).toBe("Column 1");
    expect(plainData.data[0].data[0].value, "Column 1 has value").toBe(1);
    expect(plainData.data[0].data[1].name).toBe("Column 2");
    expect(plainData.data[0].data[1].value, "Column 2 is empty").toBeUndefined();
    expect(plainData.data[0].data[2].name).toBe("Column 3");
    expect(plainData.data[0].data[2].value, "Column 3 is empty").toBeUndefined();
    expect(plainData.data[1].name).toBe("Row 2");
    expect(plainData.data[1].data.length, "All 3 columns in Row 2 with includeEmpty").toBe(3);
    expect(plainData.data[1].data[0].name).toBe("Column 1");
    expect(plainData.data[1].data[0].value, "Row 2 Column 1 is empty").toBeUndefined();
    expect(plainData.data[1].data[1].name).toBe("Column 2");
    expect(plainData.data[1].data[1].value, "Row 2 Column 2 is empty").toBeUndefined();
    expect(plainData.data[1].data[2].name).toBe("Column 3");
    expect(plainData.data[1].data[2].value, "Row 2 Column 3 is empty").toBeUndefined();
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
    expect(plainData.isNode).toBe(true);
    expect(plainData.data.length, "Both rows are included").toBe(2);
    expect(plainData.data[0].name).toBe("Row 1");
    expect(plainData.data[0].title).toBe("Row 1 Title");
    expect(plainData.data[0].data.length, "Only 1 column with value in Row 1").toBe(1);
    expect(plainData.data[0].data[0].name).toBe("Column 1");
    expect(plainData.data[0].data[0].value, "Column 1 has value").toBe(1);
    expect(plainData.data[1].name).toBe("Row 2");
    expect(plainData.data[1].data.length, "No columns with values in Row 2").toBe(0);
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
    expect(question.name, "The question has been found").toBe("name");
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
    expect(question.errors.length, "There are 4 errors should be shown").toBe(4);
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
    expect(question.errors[0].getText(), "survey.onErrorCustomText works").toBe("!!!Question Name");
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
    expect(valueChangingCount, "value changing call count should be 1").toBe(1);
    expect(valueChangedCount, "value changed call count should be 0").toBe(0);
    survey.setValue("q1", "");
    expect(valueChangingCount, "value changing call count should be 2").toBe(2);
    expect(valueChangedCount, "value changed call count should be 0").toBe(0);
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
    expect(survey.data, "Remove value for invisible row").toEqual({ q1: 2, q2: { row2: "col2" } });
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
    expect(survey.data, "Remove values for invisible choices").toEqual({ q1: 2, q3: ["val2"] });
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
    expect(html1Q.isVisible, "html1 is not visible by default").toBe(false);
    expect(html2Q.isVisible, "html2 is not visible by default").toBe(false);
    boolQ.value = "True";
    expect(html1Q.isVisible, "True, html1 is visible").toBe(true);
    expect(html2Q.isVisible, "True, html2 is invisible").toBe(false);
    boolQ.value = "False";
    expect(boolQ.value, "Value set correctly").toBe("False");
    expect(survey.getValue("bool"), "Value set correctly in survey").toBe("False");
    expect(html1Q.isVisible, "False, html1 is invisible").toBe(false);
    expect(html2Q.isVisible, "False, html2 is visible").toBe(true);
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
    expect(counter, "Nothing yet heppend").toBe(0);
    survey.nextPage();
    expect(counter, "called one time").toBe(1);
    expect(errors.length, "there are two errors").toBe(2);
    expect(questions.length, "there are two questions have errors").toBe(2);

    survey.setValue("q1", "val1");
    survey.nextPage();
    expect(counter, "called 2 times").toBe(2);
    expect(errors.length, "there is one error, #1").toBe(1);
    expect(questions.length, "there is one error, #2").toBe(1);

    survey.setValue("q2", "val2");
    survey.nextPage();
    expect(counter, "called three times").toBe(3);
    expect(errors.length, "there is no errors").toBe(0);
    expect(questions.length, "there is no errors").toBe(0);

    survey.checkErrorsMode = "onValueChanged";

    survey.setValue("q3", "val3");
    expect(counter, "called four times").toBe(4);
    expect(errors.length, "there is one error, #3").toBe(1);
    expect(questions.length, "there is one error, #4").toBe(1);

    survey.setValue("q3", "a@b.com");
    expect(counter, "called five times").toBe(5);
    expect(errors.length, "there is no errors").toBe(0);
    expect(questions.length, "there is no errors").toBe(0);

    survey.setValue("q3", "a@c.com");
    expect(counter, "called five times - it doesn't called this time").toBe(5);
    expect(errors.length, "there is no errors").toBe(0);
    expect(questions.length, "there is no errors").toBe(0);

    survey.clearValue("q3");
    expect(counter, "Do not call errors validation on clearing value").toBe(5);
    expect(errors.length, "there is no errors on clearing value").toBe(0);
    survey.tryComplete();
    expect(counter, "called six times").toBe(6);
    expect(errors.length, "there are two errors onComplete, #5").toBe(2);
    expect(questions.length, "there are two question onComplete, #6").toBe(2);
  });
  test("Server validation - do no fire onValidatedErrorsOnCurrentPage  on changing question value, Bug#5194", () => {
    const survey = new SurveyModel({ "elements": [{ name: "name", type: "text", isRequired: true }] });
    let counter = 0;
    expect(survey.onValidatePage.length, "onValidate page is emtpy").toBe(0);
    survey.onValidatedErrorsOnCurrentPage.add(function (sender, options) {
      counter++;
    });
    expect(survey.onValidatePage.length, "onValidate page is set").toBe(1);
    survey.tryComplete();
    expect(survey.state).toBe("running");
    expect(counter, "On complete").toBe(1);
    survey.setValue("name", "Jon");
    expect(counter, "We do not make complete").toBe(1);
    survey.tryComplete();
    expect(counter, "Do complete again").toBe(2);
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
    expect(survey.state).toBe("running");
    expect(counter, "On complete").toBe(1);
    expect(errorCount, "options.errors.length").toBe(2);
    expect(questionCount, "options.questions.length").toBe(2);
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
    expect(survey.state).toBe("running");
    expect(counter, "On complete").toBe(1);
    expect(errorCount, "options.errors.length").toBe(3);
    expect(questions.length, "options.questions.length").toBe(3);
    expect(questions[0].name, "questions[0].name").toBe("q1");
    expect(questions[1].name, "questions[1].name").toBe("minvalue");
    expect(questions[2].name, "questions[2].name").toBe("maxvalue");
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
    expect(survey.currentPageNo, "Start on page 0").toBe(0);
    survey.nextPage();
    expect(survey.currentPageNo, "Should stay on page 0 because onValidatePage added errors").toBe(0);
    survey.setValue("q2", 30);
    survey.nextPage();
    expect(survey.currentPageNo, "Should move to page 1 when total <= 100").toBe(1);
  });

  test("survey.completedHtmlOnCondition", () => {
    var survey = new SurveyModel();
    survey.completedHtml = "1";
    expect(survey.renderedCompletedHtml, "get from completed html").toBe("1");
    survey.completedHtmlOnCondition.push(new HtmlConditionItem("{q1} = 2", "2"));
    survey.completedHtmlOnCondition.push(new HtmlConditionItem("{q1} = 3", "3"));
    expect(survey.completedHtmlOnCondition[0].getSurvey(), "There is survey in completedHtmlOnCondition").toBeTruthy();
    expect(survey.renderedCompletedHtml, "still get from completed html").toBe("1");
    survey.setValue("q1", 2);
    expect(survey.renderedCompletedHtml, "get from first on Condition").toBe("2");
    survey.setValue("q1", 3);
    expect(survey.renderedCompletedHtml, "get from second on Condition").toBe("3");
    survey.setValue("q1", 5);
    expect(survey.renderedCompletedHtml, "get from completed html again").toBe("1");
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
    expect(survey.completedHtmlOnCondition.length, "OnCondition restored correctly").toBe(1);
    survey.setValue("q1", 2);
    expect(survey.renderedCompletedHtml, "get on condition en").toBe("en-condition");
    var prevLocale = survey.locale;
    survey.locale = "fr";
    expect(survey.renderedCompletedHtml, "get on condition fr").toBe("fr-condition");
    survey.locale = prevLocale;
  });

  test("survey.navigateToUrlOnCondition", () => {
    var survey = new SurveyModel();
    survey.navigateToUrl = "1";
    expect(survey.getNavigateToUrl(), "get from navigateToUrl").toBe("1");
    survey.navigateToUrlOnCondition.push(new UrlConditionItem("{q1} = 2", "2"));
    survey.navigateToUrlOnCondition.push(new UrlConditionItem("{q1} = 3", "3"));
    expect(survey.getNavigateToUrl(), "still get from navigateToUrl").toBe("1");
    survey.setValue("q1", 2);
    expect(survey.getNavigateToUrl(), "get from first on Condition").toBe("2");
    survey.setValue("q1", 3);
    expect(survey.getNavigateToUrl(), "get from second on Condition").toBe("3");
    survey.setValue("q1", 5);
    expect(survey.getNavigateToUrl(), "get from navigateToUrl again").toBe("1");
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
    expect(survey.getNavigateToUrl(), "data is empty").toBe("url--url");
    survey.data = { q1: "value1", q2: "value2" };
    expect(survey.getNavigateToUrl(), "use value in navigateToUrl prop").toBe("url-value1-url");
    survey.setValue("q1", 2);
    expect(survey.getNavigateToUrl(), "use value in condition url prop").toBe("url-value2-url");
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
    expect(survey.getNavigateToUrl(), "data is empty").toBe("url--url");
    survey.data = { q1: 1, q2: 1 };
    expect(survey.getNavigateToUrl(), "use value in navigateToUrl prop, #1").toBe("url-1-url");
    survey.setValue("q1", 2);
    expect(survey.getNavigateToUrl(), "use value in condition url prop, #2").toBe("url-2-url");
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
    expect(survey.navigateToUrlOnCondition.length, "OnCondition restored correctly").toBe(1);
    survey.setValue("q1", 2);
    expect(survey.getNavigateToUrl(), "get on condition en").toBe("en-condition");
    var prevLocale = survey.locale;
    survey.locale = "fr";
    expect(survey.getNavigateToUrl(), "get on condition fr").toBe("fr-condition");
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
    expect(counter, "onNavigate has been called one time").toBe(1);
    survey.clear();
    var completeOptions = null;
    survey.onComplete.add(function (sender, options) {
      options.showSaveInProgress();
      completeOptions = options;
    });
    survey.doComplete();
    expect(counter, "onNavigate has been called one time only - wait for showDataSavingSuccess").toBe(1);
    completeOptions.showSaveSuccess();
    expect(counter, "onNavigate has been called two times").toBe(2);
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
    expect(rows[0].cells[0].question.isRequired, "The matrix cell question is required.").toBe(true);
    page.validate();
    expect(question.errors.length, "There is one error in text question").toBe(1);
    expect(dPanel.panels[0].questions[0].errors.length, "There is one error in question in dynamic panel").toBe(1);
    expect(rows[0].cells[0].question.errors.length, "There is one error in question cell").toBe(1);
    page.clearErrors();
    expect(question.errors.length, "Error is cleared in text question").toBe(0);
    expect(dPanel.panels[0].questions[0].errors.length, "Error is cleared in question in dynamic panel").toBe(0);
    expect(rows[0].cells[0].question.errors.length, "Error is cleared in question cell").toBe(0);
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
    expect(survey.data, "The data is here").toEqual({ q1: { text1: "val1" } });
    question.items[0].value = "";
    expect(survey.data, "survey is empty").toEqual({});
    expect(question.isEmpty(), "question is empty").toBe(true);
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
    expect(survey.data, "The initial value").toEqual({ shared: [{ elementId: 1 }] });
    rows1[0].cells[1].value = "col1_Value";
    expect(survey.data, "set matrix1 col1").toEqual({ shared: [{ elementId: 1, col1: "col1_Value" }] });
    rows2[0].cells[0].value = "col2_Value";
    expect(survey.data, "set matrix2 col2").toEqual({ shared: [{ elementId: 1, col1: "col1_Value", col2: "col2_Value" }] });
    panels1[0].getQuestionByName("ed1").value = "ed1_Value";
    expect(survey.data, "set panel1 ed1").toEqual({
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
    expect(survey.data, "replace matrix2 col2").toEqual({
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
    expect(survey.data, "keep all data since they are all correct").toEqual({
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
    expect(survey.data, "set matrix1 col1").toEqual({ shared: [{ elementId: 1, col1: 1 }] });
    panel1.panels[0].getQuestionByName("ed1").value = 1;
    expect(matrix1.getDisplayValue(false)).toEqual([{ elementId: "1", col1: "Item 1", ed1: "Item 10" }]);
    expect(panel1.getDisplayValue(false)).toEqual([{ elementId: "1", col1: "Item 1", ed1: "Item 10" }]);
    expect(panel1.panels[0].locTitle.renderedHtml, "Get the display text").toBe("Item 1");
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
    expect(q1.parent.name, "q1.parent = page1").toBe("page1");
    q1.moveTo(page2);
    expect(q1.parent.name, "q1.parent = page1").toBe("page2");
    expect(page2.indexOf(q1), "The last element on the page").toBe(3);
    q1.moveTo(page2, survey.getQuestionByName("q5"));
    expect(page2.indexOf(q1), "The first element on the page").toBe(0);
    q1.moveTo(page2, -1);
    expect(page2.indexOf(q1), "The last element on the page again").toBe(3);
    q1.moveTo(page2, 1);
    expect(page2.indexOf(q1), "The second element on the page").toBe(1);
    q1.moveTo(panel2, survey.getQuestionByName("q2"));
    expect(q1.parent.name, "q1.parent = p1").toBe("p2");
    expect(panel2.indexOf(q1), "The first element on panel: p2").toBe(0);
    panel2.moveTo(page2, survey.getPanelByName("p3"));
    expect(panel2.parent.name, "q1.parent = p1").toBe("page2");
    expect(page2.indexOf(panel2), "The second element on page2").toBe(1);
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
    expect(panel.elements.length, "two questions in panel in the beginning").toBe(2);
    panel.questions[0].delete();
    expect(panel.elements.length, "one question in panel now").toBe(1);
    expect(survey.pages[0].elements.length, "There are two elements in page1").toBe(2);
    panel.delete();
    expect(survey.pages[0].elements.length, "There is one element in page1").toBe(1);
    expect(survey.pages[1].elements.length, "There are two elements in page2").toBe(2);
    survey.pages[1].questions[0].delete();
    expect(survey.pages[1].elements.length, "There is one element in page2").toBe(1);
    expect(survey.pages.length, "There are two pages in survey").toBe(2);
    survey.pages[0].delete();
    expect(survey.pages.length, "There is one page in survey").toBe(1);
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
    expect(survey.currentPageNo, "First page, 1").toBe(0);
    returnResult1(0);
    returnResult2(0);
    expect(survey.currentPageNo, "First page, 2").toBe(0);
    survey.nextPage();
    expect(survey.currentPageNo, "First page, 3").toBe(0);
    returnResult1(1);
    expect(survey.currentPageNo, "First page, 4").toBe(0);
    returnResult2(2);
    expect(survey.currentPageNo, "Second page, async validation is over").toBe(1);

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
    expect(survey.hasCurrentPageErrors(func), "We don't know, we return undefined").toBeUndefined();
    expect(asyncHasErrors, "It is not executed yet").toBeUndefined();
    returnResult1(0);
    expect(asyncHasErrors, "Has errors").toBe(true);
    asyncHasErrors = undefined;
    survey.hasCurrentPageErrors(func);
    expect(asyncHasErrors, "It is not executed yet, #2").toBeUndefined();
    returnResult1(1);
    expect(asyncHasErrors, "Not all executed, #2").toBeUndefined();
    returnResult2(2);
    expect(asyncHasErrors, "Has no errors").toBe(false);

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
    expect(survey.validate(false, false, func), "We don't know, we return undefined").toBeUndefined();
    expect(asyncHasErrors, "It is not executed yet").toBeUndefined();
    returnResult1(0);
    expect(asyncHasErrors, "Has errors").toBe(true);
    asyncHasErrors = undefined;
    survey.validate(false, false, func);
    expect(asyncHasErrors, "It is not executed yet, #2").toBeUndefined();
    returnResult1(1);
    expect(asyncHasErrors, "Not all executed, #2").toBeUndefined();
    returnResult2(2);
    expect(asyncHasErrors, "Has no errors").toBe(false);

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
    expect(q1.isVisible, "Hide initially, q1").toBe(false);
    expect(q2.isVisible, "Hide initially, q2").toBe(false);
    returnResult1(0);
    returnResult2(0);
    expect(q1.isVisible, "Hide, q1 = 0").toBe(false);
    expect(q2.isVisible, "Hide, q2 = 0").toBe(false);
    returnResult1(1);
    expect(q1.isVisible, "Show, q1 = 1").toBe(true);
    expect(q2.isVisible, "Hide, q2 = 0").toBe(false);
    returnResult2(2);
    expect(q1.isVisible, "Show, q1 = 1").toBe(true);
    expect(q2.isVisible, "Hide, q2 = 2").toBe(true);
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
    expect(q1.isVisible, "Hide initially, q1").toBe(false);
    returnResult1(0);
    expect(q1.isVisible, "Hide, calc1 = 0").toBe(false);
    returnResult1(1);
    expect(q1.isVisible, "Show, calc1 = 1").toBe(true);
    returnResult1(2);
    expect(q1.isVisible, "Hide, calc1 = 2").toBe(false);
    FunctionFactory.Instance.unregister("asyncFunc1");
  });

  test("Hide required errors, add tests for Bug#2679", () => {
    var survey = twoPageSimplestSurvey();
    var q1 = survey.getQuestionByName("question1");
    q1.isRequired = true;
    survey.nextPage();
    expect(q1.errors.length, "There is one error").toBe(1);
    expect(q1.errors[0].visible, "It is visible").toBe(true);
    expect(q1.hasVisibleErrors, "There is a visible error").toBe(true);
    survey.clear(true, true);
    survey.hideRequiredErrors = true;
    survey.nextPage();
    expect(q1.errors.length, "There is one error").toBe(1);
    expect(q1.errors[0].visible, "It is invisible").toBe(false);
    expect(q1.hasVisibleErrors, "There is no visible Errors").toBe(false);
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
    expect(q1.errors.length, "There is one error").toBe(1);
    expect(q1.errors[0].visible, "It is invisible").toBe(false);
    expect(q2.errors.length, "Add one error into second question").toBe(1);
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
    expect(q1.errors.length, "There is one error").toBe(1);
    expect(q1.errors[0].visible, "It is invisible").toBe(false);
    expect(q2.errors.length, "Add one error into second question").toBe(1);
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
    expect(panelDynamic.containsErrors, "It doesn't contain errors by default").toBe(false);
    expect(survey.isCurrentPageHasErrors, "The page has Errors").toBe(true);
    expect(panelDynamic.containsErrors, "Dynamic panel contains errros").toBe(true);
    expect(panel.containsErrors, "panel contains errors").toBe(true);
    expect(question.containsErrors, "question contains errors").toBe(true);
    expect(questionMultiple.items[0].editor.containsErrors, "question multiple item contains errors").toBe(true);
    expect(questionMultiple.containsErrors, "question multiple contains errors").toBe(true);
    expect(questionMatrixDropdown.containsErrors, "MatrixDropdown contains errors").toBe(true);
    survey.data = {
      panel1: [{ question1: 1 }, { question1: 1 }],
      question2: 2,
      question3: 3,
      question4: { q1_m1: 1 },
      question5: { row1: { col1: 1 } },
    };
    expect(panelDynamic.containsErrors, "contains errros is not updated yet").toBe(true);
    expect(survey.isCurrentPageHasErrors, "The page has no errors").toBe(false);
    expect(panelDynamic.containsErrors, "Dynamic panel contains no errros").toBe(false);
    expect(panel.containsErrors, "panel contains no errors").toBe(false);
    expect(question.containsErrors, "question contains no errors").toBe(false);
    expect(questionMultiple.containsErrors, "question multiple contains no errors").toBe(false);
    expect(questionMatrixDropdown.containsErrors, "MatrixDropdown contains no errors").toBe(false);
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
    expect(panelDynamic.containsErrors, "It doesn't contain errors by default").toBe(false);
    question.value = "1";
    expect(panelDynamic.containsErrors, "The panel has no errors").toBe(false);
    question.value = "";
    expect(panelDynamic.containsErrors, "We show errors").toBe(true);
    question.value = "1";
    expect(panelDynamic.containsErrors, "The panel has no errors again").toBe(false);
    panelDynamic.value = [{}];
    expect(question.isEmpty(), "Question is empty").toBe(true);
    expect(panelDynamic.containsErrors, "We do not show error on value change in panel itself").toBe(false);
    survey.tryComplete();
    expect(panelDynamic.containsErrors, "The panel has errors after value changed to empty. Show it on next page event").toBe(true);
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
    expect(panelDynamic.isAnswered, "Paneldynamic is not answered").toBe(false);
    expect(questionMultiple.isAnswered, "Multiple text is not answered").toBe(false);
    expect(question.isAnswered, "Question is not  answered").toBe(false);
    expect(questionMatrixDropdown.isAnswered, "Paneldynamic is not answered").toBe(false);
    survey.data = {
      panel1: [{ question1: 1 }, {}],
      question2: 3,
      question3: { q1_m1: 1 },
      question4: { row1: { col1: 1 } },
    };
    expect(panelDynamic.isAnswered, "Paneldynamic is not fully answered").toBe(false);
    expect(questionMultiple.isAnswered, "Multiple text is not fully answered").toBe(false);
    expect(question.isAnswered, "Question is answered").toBe(true);
    expect(questionMatrixDropdown.isAnswered, "Paneldynamic is not fully answered").toBe(false);
    survey.data = {
      panel1: [{ question1: 1 }, { question1: 2 }],
      question3: { q1_m1: 1, q2_m1: 2 },
      question4: { row1: { col1: 1, col2: 2 } },
    };
    expect(panelDynamic.isAnswered, "Paneldynamic is fully answered").toBe(true);
    expect(questionMultiple.isAnswered, "Multiple text is fully answered").toBe(true);
    expect(questionMatrixDropdown.isAnswered, "Paneldynamic is fully answered").toBe(true);
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
    expect(survey.data).toEqual({
      a: { item1: "1", item2: "2", item3: "1", item4: "3" },
    });
    survey.doComplete();
    expect(survey.data).toEqual({
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
    expect(str).toBe("({Question 1} + 1)");
    str = expressionToDisplay.toDisplayText("{q1} = 1");
    expect(str).toBe("({Question 1} == one)");
    str = expressionToDisplay.toDisplayText("{q1} = [1, 2]");
    expect(str).toBe("({Question 1} == [one, two])");
    str = expressionToDisplay.toDisplayText(
      "{q1} = 2 or (1 != {q1} and {q2} contains [1, 2]) or {q3} = 1"
    );
    expect(str, "Use question title and display text").toBe("((({Question 1} == two) or ((one != {Question 1}) and ({Question 2} contains [one, two]))) or ({q3} == 1))");
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
    expect(survey.getValue("question2"), "iif true").toBe("a[a]");
    survey.setValue("question1", "item1");
    expect(survey.getValue("question2"), "iif false").toBe("ax");
    survey.clearValue("question3");
    expect(survey.getValue("question2"), "iif false where question3 is empty").toBe("x");
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
    expect(survey1.css.question.mainRoot, "Correct css name for survey1").toBe(defaultQuestionRoot + " class1");
    expect(survey2.css.question.mainRoot, "Correct css name for survey2").toBe(defaultQuestionRoot + " class2");
    var question1 = survey1.getQuestionByName("q");
    var question2 = survey2.getQuestionByName("q");
    expect(question1.cssRoot, "Correct css name for question1").toBe(defaultQuestionRoot + " class1");
    expect(question2.cssRoot, "Correct css name for question2").toBe(defaultQuestionRoot + " class2");
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
    expect(q1.errors.length, "There is not errors").toBe(0);
    var defaultQuestionRoot = survey.css.question.mainRoot;
    expect(q1.cssRoot, "Default question root").toBe(defaultQuestionRoot + " small");
    expect(q1.cssTitle, "Default question title").toBe("title");
    q1.titleLocation = "left";
    var addLeft = " " + survey.css.question.titleLeftRoot;
    expect(q1.cssRoot, "titleLocation = left").toBe(defaultQuestionRoot + addLeft + " small");
    q1.width = "40%";
    expect(q1.cssRoot, "titleLocation = left and remove small").toBe(defaultQuestionRoot + addLeft);
    q1.titleLocation = "default";
    expect(q1.cssRoot, "titleLocation = default and remove small").toBe(defaultQuestionRoot);
    survey.validate();
    var addError = " " + survey.css.question.hasError;
    expect(q1.cssRoot, "has error").toBe(defaultQuestionRoot + addError);
    expect(q1.cssTitle, "question title, on error").toBe("title onError");
    q1.value = "somevalue";
    survey.validate();
    expect(q1.cssRoot, "no errors").toBe(defaultQuestionRoot);
    expect(q1.cssTitle, "question title, on answer").toBe("title onAnswer");
    q1.clearValue();
    expect(q1.cssTitle, "question title clear").toBe("title");
    q1.value = "somevalue";
    expect(q1.cssTitle, "question title on answer 2").toBe("title onAnswer");
    survey.questionTitleLocation = "left";
    expect(q1.cssRoot, "survey.questionTitleLocation = left").toBe(defaultQuestionRoot + addLeft);
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

    expect(counter, "initial").toBe(0);

    survey.title = "new";
    expect(counter, "callback called").toBe(1);
    expect(log, "callback called for title").toBe("->title");
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

    expect(counter, "initial").toBe(0);

    (<SurveyTriggerSetValue>survey.triggers[0]).setValue = "3";

    expect(counter, "trigger: callback called").toBe(1);
    expect(propName, "trigger: property name is correct").toBe("setValue");
    expect(testOldValue, "trigger: oldValue is correct").toBe("2");
    expect(testNewValue, "trigger: newValue is correct").toBe("3");
    expect(senderType, "trigger: sender is correct").toBe("setvaluetrigger");
    (<TextValidator>survey.getQuestionByName("q1").validators[0]).maxLength = 5;
    expect(counter, "validator: callback called").toBe(2);
    expect(propName, "validator: property name is correct").toBe("maxLength");
    expect(testOldValue, "validator: oldValue is correct").toBe(3);
    expect(testNewValue, "validator: newValue is correct").toBe(5);
    expect(senderType, "validator: sender is correct").toBe("textvalidator");
  });

  test("Survey questionTitleTemplate -> questionTitlePattern", () => {
    var survey = new SurveyModel();
    expect(survey.questionTitlePattern, "default value").toBe("numTitleRequire");
    survey.questionTitleTemplate = "{require} {no}{title}";
    expect(survey.questionTitlePattern, "{require} {no}{title}").toBe("requireNumTitle");
    survey.questionTitleTemplate = "{no}{require} {title}";
    expect(survey.questionTitlePattern, "{no}{require} {title}").toBe("numRequireTitle");
    survey.questionTitleTemplate = "{title}";
    expect(survey.questionTitlePattern, "{title}").toBe("numTitle");
    survey.questionTitleTemplate = "{no}{title}{require}";
    expect(survey.questionTitlePattern, "{no}{title}{require}").toBe("numTitleRequire");
    survey.questionTitleTemplate = "{no}{title}";
    expect(survey.questionTitlePattern, "{no}{title}").toBe("numTitle");
  });

  test("Survey.getQuestionTitlePatternOptions()", () => {
    var survey = new SurveyModel();
    survey.questionStartIndex = "# 1.";
    survey.requiredMark = "(*)";
    var options = survey.getQuestionTitlePatternOptions();
    expect(options).toEqual([
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
    expect(survey.logoPosition).toBe("left");
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
    expect(survey.logoPosition).toBe("left");

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
    expect(survey.logoPosition).toBe("left");

    expect(survey.logoClassNames).toBe("sv_logo sv-logo--left");

    survey.logoPosition = "top";
    expect(survey.logoClassNames).toBe("sv_logo sv-logo--top");

    survey.logoPosition = "right";
    expect(survey.logoClassNames).toBe("sv_logo sv-logo--right");

    survey.logoPosition = "bottom";
    expect(survey.logoClassNames).toBe("sv_logo sv-logo--bottom");

    survey.logoPosition = "none";
    expect(survey.logoClassNames).toBe("sv_logo");
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
    expect(survey.getQuestionByName("q1").tag, "onQuestionCreated calls for a standard question").toBe("was here");
    expect(survey.getQuestionByName("q2").visibleRows[0].cells[0].question.tag, "onQuestionCreated calls for a matrix cell question").toBe("was here");
    expect(survey.getQuestionByName("q3").items[0].editor.tag, "onQuestionCreated calls for a multiple text question").toBe("was here");
    expect(survey.getQuestionByName("q4").panels[0].questions[0].tag, "onQuestionCreated calls for a multiple text question").toBe("was here");
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
    expect(question1.errors.length, "There is no errors yet").toBe(0);
    survey.tryComplete();
    expect(question1.errors.length, "There is one error, isAllRowRequried").toBe(1);
    question1.value = { "Row 1": "Column 3" };
    expect(question1.errors.length, "The error was not fixed").toBe(1);
    question1.value = { "Row 1": "Column 3", "Row 2": "Column 3" };
    expect(question1.errors.length, "The error is gone").toBe(0);
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
    expect(survey.data, "Data set correctly").toEqual({ question1: { item1: "value1" } });
    expect(question1.errors.length, "There is no errors yet").toBe(0);
    expect(question1.items[1].editor.errors.length, "There is no errors in item2").toBe(0);
    survey.tryComplete();
    expect(question1.items[1].editor.errors.length, "There is one error, isRequired").toBe(1);
    question1.items[0].editor.value = "value1_1";
    expect(question1.items[0].editor.errors.length, "There is no errors in the first editor").toBe(0);
    expect(question1.items[1].editor.errors.length, "The error is not fixed").toBe(1);
    question1.items[1].editor.value = "value2";
    expect(question1.items[1].editor.errors.length, "The error is gone").toBe(0);
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
    expect(question1.items[0].editor.errors.length, "There is required error in item1").toBe(1);
    expect(question1.items[1].editor.errors.length, "There is required error in item2").toBe(1);
    question1.items[0].editor.value = "val1";
    expect(question1.items[0].editor.errors.length, "There is no errors in item1").toBe(0);
    expect(question1.items[1].editor.errors.length, "There is still required error in item2").toBe(1);
    question1.items[1].editor.value = "val2";
    expect(question1.items[1].editor.errors.length, "There is no errors in item2").toBe(0);
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
    expect(panel.panels[0].questions[0].errors.length, "There is required error in question").toBe(1);
    panel.panels[0].questions[0].value = "val1";
    expect(panel.panels[0].questions[0].errors.length, "There is no errors in question").toBe(0);
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
    expect(question.errors.length, "There is required error in question").toBe(1);
    question.value = "val1";
    expect(question.errors.length, "There is no errors in question").toBe(0);
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
    expect(question1.errors.length, "There is one error").toBe(1);
    expect(survey.getValue("birthdate"), "There is no incorrect value in survey data").toBeFalsy();
    question1.value = "2000-01-02";
    expect(question1.errors.length, "There is no errors").toBe(0);
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
    expect(q1.errors.length, "q1 is required").toBe(1);
    expect(q2.errors.length, "q2 is required").toBe(1);
    expect(q2.errors[0].getErrorType(), "q2 error is require").toBe("required");
    q1.value = "some value";
    q2.value = "some value";
    expect(q1.errors.length, "q1 has value and we remove error").toBe(0);
    expect(q2.errors.length, "q2 has value and we remove error required error, but there is e-mail error").toBe(1);
    expect(q2.errors[0].getErrorType(), "q2 error - wrong e-mail format").not.toBe("required");
    q2.value = "jon_snow@nightwatch.org";
    expect(q2.errors.length, "q2 has no errors").toBe(0);
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
    expect(q1.errors.length, "There is no error yet, #1").toBe(0);
    q1.otherValue = "some value1";
    expect(q1.errors.length, "There is no error - there is a value, #2").toBe(0);
    q1.otherValue = "";
    expect(q1.errors.length, "There is an error right now, #3").toBe(1);
    q1.otherValue = "some value2";
    expect(q1.errors.length, "There is no error again, #4").toBe(0);
    q1.value = 1;
    q1.value = q1.otherItem.value;
    expect(q1.otherValue, "Comment is empty").toBe("");
    expect(q1.errors.length, "There is no error - comment was cleaned, #5").toBe(0);
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
    expect(q1.errors.length, "There is an error right now").toBe(1);
    q1.otherValue = "some value";
    expect(q1.errors.length, "There is no error now").toBe(0);
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
    expect(survey.pages.length, "One page").toBe(1);
    expect(survey.pages[0].elements.length, "One element").toBe(1);
    survey.dispose();
    if (!!survey.pages) {
      expect(survey.pages.length, "No pages").toBe(0);
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
    expect(question.isVisible, "question should be invisible").toBe(false);
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
    expect(survey.getValue("q1"), "q1 is set, no stackoverflow").toBe(1);
    expect(survey.getValue("q2"), "q2 is set, no stackoverflow").toBe(2);
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
    expect(q1.getPropertyValue("cssHeader", "").trim()).toBe("title-left");
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
    expect(survey.pages[1].isVisible, "The second page is invisible").toBe(false);
    expect(survey.pages[1].visibleIndex, "The second page visible index is -1").toBe(-1);
    expect(survey.pages[4].isVisible, "The 5th page is visible").toBe(true);
    expect(survey.pages[4].visibleIndex, "The fourth page visible index is 1").toBe(1);
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
    expect(survey.pages[1].isVisible, "The second page is invisible initially").toBe(false);
    expect(survey.pages[1].visibleIndex, "The second page visible index is -1 initially").toBe(-1);
    expect(survey.pages[2].isVisible, "The third page is invisible initially").toBe(false);
    expect(survey.pages[2].visibleIndex, "The third page visible index is -1 initially").toBe(-1);
    survey.setValue("question1", "item2");
    expect(survey.pages[1].isVisible, "The second page is invisible").toBe(false);
    expect(survey.pages[1].visibleIndex, "The second page visible index is -1").toBe(-1);
    expect(survey.pages[2].isVisible, "The third page is visible").toBe(true);
    expect(survey.pages[2].visibleIndex, "The third page visible index is 1").toBe(1);
  });
  test("Do allow to set incrorect name", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("p1");
    var panel = page.addNewPanel(" panel1");
    var question = page.addNewQuestion("text", "{q1");
    expect(page.name, "Remove trailing space from page").toBe("p1");
    expect(panel.name, "Remove trailing space from panel").toBe("panel1");
    expect(question.name, "Remove trailing space and { from question").toBe("q1");
    question.name = " {q2} s ";
    expect(question.name, "Remove trailing space and { } from question").toBe("q2 s");
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
    expect(question.comment, "Comment text set correctly").toBe("ABC");
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
    expect(survey.getProgressInfo()).toEqual({
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
    expect(survey.data, "trigger works correctly").toEqual({ q1: { row1: { col1: "cell1" } }, q2: { row3: { col3: "cell1" } } });
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
    expect(q1.isEmpty(), "Question is invisible").toBe(true);
    q1.visible = true;
    expect(q1.isEmpty(), "Question is visible").toBe(false);
    expect(q1.value, "get value from defaultValue").toBe(1);
    q1.visible = false;
    expect(q1.isEmpty(), "Question is invisible #2").toBe(true);
    q1.visible = true;
    expect(q1.isEmpty(), "Question is visible #2").toBe(false);
    expect(q1.value, "get value from defaultValue #2").toBe(1);
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
    expect(survey.data, "Clear values on clearing panel").toEqual({ q3: 3, q4: 4 });
    p1.visible = true;
    expect(survey.data, "Restore default value on making panel visible").toEqual({ q1: 5, q3: 3, q4: 4 });
    survey.data = { q1: 1, q2: 2, q3: 3, q4: 4 };
    survey.pages[0].visible = false;
    expect(survey.data, "Clear values on clearing page").toEqual({ q4: 4 });
    survey.pages[0].visible = true;
    expect(survey.data, "Restore default value on making page visbile").toEqual({ q1: 5, q4: 4 });
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
    expect(q1.validate(), "value < 5").toBe(false);
    expect(hasQuestion, "this.question is not undefined").toBe(true);
    q1.value = 10;
    expect(q1.validate(), "value > 5").toBe(true);
    FunctionFactory.Instance.unregister("getCustValue");
    expect(hasQuestion, "this.question is not undefined#2").toBe(true);
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
    expect(survey.data, "Triggers run successful").toEqual({ q1: 5, q2: 5, q3: 10, q4: 20 });
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
    expect(survey.getValue("q2"), "Set correct date on trigger").toBe(val);
  });

  test("Update progressText on changing locale, Bug#2453", () => {
    var survey = new SurveyModel();
    survey.addPage(createPageWithQuestion("Page 1"));
    survey.addPage(createPageWithQuestion("Second page", "q2"));
    expect(survey.progressText, "in en").toBe("Page 1 of 2");
    var oldLocale = survey.locale;
    survey.locale = "de";
    expect(survey.progressText, "in de").toBe("Seite 1 von 2");
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
    expect(survey.locEditText.textOrHtml, "Edit - en").toBe("Edit");
    const editAction = panel.getFooterToolbar().getActionById("cancel-preview");
    expect(editAction.locTitle.textOrHtml, "Action - en").toBe("Edit");
    survey.locale = "de";
    expect(survey.locEditText.textOrHtml, "Edit - de").toBe("Bearbeiten");
    expect(editAction.locTitle.textOrHtml, "Action - de").toBe("Bearbeiten");
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
    expect(survey.getQuestionByName("q1").inputId, "q1 is required").toBe(focusedQuestionId);
    survey.setValue("q1", "val1");
    focusedQuestionId = "";
    survey.tryComplete();
    expect(survey.getQuestionByName("q2").inputId, "q2 has error").toBe(focusedQuestionId);
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
    expect(survey.getQuestionByName("q1").inputId, "q1 is required").toBe(focusedQuestionId);
    survey.setValue("q1", "val1");
    focusedQuestionId = "";
    survey.tryComplete();
    returnResult(0);
    expect(survey.getQuestionByName("q2").inputId, "q2 has error").toBe(focusedQuestionId);
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
    expect(q2.isVisible, "visible #1").toBe(false);
    q1.value = 1;
    returnResult(false);
    expect(q2.isVisible, "visible #2").toBe(true);
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
    expect(survey.currentPageNo, "The first page is active").toBe(0);
    expect(survey.getQuestionByName("q1").inputId, "q1 is required and q0 is not").toBe(focusedQuestionId);
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
    expect(survey.currentPageNo, "Allow to go the second page").toBe(1);
    survey.nextPage();
    expect(survey.currentPageNo, "Allow to go the third page").toBe(2);
    survey.tryComplete();
    expect(survey.currentPageNo, "The first page is active").toBe(0);
    expect(q1Value, "options.data set correctly").toBe("val1");
    expect(survey.getQuestionByName("q1").inputId, "q1 is required and q0 is not").toBe(focusedQuestionId);
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
    expect(survey.currentPageNo, "comeback to the first page").toBe(0);
    expect(survey.getQuestionByName("q1").name, "panel is required").toBe(focusedQuestionName);
    expect(counter, "focusQuestion called one time").toBe(1);
    expect(isOnError, "focusQuestion called with onError = true").toBe(true);
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
    expect(survey.currentPageNo, "survey.currentPageNo = 1").toBe(1);
    survey.nextPage();
    expect(survey.currentPageNo, "survey.currentPageNo = 2").toBe(2);
    focusedQuestionId = "";
    survey.tryComplete();
    survey.afterRenderPage(<HTMLElement>{});
    expect(survey.currentPageNo, "The first page is active").toBe(0);
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
    expect(counter, "Counter calls 2 times").toBe(2);
    survey.showPreview();
    expect(counter, "Counter calls 3 times").toBe(3);
    expect(survey.state, "We are in preview state").toBe("preview");
    survey.cancelPreview();
    generateError = true;
    survey.showPreview();
    expect(counter, "Counter calls 4 times").toBe(4);
    expect(survey.state, "We have an error").toBe("running");
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
    expect(survey.state, "Survey is not completed").toBe("running");
    expect(survey.getQuestionByName("q2").errors.length, "There is an error in the question").toBe(1);
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
    expect(survey.state, "Survey is completed").toBe("completed");
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
    expect(survey.isShowProgressBarOnBottom, "We need to show progress bar").toBe(true);
    survey.showPreview();
    expect(survey.isShowProgressBarOnBottom, "We don't need to show progress bar").toBe(false);
    survey.cancelPreview();
    expect(survey.isShowProgressBarOnBottom, "We need to show progress bar again").toBe(true);
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
    expect(q1.isCollapsed, "Question1 is collapsed").toBe(true);
    q1.validate(true);
    expect(q1.isCollapsed, "Question1 is not collapsed").toBe(false);
    expect(q1.isExpanded, "Question1 is expanded").toBe(true);
  });

  test("Do not show empty required text", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("page1");
    var q1 = page.addNewQuestion("text", "q1");
    q1.isRequired = true;
    expect(q1.isRequireTextBeforeTitle, "numTitleRequire - No required text before").toBe(false);
    expect(q1.isRequireTextAfterTitle, "numTitleRequire - Required text after").toBe(true);
    survey.questionTitlePattern = "numRequireTitle";
    expect(q1.isRequireTextBeforeTitle, "numRequireTitle - Required text before").toBe(true);
    expect(q1.isRequireTextAfterTitle, "numRequireTitle - No required text after").toBe(false);
    survey.requiredMark = "";
    expect(q1.isRequireTextBeforeTitle, "numRequireTitle - No required text before ''").toBe(false);
    expect(q1.isRequireTextAfterTitle, "numRequireTitle - No required text after ''").toBe(false);
    survey.questionTitlePattern = "numTitleRequire";
    expect(q1.isRequireTextBeforeTitle, "numTitleRequire - No required text before ''").toBe(false);
    expect(q1.isRequireTextAfterTitle, "numTitleRequire - No required text after ''").toBe(false);
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
    expect([...(panel.getTitleActions())]).toEqual(testActions);
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
    expect([...(question.getTitleActions())]).toEqual(testActions);
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
    expect([...(page.getTitleActions())]).toEqual(testActions);
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
    expect(q1.visibleChoices.length, "There are 4 items").toBe(4);
    var json = q1.toJSON();
    var q2 = new QuestionImagePickerModel("q2");
    q2.fromJSON(json);
    expect(q2.visibleChoices.length, "There are 3 items").toBe(3);
  });

  test("onTextRenderAs event", () => {
    var survey = new SurveyModel();
    const questionName = "any question";
    var locString = new LocalizableString(survey, false, "name");

    var renderAs = survey.getRenderer(questionName);
    expect(locString.renderAs).toBe(LocalizableString.defaultRenderer);
    expect(renderAs).toBeUndefined();

    survey.setDesignMode(true);
    renderAs = survey.getRenderer(questionName);
    expect(locString.renderAs).toBe(LocalizableString.editableRenderer);
    expect(renderAs).toBe(LocalizableString.editableRenderer);

    survey.setDesignMode(false);
    renderAs = survey.getRenderer(questionName);
    expect(locString.renderAs).toBe(LocalizableString.defaultRenderer);
    expect(renderAs).toBeUndefined();

    const customRendererView = "my-custom-renderer-view";
    const customRendererEdit = "my-custom-renderer-edit";
    survey.onTextRenderAs.add((s, e) => {
      if (s.isDesignMode) e.renderAs = customRendererEdit;
      else e.renderAs = customRendererView;
    });

    renderAs = survey.getRenderer(questionName);
    expect(locString.renderAs).toBe(customRendererView);
    expect(renderAs).toBe(customRendererView);

    survey.setDesignMode(true);
    renderAs = survey.getRenderer(questionName);
    expect(locString.renderAs).toBe(customRendererEdit);
    expect(renderAs).toBe(customRendererEdit);

    survey.setDesignMode(false);
    renderAs = survey.getRenderer(questionName);
    expect(locString.renderAs).toBe(customRendererView);
    expect(renderAs).toBe(customRendererView);
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
    expect(locString.renderAs).toBe(customRendererView);
    expect(renderAs).toBe(customRendererView);

    survey.setDesignMode(true);
    renderAs = survey.getRenderer(questionName);
    expect(locString.renderAs).toBe(customRendererEdit);
    expect(renderAs).toBe(customRendererEdit);

    survey.setDesignMode(false);
    renderAs = survey.getRenderer(questionName);
    expect(locString.renderAs).toBe(customRendererView);
    expect(renderAs).toBe(customRendererView);
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
    expect(res.str.name, "string is correct").toBe("name");
    expect(res.el.name, "element is correct").toBe("page1");
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
    expect(survey.getQuestionByName("q1").isInputReadOnly, "q1").toBe(true);
    expect(survey.getQuestionByName("q2").isInputReadOnly, "q2").toBe(true);
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
    expect(survey.getQuestionByName("q1").isInputReadOnly, "q1").toBe(true);
    expect(survey.getQuestionByName("q2").isInputReadOnly, "q2").toBe(true);

    survey.getQuestionByName("q2").forceIsInputReadOnly = false;
    expect(survey.getQuestionByName("q1").isInputReadOnly, "q1").toBe(true);
    expect(survey.getQuestionByName("q2").isInputReadOnly, "q2 with forceIsInputReadOnly").toBe(false);
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
    expect(stateChangedCounter).toBe(0);

    var panel: PanelModel = <PanelModel>survey.getAllPanels()[0];
    panel.expand();
    expect(stateChangedCounter).toBe(1);
    panel.expand();
    expect(stateChangedCounter).toBe(1);
    panel.collapse();
    expect(stateChangedCounter).toBe(2);
    panel.collapse();
    expect(stateChangedCounter).toBe(2);
    panel.toggleState();
    expect(stateChangedCounter).toBe(3);
    panel.toggleState();
    expect(stateChangedCounter).toBe(4);
    panel.state = "expanded";
    expect(stateChangedCounter).toBe(5);
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

    expect(page.survey.state).toBe("running");
    expect(panel.survey.state).toBe("running");
    expect(question.survey.state).toBe("running");
    expect(survey.calculatedValues[0].getSurvey().state).toBe("running");
    expect(survey.triggers[0].getSurvey().state).toBe("running");
    expect(question.validators[0].getSurvey().state).toBe("running");
    expect(matrixDynamic.columns[0].getSurvey().state).toBe("running");
    expect(matrix.rows[0].getSurvey().state).toBe("running");
    expect(matrix.columns[0].getSurvey().state).toBe("running");
    expect(matrixDropdown.rows[0].getSurvey().state).toBe("running");
    expect(matrixDynamic.columns[0].templateQuestion.survey.state).toBe("running");
    expect(matrixDynamic.columns[0].choices[0].getSurvey().state).toBe("running");
    expect(mutlipleText.items[0].getSurvey().state).toBe("running");
    expect(dropdown.choicesByUrl.getSurvey().state).toBe("running");
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
    expect(a, "Do not call an event that is after diposing").toBe(1);
  });
  test("survey.isLazyRendering", () => {
    var survey = new SurveyModel();
    expect(survey.isLazyRendering, "Not set").toBe(false);
    settings.lazyRowsRendering = true;
    expect(survey.isLazyRendering, "set in settings").toBe(true);
    settings.lazyRowsRendering = false;
    expect(survey.isLazyRendering, "Not set 2").toBe(false);
    survey.lazyRenderEnabled = true;
    expect(survey.isLazyRendering, "set in survey").toBe(true);
  });
  test("getSize", () => {
    expect(getRenderedSize("300px"), "300px").toBe(300);
    expect(getRenderedStyleSize("300px"), "300px").toBeUndefined();
    expect(getRenderedSize("100%"), "100%").toBeUndefined();
    expect(getRenderedStyleSize("100%"), "300px").toBe("100%");
    expect(getRenderedSize(100), "100px").toBe(100);
    expect(getRenderedStyleSize(100), "100").toBeUndefined();
  });
  test("survey logo size", () => {
    var survey = new SurveyModel();
    expect(survey.logoWidth, "auto").toBe("auto");
    expect(survey.logoHeight, "40px").toBe("40px");
    expect(survey.renderedLogoWidth).toBeUndefined();
    expect(survey.renderedLogoHeight).toBe(40);
    expect(survey.renderedStyleLogoWidth).toBe("auto");
    expect(survey.renderedStyleLogoHeight).toBeUndefined();
    survey.logoWidth = "100%";
    survey.logoHeight = "auto";
    expect(survey.logoWidth, "100%").toBe("100%");
    expect(survey.renderedLogoWidth).toBeUndefined();
    expect(survey.renderedLogoHeight).toBeUndefined();
    expect(survey.renderedStyleLogoWidth).toBe("100%");
    expect(survey.renderedStyleLogoHeight).toBe("auto");
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
    expect(findRes.length, "Find by question title/name").toBe(3);
    findRes = survey.searchText("My");
    expect(findRes.length, "Find by element title").toBe(3);
    findRes = survey.searchText("");
    expect(findRes.length, "Empty string returns nothing").toBe(0);
    findRes = survey.searchText("my");
    expect(findRes.length, "Find by element title, we ignore cases").toBe(3);
    findRes = survey.searchText("item");
    expect(findRes.length, "Find choices").toBe(2);
    expect(findRes[1].element["name"], "Find choices").toBe("question2");
  });
  test("send notification on setLocale change for survey.title", () => {
    var survey = new SurveyModel();
    var newValue;
    survey.onPropertyChanged.add((sender, options) => {
      newValue = options.newValue;
    });
    survey.locTitle.setLocaleText("", "new title");
    expect(survey.title, "survey title is correct").toBe("new title");
    expect(newValue, "we send notification").toBe("new title");
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
    expect(q1.dataList, "question dataList is correct").toEqual(["Item 1", "Item 2", "Item 3"]);
    expect(newValue, "we send notification").toEqual({ default: ["Item 1", "Item 2", "Item 3"] });
    expect(oldValue, "old Value is correct").toEqual({ default: ["Item 1", "Item 2"] });
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
    expect(pageName, "We render the started page").toBe("Start Page");
    survey.start();
    survey.afterRenderPage(undefined);
    expect(pageName, "We render the first page").toBe("First Page");
  });
  test("Custom widget, test canShowInToolbox read-only property", () => {
    CustomWidgetCollection.Instance.clear();

    var readOnlyCounter = 0;
    var widget = CustomWidgetCollection.Instance.addCustomWidget({
      name: "first",
    });
    expect(widget.canShowInToolbox, "widget is activated by property").toBe(false);
    widget = CustomWidgetCollection.Instance.addCustomWidget(
      {
        name: "second",
      },
      "customtype"
    );
    expect(widget.canShowInToolbox, "widget is activated by customtype").toBe(true);
    var isLoaded = false;
    widget.widgetJson.widgetIsLoaded = (): boolean => {
      return isLoaded;
    };
    expect(widget.canShowInToolbox, "widget is not loaded").toBe(false);
    isLoaded = true;
    expect(widget.canShowInToolbox, "widget is loaded").toBe(true);
    widget.showInToolbox = false;
    expect(widget.canShowInToolbox, "widget is not show in toolbox").toBe(false);
    widget.showInToolbox = true;
    expect(widget.canShowInToolbox, "widget is show in toolbox").toBe(true);

    CustomWidgetCollection.Instance.clear();
  });
  test("getElementWrapperComponentName", () => {
    var survey = new SurveyModel();
    expect(survey.getElementWrapperComponentName(null), "default component").toEqual(SurveyModel.TemplateRendererComponentName);
    expect(survey.getElementWrapperComponentName(null, "logo-image"), "logo-image default component").toEqual("sv-logo-image");
  });
  test("getQuestionContentWrapperComponentName", () => {
    var survey = new SurveyModel();
    expect(survey.getQuestionContentWrapperComponentName(null), "default component").toEqual(SurveyModel.TemplateRendererComponentName);
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
    expect(survey.getElementWrapperComponentName(q1, "test1"), "#1").toBe("sv-template-renderer#1");
    expect(survey.getQuestionContentWrapperComponentName(q1), "#2").toBe("sv-template-renderer#2");
    expect(survey.getRowWrapperComponentName(new QuestionRowModel(survey.pages[0])), "#3").toBe("sv-template-renderer#3");
    expect(survey.getItemValueWrapperComponentName(q2.choices[0], q2), "#4").toBe("sv-template-renderer#4");
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
    expect(survey.getElementWrapperComponentData(q1, "test1"), "#1").toBe("#1");
    expect(survey.getRowWrapperComponentData(new QuestionRowModel(survey.pages[0])), "#2").toBe("#2");
    expect(survey.getItemValueWrapperComponentData(q2.choices[0], q2), "#3").toBe("#3");
    expect(survey.getMatrixCellTemplateData(q3.visibleRows[0].cells[0]), "#4").toBe("#4");
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
    expect(survey.currentPage.name, "We moved to another page").toBe("page2");
    expect(focusedQuestions.length, "Only one question was focused").toBe(1);
    expect(focusedQuestions[0], "The third question is focused").toBe(survey.getQuestionByName("q3").inputId);
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
    expect(survey.currentPage.name, "We moved to another page").toBe("page3");
    survey.prevPage();
    expect(survey.currentPage.name, "We returned to first page skipping second").toBe("page1");
    survey.getQuestionByName("q1").value = "item1";
    survey.nextPage();
    expect(survey.currentPage.name, "We moved to second page").toBe("page2");
    survey.nextPage();
    expect(survey.currentPage.name, "We moved to third page").toBe("page3");
    survey.prevPage();
    expect(survey.currentPage.name, "We returned to second page").toBe("page2");
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
    expect(survey.currentSingleQuestion.name, "We moved to another page").toBe("q3");
    survey.prevPage();
    expect(survey.currentSingleQuestion.name, "We returned to first page skipping second").toBe("q1");
    survey.getQuestionByName("q1").value = "item1";
    survey.nextPage();
    expect(survey.currentSingleQuestion.name, "We moved to second page").toBe("q2");
    survey.nextPage();
    expect(survey.currentSingleQuestion.name, "We moved to third page").toBe("q3");
    survey.prevPage();
    expect(survey.currentSingleQuestion.name, "We returned to second page").toBe("q2");
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
    expect(focusedQuestions.length, "First skip").toBe(1);
    expect(focusedQuestions[0], "The second question is focused").toBe(survey.getQuestionByName("q2").inputId);
    survey.getQuestionByName("q1").value = "item3";
    expect(focusedQuestions.length, "Second skip").toBe(2);
    expect(focusedQuestions[1], "The third question is focused").toBe(survey.getQuestionByName("q3").inputId);
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
    expect(survey.currentPage.name, "We are still on the first page").toBe("page1");
    survey.getQuestionByName("q1").otherValue = "abc";
    expect(survey.currentPage.name, "We moved to another page").toBe("page3");
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
    expect(survey.currentPage.visibleIndex, "We are on the first page").toBe(0);
    let counter = 0;
    survey.onCurrentPageChanged.add((sender, options) => {
      counter++;
    });
    survey.getQuestionByName("q1").value = "a";
    survey.getQuestionByName("q2").value = "b";
    expect(survey.getVariable("var1"), "var1 value").toBe(1);
    expect(survey.getVariable("var2"), "var2 value").toBe(1);
    expect(survey.getVariable("var3"), "var3 value").toBe(2);
    expect(survey.getVariable("var4"), "var4 value").toBe(true);
    expect(survey.currentPage.visibleIndex, "We are on the last page").toBe(2);
    expect(counter, "We changed the page only one time").toBe(1);
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
    expect(page.isPage, "Page is page").toBe(true);
    expect(page.isPanel, "Page is not panel").toBe(false);
    expect(page.isQuestion, "Page is not question").toBe(false);
    expect(panel.isPage, "Panel is not page").toBe(false);
    expect(panel.isPanel, "Panel is panel").toBe(true);
    expect(panel.isQuestion, "Panel is not question").toBe(false);
    expect(question.isPage, "Question is not page").toBe(false);
    expect(question.isPanel, "Question is not panel").toBe(false);
    expect(question.isQuestion, "Question is question").toBe(true);
  });
  test("Test survey renderedHasTitle/renderedHasLogo properties", () => {
    var survey = new SurveyModel();
    expect(survey["titleIsEmpty"], "titleIsEmpty due to no title").toBe(true);
    expect(survey.renderedHasHeader, "hasHeader, title and logo are invisible").toBe(false);
    expect(survey.renderedHasTitle, "There is not title").toBe(false);
    survey.title = "title";
    expect(survey["titleIsEmpty"], "titleIs not Empty due to title has been set").toBe(false);
    expect(survey.renderedHasTitle, "There is title").toBe(true);
    expect(survey.renderedHasHeader, "hasHeader, title is visible").toBe(true);
    survey.showTitle = false;
    expect(survey.renderedHasTitle, "hasTitle is false").toBe(false);

    expect(survey.renderedHasLogo, "There is not logo").toBe(false);
    survey.logo = "logo";
    expect(survey.renderedHasLogo, "There is logo").toBe(true);
    survey.logoPosition = "none";
    expect(survey.renderedHasTitle, "logo position is 'none'").toBe(false);

    survey.setDesignMode(true);
    expect(survey.renderedHasTitle, "There is title, design").toBe(true);
    expect(survey.renderedHasLogo, "There is logo, design").toBe(true);
    expect(survey.isLogoBefore, "We do not render logo before at design, design").toBe(false);
    expect(survey.isLogoAfter, "We do render logo after at design, design").toBe(true);
    expect(survey.renderedHasHeader, "hasHeader, properties are visible").toBe(true);

    Serializer.findProperty("survey", "title").visible = false;
    Serializer.findProperty("survey", "logo").visible = false;
    expect(survey.renderedHasTitle, "There is no title, design, property invisible").toBe(false);
    expect(survey.renderedHasLogo, "There is no logo, design, property invisible").toBe(false);
    expect(survey.isLogoAfter, "We do not render logo after since the property is hidden, design").toBe(false);
    expect(survey.renderedHasHeader, "hasHeader, properties are invisible").toBe(false);
    Serializer.findProperty("survey", "title").visible = true;
    Serializer.findProperty("survey", "logo").visible = true;
  });
  test("Test survey renderedHasDescription property", () => {
    var survey = new SurveyModel();
    expect(survey.renderedHasDescription, "hasDescription, decription is invisible").toBe(false);

    survey.setDesignMode(true);
    expect(survey.renderedHasDescription, "description is visible in design mode").toBe(true);

    survey.setDesignMode(false);
    survey.description = "description";
    expect(survey.renderedHasDescription, "There is description").toBe(true);
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
    expect(surveyPropertyName, "get notification from survey").toBe("setValue");
    expect(triggerPropertyName, "get notification from trigger").toBe("setValue");
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
    expect(survey.pages.length).toBe(1);
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

    expect(survey.autoGrowComment, "#1").toBe(true);
    expect(comment1.renderedAutoGrow, "#2").toBe(true);
    expect(comment2.renderedAutoGrow, "#3").toBe(true);

    survey.autoGrowComment = false;
    expect(comment1.renderedAutoGrow, "#4").toBe(false);
    expect(comment2.renderedAutoGrow, "#5").toBe(true);
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
    expect(question.toJSON(), "#1").toEqual({ name: "q1" });
    question.allowResize = false;
    question.autoGrow = false;
    expect(question.toJSON(), "#2").toEqual({ name: "q1", allowResize: false, autoGrow: false });
    question.allowResize = true;
    question.autoGrow = true;
    expect(question.toJSON(), "#3").toEqual({ name: "q1", allowResize: true, autoGrow: true });
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

    expect(survey.allowResizeComment).toBe(false);
    expect(comment1.renderedAllowResize, "comment1 survey.allowResizeComment = false, #1").toBe(false);
    expect(comment2.renderedAllowResize, "comment2 survey.allowResizeComment = false, #2").toBe(false);

    survey.allowResizeComment = true;
    expect(comment1.renderedAllowResize, "comment1 survey.allowResizeComment = true, #3").toBe(true);
    expect(comment2.renderedAllowResize, "comment2 survey.allowResizeComment = true, #4").toBe(false);

    survey.showPreview();
    let comment1Preview = survey.getQuestionByName("comment1");
    expect(comment1Preview.renderedAllowResize, "#5").toBe(true);
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

    expect(comment1.renderedAllowResize, "comment1 survey.allowResizeComment = false, #1").toBe(true);
    expect(comment1.renderedAutoGrow, "comment1 survey.autoGrowComment = false, #2").toBe(true);
    expect(comment2.renderedAllowResize, "comment2 survey.allowResizeComment = false, #3").toBe(false);
    expect(comment2.renderedAutoGrow, "comment2 survey.autoGrowComment = false, #4").toBe(false);
    expect(comment3.renderedAutoGrow, "comment2 survey.autoGrowComment = false, #5").toBe(false);

    survey.allowResizeComment = true;
    survey.autoGrowComment = true;
    expect(comment1.renderedAllowResize, "comment1 survey.allowResizeComment = true, #6").toBe(true);
    expect(comment1.renderedAutoGrow, "comment1 survey.autoGrowComment = true, #7").toBe(true);
    expect(comment2.renderedAllowResize, "comment2 survey.allowResizeComment = true, #8").toBe(true);
    expect(comment2.renderedAutoGrow, "comment2 survey.autoGrowComment = true, #9").toBe(true);
    expect(comment3.renderedAutoGrow, "comment2 survey.autoGrowComment = true, #10").toBe(false);
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
    expect(element.style.height).toBe("103px");

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
    expect(element.style.height).toBe("79px");

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
    expect(element.style.height).toBe("103px");

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
    expect(survey.getQuestionByName("q1").titleTagName).toBe("div");
    expect((<PanelModel>survey.getPanelByName("p1")).titleTagName).toBe("div");
    expect(survey.pages[0].titleTagName).toBe("div");
    expect(survey.titleTagName).toBe("div");
    expect(survey.cssTitle, "survey css").toBe(survey.css.title);
    expect(survey.pages[0].cssTitle, "page css").toBe("sv_page_title");
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
    expect(survey.getQuestionByName("q1").titleTagName).toBe("h4");
    expect((<PanelModel>survey.getPanelByName("p1")).titleTagName).toBe("h3");
    expect(survey.pages[0].titleTagName).toBe("h2");
    expect(survey.titleTagName).toBe("h1");
    survey.onGetTitleTagName.add((sender, options) => {
      options.tagName = options.tagName + options.element.getType()[0];
    });
    expect(survey.getQuestionByName("q1").titleTagName).toBe("h4t");
    expect((<PanelModel>survey.getPanelByName("p1")).titleTagName).toBe("h3p");
    expect(survey.pages[0].titleTagName).toBe("h2p");
    expect(survey.titleTagName).toBe("h1s");
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
    expect(question.titleTabIndex, "We do not have tabIndex").toBeUndefined();
    question.state = "collapsed";
    expect(question.titleTabIndex, "We need tabIndex now").toBe(0);
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
    expect(panel.hasTitle, "We show title for panels").toBe(true);
    expect(page.hasTitle, "We hide title for page").toBe(false);
    survey.setDesignMode(true);
    expect(panel.hasTitle, "We show title for panels in design").toBe(true);
    expect(page.hasTitle, "We show title for page in design").toBe(true);
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
    expect(panel.hasTitleActions, "Delete all actions").toBe(false);
    expect(panel.hasTitleEvents, "It has non defult state").toBe(true);
    panel.state = "default";
    expect(panel.hasTitleEvents, "It has defult state").toBe(false);
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
    expect(panel.hasTitleEvents, "hasTitleEvents should return false if question has 'default' state").toBe(false);
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
    expect(question.name).toBe("Q1");
    expect(hash["name"]).toBe(1);
    question.title = " hello  ";
    expect(question.title).toBe(" hello  ");
    expect(hash["title"]).toBe(1);
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
    expect(counter).toBe(1);
    question.value = "Q";
    expect(counter).toBe(2);
    question.value = " Q ";
    expect(counter).toBe(3);
    expect(survey.getValue("q1")).toBe(" Q ");
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
    expect(counter).toBe(1);
    rows[1].cells[0].value = " Val2 ";
    expect(counter).toBe(2);
    expect(question.value).toEqual([{ col1: "val1" }, { col1: " Val2 " }]);
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
    expect(question.visibleChoices.length, "Visible choices are set").toBe(3);
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
    expect(startPage.isVisible, "started page is visible").toBe(true);
  });
  test("firstPageIsStartPage = true and prevPage()", () => {
    var survey = new SurveyModel();
    for (var i = 0; i < 3; i++) {
      let page = survey.addNewPage("p" + i + 1);
      page.addNewQuestion("text");
    }
    survey.firstPageIsStartPage = true;
    expect(survey.prevPage()).toBe(false);
    survey.start();
    expect(survey.prevPage()).toBe(false);
    survey.nextPage();
    expect(survey.prevPage()).toBe(true);
    expect(survey.currentPageNo).toBe(0);
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
    expect(q2.isVisible, "initially invisible").toBe(false);
    survey.setValue("q1", 1);
    expect(q2.isVisible, "visible now").toBe(true);
    survey.nextPage();
    survey.doComplete();
    survey.clear(true, true);
    expect(q2.isVisible, "invisible again").toBe(false);
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
    expect(survey.state, "starting state #1").toBe("starting");
    expect(survey.getPropertyValue("isStartedState"), "isStartedState #1").toBe(true);
    expect(startButton.isVisible, "startButton is visible, #1").toBe(true);
    expect(survey.showNavigationButtons, "Show navigation on bottom - true").toBe(true);
    expect(survey.navigationButtonsLocation, "Show navigation on bottom").toBe("bottom");
    survey.start();
    expect(survey.state, "run survey").toBe("running");
    expect(survey.getPropertyValue("isStartedState"), "isStartedState #2").toBe(false);
    survey.doComplete();
    expect(survey.state, "survey is completed").toBe("completed");
    expect(survey.getPropertyValue("isStartedState"), "isStartedState #3").toBe(false);
    survey.clear();
    expect(survey.state, "starting state #2").toBe("starting");
    expect(survey.getPropertyValue("isStartedState"), "isStartedState #4").toBe(true);
    expect(startButton.isVisible, "startButton is visible, #2").toBe(true);
    expect(survey.isNavigationButtonsShowing, "Show navigation buttons on start").toBe("bottom");
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
    expect(survey.skeletonComponentName).toBe("sv-skeleton");
    expect(question.skeletonComponentName).toBe("sv-skeleton");
    survey.skeletonComponentName = "";
    expect(survey.skeletonComponentName).toBe("");
    expect(question.skeletonComponentName).toBe("");
  });
  test("Make sure to have currentPage on adding new question/page/visibility in code", () => {
    const survey = new SurveyModel();
    expect(survey.getPropertyValue("currentPage"), "There is no pages").toBeUndefined();
    const newPage = new PageModel("page1");
    newPage.addNewQuestion("text", "q1");
    survey.pages.push(newPage);
    expect(survey.getPropertyValue("currentPage").name, "We have added a new current page").toBe(survey.pages[0].name);
    survey.pages.shift();
    expect(survey.getPropertyValue("currentPage"), "There is no new pages again").toBeNull();
    survey.addNewPage("page1");
    expect(survey.getPropertyValue("currentPage"), "There is no visible pages").toBeNull();
    survey.pages[0].addNewQuestion("text", "q1");
    expect(survey.getPropertyValue("currentPage").name, "There is current page").toBe(survey.pages[0].name);
    survey.pages[0].visible = false;
    expect(survey.getPropertyValue("currentPage"), "We make page invisible").toBeNull();
    survey.pages[0].visible = true;
    expect(survey.getPropertyValue("currentPage").name, "We make the page visible").toBe(survey.pages[0].name);
  });
  test("Make invisible question visible in the only page", () => {
    const survey = new SurveyModel();
    expect(survey.getPropertyValue("currentPage"), "There is no pages").toBeUndefined();
    const newPage = new PageModel("page1");
    newPage.addNewQuestion("text", "q1");
    newPage.addNewQuestion("text", "q2");
    newPage.questions[0].visible = false;
    newPage.questions[1].visible = false;
    survey.pages.push(newPage);
    expect(survey.getPropertyValue("currentPage"), "There is no visible pages").toBeUndefined();
    newPage.questions[0].visible = true;
    expect(survey.getPropertyValue("currentPage").name, "New page is visible now").toBe(survey.pages[0].name);
    newPage.questions[0].visible = false;
    expect(survey.getPropertyValue("currentPage"), "There is no visible pages, #2").toBeNull();
    newPage.questions[1].visible = true;
    expect(survey.getPropertyValue("currentPage").name, "New page is visible now, #2").toBe(survey.pages[0].name);
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
    expect(survey.data, "value is in data").toEqual({ invisible: "val2" });
    survey.setValue("q1", 1);
    survey.doComplete();
    expect(survey.data, "value is empty now").toEqual({ q1: 1 });
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
    expect(counter, "onQuestionAdded is not fired").toBe(0);
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
    expect(addedCounter, "onQuestionAdded is not fired, #1").toBe(0);
    survey.getQuestionByName("q1").page = survey.pages[1];
    survey.getQuestionByName("q3").page = survey.pages[0];
    expect(addedCounter, "onQuestionAdded is not fired, #2").toBe(0);
    const q = new QuestionTextModel("q5");
    q.page = survey.pages[1];
    expect(addedCounter, "onQuestionAdded is fired for q5, #3").toBe(1);
    expect(removedCounter, "onQuestionRemoved #1").toBe(0);
    q.delete();
    expect(removedCounter, "onQuestionRemoved #2").toBe(1);
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
    expect(survey.data, "Survey data is correct").toEqual({ q1: 1, q2: [1, 2] });
    const q1 = <QuestionRadiogroupModel>survey.getQuestionByName("q1");
    const q2 = <QuestionCheckboxModel>survey.getQuestionByName("q2");
    expect(q1.value, "radiogroup value").toBe(1);
    expect([...(q2.value)], "checkbox value").toEqual([1, 2]);
    expect(q1.renderedValue, "radiogroup rendered value").toBe(1);
    expect([...(q2.renderedValue)], "checkbox rendered value").toEqual([1, 2]);
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
    expect(q2.isEmpty(), "question is empty").toBe(true);
    survey.setValue("q1", 2);
    expect([...(q2.value)], "Respect default value").toEqual([1]);
    survey.setValue("q1", 1);
    expect(q2.isEmpty(), "question is empty again").toBe(true);
    survey.setValue("q1", 2);
    expect([...(q2.value)], "Respect default value again").toEqual([1]);
    q2.value = [2];
    survey.setValue("q1", 1);
    survey.setValue("q1", 2);
    expect([...(q2.value)], "default value is goine").toEqual([2]);
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
    expect(survey.getValue("question2"), "Trigger is working").toBe("item2");
    expect(survey.data, "Data is correct").toEqual({ question1: "item2", question2: "item2" });
    survey.doComplete();
    expect(survey.data, "Data is correct after completed").toEqual({ question1: "item2", question2: "item2" });
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
    expect(survey.getValue("a")).toBe("abc");
    survey.clearValue("a");
    expect(getCounter > 0, "getCounter").toBe(true);
    expect(setCounter, "setCounter").toBe(1);
    expect(deleteCounter, "deleteCounter").toBe(1);
    const oldGetCount = getCounter;
    expect(survey.getValue("a")).toBeUndefined();
    expect(getCounter, "getCounter #2").toBe(oldGetCount + 1);
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
    expect(question2.isVisible, "Invisible by default").toBe(false);
    survey.setComment("question1", "abcd");
    expect(survey.data, "Check comment value").toEqual({ "question1-Comment": "abcd" });
    expect(question2.isVisible, "visible").toBe(true);
    survey.setComment("question1", "abc");
    expect(question2.isVisible, "Invisible again").toBe(false);
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
    expect(trace).toBe("->processed");
    (<any>survey["resizeObserver"]).call();
    expect(trace, "prevent double process").toBe("->processed");
    (<any>survey["resizeObserver"]).call();
    expect(trace).toBe("->processed->processed");
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
    expect(trace, "do not process responsivness on invisible container").toBe("");
    rootEl.style.display = "block";
    __visible = true;
    (<any>survey["resizeObserver"]).call();
    expect(trace, "process responsivness on visible container").toBe("->processed");
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
    expect(log).toBe("->width: 500; height: 800");
    expect(survey._isMobile).toBeTruthy();
    expect(isProcessed).toBeTruthy();

    log = "";
    isProcessed = survey["processResponsiveness"](600, 500, 400);
    expect(log).toBe("->width: 600; height: 400");
    expect(isProcessed).toBeTruthy();

    log = "";
    isProcessed = survey["processResponsiveness"](800, 500, 300);
    expect(log).toBe("->width: 800; height: 300");
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
    const action1 = survey.addNavigationItem({ id: "custom-btn", visibleIndex: 3 });
    expect(action1 === survey.navigationBar.actions[0]).toBeTruthy();
    expect(action1.id).toBe("custom-btn");

    const action2 = survey.addNavigationItem({ id: "custom-btn-2", innerCss: "custom-css", visibleIndex: 11 });
    expect(action2.innerCss).toBe("custom-css");
    expect(action2 === survey.navigationBar.actions[2]).toBeTruthy();
    expect(action2.id).toBe("custom-btn-2");

    const action3 = survey.addNavigationItem({ id: "custom-btn-3", component: "custom-component", visibleIndex: 21 });
    expect(action3 === survey.navigationBar.actions[4]).toBeTruthy();
    expect(action3.component).toBe("custom-component");
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
      expect(action.id, "Action should have correct id").toBe("test-btn");

      survey["taskManager"].runTask("test-task", (completed) => {
        actionExecutionOrder.push("task-started");
        setTimeout(() => {
          actionExecutionOrder.push("task-completed");
          completed();
        }, 10);
      });

      expect(actionExecuted, "Action should not be executed immediately when there are active tasks").toBeFalsy();
      expect(actionExecutionOrder.length, "Only task-started should be in execution order").toBe(1);
      expect(actionExecutionOrder[0], "First should be task-started").toBe("task-started");

      action.action();

      vi.advanceTimersByTime(50);
      expect(actionExecuted, "Action should be executed after task completion").toBeTruthy();
      expect(actionExecutionOrder.length, "Should have 3 execution steps").toBe(3);
      expect(actionExecutionOrder[0], "First should be task-started").toBe("task-started");
      expect(actionExecutionOrder[1], "Second should be task-completed").toBe("task-completed");
      expect(actionExecutionOrder[2], "Third should be action-executed").toBe("action-executed");
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
    expect(action.id, "Action should have correct id").toBe("test-btn-2");

    action.action();

    expect(actionExecuted, "Action should be executed immediately when there are no active tasks").toBeTruthy();
    expect(actionExecutionOrder.length, "Should have 1 execution step").toBe(1);
    expect(actionExecutionOrder[0], "Should be action-executed").toBe("action-executed");

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
    expect(action.id, "Action should have correct id").toBe("test-btn-2");

    action.action();

    expect(actionExecuted, "Action should be executed immediately when there are no active tasks").toBeTruthy();
    expect(actionExecutionOrder.length, "Should have 1 execution step").toBe(1);
    expect(actionExecutionOrder[0], "Should be action-executed").toBe("action-executed");

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
    survey.css = { navigationBar: { item: "custom-action custom-css", itemAppearancePrefix: "" }, navigation: { start: "custom-start" } };
    const action = survey.navigationBar.actions[0];
    expect(action.getActionBarItemCss()).toBe("custom-action custom-css custom-start");
    survey.locale = "ru";
    expect(action.title).toBe("Начать"); // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
    survey.locale = "en";
    expect(action.title).toBe("Start");
    survey.startSurveyText = "custom-text";
    expect(action.title).toBe("custom-text");
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
    expect(survey.rootCss).toBe("test-root-class sv_progress--pages");
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
    survey.css = { navigationBar: { root: "custom-navigation", defaultSizeMode: "" }, footer: "custom-footer" };
    survey.navigationBar.flushUpdates();
    expect(survey.navigationBar.getRootCss()).toBe("custom-navigation custom-footer");
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
    expect(survey.getRootCss()).toBe("sd-root-modern sd-progress--pages sd-root-modern--full-container");

    survey.fitToContainer = false;
    expect(survey.getRootCss()).toBe("sd-root-modern sd-progress--pages");

    survey.setIsMobile(true);
    survey.fitToContainer = true;
    expect(survey.getRootCss()).toBe("sd-root-modern sd-progress--pages sd-root-modern--mobile sd-root-modern--full-container");

    survey.fitToContainer = false;
    expect(survey.getRootCss()).toBe("sd-root-modern sd-progress--pages sd-root-modern--mobile");

    survey.readOnly = true;
    survey.fitToContainer = true;
    expect(survey.getRootCss()).toBe("sd-root-modern sd-progress--pages sd-root-modern--mobile sd-root--readonly sd-root-modern--full-container");

    survey.fitToContainer = false;
    expect(survey.getRootCss()).toBe("sd-root-modern sd-progress--pages sd-root-modern--mobile sd-root--readonly");

    survey.readOnly = false;
    survey.setIsMobile(false);
    survey["isCompact"] = true;
    expect(survey.getRootCss()).toBe("sd-root-modern sd-progress--pages sd-root--compact");

    survey.fitToContainer = true;
    expect(survey.getRootCss()).toBe("sd-root-modern sd-progress--pages sd-root--compact sd-root-modern--full-container");
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
    expect(survey.activePage.id, "Initially active page is correct").toBe(survey.pages[0].id);
    expect(survey.navigationBar.getActionById("sv-nav-prev").visible, "PrevButton is not shown").toBe(false);
    survey.fromJSON(survey.toJSON());
    expect(survey.activePage.id, "Initially active page is correct").toBe(survey.pages[0].id);
    expect(survey.navigationBar.getActionById("sv-nav-prev").visible, "PrevButton is not shown #2").toBe(false);
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
    expect(survey.completeText, "text is correct").toBe("Submit");
    expect(survey.navigationBar.getActionById("sv-nav-complete").title, "Text in bar is correct").toBe("Submit");
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
    expect(question.visible, "It is visible initially").toBe(true);
    question.visibleIf = "{q2} = 1";
    expect(question.visible, "It is still visible").toBe(true);
    const panel = <PanelModel>survey.getPanelByName("panel");
    const panel2 = <PanelModel>panel.clone();
    const question2 = panel2.questions[0];
    expect(question2.visibleIf, "It is visible").toBe("{q2} = 1");
    expect(question2.visible, "It is visible").toBe(true);
    survey.pages[0].addElement(panel2);
    expect(question2.visible, "It is visible, #2").toBe(true);
    const newPanel = new PanelModel("newPanel");
    newPanel.addNewQuestion("text", "q3_1");
    newPanel.questions[0].visibleIf = "{q2} = 1";
    expect(newPanel.questions[0].visible, "new Panel question visible").toBe(true);
    const newPanel2 = <PanelModel>newPanel.clone();
    const newQuestion2 = newPanel2.questions[0];
    expect(newQuestion2.visibleIf, "It is visible").toBe("{q2} = 1");
    expect(newQuestion2.visible, "It is visible").toBe(true);
    survey.pages[0].addElement(newPanel2);
    expect(newQuestion2.visible, "It is visible, #2").toBe(true);
  });
  test("Ignore firstStartPage if there is only one page", () => {
    var survey = new SurveyModel({
      firstPageIsStartPage: true,
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2" }
      ]
    });
    expect(survey.state, "There is only one page").toBe("running");
    expect(survey.isCompleteButtonVisible, "Complete button is visible").toBe(true);
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

    expect(model.calculatedWidthMode).toBe("static");
    expect(model.bodyCss).toBe("css-body css-body--static");
    model.widthMode = "responsive";
    expect(model.calculatedWidthMode).toBe("responsive");
    expect(model.bodyCss).toBe("css-body css-body--responsive");

    model.widthMode = "auto";
    expect(model.calculatedWidthMode).toBe("static");

    model.getAllQuestions()[1].startWithNewLine = false;
    expect(model.calculatedWidthMode).toBe("responsive");

    model.getAllQuestions()[1].startWithNewLine = true;
    expect(model.calculatedWidthMode).toBe("static");

    model.pages[0].addNewQuestion("matrix", "qm");
    expect(model.calculatedWidthMode).toBe("responsive");
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
    expect(model.calculatedWidthMode).toBe("static");
    model.fromJSON(json);
    expect(model.calculatedWidthMode).toBe("static");
    model.getAllQuestions()[1].startWithNewLine = false;
    expect(model.calculatedWidthMode).toBe("responsive");
  });

  test("Check survey calculated width mode observability on question added", () => {
    const model = new SurveyModel({});
    expect(model.calculatedWidthMode).toBe("static");
    model.addNewPage();
    model.pages[0].addNewQuestion("matrix", "q1");
    expect(model.calculatedWidthMode).toBe("responsive");
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

    expect(model.widthMode).toBe("auto");
    expect(model.calculatedWidthMode).toBe("static");
    expect(model.renderedWidth, "auto static width undefined").toBeUndefined();

    model.width = "700px";
    expect(model.calculatedWidthMode).toBe("static");
    expect(model.renderedWidth, "auto static width 700px").toBe("700px");

    model.getAllQuestions()[1].startWithNewLine = false;
    expect(model.calculatedWidthMode).toBe("responsive");
    expect(model.renderedWidth, "auto responsive width undefined").toBeUndefined();

    model.widthMode = "static";
    expect(model.renderedWidth, "static width 700px").toBe("700px");

    model.widthMode = "responsive";
    expect(model.renderedWidth, "responsive width undefined").toBeUndefined();
  });

  test("Add px to numeric survey width", () => {
    const model = new SurveyModel();

    expect(model.widthMode).toBe("auto");
    expect(model.calculatedWidthMode).toBe("static");
    expect(model.renderedWidth, "auto static width undefined").toBeUndefined();

    model.width = "700";
    expect(model.calculatedWidthMode).toBe("static");
    expect(model.renderedWidth, "auto add px 700px").toBe("700px");
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
    expect(q1.errors.length).toBe(1);
    expect(q1.errors[0].locText.renderedHtml).toBe("Response required.");

    expect(q2.errors.length).toBe(1);
    expect(q2.errors[0].locText.renderedHtml).toBe("custom_error_text");

    expect(q3.errors.length).toBe(1);
    expect(q3.errors[0].locText.renderedHtml).toBe("custom_max_error_text 10");

    expect(q4.errors.length).toBe(1);
    expect(q4.errors[0].locText.renderedHtml).toBe("custom_min_error_text 10");

    expect(q5.errors.length).toBe(1);
    expect(q5.errors[0].locText.renderedHtml).toBe("custom_min_error_text");

    expect(q6.errors.length).toBe(1);
    expect(q6.errors[0].locText.renderedHtml).toBe("custom_other_error_text");

    survey.locale = "de";

    expect(q1.errors.length).toBe(1);
    expect(q1.errors[0].locText.renderedHtml).toBe("Bitte beantworten Sie diese Frage.");

    expect(q2.errors.length).toBe(1);
    expect(q2.errors[0].locText.renderedHtml).toBe("custom_error_text_deutch");

    expect(q3.errors.length).toBe(1);
    expect(q3.errors[0].locText.renderedHtml).toBe("custom_max_error_text_deutch 10");

    expect(q4.errors.length).toBe(1);
    expect(q4.errors[0].locText.renderedHtml).toBe("custom_min_error_text_deutch 10");

    expect(q5.errors.length).toBe(1);
    expect(q5.errors[0].locText.renderedHtml).toBe("custom_min_error_text_deutch");

    expect(q6.errors.length).toBe(1);
    expect(q6.errors[0].locText.renderedHtml).toBe("custom_other_error_text_deutch");

    //check that when return to default locale onChange isCalled
    let onChangedCalled = 0;
    q1.errors[0].locText.onChanged = () => {
      onChangedCalled++;
    };
    survey.locale = "en";

    expect(q1.errors.length).toBe(1);
    expect(onChangedCalled).toBe(1);
    expect(q1.errors[0].locText.renderedHtml).toBe("Response required.");
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
    expect(survey.getPropertyValue("isStartedState"), "the state is started").toBe(true);
    expect(survey.startPage.name, "The started page").toBe("page1");
    expect(survey.isShowingPage, "show the first page").toBe(true);
    expect(survey.state, "The state is starting").toBe("starting");
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
    expect(page.hasDescription, "Page description is shown for 'de'").toBe(true);
    expect(question.hasDescription, "Question description is shown for 'de'").toBe(true);
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
    expect(survey.getAllQuestions().length).toBe(1);
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
    expect(progressChangeCount, "Initial progress call count").toBe(0);
    question.value = ["1"];
    expect(progressChangeCount, "Progress hasn't been called").toBe(0);
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
    expect(p2.isExpanded, "Expand panel, p2").toBe(true);
    expect(p1.isExpanded, "Expand panel, p1").toBe(true);
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
    expect(question.choices.length, "There is not errors, choices still the same").toBe(2);
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
    expect(question1_1_2.visible, "question1_1_2 false").toBe(false);
    question1_1.value = "a";
    expect(question1_1_2.visible, "question1_1_2 true").toBe(true);
    expect(question1_1_3_3.visible, "question1_1_2_3 false").toBe(false);
    question1_1_2.value = "a";
    expect(question1_1_3_3.visible, "question1_1_2_3 true").toBe(true);
    expect(question1_1_2_3_4.visible, "question1_1_2_3_4 false").toBe(false);
    question1_1_3_3.value = "a";
    expect(question1_1_2_3_4.visible, "question1_1_2_3_4 true").toBe(true);
    expect(question1_1_2_3_4_5.visible, "question1_1_2_3_4_5 false").toBe(false);
    question1_1_2_3_4.value = "a";
    expect(question1_1_2_3_4_5.visible, "question1_1_2_3_4_5 true").toBe(true);
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

    expect(questionWF4_4.visible, "questionWF4_4 false").toBe(false);
    questionWF4_1.value = "Public";
    expect(questionWF4_4.visible, "questionWF4_4 true").toBe(true);

    expect(questionWF4_4_1.visible, "questionWF4_4_1 false").toBe(false);
    questionWF4_4.value = "Yes";
    expect(questionWF4_4_1.visible, "questionWF4_4_1 true").toBe(true);

    expect(questionWF4_4_1_1.visible, "questionWF4_4_1_1 false").toBe(false);
    questionWF4_4_1.value = "Yes";
    expect(questionWF4_4_1_1.visible, "questionWF4_4_1_1 true").toBe(true);
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
    expect(true, "clear incorrect value, #1").toBe(question.isEmpty());
    question.keepIncorrectValues = true;
    question.value = "item3";
    survey.clearIncorrectValues();
    expect("item3", "keep incorrect value, #2").toBe(question.value);

    question.keepIncorrectValues = false;
    survey.clearIncorrectValues();
    expect(true, "clear incorrect value, #3").toBe(question.isEmpty());

    survey.keepIncorrectValues = true;
    question.value = "item3";
    survey.clearIncorrectValues();
    expect("item3", "keep incorrect value, #4").toBe(question.value);

    survey.keepIncorrectValues = false;
    question.value = "item3";
    survey.clearIncorrectValues();
    expect(true, "clear incorrect value, #5").toBe(question.isEmpty());
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
      expect(log, "initially no scrolling").toBe("");
      survey.focusQuestion(qName);
      vi.advanceTimersByTime(2);
      expect(log, "no scrolling after page changed and focused a question, scroll to the question only").toBe("->" + qName);
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

      expect(survey["isCurrentPageRendered"] === undefined, "load survey").toBe(true);

      survey.afterRenderPage(<HTMLElement>{});
      expect(survey["isCurrentPageRendered"] === true, "render first page #1").toBe(true);

      survey.afterRenderPage(<HTMLElement>{});
      expect(survey["isCurrentPageRendered"] === true, "render first page #2").toBe(true);

      vi.advanceTimersByTime(timeOut);
      expect(scrollCount).toBe(0);

      survey.nextPage();
      expect(survey["isCurrentPageRendered"] === false, "go to second page").toBe(true);

      survey.afterRenderPage(<HTMLElement>{});
      expect(survey["isCurrentPageRendered"] === true, "render second page").toBe(true);

      vi.advanceTimersByTime(timeOut);
      expect(scrollCount, "scrolling after going to second page").toBe(1);

      survey.prevPage();
      expect(survey["isCurrentPageRendered"] === false, "go to first page").toBe(true);

      survey.afterRenderPage(<HTMLElement>{});
      expect(survey["isCurrentPageRendered"] === true, "render first page #3").toBe(true);

      vi.advanceTimersByTime(timeOut);
      expect(scrollCount, "scrolling after back to first page").toBe(2);
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
    expect(question.cssDescription).toBe("description_default");
    question.descriptionLocation = "underTitle";
    expect(question.cssDescription).toBe("description_default");
    question.descriptionLocation = "underInput";
    expect(question.cssDescription).toBe("description_default description_under_input");
  });
  test("Get first focused question on collapsed question", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1", state: "collapsed", isRequired: true },
        { type: "text", name: "q2" }
      ],
    });
    const page = survey.pages[0];
    expect(page.getFirstQuestionToFocus().name, "q1 is in collapsed panel").toBe("q2");
    expect(page.getFirstQuestionToFocus(false, true).name, "ignore collapsed state").toBe("q1");
    page.validate(true);
    expect(page.getFirstQuestionToFocus(true).name, "q1 has error").toBe("q1");
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
    expect(survey.getProgressCssClasses()).toBe("test_progress test_progress_top");
    survey.showProgressBar = "bottom";
    expect(survey.getProgressCssClasses()).toBe("test_progress test_progress_bottom");
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
    expect(q1.minWidth, "q1 minWidth").toBe("0px");
    expect(q1.maxWidth, "q1 maxWidth").toBe("500px");
    expect(q2.minWidth, "q2 minWidth").toBe("50px");
    expect(q2.maxWidth, "q2 maxWidth").toBe("500px");
    expect(q3.minWidth, "q3 minWidth").toBe("0px");
    expect(q3.maxWidth, "q3 maxWidth").toBe("90%");
    expect(q4.minWidth, "q4 (paneldynamic) minWidth").toBe("auto");
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

    expect(survey.showNavigationButtons).toBe(true);
    expect(survey.navigationButtonsLocation).toBe("bottom");
    expect(survey.progressBarType).toBe("pages");
    expect(survey.showProgressBar).toBe(false);

    expect(getContainerContent("header"), "default header").toEqual([]);
    expect(getContainerContent("footer"), "default footer").toEqual([]);
    expect(getContainerContent("contentTop"), "default contentTop").toEqual([]);
    expect(getContainerContent("contentBottom"), "default contentBottom").toEqual([{
      "component": "sv-action-bar",
      "id": "buttons-navigation"
    }]);
    expect(getContainerContent("left"), "default left").toEqual([]);
    expect(getContainerContent("right"), "default right").toEqual([]);

    survey.showNavigationButtons = true;
    survey.navigationButtonsLocation = "top";
    expect(getContainerContent("header"), "nav top header").toEqual([]);
    expect(getContainerContent("footer"), "nav top footer").toEqual([]);
    expect(getContainerContent("contentTop"), "nav top contentTop").toEqual([{
      "component": "sv-action-bar",
      "id": "buttons-navigation-top"
    }]);
    expect(getContainerContent("contentBottom"), "nav top contentBottom").toEqual([]);
    expect(getContainerContent("left"), "nav top left").toEqual([]);
    expect(getContainerContent("right"), "nav top right").toEqual([]);

    survey.showNavigationButtons = true;
    survey.navigationButtonsLocation = "topBottom";
    expect(getContainerContent("header"), "nav both header").toEqual([]);
    expect(getContainerContent("footer"), "nav both footer").toEqual([]);
    expect(getContainerContent("contentTop"), "nav both contentTop").toEqual([{
      "component": "sv-action-bar",
      "id": "buttons-navigation-top"
    }]);
    expect(getContainerContent("contentBottom"), "nav both contentBottom").toEqual([{
      "component": "sv-action-bar",
      "id": "buttons-navigation"
    }]);
    expect(getContainerContent("left"), "nav both left").toEqual([]);
    expect(getContainerContent("right"), "nav both right").toEqual([]);

    survey.showTOC = true;
    expect(getContainerContent("header"), "nav left header").toEqual([]);
    expect(getContainerContent("footer"), "nav left footer").toEqual([]);
    expect(getContainerContent("contentTop"), "nav left contentTop").toEqual([{
      "component": "sv-action-bar",
      "id": "buttons-navigation-top"
    }]);
    expect(getContainerContent("contentBottom"), "nav left contentBottom").toEqual([{
      "component": "sv-action-bar",
      "id": "buttons-navigation"
    }]);
    expect(getContainerContent("left"), "nav left left").toEqual([{
      "component": "sv-navigation-toc",
      "id": "toc-navigation"
    }]);
    expect(getContainerContent("right"), "nav left right").toEqual([]);

    survey.tocLocation = "right";
    expect(getContainerContent("header"), "nav right header").toEqual([]);
    expect(getContainerContent("footer"), "nav right footer").toEqual([]);
    expect(getContainerContent("contentTop"), "nav right contentTop").toEqual([{
      "component": "sv-action-bar",
      "id": "buttons-navigation-top"
    }]);
    expect(getContainerContent("contentBottom"), "nav right contentBottom").toEqual([{
      "component": "sv-action-bar",
      "id": "buttons-navigation"
    }]);
    expect(getContainerContent("left"), "nav right left").toEqual([]);
    expect(getContainerContent("right"), "nav right right").toEqual([{
      "component": "sv-navigation-toc",
      "id": "toc-navigation"
    }]);

    survey.showProgressBar = false;
    survey.showNavigationButtons = false;
    survey.showTOC = false;
    expect(getContainerContent("header"), "nav none header").toEqual([]);
    expect(getContainerContent("footer"), "nav none footer").toEqual([]);
    expect(getContainerContent("contentTop"), "nav none contentTop").toEqual([]);
    expect(getContainerContent("contentBottom"), "nav none contentBottom").toEqual([]);
    expect(getContainerContent("left"), "nav none left").toEqual([]);
    expect(getContainerContent("right"), "nav none right").toEqual([]);
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

      expect(survey.showNavigationButtons).toBe(false);
      expect(survey.progressBarType).toBe("pages");
      expect(survey.showProgressBar).toBe(false);

      expect(getContainerContent("header"), "default header").toEqual([]);
      expect(getContainerContent("footer"), "default footer").toEqual([]);
      expect(getContainerContent("contentTop"), "default contentTop").toEqual([]);
      expect(getContainerContent("contentBottom"), "default contentBottom").toEqual([]);
      expect(getContainerContent("left"), "default left").toEqual([]);
      expect(getContainerContent("right"), "default right").toEqual([]);

      survey.showProgressBar = "top";
      expect(getContainerContent("header"), "progress top header").toEqual([]);
      expect(getContainerContent("center"), "progress top center").toEqual([{
        "component": "sv-progress-pages",
        "id": "progress-pages"
      }]);
      expect(getContainerContent("footer"), "progress top footer").toEqual([]);
      expect(getContainerContent("contentTop"), "progress top contentTop").toEqual([]);
      expect(getContainerContent("contentBottom"), "progress top contentBottom").toEqual([]);
      expect(getContainerContent("left"), "progress top left").toEqual([]);
      expect(getContainerContent("right"), "progress top right").toEqual([]);

      survey.showProgressBar = "bottom";
      expect(getContainerContent("header"), "progress bottom header").toEqual([]);
      expect(getContainerContent("footer"), "progress bottom footer").toEqual([{
        "component": "sv-progress-pages",
        "id": "progress-pages"
      }]);
      expect(getContainerContent("contentTop"), "progress bottom contentTop").toEqual([]);
      expect(getContainerContent("contentBottom"), "progress bottom contentBottom").toEqual([]);
      expect(getContainerContent("left"), "progress bottom left").toEqual([]);
      expect(getContainerContent("right"), "progress bottom right").toEqual([]);

      survey.showProgressBar = "both";
      expect(getContainerContent("header"), "progress both header").toEqual([]);
      expect(getContainerContent("center"), "progress both center").toEqual([{
        "component": "sv-progress-pages",
        "id": "progress-pages"
      }]);
      expect(getContainerContent("footer"), "progress both footer").toEqual([{
        "component": "sv-progress-pages",
        "id": "progress-pages"
      }]);
      expect(getContainerContent("contentTop"), "progress both contentTop").toEqual([]);
      expect(getContainerContent("contentBottom"), "progress both contentBottom").toEqual([]);
      expect(getContainerContent("left"), "progress both left").toEqual([]);
      expect(getContainerContent("right"), "progress both right").toEqual([]);

      survey.progressBarType = "questions";
      expect(getContainerContent("header"), "progress questions both header").toEqual([]);
      expect(getContainerContent("center"), "progress questions both header").toEqual([{
        "component": "sv-progress-questions",
        "id": "progress-questions"
      }]);
      expect(getContainerContent("footer"), "progress questions both footer").toEqual([{
        "component": "sv-progress-questions",
        "id": "progress-questions"
      }]);
      expect(getContainerContent("contentTop"), "progress questions both contentTop").toEqual([]);
      expect(getContainerContent("contentBottom"), "progress questions both contentBottom").toEqual([]);
      expect(getContainerContent("left"), "progress questions both left").toEqual([]);
      expect(getContainerContent("right"), "progress questions both right").toEqual([]);

      survey.showTOC = true;
      expect(getContainerContent("header"), "progress toc both header").toEqual([]);
      expect(getContainerContent("center"), "progress toc both center").toEqual([{
        "component": "sv-progress-questions",
        "id": "progress-questions"
      }]);
      expect(getContainerContent("footer"), "progress toc both footer").toEqual([{
        "component": "sv-progress-questions",
        "id": "progress-questions"
      }]);
      expect(getContainerContent("contentTop"), "progress toc both contentTop").toEqual([]);
      expect(getContainerContent("contentBottom"), "progress toc both contentBottom").toEqual([]);
      expect(getContainerContent("left"), "progress toc both left").toEqual([{
        "component": "sv-navigation-toc",
        "id": "toc-navigation"
      }]);
      expect(getContainerContent("right"), "progress toc both right").toEqual([]);

      survey.showProgressBar = false;
      survey.tocLocation = "left";
      expect(getContainerContent("header"), "progress toc left header").toEqual([]);
      expect(getContainerContent("footer"), "progress toc left footer").toEqual([]);
      expect(getContainerContent("contentTop"), "progress toc left contentTop").toEqual([]);
      expect(getContainerContent("contentBottom"), "progress toc left contentBottom").toEqual([]);
      expect(getContainerContent("left"), "progress toc left left").toEqual([{
        "component": "sv-navigation-toc",
        "id": "toc-navigation"
      }]);
      expect(getContainerContent("right"), "progress toc left right").toEqual([]);

      survey.tocLocation = "right";
      expect(getContainerContent("header"), "progress toc right header").toEqual([]);
      expect(getContainerContent("footer"), "progress toc right footer").toEqual([]);
      expect(getContainerContent("contentTop"), "progress toc right contentTop").toEqual([]);
      expect(getContainerContent("contentBottom"), "progress toc right contentBottom").toEqual([]);
      expect(getContainerContent("left"), "progress toc right left").toEqual([]);
      expect(getContainerContent("right"), "progress toc right right").toEqual([{
        "component": "sv-navigation-toc",
        "id": "toc-navigation"
      }]);

      survey.showTOC = false;
      expect(getContainerContent("header"), "default header").toEqual([]);
      expect(getContainerContent("footer"), "default footer").toEqual([]);
      expect(getContainerContent("contentTop"), "default contentTop").toEqual([]);
      expect(getContainerContent("contentBottom"), "default contentBottom").toEqual([]);
      expect(getContainerContent("left"), "default left").toEqual([]);
      expect(getContainerContent("right"), "default right").toEqual([]);

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

    expect(survey.showNavigationButtons).toBe(false);
    expect(survey.progressBarType).toBe("pages");
    expect(survey.showProgressBar).toBe(false);

    expect(getContainerContent("header"), "default header").toEqual([]);
    expect(getContainerContent("footer"), "default footer").toEqual([]);
    expect(getContainerContent("contentTop"), "default contentTop").toEqual([]);
    expect(getContainerContent("contentBottom"), "default contentBottom").toEqual([]);
    expect(getContainerContent("left"), "default left").toEqual([]);
    expect(getContainerContent("right"), "default right").toEqual([]);

    survey.showProgressBar = "top";
    expect(getContainerContent("header"), "progress top header").toEqual([]);
    expect(getContainerContent("center"), "progress top center").toEqual([{
      "component": "sv-progress-buttons",
      "id": "progress-buttons"
    }]);
    expect(getContainerContent("footer"), "progress top footer").toEqual([]);
    expect(getContainerContent("contentTop"), "progress top contentTop").toEqual([]);
    expect(getContainerContent("contentBottom"), "progress top contentBottom").toEqual([]);
    expect(getContainerContent("left"), "progress top left").toEqual([]);
    expect(getContainerContent("right"), "progress top right").toEqual([]);

    survey.showProgressBar = "bottom";
    expect(getContainerContent("header"), "progress bottom header").toEqual([]);
    expect(getContainerContent("footer"), "progress bottom footer").toEqual([{
      "component": "sv-progress-buttons",
      "id": "progress-buttons"
    }]);
    expect(getContainerContent("contentTop"), "progress bottom contentTop").toEqual([]);
    expect(getContainerContent("contentBottom"), "progress bottom contentBottom").toEqual([]);
    expect(getContainerContent("left"), "progress bottom left").toEqual([]);
    expect(getContainerContent("right"), "progress bottom right").toEqual([]);

    survey.showProgressBar = "both";
    expect(getContainerContent("header"), "progress both header").toEqual([]);
    expect(getContainerContent("center"), "progress both center").toEqual([{
      "component": "sv-progress-buttons",
      "id": "progress-buttons"
    }]);
    expect(getContainerContent("footer"), "progress both footer").toEqual([{
      "component": "sv-progress-buttons",
      "id": "progress-buttons"
    }]);
    expect(getContainerContent("contentTop"), "progress both contentTop").toEqual([]);
    expect(getContainerContent("contentBottom"), "progress both contentBottom").toEqual([]);
    expect(getContainerContent("left"), "progress both left").toEqual([]);
    expect(getContainerContent("right"), "progress both right").toEqual([]);

    survey.progressBarType = "questions";
    expect(getContainerContent("header"), "progress questions both header").toEqual([]);
    expect(getContainerContent("center"), "progress questions both header").toEqual([{
      "component": "sv-progress-questions",
      "id": "progress-questions"
    }]);
    expect(getContainerContent("footer"), "progress questions both footer").toEqual([{
      "component": "sv-progress-questions",
      "id": "progress-questions"
    }]);
    expect(getContainerContent("contentTop"), "progress questions both contentTop").toEqual([]);
    expect(getContainerContent("contentBottom"), "progress questions both contentBottom").toEqual([]);
    expect(getContainerContent("left"), "progress questions both left").toEqual([]);
    expect(getContainerContent("right"), "progress questions both right").toEqual([]);

    survey.showTOC = true;
    expect(getContainerContent("header"), "progress toc both header").toEqual([]);
    expect(getContainerContent("center"), "progress toc both center").toEqual([{
      "component": "sv-progress-questions",
      "id": "progress-questions"
    }]);
    expect(getContainerContent("footer"), "progress toc both footer").toEqual([{
      "component": "sv-progress-questions",
      "id": "progress-questions"
    }]);
    expect(getContainerContent("contentTop"), "progress toc both contentTop").toEqual([]);
    expect(getContainerContent("contentBottom"), "progress toc both contentBottom").toEqual([]);
    expect(getContainerContent("left"), "progress toc both left").toEqual([{
      "component": "sv-navigation-toc",
      "id": "toc-navigation"
    }]);
    expect(getContainerContent("right"), "progress toc both right").toEqual([]);

    survey.showProgressBar = false;
    survey.tocLocation = "left";
    expect(getContainerContent("header"), "progress toc left header").toEqual([]);
    expect(getContainerContent("footer"), "progress toc left footer").toEqual([]);
    expect(getContainerContent("contentTop"), "progress toc left contentTop").toEqual([]);
    expect(getContainerContent("contentBottom"), "progress toc left contentBottom").toEqual([]);
    expect(getContainerContent("left"), "progress toc left left").toEqual([{
      "component": "sv-navigation-toc",
      "id": "toc-navigation"
    }]);
    expect(getContainerContent("right"), "progress toc left right").toEqual([]);

    survey.tocLocation = "right";
    expect(getContainerContent("header"), "progress toc right header").toEqual([]);
    expect(getContainerContent("footer"), "progress toc right footer").toEqual([]);
    expect(getContainerContent("contentTop"), "progress toc right contentTop").toEqual([]);
    expect(getContainerContent("contentBottom"), "progress toc right contentBottom").toEqual([]);
    expect(getContainerContent("left"), "progress toc right left").toEqual([]);
    expect(getContainerContent("right"), "progress toc right right").toEqual([{
      "component": "sv-navigation-toc",
      "id": "toc-navigation"
    }]);

    survey.showTOC = false;
    expect(getContainerContent("header"), "default header").toEqual([]);
    expect(getContainerContent("footer"), "default footer").toEqual([]);
    expect(getContainerContent("contentTop"), "default contentTop").toEqual([]);
    expect(getContainerContent("contentBottom"), "default contentBottom").toEqual([]);
    expect(getContainerContent("left"), "default left").toEqual([]);
    expect(getContainerContent("right"), "default right").toEqual([]);
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

    expect(getContainerContent("header"), "").toEqual([]);
    expect(getContainerContent("footer"), "").toEqual([]);
    expect(getContainerContent("contentTop"), "").toEqual([]);
    expect(getContainerContent("contentBottom"), "").toEqual([{
      "component": "sv-action-bar",
      "id": "buttons-navigation"
    }]);
    expect(getContainerContent("left"), "show toc left").toEqual([{
      "component": "sv-navigation-toc",
      "id": "toc-navigation"
    }]);
    expect(getContainerContent("right"), "").toEqual([]);

    survey.nextPage();
    survey.showPreview();

    expect(getContainerContent("header"), "").toEqual([]);
    expect(getContainerContent("footer"), "").toEqual([]);
    expect(getContainerContent("contentTop"), "").toEqual([]);
    expect(getContainerContent("contentBottom"), "").toEqual([{
      "component": "sv-action-bar",
      "id": "buttons-navigation"
    }]);
    expect(getContainerContent("left"), "do not show toc left").toEqual([]);
    expect(getContainerContent("right"), "").toEqual([]);
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

    expect(getContainerContent("header"), "").toEqual([]);
    expect(getContainerContent("footer"), "").toEqual([]);
    expect(getContainerContent("contentTop"), "").toEqual([]);
    expect(getContainerContent("contentBottom"), "").toEqual([{
      "component": "sv-action-bar",
      "id": "buttons-navigation"
    }]);
    expect(getContainerContent("left"), "empty on the start page").toEqual([]);

    survey.start();
    expect(getContainerContent("header"), "").toEqual([]);
    expect(getContainerContent("footer"), "").toEqual([]);
    expect(getContainerContent("contentTop"), "").toEqual([]);
    expect(getContainerContent("contentBottom"), "").toEqual([{
      "component": "sv-action-bar",
      "id": "buttons-navigation"
    }]);
    expect(getContainerContent("left"), "show toc left").toEqual([{
      "component": "sv-navigation-toc",
      "id": "toc-navigation"
    }]);
    expect(getContainerContent("right"), "").toEqual([]);
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

    expect(getContainerContent("header"), "").toEqual([]);
    expect(getContainerContent("footer"), "").toEqual([]);
    expect(getContainerContent("center"), "").toEqual([{
      "component": "sv-progress-buttons",
      "id": "progress-buttons"
    }]);
    expect(getContainerContent("contentTop"), "").toEqual([]);
    expect(getContainerContent("contentBottom"), "").toEqual([{
      "component": "sv-action-bar",
      "id": "buttons-navigation"
    }]);
    expect(getContainerContent("left"), "").toEqual([]);
    expect(getContainerContent("right"), "").toEqual([]);

    survey.doComplete();

    expect(getContainerContent("header"), "").toEqual([]);
    expect(getContainerContent("footer"), "").toEqual([]);
    expect(getContainerContent("contentTop"), "").toEqual([]);
    expect(getContainerContent("contentBottom"), "").toEqual([{
      "component": "sv-action-bar",
      "id": "buttons-navigation"
    }]);
    expect(getContainerContent("left"), "").toEqual([]);
    expect(getContainerContent("right"), "").toEqual([]);
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

    expect(getContainerContent("header"), "header for running survey").toEqual([{
      "component": "sv-header",
      "container": "header",
      "id": "advanced-header",
      "index": -100
    }]);
    expect(getContainerContent("footer"), "").toEqual([]);
    expect(getContainerContent("contentTop"), "").toEqual([]);
    expect(getContainerContent("contentBottom"), "").toEqual([{
      "component": "sv-action-bar",
      "id": "buttons-navigation"
    }]);
    expect(getContainerContent("left"), "").toEqual([]);
    expect(getContainerContent("right"), "").toEqual([]);

    survey.doComplete();

    expect(getContainerContent("header"), "header on complete page").toEqual([]);
    expect(getContainerContent("footer"), "").toEqual([]);
    expect(getContainerContent("contentTop"), "").toEqual([]);
    expect(getContainerContent("contentBottom"), "").toEqual([{
      "component": "sv-action-bar",
      "id": "buttons-navigation"
    }]);
    expect(getContainerContent("left"), "").toEqual([]);
    expect(getContainerContent("right"), "").toEqual([]);
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

    expect(survey.showHeaderOnCompletePage).toBe("auto");
    survey.showHeaderOnCompletePage = true;

    expect(getContainerContent("header"), "header for running survey").toEqual([{
      "component": "sv-header",
      "container": "header",
      "id": "advanced-header",
      "index": -100
    }]);
    expect(getContainerContent("footer"), "").toEqual([]);
    expect(getContainerContent("contentTop"), "").toEqual([]);
    expect(getContainerContent("contentBottom"), "").toEqual([{
      "component": "sv-action-bar",
      "id": "buttons-navigation"
    }]);
    expect(getContainerContent("left"), "").toEqual([]);
    expect(getContainerContent("right"), "").toEqual([]);

    survey.doComplete();

    expect(getContainerContent("header"), "header on complete page").toEqual([{
      "component": "sv-header",
      "container": "header",
      "id": "advanced-header",
      "index": -100
    }]);
    expect(getContainerContent("footer"), "").toEqual([]);
    expect(getContainerContent("contentTop"), "").toEqual([]);
    expect(getContainerContent("contentBottom"), "").toEqual([{
      "component": "sv-action-bar",
      "id": "buttons-navigation"
    }]);
    expect(getContainerContent("left"), "").toEqual([]);
    expect(getContainerContent("right"), "").toEqual([]);
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
    expect(survey.getStructuredData(true, 0), "Level is 0, true").toEqual(data);
    expect(survey.getStructuredData(false, 0), "Level is 0, false").toEqual(data);
    expect(survey.getStructuredData(), "includePages: true, level: -1").toEqual({
      page1: { q1: 100, panel1: { q2: 200, panel2: { q3: 300 } } },
      page2: { q21: 2100, panel21: { q22: 2200 } },
    });
    expect(survey.getStructuredData(false), "includePages: false, level: -1").toEqual({
      q1: 100, panel1: { q2: 200, panel2: { q3: 300 } },
      q21: 2100, panel21: { q22: 2200 },
    });
    expect(survey.getStructuredData(true, 1), "includePages: true, level: 1").toEqual({
      page1: { q1: 100, q2: 200, q3: 300 },
      page2: { q21: 2100, q22: 2200 },
    });
    expect(survey.getStructuredData(false, 1), "includePages: false, level: 1").toEqual({
      q1: 100, panel1: { q2: 200, q3: 300 },
      q21: 2100, panel21: { q22: 2200 },
    });
    expect(survey.getStructuredData(true, 2), "includePages: true, level: 2").toEqual({
      page1: { q1: 100, panel1: { q2: 200, q3: 300 } },
      page2: { q21: 2100, panel21: { q22: 2200 } },
    });
    expect(survey.getStructuredData(false, 2), "includePages: false, level: 2").toEqual({
      q1: 100, panel1: { q2: 200, panel2: { q3: 300 } },
      q21: 2100, panel21: { q22: 2200 },
    });
    expect(survey.getStructuredData(true, 3), "includePages: true, level: 3").toEqual({
      page1: { q1: 100, panel1: { q2: 200, panel2: { q3: 300 } } },
      page2: { q21: 2100, panel21: { q22: 2200 } },
    });
    expect(survey.getStructuredData(false, 3), "includePages: false, level: 3").toEqual({
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
    expect(survey.getData(), "survey.getData()").toEqual(data);
    expect(survey.getData({}), "survey.getData({})").toEqual(data);
    expect(survey.getData({ includePages: false, includePanels: false }), "survey.getData({ includePages: false, includePanels: false })").toEqual(data);
    expect(survey.getData({ includePages: true, includePanels: false }), "survey.getData({ includePages: true, includePanels: false })").toEqual({
      page1: { q1: 100, q2: 200, q3: 300 },
      page2: { q21: 2100, q22: 2200 },
    });
    expect(survey.getData({ includePages: true, includePanels: true }), "survey.getData({ includePages: true, includePanels: true })").toEqual({
      page1: { q1: 100, panel1: { q2: 200, panel2: { q3: 300 } } },
      page2: { q21: 2100, panel21: { q22: 2200 } },
    });
    expect(survey.getData({ includePages: false, includePanels: true }), "survey.getData({ includePages: true, includePanels: true })").toEqual({
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
    expect(survey.data, "#1").toEqual({ q1: 100, q2: 200, q3: 300, q21: 2100, q22: 2200 });
    survey.setStructuredData({
      q1: 101, panel1: { q2: 201, panel2: { q3: 301 } },
      q21: 2101, panel21: { q22: 2201 }
    });
    expect(survey.data, "#2").toEqual({ q1: 101, q2: 201, q3: 301, q21: 2101, q22: 2201 });
    survey.setStructuredData({
      page1: { q1: 102, q2: 202, q3: 302 },
      page2: { q21: 2102, q22: 2202 },
    });
    expect(survey.data, "#3").toEqual({ q1: 102, q2: 202, q3: 302, q21: 2102, q22: 2202 });
    survey.setStructuredData({ page1: { q1: 103 } }, true);
    expect(survey.data, "#4").toEqual({ q1: 103, q2: 202, q3: 302, q21: 2102, q22: 2202 });
    survey.setStructuredData({ page1: { q1: 104 } });
    expect(survey.data, "#5").toEqual({ q1: 104 });
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
    expect(survey.visiblePages.length, "We should have 1 page, #1").toBe(1);
    expect(survey.currentPage.elements.length, "We should have 2 panels, #1").toBe(2);
    survey.setDesignMode(false);
    expect(survey.visiblePages.length, "We should have 1 page, #2").toBe(1);
    expect(survey.currentPage.elements.length, "We should have 2 panels, #2").toBe(2);
    survey.setDesignMode(true);
    expect(survey.visiblePages.length, "We should have 2 pages, #3").toBe(2);
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
    expect(survey.state, "the survey is completed").toBe("completed");
    expect(attempts, "There were 3 attempts").toBe(3);
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
    expect(q1.value, "q1.value").toBe("AAA");
    expect(q2.value, "q2.value").toBe("BBB");
    expect(q3.value, "q3.value").toBe("CCC");
  });

  test("backgroundImage", () => {
    const imageUrl = "https://image.shutterstock.com/image-photo/agave-cactus-abstract-natural-pattern-600w-1056037874.jpg";
    const survey = new SurveyModel({
      "backgroundImage": imageUrl,
    });
    expect(survey.backgroundImage, "backgroundImage").toBe(imageUrl);
    expect(survey.renderBackgroundImage, "renderBackgroundImage").toBe(wrapUrlForBackgroundImage(imageUrl));
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
    expect(survey.locTitle.getJson(), "It supports only one locale").toBe("val3");
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

    expect(survey.showNavigationButtons).toBe(true);
    expect(survey.navigationButtonsLocation).toBe("bottom");

    expect(getContainerContent("header"), "nav none header").toEqual([]);
    expect(getContainerContent("footer"), "nav none footer").toEqual([]);
    expect(getContainerContent("contentTop"), "nav none contentTop").toEqual([]);
    expect(getContainerContent("contentBottom"), "nav none contentBottom").toEqual([]);
    expect(getContainerContent("left"), "nav none left").toEqual([]);
    expect(getContainerContent("right"), "nav none right").toEqual([]);

    survey.nextPage();
    expect(getContainerContent("header"), "default header").toEqual([]);
    expect(getContainerContent("footer"), "default footer").toEqual([]);
    expect(getContainerContent("contentTop"), "default contentTop").toEqual([]);
    expect(getContainerContent("contentBottom"), "default contentBottom").toEqual([{
      "component": "sv-action-bar",
      "id": "buttons-navigation"
    }]);
    expect(getContainerContent("left"), "default left").toEqual([]);
    expect(getContainerContent("right"), "default right").toEqual([]);

    survey.showNavigationButtons = false;
    expect(getContainerContent("header"), "default header").toEqual([]);
    expect(getContainerContent("footer"), "default footer").toEqual([]);
    expect(getContainerContent("contentTop"), "default contentTop").toEqual([]);
    expect(getContainerContent("contentBottom"), "default contentBottom").toEqual([{
      "component": "sv-action-bar",
      "id": "buttons-navigation"
    }]);
    expect(getContainerContent("left"), "default left").toEqual([]);
    expect(getContainerContent("right"), "default right").toEqual([]);
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
    expect(survey.state, "The first page is started").toBe("starting");
    expect(survey.isNavigationButtonsShowing, "The first page is started").toBe("bottom");
    survey.start();
    expect(survey.state, "The start button is cliced").toBe("running");
    expect(survey.isNavigationButtonsShowing, "Hide navigation buttons").toBe("none");
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

    expect(getContainerContent("header"), "advanved header first, progress next").toEqual([
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
    expect(els.length, "There is one element").toBe(1);
    expect(els[0].id, "This element is toc").toBe("toc-navigation");
    expect(els[0].data, "data is set").toBeTruthy();
  });

  test("restore header css variable if header is default", () => {
    const cssVariables = DefaultTheme.cssVariables;
    try {
      DefaultTheme.cssVariables = {} as any;
      const json = {
        title: "Title",
        elements: [{ "type": "rating", "name": "satisfaction" }]
      };
      let survey = new SurveyModel(json);
      survey.applyTheme({ "headerView": "advanced", cssVariables: { "--sjs-header-backcolor": "transparent" } } as any);

      const cover = survey.findLayoutElement("advanced-header").data as Cover;
      expect(cover.headerClasses).toBe("sv-header sv-header--height-auto sv-header__without-background sv-header__background-color--none");
    } finally {
      DefaultTheme.cssVariables = cssVariables;
    }
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
    expect(counter, "onComplete called one time").toBe(1);
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
    expect(survey.mode).toBe("display");
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
        expect(val, "check no: " + no + ", value name: " + name).toBe(res[i]);
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
      expect(options.question).toBe(question);
      expect(options.popup).toBe(popup);
      log += `->${options.visible}`;
    });
    popup.toggleVisibility();
    expect(log).toBe("->true");
    popup.toggleVisibility();
    expect(log).toBe("->true->false");
  });
  test("Check onPopupVisibleChanged events #2", () => {
    expect(settings.comparator.caseSensitive, "comparator.caseSensitive is false").toBe(false);
    const survey = new SurveyModel({ elements: [{ "type": "text", "name": "q1" }] });
    const q = survey.getQuestionByName("q1");
    survey.onValueChanging.add((sender, options) => {
      options.value = options.value.toUpperCase();
    });
    q.value = "abc";
    expect(q.value, "Convert to upper case").toBe("ABC");
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
    expect(q1.value, "q1.value is #1").toBe("a");
    expect(q2.value, "q2.value is #1").toBe("b");
    q2.value = "";
    q1.value = "c";
    expect(q1.value, "q1.value is #2").toBe("a");
    expect(q2.value, "q2.value #2").toBe("");
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
      expect(options.question).toBe(question);
      expect(options.menuType, "options.menuType").toBe("dropdown");

      options.menuType = "overlay";
    });

    expect(popup.displayMode, "displayMode #0").toBe("popup");
    expect(popup.overlayDisplayMode, "overlayDisplayMode #0").toBe("auto");

    popup.toggleVisibility();
    expect(popup.displayMode, "displayMode #1").toBe("overlay");
    expect(popup.overlayDisplayMode, "overlayDisplayMode #1").toBe("dropdown-overlay");
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

    expect(popup.displayMode, "#1").toBe("overlay");
    expect(popup.setWidthByTarget, "#2").toBe(false);
    expect(list.showFilter, "#3").toBe(false);
    expect(list.searchEnabled, "#4").toBe(false);

    popup.show();
    expect(popup.displayMode, "#1.1").toBe("popup");
    expect(popup.setWidthByTarget, "#2.1").toBe(true);
    expect(list.showFilter, "#3.1").toBe(false);
    expect(list.searchEnabled, "#4.1").toBe(false);

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

    expect(popup.displayMode, "#1").toBe("overlay");
    expect(popup.setWidthByTarget, "#2").toBe(false);
    expect(list.showFilter, "#3").toBe(false);
    expect(list.searchEnabled, "#4").toBe(true);

    question.choices.push(new ItemValue("Renault"));
    popup.show();
    expect(list.showFilter, "#5").toBe(true);
    popup.hide();

    menuType = "dropdown";
    popup.show();
    expect(popup.displayMode, "#1.1").toBe("popup");
    expect(popup.setWidthByTarget, "#2.1").toBe(true);
    expect(list.showFilter, "#3.1").toBe(false);
    expect(list.searchEnabled, "#4.1").toBe(false);

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

    expect(popup.displayMode, "#1").toBe("overlay");
    expect(popup.setWidthByTarget, "#2").toBe(false);
    expect(popup.isFocusedContent, "#3").toBe(true);
    expect(popup.isFocusedContainer, "#4").toBe(false);

    popup.show();
    expect(popup.displayMode, "#1.1").toBe("popup");
    expect(popup.setWidthByTarget, "#2.1").toBe(true);
    expect(popup.isFocusedContent, "#3.1").toBe(false);
    expect(popup.isFocusedContainer, "#4.1").toBe(false);

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
    expect(survey.data, "survey.data").toEqual({ sharedData: [{ name: "1 name", matrix1: [{ b_eil_nr: 1, b_name: "1 name" }] }] });
    expect(p2.value, "panel2.data").toEqual([{ name: "1 name", matrix1: [{ b_eil_nr: 1, b_name: "1 name" }] }]);
    const matrix = <QuestionMatrixDynamicModel>p2.panels[0].questions[0];
    expect(matrix.value, "panel2[0].matrix1.data").toEqual([{ b_eil_nr: 1, b_name: "1 name" }]);
    const table = matrix.renderedTable;
    expect(table.rows.length, "One row in rendered table").toBe(2);
    expect(table.rows[1].cells[0].question.value).toBe(1);
    expect(table.rows[1].cells[1].question.value).toBe("1 name");
    const rows = matrix.visibleRows;
    expect(rows.length, "one row is added, rowCount: 1").toBe(1);
    expect(rows[0].cells[0].question.value, "cell [0,0]").toBe(1);
    expect(rows[0].cells[1].question.value, "cell [0,1]").toBe("1 name");
  });
  test("survey.getNestedQuestions", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        { type: "multipletext", name: "q2", items: [{ name: "q2_item1" }, { name: "q2_item2" }] }
      ]
    });
    const questions = survey.getAllQuestions(false, false, true);
    expect(questions.length, "3 questions").toBe(4);
    expect(questions[0].name, "#1").toBe("q1");
    expect(questions[1].name, "#2").toBe("q2");
    expect(questions[2].name, "#3").toBe("q2_item1");
    expect(questions[3].name, "#4").toBe("q2_item2");
  });
  test("survey.applyTheme", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        { type: "multipletext", name: "q2", items: [{ name: "q2_item1" }, { name: "q2_item2" }] }
      ]
    });

    const lenBeforeApplyTheme = Object.keys(survey.themeVariables).length;
    expect(lenBeforeApplyTheme > 800, "before applyTheme").toBeTruthy();
    expect(!!survey.backgroundImage, "before applyTheme").toBe(false);
    expect(survey.backgroundImageFit, "before applyTheme").toBe("cover");
    expect(survey.backgroundImageAttachment, "before applyTheme").toBe("scroll");
    expect(survey.backgroundOpacity, "before applyTheme").toBe(1);
    expect(survey["isCompact"], "before applyTheme").toBe(false);
    expect(survey.headerView, "before applyTheme").toBe("basic");

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

    expect(Object.keys(survey.themeVariables).length).toBe(lenBeforeApplyTheme);
    expect(!!survey.backgroundImage).toBe(true);
    expect(survey.backgroundImageFit).toBe("cover");
    expect(survey.backgroundImageAttachment).toBe("fixed");
    expect(survey.backgroundOpacity).toBe(0.6);
    expect(survey["isCompact"]).toBe(true);
    expect(survey.headerView, "after applyTheme").toBe("basic");
  });
  test("survey.applyTheme patches legacy CSS variables", () => {
    const cssVariables = DefaultTheme.cssVariables;
    try {
      DefaultTheme.cssVariables = {} as any;
      const survey = new SurveyModel({ elements: [{ type: "text", name: "q1" }] });
      const theme = {
        cssVariables: {
          "--sjs-general-backcolor": "rgba(255, 0, 0, 1)",
          "--sjs-font-size": "18px",
          "--sjs-shadow-medium": "0px 2px 6px rgba(0,0,0,0.1)",
          "--sjs-shadow-large": "0px 8px 16px rgba(0,0,0,0.1)"
        }
      };
      survey.applyTheme(theme as any);
      const vars = survey.themeVariables;
      expect(vars["--sjs2-color-bg-basic-primary"]).toBe("rgba(255, 0, 0, 1)");
      expect(typeof vars["--sjs-general-backcolor"]).toBe("undefined");
      expect(vars["--sjs2-base-unit-font-size"]).toBe("9px");
      expect(vars["--sjs2-base-unit-line-height"]).toBe("9px");
      expect(typeof vars["--sjs-font-size"]).toBe("undefined");
      expect(vars["--sjs2-border-effect-floating-default"]).toBe("0px 2px 6px rgba(0,0,0,0.1),0px 8px 16px rgba(0,0,0,0.1)");
      expect(typeof vars["--sjs-shadow-medium"]).toBe("undefined");
      expect(typeof vars["--sjs-shadow-large"]).toBe("undefined");
    } finally {
      DefaultTheme.cssVariables = cssVariables;
    }
  });
  test("survey.applyTheme respects headerView", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        { type: "multipletext", name: "q2", items: [{ name: "q2_item1" }, { name: "q2_item2" }] }
      ]
    });

    expect(survey.headerView, "before applyTheme").toBe("basic");

    survey.applyTheme({
      "headerView": "advanced"
    });
    expect(survey.headerView, "apply advanced header").toBe("advanced");

    survey.applyTheme({
      "headerView": "basic"
    });
    expect(survey.headerView, "apply basic header").toBe("basic");

    survey.applyTheme({});
    expect(survey.headerView, "apply empty theme").toBe("basic");

    survey.applyTheme({ header: {} });
    expect(survey.headerView, "apply theme with header").toBe("advanced");
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
    expect(p2.isDisposed, "p2.isDisposed").toBe(true);
    expect(q2.isDisposed, "q2.isDisposed").toBe(true);
    survey.currentPage.delete();
    expect(p1.isDisposed, "p1.isDisposed").toBe(true);
    expect(q1.isDisposed, "q1.isDisposed").toBe(true);
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
    expect(q4.getType(), "buttongroup q4").toBe("buttongroup");
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
    expect(q1.visible, "q1.visible = false").toBe(false);
    expect(q1.isVisible, "q1.isVisible = true").toBe(true);
    expect(q1.getPropertyValue("isVisible"), "q1.isVisible via getPropertyValue").toBe(true);
    expect(q3.visible, "q3.visible = false").toBe(false);
    expect(q3.isVisible, "q3.isVisible = true").toBe(true);
    expect(q3.getPropertyValue("isVisible"), "q3.isVisible via getPropertyValue").toBe(true);
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
    expect(q1.value, "Get data from survey").toBe(2);
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
    expect(panel.panels[0].questions[0].isReady, "Check box is ready").toBe(true);
    const matrix = survey.getQuestionByName("q3");
    matrix.addRow();
    const row = matrix.visibleRows[0];
    row.showDetailPanel();
    row.getQuestionByName("col1").value = [1, 3];
    row.getQuestionByName("q3_q1").value = [1, 2, 3];
    expect(survey.data, "displayValue works correctly").toEqual({
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
    expect(rows[0].cells[1].value, "cells[0,1].value").toBe("Item check 2");
    expect(rows[0].cells[2].value, "cells[0,2].value").toBe("Item 2");
    expect(rows[1].cells[1].value, "cells[1,1].value").toBe("Item check 3");
    expect(rows[1].cells[2].value, "cells[1,2].value").toBe("Item 3");
    expect(rows[2].cells[1].value, "cells[2,1].value").toBe("Item check 1");
    expect(rows[2].cells[2].value, "cells[2,2].value").toBe("Item 1");
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
    expect(rows[0].cells[1].value, "cells[0,1].value").toBe("Item check 0");
    expect(rows[1].cells[1].value, "cells[1,1].value").toBe("Item check 1");
    expect(rows[2].cells[1].value, "cells[2,1].value").toBe("Item check 2");
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
    expect(q2.value, "#1").toBe("abc");
    isQ1Ready = true;
    q1["updateIsReady"]();
    expect(q2.value, "#1").toBe("Item check 1");
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
    expect(survey.runExpression("displayValue('q1')"), "#1").toBe("Item 2");
    let funcRes = undefined;
    survey.setValue("q1", 1);
    survey.runExpression("displayValue('q1')", (res: any): void => funcRes = res);
    expect(funcRes, "#2").toBe("Item 1");
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
    expect(survey.data, "propertyValue works correctly").toEqual({
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
    expect(survey.locCompleteText.renderedHtml, "Preprocess correctly").toBe("2");
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
    expect(q2.isEmpty(), "initial value on loading and clear on becoming invisible").toBe(true);
    q1.value = "A";
    expect(q2.value, "q1.value = A").toBe(42);
    q1.value = "B";
    expect(q2.value, "q1.value = B").toBe(24);
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

    expect(surveyJson.pages[0].elements.length, "surveyJson elements count").toBe(3);
    expect(prepareJSON.pages[0].elements.length, "prepareJSON elements count").toBe(3);

    expect(surveyJson).toEqual(prepareJSON);
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

    expect(surveyJson.pages.length, "surveyJson pages count").toBe(1);
    expect(prepareJSON.pages.length, "prepareJSON pages count").toBe(1);
    expect(surveyJson.pages[0].elements.length, "surveyJson elements count").toBe(3);
    expect(prepareJSON.pages[0].elements.length, "prepareJSON elements count").toBe(3);

    expect(surveyJson).toEqual(prepareJSON);
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
    expect(survey.currentSingleQuestion.name, "#1").toBe("q1");
    survey.currentSingleQuestion.value = "a";
    expect(survey.currentSingleQuestion.name, "#2").toBe("q4");
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
    expect(survey.currentSingleQuestion.name, "#1").toBe("q1");
    survey.currentSingleQuestion.value = "a";
    expect(survey.currentSingleQuestion.name, "#2").toBe("q4");
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
    expect(survey.currentSingleQuestion.name, "#1").toBe("q1");
    survey.currentSingleQuestion.value = "a";
    expect(survey.currentSingleQuestion.name, "#2").toBe("q1");
    survey.performNext();
    expect(survey.currentSingleQuestion.name, "#3").toBe("q4");
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
    expect(survey.data, "survey.data").toEqual({ q1_1: "A", q2_1: "A" });
    survey.setValue("q3", "B");
    const q1_1 = survey.getQuestionByName("q1_1");
    const q2_1 = survey.getQuestionByName("q2_1");
    const q1_2 = survey.getQuestionByName("q1_2");
    const q2_2 = survey.getQuestionByName("q2_2");

    expect(q1_1.value, "q1_1.value").toBe("A");
    expect(q2_1.value, "q2_1.value").toBe("A");
    expect(q1_2.visible, "q1_2.visible").toBe(true);
    expect(q2_2.visible, "q2_2.visible").toBe(true);
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
    expect(survey.currentSingleQuestion.name, "survey.currentSingleQuestion.name #1").toBe("q1");
    survey.setValue("q1", "A");
    expect(survey.currentSingleQuestion.name, "survey.currentSingleQuestion.name #2").toBe("q2");
    survey.setValue("q2", "A");
    expect(survey.currentSingleQuestion.name, "survey.currentSingleQuestion.name #3").toBe("q3");
    survey.setValue("q3", "A");
    expect(survey.state, "survey.state #4").toBe("completed");
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
    expect(question.name, "Loaded correctly").toBe("q1");
    expect(panel.isCollapsed, "panel is collapsed").toBe(true);
    panel.expand();
    expect(panel.isCollapsed, "panel is not collapsed").toBe(false);
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
    expect(q3.isVisible, "visible #1").toBe(false);
    q1.value = { "1": 1, "2": 2 };
    expect(q3.isVisible, "visible #2").toBe(false);
    q2.value = { "16": 2 };
    expect(q3.isVisible, "visible #3").toBe(true);
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
    expect(q1.value, "q1.value #1").toBe("value1");
    expect(q2.value, "q2.value #1").toBe("value2");
    expect([...(q3.value)], "q3.value #1").toEqual(["item1", "item3"]);
    expect(q4.value, "q4.value #1").toBe("item2");
    survey.data = { q1: "val1" };
    expect(q1.value, "q1.value #2").toBe("val1");
    expect(q2.value, "q2.value #2").toBeFalsy();
    expect([...(q3.value)], "q3.value #2").toEqual([]);
    expect(q4.value, "q4.value #2").toBeFalsy();
    q2.value = "val2";
    expect(q1.value, "q1.value #3").toBe("val1");
    expect(q2.value, "q2.value #3").toBe("val2");
    expect([...(q3.value)], "q3.value #3").toEqual([]);
    expect(q4.value, "q4.value #3").toBeFalsy();
  });
  test("theme assignment affects headerView", () => {
    let survey = new SurveyModel({});
    expect(survey.headerView, "default value").toBe("basic");
    survey.applyTheme({ header: {} } as any);
    expect(survey.headerView, "changed to advanced").toBe("advanced");
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
    expect(q2.value, "defaultValueExpression is working").toBe(1);
    survey.clear();
    q1.value = 2;
    expect(q2.value, "defaultValueExpression is still working").toBe(2);
    q2.value = 3;
    expect(q2.value, "set value directly").toBe(3);
    survey.clear();
    q1.value = 4;
    expect(q2.value, "defaultValueExpression is working after set value directly & clear").toBe(4);
  });
  test("emptySurveyText, make it writable, #7456", () => {
    const survey = new SurveyModel();
    const defaultText = "The survey doesn't contain any visible elements.";
    expect(survey.emptySurveyText, "#1").toBe(defaultText);
    survey.emptySurveyText = "Empty";
    expect(survey.emptySurveyText, "#2").toBe("Empty");
    survey.resetPropertyValue("emptySurveyText");
    expect(survey.emptySurveyText, "#3").toBe(defaultText);
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

      expect(survey.showNavigationButtons).toBe(false);
      expect(survey.progressBarType).toBe("pages");
      expect(survey.showProgressBar).toBe(false);

      expect(getContainerContent("header"), "default header").toEqual([{
        "component": "sv-header",
        "container": "header",
        "id": "advanced-header",
        "index": -100
      }]);
      expect(getContainerContent("center"), "default center").toEqual([]);
      expect(getContainerContent("footer"), "default footer").toEqual([]);
      expect(getContainerContent("contentTop"), "default contentTop").toEqual([]);
      expect(getContainerContent("contentBottom"), "default contentBottom").toEqual([]);
      expect(getContainerContent("left"), "default left").toEqual([]);
      expect(getContainerContent("right"), "default right").toEqual([]);

      survey.showProgressBar = "top";
      expect(getContainerContent("header"), "progress top header alone").toEqual([{
        "component": "sv-header",
        "container": "header",
        "id": "advanced-header",
        "index": -100
      }]);
      expect(getContainerContent("center"), "progress top center alone").toEqual([{
        "component": "sv-progress-pages",
        "id": "progress-pages"
      }]);
      expect(getContainerContent("footer"), "progress top footer alone").toEqual([]);
      expect(getContainerContent("contentTop"), "progress top contentTop alone").toEqual([]);
      expect(getContainerContent("contentBottom"), "progress top contentBottom alone").toEqual([]);
      expect(getContainerContent("left"), "progress top left alone").toEqual([]);
      expect(getContainerContent("right"), "progress top right alone").toEqual([]);

      survey.applyTheme({
        header: {},
        cssVariables: {
          "--sjs-header-backcolor": "transparent"
        }
      } as any);
      expect(getContainerContent("header"), "progress top header").toEqual([{
        "component": "sv-progress-pages",
        "id": "progress-pages",
        "index": -150
      }, {
        "component": "sv-header",
        "container": "header",
        "id": "advanced-header",
        "index": -100
      }]);
      expect(getContainerContent("center"), "progress top center").toEqual([]);
      expect(getContainerContent("footer"), "progress top footer").toEqual([]);
      expect(getContainerContent("contentTop"), "progress top contentTop").toEqual([]);
      expect(getContainerContent("contentBottom"), "progress top contentBottom").toEqual([]);
      expect(getContainerContent("left"), "progress top left").toEqual([]);
      expect(getContainerContent("right"), "progress top right").toEqual([]);

      survey.showProgressBar = "belowHeader";
      expect(getContainerContent("header"), "progress top header").toEqual([{
        "component": "sv-header",
        "container": "header",
        "id": "advanced-header",
        "index": -100
      }]);
      expect(getContainerContent("center"), "progress top center").toEqual([{
        "component": "sv-progress-pages",
        "id": "progress-pages",
      }]);
      expect(getContainerContent("footer"), "progress top footer").toEqual([]);
      expect(getContainerContent("contentTop"), "progress top contentTop").toEqual([]);
      expect(getContainerContent("contentBottom"), "progress top contentBottom").toEqual([]);
      expect(getContainerContent("left"), "progress top left").toEqual([]);
      expect(getContainerContent("right"), "progress top right").toEqual([]);
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

    expect(survey.showNavigationButtons).toBe(false);
    expect(survey.progressBarType).toBe("pages");
    expect(survey.showProgressBar).toBe(false);

    expect(getContainerContent("header"), "default header").toEqual([{
      "component": "sv-header",
      "container": "header",
      "id": "advanced-header",
      "index": -100
    }]);
    expect(getContainerContent("center"), "default center").toEqual([]);
    expect(getContainerContent("footer"), "default footer").toEqual([]);
    expect(getContainerContent("contentTop"), "default contentTop").toEqual([]);
    expect(getContainerContent("contentBottom"), "default contentBottom").toEqual([]);
    expect(getContainerContent("left"), "default left").toEqual([]);
    expect(getContainerContent("right"), "default right").toEqual([]);

    survey.showProgressBar = "top";
    expect(getContainerContent("header"), "progress top header alone").toEqual([{
      "component": "sv-header",
      "container": "header",
      "id": "advanced-header",
      "index": -100
    }]);
    expect(getContainerContent("center"), "progress top center alone").toEqual([{
      "component": "sv-progress-buttons",
      "id": "progress-buttons"
    }]);
    expect(getContainerContent("footer"), "progress top footer alone").toEqual([]);
    expect(getContainerContent("contentTop"), "progress top contentTop alone").toEqual([]);
    expect(getContainerContent("contentBottom"), "progress top contentBottom alone").toEqual([]);
    expect(getContainerContent("left"), "progress top left alone").toEqual([]);
    expect(getContainerContent("right"), "progress top right alone").toEqual([]);

    survey.applyTheme({
      header: {},
      cssVariables: {
        "--sjs-header-backcolor": "transparent"
      }
    } as any);
    expect(getContainerContent("header"), "progress top header").toEqual([{
      "component": "sv-progress-buttons",
      "id": "progress-buttons",
      "index": -150
    }, {
      "component": "sv-header",
      "container": "header",
      "id": "advanced-header",
      "index": -100
    }]);
    expect(getContainerContent("center"), "progress top center").toEqual([]);
    expect(getContainerContent("footer"), "progress top footer").toEqual([]);
    expect(getContainerContent("contentTop"), "progress top contentTop").toEqual([]);
    expect(getContainerContent("contentBottom"), "progress top contentBottom").toEqual([]);
    expect(getContainerContent("left"), "progress top left").toEqual([]);
    expect(getContainerContent("right"), "progress top right").toEqual([]);
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

    expect(getContainerContent("header"), "default header").toEqual([{
      "component": "sv-timerpanel",
      "id": "timerpanel",
      "template": "survey-timerpanel"
    }]);
    expect(getContainerContent("center"), "default center").toEqual([]);
    expect(getContainerContent("footer"), "default footer").toEqual([]);
    expect(getContainerContent("contentTop"), "default contentTop").toEqual([]);
    expect(getContainerContent("contentBottom"), "default contentBottom").toEqual([{
      "component": "sv-action-bar",
      "id": "buttons-navigation"
    }]);
    expect(getContainerContent("left"), "default left").toEqual([]);
    expect(getContainerContent("right"), "default right").toEqual([]);

    survey.readOnly = true;
    expect(getContainerContent("header"), "default header").toEqual([]);
    expect(getContainerContent("center"), "default center").toEqual([]);
    expect(getContainerContent("footer"), "default footer").toEqual([]);
    expect(getContainerContent("contentTop"), "default contentTop").toEqual([]);
    expect(getContainerContent("contentBottom"), "default contentBottom").toEqual([{
      "component": "sv-action-bar",
      "id": "buttons-navigation"
    }]);
    expect(getContainerContent("left"), "default left").toEqual([]);
    expect(getContainerContent("right"), "default right").toEqual([]);
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
    expect(log).toBe("->q1:true->q2:true");
    log = "";
    survey["isCompact"] = false;
    expect(log).toBe("->q1:true->q2:true");
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
    expect(survey.pages[0].wasRendered, "page1 wasRendered").toBe(true);
    expect(survey.getQuestionByName("q1").wasRendered, "q1 wasRendered").toBe(true);
    const q3 = survey.pages[0].addNewQuestion("text", "q3");
    expect(q3.wasRendered, "q3 wasRendered").toBe(true);
    const panel1 = survey.pages[0].addNewPanel("panel1");
    expect(panel1.wasRendered, "panel1 wasRendered").toBe(true);
    const q4 = panel1.addNewQuestion("text", "q4");
    expect(q4.wasRendered, "q4 wasRendered").toBe(true);

    expect(survey.pages[1].wasRendered, "page2 wasRendered, #1").toBe(false);
    expect(survey.getQuestionByName("q2").wasRendered, "q2 wasRendered, #1").toBe(false);
    const q5 = survey.pages[1].addNewQuestion("text", "q5");
    expect(q5.wasRendered, "q5 wasRendered, #1").toBe(false);
    const panel2 = survey.pages[1].addNewPanel("panel1");
    expect(panel2.wasRendered, "panel2 wasRendered, #1").toBe(false);
    const q6 = panel2.addNewQuestion("text", "q6");
    expect(q6.wasRendered, "q6 wasRendered, #1").toBe(false);

    survey.nextPage();
    expect(survey.pages[1].wasRendered, "page2 wasRendered, #2").toBe(true);
    expect(survey.getQuestionByName("q2").wasRendered, "q2 wasRendered, #2").toBe(true);
    expect(q5.wasRendered, "q5 wasRendered, #2").toBe(true);
    expect(panel2.wasRendered, "panel2 wasRendered, #2").toBe(true);
    expect(q6.wasRendered, "q6 wasRendered, #2").toBe(true);
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

    expect(settings.legacyProgressBarView, "show buttons progress for pages by default").toBe(false);
    expect(survey.showProgressBar, "default show progress bar").toBe(false);
    expect(survey.progressBarType, "default progress bar type").toBe("pages");
    expect(survey.progressBarShowPageNumbers, "don't show page numbers in progress by default").toBe(false);
    expect(survey.progressBarShowPageTitles, "don't show page titles in progress by default").toBe(false);

    expect(getContainerContent("header"), "empty header").toEqual([]);
    expect(getContainerContent("footer"), "empty footer").toEqual([]);
    expect(getContainerContent("contentTop"), "empty contentTop").toEqual([]);
    expect(getContainerContent("contentBottom"), "empty contentBottom").toEqual([]);
    expect(getContainerContent("left"), "empty left").toEqual([]);
    expect(getContainerContent("right"), "empty right").toEqual([]);
    expect(getContainerContent("center"), "empty center").toEqual([]);

    survey.showProgressBar = "auto";
    expect(getContainerContent("header"), "auto pages header").toEqual([]);
    expect(getContainerContent("footer"), "auto pages footer").toEqual([]);
    expect(getContainerContent("contentTop"), "auto pages contentTop").toEqual([]);
    expect(getContainerContent("contentBottom"), "auto pages contentBottom").toEqual([]);
    expect(getContainerContent("left"), "auto pages left").toEqual([]);
    expect(getContainerContent("right"), "auto pages right").toEqual([]);
    expect(getContainerContent("center"), "auto pages center").toEqual([{
      "component": "sv-progress-buttons",
      "id": "progress-buttons"
    }]);

    survey.progressBarType = "buttons";

    expect(survey.progressBarShowPageTitles, "show page titles in progress for buttons").toBe(true);

    expect(getContainerContent("header"), "auto buttons header").toEqual([]);
    expect(getContainerContent("footer"), "auto buttons footer").toEqual([]);
    expect(getContainerContent("contentTop"), "auto buttons contentTop").toEqual([]);
    expect(getContainerContent("contentBottom"), "auto buttons contentBottom").toEqual([]);
    expect(getContainerContent("left"), "auto buttons left").toEqual([]);
    expect(getContainerContent("right"), "auto buttons right").toEqual([]);
    expect(getContainerContent("center"), "auto buttons center").toEqual([{
      "component": "sv-progress-buttons",
      "id": "progress-buttons"
    }]);

    survey.progressBarType = "pages";

    survey.showProgressBar = "aboveHeader";
    expect(getContainerContent("header"), "aboveHeader pages header").toEqual([{
      "component": "sv-progress-buttons",
      "id": "progress-buttons",
      "index": -150
    }]);
    expect(getContainerContent("footer"), "aboveHeader pages footer").toEqual([]);
    expect(getContainerContent("contentTop"), "aboveHeader pages contentTop").toEqual([]);
    expect(getContainerContent("contentBottom"), "aboveHeader pages contentBottom").toEqual([]);
    expect(getContainerContent("left"), "aboveHeader pages left").toEqual([]);
    expect(getContainerContent("right"), "aboveHeader pages right").toEqual([]);
    expect(getContainerContent("center"), "aboveHeader pages center").toEqual([]);

    survey.showProgressBar = "belowHeader";
    expect(getContainerContent("header"), "belowHeader pages header").toEqual([]);
    expect(getContainerContent("footer"), "belowHeader pages footer").toEqual([]);
    expect(getContainerContent("contentTop"), "belowHeader pages contentTop").toEqual([]);
    expect(getContainerContent("contentBottom"), "belowHeader pages contentBottom").toEqual([]);
    expect(getContainerContent("left"), "belowHeader pages left").toEqual([]);
    expect(getContainerContent("right"), "belowHeader pages right").toEqual([]);
    expect(getContainerContent("center"), "belowHeader pages center").toEqual([{
      "component": "sv-progress-buttons",
      "id": "progress-buttons"
    }]);

    survey.showProgressBar = "topBottom";
    expect(getContainerContent("header"), "topBottom pages header").toEqual([]);
    expect(getContainerContent("footer"), "topBottom pages footer").toEqual([{
      "component": "sv-progress-buttons",
      "id": "progress-buttons"
    }]);
    expect(getContainerContent("contentTop"), "topBottom pages contentTop").toEqual([]);
    expect(getContainerContent("contentBottom"), "topBottom pages contentBottom").toEqual([]);
    expect(getContainerContent("left"), "topBottom pages left").toEqual([]);
    expect(getContainerContent("right"), "topBottom pages right").toEqual([]);
    expect(getContainerContent("center"), "topBottom pages center").toEqual([{
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

    expect(getContainerContent("header"), "advanced header").toEqual([{
      "component": "sv-header",
      "container": "header",
      "id": "advanced-header",
      "index": -100
    }]);
    expect(getContainerContent("footer"), "advanced footer").toEqual([]);
    expect(getContainerContent("contentTop"), "advanced contentTop").toEqual([]);
    expect(getContainerContent("contentBottom"), "advanced contentBottom").toEqual([]);
    expect(getContainerContent("left"), "advanced left").toEqual([]);
    expect(getContainerContent("right"), "advanced right").toEqual([]);
    expect(getContainerContent("center"), "advanced center").toEqual([]);

    survey.headerView = "basic";
    expect(getContainerContent("header"), "empty header").toEqual([]);
    expect(getContainerContent("footer"), "empty footer").toEqual([]);
    expect(getContainerContent("contentTop"), "empty contentTop").toEqual([]);
    expect(getContainerContent("contentBottom"), "empty contentBottom").toEqual([]);
    expect(getContainerContent("left"), "empty left").toEqual([]);
    expect(getContainerContent("right"), "empty right").toEqual([]);
    expect(getContainerContent("center"), "empty center").toEqual([]);
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
    expect(q1.value, "q1.value #1").toBeUndefined();
    expect(q2.isVisible, "q2.isVisible #1").toBe(false);

    FunctionFactory.Instance.register("func1", func1);
    survey.runExpressions();
    expect(q1.value, "q1.value #2").toBe(1);
    expect(q2.isVisible, "q2.isVisible #2").toBe(true);

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
    expect(q1.hasDescription, "Description loaded correctly").toBe(true);
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
    expect(log).toBe("");
    survey.chooseFiles(document.createElement("input"), () => { }, { element: { a: 1 }, propertyName: "a" } as any);
    expect(log).toBe("->onOpenFileChooser");
    expect(lastContext).toEqual({ element: { a: 1 }, propertyName: "a" });
    expect(lastContextElement).toEqual({ a: 1 });
    expect(lastContextPropertyName).toBe("a");
  });
  test("Advanced header title/description color", () => {
    const cssVariables = DefaultTheme.cssVariables;
    try {
      DefaultTheme.cssVariables = {} as any;
      const survey = new SurveyModel();

      const accHeaderBackTheme: any = { "cssVariables": {}, "header": {}, "headerView": "advanced" };
      survey.applyTheme(accHeaderBackTheme);
      let headerLayoutElement = survey.findLayoutElement("advanced-header");
      let headerModel = headerLayoutElement.data as Cover;
      expect(headerModel.headerClasses).toBe("sv-header sv-header--height-auto sv-header__without-background sv-header__background-color--none");

      headerModel.height = 256;
      expect(headerModel.headerClasses).toBe("sv-header sv-header__without-background sv-header__background-color--none");
      // expect(survey.themeVariables["--sjs-font-headertitle-color"]).toBeUndefined();
      // expect(survey.themeVariables["--sjs-font-headertitle-color"]).toBeUndefined();
      // expect(survey.themeVariables["--sjs-font-headerdescription-color"]).toBeUndefined();
      // expect(accHeaderBackTheme.cssVariables["--sjs-font-headertitle-color"]).toBeUndefined();
      // expect(accHeaderBackTheme.cssVariables["--sjs-font-headerdescription-color"]).toBeUndefined();

      const noneHeaderBackTheme: any = { "cssVariables": { "--sjs-header-backcolor": "transparent" }, "header": {}, "headerView": "advanced" };
      survey.applyTheme(noneHeaderBackTheme);
      headerLayoutElement = survey.findLayoutElement("advanced-header");
      headerModel = headerLayoutElement.data as Cover;
      expect(headerModel.headerClasses).toBe("sv-header sv-header--height-auto sv-header__without-background sv-header__background-color--none");

      const customNotSetHeaderBackTheme: any = { "cssVariables": { "--sjs-header-backcolor": "transparent" }, "header": {}, "headerView": "advanced" };
      survey.applyTheme(customNotSetHeaderBackTheme);
      headerLayoutElement = survey.findLayoutElement("advanced-header");
      headerModel = headerLayoutElement.data as Cover;
      expect(headerModel.headerClasses).toBe("sv-header sv-header--height-auto sv-header__without-background sv-header__background-color--none");

      const customHeaderBackTheme: any = { "cssVariables": { "--sjs-header-backcolor": "rgba(0, 255, 0, 1)" }, "header": {}, "headerView": "advanced" };
      survey.applyTheme(customHeaderBackTheme);
      headerLayoutElement = survey.findLayoutElement("advanced-header");
      headerModel = headerLayoutElement.data as Cover;
      expect(headerModel.headerClasses).toBe("sv-header sv-header--height-auto sv-header__background-color--custom");

      const customNotSetHeaderBackAndTitleTheme: any = { "cssVariables": { "--sjs-font-headertitle-color": "rgba(255, 0, 0, 1)", "--sjs-font-headerdescription-color": "rgba(255, 0, 0, 1)", "--sjs-header-backcolor": "transparent" }, "header": {}, "headerView": "advanced" };
      survey.applyTheme(customNotSetHeaderBackAndTitleTheme);
      headerLayoutElement = survey.findLayoutElement("advanced-header");
      headerModel = headerLayoutElement.data as Cover;
      expect(headerModel.headerClasses).toBe("sv-header sv-header--height-auto sv-header__without-background");

      const customHeaderBackAndTitleTheme: any = { "cssVariables": { "--sjs-font-headertitle-color": "rgba(255, 0, 0, 1)", "--sjs-font-headerdescription-color": "rgba(255, 0, 0, 1)", "--sjs-header-backcolor": "rgba(0, 255, 0, 1)" }, "header": {}, "headerView": "advanced" };
      survey.applyTheme(customHeaderBackAndTitleTheme);
      headerLayoutElement = survey.findLayoutElement("advanced-header");
      headerModel = headerLayoutElement.data as Cover;
      expect(headerModel.headerClasses).toBe("sv-header sv-header--height-auto");
    } finally {
      DefaultTheme.cssVariables = cssVariables;
    }
  });
  test("Display mode in design time", () => {
    const survey = new SurveyModel();
    settings.animationEnabled = true;
    expect(survey.css.rootReadOnly).toBe("sd-root--readonly");
    expect(survey.mode).toBe("edit");
    expect(survey.isDisplayMode).toBe(false);
    expect(survey.getRootCss()).toBe("sd-root-modern sd-progress--pages sd-root-modern--full-container");

    survey.readOnly = true;
    expect(survey.mode).toBe("display");
    expect(survey.isDisplayMode).toBe(true);
    expect(survey.getRootCss().indexOf(survey.css.rootReadOnly) !== -1).toBeTruthy();

    survey.setDesignMode(true);
    expect(survey.mode).toBe("display");
    expect(survey.isDisplayMode).toBe(false);
    expect(survey.getRootCss()).toBe("sd-root-modern sd-progress--pages sd-root-modern--full-container");
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
    expect(survey.pages[0].passed, "1) Page 1 isn't passed").toBe(false);
    expect(survey.pages[1].passed, "1) Page 2 isn't passed").toBe(false);
    expect(survey.pages[2].passed, "1) Page 3 isn't passed").toBe(false);

    survey.nextPage();
    expect(survey.pages[0].passed, "2) Page 1 is passed").toBe(true);
    expect(survey.pages[1].passed, "2) Page 2 isn't passed").toBe(false);
    expect(survey.pages[2].passed, "2) Page 3 isn't passed").toBe(false);

    survey.nextPage();
    expect(survey.pages[0].passed, "3) Page 1 is passed").toBe(true);
    expect(survey.pages[1].passed, "3) Page 2 is passed").toBe(true);
    expect(survey.pages[2].passed, "3) Page 3 isn't passed").toBe(false);

    survey.prevPage();
    expect(survey.pages[0].passed, "4) Page 1 is passed").toBe(true);
    expect(survey.pages[1].passed, "4) Page 2 is passed").toBe(true);
    expect(survey.pages[2].passed, "4) Page 3 is passed").toBe(true);

    survey.nextPage();
    survey.tryComplete();
    expect(survey.pages[0].passed, "5) Page 1 is passed").toBe(true);
    expect(survey.pages[1].passed, "5) Page 2 is passed").toBe(true);
    expect(survey.pages[2].passed, "5) Page 3 is passed").toBe(true);
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
    expect(survey.progressText, "progressText").toBe("Page 1 of 1");
    expect(progressCounter, "progressCounter").toBe(1);
    expect(visibleChangedCounter, "visibleChangedCounter").toBe(0);
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
    expect(panel.visibleRows.length).toBe(1);
    expect(panel.visibleRows[0].visibleElements[0].name).toBe("nps-score");
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

    expect(survey.progressBarType).toBe("pages");
    expect(survey.questionsOnPageMode).toBe("standard");
    expect(survey.showProgressBar).toBe(true);
    expect(survey.progressBarLocation).toBe("auto");
    expect(getContainerContent("header"), "").toEqual([]);
    expect(getContainerContent("center"), "Progress is shown").toEqual([{
      "component": "sv-progress-buttons",
      "id": "progress-buttons"
    }]);
    expect(getContainerContent("footer"), "").toEqual([]);
    expect(getContainerContent("contentTop"), "").toEqual([]);
    expect(getContainerContent("contentBottom"), "").toEqual([]);
    expect(getContainerContent("left"), "").toEqual([]);
    expect(getContainerContent("right"), "").toEqual([]);

    survey.questionsOnPageMode = "singlePage";

    expect(getContainerContent("header"), "").toEqual([]);
    expect(getContainerContent("center"), "Buttons progress is not shown in the single page mode").toEqual([]);
    expect(getContainerContent("footer"), "").toEqual([]);
    expect(getContainerContent("contentTop"), "").toEqual([]);
    expect(getContainerContent("contentBottom"), "").toEqual([]);
    expect(getContainerContent("left"), "").toEqual([]);
    expect(getContainerContent("right"), "").toEqual([]);

    survey.progressBarType = "questions";

    expect(getContainerContent("header"), "").toEqual([]);
    expect(getContainerContent("center"), "Buttons progress is shown in the single page mode for questions mode").toEqual([{
      "component": "sv-progress-questions",
      "id": "progress-questions"
    }]);
    expect(getContainerContent("footer"), "").toEqual([]);
    expect(getContainerContent("contentTop"), "").toEqual([]);
    expect(getContainerContent("contentBottom"), "").toEqual([]);
    expect(getContainerContent("left"), "").toEqual([]);
    expect(getContainerContent("right"), "").toEqual([]);

    survey.showProgressBar = "bottom";

    expect(getContainerContent("header"), "").toEqual([]);
    expect(getContainerContent("center"), "").toEqual([]);
    expect(getContainerContent("footer"), "Buttons progress is shown in the single page mode for questions mode in bottom").toEqual([{
      "component": "sv-progress-questions",
      "id": "progress-questions"
    }]);
    expect(getContainerContent("contentTop"), "").toEqual([]);
    expect(getContainerContent("contentBottom"), "").toEqual([]);
    expect(getContainerContent("left"), "").toEqual([]);
    expect(getContainerContent("right"), "").toEqual([]);
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

    expect(survey.progressBarType).toBe("pages");
    expect(survey.questionsOnPageMode).toBe("standard");
    expect(survey.showProgressBar).toBe(false);
    expect(survey.progressBarLocation).toBe("auto");
    expect(getContainerContent("header"), "header").toEqual([]);
    expect(getContainerContent("center"), "center").toEqual([]);
    expect(getContainerContent("footer"), "footer").toEqual([]);
    expect(getContainerContent("contentTop"), "header in center top").toEqual([{
      "component": "sv-header",
      "container": "header",
      "id": "advanced-header",
      "index": -100
    }]);
    expect(getContainerContent("contentBottom"), "center bottom").toEqual([{
      "component": "sv-action-bar",
      "id": "buttons-navigation"
    }]);
    expect(getContainerContent("left"), "left").toEqual([{
      "component": "sv-navigation-toc",
      "id": "toc-navigation"
    }]);
    expect(getContainerContent("right"), "right").toEqual([]);
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

    expect(survey.progressBarType).toBe("pages");
    expect(survey.questionsOnPageMode).toBe("standard");
    expect(survey.showProgressBar).toBe(false);
    expect(survey.progressBarLocation).toBe("auto");
    expect(getContainerContent("header"), "header in header").toEqual([{
      "component": "sv-header",
      "container": "header",
      "id": "advanced-header",
      "index": -100
    }]);
    expect(getContainerContent("center"), "Progress is shown").toEqual([]);
    expect(getContainerContent("footer"), "footer").toEqual([]);
    expect(getContainerContent("contentTop"), "center top").toEqual([]);
    expect(getContainerContent("contentBottom"), "center bottom").toEqual([{
      "component": "sv-action-bar",
      "id": "buttons-navigation"
    }]);
    expect(getContainerContent("left"), "left").toEqual([{
      "component": "sv-navigation-toc",
      "id": "toc-navigation"
    }]);
    expect(getContainerContent("right"), "right").toEqual([]);
  });

  test("Display mode in design time 2", () => {
    const survey = new SurveyModel();
    expect(survey.wrapperFormCss).toBe("sd-root-modern__wrapper");

    survey.backgroundImage = "abc";
    expect(survey.wrapperFormCss).toBe("sd-root-modern__wrapper sd-root-modern__wrapper--has-image");

    survey.backgroundImageAttachment = "fixed";
    expect(survey.wrapperFormCss).toBe("sd-root-modern__wrapper sd-root-modern__wrapper--has-image sd-root-modern__wrapper--fixed");
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
    expect(location.href, "encoded URL").toBe("javascript%3Aalert(2)");
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
    expect(q.name, "q1 name is here").toBe("q1");
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
    expect(btnComplete.visible, "Complete button is visible, #1").toBe(false);
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion").toBe("q1");
    survey.currentSingleQuestion.value = "a";
    expect(btnComplete.visible, "Complete button is visible, #2").toBe(true);
    expect(survey.state, "Survey is running").toBe("running");
    btnComplete.action();
    expect(survey.state, "Survey is completed").toBe("completed");
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
    expect(btnComplete.visible, "Complete button is visible, #1").toBe(false);
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion").toBe("q1");
    survey.currentSingleQuestion.value = "a";
    expect(btnComplete.visible, "Complete button is visible, #2").toBe(true);
    expect(survey.state, "Survey is running").toBe("running");
    btnComplete.action();
    expect(survey.state, "Survey is completed").toBe("completed");

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
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion").toBe("q1");
    survey.currentSingleQuestion.value = "a";
    survey.performNext();
    expect(survey.state, "Survey is completed").toBe("completed");

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
    expect(question.name, "currentSingleQuestion").toBe("q1");
    expect(q2.isVisible, "q2.isVisible, #1").toBe(false);
    expect(survey.isShowNextButton, "Next button is hidden, #1").toBe(false);
    expect(survey.isCompleteButtonVisible, "Complete button is shown, #1").toBe(true);
    question.value = 1;
    expect(q2.isVisible, "q2.isVisible, #2").toBe(true);
    expect(survey.isShowNextButton, "Next button is shown, #2").toBe(true);
    expect(survey.isCompleteButtonVisible, "Complete button is hidden, #2").toBe(false);
    question.value = 2;
    expect(q2.isVisible, "q2.isVisible, #3").toBe(false);
    expect(survey.isShowNextButton, "Next button is hidden, #3").toBe(false);
    expect(survey.isCompleteButtonVisible, "Complete button is shown, #3").toBe(true);
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
    expect(survey.questionsOnPageMode, "the property set correctly").toBe("questionPerPage");
    expect(survey.currentSingleQuestion?.name, "It is the design mode").toBeUndefined();
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
    expect(survey.currentSingleElement.name, "currentSingleQuestion #1").toBe("panel1");
    survey.performNext();
    expect(survey.currentSingleElement.name, "currentSingleQuestion #2").toBe("q3");
    survey.performNext();
    expect(survey.currentSingleElement.name, "currentSingleQuestion #3").toBe("panel2");
    survey.performPrevious();
    expect(survey.currentSingleElement.name, "currentSingleQuestion #4").toBe("q3");
    survey.performPrevious();
    expect(survey.currentSingleElement.name, "currentSingleQuestion #5").toBe("panel1");
  });
  test("question.canHaveFrameStyles should return true for questionsOnPageMode", () => {
    const json = {
      "elements": [{ type: "panel", name: "panel1", elements: [{ "type": "text", "name": "q1" }] }],
      "questionsOnPageMode": "questionPerPage",
    };
    const survey = new SurveyModel(json);
    const question = survey.getQuestionByName("q1");
    expect(survey.currentSingleElement.name, "currentSingleQuestion").toBe("panel1");
    expect(survey.currentSingleElement["canHaveFrameStyles"](), "canHaveFrameStyles - panel").toBe(true);
    expect(question["canHaveFrameStyles"](), "canHaveFrameStyles - question").toBe(false);
  });
  test("question.canHaveFrameStyles should return false for questionsOnPageMode for question in dynamic panel, Bug#9572", () => {
    const json = {
      elements: [{ type: "paneldynamic", name: "panel1", panelCount: 1, templateElements: [{ "type": "text", "name": "q1" }] }],
      questionsOnPageMode: "questionPerPage",
    };
    const survey = new SurveyModel(json);
    const question = survey.currentSingleQuestion;
    expect(question.name, "currentSingleQuestion").toBe("panel1");
    expect(question["canHaveFrameStyles"](), "canHaveFrameStyles").toBe(true);
    const q1 = question.panels[0].getQuestionByName("q1");
    expect(q1["canHaveFrameStyles"](), "canHaveFrameStyles").toBe(false);
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
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion #1").toBe("q1");
    expect(survey.performNext(), "Can go futher").toBe(true);
    expect(survey.currentSingleQuestion.name, "currentSingleQuestion #2").toBe("q2");
    expect(survey.tryComplete(), "Survey is completed").toBe(true);
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
    expect(survey.currentSingleQuestion.name, "the first question is invisible").toBe("q2");
    survey.getQuestionByName("q2").visible = false;
    expect(survey.currentSingleQuestion.name, "the second question is invisible").toBe("q3");
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
    expect(survey.currentSingleElement.name, "the first panel is invisible").toBe("p2");
    survey.getPanelByName("p2").visible = false;
    expect(survey.currentSingleElement.name, "the second panel is invisible").toBe("p3");
    survey.getQuestionByName("q3").visible = false;
    expect(survey.currentSingleElement.name, "the third panel is invisible").toBe("q4");
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
    expect(survey.currentSingleElement.name, "the second question is viaible").toBe("q2");
    expect(survey.currentPage.name, "the second page is visible").toBe("page2");
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
    expect(survey.currentSingleQuestion?.name, "currentSingleQuestion #1").toBe("q1");
    survey.performNext();
    expect(survey.currentSingleQuestion?.name, "currentSingleQuestion #2").toBe("q2");
    survey.performNext();
    expect(survey.currentSingleQuestion?.name, "currentSingleQuestion #3").toBe("q3");
    survey.performNext();
    expect(survey.currentSingleQuestion?.name, "currentSingleQuestion #4").toBe("q4");
    survey.performPrevious();
    expect(survey.currentSingleQuestion?.name, "currentSingleQuestion #5").toBe("q3");
    survey.performPrevious();
    expect(survey.currentSingleQuestion?.name, "currentSingleQuestion #6").toBe("q2");
    survey.performPrevious();
    expect(survey.currentSingleQuestion?.name, "currentSingleQuestion #7").toBe("q1");
    const result = [{ newPage: "page1", oldPage: "page1", newQuestion: "q2", oldQuestion: "q1", forward: true, backward: false },
      { newPage: "page2", oldPage: "page1", newQuestion: "q3", oldQuestion: "q2", forward: true, backward: false },
      { newPage: "page2", oldPage: "page2", newQuestion: "q4", oldQuestion: "q3", forward: true, backward: false },
      { newPage: "page2", oldPage: "page2", newQuestion: "q3", oldQuestion: "q4", forward: false, backward: true },
      { newPage: "page1", oldPage: "page2", newQuestion: "q2", oldQuestion: "q3", forward: false, backward: true },
      { newPage: "page1", oldPage: "page1", newQuestion: "q1", oldQuestion: "q2", forward: false, backward: true },
    ];
    expect(onPageChanging, "onChanged #1").toEqual(result);
    expect(onPageChanged, "onChanging #1").toEqual(result);
    onPageChanging.splice(0, onPageChanging.length);
    onPageChanged.splice(0, onPageChanged.length);
    doAllow = false;
    survey.performNext();
    expect(survey.currentSingleQuestion?.name, "currentSingleQuestion #8").toBe("q1");
    expect(onPageChanged, "onChanged #2").toEqual([]);
    expect(onPageChanging, "onChanging #2").toEqual([{ newPage: "page1", oldPage: "page1", newQuestion: "q2", oldQuestion: "q1", forward: true, backward: false }]);
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
    expect(q.name, "q1 name is here").toBe("q1");
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
    expect(panels.length, "There are two panels").toBe(2);
    expect((<PanelModel>panels[0]).hasTitle, "panels[0], locale en").toBe(false);
    expect((<PanelModel>panels[1]).hasTitle, "panels[1], locale en").toBe(false);
    survey.locale = "de";
    expect((<PanelModel>panels[0]).hasTitle, "panels[0], locale de").toBe(false);
    expect((<PanelModel>panels[1]).hasTitle, "panels[1], locale de").toBe(false);
    survey.locale = "";
    expect((<PanelModel>panels[0]).hasTitle, "panels[0], locale ''").toBe(false);
    expect((<PanelModel>panels[1]).hasTitle, "panels[1], locale ''").toBe(false);
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
    expect(panels.length, "There are two panels").toBe(2);
    expect((<PanelModel>panels[0]).hasTitle, "panels[0], locale en").toBe(true);
    expect((<PanelModel>panels[1]).hasTitle, "panels[1], locale en").toBe(true);
    survey.locale = "de";
    expect((<PanelModel>panels[0]).hasTitle, "panels[0], locale de").toBe(true);
    expect((<PanelModel>panels[1]).hasTitle, "panels[1], locale de").toBe(true);
    survey.locale = "";
    expect((<PanelModel>panels[0]).hasTitle, "panels[0], locale ''").toBe(true);
    expect((<PanelModel>panels[1]).hasTitle, "panels[1], locale ''").toBe(true);
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
    expect(survey.isShowNextButton, "Next button is hidden").toBe(false);
    expect(survey.isShowPrevButton, "Prev button is hidden").toBe(false);
    expect(survey.isCompleteButtonVisible, "Complete button is visible").toBe(true);
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
    expect(survey.visiblePageCount, "There is one visible page, #1").toBe(1);
    expect(survey.visiblePages[0].name, "The name is single-page, #1").toBe("single-page");
    survey.showPreview();
    expect(survey.visiblePageCount, "There is one visible page").toBe(1);
    expect(survey.visiblePages[0].name, "The name is preview-page").toBe("preview-page");
    expect(survey.visiblePages[0].elements.length, "It has only one element").toBe(1);
    let singlePage = <PageModel>survey.visiblePages[0].elements[0];
    const singlePageId = singlePage.id;
    expect(singlePage.getType(), "It is a page").toBe("page");
    expect(singlePage.name, "It is a single page in the preview, page name").toBe("single-page");
    expect(singlePage.isPage, "Single page in not a page in the preview").toBe(false);
    expect(singlePage.isPanel, "Single page in not a panel in the preview").toBe(true);
    expect(singlePage.elements.length, "Two pages in the single page").toBe(2);
    expect(singlePage.elements[0].getType(), "Panel is page").toBe("page");
    expect(singlePage.hasEditButton, "Single page has the cancel preview button").toBe(true);
    expect(singlePage.getFooterToolbar().getActionById("cancel-preview"), "single page has Cancel preview button").toBeTruthy();
    expect((<PageModel>singlePage.elements[0]).getFooterToolbar().actions.length, "original pages don't have Cancel preview button").toBe(0);
    expect((<PageModel>singlePage.elements[0]).hasEditButton, "original page doesn't have the cancel preview button").toBe(false);

    singlePage.cancelPreview();
    expect(survey.visiblePageCount, "There is one visible page, #2").toBe(1);
    expect(survey.visiblePages[0].name, "The name is single-page, #2").toBe("single-page");
    expect(survey.visiblePages[0].id, "We do not re-create the single-page, #2").toBe(singlePageId);
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
    expect(survey.visiblePages.length, "visiblePages #1").toBe(1);
    survey.setValue("q1", "a");
    survey.start();
    expect(survey.currentPage.name, "p1 is the current page").toBe("p1");
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
    expect(survey.pages[0].no, "start page should be empty, #1").toBe("");
    expect(survey.pages[1].no, "pages[1], #1").toBe("1. ");
    survey.firstPageIsStartPage = false;
    expect(survey.pages[0].no, "pages[0], #2").toBe("1. ");
    expect(survey.pages[1].no, "pages[1], #2").toBe("2. ");
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
    expect(survey.getQuestionByName("q1").value, "q1.value").toBe("a");
    expect(survey.getQuestionByName("q2").value, "q2.value").toBe("b");
    expect(survey.getQuestionByName("q3").value, "q3.value").toBe("c");
    expect(survey.getQuestionByName("q4").value, "q3.value").toBe("d");
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
    expect(document.activeElement).toBe(document.body);
    question.focusInputElement(false);
    expect(document.activeElement).toBe(root);
    expect(root.shadowRoot?.activeElement).toBe(input);
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
    expect(survey.progressText, "progressText").toBe("Page 1 of 2");
    expect(counter, "On loading").toBe(1);
    survey.pages[1].onFirstRendering();
    expect(counter, "page[1].onFirstRendering(), do nothing").toBe(1);
  });
  test("Do not include questions.values into survey.getFilteredValue in design time", () => {
    const survey = new SurveyModel({
      elements: [{ type: "text", name: "q1", defaultValue: 1 }],
      calculatedValues: [{ name: "val1", expression: "2" }]
    });
    expect(survey.getFilteredValues(), "survey in running state").toEqual({ q1: 1, val1: 2 });
    survey.setDesignMode(true);
    expect(survey.getFilteredValues(), "survey at design time").toEqual({ val1: 2 });
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
    expect(survey.data, "survey.data #1").toEqual({ q1: 1, q2: 2, q3: 3 });
    expect(logs, "logs #1").toEqual([
      { name: "q3", val: 3, reason: "expression" },
      { name: "q4", val: undefined, reason: "expression" },
      { name: "q2", val: 2, reason: "expression" },
      { name: "q1", val: 1, reason: undefined }]);

    logs.splice(0, logs.length);
    survey.getQuestionByName("q4").value = 2;
    expect(survey.data, "survey.data #2").toEqual({ q1: 1, q2: 2, q3: 3, q4: 2, q5: 5 });
    expect(logs, "logs #2").toEqual([
      { name: "q5", val: 5, reason: "trigger" },
      { name: "q4", val: 2, reason: undefined }]);

    logs.splice(0, logs.length);
    survey.getQuestionByName("q4").value = 3;
    expect(survey.data, "survey.data #3").toEqual({ q1: 1, q2: 2, q3: 3, q4: 3, q5: 8 });
    expect(logs, "logs #3").toEqual([
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
    expect(log).toBe("->text_question_id->focused text question");
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
      expect(!!reportText, "jsonVersion: " + jsonVer + ", sjsVer: " + sjsVer).toBe(showWarn);
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

    expect(survey.headerView, "By default headerView is basic").toBe("basic");
    expect(survey.findLayoutElement("advanced-header") == undefined, "By default header is absent").toBeTruthy();

    survey.applyTheme(advancedHeaderTheme);
    expect(survey.headerView, "After apply advanced headerView is advanced").toBe("advanced");
    expect(survey.findLayoutElement("advanced-header") != undefined, "After apply advanced header is present").toBeTruthy();

    survey.applyTheme(basicHeaderTheme);
    expect(survey.headerView, "After apply basic headerView is advanced").toBe("basic");
    expect(survey.findLayoutElement("advanced-header") == undefined, "After apply basic header is absent").toBeTruthy();

    survey.applyTheme(advancedHeaderThemeWithoutHeaderView);
    expect(survey.headerView, "After apply empty headerView is advanced").toBe("advanced");
    expect(survey.findLayoutElement("advanced-header") != undefined, "After apply empty headerView advanced header is present").toBeTruthy();
  });

  test("Change advanced header properties by theme", () => {
    const survey = new SurveyModel();
    const advancedHeaderThemeWithAccentBackgroundColor: any = { headerView: "advanced", "cssVariables": { "--sjs-header-backcolor": "var(--sjs-primary-backcolor)" } };
    const advancedHeaderThemeWithOverlapEnabled: any = { headerView: "advanced", "cssVariables": {}, "header": { overlapEnabled: true } };
    const advancedHeaderThemeWithoutOverlapEnabled: any = { headerView: "advanced", "cssVariables": {} };

    survey.applyTheme(advancedHeaderThemeWithAccentBackgroundColor);
    expect(survey.findLayoutElement("advanced-header").data.backgroundColor, "#1 backgroundColor accent").toBe("var(--sjs-primary-backcolor)");
    expect(survey.findLayoutElement("advanced-header").data.overlapEnabled === false, "#1 overlapEnabled false").toBeTruthy();

    survey.applyTheme(advancedHeaderThemeWithOverlapEnabled);
    expect(survey.findLayoutElement("advanced-header").data.backgroundColor, "#2 backgroundColor transparent").toBe("transparent");
    expect(survey.findLayoutElement("advanced-header").data.overlapEnabled === true, "#2 overlapEnabled true").toBeTruthy();

    survey.applyTheme(advancedHeaderThemeWithoutOverlapEnabled);
    expect(survey.findLayoutElement("advanced-header").data.backgroundColor, "#3 backgroundColor transparent").toBe("transparent");
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
    expect(pageAddedRaisedCount, "onPageAdded is not raised").toBe(0);
    expect(survey.pages[0].name, "page1 is the first page").toBe("page1");
    survey.startMovingPage();
    const page = survey.pages[1];
    survey.pages.splice(1, 1);
    survey.pages.splice(0, 0, page);
    survey.stopMovingPage();
    expect(pageAddedRaisedCount, "onPageAdded is not raised").toBe(0);
    expect(survey.pages[0].name, "page2 is the first page").toBe("page2");
  });

  test("Update hasTitle on load from JSON", () => {
    const survey = new SurveyModel();
    expect(survey.hasTitle, "no title in empty survey").toBe(false);
    survey.fromJSON({
      title: "title",
      elements: [{ name: "q1", type: "text" }]
    });
    expect(survey.hasTitle, "title presents").toBe(true);
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
    expect(counter, "onPartialSend is raised").toBe(1);
    survey.setValue("q3", "val3");
    survey.tryComplete();
    expect(counter, "onPartialSend is not raised").toBe(1);
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
    expect(counter, "onPartialSend is raised").toBe(1);
    survey.setValue("q2", "val2");
    survey.performNext();
    expect(counter, "onPartialSend is raised").toBe(2);
    survey.setValue("q3", "val3");
    survey.performNext();
    expect(counter, "onPartialSend is raised").toBe(3);
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
    expect(survey.currentPage.name, "current page #1").toBe("p1");
    expect(survey.currentSingleElement.name, "current question #1").toBe("q1");
    survey.nextPage();
    expect(survey.currentPage.name, "current page #2").toBe("p2");
    expect(survey.currentSingleElement.name, "current question #2").toBe("q2");
    survey.currentPageNo = 2;
    expect(survey.currentPage.name, "current page #3").toBe("p3");
    expect(survey.currentSingleElement.name, "current question #3").toBe("q3");
    survey.currentPageNo = 0;
    expect(survey.currentPage.name, "current page #4").toBe("p1");
    expect(survey.currentSingleElement.name, "current question #4").toBe("q1");
  });
  test("survey.currentElementName", () => {
    const survey = new SurveyModel({
      pages: [
        { name: "p1", elements: [{ type: "text", name: "q1_1" }, { type: "text", name: "q1_2" }] },
        { name: "p2", elements: [{ type: "text", name: "q2_1" }, { type: "text", name: "q2_2" }] },
        { name: "p3", elements: [{ type: "text", name: "q3_1" }, { type: "text", name: "q3_2" }] }
      ]
    });
    expect(survey.currentElementName, "current element name #1").toBe("p1");
    expect(survey.currentElement.name, "current element #1").toBe("p1");
    survey.currentElementName = "p3";
    expect(survey.currentElementName, "current element name #2").toBe("p3");
    expect(survey.currentElement.name, "current element #2").toBe("p3");
    survey.currentElementName = "q2_1";
    expect(survey.currentElementName, "current element name #3").toBe("p2");
    expect(survey.currentElement.name, "current element #3").toBe("p2");
    survey.currentElementName = "nothing";
    expect(survey.currentElementName, "current element name #3_2").toBe("p2");
    expect(survey.currentElement.name, "current element #3_2").toBe("p2");
    survey.questionsOnPageMode = "questionPerPage";
    expect(survey.currentElementName, "current element name #4").toBe("q1_1");
    expect(survey.currentElement.name, "current element #4").toBe("q1_1");
    survey.currentElementName = "q3_2";
    expect(survey.currentElementName, "current element name #5").toBe("q3_2");
    expect(survey.currentElement.name, "current element #5").toBe("q3_2");
    survey.currentElementName = "p1";
    expect(survey.currentElementName, "current element name #6").toBe("q1_1");
    expect(survey.currentElement.name, "current element #6").toBe("q1_1");
    survey.questionsOnPageMode = "inputPerPage";
    survey.currentElementName = "q2_1";
    expect(survey.currentElementName, "current element name #7").toBe("q2_1");
    expect(survey.currentElement.name, "current element #7").toBe("q2_1");
    survey.currentElementName = "p3";
    expect(survey.currentElementName, "current element name #8").toBe("q3_1");
    expect(survey.currentElement.name, "current element #8").toBe("q3_1");
    survey.currentElementName = "nothing";
    expect(survey.currentElementName, "current element name #9").toBe("q3_1");
    expect(survey.currentElement.name, "current element #9").toBe("q3_1");
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
    expect(page.name, "page2 is the current page").toBe("page2");
    expect(survey.currentSingleQuestion.name, "question2 is the current question").toBe("question2");
    expect(page.rows.length, "one row").toBe(1);
    expect(page.rows[0].elements.length, "one element in the row").toBe(1);
    expect(page.rows[0].elements[0].name, "question2 is the current question in the row").toBe("question2");
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
    expect(survey.currentPage.name, "page2 is the current page").toBe("page3");
    expect(survey.currentSingleElement.name, "panel1 is the current element").toBe("panel1");
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
    expect(survey.currentPage.name, "page1 is the current page, #1").toBe("page1");
    expect(survey.currentSingleElement.name, "panel1 is the current element, #1").toBe("panel1");
    survey.performNext();
    expect(survey.currentPage.name, "page1 is the current page, #2").toBe("page1");
    expect(survey.currentSingleElement.name, "panel1 is the current element, #2").toBe("panel1");
    const panel = survey.getPanelByName("panel1");
    expect(panel.errors.length, "panel has one error").toBe(1);
    panel.getQuestionByName("q1").value = "val1";
    survey.performNext();
    expect(panel.errors.length, "panel has no errors").toBe(0);
    expect(survey.currentPage.name, "page2 is the current page, #3").toBe("page2");
    expect(survey.currentSingleElement.name, "q3 is the current element").toBe("q3");
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
    expect(survey.currentSingleQuestion.name, "current question, #1").toBe("q1");
    q1.value = "abcd";
    survey.performNext();
    expect(survey.currentSingleQuestion.name, "current question, #2").toBe("q1");
    returnResultFunc(false);
    expect(survey.currentSingleQuestion.name, "current question, #3").toBe("q1");
    q1.value = "abc";
    survey.performNext();
    expect(survey.currentSingleQuestion.name, "current question, #4").toBe("q1");
    returnResultFunc(true);
    expect(survey.currentSingleQuestion.name, "current question, #5").toBe("q2");

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
    expect(survey.currentSingleElement.name, "current question, #1").toBe("panel1");
    q1.value = "abcd";
    survey.performNext();
    expect(survey.currentSingleElement.name, "current question, #2").toBe("panel1");
    returnResultFunc(false);
    expect(survey.currentSingleElement.name, "current question, #3").toBe("panel1");
    q1.value = "abc";
    survey.performNext();
    expect(survey.currentSingleElement.name, "current question, #4").toBe("panel1");
    returnResultFunc(true);
    expect(survey.currentSingleElement.name, "current question, #5").toBe("q2");

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
    expect(survey.getAllQuestions().length, "2 root questions in the survey").toBe(2);
    const questions = survey.getAllQuestions(true, false, true);
    expect(questions.length, "3 questions in the survey").toBe(3);
    expect(questions[2].name, "the last question is nested").toBe("q3");
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

    expect(getContainerContent("header"), "header is empty").toEqual([]);
    expect(getContainerContent("center"), "progress + toc in center").toEqual([{
      "component": "sv-progress-questions",
      "id": "progress-questions",
      "index": -150
    }]);
    expect(getContainerContent("footer"), "footer is empty").toEqual([]);
    expect(getContainerContent("contentTop"), "header in content top").toEqual([{
      "component": "sv-header",
      "container": "header",
      "id": "advanced-header",
      "index": -100
    }]);
    expect(getContainerContent("contentBottom"), "nav buttons in content bottom").toEqual([{
      "component": "sv-action-bar",
      "id": "buttons-navigation"
    }]);
    expect(getContainerContent("left"), "show toc left").toEqual([{
      "component": "sv-navigation-toc",
      "id": "toc-navigation"
    }]);
    expect(getContainerContent("right"), "right is empty").toEqual([]);
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
    expect(reportTexts, "show warnings with the quesiton info").toEqual(["Unknown function name: 'invalFunc1'. It is used in the question: 'q1'.",
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

    expect(reportText, "show warnings with the quesiton info").toBe("Invalid expression: '{a} ++'. It is used in the question: 'q1'.");
    ConsoleWarnings.warn = prev;
  });
  test("Do not serialize mode:display property, #10281", () => {
    const survey1 = new SurveyModel({ readOnly: true });
    expect(survey1.mode, "mode #1").toBe("display");
    expect(survey1.readOnly, "readOnly #1").toBe(true);
    const survey2 = new SurveyModel({ mode: "display" });
    expect(survey2.mode, "mode #2").toBe("display");
    expect(survey2.readOnly, "readOnly #2").toBe(true);
    const survey3 = new SurveyModel();
    survey3.readOnly = true;
    expect(survey3.mode, "mode #3").toBe("display");
    expect(survey3.readOnly, "readOnly #3").toBe(true);
    survey3.readOnly = false;
    expect(survey3.mode, "mode #4").toBe("edit");
    expect(survey3.readOnly, "readOnly #4").toBe(false);
    survey3.readOnly = true;
    expect(survey3.toJSON(), "survey3 is serialized correctly").toEqual({
      readOnly: true
    });
  });
  test("Do not allow to set name vs |, #10424", () => {
    const page = new PageModel("p1|mode");
    expect(page.name, "the | is removed, #1").toBe("p1mode");
    page.name = "p2|mode";
    expect(page.name, "the | is removed, #2").toBe("p2mode");
    const panel = new PanelModel("p1|mode");
    expect(panel.name, "the | is removed, #3").toBe("p1mode");
    panel.name = "p2|mode";
    expect(panel.name, "the | is removed, #4").toBe("p2mode");
    const question = new QuestionTextModel("q1|mode");
    expect(question.name, "the | is removed, #5").toBe("q1mode");
    question.name = "q2|mode";
    expect(question.name, "the | is removed, #6").toBe("q2mode");
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
    expect((survey.navigationBar as CustomNavigationBar).customProp1, "customProp1 is set correctly").toBe("checkThisProp");
    expect(survey.navigationBar.locOwner, "locOwner is set correctly").toBe(survey);
  });
  test("Do not create layoutElements in creator", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" }
      ]
    });
    let le = survey.getPropertyValue("layoutElements");
    expect(le?.length, "There is no layout elements in survey").toBeUndefined();
    const progressElement = survey.findLayoutElement("progress-questions");
    expect(progressElement.id, "There is no progress-questions layout element in survey").toBe("progress-questions");
    le = survey.getPropertyValue("layoutElements");
    expect(le.length > 3, "There is  layout elements in survey after finding layout element").toBe(true);
  });
  test("Do not create timerValue in contructor", () => {
    const survey: any = new SurveyModel();
    expect(survey.timerModelValue, "timerValue is undefined").toBeUndefined();
    expect(survey.timerModel.isRunning, "timerModel is not started").toBe(false);
    expect(survey.timerModelValue, "timerValue is not undefined").toBeTruthy();
  });
  test("Do not create notifierValue in contructor", () => {
    const survey: any = new SurveyModel();
    expect(survey.notifierValue, "notifierValue is undefined").toBeUndefined();
    survey.notify("abc");
    expect(survey.notifierValue, "notifierValue is not undefined").toBeTruthy();
  });
  test("Make array properties on demand", () => {
    const survey: any = new SurveyModel();
    expect(survey.getPropertyValue("triggers"), "triggers is undefined on loading").toBeUndefined();
    expect(survey.getPropertyValue("calculatedValues"), "calculatedValues is undefined on loading").toBeUndefined();
    expect(survey.getPropertyValue("completedHtmlOnCondition"), "completedHtmlOnCondition is undefined on loading").toBeUndefined();
    expect(survey.getPropertyValue("navigateToUrlOnCondition"), "navigateToUrlOnCondition is undefined on loading").toBeUndefined();
    survey.toJSON();
    expect(survey.getPropertyValue("triggers"), "triggers is undefined after serialization").toBeUndefined();
    expect(survey.getPropertyValue("calculatedValues"), "calculatedValues is undefined after serialization").toBeUndefined();
    expect(survey.getPropertyValue("completedHtmlOnCondition"), "completedHtmlOnCondition is undefined after serialization").toBeUndefined();
    expect(survey.getPropertyValue("navigateToUrlOnCondition"), "navigateToUrlOnCondition is undefined after serialization").toBeUndefined();
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
    expect(q1.visible, "q1 is invisible by default").toBe(false);
    expect(q2.visible, "q2 is visible by default").toBe(true);
    expect(q3.visibleChoices.length, "q3 has two visible choices by default").toBe(2);
    survey.locale = "de";
    expect(q1.visible, "q1 is visible after locale change to 'de'").toBe(true);
    expect(q2.visible, "q2 is visible after locale change to 'de'").toBe(true);
    expect(q3.visibleChoices.length, "q3 has three visible choices after locale change to 'de'").toBe(3);
    survey.readOnly = true;
    expect(q1.visible, "q1 is visible after making survey readOnly").toBe(true);
    expect(q2.visible, "q2 is invisible after making survey readOnly").toBe(false);
    expect(q3.visibleChoices.length, "q3 has two visible choices after making survey readOnly").toBe(2);
    survey.readOnly = false;
    expect(q1.visible, "q1 is visible after making survey readOnly").toBe(true);
    expect(q2.visible, "q2 is visible after making survey readOnly").toBe(true);
    expect(q3.visibleChoices.length, "q3 has three visible choices after making survey readOnly").toBe(3);
    survey.locale = "";
    expect(q1.visible, "q1 is invisible after locale change to ''").toBe(false);
    expect(q2.visible, "q2 is visible after locale change to ''").toBe(true);
    expect(q3.visibleChoices.length, "q3 has two visible choices after locale change to ''").toBe(2);
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
    expect(q2.isVisible, "q2 is invisible initially, q1 is empty").toBe(false);
    q1.value = 20;
    expect(q1.errors.length, "q1 has no errors, value=20 >= min=10").toBe(0);
    expect(q2.isVisible, "q2 is visible, q1=20 and no errors").toBe(true);
    q1.value = 5;
    expect(q1.errors.length, "q1 has error, value=5 < min=10").toBe(1);
    expect(q2.isVisible, "q2 is invisible, q1=5 contains errors").toBe(false);
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
    expect(panel1.isVisible, "panel1 is invisible initially, q1 is empty").toBe(false);
    q1.value = 20;
    expect(q1.errors.length, "q1 has no errors, value=20 >= min=10").toBe(0);
    expect(panel1.isVisible, "panel1 is visible, q1=20 and no errors").toBe(true);
    q1.value = 5;
    expect(q1.errors.length, "q1 has error, value=5 < min=10").toBe(1);
    expect(panel1.isVisible, "panel1 is invisible, q1=5 contains errors").toBe(false);
  });
});
