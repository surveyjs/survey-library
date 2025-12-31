import { frameworks, url, initSurvey, getQuestionValue, getPanelJson, test, expect } from "../helper";

const title = "panel";

var json = {
  pages: [
    {
      name: "page1",
      elements: [
        {
          type: "comment",
          name: "question1",
        },
        {
          type: "panel",
          title: "Panel 1",
          state: "expanded",
          elements: [
            {
              type: "checkbox",
              choices: [
                { value: "1", text: "first item" },
                { value: "2", text: "second item" },
                { value: "3", text: "third item" },
              ],
              name: "question2",
            },
            {
              type: "panel",
              elements: [
                {
                  type: "dropdown",
                  choices: [
                    { value: "1", text: "first item" },
                    { value: "2", text: "second item" },
                    { value: "3", text: "third item" },
                  ],
                  name: "question3",
                },
                {
                  type: "rating",
                  name: "question4",
                },
              ],
              innerIndent: 1,
              name: "panel2",
            },
          ],
          innerIndent: 1,
          name: "panel1",
        },
        {
          type: "panel",
          name: "panel2",
          state: "collapsed",
          elements: [
            { type: "text", name: "q1" }
          ]
        }
      ],
    },
  ],
};

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await initSurvey(page, framework, json);
    });

    test("titles and margins", async ({ page }) => {
      const getTitle1 = page.locator(".sd-element__title").filter({ hasText: "question1" });
      const getTitle2 = page.locator(".sd-element__title").filter({ hasText: "question2" });
      const getTitle3 = page.locator(".sd-element__title").filter({ hasText: "question3" });
      const getTitle4 = page.locator(".sd-element__title").filter({ hasText: "question4" });

      const getPanelsCountByMargin = await page.evaluate(
        () => (window as any).survey.rootElement.getRootNode().querySelectorAll('div[style*="padding-left: 20px"]').length
      );

      await expect(getTitle1).toBeVisible({ timeout: 1000 });
      await expect(getTitle2).toBeVisible({ timeout: 1000 });
      await expect(getTitle3).toBeVisible({ timeout: 1000 });
      await expect(getTitle4).toBeVisible({ timeout: 1000 });

      expect(getPanelsCountByMargin).toBe(2);
    });

    test("expand collapse title", async ({ page }) => {
      const panelTitle = page.locator("div[id$='ariaTitle']").filter({ hasText: "Panel 1" });
      const contentItem = page.locator("[data-name='question2']");

      await expect(contentItem).toBeVisible();
      await panelTitle.click();
      await page.waitForTimeout(1000);
      await expect(contentItem).not.toBeVisible();
    });

    test("expand collapse title by name", async ({ page }) => {
      const panelTitle = page.locator("div.sd-title[id$='ariaTitle']").filter({ hasText: "panel2" });
      const contentItem = page.locator("[data-name='q1']");

      await expect(contentItem).not.toBeVisible();
      await panelTitle.click();
      await expect(contentItem).toBeVisible();
    });

    test("panel description reactivity", async ({ page }) => {
      await page.evaluate(() => {
        window["survey"].getAllPanels()[0].description = "desc1";
      });
      await expect(page.locator(".sd-panel__description").filter({ hasText: "desc1" })).toBeVisible();
    });
  });
});

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("click on panel title state editable", async ({ page }) => {
      await initSurvey(page, framework, json, true);
      var newTitle = "MyText";
      var questionValue = await getQuestionValue(page);
      expect(questionValue).toBe(undefined);

      var outerSelector = ".sd-panel__title";
      var innerSelector = ".sv-string-editor";
      await page.locator(outerSelector).first().click();
      await page.locator(outerSelector + " " + innerSelector).first().fill(newTitle);
      await page.locator("body").click({ position: { x: 0, y: 0 } });

      questionValue = await getQuestionValue(page);
      expect(questionValue).toBe(undefined);
      var panelJson = JSON.parse(await getPanelJson(page));
      expect(panelJson.title).toBe(newTitle);
    });

    test("Show content for collapsed panel in designer", async ({ page }) => {
      await initSurvey(page, framework, { elements: [{ type: "text", name: "q1" }] }, true);
      await expect(page.locator("span").filter({ hasText: "question1" })).not.toBeVisible();
      await page.evaluate(() => {
        window.survey.setDesignMode(true);
        window.survey.fromJSON({
          elements: [
            {
              "type": "panel",
              "name": "panel1",
              "elements": [{ "type": "text", "name": "question1" }],
              "state": "collapsed"
            }
          ]
        });
      });
      await expect(page.locator("span").filter({ hasText: "question1" })).toBeVisible();
    });

    test("Check panel title reactivity", async ({ page }) => {
      await initSurvey(page, framework, { elements: [{ type: "panel", name: "panel", elements: [{ type: "text", name: "q1" }] }] });
      const titleSelector = page.locator(".sd-panel__title");
      await expect(titleSelector).toHaveCount(0);
      await page.evaluate(() => {
        window.survey.getAllPanels()[0].title = "panel title";
      });
      await expect(titleSelector).toHaveCount(1);
      await expect(titleSelector.locator(".sv-string-viewer")).toHaveText("panel title");
      await page.evaluate(() => {
        window.survey.getAllPanels()[0].title = "";
      });
      await expect(titleSelector).toHaveCount(0);
    });
  });
});

