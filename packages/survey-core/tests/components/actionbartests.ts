import { Action, ActionDropdownViewModel, IAction, createDropdownActionModel } from "../../src/actions/action";
import { AdaptiveActionContainer } from "../../src/actions/adaptive-container";
import { ActionContainer, defaultActionBarCss } from "../../src/actions/container";
import { LocalizableString } from "../../src/localizablestring";
import { PopupModel } from "../../src/popup";
import { ListModel } from "../../src/list";
import { settings } from "../../src/settings";
import { PageModel } from "../../src/page";
import { ComputedUpdater } from "../../src/base";
import { SurveyModel } from "../../src/survey";
import { surveyLocalization } from "../../src/surveyStrings";

QUnit.test("Check that items are wrapped after set", (assert) => {
  const model: AdaptiveActionContainer = new AdaptiveActionContainer();
  model.setItems([{ id: "first" }, { id: "second" }]);
  assert.ok(model.actions[0] instanceof Action);
  assert.ok(model.actions[1] instanceof Action);
});

QUnit.test("Check action sort items", (assert) => {
  const model: AdaptiveActionContainer = new AdaptiveActionContainer();
  model.setItems([
    { id: "invisible", visibleIndex: -1 },
    { id: "second", visibleIndex: 1 },
    { id: "third", visibleIndex: 2 },
    { id: "first", visibleIndex: 0 },
    { id: "undefined_index", visibleIndex: undefined },
  ]);
  assert.equal(model.actions.length, 4);
  assert.equal(model.actions[0].id, "first");
  assert.equal(model.actions[1].id, "second");
  assert.equal(model.actions[2].id, "third");
  //item with undefined index should be put in the end of array
  assert.equal(model.actions[3].id, "undefined_index");
});

QUnit.test(
  "isVisible",
  (assert) => {
    const action = new Action(<any>{});
    assert.ok(action.visible, "default visible");
    assert.ok(action.isVisible, "default isVisible");
    action.visible = false;
    assert.notOk(action.visible, "not visible");
    assert.notOk(action.isVisible, "not isVisible due to visible=false");
  }
);

QUnit.test(
  "Create Action from Action",
  (assert) => {
    const action = new Action(<any>{ title: "action" });
    const newAction = new Action(action);
    newAction.title = "new action";
    assert.equal(newAction.title, "new action");
    assert.equal(action.title, "action");
  }
);

QUnit.test("AdaptiveActionContainer.css",
  (assert) => {
    const model: AdaptiveActionContainer = new AdaptiveActionContainer();
    assert.equal(model.getRootCss(), "sv-action-bar sv-action-bar--default-size-mode");
    model.containerCss = "footer";
    assert.equal(model.getRootCss(), "sv-action-bar sv-action-bar--default-size-mode footer");
  }
);

QUnit.test(
  "getActionRootCss",
  (assert) => {
    const action = new Action(<any>{ css: "custom" });
    assert.equal(action.getActionRootCss(), "sv-action custom");
    action.visible = false;
    assert.equal(action.getActionRootCss(), "sv-action custom sv-action--hidden");
  }
);

QUnit.test("Check hideItemsGreaterN with minVisibleItemsCount", (assert) => {
  const createTestModel = () => {
    const model: AdaptiveActionContainer = new AdaptiveActionContainer();
    model.setItems([
      { id: "first", },
      { id: "second" },
    ]);
    return model;
  };
  let model = createTestModel();
  model["hideItemsGreaterN"](0);
  assert.equal(model.actions[0].mode, "popup");
  assert.equal(model.actions[1].mode, "popup");
  model = createTestModel();
  model.minVisibleItemsCount = 1;
  model["hideItemsGreaterN"](0);
  assert.equal(model.actions[0].mode, "large");
  assert.equal(model.actions[1].mode, "popup");
});

QUnit.test("Check dropdown action pressed state", (assert) => {
  const p1 = new PopupModel("", "");
  const p2 = new PopupModel("", "");
  const action: Action = new Action({
    id: "first",
    component: "sv-action-bar-item-dropdown",
    popupModel: p1
  },);
  const viewModel = new ActionDropdownViewModel(action);
  assert.notOk(action.pressed);
  p1.isVisible = true;
  assert.ok(action.pressed);
  p1.isVisible = false;
  assert.notOk(action.pressed);
  action.popupModel = p2;
});

QUnit.test("Check action title", (assert) => {
  const action = new Action({ id: "" });
  action.title = "simple_title";
  assert.equal(action.title, "simple_title");
  const locTitle = new LocalizableString(null);
  locTitle.text = "loc_title_1";
  action.locTitle = locTitle;
  assert.equal(action.title, "loc_title_1");
  locTitle.text = "loc_title_2";
  assert.equal(action.title, "loc_title_2");
  action.title = "loc_title_3";
  assert.equal(action.title, "loc_title_3");
  assert.equal(locTitle.text, "loc_title_3");
});

