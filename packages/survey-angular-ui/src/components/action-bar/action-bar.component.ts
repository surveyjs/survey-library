import { Component, Input } from "@angular/core";
import { AngularComponentFactory } from "../../component-factory";
import { BaseAngular } from "../../base-angular";
import { ActionContainer } from "survey-core";

@Component({
  selector: "sv-action-bar, sv-ng-action-bar, '[sv-ng-action-bar]'",
  templateUrl: "./action-bar.component.html",
  styleUrls: ["./action-bar.component.scss"]
})
export class ActionBarComponent extends BaseAngular<ActionContainer> {
  @Input() model!: ActionContainer;
  @Input() handleClick: any;
  getModel(): ActionContainer {
    return this.model;
  }

  get allowOnClick(): boolean {
    return this.handleClick !== undefined ? this.handleClick : true;
  }

  onClick(event: Event): void {
    if(this.allowOnClick) {
      event.stopPropagation();
    }
  }
}

AngularComponentFactory.Instance.registerComponent("sv-action-bar", ActionBarComponent);