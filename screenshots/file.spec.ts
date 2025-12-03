import { test, expect } from "@playwright/test";
import { frameworks, url, initSurvey, resetFocusToBody, compareScreenshot } from "../e2e/helper";

const title = "File Screenshot";

const json = {
  showQuestionNumbers: false,
  width: "900px",
  elements: [{
    type: "file",
    title: "Upload everything what you'd like to.",
    name: "file_question",
    minWidth: "704px",
    width: "704px",
    maxWidth: "704px",
  }]
};

frameworks.forEach(framework => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);

      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        window["survey"].onOpenFileChooser.add((_, o) => {
          const files: any[] = [];
          for (let i = 0; i < o.input.files.length; i++) {
            files.push(o.input.files[i]);
          }
          o.callback(files);
        });
        window["survey"].fromJSON(json);
      }, json);
      await resetFocusToBody(page);
    });

    test("Check file question", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.setInputFiles(".sd-file input", "../../screenshots/files/SingleImage.jpg");
      await page.click(".sd-file input[type=file] + div label");

      const questionRoot = page.locator(".sd-question");
      await compareScreenshot(page, questionRoot, "file-question-single-image.png");

      await page.setInputFiles(".sd-file input", "../../screenshots/files/Flamingo.png");
      await page.click(".sd-file input[type=file] + div label");
      await compareScreenshot(page, questionRoot, "file-question-single-file-small-image.png");

      await page.setInputFiles(".sd-file input", "../../screenshots/files/Portfolio.pdf");
      await page.click(".sd-file input[type=file] + div label");
      await compareScreenshot(page, questionRoot, "file-question-single-file.png");

      await page.evaluate(() => {
        const question = (window as any).survey.getQuestionByName("file_question");
        question.allowMultiple = true;
        question.clear();
      });

      await page.setInputFiles(".sd-file input", ["../../screenshots/files/Badger.png", "../../screenshots/files/Bird.png", "../../screenshots/files/Read Me.txt", "../../screenshots/files/Flamingo.png"]);
      await page.click(".sd-file input[type=file] + div label");

      await page.evaluate(() => {
        const order = ["Badger.png", "Bird.png", "Read Me.txt", "Flamingo.png"];
        const question = (window as any).survey.getQuestionByName("file_question");
        question.value = [].concat(question.value).sort((a: any, b: any) => order.indexOf(a.name) - order.indexOf(b.name));
      });
      await compareScreenshot(page, questionRoot, "file-question-multiple.png");

      await page.hover(".sd-file .sd-file__preview-item");
      await page.hover(".sd-file .sd-file__preview-item .sd-context-btn");
      await compareScreenshot(page, questionRoot, "file-question-multiple-remove-hovered.png");

      await page.setInputFiles(".sd-file input", "../../screenshots/files/SingleImage.jpg");
      await page.click(".sd-file input[type=file] + div label");

      const prevButton = page.locator(".sd-file__drag-area > .sv-action-bar").locator(".sv-action").filter({ visible: true }).first();
      await prevButton.click({ force: true });
      //await page.click(".sd-file #prevPage");
      await compareScreenshot(page, questionRoot, "file-question-multiple-navigator.png");
    });

    test("Check file question icon size", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      const questionRoot = page.locator(".sd-question");
      await page.setInputFiles(".sd-file input", "../../screenshots/files/Portfolio.pdf");
      await page.click(".sd-file input[type=file] + div label");

      await page.evaluate(() => {
        (window as any).survey.headerView = "advanced";
        (window as any).survey.applyTheme({
          cssVariables: {
            "--sjs-base-unit": "16px"
          },
          header: {
          }
        });
      });

      await compareScreenshot(page, questionRoot, "file-question-single-file-scaled.png");
    });

    test("Check file question with imageWidth/height", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.evaluate(() => {
        const question = (window as any).survey.getQuestionByName("file_question");
        question.imageWidth = "100px";
        question.imageHeight = "100px";
      });

      await page.setInputFiles(".sd-file input", "../../screenshots/files/SingleImage.jpg");
      await page.click(".sd-file input[type=file] + div label");
      const questionRoot = page.locator(".sd-question");
      await compareScreenshot(page, questionRoot, "file-question-single-small-image.png");

      await page.evaluate(() => {
        const question = (window as any).survey.getQuestionByName("file_question");
        question.imageWidth = "1920px";
        question.imageHeight = "1080px";
      });
      await compareScreenshot(page, questionRoot, "file-question-single-big-image.png");

      await page.evaluate(() => {
        const question = (window as any).survey.getQuestionByName("file_question");
        question.allowMultiple = true;
        question.imageWidth = "50px";
        question.imageHeight = "50px";
        question.clear();
      });

      await page.setInputFiles(".sd-file input", ["../../screenshots/files/Badger.png", "../../screenshots/files/Bird.png", "../../screenshots/files/Flamingo.png"]);
      await page.click(".sd-file input[type=file] + div label");
      await page.evaluate(() => {
        const order = ["Badger.png", "Bird.png", "Flamingo.png"];
        const question = (window as any).survey.getQuestionByName("file_question");
        question.value = [].concat(question.value).sort((a: any, b: any) => order.indexOf(a.name) - order.indexOf(b.name));
      });
      await compareScreenshot(page, questionRoot, "file-question-multiple-small-images.png");

      await page.evaluate(() => {
        const question = (window as any).survey.getQuestionByName("file_question");
        question.allowMultiple = true;
        question.imageWidth = "1920px";
        question.imageHeight = "1080px";
      });
      await compareScreenshot(page, questionRoot, "file-question-multiple-big-images.png");
    });

    test("Check file question - long names", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.evaluate(() => {
        const question = (window as any).survey.getQuestionByName("file_question");
        question.allowMultiple = true;
        question.value = [
          {
            "name": "item2_very_long_name_that_i_could_not_even_imagine_for_that_moment_and_to_be_honest_it_will_be_really_the_longest_file_name_in_the_world_really_really_lond_i_believe.pdf",
            "type": "application/x-zip-compressed",
            "content": "#item1.zip"
          }];
      });

      const questionRoot = page.locator(".sd-question");
      await compareScreenshot(page, questionRoot, "file-question-long-name.png");
    });

    test("Check file question - long names large font", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.evaluate(() => {
        const question = (window as any).survey.getQuestionByName("file_question");
        question.allowMultiple = true;

        (window as any).survey.applyTheme({
          cssVariables: {
            "--sjs-font-size": "20px"
          }
        });

        question.value = [
          {
            "name": "item2_very_long_name_that_i_could_not_even_imagine_for_that_moment_and_to_be_honest_it_will_be_really_the_longest_file_name_in_the_world_really_really_lond_i_believe.pdf",
            "type": "application/x-zip-compressed",
            "content": "#item1.zip"
          }];
      });

      const questionRoot = page.locator(".sd-question");
      await compareScreenshot(page, questionRoot, "file-question-long-name-font.png");
    });

    test("Check file question mobile mode", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.evaluate(() => {
        (window as any).survey.width = undefined;
        (window as any).survey.resizeObserver.disconnect();
        (window as any).survey.setIsMobile(false);
        (window as any).survey.getAllQuestions()[0].resizeObserver.disconnect();
        (window as any).survey.getAllQuestions()[0].processResponsiveness = () => { };
        (window as any).survey.getAllQuestions()[0].pageSize = 1;
        (window as any).survey.getAllQuestions()[0].setIsMobile(true);
      });

      await page.setInputFiles(".sd-file input", "../../screenshots/files/SingleImage.jpg");
      await page.click(".sd-file input[type=file] + div label");
      const questionRoot = page.locator(".sd-question");

      await page.evaluate(() => {
        const question = (window as any).survey.getQuestionByName("file_question");
        question.allowMultiple = true;
        question.clear();
      });

      await page.setInputFiles(".sd-file input", ["../../screenshots/files/Badger.png", "../../screenshots/files/Bird.png", "../../screenshots/files/Read Me.txt", "../../screenshots/files/Flamingo.png"]);
      await page.click(".sd-file input[type=file] + div label");

      await page.evaluate(() => {
        const order = ["Badger.png", "Bird.png", "Read Me.txt", "Flamingo.png"];
        const question = (window as any).survey.getQuestionByName("file_question");
        question.value = [].concat(question.value).sort((a: any, b: any) => order.indexOf(a.name) - order.indexOf(b.name));
      });

      await page.evaluate(() => {
        const question = (window as any).survey.getQuestionByName("file_question");
        question.indexToShow = 0;
        question.fileIndexAction.title = question.getFileIndexCaption();
      });
      await compareScreenshot(page, questionRoot, "file-question-multiple-mobile.png");

      const prevButton = page.locator(".sd-file__drag-area > .sv-action-bar").locator(".sv-action").first();
      const nextButton = page.locator(".sd-file__drag-area > .sv-action-bar").locator(".sv-action").last();

      await nextButton.click();
      await compareScreenshot(page, questionRoot, "file-question-multiple-mobile-next.png");
      await prevButton.click();
      await prevButton.click();
      await compareScreenshot(page, questionRoot, "file-question-multiple-mobile-prev.png");
    });

    test("Check file question uploading", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      const questionRoot = page.locator(".sd-question");
      await page.evaluate(() => {
        const question = (window as any).survey.getQuestionByName("file_question");
        question.isUploading = true;
      });

      await page.evaluate(() => {
        const element = document.querySelector(".sd-loading-indicator .sv-svg-icon") as HTMLElement;
        if (element) {
          element.style.animation = "none";
        }
      });

      await compareScreenshot(page, questionRoot, "file-uploading.png");
    });
  });
});

