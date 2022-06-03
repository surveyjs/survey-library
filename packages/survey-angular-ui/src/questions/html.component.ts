import { Component } from "@angular/core";
import { QuestionAngular } from "../question.component";
import { QuestionHtmlModel } from "survey-core";
import { AngularComponentFactory } from "../component-factory";
@Component({
  selector: "sv-ng-text-question",
  templateUrl: "./html.component.html",
  styleUrls: []
})
export class HtmlQuestionComponent extends QuestionAngular<QuestionHtmlModel> {}

AngularComponentFactory.Instance.registerComponent("html-question", HtmlQuestionComponent);