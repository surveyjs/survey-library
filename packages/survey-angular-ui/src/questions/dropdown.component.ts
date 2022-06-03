import { Component, Input } from "@angular/core";
import { QuestionAngular } from "../question.component";
import { AngularComponentFactory } from "../component-factory";
import { QuestionDropdownModel } from "survey-core";

@Component({
  selector: "sv-ng-dropdown-question",
  templateUrl: "./dropdown.component.html",
  styleUrls: ["./dropdown.component.scss"]
})
export class DropdownQuestionComponent extends QuestionAngular<QuestionDropdownModel> {
  keyup(event: any) {
    if (!this.model.isInputTextUpdate) return;
    this.model.value = event.target.value;
  }
}

AngularComponentFactory.Instance.registerComponent("dropdown-question", DropdownQuestionComponent);