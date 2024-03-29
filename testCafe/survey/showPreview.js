import { frameworks, url, initSurvey, getSurveyResult } from "../helper";
import { Selector, ClientFunction, fixture, test } from "testcafe";
const title = "ShowPreview";

const json = {
  pages: [
    { elements: [{ type: "text", name: "q1" }] },
    {
      elements: [
        { type: "text", name: "q2", defaultValue: "2" },
        { type: "text", name: "q3" },
      ],
    },
    { elements: [{ type: "text", name: "q4", defaultValue: "4" }] },
    { elements: [{ type: "text", name: "q5" }] },
  ],
};

const showAnsweredQuestions = ClientFunction(() => {
  window["survey"].showPreviewBeforeComplete = "showAnsweredQuestions";
});
const showAllQuestions = ClientFunction(() => {
  window["survey"].showPreviewBeforeComplete = "showAllQuestions";
});
const goLastPage = ClientFunction(() => {
  window["survey"].currentPageNo = window["survey"].visiblePageCount - 1;
});

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async (t) => {
      await initSurvey(framework, json);
    }
  );

  test("showPreview = showAllQuestions", async (t) => {
    await showAllQuestions();
    await goLastPage();
    await t.click("input[value=Preview]");
    await t.expect(Selector("input[title=Edit]").count).eql(4);
    await t.click(Selector("input[title=Edit]").nth(1));
    await t.typeText(Selector("input[type=text]").nth(1), "val3");
    await t
      .click("input[value=Next]")
      .click("input[value=Next]")
      .click("input[value=Preview]")
      .click("input[value=Complete]");
    const surveyResult = await getSurveyResult();
    await t.expect(surveyResult).eql({
      q2: "2",
      q3: "val3",
      q4: "4",
    });
  });
  test("showPreview = showAnsweredQuestions", async (t) => {
    await showAnsweredQuestions();
    await goLastPage();
    await t.click("input[value=Preview]");
    await t.expect(Selector("input[title=Edit]").count).eql(2);
    await t.click(Selector("input[title=Edit]").nth(0));
    await t.typeText(Selector("input[type=text]").nth(1), "val3");
    await t
      .click("input[value=Next]")
      .click("input[value=Next]")
      .click("input[value=Preview]")
      .click("input[value=Complete]");
    const surveyResult = await getSurveyResult();
    await t.expect(surveyResult).eql({
      q2: "2",
      q3: "val3",
      q4: "4",
    });
  });
});
