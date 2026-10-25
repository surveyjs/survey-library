import { describe, test, expect } from "vitest";
import { SurveyModel } from "../src/survey";
import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";
import { PanelModel } from "../src/panel";
import { Action } from "../src/actions/action";
import { ActionContainer } from "../src/actions/container";
import { IPanelDynamicActionsOwner, PanelDynamicActions } from "../src/paneldynamic-actions";

function createQuestion(json: any): QuestionPanelDynamicModel {
  const survey = new SurveyModel({ elements: [Object.assign({ type: "paneldynamic", name: "pd", templateElements: [{ type: "text", name: "a" }] }, json)] });
  return <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
}
// The owner over a real question; the values that are not its public members are set by the test.
class TestOwner implements IPanelDynamicActionsOwner {
  public canGoToNextRecord = false;
  public isRebuildingPanels = false;
  public left: Array<any> = [];
  constructor(public question: QuestionPanelDynamicModel) { }
  getVisiblePanels(): Array<PanelModel> { return this.question.visiblePanels; }
  getPanelVisibleIndex(panel: PanelModel): number { return this.question.visiblePanels.indexOf(panel); }
  createActionContainer(): ActionContainer { return new ActionContainer(); }
  disposeLeftObject(obj: { dispose(): void }): void { this.left.push(obj); obj.dispose(); }
}
function createActions(json: any): { question: QuestionPanelDynamicModel, owner: TestOwner, actions: PanelDynamicActions } {
  const question = createQuestion(json);
  question.panels;
  const owner = new TestOwner(question);
  return { question: question, owner: owner, actions: new PanelDynamicActions(owner) };
}
function footerState(actions: PanelDynamicActions): { [id: string]: boolean } {
  const res: { [id: string]: boolean } = {};
  actions.footerToolbar.actions.forEach(action => { res[action.id] = action.visible; });
  return res;
}
function countFooterUpdates(actions: PanelDynamicActions): () => number {
  actions.footerToolbar;
  const update = actions.updateFooterActionsCallback;
  let count = 0;
  actions.updateFooterActionsCallback = (): void => { count++; update(); };
  return (): number => count;
}

describe("PanelDynamicActions: the footer buttons", () => {
  test("list mode: Add shows while a panel can be added; Previous, Next and the progress text are hidden", () => {
    const { actions } = createActions({ panelCount: 1 });
    expect(footerState(actions)).toEqual({ "sv-pd-prev-btn": false, "sv-pd-next-btn": false, "sv-pd-add-btn": true, "sv-pd-progress-text": false });
    expect(actions.addPanelAction.id).toBe("sv-pd-add-btn");
  });
  test("carousel mode: Previous after the first panel, Next while there is a next record, the progress text", () => {
    const { question, owner, actions } = createActions({ panelCount: 3, displayMode: "carousel" });
    owner.canGoToNextRecord = true;
    actions.updateFooterActions();
    expect(footerState(actions), "#1: the first panel").toEqual({ "sv-pd-prev-btn": false, "sv-pd-next-btn": true, "sv-pd-add-btn": false, "sv-pd-progress-text": true });
    question.currentIndex = 2;
    owner.canGoToNextRecord = false;
    actions.updateFooterActions();
    expect(footerState(actions), "#2: the last panel").toEqual({ "sv-pd-prev-btn": true, "sv-pd-next-btn": false, "sv-pd-add-btn": true, "sv-pd-progress-text": true });
  });
  test("mobile: the progress text is hidden, and Add takes the space Next leaves", () => {
    const { question, actions } = createActions({ panelCount: 2, displayMode: "carousel" });
    question.currentIndex = 1;
    question.isMobile = true;
    const add = actions.addPanelAction;
    expect(footerState(actions)["sv-pd-progress-text"], "#1").toBe(false);
    expect(add.visible && add.needSpace, "#2").toBe(true);
  });
  test("the Add button is enabled by enableAddPanel", () => {
    const { question, actions } = createActions({ panelCount: 1 });
    expect(actions.addPanelAction.enabled, "#1").toBe(true);
    question.enableAddPanel = false;
    expect(actions.addPanelAction.enabled, "#2").toBe(false);
  });
});

