import { Component, Input } from "@angular/core";
import { ListModel } from "survey-core";
import { BaseAngular } from "../../base-angular";
import { AngularComponentFactory } from "../../component-factory";

@Component({
  selector: "sv-ng-list-loading, '[sv-ng-list-loading]'",
  templateUrl: "./list-loading.component.html",
  styleUrls: ["../../hide-host.scss"],
})
export class ListLoadingComponent extends BaseAngular {
  @Input() model!: ListModel;

  getModel() {
    return this.model;
  }
}

AngularComponentFactory.Instance.registerComponent("sv-list-loading", ListLoadingComponent);
