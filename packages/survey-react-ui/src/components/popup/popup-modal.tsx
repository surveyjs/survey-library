import { createPortal } from "react-dom";
import * as React from "react";
import { PopupContainer } from "./popup";
import { SurveyElementBase } from "../../reactquestion_element";
import { createPopupModalViewModel, IDialogOptions, PopupBaseViewModel, settings } from "survey-core";

interface IModalDescriptor { init: () => void, clean: () => void }

export class PopupModal extends SurveyElementBase<{}, any> {
  private models: Array<PopupBaseViewModel> = [];
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
    return <>{this.models.map(model => createPortal(<PopupContainer model={model}></PopupContainer>, model.container, model.uniqueId.toString()))}</>;
  }
  showDialog(dialogOptions: IDialogOptions, rootElement?: HTMLElement): PopupBaseViewModel {
    const model = createPopupModalViewModel(dialogOptions, rootElement);
    const onVisibilityChangedCallback = (_: PopupBaseViewModel, options: { isVisible: boolean }) => {
      if (!options.isVisible) {
        const index = this.models.indexOf(model);
        if (index >= 0) {
          this.models.splice(index, 1);
        }
        model.onVisibilityChanged.remove(onVisibilityChangedCallback);
        this.setState({ changed: this.state.changed + 1 });
        model.dispose();
      }
    };
    model.onVisibilityChanged.add(onVisibilityChangedCallback);
    model.model.isVisible = true;
    this.models.push(model);
    this.setState({ changed: this.state.changed + 1 });
    return model;
  }
  init: () => void = () => {
    if (!this.isInitialized) {
      settings.showDialog = (dialogOptions: IDialogOptions, rootElement?: HTMLElement) => {
        return this.showDialog(dialogOptions, rootElement);
      };
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
    for (const model of this.models) {
      model.dispose();
    }
    this.models = [];
    PopupModal.removeModalDescriptor(this.descriptor);
  }
}