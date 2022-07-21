import { Component } from "@angular/core";
import { QuestionAngular } from "../question";
import { QuestionRatingModel } from "survey-core";
import { AngularComponentFactory } from "../component-factory";

@Component({
  selector: "sv-ng-rating-question",
  templateUrl: "./rating.component.html"
})
export class RatingQuestionComponent extends QuestionAngular<QuestionRatingModel> {
  trackByFn(index: number): number {
    return index;
  }
  public onClick(event: any) {
    event.stopPropagation();
    this.model.setValueFromClick(event.target.value);
  }
}

AngularComponentFactory.Instance.registerComponent("rating-question", RatingQuestionComponent);