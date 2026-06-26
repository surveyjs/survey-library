import { frameworks, url, initSurvey, getSurveyResult, getQuestionValue, getQuestionJson, setOptions, checkSurveyWithEmptyQuestion, test, expect, getVisibleListItemByText } from "../helper";
import { registerCustomItemComponent } from "../registerCustomComponents";

const title = "Dropdown question";

const questionOffsetTopConst = 176;
const singleListItemHeight = 56;

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      const json = {
        elements: [
          {
            type: "dropdown",
            name: "car",
            title: "What car are you driving?",
            isRequired: true,
            colCount: 0,
            choices: [
              "None",
              "Ford",
              "Vauxhall",
              "Volkswagen",
              "Nissan",
              "Audi",
              "Mercedes-Benz",
              "BMW",
              "Peugeot",
              "Toyota",
              "Citroen",
            ],
          },
          {
            type: "dropdown",
            name: "renderAsSelect",
            renderAs: "select",
            title: "What car are you driving?",
            colCount: 0,
            choices: [
              "None",
              "Ford",
              "Vauxhall",
              "Volkswagen",
              "Nissan",
              "Audi",
              "Mercedes-Benz",
              "BMW",
              "Peugeot",
              "Toyota",
              "Citroen",
            ],
          },
        ],
      };
      await initSurvey(page, framework, json);
    });

    test("choose empty", async ({ page }) => {
      await checkSurveyWithEmptyQuestion(page);
    });

    test("choose value", async ({ page }) => {
      await page.locator(".sd-dropdown").first().click();
      await getVisibleListItemByText(page, "Nissan").click();
      await page.locator(".sd-navigation__complete-btn").click();

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult.car).toEqual("Nissan");
    });

    test("change choices order render as select", async ({ page }) => {
      const questionName = "renderAsSelect";
      const getFirst = page.locator("select option").nth(1);
      const getSecond = page.locator("select option").nth(2);
      let rnd_count = 0;
      let first, first_2;

      // asc
      await setOptions(page, questionName, { choicesOrder: "asc" });
      await expect(getFirst).toHaveText("Audi");
      await expect(getSecond).toHaveText("BMW");

      // desc
      await setOptions(page, questionName, { choicesOrder: "desc" });
      await expect(getFirst).toHaveText("Volkswagen");
      await expect(getSecond).toHaveText("Vauxhall");

      // rnd
      await expect(page.locator("select option")).not.toHaveCount(1); // "need to more than one choices"

      first = await getFirst.textContent();
      for (let i = 0; i < 15; i++) {
        await setOptions(page, questionName, { choicesOrder: "asc" });
        await setOptions(page, questionName, { choicesOrder: "random" });
        await page.evaluate(() => {
          return (window as any).survey.randomSeed = Date.now() + Math.random();
        });
        first_2 = await getFirst.textContent();

        if (first?.trim() !== first_2?.trim()) {
          rnd_count++;
        }

        first = first_2;

        if (rnd_count >= 4) {
          break;
        }
      }

      expect(rnd_count).toBeGreaterThanOrEqual(4); // because of 'none', 'asc', 'desc' and if 4 it is really rnd
    });

    test("change choices order", async ({ page }) => {
      const firstItem = page.locator(".sv-list__item span").nth(0);
      const secondItem = page.locator(".sv-list__item span").nth(1);

      // asc
      await setOptions(page, "car", { choicesOrder: "asc" });
      await page.locator(".sd-dropdown").first().click();
      await expect(firstItem).toHaveText("Audi");
      await expect(secondItem).toHaveText("BMW");

      // desc
      await setOptions(page, "car", { choicesOrder: "desc" });
      await expect(firstItem).toHaveText("Volkswagen");
      await expect(secondItem).toHaveText("Vauxhall");

      // rnd
      await expect(page.locator(".sv-list__item span")).not.toHaveCount(1); // "need to more than one choices"

      let rnd_count = 0;
      let prevFirstItemValue = await page.locator(".sv-list__item span").nth(0).textContent();
      let firstItemValueCurrent;
      for (let i = 0; i < 15; i++) {
        await setOptions(page, "car", { choicesOrder: "asc" });
        await setOptions(page, "car", { choicesOrder: "random" });
        await page.evaluate(() => {
          return (window as any).survey.randomSeed = Date.now() + Math.random();
        });
        firstItemValueCurrent = await page.locator(".sv-list__item span").nth(0).textContent();

        if (prevFirstItemValue?.trim() !== firstItemValueCurrent?.trim()) {
          rnd_count++;
        }

        prevFirstItemValue = firstItemValueCurrent;

        if (rnd_count >= 4) {
          break;
        }
      }

      expect(rnd_count).toBeGreaterThanOrEqual(4); // because of 'none', 'asc', 'desc' and if 4 it is really rnd
    });

    test("check integrity", async ({ page }) => {
      const choices = [
        "None",
        "Ford",
        "Vauxhall",
        "Volkswagen",
        "Nissan",
        "Audi",
        "Mercedes-Benz",
        "BMW",
        "Peugeot",
        "Toyota",
        "Citroen",
      ];
      let checkIntegrity = async (page) => {
        await page.locator(".sd-dropdown").first().click();
        await expect(page.locator(".sv-list__item span")).toHaveCount(choices.length);
        await page.locator(".sd-dropdown").first().click();

        for (let i = 0; i < choices.length; i++) {
          await page.locator(".sd-dropdown").first().click();
          await page.locator(".sv-list__item span").nth(i).click();
        }
      };

      await setOptions(page, "car", { choicesOrder: "asc" });
      await checkIntegrity(page);

      await setOptions(page, "car", { value: null });
      await setOptions(page, "car", { choicesOrder: "desc" });
      await checkIntegrity(page);

      await setOptions(page, "car", { value: null });
      await setOptions(page, "car", { choicesOrder: "random" });
      await checkIntegrity(page);
    });

    test("show \"other\" choice", async ({ page }) => {
      await page.locator(".sd-dropdown").first().click();
      await expect(page.locator(".sv-list__item span")).toHaveCount(11);

      await setOptions(page, "car", { hasOther: true, otherText: "Other" });
      await page.locator(".sd-dropdown").first().click();
      await expect(page.locator(".sv-list__item span")).toHaveCount(12);
      await expect(page.locator(".sv-list__item span").nth(11)).toContainText("Other");
    });

    test("check \"other\" choice doesn't change order", async ({ page }) => {
      await setOptions(page, "car", { hasOther: true, otherText: "Other" });
      await page.locator(".sd-dropdown").first().click();
      await expect(page.locator(".sv-list__item span").nth(11)).toHaveText("Other");

      await setOptions(page, "car", { choicesOrder: "desc" });
      await expect(page.locator(".sv-list__item span").nth(11)).toHaveText("Other");
    });

    test("choose other", async ({ page }) => {
      await setOptions(page, "car", { hasOther: true, otherText: "Other" });
      await page.locator(".sd-dropdown").first().click();
      await getVisibleListItemByText(page, "Other").click();
      await page.locator("textarea").fill("Zaporozec");
      await page.locator(".sd-navigation__complete-btn").click();

      let surveyResult = await getSurveyResult(page);
      expect(surveyResult.car).toEqual("other");
      expect(surveyResult["car-Comment"]).toEqual("Zaporozec");
    });
  });
});

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("open popup and blur", async ({ page }) => {
      const json = {
        elements: [
          {
            type: "dropdown",
            name: "car",
            title: "What car are you driving?",
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
              "Citroen",
            ],
          },
        ],
      };
      await initSurvey(page, framework, json);

      await page.locator(".sd-dropdown").click();
      await page.locator(".sd-dropdown").click();
      await expect(page.locator(".sd-dropdown__value input")).toHaveAttribute("placeholder", "Select...");
      await expect(page.locator(".sd-dropdown__value .sv-string-viewer")).not.toBeVisible();
    });

    test("open popup and click outside, tablet", async ({ page }) => {
      await page.evaluate(() => {
        window["Survey"]._setIsTouch(true);
      });
      await page.setViewportSize({ width: 750, height: 900 });
      const json = {
        elements: [
          {
            type: "dropdown",
            name: "car",
            title: "What car are you driving?",
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
              "Citroen",
            ],
          },
        ],
      };
      await initSurvey(page, framework, json);

      await page.locator(".sd-dropdown").click();
      await expect(page.locator(".sv-popup--menu-tablet")).toBeVisible();
      await page.locator(".sv-popup--menu-tablet").click({ position: { x: 10, y: 10 } });
      await expect(page.locator(".sv-popup--menu-tablet")).not.toBeVisible();
    });

    test("open dropdown and click outside, tablet", async ({ page }) => {
      await page.evaluate(() => {
        window["Survey"]._setIsTouch(true);
      });
      await page.setViewportSize({ width: 750, height: 900 });
      const json = {
        elements: [
          {
            type: "dropdown",
            name: "car",
            title: "What car are you driving?",
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
              "Citroen",
            ],
          },
        ],
      };
      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        window["survey"].onOpenDropdownMenu.add((_, options) => {
          options.menuType = "dropdown";
        });
        window["survey"].fromJSON(json);
      }, json);

      await page.locator(".sd-dropdown").click();
      await expect(page.locator(".sv-popup__container")).toBeVisible();
      await page.locator(".sd-root-modern").click({ position: { x: 10, y: 10 } });
      await expect(page.locator(".sv-popup__container")).not.toBeVisible();
    });

    test("click on question title state editable", async ({ page }) => {
      const json = {
        elements: [
          {
            type: "dropdown",
            name: "car",
            title: "What car are you driving?",
            isRequired: true,
            colCount: 0,
            choices: [
              "None",
              "Ford",
              "Vauxhall",
              "Volkswagen",
              "Nissan",
              "Audi",
              "Mercedes-Benz",
              "BMW",
              "Peugeot",
              "Toyota",
              "Citroen",
            ],
          },
        ],
      };
      await initSurvey(page, framework, json, true);

      const newTitle = "MyText";
      let questionJson = JSON.parse(await getQuestionJson(page));
      let questionValue = await getQuestionValue(page);
      expect(questionValue).toBe(undefined);

      const outerSelector = ".sd-question__title";
      const innerSelector = ".sv-string-editor";
      await page.locator(outerSelector).click();
      await page.locator(outerSelector + " " + innerSelector).fill(newTitle);
      await page.locator("body").click({ position: { x: 0, y: 0 } });

      questionValue = await getQuestionValue(page);
      expect(questionValue).toBe(undefined);

      questionJson = JSON.parse(await getQuestionJson(page));
      expect(questionJson.title).toEqual(newTitle);
    });

    test("otherText changed", async ({ page }) => {
      const oldOtherText = "Other (describe)";
      const newOtherText = "New Other";
      const json = {
        title: "Survey New Design Test",
        description: "Survey Description",
        logoPosition: "left",
        elements: [
          {
            type: "dropdown",
            renderAs: "select",
            name: "car",
            title: "Dropdown render as",
            hasOther: true,
            showOptionsCaption: false,
            colCount: 4,
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
          },
          {
            type: "dropdown",
            name: "carss",
            title: "Dropdown",
            hasOther: true,
            colCount: 4,
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
          },
        ]
      };
      await initSurvey(page, framework, json);

      await expect(page.locator("select option").nth(10)).toHaveText(oldOtherText);
      await setOptions(page, "car", { otherText: newOtherText });
      await expect(page.locator("select option").nth(10)).toHaveText(newOtherText);

      await page.locator(".sd-dropdown").nth(1).click();
      await expect(page.locator(".sv-list__item span").nth(10)).toHaveText(oldOtherText);
      await setOptions(page, "carss", { otherText: newOtherText });
      await page.locator(".sd-dropdown").nth(1).click();
      await expect(page.locator(".sv-list__item span").nth(10)).toHaveText(newOtherText);
    });

    test("placeholder changed", async ({ page }) => {
      const oldPlaceholder = "Select...";
      const newPlaceholder = "New placeholder";
      const json = {
        elements: [
          {
            type: "dropdown",
            name: "cars",
            title: "Dropdown",
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
          },
        ]
      };
      await initSurvey(page, framework, json);

      await expect(page.locator(".sd-dropdown__value input")).toHaveAttribute("placeholder", oldPlaceholder);
      await setOptions(page, "cars", { placeholder: newPlaceholder });
      await expect(page.locator(".sd-dropdown__value input")).toHaveAttribute("placeholder", newPlaceholder);
    });

    test("Check dropdown popup width", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 1100 });
      const json = {
        elements: [
          {
            type: "dropdown",
            name: "cars",
            title: "Dropdown",
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

      const popupContainer = page.locator(".sv-popup__container").filter({ visible: true });
      await expect(popupContainer).not.toBeVisible();

      await page.locator(".sd-dropdown").click();
      await expect(popupContainer).toBeVisible();
      const width1 = await popupContainer.evaluate((el) => (el as HTMLElement).offsetWidth);
      expect(width1).toBeGreaterThanOrEqual(550);

      await page.locator(".sv-list__item span").filter({ hasText: "Ford" }).filter({ visible: true }).click();
      await expect(popupContainer).not.toBeVisible();

      await page.locator(".sd-dropdown__value .sv-string-viewer").click();
      await expect(popupContainer).toBeVisible();
      const width2 = await popupContainer.evaluate((el) => (el as HTMLElement).offsetWidth);
      expect(width2).toBeGreaterThanOrEqual(550);
    });

    test("Check dropdown disabled items", async ({ page }) => {
      const json = {
        elements: [
          {
            type: "dropdown",
            renderAs: "select",
            name: "dropdownRenderAsSelect",
            title: "Dropdown renderAs",
            isRequired: true,
            hasNone: true,
            colCount: 4,
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
          },
          {
            type: "dropdown",
            name: "dropdown",
            hasOther: "true",
            choices: Array.from({ length: 27 }, (_, i) => `item${i + 1}`)
          }
        ]
      };
      await initSurvey(page, framework, json);

      await page.evaluate(() => {
        const updateChoiceEnabled = (_, opt) => {
          opt.choices.forEach((ch, index) => { ch.setIsEnabled(index % 2 === 0); });
        };

        const oldDropdown = window["survey"].getQuestionByName("dropdownRenderAsSelect");
        oldDropdown.onOpened.add(updateChoiceEnabled);

        const selectQuestion = window["survey"].getQuestionByName("dropdown");
        selectQuestion.onOpened.add(updateChoiceEnabled);
      });

      await expect(page.locator("option[value=Vauxhall]")).not.toHaveAttribute("disabled", "");
      await page.locator("select").click();
      await expect(page.locator("option[value=Vauxhall]")).toHaveAttribute("disabled", "");
      await page.locator("select").click();

      await page.locator("select").click();
      await expect(page.locator("option[value=Vauxhall]")).toHaveAttribute("disabled", "");
      await page.locator("select").click();

      const questionDropdownSelect2 = page.locator(".sd-dropdown").nth(1);
      const popupContainer = page.locator(".sv-popup__container").filter({ visible: true });
      await questionDropdownSelect2.click();
      await expect(page.locator(".sv-list__item")).toHaveCount(28);
      await expect(page.locator(".sv-list__item.sv-list__item--disabled")).toHaveCount(13);
      await getVisibleListItemByText(page, "item2").click();
      await expect(popupContainer).toBeVisible();
      await getVisibleListItemByText(page, "item3").click();
      await expect(popupContainer).not.toBeVisible();
    });

    test("Check dropdown clear button", async ({ page }) => {
      const json = {
        elements: [
          {
            type: "dropdown",
            name: "cars",
            title: "Dropdown",
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

      await expect(page.locator(".sd-editor-clean-button")).not.toBeVisible();

      await page.locator(".sd-dropdown").click();
      await page.locator(".sv-list__item span").filter({ hasText: "Ford" }).filter({ visible: true }).click();

      await expect(page.locator(".sd-editor-clean-button")).toBeVisible();

      await page.locator(".sd-editor-clean-button").click();
      await expect(page.locator(".sd-editor-clean-button")).not.toBeVisible();
    });

    test("Check dropdown item template", async ({ page }) => {
      await registerCustomItemComponent(page, framework);

      const json = {
        elements: [
          {
            type: "dropdown",
            name: "cars",
            title: "Dropdown",
            itemComponent: "new-item",
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

      const myListItems = page.locator(".my-list-item");
      await expect(page.locator(".sd-dropdown__value input")).toHaveAttribute("placeholder", "Select...");

      await page.locator(".sd-dropdown").click();

      await expect(myListItems).toHaveCount(10);
      await expect(myListItems.locator(".sv-svg-icon")).toHaveCount(10);

      await myListItems.nth(3).click();

      await expect(page.locator(".sd-dropdown__value").locator(".sv-svg-icon")).toHaveCount(1);
    });

    test("Check dropdown key press with searchEnabled", async ({ page }) => {
      const json = {
        elements: [
          {
            type: "dropdown",
            name: "DropdownSearchEnabledFalse",
            title: "Dropdown",
            colCount: 0,
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
          },
          {
            type: "dropdown",
            name: "cars",
            colCount: 0,
            choices: Array.from({ length: 27 }, (_, i) => `item${i + 1}`)
          }
        ]
      };
      await initSurvey(page, framework, json);
      const popupContainer = page.locator(".sv-popup__container").filter({ visible: true });

      await page.keyboard.press("Tab");
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("Enter");
      await expect(page.locator(".sd-dropdown__value input").first()).toHaveValue("Nissan");

      await page.waitForTimeout(100);
      await page.keyboard.press("ArrowDown");
      await expect(popupContainer).toBeVisible();
      await page.keyboard.press("ArrowUp");
      await page.keyboard.press("Enter");
      await expect(popupContainer).not.toBeVisible();
      await expect(page.locator(".sd-dropdown__value input").first()).toHaveValue("Volkswagen");

      await page.keyboard.press("Tab");
      await page.keyboard.press("2");
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("Enter");
      await expect(page.locator(".sd-dropdown__value input").nth(1)).toHaveValue("item20");

      await page.waitForTimeout(100);
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("Enter");
      await expect(page.locator(".sd-dropdown__value input").nth(1)).toHaveValue("item21");
    });

    test("Esc key press", async ({ page }) => {
      const json = {
        autoFocusFirstQuestion: true,
        elements: [
          {
            type: "dropdown",
            name: "cars",
            title: "Dropdown",
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
      const popupContainer = page.locator(".sv-popup__container").filter({ visible: true });

      await expect(popupContainer).not.toBeVisible();

      await page.keyboard.press("a");
      await expect(popupContainer).toBeVisible();

      await page.keyboard.press("u");
      await page.keyboard.press("Escape");
      await expect(popupContainer).not.toBeVisible();
      await expect(page.locator(".sd-dropdown__value")).toHaveText("");

      await page.locator(".sd-dropdown").click();
      await getVisibleListItemByText(page, "Nissan").click();
      await expect(page.locator(".sd-dropdown__value input")).toHaveValue("Nissan");

      await page.keyboard.press("Control+a");
      await page.keyboard.press("Backspace");
      await page.keyboard.type("au");
      await page.keyboard.press("Escape");
      await expect(popupContainer).not.toBeVisible();
      await expect(page.locator(".sd-dropdown__value")).toHaveText("Nissan");
    });

    test("Select item after tab press", async ({ page }) => {
      const json = {
        autoFocusFirstQuestion: true,
        elements: [
          {
            type: "dropdown",
            name: "cars",
            title: "Dropdown",
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
      const popupContainer = page.locator(".sv-popup__container").filter({ visible: true });

      await expect(popupContainer).not.toBeVisible();

      await page.keyboard.press("a");
      await expect(popupContainer).toBeVisible();

      await page.keyboard.press("u");
      await page.keyboard.press("Tab");
      await expect(popupContainer).not.toBeVisible();
      await expect(page.locator(".sd-dropdown__value")).toHaveText("Vauxhall");

      await page.locator(".sd-dropdown").click();
      await getVisibleListItemByText(page, "Nissan").click();
      await expect(page.locator(".sd-dropdown__value input")).toHaveValue("Nissan");

      await page.keyboard.press("Control+a");
      await page.keyboard.press("Backspace");
      await page.keyboard.type("a u");
      await page.keyboard.press("Tab");
      await expect(popupContainer).not.toBeVisible();
      await expect(page.locator(".sd-dropdown__value")).toHaveText("Nissan");
    });

    test("Check dropdown key press without searchEnabled", async ({ page }) => {
      const json = {
        elements: [
          {
            type: "dropdown",
            name: "DropdownSearchEnabledFalse",
            searchEnabled: false,
            title: "Dropdown",
            colCount: 0,
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
          },
          {
            type: "dropdown",
            name: "cars",
            searchEnabled: false,
            colCount: 0,
            choices: Array.from({ length: 27 }, (_, i) => `item${i + 1}`)
          }
        ]
      };
      await initSurvey(page, framework, json);
      const popupContainer = page.locator(".sv-popup__container").filter({ visible: true });

      await page.keyboard.press("Tab");
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("Enter");
      await expect(page.locator(".sd-dropdown__value .sv-string-viewer")).toHaveText("Nissan");

      await page.waitForTimeout(100);
      await page.keyboard.press(" ");
      await expect(popupContainer).toBeVisible();
      await page.keyboard.press("ArrowUp");
      await page.keyboard.press(" ");
      await expect(popupContainer).not.toBeVisible();
      await expect(page.locator(".sd-dropdown__value .sv-string-viewer")).toHaveText("Volkswagen");

      await page.keyboard.press("Tab");
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("Enter");
      await expect(page.locator(".sd-dropdown__value .sv-string-viewer").nth(1)).toHaveText("item2");
    });

    test("Check dropdown SPACE press without searchEnabled", async ({ page }) => {
      const json = {
        elements: [
          {
            type: "dropdown",
            name: "q1",
            searchEnabled: false,
            title: "Dropdown",
            colCount: 0,
            choices: [
              "point",
              "itemzero",
              "item 1",
              "item 2",
              "stuff"
            ]
          }
        ]
      };
      await initSurvey(page, framework, json);

      await page.keyboard.press("Tab");
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press(" ");
      await expect(page.locator(".sd-dropdown__value .sv-string-viewer")).toHaveText("itemzero");
    });

    test("Check dropdown SPACE press with searchEnabled", async ({ page }) => {
      const json = {
        elements: [
          {
            type: "dropdown",
            name: "q1",
            title: "Dropdown",
            colCount: 0,
            choices: [
              "point2",
              "itemzero",
              "item 1",
              "item 2",
              "stuff"
            ]
          }
        ]
      };
      await initSurvey(page, framework, json);

      await page.keyboard.press("Tab");
      await page.keyboard.type("em 2");
      await page.keyboard.press("Enter");
      await expect(page.locator(".sd-dropdown__value input")).toHaveValue("item 2");
    });

    test("Check dropdown search", async ({ page }) => {
      const json = {
        autoFocusFirstQuestion: true,
        elements: [
          {
            type: "dropdown",
            name: "Dropdown",
            choices: Array.from({ length: 27 }, (_, i) => `item${i + 1}`)
          }
        ]
      };
      await initSurvey(page, framework, json);
      const popupContainer = page.locator(".sv-popup__container").filter({ visible: true });
      const listItems = page.locator(".sv-list__item");

      await expect(popupContainer).not.toBeVisible();
      await expect(listItems).toHaveCount(0);
      await expect(listItems.filter({ visible: true })).toHaveCount(0);

      await page.keyboard.press("2");
      await expect(popupContainer).toBeVisible();
      await expect(listItems.filter({ visible: true })).toHaveCount(10);

      await page.keyboard.press("3");
      await expect(listItems.filter({ visible: true })).toHaveCount(1);

      await page.keyboard.press("Backspace");
      await expect(listItems.filter({ visible: true })).toHaveCount(10);

      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("Enter");
      await expect(page.locator(".sd-dropdown__value input")).toHaveValue("item20");
      await expect(popupContainer).not.toBeVisible();

      await page.keyboard.press("ArrowDown");
      await expect(popupContainer).toBeVisible();
      await expect(listItems.filter({ visible: true })).toHaveCount(27);
      await expect(page.locator(".sv-list__item.sv-list__item--selected")).toContainText("item20");

      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("Escape");
      await expect(page.locator(".sd-dropdown__value input")).toHaveValue("item20");
    });

    test("Check dropdown key press with auto-generated list", async ({ page }) => {
      const json = {
        elements: [
          {
            type: "dropdown",
            name: "dropdown",
            defaultValue: 2016,
            "choicesMin": 2014,
            "choicesMax": 2023
          }
        ]
      };
      await initSurvey(page, framework, json);

      await page.keyboard.press("Tab");
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("Enter");
      await expect(page.locator(".sd-dropdown__value input")).toHaveValue("2018");
    });

    test("Check reset focused item - no focus on first popup", async ({ page }) => {
      const json = {
        elements: [
          {
            type: "dropdown",
            name: "Dropdown",
            choices: Array.from({ length: 27 }, (_, i) => `item${i + 1}`)
          }
        ]
      };
      await initSurvey(page, framework, json);
      const popupContainer = page.locator(".sv-popup__container").filter({ visible: true });
      const listItems = page.locator(".sv-list__item");
      const focusedItem = page.locator(".sv-list__item--focused");

      await expect(popupContainer).not.toBeVisible();
      await expect(listItems).toHaveCount(0);
      await expect(focusedItem).not.toBeVisible();

      await page.locator(".sd-dropdown").click();
      await expect(popupContainer).toBeVisible();
      await expect(listItems).toHaveCount(27);
      await expect(focusedItem).not.toBeVisible();

      await listItems.nth(2).hover();
      await expect(focusedItem).not.toBeVisible();
    });

    test("Check dropdown reset filter string", async ({ page }) => {
      const json = {
        autoFocusFirstQuestion: true,
        elements: [
          {
            type: "dropdown",
            name: "Dropdown",
            choices: Array.from({ length: 27 }, (_, i) => `item${i + 1}`)
          }
        ]
      };
      await initSurvey(page, framework, json);
      const popupContainer = page.locator(".sv-popup__container").filter({ visible: true });
      const listItems = page.locator(".sv-list__item");

      await expect(popupContainer).not.toBeVisible();
      await expect(listItems).toHaveCount(0);
      await expect(listItems.filter({ visible: true })).toHaveCount(0);

      await page.keyboard.press("2");
      await expect(page.locator(".sd-editor-clean-button")).not.toBeVisible();

      await page.keyboard.press("3");
      await expect(listItems.filter({ visible: true })).toHaveCount(1);

      await page.keyboard.press("Escape");
      await expect(page.locator(".sd-dropdown__value input")).toHaveValue("");
      await expect(popupContainer).not.toBeVisible();
      await expect(page.locator(".sd-editor-clean-button")).not.toBeVisible();
    });

    test("Check dropdown clear value by keyboard", async ({ page }) => {
      const json = {
        autoFocusFirstQuestion: true,
        elements: [
          {
            type: "dropdown",
            name: "cars",
            title: "Dropdown",
            defaultValue: "Volkswagen",
            searchEnabled: "false",
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
          },
          {
            type: "dropdown",
            renderAs: "select",
            name: "DropdownRenderAsSelect",
            defaultValue: "Mercedes-Benz",
            searchEnabled: "false",
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
      const questionValueText = page.locator(".sd-dropdown__value .sv-string-viewer");
      const oldDropdown = page.locator("select.sd-dropdown");

      await expect(questionValueText).toHaveText("Volkswagen");
      await expect(oldDropdown).toHaveValue("Mercedes-Benz");

      await page.keyboard.press("Delete");
      await expect(page.locator(".sd-dropdown__value input")).toHaveAttribute("placeholder", "Select...");
      await expect(oldDropdown).toHaveValue("Mercedes-Benz");

      await page.keyboard.press("Tab");
      await page.keyboard.press("Delete");
      await expect(page.locator(".sd-dropdown__value input")).toHaveAttribute("placeholder", "Select...");
      await expect(oldDropdown).toHaveValue("");
    });

    test("test locale", async ({ page }) => {
      const json = { elements: [{ type: "dropdown", name: "q1", choices: [1, 2, 3] }] };
      await initSurvey(page, framework, json);
      await expect(page.locator(".sd-dropdown__value input")).toHaveAttribute("placeholder", "Select...");
      await page.evaluate(() => {
        window["survey"].locale = "de";
      });
      await expect(page.locator(".sd-dropdown__value input")).toHaveAttribute("placeholder", "Bitte auswählen..."); // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
    });

    test("Check popup scroll", async ({ page }) => {
      const json = {
        elements: [
          {
            type: "dropdown",
            name: "Dropdown",
            choices: Array.from({ length: 27 }, (_, i) => `item${i + 1}`)
          },
          {
            type: "dropdown",
            name: "Dropdown2",
            searchEnabled: false,
            choices: Array.from({ length: 30 }, (_, i) => `item${i + 1}`)
          }
        ]
      };
      await initSurvey(page, framework, json);
      const popupContainer = page.locator(".sv-popup__container");
      const focusedItem = page.locator(".sv-list__item--focused span");
      await page.setViewportSize({ width: 1280, height: 600 });

      await page.keyboard.press("Tab");
      await page.keyboard.press("ArrowDown");
      await expect(focusedItem).toBeVisible();
      await expect(focusedItem).toHaveText("item1");
      await expect(popupContainer.nth(0)).toBeVisible();
      await expect(popupContainer.nth(0).locator(".sv-list__item")).toHaveCount(27);
      const scrollTop1 = await popupContainer.nth(0).locator(".sv-list").evaluate((el) => (el as HTMLElement).scrollTop);
      expect(scrollTop1).toEqual(0);
      await page.keyboard.press("ArrowUp");
      await page.waitForTimeout(1000);
      await expect(focusedItem).toHaveText("item27");
      const scrollTop2 = await popupContainer.nth(0).locator(".sv-list").evaluate((el) => (el as HTMLElement).scrollTop);
      expect(scrollTop2).toBeGreaterThan(400);

      await page.keyboard.press("Tab");
      await page.keyboard.press(" ");
      await expect(focusedItem).toBeVisible();
      await expect(focusedItem).toHaveText("item1");
      await expect(popupContainer.nth(1)).toBeVisible();
      await expect(popupContainer.nth(1).locator(".sv-list__item")).toHaveCount(30);
      const scrollTop3 = await popupContainer.nth(1).locator(".sv-list").evaluate((el) => (el as HTMLElement).scrollTop);
      expect(scrollTop3).toEqual(0);

      await page.keyboard.press("ArrowUp");
      await page.waitForTimeout(1000);
      await expect(focusedItem).toHaveText("item30");
      const scrollTop4 = await popupContainer.nth(1).locator(".sv-list").evaluate((el) => (el as HTMLElement).scrollTop);
      expect(scrollTop4).toBeGreaterThan(400);

      await page.setViewportSize({ width: 1280, height: 1100 });
    });

    test("Check rating as dropdown", async ({ page }) => {
      const json = {
        elements: [
          {
            name: "name",
            type: "rating",
            title: "Question title",
            titleLocation: "hidden",
            renderAs: "dropdown",
          }
        ]
      };
      await initSurvey(page, framework, json);

      const ratingAsDropdownPlaceHolder = "Select...";
      const ratingAsDropdown = page.locator(".sd-dropdown .sd-dropdown__value");
      const ratingAsDropdownPlaceholder = ratingAsDropdown.locator("input");
      const ratingAsDropdownText = ratingAsDropdown.locator(".sv-string-viewer");

      await ratingAsDropdown.click();
      await getVisibleListItemByText(page, "2").click();
      await expect(ratingAsDropdownPlaceholder).toHaveAttribute("placeholder", "");
      await expect(ratingAsDropdownText.filter({ hasText: "2" })).toBeVisible();

      await page.keyboard.press("Delete");
      await expect(ratingAsDropdownPlaceholder).toHaveAttribute("placeholder", ratingAsDropdownPlaceHolder);
    });

    test("Check dropdown popup width - long", async ({ page }) => {
      const json = {
        "elements": [
          {
            "type": "dropdown",
            "name": "car",
            "title": "What car are you driving?",
            "choices": [
              "Ford",
              "Vauxhall",
              "Volkswagen",
              "Nissan",
              "Audi",
              "Mercedes-Benz 1 Mercedes-Benz 2 Mercedes-Benz 3 Mercedes-Benz 4 Mercedes-Benz 5 Mercedes-Benz",
              "BMW",
              "Peugeot",
              "Toyota",
              "Citroen"
            ]
          }
        ]
      };
      await initSurvey(page, framework, json);
      const popupContainer = page.locator(".sv-popup__container").filter({ visible: true });
      const questionDropdownV2Select = page.locator(".sd-dropdown");

      await page.setViewportSize({ width: 800, height: 600 });
      await questionDropdownV2Select.click();
      const clientWidth1 = await popupContainer.evaluate((el) => (el as HTMLElement).clientWidth);
      expect(clientWidth1).toBeLessThanOrEqual(685);
      await getVisibleListItemByText(page, "Ford").click();

      await page.setViewportSize({ width: 1300, height: 600 });
      await questionDropdownV2Select.click();
      const clientWidth2 = await popupContainer.evaluate((el) => (el as HTMLElement).clientWidth);
      expect(clientWidth2).toBeLessThanOrEqual(685);
    });

    test("Check popup height with lazy loading", async ({ page }) => {
      const json = {
        autoFocusFirstQuestion: true,
        elements: [
          {
            type: "dropdown",
            name: "country",
            title: "Select the country...",
            choicesLazyLoadEnabled: true
          }, {
            type: "checkbox",
            name: "question1",
            choices: Array.from({ length: 6 }, (_, i) => `item${i + 1}`)
          }, {
            type: "dropdown",
            name: "kids",
            title: "Dropdown page 30",
            choicesLazyLoadEnabled: true,
            choicesLazyLoadPageSize: 30
          }
        ]
      };

      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        window["survey"].onChoicesLazyLoad.add((_, opt) => {
          var getNumberArray = (skip = 1, count = 25) => {
            const result = [];
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
        window["survey"].fromJSON(json);
      }, json);

      await page.setViewportSize({ width: 1280, height: 900 });

      const popupContainer = page.locator(".sv-popup__container");
      const dropdown1 = popupContainer.nth(0);
      const dropdown2 = popupContainer.nth(1);

      await expect(page.locator(".sd-dropdown__filter-string-input").first()).toBeFocused();
      await page.keyboard.press("ArrowDown");
      await expect(dropdown1.locator(".sv-list__empty-container")).toBeVisible();
      const offsetHeight1 = await dropdown1.locator(".sv-popup__scrolling-content").evaluate((el) => (el as HTMLElement).offsetHeight);
      expect(offsetHeight1).toEqual(singleListItemHeight);
      await expect(page.locator(".sv-list__item span").filter({ visible: true })).toHaveCount(0);

      await page.waitForTimeout(500);
      await expect(dropdown1.locator(".sv-list__empty-container")).not.toBeVisible();
      const offsetTop1 = await dropdown1.evaluate((el) => (el as HTMLElement).offsetTop);
      expect(offsetTop1).toBeLessThan(200);
      const offsetHeight2 = await dropdown1.locator(".sv-popup__scrolling-content").evaluate((el) => (el as HTMLElement).offsetHeight);
      expect(offsetHeight2).toBeGreaterThanOrEqual(688);
      expect(offsetHeight2).toBeLessThanOrEqual(708);
      const scrollTop1 = await dropdown1.locator(".sv-list").evaluate((el) => (el as HTMLElement).scrollTop);
      expect(scrollTop1).toEqual(0);
      const scrollHeight1 = await dropdown1.locator(".sv-list").evaluate((el) => (el as HTMLElement).scrollHeight);
      expect(scrollHeight1).toBeGreaterThanOrEqual(1208);
      expect(scrollHeight1).toBeLessThanOrEqual(1308);
      await expect(page.locator(".sv-list__item span").filter({ visible: true })).toHaveCount(26);

      await dropdown1.locator(".sv-list").evaluate((el, y) => { (el as HTMLElement).scrollBy(0, y); }, 1000);
      await page.waitForTimeout(500);
      const offsetTop2 = await dropdown1.evaluate((el) => (el as HTMLElement).offsetTop);
      expect(offsetTop2).toBeLessThan(200);
      const offsetHeight3 = await dropdown1.locator(".sv-popup__scrolling-content").evaluate((el) => (el as HTMLElement).offsetHeight);
      expect(offsetHeight3).toBeGreaterThanOrEqual(688);
      expect(offsetHeight3).toBeLessThanOrEqual(708);
      const scrollTop2 = await dropdown1.locator(".sv-list").evaluate((el) => (el as HTMLElement).scrollTop);
      expect(scrollTop2).toBeGreaterThanOrEqual(546);
      expect(scrollTop2).toBeLessThanOrEqual(556);
      await page.waitForTimeout(500);
      const scrollHeight2 = await dropdown1.locator(".sv-list").evaluate((el) => (el as HTMLElement).scrollHeight);
      expect(scrollHeight2).toBeGreaterThanOrEqual(2408);
      expect(scrollHeight2).toBeLessThanOrEqual(2508);
      await expect(page.locator(".sv-list__item span").filter({ visible: true })).toHaveCount(51);

      await dropdown1.locator(".sv-list").evaluate((el, y) => { (el as HTMLElement).scrollBy(0, y); }, 2300);
      await page.waitForTimeout(500);
      const offsetTop3 = await dropdown1.evaluate((el) => (el as HTMLElement).offsetTop);
      expect(offsetTop3).toBeLessThan(200);
      const offsetHeight4 = await dropdown1.locator(".sv-popup__scrolling-content").evaluate((el) => (el as HTMLElement).offsetHeight);
      expect(offsetHeight4).toBeGreaterThanOrEqual(688);
      expect(offsetHeight4).toBeLessThanOrEqual(708);
      const scrollTop3 = await dropdown1.locator(".sv-list").evaluate((el) => (el as HTMLElement).scrollTop);
      expect(scrollTop3).toBeGreaterThanOrEqual(1696);
      expect(scrollTop3).toBeLessThanOrEqual(1796);
      await page.waitForTimeout(500);
      const scrollHeight3 = await dropdown1.locator(".sv-list").evaluate((el) => (el as HTMLElement).scrollHeight);
      expect(scrollHeight3).toBeGreaterThanOrEqual(2608);
      expect(scrollHeight3).toBeLessThanOrEqual(2708);
      await expect(page.locator(".sv-list__item span").filter({ visible: true })).toHaveCount(55);

      await getVisibleListItemByText(page, "55").click();
      await page.locator(".sd-dropdown").nth(1).click();
      await expect(dropdown2.locator(".sv-list__empty-container")).toBeVisible();
      const offsetHeight5 = await dropdown2.locator(".sv-popup__scrolling-content").evaluate((el) => (el as HTMLElement).offsetHeight);
      expect(offsetHeight5).toEqual(singleListItemHeight);
      await expect(page.locator(".sv-list__item span").filter({ visible: true })).toHaveCount(0);

      await page.waitForTimeout(500);
      await expect(dropdown2.locator(".sv-list__empty-container")).not.toBeVisible();
      const offsetTop4 = await dropdown2.evaluate((el) => (el as HTMLElement).offsetTop);
      expect(offsetTop4).toEqual(0);
      const offsetHeight6 = await dropdown2.locator(".sv-popup__scrolling-content").evaluate((el) => (el as HTMLElement).offsetHeight);
      expect(offsetHeight6).toBeGreaterThanOrEqual(716);
      expect(offsetHeight6).toBeLessThanOrEqual(726);
      const scrollTop4 = await dropdown2.locator(".sv-list").evaluate((el) => (el as HTMLElement).scrollTop);
      expect(scrollTop4).toEqual(0);
      const scrollHeight4 = await dropdown2.locator(".sv-list").evaluate((el) => (el as HTMLElement).scrollHeight);
      expect(scrollHeight4).toBeGreaterThanOrEqual(1358);
      expect(scrollHeight4).toBeLessThanOrEqual(1508);
      await expect(page.locator(".sv-list__item span").filter({ visible: true })).toHaveCount(31);

      await dropdown2.locator(".sv-list").evaluate((el, y) => { (el as HTMLElement).scrollBy(0, y); }, 1000);
      await page.waitForTimeout(500);
      await expect(dropdown2.locator(".sv-list__empty-container")).not.toBeVisible();
      const offsetTop5 = await dropdown2.evaluate((el) => (el as HTMLElement).offsetTop);
      expect(offsetTop5).toEqual(0);
      const offsetHeight7 = await dropdown2.locator(".sv-popup__scrolling-content").evaluate((el) => (el as HTMLElement).offsetHeight);
      expect(offsetHeight7).toBeGreaterThanOrEqual(716);
      expect(offsetHeight7).toBeLessThanOrEqual(726);
      const scrollTop5 = await dropdown2.locator(".sv-list").evaluate((el) => (el as HTMLElement).scrollTop);
      expect(scrollTop5).toBeGreaterThanOrEqual(746);
      expect(scrollTop5).toBeLessThanOrEqual(846);
      await page.waitForTimeout(500);
      const scrollHeight5 = await dropdown2.locator(".sv-list").evaluate((el) => (el as HTMLElement).scrollHeight);
      expect(scrollHeight5).toBeGreaterThanOrEqual(2608);
      expect(scrollHeight5).toBeLessThanOrEqual(2658);
      await expect(page.locator(".sv-list__item span").filter({ visible: true })).toHaveCount(55);
      await getVisibleListItemByText(page, "55").click();

      await page.setViewportSize({ width: 1280, height: 1100 });
    });

    test("Check popup height and position while searching", async ({ page }) => {
      const json = {
        autoFocusFirstQuestion: true,
        elements: [
          {
            type: "dropdown",
            name: "country",
            title: "Select the country...",
            choices: Array.from({ length: 27 }, (_, i) => `item${i + 1}`)
          }, {
            type: "checkbox",
            name: "question1",
            choices: Array.from({ length: 6 }, (_, i) => `item${i + 1}`)
          }, {
            type: "dropdown",
            name: "kids",
            title: "dropdown page 30",
            choices: Array.from({ length: 27 }, (_, i) => `item${i + 1}`)
          }
        ]
      };
      await initSurvey(page, framework, json);
      const popupContainer = page.locator(".sv-popup__container");
      const dropdown1 = popupContainer.nth(0);
      const dropdown2 = popupContainer.nth(1);
      const listItems = page.locator(".sv-list__item span");

      await page.setViewportSize({ width: 1280, height: 900 });

      await expect(page.locator(".sd-dropdown__filter-string-input").first()).toBeFocused();
      await page.keyboard.press("2");
      await page.waitForTimeout(500);
      await expect(dropdown1).toBeVisible();
      await expect(listItems.filter({ visible: true })).toHaveCount(10);
      await expect(dropdown1.locator(".sv-list__empty-container")).not.toBeVisible();
      const offsetTop1 = await dropdown1.evaluate((el) => (el as HTMLElement).offsetTop);
      expect(offsetTop1).toEqual(questionOffsetTopConst);
      const offsetHeight1 = await dropdown1.locator(".sv-popup__scrolling-content").evaluate((el) => (el as HTMLElement).offsetHeight);
      expect(offsetHeight1).toBeGreaterThanOrEqual(485);
      expect(offsetHeight1).toBeLessThanOrEqual(495);

      await page.keyboard.press("3");
      await expect(listItems.filter({ visible: true })).toHaveCount(1);
      await expect(dropdown1.locator(".sv-list__empty-container")).not.toBeVisible();
      const offsetTop2 = await dropdown1.evaluate((el) => (el as HTMLElement).offsetTop);
      expect(offsetTop2).toEqual(questionOffsetTopConst);
      const offsetHeight2 = await dropdown1.locator(".sv-popup__scrolling-content").evaluate((el) => (el as HTMLElement).offsetHeight);
      expect(offsetHeight2).toEqual(singleListItemHeight);

      await page.keyboard.press("Enter");
      await expect(dropdown1).not.toBeVisible();

      await page.locator(".sd-dropdown").nth(1).click();
      await page.keyboard.press("2");
      await expect(dropdown2).toBeVisible();
      await expect(listItems.filter({ visible: true })).toHaveCount(10);
      await expect(dropdown2.locator(".sv-list__empty-container")).not.toBeVisible();
      const offsetTop3 = await dropdown2.evaluate((el) => (el as HTMLElement).offsetTop);
      expect(offsetTop3).toBeGreaterThanOrEqual(228);
      expect(offsetTop3).toBeLessThanOrEqual(238);
      const offsetHeight3 = await dropdown2.locator(".sv-popup__scrolling-content").evaluate((el) => (el as HTMLElement).offsetHeight);
      expect(offsetHeight3).toBeGreaterThanOrEqual(480);
      expect(offsetHeight3).toBeLessThanOrEqual(490);

      await page.keyboard.press("3");
      await expect(listItems.filter({ visible: true })).toHaveCount(1);
      await expect(dropdown2.locator(".sv-list__empty-container")).not.toBeVisible();
      const offsetTop4 = await dropdown2.evaluate((el) => (el as HTMLElement).offsetTop);
      expect(offsetTop4).toEqual(768);
      const offsetHeight4 = await dropdown2.locator(".sv-popup__scrolling-content").evaluate((el) => (el as HTMLElement).offsetHeight);
      expect(offsetHeight4).toEqual(singleListItemHeight);

      await page.keyboard.press("Enter");
      await expect(dropdown2).not.toBeVisible();

      await page.setViewportSize({ width: 1280, height: 1100 });
    });

    test("do not render list items if the popup is closed", async ({ page }) => {
      const json = {
        elements: [
          {
            type: "dropdown",
            name: "car",
            title: "What car are you driving?",
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
              "Citroen",
            ],
          },
        ],
      };
      await initSurvey(page, framework, json);
      const listSelector = page.locator(".sv-list");

      await expect(listSelector).not.toBeVisible();
      await page.locator(".sd-dropdown").click();
      await expect(listSelector).toBeVisible();
    });

    test("Check dropdown popup close with mouse, bug #5860", async ({ page }) => {
      const json = {
        autoFocusFirstQuestion: true,
        elements: [
          {
            type: "dropdown",
            name: "Dropdown",
            defaultValue: "item1",
            choices: Array.from({ length: 27 }, (_, i) => `item${i + 1}`)
          }
        ]
      };
      await initSurvey(page, framework, json);
      const popupContainer = page.locator(".sv-popup__container").filter({ visible: true });
      const input = page.locator(".sd-dropdown input").filter({ visible: true });
      const str = page.locator(".sd-dropdown__value .sv-string-viewer");

      await expect(popupContainer).not.toBeVisible();
      await page.keyboard.press("ArrowDown");
      await expect(popupContainer).toBeVisible();
      await expect(input).toHaveValue("item1");
      await expect(str).not.toBeVisible();

      await page.keyboard.press("Tab");
      await expect(str).toBeVisible();
      await expect(str).toHaveText("item1");

      await input.focus();
      await input.click();
      await expect(input).toHaveValue("item1");
      await page.keyboard.type("q");
      await expect(input).toHaveValue("item1q");
      await expect(str).not.toBeVisible();
    });

    test("Check dropdown close popup on selected item click", async ({ page }) => {
      const json = {
        elements: [
          {
            type: "dropdown",
            name: "Dropdown",
            defaultValue: "item2",
            choices: ["item1", "item2", "item3"]
          }
        ]
      };
      await initSurvey(page, framework, json);
      const popupContainer = page.locator(".sv-popup__container").filter({ visible: true });
      const listItems = page.locator(".sv-list__item");
      const selectedItem = page.locator(".sv-list__item--selected");

      await expect(popupContainer).not.toBeVisible();
      await page.locator(".sd-dropdown").click();
      await expect(popupContainer).toBeVisible();
      await expect(page.locator(".sd-dropdown__value input")).toHaveValue("item2");
      await expect(selectedItem).toBeVisible();
      await selectedItem.click();
      await expect(popupContainer).not.toBeVisible();
      await expect(page.locator(".sd-dropdown__value input")).toHaveValue("item2");
    });

    test("Recalculate popup position after window resize", async ({ page }) => {
      const json = {
        elements: [
          {
            type: "dropdown",
            name: "cars",
            title: "Dropdown",
            isRequired: true,
            hasNone: true,
            colCount: 4,
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
          },
          {
            type: "dropdown",
            name: "q1",
            hasOther: "true",
            startWithNewLine: false,
            choices: Array.from({ length: 27 }, (_, i) => `item${i + 1}`)
          }
        ]
      };
      await initSurvey(page, framework, json);
      const popupContainer = page.locator(".sv-popup__container").filter({ visible: true });

      await page.setViewportSize({ width: 900, height: 600 });
      await expect(popupContainer).not.toBeVisible();
      await page.locator(".sd-dropdown").nth(1).click();
      await expect(popupContainer).toBeVisible();
      const offsetTop1 = await popupContainer.evaluate((el) => (el as HTMLElement).offsetTop);
      expect(offsetTop1).toBeGreaterThanOrEqual(160);
      expect(offsetTop1).toBeLessThanOrEqual(170);
      const offsetLeft1 = await popupContainer.evaluate((el) => (el as HTMLElement).offsetLeft);
      expect(offsetLeft1).toBeGreaterThanOrEqual(490);
      expect(offsetLeft1).toBeLessThanOrEqual(500);
      const offsetHeight1 = await popupContainer.evaluate((el) => (el as HTMLElement).offsetHeight);
      expect(offsetHeight1).toBeGreaterThanOrEqual(410);
      expect(offsetHeight1).toBeLessThanOrEqual(420);
      const offsetWidth1 = await popupContainer.evaluate((el) => (el as HTMLElement).offsetWidth);
      expect(offsetWidth1).toBeGreaterThanOrEqual(310);
      expect(offsetWidth1).toBeLessThanOrEqual(320);

      await page.setViewportSize({ width: 1280, height: 1100 });
      await expect(popupContainer).toBeVisible();
      const offsetTop2 = await popupContainer.evaluate((el) => (el as HTMLElement).offsetTop);
      expect(offsetTop2).toBeGreaterThanOrEqual(160);
      expect(offsetTop2).toBeLessThanOrEqual(170);
      const offsetLeft2 = await popupContainer.evaluate((el) => (el as HTMLElement).offsetLeft);
      expect(offsetLeft2).toBeGreaterThanOrEqual(680);
      expect(offsetLeft2).toBeLessThanOrEqual(690);
      const offsetHeight2 = await popupContainer.evaluate((el) => (el as HTMLElement).offsetHeight);
      expect(offsetHeight2).toBeGreaterThanOrEqual(910);
      expect(offsetHeight2).toBeLessThanOrEqual(920);
      const offsetWidth2 = await popupContainer.evaluate((el) => (el as HTMLElement).offsetWidth);
      expect(offsetWidth2).toBeGreaterThanOrEqual(500);
      expect(offsetWidth2).toBeLessThanOrEqual(510);

      await page.setViewportSize({ width: 900, height: 600 });
      await expect(popupContainer).toBeVisible();
      const offsetTop3 = await popupContainer.evaluate((el) => (el as HTMLElement).offsetTop);
      expect(offsetTop3).toBeGreaterThanOrEqual(160);
      expect(offsetTop3).toBeLessThanOrEqual(170);
      const offsetLeft3 = await popupContainer.evaluate((el) => (el as HTMLElement).offsetLeft);
      expect(offsetLeft3).toBeGreaterThanOrEqual(490);
      expect(offsetLeft3).toBeLessThanOrEqual(500);
      const offsetHeight3 = await popupContainer.evaluate((el) => (el as HTMLElement).offsetHeight);
      expect(offsetHeight3).toBeGreaterThanOrEqual(410);
      expect(offsetHeight3).toBeLessThanOrEqual(460);
      const offsetWidth3 = await popupContainer.evaluate((el) => (el as HTMLElement).offsetWidth);
      expect(offsetWidth3).toBeGreaterThanOrEqual(310);
      expect(offsetWidth3).toBeLessThanOrEqual(320);
    });

    test("check dropdown after navigating between pages", async ({ page }) => {
      const json = {
        "autoFocusFirstQuestion": false,
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "dropdown",
                "name": "question1",
                "choices": [1, 2, 3, 4, 5]
              }
            ]
          },
          {
            "name": "page2",
            "elements": [
              {
                "type": "dropdown",
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
        "checkErrorsMode": "onComplete"
      };
      await initSurvey(page, framework, json);
      const popupContainer = page.locator(".sv-popup__container").filter({ visible: true });

      await expect(popupContainer).not.toBeVisible();

      await page.locator(".sd-dropdown").click();
      await expect(popupContainer).toBeVisible();

      await getVisibleListItemByText(page, "3").click();
      await expect(popupContainer).not.toBeVisible();

      await page.locator(".sd-navigation__next-btn").click();
      await page.locator(".sd-navigation__prev-btn").click();
      await expect(popupContainer).not.toBeVisible();

      await page.locator(".sd-dropdown").click();
      await expect(popupContainer).toBeVisible();
      await page.keyboard.press("Tab");
      await expect(page.locator(".sd-dropdown__value .sv-string-viewer")).toHaveText("3");
      await expect(page.locator(".sd-dropdown__value input")).toHaveAttribute("placeholder", "");

      await page.locator(".sd-editor-clean-button").click();
      await expect(page.locator(".sd-dropdown__value .sv-string-viewer")).not.toBeVisible();
      await expect(page.locator(".sd-dropdown__value input")).toHaveAttribute("placeholder", "Select...");
    });

    test("choicesFromQuestion, bug#5818", async ({ page }) => {
      const json = {
        "elements": [
          {
            type: "checkbox",
            name: "car",
            title: "What cars have you being drived?",
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
              "Citroen",
              "Tesla"
            ]
          },
          {
            "type": "dropdown",
            "name": "bestcar",
            "title": "What car did you enjoy the most?",
            "choicesFromQuestion": "car",
            "choicesFromQuestionMode": "selected"
          }
        ]
      };
      await initSurvey(page, framework, json);

      const dropdownChevronButton = page.locator(".sd-dropdown .sd-editor-chevron-button");
      await page.locator(".sd-selectbase__label").filter({ hasText: "Nissan" }).click();
      await page.locator(".sd-selectbase__label").filter({ hasText: "Audi" }).click();
      await page.locator(".sd-selectbase__label").filter({ hasText: "Ford" }).click();

      await dropdownChevronButton.scrollIntoViewIfNeeded();
      await dropdownChevronButton.click();
      await getVisibleListItemByText(page, "Ford").click();
      await dropdownChevronButton.click();
      await getVisibleListItemByText(page, "Audi").click();
    });

    test("Check dropdown popup opens after beak click", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 600 });
      const json = {
        elements: [
          {
            type: "dropdown",
            name: "cars",
            title: "Dropdown",
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
      const dropdownWidth = await questionDropdownV2Select.evaluate((el) => (el as HTMLElement).getBoundingClientRect().width);
      await expect(dropdownWidth).toBeGreaterThan(550);
      await expect(popupContainer).not.toBeVisible();

      await questionDropdownV2Select.click({ position: { x: dropdownWidth - 20, y: 20 } });
      await expect(popupContainer).toBeVisible();

      await questionDropdownV2Select.click({ position: { x: dropdownWidth - 20, y: 20 } });
      await expect(popupContainer).not.toBeVisible();

      await questionDropdownV2Select.click({ position: { x: dropdownWidth - 20, y: 20 } });
      await expect(popupContainer).toBeVisible();

      await page.locator("body").click({ position: { x: 600, y: 20 } });
      await expect(popupContainer).not.toBeVisible();
    });

    test("Check dropdown popup tab navigation", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 600 });
      const json = {
        elements: [
          {
            type: "dropdown",
            name: "cars",
            title: "Dropdown",
            searchEnabled: true,
            choices: [
              "Ford",
              "Vauxhall",
              "Volkswagen"
            ]
          },
          {
            type: "text",
            name: "info"
          }

        ]
      };
      await initSurvey(page, framework, json);

      const questionDropdownV2Select = page.locator(".sd-dropdown");
      const questionTextSelect = page.locator(".sd-text");
      const popupContainer = page.locator(".sv-popup__container").filter({ visible: true });
      const dropdownWidth = await questionDropdownV2Select.evaluate((el) => (el as HTMLElement).getBoundingClientRect().width);
      await questionDropdownV2Select.click({ position: { x: dropdownWidth - 20, y: 20 } });
      await expect(popupContainer).toBeVisible();

      await expect(questionDropdownV2Select.locator("input").filter({ visible: true })).toBeFocused();

      await page.keyboard.press("Tab");

      await expect(questionTextSelect.filter({ visible: true })).toBeFocused();
    });

    test("Check dropdown popup opens after beak click - search enabled", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 600 });
      const json = {
        elements: [
          {
            type: "dropdown",
            name: "cars",
            title: "Dropdown",
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
      const dropdownWidth = await questionDropdownV2Select.evaluate((el) => (el as HTMLElement).getBoundingClientRect().width);
      await expect(dropdownWidth).toBeGreaterThan(550);
      await expect(popupContainer).not.toBeVisible();

      await questionDropdownV2Select.click({ position: { x: dropdownWidth - 20, y: 20 } });
      await expect(popupContainer).toBeVisible();

      await questionDropdownV2Select.click({ position: { x: dropdownWidth - 20, y: 20 } });
      await expect(popupContainer).not.toBeVisible();

      await questionDropdownV2Select.click({ position: { x: dropdownWidth - 20, y: 20 } });
      await expect(popupContainer).toBeVisible();

      await page.locator("body").click({ position: { x: 600, y: 20 } });
      await expect(popupContainer).not.toBeVisible();
    });

    test("Dropdown should not be open when disabled", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 600 });
      const json = {
        pages: [
          {
            name: "page1",
            elements: [
              {
                type: "boolean",
                name: "Editable",
                defaultValueExpression: "false"
              },
              {
                type: "dropdown",
                name: "Dropdown",
                enableIf: "{Editable} = true",
                choices: ["Item 1", "Item 2", "Item 3"]
              }
            ]
          }
        ]
      };
      await initSurvey(page, framework, json);

      const questionDropdownV2Select = page.locator(".sd-dropdown");
      const popupContainer = page.locator(".sv-popup__container").filter({ visible: true });
      await questionDropdownV2Select.click({ force: true });
      await expect(popupContainer).not.toBeVisible();

      await page.locator(".sd-boolean__label").filter({ hasText: "Yes" }).click();
      await expect(page.locator(".sd-boolean__thumb-text").filter({ hasText: "Yes" })).toBeVisible();
      await expect(popupContainer).not.toBeVisible();
    });

    test("autoFocusFirstError bricks dropdown popup if any errors are on the same page", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 600 });
      const json = {
        pages: [
          {
            name: "Seite1",
            elements: [
              {
                type: "dropdown",
                name: "Anrede",
                title: "Anrede",
                choices: [
                  { value: "Item 1", text: "Frau", },
                  { value: "Item 2", text: "Herr", },
                  { value: "Item 3", text: "keine Angabe", },
                  { value: "Item 4", text: "Divers", },
                  { value: "Item 5", text: "Firma", },
                ],
              },
              {
                type: "text",
                name: "Nachname",
                title: "Nachname",
                isRequired: true,
              },
            ],
          },
        ],
        autoFocusFirstError: true,
      };
      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        window["survey"].onValueChanged.add((surveyModel) => { surveyModel.hasErrors(false, true); });
        window["survey"].fromJSON(json);
      }, json);

      const questionDropdownV2Select = page.locator(".sd-dropdown");
      const popupContainer = page.locator(".sv-popup__container").filter({ visible: true });
      const textQuestion = page.locator(".sd-input.sd-text");
      await expect(textQuestion).not.toBeFocused();

      await questionDropdownV2Select.click();
      await expect(popupContainer).toBeVisible();

      await getVisibleListItemByText(page, "Herr").click();
      await expect(textQuestion).toBeFocused();
      await expect(popupContainer).not.toBeVisible();
    });

    test("Fix react dropdown value after matrix row re-render #9001", async ({ page }) => {
      if (framework == "vue") return;
      const json = {
        elements: [
          {
            "type": "matrixdynamic",
            "name": "question1",
            "columns": [
              {
                "name": "Column 1"
              },
              {
                "name": "Column 2",
                "visibleIf": "{row.Column 1} notempty"
              },
              {
                "name": "Column 3",
                "visibleIf": "{row.Column 1} notempty"
              }
            ],
            "choices": [
              "itemone",
              "itemtwo"
            ]
          }
        ]
      };
      await initSurvey(page, framework, json);

      await page.locator(".sd-dropdown").first().click();
      await getVisibleListItemByText(page, "itemone").click();

      expect(await page.locator(".sd-dropdown input").first().inputValue()).toBe("itemone");
    });

    test("Do not clear comment area on clicking Clear button #8287", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 600 });
      const json = {
        elements: [
          {
            type: "dropdown",
            name: "q1",
            choices: ["item1", "item2", "item3"],
            showCommentArea: true
          }
        ]
      };
      await initSurvey(page, framework, json);
      await page.locator(".sd-dropdown").click();
      await page.locator(".sv-list__item span").filter({ hasText: "item2" }).filter({ visible: true }).click();
      await page.locator("textarea").fill("ABC");
      await page.locator(".sd-editor-clean-button").click();
      await page.locator("input[value=Complete]").click();

      let surveyResult = await getSurveyResult(page);
      expect(surveyResult).toEqual({ "q1-Comment": "ABC" });
    });

    test("Move to comment on choosing other #8878", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 600 });
      const json = {
        elements: [{
          type: "matrixdropdown",
          name: "q1",
          columns: [
            {
              name: "col1",
              cellType: "dropdown",
              showOtherItem: true,
              choices: [1, 2, 3],
              otherText: "Other"
            }
          ],
          "rows": ["row1"]
        }]
      };
      await initSurvey(page, framework, json);
      await page.locator(".sd-dropdown").click();
      await getVisibleListItemByText(page, "Other").click();
      await expect(page.getByRole("textbox", { name: "row row1, column col1" })).toBeFocused();
      await page.keyboard.type("ABC");
      await page.locator(".sd-navigation__complete-btn").click();

      let surveyResult = await getSurveyResult(page);
      expect(surveyResult).toEqual({ q1: { row1: { col1: "other", "col1-Comment": "ABC" } } });
    });

    test("Check item title changes when locale is changed", async ({ page }) => {
      const json = {
        locale: "de",
        elements: [
          {
            defaultValue: "one",
            choices: [
              {
                text: {
                  default: "english",
                  de: "notenglish",
                },
                value: "one",
              },
            ],
            name: "q1",
            title: {
              default: "english",
              de: "notenglish",
            },
            type: "dropdown",
          },
        ],
      };
      await initSurvey(page, framework, json);

      const dropdown = page.locator("input").first();
      await expect(page.locator(".sd-dropdown__value").locator("span").filter({ hasText: "notenglish" })).toBeVisible();
      await dropdown.focus();
      await dropdown.click();
      await expect(page.locator("li div[title='notenglish']")).toBeVisible();
      await expect(page.locator("li div span").filter({ hasText: "notenglish" })).toBeVisible();
      await page.locator("body").click({ position: { x: 0, y: 0 } });
      await page.evaluate((locale) => {
        window.survey.locale = locale;
      }, "en");
      await expect(page.locator(".sd-dropdown__value").locator("span").filter({ hasText: "english" })).toBeVisible();
      await dropdown.focus();
      await dropdown.click();
      await expect(page.locator("li div[title='english']")).toBeVisible();
      await expect(page.locator("li div span").filter({ hasText: "english" })).toBeVisible();
      await page.locator("body").click({ position: { x: 0, y: 0 } });
      await page.evaluate((locale) => {
        window.survey.locale = locale;
      }, "de");
      await expect(page.locator(".sd-dropdown__value").locator("span").filter({ hasText: "notenglish" })).toBeVisible();
      await dropdown.focus();
      await dropdown.click();
      await expect(page.locator("li div[title='notenglish']")).toBeVisible();
      await expect(page.locator("li div span").filter({ hasText: "notenglish" })).toBeVisible();
      await page.locator("body").click({ position: { x: 0, y: 0 } });
    });

    test("Save filter string after popup is closed", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 600 });
      const json = {
        elements: [
          {
            type: "dropdown",
            name: "car",
            title: "What car are you driving?",
            choices: ["None", "Ford", "Vauxhall", "Volkswagen", "Nissan", "Audi", "Mercedes-Benz", "BMW", "Peugeot", "Toyota", "Citroen"],
          },
          {
            type: "checkbox",
            name: "question1",
            choices: ["item1", "item2", "item3", "item4", "item5", "item6", "item7", "item8", "item9", "item10", "item11", "item12", "item13", "item14", "item15"]
          }
        ],
      };
      await initSurvey(page, framework, json);
      const popup = page.locator(".sv-popup__container");

      await page.locator(".sd-dropdown__filter-string-input").focus();
      await page.keyboard.type("ot");

      await expect(popup).toBeVisible();
      await expect(page.locator(".sv-list__item").filter({ visible: true })).toHaveCount(2);
      expect(await page.locator(".sd-dropdown").textContent()).toEqual("PeugeotSelect");

      await page.getByRole("button", { name: "Select" }).click();
      await expect(popup).toBeHidden();
      expect(await page.locator(".sd-dropdown").textContent()).toEqual("PeugeotSelect");

      await page.getByRole("button", { name: "Select" }).click();
      await expect(popup).toBeVisible();
      expect(await page.locator(".sd-dropdown").textContent()).toEqual("PeugeotSelect");
      await expect(page.locator(".sv-list__item").filter({ visible: true })).toHaveCount(2);

      await page.mouse.wheel(0, 20);
      await expect(popup).toBeHidden();
      expect(await page.locator(".sd-dropdown").textContent()).toEqual("PeugeotSelect");

      await page.getByRole("button", { name: "Select" }).click();
      await expect(popup).toBeVisible();
      expect(await page.locator(".sd-dropdown").textContent()).toEqual("PeugeotSelect");
      await expect(page.locator(".sv-list__item").filter({ visible: true })).toHaveCount(2);
    });
    test("Dropdown with lazyLoadEnabled and onGetChoicesDisplayValue event - #10302", async({ page }) => {
      const json = {
        "elements": [
          {
            "type": "dropdown",
            "name": "test",
            "title": "test",
            "isRequired": true,
            "defaultValue": "test",
            "choicesLazyLoadEnabled": true,
          }
        ]
      };
      await initSurvey(page, framework, json, undefined, undefined, async () => {
        await page.evaluate(() => {
          (window as any).survey.onGetChoiceDisplayValue.add((_, options) => {
            setTimeout(() => options.setItems(["Test"]));
          });
        });
      });
      expect(await page.locator(".sd-dropdown__value", { hasText: "Test" }).isVisible()).toBeTruthy();
    });
    test("Dropdown other text is displayed after selection - #10942", async({ page }) => {
      const json = {
        name: "page1",
        elements: [
          {
            type: "dropdown",
            name: "q1",
            title: "q1",
            choices: ["Item 1", "Item 2", "Item 3"],
            showOtherItem: true,
          },
        ],
      };
      await initSurvey(page, framework, json);

      const dropdown = page.locator(".sd-dropdown");
      const filterInputString = page.locator(".sd-dropdown__filter-string-input");
      const item = page.locator(".sv-list__item span");
      const body = page.locator("body");
      expect(await filterInputString.inputValue()).toBe("");

      await dropdown.click();
      await item.filter({ hasText: "Item 1" }).filter({ visible: true }).click();
      expect(filterInputString).toBeFocused();
      expect(await filterInputString.inputValue()).toBe("Item 1");
      expect(await page.locator(".sd-dropdown__value").innerText()).toBe("");
      await body.click({ position: { x: 0, y: 0 } });
      expect(filterInputString).not.toBeFocused();
      expect(await filterInputString.inputValue()).toBe("");
      expect(await page.locator(".sd-dropdown__value").innerText()).toBe("Item 1");

      await dropdown.click();
      await item.filter({ hasText: "Other (describe)" }).filter({ visible: true }).click();
      await page.waitForTimeout(1000);
      expect(filterInputString).not.toBeFocused();
      expect(await filterInputString.inputValue()).toBe("Other (describe)");
      expect(await page.locator(".sd-dropdown__value").innerText()).toBe("");
      await dropdown.click();
      expect(filterInputString).toBeFocused();
      expect(await filterInputString.inputValue()).toBe("Other (describe)");
      expect(await page.locator(".sd-dropdown__value").innerText()).toBe("");

      await body.click({ position: { x: 0, y: 0 } });

      await dropdown.click();
      await item.filter({ hasText: "Item 2" }).filter({ visible: true }).click();
      expect(filterInputString).toBeFocused();
      expect(await filterInputString.inputValue()).toBe("Item 2");
      expect(await page.locator(".sd-dropdown__value").innerText()).toBe("");
      await body.click({ position: { x: 0, y: 0 } });
      expect(filterInputString).not.toBeFocused();
      expect(await filterInputString.inputValue()).toBe("");
      expect(await page.locator(".sd-dropdown__value").innerText()).toBe("Item 2");
    });
  });
});

