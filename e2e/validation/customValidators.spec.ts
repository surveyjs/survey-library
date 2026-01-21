import { frameworks, url, initSurvey, getSurveyResult, test, expect } from "../helper";

const title = "customValidators";

const setupSurvey = async (page: any) => {
  await page.evaluate(() => {
    var MyTextValidator = (function(_super) {
      function MyTextValidator() {
        return Reflect.construct(_super, arguments, MyTextValidator);
      }
      MyTextValidator.prototype.getType = function() {
        return "mytextvalidator";
      };
      MyTextValidator.prototype.validate = function(value, name) {

        if (value.indexOf("survey") < 0) {
          //report an error
          return new window["Survey"].ValidatorResult(
            null,
            new window["Survey"].CustomError(this.getErrorText(name))
          );
        }
        //return Survey.ValidatorResult object if you want to correct the entered value
        // return new Survey.ValidatorResult(youCorrectedValue);
        //return nothing if there is no any error.
        return null;
      };
      //the default error text. It shows if user do not set the 'text' property
      MyTextValidator.prototype.getDefaultErrorText = function(name) {
        return "You text should contains 'survey' word.";
      };
      Reflect.setPrototypeOf(MyTextValidator.prototype, _super.prototype);
      Reflect.setPrototypeOf(MyTextValidator, _super);
      return MyTextValidator;
    })(window["Survey"].SurveyValidator);
    // window["Survey"].MyTextValidator = MyTextValidator;
    //add into survey Json metaData
    window["Survey"].Serializer.addClass(
      "mytextvalidator",
      [],
      function() {
        // @ts-expect-error - MyTextValidator is a constructor defined in browser context
        return new MyTextValidator();
      },
      "surveyvalidator"
    );
  });
};

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test("check validation", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await setupSurvey(page);

      const json = {
        elements: [
          {
            type: "comment",
            name: "memo",
            isRequired: true,
            title: "Type here 'survey' to pass the validation ",
            validators: [{ type: "mytextvalidator" }]
          }
        ]
      };
      await initSurvey(page, framework, json);

      const getError1Div = page.locator("div").filter({ hasText: "Response required." });
      const getError2Div = page.locator("div").filter({ hasText: "You text should contains 'survey' word." });

      await page.locator("button[title=Complete]").click();
      await expect(getError1Div.first()).toBeVisible({ timeout: 1000 });

      await page.locator("textarea").fill("wombat");
      await page.locator("button[title=Complete]").click();
      await expect(getError2Div.first()).toBeVisible({ timeout: 1000 });

      await page.locator("textarea").pressSequentially(" survey");
      await page.locator("button[title=Complete]").click();

      const surveyResult = await getSurveyResult(page);
      await expect(surveyResult).toEqual({ memo: "wombat survey" });
    });
  });
});

