import { frameworks, url, initSurvey, compareScreenshot, resetFocusToBody, baseTest as test } from "../e2e/helper";
import type { Locator, Page } from "@playwright/test";

const title = "Filter Screenshot";

/* The Filter Control (#11890) as the Figma mockup draws it (Library - Creator, section "filters"):
   the quick filters row, a chip's popup and the dialogs, on a desktop and on a phone. The etalons are
   the same for every framework. */
const columns = [
  { name: "country", title: "Country", cellType: "dropdown",
    choices: [{ value: "de", text: "Germany" }, { value: "fr", text: "France" }, { value: "it", text: "Italy" }] },
  { name: "age", title: "Age", cellType: "text", inputType: "number" },
  { name: "name", title: "Name", cellType: "text" },
  { name: "product", title: "Product", cellType: "dropdown",
    choices: [1, 2, 3, 4, 5, 6, 7, 8].map(i => ({ value: "p" + i, text: "Product " + i })) }
];
const json = (filterProps: any = {}, extraColumns: Array<any> = []): any => ({
  elements: [
    Object.assign({ type: "filter", name: "f1", source: "m", items: [{ name: "adults", title: "Adults", expression: "{age} > 18" }] }, filterProps),
    { type: "matrixdynamic", name: "m", columns: columns.concat(extraColumns),
      defaultValue: [{ country: "de", age: 30, name: "Ann", product: "p1" }, { country: "fr", age: 12, name: "Bob", product: "p2" }] }
  ]
});
const longColumns = (): Array<any> => {
  const res: Array<any> = [];
  for (let i = 1; i <= 10; i++) {
    res.push({ name: "col" + i, title: "Long column title " + i, cellType: "dropdown", choices: ["a", "b"] });
  }
  return res;
};

function chip(page: Page, text: string): Locator {
  return page.locator(".sd-filter__chip").filter({ hasText: text });
}
function popupWith(page: Page, selector: string): Locator {
  return page.locator(".sv-popup__container").filter({ visible: true }).filter({ has: page.locator(selector) });
}
async function openFilters(page: Page): Promise<void> {
  await page.locator(".sd-filter button[title='Filters']").click();
  await popupWith(page, ".sd-filter-modal__content").waitFor({ state: "visible" });
}
// Hover and focus states are not shot: they depend on where the pointer was left.
async function settle(page: Page): Promise<void> {
  await page.mouse.move(0, 0);
  await resetFocusToBody(page);
}

