import { frameworks, url, initSurvey, getSurveyResult, getQuestionValue, getQuestionJson, getData, setOptions, test, expect } from "../helper";

const title = "file";
const folderPath = "../../resources/";

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      const json = {
        elements: [
          {
            type: "file",
            title: "Please upload your photo",
            name: "image",
            storeDataAsText: true,
            allowMultiple: true,
            showPreview: true,
            needConfirmRemoveFile: true,
            imageWidth: 150,
            maxSize: 102400
          }
        ]
      };
      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        window["survey"].onOpenFileChooser.add((_, options) => {
          var files = [];
          for (var i = 0; i < options.input.files.length; i++) {
            files.push(options.input.files[i]);
          }
          options.callback(files);
        });
        window["survey"].fromJSON(json);
      }, json);
      await page.waitForTimeout(500);
    });

    test("choose file", async ({ page }) => {
      await page.locator("input[type=file]").setInputFiles(folderPath + "stub.txt");
      await page.locator("input[type=file] + div label").click();
      await page.locator("input[value=Complete]").click();

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult).toEqual({
        image: [
          {
            name: "stub.txt",
            type: "text/plain",
            content: "data:text/plain;base64,V29tYmF0"
          }
        ]
      });
    });

    test("choose file keyboard click", async ({ page }) => {
      await page.evaluate(() => {
        (window as any).survey.rootElement.getRootNode().querySelector("label[aria-label=\"Select File\"]").click = () => { window.chooseFileClickedTest = "yes"; };
      });
      await page.keyboard.press("Tab");
      await page.keyboard.press("Enter");

      const result = await page.evaluate(() => {
        var a = window.chooseFileClickedTest;
        window.chooseFileClickedTest = undefined;
        return a;
      });
      expect(result).toBe("yes");
    });

    test("choose multiple files", async ({ page }) => {
      await page.locator("input[type=file]").setInputFiles([folderPath + "stub.txt", folderPath + "logo.jpg"]);
      await page.locator("input[type=file] + div label").click();
      await page.locator("input[value=Complete]").click();

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult.image.length).toBe(2);
      expect(surveyResult.image[0].name).toBe("stub.txt");
      expect(surveyResult.image[1].name).toBe("logo.jpg");
    });

    test("check clean button", async ({ page }) => {
      await page.evaluate(() => {
        window.survey.getAllQuestions()[0].needConfirmRemoveFile = false;
      });
      await page.locator("input[type=file]").setInputFiles([folderPath + "stub.txt", folderPath + "logo.jpg"]);
      await page.locator("input[type=file] + div label").click();
      const cleanButtonSelector = page.locator("button").filter({ hasText: "Clear" });
      await cleanButtonSelector.click();
      await expect(cleanButtonSelector).not.toBeVisible();
    });

    test("choose image", async ({ page }) => {
      await page.locator("input[type=file]").setInputFiles(folderPath + "logo.jpg");
      await page.locator("input[type=file] + div label").click();
      await page.locator("img").hover();
      await page.locator("input[value=Complete]").click();

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult.image[0].content.indexOf("image/jpeg")).not.toBe(-1);
    });

    test("without preview", async ({ page }) => {
      await setOptions(page, "image", { showPreview: false });
      await page.locator("input[type=file]").setInputFiles(folderPath + "logo.jpg");
      await page.locator("input[type=file] + div label").click();
      await expect(page.locator("img")).not.toBeVisible();

      await page.locator("input[value=Complete]").click();
      const surveyResult = await getSurveyResult(page);
      expect(surveyResult.image[0].content.indexOf("image/jpeg")).not.toBe(-1);
    });

    test("file not in data", async ({ page }) => {
      await setOptions(page, "image", { storeDataAsText: false });
      await page.locator("input[type=file]").setInputFiles(folderPath + "stub.txt");
      await page.locator("input[type=file] + div label").click();
      await page.locator("input[value=Complete]").click();

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult).toEqual({});
    });

    test("change preview height width", async ({ page }) => {
      await page.locator("input[type=file]").setInputFiles(folderPath + "logo.jpg");
      await page.locator("input[type=file] + div label").click();

      await setOptions(page, "image", {
        imageHeight: "50px",
        imageWidth: "50px"
      });

      await expect(page.locator("img")).toHaveCSS("width", "50px");
      await expect(page.locator("img")).toHaveCSS("height", "50px");
    });

    test("confirm remove file", async ({ page }) => {
      await page.locator("input[type=file]").setInputFiles(folderPath + "logo.jpg");
      await page.locator("input[type=file] + div label").click();
      await page.waitForTimeout(500);
      await page.locator(".sd-context-btn--negative").first().click();
      await page.locator(".sv-popup--confirm .sd-btn").first().click();

      let data = await getData(page);
      expect(data["image"][0].name).toBe("logo.jpg");
      await page.waitForTimeout(100);
      await page.locator(".sd-context-btn--negative").first().click();
      await page.locator(".sv-popup--confirm .sd-btn--danger").first().click();

      data = await getData(page);
      expect(data["image"]).toBe(undefined);

      // await t
      //   .setNativeDialogHandler(() => {
      //     return false;
      //   })
      //   .click(".sv_q_file_remove");
      // await t
      //   .setNativeDialogHandler(() => {
      //     return false;
      //   })
      //   .click(".sv_q_file_remove_button");
      // const history = await t.getNativeDialogHistory();
      // await t
      //   .expect(history[1].type)
      //   .eql("confirm")
      //   .expect(history[1].text)
      //   .eql("Are you sure that you want to remove this file: logo.jpg?")
      //   .expect(history[0].type)
      //   .eql("confirm")
      //   .expect(history[0].text)
      //   .eql("Are you sure that you want to remove all files?");
    });
    // TODO testcafe waiting forever...
    // test(`change file max size`, async t => {
    //     const getPosition = ClientFunction(() =>
    //         (window as any).survey.rootElement.getRootNode().querySelector("div")!.innerHTML.indexOf('The file size should not exceed 100 KB'));
    //     const getImageExistance = ClientFunction(() =>
    //         !!(window as any).survey.rootElement.getRootNode().querySelector('img'));
    //     let surveyResult;

    //     await t
    //         .setFilesToUpload(`input[type=file]`, `../resources/starry-sky.jpg`);
    //     assert.notEqual(await getPosition(), -1);

    //     await setOptions('image', { maxSize: 0 });
    //     await t
    //         .setFilesToUpload(`input[type=file]`, `../resources/logo.jpg`)
    //         .setFilesToUpload(`input[type=file]`, `../resources/starry-sky.jpg`);

    //     assert.equal(await getPosition(), -1);
    //     assert(await getImageExistance());

    //     await t
    //         .click(`input[value=Complete]`);

    //     surveyResult = await getSurveyResult();
    //     assert(surveyResult.image.indexOf('image/jpeg') !== -1);
    // });
  });
});

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await page.setViewportSize({ width: 1920, height: 1080 });
      const json = {
        elements: [
          {
            type: "file",
            title: "Please upload your photo",
            name: "image",
            storeDataAsText: true,
            allowMultiple: true,
          }
        ]
      };
      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        window["survey"].onOpenFileChooser.add((_, options) => {
          var files = [];
          for (var i = 0; i < options.input.files.length; i++) {
            files.push(options.input.files[i]);
          }
          options.callback(files);
        });
        window["survey"].fromJSON(json);
      }, json);
      await page.waitForTimeout(500);
    });

    test("Check file navigator appear on smaller screen", async ({ page }) => {
      const fileNavigatorSelector = page.locator(".sd-file .sv-action-bar");
      await page.locator("input[type=file]").setInputFiles([folderPath + "stub.txt", folderPath + "logo.jpg", folderPath + "starry-sky.jpg"]);
      await page.locator("input[type=file] + div label").click();
      await expect(fileNavigatorSelector).not.toBeVisible();
      await page.setViewportSize({ width: 620, height: 1080 });
      await expect(fileNavigatorSelector).toBeVisible();
      await expect(fileNavigatorSelector.locator(".sv-action-bar-item__title").filter({ hasText: "1 of 2" })).toBeVisible();
      await page.setViewportSize({ width: 1920, height: 1080 });
      await expect(fileNavigatorSelector).not.toBeVisible();
    });

    test("check file question has correct root element", async ({ page }) => {
      await page.waitForTimeout(500);
      const testRootElement = await page.evaluate(() => {
        const rootElement = survey.getAllQuestions()[0].rootElement;
        return rootElement && rootElement.tagName == "DIV" && rootElement.classList.contains("sd-file");
      });
      expect(testRootElement).toBe(true);
    });
  });
});

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await initSurvey(page, framework, { elements: [{ type: "file", name: "q1" }] });
    });

    test("choose file actions readOnly are reactive", async ({ page }) => {
      await page.locator(".sd-file input[type=file] + div label").click();
      await page.locator("input[type=file]").setInputFiles(folderPath + "stub.txt");
      await expect(page.locator("button[title='Clear']")).not.toHaveAttribute("disabled");
      await page.evaluate(() => {
        (window as any).survey.getAllQuestions()[0].readOnly = true;
      });
      await expect(page.locator("button[title='Clear']")).toHaveAttribute("disabled");
    });
  });
});

