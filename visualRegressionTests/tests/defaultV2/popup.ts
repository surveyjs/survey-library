import { Selector } from "testcafe";
import { frameworks, initSurvey, url, url_test, checkElementScreenshot, applyTheme, explicitErrorHandler } from "../../helper";

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

const popupSelector = Selector(".sv-popup").filterVisible();
const clickButton = Selector(".sv-action").filterVisible();

function addDropdownActions(_, opt) {
  const getLongItemList = () => {
    let longList = [];
    for (let index = 0; index < 40; index++) {
      longList[index] = new window["Survey"].Action({ title: "item" + index });
    }
    return longList;
  };
  const getShortItemList = () => {
    return [new window["Survey"].Action({ title: "item1" }), new window["Survey"].Action({ title: "item2" })];
  };
  const itemPopupModel1 = new window["Survey"].PopupModel("sv-list",
    { model: new window["Survey"].ListModel(getLongItemList()) }, "bottom", "left", true);
  const dropDownWithSearchAction = new window["Survey"].Action({
    component: "sv-action-bar-item-dropdown",
    title: "Long List",
    showTitle: true,
    action: () => {
      itemPopupModel1.toggleVisibility();
    },
    popupModel: itemPopupModel1
  });

  const itemPopupModel2 = new window["Survey"].PopupModel("sv-list", {
    model: new window["Survey"].ListModel(getShortItemList())
  }, "bottom", "left", true);
  const dropDownWithSearch = new window["Survey"].Action({
    component: "sv-action-bar-item-dropdown",
    title: "Short List",
    showTitle: true,
    action: () => {
      itemPopupModel2.toggleVisibility();
    },
    popupModel: itemPopupModel2
  });

  opt.titleActions = [dropDownWithSearch, dropDownWithSearchAction];
}

function addActionsWithModalPopupLongList(_, opt) {
  const getLongItemList = () => {
    let longList = [];
    for (let index = 0; index < 40; index++) {
      longList[index] = new window["Survey"].Action({ title: "item" + index });
    }
    return longList;
  };

  const modalPopupModel = new window["Survey"].PopupModel("sv-list", {
    model: new window["Survey"].ListModel(getLongItemList())
  }, "bottom", "left", true, true);

  const modalPopupAction = new window["Survey"].Action({
    component: "sv-action-bar-item-dropdown",
    title: "Modal",
    showTitle: true,
    action: () => {
      modalPopupModel.toggleVisibility();
    },
    popupModel: modalPopupModel
  });

  const modalPopupWithTitleModel = new window["Survey"].PopupModel("sv-list", {
    model: new window["Survey"].ListModel(getLongItemList())
  }, "bottom", "left", true, true);
  modalPopupWithTitleModel.title = "Title";

  const modalPopupWithTitleAction = new window["Survey"].Action({
    component: "sv-action-bar-item-dropdown",
    title: "Modal with title",
    showTitle: true,
    action: () => {
      modalPopupWithTitleModel.toggleVisibility();
    },
    popupModel: modalPopupWithTitleModel
  });

  opt.titleActions = [modalPopupAction, modalPopupWithTitleAction];
}

function addActionsWithModalPopupShortList(_, opt) {
  const getShortItemList = () => {
    return [new window["Survey"].Action({ title: "item1" }), new window["Survey"].Action({ title: "item2" })];
  };

  const modalPopupModel = new window["Survey"].PopupModel("sv-list", {
    model: new window["Survey"].ListModel(getShortItemList())
  }, "bottom", "left", true, true);

  const modalPopupAction = new window["Survey"].Action({
    component: "sv-action-bar-item-dropdown",
    title: "Modal",
    showTitle: true,
    action: () => {
      modalPopupModel.toggleVisibility();
    },
    popupModel: modalPopupModel
  });

  const modalPopupWithTitleModel = new window["Survey"].PopupModel("sv-list", {
    model: new window["Survey"].ListModel(getShortItemList())
  }, "bottom", "left", true, true);
  modalPopupWithTitleModel.title = "Title";

  const modalPopupWithTitleAction = new window["Survey"].Action({
    component: "sv-action-bar-item-dropdown",
    title: "Modal with title",
    showTitle: true,
    action: () => {
      modalPopupWithTitleModel.toggleVisibility();
    },
    popupModel: modalPopupWithTitleModel
  });

  opt.titleActions = [modalPopupAction, modalPopupWithTitleAction];
}

function addActionsWithOverlayPopupShortList(_, opt) {
  const getShortItemList = () => {
    return [new window["Survey"].Action({ title: "item1" }), new window["Survey"].Action({ title: "item2" })];
  };

  const overlayPopupModel = new window["Survey"].PopupModel("sv-list", {
    model: new window["Survey"].ListModel(getShortItemList())
  }, "bottom", "left", true, true);
  overlayPopupModel.displayMode = "overlay";

  const modalPopupAction = new window["Survey"].Action({
    component: "sv-action-bar-item-dropdown",
    title: "Overlay",
    showTitle: true,
    action: () => {
      overlayPopupModel.toggleVisibility();
    },
    popupModel: overlayPopupModel
  });

  const overlayPopupWithTitleModel = new window["Survey"].PopupModel("sv-list", {
    model: new window["Survey"].ListModel(getShortItemList())
  });
  overlayPopupWithTitleModel.displayMode = "overlay";
  overlayPopupWithTitleModel.title = "Title";

  const overlayPopupAction = new window["Survey"].Action({
    component: "sv-action-bar-item-dropdown",
    title: "Overlay with title",
    showTitle: true,
    action: () => {
      overlayPopupWithTitleModel.toggleVisibility();
    },
    popupModel: overlayPopupWithTitleModel
  });

  opt.titleActions = [modalPopupAction, overlayPopupAction];
}

