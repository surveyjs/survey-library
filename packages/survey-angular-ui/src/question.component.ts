import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Question } from "survey-core";

@Component({
  template: ""
})
export class QuestionAngular<T extends Question = Question> implements AfterViewInit, OnDestroy {
  @Input() public model!: T;

  @ViewChild("contentElement") elementContentRef!: ElementRef<HTMLElement>;

  ngAfterViewInit() {
    if (!!this.model) {
      this.model.afterRenderQuestionElement(this.elementContentRef.nativeElement);
    }
  }
  ngOnDestroy() {
    if (!!this.model) {
      this.model.beforeDestroyQuestionElement(this.elementContentRef.nativeElement);
    }
  }
}