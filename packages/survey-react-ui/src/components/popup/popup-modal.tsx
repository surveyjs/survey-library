import { createPortal } from "react-dom";
import * as React from "react";
import { PopupContainer } from "./popup";
import { SurveyElementBase } from "../../reactquestion_element";
import { createPopupModalViewModel, IDialogOptions, PopupBaseViewModel, settings } from "survey-core";

interface IModalDescriptor { init: () => void, clean: () => void }

export class PopupModal extends SurveyElementBase<{}, any> {
  private model: PopupBaseViewModel;
  private isInitialized: boolean = false;
  private descriptor: IModalDescriptor;
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
    if (!this.model) return null;
    return createPortal(<PopupContainer model={this.model}></PopupContainer>, this.model.container);
  }
  showDialog(dialogOptions: IDialogOptions, rootElement?: HTMLElement): PopupBaseViewModel {
    this.model = createPopupModalViewModel(dialogOptions, rootElement);
    const onVisibilityChangedCallback = (_: PopupBaseViewModel, options: { isVisible: boolean }) => {
      if (!options.isVisible) {
        this.model.dispose();
        this.model = undefined as any;
        this.setState({ changed: this.state.changed + 1 });
      }
    };
    this.model.onVisibilityChanged.add(onVisibilityChangedCallback);
    this.model.model.isVisible = true;
    this.setState({ changed: this.state.changed + 1 });
    return this.model;
  }
  init: () => void = () => {
    if (!this.isInitialized) {
      settings.showDialog = (dialogOptions: IDialogOptions, rootElement?: HTMLElement) => {
        return this.showDialog(dialogOptions, rootElement);
      };
      this.isInitialized = true;
    }
  }
  clean: () => void = () => {
    if (this.isInitialized) {
      settings.showDialog = undefined as any;
      this.isInitialized = false;
    }
  }
  componentDidMount(): void {
    PopupModal.addModalDescriptor(this.descriptor);
  }
  componentWillUnmount(): void {
    if (this.model) {
      this.model.dispose();
      this.model = undefined as any;
    }
    PopupModal.removeModalDescriptor(this.descriptor);
  }
}