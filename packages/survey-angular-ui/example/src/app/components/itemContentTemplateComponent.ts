import { Component, Input } from "@angular/core";
import { AngularComponentFactory, EmbeddedViewContentComponent } from "survey-angular-ui";
import { ItemValue } from "survey-core";

@Component({
  selector: "sv-ranking-item",
  templateUrl: "./itemContentTemplateComponent.html",
  styles: [":host { display: none; }"]
})
export class AngularItemContentTemplateComponent extends EmbeddedViewContentComponent {
  @Input() item!: ItemValue;
  @Input() cssClasses: any;
}

AngularComponentFactory.Instance.registerComponent("new-item-content", AngularItemContentTemplateComponent);