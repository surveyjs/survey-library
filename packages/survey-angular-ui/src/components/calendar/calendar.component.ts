import { Component, Input } from "@angular/core";
import { CalendarItem, CalendarModel } from "survey-core";
import { BaseAngular } from "../../base-angular";
import { AngularComponentFactory } from "../../component-factory";

@Component({
  selector: "sv-ng-calendar",
  templateUrl: "./calendar.component.html"
})
export class CalendarComponent extends BaseAngular<CalendarModel> {
  @Input() model!: CalendarModel;

  protected getModel(): CalendarModel {
    return this.model;
  }
  public selectItem(item: CalendarItem): void {
    this.model.selectItem(item);
  }
  public hoverItem(item?: CalendarItem): void {
    this.model.hoverItem(item);
  }
}

AngularComponentFactory.Instance.registerComponent("sv-calendar", CalendarComponent);
