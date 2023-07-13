import {
  Trigger,
  ISurveyTriggerOwner,
  SurveyTriggerVisible,
  SurveyTriggerSetValue,
  SurveyTriggerRunExpression
} from "../src/trigger";
import { SurveyModel } from "../src/survey";
import { settings } from "../src/settings";
import { Serializer } from "../src/jsonobject";
import { QuestionMatrixModel } from "../src/question_matrix";

export default QUnit.module("Triggers");

class TriggerTester extends Trigger {
  constructor(
    public succFunc: Function = null,
    public failureFunc: Function = null
  ) {
    super();
  }
  protected onSuccess() {
    if (this.succFunc) this.succFunc();
  }
  protected onFailure() {
    if (this.failureFunc) this.failureFunc();
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
  copyTriggerValue(name: string, fromName: string) {}
  focusQuestion(name: string): boolean {
    return true;
  }
}

QUnit.test("Check trigger operations", function(assert) {
  var trigger = new TriggerTester(null);
  assert.equal(trigger.operator, "equal", "The default is equal");
  trigger.operator = "eq";
  assert.equal(trigger.operator, "equal", "There is no operator 'eq'");
  trigger.operator = "less";
  assert.equal(trigger.operator, "less", "It can be changed on 'less'");
});
QUnit.test("Simple custom trigger", function(assert) {
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
  assert.equal(counterSuccess, 0, "5 != 6");
  assert.equal(counterFalure, 1, "5 != 6");
  trigger.check(6);
  assert.equal(counterSuccess, 1, "6 == 6");
  assert.equal(counterFalure, 1, "6 == 6");
  trigger.value = 2;
  trigger.operator = "contains";
  trigger.check([]);
  assert.equal(counterSuccess, 1, "2 in []");
  assert.equal(counterFalure, 2, "2 in []");
  trigger.check([2, 3]);
  assert.equal(counterSuccess, 2, "2 in [2, 3]");
  assert.equal(counterFalure, 2, "2 not in [2, 3]");

  trigger.value = 2;
  trigger.operator = "notcontains";
  trigger.check([]);
  assert.equal(counterSuccess, 3, "2 not in []");
  assert.equal(counterFalure, 2, "2 not in []");
  trigger.check([2, 3]);
  assert.equal(counterSuccess, 3, "2 not in []");
  assert.equal(counterFalure, 3, "2 not in [2, 3]");
});
QUnit.test("Visibility trigger", function(assert) {
  var owner = new SurveyTriggerVisibleOwnerTester();
  var trigger = new SurveyTriggerVisible();
  trigger.setOwner(owner);
  assert.equal(
    owner.items[0].visible,
    false,
    "By default the item.visible = false"
  );
  trigger.value = 10;
  trigger.check(10);
  assert.equal(owner.items[0].visible, true, "The trigger should succeed");
  trigger.check(11);
  assert.equal(owner.items[0].visible, false, "The trigger should failed");
});

QUnit.test("Visibility trigger", function(assert) {
  var survey = new SurveyModel({
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
  survey.setValue("matrix", [{ col1: 1 }, { col2: 2 }]);
  assert.equal(survey.getValue("q1"), "exec", "Trigger executed correctly");
  survey.setValue("q1", "notExec");
  survey.setValue("matrix", [{ col1: 1, col2: 1 }, { col2: 2 }]);
  assert.equal(
    survey.getValue("q1"),
    "notExec",
    "Trigger not executed correctly"
  );
});
QUnit.test("Clear seValue on setToName property in design mode", function(
  assert
) {
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
  assert.equal(trigger.setToName, "q1");
  assert.equal(trigger.setValue, "1");
  trigger.setToName = "q2";
  assert.equal(trigger.setToName, "q2");
  assert.equal(trigger.setValue, "1");
  survey.setDesignMode(true);
  trigger.setToName = "q1";
  assert.equal(trigger.setToName, "q1");
  assert.notOk(trigger.setValue);
});
QUnit.test("On trigger executed", function(
  assert
) {
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
  assert.deepEqual(triggers, ["setvaluetrigger", "completetrigger"]);
});
QUnit.test("On trigger executed && executeCompleteTriggerOnValueChanged=true", function(
  assert
) {
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
  assert.equal(survey.state, "completed");
  assert.deepEqual(triggers, ["completetrigger"]);
  assert.equal(isCompleteEvent, true);
  assert.equal(completeTrigger.getType(), "completetrigger");
  settings.executeCompleteTriggerOnValueChanged = false;
});
QUnit.test("Show complete button instead of next if complete trigger is going to be executed", function(
  assert
) {
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
  assert.equal(survey.isShowNextButton, true, "#1-next");
  assert.equal(survey.isCompleteButtonVisible, false, "#1-complete");
  survey.setValue("q1", 1);
  assert.equal(survey.isShowNextButton, true, "#2-next");
  assert.equal(survey.isCompleteButtonVisible, false, "#2-complete");
  survey.setValue("q1", 3);
  assert.equal(survey.isShowNextButton, false, "#3-next");
  assert.equal(survey.isCompleteButtonVisible, true, "#3-complete");
  survey.setValue("q1", 5);
  assert.equal(survey.isShowNextButton, true, "#4-next");
  assert.equal(survey.isCompleteButtonVisible, false, "#4-complete");
  survey.setValue("q1", 3);
  assert.equal(survey.isShowNextButton, false, "#5-next");
  assert.equal(survey.isCompleteButtonVisible, true, "#5-complete");
  survey.clear();
  assert.equal(survey.isShowNextButton, true, "#6-next");
  assert.equal(survey.isCompleteButtonVisible, false, "#6-complete");
  settings.changeNavigationButtonsOnCompleteTrigger = false;
  survey.setValue("q1", 3);
  assert.equal(survey.isShowNextButton, true, "#7-next");
  assert.equal(survey.isCompleteButtonVisible, false, "#7-complete");
  settings.changeNavigationButtonsOnCompleteTrigger = true;
});
QUnit.test("Do not execute copy and set trigger on page changed", function(
  assert
) {
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
  assert.deepEqual(survey.data, data, "We do not change anything");
});

QUnit.test("Execute trigger on complete", function(assert) {
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
  assert.deepEqual(survey.data, { q1: 5, q2: "yes" }, "trigger is not executed yet");
  survey.doComplete();
  assert.deepEqual(survey.data, { q1: 5, q2: "yes", q3: 50 }, "trigger is executed");
  Serializer.removeClass("runexpression2trigger");
});

QUnit.test("Trigger with simple matrix", function(assert) {
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
  assert.equal(q1.value, undefined, "#1");
  q1.value = { a: 1 };
  assert.equal(q2.value, undefined, "#2");
  q1.value = { a: 1, b: 2, c: 3 };
  assert.equal(q2.value, 6, "#3");
  q1.value = { a: 3, b: 2, c: 3 };
  assert.equal(q2.value, 8, "#4");
  q1.value = { b: 2, c: 3 };
  assert.equal(q2.value, 8, "#5");
});
QUnit.test("Show complete button instead of next for single matrix, bug#6152", function(assert) {
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
  assert.equal(survey.isShowNextButton, true, "#1-next");
  assert.equal(survey.isCompleteButtonVisible, false, "#1-complete");
  const q1 = survey.getQuestionByName("q1");
  q1.value = { row2: 1 };
  assert.equal(survey.isShowNextButton, false, "#2-next");
  assert.equal(survey.isCompleteButtonVisible, true, "#2-complete");
  q1.value = { row1: 1, row2: 1 };
  assert.equal(survey.isShowNextButton, false, "#3-next");
  assert.equal(survey.isCompleteButtonVisible, true, "#3-complete");
  q1.value = { row1: 1 };
  assert.equal(survey.isShowNextButton, true, "#4-next");
  assert.equal(survey.isCompleteButtonVisible, false, "#4-complete");
  q1.value = { row1: 1, row2: 2 };
  assert.equal(survey.isShowNextButton, true, "#5-next");
  assert.equal(survey.isCompleteButtonVisible, false, "#5-complete");
  q1.value = { row1: 1, row2: 1 };
  assert.equal(survey.isShowNextButton, false, "#6-next");
  assert.equal(survey.isCompleteButtonVisible, true, "#6-complete");
  q1.value = { row1: 2, row2: 1, row3: 2 };
  assert.equal(survey.isShowNextButton, false, "#7-next");
  assert.equal(survey.isCompleteButtonVisible, true, "#7-complete");
});