frameworks.forEach(framework => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("Check file question placeholder mobile", async ({ page }) => {
      await page.setViewportSize({ width: 600, height: 1000 });
      const json = {
        showQuestionNumbers: false,
        elements: [{
          type: "file",
          title: "Upload everything what you'd like to.",
          name: "file_question",
        }]
      };
      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        window["survey"].onOpenFileChooser.add((_, o) => {
          const files: any[] = [];
          for (let i = 0; i < o.input.files.length; i++) {
            files.push(o.input.files[i]);
          }
          o.callback(files);
        });
        window["survey"].fromJSON(json);
      }, json);

      const questionRoot = page.locator(".sd-question");
      await compareScreenshot(page, questionRoot, "file-question-placeholder-mobile.png");
    });

    test("Check file question different width", async ({ page }) => {
      const json = {
        showQuestionNumbers: true,
        widthMode: "responsive",
        elements: [
          {
            type: "file",
            name: "q1",
            minWidth: "616px",
            maxWidth: "616px"
          },
          {
            type: "file",
            name: "q2",
            minWidth: "300px",
            maxWidth: "300px",
            startWithNewLine: false
          },
          {
            type: "file",
            name: "q3",
            minWidth: "200px",
            maxWidth: "200px",
            startWithNewLine: false
          }
        ]
      };
      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        window["survey"].onOpenFileChooser.add((_, o) => {
          const files: any[] = [];
          for (let i = 0; i < o.input.files.length; i++) {
            files.push(o.input.files[i]);
          }
          o.callback(files);
        });
        window["survey"].fromJSON(json);
      }, json);

      await page.setViewportSize({ width: 1920, height: 1080 });
      const questionRoot = page.locator(".sd-question");
      const button = page.locator("button").filter({ hasText: "Photo" });

      await page.evaluate(() => {
        (window as any).survey.getAllQuestions()[0].setPropertyValue("currentMode", "file-camera");
        (window as any).survey.getAllQuestions()[1].setPropertyValue("currentMode", "file-camera");
        (window as any).survey.getAllQuestions()[2].setPropertyValue("currentMode", "file-camera");
      });

      await button.nth(0).hover();
      await page.waitForTimeout(100);
      await compareScreenshot(page, questionRoot.nth(0), "file-question-placeholder-normal.png");

      await button.nth(1).hover();
      await page.waitForTimeout(100);
      await compareScreenshot(page, questionRoot.nth(1), "file-question-placeholder-medium.png");

      await button.nth(2).hover();
      await page.waitForTimeout(100);
      await compareScreenshot(page, questionRoot.nth(2), "file-question-placeholder-small.png");
    });

    test("Check file question camera", async ({ page }) => {
      await page.setViewportSize({ width: 1980, height: 1000 });
      const json = {
        showQuestionNumbers: false,
        widthMode: "900px",
        elements: [{
          type: "file",
          title: "Question With Camera",
          allowMultiple: true,
          minWidth: "704px",
          width: "704px",
          maxWidth: "704px",
          name: "file_question",
        }]
      };
      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        window["survey"].onOpenFileChooser.add((_, o) => {
          const files: any[] = [];
          for (let i = 0; i < o.input.files.length; i++) {
            files.push(o.input.files[i]);
          }
          o.callback(files);
        });
        window["survey"].fromJSON(json);
      }, json);

      const questionRoot = page.locator(".sd-question");
      await page.evaluate(() => {
        (window as any).survey.getAllQuestions()[0].setPropertyValue("currentMode", "camera");
      });
      await page.waitForTimeout(1000);
      await compareScreenshot(page, questionRoot, "file-question-camera-mode.png");

      await page.evaluate(() => {
        (window as any).survey.getAllQuestions()[0].setPropertyValue("currentMode", "file-camera");
      });
      await page.waitForTimeout(1000);
      await compareScreenshot(page, questionRoot, "file-question-both-mode.png");

      await page.evaluate(() => {
        (window as any).survey.getAllQuestions()[0].setPropertyValue("isPlayingVideo", true);
      });
      await page.waitForTimeout(1000);
      await compareScreenshot(page, questionRoot, "file-question-video.png");

      await page.evaluate(() => {
        (window as any).survey.getAllQuestions()[0].setPropertyValue("isPlayingVideo", false);
      });
      await page.waitForTimeout(1000);
      await page.setInputFiles(".sd-file input", "../../screenshots/files/Read Me.txt");
      await page.click(".sd-file input[type=file] + div label");
      await page.evaluate(() => {
        (window as any).survey.getAllQuestions()[0].setPropertyValue("currentMode", "file-camera");
      });
      await page.waitForTimeout(1000);
      await compareScreenshot(page, questionRoot, "file-question-both-mode-answered.png");
    });
  });
});