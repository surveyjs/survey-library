import { frameworks, url, initSurvey, getSurveyResult } from "../helper";
import { Selector, ClientFunction } from "testcafe";
const assert = require("assert");
const title = `Elements Visibility`;

const json = {
  pages: [
    {
      elements: [
        { type: "radiogroup", name: "q1", choices: ["Yes", "No"] },
        {
          type: "text",
          name: "q2",
          defaultValue: "q2Value",
          visibleIf: "{q1} = 'Yes'",
        },
      ],
    },
    {
      elements: [{ type: "text", name: "q3", visibleIf: "{q1} = 'Yes'" }],
    },
  ],
};

frameworks.forEach(framework => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async t => {
      await initSurvey(framework, json, undefined, undefined, {
        showInvisibleElements: true,
      });
    }
  );

  test(`showInvisibleElements = true`, async t => {
    await t.expect(Selector(`input[value=Complete]`).visible).notOk();
    await t.expect(Selector(`input[value=Next]`).visible).ok();
    await t.expect(Selector(`input[value=Next]`).visible).ok();
    await t.expect(Selector("span").withText("2.").visible).ok();
  });
});
frameworks.forEach(framework => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async t => {
      await initSurvey(framework, json);
    }
  );
  test(`make element on another page visible`, async t => {
    await t.expect(Selector(`input[value=Complete]`).visible).ok();
    const yesChoice = Selector(`input[value="Yes"]`);
    const noChoice = Selector(`input[value="No"]`);
    await t
      .click(yesChoice)
      .expect(yesChoice.checked)
      .ok();
    await t.expect(Selector(`input[value=Complete]`).visible).notOk();
    await t.expect(Selector(`input[value=Next]`).visible).ok();
    await t
      .click(noChoice)
      .expect(noChoice.checked)
      .ok();
    await t.expect(Selector(`input[value=Complete]`).visible).ok();
  });
});
