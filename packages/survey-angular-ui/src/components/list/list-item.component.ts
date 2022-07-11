import { Component, HostBinding, HostListener, Input, ViewChild, ViewContainerRef } from "@angular/core";
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

  @ViewChild("itemComponent", { read: ViewContainerRef, static: true }) itemComponent!: ViewContainerRef;

  @HostBinding("attr.aria-selected") get ariaSelected(): boolean | string {
    return this.model.isItemSelected(this.item) || "";
  }
  @HostBinding("class") get class(): string {
    return this.model.getItemClass(this.item);
  }
  @HostBinding("style.paddingLeft") get paddingLeft(): string {
    return this.model.getItemIndent(this.item);
  }
  @HostListener("click") click(): void {
    this.model.selectItem(this.item);
  }
  @HostListener("pointerdown") pointerdown(event: PointerEvent): void {
    this.model.onPointerDown(event, this.item);
  }

  getModel() {
    return this.item;
  }

  override ngOnInit(): void {
    if (!this.item.component) return;

    let componentRef = AngularComponentFactory.Instance.create(this.itemComponent, this.item.component);
    if (!!componentRef) {
      (componentRef.instance as any).model = this.item;
    }
  }
}

AngularComponentFactory.Instance.registerComponent("sv-list-item", ListItemComponent);