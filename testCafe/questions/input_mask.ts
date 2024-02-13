import { Selector, fixture, test, ClientFunction } from "testcafe";
import { frameworks, url, initSurvey, getSurveyResult } from "../helper";
const title = "Input mask";

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}`;

  test("Save unmasked value", async (t) => {
    await initSurvey(framework, {
      focusFirstQuestionAutomatic: true,
      questions: [
        {
          name: "name",
          type: "text",
          maskType: "pattern",
          maskSettings: {
            mask: "+99-99"
          }
        }]
    });

    await t
      .pressKey("1 2 3 4")
      .expect(Selector("input").value).eql("+12-34")
      .click("input[value=Complete]");

    const surveyResult = await getSurveyResult();
    await t.expect(surveyResult).eql({
      name: "1234",
    });
  });
});