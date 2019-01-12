import { SurveyModel } from "../src/survey";
import { PageModel } from "../src/page";
import { PanelModel } from "../src/panel";
import { QuestionFactory } from "../src/questionfactory";
import { Question } from "../src/question";
import { QuestionHtmlModel } from "../src/question_html";
import {
  SurveyTriggerVisible,
  SurveyTriggerComplete,
  SurveyTriggerSetValue,
  SurveyTriggerCopyValue,
  SurveyTriggerRunExpression
} from "../src/trigger";
import { surveyLocalization } from "../src/surveyStrings";
import { EmailValidator, NumericValidator } from "../src/validator";
import { JsonObject, JsonObjectProperty } from "../src/jsonobject";
import { QuestionTextModel } from "../src/question_text";
import {
  QuestionMultipleTextModel,
  MultipleTextItemModel
} from "../src/question_multipletext";
import { QuestionMatrixModel } from "../src/question_matrix";
import { ISurvey, ISurveyData, SurveyElement } from "../src/base";
import { ItemValue } from "../src/itemvalue";
import { QuestionDropdownModel } from "../src/question_dropdown";
import { QuestionCheckboxModel } from "../src/question_checkbox";
import { QuestionRadiogroupModel } from "../src/question_radiogroup";
import { QuestionCommentModel } from "../src/question_comment";
import { QuestionFileModel } from "../src/question_file";
import { QuestionMatrixDropdownModel } from "../src/question_matrixdropdown";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { QuestionRatingModel } from "../src/question_rating";
import {
  CustomWidgetCollection,
  QuestionCustomWidget
} from "../src/questionCustomWidgets";
import { surveyCss } from "../src/defaultCss/cssstandard";
import { dxSurveyService } from "../src/dxSurveyService";
import { FunctionFactory } from "../src/functionsfactory";
import { QuestionExpressionModel } from "../src/question_expression";

export default QUnit.module("Survey");

QUnit.test("set data property", function(assert) {
  var survey = new SurveyModel();
  assert.deepEqual(survey.data, {}, "there is no data");
  survey.data = { strVal: "item1", intVal: 5 };
  assert.deepEqual(
    survey.data,
    { strVal: "item1", intVal: 5 },
    "set the object"
  );
  survey.data = null;
  assert.deepEqual(survey.data, {}, "clear data");
});
QUnit.test("Add two pages", function(assert) {
  var survey = new SurveyModel();
  survey.addPage(new PageModel("Page 1"));
  survey.addPage(new PageModel("Page 2"));
  assert.equal(survey.PageCount, 2, "Two pages");
});
QUnit.test("Current Page", function(assert) {
  var survey = new SurveyModel();
  survey.addPage(createPageWithQuestion("Page 1"));
  assert.equal(
    survey.currentPage,
    survey.pages[0],
    "the first page is  current"
  );
  survey.currentPage = null;
  assert.equal(
    survey.currentPage,
    survey.pages[0],
    "can't set curent page to null"
  );
  var sPage = createPageWithQuestion("new Page");
  survey.addPage(sPage);
  survey.currentPage = sPage;
  assert.equal(survey.currentPage, survey.pages[1], "second page is current");
  survey.pages.pop();
  assert.equal(
    survey.currentPage,
    survey.pages[0],
    "the first page is current after removing the current one"
  );
});
QUnit.test("Set number and name into currentPage property", function(assert) {
  var survey = new SurveyModel();
  survey.addPage(createPageWithQuestion("page1"));
  survey.addPage(createPageWithQuestion("page2"));
  survey.addPage(createPageWithQuestion("page3"));
  assert.equal(survey.currentPage.name, "page1", "The current page is page1");
  survey.currentPage = 1;
  assert.equal(
    survey.currentPage.name,
    "page2",
    "The current page is page2, set by number"
  );
  survey.currentPage = 4;
  assert.equal(
    survey.currentPage.name,
    "page2",
    "The current page is still page2, set by number that doesn't exist"
  );
  survey.currentPage = "page3";
  assert.equal(
    survey.currentPage.name,
    "page3",
    "The current page is page3, set by name"
  );
  survey.currentPage = "page5";
  assert.equal(
    survey.currentPage.name,
    "page3",
    "The current page is still page3, set by name that doesn't exist"
  );
});

QUnit.test("CurrentPageNo", function(assert) {
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
  assert.equal(
    survey.currentPageNo,
    0,
    "the first page is current after removing the current one"
  );
});
QUnit.test("Remove Page in design mode", function(assert) {
  var survey = new SurveyModel();
  survey.setDesignMode(true);
  survey.addPage(new PageModel("Page 1"));
  survey.addPage(new PageModel("Page 2"));
  assert.equal(survey.PageCount, 2, "Two pages");
  assert.equal(survey.currentPage.name, "Page 1", "the first page is  current");

  survey.removePage(survey.pages[0]);
  assert.equal(survey.PageCount, 1, "One page left");
  assert.equal(
    survey.currentPage.name,
    "Page 2",
    "the second page is  current"
  );
});
QUnit.test("Survey.onValueChanged event, #352", function(assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("page1");
  var q1 = <QuestionDropdownModel>page.addNewQuestion("dropdown", "q1");
  q1.choices = [1, 2, 3];
  q1.hasOther = true;
  var valueChangedCallCounter = 0;
  survey.onValueChanged.add(function(survey, options) {
    valueChangedCallCounter++;
  });
  assert.equal(valueChangedCallCounter, 0, "Nothing happens");
  q1.value = 1;
  assert.equal(valueChangedCallCounter, 1, "Set one value");
  q1.value = q1.otherItem.value;
  assert.equal(valueChangedCallCounter, 2, "Set other value");
  q1.comment = "new comment";
  assert.equal(valueChangedCallCounter, 3, "Set comment to other value");
});

QUnit.test("Do not show errors in display mode", function(assert) {
  var survey = twoPageSimplestSurvey();
  (<Question>survey.pages[0].questions[0]).isRequired = true;
  survey.mode = "display";
  survey.nextPage();
  assert.equal(
    survey.currentPage,
    survey.pages[1],
    "Can move into another page"
  );
});

QUnit.test("Check pages state on onValueChanged event", function(assert) {
  var survey = new SurveyModel({
    pages: [
      {
        name: "page1",
        elements: [
          {
            type: "radiogroup",
            name: "question1",
            isRequired: true,
            choices: ["1", "2"]
          }
        ]
      },
      {
        name: "page2",
        elements: [
          {
            type: "html",
            name: "question2",
            html: "hello"
          }
        ],
        visibleIf: '{question1} = "2"'
      }
    ]
  });

  survey.onValueChanged.add(() => {
    assert.notOk(survey.isLastPage);
  });
  assert.ok(survey.isLastPage);

  var q1 = survey.getQuestionByName("question1");
  q1.value = "2";
});

QUnit.test("Question is readOnly", function(assert) {
  var survey = twoPageSimplestSurvey();
  var q1 = <Question>(<Question>survey.pages[0].questions[0]);
  assert.equal(q1.isReadOnly, false, "check1. question is not readonly");
  q1.readOnly = true;
  assert.equal(q1.isReadOnly, true, "check2. question is  readonly now");
  q1.readOnly = false;
  survey.mode = "display";
  assert.equal(
    q1.isReadOnly,
    true,
    "check2. question is  readonly because survey in the display mode"
  );
});
QUnit.test("Do not show required error for readOnly questions", function(
  assert
) {
  var survey = twoPageSimplestSurvey();
  var page = survey.pages[0];
  var q1 = <Question>(<Question>page.questions[0]);
  q1.isRequired = true;
  assert.equal(page.hasErrors(), true, "There is a required error");
  q1.readOnly = true;
  assert.equal(
    page.hasErrors(),
    false,
    "There is no errors, the question is readOnly"
  );
});
QUnit.test("DO not change errors array on fireCallback = false", function(
  assert
) {
  var survey = twoPageSimplestSurvey();
  var page = survey.pages[0];
  var q1 = <Question>(<Question>page.questions[0]);
  q1.isRequired = true;
  assert.equal(page.hasErrors(false), true, "There is a required error");
  assert.equal(q1.errors.length, 0, "The errors array is empty");
  page.hasErrors(true);
  assert.equal(q1.errors.length, 1, "The errors array is not empty now");
});

