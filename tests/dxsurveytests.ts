/// <reference path="../src/survey.ts" />
/// <reference path="../src/page.ts" />
/// <reference path="../src/question.ts" />
/// <reference path="../src/question_baseselect.ts" />
/// <reference path="../src/question_checkbox.ts" />
/// <reference path="../src/question_matrix.ts" />
/// <reference path="../src/questionfactory.ts" />
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
    QUnit.test("Survey.getQuestionByName", function (assert) {
        var survey = new Survey();
        var page = survey.addNewPage("Page 1");
        page.addNewQuestion("text", "Q1");
        page.addNewQuestion("checkbox", "Q2");
        page = survey.addNewPage("Page 1");
        page.addNewQuestion("text", "Q3");
        page.addNewQuestion("checkbox", "Q4");

        assert.equal(survey.getQuestionByName("Q2").name, "Q2", "find question on the first page");
        assert.equal(survey.getQuestionByName("Q3").name, "Q3", "find question on the second page");
        assert.equal(survey.getQuestionByName("Q0"), null, "return null");
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
    QUnit.test("onVisibleChanged event", function (assert) {
        var survey = twoPageSimplestSurvey();
        var name = "";
        var visibility = true;
        var counter = 0;
        survey.onVisibleChanged.add(function (sender: Survey, options: any) {
            name = options.name; visibility = options.visible; counter++;
        });
        survey.getQuestionByName("question1").visible = false;

        assert.equal(name, "question1", "onVisibleChanged event, property name is correct");
        assert.equal(visibility, false, "onVisibleChanged event, property visibility is correct");
        assert.equal(counter, 1, "onVisibleChanged event is called one time");

        survey.getQuestionByName("question1").visible = true;
        assert.equal(name, "question1", "onVisibleChanged event, property name is correct");
        assert.equal(visibility, true, "onVisibleChanged event, property visibility is correct");
        assert.equal(counter, 2, "onVisibleChanged event is called two time");

        survey.getQuestionByName("question1").visible = true;
        assert.equal(counter, 2, "onVisibleChanged event is called two time");
    });
    QUnit.test("Question visibleIndex", function (assert) {
        var survey = twoPageSimplestSurvey();
        survey.onBeforeRender();
        assert.equal((<Question>survey.getQuestionByName("question1")).visibleIndex, 0, "the first question");
        assert.equal((<Question>survey.getQuestionByName("question3")).visibleIndex, 2, "the third question");
        survey.getQuestionByName("question1").visible = false;
        assert.equal((<Question>survey.getQuestionByName("question3")).visibleIndex, 1, "the third question is now visible as second");
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