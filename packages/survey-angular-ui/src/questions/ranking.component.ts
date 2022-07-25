import { Component } from "@angular/core";
import { QuestionAngular } from "../question";
import { ItemValue, QuestionRankingModel } from "survey-core";
import { AngularComponentFactory } from "../component-factory";

@Component({
  selector: "sv-ng-ranking-question",
  templateUrl: "./ranking.component.html",
})
export class RankingQuestionComponent extends QuestionAngular<QuestionRankingModel> {
  trackItemBy = (index: number, item: ItemValue): string => {
    return item.value + "-" + index + "-item";
  }
}

AngularComponentFactory.Instance.registerComponent("ranking-question", RankingQuestionComponent);