import { frameworks, url, initSurvey, getSurveyResult } from "../helper";
import { Selector, ClientFunction, fixture, test } from "testcafe";
const title = "hasComment";

const json = {
  elements: [
    {
      type: "checkbox",
      name: "q1",
      hasComment: true,
      choices: ["item1", "item2"]
    }
  ]
};

const clearQuestionValue = ClientFunction(() => {
  window["survey"].clearValue("q1");
});
export const getQuestionComment = ClientFunction(() => {
  return window["survey"].getAllQuestions()[0].comment;
});

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async (t) => {
      await initSurvey(framework, json);
    }
  );

  test("Enter and clear commment", async (t) => {
    const getTextarea = Selector(() => document.querySelector("textarea"));

    await t
      .typeText(await getTextarea(), "01234 56789")
      .pressKey("tab");
    await t.expect(getQuestionComment()).eql("01234 56789");
    await clearQuestionValue();
    await t.expect(getTextarea.value).eql("");
    await t.expect(getQuestionComment()).eql("");
  });
});
