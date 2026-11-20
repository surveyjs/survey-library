import { Component } from "@angular/core";
import { QuestionAngular } from "../question";
import { QuestionImageMapModel } from "survey-core";
import { AngularComponentFactory } from "../component-factory";
import { SurveyBaseProviders } from "../component-depth";

@Component({
  providers: SurveyBaseProviders,
  selector: "sv-ng-imagemap-component",
  templateUrl: "./imagemap.component.html"
})
export class ImageMapQuestionComponent extends QuestionAngular<QuestionImageMapModel> {}

AngularComponentFactory.Instance.registerComponent("imagemap-question", ImageMapQuestionComponent);