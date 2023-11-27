import { Component, Input } from "@angular/core";
import { BaseAngular } from "../../../base-angular";
import { AngularComponentFactory } from "../../../component-factory";

@Component({
  selector: "sv-ng-rating-dropdown-item, '[sv-ng-rating-dropdown-item]'",
  templateUrl: "./rating-dropdown-item.component.html",
  styleUrls: ["../../../hide-host.scss"],
})

export class RatingDropdownItemComponent extends BaseAngular {
  @Input() element: any;
  @Input() model!: any;

  getModel() {
    return this.model;
  }
}

AngularComponentFactory.Instance.registerComponent("sv-rating-dropdown-item", RatingDropdownItemComponent);