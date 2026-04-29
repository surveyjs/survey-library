import { Action, ActionDropdownViewModel, IAction } from "../../src/actions/action";
import { createDropdownActionModel } from "../../src/actions/dropdown-action";
import { AdaptiveActionContainer, AdaptiveContainerUpdateOptions, UpdateResponsivenessMode } from "../../src/actions/adaptive-container";
import { ActionContainer } from "../../src/actions/container";
import { defaultActionBarCss } from "../../src/actions/actionBarCss";
import { LocalizableString } from "../../src/localizablestring";
import { PopupModel } from "../../src/popup";
import { ListModel } from "../../src/list";
import { PageModel } from "../../src/page";
import { Base, ComputedUpdater } from "../../src/base";
import { SurveyModel } from "../../src/survey";
import { surveyLocalization } from "../../src/surveyStrings";
import { ResponsivityManager } from "../../src/utils/responsivity-manager";

import { describe, test, expect } from "vitest";
test("Check that items are wrapped after set", () => {
  const model: AdaptiveActionContainer = new AdaptiveActionContainer();
  model.setItems([{ id: "first" }, { id: "second" }]);
  expect(model.actions[0] instanceof Action).toBeTruthy();
  expect(model.actions[1] instanceof Action).toBeTruthy();
});

test("Check action sort items", () => {
  const model: AdaptiveActionContainer = new AdaptiveActionContainer();
  model.setItems([
    { id: "invisible", visibleIndex: -1 },
    { id: "second", visibleIndex: 1 },
    { id: "third", visibleIndex: 2 },
    { id: "first", visibleIndex: 0 },
    { id: "undefined_index", visibleIndex: undefined },
  ]);
  expect(model.actions.length).toLooseEqual(4);
  expect(model.actions[0].id).toLooseEqual("first");
  expect(model.actions[1].id).toLooseEqual("second");
  expect(model.actions[2].id).toLooseEqual("third");
  //item with undefined index should be put in the end of array
  expect(model.actions[3].id).toLooseEqual("undefined_index");
});

test("isVisible", () => {
  const action = new Action(<any>{});
  expect(action.visible, "default visible").toBeTruthy();
  expect(action.isVisible, "default isVisible").toBeTruthy();
  action.visible = false;
  expect(action.visible, "not visible").toBeFalsy();
  expect(action.isVisible, "not isVisible due to visible=false").toBeFalsy();
});

test("Create Action from Action", () => {
  const action = new Action(<any>{ title: "action" });
  const newAction = new Action(action);
  newAction.title = "new action";
  expect(newAction.title).toLooseEqual("new action");
  expect(action.title).toLooseEqual("action");
});

test("AdaptiveActionContainer.css", () => {
  const model: AdaptiveActionContainer = new AdaptiveActionContainer();
  model.addAction({ id: "1" });
  model.flushUpdates();
  expect(model.getRootCss()).toLooseEqual("sv-action-bar sv-action-bar--default-size-mode");
  model.containerCss = "footer";
  expect(model.getRootCss()).toLooseEqual("sv-action-bar sv-action-bar--default-size-mode footer");
});

test("getActionRootCss", () => {
  const action = new Action(<any>{ css: "custom" });
  expect(action.getActionRootCss()).toLooseEqual("sv-action custom");
  action.visible = false;
  expect(action.getActionRootCss()).toLooseEqual("sv-action custom sv-action--hidden");
});

test("Check hideItemsGreaterN with minVisibleItemsCount", () => {
  const createTestModel = () => {
    const model: AdaptiveActionContainer = new AdaptiveActionContainer();
    model.setItems([
      { id: "first", },
      { id: "second" },
    ]);
    return model;
  };
  let model = createTestModel();
  model.flushUpdates();
  model["hideItemsGreaterN"](0);
  expect(model.actions[0].mode).toLooseEqual("popup");
  expect(model.actions[1].mode).toLooseEqual("popup");
  model = createTestModel();
  model.flushUpdates();
  model.minVisibleItemsCount = 1;
  model["hideItemsGreaterN"](0);
  expect(model.actions[0].mode).toLooseEqual("large");
  expect(model.actions[1].mode).toLooseEqual("popup");
});

