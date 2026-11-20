import { Component } from "@angular/core";
import { QuestionAngular } from "../question";
import { QuestionHtmlModel } from "survey-core";
import { AngularComponentFactory } from "../component-factory";
import { SurveyBaseProviders } from "../component-depth";
@Component({
  providers: SurveyBaseProviders,
  selector: "sv-ng-html-question",
  templateUrl: "./html.component.html",
  styleUrls: []
})
export class HtmlQuestionComponent extends QuestionAngular<QuestionHtmlModel> {}

AngularComponentFactory.Instance.registerComponent("html-question", HtmlQuestionComponent);