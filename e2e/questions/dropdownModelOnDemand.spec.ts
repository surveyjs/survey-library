import { frameworks, url, initSurvey, test, expect, getVisibleListItemByText } from "../helper";

const title = "Dropdown model is created on demand, Issue#9014";
const choices = ["Ford", "Vauxhall", "Volkswagen", "Nissan", "Audi"];

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("A display-mode survey switched to edit opens dropdown and tagbox by mouse and keyboard, Issue#9014", async ({ page }) => {
      await initSurvey(page, framework, {
        mode: "display",
        elements: [
          { type: "dropdown", name: "dropdown1", choices },
          { type: "dropdown", name: "dropdown2", choices },
          { type: "tagbox", name: "tagbox1", choices, closeOnSelect: true },
          { type: "tagbox", name: "tagbox2", choices, closeOnSelect: true }
        ]
      });
      const getModels = () => page.evaluate(() => (window as any).survey.getAllQuestions().map((q: any) => !!q.dropdownListModelValue));
      expect(await getModels(), "display mode creates no model").toEqual([false, false, false, false]);

      await page.evaluate(() => { (window as any).survey.mode = "edit"; });
      await expect(page.locator("div[data-name='dropdown1'] .sd-dropdown__filter-string-input")).toBeVisible();
      expect(await getModels(), "edit mode mounts the popups").toEqual([true, true, true, true]);
      const popupContainer = page.locator(".sv-popup__container").filter({ visible: true });

      await page.locator("div[data-name='dropdown1'] .sd-dropdown").click();
      await expect(popupContainer).toBeVisible();
      await getVisibleListItemByText(page, "Nissan").click();
      await expect(popupContainer).not.toBeVisible();

      await page.locator("div[data-name='dropdown2'] .sd-dropdown__filter-string-input").focus();
      await page.keyboard.press("ArrowDown");
      await expect(popupContainer).toBeVisible();
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("Enter");
      await expect(popupContainer).not.toBeVisible();

      await page.locator("div[data-name='tagbox1'] .sd-tagbox").click();
      await expect(popupContainer).toBeVisible();
      await getVisibleListItemByText(page, "Audi").click();
      await expect(popupContainer).not.toBeVisible();
      await expect(page.locator("div[data-name='tagbox1'] .sd-tagbox-item")).toHaveCount(1);

      await page.locator("div[data-name='tagbox2'] .sd-tagbox__filter-string-input").focus();
      await page.keyboard.press("ArrowDown");
      await expect(popupContainer).toBeVisible();
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("Enter");
      await expect(popupContainer).not.toBeVisible();
      await expect(page.locator("div[data-name='tagbox2'] .sd-tagbox-item")).toHaveCount(1);

      const data = await page.evaluate(() => (window as any).survey.data);
      expect(data).toEqual({ dropdown1: "Nissan", dropdown2: "Vauxhall", tagbox1: ["Audi"], tagbox2: ["Vauxhall"] });
    });

    test("Rating and button group in dropdown mode work with the keyboard, Issue#9014", async ({ page }) => {
      await page.setViewportSize({ width: 500, height: 1000 });
      await initSurvey(page, framework, {
        elements: [
          { type: "rating", name: "rating", displayMode: "dropdown" },
          { type: "buttongroup", name: "buttongroup", choices }
        ]
      });
      const rating = page.locator("div[data-name='rating'] .sd-dropdown");
      const buttongroup = page.locator("div[data-name='buttongroup'] .sd-dropdown");
      await expect(rating).toBeVisible();
      await expect(buttongroup).toBeVisible();
      const popupContainer = page.locator(".sv-popup__container").filter({ visible: true });

      await rating.focus();
      await page.keyboard.press("ArrowDown");
      await expect(popupContainer).toBeVisible();
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("Enter");
      await expect(popupContainer).not.toBeVisible();

      await buttongroup.focus();
      await page.keyboard.press("ArrowDown");
      await expect(popupContainer).toBeVisible();
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("Enter");
      await expect(popupContainer).not.toBeVisible();

      const data = await page.evaluate(() => (window as any).survey.data);
      expect(data).toEqual({ rating: 2, buttongroup: "Vauxhall" });
    });
  });
});