test("Check dropdown action pressed state", () => {
  const p1 = new PopupModel("", "");
  const p2 = new PopupModel("", "");
  const action: Action = new Action({
    id: "first",
    component: "sv-action-bar-item-dropdown",
    popupModel: p1
  },);
  const viewModel = new ActionDropdownViewModel(action);
  expect(action.pressed).toBeFalsy();
  p1.isVisible = true;
  expect(action.pressed).toBeTruthy();
  p1.isVisible = false;
  expect(action.pressed).toBeFalsy();
  action.popupModel = p2;
});

test("Check action title", () => {
  const action = new Action({ id: "" });
  action.title = "simple_title";
  expect(action.title).toLooseEqual("simple_title");
  const locTitle = new LocalizableString(null);
  locTitle.text = "loc_title_1";
  action.locTitle = locTitle;
  expect(action.title).toLooseEqual("loc_title_1");
  locTitle.text = "loc_title_2";
  expect(action.title).toLooseEqual("loc_title_2");
  action.title = "loc_title_3";
  expect(action.title).toLooseEqual("loc_title_3");
  expect(locTitle.text).toLooseEqual("loc_title_3");
});

test("Check action bar cssClasses", () => {
  const actionBar = new ActionContainer();
  expect(actionBar.cssClasses === defaultActionBarCss).toBeTruthy();
  actionBar.cssClasses = {
    root: "custom-action-bar"
  };
  expect(actionBar.cssClasses !== defaultActionBarCss).toBeTruthy();
  expect(actionBar.cssClasses.root).toLooseEqual("custom-action-bar");
  expect(actionBar.cssClasses.item).toLooseEqual("sv-action-bar-item");
});
test("Action title", () => {
  const page = new PageModel("page1");
  const actionInner: IAction = {
    id: page.id,
    title: <any>new ComputedUpdater<string>(() => page.name)
  };
  const action = new Action(actionInner);
  expect(action.title, "title: get from page name #1").toLooseEqual("page1");
  expect(action.locTitle.textOrHtml, "locTitle.textOrHtml: get from page name #1").toLooseEqual("page1");
  page.name = "page2";
  expect(action.title, "title: get from page name #2").toLooseEqual("page2");
  expect(action.locTitle.textOrHtml, "locTitle.textOrHtml: get from page name #2").toLooseEqual("page2");
});
test("Action title set title updater later", () => {
  const page = new PageModel("page1");
  const actionInner: IAction = {
    id: page.id,
  };
  const action = new Action(actionInner);
  expect(action.title, "title: undefined").toLooseEqual(undefined);
  action.title = <any>new ComputedUpdater<string>(() => page.name);
  expect(action.title, "title: get from page name #1").toLooseEqual("page1");
  expect(action.locTitle.textOrHtml, "locTitle.textOrHtml: get from page name #1").toLooseEqual("page1");
  page.name = "page2";
  expect(action.title, "title: get from page name #2").toLooseEqual("page2");
  expect(action.locTitle.textOrHtml, "locTitle.textOrHtml: get from page name #2").toLooseEqual("page2");
});
test("Action title set title updater later and depends on page visibility", () => {
  const page = new PageModel("page1");
  const actionInner: IAction = {
    id: page.id,
  };
  const action = new Action(actionInner);
  expect(action.title, "title: undefined").toLooseEqual(undefined);
  action.title = <any>new ComputedUpdater<string>(() => page.visible ? page.name : "hidden");
  expect(action.title, "title: get from page name #1").toLooseEqual("page1");
  expect(action.locTitle.textOrHtml, "locTitle.textOrHtml: get from page name #1").toLooseEqual("page1");
  page.visible = false;
  expect(action.title, "title: hidden #2").toLooseEqual("hidden");
  expect(action.locTitle.textOrHtml, "locTitle.textOrHtml: hidden #2").toLooseEqual("hidden");
  action.title = <any>undefined;
  action.title = <any>new ComputedUpdater<string>(() => page.visible ? page.name : "hidden");
  expect(action.title, "title: hidden #3").toLooseEqual("hidden");
  expect(action.locTitle.textOrHtml, "locTitle.textOrHtml: hidden #3").toLooseEqual("hidden");
  page.visible = true;
  expect(action.title, "title: get from page name #4").toLooseEqual("page1");
  expect(action.locTitle.textOrHtml, "locTitle.textOrHtml: get from page name #4").toLooseEqual("page1");
});
test("Empty action title", () => {
  const action = new Action({ id: "1" });
  expect(action.title, "title is undefined").toBe(undefined);
});
test("Action title", () => {
  const survey = new SurveyModel({ elements: [{ type: "text", name: "q1" }] });
  const action1 = survey.addNavigationItem({
    id: "action1",
    locTitleName: "selectAllItemText",
    locTooltipName: "previewText"
  });
  expect(action1.locTitle.text, "take text from en localization").toLooseEqual("Select All");
  expect(action1.title, "Update action title en localization").toLooseEqual("Select All");
  expect(action1.tooltip, "take tooltip from en localization").toLooseEqual("Preview");
  survey.locale = "de";
  expect(action1.getLocale(), "locale de").toLooseEqual("de");
  expect(action1.locTitle.text, "take text from de localization").toLooseEqual("Alles auswählen"); // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
  expect(action1.title, "Update action title de localization").toLooseEqual("Alles auswählen"); // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
  expect(action1.tooltip, "take tooltip from de localization").toLooseEqual("Vorschau");
  survey.locale = "";
});
test("Action title in list model", () => {
  const survey = new SurveyModel({ elements: [{ type: "text", name: "q1" }] });
  const action1 = survey.addNavigationItem({
    id: "action1",
    locTitleName: "selectAllItemText",
    locTooltipName: "previewText"
  });
  const list = new ListModel({ items: [action1], onSelectionChanged: () => { }, allowSelection: true } as any);
  const popupModel = new PopupModel("sv-list", list, { verticalPosition: "bottom", horizontalPosition: "center" });
  survey.addNavigationItem({ id: "action2", title: "test", popupModel: popupModel });
  expect(action1.locTitle.text, "take text from en localization").toLooseEqual("Select All");
  expect(action1.title, "Update action title en localization").toLooseEqual("Select All");
  expect(action1.tooltip, "take tooltip from en localization").toLooseEqual("Preview");
  survey.locale = "de";
  expect(action1.getLocale()).toLooseEqual("de");
  expect(action1.locTitle.text, "take text from de localization").toLooseEqual("Alles auswählen"); // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
  expect(action1.title, "Update action title de localization").toLooseEqual("Alles auswählen"); // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
  expect(action1.tooltip, "take tooltip from de localization").toLooseEqual("Vorschau");
  survey.locale = "";
});
test("ariaChecked", () => {
  const action = new Action(<any>{});
  expect(action.ariaChecked, "default is undefined").toBeFalsy();
  action.ariaChecked = true;
  expect(action.ariaChecked, "property exists").toBeTruthy();
});
test("ariaExpanded", () => {
  const action = new Action(<any>{});
  expect(action.ariaExpanded, "default is undefined").toBeFalsy();
  action.ariaExpanded = true;
  expect(action.ariaExpanded, "property exists").toBeTruthy();
});
test("ariaLabelledBy", () => {
  const action = new Action(<any>{});
  expect(action.ariaLabelledBy, "default is undefined").toBeFalsy();
  action.ariaLabelledBy = "id-some";
  expect(action.ariaLabelledBy, "property exists").toBeTruthy();
});
test("Dispose dots item and all it content", () => {
  const model: AdaptiveActionContainer = new AdaptiveActionContainer();
  model.setItems([
    { id: "first", },
    { id: "second" },
  ]);

  model.flushUpdates();

  model["hideItemsGreaterN"](0);
  expect(model.actions[0].mode).toLooseEqual("popup");
  expect(model.actions[1].mode).toLooseEqual("popup");
  expect(model.dotsItem.popupModel, "popup model exists").not.toLooseEqual(undefined);
  expect(model.dotsItem.popupModel.isDisposed, "popup model is not disposed").toLooseEqual(false);
  expect(model.dotsItem.data, "list model exists").not.toLooseEqual(undefined);
  expect(model.dotsItem.data.isDisposed, "list model is not disposed").toLooseEqual(false);

  const action1 = model.actions[0];
  const action2 = model.actions[1];

  model.dispose();
  expect(model.actions.length, "actions are removed").toLooseEqual(0);
  expect(action1.isDisposed, "action 1 is disposed").toLooseEqual(true);
  expect(action2.isDisposed, "action 2 is disposed").toLooseEqual(true);
  expect(model.dotsItem.isDisposed, "dotsItem is disposed").toLooseEqual(true);
  expect(model.dotsItem.popupModel.isDisposed, "popup model is disposed").toLooseEqual(true);
  expect(model.dotsItem.data.isDisposed, "list model is disposed").toLooseEqual(true);
});
test("createDropdownActionModel: switch action title", () => {
  let items: Array<any> = [];
  for (let index = 0; index < 20; index++) {
    items[index] = new Action(<IAction>{ id: index.toString(), title: "item" + index });
  }

  let selectedValue;
  const dropdownAction = createDropdownActionModel(
    { title: "Test", showTitle: true },
    { items: items, onSelectionChanged: (item: IAction) => { selectedValue = item.id; } }
  );
  const list: ListModel = dropdownAction.popupModel.contentComponentData.model as ListModel;

  expect(selectedValue).toLooseEqual(undefined);
  expect(dropdownAction.title).toLooseEqual("Test");

  list.onItemClick(items[1]);
  expect(selectedValue).toLooseEqual("1");
  expect(dropdownAction.title).toLooseEqual("item1");

  list.onItemClick(items[10]);
  expect(selectedValue).toLooseEqual("10");
  expect(dropdownAction.title).toLooseEqual("item10");
});
test("createDropdownActionModel: title is not changed", () => {
  let items: Array<any> = [];
  for (let index = 0; index < 20; index++) {
    items[index] = new Action(<IAction>{ id: index.toString(), title: "item" + index });
  }

  let selectedValue;
  const dropdownAction = createDropdownActionModel(
    { title: "Test", showTitle: false, iconName: "test-icon" },
    { items: items, onSelectionChanged: (item: IAction) => { selectedValue = item.id; } }
  );
  const list: ListModel = dropdownAction.popupModel.contentComponentData.model as ListModel;

  expect(selectedValue).toLooseEqual(undefined);
  expect(dropdownAction.title).toLooseEqual("Test");

  list.onItemClick(items[1]);
  expect(selectedValue).toLooseEqual("1");
  expect(dropdownAction.title).toLooseEqual("Test");

  list.onItemClick(items[10]);
  expect(selectedValue).toLooseEqual("10");
  expect(dropdownAction.title).toLooseEqual("Test");
});
test("Action locTitleName doesn't work correctly, bug#8093", () => {
  const survey = new SurveyModel({ locale: "fr", elements: [{ type: "text", name: "q1" }] });
  const enTranslations = surveyLocalization.getLocaleStrings("en");
  const frTranslations = surveyLocalization.getLocaleStrings("fr");
  enTranslations.clearPage = "Clear page";
  frTranslations.clearPage = "Effacer la page";

  const action1 = survey.addNavigationItem({
    id: "clearPage",
    locTitleName: "clearPage"
  });
  expect(action1.title, "Clear page fr#1").toLooseEqual("Effacer la page");
  survey.locale = "";
  expect(action1.title, "Clear page en#1").toLooseEqual("Clear page");
  survey.locale = "fr";
  expect(action1.title, "Clear page fr#2").toLooseEqual("Effacer la page");
});
test("Action setSubItems popup canShrink property", () => {
  const action = new Action({ id: "test2", title: "test2" });
  const subitems = [new Action({ id: "test28", title: "test28" }), new Action({ id: "test29", title: "test29" })];
  (action as Action).setSubItems({ items: subitems });

  expect(action.popupModel.canShrink, "popub model for subitems should not shrink").toBeFalsy();
});

