import { frameworks, url, initSurvey, getQuestionValue, getQuestionJson, test, expect } from "../helper";

const title = "boolean";

const json = {
  elements: [
    {
      type: "boolean",
      name: "q",
    },
  ],
};

const jsonCheckbox = {
  elements: [
    {
      type: "boolean",
      name: "q",
      renderAs: "checkbox",
    },
  ],
};

const jsonCheckbox2 = {
  elements: [
    {
      type: "boolean",
      name: "q",
      title: "Are you 21 or older?",
      renderAs: "checkbox",
    },
  ],
};

const jsonRadio = {
  elements: [
    {
      type: "boolean",
      name: "q",
      renderAs: "radio",
    },
  ],
};

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await initSurvey(page, framework, json);
    });

    test("checked class", async ({ page }) => {
      const label = page.locator("div label");
      const checkedClassName = /sd-boolean--checked/;
      await expect(label).not.toHaveClass(checkedClassName);

      const { x, y, width, height } = await <any>label.boundingBox();
      await label.click({ position: { x: 4, y: height / 2 } });
      await expect(label).not.toHaveClass(checkedClassName);

      await label.click();
      await expect(label).toHaveClass(checkedClassName);
    });

    test("click on true label in intermediate state", async ({ page }) => {
      let questionValue = await getQuestionValue(page);
      expect(questionValue).toEqual(undefined);

      await page.locator("span").filter({ hasText: "Yes" }).first().click();

      questionValue = await getQuestionValue(page);
      expect(questionValue).toEqual(true);
    });

    test("click on false label in intermediate state", async ({ page }) => {
      let questionValue = await getQuestionValue(page);
      expect(questionValue).toEqual(undefined);

      await page.locator("span").filter({ hasText: "No" }).first().click();

      questionValue = await getQuestionValue(page);
      expect(questionValue).toEqual(false);
    });

    test("click on right side of switch in intermediate state", async ({ page }) => {
      let questionValue = await getQuestionValue(page);
      expect(questionValue).toEqual(undefined);

      const { x, y, width, height } = await <any>page.locator(".sd-boolean").boundingBox();

      await page.locator(".sd-boolean").click({ position: { x: width - 4, y: height / 2 } });
      questionValue = await getQuestionValue(page);
      expect(questionValue).toEqual(true);
    });

    test("click on left side of switch in intermediate state", async ({ page }) => {
      let questionValue = await getQuestionValue(page);
      expect(questionValue).toEqual(undefined);

      const { x, y, width, height } = await <any>page.locator(".sd-boolean").boundingBox();
      await page.locator(".sd-boolean").click({ position: { x: 4, y: height / 2 } });
      questionValue = await getQuestionValue(page);
      expect(questionValue).toEqual(false);
    });

    test("check arrow keydowns", async ({ page }) => {
      page.keyboard.press("Tab");
      expect(await getQuestionValue(page)).toEqual(undefined);
      await page.keyboard.press("ArrowRight");
      expect(await getQuestionValue(page)).toBeTruthy();
      await page.keyboard.press("ArrowLeft");
      expect(await getQuestionValue(page)).toEqual(false);
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
      let json = JSON.parse(await getQuestionJson(page));
      let questionValue = await getQuestionValue(page);
      expect(questionValue).toEqual(undefined);

      const outerSelector = ".sd-question__title";
      const innerSelector = ".sv-string-editor";
      await page.locator(outerSelector).click();
      await page.locator(outerSelector + " " + innerSelector).fill(newTitle);
      await page.locator("body").click({ position: { x: 0, y: 0 } });

      questionValue = await getQuestionValue(page);
      expect(questionValue).toEqual(undefined);

      json = JSON.parse(await getQuestionJson(page));
      expect(json.title).toEqual(newTitle);
    });

    test("click on true label in intermediate state editable", async ({ page }) => {
      const newLabelTrue = "MyText";
      let json = JSON.parse(await getQuestionJson(page));
      const labelFalse = json.labelFalse;
      let questionValue = await getQuestionValue(page);
      expect(questionValue).toEqual(undefined);

      const outerSelector = page.getByText("Yes");
      await outerSelector.click();
      await outerSelector.fill(newLabelTrue);
      await page.locator("body").click({ position: { x: 0, y: 0 } });

      questionValue = await getQuestionValue(page);
      expect(questionValue).toEqual(undefined);

      json = JSON.parse(await getQuestionJson(page));
      expect(json.labelFalse).toEqual(labelFalse);
      expect(json.labelTrue).toEqual(newLabelTrue);
    });

    test("click on false label in intermediate state editable", async ({ page }) => {
      const newLabelFalse = "MyText";
      let json = JSON.parse(await getQuestionJson(page));
      const labelTrue = json.labelTrue;
      let questionValue = await getQuestionValue(page);
      expect(questionValue).toEqual(undefined);

      const outerSelector = page.getByText("No");
      await outerSelector.click();
      await outerSelector.fill(newLabelFalse);
      await page.locator("body").click({ position: { x: 0, y: 0 } });

      questionValue = await getQuestionValue(page);
      expect(questionValue).toEqual(undefined);

      json = JSON.parse(await getQuestionJson(page));
      expect(json.labelFalse).toEqual(newLabelFalse);
      expect(json.labelTrue).toEqual(labelTrue);
    });
  });
});

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("check first clink on boolean-checkbox input", async ({ page }) => {
      await initSurvey(page, framework, jsonCheckbox);
      const selector = page.locator(".sd-checkbox__decorator");
      await selector.click();
      await expect(selector).toBeChecked();
    });

    test("test radio boolean", async ({ page }) => {
      await initSurvey(page, framework, jsonRadio);
      await expect(page.locator("input[type=radio]").nth(0)).not.toBeChecked();
      await expect(page.locator("input[type=radio]").nth(1)).not.toBeChecked();
      await page.locator(".sv-string-viewer").getByText("No").click();
      await expect(page.locator("input[type=radio]").nth(0)).toBeChecked();
      await expect(page.locator("input[type=radio]").nth(1)).not.toBeChecked();
      await page.locator(".sv-string-viewer").getByText("Yes").click();
      await expect(page.locator("input[type=radio]").nth(0)).not.toBeChecked();
      await expect(page.locator("input[type=radio]").nth(1)).toBeChecked();
    });

    test("Check actions", async ({ page }) => {
      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        (window as any)["survey"].onGetQuestionTitleActions.add((_, options) => {
          options.actions = [
            {
              title: "Click me",
              action: () => {
                const q = options.question;
                if (!q.description) {
                  q.description = "Description!";
                } else {
                  q.descriptionLocation = q.descriptionLocation === "hidden" ? "default" : "hidden";
                }
              },
            },
          ];
        });
        window["survey"].fromJSON(json);
      }, jsonCheckbox2);

      await expect(page.locator(".sv-string-viewer").getByText("21")).toBeVisible();
      await expect(page.locator(".sv-string-viewer").getByText("Description!")).not.toBeVisible();
      await page.locator(".sd-action__title").getByText("Click me").click();
      await expect(page.locator(".sv-string-viewer").getByText("Description!")).toBeVisible();
      await page.locator(".sd-action__title").getByText("Click me").click();
      await expect(page.locator("div").getByText("Description!")).not.toBeVisible();
      await page.locator(".sd-action__title").getByText("Click me").click();
      await expect(page.locator(".sv-string-viewer").getByText("Description!")).toBeVisible();
    });

    test("test radio boolean with values", async ({ page }) => {
      const checkQuestionValue = async (val: any) => {
        return await page.evaluate((val) => {
          return (window as any)["survey"].getQuestionByName("q").value == val;
        }, val);
      };
      await initSurvey(page, framework, {
        elements: [
          {
            type: "boolean",
            name: "q",
            title: "Are you 21 or older?",
            valueTrue: "Yes",
            valueFalse: "No",
            renderAs: "radio",
          },
        ],
        showQuestionNumbers: false,
      });
      await expect(page.locator("input[type=radio]").nth(0)).not.toBeChecked();
      await expect(page.locator(".sd-item").nth(0)).not.toHaveClass(/sd-radio--checked/);
      await expect(page.locator("input[type=radio]").nth(1)).not.toBeChecked();
      await expect(page.locator(".sd-item").nth(1)).not.toHaveClass(/sd-radio--checked/);
      expect(await checkQuestionValue(null)).toBeTruthy();

      await page.locator(".sv-string-viewer").getByText("No").click();
      await expect(page.locator("input[type=radio]").nth(0)).toBeChecked();
      await expect(page.locator(".sd-item").nth(0)).toHaveClass(/sd-radio--checked/);
      await expect(page.locator("input[type=radio]").nth(1)).not.toBeChecked();
      await expect(page.locator(".sd-item").nth(1)).not.toHaveClass(/sd-radio--checked/);
      expect(await checkQuestionValue("No")).toBeTruthy();

      await page.locator(".sv-string-viewer").getByText("Yes").click();
      await expect(page.locator("input[type=radio]").nth(0)).not.toBeChecked();
      await expect(page.locator("input[type=radio]").nth(1)).toBeChecked();
      expect(await checkQuestionValue("Yes")).toBeTruthy();

      await page.locator(".sv-string-viewer").getByText("No").click();
      await expect(page.locator("input[type=radio]").nth(0)).toBeChecked();
      await expect(page.locator("input[type=radio]").nth(1)).not.toBeChecked();
      expect(await checkQuestionValue("No")).toBeTruthy();
    });
  });
});

