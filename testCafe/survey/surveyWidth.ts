import { frameworks, url, initSurvey, getListItemByText } from "../helper";
import { ClientFunction, Selector } from "testcafe";
const title = "Test survey width";

const json = {
  width: "455px",
  elements: [
    {
      type: "text",
      name: "question1"
    }
  ]
};

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async (t) => {
      await initSurvey(framework, json);
    }
  );

  test("Check survey width", async (t) => {
    await t
      .expect(Selector(".sv_body").getStyleProperty("max-width")).eql("455px");
  });

  test("Check question width", async (t) => {
    await t
      .expect(Selector(".sv_row > div").getStyleProperty("min-width")).eql("min(100%, 300px)");

    await ClientFunction(() => { window["survey"].getAllQuestions()[0].minWidth = "200px"; })();
    await t
      .expect(Selector(".sv_row > div").getStyleProperty("min-width")).eql("min(100%, 200px)");
  });
});