test("Action setSubItems popup item click", () => {
  const action = new Action({ id: "test2", title: "test2" });
  const subitems = [new Action({ id: "test28", title: "test28" }), new Action({ id: "test29", title: "test29" })];
  let event = "";
  (action as Action).setSubItems({ items: subitems, onSelectionChanged: (item) => { event = item.title; } });
  action.popupModel.contentComponentData.model.onItemClick(action.items[1]);
  expect(event).toLooseEqual("test29");
});

test("Action setSubItems does not change existing popup", () => {
  const action = new Action({ id: "test2", title: "test2" });
  const subitems = [new Action({ id: "test28", title: "test28" }), new Action({ id: "test29", title: "test29" })];
  (action as Action).setSubItems({ items: subitems, onSelectionChanged: () => { } });
  var lastPopup = action.popupModel;
  (action as Action).setSubItems({ items: subitems, onSelectionChanged: () => { } });
  expect(lastPopup).toLooseEqual(action.popupModel);
});

test("Action subitems show timeout - we should wait other popup to hide", () => {
  const actionBar = new ActionContainer();
  const action1 = new Action({ id: "test2", title: "test2" });
  let delayCalled = -1;
  (action1 as Action).showPopupDelayed = (delay) => {
    delayCalled = delay;
  };
  const subitems1 = [new Action({ id: "test28", title: "test28" }), new Action({ id: "test29", title: "test29" })];
  (action1 as Action).setSubItems({ items: subitems1, onSelectionChanged: () => { } });
  const action2 = new Action({ id: "test3", title: "test3" });
  const subitems2 = [new Action({ id: "test38", title: "test38" }), new Action({ id: "test39", title: "test39" })];
  (action2 as Action).setSubItems({ items: subitems2, onSelectionChanged: () => { } });

  actionBar.setItems([action1, action2]);
  actionBar.subItemsShowDelay = 20;
  actionBar.subItemsHideDelay = 30;

  actionBar.mouseOverHandler(action1);
  expect(delayCalled).toLooseEqual(20);

  action2.popupModel.show();
  actionBar.mouseOverHandler(action1);
  expect(delayCalled).toLooseEqual(30);
});

