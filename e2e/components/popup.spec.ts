import { frameworks, initSurvey, url, test, expect } from "../helper";

const title = "Popup";

const json = {
  autoFocusFirstQuestion: true,
  elements: [
    {
      type: "text",
      name: "actions_question"
    }
  ]
};

export async function disposeSurvey(page, framework) {
  await page.evaluate((framework) => {
    if (framework === "vue") {
      window["vueApp"].$destroy();
      window["vueApp"].$el.parentNode.removeChild(window["vueApp"].$el);
    }
    if (framework === "react") {
      window["root"].unmount();
    }
    if (framework === "angular" || framework === "vue3") {
      window["setSurvey"](undefined);
    }
    window["survey"].dispose();
  }, framework);
}

frameworks.forEach((framework) => {
  test.describe(title + " - " + framework, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await page.setViewportSize({ width: 800, height: 600 });
    });

    test("check ordinary popup behavior", async ({ page }) => {
      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        window["survey"].onGetQuestionTitleActions.add((_, opt) => {
          const item = window["Survey"].createDropdownActionModel(
            { title: "Click", showTitle: true },
            { items: [new window["Survey"].Action({ title: "Item 1" })] }
          );
          opt.titleActions = [item];
        });
        window["survey"].fromJSON(json);
      }, json);

      const popupSelector = page.locator(".sv-popup .sv-popup__container").first();
      const clickButton = page.locator(".sd-action").first();

      await expect(popupSelector).not.toBeVisible();
      await clickButton.click();
      await expect(popupSelector).toBeVisible();
      await expect(page.locator(".sv-popup span").getByText("Item 1")).toBeVisible();

      const popupClientRect = await popupSelector.boundingBox();
      const itemClientRect = await clickButton.boundingBox();

      expect(Math.round(itemClientRect.x - 8 - popupClientRect.width)).toBe(Math.round(popupClientRect.x));
      expect(Math.round(itemClientRect.y)).toBe(Math.round(popupClientRect.y));

      // Close popup
      await page.locator(".sv-popup.sv-popup--menu-popup").first().click({ position: { x: 100, y: 100 } });
      await expect(popupSelector).not.toBeVisible();
      await clickButton.click();
      await expect(popupSelector).toBeVisible();
      await expect(clickButton).toHaveClass(/sd-action--pressed/);

      await page.keyboard.press("Escape");
      await expect(popupSelector).not.toBeVisible();
      await expect(clickButton).not.toHaveClass(/sd-action--pressed/);

      await clickButton.click();
      await expect(popupSelector).toBeVisible();
      await page.mouse.click(10, 10);
      await expect(popupSelector).not.toBeVisible();

      await disposeSurvey(page, framework);
      await expect(popupSelector).not.toBeVisible();
    });

    test("check popup blur callback", async ({ page }) => {
      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        window["survey"].onGetQuestionTitleActions.add((_, opt) => {
          const item = window["Survey"].createDropdownActionModel(
            { title: "Click", showTitle: true },
            { onBlur: () => { window["testVariable"] = "ok"; }, items: [new window["Survey"].Action({ title: "Item 1" })] }
          );
          opt.titleActions = [item];
        });
        window["survey"].fromJSON(json);
      }, json);

      const popupSelector = page.locator(".sv-popup .sv-popup__container").first();
      const clickButton = page.locator(".sd-action").first();

      await expect(popupSelector).not.toBeVisible();
      await clickButton.click();
      await expect(popupSelector).toBeVisible();
      await page.locator("body").click();
      const testVariable = await page.evaluate(() => window["testVariable"]);
      expect(testVariable).toBe("ok");
    });

    test("check ordinary popup when isVisible is changed twice", async ({ page }) => {
      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        window["survey"].onGetQuestionTitleActions.add((_, opt) => {
          const item = window["Survey"].createDropdownActionModel(
            { title: "Click", showTitle: true },
            { items: [new window["Survey"].Action({ title: "Item 1" })] }
          );
          opt.titleActions = [item];
        });
        window["survey"].fromJSON(json);
      }, json);

      const popupSelector = page.locator(".sv-popup .sv-popup__container").first();
      const clickButton = page.locator(".sd-action").first();

      await clickButton.click();
      await expect(popupSelector).toBeVisible();

      await page.evaluate(() => {
        const action = window["survey"].getAllQuestions()[0].titleActions[0];
        action.action();
        action.action();
      });

      const popupClientRect = await popupSelector.boundingBox();
      const itemClientRect = await clickButton.boundingBox();

      expect(Math.round(itemClientRect.x - 8 - popupClientRect.width)).toBe(Math.round(popupClientRect.x));
      expect(Math.round(itemClientRect.y)).toBe(Math.round(popupClientRect.y));
    });

    test("check showPointer popup position", async ({ page }) => {
      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        window["survey"].onGetQuestionTitleActions.add((_, opt) => {
          const item = window["Survey"].createDropdownActionModel(
            { title: "Click", showTitle: true },
            { items: [new window["Survey"].Action({ title: "Item 1" })] }
          );
          opt.titleActions = [item];
        });
        window["survey"].fromJSON(json);
      }, json);
      await page.waitForTimeout(1000);
      await page.evaluate(() => {
        const style = (window as any).survey.rootElement.getRootNode().querySelector(".sv-popup__container").style;
        style.marginLeft = "4px";
        style.marginRight = "4px";
      });

      const popupSelector = page.locator(".sv-popup .sv-popup__container").first();
      const clickButton = page.locator(".sd-action").first();

      await expect(popupSelector).not.toBeVisible();
      await clickButton.click();
      await expect(popupSelector).toBeVisible();
      await expect(page.locator(".sv-popup span").getByText("Item 1")).toBeVisible();

      const popupClientRect = await popupSelector.boundingBox();
      const popupPointerClientRect = await popupSelector.locator(".sv-popup__pointer").boundingBox();
      expect(Math.abs(popupClientRect.x + popupClientRect.width - popupPointerClientRect.x)).toBeLessThanOrEqual(1.0);
    });

    test("check closeButton in showDialog", async ({ page }) => {
      await initSurvey(page, framework, {});
      await expect(page.locator(".sd-body--empty")).toBeVisible();
      await page.evaluate(() => {
        const locStr = new window["Survey"].LocalizableString(undefined, false);
        locStr.defaultValue = "Message";
        window["Survey"].settings.showDialog({
          componentName: "sv-string-viewer",
          data: { locStr: locStr, locString: locStr, model: locStr }, //TODO fix in library
          showCloseButton: true,
        }, window["survey"].rootElement);
      });

      const popupModalSelector = page.locator(".sv-popup.sv-popup--modal-popup").first();
      const closeButton = page.locator(".sv-popup__close-button").first();
      await expect(popupModalSelector).toBeVisible();
      await closeButton.click();
      await expect(popupModalSelector).not.toBeVisible();
    });

    test("check string viewer component in showDialog", async ({ page }) => {
      await initSurvey(page, framework, {});
      await expect(page.locator(".sd-body--empty")).toBeVisible();
      await page.evaluate(() => {
        const locStr = new window["Survey"].LocalizableString(undefined, false);
        locStr.defaultValue = "Message";
        window["Survey"].settings.showDialog({
          componentName: "sv-string-viewer",
          data: { model: locStr, textClass: "text-class" },
        }, window["survey"].rootElement);
      });

      const popupModalSelector = page.locator(".sv-popup.sv-popup--modal-popup").first();
      await expect(popupModalSelector).toBeVisible();
      await expect(page.locator(".sv-popup__content span")).toContainText("Message");
      await expect(page.locator(".sv-popup__content span")).toHaveClass("text-class");
    });

    test("check icon component in showDialog", async ({ page }) => {
      await initSurvey(page, framework, {});
      await expect(page.locator(".sd-body--empty")).toBeVisible();
      await page.evaluate(() => {
        window["Survey"].settings.showDialog({
          componentName: "sv-svg-icon",
          data: { iconName: "icon-test", className: "test-class" },
        }, window["survey"].rootElement);
      });

      const popupModalSelector = page.locator(".sv-popup.sv-popup--modal-popup").first();
      await expect(popupModalSelector).toBeVisible();
      await expect(page.locator(".sv-popup__content svg use")).toHaveAttribute("xlink:href", "#icon-test");
      await expect(page.locator(".sv-popup__content svg")).toHaveClass("sv-svg-icon test-class");

      await page.getByText("Cancel").click();
      await page.evaluate(() => {
        window["Survey"].settings.showDialog({
          componentName: "sv-svg-icon",
          data: { iconName: "icon-test", css: "test-class" },
        }, window["survey"].rootElement);
      });

      await expect(popupModalSelector).toBeVisible();
      await expect(page.locator(".sv-popup__content svg use")).toHaveAttribute("xlink:href", "#icon-test");
      await expect(page.locator(".sv-popup__content svg")).toHaveClass("test-class");
    });

    test("check survey in showModal", async ({ page }) => {
      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        window["survey"].onGetQuestionTitleActions.add((_, opt) => {
          const _json = { elements: [{ type: "text", name: "modal_question" }] };
          const item = new window["Survey"].Action({
            component: "sv-action-bar-item",
            title: "Click",
            showTitle: true,
            action: () => {
              const model = new window["Survey"].Model(_json);
              model.autoFocusFirstQuestion = false;
              window["Survey"].settings.showDialog({
                componentName: "survey",
                data: {
                  model: model,
                  survey: model
                }
              });
            }
          });
          opt.titleActions = [item];
        });
        window["survey"].fromJSON(json);
      }, json);

      const popupModalSelector = page.locator(".sv-popup.sv-popup--modal-popup").first();
      const clickButton = page.locator(".sd-action").first();
      const popupButtonSelector = page.locator(".sv-popup__button").first();

      await expect(popupModalSelector).not.toBeVisible();
      await clickButton.click();
      await expect(popupModalSelector).toBeVisible();
      await expect(page.locator(".sv-popup span").getByText("modal_question")).toBeVisible();

      const popupClientRect = await popupModalSelector.locator(".sv-popup__container").boundingBox();
      const paddingDiff = 32;
      const calcTop = Math.round((600 / 2 - paddingDiff / 2 - popupClientRect.height / 2) * 10) / 10;
      const calcLeft = Math.round((800 / 2 - popupClientRect.width / 2) * 10) / 10;

      expect(Math.abs(popupClientRect?.x - calcLeft)).toBeLessThanOrEqual(0.1);
      expect(Math.abs(popupClientRect?.y - calcTop)).toBeLessThanOrEqual(0.1);

      // Try close popup
      await popupModalSelector.click({ position: { x: 50, y: 50 } });
      await expect(popupModalSelector).toBeVisible();

      await popupButtonSelector.getByText("Cancel").click();
      await expect(popupModalSelector).not.toBeVisible();

      await clickButton.click();
      await expect(popupModalSelector).toBeVisible();
      await page.waitForTimeout(1000);
      await page.keyboard.press("Escape");
      await page.waitForTimeout(1000);
      await expect(popupModalSelector).not.toBeVisible();
    });

    test("check focus trap", async ({ page }) => {
      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        window["survey"].onGetQuestionTitleActions.add((_, opt) => {
          const _json = { elements: [{ type: "text", name: "modal_question" }] };
          const item = new window["Survey"].Action({
            component: "sv-action-bar-item",
            title: "Click",
            showTitle: true,
            action: () => {
              const model = new window["Survey"].Model(_json);
              model.autoFocusFirstQuestion = false;
              window["Survey"].settings.showDialog({
                componentName: "survey",
                data: {
                  model: model,
                  survey: model
                }
              });
            }
          });
          opt.titleActions = [item];
        });
        window["survey"].fromJSON(json);
      }, json);

      const inputInPopup = page.locator(".sv-popup .sd-text");
      const clickButton = page.locator(".sd-action").first();

      await clickButton.click();
      await expect(inputInPopup).toBeFocused();
      await page.keyboard.press("Tab");
      await expect(page.locator(".sv-popup .sd-navigation__complete-btn")).toBeFocused();
      await page.keyboard.press("Tab");
      await expect(page.locator(".sv-popup__button--cancel")).toBeFocused();
      await page.keyboard.press("Tab");
      await expect(page.locator(".sv-popup__button--apply")).toBeFocused();
      await page.keyboard.press("Tab");
      await expect(inputInPopup).toBeFocused();
      await page.keyboard.press("Shift+Tab");
      await expect(page.locator(".sv-popup__button--apply")).toBeFocused();
    });

    test("check focus safekeeping", async ({ page }) => {
      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        window["survey"].onGetQuestionTitleActions.add((_, opt) => {
          const _json = { elements: [{ type: "text", name: "modal_question" }] };
          const item = new window["Survey"].Action({
            component: "sv-action-bar-item",
            title: "Click",
            showTitle: true,
            action: () => {
              const model = new window["Survey"].Model(_json);
              model.autoFocusFirstQuestion = false;
              window["Survey"].settings.showDialog({
                componentName: "survey",
                data: {
                  model: model,
                  survey: model
                }
              });
            }
          });
          opt.titleActions = [item];
        });
        window["survey"].fromJSON(json);
      }, json);

      const inputInPopup = page.locator(".sv-popup .sd-text");
      const clickButton = page.locator(".sd-action").first();
      const popupModalSelector = page.locator(".sv-popup.sv-popup--modal-popup");

      await expect(clickButton).not.toBeFocused();

      await clickButton.click();
      await expect(popupModalSelector).toBeVisible();
      await expect(inputInPopup).toBeFocused();

      await page.keyboard.press("Escape");
      await expect(popupModalSelector).not.toBeVisible();
      await expect(clickButton).toBeFocused();
    });

    test("hide popup after scroll", async ({ page }) => {
      let choices: Array<string> = [];
      for (let index = 0; index < 50; index++) {
        choices[index] = "item" + index;
      }

      let currentJson = { elements: [{ type: "checkbox", name: "Checks", title: "Checks", choices: choices }] };
      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        window["survey"].onGetQuestionTitleActions.add((_, opt) => {
          const item = window["Survey"].createDropdownActionModel(
            { title: "Click", showTitle: true },
            { items: [new window["Survey"].Action({ title: "Item 1" })] }
          );
          opt.titleActions = [item];
        });
        window["survey"].fromJSON(json);
      }, currentJson);

      const popupSelector = page.locator(".sv-popup .sv-popup__container").first();
      const clickButton = page.locator(".sd-action").first();

      await expect(popupSelector).not.toBeVisible();
      await clickButton.click();
      await expect(popupSelector).toBeVisible();
      await page.mouse.wheel(0, 1000);
      await expect(popupSelector).not.toBeVisible();
    });

    test("not hide modal popup after scroll", async ({ page }) => {
      let choices: Array<string> = [];
      for (let index = 0; index < 50; index++) {
        choices[index] = "item" + index;
      }

      let currentJson = { elements: [{ type: "checkbox", name: "Checks", title: "Checks", choices: choices }] };
      //   await initSurvey(page, framework, currentJson, false, { onGetQuestionTitleActions: addModalPopupTitleAction });
      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        window["survey"].onGetQuestionTitleActions.add((_, opt) => {
          const json = { elements: [{ type: "text", name: "modal_question" }] };
          const item = new window["Survey"].Action({
            component: "sv-action-bar-item",
            title: "Click",
            showTitle: true,
            action: () => {
              const model = new window["Survey"].Model(json);
              model.autoFocusFirstQuestion = false;
              window["Survey"].settings.showDialog({
                componentName: "survey",
                data: {
                  model: model,
                  survey: model
                }
              });
            }
          });
          opt.titleActions = [item];
        });
        window["survey"].fromJSON(json);
      }, currentJson);

      const popupModalSelector = page.locator(".sv-popup.sv-popup--modal-popup");
      const clickButton = page.locator(".sd-action").first();

      await expect(popupModalSelector).not.toBeVisible();
      await clickButton.click();
      await expect(popupModalSelector).toBeVisible();
      await page.mouse.wheel(0, 1000);
      await expect(popupModalSelector).toBeVisible();
    });

    test("navigate between list items", async ({ page }) => {
      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        window["survey"].onGetQuestionTitleActions.add((_, opt) => {
          let items: Array<any> = [];
          for (let index = 0; index < 10; index++) {
            items[index] = new window["Survey"].Action({ title: "item" + index });
          }
          const item = window["Survey"].createDropdownActionModel(
            { title: "Click", showTitle: true },
            { items: items }
          );
          opt.titleActions = [item];
        });
        window["survey"].fromJSON(json);
      }, json);

      const listItems = page.locator(".sv-list__item").filter({ visible: true });
      const popupSelector = page.locator(".sv-popup .sv-popup__container").first();
      const clickButton = page.locator(".sd-action").first();

      await page.waitForTimeout(500);
      await page.keyboard.press("Shift+Tab");
      await expect(clickButton).toBeFocused();
      await page.keyboard.press("Enter");
      await expect(popupSelector).toBeVisible();

      await expect(listItems).toHaveCount(10);
      await expect(listItems.first()).toBeFocused();

      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("ArrowDown");
      await expect(listItems.nth(2)).toBeFocused();

      await page.keyboard.press("ArrowUp");
      await page.keyboard.press("ArrowUp");
      await page.keyboard.press("ArrowUp");
      await expect(listItems.nth(9)).toBeFocused();

      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      await expect(listItems.nth(1)).toBeFocused();

      await page.keyboard.press("Shift+Tab");
      await page.keyboard.press("Shift+Tab");
      await expect(listItems.nth(9)).toBeFocused();
    });

    test("check popup on the same click", async ({ page }) => {
      await page.evaluate(() => {
        const container = document.createElement("div");
        container.style.height = "200px";
        // eslint-disable-next-line surveyjs/eslint-plugin-i18n/allowed-in-shadow-dom
        const surveyEl = document.getElementById("surveyElement");
        // eslint-disable-next-line surveyjs/eslint-plugin-i18n/allowed-in-shadow-dom
        surveyEl?.parentElement?.insertBefore(container, document.getElementById("surveyElement"));
      });

      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        window["survey"].onGetQuestionTitleActions.add((_, opt) => {
          let items: Array<any> = [];
          for (let index = 0; index < 20; index++) {
            items[index] = new window["Survey"].Action({ title: "item" + index });
          }
          const item = window["Survey"].createDropdownActionModel(
            { title: "Click", showTitle: true },
            { items: items }
          );
          opt.titleActions = [item];
        });
        window["survey"].fromJSON(json);
      }, json);

      const popupSelector = page.locator(".sv-popup .sv-popup__container").first();
      const clickButton = page.locator(".sd-action").first();

      await clickButton.click();
      await expect(popupSelector).toBeVisible();
      expect(await popupSelector.evaluate(el => el.offsetHeight)).toBe(304);
      // Close popup
      await popupSelector.click({ position: { x: 100, y: 100 } });
      await expect(popupSelector).not.toBeVisible();
      await clickButton.click();
      await expect(popupSelector).toBeVisible();
      expect(await popupSelector.evaluate(el => el.offsetHeight)).toBe(304);
    });

    test("check popup with filter", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 800 });

      await page.evaluate(() => {
        const container = document.createElement("div");
        container.style.height = "200px";
        // eslint-disable-next-line surveyjs/eslint-plugin-i18n/allowed-in-shadow-dom
        const surveyEl = document.getElementById("surveyElement");
        // eslint-disable-next-line surveyjs/eslint-plugin-i18n/allowed-in-shadow-dom
        surveyEl?.parentElement?.insertBefore(container, document.getElementById("surveyElement"));
      });

      const _json = {
        elements: [
          { type: "text", name: "q1" },
          { type: "text", name: "q2" },
          { type: "text", name: "actions_question" }
        ]
      };
      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        window["survey"].onGetQuestionTitleActions.add((_, opt) => {
          if (opt.question.name !== "actions_question") return;

          let items: Array<any> = [];
          for (let index = 0; index < 20; index++) {
            items[index] = new window["Survey"].Action({ title: "item" + index });
          }
          const item = window["Survey"].createDropdownActionModel(
            { title: "Click", showTitle: true },
            { items: items }
          );
          opt.titleActions = [item];
        });
        window["survey"].fromJSON(json);
      }, _json);

      const popupSelector = page.locator(".sv-popup .sv-popup__container").first();
      const clickButton = page.locator(".sd-action").first();
      const popupHeight = 672;

      await clickButton.click();
      await expect(popupSelector).toBeVisible();

      let actualPopupHeight = await popupSelector.evaluate(el => el.offsetHeight);
      expect(Math.abs(actualPopupHeight - popupHeight)).toBeLessThanOrEqual(1.0);

      await page.locator(".sv-list__input").fill("2");
      actualPopupHeight = await popupSelector.evaluate(el => el.offsetHeight);
      expect(Math.abs(actualPopupHeight - popupHeight)).toBeLessThanOrEqual(1.0);
      // Close popup
      await page.locator(".sv-popup").first().click({ position: { x: 100, y: 100 } });
      await expect(popupSelector).not.toBeVisible();
      await clickButton.click();
      await expect(popupSelector).toBeVisible();
      actualPopupHeight = await popupSelector.evaluate(el => el.offsetHeight);
      expect(Math.abs(actualPopupHeight - popupHeight)).toBeLessThanOrEqual(1.0);
    });

    test("list model", async ({ page }) => {
      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        window["survey"].onGetQuestionTitleActions.add((_, opt) => {
          const getItems = (count, startIndex = 0) => {
            const list: Array<any> = [];
            for (let index = startIndex; index < count; index++) {
              list[index - startIndex] = new window["Survey"].Action({ id: index, title: "item" + index, needSeparator: index % 4 == 1 });
            }
            return list;
          };
          const dropdownWithSearchAction = window["Survey"].createDropdownActionModel(
            { title: "Long List", showTitle: true },
            { items: getItems(40), showPointer: true }
          );
          opt.titleActions = [dropdownWithSearchAction];
        });
        window["survey"].fromJSON(json);
      }, json);

      const listItems = page.locator(".sv-list__item").filter({ visible: true });

      await page.locator(".sd-action").first().click();
      await expect(page.locator(".sv-list__input")).toBeFocused();
      await expect(listItems).toHaveCount(40);

      await page.keyboard.press("1");
      const listItem1 = listItems.first();
      await expect(listItems).toHaveCount(13);
      await expect(listItem1).toHaveText("item1");
      await expect(listItem1).not.toBeFocused();

      await page.keyboard.press("ArrowDown");
      await expect(listItem1).toHaveText("item1");
      await expect(listItem1).toBeFocused();
    });

    test("popup with subitems", async ({ page }) => {
      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        window["survey"].onGetQuestionTitleActions.add((_, opt) => {
          let subitems: Array<any> = [];
          for (let index = 0; index < 7; index++) {
            subitems[index] = { id: index, title: "inner item" + index };
          }

          let items: Array<any> = [];
          for (let index = 0; index < 40; index++) {
            items[index] = new window["Survey"].Action({ id: index, title: "item" + index });
          }
          items[5].setSubItems({ items: [...subitems] });
          items[5].title += " has items";
          items[6].setSubItems({ items: [...subitems] });
          items[6].title += " has items";

          const dropdownWithSearchAction = window["Survey"].createDropdownActionModel(
            { title: "Subitems", showTitle: true },
            {
              items: items,
              showPointer: true,
              verticalPosition: "bottom",
              horizontalPosition: "center",
              onSelectionChanged: (item, ...params) => {
                let value = item.id;
              }
            }
          );
          opt.titleActions = [dropdownWithSearchAction];
        });
        window["survey"].fromJSON(json);
      }, json);

      const titlePopup = page.locator(".sv-popup.sv-popup--show-pointer .sv-popup__container").first();
      const item5 = page.locator(".sv-list__item-body").getByText("item5 has items");
      const item6 = page.locator(".sv-list__item-body").getByText("item6 has items");
      const item5Subitems = page.locator(".sv-list__item--group .sv-popup .sv-popup__container").first();
      const item6Subitems = page.locator(".sv-list__item--group .sv-popup .sv-popup__container").nth(1);

      await expect(titlePopup).not.toBeVisible();
      await expect(item5Subitems).not.toBeVisible();
      await expect(item6Subitems).not.toBeVisible();

      await page.locator(".sd-action").first().click();
      await expect(titlePopup).toBeVisible();
      await expect(item5Subitems).not.toBeVisible();
      await expect(item6Subitems).not.toBeVisible();

      await item5.hover();
      await page.waitForTimeout(300);
      await expect(titlePopup).toBeVisible();
      await expect(item5Subitems).toBeVisible();
      await expect(item6Subitems).not.toBeVisible();

      await item6.hover();
      await page.waitForTimeout(300);
      await expect(titlePopup).toBeVisible();
      await expect(item5Subitems).not.toBeVisible();
      await expect(item6Subitems).toBeVisible();

      await titlePopup.locator(".sv-list").first().evaluate(el => el.scrollBy(0, 1000));
      await page.waitForTimeout(300);
      await expect(titlePopup).toBeVisible();
      await expect(item5Subitems).not.toBeVisible();
      await expect(item6Subitems).not.toBeVisible();

      await titlePopup.locator(".sv-list").first().evaluate(el => el.scrollBy(0, -1000));
      await item5.hover();
      await page.waitForTimeout(300);
      await expect(titlePopup).toBeVisible();
      await expect(item5Subitems).toBeVisible();
      await expect(item6Subitems).not.toBeVisible();

      await expect(page.locator(".sv-list__item").getByText("inner item1")).toHaveCount(2);
      await page.locator(".sv-list__item").getByText("inner item1").first().click();
      await page.waitForTimeout(300);
      await expect(titlePopup).toBeVisible();
      await expect(item5Subitems).not.toBeVisible();
      await expect(item6Subitems).not.toBeVisible();

      await item6.click();
      await page.waitForTimeout(300);
      await expect(titlePopup).not.toBeVisible();
      await expect(item5Subitems).not.toBeVisible();
      await expect(item6Subitems).not.toBeVisible();
    });
    test("Check multiple modal windows", async ({ page }) => {
      await initSurvey(page, framework, {
        elements: [
          {
            name: "q1",
            type: "text"
          }
        ]
      }, false, undefined, async () => {
        await page.evaluate(() => {
          window["survey"].onGetQuestionTitleActions.add((_, options) => {
            const actionsContainer = new window["Survey"].ActionContainer();
            actionsContainer.addAction(new window["Survey"].Action({
              title: "Show Message",
              action: () => {
                window["Survey"].settings.confirmActionAsync("message", () => { });
              }
            }));
            options.actions.push(new window["Survey"].Action({
              title: "Show Action Bar",
              action: () => {
                window["Survey"].settings.showDialog(<any>{
                  componentName: "sv-action-bar",
                  data: {
                    model: actionsContainer
                  },
                });
              }
            }));
          });
        });
      });
      const showActionBarLocator = page.locator("button[title='Show Action Bar']");
      const showMessageLocator = page.locator("button[title='Show Message']");
      const popupModalLocator = page.locator("body > div > .sv-popup--modal-popup, body > div > sv-ng-popup-container > .sv-popup--modal-popup");
      const cancelLocator = page.locator("button[title='Cancel']");
      const messageLocator = page.locator("span").getByText("message", { exact: true });
      await showActionBarLocator.click();
      expect(await popupModalLocator.count()).toBe(1);
      await expect(showMessageLocator).toBeVisible({ visible: true });
      await expect(messageLocator).toBeVisible({ visible: false });
      await showMessageLocator.click();
      expect(await popupModalLocator.count()).toBe(2);
      await expect(showMessageLocator).toBeVisible({ visible: true });
      await expect(messageLocator).toBeVisible({ visible: true });
      await cancelLocator.nth(1).click();
      expect(await popupModalLocator.count()).toBe(1);
      await expect(showMessageLocator).toBeVisible({ visible: true });
      await expect(messageLocator).toBeVisible({ visible: false });
      await cancelLocator.click();
      expect(await popupModalLocator.count()).toBe(0);
      await expect(showMessageLocator).toBeVisible({ visible: false });
      await expect(messageLocator).toBeVisible({ visible: false });
    });
  });
});