import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, DoCheck, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild, ViewContainerRef } from "@angular/core";
import { surveyBuiltInVarible, SurveyModel, SvgRegistry } from "survey-core";
import { BaseAngular } from "./base-angular";
import { AngularComponentFactory } from "./component-factory";
@Component({
  selector: "survey",
  templateUrl: "./survey.component.html",
  styleUrls: ["./survey.component.scss"]
})
export class SurveyComponent extends BaseAngular<SurveyModel> implements OnInit, AfterViewInit {
  @Input() model!: SurveyModel;
  @ViewChild("surveyContainer", { static: false }) rootEl!: ElementRef<HTMLDivElement>;
  protected getModel(): SurveyModel {
    return this.model;
  }
  constructor(changeDetectorRef: ChangeDetectorRef) {
    super(changeDetectorRef);
    changeDetectorRef.detach();
  }
  protected override onModelChanged(): void {
    this.changeDetectorRef.detectChanges();
    this.model.renderCallback = () => {
      this.changeDetectorRef.detectChanges();
    };
  }
  ngOnInit(): void {
    if(this.model["needRenderIcons"]) {
      SvgRegistry.renderIcons();
    }
  }
  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.model.renderCallback = undefined;
  }
  ngAfterViewInit(): void {
    this.model.afterRenderSurvey(this.rootEl.nativeElement);
  }
}