test("Check rendered actions", () => {
  const actionBar = new ActionContainer();
  actionBar.setItems([
    { id: "test1", title: "test1" },
    { id: "test2", title: "test2", visible: false },
    { id: "test2", title: "test3" }
  ]);
  actionBar.flushUpdates();
  expect(actionBar.renderedActions.length).toLooseEqual(2);
  expect(actionBar.renderedActions[0].title).toLooseEqual("test1");
  expect(actionBar.renderedActions[1].title).toLooseEqual("test3");

  actionBar.actions[0].visible = false;
  actionBar.flushUpdates();
  expect(actionBar.renderedActions.length).toLooseEqual(1);
  expect(actionBar.renderedActions[0].title).toLooseEqual("test3");

  actionBar.actions[1].visible = true;
  actionBar.flushUpdates();
  expect(actionBar.renderedActions.length).toLooseEqual(2);
  expect(actionBar.renderedActions[0].title).toLooseEqual("test2");
  expect(actionBar.renderedActions[1].title).toLooseEqual("test3");
});

test("Check rendered actions for adaptive container", () => {
  const actionBar = new AdaptiveActionContainer();
  expect(actionBar.renderedActions.length).toLooseEqual(0);

  actionBar.setItems([{ id: "test1", title: "test1" }]);
  actionBar.flushUpdates();
  expect(actionBar.renderedActions.length).toLooseEqual(2);
  expect(actionBar.renderedActions[0].id).toLooseEqual("test1");
  expect(actionBar.renderedActions[1].id == actionBar.dotsItem.id).toBeTruthy();

  actionBar.setItems([{ id: "test1", title: "test1", iconName: "icon" }]);
  actionBar.flushUpdates();
  expect(actionBar.renderedActions.length).toLooseEqual(1);
  expect(actionBar.renderedActions[0].id).toLooseEqual("test1");

  actionBar.setItems([{ id: "test1", title: "test1", iconName: "icon" }, { id: "test2", title: "test2" }]);
  actionBar.flushUpdates();
  expect(actionBar.renderedActions.length).toLooseEqual(3);
  expect(actionBar.renderedActions[0].id).toLooseEqual("test1");
  expect(actionBar.renderedActions[1].id).toLooseEqual("test2");
  expect(actionBar.renderedActions[2] == actionBar.dotsItem).toBeTruthy();
});

