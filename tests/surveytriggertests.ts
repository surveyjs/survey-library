import {
  Trigger,
  ISurveyTriggerOwner,
  SurveyTriggerVisible
} from "../src/trigger";

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
    { name: "Item2", visible: true }
  ];
  getObjects(pages: string[], questions: string[]): any[] {
    return this.items;
  }
  setCompleted() {}
  setTriggerValue(name: string, value: any, isVariable: boolean) {}
  copyTriggerValue(name: string, fromName: string) {}
  focusQuestion(name: string): boolean { return true; }
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
