import { Question } from "../src/question";
import { PanelModel } from "../src/panel";
import {
  QuestionPanelDynamicModel,
  QuestionPanelDynamicItem
} from "../src/question_paneldynamic";
import { JsonObject } from "../src/jsonobject";
import { SurveyModel } from "../src/survey";
import {
  CustomWidgetCollection,
  QuestionCustomWidget
} from "../src/questionCustomWidgets";

export default QUnit.module("Survey_QuestionPanelDynamic");

QUnit.test("Create panels based on template on setting value", function(
  assert
) {
  var question = new QuestionPanelDynamicModel("q");
  question.template.addNewQuestion("text", "q1");
  question.template.addNewQuestion("text", "q2");
  question.value = [{}, {}];

  assert.equal(question.panels.length, 2, "There are two panels now");
  var p1 = question.panels[0];
  assert.equal(
    p1.elements.length,
    2,
    "There are two elements in the first panel"
  );
});

QUnit.test("Synhronize panelCount and value array length", function(assert) {
  var question = new QuestionPanelDynamicModel("q");
  question.template.addNewQuestion("text", "q1");
  question.template.addNewQuestion("text", "q2");
  question.panelCount = 3;
  assert.equal(
    question.value.length,
    3,
    "There should be 3 items in the array"
  );
  question.value = [{}, { q1: "val1" }, {}, {}];
  assert.equal(question.panelCount, 4, "panelCount is 4 now");
  question.panelCount = 2;
  assert.equal(
    question.value.length,
    2,
    "There should be 2 items in the array"
  );
  assert.equal(
    question.value[1]["q1"],
    "val1",
    "Do not delete the value in non deleted panels"
  );
});

QUnit.test(
  "By pass values from question.value into panel values and vice versa",
  function(assert) {
    var question = new QuestionPanelDynamicModel("q");
    question.template.addNewQuestion("text", "q1");
    question.template.addNewQuestion("text", "q2");
    question.value = [
      { q1: "item1_1", q2: "item1_2" },
      { q1: "item2_1", q2: "item2_2" }
    ];

    assert.equal(question.panels.length, 2, "There are two panels now");
    var p1 = question.panels[0];
    var p2 = question.panels[1];
    assert.equal(
      (<Question>p1.questions[1]).value,
      "item1_2",
      "value set correct q2 panel1"
    );
    assert.equal(
      (<Question>p2.questions[0]).value,
      "item2_1",
      "value set correct q1 panel2"
    );
    (<Question>p1.questions[0]).value = "newValue";
    assert.equal(
      question.value[0].q1,
      "newValue",
      "The value from question has been assign successful"
    );
  }
);

QUnit.test("Change values in panels on changing in question.value", function(
  assert
) {
  var question = new QuestionPanelDynamicModel("q");
  question.template.addNewQuestion("text", "q1");
  question.template.addNewQuestion("text", "q2");
  question.panelCount = 2;
  assert.equal(question.panels.length, 2, "There are two panels now");
  var p1 = question.panels[0];
  var p2 = question.panels[1];
  question.value = [
    { q1: "item1_1", q2: "item1_2" },
    { q1: "item2_1", q2: "item2_2" }
  ];

  assert.equal(
    (<Question>p1.questions[1]).value,
    "item1_2",
    "value set correct q2 panel1"
  );
  assert.equal(
    (<Question>p2.questions[0]).value,
    "item2_1",
    "value set correct q1 panel2"
  );
});

QUnit.test("Load from Json", function(assert) {
  var json = {
    questions: [
      {
        type: "paneldynamic",
        name: "q",
        panelCount: 3,
        templateElements: [
          { type: "text", name: "q1" },
          { type: "text", name: "q2" }
        ]
      }
    ]
  };
  var survey = new SurveyModel(json);
  assert.equal(
    survey.jsonErrors == null || survey.jsonErrors.length == 0,
    true,
    "There should not be any errors"
  );
  var question = <QuestionPanelDynamicModel>survey.getAllQuestions()[0];
  assert.equal(
    question.template.elements.length,
    2,
    "template elements are loaded correctly"
  );
  assert.equal(
    question.template.elements[1].name,
    "q2",
    "the name of the second question is 'q2'"
  );
  assert.equal(question.panelCount, 3, "panelCount loaded correctly");
  assert.equal(question.panels.length, 3, "There are 3 panels now");
  var p1 = question.panels[0];
  var p2 = question.panels[1];
  assert.ok(p1, "the panel has been created");
  assert.equal(
    p1.elements.length,
    2,
    "There are two elements in the copied panel"
  );
  assert.equal(
    p1.questions[1].name,
    "q2",
    "the name of the second question in the copied panel is 'q2'"
  );
  assert.equal(p1.isVisible, true, "the panel is visible");

  question.value = [
    { q1: "item1_1", q2: "item1_2" },
    { q1: "item2_1", q2: "item2_2" }
  ];

  assert.equal(
    (<Question>p1.questions[1]).value,
    "item1_2",
    "value set correct q2 panel1"
  );
  assert.equal(
    (<Question>p2.questions[0]).value,
    "item2_1",
    "value set correct q1 panel2"
  );
  (<Question>p1.questions[0]).value = "newValue";
  assert.equal(question.value[0].q1, "newValue", "The value changed correctly");
});

