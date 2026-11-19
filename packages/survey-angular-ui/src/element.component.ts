import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { PanelModel, Question, SurveyModel } from "survey-core";
import { BaseAngular } from "./base-angular";

@Component({
  selector: "sv-ng-element",
  templateUrl: "./element.component.html",
  styleUrls: ["./hide-host.scss"]
})
export class ElementComponent extends BaseAngular<PanelModel | Question> implements AfterViewInit {
  @Input() model!: PanelModel | Question;
  @ViewChild("container", { static: false, read: ElementRef }) container!: ElementRef<HTMLDivElement>;
  protected getModel(): PanelModel | Question {
    return this.model;
  }
  protected get elementComponentName(): string {
    // Do not use isPanel here: a page nested in a page container (single-page or preview mode) is a panel
    // only while it has a parent, and on complete the preview container releases its pages before
    // the preview is removed from the screen.
    return this.model.isQuestion ? "question" : "panel";
  }

  protected override onModelChanged(): void {
    super.onModelChanged();
    if (this.previousModel) {
      this.previousModel.setWrapperElement(undefined);
    }
    if (this.model && this.container?.nativeElement) {
      this.model.setWrapperElement(this.container.nativeElement);
    }
  }

  public get componentName(): string {
    const survey = this.surveyModel as SurveyModel;
    if (!!survey) {
      const name = survey.getElementWrapperComponentName(this.model);
      if (!!name) {
        return name;
      }
    }
    return this.elementComponentName;
  }
  public get rootStyle() {
    //use this if to check if cssClassses are calculated and allowRootStyle flag was set
    if (!!this.model.cssClasses) {
      return this.model.rootStyle;
    } else {
      return {};
    }
  }
  public get componentData(): any {
    const survey = this.surveyModel as SurveyModel;
    let data: any;
    if (!!survey) {
      data = survey.getElementWrapperComponentData(this.model);
    }
    return {
      componentName: this.elementComponentName,
      componentData: {
        model: this.model,
        data: data
      }
    };
  }
  public ngAfterViewInit(): void {
    if (this.model && this.container?.nativeElement) {
      this.model.setWrapperElement(this.container.nativeElement);
    }
  }
  public override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.model.setWrapperElement(undefined);
  }
}
