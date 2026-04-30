import { IAction } from "../src/actions/action";
import { Notifier } from "../src/notifier";
import { settings } from "../src/settings";

import { describe, test, expect, vi } from "vitest";
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
    vi.useFakeTimers();
    const oldLifeTime = settings.notifications.lifetime;
    settings.notifications.lifetime = 10;
    try {
      const notifier = new Notifier(testCssClasses);
      notifier.notify("Test", "error");

      vi.advanceTimersByTime(1);
      expect(notifier.active).toLooseEqual(true);
      expect(notifier.css).toLooseEqual("alert alert-error alert-shown");

      vi.advanceTimersByTime(settings.notifications.lifetime + 2);
      expect(notifier.active, "success message is hidden").toLooseEqual(false);
      expect(notifier.css).toLooseEqual("alert alert-error");

      notifier.notify("Error", "error", true);
      vi.advanceTimersByTime(1);
      expect(notifier.active).toLooseEqual(true);
      expect(notifier.css).toLooseEqual("alert alert-error alert-shown");

      vi.advanceTimersByTime(settings.notifications.lifetime + 2);
      expect(notifier.active, "error message is visible").toLooseEqual(true);
      expect(notifier.css).toLooseEqual("alert alert-error alert-shown");
    } finally {
      settings.notifications.lifetime = oldLifeTime;
      vi.useRealTimers();
    }
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
