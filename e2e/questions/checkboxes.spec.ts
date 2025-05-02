import { frameworks, url, initSurvey, getSurveyResult, getQuestionValue, getQuestionJson, checkSurveyWithEmptyQuestion, getData, setRowItemFlowDirection, test, expect } from "../helper";

const title = "checkboxes";

const columnClassName = ".sd-selectbase__column";
const checkboxControlClassName = ".sd-checkbox__control";

const json = {
  elements: [
    {
      type: "checkbox",
      name: "car",
      title: "What car are you driving?",
      isRequired: true,
      colCount: 4,
      hasOther: true,
      hasNone: true,
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
    },
  ],
};

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await initSurvey(page, framework, json);
    });

    test("choose empty", async ({ page }) => {
      await checkSurveyWithEmptyQuestion(page);
    });

    test("choose none", async ({ page }) => {
      await page.locator(".sd-item__control-label").getByText("Nissan").click();
      await page.locator(".sd-item__control-label").getByText("Audi").click();
      await page.locator(".sd-item__control-label").getByText("Vauxhall").click();
      await page.locator(".sd-item__control-label").getByText("None").click();
      await page.locator("input[value=Complete]").click();

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult.car).toEqual(["none"]);
    });

    test("choose value", async ({ page }) => {
      await page.locator(".sd-item__control-label").getByText("Nissan").click();
      await page.locator("input[value=Complete]").click();

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult.car).toEqual(["Nissan"]);
    });

    test("choose several values", async ({ page }) => {
      await page.locator(".sd-item__control-label").getByText("BMW").click();
      await page.locator(".sd-item__control-label").getByText("Nissan").click();
      await page.locator("input[value=Complete]").click();

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult.car).toEqual(["BMW", "Nissan"]);
    });

    test("change column count", async ({ page }) => {
      const getClassName = async () => {
        return await page.evaluate(() => {
          const element = document.querySelector("div[id*=sq_1] fieldset > div > div");
          return element ? element.className : "";
        });
      };

      let className = await getClassName();
      expect(className).toContain("sv-q-column-4");

      await page.evaluate(() => {
        window["survey"].getAllQuestions()[0].colCount = 1;
      });

      className = await page.evaluate(() => {
        const element = document.querySelector("div[id*=sq_1] fieldset > div");
        return element ? element.className : "";
      });
      expect(className).toContain("sv-q-col-1");

      await page.evaluate(() => {
        window["survey"].getAllQuestions()[0].colCount = 2;
      });

      className = await getClassName();
      expect(className).toContain("sv-q-column-2");
    });

    test("change choices order", async ({ page }) => {
      await setRowItemFlowDirection(page);

      const getChoicesCount = async () => {
        return await page.evaluate(() => {
          const checkboxControlClassName = ".sd-checkbox__control";
          return document.querySelectorAll(
            `div[id*=sq_1] fieldset ${checkboxControlClassName}`
          ).length;
        });
      };

      const getFirst = async () => {
        const element = await page.locator(`div[id*=sq_1] ${columnClassName}:nth-child(1) .sv-string-viewer`).nth(0).textContent();
        return element || "";
      };

      const getSecond = async () => {
        const element = await page.locator(`div[id*=sq_1] ${columnClassName}:nth-child(2) .sv-string-viewer`).nth(0).textContent();
        return element || "";
      };

      let rnd_count = 0;
      let first, second, first_2;
      let choicesCount = await getChoicesCount();

      // asc
      await page.evaluate(() => {
        window["survey"].getAllQuestions()[0].choicesOrder = "asc";
      });
      first = await getFirst();
      second = await getSecond();
      expect(first.trim()).toEqual("Audi");
      expect(second.trim()).toEqual("BMW");

      // desc
      await page.evaluate(() => {
        window["survey"].getAllQuestions()[0].choicesOrder = "desc";
      });
      first = await getFirst();
      second = await getSecond();
      expect(first.trim()).toEqual("Volkswagen");
      expect(second.trim()).toEqual("Vauxhall");

      // rnd
      if (choicesCount === 1) {
        throw new Error("need to more than one choices");
      }

      for (let i = 0; i < 15; i++) {
        await page.evaluate(() => {
          window["survey"].getAllQuestions()[0].choicesOrder = "asc";
        });
        await page.evaluate(() => {
          window["survey"].getAllQuestions()[0].choicesOrder = "random";
        });
        first_2 = await getFirst();

        if (first.trim() !== first_2.trim()) {
          rnd_count++;
        }

        first = first_2;

        if (rnd_count >= 4) {
          break;
        }
      }

      expect(rnd_count).toBeGreaterThanOrEqual(4); // because of 'none', 'asc', 'desc' and if 4 it is really rnd
    });

    test("check integrity", async ({ page }) => {
      const getChoicesCount = async () => {
        return await page.evaluate(() => {
          const columnClassName = ".sd-selectbase__column";
          const checkboxControlClassName = ".sd-checkbox__control";
          return document.querySelectorAll(
            `div[id*=sq_1] fieldset ${checkboxControlClassName}`
          ).length;
        });
      };

      const getChoicesExistence = async () => {
        return await page.evaluate(() => {
          var choices = [
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
            "Citroen",
            "Other (describe)",
          ];
          var result;
          for (var i = 0; i < choices.length; i++) {
            if (document.documentElement.innerHTML.indexOf(choices[i]) === -1)
              return false;
          }
          return true;
        });
      };

      let choicesCount, choicesExistence;
      const checkIntegrity = async () => {
        choicesCount = await getChoicesCount();
        expect(choicesCount).toEqual(13);
        choicesExistence = await getChoicesExistence();
        expect(choicesExistence).toBeTruthy();
      };

      await page.evaluate(() => {
        window["survey"].getAllQuestions()[0].choicesOrder = "asc";
      });
      await checkIntegrity();

      await page.evaluate(() => {
        window["survey"].getAllQuestions()[0].choicesOrder = "desc";
      });
      await checkIntegrity();

      await page.evaluate(() => {
        window["survey"].getAllQuestions()[0].choicesOrder = "random";
      });
      await checkIntegrity();
    });

    test("show \"other\" choice", async ({ page }) => {
      await page.evaluate(() => {
        window["survey"].getAllQuestions()[0].hasOther = true;
      });
      await expect(page.locator(".sv-string-viewer").getByText("Other")).toBeVisible();
    });

    test("check \"other\" choice doesn't change order", async ({ page }) => {
      await setRowItemFlowDirection(page);

      const getOtherChoice = async () => {
        return await page.evaluate(() => {
          const columnClassName = ".sd-selectbase__column";
          const element = document.querySelector(
            `div[id*=sq_1] fieldset ${columnClassName}:nth-child(1) div:nth-of-type(4)`
          );
          return element ? element.textContent : "";
        });
      };

      await page.evaluate(() => {
        window["survey"].getAllQuestions()[0].hasOther = true;
      });
      await page.evaluate(() => {
        window["survey"].getAllQuestions()[0].choicesOrder = "desc";
      });

      const otherChoice = await getOtherChoice();
      expect(otherChoice?.trim()).toEqual("Other (describe)");
    });

    test("choose other", async ({ page }) => {
      const getOtherInput = () => page.locator("textarea").first();

      await page.evaluate(() => {
        window["survey"].getAllQuestions()[0].hasOther = true;
      });

      await page.locator("span").getByText("Other (describe)").click();
      await getOtherInput().fill("Zaporozec");
      await page.locator("input[value=Complete]").click();

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult.car).toStrictEqual(["other"]);
      expect(surveyResult["car-Comment"]).toEqual("Zaporozec");
    });

    test("choose other and storeOthersAsComment=false", async ({ page }) => {
      await page.evaluate(() => {
        window["survey"].storeOthersAsComment = false;
      });

      const getOtherInput = () => page.locator("textarea").first();

      await page.evaluate(() => {
        window["survey"].getAllQuestions()[0].hasOther = true;
      });

      await page.locator("span").getByText("Other (describe)").click();
      await getOtherInput().fill("New_Producer");
      await page.locator("input[value=Complete]").click();

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult.car).toEqual(["New_Producer"]);
    });

    test("choose other and \"textUpdateMode\": \"onTyping\"", async ({ page }) => {
      await page.evaluate(() => {
        window["survey"].textUpdateMode = "onTyping";
      });

      const getOtherInput = () => page.locator("textarea").first();

      await page.evaluate(() => {
        window["survey"].getAllQuestions()[0].hasOther = true;
      });

      await page.locator("span").getByText("Other (describe)").click();
      await getOtherInput().click();
      await page.keyboard.type("Comment");
      await page.locator("input[value=Complete]").click();

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult.car).toEqual(["other"]);
      expect(surveyResult["car-Comment"]).toEqual("Comment");
    });

    test("trim other", async ({ page }) => {
      const getOtherInput = () => page.locator("textarea").first();

      await page.evaluate(() => {
        window["survey"].getAllQuestions()[0].hasOther = true;
      });

      await page.locator("span").getByText("Other (describe)").click();
      await getOtherInput().fill("     ");
      await page.keyboard.press("Shift+Tab");
      await page.keyboard.press("Tab");
      await getOtherInput().fill("ab  ");
      await page.keyboard.press("Shift+Tab");
      await page.keyboard.press("Tab");
      await page.keyboard.press("ArrowRight");
      await getOtherInput().pressSequentially("cd  ");
      await page.locator("input[value=Complete]").click();

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult.car).toStrictEqual(["other"]);
      expect(surveyResult["car-Comment"]).toEqual("abcd");
    });

    test("checked class", async ({ page }) => {
      const isCheckedClassExistsByIndex = async (index) => {
        return await page.evaluate((index) => {
          const columnClassName = ".sd-selectbase__column";
          const element = document.querySelector(
            `fieldset ${columnClassName}:nth-child(3) div:nth-of-type(${index})`
          );
          return element ? element.classList.contains("sd-checkbox--checked") : false;
        }, index);
      };

      expect(await isCheckedClassExistsByIndex(2)).toBeFalsy();
      expect(await isCheckedClassExistsByIndex(3)).toBeFalsy();

      await page.locator(`fieldset ${columnClassName}:nth-child(3) div:nth-of-type(2) label`).click();
      await page.locator(`fieldset ${columnClassName}:nth-child(3) div:nth-of-type(3) label`).click();

      expect(await isCheckedClassExistsByIndex(2)).toBeTruthy();
      expect(await isCheckedClassExistsByIndex(3)).toBeTruthy();
    });

    test("Check that selectAll item is checked after loading data", async ({ page }) => {
      await page.evaluate(() => {
        window["survey"].getAllQuestions()[0].hasSelectAll = true;
      });

      const isSelectAllChecked = async () => {
        return await page.evaluate(() => {
          const columnClassName = ".sd-selectbase__column";
          const element = document.querySelector(
            `fieldset ${columnClassName}:nth-of-type(1) div:nth-of-type(1) input`
          );
          return element ? (element as HTMLInputElement).checked : false;
        });
      };

      const surveyData = {
        car: [
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
      };

      await page.evaluate((data) => {
        window["survey"].data = data;
      }, surveyData);

      expect(await isSelectAllChecked()).toBeTruthy();

      await page.locator("span").getByText("Select All").click();
      expect(await getData(page)).toEqual({});

      await page.locator("span").getByText("Select All").click();
      expect(await getData(page)).toEqual(surveyData);
    });

    test("showOtherItem&showCommentArea", async ({ page }) => {
      const getOtherInput = () => page.locator("textarea").first();
      const getCommentInput = () => page.locator("textarea").nth(1);

      await page.evaluate(() => {
        window["survey"].getAllQuestions()[0].showOtherItem = true;
        window["survey"].getAllQuestions()[0].showCommentArea = true;
        window["survey"].getAllQuestions()[0].commentText = "Comment on question";
        window["survey"].getAllQuestions()[0].otherText = "Other text";
      });

      await page.locator("span").getByText("Other text").click();
      await getOtherInput().fill(" ");
      await getOtherInput().selectText();
      await page.keyboard.press("Delete");
      await getOtherInput().fill("Audi");
      await getOtherInput().selectText();
      await page.keyboard.press("Delete");
      await getOtherInput().fill("Other value");
      await getCommentInput().fill("Comment value");
      await page.locator("input[value=Complete]").click();

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult.car).toStrictEqual(["Other value"]);
      expect(surveyResult["car-Comment"]).toEqual("Comment value");
    });
  });
});

