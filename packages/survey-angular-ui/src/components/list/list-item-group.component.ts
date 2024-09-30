import { Component, Input } from "@angular/core";
import { ListModel, Action } from "survey-core";
import { BaseAngular } from "../../base-angular";
import { AngularComponentFactory } from "../../component-factory";

@Component({
  selector: "sv-ng-list-item-group, '[sv-ng-list-item-group]'",
  templateUrl: "./list-item-group.component.html",
  styleUrls: ["../../hide-host.scss"],
})

export class ListItemGroupComponent extends BaseAngular {
  @Input() element: any;
  @Input() model!: Action;
  @Input() listModel!: ListModel;

  getModel() {
    return this.model;
  }
}

AngularComponentFactory.Instance.registerComponent("sv-list-item-group", ListItemGroupComponent);