function addActionsWithOverlayPopupLongList(_, opt) {
  const getLongItemList = () => {
    let longList = [];
    for (let index = 0; index < 40; index++) {
      longList[index] = new window["Survey"].Action({ title: "item" + index });
    }
    return longList;
  };

  const overlayPopupModel = new window["Survey"].PopupModel("sv-list", {
    model: new window["Survey"].ListModel(getLongItemList())
  }, "bottom", "left", true, true);
  overlayPopupModel.displayMode = "overlay";

  const modalPopupAction = new window["Survey"].Action({
    component: "sv-action-bar-item-dropdown",
    title: "Overlay",
    showTitle: true,
    action: () => {
      overlayPopupModel.toggleVisibility();
    },
    popupModel: overlayPopupModel
  });

  const overlayPopupWithTitleModel = new window["Survey"].PopupModel("sv-list", {
    model: new window["Survey"].ListModel(getLongItemList())
  });
  overlayPopupWithTitleModel.displayMode = "overlay";
  overlayPopupWithTitleModel.title = "Title";

  const overlayPopupAction = new window["Survey"].Action({
    component: "sv-action-bar-item-dropdown",
    title: "Overlay with title",
    showTitle: true,
    action: () => {
      overlayPopupWithTitleModel.toggleVisibility();
    },
    popupModel: overlayPopupWithTitleModel
  });

  opt.titleActions = [modalPopupAction, overlayPopupAction];
}

frameworks.forEach(framework => {
  fixture`${framework} ${title} ${theme}`
    .page`${url_test}${theme}/${framework}.html`
    .beforeEach(async t => {
      await explicitErrorHandler();
      await applyTheme(theme);
    });

  test("Dropdown popup styles", async t => {
    await initSurvey(framework, json, { onGetQuestionTitleActions: addDropdownActions });
    await t
      .wait(1000)
      .resizeWindow(1000, 600)
      .wait(1000)
      .click(clickButton.withText("Long List"));
    await checkElementScreenshot("popup-dropdown-long-list.png", popupSelector, t);

    await t
      .click(clickButton.withText("Long List"))
      .click(clickButton.withText("Short List"));
    await checkElementScreenshot("popup-dropdown-short-list.png", popupSelector, t);
  });

  test("Modal popup with long list styles", async t => {
    await t.resizeWindow(1000, 600);
    await initSurvey(framework, json, { onGetQuestionTitleActions: addActionsWithModalPopupLongList });
    await t.click(clickButton.withText("Modal"));
    await checkElementScreenshot("popup-modal-long-list.png", popupSelector, t);

    await t
      .click(Selector(".sv-popup__button.sv-popup__button--cancel").filterVisible())
      .click(clickButton.withText("Modal with title"));
    await checkElementScreenshot("popup-modal-long-list-with-title.png", popupSelector, t);
  });

  test("Modal popup with short list styles", async t => {
    await t.resizeWindow(1000, 600);
    await initSurvey(framework, json, { onGetQuestionTitleActions: addActionsWithModalPopupShortList });
    await t.click(clickButton.withText("Modal"));
    await checkElementScreenshot("popup-modal-short-list.png", popupSelector, t);

    await t
      .click(Selector(".sv-popup__button.sv-popup__button--cancel").filterVisible())
      .click(clickButton.withText("Modal with title"));
    await checkElementScreenshot("popup-modal-short-list-with-title.png", popupSelector, t);
  });

  test("Overlay popup with short list styles", async t => {
    await t.resizeWindow(1000, 600);
    await initSurvey(framework, json, { onGetQuestionTitleActions: addActionsWithOverlayPopupShortList });
    await t.click(clickButton.withText("Overlay"));
    await checkElementScreenshot("popup-overlay-short-list.png", popupSelector, t);

    await t
      .click(Selector(".sv-popup__button.sv-popup__button--cancel").filterVisible())
      .click(clickButton.withText("Overlay with title"));
    await checkElementScreenshot("popup-overlay-short-list-with-title.png", popupSelector, t);
  });

  test("Overlay popup with long list styles", async t => {
    await t.resizeWindow(1000, 600);
    await initSurvey(framework, json, { onGetQuestionTitleActions: addActionsWithOverlayPopupLongList });
    await t.click(clickButton.withText("Overlay"));
    await checkElementScreenshot("popup-overlay-long-list.png", popupSelector, t);

    await t
      .click(Selector(".sv-popup__button.sv-popup__button--cancel").filterVisible())
      .click(clickButton.withText("Overlay with title"));
    await checkElementScreenshot("popup-overlay-long-list-with-title.png", popupSelector, t);
  });
});
