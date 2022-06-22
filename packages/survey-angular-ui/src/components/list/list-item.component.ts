import { Component, Input, ViewChild, ViewContainerRef } from "@angular/core";
import { ListModel, Action } from "survey-core";
import { BaseAngular } from "../../base-angular";
import { AngularComponentFactory } from "../../component-factory";

@Component({
  selector: "sv-ng-list-item, '[sv-ng-list-item]'",
  templateUrl: "./list-item.component.html",
})

export class ListItemComponent extends BaseAngular {
  @Input() item!: Action;
  @Input() model!: ListModel;
  @ViewChild("itemComponent", { read: ViewContainerRef, static: true }) itemComponent!: ViewContainerRef;

  getModel() {
    return this.item;
  }
  itemClick() {
    this.model.selectItem(this.item);
  }
  pointerdown(event: Event) {
    this.model.onPointerDown(event, this.item);
  }
  ngOnInit(): void {
    if (!this.item.component) return;

    let componentRef = AngularComponentFactory.Instance.create(this.itemComponent, this.item.component);
    if (!!componentRef) {
      (componentRef.instance as any).model = this.item;
    }
  }
}

AngularComponentFactory.Instance.registerComponent("sv-list-item", ListItemComponent);