QUnit.test("Load from Json with nested panel", function(assert) {
  var json = {
    questions: [
      {
        type: "paneldynamic",
        name: "q",
        panelCount: 3,
        templateElements: [
          { type: "text", name: "q1" },
          {
            type: "panel",
            name: "np1",
            elements: [{ type: "text", name: "q2" }]
          }
        ]
      }
    ]
  };
  var survey = new SurveyModel(json);
  var question = <QuestionPanelDynamicModel>survey.getAllQuestions()[0];
  assert.equal(
    question.template.elements.length,
    2,
    "template elements are loaded correctly"
  );
  assert.equal(
    question.template.elements[1].name,
    "np1",
    "the name of the second element is 'np1'"
  );
  assert.equal(
    (<PanelModel>question.template.elements[1]).elements.length,
    1,
    "there is one element in nested panel 'np1'"
  );
  assert.equal(
    (<PanelModel>question.template.elements[1]).elements[0].name,
    "q2",
    "q2 is an element in the 'np1'"
  );
  assert.equal(question.panelCount, 3, "panelCount loaded correctly");
  assert.equal(question.panels.length, 3, "There are 3 panels now");
  var p1 = question.panels[0];
  var p2 = question.panels[1];
  assert.ok(p1, "the panel has been created");

  assert.equal(p1.elements.length, 2, "template elements are loaded correctly");
  assert.equal(
    p1.elements[1].name,
    "np1",
    "the name of the second element is 'np1'"
  );
  assert.equal(
    (<PanelModel>p1.elements[1]).elements.length,
    1,
    "there is one element in nested panel 'np1'"
  );
  assert.equal(
    (<PanelModel>p1.elements[1]).elements[0].name,
    "q2",
    "q2 is an element in the 'np1'"
  );

  question.value = [
    { q1: "item1_1", q2: "item1_2" },
    { q1: "item2_1", q2: "item2_2" }
  ];

  assert.equal(
    (<Question>p1.questions[1]).value,
    "item1_2",
    "value set correct q2 panel1"
  );
  assert.equal(
    (<Question>p2.questions[0]).value,
    "item2_1",
    "value set correct q1 panel2"
  );
  (<Question>p1.questions[1]).value = "newValue";
  assert.equal(question.value[0].q2, "newValue", "The value changed correctly");
});

QUnit.test("Has errors", function(assert) {
  var question = new QuestionPanelDynamicModel("q");
  question.template.addNewQuestion("text", "q1");
  (<Question>question.template.questions[0]).isRequired = true;
  question.isRequired = true;
  question.value = [];
  assert.equal(question.hasErrors(), true, "main question requires a value");
  question.value = [{ q1: "item1_1" }, {}];
  assert.equal(question.hasErrors(), true, "q1 on the second row is not set");
  question.value = [{ q1: "item1_1" }, { q1: "item2_1" }];
  assert.equal(question.hasErrors(), false, "There is no errors now");
});

QUnit.test("Update panels elements on changing template panel", function(
  assert
) {
  var question = new QuestionPanelDynamicModel("q");
  question.panelCount = 2;
  assert.equal(
    question.panels[0].elements.length,
    0,
    "Initially there is no elements in the copied panel"
  );
  question.template.addNewQuestion("text", "q1");
  assert.equal(
    question.panels[0].elements.length,
    1,
    "Add question into template - add question into copied panels"
  );
  question.template.removeQuestion(question.template.questions[0]);
  assert.equal(
    question.panels[0].elements.length,
    0,
    "Remove question from template - from question from copied panels"
  );
});

