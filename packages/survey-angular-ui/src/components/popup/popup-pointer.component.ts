import { Component, Input } from "@angular/core";
import { BaseAngular } from "../../base-angular";
import { PopupBaseViewModel, PopupDropdownViewModel } from "survey-core";
import { AngularComponentFactory } from "../../component-factory";

@Component({
  selector: "sv-ng-popup-pointer, '[sv-ng-popup-pointer]'",
  templateUrl: "./popup-pointer.component.html"
})

export class PopupPointerComponent extends BaseAngular<PopupBaseViewModel> {
  @Input() model!: PopupBaseViewModel;

  get popupModel(): PopupDropdownViewModel {
    return this.model as PopupDropdownViewModel;
  }

  protected getModel(): PopupBaseViewModel {
    return this.model;
  }
}
AngularComponentFactory.Instance.registerComponent("popup-pointer", PopupPointerComponent);