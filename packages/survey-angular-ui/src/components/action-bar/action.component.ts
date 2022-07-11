import { Component, Input, ViewChild, ViewContainerRef } from "@angular/core";
import { BaseAngular } from "../../base-angular";
import { AngularComponentFactory } from "../../component-factory";

@Component({
  selector: "sv-ng-action",
  templateUrl: "./action.component.html",
  styles: [":host { display: none; }"],
})
export class ActionComponent extends BaseAngular {
  @Input() model: any;
  @ViewChild("actionContent", { read: ViewContainerRef, static: true }) actionContent!: ViewContainerRef;
  getModel() {
    return this.model;
  }
  getComponentName() {
    return this.model.component || "sv-action-bar-item";
  }
}

AngularComponentFactory.Instance.registerComponent("sv-action", ActionComponent);