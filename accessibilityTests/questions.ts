import { frameworks, url, initSurvey, axeTags } from "./helper";
import { fixture, test } from "testcafe";
import { axeCheck, createReport } from "axe-testcafe";
const title = "others";

const json = {
  "elements": [
    {
      type: "boolean",
      name: "bool",
      title: "Boolean",
      label: "Are you 21 or older?",
    },
    {
      type: "image",
      name: "banner",
      imageHeight: "300px",
      imageWidth: "450px",
      imageLink:
        "https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg"
    },
    {
      type: "file",
      title: "File",
      name: "image",
      storeDataAsText: false,
      showPreview: true,
      imageWidth: 150,
      maxSize: 102400
    },
  ]
};

frameworks.forEach((framework) => {
  fixture`${framework} a11y:${title}`.page`${url}${framework}`.beforeEach(
    async (t) => {
      await initSurvey(framework, json);
    }
  );

  test.skip("axe check", async (t) => {
    const axeContext = { include: [[".sv_p_root"]] };
    const axeOptions = {
      runOnly: {
        type: "tag",
        values: axeTags
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