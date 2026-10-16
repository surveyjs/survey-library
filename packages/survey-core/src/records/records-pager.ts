import { ComputedUpdater } from "../base";
import { Action, IAction } from "../actions/action";
import { createDropdownActionModel } from "../actions/dropdown-action";
import type { ActionContainer } from "../actions/container";
import type { ListModel } from "../list";
import type { ILocalizableOwner } from "../localizablestring";

// The class names the pager gives its page dropdown and its "of N" text.
export interface IRecordsPagerCssClasses { pagerPage: string, pagerTotal: string }

// What the pager reads from its records question and the moves it makes.
export interface IRecordsPagerOwner {
  // The list's paging state: the page it is on, its page count and whether the count is known.
  readonly pageIndex: number;
  readonly pageCount: number;
  readonly isCountKnown: boolean;
  readonly canGoPrevPage: boolean;
  readonly canGoNextPage: boolean;
  // A move waits for asynchronous validators, or a page is being read: nothing can be moved meanwhile.
  readonly isPageMovePending: boolean;
  readonly isDataLoading: boolean;
  // On a phone the page list opens as a sheet (createPageDropdownAction).
  readonly isMobile: boolean;
  goToPage(pageIndex: number): void;
  prevPage(): void;
  nextPage(): void;
  getLocalizationFormatString(strName: string, ...args: any[]): string;
  // The owner of the page list's texts: locale, Markdown, renderers and text processing.
  getLocOwner(): ILocalizableOwner;
  getCssClasses(): IRecordsPagerCssClasses;
}

// First and Last show from this many known pages up. They show together, so the side groups keep
// one width and the page dropdown stays centred between them.
export const pagerEdgeMinPageCount = 10;

interface IPagerState {
  pageIndex: number;
  pageCount: number;
  isCountKnown: boolean;
  canGoPrevPage: boolean;
  canGoNextPage: boolean;
  canMove: boolean;
  showEdges: boolean;
}

/* Every updater of the pager reads its inputs through here. A ComputedUpdater collects its
   dependencies on its first run only, so an input that a && or || skips on that run is never
   observed afterwards: every input is read into its own local before any of them is combined.
   canGoPrevPage and canGoNextPage get locals of their own, since they short-circuit on
   isPageMovePending inside the paging helper. */
function getPagerState(owner: IRecordsPagerOwner): IPagerState {
  const pageIndex = owner.pageIndex;
  const pageCount = owner.pageCount;
  const isCountKnown = owner.isCountKnown;
  const isPageMovePending = owner.isPageMovePending;
  const isDataLoading = owner.isDataLoading;
  const canGoPrevPage = owner.canGoPrevPage;
  const canGoNextPage = owner.canGoNextPage;
  const canMove = !isPageMovePending && !isDataLoading;
  return { pageIndex: pageIndex, pageCount: pageCount, isCountKnown: isCountKnown, canGoPrevPage: canGoPrevPage,
    canGoNextPage: canGoNextPage, canMove: canMove, showEdges: isCountKnown && pageCount >= pagerEdgeMinPageCount };
}
// A page-move action of the pager: an icon button whose localized title is its tooltip and accessible name.
function createPageMoveAction(owner: IRecordsPagerOwner, options: IAction, titleName: string,
  isEnabled: (state: IPagerState) => boolean, isVisible?: (state: IPagerState) => boolean): Action {
  return new Action(Object.assign({
    showTitle: false,
    iconSize: "auto",
    title: <any>new ComputedUpdater(() => owner.getLocalizationFormatString(titleName)),
    enabled: <any>new ComputedUpdater(() => isEnabled(getPagerState(owner))),
    visible: !!isVisible ? <any>new ComputedUpdater(() => isVisible(getPagerState(owner))) : true
  }, options));
}
/* The page dropdown: the one-based current page, and a list of every page to jump to. The list
   holds pageCount pages, which with an unknown count includes the one page beyond those read: the
   list reaches exactly as far as Next. Its items are built when it opens, not on every page move: a
   remote source can have thousands of pages. From pagerEdgeMinPageCount pages the list shows its
   filter, so the page number can be typed.
   On a phone the list opens as a sheet at the bottom of the screen: a title, a close button and an
   Apply button. A pick there only marks the page; Apply moves to it, and closing the sheet drops it. */