frameworks.forEach((framework) => {
  test.describe(title + ": design time - " + framework, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await initSurvey(page, framework, json, true);
    });

    test("click on question title state editable", async ({ page }) => {
      const newTitle = "MyText";
      let json = JSON.parse(await getQuestionJson(page));
      let questionValue = await getQuestionValue(page);
      expect(questionValue.length).toEqual(0);

      const outerSelector = ".sd-question__title";
      const innerSelector = ".sv-string-editor";

      await page.locator(outerSelector).click();
      await page.locator(outerSelector + " " + innerSelector).fill(newTitle);
      await page.locator("body").click({ position: { x: 0, y: 0 } });

      questionValue = await getQuestionValue(page);
      expect(questionValue.length).toEqual(0);
      json = JSON.parse(await getQuestionJson(page));
      expect(json.title).toEqual(newTitle);
    });

    test("click on checkbox title state editable", async ({ page }) => {
      const newTitle = "MyText";
      let json = JSON.parse(await getQuestionJson(page));
      let questionValue = await getQuestionValue(page);
      expect(questionValue.length).toEqual(0);

      const outerSelector = ".sd-item__control-label";
      const innerSelector = ".sv-string-editor";

      await page.locator(outerSelector).nth(0).click({ force: true });
      await page.locator(outerSelector + " " + innerSelector).nth(0).fill(newTitle);
      await page.locator("body").click({ position: { x: 0, y: 0 } });

      questionValue = await getQuestionValue(page);
      expect(questionValue.length).toEqual(0);
      json = JSON.parse(await getQuestionJson(page));
      expect(json.choices[0].text).toEqual(newTitle);
    });
  });
});

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await initSurvey(page, framework, json);
    });

    test("maxSelectedChoices", async ({ page }) => {
      await page.evaluate(() => {
        window["survey"].questionsOnPageMode = "questionPerPage";
        window["survey"].getAllQuestions()[0].maxSelectedChoices = 2;
      });

      await page.locator(".sd-item__control-label").getByText("Nissan").click({ force: true });
      await page.locator(".sd-item__control-label").getByText("Audi").click({ force: true });
      await page.locator(".sd-item__control-label").getByText("Ford").click({ force: true });
      await page.locator(".sd-item__control-label").getByText("Audi").click({ force: true });
      await page.locator(".sd-item__control-label").getByText("BMW").click({ force: true });
      await page.locator("input[value=Complete]").click();

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult.car).toEqual(["Nissan", "BMW"]);
    });

    test("check other comment is focused after other item is selected", async ({ page }) => {
      await page.locator(".sv-string-viewer").getByText("Other (describe)").click();
      await expect(page.locator("textarea")).toBeFocused();
    });
  });
});

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await page.setViewportSize({ width: 800, height: 600 });
    });

    test("maxSelectedChoices in matrix with showInMultipleColumns", async ({ page }) => {
      await initSurvey(page, framework, {
        "elements": [
          {
            "type": "matrixdropdown",
            "name": "q1",
            "columns": [
              {
                "name": "col1",
                "cellType": "checkbox",
                "showInMultipleColumns": true,
                "choices": ["a", "b", "c", "d", "e"],
                "maxSelectedChoices": 2
              }
            ],
            "rows": ["row1"]
          }
        ]
      });

      const checks = page.locator(".sd-checkbox__decorator");
      await checks.nth(0).click({ force: true });
      await checks.nth(1).click({ force: true });
      await checks.nth(2).click({ force: true });
      await checks.nth(3).click({ force: true });
      await checks.nth(4).click({ force: true });
      await page.locator("input[value=Complete]").click();

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult.q1.row1.col1).toEqual(["a", "b"]);
    });
  });
});