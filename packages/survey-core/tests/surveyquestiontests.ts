import { Question } from "../src/question";
import { QuestionHtmlModel } from "../src/question_html";
import { QuestionFactory } from "../src/questionfactory";
import { QuestionSelectBase } from "../src/question_baseselect";
import { QuestionTextModel } from "../src/question_text";
import { QuestionCommentModel } from "../src/question_comment";
import { SurveyModel } from "../src/survey";
import { QuestionCheckboxModel } from "../src/question_checkbox";
import { QuestionTagboxModel } from "../src/question_tagbox";
import { QuestionMatrixModel, MatrixRowModel } from "../src/question_matrix";
import {
  MultipleTextItemModel,
  QuestionMultipleTextModel,
} from "../src/question_multipletext";
import {
  NumericValidator,
  AnswerCountValidator,
  RegexValidator,
  ExpressionValidator,
} from "../src/validator";
import { QuestionRadiogroupModel } from "../src/question_radiogroup";
import { QuestionRankingModel } from "../src/question_ranking";
import { QuestionDropdownModel } from "../src/question_dropdown";
import { QuestionRatingModel } from "../src/question_rating";
import { QuestionBooleanModel } from "../src/question_boolean";
import { JsonObject, Serializer } from "../src/jsonobject";
import { ItemValue } from "../src/itemvalue";
import { QuestionMatrixDropdownModel } from "../src/question_matrixdropdown";
import { surveyLocalization } from "../src/surveyStrings";
import { settings } from "../src/settings";
import { QuestionImagePickerModel } from "../src/question_imagepicker";
import { FunctionFactory, registerFunction } from "../src/functionsfactory";
import { Base, ArrayChanges, IPropertyArrayValueChangedEvent } from "../src/base";
import { RequreNumericError } from "../src/error";
import { QuestionMatrixDropdownModelBase } from "../src/question_matrixdropdownbase";
import { PanelModel } from "../src/panel";
import { Helpers } from "../src/helpers";
import { CustomWidgetCollection } from "../src/questionCustomWidgets";
import { ConsoleWarnings } from "../src/console-warnings";
import { surveyTimerFunctions } from "../src/surveytimer";
import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { setOldTheme } from "./oldTheme";
import { SurveyError } from "../src/survey-error";
import { describe, test, expect } from "vitest";
describe("Survey_Questions", () => {
  settings.autoAdvanceDelay = 0;

  class QuestionMatrixRandomModel extends QuestionMatrixModel {
    constructor(name: string) {
      super(name);
    }
    protected sortVisibleRows(
      array: Array<MatrixRowModel>
    ): Array<MatrixRowModel> {
      return array.length > 0 ? [array[1], array[0]] : array;
    }
  }

  test("Only some questions support comment", () => {
    var questionText = <Question>(
    QuestionFactory.Instance.createQuestion("text", "textQuestion")
  );

    expect(questionText.supportComment(), "Text question doesn't support comment.").toBe(false);
    expect(questionText.showCommentArea, "Text question doesn't support comment.").toBe(false);
    questionText.showCommentArea = true;
    expect(questionText.showCommentArea, "You can't set has comment to the text question.").toBe(false);

    var questionDropDown = <Question>(
    QuestionFactory.Instance.createQuestion("dropdown", "dropdownQuestion")
  );
    expect(questionDropDown.supportComment(), "Drop down question supports comment.").toBe(true);
    expect(questionDropDown.showCommentArea, "Has comment is false by  default.").toBe(false);
    questionDropDown.showCommentArea = true;
    expect(questionDropDown.showCommentArea, "You can set comment for drop down question.").toBe(true);
  });
  test("Only some questions support other", () => {
    var questionImagePicker = <Question>(
    QuestionFactory.Instance.createQuestion("imagepicker", "imagePickerQuestion")
  );

    expect(questionImagePicker.supportOther(), "Text question doesn't support other.").toBe(false);
    expect(questionImagePicker.showOtherItem, "Text question doesn't support other.").toBe(false);
    questionImagePicker.showOtherItem = true;
    expect(questionImagePicker.showOtherItem, "You can't set has other to the text question.").toBe(false);

    var questionDropDown = <Question>(
    QuestionFactory.Instance.createQuestion("dropdown", "dropdownQuestion")
  );
    expect(questionDropDown.supportOther(), "Drop down question supports other.").toBe(true);
    expect(questionDropDown.showOtherItem, "Has other is false by  default.").toBe(false);
    questionDropDown.showOtherItem = true;
    expect(questionDropDown.showOtherItem, "You can set other for drop down question.").toBe(true);
  });
  test("Comment and other could not be set together", () => {
    var questionDropDown = <Question>(
    QuestionFactory.Instance.createQuestion("dropdown", "dropdownQuestion")
  );
    expect(questionDropDown.showCommentArea, "Initial comment is turn off.").toBe(false);
    expect(questionDropDown.showOtherItem, "Initial other is turn off.").toBe(false);

    questionDropDown.showOtherItem = true;
    expect(questionDropDown.showOtherItem, "set initially other to true").toBe(true);

    questionDropDown.showCommentArea = true;
    expect(questionDropDown.showCommentArea, "After set comment to true").toBe(true);
    expect(questionDropDown.showOtherItem, "After set comment to true, behavior is changed").toBe(true);

    questionDropDown.showOtherItem = true;
    expect(questionDropDown.showCommentArea, "After set other to true, behavior is changed").toBe(true);
    expect(questionDropDown.showOtherItem, "After set other to true").toBe(true);
  });
  test("Keep comment if question value is null", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("p1");
    var question = <QuestionCheckboxModel>page.addNewQuestion("checkbox", "q1");
    question.choices = [1, 2, 3];
    question.showCommentArea = true;
    question.comment = "Comment";
    expect(survey.data, "Comment is here").toEqual({ "q1-Comment": "Comment" });
    survey.doComplete();
    expect(survey.data, "Comment is still here after complete").toEqual({ "q1-Comment": "Comment" });
  });
  test("set choices from another question", () => {
    Serializer.addProperty("itemvalue", "price");
    var q1 = new QuestionSelectBase("q1");
    q1.choices = [{ value: 1, text: "One", price: 4 }, "Two", "Three"];
    var q2 = new QuestionSelectBase("q2");
    q2.choices = q1.choices;
    expect(q2.choices.length, "all three were copied").toBe(3);
    expect(q2.choices[0]["price"], "additional data is copied").toBe(4);
    Serializer.removeProperty("itemvalue", "price");
  });
  test("visibleChoices changes on setting others to true/false", () => {
    var question = new QuestionSelectBase("dropdownQuestion");
    question.choices = ["One", "Two", "Three"];
    expect(question.visibleChoices.length, "By default visibleChoices equals to choices").toBe(3);
    question.showOtherItem = true;
    expect(question.visibleChoices.length, "Add one more item for others").toBe(4);
    question.showOtherItem = false;
    expect(question.visibleChoices.length, "Remove the others item").toBe(3);
  });
  test("displayValue function for selecteBase questions, issue #483", () => {
    var question = new QuestionSelectBase("dropdownQuestion");
    question.choices = [
      { value: 1, text: "Value 1" },
      { value: 2, text: "Value 2" },
    ];
    question.showOtherItem = true;
    expect(question.displayValue, "value is null, displayValue is empty").toBe("");
    question.value = 1;
    expect(question.displayValue, "the first value is selected").toBe("Value 1");
    question.value = 2;
    expect(question.displayValue, "the second value is selected").toBe("Value 2");
    question.value = 3;
    expect(question.displayValue, "there is no value in the list, so show the value").toBe(3);
    question.value = question.otherItem.value;
    expect(question.displayValue, "the other is selected").toBe(question.locOtherText.textOrHtml);
  });
  test("displayValue changed simultaniously with value", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("p");
    var question = new QuestionSelectBase("dropdownQuestion");
    question.choices = [
      { value: 1, text: "Value 1" },
      { value: 2, text: "Value 2" },
    ];
    page.addElement(question);
    expect(question.displayValue, "Empty value").toBe("");
    question.value = 1;
    expect(question.displayValue, "value is 1").toBe("Value 1");
    survey.setValue("dropdownQuestion", 2);
    expect(question.displayValue, "value is 2").toBe("Value 2");
  });
  test("displayValue & defaultDisplayValue", () => {
    var survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1", defaultDisplayValue: "UnsetQ1" },
        { type: "text", name: "q2", title: "{q1}" },
      ]
    });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    expect(q1.displayValue, "q1.displayValue is correct, #1").toBe("UnsetQ1");
    expect(q2.locTitle.textOrHtml, "q2.title is correct, #1").toBe("UnsetQ1");
    q1.value = "Q1";
    expect(q1.displayValue, "q1.displayValue is correct, #2").toBe("Q1");
    expect(q2.locTitle.textOrHtml, "q2.title is correct, #2").toBe("Q1");
    q1.clearValue();
    expect(q1.displayValue, "q1.displayValue is correct, #3").toBe("UnsetQ1");
    expect(q2.locTitle.textOrHtml, "q2.title is correct, #3").toBe("UnsetQ1");
  });
  test("displayValue & defaultDisplayValue & multiple language", () => {
    var survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1", defaultDisplayValue: { default: "UnsetQ1", de: "UnsetQ1-de" } },
        { type: "text", name: "q2", title: "{q1}" },
      ]
    });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    expect(q1.displayValue, "q1.displayValue is correct, #1").toBe("UnsetQ1");
    expect(q2.locTitle.textOrHtml, "q2.title is correct, #1").toBe("UnsetQ1");
    survey.locale = "de";
    expect(q1.displayValue, "q1.displayValue is correct, #2").toBe("UnsetQ1-de");
    expect(q2.locTitle.textOrHtml, "q2.title is correct, #2").toBe("UnsetQ1-de");
    survey.locale = "";
    expect(q1.displayValue, "q1.displayValue is correct, #3").toBe("UnsetQ1");
    expect(q2.locTitle.textOrHtml, "q2.title is correct, #3").toBe("UnsetQ1");
  });
  test("displayValue function for rating question, issue #1094", () => {
    var question = new QuestionRatingModel("q1");
    question.rateValues = [
      { value: 1, text: "Value 1" },
      { value: 2, text: "Value 2" },
    ];
    expect(question.displayValue, "value is null, displayValue is empty").toBe("");
    question.value = 1;
    expect(question.displayValue, "the first value is selected").toBe("Value 1");
    question.value = 2;
    expect(question.displayValue, "the second value is selected").toBe("Value 2");
    question.value = 3;
    expect(question.displayValue, "there is no value in the list, so show the value").toBe(3);
  });
  test("matrix.displayValue, bug #1087", () => {
    var question = new QuestionMatrixModel("q1");
    question.rows = [
      { value: 1, text: "Row 1" },
      { value: 2, text: "Row 2" },
    ];
    question.columns = [
      { value: 1, text: "Column 1" },
      { value: 2, text: "Column 2" },
    ];
    question.value = { 1: 1, 2: 2 };
    expect(question.displayValue, "matrix question displayValue works correctly").toEqual({ "Row 1": "Column 1", "Row 2": "Column 2" });
  });
  test("Question Title property", () => {
    var question = new QuestionTextModel("q1");
    expect(question.title, "get the question name by default").toBe("q1");
    question.title = "My title";
    expect(question.title, "get the question name by default").toBe("My title");
  });
  test("Question titleLocation", () => {
    var survey = new SurveyModel();
    survey.showQuestionNumbers = "on";
    var page = survey.addNewPage("Page 1");
    var question1 = new QuestionTextModel("q1");
    var question2 = new QuestionTextModel("q1");
    page.addQuestion(question1);
    page.addQuestion(question2);
    expect(question1.hasTitle, "By default it has title").toBe(true);
    expect(question1.hasTitleOnTop, "By default it has title on top").toBe(true);
    expect(question2.visibleIndex, "the second question has visible index 1").toBe(1);
    question1.titleLocation = "hidden";
    expect(question1.hasTitle, "Title is hidden").toBe(false);
    expect(question1.hasTitleOnTop, "It doesn't show on top").toBe(false);
    expect(question2.visibleIndex, "the second question has visible index 0 now").toBe(0);
  });
  test("Question title is successfully controlled by the showTitle property", () => {
    const survey = new SurveyModel();
    const page = survey.addNewPage("Page 1");
    const question1 = new QuestionTextModel("q1");
    page.addQuestion(question1);
    expect(question1.hasTitle, "Question has a title by default").toBe(true);
    expect(question1.titleLocation, "Question titleLocation is 'default' by default").toBe("default");
    question1.showTitle = false;
    expect(question1.hasTitle, "showTitle = false hides the question title").toBe(false);
    expect(question1.titleLocation, "showTitle = false sets titleLocation to 'hidden'").toBe("hidden");
    question1.showTitle = true;
    expect(question1.hasTitle, "showTitle = true shows the question title").toBe(true);
    expect(question1.titleLocation, "showTitle = true sets titleLocation to 'default'").toBe("default");
    question1.titleLocation = "hidden";
    expect(question1.showTitle, "titleLocation = 'hidden' sets showTitle to false").toBe(false);
    question1.titleLocation = "top";
    expect(question1.showTitle, "titleLocation different from 'hidden' sets showTitle to true").toBe(true);
  });
  test("Question titleDescription", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("Page 1");
    var question1 = new QuestionTextModel("q1");
    var question2 = new QuestionTextModel("q1");
    page.addQuestion(question1);
    page.addQuestion(question2);
    question1.description = "description";
    expect(question1.hasDescriptionUnderTitle, "There is the description in question1").toBe(true);
    question2.description = "description";
    question2.descriptionLocation = "underInput";
    expect(question2.hasDescriptionUnderTitle, "question2-underInput").toBe(false);
    expect(question2.hasDescriptionUnderInput, "question2-underInput").toBe(true);
    survey.questionDescriptionLocation = "underInput";
    expect(question1.hasDescriptionUnderTitle, "survey.questionDescriptionLocation = 'underInput'").toBe(false);
    expect(question1.hasDescriptionUnderInput, "survey.questionDescriptionLocation = 'underInput'").toBe(true);
    question2.descriptionLocation = "hidden";
    expect(question2.hasDescriptionUnderTitle, "question2 hidden - underTitle").toBe(false);
    expect(question2.hasDescriptionUnderInput, "question2 hidden - underInput").toBe(false);
    survey.questionDescriptionLocation = "hidden";
    question1.descriptionLocation = "default";
    expect(question1.hasDescriptionUnderTitle, "survey hidden - underTitle").toBe(false);
    expect(question1.hasDescriptionUnderInput, "survey hidden - underInput").toBe(false);
  });
  test("Use value of checkbox question as an array", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("Page 1");
    var question = new QuestionCheckboxModel("checkboxQuestion");
    question.choices = ["One", "Two", "Three"];
    page.addQuestion(question);

    question.value.push("One");
    expect([...(question.value)], "convert value to array").toEqual(["One"]);
  });
  test("Assign the same empty value", () => {
    var count = 0;
    var question = new QuestionCheckboxModel("checkboxQuestion");
    expect([...(question.value)], "convert value to array").toEqual([]);

    question.valueChangedCallback = function () {
      count++;
    };

    question.value = undefined;
    expect(count, "valueChangedCallback doesn't trigger with undefined").toBe(0);

    question.value = [];
    expect(count, "valueChangedCallback doesn't trigger with empty array").toBe(0);

    question.value = [1];
    expect(count, "valueChangedCallback triggers").toBe(1);

    question.value = [1];
    expect(count, "array the same").toBe(1);

    question.value = [1, 2];
    expect(count, "valueChangedCallback triggers").toBe(2);
  });
  test("Pre-proccess value for Checkbox", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("Page 1");
    var question = new QuestionCheckboxModel("checkboxQuestion");
    question.choices = ["One", "Two", "Three"];
    page.addQuestion(question);

    survey.setValue("checkboxQuestion", "One");
    expect([...(question.value)], "convert value to array").toEqual(["One"]);
  });
  test("Empty value for Checkbox", () => {
    var question = new QuestionCheckboxModel("checkboxQuestion");
    question.choices = ["One", "Two", "Three"];
    expect([...(question.value)], "empty array").toEqual([]);
    question.value = ["One"];
    expect([...(question.value)], "value").toEqual(["One"]);
    question.value = [];
    expect([...(question.value)], "empty array").toEqual([]);
  });
  test("Matrix Question: visible rows", () => {
    var matrix = new QuestionMatrixModel("q1");
    expect(matrix.hasRows, "There is now rows by default.").toBe(false);
    expect(matrix.visibleRows.length, "There are no rows").toBe(0);
    matrix.rows = ["row1", "row2"];
    expect(matrix.hasRows, "There are two rows").toBe(true);
    expect(matrix.visibleRows.length, "Use the added row").toBe(2);
    expect(matrix.visibleRows[0].name, "the row name is 'row1'").toBe("row1");
    expect(matrix.visibleRows[0].fullName, "The default row fullName is the question name").toBe(matrix.id + "_row1");
  });
  test("Matrix Question: get/set values for empty rows", () => {
    var matrix = new QuestionMatrixModel("q1");
    matrix.rows = ["row1"];
    matrix.columns = ["col1", "col2"];
    expect(matrix.value, "the matrix initial value").toBeUndefined();
    matrix.value = { row1: "col1" };
    expect(matrix.value, "the matrix value changed correctly").toEqual({ row1: "col1" });
  });
  test("Matrix Question: get/set values for two rows", () => {
    var matrix = new QuestionMatrixModel("q1");
    matrix.rows = ["row1", "row2"];
    matrix.columns = ["col1", "col2"];
    matrix.value = { row1: "col1" };
    var rows = matrix.visibleRows;
    expect(rows[0].value, "set the row value correctly").toBe("col1");
    rows[0].value = "col2";
    expect(rows[0].value, "the row value changed").toBe("col2");
    expect(matrix.value, "the matrix value changed correctly, #1").toEqual({ row1: "col2" });
    rows[1].value = "col1";
    expect(matrix.value, "the matrix value changed correctly, #2").toEqual({ row1: "col2", row2: "col1" });
  });
  test("Matrix Question set values after visible row generated", () => {
    var matrix = new QuestionMatrixModel("q1");
    matrix.rows = ["row1", "row2"];
    matrix.columns = ["col1", "col2"];
    var rows = matrix.visibleRows;
    matrix.value = { row1: "col1" };
    expect(rows[0].value, "set the row value correctly").toBe("col1");
  });
  test("Matrix Question sortVisibleRows", () => {
    var matrix = new QuestionMatrixRandomModel("q1");
    matrix.rowOrder = "random";
    matrix.rows = ["row1", "row2"];
    matrix.columns = ["col1", "col2"];
    var rows = matrix.visibleRows;
    expect(rows[0].name, "rows has been reordered").toBe("row2");
  });
  test("Matrix Question supportAutoAdvance property", () => {
    var matrix = new QuestionMatrixModel("q1");
    matrix.rows = ["row1", "row2"];
    matrix.columns = ["col1", "col2"];
    expect(matrix.supportAutoAdvance(), "Rows are not set").toBe(false);
    matrix.onMouseDown();
    matrix.value = { row1: "col1" };
    expect(matrix.supportAutoAdvance(), "The second row is not set").toBe(false);
    matrix.onMouseDown();
    matrix.value = { row1: "col1", row2: "col1" };
    matrix.onMouseDown();
    expect(matrix.supportAutoAdvance(), "Both rows are set").toBe(true);
  });
  test("Matrix Question clearIncorrectValues", () => {
    var matrix = new QuestionMatrixModel("q1");
    matrix.rows = ["row1", "row2"];
    matrix.columns = ["col1", "col2"];
    matrix.value = { row1: "col2", row2: "col3", row3: "col1" };
    matrix.clearIncorrectValues();

    expect(matrix.value, "Remove values with incorrect row and incorrect column").toEqual({ row1: "col2" });
  });
  test("Multiple Text Item: text property", () => {
    var mItem = new MultipleTextItemModel("text1");
    expect(mItem.title, "get value from name").toBe("text1");
    mItem.title = "display1";
    expect(mItem.title, "get value from textValue").toBe("display1");
  });
  test("Multiple Text Question: get/set values for two texts", () => {
    var mText = new QuestionMultipleTextModel("q1");
    mText.items.push(new MultipleTextItemModel("text1"));
    mText.items.push(new MultipleTextItemModel("text2"));
    mText.value = { text1: "val1" };
    expect(mText.items[0].value, "get the value from the question").toBe("val1");
    mText.items[1].value = "val2";
    expect(mText.value, "set the value from the text item").toEqual({ text1: "val1", text2: "val2" });
  });
  test("Multiple Text Question: get/set values and properties via question text", () => {
    var mText = new QuestionMultipleTextModel("q1");
    mText.items.push(new MultipleTextItemModel("text1"));
    mText.items.push(new MultipleTextItemModel("text2"));
    mText.value = { text1: "val1" };
    expect(mText.items[0].editor, "question has been created").toBeTruthy();
    expect(mText.items[0].editor.value, "the value is set correctly from the mText").toBe("val1");
    mText.items[0].editor.value = "newValue";
    expect(mText.value, "can set the value from question").toEqual({ text1: "newValue" });
    mText.items[0].title = "my title";
    expect(mText.items[0].editor.title, "Title was set correctly").toBe("my title");
  });
  test("Multiple Text Question: support autoAdvanceEnabled", () => {
    var mText = new QuestionMultipleTextModel("q1");
    mText.items.push(new MultipleTextItemModel("text1"));
    mText.items.push(new MultipleTextItemModel("text2"));

    expect(mText.supportAutoAdvance(), "all text are empty").toBe(false);
    mText.value = { tex1: "val1" };
    expect(mText.supportAutoAdvance(), "The second text is empty").toBe(false);
    mText.value = { text1: "val1", text2: "val2" };
    expect(mText.supportAutoAdvance(), "Both text inputs are set").toBe(true);
  });
  test("Use timer to go next page", () => {
    settings.autoAdvanceDelay = 250;
    const json = {
      pages: [
        {
          elements: [
            {
              type: "radiogroup",
              name: "q1",
              choices: ["a", "b", "c"],
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
      autoAdvanceEnabled: true,
    };
    const prevFunc = surveyTimerFunctions.safeTimeOut;
    let checkDelay: number = 0;
    surveyTimerFunctions.safeTimeOut = (func:() => any, delay: number): number => {
      checkDelay = delay;
      func();
      return 0;
    };
    const survey = new SurveyModel(json);
    expect(survey.goNextPageAutomatic, "The property set correctly").toBe(true);
    const question = survey.getQuestionByName("q1");
    question.onMouseDown();
    expect(question.supportAutoAdvance(), "questio support go next page automatic").toBe(true);
    question.value = "a";
    expect(survey.currentPageNo, "Go to the second page").toBe(1);
    expect(checkDelay, "setTimeout function is called").toBe(250);
    surveyTimerFunctions.safeTimeOut = prevFunc;
    settings.autoAdvanceDelay = 0;
  });
  test("Radiogroup Question: support autoAdvanceEnabled + showOtherItem", () => {
    var json = {
      pages: [
        {
          elements: [
            {
              type: "radiogroup",
              name: "q1",
              showOtherItem: true,
              choices: [1, 2, 3],
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
      autoAdvanceEnabled: true,
    };
    const survey = new SurveyModel(json);
    const question = <QuestionRadiogroupModel>survey.getQuestionByName("q1");
    question.value = "other";
    expect(survey.currentPageNo, "Stay on the first page").toBe(0);
    question.otherValue = "123";
    expect(survey.currentPageNo, "Still stay on the page").toBe(0);
    question.onMouseDown();
    question.value = 2;
    expect(survey.currentPageNo, "Go to the next page").toBe(1);
  });

  test("Radiogroup Question: support autoAdvanceEnabled + showOtherItem + textUpdateMode = onTyping", () => {
    var json = {
      pages: [
        {
          elements: [
            {
              type: "radiogroup",
              name: "q1",
              showOtherItem: true,
              choices: [1, 2, 3],
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
    question.value = "other";
    expect(survey.currentPageNo, "Stay on the first page").toBe(0);
    question.otherValue = "123";
    expect(survey.currentPageNo, "Still stay on the first page").toBe(0);
  });

  test("Validators for text question + getAllErrors", () => {
    var mText = new QuestionTextModel("");
    expect(mText.validate(), "There is no error by default").toBe(true);
    mText.validators.push(new NumericValidator(10, 20));
    expect(mText.validate(), "There is no error since the value is empty").toBe(true);
    expect(mText.getAllErrors().length, "There is no error at all").toBe(0);
    mText.value = "ss";
    expect(mText.validate(), "The value should be numeric").toBe(false);
    expect(mText.getAllErrors().length, "There is an error").toBe(1);
    mText.value = 25;
    expect(mText.validate(), "The value should be between 10 and 20").toBe(false);
    mText.value = "15";
    expect(mText.validate(), "The value is fine now.").toBe(true);
    expect(mText.value, "Convert to numeric").toBe("15");
  });
  test("Numeric validation and with 0, Bug #462", () => {
    var mText = new QuestionTextModel("");
    mText.validators.push(new NumericValidator(1, 100));
    mText.value = 0;
    expect(mText.validate(), "0 is less than 1").toBe(false);
  });
  test("Use Email validator for inputType = email", () => {
    var mText = new QuestionTextModel("");
    expect(mText.validators.length).toBe(0);
    mText.inputType = "email";
    mText.value = "1";
    expect(mText.validators.length, "There is no validators").toBe(0);
    expect(mText.validate(), "Email is wrong").toBe(false);
  });

  test("Validators for multiple text question", () => {
    var mText = new QuestionMultipleTextModel("q1");
    mText.items.push(new MultipleTextItemModel("t1"));
    expect(mText.validate(), "There is no error by default").toBe(true);
    expect(mText.getAllErrors().length, "There is no error at all").toBe(0);
    mText.items[0].validators.push(new NumericValidator(10, 20));
    mText.value = { t1: "ss" };
    expect(mText.validate(), "The value should be numeric").toBe(false);
    expect(mText.getAllErrors().length, "There is error in one item").toBe(1);
    mText.value = { t1: 25 };
    expect(mText.validate(), "The value should be between 10 and 20").toBe(false);
    mText.value = { t1: 15 };
    expect(mText.validate(), "The value is fine now.").toBe(true);
    expect(mText.items[0].value, "Convert to numeric").toBe(15);
  });
  test("Validators for array value question", () => {
    var question = new QuestionCheckboxModel("q1");
    question.choices = ["item1", "item2", "item3", "item4", "item5"];
    question.value = ["item1"];
    expect(question.validate(), "There is no error by default").toBe(true);
    question.validators.push(new AnswerCountValidator(2, 3));
    question.value = ["item1"];
    expect(question.validate(), "It should be at least two items selected").toBe(false);
    question.value = ["item1", "item2", "item3"];
    expect(question.validate(), "There is one item in value").toBe(true);
    question.value = ["item1", "item2", "item3", "item4"];
    expect(question.validate(), "It should be less than 3 items").toBe(false);
    question.value = ["item1", "item3"];
    expect(question.validate(), "There is two items in value").toBe(true);
  });
  test("validator.toString()", () => {
    var validator = new RegexValidator("[0-9]+");
    expect(validator.toString(), "validator type").toBe("regex");
    validator.text = "incorrect number";
    expect(validator.toString(), "validator type + text").toBe("regex, incorrect number");
  });

  test("Validators for other values - dropdown, Bug #722", () => {
    var question = new QuestionDropdownModel("q1");
    question.choices = ["1", "2", "3", "4", "5"];
    question.showOtherItem = true;
    question.value = "1";
    expect(question.validate(), "There is no validators").toBe(true);
    question.validators.push(new RegexValidator("[0-9]+"));
    expect(question.validate(), "There is no error, 1 is fine").toBe(true);
    question.value = question.otherItem.value;
    question.otherValue = "aaa";
    expect(question.validate(), "The comment doesn't math the regex").toBe(false);
    question.otherValue = "222";
    expect(question.validate(), "The comment math the regex").toBe(true);
  });
  test("Validators for other values - checkbox, Bug #722", () => {
    var question = new QuestionCheckboxModel("q1");
    question.choices = ["1", "2", "3", "4", "5"];
    question.showOtherItem = true;
    question.value = ["1", "2", question.otherItem.value];
    question.otherValue = "33";
    expect(question.isOtherSelected, "Other is selected").toBe(true);
    question.validators.push(new RegexValidator("[0-9]+"));
    question.validators.push(new AnswerCountValidator(2, 3));
    expect(question.validate(), "validation pass correctly").toBe(true);
    question.otherValue = "aaa";
    expect(question.validate(), "'aaa' is not a number").toBe(false);
    question.otherValue = "11";
    expect(question.validate(), "it is fine again").toBe(true);
    question.value = [question.otherItem.value];
    expect(question.validate(), "There should be at least 2 values selected").toBe(false);
    question.value = [];
    expect(question.validate(), "We do not check the empty array").toBe(true);
    question.value = undefined;
    expect(question.validate(), "We do not check the empty value").toBe(true);
  });
  test("other values in choices, showOtherItem=false, Bug(Editor) #242", () => {
    var question = new QuestionRadiogroupModel("q1");
    question.choices = ["1", "2", "3", "other"];
    question.isRequired = true;
    question.value = "1";
    expect(question.validate(), "Everything is fine").toBe(true);
    question.value = "other";
    expect(question.validate(), "Everything is still fine, showOtherItem = false").toBe(true);
  });
  test("Boolean value set as string in item.value, Bug #T3118 (private)", () => {
    var json = {
      elements: [
        { type: "radiogroup", name: "q1", choices: ["true", "false"] },
      ],
    };
    var survey = new SurveyModel(json);
    var question = <QuestionRadiogroupModel>survey.getQuestionByName("q1");
    survey.setValue("q1", true);
    expect(question.selectedItem, "Item is selected").toBeTruthy();
    expect(question.selectedItem.value, "the first item is selected").toBe("true");
    survey.setValue("q1", false);
    expect(question.selectedItem, "Item is selected").toBeTruthy();
    expect(question.selectedItem.value, "the second item is selected").toBe("false");
  });
  test("checkbox selectedChoices property", () => {
    var json = {
      elements: [
        {
          type: "checkbox",
          name: "q1",
          choices: ["item1", "item2", "item3"],
          showOtherItem: true,
        },
      ],
    };
    var survey = new SurveyModel(json);
    var question = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    survey.setValue("q1", ["item1", "item2", "other"]);
    expect(question.selectedChoices.length).toBe(3);
  });
  test("Show errors if others value is selected, but not entered", () => {
    var radio = new QuestionRadiogroupModel("q1");
    new SurveyModel().addNewPage("p1").addQuestion(radio);
    radio.choices = ["one"];
    radio.showOtherItem = true;
    expect(radio.validate(), "There is no error by default").toBe(true);
    radio.value = radio.otherItem.value;
    expect(radio.validate(), "The other comment should be entered").toBe(false);
    radio.otherValue = "Many";
    expect(radio.validate(), "We have entered the comment").toBe(true);
  });

  test("dropdown properties: choicesMin, choicesMax, choicesStep", () => {
    var q = new QuestionDropdownModel("q1");
    q.choices = ["one", "two"];
    q.choicesMin = 1;
    q.choicesMax = 20;
    expect(q.visibleChoices.length, "genereated choices have been aded").toBe(22);
    expect(q.visibleChoices[0].value, "from choices").toBe("one");
    expect(q.visibleChoices[2].value, "auto generated").toBe(1);
    q.showOtherItem = true;
    expect(q.visibleChoices.length, "has other has been aded").toBe(2 + 20 + 1);
    q.choicesStep = 2;
    expect(q.visibleChoices.length, "we have in two less autogeneated items").toBe(2 + 10 + 1);
  });

  test("Clear comment on unset the other value, Bug: https://surveyjs.answerdesk.io/ticket/details/T1916", () => {
    var singleSelection = new QuestionDropdownModel("q1");
    var multipleSelection = new QuestionCheckboxModel("q2");
    var survey = new SurveyModel();
    survey.addNewPage("p1").addQuestion(singleSelection);
    survey.pages[0].addQuestion(multipleSelection);

    singleSelection.choices = ["one"];
    singleSelection.showOtherItem = true;
    singleSelection.value = singleSelection.otherItem.value;
    singleSelection.otherValue = "Comment1 is here";

    multipleSelection.choices = ["one"];
    multipleSelection.showOtherItem = true;
    multipleSelection.value = [multipleSelection.otherItem.value];
    multipleSelection.otherValue = "Comment2 is here";

    expect(survey.getComment("q1"), "Comment1 is in survey").toBe("Comment1 is here");
    expect(survey.getComment("q2"), "Comment2 is in survey").toBe("Comment2 is here");

    singleSelection.value = "one";
    expect(survey.getComment("q1"), "Comment1 is cleaned in survey").toBeFalsy();
    expect(singleSelection.comment, "Comment1 is cleaned in question1").toBeFalsy();

    multipleSelection.value = ["one"];
    expect(survey.getComment("q2"), "Comment2 is cleaned in survey").toBeFalsy();
    expect(multipleSelection.comment, "Comment2 is cleaned in question2").toBeFalsy();
  });

  test("SelectBase visibleChoices order", () => {
    var question = new QuestionSelectBase("dropdownQuestion");
    question.choices = ["B", "A", "D", "C"];
    expect(question.choicesOrder, "The default value is 'none'").toBe("none");
    expect(question.visibleChoices[0].calculatedText, "By default visible choices is not sorted").toBe("B");
    question.choicesOrder = "asc";
    expect(question.visibleChoices[0].calculatedText, "Sorted order is 'asc'").toBe("A");
    question.choicesOrder = "desc";
    expect(question.visibleChoices[0].calculatedText, "Sorted order is 'desc'").toBe("D");
  });
  test("Question callbacks test", () => {
    var question = new QuestionTextModel("textQuestion");
    var valueChanged = 0;
    var commentChanged = 0;
    var visibleChanged = 0;
    var visibleIndexChanged = 0;
    question.valueChangedCallback = function () {
      valueChanged++;
    };
    question.commentChangedCallback = function () {
      commentChanged++;
    };
    question.registerPropertyChangedHandlers(["visible"], function () {
      visibleChanged++;
    });
    question.registerPropertyChangedHandlers(["visibleIndex"], function () {
      visibleIndexChanged++;
    });
    question.value = "test";
    question.comment = "comment";
    question.visible = false;
    question.setVisibleIndex(5);
    expect(valueChanged, "value changed one time").toBe(1);
    expect(commentChanged, "comment changed one time").toBe(1);
    expect(visibleChanged, "visibiblity changed one time").toBe(1);
    expect(visibleIndexChanged, "visibleIndex changed one time").toBe(1);
  });
  test("Call valueChangedCallback on survey.setValue(), Bug# 1599", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage();
    var question = page.addNewQuestion("text", "q1");
    var valueChanged = 0;
    question.valueChangedCallback = function () {
      valueChanged++;
    };
    expect(valueChanged, "value changed is not called").toBe(0);
    question.value = "va1";
    expect(valueChanged, "value changed is called the first time").toBe(1);
    survey.setValue("q1", "val2");
    expect(valueChanged, "value changed is called the second time").toBe(2);
  });
  test("Init SelectBase with comment comment", () => {
    var survey = new SurveyModel();
    survey.data = { q: "other", "q-Comment": "aaaa" };
    survey.addNewPage("page1");
    var question = new QuestionSelectBase("q");
    question.choices = ["A", "B", "C", "D"];
    question.showOtherItem = true;
    survey.pages[0].addQuestion(question);
    expect(question.comment, "Set the initial comment").toBe("aaaa");
  });
  test("SelectBase store others value not in comment", () => {
    var survey = new SurveyModel();
    survey.addNewPage("page1");
    var question = new QuestionSelectBase("q");
    question.choices = ["A", "B", "C", "D"];
    question.showOtherItem = true;
    survey.pages[0].addQuestion(question);
    survey.storeOthersAsComment = false;

    question.value = null;
    expect(question.isOtherSelected, "Others is not selected").toBe(false);
    expect(question.isItemSelected(question.otherItem), "Others is not selected, isItemSelected").toBe(false);
    expect(survey.data, "There is no data in survey").toEqual({});

    question.value = "A";
    question.otherValue = "test";
    expect(question.isOtherSelected, "Others is not selected").toBe(false);
    expect(question.isItemSelected(question.otherItem), "Others is not selected, isItemSelected").toBe(false);
    expect(survey.data, "'A' is set").toEqual({ q: "A" });

    question.otherValue = "";
    question.value = question.otherItem.value;
    expect(question.isOtherSelected, "Any other value that is not from choices is other").toBe(true);
    expect(question.isItemSelected(question.otherItem), "Others is selected, isItemSelected").toBe(true);
    expect(survey.data, "Other Item is set").toEqual({ q: question.otherItem.value });

    question.otherValue = "commentTest";
    expect(question.isOtherSelected, "Any other value that is not from choices is other").toBe(true);
    expect(survey.data, "Other text is set").toEqual({ q: "commentTest" });

    survey.setValue("q", "A");
    expect(question.isOtherSelected, "Others is not selected").toBe(false);
    expect(question.value, "'A' is set to the question").toEqual("A");

    survey.setValue("q", "FF");
    expect(question.isOtherSelected, "set other from survey").toBe(true);
    expect(question.renderedValue, "value is otherItem.value").toBe(question.otherItem.value);
    expect(question.value, "value equals to survey.getValue").toBe("FF");
    expect(question.comment, "comment set correctly").toBe("FF");

    question.value = "B";
    expect(question.isOtherSelected, "Others is not selected").toBe(false);
    expect(survey.data, "'B' is set").toEqual({ q: "B" });
  });
  test("Checkbox store others value not in comment", () => {
    var survey = new SurveyModel();
    survey.addNewPage("page1");
    var question = new QuestionCheckboxModel("q");
    question.choices = ["A", "B", "C", "D"];
    question.showOtherItem = true;
    survey.pages[0].addQuestion(question);
    survey.storeOthersAsComment = false;

    question.value = null;
    expect(question.isOtherSelected, "Others is not selected").toBe(false);
    expect(question.isItemSelected(question.otherItem), "Others is not selected, isItemSelected").toBe(false);
    expect(survey.data, "There is no data in survey").toEqual({});

    question.value = ["A"];
    question.otherValue = "test";
    expect(question.isOtherSelected, "Others is not selected").toBe(false);
    expect(question.isItemSelected(question.otherItem), "Others is not selected, isItemSelected").toBe(false);
    expect(survey.data, "'A' is set").toEqual({ q: ["A"] });

    question.otherValue = "";
    question.value = ["A", question.otherItem.value];
    expect(question.isOtherSelected, "Any other value that is not from choices is other").toBe(true);
    expect(question.isItemSelected(question.otherItem), "Others is selected, isItemSelected").toBe(true);
    expect(survey.data, "Other Item is set").toEqual({ q: ["A", question.otherItem.value] });

    question.otherValue = "commentTest";
    expect(question.isOtherSelected, "Any other value that is not from choices is other").toBe(true);
    expect(survey.data, "Other text is set").toEqual({ q: ["A", "commentTest"] });

    survey.setValue("q", ["A"]);
    expect(question.isOtherSelected, "Others is not selected").toBe(false);
    expect([...(question.value)], "'A' is set to the question").toEqual(["A"]);

    survey.setValue("q", ["A", "FF"]);
    expect(question.isOtherSelected, "set other from survey").toBe(true);
    expect([...(question.value)], "value equals to survey.getValue").toEqual(["A", "FF"]);
    expect([...(question.renderedValue)], "value is otherItem.value").toEqual(["A", question.otherItem.value]);

    question.value = ["A", "B"];
    expect(question.isOtherSelected, "Others is not selected").toBe(false);
    expect(survey.data, "'B' is set").toEqual({ q: ["A", "B"] });
  });
  test("Checkbox store others value not in comment & defaultValue", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "checkbox",
          name: "q1",
          defaultValue: ["A", "B"],
          showOtherItem: true,
        },
      ],
    });
    var question = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    survey.readOnly = true;
    expect([...(question.renderedValue)], "do not convert value into others").toEqual(["A", "B"]);
    question.choices = ["A", "B", "C"];
    expect([...(question.renderedValue)], "do not convert value into others, #2").toEqual(["A", "B"]);
  });

  test("Checkbox store others value not in comment after select another items - https://github.com/surveyjs/survey-library/issues/2221", () => {
    var survey = new SurveyModel();
    survey.addNewPage("page1");
    var question = new QuestionCheckboxModel("q");
    question.choices = ["A", "B", "C", "D"];
    question.showOtherItem = true;
    question.storeOthersAsComment = false;
    survey.pages[0].addQuestion(question);
    // survey.storeOthersAsComment = false;

    question.value = null;
    expect(question.isOtherSelected, "Others is not selected").toBe(false);
    expect(survey.data, "There is no data in survey").toEqual({});

    question.otherValue = "";
    question.value = ["A", question.otherItem.value];
    expect(question.isOtherSelected, "Any other value that is not from choices is other").toBe(true);
    expect(survey.data, "Other Item is set").toEqual({ q: ["A", question.otherItem.value] });
    question.otherValue = "commentTest";
    expect(question.isOtherSelected, "Any other value that is not from choices is other").toBe(true);
    expect(survey.data, "Other text is set").toEqual({ q: ["A", "commentTest"] });

    question.renderedValue = ["A", question.otherItem.value, "B"];
    expect([...(question.value)], "'commentTest' is still set to the question").toEqual(["A", "commentTest", "B"]);
    expect(survey.data, "'commentTest' is still set in the survey data").toEqual({ q: ["A", "commentTest", "B"] });
  });

  test("radiogroup.renderedValue - simple synhronization", () => {
    var survey = new SurveyModel();
    survey.addNewPage("page1");
    var question = new QuestionSelectBase("q");
    question.choices = ["A", "B", "C", "D"];
    question.showOtherItem = true;
    survey.pages[0].addQuestion(question);

    question.value = "A";
    expect(question.renderedValue, "renderedValue set correctly, question.value").toBe("A");
    expect(survey.getValue("q"), "survey has correct value, question.value").toBe("A");
    survey.setValue("q", "B");
    expect(question.renderedValue, "renderedValue set correctly, survey.setValue").toBe("B");
    expect(question.value, "question.value set correctly, survey.setValue").toBe("B");
    question.renderedValue = "C";
    expect(question.value, "question.value set correctly, survey.rendredValue").toBe("C");
    expect(survey.getValue("q"), "survey has correct value, question.rendredValue").toBe("C");
  });
  test("radiogroup.renderedValue - storeOthersAsComment = false;", () => {
    var survey = new SurveyModel();
    survey.addNewPage("page1");
    var question = new QuestionSelectBase("q");
    question.choices = ["A", "B", "C", "D"];
    question.showOtherItem = true;
    survey.storeOthersAsComment = false;
    survey.pages[0].addQuestion(question);

    question.value = "A";
    expect(question.renderedValue, "renderedValue set correctly, question.value").toBe("A");
    expect(survey.getValue("q"), "survey has correct value, question.value").toBe("A");
    survey.setValue("q", "B");
    expect(question.renderedValue, "renderedValue set correctly, survey.setValue").toBe("B");
    expect(question.value, "question.value set correctly, survey.setValue").toBe("B");
    question.renderedValue = "C";
    expect(question.value, "question.value set correctly, survey.rendredValue").toBe("C");
    expect(survey.getValue("q"), "survey has correct value, question.rendredValue").toBe("C");

    question.renderedValue = "other";
    expect(question.value, "question.value set correctly, survey.rendredValue").toBe("other");
    expect(survey.getValue("q"), "survey has correct value, question.rendredValue").toBe("other");
    question.otherValue = "Some value";
    expect(question.value, "question.value, comment as value").toBe("Some value");
    expect(survey.getValue("q"), "survey.getValue, comment as value").toBe("Some value");
    question.value = "A";
    expect(question.renderedValue, "renderedValue set correctly, survey.setValue").toBe("A");
    survey.setValue("q", "X");
    expect(question.value, "question.value = survey.getValue").toBe("X");
    expect(question.renderedValue, "renderedValue is other").toBe("other");
    expect(question.comment, "set comment").toBe("X");
  });
  test("checkbox.renderedValue - storeOthersAsComment = false;", () => {
    var survey = new SurveyModel();
    survey.addNewPage("page1");
    var question = new QuestionCheckboxModel("q");
    question.choices = ["A", "B", "C", "D"];
    question.showOtherItem = true;
    survey.storeOthersAsComment = false;
    survey.pages[0].addQuestion(question);

    question.value = ["A", "B"];
    expect([...(question.renderedValue)], "renderedValue set correctly, question.value").toEqual(["A", "B"]);
    expect(survey.getValue("q"), "survey has correct value, question.value").toEqual(["A", "B"]);
    survey.setValue("q", ["B", "C"]);
    expect([...(question.renderedValue)], "renderedValue set correctly, survey.setValue").toEqual(["B", "C"]);
    expect([...(question.value)], "question.value set correctly, survey.setValue").toEqual(["B", "C"]);
    question.renderedValue = ["A", "C"];
    expect([...(question.value)], "question.value set correctly, survey.rendredValue").toEqual(["A", "C"]);
    expect(survey.getValue("q"), "survey has correct value, question.rendredValue").toEqual(["A", "C"]);

    question.renderedValue = ["B", "other"];
    expect([...(question.value)], "question.value set correctly, survey.rendredValue").toEqual(["B", "other"]);
    expect(survey.getValue("q"), "survey has correct value, question.rendredValue").toEqual(["B", "other"]);
    question.otherValue = "Some value";
    expect([...(question.renderedValue)], "question.value, comment as value").toEqual(["B", "other"]);
    expect([...(question.value)], "question.value, comment as value").toEqual(["B", "Some value"]);
    expect(survey.getValue("q"), "survey.getValue, comment as value").toEqual(["B", "Some value"]);
    question.value = ["A", "C"];
    expect([...(question.renderedValue)], "renderedValue set correctly, survey.setValue").toEqual(["A", "C"]);
    survey.setValue("q", ["B", "X"]);
    expect([...(question.value)], "question.value = survey.getValue").toEqual(["B", "X"]);
    expect([...(question.renderedValue)], "renderedValue is other").toEqual(["B", "other"]);
    expect(question.comment, "set comment").toBe("X");
  });
  test("checkbox.renderedValue - showNoneItem = true, Bug #1609", () => {
    var survey = new SurveyModel();
    survey.addNewPage("page1");
    var question = new QuestionCheckboxModel("q");
    question.choices = ["A", "B", "C", "D"];
    question.showNoneItem = true;
    survey.pages[0].addQuestion(question);

    question.value = ["A", "B"];
    expect([...(question.renderedValue)], "renderedValue set correctly, question.value").toEqual(["A", "B"]);
    question.renderedValue = ["A", "B", "none"];
    expect([...(question.value)], "value set correctly - 'none'").toEqual(["none"]);
    expect([...(question.renderedValue)], "renderedValue set correctly - 'none'").toEqual(["none"]);
  });
  test("checkbox.renderedValue - showNoneItem = true and survey.storeOthersAsComment = false, Bug #1609", () => {
    var survey = new SurveyModel();
    survey.storeOthersAsComment = false;
    survey.addNewPage("page1");
    var question = new QuestionCheckboxModel("q");
    question.choices = ["A", "B", "C", "D"];
    question.showNoneItem = true;
    survey.pages[0].addQuestion(question);

    question.value = ["A", "B"];
    expect([...(question.renderedValue)], "renderedValue set correctly, question.value").toEqual(["A", "B"]);
    question.renderedValue = ["A", "B", "none"];
    expect([...(question.value)], "value set correctly - 'none'").toEqual(["none"]);
    expect([...(question.renderedValue)], "renderedValue set correctly - 'none'").toEqual(["none"]);
  });
  test("radiogroup.hasOthers = true and survey.storeOthersAsComment = false, Bug https://surveyjs.answerdesk.io/ticket/details/T1789", () => {
    var json = {
      storeOthersAsComment: false,
      elements: [
        {
          type: "radiogroup",
          name: "q1",
          choices: [1, 2],
          showOtherItem: true,
        },
        {
          type: "checkbox",
          name: "q2",
          choices: [1, 2],
          showOtherItem: true,
        },
      ],
    };
    var survey = new SurveyModel(json);
    var data = { q1: "other 1", q2: [1, "other 2"] };
    survey.data = data;
    survey.doComplete();
    expect(survey.data, "The data is correct").toEqual(data);
  });

  test("Text inputType=number", () => {
    var question = new QuestionTextModel("text");
    question.inputType = "number";
    question.value = "2";
    expect(question.value, "make it numeric").toBe(2);
    question.value = "2.25";
    expect(question.value, "make it numeric/float").toBe(2.25);
    question.value = "2.25sdd";
    expect(!question.value, "it is empty").toBeTruthy();
    question.value = "0";
    expect(question.value, "zero value").toBe(0);
  });
  test("Text inputType=range", () => {
    var question = new QuestionTextModel("text");
    question.inputType = "range";
    question.value = "25";
    expect(question.value, "make it numeric").toBe(25);
  });
  test("Text questions spaces is not a valid answer for required", () => {
    var question = new QuestionTextModel("text");
    question.isRequired = true;
    expect(question.validate(), "Question is empty").toBe(false);
    expect(question.errors[0].locText.textOrHtml, "error has correct text").toBe("Response required.");
    question.value = "  ";
    expect(question.validate(), "spaces is not an answer").toBe(false);
    question.value = " 1 ";
    expect(question.validate(), "got the answer").toBe(true);
  });
  test("Custom text in required error", () => {
    var question = new QuestionTextModel("text");
    question.requiredErrorText = "Custom required error";
    question.isRequired = true;
    expect(question.validate(), "Question is empty").toBe(false);
    expect(question.errors.length, "There is one error").toBe(1);
    expect(question.errors[0].locText.textOrHtml, "there is a custom errror text").toBe("Custom required error");
  });
  test("Boolean question checkedValue", () => {
    var question = new QuestionBooleanModel("bool");
    expect(question.booleanValue, "Indertemenated by default").toBeNull();
    question.value = true;
    expect(question.booleanValue, "value == true, checkedvalue == true").toBe(true);
    question.value = false;
    expect(question.booleanValue, "value == false, checkedvalue == false").toBe(false);
    question.value = null;
    expect(question.booleanValue, "value == null, checkedvalue == null").toBeNull();
    question.value = "a";
    expect(question.booleanValue, "value == 'a', checkedvalue == false").toBe(false);
  });
  test("Boolean question valueTrue, valueFalse", () => {
    var question = new QuestionBooleanModel("bool");
    question.valueTrue = "yes";
    question.valueFalse = "no";
    expect(question.booleanValue, "Indertemenated by default").toBeNull();
    question.value = "yes";
    expect(question.booleanValue, "value == 'yes', checkedvalue == true").toBe(true);
    question.value = "no";
    expect(question.booleanValue, "value == 'no', checkedvalue == false").toBe(false);
    question.booleanValue = true;
    expect(question.value, "checkedvalue == true, value = 'yes'").toBe("yes");
    question.booleanValue = false;
    expect(question.value, "checkedvalue == false, value = 'no'").toBe("no");
  });
  test("Boolean question defaultValue", () => {
    var question = new QuestionBooleanModel("bool");
    expect(question.booleanValue, "Indertemenated by default").toBeNull();
    question.defaultValue = "true";
    expect(question.booleanValue, "defaultValue is set to 'true', checkedvalue == true").toBe(true);
    question.defaultValue = "false";
    expect(question.booleanValue, "defaultValue is set to 'false', but value has been already set to checkedvalue == true").toBe(true);

    var survey = new SurveyModel();
    survey.addNewPage("p1");
    survey.pages[0].addQuestion(question);
    expect(survey.data, "add question into survey").toEqual({ bool: false });
  });

  test("Boolean question defaultValue as a boolean values", () => {
    var question = new QuestionBooleanModel("bool");
    expect(question.booleanValue, "Indertemenated by default").toBeNull();
    question.defaultValue = true;
    expect(question.defaultValue, "default value is true").toBe("true");
    expect(question.booleanValue, "defaultValue is set to 'true', checkedvalue == true").toBe(true);
    question.defaultValue = false;
    expect(question.defaultValue, "default value is false").toBe("false");
    expect(question.booleanValue, "defaultValue is set to 'false', but value has been already set to checkedvalue == true").toBe(true);

    var survey = new SurveyModel();
    survey.addNewPage("p1");
    survey.pages[0].addQuestion(question);
    expect(survey.data, "add question into survey").toEqual({ bool: false });
  });

  test("Boolean question read only checkedValue", () => {
    var question = new QuestionBooleanModel("bool");
    question.readOnly = true;
    expect(question.booleanValue, "Indertemenated by default").toBeNull();
    question.booleanValue = false;
    expect(question.booleanValue, "Indertemenated by default is not changed due to read only mode").toBeNull();
    question.booleanValue = true;
    expect(question.booleanValue, "Indertemenated by default is not changed due to read only mode").toBeNull();
  });

  test("defaultValue and showOtherItem - radiogroup, bug#384 (Editor)", () => {
    var json = {
      elements: [
        {
          type: "radiogroup",
          name: "q1",
          choices: [1, 2, 3],
          showOtherItem: true,
          defaultValue: "otherValue",
        },
      ],
    };
    var survey = new SurveyModel(json);
    var question = <QuestionRadiogroupModel>survey.getQuestionByName("q1");
    expect(question.isOtherSelected, "The other is selected").toBe(true);
    expect(question.comment, "other value is set").toBe("otherValue");
  });

  test("defaultValue and showOtherItem - checkbox, bug#384 (Editor)", () => {
    var json = {
      elements: [
        {
          type: "checkbox",
          name: "q1",
          choices: [1, 2, 3],
          showOtherItem: true,
          defaultValue: [2, "otherValue"],
        },
      ],
    };
    var survey = new SurveyModel(json);
    var question = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    expect(question.isOtherSelected, "The other is selected").toBe(true);
    expect([...(question.renderedValue)], "rendredValue set correctly").toEqual([2, "other"]);
    expect([...(question.value)], "value set correctly").toEqual([2, "other"]);
    expect(question.comment, "other value is set").toBe("otherValue");
  });

  test("defaultValue for checkbox where value is object, bug: https://surveyjs.answerdesk.io/ticket/details/T2055", () => {
    var json = {
      pages: [
        {
          name: "page1",
          elements: [
            {
              type: "checkbox",
              name: "q1",
              defaultValue: [
                {
                  id: "2",
                  test: "a2",
                },
                {
                  id: "3",
                  test: "a2",
                },
              ],
              choices: [
                {
                  value: {
                    id: "1",
                    test: "a1",
                  },
                  text: "a1",
                },
                {
                  value: {
                    id: "2",
                    test: "a2",
                  },
                  text: "a2",
                },
                {
                  value: {
                    id: "3",
                    test: "a3",
                  },
                  text: "a3",
                },
              ],
            },
          ],
        },
      ],
    };
    var survey = new SurveyModel(json);
    var question = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    expect(question.isItemSelected(question.choices[0]), "Item[0] is not selected").toBe(false);
    expect(question.isItemSelected(question.choices[1]), "Item[1] is selected").toBe(true);
    expect(question.isItemSelected(question.choices[2]), "Item[2] is not selected").toBe(false);
    survey.doComplete();
    expect([...(question.value)], "Initial value set correctly").toEqual([
      {
        id: "2",
        test: "a2",
      },
    ]);
    expect(question.value[0] === question.choices[1].value, "Chosen exactly choice item value").toBeTruthy();
  });

  test("defaultValue for radiogroup where value is object, bug: https://surveyjs.answerdesk.io/ticket/details/T2055", () => {
    var json = {
      pages: [
        {
          name: "page1",
          elements: [
            {
              type: "radiogroup",
              name: "q1",
              defaultValue: {
                id: "2",
                test: "a2",
              },
              choices: [
                {
                  value: {
                    id: "1",
                    test: "a1",
                  },
                  text: "a1",
                },
                {
                  value: {
                    id: "2",
                    test: "a2",
                  },
                  text: "a2",
                },
                {
                  value: {
                    id: "3",
                    test: "a3",
                  },
                  text: "a3",
                },
              ],
            },
          ],
        },
      ],
    };
    var survey = new SurveyModel(json);
    var question = <QuestionRadiogroupModel>survey.getQuestionByName("q1");
    expect(question.value === question.choices[1].value, "Chosen exactly choice item value").toBeTruthy();
    survey.doComplete();
    expect(question.value, "Initial value is set correctly").toEqual({
      id: "2",
      test: "a2",
    });
  });

  test("Rating question, visibleRateValues property", () => {
    var rate = new QuestionRatingModel("q1");
    expect(rate.visibleRateValues.length, "There are 5 items by default").toBe(5);
    expect(rate.rateMax, "rateMax default is 5").toBe(5);
    rate.rateMin = 6;
    expect(rate.rateMin, "the min is max - step").toBe(4);
    rate.rateMin = 2;
    rate.rateMax = 1;
    expect(rate.rateMax, "the min is min + step").toBe(3);
    rate.rateMin = 2;
    rate.rateMax = 7;
    rate.rateStep = 10;
    expect(rate.rateStep, "the step is max - min").toBe(5);
    rate.rateStep = 2;
    rate.rateMax = 200;
    expect(rate.visibleRateValues.length, "Values can be more than MaximumRateValueCount.").toBe(settings.ratingMaximumRateValueCount);
    rate.rateValues = [1, 2, 3];
    expect(rate.visibleRateValues.length, "Use rate values").toBe(3);
  });

  test("Rating question, renderedRateItems. Update renderedRateItems on changing rateValues", () => {
    var rate = new QuestionRatingModel("q1");
    expect(rate.visibleRateValues.length, "There are 5 items by default").toBe(5);
    rate.rateValues.push(new ItemValue("item1"));
    expect(rate.visibleRateValues.length, "There is on item now").toBe(1);
    rate.rateValues.push(new ItemValue("item2"));
    expect(rate.visibleRateValues.length, "There is on two now").toBe(2);
    rate.rateValues.splice(0, 2);
    expect(rate.visibleRateValues.length, "There are 5 default default items again").toBe(5);
  });

  test("Rating question, visibleRateValues property load from JSON", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "rating",
          name: "q1",
          rateMin: 40,
          rateMax: 90,
          rateStep: 10,
        },
      ],
    });
    var rate = <QuestionRatingModel>survey.getQuestionByName("q1");
    expect(rate.rateMin, "the min is 40").toBe(40);
    expect(rate.rateMax, "the max is 90").toBe(90);
    expect(rate.rateStep, "the step is 10").toBe(10);
    expect(rate.visibleRateValues.length, "There are 5 items by default").toBe(6);
    var values = rate.visibleRateValues;
    expect(values[0].value, "The first is 40").toBe(40);
    expect(values[1].value, "The second is 50").toBe(50);
    expect(values[5].value, "The last is 90").toBe(90);
  });
  test("defaultValue propeprty as array", () => {
    var question = new QuestionCheckboxModel("q1");
    expect(question.defaultValue, "It is empty by default").toBeFalsy();
    question.defaultValue = [1];
    expect(question.defaultValue, "It is not empty no").toEqual([1]);
    question.defaultValue = null;
    expect([...(question.defaultValue)], "It is empty by default").toEqual([]);
  });
  test("Restore/Store item value in checkbox on hiding/showing", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "checkbox",
          name: "q2",
          choices: [
            "item1",
            "item2",
            {
              value: "item3",
              text: "item3 - conditional Item",
              visibleIf: "{q1}='yes'",
            },
            "item4",
            "item5",
          ],
          defaultValue: ["item1", "item3", "item5"],
        },
      ],
    });
    var question = <QuestionCheckboxModel>survey.getQuestionByName("q2");
    expect([...(question.value)], "item3 is invisible - remove it").toEqual(["item1", "item5"]);
    survey.setValue("q1", "yes");
    expect([...(question.value)], "item3 is visible - restore it's value").toEqual(["item1", "item5", "item3"]);
    survey.setValue("q1", "no");
    expect([...(question.value)], "item3 is invisible again - remove it").toEqual(["item1", "item5"]);
    survey.setValue("q1", "yes");
    expect([...(question.value)], "item3 is visible again - restore it's value").toEqual(["item1", "item5", "item3"]);
    survey.setValue("q1", "no");
    question.value = ["item1", "item5"];
    survey.setValue("q1", "yes");
    expect([...(question.value)], "item3 is visible again, but we uncheck the value when it was hidden").toEqual(["item1", "item5"]);
  });

  test("Clear errors on making question invisible, bug#846", () => {
    var question = new QuestionTextModel("q1");
    question.isRequired = true;
    question.validate(true);
    expect(question.errors.length, "There is an error").toBe(1);
    question.visible = false;
    question.visible = true;
    expect(question.errors.length, "There is no error now").toBe(0);
  });
  test("Clear errors on making question readOnly, bug#950", () => {
    var question = new QuestionTextModel("q1");
    question.isRequired = true;
    question.validate(true);
    expect(question.errors.length, "There is an error").toBe(1);
    question.readOnly = true;
    question.validate(true);
    expect(question.errors.length, "There is no error now").toBe(0);
    question.readOnly = false;
    question.validate(true);
    expect(question.errors.length, "There is an error again").toBe(1);
  });
  test("displayValue and choice value as object, bug#952", () => {
    var question = new QuestionRadiogroupModel("q1");
    question.choices.push(new ItemValue({ id: 1, val: "v1" }, "item 1"));
    question.choices.push(new ItemValue({ id: 2, val: "v2" }, "item 2"));
    question.value = { id: 2, val: "v2" };
    expect(question.value, "value set correctly").toEqual({ id: 2, val: "v2" });
    expect(question.displayValue, "display value get correctly").toBe("item 2");
  });
  test("question.addConditionObjectsByContext", () => {
    var objs = [];
    var html = new QuestionHtmlModel("q_html");
    html.addConditionObjectsByContext(objs, null);
    var checkbox = new QuestionCheckboxModel("q_check");
    checkbox.title = "My check title";
    checkbox.addConditionObjectsByContext(objs, null);
    var q_mt = new QuestionMultipleTextModel("q_mt");
    q_mt.addItem("item1", "Item 1 title");
    q_mt.addItem("item2");
    q_mt.addConditionObjectsByContext(objs, null);
    var q_matrix = new QuestionMatrixModel("q_matrix");
    q_matrix.rows = ["row1", "row2"];
    q_matrix.rows[0].text = "Row 1";
    q_matrix.addConditionObjectsByContext(objs, null);
    var qValueName = new QuestionTextModel("q_text");
    qValueName.valueName = "valueText";
    qValueName.title = "Text Question";
    qValueName.addConditionObjectsByContext(objs, null);
    for (var i = 0; i < objs.length; i++) {
      objs[i].question = objs[i].question.name;
    }
    expect(objs, "addConditionObjectsByContext work correctly").toEqual([
      { name: "q_check", text: "My check title", question: "q_check" },
      { name: "q_mt.item1", text: "q_mt.Item 1 title", question: "q_mt" },
      { name: "q_mt.item2", text: "q_mt.item2", question: "q_mt" },
      { name: "q_matrix.row1", text: "q_matrix.Row 1", question: "q_matrix" },
      { name: "q_matrix.row2", text: "q_matrix.row2", question: "q_matrix" },
      { name: "valueText", text: "Text Question", question: "q_text" },
    ]);
  });
  test("question.getNextedQuestions", () => {
    const q = new QuestionMultipleTextModel("q_mt");
    q.addItem("item1", "Item 1 title");
    q.addItem("item2");
    const nQuestions = q.getNestedQuestions();
    expect(nQuestions.length, "We have 2 items").toBe(2);
    expect(nQuestions[0].name, "#1").toBe("item1");
    expect(nQuestions[1].name, "#2").toBe("item2");
  });

  test("question.getConditionJson", () => {
    var json = new QuestionHtmlModel("q_html").getConditionJson("equals");
    expect(json, "Html has not input value - so it is null").toBeNull();
    var qRadio = new QuestionRadiogroupModel("qRadio");
    qRadio.choices = [1, 2, 3, 4, 5];
    json = qRadio.getConditionJson("equals");
    expect(json.choices, "radiogroup: choices correctly converted").toEqual([1, 2, 3, 4, 5]);
    expect(json.type, "radiogroup: type set correctly").toBe("radiogroup");

    var qCheckbox = new QuestionCheckboxModel("qCheckbox");
    qCheckbox.choices = [1, 2, 3, 4, 5];
    qCheckbox.maxSelectedChoices = 3;
    json = qCheckbox.getConditionJson("equals");
    expect(json.choices, "checkbox: choices correctly converted").toEqual([1, 2, 3, 4, 5]);
    expect(json.maxSelectedChoices).toBeFalsy();
    expect(json.type, "checkbox: type set correctly").toBe("checkbox");
    json = qCheckbox.getConditionJson("contains");
    expect(json.type, "checkbox: type set correctly for operator contains").toBe("radiogroup");
    var q_mt = new QuestionMultipleTextModel("q_mt");
    q_mt.addItem("item1");
    q_mt.addItem("item2");
    json = q_mt.getConditionJson("equals", "dummy");
    expect(json, "There is no item as dummy").toBeNull();
    json = q_mt.getConditionJson("equals", "item2");
    expect(json, "multiple text item returns json").toBeTruthy();
    expect(json.type, "mutltiple text item: type set correctly").toBe("text");
    var q_matrix = new QuestionMatrixModel("q_matrix");
    q_matrix.rows = ["row1", "row2"];
    q_matrix.columns = ["col1", "col2"];
    json = q_matrix.getConditionJson("equals", "row1");
    expect(json, "matrix text item returns json").toBeTruthy();
    expect(json.type, "matrix row: type set correctly").toBe("dropdown");
  });

  test("question.clearIncorrectValues", () => {
    var qText = new QuestionTextModel("q1");
    qText.value = "1";
    qText.clearIncorrectValues();
    expect(qText.value, "do nothing for text question").toBe("1");
    var qRadio = new QuestionRadiogroupModel("q1");
    qRadio.choices = ["1", "2", "3"];
    qRadio.value = "1";
    qRadio.clearIncorrectValues();
    expect(qRadio.value, "do nothing since item exists in choices").toBe("1");
    qRadio.value = "5";
    qRadio.clearIncorrectValues();
    expect(qRadio.value, "clear value since item doesn't exist in choices").toBeFalsy();

    var qcheck = new QuestionCheckboxModel("q1");
    qcheck.choices = ["1", "2", "3"];
    qcheck.value = ["1", "2"];
    qcheck.clearIncorrectValues();
    expect([...(qcheck.value)], "do nothing since item exists in choices").toEqual(["1", "2"]);
    qcheck.value = ["1", "5"];
    qcheck.clearIncorrectValues();
    expect([...(qcheck.value)], "remove one item from choices").toEqual(["1"]);
    qcheck.value = ["7", "5"];
    qcheck.clearIncorrectValues();
    expect([...(qcheck.value)], "clear values, there is no these items in choices").toEqual([]);
    qcheck.value = ["", 0, undefined, null];
    qcheck.clearIncorrectValues();
    expect([...(qcheck.value)], "clear values, clear empty values").toEqual([]);
  });

  test("question.clearIncorrectValues and choicesByUrl", () => {
    var question = new QuestionRadiogroupModel("q1");
    question.choicesByUrl.url = "some url";
    question.value = "item1";
    question.clearIncorrectValues();
    expect(question.value, "Do not do anything if choicesByUrl is not empty").toBe("item1");
  });

  test("questiontext.maxLength & make it works for text input type only, #6750", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("p1");
    var qText = new QuestionTextModel("q1");
    page.addElement(qText);
    expect(qText.getMaxLength(), "By default it is null").toBeNull();
    survey.maxTextLength = 10;
    expect(qText.getMaxLength(), "get from survey").toBe(10);
    qText.maxLength = 0;
    expect(qText.getMaxLength(), "makes it undefined").toBeNull();
    qText.maxLength = 5;
    expect(qText.getMaxLength(), "gets 5 from question").toBe(5);
    qText.maxLength = -1;
    expect(qText.getMaxLength(), "get from survey again").toBe(10);
    qText.inputType = "date";
    expect(qText.getMaxLength(), "input type is 'date'").toBeNull();
    qText.inputType = "number";
    expect(qText.getMaxLength(), "input type is 'number'").toBeNull();
    qText.inputType = "color";
    expect(qText.getMaxLength(), "input type is 'color'").toBeNull();
    qText.inputType = "text";
    expect(qText.getMaxLength(), "input type is 'text'").toBe(10);
  });

  test("Display Current/Maximum Allowed Characters when a maximum length is defined for input fields", () => {
    const survey = new SurveyModel();
    const page = survey.addNewPage("p1");
    const qText = new QuestionTextModel("q1");
    page.addElement(qText);
    expect(qText.characterCounter.remainingCharacterCounter, "By default it is empty string #1").toBe("");
    qText.updateRemainingCharacterCounter("Test");
    expect(qText.characterCounter.remainingCharacterCounter, "By default it is empty string #2").toBe("");
    qText.maxLength = 10;
    qText.updateRemainingCharacterCounter("Test");
    expect(qText.characterCounter.remainingCharacterCounter).toBe("4/10");
    qText.maxLength = 0;
    qText.updateRemainingCharacterCounter("Test");
    expect(qText.characterCounter.remainingCharacterCounter, "makes it empty string").toBe("");
    qText.maxLength = 5;
    qText.updateRemainingCharacterCounter("Test");
    expect(qText.characterCounter.remainingCharacterCounter).toBe("4/5");
    qText.updateRemainingCharacterCounter("");
    expect(qText.characterCounter.remainingCharacterCounter).toBe("0/5");
  });

  test("set json into survey: Display Current/Maximum Allowed Characters when a maximum length is defined for input fields", () => {
    const survey = new SurveyModel();
    survey.fromJSON({
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "comment",
              "name": "q1",
              "maxLength": 255
            }
          ]
        }
      ]
    });

    const qText = survey.getQuestionByName("q1");
    expect(qText.characterCounter.remainingCharacterCounter).toBe("0/255");

    survey.data = { q1: "Test2" };
    expect(qText.characterCounter.remainingCharacterCounter).toBe("5/255");
  });

  test("Display Current/Maximum Allowed Characters when a maximum length is defined for input fields and there is defaultValue", () => {
    const survey = new SurveyModel();
    const page = survey.addNewPage("p1");
    const qText = new QuestionTextModel("q1");
    qText.maxLength = 10;
    qText.defaultValue = "Test";
    page.addElement(qText);
    expect(qText.value).toBe("Test");
    expect(qText.characterCounter.remainingCharacterCounter, "By default it is undefined").toBe("4/10");
  });

  test("readOnlyCommentRenderMode", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("p1");
    var qComment = new QuestionCommentModel("q1");
    var qRadio = new QuestionRadiogroupModel("q2");
    survey.readOnly = true;

    page.addElement(qComment);
    page.addElement(qRadio);

    expect(qComment["isReadOnlyRenderDiv"](), "isReadOnlyRenderDiv false").toBe(false);
    expect(qRadio["isReadOnlyRenderDiv"](), "isReadOnlyRenderDiv false").toBe(false);
  });
  test("readOnlyCommentRenderMode+readOnlyTextRenderMode", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("p1");
    var qComment = new QuestionCommentModel("q1");
    var qText = new QuestionTextModel("q3");
    survey.readOnly = true;

    page.addElement(qComment);
    page.addElement(qText);

    expect(qComment["isReadOnlyRenderDiv"](), "1. Comment - isReadOnlyRenderDiv false").toBe(false);
    expect(qText["isReadOnlyRenderDiv"](), "1. Text - isReadOnlyRenderDiv false").toBe(false);

    settings.readOnlyCommentRenderMode = "div";

    expect(qComment["isReadOnlyRenderDiv"](), "2. Comment - isReadOnlyRenderDiv true").toBe(true);
    expect(qText["isReadOnlyRenderDiv"](), "3. Text - isReadOnlyRenderDiv false").toBe(false);

    settings.readOnlyTextRenderMode = "div";
    expect(qComment["isReadOnlyRenderDiv"](), "3. Comment - isReadOnlyRenderDiv true").toBe(true);

    expect(qText["isReadOnlyRenderDiv"](), "3. Text - isReadOnlyRenderDiv true").toBe(true);

    settings.readOnlyCommentRenderMode = "textarea";
    expect(qComment["isReadOnlyRenderDiv"](), "4. Comment - isReadOnlyRenderDiv false").toBe(false);
    expect(qText["isReadOnlyRenderDiv"](), "4. Text - isReadOnlyRenderDiv true").toBe(true);

    settings.readOnlyCommentRenderMode = "div";
    survey.readOnly = false;
    expect(qComment["isReadOnlyRenderDiv"](), "5. Comment - isReadOnlyRenderDiv false").toBe(false);
    expect(qText["isReadOnlyRenderDiv"](), "5. Text - isReadOnlyRenderDiv false").toBe(false);
  });

  test("runCondition on adding element into survey", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("p1");
    var q = new QuestionCheckboxModel("cars");
    q.visibleIf = "{val} = 1";
    page.addElement(q);
    expect(q.isVisible, "It should be invisible").toBe(false);
  });

  test("questionselectbase.choicesVisibleIf", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("p1");
    var qCars = new QuestionCheckboxModel("cars");
    qCars.choices = ["Audi", "BMW", "Mercedes", "Volkswagen"];
    page.addElement(qCars);
    var qBestCar = new QuestionRadiogroupModel("bestCar");
    qBestCar.choices = ["Audi", "BMW", "Mercedes", "Volkswagen"];
    qBestCar.choicesVisibleIf = "{cars} contains {item}";
    page.addElement(qBestCar);
    expect(qBestCar.visibleChoices.length, "cars are not selected yet").toBe(0);
    qCars.value = ["BMW"];
    expect(qBestCar.visibleChoices.length, "BMW is selected").toBe(1);
    qCars.value = ["Audi", "BMW", "Mercedes"];
    expect(qBestCar.visibleChoices.length, "3 cars are selected").toBe(3);
    qBestCar.choicesVisibleIf = "";
    expect(qBestCar.visibleChoices.length, "there is no filter").toBe(4);
  });

  test("questionselectbase.choicesEnableIf", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("p1");
    var qCars = new QuestionCheckboxModel("cars");
    qCars.choices = ["Audi", "BMW", "Mercedes", "Volkswagen"];
    page.addElement(qCars);
    var qBestCar = new QuestionRadiogroupModel("bestCar");
    qBestCar.choices = ["Audi", "BMW", "Mercedes", "Volkswagen"];
    qBestCar.choicesEnableIf = "{cars} contains {item}";
    page.addElement(qBestCar);
    expect(qBestCar.enabledChoices.length, "cars are disabled").toBe(0);
    qCars.value = ["BMW"];
    expect(qBestCar.enabledChoices.length, "BMW is enabled").toBe(1);
    qCars.value = ["Audi", "BMW", "Mercedes"];
    expect(qBestCar.enabledChoices.length, "3 cars are enabled").toBe(3);
    qBestCar.choicesEnableIf = "";
    expect(qBestCar.enabledChoices.length, "there is no filter").toBe(4);
  });

  test("questionselectbase.choicesVisibleIf, support {choice}", () => {
    const survey = new SurveyModel();
    const page = survey.addNewPage("p1");
    const qCars = new QuestionCheckboxModel("cars");
    qCars.choices = ["Audi", "BMW", "Mercedes", "Volkswagen"];
    page.addElement(qCars);
    const qBestCar = new QuestionRadiogroupModel("bestCar");
    qBestCar.choices = ["Audi", "BMW", "Mercedes", "Volkswagen"];
    qBestCar.choicesVisibleIf = "{cars} contains {choice}";
    page.addElement(qBestCar);
    expect(qBestCar.visibleChoices.length, "cars are not selected yet").toBe(0);
    qCars.value = ["BMW"];
    expect(qBestCar.visibleChoices.length, "BMW is selected").toBe(1);
    qCars.value = ["Audi", "BMW", "Mercedes"];
    expect(qBestCar.visibleChoices.length, "3 cars are selected").toBe(3);
  });

  test("matrix.rowsVisibleIf", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("p1");
    var qCars = new QuestionCheckboxModel("cars");
    qCars.choices = ["Audi", "BMW", "Mercedes", "Volkswagen"];
    page.addElement(qCars);
    var qBestCar = new QuestionMatrixModel("bestCar");
    qBestCar.columns = ["col1"];
    qBestCar.rows = ["Audi", "BMW", "Mercedes", "Volkswagen"];
    qBestCar.rowsVisibleIf = "{cars} contains {item}";
    page.addElement(qBestCar);
    expect(qBestCar.visibleRows.length, "cars are not selected yet").toBe(0);
    qCars.value = ["BMW"];
    expect(qBestCar.visibleRows.length, "BMW is selected").toBe(1);
    qCars.value = ["Audi", "BMW", "Mercedes"];
    expect(qBestCar.visibleRows.length, "3 cars are selected").toBe(3);
    qBestCar.rowsVisibleIf = "";
    expect(qBestCar.visibleRows.length, "there is no filter").toBe(4);
  });

  test("matrix.columnsVisibleIf", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("p1");
    var qCars = new QuestionCheckboxModel("cars");
    qCars.choices = ["Audi", "BMW", "Mercedes", "Volkswagen"];
    page.addElement(qCars);
    var qBestCar = new QuestionMatrixModel("bestCar");
    qBestCar.rows = ["col1"];
    qBestCar.columns = ["Audi", "BMW", "Mercedes", "Volkswagen"];
    qBestCar.columnsVisibleIf = "{cars} contains {item}";
    page.addElement(qBestCar);
    expect(qBestCar.visibleColumns.length, "cars are not selected yet").toBe(0);
    qCars.value = ["BMW"];
    expect(qBestCar.visibleColumns.length, "BMW is selected").toBe(1);
    qCars.value = ["Audi", "BMW", "Mercedes"];
    expect(qBestCar.visibleColumns.length, "3 cars are selected").toBe(3);
    qBestCar.columnsVisibleIf = "";
    expect(qBestCar.visibleColumns.length, "there is no filter").toBe(4);
  });
  test("matrix.visibleColumns & matrix.visibleRows", () => {
    const survey = new SurveyModel({
      elements: [{ type: "matrix", name: "q1", columns: ["Audi", "BMW", "Mercedes", "Volkswagen"], rows: ["Audi", "BMW", "Mercedes"] }]
    });
    const matrix = <QuestionMatrixModel>survey.getQuestionByName("q1");
    expect(matrix.visibleColumns.length, "There are 4 visible columns").toBe(4);
    expect(matrix.visibleRows.length, "There are 3 visible rows").toBe(3);
  });

  test("matrix.rowsVisibleIf, clear value on making the value invisible", () => {
    var survey = new SurveyModel();
    survey.clearInvisibleValues = "onHidden";
    var page = survey.addNewPage("p1");
    var qBestCar = new QuestionMatrixModel("bestCar");
    qBestCar.columns = ["col1", "col2"];
    qBestCar.rows = ["Audi", "BMW", "Mercedes", "Volkswagen"];
    qBestCar.rowsVisibleIf = "{cars} contains {item}";
    page.addElement(qBestCar);
    survey.setValue("cars", ["BMW", "Audi", "Mercedes"]);
    qBestCar.value = { BMW: "col1", Audi: "col2" };
    expect(qBestCar.value, "Audi is selected").toEqual({ BMW: "col1", Audi: "col2" });
    survey.setValue("cars", ["BMW"]);
    survey.doComplete();
    expect(qBestCar.value, "Audi is removed").toEqual({ BMW: "col1" });
    survey.clear(false);
    survey.setValue("cars", ["Mercedes"]);
    survey.doComplete();
    expect(qBestCar.isEmpty(), "All checks are removed").toEqual(true);
  });

  test("matrix.columnsVisibleIf, clear value on making the value invisible", () => {
    var survey = new SurveyModel();
    survey.clearInvisibleValues = "onHidden";
    var page = survey.addNewPage("p1");
    var qBestCar = new QuestionMatrixModel("bestCar");
    qBestCar.rows = ["col1", "col2"];
    qBestCar.columns = ["Audi", "BMW", "Mercedes", "Volkswagen"];
    qBestCar.columnsVisibleIf = "{cars} contains {item}";
    page.addElement(qBestCar);
    survey.setValue("cars", ["BMW", "Audi", "Mercedes"]);
    qBestCar.value = { col1: "BMW", col2: "Audi" };
    expect(qBestCar.value, "Audi is selected").toEqual({ col1: "BMW", col2: "Audi" });
    survey.setValue("cars", ["BMW"]);
    expect(qBestCar.value, "Audi is removed").toEqual({ col1: "BMW" });
    survey.setValue("cars", ["Mercedes"]);
    expect(qBestCar.isEmpty(), "All checks are removed").toEqual(true);
  });

  test("matrixdropdown.rowsVisibleIf", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "checkbox", name: "cars", choices: ["Audi", "BMW", "Mercedes", "Volkswagen"] },
        { type: "matrixdropdown", name: "bestCar", rows: ["Audi", "BMW", "Mercedes", "Volkswagen"],
          columns: [{ name: "col1" }], rowsVisibleIf: "{cars} contains {item}" }
      ]
    });
    const qCars = <QuestionCheckboxModel>survey.getQuestionByName("cars");
    const qBestCar = <QuestionMatrixDropdownModel>survey.getQuestionByName("bestCar");
    expect(qBestCar.visibleRows.length, "cars are not selected yet").toBe(0);
    qCars.value = ["BMW"];
    expect(qBestCar.visibleRows.length, "BMW is selected").toBe(1);
    qCars.value = ["Audi", "BMW", "Mercedes"];
    expect(qBestCar.visibleRows.length, "3 cars are selected").toBe(3);
    qBestCar.rowsVisibleIf = "";
    expect(qBestCar.visibleRows.length, "there is no filter").toBe(4);
  });

  test("matrixdropdown.columnsVisibleIf", () => {
    const survey = new SurveyModel();
    const page = survey.addNewPage("p1");
    const qCars = new QuestionCheckboxModel("cars");
    qCars.choices = ["Audi", "BMW", "Mercedes", "Volkswagen"];
    page.addElement(qCars);
    const qBestCar = new QuestionMatrixDropdownModel("bestCar");
    qBestCar.rows = ["col1"];
    qBestCar.addColumn("Audi");
    qBestCar.addColumn("BMW");
    qBestCar.addColumn("Mercedes");
    qBestCar.addColumn("Volkswagen");
    qBestCar.columnsVisibleIf = "{cars} contains {item}";
    const visColCount = (): number => {
      let res = 0;
      qBestCar.columns.forEach(col => { if (col.isColumnVisible) res ++; });
      return res;
    };
    page.addElement(qBestCar);
    expect(visColCount(), "cars are not selected yet").toBe(0);
    qCars.value = ["BMW"];
    expect(visColCount(), "BMW is selected").toBe(1);
    qCars.value = ["Audi", "BMW", "Mercedes"];
    expect(visColCount(), "3 cars are selected").toBe(3);
    qBestCar.columnsVisibleIf = "";
    expect(visColCount(), "there is no filter").toBe(4);
  });

  test("radiogroup.choicesVisibleIf, clear value on making the value invisible, bug #1093", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("p1");
    var qBestCar = new QuestionRadiogroupModel("bestCar");
    qBestCar.choices = ["Audi", "BMW", "Mercedes", "Volkswagen"];
    qBestCar.choicesVisibleIf = "{cars} contains {item}";
    page.addElement(qBestCar);
    survey.setValue("cars", ["BMW", "Audi"]);
    qBestCar.value = "Audi";
    expect(qBestCar.value, "Audi is selected").toBe("Audi");
    survey.setValue("cars", ["BMW"]);
    expect(qBestCar.isEmpty(), "Audi is cleared").toBe(true);
  });
  test("radiogroup.choicesEnableIf, clear value on making the value disable, survey.clearDisabledChoices", () => {
    var survey = new SurveyModel();
    survey.clearDisabledChoices = true;
    var page = survey.addNewPage("p1");
    var qBestCar = new QuestionRadiogroupModel("bestCar");
    qBestCar.choices = ["Audi", "BMW", "Mercedes", "Volkswagen"];
    qBestCar.choicesEnableIf = "{cars} contains {item}";
    page.addElement(qBestCar);
    survey.setValue("cars", ["BMW", "Audi"]);
    qBestCar.value = "Audi";
    expect(qBestCar.value, "Audi is selected").toBe("Audi");
    survey.setValue("cars", ["BMW"]);
    expect(qBestCar.isEmpty(), "Audi is cleared").toBe(true);
  });
  test("checkbox.choicesVisibleIf, clear value on making the value invisible, bug #1093", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("p1");
    var qBestCar = new QuestionCheckboxModel("bestCar");
    qBestCar.choices = ["Audi", "BMW", "Mercedes", "Volkswagen"];
    qBestCar.choicesVisibleIf = "{cars} contains {item}";
    page.addElement(qBestCar);
    survey.setValue("cars", ["BMW", "Audi", "Mercedes"]);
    qBestCar.value = ["BMW", "Audi"];
    expect([...(qBestCar.value)], "Audi is selected").toEqual(["BMW", "Audi"]);
    survey.setValue("cars", ["BMW"]);
    expect([...(qBestCar.value)], "Audi is removed").toEqual(["BMW"]);
    survey.setValue("cars", ["Mercedes"]);
    expect(qBestCar.isEmpty(), "All checks are removed").toEqual(true);
  });
  test("checkbox.choicesEnableIf, clear value on making the value disable, survey.clearDisabledChoices", () => {
    var survey = new SurveyModel();
    survey.clearDisabledChoices = true;
    var page = survey.addNewPage("p1");
    var qBestCar = new QuestionCheckboxModel("bestCar");
    qBestCar.choices = ["Audi", "BMW", "Mercedes", "Volkswagen"];
    qBestCar.choicesEnableIf = "{cars} contains {item}";
    page.addElement(qBestCar);
    survey.setValue("cars", ["BMW", "Audi", "Mercedes"]);
    qBestCar.value = ["BMW", "Audi"];
    expect([...(qBestCar.value)], "Audi is selected").toEqual(["BMW", "Audi"]);
    survey.setValue("cars", ["BMW"]);
    expect([...(qBestCar.value)], "Audi is removed").toEqual(["BMW"]);
    survey.setValue("cars", ["Mercedes"]);
    expect(qBestCar.isEmpty(), "All checks are removed").toEqual(true);
  });

  test("itemValue.visibleIf", () => {
    var json = {
      elements: [
        {
          type: "checkbox",
          name: "q",
          choices: [
            { value: "contactbyphone", visibleIf: "{phone} notempty" },
            { value: "contactbyemail", visibleIf: "{email} notempty" },
          ],
        },
      ],
    };
    var survey = new SurveyModel(json);
    var q = <QuestionCheckboxModel>survey.getQuestionByName("q");
    expect(q.choices[0].visibleIf, "itemValue.visibleIf loaded correctly").toBe("{phone} notempty");
    expect(q.visibleChoices.length, "Nothing is set").toBe(0);
    survey.setValue("phone", "1");
    expect(q.visibleChoices.length, "phone is set").toBe(1);
    survey.setValue("email", "2");
    expect(q.visibleChoices.length, "phone and e-mail are set").toBe(2);
  });

  test("itemValue.enableIf", () => {
    var json = {
      elements: [
        {
          type: "checkbox",
          name: "q",
          choices: [
            { value: "contactbyphone", enableIf: "{phone} notempty" },
            { value: "contactbyemail", enableIf: "{email} notempty" },
          ],
        },
      ],
    };
    var survey = new SurveyModel(json);
    var q = <QuestionCheckboxModel>survey.getQuestionByName("q");
    expect(q.choices[0].enableIf, "itemValue.visibleIf loaded correctly").toBe("{phone} notempty");
    expect(q.enabledChoices.length, "Nothing is set").toBe(0);
    survey.setValue("phone", "1");
    expect(q.enabledChoices.length, "phone is set").toBe(1);
    survey.setValue("email", "2");
    expect(q.enabledChoices.length, "phone and e-mail are set").toBe(2);
  });

  test("multipletext item title renders incorrectly if survey.questionTitleTemplate is set, bug #1170", () => {
    var json = {
      questionTitleTemplate: "{no}. {title} {require}",
      elements: [
        {
          type: "multipletext",
          name: "question1",
          items: [
            {
              name: "text1",
            },
          ],
        },
      ],
    };
    var survey = new SurveyModel(json);
    var q = <QuestionMultipleTextModel>survey.getQuestionByName("question1");
    expect(q.items[0].locTitle.renderedHtml, "There is no .").toBe("text1");
  });
  test("Question.locCommentText.renderedHtml should return the default text correctly", () => {
    var question = new Question("q1");
    expect(question.locCommentText.renderedHtml, "Get the default value correctly").toBe(surveyLocalization.getString("commentText"));
    question.commentText = "New Comment Text";
    expect(question.locCommentText.renderedHtml, "Do not use the default text").toBe("New Comment Text");
  });

  test("multipletext item is not readonly when survey is readonly, bug #1177", () => {
    var json = {
      mode: "display",
      elements: [
        {
          type: "multipletext",
          name: "question1",
          items: [
            {
              name: "text1",
            },
          ],
        },
      ],
    };
    var survey = new SurveyModel(json);
    var q = <QuestionMultipleTextModel>survey.getQuestionByName("question1");
    expect(q.items[0].editor.isReadOnly, "It should be readonly").toBe(true);
  });

  test("space in others does not work correctly , bug #1214", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "radiogroup",
          name: "q1",
          showOtherItem: true,
          choices: ["high"],
          storeOthersAsComment: false,
        },
      ],
    });
    const q = <QuestionRadiogroupModel>survey.getQuestionByName("q1");
    q.value = q.otherItem.value;
    expect(q.isOtherSelected, "other is selected").toBe(true);
    expect(q.validate(), "other is not entered").toBe(false);
    q.otherValue = " ";
    expect(q.isOtherSelected, "other is still selected").toBe(true);
    expect(q.validate(), "other is not entered, whitespace doesn't count").toBe(false);
  });

  test("Checkbox showNoneItem - modify value", () => {
    var json = {
      elements: [
        {
          type: "checkbox",
          name: "q1",
          showNoneItem: true,
          choices: [1, 2, 3, 4, 5],
        },
      ],
    };
    var survey = new SurveyModel(json);
    var q = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    expect(q.visibleChoices.length, "5 items + none").toBe(6);
    q.showNoneItem = false;
    expect(q.visibleChoices.length, "none is removed").toBe(5);
    q.showNoneItem = true;
    expect(q.visibleChoices.length, "none is added").toBe(6);
    q.value = [1, 2, "none"];
    expect([...(q.value)], "we keep only none").toEqual(["none"]);
    q.value = [1, "none"];
    expect([...(q.value)], "none should gone").toEqual([1]);
  });
  test("Checkbox showRefuseItem/showDontKnowItem - modify value", () => {
    var json = {
      elements: [
        {
          type: "checkbox",
          name: "q1",
          showRefuseItem: true,
          showDontKnowItem: true,
          choices: [1, 2, 3, 4, 5],
        },
      ],
    };
    var survey = new SurveyModel(json);
    var q = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    expect(q.visibleChoices.length, "7 items + refuse + don't know").toBe(7);

    q.showRefuseItem = false;
    expect(q.visibleChoices.length, "refuse is removed").toBe(6);
    q.showRefuseItem = true;
    expect(q.visibleChoices.length, "refuse is added").toBe(7);

    q.showDontKnowItem = false;
    expect(q.visibleChoices.length, "don't know is removed").toBe(6);
    q.showDontKnowItem = true;
    expect(q.visibleChoices.length, "don't know is added").toBe(7);

    q.value = [1, 2, "refused"];
    expect([...(q.value)], "we keep refuse only").toEqual(["refused"]);
    q.value = [1, "refused"];
    expect([...(q.value)], "refuse should gone").toEqual([1]);

    q.value = [1, 2, "dontknow"];
    expect([...(q.value)], "we keep dontknow only").toEqual(["dontknow"]);
    q.value = [1, "dontknow"];
    expect([...(q.value)], "dontknow should gone").toEqual([1]);
  });
  test("Dropdown showNoneItem", () => {
    var json = {
      elements: [
        {
          type: "dropdown",
          name: "q1",
          showNoneItem: true,
          choices: [1, 2, 3, 4, 5],
        },
      ],
    };
    var survey = new SurveyModel(json);
    var q = <QuestionDropdownModel>survey.getQuestionByName("q1");
    expect(q.visibleChoices.length, "5 items + none").toBe(6);
    q.showNoneItem = false;
    expect(q.visibleChoices.length, "none is removed").toBe(5);
    q.showNoneItem = true;
    expect(q.visibleChoices.length, "none is added").toBe(6);
  });

  test("Checkbox showSelectAllItem", () => {
    var json = {
      elements: [
        {
          type: "checkbox",
          name: "q1",
          showSelectAllItem: true,
          choices: [1, 2, 3],
        },
      ],
    };
    var survey = new SurveyModel(json);
    var q = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    expect(q.visibleChoices.length, "3 items + select all").toBe(4);
    q.showSelectAllItem = false;
    expect(q.visibleChoices.length, "select all is removed").toBe(3);
    q.showSelectAllItem = true;
    expect(q.visibleChoices.length, "none is added").toBe(4);
    expect(q.isAllSelected, "All items are not selected").toBe(false);
    expect(q.isItemSelected(q.selectAllItem), "isItemSelected returns false").toBe(false);
    q.value = [1, 2, 3];
    expect(q.isAllSelected, "All items are selected").toBe(true);
    expect(q.isItemSelected(q.selectAllItem), "isItemSelected returns true").toBe(true);
    q.showOtherItem = true;
    q.value = [1, 2, "other"];
    expect(q.isAllSelected, "3 is not selected").toBe(false);
    q.value = [1, 2, 3, "other"];
    expect(q.isAllSelected, "all + other are selected").toBe(true);
    q.value = [1, 2];
    q.toggleSelectAll();
    expect([...(q.value)], "all items are selected after clicking select all").toEqual([1, 2, 3]);
    q.toggleSelectAll();
    expect(q.isEmpty(), "value is empty").toBe(true);
    q.toggleSelectAll();
    expect([...(q.value)], "all items are selected again after clicking select all").toEqual([1, 2, 3]);
  });

  test("Do not replace period '.' with space ' ' on setting a string with '.' into valueName", () => {
    var question = new Question("q1");
    question.valueName = "q.1.";
    expect(question.valueName, "Correct the value name").toBe("q.1.");
  });

  test("readOnly property doesn't work for multipletext question, #1217", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("p");
    var question = new QuestionMultipleTextModel("q1");
    page.addQuestion(question);
    question.addItem("text1");
    question.addItem("text2");
    var itemQuestion = question.items[0].editor;
    expect(itemQuestion.isReadOnly, "It is not readOnly by default").toBe(false);
    survey.readOnly = true;
    expect(itemQuestion.isReadOnly, "survey mode is display").toBe(true);
    survey.readOnly = false;
    expect(itemQuestion.isReadOnly, "survey mode is edit").toBe(false);
    question.readOnly = true;
    expect(itemQuestion.isReadOnly, "question is readOnly").toBe(true);
  });

  test("isDisabledStyle isReadOnlyStyle properties", () => {
    var survey = new SurveyModel();
    survey.showPreviewBeforeComplete = true;
    var page = survey.addNewPage("p");
    var question = new QuestionMultipleTextModel("q1");
    expect(question.isDisabledStyle).toBe(false);

    page.addQuestion(question);
    expect(question.isReadOnlyStyle).toBe(false);
    question.readOnly = true;
    expect(question.isReadOnlyStyle).toBe(true);
    survey.showPreview();
    var questionPreview = survey.getQuestionByName("q1");
    expect(questionPreview.isReadOnlyStyle).toBe(false);
  });

  test("isPreviewStyle property", () => {
    var survey = new SurveyModel();
    survey.showPreviewBeforeComplete = true;
    var page = survey.addNewPage("p");
    var question = new QuestionMultipleTextModel("q1");
    expect(question.isPreviewStyle, "false if survey doesn't exist").toBe(false);

    page.addQuestion(question);
    expect(question.isPreviewStyle, "false in not preview mode").toBe(false);

    survey.showPreview();
    var questionPreview = survey.getQuestionByName("q1");
    expect(questionPreview.isPreviewStyle, "true in preview mode").toBe(true);
  });

  test("itemSvgIcon property", () => {
    var survey = new SurveyModel();
    survey.showPreviewBeforeComplete = true;
    var page = survey.addNewPage("p");
    var question = new QuestionRadiogroupModel("q1");
    page.addQuestion(question);

    survey.setCss({ radiogroup: { itemSvgIconId: "icon-id", itemPreviewSvgIconId: undefined } });
    expect(question.itemSvgIcon).toBe("icon-id");
    survey.showPreview();
    var questionPreview = survey.getQuestionByName("q1");
    expect(questionPreview.itemSvgIcon, "preview mode").toBe("icon-id");
    survey.setCss({ radiogroup: { itemPreviewSvgIconId: "preview-icon-id" } });
    expect(questionPreview.itemSvgIcon).toBe("preview-icon-id");
  });

  test("Boolean Radiogroup Mode itemSvgIcon property", () => {
    var survey = new SurveyModel();
    survey.showPreviewBeforeComplete = true;
    var page = survey.addNewPage("p");
    var question = new QuestionBooleanModel("q1");
    question.renderAs = "radio";
    page.addQuestion(question);

    survey.setCss({ boolean: { itemSvgIconId: "icon-id", itemPreviewSvgIconId: undefined } });
    expect(question.itemSvgIcon).toBe("icon-id");
    survey.showPreview();
    var questionPreview = survey.getQuestionByName("q1");
    expect(questionPreview.itemSvgIcon, "preview mode").toBe("icon-id");
    survey.setCss({ boolean: { itemPreviewSvgIconId: "preview-icon-id" } });
    expect(questionPreview.itemSvgIcon).toBe("preview-icon-id");
  });

  test("Multipletext, item isRequired, 0 is a valid value, bug #1225", () => {
    var question = new QuestionMultipleTextModel("q1");
    var item = question.addItem("text1");
    item.isRequired = true;
    item.inputType = "number";
    item.value = 0;
    expect(question.validate(), "There is no errors, 0 is a valid value").toBe(true);
  });

  test("Multipletext, item isRequired, make item question isRequired, bug #1983", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "multipletext",
          name: "q1",
          items: [
            {
              name: "item1",
              isRequired: true,
            },
          ],
        },
      ],
    });
    var question = <QuestionMultipleTextModel>survey.getQuestionByName("q1");
    expect(question.items[0].editor.isRequired, "Editor is requried").toBe(true);
    expect(question.items[0].editor.validate(), "item editor is required").toBe(false);
    expect(question.validate(), "question is required").toBe(false);
  });

  test("Test property hideIfChoicesEmpty", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("p1");
    var question = new QuestionCheckboxModel("q1");
    page.addElement(question);
    expect(question.isVisible, "By default it is visible").toBe(true);
    question.hideIfChoicesEmpty = true;
    expect(question.isVisible, "Choices are empty").toBe(false);
    question.showOtherItem = true;
    question.showSelectAllItem = true;
    question.showNoneItem = true;
    expect(question.isVisible, "Still choices are empty").toBe(false);
    question.choices = [1, 2, 3];
    expect(question.isVisible, "Choices are not empty").toBe(true);
    question.choicesVisibleIf = "{item} = {val1}";
    expect(question.isVisible, "Filtered choices are empty").toBe(false);
    survey.setValue("val1", 2);
    expect(question.isVisible, "There is one visible item").toBe(true);
  });
  test("Do not restore visibility for invlible question", () => {
    var survey = new SurveyModel({
      elements: [{ type: "checkbox", name: "q1", hideIfChoicesEmpty: true }]
    });
    const question = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    question.visible = false;
    question.choices = [1, 2, 3];
    expect(question.isVisible, "It should be visible, since we make it invisible in code").toBe(false);
  });
  test("Change hideIfChoicesEmpty property default value", () => {
    let question = new QuestionCheckboxModel("q1");
    expect(question.hideIfChoicesEmpty, "default value #1").toBe(false);
    const prop = Serializer.findProperty("selectbase", "hideIfChoicesEmpty");
    prop.defaultValue = true;
    question = new QuestionCheckboxModel("q1");
    expect(question.hideIfChoicesEmpty, "default value #2").toBe(true);
    prop.defaultValue = undefined;
    question = new QuestionCheckboxModel("q1");
    expect(question.hideIfChoicesEmpty, "default value #3").toBe(false);
  });
  test("Test property hideIfRowsEmpty", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("p1");
    var question = new QuestionMatrixModel("q1");
    page.addQuestion(question);
    expect(question.isVisible, "By default it is visible").toBe(true);
    question.hideIfRowsEmpty = true;
    expect(question.isVisible, "Rows are empty").toBe(false);
    question.rows = [1, 2, 3];
    expect(question.isVisible, "Rows are not empty").toBe(true);
    question.rowsVisibleIf = "{item} = {val1}";
    expect(question.isVisible, "Filtered rows are empty").toBe(false);
    survey.setValue("val1", 2);
    expect(question.isVisible, "There is one visible item").toBe(true);
  });

  test("Test property hideIfRowsEmpty - load from json", () => {
    var survey = new SurveyModel({
      elements: [{ type: "matrix", name: "q1", hideIfRowsEmpty: true }],
    });
    var question = <QuestionMatrixModel>survey.getQuestionByName("q1");
    expect(question.rows.length, "There is no rows").toBe(0);
    expect(question.isVisible, "It is invisible").toBe(false);
  });

  test("Do not change value for readOnly dropdown even if value is not in choices", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "dropdown",
          name: "q1",
          readOnly: true,
          defaultValue: 3,
        },
      ],
    });
    var question = <QuestionDropdownModel>survey.getQuestionByName("q1");
    expect(question.value, "Value is still 3").toBe(3);
  });

  test("QuestionHtml + Survey.onProcessHtml event, bug#1294", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("p1");
    var question = <QuestionHtmlModel>page.addNewQuestion("html", "q1");
    survey.onProcessHtml.add(function (survey, options) {
      options.html = options.html + "-add-";
    });
    question.html = "text";
    expect(question.locHtml.renderedHtml, "process html").toBe("text-add-");
  });

  test("Question Html ignore Html processing = true", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("p1");
    survey.onProcessHtml.add(function (survey, options) {
      options.html = options.html + "-add-";
    });
    var question = <QuestionHtmlModel>page.addNewQuestion("html", "q1");
    question.html = "text1";
    expect(question.locHtml.renderedHtml, "proccess html").toBe("text1-add-");
    question.ignoreHtmlProgressing = true;
    question.html = "text2";
    expect(question.locHtml.renderedHtml, "do not proccess html").toBe("text2");
  });

  test("Survey.onProcessHtml add reason property into options", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("p1");
    var question = <QuestionHtmlModel>page.addNewQuestion("html", "q1");
    question.html = "text";
    survey.completedHtml = "complete survey";
    survey.completedBeforeHtml = "complete before survey";
    survey.loadingHtml = "loading survey";
    survey.onProcessHtml.add(function (survey, options) {
      options.html = options.html + "-add-" + options.reason;
    });
    expect(question.locHtml.renderedHtml, "#1").toBe("text-add-html-question");
    expect(survey.processedCompletedHtml, "#2").toBe("complete survey-add-completed");
    expect(survey.processedCompletedBeforeHtml, "#3").toBe("complete before survey-add-completed-before");
    expect(survey.processedLoadingHtml, "#4").toBe("loading survey-add-loading");
  });

  test("question.paddingLeft and question.paddingRight", () => {
    var survey = new SurveyModel({
      elements: [{ type: "dropdown", name: "q1" }],
    });
    var question = <Question>survey.getQuestionByName("q1");
    expect(question.paddingLeft, "left is empty").toBe("");
    expect(question.paddingRight, "right is empty").toBe("");
    expect(question.getRootStyle()).toEqual({ });
    question.indent = 1;
    question.rightIndent = 2;
    expect(question.paddingLeft, "left is not empty").toBe("20px");
    expect(question.paddingRight, "right is not empty").toBe("40px");
    expect(question.getRootStyle()).toEqual({ "--sv-element-add-padding-left": "20px", "--sv-element-add-padding-right": "40px" });
    survey.css = {
      question: {
        indent: 0
      }
    };
    expect(question.paddingLeft, "left is empty").toBe("");
    expect(question.paddingRight, "right is empty").toBe("");
    expect(question.getRootStyle()).toEqual({ });
  });
  test("question.paddingLeft from json and defaultV2", () => {
    const survey = new SurveyModel({
      elements: [{ type: "text", name: "q1", indent: 1 }],
    });
    const question = <Question>survey.getQuestionByName("q1");
    expect(question.paddingLeft).toBe("20px");
  });

  test("selectbase question item.visibleIf and survey.data on set, bug#1394, https://surveyjs.answerdesk.io/ticket/details/T1228", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrix",
          name: "qid261",
          columns: ["0", "1"],
          rows: [
            {
              value: "oid11772",
              text: "AES",
              visibleIf: "{qid260} contains 'oid11772'",
            },
            {
              value: "oid13403",
              text: "RC6",
              visibleIf: "{qid260} contains 'oid13403'",
            },
            {
              value: "oid13404",
              text: "SEED",
              visibleIf: "{qid260} contains 'oid13404'",
            },
          ],
        },
      ],
    });
    survey.data = {
      qid260: ["oid11772", "oid13404"],
      qid261: { oid11772: "1", oid13404: "1" },
    };

    var question = <QuestionMatrixModel>survey.getQuestionByName("qid261");
    expect(question.value, "value set correctly").toEqual({ oid11772: "1", oid13404: "1" });
    expect(question.visibleRows.length, "Two rows are visible").toBe(2);
    expect(question.visibleRows[0].value, "The first row value is set").toBe("1");
    expect(question.visibleRows[1].value, "The second row value is set").toBe("1");
  });
  test("matrix single choice. Restore new visible values from defaultValue if they are exists, Issue# T3038, https://surveyjs.answerdesk.io/ticket/details/T3038", () => {
    var survey = new SurveyModel({
      clearInvisibleValues: "onHidden",
      elements: [
        {
          type: "matrix",
          name: "q1",
          columns: ["1", "2", "3", "4"],
          rows: [
            {
              value: "v1",
            },
            {
              value: "v2",
            },
            {
              value: "v3",
              visibleIf: "{val1} = 'a'",
            },
            {
              value: "v4",
              visibleIf: "{val1} = 'a'",
            },
          ],
          defaultValue: { v1: "1", v2: "2", v3: "3", v4: "4" },
        },
      ],
    });
    var question = <QuestionMatrixModel>survey.getQuestionByName("q1");
    survey.setValue("val1", "a");
    expect(question.value, "Restore rows values from default").toEqual({ v1: "1", v2: "2", v3: "3", v4: "4" });
    survey.setValue("val1", "b");
    survey.doComplete();
    expect(question.value, "Remove two rows").toEqual({ v1: "1", v2: "2" });
  });

  test("Load survey with requiredIf expression", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "text",
          name: "q1",
          defaultValue: 1,
        },
        {
          type: "text",
          name: "q2",
          requiredIf: "{q1} = 1",
        },
      ],
    });
    var question = <Question>survey.getQuestionByName("q2");
    expect(question.isRequired, "The question becomes required on loading").toBe(true);
    survey.setValue("q1", 2);
    expect(question.isRequired, "The question becomes unrequired on changing value").toBe(false);
    survey.setValue("q1", 1);
    expect(question.isRequired, "The question becomes required on changing value").toBe(true);
  });
  test("dropdown allowClear, https://surveyjs.answerdesk.io/ticket/details/T1499", () => {
    var question = new QuestionDropdownModel("q1");
    expect(question.allowClear, "allowClear is true by default").toBe(true);

    question.allowClear = false;
    var json = new JsonObject().toJsonObject(question);
    var checkedJson = {
      name: "q1",
      allowClear: false,
    };
    expect(json, "allowClear is serialized").toEqual(checkedJson);
  });
  test("multipletext could not load default value correctly, https://surveyjs.answerdesk.io/ticket/details/T1659", () => {
    var json = {
      pages: [
        {
          name: "p1",
          elements: [
            {
              type: "multipletext",
              name: "_metaData",
              defaultValue: {
                _metaQuestVersion: "1.0.1",
                _metaQuestName: "Packaging",
                _metaQuestDateTime: "2019-02-20",
                _metaQuestAuthor: "Someone",
              },
              items: [
                {
                  name: "_metaQuestVersion",
                },
                {
                  name: "_metaQuestName",
                },
                {
                  name: "_metaQuestDateTime",
                },
                {
                  name: "_metaQuestAuthor",
                },
              ],
            },
          ],
        },
      ],
    };
    var survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.setJsonObject(json);
    var question = <QuestionMultipleTextModel>(
      survey.getQuestionByName("_metaData")
    );
    expect(question.items[0].editor.isDesignMode, "Question has design mode").toBe(true);
    expect(question.defaultValue, "Default value loads correctly").toEqual({
      _metaQuestVersion: "1.0.1",
      _metaQuestName: "Packaging",
      _metaQuestDateTime: "2019-02-20",
      _metaQuestAuthor: "Someone",
    });
  });

  test("Options do not work correctly together: survey.storeOthersAsComment and question.storeOthersAsComment, Bug#1635", () => {
    var json = {
      storeOthersAsComment: false,
      elements: [
        {
          storeOthersAsComment: true,
          type: "radiogroup",
          name: "q1",
          showOtherItem: true,
          choices: [1, 2],
        },
      ],
    };
    var survey = new SurveyModel(json);
    var q = <QuestionRadiogroupModel>survey.getQuestionByName("q1");
    q.value = "other";
    q.otherValue = "Other text";
    expect(survey.data, "Store other in comment").toEqual({ q1: "other", "q1-Comment": "Other text" });

    survey.clear();
    q.storeOthersAsComment = false;
    q.value = "other";
    q.otherValue = "Other text2";
    expect(survey.data, "Store other in value").toEqual({ q1: "Other text2" });

    survey.clear();
    survey.storeOthersAsComment = false;
    q.storeOthersAsComment = "default";
    q.value = "other";
    q.otherValue = "Other text3";
    expect(survey.data, "Store other in value, take the opton from survey").toEqual({ q1: "Other text3" });

    survey.clear();
    survey.storeOthersAsComment = true;
    q.storeOthersAsComment = "default";
    q.value = "other";
    q.otherValue = "Other text4";
    expect(survey.data, "Store other in comment, take the opton from survey").toEqual({ q1: "other", "q1-Comment": "Other text4" });
  });

  test("Could not assign validators", () => {
    var question = new QuestionTextModel("q1");
    question.validators.push(new NumericValidator(1, 10));
    question.validators = [new NumericValidator(1, 10)];
    expect((<NumericValidator>question.validators[0]).minValue, "MinValue is correct").toBe(1);
  });

  test("Radio group comment without showOtherItem, Bug #1747", () => {
    var json = {
      elements: [
        {
          type: "radiogroup",
          name: "q1",
          showCommentArea: true,
          choices: [1, 2, 3, 4, 5],
        },
      ],
    };
    var survey = new SurveyModel(json);
    survey.data = { q1: 2, "q1-Comment": "Init data" };
    var question = <QuestionRadiogroupModel>survey.getQuestionByName("q1");
    expect(question.comment, "Initial data is here").toBe("Init data");
    survey.data = { q1: 3, "q1-Comment": "Next data" };
    expect(question.comment, "It is set correctley").toBe("Next data");
    survey.doComplete();
    expect(survey.data, "Comment is here").toEqual({ q1: 3, "q1-Comment": "Next data" });
  });

  test("other's comment value is properly set from data", () => {
    var json = {
      elements: [
        {
          type: "checkbox",
          name: "q1",
          showOtherItem: true,
        },
      ],
    };
    var survey = new SurveyModel(json);
    var question = <QuestionSelectBase>survey.getAllQuestions()[0];
    survey.data = { q1: ["other"], "q1-Comment": "comment" };
    survey.data = { q1: [] };
    survey.data = { q1: ["other"], "q1-Comment": "comment1" };
    expect(question.comment).toBe("comment1");
  });

  test("QuestionImagePicker.isItemSelected function", () => {
    var question = new QuestionImagePickerModel("q1");
    new JsonObject().toObject(
      {
        type: "imagepicker",
        name: "question3",
        multiSelect: true,
        choices: [
          { value: 1, imageLink: "test1" },
          { value: 2, imageLink: "test2" },
          { value: 3, imageLink: "test3" },
          { value: 4, imageLink: "test4" },
          { value: 5, imageLink: "test5" }
        ]
      },
      question
    );

    question.value = [1, 3];
    expect(question.isItemSelected(question.choices[0]), "The first time is selected").toBe(true);
    expect(question.isItemSelected(question.choices[1]), "The second time is not selected").toBe(false);
    expect(question.isItemSelected(question.choices[2]), "The third time is selected").toBe(true);
    question = new QuestionImagePickerModel("q1");
    new JsonObject().toObject(
      {
        type: "imagepicker",
        name: "question3",
        multiSelect: false,
        choices: [
          { value: 1, imageLink: "test1" },
          { value: 2, imageLink: "test2" },
          { value: 3, imageLink: "test3" },
          { value: 4, imageLink: "test4" },
          { value: 5 }
        ],
      },
      question
    );
    question.value = 2;
    expect(question.renderedValue, "The first set correctly").toBe(2);
    expect(question.isItemSelected(question.choices[0]), "The first time is not selected").toBe(false);
    expect(question.isItemSelected(question.choices[1]), "The second time is selected").toBe(true);
    expect(question.isItemSelected(question.choices[2]), "The third time is not selected").toBe(false);

    question.value = 5;
    expect(question.isItemSelected(question.choices[4]), "The fifth time is not selected").toBe(false);
  });

  test("QuestionImagePicker 0 item value test", () => {
    var question = new QuestionImagePickerModel("q1");
    new JsonObject().toObject(
      {
        type: "imagepicker",
        name: "question3",
        choices: [1, 2, 3, 4, 0],
      },
      question
    );
    question.value = 0;
    expect(question.value, "Value should be 0 and not undefined").toBe(0);
    expect(question.isEmpty(), "Question is not empty").toBe(false);
  });

  test("QuestionImagePicker create item value for choices restful test", () => {
    var question = new QuestionImagePickerModel("q1");
    const itemValue = question.choicesByUrl.createItemValue("val");
    expect(itemValue.getType(), "imageitemvalue created").toBe("imageitemvalue");
  });

  test("QuestionImagePicker.isAnswerCorrect function", () => {
    var question = new QuestionImagePickerModel("q1");
    new JsonObject().toObject(
      {
        type: "imagepicker",
        name: "question3",
        multiSelect: true,
        correctAnswer: [1, 2],
        choices: [1, 2, 3, 4, 5],
      },
      question
    );
    question.value = [2, 1];
    expect(question.isAnswerCorrect(), "[1,2]== [2, 1] for image picker").toBe(true);
    question.value = [2, 3];
    expect(question.isAnswerCorrect(), "[1,2]!= [2, 3] for image picker").toBe(false);
    question = new QuestionImagePickerModel("q1");
    new JsonObject().toObject(
      {
        type: "imagepicker",
        name: "question3",
        multiSelect: false,
        correctAnswer: 2,
        choices: [1, 2, 3, 4, 5],
      },
      question
    );
    question.value = 1;
    expect(question.isAnswerCorrect(), "1 <> 2").toBe(false);
    question.value = 2;
    expect(question.isAnswerCorrect(), "2 = 2").toBe(true);
  });

  test("question visibleIf, enableIf and requiredIf with async functions in expression", () => {
    var returnResult1: (res: any) => void;
    var returnResult2: (res: any) => void;
    var returnResult3: (res: any) => void;
    function asyncFunc1(params: any): any {
      returnResult1 = this.returnResult;
      return false;
    }
    function asyncFunc2(params: any): any {
      returnResult2 = this.returnResult;
      return false;
    }
    function asyncFunc3(params: any): any {
      returnResult3 = this.returnResult;
      return false;
    }
    var returnResult = function (res) {
      if (!!returnResult1) returnResult1(res);
      if (!!returnResult2) returnResult2(res);
      if (!!returnResult3) returnResult3(res);
    };
    FunctionFactory.Instance.register("asyncFunc1", asyncFunc1, true);
    FunctionFactory.Instance.register("asyncFunc2", asyncFunc2, true);
    FunctionFactory.Instance.register("asyncFunc3", asyncFunc3, true);
    var survey = new SurveyModel({
      elements: [
        {
          type: "text",
          name: "q1",
          visibleIf: "asyncFunc1({q2}) = 2",
          enableIf: "asyncFunc2({q2}) = 4",
          requiredIf: "asyncFunc3({q2}) = 6",
        },
        { type: "text", name: "q2" },
      ],
    });
    returnResult(0);
    var question = survey.getQuestionByName("q1");
    survey.setValue("q2", 1);
    expect(question.isVisible, "q1 is invisible by default").toBe(false);
    returnResult(survey.getValue("q2") * 2);
    expect(question.isVisible, "q1 is visible, q2 = 1").toBe(true);
    expect(question.isReadOnly, "q1 is not enabled, q2 = 1").toBe(true);
    expect(question.isRequired, "q1 is not required, q2 = 1").toBe(false);
    survey.setValue("q2", 2);
    expect(question.isReadOnly, "q1.isReadOnly is not changed yet").toBe(true);
    returnResult(survey.getValue("q2") * 2);
    expect(question.isVisible, "q1 is invisible, q2 = 2").toBe(false);
    expect(question.isReadOnly, "q1 is enabled, q2 = 2").toBe(false);
    expect(question.isRequired, "q1 is not required, q2 = 2").toBe(false);
    survey.setValue("q2", 3);
    expect(question.isRequired, "q1.isRequired is not changed yet").toBe(false);
    returnResult(survey.getValue("q2") * 2);
    expect(question.isVisible, "q1 is invisible, q2 = 3").toBe(false);
    expect(question.isReadOnly, "q1 is not enabled, q2 = 3").toBe(true);
    expect(question.isRequired, "q1 is required, q2 = 3").toBe(true);

    FunctionFactory.Instance.unregister("asyncFunc1");
    FunctionFactory.Instance.unregister("asyncFunc2");
    FunctionFactory.Instance.unregister("asyncFunc3");
  });

  test("test question.getDisplayValue(key, value)", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "radiogroup",
          name: "q1",
          choices: [
            { value: 1, text: "one" },
            { value: 2, text: "two" },
          ],
        },
        {
          type: "checkbox",
          name: "q2",
          choices: [
            { value: 1, text: "one" },
            { value: 2, text: "two" },
            { value: 3, text: "three" },
          ],
        },
        {
          type: "boolean",
          name: "q3",
        },
        {
          type: "multipletext",
          name: "q4",
          items: [
            { name: "item1", title: "Item 1" },
            { name: "item2", title: "Item 2" },
            { name: "item3", title: "Item 3" },
          ],
        },
        {
          type: "imagepicker",
          name: "q5",
          choices: [
            { value: 1, text: "one" },
            { value: 2, text: "two" },
            { value: 3, text: "three" },
          ],
        },
      ],
    });
    survey.data = { q1: 1, q2: [1, 2], q5: [1, 2] };
    var q1 = survey.getQuestionByName("q1");
    var q2 = survey.getQuestionByName("q2");
    var q3 = survey.getQuestionByName("q3");
    var q4 = survey.getQuestionByName("q4");
    var q5 = survey.getQuestionByName("q5");
    expect(q1.getDisplayValue(true), "radigroup displayvalue works").toBe("one");
    expect(q1.getDisplayValue(true, 2), "radigroup displayvalue for value as a param works").toBe("two");
    expect(q2.getDisplayValue(true), "checkbox displayvalue works").toBe("one, two");
    expect(q2.getDisplayValue(true, [2, 3]), "checkbox displayvalue for value as a param works").toBe("two, three");
    expect(q2.getDisplayValue(true, 2), "checkbox displayvalue for non array value as a param works").toBe("two");
    expect(q3.getDisplayValue(true, true), "boolean displayvalue for true").toBe("Yes");
    expect(q3.getDisplayValue(true, false), "boolean displayvalue for false").toBe("No");
    expect(q4.getDisplayValue(true, { item1: "value1", item3: "value3" }), "multiple text displayvalue").toEqual({ "Item 1": "value1", "Item 3": "value3" });
    expect(q5.getDisplayValue(true), "imagepicker displayvalue works, array").toBe("one, two");
    q5.value = 2;
    expect(q5.getDisplayValue(true), "imagepicker displayvalue works, single value").toBe("two");
  });
  test("Multiple text question validation and async functions in expression", () => {
    let returnResult1: (res: any) => void = (res: boolean) => { };
    let returnResult2: (res: any) => void = (res: boolean) => { };
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

    const question = new QuestionMultipleTextModel("q1");
    const item1 = question.addItem("item1");
    const item2 = question.addItem("item2");
    item1.validators.push(new ExpressionValidator("asyncFunc1() = 1"));
    item2.validators.push(new ExpressionValidator("asyncFunc2() = 1"));
    let callbackRes: any = undefined;
    expect(question.validate(false, false, false, (res: boolean) => {
      callbackRes = res;
    }), "There is no errors by default").toBeUndefined();
    expect(question.isRunningValidators, "We have two running validators").toBe(true);
    expect(callbackRes, "The callback is not called yet, #1").toBeUndefined();
    returnResult1(1);
    expect(question.isRunningValidators, "We have one running validator").toBe(true);
    expect(callbackRes, "The callback is not called yet, #2").toBeUndefined();
    returnResult2(1);
    expect(question.isRunningValidators, "We are fine now").toBe(false);
    expect(callbackRes, "The callback is called yet").toBe(true);
    FunctionFactory.Instance.unregister("asyncFunc1");
    FunctionFactory.Instance.unregister("asyncFunc2");
  });
  test("question.getSupportedValidators", () => {
    expect(new QuestionMatrixModel("q").getSupportedValidators()).toEqual([
      "expression",
    ]);
    expect(new QuestionTextModel("q").getSupportedValidators()).toEqual([
      "expression",
      "text",
      "regex"
    ]);
    expect(new QuestionCommentModel("q").getSupportedValidators()).toEqual([
      "expression",
      "text",
      "regex",
    ]);
    expect(new QuestionCheckboxModel("q").getSupportedValidators()).toEqual([
      "expression",
      "answercount",
    ]);
    expect(new QuestionImagePickerModel("q").getSupportedValidators()).toEqual([
      "expression",
      "answercount",
    ]);
  });
  test("QuestionImagePickerModel.supportAutoAdvance", () => {
    const q = new QuestionImagePickerModel("q");
    expect(q.supportAutoAdvance(), "It supports by default").toBe(true);
    q.multiSelect = true;
    expect(q.supportAutoAdvance(), "It doesn't support it for multiselect").toBe(false);
    q.multiSelect = false;
    expect(q.supportAutoAdvance(), "multiselect is false").toBe(true);
  });
  test("QuestionTextModel.supportAutoAdvance", () => {
    const q = new QuestionTextModel("q");
    expect(q.supportAutoAdvance(), "It supports by default").toBe(true);
    q.inputType = "date";
    expect(q.supportAutoAdvance(), "Do not support for date").toBe(false);
    q.inputType = "text";
    expect(q.supportAutoAdvance(), "Default inputType again").toBe(true);
    q.textUpdateMode = "onTyping";
    expect(q.supportAutoAdvance(), "textUpdateMode = 'onTyping'").toBe(false);
    q.textUpdateMode = "onBlur";
    expect(q.supportAutoAdvance(), "textUpdateMode = 'onBlur'").toBe(true);
  });

  test("QuestionImagePickerModel and carry forward", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "imagepicker", name: "q1",
          choices: [
            { value: 1, imageLink: "test1" },
            { value: 2, imageLink: "test2" },
            { value: 3, imageLink: "test3" }]
        },
        { type: "imagepicker", name: "q2", choicesFromQuestion: "q1",
          choices: [{ value: 4, imageLink: "test4" }], }
      ]
    });
    const q2 = <QuestionImagePickerModel>survey.getQuestionByName("q2");
    const choices = q2.visibleChoices;
    expect(choices.length, "There are 3 values").toBe(3);
    expect(choices[0].getType(), "choice item type is correct").toBe("imageitemvalue");
    expect(choices[0].imageLink, "image link is copied").toBe("test1");
  });

  test("QuestionImagePickerModel and disable imageLink localization", () => {
    const prop = Serializer.findProperty("imageitemvalue", "imageLink");
    prop.isLocalizable = false;
    const survey = new SurveyModel({
      elements: [
        { type: "imagepicker", name: "q1",
          choices: [
            { value: 1, imageLink: "test1" }]
        }]
    });
    const q1 = <QuestionImagePickerModel>survey.getQuestionByName("q1");
    survey.locale = "de";
    q1.choices[0].imageLink = "test2";
    expect(q1.toJSON(), "no localization in imageLink").toEqual({ name: "q1",
      choices: [{ value: 1, imageLink: "test2" }] });
    prop.isLocalizable = true;
  });

  test("Question<=Base propertyValueChanged", () => {
    var json = { title: "title", elements: [{ type: "text", name: "q" }] };
    var survey = new SurveyModel(json);
    var question = survey.getQuestionByName("q");
    var counter = 0;

    survey.onPropertyValueChangedCallback = (
      name: string,
      oldValue: any,
      newValue: any,
      sender: SurveyModel,
      arrayChanges: ArrayChanges
    ) => {
      counter++;
    };

    expect(counter, "initial").toBe(0);

    question.title = "new";

    expect(counter, "callback called").toBe(1);
  });

  test("Question.addError(SurveyError|string)", () => {
    var question = new QuestionTextModel("q");
    question.addError(new RequreNumericError("Error 1"));
    question.addError("Error 2");
    expect(question.errors.length, "There are two errors").toBe(2);
    expect(question.errors[0].getErrorType(), "numeric").toBe("requirenumeric");
    expect(question.errors[1].getErrorType(), "custom").toBe("custom");
    expect(question.errors[0].text, "numeric error text").toBe("Error 1");
    expect(question.errors[1].text, "custom error text").toBe("Error 2");
  });

  test("QuestionText min/max value and renderedMin/renderedMax", () => {
    var survey = new SurveyModel({ elements: [{ type: "text", name: "q" }] });
    var question = <QuestionTextModel>survey.getQuestionByName("q");
    expect(question.min, "Empty min").toBeUndefined();
    expect(question.max, "Empty max").toBeUndefined();
    question.min = "1";
    question.max = "5";
    expect(question.min, "min 1").toBe("1");
    expect(question.max, "max 5").toBe("5");
    question.inputType = "number";
    expect(question.min, "min reset").toBeUndefined();
    expect(question.max, "max reset").toBeUndefined();
    question.inputType = "date";
    expect(question.min, "min not set").toBeUndefined();
    expect(question.max, "max is not set").toBeUndefined();
    expect(question.renderedMin, "renderedMin not set").toBeUndefined();
    expect(question.renderedMax, "renderedMax is default").toBe("2999-12-31");
    question.min = "2000-01-01";
    question.max = "2020-12-31";
    expect(question.min, "min is set").toBe("2000-01-01");
    expect(question.max, "max is set").toBe("2020-12-31");
    question.inputType = "number";
    question.min = "1";
    question.max = "=1+2";
    expect(question.renderedMin, "min is set to 1").toBe("1");
    expect(question.renderedMax, "max is set to 3").toBe(3);
  });
  function getDateStr(date: Date): string {
    return Helpers.convertDateToString(date);
  }
  test("QuestionText renderedMin/renderedMax, today()", () => {
    var survey = new SurveyModel({
      elements: [{ type: "text", name: "q", max: "=today()" }],
    });
    var question = <QuestionTextModel>survey.getQuestionByName("q");
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    var todayStr = getDateStr(date).slice(0, 10);
    expect(question.renderedMax, "today in format yyyy-mm-dd").toBe(todayStr);
  });
  test("QuestionText max/maxValueExpression, today()", () => {
    var survey = new SurveyModel({
      elements: [{ type: "text", name: "q", maxValueExpression: "today()" }],
    });
    var question = <QuestionTextModel>survey.getQuestionByName("q");
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    var todayStr = getDateStr(date).slice(0, 10);
    expect(question.renderedMax, "renderedMax: today in format yyyy-mm-dd").toBe(todayStr);
  });
  test("QuestionText mixValueExpression/maxValueExpression, today()", () => {
    const survey = new SurveyModel({
      elements: [{ type: "text", name: "q", minValueExpression: "today()", maxValueExpression: "today(10)" }],
    });
    const question = <QuestionTextModel>survey.getQuestionByName("q");
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    var todayStr = getDateStr(date).slice(0, 10);
    var maxDate = new Date();
    maxDate.setHours(0, 0, 0, 0);
    maxDate.setDate(maxDate.getDate() + 10);
    var todayPlus10DaysStr = getDateStr(maxDate).slice(0, 10);
    expect(question.renderedMin, "renderedMin: today in format yyyy-mm-dd").toBe(todayStr);
    expect(question.renderedMax, "renderedMax: today + 10 days in format yyyy-mm-dd").toBe(todayPlus10DaysStr);
  });
  test("QuestionText min/maxValueExpression, today()", () => {
    var survey = new SurveyModel({
      elements: [{ type: "text", name: "q", min: "=today()" }],
    });
    var question = <QuestionTextModel>survey.getQuestionByName("q");
    expect(question.minValueExpression, "convert the min into minValueExpression").toBe("today()");
    expect(question.min, "min value becomes empty").toBeFalsy();
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    var todayStr = getDateStr(date).slice(0, 10);
    expect(question.renderedMin, "renderedMin: today in format yyyy-mm-dd").toBe(todayStr);
  });
  test("QuestionText min/maxValueExpression, today()", () => {
    var survey = new SurveyModel({
      elements: [
        { type: "text", inputType: "date", name: "q1" },
        {
          type: "text",
          inputType: "date",
          name: "q2",
          minValueExpression: "{q1}",
        },
      ],
    });
    var question = <QuestionTextModel>survey.getQuestionByName("q2");
    expect(question.renderedMin, "renderedMin is empty").toBeFalsy();
    survey.setValue("q1", "2021-02-18");
    expect(question.renderedMin, "renderedMin: gets from q1").toBe("2021-02-18");
  });
  test("QuestionText min/max do not allow to set value to survey if values are not in the range", () => {
    var survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1", inputType: "number", min: 3, max: 10 },
        {
          type: "text",
          name: "q2",
          inputType: "date",
          min: "2020-01-01",
          max: "2030-01-01",
        },
      ],
    });
    var q1 = <QuestionTextModel>survey.getQuestionByName("q1");
    var q2 = <QuestionTextModel>survey.getQuestionByName("q2");
    q1.value = 2;
    expect(q1.value, "Value 2 is set into question").toBe(2);
    expect(survey.getValue("q1"), "Value 2 is not set into survey").toBeUndefined();
    expect(q1.errors.length, "There is no errors on setting invalid value").toBe(0);
    expect(q1.validate(), "has errors on calling validate").toBe(false);
    expect(q1.errors.length, "We have one error now").toBe(1);
    expect(q1.errors[0].text, "Check error text").toBe("The value should not be less than 3");
    q1.value = 5;
    expect(q1.value, "Value 5 is set into question").toBe(5);
    expect(survey.getValue("q1"), "Value 5 is set into survey").toBe(5);
    expect(q1.errors.length, "There is no errors on setting valid value").toBe(0);
    expect(q1.validate(), "validate return false").toBe(true);
    q1.value = 3;
    expect(q1.value, "Value 3 is set into question").toBe(3);
    expect(survey.getValue("q1"), "Value 3 is set into survey").toBe(3);
    q1.value = 11;
    expect(q1.value, "Value 11 is set into question").toBe(11);
    expect(survey.getValue("q1"), "Value 11 is not set into survey").toBe(3);
    q1.value = 10;
    expect(q1.value, "Value 3 is set into question").toBe(10);
    expect(survey.getValue("q1"), "Value 10 is set into survey").toBe(10);

    q2.value = "2019-01-01";
    expect(new Date(q2.value).getUTCFullYear(), "Value new Date('2019-01-01') is set into question").toBe(2019);
    expect(survey.getValue("q2"), "Value new Date('2019-01-01') is not set into survey").toBeUndefined();
    q2.value = "2022-01-01";
    expect(new Date(q2.value).getUTCFullYear(), "Value new Date('2022-01-01') is set into question").toBe(2022);
    expect(new Date(survey.getValue("q2")).getUTCFullYear(), "Value new Date('2022-01-01') is set into survey").toBe(2022);
    q2.value = "2020-01-01";
    expect(new Date(q2.value).getUTCFullYear(), "Value new Date('2020-01-01') is set into question").toBe(2020);
    expect(new Date(survey.getValue("q2")).getUTCFullYear(), "Value new Date('2020-01-01') is set into survey").toBe(2020);
    q2.value = "2031-01-01";
    expect(new Date(q2.value).getUTCFullYear(), "Value new Date('2031-01-01') is set into question").toBe(2031);
    expect(new Date(survey.getValue("q2")).getUTCFullYear(), "Value new Date('2031-01-01') is not set into survey").toBe(2020);
    q2.value = "2030-01-01";
    expect(new Date(q2.value).getUTCFullYear(), "Value Date('2030-01-01') is set into question").toBe(2030);
    expect(new Date(survey.getValue("q2")).getUTCFullYear(), "Value new Date('2030-01-01') is set into survey").toBe(2030);
  });

  test("QuestionText min/max properties and global setting", () => {
    settings.minDate = "1900-01-01";
    settings.maxDate = "2100-01-01";
    var survey = new SurveyModel({
      elements: [
        { type: "text", inputType: "date", name: "q1", min: "2020-01-01" },
        { type: "text", inputType: "date", name: "q2", max: "2030-01-01" },
      ],
    });
    var q1 = <QuestionTextModel>survey.getQuestionByName("q1");
    var q2 = <QuestionTextModel>survey.getQuestionByName("q2");

    expect(q1.renderedMin).toBe("2020-01-01");
    expect(q1.renderedMax).toBe("2100-01-01");
    expect(q2.renderedMin).toBe("1900-01-01");
    expect(q2.renderedMax).toBe("2030-01-01");
    settings.minDate = "";
    settings.maxDate = "";
  });
  test("QuestionText min/max properties for date-time and browser errors, bug#10561", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", inputType: "date", name: "q1", min: "2020-01-01", minErrorText: "min error" },
      ],
    });
    const q1 = <QuestionTextModel>survey.getQuestionByName("q1");
    q1.value = "2019-05-05";
    q1.onKeyUp({ target: { validationMessage: "test error message" } });
    q1.validate();
    expect(q1.errors.length, "There is one error").toBe(1);
    expect(q1.errors[0].text, "use minErrorText instead of browser message").toBe("min error");
  });
  test("QuestionText step property, modify the step error in a survey JSON, bug#10959", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", inputType: "number", name: "q1", step: 2, stepErrorText: "step error {0}#" },
      ],
    });
    const q1 = <QuestionTextModel>survey.getQuestionByName("q1");
    q1.value = 3;
    q1.onKeyUp({ target: { validationMessage: "test error message" } });
    q1.validate();
    expect(q1.errors.length, "There is one error").toBe(1);
    expect(q1.errors[0].text, "use stepErrorText instead of browser message").toBe("step error 2#");
  });
  test("Question defaultValue as expression", () => {
    var survey = new SurveyModel({
      elements: [{ type: "text", name: "q", defaultValue: "=1+2" }],
    });
    var question = <QuestionTextModel>survey.getQuestionByName("q");
    expect(question.defaultValue, "defaultValue is empty").toBeFalsy();
    expect(question.defaultValueExpression, "convert expression from default value").toBe("1+2");
    expect(question.value, "run expression").toBe(3);
  });
  test("Question defaultValueExpression", () => {
    var survey = new SurveyModel({
      elements: [{ type: "text", name: "q", defaultValueExpression: "1+2" }],
    });
    var question = <QuestionTextModel>survey.getQuestionByName("q");
    expect(question.value, "run expression").toBe(3);
  });
  test("Question defaultValueExpression with async function", () => {
    var returnResultFunc: (res: any) => void;
    function asyncFunc(params: any): any {
      returnResultFunc = this.returnResult;
      return false;
    }
    FunctionFactory.Instance.register("asyncFunc", asyncFunc, true);

    var survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1", defaultValue: 1 },
        { type: "text", name: "q2", defaultValueExpression: "asyncFunc({q1})" },
      ],
    });
    var question = <QuestionTextModel>survey.getQuestionByName("q2");
    expect(question.value, "value is empty").toBeFalsy();
    returnResultFunc(survey.getValue("q1") * 3);
    expect(question.value, "Default async function is executed").toBe(3);
    FunctionFactory.Instance.unregister("asyncFunc");
  });

  test("Question defaultValueExpression change value until it is not modified directly", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1", defaultValue: 1 },
        { type: "text", name: "q2", defaultValueExpression: "{q1} + 2" },
      ],
    });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    expect(q2.value, "initial value").toBe(3);
    q1.value = 5;
    expect(q2.value, "q1 is changed").toBe(7);
    q2.value = 4;
    expect(q2.value, "changed dirrectly").toBe(4);
    q1.value = 10;
    expect(q2.value, "stop react on defaultValueExpression").toBe(4);
  });
  test("defaultValueExpression for boolean question", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "boolean", name: "q1", defaultValueExpression: "true" },
      ],
    });
    const q1 = survey.getQuestionByName("q1");
    expect(q1.value, "initial value set correctly").toBe(true);
  });
  test("Question defaultValueExpression && onExpressionRunning #10258", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1", defaultValueExpression: "{q2} + 1" },
        { type: "text", name: "q2" }
      ]
    });
    let allow = true;
    let expression = "{q2} + 1";
    let counter = 0;
    survey.onExpressionRunning.add((sender, options) => {
      if ((<any>options.element).name === "q1" && options.propertyName === "defaultValueExpression") {
        options.allow = allow;
        options.expression = expression;
        counter ++;
      }
    });
    const q1 = survey.getQuestionByName("q1");
    expect(q1.value, "q1.value #1").toBe(1);
    expect(counter, "counter #1").toBe(0);
    survey.setValue("q2", 2);
    expect(q1.value, "q1.value #2").toBe(3);
    expect(counter, "counter #2").toBe(2);
    allow = false;
    survey.setValue("q2", 3);
    expect(q1.value, "q1.value #3").toBe(3);
    expect(counter, "counter #3").toBe(3);
    allow = true;
    expression = "{q2} + 2";
    survey.setValue("q2", 4);
    expect(q1.value, "q1.value #4").toBe(6);
    expect(counter, "counter #4").toBe(5);
  });
  test("Question minValueExpression && onExpressionRunning #10258", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1", minValueExpression: "{q2} + 1" },
        { type: "text", name: "q2" }
      ]
    });
    let allow = true;
    let expression = "{q2} + 1";
    let counter = 0;
    survey.data = { q2: 1 };
    survey.onExpressionRunning.add((sender, options) => {
      if ((<any>options.element).name === "q1" && options.propertyName === "minValueExpression") {
        options.allow = allow;
        options.expression = expression;
        counter ++;
      }
    });
    const q1 = <QuestionTextModel>survey.getQuestionByName("q1");
    expect(q1.renderedMin, "q1.min #1").toBe(2);
    expect(counter, "counter #1").toBe(0);
    survey.setValue("q2", 2);
    expect(q1.renderedMin, "q1.min #2").toBe(3);
    expect(counter, "counter #2").toBe(1);
    allow = false;
    survey.setValue("q2", 3);
    expect(q1.renderedMin, "q1.min #3").toBe(3);
    expect(counter, "counter #3").toBe(2);
    allow = true;
    expression = "{q2} + 2";
    survey.setValue("q2", 4);
    expect(q1.renderedMin, "q1.min #4").toBe(6);
    expect(counter, "counter #4").toBe(3);
  });

  test("QuestionRating rateStep less than 1", () => {
    var question = new QuestionRatingModel("q");
    expect(question.visibleRateValues.length, "There are 5 values").toBe(5);
    expect(question.visibleRateValues[2].locText.renderedHtml, "The third value").toBe("3");
    question.rateMin = 0;
    question.rateStep = 0.1;
    question.rateMax = 0.5;
    expect(question.visibleRateValues.length, "There are 6 values").toBe(6);
    expect(question.visibleRateValues[3].locText.renderedHtml, "The fourth value").toBe("0.3");
  });
  test("QuestionRating convert value to number when needed, Bug#2421", () => {
    var question = new QuestionRatingModel("q");
    question.value = "2";
    expect(question.value, "Convert to 2").toBe(2);
    question.value = undefined;
    expect(question.value, "undefined 1").toBe(undefined);
    question.rateValues = [1, "2", "3", 4];
    question.value = "3";
    expect(question.value, "No need to convert").toBe("3");
    question.value = "1";
    expect(question.value, "Convert to item.value, 1").toBe(1);
    question.value = undefined;
    expect(question.value, "undefined 2").toBe(undefined);
  });

  test("QuestionRating value is reset when clicked again, Issue#2886", () => {
    var question = new QuestionRatingModel("q");
    question.setValueFromClick("1");
    expect(question.value, "Set to 1").toBe(1);
    question.setValueFromClick("2");
    expect(question.value, "Set to 2").toBe(2);
    question.setValueFromClick("2");
    expect(question.value, "No longer 2").not.toBe(2);
    expect(isNaN(question.value), "Value is reset").toBe(true);
  });
  test("QuestionRating value with string labels is reset when clicked again", () => {
    var question = new QuestionRatingModel("q");
    question.rateValues = ["l1", "l2", "l3"];
    question.setValueFromClick("l1");
    expect(question.value, "Set to l1").toBe("l1");
    question.setValueFromClick("l2");
    expect(question.value, "Set to l2").toBe("l2");
    question.setValueFromClick("l2");
    expect(question.value, "No longer l2").not.toBe("l2");
    expect(question.value, "Value is reset").toBe(undefined);
  });
  test("Do not serialize default values labelTrue/labelFalse for boolean question, Bug #2231", () => {
    var question = new QuestionBooleanModel("q");
    expect(question.locLabelTrue.textOrHtml, "Default value for labelTrue").toBe("Yes");
    expect(question.locLabelFalse.textOrHtml, "Default value for labelFalse").toBe("No");
    expect(question.toJSON(), "Serialize type and name only").toEqual({ name: "q" });
  });
  test("Checkbox question getItemClass() + survey.onUpdateChoiceItemCss", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "checkbox",
          name: "q1",
          storeOthersAsComment: false,
          showSelectAllItem: true,
          showNoneItem: true,
          choices: [1, 2],
        },
      ],
    });
    setOldTheme(survey);
    var q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    q1.value = [1];
    const checkCss = (actual: string, expected: string, message: string): void => {
      const actualList = actual.split(" ");
      const expectedList = expected.split(" ");
      expectedList.forEach(cl => {
        expect(actualList.indexOf(cl) >= 0, message + ": '" + cl + "' is not found in " + actual).toBe(true);
      });
    };
    checkCss(
      q1.getItemClass(q1.visibleChoices[0]),
      "sv_q_checkbox sv-q-col-1 sv_q_checkbox_selectall",
      "select all"
    );
    checkCss(
      q1.getItemClass(q1.visibleChoices[1]),
      "sv_q_checkbox sv-q-col-1 checked",
      "item 1"
    );
    checkCss(
      q1.getItemClass(q1.visibleChoices[2]),
      "sv_q_checkbox sv-q-col-1",
      "item 2"
    );
    checkCss(
      q1.getItemClass(q1.visibleChoices[3]),
      "sv_q_checkbox sv-q-col-1 sv_q_checkbox_none",
      "None"
    );
    survey.onUpdateChoiceItemCss.add((sender, options) => {
      if (options.item.value == 2) {
        options.css = options.css + " custom";
      }
    });
    checkCss(
      q1.getItemClass(q1.visibleChoices[2]),
      "sv_q_checkbox sv-q-col-1 custom",
      "item 2, value = 2, survey.onUpdateChoiceItemCss"
    );
  });
  test("Convert correctValue/defaultValue correctly on JSON loading", () => {
    var json = {
      elements: [
        {
          type: "radiogroup",
          name: "radio_correct",
          items: [1, 2, 3],
          defaultValue: 1,
          correctAnswer: "234",
        },
        {
          type: "checkbox",
          name: "check_correct",
          items: [1, 2, 3],
          defaultValue: [1],
          correctAnswer: [2],
        },
        {
          type: "radiogroup",
          name: "radio_incorrect",
          items: [1, 2, 3],
          defaultValue: [1, 2],
          correctAnswer: [2],
        },
        {
          type: "checkbox",
          name: "check_incorrect",
          items: [1, 2, 3],
          defaultValue: 1,
          correctAnswer: "123",
        },
      ],
    };
    var survey = new SurveyModel(json);
    var radio_correct = survey.getQuestionByName("radio_correct");
    var check_correct = survey.getQuestionByName("check_correct");
    var radio_incorrect = survey.getQuestionByName("radio_incorrect");
    var check_incorrect = survey.getQuestionByName("check_incorrect");
    expect(radio_correct.defaultValue, "radio_correct, defaultValue").toBe(1);
    expect(radio_correct.correctAnswer, "radio_correct, correctAnswer").toBe("234");
    expect(check_correct.defaultValue, "check_correct, defaultValue").toEqual([1]);
    expect(check_correct.correctAnswer, "check_correct, correctAnswer").toEqual([2]);
    expect(radio_incorrect.defaultValue, "radio_incorrect, defaultValue").toBe(1);
    expect(radio_incorrect.correctAnswer, "radio_incorrect, correctAnswer").toBe(2);
    expect(check_incorrect.defaultValue, "check_incorrect, defaultValue").toEqual([1]);
    expect(check_incorrect.correctAnswer, "check_incorrect, correctAnswer").toEqual(["123"]);
  });

  test("Question.getProgressInfo()", () => {
    var question = new QuestionTextModel("q1");
    expect(question.getProgressInfo()).toEqual({
      questionCount: 1,
      answeredQuestionCount: 0,
      requiredQuestionCount: 0,
      requiredAnsweredQuestionCount: 0,
    });
    question.value = "1";
    expect(question.getProgressInfo()).toEqual({
      questionCount: 1,
      answeredQuestionCount: 1,
      requiredQuestionCount: 0,
      requiredAnsweredQuestionCount: 0,
    });
    question.isRequired = true;
    expect(question.getProgressInfo()).toEqual({
      questionCount: 1,
      answeredQuestionCount: 1,
      requiredQuestionCount: 1,
      requiredAnsweredQuestionCount: 1,
    });
  });
  test("QuestionMultipleText.getProgressInfo()", () => {
    var question = new QuestionMultipleTextModel("q1");
    question.addItem("item1");
    question.addItem("item2");
    question.addItem("item3");
    expect(question.getProgressInfo(), "empty").toEqual({
      questionCount: 3,
      answeredQuestionCount: 0,
      requiredQuestionCount: 0,
      requiredAnsweredQuestionCount: 0,
    });
    question.isRequired = true;
    expect(question.getProgressInfo(), "root is required").toEqual({
      questionCount: 3,
      answeredQuestionCount: 0,
      requiredQuestionCount: 1,
      requiredAnsweredQuestionCount: 0,
    });
    question.value = { item1: "1" };
    expect(question.getProgressInfo(), "root is requried and has one value").toEqual({
      questionCount: 3,
      answeredQuestionCount: 1,
      requiredQuestionCount: 1,
      requiredAnsweredQuestionCount: 1,
    });
    question.isRequired = false;
    expect(question.getProgressInfo(), "has one value").toEqual({
      questionCount: 3,
      answeredQuestionCount: 1,
      requiredQuestionCount: 0,
      requiredAnsweredQuestionCount: 0,
    });
    question.items[0].isRequired = true;
    question.items[1].isRequired = true;
    expect(question.getProgressInfo(), "two items are required and has one value").toEqual({
      questionCount: 3,
      answeredQuestionCount: 1,
      requiredQuestionCount: 2,
      requiredAnsweredQuestionCount: 1,
    });
    question.isRequired = true;
    expect(question.getProgressInfo(), "root is required and two items are required and has one value").toEqual({
      questionCount: 3,
      answeredQuestionCount: 1,
      requiredQuestionCount: 2,
      requiredAnsweredQuestionCount: 1,
    });
    question.items[1].editor.visible = false;
    expect(question.getProgressInfo(), "root is required and two items are required and has one value and one required item is invisible").toEqual({
      questionCount: 2,
      answeredQuestionCount: 1,
      requiredQuestionCount: 1,
      requiredAnsweredQuestionCount: 1,
    });
  });
  test("Set value with showOtherItem that is not in the list", () => {
    var survey = new SurveyModel({
      elements: [
        { type: "dropdown", name: "q1", choices: [1, 2], showOtherItem: true },
        { type: "checkbox", name: "q2", choices: [1, 2], showOtherItem: true },
      ],
    });
    survey.data = { q1: "NonInList" };
    var question = <QuestionDropdownModel>survey.getQuestionByName("q1");
    expect(question.value, "other is set").toBe(question.otherItem.value);
    expect(question.comment, "comment is set").toBe("NonInList");
    survey.data = { q1: 1 };
    expect(question.value, "value is set").toBe(1);
    expect(question.comment, "comment is empty").toBe("");
    survey.data = { q1: "NonInList2" };
    expect(question.value, "other is set second time").toBe(question.otherItem.value);
    expect(question.comment, "comment is set second time").toBe("NonInList2");

    survey.data = { q2: [1, "NonInList"] };
    var question2 = <QuestionCheckboxModel>survey.getQuestionByName("q2");
    expect([...(question2.value)], "checkbox: other is set").toEqual([1, question2.otherItem.value]);
    expect(question2.comment, "checkbox: comment is set").toBe("NonInList");
    survey.data = { q2: [1, 2] };
    expect([...(question2.value)], "checkbox: value is set").toEqual([1, 2]);
    expect(question2.comment, "checkbox: comment is empty").toBe("");
    survey.data = { q2: [2, "NonInList2"] };
    expect([...(question2.value)], "checkbox: other is set second time").toEqual([2, question2.otherItem.value]);
    expect(question2.comment, "checkbox: comment is set second time").toBe("NonInList2");
  });
  test("question.isInputTextUpdate", () => {
    const survey = new SurveyModel({
      elements: [{ type: "text", name: "q1" }],
    });
    const question = <QuestionTextModel>survey.getQuestionByName("q1");
    expect(question.isInputTextUpdate, "survey.textUpdateMode == onBlur (default)").toBe(false);
    survey.textUpdateMode = "onTyping";
    expect(question.isInputTextUpdate, "survey.textUpdateMode == onTyping").toBe(true);
    question.inputType = "color";
    expect(question.isInputTextUpdate, "inputType = color").toBe(false);
    question.inputType = "number";
    expect(question.isInputTextUpdate, "inputType = number").toBe(true);
    question.inputType = "color";
    expect(question.isInputTextUpdate, "inputType = color").toBe(false);
    question.inputType = "date";
    expect(question.isInputTextUpdate, "inputType = date && settings.updateDateOnTyping = true").toBe(true);
  });

  test("Possible to submit a survey without selecting color #10808", () =>{

    const input = document.createElement("input");
    input.type = "color";

    const survey = new SurveyModel({
      elements: [{
        "type": "text",
        "name": "q1",
        "isRequired": true,
        "inputType": "color"
      }],
    });

    const q1 = <QuestionTextModel>survey.getQuestionByName("q1");

    q1.onBlur({ target: input });
    expect(q1.isEmpty(), "value is empty").toBe(true);
    q1.onChange({ target: input });
    expect(q1.isEmpty(), "value is not empty").toBe(false);
  });

  test("question.isInputTextUpdate && mask", () => {
    const survey = new SurveyModel({
      textUpdateMode: "onTyping",
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2", maskType: "numeric" }
      ],
    });
    const q1 = <QuestionTextModel>survey.getQuestionByName("q1");
    const q2 = <QuestionTextModel>survey.getQuestionByName("q2");
    expect(q1.isInputTextUpdate, "survey.textUpdateMode == onTyping").toBe(true);
    expect(q2.isInputTextUpdate, "maskType is not 'none'").toBe(false);
  });
  test("matirix and survey.onValueChanged event, Bug#2408", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrix",
          name: "q1",
          columns: ["col1", "col2"],
          rows: ["row1", "row2"],
        },
      ],
    });
    var question = <QuestionMatrixModel>survey.getQuestionByName("q1");
    survey.onValueChanging.add(function (sender, options) {
      var keys = [];
      for (var key in options.value) {
        keys.push(key);
      }
      if (keys.length == 2 && !!options.oldValue) {
        for (var key in options.oldValue) {
          delete options.value[key];
          break;
        }
      }
    });
    var rows = question.visibleRows;
    rows[0].value = "col1";
    expect(question.value, "initial set correctly").toEqual({ row1: "col1" });
    rows[1].value = "col1";
    expect(question.value, "remove value in question").toEqual({ row2: "col1" });
    expect(rows[0].value, "Clear value onValueChanging event").toBeFalsy();
  });
  test("min/max properties do not load if they are upper inputType, Bug#", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "text",
          name: "q1",
          min: 0,
          max: 100,
          inputType: "number",
        },
      ],
    });
    var question = <QuestionTextModel>survey.getQuestionByName("q1");
    expect(question.min, "min value is set").toBe(0);
    expect(question.max, "max value is set").toBe(100);
  });
  test("min/max properties and checkErrorsMode equals to 'onValueChanging', Bug#2647", () => {
    var survey = new SurveyModel({
      checkErrorsMode: "onValueChanging",
      elements: [
        {
          type: "text",
          name: "q1",
          min: 0,
          max: 100,
          inputType: "number",
        },
      ],
    });
    var question = <QuestionTextModel>survey.getQuestionByName("q1");
    question.value = 10;
    expect(survey.getValue("q1"), "Set 10 to survey").toBe(10);
    question.value = -5;
    expect(question.errors.length, "There is an error").toBe(1);
    expect(question.errors[0].text, "The error text is correct").toBe("The value should not be less than 0");
    expect(survey.getValue("q1"), "Could not set -5 to survey").toBe(10);
    question.value = 500;
    expect(survey.getValue("q1"), "Could not set 500 to survey").toBe(10);
    expect(question.errors.length, "There is an error").toBe(1);
    question.value = 50;
    expect(question.errors.length, "There is no errors").toBe(0);
    expect(survey.getValue("q1"), "Set 50 to survey").toBe(50);

    question.value = 500;
    expect(question.errors.length, "There is an error, #2").toBe(1);
    question.value = 50;
    expect(question.errors.length, "There is no errors, #2").toBe(0);
    question.value = 500;
    expect(question.errors.length, "There is an error, #3").toBe(1);
    question.value = 50;
    expect(question.errors.length, "There is no errors, #3").toBe(0);
  });

  test("setvalue trigger dosen't work for question name with '.', Bug#2420", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "text",
          name: "a.b",
        },
      ],
      triggers: [
        {
          type: "setvalue",
          expression: "{q1} = 1",
          setToName: "a.b",
          setValue: 2,
        },
      ],
    });
    survey.setValue("q1", 1);
    expect(survey.data, "trigger works correctly").toEqual({ q1: 1, "a.b": 2 });
  });
  test("setvalue trigger dosen't work for question name with '.', Bug#2597", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "dropdown",
          name: "question.name1",
          choices: ["item1", "item2", "item3", "item4"],
        },
        {
          type: "text",
          name: "question.name2",
        },
      ],
      triggers: [
        {
          type: "setvalue",
          expression: "{question.name1} anyof ['item1', 'item2']",
          setToName: "question.name2",
          setValue: "one",
        },
        {
          type: "setvalue",
          expression: "{question.name1} anyof ['item3', 'item4']",
          setToName: "question.name2",
          setValue: "two",
        },
      ],
    });
    survey.setValue("question.name1", ["item1"]);
    expect(survey.getValue("question.name2"), "trigger one works correctly").toBe("one");
    survey.setValue("question.name1", ["item3"]);
    expect(survey.getValue("question.name2"), "trigger two works correctly").toBe("two");
  });
  test("maxSelectedChoices in checkbox", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "checkbox",
          name: "q1",
          choices: [1, 2, 3, 4, 5],
          maxSelectedChoices: 2,
          showSelectAllItem: true,
          showOtherItem: true,
        },
      ],
    });
    var question = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    expect(question.choices[0].isEnabled, "the first item is enabled").toBe(true);
    expect(question.otherItem.isEnabled, "otherItem is enabled").toBe(true);
    expect(question.selectAllItem.isEnabled, "select all is disabled").toBe(false);
    question.value = [2, 3];
    expect(question.choices[0].isEnabled, "the first item is disabled now").toBe(false);
    expect(question.choices[1].isEnabled, "the second item is selected").toBe(true);
    expect(question.otherItem.isEnabled, "otherItem is disabled").toBe(false);
    question.value = [2];
    expect(question.choices[0].isEnabled, "the first item is enabled again").toBe(true);
    expect(question.otherItem.isEnabled, "otherItem is enabled again").toBe(true);
    question.value = [2, "other"];
    expect(question.choices[0].isEnabled, "the first item is disabled again").toBe(false);
    expect(question.otherItem.isEnabled, "otherItem is enabled, it is selected").toBe(true);
  });

  test("select items and then set maxSelectedChoices in checkbox", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "checkbox",
          name: "q1",
          choices: [1, 2, 3, 4, 5],
          showSelectAllItem: true,
          showOtherItem: true,
        },
      ],
    });
    var question = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    expect(question.choices[0].isEnabled, "the first item is enabled").toBe(true);
    expect(question.choices[4].isEnabled, "the first item is enabled").toBe(true);
    expect(question.otherItem.isEnabled, "otherItem is enabled").toBe(true);
    question.value = [2, 3];
    expect(question.choices[0].isEnabled, "the first item is enabled").toBe(true);
    expect(question.choices[1].isEnabled, "the second item is selected").toBe(true);
    expect(question.otherItem.isEnabled, "otherItem is enabled").toBe(true);
    question.maxSelectedChoices = 2;
    expect(question.choices[0].isEnabled, "the first item is disabled now").toBe(false);
    expect(question.choices[1].isEnabled, "the second item is selected").toBe(true);
    expect(question.otherItem.isEnabled, "otherItem is disabled").toBe(false);
  });

  test("select items and then set minSelectedChoices in checkbox", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "checkbox",
          name: "q1",
          choices: [1, 2, 3, 4, 5],
          showSelectAllItem: true,
          showOtherItem: true,
        },
      ],
    });
    var question = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    question.minSelectedChoices = 3;
    question.value = [2, 3];
    question.validate();
    expect(question.validate(), "has errors").toBe(false);

    question.value = [2, 3, 4];
    question.validate();
    expect(question.validate(), "has no errors").toBe(true);
  });

  test("Matrix Question: columns with true/false values", () => {
    var matrix = new QuestionMatrixModel("q1");
    matrix.columns = [true, false, 0, "0", 1];
    matrix.rows = ["row1", "row2", "row3", "row4"];
    matrix.visibleRows[0].value = "true";
    expect(matrix.visibleRows[0].value, "Set true and not 'true'").toBe(true);
    matrix.visibleRows[0].value = "false";
    expect(matrix.visibleRows[0].value, "Set false and not 'false'").toBe(false);
    matrix.visibleRows[0].value = "0";
    expect(matrix.visibleRows[0].value, "Set '0' and not 0").toBe("0");
  });
  test("Base Select Question: choicesFromQuestion", () => {
    var survey = new SurveyModel({
      elements: [
        { type: "checkbox", name: "q1", choices: [1, 2, 3, 4, 5] },
        {
          type: "checkbox",
          name: "q2",
          choices: [1, 2, 3],
          choicesFromQuestion: "q1",
        },
        { type: "radiogroup", name: "q3", choices: [1, 2, 3, 4, 5, 6, 7] },
      ],
    });
    var q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    var q2 = <QuestionCheckboxModel>survey.getQuestionByName("q2");
    expect(q2.visibleChoices.length, "Get choices from q1").toBe(5);
    q2.choicesFromQuestion = "q3";
    expect(q2.visibleChoices.length, "Get choices from q3").toBe(7);
    q2.choicesFromQuestion = "q1";
    expect(q2.visibleChoices.length, "Get choices from q1 again").toBe(5);
    q1.choices.push(new ItemValue(6));
    expect(q2.visibleChoices.length, "q1.choices updated").toBe(6);
  });
  test("Base Select Question: choicesFromQuestionMode", () => {
    var survey = new SurveyModel({
      elements: [
        { type: "checkbox", name: "q1", choices: [1, 2, 3, 4, 5] },
        {
          type: "checkbox",
          name: "q2",
          choices: [1, 2, 3],
          choicesFromQuestion: "q1",
          choicesFromQuestionMode: "selected",
        },
      ],
    });
    var q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    var q2 = <QuestionCheckboxModel>survey.getQuestionByName("q2");
    expect(q2.visibleChoices.length, "There is no selected").toBe(0);
    q1.value = [1, 4];
    expect(q2.visibleChoices.length, "There are two selected items").toBe(2);
    q2.choicesFromQuestionMode = "unselected";
    expect(q2.visibleChoices.length, "There are 3  unselected items").toBe(3);
    q2.choicesFromQuestionMode = "all";
    expect(q2.visibleChoices.length, "Show all items").toBe(5);
    q1.choicesVisibleIf = "{item} > 2";
    expect(q2.visibleChoices.length, "Appy q1.choicesVisibleIf").toBe(3);
    q2.choicesFromQuestionMode = "unselected";
    expect(q2.visibleChoices.length, "Appy choicesFromQuestionMode and choicesVisibleIf").toBe(2);
  });
  test("Case insensitive variables names in item and choice Bug#10677", () => {
    var survey = new SurveyModel({
      elements: [
        { type: "radiogroup", name: "q1", choices: [1, 2, 3, 4, 5] },
        {
          type: "checkbox",
          name: "q2",
          choices: [1, 2, 3, 4, 5],
          choicesVisibleIf: "{Item} > {q1}",
        },
      ],
    });
    var q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    var q2 = <QuestionCheckboxModel>survey.getQuestionByName("q2");

    expect(q2.visibleChoices.length, "There is no selected").toBe(0);

    q1.value = 1;
    expect(q2.visibleChoices.length, "There are four items > 1").toBe(4);

    q1.value = 3;
    expect(q2.visibleChoices.length, "There are two items > 3").toBe(2);
  });
  test("Base Select Question: choicesFromQuestion double tunnel", () => {
    var survey = new SurveyModel({
      elements: [
        { type: "checkbox", name: "q1", choices: [1, 2, 3, 4, 5] },
        {
          type: "radiogroup",
          name: "q2",
          choicesFromQuestion: "q1",
          choicesFromQuestionMode: "selected",
        },
        {
          type: "dropdown",
          name: "q3",
          choicesFromQuestion: "q2",
          choicesFromQuestionMode: "unselected",
        },
      ],
    });
    var q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    var q2 = <QuestionCheckboxModel>survey.getQuestionByName("q2");
    var q3 = <QuestionCheckboxModel>survey.getQuestionByName("q3");
    expect(q2.visibleChoices.length, "There is no selected in q2").toBe(0);
    expect(q3.visibleChoices.length, "There is no selected in q3").toBe(0);
    q1.value = [1, 4, 5];
    expect(q2.visibleChoices.length, "There are three selected items in q2").toBe(3);
    expect(q3.visibleChoices.length, "There are three selected items in q3").toBe(3);
    q2.value = 4;
    expect(q3.visibleChoices.length, "There are two selected items in q3 now").toBe(2);
  });
  test("Reset choicesFromQuestion on deleting main question", () => {
    var survey = new SurveyModel({
      elements: [
        { type: "checkbox", name: "q1", choices: [1, 2, 3, 4, 5] },
        {
          type: "checkbox",
          name: "q2",
          choices: [1, 2, 3],
          choicesFromQuestion: "q1",
        },
        { type: "radiogroup", name: "q3", choices: [1, 2, 3, 4, 5, 6, 7] },
      ],
    });
    var q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    var q2 = <QuestionCheckboxModel>survey.getQuestionByName("q2");
    expect(q2.choicesFromQuestion, "choicesFromQuestion is here").toBeTruthy();
    expect(q2.visibleChoices.length, "Get choices from q1").toBe(5);
    survey.pages[0].removeElement(q1);
    q1.dispose();
    expect(q2.choicesFromQuestion, "choicesFromQuestion is reset").toBeFalsy();
    expect(q2.visibleChoices.length, "Get choices from q2").toBe(3);
  });
  test("choicesFromQuestion predefined data, Bug#2648", () => {
    var survey = new SurveyModel({
      elements: [
        { type: "checkbox", name: "q1", choices: [1, 2, 3, 4, 5] },
        {
          type: "checkbox",
          name: "q2",
          choicesFromQuestion: "q1",
          choicesFromQuestionMode: "selected",
        },
      ],
    });
    survey.data = { q1: [1, 3, 5] };
    var q2 = <QuestionCheckboxModel>survey.getQuestionByName("q2");
    expect(q2.choicesFromQuestion, "choicesFromQuestion is here").toBeTruthy();
    expect(q2.visibleChoices.length, "Get choices from q1.value").toBe(3);
  });
  test("Checkbox: Carry Forward and showOtherItem", () => {
    var survey = new SurveyModel({
      elements: [
        { type: "checkbox", name: "q1", choices: [1, 2, 3, 4, 5], showOtherItem: true },
        {
          type: "checkbox",
          name: "q2",
          choicesFromQuestion: "q1",
          choicesFromQuestionMode: "selected",
        },
      ],
    });
    var q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    var q2 = <QuestionCheckboxModel>survey.getQuestionByName("q2");

    expect([...(q2.visibleChoices)]).toEqual([]);
    expect(q2.isEmpty()).toEqual(true);

    q1.value = [2, 3, "other"];
    expect(q2.visibleChoices.length, "2, 3 other is empty").toBe(2);
    q1.otherValue = "someText";
    expect(q2.visibleChoices.length, "2, 3 and other").toBe(3);
    expect(q2.visibleChoices[2].value, "other value").toBe("other");
    expect(q2.visibleChoices[2].text, "other text").toBe("someText");
  });
  test("choicesFromQuestion showSelectAllItem, showNoneItem, showOtherItem properties, Bug#", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "checkbox",
          name: "q1",
          choices: [1, 2, 3],
          showSelectAllItem: true,
          showNoneItem: true,
          showOtherItem: true,
        },
        {
          type: "checkbox",
          name: "q2",
          choicesFromQuestion: "q1",
          showSelectAllItem: true,
          showNoneItem: true,
          showOtherItem: true,
        },
      ],
    });
    var q2 = <QuestionCheckboxModel>survey.getQuestionByName("q2");
    expect(q2.choicesFromQuestion, "choicesFromQuestion is here").toBeTruthy();
    expect(q2.visibleChoices.length, "We do not duplicate selectedAll, none and other").toBe(6);
  });
  test("choicesFromQuestion clear dropdown value on unselect in checkbox, Bug#5833", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "checkbox",
          name: "q1",
          choices: [1, 2, 3]
        },
        {
          type: "dropdown",
          name: "q2",
          choicesFromQuestion: "q1",
          choicesFromQuestionMode: "selected"
        },
        {
          type: "tagbox",
          name: "q3",
          choicesFromQuestion: "q1",
          choicesFromQuestionMode: "selected"
        },
      ],
    });
    const q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    const q2 = <QuestionDropdownModel>survey.getQuestionByName("q2");
    const q3 = <QuestionTagboxModel>survey.getQuestionByName("q3");
    q1.value = [1, 2];
    q2.value = 1;
    q3.value = [1, 2];
    q1.value = [2, 3];
    expect(q2.isEmpty(), "Value is cleared in dropdown").toBe(true);
    expect([...(q3.value)], "One item is cleared in tagbox").toEqual([2]);
  });
  test("choicesFromQuestion references non-SelectBase question, Bug https://github.com/surveyjs/survey-creator/issues/3745", () => {
    var survey = new SurveyModel({
      elements: [
        { type: "rating", name: "q1", "rateValues": [
          "item1",
          "item2",
          "item3"
        ]
        },
        {
          type: "checkbox",
          name: "q2",
          choicesFromQuestion: "q1",
          choices: ["item1", "item2"]
        },
      ],
    });
    var q2 = <QuestionCheckboxModel>survey.getQuestionByName("q2");
    expect(q2.choicesFromQuestion, "choicesFromQuestion is here").toBeTruthy();
    expect(q2["activeChoices"].length, "We do not duplicate selectedAll, none and other").toBe(2);
  });
  test("text question dataList", () => {
    var survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1", dataList: ["abc", "def", "ghk"] },
        { type: "text", name: "q2" },
      ],
    });
    var q1 = <QuestionTextModel>survey.getQuestionByName("q1");
    var q2 = <QuestionTextModel>survey.getQuestionByName("q2");
    expect(q1.dataList).toEqual(["abc", "def", "ghk"]);
    expect(q1.dataListId).toBe(q1.id + "_datalist");
    expect(q2.dataList).toEqual([]);
    expect(q2.dataListId).toBeUndefined();
    q2.dataList = ["item1", "item2"];
    expect(q2.dataList, "Set from the code correctly").toEqual(["item1", "item2"]);
  });
  test("text question renderedStep", () => {
    var survey = new SurveyModel({
      elements: [
        { type: "text", inputType: "number", name: "q1" },
        { type: "text", inputType: "number", name: "q2", step: 0.2 },
        { type: "text", inputType: "time", name: "q3" },
        { type: "text", inputType: "time", name: "q4", step: 1 },
      ],
    });
    var q1 = <QuestionTextModel>survey.getQuestionByName("q1");
    var q2 = <QuestionTextModel>survey.getQuestionByName("q2");
    var q3 = <QuestionTextModel>survey.getQuestionByName("q3");
    var q4 = <QuestionTextModel>survey.getQuestionByName("q4");
    expect(q1.renderedStep, "Default value is 'any'").toBe("any");
    expect(q2.renderedStep, "get value from step").toBe(0.2);
    expect(q3.renderedStep, "time: step is empty if not set").toBeUndefined();
    expect(q4.renderedStep, "time: step is set").toBe(1);
  });
  test("text question renderedInputSize and inputWidth", () => {
    var survey = new SurveyModel({
      elements: [
        { type: "text", inputType: "text", name: "q1", size: 10 },
        { type: "text", inputType: "number", name: "q2", size: 10 },
        { type: "text", inputType: "text", name: "q3" },
      ],
    });
    var q1 = <QuestionTextModel>survey.getQuestionByName("q1");
    var q2 = <QuestionTextModel>survey.getQuestionByName("q2");
    var q3 = <QuestionTextModel>survey.getQuestionByName("q2");
    expect(q1.renderedInputSize, "q1 rendered size is 10").toBe(10);
    expect(q2.renderedInputSize, "q2 rendered size is empty").toBeUndefined();
    expect(q3.renderedInputSize, "q3 rendered size is empty").toBeUndefined();
    q1.size = 12;
    expect(q1.renderedInputSize, "q1 rendered size is 12").toBe(12);

    expect(q1.inputWidth, "q1 inputWidth is auto").toBe("auto");
    expect(q2.inputWidth, "q2 inputWidth is empty").toBe("");
    expect(q3.inputWidth, "q3 inputWidth is empty").toBe("");

    expect(q1.inputStyle.width, "q1 inputStyle width is auto").toBe("auto");
    expect(q2.inputStyle.width, "q2 inputStyle width is undefined").toBe("");
    expect(q3.inputStyle.width, "q3 inputStyle width is undefined").toBe("");
  });
  test("Multiple Text Question: renderedInputSize", () => {
    var mText = new QuestionMultipleTextModel("mText");
    mText.items.push(new MultipleTextItemModel("q1"));
    mText.items.push(new MultipleTextItemModel("q2"));
    mText.items.push(new MultipleTextItemModel("q3"));
    var q1 = mText.items[0].editor;
    var q2 = mText.items[1].editor;
    var q3 = mText.items[2].editor;
    q2.inputType = "number";
    q1.size = 10;
    expect(q1.renderedInputSize, "q1 rendered size is 10").toBe(10);
    expect(q2.renderedInputSize, "q2 rendered size is empty").toBeUndefined();
    expect(q3.renderedInputSize, "q3 rendered size is empty").toBeUndefined();
    mText.itemSize = 15;
    expect(q1.renderedInputSize, "q1 rendered size is 10").toBe(10);
    expect(q2.renderedInputSize, "q2 rendered size is still empty").toBeUndefined();
    expect(q3.renderedInputSize, "q3 rendered size is 15, from parent").toBe(15);
  });
  test("Multiple Text Question: errorLocation", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "multipletext",
          name: "q1",
          items: [
            {
              name: "text1",
            }
          ],
        },
      ],
    });
    const q = <QuestionMultipleTextModel>survey.getQuestionByName("q1");
    const qItem = q.items[0].editor;
    expect(qItem.getErrorLocation(), "survey, #1").toBe("top");
    survey.questionErrorLocation = "bottom";
    expect(qItem.getErrorLocation(), "survey, #2").toBe("bottom");
    q.errorLocation = "top";
    expect(qItem.getErrorLocation(), "question").toBe("top");
    q.itemErrorLocation = "bottom";
    expect(q.getQuestionErrorLocation(), "q.getQuestionErrorLocation").toBe("bottom");
    expect(qItem.parentQuestion.name, "Parent is here").toBe("q1");
    expect(qItem.getErrorLocation(), "itemErrorLocation").toBe("bottom");
  });
  test("multipletext question: empty string should return isEmpty(), bug #2803", () => {
    var json = {
      questionTitleTemplate: "{no}. {title} {require}",
      elements: [
        {
          type: "multipletext",
          name: "question1",
          items: [
            {
              name: "text1",
            },
            {
              name: "text2",
            },
          ],
        },
      ],
    };
    var survey = new SurveyModel(json);
    var q = <QuestionMultipleTextModel>survey.getQuestionByName("question1");
    q.items[0].value = "1";
    q.items[1].value = "";
    expect(q.value, "There is no item2").toEqual({ text1: "1" });
    q.items[1].value = 0;
    expect(q.value, "Include item2").toEqual({ text1: "1", text2: 0 });
  });
  test("Expression question: should not calculate value when survey in display mode, bug #2808", () => {
    var json = {
      questionTitleTemplate: "{no}. {title} {require}",
      elements: [
        {
          type: "text",
          name: "q1",
        },
        {
          type: "text",
          name: "q2",
        },
        {
          type: "expression",
          name: "q3",
          expression: "{q1}+{q2}",
        },
      ],
    };
    var survey = new SurveyModel(json);
    survey.readOnly = true;
    survey.data = { q1: 1, q2: 2, q3: 5 };
    expect(survey.getValue("q3"), "We do not run expressions in display mode").toBe(5);
  });
  test("Creator V2: add into visibleChoices others/showOtherItem items in design mode", () => {
    var json = {
      elements: [
        {
          type: "radiogroup",
          name: "q1",
          choices: ["item1", "item2", "item3"],
        },
        {
          type: "checkbox",
          name: "q2",
          choices: ["item1", "item2", "item3"],
        },
      ],
    };

    var survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON(json);
    var q1 = <QuestionRadiogroupModel>survey.getQuestionByName("q1");
    var q2 = <QuestionCheckboxModel>survey.getQuestionByName("q2");
    expect(q1.visibleChoices.length, "Show None+showOtherItem+new: 3+3").toBe(6);
    expect(q2.visibleChoices.length, "Show SelectAll+None+showOtherItem+new: 3+4").toBe(7);

    expect(q1.visibleChoices[0].value, "item1 is the first").toBe("item1");
    expect(q1.isItemInList(q1.visibleChoices[0]), "item1 is in list").toBe(true);
    expect(q1.visibleChoices[3].value, "new item is next after real items").toBe("newitem");

    expect(q1.isItemInList(q1.visibleChoices[3]), "new item is never in the list").toBe(false);

    expect(q1.visibleChoices[4].value, "index=4, none").toBe("none");
    expect(q1.isItemInList(q1.visibleChoices[4]), "none not in list").toBe(false);
    q1.showNoneItem = true;
    expect(q1.isItemInList(q1.visibleChoices[4]), "none in list").toBe(true);

    expect(q1.visibleChoices[5].value, "index=5, other").toBe("other");
    expect(q1.isItemInList(q1.visibleChoices[5]), "other not in list").toBe(false);
    q1.showOtherItem = true;
    expect(q1.isItemInList(q1.visibleChoices[5]), "other in list").toBe(true);

    expect(q2.visibleChoices[0].id, "index=0, selectall").toBe("selectall");
    expect(q2.isItemInList(q2.visibleChoices[0]), "selectall not in list").toBe(false);
    q2.showSelectAllItem = true;
    expect(q2.isItemInList(q2.visibleChoices[0]), "selectall in list").toBe(true);

  });
  test("Creator V2: add into visibleChoices others/showOtherItem items in design mode and canShowOptionItemCallback", () => {
    var json = {
      elements: [
        {
          type: "checkbox",
          name: "q1",
          choices: ["item1", "item2"],
        },
      ],
    };

    var survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON(json);
    var q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    var isReadOnly = false;
    q1.setCanShowOptionItemCallback((item: ItemValue): boolean => {
      return !isReadOnly && (item !== q1.newItem || q1.choices.length < 3);
    });
    expect(q1.visibleChoices.length, "Show SelectAll+None+showOtherItem+new: 2+4").toBe(6);
    expect(q1.visibleChoices[3].value).toBe("newitem");
    q1.choices.push(new ItemValue("item3"));
    expect(q1.visibleChoices[3].value).toBe("item3");
    expect(q1.visibleChoices[3] === q1.newItem, "it is not a new item").toBeFalsy();
    expect(q1.visibleChoices[4].value).toBe("none");
    expect(q1.visibleChoices.length, "Show SelectAll+None+showOtherItem-new: 3+3").toBe(6);
    isReadOnly = true;
    q1.choices.splice(2, 1);
    expect(q1.visibleChoices.length, "Do not show SelectAll+None+showOtherItem+new: 2").toBe(2);
    q1.showSelectAllItem = true;
    q1.showNoneItem = true;
    q1.showOtherItem = true;
    expect(q1.visibleChoices.length, "Do not show SelectAll+None+showOtherItem are set: 2 + 3").toBe(5);
  });
  test("Creator V2: do not add choices from carry-forward in design mode", () => {
    var json = {
      elements: [
        {
          type: "checkbox",
          name: "q1",
          choices: ["A", "B", "C", "D"]
        },
        {
          type: "radiogroup",
          name: "q2",
          choices: ["item1", "item2", "item3"]
        },
        {
          type: "checkbox",
          name: "q3",
          choices: ["item1", "item2", "item3"]
        }
      ],
    };

    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON(json);
    const q2 = <QuestionRadiogroupModel>survey.getQuestionByName("q2");
    const q3 = <QuestionCheckboxModel>survey.getQuestionByName("q3");
    expect(q2.visibleChoices.length, "Show None+showOtherItem+new: 3+3").toBe(6);
    expect(q3.visibleChoices.length, "Show SelectAll+None+showOtherItem+new: 3+4").toBe(7);
    q2.choicesFromQuestion = "q1";
    q3.choicesFromQuestion = "q1";
    expect(q2.visibleChoices.length, "Show None+showOtherItem: 2+0").toBe(2);
    expect(q3.visibleChoices.length, "Show SelectAll+None+showOtherItem: 3+0").toBe(3);
    q2.choicesFromQuestion = "";
    q3.choicesFromQuestion = "";
    expect(q2.visibleChoices.length, "radiogroup = clear carry-forward").toBe(6);
    expect(q3.visibleChoices.length, "checkbox = clear carry-forward").toBe(7);
  });
  test("Creator V2: Hide selectAll, showNoneItem and showOtherItem if this properties are invisible", () => {
    var json = {
      elements: [
        {
          type: "checkbox",
          name: "q1",
          choices: ["item1", "item2", "item3"],
        },
      ],
    };

    Serializer.findProperty("selectbase", "showOtherItem").visible = false;
    Serializer.findProperty("selectbase", "showNoneItem").visible = false;
    Serializer.findProperty("checkbox", "showSelectAllItem").visible = false;
    var survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON(json);
    var q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    expect(q1.visibleChoices.length, "Hide SelectAll+None+showOtherItem and show only new: 3+4 - 3").toBe(4);
    Serializer.findProperty("selectbase", "showOtherItem").visible = true;
    Serializer.findProperty("selectbase", "showNoneItem").visible = true;
    Serializer.findProperty("checkbox", "showSelectAllItem").visible = true;
  });
  test("Creator V2: add into visibleChoices others/showOtherItem items in design mode, add new question", () => {
    var json = {
      elements: [
        {
          type: "radiogroup",
          name: "q1",
        },
      ],
    };

    var survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON(json);
    var q2 = new QuestionCheckboxModel("q2");
    q2.choices = ["item1", "item2", "item3"];
    survey.pages[0].addQuestion(q2);
    var q1 = <QuestionRadiogroupModel>survey.getQuestionByName("q1");
    (q1.choices = ["item1", "item2", "item3"]),
    expect(q1.visibleChoices.length, "Show None+showOtherItem+new: 3+3").toBe(6);
    expect(q2.visibleChoices.length, "Show SelectAll+None+showOtherItem+new: 3+4").toBe(7);
  });
  test("Creator V2 + showDefaultItemsInCreator: add into visibleChoices others/showOtherItem items in design mode, add new question", () => {
    var json = {
      elements: [
        {
          type: "radiogroup",
          name: "q1",
        },
      ],
    };

    settings.showDefaultItemsInCreator = false;
    var survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON(json);
    var q2 = new QuestionCheckboxModel("q2");
    q2.choices = ["item1", "item2", "item3"];
    survey.pages[0].addQuestion(q2);
    var q1 = <QuestionRadiogroupModel>survey.getQuestionByName("q1");
    (q1.choices = ["item1", "item2", "item3"]),
    expect(q1.visibleChoices.length, "Do not show None+showOtherItem+new: 3").toBe(3);
    expect(q2.visibleChoices.length, "Show SelectAll+None+showOtherItem+new: 3").toBe(3);
    settings.showDefaultItemsInCreator = true;
  });
  test("Creator V2: add into visibleChoices None item for ranking question and don't add Select All", () => {
    var json = {
      elements: [
        {
          type: "ranking",
          name: "q1",
        },
      ],
    };

    var survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON(json);
    var q1 = <QuestionRankingModel>survey.getQuestionByName("q1");
    q1.choices = ["item1", "item2", "item3"];
    expect(q1["supportSelectAll"]()).toBeFalsy();
    expect(q1.visibleChoices.length, "Show new: 3+1").toBe(4);
  });
  test("Creator V2: do not add into visibleChoices items for inner matrix questions", () => {
    var json = {
      elements: [
        {
          type: "matrixdynamic",
          name: "question1",
          columns: [
            { name: "Column 1" },
            { name: "Column 2" },
            { name: "Column 3" },
          ],
          choices: [1, 2, 3],
          cellType: "checkbox",
        },
      ],
    };

    var survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON(json);
    var q1 = <QuestionMatrixDropdownModelBase>(
      survey.getQuestionByName("question1")
    );
    var innerQuestion = q1.visibleRows[0].cells[0].question;
    expect(innerQuestion.visibleChoices.length, "Show only 3 choice items").toBe(3);
  });
  test("Creator V2: do not add into visibleChoices items for custom widgets", () => {
    CustomWidgetCollection.Instance.clear();
    CustomWidgetCollection.Instance.addCustomWidget({
      name: "first",
      isFit: (question) => {
        return question.name == "question1";
      },
    });
    var json = {
      elements: [
        {
          type: "radiogroup",
          name: "question1",
          choices: [1, 2, 3]
        },
      ],
    };

    var survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON(json);
    var q1 = <QuestionSelectBase>(
    survey.getQuestionByName("question1")
  );
    expect(q1.visibleChoices.length, "Show only 3 choice items").toBe(3);
    CustomWidgetCollection.Instance.clear();
  });
  test("isFit custom widgets on renderAs", () => {
    CustomWidgetCollection.Instance.clear();
    CustomWidgetCollection.Instance.addCustomWidget({
      name: "pretty",
      isFit: (question) => {
        return question.renderAs == "pretty";
      },
    });
    var json = {
      elements: [
        {
          type: "radiogroup",
          name: "question1",
          renderAs: "pretty",
          choices: [1, 2, 3]
        },
      ],
    };
    var survey = new SurveyModel(json);
    var q1 = <QuestionSelectBase>(
    survey.getQuestionByName("question1")
  );
    expect(q1.customWidget, "Custom widget is apply").toBeTruthy();
    expect(q1.customWidget.name, "Correct custom widget name").toBe("pretty");
    CustomWidgetCollection.Instance.clear();
  });
  test("Validate function for custom widget", () => {
    CustomWidgetCollection.Instance.clear();
    CustomWidgetCollection.Instance.addCustomWidget({
      name: "first",
      isFit: (question): boolean => {
        return question.name == "question1";
      },
      validate: (question): string => {
        const val = question.value;
        return val < 1 || val > 3 ? "Out of range" : "";
      }
    });
    var survey = new SurveyModel({
      elements: [
        {
          type: "radiogroup",
          name: "question1",
          choices: [1, 2, 3, 4, 5]
        },
      ],
    });
    var q1 = <QuestionSelectBase>(
    survey.getQuestionByName("question1")
  );
    expect(q1.validate(), "There is no errors, #1").toBe(true);
    q1.value = 1;
    expect(q1.validate(), "There is no errors, #2").toBe(true);
    q1.value = 4;
    expect(q1.validate(), "There is a error, #3").toBe(false);
    expect(q1.errors.length, "Errors list, #4").toBe(1);
    expect(q1.errors[0].text, "Error text #5").toBe("Out of range");
    q1.value = 2;
    expect(q1.errors.length, "Errors list, #6").toBe(0);
    q1.value = 5;
    expect(q1.validate(), "There is a error, #7").toBe(false);
    q1.clearValue();
    expect(q1.errors.length, "Errors list, #8").toBe(0);
    CustomWidgetCollection.Instance.clear();
  });
  test("Focus function for custom widget, bug#10439", () => {
    CustomWidgetCollection.Instance.clear();
    let focusedQuestionName: string = "";
    CustomWidgetCollection.Instance.addCustomWidget({
      name: "first",
      isFit: (question): boolean => {
        return question.name == "question1";
      },
    });
    const survey = new SurveyModel({
      elements: [
        {
          type: "text",
          name: "question1"
        },
      ],
    });
    const q1 = <QuestionSelectBase>(
    survey.getQuestionByName("question1")
  );
    q1.focusCallback = () => {
      focusedQuestionName = q1.name;
    };
    q1.focus();
    expect(focusedQuestionName, "Focus function is called").toBe("question1");
    CustomWidgetCollection.Instance.clear();
  });
  test("Update choices order on changing locale, bug #2832", () => {
    var json = {
      elements: [
        {
          type: "checkbox",
          name: "q1",
          choices: [
            {
              value: "item1",
              text: {
                default: "Aaa",
                fr: "ccc",
              },
            },
            {
              value: "item2",
              text: {
                default: "Bbb",
                fr: "aaa",
              },
            },
            {
              value: "item3",
              text: {
                default: "Cccc",
                fr: "bbb",
              },
            },
          ],
          choicesOrder: "asc",
        },
      ],
    };
    var survey = new SurveyModel(json);
    survey.locale = "fr";
    var q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    expect(q1.visibleChoices[0].value, "aaa in fr locale").toBe("item2");
    expect(q1.visibleChoices[1].value, "bbb in fr locale").toBe("item3");
    expect(q1.visibleChoices[2].value, "ccc in fr locale").toBe("item1");
  });
  test("Sorting with numbers in the beginning, bug #6062", () => {
    var json = {
      elements: [
        {
          type: "checkbox",
          name: "q1",
          choices: ["1. bc", "12. cd", "7. k"],
          choicesOrder: "asc",
        },
      ],
    };
    var survey = new SurveyModel(json);
    var q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    expect(q1.visibleChoices[0].value, "1. bc - 0").toBe("1. bc");
    expect(q1.visibleChoices[1].value, "7. k  - 1").toBe("7. k");
    expect(q1.visibleChoices[2].value, "12. - 2").toBe("12. cd");
  });
  test("boolean question default value is not assign into readOnly question, bug #", () => {
    var json = {
      elements: [
        {
          type: "boolean",
          name: "q1",
          defaultValue: true,
          readOnly: true,
        },
        {
          type: "text",
          name: "q2",
          defaultValue: "abc",
          readOnly: true,
        },
      ],
    };
    var survey = new SurveyModel(json);
    var q1 = survey.getQuestionByName("q1");
    var q2 = survey.getQuestionByName("q2");
    expect(q1.value, "default value is set, boolean").toBe(true);
    expect(q2.value, "default value is set, text").toBe("abc");
  });
  test("boolean question vs hidden title & no, bug #10320", () => {
    const survey = new SurveyModel({
      showQuestionNumbers: true,
      elements: [
        {
          type: "boolean",
          name: "q1",
          titleLocation: "hidden",
          title: "My title",
        },
        {
          type: "text",
          name: "q2",
          defaultValue: "abc",
          readOnly: true,
        },
      ],
    });
    var q1 = survey.getQuestionByName("q1");
    var q2 = survey.getQuestionByName("q2");
    expect(q1.no, "boolean question no is empty").toBeFalsy();
    expect(q2.no, "next question no is set to 1.").toBe("1.");
  });
  test("Use empty string as a valid value", () => {
    var json = {
      elements: [
        {
          type: "dropdown",
          name: "q1",
          choices: [{ value: "", text: "empty" }, "item2", "item3"],
        },
      ],
    };
    var survey = new SurveyModel(json);
    var q1 = <QuestionDropdownModel>survey.getQuestionByName("q1");
    expect(q1.displayValue, "We get display Value for empty string").toBe("empty");
  });
  test("Use question onDisplayValueCallback", () => {
    var json = {
      elements: [
        {
          type: "dropdown",
          name: "q1",
          placeholder: "Empty",
          choices: ["item2", "item3"],
        },
      ],
    };
    var survey = new SurveyModel(json);
    var q1 = <QuestionDropdownModel>survey.getQuestionByName("q1");
    q1.displayValueCallback = (val: string): string => {
      if (q1.isEmpty()) return q1.placeholder;
      return val;
    };
    expect(q1.displayValue, "We get display Value on callback").toBe("Empty");
  });
  test("QuestionExpression expression validator", () => {
    var survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2" },
        {
          type: "expression",
          name: "q3",
          expression: "{q1} + {q2}",
          validators: [{ type: "expression", expression: "{q3} = 10" }],
        },
      ],
    });
    survey.setValue("q1", 5);
    survey.setValue("q2", 4);
    var question = <QuestionTextModel>survey.getQuestionByName("q3");
    expect(question.validate(), "There is an error").toBeFalsy();
    survey.setValue("q2", 5);
    expect(question.value).toBe(10);
    expect(question.validate(), "There is no errors").toBeTruthy();
  });
  test("Check isAnswered property", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        { type: "radiogroup", name: "q2", choices: [1, 2, 3] },
        { type: "radiogroup", name: "q3", choices: [1, 2, 3], defaultValue: 2 },
        { type: "checkbox", name: "q4", choices: [1, 2, 3] },
        { type: "checkbox", name: "q5", choices: [1, 2, 3], defaultValue: [2] }
      ],
    });
    const prevStyle = survey.css.question.titleOnAnswer;
    survey.css.question.titleOnAnswer = "answer";
    survey.currentPage.updateElementCss();
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    const q3 = survey.getQuestionByName("q3");
    const q4 = survey.getQuestionByName("q4");
    const q5 = survey.getQuestionByName("q5");
    expect(q1.isAnswered).toBeFalsy();
    expect(q2.isAnswered).toBeFalsy();
    expect(q3.isAnswered).toBeTruthy();
    expect(q4.isAnswered).toBeFalsy();
    expect(q5.isAnswered).toBeTruthy();

    expect(q1.cssTitle.indexOf("answer") > 0).toBeFalsy();
    expect(q2.cssTitle.indexOf("answer") > 0).toBeFalsy();
    expect(q3.cssTitle.indexOf("answer") > 0).toBeTruthy();
    expect(q4.cssTitle.indexOf("answer") > 0).toBeFalsy();
    expect(q5.cssTitle.indexOf("answer") > 0).toBeTruthy();

    q1.value = "abc";
    expect(q1.cssTitle.indexOf("answer") > 0).toBeTruthy();
    q1.value = "";
    expect(q1.cssTitle.indexOf("answer") > 0).toBeFalsy();

    q2.value = 2;
    expect(q2.cssTitle.indexOf("answer") > 0).toBeTruthy();
    q2.value = undefined;
    expect(q2.cssTitle.indexOf("answer") > 0).toBeFalsy();

    q3.clearValue();
    expect(q3.cssTitle.indexOf("answer") > 0).toBeFalsy();

    q4.value = [1];
    expect(q4.cssTitle.indexOf("answer") > 0).toBeTruthy();
    q4.value = [];
    expect(q4.cssTitle.indexOf("answer") > 0).toBeFalsy();

    expect(q4.isAnswered, "q4 is not answered").toBeFalsy();
    survey.setValue("q4", [1]);
    expect(q4.isAnswered, "q4 is answered").toBeTruthy();
    expect(q4.cssTitle.indexOf("answer") > 0).toBeTruthy();

    survey.css.question.titleOnAnswer = prevStyle;
  });
  test("Do not update cssClassesValue while the element is not rendered", () => {
    const survey = new SurveyModel({
      pages: [{
        elements: [
          { type: "text", name: "q1" },
        ] }, {
        elements: [
          { type: "text", name: "q2" },
          { type: "text", name: "q3", defaultValue: 2 },
        ]
      }]
    });
    const prevStyle = survey.css.question.titleOnAnswer;
    survey.css.question.titleOnAnswer = "answer";

    const q2 = survey.getQuestionByName("q2");
    const q3 = survey.getQuestionByName("q3");
    q2.value = 1;
    expect(q2.getPropertyValue("cssClassesValue"), "#1").toBeFalsy();
    expect(q3.getPropertyValue("cssClassesValue"), "#2").toBeFalsy();
    expect(q2.wasRendered, "#1.1").toBeFalsy();
    expect(q3.wasRendered, "#2.1").toBeFalsy();
    survey.nextPage();
    expect(q2.isAnswered, "#3").toBeTruthy();
    expect(q3.isAnswered, "#4").toBeTruthy();

    expect(q2.cssTitle.indexOf("answer") > 0, "#5").toBeTruthy();
    expect(q3.cssTitle.indexOf("answer") > 0, "#6").toBeTruthy();

    survey.css.question.titleOnAnswer = prevStyle;
  });
  test("question.startWithNewLine", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        { type: "panel", name: "p1", elements: [{ type: "text", name: "q2" }] },
      ],
    });
    expect(survey.getQuestionByName("q1").startWithNewLine).toBe(true);
    expect(survey.getQuestionByName("q2").startWithNewLine).toBe(true);
    survey.pages[0].addNewQuestion("text", "q3");
    expect(survey.getQuestionByName("q3").startWithNewLine).toBe(true);
    const q4 = new QuestionTextModel("q4");
    expect(q4.startWithNewLine).toBe(true);
    survey.pages[0].addQuestion(q4);
    expect(q4.startWithNewLine).toBe(true);
  });
  test("checkbox question item methods", () => {
    var json = {
      elements: [
        {
          type: "checkbox",
          name: "q1",
          choices: ["item1", "item2", "other"],
          showOtherItem: true,
        },
      ],
    };
    var survey = new SurveyModel(json);
    var question = <QuestionCheckboxModel>survey.getAllQuestions()[0];
    expect(question.checkBoxSvgPath[0], "Obtain checkbox SVG path").toBe("M");
    expect(question.isOtherItem(question.choices[0]), "First item is not other").toBe(false);
    expect(question.isOtherItem(question.choices[2]), "Last item is other").toBe(true);

    question.choices[1].setIsEnabled(false);
    expect(question.getItemEnabled(question.choices[0]), "First item is enabled").toBe(true);
    expect(question.getItemEnabled(question.choices[1]), "Second item is disabled").toBe(false);

  });
  test("Check that we do not set valueChangedCallback internally", () => {
    const questionClasses = Serializer.getChildrenClasses("question", true);
    for (let i = 0; i < questionClasses.length; i++) {
      const className = questionClasses[i].name;
      const question = Serializer.createClass(className);
      expect(question.valueChangedCallback, "We should no set valueChangedCallback, class: " + className).toBeFalsy();
    }
  });
  test("Multiple Text Question: editor.renderedPlaceholder is undefined, Bug#3374", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "multipletext", name: "q1",
          items: [
            { name: "item1", placeHolder: "place holder" }
          ]
        }
      ]
    });
    const question = <QuestionMultipleTextModel>survey.getQuestionByName("q1");
    expect(question.items[0].placeHolder, "item place holder").toBe("place holder");
    expect(question.items[0].editor.placeHolder, "editor place holder").toBe("place holder");
    expect(question.items[0].editor.renderedPlaceholder, "editor rendered place holder").toBe("place holder");
  });
  test("setting visibleChoices do not fired onArrayChanged ", () => {
    const question = new QuestionDropdownModel("q1");
    let counter = 0;
    (<any>question.visibleChoices).testId = 1;
    question.addOnArrayChangedCallback((_: Base, options: IPropertyArrayValueChangedEvent) => {
      if (options.name === "visibleChoices") {
        counter++;
      }
    });
    let hasVisibleChoicesInHash = false;
    question.iteratePropertiesHash((hash, key) => {
      if (key === "visibleChoices") {
        hasVisibleChoicesInHash = true;
      }
    });
    expect(hasVisibleChoicesInHash, "visibleChoices array in hash").toBe(true);
    question.choices = [1, 2, 3];
    expect(question.visibleChoices.length, "visibleChoices is set").toBe(3);
    expect((<any>question.visibleChoices).testId, "visibleChoices array is the same").toBe(1);
    expect(counter, "We fired onArrayChanged for visibleChoices").toBe(1);
  });
  test("Question title equals to name", () => {
    const question = new QuestionTextModel("q1");
    expect(question.locTitle.getLocaleText(""), "Question title is empty # 1").toBeFalsy();
    expect(question.locTitle.renderedHtml).toBe("q1");
    question.locTitle.setLocaleText("", "q1");
    expect(question.locTitle.getLocaleText(""), "Question title is not empty # 2").toBe("q1");
    expect(question.locTitle.renderedHtml).toBe("q1");
  });
  test("Checkbox item, defaultValue and visibleIf bug, #3634", () => {
    const survey = new SurveyModel({
      elements: [
        {
          "type": "radiogroup",
          "name": "question2",
          "choices": ["item1", "item2"]
        },
        {
          "type": "checkbox",
          "name": "question1",
          "defaultValue": ["item2"],
          "choices": [
            "item1",
            {
              "value": "item2",
              "visibleIf": "{question2} = 'item1'"
            },
            "item3"
          ]
        }
      ]
    });
    const question = <QuestionCheckboxModel>survey.getQuestionByName("question1");
    expect([...(question.value)], "default value is not set, because item is invisible").toEqual([]);
    survey.data = { question2: "item1", question1: ["item3"] };
    expect([...(question.value)], "value from data is set").toEqual(["item3"]);
  });
  test("Checkbox item, others  and visibleIf bug, #3694", () => {
    const survey = new SurveyModel({
      elements: [
        {
          "type": "radiogroup",
          "name": "question2",
          "choices": ["item1", "item2"]
        },
        {
          "type": "checkbox",
          "name": "question1",
          "showOtherItem": true,
          "choices": [
            "item1",
            {
              "value": "item2",
              "visibleIf": "{question2} = 'item1'"
            },
            "item3"
          ]
        }
      ]
    });
    const question = <QuestionCheckboxModel>survey.getQuestionByName("question1");
    survey.data = { question2: "item1", question1: ["item1", "item2"] };
    expect([...(question.value)], "value is set correctly").toEqual(["item1", "item2"]);
    expect(question.isOtherSelected, "Other is not selected").toBe(false);
    expect(question.isItemSelected(question.choices[1]), "second item is selected").toBe(true);
  });
  test("SelectBase otherPlaceholder localized", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "radiogroup",
          name: "car",
          showOtherItem: true,
          otherPlaceholder: {
            "da": "Skriv din begrundelse her...",
            "default": "Write your reason here..."
          },
          choices: ["Ford", "Toyota", "Citroen"]
        }
      ]
    });
    var question = <QuestionRadiogroupModel>survey.getAllQuestions()[0];
    expect(survey.locale, "default locale").toBe("");
    expect(question.getLocale(), "default locale").toBe("");
    expect(question.otherPlaceHolder, "default placeholder").toBe("Write your reason here...");
    expect(question.otherPlaceholder, "default placeholder").toBe("Write your reason here...");
    survey.locale = "da";
    expect(survey.locale, "da locale").toBe("da");
    expect(question.getLocale(), "da locale").toBe("da");
    expect(question.otherPlaceHolder, "da placeholder").toBe("Skriv din begrundelse her...");
    expect(question.otherPlaceholder, "da placeholder").toBe("Skriv din begrundelse her...");
    survey.locale = "";
  });
  test("Ranking commentPlaceholder localized", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "rating",
          name: "satisfaction",
          "showCommentArea": true,
          "commentPlaceholder": {
            "da": "Skriv din begrundelse her...",
            "default": "Write your reason here..."
          },
        }
      ]
    });
    var question = <QuestionRadiogroupModel>survey.getAllQuestions()[0];
    expect(survey.locale, "default locale").toBe("");
    expect(question.getLocale(), "default locale").toBe("");
    expect(question.commentPlaceHolder, "default placeholder").toBe("Write your reason here...");
    expect(question.commentPlaceholder, "default placeholder").toBe("Write your reason here...");
    survey.locale = "da";
    expect(survey.locale, "da locale").toBe("da");
    expect(question.getLocale(), "da locale").toBe("da");
    expect(question.commentPlaceHolder, "da placeholder").toBe("Skriv din begrundelse her...");
    expect(question.commentPlaceholder, "da placeholder").toBe("Skriv din begrundelse her...");
    survey.locale = "";
  });
  test("Dropdown placeholder localization", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "dropdown",
          name: "q1"
        }
      ]
    });
    survey.locale = "";
    var question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    expect(question.placeholder, "default locale").toBe("Select...");
    survey.locale = "de";
    expect(question.placeholder, "locale = de").toBe("Bitte auswählen..."); // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
    survey.locale = "";
    expect(question.placeholder, "default locale, #2").toBe("Select...");
  });
  test("multipletext placeholder localization", () => {
    var survey = new SurveyModel({
      elements: [
        {
          "type": "multipletext",
          "name": "question1",
          "items": [
            {
              "name": "text1",
              "placeholder": {
                "de": "placeholder de",
                "default": "placeholder default"
              }
            }
          ]
        }]
    });
    survey.locale = "";
    const question = <QuestionMultipleTextModel>survey.getAllQuestions()[0];
    const editor = question.items[0].editor;
    let counter = 0;
    expect(editor.placeholder, "default locale").toBe("placeholder default");
    expect(editor.renderedPlaceholder, "renderedPlaceholder, default locale").toBe("placeholder default");
    editor.locPlaceHolder.onStringChanged.add((sender, options) => counter ++);
    survey.locale = "de";
    expect(counter, "Changed one time").toBe(1);
    expect(editor.placeholder, "default locale").toBe("placeholder de");
    expect(editor.renderedPlaceholder, "renderedPlaceholder, de locale").toBe("placeholder de");
    survey.locale = "";
    expect(counter, "Changed second time").toBe(2);
    expect(editor.placeholder, "default locale, #2").toBe("placeholder default");
    expect(editor.renderedPlaceholder, "default locale").toBe("placeholder default");
  });
  test("placeholder localization, question in run-time", () => {
    const survey = new SurveyModel({
      elements: [
        {
          "type": "text",
          "name": "q1"
        }]
    });
    survey.locale = "de";
    const q2 = new QuestionTextModel("q2");
    q2.fromJSON({
      "name": "q2",
      "placeholder": {
        "de": "placeholder de",
        "default": "placeholder default"
      }
    });
    survey.pages[0].addQuestion(q2);
    expect(q2.placeholder, "placeholder is correct").toBe("placeholder de");
    expect(q2.renderedPlaceholder, "renderedPlaceholder is correct").toBe("placeholder de");
  });
  test("Test question.clearIfInvisible for survey.clearInvisibleValue='onComplete' (default)", () => {
    var survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2", clearIfInvisible: "none" },
        { type: "text", name: "q3", clearIfInvisible: "onHidden" },
        { type: "text", name: "q4", clearIfInvisible: "onHidden", defaultValue: "default4" },
        { type: "text", name: "q5", clearIfInvisible: "onComplete" }
      ]
    });
    const q = { q1: null, q2: null, q3: null, q4: null, q5: null };
    for (var key in q) {
      q[key] = survey.getQuestionByName(key);
      q[key].value = key;
      q[key].visible = false;
    }
    expect(q.q1.value, "q1: default/invisible").toBe("q1");
    expect(q.q2.value, "q2: none/invisible").toBe("q2");
    expect(q.q3.value, "q3: onHidden/invisible").toBeUndefined();
    expect(q.q4.value, "q4: onHidden/defaultValue/invisible").toBeUndefined();
    expect(q.q5.value, "q3: onComplete/invisible").toBe("q5");
    q.q4.visible = true;
    expect(q.q4.value, "q4: onHidden/defaultValue/visible").toBe("default4");
    q.q4.visible = false;
    survey.doComplete();
    expect(survey.data, "q2 is none").toEqual({ q2: "q2" });
  });
  test("Test question.clearIfInvisible for survey.clearInvisibleValue='none'", () => {
    var survey = new SurveyModel({
      clearInvisibleValues: "none",
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2", clearIfInvisible: "none" },
        { type: "text", name: "q3", clearIfInvisible: "onHidden" },
        { type: "text", name: "q4", clearIfInvisible: "onHidden", defaultValue: "default4" },
        { type: "text", name: "q5", clearIfInvisible: "onComplete" }
      ]
    });
    const q = { q1: null, q2: null, q3: null, q4: null, q5: null };
    for (var key in q) {
      q[key] = survey.getQuestionByName(key);
      q[key].value = key;
      q[key].visible = false;
    }
    expect(q.q1.value, "q1: default/invisible").toBe("q1");
    expect(q.q2.value, "q2: none/invisible").toBe("q2");
    expect(q.q3.value, "q3: onHidden/invisible").toBeUndefined();
    expect(q.q4.value, "q4: onHidden/defaultValue/invisible").toBeUndefined();
    expect(q.q5.value, "q3: onComplete/invisible").toBe("q5");
    q.q4.visible = true;
    expect(q.q4.value, "q4: onHidden/defaultValue/visible").toBe("default4");
    q.q4.visible = false;
    survey.doComplete();
    expect(survey.data, "q1 is default, q2 is none").toEqual({ q1: "q1", q2: "q2" });
  });
  test("Test question.clearIfInvisible for survey.clearInvisibleValue='onHidden'", () => {
    var survey = new SurveyModel({
      clearInvisibleValues: "onHidden",
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2", clearIfInvisible: "none" },
        { type: "text", name: "q3", clearIfInvisible: "onHidden" },
        { type: "text", name: "q4", clearIfInvisible: "onHidden", defaultValue: "default4" },
        { type: "text", name: "q5", clearIfInvisible: "onComplete" }
      ]
    });
    const q: any = { q1: null, q2: null, q3: null, q4: null, q5: null };
    for (var key in q) {
      q[key] = survey.getQuestionByName(key);
      q[key].value = key;
      q[key].visible = false;
    }
    expect(q.q1.value, "q1: default/invisible").toBeUndefined();
    expect(q.q2.value, "q2: none/invisible").toBe("q2");
    expect(q.q3.value, "q3: onHidden/invisible").toBeUndefined();
    expect(q.q4.value, "q4: onHidden/defaultValue/invisible").toBeUndefined();
    expect(q.q5.value, "q3: onComplete/invisible").toBe("q5");
    q.q4.visible = true;
    expect(q.q4.value, "q4: onHidden/defaultValue/visible").toBe("default4");
    q.q4.visible = false;
    survey.doComplete();
    expect(survey.data, "q2 is none").toEqual({ q2: "q2" });
  });
  test("Test question.clearIfInvisible for survey.clearInvisibleValue='onHiddenContainer'", () => {
    var survey = new SurveyModel({
      clearInvisibleValues: "onHiddenContainer",
      elements: [
        {
          type: "panel", name: "panel",
          elements: [
            { type: "text", name: "q1" },
            { type: "text", name: "q2", clearIfInvisible: "none" },
            { type: "text", name: "q3", clearIfInvisible: "onHidden" },
            { type: "text", name: "q4", clearIfInvisible: "onHidden", defaultValue: "default4" },
            { type: "text", name: "q5", clearIfInvisible: "onComplete" }
          ]
        }
      ]
    });
    const q: any = { q1: null, q2: null, q3: null, q4: null, q5: null };
    for (var key in q) {
      q[key] = survey.getQuestionByName(key);
      q[key].value = key;
    }
    (<PanelModel>survey.getPanelByName("panel")).visible = false;
    expect(q.q1.value, "q1: default/invisible").toBeUndefined();
    expect(q.q2.value, "q2: none/invisible").toBe("q2");
    expect(q.q3.value, "q3: onHidden/invisible").toBe("q3");
    expect(q.q4.value, "q4: onHidden/defaultValue/invisible").toBe("q4");
    expect(q.q5.value, "q3: onComplete/invisible").toBe("q5");
    survey.doComplete();
    expect(survey.data, "q2 is none").toEqual({ q2: "q2" });
  });
  test("Test question.clearIfInvisible='onHiddenContainer'", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "panel", name: "panel",
          elements: [
            { type: "text", name: "q1" },
            { type: "text", name: "q2", clearIfInvisible: "none" },
            { type: "text", name: "q3", clearIfInvisible: "onHidden" },
            { type: "text", name: "q4", clearIfInvisible: "onHiddenContainer" },
            { type: "text", name: "q5", clearIfInvisible: "onComplete" }
          ]
        },
        { type: "text", name: "q6", clearIfInvisible: "onHiddenContainer" },
      ]
    });
    for (let i = 1; i < 7; i ++) {
      survey.setValue("q" + i, i);
    }
    expect(survey.data, "initial").toEqual({ q1: 1, q2: 2, q3: 3, q4: 4, q5: 5, q6: 6 });
    survey.getQuestionByName("q6").visible = false;
    expect(survey.data, "q6 invisible").toEqual({ q1: 1, q2: 2, q3: 3, q4: 4, q5: 5 });
    (<PanelModel>survey.getPanelByName("panel")).visible = false;
    expect(survey.data, "panel invisible").toEqual({ q1: 1, q2: 2, q3: 3, q5: 5 });
    survey.doComplete();
    expect(survey.data, "state is completed").toEqual({ q2: 2 });
  });
  test("Test question.clearIfInvisible='onHiddenContainer' vs survey.clearInvisibleValues='none', Bug#10035", () => {
    const survey = new SurveyModel({
      "clearInvisibleValues": "none",
      "elements": [
        {
          "type": "text",
          "name": "q1"
        },
        {
          "type": "panel",
          "name": "panel1",
          "visibleIf": "{q1} != 1",
          "elements": [
            {
              "type": "text",
              "name": "q2",
              "clearIfInvisible": "onHiddenContainer"
            }
          ]
        }
      ]
    });
    survey.setValue("q2", "a");
    survey.setValue("q1", 2);
    expect(survey.data, "q2 is visible, value is set").toEqual({ q1: 2, q2: "a" });
    survey.setValue("q1", 1);
    expect(survey.data, "q2 is invisible").toEqual({ q1: 1 });
  });
  test("Test question.clearIfInvisible='onHiddenContainer' vs survey.clearInvisibleValues='none', Bug#10035", () => {
    const survey = new SurveyModel({
      validationType: "none",
      elements: [
        {
          type: "text",
          name: "status",
          defaultValueExpression: "'completed'",
        },
        {
          type: "panel",
          name: "panel_b",
          elements: [
            {
              type: "text",
              name: "q2",
              visibleIf: "{status} = 'completed'",
              clearIfInvisible: "none",
            },
            {
              type: "panel",
              name: "panel_c",
              visibleIf: "{q2} notempty",
              title: "panel_c",
              elements: [
                {
                  type: "text",
                  name: "q1",
                  clearIfInvisible: "onHiddenContainer",
                },
              ],
            }] }
      ]
    });
    survey.data = { status: "completed-non", q2: "abc", q1: "def" };
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    expect(q1.visible, "q1 is visible").toBe(true);
    expect(q2.visible, "q2 is invisible").toBe(false);
    expect(q1.value, "q1 value is not cleared").toBe("def");
    expect(q2.value, "q2 value is not cleared").toBe("abc");
  });
  test("survey.clearInvisibleValues='onHiddenContainer' & defaultValueExpression in panel vs visibleIf, Bug#10330", () => {
    const survey = new SurveyModel({
      pages: [
        {
          elements: [
            {
              type: "text",
              name: "q1"
            }
          ],
        },
        {
          elements: [
            {
              type: "checkbox",
              name: "q2",
              visibleIf:
            "{q1} notempty",
              choices: ["a", "b", "c"],
            },
            {
              type: "paneldynamic",
              name: "pnl1",
              visibleIf: "{q2} contains 'c'",
              templateElements: [
                {
                  type: "text",
                  name: "pnl1_q1"
                },
              ],
              displayMode: "tab",
            },
            {
              type: "panel",
              name: "pnl2",
              visibleIf: "{q2} notempty",
              elements: [
                {
                  type: "checkbox",
                  name: "q3",
                  defaultValueExpression: "[a]",
                  choices: ["a", "b", "c"],
                },
              ],
            },
          ],
        },
      ],
      clearInvisibleValues: "onHiddenContainer",
    });
    const data = {
      q1: "a",
      q2: ["a", "c"],
      pnl1: [
        { pnl1_q1: "a" },
        { pnl1_q1: "b" },
      ],
      q3: ["a", "b", "c"],
    };

    survey.data = data;
    const q3 = survey.getQuestionByName("q3");
    expect([...(q3.value)], "caseSelection value is set correctly").toEqual(["a", "b", "c"]);
    expect(survey.data, "data is set correctly").toEqual(data);
  });

  test("QuestionTextModel isMinMaxType", () => {
    const q1 = new QuestionTextModel("q1");
    expect(q1.inputType).toBe("text");
    expect(q1.isMinMaxType).toBe(false);
    q1.inputType = "range";
    expect(q1.isMinMaxType).toBe(true);
    q1.inputType = "datetime";
    expect(q1.inputType, "We do not have datetime value").toBe("datetime-local");
    expect(q1.isMinMaxType).toBe(true);
    q1.inputType = "tel";
    expect(q1.isMinMaxType).toBe(false);
  });
  test("QuestionTextModel range min/max property editor type", () => {
    const minProperty = Serializer.findProperty("text", "min");
    const maxProperty = Serializer.findProperty("text", "max");
    const q1 = new QuestionTextModel("q1");
    q1.inputType = "range";
    const minJson = { inputType: "text", textUpdateMode: "" };
    minProperty.onPropertyEditorUpdate(q1, minJson);
    expect(minJson.inputType).toBe("number");
    expect(minJson.textUpdateMode).toBe("onBlur");
    const maxJson = { inputType: "text", textUpdateMode: "" };
    minProperty.onPropertyEditorUpdate(q1, maxJson);
    expect(maxJson.inputType).toBe("number");
    expect(maxJson.textUpdateMode).toBe("onBlur");
  });
  test("QuestionTextModel inputStyle for empty inputWidth - https://github.com/surveyjs/survey-creator/issues/3755", () => {
    const q1 = new QuestionTextModel("q1");
    expect(q1.inputStyle).toEqual({ width: "" });
    q1.size = 5;
    expect(q1.inputStyle).toEqual({ width: "auto" });
    q1.size = 0;
    expect(q1.inputStyle).toEqual({ width: "" });
  });
  test("storeOthersAsComment: false, renderedValue and ", () => {
    const survey = new SurveyModel({
      storeOthersAsComment: false,
      elements: [
        {
          type: "radiogroup",
          name: "q1",
          showOtherItem: true,
          choices: [1, 2, 3]
        },
        {
          type: "checkbox",
          name: "q2",
          showOtherItem: true,
          choices: [1, 2, 3]
        }
      ]
    });
    const q1 = <QuestionRadiogroupModel>survey.getQuestionByName("q1");
    const q2 = <QuestionCheckboxModel>survey.getQuestionByName("q2");
    q1.renderedValue = 2;
    q2.renderedValue = [2, 3];
    expect(q1.isOtherSelected, "isOtherSelected - false, radiogroup").toBe(false);
    expect(q1.isItemSelected(q1.otherItem), "isItemSelected - false, radiogroup").toBe(false);
    expect(q2.isOtherSelected, "isOtherSelected - false, checkbox").toBe(false);
    expect(q2.isItemSelected(q2.otherItem), "isItemSelected - false, checkbox").toBe(false);
    q1.renderedValue = "hello";
    q2.renderedValue = [1, "hello"];
    expect(q1.isOtherSelected, "isOtherSelected - true, radiogroup").toBe(true);
    expect(q1.isItemSelected(q1.otherItem), "isItemSelected - true, radiogroup").toBe(true);
    expect(q2.isOtherSelected, "isOtherSelected - true, checkbox").toBe(true);
    expect(q2.isItemSelected(q2.otherItem), "isItemSelected - true, checkbox").toBe(true);
  });
  test("itemComponent default values and de/serialization", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "radiogroup",
          name: "q1",
        },
        {
          type: "checkbox",
          name: "q2",
        },
        {
          type: "ranking",
          name: "q3",
        },
        {
          type: "tagbox",
          name: "q4",
        },
        {
          type: "dropdown",
          name: "q5",
        }
      ]
    });
    const q1 = <QuestionRadiogroupModel>survey.getQuestionByName("q1");
    const q2 = <QuestionCheckboxModel>survey.getQuestionByName("q2");
    const q3 = <QuestionRankingModel>survey.getQuestionByName("q3");
    const q4 = <QuestionTagboxModel>survey.getQuestionByName("q4");
    const q5 = <QuestionDropdownModel>survey.getQuestionByName("q5");
    expect(q1.itemComponent, "radiogroup item").toBe("survey-radiogroup-item");
    expect(q2.itemComponent, "checkbox item").toBe("survey-checkbox-item");
    expect(q3.itemComponent, "ranking item").toBe("sv-ranking-item");
    expect(q4.itemComponent, "tagbox item").toBe("");
    expect(q5.itemComponent, "dropdown item").toBe("");

    const json1 = q1.toJSON();
    expect(json1.itemComponent, "radiogroup item default").toBeUndefined();
    const json2 = q2.toJSON();
    expect(json2.itemComponent, "checkbox item default").toBeUndefined();
    const json3 = q3.toJSON();
    expect(json3.itemComponent, "ranking item default").toBeUndefined();
    const json4 = q4.toJSON();
    expect(json4.itemComponent, "tagbox item default").toBeUndefined();
    const json5 = q5.toJSON();
    expect(json5.itemComponent, "dropdown item default").toBeUndefined();
  });
  test("Do not allow question to start with #", () => {
    let survey = new SurveyModel({
      elements: [{ type: "text", name: "q1" }, { type: "text", name: "$q1" }] });
    let questions = survey.pages[0].questions;
    expect(questions[1].name, "$q1").toBe("$q1");
    questions[0].name = "#q2";
    expect(questions[0].name, "change #q2 to q2").toBe("q2");
    questions[1].valueName = "#q3";
    expect(questions[1].valueName, "change #q3 to q3").toBe("q3");
    questions[1].valueName = "##q3";
    expect(questions[1].valueName, "change ##q3 to q3").toBe("q3");
    survey = new SurveyModel({
      elements: [{ type: "text", name: "#q11" }, { type: "text", name: "##q11#" }] });
    questions = survey.pages[0].questions;
    expect(questions[0].name, "Remove #").toBe("q11");
    expect(questions[1].name, "Remove ##").toBe("q11#");
  });
  test("onGetChoiceDisplayValue and defaultValue", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "radiogroup",
          name: "q1",
          defaultValue: 55,
          choicesByUrl: {
            url: "some url"
          }
        },
      ]
    });
    survey.onGetChoiceDisplayValue.add((sender, options) => {
      if (options.question.name == "q1") {
        options.setItems(options.values.map(item => ("DisplayText_" + item)));
      }
    });

    const question = <QuestionRadiogroupModel>survey.getQuestionByName("q1");

    expect(question.choices.length).toBe(0);
    expect(question.value).toBe(55);
    expect(question.selectedItem.value).toBe(55);
    expect(question.selectedItem.text).toBe("DisplayText_55");
  });
  test("remove reference to DOM elements", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "comment",
          name: "q1",
        },
      ]
    });
    const question = <QuestionCommentModel>survey.getQuestionByName("q1");

    const el = document.createElement("div");
    el.id = question.id;
    question.afterRenderQuestionElement(el);
    expect(question["element"]).toBe(el);
    question.beforeDestroyQuestionElement(el);
    expect(question["element"]).toBeUndefined();

    el.remove();
  });
  test("defaultValueExpressions, currentDate() and 'date'+'datetime-local' inputtype, Bug#5296", () => {
    const survey = new SurveyModel({
      elements: [{
        "name": "q1",
        "type": "text",
        "inputType": "datetime-local",
        "defaultValueExpression": "currentDate()"
      },
      {
        "name": "q2",
        "type": "text",
        "inputType": "date",
        "defaultValueExpression": "currentDate()"
      }
      ] });
    const d = new Date();
    let prefix = d.getFullYear() + "-";
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    expect(q1.inputType, "inputType is correct").toBe("datetime-local");
    expect(q1.displayValue.indexOf(prefix), "datetime-local has year").toBe(0);
    expect(q1.displayValue.indexOf(":") > 0, "datetime-local has time").toBe(true);
    expect(q2.displayValue.indexOf(prefix), "datetime-local has year").toBe(0);
    expect(q2.displayValue.indexOf(":") < 0, "date has no time").toBe(true);
  });
  test("setValueExpression, currentDate() and 'date'+'datetime-local' inputtype, Bug#8471", () => {
    const survey = new SurveyModel({
      elements: [{
        "name": "q1",
        "type": "text",
        "inputType": "datetime-local",
        "setValueIf": "{q3} > 10",
        "setValueExpression": "currentDate()"
      },
      {
        "name": "q2",
        "type": "text",
        "inputType": "date",
        "setValueIf": "{q3} > 10",
        "setValueExpression": "currentDate()"
      },
      { "name": "q3", "type": "text" }
      ] });
    const d = new Date();
    let prefix = d.getFullYear() + "-";
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    expect(q1.isEmpty(), "q1 is Empty").toBe(true);
    expect(q2.isEmpty(), "q2 is Empty").toBe(true);
    survey.setValue("q3", 11);
    expect(q1.isEmpty(), "q1 is not Empty").toBe(false);
    expect(q2.isEmpty(), "q2 is not Empty").toBe(false);
    expect(q1.displayValue, "q1 has displayValue").toBeTruthy();
    expect(q2.displayValue, "q2 has displayValue").toBeTruthy();
    expect(q1.inputType, "inputType is correct").toBe("datetime-local");
    expect(q1.displayValue.indexOf(prefix), "datetime-local has year").toBe(0);
    expect(q1.displayValue.indexOf(":") > 0, "datetime-local has time").toBe(true);
    expect(q2.displayValue.indexOf(prefix), "datetime-local has year").toBe(0);
    expect(q2.displayValue.indexOf(":") < 0, "date has no time").toBe(true);
  });
  test("Supporting showCommentArea property, Bug#5479", () => {
    const supportedComment = {
      radiogroup: true,
      checkbox: true,
      dropdown: true,
      matrix: true,
      rating: true,
      ranking: true,
      matrixdropdown: true,
      matrixdynamic: true,
      paneldynamic: true,
      file: true,
      boolean: true,
      text: false,
      comment: false,
      html: false,
      image: false,
      expression: false
    };
    const survey = new SurveyModel({
      elements: [
        {
          "type": "radiogroup",
          "name": "radiogroup",
          "choices": [1, 2, 3],
          "showCommentArea": true
        },
        {
          "type": "checkbox",
          "name": "checkbox",
          "choices": [1, 2, 3],
          "showCommentArea": true
        },
        {
          "type": "dropdown",
          "name": "dropdown",
          "choices": [1, 2, 3],
          "showCommentArea": true
        },
        {
          "type": "rating",
          "name": "rating",
          "showCommentArea": true
        },
        {
          "type": "ranking",
          "name": "ranking",
          "choices": [1, 2, 3],
          "showCommentArea": true
        },
        {
          "type": "boolean",
          "name": "boolean",
          "showCommentArea": true
        },
        {
          "type": "matrix",
          "name": "matrix",
          "showCommentArea": true,
          "rows": [1, 2],
          "columns": [1, 2]
        },
        {
          "type": "matrixdynamic",
          "name": "matrixdynamic",
          "showCommentArea": true,
          "columns": [{ name: "col1" }]
        },
        {
          "type": "matrixdropdown",
          "name": "matrixdropdown",
          "showCommentArea": true,
          "columns": [{ name: "col1" }],
          "rows": [1, 2]
        },
        {
          "type": "paneldynamic",
          "name": "paneldynamic",
          "showCommentArea": true,
          "templateElements": [
            { "type": "text", "name": "q7" }
          ]
        },
        {
          "type": "file",
          "name": "file",
          "showCommentArea": true
        },
        {
          "type": "text",
          "name": "text",
          "showCommentArea": true
        },
        {
          "type": "comment",
          "name": "comment",
          "showCommentArea": true
        },
        {
          "type": "html",
          "name": "html",
          "showCommentArea": true
        },
        {
          "type": "image",
          "name": "image",
          "showCommentArea": true
        },
        {
          "type": "expression",
          "name": "expression",
          "showCommentArea": true
        },
      ]
    });
    const questions = survey.getAllQuestions();
    questions.forEach(q => {
      const typeName = q.getType();
      const isSupport = supportedComment[typeName];
      expect(q.showCommentArea, "Show comment area is not loaded correctly: " + typeName).toBe(isSupport);
      const prop = Serializer.findProperty(typeName, "showCommentArea");
      expect(prop.visible, "Show comment area property visibility is incorrect: " + typeName).toBe(isSupport);
    });
  });
  test("survey.onMultipleTextItemAdded", () => {
    const survey = new SurveyModel({
      elements: [{
        "name": "q1",
        "type": "multipletext"
      }] });
    let itemName = "";
    survey.onMultipleTextItemAdded.add((sender, options) => {
      itemName = options.item.name;
    });
    const q = <QuestionMultipleTextModel>survey.getQuestionByName("q1");
    q.addItem("item1");
    expect(itemName, "The event raised correctly").toBe("item1");
    q.items.push(new MultipleTextItemModel("item2"));
    expect(itemName, "The event raised correctly on adding into array").toBe("item2");
  });
  test("survey.onMultipleTextItemAdded", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          name: "q1",
          type: "radiogroup",
          choices: ["yes", "no"]
        },
        {
          "name": "q2",
          "type": "text",
          "requiredIf": "{q1} = 'yes'"
        }]
    });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    q1.value = "yes";
    expect(q2.isRequired, "q2 is required").toBe(true);
    survey.tryComplete();
    expect(q2.errors.length, "One error is shown").toBe(1);
    q1.value = "no";
    expect(q2.isRequired, "q2 is not required").toBe(false);
    expect(q2.errors.length, "Errors are cleaned").toBe(0);
  });
  test("cols property is invisible and non-serializable", () => {
    const prop = Serializer.findProperty("comment", "cols");
    expect(prop.visible, "property is invisible").toBe(false);
    expect(prop.isSerializable, "property is non-serializable").toBe(false);
  });
  test("question.getRootCss apply disable css correctly", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "name": "q1",
          "type": "text"
        }]
    });
    const q = survey.getQuestionByName("q1");
    survey.setCss({ question: { titleReadOnly: "css-disabled" } });
    q.updateElementCss(true);
    const disableCss = q.cssClasses.titleReadOnly;
    expect(disableCss, "#1").toBe("css-disabled");
    expect(q.cssTitle.indexOf(disableCss) === -1, "disableCss is not in the title, #2").toBeTruthy();
    q.readOnly = true;
    expect(q.cssTitle.indexOf(disableCss) > -1, "disableCss is in the title, #3").toBeTruthy();
    q.readOnly = false;
    expect(q.cssTitle.indexOf(disableCss) === -1, "disableCss is not in the title, #4").toBeTruthy();
  });
  test("numeric validator, use custom text, bug#6588", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "text",
          "name": "q1",
          "validators": [
            {
              "type": "numeric",
              "text": "Enter only numbers"
            }
          ]
        },
        {
          "type": "text",
          "name": "q2",
          "validators": [{ "type": "numeric" }
          ]
        }
      ] });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    q1.value = "aa";
    q2.value = "aa";
    survey.validate();
    expect(q1.errors.length, "One error").toBe(1);
    expect(q1.errors[0].getText(), "Customer error").toBe("Enter only numbers");
    expect(q2.errors.length, "One error, #2").toBe(1);
    expect(q2.errors[0].getText(), "Default error").toBe("The value should be numeric.");
  });
  test("Try to set incorrect values, bug#6629", () => {
    const oldFunc = ConsoleWarnings.inCorrectQuestionValue;
    const incorrectCalls: Array<string> = [];
    ConsoleWarnings.inCorrectQuestionValue = (questionName: string, val: any): void => {
      incorrectCalls.push(questionName);
    };
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrix",
          name: "q1",
          columns: [1, 2],
          rows: [1, 2],
          defaultValue: "a"
        },
        {
          type: "matrixdropdown",
          name: "q2",
          columns: [{ cellType: "text", name: "col1" }],
          rows: [1, 2],
          defaultValue: "b"
        },
        {
          type: "matrixdynamic",
          name: "q3",
          columns: [{ cellType: "text", name: "col1" }],
          panelCount: 1,
          defaultValue: "c"
        },
        {
          type: "paneldynamic",
          name: "q4",
          templateElements: [{ type: "text", name: "q4_q1" }],
          defaultValue: "d"
        },
        {
          type: "multipletext",
          name: "q5",
          items: [{ name: "item1" }],
          defaultValue: "e"
        },
        {
          type: "checkbox",
          name: "q6",
          choices: [1, 2],
          defaultValue: "f"
        }
      ] });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    const q3 = survey.getQuestionByName("q3");
    const q4 = survey.getQuestionByName("q4");
    const q5 = survey.getQuestionByName("q5");
    const q6 = survey.getQuestionByName("q6");
    expect(incorrectCalls.length, "Incorrect calls 5 times").toBe(5);
    expect(incorrectCalls).toEqual(["q1", "q2", "q3", "q4", "q5"]);
    expect(q1.isEmpty(), "Can't set 'a' to matrix").toBe(true);
    expect(q2.isEmpty(), "Can't set 'b' to matrixdropdown").toBe(true);
    expect(q3.isEmpty(), "Can't set 'c' to matrixdynamic").toBe(true);
    expect(q4.isEmpty(), "Can't set 'd' to paneldynamic").toBe(true);
    expect(q5.isEmpty(), "Can't set 'e' to multipletext").toBe(true);
    expect([...(q6.value)], "Convert to array").toEqual(["f"]);
    ConsoleWarnings.inCorrectQuestionValue = oldFunc;
  });
  test("Update on changing commentPlaceholder UI immediately, bug#6797", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "file",
          name: "q1",
          showCommentArea: true,
          commentPlaceholder: {
            default: "abc",
            de: "abc-de"
          }
        }
      ] });
    const q1 = survey.getQuestionByName("q1");
    expect(q1.renderedCommentPlaceholder, "Loaded from survey").toBe("abc");
    q1.readOnly = true;
    expect(q1.renderedCommentPlaceholder, "Do not show when read-only").toBeFalsy();
    q1.commentPlaceholder = "edf";
    expect(q1.renderedCommentPlaceholder, "Do not show when read-only, #2").toBeFalsy();
    q1.readOnly = false;
    expect(q1.renderedCommentPlaceholder, "question is not read-only").toBe("edf");
    q1.commentPlaceholder = "abcd";
    expect(q1.renderedCommentPlaceholder, "comment placeholder is changed").toBe("abcd");
    survey.locale = "de";
    expect(q1.renderedCommentPlaceholder, "locale is changed").toBe("abc-de");
  });
  test("Dynamic error text in expression validator, bug#6790", () => {
    const survey = new SurveyModel({
      checkErrorsMode: "onValueChanged",
      elements: [
        {
          type: "text",
          name: "q1",
          isRequired: true
        },
        {
          type: "expression",
          name: "q2",
          expression: "100 - {q1}",
          validators: [
            {
              type: "expression",
              text: "{q2}% left.",
              expression: "{leftover} <= 0"
            }
          ]
        }
      ]
    });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    q1.value = 10;
    expect(q2.errors.length, "Error is here, #1").toBe(1);
    const error = q2.errors[0];
    expect(q2.errors[0].locText.renderedHtml, "Error text is correct, #1").toBe("90% left.");
    let errorTextChangedCounter = 0;
    error.locText.onChanged = (): void => {
      errorTextChangedCounter ++;
    };
    q1.value = 20;
    expect(q2.errors.length, "Error is here, #2").toBe(1);
    expect(q2.errors[0].locText.renderedHtml, "Error text is correct, #2").toBe("80% left.");
    expect(error.locText.renderedHtml, "Old error text is correct, #2").toBe("80% left.");
    expect(error, "Same errors").toBe(q2.errors[0]);
    expect(errorTextChangedCounter, "text has been updated").toBe(1);
  });
  test("question.onHidingContent() call on making question or parent invisible or on making question content or parent invisible ", () => {
    let survey = new SurveyModel({
      elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }]
    });
    let counter = 0;
    let q1 = survey.getQuestionByName("q1");
    q1.onHidingContent = (): void => { counter ++; };
    q1.visible = false;
    expect(counter, "question invisible").toBe(1);
    q1.visible = true;
    q1.collapse();
    expect(counter, "question content is collapsed").toBe(2);
    survey = new SurveyModel({
      elements: [
        { type: "panel", name: "panel1",
          elements: [{ type: "file", name: "q1" }]
        },
        { type: "file", name: "q2" }
      ]
    });
    const panel = survey.getPanelByName("panel1");
    q1 = survey.getQuestionByName("q1");
    q1.onHidingContent = (): void => { counter ++; };
    counter = 0;
    panel.visible = false;
    expect(counter, "panel invisible").toBe(1);
    panel.visible = true;
    panel.collapse();
    expect(counter, "panel content is collapsed").toBe(2);
  });
  test("question.onHidingContent() call on going to another page or complete", () => {
    const survey = new SurveyModel({
      pages: [
        { elements: [{ type: "text", name: "q2" }] },
        { elements: [{ type: "text", name: "q1" }] },
        { elements: [{ type: "text", name: "q3" }] }
      ]
    });
    let counter = 0;
    const q1 = survey.getQuestionByName("q1");
    q1.onHidingContent = (): void => { counter ++; };
    survey.currentPageNo = 1;
    expect(counter, "Initial").toBe(0);
    survey.nextPage();
    expect(counter, "Go to next page").toBe(1);
    survey.currentPageNo = 1;
    survey.currentPageNo = 0;
    expect(counter, "Go to prev page").toBe(2);

    survey.pages[2].visible = false;
    survey.currentPageNo = 1;
    survey.doComplete();
    expect(counter, "complete survey").toBe(3);
  });
  test("Set array and convert it to a string, bug#6886", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        { type: "comment", name: "q2" }
      ]
    });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    const q3 = survey.getQuestionByName("q3");
    q1.value = ["item1", "item2", "item3"];
    q2.value = ["item1", "item2", "item3"];
    expect(q1.value, "q1").toBe("item1, item2, item3");
    expect(q2.value, "q2").toBe("item1\nitem2\nitem3");
  });
  test("Set array and convert it to a string & defaultValueExpression, bug#6886", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "checkbox", name: "q1", choices: ["a", "b", "c", "d"] },
        { type: "comment", name: "q2", defaultValueExpression: "{q1}" },
        { type: "text", name: "q3", defaultValueExpression: "{q1}" }
      ]
    });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    const q3 = survey.getQuestionByName("q3");
    q1.value = ["a", "b", "c"];
    expect([...(q1.value)], "q1").toEqual(["a", "b", "c"]);
    expect(q2.value, "q2").toBe("a\nb\nc");
    expect(q3.value, "q3").toBe("a, b, c");
  });
  test("defaultValueExpression & set data", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2" },
        { type: "text", name: "q3", defaultValueExpression: "{q1} + {q2}" }
      ]
    });
    const q1 = survey.getQuestionByName("q1");
    const q3 = survey.getQuestionByName("q3");
    survey.data = { q1: 1, q2: 2, q3: 3 };
    expect(q3.value, "Value is set correctly").toBe(3);
    q1.value = 5;
    expect(q3.value, "Value is changed based on expression").toBe(7);
  });
  test("question.resetValueIf, basic functionality", () => {
    const survey = new SurveyModel({
      elements: [{
        "name": "q1",
        "type": "text"
      },
      {
        "name": "q2",
        "type": "text",
        "resetValueIf": "{q1} = 1"
      },
      {
        "name": "q3",
        "type": "text"
      }
      ] });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    const q3 = survey.getQuestionByName("q3");
    expect(q2.resetValueIf, "Load from JSON").toBe("{q1} = 1");
    q2.value = "abc";
    q1.value = 2;
    expect(q2.value, "value is set").toBe("abc");
    q1.value = 1;
    expect(q2.isEmpty(), "value is cleared").toBe(true);
    q2.value = "edf";
    expect(q2.value, "value is set, #2").toBe("edf");
    q3.value = 3;
    expect(q2.value, "value is stay, #3").toBe("edf");
  });
  test("question.resetValueIf & quesiton.defaultValueExpression", () => {
    const survey = new SurveyModel({
      elements: [{
        "name": "q1",
        "type": "text"
      },
      {
        "name": "q2",
        "type": "text",
        "resetValueIf": "{q1} = 1",
        "defaultValueExpression": "iif({q3} > 2, {q3}, '')"
      },
      {
        "name": "q3", "type": "text"
      }
      ] });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    const q3 = survey.getQuestionByName("q3");
    q2.value = "abc";
    q3.value = 3;
    expect(q2.value, "value is set directly").toBe("abc");
    q1.value = 1;
    expect(q2.value, "value is set from defaultValueExpression").toBe(3);
    q2.value = "edf";
    expect(q2.value, "value is set directly, #2").toBe("edf");
    q3.value = 4;
    expect(q2.value, "value is set directly, #3").toBe("edf");
  });
  test("question.resetValueIf, cycle calls", () => {
    const survey = new SurveyModel({
      elements: [{
        "name": "dog",
        "type": "checkbox",
        "resetValueIf": "{none} notempty",
        "choices": ["dog"]
      },
      {
        "name": "cat",
        "type": "checkbox",
        "resetValueIf": "{none} notempty",
        "choices": ["cat"]
      },
      {
        "name": "none",
        "type": "checkbox",
        "resetValueIf": "{dog} notempty or {cat} notempty",
        "choices": ["none"]
      }] });
    const q1 = survey.getQuestionByName("dog");
    const q2 = survey.getQuestionByName("cat");
    const q3 = survey.getQuestionByName("none");
    q1.value = ["dog"];
    q2.value = ["cat"];
    expect([...(q1.value)], "q1.value #1").toEqual(["dog"]);
    expect([...(q2.value)], "q2.value #1").toEqual(["cat"]);
    expect(q3.isEmpty(), "q3.value #1").toBe(true);
    q3.value = ["none"];
    expect(q1.isEmpty(), "q1.value #2").toBe(true);
    expect(q2.isEmpty(), "q2.value #2").toBe(true);
    expect([...(q3.value)], "q3.value #2").toEqual(["none"]);
    q1.value = ["dog"];
    expect([...(q1.value)], "q1.value #3").toEqual(["dog"]);
    expect(q3.isEmpty(), "q2.value #3").toBe(true);
    expect(q3.isEmpty(), "q3.value #3").toBe(true);
  });
  test("question.resetValueIf and invisibleQuestions", () => {
    const survey = new SurveyModel({
      elements: [{
        "name": "q1",
        "type": "text"
      },
      {
        "name": "q2",
        "type": "text",
        "resetValueIf": "{q1} = 1",
        "visible": false
      }
      ] });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    q2.value = "abc";
    expect(q2.value, "value is set").toBe("abc");
    q1.value = 1;
    expect(q2.isEmpty(), "value is cleared").toBe(true);
  });
  test("question.resetValueIf with one function, no question expression, Bug#9338", () => {
    let returnValue = false;
    FunctionFactory.Instance.register("func1", (params: any) => {
      return returnValue;
    });
    const survey = new SurveyModel({
      elements: [{
        "name": "q1",
        "type": "text"
      },
      {
        "name": "q2",
        "type": "text",
        "resetValueIf": "func1()"
      }
      ] });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    q2.value = "abc";
    expect(q2.value, "q2.value #1").toBe("abc");
    q1.value = 1;
    expect(q2.value, "q2.value #2").toBe("abc");
    returnValue = true;
    q1.value = 2;
    expect(q2.isEmpty(), "q2.value #3").toBe(true);
    q2.value = "abc";
    expect(q2.isEmpty(), "q2.value #4").toBe(false);
    q1.value = 3;
    expect(q2.isEmpty(), "q2.value #5").toBe(true);
    FunctionFactory.Instance.unregister("func1");
  });
  test("question.setValueIf, basic functionality", () => {
    const survey = new SurveyModel({
      elements: [
        { "name": "q1", "type": "text" },
        { "name": "q2", "type": "text", "setValueIf": "{q1} = 1", "setValueExpression": "{q1} + {q3}" },
        { "name": "q3", "type": "text" }
      ] });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    const q3 = survey.getQuestionByName("q3");
    expect(q2.setValueIf, "Load from JSON, setValueIf").toBe("{q1} = 1");
    expect(q2.setValueExpression, "Load from JSON, setValueExpression").toBe("{q1} + {q3}");
    q2.value = "abc";
    q1.value = 2;
    q3.value = 3;
    expect(q2.value, "value is set").toBe("abc");
    q1.value = 1;
    expect(q2.value, "value is set").toBe(4);
    q2.value = "edf";
    expect(q2.value, "value is set, #2").toBe("edf");
    q3.value = 5;
    expect(q2.value, "{q3} is changed").toBe(1 + 5);
    q2.value = "klm";
    expect(q2.value, "value is set, #3").toBe("klm");
    q1.value = 2;
    expect(q2.value, "value is set, #4").toBe("klm");
    q3.value = 7;
    expect(q2.value, "value is set, #5").toBe("klm");
  });
  test("question.setValueIf, setValueExpression is empty", () => {
    const survey = new SurveyModel({
      elements: [
        { "name": "q1", "type": "text" },
        { "name": "q2", "type": "text", "setValueIf": "{q1} = 1" },
        { "name": "q3", "type": "text" }
      ] });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    const q3 = survey.getQuestionByName("q3");
    q2.value = "abc";
    q1.value = 2;
    q3.value = 3;
    expect(q2.value, "value is set").toBe("abc");
    q1.value = 1;
    expect(q2.isEmpty(), "value is clear").toBe(true);
    q2.value = "edf";
    expect(q2.value, "value is set, #2").toBe("edf");
    q3.value = 5;
    expect(q2.value, "value is keep, #3").toBe("edf");
    q1.value = 2;
    expect(q2.value, "value is keep, #3").toBe("edf");
  });
  test("question.setValueIf is empty, setValueExpression is not empty & question is read-only", () => {
    const survey = new SurveyModel({
      elements: [
        { "name": "q1", "type": "text" },
        { "name": "q2", "type": "text", "setValueExpression": "{q1} + {q3}", "readOnly": true },
        { "name": "q3", "type": "text" }
      ] });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    const q3 = survey.getQuestionByName("q3");
    expect(q2.setValueExpression, "Load from JSON, setValueExpression").toBe("{q1} + {q3}");
    q2.value = "abc";
    q1.value = 2;
    q3.value = 3;
    expect(q2.value, "value is set").toBe(2 + 3);
    q2.value = "edf";
    expect(q2.value, "value is set, #2").toBe("edf");
    q3.value = 5;
    expect(q2.value, "value is keep, #3").toBe(2 + 5);
    q1.value = 3;
    expect(q2.value, "value is keep, #4").toBe(3 + 5);
  });

  test("question.setValueIf is empty, setValueExpression is not empty", () => {
    const survey = new SurveyModel({
      elements: [
        { "name": "q1", "type": "text" },
        { "name": "q2", "type": "text", "setValueExpression": "{q1} + {q3}" },
        { "name": "q3", "type": "text" }
      ] });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    const q3 = survey.getQuestionByName("q3");
    expect(q2.setValueExpression, "Load from JSON, setValueExpression").toBe("{q1} + {q3}");
    q2.value = "abc";
    q1.value = 2;
    q3.value = 3;
    expect(q2.value, "value is set").toBe(2 + 3);
    q2.value = "edf";
    expect(q2.value, "value is set, #2").toBe("edf");
    q3.value = 5;
    expect(q2.value, "value is keep, #3").toBe(2 + 5);
    q1.value = 3;
    expect(q2.value, "value is keep, #4").toBe(3 + 5);
  });

  test("question.setValueIf is function, setValueExpression has one field, Bug#9549", () => {
    FunctionFactory.Instance.register("func1", (params: any) => {
      return true;
    });
    const survey = new SurveyModel({
      elements: [
        { "name": "q1", "type": "text" },
        { "name": "q2", "type": "text", "setValueIf": "func1()", "setValueExpression": "{q1}" },
        { "name": "q3", "type": "text" }
      ] });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    const q3 = survey.getQuestionByName("q3");
    q2.value = "abc";
    q1.value = 2;
    expect(q2.value, "value is set, #1").toBe(2);
    q2.value = "edf";
    q3.value = 4;
    expect(q2.value, "value is not set, #2").toBe("edf");
    q1.value = 5;
    expect(q2.value, "value is set, #3").toBe(5);
    FunctionFactory.Instance.unregister("func1");
  });
  test("question.setValueIf is function, setValueExpression has two field, Bug#9549", () => {
    let counter = 0;
    FunctionFactory.Instance.register("func1", (params: any) => {
      counter ++;
      return true;
    });
    const survey = new SurveyModel({
      elements: [
        { "name": "q1", "type": "text" },
        { "name": "q2", "type": "text", "setValueIf": "func1()", "setValueExpression": "{q1} + {q3}" },
        { "name": "q3", "type": "text" },
        { "name": "q4", "type": "text" }
      ] });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    const q3 = survey.getQuestionByName("q3");
    const q4 = survey.getQuestionByName("q4");
    q2.value = "abc";
    q1.value = 2;
    expect(q2.value, "value is set, #1").toBe(2 + 0);
    expect(counter, "func1 is called time #1").toBe(1);
    q2.value = "edf";
    q3.value = 4;
    expect(q2.value, "value is set, #2").toBe(2 + 4);
    expect(counter, "func1 is called time #2").toBe(2);
    q2.value = "edf";
    q4.value = 4;
    expect(counter, "func1 is called time #3").toBe(2);
    expect(q2.value, "value is not set, #3").toBe("edf");
    q1.value = 5;
    expect(q2.value, "value is set, #4").toBe(5 + 4);
    expect(counter, "func1 is called time #4").toBe(3);
    FunctionFactory.Instance.unregister("func1");
  });
  test("question.setValueIf call it on any value change if there is func without params, Bug#10063", () => {
    FunctionFactory.Instance.register("func1", (params: any) => {
      return true;
    });
    FunctionFactory.Instance.register("func2", (params: any) => {
      return 75;
    });
    const survey = new SurveyModel({
      elements: [
        { "name": "q1", "type": "text" },
        { "name": "q2", "type": "text" },
        { "name": "q3", "type": "text" },
        { "name": "q4", "type": "text", "setValueIf": "func1()", "setValueExpression": "{q1} + {q3}" }
      ] });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    const q3 = survey.getQuestionByName("q3");
    const q4 = survey.getQuestionByName("q4");
    q1.value = 1;
    expect(q4.value, "q4.value, #1").toBe(1);
    q4.value = "abc";
    q2.value = 1;
    expect(q4.value, "q4.value, #2").toBe("abc");
    q3.value = 2;
    expect(q4.value, "q4.value, #3").toBe(1 + 2);

    q4.setValueExpression = "func2()";
    q1.value = 2;
    expect(q4.value, "q4.value, #4").toBe(75);
    q4.value = "abc";
    expect(q4.value, "q4.value, #5").toBe("abc");
    q2.value = 3;
    expect(q4.value, "q4.value, #6").toBe(75);

    q4.setValueExpression = "55";
    q1.value = 3;
    expect(q4.value, "q4.value, #7").toBe(55);
    q4.value = "abc";
    expect(q4.value, "q4.value, #8").toBe("abc");
    q2.value = 6;
    expect(q4.value, "q4.value, #9").toBe(55);

    FunctionFactory.Instance.unregister("func1");
    FunctionFactory.Instance.unregister("func2");
  });
  test("question.setValueExpression in several questions, Bug#10297", () => {
    const survey = new SurveyModel({
      elements: [
        {
          "type": "radiogroup",
          "name": "question2",
          "setValueExpression": "iif({total_score} > 0, 'yes', 'no')",
          "choices": [
            "yes",
            "no"
          ]
        },
        {
          "type": "text",
          "name": "total_score",
          "defaultValueExpression": "sum({question3_score})"
        },
        {
          "type": "radiogroup",
          "name": "question3",
          "choices": [
            "yes",
            "no"
          ]
        },
        {
          "type": "text",
          "name": "question3_score",
          "defaultValueExpression": "iif({question3}  = 'yes', 5, 0)"
        },
        {
          "type": "text",
          "name": "total_copy",
          "setValueExpression": "{total_score}"
        }
      ] });
    expect(survey.getValue("total_score"), "total_score.value").toBe(0);
    survey.setValue("question3", "yes");
    expect(survey.getValue("question2"), "question2.value").toBe("yes");
    expect(survey.getValue("total_copy"), "total_copy.value").toBe(5);
  });
  test("question.isReady & async functions in expression", () => {
    var returnResult1 = new Array<(res: any) => void>();
    var returnResult2 = new Array<(res: any) => void>();
    var returnResult3 = new Array<(res: any) => void>();
    function asyncFunc1(params: any): any {
      returnResult1.push(this.returnResult);
      return false;
    }
    function asyncFunc2(params: any): any {
      returnResult2.push(this.returnResult);
      return false;
    }
    function asyncFunc3(params: any): any {
      returnResult3.push(this.returnResult);
      return false;
    }
    FunctionFactory.Instance.register("asyncFunc1", asyncFunc1, true);
    FunctionFactory.Instance.register("asyncFunc2", asyncFunc2, true);
    FunctionFactory.Instance.register("asyncFunc3", asyncFunc3, true);
    const runResults = function(funcList: Array<(res: any) => void>, val: any): void {
      funcList.forEach(func => { func(val); });
    };
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1", minValueExpression: "asyncFunc1()", defaultValueExpression: "asyncFunc2()" },
        { type: "expression", name: "q2", expression: "asyncFunc3()" }
      ]
    });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    expect(q1.isAsyncExpressionRunning, "q1 is running async #1").toBe(true);
    expect(q1.isReady, "q1 is not ready #1").toBe(false);
    expect(q2.isReady, "q2 is not ready #1").toBe(false);
    runResults(returnResult1, 1);
    expect(q1.isAsyncExpressionRunning, "q1 is running async #2").toBe(true);
    expect(q1.isReady, "q1 is not ready #2").toBe(false);
    expect(q2.isReady, "q2 is not ready #2").toBe(false);
    runResults(returnResult2, 2);
    runResults(returnResult1, 1);
    runResults(returnResult2, 2);
    expect(q1.isAsyncExpressionRunning, "q1 is not running async already").toBe(false);
    expect(q2.isAsyncExpressionRunning, "q2 is running async").toBe(true);
    expect(q1.isReady, "q1 is ready #3").toBe(true);
    expect(q2.isReady, "q2 is not ready #3").toBe(false);
    runResults(returnResult3, 3);
    runResults(returnResult2, 2);
    runResults(returnResult1, 1);
    expect(q2.isAsyncExpressionRunning, "q2 is not running async").toBe(false);
    expect(q1.isReady, "q1 is ready #4").toBe(true);
    expect(q2.isReady, "q2 is ready #4").toBe(true);
    expect(q1.value, "q1.value").toBe(2);
    expect(q2.value, "q2.value").toBe(3);

    FunctionFactory.Instance.unregister("asyncFunc1");
    FunctionFactory.Instance.unregister("asyncFunc2");
    FunctionFactory.Instance.unregister("asyncFunc3");
  });
  test("question.isReady & async functions in conditions, visibleIf&enabledIf", () => {
    var returnResult1: (res: any) => void = (res: any) => void {};
    var returnResult2: (res: any) => void = (res: any) => void {};
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
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1", visibleIf: "asyncFunc1()", enableIf: "asyncFunc2()" },
      ]
    });
    const q1 = survey.getQuestionByName("q1");
    expect(q1.isAsyncExpressionRunning, "q1 is running async #1").toBe(true);
    expect(q1.isReady, "q1 is not ready #1").toBe(false);
    returnResult1(1);
    expect(q1.isAsyncExpressionRunning, "q1 is running async #2").toBe(true);
    expect(q1.isReady, "q1 is not ready #2").toBe(false);
    returnResult2(2);
    expect(q1.isAsyncExpressionRunning, "q1 is not running async already").toBe(false);
    expect(q1.isReady, "q1 is ready #3").toBe(true);

    FunctionFactory.Instance.unregister("asyncFunc1");
    FunctionFactory.Instance.unregister("asyncFunc2");
  });

  test("Test", () => {
    const survey = new SurveyModel({
      pages: [
        {
          name: "page1",
          elements: [
            {
              type: "text",
              name: "q1",
            },
            {
              type: "dropdown",
              name: "q2",
              showCommentArea: true
            },
          ],
        },
      ],
    });
    const q2 = survey.getQuestionByName("q2");
    expect(q2.choicesByUrl.isEmpty, "choicesByUrl.isEmpty").toBe(true);
    expect(q2.choicesByUrl.url, "choicesByUrl.url").toBe("");
    expect(q2.choicesByUrl.path, "choicesByUrl.path").toBe("");
    let counter = 0;
    q2.onReadyChanged.add((sender, options) => {
      counter ++;
    });
    const data1 = {
      q1: "q1_value",
      q2: "q2_value",
    };
    survey.data = data1;
    expect(survey.data, "#1").toEqual(data1);
    expect(counter, "#1").toBe(0);
    const data2 = {
      q1: "q1_value",
      q2: "q2_value",
      "q2-Comment": "r32r2r23r23r",
    };
    survey.data = data2;
    expect(survey.data, "#2").toEqual(data2);
    expect(counter, "#2").toBe(0);
  });
  test("question.onReadyChanged should be called for async in setValueExpression", () => {
    let funcRes: (res: any) => void = (res: any) => void {};
    function asyncFunc(params: any): any {
      funcRes = this.returnResult;
      return false;
    }
    FunctionFactory.Instance.register("asyncFunc", asyncFunc, true);
    const survey = new SurveyModel({
      elements: [
        {
          type: "text",
          name: "q1",
          setValueExpression: "asyncFunc({q2})",
        },
        {
          type: "text",
          name: "q2"
        }]
    });
    const q1 = survey.getQuestionByName("q1");
    survey.setValue("q2", "test");
    expect(q1.isAsyncExpressionRunning, "q1 is running async #1").toBe(true);
    let counter = 0;
    q1.onReadyChanged.add((sender, options) => {
      counter ++;
    });
    expect(counter, "#1").toBe(0);
    funcRes(1);
    expect(q1.isAsyncExpressionRunning, "q1 is not running async already").toBe(false);
    expect(q1.isReady, "q1 is ready #2").toBe(true);
    expect(counter, "#2").toBe(1);
    FunctionFactory.Instance.unregister("asyncFunc");
  });

  test("QuestionHtmlModel hide some properties", () => {
    let html = new QuestionHtmlModel("q1");
    ["showNumber", "state", "titleLocation", "showTitle", "descriptionLocation", "errorLocation", "indent", "width"].forEach(property => {
      expect(Serializer.findProperty("html", property).visible, property + " should be hidden").toBe(false);
    });
  });
  test("Hide errors on making question disabled", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1", inputType: "number" },
        { type: "text", name: "q2", isRequired: true, enableIf: "{q1} < 10" }
      ]
    });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    q1.value = 1;
    q2.validate(true);
    expect(q2.isReadOnly, "q2 is enabled").toBe(false);
    expect(q2.errors.length, "There is errors in the question").toBe(1);
    q1.value = 100;
    expect(q2.isReadOnly, "q2 is read-only").toBe(true);
    expect(q2.errors.length, "Clear errors on making questio read-only").toBe(0);
  });
  test("matrix.visibleRows and read-only", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "matrix", name: "matrix", columns: ["col1", "col2"], rows: ["row1", "row2"], readOnly: true }
      ]
    });
    const matrix = <QuestionMatrixModel>survey.getQuestionByName("matrix");
    matrix.value = { row1: "col1", row2: "col2" };
    expect(matrix.visibleRows.length, "visibleRows.length").toBe(2);
    expect(matrix.visibleRows[0].value, "row1.value").toBe("col1");
    expect(matrix.visibleRows[1].value, "row2.value").toBe("col2");
  });
  test("QuestionImagePickerModel.needResponsiveWidth", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "imagepicker", name: "q" }
      ]
    });
    const q = survey.getAllQuestions()[0] as QuestionImagePickerModel;
    expect(survey.widthMode, "Auto mode by default").toBe("auto");
    expect(q.needResponsiveWidth(), "Not responsive for single column auto width mode").toBe(false);
    q.colCount = 3;
    expect(q.needResponsiveWidth(), "Responsive in auto mode for several columns").toBe(true);
  });
  test("question.isDefaultValue", () => {
    const survey = new SurveyModel({
      elements: [
        { name: "q1", type: "text", defaultValue: 1 },
        { name: "q2", type: "text", defaultValueExpression: "1 + 1" },
        { name: "q3", type: "text", defaultValueExpression: "{q1} + {q2}" },
        { name: "q4", type: "text" }
      ]
    });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    const q3 = survey.getQuestionByName("q3");
    const q4 = survey.getQuestionByName("q4");
    expect(q1.value, "q1 value is 1").toBe(1);
    expect(q1.isValueDefault, "q1 #1").toBe(true);
    expect(q2.isValueDefault, "q2 #1").toBe(true);
    expect(q3.isValueDefault, "q3 #1").toBe(true);
    expect(q4.isValueDefault, "q4 #1").toBe(false);
    q1.value = "";
    expect(q1.isValueDefault, "q1 #2").toBe(false);
    expect(q2.isValueDefault, "q2 #2").toBe(true);
    expect(q3.isValueDefault, "q3 #2").toBe(true);
    expect(q4.isValueDefault, "q4 #2").toBe(false);
    q2.value = 4;
    expect(q1.isValueDefault, "q1 #3").toBe(false);
    expect(q2.isValueDefault, "q2 #3").toBe(false);
    expect(q3.isValueDefault, "q3 #3").toBe(true);
    expect(q4.isValueDefault, "q4 #3").toBe(false);
    q3.value = 10;
    expect(q1.isValueDefault, "q1 #4").toBe(false);
    expect(q2.isValueDefault, "q2 #4").toBe(false);
    expect(q3.isValueDefault, "q3 #4").toBe(false);
    expect(q4.isValueDefault, "q4 #4").toBe(false);
  });
  test("defaultValueExpression copy the array/object, Bug#8799", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "source",
          defaultValue: [{ "C1": "A", "C2": "B" }, { "C1": "C" }],
          columns: [{ name: "C1" }, { name: "C2" }],
          cellType: "text"
        },
        {
          type: "paneldynamic",
          name: "panel",
          templateElements: [
            {
              type: "matrixdynamic",
              name: "dest",
              defaultValueExpression: "{source}",
              columns: [{ name: "C1" }, { name: "C2" }],
              cellType: "text",
              rowCount: 0
            }
          ],
          panelCount: 1
        }
      ]
    });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    (<QuestionMatrixDynamicModel>panel.panels[0].getQuestionByName("dest")).visibleRows[1].cells[1].question.value = "D";
    panel.addPanel();
    (<QuestionMatrixDynamicModel>panel.panels[1].getQuestionByName("dest")).visibleRows[1].cells[0].question.value = "E";
    (<QuestionMatrixDynamicModel>survey.getQuestionByName("source")).visibleRows[0].cells[0].question.value = "F";
    expect(survey.data).toEqual({
      source: [{ "C1": "F", "C2": "B" }, { "C1": "C" }],
      panel: [
        { dest: [{ "C1": "A", "C2": "B" }, { "C1": "C", "C2": "D" }] },
        { dest: [{ "C1": "A", "C2": "B" }, { "C1": "E" }] }
      ]
    });
  });
  test("TextAreaOptions", () => {
    Question["questionCounter"] = 101;

    const survey = new SurveyModel({
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "dropdown",
              "name": "q1",
              "defaultValue": "other",
              "showCommentArea": true,
              "commentPlaceholder": "Comment placeholder",
              "choices": [
                "Item 1",
                "Item 2",
                "Item 3"
              ],
              "showOtherItem": true,
              "otherPlaceholder": "Other placeholder"
            },
            {
              "type": "comment",
              "name": "q2"
            }
          ]
        }
      ]
    });

    const q1 = <QuestionDropdownModel>survey.getQuestionByName("q1");
    const otherOptions = q1.otherTextAreaModel;
    const commentOptions = q1.commentTextAreaModel;

    const q2 = <QuestionCommentModel>survey.getQuestionByName("q2");
    const textAreaOptions = q2.textAreaModel;
    const q1Id = q1.id;
    const q2Id = q2.id;
    expect(otherOptions.id, "otherOptions id").toBe(q1Id + "_" + q1.otherItem.uniqueId);
    expect(otherOptions.className, "otherOptions className").toBe("sd-input sd-comment");
    expect(otherOptions.isDisabledAttr, "otherOptions isDisabledAttr").toBe(false);
    expect(otherOptions.isReadOnlyAttr, "otherOptions isReadOnlyAttr").toBeUndefined();
    expect(otherOptions.placeholder, "otherOptions placeholder").toBe("Other placeholder");
    expect(otherOptions.maxLength, "otherOptions maxLength").toBeNull();
    expect(otherOptions.cols, "otherOptions cols").toBeUndefined();
    expect(otherOptions.rows, "otherOptions rows").toBeUndefined();

    expect(commentOptions.id, "commentOptions id").toBe(q1Id + "_comment");
    expect(commentOptions.className, "commentOptions className").toBe("sd-input sd-comment");
    expect(commentOptions.isDisabledAttr, "commentOptions isDisabledAttr").toBe(false);
    expect(commentOptions.isReadOnlyAttr, "commentOptions isReadOnlyAttr").toBeUndefined();
    expect(commentOptions.placeholder, "commentOptions placeholder").toBe("Comment placeholder");
    expect(commentOptions.maxLength, "commentOptions maxLength").toBeNull();
    expect(commentOptions.cols, "commentOptions cols").toBeUndefined();
    expect(commentOptions.rows, "commentOptions rows").toBeUndefined();

    expect(textAreaOptions.id, "textAreaOptions id").toBe(q2Id + "i");
    expect(textAreaOptions.className, "textAreaOptions className").toBe("sd-input sd-comment");
    expect(textAreaOptions.isDisabledAttr, "textAreaOptions isDisabledAttr").toBe(false);
    expect(textAreaOptions.isReadOnlyAttr, "textAreaOptions isReadOnlyAttr").toBe(false);
    expect(textAreaOptions.placeholder, "textAreaOptions placeholder").toBe("");
    expect(textAreaOptions.maxLength, "textAreaOptions maxLength").toBeNull();
    expect(textAreaOptions.cols, "textAreaOptions cols").toBe(50);
    expect(textAreaOptions.rows, "textAreaOptions rows").toBe(4);
  });
  test("Do not remove spaces in comment area, bug#10875", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "text",
          name: "q1",
          showCommentArea: true,
          choices: [
            "Item 1",
            "Item 2",
            "Item 3"
          ]
        }
      ]
    });

    const q1 = <QuestionCommentModel>survey.getQuestionByName("q1");
    q1.value = "text";
    const commentArea = q1.commentTextAreaModel;
    expect(!!commentArea, "comment is created").toBeTruthy();
    commentArea.onTextAreaBlur({ target: { value: "   some text   " } });
    expect(q1.comment, "do not trim spaces").toBe("   some text   ");
    expect(survey.data, "data is correct").toEqual({ q1: "text", "q1-Comment": "   some text   " });
    expect(q1.validate(), "no error on validation").toBe(true);
    commentArea.onTextAreaBlur({ target: { value: "      " } });
    expect(q1.comment, "trim spaces to empty, #2").toBe("");
    expect(survey.data, "there is no comment in data").toEqual({ q1: "text" });
  });
  test("The text area value is not updated on setting the question comment/other value in the code", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "radiogroup",
          "name": "car",
          "title": "Which is the brand of your car?",
          "isRequired": true,
          "showNoneItem": true,
          "showOtherItem": true,
          "colCount": 1,
          "choices": ["Ford", "Vauxhall", "Volkswagen", "Nissan", "Audi", "Mercedes-Benz", "BMW", "Peugeot", "Toyota"],
          "separateSpecialChoices": true,
          "allowClear": true
        }
      ]
    });

    const car = <QuestionDropdownModel>survey.getQuestionByName("car");
    const otherOptions = car.otherTextAreaModel;
    const textArea1 = document.createElement("textarea");

    try {
      otherOptions.setElement(textArea1);
      expect(textArea1.value, "textArea value #1").toBe("");
      expect(otherOptions.getTextValue()).toBe("");

      survey.setComment("car", "new value");
      expect(textArea1.value, "textArea value #2").toBe("new value");
      expect(otherOptions.getTextValue()).toBe("new value");

    } finally {
      textArea1.remove();
    }
  });
  test("The text area value for multiple showCommentArea", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "checkbox",
          "name": "q1",
          "choices": [1, { value: 2, showCommentArea: true }, 3, 4],
          "showOtherItem": true
        }
      ]
    });

    const question = <QuestionDropdownModel>survey.getQuestionByName("q1");
    question.value = [{ value: 1 }, { value: 2 }, { value: "other" }];
    expect([...(question.renderedValue)], "question.renderedValue").toEqual([1, 2, "other"]);
    expect(question.isCommentShowing(question.choices[1]), "isCommentShowing for choice with showCommentArea").toBe(true);
    const otherOptions = question.otherTextAreaModel;
    const item2CommentOptions = question.getCommentTextAreaModel(question.choices[1]);
    const textArea1 = document.createElement("textarea");
    const textArea2 = document.createElement("textarea");

    try {
      otherOptions.setElement(textArea1);
      item2CommentOptions.setElement(textArea2);
      expect(textArea1.value, "textArea value #1").toBe("");
      expect(otherOptions.getTextValue(), "otherOptions value #1").toBe("");
      expect(textArea2.value, "item2CommnetOptions value #1").toBe("");
      expect(item2CommentOptions.getTextValue(), "item2CommnetOptions value #1").toBe("");
      question.otherValue = "other value #1";
      question.setCommentValue(question.choices[1], "choice value #1");

      expect(textArea1.value, "textArea1 value #2").toBe("other value #1");
      expect(otherOptions.getTextValue(), "textArea1 value new value #2").toBe("other value #1");
      expect(textArea2.value, "textArea2 value #2").toBe("choice value #1");
      expect(item2CommentOptions.getTextValue(), "item2CommnetOptions value #2").toBe("choice value #1");

      otherOptions.onTextAreaChange({ target: { value: "other value #2" } });
      item2CommentOptions.onTextAreaChange({ target: { value: "choice value #2" } });

      expect(otherOptions.getTextValue(), "otherOptions value #3").toBe("other value #2");
      expect(item2CommentOptions.getTextValue(), "item2CommnetOptions value #3").toBe("choice value #2");
      expect(question.otherValue, "question.otherValue #3").toBe("other value #2");
      expect(question.getCommentValue(question.choices[1]), "question.getCommentValue #3").toBe("choice value #2");

    } finally {
      textArea1.remove();
      textArea2.remove();
    }
  });
  test("survey.validateVisitedEmptyFields #8640", () => {
    const survey = new SurveyModel({
      validateVisitedEmptyFields: true,
      checkErrorsMode: "onValueChanged",
      elements: [
        { name: "q1", type: "text", isRequired: true },
        { name: "q2", type: "comment", isRequired: true },
        { name: "q3", type: "dropdown", choices: [1, 2, 3], isRequired: true },
        { name: "q4", type: "tagbox", choices: [1, 2, 3], isRequired: true },
        { name: "q5", type: "rating", displayMode: "dropdown", isRequired: true }
      ]
    });
    const event: any = { target: { closest: () => { return null; } }, stopPropagation: () => {} };
    survey.getAllQuestions().forEach(q => {
      q.onFocus(event);
      q.onBlur(event);
      expect(q.errors.length, q.name + " errors").toBe(1);
    });
  });
  test("Show parent number in the question Bug#8813, #1", () => {
    const survey = new SurveyModel({
      showQuestionNumbers: true,
      elements: [
        {
          type: "panel", name: "panel1", title: "Panel 1",
          showNumber: true, questionStartIndex: "1.1", showQuestionNumbers: "onpanel",
          elements: [
            { type: "text", name: "q1" },
            { type: "text", name: "q2" }
          ]
        },
        {
          type: "panel", name: "panel2", title: "Panel 2",
          showNumber: true, questionStartIndex: "1.1", showQuestionNumbers: "onpanel",
          elements: [
            { type: "text", name: "q3" },
            { type: "text", name: "q4" }
          ]
        }
      ]
    });
    expect(survey.getPanelByName("panel1").no, "panel1.no").toBe("1.");
    expect(survey.getPanelByName("panel2").no, "panel2.no").toBe("2.");
    expect(survey.getQuestionByName("q1").no, "q1.no").toBe("1.1");
    expect(survey.getQuestionByName("q2").no, "q2.no").toBe("1.2");
    expect(survey.getQuestionByName("q3").no, "q3.no").toBe("2.1");
    expect(survey.getQuestionByName("q4").no, "q4.no").toBe("2.2");
  });
  test("Show parent number in the question #8813, #2", () => {
    const survey = new SurveyModel({
      showQuestionNumbers: true,
      elements: [
        { type: "text", name: "q1" },
        {
          type: "panel", name: "panel1",
          showNumber: true, questionStartIndex: "1.1", showQuestionNumbers: "onpanel",
          elements: [
            { type: "text", name: "q2" },
            { type: "text", name: "q3" }
          ]
        },
        {
          type: "panel", name: "panel2",
          showNumber: true, questionStartIndex: "1.1", showQuestionNumbers: "onpanel",
          elements: [
            { type: "text", name: "q4" },
            { type: "text", name: "q5" }
          ]
        },
        { type: "text", name: "q6" },
        { type: "text", name: "q7" }
      ]
    });
    expect(survey.getQuestionByName("q1").no, "q1.no").toBe("1.");
    expect(survey.getQuestionByName("q2").no, "q2.no").toBe("2.1");
    expect(survey.getQuestionByName("q3").no, "q3.no").toBe("2.2");
    expect(survey.getQuestionByName("q4").no, "q4.no").toBe("3.1");
    expect(survey.getQuestionByName("q5").no, "q5.no").toBe("3.2");
    expect(survey.getQuestionByName("q6").no, "q6.no").toBe("4.");
    expect(survey.getQuestionByName("q7").no, "q7.no").toBe("5.");
  });
  test("Show parent number in the question #8813, #3", () => {
    const survey = new SurveyModel({
      showQuestionNumbers: true,
      elements: [
        { type: "text", name: "q1" },
        {
          type: "panel", name: "panel1",
          showNumber: true, showQuestionNumbers: "onpanel",
          elements: [
            { type: "text", name: "q2" },
            { type: "text", name: "q3" }
          ]
        },
        {
          type: "panel", name: "panel2",
          showNumber: true, showQuestionNumbers: "onpanel",
          elements: [
            { type: "text", name: "q4" },
            { type: "text", name: "q5" }
          ]
        },
        { type: "text", name: "q6" },
        { type: "text", name: "q7" }
      ]
    });
    expect(survey.getQuestionByName("q1").no, "q1.no").toBe("1.");
    expect(survey.getQuestionByName("q2").no, "q2.no").toBe("1.");
    expect(survey.getQuestionByName("q3").no, "q3.no").toBe("2.");
    expect(survey.getQuestionByName("q4").no, "q4.no").toBe("1.");
    expect(survey.getQuestionByName("q5").no, "q5.no").toBe("2.");
    expect(survey.getQuestionByName("q6").no, "q6.no").toBe("2.");
    expect(survey.getQuestionByName("q7").no, "q7.no").toBe("3.");
  });
  test("Recursive changes setValueExpression #9132", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "dropdown",
          name: "question1",
          choices: ["Item 1", "Item 2", "Item 3"],
        },
        {
          type: "text",
          name: "question2",
          setValueExpression:
          "iif({question1} = 'Item 1', 1, iif({question1} = 'Item 2', 2, iif({question1} = 'Item 3', 3, 0)))",
          inputType: "number",
        },
        {
          type: "dropdown",
          name: "question3",
          choices: ["Item 1", "Item 2", "Item 3"],
        },
        {
          type: "text",
          name: "question4",
          setValueExpression:
          "iif({question3} = 'Item 1', 1, iif({question3} = 'Item 2', 2, iif({question3} = 'Item 3', 3, 0)))",
          inputType: "number",
        },
        {
          type: "text",
          name: "question5",
          defaultValueExpression: "{question2}+{question4}",
          inputType: "number",
          readOnly: true,
        },
        {
          type: "text",
          name: "question6",
          setValueExpression:
          "iif({question5} > 5, 'High Risk', iif({question5} > 3, 'Medium Risk', iif({question5} > 1, 'Low Risk', '')))"
        }
      ],
    });
    const q6 = survey.getQuestionByName("question6");
    expect(q6.isEmpty(), "#0").toBe(true);
    survey.setValue("question6", "test");
    expect(q6.value, "#1").toBe("test");
    survey.setValue("question1", "Item 1");
    expect(q6.value, "#2").toBe("");
    survey.setValue("question3", "Item 1");
    expect(q6.value, "#3").toBe("Low Risk");
    survey.setValue("question1", "Item 3");
    expect(q6.value, "#4").toBe("Medium Risk");
    survey.setValue("question3", "Item 3");
    expect(q6.value, "#5").toBe("High Risk");
  });
  test("defautlValueExpression & custom function & properties.question #9422", () => {
    const logs = new Array<string>();
    FunctionFactory.Instance.register("customFunc1", function () {
      logs.push(this.question?.name);
      return 10;
    }
    );
    const survey = new SurveyModel({
      elements: [
        {
          type: "expression",
          name: "q1",
          defaultValueExpression: "customFunc1()"
        }]
    });
    const q1 = survey.getQuestionByName("q1");
    expect(q1.value, "expression value is correct").toBe(10);
    expect(logs, "custom function is called").toEqual(["q1", "q1"]);
    FunctionFactory.Instance.unregister("customFunc1");
  });
  test("question.validateValueCallback", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1", isRequired: true },
      ]
    });
    const q1 = survey.getQuestionByName("q1");
    let counter = 0;
    q1.validateValueCallback = (): SurveyError => {
      counter ++;
      if (q1.value === "a") return new SurveyError("Error");
      return null;
    };
    q1.validate(true);
    expect(q1.errors.length, "There is an error #1").toBe(1);
    expect(counter, "validateValueCallback is not called #1").toBe(0);
    q1.value = "a";
    expect(q1.errors.length, "There is an error #2").toBe(1);
    expect(counter, "validateValueCallback is called #2").toBe(1);
    q1.value = "b";
    expect(q1.errors.length, "There is no errors #3").toBe(0);
    expect(counter, "validateValueCallback is called #3").toBe(2);
  });
  test("Question visibleIf && onExpressionRunning #10258", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1", visibleIf: "{q2} = 1" },
        { type: "text", name: "q2" }
      ]
    });
    let allow = true;
    let expression = "{q2} = 1";
    let counter = 0;
    survey.onExpressionRunning.add((sender, options) => {
      if ((<any>options.element).name === "q1" && options.propertyName === "visibleIf") {
        options.allow = allow;
        options.expression = expression;
        counter ++;
      }
    });
    const q1 = <QuestionTextModel>survey.getQuestionByName("q1");
    expect(q1.isVisible, "q1.visible #1").toBe(false);
    expect(counter, "counter #1").toBe(0);
    survey.setValue("q2", 1);
    expect(q1.isVisible, "q1.visible #2").toBe(true);
    expect(counter, "counter #2").toBe(1);
    allow = false;
    survey.setValue("q2", 3);
    expect(q1.isVisible, "q1.isVisible #3").toBe(true);
    expect(counter, "counter #3").toBe(2);
    allow = true;
    expression = "{q2} = 2";
    survey.setValue("q2", 4);
    expect(q1.isVisible, "q1.visible #4").toBe(false);
    expect(counter, "counter #4").toBe(3);
    survey.setValue("q2", 2);
    expect(q1.isVisible, "q1.visible #5").toBe(true);
    expect(counter, "counter #5").toBe(4);
  });
  test("Question.validate vs callback function as a parameter #10307", () => {
    let returnResults = new Array<any>();
    function asyncFunc(params: any): any {
      returnResults.push(this.returnResult);
      return false;
    }
    FunctionFactory.Instance.register("asyncFunc", asyncFunc, true);
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1", validators: [{ type: "expression", expression: "asyncFunc({q2})" }] },
        { type: "text", name: "q2", validators: [{ type: "expression", expression: "asyncFunc({q1}) && asyncFunc({q3})" }] },
        { type: "text", name: "q3", validators: [{ type: "expression", expression: "{q2} > {q1}" }] }
      ]
    });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    const q3 = survey.getQuestionByName("q3");
    const callbackResults = new Array<any>();
    q1.value = 1;
    q2.value = 2;
    q3.value = 3;
    const callbackValidators = (res: boolean, question: Question): void => {
      callbackResults.push({ res: res, name: question?.name || "" });
    };
    const q3Res = q3.validate(true, false, false, callbackValidators);
    expect(q3Res, "q3Res").toBe(true);
    expect(returnResults.length, "returnResults, #1").toBe(0);
    expect(callbackResults, "callbackResults, #1").toEqual([{ res: true, name: "" }]);
    callbackResults.splice(0, callbackResults.length);

    const q1Res = q1.validate(true, false, false, callbackValidators);
    expect(q1Res, "q1Res").toBeUndefined();
    expect(returnResults.length, "returnResults, #2").toBe(1);
    expect(callbackResults, "callbackResults, #2").toEqual([]);
    returnResults[0](true);
    expect(callbackResults, "callbackResults, #2").toEqual([{ res: true, name: "" }]);
    returnResults.splice(0, returnResults.length);
    callbackResults.splice(0, callbackResults.length);

    const q2Res = q2.validate(true, false, false, callbackValidators);
    expect(q2Res, "q2Res").toBeUndefined();
    expect(returnResults.length, "returnResults, #3").toBe(2);
    expect(callbackResults, "callbackResults, #3").toEqual([]);
    returnResults[0](true);
    expect(callbackResults, "callbackResults, #3.1").toEqual([]);
    returnResults[1](true);
    expect(callbackResults, "callbackResults, #3").toEqual([{ res: true, name: "" }]);

    FunctionFactory.Instance.unregister("asyncFunc");
  });
  test("Question.validate vs callback function and two different validates #10307", () => {
    let returnResults = new Array<any>();
    function asyncFunc(params: any): any {
      returnResults.push(this.returnResult);
      return false;
    }
    registerFunction({ name: "asyncFunc", func: asyncFunc, isAsync: true, useCache: false });
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2" },
        { type: "text", name: "q3",
          validators: [
            { type: "expression", expression: "{q2} > {q1}" },
            { type: "expression", expression: "asyncFunc({q1})" }] }
      ]
    });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    const q3 = survey.getQuestionByName("q3");
    const callbackResults = new Array<any>();
    q1.value = 1;
    q2.value = 2;
    q3.value = 3;
    const callbackValidators = (res: boolean, question: Question): void => {
      callbackResults.push({ res: res, name: question?.name || "" });
    };
    let q3Res = q3.validate(true, false, false, callbackValidators);
    expect(q3Res, "q3Res, #1").toBeUndefined();
    expect(returnResults.length, "returnResults, #1").toBe(1);
    expect(callbackResults, "callbackResults, #1").toEqual([]);
    returnResults[0](true);
    expect(callbackResults, "callbackResults, #1").toEqual([{ res: true, name: "" }]);
    expect(q3.errors.length, "There is no errors, #1").toBe(0);
    callbackResults.splice(0, callbackResults.length);
    returnResults.splice(0, returnResults.length);

    q2.value = 4;
    q3Res = q3.validate(true, false, false, callbackValidators);
    expect(q3Res, "q3Res, #2").toBeUndefined();
    expect(returnResults.length, "returnResults, #2").toBe(1);
    expect(callbackResults, "callbackResults, #2").toEqual([]);
    expect(q3.errors.length, "There is no errors, #2").toBe(0);
    returnResults[0](false);
    expect(callbackResults, "callbackResults, #2").toEqual([{ res: false, name: "q3" }]);
    expect(q3.errors.length, "There is one error, #2").toBe(1);
    callbackResults.splice(0, callbackResults.length);
    returnResults.splice(0, returnResults.length);

    q1.value = 10;
    returnResults[0](true);
    returnResults.splice(0, returnResults.length);
    q3Res = q3.validate(true, false, false, callbackValidators);
    expect(q3Res, "q3Res, #3").toBe(false);
    expect(returnResults.length, "returnResults, #3").toBe(1);
    expect(callbackResults, "callbackResults, #3").toEqual([{ res: false, name: "q3" }]);
    expect(q3.errors.length, "There is one error, #3").toBe(1);
    returnResults[0](true);
    expect(callbackResults, "callbackResults, #3").toEqual([{ res: false, name: "q3" }]);
    expect(q3.errors.length, "There is one error, #3.2").toBe(1);
    callbackResults.splice(0, callbackResults.length);

    q1.value = 20;
    returnResults[0](true);
    returnResults.splice(0, returnResults.length);

    q3Res = q3.validate(true, false, false, callbackValidators);
    expect(q3Res, "q3Res, #4").toBe(false);
    expect(returnResults.length, "returnResults, #4").toBe(1);
    expect(callbackResults, "callbackResults, #4").toEqual([{ res: false, name: "q3" }]);
    expect(q3.errors.length, "There is one error, #4").toBe(1);
    returnResults[0](false);
    expect(callbackResults, "callbackResults, #4").toEqual([{ res: false, name: "q3" }]);
    expect(q3.errors.length, "There is two errors, #4").toBe(2);

    FunctionFactory.Instance.unregister("asyncFunc");
  });
  test("Question visibleIf & case-sensitive #10338", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "Q1" },
        { type: "text", name: "q2", visibleIf: "{Q1} = 'a'" }
      ]
    });
    const q1 = <QuestionTextModel>survey.getQuestionByName("q1");
    const Q1 = <QuestionTextModel>survey.getQuestionByName("Q1");
    const q2 = <QuestionTextModel>survey.getQuestionByName("q2");
    expect(q2.isVisible, "q2.visible #1").toBe(false);
    Q1.value = "a";
    expect(q2.isVisible, "q2.visible #2").toBe(true);
    Q1.value = "b";
    expect(q2.isVisible, "q2.visible #3").toBe(false);
    q1.value = "a";
    expect(q2.isVisible, "q2.visible #4").toBe(false);
  });
  test("Question visibleIf & question name is number #10526", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "radiogroup",
          name: "9",
          choices: [1, 2]
        },
        {
          type: "radiogroup",
          name: "q1",
          visibleIf: "{9} = 1",
          choices: [
            "ItemABCDEF",
            "Item1"
          ]
        }
      ]
    });
    survey.data = { "9": 1, q1: "ItemABCDEF" };
    const q1 = <QuestionTextModel>survey.getQuestionByName("q1");
    expect(q1.isVisible, "q1.visible #1").toBe(true);
    survey.setValue("9", 2);
    expect(q1.isVisible, "q1.visible #2").toBe(false);
    survey.setValue("9", 1);
    expect(q1.isVisible, "q1.visible #3").toBe(true);
  });
  test("Question name starts with number vs dot #10532", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "radiogroup",
          name: "1.name",
          choices: [1, 2]
        },
        {
          type: "text",
          name: "q1",
          visibleIf: "{1.name} = 1"
        }
      ]
    });
    const qnumber = survey.getQuestionByName("1.name");
    const q1 = survey.getQuestionByName("q1");
    expect(q1.isVisible, "q1.visible #1").toBe(false);
    qnumber.value = 1;
    expect(q1.isVisible, "q1.visible #2").toBe(true);
    qnumber.value = 2;
    expect(q1.isVisible, "q1.visible #3").toBe(false);
  });
  test("Question name starts with number vs space + dot #10532", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "radiogroup",
          name: "1. name",
          choices: [1, 2]
        },
        {
          type: "text",
          name: "q1",
          visibleIf: "{1. name} = 1"
        }
      ]
    });
    const qnumber = survey.getQuestionByName("1. name");
    const q1 = survey.getQuestionByName("q1");
    expect(q1.isVisible, "q1.visible #1").toBe(false);
    qnumber.value = 1;
    expect(q1.isVisible, "q1.visible #2").toBe(true);
    qnumber.value = 2;
    expect(q1.isVisible, "q1.visible #3").toBe(false);
  });
  test("Access question & survey properties, #10532", () => {
    const survey = new SurveyModel({
      title: "Survey Title",
      elements: [
        {
          type: "radiogroup",
          name: "q1",
          title: "{$self.choices[1].text}",
          choices: [{ value: 1, text: "Item 1" }, { value: 2, text: "Item 2" }]
        },
        {
          type: "text",
          name: "q2",
          title: "{$q1.choices[0].text}"
        },
        {
          type: "text",
          name: "q3",
          title: "{$survey.title}"
        }
      ]
    });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    const q3 = survey.getQuestionByName("q3");
    expect(q1.locTitle.renderedHtml, "q1 title is correct").toBe("Item 2");
    expect(q2.locTitle.renderedHtml, "q2 title is correct").toBe("Item 1");
    expect(q3.locTitle.renderedHtml, "q3 title is correct").toBe("Survey Title");
    q1.choices[0].text = "New Item 1";
    q1.choices[1].text = "New Item 2";
    survey.title = "New Survey Title";
    expect(q1.locTitle.renderedHtml, "q1 title is correct #2").toBe("New Item 2");
    expect(q2.locTitle.renderedHtml, "q2 title is correct #2").toBe("New Item 1");
    expect(q3.locTitle.renderedHtml, "q3 title is correct #2").toBe("New Survey Title");
  });
  test("Access question properties in expression, #10532", () => {
    const survey = new SurveyModel({
      title: "Survey Title",
      elements: [
        {
          type: "text",
          name: "q1",
        },
        {
          type: "text",
          name: "q2",
          visibleIf: "{q1} = 2"
        },
        {
          type: "text",
          name: "q3",
          visibleIf: "{$q2.isVisible}"
        }
      ]
    });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    const q3 = survey.getQuestionByName("q3");
    expect(q2.isVisible, "q2 is not visible").toBe(false);
    expect(q3.isVisible, "q3 is not visible").toBe(false);
    q1.value = 2;
    expect(q2.isVisible, "q2 is visible").toBe(true);
    expect(q3.isVisible, "q3 is visible").toBe(true);
    q1.value = 3;
    expect(q2.isVisible, "q2 is not visible #2").toBe(false);
    expect(q3.isVisible, "q3 is not visible #2").toBe(false);
  });
  test("Access question properties in expression with modified prefix, #10958", () => {
    settings.expressionElementPropertyPrefix = "@";
    const survey = new SurveyModel({
      title: "Survey Title",
      elements: [
        {
          type: "text",
          name: "q1",
        },
        {
          type: "text",
          name: "q2",
          visibleIf: "{q1} = 2"
        },
        {
          type: "text",
          name: "q3",
          visibleIf: "{@q2.isVisible}"
        }
      ]
    });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    const q3 = survey.getQuestionByName("q3");
    expect(q2.isVisible, "q2 is not visible").toBe(false);
    expect(q3.isVisible, "q3 is not visible").toBe(false);
    q1.value = 2;
    expect(q2.isVisible, "q2 is visible").toBe(true);
    expect(q3.isVisible, "q3 is visible").toBe(true);
    q1.value = 3;
    expect(q2.isVisible, "q2 is not visible #2").toBe(false);
    expect(q3.isVisible, "q3 is not visible #2").toBe(false);
    settings.expressionElementPropertyPrefix = "$";
  });
  test("Disable access question properties in expression, #10958", () => {
    settings.expressionElementPropertyPrefix = "";
    const survey = new SurveyModel({
      title: "Survey Title",
      elements: [
        {
          type: "text",
          name: "$q1",
        },
        {
          type: "text",
          name: "$q2",
          visibleIf: "{$q1} = 2"
        }
      ]
    });
    const q1 = survey.getQuestionByName("$q1");
    const q2 = survey.getQuestionByName("$q2");
    expect(q2.isVisible, "q2 is not visible").toBe(false);
    q1.value = 2;
    expect(q2.isVisible, "q2 is visible").toBe(true);
    q1.value = 3;
    expect(q2.isVisible, "q2 is not visible #2").toBe(false);
    settings.expressionElementPropertyPrefix = "$";
  });
  test("Access question properties in expression - update on property changed, #10532", () => {
    const survey = new SurveyModel({
      title: "Survey Title",
      elements: [
        {
          type: "text",
          name: "q1",
        },
        {
          type: "text",
          name: "q3",
          visibleIf: "{$q2.isVisible}"
        },
        {
          type: "text",
          name: "q2",
          visibleIf: "{q1} = 2"
        }
      ]
    });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    const q3 = survey.getQuestionByName("q3");
    expect(q2.isVisible, "q2 is not visible").toBe(false);
    expect(q3.isVisible, "q3 is not visible").toBe(false);
    q1.value = 2;
    expect(q2.isVisible, "q2 is visible").toBe(true);
    expect(q3.isVisible, "q3 is visible").toBe(true);
    q1.value = 3;
    expect(q2.isVisible, "q2 is not visible #2").toBe(false);
    expect(q3.isVisible, "q3 is not visible #2").toBe(false);
  });
  test("Do not create validators if validators array is empty", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" }
      ]
    });
    const q1 = survey.getQuestionByName("q1");
    expect(q1.getPropertyValue("validators"), "There is no validators array on creatong&loading").toBeUndefined();
    expect(q1.toJSON(), "toJSON works correctly").toEqual({ name: "q1" });
    expect(q1.getPropertyValue("validators"), "There is no validators array on serializing").toBeUndefined();
    expect([...(q1.validators)], "There is no validators in the validators property").toEqual([]);
    expect([...(q1.getPropertyValue("validators"))], "The property returns empty array").toEqual([]);
  });
  test("Do not create errors & renderedErrors on creating&loading", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" }
      ]
    });
    const q1 = survey.getQuestionByName("q1");
    expect(q1.getPropertyValue("errors"), "There is no errors array on creatong&loading").toBeUndefined();
    expect(q1.getPropertyValue("renderedErrors"), "There is no renderedErrors array on creatong&loading").toBeUndefined();
  });
  test("Do not create titleActions on creating&loading", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" }
      ]
    });
    const q1 = survey.getQuestionByName("q1");
    expect(q1.getPropertyValue("titleActions"), "There is no titleActions array on creatong&loading").toBeUndefined();
  });
  test("The expression of matrix cell value is shown in display value when there is no value, bug#11140", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "html",
          name: "question1",
          html: "Matrix cell value: {matrix.Row 1.Column 1}"
        },
        {
          type: "matrixdropdown",
          name: "matrix",
          columns: [
            { name: "Column 1" },
            { name: "Column 2" },
            { name: "Column 3" }
          ],
          choices: [1, 2, 3, 4, 5],
          cellType: "text",
          rows: ["Row 1", "Row 2"]
        }
      ]
    });
    const htmlQuestion = survey.getQuestionByName("question1");
    expect(htmlQuestion.locHtml.textOrHtml, "Initial html with empty matrix value").toBe("Matrix cell value: ");
    survey.setValue("matrix", { "Row 1": { "Column 1": "abc" } });
    expect(htmlQuestion.locHtml.textOrHtml, "Html updated after setting matrix cell value").toBe("Matrix cell value: abc");
  });
});
