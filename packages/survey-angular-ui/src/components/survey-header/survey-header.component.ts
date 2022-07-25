import { AfterViewInit, Component, Input, ViewContainerRef } from "@angular/core";
import { SurveyModel } from "survey-core";

@Component({
  selector: "'[sv-ng-survey-header]'",
  templateUrl: "survey-header.component.html"
})
export class SurveyHeaderComponent implements AfterViewInit {
  @Input() survey!: SurveyModel;
  constructor(private viewContainerRef: ViewContainerRef) {}
  ngAfterViewInit(): void {
    this.survey.afterRenderHeader(this.viewContainerRef.element.nativeElement);
  }
}