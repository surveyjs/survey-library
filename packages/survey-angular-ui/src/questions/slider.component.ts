import { Component, ElementRef, ViewChild } from "@angular/core";
import { QuestionAngular } from "../question";
import { QuestionSliderModel } from "survey-core";
import { AngularComponentFactory } from "../component-factory";

@Component({
  selector: "sv-ng-slider-question",
  templateUrl: "./slider.component.html"
})
export class SliderQuestionComponent extends QuestionAngular<QuestionSliderModel> {
  @ViewChild("rangeInputRef") rangeInputRef!: ElementRef<HTMLInputElement>;

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    if (this.model && this.rangeInputElement) {
      this.model.refreshInputRange(this.rangeInputElement);
    }
  }
  get rootRef(): HTMLElement {
    return this.elementContentRef?.nativeElement;
  }
  get rangeInputElement(): HTMLInputElement {
    return this.rangeInputRef?.nativeElement;
  }
  get labelCountArray(): number[] {
    const result:number[] = [];
    for (let i = 0; i < this.model.labelCount; i++) {
      result.push(i);
    }
    return result;
  }
  trackByRenderedValue (i: number, value: number): number {
    return value;
  }
  trackByLabelCount (i: number, value: number): number {
    return i;
  }
}

AngularComponentFactory.Instance.registerComponent("slider-question", SliderQuestionComponent);