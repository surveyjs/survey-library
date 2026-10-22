import { Component } from "@angular/core";
import { Question, RendererFactory } from "survey-core";
import { AngularComponentFactory } from "../component-factory";
import { QuestionAngular } from "../question";

@Component({
  selector: "sv-ng-question-view",
  template: "<div [class]='model.viewModeCssClass' [attr.id]='model.inputId' #contentElement>{{ model.viewDisplayText }}</div>"
})
export class QuestionViewComponent extends QuestionAngular<Question> {
}

AngularComponentFactory.Instance.registerComponent("question-view-question", QuestionViewComponent);
RendererFactory.Instance.registerRenderer("question", "view", "question-view-question");
