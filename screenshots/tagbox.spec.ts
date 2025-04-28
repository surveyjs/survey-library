import { test, expect } from "@playwright/test";
import { frameworks, url, initSurvey, compareScreenshot, getVisibleListItemByText } from "../e2e/helper";

const title = "Tagbox Screenshot";

frameworks.forEach(framework => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("Check tagbox select question popup", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 1100 });
      await initSurvey(page, framework, {
        showQuestionNumbers: "off",
        questions: [
          {
            type: "tagbox",
            name: "question1",
            hasOther: "true",
            closeOnSelect: "false",
            choices: ["item1", "item2", "item3", "item4", "item5", "item6", "item7", "item8", "item9", "item10", "item11", "item12", "item13", "item14", "item15", "item16", "item17", "item18", "item19", "item20", "item21", "item22", "item23", "item24", "item25", "item26", "item27"]
          }
        ]
      });
      const questionTagbox = page.locator(".sd-input.sd-tagbox");
      await compareScreenshot(page, ".sd-input.sd-tagbox", "tagbox-question.png");

      await questionTagbox.click();
      await getVisibleListItemByText(page, "item10").click();
      await getVisibleListItemByText(page, "item15").click();
      await compareScreenshot(page, ".sv-popup__container", "tagbox-popup-selected-items.png");
      await compareScreenshot(page, ".sd-input.sd-tagbox", "tagbox-input-selected-items.png");

      await page.keyboard.press("Escape");
      await page.locator(".sv-tagbox__item").first().hover();
      await compareScreenshot(page, ".sv-tagbox__item", "tagbox-question-item-hover.png");

      await page.locator(".sd-tagbox-item_clean-button-svg").first().hover();
      await compareScreenshot(page, ".sv-tagbox__item", "tagbox-question-item-icon-hover.png");
    });

    test("Check tagbox select question without clear button", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 1100 });
      await initSurvey(page, framework, {
        showQuestionNumbers: "off",
        questions: [
          {
            type: "tagbox",
            name: "question12",
            hasOther: "true",
            allowClear: false,
            defaultValue: ["item1"],
            choices: ["item1", "item2", "item3", "item4", "item5", "item6", "item7"]
          }
        ]
      });
      await compareScreenshot(page, ".sd-input.sd-tagbox", "tagbox-question-without-clear-button.png");
    });

    test("Check tagbox disabled items", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 1100 });
      await initSurvey(page, framework, {
        showQuestionNumbers: "off",
        questions: [
          {
            type: "tagbox",
            name: "tagbox",
            hasOther: "true",
            searchEnabled: false,
            choices: ["item1", "item2", "item3", "item4", "item5", "item6", "item7", "item8", "item9", "item10", "item11", "item12", "item13", "item14", "item15", "item16", "item17", "item18", "item19", "item20", "item21", "item22", "item23", "item24", "item25", "item26", "item27"]
          }
        ]
      });
      await page.evaluate(() => {
        const updateChoiceEnabled = (_, opt) => {
          opt.choices.forEach((ch, index) => { ch.setIsEnabled(index % 2 === 0); });
        };

        const selectQuestion = window["survey"].getQuestionByName("tagbox");
        selectQuestion.onOpened.add(updateChoiceEnabled);
      });

      const questionTagbox = page.locator(".sd-input.sd-tagbox");

      await page.keyboard.press("Escape");
      await questionTagbox.click();
      await compareScreenshot(page, ".sv-popup__container", "tagbox-disabled-popup-items.png");
    });

    test("Check tagbox multivalue selected items", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 900 });
      await initSurvey(page, framework, {
        focusFirstQuestionAutomatic: true,
        showQuestionNumbers: "off",
        questions: [
          {
            type: "tagbox",
            name: "q1",
            hasOther: "true",
            allowClear: false,
            defaultValue: ["item1", "item2", "item3", "item4", "item5", "item6", "item7", "item8", "item9", "item10",],
            choices: ["item1", "item2", "item3", "item4", "item5", "item6", "item7", "item8", "item9", "item10",]
          }
        ]
      });
      await compareScreenshot(page, ".sd-input.sd-tagbox", "tagbox-question-multiline-selected-items.png");

      await page.evaluate(() => {
        window["survey"].getQuestionByName("q1").readOnly = true;
      });
      await compareScreenshot(page, ".sd-input.sd-tagbox", "tagbox-question-multiline-selected-items-readonly.png");
    });

    test("Check rtl tagbox question", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 1100 });

      await page.evaluate(() => {
        document.body.setAttribute("dir", "rtl");
      });
      await initSurvey(page, framework, {
        showQuestionNumbers: "off",
        questions: [
          {
            type: "tagbox",
            name: "question1",
            defaultValue: ["item10", "item20"],
            choices: ["item1", "item2", "item3", "item4", "item5", "item6", "item7", "item8", "item9", "item10", "item11", "item12", "item13", "item14", "item15", "item16", "item17", "item18", "item19", "item20"]
          }
        ]
      });
      await page.locator(".sv-tagbox__item").first().hover();
      await compareScreenshot(page, ".sd-question", "tagbox-rtl-question-answered.png");

      await page.locator(".sd-tagbox_clean-button-svg").click();
      await compareScreenshot(page, ".sd-question", "tagbox-rtl-question.png");

      await page.evaluate(() => {
        document.body.setAttribute("dir", "ltr");
      });
    });

    test("Check overlay popup in tagbox question", async ({ page }) => {
      await page.setViewportSize({ width: 500, height: 700 });

      await page.evaluate(() => {
        window["Survey"]._setIsTouch(true);
      });
      const json = {
        showQuestionNumbers: "off",
        questions: [
          {
            type: "tagbox",
            name: "tagbox",
            hasOther: "true",
            closeOnSelect: false,
            choices: ["item1", "item2", "item3", "item4", "item5", "item6", "item7", "item8", "item9", "item10", "item11", "item12",]
          }
        ]
      };
      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        window["survey"].onOpenDropdownMenu.add((_, options) => {
          if (options.menuType === "popup") options.menuType = "overlay";
        });
        window["survey"].fromJSON(json);
      }, json);

      await page.locator(".sd-dropdown_chevron-button").click();
      await page.locator(".sd-list__item span").filter({ hasText: "item1", visible: true }).first().click();
      await compareScreenshot(page, ".sv-popup.sv-multi-select-list", "tagbox-question-overlay-popup-selected.png");

      await page.locator("span").filter({ hasText: "Cancel" }).click();
      await page.locator(".sd-dropdown_chevron-button").click();
      await page.locator(".sv-list__input").fill("item1");
      await compareScreenshot(page, ".sv-popup.sv-multi-select-list", "tagbox-question-overlay-popup.png");
    });

    test("Check overlay popup (table mode) in tagbox question", async ({ page }) => {
      await page.setViewportSize({ width: 600, height: 900 });

      await page.evaluate(() => {
        window["Survey"]._setIsTouch(true);
      });
      await initSurvey(page, framework, {
        showQuestionNumbers: "off",
        questions: [
          {
            type: "tagbox",
            name: "tagbox",
            hasOther: "true",
            closeOnSelect: false,
            choices: ["item1", "item2", "item4", "item5", "item6", "item7", "item8", "item9", "item10", "item11", "item12", "item20", "item21", "item22", "item23", "item24", "item25", "item26", "item27", "item28", "item29", "item30", "item31",]
          }
        ]
      });
      await page.locator(".sd-dropdown_chevron-button").click();
      await page.locator(".sv-list__input").fill("item1");
      await compareScreenshot(page, ".sv-popup.sv-multi-select-list", "tagbox-question-overlay-tablet-popup.png");

      await page.locator(".sd-root-modern").click({ position: { x: 10, y: 10 } });
      await page.locator(".sd-dropdown_chevron-button").click();
      await page.locator(".sv-list__input").fill("item");
      await compareScreenshot(page, ".sv-popup.sv-multi-select-list", "tagbox-question-overlay-tablet-popup-big.png");

      await page.locator(".sd-root-modern").click({ position: { x: 10, y: 10 } });
      await page.locator(".sd-dropdown_chevron-button").click();
      await page.locator(".sv-list__input").fill("item3");
      await compareScreenshot(page, ".sv-popup.sv-multi-select-list", "tagbox-question-overlay-tablet-popup-small.png");
    });

    test("Check overlay popup (table mode) in tagbox question with long items", async ({ page }) => {
      await page.setViewportSize({ width: 900, height: 900 });

      await page.evaluate(() => {
        window["Survey"]._setIsTouch(true);
      });
      await initSurvey(page, framework,
        {
          showQuestionNumbers: "on",
          "elements": [{
            "type": "tagbox",
            "name": "q1",
            "choices": ["English: American Literature", "English: British and World Literature", "Math: Consumer Math", "Math: Practical Math", "Math: Developmental Algebra", "Math: Continuing Algebra", "Math: Pre-Algebra", "Math: Algebra", "Math: Geometry", "Math: Integrated Mathematics", "Science: Physical Science", "Science: Earth Science", "Science: Biology", "Science: Chemistry", "History: World History", "History: Modern World Studies", "History: U.S. History", "History: Modern U.S. History", "Social Sciences: U.S. Government and Politics", "Social Sciences: U.S. and Global Economics", "World Languages: Spanish", "World Languages: French", "World Languages: German", "World Languages: Latin", "World Languages: Chinese", "World Languages: Japanese"]
          }]
        });
      await page.locator(".sd-dropdown_chevron-button").click();
      await compareScreenshot(page, ".sv-popup.sv-multi-select-list", "tagbox-question-long-items-overlay-tablet-popup.png");
    });

    test("Check tagbox focused state", async ({ page }) => {
      await page.setViewportSize({ width: 600, height: 900 });
      await initSurvey(page, framework, {
        showQuestionNumbers: "off",
        questions: [
          {
            type: "tagbox",
            name: "tagbox",
            hasOther: "true",
            choices: ["item1", "item2", "item3"]
          }
        ]
      });
      await page.locator(".sd-question__title").click();
      await compareScreenshot(page, ".sd-question", "tagbox-focused.png");
    });

    test("Check tagbox input width", async ({ page }) => {
      await page.setViewportSize({ width: 600, height: 900 });
      await initSurvey(page, framework, {
        focusFirstQuestionAutomatic: true,
        showQuestionNumbers: "off",
        questions: [
          {
            type: "tagbox",
            name: "tagbox",
            hasOther: "true",
            choices: ["item1", "item2", "item3"]
          }
        ]
      });
      await page.evaluate(() => {
        (document.querySelector(".sd-question input") as HTMLElement).style.backgroundColor = "red";
      });
      await compareScreenshot(page, ".sd-question", "tagbox-contrast-input.png");
    });

    test("Check readOnly tagbox with markdown", async ({ page }) => {
      await page.setViewportSize({ width: 900, height: 400 });
      const json = {
        focusFirstQuestionAutomatic: true,
        showQuestionNumbers: "off",
        mode: "display",
        questions: [
          {
            type: "tagbox",
            name: "q1",
            defaultValue: ["Cuba", "Romania"],
            choicesByUrl: {
              url: "http://127.0.0.1:8080/testCafe/countriesMock.json",
              path: "RestResponse;result",
              valueName: "name",
            },
          }
        ]
      };
      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        window["survey"].onGetQuestionDisplayValue.add((_, options) => {
          var strs = options.displayValue.split(",");
          options.displayValue = strs.join("<br>");
        });
        window["survey"].onTextMarkdown.add((_, options) => {
          var converter = new window["showdown"].Converter();
          var str = converter.makeHtml(options.text);
          str = str.substring(3);
          str = str.substring(0, str.length - 4);
          options.html = str;
        });
        window["survey"].fromJSON(json);
      }, json);

      await compareScreenshot(page, ".sd-input.sd-tagbox", "tagbox-readonly-with-markdown.png");
    });

    test("Resize input & popup", async ({ page }) => {
      await page.setViewportSize({ width: 600, height: 900 });
      await initSurvey(page, framework, {
        showQuestionNumbers: "off",
        questions: [
          {
            type: "tagbox",
            name: "tagbox",
            hideSelectedItems: true,
            defaultValue: ["item1", "item2", "item3", "item4", "item5"],
            choices: ["item1", "item2", "item3", "item4", "item5", "item6", "item7", "item8", "item9", "item10"]
          }, {
            type: "checkbox",
            name: "question1",
            choices: ["item1", "item2", "item3", "item4", "item5", "item6"]
          }, {
            type: "tagbox",
            name: "tagbox2",
            hideSelectedItems: true,
            defaultValue: ["item1", "item2", "item3", "item4", "item5"],
            choices: ["item1", "item2", "item3", "item4", "item5", "item6", "item7", "item8", "item9", "item10"]
          }
        ]
      });
      await page.locator(".sd-dropdown_chevron-button").first().click();
      await compareScreenshot(page, ".sd-body", "tagbox-question-popup-direction-bottom.png");

      const item7 = getVisibleListItemByText(page, "item7");
      const item8 = getVisibleListItemByText(page, "item8");
      await item7.click();
      await item8.click();
      await compareScreenshot(page, ".sd-body", "tagbox-question-popup-direction-bottom-and-resize-input.png");

      await page.locator(".sd-dropdown_chevron-button").nth(1).click();
      await compareScreenshot(page, ".sd-body", "tagbox-question-popup-direction-top.png");

      await item7.click();
      await item8.click();
      await compareScreenshot(page, ".sd-body", "tagbox-question-popup-direction-top-and-resize-input.png");
    });

    test("Check tagbox long label width", async ({ page }) => {
      await page.setViewportSize({ width: 600, height: 900 });
      await initSurvey(page, framework, {
        "logoPosition": "right",
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "tagbox",
                "name": "question6",
                "defaultValue": ["Item 1"],
                "choices": [
                  {
                    "value": "Item 1",
                    "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                  },
                  {
                    "value": "Item 2",
                    "text": "text"
                  }
                ]
              }
            ]
          }
        ],
        "widthMode": "static",
        "width": "800px"
      });
      await page.locator(".sd-question").click();
      await compareScreenshot(page, ".sd-question", "tagbox-long-item-max-width.png");

      await page.keyboard.type("sed");
      await compareScreenshot(page, ".sd-question", "tagbox-long-item-hint-max-width.png");

      await page.keyboard.type("abc");
      await compareScreenshot(page, ".sd-question", "tagbox-long-item-not-found.png");
    });
  });
});