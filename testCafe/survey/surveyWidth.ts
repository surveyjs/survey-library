import { frameworks, url, initSurvey, getListItemByText } from "../helper";
import { Selector } from "testcafe";
const title = "Test survey width";

const json = {
  width: "255px",
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
      .expect(Selector(".sv_main.sv_default_css").clientWidth).eql(255);
  });
});