import { Component, DoCheck, Input, ViewContainerRef } from "@angular/core";
import { AngularComponentFactory } from "../../component-factory";
import { SurveyProgressModel } from "survey-core";

@Component({
  selector: "sv-ng-progress",
  template: ""
})
export class ProgressComponent implements DoCheck {
  @Input() model: any;
  private prevProgressBarType: string = "";
  constructor(private containerRef: ViewContainerRef) {
  }
  ngDoCheck() {
    if(this.prevProgressBarType !== this.model.progressBarType) {
      this.containerRef.clear();
      let componentRef = AngularComponentFactory.Instance.create(this.containerRef, "sv-progress-" + this.model.progressBarType);
      (componentRef.instance as any).model = this.model;
      this.prevProgressBarType = this.model.progressBarType;
    }
  }
}