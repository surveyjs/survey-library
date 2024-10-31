import { frameworks, url_test, initSurvey } from "../helper";
import { QuestionRadiogroup } from "../questionHelper";
import { test, expect } from "@playwright/test";
import { Survey } from "../surveyHelper";

const themeName = "defaultV2";
const title = "setValueTrigger";

frameworks.forEach((framework) => {
  test.describe(title + " - " + framework, () => {
    test.beforeEach(async ({ page }) => {
      const json = {
        triggers: [
          {
            type: "setvalue",
            name: "copy",
            operator: "equal",
            value: "Yes",
            setToName: "name",
            setValue: "Jon Snow",
          },
          {
            type: "setvalue",
            name: "copy",
            operator: "equal",
            value: "Yes",
            setToName: "email",
            setValue: "jon.snow@nightwatch.com",
          },
          {
            type: "setvalue",
            name: "copy",
            operator: "equal",
            value: "Yes",
            setToName: "tempvar",
            isVariable: true,
            setValue: "You have decided to use your current information.",
          },
          {
            type: "setvalue",
            name: "copy",
            operator: "equal",
            value: "No",
            setToName: "name",
            setValue: "",
          },
          {
            type: "setvalue",
            name: "copy",
            operator: "equal",
            value: "No",
            setToName: "email",
            setValue: "",
          },
          {
            type: "setvalue",
            name: "copy",
            operator: "equal",
            value: "No",
            setToName: "tempvar",
            isVariable: true,
            setValue: "You have decided not to use your current information.",
          },
        ],
        pages: [
          {
            title: "Customer information",
            questions: [
              {
                type: "radiogroup",
                name: "copy",
                title: "Use your current data",
                choices: ["Yes", "No"],
                isRequired: true,
                colCount: 0,
              },
              { type: "text", name: "name", title: "Name:", isRequired: true },
              {
                type: "text",
                name: "email",
                title: "Your e-mail",
                isRequired: true,
                validators: [{ type: "email" }],
              },
            ],
          },
        ],
        completedHtml:
          "<p><h4>Thank you for sharing this information with us.</h4></p><p>Your name is: <b>{name}</b></p><p>Your email is: <b>{email}</b></p><p>This information is not in the survey data result:<b> {tempvar}</b></p>",
      };
      await page.goto(`${url_test}${themeName}/${framework}`);
      await initSurvey(page, framework, json);
    });
    test("check triggers execution", async ({ page }) => {
      const survey = new Survey(page);
      const copy = new QuestionRadiogroup(page, "copy");
      await copy.clickByValue("Yes");
      await survey.complete();
      await expect(page.locator("b").getByLabel("Jon Snow").isVisible).toBeTruthy();

      await survey.checkData({
        copy: "Yes",
        name: "Jon Snow",
        email: "jon.snow@nightwatch.com",
      });
    });
  });
});