import { frameworks, url, initSurvey, getQuestionValue, getQuestionJson } from "../helper";
import { ClientFunction, Selector, fixture, test } from "testcafe";
// eslint-disable-next-line no-undef
const assert = require("assert");
const title = "boolean";

var json = {
  questions: [
    {
      type: "boolean",
      name: "bool",
      title: "Response required.",
      label: "Are you 21 or older?",
      isRequired: true,
    },
  ],
};

var jsonRadio = {
  questions: [
    {
      type: "boolean",
      name: "bool",
      title: "Response required.",
      label: "Are you 21 or older?",
      isRequired: true,
      renderAs: "radio"
    },
  ],
};

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}.html`.beforeEach(
    async (t) => {
      await initSurvey(framework, json);
    }
  );

  test("checked class", async (t) => {
    const isCheckedClassExists = ClientFunction(() =>
      document.querySelector("div label").classList.contains("checked")
    );

    await t.expect(isCheckedClassExists()).eql(false);

    await t.click("div label", { offsetX: 1 });

    await t.expect(isCheckedClassExists()).eql(false);

    await t.click("div label");

    await t.expect(isCheckedClassExists()).eql(true);
  });

  test("click on true label in intermediate state", async (t) => {
    assert.equal(await getQuestionValue(), null);

    await t.click(".sv-boolean__label:nth-of-type(2)");

    assert.equal(await getQuestionValue(), true);
  });

  test("click on false label in intermediate state", async (t) => {
    assert.equal(await getQuestionValue(), null);

    await t.click(".sv-boolean__label:first-of-type");

    assert.equal(await getQuestionValue(), false);
  });

  test("click on right side of switch in intermediate state", async (t) => {
    assert.equal(await getQuestionValue(), null);

    await t.click(".sv-boolean__switch", { offsetX: -1 });

    assert.equal(await getQuestionValue(), true);
  });

  test("click on left side of switch in intermediate state", async (t) => {
    assert.equal(await getQuestionValue(), null);

    await t.click(".sv-boolean__switch", { offsetX: 1 });

    assert.equal(await getQuestionValue(), false);
  });
});

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}.html`.beforeEach(
    async (t) => {
      await initSurvey(framework, json, undefined, true);
    }
  );

  test("click on question title state editable", async (t) => {
    var newTitle = "MyText";
    var json = JSON.parse(await getQuestionJson());
    assert.equal(await getQuestionValue(), null);

    var outerSelector = ".sv_q_title";
    var innerSelector = ".sv-string-editor";
    await t
      .click(outerSelector)
      .selectEditableContent(outerSelector + " " + innerSelector)
      .typeText(outerSelector + " " + innerSelector, newTitle)
      .click("body");

    assert.equal(await getQuestionValue(), null);
    json = JSON.parse(await getQuestionJson());
    assert.equal(json.title, newTitle);
  });

  test("click on true label in intermediate state editable", async (t) => {
    var newLabelTrue = "MyText";
    var json = JSON.parse(await getQuestionJson());
    var labelFalse = json.labelFalse;
    assert.equal(await getQuestionValue(), null);

    var outerSelector = ".sv-boolean__label:nth-of-type(2)";
    var innerSelector = ".sv-string-editor";
    await t
      .click(outerSelector)
      .typeText(outerSelector + " " + innerSelector, newLabelTrue, { replace: true })
      .click("body", { offsetX: 0, offsetY: 0 });

    assert.equal(await getQuestionValue(), null);
    json = JSON.parse(await getQuestionJson());
    assert.equal(json.labelFalse, labelFalse);
    assert.equal(json.labelTrue, newLabelTrue);
  });

  test("click on false label in intermediate state editable", async (t) => {
    var newLabelFalse = "MyText";
    var json = JSON.parse(await getQuestionJson());
    var labelTrue = json.labelTrue;
    assert.equal(await getQuestionValue(), null);

    var outerSelector = ".sv-boolean__label:nth-of-type(1)";
    var innerSelector = ".sv-string-editor";
    await t
      .click(outerSelector)
      .typeText(outerSelector + " " + innerSelector, newLabelFalse, { replace: true })
      .click("body", { offsetX: 0, offsetY: 0 });

    assert.equal(await getQuestionValue(), null);
    json = JSON.parse(await getQuestionJson());
    assert.equal(json.labelFalse, newLabelFalse);
    assert.equal(json.labelTrue, labelTrue);
  });

});

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}.html`.beforeEach(
    async (t) => {
      await initSurvey(framework, jsonRadio);
    }
  );

  test("test radio boolean", async (t) => {
    await t
      .expect(Selector("input[type=radio]").nth(0).checked).notOk()
      .expect(Selector("input[type=radio]").nth(1).checked).notOk()
      .click(Selector(".sv-string-viewer").withText("No"))
      .expect(Selector("input[type=radio]").nth(0).checked).ok()
      .expect(Selector("input[type=radio]").nth(1).checked).notOk()
      .click(Selector(".sv-string-viewer").withText("Yes"))
      .expect(Selector("input[type=radio]").nth(0).checked).notOk()
      .expect(Selector("input[type=radio]").nth(1).checked).ok();
  });

});