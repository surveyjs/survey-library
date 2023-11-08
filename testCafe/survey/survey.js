import { frameworks, url_test, initSurvey, applyTheme } from "../helper";
import { Selector, ClientFunction, fixture, test } from "testcafe";
const title = "Survey";

var json = {
  pages: [
    {
      name: "page1",
      elements: [
        {
          type: "radiogroup",
          name: "question1",
          choices: ["Item 1", "Item 2", "Item 3"]
        }
      ]
    }
  ]
};

const themeName = "defaultV2";

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`
    .page`${url_test}${themeName}/${framework}`.beforeEach(async (t) => {
    await applyTheme(themeName);
    await initSurvey(framework, json);
    await t.resizeWindow(1600, 900);
  });
  test("Update survey via fromJSON", async (t) => {
    const updateSurvey = ClientFunction(() => {
      window.survey.data = { question1: "Item 1" };
      var newJson = {
        pages: [
          {
            name: "page1",
            elements: [
              {
                type: "radiogroup",
                isRequired: true,
                name: "question1",
                choices: ["Item 1", "Item 2", "Item 3"]
              }
            ]
          }
        ]
      };
      window.survey.fromJSON(newJson);
    });
    await t
      .expect(Selector("span").withText("question1").visible).ok();
    await t
      .wait(500);
    await updateSurvey();
    await t
      .wait(500);
    await updateSurvey();
    await t
      .wait(500)
      .expect(Selector("span").withText("question1").visible).ok();
  });
});
