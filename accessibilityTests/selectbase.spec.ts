import { frameworks, url, initSurvey, axeOptions, axeContext } from "./helper";
import { checkA11y, injectAxe } from "axe-playwright";
import { test } from "@playwright/test";
const title = "selectbase";

// Skip one minor case for listbox role in checkbox fieldset
// axeOptions["rules"]["aria-allowed-role"] = {
//   enabled: false
// };
frameworks.forEach((framework) => {
  test.describe(`${framework} a11y:${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await injectAxe(page);
    });
    test("axe check dropdown", async ({ page }) => {
      await initSurvey(page, framework, {
        "elements": [
          {
            type: "dropdown",
            name: "cars",
            title: "Dropdown",
            isRequired: true,
            showNoneItem: true,
            colCount: 4,
            choices: [
              "Ford",
              "Vauxhall",
              "Volkswagen",
              "Nissan",
              "Audi",
              "Mercedes-Benz",
              "BMW",
              "Peugeot",
              "Toyota",
              "Citroen"
            ]
          },
        ]
      });
      await checkA11y(page, axeContext, { axeOptions });
    });
    test("axe check tagbox", async ({ page }) => {
      await initSurvey(page, framework, {
        "elements": [
          {
            type: "tagbox",
            name: "cars2",
            title: "Tagbox",
            showNoneItem: true,
            choices: [
              "Ford",
              "Vauxhall",
              "Volkswagen",
              "Nissan",
              "Audi",
              "Mercedes-Benz",
              "BMW",
              "Peugeot",
              "Toyota",
              "Citroen"
            ]
          },
        ]
      });
      await checkA11y(page, axeContext, { axeOptions });
    });
    test("axe check checkbox", async ({ page }) => {
      await initSurvey(page, framework, {
        "elements": [
          {
            type: "checkbox",
            name: "cars3",
            title: "Checkbox",
            isRequired: true,
            showSelectAllItem: true,
            showNoneItem: true,
            colCount: 4,
            choices: [
              "Ford",
              "Vauxhall",
              "Volkswagen",
              "Nissan",
              "Audi",
              "Mercedes-Benz",
              "BMW",
              "Peugeot",
              "Toyota",
              "Citroen"
            ]
          },
        ]
      });
      await checkA11y(page, axeContext, { axeOptions });
    });
    test("axe check radiogroup", async ({ page }) => {
      await initSurvey(page, framework, {
        "elements": [
          {
            type: "radiogroup",
            name: "cars4",
            title: "Radiogroup",
            isRequired: true,
            colCount: 4,
            choices: [
              "None",
              "Ford",
              "Vauxhall",
              "Volkswagen",
              "Nissan",
              "Audi",
              "Mercedes-Benz",
              "BMW",
              "Peugeot",
              "Toyota",
              "Citroen"
            ]
          },
        ]
      });
      await checkA11y(page, axeContext, { axeOptions });
    });
    test("axe check imagepicker", async ({ page }) => {
      await initSurvey(page, framework, {
        "elements": [
          {
            type: "imagepicker",
            name: "choosepicture",
            title: "Imagepicker",
            imageHeight: "150px",
            imageWidth: "225px",
            choices: [
              {
                value: "lion",
                imageLink:
                  "https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg"
              },
              {
                value: "giraffe",
                imageLink:
                  "https://surveyjs.io/Content/Images/examples/image-picker/giraffe.jpg"
              },
              {
                value: "panda",
                imageLink:
                  "https://surveyjs.io/Content/Images/examples/image-picker/panda.jpg"
              },
              {
                value: "camel",
                imageLink:
                  "https://surveyjs.io/Content/Images/examples/image-picker/camel.jpg"
              }
            ]
          },
          // {
          //   type: "imagepicker",
          //   name: "choosevideo",
          //   title: "Imagepicker",
          //   imageHeight: "300px",
          //   imageWidth: "450px",
          //   "contentMode": "video",
          //   choices: [
          //     {
          //       value: "short_but_high",
          //       // imageLink:
          //       //   "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"
          //     },
          //     {
          //       value: "long_but_poor",
          //       // imageLink:
          //       //   "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_1mb.mp4"
          //     }
          //   ]
          // },
        ]
      });
      await checkA11y(page, axeContext, { axeOptions });
    });
  });
});