import { DomPortalOutlet } from "@angular/cdk/portal";
import { Component } from "@angular/core";
import { IDialogOptions, PopupBaseViewModel, PopupModalManager, settings } from "survey-core";
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
  private hosts: { [index: number]: DomPortalOutlet } = {};
  private modalManager: PopupModalManager = this.createModalManager();
  constructor(private popupService: PopupService) {
  }
  createModalManager(): PopupModalManager {
    const modalManager = new PopupModalManager();
    modalManager.onModalsChangedCallback = (_, addedModals, removedModals) => {
      for (const modal of addedModals) {
        this.hosts[modal.uniqueId] = this.popupService.createComponent(modal);
      }
      for (const modal of removedModals) {
        if (this.hosts[modal.uniqueId]) {
          this.hosts[modal.uniqueId].detach();
        }
      }
    };
    return modalManager;
  }
  ngOnInit(): void {
    this.functionDefined = true;
    settings.showDialog = (dialogOptions: IDialogOptions, rootElement?: HTMLElement) => this.modalManager.addDialog(dialogOptions, rootElement);
  }
  ngOnDestroy() {
    this.modalManager.clear();
    if (this.functionDefined) {
      settings.showDialog = <any>undefined;
    }
  }
}

