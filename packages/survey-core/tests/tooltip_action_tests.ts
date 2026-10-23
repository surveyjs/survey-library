import { Action } from "../src/actions/action";
import { describe, test, expect, vi } from "vitest";

// Kept in its own file: tooltip listeners are installed once per document, so any
// other test calling initTooltips() first would make this one pass vacuously.
describe("Action tooltips", () => {
  test("rendering an action installs tooltip support for the document", () => {
    vi.useFakeTimers();
    const button = document.createElement("button");
    button.setAttribute("data-sv-tooltip", "Delete");
    document.body.appendChild(button);

    button.dispatchEvent(new MouseEvent("pointerover", { bubbles: true }));
    vi.advanceTimersByTime(200);
    expect(document.body.querySelector(".sv-tooltip--visible")).toBeNull();

    new Action({ id: "delete", iconName: "icon-delete", title: "Delete" }).setInputElement(button);
    button.dispatchEvent(new MouseEvent("pointerover", { bubbles: true }));
    vi.advanceTimersByTime(200);
    expect(document.body.querySelector(".sv-tooltip--visible")?.textContent).toBe("Delete");

    button.remove();
    vi.useRealTimers();
  });
});
