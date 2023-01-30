import { IAction } from "../src/actions/action";
import { Notifier } from "../src/notifier";

export default QUnit.module("Notifier model");

const testCssClasses = {
  root: "alert",
  info: "alert-info",
  error: "alert-error",
  success: "alert-success",
  button: "alert-button",
};

QUnit.test("getCssClass", function (assert) {
  const notifier = new Notifier(testCssClasses);

  assert.equal(notifier.getCssClass("error"), "alert alert-error");
  assert.equal(notifier.getCssClass("info"), "alert alert-info");
  assert.equal(notifier.getCssClass("text"), "alert alert-info");
  assert.equal(notifier.getCssClass("success"), "alert alert-success");
});

QUnit.test("action bar: button css", function (assert) {
  const notifier = new Notifier(testCssClasses);

  assert.ok(!!notifier.actionBar);
  assert.equal(notifier.actionBar.actions.length, 0);

  notifier.addAction(<IAction>{ id: "test", title: "Test" }, "error");
  assert.equal(notifier.actionBar.actions.length, 1);

  const testAction = notifier.actionBar.actions[0];
  assert.equal(testAction.innerCss, testCssClasses.button);
});

QUnit.test("action bar: button visibility", function (assert) {
  const notifier = new Notifier(testCssClasses);
  notifier.addAction(<IAction>{ id: "test", title: "Test" }, "error");
  assert.equal(notifier.actionBar.actions.length, 1);

  const testAction = notifier.actionBar.actions[0];
  assert.equal(testAction.visible, false);

  notifier.updateActionsVisibility("error");
  assert.equal(testAction.visible, true);

  notifier.updateActionsVisibility("info");
  assert.equal(testAction.visible, false);

  notifier.updateActionsVisibility("error");
  assert.equal(testAction.visible, true);

  notifier.updateActionsVisibility("success");
  assert.equal(testAction.visible, false);
});