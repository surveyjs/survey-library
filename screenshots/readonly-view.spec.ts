import { test, expect } from "@playwright/test";
import { frameworks, url, initSurvey, compareScreenshot } from "../e2e/helper";

const title = "ReadOnly view mode";

frameworks.forEach(framework => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("Text view mode", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 600 });
      await initSurvey(page, framework, {
        readOnly: true,
        readOnlyMode: "view",
        showQuestionNumbers: false,
        elements: [
          { type: "text", name: "filled", title: "Filled", defaultValue: "John Doe" },
          { type: "text", name: "empty", title: "Empty" }
        ]
      });
      await compareScreenshot(page, ".sd-page", "view-text.png");
      await expect(page.getByText("\u2014", { exact: true })).toBeVisible();
    });

    test("Comment view mode", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 600 });
      await initSurvey(page, framework, {
        readOnly: true,
        readOnlyMode: "view",
        showQuestionNumbers: false,
        elements: [{
          type: "comment",
          name: "note",
          title: "Comment",
          defaultValue: "line one\nline two"
        }]
      });
      await compareScreenshot(page, ".sd-question__content", "view-comment.png");
    });

    test("Choices view mode", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 700 });
      await initSurvey(page, framework, {
        readOnly: true,
        readOnlyMode: "view",
        showQuestionNumbers: false,
        elements: [
          {
            type: "dropdown",
            name: "car",
            title: "Dropdown",
            choices: ["Ford", "BMW"],
            defaultValue: "BMW"
          },
          {
            type: "radiogroup",
            name: "color",
            title: "Radiogroup",
            choices: ["Red", "Blue"],
            defaultValue: "Blue"
          },
          {
            type: "checkbox",
            name: "items",
            title: "Checkbox",
            choices: ["One", "Two", "Three"],
            defaultValue: ["One", "Three"]
          }
        ]
      });
      await compareScreenshot(page, ".sd-page", "view-choices.png");
    });

    test("Boolean and rating view mode", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 600 });
      await initSurvey(page, framework, {
        readOnly: true,
        readOnlyMode: "view",
        showQuestionNumbers: false,
        elements: [
          { type: "boolean", name: "yes", title: "Boolean", defaultValue: true },
          { type: "boolean", name: "empty", title: "Boolean empty" },
          {
            type: "rating",
            name: "score",
            title: "Rating",
            rateMin: 1,
            rateMax: 5,
            defaultValue: 4
          }
        ]
      });
      await compareScreenshot(page, ".sd-page", "view-boolean-rating.png");
    });

    test("Multiple text view mode", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 600 });
      await initSurvey(page, framework, {
        readOnly: true,
        readOnlyMode: "view",
        showQuestionNumbers: false,
        elements: [{
          type: "multipletext",
          name: "person",
          title: "Multiple text",
          items: [{ name: "text1", title: "First" }, { name: "text2", title: "Second" }],
          defaultValue: { text1: "Ann", text2: "" }
        }]
      });
      await compareScreenshot(page, ".sd-question__content", "view-multipletext.png");
    });

    test("Matrix dropdown view mode", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 600 });
      await initSurvey(page, framework, {
        readOnly: true,
        readOnlyMode: "view",
        showQuestionNumbers: false,
        elements: [{
          type: "matrixdropdown",
          name: "matrix",
          title: "Matrix",
          columns: [
            { name: "city", title: "City", cellType: "text" },
            { name: "year", title: "Year", cellType: "dropdown", choices: ["2020", "2024"] }
          ],
          rows: ["Trip"],
          defaultValue: { Trip: { city: "Paris", year: "2024" } }
        }]
      });
      await compareScreenshot(page, ".sd-question__content", "view-matrixdropdown.png");
    });

    test("Matrix dynamic view mode", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 600 });
      await initSurvey(page, framework, {
        readOnly: true,
        readOnlyMode: "view",
        showQuestionNumbers: false,
        elements: [{
          type: "matrixdynamic",
          name: "dynamic",
          title: "Dynamic matrix",
          columns: [{ name: "name", title: "Name", cellType: "text" }],
          rowCount: 1,
          defaultValue: [{ name: "Ann" }]
        }]
      });
      await compareScreenshot(page, ".sd-question__content", "view-matrixdynamic.png");
    });

    test("Panel dynamic view mode", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 700 });
      await initSurvey(page, framework, {
        readOnly: true,
        readOnlyMode: "view",
        showQuestionNumbers: false,
        elements: [{
          type: "paneldynamic",
          name: "panels",
          title: "Dynamic panel",
          panelCount: 1,
          templateElements: [
            { type: "text", name: "city", title: "City" }
          ],
          defaultValue: [{ city: "Rome" }]
        }]
      });
      await compareScreenshot(page, ".sd-question__content", "view-paneldynamic.png");
    });

    test("Image picker view mode", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 600 });
      await initSurvey(page, framework, {
        readOnly: true,
        readOnlyMode: "view",
        showQuestionNumbers: false,
        elements: [{
          type: "imagepicker",
          name: "animals",
          title: "Image picker",
          choices: [
            {
              value: "lion",
              imageLink: "https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg",
              text: "Lion"
            },
            {
              value: "giraffe",
              imageLink: "https://surveyjs.io/Content/Images/examples/image-picker/giraffe.jpg",
              text: "Giraffe"
            }
          ],
          defaultValue: "lion"
        }]
      });
      await page.waitForLoadState("networkidle");
      await compareScreenshot(page, ".sd-question__content", "view-imagepicker.png");
    });

    test("File view mode", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 600 });
      await initSurvey(page, framework, {
        readOnly: true,
        readOnlyMode: "view",
        showQuestionNumbers: false,
        elements: [
          {
            type: "file",
            name: "files",
            title: "File",
            storeDataAsText: false,
            defaultValue: [{
              name: "File.png",
              type: "image/png",
              content: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
            }]
          },
          { type: "file", name: "empty", title: "Empty file" }
        ]
      });
      await compareScreenshot(page, ".sd-page", "view-file.png");
    });

    test("Signature view mode", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 600 });
      await initSurvey(page, framework, {
        readOnly: true,
        readOnlyMode: "view",
        showQuestionNumbers: false,
        elements: [
          { type: "signaturepad", name: "empty", title: "Empty signature" },
          {
            type: "signaturepad",
            name: "signed",
            title: "Signature",
            defaultValue: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
          }
        ]
      });
      await compareScreenshot(page, ".sd-page", "view-signature.png");
    });

    test("Question can keep the readonly look", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 600 });
      await initSurvey(page, framework, {
        readOnly: true,
        readOnlyMode: "view",
        showQuestionNumbers: false,
        elements: [
          { type: "text", name: "view", title: "View", defaultValue: "Plain text" },
          { type: "text", name: "readonly", title: "Readonly", readOnlyMode: "readonly", defaultValue: "Framed" }
        ]
      });
      await compareScreenshot(page, ".sd-page", "view-and-readonly.png");
    });
  });
});
