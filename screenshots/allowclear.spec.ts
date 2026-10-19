import { test } from "@playwright/test";
import { frameworks, url, initSurvey, compareScreenshot, resetFocusToBody, waitUntilAllImagesLoad } from "../e2e/helper";

const title = "Allow Clear Screenshot";

const json = {
  showQuestionNumbers: "off",
  widthMode: "static",
  width: "860px",
  autoFocusFirstQuestion: false,
  elements: [
    {
      type: "radiogroup",
      name: "radio",
      title: "Radio Button Group",
      allowClear: true,
      defaultValue: "Paris",
      choices: ["Paris", "London", "Madrid"]
    },
    {
      type: "slider",
      name: "slider",
      title: "Slider",
      allowClear: true,
      defaultValue: 40
    },
    {
      type: "boolean",
      name: "boolean",
      title: "Yes/No",
      allowClear: true,
      defaultValue: true
    },
    {
      type: "boolean",
      name: "boolean-radio",
      title: "Yes/No as radio buttons",
      displayMode: "radio",
      allowClear: true,
      defaultValue: false
    },
    {
      type: "boolean",
      name: "boolean-checkbox",
      title: "Yes/No as checkbox",
      displayMode: "checkbox",
      allowClear: true,
      defaultValue: true
    },
    {
      type: "boolean",
      name: "boolean-switch",
      title: "Yes/No as switch",
      displayMode: "switch",
      allowClear: true,
      defaultValue: true
    },
    {
      type: "imagepicker",
      name: "image",
      title: "Image Picker",
      allowClear: true,
      defaultValue: "lion",
      choices: [
        { value: "lion", imageLink: "https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg" },
        { value: "giraffe", imageLink: "https://surveyjs.io/Content/Images/examples/image-picker/giraffe.jpg" },
        { value: "panda", imageLink: "https://surveyjs.io/Content/Images/examples/image-picker/panda.jpg" }
      ]
    },
    {
      type: "matrix",
      name: "matrix",
      title: "Single-Select Matrix",
      allowClear: true,
      defaultValue: { affordable: 5 },
      columns: [
        { value: 5, text: "Agree" },
        { value: 3, text: "Neutral" },
        { value: 1, text: "Disagree" }
      ],
      rows: [
        { value: "affordable", text: "Product is affordable" },
        { value: "easy-to-use", text: "Product is easy to use" }
      ]
    }
  ]
};

frameworks.forEach(framework => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await page.setViewportSize({ width: 1200, height: 900 });
    });

    test("Clear button in the question title", async ({ page }) => {
      await initSurvey(page, framework, json);
      await waitUntilAllImagesLoad(page);
      await resetFocusToBody(page);

      const question = (name: string) => page.locator(`.sd-question[data-name="${name}"]`);
      await compareScreenshot(page, question("radio"), "allowclear-radiogroup.png");
      await compareScreenshot(page, question("slider"), "allowclear-slider.png");
      await compareScreenshot(page, question("boolean"), "allowclear-boolean.png");
      await compareScreenshot(page, question("boolean-radio"), "allowclear-boolean-radio.png");
      await compareScreenshot(page, question("boolean-checkbox"), "allowclear-boolean-checkbox.png");
      await compareScreenshot(page, question("boolean-switch"), "allowclear-boolean-switch.png");
      await compareScreenshot(page, question("image"), "allowclear-imagepicker.png");
      await compareScreenshot(page, question("matrix"), "allowclear-matrix.png");
    });
  });
});
