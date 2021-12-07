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
        }
      ]
    },
    {
      elements: [
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
      await ClientFunction(() => {
        const el = document.createElement("input");
        el.type = "text";
        document.body.appendChild(el);
        el.focus();
      })();
    }
  );
  test("Check first focused question, focus question", async t => {
    await initSurvey(framework, json);
    await t.pressKey("v a l 1")
      .click("input[value=Next]")
      .pressKey("v a l 2")
      .click("input[value=Complete]");

    let surveyResult = await getSurveyResult();
    await t.expect(surveyResult).eql({
      q1: "val1", q2: "val2" });
  });
  test("Check first focused question, avoid focusing question in code", async t => {
    await initSurvey(framework, json, null, false, { focusFirstQuestionAutomatic: false });
    await t.pressKey("v a l 1")
      .click("input[value=Next]")
      .pressKey("v a l 2")
      .click("input[value=Complete]");

    let surveyResult = await getSurveyResult();
    await t.expect(surveyResult).eql({ });
  });
  test("Check first focused question, avoid focusing question in json", async t => {
    json["focusFirstQuestionAutomatic"] = false;
    await initSurvey(framework, json);
    json["focusFirstQuestionAutomatic"] = true;
    await t.pressKey("v a l 1")
      .click("input[value=Next]")
      .pressKey("v a l 2")
      .click("input[value=Complete]");

    let surveyResult = await getSurveyResult();
    await t.expect(surveyResult).eql({ });
  });
});