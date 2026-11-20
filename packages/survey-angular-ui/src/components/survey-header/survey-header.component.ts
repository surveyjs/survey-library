import { AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, ViewContainerRef } from "@angular/core";
import { SurveyModel } from "survey-core";

@Component({
  selector: "'[sv-ng-survey-header]'",
  templateUrl: "survey-header.component.html"
})
export class SurveyHeaderComponent implements AfterViewInit {
  @Input() survey!: SurveyModel;
  constructor(private viewContainerRef: ViewContainerRef, private changeDetectorRef: ChangeDetectorRef) {}
  ngAfterViewInit(): void {
    this.survey.afterRenderHeader(this.viewContainerRef.element.nativeElement);
  }
}