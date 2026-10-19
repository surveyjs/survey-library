import { ComputedUpdater } from "../base";
import { Action } from "../actions/action";
import type { ActionContainer } from "../actions/container";
import type { RecordsPagingController } from "./records-paging";

// What the pager reads from the records question besides the paging helper.
export interface IRecordsPagerOwner {
  // What the question reports: 1 page and page 0 while it does not page.
  readonly pageIndex: number;
  readonly pageCount: number;
  getLocalizationFormatString(strName: string, ...args: any[]): string;
}

// A page-move action of the pager: an icon button with a localized title.
function createPageMoveAction(owner: IRecordsPagerOwner, id: string, iconName: string, titleName: string, canMove: () => boolean, move: () => void): Action {
  return new Action({
    id: id,
    iconName: iconName,
    showTitle: false,
    title: <any>new ComputedUpdater(() => owner.getLocalizationFormatString(titleName)),
    enabled: <any>new ComputedUpdater(canMove),
    action: move
  });
}
/* The pager the renderers show through their action bar (QuestionRecordsModel.pagerActions): it
   computes nothing of its own, it shows what the paging helper answers. The page buttons are icons
   whose localized titles are their accessible names; the page info is a disabled item without a tab
   stop, text the keyboard passes over. */
export function createRecordsPagerActions(container: ActionContainer, paging: RecordsPagingController, owner: IRecordsPagerOwner): ActionContainer {
  const prevAction = createPageMoveAction(owner, "sv-pager-prev", "icon-arrowleft", "pagePrevText",
    (): boolean => paging.canGoPrevPage, (): void => { paging.prevPage(); });
  const pageInfoAction = new Action({
    id: "sv-pager-info",
    /* A count nobody knows has no total to show: the page number alone. A known count goes through
       indexText like every other pager (some locales reverse the order). survey.locale is a property
       read, so the updater follows it; the global surveyLocalization.currentLocale is not observed.
       Both texts are computed on every run: a ComputedUpdater collects its dependencies once, on the
       first run, so a branch not taken then (the total, while the count is unknown) is never
       observed afterwards. */
    title: <any>new ComputedUpdater(() => {
      const page = owner.pageIndex + 1;
      const text = owner.getLocalizationFormatString("indexText", page, owner.pageCount);
      return paging.isCountKnown ? text : String(page);
    }),
    enabled: false,
    disableTabStop: true
  });
  const nextAction = createPageMoveAction(owner, "sv-pager-next", "icon-arrowright", "pageNextText",
    (): boolean => paging.canGoNextPage, (): void => { paging.nextPage(); });
  container.setItems([prevAction, pageInfoAction, nextAction]);
  return container;
}