describe("PanelDynamicActions: the footer follows the question properties it reads", () => {
  const changes: Array<{ name: string, change: (q: QuestionPanelDynamicModel) => void, isAddVisible?: boolean }> = [
    { name: "newPanelPosition", change: q => { q.displayMode = "carousel"; q.newPanelPosition = "next"; } },
    { name: "displayMode", change: q => { q.displayMode = "carousel"; } },
    { name: "showProgressBar", change: q => { q.showProgressBar = false; } },
    { name: "allowAddPanel", change: q => { q.allowAddPanel = false; }, isAddVisible: false },
    { name: "panelCountExpression", change: q => { q.panelCountExpression = "2"; }, isAddVisible: false },
    { name: "maxPanelCount", change: q => { q.maxPanelCount = 2; }, isAddVisible: false },
    { name: "isReadOnly", change: q => { q.readOnly = true; }, isAddVisible: false },
    { name: "_isMobile", change: q => { q.isMobile = true; } }
  ];
  changes.forEach(item => {
    test(item.name + ": a change updates the footer", () => {
      const { question, actions } = createActions({ panelCount: 2 });
      const updates = countFooterUpdates(actions);
      item.change(question);
      expect(updates() > 0, "#1: updated").toBe(true);
      if (item.isAddVisible !== undefined) {
        expect(actions.addPanelAction.visible, "#2: Add").toBe(item.isAddVisible);
      }
    });
  });
  test("a property the footer does not read does not update it", () => {
    const { question, actions } = createActions({ panelCount: 1 });
    const updates = countFooterUpdates(actions);
    question.title = "New title";
    question.templateTitle = "Panel";
    expect(updates()).toBe(0);
  });
  test("a property change before the toolbar is built updates nothing and adds no handler to the question", () => {
    const { question, actions } = createActions({ panelCount: 1 });
    const handlers = (): number => question["onPropChangeFunctions"].length;
    const before = handlers();
    question.allowAddPanel = false;
    expect(handlers(), "#1: no handler before the toolbar").toBe(before);
    expect(actions.addPanelAction.visible, "#2: the toolbar is built for the current state").toBe(false);
    expect(handlers() > before, "#3: the toolbar follows the question").toBe(true);
  });
  test("the question's own footer follows displayMode", () => {
    const question = createQuestion({ panelCount: 2 });
    question.panels;
    const progress = question.footerToolbar.getActionById("sv-pd-progress-text");
    expect(progress.visible, "#1").toBe(false);
    question.displayMode = "carousel";
    expect(progress.visible, "#2").toBe(true);
  });
});

describe("PanelDynamicActions: the remove buttons", () => {
  // getPanelActions asks the question for the remove action (getRemovePanelAction), as a subclass may override it.
  test("a remove button shows while a panel can be removed, in the panel footer unless it is on the right", () => {
    const { question, actions } = createActions({ panelCount: 2, minPanelCount: 1 });
    const panel = question.panels[0];
    const remove = actions.getRemovePanelAction(panel);
    // The panel's footerActions keep what an earlier call added: each check asks for another panel.
    const inFooter = (p: PanelModel): boolean => actions.getPanelActions(p).indexOf(question.getRemovePanelAction(p)) > -1;
    expect(actions.getRemovePanelAction(panel), "#1: one action per panel").toBe(remove);
    expect(remove.visible, "#2").toBe(true);
    expect(inFooter(panel), "#3: in the panel footer").toBe(true);
    expect(actions.canRenderRemovePanelOnRight(panel), "#4").toBe(false);
    question.removePanelButtonLocation = "right";
    expect(actions.canRenderRemovePanelOnRight(panel), "#5").toBe(true);
    expect(inFooter(question.panels[1]), "#6: not in the panel footer").toBe(false);
    question.panelCount = 1;
    expect(remove.visible, "#7: minPanelCount is reached").toBe(false);
    expect(actions.canRenderRemovePanelOnRight(question.panels[0]), "#8").toBe(false);
  });
  test("a collapsed panel does not render its remove button on the right", () => {
    const { question, actions } = createActions({ panelCount: 2, removePanelButtonLocation: "right", templateTitle: "Panel", panelsState: "expanded" });
    const panel = question.panels[0];
    expect(actions.canRenderRemovePanelOnRight(panel), "#1").toBe(true);
    panel.collapse();
    expect(actions.canRenderRemovePanelOnRight(panel), "#2").toBe(false);
  });
  test("the remove button removes its panel and is disposed with it", () => {
    const { question, actions } = createActions({ panelCount: 2 });
    const panel = question.panels[1];
    const remove = actions.getRemovePanelAction(panel);
    remove.action();
    expect(question.panels.indexOf(panel), "#1").toBe(-1);
    expect(remove.isDisposed, "#2").toBe(true);
    expect(actions.getRemovePanelAction(undefined), "#3").toBeUndefined();
  });
  test("disposeRemovePanelAction disposes the action of that panel only", () => {
    const { question, actions } = createActions({ panelCount: 2 });
    const first = actions.getRemovePanelAction(question.panels[0]);
    const second = actions.getRemovePanelAction(question.panels[1]);
    actions.disposeRemovePanelAction(question.panels[0]);
    expect([first.isDisposed, second.isDisposed], "#1").toEqual([true, false]);
    expect(actions.getRemovePanelAction(question.panels[0]) !== first, "#2: a new action").toBe(true);
  });
});

