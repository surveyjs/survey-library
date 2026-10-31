import { Action, IAction } from "./actions/action";
import { defaultActionBarCss } from "./actions/actionBarCss";
import { AdaptiveActionContainer } from "./actions/adaptive-container";
import { ActionContainer } from "./actions/container";
import { ComputedUpdater } from "./base";
import { LocalizableString } from "./localizablestring";
import { toCssClasses } from "./utils/cssClassBuilder";
import type { PanelModel } from "./panel";
import type { QuestionPanelDynamicModel } from "./question_paneldynamic";

interface IPanelDynamicTabbedMenuItem extends IAction {
  panelId: string;
}
export class PanelDynamicTabbedMenuItem extends Action {
  public panelId: string;
  constructor(innerItem: IPanelDynamicTabbedMenuItem) {
    super(innerItem);
  }
}

// What the actions read from the dynamic panel besides its public members.
export interface IPanelDynamicActionsOwner {
  readonly question: QuestionPanelDynamicModel;
  readonly canGoToNextRecord: boolean;
  readonly isRebuildingPanels: boolean;
  // The visible panels that exist; reading them builds none.
  getVisiblePanels(): Array<PanelModel>;
  getPanelVisibleIndex(panel: PanelModel): number;
  createActionContainer(): ActionContainer;
  disposeLeftObject(obj: { dispose(): void }): void;
}

/* The question properties the footer buttons follow: a change of one updates them. The buttons also
   read values that are not properties - the current panel's visibleIndex, the records a source reports,
   the panels a build creates - and the question updates them where those change (updateFooterActions).
   Their visibility is not computed (ComputedUpdater): its dependencies are collected on the first run
   only, and reading the panels builds them. */
const footerPropertyNames = ["newPanelPosition", "displayMode", "showProgressBar", "allowAddPanel", "panelCountExpression",
  "maxPanelCount", "isReadOnly", "_isMobile"];

/* The actions of a dynamic panel: the footer toolbar (Previous, Next, Add, the progress text), the
   tabbed menu and each panel's remove button. Every action it creates is disposed by it: a remove
   action with its panel or with the question, a tab when its panel leaves the page, the rest with the
   question. */
