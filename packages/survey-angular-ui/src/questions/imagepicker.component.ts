import { Component } from "@angular/core";
import { QuestionAngular } from "../question";
import { QuestionImagePickerModel } from "survey-core";
import { AngularComponentFactory } from "../component-factory";

@Component({
  selector: "sv-ng-imagepicker-question",
  templateUrl: "./imagepicker.component.html"
})
export class ImagePickerQuestionComponent extends QuestionAngular<QuestionImagePickerModel> {}

AngularComponentFactory.Instance.registerComponent("imagepicker-question", ImagePickerQuestionComponent);