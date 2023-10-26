import { frameworks, url, initSurvey, axeTags, axeContext, axeOptions } from "./helper";
import { fixture, test } from "testcafe";
import { axeCheck, createReport } from "axe-testcafe";
const title = "ranks";

frameworks.forEach((framework) => {
  fixture`${framework} a11y:${title}`.page`${url}${framework}`.beforeEach(
    async (t) => {
    }
  );

  test("axe check rating", async (t) => {
    await initSurvey(framework, {
      "elements": [
        {
          type: "rating",
          name: "satisfaction",
          title: "Rating",
          minRateDescription: "Not Satisfied",
          maxRateDescription: "Completely satisfied"
        },
      ]
    });
    const { error, violations } = await axeCheck(t, axeContext, axeOptions);
    await t.expect(violations.length === 0).ok(createReport(violations));
  });
  test("axe check ranking", async (t) => {
    await initSurvey(framework, {
      "elements": [
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
    });
    const { error, violations } = await axeCheck(t, axeContext, axeOptions);
    await t.expect(violations.length === 0).ok(createReport(violations));
  });
});