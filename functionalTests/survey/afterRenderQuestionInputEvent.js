/*
import {
  frameworks,
  url,
  setOptions,
  initSurvey,
  getSurveyResult
} from "../helper";
import { Selector, ClientFunction, fixture, test } from "testcafe";
const assert = require("assert");
const title = `afterRenderQuestionEvent`;

const json = {
  elements: [
    {
      type: "text",
      name: "q1"
    },
    {
      type: "multipletext",
      name: "q2",
      items: [{ name: "item1" }, { name: "item2" }]
    },
    {
      type: "matrixdynamic",
      name: "q3",
      rowCount: 1,
      columns: [
        {
          name: "col1",
          cellType: "text"
        }
      ]
    }
  ]
};

frameworks.forEach(framework => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async t => {
      var f = function(sender, options) {
        if (options.question.getType() === "text") {
          options.htmlElement.addEventListener("keypress", function(evt) {
            if (
              (evt.which != 8 &&
                evt.which != 0 &&
                evt.which != 46 &&
                evt.which < 48) ||
              evt.which > 57
            ) {
              evt.preventDefault();
            }
          });
        }
      };
      var events = { onAfterRenderQuestionInput: f };
      await initSurvey(framework, json, events);
    }
  );

  test(`afterRenderQuestionInput do not allow to enter 'e' into number input in text question, multiple text and matrix`, async t => {
    const inputs = Selector(`input.sv_q_text_root`);
    await t.typeText(inputs.nth(0), "123e");
    await t.typeText(inputs.nth(1), "234e");
    await t.typeText(inputs.nth(2), "e345e");
    await t.typeText(inputs.nth(3), "e456e");

    await t.click(`input[value="Complete"]`);
    const surveyResult = await getSurveyResult();
    await t.expect(surveyResult).eql({
      q1: "123",
      q2: { item1: "234", item2: "345" },
      q3: [{ col1: "456" }]
    });
    await t.wait(1000);
  });
});
*/
