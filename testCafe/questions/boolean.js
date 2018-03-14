import {
  frameworks,
  url,
  setOptions,
  initSurvey,
  getSurveyResult
} from "../settings";
import { Selector, ClientFunction } from "testcafe";
const assert = require("assert");
const title = `boolean`;

var json = {
  questions: [
    {
      type: "boolean",
      name: "bool",
      title: "Please answer the question",
      label: "Are you 21 or older?",
      isRequired: true
    }
  ]
};

frameworks.forEach(framework => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async t => {
      await initSurvey(framework, json);
    }
  );

  test(`checked class`, async t => {
    const isCheckedClassExists = ClientFunction(() =>
      document.querySelector(`div label`).classList.contains("checked")
    );

    assert.equal(await isCheckedClassExists(), false);

    await t.click(`div input`);

    assert.equal(await isCheckedClassExists(), true);

    await t.click(`div input`);

    assert.equal(await isCheckedClassExists(), false);
  });
});