QUnit.test("Do not show required error for value 0 and false, #345", function(
  assert
) {
  var survey = twoPageSimplestSurvey();
  var page = survey.pages[0];
  var q1 = <Question>(<Question>page.questions[0]);
  q1.isRequired = true;
  assert.equal(page.hasErrors(), true, "There is a required error");
  survey.setValue("question1", 0);
  assert.equal(q1.value, 0, "question1.value == 0");
  assert.equal(
    page.hasErrors(),
    false,
    "There is no errors, the question value is 0"
  );
  survey.setValue("question1", false);
  assert.equal(q1.value, false, "question1.value == false");
  assert.equal(
    page.hasErrors(),
    false,
    "There is no errors, the question value is false"
  );
  survey.setValue("question1", null);
  assert.equal(
    page.hasErrors(),
    true,
    "There is a required error, the question value is null"
  );
});
QUnit.test("Next, Prev, IsFirst and IsLast Page and progressText", function(
  assert
) {
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
QUnit.test("Next, Prev, Next", function(assert) {
  var survey = new SurveyModel();
  survey.addPage(createPageWithQuestion("Page 1"));
  survey.addPage(createPageWithQuestion("Page 2"));
  survey.addPage(createPageWithQuestion("Page 3"));
  assert.equal(survey.currentPage, survey.pages[0], "Initial page is  first");
  survey.nextPage();
  assert.equal(
    survey.currentPage,
    survey.pages[1],
    "After next the current page is  second"
  );
  survey.prevPage();
  assert.equal(
    survey.currentPage,
    survey.pages[0],
    "After the prev the current page is again first"
  );
  survey.nextPage();
  assert.equal(
    survey.currentPage,
    survey.pages[1],
    "After second next the current page is  second"
  );
});
QUnit.test("Survey state", function(assert) {
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
QUnit.test("Question Creator", function(assert) {
  var inst = QuestionFactory.Instance;
  inst.registerQuestion("question1", (name: string) => {
    return new Question(name);
  });
  inst.registerQuestion("question2", (name: string) => {
    return new Question(name);
  });
  assert.equal(
    inst.createQuestion("question1", "Q1").name,
    "Q1",
    "Create first type of question"
  );
  assert.equal(
    inst.createQuestion("question2", "Q2").name,
    "Q2",
    "Create second type of question"
  );
  assert.equal(
    inst.createQuestion("question3", "Q3"),
    null,
    "Create unexisting type of question"
  );
});
QUnit.test("Question Creator getAllQuestions", function(assert) {
  var inst = QuestionFactory.Instance;
  inst.registerQuestion("question3", (name: string) => {
    return new Question(name);
  });
  inst.registerQuestion("question4", (name: string) => {
    return new Question(name);
  });
  var names = inst.getAllTypes();
  assert.ok(names.indexOf("question3") > -1, "contains a new type");
});
QUnit.test("Add questions to page", function(assert) {
  var page = new PageModel("Page 1");
  page.addNewQuestion("text", "Q1");
  page.addNewQuestion("checkbox", "Q2");
  assert.equal(page.questions.length, 2, "Two questions");
  assert.equal(page.questions[0].getType(), "text", "Text question");
  assert.equal(page.questions[1].getType(), "checkbox", "Checkbox question");
});
QUnit.test("Survey.getQuestionByName", function(assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("Page 1");
  page.addNewQuestion("text", "Q1");
  page.addNewQuestion("checkbox", "Q2");
  page = survey.addNewPage("Page 1");
  page.addNewQuestion("text", "Q3");
  page.addNewQuestion("checkbox", "Q4");

  assert.equal(
    survey.getQuestionByName("Q2").name,
    "Q2",
    "find question on the first page"
  );
  assert.equal(
    survey.getQuestionByName("Q3").name,
    "Q3",
    "find question on the second page"
  );
  assert.equal(survey.getQuestionByName("Q0"), null, "return null");
});
QUnit.test("Survey.getPanelByName", function(assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("Page1");
  var panel1 = page.addNewPanel("Panel1");
  page.addNewPanel("Panel2");
  panel1.addNewPanel("Panel1_1");
  page = survey.addNewPage("Page2");
  var panel3 = page.addNewPanel("Panel3");
  page.addNewPanel("Panel4");
  panel3.addNewPanel("Panel3_1");

  assert.equal(
    survey.getPanelByName("Panel2").name,
    "Panel2",
    "find panel on the first page"
  );
  assert.equal(
    survey.getPanelByName("panel3", true).name,
    "Panel3",
    "find question on the second page"
  );
  assert.equal(
    survey.getPanelByName("Panel1_1").name,
    "Panel1_1",
    "find child panel on the first page"
  );
  assert.equal(
    survey.getPanelByName("panel3_1", true).name,
    "Panel3_1",
    "find child question on the second page"
  );
  assert.equal(survey.getPanelByName("NoPanel"), null, "return null");
});
QUnit.test("Survey.getPageByQuestion/getPageByElement", function(assert) {
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
QUnit.test("Add/remove panel", function(assert) {
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
QUnit.test("Remove element from nested panel, #321", function(assert) {
  var survey = new SurveyModel();
  var page1 = survey.addNewPage("page1");
  var panel1 = page1.addNewPanel("panel1");
  var q1 = panel1.addNewQuestion("text", "q1");
  assert.equal(panel1.elements.length, 1, "There is one question in the panel");
  page1.removeElement(q1);
  assert.equal(panel1.elements.length, 0, "There no questions in the panel");
});
QUnit.test("Add panel with questions", function(assert) {
  var survey = new SurveyModel();
  var page1 = survey.addNewPage("page1");
  var panel1 = new PanelModel("panel1");
  var q1 = panel1.addNewQuestion("text", "q1");
  var panel2 = panel1.addNewPanel("panel2");
  var q2 = panel2.addNewQuestion("text", "q2");
  page1.addElement(panel1);
  assert.equal(
    panel1.data,
    survey,
    "The data is set correctly in the root panel"
  );
  assert.equal(
    q2.survey,
    survey,
    "The survey is set correctly in the question of the nested root"
  );
});
QUnit.test("SurveyData interface implementation", function(assert) {
  var surveyData: ISurveyData;
  surveyData = new SurveyModel();
  assert.equal(surveyData.getValue("test1"), null, "No data");
  assert.equal(surveyData.getValue("test2"), null, "No data");
  surveyData.setValue("test1", 1);
  surveyData.setValue("test2", "1");
  assert.equal(surveyData.getValue("test1"), 1, "Has value 1");
  assert.equal(surveyData.getValue("test2"), "1", "Has value '1'");
});
QUnit.test("Store question value in the survey", function(assert) {
  var survey = new SurveyModel();
  survey.addPage(new PageModel("Page 1"));
  var question = <Question>survey.pages[0].addNewQuestion("text", "question");
  assert.equal(survey.getValue("question"), null, "No value");
  assert.equal(question.value, null, "No value");

  question.value = "mytext";
  assert.equal(
    survey.getValue("question"),
    "mytext",
    "set value from question"
  );
  assert.equal(question.value, "mytext", "set value from question");

  survey.setValue("question", "myNewtext");
  assert.equal(
    survey.getValue("question"),
    "myNewtext",
    "set value from survey"
  );
  assert.equal(question.value, "myNewtext", "set value from survey");
});
QUnit.test("Store comments in the survey", function(assert) {
  var survey = new SurveyModel();
  survey.addPage(new PageModel("Page 1"));
  var question = <Question>survey.pages[0].addNewQuestion("text", "question");
  assert.equal(survey.getComment("question"), "", "Comment is empty");
  assert.equal(question.comment, "", "Comment is empty");

  question.comment = "myComment";
  assert.equal(
    survey.getComment("question"),
    "myComment",
    "set comment from question"
  );
  assert.equal(question.comment, "myComment", "set comment from question");

  survey.setComment("question", "myNewComment");
  assert.equal(
    survey.getComment("question"),
    "myNewComment",
    "set comment from survey"
  );
  assert.equal(question.comment, "myNewComment", "set comment from survey");
});
QUnit.test(
  "Should set required questions before go on the  next page or finish",
  function(assert) {
    var survey = twoPageSimplestSurvey();
    assert.notEqual(survey, null, "Survey is not  null");
    (<Question>survey.pages[0].questions[0]).isRequired = true;

    assert.equal(survey.nextPage(), false, "Can not go to the next page");
    assert.equal(
      survey.pages[0].questions[0].hasErrors(),
      true,
      "The question is not filled out."
    );
    assert.equal(
      survey.pages[0].hasErrors(),
      true,
      "The page is not filled out."
    );
    (<Question>survey.pages[0].questions[0]).value = "Test";

    assert.equal(survey.nextPage(), true, "Can go to the next page");
    assert.equal(
      survey.pages[0].questions[0].hasErrors(),
      false,
      "The question is filled out."
    );
    assert.equal(survey.pages[0].hasErrors(), false, "The page is filled out.");
  }
);
QUnit.test("survey.checkErrorsMode = 'onValueChanged'", function(assert) {
  var survey = twoPageSimplestSurvey();
  assert.notEqual(survey, null, "Survey is not  null");
  var question = <Question>survey.pages[0].questions[0];
  question.validators.push(new EmailValidator());
  survey.checkErrorsMode = "onValueChanged";
  assert.equal(question.errors.length, 0, "there is no errrors yet");
  survey.setValue(question.name, "it is not e-mail");
  assert.equal(
    question.errors.length,
    1,
    "The error about invalid e-mail is generated"
  );
  survey.setValue(question.name, "a@a.co");
  assert.equal(question.errors.length, 0, "The is not errors again");
});
QUnit.test(
  "survey.checkErrorsMode = 'onValueChanged', load from json + defaultValue",
  function(assert) {
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
                  type: "email"
                }
              ]
            }
          ]
        }
      ]
    };
    var survey = new SurveyModel(json);
    var question = <Question>survey.getQuestionByName("q1");
    assert.equal(
      question.errors.length,
      1,
      "The error about invalid e-mail is generated"
    );
  }
);
QUnit.test("Should not be errors after prevPage bug#151", function(assert) {
  var survey = new SurveyModel();
  survey.goNextPageAutomatic = true;
  var page = survey.addNewPage("page1");
  var question = <QuestionDropdownModel>page.addNewQuestion("dropdown", "q1");
  question.choices = [1, 2, 3];
  question.isRequired = true;
  page = survey.addNewPage("page2");
  page.addNewQuestion("text", "q2");

  survey.nextPage();
  assert.equal(question.errors.length, 1, "The question is not filled out.");
  question.value = 1;
  assert.equal(question.errors.length, 0, "The question has not errors");
  assert.equal(
    survey.currentPage.name,
    survey.pages[1].name,
    "Go to the next page"
  );
  survey.prevPage();
  assert.equal(question.errors.length, 0, "The question has not errors");
});

QUnit.test(
  "Invisible required questions should not be take into account",
  function(assert) {
    var survey = twoPageSimplestSurvey();
    assert.notEqual(survey, null, "Survey is not  null");
    (<Question>survey.pages[0].questions[0]).isRequired = true;
    assert.equal(survey.nextPage(), false, "Can not go to the next page");
    survey.pages[0].questions[0].visible = false;
    assert.equal(survey.nextPage(), true, "You can go to the next page now.");
  }
);
QUnit.test("onValueChanged event", function(assert) {
  var survey = twoPageSimplestSurvey();
  var name = "";
  var newValue = null;
  var counter = 0;
  survey.onValueChanged.add(function(sender: SurveyModel, options: any) {
    name = options.name;
    newValue = options.value;
    counter++;
  });
  survey.setValue("question1", "value1");
  assert.equal(
    name,
    "question1",
    "onValueChanged event, property name is correct"
  );
  assert.equal(
    newValue,
    "value1",
    "onValueChanged event, property newValue is correct"
  );
  assert.equal(counter, 1, "onValueChanged event is called one time");
  (<Question>survey.pages[0].questions[0]).value = "val";
  assert.equal(counter, 2, "onValueChanged event is called one time");
});
QUnit.test("onValueChanged event - do not call on equal value", function(
  assert
) {
  var survey = new SurveyModel();
  var counter = 0;
  survey.onValueChanged.add(function(sender: SurveyModel, options: any) {
    counter++;
  });
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
QUnit.test(
  "onValueChanged event is not called on changing matrix value",
  function(assert) {
    var survey = twoPageSimplestSurvey();
    var matrixQuestion = new QuestionMatrixModel("matrix");
    survey.pages[0].addQuestion(matrixQuestion);
    matrixQuestion.columns = ["col1", "col2"];
    matrixQuestion.rows = ["row1", "row2"];
    var name = "";
    var newValue = null;
    var counter = 0;
    survey.onValueChanged.add(function(sender: SurveyModel, options: any) {
      name = options.name;
      newValue = options.value;
      counter++;
    });
    matrixQuestion.visibleRows[0].value = "col2";
    assert.equal(counter, 1, "onValueChanged event is called one time");
    assert.equal(
      name,
      "matrix",
      "onValueChanged event, property name is correct"
    );
    assert.deepEqual(
      newValue,
      { row1: "col2" },
      "onValueChanged event, property newValue is correct"
    );
  }
);
QUnit.test(
  "onValueChanged event is not called on changing multi text value",
  function(assert) {
    var survey = twoPageSimplestSurvey();
    var multiTextQuestion = new QuestionMultipleTextModel("multitext");
    survey.pages[0].addQuestion(multiTextQuestion);
    multiTextQuestion.items.push(new MultipleTextItemModel("item1"));
    multiTextQuestion.items.push(new MultipleTextItemModel("item2"));
    var name = "";
    var newValue = null;
    var counter = 0;
    survey.onValueChanged.add(function(sender: SurveyModel, options: any) {
      name = options.name;
      newValue = options.value;
      counter++;
    });
    multiTextQuestion.items[1].value = "text1";
    assert.equal(counter, 1, "onValueChanged event is called one time");
    assert.equal(
      name,
      "multitext",
      "onValueChanged event, property name is correct"
    );
    assert.deepEqual(
      newValue,
      { item2: "text1" },
      "onValueChanged event, property newValue is correct"
    );
  }
);
QUnit.test("onValueChanging event", function(assert) {
  var survey = twoPageSimplestSurvey();
  var name = "";
  var questionName = "";
  var newValue = null;
  var counter = 0;
  survey.onValueChanging.add(function(sender: SurveyModel, options: any) {
    name = options.name;
    questionName = !!options.question ? options.question.name : "";
    newValue = options.value;
    if(options.value = "value0") options.value = "value";
    counter++;
  });
  survey.setValue("question1", "value1");
  assert.equal(
    name,
    "question1",
    "onValueChanging event, property name is correct"
  );
  assert.equal(
    questionName,
    "question1",
    "onValueChanging event, property question is correct"
  );
  assert.equal(
    newValue,
    "value1",
    "onValueChanging event, property newValue is correct"
  );
  assert.equal(counter, 1, "onValueChanging event is called one time");
  (<Question>survey.pages[0].questions[0]).value = "val";
  assert.equal(counter, 2, "onValueChanging event is called two time");
  survey.setValue("q1", "val");
  assert.equal(counter, 3, "onValueChanging event is called three time");
  survey.setValue("q1", "value0");
  assert.equal(survey.getValue("q1"), "value", "onValueChanging event allows to change value");
});
QUnit.test("adding, inserting Multiple Text Item correctly", function(assert) {
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
QUnit.test("Multiple Text required items", function(assert) {
  var survey = twoPageSimplestSurvey();
  var multiTextQuestion = new QuestionMultipleTextModel("multitext");
  survey.pages[0].addQuestion(multiTextQuestion);
  var item1 = multiTextQuestion.addItem("item1");
  var item2 = multiTextQuestion.addItem("item2");
  item1.isRequired = true;
  assert.equal(item1.fullTitle, "* item1", "Add isRequired Text");
  assert.equal(item2.fullTitle, "item2", "there is no isRequired Text");
  assert.equal(
    multiTextQuestion.hasErrors(),
    true,
    "item1 is required and it is empty"
  );
  item1.value = 1;
  assert.equal(
    multiTextQuestion.hasErrors(),
    false,
    "item1 is required and it has a value"
  );
});
QUnit.test("onComplete event", function(assert) {
  var survey = twoPageSimplestSurvey();
  var counter = 0;
  survey.onComplete.add(function() {
    counter++;
  });
  survey.nextPage();
  survey.nextPage();
  survey.completeLastPage();
  assert.equal(survey.state, "completed", "The survey is completed");
  assert.equal(counter, 1, "onComplete calls one time");
});
QUnit.test("onVisibleChanged event", function(assert) {
  var survey = twoPageSimplestSurvey();
  var name = "";
  var visibility = true;
  var counter = 0;
  survey.onVisibleChanged.add(function(sender: SurveyModel, options: any) {
    name = options.name;
    visibility = options.visible;
    counter++;
  });
  survey.getQuestionByName("question1").visible = false;

  assert.equal(
    name,
    "question1",
    "onVisibleChanged event, property name is correct"
  );
  assert.equal(
    visibility,
    false,
    "onVisibleChanged event, property visibility is correct"
  );
  assert.equal(counter, 1, "onVisibleChanged event is called one time");

  survey.getQuestionByName("question1").visible = true;
  assert.equal(
    name,
    "question1",
    "onVisibleChanged event, property name is correct"
  );
  assert.equal(
    visibility,
    true,
    "onVisibleChanged event, property visibility is correct"
  );
  assert.equal(counter, 2, "onVisibleChanged event is called two time");

  survey.getQuestionByName("question1").visible = true;
  assert.equal(counter, 2, "onVisibleChanged event is called two time");
});
QUnit.test("Question visibleIndex", function(assert) {
  var survey = twoPageSimplestSurvey();
  assert.equal(
    (<Question>survey.getQuestionByName("question1")).visibleIndex,
    0,
    "the first question"
  );
  assert.equal(
    (<Question>survey.getQuestionByName("question3")).visibleIndex,
    2,
    "the third question"
  );
  survey.getQuestionByName("question1").visible = false;
  assert.equal(
    (<Question>survey.getQuestionByName("question3")).visibleIndex,
    1,
    "the third question is now visible as second"
  );
  survey.showQuestionNumbers = "off";
  assert.equal(
    (<Question>survey.getQuestionByName("question1")).visibleIndex,
    -1,
    "off:the first question"
  );
  assert.equal(
    (<Question>survey.getQuestionByName("question2")).visibleIndex,
    -1,
    "off:the second question"
  );
  assert.equal(
    (<Question>survey.getQuestionByName("question3")).visibleIndex,
    -1,
    "off:the third question"
  );
  survey.showQuestionNumbers = "onPage";
  assert.equal(
    (<Question>survey.getQuestionByName("question1")).visibleIndex,
    -1,
    "onPage:the first question"
  );
  assert.equal(
    (<Question>survey.getQuestionByName("question2")).visibleIndex,
    0,
    "onPage:the second question"
  );
  assert.equal(
    (<Question>survey.getQuestionByName("question3")).visibleIndex,
    0,
    "onPage:the third question"
  );
});
QUnit.test("Question visibleIndex, add-remove questions", function(assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("p1");
  var q1 = new QuestionTextModel("q1");
  page.elements.push(q1);
  page.elements.push(new QuestionTextModel("q2"));
  assert.equal(
    (<Question>survey.getQuestionByName("q1")).visibleIndex,
    0,
    "the first question"
  );
  assert.equal(
    (<Question>survey.getQuestionByName("q2")).visibleIndex,
    1,
    "the second question"
  );
  var q3 = new QuestionTextModel("q3");
  page.elements.splice(0, 1, q3);
  assert.equal(
    (<Question>survey.getQuestionByName("q3")).visibleIndex,
    0,
    "the first question"
  );
  assert.equal(
    (<Question>survey.getQuestionByName("q2")).visibleIndex,
    1,
    "the second question"
  );
});
QUnit.test(
  "Question visibleIndex in onVisibleChanged event, containers",
  function(assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("page1");
    var panel = page.addNewPanel("panel1");
    var question = panel.addNewQuestion("text", "q1");
    question.visible = false;
    question.visibleIf = "{state} = 1";
    var visibleIndex = -1;
    survey.onVisibleChanged.add(function(sender, options) {
      visibleIndex = options.question.visibleIndex;
    });
    survey.setValue("state", 1);
    //question.visible = true;
    assert.equal(visibleIndex, 0, "visible index should be 0");
  }
);

QUnit.test("showQuestionNumbers - question fullTitle", function(assert) {
  var survey = twoPageSimplestSurvey();
  assert.equal(
    (<Question>survey.getQuestionByName("question1")).fullTitle,
    "1. question1",
    "the first question showQuestionNumbers=on"
  );
  assert.equal(
    (<Question>survey.getQuestionByName("question3")).fullTitle,
    "3. question3",
    "the thrid question showQuestionNumbers=on"
  );
  survey.showQuestionNumbers = "onPage";
  assert.equal(
    (<Question>survey.getQuestionByName("question1")).fullTitle,
    "1. question1",
    "the first question showQuestionNumbers=onPage"
  );
  assert.equal(
    (<Question>survey.getQuestionByName("question3")).fullTitle,
    "1. question3",
    "the thrid question showQuestionNumbers=onPage"
  );
  survey.showQuestionNumbers = "off";
  assert.equal(
    (<Question>survey.getQuestionByName("question1")).fullTitle,
    "question1",
    "the first question showQuestionNumbers=onPage"
  );
  assert.equal(
    (<Question>survey.getQuestionByName("question3")).fullTitle,
    "question3",
    "the thrid question showQuestionNumbers=onPage"
  );
});
QUnit.test("Question visibleIndex and no title question", function(assert) {
  var survey = twoPageSimplestSurvey();
  assert.equal(
    (<Question>survey.getQuestionByName("question1")).visibleIndex,
    0,
    "the first question"
  );
  assert.equal(
    (<Question>survey.getQuestionByName("question3")).visibleIndex,
    2,
    "the third question"
  );
  var question = new QuestionHtmlModel("html1");
  survey.pages[0].addQuestion(question, 0);
  assert.equal(
    (<Question>survey.getQuestionByName("html1")).visibleIndex,
    -1,
    "html question"
  );
  assert.equal(
    (<Question>survey.getQuestionByName("question1")).visibleIndex,
    0,
    "the first question + html question"
  );
  assert.equal(
    (<Question>survey.getQuestionByName("question3")).visibleIndex,
    2,
    "the third question + html question"
  );
});
QUnit.test("Pages visibleIndex and num", function(assert) {
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
  assert.equal(
    survey.pages[0].visibleIndex,
    -1,
    "page[0].visible=false:page 1"
  );
  assert.equal(survey.pages[1].visibleIndex, 0, "page[0].visible=false:page 2");
  assert.equal(survey.pages[2].visibleIndex, 1, "page[0].visible=false:page 3");
  assert.equal(survey.pages[0].num, -1, "page[0].visible=false:page 1, num");
  assert.equal(survey.pages[1].num, 1, "page[0].visible=false:page 2, num");
  assert.equal(survey.pages[2].num, 2, "page[0].visible=false:page 3, num");
});
QUnit.test("Pages num", function(assert) {
  var survey = twoPageSimplestSurvey();
  assert.equal(survey.pages[0].num, -1, "false:the first page");
  assert.equal(survey.pages[1].num, -1, "false:the second page");
  survey.showPageNumbers = true;
  assert.equal(survey.pages[0].num, 1, "true:the first page");
  assert.equal(survey.pages[1].num, 2, "true:the second page");
});
QUnit.test("Server validation", function(assert) {
  var survey = twoPageSimplestSurvey();
  var serverFunction = function(options) {
    if (options.data["question1"] && options.data["question1"] > 100) {
      options.errors["question1"] = "Question 1 should be higher than 100";
    }
    options.complete();
  };
  survey.onServerValidateQuestions.add(function(sender, options) {
    serverFunction(options);
  });
  survey.setValue("question1", 101);
  survey.nextPage();
  assert.equal(survey.currentPage.visibleIndex, 0, "Get server error");
  survey.setValue("question1", 10);
  survey.nextPage();
  assert.equal(survey.currentPage.visibleIndex, 1, "No errors server error");
});
QUnit.test("Server validation (old api version)", function(assert) {
  var survey = twoPageSimplestSurvey();
  var serverFunction = function(options) {
    if (options.data["question1"] && options.data["question1"] > 100) {
      options.errors["question1"] = "Question 1 should be higher than 100";
    }
    options.complete();
  };
  survey.onServerValidateQuestions = function(sender, options) {
    serverFunction(options);
  };
  survey.setValue("question1", 101);
  survey.nextPage();
  assert.equal(survey.currentPage.visibleIndex, 0, "Get server error");
  survey.setValue("question1", 10);
  survey.nextPage();
  assert.equal(survey.currentPage.visibleIndex, 1, "No errors server error");
});
QUnit.test("onVisibleChanged call validation", function(assert) {
  var survey = twoPageSimplestSurvey();
  survey.onValidateQuestion.add(function(sender, options) {
    if (options.name == "question1" && options.value > 100) {
      options.error = "Question 1 should be higher than 100";
    }
  });

  assert.equal(
    survey.isCurrentPageHasErrors,
    false,
    "There is no error if the value is empty"
  );
  survey.setValue("question1", 1);
  assert.equal(
    survey.isCurrentPageHasErrors,
    false,
    "the value is less than 100"
  );
  survey.setValue("question1", 101);
  assert.equal(
    survey.isCurrentPageHasErrors,
    true,
    "the value is more than 100, has errors"
  );
});
QUnit.test("onValidatePanel test", function(assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("page");
  var panel = page.addNewPanel("panel");
  var q1 = <QuestionTextModel>panel.addNewQuestion("text", "q1");
  var q2 = <QuestionTextModel>panel.addNewQuestion("text", "q2");
  survey.onValidatePanel.add(function(sender, options) {
    var panel = <PanelModel>options.panel;
    var pq1 = <QuestionTextModel>panel.getQuestionByName("q1");
    var pq2 = <QuestionTextModel>panel.getQuestionByName("q2");
    var sum = pq1.value + pq1.value;
    if (sum < 10 || pq1.isEmpty() || pq2.isEmpty())
      options.error = "q1+q2 should be more than 9";
    if (sum >= 100) options.error = "q1+q2 should be less than 100";
  });

  assert.equal(
    survey.isCurrentPageHasErrors,
    true,
    "failed, values are underfined : 10 < q1.value + q2.value < 100"
  );
  q1.value = 5;
  q2.value = 50;
  assert.equal(
    survey.isCurrentPageHasErrors,
    false,
    "passed: 5 + 50, 10 < q1.value + q2.value < 100"
  );
  q1.value = 55;

  assert.equal(
    survey.isCurrentPageHasErrors,
    true,
    "failed: 55 + 50, 10 < q1.value + q2.value < 100"
  );
});
QUnit.test(
  "isCurrentPageHasErrors, required question in the invisible panel, #325",
  function(assert) {
    var survey = twoPageSimplestSurvey();
    var panel = survey.pages[0].addNewPanel("panel");
    var requiredQuestion = <QuestionTextModel>panel.addNewQuestion(
      "text",
      "requriedQuestion"
    );
    requiredQuestion.isRequired = true;

    assert.equal(
      survey.isCurrentPageHasErrors,
      true,
      "requiredQuestion value is empty"
    );
    panel.visible = false;
    assert.equal(
      survey.isCurrentPageHasErrors,
      false,
      "requiredQuestion value is empty, but the parent panel is invisible"
    );
  }
);

QUnit.test("Page visibility", function(assert) {
  var page = new PageModel("page");
  assert.equal(
    page.isVisible,
    false,
    "page is invisible if there is no questions in it"
  );
  page.addNewQuestion("text", "q1");
  assert.equal(page.isVisible, true, "there is one question");
  page.visible = false;
  assert.equal(page.isVisible, false, "we made the page invisible");
  page.visible = true;
  assert.equal(page.isVisible, true, "we made the page visible");
  page.questions[0].visible = false;
  assert.equal(
    page.isVisible,
    false,
    "there is no visible questions on the page"
  );
  page.questions[0].visible = true;
  assert.equal(page.isVisible, true, "we have made the question visible again");
});
QUnit.test("Survey visiblePages and start using them", function(assert) {
  var survey = twoPageSimplestSurvey();
  assert.equal(survey.visiblePages.length, 2, "All pages are visible");
  assert.equal(survey.currentPage.name, "Page 1", "the first page is current");
  survey.pages[0].visible = false;
  assert.equal(
    survey.visiblePages.length,
    1,
    "The first page becomes invisible"
  );
  assert.equal(
    survey.currentPage.name,
    "Page 2",
    "the second page is current, because the first is invisible"
  );
});
QUnit.test(
  "Survey visiblePages, make second and third invisbile and go the last page on next",
  function(assert) {
    var survey = twoPageSimplestSurvey();
    survey.currentPage = survey.pages[0];
    survey.addNewPage("Page 3").addNewQuestion("text", "p3q1");
    survey.addNewPage("Page 4").addNewQuestion("text", "p4q1");
    survey.pages[1].visible = false;
    survey.pages[2].questions[0].visible = false;
    survey.nextPage();
    assert.equal(
      survey.currentPage.name,
      "Page 4",
      "Bypass two invisible pages"
    );
  }
);
QUnit.test("Visible trigger test", function(assert) {
  var survey = twoPageSimplestSurvey();
  var trigger = new SurveyTriggerVisible();
  survey.triggers.push(trigger);
  trigger.name = "question1";
  trigger.value = "Hello";
  trigger.pages = ["Page 2"];
  trigger.questions = ["question2"];

  survey.setValue("question1", "H");
  assert.equal(
    survey.getQuestionByName("question2").visible,
    false,
    "It is invisible now"
  );
  assert.equal(survey.pages[1].visible, false, "It is invisible now");

  survey.setValue("question1", "Hello");
  assert.equal(
    survey.getQuestionByName("question2").visible,
    true,
    "trigger makes it visible"
  );
  assert.equal(survey.pages[1].visible, true, "trigger makes it visible");

  survey.setValue("question2", "He");
  assert.equal(
    survey.getQuestionByName("question2").visible,
    true,
    "trigger should not be called"
  );
  assert.equal(survey.pages[1].visible, true, "trigger should not be called");
});
QUnit.test("Complete trigger test", function(assert) {
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
QUnit.test("Complete trigger + matrix test", function(assert) {
  var survey = twoPageSimplestSurvey();
  var matrix = <QuestionMatrixModel>survey.pages[0].addNewQuestion(
    "matrix",
    "matrix"
  );
  matrix.rows = ["row 1", "row 2"];
  matrix.columns = ["column 1", "column 2"];
  var trigger = new SurveyTriggerComplete();
  survey.triggers.push(trigger);
  trigger.name = "matrix.row 1";
  trigger.value = "column 2";

  survey.setValue("matrix", { "row 1": "column 1" });
  assert.equal(survey.state, "running");

  survey.setValue("matrix", { "row 1": "column 2" });
  assert.equal(survey.state, "running");
  survey.nextPage();
  assert.equal(survey.state, "completed");
});
QUnit.test("survey.onCurrentPageChanging", function(assert) {
  var survey = twoPageSimplestSurvey();
  var changingOldPage = null;
  var changingNewPage = null;
  var changingCounter = 0;
  var changingBeforeChanged = 0;
  var page = survey.currentPage;
  survey.onCurrentPageChanging.add(function(survey, options) {
    changingOldPage = options.oldCurrentPage;
    changingNewPage = options.newCurrentPage;
    changingCounter++;
    changingBeforeChanged = 1;
  });
  survey.onCurrentPageChanged.add(function(surey, options) {
    if (changingBeforeChanged == 1) {
      changingBeforeChanged = 2;
    }
  });
  survey.nextPage();
  assert.equal(
    changingOldPage.name,
    "Page 1",
    "first nextPage: oldCurrentPage"
  );
  assert.equal(
    changingNewPage.name,
    "Page 2",
    "first nextPage: newCurrentPage"
  );
  assert.equal(changingCounter, 1, "first nextPage: called one time");
  assert.equal(
    changingBeforeChanged,
    2,
    "first nextPage: called before changed"
  );
  survey.prevPage();
  assert.equal(
    changingOldPage.name,
    "Page 2",
    "first prevPage: oldCurrentPage"
  );
  assert.equal(
    changingNewPage.name,
    "Page 1",
    "first prevPage: newCurrentPage"
  );
  assert.equal(changingCounter, 2, "first prevPage: called two time");
  assert.equal(
    changingBeforeChanged,
    2,
    "first prevPage: called before changed"
  );
});

QUnit.test("survey.onCurrentPageChanging, allowChanging option", function(
  assert
) {
  var survey = twoPageSimplestSurvey();
  //get current Page
  survey.currentPage;
  var allowChanging = false;
  survey.onCurrentPageChanging.add(function(survey, options) {
    options.allowChanging = allowChanging;
  });
  assert.equal(survey.currentPageNo, 0, "The first page");
  survey.nextPage();
  assert.equal(survey.currentPageNo, 0, "Still the first page");
  allowChanging = true;
  survey.nextPage();
  assert.equal(survey.currentPageNo, 1, "The second page");
  allowChanging = false;
  survey.prevPage();
  assert.equal(survey.currentPageNo, 1, "Still the second page");
  allowChanging = true;
  survey.prevPage();
  assert.equal(survey.currentPageNo, 0, "The second page again");
});

QUnit.test("survey.onCompleting, allowComplete option", function(assert) {
  var survey = twoPageSimplestSurvey();
  var allowComplete = false;
  survey.onCompleting.add(function(survey, options) {
    options.allowComplete = allowComplete;
  });
  assert.equal(survey.state, "running", "It is running");
  survey.doComplete();
  assert.equal(survey.state, "running", "It is still running");
  allowComplete = true;
  survey.doComplete();
  assert.equal(survey.state, "completed", "It is completed now");
});

QUnit.test(
  "Complete trigger, onCurrentPageChange calls after onComplete, Bug#963",
  function(assert) {
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
    survey.onCurrentPageChanged.add(function(survey, options) {
      if (!firstFiredEvent) firstFiredEvent = "onCurrentPageChanged";
      onCurrentPageChangedCounter++;
    });
    survey.onComplete.add(function(survey, options) {
      if (!firstFiredEvent) firstFiredEvent = "onComplete";
      onCompleteCounter++;
    });

    survey.nextPage();
    assert.equal(onCompleteCounter, 1, "onComplete fired one time");
    assert.equal(
      onCurrentPageChangedCounter,
      0,
      "onCurrentPageChanged fired one time"
    );
    assert.equal(firstFiredEvent, "onComplete", "should be called first");
  }
);
QUnit.test("Value trigger test", function(assert) {
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
QUnit.test("RunExpression trigger test", function(assert) {
  var survey = twoPageSimplestSurvey();
  survey.setValue("val1", 3);
  survey.setValue("val2", 2);
  var trigger = new SurveyTriggerRunExpression();
  survey.triggers.push(trigger);
  trigger.expression = "{question1} = 'Hello'";
  trigger.setToName = "name1";
  trigger.runExpression = "{val1} + {val2}";
  assert.equal(survey.getValue("name1"), null, "value is not set");
  survey.setValue("question1", "Hello");
  assert.equal(survey.getValue("name1"), 5, "value is set as expression");
  survey.setValue("question1", "Hello1");
  trigger.runExpression = "{val2}";
  survey.clearValue("val2");
  trigger.setToName = "";
  survey.setValue("question1", "Hello");
  assert.equal(survey.getValue("name1"), 5, "value is still 5");
});

QUnit.test("Copy value trigger test", function(assert) {
  var survey = twoPageSimplestSurvey();
  var trigger = new SurveyTriggerCopyValue();
  survey.triggers.push(trigger);
  trigger.name = "question1";
  trigger.value = "Hello";

  trigger.setToName = "question2";
  trigger.fromName = "question3";
  survey.setValue("question3", "CopiedValue");

  assert.equal(survey.getValue("question2"), null, "value is not set");
  survey.setValue("question1", "Hello");
  assert.equal(survey.getValue("question2"), "CopiedValue", "value is set");
});
QUnit.test("String format", function(assert) {
  var strResult = surveyLocalization.getString("textMinLength")["format"](10);
  assert.equal(
    strResult,
    "Please enter at least 10 characters.",
    "The format string is working"
  );
});
QUnit.test("Serialize email validator", function(assert) {
  var validator = new EmailValidator();
  var json = new JsonObject().toJsonObject(validator);
  assert.ok(json, "Convert to Json Successful");
  var newValidator = {};
  new JsonObject().toObject(json, newValidator);
  assert.ok(newValidator, "Convert from Json Successful");
});
QUnit.test("pre process title", function(assert) {
  var survey = twoPageSimplestSurvey();
  survey.data = { name: "John" };
  survey.title = "Hello {name}";
  assert.equal(
    survey.processedTitle,
    "Hello John",
    "process survey title correctly"
  );
  survey.pages[0].title = "Page {PageNo} from {PageCount}.";
  assert.equal(survey.pages[0].processedTitle, "Page 1 from 2.");
  survey.pages[0].addNewQuestion("text", "email");
  survey.setValue("email", "andrew.telnov@gmail.com");
  survey.setVariable("var1", "[it is var1]");
  survey.setValue("val1", "[it is val1]");
  survey.completedHtml = "<div>Your e-mail: <b>{email}</b>{var1}{val1}</div>";
  assert.equal(
    survey.processedCompletedHtml,
    "<div>Your e-mail: <b>andrew.telnov@gmail.com</b>[it is var1][it is val1]</div>"
  );
});

QUnit.test("pre process title, 'locale' variable", function(assert) {
  var survey = twoPageSimplestSurvey();
  survey.title = "The current locale is: '{locale}'";
  assert.equal(
    survey.processedTitle,
    "The current locale is: 'en'",
    "process the locale correctly"
  );
  survey.locale = "fr";
  assert.equal(
    survey.processedTitle,
    "The current locale is: 'fr'",
    "process the locale correctly again"
  );
});

QUnit.test(
  "pre process title with variables in Capital letters, bug#1099",
  function(assert) {
    var survey = new SurveyModel();
    survey.setVariable("Var1", "[My variable]");
    survey.completedHtml = "Your Var1 is: {VaR1}";
    assert.equal(survey.processedCompletedHtml, "Your Var1 is: [My variable]");
  }
);

QUnit.test("pre process completedHtml nested properties and arrays", function(
  assert
) {
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
  dynamicMatrix.value = [{ col1: 1 }, { col2: 2017 }];

  survey.completedHtml = "{mt.t2}:{matrix[1].col2}";
  assert.equal(survey.processedCompletedHtml, "Year:2017");
});

QUnit.test("question fullTitle", function(assert) {
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
QUnit.test("clearInvisibleValues", function(assert) {
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
QUnit.test(
  "clearInvisibleValues is onComplete (default value), visible and invisible questions with the same valueName, #898",
  function(assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("page");
    var q1 = <QuestionTextModel>page.addNewQuestion("text", "q1");
    var q2 = <QuestionTextModel>page.addNewQuestion("text", "q2");
    q1.valueName = "value";
    q2.valueName = "value";
    q1.value = 1;
    q2.visible = false;
    survey.doComplete();
    assert.deepEqual(survey.data, { value: 1 }, "The value should be keeped");
    survey.clear();
    q1.value = 2;
    q1.visible = false;
    survey.doComplete();
    assert.deepEqual(survey.data, {}, "The value should be cleaned");
  }
);
QUnit.test("clearInvisibleValues - comments and other values, #309", function(
  assert
) {
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
  assert.notDeepEqual(survey.data, { q3: "val3" }, "There are many vlues yet");
  survey.doComplete();
  assert.deepEqual(
    survey.data,
    { q3: "val3" },
    "There should be one value only"
  );
});
QUnit.test(
  "Do not store others value if others is not selected, #311",
  function(assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("p1");
    var q1 = <QuestionDropdownModel>page.addNewQuestion("dropdown", "q1");
    q1.hasOther = true;
    q1.value = q1.otherItem.value;
    q1.comment = "comment1";
    q1.value = 1;
    assert.notDeepEqual(survey.data, { q1: 1 }, "There is a comment yet");
    survey.doComplete();
    assert.deepEqual(survey.data, { q1: 1 }, "There no comment");
  }
);
QUnit.test("merge values", function(assert) {
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
function percentageToNum(width: string): Number {
  width = width.replace("%", "");
  return parseFloat(width);
}
QUnit.test("Several questions in one row", function(assert) {
  var page = new PageModel();
  for (var i = 0; i < 10; i++) page.addNewQuestion("text", "q" + (i + 1));
  assert.equal(page.rows.length, 10, "10 rows for each question");

  page = new PageModel();
  for (var i = 0; i < 10; i++) page.addNewQuestion("text", "q" + (i + 1));
  page.questions[0].startWithNewLine = false;
  assert.equal(page.rows.length, 10, "still 10 rows for each question");
  assert.equal(
    percentageToNum(page.rows[0].elements[0].renderWidth),
    100,
    "the render width is 100%"
  );

  page = new PageModel();
  for (var i = 0; i < 10; i++) page.addNewQuestion("text", "q" + (i + 1));
  for (var i = 0; i < 10; i++) {
    page.questions[i].startWithNewLine = i % 2 == 0;
  }
  assert.equal(
    page.rows.length,
    5,
    "every second has startWithNewLine equals false, there 5 rows now"
  );
  for (var i = 0; i < 5; i++) {
    assert.equal(
      page.rows[i].elements.length,
      2,
      "two questions for every row"
    );
    assert.equal(
      percentageToNum(page.rows[i].elements[0].renderWidth),
      50,
      "the render width is 50%"
    );
    assert.equal(page.rows[i].elements[0].rightIndent, 1, "the indent is 1");
    assert.equal(
      percentageToNum(page.rows[i].elements[1].renderWidth),
      50,
      "the render width is 50%"
    );
    assert.equal(page.rows[i].elements[1].rightIndent, 0, "the indent is 0");
  }
});
QUnit.test("test goNextPageAutomatic property", function(assert) {
  var survey = twoPageSimplestSurvey();

  var dropDownQ = <QuestionDropdownModel>survey.pages[1].addNewQuestion(
    "dropdown",
    "question5"
  );
  dropDownQ.choices = [1, 2, 3];
  dropDownQ.hasOther = true;
  survey.goNextPageAutomatic = true;
  assert.equal(
    survey.currentPage.name,
    survey.pages[0].name,
    "the first page is default page"
  );
  survey.setValue("question1", 1);
  survey.setValue("question2", 2);
  assert.equal(
    survey.currentPage.name,
    survey.pages[1].name,
    "go to the second page automatically"
  );
  (<Question>survey.currentPage.questions[0]).value = "3";
  (<Question>survey.currentPage.questions[1]).value = "4";
  dropDownQ.value = dropDownQ.otherItem.value;
  assert.equal(
    survey.currentPage.name,
    survey.pages[1].name,
    "stay on the second page"
  );
  assert.notEqual(survey.state, "completed", "survey is still running");
  dropDownQ.comment = "other value";
  assert.equal(survey.state, "completed", "complete the survey");
});
QUnit.test(
  "test goNextPageAutomatic property - 'autogonext' - go next page automatically but do not submit",
  function(assert) {
    var survey = twoPageSimplestSurvey();

    var dropDownQ = <QuestionDropdownModel>survey.pages[1].addNewQuestion(
      "dropdown",
      "question5"
    );
    dropDownQ.choices = [1, 2, 3];
    dropDownQ.hasOther = true;
    survey.goNextPageAutomatic = "autogonext";
    assert.equal(
      survey.currentPage.name,
      survey.pages[0].name,
      "the first page is default page"
    );
    survey.setValue("question1", 1);
    survey.setValue("question2", 2);
    assert.equal(
      survey.currentPage.name,
      survey.pages[1].name,
      "go to the second page automatically"
    );
    (<Question>survey.currentPage.questions[0]).value = "3";
    (<Question>survey.currentPage.questions[1]).value = "4";
    dropDownQ.value = dropDownQ.otherItem.value;
    assert.equal(
      survey.currentPage.name,
      survey.pages[1].name,
      "stay on the second page"
    );
    assert.notEqual(survey.state, "completed", "survey is still running");
    dropDownQ.comment = "other value";
    assert.notEqual(survey.state, "completed", "survey is still running");
  }
);
QUnit.test("test goNextPageAutomatic after errors", function(assert) {
  var survey = twoPageSimplestSurvey();

  survey.goNextPageAutomatic = true;
  (<Question>survey.getQuestionByName("question2")).isRequired = true;
  assert.equal(
    survey.currentPage.name,
    survey.pages[0].name,
    "the first page is default page"
  );
  survey.setValue("question1", 1);
  survey.nextPage();
  assert.equal(
    survey.currentPage.name,
    survey.pages[0].name,
    "we are still on the first page. There are errors."
  );
  survey.setValue("question2", 2);
  assert.equal(
    survey.currentPage.name,
    survey.pages[1].name,
    "go to the second page automatically"
  );
});
QUnit.test(
  "goNextPageAutomatic: should not work for complex questions like matrix, checkbox, multiple text",
  function(assert) {
    var questions = [];
    questions.push({
      question: new QuestionCheckboxModel("check"),
      auto: false,
      value: [1]
    });
    questions.push({
      question: new QuestionRadiogroupModel("radio"),
      auto: true,
      value: 1
    });
    questions.push({
      question: new QuestionDropdownModel("dropdown"),
      auto: true,
      value: 1
    });
    questions.push({
      question: new QuestionCommentModel("comment"),
      auto: false,
      value: "1"
    });
    questions.push({
      question: new QuestionFileModel("file"),
      auto: false,
      value: "1"
    });
    questions.push({
      question: new QuestionFileModel("html"),
      auto: false,
      value: null
    });

    var matrix = new QuestionMatrixModel("matrix");
    matrix.rows = ["row1", "row2"];
    matrix.columns = ["col1", "col2"];
    questions.push({ question: matrix, auto: false, value: { row1: "col1" } });
    questions.push({
      question: matrix,
      auto: true,
      value: { row1: "col1", row2: "col1" }
    });

    var dropDownMatrix = new QuestionMatrixDropdownModel("matrixdropdown");
    dropDownMatrix.addColumn("col1");
    dropDownMatrix.rows = ["row1", "row2"];
    questions.push({
      question: dropDownMatrix,
      auto: false,
      value: { row1: { col1: 1 } }
    });
    questions.push({
      question: dropDownMatrix,
      auto: true,
      value: { row1: { col1: 1 }, row2: { col1: 2 } }
    });

    var dynamicMatrix = new QuestionMatrixDynamicModel("matrixdynamic");
    dynamicMatrix.addColumn("col1");
    dynamicMatrix.rowCount = 2;
    questions.push({
      question: dynamicMatrix,
      auto: false,
      value: [{ col1: 1 }]
    });
    questions.push({
      question: dynamicMatrix,
      auto: false,
      value: [{ col1: 1 }, { col1: 1 }]
    });

    var multipleText = new QuestionMultipleTextModel("multitext");
    multipleText.addItem("t1");
    multipleText.addItem("t2");
    questions.push({ question: multipleText, auto: false, value: { t1: "1" } });
    questions.push({
      question: multipleText,
      auto: true,
      value: { t1: "1", t2: "2" }
    });

    questions.push({
      question: new QuestionRatingModel("rating"),
      auto: true,
      value: 1
    });
    questions.push({
      question: new QuestionTextModel("text"),
      auto: true,
      value: "1"
    });

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
      assert.equal(
        survey.state,
        state,
        "goNextPageAutomatic is incorrect for question: " + q.question.name
      );
    }
  }
);
QUnit.test(
  "goNextPageAutomatic bug #200: https://github.com/surveyjs/surveyjs/issues/200",
  function(assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("page1");
    page.addNewQuestion("html", "q1");
    var q2 = <QuestionDropdownModel>page.addNewQuestion("dropdown", "q2");
    q2.choices = [1, 2, 3];
    page = survey.addNewPage("page2");
    page.addNewQuestion("text", "q3");
    survey.goNextPageAutomatic = true;
    (<Question>survey.getQuestionByName("q2")).value = 1;
    assert.equal(
      survey.currentPage.name,
      survey.pages[1].name,
      "go to the next page"
    );
  }
);

QUnit.test(
  "goNextPageAutomatic and clearInvisibleValues bug #252: https://github.com/surveyjs/surveyjs/issues/252",
  function(assert) {
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
  }
);

QUnit.test("goNextPageAutomatic and checkbox wiht valueName bug #70", function(
  assert
) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("page1");
  var q1 = <QuestionDropdownModel>page.addNewQuestion("checkbox", "q1");
  q1.valueName = "v"; //this line produce the issue
  q1.choices = [1, 2, 3];
  survey.goNextPageAutomatic = true;
  (<Question>survey.getQuestionByName("q1")).value = [1];
  assert.notEqual(survey.state, "completed", "it should not be completed");
});

QUnit.test("isNavigationButtonsShowing", function(assert) {
  var survey = twoPageSimplestSurvey();
  assert.equal(
    survey.isNavigationButtonsShowing,
    true,
    "by default buttons are shown"
  );
  survey.setDesignMode(true);
  assert.equal(
    survey.isNavigationButtonsShowing,
    false,
    "do not show buttons at design time"
  );
  survey.setDesignMode(false);
  assert.equal(
    survey.isNavigationButtonsShowing,
    true,
    "by default buttons are shown"
  );
  survey.showNavigationButtons = false;
  assert.equal(
    survey.isNavigationButtonsShowing,
    false,
    "showNavigationButtons = false"
  );
  survey.pages[0].navigationButtonsVisibility = "show";
  assert.equal(
    survey.isNavigationButtonsShowing,
    true,
    "navigationButtonsVisibility = 'show' && showNavigationButtons = false"
  );
  survey.showNavigationButtons = true;
  survey.pages[0].navigationButtonsVisibility = "hide";
  assert.equal(
    survey.isNavigationButtonsShowing,
    false,
    "navigationButtonsVisibility = 'hide' && showNavigationButtons = true"
  );
  survey.showNavigationButtons = true;
  survey.pages[0].navigationButtonsVisibility = "inherit";
  assert.equal(
    survey.isNavigationButtonsShowing,
    true,
    "navigationButtonsVisibility = 'inherit' && showNavigationButtons = true"
  );
});

QUnit.test("simple condition test", function(assert) {
  var survey = new SurveyModel({
    pages: [
      {
        name: "page1",
        questions: [
          { type: "checkbox", name: "q1", choices: ["yes", "no"] },
          { type: "checkbox", name: "q2", choices: ["yes", "no"] }
        ]
      },
      {
        name: "page2",
        visibleIf: "{q1} = 'yes' or {q2} = 'no'",
        questions: [
          {
            type: "text",
            name: "q3",
            visibleIf: "{q1} = 'yes' and {q2} = 'no'"
          },
          { type: "text", name: "q4" }
        ]
      }
    ]
  });
  var q3 = survey.getQuestionByName("q3");
  assert.equal(
    survey.pages[1].visible,
    false,
    "initially the page becomes invisible"
  );
  assert.equal(q3.visible, false, "initially q3 becomes invisible");
  survey.setValue("q1", "yes");
  survey.setValue("q2", "no");
  assert.equal(
    survey.pages[1].visible,
    true,
    "the page becomes visible, q1 = 'yes'"
  );
  assert.equal(
    q3.visible,
    true,
    "q3 becomes visible, q1 = 'yes' and q2 = 'no'"
  );
  survey.setValue("q2", "yes");
  assert.equal(
    survey.pages[1].visible,
    true,
    "the page becomes visible, q1 = 'yes'"
  );
  assert.equal(
    q3.visible,
    false,
    "q3 becomes invisible, q1 = 'yes' and q2 = 'yes'"
  );
  survey.setValue("q1", "no");
  assert.equal(
    survey.pages[1].visible,
    false,
    "the page becomes invisible, q1 = 'no'"
  );
  assert.equal(
    q3.visible,
    false,
    "q3becomes invisible, q1 = 'no' and q2 = 'yes'"
  );
});

QUnit.test("simple condition test, page visibility", function(assert) {
  var survey = new SurveyModel({
    pages: [
      {
        name: "page1",
        questions: [{ type: "checkbox", name: "q1", choices: ["yes", "no"] }]
      },
      {
        name: "page2",
        visibleIf: "{q1} contains 'yes'",
        questions: [{ type: "text", name: "q3" }]
      }
    ]
  });
  var page2 = survey.getPageByName("page2");
  assert.equal(page2.visible, false, "the initial page2 is invisible");
  survey.setValue("q1", ["yes"]);
  assert.equal(page2.visible, true, "the page becomes visible, q1 = 'yes'");
});
QUnit.test("Re-run condition on changing the variable", function(assert) {
  var survey = new SurveyModel({
    pages: [
      {
        name: "page1",
        questions: [{ type: "text", name: "q1", visibleIf: "{var1} = 1" }]
      }
    ]
  });
  var q1 = survey.getQuestionByName("q1");
  assert.equal(
    q1.isVisible,
    false,
    "var1 is not exists, question is invisible"
  );
  survey.setVariable("var1", 1);
  assert.equal(q1.isVisible, true, "var1 equals 1, question is visible");
  survey.setVariable("var1", 2);
  assert.equal(
    q1.isVisible,
    false,
    "var1 equals 2, question is not visible now"
  );
});

QUnit.test("visibleIf for question, call onPageVisibleChanged", function(
  assert
) {
  var survey = new SurveyModel({
    pages: [
      {
        name: "page1",
        questions: [{ type: "checkbox", name: "q1", choices: ["yes", "no"] }]
      },
      {
        name: "page2",
        questions: [
          { type: "text", name: "q3", visibleIf: "{q1} contains 'yes'" }
        ]
      }
    ]
  });
  var counter = 0;
  survey.onPageVisibleChanged.add(function() {
    counter++;
  });
  assert.equal(survey.pages[0].isVisible, true, "first page visible by children");
  assert.equal(survey.pages[1].isVisible, false, "second page is not visible by children");
  assert.equal(counter, 0, "nothing happens");
  survey.setValue("q1", ["yes"]);
  assert.equal(counter, 1, "calls one time");
  survey.setValue("q1", ["no"]);
  assert.equal(counter, 2, "calls second time");
  survey.setValue("q1", []);
  assert.equal(counter, 2, "nothing happens");
});
QUnit.test(
  "visibleIf, expression custom function has property this.survey",
  function(assert) {
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
      questions: [
        { type: "checkbox", name: "q1", choices: ["yes", "no"] },
        { type: "text", name: "q2", visibleIf: "isAllChecksSet('q1') == true" }
      ]
    });
    var q = survey.getQuestionByName("q2");
    assert.equal(q.isVisible, false, "all checks are unset");
    survey.setValue("q1", ["yes", "no"]);
    assert.equal(q.isVisible, true, "all checks are set");
    survey.setValue("q1", ["yes"]);
    assert.equal(q.isVisible, false, "not all checks are set");
    FunctionFactory.Instance.unregister("isAllChecksSet");
  }
);
QUnit.test("visibleIf, bug#729", function(assert) {
  var survey = new SurveyModel({
    questions: [
      {
        choices: [
          { value: "true", text: "Yes" },
          { value: "false", text: "No" }
        ],
        type: "radiogroup",
        name: "q1"
      },
      { type: "text", name: "q2", visibleIf: "{q1} = 'true'" }
    ]
  });
  var q1 = <Question>survey.getQuestionByName("q1");
  var q2 = survey.getQuestionByName("q2");
  assert.equal(q2.visible, false, "q2 is not visible by default");
  q1.value = "true";
  assert.equal(q2.visible, true, "q2 should be visible now");
  q1.value = "false";
  assert.equal(q2.visible, false, "q2 should be invisible again");
});
QUnit.test("enableIf for question", function(assert) {
  var survey = new SurveyModel({
    pages: [
      {
        name: "page1",
        questions: [
          { type: "checkbox", name: "q1", choices: ["yes", "no"] },
          { type: "text", name: "q2", enableIf: "{q1} contains 'yes'" }
        ]
      }
    ]
  });
  var q2 = <Question>survey.getQuestionByName("q2");
  assert.equal(q2.isReadOnly, true, "It is readonly initially");
  survey.setValue("q1", ["yes"]);
  assert.equal(q2.isReadOnly, false, "It is not readonly now");
});

QUnit.test("enableIf for matrix questions, Bug#736", function(assert) {
  var survey = new SurveyModel({
    questions: [
      {
        type: "matrixdropdown",
        name: "q1",
        columns: [
          { name: "using", choices: ["Yes", "No"], cellType: "radiogroup" }
        ],
        rows: [{ value: "angularv1" }]
      },
      {
        type: "matrixdropdown",
        name: "q2",
        columns: [
          { name: "using", choices: ["Yes", "No"], cellType: "radiogroup" }
        ],
        rows: [{ value: "angularv2" }, { value: "angularv4" }]
      }
    ]
  });
  var qVisible = null;
  var qEnable = null;
  survey.onMatrixCellCreated.add(function(survey, options) {
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
  assert.ok(qVisible, "visibleIf is set");
  assert.ok(qEnable, "enableIf is set");
  assert.equal(qVisible.visible, false, "The question is invisible on start");
  assert.equal(qEnable.readOnly, true, "The question is readOnly on start");
  rows1[0].cells[0].question.value = "Yes";
  assert.equal(qVisible.visible, true, "The question is visible now");
  assert.equal(qEnable.readOnly, false, "The question is enabled now");
});

QUnit.test(
  "isRequired test, empty array https://github.com/surveyjs/surveyjs/issues/362",
  function(assert) {
    var survey = new SurveyModel({
      pages: [
        {
          name: "page1",
          questions: [
            {
              type: "checkbox",
              isRequired: true,
              name: "q1",
              choices: ["yes", "no"]
            }
          ]
        }
      ]
    });

    var page1 = survey.getPageByName("page1");
    var q1 = <Question>(<Question>page1.questions[0]);
    q1.value = [];
    assert.equal(page1.hasErrors(), true, "There is a required error");
    q1.value = ["yes"];
    assert.equal(page1.hasErrors(), false, "There is no required error");
  }
);

QUnit.test("multiple triger on checkbox stop working.", function(assert) {
  var survey = new SurveyModel({
    pages: [
      {
        questions: [
          {
            type: "checkbox",
            name: "question1",
            choices: ["one", "two", "three"]
          },
          { type: "text", name: "question2", visible: false },
          { type: "text", name: "question3", visible: false },
          { type: "text", name: "question4", visible: false }
        ]
      }
    ],
    triggers: [
      {
        type: "visible",
        operator: "contains",
        value: "one",
        name: "question1",
        questions: ["question2"]
      },
      {
        type: "visible",
        operator: "contains",
        value: "two",
        name: "question1",
        questions: ["question3"]
      }
    ]
  });

  var check = <QuestionCheckboxModel>survey.getQuestionByName("question1");
  var value = ["one"];
  check.value = value;
  assert.equal(
    survey.getQuestionByName("question2").visible,
    true,
    "The second question is visible"
  );
  value.push("two");
  check.value = value;
  assert.equal(
    survey.getQuestionByName("question3").visible,
    true,
    "The third question is visible"
  );
});

QUnit.test(
  "QuestionCheckbox if single value set then convert it to array, #334",
  function(assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("page1");
    var q1 = <QuestionCheckboxModel>page.addNewQuestion("checkbox", "q1");
    survey.setValue("q1", [1]);
    assert.deepEqual(
      survey.getValue("q1"),
      [1],
      "survey.getValue returns array"
    );
    assert.deepEqual(q1.value, [1], "q1.value returns array");
    survey.setValue("q1", 1);
    assert.deepEqual(survey.getValue("q1"), 1, "survey.getValue return value");
    assert.deepEqual(q1.value, [1], "q1.value still returns array");
  }
);

QUnit.test("visibleIf and page rows", function(assert) {
  var survey = new SurveyModel({
    pages: [
      {
        name: "component",
        questions: [
          {
            type: "dropdown",
            choices: [
              { value: "app", text: "Application / Web" },
              { value: "database", text: "Database" }
            ],
            name: "component",
            title: "Component Type"
          },
          {
            type: "dropdown",
            choices: [
              { value: "windows", text: "Windows" },
              { value: "linux", text: "Linux" }
            ],
            name: "componentOs",
            title: "Which operating system are you using?",
            visible: false,
            visibleIf: "{component} = 'app' "
          },
          {
            type: "text",
            name: "question1",
            title: "Question 1",
            visible: false,
            visibleIf: "{component} = 'app' "
          },
          {
            type: "text",
            name: "question2",
            title: "Question 2",
            visible: false,
            visibleIf: "{component} = 'app' "
          },
          {
            type: "text",
            name: "database",
            title: "Database name",
            visible: false,
            visibleIf: "{component} = 'database' "
          }
        ]
      }
    ],
    questionTitleTemplate: "{title} {require}:",
    requiredText: "(*)",
    sendResultOnPageNext: true,
    showQuestionNumbers: "off"
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
QUnit.test("assign customWidgets to questions", function(assert) {
  CustomWidgetCollection.Instance.clear();
  CustomWidgetCollection.Instance.addCustomWidget({
    name: "first",
    isFit: question => {
      return question.name == "question2";
    }
  });
  CustomWidgetCollection.Instance.addCustomWidget({
    name: "second",
    isFit: question => {
      return (<Question>question).getType() == "checkbox";
    }
  });
  var survey = twoPageSimplestSurvey();
  survey.pages[0].addNewQuestion("checkbox", "question5");
  assert.equal(
    survey.currentPage,
    survey.pages[0],
    "the first page is choosen"
  );
  assert.equal(
    (<Question>survey.getQuestionByName("question1")).customWidget,
    null,
    "there is no custom widget for this question"
  );
  assert.equal(
    (<Question>survey.getQuestionByName("question2")).customWidget.name,
    "first",
    "has the first custom widget"
  );
  assert.equal(
    (<Question>survey.getQuestionByName("question5")).customWidget.name,
    "second",
    "has the second custom widget"
  );
  CustomWidgetCollection.Instance.clear();
});
QUnit.test("customWidgets activation types changed", function(assert) {
  CustomWidgetCollection.Instance.clear();
  var lastActivatedBy = "";
  var customWidgetJSON = {
    name: "widget1",
    isFit: question => {
      return question.name == "question2";
    },
    activatedByChanged: activatedBy => {
      lastActivatedBy = activatedBy;
    }
  };
  CustomWidgetCollection.Instance.addCustomWidget(customWidgetJSON);
  assert.equal(
    lastActivatedBy,
    "property",
    "activatedBy set to 'property' by default"
  );
  CustomWidgetCollection.Instance.setActivatedBy("widget1", "type");
  assert.equal(lastActivatedBy, "type", "activatedBy set to 'type'");
  CustomWidgetCollection.Instance.setActivatedBy("widget1", "customtype");
  assert.equal(
    lastActivatedBy,
    "customtype",
    "activatedBy set to 'customtype'"
  );
  CustomWidgetCollection.Instance.clear();
});

QUnit.test("assign customWidgets to matrix dynamic cell question", function(
  assert
) {
  CustomWidgetCollection.Instance.clear();
  CustomWidgetCollection.Instance.addCustomWidget({
    name: "first",
    isFit: question => {
      return question["renderAs"] === "testwidget";
    }
  });
  JsonObject.metaData.addProperty("matrixdropdowncolumn", "renderAs");
  JsonObject.metaData.addProperty("dropdown", {
    name: "renderAs",
    default: "standard",
    choices: ["standard", "chosen"]
  });

  var survey = new SurveyModel({
    questions: [
      {
        type: "matrixdynamic",
        name: "Grid",
        columns: [
          { name: "Type", cellType: "dropdown", renderAs: "testwidget" },
          { name: "Quantity", cellType: "text", inputType: "number" }
        ]
      }
    ]
  });
  var q = <QuestionMatrixDynamicModel>survey.getAllQuestions()[0];
  var rows = q.visibleRows;
  assert.equal(
    rows[0].cells[0].question.customWidget.name,
    "first",
    "the first cell has custom widget"
  );
  assert.equal(
    rows[0].cells[1].question.customWidget,
    null,
    "the second cell has no custom widget"
  );

  JsonObject.metaData.removeProperty("matrixdropdowncolumn", "renderAs");
  JsonObject.metaData.removeProperty("dropdown", "renderAs");
  CustomWidgetCollection.Instance.clear();
});

QUnit.test("customWidgets support displayValue", function(assert) {
  CustomWidgetCollection.Instance.clear();
  CustomWidgetCollection.Instance.addCustomWidget({
    name: "first",
    isFit: question => {
      return question.getType() == "text";
    },
    getDisplayValue: (question: Question): string => {
      if (question.value === 1) return "one";
      return null;
    }
  });
  var survey = twoPageSimplestSurvey();
  var question = survey.pages[0].addNewQuestion("text", "text");
  assert.equal(
    survey.currentPage,
    survey.pages[0],
    "the first page is choosen"
  );
  assert.equal(
    question.customWidget.name,
    "first",
    "has the first custom widget"
  );
  question.value = 1;
  assert.equal(
    question.displayValue,
    "one",
    "Use display value of custom widget"
  );
  CustomWidgetCollection.Instance.clear();
});

QUnit.test("customWidgets camel name", function(assert) {
  CustomWidgetCollection.Instance.clear();
  CustomWidgetCollection.Instance.addCustomWidget({
    name: "camelName",
    isFit: question => {
      return question.getType() == "camelname";
    }
  });
  if (!JsonObject.metaData.findClass("camelName")) {
    JsonObject.metaData.addClass("camelName", [], null, "text");
  }

  var survey = new SurveyModel({
    elements: [
      {
        type: "camelName",
        name: "q1"
      }
    ]
  });
  var question = <Question>survey.getQuestionByName("q1");
  assert.equal(
    question.customWidget.name,
    "camelName",
    "the custom custom widget is set"
  );
  CustomWidgetCollection.Instance.clear();
});

QUnit.test(
  "Set 0 value for text inputType=number from survey. Bug #267",
  function(assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("Page 1");
    page.addNewQuestion("text", "question1");
    var question = <QuestionTextModel>page.questions[0];
    question.inputType = "number";
    assert.strictEqual(question.value, undefined, "undefined initial value");
    question.value = "0";
    assert.strictEqual(question.value, 0, "zero value");
  }
);

QUnit.test("Survey Localization - check question.title", function(assert) {
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

QUnit.test(
  "Survey Localization - check page/panel.title and processedTitle",
  function(assert) {
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
  }
);

QUnit.test("Survey Localization - dropdown.choices", function(assert) {
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

QUnit.test("Survey Localization - radiogroup.otheItem", function(assert) {
  var json = {
    questions: [
      {
        type: "radiogroup",
        name: "q1",
        hasOther: true,
        choices: [1, 2],
        otherText: {
          default: "Other",
          es: "Otro"
        }
      }
    ]
  };

  var survey = new SurveyModel(json);
  var q1 = <QuestionRadiogroupModel>survey.getQuestionByName("q1");

  assert.equal(
    q1.visibleChoices[2].locText.textOrHtml,
    "Other",
    "By default it is Other"
  );
  survey.locale = "es";
  assert.equal(
    q1.visibleChoices[2].locText.textOrHtml,
    "Otro",
    "Otro for Spanish"
  );
  survey.locale = "";
  assert.equal(
    q1.visibleChoices[2].locText.textOrHtml,
    "Other",
    "It is default again"
  );
  survey.locale = "es";
  assert.equal(
    q1.visibleChoices[2].locText.textOrHtml,
    "Otro",
    "It is Spanish again"
  );
  survey.locale = "";
});

QUnit.test("Survey Localization - matrix.columns", function(assert) {
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

QUnit.test("Survey Localization - dropdownmatrix.columns", function(assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("Page 1");
  var q1 = new QuestionMatrixDropdownModel("matrixdropdown");
  var col1 = q1.addColumn("col1");
  q1.rows = ["row1", "row2"];
  page.addQuestion(q1);

  col1["choices"] = ["val1"];
  col1.title = "title1";
  col1["optionsCaption"] = "caption1";
  col1["choices"][0].text = "text1";
  survey.locale = "de";
  col1.title = "de-title1";
  col1["optionsCaption"] = "de-caption1";
  col1["choices"][0].text = "de-text1";
  assert.equal(col1.title, "de-title1", "Use 'de' text, title");
  assert.equal(
    col1["optionsCaption"],
    "de-caption1",
    "Use 'de' text, optionsCaption"
  );
  assert.equal(col1["choices"][0].text, "de-text1", "Use 'de' text, choices");
  survey.locale = "fr";
  assert.equal(col1.title, "title1", "Use default text, title");
  assert.equal(
    col1["optionsCaption"],
    "caption1",
    "Use default text, optionsCaption"
  );
  assert.equal(col1["choices"][0].text, "text1", "Use the default text");
});

QUnit.test("Survey Localization - multipletext.items", function(assert) {
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
  assert.equal(item.title, "de-title1", "Use 'de' text, title");
  assert.equal(item.placeHolder, "de-caption1", "Use 'de' text, placeHolder");
  survey.locale = "fr";
  assert.equal(item.title, "title1", "Use default text, title");
  assert.equal(item.placeHolder, "caption1", "Use default text, placeHolder");
});

QUnit.test(
  "Survey Localization - question.validators[].text, Bug#966",
  function(assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("Page 1");
    var q1 = new QuestionTextModel("q1");
    page.addQuestion(q1);
    var validator = new EmailValidator();
    q1.validators.push(validator);
    validator.text = "default-text";
    survey.locale = "de";
    validator.text = "de-text";
    assert.equal(validator.text, "de-text", "Use 'de' text");
    survey.locale = "fr";
    assert.equal(validator.text, "default-text", "Use default text");
    survey.locale = "";
  }
);

QUnit.test(
  "Survey text preprocessing, dropdown/checkbox/radiogroup, issue #499",
  function(assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("Page 1");
    var q1 = <QuestionDropdownModel>page.addNewQuestion("dropdown", "q1");
    q1.choices = [{ value: 1, text: "Item 1" }, { value: 2, text: "Item 2" }];
    var q2 = <QuestionCheckboxModel>page.addNewQuestion("checkbox", "q2");
    q2.choices = [{ value: 3, text: "Item 3" }, { value: 4, text: "Item 4" }];
    var q3 = <Question>page.addNewQuestion("text", "q3");
    q3.title = "{q1}-{q2}";
    assert.equal(q3.locTitle.renderedHtml, "3. -", "There is no values");
    q1.value = 1;
    assert.equal(
      q3.locTitle.renderedHtml,
      "3. Item 1-",
      "Drop down value is set"
    );
    q2.value = [3, 4];
    assert.equal(
      q3.locTitle.renderedHtml,
      "3. Item 1-Item 3, Item 4",
      "Drop down value is set"
    );
  }
);

QUnit.test("Survey text preprocessing, matrix, issue #499", function(assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("Page 1");
  var q1 = <QuestionMatrixModel>page.addNewQuestion("matrix", "q1");
  q1.columns = [{ value: 1, text: "Col 1" }, { value: 2, text: "Col 2" }];
  q1.rows = [
    { value: "row1", text: "Row 1" },
    { value: "row2", text: "Row 2" }
  ];
  var q2 = <Question>page.addNewQuestion("text", "q2");
  q2.title = "{q1.row1}";
  q1.value = { row1: 1, row2: 2 };
  assert.equal(q2.locTitle.renderedHtml, "2. Col 1", "Matrix use text");
});

QUnit.test("Survey text preprocessing, dropdown matrix, issue #499", function(
  assert
) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("Page 1");
  var q1 = <QuestionMatrixDropdownModel>page.addNewQuestion(
    "matrixdropdown",
    "q1"
  );
  q1.rows = [
    { value: "row1", text: "Row 1" },
    { value: "row2", text: "Row 2" }
  ];
  q1.columns = [];
  q1.addColumn("col1");
  q1.columns[0]["choices"] = [
    { value: 1, text: "Item 1" },
    { value: 2, text: "Item 2" }
  ];
  var q2 = <Question>page.addNewQuestion("text", "q2");
  q2.title = "{q1.row1.col1}";
  q1.value = { row1: { col1: 1 } };
  assert.equal(
    q2.locTitle.renderedHtml,
    "2. Item 1",
    "Dropdown Matrix Column use text"
  );
});

QUnit.test("Survey text preprocessing, dynamic matrix, issue #499", function(
  assert
) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("Page 1");
  var q1 = <QuestionMatrixDynamicModel>page.addNewQuestion(
    "matrixdynamic",
    "q1"
  );
  q1.rowCount = 2;
  q1.columns = [];
  q1.addColumn("col1");
  q1.columns[0]["choices"] = [
    { value: 1, text: "Item 1" },
    { value: 2, text: "Item 2" }
  ];
  var q2 = <Question>page.addNewQuestion("text", "q2");
  q2.title = "{q1[0].col1}";
  q1.value = [{ col1: 1 }, {}];
  assert.equal(
    q2.locTitle.renderedHtml,
    "2. Item 1",
    "Dropdown Matrix Column use text"
  );
});
QUnit.test("Survey text preprocessing with camella case, issue #913", function(
  assert
) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "text",
        name: "emailAddress",
        title: "uses uppercase"
      },
      {
        type: "text",
        name: "question1",
        title: "{emailAddress}"
      }
    ]
  });
  var question = <QuestionTextModel>survey.getQuestionByName("emailAddress");
  question.value = "john.snow@nightwatch.com";
  var question1 = <QuestionTextModel>survey.getQuestionByName("question1");
  assert.equal(
    question1.fullTitle,
    "2. john.snow@nightwatch.com",
    "The value is preprocessed correctly"
  );
});

QUnit.test("Survey Markdown - dropdown.choices", function(assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("Page 1");
  var q1 = new QuestionDropdownModel("q1");
  page.addQuestion(q1);
  q1.choices = [
    { value: 1, text: "text1" },
    { value: 1, text: "text2markdown" }
  ];
  survey.onTextMarkdown.add(function(survey, options) {
    if (options.text.indexOf("markdown") > -1)
      options.html = options.text.replace("markdown", "!");
  });
  var loc1 = (<ItemValue>q1.choices[0]).locText;
  var loc2 = (<ItemValue>q1.choices[1]).locText;
  assert.equal(loc1.renderedHtml, "text1", "render standard text");
  assert.equal(loc2.renderedHtml, "text2!", "render markdown text");
});

QUnit.test("Survey Markdown - question title", function(assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("Page 1");
  var q1 = <Question>page.addNewQuestion("text", "q1");
  var q2 = <Question>page.addNewQuestion("text", "q2");
  survey.onTextMarkdown.add(function(survey, options) {
    if (options.text.indexOf("markdown") > -1)
      options.html = options.text.replace("markdown", "!");
  });
  q2.value = "value2";
  var loc = q1.locTitle;
  q1.title = "title1, q2.value is {q2}markdown";
  assert.equal(
    q1.fullTitle,
    "1. title1, q2.value is value2!",
    "question.title, use markdown and text preprocessing"
  );
  assert.equal(
    loc.renderedHtml,
    "1. title1, q2.value is value2!",
    "question.locTitle.renderedHtml, use markdown and text preprocessing"
  );

  survey.questionTitleTemplate = "{no}) {title} ({require})markdown";
  q1.isRequired = true;
  assert.equal(
    q1.fullTitle,
    "1) title1, q2.value is value2! (*)!",
    "question.title with chaqnged questionTitleTemplate, use markdown and text preprocessing"
  );
  assert.equal(
    loc.renderedHtml,
    "1) title1, q2.value is value2! (*)!",
    "question.locTitle.renderedHtml with chaqnged questionTitleTemplate, use markdown and text preprocessing"
  );
});

QUnit.test("Survey Markdown - page title", function(assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("Page 1");
  var q1 = <Question>page.addNewQuestion("text", "q1");
  survey.onTextMarkdown.add(function(survey, options) {
    if (options.text.indexOf("markdown") > -1)
      options.html = options.text.replace("markdown", "!");
  });
  q1.value = "value1";
  var loc = page.locTitle;
  page.title = "Page 1markdown, q1 is {q1}";
  assert.equal(
    page.processedTitle,
    "Page 1!, q1 is value1",
    "page.processedTitle, use markdown and text preprocessing"
  );
  assert.equal(
    loc.renderedHtml,
    "Page 1!, q1 is value1",
    "page.locTitle.renderedHtml, use markdown and text preprocessing"
  );
});

QUnit.test("Survey Markdown - page title + showPageNumbers = true", function(
  assert
) {
  var survey = new SurveyModel();
  survey.showPageNumbers = true;
  var page = survey.addNewPage("Page 1");
  var q1 = <Question>page.addNewQuestion("text", "q1");
  survey.onTextMarkdown.add(function(survey, options) {
    if (options.text.indexOf("markdown") > -1)
      options.html = options.text.replace("markdown", "!");
  });
  q1.value = "value1";
  var loc = page.locTitle;
  page.title = "Page 1markdown, q1 is {q1}";
  assert.equal(
    loc.renderedHtml,
    "1. Page 1!, q1 is value1",
    "page.locTitle.renderedHtml, pageNo and use markdown and text preprocessing"
  );
});

QUnit.test(
  "Survey Markdown and text processing - dropdownmatrix.columns",
  function(assert) {
    var survey = new SurveyModel();
    survey.setValue("val1", "-newvalue-");
    survey.onTextMarkdown.add(function(survey, options) {
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
    assert.equal(loc1.renderedHtml, "col1", "render column name");
    assert.equal(loc2.renderedHtml, "colText2-newvalue-", "render column text");
    assert.equal(
      loc3.renderedHtml,
      "colText3-newvalue-!",
      "render column text as markdown"
    );
  }
);

QUnit.test("Survey Markdown and text processing - nmatrix.rows", function(
  assert
) {
  var survey = new SurveyModel();
  survey.onTextMarkdown.add(function(survey, options) {
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
  assert.equal(loc1.renderedHtml, "row1", "render column name");
  assert.equal(
    loc2.renderedHtml,
    "rowText2-newvalue-",
    "render column text + text processing"
  );
  assert.equal(
    loc3.renderedHtml,
    "rowText3-newvalue-!",
    "render column text as markdown + text processing"
  );
});

QUnit.test("html.html property, text preprocessing", function(assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("page1");
  var html = <QuestionHtmlModel>page.addNewQuestion("html", "q1");
  survey.setVariable("var1", 5);
  html.html = "val: {var1}";
  assert.equal(html.locHtml.renderedHtml, "val: 5", "initial value is set");
  survey.setVariable("var1", 10);
  assert.equal(html.locHtml.renderedHtml, "val: 10", "value is changed");
});

QUnit.test("Survey Markdown - survey title", function(assert) {
  var survey = new SurveyModel();
  survey.onTextMarkdown.add(function(survey, options) {
    if (options.text.indexOf("markdown") > -1)
      options.html = options.text.replace("markdown", "!");
  });
  survey.setValue("q1", "value1");
  var loc = survey.locTitle;
  survey.title = "Surveymarkdown, q1 is {q1}";
  assert.equal(
    survey.processedTitle,
    "Survey!, q1 is value1",
    "survey.processedTitle, use markdown and text preprocessing"
  );
  assert.equal(
    loc.renderedHtml,
    "Survey!, q1 is value1",
    "survey.locTitle.renderedHtml, use markdown and text preprocessing"
  );
});

QUnit.test("Survey Markdown - question.validators", function(assert) {
  var survey = new SurveyModel();
  survey.onTextMarkdown.add(function(survey, options) {
    if (options.text.indexOf("markdown") > -1)
      options.html = options.text.replace("markdown", "!");
  });
  survey.onValidateQuestion.add(function(servey, options) {
    if (options.name == "q2") options.error = "markdown";
  });
  var page = survey.addNewPage("p1");
  var question1 = <QuestionTextModel>page.addNewQuestion("text", "q1");
  var question2 = <QuestionTextModel>page.addNewQuestion("text", "q2");
  var validator = new EmailValidator();
  validator.text = "errormarkdown";
  question1.validators.push(validator);
  survey.setValue("q1", "val");
  page.hasErrors(true);
  assert.equal(validator.locText.renderedHtml, "error!", "Markdown is working");
  assert.equal(
    question1.errors[0].locText.renderedHtml,
    "error!",
    "Markdown in validators is working"
  );
  assert.equal(
    question2.errors[0].locText.renderedHtml,
    "!",
    "Markdown for event is working"
  );
});

QUnit.test("QuestionRadiogroupModel clears comment - issue #390", function(
  assert
) {
  var question = new QuestionRadiogroupModel("q1");
  question.hasComment = true;
  question.comment = "comment text";
  question.clearUnusedValues();
  assert.equal(question.comment, "comment text");
});

QUnit.test("survey.clearIncorrectValues", function(assert) {
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
                choices: ["item1", "item2"]
              }
            ]
          }
        ]
      }
    ]
  };
  var survey = new SurveyModel(json);
  assert.deepEqual(
    survey.data,
    { question1: "item3" },
    "The default value is set"
  );
  survey.clearIncorrectValues();
  assert.deepEqual(survey.data, {}, "The default value is removed");
});

QUnit.test("Create questions from elements array - issue #395", function(
  assert
) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "comment",
        name: "suggestions",
        title: "What would make you more satisfied with the Product?"
      }
    ]
  });
  assert.equal(survey.pages.length, 1);
  assert.equal(survey.pages[0].questions.length, 1);
  assert.equal(survey.pages[0].questions[0].name, "suggestions");
});

QUnit.test("onMatrixRowAdded", function(assert) {
  var survey = new SurveyModel();
  survey.onMatrixRowAdded.add(function(survey, options) {
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
  q1.value = [{ col1: 1, col2: "1" }, { col1: 2, col2: "2" }];
  q1.addRow();
  assert.equal(q1.rowCount, 4, "there are two rows");
  assert.equal(q1.value[3]["col1"], 2, "get value from previous");
});
QUnit.test("onMatrixBeforeRowAdded", function(assert) {
  var survey = new SurveyModel();
  survey.onMatrixBeforeRowAdded.add(function(sender, options) {
    if (options.question.rowCount >= 1) options.canAddRow = false;
    return;
  });

  var page = survey.addNewPage("Page 1");
  var q1 = new QuestionMatrixDynamicModel("matrixdynamic");
  page.addElement(q1);
  q1.addColumn("col1");
  q1.addColumn("col2");
  q1.addColumn("col3");
  q1.rowCount = 0;

  q1.addRow();
  assert.equal(q1.rowCount, 1, "there is one row");
  q1.addRow();
  assert.equal(
    q1.rowCount,
    1,
    "there is stil one row because of 'onMatrixBeforeRowAdded' and 'canAddRow'"
  );
});

QUnit.test("onMatrixRowRemoved", function(assert) {
  var survey = new SurveyModel();
  var removedRowIndex = -1;
  survey.onMatrixRowRemoved.add(function(survey, options) {
    removedRowIndex = options.rowIndex;
  });
  var page = survey.addNewPage("Page 1");
  var q1 = new QuestionMatrixDynamicModel("matrixdynamic");
  page.addElement(q1);
  q1.addColumn("col1");
  q1.rowCount = 3;
  q1.removeRow(1);
  assert.equal(q1.rowCount, 2, "there are two rows");
  assert.equal(
    removedRowIndex,
    1,
    "onMatrixRowRemoved event has been fired correctly"
  );
});

QUnit.test("onUpdatePanelCssClasses keeps original css - https://github.com/surveyjs/surveyjs/issues/1333", function(assert) {
  var css = surveyCss.getCss();
  var survey = new SurveyModel();
  survey.onUpdatePanelCssClasses.add(function(survey, options) {
    if (options.panel.name == "panel1")
      options.cssClasses.panel["container"] = "hereIam";
  });
  var page = survey.addNewPage("page1");
  var panel1 = new PanelModel("panel1");
  var panel2 = new PanelModel("panel2");
  page.addElement(panel1);
  page.addElement(panel2);
  var css1 = panel1.cssClasses;
  assert.equal(
    css1.panel.container,
    "hereIam",
    "panel1 custom class"
  );
  var css2 = panel2.cssClasses;
  assert.equal(
    css2.panel.container,
    "sv_p_container",
    "keep original panel class"
  );
  assert.equal(css.panel.container, "sv_p_container", "keep original main css class");
});

QUnit.test("Survey Elements css", function(assert) {
  var css = surveyCss.getCss();
  css.question.titleRequired = "required";
  var survey = new SurveyModel();
  survey.onUpdateQuestionCssClasses.add(function(survey, options) {
    if (options.question.name == "q2")
      options.cssClasses["newItem"] = "hereIam";
  });
  var page = survey.addNewPage("page1");
  var textQuestion = <QuestionTextModel>page.addNewQuestion("text", "q1");
  var checkQuestion = <QuestionCheckboxModel>page.addNewQuestion(
    "checkbox",
    "q2"
  );
  var textCss = textQuestion.cssClasses;
  var checkCss = checkQuestion.cssClasses;
  assert.equal(textCss.root, "sv_q_text_root", "text question root class");
  assert.equal(textCss.title, "sv_q_title", "text question title class");
  assert.equal(
    checkCss.root,
    "sv_qcbc sv_qcbx",
    "checkbox question root class"
  );
  assert.equal(checkCss.item, "sv_q_checkbox", "checkbox question title class");
  assert.equal(
    checkCss.newItem,
    "hereIam",
    "checkbox question onUpdateQuestionCssClasses event called correctly"
  );
  textQuestion.isRequired = true;
  textCss = textQuestion.cssClasses;
  assert.equal(
    textCss.title,
    "sv_q_title required",
    "text question title class"
  );
  css.question.titleRequired = "";
});

QUnit.test("Use send data to custom server", function(assert) {
  var survey = twoPageSimplestSurvey();
  var onCompleteOptions = null;
  survey.onComplete.add(function(sender, options) {
    onCompleteOptions = options;
    options.showDataSaving();
  });
  survey.data = { question1: "sss" };
  assert.equal(survey.completedState, "", "The complete state is empty");
  survey.doComplete();
  assert.equal(survey.completedState, "saving", "The complete state is saving");
  onCompleteOptions.showDataSavingError();
  assert.equal(survey.completedState, "error", "The complete state is error");
  onCompleteOptions.showDataSavingSuccess();
  assert.equal(
    survey.completedState,
    "success",
    "The complete state is success"
  );
});

QUnit.test("Pass custom properties to cell question", function(assert) {
  JsonObject.metaData.addProperty("matrixdropdowncolumn", {
    name: "renderAs",
    default: "default",
    choices: ["default", "select2tagbox"]
  });
  var survey = new SurveyModel({
    questions: [
      {
        type: "matrixdynamic",
        name: "teachersRate",
        title: "Please rate your teachers",
        columnColCount: 1,
        cellType: "radiogroup",
        choices: [{ value: 1, text: "Yes" }, { value: 0, text: "No" }],
        columns: [
          {
            name: "subject",
            cellType: "dropdown",
            renderAs: "select2tagbox",
            title: "Select a subject",
            choices: [
              "English: American Literature",
              "World Languages: Japanese"
            ]
          }
        ]
      }
    ]
  });
  var q1: QuestionMatrixDynamicModel = <any>survey.getQuestionByName(
    "teachersRate"
  );
  q1.addRow();
  assert.equal(
    q1.visibleRows[0].cells[0].question["renderAs"],
    "select2tagbox",
    "custom property should be passed to the question"
  );
});

QUnit.test("Pass text as survey json", function(assert) {
  var survey = new SurveyModel(
    '{ "questions": [ {"type": "text", "name": "q1"}]}'
  );
  var q1 = survey.getQuestionByName("q1");
  assert.equal(q1.name, "q1", "The survey created from the string");
});

QUnit.test("Clear value if empty array is set, Bug #608", function(assert) {
  var survey = new SurveyModel();
  survey.setValue("q1", ["1"]);
  assert.deepEqual(survey.data, { q1: ["1"] }, "The array is set");
  survey.setValue("q1", []);
  assert.deepEqual(survey.data, {}, "The value with empty array is removed");
});

QUnit.test("surveyId + clientId", function(assert) {
  var json = { questions: [{ type: "text", name: "q1" }] };
  class dxSurveyServiceTester extends dxSurveyService {
    public getSurveyJsonAndIsCompleted(
      surveyId: string,
      clientId: string,
      onLoad: (
        success: boolean,
        surveyJson: any,
        result: string,
        response: any
      ) => void
    ) {
      if (onLoad) {
        onLoad(true, json, clientId, "");
      }
    }
  }
  class SurveyTester extends SurveyModel {
    protected createSurveyService(): dxSurveyService {
      return new dxSurveyServiceTester();
    }
  }
  var survey = new SurveyTester({ surveyId: "surveyDummyId", clientId: "no" });
  assert.equal(survey.state, "running", "The survey is running");
  var q1 = survey.getQuestionByName("q1");
  assert.equal(q1.name, "q1", "The survey created from the string");

  survey = new SurveyTester({
    surveyId: "surveyDummyId",
    clientId: "completed"
  });
  assert.equal(
    survey.state,
    "completedbefore",
    "The survey was completed before"
  );
  var q1 = survey.getQuestionByName("q1");
  assert.equal(q1.name, "q1", "The survey created from the string");
});

QUnit.test(
  "Question description and text processing, variable, Bug #632",
  function(assert) {
    var survey = new SurveyModel();
    survey.addNewPage("p1");
    var question = <Question>survey.pages[0].addNewQuestion("text", "q1");
    question.title = "{var1}";
    question.description = "{var1}";
    survey.setVariable("var1", "It is var1");
    assert.equal(
      question.locTitle.renderedHtml,
      "1. It is var1",
      "Title: Variable is applied"
    );
    assert.equal(
      question.locDescription.renderedHtml,
      "It is var1",
      "Decription: Variable is applied"
    );
  }
);

QUnit.test(
  "Set defaultValue on loading from JSON, on adding into survey and on setting defaultValue property",
  function(assert) {
    var survey = new SurveyModel({
      questions: [{ type: "text", name: "q1", defaultValue: "your_name" }]
    });
    assert.equal(survey.getValue("q1"), "your_name", "on loading from JSON");
    var q2 = new QuestionTextModel("q2");
    q2.defaultValue = "my_name";
    survey.pages[0].addElement(q2);
    assert.equal(
      survey.getValue("q2"),
      "my_name",
      "on adding question into suvey"
    );
    var q3 = <Question>survey.pages[0].addNewQuestion("text", "q3");
    q3.defaultValue = "her_name";
    assert.equal(
      survey.getValue("q3"),
      "her_name",
      "on setting the default value"
    );
    q3.defaultValue = "his_name";
    assert.equal(
      survey.getValue("q3"),
      "her_name",
      "the value doesn't changed, since it was not empty"
    );
  }
);
QUnit.test("Set defaultValue in design-time", function(assert) {
  var survey = new SurveyModel();
  survey.setDesignMode(true);
  survey.addNewPage("p1");
  var q1 = new QuestionTextModel("q1");
  survey.pages[0].addElement(q1);
  assert.notOk(q1.defaultValue, "There is no default value");
  q1.defaultValue = "my_name";
  assert.equal(survey.getValue("q1"), "my_name", "the value is set");
  q1.defaultValue = null;
  assert.notOk(survey.getValue("q1"), "the value is reset");
});

QUnit.test("defaultValue + survey.clear()", function(assert) {
  var json = {
    elements: [{ type: "text", name: "q1", defaultValue: "defValue" }]
  };
  var survey = new SurveyModel(json);
  assert.equal(survey.getValue("q1"), "defValue", "the value is set");
  survey.doComplete();
  survey.clear(true);
  assert.equal(
    survey.getValue("q1"),
    "defValue",
    "the value is set after clear, #1163"
  );
});

QUnit.test("Dublicate errors", function(assert) {
  var survey = new SurveyModel();
  survey.addNewPage("p1");
  var q = <QuestionTextModel>survey.pages[0].addNewQuestion("text", "q1");
  q.validators.push(new NumericValidator(0, 25));
  var valueChangedCounter = 0;
  survey.onValueChanged.add(function(s, options) {
    valueChangedCounter++;
    options.question.hasErrors(true);
  });
  assert.equal(q.errors.length, 0, "There is no errors so far");
  q.value = "26";
  assert.equal(q.errors.length, 1, "There should be one error");
  assert.equal(valueChangedCounter, 1, "on value changed called one time");
  assert.equal(q.value, 26, "the value is 26");
});

QUnit.test("Auto generate names for question/panel/page", function(assert) {
  var survey = new SurveyModel();
  var page1 = survey.addNewPage();
  assert.equal(survey.pages[0].name, "page1", "the first name is page1");
  var page2 = survey.addNewPage();
  assert.equal(survey.pages[1].name, "page2", "the second name is page2");
  survey.pages[0].name = "newpage";
  var page3 = survey.addNewPage();
  assert.equal(survey.pages[2].name, "page1", "the third name is page1 again");

  page1.addNewQuestion("text");
  page1.addNewQuestion("text");
  page3.addNewQuestion("text");
  assert.equal(
    survey.getAllQuestions()[0].name,
    "question1",
    "the first name is question1"
  );
  assert.equal(
    survey.getAllQuestions()[1].name,
    "question2",
    "the second name is question2"
  );
  assert.equal(
    survey.getAllQuestions()[2].name,
    "question3",
    "the third name is question3"
  );

  var panel1 = page1.addNewPanel();
  var panel2 = panel1.addNewPanel();
  var panel3 = page2.addNewPanel();
  assert.equal(panel1.name, "panel1", "the first name is panel1");
  assert.equal(panel2.name, "panel2", "the second name is panel2");
  assert.equal(panel3.name, "panel3", "the third name is panel3");
});

QUnit.test("clearInvisibleValues", function(assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage();
  var question = <Question>page.addNewQuestion("text");
  assert.equal(survey.clearInvisibleValues, "onComplete", "the default value");
  survey.clearInvisibleValues = true;
  assert.equal(survey.clearInvisibleValues, "onComplete", "true is onComplete");
  survey.clearInvisibleValues = false;
  assert.equal(survey.clearInvisibleValues, "none", "false is none");
  question.value = "val";
  question.visible = false;
  assert.equal(question.value, "val", "none - nothing happened");
  question.visible = true;
  survey.clearInvisibleValues = "onHidden";
  question.visible = false;
  assert.notOk(question.value, "onHidden - clear the value");
  question.visible = true;
  question.value = "val";
  survey.clearInvisibleValues = "onComplete";
  question.visible = false;
  assert.equal(question.value, "val", "onComplete - nothing happened");
  survey.doComplete();
  assert.notOk(question.value, "onComplete - clear on complete");
});
QUnit.test("clearInvisibleValues=onHidden and invisiblePages, #964", function(
  assert
) {
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
  assert.deepEqual(
    survey.data,
    { q1: "val1" },
    "Remove value for invisible question q2"
  );
});
QUnit.test("required text can be empty: Bug #693", function(assert) {
  var survey = new SurveyModel();
  assert.equal(survey.requiredText, "*", "The default value is '*'");
  survey.requiredText = "";
  assert.equal(survey.requiredText, "", "The value is empty string");
  survey.requiredText = null;
  assert.equal(survey.requiredText, "*", "The value is again default");
});
QUnit.test("Set 0 value into survey.data", function(assert) {
  var survey = new SurveyModel();
  var p = survey.addNewPage();
  var q = <QuestionTextModel>p.addNewQuestion("text", "q1");
  survey.data = { q1: 0 };
  assert.equal(q.value, 0, "0 value is set");
});
QUnit.test("Parent property in question", function(assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("page");
  var panel = page.addNewPanel("panel");
  var panel2 = panel.addNewPanel("panel2");
  var q = panel2.addNewQuestion("text");
  assert.equal(q.parent.name, "panel2");
  panel2.removeElement(q);
  assert.notOk(q.parent);
  panel.addElement(q);
  assert.equal(q.parent.name, "panel");
});
QUnit.test("Page property in question", function(assert) {
  var survey = new SurveyModel();
  var page1 = survey.addNewPage("p1");
  var page2 = survey.addNewPage("p2");
  var panel = page1.addNewPanel("panel");
  var panel2 = panel.addNewPanel("panel2");
  var q = panel2.addNewQuestion("text");
  assert.ok(
    page1.questions.indexOf(q) > -1,
    "The question is in the first page"
  );
  assert.equal(q.page.name, page1.name, "The page is set correctly");
  q.page = page2;
  assert.ok(
    page2.questions.indexOf(q) > -1,
    "The question is in the second page"
  );
  assert.notOk(
    page1.questions.indexOf(q) > -1,
    "The question is not in the first page"
  );
  assert.equal(q.page.name, page2.name, "The page was changed");
});

QUnit.test("Define questionTitleLocation on Panel/Page level", function(
  assert
) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("page");
  var panel = page.addNewPanel("panel");
  var panel2 = panel.addNewPanel("panel2");
  var q = <Question>panel2.addNewQuestion("text");
  assert.equal(q.getTitleLocation(), "top", "get from survey");
  panel2.questionTitleLocation = "bottom";
  assert.equal(q.getTitleLocation(), "bottom", "get from panel 2");
  panel2.questionTitleLocation = "default";
  assert.equal(q.getTitleLocation(), "top", "get from survey");
  panel.questionTitleLocation = "bottom";
  assert.equal(q.getTitleLocation(), "bottom", "get from panel");
  panel.questionTitleLocation = "default";
  assert.equal(q.getTitleLocation(), "top", "get from survey");
  page.questionTitleLocation = "bottom";
  assert.equal(q.getTitleLocation(), "bottom", "get from page");
  page.questionTitleLocation = "default";
  assert.equal(q.getTitleLocation(), "top", "get from survey");
  q.titleLocation = "bottom";
  assert.equal(q.getTitleLocation(), "bottom", "get from question");
  q.titleLocation = "default";
  assert.equal(q.getTitleLocation(), "top", "get from survey again");
});

QUnit.test("Question property.page getChoices", function(assert) {
  var property = JsonObject.metaData.findProperty("questionbase", "page");
  assert.ok(property, "page property is here");
  var survey = new SurveyModel();
  survey.addNewPage("p1");
  survey.addNewPage("p2");
  survey.addNewPage("p3");
  var q = survey.pages[0].addNewQuestion("text", "q1");
  assert.equal(property.getChoices(q).length, 3, "There are 3 pages");
});

QUnit.test("firstPageIsStarted = true", function(assert) {
  var survey = new SurveyModel();
  for (var i = 0; i < 3; i++) {
    let page = survey.addNewPage("p" + i + 1);
    page.addNewQuestion("text");
  }
  assert.equal(survey.visiblePages.length, 3, "There are 3 visible pages");
  assert.equal(survey.pages[0].isVisible, true, "The first page is visible");
  assert.equal(survey.state, "running", "Survey is running");
  survey.firstPageIsStarted = true;
  assert.equal(survey.pages[0].isVisible, false, "The first page is invisible");
  assert.equal(survey.visiblePages.length, 2, "There are 2 visible pages");
  assert.equal(survey.state, "starting", "Survey is showing the start page");
  survey.firstPageIsStarted = false;
  assert.equal(survey.visiblePages.length, 3, "There are 3 visible pages");
  assert.equal(survey.pages[0].isVisible, true, "The first page is visible");
  assert.equal(survey.state, "running", "Survey is running");
  survey.firstPageIsStarted = true;
});

QUnit.test("firstPageIsStarted = true, load from JSON, the flow", function(
  assert
) {
  var json = {
    firstPageIsStarted: true,
    pages: [
      { name: "start", elements: [{ type: "text", name: "q1" }] },
      { name: "page1", elements: [{ type: "text", name: "q2" }] }
    ]
  };
  var survey = new SurveyModel(json);
  var startCounter = 0;
  survey.onStarted.add(function(sender) {
    startCounter++;
  });
  assert.equal(survey.pages[0].isVisible, false, "The first page is invisible");
  assert.equal(survey.visiblePages.length, 1, "There is one visible page");
  assert.equal(survey.state, "starting", "Survey is showing the start page");
  assert.equal(startCounter, 0, "onStarted event was not called yet");
  survey.start();
  assert.equal(startCounter, 1, "onStarted event was called one time");
  assert.equal(survey.state, "running", "Survey is running");
  assert.equal(survey.currentPage.name, "page1", "The page1 is current");
  survey.prevPage();
  assert.equal(
    survey.currentPage.name,
    "page1",
    "Could not come back to the start page"
  );
  assert.equal(survey.state, "running", "Survey is running");
  survey.doComplete();
  survey.clear();
  assert.equal(survey.state, "starting", "Survey is showing the start page");
  assert.equal(startCounter, 1, "onStarted event was called one time total");
});

QUnit.test("question.valueName property", function(assert) {
  var survey = new SurveyModel();
  survey.data = { val: "val1" };
  var page = survey.addNewPage("p1");
  var question = <Question>page.addNewQuestion("text", "q1");
  question.valueName = "val";
  assert.equal(question.value, "val1", "The value is taken by using valueName");
});
QUnit.test("pre process title, with question.valueName", function(assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("p1");
  var question = <Question>page.addNewQuestion("text", "q1");
  question.valueName = "name";
  survey.data = { name: "John" };
  survey.title = "Hello {name}";
  assert.equal(
    survey.processedTitle,
    "Hello John",
    "process survey title correctly"
  );
});

QUnit.test(
  "Survey text preprocessing, dropdown/checkbox/radiogroup, with question.valueName",
  function(assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("Page 1");
    var q1 = <QuestionDropdownModel>page.addNewQuestion("dropdown", "q1");
    q1.valueName = "name1";
    q1.choices = [{ value: 1, text: "Item 1" }, { value: 2, text: "Item 2" }];
    var q2 = <QuestionCheckboxModel>page.addNewQuestion("checkbox", "q2");
    q2.valueName = "name2";
    q2.choices = [{ value: 3, text: "Item 3" }, { value: 4, text: "Item 4" }];
    var q3 = <Question>page.addNewQuestion("text", "q3");
    q3.title = "{name1}-{name2}";
    assert.equal(q3.locTitle.renderedHtml, "3. -", "There is no values");
    q1.value = 1;
    assert.equal(
      q3.locTitle.renderedHtml,
      "3. Item 1-",
      "Drop down value is set"
    );
    q2.value = [3, 4];
    assert.equal(
      q3.locTitle.renderedHtml,
      "3. Item 1-Item 3, Item 4",
      "Drop down value is set"
    );
  }
);

QUnit.test("Survey show several pages as one", function(assert) {
  var survey = twoPageSimplestSurvey();
  survey.isSinglePage = true;
  assert.equal(survey.visiblePages.length, 1, "You have one page");
  var page = survey.visiblePages[0];
  assert.equal(
    page.elements.length,
    2,
    "two pages has converted into two panels"
  );
  assert.equal(page.questions.length, 4, "there are 4 questions on the page");
});

QUnit.test("Survey show several pages as one, set and reset", function(assert) {
  var survey = twoPageSimplestSurvey();
  survey.isSinglePage = true;
  survey.isSinglePage = false;
  assert.equal(survey.visiblePages.length, 2, "We have still two pages");
  var page = survey.visiblePages[0];
  assert.equal(page.questions.length, 2, "there are 2 questions on the page");
  survey.isSinglePage = true;
  assert.equal(survey.visiblePages.length, 1, "Single page");
  survey.setDesignMode(true);
  assert.equal(survey.visiblePages.length, 2, "We have still two pages again");
});

QUnit.test("Survey show several pages as one + firstPageIsStarted", function(
  assert
) {
  var survey = twoPageSimplestSurvey();
  var thirdPage = new PageModel("third");
  thirdPage.addNewQuestion("text", "q1");
  thirdPage.addNewQuestion("text", "q2");
  survey.pages.push(thirdPage);
  survey.firstPageIsStarted = true;
  survey.isSinglePage = true;
  assert.equal(survey.pages.length, 2, "Start page + single page");
  assert.equal(survey.visiblePages.length, 1, "You have one page");
  var page = survey.visiblePages[0];
  assert.equal(
    page.elements.length,
    2,
    "two pages has converted into two panels"
  );
  assert.equal(page.questions.length, 4, "there are 4 questions on the page");
});

QUnit.test(
  "Survey.isSinglePage = true, question.visibleIndex set incorrectly, bug#925",
  function(assert) {
    var json = {
      pages: [
        {
          elements: [
            {
              type: "radiogroup",
              name: "InvestorType",
              choices: ["entity", "Individual"]
            }
          ],
          name: "section1"
        },
        {
          elements: [
            {
              type: "panel",
              elements: [
                {
                  type: "text",
                  name: "q1",
                  visibleIf: "{InvestorType}='entity'"
                }
              ],
              name: "InvestmentAdvisorPanel",
              visibleIf: "{InvestorType}='entity'"
            },
            {
              type: "panel",
              elements: [
                {
                  type: "text",
                  name: "q2",
                  visibleIf: "{InvestorType}='entity'"
                }
              ],
              name: "FundOfFundsPanel",
              visibleIf: "{InvestorType} <> 'entity'"
            }
          ],
          name: "section2",
          visibleIf: "{InvestorType}='entity'"
        },
        {
          elements: [
            {
              type: "text",
              name: "q3",
              visibleIf: "{InvestorType}='entity'"
            }
          ],
          name: "section3",
          visibleIf: "{InvestorType}='entity'"
        }
      ]
    };
    var survey = new SurveyModel(json);
    survey.isSinglePage = true;
    assert.equal(
      (<Question>survey.getQuestionByName("InvestorType")).visibleIndex,
      0,
      "The first question"
    );
    survey.setValue("InvestorType", "entity");
    var q3 = survey.getQuestionByName("q3");
    assert.equal(
      (<Question>survey.getQuestionByName("q1")).visibleIndex,
      1,
      "The second question"
    );
    assert.equal(
      (<Question>survey.getQuestionByName("q2")).visibleIndex,
      -1,
      "The third question is invisible because of panel"
    );
    assert.equal(
      (<Question>survey.getQuestionByName("q3")).visibleIndex,
      2,
      "The forth question"
    );
  }
);

QUnit.test(
  "Survey.isSinglePage = true, the last page doesn't added, bug#1009",
  function(assert) {
    var json = {
      pages: [
        {
          name: "page1",
          elements: [
            {
              name: "text1",
              type: "text"
            }
          ]
        },
        {
          name: "page2",
          elements: [
            {
              name: "text2",
              type: "text"
            }
          ]
        },
        {
          name: "page3",
          elements: [
            {
              name: "text3",
              type: "text"
            }
          ]
        }
      ]
    };
    var survey = new SurveyModel(json);
    survey.isSinglePage = true;
    assert.equal(
      survey.currentPage.questions.length,
      3,
      "There are 3 elements on the single page"
    );
    assert.equal(
      survey.currentPage.rows.length,
      3,
      "There are 3 rows on the page"
    );
    assert.equal(
      survey.currentPage.rows[2].visible,
      true,
      "The last row is visible"
    );
  }
);

QUnit.test("Survey page hasShown", function(assert) {
  var survey = twoPageSimplestSurvey();
  assert.equal(survey.pages[0].hasShown, false, "The first page was not shown");
  assert.equal(
    survey.pages[1].hasShown,
    false,
    "The second page was not shown"
  );
  var p = survey.currentPage;
  assert.equal(survey.pages[0].hasShown, true, "The first page was shown");
  assert.equal(
    survey.pages[1].hasShown,
    false,
    "The second page was not shown"
  );
  survey.nextPage();
  assert.equal(survey.pages[1].hasShown, true, "The second page was shown");
  survey.clear();
  assert.equal(
    survey.pages[1].hasShown,
    false,
    "The second page hasShown is false again"
  );
});
QUnit.test("Questions are randomized", function(assert) {
  var survey = twoPageSimplestSurvey();
  var page = survey.pages[0];
  assert.equal(
    page.areQuestionsRandomized,
    false,
    "By default questions are not randomized"
  );
  page.questionsOrder = "random";
  assert.equal(
    page.areQuestionsRandomized,
    true,
    "page.questionsOrder = 'random'"
  );
  page.questionsOrder = "default";
  assert.equal(
    page.areQuestionsRandomized,
    false,
    "page.questionsOrder = 'default'"
  );
  survey.questionsOrder = "random";
  assert.equal(
    page.areQuestionsRandomized,
    true,
    "survey.questionsOrder = 'random' && page.questionsOrder = 'default'"
  );
  page.questionsOrder = "initial";
  assert.equal(
    page.areQuestionsRandomized,
    false,
    "page.questionsOrder = 'initial'"
  );
});
QUnit.test("Quiz, correct, incorrect answers", function(assert) {
  var survey = twoPageSimplestSurvey();
  var page = new PageModel("start");
  page.addNewQuestion("text", "name");
  page.addNewQuestion("text", "email");
  survey.pages.unshift(page);
  survey.firstPageIsStarted = true;
  for (var i = 1; i <= 4; i++) {
    (<Question>survey.getQuestionByName("question" + i)).correctAnswer =
      "q" + i;
  }
  survey.completedHtml =
    "{correctedAnswers}, {inCorrectedAnswers}, {questionCount}";
  survey.start();
  assert.equal(
    survey.getCorrectedAnswers(),
    0,
    "The number of corrected answers is 0"
  );
  assert.equal(
    survey.getInCorrectedAnswers(),
    4,
    "The number of corrected answers is 0"
  );
  survey.getQuestionByName("question1").visible = false;
  assert.equal(
    survey.getInCorrectedAnswers(),
    3,
    "The number of corrected answers is 0"
  );
  (<Question>survey.getQuestionByName("question2")).value = "q2";
  assert.equal(
    survey.getCorrectedAnswers(),
    1,
    "The number of corrected answers is 0"
  );
  assert.equal(
    survey.getInCorrectedAnswers(),
    2,
    "The number of corrected answers is 0"
  );
  (<Question>survey.getQuestionByName("question3")).value = "q10";
  (<Question>survey.getQuestionByName("question4")).value = "q4";
  assert.equal(
    survey.getCorrectedAnswers(),
    2,
    "The number of corrected answers is 0"
  );
  assert.equal(
    survey.getInCorrectedAnswers(),
    1,
    "The number of corrected answers is 0"
  );
  (<Question>survey.getQuestionByName("question4")).visible = false;
  assert.equal(
    survey.getCorrectedAnswers(),
    1,
    "The number of corrected answers is 0"
  );
  assert.equal(
    survey.getInCorrectedAnswers(),
    1,
    "The number of corrected answers is 0"
  );
  (<Question>survey.getQuestionByName("question4")).visible = true;
  assert.equal(
    survey.processedCompletedHtml,
    "2, 1, 3",
    "competed html is correct"
  );
});

QUnit.test(
  "Quiz, correct, incorrect answers and onIsAnswerCorrect event",
  function(assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("page");
    var q1 = <QuestionCheckboxModel>page.addNewQuestion("checkbox", "q1");
    q1.choices = [1, 2, 3, 4];
    q1.correctAnswer = [2, 3];
    q1.value = [1];
    assert.equal(
      survey.getCorrectedAnswerCount(),
      0,
      "The answer is incorrected"
    );
    q1.value = [3, 2];
    assert.equal(
      survey.getCorrectedAnswerCount(),
      1,
      "The answer is corrected now"
    );
    survey.onIsAnswerCorrect.add(function(survey, options) {
      var x = options.question.value;
      var y = options.question.correctAnswer;
      var res = x.length == y.length;
      if (res) {
        for (var i = 0; i < x.length; i++) {
          if (x[i] != y[i]) {
            res = false;
            break;
          }
        }
      }
      options.result = res;
    });
    assert.equal(
      survey.getCorrectedAnswerCount(),
      0,
      "The order is important now"
    );
    q1.value = [2, 3];
    assert.equal(survey.getCorrectedAnswerCount(), 1, "The order is correct");
  }
);
QUnit.test("survey.onGetQuestionTitle event. ", function(assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("page");
  var question = <Question>page.addNewQuestion("text", "question1");
  assert.equal(
    question.fullTitle,
    "1. question1",
    "by default it is question name if title is empty"
  );
  survey.onGetQuestionTitle.add(function(survey, options) {
    if (options.question.title == options.question.name) options.title = "";
  });
  assert.equal(question.fullTitle, "", "it is empty now");
});

QUnit.test(
  "Do not run conditions (enableIf/visibleIf) at design-time/Editor, Bug #999",
  function(assert) {
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
    assert.equal(
      page2.visible,
      true,
      "Page object doesn't run condition at design"
    );
    assert.equal(
      panel.visible,
      true,
      "Panel object doesn't run condition at design"
    );
    assert.equal(
      question.readOnly,
      false,
      "Question object doesn't run condition at design"
    );
  }
);

QUnit.test("condition function isContainerReady", function(assert) {
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
  assert.equal(qTest.isVisible, false, "It is invisible by default");
  q1.value = "1";
  assert.equal(qTest.isVisible, false, "q2 is empty");
  q2.value = "2";
  assert.equal(qTest.isVisible, false, "q2 is not e-mail");
  q2.value = "email@mail.com";
  assert.equal(qTest.isVisible, true, "isContainerReady returns true");
});

QUnit.test(
  "Infinitive loop on setting value to checkbox, if there is a text question with the same name, Bug #1015",
  function(assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("p");
    var qCheck = <QuestionCheckboxModel>page.addNewQuestion(
      "checkbox",
      "onename"
    );
    qCheck.choices = [
      { value: "item1", text: "display 1" },
      { value: "item2", text: "display 2" }
    ];
    var qText = page.addNewQuestion("text", "onename");
    survey.setValue("onename", ["item1"]);
    assert.deepEqual(
      survey.getValue("onename"),
      ["item1"],
      "The value set correctly"
    );
  }
);

QUnit.test(
  "visibleIf and adding/remove elements on changing visible, Bug #1044",
  function(assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("p");
    page.addNewQuestion("text", "q1");
    var q2 = page.addNewQuestion("text", "q2");
    var q3 = page.addNewQuestion("text", "q3");
    q2.visibleIf = "{q1} = 2";
    q3.visibleIf = "{q1} = 3";

    survey.onVisibleChanged.add(function(survey, options) {
      if (options.visible) {
        var question = options.question;
        survey.currentPage.removeQuestion(question);
        survey.currentPage.addQuestion(question);
      }
    });

    survey.setValue("q1", null);
    assert.equal(q2.isVisible, false, "Initially q2 is invisible");
    assert.equal(q3.isVisible, false, "Initially q3 is invisible");
    survey.setValue("q1", 2);
    assert.equal(q2.isVisible, true, "q1=2, q2 is visible");
    assert.equal(q3.isVisible, false, "q1=2, q3 is invisible");
    survey.setValue("q1", 3);
    assert.equal(q2.isVisible, false, "q1=3, q2 is invisible");
    assert.equal(q3.isVisible, true, "q1=3, q3 is visible");
  }
);

QUnit.test(
  "Process text with question name containing '-' and '+', Bug #1080",
  function(assert) {
    var json = {
      elements: [
        { type: "text", name: "1-2+3" },
        {
          type: "text",
          name: "age",
          visibleIf: "{1-2+3} notempty",
          title: "Hi, {1-2+3}"
        }
      ]
    };
    var survey = new SurveyModel(json);
    var qAge = <Question>survey.getQuestionByName("age");
    assert.equal(qAge.isVisible, false, "It is hidden by default");
    survey.setValue("1-2+3", "John");
    assert.equal(qAge.isVisible, true, "It is visible now");
    assert.equal(
      qAge.locTitle.renderedHtml,
      "2. Hi, John",
      "title processed correctly"
    );
  }
);

QUnit.test(
  "clearInvisibleValues: 'onHidden' doesn't work. The fix was created by introducing conditionVersion, Bug ##1172",
  function(assert) {
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
                  text: "Install"
                },
                {
                  value: "backupPhrase",
                  text: "backup "
                }
              ]
            }
          ]
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
                  text: "Linux"
                },
                {
                  value: "android",
                  text: "Android"
                }
              ]
            }
          ]
        },
        {
          name: "pageInstallLinux",
          elements: [
            {
              type: "text",
              name: "installLinux",
              visibleIf: "{choosePlatform} = 'linux'"
            }
          ]
        }
      ],
      clearInvisibleValues: "onHidden"
    };
    var survey = new SurveyModel(json);
    var qchoosePlatform = <Question>survey.getQuestionByName("choosePlatform");
    var qinstallLinux = <Question>survey.getQuestionByName("installLinux");
    assert.equal(
      qchoosePlatform.isVisible,
      false,
      "choosePlatform is not visible initial"
    );
    assert.equal(
      qinstallLinux.isVisible,
      false,
      "installLinux is not visible initial"
    );
    survey.setValue("issueType", "installJaxx");
    assert.equal(
      qchoosePlatform.isVisible,
      true,
      "choosePlatform is visible step 1"
    );
    assert.equal(
      qinstallLinux.isVisible,
      false,
      "installLinux is not visible step 1"
    );
    survey.setValue("choosePlatform", "linux");
    assert.equal(
      qchoosePlatform.isVisible,
      true,
      "choosePlatform is visible step 2"
    );
    assert.equal(
      qinstallLinux.isVisible,
      true,
      "installLinux is visible step 2"
    );
    survey.setValue("issueType", "backupPhrase");
    assert.equal(
      qchoosePlatform.isVisible,
      false,
      "choosePlatform is visible step 3"
    );
    assert.equal(
      qchoosePlatform.isEmpty(),
      true,
      "choosePlatform is empty step 3"
    );
    assert.equal(
      qinstallLinux.isVisible,
      false,
      "installLinux is not visible step 3"
    );
  }
);

