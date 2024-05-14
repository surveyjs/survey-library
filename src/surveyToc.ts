import { Action } from "./actions/action";
import { ComputedUpdater } from "./base";
import { DomDocumentHelper } from "./global_variables_utils";
import { ListModel } from "./list";
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
  var listModel = new ListModel(
    items,
    item => {
      if (!!<any>item.action()) {
        listModel.selectedItem = item;
      }
    },
    true,
    items.filter(i => !!survey.currentPage && i.id === survey.currentPage.name)[0] || items.filter(i => i.id === pagesSource[0].name)[0]
  );
  listModel.allowSelection = false;
  listModel.locOwner = survey;
  listModel.searchEnabled = false;
  survey.onCurrentPageChanged.add((s, o) => {
    listModel.selectedItem = items.filter(i => !!survey.currentPage && i.id === survey.currentPage.name)[0];
  });
  return listModel;
}

export function getTocRootCss(survey: SurveyModel, isMobile = false): string {
  if (isMobile) {
    return "sv_progress-toc sv_progress-toc--mobile";
  }
  return "sv_progress-toc" + (" sv_progress-toc--" + (survey.tocLocation || "").toLowerCase());
}

export class TOCModel {
  constructor(public survey: SurveyModel) {
    this.listModel = createTOCListModel(survey, () => { this.popupModel.isVisible = false; });
    this.popupModel = new PopupModel("sv-list", { model: this.listModel });
    this.popupModel.overlayDisplayMode = "overlay";
    this.popupModel.displayMode = <any>new ComputedUpdater(() => this.isMobile ? "overlay" : "popup");
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
