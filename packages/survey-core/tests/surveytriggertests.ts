import {
  Trigger,
  ISurveyTriggerOwner,
  SurveyTriggerVisible,
  SurveyTriggerSetValue,
  SurveyTriggerRunExpression,
  SurveyTriggerCopyValue
} from "../src/trigger";
import { SurveyModel } from "../src/survey";
import { settings } from "../src/settings";
import { Serializer } from "../src/jsonobject";
import { QuestionMatrixModel } from "../src/question_matrix";
import { FunctionFactory } from "../src/functionsfactory";
import { ExpressionRunner } from "../src/expressions/expressionRunner";
import { ComponentCollection } from "../src/question_custom";

import { describe, test, expect } from "vitest";
describe("Triggers", () => {
  class TriggerTester extends Trigger {
    constructor(
    public succFunc: Function = null,
    public failureFunc: Function = null
    ) {
      super();
    }
    protected onSuccess() {
      if (this.succFunc)this.succFunc();
    }
    protected onFailure() {
      if (this.failureFunc)this.failureFunc();
    }
  }
  class SurveyTriggerVisibleOwnerTester implements ISurveyTriggerOwner {
    public items = [
      { name: "Item1", visible: false },
      { name: "Item2", visible: true },
    ];
    getObjects(pages: string[], questions: string[]): any[] {
      return this.items;
    }
    setCompleted() {}
    canBeCompleted(trigger: Trigger, isCompleted: boolean) {}
    triggerExecuted(trigger: Trigger): void {}
    setTriggerValue(name: string, value: any, isVariable: boolean) {}
    copyTriggerValue(name: string, fromName: string, copyDisplayValue: boolean): void {}
    focusQuestion(name: string): boolean {
      return true;
    }
  }

  test("Check trigger operations", () => {
    var trigger = new TriggerTester(null);
    expect(trigger.operator, "The default is equal").toBe("equal");
    trigger.operator = "eq";
    expect(trigger.operator, "There is no operator 'eq'").toBe("equal");
    trigger.operator = "less";
    expect(trigger.operator, "It can be changed on 'less'").toBe("less");
  });
  test("Simple custom trigger", () => {
    var counterSuccess = 0;
    var counterFalure = 0;
    var trigger = new TriggerTester(
      function() {
        counterSuccess++;
      },
      function() {
        counterFalure++;
      }
    );
    trigger.value = 6;
    trigger.check(5);
    expect(counterSuccess, "5 != 6").toBe(0);
    expect(counterFalure, "5 != 6").toBe(1);
    trigger.check(6);
    expect(counterSuccess, "6 == 6").toBe(1);
    expect(counterFalure, "6 == 6").toBe(1);
    trigger.value = 2;
    trigger.operator = "contains";
    trigger.check([]);
    expect(counterSuccess, "2 in []").toBe(1);
    expect(counterFalure, "2 in []").toBe(2);
    trigger.check([2, 3]);
    expect(counterSuccess, "2 in [2, 3]").toBe(2);
    expect(counterFalure, "2 not in [2, 3]").toBe(2);

    trigger.value = 2;
    trigger.operator = "notcontains";
    trigger.check([]);
    expect(counterSuccess, "2 not in []").toBe(3);
    expect(counterFalure, "2 not in []").toBe(2);
    trigger.check([2, 3]);
    expect(counterSuccess, "2 not in []").toBe(3);
    expect(counterFalure, "2 not in [2, 3]").toBe(3);
  });
  test("Visibility trigger", () => {
    var owner = new SurveyTriggerVisibleOwnerTester();
    var trigger = new SurveyTriggerVisible();
    trigger.setOwner(owner);
    expect(owner.items[0].visible, "By default the item.visible = false").toBe(false);
    trigger.value = 10;
    trigger.check(10);
    expect(owner.items[0].visible, "The trigger should succeed").toBe(true);
    trigger.check(11);
    expect(owner.items[0].visible, "The trigger should failed").toBe(false);
  });

  test("setvalue trigger", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "text",
          name: "q1",
        },
        {
          type: "matrixdynamic",
          name: "matrix",
          columns: [
            {
              name: "Col1",
            },
            {
              name: "Col2",
            },
          ],
          choices: [1, 2, 3],
        },
      ],
      triggers: [
        {
          type: "setvalue",
          expression: "{matrix[0].Col1} = 1",
          setToName: "q1",
          setValue: "exec",
        },
      ],
    });
    survey.setValue("matrix", [{ Col1: 1 }, { Col2: 2 }]);
    expect(survey.getValue("q1"), "Trigger executed correctly").toBe("exec");
    survey.setValue("q1", "notExec");
    survey.setValue("matrix", [{ Col1: 1, Col2: 1 }, { Col2: 2 }]);
    expect(survey.getValue("q1"), "Trigger not executed correctly").toBe("notExec");
  });
  test("Clear seValue on setToName property in design mode", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "text",
          name: "q1",
        },
        {
          type: "text",
          name: "q2",
        },
      ],
      triggers: [
        {
          type: "setvalue",
          setToName: "q1",
          setValue: "1",
        },
      ],
    });
    const trigger = <SurveyTriggerSetValue>survey.triggers[0];
    expect(trigger.setToName).toBe("q1");
    expect(trigger.setValue).toBe("1");
    trigger.setToName = "q2";
    expect(trigger.setToName).toBe("q2");
    expect(trigger.setValue).toBe("1");
    survey.setDesignMode(true);
    trigger.setToName = "q1";
    expect(trigger.setToName).toBe("q1");
    expect(trigger.setValue).toBeFalsy();
  });
  test("On trigger executed", () => {
    const survey = new SurveyModel({
      pages: [
        {
          elements: [
            {
              type: "text",
              name: "q1",
            },
            {
              type: "text",
              name: "q2",
            }
          ]
        },
        {
          elements: [{ type: "text", name: "q3" }]
        }
      ],
      triggers: [
        {
          type: "setvalue",
          setToName: "q2",
          expression: "{q1} = 2",
          setValue: 1,
        },
        {
          type: "complete",
          expression: "{q1} = 3"
        },
      ],
    });
    const triggers = [];
    survey.onTriggerExecuted.add((sender, options) => {
      triggers.push(options.trigger.getType());
    });
    survey.setValue("q1", 2);
    survey.setValue("q1", 3);
    survey.nextPage();
    expect(triggers).toEqual(["setvaluetrigger", "completetrigger"]);
  });
  test("On trigger executed && executeCompleteTriggerOnValueChanged=true", () => {
    settings.executeCompleteTriggerOnValueChanged = true;
    const survey = new SurveyModel({
      pages: [
        { elements: [{ type: "text", name: "q1" }] },
        { elements: [{ type: "text", name: "q2" }] }
      ],
      triggers: [
        {
          type: "complete",
          expression: "{q1} = 3"
        },
      ],
    });
    const triggers = [];
    let isCompleteEvent = false;
    let completeTrigger;
    survey.onTriggerExecuted.add((sender, options) => {
      triggers.push(options.trigger.getType());
    });
    survey.onComplete.add((sender, options) => {
      isCompleteEvent = options.isCompleteOnTrigger;
      completeTrigger = options.completeTrigger;
    });
    survey.setValue("q1", 3);
    expect(survey.state).toBe("completed");
    expect(triggers).toEqual(["completetrigger"]);
    expect(isCompleteEvent).toBe(true);
    expect(completeTrigger.expression).toBe("{q1} = 3");
    settings.executeCompleteTriggerOnValueChanged = false;
  });
  test("On trigger executed && options.completeTrigger", () => {
    const survey = new SurveyModel({
      pages: [
        { elements: [{ type: "text", name: "q1" }] },
        { elements: [{ type: "text", name: "q2" }] }
      ],
      triggers: [
        {
          type: "complete",
          expression: "{q1} = 3"
        },
      ],
    });
    let isCompleteEvent = false;
    let completeTrigger;
    survey.onComplete.add((sender, options) => {
      isCompleteEvent = options.isCompleteOnTrigger;
      completeTrigger = options.completeTrigger;
    });
    survey.setValue("q1", 3);
    expect(survey.state).toBe("running");
    survey.tryComplete();
    expect(survey.state).toBe("completed");
    expect(isCompleteEvent).toBe(true);
    expect(completeTrigger.expression).toBe("{q1} = 3");
  });
  test("Show complete button instead of next if complete trigger is going to be executed", () => {
    const survey = new SurveyModel({
      pages: [
        {
          elements: [
            {
              type: "text",
              name: "q1",
            }
          ]
        },
        {
          elements: [{ type: "text", name: "q3" }]
        }
      ],
      triggers: [
        {
          type: "complete",
          expression: "{q1} = 3"
        },
      ],
    });
    expect(survey.isShowNextButton, "#1-next").toBe(true);
    expect(survey.isCompleteButtonVisible, "#1-complete").toBe(false);
    survey.setValue("q1", 1);
    expect(survey.isShowNextButton, "#2-next").toBe(true);
    expect(survey.isCompleteButtonVisible, "#2-complete").toBe(false);
    survey.setValue("q1", 3);
    expect(survey.isShowNextButton, "#3-next").toBe(false);
    expect(survey.isCompleteButtonVisible, "#3-complete").toBe(true);
    survey.setValue("q1", 5);
    expect(survey.isShowNextButton, "#4-next").toBe(true);
    expect(survey.isCompleteButtonVisible, "#4-complete").toBe(false);
    survey.setValue("q1", 3);
    expect(survey.isShowNextButton, "#5-next").toBe(false);
    expect(survey.isCompleteButtonVisible, "#5-complete").toBe(true);
    survey.clear();
    expect(survey.isShowNextButton, "#6-next").toBe(true);
    expect(survey.isCompleteButtonVisible, "#6-complete").toBe(false);
    settings.changeNavigationButtonsOnCompleteTrigger = false;
    survey.setValue("q1", 3);
    expect(survey.isShowNextButton, "#7-next").toBe(true);
    expect(survey.isCompleteButtonVisible, "#7-complete").toBe(false);
    settings.changeNavigationButtonsOnCompleteTrigger = true;
  });
  test("Do not execute copy and set trigger on page changed", () => {
    const survey = new SurveyModel({
      pages: [
        {
          elements: [
            { type: "text", name: "q1" },
            { type: "boolean", name: "q2", valueTrue: "yes", valueFalse: "no" },
            { type: "text", name: "q3" },
          ]
        },
        {
          elements: [{ type: "text", name: "q4" }]
        }
      ],
      "triggers": [
        {
          "type": "copyvalue",
          "expression": "{q2} = 'yes' and {q1} notempty",
          "fromName": "q1",
          "setToName": "q3"
        },
        {
          "type": "setvalue",
          "expression": "{q2} = 'no'",
          "setToName": "q3"
        }
      ],
    });
    const data = { q1: "abc", q2: "no", q3: "def" };
    survey.data = data;
    survey.nextPage();
    survey.doComplete();
    expect(survey.data, "We do not change anything").toEqual(data);
  });
  test("copyvalue from checkbox", () => {
    const survey = new SurveyModel({
      pages: [
        {
          elements: [
            { type: "checkbox", name: "q1",
              choices: [{ value: 1, text: "Item1" }, { value: 2, text: "Item2" }, { value: 3, text: "Item3" }] },
            { type: "text", name: "q2" },
          ]
        }
      ],
      "triggers": [
        {
          "type": "copyvalue",
          "expression": "{q1} notempty",
          "fromName": "q1",
          "setToName": "q2",
          "copyDisplayValue": true
        }
      ],
    });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    q1.value = [1, 3];
    expect(q2.value, "Copy value correctly").toEqual("Item1, Item3");
    q1.value = [1, 2];
    expect(q2.value, "Copy value correctly").toEqual("Item1, Item2");
  });
  test("copyvalue without expression, bug#7030", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2" },
        { type: "text", name: "q3" }

      ],
      triggers: [
        {
          type: "copyvalue",
          fromName: "q1",
          setToName: "q2"
        }
      ],
    });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    const q3 = survey.getQuestionByName("q3");
    q1.value = "A";
    expect(q2.value, "Copy value correctly").toBe("A");
    q2.value = "B";
    q3.value = "C";
    expect(q2.value, "Do not copy value").toBe("B");
  });
  // Skipped: pending product decision - see https://github.com/surveyjs/survey-library/issues/10192
  test.skip("copyvalue vs expression on changing fromName #10192", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2" },
        { type: "text", name: "q3" },
        { type: "text", name: "q4" }
      ],
      triggers: [
        {
          type: "copyvalue",
          expression: "{q4} notempty",
          fromName: "q1",
          setToName: "q2"
        }
      ],
    });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    const q3 = survey.getQuestionByName("q3");
    const q4 = survey.getQuestionByName("q4");
    q1.value = "A";
    expect(q2.value, "value 1").toBeUndefined();
    q4.value = "B";
    expect(q2.value, "value 2").toBe("A");
    q1.value = "C";
    expect(q2.value, "value 3").toBe("C");
    q2.value = "D";
    expect(q2.value, "value 4").toBe("D");
    q3.value = "E";
    expect(q2.value, "value 5").toBe("D");
    q1.value = "F";
    expect(q2.value, "value 6").toBe("F");
    q4.value = "";
    expect(q2.value, "value 7").toBe("F");
    q1.value = "G";
    expect(q2.value, "value 8").toBe("F");
  });

  test("Execute trigger on complete", () => {
    class TriggerExprssionTester extends SurveyTriggerRunExpression {
      public getType(): string {
        return "runexpression2trigger";
      }
      protected canBeExecuted(isOnNextPage: boolean): boolean {
        return isOnNextPage;
      }
      protected canBeExecutedOnComplete(): boolean {
        return true;
      }
    }
    Serializer.addClass("runexpression2trigger", [],
      () => { return new TriggerExprssionTester(); }, "runexpressiontrigger");

    const survey = new SurveyModel({
      pages: [
        {
          elements: [
            { type: "text", name: "q1" },
          ]
        },
        {
          elements: [
            { type: "text", name: "q4" },
            { type: "boolean", name: "q2", valueTrue: "yes", valueFalse: "no" },
            { type: "text", name: "q3" }
          ]
        }
      ],
      "triggers": [
        {
          "type": "runexpression2",
          "expression": "{q2} = 'yes' and {q1} notempty",
          "runExpression": "{q1} * 10",
          "setToName": "q3"
        }
      ],
    });
    survey.setValue("q1", 5);
    survey.nextPage();
    survey.setValue("q2", "yes");
    expect(survey.data, "trigger is not executed yet").toEqual({ q1: 5, q2: "yes" });
    survey.doComplete();
    expect(survey.data, "trigger is executed").toEqual({ q1: 5, q2: "yes", q3: 50 });
    Serializer.removeClass("runexpression2trigger");
  });

  test("Trigger with simple matrix", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "matrix", name: "q1", columns: ["1", "2", "3"], rows: ["a", "b", "c"] },
        { type: "text", name: "q2" },
      ],
      triggers: [
        {
          "type": "runexpression",
          "expression": "{q1.a} notempty and {q1.b} notempty and {q1.c} notempty",
          "runExpression": "{q1.a} + {q1.b} + {q1.c}",
          "setToName": "q2"
        }
      ],
    });
    const q1 = <QuestionMatrixModel>survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    expect(q1.value, "#1").toBeUndefined();
    q1.value = { a: 1 };
    expect(q2.value, "#2").toBeUndefined();
    q1.value = { a: 1, b: 2, c: 3 };
    expect(q2.value, "#3").toBe(6);
    q1.value = { a: 3, b: 2, c: 3 };
    expect(q2.value, "#4").toBe(8);
    q1.value = { b: 2, c: 3 };
    expect(q2.value, "#5").toBe(8);
  });
  test("Show complete button instead of next for single matrix, bug#6152", () => {
    const survey = new SurveyModel({
      pages: [
        {
          elements: [
            {
              type: "matrix",
              name: "q1",
              columns: [1, 2, 3],
              rows: ["row1", "row2", "row3"]
            }
          ]
        },
        {
          elements: [
            {
              type: "text",
              name: "q2"
            }
          ]
        }
      ],
      triggers: [
        {
          type: "complete",
          expression:
          "{q1.row2} = 1"
        }
      ]
    });
    expect(survey.isShowNextButton, "#1-next").toBe(true);
    expect(survey.isCompleteButtonVisible, "#1-complete").toBe(false);
    const q1 = survey.getQuestionByName("q1");
    q1.value = { row2: 1 };
    expect(survey.isShowNextButton, "#2-next").toBe(false);
    expect(survey.isCompleteButtonVisible, "#2-complete").toBe(true);
    q1.value = { row1: 1, row2: 1 };
    expect(survey.isShowNextButton, "#3-next").toBe(false);
    expect(survey.isCompleteButtonVisible, "#3-complete").toBe(true);
    q1.value = { row1: 1 };
    expect(survey.isShowNextButton, "#4-next").toBe(true);
    expect(survey.isCompleteButtonVisible, "#4-complete").toBe(false);
    q1.value = { row1: 1, row2: 2 };
    expect(survey.isShowNextButton, "#5-next").toBe(true);
    expect(survey.isCompleteButtonVisible, "#5-complete").toBe(false);
    q1.value = { row1: 1, row2: 1 };
    expect(survey.isShowNextButton, "#6-next").toBe(false);
    expect(survey.isCompleteButtonVisible, "#6-complete").toBe(true);
    q1.value = { row1: 2, row2: 1, row3: 2 };
    expect(survey.isShowNextButton, "#7-next").toBe(false);
    expect(survey.isCompleteButtonVisible, "#7-complete").toBe(true);
  });
  test("skip trigger for showOtherItem, Bug#6792", () => {
    const survey = new SurveyModel({
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "radiogroup",
              "name": "question1",
              "choices": [
                "Item 1",
                "Item 2",
                "Item 3"
              ],
              "showOtherItem": true
            }
          ]
        },
        {
          "name": "page2",
          "elements": [
            {
              "type": "boolean",
              "name": "question2"
            }
          ]
        }
      ],
      "triggers": [
        {
          "type": "skip",
          "expression": "{question1} notempty",
          "gotoName": "question2"
        }
      ] });
    const q1 = survey.getQuestionByName("question1");
    q1.value = "other";
    expect(survey.currentPageNo, "We are staying on the same page").toBe(0);
  });
  test("complete trigger for showOtherItem, Bug#6792", () => {
    const oldSettings = settings.triggers.executeCompleteOnValueChanged;
    settings.triggers.executeCompleteOnValueChanged = true;
    const survey = new SurveyModel({
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "radiogroup",
              "name": "question1",
              "choices": [
                "Item 1",
                "Item 2",
                "Item 3"
              ],
              "showOtherItem": true
            }
          ]
        },
        {
          "name": "page2",
          "elements": [
            {
              "type": "boolean",
              "name": "question2"
            }
          ]
        }
      ],
      "triggers": [
        {
          "type": "complete",
          "expression": "{question1} notempty"
        }
      ] });
    const q1 = survey.getQuestionByName("question1");
    q1.value = "other";
    expect(survey.currentPageNo, "We are staying on the same page").toBe(0);
    expect(survey.state, "Survey is not completed").toBe("running");
    settings.triggers.executeCompleteOnValueChanged = oldSettings;
  });
  test("complete trigger and next/complete buttons, Bug#6970", () => {
    const survey = new SurveyModel({
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "text",
              "name": "question1"
            }
          ]
        },
        {
          "name": "page2",
          "elements": [
            {
              "type": "text",
              "name": "question2"
            }
          ]
        },
        {
          "name": "page3",
          "elements": [
            {
              "type": "text",
              "name": "question3"
            }
          ]
        }
      ],
      "triggers": [
        {
          "type": "complete",
          "expression": "{question2} notempty"
        }
      ] });
    const q2 = survey.getQuestionByName("question2");
    survey.nextPage();
    expect(survey.isCompleteButtonVisible, "complete button is invisible, #1").toBe(false);
    expect(survey.isShowNextButton, "next button is visible, #1").toBe(true);
    q2.value = "a";
    expect(survey.isCompleteButtonVisible, "complete button is visible, #2").toBe(true);
    expect(survey.isShowNextButton, "next button is invisible, #2").toBe(false);
    survey.prevPage();
    expect(survey.isCompleteButtonVisible, "complete button is invisible, #3").toBe(false);
    expect(survey.isShowNextButton, "next button is visible, #3").toBe(true);
    survey.nextPage();
    expect(survey.isCompleteButtonVisible, "complete button is visible, #4").toBe(true);
    expect(survey.isShowNextButton, "next button is invisible, #4").toBe(false);
  });
  function createSurveyWithCompleteTriggerAndRequiredQuestions(): SurveyModel {
    return new SurveyModel({
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "radiogroup",
              "name": "question1",
              "title": "Question 1",
              "isRequired": true,
              "choices": ["A", "B"]
            }
          ]
        },
        {
          "name": "page2",
          "elements": [
            {
              "type": "text",
              "name": "question2",
              "title": "Question 2",
              "isRequired": true
            }
          ]
        }
      ],
      "triggers": [
        {
          "type": "complete",
          "expression": "{question1} = 'A'"
        }
      ]
    });
  }
  test("complete trigger and next/complete buttons on setting survey.data, Bug#11935", () => {
    const survey = createSurveyWithCompleteTriggerAndRequiredQuestions();
    expect(survey.isCompleteButtonVisible, "complete button is invisible, #1").toBe(false);
    expect(survey.isShowNextButton, "next button is visible, #1").toBe(true);
    survey.data = { question1: "A" };
    expect(survey.isCompleteButtonVisible, "complete button is visible, #2").toBe(true);
    expect(survey.isShowNextButton, "next button is invisible, #2").toBe(false);
    survey.data = { question1: "B" };
    expect(survey.isCompleteButtonVisible, "complete button is invisible, #3").toBe(false);
    expect(survey.isShowNextButton, "next button is visible, #3").toBe(true);
  });
  test("complete trigger and survey.validate() on setting survey.data, Bug#11935", () => {
    const survey = createSurveyWithCompleteTriggerAndRequiredQuestions();
    survey.data = { question1: "A" };
    expect(survey.validate(true, false), "complete trigger is executed, question2 is not required to be answered").toBe(true);
    expect(survey.getQuestionByName("question2").errors.length, "there is no errors in question2").toBe(0);
    survey.data = { question1: "B" };
    expect(survey.validate(true, false), "complete trigger is not executed, question2 is empty").toBe(false);
  });
  test("complete trigger and survey.validate() with focusing the first error on setting survey.data, Bug#11935", () => {
    const survey = createSurveyWithCompleteTriggerAndRequiredQuestions();
    survey.data = { question1: "A" };
    expect(survey.validate(true, true), "complete trigger is executed").toBe(true);
    expect(survey.currentPageNo, "We are staying on the first page").toBe(0);
  });
  test("complete trigger and survey.validate() on changing the question value, Bug#11935", () => {
    const survey = createSurveyWithCompleteTriggerAndRequiredQuestions();
    survey.getQuestionByName("question1").value = "A";
    expect(survey.isCompleteButtonVisible, "complete button is visible").toBe(true);
    expect(survey.validate(true, false), "complete trigger is executed, question2 is not required to be answered").toBe(true);
    expect(survey.tryComplete(), "survey can be completed").toBe(true);
    expect(survey.state, "survey is completed").toBe("completed");
  });
  test("complete trigger and survey.validate() on survey.mergeData(), Bug#11935", () => {
    const survey = createSurveyWithCompleteTriggerAndRequiredQuestions();
    survey.mergeData({ question1: "A" });
    expect(survey.state, "survey is not completed on merging data").toBe("running");
    expect(survey.isCompleteButtonVisible, "complete button is visible").toBe(true);
    expect(survey.validate(true, false), "complete trigger is executed").toBe(true);
    survey.mergeData({ question1: "B" });
    expect(survey.isCompleteButtonVisible, "complete button is invisible").toBe(false);
    expect(survey.validate(true, false), "complete trigger is not executed").toBe(false);
  });
  test("complete trigger and survey.validate() on survey.setValue(), Bug#11935", () => {
    const survey = createSurveyWithCompleteTriggerAndRequiredQuestions();
    survey.setValue("question1", "A");
    expect(survey.isCompleteButtonVisible, "complete button is visible").toBe(true);
    expect(survey.validate(true, false), "complete trigger is executed, question2 is not required to be answered").toBe(true);
  });
  function spyOnTriggerKeys(survey: SurveyModel): { counter: number, valueNames: Array<string> } {
    const res = { counter: 0, valueNames: new Array<string>() };
    const surveyAny = <any>survey;
    const prevGetTriggerKeys = surveyAny.getTriggerKeys;
    const prevGetValue = survey.getValue;
    surveyAny.getTriggerKeys = function (...args: Array<any>) {
      res.counter++;
      survey.getValue = function (name: string): any {
        res.valueNames.push(name);
        return prevGetValue.call(survey, name);
      };
      try {
        return prevGetTriggerKeys.apply(survey, args);
      } finally {
        survey.getValue = prevGetValue;
      }
    };
    return res;
  }
  test("Do not build trigger keys on setting survey.data if there is no trigger that runs on setting data, Bug#11935", () => {
    const json = {
      elements: [
        { type: "text", name: "q1" },
        { type: "paneldynamic", name: "q2", valueName: "items", templateElements: [{ type: "text", name: "q2_1" }] },
        { type: "matrixdynamic", name: "q3", valueName: "items", columns: [{ name: "q2_1" }] }
      ]
    };
    let survey = new SurveyModel(json);
    let spy = spyOnTriggerKeys(survey);
    survey.data = { q1: "A", items: [{ q2_1: 1 }, { q2_1: 2 }] };
    survey.mergeData({ q1: "B" });
    expect(spy.counter, "there are no triggers").toBe(0);

    survey = new SurveyModel({ ...json, triggers: [{ type: "setvalue", expression: "{q1} = 'A'", setToName: "q4", setValue: 1 }] });
    spy = spyOnTriggerKeys(survey);
    survey.data = { q1: "A" };
    survey.mergeData({ q1: "B" });
    expect(spy.counter, "setvalue trigger doesn't run on setting data").toBe(0);
    expect(survey.getValue("q4"), "setvalue trigger is not executed").toBeUndefined();

    survey = new SurveyModel({ ...json, triggers: [{ type: "complete", expression: "{q1} = 'A'" }] });
    spy = spyOnTriggerKeys(survey);
    survey.data = { q1: "A", items: [{ q2_1: 1 }, { q2_1: 2 }] };
    expect(spy.counter, "complete trigger runs on setting data").toBe(1);
    expect(spy.valueNames, "a value shared by several questions is read once").toEqual(["q1", "items"]);
    expect(survey.isCompleteButtonVisible, "complete button is visible").toBe(true);
    expect(survey.validate(true, false), "complete trigger is executed").toBe(true);

    survey.mode = "display";
    survey.data = { q1: "B" };
    expect(spy.counter, "triggers do not run in display mode").toBe(1);
  });
  test("runexpression trigger and isNextPage", () => {
    let counter = 0;
    FunctionFactory.Instance.register("calcCust", function getCustValue(params
    ) {
      counter ++;
      const val = params[0];
      return !!val ? val + "_abc" : undefined;
    });
    const survey = new SurveyModel({
      pages: [
        {
          elements: [
            { type: "text", name: "q1" },
            { type: "text", name: "q2" },
            { type: "text", name: "q3" },
          ]
        },
        {
          elements: [
            { type: "text", name: "q4" },
          ],
        }
      ],
      triggers: [
        {
          "type": "runexpression",
          "expression": "{q1} empty or {q1} notempty",
          "runExpression": "calcCust({q1})",
          "setToName": "q2"
        }
      ],
    });
    expect(counter, "Calculate on loading").toBe(0);
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    const q3 = survey.getQuestionByName("q3");
    q1.value = "1";
    expect(counter, "counter #1").toBe(1);
    expect(q2.value, "value #1").toBe("1_abc");
    q3.value = "2";
    expect(counter, "counter #2").toBe(1);
    expect(q2.value, "value #2").toBe("1_abc");
    survey.nextPage();
    expect(counter, "counter #3").toBe(1);
    expect(q2.value, "value #3").toBe("1_abc");
    survey.doComplete();
    expect(counter, "counter #4").toBe(1);
    expect(q2.value, "value #4").toBe("1_abc");

    FunctionFactory.Instance.unregister("calcCust");
  });
  test("runexpression trigger and calculated values, Bug#8273 Case#1", () => {
    const survey = new SurveyModel({
      pages: [
        {
          elements: [
            { type: "text", name: "q1" },
            { type: "text", name: "q2" }
          ]
        }
      ],
      calculatedValues: [
        { name: "calc1", expression: "{q1} = 'abc'" }
      ],
      triggers: [
        {
          "type": "runexpression",
          "expression": "{calc1} = true",
          "runExpression": "10",
          "setToName": "q2"
        },
        {
          "type": "runexpression",
          "expression": "{calc1} = false",
          "runExpression": "20",
          "setToName": "q2"
        }
      ]
    });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    const calcVal = survey.calculatedValues[0];
    expect(calcVal.value, "calcValue.val #1").toBe(false);
    expect(q2.value, "q2.value #1").toBe(20);
    q1.value = "a";
    expect(calcVal.value, "calcValue.val #2").toBe(false);
    expect(q2.value, "q2.value #2").toBe(20);
    q1.value = "abc";
    expect(calcVal.value, "calcValue.val #3").toBe(true);
    expect(q2.value, "q2.value #3").toBe(10);
    q1.value = "abcd";
    expect(calcVal.value, "calcValue.val #4").toBe(false);
    expect(q2.value, "q2.value #4").toBe(20);
  });
  test("runexpression trigger and calculated values, Bug#8273 Case#2", () => {
    const survey = new SurveyModel({
      pages: [
        {
          elements: [
            { type: "text", name: "q1" },
            { type: "text", name: "q2" }
          ]
        }
      ],
      calculatedValues: [
        { name: "calcVal.1", expression: "{q1} = 'abc'" },
        { name: "calcVal.2", expression: "{q1} = 'd'" }
      ],
      triggers: [
        {
          "type": "runexpression",
          "expression": "{calcVal.1} = true",
          "runExpression": "10",
          "setToName": "q2"
        },
        {
          "type": "runexpression",
          "expression": "{calcVal.2} = true",
          "runExpression": "20",
          "setToName": "q2"
        }
      ]
    });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    const calcVal1 = survey.calculatedValues[0];
    const calcVal2 = survey.calculatedValues[1];
    expect(calcVal1.value, "calcVal1.val #1").toBe(false);
    expect(calcVal2.value, "calcVal2.val #1").toBe(false);
    expect(q2.value, "q2.value #1").toBeUndefined();
    q1.value = "a";
    expect(calcVal1.value, "calcVal1.val #2").toBe(false);
    expect(calcVal2.value, "calcVal2.val #2").toBe(false);
    expect(q2.value, "q2.value #2").toBeUndefined();
    q1.value = "abc";
    expect(calcVal1.value, "calcVal1.val #3").toBe(true);
    expect(calcVal2.value, "calcVal2.val #3").toBe(false);
    expect(q2.value, "q2.value #3").toBe(10);
    q1.value = "d";
    expect(calcVal1.value, "calcVal1.val #4").toBe(false);
    expect(calcVal2.value, "calcVal2.val #4").toBe(true);
    expect(q2.value, "q2.value #4").toBe(20);
  });
  test("copyvalue & custom function, Bug#10192, #1", () => {
    FunctionFactory.Instance.register("canCopyValue", (params) => {
      return params[0] === "copy";
    });
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2" },
        { type: "text", name: "q3" },
      ],
      triggers: [
        {
          "type": "copyvalue",
          "expression": "canCopyValue({q2})",
          "fromName": "q1",
          "setToName": "q3"
        }
      ]
    });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    const q3 = survey.getQuestionByName("q3");
    q1.value = "A";
    expect(q3.value, "q3.value #1").toBeUndefined();
    q2.value = "copy";
    expect(q3.value, "q3 is not empty").toBe("A");
    q3.value = "B";
    expect(q3.value, "q3.value #2").toBe("B");
    q2.value = "notCopy";
    expect(q3.value, "q3.value #3").toBe("B");
    q1.value = "C";
    expect(q3.value, "q3.value #4").toBe("B");
    q2.value = "copy";
    expect(q3.value, "q3.value #5").toBe("C");
    q1.value = "D";
    expect(q3.value, "q3.value #6").toBe("D");
    FunctionFactory.Instance.unregister("canCopyValue");
  });
  test("copyvalue & custom function, Bug#10192, #2", () => {
    class SurveyTriggerCopyValueEx extends SurveyTriggerCopyValue {
      protected getUsedVariables(runner: ExpressionRunner): string[] {
        const res = super.getUsedVariables(runner);
        res.push(this.fromName);
        return res;
      }
    }
    const copyClassInfo = Serializer.findClass("copyvaluetrigger");
    copyClassInfo.creator = () => {
      return new SurveyTriggerCopyValueEx();
    };
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2" },
        { type: "text", name: "q3" },
      ],
      triggers: [
        {
          "type": "copyvalue",
          "expression": "{q2} = 'copy'",
          "fromName": "q1",
          "setToName": "q3"
        }
      ]
    });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    const q3 = survey.getQuestionByName("q3");
    q1.value = "A";
    expect(q3.value, "q3.value #1").toBeUndefined();
    q2.value = "copy";
    expect(q3.value, "q3 is not empty").toBe("A");
    q3.value = "B";
    expect(q3.value, "q3.value #2").toBe("B");
    q2.value = "notCopy";
    expect(q3.value, "q3.value #3").toBe("B");
    q1.value = "C";
    expect(q3.value, "q3.value #4").toBe("B");
    q2.value = "copy";
    expect(q3.value, "q3.value #5").toBe("C");
    q1.value = "D";
    expect(q3.value, "q3.value #6").toBe("D");
    copyClassInfo.creator = () => {
      return new SurveyTriggerCopyValue();
    };
  });
  test("triggers & survey.onExpressionRunning #10259", () => {
    const survey = new SurveyModel({
      pages: [{ elements: [
        {
          type: "text",
          name: "q1",
        },
      ],
      }, { elements: [
        {
          type: "text",
          name: "q2",
        },
      ],
      }],
      triggers: [
        {
          type: "complete",
          expression: "{q1} = 3"
        },
      ],
    });
    let counter = 0;
    let expression = "{q1} = 3";
    let allow = false;
    survey.onExpressionRunning.add((sender, options) => {
      if (options.element.getType() === "completetrigger" && options.propertyName === "expression") {
        options.expression = expression;
        options.allow = allow;
        counter++;
      }
    });
    survey.setValue("q1", 3);
    expect(survey.isCompleteButtonVisible, "Survey complete button visibility #1").toBe(false);
    expect(counter, "onExpressionRunning event call counter #1").toBe(1);
    allow = true;
    expression = "{q1} = 2";
    survey.setValue("q1", 2);
    expect(survey.isCompleteButtonVisible, "Survey complete button visibility #2").toBe(true);
    expect(counter, "onExpressionRunning event call counter #2").toBe(2);
  });
  test("triggers that depend on each other, Bug#10659", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "radiogroup",
          name: "q1",
          choices: ["item1", "item2", "item3"]
        },
        {
          type: "radiogroup",
          name: "q2",
          choices: ["item1", "item2", "item3"]
        },
        {
          type: "radiogroup",
          name: "q3",
          choices: ["item1", "item2", "item3"]
        },
        {
          type: "radiogroup",
          name: "q4",
          choices: ["item1", "item2", "item3"]
        },
        {
          type: "radiogroup",
          name: "q5",
          choices: ["item1", "item2", "item3"]
        },
      ],
      triggers: [
        {
          type: "setvalue",
          expression: "{q2} = 'item1' and {q4} = 'item1'",
          setToName: "q5",
          setValue: "item1",
        },
        {
          type: "setvalue",
          expression:
        "{q1} = 'item1' or {q1} = 'item3'",
          setToName: "q2",
          setValue: "item1",
        },
        {
          type: "setvalue",
          expression:
        "{q3} = 'item1' or {q3} = ' item3'",
          setToName: "q4",
          setValue: "item1",
        }
      ],
    });

    survey.setValue("q1", "item1");
    survey.setValue("q3", "item1");
    expect(survey.data, "q5 should have item1 value").toEqual({
      "q1": "item1",
      "q2": "item1",
      "q3": "item1",
      "q4": "item1",
      "q5": "item1" });
  });
  test("Bug#11311 - copyvalue trigger - custom function without parameters is called on any question change", () => {
    let counter = 0;
    FunctionFactory.Instance.register("alwaysCopyValue", () => {
      counter++;
      return true;
    });
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2" },
        { type: "text", name: "q3" },
      ],
      triggers: [{
        type: "copyvalue",
        expression: "alwaysCopyValue()",
        fromName: "q1",
        setToName: "q3"
      }]
    });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    const q3 = survey.getQuestionByName("q3");

    q1.value = "A";
    expect(counter, "expression called on fromName q1 change #1").toBe(1);
    expect(q3.value, "q3 copied from q1 #1").toBe("A");

    q1.value = "B";
    expect(counter, "expression called on fromName q1 change #2").toBe(2);
    expect(q3.value, "q3 copied from q1 #2").toBe("B");

    // A no-params function has no variable dependencies so the expression fires on ANY question change
    q2.value = "X";
    expect(counter, "no-params function triggers on any question change").toBe(3);
    expect(q3.value, "q3 still from q1 after q2 change").toBe("B");

    FunctionFactory.Instance.unregister("alwaysCopyValue");
  });
  test("Bug#11311 - copyvalue trigger - custom function with {questionName} parameter is called on that question value change", () => {
    let counter = 0;
    FunctionFactory.Instance.register("copyIfAllowed", (params) => {
      counter++;
      return params[0] === "yes";
    });
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2" },
        { type: "text", name: "q3" },
        { type: "text", name: "q4" },
      ],
      triggers: [{
        type: "copyvalue",
        expression: "copyIfAllowed({q2})",
        fromName: "q1",
        setToName: "q3"
      }]
    });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    const q3 = survey.getQuestionByName("q3");
    const q4 = survey.getQuestionByName("q4");

    // q2 not set -> copyIfAllowed(undefined) = false -> no copy
    q1.value = "A";
    expect(counter, "expression called on fromName q1 change #1").toBe(1);
    expect(q3.value, "not copied - q2 not set").toBeUndefined();

    // changing q2 (expression variable) also triggers re-evaluation
    q2.value = "yes";
    expect(counter, "expression called on expression var q2 change #1").toBe(2);
    expect(q3.value, "copied after q2 = 'yes'").toBe("A");

    q2.value = "no";
    expect(counter, "expression called on q2 change #2").toBe(3);
    expect(q3.value, "q3 unchanged - q2 = 'no'").toBe("A");

    q1.value = "B";
    expect(counter, "expression called on fromName q1 change #2").toBe(4);
    expect(q3.value, "not copied - q2 still 'no'").toBe("A");

    q2.value = "yes";
    expect(counter, "expression called on q2 change #3").toBe(5);
    expect(q3.value, "copied after q2 = 'yes' again, q1 = 'B'").toBe("B");

    // q4 is not fromName and not in expression -> expression NOT called on q4 change
    q4.value = "Z";
    expect(counter, "expression NOT called on unrelated q4 change").toBe(5);

    FunctionFactory.Instance.unregister("copyIfAllowed");
  });
  test("Bug#11311 - copyvalue trigger - custom function with {$obj.propertyValue} parameter uses current property value at evaluation time", () => {
    let counter = 0;
    FunctionFactory.Instance.register("copyWhenVisible", (params) => {
      counter++;
      return params[0] === true;
    });
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2" },
        { type: "text", name: "q3" },
      ],
      triggers: [{
        type: "copyvalue",
        expression: "copyWhenVisible({$q2.visible})",
        fromName: "q1",
        setToName: "q3"
      }]
    });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    const q3 = survey.getQuestionByName("q3");

    // q2.visible is true by default -> copyWhenVisible(true) = true -> copy
    q1.value = "A";
    expect(counter, "expression called on fromName q1 change #1").toBe(1);
    expect(q3.value, "copied - q2.visible is true").toBe("A");

    // make q2 invisible; the expression re-evaluates {$q2.visible} on next q1 change
    q2.visible = false;
    q1.value = "B";
    expect(counter, "expression called on fromName q1 change #2").toBe(2);
    expect(q3.value, "not copied - {$q2.visible} is false").toBe("A");

    // restore visibility -> copy resumes
    q2.visible = true;
    q1.value = "C";
    expect(counter, "expression called on fromName q1 change #3").toBe(3);
    expect(q3.value, "copied - {$q2.visible} is true again").toBe("C");

    FunctionFactory.Instance.unregister("copyWhenVisible");
  });
  test("Bug#11311 - copyvalue trigger - custom function with const parameters is called on any question change", () => {
    let counter = 0;
    FunctionFactory.Instance.register("checkConstFlag", (params) => {
      counter++;
      return params[0] === "enable";
    });
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2" },
        { type: "text", name: "q3" },
      ],
      triggers: [{
        type: "copyvalue",
        expression: "checkConstFlag('enable')",
        fromName: "q1",
        setToName: "q3"
      }]
    });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    const q3 = survey.getQuestionByName("q3");

    q1.value = "A";
    expect(counter, "expression called on fromName q1 change #1").toBe(1);
    expect(q3.value, "q3 copied - const flag 'enable' matches").toBe("A");

    q1.value = "B";
    expect(counter, "expression called on fromName q1 change #2").toBe(2);
    expect(q3.value, "q3 updated to B").toBe("B");

    // const-param function: all params are constants = treated the same as no-params,
    // so expression IS called on any question change (not just fromName)
    q2.value = "X";
    expect(counter, "const-param function called on any question change - same rule as no-params").toBe(3);
    expect(q3.value, "q3 still B - flag is 'enable' so copy runs again but value same").toBe("B");

    q1.value = "C";
    expect(counter, "expression called on fromName q1 change #3").toBe(4);
    expect(q3.value, "q3 updated to C").toBe("C");

    FunctionFactory.Instance.unregister("checkConstFlag");
  });
  test("Bug#11311 - copyvalue trigger - customFunction with string-literal question name params fires on any question change", () => {
    // customFunction('question2','=','Item 1') passes question names as string constants.
    // All parameters are constants so hasFunction(true) = true -> treat as no-params -> always evaluate.
    // maxConditionRunCountOnValueChanged does not affect this behavior.
    let counter = 0;
    FunctionFactory.Instance.register("customFunction", function(this: any, params) {
      counter++;
      const survey: SurveyModel = this.survey; // survey is bound to 'this' by FunctionFactory
      const questionName = params[0];
      const operator = params[1];
      const expected = params[2];
      const actual = survey ? survey.getValue(questionName) : undefined;
      if (operator === "=") return actual === expected;
      if (operator === "notempty") return actual !== undefined && actual !== "" && actual !== null;
      return false;
    });

    const defaultMaxCount = settings.maxConditionRunCountOnValueChanged;
    settings.maxConditionRunCountOnValueChanged = 1;

    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "question1" },
        { type: "radiogroup", name: "question2", choices: ["Item 1", "Item 2"] },
        { type: "text", name: "source" },
        { type: "text", name: "dest" },
      ],
      triggers: [{
        type: "copyvalue",
        expression: "customFunction('question2','=','Item 1') and customFunction('question1','notempty','')",
        fromName: "source",
        setToName: "dest"
      }]
    });

    survey.setValue("question1", "hello");
    survey.setValue("question2", "Item 1");
    survey.setValue("source", "original");
    expect(dest(), "dest copied when source set and both conditions true").toBe("original");

    // With const-only params, hasFunction(true) = true -> expression fires on ANY question change.
    // BinaryOperand.evaluate evaluates both operands eagerly (no short-circuit), so both customFunction
    // calls always run when the trigger evaluates, incrementing counter by 2 per trigger fire.
    counter = 0;
    survey.setValue("question2", "Item 2");
    expect(counter, "trigger called on question2 change - both functions evaluated, no short-circuit").toBe(2);
    expect(dest(), "dest unchanged - condition false after question2 change").toBe("original");

    // Changing question1 also fires the trigger - both functions called again (+2).
    survey.setValue("question1", "");
    expect(counter, "trigger called on question1 change too - both functions evaluated again").toBe(4);
    expect(dest(), "dest still unchanged - condition still false").toBe("original");

    // Restore: both conditions true again, changing source copies dest.
    survey.setValue("question2", "Item 1");
    survey.setValue("question1", "hello");
    survey.setValue("source", "updated");
    expect(dest(), "dest updated when both conditions true and source changed").toBe("updated");

    // maxConditionRunCountOnValueChanged=1 has no effect on trigger evaluation:
    // it controls condition cascade reruns, not whether triggers fire.
    counter = 0;
    survey.setValue("question2", "Item 2");
    expect(counter, "trigger still called on question2 change regardless of maxConditionRunCountOnValueChanged").toBe(2);

    settings.maxConditionRunCountOnValueChanged = defaultMaxCount;
    FunctionFactory.Instance.unregister("customFunction");

    function dest() { return survey.getValue("dest"); }
  });
  test("Bug#11311 - custom function with const parameters is re-evaluated on any question change in visibleIf", () => {
    let counter = 0;
    FunctionFactory.Instance.register("checkConstParam", (params) => {
      counter++;
      return params[0] === "show";
    });
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2", visibleIf: "checkConstParam('show')" },
        { type: "text", name: "q3", visibleIf: "checkConstParam('hide')" },
      ]
    });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    const q3 = survey.getQuestionByName("q3");

    expect(q2.isVisible, "q2 visible initially - checkConstParam('show') = true").toBe(true);
    expect(q3.isVisible, "q3 hidden initially - checkConstParam('hide') = false").toBe(false);

    // Changing q1 has no declared connection to either visibleIf expression.
    // Before the fix, the engine skipped re-evaluation because it saw no variable dependencies.
    // After the fix, const-param functions are treated as no-params and always re-evaluated.
    counter = 0;
    q1.value = "X";
    expect(counter, "visibleIf expressions re-evaluated on q1 change - const params treated as no deps").toBeGreaterThan(0);
    expect(q2.isVisible, "q2 still visible after q1 change").toBe(true);
    expect(q3.isVisible, "q3 still hidden after q1 change").toBe(false);

    FunctionFactory.Instance.unregister("checkConstParam");
  });
  describe("A complete trigger fired by a variable change, executeCompleteOnValueChanged = true, Bug#12333", () => {
    const routeJSON = {
      calculatedValues: [{ name: "route", expression: "iif({reason} = 'billing', 'billing_desk', '')" }],
      triggers: [{ type: "complete", expression: "{route} notempty" }],
      elements: [
        { type: "text", name: "reason" },
        { type: "text", name: "later", isRequired: true },
      ],
    };
    const variableJSON = {
      triggers: [{ type: "complete", expression: "{var1} notempty" }],
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2" },
      ],
    };
    function runWithSetting(func: () => void): void {
      const oldValue = settings.triggers.executeCompleteOnValueChanged;
      settings.triggers.executeCompleteOnValueChanged = true;
      try {
        func();
      } finally {
        settings.triggers.executeCompleteOnValueChanged = oldValue;
      }
    }
    function collectVariableChanges(survey: SurveyModel): Array<string> {
      const res: Array<string> = [];
      survey.onVariableChanged.add((_, options) => {
        res.push(options.name + "=" + options.value);
      });
      return res;
    }
    test("a calculated value changed by setValue completes the survey", () => {
      runWithSetting(() => {
        const survey = new SurveyModel(routeJSON);
        const changes = collectVariableChanges(survey);
        survey.setValue("reason", "billing");
        expect(survey.state, "the survey is completed").toBe("completed");
        expect(changes, "onVariableChanged reports the calculated value only").toEqual(["route=billing_desk"]);
      });
    });
    test("setVariable completes the survey", () => {
      runWithSetting(() => {
        const survey = new SurveyModel(variableJSON);
        const changes = collectVariableChanges(survey);
        survey.setVariable("var1", "abc");
        expect(survey.state, "the survey is completed").toBe("completed");
        expect(changes, "onVariableChanged reports the changed variable only").toEqual(["var1=abc"]);
      });
    });
    test("setVariables completes the survey", () => {
      runWithSetting(() => {
        const survey = new SurveyModel(variableJSON);
        const changes = collectVariableChanges(survey);
        survey.setVariables({ var1: "abc", var2: "def" });
        expect(survey.state, "the survey is completed").toBe("completed");
        expect(changes, "onVariableChanged reports the changed variables only").toEqual(["var1=abc", "var2=def"]);
      });
    });
    test("survey.data that changes a calculated value doesn't throw", () => {
      runWithSetting(() => {
        const survey = new SurveyModel(routeJSON);
        const changes = collectVariableChanges(survey);
        expect(() => { survey.data = { reason: "billing" }; }, "no error on setting data").not.toThrow();
        expect(changes, "onVariableChanged reports the calculated value only").toEqual(["route=billing_desk"]);
      });
    });
  });
});
describe("A nested function with constant parameters runs on any change", () => {
  const nested = "iif({a} = 1, readQ('src'), 0)";
  function registerReadQ(): void {
    FunctionFactory.Instance.register("readQ", function (this: any, params: any[]) { return this.survey.getValue(params[0]); });
  }
  let calls = 0;
  function registerCountCalls(): void {
    calls = 0;
    FunctionFactory.Instance.register("countCalls", (params: any[]) => { calls++; return params[0]; });
  }
  function surveyJSON(q: any, calculatedValues?: any[]): any {
    return {
      elements: [{ type: "text", name: "a" }, { type: "text", name: "src" }, { type: "text", name: "other" }, q],
      calculatedValues
    };
  }
  test("A nested function with constant parameters in a question visibleIf runs on any change", () => {
    registerReadQ();
    try {
      const survey = new SurveyModel(surveyJSON({ type: "text", name: "q", visibleIf: nested + " = 1" }));
      const q = survey.getQuestionByName("q");
      survey.setValue("a", 1);
      expect(q.isVisible, "a = 1").toBe(false);
      survey.setValue("src", 1);
      expect(q.isVisible, "src = 1").toBe(true);
      survey.setValue("src", 2);
      survey.setValue("other", "x");
      expect(q.isVisible, "src = 2, other = x").toBe(false);
    } finally {
      FunctionFactory.Instance.unregister("readQ");
    }
  });
  test("A nested function with constant parameters in a calculated value runs on any change", () => {
    registerReadQ();
    try {
      const survey = new SurveyModel(surveyJSON({ type: "text", name: "q" }, [{ name: "cv", expression: nested }]));
      survey.setValue("a", 1);
      expect(survey.getVariable("cv"), "a = 1").toBeUndefined();
      survey.setValue("src", 1);
      expect(survey.getVariable("cv"), "src = 1").toBe(1);
      survey.setValue("src", 2);
      survey.setValue("other", "x");
      expect(survey.getVariable("cv"), "src = 2, other = x").toBe(2);
    } finally {
      FunctionFactory.Instance.unregister("readQ");
    }
  });
  test("A nested function with constant parameters in a defaultValueExpression runs on any change", () => {
    registerReadQ();
    try {
      const survey = new SurveyModel(surveyJSON({ type: "text", name: "q", defaultValueExpression: nested }));
      const q = survey.getQuestionByName("q");
      survey.setValue("a", 1);
      expect(q.value, "a = 1").toBeUndefined();
      survey.setValue("src", 1);
      expect(q.value, "src = 1").toBe(1);
      survey.setValue("src", 2);
      survey.setValue("other", "x");
      expect(q.value, "src = 2, other = x").toBe(2);
    } finally {
      FunctionFactory.Instance.unregister("readQ");
    }
  });
  test("A nested function with constant parameters in a choice visibleIf runs on any change", () => {
    registerReadQ();
    try {
      const survey = new SurveyModel(surveyJSON({ type: "radiogroup", name: "q",
        choices: [{ value: "x", visibleIf: nested + " = 1" }, "y"] }));
      const q = <any>survey.getQuestionByName("q");
      const visible = () => q.visibleChoices.map((c: any) => c.value).join(",");
      survey.setValue("a", 1);
      expect(visible(), "a = 1").toBe("y");
      survey.setValue("src", 1);
      expect(visible(), "src = 1").toBe("x,y");
      survey.setValue("src", 2);
      survey.setValue("other", "x");
      expect(visible(), "src = 2, other = x").toBe("y");
    } finally {
      FunctionFactory.Instance.unregister("readQ");
    }
  });
  test("A top-level function with constant parameters still runs on any change", () => {
    registerReadQ();
    try {
      const survey = new SurveyModel(surveyJSON({ type: "text", name: "q", visibleIf: "readQ('src') = 1" }));
      const q = survey.getQuestionByName("q");
      survey.setValue("a", 1);
      expect(q.isVisible, "a = 1").toBe(false);
      survey.setValue("src", 1);
      expect(q.isVisible, "src = 1").toBe(true);
      survey.setValue("src", 2);
      survey.setValue("other", "x");
      expect(q.isVisible, "src = 2, other = x").toBe(false);
    } finally {
      FunctionFactory.Instance.unregister("readQ");
    }
  });
  test("A nested function with variables only still skips", () => {
    registerCountCalls();
    try {
      const survey = new SurveyModel({
        elements: [{ type: "text", name: "a" }, { type: "text", name: "b" }, { type: "text", name: "other" },
          { type: "text", name: "q", visibleIf: "iif({a} = 1, countCalls({b}), 0) = 1" }]
      });
      const q = survey.getQuestionByName("q");
      survey.setValue("a", 1);
      survey.setValue("b", 1);
      expect(q.isVisible, "a = 1, b = 1").toBe(true);
      calls = 0;
      survey.setValue("other", "x");
      expect(calls, "other = x").toBe(0);
      survey.setValue("b", 2);
      expect(calls, "b = 2").toBeGreaterThanOrEqual(1);
      expect(q.isVisible, "b = 2").toBe(false);
    } finally {
      FunctionFactory.Instance.unregister("countCalls");
    }
  });
  test("An expression replaced in place drops the kept answer", () => {
    registerReadQ();
    registerCountCalls();
    try {
      const survey = new SurveyModel(surveyJSON({ type: "text", name: "q", visibleIf: "{a} = 1" },
        [{ name: "cv", expression: "countCalls('k')" }]));
      const q = survey.getQuestionByName("q");
      survey.setValue("a", 1);
      survey.setValue("other", "x");
      expect(q.isVisible, "a = 1").toBe(true);
      // The new expression holds a variable, so the skip check applies, but not src
      q.visibleIf = "{a} = 1 and readQ('src') = 1";
      survey.setValue("src", 1);
      expect(q.isVisible, "src = 1").toBe(true);
      survey.setValue("src", 2);
      survey.setValue("other", "y");
      expect(q.isVisible, "src = 2, other = y").toBe(false);

      const cv = survey.calculatedValues[0];
      calls = 0;
      survey.setValue("other", "z");
      expect(calls, "countCalls('k'), other = z").toBeGreaterThanOrEqual(1);
      cv.expression = "countCalls({a})";
      calls = 0;
      survey.setValue("other", "w");
      expect(calls, "countCalls({a}), other = w").toBe(0);
    } finally {
      FunctionFactory.Instance.unregister("readQ");
      FunctionFactory.Instance.unregister("countCalls");
    }
  });
});
describe("A data load runs no question triggers, also when a nested item writes its record back during it", () => {
  // While survey.data assigns the data, each item of the nested dynamic panel computes its expression question and
  // writes the slot's record back into "slotValues". The count reads "hasSecond" through a calculated value: 1 before
  // the load, 2 after it. A trigger that ran on such a write-back read the count of 1 and changed a loaded answer. The
  // questions of a test come before the panel, so they hold their loaded answers when the panel writes back.
  const slotsPanel = {
    type: "paneldynamic", name: "slots", valueName: "slotValues",
    templateElements: [
      { type: "text", name: "slot" },
      { type: "paneldynamic", name: "nested", panelCount: 1, templateElements: [
        { type: "expression", name: "nestedSlot", expression: "{parentPanel.slot}" },
        { type: "text", name: "text" }
      ] }
    ]
  };
  const chosen = { type: "checkbox", name: "chosen", choices: ["k0", "k1"], setValueIf: "{count} = 1 and {flags} contains 'a'", setValueExpression: "['k0']" };
  const loadedChosen = { chosen: ["k0", "k1"] };
  function surveyJSON(options: { elements?: Array<any>, triggers?: Array<any>, clearInvisibleValues?: string, slotsDefault?: Array<any>,
    slotElements?: Array<any>, } = {}): any {
    const panel: any = { ...slotsPanel };
    if (options.slotsDefault) panel.defaultValue = options.slotsDefault;
    if (options.slotElements) panel.templateElements = panel.templateElements.concat(options.slotElements);
    const json: any = {
      calculatedValues: [
        { name: "secondOn", expression: "{hasSecond} = true" },
        { name: "count", expression: "1 + iif({secondOn} = true, 1, 0)" }
      ],
      elements: [
        { type: "boolean", name: "hasSecond" },
        { type: "checkbox", name: "flags", choices: ["a", "b"] }
      ].concat(options.elements || [], [panel])
    };
    if (options.triggers) json.triggers = options.triggers;
    if (options.clearInvisibleValues) json.clearInvisibleValues = options.clearInvisibleValues;
    return json;
  }
  function loadedData(answers: any): any {
    return { hasSecond: true, flags: ["a"], slotValues: [{ slot: "k0", nested: [{ text: "x" }] }, { slot: "k1" }], ...answers };
  }
  function expectLoaded(survey: SurveyModel, answers: any): void {
    expect(survey.getVariable("count"), "the count after the load").toBe(2);
    expect(survey.getValue("slotValues")[1].nested[0].nestedSlot, "the nested item wrote its record back").toBe("k1");
    expect(survey.getValue("slotValues")[0].nested[0].text, "the loaded record").toBe("x");
    Object.keys(answers).forEach((name: string) => expect(survey.getValue(name), name).toEqual(answers[name]));
  }
  const questionTriggers: Array<[string, any, any]> = [
    ["setValueIf with a constant setValueExpression", chosen, loadedChosen],
    ["setValueIf that reads the written-back value",
      { type: "text", name: "q", setValueIf: "{count} = 1 and {slotValues} notempty", setValueExpression: "'one: ' + {count}" }, { q: "loaded" }],
    ["resetValueIf that reads the written-back value", { type: "text", name: "q", resetValueIf: "{count} = 1 and {slotValues} notempty" }, { q: "loaded" }]
  ];
  test.each(questionTriggers)("survey.data keeps an answer that a %s would change", (_: string, question: any, answers: any) => {
    const survey = new SurveyModel(surveyJSON({ elements: [question] }));
    survey.data = loadedData(answers);
    expectLoaded(survey, answers);
  });
  test.each(questionTriggers)("mergeData keeps an answer that a %s would change", (_: string, question: any, answers: any) => {
    const survey = new SurveyModel(surveyJSON({ elements: [question] }));
    survey.mergeData(loadedData(answers));
    expectLoaded(survey, answers);
  });
  // A write into a record runs the triggers of the questions of its item directly, while the questions are updated
  // (the count is 1 yet) and in the load's own pass (the count is 2). Neither may change a loaded answer.
  function loadSlotQuestion(question: any, record: any): SurveyModel {
    const survey = new SurveyModel(surveyJSON({ slotElements: [question] }));
    // The items of the nested panel are new, so each one writes its slot's record back.
    survey.data = loadedData({ slotValues: [{ slot: "k0", ...record }, { slot: "k1" }] });
    expect(survey.getVariable("count"), "the count after the load").toBe(2);
    expect(survey.getValue("slotValues")[0].nested[0].nestedSlot, "the nested item wrote its record back").toBe("k0");
    return survey;
  }
  const matrixInSlot = (condition: string): any => ({ type: "matrixdynamic", name: "grid", rowCount: 1, columns: [
    { name: "copy", cellType: "expression", expression: "{row.cell} + '!'" },
    { name: "cell", cellType: "text", setValueIf: condition, setValueExpression: "'set'" }] });
  test.each([
    ["a question of the panel item", "{count} = 1"],
    ["a question of the panel item", "{count} = 2"],
    ["a cell of a matrix row in the panel item", "{count} = 1"],
    ["a cell of a matrix row in the panel item", "{count} = 2"]
  ])("survey.data keeps %s that a setValueIf %s would change", (label: string, condition: string) => {
    const isCell = label.indexOf("matrix") > -1;
    const survey = loadSlotQuestion(isCell ? matrixInSlot(condition) : { type: "text", name: "itemQ", setValueIf: condition, setValueExpression: "'set'" },
      isCell ? { grid: [{ cell: "loaded" }] } : { itemQ: "loaded" });
    const record = survey.getValue("slotValues")[0];
    expect(isCell ? record.grid[0].cell : record.itemQ, "the loaded answer").toBe("loaded");
  });
  test("survey.data keeps a question of a composite in the panel item that a setValueIf would change", () => {
    ComponentCollection.Instance.add({ name: "loadedPair", elementsJSON: [
      { type: "text", name: "a" }, { type: "expression", name: "copy", expression: "{composite.a}" },
      { type: "text", name: "itemQ", setValueIf: "{count} = 1", setValueExpression: "'set'" }] });
    try {
      const survey = loadSlotQuestion({ type: "loadedPair", name: "pair" }, { pair: { a: "z", itemQ: "loaded" } });
      expect(survey.getValue("slotValues")[0].pair.itemQ, "the loaded answer").toBe("loaded");
    } finally {
      ComponentCollection.Instance.clear();
    }
  });
  // An item whose expression the load's pass computes, without a nested panel.
  const rowsPanel = (question: any): any => ({ type: "paneldynamic", name: "rows", templateElements: [
    { type: "text", name: "a" }, { type: "expression", name: "copy", expression: "{panel.a} + '!'" }, question] });
  test("survey.data keeps a question of a dynamic panel item that a setValueIf true after the load would change", () => {
    const survey = new SurveyModel(surveyJSON({ elements: [rowsPanel({ type: "text", name: "itemQ", setValueIf: "{count} = 2", setValueExpression: "'set'" })] }));
    survey.data = loadedData({ rows: [{ a: "y", itemQ: "loaded" }] });
    expect(survey.getValue("rows")[0].copy, "the load computed the expression").toBe("y!");
    expect(survey.getValue("rows")[0].itemQ, "the loaded answer").toBe("loaded");
  });
  test("survey.data does not fill an item question that the data leaves out; the next change does", () => {
    const survey = new SurveyModel(surveyJSON({ elements: [rowsPanel({ type: "text", name: "itemQ", setValueIf: "{panel.copy} notempty", setValueExpression: "{panel.copy} + 'set'" })] }));
    survey.data = loadedData({ rows: [{ a: "y" }] });
    expect(survey.getValue("rows")[0].itemQ, "after the load").toBeUndefined();
    survey.getQuestionByName("rows").panels[0].getQuestionByName("a").value = "z";
    expect(survey.getValue("rows")[0].itemQ, "after a change").toBe("z!set");
  });
  test.each(["none", "onComplete"])("survey.data keeps the loaded answers with clearInvisibleValues: %s", (clearInvisibleValues: string) => {
    const survey = new SurveyModel(surveyJSON({ elements: [chosen], clearInvisibleValues: clearInvisibleValues }));
    survey.data = loadedData(loadedChosen);
    expectLoaded(survey, loadedChosen);
  });
  test("survey.data assigned in an onValueChanged handler keeps the loaded answers", () => {
    const survey = new SurveyModel(surveyJSON({ elements: [chosen, { type: "text", name: "start" }] }));
    survey.onValueChanged.add((sender: SurveyModel, options: any) => {
      if (options.name === "start") sender.data = loadedData(loadedChosen);
    });
    survey.setValue("start", 1);
    expectLoaded(survey, loadedChosen);
  });
  test("survey.data keeps the loaded records and answers of a dynamic panel with a defaultValue", () => {
    const survey = new SurveyModel(surveyJSON({ elements: [chosen], slotsDefault: [{ slot: "k0" }, { slot: "k1" }, { slot: "k2" }] }));
    survey.data = loadedData(loadedChosen);
    expect(survey.getValue("slotValues").length, "the loaded records").toBe(2);
    expectLoaded(survey, loadedChosen);
  });
  test("the values after a load are the same with calculatedValueTrackDependencies on and off", () => {
    const load = (track: boolean): any => {
      const prev = settings.calculatedValueTrackDependencies;
      settings.calculatedValueTrackDependencies = track;
      try {
        const survey = new SurveyModel(surveyJSON({ elements: [chosen] }));
        survey.data = loadedData(loadedChosen);
        return { data: survey.data, secondOn: survey.getVariable("secondOn"), count: survey.getVariable("count") };
      } finally {
        settings.calculatedValueTrackDependencies = prev;
      }
    };
    expect(load(true)).toEqual(load(false));
  });
  // The load runs one full pass after it updates the questions, so a write-back then needs no pass of its own.
  test.each(["data", "mergeData"])("survey.%s runs as many conditions passes with a nested write-back as without one", (method: string) => {
    const countPasses = (withNested: boolean): number => {
      const json = surveyJSON({ elements: [chosen] });
      if (!withNested) json.elements[json.elements.length - 1].templateElements = [{ type: "text", name: "slot" }];
      const survey = new SurveyModel(json);
      let passes = 0;
      const runConditionsCore = survey["runConditionsCore"];
      survey["runConditionsCore"] = (properties: any): any => { passes++; return runConditionsCore.call(survey, properties); };
      if (method === "data") survey.data = loadedData(loadedChosen); else survey.mergeData(loadedData(loadedChosen));
      return passes;
    };
    expect(countPasses(true)).toBe(countPasses(false));
  });
  // A survey trigger still runs for a value the load's own pass computes, as for a calculated value.
  test("survey.data runs a survey trigger for a value its pass computes, on the values after the load", () => {
    const survey = new SurveyModel(surveyJSON({ elements: [{ type: "text", name: "b" }, { type: "expression", name: "tenfold", expression: "{count} * 10" }],
      triggers: [{ type: "setvalue", expression: "{tenfold} = 20", setToName: "b", setValue: "by trigger" }] }));
    survey.data = loadedData({ b: "loaded" });
    expect(survey.getValue("tenfold"), "the expression after the load").toBe(20);
    expect(survey.getValue("b"), "the setvalue trigger ran").toBe("by trigger");
  });
  // The survey triggers of a write during the load run as before: a value or a variable that a handler writes then
  // runs them too.
  test.each(["a variable", "a value"])("%s that a handler writes during the load runs a survey trigger", (kind: string) => {
    const survey = new SurveyModel(surveyJSON({ elements: [{ type: "text", name: "b" }],
      triggers: [{ type: "setvalue", expression: "{flag} = 1 and {hasSecond} = true", setToName: "b", setValue: "by trigger" }] }));
    survey.onValueChanged.add((sender: SurveyModel, options: any) => {
      if (options.name !== "slotValues" || !sender.isSettingData()) return;
      if (kind === "a variable") sender.setVariable("flag", 1); else sender.setValue("flag", 1);
    });
    survey.data = loadedData({ b: "loaded" });
    expect(kind === "a variable" ? survey.getVariable("flag") : survey.getValue("flag"), "the handler ran during the load").toBe(1);
    expectLoaded(survey, { b: "by trigger" });
  });
  test("a comment that a handler writes during the load of a completed survey changes no later trigger", () => {
    const survey = new SurveyModel(surveyJSON({ elements: [{ type: "text", name: "c", showCommentArea: true },
      { type: "text", name: "z", resetValueIf: "{c} notempty" }, { type: "text", name: "y" }] }));
    survey.doComplete();
    survey.onValueChanged.add((sender: SurveyModel, options: any) => {
      if (options.name === "slotValues" && sender.isSettingData()) sender.setComment("c", "note");
    });
    survey.data = loadedData({ c: "c1", z: "loaded" });
    expect(survey.getValue("z"), "after the load").toBe("loaded");
    survey.setValue("y", 1);
    expect(survey.getValue("z"), "after a change of another value").toBe("loaded");
  });
  // The nested panels on another page, built at load because a calculated value reads a nested item.
  test.each(["data", "mergeData"])("survey.%s keeps the loaded answers when a calculated value reads a nested item on another page", (method: string) => {
    const survey = new SurveyModel({
      calculatedValues: [
        { name: "secondOn", expression: "{hasSecond} = true" },
        { name: "count", expression: "1 + iif({secondOn} = true, 1, 0)" },
        { name: "nestedText", expression: "{slotValues[0].nested[0].text}" }
      ],
      pages: [
        { elements: [{ type: "boolean", name: "hasSecond" }, { type: "checkbox", name: "flags", choices: ["a", "b"] }, chosen] },
        { elements: [slotsPanel] }
      ]
    });
    const changed: Array<string> = [];
    survey.onValueChanged.add((_: SurveyModel, options: any) => { changed.push(options.name); });
    const data = loadedData(loadedChosen);
    if (method === "data") survey.data = data; else survey.mergeData(data);
    expect(survey.getVariable("nestedText"), "the calculated value read the nested item").toBe("x");
    expectLoaded(survey, loadedChosen);
    expect(changed.indexOf("chosen"), "no onValueChanged for the loaded answer during the load").toBe(-1);
  });
  test("survey.data leaves empty a question that the data leaves out, although its setValueIf is true after the load", () => {
    const survey = new SurveyModel(surveyJSON({ elements: [{ type: "text", name: "target", setValueIf: "{flags} contains 'a'", setValueExpression: "'v'" }] }));
    survey.data = loadedData({});
    expectLoaded(survey, {});
    expect(survey.getValue("target"), "after the load").toBeUndefined();
    survey.setValue("flags", ["a", "b"]);
    expect(survey.getValue("target"), "after a change").toBe("v");
  });
  test("a value that a handler sets during the load holds, conditions on it hold, a setValueIf on it waits for the next change", () => {
    const survey = new SurveyModel(surveyJSON({ elements: [{ type: "text", name: "x" },
      { type: "text", name: "y", setValueIf: "{x} = 5", setValueExpression: "'yes'" },
      { type: "text", name: "z", visibleIf: "{x} = 5" },
      { type: "expression", name: "e", expression: "{x} + {count}" }] }));
    survey.onValueChanged.add((sender: SurveyModel, options: any) => {
      if (options.name === "slotValues" && sender.isSettingData()) sender.setValue("x", 5);
    });
    survey.data = loadedData({});
    expect(survey.getValue("x"), "the handler's value").toBe(5);
    expect(survey.getQuestionByName("z").isVisible, "visibleIf on it").toBe(true);
    expect(survey.getValue("e"), "an expression on it").toBe(7);
    expect(survey.getValue("y"), "setValueIf during the load").toBeUndefined();
    survey.setValue("x", 4);
    survey.setValue("x", 5);
    expect(survey.getValue("y"), "setValueIf after a change").toBe("yes");
  });
  test("after the load, a value set by code runs the question and survey triggers", () => {
    const survey = new SurveyModel(surveyJSON({ elements: [chosen, { type: "text", name: "b" }],
      triggers: [{ type: "setvalue", expression: "{count} = 1", setToName: "b", setValue: "one" }] }));
    survey.data = loadedData(loadedChosen);
    survey.setValue("hasSecond", false);
    expect(survey.getVariable("count"), "the count").toBe(1);
    expect(survey.getValue("chosen"), "setValueIf").toEqual(["k0"]);
    expect(survey.getValue("b"), "the setvalue trigger").toBe("one");
  });
});
describe("Review repro: survey.data write-backs", () => {
  // Repro tests from the review of this branch. F1-F4b: a write-back's survey triggers and onValueChanged wait for
  // the pass after the load, and a matrix row's {visibleRowIndex} still runs during it. F3, F5: after the pass, the
  // question triggers that read a name the assignment wrote itself run: survey.data runs a setValueExpression
  // without a setValueIf, clear() runs all of them.
  const nestedSlots = {
    type: "paneldynamic", name: "slots", valueName: "slotValues",
    templateElements: [
      { type: "text", name: "slot" },
      { type: "paneldynamic", name: "nested", panelCount: 1, templateElements: [
        { type: "expression", name: "nestedSlot", expression: "{parentPanel.slot}" },
        { type: "text", name: "text" }
      ] }
    ]
  };
  const slotData = [{ slot: "k0", nested: [{ text: "x" }] }, { slot: "k1" }];
  // The trigger must not run for the write-back while "slotCount" still holds its pre-load value (0).
  test("F1: survey setvalue trigger on a write-back reads a calculated value of the written name", () => {
    const survey = new SurveyModel({
      calculatedValues: [{ name: "slotCount", expression: "countInArray({slotValues}, 'slot')" }],
      elements: [{ type: "text", name: "b" }, nestedSlots],
      triggers: [{ type: "setvalue", expression: "{slotValues} notempty and {slotCount} < 2", setToName: "b", setValue: "by trigger" }]
    });
    survey.data = { b: "loaded", slotValues: slotData };
    expect(survey.getValue("slotValues")[1].nested[0].nestedSlot, "write-back happened").toBe("k1");
    expect(survey.getVariable("slotCount")).toBe(2);
    expect(survey.getValue("b")).toBe("loaded");
  });
  // The runexpression trigger reads "slotCount" = 2 at once, not 0 first and 2 when "slotCount" changes.
  test("F1b: runexpression trigger keyed on the written name reads the calculated value", () => {
    const survey = new SurveyModel({
      calculatedValues: [{ name: "slotCount", expression: "countInArray({slotValues}, 'slot')" }],
      elements: [{ type: "text", name: "n" }, nestedSlots],
      triggers: [{ type: "runexpression", expression: "{slotValues} notempty", runExpression: "{slotCount}", setToName: "n" }]
    });
    const nValues: Array<any> = [];
    survey.onValueChanged.add((_: SurveyModel, options: any) => {
      if (options.name === "n") nValues.push(options.value);
    });
    survey.data = { slotValues: slotData };
    expect(survey.getValue("n")).toBe(2);
    expect(nValues, "the values the trigger set").toEqual([2]);
  });
  // The rows a load rebuilds get their {visibleRowIndex}, also when they were built before the load.
  test.each([true, false])("F2: visibleRowIndex setValueExpression for rows a load rebuilds (rendered before: %s)", (renderedBefore: boolean) => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", rowCount: 1,
      columns: [{ cellType: "text", name: "no", setValueExpression: "{visibleRowIndex}" }, { cellType: "text", name: "t" }] }] });
    const m: any = survey.getQuestionByName("m");
    if (renderedBefore) m.visibleRows;
    survey.data = { m: [{ t: "a" }, { t: "b" }, { t: "c" }] };
    expect(m.visibleRows.map((r: any) => r.getQuestionByName("no").value)).toEqual([1, 2, 3]);
  });
  // The load recomputes "price", and "total" follows it: a setValueExpression without a setValueIf is a computed
  // value, not an answer. With or without a nested item that writes its record back.
  test.each([true, false])("F3: setValueExpression aggregate of records after a load (nested write-back: %s)", (nested: boolean) => {
    const items: Array<any> = [{ type: "text", name: "qty" }, { type: "text", name: "unit" },
      { type: "expression", name: "price", expression: "{panel.qty} * {panel.unit}" }];
    if (nested) items.push({ type: "paneldynamic", name: "nested", panelCount: 1, templateElements: [
      { type: "expression", name: "copy", expression: "{parentPanel.qty}" }] });
    const survey = new SurveyModel({ elements: [
      { type: "text", name: "total", setValueExpression: "sumInArray({orders}, 'price')" },
      { type: "paneldynamic", name: "orders", templateElements: items }] });
    survey.data = { total: 5, orders: [{ qty: 2, unit: 3, price: 5 }] };
    expect(survey.getValue("orders")[0].price, "the load recomputed the price").toBe(6);
    expect(survey.getValue("total")).toBe(6);
  });
  // The handler sees the recalculated "slotCount", not its pre-load value (0).
  test("F4: onValueChanged for a write-back sees the calculated value of the written name", () => {
    const survey = new SurveyModel({
      calculatedValues: [{ name: "slotCount", expression: "countInArray({slotValues}, 'slot')" }],
      elements: [nestedSlots]
    });
    const seen: Array<any> = [];
    survey.onValueChanged.add((sender: SurveyModel, options: any) => {
      if (options.name === "slotValues" && sender.isSettingData()) seen.push(sender.getVariable("slotCount"));
    });
    survey.data = { slotValues: slotData };
    expect(seen.length, "handler fired during the load").toBeGreaterThan(0);
    expect(seen).toEqual(seen.map(() => 2));
  });
  // The handler sees "dep" visible: the pass after the load has run its visibleIf.
  test("F4b: onValueChanged for a write-back sees the visibility a condition on the written name sets", () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "dep", visibleIf: "{slotValues[1].nested[0].nestedSlot} = 'k1'" }, nestedSlots] });
    const seen: Array<boolean> = [];
    survey.onValueChanged.add((sender: SurveyModel, options: any) => {
      if (options.name === "slotValues" && sender.isSettingData()) seen.push(sender.getQuestionByName("dep").isVisible);
    });
    survey.data = { slotValues: slotData };
    expect(seen.length, "handler fired during the load").toBeGreaterThan(0);
    expect(seen[seen.length - 1]).toBe(true);
  });
  // clear() loads no answers: the triggers that read the record the nested item writes back run after its pass.
  test("F5: clear() with a default panelCount and nested write-back: item setValueIf", () => {
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "p", panelCount: 1, templateElements: [
      { type: "text", name: "a", defaultValue: "d" },
      { type: "text", name: "itemQ", setValueIf: "{panel.a} = 'd'", setValueExpression: "'set'" },
      { type: "paneldynamic", name: "nested", panelCount: 1, templateElements: [{ type: "expression", name: "c", expression: "{parentPanel.a}" }] }] }] });
    survey.data = { p: [{ a: "z" }] };
    survey.clear();
    const v = survey.getValue("p");
    expect(v && v[0] && v[0].itemQ).toBe("set");
  });
});
