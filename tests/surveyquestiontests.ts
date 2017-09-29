import {Question} from "../src/question";
import {QuestionFactory} from "../src/questionfactory";
import {QuestionSelectBase} from "../src/question_baseselect";
import {QuestionTextModel} from "../src/question_text";
import {SurveyModel} from "../src/survey";
import {QuestionCheckboxModel} from "../src/question_checkbox";
import {QuestionMatrixModel} from "../src/question_matrix";
import {MultipleTextItemModel, QuestionMultipleTextModel} from "../src/question_multipletext";
import {NumericValidator, AnswerCountValidator, EmailValidator} from "../src/validator";
import {QuestionRadiogroupModel} from "../src/question_radiogroup";
import {QuestionMatrixDropdownModel} from "../src/question_matrixdropdown";
import {MatrixDropdownColumn} from "../src/question_matrixdropdownbase";
import {QuestionDropdownModel} from "../src/question_dropdown";
import {QuestionMatrixDynamicModel} from "../src/question_matrixdynamic";
import {QuestionRatingModel} from "../src/question_rating";
import {QuestionBooleanModel} from "../src/question_boolean";
import {JsonObject} from "../src/jsonobject";
import {ItemValue} from "../src/itemvalue";

export default QUnit.module("Survey_Questions");

QUnit.test("Only some questions support comment", function (assert) {
    var questionText = <Question>QuestionFactory.Instance.createQuestion("text", "textQuestion");

    assert.equal(questionText.supportComment(), false, "Text question doesn't support comment.");
    assert.equal(questionText.hasComment, false, "Text question doesn't support comment.");
    questionText.hasComment = true;
    assert.equal(questionText.hasComment, false, "You can't set has comment to the text question.");

    var questionDropDown = <Question>QuestionFactory.Instance.createQuestion("dropdown", "dropdownQuestion");
    assert.equal(questionDropDown.supportComment(), true, "Drop down question supports comment.");
    assert.equal(questionDropDown.hasComment, false, "Has comment is false by  default.");
    questionDropDown.hasComment = true;
    assert.equal(questionDropDown.hasComment, true, "You can set comment for drop down question.");
});
QUnit.test("Only some questions support other", function (assert) {
    var questionText = <Question>QuestionFactory.Instance.createQuestion("text", "textQuestion");

    assert.equal(questionText.supportOther(), false, "Text question doesn't support other.");
    assert.equal(questionText.hasOther, false, "Text question doesn't support other.");
    questionText.hasOther = true;
    assert.equal(questionText.hasOther, false, "You can't set has other to the text question.");

    var questionDropDown = <Question>QuestionFactory.Instance.createQuestion("dropdown", "dropdownQuestion");
    assert.equal(questionDropDown.supportOther(), true, "Drop down question supports other.");
    assert.equal(questionDropDown.hasOther, false, "Has other is false by  default.");
    questionDropDown.hasOther = true;
    assert.equal(questionDropDown.hasOther, true, "You can set other for drop down question.");
});
QUnit.test("Comment and other could not be set together", function (assert) {
    var questionDropDown = <Question>QuestionFactory.Instance.createQuestion("dropdown", "dropdownQuestion");
    assert.equal(questionDropDown.hasComment, false, "Initial comment is turn off.");
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
QUnit.test("set choices from another question", function (assert) {
    var q1 = new QuestionSelectBase("q1");
    q1.choices = [{ value: 1, text: "One", price: 4 }, "Two", "Three"];
    var q2 = new QuestionSelectBase("q2");
    q2.choices = q1.choices;
    assert.equal(q2.choices.length, 3, "all three were copied");
    assert.equal(q2.choices[0]["price"], 4, "additional data is copied");
});
QUnit.test("visibleChoices changes on setting others to true/false", function (assert) {
    var question = new QuestionSelectBase("dropdownQuestion");
    question.choices = ["One", "Two", "Three"];
    assert.equal(question.visibleChoices.length, 3, "By default visibleChoices equals to choices");
    question.hasOther = true;
    assert.equal(question.visibleChoices.length, 4, "Add one more item for others");
    question.hasOther = false;
    assert.equal(question.visibleChoices.length, 3, "Remove the others item");
});
QUnit.test("displayValue function for selecteBase questions, issue #483", function (assert) {
    var question = new QuestionSelectBase("dropdownQuestion");
    question.choices = [{ value: 1, text: "Value 1" }, { value: 2, text: "Value 2" }];
    question.hasOther = true;
    assert.equal(question.displayValue, "", "value is null, displayValue is empty");
    question.value = 1;
    assert.equal(question.displayValue, "Value 1", "the first value is selected");
    question.value = 2;
    assert.equal(question.displayValue, "Value 2", "the second value is selected");
    question.value = 3;
    assert.equal(question.displayValue, "3", "there is no value in the list, so show the value");
    question.value = question.otherItem.value;
    assert.equal(question.displayValue, question.locOtherText.textOrHtml, "the other is selected");
});
QUnit.test("Question Title property", function (assert) {
    var question = new QuestionTextModel("q1");
    assert.equal(question.title, "q1", "get the question name by default");
    question.title = "My title";
    assert.equal(question.title, "My title", "get the question name by default");
});
QUnit.test("Pre-proccess value for Checkbox", function (assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("Page 1");
    var question = new QuestionCheckboxModel("checkboxQuestion");
    question.choices = ["One", "Two", "Three"];
    page.addQuestion(question);

    survey.setValue("checkboxQuestion", "One");
    assert.deepEqual(question.value, ["One"], "convert value to array");
});
QUnit.test("Matrix Question: visible rows", function (assert) {
    var matrix = new QuestionMatrixModel("q1");
    assert.equal(matrix.hasRows, false, "There is now rows by default.");
    assert.equal(matrix.visibleRows.length, 1, "There is always at least one row");
    assert.equal(matrix.visibleRows[0].name, null, "The default row name is empty");
    assert.equal(matrix.visibleRows[0].fullName, "q1", "The default row fullName is the question name");
    matrix.rows = ["row1", "row2"];
    assert.equal(matrix.hasRows, true, "There are two rows");
    assert.equal(matrix.visibleRows.length, 2, "Use the added row");
    assert.equal(matrix.visibleRows[0].name, "row1", "the row name is 'row1'");
    assert.equal(matrix.visibleRows[0].fullName, "q1_row1", "The default row fullName is the question name");
});
QUnit.test("Matrix Question: get/set values for empty rows", function (assert) {
    var matrix = new QuestionMatrixModel("q1");
    matrix.columns = ["col1", "col2"];
    matrix.value = "col1";
    var rows = matrix.visibleRows;
    assert.equal(rows[0].value, "col1", "set the row value correctly");
    rows[0].value = "col2";
    assert.equal(rows[0].value, "col2", "the row value changed");
    assert.equal(matrix.value, "col2", "the matrix value changed correctly");
});
QUnit.test("Matrix Question: get/set values for two rows", function (assert) {
    var matrix = new QuestionMatrixModel("q1");
    matrix.rows = ["row1", "row2"];
    matrix.columns = ["col1", "col2"];
    matrix.value = { row1: "col1" };
    var rows = matrix.visibleRows;
    assert.equal(rows[0].value, "col1", "set the row value correctly");
    rows[0].value = "col2";
    assert.equal(rows[0].value, "col2", "the row value changed");
    assert.deepEqual(matrix.value, { row1: "col2" }, "the matrix value changed correctly");
    rows[1].value = "col1";
    assert.deepEqual(matrix.value, { row1: "col2", row2: "col1" }, "the matrix value changed correctly");
});
QUnit.test("Matrix Question set values after visible row generated", function (assert) {
    var matrix = new QuestionMatrixModel("q1");
    matrix.rows = ["row1", "row2"];
    matrix.columns = ["col1", "col2"];
    var rows = matrix.visibleRows;
    matrix.value = { row1: "col1" };
    assert.equal(rows[0].value, "col1", "set the row value correctly");
});
QUnit.test("Matrix Question isAllRowRequired property", function (assert) {
    var matrix = new QuestionMatrixModel("q1");
    matrix.rows = ["row1", "row2"];
    matrix.columns = ["col1", "col2"];
    assert.equal(matrix.hasErrors(), false, "There is no errors by default");
    matrix.isAllRowRequired = true;
    assert.equal(matrix.hasErrors(), true, "There is no errors by default");
});
QUnit.test("Matrix Question supportGoNextPageAutomatic property", function (assert) {
    var matrix = new QuestionMatrixModel("q1");
    matrix.rows = ["row1", "row2"];
    matrix.columns = ["col1", "col2"];
    assert.equal(matrix.supportGoNextPageAutomatic(), false, "Rows are not set");
    matrix.value = { row1: "col1" };
    assert.equal(matrix.supportGoNextPageAutomatic(), false, "The second row is not set");
    matrix.value = { row1: "col1", row2: "col1" };
    assert.equal(matrix.supportGoNextPageAutomatic(), true, "Both rows are set");
});

QUnit.test("Multiple Text Item: text property", function (assert) {
    var mItem = new MultipleTextItemModel("text1");
    assert.equal(mItem.title, "text1", "get value from name");
    mItem.title = "display1";
    assert.equal(mItem.title, "display1", "get value from textValue");
});
QUnit.test("Multiple Text Question: get/set values for two texts", function (assert) {
    var mText = new QuestionMultipleTextModel("q1");
    mText.items.push(new MultipleTextItemModel("text1"));
    mText.items.push(new MultipleTextItemModel("text2"));
    mText.value = { text1: "val1" };
    assert.equal(mText.items[0].value, "val1", "get the value from the question");
    mText.items[1].value = "val2";
    assert.deepEqual(mText.value, { text1: "val1", text2: "val2" }, "set the value from the text item");
});
QUnit.test("Multiple Text Question: support goNextPageAutomatic", function (assert) {
    var mText = new QuestionMultipleTextModel("q1");
    mText.items.push(new MultipleTextItemModel("text1"));
    mText.items.push(new MultipleTextItemModel("text2"));

    assert.equal(mText.supportGoNextPageAutomatic(), false, "all text are empty");
    mText.value = { tex1: "val1" };
    assert.equal(mText.supportGoNextPageAutomatic(), false, "The second text is empty");
    mText.value = { text1: "val1", text2: "val2" };
    assert.equal(mText.supportGoNextPageAutomatic(), true, "Both text inputs are set");
});

QUnit.test("Validators for text question + getAllErrors", function (assert) {
    var mText = new QuestionTextModel("");
    assert.equal(mText.hasErrors(), false, "There is no error by default");
    mText.validators.push(new NumericValidator(10, 20));
    assert.equal(mText.hasErrors(), false, "There is no error since the value is empty");
    assert.equal(mText.getAllErrors().length, 0, "There is no error at all");
    mText.value = "ss";
    assert.equal(mText.hasErrors(), true, "The value should be numeric");
    assert.equal(mText.getAllErrors().length, 1, "There is an error");
    mText.value = 25;
    assert.equal(mText.hasErrors(), true, "The value should be between 10 and 20");
    mText.value = "15";
    assert.equal(mText.hasErrors(), false, "The value is fine now.");
    assert.equal(mText.value, 15, "Convert to numeric");
});
QUnit.test("Numeric validation and with 0, Bug #462", function (assert) {
    var mText = new QuestionTextModel("");
    mText.validators.push(new NumericValidator(1, 100));
    mText.value = 0;
    assert.equal(mText.hasErrors(), true, "0 is less then 1");
});

QUnit.test("Validators for multiple text question", function (assert) {
    var mText = new QuestionMultipleTextModel("q1");
    mText.items.push(new MultipleTextItemModel("t1"));
    assert.equal(mText.hasErrors(), false, "There is no error by default");
    assert.equal(mText.getAllErrors().length, 0, "There is no error at all");
    mText.items[0].validators.push(new NumericValidator(10, 20));
    mText.value = { t1: "ss" };
    assert.equal(mText.hasErrors(), true, "The value should be numeric");
    assert.equal(mText.getAllErrors().length, 1, "There is error in one item");
    mText.value = { t1: 25 };
    assert.equal(mText.hasErrors(), true, "The value should be between 10 and 20");
    assert.equal(mText.errors[0].getText().indexOf("t1") >= 0, true, "Error contains information about item name");
    mText.value = { t1: 15 };
    assert.equal(mText.hasErrors(), false, "The value is fine now.");
    assert.equal(mText.items[0].value, 15, "Convert to numeric");
});
QUnit.test("Validators for array value question", function (assert) {
    var question = new QuestionCheckboxModel("q1");
    question.choices = ["item1", "item2", "item3", "item4", "item5"];
    question.value = ["item1"];
    assert.equal(question.hasErrors(), false, "There is no error by default");
    question.validators.push(new AnswerCountValidator(2, 3));
    question.value = ["item1"];
    assert.equal(question.hasErrors(), true, "It should be at least two items selected");
    question.value = ["item1", "item2", "item3"];
    assert.equal(question.hasErrors(), false, "There is one item in value");
    question.value = ["item1", "item2", "item3", "item4"];
    assert.equal(question.hasErrors(), true, "It should be less then 3 items");
    question.value = ["item1", "item3"];
    assert.equal(question.hasErrors(), false, "There is two items in value");
});
QUnit.test("Show errors if others value is selected, but not entered", function (assert) {
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
QUnit.test("SelectBase visibleChoices order", function (assert) {
    var question = new QuestionSelectBase("dropdownQuestion");
    question.choices = ["B", "A", "D", "C"];
    assert.equal(question.choicesOrder, "none", "The default value is 'none'");
    assert.equal(question.visibleChoices[0].text, "B", "By default visible choices is not sorted");
    question.choicesOrder = "asc";
    assert.equal(question.visibleChoices[0].text, "A", "Sorted order is 'asc'");
    question.choicesOrder = "desc";
    assert.equal(question.visibleChoices[0].text, "D", "Sorted order is 'desc'");
});
QUnit.test("Question callbacks test", function (assert) {
    var question = new QuestionTextModel("textQuestion");
    var valueChanged = 0;
    var commentChanged = 0;
    var visibleChanged = 0;
    var visibleIndexChanged = 0;
    question.valueChangedCallback = function () { valueChanged++ };
    question.commentChangedCallback = function () { commentChanged++ };
    question.registerFunctionOnPropertyValueChanged("visible", function () { visibleChanged++ });
    question.registerFunctionOnPropertyValueChanged("visibleIndex", function() {visibleIndexChanged++});
    question.value = "test";
    question.comment = "comment";
    question.visible = false;
    question.setVisibleIndex(5);
    assert.equal(valueChanged, 1, "value changed on time");
    assert.equal(commentChanged, 1, "comment changed on time");
    assert.equal(visibleChanged, 1, "visibiblity changed on time");
    assert.equal(visibleIndexChanged, 1, "visibleIndex changed on time");
});
QUnit.test("Init SelectBase with comment comment", function (assert) {
    var survey = new SurveyModel();
    survey.data = { q: "other", "q-Comment": "aaaa" };
    survey.addNewPage("page1");
    var question = new QuestionSelectBase("q");
    question.choices = ["A", "B", "C", "D"];
    survey.pages[0].addQuestion(question);
    assert.equal(question.comment, "aaaa", "Set the initial comment");
});
QUnit.test("SelectBase store others value not in comment", function (assert) {
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
    assert.equal(question.isOtherSelected, true, "Any other value that is not from choices is other");
    assert.deepEqual(survey.data, { q: question.otherItem.value }, "Other Item is set");

    question.comment = "commentTest";
    assert.equal(question.isOtherSelected, true, "Any other value that is not from choices is other");
    assert.deepEqual(survey.data, { q: "commentTest" }, "Other text is set");

    survey.setValue("q", "A");
    assert.equal(question.isOtherSelected, false, "Others is not selected");
    assert.deepEqual(question.value, "A", "'A' is set to the question");

    survey.setValue("q", "FF");
    assert.equal(question.isOtherSelected, true, "set other from survey");
    assert.equal(question.value, question.otherItem.value, "value is otherItem.value");

    question.value = "B";
    assert.equal(question.isOtherSelected, false, "Others is not selected");
    assert.deepEqual(survey.data, { q: "B" }, "'B' is set");
});
QUnit.test("Checkbox store others value not in comment", function (assert) {
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
    assert.equal(question.isOtherSelected, true, "Any other value that is not from choices is other");
    assert.deepEqual(survey.data, { q: ["A", question.otherItem.value] }, "Other Item is set");

    question.comment = "commentTest";
    assert.equal(question.isOtherSelected, true, "Any other value that is not from choices is other");
    assert.deepEqual(survey.data, { q: ["A", "commentTest"] }, "Other text is set");

    survey.setValue("q", ["A"]);
    assert.equal(question.isOtherSelected, false, "Others is not selected");
    assert.deepEqual(question.value, ["A"], "'A' is set to the question");

    survey.setValue("q", ["A", "FF"]);
    assert.equal(question.isOtherSelected, true, "set other from survey");
    assert.deepEqual(question.value, ["A", question.otherItem.value], "value is otherItem.value");

    question.value = ["A", "B"];
    assert.equal(question.isOtherSelected, false, "Others is not selected");
    assert.deepEqual(survey.data, { q: ["A", "B"] }, "'B' is set");
});
QUnit.test("Matrixdropdown cells tests", function (assert) {
    var question = new QuestionMatrixDropdownModel("matrixDropdown");
    question.rows = ["row1", "row2", "row3"];
    question.columns.push(new MatrixDropdownColumn("column1"));
    question.columns.push(new MatrixDropdownColumn("column2"));
    question.choices = [1, 2, 3];
    question.columns[1].choices = [4, 5];
    question.value = { 'row2': { 'column1': 2 } }
    var visibleRows = question.visibleRows;
    assert.equal(visibleRows.length, 3, "There are three rows");
    assert.equal(visibleRows[0].cells.length, 2, "There are two cells in each row");
    assert.equal(visibleRows[2].cells.length, 2, "There are two cells in each row");
    var q1 = <QuestionDropdownModel>(visibleRows[0].cells[0].question);
    var q2 = <QuestionDropdownModel>(visibleRows[0].cells[1].question);
    assert.deepEqual(ItemValue.getData(q1.choices), ItemValue.getData(question.choices), "get choices from matrix");
    assert.deepEqual(ItemValue.getData(q2.choices), ItemValue.getData(question.columns[1].choices), "get choices from column");
    assert.equal(visibleRows[0].cells[1].value, null, "value is not set");
    assert.equal(visibleRows[1].cells[0].value, 2, "value was set");

    question.value = null;
    visibleRows[0].cells[1].value = 4;
    assert.deepEqual(question.value, { 'row1': { 'column2': 4 } }, "set the cell value correctly");
    visibleRows[0].cells[1].value = null;
    assert.deepEqual(question.value, null, "set to null if all cells are null");
});
QUnit.test("Matrixdynamic cells tests", function (assert) {
    var question = new QuestionMatrixDynamicModel("matrixDynamic");
    question.rowCount = 3;
    question.columns.push(new MatrixDropdownColumn("column1"));
    question.columns.push(new MatrixDropdownColumn("column2"));
    question.choices = [1, 2, 3];
    question.columns[1].choices = [4, 5];
    question.value = [{}, { 'column1': 2 }, {}];
    var visibleRows = question.visibleRows;
    assert.equal(visibleRows.length, 3, "There are three rows");
    assert.equal(visibleRows[0].cells.length, 2, "There are two cells in each row");
    assert.equal(visibleRows[2].cells.length, 2, "There are two cells in each row");
    var q1 = <QuestionDropdownModel>(visibleRows[0].cells[0].question);
    var q2 = <QuestionDropdownModel>(visibleRows[0].cells[1].question);
    assert.deepEqual(ItemValue.getData(q1.choices), ItemValue.getData(question.choices), "get choices from matrix");
    assert.deepEqual(ItemValue.getData(q2.choices), ItemValue.getData(question.columns[1].choices), "get choices from column");
    assert.equal(visibleRows[0].cells[1].value, null, "value is not set");
    assert.equal(visibleRows[1].cells[0].value, 2, "value was set");

    question.value = null;
    visibleRows[1].cells[1].value = 4;
    assert.deepEqual(question.value, [{}, { 'column2': 4 }, {} ], "set the cell value correctly");
    visibleRows[1].cells[1].value = null;
    assert.deepEqual(question.value, null, "set to null if all cells are null");
});
QUnit.test("Matrixdynamic make the question empty on null cell value, Bug #608", function (assert) {
    var question = new QuestionMatrixDynamicModel("matrixDynamic");
    question.rowCount = 3;
    question.columns.push(new MatrixDropdownColumn("column1"));
    question.columns.push(new MatrixDropdownColumn("column2"));
    var visibleRows = question.visibleRows;
    visibleRows[1].cells[0].question.value = 2;
    assert.deepEqual(question.value, [{}, { 'column1': 2 }, {}], "The value set correctly");
    visibleRows[1].cells[0].question.value = null;
    assert.deepEqual(question.value, null, "Clear the question value if all cells are empty");
});

QUnit.test("Matrixdynamic set null value, Bug Editor #156", function (assert) {
    var survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.addNewPage();
    var question = new QuestionMatrixDynamicModel("matrixDynamic");
    question.rowCount = 3;
    question.columns.push(new MatrixDropdownColumn("column1"));
    question.columns.push(new MatrixDropdownColumn("column2"));
    survey.pages[0].addQuestion(question);
    /*
    question.value = null;
    assert.deepEqual(question.value, [{}, {}, {}], "Set null value correctly");
    */
    var visibleRows = question.visibleRows;
    assert.equal(visibleRows.length, 3, "There shoud be 3 rows");
});

QUnit.test("Matrixdropdown value tests after cells generation", function (assert) {
    var question = new QuestionMatrixDropdownModel("matrixDropdown");
    question.rows = ["row1", "row2", "row3"];
    question.columns.push(new MatrixDropdownColumn("column1"));
    question.columns.push(new MatrixDropdownColumn("column2"));
    question.choices = [1, 2, 3];
    question.columns[1].choices = [4, 5];
    var visibleRows = question.visibleRows;
    question.value = { 'row2': { 'column1': 2 } }
    assert.equal(visibleRows[1].cells[0].value, 2, "value was set");
});
QUnit.test("Matrixdynamic value tests after cells generation", function (assert) {
    var question = new QuestionMatrixDynamicModel("matrixDymanic");
    question.rowCount = 3;
    question.columns.push(new MatrixDropdownColumn("column1"));
    question.columns.push(new MatrixDropdownColumn("column2"));
    question.choices = [1, 2, 3];
    question.columns[1].choices = [4, 5];
    var visibleRows = question.visibleRows;
    question.value = [{}, { 'column1': 2 }, {}];
    assert.equal(visibleRows[1].cells[0].value, 2, "value was set");
});
QUnit.test("Matrixdynamic set text to rowCount property, bug #439", function (assert) {
    var question = new QuestionMatrixDynamicModel("matrixDymanic");
    new JsonObject().toObject({type: "matrixdynamic", rowCount: "1"}, question);
    assert.equal(question.rowCount, 1, "Row count should be 1");
    question.addRow();
    assert.equal(question.rowCount, 2, "Row count should b 2 now");
});
QUnit.test("Matrixdynamic add/remove rows", function (assert) {
    var question = new QuestionMatrixDynamicModel("matrixDymanic");
    question.rowCount = 3;
    question.columns.push(new MatrixDropdownColumn("column1"));
    question.columns.push(new MatrixDropdownColumn("column2"));
    question.value = [{}, { 'column1': 2 }, {}];
    question.removeRow(1);
    assert.equal(question.rowCount, 2, "one row is removed");
    assert.equal(question.value, null, "value is null now");
    question.addRow();
    assert.equal(question.rowCount, 3, "one row is added");
});
QUnit.test("Matrixdynamic required column", function (assert) {
    var question = new QuestionMatrixDynamicModel("matrixDymanic");
    question.rowCount = 2;
    question.columns.push(new MatrixDropdownColumn("column1"));
    question.columns.push(new MatrixDropdownColumn("column2"));
    var rows = question.visibleRows;
    assert.equal(question.hasErrors(), false, "No errors");
    question.columns[0].isRequired = true;
    assert.equal(rows.length, 2, "There are two rows");
    assert.equal(question.hasErrors(), true, "column1 should not be empty. All rows are empty");
    assert.equal(question.getAllErrors().length, 2, "There are totally two errors");
    question.value = [{ 'column1': 2 }, {}];
    assert.equal(rows[0].cells[0].question.value, 2, "The first cell has value 2");
    assert.equal(question.hasErrors(), true, "column1 should not be empty. the second row is empty");
    assert.equal(question.getAllErrors().length, 1, "There are totally one errors");    
    question.value = [{ 'column1': 2 }, { 'column1': 3}];
    assert.equal(question.hasErrors(), false, "column1 should not be empty. all values are set");
    assert.equal(question.getAllErrors().length, 0, "There are totally no errors");    
});
QUnit.test("Matrixdynamic column.validators", function (assert) {
    var question = new QuestionMatrixDynamicModel("matrixDymanic");
    question.rowCount = 2;
    question.columns.push(new MatrixDropdownColumn("column1"));
    question.columns.push(new MatrixDropdownColumn("column2"));
    var rows = question.visibleRows;
    assert.equal(question.hasErrors(), false, "No errors");
    question.columns[0].validators.push(new EmailValidator());
    question.rowCount = 0;
    question.rowCount = 2;
    var rows = question.visibleRows;
    question.value = [{ 'column1': "aaa" }, {}];
    assert.equal(question.hasErrors(), true, "column1 should has valid e-mail");
    question.value = [{ 'column1': "aaa@aaa.com" }, {}];
    assert.equal(question.hasErrors(), false, "column1 has valid e-mail");
});
QUnit.test("Matrixdynamic duplicationError", function (assert) {
    var question = new QuestionMatrixDynamicModel("matrixDymanic");
    question.rowCount = 2;
    question.columns.push(new MatrixDropdownColumn("column1"));
    question.columns.push(new MatrixDropdownColumn("column2"));
    question.keyName = "column1";
    var rows = question.visibleRows;
    assert.equal(question.hasErrors(), false, "No errors");
    question.value = [{ 'column1': "val1" }, {}];
    assert.equal(question.hasErrors(), false, "There is no errors, row[0].column1=val1");
    question.value = [{ 'column1': "val1" }, { 'column1': "val1" }];
    assert.equal(question.hasErrors(), true, "There is the error, row[0].column1=val1 and row[1].column2=val1");
    question.value = [{ 'column1': "val1" }, { 'column1': "val2" }];
    assert.equal(question.hasErrors(), false, "There is no errors, row[0].column1=val1 and row[1].column2=val2");
});
QUnit.test("Matrixdynamic hasOther column", function (assert) {
    var question = new QuestionMatrixDynamicModel("matrixDymanic");
    question.choices = [1, 2, 3];
    question.rowCount = 1;
    question.columns.push(new MatrixDropdownColumn("column1"));
    var rows = question.visibleRows;
    assert.equal(question.hasErrors(), false, "Everything is fine so far");
    rows[0].cells[0].question.value = "other";
    assert.equal(question.hasErrors(), true, "Should set other value");
});
QUnit.test("Matrixdynamic adjust rowCount on setting the value", function (assert) {
    var question = new QuestionMatrixDynamicModel("matrixDymanic");
    question.rowCount = 0;
    question.columns.push(new MatrixDropdownColumn("column1"));
    question.columns.push(new MatrixDropdownColumn("column2"));
    question.value = [{}, { 'column1': 2 }, {}];
    assert.equal(question.rowCount, 3, "It should be 3 rowCount");
    var rows = question.visibleRows;
    question.value = [{}, { 'column1': 2 }, {}, {}];
    assert.equal(question.rowCount, 4, "It should be 4 rowCount");
    question.value = [{ 'column1': 2 }];
    assert.equal(question.rowCount, 4, "Keep row count equals 4");
});
QUnit.test("Matrixdynamic minRowCount/maxRowCount", function (assert) {
    var question = new QuestionMatrixDynamicModel("matrixDymanic");
    question.minRowCount = 3;
    question.maxRowCount = 5;
    assert.equal(question.rowCount, 3, "row count is min row count");
    question.rowCount = 5;
    assert.equal(question.rowCount, 5, "row count is 5");
    question.maxRowCount = 4;
    assert.equal(question.rowCount, 4, "row count is max row count");
    question.addRow();
    assert.equal(question.rowCount, 4, "row count is still max row count");
});
QUnit.test("Matrixdynamic do not re-create the rows", function (assert) {
    var question = new QuestionMatrixDynamicModel("matrixDymanic");
    var firstRowId = question.visibleRows[0].id;
    assert.notOk(firstRowId.indexOf("unde") > -1, "there should not be undefined in the row index");
    var rowCount = question.visibleRows.length;
    question.addRow();
    assert.equal(question.visibleRows.length, rowCount + 1, "Add one row");
    assert.equal(question.visibleRows[0].id, firstRowId, "The first row is the same after row adding");
    question.removeRow(question.rowCount - 1);
    assert.equal(question.visibleRows[0].id, firstRowId, "The first row is the same after row removing");
    question.rowCount = 10;
    assert.equal(question.visibleRows[0].id, firstRowId, "The first row is the same after row count increasing");
    question.rowCount = 1;
    assert.equal(question.visibleRows[0].id, firstRowId, "The first row is the same after row count decreasing");
    question.value = [{"col1": 2}];
    assert.equal(question.visibleRows[0].id, firstRowId, "The first row is the same after setting value");
});

QUnit.test("Matrixdynamic change column properties on the fly", function (assert) {
    var question = new QuestionMatrixDynamicModel("matrixDymanic");
    question.addColumn("col1");
    var rows = question.visibleRows;
    assert.equal(rows[0].cells[0].question.getType(), "dropdown", "the default cell type is 'dropdown'");
    assert.equal((<QuestionDropdownModel>rows[0].cells[0].question).choices.length, question.choices.length, "By use question.choices by default");
    question.columns[0].choices = [1, 2, 3, 4, 5, 6, 7];
    assert.equal((<QuestionDropdownModel>rows[0].cells[0].question).choices.length, question.columns[0].choices.length, "Use column choices if set");
});

QUnit.test("Matrixdynamic customize cell editors", function (assert) {
    /*
        col2 - invisible if col1 is empty, [item1, item2] - if col1 = 1 and [item3, item4] if col1 = 2
    */
    var matrix = new QuestionMatrixDynamicModel("matrixDymanic");
    matrix.addColumn("col1");
    matrix.addColumn("col2");
    matrix.columns[0].choices = [1, 2];
    var survey = new SurveyModel();
    survey.addNewPage("p1");
    survey.pages[0].addQuestion(matrix);
    survey.onMatrixCellCreated.add(function(survey, options) {
        if(options.columnName == "col2") {
            options.cellQuestion.visible = options.rowValue["col1"] ? true : false;
        }
    });
    survey.onMatrixCellValueChanged.add(function(survey, options) {
        if(options.columnName != "col1") return;
        var question = options.getCellQuestion("col2");
        question.visible = options.value ? true : false;
        if(options.value == 1)  question.choices = ["item1", "item2"];
        if(options.value == 2)  question.choices = ["item3", "item4"];
    });
    matrix.rowCount = 1;
    var rows = matrix.visibleRows;
    var q1 = <QuestionDropdownModel>rows[0].cells[0].question;
    var q2 = <QuestionDropdownModel>rows[0].cells[1].question;
    assert.equal(q2.visible, false, "col2 is invisible if col1 is empty");
    q1.value = 1;
    assert.equal(q2.choices[0].value, "item1", "col1 = 1, col2.choices = ['item1', 'item2']");
    q1.value = 2;
    assert.equal(q2.choices[0].value, "item3", "col1 = 2, col2.choices = ['item3', 'item4']");
    q1.value = null;
    assert.equal(q2.visible, false, "col2 is invisible if col1 = null");
    matrix.addRow();
    assert.equal((<QuestionDropdownModel>rows[1].cells[1].question).visible, false, "row2. col2 is invisible if col1 = null");
});

//QUnit.test("Matrixdynamic validate cell values - do not allow to have the same value", function (assert) {
QUnit.test("Matrixdynamic validate cell values - onMatrixCellValueChanged", function (assert) {    
    var matrix = new QuestionMatrixDynamicModel("matrixDymanic");
    matrix.addColumn("col1");
    var survey = new SurveyModel();  survey.addNewPage("p1");  survey.pages[0].addQuestion(matrix);
    var cellQuestions = [];
    survey.onMatrixCellCreated.add(function(survey, options) {
        cellQuestions.push(options.cellQuestion);
    });
    survey.onMatrixCellValidate.add(function(survey, options) {
        if(options.value == "notallow") {
            options.error = "This cell is not allow";
        }
    });
    var rows = matrix.visibleRows;
    assert.equal(cellQuestions.length, 2, "There are 2 cell questions in the array");
    cellQuestions[0].value = "notallow";
    matrix.hasErrors(true);
    assert.equal(cellQuestions[0].errors.length, 1, "There is an error");
    cellQuestions[0].value = "allow";
    matrix.hasErrors(true);
    assert.equal(cellQuestions[0].errors.length, 0, "There is no errors");
});

QUnit.test("Matrixdynamic validate cell values - do not allow to have the same value", function (assert) {
    var matrix = new QuestionMatrixDynamicModel("matrixDymanic");
    matrix.addColumn("col1");
    var survey = new SurveyModel();  survey.addNewPage("p1");  survey.pages[0].addQuestion(matrix);
    var cellQuestions = [];
    survey.onMatrixCellCreated.add(function(survey, options) {
        cellQuestions.push(options.cellQuestion);
    });
    survey.onMatrixCellValueChanged.add(function(survey, options) {
        //validate value on change
        options.getCellQuestion("col1").hasErrors(true);
    });
    survey.onMatrixCellValidate.add(function(survey, options) {
        var rows = options.question.visibleRows;
        for(var i = 0; i < rows.length; i ++) {
            //we have the same row
            if(rows[i] === options.row) continue;
            if(rows[i].value && rows[i].value["col1"] == options.value) {
                options.error = "You have already select the same value";
            }
        }
    });
    var rows = matrix.visibleRows;
    assert.equal(cellQuestions.length, 2, "There are 2 cell questions in the array");
    cellQuestions[0].value = 1;
    assert.equal(cellQuestions[1].errors.length, 0, "There is now errors");
    cellQuestions[1].value = 1;
    assert.equal(cellQuestions[1].errors.length, 1, "There is an error");
    cellQuestions[1].value = 2;
    assert.equal(cellQuestions[1].errors.length, 0, "There no errors again");
});

QUnit.test("Matrixdropdown different cell types", function (assert) {
    var question = new QuestionMatrixDropdownModel("matrixDropdown");

    question.columns.push(new MatrixDropdownColumn("dropdown"));
    question.columns.push(new MatrixDropdownColumn("checkbox"));
    question.columns.push(new MatrixDropdownColumn("radiogroup"));
    question.columns.push(new MatrixDropdownColumn("text"));
    question.columns.push(new MatrixDropdownColumn("comment"));

    for (var i = 0; i < question.columns.length; i++) {
        question.columns[i].cellType = question.columns[i].name;
    }
    question.rows = ["row1", "row2", "row3"];

    for (var i = 0; i < question.columns.length; i++) {
        var col = question.columns[i];
        var row = question.visibleRows[0];
        assert.equal(row.cells[i].question.getType(), col.name, "Expected " + col.name + ", but was" + row.cells[i].question.getType());
    }
});
QUnit.test("Matrixdropdown isRequiredInAllRows", function (assert) {
    var question = new QuestionMatrixDynamicModel("matrix");
    question.rowCount = 2;
    question.columns.push(new MatrixDropdownColumn("dropdown"));
    var rows = question.visibleRows;
    assert.equal(question.hasErrors(), false, "There is no errors in the matrix. Null is possible");
    assert.equal(rows[0].isEmpty, true, "There is no error in the first row");
    assert.equal(rows[1].isEmpty, true, "There is no error in the second row");
    question.minRowCount = 2;
    assert.equal(question.hasErrors(), true, "Error, value in all rows are required");
});
QUnit.test("Matrixdropdown supportGoNextPageAutomatic property", function (assert) {
    var question = new QuestionMatrixDropdownModel("matrix");
    question.rows = ["row1", "row2"];
    question.columns.push(new MatrixDropdownColumn("col1"));
    question.columns.push(new MatrixDropdownColumn("col2"));
    var rows = question.visibleRows;
    assert.equal(question.supportGoNextPageAutomatic(), false, "There is no value in rows");
    question.value = { "row1": { "col1": 1, "col2": 11 } };
    assert.equal(question.supportGoNextPageAutomatic(), false, "There is no value in the second row");
    question.value = { "row1": { "col1": 1, "col2": 11 }, "row2": { "col1": 2, "col2": 22 }};
    assert.equal(question.supportGoNextPageAutomatic(), true, "All row values are set");
    question.value = { "row1": { "col1": 1}, "row2": { "col1": 2, "col2": 22 } };
    assert.equal(question.supportGoNextPageAutomatic(), false, "The first row is not set completely");
});

QUnit.test("Matrixdropdown supportGoNextPageAutomatic always false for checkbox", function (assert) {
    var question = new QuestionMatrixDropdownModel("matrix");
    question.rows = ["row1", "row2"];
    question.columns.push(new MatrixDropdownColumn("col1"));
    question.columns.push(new MatrixDropdownColumn("col2"));
    question.columns[1].cellType = "checkbox";
    var json = new JsonObject().toJsonObject(question);
    json.type = question.getType();
    question.columns.push(new MatrixDropdownColumn("col3"));
    question.columns.push(new MatrixDropdownColumn("col4"));
    new JsonObject().toObject(json, question);

    assert.equal(question.columns.length, 2, "There were two columns");
});

QUnit.test("Matrixdropdown set columns", function (assert) {
    var question = new QuestionMatrixDropdownModel("matrix");
    question.rows = ["row1", "row2"];
    question.columns.push(new MatrixDropdownColumn("col1"));
    question.columns.push(new MatrixDropdownColumn("col2"));

    assert.equal(question.supportGoNextPageAutomatic(), false, "There is no value in rows");
    question.value = { "row1": { "col1": 1, "col2": 11 } };
    assert.equal(question.supportGoNextPageAutomatic(), false, "Checkbox doesn't support gotNextPageAutomatic");
});

QUnit.test("Matrixdynamic column.visibleIf", function (assert) {
    var question = new QuestionMatrixDynamicModel("matrixDynamic");
    question.rowCount = 2;
    question.columns.push(new MatrixDropdownColumn("column1"));
    question.columns.push(new MatrixDropdownColumn("column2"));
    question.columns.push(new MatrixDropdownColumn("column3"));
    question.columns[0].choices = [1, 2, 3];
    question.columns[1].choices = [4, 5];
    question.columns[2].choices = [7, 8, 9, 10];
    question.columns[2].isRequired = true;

    question.columns[1].visibleIf = "{row.column1} = 2";
    question.columns[2].visibleIf = "{a} = 5";

    var visibleRows = question.visibleRows;
    var q1 = <QuestionDropdownModel>(visibleRows[0].cells[0].question);
    var q2 = <QuestionDropdownModel>(visibleRows[0].cells[1].question);
    var q3 = <QuestionDropdownModel>(visibleRows[0].cells[2].question);
    
    var values = {a : 3};
    question.runCondition(values)
    assert.equal(q1.visible, true, "1. q1 visibleIf is empty");
    assert.equal(q2.visible, false, "1. q2 visibleIf depends on column1 - false");
    assert.equal(q3.visible, false, "1. q3 visibleIf depends on external data - false");
    assert.equal(question.hasErrors(), false, "1. q3 required column is invisible.")

    values = {a : 5};
    question.runCondition(values);
    assert.equal(q3.visible, true, "2. q3 visibleIf depends on external data - true");
    
    q1.value = 2;
    question.runCondition(values);
    assert.equal(q2.visible, true, "3. q2 visibleIf depends on column1 - true");    
});
QUnit.test("Matrixdynamic column.visibleIf, load from json and add item", function (assert) {
    var survey = new SurveyModel({questions: [{type: "matrixdynamic", rowCount: 1, columns: [{name: "col1", choices: [1, 2]}, {name: "col2", visibleIf: "{row.col1} = 1"}]}]});
    var matrix = <QuestionMatrixDynamicModel>survey.getAllQuestions()[0];
    var rows = matrix.visibleRows;
    var q_0_1 = <QuestionDropdownModel>(rows[0].cells[1].question);
    assert.equal(q_0_1.visible, false, "Initial the question is invisible");
    matrix.addRow();
    var q_1_1 = <QuestionDropdownModel>(rows[1].cells[1].question);
    assert.equal(q_1_1.visible, false, "Initial the question in the added row is invisible");
});

QUnit.test("Text inputType=number", function (assert) {
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
QUnit.test("Text inputType=range", function (assert) {
    var question = new QuestionTextModel("text");
    question.inputType = "range";
    question.value = "25";
    assert.strictEqual(question.value, 25, "make it numeric");
});
QUnit.test("Text questions spaces is not a valid answer for required", function (assert) {
    var question = new QuestionTextModel("text");
    question.isRequired = true;
    assert.equal(question.hasErrors(), true, "Question is empty");
    question.value = "  ";
    assert.equal(question.hasErrors(), true, "spaces is not an answer");
    question.value = " 1 ";
    assert.equal(question.hasErrors(), false, "got the answer");
});
QUnit.test("Custom text in required error", function (assert) {
    var question = new QuestionTextModel("text");
    question.requiredErrorText = "Custom required error";
    question.isRequired = true;
    assert.equal(question.hasErrors(), true, "Question is empty");
    assert.equal(question.errors.length, 1, "There is one error");
    assert.equal(question.errors[0].getText(), "Custom required error", "there is a custom errror text");
});
QUnit.test("Boolean question checkedValue", function (assert) {
    var question = new QuestionBooleanModel("bool");
    assert.equal(question.checkedValue, null, "Indertemenated by default");
    question.value = true;
    assert.equal(question.checkedValue, true, "value == true, checkedvalue == true");
    question.value = false;
    assert.equal(question.checkedValue, false, "value == false, checkedvalue == false");
    question.value = null;
    assert.equal(question.checkedValue, null, "value == null, checkedvalue == null");
    question.value = 'a';
    assert.equal(question.checkedValue, false, "value == 'a', checkedvalue == false");
});
QUnit.test("Boolean question valueTrue, valueFalse", function (assert) {
    var question = new QuestionBooleanModel("bool");
    question.valueTrue = "yes";
    question.valueFalse = "no";
    assert.equal(question.checkedValue, null, "Indertemenated by default");
    question.value = "yes";
    assert.equal(question.checkedValue, true, "value == 'yes', checkedvalue == true");
    question.value = "no";
    assert.equal(question.checkedValue, false, "value == 'no', checkedvalue == false");
    question.checkedValue = true;
    assert.equal(question.value, "yes", "checkedvalue == true, value = 'yes'");
    question.checkedValue = false;
    assert.equal(question.value, "no", "checkedvalue == false, value = 'no'");
});
QUnit.test("Boolean question defaultValue", function (assert) {
    var question = new QuestionBooleanModel("bool");
    assert.equal(question.checkedValue, null, "Indertemenated by default");
    question.defaultValue = "true";
    assert.equal(question.checkedValue, true, "defaultValue is set to 'true', checkedvalue == true");
    question.defaultValue = "false";
    assert.equal(question.checkedValue, true, "defaultValue is set to 'false', but value has been already set to checkedvalue == true");

    var survey = new SurveyModel();
    survey.addNewPage("p1");
    survey.pages[0].addQuestion(question);
    assert.deepEqual(survey.data, {"bool": false}, "add question into survey");
});

QUnit.test("Rating question, visibleRateValues property", function (assert) {
    var rate = new QuestionRatingModel("q1");
    assert.equal(rate.visibleRateValues.length, 5, "There are 5 items by default");
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
    assert.equal(rate.visibleRateValues.length, QuestionRatingModel.MaximumRateValueCount, "Values can be more than MaximumRateValueCount.");
    rate.rateValues = [1, 2, 3];
    assert.equal(rate.visibleRateValues.length, 3, "Use rate values");
});
QUnit.test("defaultValue propeprty as array", function (assert) {
    var question = new QuestionCheckboxModel("q1");
    assert.notOk(question.defaultValue, "It is empty by default");
    question.defaultValue = [1];
    assert.deepEqual(question.defaultValue, [1], "It is not empty no");
    question.defaultValue = null;
    assert.deepEqual(question.defaultValue, [], "It is empty by default");
});
