import { frameworks, url, setOptions, initSurvey, getSurveyResult, getQuestionValue, getQuestionJson } from "../helper";
import { ClientFunction, Selector } from "testcafe";
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

  test("Signature: show/hide elements server mode", async (t) => {
    await t.resizeWindow(1920, 1080);
    await initSurvey(framework, {
      "elements": [
        {
          "type": "signaturepad",
          "name": "signature",
          "title": "Please sign here",
          "storeDataAsText": false,
          "isRequired": true
        }
      ],
      "showQuestionNumbers": false
    });
    await ClientFunction(() => {
      window["uploadFilesCallCount"] = 0;
      window["survey"].onUploadFiles.add((_, options) => {
        setTimeout(
          (data) => {
            window["uploadFilesCallCount"]++;
            options.callback(
              "success",
              options.files.map((file) => {
                return {
                  file: file,
                  content: "https://example.com?name=qwertyuiop"
                };
              })
            );
          }, 1000);
      });
    })();
    const QuestionNode = Selector("span")
      .withText("Please sign here")
      .parent("[aria-labelledby]");

    const SignCanvas = QuestionNode.find("canvas");
    const ClearBtn = QuestionNode.find("button[title='Clear']");
    const Placeholder = QuestionNode.find(".sjs_sp_placeholder");
    const Controls = QuestionNode.find(".sjs_sp_controls");

    await t.expect(Controls.visible).notOk();
    await t.expect(Placeholder.visible).ok();

    await t.click(SignCanvas);
    await t.expect(Controls.visible).ok();
    await t.expect(Placeholder.visible).notOk();

    await t.click(ClearBtn);
    await t.expect(Controls.visible).notOk();
    await t.expect(Placeholder.visible).ok();

    await t.click(SignCanvas);
    await t.expect(Controls.visible).ok();
    await t.expect(Placeholder.visible).notOk();

    await t.click("body", { offsetX: 0, offsetY: 0 });
    await t.expect(ClientFunction(() => {
      return window["uploadFilesCallCount"];
    })()).eql(1);
  });
});