describe("PanelDynamicActions: the tabbed menu", () => {
  test("one tab per visible panel; a tab whose panel leaves is handed to the owner as a left object", () => {
    const { question, owner, actions } = createActions({ panelCount: 3, displayMode: "tab" });
    expect(actions.createdTabbedMenu, "#1: created on first use").toBeUndefined();
    const menu = actions.tabbedMenu;
    expect(actions.createdTabbedMenu, "#2").toBe(menu);
    const tabs = menu.actions.slice();
    expect(tabs.map(tab => tab.panelId), "#3").toEqual(question.visiblePanels.map(panel => panel.id));
    question.removePanel(2);
    actions.updateTabbedMenuItems();
    expect(menu.actions.length, "#4").toBe(2);
    expect(owner.left, "#5").toEqual([tabs[2]]);
    expect(menu.actions[0], "#6: the tab of a panel that stays is kept").toBe(tabs[0]);
  });
  test("a rebuild leaves the tabs alone; outside tab mode the menu is emptied", () => {
    const { question, owner, actions } = createActions({ panelCount: 2, displayMode: "tab" });
    const menu = actions.tabbedMenu;
    owner.isRebuildingPanels = true;
    question.addPanel();
    actions.updateTabbedMenuItems();
    expect(menu.actions.length, "#1").toBe(2);
    owner.isRebuildingPanels = false;
    actions.updateTabbedMenuItems();
    expect(menu.actions.length, "#2").toBe(3);
    question.displayMode = "list";
    actions.updateTabbedMenuItems();
    expect(menu.actions.length, "#3").toBe(0);
    expect(owner.left.length, "#4").toBe(3);
  });
  test("the menu css follows tabAlign", () => {
    const { question, actions } = createActions({ panelCount: 1, displayMode: "tab" });
    const css = { tabsRoot: "root", tabsLeft: "left", tabsRight: "right", tabsCenter: "center", tabs: { item: "tab" } };
    question.tabAlign = "left";
    actions.updateTabbedMenuCss(css);
    expect(actions.tabbedMenu.containerCss, "#1").toBe("root left");
    expect(actions.tabbedMenu.cssClasses.item, "#2: the item classes of the question").toBe("tab");
    question.tabAlign = "right";
    actions.updateTabbedMenuCss(css);
    expect(actions.tabbedMenu.containerCss, "#3").toBe("root right");
  });
});

describe("PanelDynamicActions: disposal", () => {
  test("dispose disposes every action it created: the toolbar with its buttons, the remove buttons, the menu and its tabs", () => {
    const { question, actions } = createActions({ panelCount: 2, displayMode: "tab" });
    const toolbar = actions.footerToolbar;
    const buttons = toolbar.actions.slice();
    const removes = question.panels.map(panel => actions.getRemovePanelAction(panel));
    const menu = actions.tabbedMenu;
    const tabs = menu.actions.slice();
    actions.dispose();
    expect(toolbar.isDisposed, "#1").toBe(true);
    expect(buttons.every(action => action.isDisposed), "#2").toBe(true);
    expect(removes.every(action => action.isDisposed), "#3").toBe(true);
    expect(menu.isDisposed, "#4").toBe(true);
    expect(tabs.every(action => action.isDisposed), "#5").toBe(true);
  });
  test("the question disposes the actions of its helper", () => {
    const question = createQuestion({ panelCount: 2, displayMode: "tab" });
    question.panels;
    const toolbar = question.footerToolbar;
    const buttons = toolbar.actions.slice();
    const removes: Array<Action> = question.panels.map(panel => question.getRemovePanelAction(panel));
    const menu = question.tabbedMenu;
    const tabs = menu.actions.slice();
    question.dispose();
    expect(toolbar.isDisposed && buttons.every(action => action.isDisposed), "#1: the footer").toBe(true);
    expect(removes.every(action => action.isDisposed), "#2: the remove buttons").toBe(true);
    expect(menu.isDisposed && tabs.every(action => action.isDisposed), "#3: the menu").toBe(true);
  });
  test("a question that never showed its actions creates none and disposes none", () => {
    const question = createQuestion({ panelCount: 2 });
    question.panels;
    question.dispose();
    expect(question["actionsValue"]).toBeUndefined();
  });
});
