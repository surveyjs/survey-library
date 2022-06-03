import { Component, Input, ViewChild, ViewContainerRef } from "@angular/core";
import { BaseAngular } from "../base-angular";
import { AngularComponentFactory } from "../component-factory";

@Component({
  selector: "sv-ng-popup-container, '[sv-ng-popup-container]'",
  templateUrl: "./popup-container.component.html"
})

export class PopupContainerComponent extends BaseAngular {
  @Input() model: any;
  @ViewChild("popupContent", { read: ViewContainerRef, static: true }) popupContent!: ViewContainerRef;

  protected getModel() {
    return this.model;
  }

  public createAndBindPopupContent() {
    let componentRef = AngularComponentFactory.Instance.create(this.popupContent, this.model.contentComponentName);
    if (!!componentRef) {
      (componentRef.instance as any).model = this.model.contentComponentData;
    }
  }
}