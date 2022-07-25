import { Component } from "@angular/core";
import { QuestionAngular } from "../question";
import { QuestionTextModel } from "survey-core";
import { AngularComponentFactory } from "../component-factory";

@Component({
  selector: "sv-ng-text-question",
  templateUrl: "./text.component.html",
  styleUrls: ["./text.component.scss"]
})
export class TextQuestionComponent extends QuestionAngular<QuestionTextModel> {
  keyup(event: any) {
    if (this.model.isInputTextUpdate) {
      this.model.value = event.target.value;
    }
  }
  onChange(event: any) {
    if(!this.model.isInputTextUpdate) {
      this.model.value = event.target.value;
    }
  }
}

AngularComponentFactory.Instance.registerComponent("text-question", TextQuestionComponent);