export class PanelDynamicActions {
  private footerToolbarValue: ActionContainer;
  public updateFooterActionsCallback: () => void;
  // Keyed by panel.uniqueId. An action goes with its panel (disposeRemovePanelAction): its computed
  // properties keep handlers on the question.
  private removePanelActions: { [uniqueId: string]: Action } = {};
  private tabbedMenuValue: AdaptiveActionContainer<PanelDynamicTabbedMenuItem>;
  private tabActions: { [panelId: string]: PanelDynamicTabbedMenuItem } = {};
  constructor(private owner: IPanelDynamicActionsOwner) { }
  public dispose(): void {
    disposeActions(this.removePanelActions);
    this.removePanelActions = {};
    disposeActions(this.tabActions);
    this.tabActions = {};
    if (!!this.tabbedMenuValue) {
      this.tabbedMenuValue.dispose();
    }
    if (!!this.footerToolbarValue) {
      this.footerToolbarValue.dispose();
    }
  }
  public get footerToolbar(): ActionContainer {
    if (!this.footerToolbarValue) {
      this.initFooterToolbar();
    }
    return this.footerToolbarValue;
  }
  public get addPanelAction(): Action {
    return this.footerToolbar.getActionById("sv-pd-add-btn");
  }
  public updateFooterActions(): void {
    if (!!this.updateFooterActionsCallback) {
      this.updateFooterActionsCallback();
    }
  }
  private initFooterToolbar(): void {
    const question = this.owner.question;
    this.footerToolbarValue = this.owner.createActionContainer();
    this.footerToolbarValue.setActionsAppearance({ style: "brand", mode: "secondary", size: "small" });
    const items = [];
    const prevTextBtn = new Action({
      id: "sv-pd-prev-btn",
      locTitle: question.locPrevPanelText,
      action: () => {
        question.goToPrevPanel();
      }
    });
    const nextTextBtn = new Action({
      id: "sv-pd-next-btn",
      locTitle: question.locNextPanelText,
      action: () => {
        question.goToNextPanel();
      }
    });
    const progressText = new Action({
      id: "sv-pd-progress-text",
      component: "sv-paneldynamic-progress-text",
      data: { question: question }
    });
    const addBtn = new Action({
      id: "sv-pd-add-btn",
      enabled: <any>new ComputedUpdater(() => question.enableAddPanel !== false),
      action: () => {
        question.addPanelUI();
      },
      locTitle: question.locAddPanelText,
      innerCss: question.getAddButtonCss()
    });
    items.push(prevTextBtn, nextTextBtn, addBtn, progressText);
    this.updateFooterActionsCallback = () => {
      const isRenderModeList = question.isRenderModeList;
      const isMobile = question.isMobile;
      const showNavigation = !isRenderModeList;
      prevTextBtn.visible = showNavigation && question.currentIndex > 0;
      nextTextBtn.visible = showNavigation && this.owner.canGoToNextRecord;
      nextTextBtn.needSpace = isMobile && nextTextBtn.visible && prevTextBtn.visible;
      addBtn.visible = question.canAddPanel;
      addBtn.needSpace = question.isMobile && !nextTextBtn.visible && prevTextBtn.visible;
      progressText.visible = !question.isRenderModeList && !isMobile && !question.getShowNoEntriesPlaceholder();
      progressText.needSpace = !question.isMobile;
    };
    this.updateFooterActionsCallback();
    // Before the toolbar exists there is nothing to update. The handlers are on the question and go with it.
    question.registerPropertyChangedHandlers(footerPropertyNames, (): void => { this.updateFooterActions(); }, "panelDynamicFooter");
    this.footerToolbarValue.setItems(items);
    this.footerToolbar.containerCss = question.cssClasses.toolbar;
    this.footerToolbar.flushUpdates();
    question._showFooterToolbar = new ComputedUpdater<boolean>(() => this.footerToolbarValue?.hasVisibleActions) as any as boolean;
  }
  public getRemovePanelAction(panel: PanelModel): Action {
    if (!panel) return undefined;
    if (!this.removePanelActions[panel.uniqueId]) {
      const question = this.owner.question;
      const action = new Action({
        id: `remove-panel-${panel.id}`,
        locTitle: question.locRemovePanelText,
        innerCss: question.getPanelRemoveButtonCss(),
        appearance: { style: "alert", mode: "secondary", size: "small" },
        action: () => {
          if (!question.isInputReadOnly) {
            question.removePanelUI(panel);
            if (panel.isDisposed) {
              this.disposeRemovePanelAction(panel);
            }
          }
        },
        visible: <any>new ComputedUpdater(() => this.canRenderRemovePanel(panel) === true),
        enabled: <any>new ComputedUpdater(() => question.enableRemovePanel !== false),
        data: { question: question, panel: panel }
      });
      action.cssClasses = question.survey?.getCss().actionBar || defaultActionBarCss;
      this.removePanelActions[panel.uniqueId] = action;
    }
    return this.removePanelActions[panel.uniqueId];
  }
  public disposeRemovePanelAction(panel: PanelModel): void {
    const action = this.removePanelActions[panel.uniqueId];
    delete this.removePanelActions[panel.uniqueId];
    if (!!action && !action.isDisposed) {
      action.dispose();
    }
  }
  // The question's getRemovePanelAction, which a subclass may override.
  public getPanelActions(panel: PanelModel): Array<IAction> {
    const question = this.owner.question;
    let actions = panel.footerActions;
    if (question.removePanelButtonLocation !== "right") {
      actions.push(question.getRemovePanelAction(panel));
    }
    if (!!question.survey) {
      actions = question.titleSettings.getUpdatedPanelFooterActions(panel, actions, question);
    }
    return actions;
  }
  public canRenderRemovePanelOnRight(panel: PanelModel): boolean {
    const notCollpased = panel.state !== "collapsed";
    return this.canRenderRemovePanel(panel, "right") && notCollpased;
  }
  private canRenderRemovePanel(panel: PanelModel, side?: string): boolean {
    const question = this.owner.question;
    const canRemove = question.canRemovePanel;
    return (side !== undefined ? question.removePanelButtonLocation === side : true) && canRemove;
  }
  // The menu once it is created; the question asks for it in tab mode only.
  public get createdTabbedMenu(): AdaptiveActionContainer<PanelDynamicTabbedMenuItem> {
    return this.tabbedMenuValue;
  }
  public get tabbedMenu(): AdaptiveActionContainer<PanelDynamicTabbedMenuItem> {
    if (!this.tabbedMenuValue) {
      this.tabbedMenuValue = new AdaptiveActionContainer<PanelDynamicTabbedMenuItem>();
      this.tabbedMenuValue.dotsItem.popupModel.showPointer = false;
      this.tabbedMenuValue.dotsItem.popupModel.verticalPosition = "bottom";
      this.tabbedMenuValue.dotsItem.popupModel.horizontalPosition = "center";
      this.owner.question.updateElementCss(false);
      this.updateTabbedMenuItems();
    }
    return this.tabbedMenuValue;
  }
  /* cssClasses: the classes calcCssClasses has just computed - the question's cssClasses are not set yet
     then. Without them (a new tabAlign) the menu takes the question's and keeps its item classes. */
  public updateTabbedMenuCss(cssClasses?: any): void {
    const tabbedMenu = this.tabbedMenu;
    tabbedMenu.containerCss = this.getTabbedMenuCss(cssClasses);
    if (!!cssClasses) {
      tabbedMenu.cssClasses = cssClasses.tabs;
    }
  }
  private getTabbedMenuCss(cssClasses?: any): string {
    const question = this.owner.question;
    const css = cssClasses ?? question.cssClasses;
    return toCssClasses(
      css.tabsRoot,
      question.tabAlign === "left" && css.tabsLeft,
      question.tabAlign === "right" && css.tabsRight,
      question.tabAlign === "center" && css.tabsCenter
    );
  }
  /* One tab per panel of the page. Nothing positional is captured: the title event gets the tab's
     visibleIndex at the time the title is asked for, "active" is computed from currentPanel, and a
     click maps the panel to its pageVisibleIndex and then to its visibleIndex - an insert in front of
     the tab or a page other than the first cannot make any of them stale. */
  private createTabByPanel(panel: PanelModel): PanelDynamicTabbedMenuItem {
    const question = this.owner.question;
    const locTitle = new LocalizableString(panel, true);
    locTitle.onGetTextCallback = (str: string): string => {
      if (!str) {
        str = question.locTabTitlePlaceholder.renderedHtml;
      }
      if (!question.survey) return str;
      const options = {
        title: str,
        panel: panel,
        visiblePanelIndex: this.owner.getPanelVisibleIndex(panel)
      };
      question.dynamicPanelCallbacks.dynamicPanelGetTabTitle(question, options);
      return options.title;
    };
    locTitle.sharedData = question.locTemplateTabTitle;
    const panelId = panel.id;
    const isActive = (): boolean => question.getPropertyValue("currentPanelId") === panelId;
    const newItem = new PanelDynamicTabbedMenuItem({
      id: `${question.id}_tab_${panelId}`,
      panelId: panelId,
      active: <any>new ComputedUpdater<boolean>(isActive),
      locTitle: locTitle,
      disableHide: <any>new ComputedUpdater<boolean>(isActive),
      action: () => {
        const visibleIndex = this.owner.getPanelVisibleIndex(panel);
        if (visibleIndex > -1) {
          question.currentIndex = visibleIndex;
        }
      }
    });
    return newItem;
  }
  /* The tab bar is derived from the page (Andrew's decision 2026-09-25): its actions are the current
     page's visiblePanels, in order, computed from that one source whenever it changes. An action is
     reused for the same panel, so that the adaptive overflow is not reset needlessly. A rebuild
     derives it once, at its end. */
  public updateTabbedMenuItems(): void {
    if (!this.tabbedMenuValue || this.owner.isRebuildingPanels) return;
    if (!this.owner.question.isRenderModeTab) {
      this.disposeReplacedTabActions({});
      if (this.tabbedMenuValue.actions.length > 0)this.tabbedMenuValue.setItems([]);
      return;
    }
    const actions: { [panelId: string]: PanelDynamicTabbedMenuItem } = {};
    const items = this.owner.getVisiblePanels().map((panel: PanelModel): PanelDynamicTabbedMenuItem => {
      const action = this.tabActions[panel.id] || this.createTabByPanel(panel);
      actions[panel.id] = action;
      return action;
    });
    this.disposeReplacedTabActions(actions);
    const current = this.tabbedMenuValue.actions;
    if (current.length === items.length && current.every((a: Action, i: number): boolean => a === items[i])) return;
    this.tabbedMenuValue.setItems(items);
  }
  /* A tab whose panel left the page is never reused: a panel that comes back gets a new one. The old one
     keeps handlers on the question (its computed properties), and the menu can still show it until the
     UI rerenders the question. */
  private disposeReplacedTabActions(actions: { [panelId: string]: PanelDynamicTabbedMenuItem }): void {
    const old = this.tabActions;
    this.tabActions = actions;
    Object.keys(old).forEach((panelId: string): void => {
      const action = old[panelId];
      if (actions[panelId] !== action && !action.isDisposed) {
        this.owner.disposeLeftObject(action);
      }
    });
  }
}

function disposeActions(actions: { [key: string]: Action }): void {
  Object.keys(actions).forEach((key: string): void => {
    if (!actions[key].isDisposed) actions[key].dispose();
  });
}
