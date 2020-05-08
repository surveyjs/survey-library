import { frameworks, url, sumElementInnerText, initSurvey } from "../settings";
import { Selector, ClientFunction } from "testcafe";
const assert = require("assert");
const title = `questionTitlePattern`;

const json = {
  questionStartIndex: "# 1.",
  requiredText: "(*)",
  elements: [
    {
      type: "radiogroup",
      name: "r",
      choices: [1, 2]
    },
    {
      type: "text",
      name: "q1",
      requiredIf: "{r} = 1"
    },
    {
      type: "multipletext",
      name: "q2",
      items: [
        { name: "item1", inputType: "number", isRequired: true },
        { name: "item2", inputType: "number" }
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

  const changePattern = ClientFunction(value => {
    window.survey.questionTitlePattern = value;
  });
  const changeQuestionStartIndex = ClientFunction(value => {
    window.survey.questionStartIndex = value;
  });

  test(`check questionTitlePattern`, async t => {
    await t.expect(sumElementInnerText("h5", 1)).eql("# 2. q1");
    await t.expect(sumElementInnerText("td", 0)).eql("item1 (*)");
    await t.click(Selector("input[value = '1']"));
    await t.expect(sumElementInnerText("h5", 1)).eql("# 2. q1 (*)");
    await changePattern("numRequireTitle");
    await t.expect(sumElementInnerText("h5", 1)).eql("# 2. (*) q1");
    await t.expect(sumElementInnerText("td", 0)).eql("(*) item1");
    await changePattern("requireNumTitle");
    await t.expect(sumElementInnerText("h5", 1)).eql("(*) # 2. q1");
    await t.expect(sumElementInnerText("td", 0)).eql("(*) item1");
    await changePattern("numTitle");
    await t.expect(sumElementInnerText("h5", 1)).eql("# 2. q1");
    await t.expect(sumElementInnerText("td", 0)).eql("item1");
  });
  test(`check questionStartIndex`, async t => {
    await changeQuestionStartIndex("1.");
    await t.expect(sumElementInnerText("h5", 1)).eql("2. q1");
    await changeQuestionStartIndex("# (1)");
    await t.expect(sumElementInnerText("h5", 1)).eql("# (2) q1");
    await changeQuestionStartIndex("# (a)");
    await t.expect(sumElementInnerText("h5", 1)).eql("# (b) q1");
  });
});
