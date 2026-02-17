import { Page } from "playwright";
import { frameworks, url, initSurvey, getSurveyResult, test, expect, getButtonByText } from "../helper";

const title = "validateOnEvent";

const setupSurvey = async (page: Page) => {
  await page.evaluate(() => {
    function isNumber(n: any) {
      return n && !isNaN(parseFloat(n)) && isFinite(n);
    }
    (window as any).survey.onValidateQuestion.add(function(s, options) {
      if (options.name == "pricelimit") {
        var leastamount = options.value["leastamount"];
        var mostamount = options.value["mostamount"];
        if (!isNumber(leastamount)) {
          options.error = "The 'least amount' should be a numeric.";
        } else {
          if (!isNumber(mostamount)) {
            options.error = "The 'most amount' should be a numeric.";
          } else {
            if (leastamount > mostamount) {
              options.error = "The 'most amount' should be more 'less amount'.";
            }
          }
        }
      }
      if (options.name == "firstcomputer") {
        if (options.value.indexOf("computer") < 0) {
          options.error = "Please type the word 'computer'.";
        }
      }
    });
  });
};

const json = {
  elements: [
    {
      type: "multipletext",
      name: "pricelimit",
      title: "What is the... ",
      isRequired: true,
      colCount: 2,
      items: [
        {
          name: "leastamount",
          title: "The least amount you have ever paid for a computer"
        },
        {
          name: "mostamount",
          title: "The most amount you have ever paid for a computer"
        }
      ]
    },
    {
      type: "comment",
      name: "firstcomputer",
      title: "Please tell us about your first computer",
      isRequired: true,
      validators: [{ type: "text", minLength: 20 }]
    }
  ]
};

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test("check validation", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await initSurvey(page, framework, json);
      await setupSurvey(page);

      const getError = (text: string, index: number) => {
        return page.locator("*").filter({ hasText: text }).nth(index);
      };

      const getTextInputByIndex = (index: number) => {
        return page.locator("div input[type=text]").nth(index);
      };

      const getTextarea = () => {
        return page.locator("textarea");
      };

      await getTextInputByIndex(0).fill("wombat");
      await getTextInputByIndex(1).fill("wombat");
      await getTextarea().fill("01234567890123456789");
      await getButtonByText(page, "Complete").click();
      await getError("The 'least amount' should be a numeric.", 0).hover();
      await getError("Please type the word 'computer'.", 0).hover();

      await getTextInputByIndex(0).fill("10");
      await getButtonByText(page, "Complete").click();
      await getError("The 'most amount' should be a numeric.", 0).hover();

      await getTextInputByIndex(1).fill("10000");
      await getTextarea().pressSequentially("0123456789computer0123456789");
      await getButtonByText(page, "Complete").click();

      const surveyResult = await getSurveyResult(page);
      await expect(surveyResult).toEqual({
        pricelimit: {
          leastamount: "10",
          mostamount: "10000"
        },
        firstcomputer: "012345678901234567890123456789computer0123456789"
      });
    });
  });
});

