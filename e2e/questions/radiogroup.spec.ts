import { frameworks, url, urlV2, setOptions, initSurvey, getSurveyResult, getQuestionValue, getQuestionJson, checkSurveyWithEmptyQuestion, test, expect } from "../helper";

const title = "radiogroup";

const json = {
  elements: [
    {
      type: "radiogroup",
      name: "car",
      title: "What car are you driving?",
      isRequired: true,
      colCount: 4,
      choices: [
        "None",
        "Ford",
        "Vauxhall",
        "Volkswagen",
        "Nissan",
        "Audi",
        "Mercedes-Benz",
        "BMW",
        "Peugeot",
        "Toyota",
        "Citroen"
      ]
    }
  ]
};

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, json);
    });

    test("choose empty", async ({ page }) => {
      await checkSurveyWithEmptyQuestion(page);
    });

    test("choose value", async ({ page }) => {
      await page.locator("label").filter({ hasText: "Nissan" }).click();
      await page.locator("input[value=Complete]").click();

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult.car).toEqual("Nissan");
    });

    test("change column count", async ({ page }) => {
      const getClassName = async () => {
        return await page.evaluate(() => {
          return (window as any).survey.rootElement.getRootNode().querySelector("div[id*=sq_] fieldset .sd-selectbase__column")?.className || "";
        });
      };
      let className = await getClassName();
      expect(className.indexOf("sv-q-column-4")).not.toEqual(-1);

      await setOptions(page, "car", { colCount: 1 });

      const getClassNameOneCol = async () => {
        return await page.evaluate(() => {
          return (window as any).survey.rootElement.getRootNode().querySelector("div[id*=sq_] fieldset > .sd-radio")?.className || "";
        });
      };
      className = await getClassNameOneCol();
      expect(className.indexOf("sv-q-col-1")).not.toEqual(-1);

      await setOptions(page, "car", { colCount: 2 });

      className = await getClassName();
      expect(className.indexOf("sv-q-column-2")).not.toEqual(-1);
    });

    test("change choices order", async ({ page }) => {
      const radiogroup = page.locator("[role=\"radiogroup\"]");
      const chocies = radiogroup.locator(".sd-item");

      //asc
      await setOptions(page, "car", { choicesOrder: "asc" });
      await expect(page.locator("label").getByText("Audi")).toBeVisible();
      await expect(page.locator("label").getByText("BMW")).toBeVisible();

      //desc
      await setOptions(page, "car", { choicesOrder: "desc" });
      await expect(page.locator("label").getByText("Volkswagen")).toBeVisible();
      await expect(page.locator("label").getByText("Vauxhall")).toBeVisible();

      //random
      const choicesCount = await chocies.count();
      if (choicesCount === 1) {
        throw new Error("need to more than one choices");
      }

      let firstText = await chocies.nth(0).locator("label").textContent();
      let random_count = 0;
      for (let i = 0; i < 15; i++) {
        await setOptions(page, "car", { choicesOrder: "asc" });
        await setOptions(page, "car", { choicesOrder: "random" });
        await page.evaluate(() => {
          return (window as any).survey.randomSeed = Date.now() + Math.random();
        });
        const first2Text = await chocies.nth(0).locator("label").textContent();

        if (firstText !== first2Text) {
          random_count++;
        }
        firstText = first2Text;
        if (random_count >= 4) break;
      }

      //because of 'none', 'asc', 'desc' and if 4 it is really random
      expect(random_count).toBeGreaterThanOrEqual(4);
    });

    test("check integrity", async ({ page }) => {
      const choices = [
        "None",
        "Ford",
        "Vauxhall",
        "Volkswagen",
        "Nissan",
        "Audi",
        "Mercedes-Benz",
        "BMW",
        "Peugeot",
        "Toyota",
        "Citroen"
      ];
      const getChoicesCount = async () => {
        return await page.evaluate(() => {
          return (window as any).survey.rootElement.getRootNode().querySelectorAll("div input[type=radio]").length;
        });
      };
      let checkIntegrity = async () => {
        const choicesCount = await getChoicesCount();
        expect(choicesCount).toEqual(choices.length);
        for (let i = 0; i < choices.length; i++) {
          await page.locator("label").filter({ hasText: choices[i] }).click();
        }
      };

      await setOptions(page, "car", { choicesOrder: "random" });
      await checkIntegrity();

      await setOptions(page, "car", { choicesOrder: "asc" });
      await checkIntegrity();

      await setOptions(page, "car", { choicesOrder: "desc" });
      await checkIntegrity();
    });

    test("show \"other\" choice", async ({ page }) => {
      await setOptions(page, "car", { hasOther: true, otherText: "Other" });
      await expect(page.locator(".sv-string-viewer").getByText("Other")).toBeVisible();
      await expect(page.locator("textarea")).not.toBeVisible();
      await page.locator("label").filter({ hasText: "Ford" }).click();
      await expect(page.locator("textarea")).not.toBeVisible();
      await page.locator("label").filter({ hasText: "Other" }).click();
      await expect(page.locator("textarea")).toBeVisible();
    });

    test("check \"other\" choice doesn't change order", async ({ page }) => {
      const radiogroup = page.locator("[role=\"radiogroup\"]");
      const chocies = radiogroup.locator(".sd-item");

      await setOptions(page, "car", { hasOther: true, otherText: "Other Test" });
      await setOptions(page, "car", { choicesOrder: "desc" });
      await expect(chocies.nth(11).locator("label").getByText("Other Test")).toBeVisible();
    });

    test("choose other", async ({ page }) => {
      await setOptions(page, "car", { hasOther: true });

      const getOtherInput = page.locator("textarea").first();
      const radiogroup = page.locator("[role=\"radiogroup\"]");
      const chocies = radiogroup.locator(".sd-item");
      const otherText = chocies.nth(11).locator("label").getByText("Other (describe)");

      await otherText.click();
      await getOtherInput.fill("Zaporozec");
      await page.locator("input[value=Complete]").click();

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult.car).toEqual("other");
      expect(surveyResult["car-Comment"]).toEqual("Zaporozec");
    });

    test("choose other and storeOthersAsComment=false", async ({ page }) => {
      await page.evaluate(() => {
        (window as any).survey.storeOthersAsComment = false;
      });
      await setOptions(page, "car", { hasOther: true });

      const getOtherInput = page.locator("textarea").first();
      const radiogroup = page.locator("[role=\"radiogroup\"]");
      const chocies = radiogroup.locator(".sd-item");
      const otherText = chocies.nth(11).locator("label").getByText("Other (describe)");

      await otherText.click();
      await getOtherInput.fill("New_Producer");
      await page.locator("input[value=Complete]").click();

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult.car).toEqual("New_Producer");
    });

    test("checked class", async ({ page }) => {
      const checkHasClass = async (text: string) => {
        await expect(page.locator("label").filter({ hasText: text }).locator("..")).toHaveClass(/sd-radio--checked/);
      };

      const checkHasNotClass = async (text: string) => {
        await expect(page.locator("label").filter({ hasText: text }).locator("..")).not.toHaveClass(/sd-radio--checked/);
      };

      await checkHasNotClass("BMW");
      await checkHasNotClass("Peugeot");

      await page.locator("label").filter({ hasText: "BMW" }).click();
      await checkHasClass("BMW");
      await checkHasNotClass("Peugeot");

      await page.locator("label").filter({ hasText: "Peugeot" }).click();
      await checkHasNotClass("BMW");
      await checkHasClass("Peugeot");
    });
  });
});

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await initSurvey(page, framework, json, true);
    });

    test("click on question title state editable", async ({ page }) => {
      const newTitle = "MyText";
      let questionValue = await getQuestionValue(page);
      expect(questionValue).toEqual(undefined);

      const outerSelector = ".sd-question__title";
      const innerSelector = ".sv-string-editor";
      await page.locator(outerSelector).click();
      await page.locator(outerSelector + " " + innerSelector).fill(newTitle);
      await page.locator("body").click({ position: { x: 0, y: 0 } });

      questionValue = await getQuestionValue(page);
      expect(questionValue).toEqual(undefined);
      const json = JSON.parse(await getQuestionJson(page));
      expect(json.title).toEqual(newTitle);
    });

    test("click on radio title state editable", async ({ page }) => {
      const newTitle = "MyText";
      let questionValue = await getQuestionValue(page);
      expect(questionValue).toEqual(undefined);

      const selector = ".sd-selectbase__label .sv-string-editor";
      await page.locator(selector).first().click();
      await page.locator(selector).first().fill(newTitle);
      await page.locator("body").click({ position: { x: 0, y: 0 } });

      questionValue = await getQuestionValue(page);
      expect(questionValue).toEqual(undefined);
      const json = JSON.parse(await getQuestionJson(page));
      expect(json.choices[0].text).toEqual(newTitle);
    });
  });
});

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("otherText changed", async ({ page }) => {
      const currentJson = {
        title: "Survey New Design Test",
        description: "Survey Description",
        logoPosition: "left",
        elements: [
          {
            type: "checkbox",
            name: "car",
            title: "Checkbox",
            hasOther: true,
            colCount: 4,
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
              "Citroen"
            ]
          },
          {
            type: "radiogroup",
            name: "carss",
            title: "Radiogroup",
            hasOther: true,
            colCount: 4,
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
              "Citroen"
            ]
          },
        ]
      };
      const oldOtherText = "Other (describe)";
      const newOtherText = "New Other";
      await initSurvey(page, framework, currentJson);
      await expect(page.locator(".sv-string-viewer").getByText(oldOtherText)).toHaveCount(2);
      await expect(page.locator(".sv-string-viewer").getByText(newOtherText)).toHaveCount(0);

      await setOptions(page, "car", { otherText: newOtherText });
      await setOptions(page, "carss", { otherText: newOtherText });
      await expect(page.locator(".sv-string-viewer").getByText(oldOtherText)).toHaveCount(0);
      await expect(page.locator(".sv-string-viewer").getByText(newOtherText)).toHaveCount(2);
    });
    test("showNoneItem&separateSpecialChoices", async ({ page }) => {
      const currentJson = {
        elements: [
          {
            type: "radiogroup",
            separateSpecialChoices: true,
            showNoneItem: true,
            name: "car",
            choices: ["item1", "item2", "item3"]
          }
        ]
      };
      await initSurvey(page, framework, currentJson);
      await expect(page.locator(".sv-string-viewer").getByText("None")).toHaveCount(1);
    });
    test("otherItem type in comment, textUpdateMode=onBlur", async ({ page }) => {
      const currentJson = {
        elements: [
          {
            type: "radiogroup",
            showOtherItem: true,
            name: "q1",
            choices: ["item1", "item2", "item3"]
          },
          { type: "text", name: "q2", defaultValue: 0, inputType: "number" }
        ]
      };
      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        (window as any).survey.onValueChanged.add((sender, options) => {
          if (options.name === "q2") return;
          const val = sender.getValue("q2");
          sender.setValue("q2", val + 1);
        });
        (window as any).survey.fromJSON(json);
      }, currentJson);

      await page.locator("label").filter({ hasText: "Other" }).click();
      await page.locator("textarea").click();
      await page.keyboard.type("ABCDEF");
      await page.keyboard.press("Tab");
      await page.locator("input[value=Complete]").click();

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult).toEqual({ q1: "other", "q1-Comment": "ABCDEF", q2: 2 });
    });
    test("otherItem type in comment, textUpdateMode=onTyping", async ({ page }) => {
      const currentJson = {
        textUpdateMode: "onTyping",
        elements: [
          {
            type: "radiogroup",
            showOtherItem: true,
            name: "q1",
            choices: [
              "item1",
              "item2",
              "item3"
            ]
          },
          { type: "text", name: "q2", defaultValue: 0, inputType: "number" }
        ]
      };
      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        (window as any).survey.onValueChanged.add((sender, options) => {
          if (options.name === "q2") return;
          const val = sender.getValue("q2");
          sender.setValue("q2", val + 1);
        });
        (window as any).survey.fromJSON(json);
      }, currentJson);

      await page.locator("label").filter({ hasText: "Other" }).click();
      await page.locator("textarea").click();
      await page.keyboard.type("ABCDEF");
      await page.keyboard.press("Tab");
      await page.locator("input[value=Complete]").click();

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult).toEqual({ q1: "other", "q1-Comment": "ABCDEF", q2: 7 });
    });
    test("Type in comment, textUpdateMode=onBlur", async ({ page }) => {
      const currentJson = {
        elements: [
          {
            type: "radiogroup",
            showCommentArea: true,
            name: "q1",
            choices: [
              "item1",
              "item2",
              "item3"
            ]
          },
          { type: "text", name: "q2", defaultValue: 0, inputType: "number" }
        ]
      };
      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        (window as any).survey.onValueChanged.add((sender, options) => {
          if (options.name === "q2") return;
          const val = sender.getValue("q2");
          sender.setValue("q2", val + 1);
        });
        (window as any).survey.fromJSON(json);
      }, currentJson);

      await page.locator("textarea").click();
      await page.keyboard.type("ABCDEF");
      await page.keyboard.press("Tab");
      await page.locator("input[value=Complete]").click();

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult).toEqual({ "q1-Comment": "ABCDEF", q2: 1 });
    });
    test("Type in comment, textUpdateMode=onTyping", async ({ page }) => {
      const currentJson = {
        textUpdateMode: "onTyping",
        elements: [
          {
            type: "radiogroup",
            showCommentArea: true,
            name: "q1",
            choices: [
              "item1",
              "item2",
              "item3"
            ]
          },
          { type: "text", name: "q2", defaultValue: 0, inputType: "number" }
        ]
      };
      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        (window as any).survey.onValueChanged.add((sender, options) => {
          if (options.name === "q2") return;
          const val = sender.getValue("q2");
          sender.setValue("q2", val + 1);
        });
        (window as any).survey.fromJSON(json);
      }, currentJson);

      await page.locator("textarea").click();
      await page.keyboard.type("ABCDEF");
      await page.keyboard.press("Tab");
      await page.locator("input[value=Complete]").click();

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult).toEqual({ "q1-Comment": "ABCDEF", q2: 6 });
    });
    test("Initial value in question comment", async ({ page }) => {
      const currentJson = {
        elements: [
          {
            type: "radiogroup",
            showCommentArea: true,
            name: "q1",
            choices: ["item1", "item2", "item3"]
          }
        ]
      };
      await initSurvey(page, framework, currentJson);
      await page.evaluate(() => {
        (window as any).survey.setComment("q1", "ABC");
      });

      await page.locator("label").filter({ hasText: "item2" }).click();
      await page.locator("textarea").click();
      await page.keyboard.press("End");
      await page.keyboard.type("DEF");
      await page.locator("input[value=Complete]").click();

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult).toEqual({ q1: "item2", "q1-Comment": "ABCDEF" });
    });
    test("Do not clear comment area on clicking Clear button #8287", async ({ page }) => {
      const clearButton = page.locator("button[title=Clear]");
      const currentJson = {
        elements: [
          {
            type: "radiogroup",
            name: "q1",
            choices: ["item1", "item2", "item3"],
            allowClear: true,
            showCommentArea: true
          }
        ]
      };
      await initSurvey(page, framework, currentJson);

      await page.locator("label").filter({ hasText: "item2" }).click();
      await page.locator("textarea").fill("ABC");
      await clearButton.click();
      await page.locator("input[value=Complete]").click();

      let surveyResult = await getSurveyResult(page);
      expect(surveyResult).toEqual({ "q1-Comment": "ABC" });
    });
  });
});

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      const json = {
        elements: [
          {
            type: "radiogroup",
            name: "car",
            title: "What car are you driving?",
            isRequired: true,
            colCount: 4,
            hasOther: true,
            hasNone: true,
            readOnly: true,
            choices: [
              "Unknown",
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
            ],
            defaultValue: "BMW"
          },
        ],
      };
      await initSurvey(page, framework, json);
    });

    test("readonly", async ({ page }) => {
      const fordChoice = page.locator("label").filter({ hasText: "Ford" });
      await fordChoice.click({ force: true });
      await expect(fordChoice).not.toBeChecked();
      await expect(page.locator("input[value=BMW]")).toBeChecked();
    });

    test("readonly:keyboard disabled", async ({ page }) => {
      await page.keyboard.press("Tab");
      await page.keyboard.press("ArrowDown");
      const getValue = async () => {
        return await page.evaluate(() => {
          return (window as any).survey.getAllQuestions()[0].value;
        });
      };
      const value = await getValue();
      expect(value).toEqual("BMW");
    });
  });
});

