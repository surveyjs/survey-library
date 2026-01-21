import { frameworks, url, initSurvey, getSurveyResult, getQuestionValue, getQuestionJson, setOptions, test, expect } from "../helper";

const title = "comment";

const commentQuestion = ".sd-question textarea";
const json = {
  elements: [
    {
      type: "comment",
      name: "suggestions",
      title: "What would make you more satisfied with the Product?"
    }
  ]
};

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("check comment existing", async ({ page }) => {
      const json = {
        elements: [
          {
            "type": "radiogroup",
            "name": "radiogroup",
            "choices": [1, 2, 3],
            "showCommentArea": true
          },
          {
            "type": "checkbox",
            "name": "checkbox",
            "choices": [1, 2, 3],
            "showCommentArea": true
          },
          {
            "type": "dropdown",
            "name": "dropdown",
            "choices": [1, 2, 3],
            "showCommentArea": true
          },
          {
            "type": "rating",
            "name": "rating",
            "showCommentArea": true
          },
          {
            "type": "ranking",
            "name": "ranking",
            "choices": [1, 2, 3],
            "showCommentArea": true
          },
          {
            "type": "boolean",
            "name": "boolean",
            "showCommentArea": true
          },
          {
            "type": "matrix",
            "name": "matrix",
            "showCommentArea": true,
            "rows": [1, 2],
            "columns": [1, 2]
          },
          {
            "type": "matrixdynamic",
            "name": "matrixdynamic",
            "showCommentArea": true,
            "columns": [{ name: "col1" }]
          },
          {
            "type": "matrixdropdown",
            "name": "matrixdropdown",
            "showCommentArea": true,
            "columns": [{ name: "col1" }],
            "rows": [1, 2]
          },
          {
            "type": "paneldynamic",
            "name": "paneldynamic",
            "showCommentArea": true,
            "templateElements": [
              { "type": "text", "name": "q7" }
            ]
          },
          {
            "type": "file",
            "name": "file",
            "showCommentArea": true
          },
          {
            "type": "text",
            "name": "text",
            "showCommentArea": true
          },
          {
            "type": "comment",
            "name": "comment",
            "showCommentArea": true
          },
          {
            "type": "html",
            "name": "html",
            "showCommentArea": true
          },
          {
            "type": "image",
            "name": "image",
            "showCommentArea": true
          },
          {
            "type": "expression",
            "name": "expression",
            "showCommentArea": true
          },
        ]
      };
      await initSurvey(page, framework, json);
      await page.evaluate(() => {
        const survey = window["survey"];
        //survey.readOnly = true;
        survey.getAllQuestions().forEach(q => { q.id = q.name; });
        //survey.readOnly = false;
      });

      await expect(page.locator("#radiogroup_comment")).toBeVisible();
      await expect(page.locator("#checkbox_comment")).toBeVisible();
      await expect(page.locator("#dropdown_comment")).toBeVisible();
      await expect(page.locator("#rating_comment")).toBeVisible();
      await expect(page.locator("#ranking_comment")).toBeVisible();
      await expect(page.locator("#boolean_comment")).toBeVisible();
      await expect(page.locator("#matrix_comment")).toBeVisible();
      await expect(page.locator("#matrixdropdown_comment")).toBeVisible();
      await expect(page.locator("#matrixdynamic_comment")).toBeVisible();
      await expect(page.locator("#paneldynamic_comment")).toBeVisible();
      await expect(page.locator("#file_comment")).toBeVisible();
      await expect(page.locator("#text_comment")).not.toBeVisible();
      await expect(page.locator("#comment_comment")).not.toBeVisible();
      await expect(page.locator("#html_comment")).not.toBeVisible();
      await expect(page.locator("#image_comment")).not.toBeVisible();
      await expect(page.locator("#expression_comment")).not.toBeVisible();
    });

    test("autoGrowComment & acceptCarriageReturn", async ({ page }) => {
      await initSurvey(page, framework, {
        "autoGrowComment": true,
        "allowResizeComment": false,
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "comment",
                "name": "question1",
              },
              {
                "type": "radiogroup",
                "name": "question2",
                "showCommentArea": true,
                "commentText": "Comment text"
              },
              {
                "type": "comment",
                "name": "question3",
                "acceptCarriageReturn": false
              },
            ]
          }
        ],
      });

      const commentQuestion1 = page.locator(commentQuestion).first();
      await commentQuestion1.click();
      const resize = await commentQuestion1.evaluate((el) => window.getComputedStyle(el).resize);
      expect(resize).toBe("none");
      const clientHeight1 = await commentQuestion1.evaluate((el) => (el as HTMLElement).clientHeight);
      expect(clientHeight1).toBe(120);
      await page.keyboard.press("a");
      await page.keyboard.press("Enter");
      await page.keyboard.press("a");
      await page.keyboard.press("Enter");
      await page.keyboard.press("a");
      await page.keyboard.press("Enter");
      await page.keyboard.press("a");
      await page.keyboard.press("Enter");
      const clientHeight2 = await commentQuestion1.evaluate((el) => (el as HTMLElement).clientHeight);
      expect(clientHeight2).toBe(144);

      await page.keyboard.press("Backspace");
      const clientHeight3 = await commentQuestion1.evaluate((el) => (el as HTMLElement).clientHeight);
      expect(clientHeight3).toBe(120);

      const commentQuestion2 = page.locator(commentQuestion).nth(1);
      await page.keyboard.press("Tab");
      const resize2 = await commentQuestion2.evaluate((el) => window.getComputedStyle(el).resize);
      expect(resize2).toBe("none");
      const clientHeight4 = await commentQuestion2.evaluate((el) => (el as HTMLElement).clientHeight);
      expect(clientHeight4).toBe(72);

      await page.keyboard.press("a");
      await page.keyboard.press("Enter");
      await page.keyboard.press("a");
      await page.keyboard.press("Enter");
      const clientHeight5 = await commentQuestion2.evaluate((el) => (el as HTMLElement).clientHeight);
      expect(clientHeight5).toBe(96);

      await page.keyboard.press("Backspace");
      const clientHeight6 = await commentQuestion2.evaluate((el) => (el as HTMLElement).clientHeight);
      expect(clientHeight6).toBe(72);

      const commentQuestion3 = page.locator(commentQuestion).nth(2);
      await page.keyboard.press("Tab");
      const resize3 = await commentQuestion3.evaluate((el) => window.getComputedStyle(el).resize);
      expect(resize3).toBe("none");
      const clientHeight7 = await commentQuestion3.evaluate((el) => (el as HTMLElement).clientHeight);
      expect(clientHeight7).toBe(120);
      await page.keyboard.press("a");
      await page.keyboard.press("Enter");
      await page.keyboard.press("a");
      await page.keyboard.press("Enter");
      await page.keyboard.press("a");
      await page.keyboard.press("Enter");
      await page.keyboard.press("a");
      await page.keyboard.press("Enter");
      const clientHeight8 = await commentQuestion3.evaluate((el) => (el as HTMLElement).clientHeight);
      expect(clientHeight8).toBe(120);
      const value1 = await commentQuestion3.inputValue();
      expect(value1).toBe("aaaa");

      await commentQuestion3.fill("a\na\na\na\n");
      await page.keyboard.press("Tab");
      const value2 = await commentQuestion3.inputValue();
      expect(value2).toBe("aaaa");
    });

    test("autoGrowComment after survey data set", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await initSurvey(page, framework, {
        "elements": [
          {
            "type": "comment",
            "name": "question1",
            "autoGrow": true,
            "rows": 1
          }
        ]
      });
      const clientHeight1 = await page.locator(commentQuestion).evaluate((el) => (el as HTMLElement).clientHeight);
      expect(clientHeight1).toBe(48);

      await page.evaluate(() => {
        window["survey"].data = { "question1": "<h3>Thank you for your feedback.</h3> <h5> We are glad that you share with us your ideas.We highly value all suggestions from our customers. We do our best to improve the product and reach your expectation.</h5><br/>" };
      });
      const clientHeight2 = await page.locator(commentQuestion).evaluate((el) => (el as HTMLElement).clientHeight);
      expect(clientHeight2).toBe(120);
    });

    test("autoGrow with default value", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await initSurvey(page, framework, {
        "showQuestionNumbers": "off",
        "widthMode": "static",
        "width": "500px",
        elements: [
          {
            name: "name",
            type: "comment",
            titleLocation: "hidden",
            defaultValue: "The comment area has an initial height of two rows and automatically expands or shrinks to accomodate the content.",
            autoGrow: true,
            allowResize: false,
            rows: 1
          }
        ]
      });

      const value = await page.locator(commentQuestion).inputValue();
      expect(value).toBe("The comment area has an initial height of two rows and automatically expands or shrinks to accomodate the content.");
      const clientHeight = await page.locator(commentQuestion).evaluate((el) => (el as HTMLElement).clientHeight);
      expect(clientHeight).toBe(96);
    });

    test("fill textarea", async ({ page }) => {
      await initSurvey(page, framework, json);
      await page.locator(commentQuestion).click();
      await page.keyboard.type("puppies");
      await page.keyboard.press("Enter");
      await page.keyboard.type("money");
      await page.locator("button[title=Complete]").click();

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult).toEqual({ suggestions: "puppies\nmoney" });
    });

    test("change rows count", async ({ page }) => {
      await initSurvey(page, framework, json);
      await expect(page.locator("textarea[rows=\"4\"]")).toBeVisible();

      await setOptions(page, "suggestions", { rows: 2 });
      await expect(page.locator("textarea[rows=\"2\"]")).toBeVisible();
    });

    test("click on question title state editable", async ({ page }) => {
      const newTitle = "MyText";
      const outerSelector = ".sd-question__title";
      const innerSelector = ".sv-string-editor";

      await initSurvey(page, framework, json, true);
      const questionValue1 = await getQuestionValue(page);
      expect(questionValue1).toBe(undefined);
      await page.locator(outerSelector).click();
      await page.locator(outerSelector + " " + innerSelector).fill(newTitle);
      await page.locator("body").click({ position: { x: 0, y: 0 } });

      const questionValue2 = await getQuestionValue(page);
      expect(questionValue2).toBe(undefined);
      const questionJson = JSON.parse(await getQuestionJson(page));
      expect(questionJson.title).toBe(newTitle);
    });

    test("Remaining character counter", async ({ page }) => {
      const characterCounter = page.locator(".sd-remaining-character-counter");

      await initSurvey(page, framework, {
        autoFocusFirstQuestion: true,
        elements: [
          {
            name: "comment",
            type: "comment",
            maxLength: 10,
          }]
      });

      const textContent1 = await characterCounter.textContent();
      expect(textContent1).toBe("0/10");

      await page.keyboard.press("A");
      const textContent2 = await characterCounter.textContent();
      expect(textContent2).toBe("1/10");

      await page.keyboard.type("bcd");
      const textContent3 = await characterCounter.textContent();
      expect(textContent3).toBe("4/10");

      await page.keyboard.press("Backspace");
      await page.keyboard.press("Backspace");
      const textContent4 = await characterCounter.textContent();
      expect(textContent4).toBe("2/10");

      await page.keyboard.press("Backspace");
      await page.keyboard.press("Backspace");
      const textContent5 = await characterCounter.textContent();
      expect(textContent5).toBe("0/10");
    });

    test("Bug: 8921 - check long text reactivity when change visible property", async ({ page }) => {
      const json2 = {
        "logoPosition": "right",
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "boolean",
                "name": "question3"
              },
              {
                "type": "text",
                "name": "question1"
              },
              {
                "type": "comment",
                "name": "question2",
                "visibleIf": "{question3} = true",
                "setValueExpression": "{question1}"
              }
            ]
          }
        ]
      };

      await initSurvey(page, framework, json2);
      await page.getByText("Yes").click();
      await page.getByText("No").click();
      await page.getByText("Yes").click();
      await page.locator("input[type='text']").fill("test");
      await page.keyboard.press("Tab");
      const value = await page.locator("textarea").inputValue();
      expect(value).toBe("test");
    });
  });
});

