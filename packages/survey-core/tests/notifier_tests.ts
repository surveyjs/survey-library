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

    expect(notifier.getCssClass("error")).toBe("alert alert-error");
    expect(notifier.getCssClass("info")).toBe("alert alert-info");
    expect(notifier.getCssClass("text")).toBe("alert alert-info");
    expect(notifier.getCssClass("success")).toBe("alert alert-success");
  });

  test("action bar: button css", () => {
    const notifier = new Notifier(testCssClasses);

    expect(!!notifier.actionBar).toBeTruthy();
    expect(notifier.actionBar.actions.length).toBe(0);

    notifier.addAction(<IAction>{ id: "test", title: "Test" }, "error");
    expect(notifier.actionBar.actions.length).toBe(1);

    const testAction = notifier.actionBar.actions[0];
    expect(testAction.innerCss).toBe(testCssClasses.button);
  });

  test("action bar: button visibility", () => {
    const notifier = new Notifier(testCssClasses);
    notifier.addAction(<IAction>{ id: "test", title: "Test" }, "error");
    expect(notifier.actionBar.actions.length).toBe(1);

    const testAction = notifier.actionBar.actions[0];
    expect(testAction.visible).toBe(false);

    notifier.updateActions("error");
    expect(testAction.visible).toBe(true);
    expect(testAction.appearance.style).toBe("alert");

    notifier.updateActions("info");
    expect(testAction.visible).toBe(false);
    expect(testAction.appearance.style).toBe("neutral");

    notifier.updateActions("error");
    expect(testAction.visible).toBe(true);
    expect(testAction.appearance.style).toBe("alert");

    notifier.updateActions("success");
    expect(testAction.visible).toBe(false);
    expect(testAction.appearance.style).toBe("brand");

    expect(notifier.showActions, "showActions default is true").toBe(true);
    notifier.showActions = false;
    notifier.updateActions("error");
    expect(testAction.visible).toBe(false);
    expect(testAction.appearance.style).toBe("alert");

    notifier.showActions = true;
    notifier.updateActions("error");
    expect(testAction.visible).toBe(true);
    expect(testAction.appearance.style).toBe("alert");

  });

  test("message box visibility", () => {
    vi.useFakeTimers();
    const oldLifeTime = settings.notifications.lifetime;
    settings.notifications.lifetime = 10;
    try {
      const notifier = new Notifier(testCssClasses);
      notifier.notify("Test", "error");

      vi.advanceTimersByTime(1);
      expect(notifier.active).toBe(true);
      expect(notifier.css).toBe("alert alert-error alert-shown");

      vi.advanceTimersByTime(settings.notifications.lifetime + 2);
      expect(notifier.active, "success message is hidden").toBe(false);
      expect(notifier.css).toBe("alert alert-error");

      notifier.notify("Error", "error", true);
      vi.advanceTimersByTime(1);
      expect(notifier.active).toBe(true);
      expect(notifier.css).toBe("alert alert-error alert-shown");

      vi.advanceTimersByTime(settings.notifications.lifetime + 2);
      expect(notifier.active, "error message is visible").toBe(true);
      expect(notifier.css).toBe("alert alert-error alert-shown");
    } finally {
      settings.notifications.lifetime = oldLifeTime;
      vi.useRealTimers();
    }
  });

  test("message box check getCssClass method", () => {
    const notifier = new Notifier(testCssClasses);
    notifier.addAction(<IAction>{ id: "test", title: "Test" }, "error");
    notifier.showActions = true;
    notifier.updateActions("error");
    expect(notifier.getCssClass("error")).toBe("alert alert--with-buttons alert-error");
    notifier.showActions = false;
    notifier.updateActions("error");
    expect(notifier.getCssClass("error")).toBe("alert alert-error");
  });
});