QUnit.test("Support visibleIf and panel variable", function(assert) {
  var survey = new SurveyModel();
  survey.addNewPage("p");
  var question = new QuestionPanelDynamicModel("q");
  survey.pages[0].addQuestion(question);
  question.template.addNewQuestion("text", "q1");
  question.template.addNewQuestion("text", "q2");
  question.template.questions[1].visibleIf = "{panel.q1} = 'val'";
  question.panelCount = 2;
  assert.equal(
    question.panels[0].questions[1].visible,
    false,
    "q1 is not 'val'"
  );
  question.value = [{ q1: "val" }];
  assert.equal(question.panels[0].questions[1].visible, true, "q1 is 'val'");
});
QUnit.test("Support visibleIf and panel variable, question.valueName", function(
  assert
) {
  var survey = new SurveyModel();
  survey.addNewPage("p");
  var question = new QuestionPanelDynamicModel("q");
  survey.pages[0].addQuestion(question);
  (<Question>question.template.addNewQuestion("text", "q1")).valueName =
    "panelQ1";
  question.template.addNewQuestion("text", "q2");
  question.template.questions[1].visibleIf = "{panel.panelQ1} = 'val'";
  question.panelCount = 2;
  assert.equal(
    question.panels[0].questions[1].visible,
    false,
    "panelQ1 is not 'val'"
  );
  question.value = [{ panelQ1: "val" }];
  assert.equal(
    question.panels[0].questions[1].visible,
    true,
    "panelQ1 is 'val'"
  );
});
QUnit.test("Support panelIndex in visibleIf expression", function(assert) {
  var survey = new SurveyModel();
  survey.addNewPage("p");
  var question = new QuestionPanelDynamicModel("q");
  survey.pages[0].addQuestion(question);
  question.template.addNewQuestion("text", "q1");
  question.template.addNewQuestion("text", "q2");
  question.template.questions[1].visibleIf = "{panelIndex} = 0";
  question.panelCount = 2;
  assert.equal(
    question.panels[0].questions[1].isVisible,
    true,
    "panel index = 0"
  );
  assert.equal(
    question.panels[1].questions[1].isVisible,
    false,
    "panel index != 0"
  );
});

QUnit.test("Text Processing and panel variable, question.valueName", function(
  assert
) {
  var survey = new SurveyModel();
  survey.addNewPage("p");
  var question = new QuestionPanelDynamicModel("q");
  survey.pages[0].addQuestion(question);
  (<Question>question.template.addNewQuestion("text", "q1")).valueName =
    "panelQ1";
  question.templateTitle = "Value: {panel.panelQ1}";
  question.panelCount = 2;
  assert.equal(
    question.panels[0].processedTitle,
    "Value: ",
    "panelQ1 is empty"
  );
  question.value = [{ panelQ1: "val" }];
  assert.equal(
    question.panels[0].processedTitle,
    "Value: val",
    "panelQ1 is 'val'"
  );
});

QUnit.test("Text Processing from panel.data", function(assert) {
  var survey = new SurveyModel();
  survey.addNewPage("p");
  var question = new QuestionPanelDynamicModel("q");
  question.templateTitle = "Value: {panel.panelQ1}";
  question.panelCount = 2;
  assert.equal(
    question.panels[0].processedTitle,
    "Value: ",
    "panelQ1 is empty"
  );
  question.value = [{ panelQ1: "val" }];
  assert.equal(
    question.panels[0].processedTitle,
    "Value: val",
    "panelQ1 is 'val'"
  );
});

QUnit.test("Set panel value, question.valueName", function(assert) {
  var survey = new SurveyModel();
  survey.addNewPage("p");
  var question = new QuestionPanelDynamicModel("q");
  survey.pages[0].addQuestion(question);
  (<Question>question.template.addNewQuestion("text", "q1")).valueName =
    "panelQ1";
  question.panelCount = 2;
  assert.equal(
    question.template.questions[0].getValueName(),
    "panelQ1",
    "value name is set"
  );
  assert.equal(
    question.panels[0].questions[0].getValueName(),
    "panelQ1",
    "value name is set for generated panel"
  );
  (<Question>question.panels[0].questions[0]).value = "val1";
  (<Question>question.panels[1].questions[0]).value = "val2";
  assert.deepEqual(
    question.value,
    [{ panelQ1: "val1" }, { panelQ1: "val2" }],
    "set value correctly, use valueName property"
  );
});

