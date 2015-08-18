/// <reference path="../sources/survey.ts" />
/// <reference path="../sources/page.ts" />
/// <reference path="../sources/question.ts" />
/// <reference path="../sources/questionfactory.ts" />
module dxSurvey.Tests {
    QUnit.module("dxSurvey");

    QUnit.test("Super stable test", function (assert) {
        assert.equal(1 + 1, 2, "This should usually pass");
    });
    QUnit.test("Has at least one page", function (assert) {
        var survey = new dxSurvey.Survey();
        assert.equal(survey.PageCount, 1, "Survery has at least one page");
    });
    QUnit.test("Add one more page", function (assert) {
        var survey = new dxSurvey.Survey();
        survey.addPage(new Page("Page 2"));
        assert.equal(survey.PageCount, 2, "Two pages");
    });
    QUnit.test("Current Page", function (assert) {
        var survey = new dxSurvey.Survey();
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
    QUnit.test("Add questioins to page", function (assert) {
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
    QUnit.test("Add link to Survey Data to page and Question", function (assert) {
        var survey = new dxSurvey.Survey();
        survey.addPage(new dxSurvey.Page("Page 1"));
        assert.equal(survey.pages[0].data, survey, "Link to survey data from a page");
        survey.pages[0].addNewQuestion("text", "question");
        assert.equal(survey.pages[0].questions[0].data, survey, "Link to survey data from a page");
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
    function twoPageSimplestSurvey() {
        var survey = new dxSurvey.Survey();
        var page = survey.pages[0];
        page.addNewQuestion("text", "question1");
        page.addNewQuestion("text", "question2");
        page = survey.addNewPage("Page 2");
        page.addNewQuestion("text", "question3");
        page.addNewQuestion("text", "question4");
        return survey;
    }
}