import { Component, Input } from "@angular/core";
import { BaseAngular } from "../base-angular";

@Component({
  selector: "sv-action-bar",
  templateUrl: "./action-bar.component.html",
  styleUrls: ["./action-bar.component.scss"]
})
export class ActionBarComponent extends BaseAngular {
  @Input() model: any;
  @Input() handleClick: any;
  getModel() {
    return this.model;
  }
  onClick(): boolean | void {
    return this.handleClick ? true : undefined;
  }
}