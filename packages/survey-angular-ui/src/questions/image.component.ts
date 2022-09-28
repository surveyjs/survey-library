import { Component } from "@angular/core";
import { QuestionAngular } from "../question";
import { QuestionImageModel } from "survey-core";
import { AngularComponentFactory } from "../component-factory";

@Component({
  selector: "sv-ng-image-question",
  templateUrl: "./image.component.html"
})
export class ImageQuestionComponent extends QuestionAngular<QuestionImageModel> {
  override ngAfterViewInit(): void {
    this.model.locImageLink.onChanged = () => {
      this.detectChanges();
    };
    super.ngAfterViewInit();
  }
  override ngOnDestroy(): void {
    this.model.locImageLink.onChanged = () => {};
    super.ngOnDestroy();
  }
}

AngularComponentFactory.Instance.registerComponent("image-question", ImageQuestionComponent);