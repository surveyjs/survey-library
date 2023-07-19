import { Action } from "./actions/action";
import { ComputedUpdater } from "./base";
import { ListModel } from "./list";
import { PageModel } from "./page";
import { PanelModelBase } from "./panel";
import { PopupModel } from "./popup";
import { SurveyModel } from "./survey";
import { IsTouch } from "./utils/devices";

export function tryNavigateToPage(survey: SurveyModel, page: PageModel) {
  if (survey.isDesignMode) return;
  const index = survey.visiblePages.indexOf(page);
  if (index < survey.currentPageNo) {
    survey.currentPageNo = index;
  }
  else if (index > survey.currentPageNo) {
    for (let i = survey.currentPageNo; i < index; i++) {
      if (!survey.nextPageUIClick()) return false;
    }
  }
  return true;
}

export function tryFocusPage(survey: SurveyModel, panel: PanelModelBase) {
  if (survey.isDesignMode) return true;
  panel.focusFirstQuestion();
  return true;
}

export function createTOCListModel(survey: SurveyModel, onAction?: () => void) {
  const pagesSource: PanelModelBase[] = survey.questionsOnPageMode === "singlePage" ? (survey.pages[0]?.elements as any) : survey.pages;
  var items = (pagesSource || []).map(page => {
    return new Action({
      id: page.name,
      title: ((<any>page)["navigationTitle"]) || page.title || page.name,
      action: () => {
        if (typeof document !== undefined && !!document.activeElement) {
          !!(<any>document.activeElement).blur && (<any>document.activeElement).blur();
        }
        !!onAction && onAction();
        if(page instanceof PageModel) {
          return tryNavigateToPage(survey, page);
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
    items.filter(i => i.id === survey.currentPage.name)[0] || items.filter(i => i.id === pagesSource[0].name)[0]
  );
  listModel.allowSelection = false;
  listModel.locOwner = survey;
  survey.onCurrentPageChanged.add((s, o) => {
    listModel.selectedItem = items.filter(i => i.id === survey.currentPage.name)[0];
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
  }

  isMobile = IsTouch;
  get containerCss(): string {
    return getTocRootCss(this.survey, this.isMobile);
  }
  listModel: ListModel<Action>;
  popupModel: PopupModel;
  icon = "icon-navmenu_24x24";
  togglePopup = () => {
    this.popupModel.toggleVisibility();
  }
}
