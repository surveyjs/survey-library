import { Component, ElementRef, Input, OnDestroy, ViewChild } from "@angular/core";
import { FilterChipsLayout, QuestionFilterModel } from "survey-core";
import { BaseAngular } from "../../base-angular";

// The chips row of the Filter Control. Its model is the layout that cuts the row to one row, so a
// change of it (Show More, the measured fit) redraws the row. The layout measures the row again
// itself whenever it changes: the component only attaches it and detaches it.
@Component({
  selector: "sv-ng-filter-chips",
  templateUrl: "./filter-chips.component.html",
  styleUrls: ["../../hide-host.scss"]
})
export class FilterChipsComponent extends BaseAngular<FilterChipsLayout> implements OnDestroy {
  @Input() question!: QuestionFilterModel;
  @ViewChild("chips") chipsRef?: ElementRef<HTMLElement>;
  // A disposed question has released its layout, and asking for it would build a new one.
  protected getModel(): FilterChipsLayout {
    return !!this.question && !this.question.isDisposed ? this.question.chipsLayout : undefined as any;
  }
  // #chips is in an embedded view created late, so this is tried on every check until the ref exists;
  // attach() returns at once for the element it already has.
  override ngAfterViewChecked(): void {
    super.ngAfterViewChecked();
    const layout = this.getModel();
    if (!!layout && !!this.chipsRef) {
      layout.attach(this.chipsRef.nativeElement);
    }
  }
  override ngOnDestroy(): void {
    const layout = this.getModel();
    if (!!layout) {
      layout.detach();
    }
    super.ngOnDestroy();
  }
}
