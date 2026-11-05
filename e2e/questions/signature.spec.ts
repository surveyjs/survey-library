import { frameworks, url, setOptions, initSurvey, getSurveyResult, getQuestionValue, getQuestionJson, test, expect } from "../helper";

const title = "Signature";

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await page.setViewportSize({ width: 1920, height: 1080 });
    });

    test("Signature: show/hide elements", async ({ page }) => {
      await initSurvey(page, framework, {
        "elements": [
          {
            "type": "signaturepad",
            "name": "signature",
            "title": "Please sign here",
            "isRequired": true
          }
        ],
        "showQuestionNumbers": false
      });

      const QuestionNode = page.locator(".sd-question");
      const SignCanvas = QuestionNode.locator("canvas");
      const ClearBtn = QuestionNode.locator("button[title='Clear']");
      const Placeholder = QuestionNode.locator(".sjs_sp_placeholder");
      const Controls = QuestionNode.locator(".sjs_sp_controls");

      await SignCanvas.click();
      await ClearBtn.click();
      await SignCanvas.click();

      await expect(Controls).toBeVisible();
      await expect(Placeholder).not.toBeVisible();
    });

    test("Signature: show/hide elements server mode", async ({ page }) => {
      const json = {
        "elements": [
          {
            "type": "signaturepad",
            "name": "signature",
            "title": "Please sign here",
            "storeDataAsText": false,
            "isRequired": true
          }
        ],
        "showQuestionNumbers": false
      };
      // The simulated upload's delay. The check below waits twice as long, so that a second upload would be counted too.
      const uploadDelay = 100;
      await initSurvey(page, framework, {});
      await page.evaluate(({ json, uploadDelay }) => {
        (window as any).uploadFilesCallCount = 0;

        (window as any).survey.onUploadFiles.add((_, options) => {
          setTimeout(
            (data) => {
              (window as any).uploadFilesCallCount++;
              options.callback(
                "success",
                options.files.map((file) => {
                  return {
                    file: file,
                    content: "https://example.com?name=qwertyuiop"
                  };
                })
              );
            }, uploadDelay);
        });
        (window as any).survey.fromJSON(json);
      }, { json, uploadDelay });

      const QuestionNode = page.locator(".sd-question");
      const SignCanvas = QuestionNode.locator("canvas");
      const ClearBtn = QuestionNode.locator("button[title='Clear']");
      const Placeholder = QuestionNode.locator(".sjs_sp_placeholder");
      const Controls = QuestionNode.locator(".sjs_sp_controls");

      await expect(Controls).not.toBeVisible();
      await expect(Placeholder).toBeVisible();

      await SignCanvas.click();
      await expect(Controls).toBeVisible();
      await expect(Placeholder).not.toBeVisible();

      await ClearBtn.click();
      await expect(Controls).not.toBeVisible();
      await expect(Placeholder).toBeVisible();

      await SignCanvas.click();
      await expect(Controls).toBeVisible();
      await expect(Placeholder).not.toBeVisible();

      await page.click("body", { position: { x: 0, y: 0 } });
      await page.waitForTimeout(2 * uploadDelay);
      const uploadFilesCallCount = await page.evaluate(() => {
        return (window as any).uploadFilesCallCount;
      });
      expect(uploadFilesCallCount).toEqual(1);
    });

    test("Signature: no focus with tab", async ({ page }) => {
      await initSurvey(page, framework, {
        "elements": [
          {
            "type": "text",
            "name": "q1",
            "placeholder": "q1"
          },
          {
            "type": "signaturepad",
            "name": "signature"
          },
          {
            "type": "text",
            "name": "q2",
            "placeholder": "q2"
          }
        ],
        "showQuestionNumbers": false
      });

      await page.locator("input[placeholder=q1]").click();
      await expect(page.locator("input[placeholder=q1]")).toBeFocused();
      await page.keyboard.press("Tab");
      await expect(page.locator("input[placeholder=q2]")).toBeFocused();
    });
  });
});

