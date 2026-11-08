import { frameworks, url, initSurvey, test, expect } from "../helper";
import type { Locator, Page } from "@playwright/test";

const title = "Filter";

/* The Filter Control (#11890) over a dynamic matrix, the same in every framework: a chip's popup
   filters the rows, Show More cuts the chips to one row, the Filters dialog shows the presets and the
   fields, and Add Preset opens the preset dialog. */
const columns = [
  { name: "country", title: "Country", cellType: "dropdown",
    choices: [{ value: "de", text: "Germany" }, { value: "fr", text: "France" }, { value: "it", text: "Italy" }] },
  { name: "age", title: "Age", cellType: "text", inputType: "number" }
];
const json = (extraColumns: Array<any> = [], filterProps: any = {}): any => ({
  elements: [
    Object.assign({ type: "filter", name: "f1", source: "m", items: [{ name: "adults", title: "Adults", expression: "{age} > 18" }] }, filterProps),
    { type: "matrixdynamic", name: "m", columns: columns.concat(extraColumns),
      defaultValue: [{ country: "de", age: 30, name: "Ann" }, { country: "fr", age: 12, name: "Bob" }, { country: "it", age: 45, name: "Dan" }] }
  ]
});
const nameColumn = { name: "name", title: "Name", cellType: "text" };
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
// The presets the control shows: the authored ones not deleted, then the respondent's own.
async function getItemTitles(page: Page): Promise<Array<string>> {
  return await page.evaluate(() => (window as any).survey.getQuestionByName("f1").visibleItems.map((item: any) => item.title));
}
// js-ui draws the survey in a shadow root: there document.activeElement is its host.
async function hasFocus(container: Locator): Promise<boolean> {
  return await container.evaluate((el: HTMLElement) => {
    let active: Element | null = document.activeElement;
    while(!!active && !!active.shadowRoot && !!active.shadowRoot.activeElement) active = active.shadowRoot.activeElement;
    return el.contains(active);
  });
}
function popupWith(page: Page, selector: string): Locator {
  return page.locator(".sv-popup__container").filter({ visible: true }).filter({ has: page.locator(selector) });
}
function chip(page: Page, text: string): Locator {
  return page.locator(".sd-filter__chip").filter({ hasText: text });
}
async function openFilters(page: Page): Promise<Locator> {
  await page.locator(".sd-filter button[title='Filters']").click();
  const dialog = popupWith(page, ".sd-filter-modal__content");
  await expect(dialog).toBeVisible();
  return dialog;
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

    test("a preset is saved from the Filters dialog", async ({ page }) => {
      await initSurvey(page, framework, json());
      // The chip's condition is what the new preset contains.
      await chip(page, "Country").click();
      const popup = popupWith(page, ".sd-filter-popup");
      await popup.locator(".sd-filter-popup__item").filter({ hasText: "Germany" }).click();
      await popup.getByRole("button", { name: "Apply" }).click();
      await expect(popup).toBeHidden();
      const dialog = await openFilters(page);
      await dialog.getByRole("button", { name: "Add Preset" }).click();
      const presetDialog = popupWith(page, ".sd-filter-preset-dialog__form");
      await presetDialog.locator(".sd-filter-preset-dialog__form input").first().fill("Germans");
      await presetDialog.getByRole("button", { name: "Apply" }).click();
      await expect(presetDialog).toBeHidden();
      await expect(dialog, "the Filters dialog lists the new preset").toContainText("Germans");
      await dialog.getByRole("button", { name: /^Show/ }).click();
      await expect(dialog).toBeHidden();
      expect(await getItemTitles(page)).toEqual(["Adults", "Germans"]);
      await expect(chip(page, "Germans")).toBeVisible();
      expect(await getVisibleRowCount(page)).toBe(1);
    });

    test("Edit Presets: rename, delete, Apply", async ({ page }) => {
      await initSurvey(page, framework, json([], { items: [{ name: "adults", title: "Adults", expression: "{age} > 18" },
        { name: "kids", title: "Kids", expression: "{age} < 18" }] }));
      const dialog = await openFilters(page);
      await dialog.locator(".sd-filter-modal__section-header [title='Edit Presets']").click();
      const editDialog = popupWith(page, ".sd-filter-preset-dialog__tabs");
      await expect(editDialog).toBeVisible();
      const tabs = editDialog.locator(".sd-filter-preset-dialog__tabs");
      await expect(tabs).toContainText("Adults");
      await expect(tabs).toContainText("Kids");
      await tabs.getByRole("button", { name: "Adults" }).click();
      const titleInput = editDialog.locator(".sd-filter-preset-dialog__form input").first();
      await titleInput.fill("Grown-ups");
      // fill() fires "input" only. The Angular and Vue text inputs pass a typed value on keyup (or on
      // change, at blur): a key sends it on, as typing would.
      await titleInput.press("End");
      await expect(tabs, "a changed title shows in its tab at once").toContainText("Grown-ups");
      await tabs.getByRole("button", { name: "Kids" }).click();
      await editDialog.getByRole("button", { name: "Delete" }).click();
      await expect(tabs).not.toContainText("Kids");
      await editDialog.getByRole("button", { name: "Apply" }).click();
      await expect(editDialog).toBeHidden();
      await expect(dialog).toContainText("Grown-ups");
      await expect(dialog).not.toContainText("Kids");
      expect(await getItemTitles(page)).toEqual(["Grown-ups"]);
      await dialog.getByRole("button", { name: /^Show/ }).click();
      await expect(dialog).toBeHidden();
      await expect(chip(page, "Grown-ups")).toBeVisible();
      await expect(chip(page, "Kids")).toHaveCount(0);
    });

    // Save and Clear All are there in single-preset mode: with several presets, a chip's edit turns the
    // preset off. There the preset can't be taken off: Clear All drops the edits and the preset filters again.
    test("the quick row's Save writes a chip's edit into the active preset, and Clear All drops an edit", async ({ page }) => {
      await initSurvey(page, framework, json([], { allowMultipleItems: false,
        items: [{ name: "germans", title: "Germans", expression: "{country} anyof ['de']" }], defaultItem: "germans" }));
      expect(await getVisibleRowCount(page)).toBe(1);
      const save = page.locator(".sd-filter").getByRole("button", { name: "Save" });
      const clear = page.locator(".sd-filter .sd-filter__clear");
      const pick = async (text: string): Promise<void> => {
        await chip(page, "Country").click();
        const popup = popupWith(page, ".sd-filter-popup");
        await popup.locator(".sd-filter-popup__item").filter({ hasText: text }).click();
        await popup.getByRole("button", { name: "Apply" }).click();
        await expect(popup).toBeHidden();
      };
      await expect(save).toBeHidden();
      await pick("France");
      expect(await getVisibleRowCount(page)).toBe(2);
      await expect(save, "the active preset is changed").toBeVisible();
      await save.click();
      await expect(save).toBeHidden();
      const expression = await page.evaluate(() => (window as any).survey.getQuestionByName("f1").items[0].expression);
      expect(expression).toContain("de");
      expect(expression).toContain("fr");
      expect(await getVisibleRowCount(page)).toBe(2);

      await pick("Italy");
      expect(await getVisibleRowCount(page)).toBe(3);
      await expect(clear).toBeVisible();
      await clear.click();
      await expect(clear).toBeHidden();
      await expect(save).toBeHidden();
      expect(await getVisibleRowCount(page), "the saved preset filters again").toBe(2);
    });

    test("the search box filters the matrix", async ({ page }) => {
      // Only the names: "an" is also in "Germany".
      await initSurvey(page, framework, json([nameColumn], { showSearch: true, searchFields: ["name"] }));
      const input = page.locator(".sd-filter .sd-filter__search input");
      await expect(input).toBeVisible();
      await input.fill("an");
      await expect.poll(() => getVisibleRowCount(page), { message: "Ann and Dan" }).toBe(2);
      await input.fill("bob");
      await expect.poll(() => getVisibleRowCount(page)).toBe(1);
      await input.fill("");
      await expect.poll(() => getVisibleRowCount(page)).toBe(3);
    });

    test("a custom value is added in a chip's popup", async ({ page }) => {
      await initSurvey(page, framework, json([{ name: "city", title: "City", cellType: "dropdown", allowCustomChoices: true,
        choices: ["Berlin", "Paris"] }]));
      await chip(page, "City").click();
      const popup = popupWith(page, ".sd-filter-popup");
      await popup.locator(".sd-filter-popup__search-input").fill("Rome");
      const add = popup.locator(".sd-filter-popup__item").filter({ hasText: "Add \"Rome\"" });
      await expect(add).toBeVisible();
      await add.click();
      await expect(popup.locator(".sd-filter-popup__item").filter({ hasText: /^Rome/ })).toBeVisible();
      await popup.getByRole("button", { name: "Apply" }).click();
      await expect(popup).toBeHidden();
      await expect(chip(page, "City")).toContainText("Rome");
      expect(await getVisibleRowCount(page), "no row is in Rome").toBe(0);
    });

    test("the keyboard: Tab, Enter and Escape in a chip's popup and in the Filters dialog", async ({ page }) => {
      await initSurvey(page, framework, json());
      const country = chip(page, "Country");
      await country.focus();
      await page.keyboard.press("Enter");
      const popup = popupWith(page, ".sd-filter-popup");
      await expect(popup).toBeVisible();
      await expect.poll(() => hasFocus(popup), { message: "Enter moves the focus into the popup" }).toBe(true);
      await page.keyboard.press("Tab");
      expect(await hasFocus(popup), "Tab stays in the popup").toBe(true);
      await page.keyboard.press("Escape");
      await expect(popup).toBeHidden();
      await expect(country, "Escape gives the focus back to the chip").toBeFocused();

      const filters = page.locator(".sd-filter button[title='Filters']");
      await filters.focus();
      await page.keyboard.press("Enter");
      const dialog = popupWith(page, ".sd-filter-modal__content");
      await expect(dialog).toBeVisible();
      await expect.poll(() => hasFocus(dialog), { message: "Enter moves the focus into the dialog" }).toBe(true);
      for (let i = 0; i < 12; i++) {
        await page.keyboard.press("Tab");
        expect(await hasFocus(dialog), "Tab " + (i + 1) + " stays in the dialog").toBe(true);
      }
      await page.keyboard.press("Escape");
      await expect(dialog).toBeHidden();
      await expect(filters, "Escape gives the focus back to the Filters chip").toBeFocused();
    });
  });
});
