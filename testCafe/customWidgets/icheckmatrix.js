import { frameworks, url_test, initSurvey, getSurveyResult, checkSurveyWithEmptyQuestion } from "../helper";
import { fixture, Selector, test } from "testcafe";
const title = "icheckmatrix";

const json = {
  questions: [
    {
      type: "matrix",
      isRequired: true,
      name: "Quality",
      title:
        "Please indicate if you agree or disagree with the following statements",
      columns: [
        { value: 1, text: "Strongly Disagree" },
        { value: 2, text: "Disagree" },
        { value: 3, text: "Neutral" },
        { value: 4, text: "Agree" },
        { value: 5, text: "Strongly Agree" }
      ],
      rows: [
        { value: "affordable", text: "Product is affordable" },
        { value: "does what it claims", text: "Product does what it claims" },
        {
          value: "better than others",
          text: "Product is better than other products on the market"
        },
        { value: "easy to use", text: "Product is easy to use" }
      ]
    }
  ]
};

frameworks.forEach(framework => {
  fixture`${framework} ${title}`
    .page`${url_test}customWidget/${framework}`.beforeEach(async ctx => {
    await initSurvey(framework, json);
  });

  test("check integrity", async t => {
    // const getCount = ClientFunction(
    //   () => document.querySelectorAll("ins.iCheck-helper").length
    // );

    await t.expect(Selector("ins.iCheck-helper").count).eql(20);
  });

  test("choose empty", async t => {
    await checkSurveyWithEmptyQuestion(t);
  });

  test("choose value", async t => {
    let surveyResult;

    await t
      .click("table tr:nth-child(1) td:nth-child(3) ins")
      .click("table tr:nth-child(2) td:nth-child(4) ins")
      .click("input[value=Complete]");

    surveyResult = await getSurveyResult();
    await t.expect(surveyResult.Quality).eql({
      affordable: 2,
      "does what it claims": 3
    });
  });
});
