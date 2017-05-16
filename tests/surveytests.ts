import {SurveyModel} from "../src/survey";
import {PageModel} from "../src/page";
import {PanelModel} from "../src/panel";
import {QuestionFactory} from "../src/questionfactory";
import {Question} from "../src/question";
import {QuestionHtmlModel} from "../src/question_html";
import {SurveyTriggerVisible, SurveyTriggerComplete, SurveyTriggerSetValue} from "../src/trigger";
import {surveyLocalization} from "../src/surveyStrings";
import {EmailValidator} from "../src/validator";
import {JsonObject} from "../src/jsonobject";
import {QuestionTextModel} from "../src/question_text";
import {QuestionMultipleTextModel, MultipleTextItemModel} from "../src/question_multipletext";
import {QuestionMatrixModel} from "../src/question_matrix";
import {ISurvey} from "../src/base";
import {ItemValue} from "../src/itemvalue";
import {QuestionDropdownModel} from "../src/question_dropdown";
import {QuestionCheckboxModel} from "../src/question_checkbox";
import {QuestionRadiogroupModel} from "../src/question_radiogroup";
import {QuestionCommentModel} from "../src/question_comment";
import {QuestionFileModel} from "../src/question_file";
import {QuestionMatrixDropdownModel} from "../src/question_matrixdropdown";
import {QuestionMatrixDynamicModel} from "../src/question_matrixdynamic";
import {QuestionRatingModel} from "../src/question_rating";
import {CustomWidgetCollection, QuestionCustomWidget} from "../src/questionCustomWidgets";
import {QuestionSelectBase} from "../src/question_baseselect";
import {LocalizableString} from "../src/localizablestring";

export default QUnit.module("Survey");

