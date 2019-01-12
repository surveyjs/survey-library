import { Question } from "../src/question";
import { QuestionHtmlModel } from "../src/question_html";
import { QuestionFactory } from "../src/questionfactory";
import { QuestionSelectBase } from "../src/question_baseselect";
import { QuestionTextModel } from "../src/question_text";
import { SurveyModel } from "../src/survey";
import { QuestionCheckboxModel } from "../src/question_checkbox";
import { QuestionMatrixModel } from "../src/question_matrix";
import {
  MultipleTextItemModel,
  QuestionMultipleTextModel
} from "../src/question_multipletext";
import {
  NumericValidator,
  AnswerCountValidator,
  EmailValidator,
  RegexValidator
} from "../src/validator";
import { QuestionRadiogroupModel } from "../src/question_radiogroup";
import { QuestionDropdownModel } from "../src/question_dropdown";
import { QuestionRatingModel } from "../src/question_rating";
import { QuestionBooleanModel } from "../src/question_boolean";
import { JsonObject } from "../src/jsonobject";
import { ItemValue } from "../src/itemvalue";
import { QuestionMatrixDropdownModel } from "../src/question_matrixdropdown";
import { AssertionError } from "assert";

export default QUnit.module("Survey_Questions");

QUnit.test("Only some questions support comment", function(assert) {
  var questionText = <Question>QuestionFactory.Instance.createQuestion(
    "text",
    "textQuestion"
  );

  assert.equal(
    questionText.supportComment(),
    false,
    "Text question doesn't support comment."
  );
  assert.equal(
    questionText.hasComment,
    false,
    "Text question doesn't support comment."
  );
  questionText.hasComment = true;
  assert.equal(
    questionText.hasComment,
    false,
    "You can't set has comment to the text question."
  );

  var questionDropDown = <Question>QuestionFactory.Instance.createQuestion(
    "dropdown",
    "dropdownQuestion"
  );
  assert.equal(
    questionDropDown.supportComment(),
    true,
    "Drop down question supports comment."
  );
  assert.equal(
    questionDropDown.hasComment,
    false,
    "Has comment is false by  default."
  );
  questionDropDown.hasComment = true;
  assert.equal(
    questionDropDown.hasComment,
    true,
    "You can set comment for drop down question."
  );
});
QUnit.test("Only some questions support other", function(assert) {
  var questionText = <Question>QuestionFactory.Instance.createQuestion(
    "text",
    "textQuestion"
  );

  assert.equal(
    questionText.supportOther(),
    false,
    "Text question doesn't support other."
  );
  assert.equal(
    questionText.hasOther,
    false,
    "Text question doesn't support other."
  );
  questionText.hasOther = true;
  assert.equal(
    questionText.hasOther,
    false,
    "You can't set has other to the text question."
  );

  var questionDropDown = <Question>QuestionFactory.Instance.createQuestion(
    "dropdown",
    "dropdownQuestion"
  );
  assert.equal(
    questionDropDown.supportOther(),
    true,
    "Drop down question supports other."
  );
  assert.equal(
    questionDropDown.hasOther,
    false,
    "Has other is false by  default."
  );
  questionDropDown.hasOther = true;
  assert.equal(
    questionDropDown.hasOther,
    true,
    "You can set other for drop down question."
  );
});
QUnit.test("Comment and other could not be set together", function(assert) {
  var questionDropDown = <Question>QuestionFactory.Instance.createQuestion(
    "dropdown",
    "dropdownQuestion"
  );
  assert.equal(
    questionDropDown.hasComment,
    false,
    "Initial comment is turn off."
  );
  assert.equal(questionDropDown.hasOther, false, "Initial other is turn off.");

  questionDropDown.hasOther = true;
  assert.equal(questionDropDown.hasOther, true, "set initially other to true");

  questionDropDown.hasComment = true;
  assert.equal(questionDropDown.hasComment, true, "After set comment to true");
  assert.equal(questionDropDown.hasOther, false, "After set comment to true");

  questionDropDown.hasOther = true;
  assert.equal(questionDropDown.hasComment, false, "After set other to true");
  assert.equal(questionDropDown.hasOther, true, "After set other to true");
});
QUnit.test("set choices from another question", function(assert) {
  JsonObject.metaData.addProperty("itemvalue", "price");
  var q1 = new QuestionSelectBase("q1");
  q1.choices = [{ value: 1, text: "One", price: 4 }, "Two", "Three"];
  var q2 = new QuestionSelectBase("q2");
  q2.choices = q1.choices;
  assert.equal(q2.choices.length, 3, "all three were copied");
  assert.equal(q2.choices[0]["price"], 4, "additional data is copied");
  JsonObject.metaData.removeProperty("itemvalue", "price");
});
QUnit.test("visibleChoices changes on setting others to true/false", function(
  assert
) {
  var question = new QuestionSelectBase("dropdownQuestion");
  question.choices = ["One", "Two", "Three"];
  assert.equal(
    question.visibleChoices.length,
    3,
    "By default visibleChoices equals to choices"
  );
  question.hasOther = true;
  assert.equal(
    question.visibleChoices.length,
    4,
    "Add one more item for others"
  );
  question.hasOther = false;
  assert.equal(question.visibleChoices.length, 3, "Remove the others item");
});
QUnit.test(
  "displayValue function for selecteBase questions, issue #483",
  function(assert) {
    var question = new QuestionSelectBase("dropdownQuestion");
    question.choices = [
      { value: 1, text: "Value 1" },
      { value: 2, text: "Value 2" }
    ];
    question.hasOther = true;
    assert.equal(
      question.displayValue,
      "",
      "value is null, displayValue is empty"
    );
    question.value = 1;
    assert.equal(
      question.displayValue,
      "Value 1",
      "the first value is selected"
    );
    question.value = 2;
    assert.equal(
      question.displayValue,
      "Value 2",
      "the second value is selected"
    );
    question.value = 3;
    assert.equal(
      question.displayValue,
      "3",
      "there is no value in the list, so show the value"
    );
    question.value = question.otherItem.value;
    assert.equal(
      question.displayValue,
      question.locOtherText.textOrHtml,
      "the other is selected"
    );
  }
);
QUnit.test("displayValue observable/reactive property", function(assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("p");
  var question = new QuestionSelectBase("dropdownQuestion");
  question.choices = [
    { value: 1, text: "Value 1" },
    { value: 2, text: "Value 2" }
  ];
  page.addElement(question);
  assert.equal(question.getPropertyValue("displayValue"), "", "Empty value");
  question.value = 1;
  assert.equal(
    question.getPropertyValue("displayValue"),
    "Value 1",
    "value is 1"
  );
  survey.setValue("dropdownQuestion", 2);
  assert.equal(
    question.getPropertyValue("displayValue"),
    "Value 2",
    "value is 2"
  );
});
QUnit.test("displayValue function for rating question, issue #1094", function(
  assert
) {
  var question = new QuestionRatingModel("q1");
  question.rateValues = [
    { value: 1, text: "Value 1" },
    { value: 2, text: "Value 2" }
  ];
  assert.equal(
    question.displayValue,
    "",
    "value is null, displayValue is empty"
  );
  question.value = 1;
  assert.equal(question.displayValue, "Value 1", "the first value is selected");
  question.value = 2;
  assert.equal(
    question.displayValue,
    "Value 2",
    "the second value is selected"
  );
  question.value = 3;
  assert.equal(
    question.displayValue,
    "3",
    "there is no value in the list, so show the value"
  );
});
QUnit.test("matrix.displayValue, bug #1087", function(assert) {
  var question = new QuestionMatrixModel("q1");
  question.rows = [{ value: 1, text: "Row 1" }, { value: 2, text: "Row 2" }];
  question.columns = [
    { value: 1, text: "Column 1" },
    { value: 2, text: "Column 2" }
  ];
  question.value = { 1: 1, 2: 2 };
  assert.deepEqual(
    question.displayValue,
    { "Row 1": "Column 1", "Row 2": "Column 2" },
    "matrix question displayValue works correctly"
  );
});
QUnit.test("Question Title property", function(assert) {
  var question = new QuestionTextModel("q1");
  assert.equal(question.title, "q1", "get the question name by default");
  question.title = "My title";
  assert.equal(question.title, "My title", "get the question name by default");
});
QUnit.test("Question titleLocation", function(assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("Page 1");
  var question1 = new QuestionTextModel("q1");
  var question2 = new QuestionTextModel("q1");
  page.addQuestion(question1);
  page.addQuestion(question2);
  assert.equal(question1.hasTitle, true, "By default it has title");
  assert.equal(question1.hasTitleOnTop, true, "By default it has title on top");
  assert.equal(
    question2.visibleIndex,
    1,
    "the second question has visible index 1"
  );
  question1.titleLocation = "hidden";
  assert.equal(question1.hasTitle, false, "Title is hidden");
  assert.equal(question1.hasTitleOnTop, false, "It doesn't show on top");
  assert.equal(
    question2.visibleIndex,
    0,
    "the second question has visible index 0 now"
  );
});
QUnit.skip("Use value of checkbox question as an array", function(assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("Page 1");
  var question = new QuestionCheckboxModel("checkboxQuestion");
  question.choices = ["One", "Two", "Three"];
  page.addQuestion(question);

  question.value.push("One");
  assert.deepEqual(question.value, ["One"], "convert value to array");
});
QUnit.test("Pre-proccess value for Checkbox", function(assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("Page 1");
  var question = new QuestionCheckboxModel("checkboxQuestion");
  question.choices = ["One", "Two", "Three"];
  page.addQuestion(question);

  survey.setValue("checkboxQuestion", "One");
  assert.deepEqual(question.value, ["One"], "convert value to array");
});
QUnit.test("Empty value for Checkbox", function(assert) {
  var question = new QuestionCheckboxModel("checkboxQuestion");
  question.choices = ["One", "Two", "Three"];
  assert.deepEqual(question.value, [], "empty array");
  question.value = ["One"];
  assert.deepEqual(question.value, ["One"], "value");
  question.value = [];
  assert.deepEqual(question.value, [], "empty array");
});
QUnit.test("Matrix Question: visible rows", function(assert) {
  var matrix = new QuestionMatrixModel("q1");
  assert.equal(matrix.hasRows, false, "There is now rows by default.");
  assert.equal(
    matrix.visibleRows.length,
    1,
    "There is always at least one row"
  );
  assert.equal(
    matrix.visibleRows[0].name,
    null,
    "The default row name is empty"
  );
  assert.equal(
    matrix.visibleRows[0].fullName,
    "q1",
    "The default row fullName is the question name"
  );
  matrix.rows = ["row1", "row2"];
  assert.equal(matrix.hasRows, true, "There are two rows");
  assert.equal(matrix.visibleRows.length, 2, "Use the added row");
  assert.equal(matrix.visibleRows[0].name, "row1", "the row name is 'row1'");
  assert.equal(
    matrix.visibleRows[0].fullName,
    matrix.id + "_row1",
    "The default row fullName is the question name"
  );
});
QUnit.test("Matrix Question: get/set values for empty rows", function(assert) {
  var matrix = new QuestionMatrixModel("q1");
  matrix.columns = ["col1", "col2"];
  matrix.value = "col1";
  var rows = matrix.visibleRows;
  assert.equal(rows[0].value, "col1", "set the row value correctly");
  rows[0].value = "col2";
  assert.equal(rows[0].value, "col2", "the row value changed");
  assert.equal(matrix.value, "col2", "the matrix value changed correctly");
});
QUnit.test("Matrix Question: get/set values for two rows", function(assert) {
  var matrix = new QuestionMatrixModel("q1");
  matrix.rows = ["row1", "row2"];
  matrix.columns = ["col1", "col2"];
  matrix.value = { row1: "col1" };
  var rows = matrix.visibleRows;
  assert.equal(rows[0].value, "col1", "set the row value correctly");
  rows[0].value = "col2";
  assert.equal(rows[0].value, "col2", "the row value changed");
  assert.deepEqual(
    matrix.value,
    { row1: "col2" },
    "the matrix value changed correctly"
  );
  rows[1].value = "col1";
  assert.deepEqual(
    matrix.value,
    { row1: "col2", row2: "col1" },
    "the matrix value changed correctly"
  );
});
QUnit.test("Matrix Question set values after visible row generated", function(
  assert
) {
  var matrix = new QuestionMatrixModel("q1");
  matrix.rows = ["row1", "row2"];
  matrix.columns = ["col1", "col2"];
  var rows = matrix.visibleRows;
  matrix.value = { row1: "col1" };
  assert.equal(rows[0].value, "col1", "set the row value correctly");
});
QUnit.test("Matrix Question isAllRowRequired property", function(assert) {
  var matrix = new QuestionMatrixModel("q1");
  matrix.rows = ["row1", "row2"];
  matrix.columns = ["col1", "col2"];
  assert.equal(matrix.hasErrors(), false, "There is no errors by default");
  matrix.isAllRowRequired = true;
  assert.equal(matrix.hasErrors(), true, "There is no errors by default");
});
QUnit.test("Matrix Question supportGoNextPageAutomatic property", function(
  assert
) {
  var matrix = new QuestionMatrixModel("q1");
  matrix.rows = ["row1", "row2"];
  matrix.columns = ["col1", "col2"];
  assert.equal(matrix.supportGoNextPageAutomatic(), false, "Rows are not set");
  matrix.value = { row1: "col1" };
  assert.equal(
    matrix.supportGoNextPageAutomatic(),
    false,
    "The second row is not set"
  );
  matrix.value = { row1: "col1", row2: "col1" };
  assert.equal(matrix.supportGoNextPageAutomatic(), true, "Both rows are set");
});

