import { frameworks, url, initSurvey, test, expect } from "../helper";
import type { Page } from "@playwright/test";

const title = "Filter";

/* The Filter Control (#11890) over a dynamic matrix, the same in every framework: a chip's popup
   filters the rows, Show More cuts the chips to one row, the Filters dialog shows the presets and the
   fields, and Add Preset opens the preset dialog. */
const columns = [
  { name: "country", title: "Country", cellType: "dropdown",
    choices: [{ value: "de", text: "Germany" }, { value: "fr", text: "France" }, { value: "it", text: "Italy" }] },
  { name: "age", title: "Age", cellType: "text", inputType: "number" }
];
const json = (extraColumns: Array<any> = []): any => ({
  elements: [
    { type: "filter", name: "f1", source: "m", items: [{ name: "adults", title: "Adults", expression: "{age} > 18" }] },
    { type: "matrixdynamic", name: "m", columns: columns.concat(extraColumns),
      defaultValue: [{ country: "de", age: 30 }, { country: "fr", age: 12 }, { country: "it", age: 45 }] }
  ]
});
const longColumns = (): Array<any> => {
  const res: Array<any> = [];
  for (let i = 1; i <= 10; i++) {
    // A choice column gets a chip of its own in the quick filters row; a text column does not.
    res.push({ name: "col" + i, title: "Long column title " + i, cellType: "dropdown", choices: ["a", "b"] });
  }
  return res;
};

async function getVisibleRowCount(page: Page): Promise<number> {
  return await page.evaluate(() => (window as any).survey.getQuestionByName("m").visibleRows.length);
}

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await page.setViewportSize({ width: 1000, height: 800 });
    });

    test("a chip filters the rows", async ({ page }) => {
      await initSurvey(page, framework, json());
      expect(await getVisibleRowCount(page)).toBe(3);
      const chip = page.locator(".sd-filter__chip").filter({ hasText: "Country" });
      await chip.click();
      const popup = page.locator(".sv-popup__container").filter({ visible: true }).filter({ has: page.locator(".sd-filter-popup") });
      await expect(popup).toBeVisible();
      const chipBox = await chip.boundingBox();
      const popupBox = await popup.boundingBox();
      expect(popupBox.y, "the popup opens under its chip").toBeGreaterThanOrEqual(chipBox.y + chipBox.height - 1);
      expect(popupBox.y, "the popup opens next to its chip").toBeLessThanOrEqual(chipBox.y + chipBox.height + 50);
      await popup.locator(".sd-filter-popup__item").filter({ hasText: "Germany" }).click();
      await popup.getByRole("button", { name: "Apply" }).click();
      await expect(popup).toBeHidden();
      expect(await getVisibleRowCount(page)).toBe(1);
    });

    test("Show More cuts the chips to one row", async ({ page }) => {
      await initSurvey(page, framework, json(longColumns()));
      const showMore = page.locator(".sd-filter").getByRole("button", { name: "Show More" });
      await expect(showMore).toBeVisible();
      expect(await page.locator(".sd-filter .sd-filter__chip--overflow").count()).toBeGreaterThan(0);
      await showMore.click();
      await expect(page.locator(".sd-filter .sd-filter__chip--overflow")).toHaveCount(0);
      await expect(page.locator(".sd-filter").getByRole("button", { name: "Show Less" })).toBeVisible();
    });

    test("the Filters dialog shows presets and fields", async ({ page }) => {
      await initSurvey(page, framework, json());
      await page.locator(".sd-filter button[title='Filters']").click();
      const dialog = page.locator(".sd-filter-modal__content").filter({ visible: true });
      await expect(dialog).toBeVisible();
      await expect(dialog.locator(".sd-filter-modal__section-title")).toHaveText("Filter Presets");
      await expect(dialog).toContainText("Adults");
      await expect(dialog.locator(".sd-filter-modal__editor")).toBeVisible();
    });

    test("Add Preset opens the preset dialog", async ({ page }) => {
      await initSurvey(page, framework, json());
      await page.locator(".sd-filter button[title='Filters']").click();
      const dialog = page.locator(".sd-filter-modal__content").filter({ visible: true });
      await dialog.getByRole("button", { name: "Add Preset" }).click();
      await expect(page.locator(".sd-filter-preset-dialog__form input").filter({ visible: true })).toBeVisible();
    });
  });
});
