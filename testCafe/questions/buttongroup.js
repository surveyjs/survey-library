import { frameworks, url, initSurvey } from "../helper";
import { ClientFunction, Selector, fixture, test } from "testcafe";
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
    await t.expect(Selector("label.sv-button-group__item--selected").exists).notOk();
    await t.click(Selector("label[title='Choice 1']"));
    await t.expect(await getQuestionProperty("radio", "value")).eql("Choice 1");
    await t.expect(Selector("label[title='Choice 1']").hasClass("sv-button-group__item--selected")).ok();
    await setQuestionProperty("radio", "value", "Choice 2");
    await t.expect(Selector("label[title='Choice 1']").hasClass("sv-button-group__item--selected")).notOk();
    await t.expect(Selector("label[title='Choice 2']").hasClass("sv-button-group__item--selected")).ok();
  });

  test.skip("readOnly items", async t => {
    await t.expect(Selector("label.sv-button-group__item--disabled").exists).notOk();
    await setQuestionProperty("radio", "readOnly", true);
    await t.expect(Selector("label[title='Choice 1']").hasClass("sv-button-group__item--disabled")).ok();
    await t.expect(Selector("label[title='Choice 2']").hasClass("sv-button-group__item--disabled")).ok();
  });

  test.skip("hide caption", async t => {
    const hideFirstItemCaption = ClientFunction(() => {
      window["survey"].getQuestionByName(
        "radio"
      ).visibleChoices[0].showCaption = false;
    });
    await t.expect(Selector("label[title='Choice 1'] span.sv-button-group__item-caption").exists).ok();
    await hideFirstItemCaption();
    await t.expect(Selector("label[title='Choice 1'] span.sv-button-group__item-caption").exists).notOk();
  });

  test.skip("show icon", async t => {
    const setFirtItemIcon = ClientFunction(iconName => {
      window["survey"].getQuestionByName(
        "radio"
      ).visibleChoices[0].iconName = iconName;
    });
    await t.expect(Selector("label[title='Choice 1'] .sv-button-group__item-icon").exists).notOk();
    await setFirtItemIcon("icon");
    await t.expect(Selector("label[title='Choice 1'] .sv-button-group__item-icon").exists).ok();
    await t.expect(Selector("label[title='Choice 1'] .sv-button-group__item-icon use").getAttribute("xlink:href")).eql("#icon");
  });
});
