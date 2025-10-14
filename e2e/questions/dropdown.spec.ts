import { frameworks, initSurvey, url, test, expect } from "../helper";

const title = "Dropdown question";

frameworks.forEach(framework => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("Save filter string after popup is closed", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 600 });
      const json = {
        elements: [
          {
            type: "dropdown",
            name: "car",
            title: "What car are you driving?",
            choices: ["None", "Ford", "Vauxhall", "Volkswagen", "Nissan", "Audi", "Mercedes-Benz", "BMW", "Peugeot", "Toyota", "Citroen"],
          },
          {
            type: "checkbox",
            name: "question1",
            choices: ["item1", "item2", "item3", "item4", "item5", "item6", "item7", "item8", "item9", "item10", "item11", "item12", "item13", "item14", "item15"]
          }
        ],
      };
      await initSurvey(page, framework, json);
      const popup = page.locator(".sv-popup__container");

      await page.locator(".sd-dropdown__filter-string-input").focus();
      await page.keyboard.type("ot");

      await expect(popup).toBeVisible();
      await expect(page.locator(".sv-list__item").filter({ visible: true })).toHaveCount(2);
      expect(await page.locator(".sd-dropdown").textContent()).toEqual("PeugeotSelect");

      await page.getByRole("button", { name: "Select" }).click();
      await expect(popup).toBeHidden();
      expect(await page.locator(".sd-dropdown").textContent()).toEqual("PeugeotSelect");

      await page.getByRole("button", { name: "Select" }).click();
      await expect(popup).toBeVisible();
      expect(await page.locator(".sd-dropdown").textContent()).toEqual("PeugeotSelect");
      await expect(page.locator(".sv-list__item").filter({ visible: true })).toHaveCount(2);

      await page.mouse.wheel(0, 20);
      await expect(popup).toBeHidden();
      expect(await page.locator(".sd-dropdown").textContent()).toEqual("PeugeotSelect");

      await page.getByRole("button", { name: "Select" }).click();
      await expect(popup).toBeVisible();
      expect(await page.locator(".sd-dropdown").textContent()).toEqual("PeugeotSelect");
      await expect(page.locator(".sv-list__item").filter({ visible: true })).toHaveCount(2);
    });

    test("Dropdown with lazyLoadEnabled and onGetChoicesDisplayValue event - #10302", async({ page }) => {
      const json = {
        "elements": [
          {
            "type": "dropdown",
            "name": "test",
            "title": "test",
            "isRequired": true,
            "defaultValue": "test",
            "choicesLazyLoadEnabled": true,
          }
        ]
      };
      await initSurvey(page, framework, json, undefined, undefined, async () => {
        await page.evaluate(() => {
          (window as any).survey.onGetChoiceDisplayValue.add((_, options) => {
            setTimeout(() => options.setItems(["Test"]));
          });
        });
      });
      expect(await page.locator(".sd-dropdown__value", { hasText: "Test" }).isVisible()).toBeTruthy();
    });
  });
});