QUnit.test("Matrix Question clearIncorrectValues", function(assert) {
  var matrix = new QuestionMatrixModel("q1");
  matrix.rows = ["row1", "row2"];
  matrix.columns = ["col1", "col2"];
  matrix.value = { row1: "col2", row2: "col3", row3: "col1" };
  matrix.clearIncorrectValues();

  assert.deepEqual(
    matrix.value,
    { row1: "col2" },
    "Remove values with incorrect row and incorrect column"
  );
});

QUnit.test("Rubric Matrix Question cells get/set cell text", function(assert) {
  var matrix = new QuestionMatrixModel("q1");
  matrix.rows = ["row1", "row2"];
  matrix.columns = ["col1", "col2"];
  assert.equal(matrix.hasCellText, false, "There is no cell text");
  matrix.setCellText(0, 0, "cell11");
  assert.equal(matrix.hasCellText, true, "There is cell text");
  assert.equal(
    matrix.getCellText(0, 0),
    "cell11",
    "get/set by index works correctly"
  );
  matrix.setCellText(0, 0, "");
  assert.equal(matrix.hasCellText, false, "There is no cell text again");
});
QUnit.test("Rubric Matrix Question cells get cell displayText", function(
  assert
) {
  var matrix = new QuestionMatrixModel("q1");
  matrix.rows = ["row1", "row2"];
  matrix.columns = ["col1", "col2"];
  matrix.setCellText(0, 0, "cell11");
  assert.equal(
    matrix.getCellDisplayText(0, 0),
    "cell11",
    "get cell text by indexes"
  );
  assert.equal(
    matrix.getCellDisplayText(matrix.rows[0], matrix.columns[0]),
    "cell11",
    "get cell text by objects"
  );
  assert.equal(
    matrix.getCellDisplayText(matrix.rows[0], matrix.columns[1]),
    "col2",
    "get column text by indexes"
  );
  assert.equal(
    matrix.getCellDisplayText(matrix.rows[0], matrix.columns[1]),
    "col2",
    "get column text by objects"
  );
});

QUnit.test("Rubric Matrix Question cells serialize/deserialize", function(
  assert
) {
  var matrix = new QuestionMatrixModel("q1");
  matrix.rows = ["row1", "row2"];
  matrix.columns = ["col1", "col2"];
  matrix.setCellText(0, 0, "cell11");
  matrix.setCellText(0, 1, "cell12");
  matrix.setCellText(1, 1, "cell22");
  var json = new JsonObject().toJsonObject(matrix);
  assert.deepEqual(
    json,
    {
      name: "q1",
      rows: ["row1", "row2"],
      columns: ["col1", "col2"],
      cells: {
        row1: { col1: "cell11", col2: "cell12" },
        row2: { col2: "cell22" }
      }
    },
    "serialized correctly"
  );
  var matrix2 = new QuestionMatrixModel("q2");
  new JsonObject().toObject(json, matrix2);
  assert.equal(
    matrix2.getCellText(0, 0),
    "cell11",
    "deserialized correctly, cell11"
  );
  assert.equal(
    matrix2.getCellText(0, 1),
    "cell12",
    "deserialized correctly, cell12"
  );
  assert.equal(
    matrix2.getCellText(1, 1),
    "cell22",
    "deserialized correctly, cell22"
  );
});

