
import { Component, Input } from "@angular/core";
import { AngularComponentFactory } from "../../../component-factory";
import { RendererFactory } from "survey-core";

@Component({
  selector: "sv-ng-rating-dropdown-question",
  templateUrl: "./rating-dropdown.component.html"
})
export class RatingDropdownComponent {
  @Input() model: any;
}

AngularComponentFactory.Instance.registerComponent("rating-dropdown-question", RatingDropdownComponent);
RendererFactory.Instance.registerRenderer(
  "rating",
  "dropdown",
  "rating-dropdown-question"
);
