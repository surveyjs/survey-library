import { describe, test, expect } from "vitest";
import { patchLegacyCSSVariables } from "../src/themes";
import {
  customPanellessThemeCssVariables,
  defaultLightThemeCssVariables,
  themeFromFileCssVariables,
} from "./legacy-theme-vars";

describe("patchLegacyCSSVariables", () => {
  test("does nothing when cssVariables is null or undefined", () => {
    expect(() => patchLegacyCSSVariables(null)).not.toThrow();
    expect(() => patchLegacyCSSVariables(undefined)).not.toThrow();
  });

  test("patches full legacy theme from file (with panels)", () => {
    const cssVariables = { ...themeFromFileCssVariables };
    patchLegacyCSSVariables(cssVariables, false);

    expect(cssVariables["--sjs2-typography-font-family-text"]).toBe("Segoe");
    expect(cssVariables["--sjs2-base-unit-size"]).toBe("8px");
    expect(cssVariables["--sjs2-base-unit-spacing"]).toBe("8px");
    expect(cssVariables["--sjs2-base-unit-radius"]).toBe("4px");
    expect(cssVariables["--sjs2-color-bg-basic-primary"]).toBe("rgba(253, 255, 148, 0.5)");
    expect(cssVariables["--sjs2-color-bg-neutral-tertiary-dim"]).toBe("#0b864b");
    expect(cssVariables["--sjs2-color-bg-basic-secondary"]).toBe("rgba(45, 235, 223, 1)");
    expect(cssVariables["--sjs2-color-project-brand-600"]).toBe("rgba(229, 244, 154, 1)");
    expect(cssVariables["--sjs2-color-component-formbox-default-bg"]).toBe("rgba(45, 235, 223, 1)");
    expect(cssVariables["--sjs2-radius-form"]).toBe("4px");
    expect(cssVariables["--sjs2-radius-component-panel"]).toBe("6px");
    expect(cssVariables["--sjs2-typography-font-family-component-question-title"]).toBe("Verdana, sans-serif");
    expect(cssVariables["--sjs2-typography-font-weight-component-question-title"]).toBe("700");
    expect(cssVariables["--sjs2-typography-font-size-component-question-title"]).toBe("18px");
    expect(cssVariables["--sjs2-typography-line-height-component-question-title"]).toBe("27px");
    expect(cssVariables["--sjs2-color-component-question-default-title"]).toBe("rgba(201, 90, 231, 0.91)");
    expect(cssVariables["--sjs2-typography-font-family-component-input-content"]).toBe("Arial, sans-serif");
    expect(cssVariables["--sjs2-typography-font-family-component-label-content"]).toBe("Arial, sans-serif");
    expect(cssVariables["--sjs2-typography-font-size-component-input-content"]).toBe("17px");
    expect(cssVariables["--sjs2-typography-line-height-component-input-content"]).toBe("26px");
    expect(cssVariables["--sjs2-typography-font-size-component-label-content"]).toBe("17px");
    expect(cssVariables["--sjs2-typography-line-height-component-label-content"]).toBe("26px");
    expect(cssVariables["--sjs2-color-component-input-default-value"]).toBe("rgba(204, 25, 25, 1)");
    expect(cssVariables["--sjs2-color-component-panel-default-bg"]).toBe("rgba(253, 255, 148, 0.6)");
    expect(cssVariables["--sjs2-color-unknown-variable-001"]).toBe("rgba(237, 238, 186, 1)");
    expect(cssVariables["--sjs2-border-effect-floating-default"]).toBe(
      "0px 2px 6px 0px rgba(0, 0, 0, 0.1),0px 8px 16px 0px rgba(0, 0, 0, 0.1)"
    );
    expect(cssVariables["--sjs2-typography-font-size-component-action-large-content"]).toBe("18px");
    expect(cssVariables["--sjs2-typography-line-height-component-action-large-content"]).toBe("27px");
    expect(cssVariables["--sjs2-color-component-action-brand-tertiary-surface-default-bg"]).toBe("rgba(253, 255, 148, 0.6)");
    expect(cssVariables["--sjs2-color-component-action-brand-tertiary-surface-hovered-bg"]).toBe("rgba(237, 238, 186, 1)");

    expect(cssVariables["--sjs-font-family"]).toBeUndefined();
    expect(cssVariables["--sjs-general-backcolor"]).toBeUndefined();
    expect(cssVariables["--sjs-font-questiontitle-size"]).toBeUndefined();
    expect(cssVariables["--sjs-shadow-medium"]).toBeUndefined();
    expect(cssVariables["--sjs-shadow-large"]).toBeUndefined();

    // Variables without legacy mapping are preserved as-is
    expect(cssVariables["--sjs-secondary-backcolor"]).toBe("rgba(255, 152, 20, 1)");
    expect(cssVariables["--sjs-general-dim-forecolor"]).toBe("rgba(0, 0, 0, 0.91)");
  });

  test("patches custom panelless theme", () => {
    const cssVariables = { ...customPanellessThemeCssVariables };
    patchLegacyCSSVariables(cssVariables, true);

    expect(cssVariables["--sjs2-base-unit-size"]).toBe("6px");
    expect(cssVariables["--sjs2-base-unit-spacing"]).toBe("6px");
    expect(cssVariables["--sjs2-base-unit-radius"]).toBe("20px");
    expect(cssVariables["--sjs2-typography-font-family-text"]).toBe("Open Sans");
    expect(cssVariables["--sjs2-base-unit-font-size"]).toBe("8.8px");
    expect(cssVariables["--sjs2-base-unit-line-height"]).toBe("8.8px");
    expect(cssVariables["--sjs2-color-bg-basic-primary"]).toBe("rgba(253, 255, 148, 0.5)");
    expect(cssVariables["--sjs2-color-bg-basic-secondary"]).toBe("rgba(45, 235, 223, 1)");
    expect(cssVariables["--sjs2-color-bg-basic-secondary-dim"]).toBe("rgba(243, 243, 243, 1)");
    expect(cssVariables["--sjs2-color-project-brand-600"]).toBe("rgba(229, 244, 154, 1)");
    expect(cssVariables["--sjs2-color-component-action-brand-tertiary-surface-default-bg"]).toBe("rgba(45, 235, 223, 1)");
    expect(cssVariables["--sjs2-color-component-action-brand-tertiary-surface-hovered-bg"]).toBe("rgba(243, 243, 243, 1)");

    expect(cssVariables["--sjs-base-unit"]).toBeUndefined();
    expect(cssVariables["--sjs-corner-radius"]).toBeUndefined();
    expect(cssVariables["--sjs-font-size"]).toBeUndefined();
    expect(cssVariables["--sjs-font-family"]).toBeUndefined();
  });

  test("patches default light theme", () => {
    const cssVariables = { ...defaultLightThemeCssVariables };
    patchLegacyCSSVariables(cssVariables, false);

    expect(cssVariables["--sjs2-color-bg-basic-primary"]).toBe("rgba(255, 255, 255, 1)");
    expect(cssVariables["--sjs2-color-bg-basic-primary-dim"]).toBe("rgba(248, 248, 248, 1)");
    expect(cssVariables["--sjs2-color-bg-neutral-tertiary-dim"]).toBe("rgba(243, 243, 243, 1)");
    expect(cssVariables["--sjs2-color-bg-basic-secondary"]).toBe("rgba(249, 249, 249, 1)");
    expect(cssVariables["--sjs2-color-fg-basic-primary"]).toBe("rgba(0, 0, 0, 0.91)");
    expect(cssVariables["--sjs2-color-project-brand-600"]).toBe("rgba(25, 179, 148, 1)");
    expect(cssVariables["--sjs2-color-bg-brand-secondary"]).toBe("rgba(25, 179, 148, 0.1)");
    expect(cssVariables["--sjs2-color-bg-brand-primary-dim"]).toBe("rgba(20, 164, 139, 1)");
    expect(cssVariables["--sjs2-color-fg-brand-on-primary"]).toBe("rgba(255, 255, 255, 1)");
    expect(cssVariables["--sjs2-base-unit-size"]).toBe("8px");
    expect(cssVariables["--sjs2-base-unit-radius"]).toBe("4px");
    expect(cssVariables["--sjs2-color-bg-alert-primary"]).toBe("rgba(229, 10, 62, 1)");
    expect(cssVariables["--sjs2-color-bg-positive-primary"]).toBe("rgba(25, 179, 148, 1)");
    expect(cssVariables["--sjs2-color-bg-note-primary"]).toBe("rgba(67, 127, 217, 1)");
    expect(cssVariables["--sjs2-color-bg-warning-primary"]).toBe("rgba(255, 152, 20, 1)");
    expect(cssVariables["--sjs2-border-effect-floating-default"]).toBe(
      "0px 2px 6px 0px rgba(0, 0, 0, 0.1),0px 8px 16px 0px rgba(0, 0, 0, 0.1)"
    );

    expect(cssVariables["--sjs-general-backcolor"]).toBeUndefined();
    expect(cssVariables["--sjs-primary-backcolor"]).toBeUndefined();
    expect(cssVariables["--sjs-base-unit"]).toBeUndefined();
  });

  test("uses panelless action button backgrounds from dim colors", () => {
    const cssVariables = {
      "--sjs-general-backcolor-dim-light": "rgba(45, 235, 223, 1)",
      "--sjs-general-backcolor-dim-dark": "rgba(243, 243, 243, 1)",
      "--sjs-editorpanel-hovercolor": "rgba(70, 143, 221, 1)",
    };
    patchLegacyCSSVariables(cssVariables, true);

    expect(cssVariables["--sjs2-color-component-action-brand-tertiary-surface-default-bg"]).toBe("rgba(45, 235, 223, 1)");
    expect(cssVariables["--sjs2-color-component-action-brand-tertiary-surface-hovered-bg"]).toBe("rgba(70, 143, 221, 1)");
    expect(cssVariables["--sjs-general-backcolor-dim-light"]).toBeUndefined();
    expect(cssVariables["--sjs-editorpanel-hovercolor"]).toBeUndefined();
  });

  test("uses panel action button backgrounds from question panel colors", () => {
    const cssVariables = {
      "--sjs-questionpanel-backcolor": "rgba(253, 255, 148, 0.6)",
      "--sjs-questionpanel-hovercolor": "rgba(237, 238, 186, 1)",
      "--sjs-general-backcolor": "rgba(253, 255, 148, 0.5)",
      "--sjs-general-backcolor-dark": "rgba(248, 248, 248, 1)",
    };
    patchLegacyCSSVariables(cssVariables, false);

    expect(cssVariables["--sjs2-color-component-action-brand-tertiary-surface-default-bg"]).toBe("rgba(253, 255, 148, 0.6)");
    expect(cssVariables["--sjs2-color-component-action-brand-tertiary-surface-hovered-bg"]).toBe("rgba(237, 238, 186, 1)");
  });

  test("falls back to general backcolor for panel action buttons when question panel colors are absent", () => {
    const cssVariables = {
      "--sjs-general-backcolor": "rgba(253, 255, 148, 0.5)",
      "--sjs-general-backcolor-dark": "rgba(248, 248, 248, 1)",
    };
    patchLegacyCSSVariables(cssVariables, false);

    expect(cssVariables["--sjs2-color-component-action-brand-tertiary-surface-default-bg"]).toBe("rgba(253, 255, 148, 0.5)");
    expect(cssVariables["--sjs2-color-component-action-brand-tertiary-surface-hovered-bg"]).toBe("rgba(248, 248, 248, 1)");
  });

  test("computes typography line heights from font sizes", () => {
    const cssVariables = {
      "--sjs-font-headertitle-size": "32px",
      "--sjs-font-headerdescription-size": "20px",
      "--sjs-font-pagetitle-size": "24px",
    };
    patchLegacyCSSVariables(cssVariables);

    expect(cssVariables["--sjs2-typography-font-size-component-header-title"]).toBe("32px");
    expect(cssVariables["--sjs2-typography-line-height-component-header-title"]).toBe("40px");
    expect(cssVariables["--sjs2-typography-font-size-component-header-description"]).toBe("20px");
    expect(cssVariables["--sjs2-typography-line-height-component-header-description"]).toBe("30px");
    expect(cssVariables["--sjs2-typography-font-size-component-page-title"]).toBe("24px");
    expect(cssVariables["--sjs2-typography-line-height-component-page-title"]).toBe("32px");
  });

  test("does not overwrite existing line height variables", () => {
    const cssVariables = {
      "--sjs-font-questiontitle-size": "18px",
      "--sjs2-typography-line-height-component-question-title": "22px",
    };
    patchLegacyCSSVariables(cssVariables);

    expect(cssVariables["--sjs2-typography-font-size-component-question-title"]).toBe("18px");
    expect(cssVariables["--sjs2-typography-line-height-component-question-title"]).toBe("22px");
  });
});
