import { frameworks, url, initSurvey } from "../helper";
import { ClientFunction, fixture, Selector, test } from "testcafe";
// eslint-disable-next-line no-undef
const assert = require("assert");
const title = "navigation";

const json = {
  pages: [
    {
      elements: [
        {
          name: "question4a",
          type: "text",
          title: "Question",
        },
      ]
    }
  ]
};

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async (t) => {
      await initSurvey(framework, json);
    }
  );

  test("check disable/enable navigation item", async (t) => {
    const btnSelector = Selector("#sv-nav-complete input");
    await t.expect(btnSelector.hasAttribute("disabled")).notOk();
    await ClientFunction(() => { window.survey.navigationBarValue.actions[4].enabled = false; })();
    await t.expect(btnSelector.hasAttribute("disabled")).ok();
    await ClientFunction(() => { window.survey.navigationBarValue.actions[4].enabled = true; })();
    await t.expect(btnSelector.hasAttribute("disabled")).notOk();
  });
});

const tocJson = {
  title: "Survey New Design Test",
  showTOC: true,
  pages: [
    {
      elements: [{
        name: "name",
        type: "text"
      },
      ]
    },
    {
      elements: [
        {
          name: "birthdate",
          type: "text",
          inputType: "date"
        },
      ]
    }
  ]
};

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async (t) => {
      await initSurvey(framework, tocJson);
    }
  );

  test("TOC navigation saves entered text https://github.com/surveyjs/survey-library/issues/5870", async (t) => {
    await t.typeText("input[type=text]", "some text");
    await t.click(Selector(".sv-string-viewer").withText("page2"));
    await t.expect(Selector("input[type=date]").visible).ok();
    await t.click(Selector(".sv-string-viewer").withText("page1"));
    await t.expect(Selector("input[type=text]").value).eql("some text");
  });
});
