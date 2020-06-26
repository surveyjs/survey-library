import { Question } from "../src/question";
import { PanelModel } from "../src/panel";
import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";
import { SurveyModel } from "../src/survey";
import { CustomWidgetCollection } from "../src/questionCustomWidgets";
import { QuestionMultipleTextModel } from "../src/question_multipletext";
import { QuestionCheckboxModel } from "../src/question_checkbox";
import { QuestionRadiogroupModel } from "../src/question_radiogroup";
import { QuestionTextModel } from "../src/question_text";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { FunctionFactory } from "../src/functionsfactory";
import { ExpressionValidator } from "../src/validator";
import { QuestionFileModel } from "../src/question_file";

export default QUnit.module("Survey_QuestionPanelDynamic");

QUnit.test("Create panels based on template on setting value", function (
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

QUnit.test("Synhronize panelCount and value array length", function (assert) {
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

QUnit.test("Dynamic Panel, clearIncorrectValues", function (assert) {
  var question = new QuestionPanelDynamicModel("q");
  (<QuestionRadiogroupModel>(
    question.template.addNewQuestion("radiogroup", "q1")
  )).choices = [1, 2];
  (<QuestionRadiogroupModel>(
    question.template.addNewQuestion("radiogroup", "q2")
  )).choices = [1, 2, 3];

  question.value = [{ q1: 1 }, { q1: "val1" }, { q4: 3, q2: 5 }];
  question.clearIncorrectValues();
  assert.deepEqual(
    question.value,
    [{ q1: 1 }, {}, {}],
    "Remove incorrect values in all panels"
  );
});

QUnit.test(
  "By pass values from question.value into panel values and vice versa",
  function (assert) {
    var question = new QuestionPanelDynamicModel("q");
    question.template.addNewQuestion("text", "q1");
    question.template.addNewQuestion("text", "q2");
    question.value = [
      { q1: "item1_1", q2: "item1_2" },
      { q1: "item2_1", q2: "item2_2" },
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

QUnit.test("Change values in panels on changing in question.value", function (
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
    { q1: "item2_1", q2: "item2_2" },
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

QUnit.test("Load from Json", function (assert) {
  var json = {
    questions: [
      {
        type: "paneldynamic",
        name: "q",
        panelCount: 3,
        templateElements: [
          { type: "text", name: "q1" },
          { type: "text", name: "q2" },
        ],
      },
    ],
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
    { q1: "item2_1", q2: "item2_2" },
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

QUnit.test("Load from Json with nested panel", function (assert) {
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
            elements: [{ type: "text", name: "q2" }],
          },
        ],
      },
    ],
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
    { q1: "item2_1", q2: "item2_2" },
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

QUnit.test("Has errors", function (assert) {
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
QUnit.test("Update panels elements on changing template panel", function (
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

QUnit.test("Support visibleIf and panel variable", function (assert) {
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
QUnit.test(
  "Support visibleIf and panel variable, question.valueName",
  function (assert) {
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
  }
);
QUnit.test("Support panelIndex in visibleIf expression", function (assert) {
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

QUnit.test("Text Processing and panel variable, question.valueName", function (
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

QUnit.test("Text Processing from panel.data", function (assert) {
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

QUnit.test("Set panel value, question.valueName", function (assert) {
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

QUnit.test("Support panelIndex variable", function (assert) {
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
QUnit.test("remove Panel", function (assert) {
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
QUnit.test(
  "remove Panel Question from Page, Bug#184, in editor repo",
  function (assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("p");
    var question = new QuestionPanelDynamicModel("q");
    page.addElement(question);
    var q = question.template.addNewQuestion("text", "q1");
    assert.equal(question.template.elements.length, 1, "There is one element");
    page.removeElement(q);
    assert.equal(
      question.template.elements.length,
      0,
      "Template panel is empty"
    );
  }
);
QUnit.test("Process text in titles", function (assert) {
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
    "q1:val_q1",
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
  function (assert) {
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
  function (assert) {
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

QUnit.test("PanelDynamic in design time", function (assert) {
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
  question.panelCount = 0;
  assert.equal(question.panels.length, 1, "There are still one panel");
  assert.equal(question.currentIndex, -1, "It is -1 in list mode");
  question.renderMode = "progressTop";
  assert.equal(
    question.panels.length,
    1,
    "There are still one panel in non list mode"
  );
  assert.equal(
    question.currentIndex,
    0,
    "It is always zero  in non list mode at design-time"
  );
});
QUnit.test("PanelDynamic, question no", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("p");
  var question1 = <Question>page.addNewQuestion("text", "q1");
  var panel = <QuestionPanelDynamicModel>(
    page.addNewQuestion("paneldynamic", "panel")
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

QUnit.test("PanelDynamic, renderMode", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("p");
  var panel = <QuestionPanelDynamicModel>(
    page.addNewQuestion("paneldynamic", "panel")
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
QUnit.test("PanelDynamic, renderMode is not list + hasError", function (
  assert
) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("p");
  var panel = <QuestionPanelDynamicModel>(
    page.addNewQuestion("paneldynamic", "panel")
  );
  (<Question>(
    panel.template.addNewQuestion("text", "panelq1")
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
QUnit.test("PanelDynamic, keyName + hasError + getAllErrors", function (
  assert
) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("p");
  var panel = <QuestionPanelDynamicModel>(
    page.addNewQuestion("paneldynamic", "panel")
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
QUnit.test("PanelDynamic, keyName + hasError, Bug #1820", function (assert) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "paneldynamic",
        name: "relatives",
        templateTitle: "Information about: {panel.relativeType}",
        keyName: "relativeType",
        templateElements: [
          {
            name: "relativeType",
            type: "dropdown",
            choices: [
              "father",
              "mother",
              "brother",
              "sister",
              "son",
              "daughter",
            ],
          },
        ],
        panelCount: 2,
      },
    ],
  });
  survey.setValue("relatives", [
    { relativeType: "father" },
    { relativeType: "father" },
  ]);
  assert.equal(
    survey.currentPage.hasErrors(true),
    true,
    "There are two 'father' in keyName property"
  );
});

QUnit.test("assign customWidgets to questions in dynamic panel", function (
  assert
) {
  CustomWidgetCollection.Instance.clear();
  CustomWidgetCollection.Instance.addCustomWidget({
    name: "customWidget",
    isFit: (question) => {
      return question.name == "panelq2";
    },
  });
  var survey = new SurveyModel();
  var page = survey.addNewPage("p");
  var panel = <QuestionPanelDynamicModel>(
    page.addNewQuestion("paneldynamic", "panel")
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

QUnit.test("Auto generate names", function (assert) {
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
  function (assert) {
    var json = {
      questions: [
        {
          type: "paneldynamic",
          name: "q",
          panelCount: 1,
          templateElements: [
            { type: "text", name: "q1" },
            { type: "text", name: "q2" },
          ],
        },
      ],
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

QUnit.test("Set panel count to 0, Editor bug#228", function (assert) {
  var json = {
    questions: [
      {
        type: "paneldynamic",
        name: "q",
        templateElements: [
          { type: "text", name: "q1" },
          { type: "text", name: "q2" },
        ],
      },
    ],
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

QUnit.test("PanelDynamic, question.getTitleLocation(), bug#800", function (
  assert
) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("p");
  var panel = <QuestionPanelDynamicModel>(
    page.addNewQuestion("paneldynamic", "panel")
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

QUnit.test("PanelDynamic, canAddPanel/canRemovePanel", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("p");
  var panel = <QuestionPanelDynamicModel>(
    page.addNewQuestion("paneldynamic", "panel")
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
  function (assert) {
    var survey = new SurveyModel();
    survey.clearInvisibleValues = "onHidden";
    var page = survey.addNewPage("p");
    var panel = <QuestionPanelDynamicModel>(
      page.addNewQuestion("paneldynamic", "panel")
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
  function (assert) {
    var survey = new SurveyModel();
    survey.clearInvisibleValues = "onComplete";
    var page = survey.addNewPage("p");
    var panel = <QuestionPanelDynamicModel>(
      page.addNewQuestion("paneldynamic", "panel")
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

QUnit.test("PanelDynamic, survey.onDanamicPanelAdd/Remove", function (assert) {
  var survey = new SurveyModel();
  survey.clearInvisibleValues = "onComplete";
  var page = survey.addNewPage("p");
  var panel = <QuestionPanelDynamicModel>(
    page.addNewQuestion("paneldynamic", "panel")
  );
  var q1 = <Question>panel.template.addNewQuestion("text", "panelq1");
  var questionName = "";
  var panelAddedCounter = 0;
  var panelRemovedCounter = 0;
  var panelIndex = -1;
  survey.onDynamicPanelAdded.add(function (survey, options) {
    questionName = options.question.name;
    panelAddedCounter++;
  });
  survey.onDynamicPanelRemoved.add(function (survey, options) {
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
QUnit.test("PanelDynamic defaultValue in questions", function (assert) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "paneldynamic",
        name: "question1",
        templateElements: [
          {
            type: "text",
            name: "question2",
            defaultValue: "100",
          },
          {
            type: "dropdown",
            name: "question3",
            defaultValue: "item2",
            choices: ["item1", "item2", "item3"],
          },
        ],
      },
    ],
  });
  var question = <QuestionPanelDynamicModel>(
    survey.getQuestionByName("question1")
  );
  question.panelCount = 2;
  var textQuestion = <Question>(
    question.panels[1].getQuestionByName("question2")
  );
  var dropDownQuestion = <Question>(
    question.panels[1].getQuestionByName("question3")
  );
  assert.equal(textQuestion.value, "100", "The default value to text is set");
  assert.equal(
    dropDownQuestion.value,
    "item2",
    "The default value to dropdown is set"
  );
});

QUnit.test("Two PanelDynamic questions bound to the same value", function (
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
QUnit.test(
  "PanelDynamic vs MatrixDynamic questions bound to the same value on different pages, bug#T464",
  function (assert) {
    var survey = new SurveyModel();
    var page1 = survey.addNewPage("p1");
    var page2 = survey.addNewPage("p2");
    var matrix = new QuestionMatrixDynamicModel("q1");
    matrix.valueName = "val";
    matrix.addColumn("t1");
    matrix.rowCount = 1;
    var panel = new QuestionPanelDynamicModel("q2");
    panel.valueName = "val";
    panel.template.addNewQuestion("text", "t1");
    panel.template.addNewQuestion("text", "t2");
    page1.addElement(matrix);
    page2.addElement(panel);

    matrix.value = [{ t1: "test" }];
    assert.equal(
      panel.panelCount,
      1,
      "By default there are two panels in panel2"
    );
    matrix.value = [{ t1: "test" }, { t1: "test2" }];
    assert.equal(panel.panelCount, 2, "One row and one panel were added");
    matrix.removeRow(1);
    assert.equal(matrix.rowCount, 1, "matrix: One row was removed");
    assert.equal(panel.panelCount, 1, "panel: One panel was removed");
  }
);

QUnit.test(
  "PanelDynamic vs MatrixDynamic add/remove items, bug#T2130",
  function (assert) {
    var json = {
      elements: [
        {
          type: "matrixdynamic",
          rowCount: 1,
          name: "employer_names",
          valueName: "employers",
          columns: [
            {
              name: "RowId",
              cellType: "expression",
              expression: "{rowIndex}",
            },
            {
              name: "name",
              isRequired: true,
              cellType: "text",
            },
          ],
        },
        {
          type: "paneldynamic",
          renderMode: "list",
          allowAddPanel: false,
          allowRemovePanel: false,
          name: "arrray_employer_info",
          valueName: "employers",
          templateTitle: "{panel.name}",
          templateElements: [
            {
              type: "text",
              name: "address",
            },
            {
              type: "text",
              name: "abn",
            },
          ],
        },
      ],
    };
    var survey = new SurveyModel(json);
    var matrix = <QuestionMatrixDynamicModel>(
      survey.getQuestionByName("employer_names")
    );
    var panel = <QuestionPanelDynamicModel>(
      survey.getQuestionByName("arrray_employer_info")
    );
    matrix.visibleRows[0].cells[1].question.value = 1;
    matrix.addRow();
    matrix.visibleRows[1].cells[1].question.value = 2;
    matrix.addRow();
    matrix.visibleRows[2].cells[1].question.value = 3;
    assert.equal(panel.panels.length, 3, "There are 3 panels");
    assert.equal(
      panel.panels[0].locTitle.renderedHtml,
      "1",
      "The first panel title is correct"
    );
    assert.equal(
      panel.panels[1].locTitle.renderedHtml,
      "2",
      "The second panel title is correct"
    );
    assert.equal(
      panel.panels[2].locTitle.renderedHtml,
      "3",
      "The third panel title is correct"
    );
    panel.panels[0].getQuestionByName("address").value = "address: row1";
    panel.panels[2].getQuestionByName("address").value = "address: row3";
    matrix.removeRow(1);
    assert.equal(panel.panels.length, 2, "There are two panels now");
    assert.equal(
      panel.panels[0].locTitle.renderedHtml,
      "1",
      "The first panel title is still correct"
    );
    assert.equal(
      panel.panels[1].locTitle.renderedHtml,
      "3",
      "The second panel title is 3 now"
    );
    assert.deepEqual(
      survey.data,
      {
        employers: [
          { RowId: 1, name: 1, address: "address: row1" },
          { RowId: 2, name: 3, address: "address: row3" },
        ],
      },
      "The value is correct"
    );
  }
);

QUnit.test("panelDynamic.addConditionObjectsByContext", function (assert) {
  var objs = [];
  var panel = new QuestionPanelDynamicModel("panel");
  panel.title = "Panel";
  var q1 = panel.template.addNewQuestion("text", "q1");
  var question = new QuestionMultipleTextModel("q2");
  question.title = "Question 2";
  question.addItem("item1");
  question.addItem("item2");
  panel.template.addQuestion(question);
  panel.addConditionObjectsByContext(objs, null);
  for (var i = 0; i < objs.length; i++) {
    objs[i].question = objs[i].question.name;
  }
  assert.deepEqual(
    objs,
    [
      { name: "panel[0].q1", text: "Panel[0].q1", question: "q1" },
      {
        name: "panel[0].q2.item1",
        text: "Panel[0].Question 2.item1",
        question: "q2",
      },
      {
        name: "panel[0].q2.item2",
        text: "Panel[0].Question 2.item2",
        question: "q2",
      },
    ],
    "addConditionObjectsByContext work correctly for panel dynamic"
  );
  objs = [];
  panel.addConditionObjectsByContext(objs, q1);
  for (var i = 0; i < objs.length; i++) {
    objs[i].question = objs[i].question.name;
  }
  assert.deepEqual(
    objs,
    [
      { name: "panel[0].q1", text: "Panel[0].q1", question: "q1" },
      {
        name: "panel[0].q2.item1",
        text: "Panel[0].Question 2.item1",
        question: "q2",
      },
      {
        name: "panel[0].q2.item2",
        text: "Panel[0].Question 2.item2",
        question: "q2",
      },
      {
        name: "panel.q2.item1",
        text: "panel.Question 2.item1",
        question: "q2",
      },
      {
        name: "panel.q2.item2",
        text: "panel.Question 2.item2",
        question: "q2",
      },
    ],
    "addConditionObjectsByContext work correctly for panel dynamic"
  );
});

QUnit.test("matrixDynamic.getConditionJson", function (assert) {
  var panel = new QuestionPanelDynamicModel("panel");
  (<QuestionCheckboxModel>(
    panel.template.addNewQuestion("checkbox", "q1")
  )).choices = [1, 2];
  var question = new QuestionMultipleTextModel("q2");
  question.addItem("item1");
  question.addItem("item2");
  panel.template.addQuestion(question);
  var json = panel.getConditionJson("equals", "q1");
  assert.deepEqual(json.choices, [1, 2], "choices get correctly");
  json = panel.getConditionJson("equals", "q2.item2");
  assert.equal(json.type, "text", "mutliple item type get correctly");
});

QUnit.test("matrixDynamic.panelsState, set value", function (assert) {
  var panel = new QuestionPanelDynamicModel("panel");
  panel.templateTitle = "Panel Title";
  panel.template.addNewQuestion("text", "q1");
  panel.panelCount = 2;
  assert.equal(panel.panelsState, "default", "The default value is normal");
  assert.equal(
    panel.panels[0].state,
    "default",
    "The default value for all panels is normal"
  );
  panel.panelsState = "expanded";
  assert.equal(
    panel.panels[0].state,
    "expanded",
    "panelsState = 'expanded', the first panel is expanded"
  );
  assert.equal(
    panel.panels[1].state,
    "expanded",
    "panelsState = 'expanded', the second panel is expanded"
  );
  panel.panelsState = "collapsed";
  assert.equal(
    panel.panels[0].state,
    "collapsed",
    "panelsState = 'collapsed', the first panel is collapsed"
  );
  assert.equal(
    panel.panels[1].state,
    "collapsed",
    "panelsState = 'collapsed', the second panel is collapsed"
  );
  panel.panelsState = "firstExpanded";
  assert.equal(
    panel.panels[0].state,
    "expanded",
    "panelsState = 'firstExpanded', the first panel is expanded"
  );
  assert.equal(
    panel.panels[1].state,
    "collapsed",
    "panelsState = 'firstExpanded', the second panel is collapsed"
  );
  panel.panelsState = "default";
  assert.equal(
    panel.panels[0].state,
    "default",
    "panelsState = 'default', the first panel has default state"
  );
  assert.equal(
    panel.panels[1].state,
    "default",
    "panelsState = 'default', the second panel has default state"
  );
});

QUnit.test("matrixDynamic.panelsState and not panel.title", function (assert) {
  var panel = new QuestionPanelDynamicModel("panel");
  panel.template.addNewQuestion("text", "q1");
  panel.panelCount = 2;
  assert.equal(panel.panelsState, "default", "The default value is normal");
  assert.equal(
    panel.panels[0].state,
    "default",
    "The default value for all panels is normal"
  );
  panel.panelsState = "collapsed";
  assert.equal(
    panel.panels[0].state,
    "default",
    "panelsState = 'expanded', by panel title is empty"
  );
  panel.panelsState = "firstExpanded";
  assert.equal(
    panel.panels[0].state,
    "default",
    "panelsState = 'firstExpanded', but panel.title is empty"
  );
});

QUnit.test("matrixDynamic.panelsState, add panel always expanded", function (
  assert
) {
  var panel = new QuestionPanelDynamicModel("panel");
  panel.template.addNewQuestion("text", "q1");
  panel.templateTitle = "Some text";
  panel.panelCount = 2;
  panel.addPanelUI();
  assert.equal(
    panel.panels[2].state,
    "default",
    "User can't collapse/expand the panel"
  );
  panel.panelsState = "expanded";
  assert.equal(panel.panels[2].state, "expanded", "It is expanded now");
  panel.addPanelUI();
  assert.equal(
    panel.panels[3].state,
    "expanded",
    "the panel is added with expanded state"
  );
  panel.panelsState = "collapsed";
  panel.addPanelUI();
  assert.equal(
    panel.panels[4].state,
    "expanded",
    "Also the panelsState = 'collapsed' the panel is added with expanded state"
  );
});
QUnit.test("matrixDynamic.panelsState, load from json", function (assert) {
  var json = {
    questions: [
      {
        type: "paneldynamic",
        name: "q",
        panelCount: 2,
        panelsState: "firstExpanded",
        templateElements: [{ type: "text", name: "q1" }],
        templateTitle: "Some text",
      },
    ],
  };
  var survey = new SurveyModel(json);
  var panel = <QuestionPanelDynamicModel>survey.getQuestionByName("q");
  assert.equal(
    panel.panels[0].state,
    "expanded",
    "The first panel is expanded"
  );
  assert.equal(
    panel.panels[1].state,
    "collapsed",
    "The second panel is collapsed"
  );
});
QUnit.test(
  "matrixDynamic.panelsState, not tempalteTitle load from json",
  function (assert) {
    var json = {
      questions: [
        {
          type: "paneldynamic",
          name: "q",
          panelCount: 2,
          panelsState: "firstExpanded",
          templateElements: [{ type: "text", name: "q1" }],
        },
      ],
    };
    var survey = new SurveyModel(json);
    var panel = <QuestionPanelDynamicModel>survey.getQuestionByName("q");
    assert.equal(
      panel.panels[0].state,
      "default",
      "First panel, not templateTitle"
    );
    assert.equal(
      panel.panels[1].state,
      "default",
      "Second panel, not templateTitle"
    );
  }
);
QUnit.test(
  "Dynamic Panel, multiple text question and validation, Bug#1037",
  function (assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("page");
    var panel = new QuestionPanelDynamicModel("q");
    var question = <QuestionMultipleTextModel>(
      panel.template.addNewQuestion("multipletext", "q1")
    );
    question.addItem("item1");
    question.addItem("item2");
    page.addElement(panel);
    survey.onValidateQuestion.add(function (survey, options) {
      if (options.name != "q1") return;
      var v1 = !!options.value ? options.value["item1"] : null;
      var v2 = !!options.value ? options.value["item2"] : null;
      if (!v1 || !v2) {
        options.error = "all items should be set";
        return;
      }
      if (v1 < 5) {
        options.error = "item1 should be more than 4";
      }
      if (v2 < 10) {
        options.error = "item2 should be more than 9";
      }
    });

    panel.panelCount = 1;
    panel.panels[0].questions[0].value = {};

    assert.equal(page.hasErrors(), true, "There are errors items are empty");

    panel.panels[0].questions[0].value = { item1: 5, item2: 5 };
    assert.equal(page.hasErrors(), true, "There is error item2 less than 10");
    panel.panels[0].questions[0].value = { item1: 5, item2: 11 };
    assert.equal(page.hasErrors(), false, "There is no errors");
  }
);
QUnit.test("Dynamic Panel, survey in readonly mode, Bug#1051", function (
  assert
) {
  var json = {
    questions: [
      {
        type: "paneldynamic",
        name: "panel",
        panelCount: 2,
        templateElements: [
          {
            type: "text",
            name: "q1",
          },
        ],
      },
      {
        type: "text",
        name: "q2",
      },
    ],
  };
  var survey = new SurveyModel(json);
  var panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
  var question = <QuestionTextModel>survey.getQuestionByName("q2");
  assert.ok(panel.panels[0].questions[0].survey, "The survey is set");
  assert.equal(
    panel.panels[0].questions[0].isReadOnly,
    false,
    "The question is not readonly"
  );
  survey.mode = "display";
  assert.equal(question.isReadOnly, true, "The standard question is readonly");
  assert.equal(
    panel.panels[0].questions[0].isReadOnly,
    true,
    "The question in dynamic panel should be readonly"
  );
});

QUnit.test(
  "Dynamic Panel readOnly, Bug#https://surveyjs.answerdesk.io/ticket/details/T1663",
  function (assert) {
    var json = {
      questions: [
        {
          type: "paneldynamic",
          name: "panel",
          readOnly: true,
          panelCount: 2,
          templateElements: [
            {
              type: "text",
              name: "q1",
            },
          ],
        },
      ],
    };
    var survey = new SurveyModel(json);
    var panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    var question = panel.panels[0].questions[0];
    assert.equal(
      question.isReadOnly,
      true,
      "The question is readonly initially"
    );
    panel.readOnly = false;
    assert.equal(
      question.isReadOnly,
      false,
      "The question is not readonly, panel is not readOnly"
    );
    survey.pages[0].readOnly = true;
    assert.equal(
      question.isReadOnly,
      true,
      "The question is readonly, page is readOnly"
    );
    survey.pages[0].readOnly = false;
    assert.equal(
      question.isReadOnly,
      false,
      "The question is not readonly again"
    );
    survey.mode = "display";
    assert.equal(
      question.isReadOnly,
      true,
      "The question is readonly, survey mode is display"
    );
  }
);

QUnit.test("Dynamic Panel, doesn't work with isSinglePage, Bug#1082", function (
  assert
) {
  var json = {
    isSinglePage: true,
    elements: [
      {
        type: "paneldynamic",
        name: "panel",
        panelCount: 2,
        templateElements: [
          {
            type: "text",
            name: "q1",
          },
        ],
      },
    ],
  };
  var survey = new SurveyModel(json);
  var panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
  assert.ok(panel.template.survey, "The survey is set for template");
  assert.ok(panel.panels[0].questions[0].survey, "The survey is set for panel");
});

QUnit.test(
  "Dynamic Panel, doesn't work with isSinglePage, Bug#T1527",
  function (assert) {
    var json = {
      pages: [
        {
          name: "page1",
          elements: [
            {
              type: "matrixdynamic",
              rowCount: 1,
              name: "employer_names",
              valueName: "employers",
              columns: [
                {
                  name: "name",
                  cellType: "text",
                },
              ],
            },
          ],
        },
        {
          name: "page2",
          elements: [
            {
              type: "paneldynamic",
              renderMode: "list",
              name: "arrray_employer_info",
              valueName: "employers",
              templateElements: [
                {
                  type: "panel",
                  name: "panel_employer_role",
                  elements: [
                    {
                      type: "radiogroup",
                      choices: ["Full time", "Part time", "Casual", "Seasonal"],
                      name: "employer_role",
                      valueName: "role",
                    },
                  ],
                },
                {
                  type: "panel",
                  name: "panel_employer_hours_work",
                  title: "What hours do you work?",
                  elements: [
                    {
                      type: "text",
                      inputType: "number",
                      name: "member_hours_worked",
                      valueName: "hours_worked",
                      title: "Hours:",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };
    var survey = new SurveyModel(json);
    survey.mode = "display";

    survey.data = {
      employers: [
        {
          name: "aaaa",
          address: "sasa",
          role: "Full time",
          hours_worked: 4,
        },
        {
          name: "bbbb",
          address: "aaaaa",
          role: "Part time",
          hours_worked: 4,
        },
      ],
    };

    survey.isSinglePage = true;
    var dPanel = <QuestionPanelDynamicModel>(
      survey.getQuestionByName("arrray_employer_info")
    );
    assert.ok(dPanel, "Get question correctly");
    assert.equal(dPanel.panelCount, 2, "There should be two panels");
  }
);

QUnit.test(
  "Nested dynamic panel doesn't set data correctly, Bug#1096",
  function (assert) {
    var json = {
      isSinglePage: true,
      elements: [
        {
          type: "paneldynamic",
          name: "panel1",
          templateElements: [
            { type: "text", name: "q1" },
            {
              type: "paneldynamic",
              name: "nested1",
              templateElements: [{ type: "text", name: "q2" }],
            },
          ],
        },
      ],
    };
    var survey = new SurveyModel(json);
    survey.data = {
      panel1: [
        { q1: 1, nested1: [{ q2: 1 }] },
        { q1: 2, nested1: [{ q2: 1 }, { q2: 2 }, { q2: 3 }] },
      ],
    };
    var panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel1");
    var panel1 = panel.panels[0];
    var panel2 = panel.panels[1];
    var panel1Nested1 = <QuestionPanelDynamicModel>(
      panel1.getQuestionByName("nested1")
    );
    var panel2Nested1 = <QuestionPanelDynamicModel>(
      panel2.getQuestionByName("nested1")
    );
    assert.equal(
      panel1.getQuestionByName("q1").value,
      1,
      "q1 in first panel set correctly"
    );
    assert.equal(
      panel2.getQuestionByName("q1").value,
      2,
      "q1 in second panel set correctly"
    );
    assert.equal(
      panel1Nested1.panelCount,
      1,
      "There should be one panel in the first nested panel"
    );
    assert.equal(
      panel1Nested1.panels[0].getQuestionByName("q2").value,
      1,
      "q2 set correctly in the first nested panel"
    );
    assert.equal(
      panel2Nested1.panelCount,
      3,
      "There should be three panels in the second nested panel"
    );
    assert.equal(
      panel2Nested1.panels[0].getQuestionByName("q2").value,
      1,
      "first q2 set correctly in the second nested panel"
    );
    assert.equal(
      panel2Nested1.panels[1].getQuestionByName("q2").value,
      2,
      "second q2 set correctly in the second nested panel"
    );
    assert.equal(
      panel2Nested1.panels[2].getQuestionByName("q2").value,
      3,
      "third q2 set correctly in the second nested panel"
    );
  }
);

QUnit.test(
  "visibleIf and add new panel in child paneldynamic bug #1139",
  function (assert) {
    var json = {
      pages: [
        {
          name: "page1",
          elements: [
            {
              type: "paneldynamic",
              name: "question1",
              templateElements: [
                {
                  type: "radiogroup",
                  name: "question2",
                  choices: ["item1", "item2", "item3"],
                },
                {
                  type: "paneldynamic",
                  name: "question3",
                  minPanelCount: 1,
                  visibleIf: "{panel.question2} notempty",
                  templateElements: [
                    {
                      type: "text",
                      name: "question4",
                      title: "Input",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    var survey = new SurveyModel(json);

    var rootPanel = <QuestionPanelDynamicModel>(
      survey.getQuestionByName("question1")
    );
    var rootPanelEl1 = rootPanel.addPanel();
    var question2 = rootPanelEl1.getQuestionByName("question2");
    var question3 = <QuestionPanelDynamicModel>(
      rootPanelEl1.getQuestionByName("question3")
    );

    assert.notOk(question3.isVisible, "Child panel is hidden");
    question2.value = "item1";
    assert.ok(question3.isVisible, "Child panel become visible");
    var childPanelEl1 = question3.addPanel();
    assert.ok(question3.isVisible, "Child panel still visible");
  }
);

QUnit.test(
  "panel.defaultPanelValue, apply from json and then from UI",
  function (assert) {
    var json = {
      elements: [
        {
          type: "paneldynamic",
          name: "dPanel",
          elements: [
            { type: "text", name: "q1" },
            { type: "text", name: "q2" },
            { type: "text", name: "q3" },
          ],
          panelCount: 2,
          defaultPanelValue: { q1: "val1", q3: "val3" },
        },
      ],
    };
    var survey = new SurveyModel(json);
    var question = <QuestionPanelDynamicModel>(
      survey.getQuestionByName("dPanel")
    );
    assert.deepEqual(
      question.value,
      [
        { q1: "val1", q3: "val3" },
        { q1: "val1", q3: "val3" },
      ],
      "defaultPanelValue set correctly on json loading"
    );
    question.addPanel();
    assert.deepEqual(
      question.value,
      [
        { q1: "val1", q3: "val3" },
        { q1: "val1", q3: "val3" },
        { q1: "val1", q3: "val3" },
      ],
      "defaultPanelValue set correclty on adding row"
    );
  }
);

QUnit.test(
  "matrix.defaultRowValue, defaultValue has higher priority than defaultRowValue",
  function (assert) {
    var json = {
      elements: [
        {
          type: "paneldynamic",
          name: "dPanel",
          templateElements: [
            { type: "text", name: "q1" },
            { type: "text", name: "q2" },
            { type: "text", name: "q3" },
          ],
          panelCount: 2,
          defaultPanelValue: { q1: "val1", q3: "val3" },
          defaultValue: [
            { q1: "v1", q2: "v2" },
            { q1: "v11", q3: "v3" },
          ],
        },
      ],
    };

    var survey = new SurveyModel(json);
    var question = <QuestionPanelDynamicModel>(
      survey.getQuestionByName("dPanel")
    );
    assert.deepEqual(
      question.value,
      [
        { q1: "v1", q2: "v2" },
        { q1: "v11", q3: "v3" },
      ],
      "defaultValue is used"
    );
  }
);

QUnit.test("Synhronize elements on changing template", function (assert) {
  var question = new QuestionPanelDynamicModel("q");
  question.template.addNewQuestion("text", "q1");
  question.template.addNewQuestion("text", "q2");
  question.panelCount = 2;
  assert.equal(question.panels[0].elements.length, 2, "There are two elements");
  question.template.addNewQuestion("text", "q3");
  assert.equal(
    question.panels[0].elements.length,
    3,
    "There are three elements"
  );
  question.template.removeQuestion(question.template.questions[0]);
  assert.equal(
    question.panels[0].elements.length,
    2,
    "There are two elements again"
  );
  assert.equal(
    question.panels[0].questions[0].name,
    "q2",
    "The first element is 'q2"
  );
});

QUnit.test("synhronize on template question property change", function (
  assert
) {
  var json = {
    elements: [
      {
        type: "paneldynamic",
        name: "dPanel",
        templateElements: [
          { type: "text", name: "q1" },
          { type: "checkbox", name: "q2", choices: [1, 2] },
          {
            type: "panel",
            name: "p1",
            elements: [{ type: "text", name: "p1_q1" }],
          },
        ],
        panelCount: 2,
      },
    ],
  };

  var survey = new SurveyModel(json);
  var question = <QuestionPanelDynamicModel>survey.getQuestionByName("dPanel");
  var q1_1 = question.panels[0].elements[0];
  var q1_2 = question.panels[1].elements[0];
  var q2_1 = question.panels[0].elements[1];
  var q2_2 = question.panels[1].elements[1];
  (<QuestionTextModel>question.templateElements[0]).title = "title1";
  (<QuestionCheckboxModel>question.templateElements[1]).choices = [1, 2, 3];
  assert.equal((<QuestionTextModel>q1_1).title, "title1", "q1_1 title changed");
  assert.equal((<QuestionTextModel>q1_2).title, "title1", "q1_2 title changed");
  assert.equal(
    (<QuestionCheckboxModel>q2_1).choices.length,
    3,
    "q2_1 choices changed"
  );
  assert.deepEqual(
    (<QuestionCheckboxModel>q2_2).choices.length,
    3,
    "q2_2 choices changed"
  );
  var q3 = <QuestionTextModel>question.template.addNewQuestion("text", "q3");
  var q3_1 = <QuestionTextModel>question.panels[0].getQuestionByName("q3");
  assert.equal(q3_1.title, "q3", "The title is empty");
  q3.title = "title_3";
  assert.equal(
    q3_1.title,
    "title_3",
    "The title for added question has been changed"
  );
  var p1_q1 = <QuestionTextModel>question.template.getQuestionByName("p1_q1");
  var q3_q1_1 = <QuestionTextModel>(
    question.panels[0].getQuestionByName("p1_q1")
  );
  p1_q1.title = "title_in_panel";
  assert.equal(
    q3_q1_1.title,
    "title_in_panel",
    "The title for a question in a panel has been changed"
  );
});

QUnit.test(
  "synhronize on template question property change bug #1278",
  function (assert) {
    var json = {
      elements: [
        {
          type: "paneldynamic",
          name: "dPanel",
          templateElements: [
            { type: "text", name: "q1" },
            { type: "checkbox", name: "q2", choices: [1, 2] },
            {
              type: "panel",
              name: "p1",
              elements: [{ type: "text", name: "p1_q1" }],
            },
          ],
          panelCount: 2,
        },
      ],
    };

    var survey = new SurveyModel(json);
    var question = <QuestionPanelDynamicModel>(
      survey.getQuestionByName("dPanel")
    );
    assert.equal(
      question.panels[0].elements[0].isVisible,
      true,
      "The first question is visible"
    );
    question.templateElements[0].visible = false;
    assert.equal(
      question.panels[0].elements[0].isVisible,
      false,
      "The first question is not visible now"
    );
  }
);

QUnit.test("Test defaultValueFromLastPanel property", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("page");
  var question = <QuestionPanelDynamicModel>(
    page.addNewQuestion("paneldynamic", "question")
  );
  question.panelCount = 0;
  question.template.addNewQuestion("text", "q1");
  question.template.addNewQuestion("text", "q2");
  question.template.addNewQuestion("text", "q3");
  question.defaultValueFromLastPanel = true;
  question.addPanel();
  assert.equal(question.isEmpty(), true, "It is empty");
  question.value = [{ q1: 1, q2: 2 }];
  question.addPanel();
  assert.deepEqual(
    question.value,
    [
      { q1: 1, q2: 2 },
      { q1: 1, q2: 2 },
    ],
    "defaultValueFromLastPanel is working"
  );
  question.defaultPanelValue = { q1: 11, q3: 3 };
  question.addPanel();
  assert.deepEqual(
    question.value,
    [
      { q1: 1, q2: 2 },
      { q1: 1, q2: 2 },
      { q1: 1, q2: 2, q3: 3 },
    ],
    "defaultValueFromLastRow is merging with defaultPanelValue"
  );
});
QUnit.test("Generates error on clearIncorrectValue()", function (assert) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "paneldynamic",
        name: "qid68",
        visible: false,
        visibleIf: "{qid752} contains 'OUI'",
        isRequired: true,
        templateElements: [
          {
            type: "text",
            name: "pnd1790",
          },
          {
            type: "dropdown",
            name: "pnd72",
          },
          {
            type: "radiogroup",
            name: "pnd1791",
          },
        ],
        panelCount: 1,
      },
    ],
  });
  survey.data = {
    qid1760: "teste",
    qid1761: "tygjhg",
    qid1792: "OUI",
    qid1787: [{ pnd1788: "teste" }],
  };
  survey.clearIncorrectValues();
  assert.deepEqual(
    survey.data,
    {
      qid1760: "teste",
      qid1761: "tygjhg",
      qid1792: "OUI",
      qid1787: [{ pnd1788: "teste" }],
      qid68: [{}],
    },
    "Do not touch anything"
  );
});

QUnit.test("Panel dynamic and survey.data setup", function (assert) {
  var json = {
    isSinglePage: true,
    elements: [
      {
        type: "paneldynamic",
        renderMode: "progressTop",
        name: "p1",
        panelCount: 2,
        templateElements: [
          {
            type: "text",
            name: "q1",
          },
        ],
      },
    ],
  };

  var survey = new SurveyModel(json);

  survey.data = {};

  survey.clearIncorrectValues();
  assert.deepEqual(
    survey.data,
    { p1: [{}, {}] },
    "Remove panels if set empty data"
  );
});
QUnit.test(
  "Panel dynamic nested dynamic panel and display mode, Bug#1488",
  function (assert) {
    var json = {
      elements: [
        {
          type: "paneldynamic",
          name: "question1",
          templateElements: [
            {
              type: "paneldynamic",
              name: "question2",
              title: "Inner dynamic panel",
              templateElements: [
                {
                  type: "text",
                  name: "question3",
                },
              ],
              panelCount: 2,
            },
            {
              type: "checkbox",
              name: "question4",
              title: "Checkbox question",
              choices: ["item1", "item2", "item3"],
            },
          ],
          panelCount: 1,
        },
      ],
      mode: "display",
    };

    var survey = new SurveyModel(json);
    var panel1 = <QuestionPanelDynamicModel>(
      survey.getQuestionByName("question1")
    );
    var question4 = <QuestionPanelDynamicModel>(
      panel1.panels[0].getQuestionByName("question4")
    );
    assert.equal(question4.isReadOnly, true, "The question should be readonly");
    var panel2 = <QuestionPanelDynamicModel>(
      panel1.panels[0].getQuestionByName("question2")
    );
    assert.ok(
      panel2.survey,
      "survey is set correctly to the nest dynamic panel"
    );
    var question3 = panel2.panels[0].getQuestionByName("question3");
    assert.ok(
      question3.survey,
      "survey is set correctly to the nest dynamic panel question"
    );
    assert.equal(
      question3.isReadOnly,
      true,
      "The question inside the nested dynamic panel should be readonly"
    );
  }
);

QUnit.test("Panel dynamic nested dynamic panel and result, Bug#1514", function (
  assert
) {
  var ljson = {
    pages: [
      {
        name: "page1",
        elements: [
          {
            type: "paneldynamic",
            name: "dp1",
            templateElements: [
              {
                type: "paneldynamic",
                name: "dp2",
                templateElements: [
                  {
                    type: "text",
                    name: "q1",
                  },
                ],
                panelCount: 1,
              },
            ],
            panelCount: 1,
          },
        ],
      },
    ],
  };
  var lsurvey = new SurveyModel(ljson);
  assert.deepEqual(
    lsurvey.data,
    { dp1: [{ dp2: [{}] }] },
    "Has only one element in they array"
  );

  var dp1 = <QuestionPanelDynamicModel>(
    lsurvey.currentPage.getQuestionByName("dp1")
  );
  var dp2 = <QuestionPanelDynamicModel>dp1.panels[0].getQuestionByName("dp2");
  var q1 = dp2.panels[0].questions[0];
  q1.value = "val1";
  assert.deepEqual(
    lsurvey.data,
    { dp1: [{ dp2: [{ q1: "val1" }] }] },
    "The result is correct"
  );
  var json = {
    pages: [
      {
        name: "page1",
        elements: [
          {
            type: "paneldynamic",
            name: "dp1",
            templateElements: [
              {
                type: "paneldynamic",
                name: "dp2",
                templateElements: [
                  {
                    type: "paneldynamic",
                    name: "dp3",
                    templateElements: [
                      {
                        type: "paneldynamic",
                        name: "dp4",
                        templateElements: [
                          {
                            type: "text",
                            name: "q1",
                            defaultValue: "val1",
                          },
                        ],
                        panelCount: 1,
                      },
                    ],
                    panelCount: 1,
                  },
                ],
                panelCount: 1,
              },
            ],
            panelCount: 1,
          },
        ],
      },
    ],
  };
  var survey = new SurveyModel(json);
  assert.deepEqual(
    survey.data,
    { dp1: [{ dp2: [{ dp3: [{ dp4: [{ q1: "val1" }] }] }] }] },
    "The result is correct"
  );
});

QUnit.test(
  "Bug on caching panel data during onValueChanged event, Bug#T1533",
  function (assert) {
    var json = {
      elements: [
        {
          type: "paneldynamic",
          name: "dp1",
          templateElements: [
            {
              type: "text",
              name: "q1",
            },
            {
              type: "checkbox",
              valueName: "v2",
              name: "q2",
            },
          ],
          panelCount: 1,
        },
      ],
    };
    var survey = new SurveyModel(json);
    var changedValue = null;
    survey.onDynamicPanelItemValueChanged.add(function (sender, options) {
      if (options.name != "q1") return;
      var q2 = options.panel.getQuestionByName("q2");
      q2.value = [1, 2, 3];
      changedValue = q2.value;
    });
    var dp1 = <QuestionPanelDynamicModel>survey.getQuestionByName("dp1");
    var q1 = dp1.panels[0].getQuestionByName("q1");
    q1.value = "val1";
    assert.deepEqual(changedValue, [1, 2, 3], "value set correctly");
  }
);

QUnit.test(
  "Bug on visibleIf in dynamic panel + dynamic matrix, Bug#T1716",
  function (assert) {
    var json = {
      elements: [
        {
          type: "matrixdynamic",
          name: "entities",
          columns: [
            {
              name: "q3",
              cellType: "text",
              isRequired: true,
            },
          ],
          rowCount: 1,
        },
        {
          type: "paneldynamic",
          name: "entities_info",
          valueName: "entities",
          templateElements: [
            {
              type: "radiogroup",
              name: "q1",
              choices: ["a", "b"],
            },
            {
              type: "text",
              name: "q2",
              visibleIf: "{panel.q1} = 'b'",
            },
          ],
        },
      ],
    };
    var survey = new SurveyModel(json);
    survey.setValue("entities", [{ q3: "some text" }]);
    var panel = <QuestionMatrixDynamicModel>(
      survey.getQuestionByName("entities_info")
    );
    assert.equal(
      panel.panels[0].getQuestionByName("q2").isVisible,
      false,
      "By default, q2 is invisible"
    );
    panel.panels[0].getQuestionByName("q1").value = "b";
    assert.equal(
      panel.panels[0].getQuestionByName("q2").isVisible,
      true,
      "q2 is visible now"
    );
  }
);

QUnit.test("goToNextPanel method", function (assert) {
  var json = {
    elements: [
      {
        type: "paneldynamic",
        name: "pd",
        renderMode: "progressTop",
        panelCount: 2,
        templateElements: [
          {
            type: "radiogroup",
            name: "q1",
            isRequired: true,
            choices: ["a", "b"],
          },
        ],
      },
    ],
  };

  var survey = new SurveyModel(json);
  var panelDynamic = <QuestionMatrixDynamicModel>survey.getQuestionByName("pd");
  assert.equal(panelDynamic.currentIndex, 0, "first panel is current");

  panelDynamic.goToNextPanel();
  assert.equal(
    panelDynamic.currentIndex,
    0,
    "first panel is current because of validation errors"
  );
  assert.equal(panelDynamic.currentPanel.hasErrors(), true);

  survey.data = { pd: [{ q1: "a" }, { q1: "b" }] };
  assert.equal(panelDynamic.currentPanel.hasErrors(), false);

  panelDynamic.goToNextPanel();
  assert.equal(panelDynamic.currentIndex, 1, "second panel is current");
});

QUnit.test("goToPrevPanel method", function (assert) {
  var json = {
    elements: [
      {
        type: "paneldynamic",
        name: "pd",
        renderMode: "progressTop",
        panelCount: 2,
        templateElements: [
          {
            type: "radiogroup",
            name: "q1",
            isRequired: true,
            choices: ["a", "b"],
          },
        ],
      },
    ],
  };

  var survey = new SurveyModel(json);
  var panelDynamic = <QuestionMatrixDynamicModel>survey.getQuestionByName("pd");

  panelDynamic.currentIndex = 1;
  assert.equal(panelDynamic.currentIndex, 1, "second panel is current");

  panelDynamic.goToPrevPanel();
  assert.equal(panelDynamic.currentIndex, 0, "first panel is current");
});
QUnit.test(
  "paneldynamic + radiogroup + others, Bug# https://github.com/surveyjs/editor/issues/480",
  function (assert) {
    var json = {
      elements: [
        {
          type: "paneldynamic",
          name: "panel1",
          templateElements: [
            {
              type: "radiogroup",
              name: "radio",
              choices: ["item1", "item2", "item3"],
              hasOther: true,
            },
          ],
        },
      ],
    };

    var survey = new SurveyModel(json);
    survey.data = { panel1: [{ radio: "other", "radio-Comment": "Comment" }] };

    var panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel1");
    var question = <QuestionRadiogroupModel>(
      panel.panels[0].getQuestionByName("radio")
    );
    assert.equal(question.isOtherSelected, true, "Other is selected");
    assert.equal(question.comment, "Comment", "Comment is set correctly");
  }
);
QUnit.test(
  "paneldynamic + survey.checkErrorsMode='onValueChanged', Bug# https://surveyjs.answerdesk.io/ticket/details/T1758",
  function (assert) {
    var json = {
      checkErrorsMode: "onValueChanged",
      elements: [
        {
          type: "paneldynamic",
          name: "panel1",
          panelCount: 1,
          templateElements: [
            {
              type: "text",
              name: "q1",
              isRequired: true,
            },
            {
              type: "text",
              name: "q2",
              isRequired: true,
            },
          ],
        },
      ],
    };

    var survey = new SurveyModel(json);
    var panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel1");
    var q1 = <QuestionRadiogroupModel>panel.panels[0].getQuestionByName("q1");
    var q2 = <QuestionRadiogroupModel>panel.panels[0].getQuestionByName("q2");
    assert.equal(
      q2.errors.length,
      0,
      "There are no errors in the second question"
    );
    q1.value = "test";
    assert.equal(
      q2.errors.length,
      0,
      "There are still no errors in the second question"
    );
    q1.value = "";
    assert.equal(q1.errors.length, 0, "There is no errors on value changed");
    assert.equal(
      q2.errors.length,
      0,
      "and there is no error in the second question"
    );
    survey.completeLastPage();
    assert.equal(q1.errors.length, 1, "There is error in the first question");
    assert.equal(q2.errors.length, 1, "There is error in the second question");
  }
);

QUnit.test(
  "paneldynamic + expression value + clear data on survey.isSinglePage = true', Bug# 1625",
  function (assert) {
    var json = {
      pages: [
        {
          name: "page1",
          elements: [
            {
              type: "paneldynamic",
              name: "Dynamic Panel",
              templateElements: [
                {
                  type: "text",
                  name: "Input",
                },
                {
                  type: "expression",
                  name: "Expression",
                  expression: "1",
                },
              ],
              panelCount: 1,
            },
          ],
        },
      ],
    };
    var data = {
      "Dynamic Panel": [
        { Expression: 1, Input: "Test1" },
        { Expression: 1, Input: "Test2" },
        { Expression: 1, Input: "Test3" },
      ],
    };

    var survey = new SurveyModel(json);
    survey.data = data;
    assert.deepEqual(survey.data, data, "Data set correctly");
    survey.isSinglePage = true;
    assert.deepEqual(
      survey.data,
      data,
      "Data is not changed after setting single page"
    );
  }
);
QUnit.test(
  "Dynamic Panel validators, validators expression do not recognize 'panel.' prefix. Bug#1710",
  function (assert) {
    var json = {
      questions: [
        {
          type: "text",
          name: "q1",
        },
        {
          type: "paneldynamic",
          name: "panel1",
          panelCount: 1,
          templateElements: [
            {
              type: "text",
              name: "pq1",
              validators: [
                { type: "expression", expression: "{panel.pq1} = {q1}" },
              ],
            },
          ],
        },
      ],
    };
    var survey = new SurveyModel(json);
    var panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel1");
    panel.panels[0].getQuestionByName("pq1").value = "val1";
    survey.getQuestionByName("q1").value = "val";
    assert.equal(panel.hasErrors(), true, "There is an error");
    panel.panels[0].getQuestionByName("pq1").value = "val";
    assert.equal(panel.hasErrors(), false, "There is no errors");
  }
);

QUnit.test(
  "Dropdown inside Dynamic Panel. ChoicesMax choicesMin properties",
  function (assert) {
    var json = {
      elements: [
        {
          type: "paneldynamic",
          name: "relatives",
          title: "Please enter all blood relatives you know",
          renderMode: "progressTop",
          templateTitle: "Information about: {panel.relativeType}",
          templateElements: [
            {
              name: "liveage",
              type: "dropdown",
              choicesMin: 1,
              choicesMax: 115,
            },
          ],
          panelCount: 2,
          panelAddText: "Add a blood relative",
          panelRemoveText: "Remove the relative",
        },
      ],
    };
    var survey = new SurveyModel(json);

    var dropDownQuestion = survey.getAllQuestions()[0]["panels"][0].elements[0];

    assert.equal(dropDownQuestion.choicesMin, 1, "choicesMin is ok");
    assert.equal(dropDownQuestion.choicesMax, 115, "choicesMax is ok");
    assert.equal(
      dropDownQuestion.visibleChoices.length,
      115,
      "visibleChoices is ok"
    );
  }
);
QUnit.test(
  "Matrix validation in cells and async functions in expression",
  function (assert) {
    var returnResult: (res: any) => void;
    function asyncFunc(params: any): any {
      returnResult = this.returnResult;
      return false;
    }
    FunctionFactory.Instance.register("asyncFunc", asyncFunc, true);

    var question = new QuestionPanelDynamicModel("q1");
    question.panelCount = 1;
    var textQuestion = question.template.addNewQuestion("text", "q1");
    textQuestion.validators.push(new ExpressionValidator("asyncFunc() = 1"));
    question.hasErrors();
    var onCompletedAsyncValidatorsCounter = 0;
    question.onCompletedAsyncValidators = (hasErrors: boolean) => {
      onCompletedAsyncValidatorsCounter++;
    };
    assert.equal(
      question.isRunningValidators,
      true,
      "We have one running validator"
    );
    assert.equal(
      onCompletedAsyncValidatorsCounter,
      0,
      "onCompletedAsyncValidators is not called yet"
    );
    returnResult(1);
    assert.equal(question.isRunningValidators, false, "We are fine now");
    assert.equal(
      onCompletedAsyncValidatorsCounter,
      1,
      "onCompletedAsyncValidators is called"
    );

    FunctionFactory.Instance.unregister("asyncFunc");
  }
);

QUnit.test(
  "Nested panel, setting survey.data when survey.clearInvisibleValues='onHidden', Bug# 1866",
  function (assert) {
    var json = {
      clearInvisibleValues: "onHidden",
      elements: [
        {
          name: "samples",
          type: "paneldynamic",
          templateElements: [
            {
              name: "surgicalProcedures",
              type: "paneldynamic",
              templateElements: [
                {
                  name: "histologicalDianosis",
                  type: "text",
                },
                {
                  name: "histologicalCategory",
                  type: "text",
                  visibleIf: "{panel.histologicalDianosis}='yes'",
                },
              ],
            },
          ],
        },
      ],
    };
    var survey = new SurveyModel(json);
    survey.data = {
      samples: [
        {
          surgicalProcedures: [
            {
              histologicalDianosis: "yes",
              histologicalCategory: "foo",
            },
          ],
        },
      ],
    };
    var nestedPanel = <QuestionPanelDynamicModel>(
      (<QuestionPanelDynamicModel>survey.getAllQuestions()[0]).panels[0]
        .questions[0]
    );
    var histologicalCategory = nestedPanel.panels[0].questions[1];
    assert.equal(histologicalCategory.value, "foo", "value set correctly");
  }
);
QUnit.test(
  "Paneldynamic duplicate key value error with checkErrorsMode: onValueChanged",
  function (assert) {
    var survey = new SurveyModel({
      checkErrorsMode: "onValueChanged",
      elements: [
        {
          name: "panel1",
          type: "paneldynamic",
          keyName: "id",
          templateElements: [
            {
              name: "id",
              type: "text",
            },
          ],
          panelCount: 3,
        },
      ],
    });

    var panelDynamic = <QuestionPanelDynamicModel>(
      survey.getQuestionByName("panel1")
    );
    var question1 = panelDynamic.panels[0].questions[0];
    var question2 = panelDynamic.panels[1].questions[0];
    var question3 = panelDynamic.panels[2].questions[0];
    question1.value = "1";
    question2.value = "0";
    assert.equal(
      question2.errors.length,
      0,
      "There is no unique errors by default"
    );
    question2.value = "1";
    assert.equal(
      question2.errors.length,
      1,
      "There is unique value error, when two key values are equal"
    );
    question2.value = "0";
    assert.equal(
      question2.errors.length,
      0,
      "There is no unique errors after question with error is changed"
    );
    question2.value = "1";
    question1.value = "0";
    assert.equal(
      question2.errors.length,
      0,
      "There is no unique errors after question with no error is changed"
    );
    question1.value = "1";
    question3.value = "1";
    assert.equal(
      question2.errors.length,
      1,
      "There is unique value error on second question, when three key values are equal"
    );
    assert.equal(
      question3.errors.length,
      1,
      "There is unique value error on third question, when three key values are equal"
    );
  }
);

QUnit.test(
  "Do not reset panelCount after deleting the last panel, Bug #1972",
  function (assert) {
    var json = {
      questions: [
        {
          type: "paneldynamic",
          name: "panel1",
          templateElements: [
            {
              type: "text",
              name: "q1",
            },
          ],
          panelsState: "collapsed",
          panelCount: 3,
        },
      ],
    };
    var survey = new SurveyModel(json);
    var panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel1");
    assert.equal(panel.panelCount, 3, "There are 3 panels by default");
    panel.removePanelUI(2);
    assert.equal(panel.panelCount, 2, "Remove the third panel");
    panel.removePanelUI(1);
    assert.equal(panel.panelCount, 1, "Remove the second panel");
    panel.removePanelUI(0);
    assert.equal(panel.panelCount, 0, "Remove the first panel");
  }
);

QUnit.test(
  "call clearFiles for QuestionFile on removing the panel, Bug #1970",
  function (assert) {
    var json = {
      questions: [
        {
          type: "paneldynamic",
          name: "panel1",
          templateElements: [
            {
              type: "text",
              name: "q1",
            },
            {
              type: "file",
              name: "q2",
            },
          ],
          panelCount: 3,
        },
      ],
    };
    var survey = new SurveyModel(json);
    var counter = 0;
    survey.onClearFiles.add(function (sender, options) {
      counter++;
      options.callback("success");
    });
    var panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel1");
    (<QuestionFileModel>panel.panels[0].getQuestionByName("q2")).value =
      "data:image/jpeg;base64,FILECONTENT";
    panel.removePanelUI(0);
    assert.equal(counter, 1, "clear files was called");
  }
);

QUnit.test(
  "Question padding right inside panel - https://github.com/surveyjs/survey-library/issues/1977",
  function (assert) {
    var json = {
      pages: [
        {
          name: "Fancy page",
          elements: [
            {
              type: "panel",
              title: "Large panel",
              name: "large_panel",
              state: "expanded",
              elements: [
                {
                  type: "paneldynamic",
                  title: " ",
                  name: "dynamic_panel",
                  templateElements: [
                    {
                      type: "text",
                      name: "field_one",
                      width: "60%",
                      startWithNewLine: false,
                      title: "Field One",
                    },
                    {
                      type: "text",
                      name: "field_two",
                      width: "40%",
                      startWithNewLine: false,
                      title: "Field Two",
                    },
                  ],
                  templateTitle: "Fancy Title",
                  panelCount: 2,
                  minPanelCount: 1,
                  panelsState: "expanded",
                  confirmDelete: true,
                  confirmDeleteText: "Are you sure you want to delete this?",
                  panelAddText: "  Add panel",
                  panelRemoveText: "   Delete",
                },
              ],
            },
          ],
        },
      ],
    };
    var survey = new SurveyModel(json);

    var panel = <QuestionPanelDynamicModel>(
      survey.getQuestionByName("dynamic_panel")
    );
    assert.equal((<any>panel.panels[0].elements[0]).paddingRight, "20px");
    assert.equal((<any>panel.panels[1].elements[0]).paddingRight, "20px");
    panel.panelCount++;
    assert.equal((<any>panel.panels[2].elements[0]).paddingRight, "20px");
  }
);

QUnit.test(
  "Panel dynamic with matrix dynamic inside, where matrix has defaultValue - Bug #1984, initial T3351(private)",
  function (assert) {
    var json = {
      elements: [
        {
          type: "paneldynamic",
          name: "question1",
          templateElements: [
            {
              type: "matrixdynamic",
              name: "question2",
              defaultValue: [
                {
                  "Column 1": 1,
                  "Column 2": 2,
                  "Column 3": 3,
                },
                {
                  "Column 2": 4,
                },
              ],
              columns: [
                {
                  name: "Column 1",
                },
                {
                  name: "Column 2",
                },
                {
                  name: "Column 3",
                },
              ],
              choices: [1, 2, 3, 4, 5],
            },
          ],
          panelCount: 1,
        },
      ],
    };
    var survey = new SurveyModel(json);
    var defaultValue = [
      {
        "Column 1": 1,
        "Column 2": 2,
        "Column 3": 3,
      },
      {
        "Column 2": 4,
      },
    ];
    var panel = <QuestionPanelDynamicModel>(
      survey.getQuestionByName("question1")
    );
    assert.deepEqual(
      panel.template.questions[0].defaultValue,
      defaultValue,
      "Default value in template is correct"
    );
    var matrix = <QuestionMatrixDynamicModel>(
      panel.panels[0].getQuestionByName("question2")
    );
    assert.deepEqual(
      matrix.defaultValue,
      defaultValue,
      "Default value is copied"
    );
    assert.deepEqual(
      matrix.value,
      defaultValue,
      "value is copied from default value"
    );
  }
);
