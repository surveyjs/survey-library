import { Question } from "survey-core";
import { QuestionCustomModel } from "survey-core";
import { Component } from "@angular/core";
import { QuestionAngular } from "../question";
import { AngularComponentFactory } from "../component-factory";

@Component({
  selector: "sv-ng-custom-question",
  template: "<ng-template [component]='{ name: getComponentName(contentQuestion), data: { model: contentQuestion } }'></ng-template>"
})
export class CustomQuestionComponent extends QuestionAngular<QuestionCustomModel> {
  get contentQuestion(): Question {
    return this.model.contentQuestion;
  }
  getComponentName(element: Question): string {
    if (element.customWidget) {
      return "survey-customwidget";
    }
    return element.getTemplate() + "-question";
  }
}

AngularComponentFactory.Instance.registerComponent("custom-question", CustomQuestionComponent);