QUnit.test("readOnly, enabledIf for Panels and Pages", function(assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("page");
  var panel1 = page.addNewPanel("panel1");
  var panel2 = panel1.addNewPanel("panel2");
  survey.setValue("val1", 1);
  panel1.enableIf = "{val1} == 1";
  var question1 = <Question>panel1.addNewQuestion("text", "question1");
  var question2 = <Question>panel2.addNewQuestion("text", "question2");
  assert.equal(question2.isReadOnly, false, "It is not readOnly by default");
  survey.setValue("val1", 2);
  assert.equal(question1.isReadOnly, true, "question1 is readOnly");
  assert.equal(question2.isReadOnly, true, "question2 is readOnly");
  assert.equal(panel1.isReadOnly, true, "panel1 is readOnly");
  assert.equal(panel2.isReadOnly, true, "panel2 is readOnly");

  var question3 = <Question>panel2.addNewQuestion("text", "question3");
  assert.equal(question3.isReadOnly, true, "question3 is readOnly");

  survey.setValue("val1", 1);
  assert.equal(question2.isReadOnly, false, "question2 is editable");

  panel2.readOnly = true;
  assert.equal(
    question1.isReadOnly,
    false,
    "question1 is not readOnly, panel2 is ReadOnly"
  );
  assert.equal(
    question2.isReadOnly,
    true,
    "question2 is readOnly, panel2 is ReadOnly"
  );
});

