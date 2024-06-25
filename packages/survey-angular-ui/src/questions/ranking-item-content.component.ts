import { Component, Input } from "@angular/core";
import { ItemValue } from "survey-core";
import { AngularComponentFactory } from "../component-factory";
import { EmbeddedViewContentComponent } from "../embedded-view-content.component";

@Component({
  selector: "sv-ranking-item",
  templateUrl: "./ranking-item-content.component.html",
  styles: [":host { display: none; }"]
})
export class RankingItemContentComponent extends EmbeddedViewContentComponent {
  @Input() item!: ItemValue;
  @Input() cssClasses: any;
}
AngularComponentFactory.Instance.registerComponent("sv-ranking-item", RankingItemContentComponent);