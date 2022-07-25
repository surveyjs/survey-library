import { Component } from "@angular/core";
import { AngularComponentFactory } from "../component-factory";
import { QuestionAngular } from "../question";
import { QuestionExpressionModel } from "survey-core";

@Component({
  selector: "sv-ng-expression",
  template: "<div [class]='model.cssClasses.root' #contentElement>{{ model.formatedValue }}</div>"
})
export class ExpressionComponent extends QuestionAngular<QuestionExpressionModel> {
}

AngularComponentFactory.Instance.registerComponent("expression-question", ExpressionComponent);