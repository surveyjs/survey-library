import { frameworks, url, initSurvey, getListItemByText } from "../helper";
import { Selector } from "testcafe";
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
  fixture`${framework} ${title}`.page`${url}${framework}.html`.beforeEach(
    async (t) => {
      await initSurvey(framework, json);
    }
  );

  test("Check survey width", async (t) => {
    await t
      .expect(Selector(".sv_body").getStyleProperty("width")).eql("455px")
      .expect(Selector(".sv_body").getStyleProperty("maxWidth")).eql("455px");
  });
});