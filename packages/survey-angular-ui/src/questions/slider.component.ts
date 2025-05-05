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
}

AngularComponentFactory.Instance.registerComponent("slider-question", SliderQuestionComponent);