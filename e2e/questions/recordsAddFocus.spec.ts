import { frameworks, url, initSurvey, test, expect, getButtonByText } from "../helper";
import type { Page } from "@playwright/test";

const title = "records: the focus after an add";

/* "Add" moves the focus to the first question of the new record a respondent can answer: a read-only
   first question is skipped. The focused input is scrolled into view, and with paging the new record
   is shown on the page it lands on. Every case runs with animations off and on: an animated add
   focuses the new record when its animation ends. */
const panelJSON = (props: any): any => ({
  elements: [Object.assign({
    type: "paneldynamic", name: "people", panelCount: 4,
    templateElements: [
      { type: "text", name: "id", title: "Id", readOnly: true },
      { type: "text", name: "name", title: "Name" },
      { type: "text", name: "city", title: "City" }
    ]
  }, props)]
});
const matrixJSON = (props: any): any => ({
  elements: [Object.assign({
    type: "matrixdynamic", name: "orders", rowCount: 12,
    columns: [
      { name: "id", title: "Id", cellType: "text", readOnly: true },
      { name: "name", title: "Name", cellType: "text" },
      { name: "city", title: "City", cellType: "text" }
    ]
  }, props)]
});

async function getRecords(page: Page, name: string): Promise<Array<any>> {
  return await page.evaluate((name: string) => (window as any).survey.getValue(name), name);
}
// Types into the focused input and leaves it, so that the text is committed to the record.
async function typeAndLeave(page: Page, text: string): Promise<void> {
  await page.keyboard.type(text);
  await page.keyboard.press("Tab");
}

frameworks.forEach((framework) => {
  [false, true].forEach((animated) => {
    const suffix = animated ? ", animated" : "";
    test.describe(`${framework} ${title}${suffix}`, () => {
      test.beforeEach(async ({ page }) => {
        await page.goto(`${url}${framework}`);
        await page.setViewportSize({ width: 1280, height: 700 });
      });
      async function init(page: Page, json: any): Promise<void> {
        await initSurvey(page, framework, json);
        if (animated) {
          await page.evaluate(() => {
            (window as any).Survey.settings.animationEnabled = true;
            (window as any).Survey.settings.animation.respectReducedMotion = false;
          });
        }
      }

      test("panel: the first answerable question of the new panel is focused and visible", async ({ page }) => {
        await init(page, panelJSON({}));
        await getButtonByText(page, "Add new").click();
        const nameInputs = page.getByRole("textbox", { name: "Name" });
        await expect(nameInputs).toHaveCount(5);
        await expect(nameInputs.last()).toBeFocused();
        await expect(nameInputs.last()).toBeInViewport();
        await typeAndLeave(page, "Ann");
        const records = await getRecords(page, "people");
        expect(records.length).toBe(5);
        expect(records[4]).toEqual({ name: "Ann" });
      });

      test("panel with paging: the new panel is shown on its page, focused and visible", async ({ page }) => {
        await init(page, panelJSON({ panelsPerPage: 2 }));
        await getButtonByText(page, "Add new").click();
        const nameInputs = page.getByRole("textbox", { name: "Name" });
        await expect(nameInputs, "the page shows the new panel only").toHaveCount(1);
        await expect(nameInputs).toBeFocused();
        await expect(nameInputs).toBeInViewport();
        await typeAndLeave(page, "Ann");
        const records = await getRecords(page, "people");
        expect(records.length).toBe(5);
        expect(records[4]).toEqual({ name: "Ann" });
      });

      test("panel in carousel mode with paging: the new panel is shown, focused and visible", async ({ page }) => {
        await init(page, panelJSON({ displayMode: "carousel", panelsPerPage: 2 }));
        // The carousel shows "Add new" on its last panel.
        for (let i = 0; i < 3; i++) {
          await getButtonByText(page, "Next").click();
        }
        await expect(page.getByText("4 of 4")).toBeVisible();
        await getButtonByText(page, "Add new").click();
        await expect(page.getByText("5 of 5")).toBeVisible();
        const nameInputs = page.getByRole("textbox", { name: "Name" });
        // The panel the carousel leaves is gone once the animation ends.
        await expect(nameInputs).toHaveCount(1);
        await expect(nameInputs).toBeFocused();
        await expect(nameInputs).toBeInViewport();
        await typeAndLeave(page, "Ann");
        const records = await getRecords(page, "people");
        expect(records.length).toBe(5);
        expect(records[4]).toEqual({ name: "Ann" });
      });

      test("matrix: the first answerable cell of the new row is focused and visible", async ({ page }) => {
        await init(page, matrixJSON({}));
        await getButtonByText(page, "Add Row").click();
        const nameCells = page.getByRole("textbox", { name: /column Name$/ });
        await expect(nameCells).toHaveCount(13);
        await expect(nameCells.last()).toBeFocused();
        await expect(nameCells.last()).toBeInViewport();
        await typeAndLeave(page, "Ann");
        const records = await getRecords(page, "orders");
        expect(records.length).toBe(13);
        expect(records[12]).toEqual({ name: "Ann" });
      });

      test("matrix with paging: the new row is shown on its page, focused and visible", async ({ page }) => {
        await init(page, matrixJSON({ rowCount: 10, rowsPerPage: 5 }));
        await getButtonByText(page, "Add Row").click();
        const nameCells = page.getByRole("textbox", { name: /column Name$/ });
        await expect(nameCells, "the page shows the new row only").toHaveCount(1);
        await expect(nameCells).toBeFocused();
        await expect(nameCells).toBeInViewport();
        await typeAndLeave(page, "Ann");
        const records = await getRecords(page, "orders");
        expect(records.length).toBe(11);
        expect(records[10]).toEqual({ name: "Ann" });
      });
    });
  });
});
