import { Component } from "@angular/core";
import { QuestionAngular } from "../question";
import { ImageItemValue, ItemValue, QuestionImagePickerModel } from "survey-core";
import { AngularComponentFactory } from "../component-factory";

@Component({
  selector: "sv-ng-imagepicker-question",
  templateUrl: "./imagepicker.component.html"
})
export class ImagePickerQuestionComponent extends QuestionAngular<QuestionImagePickerModel> {
  public getItemValueComponentName(item: ItemValue): string {
    return this.model.getItemValueWrapperComponentName(item) || "sv-ng-imagepicker-item";
  }
  public getItemValueComponentData(item: ItemValue): any {
    return {
      componentName: "sv-ng-imagepicker-item",
      componentData: {
        question: this.model,
        model: item,
        data: this.model.getItemValueWrapperComponentData(item)
      }
    };
  }

}

AngularComponentFactory.Instance.registerComponent("imagepicker-question", ImagePickerQuestionComponent);