import { frameworks, url, initSurvey, compareScreenshot, resetFocusToBody, baseTest as test } from "../e2e/helper";
import { expect } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";

const title = "Filter Screenshot";

/* The Filter Control (#11890) as the Figma mockup draws it (Library - Creator, section "filters
   v2"): the quick filters row, a chip's popup, the presets' list, Save as... and the dialogs, on a
   desktop and on a phone. The etalons are the same for every framework. */
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
// The pill of a preset in the Filters dialog, then Edit Selected...: Edit Preset of that preset.
async function openEditPreset(page: Page, presetTitle: string): Promise<Locator> {
  const modal = popupWith(page, ".sd-filter-modal__content");
  await modal.getByRole("checkbox", { name: presetTitle }).click();
  await modal.getByRole("button", { name: "Edit Selected..." }).click();
  const dialog = popupWith(page, ".sd-filter-preset-dialog__content");
  await dialog.waitFor({ state: "visible" });
  return dialog;
}
// Hover and focus states are not shot: they depend on where the pointer was left.
async function settle(page: Page): Promise<void> {
  await page.mouse.move(0, 0);
  await resetFocusToBody(page);
}
// A dialog or a popup with a text box focuses it 100 ms after it shows (focusFirstInput): a shot
// waits for that, or it catches the focus by chance. js-ui draws in a shadow root, where
// document.activeElement is its host.
async function waitForInputFocus(container: Locator): Promise<void> {
  await expect.poll(() => container.evaluate((el: HTMLElement) => {
    let active: Element | null = document.activeElement;
    while(!!active && !!active.shadowRoot && !!active.shadowRoot.activeElement) active = active.shadowRoot.activeElement;
    return !!active && el.contains(active) && (active.tagName === "INPUT" || active.tagName === "TEXTAREA");
  })).toBe(true);
}
// A dialog is shot with no focus, as the mockup draws it.
async function settleDialog(page: Page, dialog: Locator): Promise<void> {
  await waitForInputFocus(dialog);
  await settle(page);
}
// A popup keeps the focus on its text box: taking it away can close the popup.
async function settlePopup(page: Page, popup: Locator): Promise<void> {
  await waitForInputFocus(popup);
  await page.mouse.move(0, 0);
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
      await page.evaluate(() => { (<any>window).survey.getQuestionByName("f1").toggleItem("adults"); });
      await settle(page);
      await compareScreenshot(page, ".sd-filter", "filter-chips-active-preset.png");
    });

    test("the presets' list and Save as...", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await initSurvey(page, framework, json({ items: [{ name: "adults", title: "Adults", expression: "{age} > 18" },
        { name: "kids", title: "Kids", expression: "{age} < 18" }], defaultItem: "kids" }));
      await page.locator(".sd-filter .sd-filter__chip--preset").click();
      await popupWith(page, ".sv-list").waitFor({ state: "visible" });
      await settle(page);
      await compareScreenshot(page, popupWith(page, ".sv-list"), "filter-chips-preset-popup.png");
      await page.keyboard.press("Escape");
      await popupWith(page, ".sv-list").waitFor({ state: "hidden" });

      await page.evaluate(() => {
        const q = (<any>window).survey.getQuestionByName("f1");
        q.clearActiveItem();
        q.setFieldCondition("country", "anyof", ["de"]);
      });
      await page.locator(".sd-filter").getByRole("button", { name: "Save as..." }).click();
      await settlePopup(page, popupWith(page, ".sd-filter-popup"));
      await compareScreenshot(page, popupWith(page, ".sd-filter-popup"), "filter-chips-save-as.png");
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
      await settlePopup(page, popupWith(page, ".sd-filter-popup"));
      await compareScreenshot(page, popupWith(page, ".sd-filter-popup"), "filter-popup-list-search.png");
      await page.keyboard.press("Escape");
      await popupWith(page, ".sd-filter-popup").waitFor({ state: "hidden" });

      await chip(page, "Age").click();
      await settlePopup(page, popupWith(page, ".sd-filter-popup"));
      await compareScreenshot(page, popupWith(page, ".sd-filter-popup"), "filter-popup-condition.png");
    });

    // A value the respondent typed is listed after the field's values, checked, with no button of its own.
    test("a chip's popup with a typed value", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await initSurvey(page, framework, json({}, [{ name: "city", title: "City", cellType: "dropdown", allowCustomChoices: true,
        choices: ["Berlin", "Paris"] }]));
      await page.evaluate(() => { (<any>window).survey.getQuestionByName("f1").setFieldCondition("city", "anyof", ["Berlin", "Rome"]); });
      await chip(page, "City").click();
      await settlePopup(page, popupWith(page, ".sd-filter-popup"));
      await compareScreenshot(page, popupWith(page, ".sd-filter-popup"), "filter-popup-custom-value.png");
    });

    // A read-only control: the chips are disabled, and the active preset's chip still shows it is on.
    test("a read-only control", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await initSurvey(page, framework, json({ readOnly: true, defaultItem: "adults", showSearch: true }));
      await settle(page);
      await compareScreenshot(page, ".sd-filter", "filter-chips-read-only.png");
    });

    test("right to left: the quick filters row and the Filters dialog", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.evaluate(() => { document.body.setAttribute("dir", "rtl"); });
      // The search box has the icon whose padding faces the box's edge.
      await initSurvey(page, framework, json({ showSearch: true, defaultItem: "adults" }));
      await settle(page);
      await compareScreenshot(page, ".sd-filter", "filter-search-rtl.png");
      await openFilters(page);
      // The dialog focuses its search box 100 ms after it shows (focusFirstInput): settle after that.
      await expect(popupWith(page, ".sd-filter-modal__content").getByRole("textbox").first()).toBeFocused();
      await settle(page);
      await compareScreenshot(page, popupWith(page, ".sd-filter-modal__content"), "filter-modal-rtl.png");
    });

    test("the Filters dialog and the preset dialogs", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await initSurvey(page, framework, json());
      await openFilters(page);
      await settleDialog(page, popupWith(page, ".sd-filter-modal__content"));
      await compareScreenshot(page, popupWith(page, ".sd-filter-modal__content"), "filter-modal.png");

      await popupWith(page, ".sd-filter-modal__content").getByRole("button", { name: "Add New..." }).click();
      await settleDialog(page, popupWith(page, ".sd-filter-preset-dialog__form"));
      await compareScreenshot(page, popupWith(page, ".sd-filter-preset-dialog__form"), "filter-preset-dialog.png");
    });

    // Search in Filters: the fields and the values found, then nothing found.
    test("the Filters dialog: Search in Filters", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await initSurvey(page, framework, json());
      await openFilters(page);
      const modal = popupWith(page, ".sd-filter-modal__content");
      await waitForInputFocus(modal);
      await modal.getByRole("textbox", { name: "Search in Filters" }).fill("germ");
      await settle(page);
      await compareScreenshot(page, modal, "filter-modal-search.png");
      await modal.getByRole("textbox", { name: "Search in Filters" }).fill("zzz");
      await modal.locator(".sd-filter-modal__nothing-found").waitFor({ state: "visible" });
      await settle(page);
      await compareScreenshot(page, modal, "filter-modal-search-empty.png");
    });

    test("Edit Preset", async ({ page }) => {
      // Tall enough for the whole dialog: at 900 it scrolls and cuts the footer.
      await page.setViewportSize({ width: 1280, height: 1300 });
      await initSurvey(page, framework, json());
      await openFilters(page);
      const dialog = await openEditPreset(page, "Adults");
      await settleDialog(page, dialog);
      await compareScreenshot(page, dialog, "filter-edit-preset-dialog.png");
    });

    // While the application answers AI requests: the fields' frame, then the description and Edit, in
    // one survey.
    test("Edit Preset: the AI description", async ({ page }) => {
      // Tall enough for the whole dialog: the description is under the fields.
      await page.setViewportSize({ width: 1280, height: 1300 });
      await initSurvey(page, framework, json({ items: [{ name: "grownups", title: "Grown-ups", expression: "{age} > 18" }] }));
      await page.evaluate(() => { (<any>window).survey.onAIFilterRequest.add(() => { }); });
      await openFilters(page);
      const dialog = await openEditPreset(page, "Grown-ups");
      await dialog.locator(".sd-filter-ai-prompt").waitFor({ state: "visible" });
      await settleDialog(page, dialog);
      await compareScreenshot(page, dialog, "filter-edit-preset-dialog-ai.png");
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
      await settleDialog(page, popupWith(page, ".sd-filter-modal__content"));
      await compareScreenshot(page, popupWith(page, ".sd-filter-modal__content"), "filter-modal-mobile.png");
    });
    test("on a phone: Edit Preset", async ({ page }) => {
      await initPhone(page);
      await openFilters(page);
      const dialog = await openEditPreset(page, "Adults");
      await settleDialog(page, dialog);
      await compareScreenshot(page, dialog, "filter-edit-preset-dialog-mobile.png");
    });
  });
});