test("Check getRootStyle method", () => {
  const actionBar = new AdaptiveActionContainer();
  actionBar.setItems([
    { id: "test1", title: "test1" },
    { id: "test2", title: "test2", visible: false },
    { id: "test2", title: "test3" }
  ]);
  const container = document.createElement("div");
  actionBar.initResponsivityManager(container);
  expect(actionBar.getRootStyle()?.opacity).toBe(0);
  actionBar["responsivityManager"].afterInitializeCallback && actionBar["responsivityManager"].afterInitializeCallback();
  expect(actionBar.getRootStyle()?.opacity).toBe(undefined);
});

test("Check actions container update merge options", () => {
  const container = new AdaptiveActionContainer();
  let newOptions = container["mergeUpdateOptions"]({}, { });
  expect(newOptions).toEqualValues({ "needUpdateActions": false, "needUpdateIsEmpty": false, "updateResponsivenessMode": UpdateResponsivenessMode.None });

  newOptions = container["mergeUpdateOptions"]({ needUpdateActions: false }, { needUpdateActions: false });
  expect(newOptions).toEqualValues({ "needUpdateActions": false, "needUpdateIsEmpty": false, "updateResponsivenessMode": UpdateResponsivenessMode.None });
  newOptions = container["mergeUpdateOptions"]({ needUpdateActions: true }, { needUpdateActions: false });
  expect(newOptions).toEqualValues({ "needUpdateActions": true, "needUpdateIsEmpty": false, "updateResponsivenessMode": UpdateResponsivenessMode.None });
  newOptions = container["mergeUpdateOptions"]({ needUpdateActions: true }, { needUpdateActions: true });
  expect(newOptions).toEqualValues({ "needUpdateActions": true, "needUpdateIsEmpty": false, "updateResponsivenessMode": UpdateResponsivenessMode.None });

  newOptions = container["mergeUpdateOptions"]({ needUpdateIsEmpty: false }, { needUpdateIsEmpty: false });
  expect(newOptions).toEqualValues({ "needUpdateActions": false, "needUpdateIsEmpty": false, "updateResponsivenessMode": UpdateResponsivenessMode.None });
  newOptions = container["mergeUpdateOptions"]({ needUpdateIsEmpty: true }, { needUpdateIsEmpty: false });
  expect(newOptions).toEqualValues({ "needUpdateActions": false, "needUpdateIsEmpty": true, "updateResponsivenessMode": UpdateResponsivenessMode.None });
  newOptions = container["mergeUpdateOptions"]({ needUpdateIsEmpty: true }, { needUpdateIsEmpty: true });
  expect(newOptions).toEqualValues({ "needUpdateActions": false, "needUpdateIsEmpty": true, "updateResponsivenessMode": UpdateResponsivenessMode.None });

  newOptions = container["mergeUpdateOptions"]({ updateResponsivenessMode: UpdateResponsivenessMode.None }, { updateResponsivenessMode: UpdateResponsivenessMode.None });
  expect(newOptions).toEqualValues({ "needUpdateActions": false, "needUpdateIsEmpty": false, "updateResponsivenessMode": UpdateResponsivenessMode.None });
  newOptions = container["mergeUpdateOptions"]({ updateResponsivenessMode: UpdateResponsivenessMode.Light }, { updateResponsivenessMode: UpdateResponsivenessMode.None });
  expect(newOptions).toEqualValues({ "needUpdateActions": false, "needUpdateIsEmpty": false, "updateResponsivenessMode": UpdateResponsivenessMode.Light });
  newOptions = container["mergeUpdateOptions"]({ updateResponsivenessMode: UpdateResponsivenessMode.Light }, { updateResponsivenessMode: UpdateResponsivenessMode.Light });
  expect(newOptions).toEqualValues({ "needUpdateActions": false, "needUpdateIsEmpty": false, "updateResponsivenessMode": UpdateResponsivenessMode.Light });
  newOptions = container["mergeUpdateOptions"]({ updateResponsivenessMode: UpdateResponsivenessMode.Hard }, { updateResponsivenessMode: UpdateResponsivenessMode.None });
  expect(newOptions).toEqualValues({ "needUpdateActions": false, "needUpdateIsEmpty": false, "updateResponsivenessMode": UpdateResponsivenessMode.Hard });
  newOptions = container["mergeUpdateOptions"]({ updateResponsivenessMode: UpdateResponsivenessMode.Hard }, { updateResponsivenessMode: UpdateResponsivenessMode.Light });
  expect(newOptions).toEqualValues({ "needUpdateActions": false, "needUpdateIsEmpty": false, "updateResponsivenessMode": UpdateResponsivenessMode.Hard });
  newOptions = container["mergeUpdateOptions"]({ updateResponsivenessMode: UpdateResponsivenessMode.Hard }, { updateResponsivenessMode: UpdateResponsivenessMode.Hard });
  expect(newOptions).toEqualValues({ "needUpdateActions": false, "needUpdateIsEmpty": false, "updateResponsivenessMode": UpdateResponsivenessMode.Hard });
});
class TestAdaptiveActionContainer extends AdaptiveActionContainer {
  callback: (options: AdaptiveContainerUpdateOptions) => void;
  update(options: AdaptiveContainerUpdateOptions) {
    this.callback && this.callback(options);
  }
}
test("Check actions container update called only once", () => {
  return new Promise(function(resolve) {
    let __remaining = 1;
    const __done = function() { if (--__remaining <= 0) resolve(); };

    const done = __done;
    const container = new TestAdaptiveActionContainer();
    const results:Array<AdaptiveContainerUpdateOptions> = [];
    container.callback = (options) => {
      results.push(options);
    };
    container["raiseUpdate"]({ needUpdateActions: true });
    container["raiseUpdate"]({ needUpdateIsEmpty: true });
    container["raiseUpdate"]({ updateResponsivenessMode: UpdateResponsivenessMode.Hard });
    expect(results).toEqualValues([]);
    queueMicrotask(() => {
      expect(results).toEqualValues([{ needUpdateActions: true, needUpdateIsEmpty: true, updateResponsivenessMode: UpdateResponsivenessMode.Hard }]);
      done();
    });
  });
});

