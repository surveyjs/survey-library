import { frameworks, url, initSurvey } from "../settings";
import { ClientFunction } from "testcafe";
const assert = require("assert");
const title = `boolean`;

var json = {
  questions: [
    {
      type: "boolean",
      name: "bool",
      title: "Please answer the question",
      label: "Are you 21 or older?",
      isRequired: true,
    },
  ],
};

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async (t) => {
      await initSurvey(framework, json);
    }
  );

  test(`checked class`, async (t) => {
    const isCheckedClassExists = ClientFunction(() =>
      document.querySelector(`div label`).classList.contains("checked")
    );

    await t.expect(isCheckedClassExists()).eql(false);

    await t.click(`div label`, { offsetX: 1 });

    await t.expect(isCheckedClassExists()).eql(false);

    await t.click(`div label`);

    await t.expect(isCheckedClassExists()).eql(true);
  });

  const getQuestionValue = ClientFunction(() => {
    return survey.getAllQuestions()[0].value;
  });

  test(`click on true label in intermediate state`, async (t) => {
    assert.equal(await getQuestionValue(), null);

    await t.click(`.sv-boolean__label:nth-of-type(2)`);

    assert.equal(await getQuestionValue(), true);
  });

  test(`click on false label in intermediate state`, async (t) => {
    assert.equal(await getQuestionValue(), null);

    await t.click(`.sv-boolean__label:first-of-type`);

    assert.equal(await getQuestionValue(), false);
  });

  test(`click on right side of switch in intermediate state`, async (t) => {
    assert.equal(await getQuestionValue(), null);

    await t.click(`.sv-boolean__switch`, { offsetX: -1 });

    assert.equal(await getQuestionValue(), true);
  });

  test(`click on left side of switch in intermediate state`, async (t) => {
    assert.equal(await getQuestionValue(), null);

    await t.click(`.sv-boolean__switch`, { offsetX: 1 });

    assert.equal(await getQuestionValue(), false);
  });
});
