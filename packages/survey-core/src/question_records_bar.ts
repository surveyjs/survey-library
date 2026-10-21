import { Base } from "./base";
import { createRecordsPagerActions, IRecordsPagerCssClasses, IRecordsPagerOwner } from "./records/records-pager";
import { createRecordsSortActions, getShowSort, IRecordsSortActions, IRecordsSortBarCssClasses, IRecordsSortBarOwner } from "./records/records-sort-bar";
import type { ActionContainer } from "./actions/container";

// The class names of the bar, of its pager block and of the sort bar, from the question's css, and the items' classes.
export interface IRecordsBarCssClasses extends IRecordsPagerCssClasses, IRecordsSortBarCssClasses { root: string, pager: string, sortBar: string }

/* What the records bar reads from its question and the moves it makes. The question implements it on a
   private object, so the members it calls stay protected on the question. */
export interface IQuestionRecordsBarOwner extends IRecordsPagerOwner, IRecordsSortBarOwner {
  readonly isDisposed: boolean;
  readonly isMobile: boolean;
  // The type's rule for the pager (more than one page; the dynamic panel in list mode).
  readonly showPager: boolean;
  getCssClasses(): IRecordsBarCssClasses;
  createActionContainer(): ActionContainer;
}

/* The records bar of a dynamic panel and of a matrix: the pager under the records and the sort bar
   in the question header. It computes nothing about paging or sorting of its own: it shows what its
   question answers and passes the respondent's moves back. Only sv-records-bar observes the bar, and
   it renders the pager only: the question decides from its own state whether the footer shows and
   where the sort bar goes (sortBarLocation). Both containers are built on their first read; whether
   each part shows is known without them (update()). */
export class QuestionRecordsBar extends Base {
  constructor(private owner: IQuestionRecordsBarOwner) {
    super();
    this.update();
  }
  public getType(): string {
    return "recordsbar";
  }
  /* The question's pager rule, mirrored so that sv-records-bar re-renders on the bar's own property
     changes. The question's renderer reads the question's showPager to place the footer. */
  public get showPager(): boolean {
    return this.getPropertyValue("showPager", false);
  }
  /* The one visibility rule of the sort bar (getShowSort): its items and the question's
     sortBarLocation read it, and add no condition of their own. */
  public get showSort(): boolean {
    return this.getPropertyValue("showSort", false);
  }
  // The renderers draw the bar under the records while it has a pager to show.
  public get isVisible(): boolean {
    return this.showPager;
  }
  public get cssClasses(): IRecordsBarCssClasses {
    return this.owner.getCssClasses();
  }
  // Sets what the bar shows from the question's current state. The question calls it whenever an input changes.
  public update(): void {
    if (this.isDisposed || this.owner.isDisposed) return;
    this.setPropertyValue("showPager", this.owner.showPager);
    this.setPropertyValue("showSort", getShowSort(this.owner, this.owner.sortFields));
    if (!!this.sortActionsValue) {
      this.sortActionsValue.update();
    }
  }
  private pagerActionsValue: ActionContainer;
  public get pagerActions(): ActionContainer {
    if (!this.pagerActionsValue) {
      this.pagerActionsValue = createRecordsPagerActions(this.owner.createActionContainer(), this.owner);
    }
    return this.pagerActionsValue;
  }
  private sortActionsValue: IRecordsSortActions;
  public get sortActions(): ActionContainer {
    if (!this.sortActionsValue) {
      const container = this.owner.createActionContainer();
      container.containerCss = this.owner.getCssClasses().sortBar;
      this.sortActionsValue = createRecordsSortActions(container, this.owner, this);
    }
    return this.sortActionsValue.container;
  }
  public dispose(): void {
    if (!!this.pagerActionsValue) {
      this.pagerActionsValue.dispose();
      this.pagerActionsValue = undefined;
    }
    if (!!this.sortActionsValue) {
      this.sortActionsValue.container.dispose();
      this.sortActionsValue = undefined;
    }
    super.dispose();
  }
}
