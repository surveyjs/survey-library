import { ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from "@angular/core";
import { Question, SurveyElement } from "survey-core";
import { BaseAngular } from "./base-angular";

@Component({
  selector: "element, sv-ng-element, '[sv-ng-element]'",
  templateUrl: "./element.component.html",
  styleUrls: ["./element.component.scss"]
})
export class ElementComponent extends BaseAngular {
  @Input() model!: SurveyElement | any;
  @ViewChild("elementContainer") rootEl?: ElementRef<HTMLDivElement>;
  protected getModel(): SurveyElement {
    return this.model;
  }
  ngAfterViewInit(): void {
    this.model?.isQuestion && (<Question>this.model).afterRender(this.rootEl?.nativeElement);
  }
}