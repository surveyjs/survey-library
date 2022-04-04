import { frameworks, url, joinElementInnerText, initSurvey } from "../helper";
import { Selector, ClientFunction, fixture, test } from "testcafe";
const title = "questionTitlePattern";

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
    window["survey"].questionTitlePattern = value;
  });
  const changeQuestionStartIndex = ClientFunction(value => {
    window["survey"].questionStartIndex = value;
  });

  test("check questionTitlePattern", async t => {
    await t.expect(joinElementInnerText("h5", 1)).eql("# 2. q1");
    await t.expect(joinElementInnerText("td", 0)).eql("item1 (*)");
    await t.click(Selector("input[value = '1']"));
    await t.expect(joinElementInnerText("h5", 1)).eql("# 2. q1 (*)");
    await changePattern("numRequireTitle");
    await t.expect(joinElementInnerText("h5", 1)).eql("# 2. (*) q1");
    await t.expect(joinElementInnerText("td", 0)).eql("(*) item1");
    await changePattern("requireNumTitle");
    await t.expect(joinElementInnerText("h5", 1)).eql("(*) # 2. q1");
    await t.expect(joinElementInnerText("td", 0)).eql("(*) item1");
    await changePattern("numTitle");
    await t.expect(joinElementInnerText("h5", 1)).eql("# 2. q1");
    await t.expect(joinElementInnerText("td", 0)).eql("item1");
  });
  test("check questionStartIndex", async t => {
    await changeQuestionStartIndex("1.");
    await t.expect(joinElementInnerText("h5", 1)).eql("2. q1");
    await changeQuestionStartIndex("# (1)");
    await t.expect(joinElementInnerText("h5", 1)).eql("# (2) q1");
    await changeQuestionStartIndex("# (a)");
    await t.expect(joinElementInnerText("h5", 1)).eql("# (b) q1");
  });
});
