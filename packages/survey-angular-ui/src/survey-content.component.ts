
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { SurveyModel, SvgRegistry } from "survey-core";
import { BaseAngular } from "./base-angular";
import { AngularComponentFactory } from "./component-factory";
import { SurveyBaseProviders } from "./component-depth";
@Component({
  providers: SurveyBaseProviders,
  selector: "survey-content",
  templateUrl: "./survey-content.component.html"
})
export class SurveyContentComponent extends BaseAngular<SurveyModel> implements OnInit {
  @Input() model!: SurveyModel;
  @ViewChild("surveyContainer", { static: false }) rootEl!: ElementRef<HTMLDivElement>;
  private isSurveyUpdated: boolean = true;
  public key = 0;
  protected getModel(): SurveyModel {
    return this.model;
  }
  protected override onModelChanged(): void {
    if (!!this.previousModel) {
      this.previousModel.beforeDestroySurveyElement();
      this.previousModel.renderCallback = <any>undefined;
    }
    if (!!this.model) {
      this.model.renderCallback = () => {
        this.key++;
        this.detectChanges();
      };
    }
    this.isSurveyUpdated = true;
  }
  override ngOnDestroy(): void {
    super.ngOnDestroy();
    if (!!this.model) {
      this.model.beforeDestroySurveyElement();
      this.model.renderCallback = <any>undefined;
    }
  }
  override afterUpdate(): void {
    super.afterUpdate();
    if (!!this.model && this.isSurveyUpdated) {
      this.isSurveyUpdated = false;
      this.model.afterRenderSurvey(this.rootEl.nativeElement);
      this.model.startTimerFromUI();
    }
  }
}

AngularComponentFactory.Instance.registerComponent("survey", SurveyContentComponent);