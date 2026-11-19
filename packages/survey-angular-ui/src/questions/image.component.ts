import { Component } from "@angular/core";
import { QuestionAngular } from "../question";
import { QuestionImageModel } from "survey-core";
import { AngularComponentFactory } from "../component-factory";
import { SurveyBaseProviders } from "../component-depth";

@Component({
  providers: SurveyBaseProviders,
  selector: "sv-ng-image-question",
  templateUrl: "./image.component.html"
})
export class ImageQuestionComponent extends QuestionAngular<QuestionImageModel> {
  protected override afterViewInit(): void {
    this.model.locImageLink.onChanged = () => {
      this.update();
    };
    super.afterViewInit();
  }
  override ngOnDestroy(): void {
    this.model.locImageLink.onChanged = () => {};
    super.ngOnDestroy();
  }
}

AngularComponentFactory.Instance.registerComponent("image-question", ImageQuestionComponent);