QUnit.test("Hide question numbers on particular page", function(assert) {
  var survey = new SurveyModel();
  survey.addNewPage("page1");
  survey.addNewPage("page2");
  survey.addNewPage("page3");
  survey.pages[0].addNewQuestion("text", "q1");
  survey.pages[1].addNewQuestion("text", "q2");
  survey.pages[2].addNewQuestion("text", "q3");
  var question = <Question>survey.getQuestionByName("q3");
  assert.equal(question.fullTitle, "3. q3", "It has number 3");
  survey.pages[1].questionTitleLocation = "hidden";
  assert.equal(question.fullTitle, "2. q3", "It has number 2 now");
});

QUnit.test("Could not assign value into mutlipletext question, #1229", function(
  assert
) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("page1");
  var question = new QuestionMultipleTextModel("q1");
  question.addItem("item1");
  question.addItem("item2");
  page.addQuestion(question);
  survey.data = { q1: { item1: "val1", item2: "val2" } };
  assert.equal(
    question.items[0].editor.value,
    "val1",
    "val1 is set to the question item"
  );
  assert.equal(
    question.items[1].editor.value,
    "val2",
    "val1 is set to the question item"
  );
});

QUnit.test("ProcessTextEx returnedDisplayValue is false, Bug#1243", function(
  assert
) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("page1");
  var q = <QuestionDropdownModel>page.addNewQuestion("dropdown", "region");
  q.choices = ["1", "2", "3"];
  var res = survey.processTextEx("{region}", false, false);
  assert.ok(res.hasAllValuesOnLastRun === false, "region doesn't exists");
  q.value = 1;
  res = survey.processTextEx("{region}", false, false);
  assert.ok(res.hasAllValuesOnLastRun === true, "region exists");
});

