import { DomPortalOutlet } from "@angular/cdk/portal";
import { Component } from "@angular/core";
import { createDialogOptions, IDialogOptions, PopupBaseViewModel, createPopupModalViewModel, settings } from "survey-core";
import { PopupService } from "./popup.service";

@Component({
  selector: "sv-ng-modal-container",
  template: "",
  styleUrls: ["../../hide-host.scss"]
})

export class ModalComponent {

  public model!: PopupBaseViewModel;
  private portalHost!: DomPortalOutlet;
  private functionDefined: boolean = false;

  constructor(private popupService: PopupService) {
  }
  showDialog(dialogOptions: IDialogOptions): PopupBaseViewModel {
    this.model = createPopupModalViewModel(dialogOptions);
    this.model.initializePopupContainer();
    this.model.model.onHide = () => {
      this.portalHost.detach();
      this.model.unmountPopupContainer();
    };
    this.portalHost = this.popupService.createComponent(this.model);
    this.model.model.isVisible = true;
    return this.model;
  }
  ngOnInit(): void {
    if(!!settings.showModal) return;
    this.functionDefined = true;
    settings.showModal = (
      componentName: string,
      data: any,
      onApply: () => boolean,
      onCancel?: () => void,
      cssClass?: string,
      title?: string,
      displayMode: "popup" | "overlay" = "popup"
    ): PopupBaseViewModel => {
      const options = createDialogOptions(
        componentName,
        data,
        onApply,
        onCancel,
        undefined,
        undefined,
        cssClass,
        title,
        displayMode
      );
      return this.showDialog(options);
    };
  }
  ngOnDestroy() {
    if(this.functionDefined) {
      settings.showModal = <any>undefined;
    }
  }
}

