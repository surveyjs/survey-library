import { Action } from "./actions/action";
import { ComputedUpdater } from "./base";
import { ListModel } from "./list";
import { SurveyModel } from "./survey";
import { CssClassBuilder } from "./utils/cssClassBuilder";

export function tryNavigateToPage (survey: SurveyModel, index: number) {
  if (survey.isDesignMode) return;
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

export function createTOCListModel(survey: SurveyModel) {
  var items = survey.pages.map((page, index) => {
    return new Action({
      id: page.name,
      title: page.navigationTitle || page.title || page.name,
      action: () => {
        if(typeof document !== undefined && !!document.activeElement) {
          !!(<any>document.activeElement).blur && (<any>document.activeElement).blur();
        }
        return tryNavigateToPage(survey, index);
      },
      visible: <any>new ComputedUpdater(() => page.isVisible && !page.isStartPage)
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
    items.filter(i => i.id === survey.currentPage.name)[0]
  );
  listModel.allowSelection = false;
  listModel.locOwner = survey;
  survey.onCurrentPageChanged.add((s, o) => {
    listModel.selectedItem = items.filter(i => i.id === survey.currentPage.name)[0];
  });
  return listModel;
}

export function getTocRootCss(survey: SurveyModel): string {
  return "sv_progress-toc" + (" sv_progress-toc--" + (survey.tocLocation || "").toLowerCase());
}