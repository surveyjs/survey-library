import { frameworks, url, initSurvey, axeTags, axeContext, axeOptions } from "./helper";
import { fixture, test } from "testcafe";
import { axeCheck, createReport } from "axe-testcafe";
const title = "others";

frameworks.forEach((framework) => {
  fixture`${framework} a11y:${title}`.page`${url}${framework}`.beforeEach(
    async (t) => {
    }
  );

  test("axe check boolean", async (t) => {
    await initSurvey(framework, {
      "elements": [
        {
          type: "boolean",
          name: "bool",
          title: "Boolean",
          label: "Are you 21 or older?",
        },
      ]
    });
    const { error, violations } = await axeCheck(t, axeContext, axeOptions);
    await t.expect(violations.length === 0).ok(createReport(violations));
  });
  test("axe check image", async (t) => {
    await initSurvey(framework, {
      "elements": [
        {
          type: "image",
          name: "banner",
          imageHeight: "300px",
          imageWidth: "450px",
          imageLink:
            "https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg"
        },
      ]
    });
    const { error, violations } = await axeCheck(t, axeContext, axeOptions);
    await t.expect(violations.length === 0).ok(createReport(violations));
  });
  test("axe check file", async (t) => {
    await initSurvey(framework, {
      "elements": [
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
    });
    const { error, violations } = await axeCheck(t, axeContext, axeOptions);
    await t.expect(violations.length === 0).ok(createReport(violations));
  });
});