frameworks.forEach(framework => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("quick filters row", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await initSurvey(page, framework, json());
      await settle(page);
      await compareScreenshot(page, ".sd-filter", "filter-chips.png");
      await page.evaluate(() => { (<any>window).survey.getQuestionByName("f1").setFieldCondition("country", "anyof", ["de"]); });
      await settle(page);
      await compareScreenshot(page, ".sd-filter", "filter-chips-active.png");
    });

    test("quick filters row with the search box", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await initSurvey(page, framework, json({ showSearch: true }));
      await settle(page);
      await compareScreenshot(page, ".sd-filter", "filter-search.png");
    });

    test("Show More and Show Less", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await initSurvey(page, framework, json({}, longColumns()));
      await page.locator(".sd-filter").getByRole("button", { name: "Show More" }).waitFor({ state: "visible" });
      await settle(page);
      await compareScreenshot(page, ".sd-filter", "filter-chips-show-more.png");
      await page.locator(".sd-filter").getByRole("button", { name: "Show More" }).click();
      await page.locator(".sd-filter").getByRole("button", { name: "Show Less" }).waitFor({ state: "visible" });
      await settle(page);
      await compareScreenshot(page, ".sd-filter", "filter-chips-show-less.png");
    });

    test("a chip's popup", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await initSurvey(page, framework, json());
      await page.evaluate(() => { (<any>window).survey.getQuestionByName("f1").setFieldCondition("country", "anyof", ["de"]); });
      await chip(page, "Country").click();
      await settle(page);
      await compareScreenshot(page, popupWith(page, ".sd-filter-popup"), "filter-popup-list.png");
      await page.keyboard.press("Escape");
      await popupWith(page, ".sd-filter-popup").waitFor({ state: "hidden" });

      await chip(page, "Product").click();
      await settle(page);
      await compareScreenshot(page, popupWith(page, ".sd-filter-popup"), "filter-popup-list-search.png");
      await page.keyboard.press("Escape");
      await popupWith(page, ".sd-filter-popup").waitFor({ state: "hidden" });

      await chip(page, "Age").click();
      await settle(page);
      await compareScreenshot(page, popupWith(page, ".sd-filter-popup"), "filter-popup-condition.png");
    });

    test("the Filters dialog and the preset dialogs", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await initSurvey(page, framework, json());
      await openFilters(page);
      await settle(page);
      await compareScreenshot(page, popupWith(page, ".sd-filter-modal__content"), "filter-modal.png");

      await popupWith(page, ".sd-filter-modal__content").getByRole("button", { name: "Add Preset" }).click();
      await popupWith(page, ".sd-filter-preset-dialog__form").waitFor({ state: "visible" });
      await settle(page);
      await compareScreenshot(page, popupWith(page, ".sd-filter-preset-dialog__form"), "filter-preset-dialog.png");
    });

    test("Edit Presets", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await initSurvey(page, framework, json());
      await openFilters(page);
      await popupWith(page, ".sd-filter-modal__content").locator(".sd-filter-modal__section-header [title='Edit Presets']").click();
      await popupWith(page, ".sd-filter-preset-dialog__tabs").waitFor({ state: "visible" });
      await settle(page);
      await compareScreenshot(page, popupWith(page, ".sd-filter-preset-dialog__tabs"), "filter-edit-presets-dialog.png");
    });

    // An AI preset's tab: the fields' frame, then the description and Make Changes, in one survey.
    test("Edit Presets: an AI preset", async ({ page }) => {
      // Tall enough for the whole tab: the description is under the fields.
      await page.setViewportSize({ width: 1280, height: 1300 });
      await initSurvey(page, framework, json({ items: [{ name: "grownups", title: "Grown-ups", kind: "ai",
        prompt: "People older than 18", expression: "{age} > 18" }] }));
      await page.evaluate(() => { (<any>window).survey.onAIFilterRequest.add(() => { }); });
      await openFilters(page);
      await popupWith(page, ".sd-filter-modal__content").locator(".sd-filter-modal__section-header [title='Edit Presets']").click();
      await popupWith(page, ".sd-filter-preset-dialog__content .sd-filter-ai-prompt").waitFor({ state: "visible" });
      await settle(page);
      await compareScreenshot(page, popupWith(page, ".sd-filter-preset-dialog__tabs"), "filter-edit-presets-dialog-ai.png");
    });

    test("Create custom filter", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await initSurvey(page, framework, json());
      await page.evaluate(() => { (<any>window).survey.onAIFilterRequest.add(() => { }); });
      await openFilters(page);
      await popupWith(page, ".sd-filter-modal__content").getByRole("button", { name: "Create with AI..." }).click();
      await popupWith(page, ".sd-root-modern .sd-filter-ai-prompt").waitFor({ state: "visible" });
      await settle(page);
      await compareScreenshot(page, popupWith(page, ".sd-root-modern .sd-filter-ai-prompt"), "filter-ai-dialog.png");
    });

    // On a phone a chip's popup is a sheet, which keeps the focus to itself: every shot starts anew.
    async function initPhone(page: Page): Promise<void> {
      await page.setViewportSize({ width: 375, height: 667 });
      await initSurvey(page, framework, json());
      await page.evaluate(() => { (<any>window).survey.setIsMobile(true); });
    }
    test("on a phone: the quick filters row", async ({ page }) => {
      await initPhone(page);
      await settle(page);
      await compareScreenshot(page, ".sd-filter", "filter-chips-mobile.png");
    });
    test("on a phone: a chip's popup", async ({ page }) => {
      await initPhone(page);
      await chip(page, "Country").click();
      await settle(page);
      await compareScreenshot(page, popupWith(page, ".sd-filter-popup"), "filter-popup-mobile.png");
    });
    test("on a phone: the Filters dialog", async ({ page }) => {
      await initPhone(page);
      await openFilters(page);
      await settle(page);
      await compareScreenshot(page, popupWith(page, ".sd-filter-modal__content"), "filter-modal-mobile.png");
    });
  });
});
