import { AfterViewChecked, Component, ElementRef, Input, ViewChild } from "@angular/core";
import { CalendarItem, CalendarViewModel, CalendarMonth } from "survey-core";
import { BaseAngular } from "../../base-angular";
import { AngularComponentFactory } from "../../component-factory";

@Component({
  selector: "sv-ng-calendar",
  templateUrl: "./calendar.component.html",
  // The host must not break the popup flex chain, or the month list cannot scroll.
  styles: [":host { display: contents; }"]
})
export class CalendarComponent extends BaseAngular<CalendarViewModel> implements AfterViewChecked {
  @Input() model!: CalendarViewModel;
  @ViewChild("root") rootRef!: ElementRef<HTMLElement>;

  protected getModel(): CalendarViewModel {
    return this.model;
  }
  public override ngAfterViewChecked(): void {
    super.ngAfterViewChecked();
    this.model.attachMonthList(this.rootRef?.nativeElement);
  }
  public override ngOnDestroy(): void {
    this.model.detachMonthList();
    super.ngOnDestroy();
  }
  public trackMonth = (index: number, month: CalendarMonth): string => {
    return this.model.getMonthKey(month);
  };
  // Hover rebuilds the item arrays. Tracking by index keeps the clicked element in place.
  public trackIndex = (index: number): number => {
    return index;
  };
  public selectItem(item: CalendarItem): void {
    this.model.selectItem(item);
  }
  public hoverItem(item?: CalendarItem): void {
    this.model.hoverItem(item);
  }
}

AngularComponentFactory.Instance.registerComponent("sv-calendar", CalendarComponent);