QUnit.test("Rubric Matrix Question cells default row", function(assert) {
  var matrix = new QuestionMatrixModel("q1");
  matrix.rows = ["row1", "row2"];
  matrix.columns = ["col1", "col2"];
  matrix.setDefaultCellText(1, "defaultCell2");
  matrix.setCellText(0, 0, "cell11");

  assert.equal(matrix.getCellDisplayText(0, 0), "cell11", "Use cell text");
  assert.equal(
    matrix.getCellDisplayText(0, 1),
    "defaultCell2",
    "Use default row cell text"
  );
  assert.equal(matrix.getCellDisplayText(1, 0), "col1", "Use rows text");
  var json = new JsonObject().toJsonObject(matrix);
  assert.deepEqual(
    json,
    {
      name: "q1",
      rows: ["row1", "row2"],
      columns: ["col1", "col2"],
      cells: {
        default: { col2: "defaultCell2" },
        row1: { col1: "cell11" }
      }
    },
    "serialized correctly"
  );
  var matrix2 = new QuestionMatrixModel("q2");
  new JsonObject().toObject(json, matrix2);
  assert.equal(
    matrix2.getCellText(0, 0),
    "cell11",
    "deserialized correctly, cell11"
  );
  assert.equal(
    matrix2.getDefaultCellText(1),
    "defaultCell2",
    "deserialized default cell correctly, defaultCell2"
  );
});

QUnit.test("Multiple Text Item: text property", function(assert) {
  var mItem = new MultipleTextItemModel("text1");
  assert.equal(mItem.title, "text1", "get value from name");
  mItem.title = "display1";
  assert.equal(mItem.title, "display1", "get value from textValue");
});
QUnit.test("Multiple Text Question: get/set values for two texts", function(
  assert
) {
  var mText = new QuestionMultipleTextModel("q1");
  mText.items.push(new MultipleTextItemModel("text1"));
  mText.items.push(new MultipleTextItemModel("text2"));
  mText.value = { text1: "val1" };
  assert.equal(mText.items[0].value, "val1", "get the value from the question");
  mText.items[1].value = "val2";
  assert.deepEqual(
    mText.value,
    { text1: "val1", text2: "val2" },
    "set the value from the text item"
  );
});
QUnit.test(
  "Multiple Text Question: get/set values and properties via question text",
  function(assert) {
    var mText = new QuestionMultipleTextModel("q1");
    mText.items.push(new MultipleTextItemModel("text1"));
    mText.items.push(new MultipleTextItemModel("text2"));
    mText.value = { text1: "val1" };
    assert.ok(mText.items[0].editor, "question has been created");
    assert.equal(
      mText.items[0].editor.value,
      "val1",
      "the value is set correctly from the mText"
    );
    mText.items[0].editor.value = "newValue";
    assert.deepEqual(
      mText.value,
      { text1: "newValue" },
      "can set the value from question"
    );
    mText.items[0].title = "my title";
    assert.equal(
      mText.items[0].editor.title,
      "my title",
      "Title was set correctly"
    );
  }
);
QUnit.test("Multiple Text Question: support goNextPageAutomatic", function(
  assert
) {
  var mText = new QuestionMultipleTextModel("q1");
  mText.items.push(new MultipleTextItemModel("text1"));
  mText.items.push(new MultipleTextItemModel("text2"));

  assert.equal(mText.supportGoNextPageAutomatic(), false, "all text are empty");
  mText.value = { tex1: "val1" };
  assert.equal(
    mText.supportGoNextPageAutomatic(),
    false,
    "The second text is empty"
  );
  mText.value = { text1: "val1", text2: "val2" };
  assert.equal(
    mText.supportGoNextPageAutomatic(),
    true,
    "Both text inputs are set"
  );
});

QUnit.test("Validators for text question + getAllErrors", function(assert) {
  var mText = new QuestionTextModel("");
  assert.equal(mText.hasErrors(), false, "There is no error by default");
  mText.validators.push(new NumericValidator(10, 20));
  assert.equal(
    mText.hasErrors(),
    false,
    "There is no error since the value is empty"
  );
  assert.equal(mText.getAllErrors().length, 0, "There is no error at all");
  mText.value = "ss";
  assert.equal(mText.hasErrors(), true, "The value should be numeric");
  assert.equal(mText.getAllErrors().length, 1, "There is an error");
  mText.value = 25;
  assert.equal(
    mText.hasErrors(),
    true,
    "The value should be between 10 and 20"
  );
  mText.value = "15";
  assert.equal(mText.hasErrors(), false, "The value is fine now.");
  assert.equal(mText.value, 15, "Convert to numeric");
});
QUnit.test("Numeric validation and with 0, Bug #462", function(assert) {
  var mText = new QuestionTextModel("");
  mText.validators.push(new NumericValidator(1, 100));
  mText.value = 0;
  assert.equal(mText.hasErrors(), true, "0 is less then 1");
});
QUnit.test("add Email validator", function(assert) {
  var mText = new QuestionTextModel("");
  assert.equal(mText.validators.length, 0);
  mText.inputType = "email";
  assert.equal(mText.validators.length, 1);
  assert.equal(mText.validators[0].getType(), "emailvalidator");

  var survey = new SurveyModel({
    pages: [
      {
        name: "page1",
        elements: [
          {
            type: "text",
            name: "question1",
            inputType: "email"
          }
        ]
      }
    ]
  });
  var q = <QuestionTextModel>survey.getQuestionByName("question1");
  assert.equal(q.validators.length, 0);
});

