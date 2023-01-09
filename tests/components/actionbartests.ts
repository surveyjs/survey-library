import { Action, ActionDropdownViewModel, IAction } from "../../src/actions/action";
import { AdaptiveActionContainer } from "../../src/actions/adaptive-container";
import { ActionContainer, defaultActionBarCss } from "../../src/actions/container";
import { LocalizableString } from "../../src/localizablestring";
import { PopupModel } from "../../src/popup";
import { ListModel } from "../../src/list";
import { settings } from "../../src/settings";
import { getIconNameFromProxy } from "../../src/utils/utils";
import { PageModel } from "../../src/page";
import { ComputedUpdater } from "../../src/base";
import { SurveyModel } from "../../src/survey";

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
  "Use proxy to get icons in svg, function getIconNameFromProxy",
  (assert) => {
    settings.customIcons["icon-proxy"] = "new-icon";
    assert.equal(getIconNameFromProxy("icon-normal"), "icon-normal");
    assert.equal(getIconNameFromProxy("icon-proxy"), "new-icon");
  }
);

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
  const action: Action = new Action({ id: "first",
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
  assert.equal(action.title, "page1", "get from page name #1");
  page.name = "page2";
  assert.equal(action.title, "page2", "get from page name #2");
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
  const list = new ListModel([action1], () => {}, true);
  const popupModel = new PopupModel("sv-list", list, "bottom", "center");
  survey.addNavigationItem({ id: "action1", title: "test", popupModel: popupModel });
  assert.equal(action1.locTitle.text, "Select All", "take text from en localization");
  assert.equal(action1.title, "Select All", "Update action title en localization");
  assert.equal(action1.tooltip, "Preview", "take tooltip from en localization");
  survey.locale = "de";
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