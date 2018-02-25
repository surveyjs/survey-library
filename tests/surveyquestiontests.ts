import { Question } from "../src/question";
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
  var q1 = new QuestionSelectBase("q1");
  q1.choices = [{ value: 1, text: "One", price: 4 }, "Two", "Three"];
  var q2 = new QuestionSelectBase("q2");
  q2.choices = q1.choices;
  assert.equal(q2.choices.length, 3, "all three were copied");
  assert.equal(q2.choices[0]["price"], 4, "additional data is copied");
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
QUnit.test("Pre-proccess value for Checkbox", function(assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("Page 1");
  var question = new QuestionCheckboxModel("checkboxQuestion");
  question.choices = ["One", "Two", "Three"];
  page.addQuestion(question);

  survey.setValue("checkboxQuestion", "One");
  assert.deepEqual(question.value, ["One"], "convert value to array");
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
    "q1_row1",
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
    mText.errors[0].getText().indexOf("t1") >= 0,
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
  assert.equal(valueChanged, 1, "value changed on time");
  assert.equal(commentChanged, 1, "comment changed on time");
  assert.equal(visibleChanged, 1, "visibiblity changed on time");
  assert.equal(visibleIndexChanged, 1, "visibleIndex changed on time");
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
    question.errors[0].getText(),
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