QUnit.test("Support panelIndex variable", function(assert) {
  var survey = new SurveyModel();
  survey.addNewPage("p");
  var question = new QuestionPanelDynamicModel("q");
  survey.pages[0].addQuestion(question);
  question.templateTitle = "{panelIndex}. test";
  question.template.addNewQuestion("text", "q1");
  question.template.addNewQuestion("text", "q2");
  question.panelCount = 2;
  assert.equal(
    question.panels[0].processedTitle,
    "1. test",
    "panelIndex = 1 for the first panel"
  );
  assert.equal(
    question.panels[1].processedTitle,
    "2. test",
    "panelIndex = 2 for the second panel"
  );
});
QUnit.test("remove Panel", function(assert) {
  var question = new QuestionPanelDynamicModel("q");
  question.template.addNewQuestion("text", "q1");
  question.template.addNewQuestion("text", "q2");
  question.panelCount = 3;
  question.value = [{}, { q1: "val1" }, {}];
  question.removePanel(2);
  question.removePanel(0);
  assert.equal(question.value.length, 1, "There should be 1 item in the array");
  assert.equal(question.panelCount, 1, "panelCount is 1 now");
  assert.equal(
    question.value[0]["q1"],
    "val1",
    "Do not delete the value in non deleted panels"
  );
});
QUnit.test("remove Panel Question from Page, Bug#184, in editor repo", function(
  assert
) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("p");
  var question = new QuestionPanelDynamicModel("q");
  page.addElement(question);
  var q = question.template.addNewQuestion("text", "q1");
  assert.equal(question.template.elements.length, 1, "There is one element");
  page.removeElement(q);
  assert.equal(question.template.elements.length, 0, "Template panel is empty");
});
QUnit.test("Process text in titles", function(assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("p");
  var survey_q1 = <Question>page.addNewQuestion("text", "q1");
  var survey_q2 = <Question>page.addNewQuestion("text", "q2");
  survey_q2.title = "q1:{q1}";
  var question = new QuestionPanelDynamicModel("q");
  page.addQuestion(question);
  question.template.addNewQuestion("text", "q1");
  question.template.addNewQuestion("text", "q2");
  question.templateTitle = "q1:{q1}, panel.q1:{panel.q1}";
  (<Question>question.template.questions[1]).title =
    "q1:{q1}, panel.q1:{panel.q1}";
  question.panelCount = 3;
  survey_q1.value = "val_q1";
  question.value = [{}, { q1: "val1" }, {}];
  var panel = question.panels[1];
  var panel_q2 = <Question>panel.questions[1];
  assert.equal(
    survey_q2.locTitle.renderedHtml,
    "2. q1:val_q1",
    "process root question title correclty"
  );
  assert.equal(
    panel.locTitle.renderedHtml,
    "q1:val_q1, panel.q1:val1",
    "process panel title correctly"
  );
  assert.equal(
    panel_q2.locTitle.renderedHtml,
    "q1:val_q1, panel.q1:val1",
    "process question title correctly"
  );
});
QUnit.test(
  "Process text in titles, variable that has name different from questions, bug#802",
  function(assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("p");
    var question = new QuestionPanelDynamicModel("q");
    question.template.addNewQuestion("text", "q1");
    page.addQuestion(question);
    question.templateTitle = "panel.q1:{panel.q1}, panel.name:{panel.name}";
    question.value = [{ q1: "q1Value", name: "nameValue" }, {}];
    var panel = question.panels[0];
    assert.equal(
      panel.locTitle.renderedHtml,
      "panel.q1:q1Value, panel.name:nameValue",
      "process panel title correctly"
    );
  }
);
QUnit.test(
  "Process text in titles, get correct value, question.valueName",
  function(assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("p");
    var survey_qName = <Question>page.addNewQuestion("text", "name");
    var question = new QuestionPanelDynamicModel("q");
    page.addQuestion(question);
    (<Question>question.template.addNewQuestion("text", "q1")).valueName =
      "name";
    question.templateTitle = "survey.name:{name}, panel.name:{panel.name}";
    question.panelCount = 3;
    survey_qName.value = "surveyName";
    question.value = [{}, { name: "panel1Name" }, {}];
    var panel = question.panels[1];
    assert.equal(
      panel.locTitle.renderedHtml,
      "survey.name:surveyName, panel.name:panel1Name",
      "process panel title correctly"
    );
  }
);

