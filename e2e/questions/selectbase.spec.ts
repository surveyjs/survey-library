import { frameworks, url, initSurvey, getSurveyResult, test, expect } from "../helper";

const title = "selectbase";

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await page.setViewportSize({ width: 800, height: 600 });
    });

    test("checkbox: choiceitem elements #10390", async ({ page }) => {
      const json = {
        "elements": [
          {
            "type": "checkbox",
            "name": "checkbox",
            "choices": [
              {
                "value": "email",
                "elements": [
                  {
                    "type": "text",
                    "name": "email"
                  }
                ]
              },
              {
                "value": "phone_call",
                "elements": [
                  {
                    "type": "text",
                    "name": "phone"
                  }
                ]
              }
            ]
          }
        ]
      };
      await initSurvey(page, framework, json);

      const checks = page.locator(".sd-item__decorator");
      const emailChoiceItem = page.getByRole("textbox", { name: "email" });
      const phoneChoiceItem = page.getByRole("textbox", { name: "phone" });

      expect(emailChoiceItem.isHidden).toBeTruthy();
      expect(phoneChoiceItem.isHidden).toBeTruthy();

      await checks.nth(1).click({ force: true });
      expect(emailChoiceItem.isHidden).toBeTruthy();
      expect(phoneChoiceItem.isVisible).toBeTruthy();

      phoneChoiceItem.fill("+1-111-11");
      await page.locator("button[title=Complete]").click();
      const surveyResult = await getSurveyResult(page);
      expect(surveyResult).toEqual({
        checkbox: ["phone_call"],
        phone: "+1-111-11"
      });
    });

    test("radiogroup: choiceitem elements #10390", async ({ page }) => {
      const json = {
        "elements": [
          {
            "type": "radiogroup",
            "name": "checkbox",
            "choices": [
              {
                "value": "email",
                "elements": [
                  {
                    "type": "text",
                    "name": "email"
                  }
                ]
              },
              {
                "value": "phone_call",
                "elements": [
                  {
                    "type": "text",
                    "name": "phone"
                  }
                ]
              }
            ]
          }
        ]
      };
      await initSurvey(page, framework, json);

      const checks = page.locator(".sd-item__decorator");
      const emailChoiceItem = page.getByRole("textbox", { name: "email" });
      const phoneChoiceItem = page.getByRole("textbox", { name: "phone" });

      expect(emailChoiceItem.isHidden).toBeTruthy();
      expect(phoneChoiceItem.isHidden).toBeTruthy();

      await checks.nth(1).click({ force: true });
      expect(emailChoiceItem.isHidden).toBeTruthy();
      expect(phoneChoiceItem.isVisible).toBeTruthy();

      phoneChoiceItem.fill("+1-111-11");
      await page.locator("button[title=Complete]").click();
      const surveyResult = await getSurveyResult(page);
      expect(surveyResult).toEqual({
        checkbox: "phone_call",
        phone: "+1-111-11"
      });
    });
  });
});