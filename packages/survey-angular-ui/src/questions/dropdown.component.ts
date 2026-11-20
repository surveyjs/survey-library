import { Component } from "@angular/core";
import { QuestionAngular } from "../question";
import { AngularComponentFactory } from "../component-factory";
import { QuestionDropdownModel } from "survey-core";
import { SurveyBaseProviders } from "../component-depth";

@Component({
  providers: SurveyBaseProviders,
  selector: "sv-ng-dropdown-question",
  templateUrl: "./dropdown.component.html"
})
export class DropdownQuestionComponent extends QuestionAngular<QuestionDropdownModel> {
}

AngularComponentFactory.Instance.registerComponent("dropdown-question", DropdownQuestionComponent);