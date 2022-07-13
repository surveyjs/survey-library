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
  @Input() item!: Action;
  @Input() model!: ListModel;

  @HostBinding("attr.aria-selected") get ariaSelected(): boolean | string {
    return this.model.isItemSelected(this.item) || "";
  }
  @HostBinding("class") get class(): string {
    return this.model.getItemClass(this.item);
  }
  @HostBinding("style.paddingLeft") get paddingLeft(): string {
    return this.model.getItemIndent(this.item);
  }
  @HostListener("click", ["$event"]) click(event: PointerEvent): void {
    this.model.selectItem(this.item);
    event.stopPropagation();
  }
  @HostListener("pointerdown", ["$event"]) pointerdown(event: PointerEvent): void {
    this.model.onPointerDown(event, this.item);
  }

  getModel() {
    return this.item;
  }
}

AngularComponentFactory.Instance.registerComponent("sv-list-item", ListItemComponent);