QUnit.test("Do not add invisible Panel Dynamic to the data, Bug#1258", function(
  assert
) {
  var json = {
    elements: [
      {
        type: "paneldynamic",
        name: "q1",
        templateElements: [{ type: "text", name: "q2", visible: false }],
        panelCount: 1,
        minPanelCount: 1
      }
    ]
  };
  var survey = new SurveyModel(json);
  survey.getQuestionByName("q1").visible = false;
  survey.doComplete();
  assert.equal(JSON.stringify(survey.data), "{}", "Panel Dynamic is invisible");
});

QUnit.test("Compete trigger and goNextPageAutomatic option", function(assert) {
  var json = {
    pages: [
      {
        elements: [
          {
            type: "text",
            name: "q1"
          },
          {
            type: "text",
            name: "q2",
            visible: false
          }
        ]
      },
      {
        elements: [
          {
            type: "text",
            name: "q3"
          }
        ]
      }
    ],
    triggers: [
      {
        type: "complete",
        expression: "{exp1} = true"
      }
    ],
    goNextPageAutomatic: true
  };
  var survey = new SurveyModel(json);
  var expressionQuestion = new QuestionExpressionModel("exp1");
  expressionQuestion.expression = "iif({q1} = 'a', true, false)";
  survey.pages[0].addElement(expressionQuestion);
  var completedCounter = 0;
  survey.onComplete.add(function() {
    completedCounter++;
  });
  survey.setValue("q2", "b");
  survey.setValue("q1", "a");
  assert.equal(completedCounter, 1, "The survey is completed one time");
});

