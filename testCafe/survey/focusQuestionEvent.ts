import { url, initSurvey, frameworks, getSurveyResult } from "../helper";
import { Selector, ClientFunction } from "testcafe";

const title = "focusFirstQuestionAutomatic";

const json = {
  pages: [
    {
      elements: [
        {
          type: "text",
          name: "q1"
        },
        {
          type: "text",
          name: "q2"
        }
      ]
    }
  ]
};

frameworks.forEach(async framework => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async t => {
    }
  );
  test("Check question focus event", async t => {
    await initSurvey(framework, json);
    await ClientFunction(() => {
      window["raisedFocusEvent"] = null;
      window["survey"].onFocusInQuestion.add(function (sender, options) {
        window["raisedFocusEvent"] = true;
      });
    })();
    await t.click(Selector(".sv_qstn input").nth(1));
    await t.expect(ClientFunction(() => window["raisedFocusEvent"])()).ok();
  });
});