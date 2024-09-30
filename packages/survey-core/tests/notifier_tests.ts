import { IAction } from "../src/actions/action";
import { Notifier } from "../src/notifier";
import { settings } from "../src/settings";

export default QUnit.module("Notifier model");

const testCssClasses = {
  root: "alert",
  rootWithButtons: "alert--with-buttons",
  info: "alert-info",
  error: "alert-error",
  success: "alert-success",
  button: "alert-button",
  shown: "alert-shown",
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

  assert.equal(notifier.showActions, true, "showActions default is true");
  notifier.showActions = false;
  notifier.updateActionsVisibility("error");
  assert.equal(testAction.visible, false);

  notifier.showActions = true;
  notifier.updateActionsVisibility("error");
  assert.equal(testAction.visible, true);

});

QUnit.test("message box visibility", function (assert) {
  const oldLifeTime = settings.notifications.lifetime;
  settings.notifications.lifetime = 10;
  const done = assert.async(4);
  const notifier = new Notifier(testCssClasses);
  notifier.notify("Test", "error");

  setTimeout(() => {
    assert.equal(notifier.active, true);
    assert.equal(notifier.css, "alert alert-error alert-shown");
    done();

    setTimeout(() => {
      assert.equal(notifier.active, false, "success message is hidden");
      assert.equal(notifier.css, "alert alert-error");

      done();

      notifier.notify("Error", "error", true);
      setTimeout(() => {
        assert.equal(notifier.active, true);
        assert.equal(notifier.css, "alert alert-error alert-shown");

        done();
        setTimeout(() => {
          assert.equal(notifier.active, true, "error message is visible");
          assert.equal(notifier.css, "alert alert-error alert-shown");

          done();
          settings.notifications.lifetime = oldLifeTime;
        }, settings.notifications.lifetime + 2);
      }, 1);
    }, settings.notifications.lifetime + 2);
  }, 1);
});

QUnit.test("message box check getCssClass method", function (assert) {
  const notifier = new Notifier(testCssClasses);
  notifier.addAction(<IAction>{ id: "test", title: "Test" }, "error");
  notifier.showActions = true;
  notifier.updateActionsVisibility("error");
  assert.equal(notifier.getCssClass("error"), "alert alert--with-buttons alert-error");
  notifier.showActions = false;
  notifier.updateActionsVisibility("error");
  assert.equal(notifier.getCssClass("error"), "alert alert-error");
});