import { Action } from "./actions/action";
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
      if (!survey.nextPage()) return false;
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
        return tryNavigateToPage(survey, index);
      }
    });
  });
  var listModel = new ListModel(
    items,
    item => {
      if (!!<any>item.action()) {
        listModel.allowSelection = true;
        listModel.selectedItem = item;
        listModel.allowSelection = false;
      }
    },
    true,
    items.filter(i => i.id === survey.currentPage.name)[0]
  );
  listModel.allowSelection = false;
  listModel.locOwner = survey;
  return listModel;
}
