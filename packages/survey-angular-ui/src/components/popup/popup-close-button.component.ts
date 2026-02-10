import { Component, Input } from "@angular/core";
import { BaseAngular } from "../../base-angular";
import { PopupBaseViewModel } from "survey-core";
import { AngularComponentFactory } from "../../component-factory";

@Component({
  selector: "sv-ng-popup-close-button, '[sv-ng-popup-close-button]'",
  templateUrl: "./popup-close-button.component.html"
})

export class PopupCloseButtonComponent extends BaseAngular<PopupBaseViewModel> {
  @Input() model!: PopupBaseViewModel;

  get popupModel(): PopupBaseViewModel {
    return this.model as PopupBaseViewModel;
  }

  protected getModel(): PopupBaseViewModel {
    return this.model;
  }
}
AngularComponentFactory.Instance.registerComponent("popup-close-button", PopupCloseButtonComponent);