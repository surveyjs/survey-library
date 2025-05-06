import { frameworks, url, initSurvey, getSurveyResult, test, expect } from "../helper";

const title = "setValueTrigger";

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

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await initSurvey(page, framework, json);
      await page.setViewportSize({ width: 1000, height: 1000 });
    });

    test("check visibility", async ({ page }) => {
      const completeSelector = page.locator("input[value=\"Complete\"]").filter({ visible: true });
      const yesSelector = page.locator("label").filter({ hasText: "Yes" }).locator("span").first();

      await yesSelector.click();
      await completeSelector.click();

      const completedPage = page.locator(".sd-completedpage");
      await expect(completedPage).toContainText("Jon Snow");

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult).toEqual({
        copy: "Yes",
        name: "Jon Snow",
        email: "jon.snow@nightwatch.com",
      });
    });
  });
});