import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from "@angular/core";
import { Question } from "survey-core";
import { BaseAngular } from "./base-angular";

@Component({
  template: ""
})
export class QuestionAngular<T extends Question = Question> extends BaseAngular<Question> implements AfterViewInit, OnDestroy {
  @Input() public model!: T;

  @ViewChild("contentElement") elementContentRef!: ElementRef<HTMLElement>;

  protected getModel() {
    return this.model;
  }

  ngAfterViewInit() {
    if (!!this.model) {
      this.model.afterRenderQuestionElement(this.elementContentRef?.nativeElement);
    }
  }
  override ngOnDestroy() {
    if (!!this.model) {
      this.model.beforeDestroyQuestionElement(this.elementContentRef?.nativeElement);
    }
    super.ngOnDestroy();
  }
}

export function getComponentName(question: Question): string {
  if (question.customWidget) return "survey-customwidget";
  if (question.isDefaultRendering()) {
    return question.getTemplate() + "-question";
  }
  return question.getComponentName();
}