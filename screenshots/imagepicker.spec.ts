import { test, expect } from "@playwright/test";
import { frameworks, url, initSurvey, setRowItemFlowDirection, compareScreenshot, resetFocusToBody } from "../e2e/helper";
import { imageSource } from "../visualRegressionTests/constants";

const title = "Imagepicker Screenshot";

frameworks.forEach(framework => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("Check imagepicker checked item", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await page.setViewportSize({ width: 1920, height: 1500 });
      await initSurvey(page, framework, {
        showQuestionNumbers: false,
        widthMode: "static",
        elements: [
          {
            type: "imagepicker",
            name: "choosepicture",
            title: "Imagepicker",
            defaultValue: "lion",
            choices: [{
              value: "lion",
              imageLink: "https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg"
            },
            {
              value: "giraffe",
              imageLink: "https://surveyjs.io/Content/Images/examples/image-picker/giraffe.jpg"
            },
            {
              value: "panda",
              imageLink: "https://surveyjs.io/Content/Images/examples/image-picker/panda.jpg"
            },
            {
              value: "camel",
              imageLink: "https://surveyjs.io/Content/Images/examples/image-picker/camel.jpg"
            },
            ]
          }
        ]
      });
      // await resetFocusToBody();
      await page.waitForLoadState("networkidle");
      await compareScreenshot(page, page.locator(".sd-question"), "imagepicker-checked-item.png");
    });

    test("Check responsive imagepicker", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await page.setViewportSize({ width: 1920, height: 1500 });
      await initSurvey(page, framework, {
        showQuestionNumbers: false,
        widthMode: "responsive",
        elements: [
          {
            type: "imagepicker",
            name: "choosepicture",
            title: "Imagepicker",
            choices: [{
              value: "lion",
              imageLink: "https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg"
            },
            {
              value: "giraffe",
              imageLink: "https://surveyjs.io/Content/Images/examples/image-picker/giraffe.jpg"
            },
            {
              value: "panda",
              imageLink: "https://surveyjs.io/Content/Images/examples/image-picker/panda.jpg"
            },
            {
              value: "camel",
              imageLink: "https://surveyjs.io/Content/Images/examples/image-picker/camel.jpg"
            },
            ]
          }
        ]
      });
      // await resetFocusToBody();
      await page.waitForLoadState("networkidle");
      await compareScreenshot(page, page.locator(".sd-question"), "imagepicker-responsive-max.png");
      await page.setViewportSize({ width: 700, height: 1500 });
      await compareScreenshot(page, page.locator(".sd-question"), "imagepicker-responsive-medium.png");
      await page.setViewportSize({ width: 500, height: 1500 });
      await compareScreenshot(page, page.locator(".sd-question"), "imagepicker-responsive-min.png");
    });

    test("Check image picker responsive, colCount !== 0", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await setRowItemFlowDirection(page);
      await page.setViewportSize({ width: 1920, height: 1500 });
      await initSurvey(page, framework, {
        showQuestionNumbers: false,
        widthMode: "responsive",
        elements: [
          {
            type: "imagepicker",
            name: "choosepicture",
            title: "Imagepicker",
            colCount: 3,
            choices: [{
              value: "lion",
              imageLink: "https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg"
            },
            {
              value: "giraffe",
              imageLink: "https://surveyjs.io/Content/Images/examples/image-picker/giraffe.jpg"
            },
            {
              value: "panda",
              imageLink: "https://surveyjs.io/Content/Images/examples/image-picker/panda.jpg"
            },
            {
              value: "camel",
              imageLink: "https://surveyjs.io/Content/Images/examples/image-picker/camel.jpg"
            },
            ]
          }
        ]
      });
      // await resetFocusToBody();
      await page.waitForLoadState("networkidle");
      await compareScreenshot(page, page.locator(".sd-question"), "imagepicker-responsive-col-count-3.png");
      await page.evaluate(() => { (window as any).survey.getAllQuestions()[0].colCount = 1; });
      await compareScreenshot(page, page.locator(".sd-question"), "imagepicker-responsive-col-count-1.png");
    });

    test("Check image picker question", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        "elements": [
          {
            "type": "imagepicker",
            "name": "question2",
            "choices": [
              {
                "value": "lion",
                "imageLink": imageSource
              },
              "item1"
            ],
            imageWidth: 200,
            imageHeight: 150,
            "imageFit": "cover"
          }
        ]
      });
      await page.waitForLoadState("networkidle");

      const questionRoot = page.locator(".sd-imagepicker");
      await compareScreenshot(page, questionRoot, "imagepicker-question.png");
    });

    test("Check image picker loading is broken", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await page.setViewportSize({ width: 800, height: 600 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        elements: [
          {
            "type": "imagepicker",
            "name": "question1",
            "choices": [
              {
                "value": "Image 1",
                "imageLink": "https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg"
              },
              {
                "value": "Image 2",
              },
              {
                "value": "Image 3",
                "imageLink": "https://surveyjs.io/Cos/image-picker/panda.jpg"
              },
              {
                "value": "Image 4",
                "imageLink": "https://surveyjs.io/Content/Images/examples/image-picker/camel.jpg"
              }
            ]
          }
        ]
      });
      await page.waitForLoadState("networkidle");

      const questionRoot = page.locator(".sd-imagepicker");
      await compareScreenshot(page, questionRoot, "imagepicker-not-load.png");
    });

    test("Check image picker columns and long label text", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await setRowItemFlowDirection(page);
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        "logoPosition": "right",
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "imagepicker",
                "name": "best_picture",
                "title": "Which movie do you believe should have won the Academy Award for Best Picture?",
                "showNumber": false,
                "choices": [
                  {
                    "value": "movie_1",
                    "text": "The Holdovers",
                    "imageLink": "https://surveyjs.io/Content/Images/examples/image-picker/panda.jpg"
                  },
                  {
                    "value": "movie_2",
                    "text": "American Fiction",
                    "imageLink": "https://surveyjs.io/Content/Images/examples/image-picker/panda.jpg"
                  },
                  {
                    "value": "movie_3",
                    "text": "Oppenheimer",
                    "enableIf": "{trailer-follow-up} = 3",
                    "imageLink": "https://surveyjs.io/Content/Images/examples/image-picker/panda.jpg"
                  },
                  {
                    "value": "movie_4",
                    "text": "Barbie",
                    "imageLink": "https://surveyjs.io/Content/Images/examples/image-picker/panda.jpg"
                  },
                  {
                    "value": "movie_5",
                    "text": "Poor Things",
                    "imageLink": "https://surveyjs.io/Content/Images/examples/image-picker/panda.jpg"
                  },
                  {
                    "value": "movie_6",
                    "text": "Past Lives",
                    "imageLink": "https://surveyjs.io/Content/Images/examples/image-picker/panda.jpg"
                  },
                  {
                    "value": "movie_7",
                    "text": "Killers of the Flower Moon",
                    "imageLink": "https://surveyjs.io/Content/Images/examples/image-picker/panda.jpg"
                  },
                  {
                    "value": "movie_8",
                    "text": "Maestro",
                    "imageLink": "https://surveyjs.io/Content/Images/examples/image-picker/panda.jpg"
                  },
                  {
                    "value": "movie_9",
                    "text": "Anatomy of a Fall",
                    "imageLink": "https://surveyjs.io/Content/Images/examples/image-picker/panda.jpg"
                  },
                  {
                    "value": "movie_10",
                    "text": "The Zone of Interest",
                    "imageLink": "https://surveyjs.io/Content/Images/examples/image-picker/panda.jpg"
                  }
                ],
                "colCount": 5,
                "imageHeight": 220,
                "imageWidth": 220,
                "showLabel": true,
                "multiSelect": true
              },
            ]
          }
        ],
        "showQuestionNumbers": "off",
        "width": "1000",
        "widthMode": "static"
      });
      await page.waitForLoadState("networkidle");

      const questionRoot = page.locator(".sd-imagepicker");
      await compareScreenshot(page, questionRoot, "imagepicker-question-columns-long-label.png");
    });
  });
});