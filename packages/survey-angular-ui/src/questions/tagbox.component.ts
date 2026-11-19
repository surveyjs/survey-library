import { Component } from "@angular/core";
import { QuestionAngular } from "../question";
import { AngularComponentFactory } from "../component-factory";
import { QuestionTagboxModel } from "survey-core";
import { SurveyBaseProviders } from "../component-depth";

@Component({
  providers: SurveyBaseProviders,
  selector: "sv-ng-tagbox-question",
  templateUrl: "./tagbox.component.html"
})
export class TagboxQuestionComponent extends QuestionAngular<QuestionTagboxModel> {
}

AngularComponentFactory.Instance.registerComponent("tagbox-question", TagboxQuestionComponent);