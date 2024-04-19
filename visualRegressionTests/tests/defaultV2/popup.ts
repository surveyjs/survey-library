import { Selector } from "testcafe";
import { frameworks, initSurvey, url, url_test, takeElementScreenshot, applyTheme, wrapVisualTest, resetHoverToBody } from "../../helper";

const title = "Popup Screenshot";
fixture`${title}`.page`${url}`;

const json = {
  showQuestionNumbers: "off",
  questions: [
    {
      name: "often",
      type: "radiogroup",
      title: "How often do you use this?",
      choices: ["Rare", "Sometimes", "Always"]
    }
  ]
};

const theme = "defaultV2";

const clickButton = Selector(".sv-action").filterVisible();
const popupSelector = Selector(".sv-popup .sv-popup__container").filterVisible();

function addDropdownActions(_, opt) {
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
}

function addDropdownActionsWithSeparators(_, opt) {
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
}

function addDropdownActionsWithIcons(_, opt) {
  const getItemWithIconList = () => {
    return [new window["Survey"].Action({ title: "item1", iconName: "icon-search" }), new window["Survey"].Action({ title: "item2", iconName: "icon-search" })];
  };
  const itemPopupModel1 = new window["Survey"].PopupModel("sv-list",
    { model: new window["Survey"].ListModel(getItemWithIconList()) }, "bottom", "left", true);
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
}

function addActionsWithModalPopupLongList(_, opt) {
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
}

function addActionsWithModalPopupWideList(_, opt) {
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
}

function addActionsWithModalPopupShortList(_, opt) {
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
}

function addActionsWithOverlayPopupShortList(_, opt) {
  const getItems = (count: number, startIndex = 0) => {
    const list: Array<any> = [];
    for (let index = startIndex; index < count; index++) {
      list[index - startIndex] = new window["Survey"].Action({ id: index, title: "item" + index });
    }
    return list;
  };
  const items = getItems(3, 1);
  const overlayPopupAction = window["Survey"].createDropdownActionModel(
    { title: "Overlay", showTitle: true },
    { items: items, isModal: true, displayMode: "overlay" }
  );
  const overlayWithTypePopupAction = window["Survey"].createDropdownActionModel(
    { title: "Overlay with title", showTitle: true },
    { items: items, displayMode: "overlay", title: "Title" }
  );
  overlayWithTypePopupAction.popupModel.overlayDisplayMode = "overlay";
  opt.titleActions = [overlayPopupAction, overlayWithTypePopupAction];
}

function addActionsWithOverlayPopupLongList(_, opt) {
  const getItems = (count: number, startIndex = 0) => {
    const list: Array<any> = [];
    for (let index = startIndex; index < count; index++) {
      list[index - startIndex] = new window["Survey"].Action({ id: index, title: "item" + index });
    }
    return list;
  };
  const items = getItems(40);
  const overlayPopupAction = window["Survey"].createDropdownActionModel(
    { title: "Overlay", showTitle: true },
    { items: items, isModal: true, displayMode: "overlay" }
  );

  const overlayWithTypePopupAction = window["Survey"].createDropdownActionModel(
    { title: "Overlay with title", showTitle: true, },
    { items: items, displayMode: "overlay", title: "Title" }
  );
  overlayWithTypePopupAction.popupModel.overlayDisplayMode = "overlay";
  opt.titleActions = [overlayPopupAction, overlayWithTypePopupAction];
}