QUnit.test("Page with numeric name, bug #1293", function(assert) {
  var json = {
    pages: [
      {
        name: "0608",
        questions: [
          {
            type: "text",
            name: "q1"
          }
        ]
      },
      {
        name: "002",
        elements: [
          {
            type: "text",
            name: "q2"
          }
        ]
      }
    ]
  };
  var survey = new SurveyModel(json);
  assert.equal(survey.currentPage.name, "0608", "the current page is correct");
});

QUnit.test("visiblePages and invisible panel, bug #395 (in Editor)", function(
  assert
) {
  var json = {
    pages: [
      {
        name: "page2",
        elements: [
          {
            type: "dropdown",
            name: "question2",
            choices: ["item1", "item2", "item3"]
          }
        ]
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
                visibleIf: '{question2} = "item1"'
              }
            ]
          }
        ]
      }
    ]
  };
  var survey = new SurveyModel(json);
  assert.equal(survey.visiblePageCount, 1, "Only one page is visible");
  assert.equal(
    survey.pages[1].isVisible,
    false,
    "The second page is invisible"
  );
  survey.setValue("question2", "item1");
  assert.equal(survey.visiblePageCount, 2, "Two pages are visible");
  survey.setValue("question2", "item2");
  assert.equal(survey.visiblePageCount, 1, "One page is visible again");
});

