import { describe, test, expect } from "vitest";
import { DomWindowHelper } from "../src/global_variables_utils";

describe("global_variables_utils", () => {
  test("DomWindowHelper: event listeners do not fail if window has no addEventListener, Issue#11573", () => {
    const win = <any>window;
    const savedAdd = win.addEventListener;
    const savedRemove = win.removeEventListener;
    try {
      // React Native exposes a window object that doesn't implement the DOM event API
      delete win.addEventListener;
      delete win.removeEventListener;

      expect(DomWindowHelper.isAvailable(), "window is available").toBe(true);
      expect(DomWindowHelper.isEventListenerAvailable(), "there is no event listener API").toBe(false);

      const listener = () => {};
      DomWindowHelper.addEventListener("resize", listener);
      DomWindowHelper.removeEventListener("resize", listener);
    } finally {
      win.addEventListener = savedAdd;
      win.removeEventListener = savedRemove;
    }
  });
  test("DomWindowHelper: pass options into window.addEventListener/removeEventListener", () => {
    const win = <any>window;
    const savedAdd = win.addEventListener;
    const savedRemove = win.removeEventListener;
    try {
      let addedOptions: any = undefined;
      let removedOptions: any = undefined;
      win.addEventListener = (type: string, listener: any, options: any) => { addedOptions = options; };
      win.removeEventListener = (type: string, listener: any, options: any) => { removedOptions = options; };

      expect(DomWindowHelper.isEventListenerAvailable(), "there is the event listener API").toBe(true);
      const listener = () => {};
      DomWindowHelper.addEventListener("touchmove", listener, { passive: false });
      DomWindowHelper.removeEventListener("touchmove", listener, { capture: true });
      expect(addedOptions, "options are passed on adding a listener").toEqual({ passive: false });
      expect(removedOptions, "options are passed on removing a listener").toEqual({ capture: true });
    } finally {
      win.addEventListener = savedAdd;
      win.removeEventListener = savedRemove;
    }
  });
});
