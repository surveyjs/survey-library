import { Component, HostBinding, HostListener, Input } from "@angular/core";
import { ListModel, Action } from "survey-core";
import { BaseAngular } from "../../base-angular";
import { AngularComponentFactory } from "../../component-factory";

@Component({
  selector: "sv-ng-list-item, '[sv-ng-list-item]'",
  templateUrl: "./list-item.component.html",
})

export class ListItemComponent extends BaseAngular {
  @Input() element: any;
  @Input() model!: Action;
  @Input() listModel!: ListModel;

  @HostBinding("attr.aria-selected") get ariaSelected(): boolean | string {
    return this.listModel.isItemSelected(this.model) || "";
  }
  @HostBinding("class") get class(): string {
    return this.listModel.getItemClass(this.model);
  }
  @HostBinding("style.paddingLeft") get paddingLeft(): string {
    return this.listModel.getItemIndent(this.model);
  }
  @HostListener("click", ["$event"]) click(event: PointerEvent): void {
    this.listModel.onClick(this.model);
    event.stopPropagation();
  }
  @HostListener("pointerdown", ["$event"]) pointerdown(event: PointerEvent): void {
    this.listModel.onPointerDown(event, this.model);
  }

  getModel() {
    return this.model;
  }
}

AngularComponentFactory.Instance.registerComponent("sv-list-item", ListItemComponent);