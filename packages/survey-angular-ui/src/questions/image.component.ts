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
export class ImageQuestionComponent extends QuestionAngular<QuestionImageModel> {}

AngularComponentFactory.Instance.registerComponent("image-question", ImageQuestionComponent);