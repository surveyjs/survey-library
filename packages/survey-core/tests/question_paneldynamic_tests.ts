import { Question, IConditionObject } from "../src/question";
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
import { QuestionDropdownModel } from "../src/question_dropdown";
import { defaultCss } from "../src/defaultCss/defaultCss";
import { ItemValue } from "../src/itemvalue";
import { settings } from "../src/settings";
import { QuestionMatrixModel } from "../src/question_matrix";
import { AnimationGroup, AnimationTab } from "../src/utils/animation";
import { SurveyElement } from "../src/survey-element";
import { setOldTheme } from "./oldTheme";
import { DynamicPanelValueChangedEvent, DynamicPanelValueChangingEvent } from "../src/survey-events-api";
import { AdaptiveActionContainer, UpdateResponsivenessMode } from "../src/actions/adaptive-container";
import { Serializer } from "../src/jsonobject";
import { ProcessValue, ValueGetter } from "../src/conditions/conditionProcessValue";

import { describe, test, expect, vi } from "vitest";
describe("Survey_QuestionPanelDynamic", () => {
  test("Create panels based on template on setting value", () => {
    var question = new QuestionPanelDynamicModel("q");
    question.template.addNewQuestion("text", "q1");
    question.template.addNewQuestion("text", "q2");
    question.value = [{}, {}];

    expect(question.panels.length, "There are two panels now").toBe(2);
    var p1 = question.panels[0];
    expect(p1.elements.length, "There are two elements in the first panel").toBe(2);
    expect(p1.parentQuestion, "parentQuestion is set for inner panel").toBe(question);
  });

  test("Synhronize panelCount and value array length", () => {
    var question = new QuestionPanelDynamicModel("q");
    question.template.addNewQuestion("text", "q1");
    question.template.addNewQuestion("text", "q2");
    question.panelCount = 3;
    expect(question.value.length, "There should be 3 items in the array").toBe(3);
    question.value = [{}, { q1: "val1" }, {}, {}];
    expect(question.panelCount, "panelCount is 4 now").toBe(4);
    question.panelCount = 2;
    expect(question.value.length, "There should be 2 items in the array").toBe(2);
    expect(question.value[1]["q1"], "Do not delete the value in non deleted panels").toBe("val1");
  });

  test("Test panel showNavigation readOnly", () => {
    const survey = new SurveyModel({
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "paneldynamic",
              "name": "question1",
              "readOnly": true,
              "templateElements": [
                {
                  "type": "text",
                  "name": "question2"
                }
              ]
            }
          ]
        }
      ]
    });
    var oldCss = survey.css.root;
    survey.css.root = "sd-root-modern";
    var question = survey.getQuestionByName("question1");
    question.cssClasses.footer = "footer";
    question.panelCount = 0;
    expect(question.showNavigation, "ne records").toBeFalsy();
    question.panelCount = 1;
    expect(question.showNavigation, "one record").toBeFalsy();
    question.panelCount = 2;
    expect(question.showNavigation, "two records").toBeTruthy();
    survey.css.root = oldCss;
  });

  test("Dynamic Panel, clearIncorrectValues", () => {
    var question = new QuestionPanelDynamicModel("q");
    (<QuestionRadiogroupModel>(
    question.template.addNewQuestion("radiogroup", "q1")
  )).choices = [1, 2];
    (<QuestionRadiogroupModel>(
    question.template.addNewQuestion("radiogroup", "q2")
  )).choices = [1, 2, 3];

    question.value = [{ q1: 1 }, { q1: "val1" }, { q4: 3, q2: 5 }];
    question.clearIncorrectValues();
    expect(question.value, "Remove incorrect values in all panels").toEqual([{ q1: 1 }, {}, {}]);
  });

  test("Dynamic Panel, clearIncorrectValues, do not clear other value, Bug#2490", () => {
    var question = new QuestionPanelDynamicModel("q");
    (<QuestionRadiogroupModel>(
      question.template.addNewQuestion("radiogroup", "q1")
    )).choices = [1, 2];
    (<QuestionRadiogroupModel>(
      question.template.addNewQuestion("radiogroup", "q2")
    )).choices = [1, 2, 3];
    question.template.questions[1].showOtherItem = true;

    question.value = [
      { q1: 1, q2: "other", "q2-Comment": "Some Value" },
      { q1: 1, q2: 2, "q3-Comment": "Some Value" },
    ];
    question.clearIncorrectValues();
    expect(question.value, "Remove incorrect values, but do not remove correct comment").toEqual([
      { q1: 1, q2: "other", "q2-Comment": "Some Value" },
      { q1: 1, q2: 2 },
    ]);
  });

  test("By pass values from question.value into panel values and vice versa", () => {
    var question = new QuestionPanelDynamicModel("q");
    question.template.addNewQuestion("text", "q1");
    question.template.addNewQuestion("text", "q2");
    question.value = [
      { q1: "item1_1", q2: "item1_2" },
      { q1: "item2_1", q2: "item2_2" },
    ];

    expect(question.panels.length, "There are two panels now").toBe(2);
    var p1 = question.panels[0];
    var p2 = question.panels[1];
    expect((<Question>p1.questions[1]).value, "value set correct q2 panel1").toBe("item1_2");
    expect((<Question>p2.questions[0]).value, "value set correct q1 panel2").toBe("item2_1");
    (<Question>p1.questions[0]).value = "newValue";
    expect(question.value[0].q1, "The value from question has been assign successful").toBe("newValue");
  });

  test("Change values in panels on changing in question.value", () => {
    var question = new QuestionPanelDynamicModel("q");
    question.template.addNewQuestion("text", "q1");
    question.template.addNewQuestion("text", "q2");
    question.panelCount = 2;
    expect(question.panels.length, "There are two panels now").toBe(2);
    var p1 = question.panels[0];
    var p2 = question.panels[1];
    question.value = [
      { q1: "item1_1", q2: "item1_2" },
      { q1: "item2_1", q2: "item2_2" },
    ];

    expect((<Question>p1.questions[1]).value, "value set correct q2 panel1").toBe("item1_2");
    expect((<Question>p2.questions[0]).value, "value set correct q1 panel2").toBe("item2_1");
  });

  test("Load from Json", () => {
    var json = {
      elements: [
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
    expect(survey.jsonErrors == null || survey.jsonErrors.length == 0, "There should not be any errors").toBe(true);
    var question = <QuestionPanelDynamicModel>survey.getAllQuestions()[0];
    expect(question.template.elements.length, "template elements are loaded correctly").toBe(2);
    expect(question.template.elements[1].name, "the name of the second question is 'q2'").toBe("q2");
    expect(question.panelCount, "panelCount loaded correctly").toBe(3);
    expect(question.panels.length, "There are 3 panels now").toBe(3);
    var p1 = question.panels[0];
    var p2 = question.panels[1];
    expect(p1, "the panel has been created").toBeTruthy();
    expect(p1.elements.length, "There are two elements in the copied panel").toBe(2);
    expect(p1.questions[1].name, "the name of the second question in the copied panel is 'q2'").toBe("q2");
    expect(p1.isVisible, "the panel is visible").toBe(true);

    question.value = [
      { q1: "item1_1", q2: "item1_2" },
      { q1: "item2_1", q2: "item2_2" },
    ];

    expect((<Question>p1.questions[1]).value, "value set correct q2 panel1").toBe("item1_2");
    expect((<Question>p2.questions[0]).value, "value set correct q1 panel2").toBe("item2_1");
    (<Question>p1.questions[0]).value = "newValue";
    expect(question.value[0].q1, "The value changed correctly").toBe("newValue");
  });

  test("Load from Json with nested panel", () => {
    var json = {
      elements: [
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
    expect(question.template.elements.length, "template elements are loaded correctly").toBe(2);
    expect(question.template.elements[1].name, "the name of the second element is 'np1'").toBe("np1");
    expect((<PanelModel>question.template.elements[1]).elements.length, "there is one element in nested panel 'np1'").toBe(1);
    expect((<PanelModel>question.template.elements[1]).elements[0].name, "q2 is an element in the 'np1'").toBe("q2");
    expect(question.panelCount, "panelCount loaded correctly").toBe(3);
    expect(question.panels.length, "There are 3 panels now").toBe(3);
    var p1 = question.panels[0];
    var p2 = question.panels[1];
    expect(p1, "the panel has been created").toBeTruthy();

    expect(p1.elements.length, "template elements are loaded correctly").toBe(2);
    expect(p1.elements[1].name, "the name of the second element is 'np1'").toBe("np1");
    expect((<PanelModel>p1.elements[1]).elements.length, "there is one element in nested panel 'np1'").toBe(1);
    expect((<PanelModel>p1.elements[1]).elements[0].name, "q2 is an element in the 'np1'").toBe("q2");

    question.value = [
      { q1: "item1_1", q2: "item1_2" },
      { q1: "item2_1", q2: "item2_2" },
    ];

    expect((<Question>p1.questions[1]).value, "value set correct q2 panel1").toBe("item1_2");
    expect((<Question>p2.questions[0]).value, "value set correct q1 panel2").toBe("item2_1");
    (<Question>p1.questions[1]).value = "newValue";
    expect(question.value[0].q2, "The value changed correctly").toBe("newValue");
  });

  test("Has errors", () => {
    var question = new QuestionPanelDynamicModel("q");
    question.template.addNewQuestion("text", "q1");
    (<Question>question.template.questions[0]).isRequired = true;
    question.isRequired = true;
    question.value = [];
    expect(question.validate(), "main question requires a value").toBe(false);
    question.value = [{ q1: "item1_1" }, {}];
    expect(question.validate(), "q1 on the second row is not set").toBe(false);
    question.value = [{ q1: "item1_1" }, { q1: "item2_1" }];
    expect(question.validate(), "There is no errors now").toBe(true);
  });
  test("Update panels elements on changing template panel", () => {
    var question = new QuestionPanelDynamicModel("q");
    question.panelCount = 2;
    expect(question.panels[0].elements.length, "Initially there is no elements in the copied panel").toBe(0);
    question.template.addNewQuestion("text", "q1");
    expect(question.panels[0].elements.length, "Add question into template - add question into copied panels").toBe(1);
    question.template.removeQuestion(question.template.questions[0]);
    expect(question.panels[0].elements.length, "Remove question from template - from question from copied panels").toBe(0);
  });

  test("Support visibleIf and panel variable", () => {
    var survey = new SurveyModel();
    survey.addNewPage("p");
    var question = new QuestionPanelDynamicModel("q");
    survey.pages[0].addQuestion(question);
    question.template.addNewQuestion("text", "q1");
    question.template.addNewQuestion("text", "q2");
    question.template.questions[1].visibleIf = "{panel.q1} = 'val'";
    question.panelCount = 2;
    expect(question.panels[0].questions[1].visible, "q1 is not 'val'").toBe(false);
    question.value = [{ q1: "val" }];
    expect(question.panels[0].questions[1].visible, "q1 is 'val'").toBe(true);
  });
  test("Support visibleIf and panel variable, question.valueName", () => {
    var survey = new SurveyModel();
    survey.addNewPage("p");
    var question = new QuestionPanelDynamicModel("q");
    survey.pages[0].addQuestion(question);
    (<Question>question.template.addNewQuestion("text", "q1")).valueName =
    "panelQ1";
    question.template.addNewQuestion("text", "q2");
    question.template.questions[1].visibleIf = "{panel.panelQ1} = 'val'";
    question.panelCount = 2;
    expect(question.panels[0].questions[1].visible, "panelQ1 is not 'val'").toBe(false);
    question.value = [{ panelQ1: "val" }];
    expect(question.panels[0].questions[1].visible, "panelQ1 is 'val'").toBe(true);
  });
  test("cell.setValueExpression for panel on the second page, Bug#9942", () => {
    const survey = new SurveyModel({
      pages: [{
        elements: [
          {
            type: "paneldynamic",
            name: "panel1",
            valueName: "panel",
            panelCount: 1,
            templateElements: [{ name: "q1", type: "text" }],
          }
        ]
      },
      {
        elements: [
          {
            type: "paneldynamic",
            name: "panel2",
            valueName: "panel",
            templateElements: [
              { name: "q2", type: "text", setValueExpression: "{panel.q1} + {panel.q3}" },
              { name: "q3", type: "text" },
            ]
          },
        ]
      }
      ]
    });
    const panel1 = survey.getQuestionByName("panel1");
    const panel2 = survey.getQuestionByName("panel2");
    panel1.panels[0].questions[0].value = 10;
    panel1.addPanel();
    panel1.panels[1].questions[0].value = 20;
    survey.nextPage();
    const panels = panel2.panels;
    expect(panels.length, "panels count").toBe(2);
    expect(panels[0].getQuestionByName("q2").value, "q2 value, panel 1").toBe(10);
    expect(panels[1].getQuestionByName("q2").value, "q2 value, panel 2").toBe(20);
    panels[0].getQuestionByName("q3").value = 5;
    expect(panels[0].getQuestionByName("q2").value, "q2 value, panel 1").toBe(15);
  });
  test("Support panelIndex in visibleIf expression", () => {
    var survey = new SurveyModel();
    survey.addNewPage("p");
    var question = new QuestionPanelDynamicModel("q");
    survey.pages[0].addQuestion(question);
    question.template.addNewQuestion("text", "q1");
    question.template.addNewQuestion("text", "q2");
    question.template.questions[1].visibleIf = "{panelIndex} = 0";
    question.panelCount = 2;
    expect(question.panels[0].questions[1].isVisible, "panel index = 0").toBe(true);
    expect(question.panels[1].questions[1].isVisible, "panel index != 0").toBe(false);
  });

  test("Text Processing and panel variable, question.valueName", () => {
    var survey = new SurveyModel();
    survey.addNewPage("p");
    var question = new QuestionPanelDynamicModel("q");
    survey.pages[0].addQuestion(question);
    (<Question>question.template.addNewQuestion("text", "q1")).valueName =
    "panelQ1";
    question.templateTitle = "Value: {panel.panelQ1}";
    question.panelCount = 2;
    expect(question.panels[0].processedTitle, "panelQ1 is empty").toBe("Value: ");
    question.value = [{ panelQ1: "val" }];
    expect(question.panels[0].processedTitle, "panelQ1 is 'val'").toBe("Value: val");
  });

  test("Text Processing from panel.data", () => {
    var survey = new SurveyModel();
    survey.addNewPage("p");
    var question = new QuestionPanelDynamicModel("q");
    question.template.addNewQuestion("text", "panelQ1");
    question.templateTitle = "Value: {panel.panelQ1}";
    question.panelCount = 2;
    expect(question.panels[0].processedTitle, "panelQ1 is empty").toBe("Value: ");
    question.value = [{ panelQ1: "val" }];
    expect(question.panels[0].processedTitle, "panelQ1 is 'val'").toBe("Value: val");
  });

  test("Text Processing and parent panel variable", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "rootPanel",
          panelCount: 1,
          templateElements: [
            {
              type: "text",
              name: "q1",
              title: "{panel.q2}",
            },
            {
              type: "text",
              name: "q2",
            },
            {
              type: "paneldynamic",
              name: "childPanel",
              panelCount: 1,
              templateElements: [
                {
                  type: "text",
                  name: "childPanel_q1",
                  title: "{parentPanel.q2}",
                },
                {
                  type: "text",
                  name: "childPanel_q2",
                  title: "{parentpanel.q2}",
                },
              ],
            },
          ],
        },
      ],
    });
    var rootPanel = <QuestionPanelDynamicModel>(
    survey.getQuestionByName("rootPanel")
  );
    var q1 = rootPanel.panels[0].getQuestionByName("q1");
    var q2 = rootPanel.panels[0].getQuestionByName("q2");
    var childPanel = <QuestionPanelDynamicModel>(
    rootPanel.panels[0].getQuestionByName("childPanel")
  );
    var childPanel_q1 = childPanel.panels[0].getQuestionByName("childPanel_q1");
    var childPanel_q2 = childPanel.panels[0].getQuestionByName("childPanel_q2");
    q2.value = "q2-title";
    expect(q1.locTitle.renderedHtml, "root processed text correctly").toBe("q2-title");
    expect(childPanel_q1.locTitle.renderedHtml, "child processed text correctly").toBe("q2-title");
    expect(childPanel_q2.locTitle.renderedHtml, "child processed text correctly, lowcase").toBe("q2-title");
  });
  test("parentPanel variable in the expression, Bug#10221", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "rootPanel",
          panelCount: 1,
          templateElements: [
            {
              type: "text",
              name: "q1"
            },
            {
              type: "paneldynamic",
              name: "childPanel",
              panelCount: 1,
              templateElements: [
                {
                  type: "text",
                  name: "childPanel_q1",
                  defaultValueExpression: "{parentPanel.q1} + '-child'",
                }
              ],
            },
          ],
        },
      ],
    });
    const rootPanel = <QuestionPanelDynamicModel>(
    survey.getQuestionByName("rootPanel")
  );
    const q1 = rootPanel.panels[0].getQuestionByName("q1");
    const childPanel = <QuestionPanelDynamicModel>(
    rootPanel.panels[0].getQuestionByName("childPanel")
  );
    const childPanel_q1 = childPanel.panels[0].getQuestionByName("childPanel_q1");
    q1.value = "q1-value";
    expect(childPanel_q1.value, "childPanel_q1 value is set correctly").toBe("q1-value-child");
  });
  test("Text Processing design mode - https://github.com/surveyjs/survey-creator/issues/2192", () => {
    var survey = new SurveyModel({
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "text",
              "name": "question4"
            },
            {
              "type": "paneldynamic",
              "name": "question1",
              "panelCount": 1,
              "templateElements": [
                {
                  "type": "text",
                  "name": "question3"
                },
                {
                  "type": "text",
                  "name": "question2",
                  "title": "How are you {panel.question3}? How are you {question4}?"
                }
              ]
            }
          ]
        }
      ]
    });
    survey.setDesignMode(true);
    var panel = <QuestionPanelDynamicModel>(
    survey.getQuestionByName("question1")
  );
    var q2 = panel.panels[0].getQuestionByName("question2");
    expect(q2.locTitle.renderedHtml, "no text processing in design mode").toBe("How are you {panel.question3}? How are you {question4}?");
  });

  test("Initial Text Processing in panel title", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "panel",
          panelCount: 1,
          templateTitle: "title:{panel.q1}",
          templateElements: [
            {
              type: "text",
              name: "q1",
              title: "{panel.q2}",
            },
          ],
        },
      ],
    });
    var panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    var q1 = panel.panels[0].getQuestionByName("q1");
    expect(panel.panels[0].locTitle.renderedHtml, "initial text processing").toBe("title:");
    q1.value = "q1-title";
    expect(panel.panels[0].locTitle.renderedHtml, "Text processing on setting value").toBe("title:q1-title");
  });

  test("Set panel value, question.valueName", () => {
    var survey = new SurveyModel();
    survey.addNewPage("p");
    var question = new QuestionPanelDynamicModel("q");
    survey.pages[0].addQuestion(question);
    (<Question>question.template.addNewQuestion("text", "q1")).valueName =
    "panelQ1";
    question.panelCount = 2;
    expect(question.template.questions[0].getValueName(), "value name is set").toBe("panelQ1");
    expect(question.panels[0].questions[0].getValueName(), "value name is set for generated panel").toBe("panelQ1");
    (<Question>question.panels[0].questions[0]).value = "val1";
    (<Question>question.panels[1].questions[0]).value = "val2";
    expect(question.value, "set value correctly, use valueName property").toEqual([{ panelQ1: "val1" }, { panelQ1: "val2" }]);
  });

  test("Support panelIndex variable", () => {
    var survey = new SurveyModel();
    survey.addNewPage("p");
    var question = new QuestionPanelDynamicModel("q");
    survey.pages[0].addQuestion(question);
    question.templateTitle = "{panelIndex}. test";
    question.template.addNewQuestion("text", "q1");
    question.template.addNewQuestion("text", "q2");
    question.panelCount = 2;
    expect(question.panels[0].processedTitle, "panelIndex = 1 for the first panel").toBe("1. test");
    expect(question.panels[1].processedTitle, "panelIndex = 2 for the second panel").toBe("2. test");
  });
  test("remove Panel", () => {
    var question = new QuestionPanelDynamicModel("q");
    question.template.addNewQuestion("text", "q1");
    question.template.addNewQuestion("text", "q2");
    question.panelCount = 3;
    question.value = [{}, { q1: "val1" }, {}];
    question.removePanel(2);
    question.removePanel(0);
    expect(question.value.length, "There should be 1 item in the array").toBe(1);
    expect(question.panelCount, "panelCount is 1 now").toBe(1);
    expect(question.value[0]["q1"], "Do not delete the value in non deleted panels").toBe("val1");
  });
  test("remove Panel Question from Page, Bug#184, in editor repo", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("p");
    var question = new QuestionPanelDynamicModel("q");
    page.addElement(question);
    var q = question.template.addNewQuestion("text", "q1");
    expect(question.template.elements.length, "There is one element").toBe(1);
    page.removeElement(q);
    expect(question.template.elements.length, "Template panel is empty").toBe(0);
  });
  test("Process text in titles", () => {
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
    expect(survey_q2.locTitle.renderedHtml, "process root question title correclty").toBe("q1:val_q1");
    expect(panel.locTitle.renderedHtml, "process panel title correctly").toBe("q1:val_q1, panel.q1:val1");
    expect(panel_q2.locTitle.renderedHtml, "process question title correctly").toBe("q1:val_q1, panel.q1:val1");
  });
  test("Process text in titles, variable that has name different from questions, bug#802", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("p");
    var question = new QuestionPanelDynamicModel("q");
    question.template.addNewQuestion("text", "q1");
    page.addQuestion(question);
    question.templateTitle = "panel.q1:{panel.q1}, panel.name:{panel.name}";
    question.value = [{ q1: "q1Value", name: "nameValue" }, {}];
    var panel = question.panels[0];
    expect(panel.locTitle.renderedHtml, "process panel title correctly").toBe("panel.q1:q1Value, panel.name:nameValue");
  });
  test("Process text in titles, get correct value, question.valueName", () => {
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
    expect(panel.locTitle.renderedHtml, "process panel title correctly").toBe("survey.name:surveyName, panel.name:panel1Name");
  });

  test("PanelDynamic in design time", () => {
    var survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.addNewPage("p");
    var question = new QuestionPanelDynamicModel("q");
    survey.pages[0].addQuestion(question);
    question.template.addNewQuestion("text", "q1");
    question.template.addNewQuestion("text", "q2");
    question.panelCount = 2;
    expect(question.panels.length, "Only one panel at design time").toBe(1);
    expect(question.panels[0].id, "The template panel should be shown").toBe(question.template.id);
    question.panelCount = 0;
    expect(question.panels.length, "There are still one panel").toBe(1);
    expect(question.currentIndex, "It is -1 in list mode").toBe(-1);
    question.displayMode = "carousel";
    expect(question.panels.length, "There are still one panel in non list mode").toBe(1);
    expect(question.currentIndex, "It is always zero  in non list mode at design-time").toBe(0);
  });
  test("PanelDynamic in design time + panelCount", () => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({
      elements: [
        { type: "paneldynamic", name: "q1", panelCount: 5 }
      ]
    });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("q1");
    expect(panel.panelCount, "Loading correctly").toBe(5);
    expect(panel.getPropertyValue("panelCount"), "property is set correcty on loading").toBe(5);
    panel.setPropertyValue("panelCount", 7);
    expect(panel.panelCount, "panelCount set correctly").toBe(7);
    panel.panelCount = 3;
    expect(panel.getPropertyValue("panelCount"), "property is set correcty").toBe(3);
  });
  test("PanelDynamic, question no", () => {
    var survey = new SurveyModel();
    survey.showQuestionNumbers = "on";
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
    expect(panel.showQuestionNumbers, "off is the default value").toBe("off");
    expect(question1.visibleIndex, "off - question1.visibleIndex").toBe(0);
    expect(panel.visibleIndex, "off - panel.visibleIndex").toBe(1);
    expect(panelQuestion1.visibleIndex, "off - panelQuestion1.visibleIndex").toBe(-1);
    expect(panelQuestion2.visibleIndex, "off - panelQuestion2.visibleIndex").toBe(-1);
    expect(question2.visibleIndex, "off - question2.visibleIndex").toBe(2);

    panel.showQuestionNumbers = "onpanel";
    expect(question1.visibleIndex, "onPanel - question1.visibleIndex").toBe(0);
    expect(panel.visibleIndex, "onPanel - panel.visibleIndex").toBe(1);
    expect(panelQuestion1.visibleIndex, "onPanel - panelQuestion1.visibleIndex").toBe(0);
    expect(panelQuestion2.visibleIndex, "onPanel - panelQuestion2.visibleIndex").toBe(1);
    expect(question2.visibleIndex, "onPanel - question2.visibleIndex").toBe(2);
    panel.addPanel();
    var panelQuestion3 = <Question>panel.panels[2].questions[1];
    expect(panelQuestion3.visibleIndex, "onPanel - panelQuestion3.visibleIndex").toBe(1);
    panel.removePanel(2);

    panel.showQuestionNumbers = "default";
    expect(question1.visibleIndex, "onSurvey - question1.visibleIndex").toBe(0);
    expect(panel.visibleIndex, "onSurvey - panel.visibleIndex").toBe(-1);
    expect(panelQuestion1.visibleIndex, "onSurvey - panelQuestion1.visibleIndex").toBe(1);
    expect(panelQuestion2.visibleIndex, "onSurvey - panelQuestion2.visibleIndex").toBe(4);
    expect(question2.visibleIndex, "onSurvey - question2.visibleIndex").toBe(5);

    panel.addPanel();
    panelQuestion3 = <Question>panel.panels[2].questions[1];
    expect(panelQuestion3.visibleIndex, "onSurvey - panelQuestion3.visibleIndex").toBe(4 + 2);
    panel.removePanel(2);

    panelQuestion1.visible = false;
    expect(panelQuestion2.visibleIndex, "onSurvey, panelQuestion1 is invisible - panelQuestion2.visibleIndex").toBe(3);
    expect(question2.visibleIndex, "onSurvey, panelQuestion1 is invisible - question2.visibleIndex").toBe(4);
    panel.removePanel(1);
    expect(question2.visibleIndex, "onSurvey, second panel is removed - question2.visibleIndex").toBe(2);
  });
  test("PanelDynamic, showQuestionNumbers onSurvey & design time", () => {
    const survey = new SurveyModel();
    survey.showQuestionNumbers = "on";
    survey.setDesignMode(true);
    survey.fromJSON({
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "text",
              "name": "q1"
            }
          ]
        },
        {
          "name": "page2",
          "elements": [
            {
              "type": "paneldynamic",
              "name": "panel",
              "templateElements": [
                {
                  "type": "text",
                  "name": "q2"
                }
              ],
              "showQuestionNumbers": "default"
            }
          ]
        }
      ]
    });
    const q1 = survey.getQuestionByName("q1");
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    const q2 = <Question>panel.templateElements[0];
    expect(q1.no, "The number should be 1.").toBe("1.");
    expect(q2.no, "The number should be 2.").toBe("2.");
    //Fix bug#10539
    survey.showQuestionNumbers = "recursive";
    expect(panel.no, "The panel number should be 2. #2").toBe("2.");
    expect(q2.no, "The number should be 2.1.").toBe("2.1.");
    survey.showQuestionNumbers = "off";
    expect(q2.no, "The number should be empty for q2.").toBe("");
    survey.showQuestionNumbers = "on";
    expect(q2.no, "The number should be 2. #2").toBe("2.");

  });
  test("PanelDynamic, convert showQuestionNumbers 'onSurvey' into 'default', Issue#10531", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "paneldynamic", name: "panel", showQuestionNumbers: "onSurvey" }
      ]
    });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    expect(panel.showQuestionNumbers, "'onSurvey' is converted into 'default'").toBe("default");
    panel.showQuestionNumbers = "onSurvey";
    expect(panel.showQuestionNumbers, "'onSurvey' is converted into 'default' again").toBe("default");
  });
  test("PanelDynamic, convert showQuestionNumbers 'onPanel' into 'onpanel', Issue#10531", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "paneldynamic", name: "panel", showQuestionNumbers: "onPanel" }
      ]
    });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    expect(panel.showQuestionNumbers, "'onPanel' is converted into 'onpanel'").toBe("onpanel");
    panel.showQuestionNumbers = "onPanel";
    expect(panel.showQuestionNumbers, "'onPanel' is converted into 'onpanel' again").toBe("onpanel");
  });
  test("PanelDynamic, showQuestionNumbers 'default' & survey.showQuestionNumber: 'recursive', Issue#10531", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        {
          type: "paneldynamic",
          name: "panel",
          showQuestionNumbers: "default",
          questionStartIndex: " a",
          panelCount: 2,
          templateElements: [
            { type: "text", name: "q2" },
            { type: "text", name: "q3" }
          ]
        },
        { type: "text", name: "q4" }
      ],
      showQuestionNumbers: "recursive",
      questionStartIndex: "1.1"
    });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    const panel1 = panel.panels[0];
    const panel2 = panel.panels[1];
    const q1 = survey.getQuestionByName("q1");
    const q4 = survey.getQuestionByName("q4");
    expect(q1.no, "q1 number").toBe("1.1");
    expect(panel.no, "panel number").toBe("1.2");
    expect(panel1.getQuestionByName("q2").no, "panel1.q2 number").toBe("1.2 a");
    expect(panel1.getQuestionByName("q3").no, "panel1.q3 number").toBe("1.2 b");
    expect(panel2.getQuestionByName("q2").no, "panel2.q2 number").toBe("1.2 a");
    expect(panel2.getQuestionByName("q3").no, "panel2.q3 number").toBe("1.2 b");
    expect(q4.no, "q4 number").toBe("1.3");
  });
  test("PanelDynamic, showQuestionNumbers onSurvey in run-time, bug#9652", () => {
    const survey = new SurveyModel({
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "text",
              "name": "q1"
            }
          ]
        },
        {
          "name": "page2",
          "elements": [
            {
              "type": "paneldynamic",
              "name": "panel",
              "templateElements": [
                {
                  "type": "text",
                  "name": "q2"
                }
              ],
              "showQuestionNumbers": "onSurvey"
            }
          ]
        }
      ],
      "showQuestionNumbers": "on"
    });
    const q1 = survey.getQuestionByName("q1");
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    panel.addPanel();
    const q2 = panel.panels[0].getQuestionByName("q2");
    expect(panel.no, "The number should be empty for dynamic panel.").toBe("");
    expect(q1.no, "The number should be 1.").toBe("1.");
    expect(q2.no, "The number should be 2.").toBe("2.");
  });
  test("PanelDynamic, showQuestionNumbers onPanel in run-time, bug#9652", () => {
    const survey = new SurveyModel({
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "text",
              "name": "q1"
            }
          ]
        },
        {
          "name": "page2",
          "elements": [
            {
              "type": "paneldynamic",
              "name": "panel",
              "templateElements": [
                {
                  "type": "text",
                  "name": "q2"
                }
              ],
              "showQuestionNumbers": "onpanel"
            }
          ]
        }
      ]
    });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    panel.addPanel();
    expect(panel.panels[0].getQuestionByName("q2").no, "The number should be 2., #1").toBe("1.");
    panel.addPanel();
    expect(panel.panels[1].getQuestionByName("q2").no, "The number should be 2., #2").toBe("1.");
  });
  test("PanelDynamic, showQuestionNumbers recursive, Issue#10288", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        {
          type: "paneldynamic",
          name: "panel",
          showQuestionNumbers: "recursive",
          panelCount: 2,
          templateElements: [
            { type: "text", name: "q2" },
            { type: "text", name: "q3" }
          ]
        },
        { type: "text", name: "q4" }
      ],
      showQuestionNumbers: "recursive",
      questionStartIndex: "1.1"
    });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    const panel1 = panel.panels[0];
    const panel2 = panel.panels[1];
    const q1 = survey.getQuestionByName("q1");
    const q4 = survey.getQuestionByName("q4");
    expect(q1.no, "q1 number").toBe("1.1");
    expect(panel.no, "panel number").toBe("1.2");
    expect(panel1.getQuestionByName("q2").no, "panel1.q2 number").toBe("1.2.1");
    expect(panel1.getQuestionByName("q3").no, "panel1.q3 number").toBe("1.2.2");
    expect(panel2.getQuestionByName("q2").no, "panel2.q2 number").toBe("1.2.1");
    expect(panel2.getQuestionByName("q3").no, "panel2.q3 number").toBe("1.2.2");
    expect(q4.no, "q4 number").toBe("1.3");
  });
  test("PanelDynamic, showQuestionNumbers recursive & questionStartIndex, Issue#10288", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        {
          type: "paneldynamic",
          name: "panel",
          showQuestionNumbers: "recursive",
          questionStartIndex: " a",
          templateTitle: "Panel Title #{panelIndex}",
          panelCount: 2,
          templateElements: [
            { type: "text", name: "q2" },
            { type: "text", name: "q3" }
          ]
        },
        { type: "text", name: "q4" }
      ],
      showQuestionNumbers: "recursive",
      questionStartIndex: "1.1"
    });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    const panel1 = panel.panels[0];
    const panel2 = panel.panels[1];
    const q1 = survey.getQuestionByName("q1");
    const q4 = survey.getQuestionByName("q4");
    expect(q1.no, "q1 number").toBe("1.1");
    expect(panel.no, "panel number").toBe("1.2");
    expect(panel1.locTitle.textOrHtml, "panel1 title").toBe("Panel Title #1");
    expect(panel2.locTitle.textOrHtml, "panel2 title").toBe("Panel Title #2");
    expect(panel1.getQuestionByName("q2").no, "panel1.q2 number").toBe("1.2 a");
    expect(panel1.getQuestionByName("q3").no, "panel1.q3 number").toBe("1.2 b");
    expect(panel2.getQuestionByName("q2").no, "panel2.q2 number").toBe("1.2 a");
    expect(panel2.getQuestionByName("q3").no, "panel2.q3 number").toBe("1.2 b");
    expect(q4.no, "q4 number").toBe("1.3");
  });
  test("PanelDynamic, showQuestionNumbers onpanel & questionStartIndex, Issue#10288", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        {
          type: "paneldynamic",
          name: "panel",
          showQuestionNumbers: "onpanel",
          questionStartIndex: "a",
          panelCount: 2,
          templateElements: [
            { type: "text", name: "q2" },
            { type: "text", name: "q3" }
          ]
        },
        { type: "text", name: "q4" }
      ],
      showQuestionNumbers: "recursive",
      questionStartIndex: "1.1"
    });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    const panel1 = panel.panels[0];
    const panel2 = panel.panels[1];
    const q1 = survey.getQuestionByName("q1");
    const q4 = survey.getQuestionByName("q4");
    expect(q1.no, "q1 number").toBe("1.1");
    expect(panel.no, "panel number").toBe("1.2");
    expect(panel1.getQuestionByName("q2").no, "panel1.q2 number").toBe("a");
    expect(panel1.getQuestionByName("q3").no, "panel1.q3 number").toBe("b");
    expect(panel2.getQuestionByName("q2").no, "panel2.q2 number").toBe("a");
    expect(panel2.getQuestionByName("q3").no, "panel2.q3 number").toBe("b");
    expect(q4.no, "q4 number").toBe("1.3");
  });

  test("PanelDynamic, renderMode", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("p");
    var panel = <QuestionPanelDynamicModel>(
    page.addNewQuestion("paneldynamic", "panel")
  );
    panel.template.addNewQuestion("text", "panelq1");
    panel.template.addNewQuestion("text", "panelq2");
    expect(panel.renderMode, "list is a default mode").toBe("list");
    panel.panelCount = 2;
    expect(panel.currentIndex, "list mode doesn't support currentIndex").toBe(-1);
    expect(panel.currentPanel, "list mode doesn't support currentPanel").toBeNull();
    panel.displayMode = "carousel";
    expect(panel.currentIndex, "list mode doesn't support currentIndex").toBe(0);
    expect(panel.currentPanel.id, "list mode doesn't support currentPanel").toBe(panel.panels[0].id);
    expect(panel.isPrevButtonVisible, "currentIndex = 0, prevButton is hidden").toBe(false);
    expect(panel.isNextButtonVisible, "currentIndex = 0, nextButton is visible").toBe(true);
    panel.currentIndex++;
    expect(panel.isPrevButtonVisible, "currentIndex = 1, prevButton is visible").toBe(true);
    expect(panel.isNextButtonVisible, "currentIndex = 1, nextButton is hidden").toBe(false);
    panel.addPanel();
    expect(panel.currentIndex, "The last added panel is current").toBe(2);
    panel.removePanel(2);
    expect(panel.currentIndex, "The last  panel is removed").toBe(1);
  });
  test("PanelDynamic, displayMode is not list + hasError", () => {
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
    panel.displayMode = "carousel";
    panel.currentIndex = 1;
    expect(panel.currentIndex, "go to the second panel").toBe(1);
    panel.validate(true, true);
    expect(panel.currentIndex, "it should show the first panel where the error happened").toBe(0);
  });
  test("PanelDynamic, keyName + hasError + getAllErrors", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("p");
    var panel = <QuestionPanelDynamicModel>(
    page.addNewQuestion("paneldynamic", "panel")
  );
    panel.template.addNewQuestion("text", "panelq1");
    panel.template.addNewQuestion("text", "panelq2");
    panel.panelCount = 2;
    panel.keyName = "panelq1";
    expect(panel.validate(true), "There is no errors").toBe(true);
    (<Question>panel.panels[0].questions[0]).value = "val1";
    expect(panel.validate(true), "There is no errors panel[0].q1 = val1").toBe(true);
    (<Question>panel.panels[1].questions[0]).value = "val1";
    expect(panel.validate(true), "There is the error panel[0].q1 = val1 and panel[1].q1 = val1").toBe(false);
    expect((<Question>panel.panels[1].questions[0]).hasVisibleErrors, "We have visible errors now").toBe(true);
    expect(panel.errors.length, "There is no errors in the panel question itself").toBe(0);
    expect(panel.getAllErrors().length, "There is errors in question inside the panel").toBe(1);
    (<Question>panel.panels[1].questions[0]).value = "val2";
    expect(panel.validate(true), "There is no error panel[0].q1 = val1 and panel[1].q1 = val2").toBe(true);
    expect((<Question>panel.panels[1].questions[0]).hasVisibleErrors, "We do not have visible errors").toBe(false);
    expect(panel.getAllErrors().length, "There is no errors in question inside the panel").toBe(0);
  });
  test("PanelDynamic, keyName + hasError, Bug #1820", () => {
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
    expect(survey.currentPage.validate(true), "There are two 'father' in keyName property").toBe(false);
  });

  test("assign customWidgets to questions in dynamic panel", () => {
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
    expect(panel.panels[0].questions[0].customWidget, "panel0, there is no custom widget for this question").toBeNull();
    expect(panel.panels[0].questions[1].customWidget.name, "panel0, has the custom widget").toBe("customWidget");
    expect(panel.panels[1].questions[0].customWidget, "panel1, there is no custom widget for this question").toBeNull();
    expect(panel.panels[1].questions[1].customWidget.name, "panel1, has the custom widget").toBe("customWidget");
    CustomWidgetCollection.Instance.clear();
  });

  test("Auto generate names", () => {
    var survey = new SurveyModel();
    var page1 = survey.addNewPage();
    var panel = <QuestionPanelDynamicModel>page1.addNewQuestion("paneldynamic");
    var q2 = panel.template.addNewQuestion("text");
    var p1 = panel.template.addNewPanel();
    var q3 = page1.addNewQuestion("text");

    expect(p1.name, "the first name for panel is panel1").toBe("panel1");
    expect(q2.name, "the second name for question is question2").toBe("question2");
    expect(q3.name, "the third name for question is question3").toBe("question3");
  });

  test("Set data for loaded panel after clearing the survey data, bug#784", () => {
    var json = {
      elements: [
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
    expect(q1.value, "question keep the value").toBe("test");
    expect(survey.data, "value set into survey").toEqual({ q: [{ q1: "test" }] });
  });

  test("Set panel count to 0, Editor bug#228", () => {
    var json = {
      elements: [
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
    expect(dymamicPanel.panelCount, "The default panel count is 0").toBe(0);
    dymamicPanel.panelCount = 1;
    expect(dymamicPanel.panelCount, "There is one panel").toBe(1);
    dymamicPanel.panelCount = 0;
    expect(dymamicPanel.panelCount, "There is no panels").toBe(0);
  });

  test("PanelDynamic, question.getTitleLocation(), bug#800", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("p");
    var panel = <QuestionPanelDynamicModel>(
    page.addNewQuestion("paneldynamic", "panel")
  );
    panel.template.addNewQuestion("text", "panelq1");

    panel.panelCount = 2;
    var p = panel.panels[0];
    var q = <Question>p.questions[0];

    expect(q.getTitleLocation(), "it is top by default").toBe("top");

    page.questionTitleLocation = "left";

    expect(p.getQuestionTitleLocation(), "it is left based on survey.questionTitleLocation").toBe("left");
    expect(q.getTitleLocation(), "it is left based on survey.questionTitleLocation").toBe("left");
    panel.templateTitleLocation = "bottom";
    expect(q.getTitleLocation(), "it is bottom, based on templateTitleLocation").toBe("bottom");
  });

  test("PanelDynamic, canAddPanel/canRemovePanel", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("p");
    var panel = <QuestionPanelDynamicModel>(
    page.addNewQuestion("paneldynamic", "panel")
  );

    expect(panel.canAddPanel, "By default you can add panel").toBe(true);
    expect(panel.canRemovePanel, "There is no panels").toBe(false);
    panel.panelCount = 2;
    expect(panel.canRemovePanel, "You can remove now").toBe(true);
    survey.setDesignMode(true);
    expect(panel.canAddPanel, "You can't add in design mode").toBe(false);
    expect(panel.canRemovePanel, "You can't delete in design mode").toBe(false);
    survey.setDesignMode(false);
    expect(panel.canAddPanel, "You can add in run-time mode").toBe(true);
    expect(panel.canRemovePanel, "You can delete in run-time mode").toBe(true);
    panel.allowAddPanel = false;
    panel.allowRemovePanel = false;
    expect(panel.canAddPanel, "allowAddPanel = false").toBe(false);
    expect(panel.canRemovePanel, "allowRemovePanel = false").toBe(false);
  });

  test("PanelDynamic, survey.clearInvisibleValues='onHidden', bug#806", () => {
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

    expect(rq2.isVisible, "the question is invisible").toBe(false);
    rq1.value = "a";
    expect(rq2.isVisible, "the question is visible").toBe(true);
    rq2.value = "b";
    expect(rq2.isEmpty(), "the value is set").toBe(false);
    rq1.value = "c";
    expect(rq2.isVisible, "the question is invisible again").toBe(false);
    expect(rq2.isEmpty(), "the question is empty").toBe(true);
  });

  test("PanelDynamic, survey.clearInvisibleValues='onComplete', bug#806", () => {
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
    expect(survey.data, "The value is here").toEqual({ panel: [{ panelq1: "a" }, {}] });
    survey.doComplete();
    expect(survey.data, "The value is gone").toEqual({ panel: [{}, {}] });
  });

  test("PanelDynamic, survey.onDanamicPanelAdd/Remove", () => {
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
    survey.onDynamicPanelAdded.add(function(survey, options) {
      questionName = options.question.name;
      expect(options.panel.getQuestionByName("panelq1"), "Panel added correctly").toBeTruthy();
      panelAddedCounter++;
    });
    survey.onDynamicPanelRemoved.add(function(survey, options) {
      questionName = options.question.name;
      panelRemovedCounter++;
      panelIndex = options.panelIndex;
    });
    panel.panelCount = 2;
    expect(panelAddedCounter, "Nothing was added").toBe(0);
    expect(panelRemovedCounter, "Nothing was removed").toBe(0);
    panel.addPanel();
    expect(panelAddedCounter, "one panel was added").toBe(1);
    expect(questionName, "the question was passed correctly on added").toBe("panel");
    questionName = "";
    panel.removePanel(1);
    expect(panelAddedCounter, "one panel was removed").toBe(1);
    expect(questionName, "the question was passed correctly on removed").toBe("panel");
    expect(panelIndex, "the removed panel index is correct").toBe(1);
  });
  test("PanelDynamic, survey.onDanamicPanelRemoving", () => {
    var survey = new SurveyModel();
    survey.clearInvisibleValues = "onComplete";
    var page = survey.addNewPage("p");
    var panel = <QuestionPanelDynamicModel>(
    page.addNewQuestion("paneldynamic", "panel")
  );
    panel.template.addNewQuestion("text", "panelq1");
    var questionName = "";
    var panelRemovedCounter = 0;
    var panelIndex = -1;
    survey.onDynamicPanelRemoving.add(function(survey, options) {
      questionName = options.question.name;
      panelRemovedCounter++;
      panelIndex = options.panelIndex;
      options.allow = panelIndex != 1;
    });
    panel.panelCount = 3;
    panel.removePanel(0);
    expect(questionName, "the question was passed correctly on removed, #1").toBe("panel");
    expect(panelRemovedCounter, "one panel was removed, #1").toBe(1);
    expect(panel.panelCount, "panel count is 2, #1").toBe(2);
    expect(panelIndex, "the removed panel index is correct, #1").toBe(0);
    panel.removePanel(1);
    expect(questionName, "the question was passed correctly on removed, #2").toBe("panel");
    expect(panelRemovedCounter, "one panel was removed, #2").toBe(2);
    expect(panel.panelCount, "panel count is still 2, #2").toBe(2);
    expect(panelIndex, "the removed panel index is correct, #2").toBe(1);
  });
  test("PanelDynamic defaultValue in questions", () => {
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
    expect(textQuestion.value, "The default value to text is set").toBe("100");
    expect(dropDownQuestion.value, "The default value to dropdown is set").toBe("item2");
  });

  test("Two PanelDynamic questions bound to the same value", () => {
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
    expect(q2.panelCount, "By default there are two panels in panel2").toBe(1);
    q1.addPanel();
    expect(q2.panelCount, "One panel was added").toBe(2);
    q1.removePanel(1);
    expect(q1.panelCount, "q1: One panel was removed").toBe(1);
    expect(q2.panelCount, "q2: One panel was removed").toBe(1);
  });
  test("PanelDynamic vs MatrixDynamic questions bound to the same value on different pages, bug#T464", () => {
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
    expect(panel.panelCount, "By default there are two panels in panel2").toBe(1);
    matrix.value = [{ t1: "test" }, { t1: "test2" }];
    expect(panel.panelCount, "One row and one panel were added").toBe(2);
    matrix.removeRow(1);
    expect(matrix.rowCount, "matrix: One row was removed").toBe(1);
    expect(panel.panelCount, "panel: One panel was removed").toBe(1);
  });

  test("PanelDynamic vs MatrixDynamic add/remove items, bug#T2130", () => {
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
          displayMode: "list",
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
    expect(panel.panels.length, "There are 3 panels").toBe(3);
    expect(panel.panels[0].locTitle.renderedHtml, "The first panel title is correct").toBe("1");
    expect(panel.panels[1].locTitle.renderedHtml, "The second panel title is correct").toBe("2");
    expect(panel.panels[2].locTitle.renderedHtml, "The third panel title is correct").toBe("3");
    panel.panels[0].getQuestionByName("address").value = "address: row1";
    panel.panels[2].getQuestionByName("address").value = "address: row3";
    matrix.removeRow(1);
    expect(panel.panels.length, "There are two panels now").toBe(2);
    expect(panel.panels[0].locTitle.renderedHtml, "The first panel title is still correct").toBe("1");
    expect(panel.panels[1].locTitle.renderedHtml, "The second panel title is 3 now").toBe("3");
    expect(survey.data, "The value is correct").toEqual({
      employers: [
        { RowId: 1, name: 1, address: "address: row1" },
        { RowId: 2, name: 3, address: "address: row3" },
      ],
    });
  });
  test("PanelDynamic vs MatrixDynamic onValueChanged, bug#9130", () => {
    const json = {
      elements: [
        {
          type: "matrixdynamic",
          rowCount: 1,
          name: "employer_names",
          valueName: "employers",
          columns: [
            {
              name: "name",
              isRequired: true,
              cellType: "text",
            },
          ],
        },
        {
          type: "paneldynamic",
          displayMode: "list",
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
            {
              type: "text",
              name: "name",
            }
          ],
        },
      ],
    };
    const survey = new SurveyModel(json);
    const logs = new Array<any>();
    survey.onValueChanged.add((sender, options) => {
      logs.push({ name: options.name, questionName: options.question.name });
    });
    const matrix = <QuestionMatrixDynamicModel>(survey.getQuestionByName("employer_names"));
    const panel = <QuestionPanelDynamicModel>(survey.getQuestionByName("arrray_employer_info"));
    matrix.visibleRows[0].getQuestionByName("name").value = "def";
    panel.panels[0].getQuestionByName("name").value = "abc";
    expect(logs, "check logs, #1").toEqual([
      { name: "employers", questionName: "employer_names" },
      { name: "employers", questionName: "arrray_employer_info" }
    ]);
  });

  test("Dynamic Panel: preserve empty matrix row after changing another question, Issue #11192", () => {
    const survey = new SurveyModel({
      pages: [
        {
          name: "page1",
          elements: [
            {
              type: "paneldynamic",
              name: "question1",
              templateElements: [
                {
                  type: "text",
                  name: "question2",
                },
                {
                  type: "matrixdynamic",
                  name: "question3",
                  columns: [
                    {
                      name: "Column 1",
                      cellType: "text",
                    }
                  ],
                  rowCount: 0,
                },
              ],
            },
          ],
        },
      ]
    });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("question1");
    panel.addPanel();

    const secondPanelMatrix = <QuestionMatrixDynamicModel>panel.panels[0].getQuestionByName("question3");
    secondPanelMatrix.addRow();
    let rows = secondPanelMatrix.visibleRows;
    rows[0].cells[0].question.value = "a";
    secondPanelMatrix.addRow();

    expect(rows.length, "The matrix has 2 rows before changing another panel value").toBe(2);
    expect(rows[0].cells[0].question.value, "The first row has value in the first column").toBe("a");
    expect(rows[1].value, "The second row is empty before changing another panel value").toEqual({});

    panel.panels[0].getQuestionByName("question2").value = "test";

    rows = secondPanelMatrix.visibleRows;
    expect(rows.length, "The matrix still has 2 rows after changing another panel value").toBe(2);
    expect(rows[0].cells[0].question.value, "The first row value is preserved").toBe("a");
    expect(rows[1].value, "The trailing empty row is preserved").toEqual({});
  });

  function updateObjsQuestions(objs: Array<any>): void {
    for (var i = 0; i < objs.length; i++) {
      objs[i].question = objs[i].question.name;
      if (!!objs[i].context) {
        objs[i].context = objs[i].context.name;
      }
    }
  }
  test("panelDynamic.addConditionObjectsByContext", () => {
    var objs = [];
    var panel = new QuestionPanelDynamicModel("qPanel");
    panel.title = "Question Panel";
    var q1 = panel.template.addNewQuestion("text", "q1");
    var question = new QuestionMultipleTextModel("q2");
    question.title = "Question 2";
    question.addItem("item1");
    question.addItem("item2");
    panel.template.addQuestion(question);
    panel.addConditionObjectsByContext(objs, null);
    updateObjsQuestions(objs);
    expect(objs, "addConditionObjectsByContext work correctly for panel dynamic").toEqual([
      { name: "qPanel[0].q1", text: "Question Panel[0].q1", question: "q1" },
      { name: "qPanel[0].q2.item1", text: "Question Panel[0].Question 2.item1", question: "q2" },
      { name: "qPanel[0].q2.item2", text: "Question Panel[0].Question 2.item2", question: "q2" }
    ]);
    objs = [];
    panel.addConditionObjectsByContext(objs, q1);
    updateObjsQuestions(objs);
    expect(objs, "addConditionObjectsByContext work correctly for panel dynamic with context").toEqual([
      { name: "qPanel[0].q1", text: "Question Panel[0].q1", question: "q1" },
      { name: "qPanel[0].q2.item1", text: "Question Panel[0].Question 2.item1", question: "q2" },
      { name: "qPanel[0].q2.item2", text: "Question Panel[0].Question 2.item2", question: "q2" },
      {
        name: "panel.q2.item1",
        text: "panel.Question 2.item1",
        question: "q2",
        context: "qPanel"
      },
      {
        name: "panel.q2.item2",
        text: "panel.Question 2.item2",
        question: "q2",
        context: "qPanel"
      },
    ]);
    objs = [];
    panel.addConditionObjectsByContext(objs, true);
    updateObjsQuestions(objs);
    expect(objs, "addConditionObjectsByContext work correctly for panel dynamic with context equals true").toEqual([
      { name: "qPanel[0].q1", text: "Question Panel[0].q1", question: "q1" },
      { name: "qPanel[0].q2.item1", text: "Question Panel[0].Question 2.item1", question: "q2" },
      { name: "qPanel[0].q2.item2", text: "Question Panel[0].Question 2.item2", question: "q2" },
      { name: "qPanel.panel.q1", text: "Question Panel.panel.q1", question: "q1", context: "qPanel" },
      {
        name: "qPanel.panel.q2.item1",
        text: "Question Panel.panel.Question 2.item1",
        question: "q2", context: "qPanel"
      },
      {
        name: "qPanel.panel.q2.item2",
        text: "Question Panel.panel.Question 2.item2",
        question: "q2", context: "qPanel"
      },
    ]);
  });
  test("panelDynamic.addConditionObjectsByContext && question validator, Bug#8914", () => {
    const objs = [];
    const panel = new QuestionPanelDynamicModel("qPanel");
    const q1 = panel.template.addNewQuestion("text", "q1");
    q1.validators.push(new ExpressionValidator());
    panel.template.addNewQuestion("text", "q2");
    panel.addConditionObjectsByContext(objs, q1.validators[0]);
    updateObjsQuestions(objs);
    expect(objs, "addConditionObjectsByContext work correctly for panel dynamic").toEqual([
      { name: "qPanel[0].q1", text: "qPanel[0].q1", question: "q1" },
      { name: "qPanel[0].q2", text: "qPanel[0].q2", question: "q2" },
      { name: "panel.q1", text: "panel.q1", question: "q1", context: "qPanel" },
      { name: "panel.q2", text: "panel.q2", question: "q2", context: "qPanel" }
    ]);
  });
  test("panelDynamic.getNestedQuestions", () => {
    const panel = new QuestionPanelDynamicModel("qPanel");
    panel.template.addNewQuestion("text", "q1");
    const q2 = new QuestionMultipleTextModel("q2");
    q2.title = "Question 2";
    q2.addItem("item1");
    q2.addItem("item2");
    panel.template.addQuestion(q2);
    panel.panelCount = 2;
    const questions = panel.getNestedQuestions();
    expect(questions.length, "two panels * 3").toBe(6);
    expect(questions[0].name, "panel[0].q1").toBe("q1");
    expect(questions[1].name, "panel[0].q2.item1").toBe("item1");
    expect(questions[2].name, "panel[0].q2.item2").toBe("item2");
    expect(questions[3].name, "panel[1].q1").toBe("q1");
    expect(questions[4].name, "panel[1].q2.item1").toBe("item1");
    expect(questions[5].name, "panel[1].q2.item2").toBe("item2");
  });
  test("panelDynamic.getNestedQuestions for created from JSON elements", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic", name: "panel1",
          panelCount: 4,
          templateElements: [
            { type: "text", name: "q1" },
            { type: "text", name: "q2" }
          ]
        }
      ],
      questionsOnPageMode: "inputPerPage",
    });

    const panel = survey.getQuestionByName("panel1");
    expect(panel.getNestedQuestions(true).length, "Calculate questions correctly").toBe(4 * 2);
  });
  test("panelDynamic.getNestedQuestions for created from JSON elements & nested", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic", name: "panel1",
          panelCount: 4,
          templateElements: [
            { type: "text", name: "q1" },
            { type: "matrixdropdown", name: "q2", columns: [{ name: "col1" }, { name: "col2" }], rows: ["row1", "row2"] }
          ]
        }
      ],
      questionsOnPageMode: "inputPerPage",
    });

    const panel = survey.getQuestionByName("panel1");
    expect(panel.getNestedQuestions(true).length, "Include nested questions").toBe(4 * (1 + 4));
    expect(panel.getNestedQuestions(true, false).length, "exclude nested questions").toBe(4 * 2);
  });

  test("panelDynamic.addConditionObjectsByContext + settings.panelDynamicMaxPanelCountInCondition = 0", () => {
    settings.panelDynamicMaxPanelCountInCondition = 0;
    var objs = [];
    var panel = new QuestionPanelDynamicModel("qPanel");
    panel.title = "Question Panel";
    var q1 = panel.template.addNewQuestion("text", "q1");
    var question = new QuestionMultipleTextModel("q2");
    question.title = "Question 2";
    question.addItem("item1");
    question.addItem("item2");
    panel.template.addQuestion(question);
    panel.addConditionObjectsByContext(objs, null);
    updateObjsQuestions(objs);
    expect(objs, "addConditionObjectsByContext work correctly for panel dynamic").toEqual([]);
    objs = [];
    panel.addConditionObjectsByContext(objs, q1);
    updateObjsQuestions(objs);
    expect(objs, "addConditionObjectsByContext work correctly for panel dynamic with context").toEqual([
      {
        name: "panel.q2.item1",
        text: "panel.Question 2.item1",
        question: "q2",
        context: "qPanel"
      },
      {
        name: "panel.q2.item2",
        text: "panel.Question 2.item2",
        question: "q2",
        context: "qPanel"
      },
    ]);
    objs = [];
    panel.addConditionObjectsByContext(objs, true);
    updateObjsQuestions(objs);
    expect(objs, "addConditionObjectsByContext work correctly for panel dynamic with context equals true").toEqual([
      { name: "qPanel.panel.q1", text: "Question Panel.panel.q1", question: "q1", context: "qPanel" },
      {
        name: "qPanel.panel.q2.item1",
        text: "Question Panel.panel.Question 2.item1",
        question: "q2", context: "qPanel"
      },
      {
        name: "qPanel.panel.q2.item2",
        text: "Question Panel.panel.Question 2.item2",
        question: "q2", context: "qPanel"
      },
    ]);
    settings.panelDynamicMaxPanelCountInCondition = 1;
  });

  test("panelDynamic.addConditionObjectsByContext + settings.panelDynamicMaxPanelCountInCondition = 2;", () => {
    settings.panelDynamicMaxPanelCountInCondition = 2;
    var objs = [];
    var panel = new QuestionPanelDynamicModel("qPanel");
    panel.title = "Question Panel";
    var q1 = panel.template.addNewQuestion("text", "q1");
    var question = new QuestionMultipleTextModel("q2");
    question.title = "Question 2";
    question.addItem("item1");
    question.addItem("item2");
    panel.template.addQuestion(question);
    panel.addConditionObjectsByContext(objs, null);
    updateObjsQuestions(objs);
    expect(objs, "addConditionObjectsByContext work correctly for panel dynamic").toEqual([
      { name: "qPanel[0].q1", text: "Question Panel[0].q1", question: "q1" },
      { name: "qPanel[0].q2.item1", text: "Question Panel[0].Question 2.item1", question: "q2" },
      { name: "qPanel[0].q2.item2", text: "Question Panel[0].Question 2.item2", question: "q2" },
      { name: "qPanel[1].q1", text: "Question Panel[1].q1", question: "q1" },
      { name: "qPanel[1].q2.item1", text: "Question Panel[1].Question 2.item1", question: "q2" },
      { name: "qPanel[1].q2.item2", text: "Question Panel[1].Question 2.item2", question: "q2" }
    ]);
    objs = [];
    panel.addConditionObjectsByContext(objs, q1);
    updateObjsQuestions(objs);
    expect(objs, "addConditionObjectsByContext work correctly for panel dynamic with context").toEqual([
      { name: "qPanel[0].q1", text: "Question Panel[0].q1", question: "q1" },
      { name: "qPanel[0].q2.item1", text: "Question Panel[0].Question 2.item1", question: "q2" },
      { name: "qPanel[0].q2.item2", text: "Question Panel[0].Question 2.item2", question: "q2" },
      { name: "qPanel[1].q1", text: "Question Panel[1].q1", question: "q1" },
      { name: "qPanel[1].q2.item1", text: "Question Panel[1].Question 2.item1", question: "q2" },
      { name: "qPanel[1].q2.item2", text: "Question Panel[1].Question 2.item2", question: "q2" },
      {
        name: "panel.q2.item1",
        text: "panel.Question 2.item1",
        question: "q2",
        context: "qPanel"
      },
      {
        name: "panel.q2.item2",
        text: "panel.Question 2.item2",
        question: "q2",
        context: "qPanel"
      },
    ]);
    objs = [];
    panel.addConditionObjectsByContext(objs, true);
    updateObjsQuestions(objs);
    expect(objs, "addConditionObjectsByContext work correctly for panel dynamic with context equals true").toEqual([
      { name: "qPanel[0].q1", text: "Question Panel[0].q1", question: "q1" },
      { name: "qPanel[0].q2.item1", text: "Question Panel[0].Question 2.item1", question: "q2" },
      { name: "qPanel[0].q2.item2", text: "Question Panel[0].Question 2.item2", question: "q2" },
      { name: "qPanel[1].q1", text: "Question Panel[1].q1", question: "q1" },
      { name: "qPanel[1].q2.item1", text: "Question Panel[1].Question 2.item1", question: "q2" },
      { name: "qPanel[1].q2.item2", text: "Question Panel[1].Question 2.item2", question: "q2" },
      { name: "qPanel.panel.q1", text: "Question Panel.panel.q1", question: "q1", context: "qPanel" },
      {
        name: "qPanel.panel.q2.item1",
        text: "Question Panel.panel.Question 2.item1",
        question: "q2", context: "qPanel"
      },
      {
        name: "qPanel.panel.q2.item2",
        text: "Question Panel.panel.Question 2.item2",
        question: "q2", context: "qPanel"
      },
    ]);
    settings.panelDynamicMaxPanelCountInCondition = 1;
  });
  test("panelDynamic.addConditionObjectsByContext + nested dynamic panel + context", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "paneldynamic",
          "name": "question1",
          "title": "parent dynamic panel",
          "templateElements": [
            {
              "type": "paneldynamic",
              "name": "question2",
              "title": "nested dynamic panel",
              "templateElements": [
                {
                  "type": "text",
                  "name": "question3",
                  "title": "nq1"
                },
                {
                  "type": "text",
                  "name": "question4",
                  "title": "nq2"
                }
              ]
            },
            {
              "type": "text",
              "name": "question5",
              "title": "pq1"
            }
          ]
        }
      ]
    });
    const rootPanel = survey.getQuestionByName("question1");
    const nestedPanel = rootPanel.template.getQuestionByName("question2");
    const question3 = nestedPanel.template.getQuestionByName("question3");
    const objs: IConditionObject[] = [];
    rootPanel.addConditionObjectsByContext(objs, question3);
    expect(objs.length, "There should be 4 elements").toBe(4);
    expect(objs[0].name, "value #0").toBe("question1[0].question2[0].question3");
    expect(objs[1].name, "value #1").toBe("question1[0].question2[0].question4");
    expect(objs[2].name, "value #2").toBe("panel.question4");
    expect(objs[2].text, "text #2").toBe("panel.nq2");
    expect(objs[3].name, "value #3").toBe("question1[0].question5");
  });
  test("matrixdropdown.addConditionObjectsByContext + in nested paneldynamic + context, Bug#8475", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "paneldynamic",
          "name": "panel1",
          "templateElements": [
            {
              "type": "matrixdropdown",
              "name": "matrix1",
              "columns": [
                { "cellType": "text", "name": "col1" },
                { "cellType": "text", "name": "col2" },
                { "cellType": "text", "name": "col3" }
              ]
            }
          ]
        }
      ]
    });
    const rootPanel = survey.getQuestionByName("panel1");
    const nestedMatrix = rootPanel.template.getQuestionByName("matrix1");
    const column = nestedMatrix.columns[0];
    const objs: IConditionObject[] = [];
    rootPanel.addConditionObjectsByContext(objs, column);
    expect(objs.length, "There should be 4 elements").toBe(2);
    expect(objs[0].name, "value #0").toBe("row.col2");
    expect(objs[1].name, "value #1").toBe("row.col3");
  });
  test("matrixDynamic.getConditionJson", () => {
    var panel = new QuestionPanelDynamicModel("panel");
    (<QuestionCheckboxModel>(
    panel.template.addNewQuestion("checkbox", "q1")
  )).choices = [1, 2];
    var question = new QuestionMultipleTextModel("q2");
    question.addItem("item1");
    question.addItem("item2");
    panel.template.addQuestion(question);
    var json = panel.getConditionJson("equals", "q1");
    expect(json.choices, "choices get correctly").toEqual([1, 2]);
    json = panel.getConditionJson("equals", "q2.item2");
    expect(json.type, "mutliple item type get correctly").toBe("text");
  });

  test("matrixDynamic.panelsState, set value", () => {
    var panel = new QuestionPanelDynamicModel("panel");
    panel.templateTitle = "Panel Title";
    panel.template.addNewQuestion("text", "q1");
    panel.panelCount = 2;
    expect(panel.panelsState, "The default value is normal").toBe("default");
    expect(panel.panels[0].state, "The default value for all panels is normal").toBe("default");
    panel.panelsState = "expanded";
    expect(panel.panels[0].state, "panelsState = 'expanded', the first panel is expanded").toBe("expanded");
    expect(panel.panels[1].state, "panelsState = 'expanded', the second panel is expanded").toBe("expanded");
    panel.panelsState = "collapsed";
    expect(panel.panels[0].state, "panelsState = 'collapsed', the first panel is collapsed").toBe("collapsed");
    expect(panel.panels[1].state, "panelsState = 'collapsed', the second panel is collapsed").toBe("collapsed");
    panel.panelsState = "firstExpanded";
    expect(panel.panels[0].state, "panelsState = 'firstExpanded', the first panel is expanded").toBe("expanded");
    expect(panel.panels[1].state, "panelsState = 'firstExpanded', the second panel is collapsed").toBe("collapsed");
    panel.panelsState = "default";
    expect(panel.panels[0].state, "panelsState = 'default', the first panel has default state").toBe("default");
    expect(panel.panels[1].state, "panelsState = 'default', the second panel has default state").toBe("default");
  });

  test("matrixDynamic.panelsState and not panel.title", () => {
    var panel = new QuestionPanelDynamicModel("panel");
    panel.template.addNewQuestion("text", "q1");
    panel.panelCount = 2;
    expect(panel.panelsState, "The default value is normal").toBe("default");
    expect(panel.panels[0].state, "The default value for all panels is normal").toBe("default");
    panel.panelsState = "collapsed";
    expect(panel.panels[0].state, "panelsState = 'expanded', by panel title is empty").toBe("default");
    panel.panelsState = "firstExpanded";
    expect(panel.panels[0].state, "panelsState = 'firstExpanded', but panel.title is empty").toBe("default");
  });

  test("matrixDynamic.panelsState, add panel always expanded", () => {
    var panel = new QuestionPanelDynamicModel("panel");
    panel.template.addNewQuestion("text", "q1");
    panel.templateTitle = "Some text";
    panel.panelCount = 2;
    panel.addPanelUI();
    expect(panel.panels[2].state, "User can't collapse/expand the panel").toBe("default");
    panel.panelsState = "expanded";
    expect(panel.panels[2].state, "It is expanded now").toBe("expanded");
    panel.addPanelUI();
    expect(panel.panels[3].state, "the panel is added with expanded state").toBe("expanded");
    panel.panelsState = "collapsed";
    panel.addPanelUI();
    expect(panel.panels[4].state, "Also the panelsState = 'collapsed' the panel is added with expanded state").toBe("expanded");
  });
  test("matrixDynamic.panelsState, load from json", () => {
    var json = {
      elements: [
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
    expect(panel.panels[0].state, "The first panel is expanded").toBe("expanded");
    expect(panel.panels[1].state, "The second panel is collapsed").toBe("collapsed");
  });
  test("matrixDynamic.panelsState, not tempalteTitle load from json", () => {
    var json = {
      elements: [
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
    expect(panel.panels[0].state, "First panel, not templateTitle").toBe("default");
    expect(panel.panels[1].state, "Second panel, not templateTitle").toBe("default");
  });
  test("Dynamic Panel, multiple text question and validation, Bug#1037", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("page");
    var panel = new QuestionPanelDynamicModel("q");
    var question = <QuestionMultipleTextModel>(
      panel.template.addNewQuestion("multipletext", "q1")
    );
    question.addItem("item1");
    question.addItem("item2");
    page.addElement(panel);
    survey.onValidateQuestion.add(function(survey, options) {
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

    expect(page.validate(), "There are errors items are empty").toBe(false);

    panel.panels[0].questions[0].value = { item1: 5, item2: 5 };
    expect(page.validate(), "There is error item2 less than 10").toBe(false);
    panel.panels[0].questions[0].value = { item1: 5, item2: 11 };
    expect(page.validate(), "There is no errors").toBe(true);
  });
  test("Dynamic Panel, survey in readonly mode, Bug#1051", () => {
    var json = {
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
        {
          type: "text",
          name: "q2",
        },
      ],
    };
    var survey = new SurveyModel(json);
    var panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    var question = <QuestionTextModel>survey.getQuestionByName("q2");
    expect(panel.panels[0].questions[0].survey, "The survey is set").toBeTruthy();
    expect(panel.panels[0].questions[0].isReadOnly, "The question is not readonly").toBe(false);
    survey.readOnly = true;
    expect(question.isReadOnly, "The standard question is readonly").toBe(true);
    expect(panel.panels[0].questions[0].isReadOnly, "The question in dynamic panel should be readonly").toBe(true);
  });

  test("Dynamic Panel readOnly, Bug#https://surveyjs.answerdesk.io/ticket/details/T1663", () => {
    var json = {
      elements: [
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
    expect(question.isReadOnly, "The question is readonly initially").toBe(true);
    panel.readOnly = false;
    expect(question.isReadOnly, "The question is not readonly, panel is not readOnly").toBe(false);
    survey.pages[0].readOnly = true;
    expect(question.isReadOnly, "The question is readonly, page is readOnly").toBe(true);
    survey.pages[0].readOnly = false;
    expect(question.isReadOnly, "The question is not readonly again").toBe(false);
    survey.readOnly = true;
    expect(question.isReadOnly, "The question is readonly, survey mode is display").toBe(true);
  });

  test("Dynamic Panel, doesn't work with isSinglePage, Bug#1082", () => {
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
    expect(panel.template.survey, "The survey is set for template").toBeTruthy();
    expect(panel.panels[0].questions[0].survey, "The survey is set for panel").toBeTruthy();
  });

  test("Dynamic Panel, doesn't work with isSinglePage, Bug#T1527", () => {
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
              displayMode: "list",
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
    survey.readOnly = true;

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
    expect(dPanel, "Get question correctly").toBeTruthy();
    expect(dPanel.panelCount, "There should be two panels").toBe(2);
  });

  test("Nested dynamic panel doesn't set data correctly, Bug#1096", () => {
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
    expect(panel1.getQuestionByName("q1").value, "q1 in first panel set correctly").toBe(1);
    expect(panel2.getQuestionByName("q1").value, "q1 in second panel set correctly").toBe(2);
    expect(panel1Nested1.panelCount, "There should be one panel in the first nested panel").toBe(1);
    expect(panel1Nested1.panels[0].getQuestionByName("q2").value, "q2 set correctly in the first nested panel").toBe(1);
    expect(panel2Nested1.panelCount, "There should be three panels in the second nested panel").toBe(3);
    expect(panel2Nested1.panels[0].getQuestionByName("q2").value, "first q2 set correctly in the second nested panel").toBe(1);
    expect(panel2Nested1.panels[1].getQuestionByName("q2").value, "second q2 set correctly in the second nested panel").toBe(2);
    expect(panel2Nested1.panels[2].getQuestionByName("q2").value, "third q2 set correctly in the second nested panel").toBe(3);
  });

  test("visibleIf and add new panel in child paneldynamic bug #1139", () => {
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

    expect(question3.isVisible, "Child panel is hidden").toBeFalsy();
    question2.value = "item1";
    expect(question3.isVisible, "Child panel become visible").toBeTruthy();
    var childPanelEl1 = question3.addPanel();
    expect(question3.isVisible, "Child panel still visible").toBeTruthy();
  });

  test("visibleIf and parentpanel paneldynamic", () => {
    const json = {
      elements: [
        {
          type: "paneldynamic",
          name: "question1",
          panelCount: 1,
          templateElements: [
            {
              type: "checkbox",
              name: "question2",
              choices: ["item1", "item2", "item3"],
            },
            {
              type: "paneldynamic",
              name: "question3",
              minPanelCount: 1,
              templateElements: [
                {
                  type: "checkbox",
                  name: "question4",
                  choicesVisibleIf: "{parentpanel.question2} contains {item}",
                  choices: ["item1", "item2", "item3"],
                },
              ],
            },
          ],
        },
      ],
    };

    const survey = new SurveyModel(json);

    const rootPanel = <QuestionPanelDynamicModel>(
      survey.getQuestionByName("question1")
    );
    const rootPanelEl1 = rootPanel.panels[0];
    const question2 = rootPanelEl1.getQuestionByName("question2");
    const childPanel = rootPanelEl1.getQuestionByName("question3");
    const question4 = childPanel.panels[0].getQuestionByName("question4");
    expect(question4.visibleChoices.length, "There is not visible choices by default").toBe(0);
    question2.value = ["item1", "item2"];
    expect(question4.visibleChoices.length, "There are two visible choices by now").toBe(2);
  });

  test("panel.defaultPanelValue, apply from json and then from UI", () => {
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
    expect(question.value, "defaultPanelValue set correctly on json loading").toEqual([
      { q1: "val1", q3: "val3" },
      { q1: "val1", q3: "val3" },
    ]);
    question.addPanel();
    expect(question.value, "defaultPanelValue set correclty on adding row").toEqual([
      { q1: "val1", q3: "val3" },
      { q1: "val1", q3: "val3" },
      { q1: "val1", q3: "val3" },
    ]);
  });

  test("matrix.defaultRowValue, defaultValue has higher priority than defaultRowValue", () => {
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
    expect(question.value, "defaultValue is used").toEqual([
      { q1: "v1", q2: "v2" },
      { q1: "v11", q3: "v3" },
    ]);
  });

  test("Synhronize elements on changing template", () => {
    var question = new QuestionPanelDynamicModel("q");
    question.template.addNewQuestion("text", "q1");
    question.template.addNewQuestion("text", "q2");
    question.panelCount = 2;
    expect(question.panels[0].elements.length, "There are two elements").toBe(2);
    question.template.addNewQuestion("text", "q3");
    expect(question.panels[0].elements.length, "There are three elements").toBe(3);
    question.template.removeQuestion(question.template.questions[0]);
    expect(question.panels[0].elements.length, "There are two elements again").toBe(2);
    expect(question.panels[0].questions[0].name, "The first element is 'q2").toBe("q2");
  });

  test("synhronize on template question property change", () => {
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
    expect((<QuestionTextModel>q1_1).title, "q1_1 title changed").toBe("title1");
    expect((<QuestionTextModel>q1_2).title, "q1_2 title changed").toBe("title1");
    expect((<QuestionCheckboxModel>q2_1).choices.length, "q2_1 choices changed").toBe(3);
    expect((<QuestionCheckboxModel>q2_2).choices.length, "q2_2 choices changed").toEqual(3);
    var q3 = <QuestionTextModel>question.template.addNewQuestion("text", "q3");
    var q3_1 = <QuestionTextModel>question.panels[0].getQuestionByName("q3");
    expect(q3_1.title, "The title is empty").toBe("q3");
    q3.title = "title_3";
    expect(q3_1.title, "The title for added question has been changed").toBe("title_3");
    var p1_q1 = <QuestionTextModel>question.template.getQuestionByName("p1_q1");
    var q3_q1_1 = <QuestionTextModel>(
    question.panels[0].getQuestionByName("p1_q1")
  );
    p1_q1.title = "title_in_panel";
    expect(q3_q1_1.title, "The title for a question in a panel has been changed").toBe("title_in_panel");
  });

  test("synhronize on template question property change bug #1278", () => {
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
    expect(question.panels[0].elements[0].isVisible, "The first question is visible").toBe(true);
    question.templateElements[0].visible = false;
    expect(question.panels[0].elements[0].isVisible, "The first question is not visible now").toBe(false);
  });

  test("Test copyDefaultValueFromLastEntry property", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("page");
    var question = <QuestionPanelDynamicModel>(
    page.addNewQuestion("paneldynamic", "question")
  );
    question.panelCount = 0;
    question.template.addNewQuestion("text", "q1");
    question.template.addNewQuestion("text", "q2");
    question.template.addNewQuestion("text", "q3");
    question.copyDefaultValueFromLastEntry = true;
    question.addPanel();
    expect(question.isEmpty(), "It is empty").toBe(true);
    question.value = [{ q1: 1, q2: 2 }];
    question.addPanel();
    expect(question.value, "copyDefaultValueFromLastEntry is working").toEqual([
      { q1: 1, q2: 2 },
      { q1: 1, q2: 2 },
    ]);
    question.defaultPanelValue = { q1: 11, q3: 3 };
    question.addPanel();
    expect(question.value, "copyDefaultValueFromLastEntry is merging with defaultPanelValue").toEqual([
      { q1: 1, q2: 2 },
      { q1: 1, q2: 2 },
      { q1: 1, q2: 2, q3: 3 },
    ]);
  });
  test("copyDefaultValueFromLastEntry property && showOtherItem", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "paneldynamic", name: "root",
          panelCount: 1,
          templateElements: [
            { type: "paneldynamic", name: "question",
              copyDefaultValueFromLastEntry: true,
              panelCount: 0,
              templateElements: [
                { type: "dropdown", name: "q1", choices: [1, 2, 3], showOtherItem: true },
                { type: "dropdown", name: "q2", choices: [1, 2, 3], showOtherItem: true }
              ]
            }
          ]
        }
      ]
    });
    const rootPanel = <QuestionPanelDynamicModel>survey.getQuestionByName("root");
    const question = <QuestionPanelDynamicModel>(rootPanel.panels[0].getQuestionByName("question"));
    const panel1 = question.addPanel();
    panel1.getQuestionByName("q1").value = "other";
    panel1.getQuestionByName("q1").otherValue = "comment1";
    panel1.getQuestionByName("q2").value = "other";
    panel1.getQuestionByName("q2").otherValue = "comment2";
    let counter = 0;
    survey.onDynamicPanelValueChanged.add((sender, options) => {
      counter ++;
    });
    question.addPanel();
    question.addPanel();
    question.addPanel();
    question.addPanel();
    const panel6 = question.addPanel();
    expect(panel6.getQuestionByName("q1").value, "Value set").toBe("other");
    expect(panel6.getQuestionByName("q1").comment, "Comment set").toBe("comment1");
    expect(counter, "Call updates 10 times").toBe(5 * 2);
  });

  test("Generates error on clearIncorrectValue()", () => {
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
    const data = {
      qid1760: "teste",
      qid1761: "tygjhg",
      qid1792: "OUI",
      qid1787: [{ pnd1788: "teste" }],
    };
    survey.data = data;
    survey.clearIncorrectValues();
    expect(survey.data, "Do not touch anything").toEqual(data);
  });

  test("Panel dynamic and survey.data setup", () => {
    var json = {
      isSinglePage: true,
      elements: [
        {
          type: "paneldynamic",
          displayMode: "carousel",
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
    expect(survey.data, "Remove panels if set empty data").toEqual({ });
  });
  test("Panel dynamic and clearIncorrectValue, do not remove matrix-total values, Bug#2553", () => {
    var json = {
      elements: [
        {
          type: "paneldynamic",
          name: "question3",
          templateElements: [
            {
              type: "matrixdynamic",
              name: "question1",
              columns: [
                {
                  name: "Column1",
                },
                {
                  name: "Column2",
                },
                {
                  name: "Column3",
                  cellType: "expression",
                  totalType: "sum",
                  expression: "{row.Column1}+{row.Column2}",
                },
              ],
              cellType: "text",
              rowCount: 1,
            },
            {
              type: "expression",
              name: "question2",
              expression: "{panel.question1-total.column3}",
            },
          ],
        },
      ],
    };

    var survey = new SurveyModel(json);
    var data = {
      question3: [
        {
          "question1-total": { Column3: 3 },
          question2: 3,
          question1: [{ Column1: "1", Column2: "2", Column3: 3 }],
        },
      ],
    };

    survey.data = data;

    survey.clearIncorrectValues();
    expect(survey.data, "values should be the same").toEqual(data);
  });

  test("Panel dynamic nested dynamic panel and display mode, Bug#1488", () => {
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
    expect(question4.isReadOnly, "The question should be readonly").toBe(true);
    var panel2 = <QuestionPanelDynamicModel>(
      panel1.panels[0].getQuestionByName("question2")
    );
    expect(panel2.survey, "survey is set correctly to the nest dynamic panel").toBeTruthy();
    var question3 = panel2.panels[0].getQuestionByName("question3");
    expect(question3.survey, "survey is set correctly to the nest dynamic panel question").toBeTruthy();
    expect(question3.isReadOnly, "The question inside the nested dynamic panel should be readonly").toBe(true);
  });

  test("Panel dynamic nested dynamic panel and result, Bug#1514", () => {
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
    expect(lsurvey.data, "Has only one element in the array").toEqual({ dp1: [{ dp2: [{ }] }] });

    var dp1 = <QuestionPanelDynamicModel>(
    lsurvey.currentPage.getQuestionByName("dp1")
  );
    var dp2 = <QuestionPanelDynamicModel>dp1.panels[0].getQuestionByName("dp2");
    var q1 = dp2.panels[0].questions[0];
    q1.value = "val1";
    expect(lsurvey.data, "The result is correct").toEqual({ dp1: [{ dp2: [{ q1: "val1" }] }] });
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
    expect(survey.data, "The result is correct").toEqual({ dp1: [{ dp2: [{ dp3: [{ dp4: [{ q1: "val1" }] }] }] }] });
  });

  test("Bug on caching panel data during onValueChanged event, Bug#T1533", () => {
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
    survey.onDynamicPanelValueChanged.add(function(sender, options) {
      if (options.name != "q1") return;
      var q2 = options.panel.getQuestionByName("q2");
      q2.value = [1, 2, 3];
      changedValue = q2.value;
    });
    var dp1 = <QuestionPanelDynamicModel>survey.getQuestionByName("dp1");
    var q1 = dp1.panels[0].getQuestionByName("q1");
    q1.value = "val1";
    expect(changedValue, "value set correctly").toEqual([1, 2, 3]);
  });

  test("Bug on visibleIf in dynamic panel + dynamic matrix, Bug#T1716", () => {
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
    expect(panel.panels[0].getQuestionByName("q2").isVisible, "By default, q2 is invisible").toBe(false);
    panel.panels[0].getQuestionByName("q1").value = "b";
    expect(panel.panels[0].getQuestionByName("q2").isVisible, "q2 is visible now").toBe(true);
  });
  test("clear values in panel dynamic with valueName set, Bug#10345", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "text",
          "name": "q1",
          "valueName": "name"
        },
        {
          "type": "paneldynamic",
          "name": "panel",
          "templateElements": [
            {
              "type": "radiogroup",
              "name": "q2",
              "choices": [
                "a",
                "b"
              ]
            },
            {
              "type": "text",
              "name": "q3",
              "visibleIf": "{panel.q2} = 'a'",
              "valueName": "name",
              "clearIfInvisible": "onHidden"
            }
          ]
        }
      ]
    });
    survey.data = {
      q1: "name1",
      panel: [
        { q2: "a", name: "name2" },
        { q2: "a", name: "name3" }
      ]
    };
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    panel.panels[0].getQuestionByName("q2").value = "b";
    expect(survey.data, "values are cleared correctly, #1").toEqual({ q1: "name1", panel: [{ q2: "b" }, { q2: "a", name: "name3" }] });
    panel.panels[1].getQuestionByName("q2").value = "b";
    expect(survey.data, "values are cleared correctly, #2").toEqual({ q1: "name1", panel: [{ q2: "b" }, { q2: "b" }] });
  });
  test("goToNextPanel method", () => {
    var json = {
      elements: [
        {
          type: "paneldynamic",
          name: "pd",
          displayMode: "carousel",
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
    var panelDynamic = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    expect(panelDynamic.currentIndex, "first panel is current").toBe(0);

    panelDynamic.goToNextPanel();
    expect(panelDynamic.currentIndex, "first panel is current because of validation errors").toBe(0);
    expect(panelDynamic.currentPanel.validate()).toBe(false);

    survey.data = { pd: [{ q1: "a" }, { q1: "b" }] };
    expect(panelDynamic.currentPanel.validate()).toBe(true);

    panelDynamic.goToNextPanel();
    expect(panelDynamic.currentIndex, "second panel is current").toBe(1);
  });

  test("do not add new panel for list", () => {
    const json = {
      elements: [
        {
          type: "paneldynamic",
          name: "pd",
          displayMode: "carousel",
          panelCount: 1,
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

    let survey = new SurveyModel(json);
    let panelDynamic = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    expect(panelDynamic.currentIndex, "first panel is current").toBe(0);
    expect(panelDynamic.panelCount, "There is one panel").toBe(1);
    panelDynamic.addPanelUI();
    expect(panelDynamic.currentIndex, "first panel is current because of validation errors").toBe(0);
    expect(panelDynamic.panelCount, "There is still one panel").toBe(1);
    expect(panelDynamic.canAddPanel, "You still can show buttons").toBe(true);
    expect(panelDynamic.currentPanel.validate()).toBe(false);

    survey.data = { pd: [{ q1: "a" }] };
    expect(panelDynamic.currentPanel.validate()).toBe(true);

    panelDynamic.addPanelUI();
    expect(panelDynamic.currentIndex, "second panel is current").toBe(1);
    expect(panelDynamic.panelCount, "There are two panels").toBe(2);

    survey = new SurveyModel(json);
    panelDynamic = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    panelDynamic.displayMode = "list";
    panelDynamic.addPanelUI();
    expect(panelDynamic.panelCount, "Do not check for list mode").toBe(2);
  });

  test("addPanel(index, skipvalidation)", () => {
    const json = {
      elements: [
        {
          type: "paneldynamic",
          name: "pd",
          displayMode: "carousel",
          panelCount: 1,
          templateElements: [
            { type: "text", name: "q1", isRequired: true }
          ],
        },
      ],
    };

    let survey = new SurveyModel(json);
    let question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    expect(question.currentIndex, "first panel is current").toBe(0);
    expect(question.panelCount, "There is one panel").toBe(1);

    question.addPanel(undefined);
    expect(question.currentIndex, "currentIndex #2").toBe(1);
    expect(question.panelCount, "panelCount #2").toBe(2);
    expect(question.canAddPanel, "canAddPanel #2").toBe(true);

    question.copyDefaultValueFromLastEntry = true;
    question.value = [{ q1: 1 }, { q1: 2 }, { q1: 3 }];
    expect(question.currentIndex, "don't change currentIndex").toBe(1);
    question.addPanel(2);
    expect(question.currentIndex, "currentIndex #3").toBe(2);
    expect(question.panelCount, "panelCount #3").toBe(4);
  });

  test("goToPrevPanel method", () => {
    var json = {
      elements: [
        {
          type: "paneldynamic",
          name: "pd",
          displayMode: "carousel",
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
    expect(panelDynamic.currentIndex, "second panel is current").toBe(1);

    panelDynamic.goToPrevPanel();
    expect(panelDynamic.currentIndex, "first panel is current").toBe(0);
  });
  test("paneldynamic + radiogroup + others, Bug# https://github.com/surveyjs/editor/issues/480", () => {
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
              showOtherItem: true,
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
    expect(question.isOtherSelected, "Other is selected").toBe(true);
    expect(question.comment, "Comment is set correctly").toBe("Comment");
  });
  test("paneldynamic + survey.checkErrorsMode='onValueChanged', Bug# https://surveyjs.answerdesk.io/ticket/details/T1758", () => {
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
    expect(q2.errors.length, "There are no errors in the second question").toBe(0);
    q1.value = "test";
    expect(q2.errors.length, "There are still no errors in the second question").toBe(0);
    panel.value = [{ }];
    expect(q1.errors.length, "There is no errors on panel.value changed, q1").toBe(0);
    expect(q1.errors.length, "There is no errors on panel.value changed, q2").toBe(0);
    expect(q1.isEmpty(), "q1 is empty now").toBe(true);
    q1.value = "abc";
    expect(q1.errors.length, "There is no errors on value changed, #2").toBe(0);
    expect(q2.errors.length, "and there is no error in the second question").toBe(0);
    q1.value = "";
    expect(q1.errors.length, "We have the error in q1 now").toBe(1);
    survey.tryComplete();
    expect(q1.errors.length, "There is error in the first question").toBe(1);
    expect(q2.errors.length, "There is error in the second question").toBe(1);
  });
  test("paneldynamic isRequired + survey.checkErrorsMode='onValueChanged', Bug#6395", () => {
    var survey = new SurveyModel({
      checkErrorsMode: "onValueChanged",
      elements: [
        {
          type: "paneldynamic",
          name: "panel1",
          panelCount: 1,
          isRequired: true,
          templateElements: [
            {
              type: "text",
              name: "q1"
            }
          ],
        },
      ],
    });
    var panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel1");
    var q1 = <QuestionRadiogroupModel>panel.panels[0].getQuestionByName("q1");
    survey.validate();
    expect(panel.errors.length, "There is one error in panel dynamic, #1").toBe(1);
    q1.value = "test";
    expect(panel.errors.length, "There is no error in panel dynamic, #2").toBe(0);
  });

  test("paneldynamic + expression value + clear data on survey.isSinglePage = true', Bug# 1625", () => {
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
    expect(survey.data, "Data set correctly").toEqual(data);
    survey.isSinglePage = true;
    expect(survey.data, "Data is not changed after setting single page").toEqual(data);
  });
  test("Dynamic Panel validators, validators expression do not recognize 'panel.' prefix. Bug#1710", () => {
    var json = {
      elements: [
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
    expect(panel.validate(), "There is an error").toBe(false);
    panel.panels[0].getQuestionByName("pq1").value = "val";
    expect(panel.validate(), "There is no errors").toBe(true);
  });

  test("Dropdown inside Dynamic Panel. ChoicesMax choicesMin properties", () => {
    var json = {
      elements: [
        {
          type: "paneldynamic",
          name: "relatives",
          title: "Please enter all blood relatives you know",
          displayMode: "carousel",
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
          addPanelText: "Add a blood relative",
          removePanelText: "Remove the relative",
        },
      ],
    };
    var survey = new SurveyModel(json);

    var dropDownQuestion = survey.getAllQuestions()[0]["panels"][0].elements[0];

    expect(dropDownQuestion.choicesMin, "choicesMin is ok").toBe(1);
    expect(dropDownQuestion.choicesMax, "choicesMax is ok").toBe(115);
    expect(dropDownQuestion.visibleChoices.length, "visibleChoices is ok").toBe(115);
  });
  test("Matrix validation in cells and async functions in expression", () => {
    let returnResult: (res: any) => void = (res: any) => {};
    function asyncFunc(params: any): any {
      returnResult = this.returnResult;
      return false;
    }
    FunctionFactory.Instance.register("asyncFunc", asyncFunc, true);

    const question = new QuestionPanelDynamicModel("q1");
    question.panelCount = 1;
    const textQuestion = question.template.addNewQuestion("text", "q1");
    textQuestion.validators.push(new ExpressionValidator("asyncFunc() = 1"));
    let callbackRes: any = undefined;
    expect(question.validate(false, false, false, (res: boolean) => {
      callbackRes = res;
    }), "The result is not ready").toBeUndefined();
    expect(question.isRunningValidators, "We have one running validator").toBe(true);
    expect(callbackRes, "We don't have the result yet").toBeUndefined();
    returnResult(1);
    expect(question.isRunningValidators, "We are fine now").toBe(false);
    expect(callbackRes, "The result is here").toBe(true);

    FunctionFactory.Instance.unregister("asyncFunc");
  });
  test("Nested panel, setting survey.data when survey.clearInvisibleValues='onHidden', Bug# 1866", () => {
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
    expect(histologicalCategory.value, "value set correctly").toBe("foo");
  });
  test("Panel dynamic, clearInvisibleValues='onHidden' & question valueName, Bug#", () => {
    const json = {
      clearInvisibleValues: "onHidden",
      elements: [
        {
          name: "panel",
          type: "paneldynamic",
          templateElements: [
            { name: "q1", type: "text", valueName: "q1_val" },
            { name: "q2", type: "text", valueName: "q2_val", visibleIf: "{panel.q1_val} = 'a'" }
          ],
          panelCount: 1
        }
      ]
    };
    const survey = new SurveyModel(json);
    const pDynamic = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    const panel = pDynamic.panels[0];
    expect(survey.hasVisibleQuestionByValueName(panel.getQuestionByName("q2")), "It is in templates").toBe(false);
    panel.getQuestionByName("q1").value = "a";
    panel.getQuestionByName("q2").value = "b";
    expect(survey.data, "#1").toEqual({ panel: [{ q1_val: "a", q2_val: "b" }] });
    panel.getQuestionByName("q1").value = "c";
    expect(survey.data, "#2").toEqual({ panel: [{ q1_val: "c" }] });
  });
  test("Paneldynamic duplicate key value error with checkErrorsMode: onValueChanged", () => {
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
    expect(question2.errors.length, "There is no unique errors by default").toBe(0);
    question2.value = "1";
    expect(question2.errors.length, "There is unique value error, when two key values are equal").toBe(1);
    question2.value = "0";
    expect(question2.errors.length, "There is no unique errors after question with error is changed").toBe(0);
    question2.value = "1";
    question1.value = "0";
    expect(question2.errors.length, "There is no unique errors after question with no error is changed").toBe(0);
    question1.value = "1";
    question3.value = "1";
    expect(question2.errors.length, "There is unique value error on second question, when three key values are equal").toBe(1);
    expect(question3.errors.length, "There is unique value error on third question, when three key values are equal").toBe(1);
  });
  test("Expression validator error message not displayed when condition fails on value changed #10586", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "paneldynamic",
          "name": "panel",
          "templateElements": [
            {
              "type": "text",
              "name": "q1",
              "inputType": "number",
              "validators": [
                {
                  "type": "expression",
                  "expression": "{panel.q1} empty or {panel.q1} <> {panel.q2}"
                }
              ]
            },
            {
              "type": "text",
              "name": "q2",
              "inputType": "number",
              "validators": [
                {
                  "type": "expression",
                  "expression": "{panel.q2} empty or {panel.q1} <> {panel.q2}"
                }
              ]
            },
            {
              "type": "expression",
              "name": "q3",
              "expression": "{panel.q2} - {panel.q1}"
            }
          ]
        }
      ],
      "checkErrorsMode": "onValueChanged"
    });

    const panelDynamic = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    panelDynamic.addPanel();
    const q1 = panelDynamic.panels[0].getQuestionByName("q1");
    const q2 = panelDynamic.panels[0].getQuestionByName("q2");
    q1.value = 1;
    q2.value = 1;
    expect(q2.errors.length, "There is error in q2").toBe(1);
    q1.value = 2;
    expect(q2.errors.length, "There is no error in q2").toBe(0);
    q1.value = 1;
    expect(q1.errors.length, "There is error in q1").toBe(1);
    q2.value = 2;
    expect(q1.errors.length, "There is no error in q1").toBe(0);
  });
  test("Paneldynamic duplicate key value error with checkErrorsMode: onValueChanging", () => {
    var survey = new SurveyModel({
      checkErrorsMode: "onValueChanging",
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
          panelCount: 2,
        },
      ],
    });

    var panelDynamic = <QuestionPanelDynamicModel>(
      survey.getQuestionByName("panel1")
    );
    var question1 = panelDynamic.panels[0].questions[0];
    var question2 = panelDynamic.panels[1].questions[0];
    question1.value = 1;
    question2.value = 3;
    expect(survey.data).toEqual({ panel1: [{ id: 1 }, { id: 3 }] });
    question2.value = 1;
    expect(question2.errors.length, "There is unique value error, when two key values are equal").toBe(1);
    expect(question2.value, "Keep incorrect value in question").toBe(1);
    expect(survey.data, "Do not change the survey.data with incorrect values").toEqual({ panel1: [{ id: 1 }, { id: 3 }] });
    question2.value = 2;
    expect(question2.errors.length, "There is no errors").toBe(0);
    expect(survey.data, "set correct values into survey.data").toEqual({ panel1: [{ id: 1 }, { id: 2 }] });
  });
  test("Paneldynamic duplicate key value error adds several times into cell question.errors on calling validate(false), Bug #3869", () => {
    var survey = new SurveyModel({
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
          panelCount: 2,
        },
      ],
    });

    var panelDynamic = <QuestionPanelDynamicModel>(
      survey.getQuestionByName("panel1")
    );
    var question1 = panelDynamic.panels[0].questions[0];
    var question2 = panelDynamic.panels[1].questions[0];
    question1.value = "1";
    question2.value = "1";
    expect(survey.validate(false), "There is a duplication error, #1").toBe(false);
    expect(survey.validate(false), "There is a duplication error, #2").toBe(false);
    expect(survey.validate(false), "There is a duplication error, #2").toBe(false);
    expect(question2.errors.length, "There is no errors, fireCallback parameter is false").toBe(0);
    expect(survey.validate(), "There is a duplication error, #3").toBe(false);
    expect(survey.validate(), "There is a duplication error, #4").toBe(false);
    expect(survey.validate(), "There is a duplication error, #5").toBe(false);
    expect(question2.errors.length, "There is one error").toBe(1);
  });

  test("Do not reset panelCount after deleting the last panel, Bug #1972", () => {
    var json = {
      elements: [
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
    expect(panel.panelCount, "There are 3 panels by default").toBe(3);
    panel.removePanelUI(2);
    expect(panel.panelCount, "Remove the third panel").toBe(2);
    panel.removePanelUI(1);
    expect(panel.panelCount, "Remove the second panel").toBe(1);
    panel.removePanelUI(0);
    expect(panel.panelCount, "Remove the first panel").toBe(0);
  });

  test("call clearFiles for QuestionFile on removing the panel, Bug #1970", () => {
    var json = {
      elements: [
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
    survey.onClearFiles.add(function(sender, options) {
      counter++;
      options.callback("success");
      expect(options.question.name, "Question is passed in options").toBe("q2");
    });
    var panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel1");
    (<QuestionFileModel>panel.panels[0].getQuestionByName("q2")).value =
      "data:image/jpeg;base64,FILECONTENT";
    panel.removePanelUI(0);
    expect(counter, "clear files was called").toBe(1);
  });
  test("call clear value on hidden dynamic panel, Bug #6336", () => {
    const json = {
      elements: [
        {
          type: "text",
          name: "q1",
        },
        {
          type: "paneldynamic",
          name: "panel1",
          visibleIf: "{q1} = 1",
          templateElements: [
            {
              type: "text",
              name: "q2",
              clearIfInvisible: "onHiddenContainer",
            },
          ],
          panelCount: 1
        },
      ],
    };
    const survey = new SurveyModel(json);
    survey.setValue("q1", 1);
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel1");
    const textQuestion = (<QuestionTextModel>panel.panels[0].getQuestionByName("q2"));
    textQuestion.value = "val1";
    expect(textQuestion.isParentVisible, "file question parent is visible").toBe(true);
    survey.setValue("q1", 2);
    expect(panel.isVisible, "panel is invisible").toBe(false);
    expect(textQuestion.isParentVisible, "file question parent is invisible").toBe(false);
    expect(textQuestion.isEmpty(), "question value is empty, #1").toBe(true);
    survey.setValue("q1", 1);
    expect(textQuestion.isEmpty(), "question value is empty, #2").toBe(true);
  });

  test("call clearFiles for QuestionFile on clearing panel value, Bug #6336", () => {
    const json = {
      elements: [
        {
          type: "text",
          name: "q1",
        },
        {
          type: "paneldynamic",
          name: "panel1",
          visibleIf: "{q1} = 1",
          templateElements: [
            {
              type: "file",
              name: "q2",
              clearIfInvisible: "onHiddenContainer",
            },
          ],
          panelCount: 1
        },
      ],
    };
    const survey = new SurveyModel(json);
    var counter = 0;
    survey.onClearFiles.add(function(sender, options) {
      counter++;
      options.callback("success");
      expect(options.question.name, "Question is passed in options").toBe("q2");
    });
    survey.setValue("q1", 1);
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel1");
    const fileQuestion = (<QuestionFileModel>panel.panels[0].getQuestionByName("q2"));
    fileQuestion.value = "data:image/jpeg;base64,FILECONTENT";
    expect(fileQuestion.isParentVisible, "file question parent is visible").toBe(true);
    survey.setValue("q1", 2);
    expect(panel.isVisible, "panel is invisible").toBe(false);
    expect(fileQuestion.isParentVisible, "file question parent is invisible").toBe(false);
    expect(fileQuestion.isEmpty(), "question value is empty, #1").toBe(true);
    expect(counter, "clear files was called").toBe(1);
    survey.setValue("q1", 1);
    expect(fileQuestion.isEmpty(), "question value is empty, #2").toBe(true);
  });
  test("Panel dynamic with matrix dynamic inside, where matrix has defaultValue - Bug #1984, initial T3351(private)", () => {
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
    expect(panel.template.questions[0].defaultValue, "Default value in template is correct").toEqual(defaultValue);
    var matrix = <QuestionMatrixDynamicModel>(
      panel.panels[0].getQuestionByName("question2")
    );
    expect(matrix.defaultValue, "Default value is copied").toEqual(defaultValue);
    expect(matrix.value, "value is copied from default value").toEqual(defaultValue);
  });
  test("Do not change panelCount on loading in design-time, Bug #2291", () => {
    var json = {
      elements: [
        {
          type: "paneldynamic",
          name: "measurements",
          templateElements: [
            {
              type: "paneldynamic",
              name: "Some details",
              panelCount: 1,
              templateElements: [{ type: "text", name: "q1" }],
            },
          ],
          panelCount: 0,
        },
      ],
    };
    var survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON(json);
    var q = <QuestionPanelDynamicModel>survey.getQuestionByName("measurements");
    expect(q.panelCount, "The panel count is 0").toBe(0);
  });
  test("currentPanel is templatePanel in design-mode", () => {
    var json = {
      elements: [
        {
          type: "paneldynamic",
          name: "measurements",
          displayMode: "tab",
          templateElements: [
            {
              type: "text",
              name: "q1",
            },
          ],
          panelCount: 0,
        },
      ],
    };
    var survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON(json);
    var q = <QuestionPanelDynamicModel>survey.getQuestionByName("measurements");
    expect(q.currentPanel, "Current panel exists").toBeTruthy();
    expect(q.currentPanel.id, "Current panel equals to tempalte").toBe(q.template.id);
  });

  test("getProgressInfo()", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "panel",
          templateElements: [
            { type: "text", name: "q1", isRequired: true },
            { type: "text", name: "q2" },
            { type: "text", name: "q3" },
          ],
        },
      ],
    });
    survey.data = { panel: [{ q1: "1" }, { q2: "2" }, []] };
    var question = survey.getQuestionByName("panel");
    expect(question.getProgressInfo()).toEqual({
      questionCount: 9,
      answeredQuestionCount: 2,
      requiredQuestionCount: 3,
      requiredAnsweredQuestionCount: 1,
    });
  });

  test("Matrix dynamic in nested dynamic panel and properties in condition functions", () => {
    var parentQuestions = [];
    var testFunc = function(params: Array<any>) {
      parentQuestions = [];
      var q = this.question;
      while(!!q) {
        parentQuestions.push(q.name);
        q = q.parentQuestion;
      }
    };
    FunctionFactory.Instance.register("testFunc", testFunc);
    var json = {
      isSinglePage: true,
      elements: [
        {
          type: "paneldynamic",
          name: "panel1",
          panelCount: 1,
          templateElements: [
            {
              type: "paneldynamic",
              name: "nested1",
              panelCount: 1,
              templateElements: [
                {
                  type: "matrixdynamic",
                  name: "matrix",
                  columns: [
                    { cellType: "text", name: "col1", visibleIf: "testFunc()" },
                  ],
                  rowCount: 1,
                },
              ],
            },
          ],
        },
      ],
    };
    var survey = new SurveyModel(json);
    var rootPanel = survey.getQuestionByName("panel1");
    expect(rootPanel, "root panel is here").toBeTruthy();
    var nestedPanel = rootPanel.panels[0].getQuestionByName("nested1");
    expect(nestedPanel, "nested panel is here").toBeTruthy();
    expect(nestedPanel.panels.length, "There is one panel in nested panel").toBe(1);
    var matrix = nestedPanel.panels[0].getQuestionByName("matrix");
    expect(matrix, "matrix is here").toBeTruthy();
    expect(matrix.visibleRows.length, "Row has been created").toBe(1);
    expect(parentQuestions, "parent questions is correct").toEqual(["col1", "matrix", "nested1", "panel1"]);
    FunctionFactory.Instance.unregister("testFunc");
  });
  test("Check paretQuestion", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "rootPanel",
          panelCount: 1,
          templateElements: [
            { type: "text", name: "q1" },
          ],
        },
      ],
    });
    const panelDynamic = <QuestionPanelDynamicModel>survey.getAllQuestions()[0];
    expect(panelDynamic.template.getQuestionByName("q1").parentQuestion.name, "q1 - template").toBe("rootPanel");
    expect(panelDynamic.panels[0].getQuestionByName("q1").parentQuestion.name, "q1 - panel").toBe("rootPanel");
    panelDynamic.template.addNewQuestion("text", "q2");
    expect(panelDynamic.template.getQuestionByName("q2").parentQuestion.name, "q2 - template").toBe("rootPanel");
    expect(panelDynamic.panels[0].getQuestionByName("q2").parentQuestion.name, "q2 - panel").toBe("rootPanel");
  });
  test("Avoid stack-overflow", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "panel",
          templateElements: [
            { type: "text", name: "q1", isRequired: true },
            { type: "text", name: "q2" },
            { type: "text", name: "q3" },
          ],
        },
      ],
    });
    survey.onDynamicPanelValueChanged.add((sender, options) => {
      if (options.name == "q1") {
        options.panel.getQuestionByName("q2").value = "2";
      }
      if (options.name == "q2") {
        options.panel.getQuestionByName("q1").value = "1";
      }
    });

    var question = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    question.panelCount = 1;
    question.panels[0].getQuestionByName("q1").value = "1";
    expect(question.value, "Value set and there is no stack-overflow").toEqual([{ q1: "1", q2: "2" }]);
  });

  test("survey.onDynamicPanelValueChanging event", () => {
    const survey = new SurveyModel({ elements: [{
      type: "paneldynamic",
      name: "panel",
      templateElements: [
        { type: "text", name: "q1", isRequired: true },
        { type: "text", name: "q2" },
        { type: "text", name: "q3" },
      ]
    }] });
    const opt = new Array<any>();
    survey.onDynamicPanelValueChanging.add((sender, options: DynamicPanelValueChangingEvent) => {
      opt.push({ name: options.name, value: options.value, oldValue: options.oldValue, panelIndex: options.panelIndex });
    });

    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    question.panelCount = 2;
    question.panels[0].getQuestionByName("q1").value = "1";
    question.panels[1].getQuestionByName("q2").value = "2";
    question.panels[0].getQuestionByName("q1").value = "3";
    question.panels[1].getQuestionByName("q2").value = "4";
    expect(opt, "Check event calls").toEqual([{ name: "q1", panelIndex: 0, value: "1", oldValue: undefined },
      { name: "q2", panelIndex: 1, value: "2", oldValue: undefined },
      { name: "q1", panelIndex: 0, value: "3", oldValue: "1" },
      { name: "q2", panelIndex: 1, value: "4", oldValue: "2" }]);
  });
  test("survey.onDynamicPanelValueChanging event, correct value Bug#10216", () => {
    const survey = new SurveyModel({ elements: [{
      type: "paneldynamic",
      name: "panel",
      templateElements: [
        { type: "panel", name: "pnl", elements: [{ type: "text", name: "q1" }] },
      ]
    }] });
    const opt = new Array<any>();
    survey.onDynamicPanelValueChanging.add((sender, options: DynamicPanelValueChangingEvent) => {
      options.value = options.value + "!";
    });
    survey.onDynamicPanelValueChanged.add((sender, options: DynamicPanelValueChangedEvent) => {
      const pnlIndex = options.question.panels.indexOf(options.panel);
      opt.push({ name: options.name, question: options.question.name, panelIndex: options.panelIndex, pnlIndex: pnlIndex, value: options.value, oldValue: (<any>options).oldValue });
    });

    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    question.panelCount = 1;
    const q1 = question.panels[0].getQuestionByName("q1");
    q1.value = "1";
    expect(q1.value, "check value after event, #1").toBe("1!");
    expect(survey.data, "check survey.data, #2").toEqual({ panel: [{ q1: "1!" }] });
    q1.value = "2";
    expect(q1.value, "check value after event, #2").toBe("2!");
    expect(survey.data, "check survey.data, #2").toEqual({ panel: [{ q1: "2!" }] });
    expect(opt, "check event calls").toEqual([
      { name: "q1", question: "panel", panelIndex: 0, pnlIndex: 0, value: "1!", oldValue: undefined },
      { name: "q1", question: "panel", panelIndex: 0, pnlIndex: 0, value: "2!", oldValue: "1!" }
    ]);
  });
  test("getPanelWrapperCss", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "panel",
          panelCount: 1,
          templateElements: [{ type: "text", name: "q1" }],
        },
      ],
    });
    setOldTheme(survey);
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    const panel = question.panels[0];
    expect(question.getPanelWrapperCss(panel), "Default rendering: remove button in the bottom of the panel").toBe("sv_p_wrapper");
    question.removePanelButtonLocation = "right";
    expect(question.getPanelWrapperCss(panel), "Non-default rendering: remove button in the right of the panel").toBe("sv_p_wrapper sv_p_wrapper_in_row");
  });
  test("getPanelWrapperCss & templateVisibleIf", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "panel",
          panelCount: 2,
          templateVisibleIf: "{panelIndex} > 0",
          templateElements: [{ type: "text", name: "q1" }],
        },
      ],
    });
    setOldTheme(survey);
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    expect(question.panels[0].isVisible, "The firt panel is not visible").toBe(false);
    expect(question.getPanelWrapperCss(question.panels[0]), "panel invisible").toBe("");
    expect(question.panels[1].isVisible, "The second panel is visible").toBe(true);
    expect(question.getPanelWrapperCss(question.panels[1]), "panel visible").toBe("sv_p_wrapper");
    expect(question.getPanelWrapperCss(undefined), "panel is empty").toBe("sv_p_wrapper");
  });

  test("getPanelRemoveButtonCss", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "panel",
          templateElements: [{ type: "text", name: "q1" }],
        },
      ],
    });
    setOldTheme(survey);
    var question = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    expect(question.getPanelRemoveButtonCss(), "Default rendering: remove button in the bottom of the panel").toBe("sv_p_remove_btn");
    question.removePanelButtonLocation = "right";
    expect(question.getPanelRemoveButtonCss(), "Non-default rendering: remove button in the right of the panel").toBe("sv_p_remove_btn sv_p_remove_btn_right");
  });
  test("PanelDynamic, support panelIndex in expressions, Issue#2760", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("p");
    var panel = <QuestionPanelDynamicModel>(
      page.addNewQuestion("paneldynamic", "panel")
    );
    var q1 = panel.template.addNewQuestion("text", "q1");
    q1.defaultValueExpression = "{panelIndex} + 1";
    panel.panelCount = 2;
    expect(panel.panels[0].questions[0].value, "Set 1 from defaultValueExpression").toBe(1);
    expect(panel.panels[1].questions[0].value, "Set 2 from defaultValueExpression").toBe(2);
  });
  test("Unable to Preview a Matrix Dynamic inside of a Panel Dynamic , Bug#2761", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "panel",
          templateElements: [
            {
              type: "matrixdynamic",
              name: "matrix",
              columns: [
                {
                  name: "col1",
                },
              ],
              choices: [1],
              rowCount: 1,
            },
          ],
        },
      ],
      showPreviewBeforeComplete: true,
      previewMode: "answeredQuestions",
    });
    var panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    panel.addPanel();
    panel.panels[0].questions[0].visibleRows[0].cells[0].question.value = 1;
    survey.showPreview();
    expect(survey.state, "We show preview").toBe("preview");
    expect(survey.data).toEqual({ panel: [{ matrix: [{ col1: 1 }] }] });
  });
  test("Preview and survey.onDynamicPanelAdded event, Bug#4523", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "panel",
          templateElements: [
            {
              type: "dropdown",
              choices: [{ value: 1, text: "item1" }],
            },
          ],
        },
      ],
      showPreviewBeforeComplete: true,
      previewMode: "answeredQuestions",
    });
    survey.onDynamicPanelAdded.add(function (survey, options) {
      options.panel.questions[0].choices.push(new ItemValue(2, "Item2"));
    });
    var panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    panel.addPanel();
    panel.panels[0].questions[0].value = 2;
    expect(panel.panels[0].questions[0].displayValue).toBe("Item2");
    survey.showPreview();
    panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    expect(panel.panels[0].questions[0].choices.length, "Choices is added, #1").toBe(2);
    expect(panel.panels[0].questions[0].displayValue, "display value is correct, #1").toBe("Item2");
    survey.cancelPreview();
    panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    expect(panel.panels[0].questions[0].choices.length, "Choices is added, #2").toBe(2);
    expect(panel.panels[0].questions[0].displayValue, "display value is correct, #2").toBe("Item2");
  });

  test("question.indent property doesn't work inside Panel Dynamic , Bug#2764", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "panel",
          templateElements: [
            {
              type: "text",
              name: "question1",
              indent: 1,
            },
            {
              type: "panel",
              name: "nestedPanel",
              indent: 2,
              elements: [
                {
                  type: "text",
                  name: "question2",
                  indent: 3,
                },
              ],
            },
          ],
          panelCount: 1,
        },
      ],
    });
    var panel = <QuestionPanelDynamicModel>(
      survey.getQuestionByName("panel").panels[0]
    );
    expect(panel.questions[0].paddingLeft, "set padding for the first question").toBe("20px");
    expect(panel.elements[1].paddingLeft, "set padding for the nested panel").toBe("40px");
    expect(panel.elements[1].questions[0].paddingLeft, "set padding for a question in the nested panel").toBe("60px");
  });
  test("templateTitle test + survey.onValueChanged", () => {
    var survey = new SurveyModel({
      elements: [
        {
          name: "question1",
          type: "paneldynamic",
          allowAddPanel: false,
          allowRemovePanel: false,
          templateTitle: "{panel.sameVariable}",
        },
        {
          type: "radiogroup",
          name: "question2",
          choices: ["sample title 1", "sample title 2"],
        },
      ],
    });
    survey.onValueChanged.add((sender, options) => {
      if (options.name == "question2") {
        sender.getQuestionByName("question1").value = [
          { sameVariable: options.value },
        ];
      }
    });
    var panel = <QuestionPanelDynamicModel>survey.getQuestionByName("question1");
    expect(panel.panelCount, "There is no any panel").toBe(0);
    var question2 = survey.getQuestionByName("question2");
    question2.value = question2.choices[0].value;
    expect(panel.panelCount, "One panel is added").toBe(1);
    expect(panel.panels[0].locTitle.textOrHtml, "the first panel title set correctly").toBe("sample title 1");
    question2.value = question2.choices[1].value;
    expect(panel.panelCount, "We still have one panel").toBe(1);
    expect(panel.panels[0].locTitle.textOrHtml, "the first panel title set correctly again").toBe("sample title 2");
  });
  test("defaultValue &  survey.onValueChanged on adding new panel", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "val1" },
        {
          name: "panel",
          type: "paneldynamic",
          templateElements: [
            { type: "expression", name: "q5", expression: "{panel.q4} + {panel.q3}" },
            { type: "text", name: "q1", defaultValue: 1 },
            { type: "text", name: "q2", defaultValue: 2 },
            { type: "text", name: "q3", defaultValueExpression: "{panel.q1} + {panel.q2}" },
            { type: "text", name: "q4", defaultValueExpression: "{val1}" }
          ]
        }
      ],
    });
    survey.setValue("val1", 4);
    let counter = 0;
    survey.onValueChanged.add((sender, options) => {
      counter ++;
    });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    panel.addPanel();
    expect(panel.value, "panel.value #1").toEqual([{ q1: 1, q2: 2, q3: 3, q4: 4, q5: 7 }]);
    expect(counter, "survey.onValueChanged call times #1").toBe(1);
    panel.addPanel();
    expect(panel.value, "panel.value #2").toEqual([{ q1: 1, q2: 2, q3: 3, q4: 4, q5: 7 }, { q1: 1, q2: 2, q3: 3, q4: 4, q5: 7 }]);
    expect(counter, "survey.onValueChanged call times #2").toBe(2);
  });
  test("Dependend choices not working properly in PanelDynamic Bug #2851", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "checkbox",
          name: "q1",
          choices: ["A", "B", "C", "D", "E"],
        },
        {
          type: "paneldynamic",
          name: "panel",
          templateElements: [
            {
              type: "dropdown",
              name: "q2",
              choicesFromQuestion: "q1",
              choicesFromQuestionMode: "selected",
            },
          ],
        },
      ],
    });
    survey.getQuestionByName("q1").value = ["A", "B", "C"];
    var panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    panel.panelCount = 1;
    var q2 = <QuestionDropdownModel>panel.panels[0].getQuestionByName("q2");
    expect(q2.visibleChoices.length, "has 3 items from q1").toBe(3);
    expect(q2.visibleChoices[1].value, "the second value is B").toBe("B");
    survey.getQuestionByName("q1").value = ["C"];
    expect(q2.visibleChoices.length, "has one item from q1").toBe(1);
    expect(q2.visibleChoices[0].value, "the only item is C").toBe("C");
  });
  test("Dynamic Panel, getDisplayValue(), Bug#2855", () => {
    var json = {
      elements: [
        {
          type: "paneldynamic",
          name: "panel",
          panelCount: 3,
          templateElements: [
            {
              type: "text",
              name: "q1",
              title: "Question 1",
            },
            {
              type: "dropdown",
              name: "q2",
              title: "Question 2",
              choices: [
                { value: 1, text: "A" },
                { value: 2, text: "B" },
              ],
            },
          ],
        },
      ],
    };
    var survey = new SurveyModel(json);
    var panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    expect(panel.getDisplayValue(true, [{ q1: "a", q2: 1 }, { q2: 2 }]), "Do not use value").toEqual([{ "Question 1": "a", "Question 2": "A" }, { "Question 2": "B" }]);
  });
  test("Support panel dynamic for isContainerReady", () => {
    var survey = new SurveyModel({
      elements: [
        {
          "type": "paneldynamic",
          "name": "panel1",
          "templateElements": [
            {
              "type": "text",
              "name": "q1",
              "isRequired": true
            },
            {
              "type": "expression",
              "name": "exp1",
              "expression": "isContainerReady('panel1', {panelIndex})",
            }
          ],
          "panelCount": 2,
        },
        {
          "type": "expression",
          "name": "exp2",
          "expression": "isContainerReady('panel1')",
        }
      ]
    });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel1");
    const panel1Exp = panel.panels[0].getQuestionByName("exp1");
    const panel2Exp = panel.panels[1].getQuestionByName("exp1");
    const exp = survey.getQuestionByName("exp2");
    expect(panel1Exp.value, "panel1Exp").toBe(false);
    expect(panel2Exp.value, "panel2Exp").toBe(false);
    expect(exp.value, "exp").toBe(false);

    panel.panels[0].getQuestionByName("q1").value = "val1";
    expect(panel1Exp.value, "panel1Exp").toBe(true);
    expect(panel2Exp.value, "panel2Exp").toBe(false);
    expect(exp.value, "exp").toBe(false);

    panel.panels[1].getQuestionByName("q1").value = "val1";
    expect(panel1Exp.value, "panel1Exp").toBe(true);
    expect(panel2Exp.value, "panel2Exp").toBe(true);
    expect(exp.value, "exp").toBe(true);
  });
  test("isContainerReady with nested panel dynamic and defaultValueExpression, bug#11142", () => {
    var survey = new SurveyModel({
      pages: [
        {
          name: "page1",
          elements: [
            {
              "type": "text",
              "name": "isContainerReady",
              "defaultValueExpression": "isContainerReady('page1')"
            },
            {
              "type": "paneldynamic",
              "name": "question3",
              "templateElements": [
                {
                  "type": "text",
                  "name": "question1",
                  "isRequired": true
                },
                {
                  "type": "paneldynamic",
                  "name": "question4",
                  "templateElements": [
                    {
                      "type": "text",
                      "name": "question5",
                      "isRequired": true
                    }
                  ],
                  "panelCount": 1
                }
              ],
              "panelCount": 1
            }
          ]
        }
      ]
    });
    const isReadyQuestion = survey.getQuestionByName("isContainerReady");
    expect(isReadyQuestion.value, "isContainerReady is false on init").toBe(false);

    const rootPanel = <QuestionPanelDynamicModel>survey.getQuestionByName("question3");
    rootPanel.panels[0].getQuestionByName("question1").value = "val1";
    expect(isReadyQuestion.value, "isContainerReady is still false after changing question1").toBe(false);

    const nestedPanel = <QuestionPanelDynamicModel>rootPanel.panels[0].getQuestionByName("question4");
    nestedPanel.panels[0].getQuestionByName("question5").value = "val1";
    expect(isReadyQuestion.value, "isContainerReady is true after changing question5").toBe(true);
  });

  test("cssClasses for a question in nested panel dynamic, #1", () => {
    var survey = new SurveyModel({
      elements: [
        {
          "type": "paneldynamic",
          "name": "panel1",
          "templateElements": [
            {
              "type": "paneldynamic",
              "name": "panel2",
              "templateElements": [
                {
                  "type": "text",
                  "name": "q1",
                  "isRequired": true
                }
              ],
              "panelCount": 1,
            }
          ],
          "panelCount": 1,
        }
      ]
    });
    const rootPanel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel1");
    const nestedPanel = <QuestionPanelDynamicModel>rootPanel.panels[0].getQuestionByName("panel2");
    const question = nestedPanel.panels[0].getQuestionByName("q1");
    expect(question.cssClassesValue.mainRoot, "Main root style is set").toBeTruthy();
  });
  test("cssClasses for a question in nested panel dynamic, #2", () => {
    var survey = new SurveyModel({
      elements: [
        {
          "type": "paneldynamic",
          "name": "panel1",
          "templateElements": [
            {
              "type": "paneldynamic",
              "name": "panel2",
              "templateElements": [
                {
                  "type": "text",
                  "name": "q1",
                },
                {
                  "type": "text",
                  "name": "q2",
                  "startWithNewLine": false
                }
              ],
              "panelCount": 1,
            }
          ],
          "panelCount": 1,
        }
      ]
    });
    const rootPanel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel1");
    const nestedPanel = <QuestionPanelDynamicModel>rootPanel.panels[0].getQuestionByName("panel2");
    const panel = nestedPanel.panels[0];
    const question = panel.getQuestionByName("q1");
    expect(question.wasRendered, "question.onFirstRendering was called").toBe(true);
    expect(question.cssClassesValue.mainRoot, "Main root style is set").toBeTruthy();
    expect(panel.rows.length, "There is one row").toBe(1);
    const row = panel.rows[0];
    expect(row.visibleElements.length, "There are two visible elements").toBe(2);
    expect(panel.cssClasses.row, "panel classes has value").toBeTruthy();
    expect(row.getRowCss(), "There are values").toBeTruthy();
  });

  test("noEntriesText property for panel dynamic", () => {
    let survey = new SurveyModel({
      elements: [
        {
          "type": "paneldynamic",
          "name": "q1",
          "noEntriesText": "text1"
        }
      ]
    });
    let question = <QuestionPanelDynamicModel>survey.getQuestionByName("q1");
    expect(question.noEntriesText, "noEntriesText set via JSON").toBe("text1");
    question.noEntriesText = "text2";
    expect(question.noEntriesText, "noEntriesText set via API").toBe("text2");
    survey = new SurveyModel({
      elements: [
        {
          "type": "paneldynamic",
          "name": "q1",
        }
      ]
    });
    question = <QuestionPanelDynamicModel>survey.getQuestionByName("q1");
    expect(question.noEntriesText, "noEntriesText default value").toBe("No entries yet.\nClick the button below to add a new entry.");
  });

  test("noEntriesReadonlyText property for panel dynamic", () => {
    const survey = new SurveyModel({
      elements: [
        { "type": "paneldynamic", "name": "panel1" },
        { "type": "paneldynamic", "name": "panel2", allowAddPanel: false },
      ]
    });
    const panel1 = <QuestionPanelDynamicModel>survey.getQuestionByName("panel1");
    const panel2 = <QuestionPanelDynamicModel>survey.getQuestionByName("panel2");
    expect(panel1.noEntriesText.indexOf("No entries yet.\nClick the button below to add a new entry."), "panel1 default").toBe(0);
    expect(panel2.noEntriesText.indexOf("No entries"), "panel2: text for allowAddPanel false").toBe(0);
    panel1.allowAddPanel = false;
    expect(panel1.noEntriesText.indexOf("No entries"), "panel1: text for allowAddPanel false").toBe(0);
    expect(panel2.noEntriesText.indexOf("No entries"), "panel2: text for allowAddPanel false").toBe(0);
  });

  test("Question defaultValueExpression in panel dynamic", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "panel",
          panelCount: 1,
          templateElements: [
            { type: "text", name: "q1", defaultValue: 1 },
            { type: "text", name: "q2", defaultValueExpression: "{panel.q1} + 2" },
          ],
        }
      ] });
    const panel = (<QuestionPanelDynamicModel>survey.getQuestionByName("panel")).panels[0];
    const q1 = panel.getQuestionByName("q1");
    const q2 = panel.getQuestionByName("q2");
    expect(q2.value, "initial value").toBe(3);
    q1.value = 5;
    expect(q2.value, "q1 is changed").toBe(7);
    q2.value = 4;
    expect(q2.value, "changed dirrectly").toBe(4);
    q1.value = 10;
    expect(q2.value, "stop react on defaultValueExpression").toBe(4);
  });
  test("Check go prev/next", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "rootPanel",
          panelCount: 2,
          displayMode: "carousel",
          templateElements: [
            { type: "text", name: "q1" },
          ],
        },
      ],
    });
    const panelDynamic = <QuestionPanelDynamicModel>survey.getAllQuestions()[0];
    expect(panelDynamic.currentIndex, "first panel").toBe(0);
    expect(panelDynamic.panelCount, "2 panels").toBe(2);
    panelDynamic.goToNextPanel();
    expect(panelDynamic.currentIndex, "second panel 1").toBe(1);
    panelDynamic.goToNextPanel();
    expect(panelDynamic.currentIndex, "second panel 2").toBe(1);
    panelDynamic.goToPrevPanel();
    expect(panelDynamic.currentIndex, "first panel 3").toBe(0);
    panelDynamic.goToPrevPanel();
    expect(panelDynamic.currentIndex, "first panel 4").toBe(0);

    panelDynamic.removePanel(0);
    expect(panelDynamic.panelCount, "1 panel").toBe(1);
    expect(panelDynamic.currentIndex, "first panel 5").toBe(0);
    panelDynamic.goToPrevPanel();
    expect(panelDynamic.currentIndex, "first panel 6").toBe(0);
    panelDynamic.goToNextPanel();
    expect(panelDynamic.currentIndex, "first panel 7").toBe(0);

    panelDynamic.removePanel(0);
    expect(panelDynamic.panelCount, "no panels").toBe(0);
    expect(panelDynamic.currentIndex, "first panel? 8").toBe(-1);
    panelDynamic.goToNextPanel();
    expect(panelDynamic.currentIndex, "first panel? 9").toBe(-1);
    panelDynamic.goToPrevPanel();
    expect(panelDynamic.currentIndex, "first panel? 10").toBe(-1);

    panelDynamic.addPanel();
    expect(panelDynamic.currentIndex, "first panel 11").toBe(0);
    expect(panelDynamic.panelCount, "1 panels").toBe(1);
  });
  test("Bindings to panelCount performance issue", () => {
    var counter = 1;
    const calcCount = () => { return counter ++; };
    FunctionFactory.Instance.register("calcCount", calcCount);
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        {
          type: "paneldynamic",
          name: "panel1",
          bindings: {
            "panelCount": "q1"
          },
          templateElements: [
            { type: "text", name: "panel1_q1", visibleIf: "calcCount() > 1" },
          ],
        },
        {
          type: "paneldynamic",
          name: "panel2",
          bindings: {
            "panelCount": "q1"
          },
          templateElements: [
            { type: "text", name: "panel2_q1", visibleIf: "calcCount() > 1" },
          ],
        },
      ],
    });
    expect(counter, "There is no questions").toBe(1);
    survey.setValue("q1", 2);
    expect(counter, "4 questions has been created").toBe(1 + 4 * 2);
    FunctionFactory.Instance.unregister("calcCount");
  });
  test("Bindings to panelCount performance issue", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "panel1",
          panelCount: 2,
          templateElements: [
            { type: "text", name: "q1" },
            {
              type: "matrixdynamic",
              name: "q2",
              bindings: {
                "rowCount": "q1"
              },
              columns: [
                { name: "col1" }
              ]
            }
          ],
        }
      ],
    });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel1");
    panel.panels[0].questions[0].value = 3;
    panel.panels[1].questions[0].value = 5;
    expect(panel.panels[0].questions[1].rowCount, "matrix in first panel binds correctly").toBe(3);
    expect(panel.panels[1].questions[1].rowCount, "matrix in second panel binds correctly").toBe(5);
  });
  test("Bindings to panelCount performance issue #2 reduce recalc visibleIndex/no", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        {
          type: "paneldynamic",
          name: "panel1",
          bindings: {
            "panelCount": "q1"
          },
          templateElements: [
            { type: "text", name: "panel1_q1" },
            { type: "text", name: "panel1_q2", visibleIf: "{q1} > 7" }
          ],
        },
        {
          type: "paneldynamic",
          name: "panel2",
          bindings: {
            "panelCount": "q1"
          },
          templateElements: [
            { type: "text", name: "panel2_q1" },
            { type: "text", name: "panel2_q2", visibleIf: "{q1} > 7" }
          ],
        },
        {
          type: "paneldynamic",
          name: "panel3",
          bindings: {
            "panelCount": "q1"
          },
          templateElements: [
            { type: "text", name: "panel3_q1" },
            { type: "text", name: "panel3_q2", visibleIf: "{q1} > 7" }
          ],
        },
      ],
    });
    var counter = 0;
    survey.onGetProgressText.add((sender, options) => {
      counter ++;
    });
    counter = 0;
    survey.setValue("q1", 5);
    const panel1 = <QuestionPanelDynamicModel>survey.getQuestionByName("panel1");
    expect(panel1.panelCount, "We have 5 panels").toBe(5);
    expect(survey.progressText, "progressText").toBe("Page 1 of 1");
    expect(counter, "update visible index calls only two times, on after binding (updateVisibleIndexes) and on value changed").toBe(1);
  });
  test("Bindings to panelCount & setting survey.data, Bug#10406", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        {
          type: "paneldynamic",
          name: "panel1",
          bindings: {
            "panelCount": "q1"
          },
          templateElements: [
            { type: "text", name: "panel1_q1" }
          ],
        }
      ]
    });
    const q1 = survey.getQuestionByName("q1");
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel1");
    survey.data = { q1: 5, panel1: [{ panel1_q1: 1 }, { panel1_q1: 2 }, { panel1_q1: 3 }, { panel1_q1: 4 }, { panel1_q1: 5 }] };
    expect(q1.value, "q1.value #1").toBe(5);
    expect(panel.panelCount, "panelCount #1").toBe(5);
    survey.data = { q1: 3 };
    expect(q1.value, "q1.value #2").toBe(3);
    expect(panel.panelCount, "panelCount #2").toBe(3);
  });
  test("Check needResponsiveWidth", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "panel",
          templateElements: [
            { type: "text", name: "panel_q1" },
            { type: "text", name: "panel_q2", }
          ],
        },
      ],
    });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    panel.panelCount = 0;
    expect(panel.needResponsiveWidth()).toBe(false);
    panel.panelCount = 2;
    expect(panel.needResponsiveWidth()).toBe(false);
    panel.getPanels()[0].elements[1].startWithNewLine = false;
    panel.panelCount = 0;
    expect(panel.needResponsiveWidth()).toBe(true);
    panel.panelCount = 2;
    expect(panel.needResponsiveWidth()).toBe(true);
  });

  test("Check progress", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "progress_panel",
          displayMode: "carousel",
          templateElements: [
            { type: "text", name: "panel_q1" },
            { type: "text", name: "panel_q2" }
          ],
          panelCount: 5
        },
      ],
    });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("progress_panel");
    panel.currentIndex = 0;
    expect(panel.progress, "check progress 1 of 5").toBe("20%");
    panel.currentIndex = 2;
    expect(panel.progress, "check progress 3 of 5").toBe("60%");
    panel.currentIndex = 4;
    expect(panel.progress, "check progress 5 of 5").toBe("100%");
  });
  test("Check paneldynamic navigation", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "progress_panel",
          displayMode: "carousel",
          templateElements: [
            { type: "text", name: "panel_q1" },
          ],
          panelCount: 5
        },
      ],
    });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("progress_panel");
    survey.css = defaultCss;
    panel.currentIndex = 0;
    expect(panel.footerToolbar.actions[0].visible, "prev (text) btn is not visible when currentIndex is 0/4").toBe(false);
    expect(panel.footerToolbar.actions[1].visible, "next (text) btn is visible when currentIndex is 0/4").toBe(true);
    expect(panel.canAddPanel, "can't add panel when currentIndex less then panelCount").toBe(false);
    panel.currentIndex = 2;
    expect(panel.footerToolbar.actions[0].visible, "prev (text) btn is visible when currentIndex is 2/4").toBe(true);
    expect(panel.footerToolbar.actions[1].visible, "next (text) btn is visible when currentIndex is 2/4").toBe(true);
    expect(panel.canAddPanel, "can't add panel when currentIndex less then panelCount").toBe(false);
    panel.currentIndex = 4;
    expect(panel.footerToolbar.actions[0].visible, "prev (text) btn is visible when currentIndex is 4/4").toBe(true);
    expect(panel.footerToolbar.actions[1].visible, "next (text) btn is visible when currentIndex is 4/4").toBe(false);
    expect(panel.canAddPanel, "can add panel when currentIndex less then panelCount").toBe(true);
    panel.displayMode = "list";
    expect(panel.footerToolbar.actions[0].visible, "prev (text) btn is not visible in list mode").toBe(false);
    expect(panel.footerToolbar.actions[1].visible, "next (text) btn is not visible in list mode").toBe(false);
    expect(panel.canAddPanel, "can always add panel in list mode").toBe(true);
    panel.displayMode = "carousel";
    panel.isMobile = true;
    expect(panel.footerToolbar.actions[3].visible, "progress text is not visible in mobile mode").toBe(false);
  });
  test("paneldynamic add new button is not visible for progress render mode, bug#5600", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "progress_panel",
          diplayMode: "carousel",
          progressBarLocation: "topBottom",
          templateElements: [
            { type: "text", name: "panel_q1" },
          ],
        },
      ],
    });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("progress_panel");
    const addBtn = panel.footerToolbar.getActionById("sv-pd-add-btn");
    expect(addBtn.isVisible, "It is visible by default").toBe(true);
    panel.addPanel();
    for (var i = 0; i < 4; i ++) {
      panel.addPanel();
      expect(addBtn.isVisible, "It is visible by default").toBe(true);
    }
    expect(panel.panelCount, "We have 5 panels").toBe(5);
  });

  test("call locationChangedCallback for cell question", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "panel",
          panelCount: 2,
          templateElements: [
            { type: "text", name: "panel_q1" },
          ],
        }
      ] });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    let counter = 0;
    panel.panels[1].questions[0].localeChangedCallback = () => { counter ++; };
    survey.locale = "de";
    survey.locale = "";
    expect(counter, "locationChangedCallback called").toBe(2);
  });
  test("checkbox vs valuePropertyName and display text", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "checkbox",
          name: "q1",
          choices: [{ value: 1, text: "apple" }, { value: 2, text: "banana" }, { value: 3, text: "orange" }],
          valueName: "data1",
          valuePropertyName: "fruit",
          showOtherItem: true
        },
        {
          type: "paneldynamic",
          name: "panel",
          valueName: "data1",
          templateTitle: "{panel.fruit}",
          templateElements: [
            { type: "text", name: "panel_q1", title: "{panel.fruit}" },
          ],
        }
      ]
    });
    const q = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    q.renderedValue = [1, 3];
    expect(panel.panelCount, "There are two panels").toBe(2);
    expect(panel.panels[0].locTitle.renderedHtml, "panel1 title").toBe("apple");
    expect(panel.panels[1].locTitle.renderedHtml, "panel2 title").toBe("orange");
    const p1_q1 = panel.panels[0].getQuestionByName("panel_q1");
    const p2_q1 = panel.panels[1].getQuestionByName("panel_q1");
    expect(p1_q1.locTitle.renderedHtml, "title for question in panel1").toBe("apple");
    expect(p2_q1.locTitle.renderedHtml, "title for question in panel2").toBe("orange");
  });
  test("checkbox vs valuePropertyName and display text and useDisplayValuesInDynamicTexts = false", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "checkbox",
          name: "q1",
          choices: [{ value: 1, text: "apple" }, { value: 2, text: "banana" }, { value: 3, text: "orange" }],
          valueName: "data1",
          valuePropertyName: "fruit",
          useDisplayValuesInDynamicTexts: false
        },
        {
          type: "paneldynamic",
          name: "panel",
          valueName: "data1",
          templateTitle: "{panel.fruit}",
          templateElements: [
            { type: "text", name: "panel_q1", title: "{panel.fruit}" },
          ],
        }
      ]
    });
    const q = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    q.renderedValue = [1, 3];
    expect(panel.panelCount, "There are two panels").toBe(2);
    expect(panel.panels[0].locTitle.renderedHtml, "panel1 title").toBe("1");
    expect(panel.panels[1].locTitle.renderedHtml, "panel2 title").toBe("3");
    const p1_q1 = panel.panels[0].getQuestionByName("panel_q1");
    const p2_q1 = panel.panels[1].getQuestionByName("panel_q1");
    expect(p1_q1.locTitle.renderedHtml, "title for question in panel1").toBe("1");
    expect(p2_q1.locTitle.renderedHtml, "title for question in panel2").toBe("3");
  });
  test("checkbox vs valuePropertyName and display text and valuePropertyName is in uppercase, Bug#10707", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "checkbox",
          name: "q1",
          choices: [{ value: 1, text: "apple" }, { value: 2, text: "banana" }, { value: 3, text: "orange" }],
          valueName: "data1",
          valuePropertyName: "fruitID"
        },
        {
          type: "paneldynamic",
          name: "panel",
          valueName: "data1",
          templateTitle: "{panel.fruitID}",
          templateElements: [
            { type: "text", name: "panel_q1", title: "{panel.fruitID}" },
          ],
        }
      ]
    });
    const q = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    q.renderedValue = [1, 3];
    expect(panel.panelCount, "There are two panels").toBe(2);
    expect(panel.panels[0].locTitle.renderedHtml, "panel1 title").toBe("apple");
    expect(panel.panels[1].locTitle.renderedHtml, "panel2 title").toBe("orange");
    const p1_q1 = panel.panels[0].getQuestionByName("panel_q1");
    const p2_q1 = panel.panels[1].getQuestionByName("panel_q1");
    expect(p1_q1.locTitle.renderedHtml, "title for question in panel1").toBe("apple");
    expect(p2_q1.locTitle.renderedHtml, "title for question in panel2").toBe("orange");
  });
  test("checkbox vs valuePropertyName and rendering panels, Bug#10633", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "checkbox",
          name: "q1",
          choices: ["apple", "banana", "orange"],
          valueName: "data1",
          valuePropertyName: "fruit"
        },
        {
          type: "paneldynamic",
          name: "panel",
          valueName: "data1",
          templateTitle: "{panel.fruit}",
          templateElements: [
            { type: "text", name: "panel_q1" },
          ],
        }
      ]
    });
    const q = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    q.clickItemHandler(q.choices[0], true);
    expect(panel.panelCount, "There are two panels").toBe(1);
    q.clickItemHandler(q.choices[1], true);
    const panels = panel.getPropertyValue("panels");
    expect(panels.length, "There are two panels").toBe(2);
    expect(panels[0].wasRendered, "panel1 is rendered").toBe(true);
    expect(panels[1].wasRendered, "panel2 is rendered").toBe(true);
    const panel2 = panels[1];
    const rows = panel2.visibleRows;
    expect(rows.length, "panel2 rows count").toBe(1);
    expect(rows[0].visibleElements.length, "panel2 first row elements count").toBe(1);
    expect(rows[0].visibleElements[0].name, "panel2 first row first element name").toBe("panel_q1");
    expect((<any>rows[0].visibleElements[0]).wasRendered, "panel2 first row first element wasRendered").toBe(true);
  });
  test("Incorrect default value in panel dynamic", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "panel",
          defaultValueExpression: "no",
          templateElements: [
            { type: "text", name: "panel_q1" },
          ],
          panelCount: 2
        }
      ]
    });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    expect(panel.panelCount, "There are two panels").toBe(2);
    const p1_q1 = panel.panels[0].getQuestionByName("panel_q1");
    expect(p1_q1.name, "question name is correct").toBe("panel_q1");
  });

  test("Check paneldynamic isReady flag with onDownloadFile callback", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "panel",
          templateElements: [
            {
              type: "file",
              name: "file1",
              storeDataAsText: false,
            }
          ],
          panelCount: 1
        }
      ],
    });
    const panel = survey.getAllQuestions()[0];
    const question = panel.panels[0].questions[0];
    let log = "";
    const callbacks = new Array<any>();
    const contents = new Array<string>();
    survey.onDownloadFile.add((survey, options) => {
      expect(options.question.isReady).toBe(false);
      contents.push(options.content.replace("url", "content"));
      callbacks.push(options.callback);
      log += "->" + options.fileValue.name;
    });
    const readyLogs = new Array<boolean>();
    panel.onReadyChanged.add(() => {
      readyLogs.push(question.isReady);
    });
    survey.data = { panel: [{
      "file1": [{
        content: "url1",
        name: "file1.png",
        type: "image/png"
      }, {
        content: "url2",
        name: "file2.png",
        type: "image/png"
      }]
    }] };

    expect(panel.isReady, "panel is not ready").toBe(false);
    expect(log).toBe("->file1.png->file2.png");
    expect(callbacks.length, "Two callbacks").toBe(2);
    for (let i = 0; i < callbacks.length; i ++) {
      callbacks[i]("success", contents[i]);
    }
    expect(panel.isReady, "panel is ready").toBe(true);
    expect(panel.panels[0].questions[0].previewValue).toEqual([{
      content: "content1",
      name: "file1.png",
      type: "image/png"
    }, {
      content: "content2",
      name: "file2.png",
      type: "image/png"
    }]);
    expect(readyLogs.length, "readyLogs.length").toBe(2);
    expect(readyLogs[0], "readyLogs[0]").toBe(false);
    expect(readyLogs[1], "readyLogs[1]").toBe(true);

  });
  test("Two nested invisible dynamic panels do not clear itself correctly, Bug#5206", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "rootPanel",
          panelCount: 1,
          templateElements: [
            {
              name: "q1",
              type: "radiogroup",
              choices: [1, 2, 3],
            },
            {
              name: "panel1",
              type: "paneldynamic",
              visibleIf: "{panel.q1} = 1",
              panelCount: 1,
              allowAddPanel: false,
              allowRemovePanel: false,
              templateElements: [
                {
                  type: "text",
                  name: "panel1_q1",
                },
              ],
            },
            {
              name: "panel2",
              type: "paneldynamic",
              visibleIf: "{panel.q1} = 1",
              panelCount: 1,
              allowAddPanel: false,
              allowRemovePanel: false,
              templateElements: [
                {
                  type: "text",
                  name: "panel2_q1",
                },
              ],
            },
          ],
        },
      ],
    });
    const rootPanel = <QuestionPanelDynamicModel>survey.getQuestionByName("rootPanel");
    rootPanel.panels[0].getQuestionByName("q1").value = 2;
    survey.tryComplete();
    expect(survey.data, "There is no empty data for any nested panels").toEqual({ "rootPanel": [{ "q1": 2 }] });
  });

  test("Check paneldynamic panel actions", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "panel",
          templateElements: [
            { type: "text", name: "q1" },
          ],
          minPanelCount: 1,
          panelCount: 2,
          removePanelText: "Remove Panel"
        }
      ]
    });
    const paneldynamic = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    let updatedPanels: any[] = [];
    survey.onGetPanelFooterActions.add((sender, opt) => {
      expect(sender).toBe(survey);
      expect(opt.question).toBe(paneldynamic);
      expect(paneldynamic.panels.indexOf(opt.panel) > -1).toBeTruthy();
      updatedPanels.push(opt.panel);
      opt.actions.push({
        id: "test",
        title: "test",
        action: () => {}
      });
    });
    expect(paneldynamic.panels[0].footerActions.length).toBe(0);
    expect(paneldynamic.panels[0]["footerToolbarValue"]).toBeUndefined();

    //panel actions should be created only after footerToolbar is requested

    const actions = paneldynamic.panels[0].getFooterToolbar().actions;
    paneldynamic.panels[1].getFooterToolbar();
    expect(updatedPanels).toEqual(paneldynamic.panels);

    expect(actions.length).toBe(2);
    expect(actions[1].title).toBe("test");

    paneldynamic.removePanel(paneldynamic.panels[1]);

    expect(actions.length).toBe(2);
    expect(actions[0].visible).toBe(false);
  });
  test("Error in nested dynamic collapsed panel", () => {
    const survey = new SurveyModel({
      elements: [
        {
          "type": "paneldynamic",
          "name": "rootPanel",
          "templateElements": [{
            "type": "paneldynamic",
            "name": "childPanel",
            "title": "childPanel",
            "state": "collapsed",
            "templateElements": [{
              "type": "multipletext",
              "name": "question1",
              "items": [{
                "name": "mtom",
                "isRequired": true,
                "inputType": "number"
              }]
            }],
            "panelCount": 1
          }],
          "panelCount": 1
        }]
    });
    const rootPanel = <QuestionPanelDynamicModel>survey.getQuestionByName("rootPanel");
    const childPanel = <QuestionPanelDynamicModel>rootPanel.panels[0].getQuestionByName("childPanel");
    expect(childPanel.state, "child panel State is collapsed by default").toBe("collapsed");
    survey.tryComplete();
    expect(childPanel.state, "child panel state is expanded now").toBe("expanded");
  });
  test("Error in nested dynamic collapsed panel && displayMode - carousel", () => {
    const survey = new SurveyModel({
      elements: [
        {
          "type": "paneldynamic",
          "name": "rootPanel",
          "templateElements": [{
            "type": "paneldynamic",
            "name": "childPanel",
            "title": "childPanel",
            "state": "collapsed",
            "templateElements": [{
              "type": "multipletext",
              "name": "question1",
              "items": [{
                "name": "mtom",
                "isRequired": true,
                "inputType": "number"
              }]
            }],
            "panelCount": 1
          }],
          "panelCount": 1,
          "displayMode": "carousel"
        }]
    });
    const rootPanel = <QuestionPanelDynamicModel>survey.getQuestionByName("rootPanel");
    const childPanel = <QuestionPanelDynamicModel>rootPanel.panels[0].getQuestionByName("childPanel");
    expect(childPanel.state, "child panel State is collapsed by default").toBe("collapsed");
    expect(rootPanel.panelCount, "There is one panel").toBe(1);
    rootPanel.addPanelUI();
    expect(rootPanel.panelCount, "There is still one panel").toBe(1);
    expect(childPanel.state, "child panel state is expanded now").toBe("expanded");
  });
  test("Skip unknown questions", () => {
    const survey = new SurveyModel({
      elements: [
        {
          "type": "paneldynamic",
          "name": "panel",
          "templateElements": [
            { "type": "textqqq", "name": "q1" },
            { "type": "text", "name": "q2" },
            { "name": "q3" }
          ],
          "panelCount": 1
        }]
    });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    expect(panel.panels[0].elements.length, "There is one quesiton in panel").toBe(1);
  });
  test("NoentriesText and readOnly", () => {
    const survey = new SurveyModel({
      elements: [
        { "type": "paneldynamic", "name": "panel1" },
        { "type": "paneldynamic", "name": "panel2", readOnly: true },
      ]
    });
    const panel1 = <QuestionPanelDynamicModel>survey.getQuestionByName("panel1");
    const panel2 = <QuestionPanelDynamicModel>survey.getQuestionByName("panel2");
    expect(panel1.noEntriesText.indexOf("No entries yet."), "panel1: text for editing").toBe(0);
    expect(panel2.noEntriesText, "panel2: text for readonly").toBe("No entries");
    survey.readOnly = true;
    expect(panel1.noEntriesText, "panel1: text for readonly").toBe("No entries");
  });
  test("Carry forward in panel dynamic", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "paneldynamic",
          "name": "panel",
          templateElements: [
            { type: "checkbox", name: "q1", choices: [1, 2, 3, 4, 5] },
            { type: "dropdown", name: "q2", choicesFromQuestion: "panel.q1", choicesFromQuestionMode: "selected" }
          ],
          panelCount: 1
        }
      ]
    });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel").panels[0];
    const q1 = panel.getQuestionByName("q1");
    const q2 = panel.getQuestionByName("q2");
    expect(q2.choicesFromQuestion, "choicesFromQuestion is loaded").toBe("panel.q1");
    expect(q2.choicesFromQuestionMode, "choicesFromQuestionMode is loaded").toBe("selected");
    expect(q2.visibleChoices.length, "There is no visible choices").toBe(0);
    q1.value = [1, 3, 5];
    expect(q2.visibleChoices.length, "Choices are here").toBe(3);
    expect(q2.visibleChoices[1].value, "A choice value is correct").toBe(3);
  });
  test("Doesn't update value correctly for nested matrix with expressions, bug#5549", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "panel",
          panelCount: 1,
          templateElements: [
            {
              type: "matrixdynamic",
              name: "matrix",
              columns: [
                {
                  name: "col1",
                  cellType: "text",
                  isRequired: true,
                  inputType: "number",
                },
                {
                  name: "col2",
                  cellType: "expression",
                  expression: "{row.col1} + 10"
                }
              ],
              rowCount: 1,
            }
          ],
        }
      ],
    });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    const matrix = <QuestionMatrixDynamicModel>panel.panels[0].getQuestionByName("matrix");
    const cell = matrix.visibleRows[0].cells[0].question;
    cell.value = 10;
    expect(matrix.value, "matrix value").toEqual([{ col1: 10, col2: 20 }]);
    expect(panel.value, "panel value").toEqual([{ matrix: [{ col1: 10, col2: 20 }] }]);
    expect(survey.data, "survey.data").toEqual({ panel: [{ matrix: [{ col1: 10, col2: 20 }] }] });
  });

  test("displayMode: tab, issue#5829", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "relatives",
          title: "Panel Dynamic",
          displayMode: "tab",
          templateTitle: "Information about: {panel.relativeType}",
          templateElements: [
            {
              name: "relativeType",
              type: "dropdown",
              title: "Relative",
              choices: [
                "father",
                "mother",
                "brother",
                "sister",
                "son",
                "daughter"
              ],
            },
            {
              name: "isalive",
              type: "radiogroup",
              title: "Alive?",
              startWithNewLine: false,
              colCount: 0,
              choices: ["Yes", "No"]
            },
            {
              name: "liveage",
              type: "dropdown",
              title: "Age",
              startWithNewLine: false,
              visibleIf: "{panel.isalive} = 'Yes'",
              choicesMin: 1,
              choicesMax: 115
            },
            {
              name: "deceasedage",
              type: "dropdown",
              title: "Deceased Age",
              startWithNewLine: false,
              visibleIf: "{panel.isalive} = 'No'",
              choices: [
                {
                  value: -1,
                  text: "Unknown"
                }
              ],
              choicesMin: 1,
              choicesMax: 115
            },
            {
              name: "causeofdeathknown",
              type: "radiogroup",
              title: "Cause of Death Known?",
              colCount: 0,
              startWithNewLine: false,
              visibleIf: "{panel.isalive} = 'No'",
              choices: ["Yes", "No"]
            },
            {
              name: "causeofdeath",
              type: "text",
              title: "Cause of Death",
              startWithNewLine: false,
              visibleIf:
              "{panel.isalive} = 'No' and {panel.causeofdeathknown} = 'Yes'"
            },
            {
              type: "panel",
              name: "moreInfo",
              state: "expanded",
              title: "Detail Information about: {panel.relativeType}",
              elements: [
                {
                  type: "matrixdynamic",
                  name: "relativeillness",
                  title: "Describe the illness or condition.",
                  rowCount: 0,
                  columns: [
                    {
                      name: "illness",
                      cellType: "dropdown",
                      title: "Illness/Condition",
                      choices: [
                        "Cancer",
                        "Heart Disease",
                        "Diabetes",
                        "Stroke/TIA",
                        "High Blood Pressure",
                        "High Cholesterol or Triglycerides",
                        "Liver Disease",
                        "Alcohol or Drug Abuse",
                        "Anxiety, Depression or Psychiatric Illness",
                        "Tuberculosis",
                        "Anesthesia Complications",
                        "Genetic Disorder",
                        "Other - describe"
                      ],
                      isRequired: true
                    },
                    {
                      name: "description",
                      cellType: "text",
                      title: "Describe",
                      isRequired: true
                    }
                  ]
                }
              ]
            }
          ],
          panelCount: 2,
          addPanelText: "Add a blood relative",
          removePanelText: "Remove the relative"
        }
      ],
    });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("relatives");
    const panelTabToolbar = panel.tabbedMenu as AdaptiveActionContainer;
    expect(!!panel["tabbedMenuValue"], "tabbedMenuValue exist").toBeTruthy();
    expect(panel.isRenderModeTab, "isRenderModeTab").toBeTruthy();
    expect(panel.currentIndex, "currentIndex is 0").toBe(0);
    expect(panelTabToolbar.actions.length, "2 panels").toBe(2);
    expect(panelTabToolbar.actions[0].locTitle.textOrHtml, "Panel 1").toBe("Panel 1");
    expect(panelTabToolbar.actions[0].active, "Panel 1 pressed true").toBe(true);
    expect(panelTabToolbar.actions[1].locTitle.textOrHtml, "Panel 2").toBe("Panel 2");
    expect(panelTabToolbar.actions[1].active, "Panel 2 pressed false").toBe(false);

    panel.currentIndex = 1;
    panel.addPanel();
    expect(panel.currentIndex, "currentIndex is 2").toBe(2);
    expect(panelTabToolbar.actions.length, "3 panels").toBe(3);
    expect(panelTabToolbar.actions[0].locTitle.textOrHtml, "Panel 1").toBe("Panel 1");
    expect(panelTabToolbar.actions[0].active, "Panel 1 pressed false").toBe(false);
    expect(panelTabToolbar.actions[1].locTitle.textOrHtml, "Panel 2").toBe("Panel 2");
    expect(panelTabToolbar.actions[1].active, "Panel 2 pressed false").toBe(false);
    expect(panelTabToolbar.actions[2].locTitle.textOrHtml, "Panel 3").toBe("Panel 3");
    expect(panelTabToolbar.actions[2].active, "Panel 3 pressed true").toBe(true);

    panelTabToolbar.actions[1].action();
    expect(panel.currentIndex, "currentIndex is 1").toBe(1);

    panelTabToolbar.actions[2].action();
    expect(panel.currentIndex, "currentIndex is 2").toBe(2);

    panelTabToolbar.actions[0].action();
    expect(panel.currentIndex, "currentIndex is 0").toBe(0);
  });

  test("displayMode: tab, check panelTabToolbar containerCss issue#5829", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "relatives",
          title: "Panel Dynamic",
          displayMode: "tab",
          tabAlign: "left"
        }
      ],
    });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("relatives");
    survey.css = defaultCss;
    panel.cssClasses;
    const panelTabToolbar = panel.tabbedMenu as AdaptiveActionContainer;
    expect(panelTabToolbar.containerCss, "tabAlign value is left").toBe("sd-tabs-toolbar sd-tabs-toolbar--left");

    panel.tabAlign = "right";
    expect(panelTabToolbar.containerCss, "tabAlign value is right").toBe("sd-tabs-toolbar sd-tabs-toolbar--right");

    panel.tabAlign = "center";
    expect(panelTabToolbar.containerCss, "tabAlign default value is center").toBe("sd-tabs-toolbar sd-tabs-toolbar--center");
  });

  test("displayMode: tab check disableHide property", () => {
    const oldUpdate = AdaptiveActionContainer.prototype["update"];
    AdaptiveActionContainer.prototype["update"] = function (options) {
      if (!!options.updateResponsivenessMode) {
        this.updateCallback && this.updateCallback(options.updateResponsivenessMode == UpdateResponsivenessMode.Hard);
      }
    };
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "relatives",
          title: "Panel Dynamic",
          displayMode: "tab",
          templateTitle: "Information about: {panel.relativeType}",
          templateElements: [
            {
              type: "text",
              name: "q1"
            }
          ],
          panelCount: 2,
          addPanelText: "Add a blood relative",
          removePanelText: "Remove the relative"
        }
      ],
    });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("relatives");
    const panelTabToolbar = panel.tabbedMenu as AdaptiveActionContainer;
    expect(panelTabToolbar.actions[0].disableHide).toBe(true);
    expect(panelTabToolbar.actions[1].disableHide).toBe(false);

    panel.addPanel(2);
    expect(panel.currentIndex, "currentIndex is 2").toBe(2);
    expect(panelTabToolbar.actions[0].disableHide).toBe(false);
    expect(panelTabToolbar.actions[1].disableHide).toBe(false);
    expect(panelTabToolbar.actions[2].disableHide).toBe(true);

    let log = "";
    (panelTabToolbar as any).updateCallback = () => {
      log += "->raised";
    };
    panelTabToolbar.actions[1].mode = "popup";
    expect(log).toBe("");
    panel.currentIndex = 1;
    panelTabToolbar.flushUpdates();
    expect(panelTabToolbar.actions[1].disableHide).toBeTruthy();
    expect(log).toBe("->raised");
    panel.currentIndex = 0;
    panelTabToolbar.flushUpdates();
    expect(panelTabToolbar.actions[1].disableHide).toBeFalsy();
    expect(panelTabToolbar.actions[0].disableHide).toBeTruthy();
    expect(log).toBe("->raised");
    panelTabToolbar.actions[2].mode = "popup";
    panel.currentIndex = 2;
    panelTabToolbar.flushUpdates();
    expect(panelTabToolbar.actions[0].disableHide).toBeFalsy();
    expect(panelTabToolbar.actions[1].disableHide).toBeFalsy();
    expect(panelTabToolbar.actions[2].disableHide).toBeTruthy();
    expect(log).toBe("->raised->raised");
    AdaptiveActionContainer.prototype["update"] = oldUpdate;
  });

  test("displayMode: tab check hasTabbedMenu property", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "relatives",
          displayMode: "tab",
          templateElements: [
            {
              type: "text",
              name: "q1"
            }
          ],
        }
      ],
    });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("relatives");
    expect(panel.hasTabbedMenu).toBeFalsy();
    panel.addPanel(1);
    expect(panel.hasTabbedMenu).toBeTruthy();
    panel.addPanel(2);
    expect(panel.hasTabbedMenu).toBeTruthy();
  });

  test("question.cssHeader class", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "relatives",
          title: "Panel Dynamic",
          displayMode: "tab",
          tabAlign: "left"
        }
      ],
    });
    setOldTheme(survey);
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("relatives");
    expect(panel.cssHeader).toBe("sv-paneldynamic__header sv_header");

    panel.addPanel();
    expect(panel.cssHeader).toBe("sv-paneldynamic__header sv_header sv-paneldynamic__header-tab");

    panel.renderMode = undefined;
    expect(panel.cssHeader).toBe("sv-paneldynamic__header sv_header");

    panel.titleLocation = "hidden";
    expect(panel.cssHeader).toBe("sv-paneldynamic__header sv_header");

    panel.displayMode = "tab";
    panel.titleLocation = "top";
    expect(panel.cssHeader).toBe("sv-paneldynamic__header sv_header sv-paneldynamic__header-tab");

    panel.removePanelUI(0);
    expect(panel.cssHeader).toBe("sv-paneldynamic__header sv_header");

  });
  test("displayMode: tab & silent validation, Bug#8752", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "panel1",
          displayMode: "tab",
          templateElements: [
            {
              type: "text",
              name: "q1",
              isRequired: true
            }
          ],
          panelCount: 4,
        }
      ],
    });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel1");
    panel.currentIndex = 3;
    survey.validate(false, false);
    expect(panel.currentIndex, "current index is not changed, #1").toBe(3);
    survey.validate(true, false);
    expect(panel.currentIndex, "current index is not changed, #2").toBe(3);
    survey.validate(false, true);
    expect(panel.currentIndex, "current index is not changed, #3").toBe(0);
  });

  test("question.hasTitleOnLeftTop class", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "relatives",
          title: "Panel Dynamic",
          titleLocation: "hidden",
          tabAlign: "left"
        }
      ],
    });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("relatives");
    expect(panel.hasTitleOnLeftTop, "titleLocation hidden").toBe(false);

    panel.displayMode = "tab";
    expect(panel.hasTitleOnLeftTop, "displayMode is tab").toBe(false);

    panel.addPanel();
    expect(panel.panels.length, "There is one panel").toBe(1);
    expect(panel.panels[0].visible, "There is one visiblePanel").toBe(true);
    expect(panel.visiblePanelCount, "There is one visible panel count").toBe(1);
    expect(panel.hasTitleOnLeftTop, "title location should be independent on tabs visibility - tabs are visible and title location is hidden").toBe(false);

    panel.titleLocation = "top";
    expect(panel.hasTitleOnLeftTop, "title location should be independent on tabs visibility - tabs are visible and title location is top").toBe(true);

    panel.titleLocation = "hidden";
    panel.renderMode = undefined;
    expect(panel.hasTitleOnLeftTop, "title location should be independent on tabs visibility - tabs are invisible and title location is hidden").toBe(false);

    panel.titleLocation = "top";
    expect(panel.hasTitleOnLeftTop, "title location should be independent on tabs visibility - tabs are invisible and title location top").toBe(true);

  });
  test("Pass isMobile to the nested questions", () => {
    const survey = new SurveyModel({
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "matrix",
              "name": "quality1",
              "title": "Please indicate if you agree or disagree with the following statements",
              "alternateRows": true,
              "columns": [
                {
                  "value": 5,
                  "text": "Strongly agree"
                },
                {
                  "value": 4,
                  "text": "Agree"
                },
                {
                  "value": 3,
                  "text": "Neutral"
                },
                {
                  "value": 2,
                  "text": "Disagree"
                },
                {
                  "value": 1,
                  "text": "Strongly disagree"
                }
              ],
              "rows": [
                {
                  "value": "affordable",
                  "text": "Product is affordable"
                },
                {
                  "value": "does what it claims",
                  "text": "Product does what it claims"
                },
                {
                  "value": "better than others",
                  "text": "Product is better than other products on the market"
                },
                {
                  "value": "easy to use",
                  "text": "Product is easy to use"
                }
              ],
              "eachRowRequired": true
            },
            {
              "type": "paneldynamic",
              "name": "question1",
              "panelCount": 1,
              "templateElements": [
                {
                  "type": "matrix",
                  "name": "quality",
                  "title": "Please indicate if you agree or disagree with the following statements",
                  "alternateRows": true,
                  "columns": [
                    {
                      "value": 5,
                      "text": "Strongly agree"
                    },
                    {
                      "value": 4,
                      "text": "Agree"
                    },
                    {
                      "value": 3,
                      "text": "Neutral"
                    },
                    {
                      "value": 2,
                      "text": "Disagree"
                    },
                    {
                      "value": 1,
                      "text": "Strongly disagree"
                    }
                  ],
                  "rows": [
                    {
                      "value": "affordable",
                      "text": "Product is affordable"
                    },
                    {
                      "value": "does what it claims",
                      "text": "Product does what it claims"
                    },
                    {
                      "value": "better than others",
                      "text": "Product is better than other products on the market"
                    },
                    {
                      "value": "easy to use",
                      "text": "Product is easy to use"
                    }
                  ],
                  "eachRowRequired": true
                }
              ]
            }
          ]
        }
      ],
    });
    const matrix = <QuestionMatrixModel>survey.getQuestionByName("quality1");
    const dynPanel = <QuestionPanelDynamicModel>survey.getQuestionByName("question1");

    survey.setIsMobile();
    expect(matrix.isMobile, "Matrix is mobile").toBe(true);
    expect(dynPanel.isMobile, "dynPanel is mobile").toBe(true);

    const innerMatrix = dynPanel.panels[0].elements[0] as QuestionMatrixModel;
    expect(innerMatrix.isMobile, "innerMatrix is mobile").toBe(true);
  });
  test("displayMode: tab, tabbedMenu&titles", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "paneldynamic",
          name: "panel",
          templateElements: [
            { type: "text", name: "q1" },
            { type: "text", name: "q2" }
          ],
          panelCount: 2,
          displayMode: "tab"
        }],
    });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    const panelTabToolbar = panel.tabbedMenu as AdaptiveActionContainer;
    expect(panelTabToolbar.actions[0].locTitle.owner, "Owner is set").toBeTruthy();
    expect(panelTabToolbar.actions[0].locTitle.textOrHtml).toBe("Panel 1");
    expect(panelTabToolbar.actions[1].locTitle.textOrHtml).toBe("Panel 2");
    panel.templateTabTitle = "#{panelIndex} {panel.q1}";
    expect(panelTabToolbar.actions[0].locTitle.textOrHtml).toBe("#1 ");
    expect(panelTabToolbar.actions[1].locTitle.textOrHtml).toBe("#2 ");
    panel.panels[0].getQuestionByName("q1").value = "q1-value";
    expect(panelTabToolbar.actions[0].locTitle.textOrHtml).toBe("#1 q1-value");
    expect(panelTabToolbar.actions[1].locTitle.textOrHtml).toBe("#2 ");
  });
  test("displayMode: tab, tabbedMenu&templateTabTitle in JSON", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "paneldynamic",
          name: "panel",
          templateElements: [
            { type: "text", name: "q1" },
            { type: "text", name: "q2" }
          ],
          panelCount: 2,
          displayMode: "tab",
          templateTabTitle: "#{panelIndex} {panel.q1}"
        }],
    });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    const panelTabToolbar = panel.tabbedMenu as AdaptiveActionContainer;
    expect(panelTabToolbar.actions[0].locTitle.textOrHtml).toBe("#1 ");
    expect(panelTabToolbar.actions[1].locTitle.textOrHtml).toBe("#2 ");
    let counter = 0;
    panelTabToolbar.actions[0].locTitle.onStringChanged.add((sender, options) => {
      counter++;
    });
    panel.panels[0].getQuestionByName("q1").value = "q1-value";
    expect(counter, "str has been changed").toBe(1);
    expect(panelTabToolbar.actions[0].locTitle.textOrHtml).toBe("#1 q1-value");
    expect(panelTabToolbar.actions[1].locTitle.textOrHtml).toBe("#2 ");
    panel.addPanel();
    expect(panel.panels.indexOf(<PanelModel>panelTabToolbar.actions[2].locTitle.owner), "Set correct panel as owner").toBe(2);
    panel.panels[2].getQuestionByName("q1").value = "q3-value";
    expect(panelTabToolbar.actions[0].locTitle.textOrHtml).toBe("#1 q1-value");
    expect(panelTabToolbar.actions[1].locTitle.textOrHtml).toBe("#2 ");
    expect(panelTabToolbar.actions[2].locTitle.textOrHtml).toBe("#3 q3-value");
    panel.removePanel(1);
    expect(panel.panels.indexOf(<PanelModel>panelTabToolbar.actions[1].locTitle.owner), "Keep correct panel as owner").toBe(1);
    expect(panelTabToolbar.actions[0].locTitle.textOrHtml).toBe("#1 q1-value");
    expect(panelTabToolbar.actions[1].locTitle.textOrHtml).toBe("#2 q3-value");
    panel.panels[1].getQuestionByName("q1").value = "q3-value!";
    expect(panelTabToolbar.actions[0].locTitle.textOrHtml).toBe("#1 q1-value");
    expect(panelTabToolbar.actions[1].locTitle.textOrHtml).toBe("#2 q3-value!");
  });
  test("displayMode: tab, tabbedMenu&titles&survey.onGetPanelDynamicTabTitle", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "paneldynamic",
          name: "panel",
          templateElements: [
            { type: "text", name: "q1" },
            { type: "text", name: "q2" }
          ],
          panelCount: 2,
          displayMode: "tab"
        }],
    });
    survey.onGetDynamicPanelTabTitle.add((sender, options) => {
      if (options.visiblePanelIndex === 0) {
        const val = options.panel.getQuestionByName("q1").value;
        options.title = "First tab" + (!!val ? " " + val.toString() : "");
      }
    });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    const panelTabToolbar = panel.tabbedMenu as AdaptiveActionContainer;
    expect(panelTabToolbar.actions[0].locTitle.owner, "Owner is set").toBeTruthy();
    expect(panelTabToolbar.actions[0].locTitle.textOrHtml).toBe("First tab");
    expect(panelTabToolbar.actions[1].locTitle.textOrHtml).toBe("Panel 2");
    panel.templateTabTitle = "#{panelIndex} {panel.q1}";
    expect(panelTabToolbar.actions[0].locTitle.textOrHtml).toBe("First tab");
    expect(panelTabToolbar.actions[1].locTitle.textOrHtml).toBe("#2 ");
    panel.panels[0].getQuestionByName("q1").value = "q1-value";
    expect(panelTabToolbar.actions[0].locTitle.textOrHtml).toBe("First tab q1-value");
    expect(panelTabToolbar.actions[1].locTitle.textOrHtml).toBe("#2 ");
  });
  test("templateVisibleIf", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "paneldynamic",
          name: "panel",
          templateElements: [
            { type: "text", name: "q1" },
            { type: "text", name: "q2" }
          ],
          panelCount: 3,
          templateVisibleIf: "{panel.q1}='a'"
        }],
    });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    expect(panel.panels.length, "There are two panels").toBe(3);
    expect(panel.visiblePanels.length, "There are 0 visible panels").toBe(0);
    expect(panel.panels[0].visibleIf, "visibleIf for panel0").toBe("{panel.q1}='a'");
    expect(panel.panels[1].visibleIf, "visibleIf for panel1").toBe("{panel.q1}='a'");
    expect(panel.panels[2].visibleIf, "visibleIf for panel2").toBe("{panel.q1}='a'");
    expect(panel.panels[0].isVisible, "panel0 invisible #1").toBe(false);
    expect(panel.panels[1].isVisible, "panel1 invisible #1").toBe(false);
    expect(panel.panels[2].isVisible, "panel2 invisible #1").toBe(false);
    panel.value = [{ q1: "b" }, { q1: "a" }, { q1: "c" }];
    expect(panel.panels[0].isVisible, "panel0 invisible #2").toBe(false);
    expect(panel.panels[1].isVisible, "panel1 invisible #2").toBe(true);
    expect(panel.panels[2].isVisible, "panel2 invisible #2").toBe(false);
    expect(panel.visiblePanels.length, "There is 1 visible panels").toBe(1);
  });
  test("templateVisibleIf && currentPanelIndex", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "paneldynamic",
          name: "panel",
          templateElements: [
            { type: "text", name: "q1" },
            { type: "text", name: "q2" }
          ],
          panelCount: 3,
          displayMode: "tab",
          templateVisibleIf: "{panel.q1}='a'"
        }],
    });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    expect(panel.panels.length, "There are two panels").toBe(3);
    expect(panel.visiblePanelCount, "There are 0 visible panels").toBe(0);
    expect(panel.currentIndex, "currentIndex #1").toBe(-1);
    panel.value = [{ q1: "a" }, { q1: "a" }, { q1: "a" }];
    expect(panel.visiblePanelCount, "There are three panels").toBe(3);
    expect(panel.currentIndex, "currentIndex #2").toBe(0);
    panel.currentIndex = -1;
    expect(panel.currentIndex, "currentIndex #3").toBe(0);
    panel.currentIndex = 100;
    expect(panel.currentIndex, "currentIndex #4").toBe(2);
    panel.value = [{ q1: "b" }, { q1: "a" }, { q1: "a" }];
    expect(panel.currentIndex, "currentIndex #5").toBe(1);
    panel.value = [{ q1: "b" }, { q1: "a" }, { q1: "c" }];
    expect(panel.currentIndex, "currentIndex #6").toBe(0);
    panel.value = [{ q1: "b" }, { q1: "d" }, { q1: "c" }];
    expect(panel.currentIndex, "currentIndex #7").toBe(-1);
    panel.value = [{ q1: "b" }, { q1: "d" }, { q1: "a" }];
    expect(panel.visiblePanelCount, "There is one panel").toBe(1);
    expect(panel.currentIndex, "currentIndex #8").toBe(0);
  });
  test("survey.onDynamicPanelCurrentIndexChanged", () => {
    const survey = new SurveyModel();
    let questionName = "";
    let panelIndex = -2;
    let panelIndexOf = -2;
    survey.onDynamicPanelCurrentIndexChanged.add((_, options) => {
      questionName = options.question.name;
      panelIndex = options.visiblePanelIndex;
      panelIndexOf = !!options.panel ? options.question.visiblePanels.indexOf(options.panel) : -1;
    });
    survey.fromJSON({
      elements: [
        { type: "paneldynamic",
          name: "panel",
          templateElements: [
            { type: "text", name: "q1" },
            { type: "text", name: "q2" }
          ],
          panelCount: 3,
          displayMode: "tab"
        }],
    });
    expect(questionName, "question is correct").toBe("panel");
    expect(panelIndex, "panelIndex #1").toBe(0);
    expect(panelIndexOf, "panelIndexOf #1").toBe(0);
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    panel.currentIndex = 1;
    expect(panelIndex, "panelIndex #2").toBe(1);
    expect(panelIndexOf, "panelIndexOf #2").toBe(1);
    panel.addPanel(-1);
    expect(panel.currentIndex, "panel.panelIndex #3").toBe(3);
    expect(panelIndex, "panelIndex #3").toBe(3);
    expect(panelIndexOf, "panelIndexOf #3").toBe(3);
    panel.removePanel(3);
    expect(panel.currentIndex, "panel.panelIndex #4").toBe(2);
    expect(panelIndex, "panelIndex #4").toBe(2);
    expect(panelIndexOf, "panelIndexOf #4").toBe(2);
  });
  test("templateVisibleIf & displayMode: tab, tabbedMenu&templateTabTitle in JSON", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "paneldynamic",
          name: "panel",
          templateElements: [
            { type: "text", name: "q1" },
            { type: "text", name: "q2" }
          ],
          panelCount: 3,
          templateVisibleIf: "{panel.q1}='a'",
          displayMode: "tab",
          templateTabTitle: "#{visiblePanelIndex}-{panelIndex} {panel.q1}"
        }],
    });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    const panelTabToolbar = panel.tabbedMenu as AdaptiveActionContainer;
    expect(panelTabToolbar.actions.length, "All tabs are invisible").toBe(0);
    panel.value = [{ q1: "b" }, { q1: "c" }, { q1: "a" }];
    expect(panelTabToolbar.actions.length, "One tab is visible").toBe(1);
    expect(panelTabToolbar.actions[0].locTitle.textOrHtml).toBe("#1-3 a");

    panel.value = [{ q1: "b" }, { q1: "a" }, { q1: "a" }];
    expect(panelTabToolbar.actions.length, "Two tabs are visible").toBe(2);
    expect(panelTabToolbar.actions[0].locTitle.textOrHtml).toBe("#1-2 a");
    expect(panelTabToolbar.actions[1].locTitle.textOrHtml).toBe("#2-3 a");

    panel.value = [{ q1: "a" }, { q1: "a" }, { q1: "a" }];
    expect(panelTabToolbar.actions.length, "Three tabs are visible").toBe(3);
    expect(panelTabToolbar.actions[0].locTitle.textOrHtml).toBe("#1-1 a");
    expect(panelTabToolbar.actions[1].locTitle.textOrHtml).toBe("#2-2 a");
    expect(panelTabToolbar.actions[2].locTitle.textOrHtml).toBe("#3-3 a");
  });
  test("Using visiblePanelIndex in the expression in panel dynamic,Bug#9874", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "paneldynamic",
          name: "panel",
          templateElements: [
            { type: "expression", name: "q1", expression: "{visiblePanelIndex}" },
            { type: "text", name: "q2" }
          ],
          panelCount: 3
        }],
    });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    expect(panel.panels[0].getQuestionByName("q1").value, "visiblePanelIndex is 0").toBe(0);
    expect(panel.panels[1].getQuestionByName("q1").value, "visiblePanelIndex is 1").toBe(1);
    expect(panel.panels[2].getQuestionByName("q1").value, "visiblePanelIndex is 2").toBe(2);
  });
  test("templateVisibleIf & displayMode: tab, templateTabTitle&tabTitlePlaceholder in JSON", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "paneldynamic",
          name: "panel",
          templateElements: [
            { type: "text", name: "q1" },
            { type: "text", name: "q2" }
          ],
          panelCount: 2,
          displayMode: "tab",
          tabTitlePlaceholder: "Empty value",
          templateTabTitle: "{panel.q1}"
        }],
    });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    const panelTabToolbar = panel.tabbedMenu as AdaptiveActionContainer;
    expect(panelTabToolbar.actions.length, "There are two panels").toBe(2);
    expect(panelTabToolbar.actions[0].locTitle.textOrHtml, "#1").toBe("Empty value");
    expect(panelTabToolbar.actions[1].locTitle.textOrHtml, "#2").toBe("Empty value");
    panel.panels[1].getQuestionByName("q1").value = "item2";
    expect(panelTabToolbar.actions[0].locTitle.textOrHtml, "#3").toBe("Empty value");
    expect(panelTabToolbar.actions[1].locTitle.textOrHtml, "#4").toBe("item2");
    panel.panels[0].getQuestionByName("q1").value = "item1";
    expect(panelTabToolbar.actions[0].locTitle.textOrHtml, "#5").toBe("item1");
    expect(panelTabToolbar.actions[1].locTitle.textOrHtml, "#6").toBe("item2");
    panel.panels[1].getQuestionByName("q1").clearValue();
    expect(panelTabToolbar.actions[0].locTitle.textOrHtml, "#7").toBe("item1");
    expect(panelTabToolbar.actions[1].locTitle.textOrHtml, "#8").toBe("Empty value");
    panel.locTabTitlePlaceholder.clear();
    expect(panelTabToolbar.actions[0].locTitle.textOrHtml, "#9").toBe("item1");
    expect(panelTabToolbar.actions[1].locTitle.textOrHtml, "#10").toBe("New Panel");
  });
  test("templateVisibleIf & tabbedMenu", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "paneldynamic",
          name: "panel",
          templateElements: [
            { type: "text", name: "q1" },
            { type: "text", name: "q2" }
          ],
          panelCount: 3,
          templateVisibleIf: "{panel.q1}='a'",
          displayMode: "carousel"
        }],
    });
    var oldCss = survey.css;
    survey.css = { root: "sd-root-modern" };
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    const getAddBtn = () => {
      return panel.footerToolbar.getActionById("sv-pd-add-btn");
    };
    const getNextBtn = () => {
      return panel.footerToolbar.getActionById("sv-pd-next-btn");
    };
    panel.value = [{ q1: "b" }, { q1: "c" }, { q1: "a" }];
    expect(getAddBtn().visible, "add button is visible #1").toBe(true);
    expect(panel.canAddPanel, "canAddPanel #1").toBe(true);
    expect(getNextBtn().visible, "nextButton #1").toBe(false);

    panel.value = [{ q1: "b" }, { q1: "a" }, { q1: "a" }];
    expect(getAddBtn().visible, "add button is visible #2").toBe(true);
    expect(panel.canAddPanel, "canAddPanel #2").toBe(true);
    expect(getNextBtn().visible, "nextButton #2").toBe(false);
    panel.currentIndex = 0;
    expect(getAddBtn().visible, "add button is invisible #3").toBe(false);
    expect(panel.canAddPanel, "canAddPanel #3").toBe(false);
    expect(getNextBtn().visible, "nextButton #3").toBe(true);
    panel.currentIndex = 1;
    expect(getAddBtn().visible, "add button is visible #4").toBe(true);
    expect(panel.canAddPanel, "canAddPanel #4").toBe(true);
    expect(getNextBtn().visible, "nextButton #4").toBe(false);

    panel.value = [{ q1: "a" }, { q1: "a" }, { q1: "a" }];
    expect(getAddBtn().visible, "add button is visible #5").toBe(true);
    expect(panel.canAddPanel, "canAddPanel #5").toBe(true);
    expect(getNextBtn().visible, "nextButton #5").toBe(false);
    panel.currentIndex = 1;
    expect(getAddBtn().visible, "add button is invisible #6").toBe(false);
    expect(panel.canAddPanel, "canAddPanel #6").toBe(false);
    expect(getNextBtn().visible, "nextButton #6").toBe(true);
    survey.css = oldCss;
  });
  test("templateVisibleIf & tabs action click, bug#8430", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "paneldynamic",
          name: "panel",
          templateElements: [
            { type: "text", name: "q1" }
          ],
          panelCount: 4,
          templateVisibleIf: "{panel.q1}!='a'",
          displayMode: "tab"
        }],
    });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    const tabbedMenu = panel.tabbedMenu as AdaptiveActionContainer;
    tabbedMenu.flushUpdates();
    expect(tabbedMenu.visibleActions.length, "There are 4 visible tabs").toBe(4);
    panel.panels[1].getQuestionByName("q1").value = "a";
    expect(panel.currentIndex, "Current Index 0").toBe(0);
    const panelId = panel.panels[2].id;
    tabbedMenu.flushUpdates();
    expect(tabbedMenu.visibleActions.length, "There are 3 visible tabs").toBe(3);
    tabbedMenu.visibleActions[1].action();
    expect(panel.currentIndex, "Current Index 1").toBe(1);
    expect(panel.currentPanel.id, "Select the correct panel").toBe(panelId);
  });
  test("question.enableIf & add panel button visibility, Bug#6292", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "paneldynamic",
          name: "panel",
          templateElements: [
            { type: "text", name: "q1" }
          ],
          enableIf: "{var1}='a'"
        }],
    });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    expect(panel.isReadOnly, "Panel is readonly, #1").toBe(true);
    expect(panel.canAddPanel, "Panel is readonly, #2").toBe(false);
    const addBtn = panel.footerToolbar.getActionById("sv-pd-add-btn");
    expect(addBtn.isVisible, "Add button is invisible, #3").toBe(false);
    survey.setValue("var1", "a");
    expect(panel.isReadOnly, "Panel is editable, #4").toBe(false);
    expect(panel.canAddPanel, "Panel is not readonly, #5").toBe(true);
    expect(addBtn.isVisible, "Add button is visible, #6").toBe(true);
  });
  test("newPanelPosition & add panel button visibility", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "paneldynamic",
          name: "panel",
          displayMode: "tab",
          newPanelPosition: "next",
          templateElements: [
            { type: "text", name: "q1" }
          ]
        }],
    });
    survey.css.root = "sd-root-modern";
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    panel.value = [{ q1: 1 }, { q1: 2 }, { q1: 3 }];
    panel.currentIndex = 0;
    expect(panel.newPanelPosition, "newPanelPosition #1").toBe("next");
    const addBtn = panel.footerToolbar.getActionById("sv-pd-add-btn");
    expect(panel.canAddPanel, "canAddPanel, #1").toBe(true);
    expect(addBtn.isVisible, "addBtn, #1").toBe(true);
    panel.newPanelPosition = "last";
    expect(panel.visiblePanelCount, "3 panels are visible").toBe(3);
    expect(panel.currentIndex, "the first panel is showing").toBe(0);
    expect(panel.newPanelPosition, "newPanelPosition #2").toBe("last");
    expect(panel.canAddPanel, "canAddPanel, #2").toBe(false);
    expect(addBtn.isVisible, "addBtn, #2").toBe(false);
    panel.currentIndex = 2;
    expect(panel.canAddPanel, "canAddPanel, #3").toBe(true);
    expect(addBtn.isVisible, "addBtn, #3").toBe(true);
    panel.currentIndex = 1;
    expect(panel.canAddPanel, "canAddPanel, #4").toBe(false);
    expect(addBtn.isVisible, "addBtn, #4").toBe(false);
    panel.newPanelPosition = "next";
    expect(panel.newPanelPosition, "newPanelPosition #3").toBe("next");
    expect(panel.canAddPanel, "canAddPanel, #5").toBe(true);
    expect(addBtn.isVisible, "addBtn, #5").toBe(true);
    panel.addPanelUI();
    expect(panel.currentIndex, "currentIndex is next").toBe(2);
    expect(panel.panelCount, "4 panels").toBe(4);
    expect(panel.canAddPanel, "canAddPanel, #6").toBe(true);
    expect(addBtn.isVisible, "addBtn, #5").toBe(true);
    survey.css.root = undefined;
  });
  test("defaultValue in questions and set data", () => {
    const survey = new SurveyModel({
      "elements": [{
        "name": "panel",
        "type": "paneldynamic",
        "templateElements": [
          {
            "name": "q1",
            "type": "text",
          },
          {
            "name": "q2",
            "type": "text",
            "defaultValue": 2
          }
        ]
      }
      ] });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    survey.data = { panel: [{ q1: "foo" }] };
    const q1 = panel.panels[0].getQuestionByName("q1");
    const q2 = panel.panels[0].getQuestionByName("q2");
    expect(q1.value, "q1 is correct").toBe("foo");
    expect(q2.value, "q2 is empty").toBeFalsy();
  });
  test("Make sure that panel is not collapsed on focusing the question", () => {
    const survey = new SurveyModel({
      "pages": [
        {
          "elements": [
            {
              "name": "q1",
              "type": "text",
            }
          ]
        },
        {
          "elements": [{
            "name": "panel",
            "type": "paneldynamic",
            "panelCount": 2,
            "templateElements": [
              {
                "name": "q2",
                "type": "text",
              }
            ]
          }] }] });
    expect(survey.currentPageNo).toBe(0);
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    const q2 = panel.panels[0].getQuestionByName("q2");
    q2.focus();
    expect(survey.currentPageNo).toBe(1);
  });
  test("templateErrorLocation property", () => {
    const survey = new SurveyModel({
      "elements": [{
        "name": "panel",
        "type": "paneldynamic",
        "panelCount": 2,
        "templateElements": [
          {
            "name": "q1",
            "type": "text",
          }
        ]
      }]
    });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    const q1 = panel.panels[0].getQuestionByName("q1");
    expect(q1.getErrorLocation(), "take from survey").toBe("top");
    panel.errorLocation = "bottom";
    expect(q1.getErrorLocation(), "take from question.errorLocation").toBe("bottom");
    panel.templateErrorLocation = "top";
    expect(q1.getErrorLocation(), "take from question.templateErrorLocation").toBe("top");
  });
  test("paneldynamic.removePanelUI & confirmActionAsync, #6736", () => {
    const prevAsync = settings.confirmActionAsync;
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "panel1",
          templateElements: [
            {
              type: "text",
              name: "q1",
            },
          ]
        },
      ],
    });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel1");
    panel.confirmDelete = true;
    panel.value = [{ q1: 1 }, { q1: 2 }, { q1: 3 }];
    expect(panel.panelCount, "There are 3 panels by default").toBe(3);
    let f_resFunc = (res: boolean): void => {};
    settings.confirmActionAsync = (message: string, resFunc: (res: boolean) => void): boolean => {
      f_resFunc = resFunc;
      return true;
    };
    panel.removePanelUI(1);
    expect(panel.panelCount, "We are waiting for async function").toBe(3);
    f_resFunc(false);
    expect(panel.panelCount, "confirm action return false").toBe(3);
    panel.removePanelUI(1);
    expect(panel.panelCount, "We are waiting for async function, #2").toBe(3);
    f_resFunc(true);
    expect(panel.panelCount, "confirm action return true").toBe(2);
    expect(panel.value, "Row is deleted correctly").toEqual([{ q1: 1 }, { q1: 3 }]);

    settings.confirmActionAsync = prevAsync;
  });
  test("paneldynamic confirmDelete and panelDefaultValue, isRequireConfirmOnDelete", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "panel1",
          panelCount: 2,
          defaultPanelValue: { q1: 1, q2: 2 },
          templateElements: [
            { type: "text", name: "q1" },
            { type: "text", name: "q2" }
          ]
        }
      ]
    });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel1");
    expect(panel.value, "Initial value is correct").toEqual([{ q1: 1, q2: 2 }, { q1: 1, q2: 2 }]);
    expect(panel.isRequireConfirmOnDelete(0), "#1").toBe(false);
    panel.confirmDelete = true;
    panel.panels[0].getQuestionByName("q1").value = 3;
    expect(panel.isRequireConfirmOnDelete(0), "#2").toBe(true);
    expect(panel.isRequireConfirmOnDelete(1), "#3").toBe(false);
    expect(panel.isRequireConfirmOnDelete(-1), "#4").toBe(false);
    expect(panel.isRequireConfirmOnDelete(2), "#5").toBe(false);

    panel.panels[0].getQuestionByName("q1").clearValue();
    panel.panels[0].getQuestionByName("q2").clearValue();
    expect(panel.isRequireConfirmOnDelete(0), "#6").toBe(false);
  });
  test("panel property in custom function", () => {
    const panelCustomFunc = function (params: any) {
      if (!this.panel) return "";
      const q = this.panel.getQuestionByName(params[0]);
      if (q && !q.isEmpty()) return q.value + q.value;
      return "";
    };
    FunctionFactory.Instance.register("panelCustomFunc", panelCustomFunc);
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "panel1",
          templateElements: [
            { name: "q1", type: "text" },
            {
              name: "q2",
              type: "expression",
              expression: "panelCustomFunc('q1')",
            },
          ],
          panelCount: 2,
        },
      ],
    });
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("panel1");
    const panel = question.panels[0];
    panel.getQuestionByName("q1").value = "abc";
    expect(panel.getQuestionByName("q2").value, "Custom function with row property works correctly").toBe("abcabc");
    FunctionFactory.Instance.unregister("panelCustomFunc");
  });
  test("nested panel.panelCount&expression question", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "paneldynamic",
          "name": "panel1",
          "templateElements": [
            {
              "type": "text",
              "name": "q1"
            },
            {
              "type": "paneldynamic",
              "name": "panel2",
              "templateElements": [
                {
                  "type": "expression",
                  "name": "q2",
                  "expression": "{panelIndex}"
                }
              ],
              "panelCount": 3
            }
          ],
          "panelCount": 1
        }
      ]
    });
    const rootPanel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel1");
    expect(rootPanel.panels.length).toBe(1);
    const panel1 = rootPanel.panels[0].getQuestionByName("panel2");
    expect(panel1.panels.length, "It should be 3 panels").toBe(3);
  });
  test("defaultExpression vs panelIndex & adding/removing rows, bug#10521", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "paneldynamic",
          "name": "panel1",
          "templateElements": [
            { "type": "text", "name": "q1" },
            { "type": "text", "name": "q2", defaultValueExpression: "{panelIndex}" },
            { "type": "expression", "name": "q3", expression: "{panelIndex}" },
          ],
          "panelCount": 2
        }
      ]
    });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel1");
    panel.panels[0].getQuestionByName("q1").value = "a";
    panel.panels[1].getQuestionByName("q1").value = "b";
    panel.addPanel();
    panel.panels[2].getQuestionByName("q1").value = "c";
    expect(panel.panels.length, "There are three panels").toBe(3);
    expect(panel.panels[0].getQuestionByName("q2").value, "q2.value #1").toBe(0);
    expect(panel.panels[1].getQuestionByName("q2").value, "q2.value #2").toBe(1);
    expect(panel.panels[2].getQuestionByName("q2").value, "q2.value #3").toBe(2);
    panel.panels[2].getQuestionByName("q2").inputValue = "2";
    panel.removePanel(0);
    expect(panel.panels.length, "There are two panels").toBe(2);
    expect(panel.panels[0].getQuestionByName("q2").value, "q2.value #4").toBe(0);
    expect(panel.panels[1].getQuestionByName("q2").value, "q2.value #5").toBe(1);
    panel.removePanel(0);
    expect(panel.panels.length, "There is one panel").toBe(1);
    expect(panel.panels[0].getQuestionByName("q1").value, "q1.value #6").toBe("c");
    expect(panel.panels[0].getQuestionByName("q2").value, "q2.value #6").toBe(0);
  });
  test("templateElements question.onHidingContent", () => {
    const survey = new SurveyModel({
      "elements": [{
        "name": "panel",
        "type": "paneldynamic",
        "panelCount": 2,
        "templateElements": [
          {
            "name": "q1",
            "type": "text",
          }
        ]
      }]
    });
    let counter = 0;
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    panel.panels[0].getQuestionByName("q1").onHidingContent = (): void => { counter ++; };
    panel.panels[1].getQuestionByName("q1").onHidingContent = (): void => { counter ++; };
    survey.doComplete();
    expect(counter, "on do complete").toBe(2);
  });
  test("templateElements question.onHidingContent", () => {
    const survey = new SurveyModel({
      "elements": [{
        "name": "panel",
        "type": "paneldynamic",
        "panelCount": 2,
        "displayMode": "tab",
        "templateElements": [
          {
            "name": "q1",
            "type": "text",
          }
        ]
      }]
    });
    let counter = 0;
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    panel.panels[0].getQuestionByName("q1").onHidingContent = (): void => { counter ++; };
    panel.currentIndex = 1;
    expect(counter, "Go to another tab").toBe(1);
  });
  test("nested panel.panelCount&expression question", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "paneldynamic",
          "name": "panel1",
          "valueName": "shared",
          "templateElements": [
            {
              "type": "text",
              "name": "A"
            }
          ],
          "panelCount": 1
        },
        {
          "type": "paneldynamic",
          "name": "panel2",
          "valueName": "shared",
          "templateElements": [
            {
              "type": "text",
              "name": "B"
            },
            {
              "type": "text",
              "name": "C",
              "defaultValueExpression": "{panel.A}",
              "readOnly": true
            },
            {
              "type": "text",
              "name": "D",
              "defaultValueExpression": "{panel.B}+{panel.C}",
              "readOnly": true
            },
            {
              "type": "expression",
              "name": "E",
              "expression": "{panel.B}+{panel.C}"
            }
          ]
        }
      ]
    });
    const panel1 = <QuestionPanelDynamicModel>survey.getQuestionByName("panel1");
    panel1.panels[0].getQuestionByName("A").value = 1;
    const panel2 = <QuestionPanelDynamicModel>survey.getQuestionByName("panel2");
    const panel = panel2.panels[0];
    panel.getQuestionByName("B").value = 2;
    expect(panel.getQuestionByName("C").value, "C").toBe(1);
    expect(panel.getQuestionByName("D").value, "D").toBe(3);
    expect(panel.getQuestionByName("E").value, "E").toBe(3);
  });
  test("Footer css for nested panels", () => {
    const footerCss = "abcd";
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "q",
          panelCount: 1,
          templateElements: [
            { type: "text", name: "q1" },
            {
              type: "paneldynamic",
              name: "qq",
              panelCount: 1,
              templateElements: [{ type: "text", name: "q2" }],
            },
          ],
        },
      ],
    });
    setOldTheme(survey);
    survey.css = {
      panel: {
        footer: footerCss
      }
    };
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("q");
    expect(question.panels[0].getFooterToolbar().containerCss, "root footer container css").toBe(footerCss);
    const nested = <QuestionPanelDynamicModel>question.panels[0].getQuestionByName("qq");
    expect(nested.panels[0].getFooterToolbar().containerCss, "nested footer container css on loading").toBe(footerCss);
    nested.addPanel();
    expect(nested.panels[1].getFooterToolbar().containerCss, "nested footer container css on creating").toBe(footerCss);
  });
  test("question.resetValueIf, basic functionality", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "panel",
          panelCount: 1,
          templateElements: [
            { name: "q1", type: "text" },
            { name: "q2", type: "text", resetValueIf: "{panel.q1} = 1" },
            { name: "q3", type: "text" }
          ]
        }
      ]
    });
    const panel = survey.getQuestionByName("panel");
    const q1 = panel.panels[0].getQuestionByName("q1");
    const q2 = panel.panels[0].getQuestionByName("q2");
    const q3 = panel.panels[0].getQuestionByName("q3");
    expect(q2.resetValueIf, "Load from JSON").toBe("{panel.q1} = 1");
    q2.value = "abc";
    q1.value = 2;
    expect(q2.value, "value is set").toBe("abc");
    q1.value = 1;
    expect(q2.isEmpty(), "value is cleared").toBe(true);
    q2.value = "edf";
    expect(q2.value, "value is set, #2").toBe("edf");
    q3.value = 3;
    expect(q2.value, "value is stay, #3").toBe("edf");
  });
  test("question.resetValueIf & quesiton.defaultValueExpression", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "panel",
          panelCount: 1,
          templateElements: [{
            name: "q1",
            type: "text"
          },
          {
            name: "q2",
            type: "text",
            resetValueIf: "{panel.q1} = 1",
            defaultValueExpression: "iif({panel.q3} > 2, {panel.q3}, '')"
          },
          {
            name: "q3", type: "text"
          }]
        }
      ]
    });
    const panel = survey.getQuestionByName("panel");
    const q1 = panel.panels[0].getQuestionByName("q1");
    const q2 = panel.panels[0].getQuestionByName("q2");
    const q3 = panel.panels[0].getQuestionByName("q3");
    q2.value = "abc";
    q3.value = 3;
    expect(q2.value, "value is set directly").toBe("abc");
    q1.value = 1;
    expect(q2.value, "value is set from defaultValueExpression").toBe(3);
    q2.value = "edf";
    expect(q2.value, "value is set directly, #2").toBe("edf");
    q3.value = 4;
    expect(q2.value, "value is stay, #3").toBe("edf");
  });
  test("question.resetValueIf based on root and row questions", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "panel",
          panelCount: 1,
          templateElements: [
            { name: "q1", type: "text" },
            { name: "q2", type: "text", resetValueIf: "{panel.q1} = 1 and {q4} = 4" },
            { name: "q3", type: "text" }
          ]
        },
        { type: "text", name: "q4" }
      ]
    });
    const panel = survey.getQuestionByName("panel");
    const q1 = panel.panels[0].getQuestionByName("q1");
    const q2 = panel.panels[0].getQuestionByName("q2");
    const q3 = panel.panels[0].getQuestionByName("q3");
    const q4 = survey.getQuestionByName("q4");
    q2.value = "abc";
    q1.value = 2;
    expect(q2.value, "q2.value #1").toBe("abc");
    q1.value = 1;
    expect(q2.value, "q2.value #2").toBe("abc");
    q4.value = 4;
    expect(q2.isEmpty(), "q2.value #3").toBe(true);
    q2.value = "edf";
    q1.value = 2;
    expect(q2.value, "q2.value, #4").toBe("edf");
    q1.value = 1;
    expect(q2.isEmpty(), "q2.value #5").toBe(true);
  });
  test("question.setValueIf, basic functionality", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "panel",
          panelCount: 1,
          templateElements: [
            { name: "q1", type: "text" },
            { name: "q2", type: "text", setValueIf: "{panel.q1} = 1", setValueExpression: "{panel.q1} + {panel.q3}" },
            { name: "q3", type: "text" }
          ]
        }
      ]
    });
    const panel = survey.getQuestionByName("panel");
    const q1 = panel.panels[0].getQuestionByName("q1");
    const q2 = panel.panels[0].getQuestionByName("q2");
    const q3 = panel.panels[0].getQuestionByName("q3");
    expect(q2.setValueIf, "Load from JSON setValueIf").toBe("{panel.q1} = 1");
    expect(q2.setValueExpression, "Load from JSON setValueExpression").toBe("{panel.q1} + {panel.q3}");
    q2.value = "abc";
    q1.value = 2;
    q3.value = 3;
    expect(q2.value, "value is set").toBe("abc");
    q1.value = 1;
    expect(q2.value, "value is set correctly").toBe(4);
    q2.value = "edf";
    expect(q2.value, "value is set, #2").toBe("edf");
    q3.value = 5;
    expect(q2.value, "value is set, #3").toBe(1 + 5);
    q2.value = "klm";
    expect(q2.value, "value is set, #4").toBe("klm");
    q1.value = 2;
    expect(q2.value, "value is set, #5").toBe("klm");
    q3.value = 5;
    expect(q2.value, "value is set, #6").toBe("klm");
  });
  test("panel dynamic getPlainData & comment", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "panel",
          templateElements: [
            { name: "q1", type: "text" },
            { name: "q2", type: "text" }
          ],
          showCommentArea: true
        }
      ]
    });
    const q = survey.getQuestionByName("panel");
    q.value = [{ q1: 1, q2: 2 }, { q1: 3, q2: 4 }];
    q.comment = "Some comments";
    const data: any = survey.getPlainData();
    const qData = data[0].data;
    expect(qData.length, "There are 3 records").toBe(3);
    expect(qData[2].title, "comment title").toBe("Comment");
    expect(qData[2].isComment, "comment isComment").toBe(true);
  });
  test("panel dynamic & dropdown with showOtherItem", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "panel",
          panelCount: 1,
          templateElements: [
            { name: "q1", type: "dropdown", choices: [1, 2, 3], showOtherItem: true }
          ]
        }
      ]
    });
    const dynamicPanel = survey.getQuestionByName("panel");
    const panel = dynamicPanel.panels[0];
    const question = panel.getQuestionByName("q1");
    question.value = "other";
    question.otherValue = "comment1";
    expect(dynamicPanel.value, "panel.value #1").toEqual([{ q1: "other", "q1-Comment": "comment1" }]);
    question.value = 1;
    expect(question.value, "question value is changed").toBe(1);
    expect(question.comment, "comment is empty").toBeFalsy();
    expect(dynamicPanel.value, "panel.value #2").toEqual([{ q1: 1 }]);
    question.value = "other";
    expect(dynamicPanel.value, "panel.value #3").toEqual([{ q1: "other" }]);
    question.otherValue = "comment2";
    expect(dynamicPanel.value, "panel.value #4").toEqual([{ q1: "other", "q1-Comment": "comment2" }]);
  });
  test("panel dynamic & getQuestionFromArray with non-build panels, #7693", () => {
    const survey = new SurveyModel({
      pages: [
        { elements: [{ type: "text", name: "q1" }] },
        {
          elements: [
            {
              type: "paneldynamic",
              name: "panel",
              panelCount: 1,
              templateElements: [
                { name: "q2", type: "text" }
              ]
            }
          ]
        }
      ] });
    const dynamicPanel = survey.getQuestionByName("panel");
    expect(dynamicPanel.getQuestionFromArray("q2", 0), "Panels are not created yet").toBeFalsy();
    survey.currentPageNo = 1;
    expect(dynamicPanel.getQuestionFromArray("q2", 0).name, "Panels are created").toBe("q2");
  });
  test("panel dynamic & addPanel/removePanel with non-build panels, #7693", () => {
    const survey = new SurveyModel({
      pages: [
        { elements: [{ type: "text", name: "q1" }] },
        {
          elements: [
            {
              type: "paneldynamic",
              name: "panel",
              panelCount: 1,
              templateElements: [
                { name: "q2", type: "text" }
              ]
            }
          ]
        }
      ] });
    const dynamicPanel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    expect(dynamicPanel.panelCount, "panelCount #1").toBe(1);
    expect(dynamicPanel.getQuestionFromArray("q2", 0), "Panels are not created yet").toBeFalsy();
    dynamicPanel.addPanel();
    dynamicPanel.addPanel(1);
    expect(dynamicPanel.panelCount, "panelCount #2").toBe(3);
    dynamicPanel.removePanel(1);
    expect(dynamicPanel.panelCount, "panelCount #3").toBe(2);
    expect(dynamicPanel.getQuestionFromArray("q2", 0).name, "Panels are created").toBe("q2");
  });
  test("panel dynamic & panel visibleIf & checkbox vs carry forward, #7693", () => {
    const survey = new SurveyModel({
      "pages": [
        {
          "elements": [
            {
              "type": "paneldynamic",
              "name": "aboutMe",
              "valueName": "household",
              "templateElements": [
                {
                  "type": "text",
                  "name": "firstName"
                },
                {
                  "type": "text",
                  "name": "lastName"
                },
                {
                  "type": "expression",
                  "name": "fullName",
                  "visible": false,
                  "expression": "{panel.firstName} + ' ' + {panel.lastName}"
                }
              ],
              "panelCount": 2,
              "minPanelCount": 1,
              "templateVisibleIf": "{panelIndex} = 0"
            }
          ]
        },
        {
          "elements": [
            {
              "type": "paneldynamic",
              "name": "addChildren",
              "valueName": "household",
              "isRequired": true,
              "templateElements": [
                {
                  "type": "text",
                  "name": "childFirstName",
                  "valueName": "firstName"
                },
                {
                  "type": "text",
                  "name": "childLastName",
                  "valueName": "lastName"
                },
                {
                  "type": "expression",
                  "name": "childFullName",
                  "visible": false,
                  "valueName": "fullName",
                  "expression": "{panel.firstName} + ' ' + {panel.lastName}"
                }
              ],
              "panelCount": 1,
              "minPanelCount": 1,
              "templateVisibleIf": "{panelIndex} > 0"
            }
          ]
        },
        {
          "elements": [
            {
              "type": "checkbox",
              "name": "addIncomeFor",
              "choicesFromQuestion": "addChildren",
              "choiceValuesFromQuestion": "fullName"
            }
          ]
        },
        {
          "elements": [
            {
              "type": "paneldynamic",
              "name": "householdIncome",
              "valueName": "household",
              "templateElements": [
                {
                  "type": "text",
                  "name": "question1"
                }
              ],
              "templateTitle": "{panel.fullName}",
              "panelsState": "collapsed",
              "templateVisibleIf": "{addIncomeFor} contains {panel.fullName}"
            }
          ]
        }
      ]
    });
    survey.data = {
      "household": [
        {
          "firstName": "first1",
          "fullName": "first1 last1",
          "lastName": "last1",
          "question1": "text1"
        },
        {
          "firstName": "first2",
          "fullName": "first2 last2",
          "lastName": "last2"
        },
        {
          "firstName": "first3",
          "fullName": "first3 last3",
          "lastName": "last3",
          "question1": "test3"
        }
      ],
      "addIncomeFor": [
        "first1 last1",
        "first3 last3"
      ]
    };
    survey.doComplete();
    expect(survey.data).toEqual({
      "household": [
        {
          "firstName": "first1",
          "lastName": "last1",
          "question1": "text1"
        },
        {
          "firstName": "first2",
          "lastName": "last2"
        },
        {
          "firstName": "first3",
          "lastName": "last3",
          "question1": "test3"
        }
      ]
    });
  });

  test("paneldynamic: panelsState & valueName Bug#8653", () => {
    const survey = new SurveyModel({
      elements: [
        {
          "type": "checkbox",
          "name": "state_names",
          "title": "States",
          "valuePropertyName": "state_name",
          "choices": ["ACT", "NSW", "QLD"]
        },
        {
          "type": "paneldynamic",
          "name": "regions",
          "valueName": "state_names",
          "allowAddPanel": false,
          "allowRemovePanel": false,
          "visibleIf": "{state_names} notempty",
          "panelsState": "expanded",
          "templateTitle": "Regions for State {panel.state_name}",
          "templateElements": [
            {
              "type": "text",
              "name": "q1"
            }
          ]
        }
      ]
    });
    const checkbox = <QuestionCheckboxModel>survey.getQuestionByName("state_names");
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("regions");
    checkbox.selectAll();
    expect(panel.visiblePanels.length, "3 panels have been created").toBe(3);
    expect(panel.visiblePanels[0].state, "panels[0] state is expanded").toBe("expanded");
    expect(panel.visiblePanels[1].state, "panels[1] state is expanded").toBe("expanded");
    expect(panel.visiblePanels[2].state, "panels[2] state is expanded").toBe("expanded");
  });
  test("paneldynamic: check renderedPanels", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "panel",
          panelCount: 1,
          templateElements: [
            { name: "q1", type: "text" },
          ]
        },
        { type: "text", name: "q4" }
      ]
    });
    const question = <QuestionPanelDynamicModel>survey.getAllQuestions()[0];
    expect(question.renderedPanels.length).toBe(1);
    expect(question.renderedPanels).toEqual(question.visiblePanels);
    question.addPanel(1);
    expect(question.renderedPanels.length).toBe(2);
    expect(question.renderedPanels).toEqual(question.visiblePanels);
    question.addPanel(2);
    expect(question.renderedPanels.length).toBe(3);
    expect(question.renderedPanels).toEqual(question.visiblePanels);
    question.removePanel(question.visiblePanels[1]);
    expect(question.renderedPanels.length).toBe(2);
    expect(question.renderedPanels).toEqual(question.visiblePanels);
    question.removePanel(question.visiblePanels[0]);
    expect(question.renderedPanels.length).toBe(1);
    expect(question.renderedPanels).toEqual(question.visiblePanels);
    question.addPanel(1);
    expect(question.renderedPanels.length).toBe(2);
    expect(question.renderedPanels).toEqual(question.visiblePanels);
    question.displayMode = "tab";
    expect(question.renderedPanels.length).toBe(1);
    expect(question.renderedPanels[0]).toEqual(question.visiblePanels[0]);
    question.currentIndex = 1;
    expect(question.renderedPanels.length).toBe(1);
    expect(question.renderedPanels[0]).toEqual(question.visiblePanels[1]);
    question.currentIndex = 0;
    expect(question.renderedPanels.length).toBe(1);
    expect(question.renderedPanels[0]).toEqual(question.visiblePanels[0]);
    question.addPanel(2);
    expect(question.renderedPanels.length).toBe(1);
    expect(question.renderedPanels[0]).toEqual(question.visiblePanels[2]);
    question.removePanel(question.visiblePanels[2]);
    expect(question.renderedPanels.length).toBe(1);
    expect(question.renderedPanels[0]).toEqual(question.visiblePanels[1]);
  });

  test("paneldynamic: check panelsAnimation", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "panel",
          panelCount: 1,
          templateElements: [
            { name: "q1", type: "text" },
          ]
        },
        { type: "text", name: "q4" }
      ]
    });
    const question = <QuestionPanelDynamicModel>survey.getAllQuestions()[0];
    expect(question["panelsAnimation"] instanceof AnimationGroup).toBeTruthy();
    expect(question["panelsAnimation"] instanceof AnimationTab).toBeFalsy();

    question.displayMode = "tab";
    expect(question["panelsAnimation"] instanceof AnimationGroup).toBeFalsy();
    expect(question["panelsAnimation"] instanceof AnimationTab).toBeTruthy();

    question.displayMode = "carousel";
    expect(question["panelsAnimation"] instanceof AnimationGroup).toBeFalsy();
    expect(question["panelsAnimation"] instanceof AnimationTab).toBeTruthy();

    question.displayMode = "list";
    expect(question["panelsAnimation"] instanceof AnimationGroup).toBeTruthy();
    expect(question["panelsAnimation"] instanceof AnimationTab).toBeFalsy();
  });
  test("paneldynamic: Do not call onFirstRendered for hidden panels, Issue#10501", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "panel1",
          displayMode: "tab",
          panelCount: 2,
          templateElements: [
            { name: "q1", type: "text" },
          ]
        },
        {
          type: "paneldynamic",
          name: "panel2",
          panelCount: 2,
          templateElements: [
            { name: "q2", type: "text" },
          ]
        },
        {
          type: "paneldynamic",
          name: "panel3",
          displayMode: "carousel",
          panelCount: 2,
          templateElements: [
            { name: "q2", type: "text" },
          ]
        }
      ]
    });
    const panel1 = <QuestionPanelDynamicModel>survey.getQuestionByName("panel1");
    const panel2 = <QuestionPanelDynamicModel>survey.getQuestionByName("panel2");
    const panel3 = <QuestionPanelDynamicModel>survey.getQuestionByName("panel3");
    expect(panel1.panels[0].wasRendered, "panel1, #1").toBe(true);
    expect(panel1.panels[1].wasRendered, "panel1, #1").toBe(false);
    expect(panel2.panels[0].wasRendered, "panel2, #1").toBe(true);
    expect(panel2.panels[1].wasRendered, "panel2, #2").toBe(true);
    expect(panel3.panels[0].wasRendered, "panel3, #1").toBe(true);
    expect(panel3.panels[1].wasRendered, "panel3, #2").toBe(false);
    panel1.currentIndex = 1;
    expect(panel1.panels[0].wasRendered, "panel1, #3").toBe(true);
    panel3.currentIndex = 1;
    expect(panel3.panels[1].wasRendered, "panel3, #3").toBe(true);
    panel1.addPanel();
    expect(panel1.panels[2].wasRendered, "panel1, #4").toBe(true);
    panel2.addPanel();
    expect(panel2.panels[2].wasRendered, "panel2, #4").toBe(true);
    panel3.addPanel();
    expect(panel3.panels[2].wasRendered, "panel3, #4").toBe(true);
  });
  test("paneldynamic vs nested panels: Do not call onFirstRendered for hidden panels, Issue#10501", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "panel1",
          displayMode: "tab",
          panelCount: 2,
          templateElements: [
            { name: "panel2", type: "paneldynamic",
              panelCount: 1,
              minPanelCount: 1,
              templateElements: [
                { name: "q1", type: "text" },
              ],
            }
          ]
        }
      ]
    });
    const panel1 = <QuestionPanelDynamicModel>survey.getQuestionByName("panel1");
    expect(panel1.tabbedMenu?.actions.length, "There are two tabs").toBe(2);
    const panel2 = <QuestionPanelDynamicModel>panel1.panels[0].getQuestionByName("panel2");
    expect(panel1.panels[0].wasRendered, "panel1, #1").toBe(true);
    expect(panel2.wasRendered, "panel2, #1").toBe(true);
    expect(panel2.panels[0].wasRendered, "panel2, internal panel, #1").toBe(true);
    const q1 = panel2.panels[0].getQuestionByName("q1");
    expect(q1.wasRendered, "q1, #1").toBe(true);
    expect(panel2.panels[0].rows.length, "panel2 internal panel.rows, #1").toBe(1);
  });
  test("paneldynamic: Render panel correctly, Issue#10501", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "panel",
          displayMode: "tab",
          panelCount: 2,
          templateElements: [
            { name: "q1", type: "text" }
          ]
        }
      ]
    });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    expect(panel.tabbedMenu?.actions.length, "There are two tabs").toBe(2);
    const panel1 = panel.visiblePanels[0];
    const panel2 = panel.visiblePanels[1];
    expect(panel1.wasRendered, "panel1 was rendered").toBe(true);
    expect(panel2.wasRendered, "panel2 was not rendered").toBe(false);
    expect(panel2.visibleRows.length, "panel2 has no rows").toBe(0);
    panel.currentIndex = 1;
    expect(panel2.wasRendered, "panel2 was rendered").toBe(true);
    expect(panel2.visibleRows.length, "panel2 has one row").toBe(1);
    expect(panel2.visibleRows[0].elements.length, "panel2 first row has one element").toBe(1);
    expect(panel2.visibleRows[0].elements[0].name, "panel2 first row first element is q1").toBe("q1");
  });
  test("paneldynamic: dynamic panel with tabs as a child, Issue#10501", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "panel",
          panelCount: 1,
          minPanelCount: 1,
          maxPanelCount: 1,
          templateElements: [
            { name: "panel1", type: "paneldynamic",
              displayMode: "tab",
              panelCount: 2,
              minPanelCount: 1,
              maxPanelCount: 3,
              templateElements: [
                { name: "q1", type: "text" }
              ]
            }
          ]
        }
      ]
    });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    const innerPanel = <QuestionPanelDynamicModel>panel.visiblePanels[0].getQuestionByName("panel1");
    expect(innerPanel.displayMode, "inner panel displayMode is tab").toBe("tab");
    expect(innerPanel.panelCount, "inner panel has two panels").toBe(2);
    expect(innerPanel.wasRendered, "inner panel was rendered").toBe(true);
    expect(innerPanel.tabbedMenu?.actions.length, "There are two tabs").toBe(2);
    const panel1 = innerPanel.visiblePanels[0];
    const panel2 = innerPanel.visiblePanels[1];
    expect(panel1.wasRendered, "panel1 was rendered").toBe(true);
    expect(panel2.wasRendered, "panel2 was not rendered").toBe(false);
    expect(panel2.visibleRows.length, "panel2 has no rows").toBe(0);
    innerPanel.currentIndex = 1;
    expect(panel2.wasRendered, "panel2 was rendered").toBe(true);
    expect(panel2.visibleRows.length, "panel2 has one row").toBe(1);
    expect(panel2.visibleRows[0].elements.length, "panel2 first row has one element").toBe(1);
    expect(panel2.visibleRows[0].elements[0].name, "panel2 first row first element is q1").toBe("q1");
  });
  test("paneldynamic: dynamic panel with tabs as a child at design time, Issue#10501", () => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({
      elements: [
        {
          type: "paneldynamic",
          name: "panel",
          panelCount: 1,
          minPanelCount: 1,
          maxPanelCount: 1,
          templateElements: [
            { name: "panel1", type: "paneldynamic",
              displayMode: "tab",
              panelCount: 2,
              minPanelCount: 1,
              maxPanelCount: 3,
              templateElements: [
                { name: "q1", type: "text" }
              ]
            }
          ]
        }
      ]
    });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    const innerPanel = <QuestionPanelDynamicModel>panel.visiblePanels[0].getQuestionByName("panel1");
    expect(innerPanel.displayMode, "inner panel displayMode is tab").toBe("tab");
    expect(innerPanel.panelCount, "inner panel has two panels").toBe(2);
    expect(innerPanel.wasRendered, "inner panel was rendered").toBe(true);
    expect(innerPanel.tabbedMenu?.actions.length, "There is one tab").toBe(1);
    const panel1 = innerPanel.visiblePanels[0];
    expect(panel1, "panel1 is template panel").toBe(innerPanel.template);
    expect(panel1.wasRendered, "panel1 was rendered").toBe(true);
    expect(panel1.visibleRows.length, "panel1 has one row").toBe(1);
    expect(panel1.visibleRows[0].elements.length, "panel1 first row has one element").toBe(1);
    expect(panel1.visibleRows[0].elements[0].name, "panel1 first row first element is q1").toBe("q1");
  });
  test("paneldynamic: check panelsAnimation options", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "panel",
          panelCount: 2,
          templateElements: [
            { name: "q1", type: "text" },
          ]
        },
        { type: "text", name: "q4" }
      ]
    });
    survey.css = {
      paneldynamic: {
        panelWrapperEnter: "enter",
        panelWrapperLeave: "leave"
      }
    };
    const question = <QuestionPanelDynamicModel>survey.getAllQuestions()[0];
    const options = question["getPanelsAnimationOptions"]();
    const panelsContainer = document.createElement("div");
    const panelContainer2 = document.createElement("div");
    const panelContainer1 = document.createElement("div");
    panelsContainer.appendChild(panelContainer2);
    panelsContainer.appendChild(panelContainer1);
    document.body.appendChild(panelsContainer);
    // jsdom returns 0 for offsetHeight; stub it to mirror the heights set via style.height
    // so the carousel-mode animation hooks can read element heights without real layout.
    const stubOffsetHeight = (el: HTMLElement, value: number) => {
      Object.defineProperty(el, "offsetHeight", { configurable: true, get: () => value });
    };
    let enterOptions = options.getEnterOptions(question.panels[0]);
    let leaveOptions = options.getLeaveOptions(question.panels[1]);
    expect(enterOptions.cssClass).toBe("enter");
    expect(leaveOptions.cssClass).toBe("leave");
    enterOptions.onBeforeRunAnimation && enterOptions.onBeforeRunAnimation(panelContainer1);
    expect(panelContainer1.style.getPropertyValue("--animation-height-to")).toBe("0px");
    enterOptions.onAfterRunAnimation && enterOptions.onAfterRunAnimation(panelContainer1);
    expect(panelContainer1.style.getPropertyValue("--animation-height-to")).toBeFalsy();

    leaveOptions.onBeforeRunAnimation && leaveOptions.onBeforeRunAnimation(panelContainer2);
    expect(panelContainer2.style.getPropertyValue("--animation-height-to")).toBe("0px");
    leaveOptions.onAfterRunAnimation && leaveOptions.onAfterRunAnimation(panelContainer2);
    expect(panelContainer2.style.getPropertyValue("--animation-height-to")).toBeFalsy();

    question.displayMode = "carousel";
    question.currentIndex = 0;
    question["_renderedPanels"] = [question.panels[0], question.panels[1]];

    panelContainer1.style.height = "20px";
    panelContainer2.style.height = "40px";
    stubOffsetHeight(panelContainer1, 20);
    stubOffsetHeight(panelContainer2, 40);

    enterOptions = options.getEnterOptions(question.panels[0]);
    leaveOptions = options.getLeaveOptions(question.panels[1]);
    expect(enterOptions.cssClass).toBe("enter sv-pd-animation-right");
    expect(leaveOptions.cssClass).toBe("leave sv-pd-animation-right");
    enterOptions.onBeforeRunAnimation && enterOptions.onBeforeRunAnimation(panelContainer1);
    leaveOptions.onBeforeRunAnimation && leaveOptions.onBeforeRunAnimation(panelContainer2);
    expect(panelsContainer.style.getPropertyValue("--animation-height-from")).toBe("40px");
    expect(panelsContainer.style.getPropertyValue("--animation-height-to")).toBe("20px");
    enterOptions.onAfterRunAnimation && enterOptions.onAfterRunAnimation(panelContainer1);
    leaveOptions.onAfterRunAnimation && leaveOptions.onAfterRunAnimation(panelContainer2);
    expect(panelsContainer.style.getPropertyValue("--animation-height-from")).toBeFalsy();
    expect(panelsContainer.style.getPropertyValue("--animation-height-to")).toBeFalsy();

    question.currentIndex = 1;
    question["_renderedPanels"] = [question.panels[0], question.panels[1]];

    enterOptions = options.getEnterOptions(question.panels[0]);
    leaveOptions = options.getLeaveOptions(question.panels[1]);
    expect(enterOptions.cssClass).toBe("enter sv-pd-animation-left");
    expect(leaveOptions.cssClass).toBe("leave sv-pd-animation-left");
    enterOptions.onBeforeRunAnimation && enterOptions.onBeforeRunAnimation(panelContainer2);
    leaveOptions.onBeforeRunAnimation && leaveOptions.onBeforeRunAnimation(panelContainer1);
    expect(panelsContainer.style.getPropertyValue("--animation-height-from")).toBe("20px");
    expect(panelsContainer.style.getPropertyValue("--animation-height-to")).toBe("40px");
    enterOptions.onAfterRunAnimation && enterOptions.onAfterRunAnimation(panelContainer2);
    leaveOptions.onAfterRunAnimation && leaveOptions.onAfterRunAnimation(panelContainer1);
    expect(panelsContainer.style.getPropertyValue("--animation-height-from")).toBeFalsy();
    expect(panelsContainer.style.getPropertyValue("--animation-height-to")).toBeFalsy();

    question["focusNewPanelCallback"] = () => {};
    enterOptions = options.getEnterOptions(question.panels[0]);
    leaveOptions = options.getLeaveOptions(question.panels[1]);
    expect(enterOptions.cssClass).toBe("enter sv-pd-animation-adding sv-pd-animation-left");
    expect(leaveOptions.cssClass).toBe("leave sv-pd-animation-adding sv-pd-animation-left");
    enterOptions.onBeforeRunAnimation && enterOptions.onBeforeRunAnimation(panelContainer2);
    leaveOptions.onBeforeRunAnimation && leaveOptions.onBeforeRunAnimation(panelContainer1);
    expect(panelsContainer.style.getPropertyValue("--animation-height-from")).toBe("20px");
    expect(panelsContainer.style.getPropertyValue("--animation-height-to")).toBe("40px");
    enterOptions.onAfterRunAnimation && enterOptions.onAfterRunAnimation(panelContainer2);
    leaveOptions.onAfterRunAnimation && leaveOptions.onAfterRunAnimation(panelContainer1);
    expect(panelsContainer.style.getPropertyValue("--animation-height-from")).toBeFalsy();
    expect(panelsContainer.style.getPropertyValue("--animation-height-to")).toBeFalsy();

    const removedPanel = question.panels[1];
    question.removePanel(removedPanel);
    question["_renderedPanels"] = [question.panels[0], removedPanel];

    question["removedPanelIndex"] = 0;
    enterOptions = options.getEnterOptions(question.panels[0]);
    leaveOptions = options.getLeaveOptions(question.panels[1]);
    expect(enterOptions.cssClass).toBe("enter sv-pd-animation-removing sv-pd-animation-left");
    expect(leaveOptions.cssClass).toBe("leave sv-pd-animation-removing sv-pd-animation-left");
    enterOptions.onBeforeRunAnimation && enterOptions.onBeforeRunAnimation(panelContainer2);
    leaveOptions.onBeforeRunAnimation && leaveOptions.onBeforeRunAnimation(panelContainer1);
    expect(panelsContainer.style.getPropertyValue("--animation-height-from")).toBe("20px");
    expect(panelsContainer.style.getPropertyValue("--animation-height-to")).toBe("40px");
    enterOptions.onAfterRunAnimation && enterOptions.onAfterRunAnimation(panelContainer2);
    leaveOptions.onAfterRunAnimation && leaveOptions.onAfterRunAnimation(panelContainer1);
    expect(panelsContainer.style.getPropertyValue("--animation-height-from")).toBeFalsy();
    expect(panelsContainer.style.getPropertyValue("--animation-height-to")).toBeFalsy();

    question["removedPanelIndex"] = 1;
    enterOptions = options.getEnterOptions(question.panels[0]);
    leaveOptions = options.getLeaveOptions(question.panels[1]);
    expect(enterOptions.cssClass).toBe("enter sv-pd-animation-removing sv-pd-animation-right");
    expect(leaveOptions.cssClass).toBe("leave sv-pd-animation-removing sv-pd-animation-right");
    enterOptions.onBeforeRunAnimation && enterOptions.onBeforeRunAnimation(panelContainer2);
    leaveOptions.onBeforeRunAnimation && leaveOptions.onBeforeRunAnimation(panelContainer1);
    expect(panelsContainer.style.getPropertyValue("--animation-height-from")).toBe("20px");
    expect(panelsContainer.style.getPropertyValue("--animation-height-to")).toBe("40px");
    enterOptions.onAfterRunAnimation && enterOptions.onAfterRunAnimation(panelContainer2);
    leaveOptions.onAfterRunAnimation && leaveOptions.onAfterRunAnimation(panelContainer1);
    expect(panelsContainer.style.getPropertyValue("--animation-height-from")).toBeFalsy();
    expect(panelsContainer.style.getPropertyValue("--animation-height-to")).toBeFalsy();

    panelsContainer.remove();
  });
  test("onQuestionVisibleChanged should be fired", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        { type: "paneldynamic", name: "q2", panelCount: 1,
          templateElements: [{ type: "text", name: "q3", visibleIf: "{q1} = 1" }, { type: "text", name: "q4" }]
        }
      ]
    });
    const questionNames = new Array<string>();
    survey.onQuestionVisibleChanged.add((sender, options) => {
      questionNames.push(options.question.name + ":" + options.question.isVisible);
    });
    survey.setValue("q1", 1);
    survey.setValue("q1", 2);
    expect(questionNames, "visiblity logs").toEqual(["q3:true", "q3:false"]);
  });
  test("Always focus on error in duplicated value, Bug8228", () => {
    let focusedQuestionId = "";
    var oldFunc = SurveyElement.FocusElement;
    SurveyElement.FocusElement = function (elId: string): boolean {
      focusedQuestionId = elId;
      return true;
    };
    const survey = new SurveyModel({
      "elements": [{
        "name": "q1",
        "type": "paneldynamic",
        "keyName": "q2",
        "templateElements": [
          {
            "name": "q2",
            "type": "text"
          }
        ]
      },
      ]
    });
    survey.data = { q1: [{ q2: 2 }, { q2: 2 }] };

    const res = survey.validate(false, false);
    expect(res, "There is an error").toBe(false);
    expect(focusedQuestionId, "Do not focus").toBeFalsy();
    survey.validate(false, true);
    expect(focusedQuestionId, "Focus on the question").toBeTruthy();

    SurveyElement.FocusElement = oldFunc;
  });
  test("getFirstQuestionToFocus, Bug#8764", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "paneldynamic", name: "panel", panelCount: 1,
          templateElements: [{ type: "text", name: "q1" }, { type: "text", name: "q2", isRequired: true }]
        }
      ]
    });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    panel.validate(true);
    expect(panel.getFirstQuestionToFocus(false).name, "#1").toBe("q1");
    expect(panel.getFirstQuestionToFocus(true).name, "#2").toBe("q2");
    panel.panelCount = 0;
    expect(panel.getFirstQuestionToFocus(false).name, "#3").toBe("panel");
    expect(panel.getFirstQuestionToFocus(true), "#4").toBeFalsy();
    panel.isRequired = true;
    panel.validate(true);
    expect(panel.getFirstQuestionToFocus(true).name, "#5").toBe("panel");
  });
  test("getFirstQuestionToFocus, Bug#8764", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "panel",
          panelCount: 3,
          displayMode: "tab",
          templateElements: [
            { type: "text", name: "q1" },
            { type: "text", name: "q2" }
          ]
        }
      ]
    });

    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    panel.currentIndex = 1;

    const q1 = panel.panels[1].getQuestionByName("q1");
    expect(panel.getFirstQuestionToFocus(false).id, "#1").toBe(q1.id);
    expect((<any>panel).getFirstInputElementId(), "#2").toBe(q1.inputId);
  });
  test("defaultRowValue in dynamic panel, Bug#8819", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "paneldynamic",
          "name": "panel1",
          "templateElements": [
            {
              "type": "matrixdynamic",
              "name": "matrix1",
              "columns": [
                {
                  "name": "col1",
                  "cellType": "text"
                }
              ],
              "rowCount": 1,
              "minRowCount": 1,
              "defaultRowValue": {
                "col1": "abc"
              }
            }
          ],
          "minPanelCount": 1
        }
      ]
    });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel1");
    expect(panel.value, "#1").toEqual([{ matrix1: [{ "col1": "abc" }] }]);
    panel.addPanel();
    expect(panel.value, "#2").toEqual([{ matrix1: [{ "col1": "abc" }] }, { matrix1: [{ "col1": "abc" }] }]);
    panel.panels[1].questions[0].addRow();
    expect(panel.value, "#3").toEqual([{ matrix1: [{ "col1": "abc" }] }, { matrix1: [{ "col1": "abc" }, { "col1": "abc" }] }]);
  });
  test("Do not allow to make panelCount be less than minPanelCount prop & more than maxPanelCount at design, Bug#9906", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "panel1",
          templateElements: [{ type: "text", name: "q1" }],
        }
      ]
    });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel1");
    panel.panelCount = 1;
    panel.minPanelCount = 3;
    expect(panel.panelCount, "#1").toBe(3);
    panel.panelCount = 2;
    expect(panel.panelCount, "#2").toBe(2);
    panel.panelCount = 10;
    panel.maxPanelCount = 5;
    expect(panel.panelCount, "#3").toBe(5);
    panel.panelCount = 7;
    expect(panel.panelCount, "#4").toBe(7);
    panel.panelCount = 4;
    expect(panel.panelCount, "#5").toBe(4);
    survey.setDesignMode(true);
    panel.panelCount = 2;
    expect(panel.panelCount, "#6").toBe(3);
    panel.panelCount = 10;
    expect(panel.panelCount, "#7").toBe(5);
  });
  test("maxRowCount & footer buttons, Bug#8865", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "paneldynamic",
          "name": "panel1",
          "templateElements": [
            {
              "type": "text",
              "name": "q1"
            }
          ]
        }
      ]
    });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel1");
    const btnAdd = panel.footerToolbar.getActionById("sv-pd-add-btn");
    expect(btnAdd.isVisible, "#1").toBe(true);
    panel.value = [{ q1: "abc" }];
    expect(btnAdd.isVisible, "#2").toBe(true);
    panel.maxPanelCount = 1;
    expect(btnAdd.isVisible, "#3").toBe(false);
    panel.maxPanelCount = 2;
    expect(btnAdd.isVisible, "#4").toBe(true);
  });
  test("maxRowCount & footer buttons in detail matrix panel, Bug#9714", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "matrixdynamic",
          "name": "matrix",
          "columns": [
            {
              "name": "col1"
            }
          ],
          "detailElements": [
            {
              "type": "paneldynamic",
              "name": "panel",
              "templateElements": [
                {
                  "type": "text",
                  "name": "question1"
                }
              ],
              "maxPanelCount": 2
            }
          ],
          "detailPanelMode": "underRowSingle",
          "cellType": "text",
          "rowCount": 2
        }
      ]
    });
    survey.pages[0].onFirstRendering();
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    let row = matrix.visibleRows[0];
    row.showDetailPanel();
    let panel = row.getQuestionByName("panel");
    const getAddBtn = () => {
      return panel.footerToolbar.getActionById("sv-pd-add-btn");
    };
    expect(getAddBtn().isVisible, "addBtn #1").toBe(true);
    panel.value = [{ q1: "abc" }];
    expect(getAddBtn().isVisible, "#addBtn 2").toBe(true);
    expect(panel.canAddPanel, "canAddPanel #2").toBe(true);
    panel.value = [{ q1: "abc" }, { q1: "def" }];
    expect(panel.panelCount, "panelCount #3").toBe(2);
    expect(panel.maxPanelCount, "maxPanelCount #3").toBe(2);
    expect(panel.canAddPanel, "canAddPanel #3").toBe(false);
    expect(getAddBtn().isVisible, "addBtn #3").toBe(false);
    panel.removePanel(0);
    expect(getAddBtn().isVisible, "addBtn #4").toBe(true);
    expect(panel.canAddPanel, "canAddPanel #4").toBe(true);
    row = matrix.visibleRows[1];
    row.showDetailPanel();
    panel = row.getQuestionByName("panel");
    panel.addPanel();
    expect(getAddBtn().isVisible, "addBtn #5").toBe(true);
    panel.addPanel();
    expect(getAddBtn().isVisible, "addBtn #6").toBe(false);
    panel.removePanel(0);
    expect(getAddBtn().isVisible, "addBtn #7").toBe(true);
  });
  test("A dynamic matrix cell value is reset when adding a new outer dynanic panel, Bug#8892", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          type: "paneldynamic",
          name: "main",
          templateElements: [
            {
              type: "paneldynamic",
              name: "detail",
              templateElements: [
                {
                  type: "matrixdynamic",
                  name: "matrix",
                  columns: [{ "name": "col1", "cellType": "text" }],
                  rowCount: 1,
                  minRowCount: 1
                }
              ]
            }
          ]
        }
      ]
    });
    const mainPanel = <QuestionPanelDynamicModel>survey.getQuestionByName("main");
    const panel1 = mainPanel.addPanel();
    const detailPanel1 = <QuestionPanelDynamicModel>panel1.getQuestionByName("detail");
    const matrix1 = detailPanel1.addPanel().getQuestionByName("matrix");
    matrix1.visibleRows[0].getQuestionByName("col1").value = "main1_detail1";
    const matrix2 = detailPanel1.addPanel().getQuestionByName("matrix");
    matrix2.visibleRows[0].getQuestionByName("col1").value = "main1_detail2";
    expect(mainPanel.value, "main panel value #1").toEqual([
      { detail: [{ matrix: [{ col1: "main1_detail1" }] }, { matrix: [{ col1: "main1_detail2" }] }] }
    ]);
    const panel2 = mainPanel.addPanel();
    const detailPanel2 = <QuestionPanelDynamicModel>panel2.getQuestionByName("detail");
    const matrix3 = detailPanel2.addPanel().getQuestionByName("matrix");
    matrix3.visibleRows[0].getQuestionByName("col1").value = "main2_detail1";
    expect(mainPanel.value, "main panel value #2").toEqual([
      { detail: [{ matrix: [{ col1: "main1_detail1" }] }, { matrix: [{ col1: "main1_detail2" }] }] },
      { detail: [{ matrix: [{ col1: "main2_detail1" }] }] }
    ]);
    expect(matrix1.visibleRows[0].getQuestionByName("col1").value, "Last row value, matrix1").toBe("main1_detail1");
    expect(matrix2.visibleRows[0].getQuestionByName("col1").value, "Last row value, matrix2").toBe("main1_detail2");
  });
  test("Validation doesn't work if a user doesn't visit the page, Bug#8937", () => {
    const survey = new SurveyModel({
      logoPosition: "right",
      pages: [
        {
          elements: [{ type: "text", name: "question1" }]
        },
        {
          elements: [
            {
              type: "paneldynamic",
              name: "panel",
              templateElements: [{ type: "text", name: "question2", isRequired: true }],
              panelCount: 1
            }
          ]
        },
        {
          elements: [{ type: "text", name: "question3" }]
        }
      ],
      checkErrorsMode: "onComplete"
    });
    survey.currentPageNo = 2;
    survey.tryComplete();
    expect(survey.state, "Still running").toBe("running");
    expect(survey.currentPageNo, "move to page with panel").toBe(1);
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    expect(panel.panels[0].getQuestionByName("question2").errors.length, "has an error").toBe(1);
  });
  test("default value for maxPanelCount, Bug#9000", () => {
    expect(new QuestionPanelDynamicModel("q1").maxPanelCount, "default value").toBe(100);
    settings.panel.maxPanelCount = 300;
    expect(new QuestionPanelDynamicModel("q1").maxPanelCount, "updated default value").toBe(300);
    settings.panel.maxPanelCount = 100;
    expect(new QuestionPanelDynamicModel("q1").maxPanelCount, "default value again").toBe(100);
  });
  test("Do not serialize renderMode & showProgressBar", () => {
    const survey = new SurveyModel({
      elements: [{ type: "paneldynamic", name: "panel1", displayMode: "carousel", showProgressBar: false }]
    });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel1");
    expect(panel.renderMode, "renderMode is set").toBe("progressTop");
    expect(panel.displayMode, "displayMode is set").toBe("carousel");
    expect(panel.showProgressBar, "showProgressBar is set").toBe(false);
    expect(panel.showProgressBar, "showProgressBar is set").toBe(false);
    const json = panel.toJSON();
    expect(json.renderMode, "renderMode on json").toBeFalsy();
    expect(json.displayMode, "displayMode is json").toBe("carousel");
    expect(json.showProgressBar, "showProgressBar is json").toBeFalsy();
    expect(json.showProgressBar, "showProgressBar is json").toBe(false);
  });
  test("A Dynamic Panel question number is updated when adding a new panel Bug#9401", () => {
    const survey = new SurveyModel({
      showQuestionNumbers: true,
      elements: [
        { type: "text", name: "question1" },
        { type: "paneldynamic", name: "panel1",
          templateElements: [{ type: "text", name: "question3" }]
        }
      ]
    });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel1");
    expect(panel.no, "no #1").toBe("2.");
    panel.addPanel();
    expect(panel.no, "no #2").toBe("2.");
  });
  test("A Dynamic Panel question & showNumber=false Bug#10479.1", () => {
    const survey = new SurveyModel({
      showQuestionNumbers: true,
      elements: [
        { type: "text", name: "q1" },
        { type: "paneldynamic", name: "panel1", showNumber: false,
          templateElements: [{ type: "text", name: "q2" }]
        },
        { type: "text", name: "q3" },
      ]
    });
    const q3 = survey.getQuestionByName("q3");
    expect(q3.no, "q3.no #1").toBe("2.");
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel1");
    panel.addPanel();
    panel.addPanel();
    expect(q3.no, "q3.no #2").toBe("2.");
  });
  test("A Dynamic Panel question & showNumber=false Bug#10479.2", () => {
    const survey = new SurveyModel({
      showQuestionNumbers: "recursive",
      elements: [
        { type: "panel", name: "panel",
          elements: [
            { type: "text", name: "q1" },
            { type: "paneldynamic", name: "panel1", showNumber: false,
              templateElements: [{ type: "text", name: "q2" }]
            },
            { type: "text", name: "q3" }
          ] },
      ]
    });
    const q3 = survey.getQuestionByName("q3");
    expect(q3.no, "q3.no #1").toBe("2.");
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel1");
    panel.addPanel();
    panel.addPanel();
    expect(q3.no, "q3.no #2").toBe("2.");
  });
  test("A Dynamic Panel question & showNumber=false Bug#10479.3", () => {
    const survey = new SurveyModel({
      showQuestionNumbers: "recursive",
      questionStartIndex: "1.1.",
      elements: [
        { type: "panel", name: "panel",
          elements: [
            { type: "text", name: "q1" },
            { type: "paneldynamic", name: "panel1", showNumber: false,
              templateElements: [{ type: "text", name: "q2" }]
            },
            { type: "text", name: "q3" }
          ] },
      ]
    });
    const q3 = survey.getQuestionByName("q3");
    expect(q3.no, "q3.no #1").toBe("2.");
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel1");
    panel.addPanel();
    panel.addPanel();
    expect(q3.no, "q3.no #2").toBe("2.");
  });
  test("Test displayValue() function in dynamic panel, Bug#9635", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "panel1",
          templateElements: [
            {
              type: "checkbox",
              name: "q1",
              choices: ["item1", "item2", "item3"],
              showOtherItem: true
            },
            {
              type: "text",
              name: "q2",
              setValueExpression: "displayValue('q1',{panel.q1})"
            }
          ]
        }]
    });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel1");
    panel.addPanel();
    const q1 = panel.panels[0].getQuestionByName("q1");
    const q2 = panel.panels[0].getQuestionByName("q2");
    q1.value = ["item1", "other"];
    expect(q2.value, "Other as other display value").toBe("item1, Other (describe)");
    q1.otherValue = "other comment";
    expect(q2.value, "Other is comment value").toBe("item1, other comment");
    expect(panel.value, "value is set correctly").toEqual([{ q1: ["item1", "other"], "q1-Comment": "other comment", q2: "item1, other comment" }]);
  });
  test("Question title width for dynamic panels #2295", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "question1", titleLocation: "left" },
        {
          type: "paneldynamic",
          name: "panel1",
          panelCount: 1,
          templateQuestionTitleLocation: "left",
          templateElements: [
            { type: "text", name: "q1" }
          ]
        }]
    });
    const qPanel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel1");
    let q1 = qPanel.panels[0].getQuestionByName("q1");
    expect(q1.titleWidth, "q1 titleWidth, #1").toBeUndefined();
    const page = survey.pages[0];
    page.questionTitleWidth = "100px";
    expect(page.getQuestionTitleWidth(), "page titleWidth, #1").toBe("100px");
    expect(q1.titleWidth, "q1 titleWidth, #2").toBe("100px");
    qPanel.templateQuestionTitleWidth = "200px";
    expect(qPanel.panels[0].getQuestionTitleWidth(), "panel titleWidth, #1").toBe("200px");
    expect(q1.titleWidth, "q1 titleWidth, #4").toBe("200px");
    qPanel.addPanel();
    expect(qPanel.panels[0].getQuestionTitleWidth(), "panel titleWidth, #2").toBe("200px");
    q1 = qPanel.panels[0].getQuestionByName("q1");
    expect(q1.titleWidth, "q1 titleWidth, #5").toBe("200px");
  });
  test("Question title width for dynamic panels - property.visibleIf #2295", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "panel1",
          templateElements: [
            { type: "text", name: "q1" }
          ]
        }]
    });
    const qPanel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel1");
    const prop = Serializer.findProperty("paneldynamic", "templateQuestionTitleWidth");
    expect(prop.isVisible("", qPanel), "#1").toBe(false);
    qPanel.templateQuestionTitleLocation = "left";
    expect(prop.isVisible("", qPanel), "#2").toBe(true);
    qPanel.templateQuestionTitleLocation = "top";
    expect(prop.isVisible("", qPanel), "#3").toBe(false);
    const q1 = qPanel.template.getQuestionByName("q1");
    q1.titleLocation = "left";
    expect(prop.isVisible("", qPanel), "#4").toBe(true);
    q1.titleLocation = "top";
    expect(prop.isVisible("", qPanel), "#5").toBe(false);
  });
  test("Question title location for dynamic panels - update dynamically #2295", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "panel1",
          panelCount: 1,
          templateElements: [
            { type: "text", name: "q1" }
          ]
        }]
    });
    const qPanel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel1");
    const panel = <PanelModel>qPanel.panels[0];
    const q1 = panel.getQuestionByName("q1");
    const leftClass = q1.cssClasses.titleLeftRoot;
    expect(q1.cssRoot.indexOf(leftClass) > -1, "#1").toBe(false);
    qPanel.templateQuestionTitleLocation = "left";
    expect(q1.cssRoot.indexOf(leftClass) > -1, "#2").toBe(true);
    qPanel.templateQuestionTitleLocation = "default";
    expect(q1.cssRoot.indexOf(leftClass) > -1, "#3").toBe(false);
    survey.pages[0].questionTitleLocation = "left";
    expect(q1.cssRoot.indexOf(leftClass) > -1, "#4").toBe(true);
  });
  test("Question title location for dynamic panels, bypass dynamic panel titleLocation Bug#10452", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "panel1",
          panelCount: 1,
          templateElements: [
            { type: "text", name: "q1" }
          ]
        }]
    });
    const page = survey.pages[0];
    const qPanel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel1");
    const panel = <PanelModel>qPanel.panels[0];
    const q1 = panel.getQuestionByName("q1");
    expect(q1.getTitleLocation(), "titleLocation #1").toBe("top");
    qPanel.templateQuestionTitleLocation = "left";
    expect(q1.getTitleLocation(), "titleLocation #2").toBe("left");
    q1.titleLocation = "top";
    expect(q1.getTitleLocation(), "titleLocation #3").toBe("top");
    qPanel.templateQuestionTitleLocation = "default";
    expect(q1.getTitleLocation(), "titleLocation #4").toBe("top");
    q1.titleLocation = "default";
    expect(q1.getTitleLocation(), "titleLocation #5").toBe("top");
    page.questionTitleLocation = "left";
    expect(q1.getTitleLocation(), "titleLocation #6").toBe("left");
    qPanel.titleLocation = "hidden";
    expect(q1.getTitleLocation(), "titleLocation #7").toBe("left");
    qPanel.titleLocation = "top";
    expect(q1.getTitleLocation(), "titleLocation #8").toBe("left");
    page.questionTitleLocation = "top";
    expect(q1.getTitleLocation(), "titleLocation #9").toBe("top");
    page.questionTitleLocation = "left";
    expect(q1.getTitleLocation(), "titleLocation #10").toBe("left");
    page.questionTitleLocation = "default";
    expect(q1.getTitleLocation(), "titleLocation #11").toBe("top");
  });
  test("getFirstErrorInputElementId doesn't work correctly for panel dynamic", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "panel1",
          panelCount: 2,
          templateElements: [
            { type: "text", name: "q1", isRequired: true }
          ]
        }]
    });

    const qPanel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel1");
    const checkFunc = (): string => {
      return qPanel["getFirstErrorInputElementId"]() as string;
    };
    const panel1 = <PanelModel>qPanel.panels[0];
    const q1 = panel1.getQuestionByName("q1");
    const panel2 = <PanelModel>qPanel.panels[1];
    const q2 = panel2.getQuestionByName("q1");
    survey.tryComplete();
    expect(checkFunc(), "check first panel #1").toBe(q1.inputId);
    q1.value = "1";
    expect(checkFunc(), "check first panel #2").toBe(q2.inputId);
  });
  test("Using resetValueIf, visibleIf & default value for a question in dynamic panel may leads to infitive loop, Bug#9956", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "rPanel",
          panelCount: 1,
          templateElements: [
            {
              type: "paneldynamic",
              name: "dPanel",
              templateElements: [
                { type: "text", name: "q1", defaultValue: 100, resetValueIf: "{panel.q2} = 200 || {panel.q3} != 300" },
                { type: "text", name: "q2", defaultValue: 200, resetValueIf: "{panel.q1} = 100 || {panel.q4} != 10" },
                { type: "text", name: "q3", defaultValueExpression: "{rPanel[0].dPanel[0].q1} + {panel.q2} + {panel.q4}" },
                { type: "text", name: "q4" }
              ]
            }]
        }]
    });
    const rPanel = <QuestionPanelDynamicModel>survey.getQuestionByName("rPanel");
    const dPanel = <QuestionPanelDynamicModel>rPanel.panels[0].getQuestionByName("dPanel");
    dPanel.addPanel();
    const panel = dPanel.panels[0];
    expect(panel.getQuestionByName("q1").value, "q1 value, #1").toBe(100);
    expect(panel.getQuestionByName("q2").value, "q2  value, #1").toBe(200);
    expect(panel.getQuestionByName("q3").value, "q3 value, #1").toBe(300);
    panel.getQuestionByName("q4").value = 300;
    expect(panel.getQuestionByName("q1").value, "q1 value, #2").toBe(100);
    expect(panel.getQuestionByName("q2").value, "q2  value, #2").toBe(200);
    expect(panel.getQuestionByName("q3").value, "q3 value, #2").toBe(600);
    panel.getQuestionByName("q1").value = 1;
    panel.getQuestionByName("q2").value = 2;
    panel.getQuestionByName("q4").value = 400;
    expect(panel.getQuestionByName("q1").value, "q1 value, #3").toBe(100);
    expect(panel.getQuestionByName("q2").value, "q2  value, #3").toBe(200);
    expect(panel.getQuestionByName("q3").value, "q3 value, #3").toBe(700);
  });
  test("paneldynamic.getValueGetterContext()", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "rPanel",
          panelCount: 1,
          templateElements: [
            { type: "dropdown", name: "q1", choices: [{ value: 1, text: "item1" }] },
            {
              type: "paneldynamic",
              name: "dPanel",
              templateElements: [
                { type: "dropdown", name: "q2", choices: [1, { value: 2, text: "item2" }] },
              ]
            }]
        }]
    });
    survey.data = { rPanel: [{ q1: 1, dPanel: [{ q2: 2 }, { q2: 2 }] }], var1: "b" };
    const getter = new ValueGetter();
    const context = survey.getValueGetterContext();
    expect(getter.getValue("rPanel[0].q1", context), "#1").toBe(1);
    expect(getter.getDisplayValue("rPanel[0].q1", context), "text #1").toBe("item1");
    expect(getter.getValue("rPanel[0].dPanel[1].q2", context), "#2").toBe(2);
    expect(getter.getDisplayValue("rPanel[0].dPanel[1].q2", context), "text #2").toBe("item2");
    const rPanel = <QuestionPanelDynamicModel>survey.getQuestionByName("rPanel");
    const panelContext = (<any>rPanel.panels[0].data).getValueGetterContext();
    expect(getter.getValue("panel.q1", panelContext), "panel context #1").toBe(1);
    expect(getter.getValue("var1", panelContext), "panel context #2").toBe("b");
  });
  test("paneldynamic.panelCountExpression custom property, Bug#10171", () => {
    Serializer.addProperty("paneldynamic", {
      name: "panelCountExpression",
      type: "condition",
      category: "logic",
      onExecuteExpression: (obj, res) => {
        obj.panelCount = res;
      }
    });
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "text",
          "name": "question1",
          "defaultValue": 1
        },
        {
          "type": "paneldynamic",
          "name": "question2",
          "panelCountExpression": "{question1}",
          "templateElements": [
            {
              "type": "text",
              "name": "question3"
            }
          ]
        }
      ]
    });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("question2");
    expect(panel.panelCount, "panelCount #1").toBe(1);
    panel.removePanel(0);
    expect(panel.panelCount, "panelCount #2").toBe(1);
    panel.addPanelUI();
    expect(panel.panelCount, "panelCount #3").toBe(1);
    survey.setValue("question1", 2);
    expect(panel.panelCount, "panelCount #4").toBe(2);
    Serializer.removeProperty("paneldynamic", "panelCountExpression");
  });
  test("paneldynamic nested question valueName & clearIncorrectValues, Bug#10206", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "paneldynamic",
          "name": "panel",
          "templateElements": [
            {
              "type": "text",
              "name": "q1",
              "valueName": "q1Value"
            }
          ]
        }
      ]
    });
    survey.data = {
      panel: [{ q1Value: 1, }, { q1Value: 2 }]
    };
    expect(survey.getValue("panel"), "survey.data #1").toEqual([{ q1Value: 1 }, { q1Value: 2 }]);
    survey.clearIncorrectValues();
    expect(survey.getValue("panel"), "survey.data #2").toEqual([{ q1Value: 1 }, { q1Value: 2 }]);
  });
  test("survey.getData vs panel inside tempalte panel, Bug#10230", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "paneldynamic",
          "name": "d1",
          "templateElements": [
            {
              "type": "text",
              "name": "q1"
            }
          ]
        },
        {
          "type": "paneldynamic",
          "name": "d2",
          "templateElements": [
            {
              "type": "panel",
              "name": "panel1",
              "elements": [
                {
                  "type": "text",
                  "name": "q2"
                }
              ]
            }
          ]
        }
      ]
    });
    survey.data = {
      d1: [{ q1: 1, }, { q1: 2 }],
      d2: [{ q2: 1 }, { q2: 2 }]
    };
    expect(survey.getData({ includePanels: true }), "survey.getData #1").toEqual({ d1: [{ q1: 1 }, { q1: 2 }], d2: [{ panel1: { q2: 1 } }, { panel1: { q2: 2 } }] });
  });
  test("parentQuestion inside custom function, Bug#10210", () => {
    let notParentCalls = 0;
    let parentCalls = 0;
    function customFunc(params: any[]): any {
      if (!this.question.parentQuestion) {
        notParentCalls++;
      } else {
        parentCalls++;
      }
      return 1;
    }
    FunctionFactory.Instance.register("customFunc", customFunc);
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "paneldynamic",
          "name": "d1",
          "panelCount": 1,
          "templateElements": [
            {
              "type": "expression",
              "name": "q1",
              "expression": "customFunc()"
            }
          ]
        }
      ]
    });
    expect(notParentCalls, "notParentCalls").toBe(0);
    expect(parentCalls > 0, "parentCalls #1").toBe(true);
    //expect(parentCalls, "parentCalls #1").toBe(1);
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("d1");
    const prevCalls = parentCalls;
    panel.addPanel();
    expect(notParentCalls, "notParentCalls").toBe(0);
    expect(parentCalls > prevCalls, "parentCalls #2").toBe(true);
  /*
  expect(parentCalls, "parentCalls #2").toBe(2);
  panel.addPanel();
  expect(parentCalls, "parentCalls #3").toBe(3);
  panel.addPanel();
  expect(parentCalls, "parentCalls #4").toBe(4);
  */
  });
  test("SurveyError.notificationType & validate in panel dynamic,Issue#9085", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "paneldynamic", name: "panel", panelCount: 2,
          templateElements: [
            { name: "q1", type: "text", validators: [{ type: "numeric", maxValue: 5, notificationType: "warning" }, { type: "numeric", maxValue: 10 }] },
            { name: "q2", type: "text" }
          ]
        }
      ]
    });
    const panel = <QuestionMatrixDynamicModel>survey.getQuestionByName("panel");
    const panels = panel.panels;
    const pnl1_q1 = panels[0].getQuestionByName("q1");
    const pnl2_q1 = panels[1].getQuestionByName("q1");
    pnl1_q1.value = 7;
    pnl2_q1.value = 12;
    let erroredQuestionName = "";
    const callbackFunc = (res: boolean, question: Question) => {
      erroredQuestionName = question?.name || "";
    };
    expect(survey.currentPage.validate(true, true, callbackFunc), "There is an error").toBe(false);
    expect(erroredQuestionName, "The matrix question is returned").toBe("q1");
    expect(pnl1_q1.errors.length, "There is no error, cell1").toBe(1);
    expect(pnl1_q1["hasCssError"](), "There is no css error, cell1").toBe(false);
    expect(pnl1_q1["hasCssError"](true), "There is a warning, cell1").toBe(true);
    expect(pnl2_q1.errors.length, "There is an error, cell2").toBe(2);
    expect(pnl2_q1["hasCssError"](), "There is css error, cell2").toBe(true);
    expect(pnl2_q1["hasCssError"](true), "There is css error, cell2").toBe(true);
    pnl2_q1.value = 8;
    expect(pnl2_q1.errors.length, "There is a warning, cell2").toBe(1);
    expect(pnl2_q1["hasCssError"](), "There is css error, cell2").toBe(false);
    expect(pnl2_q1["hasCssError"](true), "There is a css warning, cell2").toBe(true);
    expect(survey.tryComplete(), "There is no error, complete the survey").toBe(true);
    expect(survey.data, "The data is correct").toEqual({ panel: [{ q1: 7 }, { q1: 8 }] });
  });
  test("Panel dynamic vs multiple text in expression, Bug#10230", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "paneldynamic",
          "name": "d1",
          "panelCount": 1,
          "templateElements": [
            { "type": "multipletext", "name": "q1", items: [{ name: "item1" }, { name: "item2" }] },
            { type: "text", name: "q2", setValueExpression: "{panel.q1.item1} + {panel.q1.item2}" }
          ]
        }
      ]
    });
    const dp = <QuestionPanelDynamicModel>survey.getQuestionByName("d1");
    const panel = dp.panels[0];
    const q1 = <QuestionMultipleTextModel>panel.getQuestionByName("q1");
    const q2 = <QuestionTextModel>panel.getQuestionByName("q2");
    q1.items[0].value = 1;
    expect(q2.value, "q1.item1 = 1").toBe(1);
    q1.items[1].value = 2;
    expect(q2.value, "q1.item1 = 1, q1.item2 = 2").toBe(3);
  });
  test("Panel dynamic vs visibleIf & dots in question names, Bug#10505", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "paneldynamic",
          "name": "panel",
          "templateElements": [
            {
              "type": "text",
              "name": "Q088"
            },
            {
              "type": "boolean",
              "name": "Q088.5"
            },
            {
              "type": "text",
              "name": "Q090",
              "visibleIf": "{panel.Q088.5} = false"
            }
          ],
          "panelCount": 1
        }
      ]
    });
    const dp = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    const panel = dp.panels[0];
    const q088 = <QuestionMultipleTextModel>panel.getQuestionByName("Q088");
    const q088_5 = <QuestionTextModel>panel.getQuestionByName("Q088.5");
    const q090 = <QuestionTextModel>panel.getQuestionByName("Q090");
    expect(q090.isVisible, "q090 visible #1").toBe(false);
    q088_5.value = false;
    expect(q090.isVisible, "q090 visible #2").toBe(true);
    q088.value = "0123456789";
    expect(q090.isVisible, "q090 visible #3").toBe(true);
    q088_5.value = true;
    expect(q090.isVisible, "q090 visible #4").toBe(false);
    q088_5.value = false;
    expect(q090.isVisible, "q090 visible #5").toBe(true);
  });
  test("paneldynamic getPanelInDesignMode", () => {
    expect(new QuestionTextModel("q1").getPanelInDesignMode(), "text returns null").toBeFalsy();
    const q1 = new QuestionPanelDynamicModel("q1");
    expect(q1.getPanelInDesignMode(), "returns tempalte").toBe(q1.template);
  });
  test("paneldynamic firstExpanded should not call scrollElementToTop on initial build, Bug#10998", () => {
    vi.useFakeTimers();
    try {
      const survey = new SurveyModel({
        "elements": [
          {
            "type": "paneldynamic",
            "name": "relatives",
            "templateElements": [{ "type": "text", "name": "q1" }],
            "templateTitle": "Panel #{panelIndex}",
            "panelCount": 3,
            "panelsState": "firstExpanded"
          }
        ]
      });
      let scrollCalled = false;
      survey.scrollElementToTop = (() => { scrollCalled = true; }) as any;
      const q = <QuestionPanelDynamicModel>survey.getQuestionByName("relatives");
      q.onFirstRendering();
      expect(q.panels[0].state, "first panel is expanded").toBe("expanded");
      expect(q.panels[1].state, "second panel is collapsed").toBe("collapsed");
      vi.advanceTimersByTime(50);
      expect(scrollCalled, "scrollElementToTop should not be called on initial panel build").toBe(false);
    } finally {
      vi.useRealTimers();
    }
  });
  test("Panel dynamic vs prevPanel & nextPanel in expression, Issue#10606", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "paneldynamic",
          "name": "panel",
          "templateElements": [
            {
              "type": "text",
              "name": "q1"
            },
            {
              "type": "expression",
              "name": "q2",
              "expression": "{panel.q1} + {prevPanel.q1} + {nextPanel.q1}"
            }
          ],
          "panelCount": 4
        }
      ]
    });

    const dp = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    dp.panels[0].getQuestionByName("q1").value = 10;
    dp.panels[1].getQuestionByName("q1").value = 20;
    dp.panels[2].getQuestionByName("q1").value = 30;
    dp.panels[3].getQuestionByName("q1").value = 40;
    expect(dp.panels[0].getQuestionByName("q2").value, "panel 0: only nextPanel").toBe(10 + 20);
    expect(dp.panels[1].getQuestionByName("q2").value, "panel 1: prevPanel & nextPanel").toBe(10 + 20 + 30);
    expect(dp.panels[2].getQuestionByName("q2").value, "panel 2: prevPanel & nextPanel").toBe(20 + 30 + 40);
    expect(dp.panels[3].getQuestionByName("q2").value, "panel 3: only prevPanel").toBe(30 + 40);
  });
  test("Nested paneldynamic editing a value. The bug was in V1, add unit test only, Bug#10674", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "paneldynamic",
          "name": "rootPanel",
          "panelCount": 1,
          "templateElements": [
            {
              "type": "paneldynamic",
              "name": "innerPanel",
              "panelCount": 5,
              "templateElements": [
                {
                  "type": "text",
                  "name": "q1",
                  "valueName": "q1Value"
                }
              ] }]
        }
      ]
    });
    const rootPanel = <QuestionPanelDynamicModel>survey.getQuestionByName("rootPanel");
    const innerPanel = <QuestionPanelDynamicModel>rootPanel.panels[0].getQuestionByName("innerPanel");
    expect(innerPanel.panelCount, "There are 5 inner panels").toBe(5);
    innerPanel.panels[0].getQuestionByName("q1").value = 10;
    expect(innerPanel.panelCount, "There are still 5 inner panels").toBe(5);
    expect(survey.data, "set value in the first inner panel").toEqual({ rootPanel: [{ innerPanel: [{ q1Value: 10 }, {}, {}, {}, {}] }] });
  });
  test("Removing panels in the nested panel, Bug#10739", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "paneldynamic",
          "name": "rootPanel",
          "panelCount": 1,
          "templateElements": [
            {
              "type": "text",
              "name": "q1",
            },
            {
              "type": "paneldynamic",
              "name": "innerPanel",
              "panelCount": 2,
              "templateElements": [
                {
                  "type": "text",
                  "name": "q2"
                }
              ] }]
        }
      ]
    });
    const rootPanel = <QuestionPanelDynamicModel>survey.getQuestionByName("rootPanel");
    const innerPanel = <QuestionPanelDynamicModel>rootPanel.panels[0].getQuestionByName("innerPanel");
    expect(innerPanel.panelCount, "There are 2 inner panels").toBe(2);
    innerPanel.removePanel(0);
    expect(innerPanel.panelCount, "There is 1 inner panel").toBe(1);
    innerPanel.removePanel(0);
    expect(innerPanel.panelCount, "There is no inner panel").toBe(0);
    const q1 = rootPanel.panels[0].getQuestionByName("q1");
    q1.value = 10;
    expect(innerPanel.panelCount, "There is still no inner panel").toBe(0);
  });
  test("ProcessValue.hasValue to access panel array in design mode", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "q1",
          templateElements: [
            {
              type: "text",
              name: "a",
            },
            {
              type: "text",
              name: "b",
            }
          ],
        },
        { type: "text", name: "q2" }
      ]
    });
    survey.setDesignMode(true);
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    const q2Context = q2.getValueGetterContext();
    const processValue = new ProcessValue(q2Context);
    expect(processValue.hasValue("q1[0].a"), "there is a question a").toBe(true);
    expect(processValue.hasValue("q1[0].c"), "there is no question c").toBe(false);
    panel.panelCount = 0;
    expect(processValue.hasValue("q1[0].a"), "there is a question a, #2").toBe(true);
    expect(processValue.hasValue("q1[0].c"), "there is no question c, #2").toBe(false);
  });
  test("Exception on validation panel dynamic if questions in validation are not exists", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "paneldynamic",
          "name": "panel1",
          "titleLocation": "top",
          "templateElements": [
            {
              "type": "matrixdynamic",
              "name": "matrix1",
              "validators": [
                {
                  "type": "expression",
                  "expression": "{panel.nonfound3} = sum({panel.nonfound2},{panel.nonfound1})"
                }
              ],
              "columns": [
                {
                  "name": "col1",
                  "cellType": "text",
                  "validators": [
                    {
                      "type": "expression",
                      "expression": "{row.col1} <> 0"
                    }
                  ],
                  "totalType": "sum"
                },
                {
                  "name": "col2",
                  "cellType": "text",
                  "validators": [
                    {
                      "type": "expression",
                      "expression": "{row.col2} <> 0"
                    }
                  ],
                  "totalType": "sum"
                }
              ],
              "cellType": "text",
              "rowCount": 1,
              "minRowCount": 1,
            }
          ],
          "panelCount": 1,
          "minPanelCount": 1,
        }
      ],
      "checkErrorsMode": "onValueChanged"
    });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel1");
    const matrix = panel.panels[0].getQuestionByName("matrix1");
    const row = matrix.visibleRows[0];
    const cellQuestion = row.cells[0].question;
    cellQuestion.value = 10;
    expect(cellQuestion.errors.length, "There is no errors on").toBe(0);
  });

  test("question valueName vs two paneldynamic & question triggers", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "paneldynamic",
          name: "panel1",
          valueName: "panelA",
          panelCount: 2,
          templateElements: [
            { name: "col1", type: "text", resetValueIf: "{panel.col2} = 'a'" },
            { name: "col2", type: "radiogroup", choices: ["a", "b"] }
          ]
        },
        { type: "paneldynamic",
          name: "panel2",
          valueName: "panelA",
          panelCount: 2,
          templateElements: [
            { name: "col2", type: "radiogroup", choices: ["a", "b"] },
            { name: "col3", type: "text", resetValueIf: "{panel.col2} = 'a'" },
            { name: "col4", type: "text" }
          ]
        },
        { type: "paneldynamic",
          name: "panel3",
          valueName: "panelA",
          panelCount: 2,
          templateElements: [
            { name: "col5", type: "text", resetValueIf: "{panel.col2} = 'a'" }
          ]
        }
      ]
    });
    const panel1 = <QuestionPanelDynamicModel>survey.getQuestionByName("panel1");
    const panel2 = <QuestionPanelDynamicModel>survey.getQuestionByName("panel2");
    const panel3 = <QuestionPanelDynamicModel>survey.getQuestionByName("panel3");
    panel1.panels[0].getQuestionByName("col1").value = "m1_r1_col1";
    panel1.panels[1].getQuestionByName("col1").value = "m1_r2_col1";
    panel2.panels[0].getQuestionByName("col3").value = "m2_r1_col2";
    panel2.panels[1].getQuestionByName("col3").value = "m2_r2_col2";
    panel3.panels[0].getQuestionByName("col5").value = "m3_r1_col5";
    panel3.panels[1].getQuestionByName("col5").value = "m3_r2_col5";
    panel1.panels[0].getQuestionByName("col2").value = "a";
    panel2.panels[1].getQuestionByName("col2").value = "a";
    expect(panel1.panels[0].getQuestionByName("col1").isEmpty(), "Check value for panel1, row1, col1").toBe(true);
    expect(panel1.panels[1].getQuestionByName("col1").isEmpty(), "Check value for panel1, row2, col1").toBe(true);
    expect(panel2.panels[0].getQuestionByName("col3").isEmpty(), "Check value for panel2, row1, col3").toBe(true);
    expect(panel2.panels[1].getQuestionByName("col3").isEmpty(), "Check value for panel2, row2, col3").toBe(true);
    expect(panel3.panels[0].getQuestionByName("col5").isEmpty(), "Check value for panel3, row1, col5").toBe(true);
    expect(panel3.panels[1].getQuestionByName("col5").isEmpty(), "Check value for panel3, row2, col5").toBe(true);
  });

  test("question valueName vs matrixdynamic and paneldynamic & question triggers", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "matrixdynamic",
          name: "matrix1",
          valueName: "panelA",
          rowCount: 2,
          columns: [
            { name: "col1", type: "text", resetValueIf: "{row.col2} = 'a'" },
            { name: "col2", type: "radiogroup", choices: ["a", "b"] }
          ]
        },
        { type: "paneldynamic",
          name: "panel2",
          valueName: "panelA",
          panelCount: 2,
          templateElements: [
            { name: "col2", type: "radiogroup", choices: ["a", "b"] },
            { name: "col3", type: "text", resetValueIf: "{panel.col2} = 'a'" },
            { name: "col4", type: "text" }
          ]
        },
        { type: "paneldynamic",
          name: "panel3",
          valueName: "panelA",
          panelCount: 2,
          templateElements: [
            { name: "col5", type: "text", resetValueIf: "{panel.col2} = 'a'" }
          ]
        }
      ]
    });
    const matrix1 = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix1");
    const panel2 = <QuestionPanelDynamicModel>survey.getQuestionByName("panel2");
    const panel3 = <QuestionPanelDynamicModel>survey.getQuestionByName("panel3");
    matrix1.visibleRows[0].getQuestionByName("col1").value = "m1_r1_col1";
    matrix1.visibleRows[1].getQuestionByName("col1").value = "m1_r2_col1";
    panel2.panels[0].getQuestionByName("col3").value = "m2_r1_col2";
    panel2.panels[1].getQuestionByName("col3").value = "m2_r2_col2";
    panel3.panels[0].getQuestionByName("col5").value = "m3_r1_col5";
    panel3.panels[1].getQuestionByName("col5").value = "m3_r2_col5";
    matrix1.visibleRows[0].getQuestionByName("col2").value = "a";
    panel2.panels[1].getQuestionByName("col2").value = "a";
    expect(matrix1.visibleRows[0].getQuestionByName("col1").isEmpty(), "Check value for panel1, row1, col1").toBe(true);
    expect(matrix1.visibleRows[1].getQuestionByName("col1").isEmpty(), "Check value for matrix, row2, col1").toBe(true);
    expect(panel2.panels[0].getQuestionByName("col3").isEmpty(), "Check value for panel2, row1, col3").toBe(true);
    expect(panel2.panels[1].getQuestionByName("col3").isEmpty(), "Check value for panel2, row2, col3").toBe(true);
    expect(panel3.panels[0].getQuestionByName("col5").isEmpty(), "Check value for panel3, row1, col5").toBe(true);
    expect(panel3.panels[1].getQuestionByName("col5").isEmpty(), "Check value for panel3, row2, col5").toBe(true);
  });

  test("paneldynamic shared question value", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "paneldynamic",
          name: "panel1",
          panelCount: 2,
          templateElements: [
            { name: "q1", type: "text", valueName: "qa" },
            { name: "q2", type: "text", valueName: "qa" }
          ]
        }
      ]
    });

    const panel1 = <QuestionPanelDynamicModel>survey.getQuestionByName("panel1");

    const q1 = panel1.panels[0].getQuestionByName("q1");
    const q2 = panel1.panels[0].getQuestionByName("q2");

    q1.value = "value1";
    expect(q2.value, "q2.value equals to q1.value").toBe("value1");
  });

  test("paneldynamic + radiogroup with showOtherItem clears required error on other value change, Bug#10964", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "q1",
          panelCount: 1,
          templateElements: [
            {
              type: "radiogroup",
              name: "q2",
              choices: ["Item 1", "Item 2", "Item 3"],
              showOtherItem: true,
              isRequired: true
            }
          ]
        }
      ]
    });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("q1");
    const radioQ = <QuestionRadiogroupModel>panel.panels[0].getQuestionByName("q2");
    radioQ.value = "other";
    survey.tryComplete();
    expect(radioQ.errors.length, "Required error is shown for the radiogroup").toBe(1);
    radioQ.otherValue = "my other value";
    expect(radioQ.errors.length, "Required error is cleared after entering the Other value").toBe(0);
  });
  test("paneldynamic + checkErrorsMode: onValueChanged + radiogroup with showOtherItem clears required error on other value change, Bug#10964", () => {
    const survey = new SurveyModel({
      checkErrorsMode: "onValueChanged",
      elements: [
        {
          type: "paneldynamic",
          name: "q1",
          panelCount: 1,
          templateElements: [
            {
              type: "radiogroup",
              name: "q2",
              choices: ["Item 1", "Item 2", "Item 3"],
              showOtherItem: true,
              isRequired: true
            }
          ]
        }
      ]
    });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("q1");
    const radioQ = <QuestionRadiogroupModel>panel.panels[0].getQuestionByName("q2");
    radioQ.value = "other";
    radioQ.otherValue = "my other value 1";
    expect(radioQ.errors.length, "There is no errors").toBe(0);
    radioQ.otherValue = "";
    expect(radioQ.errors.length, "Required error is shown for the radiogroup").toBe(1);
    radioQ.otherValue = "my other value 2";
    expect(radioQ.errors.length, "Required error is cleared after entering the Other value").toBe(0);
  });
  test("Fire onValueChanged, onDynamicPanelValueChanging, onDynamicPanelValueChanged on comment change, bug#11001", () => {
    const survey = new SurveyModel({
      pages: [
        {
          name: "page1",
          elements: [
            {
              type: "paneldynamic",
              name: "question1",
              panelCount: 1,
              templateElements: [
                {
                  type: "radiogroup",
                  name: "question2",
                  showCommentArea: true,
                  choices: ["Item 1", "Item 2", "Item 3"],
                },
              ],
            },
          ],
        },
      ],
    });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("question1");
    const radioQ = <QuestionRadiogroupModel>panel.panels[0].getQuestionByName("question2");

    const firedEvents: Array<{ event: string, name: string }> = [];
    survey.onValueChanged.add((sender, options) => {
      firedEvents.push({ event: "onValueChanged", name: options.name });
    });
    survey.onDynamicPanelValueChanging.add((sender, options) => {
      firedEvents.push({ event: "onDynamicPanelValueChanging", name: options.name });
    });
    survey.onDynamicPanelValueChanged.add((sender, options) => {
      firedEvents.push({ event: "onDynamicPanelValueChanged", name: options.name });
    });

    radioQ.value = "Item 1";
    expect(firedEvents, "All three events fire on value change with correct name").toEqual([
      { event: "onDynamicPanelValueChanging", name: "question2" },
      { event: "onValueChanged", name: "question1" },
      { event: "onDynamicPanelValueChanged", name: "question2" }
    ]);

    firedEvents.length = 0;
    radioQ.comment = "some comment";
    expect(firedEvents, "All three events fire on comment change with comment suffix in name").toEqual([
      { event: "onDynamicPanelValueChanging", name: "question2-Comment" },
      { event: "onValueChanged", name: "question1" },
      { event: "onDynamicPanelValueChanged", name: "question2-Comment" }
    ]);
  });

  test("paneldynamic + checkErrorsMode: onValueChanged + expression validator should not show error on new panel, bug##11002", () => {
    const survey = new SurveyModel({
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
              isRequired: true
            },
            {
              type: "slider",
              name: "q2",
              isRequired: true,
              validators: [
                {
                  type: "expression",
                  text: "Value must be >= 75",
                  expression: "{panel.q2} >= 75"
                }
              ],
              min: 70,
              max: 99,
              step: 0.1
            }
          ]
        }
      ]
    });
    const panelDynamic = <QuestionPanelDynamicModel>survey.getQuestionByName("panel1");
    const slider0 = panelDynamic.panels[0].getQuestionByName("q2");
    expect(slider0.errors.length, "No errors initially in the first panel's slider").toBe(0);
    panelDynamic.addPanelUI();
    expect(panelDynamic.panels.length, "Two panels now").toBe(2);
    const slider1 = panelDynamic.panels[1].getQuestionByName("q2");
    expect(slider1.errors.length, "No errors in the new panel's slider after adding a panel").toBe(0);
  });
});