QUnit.test("Do not process html in design time, bug #396 (in Editor)", function(
  assert
) {
  var json = {
    "elements": [
      {
      "type": "text",
      "name": "question1"
      },
      {
      "type": "text",
      "name": "question2",
      "title": "{question1} test"
      }
    ]
   };
  var survey = new SurveyModel(json);
  survey.setDesignMode(true);
  var question = <Question>survey.getQuestionByName("question2");
  assert.equal(question.locTitle.renderedHtml, "2. {question1} test", "Do not process anything at design time");
});

QUnit.test("survey.showInvisibleElements property", function(
  assert
) {
  var json = {
    pages: [
      {
    "elements": [
      {
      "type": "text",
      "name": "question1"
      },
      {
      "type": "text",
      "name": "question2",
      "visible": false
      }
    ]},
    {
    "elements": [
      {
      "type": "text",
      "name": "question3",
      "visibleIf": "{question1} = 'test'"
      }
    ]
    }
  ]
   };
  var survey = new SurveyModel(json);
  assert.equal(survey.visiblePages.length, 1, "There is one visible page");
  assert.equal(survey.getQuestionByName("question2").isVisible, false, "question2 is invisible");
  survey.showInvisibleElements = true;
  assert.equal(survey.visiblePages.length, 2, "There are two visible pages");
  assert.equal(survey.getQuestionByName("question2").isVisible, true, "question2 is visible");
});

