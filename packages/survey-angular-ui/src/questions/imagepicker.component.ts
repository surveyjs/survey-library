import { Component, Input } from "@angular/core";
import { QuestionImagePickerModel } from "survey-core";
import { AngularComponentFactory } from "../component-factory";

@Component({
  selector: "sv-ng-imagepicker-question",
  templateUrl: "./imagepicker.component.html"
})
export class ImagePickerQuestionComponent {
  @Input() model!: QuestionImagePickerModel;
}

AngularComponentFactory.Instance.registerComponent("imagepicker-question", ImagePickerQuestionComponent);