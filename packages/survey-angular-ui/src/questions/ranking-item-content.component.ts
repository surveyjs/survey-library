import { Component, Input } from "@angular/core";
import { ItemValue } from "survey-core";
import { AngularComponentFactory } from "../component-factory";

@Component({
  selector: "sv-ng-ranking-item-content",
  templateUrl: "./ranking-item-content.component.html"
})
export class RankingItemContentComponent {
  @Input() item!: ItemValue;
  @Input() cssClasses: any;
}
AngularComponentFactory.Instance.registerComponent("sv-ng-ranking-item-content", RankingItemContentComponent);