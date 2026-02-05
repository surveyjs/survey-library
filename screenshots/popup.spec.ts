import { test, expect } from "@playwright/test";
import { frameworks, url, initSurvey, compareScreenshot, resetFocusToBody } from "../e2e/helper";

const title = "Popup Screenshot";

const json = {
  showQuestionNumbers: false,
  elements: [
    {
      name: "often",
      type: "radiogroup",
      title: "How often do you use this?",
      choices: ["Rare", "Sometimes", "Always"]
    }
  ]
};

frameworks.forEach(framework => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("Dropdown popup styles", async ({ page }) => {
      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        window["survey"].onGetQuestionTitleActions.add((_, opt) => {
          const getItems = (count: number, startIndex = 0) => {
            const list: Array<any> = [];
            for (let index = startIndex; index < count; index++) {
              list[index - startIndex] = new window["Survey"].Action({ id: index, title: "item" + index });
            }
            return list;
          };
          const dropdownWithSearchAction = window["Survey"].createDropdownActionModel(
            { title: "Long List", showTitle: true },
            { items: getItems(40), showPointer: true }
          );

          const dropdownWithSearch = window["Survey"].createDropdownActionModel(
            { title: "Short List", showTitle: true },
            { items: getItems(3, 1), showPointer: true }
          );
          opt.titleActions = [dropdownWithSearch, dropdownWithSearchAction];
        });
        window["survey"].fromJSON(json);
      }, json);

      await page.waitForTimeout(1000);
      await page.setViewportSize({ width: 1000, height: 600 });
      await page.waitForTimeout(1000);

      await page.click('.sv-action:has-text("Long List")');
      await compareScreenshot(page, undefined, "popup-dropdown-long-list.png");

      await page.click('.sv-action:has-text("Long List")');
      await page.click('.sv-action:has-text("Short List")');
      await compareScreenshot(page, undefined, "popup-dropdown-short-list.png");
    });

    test("Dropdown popup styles with separators", async ({ page }) => {
      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        window["survey"].onGetQuestionTitleActions.add((_, opt) => {
          const getItems = (count: number, startIndex = 0) => {
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

          const dropdownWithSearch = window["Survey"].createDropdownActionModel(
            { title: "Short List", showTitle: true },
            { items: getItems(3, 1), showPointer: true }
          );
          opt.titleActions = [dropdownWithSearch, dropdownWithSearchAction];
        });
        window["survey"].fromJSON(json);
      }, json);

      await page.waitForTimeout(1000);
      await page.setViewportSize({ width: 1000, height: 600 });
      await page.waitForTimeout(1000);

      await page.click('.sv-action:has-text("Long List")');
      await compareScreenshot(page, undefined, "popup-dropdown-separators-long-list.png");
    });

    test("Dropdown popup styles with icons", async ({ page }) => {
      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        window["survey"].onGetQuestionTitleActions.add((_, opt) => {
          const getItemWithIconList = () => {
            return [new window["Survey"].Action({ title: "item1", iconName: "icon-search" }), new window["Survey"].Action({ title: "item2", iconName: "icon-search" })];
          };
          const listModel = new window["Survey"].ListModel(getItemWithIconList());
          const itemPopupModel1 = new window["Survey"].PopupModel("sv-list", { model: listModel });
          const dropDownWithIcons = new window["Survey"].Action({
            component: "sv-action-bar-item-dropdown",
            title: "List Icons",
            showTitle: true,
            action: () => {
              itemPopupModel1.toggleVisibility();
            },
            popupModel: itemPopupModel1
          });
          opt.titleActions = [dropDownWithIcons];
        });
        window["survey"].fromJSON(json);
      }, json);

      await page.waitForTimeout(1000);
      await page.setViewportSize({ width: 1000, height: 600 });
      await page.waitForTimeout(1000);

      await page.click('.sv-action:has-text("List Icons")');
      await compareScreenshot(page, undefined, "popup-dropdown-list-with-icons.png");
    });

    test("Dropdown popup with scroll to selected items", async ({ page }) => {
      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        window["survey"].onGetQuestionTitleActions.add((_, opt) => {
          const getItems = (count: number, startIndex = 0) => {
            const list: Array<any> = [];
            for (let index = startIndex; index < count; index++) {
              list[index - startIndex] = new window["Survey"].Action({ id: index, title: "item" + index });
            }
            return list;
          };
          const items = getItems(40);
          const dropdownWithSearchAction = window["Survey"].createDropdownActionModel(
            { title: "Long List", showTitle: true },
            { items: items, showPointer: true, selectedItem: items[39] }
          );
          opt.titleActions = [dropdownWithSearchAction];
        });
        window["survey"].fromJSON(json);
      }, json);
      await page.waitForTimeout(1000);
      await page.setViewportSize({ width: 1000, height: 600 });
      await page.waitForTimeout(1000);

      await page.click('.sv-action:has-text("Long List")');
      await page.waitForTimeout(1000);
      await compareScreenshot(page, ".sv-popup .sv-popup__container", "popup-dropdown-list-with-scroll-to-selected-items.png");
    });

    test("Modal popup with long list styles", async ({ page }) => {
      await page.setViewportSize({ width: 1000, height: 600 });
      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        window["survey"].onGetQuestionTitleActions.add((_, opt) => {
          const getItems = (count: number, startIndex = 0) => {
            const list: Array<any> = [];
            for (let index = startIndex; index < count; index++) {
              list[index - startIndex] = new window["Survey"].Action({ id: index, title: "item" + index });
            }
            return list;
          };
          const items = getItems(40);
          const modalPopupAction = window["Survey"].createDropdownActionModel(
            { title: "Modal", showTitle: true },
            { items: items, isModal: true }
          );

          const modalPopupWithTitleAction = window["Survey"].createDropdownActionModel(
            { title: "Modal with title", showTitle: true },
            { items: items, isModal: true, title: "Title" }
          );

          opt.titleActions = [modalPopupAction, modalPopupWithTitleAction];
        });
        window["survey"].fromJSON(json);
      }, json);

      await page.click('.sv-action:has-text("Modal")');
      await compareScreenshot(page, undefined, "popup-modal-long-list.png");

      await page.click(".sv-popup__button.sv-popup__button--cancel");
      await page.click('.sv-action:has-text("Modal with title")');
      await compareScreenshot(page, undefined, "popup-modal-long-list-with-title.png");
    });

    test("Modal popup with wide list styles", async ({ page }) => {
      await page.setViewportSize({ width: 1000, height: 1000 });
      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        window["survey"].onGetQuestionTitleActions.add((_, opt) => {
          const getItems = (count: number, startIndex = 0) => {
            const list: Array<any> = [];
            for (let index = startIndex; index < count; index++) {
              list[index - startIndex] = new window["Survey"].Action({ id: index, title: "item" + index });
            }
            return list;
          };
          const items = getItems(40);
          const modalPopupAction = window["Survey"].createDropdownActionModel(
            { title: "Modal", showTitle: true },
            { items: items, isModal: true }
          );
          modalPopupAction.popupModel.title = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

          const modalPopupWithTitleAction = window["Survey"].createDropdownActionModel(
            { title: "Modal with title", showTitle: true },
            { items: items, isModal: true, title: "Title" }
          );
          modalPopupWithTitleAction.popupModel.title = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

          opt.titleActions = [modalPopupAction, modalPopupWithTitleAction];
        });
        window["survey"].fromJSON(json);
      }, json);

      await page.click('.sv-action:has-text("Modal with title")');
      await compareScreenshot(page, undefined, "popup-modal-wide-list-with-title.png");
    });

    test("Modal popup with short list styles", async ({ page }) => {
      await page.setViewportSize({ width: 1000, height: 600 });
      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        window["survey"].onGetQuestionTitleActions.add((_, opt) => {
          const getItems = (count: number, startIndex = 0) => {
            const list: Array<any> = [];
            for (let index = startIndex; index < count; index++) {
              list[index - startIndex] = new window["Survey"].Action({ id: index, title: "item" + index });
            }
            return list;
          };
          const items = getItems(3, 1);
          const modalPopupAction = window["Survey"].createDropdownActionModel(
            { title: "Modal", showTitle: true },
            { items: items, isModal: true }
          );

          const modalPopupWithTitleAction = window["Survey"].createDropdownActionModel(
            { title: "Modal with title", showTitle: true },
            { items: items, isModal: true, title: "Title" }
          );

          opt.titleActions = [modalPopupAction, modalPopupWithTitleAction];
        });
        window["survey"].fromJSON(json);
      }, json);

      await page.click('.sv-action:has-text("Modal")');
      await compareScreenshot(page, undefined, "popup-modal-short-list.png");

      await page.click(".sv-popup__button.sv-popup__button--cancel");
      await page.click('.sv-action:has-text("Modal with title")');
      await compareScreenshot(page, undefined, "popup-modal-short-list-with-title.png");
    });

    test("Popup inner modal window", async ({ page }) => {
      await page.setViewportSize({ width: 1000, height: 600 });
      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        window["survey"].onGetQuestionTitleActions.add((_, opt) => {
          const json = {
            showQuestionNumbers: true,
            elements: [
              {
                type: "dropdown",
                name: "modal_question",
                choices: Array.from({ length: 27 }, (_, i) => `item${i + 1}`)
              }
            ]
          };
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
      }, json);

      await page.click('.sv-action:has-text("Click")');
      await page.click(".sd-dropdown");
      await compareScreenshot(page, ".sv-popup.sv-single-select-list .sv-popup__container", "popup-into-modal-popup.png");
    });

    test("Popup search width", async ({ page }) => {
      await page.setViewportSize({ width: 1000, height: 600 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        pages: [
          {
            name: "page1",
            elements: [
              {
                type: "paneldynamic",
                name: "question1",
                templateElements: [{ type: "text", name: "question2" }],
                panelCount: 20,
                displayMode: "tab"
              }
            ]
          }
        ],
        width: "730px"
      });

      await page.click(".sv-dots__item");
      await compareScreenshot(page, ".sv-popup .sv-popup__container", "popup-search-width.png");
    });

    test("Popup with subitems", async ({ page }) => {
      await page.setViewportSize({ width: 1300, height: 650 });
      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        window["survey"].onGetQuestionTitleActions.add((_, opt) => {
          let subitems: Array<any> = [];
          for (let index = 0; index < 7; index++) {
            subitems[index] = { id: index, title: "inner item" + index };
          }

          let items: Array<any> = [];
          for (let index = 0; index < 10; index++) {
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

      await page.click(".sv-action");
      await page.getByRole("menuitem", { name: "item5 has items" }).hover();
      await page.waitForTimeout(300);
      await compareScreenshot(page, ".sv-popup.sv-popup--show-pointer", "popup-with-subitems-right.png");

      await page.getByRole("menuitem", { name: "inner item0" }).hover();
      await page.waitForTimeout(300);
      await compareScreenshot(page, ".sv-popup.sv-popup--show-pointer", "popup-with-subitems-right-hover-sub-item.png");

      await page.setViewportSize({ width: 1000, height: 650 });
      await page.waitForTimeout(300);
      await page.getByRole("menuitem", { name: "item5 has items" }).hover();
      await page.waitForTimeout(300);
      await compareScreenshot(page, ".sv-popup.sv-popup--show-pointer", "popup-with-subitems-left.png");
    });

    test("Popup with subitems and selected elements", async ({ page }) => {
      await page.setViewportSize({ width: 1300, height: 650 });
      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        window["survey"].onGetQuestionTitleActions.add((_, opt) => {
          let subitems: Array<any> = [];
          for (let index = 0; index < 7; index++) {
            subitems[index] = { id: index, title: "inner item" + index };
          }

          let items: Array<any> = [];
          for (let index = 0; index < 10; index++) {
            items[index] = new window["Survey"].Action({ id: index, title: "item" + index });
          }
          items[5].setSubItems({ items: [...subitems], selectedItem: subitems[3] });
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
              selectedItem: items[5],
              onSelectionChanged: (item, ...params) => {
                let value = item.id;
              }
            }
          );
          opt.titleActions = [dropdownWithSearchAction];
        });
        window["survey"].fromJSON(json);
      }, json);

      await page.click(".sv-action");
      await page.getByRole("menuitem", { name: "item5 has items" }).hover();
      await page.waitForTimeout(300);
      await compareScreenshot(page, ".sv-popup.sv-popup--show-pointer", "popup-with-subitems-with-selected-elements.png");
    });
    test("Popup modal with close button", async ({ page }) => {
      await page.setViewportSize({ width: 1000, height: 600 });
      await initSurvey(page, framework, {});
      await page.evaluate(() => {
        const locStr = new window["Survey"].LocalizableString(undefined, false);
        locStr.defaultValue = "Message";
        window["Survey"].settings.showDialog({
          componentName: "sv-string-viewer",
          data: { locStr: locStr, locString: locStr, model: locStr }, //TODO fix in library
          showCloseButton: true,
        });
      });

      await compareScreenshot(page, ".sv-popup__container", "popup-modal-close-button.png");
      await page.locator(".sv-popup__close-button").hover({ position: { x: 5, y: 10 } });
      await page.waitForTimeout(500);
      await compareScreenshot(page, ".sv-popup__container", "popup-modal-close-button-hover.png");
    });
  });
});