QUnit.test("Check action bar cssClasses", (assert) => {
  const actionBar = new ActionContainer();
  assert.ok(actionBar.cssClasses === defaultActionBarCss);
  actionBar.cssClasses = {
    root: "custom-action-bar"
  };
  assert.ok(actionBar.cssClasses !== defaultActionBarCss);
  assert.equal(actionBar.cssClasses.root, "custom-action-bar");
  assert.equal(actionBar.cssClasses.item, "sv-action-bar-item");
});
QUnit.test("Action title", (assert) => {
  const page = new PageModel("page1");
  const actionInner: IAction = {
    id: page.id,
    title: <any>new ComputedUpdater<string>(() => page.name)
  };
  const action = new Action(actionInner);
  assert.equal(action.title, "page1", "title: get from page name #1");
  assert.equal(action.locTitle.textOrHtml, "page1", "locTitle.textOrHtml: get from page name #1");
  page.name = "page2";
  assert.equal(action.title, "page2", "title: get from page name #2");
  assert.equal(action.locTitle.textOrHtml, "page2", "locTitle.textOrHtml: get from page name #2");
});
QUnit.test("Action title set title updater later", (assert) => {
  const page = new PageModel("page1");
  const actionInner: IAction = {
    id: page.id,
  };
  const action = new Action(actionInner);
  assert.equal(action.title, undefined, "title: undefined");
  action.title = <any>new ComputedUpdater<string>(() => page.name);
  assert.equal(action.title, "page1", "title: get from page name #1");
  assert.equal(action.locTitle.textOrHtml, "page1", "locTitle.textOrHtml: get from page name #1");
  page.name = "page2";
  assert.equal(action.title, "page2", "title: get from page name #2");
  assert.equal(action.locTitle.textOrHtml, "page2", "locTitle.textOrHtml: get from page name #2");
});
QUnit.test("Action title set title updater later and depends on page visibility", (assert) => {
  const page = new PageModel("page1");
  const actionInner: IAction = {
    id: page.id,
  };
  const action = new Action(actionInner);
  assert.equal(action.title, undefined, "title: undefined");
  action.title = <any>new ComputedUpdater<string>(() => page.visible ? page.name : "hidden");
  assert.equal(action.title, "page1", "title: get from page name #1");
  assert.equal(action.locTitle.textOrHtml, "page1", "locTitle.textOrHtml: get from page name #1");
  page.visible = false;
  assert.equal(action.title, "hidden", "title: hidden #2");
  assert.equal(action.locTitle.textOrHtml, "hidden", "locTitle.textOrHtml: hidden #2");
  action.title = <any>undefined;
  action.title = <any>new ComputedUpdater<string>(() => page.visible ? page.name : "hidden");
  assert.equal(action.title, "hidden", "title: hidden #3");
  assert.equal(action.locTitle.textOrHtml, "hidden", "locTitle.textOrHtml: hidden #3");
  page.visible = true;
  assert.equal(action.title, "page1", "title: get from page name #4");
  assert.equal(action.locTitle.textOrHtml, "page1", "locTitle.textOrHtml: get from page name #4");
});
QUnit.test("Empty action title", (assert) => {
  const action = new Action({ id: "1" });
  assert.strictEqual(action.title, undefined, "title is undefined");
});
QUnit.test("Action title", (assert) => {
  const survey = new SurveyModel({ elements: [{ type: "text", name: "q1" }] });
  const action1 = survey.addNavigationItem({
    id: "action1",
    locTitleName: "selectAllItemText",
    locTooltipName: "previewText"
  });
  assert.equal(action1.locTitle.text, "Select All", "take text from en localization");
  assert.equal(action1.title, "Select All", "Update action title en localization");
  assert.equal(action1.tooltip, "Preview", "take tooltip from en localization");
  survey.locale = "de";
  assert.equal(action1.getLocale(), "de", "locale de");
  assert.equal(action1.locTitle.text, "Alles auswählen", "take text from de localization");
  assert.equal(action1.title, "Alles auswählen", "Update action title de localization");
  assert.equal(action1.tooltip, "Vorschau", "take tooltip from de localization");
  survey.locale = "";
});
QUnit.test("Action title in list model", (assert) => {
  const survey = new SurveyModel({ elements: [{ type: "text", name: "q1" }] });
  const action1 = survey.addNavigationItem({
    id: "action1",
    locTitleName: "selectAllItemText",
    locTooltipName: "previewText"
  });
  const list = new ListModel({ items: [action1], onSelectionChanged: () => { }, allowSelection: true } as any);
  const popupModel = new PopupModel("sv-list", list, { verticalPosition: "bottom", horizontalPosition: "center" });
  survey.addNavigationItem({ id: "action2", title: "test", popupModel: popupModel });
  assert.equal(action1.locTitle.text, "Select All", "take text from en localization");
  assert.equal(action1.title, "Select All", "Update action title en localization");
  assert.equal(action1.tooltip, "Preview", "take tooltip from en localization");
  survey.locale = "de";
  assert.equal(action1.getLocale(), "de");
  assert.equal(action1.locTitle.text, "Alles auswählen", "take text from de localization");
  assert.equal(action1.title, "Alles auswählen", "Update action title de localization");
  assert.equal(action1.tooltip, "Vorschau", "take tooltip from de localization");
  survey.locale = "";
});
QUnit.test(
  "ariaChecked",
  (assert) => {
    const action = new Action(<any>{});
    assert.notOk(action.ariaChecked, "default is undefined");
    action.ariaChecked = true;
    assert.ok(action.ariaChecked, "property exists");
  }
);
QUnit.test(
  "ariaExpanded",
  (assert) => {
    const action = new Action(<any>{});
    assert.notOk(action.ariaExpanded, "default is undefined");
    action.ariaExpanded = true;
    assert.ok(action.ariaExpanded, "property exists");
  }
);
QUnit.test("Dispose dots item and all it content", (assert) => {
  const model: AdaptiveActionContainer = new AdaptiveActionContainer();
  model.setItems([
    { id: "first", },
    { id: "second" },
  ]);
  model["hideItemsGreaterN"](0);
  assert.equal(model.actions[0].mode, "popup");
  assert.equal(model.actions[1].mode, "popup");
  assert.notEqual(model.dotsItem.popupModel, undefined, "popup model exists");
  assert.equal(model.dotsItem.popupModel.isDisposed, false, "popup model is not disposed");
  assert.notEqual(model.dotsItem.data, undefined, "list model exists");
  assert.equal(model.dotsItem.data.isDisposed, false, "list model is not disposed");

  const action1 = model.actions[0];
  const action2 = model.actions[1];

  model.dispose();
  assert.equal(model.actions.length, 0, "actions are removed");
  assert.equal(action1.isDisposed, true, "action 1 is disposed");
  assert.equal(action2.isDisposed, true, "action 2 is disposed");
  assert.equal(model.dotsItem.isDisposed, true, "dotsItem is disposed");
  assert.equal(model.dotsItem.popupModel.isDisposed, true, "popup model is disposed");
  assert.equal(model.dotsItem.data.isDisposed, true, "list model is disposed");
});
QUnit.test("createDropdownActionModel: switch action title", (assert) => {
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

  assert.equal(selectedValue, undefined);
  assert.equal(dropdownAction.title, "Test");

  list.onItemClick(items[1]);
  assert.equal(selectedValue, "1");
  assert.equal(dropdownAction.title, "item1");

  list.onItemClick(items[10]);
  assert.equal(selectedValue, "10");
  assert.equal(dropdownAction.title, "item10");
});
QUnit.test("createDropdownActionModel: title is not changed", (assert) => {
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

  assert.equal(selectedValue, undefined);
  assert.equal(dropdownAction.title, "Test");

  list.onItemClick(items[1]);
  assert.equal(selectedValue, "1");
  assert.equal(dropdownAction.title, "Test");

  list.onItemClick(items[10]);
  assert.equal(selectedValue, "10");
  assert.equal(dropdownAction.title, "Test");
});
QUnit.test("Action locTitleName doesn't work correctly, bug#8093", (assert) => {
  const survey = new SurveyModel({ locale: "fr", elements: [{ type: "text", name: "q1" }] });
  const enTranslations = surveyLocalization.getLocaleStrings("en");
  const frTranslations = surveyLocalization.getLocaleStrings("fr");
  enTranslations.clearPage = "Clear page";
  frTranslations.clearPage = "Effacer la page";

  const action1 = survey.addNavigationItem({
    id: "clearPage",
    locTitleName: "clearPage"
  });
  assert.equal(action1.title, "Effacer la page", "Clear page fr#1");
  survey.locale = "";
  assert.equal(action1.title, "Clear page", "Clear page en#1");
  survey.locale = "fr";
  assert.equal(action1.title, "Effacer la page", "Clear page fr#2");
});
QUnit.test("Action setSubItems popup canShrink property", function (assert) {
  const action = new Action({ id: "test2", title: "test2" });
  const subitems = [new Action({ id: "test28", title: "test28" }), new Action({ id: "test29", title: "test29" })];
  (action as Action).setSubItems({ items: subitems });

  assert.notOk(action.popupModel.canShrink, "popub model for subitems should not shrink");
});

QUnit.test("Action setSubItems popup item click", function (assert) {
  const action = new Action({ id: "test2", title: "test2" });
  const subitems = [new Action({ id: "test28", title: "test28" }), new Action({ id: "test29", title: "test29" })];
  let event = "";
  (action as Action).setSubItems({ items: subitems, onSelectionChanged: (item) => { event = item.title; } });
  action.popupModel.contentComponentData.model.onItemClick(action.items[1]);
  assert.equal(event, "test29");
});