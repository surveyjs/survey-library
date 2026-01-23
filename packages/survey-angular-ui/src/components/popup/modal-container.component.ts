import { DomPortalOutlet } from "@angular/cdk/portal";
import { Component } from "@angular/core";
import { IDialogOptions, PopupBaseViewModel, createPopupModalViewModel, settings } from "survey-core";
import { PopupService } from "./popup.service";

interface IModalWindowDescriptor {
  model: PopupBaseViewModel;
  portalHost: DomPortalOutlet;
}

@Component({
  selector: "sv-ng-modal-container",
  template: "",
  styleUrls: ["../../hide-host.scss"]
})

export class ModalComponent {
  private functionDefined: boolean = false;
  private descriptors: Array<IModalWindowDescriptor> = [];

  constructor(private popupService: PopupService) {
  }
  showDialog(dialogOptions: IDialogOptions, rootElement?: HTMLElement): PopupBaseViewModel {
    const model = createPopupModalViewModel(dialogOptions, rootElement);
    const descriptor: IModalWindowDescriptor = {
      model: model,
      portalHost: this.popupService.createComponent(model)
    };
    const onVisibilityChangedCallback = (_: PopupBaseViewModel, options: { isVisible: boolean }) => {
      if (!options.isVisible) {
        descriptor.portalHost.detach();
        const index = this.descriptors.indexOf(descriptor);
        if (index >= 0) {
          this.descriptors.splice(index, 1);
        }
        model.onVisibilityChanged.remove(onVisibilityChangedCallback);
        descriptor.model.dispose();
      }
    };
    this.descriptors.push(descriptor);
    model.onVisibilityChanged.add(onVisibilityChangedCallback);
    model.model.isVisible = true;
    return model;
  }
  ngOnInit(): void {
    this.functionDefined = true;
    settings.showDialog = (dialogOptions: IDialogOptions, rootElement?: HTMLElement) => {
      return this.showDialog(dialogOptions, rootElement);
    };
  }
  ngOnDestroy() {
    for (const descriptor of this.descriptors) {
      descriptor.portalHost.detach();
      descriptor.model.dispose();
    }
    this.descriptors = [];
    if (this.functionDefined) {
      settings.showDialog = <any>undefined;
    }
  }
}

