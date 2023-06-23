import { Component } from "@angular/core";
import { ItemValue, QuestionRankingModel } from "survey-core";
import { AngularComponentFactory } from "../component-factory";
import { SelectBaseComponent } from "./selectbase.component";

@Component({
  selector: "sv-ng-ranking-question",
  templateUrl: "./ranking.component.html",
})
export class RankingQuestionComponent extends SelectBaseComponent<QuestionRankingModel> {
  public override inputType: string = "";
  override trackItemBy = (index: number, item: ItemValue): string => {
    return item.value + "-" + index + "-item";
  }
  public override getDefaultComponentName(): string {
    return "sv-ng-ranking-item";
  }
  public override getItemValueComponentData(item: ItemValue, index?: number, unrankedItem?: boolean): any {
    const res = super.getItemValueComponentData(item);
    res.componentData.index = index;
    res.componentData.unrankedItem = unrankedItem;
    return res;
  }
}
AngularComponentFactory.Instance.registerComponent("ranking-question", RankingQuestionComponent);