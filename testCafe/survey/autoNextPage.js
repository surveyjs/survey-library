import { frameworks, url, initSurvey, getSurveyResult } from "../helper";
import { ClientFunction, fixture, test, Selector } from "testcafe";
// eslint-disable-next-line no-undef
const assert = require("assert");
const title = "autoNextPage";

const json = {
  focusFirstQuestionAutomatic: true,
  title: "American History",
  showProgressBar: "bottom",
  goNextPageAutomatic: true,
  pages: [
    {
      elements: [
        {
          type: "radiogroup",
          name: "civilwar",
          title: "When was the Civil War?",
          choices: [
            "1750-1800",
            "1800-1850",
            "1850-1900",
            "1900-1950",
            "after 1950"
          ]
        }
      ]
    },
    {
      elements: [
        {
          type: "radiogroup",
          name: "libertyordeath",
          title: "Who said 'Give me liberty or give me death?'",
          choices: [
            "John Hancock",
            "James Madison",
            "Patrick Henry",
            "Samuel Adams"
          ]
        }
      ]
    },
    {
      elements: [
        {
          type: "radiogroup",
          name: "magnacarta",
          title: "What is the Magna Carta?",
          choices: [
            "The foundation of the British parliamentary system",
            "The Great Seal of the monarchs of England",
            "The French Declaration of the Rights of Man",
            "The charter signed by the Pilgrims on the Mayflower"
          ]
        }
      ]
    }
  ],
  completedHtml:
    "<p>Your anwers are:</p><p>When was the Civil War?: <b>{civilwar}</b>. The correct is: <b>1850-1900</b></p><p>Who said 'Give me liberty or give me death?': <b>{libertyordeath}</b>. The correct is: <b>Patrick Henry</b></p><p>What is the Magna Carta?: <b>{magnacarta}</b>. The correct is: <b>The foundation of the British parliamentary system</b></p>"
};
const json2 = {
  focusFirstQuestionAutomatic: true,
  goNextPageAutomatic: true,
  pages: [
    {
      elements: [
        {
          type: "matrix",
          name: "q1",
          columns: [1, 2, 3],
          rows: ["A", "B", "C"]
        }
      ]
    }
  ]
};
const json3 = {
  focusFirstQuestionAutomatic: true,
  goNextPageAutomatic: true,
  pages: [
    {
      elements: [
        {
          type: "rating",
          name: "q1"
        }
      ]
    }
  ]
};

frameworks.forEach(framework => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async t => {
      await initSurvey(framework, json);
    }
  );

  test("check auto next page", async t => {
    const getProgressTextPosition = ClientFunction(index =>
      document.documentElement.innerHTML.indexOf("Page " + index + " of 3")
    );
    let surveyResult;
    assert.notEqual(await getProgressTextPosition(1), -1);
    await t.click("input[type=radio]")
      .wait(500);
    assert.notEqual(await getProgressTextPosition(2), -1);
    await t.click("input[type=radio]")
      .wait(500);
    assert.notEqual(await getProgressTextPosition(3), -1);
    await t.click("input[type=radio]")
      .wait(500);
    surveyResult = await getSurveyResult();
    await t.expect(surveyResult).eql({
      civilwar: "1750-1800",
      libertyordeath: "John Hancock",
      magnacarta: "The foundation of the British parliamentary system"
    });
  });
  test("check auto next page with keyboard", async t => {
    const getProgressTextPosition = ClientFunction(index =>
      document.documentElement.innerHTML.indexOf("Page " + index + " of 3")
    );
    let surveyResult;
    assert.notEqual(await getProgressTextPosition(1), -1);
    await t
      .pressKey("down")
      .pressKey("tab")
      .pressKey("enter");
    assert.notEqual(await getProgressTextPosition(2), -1);
    await t
      .pressKey("down")
      .pressKey("tab")
      .pressKey("tab")
      .pressKey("enter");
    assert.notEqual(await getProgressTextPosition(3), -1);
    await t
      .pressKey("down")
      .pressKey("tab")
      .pressKey("tab")
      .pressKey("enter");
    surveyResult = await getSurveyResult();
    await t.expect(surveyResult).eql({
      civilwar: "1800-1850",
      libertyordeath: "James Madison",
      magnacarta: "The Great Seal of the monarchs of England"
    });
  });
});
frameworks.forEach(framework => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async t => {
      await initSurvey(framework, json2);
    }
  );
  test("check auto next page with matrix", async (t) => {
    let surveyResult;

    await t
      .click("input[name=\"sq_100_A\"][value=\"1\"]")
      .wait(500)
      .click("input[name=\"sq_100_B\"][value=\"2\"]")
      .wait(500)
      .click("input[name=\"sq_100_C\"][value=\"3\"]")
      .wait(500);

    surveyResult = await getSurveyResult();
    assert.deepEqual(surveyResult.q1, { A: 1, B: 2, C: 3 });
  });
  test("check auto next page with matrix + keyboard", async (t) => {
    let surveyResult;

    await t
      .pressKey("space")
      .pressKey("tab")
      .pressKey("right")
      .pressKey("tab")
      .pressKey("right")
      .pressKey("right")
      .pressKey("tab")
      .pressKey("enter");

    surveyResult = await getSurveyResult();
    assert.deepEqual(surveyResult.q1, { A: 1, B: 2, C: 3 });
  });
});
frameworks.forEach(framework => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async t => {
      await initSurvey(framework, json3);
    }
  );
  test("check auto next page with rating", async (t) => {
    let surveyResult;
    const label3 = Selector("label").withText("3");
    await t
      .click(label3)
      .wait(500);

    surveyResult = await getSurveyResult();
    assert.equal(surveyResult.q1, 3);
  });
  test("check auto next page with rating + keyboard", async (t) => {
    let surveyResult;

    await t
      .pressKey("right")
      .pressKey("right")
      .pressKey("tab")
      .pressKey("enter");

    surveyResult = await getSurveyResult();
    assert.equal(surveyResult.q1, 3);
  });
});