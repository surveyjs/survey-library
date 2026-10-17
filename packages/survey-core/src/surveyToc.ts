import { Action, IAction } from "./actions/action";
import { ComputedUpdater } from "./base";
import { DomDocumentHelper } from "./global_variables_utils";
import { ListModel } from "./list";
import { IListModel } from "./actions/list-model";
import { PageModel } from "./page";
import { PanelModelBase } from "./panel";
import { PopupModel } from "./popup";
import { Question } from "./question";
import { SurveyModel } from "./survey";
import { getLocaleString } from "./surveyStrings";
import type { ILayoutElementModel, ISurveyLayoutElement, LayoutElementContainer } from "./base-interfaces";

export function tryFocusPage(survey: SurveyModel, panel: PanelModelBase): boolean {
  if (survey.isDesignMode) return true;
  const firstQuestion = panel.getFirstQuestionToFocus(false, true);
  expandAllParentPanels(firstQuestion);
  panel.focusFirstQuestion();
  return true;
}

function expandAllParentPanels(question: Question): void {
  let parent = question && question.parent;
  while(parent && parent.getType() !== "page") {
    if (parent.isPanel) {
      const panel = parent as PanelModelBase;
      if (panel.isCollapsed) {
        panel.expand();
      }
    }
    parent = parent.parent;
  }
}

function getPage(question: Question): PageModel {
  if (!!question.parentQuestion) {
    return getPage(question.parentQuestion);
  }
  let parent = question.parent;
  while(parent && parent.getType() !== "page" && parent.parent) {
    parent = parent.parent;
  }
  if (parent && parent.getType() === "page") {
    return <PageModel>(<any>parent);
  }
  return null;
}

export function createTOCListModel(survey: SurveyModel, onAction?: () => void): ListModel<Action> {
  return bindTOCListModel(survey, onAction).listModel;
}

// unbind removes the survey listeners that keep the list up to date; TOCModel calls it on dispose
function bindTOCListModel(survey: SurveyModel, onAction?: () => void): { listModel: ListModel<Action>, unbind: () => void } {
  var items: Action[] = getTOCItems(survey, onAction);
  const listOptions: IListModel = {
    items: items,
    searchEnabled: false,
    locOwner: survey,
    listRole: "menu",
    listItemRole: "menuitemradio",
    listAriaLabel: getLocaleString("toc", survey.getLocale())
  };
  var listModel = new ListModel(listOptions as any);
  listModel.allowSelection = false;
  if (survey.tocItemComponent) {
    listModel.itemComponent = survey.tocItemComponent;
  }
  const updateTocItemComponent = () => {
    if (survey.tocItemComponent) {
      listModel.itemComponent = survey.tocItemComponent;
    }
  };
  survey.registerFunctionOnPropertyValueChanged("tocItemComponent", updateTocItemComponent, "toc");
  const updateSelectedItem = (currentPage: PageModel, defaultSelection?: IAction) => {
    listModel.selectedItem = !!currentPage && listModel.actions.filter(i => i.id === currentPage.name)[0] || defaultSelection;
  };
  updateSelectedItem(survey.currentPage, items[0]);
  const onCurrentPageChanged = () => {
    updateSelectedItem(survey.currentPage);
  };
  const onFocusInQuestion = (s: SurveyModel, o: { question: Question }) => {
    updateSelectedItem(getPage(o.question));
  };
  survey.onCurrentPageChanged.add(onCurrentPageChanged);
  survey.onFocusInQuestion.add(onFocusInQuestion);
  const updatePagesFunc = () => {
    listModel.setItems(getTOCItems(survey, onAction));
  };
  survey.registerFunctionOnPropertyValueChanged("pages", updatePagesFunc, "toc");
  survey.onEndLoadingFromJson.add(updatePagesFunc);
  const unbind = () => {
    // The "toc" key is shared: another TOC model of the same survey may have already unregistered it
    survey.unRegisterFunctionOnPropertyValueChanged("tocItemComponent", "toc");
    survey.unRegisterFunctionOnPropertyValueChanged("pages", "toc");
    survey.onCurrentPageChanged.remove(onCurrentPageChanged);
    survey.onFocusInQuestion.remove(onFocusInQuestion);
    survey.onEndLoadingFromJson.remove(updatePagesFunc);
  };
  return { listModel, unbind };
}

function getTOCItems(survey: SurveyModel, onAction: () => void) {
  const pagesSource: PanelModelBase[] = survey.pages;
  var items = (pagesSource || []).map(page => {
    return new Action({
      id: page.name,
      locTitle: page.locNavigationTitle,
      data: { page: page, survey: survey },
      action: () => {
        DomDocumentHelper.activeElementBlur();
        !!onAction && onAction();
        if (page.isPage) {
          return survey.tryNavigateToPage(page as PageModel);
        } else if (page.isPanel) {
          return tryFocusPage(survey, page as PanelModelBase);
        }
      },
      visible: <any>new ComputedUpdater(() => {
        return page.isVisible && !((<any>page)["isStartPage"]);
      })
    });
  });
  return items;
}

export function getTocRootCss(survey: SurveyModel, isMobile = false): string {
  let rootCss = TOCModel.RootStyle;
  if (isMobile) {
    return rootCss + " " + TOCModel.RootStyle + "--mobile";
  }
  rootCss += (" " + TOCModel.RootStyle + "--" + (survey.tocLocation || "").toLowerCase());
  if (TOCModel.StickyPosition) {
    rootCss += " " + TOCModel.RootStyle + "--sticky";
  }
  return rootCss;
}