test("Check actions container flushUpdates", () => {
  const container = new TestAdaptiveActionContainer();
  const results:Array<AdaptiveContainerUpdateOptions> = [];
  container.callback = (options) => {
    results.push(options);
  };
  container["raiseUpdate"]({ needUpdateActions: true });
  container["raiseUpdate"]({ needUpdateIsEmpty: true });
  container["raiseUpdate"]({ updateResponsivenessMode: UpdateResponsivenessMode.Hard });
  container.flushUpdates();
  expect(results).toEqualValues([{ needUpdateActions: true, needUpdateIsEmpty: true, updateResponsivenessMode: UpdateResponsivenessMode.Hard }]);
});

class TestResponsivityManager extends ResponsivityManager {
  callback: (forceUpdate: boolean) => void;
  update(forceUpdate: boolean) {
    this.callback && this.callback(forceUpdate);
  }
}
class Test2AdaptiveActionContainer extends AdaptiveActionContainer {
  protected createResponsivityManager(container: HTMLDivElement): ResponsivityManager {
    return new TestResponsivityManager(container, this);
  }
  public initResponsivityManager(container: HTMLDivElement, callback?: (forceUpdate: boolean) => void) {
    super.initResponsivityManager(container);
    (this.responsivityManager as TestResponsivityManager).callback = callback as (forceUpdate: boolean) => void;
  }
}

