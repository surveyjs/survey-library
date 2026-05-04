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
});
