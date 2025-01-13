import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import { Question } from "survey-core";
import { AngularComponentFactory } from "./component-factory";
import { EmbeddedViewContentComponent } from "./embedded-view-content.component";
import { getComponentName } from "./question";

@Component({
  selector: "sv-ng-question",
  templateUrl: "./question.component.html"
})
export class QuestionComponent extends EmbeddedViewContentComponent {
  @Input() model!: Question;
  @ViewChild("elementContainer") rootEl?: ElementRef<HTMLDivElement>;
  protected getModel(): Question {
    return this.model;
  }
  ngAfterViewInit(): void {
    if (!!this.rootEl?.nativeElement) {
      this.model.afterRender(this.rootEl?.nativeElement);
    }
  }
  ngOnDestroy() {
    if(!!this.model) {
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