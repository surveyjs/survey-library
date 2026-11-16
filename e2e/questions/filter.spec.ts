import { frameworks, url, initSurvey, test, expect } from "../helper";
import type { Locator, Page } from "@playwright/test";

const title = "Filter";

/* The Filter Control (#11890) over a dynamic matrix, the same in every framework (the mockup's
   "filters v2"): a chip's popup filters the rows and its cross clears them, the Preset chip turns a
   preset on and off, Save as... adds one, Show More cuts the chips to one row, and the Filters dialog
   searches among the filters and opens New Preset and Edit Preset. */
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
const twoPresets = { items: [{ name: "adults", title: "Adults", expression: "{age} > 18" },
  { name: "kids", title: "Kids", expression: "{age} < 18" }] };
const longColumns = (): Array<any> => {
  const res: Array<any> = [];
  for (let i = 1; i <= 10; i++) {
    // Every column gets a chip of its own in the quick filters row: ten long titles do not fit in one.
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
// The room between a chip and its menu: under the chip, or over it.
async function gapTo(chipLocator: Locator, popup: Locator, isOver: boolean): Promise<number> {
  const chipBox = await chipLocator.boundingBox();
  const popupBox = await popup.boundingBox();
  return isOver ? chipBox.y - (popupBox.y + popupBox.height) : popupBox.y - (chipBox.y + chipBox.height);
}
// Picks a value in a chip's popup and applies it.
async function pick(page: Page, field: string, text: string): Promise<void> {
  await chip(page, field).click();
  const popup = popupWith(page, ".sd-filter-popup");
  await popup.locator(".sd-filter-popup__item").filter({ hasText: text }).click();
  await popup.getByRole("button", { name: "Apply" }).click();
  await expect(popup).toBeHidden();
}
// fill() fires "input" only. The Angular and Vue text inputs pass a typed value on keyup (or on
// change, at blur): a key sends it on, as typing would.
async function type(input: Locator, text: string): Promise<void> {
  await input.fill(text);
  await input.press("End");
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

    // As the mockup's select drop: 8px between a chip and its menu, under the chip, or over it when
    // there is no room below.
    test("a chip's menu stands 8px off the chip, under it or over it", async ({ page }) => {
      await initSurvey(page, framework, json());
      const country = chip(page, "Country");
      const popup = popupWith(page, ".sd-filter-popup");
      await country.click();
      await expect.poll(() => gapTo(country, popup, false), "#1: under the chip").toBeGreaterThan(7);
      expect(await gapTo(country, popup, false), "#2").toBeLessThan(9);
      // Escape reaches a menu that has the focus: it takes it 100 ms after it shows.
      await expect.poll(() => hasFocus(popup)).toBe(true);
      await page.keyboard.press("Escape");
      await expect(popup).toBeHidden();

      const preset = page.locator(".sd-filter__chip--preset");
      const list = popupWith(page, ".sv-list");
      await preset.click();
      await expect.poll(() => gapTo(preset, list, false), "#3: the presets' list").toBeGreaterThan(7);
      expect(await gapTo(preset, list, false), "#4").toBeLessThan(9);
      await expect.poll(() => hasFocus(list)).toBe(true);
      await page.keyboard.press("Escape");
      await expect(list).toBeHidden();

      // The chips row near the bottom of the screen: the menu has no room under it.
      await page.locator(".sd-filter").evaluate((el: HTMLElement) => { el.style.marginTop = "560px"; });
      await country.click();
      await expect.poll(() => gapTo(country, popup, true), "#5: over the chip").toBeGreaterThan(7);
      expect(await gapTo(country, popup, true), "#6").toBeLessThan(9);
    });

    // As a dropdown's list: a chip's menu covers nothing but itself and hides as the focus leaves it,
    // so one click outside it both closes it and works.
    test("one click outside a chip's menu closes it and reaches what it clicked", async ({ page }) => {
      await initSurvey(page, framework, json([], Object.assign({ showSearch: true }, twoPresets)));
      const popup = popupWith(page, ".sd-filter-popup");
      const list = popupWith(page, ".sv-list");
      await chip(page, "Country").click();
      await expect(popup).toContainText("Germany");
      await expect.poll(() => hasFocus(popup), { message: "#1: the focus is in the menu" }).toBe(true);
      await popup.click({ position: { x: 4, y: 4 } });
      await expect(popup, "#2: a click on the menu's empty space keeps it").toContainText("Germany");
      await chip(page, "Age").click();
      await expect(popup, "#3: one menu - the Age chip's").toHaveCount(1);
      await expect(popup, "#4").not.toContainText("Germany");
      await chip(page, "Preset").click();
      await expect(list.getByRole("menuitemradio"), "#5: the presets' list").toHaveText(["Adults", "Kids"]);
      await expect(popup, "#6").toHaveCount(0);
      const search = page.locator(".sd-filter__search input");
      await search.click();
      await expect(list, "#7: the list is closed").toBeHidden();
      expect(await hasFocus(search), "#8: the search box keeps the focus").toBe(true);
      // At once, before the menu took the focus: it hides as it would take it.
      await chip(page, "Country").click();
      await expect(popup).toContainText("Germany");
      await page.mouse.click(5, 795);
      await expect(popup, "#9: a click on the page's empty space").toBeHidden();
      await chip(page, "Country").click();
      await expect.poll(() => hasFocus(popup), { message: "#10: the focus is in the menu" }).toBe(true);
      await page.mouse.click(5, 795);
      await expect(popup, "#11: the same with the focus in the menu").toBeHidden();
    });

    test("a chip's cross clears its condition", async ({ page }) => {
      await initSurvey(page, framework, json());
      await pick(page, "Country", "Germany");
      expect(await getVisibleRowCount(page)).toBe(1);
      const clear = page.locator(".sd-filter").getByRole("button", { name: "Clear Country" });
      await expect(clear).toBeVisible();
      await clear.click();
      await expect(clear).toBeHidden();
      await expect.poll(() => getVisibleRowCount(page)).toBe(3);
      await expect(chip(page, "Country")).not.toContainText("Germany");
    });

    test("the Preset chip turns a preset on from its list, and its cross turns it off", async ({ page }) => {
      await initSurvey(page, framework, json([], twoPresets));
      await chip(page, "Preset").click();
      const list = popupWith(page, ".sv-list");
      await expect(list.getByRole("menuitemradio")).toHaveText(["Adults", "Kids"]);
      await list.getByRole("menuitemradio", { name: "Adults" }).click();
      await expect(list).toBeHidden();
      await expect.poll(() => getVisibleRowCount(page), { message: "Ann and Dan" }).toBe(2);
      await expect(chip(page, "Adults"), "the chip shows the preset that is on").toBeVisible();
      await page.locator(".sd-filter").getByRole("button", { name: "Clear Adults" }).click();
      await expect.poll(() => getVisibleRowCount(page)).toBe(3);
      await expect(chip(page, "Preset")).toBeVisible();
    });

    // The list moves the focus to its first preset as it opens. As in the mockup, a click paints no
    // preset that is not on; a keyboard's focus is painted.
    test("the presets' list paints the focused preset only when a keyboard opened it", async ({ page }) => {
      await initSurvey(page, framework, json([], twoPresets));
      const list = popupWith(page, ".sv-list");
      const fill = (index: number): Promise<string> => list.locator(".sv-list__item-body").nth(index)
        .evaluate((el: HTMLElement) => getComputedStyle(el).backgroundColor);
      const isFocused = (): Promise<boolean> => list.locator(".sv-list__item").first().evaluate((el: HTMLElement) => el.matches(":focus"));
      await chip(page, "Preset").click();
      await expect.poll(isFocused, { message: "the first preset has the focus" }).toBe(true);
      expect(await fill(0), "a click paints it as any other").toBe(await fill(1));
      await page.keyboard.press("Escape");
      await expect(list).toBeHidden();
      await chip(page, "Preset").focus();
      await page.keyboard.press("Enter");
      await expect.poll(isFocused).toBe(true);
      expect(await fill(0), "a keyboard paints it").not.toBe(await fill(1));
    });

    // A focused preset and a hovered one look the same: the input that came last picks the one painted.
    test("the presets' list paints one preset, the one the pointer or a key chose last", async ({ page }) => {
      await initSurvey(page, framework, json([], twoPresets));
      const list = popupWith(page, ".sv-list");
      const items = list.locator(".sv-list__item");
      const focused = (): Promise<number> => items.evaluateAll((els: Array<Element>) => els.findIndex((el: Element) => el.matches(":focus")));
      const painted = (): Promise<Array<boolean>> => list.locator(".sv-list__item-body")
        .evaluateAll((els: Array<Element>) => els.map((el: Element) => getComputedStyle(el).backgroundColor !== "rgba(0, 0, 0, 0)"));
      await chip(page, "Preset").focus();
      await page.keyboard.press("Enter");
      await expect.poll(focused, { message: "a keyboard opened the list" }).toBe(0);
      await expect.poll(painted).toEqual([true, false]);
      await items.nth(1).hover();
      await expect.poll(focused, { message: "the pointer took the focus" }).toBe(1);
      await expect.poll(painted).toEqual([false, true]);
      await page.keyboard.press("ArrowUp");
      await expect.poll(focused, { message: "a key took it back" }).toBe(0);
      await expect.poll(painted, { message: "the pointer still rests on the second preset" }).toEqual([true, false]);
    });

    test("Save as... adds the chips' conditions as a preset and turns it on", async ({ page }) => {
      await initSurvey(page, framework, json());
      const saveAs = page.locator(".sd-filter").getByRole("button", { name: "Save as..." });
      await expect(saveAs, "nothing to save").toBeHidden();
      await pick(page, "Country", "Germany");
      await saveAs.click();
      const popup = popupWith(page, ".sd-filter-popup");
      await type(popup.locator("input").first(), "Germans");
      await popup.getByRole("button", { name: "Save" }).click();
      await expect(popup).toBeHidden();
      expect(await getItemTitles(page)).toEqual(["Adults", "Germans"]);
      await expect(chip(page, "Germans")).toBeVisible();
      await expect(saveAs, "the preset that is on is saved").toBeHidden();
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
      await expect(dialog.locator(".sd-filter-modal__section-title")).toHaveText("Presets");
      await expect(dialog).toContainText("Adults");
      await expect(dialog.locator(".sd-filter-modal__editor")).toBeVisible();
    });

    test("Search in Filters finds the fields, their values and the presets; its cross clears it", async ({ page }) => {
      await initSurvey(page, framework, json([nameColumn]));
      const dialog = await openFilters(page);
      const search = dialog.getByRole("textbox", { name: "Search in Filters" });
      const editor = dialog.locator(".sd-filter-modal__editor");
      await search.fill("germ");
      await expect(editor, "a value found shows its field").toContainText("Germany");
      await expect(editor, "with the values found only").not.toContainText("France");
      await expect(editor).not.toContainText("Name");
      await expect(dialog.getByRole("checkbox", { name: "Adults" })).toHaveCount(0);
      await search.fill("adu");
      await expect(dialog.getByRole("checkbox", { name: "Adults" })).toBeVisible();
      await search.fill("zzz");
      await expect(dialog.locator(".sd-filter-modal__nothing-found")).toHaveText("Nothing found, try different keywords");
      await dialog.locator(".sd-filter__search-clear").click();
      await expect(search).toHaveValue("");
      await expect(dialog.locator(".sd-filter-modal__nothing-found")).toHaveCount(0);
      await expect(editor).toContainText("Name");
      await expect(dialog.getByRole("checkbox", { name: "Adults" })).toBeVisible();
    });

    test("Add New... opens New Preset", async ({ page }) => {
      await initSurvey(page, framework, json());
      const dialog = await openFilters(page);
      await dialog.getByRole("button", { name: "Add New..." }).click();
      const presetDialog = popupWith(page, ".sd-filter-preset-dialog__form");
      await expect(presetDialog).toContainText("New Preset");
      await expect(presetDialog.locator(".sd-filter-preset-dialog__form input").first()).toBeVisible();
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
      await dialog.getByRole("button", { name: "Add New..." }).click();
      const presetDialog = popupWith(page, ".sd-filter-preset-dialog__form");
      await expect(presetDialog.locator(".sd-filter-preset-dialog__form .sd-tagbox"), "it contains the chip's field").toContainText("Country");
      await type(presetDialog.locator(".sd-filter-preset-dialog__form input").first(), "Germans");
      await presetDialog.getByRole("button", { name: "Apply" }).click();
      await expect(presetDialog).toBeHidden();
      await expect(dialog.getByRole("checkbox", { name: "Germans" }), "the Filters dialog lists the new preset").toBeVisible();
      await dialog.getByRole("button", { name: /^Show/ }).click();
      await expect(dialog).toBeHidden();
      expect(await getItemTitles(page)).toEqual(["Adults", "Germans"]);
      expect(await getVisibleRowCount(page)).toBe(1);
    });

    test("Edit Preset: Apply renames the preset picked, Delete takes it away", async ({ page }) => {
      await initSurvey(page, framework, json([], twoPresets));
      const dialog = await openFilters(page);
      const editSelected = dialog.getByRole("button", { name: "Edit Selected..." });
      await expect(editSelected, "no preset picked").toBeHidden();
      // A preset's pill is a toggle: a checkbox.
      await dialog.getByRole("checkbox", { name: "Adults" }).click();
      await editSelected.click();
      let editDialog = popupWith(page, ".sd-filter-preset-dialog__form");
      await expect(editDialog).toContainText("Edit Preset");
      await type(editDialog.locator(".sd-filter-preset-dialog__form input").first(), "Grown-ups");
      await editDialog.getByRole("button", { name: "Apply" }).click();
      await expect(editDialog).toBeHidden();
      await expect(dialog.getByRole("checkbox", { name: "Grown-ups" })).toBeVisible();
      await dialog.getByRole("checkbox", { name: "Kids" }).click();
      await editSelected.click();
      editDialog = popupWith(page, ".sd-filter-preset-dialog__form");
      await editDialog.getByRole("button", { name: "Delete" }).click();
      await expect(editDialog, "Delete closes the dialog").toBeHidden();
      await expect(dialog.getByRole("checkbox", { name: "Kids" })).toHaveCount(0);
      expect(await getItemTitles(page)).toEqual(["Grown-ups"]);
      await dialog.getByRole("button", { name: /^Show/ }).click();
      await expect(dialog).toBeHidden();
      await chip(page, "Preset").click();
      await expect(popupWith(page, ".sv-list").getByRole("menuitemradio")).toHaveText(["Grown-ups"]);
    });

    // Save and Clear All are there in single-preset mode: with several presets, a chip's edit turns the
    // preset off. There the preset can't be taken off: Clear All drops the edits and the preset filters again.
    test("the quick row's Save writes a chip's edit into the active preset, and Clear All drops an edit", async ({ page }) => {
      await initSurvey(page, framework, json([], { allowMultipleItems: false,
        items: [{ name: "germans", title: "Germans", expression: "{country} anyof ['de']" }], defaultItem: "germans" }));
      expect(await getVisibleRowCount(page)).toBe(1);
      const save = page.locator(".sd-filter").getByRole("button", { name: "Save", exact: true });
      const clear = page.locator(".sd-filter .sd-filter__clear");
      await expect(save).toBeHidden();
      await pick(page, "Country", "France");
      expect(await getVisibleRowCount(page)).toBe(2);
      await expect(save, "the active preset is changed").toBeVisible();
      await save.click();
      await expect(save).toBeHidden();
      const expression = await page.evaluate(() => (window as any).survey.getQuestionByName("f1").items[0].expression);
      expect(expression).toContain("de");
      expect(expression).toContain("fr");
      expect(await getVisibleRowCount(page)).toBe(2);

      await pick(page, "Country", "Italy");
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

    // A typed value has no Remove button (a button inside a list option is nested interactive
    // content): unchecked, it is not in the condition, so the next open does not list it.
    test("a custom value is unchecked in a chip's popup and gone at the next open", async ({ page }) => {
      await initSurvey(page, framework, json([{ name: "city", title: "City", cellType: "dropdown", allowCustomChoices: true,
        choices: ["Berlin", "Paris"] }]));
      await chip(page, "City").click();
      let popup = popupWith(page, ".sd-filter-popup");
      await popup.locator(".sd-filter-popup__search-input").fill("Rome");
      await popup.locator(".sd-filter-popup__item").filter({ hasText: "Add \"Rome\"" }).click();
      const rome = popup.locator(".sd-filter-popup__item").filter({ hasText: /^Rome/ });
      await expect(rome).toBeVisible();
      await expect(rome.locator("button"), "no button inside the option").toHaveCount(0);
      await rome.click();
      await popup.getByRole("button", { name: "Apply" }).click();
      await expect(popup).toBeHidden();
      await expect(chip(page, "City")).not.toContainText("Rome");
      expect(await getVisibleRowCount(page)).toBe(3);
      await chip(page, "City").click();
      popup = popupWith(page, ".sd-filter-popup");
      await expect(popup.locator(".sd-filter-popup__item").filter({ hasText: "Berlin" })).toBeVisible();
      await expect(popup.locator(".sd-filter-popup__item").filter({ hasText: /^Rome/ })).toHaveCount(0);
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