test("Check actions container update method", () => {
  const container = new Test2AdaptiveActionContainer();
  container.actions.push(new Action({ id: "test" }));
  let responsivityLog = "";
  container.initResponsivityManager(document.createElement("div"), (forceUpdate: boolean) => responsivityLog += `->called:${forceUpdate}`);

  expect(container.visibleActions.length).toLooseEqual(0);
  expect(container.isEmpty).toLooseEqual(true);
  expect(responsivityLog).toLooseEqual("");

  container["update"]({ needUpdateActions: true });
  expect(container.visibleActions.length).toLooseEqual(1);
  expect(container.visibleActions[0].id).toLooseEqual("test");
  expect(container.isEmpty).toLooseEqual(true);
  expect(responsivityLog).toLooseEqual("");

  container["update"]({ needUpdateIsEmpty: true });
  expect(container.visibleActions.length).toLooseEqual(1);
  expect(container.visibleActions[0].id).toLooseEqual("test");
  expect(container.isEmpty).toLooseEqual(false);
  expect(responsivityLog).toLooseEqual("");

  container.setItems([]);
  container["update"]({ needUpdateIsEmpty: true });
  expect(container.visibleActions.length).toLooseEqual(1);
  expect(container.visibleActions[0].id).toLooseEqual("test");
  expect(container.isEmpty).toLooseEqual(false);
  expect(responsivityLog).toLooseEqual("");

  container["update"]({ updateResponsivenessMode: UpdateResponsivenessMode.None });
  expect(responsivityLog).toLooseEqual("");
  container["update"]({ updateResponsivenessMode: UpdateResponsivenessMode.Light });
  expect(responsivityLog).toLooseEqual("->called:false");
  responsivityLog = "";
  container["update"]({ updateResponsivenessMode: UpdateResponsivenessMode.Hard });
  expect(responsivityLog).toLooseEqual("->called:true");

});
test("Make sure that createActionCore is called for bars & list", () => {
  class TestLocContainer extends AdaptiveActionContainer {
    protected createActionCore(owner: Base, item: IAction): Action {
      const res = super.createActionCore(owner, item);
      res.template = "custom";
      return res;
    }
  }
  const container = new TestLocContainer();
  container.setItems([{ id: "test" }]);
  expect(container.actions[0].template).toLooseEqual("custom");
  container.addAction({ id: "test2" });
  expect(container.actions[1].template).toLooseEqual("custom");
  const list = container.hiddenItemsListModel;
  list.addAction({ id: "test3" });
  expect(list.actions[0].template).toLooseEqual("custom");
});