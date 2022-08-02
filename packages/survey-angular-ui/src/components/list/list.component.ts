import { Component, Input } from "@angular/core";
import { BaseAngular } from "../../base-angular";
import { AngularComponentFactory } from "../../component-factory";

@Component({
  selector: "sv-ng-list, '[sv-ng-list]'",
  templateUrl: "./list.component.html",
  styleUrls: ["../../hide-host.scss"]
})
export class ListComponent extends BaseAngular {
  @Input() model: any;

  getModel() {
    return this.model;
  }
  onGoToItems(event: Event): void {
    this.model.goToItems(event);
  }
  onMouseDown(event: Event): void {
    event.preventDefault();
  }
  onKeyDown(event: Event): void {
    this.model.onKeyDown(event);
  }
}

AngularComponentFactory.Instance.registerComponent("sv-list", ListComponent);