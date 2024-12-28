import { frameworks, initSurvey, url } from "../helper";
import { ClientFunction, Selector } from "testcafe";
const title = "file";

frameworks.forEach(framework => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async t => {
      await initSurvey(framework, {
        elements: [
          {
            type: "file",
            name: "q1"
          }
        ]
      });
    }
  );

  test("choose file actions readOnly are reactive", async t => {
    await t.setFilesToUpload("input[type=file]", "../resources/stub.txt")
      .expect(Selector("button[title='Clear']").hasAttribute("disabled")).notOk();
    await ClientFunction(() => {
      (window as any).survey.getAllQuestions()[0].readOnly = true;
    })();
    await t.expect(Selector("button[title='Clear']").hasAttribute("disabled")).ok();
  });
});