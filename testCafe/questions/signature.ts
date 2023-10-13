import { frameworks, url, setOptions, initSurvey, getSurveyResult, getQuestionValue, getQuestionJson } from "../helper";
import { Selector } from "testcafe";
const title = "Signature";

frameworks.forEach(framework => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(async t => {});

  test("Signature: show/hide elements", async (t) => {
    await t.resizeWindow(1920, 1080);
    await initSurvey(framework, {
      "elements": [
        {
          "type": "signaturepad",
          "name": "signature",
          "title": "Please sign here",
          "isRequired": true
        }
      ],
      "showQuestionNumbers": false
    });

    const QuestionNode = Selector("span")
      .withText("Please sign here")
      .parent("[aria-labelledby]");

    const SignCanvas = QuestionNode.find("canvas");
    const ClearBtn = QuestionNode.find("button[title='Clear']");
    const Placeholder = QuestionNode.find(".sjs_sp_placeholder");
    const Controls = QuestionNode.find(".sjs_sp_controls");

    await t.click(SignCanvas).click(ClearBtn).click(SignCanvas);

    await t.expect(Controls.visible).ok();
    await t.expect(Placeholder.visible).notOk();
  });
});