QUnit.test("Validators for multiple text question", function(assert) {
  var mText = new QuestionMultipleTextModel("q1");
  mText.items.push(new MultipleTextItemModel("t1"));
  assert.equal(mText.hasErrors(), false, "There is no error by default");
  assert.equal(mText.getAllErrors().length, 0, "There is no error at all");
  mText.items[0].validators.push(new NumericValidator(10, 20));
  mText.value = { t1: "ss" };
  assert.equal(mText.hasErrors(), true, "The value should be numeric");
  assert.equal(mText.getAllErrors().length, 1, "There is error in one item");
  mText.value = { t1: 25 };
  assert.equal(
    mText.hasErrors(),
    true,
    "The value should be between 10 and 20"
  );
  assert.equal(
    mText.errors[0].locText.textOrHtml.indexOf("t1") >= 0,
    true,
    "Error contains information about item name"
  );
  mText.value = { t1: 15 };
  assert.equal(mText.hasErrors(), false, "The value is fine now.");
  assert.equal(mText.items[0].value, 15, "Convert to numeric");
});
QUnit.test("Validators for array value question", function(assert) {
  var question = new QuestionCheckboxModel("q1");
  question.choices = ["item1", "item2", "item3", "item4", "item5"];
  question.value = ["item1"];
  assert.equal(question.hasErrors(), false, "There is no error by default");
  question.validators.push(new AnswerCountValidator(2, 3));
  question.value = ["item1"];
  assert.equal(
    question.hasErrors(),
    true,
    "It should be at least two items selected"
  );
  question.value = ["item1", "item2", "item3"];
  assert.equal(question.hasErrors(), false, "There is one item in value");
  question.value = ["item1", "item2", "item3", "item4"];
  assert.equal(question.hasErrors(), true, "It should be less then 3 items");
  question.value = ["item1", "item3"];
  assert.equal(question.hasErrors(), false, "There is two items in value");
});
QUnit.test("Validators for other values - dropdown, Bug #722", function(
  assert
) {
  var question = new QuestionDropdownModel("q1");
  question.choices = ["1", "2", "3", "4", "5"];
  question.hasOther = true;
  question.value = "1";
  assert.equal(question.hasErrors(), false, "There is no validators");
  question.validators.push(new RegexValidator("[0-9]+"));
  assert.equal(question.hasErrors(), false, "There is no error, 1 is fine");
  question.value = question.otherItem.value;
  question.comment = "aaa";
  assert.equal(
    question.hasErrors(),
    true,
    "The comment doesn't math the regex"
  );
  question.comment = "222";
  assert.equal(question.hasErrors(), false, "The comment math the regex");
});
QUnit.test("Validators for other values - checkbox, Bug #722", function(
  assert
) {
  var question = new QuestionCheckboxModel("q1");
  question.choices = ["1", "2", "3", "4", "5"];
  question.hasOther = true;
  question.value = ["1", "2", question.otherItem.value];
  question.comment = "33";
  assert.equal(question.isOtherSelected, true, "Other is selected");
  question.validators.push(new RegexValidator("[0-9]+"));
  question.validators.push(new AnswerCountValidator(2, 3));
  assert.equal(question.hasErrors(), false, "validation pass correctly");
  question.comment = "aaa";
  assert.equal(question.hasErrors(), true, "'aaa' is not a number");
  question.comment = "11";
  assert.equal(question.hasErrors(), false, "it is fine again");
  question.value = [question.otherItem.value];
  assert.equal(
    question.hasErrors(),
    true,
    "There should be at least 2 values selected"
  );
});
QUnit.test(
  "other values in choices, hasOther=false, Bug(Editor) #242",
  function(assert) {
    var question = new QuestionRadiogroupModel("q1");
    question.choices = ["1", "2", "3", "other"];
    question.isRequired = true;
    question.value = "1";
    assert.equal(question.hasErrors(), false, "Everything is fine");
    question.value = "other";
    assert.equal(
      question.hasErrors(),
      false,
      "Everything is still fine, hasOther = false"
    );
  }
);
QUnit.test("Show errors if others value is selected, but not entered", function(
  assert
) {
  var radio = new QuestionRadiogroupModel("q1");
  new SurveyModel().addNewPage("p1").addQuestion(radio);
  radio.choices = ["one"];
  radio.hasOther = true;
  assert.equal(radio.hasErrors(), false, "There is no error by default");
  radio.value = radio.otherItem.value;
  assert.equal(radio.hasErrors(), true, "The other comment should be entered");
  radio.comment = "Many";
  assert.equal(radio.hasErrors(), false, "We have entered the comment");
});
QUnit.test("SelectBase visibleChoices order", function(assert) {
  var question = new QuestionSelectBase("dropdownQuestion");
  question.choices = ["B", "A", "D", "C"];
  assert.equal(question.choicesOrder, "none", "The default value is 'none'");
  assert.equal(
    question.visibleChoices[0].text,
    "B",
    "By default visible choices is not sorted"
  );
  question.choicesOrder = "asc";
  assert.equal(question.visibleChoices[0].text, "A", "Sorted order is 'asc'");
  question.choicesOrder = "desc";
  assert.equal(question.visibleChoices[0].text, "D", "Sorted order is 'desc'");
});
QUnit.test("Question callbacks test", function(assert) {
  var question = new QuestionTextModel("textQuestion");
  var valueChanged = 0;
  var commentChanged = 0;
  var visibleChanged = 0;
  var visibleIndexChanged = 0;
  question.valueChangedCallback = function() {
    valueChanged++;
  };
  question.commentChangedCallback = function() {
    commentChanged++;
  };
  question.registerFunctionOnPropertyValueChanged("visible", function() {
    visibleChanged++;
  });
  question.registerFunctionOnPropertyValueChanged("visibleIndex", function() {
    visibleIndexChanged++;
  });
  question.value = "test";
  question.comment = "comment";
  question.visible = false;
  question.setVisibleIndex(5);
  assert.equal(valueChanged, 1, "value changed one time");
  assert.equal(commentChanged, 1, "comment changed one time");
  assert.equal(visibleChanged, 1, "visibiblity changed one time");
  assert.equal(visibleIndexChanged, 1, "visibleIndex changed one time");
});
QUnit.test("Init SelectBase with comment comment", function(assert) {
  var survey = new SurveyModel();
  survey.data = { q: "other", "q-Comment": "aaaa" };
  survey.addNewPage("page1");
  var question = new QuestionSelectBase("q");
  question.choices = ["A", "B", "C", "D"];
  survey.pages[0].addQuestion(question);
  assert.equal(question.comment, "aaaa", "Set the initial comment");
});
QUnit.test("SelectBase store others value not in comment", function(assert) {
  var survey = new SurveyModel();
  survey.addNewPage("page1");
  var question = new QuestionSelectBase("q");
  question.choices = ["A", "B", "C", "D"];
  question.hasOther = true;
  survey.pages[0].addQuestion(question);
  survey.storeOthersAsComment = false;

  question.value = null;
  assert.equal(question.isOtherSelected, false, "Others is not selected");
  assert.deepEqual(survey.data, {}, "There is no data in survey");

  question.value = "A";
  question.comment = "test";
  assert.equal(question.isOtherSelected, false, "Others is not selected");
  assert.deepEqual(survey.data, { q: "A" }, "'A' is set");

  question.comment = null;
  question.value = question.otherItem.value;
  assert.equal(
    question.isOtherSelected,
    true,
    "Any other value that is not from choices is other"
  );
  assert.deepEqual(
    survey.data,
    { q: question.otherItem.value },
    "Other Item is set"
  );

  question.comment = "commentTest";
  assert.equal(
    question.isOtherSelected,
    true,
    "Any other value that is not from choices is other"
  );
  assert.deepEqual(survey.data, { q: "commentTest" }, "Other text is set");

  survey.setValue("q", "A");
  assert.equal(question.isOtherSelected, false, "Others is not selected");
  assert.deepEqual(question.value, "A", "'A' is set to the question");

  survey.setValue("q", "FF");
  assert.equal(question.isOtherSelected, true, "set other from survey");
  assert.equal(
    question.value,
    question.otherItem.value,
    "value is otherItem.value"
  );

  question.value = "B";
  assert.equal(question.isOtherSelected, false, "Others is not selected");
  assert.deepEqual(survey.data, { q: "B" }, "'B' is set");
});
QUnit.test("Checkbox store others value not in comment", function(assert) {
  var survey = new SurveyModel();
  survey.addNewPage("page1");
  var question = new QuestionCheckboxModel("q");
  question.choices = ["A", "B", "C", "D"];
  question.hasOther = true;
  survey.pages[0].addQuestion(question);
  survey.storeOthersAsComment = false;

  question.value = null;
  assert.equal(question.isOtherSelected, false, "Others is not selected");
  assert.deepEqual(survey.data, {}, "There is no data in survey");

  question.value = ["A"];
  question.comment = "test";
  assert.equal(question.isOtherSelected, false, "Others is not selected");
  assert.deepEqual(survey.data, { q: ["A"] }, "'A' is set");

  question.comment = null;
  question.value = ["A", question.otherItem.value];
  assert.equal(
    question.isOtherSelected,
    true,
    "Any other value that is not from choices is other"
  );
  assert.deepEqual(
    survey.data,
    { q: ["A", question.otherItem.value] },
    "Other Item is set"
  );

  question.comment = "commentTest";
  assert.equal(
    question.isOtherSelected,
    true,
    "Any other value that is not from choices is other"
  );
  assert.deepEqual(
    survey.data,
    { q: ["A", "commentTest"] },
    "Other text is set"
  );

  survey.setValue("q", ["A"]);
  assert.equal(question.isOtherSelected, false, "Others is not selected");
  assert.deepEqual(question.value, ["A"], "'A' is set to the question");

  survey.setValue("q", ["A", "FF"]);
  assert.equal(question.isOtherSelected, true, "set other from survey");
  assert.deepEqual(
    question.value,
    ["A", question.otherItem.value],
    "value is otherItem.value"
  );

  question.value = ["A", "B"];
  assert.equal(question.isOtherSelected, false, "Others is not selected");
  assert.deepEqual(survey.data, { q: ["A", "B"] }, "'B' is set");
});

QUnit.test("Text inputType=number", function(assert) {
  var question = new QuestionTextModel("text");
  question.inputType = "number";
  question.value = "2";
  assert.strictEqual(question.value, 2, "make it numeric");
  question.value = "2.25";
  assert.strictEqual(question.value, 2.25, "make it numeric/float");
  question.value = "2.25sdd";
  assert.ok(!question.value, "it is empty");
  question.value = "0";
  assert.strictEqual(question.value, 0, "zero value");
});
QUnit.test("Text inputType=range", function(assert) {
  var question = new QuestionTextModel("text");
  question.inputType = "range";
  question.value = "25";
  assert.strictEqual(question.value, 25, "make it numeric");
});
QUnit.test("Text questions spaces is not a valid answer for required", function(
  assert
) {
  var question = new QuestionTextModel("text");
  question.isRequired = true;
  assert.equal(question.hasErrors(), true, "Question is empty");
  assert.equal(
    question.errors[0].locText.textOrHtml,
    "Please answer the question.",
    "error has correct text"
  );
  question.value = "  ";
  assert.equal(question.hasErrors(), true, "spaces is not an answer");
  question.value = " 1 ";
  assert.equal(question.hasErrors(), false, "got the answer");
});
QUnit.test("Custom text in required error", function(assert) {
  var question = new QuestionTextModel("text");
  question.requiredErrorText = "Custom required error";
  question.isRequired = true;
  assert.equal(question.hasErrors(), true, "Question is empty");
  assert.equal(question.errors.length, 1, "There is one error");
  assert.equal(
    question.errors[0].locText.textOrHtml,
    "Custom required error",
    "there is a custom errror text"
  );
});
QUnit.test("Boolean question checkedValue", function(assert) {
  var question = new QuestionBooleanModel("bool");
  assert.equal(question.checkedValue, null, "Indertemenated by default");
  question.value = true;
  assert.equal(
    question.checkedValue,
    true,
    "value == true, checkedvalue == true"
  );
  question.value = false;
  assert.equal(
    question.checkedValue,
    false,
    "value == false, checkedvalue == false"
  );
  question.value = null;
  assert.equal(
    question.checkedValue,
    null,
    "value == null, checkedvalue == null"
  );
  question.value = "a";
  assert.equal(
    question.checkedValue,
    false,
    "value == 'a', checkedvalue == false"
  );
});
QUnit.test("Boolean question valueTrue, valueFalse", function(assert) {
  var question = new QuestionBooleanModel("bool");
  question.valueTrue = "yes";
  question.valueFalse = "no";
  assert.equal(question.checkedValue, null, "Indertemenated by default");
  question.value = "yes";
  assert.equal(
    question.checkedValue,
    true,
    "value == 'yes', checkedvalue == true"
  );
  question.value = "no";
  assert.equal(
    question.checkedValue,
    false,
    "value == 'no', checkedvalue == false"
  );
  question.checkedValue = true;
  assert.equal(question.value, "yes", "checkedvalue == true, value = 'yes'");
  question.checkedValue = false;
  assert.equal(question.value, "no", "checkedvalue == false, value = 'no'");
});
QUnit.test("Boolean question defaultValue", function(assert) {
  var question = new QuestionBooleanModel("bool");
  assert.equal(question.checkedValue, null, "Indertemenated by default");
  question.defaultValue = "true";
  assert.equal(
    question.checkedValue,
    true,
    "defaultValue is set to 'true', checkedvalue == true"
  );
  question.defaultValue = "false";
  assert.equal(
    question.checkedValue,
    true,
    "defaultValue is set to 'false', but value has been already set to checkedvalue == true"
  );

  var survey = new SurveyModel();
  survey.addNewPage("p1");
  survey.pages[0].addQuestion(question);
  assert.deepEqual(survey.data, { bool: false }, "add question into survey");
});

