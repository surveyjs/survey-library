import { Component, Input } from "@angular/core";
import { CalendarItem, CalendarViewModel } from "survey-core";
import { BaseAngular } from "../../base-angular";
import { SurveyBaseProviders } from "../../component-depth";

@Component({
  providers: SurveyBaseProviders,
  selector: "sv-ng-calendar-item",
  templateUrl: "./calendar-item.component.html",
  styleUrls: ["../../hide-host.scss"]
})
export class CalendarItemComponent extends BaseAngular<CalendarItem> {
  @Input() item!: CalendarItem;
  @Input() calendar!: CalendarViewModel;

  protected getModel(): CalendarItem {
    return this.item;
  }
  public select(): void {
    this.calendar.selectItem(this.item);
  }
  public hover(): void {
    this.calendar.hoverItem(this.item);
  }
}
