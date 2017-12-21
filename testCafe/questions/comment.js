import {
  frameworks,
  url,
  setOptions,
  initSurvey,
  getSurveyResult
} from "../settings";
import { Selector, ClientFunction } from "testcafe";
const assert = require("assert");
const title = `comment`;

var json = {
  questions: [
    {
      type: "comment",
      name: "suggestions",
      title: "What would make you more satisfied with the Product?"
    }
  ]
};

frameworks.forEach(framework => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async t => {
      await initSurvey(framework, json);
    }
  );

  test(`fill textarea`, async t => {
    let surveyResult;

    await t
      .typeText(`textarea`, `puppies`)
      .pressKey(`enter`)
      .typeText(`textarea`, `money`)
      .click(`input[value=Complete]`);

    surveyResult = await getSurveyResult();
    assert.deepEqual(surveyResult, {
      suggestions: "puppies\nmoney"
    });
  });

  if (framework.indexOf("bootstrap") === -1) {
    test(`change rows count`, async t => {
      const getComment = Selector(
        () => document.querySelector(`textarea[rows="2"]`),
        { visibilityCheck: true }
      );

      await setOptions("suggestions", { rows: 2 });
      await t.hover(getComment);
    });

    test.skip(`change cols count`, async t => {
      const getWidth = ClientFunction(
        () => document.querySelector("textarea").clientWidth
      );
      let oldWidth;
      let newWidth;

      oldWidth = await getWidth();

      await setOptions("suggestions", { cols: 25 });

      newWidth = await getWidth();

      assert(oldWidth > newWidth);
    });
  }
});