QUnit.test("defaultValue and hasOther - radiogroup, bug#384 (Editor)", function(
  assert
) {
  var json = {
    elements: [
      {
        type: "radiogroup",
        name: "q1",
        choices: [1, 2, 3],
        hasOther: true,
        defaultValue: "otherValue"
      }
    ]
  };
  var survey = new SurveyModel(json);
  var question = <QuestionRadiogroupModel>survey.getQuestionByName("q1");
  assert.equal(question.isOtherSelected, true, "The other is selected");
  assert.equal(question.comment, "otherValue", "other value is set");
});

QUnit.test("defaultValue and hasOther - checkbox, bug#384 (Editor)", function(
  assert
) {
  var json = {
    elements: [
      {
        type: "checkbox",
        name: "q1",
        choices: [1, 2, 3],
        hasOther: true,
        defaultValue: [2, "otherValue"]
      }
    ]
  };
  var survey = new SurveyModel(json);
  var question = <QuestionCheckboxModel>survey.getQuestionByName("q1");
  assert.equal(question.isOtherSelected, true, "The other is selected");
  assert.deepEqual(question.value, [2, "other"], "value set correctly");
  assert.equal(question.comment, "otherValue", "other value is set");
});

QUnit.test("Rating question, visibleRateValues property", function(assert) {
  var rate = new QuestionRatingModel("q1");
  assert.equal(
    rate.visibleRateValues.length,
    5,
    "There are 5 items by default"
  );
  rate.rateMin = 6;
  assert.equal(rate.rateMin, 4, "the min is max - step");
  rate.rateMin = 2;
  rate.rateMax = 1;
  assert.equal(rate.rateMax, 3, "the min is min + step");
  rate.rateMin = 2;
  rate.rateMax = 7;
  rate.rateStep = 10;
  assert.equal(rate.rateStep, 5, "the step is max - min");
  rate.rateStep = 2;
  rate.rateMax = 200;
  assert.equal(
    rate.visibleRateValues.length,
    QuestionRatingModel.MaximumRateValueCount,
    "Values can be more than MaximumRateValueCount."
  );
  rate.rateValues = [1, 2, 3];
  assert.equal(rate.visibleRateValues.length, 3, "Use rate values");
});
QUnit.test("defaultValue propeprty as array", function(assert) {
  var question = new QuestionCheckboxModel("q1");
  assert.notOk(question.defaultValue, "It is empty by default");
  question.defaultValue = [1];
  assert.deepEqual(question.defaultValue, [1], "It is not empty no");
  question.defaultValue = null;
  assert.deepEqual(question.defaultValue, [], "It is empty by default");
});
QUnit.test("Clear errors on making question invisible, bug#846", function(
  assert
) {
  var question = new QuestionTextModel("q1");
  question.isRequired = true;
  question.hasErrors(true);
  assert.equal(question.errors.length, 1, "There is an error");
  question.visible = false;
  question.visible = true;
  assert.equal(question.errors.length, 0, "There is no error now");
});
QUnit.test("Clear errors on making question readOnly, bug#950", function(
  assert
) {
  var question = new QuestionTextModel("q1");
  question.isRequired = true;
  question.hasErrors(true);
  assert.equal(question.errors.length, 1, "There is an error");
  question.readOnly = true;
  question.hasErrors(true);
  assert.equal(question.errors.length, 0, "There is no error now");
  question.readOnly = false;
  question.hasErrors(true);
  assert.equal(question.errors.length, 1, "There is an error again");
});
QUnit.test("displayValue and choice value as object, bug#952", function(
  assert
) {
  var question = new QuestionRadiogroupModel("q1");
  question.choices.push(new ItemValue({ id: 1, val: "v1" }, "item 1"));
  question.choices.push(new ItemValue({ id: 2, val: "v2" }, "item 2"));
  question.value = { id: 2, val: "v2" };
  assert.deepEqual(question.value, { id: 2, val: "v2" }, "value set correctly");
  assert.equal(question.displayValue, "item 2", "display value get correctly");
});
QUnit.test("question.addConditionNames", function(assert) {
  var names = [];
  new QuestionHtmlModel("q_html").addConditionNames(names);
  new QuestionCheckboxModel("q_check").addConditionNames(names);
  var q_mt = new QuestionMultipleTextModel("q_mt");
  q_mt.addItem("item1");
  q_mt.addItem("item2");
  q_mt.addConditionNames(names);
  var q_matrix = new QuestionMatrixModel("q_matrix");
  q_matrix.rows = ["row1", "row2"];
  q_matrix.addConditionNames(names);
  assert.deepEqual(
    names,
    ["q_check", "q_mt.item1", "q_mt.item2", "q_matrix.row1", "q_matrix.row2"],
    "addConditionNames work correctly"
  );
});
QUnit.test("question.addConditionObjectsByContext", function(assert) {
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
  for (var i = 0; i < objs.length; i++) {
    objs[i].question = objs[i].question.name;
  }
  assert.deepEqual(
    objs,
    [
      { name: "q_check", text: "My check title", question: "q_check" },
      { name: "q_mt.item1", text: "q_mt.Item 1 title", question: "q_mt" },
      { name: "q_mt.item2", text: "q_mt.item2", question: "q_mt" },
      { name: "q_matrix.row1", text: "q_matrix.Row 1", question: "q_matrix" },
      { name: "q_matrix.row2", text: "q_matrix.row2", question: "q_matrix" }
    ],
    "addConditionObjectsByContext work correctly"
  );
});

QUnit.test("question.getConditionJson", function(assert) {
  var json = new QuestionHtmlModel("q_html").getConditionJson("equals");
  assert.equal(json, null, "Html has not input value - so it is null");
  var qRadio = new QuestionRadiogroupModel("qRadio");
  qRadio.choices = [1, 2, 3, 4, 5];
  json = qRadio.getConditionJson("equals");
  assert.deepEqual(
    json.choices,
    [1, 2, 3, 4, 5],
    "radiogroup: choices correctly converted"
  );
  assert.equal(json.type, "radiogroup", "radiogroup: type set correctly");

  var qCheckbox = new QuestionCheckboxModel("qCheckbox");
  qCheckbox.choices = [1, 2, 3, 4, 5];
  json = qCheckbox.getConditionJson("equals");
  assert.deepEqual(
    json.choices,
    [1, 2, 3, 4, 5],
    "checkbox: choices correctly converted"
  );
  assert.equal(json.type, "checkbox", "checkbox: type set correctly");
  json = qCheckbox.getConditionJson("contains");
  assert.equal(
    json.type,
    "radiogroup",
    "checkbox: type set correctly for operator contains"
  );
  var q_mt = new QuestionMultipleTextModel("q_mt");
  q_mt.addItem("item1");
  q_mt.addItem("item2");
  json = q_mt.getConditionJson("equals", "dummy");
  assert.equal(json, null, "There is no item as dummy");
  json = q_mt.getConditionJson("equals", "item2");
  assert.ok(json, "multiple text item returns json");
  assert.equal(json.type, "text", "mutltiple text item: type set correctly");
  var q_matrix = new QuestionMatrixModel("q_matrix");
  q_matrix.rows = ["row1", "row2"];
  q_matrix.columns = ["col1", "col2"];
  json = q_matrix.getConditionJson("equals", "row1");
  assert.ok(json, "matrix text item returns json");
  assert.equal(json.type, "dropdown", "matrix row: type set correctly");
});

