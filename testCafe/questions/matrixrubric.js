import { frameworks, url, setOptions, initSurvey, getSurveyResult, getQuestionValue, getQuestionJson } from "../helper";
import { ClientFunction, Selector, fixture, test } from "testcafe";
// eslint-disable-next-line no-undef
const assert = require("assert");
const title = "matrixrubric";

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
      cells: {
        affordable: {
          1: "1x1",
          2: "1x2",
          3: "1x3",
          4: "1x4",
          5: "1x3",
        },
        "does what it claims": {
          1: "2x1",
          2: "2x2",
          3: "2x3",
          4: "2x4",
          5: "2x3",
        },
        "better than others": {
          1: "3x1",
          2: "3x2",
          3: "3x3",
          4: "3x4",
          5: "3x3",
        },
        "easy to use": {
          1: "4x1",
          2: "4x2",
          3: "4x3",
          4: "4x4",
          5: "4x3",
        }
      }
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
      .click("tbody tr:nth-child(4) td:nth-child(6)")
      .click("input[value=Complete]");

    surveyResult = await getSurveyResult();
    assert.equal(surveyResult.Quality["easy to use"], "5");
  });

  test("choose several values", async (t) => {
    let surveyResult;
    const firstCellSelector = Selector("tbody tr:nth-child(2) td:nth-child(5)");
    const secondCellSelector = Selector("tbody tr:nth-child(4) td:nth-child(6)");
    await t
      .click(firstCellSelector)
      .expect(firstCellSelector.hasClass("sv_q_m_cell_selected")).ok()
      .click(secondCellSelector)
      .expect(secondCellSelector.hasClass("sv_q_m_cell_selected")).ok()
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
      .click("tbody tr:nth-child(1) td:nth-child(4)")
      .click("tbody tr:nth-child(2) td:nth-child(5)")
      .click("tbody tr:nth-child(3) td:nth-child(3)")
      .click("tbody tr:nth-child(4) td:nth-child(6)")
      .click("input[value=Complete]");

    surveyResult = await getSurveyResult();
    await t.expect(surveyResult.Quality).eql({
      affordable: 3,
      "does what it claims": 4,
      "better than others": 2,
      "easy to use": 5,
    });
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
    json =JSON.parse(await getQuestionJson());
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
    json =JSON.parse(await getQuestionJson());
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
    json =JSON.parse(await getQuestionJson());
    assert.equal(json.rows[0].text, newTitle);
  });

  test("click on cell title state editable", async (t) => {
    var newTitle = "MyText";
    var json = JSON.parse(await getQuestionJson());
    var questionValue = await getQuestionValue();
    assert.equal(questionValue, undefined);

    var selector = ".sv_q_matrix tbody tr:nth-child(4) td:nth-child(6) .sv-string-editor";
    await t
      .click(selector)
      .typeText(selector, newTitle, { replace: true })
      .click("body", { offsetX: 0, offsetY: 0 });

    questionValue = await getQuestionValue();
    assert.equal(questionValue, undefined);
    json =JSON.parse(await getQuestionJson());
    assert.equal(json.cells["easy to use"][5], newTitle);
  });
});