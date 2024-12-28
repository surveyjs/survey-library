import { frameworks, initSurvey, url } from "../helper";
import { Selector, fixture, test } from "testcafe";
const title = "progressButtons";

const json = {
  pages: [
    {
      name: "page1",
      elements: [
        {
          type: "text",
          name: "question1"
        }
      ]
    },
    {
      name: "page2",
      elements: [
        {
          type: "text",
          name: "question2"
        }
      ]
    },
    {
      name: "page3",
      elements: [
        {
          type: "text",
          name: "question3"
        }
      ]
    }
  ],
  showProgressBar: "top",
  progressBarType: "buttons"
};

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`
    .page`${url}${framework}`.beforeEach(async (t) => {
    await initSurvey(framework, json);
  });
  test("check progress buttons", async (t) => {
    await t.hover(Selector("[data-name='question1']"));
    await t.click(Selector("[title='page3']"));
    await t.hover(Selector("[data-name='question3']"));
    await t.click(Selector("[title='page2']"));
    await t.hover(Selector("[data-name='question2']"));
  });
});
