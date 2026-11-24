import { checkA11y, injectAxe } from "axe-playwright";
import { axeContext, axeOptions, frameworks, initSurvey, url, baseTest as test } from "./helper";
import { expect } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";
const title = "Filter";

// The Filter Control over a Dynamic Matrix. The dialogs are drawn outside the survey's page (the
// dialog host mounts them into the survey's root element), so each one is checked by its own
// selector; a chip's popup - a field's, the presets' list, Save as... - is drawn inside its chip, and
// checked once it is open.
const json = (filterProps: any = {}): any => ({
  elements: [
    Object.assign({ type: "filter", name: "f1", targetQuestion: "m", showSearchBar: true,
      presets: [{ name: "adults", title: "Adults", expression: "{age} > 18" }, { name: "kids", title: "Kids", expression: "{age} < 18" }],
      defaultPreset: "adults" }, filterProps),
    { type: "matrixdynamic", name: "m", columns: [
      { name: "country", title: "Country", cellType: "dropdown", allowCustomChoices: true,
        choices: [{ value: "de", text: "Germany" }, { value: "fr", text: "France" }] },
      { name: "age", title: "Age", cellType: "text", inputType: "number" }],
    defaultValue: [{ country: "de", age: 30 }, { country: "fr", age: 12 }] }
  ]
});
// The respondent's permissions on presets are off by default: a scenario that adds, edits or deletes one
// turns them on.
const editable = { allowAddPresets: true, allowEditPresets: true, allowDeletePresets: true };
// A dialog by its own class. The close button is the shared popup container's, the same in every
// dialog of the library, and has no accessible name (axe: button-name): a library issue, not the
// control's, so it is left out here.
function dialogContext(selector: string): any {
  return { include: [[selector]], exclude: [[".sv-popup__close-button"]] };
}
function visiblePopup(page: Page, selector: string): Locator {
  return page.locator(".sv-popup__container").filter({ visible: true }).filter({ has: page.locator(selector) });
}

frameworks.forEach((framework) => {
  test.describe(`${framework} a11y:${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await injectAxe(page);
    });
    test("the question, with an active preset", async ({ page }) => {
      await initSurvey(page, framework, json());
      await expect(page.locator(".sd-filter__chip").first()).toBeVisible();
      await checkA11y(page, axeContext, { axeOptions });
    });
    test("the read-only question", async ({ page }) => {
      await initSurvey(page, framework, json({ readOnly: true }));
      await expect(page.locator(".sd-filter__chip").first()).toBeVisible();
      await checkA11y(page, axeContext, { axeOptions });
    });
    test("a chip's open popup, with a typed value", async ({ page }) => {
      await initSurvey(page, framework, json());
      await page.evaluate(() => { (window as any).survey.getQuestionByName("f1").setFieldCondition("country", "anyof", ["de", "zz"]); });
      await page.locator(".sd-filter__chip").filter({ hasText: "Country" }).click();
      await expect(visiblePopup(page, ".sd-filter-popup")).toBeVisible();
      await checkA11y(page, axeContext, { axeOptions });
    });
    test("the presets' open list", async ({ page }) => {
      await initSurvey(page, framework, json());
      await page.locator(".sd-filter .sd-filter__chip--preset").click();
      await expect(visiblePopup(page, ".sv-list")).toBeVisible();
      await checkA11y(page, axeContext, { axeOptions });
    });
    test("Save as...'s open popup", async ({ page }) => {
      await initSurvey(page, framework, json({ defaultPreset: "", allowAddPresets: true }));
      await page.evaluate(() => { (window as any).survey.getQuestionByName("f1").setFieldCondition("country", "anyof", ["de"]); });
      await page.locator(".sd-filter").getByRole("button", { name: "Save as..." }).click();
      await expect(visiblePopup(page, ".sd-filter-popup")).toBeVisible();
      await checkA11y(page, axeContext, { axeOptions });
    });
    test("the Filters dialog", async ({ page }) => {
      await initSurvey(page, framework, json(editable));
      await page.locator(".sd-filter button[title='All Filters']").click();
      await expect(visiblePopup(page, ".sd-filter-modal__content")).toBeVisible();
      await checkA11y(page, dialogContext(".sd-filter-modal"), { axeOptions });
    });
    test("the Filters dialog: nothing found", async ({ page }) => {
      await initSurvey(page, framework, json());
      await page.locator(".sd-filter button[title='All Filters']").click();
      const dialog = visiblePopup(page, ".sd-filter-modal__content");
      await dialog.getByRole("textbox", { name: "Search in filters and presets" }).fill("zzz");
      await expect(dialog.locator(".sd-filter-modal__nothing-found")).toBeVisible();
      await checkA11y(page, dialogContext(".sd-filter-modal"), { axeOptions });
    });
    test("New Preset", async ({ page }) => {
      await initSurvey(page, framework, json(editable));
      await page.locator(".sd-filter button[title='All Filters']").click();
      await visiblePopup(page, ".sd-filter-modal__content").getByRole("button", { name: "Add New..." }).click();
      await expect(visiblePopup(page, ".sd-filter-preset-dialog__content")).toBeVisible();
      await checkA11y(page, dialogContext(".sd-filter-preset-dialog"), { axeOptions });
    });
    test("Edit Preset", async ({ page }) => {
      // Adults is on, so its pill is picked: Edit Selected... opens it.
      await initSurvey(page, framework, json(editable));
      await page.locator(".sd-filter button[title='All Filters']").click();
      await visiblePopup(page, ".sd-filter-modal__content").getByRole("button", { name: "Edit Selected..." }).click();
      await expect(visiblePopup(page, ".sd-filter-preset-dialog__content")).toBeVisible();
      await checkA11y(page, dialogContext(".sd-filter-preset-dialog"), { axeOptions });
    });
  });
});
