import { Base } from "./base";
import { createRecordsPagerActions, IRecordsPagerCssClasses, IRecordsPagerOwner } from "./records/records-pager";
import type { ActionContainer } from "./actions/container";

// The class names of the bar and of its pager block, from the question's css, and the pager's item classes.
export interface IRecordsBarCssClasses extends IRecordsPagerCssClasses { root: string, pager: string }

/* What the records bar reads from its question and the moves it makes. The question implements it on a
   private object, so the members it calls stay protected on the question. */
export interface IQuestionRecordsBarOwner extends IRecordsPagerOwner {
  readonly isDisposed: boolean;
  // The type's rule for the pager (more than one page; the dynamic panel in list mode).
  readonly showPager: boolean;
  getCssClasses(): IRecordsBarCssClasses;
  createActionContainer(): ActionContainer;
}

/* The bar under the records of a dynamic panel and of a matrix: the pager. It computes nothing about
   paging of its own: it shows what its question answers and passes the respondent's moves back. The
   pager container is built on its first read; whether the bar shows is known without it (update()). */
export class QuestionRecordsBar extends Base {
  constructor(private owner: IQuestionRecordsBarOwner) {
    super();
    this.update();
  }
  public getType(): string {
    return "recordsbar";
  }
  // The question's pager rule, mirrored so that the renderers observe the bar alone.
  public get showPager(): boolean {
    return this.getPropertyValue("showPager", false);
  }
  // The renderers draw the bar while it has something to show.
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
  }
  private pagerActionsValue: ActionContainer;
  public get pagerActions(): ActionContainer {
    if (!this.pagerActionsValue) {
      this.pagerActionsValue = createRecordsPagerActions(this.owner.createActionContainer(), this.owner);
    }
    return this.pagerActionsValue;
  }
  public dispose(): void {
    if (!!this.pagerActionsValue) {
      this.pagerActionsValue.dispose();
      this.pagerActionsValue = undefined;
    }
    super.dispose();
  }
}
