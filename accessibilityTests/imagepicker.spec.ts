import { frameworks, url, initSurvey, axeOptions, axeContext } from "./helper";
import { checkA11y, injectAxe } from "axe-playwright";
import { test } from "@playwright/test";
const title = "imagepicker";

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
    test("axe check imagepicker", async ({ page }) => {
      await initSurvey(page, framework, {
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "imagepicker",
                "name": "animals",
                "title": "Which animals would you like to see in real life?",
                "description": "Please select all that apply.",
                "isRequired": true,
                "choices": [
                  {
                    "value": "lion",
                    "imageLink": "https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg",
                    "text": "Lion"
                  },
                  {
                    "value": "giraffe",
                    "imageLink": "https://surveyjs.io/Content/Images/examples/image-picker/giraffe.jpg",
                    "text": "Giraffe"
                  },
                  {
                    "value": "red-panda",
                    "imageLink": "https://surveyjs.io/Content/Images/examples/image-picker/panda.jpg",
                    "text": "Red panda"
                  },
                  {
                    "value": "camel",
                    "imageLink": "https://surveyjs.io/Content/Images/examples/image-picker/camel.jpg",
                    "text": "Camel"
                  }
                ],
                "showLabel": true,
                "multiSelect": true
              }
            ]
          }
        ]
      });
      await checkA11y(page, axeContext, { axeOptions });
    });
  });
});