function createPageDropdownAction(owner: IRecordsPagerOwner): Action {
  const getTitle = (): string => String(getPagerState(owner).pageIndex + 1);
  let isSheet = false;
  // Runs before the popup shows, so it opens in the mode the question is in now.
  const updatePopupMode = (): void => {
    isSheet = owner.isMobile;
    const popup = action.popupModel;
    popup.displayMode = isSheet ? "overlay" : "popup";
    popup.overlayDisplayMode = "dropdown-overlay";
    popup.title = isSheet ? owner.getLocalizationFormatString("pagerSelectPageTitle") : "";
    popup.showCloseButton = isSheet;
    popup.cssClass = isSheet ? "sv-popup--sheet" : "";
    // The sheet opens without the phone's keyboard: the filter is focused when the respondent taps it.
    popup.isFocusedContent = !isSheet;
  };
  const action = createDropdownActionModel({
    action: updatePopupMode,
    id: "sv-pager-page",
    title: <any>new ComputedUpdater(getTitle),
    showTitle: true,
    iconName: "icon-chevrondown-16x16",
    iconSize: "auto",
    appearance: { mode: "secondary" },
    innerCss: owner.getCssClasses().pagerPage,
    needSpace: true,
    enabled: <any>new ComputedUpdater(() => getPagerState(owner).canMove),
    // Both texts are computed on every run (see getPagerState).
    ariaLabel: <any>new ComputedUpdater(() => {
      const state = getPagerState(owner);
      const page = state.pageIndex + 1;
      const known = owner.getLocalizationFormatString("progressText", page, state.pageCount);
      const unknown = owner.getLocalizationFormatString("progressbarPage", page);
      return state.isCountKnown ? known : unknown;
    })
  }, {
    items: [],
    allowSelection: true,
    onSelectionChanged: (item: IAction): void => {
      owner.goToPage(item.data);
      /* The dropdown has already written the picked item's title onto the button. A forward pick that
         fails validation, or waits for it, has not moved: the button shows the page the question is
         on. The title's updater stays in place and follows the move once it happens. */
      action.title = getTitle();
    },
    onShow: (): void => {
      const state = getPagerState(owner);
      const items: Array<IAction> = [];
      for (let i = 0; i < state.pageCount; i++) {
        items.push({ id: "sv-pager-page-" + (i + 1), title: String(i + 1), data: i });
      }
      const list = <ListModel>action.data;
      list.forceShowFilter = state.pageCount >= pagerEdgeMinPageCount;
      list.setItems(items);
      list.selectedItem = list.actions[state.pageIndex];
    }
  }, owner.getLocOwner());
  const list = <ListModel>action.data;
  const moveOnPick = list.onSelectionChanged;
  // The list has already marked the picked page: in the sheet that is all a pick does.
  list.onSelectionChanged = (item: Action, ...params: any[]): void => {
    if (!isSheet) moveOnPick(item, ...params);
  };
  // The footer shows in the sheet only: Apply instead of the menu's Cancel.
  action.popupModel.onFooterActionsCreated.add((_, options: { actions: Array<IAction> }) => {
    options.actions = [{
      id: "sv-pager-apply",
      title: owner.getLocalizationFormatString("modalApplyButtonText"),
      appearance: { style: "brand", mode: "primary", size: "large" },
      action: (): void => {
        const item = list.selectedItem;
        action.popupModel.hide();
        if (!!item) owner.goToPage(item.data);
      }
    }];
  });
  return action;
}
/* The pager the renderers show through their action bar, as one row of three groups:
   [First] [Prev]   [page dropdown] of N   [Next] [Last]
   It computes nothing of its own: it shows what the paging helper answers. needSpace on the dropdown
   and on Next pushes the groups apart; the middle one is centred because First and Last show
   together. "of N" is a disabled item without a tab stop, text the keyboard passes over. While a move
   waits for its validators or a page is read, no move can be made. */
export function createRecordsPagerActions(container: ActionContainer, owner: IRecordsPagerOwner): ActionContainer {
  const firstAction = createPageMoveAction(owner, {
    id: "sv-pager-first", iconName: "icon-chevrondoubleleft-16x16", action: (): void => { owner.goToPage(0); }
  }, "pageFirstText", (state: IPagerState): boolean => state.canGoPrevPage && state.canMove,
  (state: IPagerState): boolean => state.showEdges);
  const prevAction = createPageMoveAction(owner, {
    id: "sv-pager-prev", iconName: "icon-chevronleft-16x16", action: (): void => { owner.prevPage(); }
  }, "pagePrevText", (state: IPagerState): boolean => state.canGoPrevPage && state.canMove);
  const totalAction = new Action({
    id: "sv-pager-total",
    title: <any>new ComputedUpdater(() => owner.getLocalizationFormatString("pagerTotalText", getPagerState(owner).pageCount)),
    // An unknown count has no total to show.
    visible: <any>new ComputedUpdater(() => getPagerState(owner).isCountKnown),
    enabled: false,
    disableTabStop: true,
    innerCss: owner.getCssClasses().pagerTotal
  });
  const nextAction = createPageMoveAction(owner, {
    id: "sv-pager-next", iconName: "icon-chevronright-16x16", needSpace: true, action: (): void => { owner.nextPage(); }
  }, "pageNextText", (state: IPagerState): boolean => state.canGoNextPage && state.canMove);
  // There is no last page to go to while the count is unknown.
  const lastAction = createPageMoveAction(owner, {
    id: "sv-pager-last", iconName: "icon-chevrondoubleright-16x16",
    action: (): void => { owner.goToPage(owner.pageCount - 1); }
  }, "pageLastText", (state: IPagerState): boolean => state.canGoNextPage && state.canMove,
  (state: IPagerState): boolean => state.showEdges);
  container.setActionsAppearance({ style: "neutral", mode: "tertiary", size: "x-small" });
  container.setItems([firstAction, prevAction, createPageDropdownAction(owner), totalAction, nextAction, lastAction]);
  return container;
}