QUnit.test("question.clearIncorrectValues", function(assert) {
  var qText = new QuestionTextModel("q1");
  qText.value = "1";
  qText.clearIncorrectValues();
  assert.equal(qText.value, "1", "do nothing for text question");
  var qRadio = new QuestionRadiogroupModel("q1");
  qRadio.choices = ["1", "2", "3"];
  qRadio.value = "1";
  qRadio.clearIncorrectValues();
  assert.equal(qRadio.value, "1", "do nothing since item exists in choices");
  qRadio.value = "5";
  qRadio.clearIncorrectValues();
  assert.notOk(qRadio.value, "clear value since item doesn't exist in choices");

  var qcheck = new QuestionCheckboxModel("q1");
  qcheck.choices = ["1", "2", "3"];
  qcheck.value = ["1", "2"];
  qcheck.clearIncorrectValues();
  assert.deepEqual(
    qcheck.value,
    ["1", "2"],
    "do nothing since item exists in choices"
  );
  qcheck.value = ["1", "5"];
  qcheck.clearIncorrectValues();
  assert.deepEqual(qcheck.value, ["1"], "remove one item from choices");
  qcheck.value = ["7", "5"];
  qcheck.clearIncorrectValues();
  assert.deepEqual(
    qcheck.value,
    [],
    "clear values, there is no these items in choices"
  );
});

QUnit.test("questiontext.maxLength", function(assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("p1");
  var qText = new QuestionTextModel("q1");
  page.addElement(qText);
  assert.equal(qText.getMaxLength(), null, "By default it is null");
  survey.maxTextLength = 10;
  assert.equal(qText.getMaxLength(), 10, "get from survey");
  qText.maxLength = 0;
  assert.equal(qText.getMaxLength(), null, "makes it underfined");
  qText.maxLength = 5;
  assert.equal(qText.getMaxLength(), 5, "gets 5 from question");
});

QUnit.test("runCondition on adding element into survey", function(assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("p1");
  var q = new QuestionCheckboxModel("cars");
  q.visibleIf = "{val} = 1";
  page.addElement(q);
  assert.equal(q.isVisible, false, "It should be invisible");
});

QUnit.test("questionselectbase.choicesVisibleIf", function(assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("p1");
  var qCars = new QuestionCheckboxModel("cars");
  qCars.choices = ["Audi", "BMW", "Mercedes", "Volkswagen"];
  page.addElement(qCars);
  var qBestCar = new QuestionRadiogroupModel("bestCar");
  qBestCar.choices = ["Audi", "BMW", "Mercedes", "Volkswagen"];
  qBestCar.choicesVisibleIf = "{cars} contains {item}";
  page.addElement(qBestCar);
  assert.equal(qBestCar.visibleChoices.length, 0, "cars are not selected yet");
  qCars.value = ["BMW"];
  assert.equal(qBestCar.visibleChoices.length, 1, "BMW is selected");
  qCars.value = ["Audi", "BMW", "Mercedes"];
  assert.equal(qBestCar.visibleChoices.length, 3, "3 cars are selected");
  qBestCar.choicesVisibleIf = "";
  assert.equal(qBestCar.visibleChoices.length, 4, "there is no filter");
});

QUnit.test("questionselectbase.choicesEnableIf", function(assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("p1");
  var qCars = new QuestionCheckboxModel("cars");
  qCars.choices = ["Audi", "BMW", "Mercedes", "Volkswagen"];
  page.addElement(qCars);
  var qBestCar = new QuestionRadiogroupModel("bestCar");
  qBestCar.choices = ["Audi", "BMW", "Mercedes", "Volkswagen"];
  qBestCar.choicesEnableIf = "{cars} contains {item}";
  page.addElement(qBestCar);
  assert.equal(qBestCar.enabledChoices.length, 0, "cars are disabled");
  qCars.value = ["BMW"];
  assert.equal(qBestCar.enabledChoices.length, 1, "BMW is enabled");
  qCars.value = ["Audi", "BMW", "Mercedes"];
  assert.equal(qBestCar.enabledChoices.length, 3, "3 cars are enabled");
  qBestCar.choicesEnableIf = "";
  assert.equal(qBestCar.enabledChoices.length, 4, "there is no filter");
});

QUnit.test("questionselectbase.choicesVisibleIf, support {choice}", function(
  assert
) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("p1");
  var qCars = new QuestionCheckboxModel("cars");
  qCars.choices = ["Audi", "BMW", "Mercedes", "Volkswagen"];
  page.addElement(qCars);
  var qBestCar = new QuestionRadiogroupModel("bestCar");
  qBestCar.choices = ["Audi", "BMW", "Mercedes", "Volkswagen"];
  qBestCar.choicesVisibleIf = "{cars} contains {choice}";
  page.addElement(qBestCar);
  assert.equal(qBestCar.visibleChoices.length, 0, "cars are not selected yet");
  qCars.value = ["BMW"];
  assert.equal(qBestCar.visibleChoices.length, 1, "BMW is selected");
  qCars.value = ["Audi", "BMW", "Mercedes"];
  assert.equal(qBestCar.visibleChoices.length, 3, "3 cars are selected");
});

QUnit.test("matrix.rowsVisibleIf", function(assert) {
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
  assert.equal(qBestCar.visibleRows.length, 0, "cars are not selected yet");
  qCars.value = ["BMW"];
  assert.equal(qBestCar.visibleRows.length, 1, "BMW is selected");
  qCars.value = ["Audi", "BMW", "Mercedes"];
  assert.equal(qBestCar.visibleRows.length, 3, "3 cars are selected");
  qBestCar.rowsVisibleIf = "";
  assert.equal(qBestCar.visibleRows.length, 4, "there is no filter");
});

QUnit.test("matrix.columnsVisibleIf", function(assert) {
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
  assert.equal(qBestCar.visibleColumns.length, 0, "cars are not selected yet");
  qCars.value = ["BMW"];
  assert.equal(qBestCar.visibleColumns.length, 1, "BMW is selected");
  qCars.value = ["Audi", "BMW", "Mercedes"];
  assert.equal(qBestCar.visibleColumns.length, 3, "3 cars are selected");
  qBestCar.columnsVisibleIf = "";
  assert.equal(qBestCar.visibleColumns.length, 4, "there is no filter");
});

QUnit.test(
  "matrix.rowsVisibleIf, clear value on making the value invisible",
  function(assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("p1");
    var qBestCar = new QuestionMatrixModel("bestCar");
    qBestCar.columns = ["col1", "col2"];
    qBestCar.rows = ["Audi", "BMW", "Mercedes", "Volkswagen"];
    qBestCar.rowsVisibleIf = "{cars} contains {item}";
    page.addElement(qBestCar);
    survey.setValue("cars", ["BMW", "Audi", "Mercedes"]);
    qBestCar.value = { BMW: "col1", Audi: "col2" };
    assert.deepEqual(
      qBestCar.value,
      { BMW: "col1", Audi: "col2" },
      "Audi is selected"
    );
    survey.setValue("cars", ["BMW"]);
    assert.deepEqual(qBestCar.value, { BMW: "col1" }, "Audi is removed");
    survey.setValue("cars", ["Mercedes"]);
    assert.deepEqual(qBestCar.isEmpty(), true, "All checks are removed");
  }
);

QUnit.test(
  "matrix.columnsVisibleIf, clear value on making the value invisible",
  function(assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("p1");
    var qBestCar = new QuestionMatrixModel("bestCar");
    qBestCar.rows = ["col1", "col2"];
    qBestCar.columns = ["Audi", "BMW", "Mercedes", "Volkswagen"];
    qBestCar.columnsVisibleIf = "{cars} contains {item}";
    page.addElement(qBestCar);
    survey.setValue("cars", ["BMW", "Audi", "Mercedes"]);
    qBestCar.value = { col1: "BMW", col2: "Audi" };
    assert.deepEqual(
      qBestCar.value,
      { col1: "BMW", col2: "Audi" },
      "Audi is selected"
    );
    survey.setValue("cars", ["BMW"]);
    assert.deepEqual(qBestCar.value, { col1: "BMW" }, "Audi is removed");
    survey.setValue("cars", ["Mercedes"]);
    assert.deepEqual(qBestCar.isEmpty(), true, "All checks are removed");
  }
);

QUnit.test("matrixdropdown.rowsVisibleIf", function(assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("p1");
  var qCars = new QuestionCheckboxModel("cars");
  qCars.choices = ["Audi", "BMW", "Mercedes", "Volkswagen"];
  page.addElement(qCars);
  var qBestCar = new QuestionMatrixDropdownModel("bestCar");
  qBestCar.addColumn("col1");
  qBestCar.rows = ["Audi", "BMW", "Mercedes", "Volkswagen"];
  qBestCar.rowsVisibleIf = "{cars} contains {item}";
  page.addElement(qBestCar);
  assert.equal(qBestCar.visibleRows.length, 0, "cars are not selected yet");
  qCars.value = ["BMW"];
  assert.equal(qBestCar.visibleRows.length, 1, "BMW is selected");
  qCars.value = ["Audi", "BMW", "Mercedes"];
  assert.equal(qBestCar.visibleRows.length, 3, "3 cars are selected");
  qBestCar.rowsVisibleIf = "";
  assert.equal(qBestCar.visibleRows.length, 4, "there is no filter");
});

