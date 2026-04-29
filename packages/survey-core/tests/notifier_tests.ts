import { IAction } from "../src/actions/action";
import { Notifier } from "../src/notifier";
import { settings } from "../src/settings";

import { describe, test, expect } from "vitest";
describe("Notifier model", () => {
  const testCssClasses = {
    root: "alert",
    rootWithButtons: "alert--with-buttons",
    info: "alert-info",
    error: "alert-error",
    success: "alert-success",
    button: "alert-button",
    shown: "alert-shown",
  };

  test("getCssClass", () => {
    const notifier = new Notifier(testCssClasses);

    expect(notifier.getCssClass("error")).toLooseEqual("alert alert-error");
    expect(notifier.getCssClass("info")).toLooseEqual("alert alert-info");
    expect(notifier.getCssClass("text")).toLooseEqual("alert alert-info");
    expect(notifier.getCssClass("success")).toLooseEqual("alert alert-success");
  });

  test("action bar: button css", () => {
    const notifier = new Notifier(testCssClasses);

    expect(!!notifier.actionBar).toBeTruthy();
    expect(notifier.actionBar.actions.length).toLooseEqual(0);

    notifier.addAction(<IAction>{ id: "test", title: "Test" }, "error");
    expect(notifier.actionBar.actions.length).toLooseEqual(1);

    const testAction = notifier.actionBar.actions[0];
    expect(testAction.innerCss).toLooseEqual(testCssClasses.button);
  });

  test("action bar: button visibility", () => {
    const notifier = new Notifier(testCssClasses);
    notifier.addAction(<IAction>{ id: "test", title: "Test" }, "error");
    expect(notifier.actionBar.actions.length).toLooseEqual(1);

    const testAction = notifier.actionBar.actions[0];
    expect(testAction.visible).toLooseEqual(false);

    notifier.updateActionsVisibility("error");
    expect(testAction.visible).toLooseEqual(true);

    notifier.updateActionsVisibility("info");
    expect(testAction.visible).toLooseEqual(false);

    notifier.updateActionsVisibility("error");
    expect(testAction.visible).toLooseEqual(true);

    notifier.updateActionsVisibility("success");
    expect(testAction.visible).toLooseEqual(false);

    expect(notifier.showActions, "showActions default is true").toLooseEqual(true);
    notifier.showActions = false;
    notifier.updateActionsVisibility("error");
    expect(testAction.visible).toLooseEqual(false);

    notifier.showActions = true;
    notifier.updateActionsVisibility("error");
    expect(testAction.visible).toLooseEqual(true);

  });

  test("message box visibility", () => {
    return new Promise(function(resolve) {
      let __remaining = 4;
      const __done = function() { if (--__remaining <= 0) resolve(); };

      const oldLifeTime = settings.notifications.lifetime;
      settings.notifications.lifetime = 10;
      const done = __done;
      const notifier = new Notifier(testCssClasses);
      notifier.notify("Test", "error");

      setTimeout(() => {
        expect(notifier.active).toLooseEqual(true);
        expect(notifier.css).toLooseEqual("alert alert-error alert-shown");
        done();

        setTimeout(() => {
          expect(notifier.active, "success message is hidden").toLooseEqual(false);
          expect(notifier.css).toLooseEqual("alert alert-error");

          done();

          notifier.notify("Error", "error", true);
          setTimeout(() => {
            expect(notifier.active).toLooseEqual(true);
            expect(notifier.css).toLooseEqual("alert alert-error alert-shown");

            done();
            setTimeout(() => {
              expect(notifier.active, "error message is visible").toLooseEqual(true);
              expect(notifier.css).toLooseEqual("alert alert-error alert-shown");

              done();
              settings.notifications.lifetime = oldLifeTime;
            }, settings.notifications.lifetime + 2);
          }, 1);
        }, settings.notifications.lifetime + 2);
      }, 1);
    });
  });

  test("message box check getCssClass method", () => {
    const notifier = new Notifier(testCssClasses);
    notifier.addAction(<IAction>{ id: "test", title: "Test" }, "error");
    notifier.showActions = true;
    notifier.updateActionsVisibility("error");
    expect(notifier.getCssClass("error")).toLooseEqual("alert alert--with-buttons alert-error");
    notifier.showActions = false;
    notifier.updateActionsVisibility("error");
    expect(notifier.getCssClass("error")).toLooseEqual("alert alert-error");
  });
});
