import { frameworks, url, initSurvey, axeTags, axeContext, axeOptions } from "./helper";
import { fixture, test } from "testcafe";
import { axeCheck, createReport } from "axe-testcafe";
const title = "text";

frameworks.forEach((framework) => {
  fixture`${framework} a11y:${title}`.page`${url}${framework}`.beforeEach(
    async (t) => {
    }
  );

  test("axe check text", async (t) => {
    await initSurvey(framework, {
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
        }
      ]
    });
    const { error, violations } = await axeCheck(t, axeContext, axeOptions);
    await t.expect(violations.length === 0).ok(createReport(violations));
  });

  test("axe check multipletext", async (t) => {
    await initSurvey(framework, {
      "elements": [
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
            {
              type: "comment",
              name: "suggestions",
              title: "Comment"
            },
          ]
        }
      ]
    });
    const { error, violations } = await axeCheck(t, axeContext, axeOptions);
    await t.expect(violations.length === 0).ok(createReport(violations));
  });
});