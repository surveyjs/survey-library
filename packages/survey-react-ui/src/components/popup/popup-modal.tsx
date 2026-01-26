import { createPortal } from "react-dom";
import * as React from "react";
import { PopupContainer } from "./popup";
import { SurveyElementBase } from "../../reactquestion_element";
import { IDialogOptions, PopupModalManager, settings } from "survey-core";

interface IModalDescriptor { init: () => void, clean: () => void }

export class PopupModal extends SurveyElementBase<{}, any> {
  private modalManager: PopupModalManager = this.createPopupModalManager();
  private isInitialized: boolean = false;
  private descriptor: IModalDescriptor;
  private createPopupModalManager() {
    const modalManager = new PopupModalManager();
    modalManager.onModalsChangedCallback = () => {
      this.setState({ changed: this.state.changed + 1 });
    };
    return modalManager;
  }
  constructor(props: {}) {
    super(props);
    this.state = { changed: 0 };
    this.descriptor = {
      init: this.init,
      clean: this.clean
    };
  }

  static modalDescriptors: Array<IModalDescriptor> = [];
  static addModalDescriptor(descriptor: IModalDescriptor): void {
    if (!settings.showDialog) {
      descriptor.init();
    }
    this.modalDescriptors.push(descriptor);
  }
  static removeModalDescriptor(descriptor: IModalDescriptor): void {
    descriptor.clean();
    this.modalDescriptors.splice(this.modalDescriptors.indexOf(descriptor), 1);
    if (!settings.showDialog && this.modalDescriptors[0]) {
      this.modalDescriptors[0].init();
    }
  }
  protected renderElement(): React.JSX.Element | null {
    return <>{this.modalManager.getModals().map(model => createPortal(<PopupContainer model={model}></PopupContainer>, model.container, model.uniqueId.toString()))}</>;
  }
  init: () => void = () => {
    if (!this.isInitialized) {
      settings.showDialog = (dialogOptions: IDialogOptions, rootElement?: HTMLElement) => this.modalManager.addDialog(dialogOptions, rootElement);
      this.isInitialized = true;
    }
  };
  clean: () => void = () => {
    if (this.isInitialized) {
      settings.showDialog = undefined as any;
      this.isInitialized = false;
    }
  };
  componentDidMount(): void {
    PopupModal.addModalDescriptor(this.descriptor);
  }
  componentWillUnmount(): void {
    this.modalManager.clear();
    PopupModal.removeModalDescriptor(this.descriptor);
  }
}