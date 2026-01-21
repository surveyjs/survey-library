import { frameworks, url, initSurvey, getSurveyResult, getQuestionValue, getQuestionJson, urlV2, test, expect } from "../helper";

const title = "rating";

const json = {
  elements: [
    {
      type: "rating",
      name: "satisfaction",
      title: "How satisfied are you with the Product?",
      minRateDescription: "Not Satisfied",
      maxRateDescription: "Completely satisfied"
    }
  ]
};

frameworks.forEach(framework => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("description exists", async ({ page }) => {
      await initSurvey(page, framework, json);
      await expect(page.locator(".sv-string-viewer").filter({ hasText: "Not Satisfied" })).toBeVisible();
      await expect(page.locator(".sv-string-viewer").filter({ hasText: "Completely satisfied" })).toBeVisible();
    });

    test("choose value", async ({ page }) => {
      await initSurvey(page, framework, json);
      const label3 = page.locator("label").filter({ hasText: "3" });
      await label3.click();
      await page.locator("button[title=Complete]").click();

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult).toEqual({
        satisfaction: 3
      });
    });

    test("click on question title state editable", async ({ page }) => {
      await initSurvey(page, framework, json, true);
      var newTitle = "MyText";
      var questionJson = JSON.parse(await getQuestionJson(page));
      expect(await getQuestionValue(page)).toBe(undefined);

      var outerSelector = ".sd-question__title";
      var innerSelector = ".sv-string-editor";
      await page.locator(outerSelector).first().click();
      await page.locator(outerSelector + " " + innerSelector).first().fill(newTitle);
      await page.locator("body").click({ position: { x: 0, y: 0 } });

      expect(await getQuestionValue(page)).toBe(undefined);
      questionJson = JSON.parse(await getQuestionJson(page));
      expect(questionJson.title).toBe(newTitle);
    });

    test("click on min label in intermediate state editable", async ({ page }) => {
      await initSurvey(page, framework, json, true);
      var newMinText = "MyText";
      var questionJson = JSON.parse(await getQuestionJson(page));
      var maxText = questionJson.maxRateDescription;
      expect(await getQuestionValue(page)).toBe(undefined);

      var outerSelector = ".sd-rating .sd-rating__min-text";
      var innerSelector = ".sv-string-editor";
      await page.locator(outerSelector).click();
      await page.locator(outerSelector + " " + innerSelector).click();
      await page.locator(outerSelector + " " + innerSelector).press("Control+a");
      await page.locator(outerSelector + " " + innerSelector).fill(newMinText);
      await page.locator("body").click({ position: { x: 0, y: 0 } });

      expect(await getQuestionValue(page)).toBe(undefined);
      questionJson = JSON.parse(await getQuestionJson(page));
      expect(questionJson.minRateDescription).toBe(newMinText);
      expect(questionJson.maxRateDescription).toBe(maxText);
    });

    test("click on max label in intermediate state editable", async ({ page }) => {
      await initSurvey(page, framework, json, true);
      var newMaxText = "MyText";
      var questionJson = JSON.parse(await getQuestionJson(page));
      var minText = questionJson.minRateDescription;
      expect(await getQuestionValue(page)).toBe(undefined);

      var outerSelector = ".sd-rating .sd-rating__max-text";
      var innerSelector = ".sv-string-editor";
      await page.locator(outerSelector).click();
      await page.locator(outerSelector + " " + innerSelector).click();
      await page.locator(outerSelector + " " + innerSelector).press("Control+a");
      await page.locator(outerSelector + " " + innerSelector).fill(newMaxText);
      await page.locator("body").click({ position: { x: 0, y: 0 } });

      expect(await getQuestionValue(page)).toBe(undefined);
      questionJson = JSON.parse(await getQuestionJson(page));
      expect(questionJson.minRateDescription).toBe(minText);
      expect(questionJson.maxRateDescription).toBe(newMaxText);
    });

    test("Check rating question with many items to dropdown", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 1080 });

      await page.evaluate(() => {
        window.addEventListener("error", e => {
          if (e.message === "ResizeObserver loop completed with undelivered notifications." ||
            e.message === "ResizeObserver loop limit exceeded") {
            e.stopImmediatePropagation();
          }
        });
      });

      await initSurvey(page, framework, {
        showQuestionNumbers: false,
        elements: [
          {
            type: "rating",
            name: "satisfaction",
            title: "Rating",
            rateMax: 30,
            width: "708px"
          }
        ]
      });
      await expect(page.locator(".sd-question .sd-dropdown")).toBeVisible();
    });

    test("check fixed width observability", async ({ page }) => {
      const jsonR = { elements: [{ "type": "rating", "name": "q1" }] };
      await initSurvey(page, framework, jsonR);
      await expect(page.locator(".sd-rating__item").filter({ hasText: "1" })).toBeVisible();
      await expect(page.locator(".sd-rating__item").filter({ hasText: "1" })).toHaveClass(/sd-rating__item--fixed-size/);

      await page.evaluate(() => {
        (window as any).survey.getQuestionByName("q1").renderedRateItems[1].locText.text = "a";
      });
      await expect(page.locator(".sd-rating__item").filter({ hasText: "a" })).not.toHaveClass(/sd-rating__item--fixed-size/);

      await page.evaluate(() => {
        (window as any).survey.getQuestionByName("q1").renderedRateItems[2].locText.text = "b";
      });
      await expect(page.locator(".sd-rating__item").filter({ hasText: "b" })).not.toHaveClass(/sd-rating__item--fixed-size/);
    });

    test("choose star value", async ({ page }) => {
      const jsonStars = {
        elements: [
          {
            type: "rating",
            name: "satisfaction",
            rateType: "stars",
            title: "How satisfied are you with the Product?",
            minRateDescription: "Not Satisfied",
            maxRateDescription: "Completely satisfied"
          }
        ]
      };
      await initSurvey(page, framework, jsonStars);
      const label3 = page.locator(".sd-rating__item-star").nth(2);
      await label3.click();
      await page.locator("button[title=Complete]").click();

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult).toEqual({
        satisfaction: 3
      });
    });

    test("choose smiley value", async ({ page }) => {
      const jsonSmileys = {
        elements: [
          {
            type: "rating",
            name: "satisfaction",
            rateType: "smileys",
            title: "How satisfied are you with the Product?",
            minRateDescription: "Not Satisfied",
            maxRateDescription: "Completely satisfied"
          }
        ]
      };
      await initSurvey(page, framework, jsonSmileys);
      const label3 = page.locator(".sd-rating__item-smiley").nth(2);

      await label3.click();
      await page.locator("button[title=Complete]").click();
      const surveyResult = await getSurveyResult(page);
      expect(surveyResult).toEqual({
        satisfaction: 3
      });
    });

    test("check keynavigation inside matrixdropdown", async ({ page }) => {
      await initSurvey(page, framework, {
        "logoPosition": "right",
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "matrixdropdown",
                "name": "question1",
                "columns": [
                  {
                    "name": "col1",
                    "cellType": "rating",
                    "rateType": "stars"
                  },
                ],
                "choices": [1, 2, 3, 4, 5],
                "rows": [
                  "row1",
                  "row2"
                ]
              }
            ]
          }
        ]
      });

      await page.keyboard.press("Tab");
      await page.keyboard.press("ArrowRight");
      await page.keyboard.press("Tab");
      await page.keyboard.press("ArrowRight");
      await page.keyboard.press("ArrowRight");

      await page.locator("button[title=Complete]").click();
      const surveyResult = await getSurveyResult(page);

      expect(surveyResult).toEqual({
        question1: {
          row1: { col1: 2 },
          row2: { col1: 3 }
        }
      });
    });

    test("readonly", async ({ page }) => {
      const json = {
        elements: [
          {
            type: "rating",
            name: "satisfaction",
            readOnly: true,
            defaultValue: "3",
            title: "How satisfied are you with the Product?",
            minRateDescription: "Not Satisfied",
            maxRateDescription: "Completely satisfied"
          }
        ]
      };
      await initSurvey(page, framework, json);

      const label1 = page.locator("label").filter({ hasText: "1" });
      const label3 = page.locator("label").filter({ hasText: "3" });
      await label1.click({ force: true });
      const hasClass1 = await label1.getAttribute("class");
      expect(hasClass1).not.toContain("sd-rating__item--selected");
      const hasClass3 = await label3.getAttribute("class");
      expect(hasClass3).toContain("sd-rating__item--selected");
    });

    test("readonly:keyboard disabled", async ({ page }) => {
      const json = {
        elements: [
          {
            type: "rating",
            name: "satisfaction",
            readOnly: true,
            defaultValue: "3",
            title: "How satisfied are you with the Product?",
            minRateDescription: "Not Satisfied",
            maxRateDescription: "Completely satisfied"
          }
        ]
      };
      await initSurvey(page, framework, json);

      await page.keyboard.press("Tab");
      await page.keyboard.press("ArrowRight");
      const getValue = async () => {
        return await page.evaluate(() => {
          return (window as any).survey.getAllQuestions()[0].value;
        });
      };
      const value = await getValue();
      expect(value).toBe(3);
    });

    test("Do not scroll the window if question has a large title text", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await initSurvey(page, framework, {
        "pages": [
          {
            "name": "page1",
            "title": "Product Concept",
            "description": "Di bagian ini Anda akan diperkenalkan dengan konsep aplikasi yang ingin kami bangun. Segala masukan yang Anda berikan dalam pertanyaan-pertanyaan di bawah akan sangat berharga bagi kami untuk memenuhi kebutuhan berjualan online Anda, maka mohon jawab pertanyaan berikut dengan seksama ",
            "elements": [
              {
                "type": "rating",
                "name": "pertanyaan6",
                "title": "Pada skala berikut, di mana  berarti sangat tidak puas dan  berarti sangat puas, bagaimana Anda menilai kemampuan kepemimpinan proyek dari software engineer dalam tim Anda? Pertimbangkan beberapa faktor berikut dalam penilaian Anda: perencanaan proyek yang efektif, koordinasi yang baik dengan anggota tim, kemampuan dalam menyelesaikan masalah yang muncul selama proyek, serta keterampilan komunikasi yang jelas dengan pemangku kepentingan. Jika memungkinkan, tambahkan komentar atau saran untuk perbaikan.",
                "description": "<p><em>(Ilustrasi diatas adalah contoh display website yang dapat Anda bangun sendiri melalui aplikasi ini)</em></p>",
                "rateType": "smileys",
                "autoGenerate": false,
                "rateValues": [1, 2, 3, 4, 5],
              },
              {
                "type": "comment",
                "name": "pertanyaan9",
                "title": "Dalam pandangan Anda, bagaimana Anda menilai kemampuan kepemimpinan proyek dari software engineer dalam tim Anda? Mohon berikan penilaian berdasarkan beberapa faktor seperti kemampuan perencanaan proyek, koordinasi dengan anggota tim, kemampuan menyelesaikan masalah yang muncul selama proyek berlangsung, serta keterampilan komunikasi dengan pemangku kepentingan. Selain itu, silakan berikan contoh konkret dari pengalaman Anda dan saran spesifik yang dapat membantu meningkatkan efektivitas kepemimpinan mereka di masa depan.",
                "isRequired": true,
                "autoGrow": true
              },
            ]
          }
        ]
      });

      const getWindowScrollY = async () => {
        return await page.evaluate(() => { return window.scrollY; });
      };

      let scrollY = await getWindowScrollY();
      expect(scrollY).toBe(0);
      await page.evaluate(() => { window.scrollTo(0, 650); });

      scrollY = await getWindowScrollY();
      expect(scrollY).toBeGreaterThanOrEqual(648);
      expect(scrollY).toBeLessThanOrEqual(672);

      await page.locator(".sd-dropdown").click();
      scrollY = await getWindowScrollY();
      expect(scrollY).toBeGreaterThanOrEqual(648);
      expect(scrollY).toBeLessThanOrEqual(672);

      await page.locator(".sd-dropdown").click();
      scrollY = await getWindowScrollY();
      expect(scrollY).toBeGreaterThanOrEqual(648);
      expect(scrollY).toBeLessThanOrEqual(672);

      await page.setViewportSize({ width: 1920, height: 1080 });
    });
  });
});

