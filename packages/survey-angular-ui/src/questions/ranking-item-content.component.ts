import { Component, Input } from "@angular/core";
import { BaseAngular } from "../base-angular";
import { ItemValue, LocalizableString, QuestionRankingModel } from "survey-core";
import { AngularComponentFactory } from "../component-factory";

@Component({
  selector: "sv-ng-ranking-item-content",
  templateUrl: "./ranking-item-content.component.html"
})
export class RankingItemContentComponent {
  @Input() text!: LocalizableString;
  @Input() cssClasses: any;
}
AngularComponentFactory.Instance.registerComponent("sv-ng-ranking-item-content", RankingItemContentComponent);