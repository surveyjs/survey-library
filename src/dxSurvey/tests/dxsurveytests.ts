/// <reference path="../sources/survey.ts" />
/// <reference path="../sources/page.ts" />
/// <reference path="../sources/question.ts" />
/// <reference path="../sources/question_baseselect.ts" />
/// <reference path="../sources/question_checkbox.ts" />
/// <reference path="../sources/question_matrix.ts" />
/// <reference path="../sources/questionfactory.ts" />
module dxSurvey.Tests {
    QUnit.module("dxSurvey");

    QUnit.test("Add two pages", function (assert) {
        var survey = new dxSurvey.Survey();
        survey.addPage(new Page("Page 1"));
        survey.addPage(new Page("Page 2"));
        assert.equal(survey.PageCount, 2, "Two pages");
    });
    QUnit.test("Current Page", function (assert) {
        var survey = new dxSurvey.Survey();
        survey.addPage(new Page("Page 1"));
        assert.equal(survey.CurrentPage, survey.pages[0], "the first page is  current");
        survey.CurrentPage = null;
        assert.equal(survey.CurrentPage, survey.pages[0], "can't set curent page to null");
        survey.CurrentPage = survey.addNewPage("new Page");
        assert.equal(survey.CurrentPage, survey.pages[1], "second page is current");
        survey.pages.pop();
        assert.equal(survey.CurrentPage, survey.pages[0], "the first page is current after removing the current one");
    });
    QUnit.test("Next, Prev, IsFirst and IsLast Page", function (assert) {
        var survey = new dxSurvey.Survey();
        survey.addPage(new Page("Page 1"));
        survey.addNewPage("Second page");
        survey.addNewPage("Third page");
        assert.equal(survey.CurrentPage, survey.pages[0], "Current Page is  First");
        assert.equal(survey.isFirstPage, true, "Current Page is  First");
        assert.equal(survey.isLastPage, false, "Current Page is  First");
        survey.nextPage();
        assert.equal(survey.CurrentPage, survey.pages[1], "Current Page is  Second");
        assert.equal(survey.isFirstPage, false, "Current Page is  Second");
        assert.equal(survey.isLastPage, false, "Current Page is  Second");
        survey.nextPage();
        assert.equal(survey.CurrentPage, survey.pages[2], "Current Page is  Third");
        assert.equal(survey.isFirstPage, false, "Current Page is  Third");
        assert.equal(survey.isLastPage, true, "Current Page is  Third");
        survey.prevPage();
        assert.equal(survey.CurrentPage, survey.pages[1], "Current Page is  Second");
        assert.equal(survey.isFirstPage, false, "Current Page is  Second");
        assert.equal(survey.isLastPage, false, "Current Page is  Second");
        survey.prevPage();
        assert.equal(survey.CurrentPage, survey.pages[0], "Current Page is  First");
        assert.equal(survey.isFirstPage, true, "Current Page is  First");
        assert.equal(survey.isLastPage, false, "Current Page is  First");
    });
    QUnit.test("Question Creator", function (assert) {
        var inst = dxSurvey.QuestionFactory.Instance;
        inst.registerQuestion("question1", (name: string) => { return new dxSurvey.Question(name); });
        inst.registerQuestion("question2", (name: string) => { return new dxSurvey.Question(name); });
        assert.equal(inst.createQuestion("question1", "Q1").name, "Q1", "Create first type of question");
        assert.equal(inst.createQuestion("question2", "Q2").name, "Q2", "Create second type of question");
        assert.equal(inst.createQuestion("question3", "Q3"), null, "Create unexisting type of question");
    });
    QUnit.test("Add questions to page", function (assert) {
        var page = new dxSurvey.Page("Page 1");
        page.addNewQuestion("text", "Q1");
        page.addNewQuestion("checkbox", "Q2");
        assert.equal(page.questions.length, 2, "Two questions");
        assert.equal(page.questions[0].getType(), "text", "Text question");
        assert.equal(page.questions[1].getType(), "checkbox", "Checkbox question");
    });
    QUnit.test("SurveyData interface implementation", function (assert) {
        var surveyData: ISurveyData;
        surveyData = new dxSurvey.Survey();
        assert.equal(surveyData.getValue("test1"), null, "No data");
        assert.equal(surveyData.getValue("test2"), null, "No data");
        surveyData.setValue("test1", 1);
        surveyData.setValue("test2", "1");
        assert.equal(surveyData.getValue("test1"), 1, "Has value 1");
        assert.equal(surveyData.getValue("test2"), "1", "Has value '1'");
    });
    QUnit.test("Store question value in the survey", function (assert) {
        var survey = new dxSurvey.Survey();
        survey.addPage(new dxSurvey.Page("Page 1"));
        var question = survey.pages[0].addNewQuestion("text", "question");
        assert.equal(survey.getValue("question"), null, "No value");
        assert.equal(question.value, null, "No value");

        question.value = "mytext";
        assert.equal(survey.getValue("question"), "mytext", "set value from question");
        assert.equal(question.value, "mytext", "set value from question");

        survey.setValue("question", "myNewtext");
        assert.equal(survey.getValue("question"), "myNewtext", "set value from survey");
        assert.equal(question.value, "myNewtext", "set value from survey");
    });
    QUnit.test("Store comments in the survey", function (assert) {
        var survey = new dxSurvey.Survey();
        survey.addPage(new dxSurvey.Page("Page 1"));
        var question = survey.pages[0].addNewQuestion("text", "question");
        assert.equal(survey.getComment("question"), "", "Comment is empty");
        assert.equal(question.comment, "", "Comment is empty");

        question.comment = "myComment";
        assert.equal(survey.getComment("question"), "myComment", "set comment from question");
        assert.equal(question.comment, "myComment", "set comment from question");

        survey.setComment("question", "myNewComment");
        assert.equal(survey.getComment("question"), "myNewComment", "set comment from survey");
        assert.equal(question.comment, "myNewComment", "set comment from survey");
    });
    QUnit.test("Only some questions support comment", function (assert) {
        var questionText = dxSurvey.QuestionFactory.Instance.createQuestion("text", "textQuestion");

        assert.equal(questionText.supportComment(), false, "Text question doesn't support comment.");
        assert.equal(questionText.hasComment, false, "Text question doesn't support comment.");
        questionText.hasComment = true;
        assert.equal(questionText.hasComment, false, "You can't set has comment to the text question.");

        var questionDropDown = dxSurvey.QuestionFactory.Instance.createQuestion("dropdown", "dropdownQuestion");
        assert.equal(questionDropDown.supportComment(), true, "Drop down question supports comment.");
        assert.equal(questionDropDown.hasComment, false, "Has comment is false by  default.");
        questionDropDown.hasComment = true;
        assert.equal(questionDropDown.hasComment, true, "You can set comment for drop down question.");
    });
    QUnit.test("Only some questions support other", function (assert) {
        var questionText = dxSurvey.QuestionFactory.Instance.createQuestion("text", "textQuestion");

        assert.equal(questionText.supportOther(), false, "Text question doesn't support other.");
        assert.equal(questionText.hasOther, false, "Text question doesn't support other.");
        questionText.hasOther = true;
        assert.equal(questionText.hasOther, false, "You can't set has other to the text question.");

        var questionDropDown = dxSurvey.QuestionFactory.Instance.createQuestion("dropdown", "dropdownQuestion");
        assert.equal(questionDropDown.supportOther(), true, "Drop down question supports other.");
        assert.equal(questionDropDown.hasOther, false, "Has other is false by  default.");
        questionDropDown.hasOther = true;
        assert.equal(questionDropDown.hasOther, true, "You can set other for drop down question.");
    });
    QUnit.test("Comment and other could not be set together", function (assert) {
        var questionDropDown = dxSurvey.QuestionFactory.Instance.createQuestion("dropdown", "dropdownQuestion");
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
    QUnit.test("Should set required questions before go on the  next page or finish", function (assert) {
        var survey = twoPageSimplestSurvey();
        assert.notEqual(survey, null, "Survey is not  null");
        survey.pages[0].questions[0].isRequired = true;
        survey.pages[1].questions[0].isRequired = true;

        assert.equal(survey.nextPage(), false, "Can not go to the next page");
        assert.equal(survey.pages[0].questions[0].hasErrors(), true, "The question is not filled out.");
        assert.equal(survey.pages[0].hasErrors(), true, "The page is not filled out.");

        survey.pages[0].questions[0].value = "Test";

        assert.equal(survey.nextPage(), true, "Can go to the next page");
        assert.equal(survey.pages[0].questions[0].hasErrors(), false, "The question is filled out.");
        assert.equal(survey.pages[0].hasErrors(), false, "The page is filled out.");
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
    QUnit.test("Question Title property", function (assert) {
        var question = new QuestionText("q1");
        assert.equal(question.title, "q1", "get the question name by default");
        question.title = "My title";
        assert.equal(question.title, "My title", "get the question name by default");
    });
    QUnit.test("Pre-proccess value for Checkbox", function (assert) {
        var survey = new dxSurvey.Survey();
        var page = survey.addNewPage("Page 1");
        var question = new QuestionCheckbox("checkboxQuestion");
        question.choices = ["One", "Two", "Three"];
        page.addQuestion(question);

        survey.setValue("checkboxQuestion", "One");
        assert.equal(question.value, ["One"], "convert value to array");
    });
    QUnit.test("Matrix Question: visible rows", function (assert) {
        var matrix = new QuestionMatrix("q1");
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
        var matrix = new QuestionMatrix("q1");
        matrix.columns = ["col1", "col2"];
        matrix.value = "col1";
        var rows = matrix.visibleRows;
        assert.equal(rows[0].value, "col1", "set the row value correctly");
        rows[0].value = "col2";
        assert.equal(rows[0].value, "col2", "the row value changed");
        assert.equal(matrix.value, "col2", "the matrix value changed correctly");
    });
    QUnit.test("Matrix Question: get/set values for two rows", function (assert) {
        var matrix = new QuestionMatrix("q1");
        matrix.rows = ["row1", "row2"];
        matrix.columns = ["col1", "col2"];
        matrix.value = { row1: "col1" };
        var rows = matrix.visibleRows;
        assert.equal(rows[0].value, "col1", "set the row value correctly");
        rows[0].value = "col2";
        assert.equal(rows[0].value, "col2", "the row value changed");
        assert.deepEqual(matrix.value, { row1: "col2" }, "the matrix value changed correctly");
        rows[1].value = "col1";
        assert.deepEqual(matrix.value, { row1: "col2" ,  row2: "col1" }, "the matrix value changed correctly");
    });
    QUnit.test("onValueChanged event", function (assert) {
        var survey = twoPageSimplestSurvey();
        var name = "";
        var newValue = null;
        var counter = 0;
        survey.onValueChanged.add(function (sender: Survey, options: any) {
            name = options.name; newValue = options.value; counter++;
        });
        survey.setValue("question1", "value1");
        assert.equal(name, "question1", "onValueChanged event, property name is correct");
        assert.equal(newValue, "value1", "onValueChanged event, property newValue is correct");
        assert.equal(counter, 1, "onValueChanged event is called one time");
    });
    function twoPageSimplestSurvey() {
        var survey = new dxSurvey.Survey();
        var page = survey.addNewPage("Page 1");
        page.addNewQuestion("text", "question1");
        page.addNewQuestion("text", "question2");
        page = survey.addNewPage("Page 2");
        page.addNewQuestion("text", "question3");
        page.addNewQuestion("text", "question4");
        return survey;
    }
}