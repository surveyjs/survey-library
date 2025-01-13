import { Component, Input } from "@angular/core";
import { ListModel, Action } from "survey-core";
import { BaseAngular } from "../../base-angular";
import { AngularComponentFactory } from "../../component-factory";

@Component({
  selector: "sv-ng-list-item-content, '[sv-ng-list-item-content]'",
  templateUrl: "./list-item-content.component.html",
  styleUrls: ["../../hide-host.scss"],
})

export class ListItemContentComponent extends BaseAngular {
  @Input() element: any;
  @Input() model!: Action;
  @Input() listModel!: ListModel;

  getModel() {
    return this.model;
  }
}

AngularComponentFactory.Instance.registerComponent("sv-list-item-content", ListItemContentComponent);