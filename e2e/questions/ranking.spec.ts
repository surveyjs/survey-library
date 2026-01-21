import { frameworks, url, initSurvey, getData, setData, test, expect, doDragDrop, getQuestionValue } from "../helper";

const title = "ranking";

const json = {
  pages: [
    {
      name: "page1",
      elements: [
        {
          type: "ranking",
          name: "smartphone-features",
          title: "Please rank the following smartphone features in order of importance:",
          isRequired: true,
          choices: [
            "Battery life",
            "Screen size",
            "Storage space",
            "Camera quality",
            "Durability",
            "Processor power",
            "Price",
          ],
        },
      ],
    },
    {
      name: "page2",
      elements: [
        {
          type: "checkbox",
          name: "car",
          isRequired: true,
          title: "What cars have you being drived?",
          colCount: 4,
          choicesOrder: "asc",
          choices: [
            "Ford",
            "Vauxhall",
            "Volkswagen",
            "Nissan",
            "Audi",
            "Mercedes-Benz",
            "BMW",
            "Peugeot",
            "Toyota",
            "Citroen",
            "Tesla",
          ],
        },
        {
          type: "ranking",
          name: "bestcar",
          isRequired: true,
          visibleIf: "{car.length} > 1",
          title: "What car did you enjoy the most?",
          choicesFromQuestion: "car",
          choicesFromQuestionMode: "selected",
        },
      ],
    },
  ],
};

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, json);
    });

    test("ranking: simple using", async ({ page }) => {
      const PriceItem = page.locator("span").filter({ hasText: "Price" });
      const BatteryItem = page.locator("span").filter({ hasText: "Battery life" });

      await doDragDrop({ page,
        element: PriceItem,
        target: BatteryItem,
        options: {
          targetPosition: { x: 5, y: -5 },
          steps: 50
        }
      });
      await page.waitForTimeout(300);

      let data = await getData(page);
      expect(data["smartphone-features"]).toEqual([
        "Price",
        "Battery life",
        "Screen size",
        "Storage space",
        "Camera quality",
        "Durability",
        "Processor power",
      ]);
    });

    test("ranking: predeficed data", async ({ page }) => {
      const PriceItem = page.locator("span").filter({ hasText: "Price" });
      const BatteryItem = page.locator("span").filter({ hasText: "Battery life" });

      await setData(page, {
        "smartphone-features": [
          "Price",
          "Battery life",
          "Screen size",
          "Storage space",
          "Camera quality",
          "Durability",
          "Processor power",
        ],
      });

      const batteryItemHeight = (await <any>BatteryItem.boundingBox()).height;
      await doDragDrop({ page,
        element: PriceItem,
        target: BatteryItem,
        options: {
          targetPosition: { x: 5, y: batteryItemHeight - 1 },
          elementPosition: { x: 5, y: 0 }
        }
      });
      await page.waitForTimeout(300);

      let data = await getData(page);
      expect(data["smartphone-features"]).toEqual([
        "Battery life",
        "Price",
        "Screen size",
        "Storage space",
        "Camera quality",
        "Durability",
        "Processor power",
      ]);

      await setData(page, null);
      await doDragDrop({ page,
        element: PriceItem,
        target: BatteryItem,
        options: {
          targetPosition: { x: 5, y: -5 },
          steps: 50
        }
      });
      await page.waitForTimeout(300);

      data = await getData(page);
      expect(data["smartphone-features"]).toEqual([
        "Price",
        "Battery life",
        "Screen size",
        "Storage space",
        "Camera quality",
        "Durability",
        "Processor power",
      ]);
    });

    test("ranking: carry forward", async ({ page }) => {
      const PriceItem = page.locator("span").filter({ hasText: "Price" });
      await PriceItem.hover({ force: true });
      const PriceItemRect = await PriceItem.boundingBox();
      if (PriceItemRect) {
        await page.mouse.down();
        await page.mouse.move(PriceItemRect.x + 7, PriceItemRect.y + 8 - 300, { steps: 20 });
        await page.mouse.up();
      }

      const rankAudiItem = page.getByLabel("What car did you enjoy the most?").getByText("Audi");
      const rankMercedesBenzItem = page.getByLabel("What car did you enjoy the most?").getByText("Mercedes-Benz");
      const checkboxAudiItem = page.getByLabel("What cars have you being drived?").getByText("Audi");
      const checkboxMerscedesItem = page.getByLabel("What cars have you being drived?").getByText("Mercedes-Benz");
      const checkboxToyotaItem = page.getByLabel("What cars have you being drived?").getByText("Toyota");

      await page.locator("button[title='Next']").click();
      await checkboxAudiItem.click();
      await checkboxMerscedesItem.click();
      await checkboxToyotaItem.click();
      let data = await getData(page);
      expect(data.bestcar).toEqual(undefined);

      const rankMercedesBenzItemHeight = (await <any>rankMercedesBenzItem.boundingBox()).height;
      await doDragDrop({ page,
        element: rankAudiItem,
        target: rankMercedesBenzItem,
        options: {
          targetPosition: { x: 5, y: rankMercedesBenzItemHeight - 1 },
          elementPosition: { x: 5, y: 0 },
          steps: 50
        }
      });
      data = await getData(page);
      expect(data.bestcar).toEqual(["Mercedes-Benz", "Audi", "Toyota"]);

      await checkboxMerscedesItem.click();
      data = await getData(page);
      expect(data.bestcar).toEqual(["Audi", "Toyota"]);

      await checkboxMerscedesItem.click();
      data = await getData(page);
      expect(data.bestcar).toEqual(["Audi", "Toyota", "Mercedes-Benz"]);

      await checkboxAudiItem.click();
      await checkboxMerscedesItem.click();
      await checkboxToyotaItem.click();

      data = await getData(page);
      expect(typeof data.bestcar).toBe("undefined");
    });

    test("ranking: keyboard", async ({ page }) => {
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      await page.keyboard.press("ArrowUp");

      let data = await getData(page);
      expect(data["smartphone-features"]).toEqual([
        "Screen size",
        "Battery life",
        "Storage space",
        "Camera quality",
        "Durability",
        "Processor power",
        "Price",
      ]);

      await page.keyboard.press("ArrowDown");
      data = await getData(page);
      expect(data["smartphone-features"]).toEqual([
        "Battery life",
        "Screen size",
        "Storage space",
        "Camera quality",
        "Durability",
        "Processor power",
        "Price",
      ]);
    });

    test("ranking: run-time creation ", async ({ page }) => {
      const newName = "ranking-new";

      await page.evaluate(([newName]) => {
        const qr = new (window as any).Survey.QuestionRankingModel(newName);
        qr.choices = ["one", "two"];
        (window as any).survey.currentPage.addQuestion(qr);
      }, [newName]);

      const FirstItem = page.getByLabel(newName).getByText("one");
      const SecondItem = page.getByLabel(newName).getByText("two");

      await doDragDrop({ page, element: FirstItem, target: SecondItem });
      await page.waitForTimeout(100);

      let data = await getData(page);
      expect(data[newName]).toEqual([
        "two",
        "one"
      ]);
    });

    test("ranking: work with flexbox layout", async ({ page }) => {
      await page.evaluate(() => {
        const stylesheet = document.styleSheets[0];
        stylesheet.addRule(".sv-ranking.sv-ranking.sv-ranking.sv-ranking.sv-ranking", "display:flex;flex-direction: column", 0);
      });

      const PriceItem = page.locator("span").filter({ hasText: "Price" });
      const BatteryItem = page.locator("span").filter({ hasText: "Battery life" });
      await doDragDrop({ page,
        element: PriceItem,
        target: BatteryItem,
        options: {
          targetPosition: { x: 5, y: -5 }
        }
      });
      await page.waitForTimeout(300);

      let data = await getData(page);
      expect(data["smartphone-features"]).toEqual([
        "Price",
        "Battery life",
        "Screen size",
        "Storage space",
        "Camera quality",
        "Durability",
        "Processor power",
      ]);

      await page.evaluate(() => {
        const stylesheet = document.styleSheets[0];
        stylesheet.removeRule(0);
      });
    });

    test("ranking: selectToRank: click to add", async ({ page }) => {
      await page.evaluate(() => {
        const rankingQ = (window as any).survey.getAllQuestions()[0];
        rankingQ.selectToRankEnabled = true;
      });

      const PriceItem = page.locator("span").filter({ hasText: "Price" });
      const BatteryItem = page.locator("span").filter({ hasText: "Battery life" });

      await PriceItem.click();
      await BatteryItem.click();

      let data = await getData(page);
      expect(data["smartphone-features"]).toEqual([
        "Price",
        "Battery life"
      ]);

      await page.evaluate(() => {
        const rankingQ = (window as any).survey.getAllQuestions()[0];
        rankingQ.selectToRankEnabled = false;
      });
    });
  });
});

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("readonly:keyboard disabled", async ({ page }) => {
      const json = {
        elements: [
          {
            "type": "ranking",
            "name": "ranking",
            "choices": ["Ford", "BMW"],
            "readOnly": true,
            "defaultValue": ["BMW", "Ford"]
          },
        ]
      };
      await initSurvey(page, framework, json);
      await page.keyboard.press("Tab");
      await page.keyboard.press("ArrowDown");

      const value = await getQuestionValue(page);
      expect(value).toEqual(["BMW", "Ford"]);
    });

    test("Carry forward error with others Bug#8462", async ({ page }) => {
      const json = {
        elements: [
          {
            type: "checkbox",
            name: "q1",
            choices: ["Item1", "Item2", "Item3"],
            showOtherItem: true,
          },
          {
            type: "ranking",
            name: "q2",
            choicesFromQuestion: "q1",
            choicesFromQuestionMode: "selected",
          },
        ],
      };
      await initSurvey(page, framework, json);
      await page.locator(".sv-string-viewer").filter({ hasText: "Item1" }).click();
      await page.locator(".sv-string-viewer").filter({ hasText: "Item3" }).click();
      await page.locator(".sv-string-viewer").filter({ hasText: "Other (describe)" }).click();
      await page.locator("textarea").click();
      await page.keyboard.type("ABC");

      const item1 = page.getByLabel("q2").getByText("Item1");
      await item1.hover({ force: true });
      const item1Box = await item1.boundingBox();
      if (item1Box) {
        await page.mouse.down();
        await page.mouse.move(item1Box.x + 5, item1Box.y + 40, { steps: 50 });
        await page.mouse.up();
      }
      await page.waitForTimeout(100);

      const value = await getQuestionValue(page);
      expect(value).toEqual(["Item1", "Item3", "other"]);
    });

    test("Uncaught TypeError Bug#9438", async ({ page }) => {
      const json = {
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "ranking",
                "name": "q1",
                "choices": ["Item 1", "Item 2", "Item 3"]
              },
              {
                "type": "ranking",
                "name": "q2",
                "choicesFromQuestion": "q1",
                "maxSelectedChoices": 3,
                "minSelectedChoices": 1,
                "selectToRankEnabled": true,
                "defaultValue": "Item 2"
              }
            ]
          }
        ]
      };
      await initSurvey(page, framework, json);
      const item2 = page.getByLabel("q2").getByText("Item 2");
      await item2.hover({ force: true });
      const item2Box = await item2.boundingBox();
      if (item2Box) {
        await page.mouse.down();
        await page.mouse.move(item2Box.x + 5, item2Box.y + 40, { steps: 20 });
        await page.mouse.up();
      }
      await page.waitForTimeout(100);
    });

    test("is focused after page changed", async ({ page }) => {
      const json = {
        autoFocusFirstQuestion: true,
        pages: [
          {
            name: "page1",
            elements: [{ type: "text", name: "q1", }], },
          {
            name: "page2",
            elements: [{
              type: "ranking",
              name: "q2",
              choices: ["Item 1", "Item 2", "Item 3"],
            }],
          }
        ],
      };
      await initSurvey(page, framework, json);
      await page.locator("button[title=Next]").click();
      await page.waitForTimeout(500);
      await expect(page.locator(".sv-ranking-item").first()).toBeFocused();
    });
  });
});

