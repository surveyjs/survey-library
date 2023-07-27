import { frameworks, url, initSurvey } from "../helper";
import { ClientFunction, Selector, fixture, test } from "testcafe";
// eslint-disable-next-line no-undef
const assert = require("assert");
const title = "button-group";

var json = {
  questions: [
    {
      type: "buttongroup",
      name: "radio",
      title: "Question with Button Group",
      renderAs: "button-group",
      choices: ["Choice 1", "Choice 2"],
    },
  ],
};
const setQuestionProperty = ClientFunction(
  (questionName, propertyName, propertyValue) => {
    window["survey"].getQuestionByName(questionName)[propertyName] = propertyValue;
  }
);
const getQuestionProperty = ClientFunction((questionName, properyName) => {
  return window["survey"].getQuestionByName(questionName)[properyName];
});

frameworks.forEach(framework => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async t => {
      await initSurvey(framework, json);
    }
  );

  test.skip("selected class", async t => {
    assert.ok(
      !(await Selector("label.sv-button-group__item--selected").exists)
    );
    await t.click(Selector("label[title='Choice 1']"));
    assert.equal("Choice 1", await getQuestionProperty("radio", "value"));
    assert.ok(
      await Selector("label[title='Choice 1']").hasClass(
        "sv-button-group__item--selected"
      )
    );
    await setQuestionProperty("radio", "value", "Choice 2");
    assert.ok(
      !(await Selector("label[title='Choice 1']").hasClass(
        "sv-button-group__item--selected"
      ))
    );
    assert.ok(
      await Selector("label[title='Choice 2']").hasClass(
        "sv-button-group__item--selected"
      )
    );
  });

  test.skip("readOnly items", async t => {
    assert.ok(
      !(await Selector("label.sv-button-group__item--disabled").exists)
    );
    await setQuestionProperty("radio", "readOnly", true);
    assert.ok(
      await Selector("label[title='Choice 1']").hasClass(
        "sv-button-group__item--disabled"
      )
    );
    assert.ok(
      await Selector("label[title='Choice 2']").hasClass(
        "sv-button-group__item--disabled"
      )
    );
  });

  test.skip("hide caption", async t => {
    const hideFirstItemCaption = ClientFunction(() => {
      window["survey"].getQuestionByName(
        "radio"
      ).visibleChoices[0].showCaption = false;
    });
    assert.ok(
      await Selector(
        "label[title='Choice 1'] span.sv-button-group__item-caption"
      ).exists
    );
    await hideFirstItemCaption();
    assert.ok(
      !(await Selector(
        "label[title='Choice 1'] span.sv-button-group__item-caption"
      ).exists)
    );
  });

  test.skip("show icon", async t => {
    const setFirtItemIcon = ClientFunction(iconName => {
      window["survey"].getQuestionByName(
        "radio"
      ).visibleChoices[0].iconName = iconName;
    });
    assert.ok(
      !(await Selector("label[title='Choice 1'] .sv-button-group__item-icon")
        .exists)
    );
    await setFirtItemIcon("icon");
    assert.ok(
      await Selector("label[title='Choice 1'] .sv-button-group__item-icon")
        .exists
    );
    assert.equal(
      await Selector(
        "label[title='Choice 1'] .sv-button-group__item-icon use"
      ).getAttribute("xlink:href"),
      "#icon"
    );
  });
});
