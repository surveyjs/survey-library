import { describe, test, expect } from "vitest";
import { expandThemeCssVariables } from "../src/utils/base-theme-init";

describe("expandThemeCssVariables", () => {
  test("does nothing when cssVariables is null or undefined", () => {
    expect(() => expandThemeCssVariables(null)).not.toThrow();
    expect(() => expandThemeCssVariables(undefined)).not.toThrow();
  });

  test("keeps literal values untouched", () => {
    const cssVariables = {
      "--sjs2-color-component-header-default-bg": "rgba(25, 179, 148, 1)",
      "--sjs2-base-unit-size": "8px",
    };
    expandThemeCssVariables(cssVariables);
    expect(cssVariables["--sjs2-color-component-header-default-bg"]).toBe("rgba(25, 179, 148, 1)");
    expect(cssVariables["--sjs2-base-unit-size"]).toBe("8px");
  });

  test("expands a bare reference to a base variable into a fallback chain", () => {
    const cssVariables = {
      "--sjs2-color-component-header-default-bg": "var(--sjs2-color-project-brand-600)",
    };
    expandThemeCssVariables(cssVariables);
    expect(cssVariables["--sjs2-color-component-header-default-bg"]).toBe("var(--sjs2-color-project-brand-600, #19B394)");
  });

  test("expands nested base variable chains", () => {
    const cssVariables = {
      "--sjs2-color-component-header-default-bg": "var(--sjs2-color-bg-brand-primary)",
    };
    expandThemeCssVariables(cssVariables);
    expect(cssVariables["--sjs2-color-component-header-default-bg"])
      .toBe("var(--sjs2-color-bg-brand-primary, var(--sjs2-color-project-brand-600, #19B394))");
  });

  test("keeps references that already have a fallback untouched (idempotent)", () => {
    const cssVariables = {
      "--sjs2-color-component-header-default-bg": "var(--sjs2-color-project-brand-600, #19B394)",
    };
    expandThemeCssVariables(cssVariables);
    expect(cssVariables["--sjs2-color-component-header-default-bg"]).toBe("var(--sjs2-color-project-brand-600, #19B394)");
  });

  test("keeps references to unknown variables untouched", () => {
    const cssVariables = {
      "--sjs2-color-component-header-default-bg": "var(--my-custom-color)",
    };
    expandThemeCssVariables(cssVariables);
    expect(cssVariables["--sjs2-color-component-header-default-bg"]).toBe("var(--my-custom-color)");
  });
});