QUnit.test("matrixdropdown.columnsVisibleIf", function(assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("p1");
  var qCars = new QuestionCheckboxModel("cars");
  qCars.choices = ["Audi", "BMW", "Mercedes", "Volkswagen"];
  page.addElement(qCars);
  var qBestCar = new QuestionMatrixDropdownModel("bestCar");
  qBestCar.rows = ["col1"];
  qBestCar.addColumn("Audi");
  qBestCar.addColumn("BMW");
  qBestCar.addColumn("Mercedes");
  qBestCar.addColumn("Volkswagen");
  qBestCar.columnsVisibleIf = "{cars} contains {item}";
  page.addElement(qBestCar);
  assert.equal(qBestCar.visibleColumns.length, 0, "cars are not selected yet");
  qCars.value = ["BMW"];
  assert.equal(qBestCar.visibleColumns.length, 1, "BMW is selected");
  qCars.value = ["Audi", "BMW", "Mercedes"];
  assert.equal(qBestCar.visibleColumns.length, 3, "3 cars are selected");
  qBestCar.columnsVisibleIf = "";
  assert.equal(qBestCar.visibleColumns.length, 4, "there is no filter");
});

QUnit.test(
  "radiogroup.choicesVisibleIf, clear value on making the value invisible, bug #1093",
  function(assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("p1");
    var qBestCar = new QuestionRadiogroupModel("bestCar");
    qBestCar.choices = ["Audi", "BMW", "Mercedes", "Volkswagen"];
    qBestCar.choicesVisibleIf = "{cars} contains {item}";
    page.addElement(qBestCar);
    survey.setValue("cars", ["BMW", "Audi"]);
    qBestCar.value = "Audi";
    assert.equal(qBestCar.value, "Audi", "Audi is selected");
    survey.setValue("cars", ["BMW"]);
    assert.equal(qBestCar.isEmpty(), true, "Audi is cleared");
  }
);
QUnit.test(
  "radiogroup.choicesEnableIf, clear value on making the value disable, survey.clearValueOnDisableItems",
  function(assert) {
    var survey = new SurveyModel();
    survey.clearValueOnDisableItems = true;
    var page = survey.addNewPage("p1");
    var qBestCar = new QuestionRadiogroupModel("bestCar");
    qBestCar.choices = ["Audi", "BMW", "Mercedes", "Volkswagen"];
    qBestCar.choicesEnableIf = "{cars} contains {item}";
    page.addElement(qBestCar);
    survey.setValue("cars", ["BMW", "Audi"]);
    qBestCar.value = "Audi";
    assert.equal(qBestCar.value, "Audi", "Audi is selected");
    survey.setValue("cars", ["BMW"]);
    assert.equal(qBestCar.isEmpty(), true, "Audi is cleared");
  }
);
QUnit.test(
  "checkbox.choicesVisibleIf, clear value on making the value invisible, bug #1093",
  function(assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("p1");
    var qBestCar = new QuestionCheckboxModel("bestCar");
    qBestCar.choices = ["Audi", "BMW", "Mercedes", "Volkswagen"];
    qBestCar.choicesVisibleIf = "{cars} contains {item}";
    page.addElement(qBestCar);
    survey.setValue("cars", ["BMW", "Audi", "Mercedes"]);
    qBestCar.value = ["BMW", "Audi"];
    assert.deepEqual(qBestCar.value, ["BMW", "Audi"], "Audi is selected");
    survey.setValue("cars", ["BMW"]);
    assert.deepEqual(qBestCar.value, ["BMW"], "Audi is removed");
    survey.setValue("cars", ["Mercedes"]);
    assert.deepEqual(qBestCar.isEmpty(), true, "All checks are removed");
  }
);
QUnit.test(
  "checkbox.choicesEnableIf, clear value on making the value disable, survey.clearValueOnDisableItems",
  function(assert) {
    var survey = new SurveyModel();
    survey.clearValueOnDisableItems = true;
    var page = survey.addNewPage("p1");
    var qBestCar = new QuestionCheckboxModel("bestCar");
    qBestCar.choices = ["Audi", "BMW", "Mercedes", "Volkswagen"];
    qBestCar.choicesEnableIf = "{cars} contains {item}";
    page.addElement(qBestCar);
    survey.setValue("cars", ["BMW", "Audi", "Mercedes"]);
    qBestCar.value = ["BMW", "Audi"];
    assert.deepEqual(qBestCar.value, ["BMW", "Audi"], "Audi is selected");
    survey.setValue("cars", ["BMW"]);
    assert.deepEqual(qBestCar.value, ["BMW"], "Audi is removed");
    survey.setValue("cars", ["Mercedes"]);
    assert.deepEqual(qBestCar.isEmpty(), true, "All checks are removed");
  }
);

QUnit.test("itemValue.visibleIf", function(assert) {
  var json = {
    elements: [
      {
        type: "checkbox",
        name: "q",
        choices: [
          { value: "contactbyphone", visibleIf: "{phone} notempty" },
          { value: "contactbyemail", visibleIf: "{email} notempty" }
        ]
      }
    ]
  };
  var survey = new SurveyModel(json);
  var q = <QuestionCheckboxModel>survey.getQuestionByName("q");
  assert.equal(
    q.choices[0].visibleIf,
    "{phone} notempty",
    "itemValue.visibleIf loaded correctly"
  );
  assert.equal(q.visibleChoices.length, 0, "Nothing is set");
  survey.setValue("phone", "1");
  assert.equal(q.visibleChoices.length, 1, "phone is set");
  survey.setValue("email", "2");
  assert.equal(q.visibleChoices.length, 2, "phone and e-mail are set");
});

QUnit.test("itemValue.enableIf", function(assert) {
  var json = {
    elements: [
      {
        type: "checkbox",
        name: "q",
        choices: [
          { value: "contactbyphone", enableIf: "{phone} notempty" },
          { value: "contactbyemail", enableIf: "{email} notempty" }
        ]
      }
    ]
  };
  var survey = new SurveyModel(json);
  var q = <QuestionCheckboxModel>survey.getQuestionByName("q");
  assert.equal(
    q.choices[0].enableIf,
    "{phone} notempty",
    "itemValue.visibleIf loaded correctly"
  );
  assert.equal(q.enabledChoices.length, 0, "Nothing is set");
  survey.setValue("phone", "1");
  assert.equal(q.enabledChoices.length, 1, "phone is set");
  survey.setValue("email", "2");
  assert.equal(q.enabledChoices.length, 2, "phone and e-mail are set");
});

QUnit.test(
  "multipletext item title renders incorrectly if survey.questionTitleTemplate is set, bug #1170",
  function(assert) {
    var json = {
      questionTitleTemplate: "{no}. {title} {require}",
      elements: [
        {
          type: "multipletext",
          name: "question1",
          items: [
            {
              name: "text1"
            }
          ]
        }
      ]
    };
    var survey = new SurveyModel(json);
    var q = <QuestionMultipleTextModel>survey.getQuestionByName("question1");
    assert.equal(q.items[0].locTitle.renderedHtml, "text1", "There is no .");
  }
);
QUnit.test(
  "multipletext item is not readonly when survey is readonly, bug #1177",
  function(assert) {
    var json = {
      mode: "display",
      elements: [
        {
          type: "multipletext",
          name: "question1",
          items: [
            {
              name: "text1"
            }
          ]
        }
      ]
    };
    var survey = new SurveyModel(json);
    var q = <QuestionMultipleTextModel>survey.getQuestionByName("question1");
    assert.equal(q.items[0].editor.isReadOnly, true, "It should be readonly");
  }
);

QUnit.test("space in others does not work correctly , bug #1214", function(
  assert
) {
  var json = {
    elements: [
      {
        type: "radiogroup",
        name: "q1",
        hasOther: true,
        choices: ["high"],
        storeOthersAsComment: false
      }
    ]
  };
  var survey = new SurveyModel(json);
  var q = <QuestionRadiogroupModel>survey.getQuestionByName("q1");
  q.value = q.otherItem.value;
  assert.equal(q.isOtherSelected, true, "other is selected");
  assert.equal(q.hasErrors(), true, "other is not entered");
  q.comment = " ";
  assert.equal(q.isOtherSelected, true, "other is still selected");
  assert.equal(
    q.hasErrors(),
    true,
    "other is not entered, whitespace doesn't count"
  );
});

