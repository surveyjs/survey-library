import { Action } from "./actions/action";
import { ComputedUpdater } from "./base";
import { DomDocumentHelper } from "./global_variables_utils";
import { IListModel, ListModel } from "./list";
import { PageModel } from "./page";
import { PanelModelBase } from "./panel";
import { PopupModel } from "./popup";
import { SurveyModel } from "./survey";
import { IsTouch } from "./utils/devices";

export function tryFocusPage(survey: SurveyModel, panel: PanelModelBase): boolean {
  if (survey.isDesignMode) return true;
  panel.focusFirstQuestion();
  return true;
}

export function createTOCListModel(survey: SurveyModel, onAction?: () => void) {
  const pagesSource: PanelModelBase[] = survey.questionsOnPageMode === "singlePage" ? (survey.pages[0]?.elements as any) : survey.pages;
  var items = (pagesSource || []).map(page => {
    return new Action({
      id: page.name,
      locTitle: page.locNavigationTitle,
      action: () => {
        DomDocumentHelper.activeElementBlur();
        !!onAction && onAction();
        if (page instanceof PageModel) {
          return survey.tryNavigateToPage(page);
        }
        return tryFocusPage(survey, page);
      },
      visible: <any>new ComputedUpdater(() => page.isVisible && !((<any>page)["isStartPage"]))
    });
  });
  const selectedItem = items.filter(i => !!survey.currentPage && i.id === survey.currentPage.name)[0] || items.filter(i => i.id === pagesSource[0].name)[0];
  const listOptions: IListModel = {
    items: items,
    onSelectionChanged: item => {
      if (!!<any>item.action()) {
        listModel.selectedItem = item;
      }
    },
    allowSelection: true,
    searchEnabled: false,
    locOwner: survey,
    selectedItem: selectedItem
  };
  var listModel = new ListModel(listOptions as any);
  listModel.allowSelection = false;
  survey.onCurrentPageChanged.add((s, o) => {
    listModel.selectedItem = items.filter(i => !!survey.currentPage && i.id === survey.currentPage.name)[0];
  });
  return listModel;
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

export class TOCModel {
  public static RootStyle = "sv_progress-toc";
  public static StickyPosition = true;
  constructor(public survey: SurveyModel) {
    this.listModel = createTOCListModel(survey, () => { this.popupModel.isVisible = false; });
    this.popupModel = new PopupModel("sv-list", { model: this.listModel });
    this.popupModel.overlayDisplayMode = "plain";
    this.popupModel.displayMode = <any>new ComputedUpdater(() => this.isMobile ? "overlay" : "popup");
    if (TOCModel.StickyPosition) {
      survey.onAfterRenderSurvey.add((s, o) => this.initStickyTOCSubscriptions(o.htmlElement));
      this.initStickyTOCSubscriptions(survey.rootElement);
    }
  }

  private initStickyTOCSubscriptions(rootElement: HTMLElement) {
    if (TOCModel.StickyPosition && !!rootElement) {
      rootElement.addEventListener("scroll", (event) => {
        this.updateStickyTOCSize(rootElement);
      });
      this.updateStickyTOCSize(rootElement);
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
        const titleSelector = this.survey.headerView === "advanced" ? ".sv-header" : ".sv_custom_header+div div." + (this.survey.css.title || "sd-title");
        const titleElement = rootElement.querySelector(titleSelector) as HTMLDivElement;
        const titleElementHeight = titleElement ? titleElement.getBoundingClientRect().height : 0;
        const scrollCompensationHeight = rootElement.scrollTop > titleElementHeight ? 0 : titleElementHeight - rootElement.scrollTop;
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
  }
  public dispose(): void {
    this.popupModel.dispose();
    this.listModel.dispose();
  }
}
