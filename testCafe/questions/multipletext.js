import { ClientFunction, Selector, fixture, test } from "testcafe";
import { frameworks, url, initSurvey, getSurveyResult, getQuestionValue, getQuestionJson } from "../helper";
// eslint-disable-next-line no-undef
const assert = require("assert");
const title = "multipletext";

const json = {
  questions: [
    {
      type: "multipletext",
      name: "pricelimit",
      title: "What is the... ",
      colCount: 2,
      items: [
        {
          name: "mostamount",
          title: "Most amount you would every pay for a product like ours"
        },
        {
          name: "leastamount",
          title: "The least amount you would feel comfortable paying"
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

  test("fill text fields", async t => {
    let surveyResult;

    await t
      .typeText("tr > td:nth-child(1) input", "All my money")
      .typeText("tr > td:nth-child(2) input", "Zero")
      .click("input[value=Complete]");

    surveyResult = await getSurveyResult();

    await t.expect(surveyResult).eql({
      pricelimit: {
        mostamount: "All my money",
        leastamount: "Zero"
      }
    });
  });
});

frameworks.forEach((framework) => {

  const localJson = {
    questions: [
      {
        type: "multipletext",
        name: "pricelimit",
        title: "What is the... ",
        items: [
          {
            name: "mostamount",
            title: "Most amount you would every pay for a product like ours"
          }
        ]
      }
    ]
  };

  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async (t) => {
      await initSurvey(framework, localJson, undefined, true);
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

  test("click on row title state editable", async (t) => {
    var newTitle = "MyText";
    var json = JSON.parse(await getQuestionJson());
    var questionValue = await getQuestionValue();
    assert.equal(questionValue, undefined);

    var selector = ".sv_q_mt_title .sv-string-editor";
    await t
      .click(selector, { offsetX: 10, offsetY: 10 })
      .typeText(selector, newTitle, { replace: true })
      .click("body", { offsetX: 0, offsetY: 0 });

    questionValue = await getQuestionValue();
    assert.equal(questionValue, undefined);
    json =JSON.parse(await getQuestionJson());
    assert.equal(json.items[0].title, newTitle);
  });
  test("Check item reactiveness, for example required title", async (t) => {
    const requiredTitleSelector = Selector(".sv_q_mt_title .sv_q_required_text");
    await t.expect(requiredTitleSelector.exists).notOk();
    await ClientFunction(() => {
      window.survey.getAllQuestions()[0].items[0].isRequired = true;
    })();
    await t.expect(requiredTitleSelector.exists).ok();
  });
});