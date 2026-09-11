import { frameworks, url, initSurvey, test, expect } from "../helper";

const title = "buttongroup";

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("keyboard: arrow keys move focus, Space selects", async ({ page }) => {
      await page.evaluate(() => {
        (window as any).Survey.settings.itemsKeyboard.selectionFollowsFocus = false;
      });
      await initSurvey(page, framework, {
        elements: [
          {
            type: "buttongroup",
            name: "car",
            choices: ["Ford", "Vauxhall", "BMW"]
          }
        ]
      });

      const getValue = async () => {
        return await page.evaluate(() => {
          return (window as any).survey.getAllQuestions()[0].value;
        });
      };
      const getFocusedItemValue = async () => {
        return await page.evaluate(() => {
          // eslint-disable-next-line surveyjs/eslint-plugin-i18n/allowed-in-shadow-dom
          let element: any = document.activeElement;
          while(element?.shadowRoot?.activeElement) {
            element = element.shadowRoot.activeElement;
          }
          return element?.value;
        });
      };

      await page.keyboard.press("Tab");
      expect(await getFocusedItemValue()).toBe("Ford");

      await page.keyboard.press("ArrowRight");
      await page.keyboard.press("ArrowRight");
      expect(await getFocusedItemValue()).toBe("BMW");
      expect(await getValue()).toBe(undefined);

      await page.keyboard.press("Space");
      expect(await getValue()).toBe("BMW");
    });
  });
});
