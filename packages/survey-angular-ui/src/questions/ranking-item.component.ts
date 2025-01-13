import { Component, Input } from "@angular/core";
import { BaseAngular } from "../base-angular";
import { ItemValue, QuestionRankingModel } from "survey-core";
import { AngularComponentFactory } from "../component-factory";

@Component({
  selector: "sv-ng-ranking-item",
  templateUrl: "./ranking-item.component.html"
})
export class RankingItemComponent extends BaseAngular<ItemValue> {
  @Input() question!: QuestionRankingModel;
  @Input() model!: ItemValue;
  @Input() index!: number;
  @Input() unrankedItem!: boolean;
  protected getModel(): ItemValue {
    return this.model;
  }
}
AngularComponentFactory.Instance.registerComponent("sv-ng-ranking-item", RankingItemComponent);