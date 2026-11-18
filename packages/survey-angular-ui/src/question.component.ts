import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import { Question } from "survey-core";
import { TrackingComponent } from "./base-angular";
import { AngularComponentFactory } from "./component-factory";
import { SurveyBaseProviders } from "./component-depth";
import { getComponentName } from "./question";

@Component({
  selector: "sv-ng-question",
  templateUrl: "./question.component.html",
  providers: SurveyBaseProviders
})
export class QuestionComponent extends TrackingComponent {
  @Input() model!: Question;
  @Input() css: any;
  @Input() survey: any;
  @ViewChild("elementContainer") rootEl?: ElementRef<HTMLDivElement>;

  protected getModel(): Question {
    return this.model;
  }

  get singleQuestion(): Question {
    return this.model.singleInputQuestion;
  }

  protected override afterViewInit(): void {
    if (!!this.rootEl?.nativeElement) {
      this.model.afterRender(this.rootEl?.nativeElement);
    }
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    if (!!this.model) {
      this.model.destroyResizeObserver();
    }
  }

  public getComponentName(): string { return getComponentName(this.model); }
  public getQuestionContentWrapperComponentName(): string {
    return (<any>this.model.survey).getQuestionContentWrapperComponentName(this.model);
  }
  public getQuestionContentWrapperComponentData(): any {
    return {
      componentData: {
        model: this.model,
        data: (<any>this.model.survey).getElementWrapperComponentData(this.model)
      }
    };
  }
}

AngularComponentFactory.Instance.registerComponent("question", QuestionComponent);