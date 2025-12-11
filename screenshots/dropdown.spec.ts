import { test, expect } from "@playwright/test";
import { frameworks, url, initSurvey, compareScreenshot, resetFocusToBody, waitUntilAllImagesLoad } from "../e2e/helper";
import { registerCustomItemComponent } from "../e2e/registerCustomComponents";

const title = "Dropdown Screenshot";

frameworks.forEach(framework => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("Check dropdown select question", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: false,
        elements: [
          {
            type: "dropdown",
            title: "Where are you living?",
            name: "dropdown_question",
            renderAs: "select",
            placeholder: "Select country here...",
            choices: ["Greece"]
          },
        ]
      });

      await resetFocusToBody(page);
      await compareScreenshot(page, ".sd-question", "dropdown-question.png");

      await page.evaluate(() => { (<any>window).survey.getQuestionByName("dropdown_question").value = "Greece"; });
      await compareScreenshot(page, ".sd-question", "dropdown-question-answered.png");
    });

    test("Check dropdown question", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: false,
        elements: [
          {
            type: "dropdown",
            title: "Where are you living?",
            name: "dropdown_question",
            placeholder: "Select country here...",
            allowClear: false,
            choices: ["Greece"],
          },
        ]
      });

      await resetFocusToBody(page);
      await compareScreenshot(page, ".sd-question", "dropdown-select-question.png");

      await page.evaluate(() => { (<any>window).survey.getQuestionByName("dropdown_question").value = "Greece"; });
      await compareScreenshot(page, ".sd-question", "dropdown-select-question-answered.png");
    });

    test("Check dropdown question input", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: false,
        elements: [
          {
            type: "dropdown",
            title: "Where are you living?",
            name: "dropdown_question",
            placeholder: "Select country here...",
            allowClear: false,
            choices: ["Greece"],
          },
        ]
      });

      await page.locator(".sd-dropdown__filter-string-input").focus();
      await page.keyboard.type("Greece");
      await page.waitForTimeout(500);
      await compareScreenshot(page, ".sd-question", "dropdown-input-position.png");
    });

    test("item focused state for keyboard navigation", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        autoFocusFirstQuestion: true,
        showQuestionNumbers: false,
        elements: [
          {
            type: "dropdown",
            title: "Where are you living?",
            name: "dropdown_question",
            placeholder: "Select country here...",
            allowClear: false,
            choices: [
              "item1",
              "item2",
              "item3",
              "item4",
              "item5",
              "item6",
              "item7",
              "item8",
              "item9",
              "item10"
            ]
          },
        ]
      });

      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("ArrowDown");
      await page.waitForTimeout(500);
      await compareScreenshot(page, ".sv-popup__container", "dropdown-item-focused-state.png");
    });

    test("Check dropdown select question popup", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 1100 });
      await initSurvey(page, framework, {
        showQuestionNumbers: false,
        elements: [
          {
            type: "dropdown",
            name: "question1",
            showOtherItem: "true",
            choices: ["item1", "item2", "item3", "item4", "item5", "item6", "item7", "item8", "item9", "item10", "item11", "item12", "item13", "item14", "item15", "item16", "item17", "item18", "item19", "item20", "item21", "item22", "item23", "item24", "item25", "item26", "item27"]
          }
        ]
      });

      const questionDropdownSelect = page.locator(".sd-input.sd-dropdown");
      await questionDropdownSelect.click();
      await compareScreenshot(page, ".sv-popup__container", "dropdown-select-question-popup.png");
    });

    test("Check dropdown select question with clear button", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 1100 });
      await initSurvey(page, framework, {
        autoFocusFirstQuestion: true,
        showQuestionNumbers: false,
        elements: [
          {
            type: "dropdown",
            name: "question12",
            showOtherItem: "true",
            defaultValue: "item1",
            choices: ["item1", "item2", "item3", "item4", "item5", "item6", "item7"]
          }
        ]
      });

      await compareScreenshot(page, ".sd-input.sd-dropdown", "dropdown-select-question-with-clear-button.png");
    });

    test("Check dropdown select question with long text", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 1100 });
      await initSurvey(page, framework, {
        showQuestionNumbers: false,
        elements: [
          {
            type: "dropdown",
            name: "question1",
            defaultValue: "item1_longlonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglong",
            choices: [
              "item1_longlonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglong",
              "item2",
              "item3",
              "item4",
              "item5",
              "item6",
              "item7"
            ]
          }, {
            type: "dropdown",
            allowClear: false,
            name: "question2",
            defaultValue: "item1_longlonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglong",
            choices: [
              "item1_longlonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglong",
              "item2",
              "item3",
              "item4",
              "item5",
              "item6",
              "item7"
            ]
          }
        ]
      });

      await resetFocusToBody(page);
      const questionDropdownSelect = page.locator(".sd-input.sd-dropdown");
      await compareScreenshot(page, questionDropdownSelect, "dropdown-select-question-and-long-text.png", 1);
      await compareScreenshot(page, questionDropdownSelect, "dropdown-select-question-with-clear-button-and-long-text.png", 0);

      await questionDropdownSelect.first().click();
      await compareScreenshot(page, ".sv-popup__container", "dropdown-list-item-with-long-text.png");
    });

    test("Check dropdown disabled items", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 1100 });
      await initSurvey(page, framework, {
        showQuestionNumbers: false,
        elements: [
          {
            type: "dropdown",
            name: "DropdownRenderAsSelect",
            showOtherItem: "true",
            searchEnabled: false,
            choices: ["item1", "item2", "item3", "item4", "item5", "item6", "item7", "item8", "item9", "item10", "item11", "item12", "item13", "item14", "item15", "item16", "item17", "item18", "item19", "item20", "item21", "item22", "item23", "item24", "item25", "item26", "item27"] }
        ]
      });

      await page.evaluate(() => {
        const updateChoiceEnabled = (_, opt) => {
          opt.choices.forEach((ch, index) => { ch.setIsEnabled(index % 2 === 0); });
        };
        const selectQuestion = window["survey"].getQuestionByName("DropdownRenderAsSelect");
        selectQuestion.onOpened.add(updateChoiceEnabled);
      });
      const questionDropdownSelect = page.locator(".sd-input.sd-dropdown");

      await page.keyboard.press("Escape");
      await questionDropdownSelect.click();
      await compareScreenshot(page, ".sv-popup__container", "dropdown-select-disabled-popup-items.png");
    });

    test("Check dropdown selected items", async ({ page }) => {
      await page.setViewportSize({ width: 500, height: 300 });
      await initSurvey(page, framework, {
        showQuestionNumbers: false,
        elements: [
          {
            type: "dropdown",
            name: "question1",
            showOtherItem: "true",
            choices: ["item1", "item2", "item3", "item4", "item5", "item6", "item7", "item8", "item9", "item10", "item11", "item12", "item13", "item14", "item15", "item16", "item17", "item18", "item19", "item20", "item21", "item22", "item23", "item24", "item25", "item26", "item27"] }
        ]
      });

      const questionDropdownSelect = page.locator(".sd-input.sd-dropdown");
      await questionDropdownSelect.click();
      await compareScreenshot(page, ".sv-popup__container", "dropdown-question-empty-value.png");
      await page.locator("text=item7").click();
      await questionDropdownSelect.click();
      await compareScreenshot(page, ".sv-popup__container", "dropdown-question-noempty-value.png");
      await page.setViewportSize({ width: 1280, height: 1100 });
    });

    test("Check dropdown empty list", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 1100 });
      await initSurvey(page, framework, {
        showQuestionNumbers: false,
        elements: [
          {
            type: "dropdown",
            name: "q1",
            showOtherItem: "true",
            choices: ["item1", "item2", "item3", "item4", "item5", "item6", "item7", "item8", "item9", "item10", "item11", "item12", "item13", "item14", "item15", "item16", "item17", "item18", "item19", "item20", "item21", "item22", "item23", "item24", "item25", "item26", "item27"] }
        ]
      });

      await page.locator(".sd-dropdown__filter-string-input").focus();
      await page.locator(".sd-dropdown__filter-string-input").fill("test");
      await page.waitForTimeout(100);
      await compareScreenshot(page, ".sv-list__empty-container", "dropdown-empty-list.png");
      await page.locator(".sd-dropdown__filter-string-input").click();
      await page.setViewportSize({ width: 300, height: 500 });
      await page.waitForTimeout(500);
      await page.locator(".sd-dropdown__filter-string-input").pressSequentially("1");
      await compareScreenshot(page, ".sv-list__empty-container", "dropdown-small-window-empty-list.png");
    });

    test("Check dropdown with markdown", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 1100 });
      const json = {
        autoFocusFirstQuestion: false,
        showQuestionNumbers: false,
        elements: [
          {
            type: "dropdown",
            name: "q1",
            defaultValue: "cat",
            choices: [
              {
                "value": "dog",
                "text": "Dog: ![A dog](https://surveyjs.io/Content/Images/examples/markdown/dog.svg =14x14)"
              }, {
                "value": "cat",
                "text": "Cat: ![A cat](https://surveyjs.io/Content/Images/examples/markdown/cat.svg =14x14)"
              }, {
                "value": "parrot",
                "text": "Parrot ![A parrot](https://surveyjs.io/Content/Images/examples/markdown/parrot.svg =14x14)"
              }
            ]
          }
        ]
      };

      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        window["survey"].onTextMarkdown.add((_, options) => {
          var converter = new window["showdown"].Converter();
          var str = converter.makeHtml(options.text);
          str = str.substring(3);
          str = str.substring(0, str.length - 4);
          options.html = str;
        });
        window["survey"].fromJSON(json);
      }, json);
      await waitUntilAllImagesLoad(page);
      const questionDropdownSelect = page.locator(".sd-input.sd-dropdown");
      await compareScreenshot(page, questionDropdownSelect, "dropdown-with-markdown.png");
      await questionDropdownSelect.click();
      await waitUntilAllImagesLoad(page);
      await compareScreenshot(page, ".sv-popup__container", "dropdown-with-markdown-popup.png");
      await page.keyboard.press("Enter");
      await waitUntilAllImagesLoad(page);
      await compareScreenshot(page, questionDropdownSelect, "dropdown-with-markdown-focused.png");
    });

    test("Check rtl dropdown question", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.evaluate(() => {
        document.body.setAttribute("dir", "rtl");
      });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        elements: [
          {
            type: "dropdown",
            name: "dropdown_question",
            defaultValue: "item10",
            choices: ["item1", "item2", "item3", "item4", "item5", "item6", "item7", "item8", "item9", "item10", "item11", "item12", "item13", "item14", "item15", "item16", "item17", "item18", "item19"], },
        ]
      });

      await compareScreenshot(page, ".sd-question", "dropdown-rtl-question-answered.png");
      await page.locator(".sd-editor-clean-button").click();
      await compareScreenshot(page, ".sd-question", "dropdown-rtl-question.png");
      await page.evaluate(() => {
        document.body.setAttribute("dir", "ltr");
      });
    });

    test("Dropdown search with spaces", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 1100 });
      await initSurvey(page, framework, {
        showQuestionNumbers: false,
        elements: [
          {
            type: "dropdown",
            name: "q1",
            showOtherItem: "true",
            choices: ["item abc", "item def",]
          }
        ]
      });

      await page.locator(".sd-dropdown__filter-string-input").focus();
      await page.keyboard.type("a");
      await page.waitForTimeout(100);
      await compareScreenshot(page, ".sd-dropdown", "dropdown-search-spaces-prefix.png");
      await page.locator(".sd-dropdown__filter-string-input").fill("m");
      await page.waitForTimeout(100);
      await compareScreenshot(page, ".sd-dropdown", "dropdown-search-spaces-suffix.png");
    });

    test("Check dropdown with custom component input height", async ({ page }) => {
      await registerCustomItemComponent(page, framework);
      const json = {
        showQuestionNumbers: true,
        autoFocusFirstQuestion: true,
        elements: [
          {
            type: "dropdown",
            name: "cars",
            title: "Dropdown",
            defaultValue: "Ford",
            itemComponent: "new-item",
            choices: ["Ford", "Vauxhall", "Volkswagen", "Nissan", "Audi", "Mercedes-Benz", "BMW", "Peugeot", "Toyota", "Citroen"]
          }
        ]
      };
      await initSurvey(page, framework, json);
      await page.setViewportSize({ width: 1280, height: 1100 });
      await page.evaluate(() => {
        (<HTMLElement>document.querySelector(".sd-question__content svg")).style.height = "48px";
        (<HTMLElement>document.querySelector(".sd-question__content input")).style.backgroundColor = "red";
      });
      await compareScreenshot(page, ".sd-question__content", "dropdown-custom-component.png");
    });

    test("Check overlay popup in dropdown question", async ({ page }) => {
      await page.setViewportSize({ width: 500, height: 700 });
      await page.evaluate(() => {
        window["Survey"]._setIsTouch(true);
      });
      await initSurvey(page, framework, {
        showQuestionNumbers: false,
        elements: [
          {
            type: "dropdown",
            name: "dropdown",
            showOtherItem: "true",
            closeOnSelect: false,
            choices: ["item1", "item2", "item3", "item4", "item5", "item6", "item7", "item8", "item9", "item10", "item11", "item12",] }
        ]
      });
      await page.evaluate(() => {
        window["survey"].onOpenDropdownMenu.add((sender, options) => {
          if (options.menuType === "popup") options.menuType = "overlay";
        });
      });
      const questionDropdownSelect = page.locator(".sd-input.sd-dropdown");
      await questionDropdownSelect.click();
      await page.getByText("item1", { exact: true }).click();
      await questionDropdownSelect.click();
      await compareScreenshot(page, ".sv-popup.sv-single-select-list", "dropdown-question-overlay-popup-selected.png");
    });

    test("Check long text in disabled dropdown question", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 1100 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        "logoPosition": "right",
        "mode": "display",
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "dropdown",
                "name": "question1",
                "defaultValue": "Item 1",
                "choices": [
                  {
                    "value": "Item 1",
                    "text": "Some long text goes here Some long text goes here Some long text goes here "
                  },
                  "Item 2",
                  "Item 3"
                ]
              }
            ]
          }
        ]
      });
      await page.waitForTimeout(500);
      await compareScreenshot(page, ".sd-question", "dropdown-question-disabled-long-text.png");
    });

    test("Check dropdown readonly with empty placeholder", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 1100 });
      await initSurvey(page, framework, {
        showQuestionNumbers: false,
        elements: [
          {
            "type": "dropdown",
            "name": "q1",
            placeholder: "",
            readOnly: true,
            "choices": ["item1", "item2"]
          },
        ]
      });

      await compareScreenshot(page, ".sd-dropdown--empty.sd-input--readonly", "dropdown-readonly-empty-placeholder.png");
    });

    test("Check dropdown custom item styles", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        elements: [
          {
            type: "dropdown", name: "q1", allowCustomChoices: true,
            choices: ["item1", "item2", "item3"]
          }
        ]
      });

      await page.locator(".sd-dropdown__filter-string-input").focus();
      await page.keyboard.type("test");
      await page.waitForTimeout(500);
      await compareScreenshot(page, page.getByTitle('Create "test" item...'), "dropdown-custom-list-item.png");
    });
  });
});