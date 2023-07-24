import { frameworks, url, initSurvey } from "../helper";
import { fixture, test } from "testcafe";
import { axeCheck, createReport } from "axe-testcafe";
const title = "textbase";

const json = {
  "elements": [
    {
      name: "name",
      type: "text",
      indent: 1
    },
    {
      "type": "text",
      "name": "question1",
      "title": "Username",
      "isRequired": true,
      "maxLength": 25
    },
    {
      name: "name",
      type: "text",
      title: "Question title",
      titleLocation: "hidden"
    },
    {
      "type": "multipletext",
      "name": "register",
      "title": "Root Title",
      "items": [
        {
          "name": "username",
          "isRequired": true,
          "title": "Title 1",
          "maxLength": 10
        },
        {
          "name": "email",
          "title": "Title 2",
          "inputType": "email"
        },
      ]
    }
  ]
};

frameworks.forEach((framework) => {
  fixture`${framework} a11y:${title}`.page`${url}${framework}`.beforeEach(
    async (t) => {
      await initSurvey(framework, json);
    }
  );

  test("axe check", async (t) => {
    const axeContext = { include: [[".sv_p_root"]] };
    const axeOptions = {
      runOnly: {
        type: "tag",
        values: ["wcag21a", "wcag21aa"/*, 'wcag412'*/]
      },
      rules: {
        //https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md
        "color-contrast": {
          enabled: false
        },
        "document-title": {
          enabled: false
        },
        "landmark-one-main": {
          enabled: false
        },
        "page-has-heading-one": {
          enabled: false
        },
        "region": {
          enabled: false
        }
      }
    };
    const { error, violations } = await axeCheck(t, axeContext, axeOptions);
    await t.expect(violations.length === 0).ok(createReport(violations));
  });
});