QUnit.test("PanelDynamic in design time", function(assert) {
  var survey = new SurveyModel();
  survey.setDesignMode(true);
  survey.addNewPage("p");
  var question = new QuestionPanelDynamicModel("q");
  survey.pages[0].addQuestion(question);
  question.template.addNewQuestion("text", "q1");
  question.template.addNewQuestion("text", "q2");
  question.panelCount = 2;
  assert.equal(question.panels.length, 1, "Only one panel at design time");
  assert.equal(
    question.panels[0].id,
    question.template.id,
    "The template panel should be shown"
  );
});
QUnit.test("PanelDynamic, question no", function(assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("p");
  var question1 = <Question>page.addNewQuestion("text", "q1");
  var panel = <QuestionPanelDynamicModel>page.addNewQuestion(
    "paneldynamic",
    "panel"
  );
  panel.template.addNewQuestion("text", "panelq1");
  panel.template.addNewQuestion("text", "panelq2");
  panel.panelCount = 2;
  var panelQuestion1 = <Question>panel.panels[0].questions[0];
  var panelQuestion2 = <Question>panel.panels[1].questions[1];
  var question2 = <Question>page.addNewQuestion("text", "q2");
  assert.equal(panel.showQuestionNumbers, "off", "off is the default value");
  assert.equal(question1.visibleIndex, 0, "off - question1.visibleIndex");
  assert.equal(panel.visibleIndex, 1, "off - panel.visibleIndex");
  assert.equal(
    panelQuestion1.visibleIndex,
    -1,
    "off - panelQuestion1.visibleIndex"
  );
  assert.equal(
    panelQuestion2.visibleIndex,
    -1,
    "off - panelQuestion2.visibleIndex"
  );
  assert.equal(question2.visibleIndex, 2, "off - question2.visibleIndex");

  panel.showQuestionNumbers = "onPanel";
  assert.equal(question1.visibleIndex, 0, "onPanel - question1.visibleIndex");
  assert.equal(panel.visibleIndex, 1, "onPanel - panel.visibleIndex");
  assert.equal(
    panelQuestion1.visibleIndex,
    0,
    "onPanel - panelQuestion1.visibleIndex"
  );
  assert.equal(
    panelQuestion2.visibleIndex,
    1,
    "onPanel - panelQuestion2.visibleIndex"
  );
  assert.equal(question2.visibleIndex, 2, "onPanel - question2.visibleIndex");

  panel.showQuestionNumbers = "onSurvey";
  assert.equal(question1.visibleIndex, 0, "onSurvey - question1.visibleIndex");
  assert.equal(panel.visibleIndex, -1, "onSurvey - panel.visibleIndex");
  assert.equal(
    panelQuestion1.visibleIndex,
    1,
    "onSurvey - panelQuestion1.visibleIndex"
  );
  assert.equal(
    panelQuestion2.visibleIndex,
    4,
    "onSurvey - panelQuestion2.visibleIndex"
  );
  assert.equal(question2.visibleIndex, 5, "onSurvey - question2.visibleIndex");

  panelQuestion1.visible = false;
  assert.equal(
    panelQuestion2.visibleIndex,
    3,
    "onSurvey, panelQuestion1 is invisible - panelQuestion2.visibleIndex"
  );
  assert.equal(
    question2.visibleIndex,
    4,
    "onSurvey, panelQuestion1 is invisible - question2.visibleIndex"
  );
});

