import { frameworks, url, initSurvey, getQuestionValue, getQuestionJson } from "../helper";
import { ClientFunction, Selector, fixture, test } from "testcafe";
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
    const label = Selector("div label");
    await t
      .expect(label.classNames).notContains("sd-boolean--checked")

      .click("div label", { offsetX: 4 })
      .expect(label.classNames).notContains("sd-boolean--checked")

      .click("div label")
      .expect(label.classNames).contains("sd-boolean--checked");
  });

  test("click on true label in intermediate state", async (t) => {
    let questionValue = await getQuestionValue();
    await t.expect(questionValue).eql(undefined);

    await t.click(Selector(".sd-boolean__thumb-ghost").nth(1));

    questionValue = await getQuestionValue();
    await t.expect(questionValue).eql(true);
  });

  test("click on false label in intermediate state", async (t) => {
    let questionValue = await getQuestionValue();
    await t.expect(questionValue).eql(undefined);

    await t.click(".sd-boolean__label:first-of-type");

    questionValue = await getQuestionValue();
    await t.expect(questionValue).eql(false);
  });

  test("click on right side of switch in intermediate state", async (t) => {
    let questionValue = await getQuestionValue();
    await t.expect(questionValue).eql(undefined);
    await t.click(Selector(".sd-boolean"), { offsetX: -4 });
    questionValue = await getQuestionValue();
    await t.expect(questionValue).eql(true);
  });

  test("click on left side of switch in intermediate state", async (t) => {
    let questionValue = await getQuestionValue();
    await t.expect(questionValue).eql(undefined);
    await t.click(Selector(".sd-boolean"), { offsetX: 4 });
    questionValue = await getQuestionValue();
    await t.expect(questionValue).eql(false);
  });

  test("check arrow keydowns", async (t) => {
    await ClientFunction(() => { document.querySelector(".sd-boolean input").focus(); })();
    await t
      .expect(getQuestionValue()).eql(undefined)
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
    let questionValue = await getQuestionValue();
    await t.expect(questionValue).eql(undefined);

    var outerSelector = ".sd-question__title";
    var innerSelector = ".sv-string-editor";
    await t
      .click(outerSelector)
      .selectEditableContent(outerSelector + " " + innerSelector, outerSelector + " " + innerSelector)
      .typeText(outerSelector + " " + innerSelector, newTitle)
      .click("body");

    questionValue = await getQuestionValue();
    await t.expect(questionValue).eql(undefined);

    json = JSON.parse(await getQuestionJson());
    await t.expect(json.title).eql(newTitle);
  });

  test("click on true label in intermediate state editable", async (t) => {
    var newLabelTrue = "MyText";
    var json = JSON.parse(await getQuestionJson());
    var labelFalse = json.labelFalse;
    let questionValue = await getQuestionValue();
    await t.expect(questionValue).eql(undefined);

    var outerSelector = Selector(".sd-boolean__label").nth(1);
    await t
      .click(outerSelector)
      .typeText(outerSelector.find(".sv-string-editor"), newLabelTrue, { replace: true })
      .click("body", { offsetX: 0, offsetY: 0 });

    questionValue = await getQuestionValue();
    await t.expect(questionValue).eql(undefined);

    json = JSON.parse(await getQuestionJson());
    await t
      .expect(json.labelFalse).eql(labelFalse)
      .expect(json.labelTrue).eql(newLabelTrue);
  });

  test("click on false label in intermediate state editable", async (t) => {
    var newLabelFalse = "MyText";
    var json = JSON.parse(await getQuestionJson());
    var labelTrue = json.labelTrue;
    let questionValue = await getQuestionValue();
    await t.expect(questionValue).eql(undefined);

    var outerSelector = ".sd-boolean__label:nth-of-type(1)";
    var innerSelector = ".sv-string-editor";
    await t
      .click(outerSelector)
      .typeText(outerSelector + " " + innerSelector, newLabelFalse, { replace: true })
      .click("body", { offsetX: 0, offsetY: 0 });

    questionValue = await getQuestionValue();
    await t.expect(questionValue).eql(undefined);

    json = JSON.parse(await getQuestionJson());
    await t
      .expect(json.labelFalse).eql(newLabelFalse)
      .expect(json.labelTrue).eql(labelTrue);
  });
});

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}`;
  test("check first clink on boolean-checkbox input", async (t) => {
    await initSurvey(framework, jsonCheckbox);
    const selector = Selector(".sd-selectbase input");
    await t
      .click(selector)
      .expect(selector.checked).ok();
  });

  test("test radio boolean", async (t) => {
    await initSurvey(framework, jsonRadio);
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
  fixture`${framework} ${title}`
    .page`${url}${framework}`;

  test("Check actions", async (t) => {
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

  test("test radio boolean with values", async (t) => {
    const checkQuestionValue = ClientFunction(
      (val) => {
        return window["survey"].getQuestionByName("q").value == val;
      }
    );
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