QUnit.test("set data property", function (assert) {
    var survey = new SurveyModel();
    assert.deepEqual(survey.data, {}, "there is no data");
    survey.data = { strVal: 'item1', intVal: 5 };
    assert.deepEqual(survey.data, { strVal: 'item1', intVal: 5 }, "set the object");
    survey.data = null;
    assert.deepEqual(survey.data, { }, "clear data");
});
QUnit.test("Add two pages", function (assert) {
    var survey = new SurveyModel();
    survey.addPage(new PageModel("Page 1"));
    survey.addPage(new PageModel("Page 2"));
    assert.equal(survey.PageCount, 2, "Two pages");
});
QUnit.test("Current Page", function (assert) {
    var survey = new SurveyModel();
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
QUnit.test("CurrentPageNo", function (assert) {
    var survey = new SurveyModel();
    survey.addPage(createPageWithQuestion("Page 1"));
    assert.equal(survey.currentPageNo, 0, "the first page is  current");
    survey.currentPageNo = -1;
    assert.equal(survey.currentPageNo, 0, "can't set curent page to -1");
    survey.currentPageNo = 1;
    assert.equal(survey.currentPageNo, 0, "can't set curent page to PageNo + 1");
    var sPage = createPageWithQuestion("new Page");
    survey.addPage(sPage);
    survey.currentPageNo = 1;
    assert.equal(survey.currentPageNo, 1, "second page is current");
    survey.pages.pop();
    assert.equal(survey.currentPageNo, 0, "the first page is current after removing the current one");
});
QUnit.test("Remove Page in design mode", function (assert) {
    var survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.addPage(new PageModel("Page 1"));
    survey.addPage(new PageModel("Page 2"));
    assert.equal(survey.PageCount, 2, "Two pages");
    assert.equal(survey.currentPage.name, "Page 1", "the first page is  current");

    survey.removePage(survey.pages[0]);
    assert.equal(survey.PageCount, 1, "One page left");
    assert.equal(survey.currentPage.name, "Page 2", "the second page is  current");
});
QUnit.test("Survey.onValueChanged event, #352", function (assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("page1");
    var q1 = <QuestionDropdownModel>page.addNewQuestion("dropdown", "q1");
    q1.choices = [1, 2, 3];
    q1.hasOther = true;
    var valueChangedCallCounter = 0;
    survey.onValueChanged.add(function(survey, options){
        valueChangedCallCounter ++;
    });
    assert.equal(valueChangedCallCounter, 0, "Nothing happens");
    q1.value = 1;
    assert.equal(valueChangedCallCounter, 1, "Set one value");
    q1.value = q1.otherItem.value;
    assert.equal(valueChangedCallCounter, 2, "Set other value");
    q1.comment = "new comment";
    assert.equal(valueChangedCallCounter, 3, "Set comment to other value");
});

QUnit.test("Do not show errors in display mode", function (assert) {
    var survey = twoPageSimplestSurvey();
    (<Question>survey.pages[0].questions[0]).isRequired = true;
    survey.mode = "display";
    survey.nextPage();
    assert.equal(survey.currentPage, survey.pages[1], "Can move into another page");
});
QUnit.test("Question is readOnly", function (assert) {
    var survey = twoPageSimplestSurvey();
    var q1 = <Question>(<Question>survey.pages[0].questions[0]);
    assert.equal(q1.isReadOnly, false, "check1. question is not readonly");
    q1.readOnly = true;
    assert.equal(q1.isReadOnly, true, "check2. question is  readonly now");
    q1.readOnly = false;
    survey.mode = "display";
    assert.equal(q1.isReadOnly, true, "check2. question is  readonly because survey in the display mode");
});
QUnit.test("Do not show required error for readOnly questions", function (assert) {
    var survey = twoPageSimplestSurvey();
    var page = survey.pages[0];
    var q1 = <Question>(<Question>page.questions[0]);
    q1.isRequired = true;
    assert.equal(page.hasErrors(), true, "There is a required error");
    q1.readOnly = true;
    assert.equal(page.hasErrors(), false, "There is no errors, the question is readOnly");
});
QUnit.test("Do not show required error for value 0 and false, #345", function (assert) {
    var survey = twoPageSimplestSurvey();
    var page = survey.pages[0];
    var q1 = <Question>(<Question>page.questions[0]);
    q1.isRequired = true;
    assert.equal(page.hasErrors(), true, "There is a required error");
    survey.setValue("question1", 0)
    assert.equal(q1.value, 0, "question1.value == 0");
    assert.equal(page.hasErrors(), false, "There is no errors, the question value is 0");
    survey.setValue("question1", false)
    assert.equal(q1.value, false, "question1.value == false");
    assert.equal(page.hasErrors(), false, "There is no errors, the question value is false");
    survey.setValue("question1", null)
    assert.equal(page.hasErrors(), true, "There is a required error, the question value is null");
});
QUnit.test("Next, Prev, IsFirst and IsLast Page and progressText", function (assert) {
    var survey = new SurveyModel();
    assert.equal(survey.progressText, "", "there is pages");
    survey.addPage(createPageWithQuestion("Page 1"));
    survey.addPage(createPageWithQuestion("Second page"));
    survey.addPage(createPageWithQuestion("Third page"));
    assert.equal(survey.currentPage, survey.pages[0], "Current Page is  First");
    assert.equal(survey.isFirstPage, true, "Current Page is  First");
    assert.equal(survey.isLastPage, false, "Current Page is  First");
    assert.equal(survey.progressText, "Page 1 of 3", "Current Page is  First");
    survey.nextPage();
    assert.equal(survey.currentPage, survey.pages[1], "Current Page is  Second");
    assert.equal(survey.isFirstPage, false, "Current Page is  Second");
    assert.equal(survey.isLastPage, false, "Current Page is  Second");
    assert.equal(survey.progressText, "Page 2 of 3", "Current Page is  First");
    survey.nextPage();
    assert.equal(survey.currentPage, survey.pages[2], "Current Page is  Third");
    assert.equal(survey.isFirstPage, false, "Current Page is  Third");
    assert.equal(survey.isLastPage, true, "Current Page is  Third");
    assert.equal(survey.progressText, "Page 3 of 3", "Current Page is  First");
    survey.prevPage();
    assert.equal(survey.currentPage, survey.pages[1], "Current Page is  Second");
    assert.equal(survey.isFirstPage, false, "Current Page is  Second");
    assert.equal(survey.isLastPage, false, "Current Page is  Second");
    assert.equal(survey.progressText, "Page 2 of 3", "Current Page is  First");
    survey.prevPage();
    assert.equal(survey.currentPage, survey.pages[0], "Current Page is  First");
    assert.equal(survey.isFirstPage, true, "Current Page is  First");
    assert.equal(survey.isLastPage, false, "Current Page is  First");
    assert.equal(survey.progressText, "Page 1 of 3", "Current Page is  First");
});
QUnit.test("Next, Prev, Next", function (assert) {
    var survey = new SurveyModel();
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
QUnit.test("Survey state", function (assert) {
    var survey = new SurveyModel();
    assert.equal(survey.state, "empty", "There is no a visible page");
    survey.addPage(createPageWithQuestion("Page 1"));
    survey.addPage(createPageWithQuestion("Page 2"));
    assert.equal(survey.state, "running", "Survey is in run mode");
    survey.nextPage();
    assert.equal(survey.state, "running", "Survey is in run mode");
    survey.completeLastPage();
    assert.equal(survey.state, "completed", "Survey is completed");
});
QUnit.test("Question Creator", function (assert) {
    var inst = QuestionFactory.Instance;
    inst.registerQuestion("question1", (name: string) => { return new Question(name); });
    inst.registerQuestion("question2", (name: string) => { return new Question(name); });
    assert.equal(inst.createQuestion("question1", "Q1").name, "Q1", "Create first type of question");
    assert.equal(inst.createQuestion("question2", "Q2").name, "Q2", "Create second type of question");
    assert.equal(inst.createQuestion("question3", "Q3"), null, "Create unexisting type of question");
});
QUnit.test("Question Creator getAllQuestions", function (assert) {
    var inst = QuestionFactory.Instance;
    inst.registerQuestion("question3", (name: string) => { return new Question(name); });
    inst.registerQuestion("question4", (name: string) => { return new Question(name); });
    var names = inst.getAllTypes();
    assert.ok(names.indexOf("question3") > -1, "contains a new type");
});
QUnit.test("Add questions to page", function (assert) {
    var page = new PageModel("Page 1");
    page.addNewQuestion("text", "Q1");
    page.addNewQuestion("checkbox", "Q2");
    assert.equal(page.questions.length, 2, "Two questions");
    assert.equal(page.questions[0].getType(), "text", "Text question");
    assert.equal(page.questions[1].getType(), "checkbox", "Checkbox question");
});
QUnit.test("Survey.getQuestionByName", function (assert) {
    var survey = new SurveyModel();
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
QUnit.test("Survey.getPageByQuestion/getPageByElement", function (assert) {
    var survey = new SurveyModel();
    var page1 = survey.addNewPage("page1");
    var page2 = survey.addNewPage("page2");
    page1.addNewQuestion("text", "q1");
    var panel1 = page1.addNewPanel("panel1");
    var q2 = panel1.addNewQuestion("text", "q2");
    var panel2 = panel1.addNewPanel("panel2");
    var q3 = panel1.addNewQuestion("text", "q3");
    var q4 = page2.addNewQuestion("text", "q4");
    assert.equal(survey.getPageByQuestion(q2).name, "page1", "q1 - page1");
    assert.equal(survey.getPageByQuestion(q3).name, "page1", "q3 - page1");
    assert.equal(survey.getPageByQuestion(q4).name, "page2", "q4 - page2");
    assert.equal(survey.getPageByElement(panel1).name, "page1", "panel1 - page1");
    assert.equal(survey.getPageByElement(panel2).name, "page1", "panel2 - page1");
});
QUnit.test("Add/remove panel", function (assert) {
    var survey = new SurveyModel();
    var page1 = survey.addNewPage("page1");
    var panel1 = page1.addNewPanel("panel1");
    var q1 = panel1.addNewQuestion("text", "q1");
    var panel2 = panel1.addNewPanel("panel2");
    var q2 = panel2.addNewQuestion("text", "q2");
    assert.equal(page1.elements.length, 1, "There is one element");
    page1.removeElement(panel1);
    assert.equal(page1.elements.length, 0, "There is no elements");
});
QUnit.test("Remove element from nested panel, #321", function (assert) {
    var survey = new SurveyModel();
    var page1 = survey.addNewPage("page1");
    var panel1 = page1.addNewPanel("panel1");
    var q1 = panel1.addNewQuestion("text", "q1");
    assert.equal(panel1.elements.length, 1, "There is one question in the panel");
    page1.removeElement(q1);
    assert.equal(panel1.elements.length, 0, "There no questions in the panel");
});
QUnit.test("Add panel with questions", function (assert) {
    var survey = new SurveyModel();
    var page1 = survey.addNewPage("page1");
    var panel1 = new PanelModel("panel1");
    var q1 = panel1.addNewQuestion("text", "q1");
    var panel2 = panel1.addNewPanel("panel2");
    var q2 = panel2.addNewQuestion("text", "q2");
    page1.addElement(panel1);
    assert.equal(panel1.data, survey, "The data is set correctly in the root panel");
    assert.equal(q2.survey, survey, "The survey is set correctly in the question of the nested root");
});
QUnit.test("SurveyData interface implementation", function (assert) {
    var surveyData: ISurvey;
    surveyData = new SurveyModel();
    assert.equal(surveyData.getValue("test1"), null, "No data");
    assert.equal(surveyData.getValue("test2"), null, "No data");
    surveyData.setValue("test1", 1);
    surveyData.setValue("test2", "1");
    assert.equal(surveyData.getValue("test1"), 1, "Has value 1");
    assert.equal(surveyData.getValue("test2"), "1", "Has value '1'");
});
QUnit.test("Store question value in the survey", function (assert) {
    var survey = new SurveyModel();
    survey.addPage(new PageModel("Page 1"));
    var question = <Question>survey.pages[0].addNewQuestion("text", "question");
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
    var survey = new SurveyModel();
    survey.addPage(new PageModel("Page 1"));
    var question = <Question>survey.pages[0].addNewQuestion("text", "question");
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
    (<Question>survey.pages[0].questions[0]).isRequired = true;

    assert.equal(survey.nextPage(), false, "Can not go to the next page");
    assert.equal(survey.pages[0].questions[0].hasErrors(), true, "The question is not filled out.");
    assert.equal(survey.pages[0].hasErrors(), true, "The page is not filled out.");

    (<Question>survey.pages[0].questions[0]).value = "Test";

    assert.equal(survey.nextPage(), true, "Can go to the next page");
    assert.equal(survey.pages[0].questions[0].hasErrors(), false, "The question is filled out.");
    assert.equal(survey.pages[0].hasErrors(), false, "The page is filled out.");
});
QUnit.test("Should not be errors after prevPage bug#151", function (assert) {
    var survey = new SurveyModel();
    survey.goNextPageAutomatic = true;
    var page = survey.addNewPage("page1");
    var question = <QuestionDropdownModel>page.addNewQuestion("dropdown", "q1");
    question.choices = [1, 2, 3];
    question.isRequired = true;
    page = survey.addNewPage("page2");
    page.addNewQuestion("text", "q2");

    var errorsChangedCounter = 0;
    question.errorsChangedCallback = function () { errorsChangedCounter++; };
    survey.nextPage();
    assert.equal(question.errors.length, 1, "The question is not filled out.");
    assert.equal(errorsChangedCounter, 1, "called one time");
    question.value = 1;
    assert.equal(errorsChangedCounter, 2, "called second time");
    assert.equal(question.errors.length, 0, "The question has not errors");
    assert.equal(survey.currentPage.name, survey.pages[1].name, "Go to the next page");
    survey.prevPage();
    assert.equal(errorsChangedCounter, 2, "called second time");
    assert.equal(question.errors.length, 0, "The question has not errors");
});

QUnit.test("Invisible required questions should not be take into account", function (assert) {
    var survey = twoPageSimplestSurvey();
    assert.notEqual(survey, null, "Survey is not  null");
    (<Question>survey.pages[0].questions[0]).isRequired = true;
    assert.equal(survey.nextPage(), false, "Can not go to the next page");
    survey.pages[0].questions[0].visible = false;
    assert.equal(survey.nextPage(), true, "You can go to the next page now.");
});
QUnit.test("onValueChanged event", function (assert) {
    var survey = twoPageSimplestSurvey();
    var name = "";
    var newValue = null;
    var counter = 0;
    survey.onValueChanged.add(function (sender: SurveyModel, options: any) {
        name = options.name; newValue = options.value; counter++;
    });
    survey.setValue("question1", "value1");
    assert.equal(name, "question1", "onValueChanged event, property name is correct");
    assert.equal(newValue, "value1", "onValueChanged event, property newValue is correct");
    assert.equal(counter, 1, "onValueChanged event is called one time");
    (<Question>survey.pages[0].questions[0]).value = "val";
    assert.equal(counter, 2, "onValueChanged event is called one time");
});
QUnit.test("onValueChanged event - do not call on equal value", function (assert) {
    var survey = new SurveyModel();
    var counter = 0;
    survey.onValueChanged.add(function (sender: SurveyModel, options: any) { counter++; });
    survey.setValue("name", 1);
    assert.equal(counter, 1, "onValueChanged event is called one time");
    survey.setValue("name", 1);
    assert.equal(counter, 1, "1 is the same value");
    survey.setValue("name", { col1: [1, { cel2: "2" }] });
    assert.equal(counter, 2, "onValueChanged event is called two times");
    survey.setValue("name", { col1: [1, { cel2: "2" }] });
    assert.equal(counter, 2, "2, the value is the same");
    survey.setValue("name", { col1: [1, { cel2: "2" }, 3] });
    assert.equal(counter, 3, "onValueChanged event is called three times");
    survey.setValue("name", { col1: [1, { cel2: "2" }, 3] });
    assert.equal(counter, 3, "3, the value is the same");
    var value = survey.getValue("name");
    value.col1.push(4);
    survey.setValue("name", value);
    assert.equal(counter, 4, "onValueChanged event is called fourth times");
});
QUnit.test("onValueChanged event is not called on changing matrix value", function (assert) {
    var survey = twoPageSimplestSurvey();
    var matrixQuestion = new QuestionMatrixModel("matrix");
    survey.pages[0].addQuestion(matrixQuestion);
    matrixQuestion.columns = ["col1", "col2"];
    matrixQuestion.rows = ["row1", "row2"];
    var name = "";
    var newValue = null;
    var counter = 0;
    survey.onValueChanged.add(function (sender: SurveyModel, options: any) {
        name = options.name; newValue = options.value; counter++;
    });
    matrixQuestion.visibleRows[0].value = "col2";
    assert.equal(counter, 1, "onValueChanged event is called one time");
    assert.equal(name, "matrix", "onValueChanged event, property name is correct");
    assert.deepEqual(newValue, { "row1": "col2" }, "onValueChanged event, property newValue is correct");
});
QUnit.test("onValueChanged event is not called on changing multi text value", function (assert) {
    var survey = twoPageSimplestSurvey();
    var multiTextQuestion = new QuestionMultipleTextModel("multitext");
    survey.pages[0].addQuestion(multiTextQuestion);
    multiTextQuestion.items.push(new MultipleTextItemModel("item1"));
    multiTextQuestion.items.push(new MultipleTextItemModel("item2"));
    var name = "";
    var newValue = null;
    var counter = 0;
    survey.onValueChanged.add(function (sender: SurveyModel, options: any) {
        name = options.name; newValue = options.value; counter++;
    });
    multiTextQuestion.items[1].value = "text1";
    assert.equal(counter, 1, "onValueChanged event is called one time");
    assert.equal(name, "multitext", "onValueChanged event, property name is correct");
    assert.deepEqual(newValue, { "item2": "text1" }, "onValueChanged event, property newValue is correct");
});
QUnit.test("adding, inserting Multiple Text Item correctly", function (assert) {
    var survey = twoPageSimplestSurvey();
    var multiTextQuestion = new QuestionMultipleTextModel("multitext");
    survey.pages[0].addQuestion(multiTextQuestion);
    var item1 = new MultipleTextItemModel("item1");
    var item2 = new MultipleTextItemModel("item2");
    multiTextQuestion.items.push(item1);
    multiTextQuestion.items.splice(0, 0, item2);
    item1.value = "1";
    assert.equal(item1.value, "1", "Check1. data was set correctly");
    item2.value = "2";
    assert.equal(item2.value, "2", "Check2. data was set correctly");
    multiTextQuestion.items = [];
    item1 = multiTextQuestion.addItem("item1");
    item1.value = "3";
    assert.equal(item1.value, "3", "Check3. data was set correctly");
    multiTextQuestion.items.splice(0, 0, item2);
    item2.value = "4";
    assert.equal(item2.value, "4", "Check4. data was set correctly");
});
QUnit.test("Multiple Text required items", function (assert) {
    var survey = twoPageSimplestSurvey();
    var multiTextQuestion = new QuestionMultipleTextModel("multitext");
    survey.pages[0].addQuestion(multiTextQuestion);
    var item1 = multiTextQuestion.addItem("item1");
    var item2 = multiTextQuestion.addItem("item2");
    item1.isRequired = true;
    assert.equal(item1.fullTitle, "* item1", "Add isRequired Text");
    assert.equal(item2.fullTitle, "item2", "there is no isRequired Text");
    assert.equal(multiTextQuestion.hasErrors(), true, "item1 is required and it is empty");
    item1.value = 1;
    assert.equal(multiTextQuestion.hasErrors(), false, "item1 is required and it has a value");
});
QUnit.test("onComplete event", function (assert) {
    var survey = twoPageSimplestSurvey();
    var counter = 0;
    survey.onComplete.add(function () { counter++; });
    survey.nextPage();
    survey.nextPage();
    survey.completeLastPage();
    assert.equal(survey.state, "completed", "The survey is completed");
    assert.equal(counter, 1, "onComplete calls one time");
});
QUnit.test("onVisibleChanged event", function (assert) {
    var survey = twoPageSimplestSurvey();
    var name = "";
    var visibility = true;
    var counter = 0;
    survey.onVisibleChanged.add(function (sender: SurveyModel, options: any) {
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
    assert.equal((<Question>survey.getQuestionByName("question1")).visibleIndex, 0, "the first question");
    assert.equal((<Question>survey.getQuestionByName("question3")).visibleIndex, 2, "the third question");
    survey.getQuestionByName("question1").visible = false;
    assert.equal((<Question>survey.getQuestionByName("question3")).visibleIndex, 1, "the third question is now visible as second");
    survey.showQuestionNumbers = "off";
    assert.equal((<Question>survey.getQuestionByName("question1")).visibleIndex, -1, "off:the first question");
    assert.equal((<Question>survey.getQuestionByName("question2")).visibleIndex, -1, "off:the second question");
    assert.equal((<Question>survey.getQuestionByName("question3")).visibleIndex, -1, "off:the third question");
    survey.showQuestionNumbers = "onPage";
    assert.equal((<Question>survey.getQuestionByName("question1")).visibleIndex, -1, "onPage:the first question");
    assert.equal((<Question>survey.getQuestionByName("question2")).visibleIndex, 0, "onPage:the second question");
    assert.equal((<Question>survey.getQuestionByName("question3")).visibleIndex, 0, "onPage:the third question");
});
QUnit.test("Question visibleIndex, add-remove questions", function (assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("p1");
    var q1 = new QuestionTextModel("q1");
    page.elements.push(q1);
    page.elements.push(new QuestionTextModel("q2"));
    assert.equal((<Question>survey.getQuestionByName("q1")).visibleIndex, 0, "the first question");
    assert.equal((<Question>survey.getQuestionByName("q2")).visibleIndex, 1, "the second question");
    var q3 = new QuestionTextModel("q3");
    page.elements.splice(0, 1, q3);
    assert.equal((<Question>survey.getQuestionByName("q3")).visibleIndex, 0, "the first question");
    assert.equal((<Question>survey.getQuestionByName("q2")).visibleIndex, 1, "the second question");
});

QUnit.test("showQuestionNumbers - question fullTitle", function (assert) {
    var survey = twoPageSimplestSurvey();
    assert.equal((<Question>survey.getQuestionByName("question1")).fullTitle, "1. question1", "the first question showQuestionNumbers=on");
    assert.equal((<Question>survey.getQuestionByName("question3")).fullTitle, "3. question3", "the thrid question showQuestionNumbers=on");
    survey.showQuestionNumbers = "onPage";
    assert.equal((<Question>survey.getQuestionByName("question1")).fullTitle, "1. question1", "the first question showQuestionNumbers=onPage");
    assert.equal((<Question>survey.getQuestionByName("question3")).fullTitle, "1. question3", "the thrid question showQuestionNumbers=onPage");
    survey.showQuestionNumbers = "off";
    assert.equal((<Question>survey.getQuestionByName("question1")).fullTitle, "question1", "the first question showQuestionNumbers=onPage");
    assert.equal((<Question>survey.getQuestionByName("question3")).fullTitle, "question3", "the thrid question showQuestionNumbers=onPage");
});
QUnit.test("Question visibleIndex and no title question", function (assert) {
    var survey = twoPageSimplestSurvey();
    assert.equal((<Question>survey.getQuestionByName("question1")).visibleIndex, 0, "the first question");
    assert.equal((<Question>survey.getQuestionByName("question3")).visibleIndex, 2, "the third question");
    var question = new QuestionHtmlModel("html1");
    survey.pages[0].addQuestion(question, 0);
    assert.equal((<Question>survey.getQuestionByName("html1")).visibleIndex, -1, "html question");
    assert.equal((<Question>survey.getQuestionByName("question1")).visibleIndex, 0, "the first question + html question");
    assert.equal((<Question>survey.getQuestionByName("question3")).visibleIndex, 2, "the third question + html question");
});
QUnit.test("Pages visibleIndex and num", function (assert) {
    var survey = twoPageSimplestSurvey();
    survey.addNewPage("page 3").addNewQuestion("text", "q4");
    assert.equal(survey.pages[0].visibleIndex, 0, "start:page 1");
    assert.equal(survey.pages[1].visibleIndex, 1, "start:page 2");
    assert.equal(survey.pages[2].visibleIndex, 2, "start:page 3");
    assert.equal(survey.pages[0].num, -1, "start:page 1, num");
    assert.equal(survey.pages[1].num, -1, "start:page 2, num");
    assert.equal(survey.pages[2].num, -1, "start:page 3, num");

    survey.showPageNumbers = true;
    assert.equal(survey.pages[0].num, 1, "showPageNumbers:page 1, num");
    assert.equal(survey.pages[1].num, 2, "showPageNumbers:page 2, num");
    assert.equal(survey.pages[2].num, 3, "showPageNumbers:page 3, num");

    survey.pages[0].visible = false;
    assert.equal(survey.pages[0].visibleIndex, -1, "page[0].visible=false:page 1");
    assert.equal(survey.pages[1].visibleIndex, 0, "page[0].visible=false:page 2");
    assert.equal(survey.pages[2].visibleIndex, 1, "page[0].visible=false:page 3");
    assert.equal(survey.pages[0].num, -1, "page[0].visible=false:page 1, num");
    assert.equal(survey.pages[1].num, 1, "page[0].visible=false:page 2, num");
    assert.equal(survey.pages[2].num, 2, "page[0].visible=false:page 3, num");
});
QUnit.test("Pages num", function (assert) {
    var survey = twoPageSimplestSurvey();
    assert.equal(survey.pages[0].num, -1, "false:the first page");
    assert.equal(survey.pages[1].num, -1, "false:the second page");
    survey.showPageNumbers = true;
    assert.equal(survey.pages[0].num, 1, "true:the first page");
    assert.equal(survey.pages[1].num, 2, "true:the second page");
});
QUnit.test("Server validation", function (assert) {
    var survey = twoPageSimplestSurvey();
    var serverFunction = function (options) {
        if (options.data["question1"] && options.data["question1"] > 100) {
            options.errors["question1"] = "Question 1 should be higher than 100";
        }
        options.complete();
    }
    survey.onServerValidateQuestions = function (sender, options) {
        serverFunction(options);
    };
    survey.setValue("question1", 101);
    survey.nextPage();
    assert.equal(survey.currentPage.visibleIndex, 0, "Get server error");
    survey.setValue("question1", 10);
    survey.nextPage();
    assert.equal(survey.currentPage.visibleIndex, 1, "No errors server error");
});
QUnit.test("onVisibleChanged call validation", function (assert) {
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
QUnit.test("isCurrentPageHasErrors, required question in the invisible panel, #325", function (assert) {
    var survey = twoPageSimplestSurvey();
    var panel = survey.pages[0].addNewPanel("panel");
    var requiredQuestion = <QuestionTextModel>panel.addNewQuestion("text", "requriedQuestion");
    requiredQuestion.isRequired = true;

    assert.equal(survey.isCurrentPageHasErrors, true, "requiredQuestion value is empty");
    panel.visible = false;
    assert.equal(survey.isCurrentPageHasErrors, false, "requiredQuestion value is empty, but the parent panel is invisible");
});

QUnit.test("Page visibility", function (assert) {
    var page = new PageModel("page");
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
QUnit.test("Visible trigger test", function (assert) {
    var survey = twoPageSimplestSurvey();
    var trigger = new SurveyTriggerVisible();
    survey.triggers.push(trigger);
    trigger.name = "question1";
    trigger.value = "Hello";
    trigger.pages = ["Page 2"];
    trigger.questions = ["question2"];

    survey.setValue("question1", "H");
    assert.equal(survey.getQuestionByName("question2").visible, false, "It is invisible now");
    assert.equal(survey.pages[1].visible, false, "It is invisible now");

    survey.setValue("question1", "Hello");
    assert.equal(survey.getQuestionByName("question2").visible, true, "trigger makes it visible");
    assert.equal(survey.pages[1].visible, true, "trigger makes it visible");

    survey.setValue("question2", "He");
    assert.equal(survey.getQuestionByName("question2").visible, true, "trigger should not be called");
    assert.equal(survey.pages[1].visible, true, "trigger should not be called");
});
QUnit.test("Complete trigger test", function (assert) {
    var survey = twoPageSimplestSurvey();
    var trigger = new SurveyTriggerComplete();
    survey.triggers.push(trigger);
    trigger.name = "question1";
    trigger.value = "Hello";

    survey.setValue("question1", "H");
    assert.equal(survey.state, "running");

    survey.setValue("question1", "Hello");
    assert.equal(survey.state, "running");
    survey.nextPage();
    assert.equal(survey.state, "completed");
});
QUnit.test("Value trigger test", function (assert) {
    var survey = twoPageSimplestSurvey();
    var trigger = new SurveyTriggerSetValue();
    survey.triggers.push(trigger);
    trigger.name = "question1";
    trigger.value = "Hello";
    trigger.setToName = "name1";
    trigger.setValue = "val1";
    assert.equal(survey.getValue("name1"), null, "value is not set");
    survey.setValue("question1", "Hello");
    assert.equal(survey.getValue("name1"), "val1", "value is set");
});
QUnit.test("String format", function (assert) {
    var strResult = surveyLocalization.getString("textMinLength")["format"](10);
    assert.equal(strResult, "Please enter at least 10 symbols.", "The format string is working");
});
QUnit.test("Serialize email validator", function (assert) {
    var validator = new EmailValidator();
    var json = new JsonObject().toJsonObject(validator);
    assert.ok(json, "Convert to Json Successful");
    var newValidator = {};
    new JsonObject().toObject(json, newValidator);
    assert.ok(newValidator, "Convert from Json Successful");
});
QUnit.test("pre process title", function (assert) {
    var survey = twoPageSimplestSurvey();
    survey.data = { name: "John" };
    survey.title = "Hello {name}";
    assert.equal(survey.processedTitle, "Hello John", "process survey title correctly");
    survey.pages[0].title = "Page {PageNo} from {PageCount}.";
    assert.equal(survey.pages[0].processedTitle, "Page 1 from 2.");
    survey.pages[0].addNewQuestion("text", "email");
    survey.setValue("email", "andrew.telnov@gmail.com");
    survey.setVariable("var1", "[it is var1]");
    survey.setValue("val1", "[it is val1]");
    survey.completedHtml = "<div>Your e-mail: <b>{email}</b>{var1}{val1}</div>";
    assert.equal(survey.processedCompletedHtml, "<div>Your e-mail: <b>andrew.telnov@gmail.com</b>[it is var1][it is val1]</div>");
});

QUnit.test("pre process completedHtml nested properties and arrays", function (assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("page1");

    var multipleText = new QuestionMultipleTextModel("mt");
    multipleText.addItem("t1");
    multipleText.addItem("t2");
    page.addQuestion(multipleText);

    var dynamicMatrix = new QuestionMatrixDynamicModel("matrix");
    dynamicMatrix.addColumn("col1");
    dynamicMatrix.addColumn("col2");
    dynamicMatrix.addColumn("col3");
    page.addQuestion(dynamicMatrix);

    multipleText.value = { t2: "Year" };
    dynamicMatrix.value = [{ col1: 1 }, {col2: 2017}];

    survey.completedHtml = "{mt.t2}:{matrix[1].col2}";
    assert.equal(survey.processedCompletedHtml, "Year:2017");
});

QUnit.test("question fullTitle", function (assert) {
    var survey = twoPageSimplestSurvey();
    var question = <Question>survey.pages[0].questions[1];
    question.title = "My Title";
    assert.equal(question.fullTitle, "2. My Title");
    question.isRequired = true;
    assert.equal(question.fullTitle, "2. * My Title");
    survey.questionStartIndex = "100";
    assert.equal(question.fullTitle, "101. * My Title");
    survey.questionStartIndex = "A";
    assert.equal(question.fullTitle, "B. * My Title");
    survey.questionTitleTemplate = "{no}) {title} ({require})";
    assert.equal(question.fullTitle, "B) My Title (*)");
});
QUnit.test("clearInvisibleValues", function (assert) {
    var survey = twoPageSimplestSurvey();
    survey.clearInvisibleValues = true;
    var question1 = <Question>survey.pages[0].questions[0];
    question1.value = "myValue";
    var question2 = <Question>survey.pages[0].questions[1];
    question2.value = "myValue";
    question1.visible = false;
    survey.doComplete();
    assert.equal(question1.value, null, "Clear value of an invisible question");
    assert.equal(question2.value, "myValue", "Keep value of a visible question");
});
QUnit.test("clearInvisibleValues - comments and other values, #309", function (assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("p1");
    var q1 = <QuestionDropdownModel>page.addNewQuestion("dropdown", "q1");
    q1.hasOther = true;
    var q2 = <QuestionTextModel>page.addNewQuestion("text", "q2");
    q2.hasComment = true;
    var q3 = <QuestionTextModel>page.addNewQuestion("text", "q3");
    survey.clearInvisibleValues = true;
    q1.value = q1.otherItem.value;
    q1.comment = "comment1";
    q2.value = "val2";
    q2.comment = "comment2";
    q3.value = "val3";
    q1.visible = false;
    q2.visible = false;
    assert.notDeepEqual(survey.data, {"q3": "val3"}, "There are many vlues yet");
    survey.doComplete();
    assert.deepEqual(survey.data, {"q3": "val3"}, "There should be one value only");
});
QUnit.test("Do not store others value if others is not selected, #311", function (assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("p1");
    var q1 = <QuestionDropdownModel>page.addNewQuestion("dropdown", "q1");
    q1.hasOther = true;
    q1.value = q1.otherItem.value;
    q1.comment = "comment1";
    q1.value = 1;
    assert.notDeepEqual(survey.data, {"q1": 1}, "There is a comment yet");
    survey.doComplete();
    assert.deepEqual(survey.data, {"q1": 1}, "There no comment");
});
QUnit.test("merge values", function (assert) {
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
    assert.deepEqual(dest, { val: 1 });

    survey.doMergeValues({ val2: { val1: "str" } }, dest);
    assert.deepEqual({ val: 1, val2: { val1: "str" } }, dest);

    survey.doMergeValues({ val2: { val2: 2 } }, dest);
    assert.deepEqual({ val: 1, val2: { val1: "str", val2: 2 } }, dest);
});
QUnit.test("Several questions in one row", function (assert) {
    var page = new PageModel();
    for (var i = 0; i < 10; i++) page.addNewQuestion("text", "q" + (i + 1));
    assert.equal(page.rows.length, 10, "10 rows for each question");

    page = new PageModel();
    for (var i = 0; i < 10; i++) page.addNewQuestion("text", "q" + (i + 1));
    page.questions[0].startWithNewLine = false;
    assert.equal(page.rows.length, 10, "still 10 rows for each question");
    assert.equal(page.rows[0].questions[0].renderWidth, "100%", "the render width is 100%");

    page = new PageModel();
    for (var i = 0; i < 10; i++) page.addNewQuestion("text", "q" + (i + 1));
    for (var i = 0; i < 10; i++) {
        page.questions[i].startWithNewLine = i % 2 == 0;
    }
    assert.equal(page.rows.length, 5, "every second has startWithNewLine equals false, there 5 rows now");
    for (var i = 0; i < 5; i++) {
        assert.equal(page.rows[i].questions.length, 2, "two questions for every row");
        assert.equal(page.rows[i].questions[0].renderWidth, "50%", "the render width is 50%");
        assert.equal(page.rows[i].questions[0].rightIndent, 1, "the indent is 1");
        assert.equal(page.rows[i].questions[1].renderWidth, "50%", "the render width is 50%");
        assert.equal(page.rows[i].questions[1].rightIndent, 0, "the indent is 0");
    }
});
QUnit.test("test goNextPageAutomatic property", function (assert) {
    var survey = twoPageSimplestSurvey();

    var dropDownQ = <QuestionDropdownModel>survey.pages[1].addNewQuestion("dropdown", "question5");
    dropDownQ.choices = [1, 2, 3];
    dropDownQ.hasOther = true;
    survey.goNextPageAutomatic = true;
    assert.equal(survey.currentPage.name, survey.pages[0].name, "the first page is default page");
    survey.setValue("question1", 1);
    survey.setValue("question2", 2);
    assert.equal(survey.currentPage.name, survey.pages[1].name, "go to the second page automatically");
    (<Question>survey.currentPage.questions[0]).value = "3";
    (<Question>survey.currentPage.questions[1]).value = "4";
    dropDownQ.value = dropDownQ.otherItem.value;
    assert.equal(survey.currentPage.name, survey.pages[1].name, "stay on the second page");
    assert.notEqual(survey.state, "completed", "survey is still running");
    dropDownQ.comment = "other value";
    assert.equal(survey.state, "completed", "complete the survey");
});
QUnit.test("test goNextPageAutomatic after errors", function (assert) {
    var survey = twoPageSimplestSurvey();

    survey.goNextPageAutomatic = true;
    (<Question>survey.getQuestionByName("question2")).isRequired = true;
    assert.equal(survey.currentPage.name, survey.pages[0].name, "the first page is default page");
    survey.setValue("question1", 1);
    survey.nextPage();
    assert.equal(survey.currentPage.name, survey.pages[0].name, "we are still on the first page. There are errors.");
    survey.setValue("question2", 2);
    assert.equal(survey.currentPage.name, survey.pages[1].name, "go to the second page automatically");
});
QUnit.test("goNextPageAutomatic: should not work for complex questions like matrix, checkbox, multiple text", function (assert) {
    var questions = [];
    questions.push({ question: new QuestionCheckboxModel("check"), auto: false, value: [1] });
    questions.push({ question: new QuestionRadiogroupModel("radio"), auto: true, value: 1 });
    questions.push({ question: new QuestionDropdownModel("dropdown"), auto: true, value: 1 });
    questions.push({ question: new QuestionCommentModel("comment"), auto: false, value: "1" });
    questions.push({ question: new QuestionFileModel("file"), auto: false, value: "1" });
    questions.push({ question: new QuestionFileModel("html"), auto: false, value: null });

    var matrix = new QuestionMatrixModel("matrix");
    matrix.rows = ["row1", "row2"];
    matrix.columns = ["col1", "col2"];
    questions.push({ question: matrix, auto: false, value: { "row1": "col1" } });
    questions.push({ question: matrix, auto: true, value: { "row1": "col1", "row2": "col1" } });

    var dropDownMatrix = new QuestionMatrixDropdownModel("matrixdropdown");
    dropDownMatrix.addColumn("col1");
    dropDownMatrix.rows = ["row1", "row2"];
    questions.push({ question: dropDownMatrix, auto: false, value: { "row1": { "col1": 1 } } });
    questions.push({ question: dropDownMatrix, auto: true, value: { "row1": { "col1": 1 }, "row2": { "col1": 2 } } });

    var dynamicMatrix = new QuestionMatrixDynamicModel("matrixdynamic");
    dynamicMatrix.addColumn("col1");
    dynamicMatrix.rowCount = 2;
    questions.push({ question: dynamicMatrix, auto: false, value: [{ "col1": 1 }] });
    questions.push({ question: dynamicMatrix, auto: false, value: [{ "col1": 1 }, { "col1": 1 }] });

    var multipleText = new QuestionMultipleTextModel("multitext");
    multipleText.addItem("t1");
    multipleText.addItem("t2");
    questions.push({ question: multipleText, auto: false, value: { t1: "1" } });
    questions.push({ question: multipleText, auto: true, value: { t1: "1", t2: "2" } });

    questions.push({ question: new QuestionRatingModel("rating"), auto: true, value: 1 });
    questions.push({ question: new QuestionTextModel("text"), auto: true, value: "1" });

    var pageIndex = 0;
    for (var i = 0; i < questions.length; i++) {
        var q = questions[i];
        var survey = new SurveyModel();
        var page = survey.addNewPage("firstpage");
        page.addQuestion(q.question);
        survey.goNextPageAutomatic = true;
        if (q.value) {
            q.question.value = q.value;
        }
        var state = q.auto ? "completed" : "running";
        assert.equal(survey.state, state, "goNextPageAutomatic is incorrect for question: " + q.question.name);
    }
});
QUnit.test("goNextPageAutomatic bug #200: https://github.com/surveyjs/surveyjs/issues/200", function (assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("page1");
    page.addNewQuestion("html", "q1");
    var q2 = <QuestionDropdownModel>page.addNewQuestion("dropdown", "q2");
    q2.choices = [1, 2, 3];
    page = survey.addNewPage("page2");
    page.addNewQuestion("text", "q3");
    survey.goNextPageAutomatic = true;
    (<Question>survey.getQuestionByName("q2")).value = 1;
    assert.equal(survey.currentPage.name, survey.pages[1].name, "go to the next page");
});

QUnit.test("goNextPageAutomatic and clearInvisibleValues bug #252: https://github.com/surveyjs/surveyjs/issues/252", function (assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("page1");
    var q1 = <QuestionDropdownModel>page.addNewQuestion("dropdown", "q1");
    q1.choices = [1, 2, 3];
    var q2 = <QuestionDropdownModel>page.addNewQuestion("dropdown", "q2");
    q2.visible = false;
    q2.value = 1;
    survey.goNextPageAutomatic = true;
    survey.clearInvisibleValues = true;
    (<Question>survey.getQuestionByName("q1")).value = 1;
    assert.equal(survey.state, "completed");
});


QUnit.test("isNavigationButtonsShowing", function (assert) {
    var survey = twoPageSimplestSurvey();
    assert.equal(survey.isNavigationButtonsShowing, true, "by default buttons are shown");
    survey.setDesignMode(true);
    assert.equal(survey.isNavigationButtonsShowing, false, "do not show buttons at design time");
    survey.setDesignMode(false);
    assert.equal(survey.isNavigationButtonsShowing, true, "by default buttons are shown");
    survey.showNavigationButtons = false;
    assert.equal(survey.isNavigationButtonsShowing, false, "showNavigationButtons = false");
    survey.pages[0].navigationButtonsVisibility = "show";
    assert.equal(survey.isNavigationButtonsShowing, true, "navigationButtonsVisibility = 'show' && showNavigationButtons = false");
    survey.showNavigationButtons = true;
    survey.pages[0].navigationButtonsVisibility = "hide";
    assert.equal(survey.isNavigationButtonsShowing, false, "navigationButtonsVisibility = 'hide' && showNavigationButtons = true");
    survey.showNavigationButtons = true;
    survey.pages[0].navigationButtonsVisibility = "inherit";
    assert.equal(survey.isNavigationButtonsShowing, true, "navigationButtonsVisibility = 'inherit' && showNavigationButtons = true");
});

QUnit.test("simple condition test", function (assert) {
    var survey = new SurveyModel({
        pages: [{ name: "page1",
            questions: [
                { type: "checkbox", name: "q1", choices: ["yes", "no"] },
                { type: "checkbox", name: "q2", choices: ["yes", "no"] }]
        }, { name : "page2", visibleIf: "{q1} = 'yes' or {q2} = 'no'",
            questions: [
                { type: "text", name: "q3", visibleIf: "{q1} = 'yes' and {q2} = 'no'", },
                { type: "text", name: "q4" }]
        }
        ]
    });
    var q3 = survey.getQuestionByName("q3");
    assert.equal(survey.pages[1].visible, false, "initially the page becomes invisible");
    assert.equal(q3.visible, false, "initially q3 becomes invisible");
    survey.setValue("q1", "yes");
    survey.setValue("q2", "no");
    assert.equal(survey.pages[1].visible, true, "the page becomes visible, q1 = 'yes'");
    assert.equal(q3.visible, true, "q3 becomes visible, q1 = 'yes' and q2 = 'no'");
    survey.setValue("q2", "yes");
    assert.equal(survey.pages[1].visible, true, "the page becomes visible, q1 = 'yes'");
    assert.equal(q3.visible, false, "q3 becomes invisible, q1 = 'yes' and q2 = 'yes'");
    survey.setValue("q1", "no");
    assert.equal(survey.pages[1].visible, false, "the page becomes invisible, q1 = 'no'");
    assert.equal(q3.visible, false, "q3becomes invisible, q1 = 'no' and q2 = 'yes'");
});

QUnit.test("simple condition test, page visibility", function (assert) {
    var survey = new SurveyModel({
        pages: [{
            name: "page1",
            questions: [
                { type: "checkbox", name: "q1", choices: ["yes", "no"] }]
        }, {
                name: "page2", visibleIf: "{q1} contains 'yes'",
                questions: [
                    { type: "text", name: "q3" }]
            }
        ]
    });
    var page2 = survey.getPageByName("page2");
    assert.equal(page2.visible, false, "the initial page2 is invisible");
    survey.setValue("q1", ["yes"]);
    assert.equal(page2.visible, true, "the page becomes visible, q1 = 'yes'");
});

QUnit.test("visibleIf for question, call onPageVisibleChanged", function (assert) {
    var survey = new SurveyModel({
        pages: [{
            name: "page1",
            questions: [
                { type: "checkbox", name: "q1", choices: ["yes", "no"] }]
        }, {
                name: "page2",
                questions: [
                    { type: "text", name: "q3", visibleIf: "{q1} contains 'yes'" }]
            }
        ]
    });
    var counter = 0;
    survey.onPageVisibleChanged.add(function () { counter++; });
    assert.equal(counter, 0, "nothing happens");
    survey.setValue("q1", ["yes"]);
    assert.equal(counter, 1, "calls one time");
    survey.setValue("q1", ["no"]);
    assert.equal(counter, 2, "calls second time");
    survey.setValue("q1", []);
    assert.equal(counter, 2, "nothing happens");
});

QUnit.test("isRequired test, empty array https://github.com/surveyjs/surveyjs/issues/362", function (assert) {
    var survey = new SurveyModel({
        pages: [{
            name: "page1",
            questions: [
                { type: "checkbox", isRequired:true, name: "q1", choices: ["yes", "no"] }]
        }]
    });

    var page1 = survey.getPageByName("page1");
    var q1 = <Question>(<Question>page1.questions[0]);
    q1.value = [];
    assert.equal(page1.hasErrors(), true, "There is a required error");
    q1.value = ["yes"];
    assert.equal(page1.hasErrors(), false, "There is no required error");
});

QUnit.test("multiple triger on checkbox stop working.", function (assert) {
    var survey = new SurveyModel({
        pages: [{
            questions: [
                { type: "checkbox", name: "question1", choices: ["one", "two", "three"] },
                { type: "text", name: "question2", visible: false },
                { type: "text", name: "question3", visible: false },
                { type: "text", name: "question4", visible: false }]
        }],
        triggers: [{ type: "visible", operator: "contains", value: "one", name: "question1", questions: ["question2"] },
            { type: "visible", operator: "contains", value: "two", name: "question1", questions: ["question3"] }]
    });

    var check = <QuestionCheckboxModel>survey.getQuestionByName("question1");
    var value = ["one"];
    check.value = value;
    assert.equal(survey.getQuestionByName("question2").visible, true, "The second question is visible");
    value.push("two");
    check.value = value;
    assert.equal(survey.getQuestionByName("question3").visible, true, "The third question is visible");
});

QUnit.test("QuestionCheckbox if single value set then convert it to array, #334", function (assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("page1");
    var q1 = <QuestionCheckboxModel>page.addNewQuestion("checkbox", "q1");
    survey.setValue("q1", [1]);
    assert.deepEqual(survey.getValue("q1"), [1], "survey.getValue returns array");
    assert.deepEqual(q1.value, [1], "q1.value returns array");
    survey.setValue("q1", 1);
    assert.deepEqual(survey.getValue("q1"), 1, "survey.getValue return value");
    assert.deepEqual(q1.value, [1], "q1.value still returns array");
});

QUnit.test("visibleIf and page rows", function (assert) {
    var survey = new SurveyModel({
        pages:[
            {name:"component",questions:[{type:"dropdown",choices:[{value:"app",text:"Application / Web"},{value:"database",text:"Database"}],name:"component",title:"Component Type"},
            {type:"dropdown",choices:[{value:"windows",text:"Windows"},{value:"linux",text:"Linux"}],name:"componentOs",title:"Which operating system are you using?",visible:false,visibleIf:"{component} = 'app' "},
            {type:"text",name:"question1",title:"Question 1",visible:false,visibleIf:"{component} = 'app' "},
            {type:"text",name:"question2",title:"Question 2",visible:false,visibleIf:"{component} = 'app' "},
            {type:"text",name:"database",title:"Database name",visible:false,visibleIf:"{component} = 'database' "}]}],
            questionTitleTemplate:"{title} {require}:",requiredText:"(*)",sendResultOnPageNext:true,showQuestionNumbers:"off"
    });
    var page = survey.currentPage;
    assert.equal(page.rows.length, 5);

    survey.setValue("component", "app");
    assert.equal(page.rows[1].visible, true);
    assert.equal(page.rows[4].visible, false);

    survey.setValue("component", "database");
    assert.equal(page.rows[1].visible, false);
    assert.equal(page.rows[4].visible, true);

    survey.setValue("component", "app");
    assert.equal(page.rows[1].visible, true);
    assert.equal(page.rows[4].visible, false);
});
QUnit.test("assign customWidgets to questions", function (assert) {
    CustomWidgetCollection.Instance.clear();
    CustomWidgetCollection.Instance.addCustomWidget({ name: "first", isFit: (question) => { return question.name == "question2"; } });
    CustomWidgetCollection.Instance.addCustomWidget({ name: "second", isFit: (question) => { return (<Question>question).getType() == "checkbox"; } });
    var survey = twoPageSimplestSurvey();
    survey.pages[0].addNewQuestion("checkbox", "question5");
    assert.equal(survey.currentPage, survey.pages[0], "the first page is choosen");
    assert.equal((<Question>survey.getQuestionByName("question1")).customWidget, null, "there is no custom widget for this question");
    assert.equal((<Question>survey.getQuestionByName("question2")).customWidget.name, "first", "has the first custom widget");
    assert.equal((<Question>survey.getQuestionByName("question5")).customWidget.name, "second", "has the second custom widget");
    CustomWidgetCollection.Instance.clear();
});
QUnit.test("Set 0 value for text inputType=number from survey. Bug #267", function (assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("Page 1");
    page.addNewQuestion("text", "question1");
    var question = <QuestionTextModel>page.questions[0];
    question.inputType = "number";
    assert.strictEqual(question.value, undefined, "undefined initial value");
    question.value = "0";
    assert.strictEqual(question.value, 0, "zero value");
});

QUnit.test("Survey Localication - check question.title", function (assert) {
    var survey = twoPageSimplestSurvey();
    var q1 = <QuestionTextModel>survey.getQuestionByName("question1");
    q1.title = "val1";
    survey.locale = "de";
    q1.title = "de-val1";
    survey.locale = "fr";
    assert.equal(q1.title, "val1", "Use the default title");
    survey.locale = "de";
    assert.equal(q1.title, "de-val1", "Use 'de' title");
});

QUnit.test("Survey Localication - check page/panel.title and processedTitle", function (assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("page1");
    var panel = page.addNewPanel("panel1");
    assert.equal(page.processedTitle, "", "page title is empty");
    assert.equal(panel.processedTitle, "", "panel title is empty");
    survey.setDesignMode(true);
    assert.equal(page.processedTitle, "", "page title is empty at design-time");
    assert.equal(panel.processedTitle, "[panel1]", "panel title uses name");
    page.title = "pageText";
    panel.title = "panelText";
    survey.locale = "de";
    page.title = "de-pageText";
    panel.title = "de-panelText";
    survey.locale = "fr";
    assert.equal(page.title, "pageText", "Use the default page title");
    assert.equal(panel.title, "panelText", "Use the default panel title");
    survey.locale = "de";
    assert.equal(page.title, "de-pageText", "Use the 'de' page title");
    assert.equal(panel.title, "de-panelText", "Use the 'de' panel title");
});

QUnit.test("Survey Localication - dropdown.choices", function (assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("Page 1");
    var q1 = <QuestionDropdownModel>page.addNewQuestion("dropdown", "question1");
    q1.choices = ["val1"];
    q1.choices[0].text = "text1";
    survey.locale = "de";
    q1.choices[0].text = "de-text1";
    assert.equal(q1.choices[0].text, "de-text1", "Use 'de' text");
    survey.locale = "fr";
    assert.equal(q1.choices[0].text, "text1", "Use the default text");
});

QUnit.test("Survey Localication - matrix.columns", function (assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("Page 1");
    var q1 = new QuestionMatrixModel("matrix");
    q1.columns = ["col1"];
    page.addQuestion(q1);

    q1.columns[0].text = "text1";
    survey.locale = "de";
    q1.columns[0].text = "de-text1";
    assert.equal(q1.columns[0].text, "de-text1", "Use 'de' text");
    survey.locale = "fr";
    assert.equal(q1.columns[0].text, "text1", "Use the default text");
});

QUnit.test("Survey Localication - dropdownmatrix.columns", function (assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("Page 1");
    var q1 = new QuestionMatrixDropdownModel("matrixdropdown");
    var col1 = q1.addColumn("col1");
    q1.rows = ["row1", "row2"];
    page.addQuestion(q1);

    col1.choices = ["val1"];
    col1.title = "title1";
    col1.optionsCaption = "caption1";
    col1.choices[0].text = "text1";
    survey.locale = "de";
    col1.title = "de-title1";
    col1.optionsCaption = "de-caption1";
    col1.choices[0].text = "de-text1";
    assert.equal(col1.title, "de-title1", "Use 'de' text, title");
    assert.equal(col1.optionsCaption, "de-caption1", "Use 'de' text, optionsCaption");
    assert.equal(col1.choices[0].text, "de-text1", "Use 'de' text, choices");
    survey.locale = "fr";
    assert.equal(col1.title, "title1", "Use default text, title");
    assert.equal(col1.optionsCaption, "caption1", "Use default text, optionsCaption");
    assert.equal(col1.choices[0].text, "text1", "Use the default text");
});

QUnit.test("Survey Localication - multipletext.items", function (assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("Page 1");
    var q1 = new QuestionMultipleTextModel("mText");
    var item = q1.addItem("item1")
    page.addQuestion(q1);
    item.title = "title1";
    item.placeHolder = "caption1";
    survey.locale = "de";
    item.title = "de-title1";
    item.placeHolder = "de-caption1";
    assert.equal(item.title, "de-title1", "Use 'de' text, title");
    assert.equal(item.placeHolder, "de-caption1", "Use 'de' text, placeHolder");
    survey.locale = "fr";
    assert.equal(item.title, "title1", "Use default text, title");
    assert.equal(item.placeHolder, "caption1", "Use default text, placeHolder");
});

QUnit.test("Survey Markdown - dropdown.choices", function (assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("Page 1");
    var q1 = new QuestionDropdownModel("q1");
    page.addQuestion(q1);
    q1.choices = [{value: 1, text: "text1"}, {value: 1, text: "text2markdown"}];
    survey.onTextMarkdown.add(function(survey, options) {
        if(options.text.indexOf("markdown")> -1) options.html = options.text.replace("markdown", "!")
    });
    var loc1 = (<ItemValue>q1.choices[0]).locText;
    var loc2 = (<ItemValue>q1.choices[1]).locText;
    assert.equal(loc1.renderedHtml, "text1", "render standard text");
    assert.equal(loc2.renderedHtml, "text2!", "render markdown text");
});

QUnit.test("Survey Markdown - question title", function (assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("Page 1");
    var q1 = <Question>page.addNewQuestion("text", "q1");
    var q2 = <Question>page.addNewQuestion("text", "q2");
    survey.onTextMarkdown.add(function(survey, options) {
        if(options.text.indexOf("markdown")> -1) options.html = options.text.replace("markdown", "!")
    });
    q2.value = "value2";
    var loc = q1.locTitle;
    q1.title = "title1, q2.value is {q2}markdown";
    assert.equal(q1.fullTitle, "1. title1, q2.value is value2!", "question.title, use markdown and text preprocessing");
    assert.equal(loc.renderedHtml, "1. title1, q2.value is value2!", "question.locTitle.renderedHtml, use markdown and text preprocessing");

    survey.questionTitleTemplate = "{no}) {title} ({require})markdown";
    q1.isRequired = true;
    assert.equal(q1.fullTitle, "1) title1, q2.value is value2! (*)!", "question.title with chaqnged questionTitleTemplate, use markdown and text preprocessing");
    assert.equal(loc.renderedHtml, "1) title1, q2.value is value2! (*)!", "question.locTitle.renderedHtml with chaqnged questionTitleTemplate, use markdown and text preprocessing");
});

QUnit.test("Survey Markdown - page title", function (assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("Page 1");
    var q1 = <Question>page.addNewQuestion("text", "q1");
    survey.onTextMarkdown.add(function(survey, options) {
        if(options.text.indexOf("markdown")> -1) options.html = options.text.replace("markdown", "!")
    });
    q1.value = "value1";
    var loc = page.locTitle;
    page.title = "Page 1markdown, q1 is {q1}";
    assert.equal(page.processedTitle, "Page 1!, q1 is value1", "page.processedTitle, use markdown and text preprocessing");
    assert.equal(loc.renderedHtml, "Page 1!, q1 is value1", "page.locTitle.renderedHtml, use markdown and text preprocessing");
});

QUnit.test("Survey Markdown - dropdownmatrix.columns", function (assert) {
    var survey = new SurveyModel();
    survey.onTextMarkdown.add(function(survey, options) {
        if(options.text.indexOf("markdown")> -1) options.html = options.text.replace("markdown", "!")
    });
    var page = survey.addNewPage("Page 1");
    var q1 = new QuestionMatrixDropdownModel("matrixdropdown");
    var col1 = q1.addColumn("col1");
    var col2 = q1.addColumn("col2", "colText2");
    var col3 = q1.addColumn("col3", "colText3markdown");
    q1.rows = ["row1", "row2"];
    page.addQuestion(q1);

    var loc1 = col1.locTitle;
    var loc2 = col2.locTitle;
    var loc3 = col3.locTitle;
    assert.equal(loc1.renderedHtml, "col1", "render column name");
    assert.equal(loc2.renderedHtml, "colText2", "render column text");
    assert.equal(loc3.renderedHtml, "colText3!", "render column text as markdown");
});

QUnit.test("Survey Markdown - nmatrix.rows", function (assert) {
    var survey = new SurveyModel();
    survey.onTextMarkdown.add(function(survey, options) {
        if(options.text.indexOf("markdown")> -1) options.html = options.text.replace("markdown", "!")
    });
    var page = survey.addNewPage("Page 1");
    var q1 = new QuestionMatrixModel("matrixdropdown");
    q1.columns = [1];
    q1.rows = ["row1", "row2", "row3"];
    q1.rows[1].text = "rowText2";
    q1.rows[2].text = "rowText3markdown";
    page.addQuestion(q1);

    var loc1 = q1.visibleRows[0].locText;
    var loc2 = q1.visibleRows[1].locText;
    var loc3 = q1.visibleRows[2].locText;
    assert.equal(loc1.renderedHtml, "row1", "render column name");
    assert.equal(loc2.renderedHtml, "rowText2", "render column text");
    assert.equal(loc3.renderedHtml, "rowText3!", "render column text as markdown");
});

QUnit.test("Survey Markdown - survey title", function (assert) {
    var survey = new SurveyModel();
    survey.onTextMarkdown.add(function(survey, options) {
        if(options.text.indexOf("markdown")> -1) options.html = options.text.replace("markdown", "!")
    });
    survey.setValue("q1", "value1");
    var loc = survey.locTitle;
    survey.title = "Surveymarkdown, q1 is {q1}";
    assert.equal(survey.processedTitle, "Survey!, q1 is value1", "survey.processedTitle, use markdown and text preprocessing");
    assert.equal(loc.renderedHtml, "Survey!, q1 is value1", "survey.locTitle.renderedHtml, use markdown and text preprocessing");
});

QUnit.test("QuestionRadiogroupModel clears comment - issue #390", function (assert) {
    var question = new QuestionRadiogroupModel("q1");
    question.hasComment = true;
    question.comment = "comment text";
    question.clearUnusedValues();
    assert.equal(question.comment, "comment text");
});

QUnit.test("onMatrixRowAdded", function (assert) {
    var survey = new SurveyModel();
    survey.onMatrixRowAdded.add(function(survey, options) {
        var q = options.question;
        var newValue = {};
        for(var i = q.rowCount - 1; i >= 0; i --) {
            var rowValue = q.getRowValue(i);
            if(rowValue && rowValue["col1"]) {
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
    q1.value = [{col1: 1, col2: "1"}, {col1: 2, col2: "2"}];
    q1.addRow();
    assert.equal(q1.rowCount, 4, "there are two rows");
    assert.equal(q1.value[3]["col1"], 2, "get value from previous");
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
function createPageWithQuestion(name: string) : PageModel {
    var page = new PageModel(name);
    page.addNewQuestion("text", "q1");
    return page;
}
