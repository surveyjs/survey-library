import { frameworks, url, initSurvey, getVisibleListItemByText, test, expect } from "../helper";

const title = "tagbox";

const questionOffsetTopConst = 176;
const singleListItemHeight = 56;

const jsonCloseOnSelectIsTrue = {
  autoFocusFirstQuestion: true,
  showQuestionNumbers: false,
  elements: [
    {
      type: "tagbox",
      name: "question1",
      showOtherItem: "true",
      closeOnSelect: true,
      choices: Array.from({ length: 27 }, (_, i) => `item${i + 1}`)
    }
  ]
};

const jsonCloseOnSelectIsDefault = {
  autoFocusFirstQuestion: true,
  showQuestionNumbers: false,
  elements: [
    {
      type: "tagbox",
      name: "question1",
      showOtherItem: "true",
      choices: Array.from({ length: 27 }, (_, i) => `item${i + 1}`)
    }
  ]
};

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("tagbox editing", async ({ page }) => {
      await initSurvey(page, framework, jsonCloseOnSelectIsTrue);

      const selectedItems = page.locator(".sv-tagbox__item");
      const questionTagbox = page.locator(".sd-tagbox");
      const deleteItemButton = page.locator(".sd-tagbox-item_clean-button");

      await expect(selectedItems).toHaveCount(0);

      await questionTagbox.click();
      await getVisibleListItemByText(page, "item20").click();
      await questionTagbox.click();
      await getVisibleListItemByText(page, "item10").click();
      await page.keyboard.press("Escape");
      await expect(selectedItems).toHaveCount(2);
      await expect(selectedItems.nth(0)).toContainText("item20");
      await expect(selectedItems.nth(1)).toContainText("item10");

      await selectedItems.first().hover();
      await deleteItemButton.first().click();
      await expect(selectedItems).toHaveCount(1);
      await expect(selectedItems.nth(0)).toContainText("item10");

      await selectedItems.first().hover();
      await deleteItemButton.first().click();
      await expect(selectedItems).toHaveCount(0);
    });

    test("tagbox selected list items", async ({ page }) => {
      await initSurvey(page, framework, jsonCloseOnSelectIsDefault);

      const popupContainer = page.locator(".sv-popup__container").filter({ visible: true });
      const selectedListItem = page.locator(".sv-list__item--selected");
      const selectedItems = page.locator(".sv-tagbox__item");
      const questionTagbox = page.locator(".sd-tagbox");

      await expect(popupContainer).not.toBeVisible();
      await questionTagbox.click();
      await expect(popupContainer).toBeVisible();

      await getVisibleListItemByText(page, "item1").click();
      await getVisibleListItemByText(page, "item2").click();
      await getVisibleListItemByText(page, "item3").click();
      await expect(selectedItems).toHaveCount(3);
      await expect(selectedListItem).toHaveCount(3);
      await expect(selectedListItem.nth(0)).toContainText("item1");
      await expect(selectedListItem.nth(1)).toContainText("item2");
      await expect(selectedListItem.nth(2)).toContainText("item3");

      await getVisibleListItemByText(page, "item1").click();
      await getVisibleListItemByText(page, "item2").click();
      await getVisibleListItemByText(page, "item3").click();
      await expect(selectedItems).toHaveCount(0);
      await expect(selectedListItem).toHaveCount(0);

      await getVisibleListItemByText(page, "item1").click();
      await getVisibleListItemByText(page, "item2").click();
      await getVisibleListItemByText(page, "item3").click();
      await expect(selectedItems).toHaveCount(3);
      await expect(selectedListItem).toHaveCount(3);
      await expect(selectedListItem.nth(0)).toContainText("item1");
      await expect(selectedListItem.nth(1)).toContainText("item2");
      await expect(selectedListItem.nth(2)).toContainText("item3");
    });

    test("tagbox editing. CloseOnSelect is default", async ({ page }) => {
      await initSurvey(page, framework, jsonCloseOnSelectIsDefault);

      const selectedItems = page.locator(".sv-tagbox__item");
      const questionTagbox = page.locator(".sd-tagbox");
      const deleteItemButton = page.locator(".sd-tagbox-item_clean-button");

      await expect(selectedItems).toHaveCount(0);

      await questionTagbox.click();
      await getVisibleListItemByText(page, "item20").click();
      await getVisibleListItemByText(page, "item10").click();
      await page.keyboard.press("Escape");
      await expect(selectedItems).toHaveCount(2);
      await expect(selectedItems.nth(0)).toContainText("item20");
      await expect(selectedItems.nth(1)).toContainText("item10");

      await selectedItems.first().hover();
      await deleteItemButton.first().click();
      await expect(selectedItems).toHaveCount(1);
      await expect(selectedItems.nth(0)).toContainText("item10");

      await selectedItems.first().hover();
      await deleteItemButton.first().click();
      await expect(selectedItems).toHaveCount(0);
    });

    test("tagbox popup position recalculate", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 600 });

      await initSurvey(page, framework, {
        showQuestionNumbers: false,
        elements: [
          {
            type: "tagbox",
            name: "question1",
            showOtherItem: "true",
            closeOnSelect: "false",
            choices: Array.from({ length: 27 }, (_, i) => `item${i + 1}`)
          }
        ]
      });

      const selectedItems = page.locator(".sv-tagbox__item");
      const questionTagbox = page.locator(".sd-tagbox");
      const popupContainer = page.locator(".sv-popup__container").filter({ visible: true });
      await expect(selectedItems).toHaveCount(0);

      await questionTagbox.click();
      const offsetTop1 = await popupContainer.evaluate((el) => (el as HTMLElement).offsetTop);
      await expect(offsetTop1).toBeGreaterThanOrEqual(170);
      await expect(offsetTop1).toBeLessThanOrEqual(200);

      for (let i = 1; i < 27; i++) {
        await getVisibleListItemByText(page, "item" + i.toString()).click();
      }

      await expect(selectedItems).toHaveCount(26);
      const offsetTop2 = await popupContainer.evaluate((el) => (el as HTMLElement).offsetTop);
      await expect(offsetTop2).toBeGreaterThanOrEqual(240);
      await expect(offsetTop2).toBeLessThanOrEqual(360);
      await page.setViewportSize({ width: 1920, height: 1080 });
    });

    test("tagbox search", async ({ page }) => {
      await initSurvey(page, framework, jsonCloseOnSelectIsTrue);

      const popupContainer = page.locator(".sv-popup__container").filter({ visible: true });
      const listItems = page.locator(".sv-list__item");
      const selectedItems = page.locator(".sv-tagbox__item");
      const questionValueInput = page.locator(".sd-tagbox__value input");
      const questionHint = page.locator(".sd-tagbox__hint");

      await expect(popupContainer).not.toBeVisible();
      await expect(listItems).toHaveCount(28);
      await expect(listItems.filter({ visible: true })).toHaveCount(0);
      await expect(page.locator(".sd-tagbox__filter-string-input").first()).toBeFocused();
      await page.keyboard.press("2");
      await expect(popupContainer).toBeVisible();
      await expect(listItems.filter({ visible: true })).toHaveCount(10);

      await page.keyboard.press("3");
      await expect(listItems.filter({ visible: true })).toHaveCount(1);

      await page.keyboard.press("Enter");
      await expect(selectedItems).toHaveCount(1);
      await expect(selectedItems.nth(0)).toContainText("item23");
      await expect(popupContainer).not.toBeVisible();

      await page.keyboard.press("2");
      await expect(popupContainer).toBeVisible();
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("ArrowDown");
      await expect(listItems.filter({ visible: true })).toHaveCount(10);

      await page.keyboard.press("Enter");
      await expect(selectedItems).toHaveCount(2);
      await expect(selectedItems.nth(0)).toContainText("item23");
      await expect(selectedItems.nth(1)).toContainText("item20");
      await expect(popupContainer).not.toBeVisible();

      await page.keyboard.press("4");
      await page.keyboard.press("5");
      await page.keyboard.press("Backspace");
      await page.keyboard.press("Backspace");
      await page.keyboard.press("Backspace");
      await expect(selectedItems).toHaveCount(1);
      await expect(selectedItems.nth(0)).toContainText("item23");
      await expect(popupContainer).toBeVisible();

      await page.keyboard.press("Escape");
      await expect(popupContainer).not.toBeVisible();
      await expect(selectedItems).toHaveCount(1);
      await expect(selectedItems.nth(0)).toContainText("item23");

      await page.keyboard.press("1");
      await page.keyboard.press("4");
      await expect(await questionHint.innerText()).toBe("item");
      await expect(await questionValueInput.inputValue()).toBe("14");
      await page.keyboard.press("Tab");
      await expect(popupContainer).not.toBeVisible();
      await expect(await questionHint.innerText()).toBe("");
      await expect(await questionValueInput.inputValue()).toBe("");
      await expect(selectedItems).toHaveCount(2);
      await expect(selectedItems.nth(0)).toContainText("item23");
      await expect(selectedItems.nth(1)).toContainText("item14");
    });

    test("Check tagbox key press", async ({ page }) => {
      await initSurvey(page, framework, jsonCloseOnSelectIsTrue);

      const popupContainer = page.locator(".sv-popup__container").filter({ visible: true });
      const listItems = page.locator(".sv-list__item");
      const selectedItems = page.locator(".sv-tagbox__item");

      await expect(popupContainer).not.toBeVisible();
      await expect(listItems).toHaveCount(28);
      await expect(listItems.filter({ visible: true })).toHaveCount(0);
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("Enter");
      await expect(selectedItems.nth(0)).toContainText("item4");

      await page.waitForTimeout(100);
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("Enter");
      await expect(selectedItems.nth(0)).toContainText("item4");
      await expect(selectedItems.nth(1)).toContainText("item7");
    });

    test("tagbox search. CloseOnSelect is default", async ({ page }) => {
      await initSurvey(page, framework, jsonCloseOnSelectIsDefault);

      const popupContainer = page.locator(".sv-popup__container").filter({ visible: true });
      const listItems = page.locator(".sv-list__item");
      const selectedItems = page.locator(".sv-tagbox__item");
      const questionValueInput = page.locator(".sd-tagbox__value input");
      const questionHint = page.locator(".sd-tagbox__hint");

      await expect(popupContainer).not.toBeVisible();
      await expect(listItems).toHaveCount(28);
      await expect(listItems.filter({ visible: true })).toHaveCount(0);

      await expect(page.locator(".sd-tagbox__filter-string-input").first()).toBeFocused();
      await page.keyboard.press("2");
      await expect(popupContainer).toBeVisible();
      await expect(listItems.filter({ visible: true })).toHaveCount(10);

      await page.keyboard.press("3");
      await expect(listItems.filter({ visible: true })).toHaveCount(1);

      await page.keyboard.press("Enter");
      await expect(selectedItems).toHaveCount(1);
      await expect(selectedItems.nth(0)).toContainText("item23");
      await expect(popupContainer).toBeVisible();

      await page.keyboard.press("2");
      await expect(popupContainer).toBeVisible();
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("ArrowDown");
      await expect(listItems.filter({ visible: true })).toHaveCount(10);

      await page.keyboard.press("Enter");
      await expect(selectedItems).toHaveCount(2);
      await expect(selectedItems.nth(0)).toContainText("item23");
      await expect(selectedItems.nth(1)).toContainText("item20");
      await expect(popupContainer).toBeVisible();

      await page.keyboard.press("4");
      await page.keyboard.press("5");
      await page.keyboard.press("Backspace");
      await page.keyboard.press("Backspace");
      await page.keyboard.press("Backspace");
      await expect(selectedItems).toHaveCount(1);
      await expect(selectedItems.nth(0)).toContainText("item23");
      await expect(popupContainer).toBeVisible();

      await page.keyboard.press("Escape");
      await expect(popupContainer).not.toBeVisible();
      await expect(selectedItems).toHaveCount(1);
      await expect(selectedItems.nth(0)).toContainText("item23");

      await page.keyboard.press("1");
      await page.keyboard.press("4");
      await expect(await questionHint.innerText()).toBe("item");
      await expect(await questionValueInput.inputValue()).toBe("14");

      await page.keyboard.press("Tab");
      await expect(await questionHint.innerText()).toBe("");
      await expect(await questionValueInput.inputValue()).toBe("");
      await expect(popupContainer).not.toBeVisible();
      await expect(selectedItems).toHaveCount(2);
      await expect(selectedItems.nth(0)).toContainText("item23");
      await expect(selectedItems.nth(1)).toContainText("item14");
    });

    test("Check tagbox key press. CloseOnSelect is default", async ({ page }) => {
      await initSurvey(page, framework, jsonCloseOnSelectIsDefault);

      const popupContainer = page.locator(".sv-popup__container").filter({ visible: true });
      const listItems = page.locator(".sv-list__item");
      const selectedItems = page.locator(".sv-tagbox__item");

      await expect(popupContainer).not.toBeVisible();
      await expect(listItems).toHaveCount(28);
      await expect(listItems.filter({ visible: true })).toHaveCount(0);

      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("Enter");
      await expect(selectedItems.nth(0)).toContainText("item4");

      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("Enter");
      await expect(selectedItems.nth(0)).toContainText("item4");
      await expect(selectedItems.nth(1)).toContainText("item7");
    });

    test("check tagbox after navigating between pages", async ({ page }) => {
      const json = {
        "autoFocusFirstQuestion": false,
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "tagbox",
                "name": "question1",
                "choices": [1, 2, 3, 4, 5]
              }
            ]
          },
          {
            "name": "page2",
            "elements": [
              {
                "type": "tagbox",
                "name": "question3",
                "choices": ["Item 1", "Item 2", "Item 3"]
              }
            ]
          }
        ],
        "showCompletePage": false,
        "showQuestionNumbers": "off",
        "showProgressBar": true,
        "progressBarLocation": "top",
        "checkErrorsMode": "onComplete",
      };
      await initSurvey(page, framework, json);

      const popupContainer = page.locator(".sv-popup__container").filter({ visible: true });
      const selectedItems = page.locator(".sv-tagbox__item");
      const questionTagbox = page.locator(".sd-tagbox");

      await expect(popupContainer).not.toBeAttached();

      await questionTagbox.click();
      await getVisibleListItemByText(page, "3").click();
      await page.keyboard.press("Escape");
      await expect(popupContainer).not.toBeAttached();

      await page.locator(".sd-navigation__next-btn").click();
      await page.locator(".sd-navigation__prev-btn").click();
      await expect(popupContainer).not.toBeAttached();

      await questionTagbox.click();
      await expect(popupContainer).toBeAttached();
      await page.keyboard.press("Escape");
      await expect(selectedItems).toHaveCount(1);

      await page.locator(".sd-editor-clean-button").click();
      await expect(selectedItems).toHaveCount(0);
    });

    test("Check default value", async ({ page }) => {
      await initSurvey(page, framework, {
        "elements": [
          {
            "type": "tagbox",
            "isRequired": true,
            "choicesByUrl": {
              "url": "http://127.0.0.1:8080/test-resources/countriesMock.json",
              path: "RestResponse;result",
              valueName: "name"
            },
            "name": "countries",
            "defaultValue": ["Cuba", "Romania"],
          }
        ],
      });

      const selectedItems = page.locator(".sv-tagbox__item");
      const questionTagbox = page.locator(".sd-tagbox");

      await expect(selectedItems).toHaveCount(2);
      await expect(selectedItems.nth(0)).toContainText("Cuba");
      await expect(selectedItems.nth(1)).toContainText("Romania");

      await questionTagbox.click();
      await getVisibleListItemByText(page, "United States").click();
      await page.keyboard.press("Escape");
      await expect(selectedItems).toHaveCount(3);
      await expect(selectedItems.nth(0)).toContainText("Cuba");
      await expect(selectedItems.nth(1)).toContainText("Romania");
      await expect(selectedItems.nth(2)).toContainText("United States");
    });

    test("Check popup height with lazy loading", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 900 });

      const json = {
        autoFocusFirstQuestion: true,
        elements: [
          {
            type: "tagbox",
            name: "country",
            title: "Select the country...",
            closeOnSelect: true,
            choicesLazyLoadEnabled: true
          }, {
            type: "checkbox",
            name: "question1",
            choices: ["item1", "item2", "item3", "item4", "item5", "item6"]
          }, {
            type: "tagbox",
            name: "kids",
            title: "tagbox page 30",
            closeOnSelect: true,
            choicesLazyLoadEnabled: true,
            choicesLazyLoadPageSize: 30
          }
        ]
      };
      await initSurvey(page, framework, json, false, undefined, async () => {
        await page.evaluate(() => {
          window["survey"].onChoicesLazyLoad.add((_, opt) => {
            var getNumberArray = (skip = 1, count = 25) => {
              const result: Array<any> = [];
              for (let index = skip; index < (skip + count); index++) {
                result.push(index);
              }
              return result;
            };

            const total = 55;
            setTimeout(() => {
              if (opt.skip + opt.take < total) {
                opt.setItems(getNumberArray(opt.skip + 1, opt.take), total);
              } else {
                opt.setItems(getNumberArray(opt.skip + 1, total - opt.skip), total);
              }
            }, 500);
          });
        });
      });

      const popupContainer = page.locator(".sv-popup__container");
      const tagbox1 = popupContainer.nth(0);
      const tagbox2 = popupContainer.nth(1);
      const listItems = page.locator(".sv-list__item span");
      const tagboxQuestion2 = page.locator(".sd-tagbox").nth(1);

      await expect(page.locator(".sd-tagbox__filter-string-input").first()).toBeFocused();
      await page.keyboard.press("ArrowDown");
      await expect(tagbox1.locator(".sv-list__empty-container")).toBeVisible();
      const offsetHeight1 = await tagbox1.locator(".sv-popup__scrolling-content").evaluate((el) => (el as HTMLElement).offsetHeight);
      await expect(offsetHeight1).toBe(singleListItemHeight);
      await expect(listItems.filter({ visible: true })).toHaveCount(0);

      await page.waitForTimeout(500);
      await expect(tagbox1.locator(".sv-list__empty-container")).not.toBeVisible();
      const offsetTop1 = await tagbox1.evaluate((el) => (el as HTMLElement).offsetTop);
      await expect(offsetTop1).toBeLessThan(200);
      const offsetHeight2 = await tagbox1.locator(".sv-popup__scrolling-content").evaluate((el) => (el as HTMLElement).offsetHeight);
      await expect(offsetHeight2).toBeGreaterThanOrEqual(688);
      await expect(offsetHeight2).toBeLessThanOrEqual(708);
      const scrollTop1 = await tagbox1.locator(".sv-list").evaluate((el) => (el as HTMLElement).scrollTop);
      await expect(scrollTop1).toBe(0);
      const scrollHeight1 = await tagbox1.locator(".sv-list").evaluate((el) => (el as HTMLElement).scrollHeight);
      await expect(scrollHeight1).toBeGreaterThanOrEqual(1208);
      await expect(scrollHeight1).toBeLessThanOrEqual(1308);
      await expect(listItems.filter({ visible: true })).toHaveCount(26);

      await tagbox1.locator(".sv-list").evaluate((el) => { el.scrollTop = 1000; });
      await page.waitForTimeout(1000);
      const offsetTop2 = await tagbox1.evaluate((el) => (el as HTMLElement).offsetTop);
      await expect(offsetTop2).toBeLessThan(200);
      const offsetHeight3 = await tagbox1.locator(".sv-popup__scrolling-content").evaluate((el) => (el as HTMLElement).offsetHeight);
      await expect(offsetHeight3).toBeGreaterThanOrEqual(688);
      await expect(offsetHeight3).toBeLessThanOrEqual(708);
      const scrollTop2 = await tagbox1.locator(".sv-list").evaluate((el) => (el as HTMLElement).scrollTop);
      await expect(scrollTop2).toBeGreaterThanOrEqual(546);
      await expect(scrollTop2).toBeLessThanOrEqual(556);
      const scrollHeight2 = await tagbox1.locator(".sv-list").evaluate((el) => (el as HTMLElement).scrollHeight);
      await expect(scrollHeight2).toBeGreaterThanOrEqual(2408);
      await expect(scrollHeight2).toBeLessThanOrEqual(2508);
      await expect(listItems.filter({ visible: true })).toHaveCount(51);

      await tagbox1.locator(".sv-list").evaluate((el) => { el.scrollTop = 2300; });
      await page.waitForTimeout(1000);
      const offsetTop3 = await tagbox1.evaluate((el) => (el as HTMLElement).offsetTop);
      await expect(offsetTop3).toBeLessThan(200);
      const offsetHeight4 = await tagbox1.locator(".sv-popup__scrolling-content").evaluate((el) => (el as HTMLElement).offsetHeight);
      await expect(offsetHeight4).toBeGreaterThanOrEqual(688);
      await expect(offsetHeight4).toBeLessThanOrEqual(708);
      const scrollTop3 = await tagbox1.locator(".sv-list").evaluate((el) => (el as HTMLElement).scrollTop);
      await expect(scrollTop3).toBeGreaterThanOrEqual(1696);
      await expect(scrollTop3).toBeLessThanOrEqual(1796);
      const scrollHeight3 = await tagbox1.locator(".sv-list").evaluate((el) => (el as HTMLElement).scrollHeight);
      await expect(scrollHeight3).toBeGreaterThanOrEqual(2608);
      await expect(scrollHeight3).toBeLessThanOrEqual(2708);
      await expect(listItems.filter({ visible: true })).toHaveCount(55);

      await getVisibleListItemByText(page, "55").click();
      await page.waitForTimeout(500);
      await tagboxQuestion2.click();
      await expect(tagbox2.locator(".sv-list__empty-container")).toBeVisible();
      const offsetHeight5 = await tagbox2.locator(".sv-popup__scrolling-content").evaluate((el) => (el as HTMLElement).offsetHeight);
      await expect(offsetHeight5).toBe(singleListItemHeight);
      await expect(listItems.filter({ visible: true })).toHaveCount(0);

      await page.waitForTimeout(500);
      await expect(tagbox2.locator(".sv-list__empty-container")).not.toBeVisible();
      const offsetTop4 = await tagbox2.evaluate((el) => (el as HTMLElement).offsetTop);
      await expect(offsetTop4).toBe(0);
      const offsetHeight6 = await tagbox2.locator(".sv-popup__scrolling-content").evaluate((el) => (el as HTMLElement).offsetHeight);
      await expect(offsetHeight6).toBeGreaterThanOrEqual(716);
      await expect(offsetHeight6).toBeLessThanOrEqual(726);
      const scrollTop4 = await tagbox2.locator(".sv-list").evaluate((el) => (el as HTMLElement).scrollTop);
      await expect(scrollTop4).toBe(0);
      const scrollHeight4 = await tagbox2.locator(".sv-list").evaluate((el) => (el as HTMLElement).scrollHeight);
      await expect(scrollHeight4).toBeGreaterThanOrEqual(1358);
      await expect(scrollHeight4).toBeLessThanOrEqual(1508);
      await expect(listItems.filter({ visible: true })).toHaveCount(31);

      await tagbox2.locator(".sv-list").evaluate((el) => { el.scrollTop = 1000; });
      await page.waitForTimeout(1000);
      await expect(tagbox2.locator(".sv-list__empty-container")).not.toBeVisible();
      const offsetTop5 = await tagbox2.evaluate((el) => (el as HTMLElement).offsetTop);
      await expect(offsetTop5).toBe(0);
      const offsetHeight7 = await tagbox2.locator(".sv-popup__scrolling-content").evaluate((el) => (el as HTMLElement).offsetHeight);
      await expect(offsetHeight7).toBeGreaterThanOrEqual(716);
      await expect(offsetHeight7).toBeLessThanOrEqual(726);
      const scrollTop5 = await tagbox2.locator(".sv-list").evaluate((el) => (el as HTMLElement).scrollTop);
      await expect(scrollTop5).toBeGreaterThanOrEqual(746);
      await expect(scrollTop5).toBeLessThanOrEqual(846);
      const scrollHeight5 = await tagbox2.locator(".sv-list").evaluate((el) => (el as HTMLElement).scrollHeight);
      await expect(scrollHeight5).toBeGreaterThanOrEqual(2608);
      await expect(scrollHeight5).toBeLessThanOrEqual(2658);
      await expect(listItems.filter({ visible: true })).toHaveCount(55);
      await getVisibleListItemByText(page, "55").click();

      await page.setViewportSize({ width: 1280, height: 1100 });
    });

    test("Check popup height and position while searching", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      const json = {
        autoFocusFirstQuestion: true,
        elements: [
          {
            type: "tagbox",
            name: "country",
            title: "Select the country...",
            closeOnSelect: true,
            choices: Array.from({ length: 27 }, (_, i) => `item${i + 1}`)
          }, {
            type: "checkbox",
            name: "question1",
            choices: Array.from({ length: 6 }, (_, i) => `item${i + 1}`)
          }, {
            type: "tagbox",
            name: "kids",
            title: "tagbox page 30",
            closeOnSelect: true,
            choices: Array.from({ length: 27 }, (_, i) => `item${i + 1}`)
          }
        ]
      };
      await initSurvey(page, framework, json);

      const popupContainer = page.locator(".sv-popup__container");
      const tagbox1 = popupContainer.nth(0);
      const tagbox2 = popupContainer.nth(1);
      const listItems = page.locator(".sv-list__item span");
      const tagboxQuestion2 = page.locator(".sd-tagbox").nth(1);

      await expect(page.locator(".sd-tagbox__filter-string-input").first()).toBeFocused();
      await page.keyboard.press("2");
      await expect(tagbox1).toBeVisible();
      await expect(listItems.filter({ visible: true })).toHaveCount(10);
      await expect(tagbox1.locator(".sv-list__empty-container")).not.toBeVisible();
      const offsetTop1 = await tagbox1.evaluate((el) => (el as HTMLElement).offsetTop);
      await expect(offsetTop1).toBe(questionOffsetTopConst);
      const offsetHeight1 = await tagbox1.locator(".sv-popup__scrolling-content").evaluate((el) => (el as HTMLElement).offsetHeight);
      await expect(offsetHeight1).toBeGreaterThanOrEqual(485);
      await expect(offsetHeight1).toBeLessThanOrEqual(495);

      await page.keyboard.press("3");
      await expect(listItems.filter({ visible: true })).toHaveCount(1);
      await expect(tagbox1.locator(".sv-list__empty-container")).not.toBeVisible();
      const offsetTop2 = await tagbox1.evaluate((el) => (el as HTMLElement).offsetTop);
      await expect(offsetTop2).toBe(questionOffsetTopConst);
      const offsetHeight2 = await tagbox1.locator(".sv-popup__scrolling-content").evaluate((el) => (el as HTMLElement).offsetHeight);
      await expect(offsetHeight2).toBe(singleListItemHeight);

      await page.keyboard.press("Enter");
      await expect(tagbox1).not.toBeVisible();

      await tagboxQuestion2.click();
      await page.keyboard.press("2");
      await expect(tagbox2).toBeVisible();
      await expect(listItems.filter({ visible: true })).toHaveCount(10);
      await expect(tagbox2.locator(".sv-list__empty-container")).not.toBeVisible();
      const offsetTop3 = await tagbox2.evaluate((el) => (el as HTMLElement).offsetTop);
      await expect(offsetTop3).toBeGreaterThanOrEqual(228);
      await expect(offsetTop3).toBeLessThanOrEqual(238);
      const offsetHeight3 = await tagbox2.locator(".sv-popup__scrolling-content").evaluate((el) => (el as HTMLElement).offsetHeight);
      await expect(offsetHeight3).toBeGreaterThanOrEqual(480);
      await expect(offsetHeight3).toBeLessThanOrEqual(490);

      await page.keyboard.press("3");
      await expect(listItems.filter({ visible: true })).toHaveCount(1);
      await expect(tagbox2.locator(".sv-list__empty-container")).not.toBeVisible();
      const offsetTop4 = await tagbox2.evaluate((el) => (el as HTMLElement).offsetTop);
      await expect(offsetTop4).toBe(768);
      const offsetHeight4 = await tagbox2.locator(".sv-popup__scrolling-content").evaluate((el) => (el as HTMLElement).offsetHeight);
      await expect(offsetHeight4).toBe(singleListItemHeight);

      await page.keyboard.press("Enter");
      await expect(tagbox2).not.toBeVisible();

      await page.setViewportSize({ width: 1280, height: 1100 });
    });

    test("Check popup height with lazy loading, if closeOnSelect is false", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 900 });

      const json = {
        autoFocusFirstQuestion: true,
        elements: [
          {
            type: "tagbox",
            name: "country",
            title: "Select the country...",
            closeOnSelect: false,
            choicesLazyLoadEnabled: true
          }, {
            type: "checkbox",
            name: "question1",
            choices: [
              "item1",
              "item2",
              "item3",
              "item4",
              "item5",
              "item6"
            ]
          }, {
            type: "tagbox",
            name: "kids",
            title: "tagbox page 30",
            closeOnSelect: false,
            choicesLazyLoadEnabled: true,
            choicesLazyLoadPageSize: 30
          }
        ]
      };
      await initSurvey(page, framework, json, false, undefined, async () => {
        await page.evaluate(() => {
          window["survey"].onChoicesLazyLoad.add((_, opt) => {
            var getNumberArray = (skip = 1, count = 25) => {
              const result: Array<any> = [];
              for (let index = skip; index < (skip + count); index++) {
                result.push(index);
              }
              return result;
            };

            const total = 55;
            setTimeout(() => {
              if (opt.skip + opt.take < total) {
                opt.setItems(getNumberArray(opt.skip + 1, opt.take), total);
              } else {
                opt.setItems(getNumberArray(opt.skip + 1, total - opt.skip), total);
              }
            }, 500);
          });
        });
      });

      const popupContainer = page.locator(".sv-popup__container");
      const tagbox1 = popupContainer.nth(0);
      const tagbox2 = popupContainer.nth(1);
      const listItems = page.locator(".sv-list__item span");
      const tagboxQuestion2 = page.locator(".sd-tagbox").nth(1);

      await expect(page.locator(".sd-tagbox__filter-string-input").first()).toBeFocused();
      await page.keyboard.press("ArrowDown");
      await expect(tagbox1.locator(".sv-list__empty-container")).toBeVisible();
      const offsetHeight1 = await tagbox1.locator(".sv-popup__scrolling-content").evaluate((el) => (el as HTMLElement).offsetHeight);
      await expect(offsetHeight1).toBe(singleListItemHeight);
      await expect(listItems.filter({ visible: true })).toHaveCount(0);

      await page.waitForTimeout(500);
      await expect(tagbox1.locator(".sv-list__empty-container")).not.toBeVisible();
      const offsetTop1 = await tagbox1.evaluate((el) => (el as HTMLElement).offsetTop);
      await expect(offsetTop1).toBeLessThan(200);
      const offsetHeight2 = await tagbox1.locator(".sv-popup__scrolling-content").evaluate((el) => (el as HTMLElement).offsetHeight);
      await expect(offsetHeight2).toBeGreaterThanOrEqual(688);
      await expect(offsetHeight2).toBeLessThanOrEqual(708);
      const scrollTop1 = await tagbox1.locator(".sv-list").evaluate((el) => (el as HTMLElement).scrollTop);
      await expect(scrollTop1).toBe(0);
      const scrollHeight1 = await tagbox1.locator(".sv-list").evaluate((el) => (el as HTMLElement).scrollHeight);
      await expect(scrollHeight1).toBeGreaterThanOrEqual(1208);
      await expect(scrollHeight1).toBeLessThanOrEqual(1308);
      await expect(listItems.filter({ visible: true })).toHaveCount(26);

      await tagbox1.locator(".sv-list").evaluate((el) => { el.scrollTop = 1000; });
      await page.waitForTimeout(1000);
      const offsetTop2 = await tagbox1.evaluate((el) => (el as HTMLElement).offsetTop);
      await expect(offsetTop2).toBeLessThan(200);
      const offsetHeight3 = await tagbox1.locator(".sv-popup__scrolling-content").evaluate((el) => (el as HTMLElement).offsetHeight);
      await expect(offsetHeight3).toBeGreaterThanOrEqual(688);
      await expect(offsetHeight3).toBeLessThanOrEqual(708);
      const scrollTop2 = await tagbox1.locator(".sv-list").evaluate((el) => (el as HTMLElement).scrollTop);
      await expect(scrollTop2).toBeGreaterThanOrEqual(546);
      await expect(scrollTop2).toBeLessThanOrEqual(556);
      const scrollHeight2 = await tagbox1.locator(".sv-list").evaluate((el) => (el as HTMLElement).scrollHeight);
      await expect(scrollHeight2).toBeGreaterThanOrEqual(2408);
      await expect(scrollHeight2).toBeLessThanOrEqual(2508);
      await expect(listItems.filter({ visible: true })).toHaveCount(51);

      await tagbox1.locator(".sv-list").evaluate((el) => { el.scrollTop = 2300; });
      await page.waitForTimeout(1000);
      const offsetTop3 = await tagbox1.evaluate((el) => (el as HTMLElement).offsetTop);
      await expect(offsetTop3).toBeLessThan(200);
      const offsetHeight4 = await tagbox1.locator(".sv-popup__scrolling-content").evaluate((el) => (el as HTMLElement).offsetHeight);
      await expect(offsetHeight4).toBeGreaterThanOrEqual(688);
      await expect(offsetHeight4).toBeLessThanOrEqual(708);
      const scrollTop3 = await tagbox1.locator(".sv-list").evaluate((el) => (el as HTMLElement).scrollTop);
      await expect(scrollTop3).toBeGreaterThanOrEqual(1696);
      await expect(scrollTop3).toBeLessThanOrEqual(1796);
      const scrollHeight3 = await tagbox1.locator(".sv-list").evaluate((el) => (el as HTMLElement).scrollHeight);
      await expect(scrollHeight3).toBeGreaterThanOrEqual(2608);
      await expect(scrollHeight3).toBeLessThanOrEqual(2708);
      await expect(listItems.filter({ visible: true })).toHaveCount(55);

      await getVisibleListItemByText(page, "55").click();
      await page.keyboard.press("Escape");
      await tagboxQuestion2.click();
      await expect(tagbox2.locator(".sv-list__empty-container")).toBeVisible();
      const offsetHeight5 = await tagbox2.locator(".sv-popup__scrolling-content").evaluate((el) => (el as HTMLElement).offsetHeight);
      await expect(offsetHeight5).toBe(singleListItemHeight);
      await expect(listItems.filter({ visible: true })).toHaveCount(0);

      await page.waitForTimeout(500);
      await expect(tagbox2.locator(".sv-list__empty-container")).not.toBeVisible();
      const offsetTop4 = await tagbox2.evaluate((el) => (el as HTMLElement).offsetTop);
      await expect(offsetTop4).toBe(0);
      const offsetHeight6 = await tagbox2.locator(".sv-popup__scrolling-content").evaluate((el) => (el as HTMLElement).offsetHeight);
      await expect(offsetHeight6).toBeGreaterThanOrEqual(716);
      await expect(offsetHeight6).toBeLessThanOrEqual(726);
      const scrollTop4 = await tagbox2.locator(".sv-list").evaluate((el) => (el as HTMLElement).scrollTop);
      await expect(scrollTop4).toBe(0);
      const scrollHeight4 = await tagbox2.locator(".sv-list").evaluate((el) => (el as HTMLElement).scrollHeight);
      await expect(scrollHeight4).toBeGreaterThanOrEqual(1358);
      await expect(scrollHeight4).toBeLessThanOrEqual(1508);
      await expect(listItems.filter({ visible: true })).toHaveCount(31);

      await tagbox2.locator(".sv-list").evaluate((el) => { el.scrollTop = 1000; });
      await page.waitForTimeout(1000);
      await expect(tagbox2.locator(".sv-list__empty-container")).not.toBeVisible();
      const offsetTop5 = await tagbox2.evaluate((el) => (el as HTMLElement).offsetTop);
      await expect(offsetTop5).toBe(0);
      const offsetHeight7 = await tagbox2.locator(".sv-popup__scrolling-content").evaluate((el) => (el as HTMLElement).offsetHeight);
      await expect(offsetHeight7).toBeGreaterThanOrEqual(716);
      await expect(offsetHeight7).toBeLessThanOrEqual(726);
      const scrollTop5 = await tagbox2.locator(".sv-list").evaluate((el) => (el as HTMLElement).scrollTop);
      await expect(scrollTop5).toBeGreaterThanOrEqual(746);
      await expect(scrollTop5).toBeLessThanOrEqual(846);
      const scrollHeight5 = await tagbox2.locator(".sv-list").evaluate((el) => (el as HTMLElement).scrollHeight);
      await expect(scrollHeight5).toBeGreaterThanOrEqual(2608);
      await expect(scrollHeight5).toBeLessThanOrEqual(2658);
      await expect(listItems.filter({ visible: true })).toHaveCount(55);
      await getVisibleListItemByText(page, "55").click();

      await page.setViewportSize({ width: 1280, height: 1100 });
    });

    test("Check popup height and position while searching, if closeOnSelect is false", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      const json = {
        autoFocusFirstQuestion: true,
        elements: [
          {
            type: "tagbox",
            name: "country",
            title: "Select the country...",
            closeOnSelect: false,
            choices: Array.from({ length: 27 }, (_, i) => `item${i + 1}`)
          }, {
            type: "checkbox",
            name: "question1",
            choices: Array.from({ length: 6 }, (_, i) => `item${i + 1}`)
          }, {
            type: "tagbox",
            name: "kids",
            title: "tagbox page 30",
            closeOnSelect: false,
            choices: Array.from({ length: 27 }, (_, i) => `item${i + 1}`)
          }
        ]
      };
      await initSurvey(page, framework, json);

      const popupContainer = page.locator(".sv-popup__container");
      const tagbox1 = popupContainer.nth(0);
      const tagbox2 = popupContainer.nth(1);
      const listItems = page.locator(".sv-list__item span");
      const tagboxQuestion2 = page.locator(".sd-tagbox").nth(1);

      await expect(page.locator(".sd-tagbox__filter-string-input").first()).toBeFocused();
      await page.keyboard.press("2");
      await expect(tagbox1).toBeVisible();
      await expect(listItems.filter({ visible: true })).toHaveCount(10);
      await expect(tagbox1.locator(".sv-list__empty-container")).not.toBeVisible();
      const offsetTop1 = await tagbox1.evaluate((el) => (el as HTMLElement).offsetTop);
      await expect(offsetTop1).toBe(questionOffsetTopConst);
      const offsetHeight1 = await tagbox1.locator(".sv-popup__scrolling-content").evaluate((el) => (el as HTMLElement).offsetHeight);
      await expect(offsetHeight1).toBeGreaterThanOrEqual(485);
      await expect(offsetHeight1).toBeLessThanOrEqual(495);

      await page.keyboard.press("3");
      await expect(listItems.filter({ visible: true })).toHaveCount(1);
      await expect(tagbox1.locator(".sv-list__empty-container")).not.toBeVisible();
      const offsetTop2 = await tagbox1.evaluate((el) => (el as HTMLElement).offsetTop);
      await expect(offsetTop2).toBe(questionOffsetTopConst);
      const offsetHeight2 = await tagbox1.locator(".sv-popup__scrolling-content").evaluate((el) => (el as HTMLElement).offsetHeight);
      await expect(offsetHeight2).toBe(singleListItemHeight);

      await page.keyboard.press("Enter");
      await page.keyboard.press("Escape");
      await expect(tagbox1).not.toBeVisible();

      await tagboxQuestion2.click();
      await page.keyboard.press("2");
      await expect(tagbox2).toBeVisible();
      await expect(listItems.filter({ visible: true })).toHaveCount(10);
      await expect(tagbox2.locator(".sv-list__empty-container")).not.toBeVisible();
      const offsetTop3 = await tagbox2.evaluate((el) => (el as HTMLElement).offsetTop);
      await expect(offsetTop3).toBeGreaterThanOrEqual(222);
      await expect(offsetTop3).toBeLessThanOrEqual(232);
      const offsetHeight3 = await tagbox2.locator(".sv-popup__scrolling-content").evaluate((el) => (el as HTMLElement).offsetHeight);
      await expect(offsetHeight3).toBeGreaterThanOrEqual(480);
      await expect(offsetHeight3).toBeLessThanOrEqual(490);

      await page.keyboard.press("3");
      await expect(listItems.filter({ visible: true })).toHaveCount(1);
      await expect(tagbox2.locator(".sv-list__empty-container")).not.toBeVisible();
      const offsetTop4 = await tagbox2.evaluate((el) => (el as HTMLElement).offsetTop);
      await expect(offsetTop4).toBe(768);
      const offsetHeight4 = await tagbox2.locator(".sv-popup__scrolling-content").evaluate((el) => (el as HTMLElement).offsetHeight);
      await expect(offsetHeight4).toBe(singleListItemHeight);

      await page.keyboard.press("Enter");
      await expect(tagbox2).toBeVisible();

      await page.setViewportSize({ width: 1280, height: 1100 });
    });

    test("Check tagbox popup opens after beak click", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 600 });
      const json = {
        elements: [
          {
            type: "tagbox",
            name: "cars",
            title: "Tagbox",
            searchEnabled: false,
            choices: [
              "Ford",
              "Vauxhall",
              "Volkswagen",
              "Nissan",
              "Audi",
              "Mercedes-Benz",
              "BMW",
              "Peugeot",
              "Toyota",
              "Citroen"
            ]
          }
        ]
      };
      await initSurvey(page, framework, json);

      const questionDropdownV2Select = page.locator(".sd-dropdown");
      const popupContainer = page.locator(".sv-popup__container").filter({ visible: true });
      const dropdownWidth = await questionDropdownV2Select.boundingBox().then(box => box?.width || 0);
      await expect(dropdownWidth).toBeGreaterThan(550);
      await expect(popupContainer).not.toBeVisible();

      const box = await questionDropdownV2Select.boundingBox();
      if (box) {
        await page.mouse.click(box.x + box.width - 20, box.y + 20);
      }
      await expect(popupContainer).toBeVisible();

      if (box) {
        await page.mouse.click(box.x + box.width - 20, box.y + 20);
      }
      await expect(popupContainer).not.toBeVisible();

      if (box) {
        await page.mouse.click(box.x + box.width - 20, box.y + 20);
      }
      await expect(popupContainer).toBeVisible();

      await page.mouse.click(600, 20);
      await expect(popupContainer).not.toBeVisible();
    });

    test("Check tagbox popup opens after beak click - search enabled", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 600 });
      const json = {
        elements: [
          {
            type: "tagbox",
            name: "cars",
            title: "Tagbox",
            choices: [
              "Ford",
              "Vauxhall",
              "Volkswagen",
              "Nissan",
              "Audi",
              "Mercedes-Benz",
              "BMW",
              "Peugeot",
              "Toyota",
              "Citroen"
            ]
          }
        ]
      };
      await initSurvey(page, framework, json);

      const questionDropdownV2Select = page.locator(".sd-dropdown");
      const popupContainer = page.locator(".sv-popup__container").filter({ visible: true });
      const dropdownWidth = await questionDropdownV2Select.boundingBox().then(box => box?.width || 0);
      await expect(dropdownWidth).toBeGreaterThan(550);
      await expect(popupContainer).not.toBeVisible();

      const box = await questionDropdownV2Select.boundingBox();
      if (box) {
        await page.mouse.click(box.x + box.width - 20, box.y + 20);
      }
      await expect(popupContainer).toBeVisible();

      if (box) {
        await page.mouse.click(box.x + box.width - 20, box.y + 20);
      }
      await expect(popupContainer).not.toBeVisible();

      if (box) {
        await page.mouse.click(box.x + box.width - 20, box.y + 20);
      }
      await expect(popupContainer).toBeVisible();

      await page.mouse.click(600, 20);
      await expect(popupContainer).not.toBeVisible();
    });
  });
});

