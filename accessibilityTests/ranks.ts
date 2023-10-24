import { frameworks, url, initSurvey, axeTags } from "./helper";
import { fixture, test } from "testcafe";
import { axeCheck, createReport } from "axe-testcafe";
const title = "ranks";

const json = {
  "elements": [
    {
      type: "rating",
      name: "satisfaction",
      title: "Rating",
      minRateDescription: "Not Satisfied",
      maxRateDescription: "Completely satisfied"
    },
    {
      type: "ranking",
      name: "smartphone-features",
      title: "Please rank the following smartphone features in order of importance:",
      choices: [
        "Battery life",
        "Screen size",
        "Storage space",
        "Camera quality",
        "Durability",
        "Processor power",
        "Price",
      ],
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