QUnit.test("PanelDynamic, renderMode", function(assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("p");
  var panel = <QuestionPanelDynamicModel>page.addNewQuestion(
    "paneldynamic",
    "panel"
  );
  panel.template.addNewQuestion("text", "panelq1");
  panel.template.addNewQuestion("text", "panelq2");
  assert.equal(panel.renderMode, "list", "list is a default mode");
  panel.panelCount = 2;
  assert.equal(
    panel.currentIndex,
    -1,
    "list mode doesn't support currentIndex"
  );
  assert.equal(
    panel.currentPanel,
    null,
    "list mode doesn't support currentPanel"
  );
  panel.renderMode = "progressTop";
  assert.equal(panel.currentIndex, 0, "list mode doesn't support currentIndex");
  assert.equal(
    panel.currentPanel.id,
    panel.panels[0].id,
    "list mode doesn't support currentPanel"
  );
  assert.equal(
    panel.isPrevButtonShowing,
    false,
    "currentIndex = 0, prevButton is hidden"
  );
  assert.equal(
    panel.isNextButtonShowing,
    true,
    "currentIndex = 0, nextButton is visible"
  );
  panel.currentIndex++;
  assert.equal(
    panel.isPrevButtonShowing,
    true,
    "currentIndex = 1, prevButton is visible"
  );
  assert.equal(
    panel.isNextButtonShowing,
    false,
    "currentIndex = 1, nextButton is hidden"
  );
  panel.addPanel();
  assert.equal(panel.currentIndex, 2, "The last added panel is current");
  panel.removePanel(2);
  assert.equal(panel.currentIndex, 1, "The last  panel is removed");
});
QUnit.test("PanelDynamic, renderMode is not list + hasError", function(assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("p");
  var panel = <QuestionPanelDynamicModel>page.addNewQuestion(
    "paneldynamic",
    "panel"
  );
  (<Question>panel.template.addNewQuestion(
    "text",
    "panelq1"
  )).isRequired = true;
  panel.template.addNewQuestion("text", "panelq2");
  panel.panelCount = 2;
  panel.renderMode = "progressTop";
  panel.currentIndex = 1;
  assert.equal(panel.currentIndex, 1, "go to the second panel");
  panel.hasErrors(true);
  assert.equal(
    panel.currentIndex,
    0,
    "it should show the first panel where the error happened"
  );
});
QUnit.test("PanelDynamic, keyName + hasError + getAllErrors", function(assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("p");
  var panel = <QuestionPanelDynamicModel>page.addNewQuestion(
    "paneldynamic",
    "panel"
  );
  panel.template.addNewQuestion("text", "panelq1");
  panel.template.addNewQuestion("text", "panelq2");
  panel.panelCount = 2;
  panel.keyName = "panelq1";
  assert.equal(panel.hasErrors(true), false, "There is no errors");
  (<Question>panel.panels[0].questions[0]).value = "val1";
  assert.equal(
    panel.hasErrors(true),
    false,
    "There is no errors panel[0].q1 = val1"
  );
  (<Question>panel.panels[1].questions[0]).value = "val1";
  assert.equal(
    panel.hasErrors(true),
    true,
    "There is the error panel[0].q1 = val1 and panel[1].q1 = val1"
  );
  assert.equal(
    panel.errors.length,
    0,
    "There is no errors in the panel question itself"
  );
  assert.equal(
    panel.getAllErrors().length,
    1,
    "There is errors in question inside the panel"
  );
  (<Question>panel.panels[1].questions[0]).value = "val2";
  assert.equal(
    panel.hasErrors(true),
    false,
    "There is no error panel[0].q1 = val1 and panel[1].q1 = val2"
  );
  assert.equal(
    panel.getAllErrors().length,
    0,
    "There is no errors in question inside the panel"
  );
});
QUnit.test("assign customWidgets to questions in dynamic panel", function(
  assert
) {
  CustomWidgetCollection.Instance.clear();
  CustomWidgetCollection.Instance.addCustomWidget({
    name: "customWidget",
    isFit: question => {
      return question.name == "panelq2";
    }
  });
  var survey = new SurveyModel();
  var page = survey.addNewPage("p");
  var panel = <QuestionPanelDynamicModel>page.addNewQuestion(
    "paneldynamic",
    "panel"
  );
  panel.template.addNewQuestion("text", "panelq1");
  panel.template.addNewQuestion("text", "panelq2");
  panel.panelCount = 2;
  assert.equal(
    panel.panels[0].questions[0].customWidget,
    null,
    "panel0, there is no custom widget for this question"
  );
  assert.equal(
    panel.panels[0].questions[1].customWidget.name,
    "customWidget",
    "panel0, has the custom widget"
  );
  assert.equal(
    panel.panels[1].questions[0].customWidget,
    null,
    "panel1, there is no custom widget for this question"
  );
  assert.equal(
    panel.panels[1].questions[1].customWidget.name,
    "customWidget",
    "panel1, has the custom widget"
  );
  CustomWidgetCollection.Instance.clear();
});

QUnit.test("Auto generate names", function(assert) {
  var survey = new SurveyModel();
  var page1 = survey.addNewPage();
  var panel = <QuestionPanelDynamicModel>page1.addNewQuestion("paneldynamic");
  var q2 = panel.template.addNewQuestion("text");
  var p1 = panel.template.addNewPanel();
  var q3 = page1.addNewQuestion("text");

  assert.equal(p1.name, "panel1", "the first name for panel is panel1");
  assert.equal(
    q2.name,
    "question2",
    "the second name for question is question2"
  );
  assert.equal(
    q3.name,
    "question3",
    "the third name for question is question3"
  );
});

QUnit.test(
  "Set data for loaded panel after clearing the survey data, bug#784",
  function(assert) {
    var json = {
      questions: [
        {
          type: "paneldynamic",
          name: "q",
          panelCount: 1,
          templateElements: [
            { type: "text", name: "q1" },
            { type: "text", name: "q2" }
          ]
        }
      ]
    };
    var survey = new SurveyModel(json);
    //clear data
    survey.data = {};
    var dymamicPanel = <QuestionPanelDynamicModel>survey.getAllQuestions()[0];
    var q1 = <Question>dymamicPanel.panels[0].questions[0];
    q1.value = "test";
    assert.equal(q1.value, "test", "question keep the value");
    assert.deepEqual(
      survey.data,
      { q: [{ q1: "test" }] },
      "value set into survey"
    );
  }
);

