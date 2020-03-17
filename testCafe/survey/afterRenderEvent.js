import {
  frameworks,
  url,
  setOptions,
  initSurvey,
  getSurveyResult
} from "../settings";
import { Selector, ClientFunction } from "testcafe";
const assert = require("assert");
const title = `afterRenderQuestionEvent`;

const json = {
  pages: [
    {
      elements: [
        {
          name: "question4a",
          type: "radiogroup",
          title: "4 (a) question 4a ",
          choices: [
            {
              text: "Yes",
              value: "valueYes"
            },
            {
              text: "No",
              value: "valueNo"
            }
          ]
        },
        {
          name: "question4b",
          visibleIf: "{question4a} = 'valueYes'",
          type: "radiogroup",
          title: "4 (b) Test question 4b",
          choices: [
            {
              text: "Yes",
              value: "BA17018_02_01"
            },
            {
              text: "No",
              value: "BA17018_02_02"
            }
          ]
        }
      ],
      name: "sectionTest"
    }
  ],
  title: "Test Sample"
};

frameworks.forEach(framework => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async t => {
      var f = function(survey, options) {
        if (options.question.name == "question4b") {
          options.htmlElement.style.border = "1px solid #CCC";
        }
      };
      var events = { onAfterRenderQuestion: f };
      await initSurvey(framework, json, events);
    }
  );

  test(`afterRenderQuestion fires for initially hidden questions`, async t => {
    const getQuestionCount = ClientFunction(
      () => document.querySelectorAll(".sv_q.sv_qstn").length
    );
    const isBorderOk = ClientFunction(
      () =>
        document.querySelectorAll(".sv_q.sv_qstn")[1].style.border ===
        "1px solid rgb(204, 204, 204)"
    );

    assert.equal(await getQuestionCount(), 1);
    await t.click(`input[value=valueYes]`);
    assert.equal(await getQuestionCount(), 2);
    assert.ok(await isBorderOk());
  });
});
