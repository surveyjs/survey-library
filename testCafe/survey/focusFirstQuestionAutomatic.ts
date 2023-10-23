import { url, initSurvey, frameworks, getSurveyResult, filterIsInViewport } from "../helper";
import { Selector, ClientFunction } from "testcafe";

const title = "focusFirstQuestionAutomatic";

const json = {
  focusFirstQuestionAutomatic: true,
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
  test("Focus and scroll into view question", async t => {
    const focusQuestion = ClientFunction((name, doScroll) => {
      const q = window["survey"].getQuestionByName(name);
      q.focus(false, doScroll);
    });
    const q1Sel = Selector("input[type=text]").nth(0);
    const panel1_q1Sel = Selector("input[type=text]").nth(1);

    await initSurvey(framework, {
      elements: [
        { type: "text", name: "q1" },
        { type: "radiogroup", name: "q2", choices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
        { type: "radiogroup", name: "q3", choices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
        { type: "panel", name: "panel1",
          elements: [
            { type: "text", name: "panel1_q1" },
            { type: "radiogroup", name: "panel1_q2", choices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
            { type: "radiogroup", name: "panel1_q3", choices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }
          ]
        }
      ]
    });
    await focusQuestion("panel1_q1", false);
    await t.expect(panel1_q1Sel.filter(filterIsInViewport).exists).ok()
      .pressKey("a");
    await focusQuestion("q1", false);
    await t.expect(q1Sel.filter(filterIsInViewport).exists).ok()
      .pressKey("b");
    await focusQuestion("panel1_q1", true);
    await t.expect(panel1_q1Sel.filter(filterIsInViewport).exists).ok()
      .expect(q1Sel.filter(filterIsInViewport).exists).notOk();

    await t.click("input[value=Complete]");
    let surveyResult = await getSurveyResult();
    await t.expect(surveyResult).eql({ q1: "b", panel1_q1: "a" });
  });
});