import { Component, Input } from "@angular/core";
import { BaseAngular } from "../base-angular";

@Component({
  selector: "sv-action-bar-item",
  templateUrl: "./action-bar-item.component.html",
  styleUrls: ["./action-bar-item.component.scss"]
})
export class ActionBarItemComponent extends BaseAngular {
  @Input() model: any;
  getModel() {
    return this.model;
  }
}