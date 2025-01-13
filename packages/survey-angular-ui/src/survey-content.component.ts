
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { SurveyModel, SvgRegistry } from "survey-core";
import { BaseAngular } from "./base-angular";
import { AngularComponentFactory } from "./component-factory";
@Component({
  selector: "survey-content",
  templateUrl: "./survey-content.component.html"
})
export class SurveyContentComponent extends BaseAngular<SurveyModel> implements OnInit, AfterViewInit {
  @Input() model!: SurveyModel;
  @ViewChild("surveyContainer", { static: false }) rootEl!: ElementRef<HTMLDivElement>;
  private isSurveyUpdated: boolean = false;
  protected getModel(): SurveyModel {
    return this.model;
  }
  protected override onModelChanged(): void {
    if (!!this.previousModel) {
      this.previousModel.destroyResizeObserver();
      this.previousModel.renderCallback = <any>undefined;
    }
    if (!!this.model) {
      this.model.renderCallback = () => {
        this.detectChanges();
      };
    }
    this.isSurveyUpdated = true;
  }
  override ngOnDestroy(): void {
    super.ngOnDestroy();
    if (!!this.model) {
      this.model.rootElement = undefined as any;
      this.model.destroyResizeObserver();
      this.model.renderCallback = <any>undefined;
    }
  }
  ngAfterViewInit(): void {
    this.isSurveyUpdated = true;
  }
  override ngAfterViewChecked(): void {
    if (!!this.model && this.isSurveyUpdated) {
      this.model.afterRenderSurvey(this.rootEl.nativeElement);
      this.model.startTimerFromUI();
    }
    super.ngAfterViewChecked();
  }
}

AngularComponentFactory.Instance.registerComponent("survey", SurveyContentComponent);