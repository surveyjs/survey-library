import { frameworks, url_test, initSurvey } from "../helper";
import { Question, QuestionBoolean } from "../questionHelper";
import { test, expect } from "@playwright/test";

const themeName = "defaultV2";
const title = "boolean";
frameworks.forEach((framework) => {
  test.describe(title + " - " + framework, () => {
    test.beforeEach(async ({ page }) => {
      const json = {
        questions: [
          {
            type: "boolean",
            name: "bool",
            title: "Are you 21 or older?",
            isRequired: true,
          },
        ],
      };
      await page.goto(`${url_test}${themeName}/${framework}`);
      await initSurvey(page, framework, json);
    });
    test("checked class", async ({ page }) => {
      const question = new QuestionBoolean(page, "bool");
      await question.isClassChecked(false);
      await question.rootLoc.click();
      await question.isClassChecked(true);
      await question.rootLoc.click();
      await question.isClassChecked(false);
      await question.rootLoc.click();
      await question.isClassChecked(true);
    });
    test("click on true label in intermediate state", async ({ page }) => {
      const question = new QuestionBoolean(page, "bool");
      await question.checkQuestionValue(undefined);
      await question.clickThumb(true);
      await question.checkQuestionValue(true);
    });
    test("click on false label in intermediate state", async ({ page }) => {
      const question = new QuestionBoolean(page, "bool");
      await question.checkQuestionValue(undefined);
      await question.clickThumb(false);
      await question.checkQuestionValue(false);
    });
    /*
    Can't click on invisible element in playwright
    test("click on right side of switch in intermediate state", async ({ page }) => {
      const question = new QuestionBoolean(page, "bool");
      await question.checkQuestionValue(undefined);
      //await question.clickSwitch(-2);
      await question.checkQuestionValue(true);
    });
    test("click on left side of switch in intermediate state", async ({ page }) => {
      const question = new QuestionBoolean(page, "bool");
      await question.checkQuestionValue(undefined);
      //await question.clickSwitch(2);
      await question.checkQuestionValue(false);
    });
    */
    test("check arrow keydowns", async ({ page }) => {
      const question = new QuestionBoolean(page, "bool");
      await question.focus();
      await question.checkQuestionValue(undefined);
      page.keyboard.press("ArrowRight");
      await question.checkQuestionValue(true);
      page.keyboard.press("ArrowLeft");
      await question.checkQuestionValue(false);
    });
  });
});
frameworks.forEach((framework) => {
  test.describe(title + ": design time - " + framework, () => {
    test.beforeEach(async ({ page }) => {
      const json = {
        questions: [
          {
            type: "boolean",
            name: "bool",
            title: "Question1",
            isRequired: true,
          },
        ],
      };
      await page.goto(`${url_test}${themeName}/${framework}`);
      await initSurvey(page, framework, json, true);
    });
    test("click on question title state editable", async ({ page }) => {
      const question = new QuestionBoolean(page, "bool");
      const loc = question.question.locator("span").getByText("Question1");
      await loc.click();
      await loc.selectText();
      await page.keyboard.type("MyText");
      await page.keyboard.press("Tab");
      await question.checkPropertyValue("title", "MyText");
    });
    test("click on true label in intermediate state editable", async ({ page }) => {
      const question = new QuestionBoolean(page, "bool");
      const loc = question.question.locator("span").getByText("Yes");
      await loc.click();
      await loc.selectText();
      await page.keyboard.type("MyText");
      await page.keyboard.press("Tab");
      await question.checkPropertyValue("labelFalse", "No");
      await question.checkPropertyValue("labelTrue", "MyText");
    });
    test("click on false label in intermediate state editable", async ({ page }) => {
      const question = new QuestionBoolean(page, "bool");
      const loc = question.question.locator("span").getByText("No");
      await loc.click();
      await loc.selectText();
      await page.keyboard.type("MyText");
      await page.keyboard.press("Tab");
      await question.checkPropertyValue("labelFalse", "MyText");
      await question.checkPropertyValue("labelTrue", "Yes");
    });
  });
});
frameworks.forEach((framework) => {
  test.describe(title + ": custom input - " + framework, () => {
    test("click on question title state editable", async ({ page }) => {
      const json = {
        questions: [
          {
            type: "boolean",
            name: "bool",
            title: "Are you 21 or older?",
            renderAs: "checkbox",
            isRequired: true,
          },
        ],
      };
      await page.goto(`${url_test}${themeName}/${framework}`);
      await initSurvey(page, framework, json);
      const question = new Question(page, "bool");
      await question.checkQuestionValue(undefined);
      await page.locator(".sd-selectbase__label").click();
      await question.checkQuestionValue(true);
      await page.locator(".sd-selectbase__label").click();
      await question.checkQuestionValue(false);
    });
    test("test radio boolean", async ({ page }) => {
      const json = {
        questions: [
          {
            type: "boolean",
            name: "bool",
            title: "Are you 21 or older?",
            isRequired: true,
            renderAs: "radio"
          },
        ],
      };
      await page.goto(`${url_test}${themeName}/${framework}`);
      await initSurvey(page, framework, json);
      const question = new Question(page, "bool");
      await question.checkQuestionValue(undefined);
      await page.locator(".sv-string-viewer").getByText("No").click();
      await question.checkQuestionValue(false);
      await page.locator(".sv-string-viewer").getByText("Yes").click();
      await question.checkQuestionValue(true);
    });
  });
});
frameworks.forEach((framework) => {
  test.describe(title + ": custom - " + framework, () => {
    test("Check actions", async ({ page }) => {
      await page.goto(`${url_test}${themeName}/${framework}`);
      await initSurvey(page, framework, {});
      await page.evaluate(() => {
        const survey = window["survey"];
        survey.onGetQuestionTitleActions.add((_, options) => {
          options.titleActions = [
            {
              title: "Click me",
              action: () => {
                const q = options.question;
                if(!q.description) {
                  q.description = "Description1";
                } else {
                  q.descriptionLocation = q.descriptionLocation === "hidden" ? "default" : "hidden";
                }
              },
            }];
        });
        const json = {
          elements: [
            {
              type: "boolean",
              name: "bool",
              title: "21",
              titleLocation: "hidden",
              renderAs: "checkbox",
            },
          ],
        };
        survey.fromJSON(json);
      });

      const strLoc = page.locator(".sv-string-viewer");
      const action = page.locator(".sd-action__title").getByText("Click me");
      const locDesc = strLoc.getByText("Description1");

      expect(strLoc.getByText("21")).toBeVisible();

      await action.click();
      expect(locDesc).toBeVisible();
      await action.click();
      expect(locDesc).toBeVisible({ visible: false });
      await action.click();
      expect(locDesc).toBeVisible();
    });
    test("test radio boolean with values", async ({ page }) => {
      await page.goto(`${url_test}${themeName}/${framework}`);
      await initSurvey(page, framework, {
        "elements": [{
          "type": "boolean",
          "name": "q",
          "title": "Are you 21 or older?",
          "valueTrue": "Yes",
          "valueFalse": "No",
          "renderAs": "radio"
        }],
        "showQuestionNumbers": false
      });
      const question = new QuestionBoolean(page, "q");
      const radioInput = page.locator("input[type='radio']");
      const sdItem = page.locator(".sd-item");
      const checkedClass = "sd-radio--checked";

      await question.checkQuestionValue(undefined);
      expect(radioInput.nth(0)).toBeChecked({ checked: false });
      expect(radioInput.nth(1)).toBeChecked({ checked: false });
      question.hasClassIncluded(sdItem.nth(0), false, checkedClass);
      question.hasClassIncluded(sdItem.nth(1), false, checkedClass);

      await question.clickItemByText("No");
      await question.checkQuestionValue("No");
      expect(radioInput.nth(0)).toBeChecked({ checked: true });
      expect(radioInput.nth(1)).toBeChecked({ checked: false });
      question.hasClassIncluded(sdItem.nth(0), true, checkedClass);
      question.hasClassIncluded(sdItem.nth(1), false, checkedClass);

      await question.clickItemByText("Yes");
      await question.checkQuestionValue("Yes");
      expect(radioInput.nth(0)).toBeChecked({ checked: false });
      expect(radioInput.nth(1)).toBeChecked({ checked: true });
      question.hasClassIncluded(sdItem.nth(0), false, checkedClass);
      question.hasClassIncluded(sdItem.nth(1), true, checkedClass);
    });
  });
});