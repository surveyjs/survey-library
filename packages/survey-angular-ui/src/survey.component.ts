import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import { Observable, Subject, BehaviorSubject } from "rxjs";
import { SurveyModel } from "survey-core";
import { ImplementorBase } from "./implementor-base";

@Component({
  selector: "survey",
  templateUrl: "./survey.component.html",
  styleUrls: ["./survey.component.scss"]
})
export class SurveyComponent {
  @Input() model!: SurveyModel;
  @ViewChild("surveyContainer", { static: false }) rootEl!: ElementRef<HTMLDivElement>;
  private called: boolean = false;
  constructor() {
  }
  ngOnChanges(changes: any): void {
    new ImplementorBase(changes.model.currentValue);
  }
  ngAfterViewInit() {
    this.model.afterRenderSurvey(this.rootEl.nativeElement);
    this.called = true;
  }
}