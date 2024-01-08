import { frameworks, url, setOptions, initSurvey, getSurveyResult, getQuestionValue, getQuestionJson } from "../helper";
import { ClientFunction, Selector, fixture, test } from "testcafe";
// eslint-disable-next-line no-undef
const assert = require("assert");
const title = "matrix";

const json = {
  questions: [
    {
      type: "matrix",
      name: "Quality",
      title:
        "Please indicate if you agree or disagree with the following statements",
      columns: [
        { value: 1, text: "Strongly Disagree" },
        { value: 2, text: "Disagree" },
        { value: 3, text: "Neutral" },
        { value: 4, text: "Agree" },
        { value: 5, text: "Strongly Agree" },
      ],
      rows: [
        { value: "affordable", text: "Product is affordable" },
        { value: "does what it claims", text: "Product does what it claims" },
        {
          value: "better than others",
          text: "Product is better than other products on the market",
        },
        { value: "easy to use", text: "Product is easy to use" },
      ],
    },
  ],
};

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async (t) => {
      await initSurvey(framework, json);
    }
  );

  test("choose value", async (t) => {
    let surveyResult;

    await t
      .click("input[name=\"sq_100_easy_to_use\"][value=\"5\"]")
      .click("input[value=Complete]");

    surveyResult = await getSurveyResult();
    assert.equal(surveyResult.Quality["easy to use"], "5");
  });

  test("choose several values", async (t) => {
    let surveyResult;

    await t
      .click("input[name=\"sq_100_does_what_it_claims\"][value=\"4\"]")
      .click("input[name=\"sq_100_easy_to_use\"][value=\"5\"]")
      .click("input[value=Complete]");

    surveyResult = await getSurveyResult();
    await t.expect(surveyResult.Quality).eql({
      "does what it claims": 4,
      "easy to use": 5,
    });
  });

  test("require answer for all rows", async (t) => {
    await setOptions("Quality", { isAllRowRequired: true });
    await t.click("input[value=Complete]");
    await t.expect(Selector(".sv-string-viewer").withText("Response required: answer questions in all rows.").visible).ok();

    let surveyResult = await getSurveyResult();
    await t.expect(typeof surveyResult).eql("undefined");

    await t
      .click("input[name=\"sq_100_affordable\"][value=\"3\"]")
      .click("input[name=\"sq_100_does_what_it_claims\"][value=\"4\"]")
      .click("input[name=\"sq_100_better_than_others\"][value=\"2\"]")
      .click("input[name=\"sq_100_easy_to_use\"][value=\"5\"]")
      .click("input[value=Complete]");

    surveyResult = await getSurveyResult();
    await t.expect(surveyResult.Quality).eql({
      affordable: 3,
      "does what it claims": 4,
      "better than others": 2,
      "easy to use": 5,
    });
  });

  test("checked class", async (t) => {
    const isCheckedClassExistsByIndex = ClientFunction((index) =>
      document
        .querySelector(`fieldset tbody tr td:nth-child(${index + 1}) label`)
        .classList.contains("checked")
    );

    assert.equal(await isCheckedClassExistsByIndex(2), false);
    assert.equal(await isCheckedClassExistsByIndex(3), false);

    await t.click("input[name=\"sq_100_affordable\"][value=\"2\"]");

    assert.equal(await isCheckedClassExistsByIndex(2), true);
    assert.equal(await isCheckedClassExistsByIndex(3), false);

    await t.click("input[name=\"sq_100_affordable\"][value=\"3\"]");

    assert.equal(await isCheckedClassExistsByIndex(2), false);
    assert.equal(await isCheckedClassExistsByIndex(3), true);
  });

  test("isAnswered for matrix with loading answers from data - #2239", async (t) => {
    const setData = ClientFunction(
      () =>
        (window["survey"].data = {
          Quality: {
            affordable: "1",
            "does what it claims": "1",
            "better than others": "1",
            "easy to use": "1",
          },
        })
    );
    await setData();
    const getIsAnswered = ClientFunction(
      () => window["survey"].getAllQuestions()[0].isAnswered
    );
    assert.equal(await getIsAnswered(), true);
  });
});

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async (t) => {
      await initSurvey(framework, json, undefined, true);
    }
  );

  test("click on question title state editable", async (t) => {
    var newTitle = "MyText";
    var json = JSON.parse(await getQuestionJson());
    var questionValue = await getQuestionValue();
    assert.equal(questionValue, undefined);

    var outerSelector = ".sv_q_title";
    var innerSelector = ".sv-string-editor";
    await t
      .click(outerSelector)
      .typeText(outerSelector + " " + innerSelector, newTitle, { replace: true })
      .click("body", { offsetX: 0, offsetY: 0 });

    questionValue = await getQuestionValue();
    assert.equal(questionValue, undefined);
    json = JSON.parse(await getQuestionJson());
    assert.equal(json.title, newTitle);
  });

  test("click on column title state editable", async (t) => {
    var newTitle = "MyText";
    var json = JSON.parse(await getQuestionJson());
    var questionValue = await getQuestionValue();
    assert.equal(questionValue, undefined);

    var outerSelector = ".sv_q_matrix th";
    var innerSelector = ".sv-string-editor";
    await t
      .click(outerSelector)
      .typeText(outerSelector + " " + innerSelector, newTitle, { replace: true })
      .click("body", { offsetX: 0, offsetY: 0 });

    questionValue = await getQuestionValue();
    assert.equal(questionValue, undefined);
    json = JSON.parse(await getQuestionJson());
    assert.equal(json.columns[0].text, newTitle);
  });

  test("click on row title state editable", async (t) => {
    var newTitle = "MyText";
    var json = JSON.parse(await getQuestionJson());
    var questionValue = await getQuestionValue();
    assert.equal(questionValue, undefined);

    var selector = ".sv_q_matrix tbody tr td .sv-string-editor";
    await t
      .click(selector)
      .typeText(selector, newTitle, { replace: true })
      .click("body", { offsetX: 0, offsetY: 0 });

    questionValue = await getQuestionValue();
    assert.equal(questionValue, undefined);
    json = JSON.parse(await getQuestionJson());
    assert.equal(json.rows[0].text, newTitle);
  });
});
const json2 = {
  "focusFirstQuestionAutomatic": true,
  "elements": [{
    "type": "radiogroup",
    "name": "question2",
    "defaultValue": "Item1",
    "choices": [
      "Item1",
      "Item2",
      "Item3"
    ]
  },
  {
    "type": "matrix",
    "name": "question1",
    "columns": ["Col1"],
    "rows": [
      { value: "Row1", enableIf: "{question2} = 'Item2'" }
    ]
  }]
};
frameworks.forEach(framework => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async t => {
      await initSurvey(framework, json2);
    }
  );

  test("Matrix row enableIf", async t => {
    const inputButton = Selector("input[value=\"Col1\"]");
    await t.expect(inputButton.exists).ok();
    await t.expect(inputButton.hasAttribute("disabled")).ok();
    await t.pressKey("down");
    await t.expect(inputButton.hasAttribute("disabled")).notOk();
    await t.pressKey("up");
    await t.expect(inputButton.hasAttribute("disabled")).ok();
  });
});
