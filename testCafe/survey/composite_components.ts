import { url, initSurvey, getSurveyResult, frameworks } from "../helper";
import { Selector, ClientFunction } from "testcafe";
const title = "Components";

const json = {
  "elements": [
    {
      type: "comp1",
      name: "q1"
    }
  ]
};

const registerComponet_onValueChanging = ClientFunction(() => {
  window["Survey"].ComponentCollection.Instance.add({
    name: "comp1",
    elementsJSON: [
      {
        type: "text",
        name: "item1"
      },
      {
        type: "text",
        name: "item2",
        startWithNewLine: false
      }
    ],
    onValueChanging(question, name, value) {
      if (name === "item1" && value === "1") {
        return "100";
      }
      return value;
    }
  });
});

frameworks.forEach(framework => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async t => {
    }
  );
  test("check custom markup in list behavior", async t => {
    await registerComponet_onValueChanging();
    await initSurvey(framework, json);
    const item1Input = Selector("input[type='text']");
    await t
      .typeText(item1Input, "1")
      .pressKey("tab")
      .expect(item1Input.value).eql("100")
      .click("input[value=Complete]");

    const surveyResult = await getSurveyResult();
    await t.expect(surveyResult).eql({
      q1: { item1: "100" }
    });
  });
});