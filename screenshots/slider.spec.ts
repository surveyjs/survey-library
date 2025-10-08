import { test, expect } from "@playwright/test";
import { frameworks, url, initSurvey, compareScreenshot, getVisibleListItemByText } from "../e2e/helper";
import { Question } from "../e2e/questionHelper";
import { Survey } from "../e2e/surveyHelper";

const title = "Slider Screenshots";

frameworks.forEach(framework => {
  test.describe(`${framework} ${title}`, async () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("Slider: Single Mode", async ({ page }) => {
      const json = {
        elements: [{
          type: "slider",
          sliderType: "single",
          name: "q1"
        }],
      };
      const question = new Question(page, "q1");
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, json);

      await compareScreenshot(page, ".sd-slider", "slider-single-indeterminate.png");

      await question.setPropertyValue("min", -100);
      await compareScreenshot(page, ".sd-slider", "slider-single-negative-scale-indeterminate.png");

      await question.setPropertyValue("value", 50);
      await compareScreenshot(page, ".sd-slider", "slider-single.png");

      await question.setPropertyValue("value", -50);
      await compareScreenshot(page, ".sd-slider", "slider-single-negative-scale.png");

      await question.setPropertyValue("readOnly", true);
      await compareScreenshot(page, ".sd-slider", "slider-single-read-only.png");

      await new Survey(page).showPreview();
      await compareScreenshot(page, ".sd-slider", "slider-single-preview.png");
    });

    test("Slider: Range Mode", async ({ page }) => {
      const json = {
        elements: [{
          type: "slider",
          sliderType: "range",
          name: "q1"
        }],
      };
      const question = new Question(page, "q1");
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, json);

      await compareScreenshot(page, ".sd-slider", "slider-range-indeterminate.png");

      await question.setPropertyValue("min", -100);
      await compareScreenshot(page, ".sd-slider", "slider-range-negative-scale-indeterminate.png");

      await question.setPropertyValue("value", [40, 80]);
      await compareScreenshot(page, ".sd-slider", "slider-range.png");

      await question.setPropertyValue("value", [-40, 40]);
      await compareScreenshot(page, ".sd-slider", "slider-range-negative-scale-positive-value.png");

      await question.setPropertyValue("value", [-80, -40]);
      await compareScreenshot(page, ".sd-slider", "slider-range-negative-scale.png");

      await question.setPropertyValue("readOnly", true);
      await compareScreenshot(page, ".sd-slider", "slider-range-read-only.png");

      await new Survey(page).showPreview();
      await compareScreenshot(page, ".sd-slider", "slider-range-preview.png");
    });

    test("Slider: Theme", async ({ page }) => {
      const json = {
        elements: [{
          type: "slider",
          sliderType: "single",
          name: "q1",
          "defaultValue": 50
        }],
      };
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, json);

      await page.evaluate(() => {
        const themeJson = {
          "cssVariables": {
            "--sjs-general-backcolor": "rgba(255, 216, 77, 1)",
            "--sjs-general-backcolor-dark": "rgba(255, 255, 255, 1)",
            "--sjs-general-backcolor-dim": "rgba(0, 0, 0, 1)",
            "--sjs-general-backcolor-dim-light": "rgba(255, 255, 255, 1)",
            "--sjs-general-backcolor-dim-dark": "rgba(255, 255, 255, 1)",
            "--sjs-general-forecolor": "rgba(0, 0, 0, 1)",
            "--sjs-general-forecolor-light": "rgba(0, 0, 0, 1)",
            "--sjs-general-dim-forecolor": "rgba(255, 255, 255, 1)",
            "--sjs-general-dim-forecolor-light": "rgba(255, 255, 255, 1)",
            "--sjs-primary-backcolor": "rgba(0, 0, 0, 1)",
            "--sjs-primary-backcolor-light": "rgba(255, 255, 255, 1)",
            "--sjs-primary-backcolor-dark": "rgba(53, 53, 53, 1)",
            "--sjs-primary-forecolor": "rgba(255, 255, 255, 1)",
            "--sjs-primary-forecolor-light": "rgba(32, 32, 32, 0.25)",
            "--sjs-base-unit": "8px",
            "--sjs-corner-radius": "4px",
            "--sjs-secondary-backcolor": "rgba(255, 152, 20, 1)",
            "--sjs-secondary-backcolor-light": "rgba(255, 152, 20, 0.1)",
            "--sjs-secondary-backcolor-semi-light": "rgba(255, 152, 20, 0.25)",
            "--sjs-secondary-forecolor": "rgba(48, 48, 48, 1)",
            "--sjs-secondary-forecolor-light": "rgba(48, 48, 48, 0.25)",
            "--sjs-shadow-small": "0px 0px 0px 2px rgba(0, 0, 0, 1)",
            "--sjs-shadow-small-reset": "0px 0px 0px 0px rgba(0, 0, 0, 1)",
            "--sjs-shadow-medium": "0px 0px 0px 2px rgba(0, 0, 0, 1)",
            "--sjs-shadow-large": "0px 6px 0px 0px rgba(0, 0, 0, 1)",
            "--sjs-shadow-inner": "0px 0px 0px 2px rgba(0, 0, 0, 1),0px -2px 0px 2px rgba(0, 0, 0, 1)",
            "--sjs-shadow-inner-reset": "0px 0px 0px 0px rgba(0, 0, 0, 1),0px 0px 0px 0px rgba(0, 0, 0, 1)",
            "--sjs-border-light": "rgba(232, 192, 51, 1)",
            "--sjs-border-default": "rgba(0, 0, 0, 1)",
            "--sjs-border-inside": "rgba(255, 255, 255, 0.08)",
            "--sjs-special-red": "rgba(254, 76, 108, 1)",
            "--sjs-special-red-light": "rgba(254, 76, 108, 0.1)",
            "--sjs-special-red-forecolor": "rgba(48, 48, 48, 1)",
            "--sjs-special-green": "rgba(36, 197, 164, 1)",
            "--sjs-special-green-light": "rgba(36, 197, 164, 0.1)",
            "--sjs-special-green-forecolor": "rgba(48, 48, 48, 1)",
            "--sjs-special-blue": "rgba(91, 151, 242, 1)",
            "--sjs-special-blue-light": "rgba(91, 151, 242, 0.1)",
            "--sjs-special-blue-forecolor": "rgba(48, 48, 48, 1)",
            "--sjs-special-yellow": "rgba(255, 152, 20, 1)",
            "--sjs-special-yellow-light": "rgba(255, 152, 20, 0.1)",
            "--sjs-special-yellow-forecolor": "rgba(48, 48, 48, 1)",
            "--sjs-article-font-xx-large-textDecoration": "none",
            "--sjs-article-font-xx-large-fontWeight": "700",
            "--sjs-article-font-xx-large-fontStyle": "normal",
            "--sjs-article-font-xx-large-fontStretch": "normal",
            "--sjs-article-font-xx-large-letterSpacing": "0",
            "--sjs-article-font-xx-large-lineHeight": "64px",
            "--sjs-article-font-xx-large-paragraphIndent": "0px",
            "--sjs-article-font-xx-large-textCase": "none",
            "--sjs-article-font-x-large-textDecoration": "none",
            "--sjs-article-font-x-large-fontWeight": "700",
            "--sjs-article-font-x-large-fontStyle": "normal",
            "--sjs-article-font-x-large-fontStretch": "normal",
            "--sjs-article-font-x-large-letterSpacing": "0",
            "--sjs-article-font-x-large-lineHeight": "56px",
            "--sjs-article-font-x-large-paragraphIndent": "0px",
            "--sjs-article-font-x-large-textCase": "none",
            "--sjs-article-font-large-textDecoration": "none",
            "--sjs-article-font-large-fontWeight": "700",
            "--sjs-article-font-large-fontStyle": "normal",
            "--sjs-article-font-large-fontStretch": "normal",
            "--sjs-article-font-large-letterSpacing": "0",
            "--sjs-article-font-large-lineHeight": "40px",
            "--sjs-article-font-large-paragraphIndent": "0px",
            "--sjs-article-font-large-textCase": "none",
            "--sjs-article-font-medium-textDecoration": "none",
            "--sjs-article-font-medium-fontWeight": "700",
            "--sjs-article-font-medium-fontStyle": "normal",
            "--sjs-article-font-medium-fontStretch": "normal",
            "--sjs-article-font-medium-letterSpacing": "0",
            "--sjs-article-font-medium-lineHeight": "32px",
            "--sjs-article-font-medium-paragraphIndent": "0px",
            "--sjs-article-font-medium-textCase": "none",
            "--sjs-article-font-default-textDecoration": "none",
            "--sjs-article-font-default-fontWeight": "400",
            "--sjs-article-font-default-fontStyle": "normal",
            "--sjs-article-font-default-fontStretch": "normal",
            "--sjs-article-font-default-letterSpacing": "0",
            "--sjs-article-font-default-lineHeight": "28px",
            "--sjs-article-font-default-paragraphIndent": "0px",
            "--sjs-article-font-default-textCase": "none"
          },
          "isPanelless": false,
          "themeName": "contrast",
          "colorPalette": "dark"
        };
        (window as any).survey.applyTheme(themeJson);
      });

      await compareScreenshot(page, ".sd-slider", "slider-theme.png");
    });

    test("Slider: Inside MatrixDropdown", async ({ page }) => {
      const json = {
        "elements": [
          {
            "type": "matrixdropdown",
            "name": "matrix-with-sliders",
            "columns": [
              {
                "name": "slider",
                "cellType": "slider",
              }
            ],
            "rows": [
              "Row 1"
            ],
          }
        ]
      };
      await initSurvey(page, framework, json);
      await page.locator(".sd-slider__thumb-container").nth(0).hover({ force: true });
      await compareScreenshot(page, ".sd-matrixdropdown", "slider-inside-matrix-dropdown.png");
    });

    test("Slider: Tooltips always", async ({ page }) => {
      const json = {
        elements: [{
          type: "slider",
          sliderType: "single",
          name: "q1",
          title: "question title shouldn't be overlaped by slider's tooltip with the 'always' mode",
          tooltipVisibility: "always"
        }],
      };
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, json);
      await compareScreenshot(page, ".sd-question", "slider-single-tooltips-always.png");
    });

    test("Slider: Custom Labels", async ({ page }) => {
      const json = {
        "elements": [
          {
            "type": "slider",
            "name": "q1",
            "customLabels": [
              0,
              20,
              40,
              60,
              80,
              100,
            ]
          }
        ]
      };
      const question = new Question(page, "q1");
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, json);

      await compareScreenshot(page, ".sd-question", "slider-custom-labels.png");

      await question.setPropertyValue("customLabels", [
        { value: 0, text: "Lowest", showValue: true },
        20,
        40,
        { value: 60, text: "Middle" },
        80,
        { value: 100, text: " Highest", showValue: true },
      ]);
      await compareScreenshot(page, ".sd-question", "slider-custom-labels-secondary.png");

      await question.setPropertyValue("readOnly", true);
      await compareScreenshot(page, ".sd-question", "slider-custom-labels-secondary--read-only.png");

      await new Survey(page).showPreview();
      await compareScreenshot(page, ".sd-question", "slider-custom-labels-secondary--preview.png");
    });

  });
});