import { ClientFunction, fixture, Selector, test } from "testcafe";
import { frameworks, url, initSurvey, getSurveyResult, getQuestionValue, getQuestionJson, checkSurveyWithEmptyQuestion } from "../helper";
// eslint-disable-next-line no-undef
const assert = require("assert");
const title = "imagepicker";

const json = {
  questions: [
    {
      type: "imagepicker",
      name: "choosepicture",
      title: "What animal would you like to see first ?",
      isRequired: true,
      choices: [
        {
          value: "lion",
          imageLink:
            "https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg"
        },
        {
          value: "giraffe",
          imageLink:
            "https://surveyjs.io/Content/Images/examples/image-picker/giraffe.jpg"
        },
        {
          value: "panda",
          imageLink:
            "https://surveyjs.io/Content/Images/examples/image-picker/panda.jpg"
        },
        {
          value: "camel",
          imageLink:
            "https://surveyjs.io/Content/Images/examples/image-picker/camel.jpg"
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

  test("check integrity", async t => {
    await t
      .hover("fieldset.sv_imgsel .sv_q_imgsel:nth-of-type(1)")
      .hover("fieldset.sv_imgsel .sv_q_imgsel:nth-of-type(2)")
      .hover("fieldset.sv_imgsel .sv_q_imgsel:nth-of-type(3)")
      .hover("fieldset.sv_imgsel .sv_q_imgsel:nth-of-type(4)");
  });

  test("choose empty", async t => {
    await checkSurveyWithEmptyQuestion(t);
  });

  test("choose value", async t => {
    let surveyResult;

    await t
      .click("fieldset.sv_imgsel .sv_q_imgsel:nth-of-type(2)")
      .click("input[value=Complete]");

    surveyResult = await getSurveyResult();
    assert.equal(surveyResult.choosepicture, "giraffe");
  });
  test("imagelink reactiveness", async t => {
    await t.expect(Selector(".sv_q_imgsel").nth(0).find("img").exists).ok();
    await t.expect(Selector(".sv_q_imgsel__no-image").exists).notOk();

    await ClientFunction(()=>{
      window.survey.getAllQuestions()[0].choices[0].imageLink = "custom_link";
    })();
    await t.expect(Selector(".sv_q_imgsel").nth(0).find("img").exists).notOk();
    await t.expect(Selector(".sv_q_imgsel__no-image").exists).ok();
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
});