export class TOCModel implements ILayoutElementModel {
  public static RootStyle = "sv_progress-toc";
  public static StickyPosition = true;
  constructor(public survey: SurveyModel) {
    const binding = bindTOCListModel(survey, () => { this.popupModel.isVisible = false; });
    this.listModel = binding.listModel;
    this.unbindListModel = binding.unbind;
    this.popupModel = new PopupModel("sv-list", { model: this.listModel });
    this.popupModel.overlayDisplayMode = "tablet-dropdown-overlay";
    this.popupModel.displayMode = <any>new ComputedUpdater(() => this.isMobile ? "overlay" : "popup");
    if (TOCModel.StickyPosition) {
      survey.registerFunctionOnPropertyValueChanged("_isMobile", () => this.updateStickyTOCSize(survey.rootElement), "toc");
      survey.onAfterRenderSurvey.add(this.onAfterRenderSurvey);
      this.initStickyTOCSubscriptions(survey.rootElement);
    }
  }
  private isDisposedValue: boolean = false;
  private unbindListModel: () => void;
  public get isDisposed(): boolean {
    return this.isDisposedValue;
  }
  // The listener keeps the model alive through its closure, so it is removed on re-render, destroy and dispose (Bug#12003)
  private stickyRootElement: HTMLElement;
  private onAfterRenderSurvey = (sender: SurveyModel, options: { htmlElement: HTMLElement }): void => {
    this.initStickyTOCSubscriptions(options.htmlElement);
  };
  private onRootElementScroll = (): void => {
    this.updateStickyTOCSize(this.stickyRootElement);
  };

  public createLayoutElements(): Array<ISurveyLayoutElement> {
    const layoutElement: ISurveyLayoutElement = {
      id: "toc-navigation",
      component: "sv-navigation-toc",
      getData: () => this,
      processResponsiveness: () => this.updateStickyTOCSize(this.survey.rootElement),
      isInContainer: (container: LayoutElementContainer) => this.isTocNavigationInContainer(container)
    };
    return [layoutElement];
  }

  private isTocNavigationInContainer(container: LayoutElementContainer): boolean {
    if (this.survey.state !== "running" || !this.survey.showTOC) return false;
    if (container === "left") return ["left", "both"].indexOf(this.survey.tocLocation) !== -1;
    if (container === "right") return ["right", "both"].indexOf(this.survey.tocLocation) !== -1;
    return false;
  }

  private initStickyTOCSubscriptions(rootElement: HTMLElement) {
    if (TOCModel.StickyPosition && !!rootElement && !this.isDisposed) {
      this.removeStickyTOCSubscriptions();
      this.stickyRootElement = rootElement;
      rootElement.addEventListener("scroll", this.onRootElementScroll);
      this.updateStickyTOCSize(rootElement);
    }
  }
  public removeStickyTOCSubscriptions(): void {
    if (!!this.stickyRootElement) {
      this.stickyRootElement.removeEventListener("scroll", this.onRootElementScroll);
      this.stickyRootElement = undefined;
    }
  }

  public updateStickyTOCSize(rootElement: HTMLElement): void {
    if (!rootElement) {
      return;
    }
    const tocRootElement = rootElement.querySelector("." + TOCModel.RootStyle) as HTMLDivElement;
    if (!!tocRootElement) {
      tocRootElement.style.height = "";
      if (!this.isMobile && TOCModel.StickyPosition && !!rootElement) {
        const rootHeight = rootElement.getBoundingClientRect().height;
        const headerLayoutElement = this.survey.findLayoutElement("advanced-header");
        const advHeader = headerLayoutElement && headerLayoutElement.data;
        let isBelowHeader = !advHeader || advHeader.hasBackground;
        const titleSelector = this.survey.headerView === "advanced" ? ".sv-header" : ".sv_custom_header+div div." + (this.survey.css.title || "sd-title");
        const titleElement = rootElement.querySelector(titleSelector) as HTMLDivElement;
        const titleElementHeight = (this.survey.hasTitle || this.survey.hasLogo) && !!titleElement && isBelowHeader ? titleElement.getBoundingClientRect().height : 0;
        const scrollElement = rootElement.querySelector(".sv-scroll__scroller") as HTMLDivElement || rootElement;
        const scrollCompensationHeight = scrollElement.scrollTop > titleElementHeight ? 0 : titleElementHeight - scrollElement.scrollTop;
        tocRootElement.style.height = (rootHeight - scrollCompensationHeight - 1) + "px";
      }
    }
  }

  get isMobile(): boolean {
    return this.survey.isMobile;
  }
  get containerCss(): string {
    return getTocRootCss(this.survey, this.isMobile);
  }
  listModel: ListModel<Action>;
  popupModel: PopupModel;
  icon = "icon-navmenu_24x24";
  togglePopup = (): void => {
    this.popupModel.toggleVisibility();
  };
  public dispose(): void {
    if (this.isDisposed) return;
    this.isDisposedValue = true;
    this.removeStickyTOCSubscriptions();
    this.survey.onAfterRenderSurvey.remove(this.onAfterRenderSurvey);
    this.survey.unRegisterFunctionOnPropertyValueChanged("_isMobile", "toc");
    this.unbindListModel();
    this.popupModel.dispose();
    this.listModel.dispose();
  }
}
