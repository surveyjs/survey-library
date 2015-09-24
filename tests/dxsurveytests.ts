/// <reference path="../src/survey.ts" />
/// <reference path="../src/page.ts" />
/// <reference path="../src/question.ts" />
/// <reference path="../src/question_baseselect.ts" />
/// <reference path="../src/question_checkbox.ts" />
/// <reference path="../src/question_matrix.ts" />
/// <reference path="../src/questionfactory.ts" />
module dxSurvey.Tests {
    QUnit.module("dxSurvey");

    QUnit.test("set data property", function (assert) {
        var survey = new dxSurvey.Survey();
        assert.deepEqual(survey.data, {}, "there is no data");
        survey.data = { strVal: 'item1', intVal: 5 };
        assert.deepEqual(survey.data, { strVal: 'item1', intVal: 5 }, "set the object");
        survey.data = null;
        assert.deepEqual(survey.data, { }, "clear data");
    });
    QUnit.test("Add two pages", function (assert) {
        var survey = new dxSurvey.Survey();
        survey.addPage(new Page("Page 1"));
        survey.addPage(new Page("Page 2"));
        assert.equal(survey.PageCount, 2, "Two pages");
    });
    QUnit.test("Current Page", function (assert) {
        var survey = new dxSurvey.Survey();
        survey.addPage(createPageWithQuestion("Page 1"));
        assert.equal(survey.currentPage, survey.pages[0], "the first page is  current");
        survey.currentPage = null;
        assert.equal(survey.currentPage, survey.pages[0], "can't set curent page to null");
        var sPage = createPageWithQuestion("new Page");
        survey.addPage(sPage);
        survey.currentPage = sPage;
        assert.equal(survey.currentPage, survey.pages[1], "second page is current");
        survey.pages.pop();
        assert.equal(survey.currentPage, survey.pages[0], "the first page is current after removing the current one");
    });
    QUnit.test("Next, Prev, IsFirst and IsLast Page", function (assert) {
        var survey = new dxSurvey.Survey();
        survey.addPage(createPageWithQuestion("Page 1"));
        survey.addPage(createPageWithQuestion("Second page"));
        survey.addPage(createPageWithQuestion("Third page"));
        assert.equal(survey.currentPage, survey.pages[0], "Current Page is  First");
        assert.equal(survey.isFirstPage, true, "Current Page is  First");
        assert.equal(survey.isLastPage, false, "Current Page is  First");
        survey.nextPage();
        assert.equal(survey.currentPage, survey.pages[1], "Current Page is  Second");
        assert.equal(survey.isFirstPage, false, "Current Page is  Second");
        assert.equal(survey.isLastPage, false, "Current Page is  Second");
        survey.nextPage();
        assert.equal(survey.currentPage, survey.pages[2], "Current Page is  Third");
        assert.equal(survey.isFirstPage, false, "Current Page is  Third");
        assert.equal(survey.isLastPage, true, "Current Page is  Third");
        survey.prevPage();
        assert.equal(survey.currentPage, survey.pages[1], "Current Page is  Second");
        assert.equal(survey.isFirstPage, false, "Current Page is  Second");
        assert.equal(survey.isLastPage, false, "Current Page is  Second");
        survey.prevPage();
        assert.equal(survey.currentPage, survey.pages[0], "Current Page is  First");
        assert.equal(survey.isFirstPage, true, "Current Page is  First");
        assert.equal(survey.isLastPage, false, "Current Page is  First");
    });
    QUnit.test("Next, Prev, Next", function (assert) {
        var survey = new dxSurvey.Survey();
        survey.addPage(createPageWithQuestion("Page 1"));
        survey.addPage(createPageWithQuestion("Page 2"));
        survey.addPage(createPageWithQuestion("Page 3"));
        assert.equal(survey.currentPage, survey.pages[0], "Initial page is  first");
        survey.nextPage();
        assert.equal(survey.currentPage, survey.pages[1], "After next the current page is  second");
        survey.prevPage();
        assert.equal(survey.currentPage, survey.pages[0], "After the prev the current page is again first");
        survey.nextPage();
        assert.equal(survey.currentPage, survey.pages[1], "After second next the current page is  second");
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
    QUnit.test("Invisible required questions should not be take into account", function (assert) {
        var survey = twoPageSimplestSurvey();
        assert.notEqual(survey, null, "Survey is not  null");
        survey.pages[0].questions[0].isRequired = true;
        assert.equal(survey.nextPage(), false, "Can not go to the next page");
        survey.pages[0].questions[0].visible = false;
        assert.equal(survey.nextPage(), true, "You can go to the next page now.");
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
    QUnit.test("onVisibleChanged event", function (assert) {
        var survey = twoPageSimplestSurvey();
        survey.onValidateQuestion.add(function (sender, options) {
            if (options.name == "question1" && options.value > 100) {
                options.error = "Question 1 should be higher than 100";
            }
        });
        assert.equal(survey.isCurrentPageHasErrors, false, "There is no error if the value is empty");
        survey.setValue("question1", 1);
        assert.equal(survey.isCurrentPageHasErrors, false, "the value is less than 100");
        survey.setValue("question1", 101);
        assert.equal(survey.isCurrentPageHasErrors, true, "the value is more than 100, no errors");
    });
    QUnit.test("Page visibility", function (assert) {
        var page = new Page("page");
        assert.equal(page.isVisible, false, "page is invisible if there is no questions in it");
        page.addNewQuestion("text", "q1");
        assert.equal(page.isVisible, true, "there is one question");
        page.visible = false;
        assert.equal(page.isVisible, false, "we made the page invisible");
        page.visible = true;
        assert.equal(page.isVisible, true, "we made the page visible");
        page.questions[0].visible = false;
        assert.equal(page.isVisible, false, "there is no visible questions on the page");
        page.questions[0].visible = true;
        assert.equal(page.isVisible, true, "we have made the question visible again");
    });
    QUnit.test("Survey visiblePages and start using them", function (assert) {
        var survey = twoPageSimplestSurvey();
        assert.equal(survey.visiblePages.length, 2, "All pages are visible");
        assert.equal(survey.currentPage.name, "Page 1", "the first page is current");
        survey.pages[0].visible = false;
        assert.equal(survey.visiblePages.length, 1, "The first page becomes invisible");
        assert.equal(survey.currentPage.name, "Page 2", "the second page is current, because the first is invisible");
    });
    QUnit.test("Survey visiblePages, make second and third invisbile and go the last page on next", function (assert) {
        var survey = twoPageSimplestSurvey();
        survey.currentPage = survey.pages[0];
        survey.addNewPage("Page 3").addNewQuestion("text", "p3q1");
        survey.addNewPage("Page 4").addNewQuestion("text", "p4q1");
        survey.pages[1].visible = false;
        survey.pages[2].questions[0].visible = false;
        survey.nextPage();
        assert.equal(survey.currentPage.name, "Page 4", "Bypass two invisible pages");
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
    function createPageWithQuestion(name: string) : Page {
        var page = new Page(name);
        page.addNewQuestion("text", "q1");
        return page;
    }
}