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
  showDialog(dialogOptions: IDialogOptions, rootElement?: HTMLElement): PopupBaseViewModel {
    const popupViewModel = this.model = createPopupModalViewModel(dialogOptions, rootElement);
    const onVisibilityChangedCallback = (_: PopupBaseViewModel, options: { isVisible: boolean }) => {
      if(!options.isVisible) {
        this.portalHost.detach();
        this.model.dispose();
      }
    };
    popupViewModel.onVisibilityChanged.add(onVisibilityChangedCallback);
    this.portalHost = this.popupService.createComponent(this.model);
    this.model.model.isVisible = true;
    return this.model;
  }
  ngOnInit(): void {
    if (!!settings.showModal) return;
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

    settings.showDialog = (dialogOptions: IDialogOptions, rootElement?: HTMLElement) => {
      return this.showDialog(dialogOptions, rootElement);
    };
  }
  ngOnDestroy() {
    this.portalHost?.detach();
    this.model?.dispose();
    if (this.functionDefined) {
      settings.showModal = <any>undefined;
      settings.showDialog = <any>undefined;
    }
  }
}