frameworks.forEach(framework => {
  fixture`${framework} ${title} ${theme}`
    .page`${url_test}${theme}/${framework}`
    .beforeEach(async t => {
      await applyTheme(theme);
    });

  test("Dropdown popup styles", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await initSurvey(framework, json, { onGetQuestionTitleActions: addDropdownActions });
      await t
        .wait(1000)
        .resizeWindow(1000, 600)
        .wait(1000)
        .click(clickButton.withText("Long List"));
      await takeElementScreenshot("popup-dropdown-long-list.png", null, t, comparer);

      await t
        .click(clickButton.withText("Long List"))
        .click(clickButton.withText("Short List"));
      await takeElementScreenshot("popup-dropdown-short-list.png", null, t, comparer);
    });
  });

  test("Dropdown popup styles with separators", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await initSurvey(framework, json, { onGetQuestionTitleActions: addDropdownActionsWithSeparators });
      await t
        .wait(1000)
        .resizeWindow(1000, 600)
        .wait(1000)
        .click(clickButton.withText("Long List"));
      await takeElementScreenshot("popup-dropdown-separators-long-list.png", null, t, comparer);
    });
  });

  test("Dropdown popup styles with icons", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await initSurvey(framework, json, { onGetQuestionTitleActions: addDropdownActionsWithIcons });
      await t
        .wait(1000)
        .resizeWindow(1000, 600)
        .wait(1000)
        .click(clickButton.withText("List Icons"));
      await takeElementScreenshot("popup-dropdown-list-with-icons.png", null, t, comparer);
    });
  });

  test("Dropdown popup with scroll to selected items", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await initSurvey(framework, json, {
        onGetQuestionTitleActions: (_, opt) => {
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
        }
      });
      await t
        .wait(1000)
        .resizeWindow(1000, 600)
        .wait(1000)
        .click(clickButton.withText("Long List"))
        .wait(1000);
      await takeElementScreenshot("popup-dropdown-list-with-scroll-to-selected-items.png", popupSelector, t, comparer);
    });
  });

  test("Modal popup with long list styles", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1000, 600);
      await initSurvey(framework, json, { onGetQuestionTitleActions: addActionsWithModalPopupLongList });
      await t.click(clickButton.withText("Modal"));
      await takeElementScreenshot("popup-modal-long-list.png", null, t, comparer);

      await t
        .click(Selector(".sv-popup__button.sv-popup__button--cancel").filterVisible())
        .click(clickButton.withText("Modal with title"));
      await takeElementScreenshot("popup-modal-long-list-with-title.png", null, t, comparer);
    });
  });

  test("Modal popup with wide list styles", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1000, 1000);
      await initSurvey(framework, json, { onGetQuestionTitleActions: addActionsWithModalPopupWideList });

      await t
        .click(clickButton.withText("Modal with title"));
      await takeElementScreenshot("popup-modal-wide-list-with-title.png", null, t, comparer);
    });
  });

  test("Modal popup with short list styles", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1000, 600);
      await initSurvey(framework, json, { onGetQuestionTitleActions: addActionsWithModalPopupShortList });
      await t.click(clickButton.withText("Modal"));
      await takeElementScreenshot("popup-modal-short-list.png", null, t, comparer);

      await t
        .click(Selector(".sv-popup__button.sv-popup__button--cancel").filterVisible())
        .click(clickButton.withText("Modal with title"));
      await takeElementScreenshot("popup-modal-short-list-with-title.png", null, t, comparer);
    });
  });

  test("Overlay popup with short list styles", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1000, 600);
      await initSurvey(framework, json, { onGetQuestionTitleActions: addActionsWithOverlayPopupShortList });
      await t.click(clickButton.withText("Overlay"));
      await resetHoverToBody(t);
      await takeElementScreenshot("popup-overlay-short-list.png", null, t, comparer);

      await t
        .click(Selector(".sv-popup__button.sv-popup__button--cancel").filterVisible())
        .click(clickButton.withText("Overlay with title"));
      await takeElementScreenshot("popup-overlay-short-list-with-title.png", null, t, comparer);
    });
  });

  test("Overlay popup with long list styles", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1000, 600);
      await initSurvey(framework, json, { onGetQuestionTitleActions: addActionsWithOverlayPopupLongList });
      await t.click(clickButton.withText("Overlay"));
      await resetHoverToBody(t);
      await takeElementScreenshot("popup-overlay-long-list.png", null, t, comparer);

      await t
        .click(Selector(".sv-popup__button.sv-popup__button--cancel").filterVisible())
        .click(clickButton.withText("Overlay with title"));
      await takeElementScreenshot("popup-overlay-long-list-with-title.png", null, t, comparer);
    });
  });

  test("Popup inner modal window", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1000, 600);
      await initSurvey(framework, json, {
        onGetQuestionTitleActions: (_, opt) => {
          const json = {
            elements: [
              {
                type: "dropdown",
                name: "modal_question",
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
                  "item10",
                  "item11",
                  "item12",
                  "item13",
                  "item14",
                  "item15",
                  "item16",
                  "item17",
                  "item18",
                  "item19",
                  "item20",
                  "item21",
                  "item22",
                  "item23",
                  "item24",
                  "item25",
                  "item26",
                  "item27"
                ]
              }
            ]
          };
          const item = new window["Survey"].Action({
            component: "sv-action-bar-item",
            title: "Click",
            showTitle: true,
            action: () => {
              const model = new window["Survey"].Model(json);
              model.focusFirstQuestionAutomatic = false;
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
        }
      });
      await t
        .click(clickButton.withText("Click"))
        .click(Selector(".sd-dropdown"));

      await resetHoverToBody(t);
      await takeElementScreenshot("popup-into-modal-popup.png", Selector(".sv-popup.sv-single-select-list .sv-popup__container"), t, comparer);
    });
  });
  test("Popup search width", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1000, 600);
      await initSurvey(framework, {

        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "paneldynamic",
                "name": "question1",
                "templateElements": [
                  {
                    "type": "text",
                    "name": "question2"
                  }
                ],
                "panelCount": 20,
                "renderMode": "tab"
              }
            ]
          }
        ]
      });
      await t
        .click(".sv-dots__item");

      await takeElementScreenshot("popup-search-width.png", Selector(".sv-popup .sv-popup__container"), t, comparer);
    });
  });
});