QUnit.test("Set panel count to 0, Editor bug#228", function(assert) {
  var json = {
    questions: [
      {
        type: "paneldynamic",
        name: "q",
        templateElements: [
          { type: "text", name: "q1" },
          { type: "text", name: "q2" }
        ]
      }
    ]
  };
  var survey = new SurveyModel(json);
  survey.setDesignMode(true);
  var dymamicPanel = <QuestionPanelDynamicModel>survey.getAllQuestions()[0];
  assert.equal(dymamicPanel.panelCount, 0, "The default panel count is 0");
  dymamicPanel.panelCount = 1;
  assert.equal(dymamicPanel.panelCount, 1, "There is one panel");
  dymamicPanel.panelCount = 0;
  assert.equal(dymamicPanel.panelCount, 0, "There is no panels");
});

QUnit.test("PanelDynamic, question.getTitleLocation(), bug#800", function(
  assert
) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("p");
  var panel = <QuestionPanelDynamicModel>page.addNewQuestion(
    "paneldynamic",
    "panel"
  );
  panel.template.addNewQuestion("text", "panelq1");

  panel.panelCount = 2;
  var p = panel.panels[0];
  var q = <Question>p.questions[0];

  assert.equal(q.getTitleLocation(), "top", "it is top by default");

  page.questionTitleLocation = "left";

  assert.equal(
    p.getQuestionTitleLocation(),
    "left",
    "it is left based on survey.questionTitleLocation"
  );
  assert.equal(
    q.getTitleLocation(),
    "left",
    "it is left based on survey.questionTitleLocation"
  );
  panel.templateTitleLocation = "bottom";
  assert.equal(
    q.getTitleLocation(),
    "bottom",
    "it is bottom, based on templateTitleLocation"
  );
});

QUnit.test("PanelDynamic, canAddPanel/canRemovePanel", function(assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("p");
  var panel = <QuestionPanelDynamicModel>page.addNewQuestion(
    "paneldynamic",
    "panel"
  );

  assert.equal(panel.canAddPanel, true, "By default you can add panel");
  assert.equal(panel.canRemovePanel, false, "There is no panels");
  panel.panelCount = 2;
  assert.equal(panel.canRemovePanel, true, "You can remove now");
  survey.setDesignMode(true);
  assert.equal(panel.canAddPanel, false, "You can't add in design mode");
  assert.equal(panel.canRemovePanel, false, "You can't delete in design mode");
  survey.setDesignMode(false);
  assert.equal(panel.canAddPanel, true, "You can add in run-time mode");
  assert.equal(panel.canRemovePanel, true, "You can delete in run-time mode");
  panel.allowAddPanel = false;
  panel.allowRemovePanel = false;
  assert.equal(panel.canAddPanel, false, "allowAddPanel = false");
  assert.equal(panel.canRemovePanel, false, "allowRemovePanel = false");
});

QUnit.test(
  "PanelDynamic, survey.clearInvisibleValues='onHidden', bug#806",
  function(assert) {
    var survey = new SurveyModel();
    survey.clearInvisibleValues = "onHidden";
    var page = survey.addNewPage("p");
    var panel = <QuestionPanelDynamicModel>page.addNewQuestion(
      "paneldynamic",
      "panel"
    );
    var q1 = <Question>panel.template.addNewQuestion("text", "panelq1");
    var q2 = <Question>panel.template.addNewQuestion("text", "panelq2");
    q2.visibleIf = "{panel.panelq1} = 'a'";

    panel.panelCount = 2;
    var p = panel.panels[0];
    var rq1 = <Question>p.questions[0];
    var rq2 = <Question>p.questions[1];

    assert.equal(rq2.isVisible, false, "the question is invisible");
    rq1.value = "a";
    assert.equal(rq2.isVisible, true, "the question is visible");
    rq2.value = "b";
    assert.equal(rq2.isEmpty(), false, "the value is set");
    rq1.value = "c";
    assert.equal(rq2.isVisible, false, "the question is invisible again");
    assert.equal(rq2.isEmpty(), true, "the question is empty");
  }
);