QUnit.test("Checkbox hasNone", function(assert) {
  var json = {
    elements: [
      {
        type: "checkbox",
        name: "q1",
        hasNone: true,
        choices: [1, 2, 3, 4, 5]
      }
    ]
  };
  var survey = new SurveyModel(json);
  var q = <QuestionCheckboxModel>survey.getQuestionByName("q1");
  assert.equal(q.visibleChoices.length, 6, "5 items + none");
  q.hasNone = false;
  assert.equal(q.visibleChoices.length, 5, "none is removed");
  q.hasNone = true;
  assert.equal(q.visibleChoices.length, 6, "none is added");
  q.value = [1, 2, "none"];
  assert.deepEqual(q.value, ["none"], "we keep only none");
  q.value = [1, "none"];
  assert.deepEqual(q.value, [1], "none should gone");
});

QUnit.test("Checkbox hasSelectAll", function(assert) {
  var json = {
    elements: [
      {
        type: "checkbox",
        name: "q1",
        hasSelectAll: true,
        choices: [1, 2, 3]
      }
    ]
  };
  var survey = new SurveyModel(json);
  var q = <QuestionCheckboxModel>survey.getQuestionByName("q1");
  assert.equal(q.visibleChoices.length, 4, "3 items + select all");
  q.hasSelectAll = false;
  assert.equal(q.visibleChoices.length, 3, "select all is removed");
  q.hasSelectAll = true;
  assert.equal(q.visibleChoices.length, 4, "none is added");
  assert.equal(q.isAllSelected, false, "All items are not selected");
  assert.equal(
    q.isItemSelected(q.selectAllItem),
    false,
    "isItemSelected returns false"
  );
  q.value = [1, 2, 3];
  assert.equal(q.isAllSelected, true, "All items are selected");
  assert.equal(
    q.isItemSelected(q.selectAllItem),
    true,
    "isItemSelected returns true"
  );
  q.hasOther = true;
  q.value = [1, 2, "other"];
  assert.equal(q.isAllSelected, false, "3 is not selected");
  q.value = [1, 2, 3, "other"];
  assert.equal(q.isAllSelected, true, "all + other are selected");
  q.value = [1, 2];
  q.toggleSelectAll();
  assert.deepEqual(
    q.value,
    [1, 2, 3],
    "all items are selected after clicking select all"
  );
  q.toggleSelectAll();
  assert.equal(q.isEmpty(), true, "value is empty");
  q.toggleSelectAll();
  assert.deepEqual(
    q.value,
    [1, 2, 3],
    "all items are selected again after clicking select all"
  );
});

QUnit.test(
  "Set valueName automatically if name property is not valid",
  function(assert) {
    var question = new Question("q1");
    assert.equal(question.valueName, "", "It is empty by default");
    question.name = "q1.";
    assert.equal(question.valueName, "q1", "It has removed '.'");
    question.name = "q.1.";
    assert.equal(question.valueName, "q 1", "Removed and replaced '.'");
    question.name = "q1";
    assert.equal(question.valueName, "", "It is empty again");

    question.valueName = "someValue";
    question.name = "q1.";
    assert.equal(
      question.valueName,
      "someValue",
      "valueName was not assign automatically"
    );
    question.name = "q1";
    assert.equal(question.valueName, "someValue", "keep custom value");

    question = new Question("q.1.");
    assert.equal(question.valueName, "q 1", "Removed and replaced '.'");

    var json = {
      elements: [{ type: "text", name: "q.1." }]
    };
    var survey = new SurveyModel(json);
    question = <Question>survey.getQuestionByName("q.1.");
    assert.ok(question, "question is loaded");
    assert.equal(
      question.valueName,
      "q 1",
      "Removed and replaced '.' on loading"
    );
  }
);
QUnit.test(
  "Replace period '.' with space ' ' on setting a string with '.' into valueName",
  function(assert) {
    var question = new Question("q1");
    question.valueName = "q.1.";
    assert.equal(question.valueName, "q 1", "Correct the value name");
  }
);

QUnit.test(
  "readOnly property doesn't work for multipletext question, #1217",
  function(assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("p");
    var question = new QuestionMultipleTextModel("q1");
    page.addQuestion(question);
    question.addItem("text1");
    question.addItem("text2");
    var itemQuestion = question.items[0].editor;
    assert.equal(
      itemQuestion.isReadOnly,
      false,
      "It is not readOnly by default"
    );
    survey.mode = "display";
    assert.equal(itemQuestion.isReadOnly, true, "survey mode is display");
    survey.mode = "edit";
    assert.equal(itemQuestion.isReadOnly, false, "survey mode is edit");
    question.readOnly = true;
    assert.equal(itemQuestion.isReadOnly, true, "question is readOnly");
  }
);

QUnit.test(
  "Multipletext, item isRequired, 0 is a valid value, bug #1225",
  function(assert) {
    var question = new QuestionMultipleTextModel("q1");
    var item = question.addItem("text1");
    item.isRequired = true;
    item.inputType = "number";
    item.value = 0;
    assert.equal(
      question.hasErrors(),
      false,
      "There is no errors, 0 is a valid value"
    );
  }
);

QUnit.test("Test property hideIfChoicesEmpty", function(assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("p1");
  var question = new QuestionCheckboxModel("q1");
  page.addElement(question);
  assert.equal(question.isVisible, true, "By default it is visible");
  question.hideIfChoicesEmpty = true;
  assert.equal(question.isVisible, false, "Choices are empty");
  question.hasOther = true;
  question.hasSelectAll = true;
  question.hasNone = true;
  assert.equal(question.isVisible, false, "Still choices are empty");
  question.choices = [1, 2, 3];
  assert.equal(question.isVisible, true, "Choices are not empty");
  question.choicesVisibleIf = "{item} = {val1}";
  assert.equal(question.isVisible, false, "Filtered choices are empty");
  survey.setValue("val1", 2);
  assert.equal(question.isVisible, true, "There is one visible item");
});

QUnit.test("Test property hideIfChoicesEmpty - load from json", function(
  assert
) {
  var survey = new SurveyModel({
    elements: [{ type: "dropdown", name: "q1", hideIfChoicesEmpty: true }]
  });
  var question = survey.getQuestionByName("q1");
  assert.equal(question.isVisible, false, "It is invisible");
});

QUnit.test("QuestionHtml + Survey.onProcessHtml event, bug#1294", function(
  assert
) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("p1");
  var question = <QuestionHtmlModel>page.addNewQuestion("html", "q1");
  survey.onProcessHtml.add(function(survey, options) {
    options.html = options.html + "-add-";
  });
  question.html = "text";
  assert.equal(question.locHtml.renderedHtml, "text-add-", "process html");
});

QUnit.test("question.paddingLeft and question.paddingRight", function(assert) {
  var survey = new SurveyModel({
    elements: [{ type: "dropdown", name: "q1" }]
  });
  var question = <Question>survey.getQuestionByName("q1");
  assert.equal(question.paddingLeft, "", "left is empty");
  assert.equal(question.paddingRight, "", "right is empty");
  question.indent = 1;
  question.rightIndent = 2;
  assert.equal(question.paddingLeft, "20px", "left is not empty");
  assert.equal(question.paddingRight, "40px", "right is not empty");
});

QUnit.test(
  "selectbase question item.visibleIf and survey.data on set, bug#1394, https://surveyjs.answerdesk.io/ticket/details/T1228",
  function(assert) {
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
              visibleIf: "{qid260} contains 'oid11772'"
            },
            {
              value: "oid13403",
              text: "RC6",
              visibleIf: "{qid260} contains 'oid13403'"
            },
            {
              value: "oid13404",
              text: "SEED",
              visibleIf: "{qid260} contains 'oid13404'"
            }
          ]
        }
      ]
    });
    survey.data = {
      qid260: ["oid11772", "oid13404"],
      qid261: { oid11772: "1", oid13404: "1" }
    };

    var question = <QuestionMatrixModel>survey.getQuestionByName("qid261");
    assert.deepEqual(
      question.value,
      { oid11772: "1", oid13404: "1" },
      "value set correctly"
    );
    assert.equal(question.visibleRows.length, 2, "Two rows are visible");
    assert.equal(
      question.visibleRows[0].value,
      "1",
      "The first row value is set"
    );
    assert.equal(
      question.visibleRows[1].value,
      "1",
      "The second row value is set"
    );
  }
);
QUnit.test("Load survey with requiredIf expression", function(assert) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "text",
        name: "q1",
        defaultValue: 1
      },
      {
        type: "text",
        name: "q2",
        requiredIf: "{q1} = 1"
      }
    ]
  });
  var question = <Question>survey.getQuestionByName("q2");
  assert.equal(
    question.isRequired,
    true,
    "The question becomes required on loading"
  );
  survey.setValue("q1", 2);
  assert.equal(
    question.isRequired,
    false,
    "The question becomes unrequired on changing value"
  );
  survey.setValue("q1", 1);
  assert.equal(
    question.isRequired,
    true,
    "The question becomes required on changing value"
  );
});
