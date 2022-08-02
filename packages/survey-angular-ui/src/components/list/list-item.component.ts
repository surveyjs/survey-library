import { Component, Input } from "@angular/core";
import { ListModel, Action } from "survey-core";
import { BaseAngular } from "../../base-angular";
import { AngularComponentFactory } from "../../component-factory";

@Component({
  selector: "sv-ng-list-item, '[sv-ng-list-item]'",
  templateUrl: "./list-item.component.html",
  styleUrls: ["../../hide-host.scss"],
})

export class ListItemComponent extends BaseAngular {
  @Input() element: any;
  @Input() model!: Action;
  @Input() listModel!: ListModel;

  get ariaSelected(): boolean | string {
    return this.listModel.isItemSelected(this.model) || "";
  }
  get class(): string {
    return this.listModel.getItemClass(this.model);
  }
  get paddingLeft(): string {
    return this.listModel.getItemIndent(this.model);
  }
  click(event: MouseEvent): void {
    this.listModel.onItemClick(this.model);
    event.stopPropagation();
  }
  pointerdown(event: MouseEvent): void {
    this.listModel.onPointerDown(event, this.model);
  }

  getModel() {
    return this.model;
  }
}

AngularComponentFactory.Instance.registerComponent("sv-list-item", ListItemComponent);