QUnit.test(
  "PanelDynamic, survey.clearInvisibleValues='onComplete', bug#806",
  function(assert) {
    var survey = new SurveyModel();
    survey.clearInvisibleValues = "onComplete";
    var page = survey.addNewPage("p");
    var panel = <QuestionPanelDynamicModel>page.addNewQuestion(
      "paneldynamic",
      "panel"
    );
    var q1 = <Question>panel.template.addNewQuestion("text", "panelq1");

    panel.panelCount = 2;
    var p = panel.panels[0];
    var rq1 = <Question>p.questions[0];

    rq1.value = "a";
    rq1.visible = false;
    assert.deepEqual(
      survey.data,
      { panel: [{ panelq1: "a" }, {}] },
      "The value is here"
    );
    survey.doComplete();
    assert.deepEqual(survey.data, { panel: [{}, {}] }, "The value is gone");
  }
);

QUnit.test("PanelDynamic, survey.onDanamicPanelAdd/Remove", function(assert) {
  var survey = new SurveyModel();
  survey.clearInvisibleValues = "onComplete";
  var page = survey.addNewPage("p");
  var panel = <QuestionPanelDynamicModel>page.addNewQuestion(
    "paneldynamic",
    "panel"
  );
  var q1 = <Question>panel.template.addNewQuestion("text", "panelq1");
  var questionName = "";
  var panelAddedCounter = 0;
  var panelRemovedCounter = 0;
  var panelIndex = -1;
  survey.onDynamicPanelAdded.add(function(survey, options) {
    questionName = options.question.name;
    panelAddedCounter++;
  });
  survey.onDynamicPanelRemoved.add(function(survey, options) {
    questionName = options.question.name;
    panelRemovedCounter++;
    panelIndex = options.panelIndex;
  });
  panel.panelCount = 2;
  assert.equal(panelAddedCounter, 0, "Nothing was added");
  assert.equal(panelRemovedCounter, 0, "Nothing was removed");
  panel.addPanel();
  assert.equal(panelAddedCounter, 1, "one panel was added");
  assert.equal(
    questionName,
    "panel",
    "the question was passed correctly on added"
  );
  questionName = "";
  panel.removePanel(1);
  assert.equal(panelAddedCounter, 1, "one panel was removed");
  assert.equal(
    questionName,
    "panel",
    "the question was passed correctly on removed"
  );
  assert.equal(panelIndex, 1, "the removed panel index is correct");
});
QUnit.test("PanelDynamic defaultValue in questions", function(assert) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "paneldynamic",
        name: "question1",
        templateElements: [
          {
            type: "text",
            name: "question2",
            defaultValue: "100"
          },
          {
            type: "dropdown",
            name: "question3",
            defaultValue: "item2",
            choices: ["item1", "item2", "item3"]
          }
        ]
      }
    ]
  });
  var question = <QuestionPanelDynamicModel>survey.getQuestionByName(
    "question1"
  );
  question.panelCount = 2;
  var textQuestion = <Question>question.panels[1].getQuestionByName(
    "question2"
  );
  var dropDownQuestion = <Question>question.panels[1].getQuestionByName(
    "question3"
  );
  assert.equal(textQuestion.value, "100", "The default value to text is set");
  assert.equal(
    dropDownQuestion.value,
    "item2",
    "The default value to dropdown is set"
  );
});

QUnit.test("Two PanelDynamic questions bound to the same value", function(
  assert
) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("p");
  var q1 = new QuestionPanelDynamicModel("q1");
  q1.valueName = "panel";
  q1.template.addNewQuestion("text", "t1");
  var q2 = new QuestionPanelDynamicModel("q2");
  q2.valueName = "panel";
  q2.template.addNewQuestion("text", "t1");
  q2.template.addNewQuestion("text", "t2");
  page.addElement(q1);
  page.addElement(q2);

  q1.panelCount = 1;
  assert.equal(q2.panelCount, 1, "By default there are two panels in panel2");
  q1.addPanel();
  assert.equal(q2.panelCount, 2, "One panel was added");
  q1.removePanel(1);
  assert.equal(q1.panelCount, 1, "q1: One panel was removed");
  assert.equal(q2.panelCount, 1, "q2: One panel was removed");
});

/* Think about this-
QUnit.test("PanelDynamic survey.getPageByQuestion/Element", function (assert) {
    var survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.addNewPage("p");
    var question = new QuestionPanelDynamicModel("q");
    survey.pages[0].addQuestion(question);
    question.template.addNewQuestion("text", "q1");
    question.template.addNewQuestion("text", "q2");
    question.panelCount = 2;
    assert.equal(survey.getPageByQuestion(question.template.questions[0]).name, "p", "Template question page is found");
    assert.equal(survey.getPageByQuestion(question.panels[0].questions[0]).name, "p", "Nested question page is found");
});
*/
