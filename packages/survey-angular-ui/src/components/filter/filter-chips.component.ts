import { Component, ElementRef, Input, OnDestroy, ViewChild } from "@angular/core";
import { FilterChipsLayout, QuestionFilterModel, toCssClasses } from "survey-core";
import { BaseAngular } from "../../base-angular";

// The chips row of the Filter Control. Its model is the layout that cuts the row to one row, so a
// change of it (Show More, the measured fit) redraws the row; the row is measured once it is drawn.
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
  public get chipsCss(): string {
    const css = this.question.cssClasses;
    const layout = this.getModel();
    return toCssClasses(css.chips, !!layout && layout.isExpanded && css.chipsExpanded);
  }
  private updateLayout(): void {
    const layout = this.getModel();
    if (!layout || !this.chipsRef) return;
    layout.attach(this.chipsRef.nativeElement);
    layout.update();
  }
  override ngAfterViewChecked(): void {
    super.ngAfterViewChecked();
    this.updateLayout();
  }
  protected override afterUpdate(isSync: boolean = false): void {
    super.afterUpdate(isSync);
    this.updateLayout();
  }
  override ngOnDestroy(): void {
    const layout = this.getModel();
    if (!!layout) {
      layout.detach();
    }
    super.ngOnDestroy();
  }
}
