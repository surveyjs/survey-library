
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
  protected getModel(): SurveyModel {
    return this.model;
  }
  protected override onModelChanged(): void {
    this.model.renderCallback = () => {
      this.detectChanges();
    };
  }
  override ngOnInit(): void {
    super.ngOnInit();
    if(this.model["needRenderIcons"]) {
      SvgRegistry.renderIcons();
    }
  }
  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.model.renderCallback = <any>undefined;
  }
  ngAfterViewInit(): void {
    this.model.afterRenderSurvey(this.rootEl.nativeElement);
  }
}

AngularComponentFactory.Instance.registerComponent("survey", SurveyContentComponent);