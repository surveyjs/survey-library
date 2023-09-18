import { frameworks, url, url_test, initSurvey, getQuestionValue, getQuestionJson, applyTheme } from "../helper";
import { ClientFunction, Selector, fixture, test } from "testcafe";
// eslint-disable-next-line no-undef
const assert = require("assert");
const title = "boolean";

var json = {
  questions: [
    {
      type: "boolean",
      name: "bool",
      title: "Are you 21 or older?",
      isRequired: true,
    },
  ],
};

var jsonCheckbox = {
  questions: [
    {
      type: "boolean",
      name: "bool",
      title: "Are you 21 or older?",
      renderAs: "checkbox",
      isRequired: true,
    },
  ],
};
var jsonCheckbox2 = {
  elements: [
    {
      type: "boolean",
      name: "bool",
      title: "Are you 21 or older?",
      titleLocation: "hidden",
      renderAs: "checkbox",
    },
  ],
};

var jsonRadio = {
  questions: [
    {
      type: "boolean",
      name: "bool",
      title: "Are you 21 or older?",
      isRequired: true,
      renderAs: "radio"
    },
  ],
};

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
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

    await t.click(Selector(".sv-boolean__thumb-ghost").nth(1));

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

  test("check arrow keydowns", async (t) => {
    await ClientFunction(() => { document.querySelector(".sv-boolean input").focus(); })();
    await t.expect(getQuestionValue()).eql(undefined)
      .pressKey("right")
      .expect(getQuestionValue()).ok()
      .pressKey("left")
      .expect(getQuestionValue()).eql(false);
  });
});

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
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
      .selectEditableContent(outerSelector + " " + innerSelector, outerSelector + " " + innerSelector)
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

    var outerSelector = Selector(".sv-boolean__label").nth(1);
    await t
      .click(outerSelector)
      .typeText(outerSelector.find(".sv-string-editor"), newLabelTrue, { replace: true })
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
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async (t) => {
      await initSurvey(framework, jsonCheckbox);
    }
  );
  test("check first clink on boolean-checkbox input", async (t) => {
    const selector = Selector(".sv_qbln input");
    await ClientFunction(() => { document.querySelector(".sv_qbln input").click(); })();
    await t.expect(selector.checked).ok();
  });
});
frameworks.forEach((framework) => {
  const theme = "defaultV2";
  fixture`${framework} ${title} ${theme}`
    .page`${url_test}${theme}/${framework}`
    .beforeEach(async t => {
      await applyTheme(theme);
      await initSurvey(framework, jsonCheckbox2, { onGetQuestionTitleActions: (_, options) => {
        options.titleActions = [
          {
            title: "Click me",
            action: () => {
              const q = options.question;
              if(!q.description) {
                q.description = "Description!";
              } else {
                q.descriptionLocation = q.descriptionLocation === "hidden" ? "default" : "hidden";
              }
            },
          }];
      } });
    });
  test("Check actions", async (t) => {
    await t
      .expect(Selector(".sv-string-viewer").withText("21").exists).ok()
      .expect(Selector(".sv-string-viewer").withText("Description!").exists).notOk()
      .click(Selector(".sd-action__title").withText("Click me"))
      .expect(Selector(".sv-string-viewer").withText("Description!").exists).ok()
      .click(Selector(".sd-action__title").withText("Click me"))
      .expect(Selector("div").withText("Description!").exists).notOk()
      .click(Selector(".sd-action__title").withText("Click me"))
      .expect(Selector(".sv-string-viewer").withText("Description!").exists).ok();
  });
});

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
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
frameworks.forEach((framework) => {
  const theme = "defaultV2";
  fixture`${framework} ${title} ${theme}`
    .page`${url_test}${theme}/${framework}`
    .beforeEach(async t => {
      await applyTheme(theme);
      await initSurvey(framework, {
        "elements": [{
          "type": "boolean",
          "name": "q",
          "title": "Are you 21 or older?",
          "valueTrue": "Yes",
          "valueFalse": "No",
          "renderAs": "radio"
        }],
        "showQuestionNumbers": false
      });
    }
    );

  test("test radio boolean with values", async (t) => {
    const checkQuestionValue = ClientFunction(
      (val) => {
        return window["survey"].getQuestionByName("q").value == val;
      }
    );
    await t
      .expect(Selector("input[type=radio]").nth(0).checked).notOk()
      .expect(Selector(".sd-item").nth(0).hasClass("sd-radio--checked")).notOk()
      .expect(Selector("input[type=radio]").nth(1).checked).notOk()
      .expect(Selector(".sd-item").nth(1).hasClass("sd-radio--checked")).notOk()
      .expect(checkQuestionValue(null)).ok()

      .click(Selector(".sv-string-viewer").withText("No"))
      .expect(Selector("input[type=radio]").nth(0).checked).ok()
      .expect(Selector(".sd-item").nth(0).hasClass("sd-radio--checked")).ok()
      .expect(Selector("input[type=radio]").nth(1).checked).notOk()
      .expect(Selector(".sd-item").nth(1).hasClass("sd-radio--checked")).notOk()
      .expect(checkQuestionValue("No")).ok()

      .click(Selector(".sv-string-viewer").withText("Yes"))
      .expect(Selector("input[type=radio]").nth(0).checked).notOk()
      .expect(Selector("input[type=radio]").nth(1).checked).ok()
      .expect(checkQuestionValue("Yes")).ok()

      .click(Selector(".sv-string-viewer").withText("No"))
      .expect(Selector("input[type=radio]").nth(0).checked).ok()
      .expect(Selector("input[type=radio]").nth(1).checked).notOk()
      .expect(checkQuestionValue("No")).ok();
  });

});