import { frameworks, url, initSurvey, getSurveyResult } from "../helper";
import { Selector, fixture, test } from "testcafe";
const title = "First Page is Started";

const json = {
  pages: [
    { elements: [{ type: "text", name: "name" }] },
    {
      elements: [
        { type: "text", name: "address" },
      ],
    }
  ],
  firstPageIsStarted: true
};

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async (t) => {
      await initSurvey(framework, json);
    }
  );

  test("Enter data on first question", async (t) => {
    await t.typeText(Selector("input[type=text]"), "Jon Snow");
    await t.click("input[value=Start]");
    await t.typeText(Selector("input[type=text]"), "Winterfell");
    await t.click("input[value=Complete]");
    const surveyResult = await getSurveyResult();
    await t.expect(surveyResult).eql({
      name: "Jon Snow",
      address: "Winterfell"
    });
  });
});