QUnit.test("panel.visibleIf doesn't work if it is a single panel on the page, #1329", function(
  assert
) {
  var json = {
    pages: [
     {
      name: "page1",
      elements: [
       {
        type: "radiogroup",
        name: "question1",
        choices: [
         "item1",
         "item2",
         "item3"
        ]
       }
      ]
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
          choices: [
           "item1",
           "item2",
           "item3"
          ]
         }
        ],
        visibleIf: "{question1} = 'item1'"
       }
      ]
     }
    ]
   };
  var survey = new SurveyModel(json);
  var counter = 0;
  survey.onPageVisibleChanged.add(function(sender, options){
    counter ++;
  });
  assert.equal(survey.visiblePageCount, 1, "There is one visible page");
  assert.equal(counter, 0, "counter is 0");
  survey.setValue("question1", "item1");
  assert.equal(survey.visiblePageCount, 2, "There are two visible pages");
  assert.equal(counter, 1, "counter is 1");
  survey.setValue("question1", "item2");
  assert.equal(survey.visiblePageCount, 1, "There is one visible page again");
  assert.equal(counter, 2, "counter is 2");
});

QUnit.test("Change renderWidth on width change, Editor Bug #422", function(
  assert
) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("page");
  var panel = page.addNewPanel("p1");
  panel.addNewQuestion("text", "q1")
  var question = page.addNewQuestion("text", "q2");
  question.width = "100px";
  panel.width = "200px";
  assert.equal(question.renderWidth, "100px", "row set question.renderWidth to it's width");
  assert.equal(panel.renderWidth, "200px", "row set panel.renderWidth to it's width");
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
function createPageWithQuestion(name: string): PageModel {
  var page = new PageModel(name);
  page.addNewQuestion("text", "q1");
  return page;
}

QUnit.test("Survey get full title with values", function(assert) {
  var json = {
    questions: [
      {
        type: "radiogroup",
        name: "q1",
        choices: [{ value: 1, text: "One" }, { value: 2, text: "Two" }],
        useDisplayValuesInTitle: false
      }
    ]
  };

  var survey = new SurveyModel(json);
  var q1 = <QuestionRadiogroupModel>survey.getQuestionByName("q1");
  q1.value = 1;

  assert.equal(
    q1.getProcessedText("{q1}"),
    1,
    "Get question value"
  );
});

QUnit.test("Survey radioGroup remove data on visible items change even if there are other visible questions here, Bug# T1239", function(assert) {
  var json = {
    "questions": [
        {
            "type": "radiogroup",
            "name": "group1",
            "valueName": "question1",
            "choices": [
                {
                    "value": "answer_possibility_2",
                    "visibleIf": "{other_question} = \"2\"" // If this line is removed value is selected
                },
                {
                    "value": "value_should_be_selected",
                    "visibleIf": "1=2"
                }
            ],
            "visibleIf": "{another_question} = \"whatever\""
        },
        {
            "type": "radiogroup",
            "name": "group2",
            "valueName": "question1",
            "choices": [
                {
                    "value": "value_should_be_selected"
                }
            ]
        }
    ]
  };

  var survey = new SurveyModel(json);
  var data = {
    "other_question": "2",
    "another_question": "blah",
    "question1": "value_should_be_selected"
  };
  survey.data = data;
  assert.deepEqual(survey.data, data);
});

QUnit.test("Do not call onValueChanged event onComplete event, Bug# T1239", function(assert) {
  
  var survey = new SurveyModel( {
              questions: [
                  {
                      name: "name",
                      type: "text",
                      title: "Please enter your name:"
                  }
                    ]
  });
  var radio = survey.pages[0].addNewQuestion("radiogroup","test");
  radio.choices = ["Yes", "No"];
  var counter = 0;
  survey.onValueChanged.add(function(sender, options){
    counter++;
  });
  survey.setValue("name", "name1");
  survey.setValue("test", "Yes");
  assert.deepEqual(counter, 2, "onValueChanged called two times");
  survey.doComplete();
  assert.deepEqual(counter, 2, "onValueChanged called still two times");
});

QUnit.test("Call onValueChanged event onComplete event only one for real field, Bug# T1239", function(assert) {
  var survey = new SurveyModel( {
              questions: [
                  {
                      name: "name",
                      type: "text",
                      title: "Please enter your name:"
                  }
                    ]
  });
  var radio = survey.pages[0].addNewQuestion("radiogroup","test");
  radio.choices = ["Yes", "No"];
  radio.value = "Some value";
  radio.visible = false;
  var counter = 0;
  survey.onValueChanged.add(function(sender, options){
    counter++;
  });
  survey.doComplete();
  assert.equal(counter, 1, "onValueChanged called still two times");
});

QUnit.test("getData for relation model", function(assert) {
  var survey = new SurveyModel( {
    pages: [
     {
      name: "page1",
      elements: [
       {
        type: "text",
        title: "text",
        name: "question1"
       },
       {
        type: "checkbox",
        title: "checkbox",
        name: "question3",
        choices: [
         "item1",
         "item2",
         "item3"
        ]
       },
       {
        type: "radiogroup",
        title: "radiogroup",
        name: "question4",
        choices: [
         "item1",
         "item2",
         "item3"
        ]
       },
       {
        type: "dropdown",
        title: "dropdown",
        name: "question5",
        choices: [
         "item1",
         "item2",
         "item3"
        ]
       },
       {
        type: "comment",
        title: "comment",
        name: "question6"
       },
       {
        type: "rating",
        title: "rating",
        name: "question7"
       },
       {
        type: "imagepicker",
        title: "imagepicker",
        name: "question8",
        choices: [
         {
          value: "lion",
          imageLink: "https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg"
         },
         {
          value: "giraffe",
          imageLink: "https://surveyjs.io/Content/Images/examples/image-picker/giraffe.jpg"
         },
         {
          value: "panda",
          imageLink: "https://surveyjs.io/Content/Images/examples/image-picker/panda.jpg"
         },
         {
          value: "camel",
          imageLink: "https://surveyjs.io/Content/Images/examples/image-picker/camel.jpg"
         }
        ]
       },
       {
        type: "boolean",
        title: "boolean",
        name: "question9"
       },
       {
        type: "file",
        title: "file",
        name: "question10",
        maxSize: 0
       },
       {
        type: "matrix",
        title: "matrix",
        name: "question11",
        columns: [
         "Column 1",
         "Column 2",
         "Column 3"
        ],
        rows: [
         "Row 1",
         "Row 2"
        ]
       },
       {
        type: "matrixdropdown",
        title: "matrixdropdown",
        name: "question12",
        columns: [
         {
          name: "Column 1"
         },
         {
          name: "Column 2",
          cellType: "radiogroup"
         },
         {
          name: "Column 3",
          cellType: "text"
         }
        ],
        choices: [
         1,
         2,
         3,
         4,
         5
        ],
        rows: [
         "Row 1",
         "Row 2"
        ]
       },
       {
        type: "matrixdynamic",
        title: "matrixdynamic",
        name: "question13",
        columns: [
         {
          name: "Column 1"
         },
         {
          name: "Column 2",
          cellType: "boolean"
         },
         {
          name: "Column 3",
          cellType: "radiogroup"
         }
        ],
        choices: [
         1,
         2,
         3,
         4,
         5
        ]
       },
       {
        type: "multipletext",
        title: "multipletext",
        name: "question14",
        items: [
         {
          name: "text1"
         },
         {
          name: "text2"
         }
        ]
       },
       {
        type: "paneldynamic",
        title: "paneldynamic",
        name: "question15",
        templateElements: [
         {
          type: "text",
          name: "question16"
         }
        ]
       }
      ]
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
          text: "Male"
         },
         {
          value: "F",
          text: "Female"
         }
        ]
       }
      ]
     }
    ]
   });
  survey.data = {"question1":"Answer 1",
  "question3":["item1","item2"],
  "question4":"item3",
  "question5":"item2",
  "question6":"Answer 5",
  "question7":3,
  "question8":"giraffe",
  "question9":true,
  "question10":[{"name":"favicon.ico","type":"image/x-icon","content":"data:image/x-icon;base64,A="}],
  "question11":{"Row 1":"Column 1","Row 2":"Column 2"},
  "question12":{"Row 1":{"Column 1":1,"Column 2":"2","Column 3":"Col 3"},"Row 2":{"Column 1":4,"Column 2":"5","Column 3":"Col 3 - 6"}},
  "question13":[{"Column 1":1,"Column 3":"2"},{"Column 1":3,"Column 3":"4","Column 2":false}],
  "question14":{"text1":"Line 1","text2":"Line 2"},
  "question15":[{"question16":"Panel dynamic content 1"},{"question16":"Panel dynamic content 2"}]};

  var plainData = survey.getPlainData();
  assert.equal(plainData.length, survey.getAllQuestions().length, "all questions are present");
  assert.equal(plainData[0].name, "question1");
  assert.equal(plainData[0].title, "text");
  assert.equal(plainData[0].value, "Answer 1");
  assert.equal(plainData[0].displayValue, "Answer 1");
  assert.notOk(plainData[0].isNode);

  assert.equal(plainData[1].name, "question3");
  assert.equal(plainData[1].title, "checkbox");
  assert.deepEqual(plainData[1].value, ["item1","item2"]);
  assert.deepEqual(plainData[1].displayValue, "item1, item2");
  assert.ok(plainData[1].isNode);
  assert.equal(plainData[1].data.length, 2);
  assert.equal(plainData[1].data[0].value, "item1");
  assert.equal(plainData[1].data[0].displayValue, "item1");
  assert.equal(plainData[1].data[1].value, "item2");
  assert.equal(plainData[1].data[1].displayValue, "item2");
});

QUnit.test("question.valueName is numeric, Bug# 1432", function(assert) {
  var survey = new SurveyModel( {
              questions: [
                  {
                      name: "name",
                      type: "text",
                      valueName: 10
                  }
                    ]
  });
  var question = survey.getQuestionByValueName("10");
  assert.equal(question.name, "name", "The question has been found")
});

QUnit.test("Show several errors based on validation", function(assert) {
  var survey = new SurveyModel({
    questions: [{
        "type": "multipletext",
        "name": "q1",
        "title": "Question 1 - Score",
        "isRequired": true,
        "requiredErrorText": "You must enter a response to the 'Question 1 - Score' question.",
        "validators": [{
          "type": "expression",
          "text": "You must enter a response to the 'Question 1 - Score' question.",
          "expression": "{q1.Field1} notempty or ({q1.Field1} empty and {q1.Field1} = 0) or {q1.Field2} notempty or ({q1.Field2} empty and {q1.Field2} = 0)"
        }, {
          "type": "expression",
          "text": "The response to 'Field 1' must be a number between 0 and 48.",
          "expression": "{q1.Field1} <= 48"
        }, {
          "type": "expression",
          "text": "The response to 'Field 2' must be a number between 0 and 52.",
          "expression": "{q1.Field2} <= 52"
        }, {
          "type": "expression",
          "text": "The response to 'Question 1 - Score' must be an even number between 0 and 100.",
          "expression": "({q1.Field1} + {q1.Field2}) <= 100"
        }, {
          "type": "expression",
          "expression": "({q1.Field1} + {q1.Field2}) % 2 = 0"
        }],
        "items": [{
          "name": "Field1",
          "title": "Field 1",
          "validators": [{
            "type": "regex",
            "text": "The response to 'Field 1' must be a number between 0 and 48.",
            "regex": "^\\d*\\.?\\d*$"
          }]
        }, {
          "name": "Field2",
          "title": "Field 2",
          "validators": [{
            "type": "regex",
            "text": "The response to 'Field 2' must be a number between 0 and 52.",
            "regex": "^\\d*\\.?\\d*$"
          }]
        }]
    }]
  });
  var question = <Question>survey.getQuestionByValueName("q1");
  question.value = {Field1: 51, Field2: 60};
  question.hasErrors(true);
  assert.equal(question.errors.length, 4, "There are 4 errors should be shown");
});

QUnit.test("getCustomErrorText for error", function(assert) {
  var survey = new SurveyModel( {
              questions: [
                  {
                      name: "name",
                      type: "text",
                      isRequired: true
                  }
      ]
  });
  survey.onErrorCustomText.add(function(sender, options){
    if(options.name == "required") {
      options.text = "!!!";
    }
  });
  var question = survey.currentPage.questions[0];
  survey.pages[0].hasErrors(true);
  assert.equal(question.errors[0].getText(), "!!!", "survey.onErrorCustomText works");
});
