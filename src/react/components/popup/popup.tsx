import ReactDOM from "react-dom";
import React from "react";
import { PopupModel, PopupBaseViewModel, IDialogOptions, createDialogOptions, createPopupModalViewModel, createPopupViewModel, PopupModalViewModel, PopupDropdownViewModel, CssClassBuilder, settings } from "survey-core";
import { ReactElementFactory } from "../../element-factory";
import { SurveyElementBase } from "../../reactquestion_element";
import { Base } from "../../../base";

interface IPopupProps {
  model: PopupModel;
}

export class Popup extends SurveyElementBase<IPopupProps, any> {
  private popup: PopupBaseViewModel;
  private containerRef: React.RefObject<HTMLDivElement>;
  constructor(props: IPopupProps) {
    super(props);
    this.containerRef = React.createRef();
    this.createModel();
  }
  get model(): PopupModel {
    return this.props.model;
  }
  protected getStateElement(): Base {
    return this.model;
  }
  private createModel(): void {
    this.popup = createPopupViewModel(this.props.model, undefined);
    this.popup.initializePopupContainer();
  }
  private setTargetElement(): void {
    if(!!this.containerRef.current && !this.popup.isModal) {
      const popupDropdownModel = this.popup as PopupDropdownViewModel;
      if(!popupDropdownModel) return;

      popupDropdownModel.targetElement = this.containerRef.current.parentElement;
    }
  }
  componentDidMount(): void {
    super.componentDidMount();
    this.popup.initializePopupContainer();
    this.setTargetElement();
  }
  componentDidUpdate(prevProps: any, prevState: any) {
    super.componentDidUpdate(prevProps, prevState);
    this.setTargetElement();
  }
  componentWillUnmount(): void {
    this.popup.unmountPopupContainer();
  }
  shouldComponentUpdate(nextProps: IPopupProps, nextState: any) {
    if (!super.shouldComponentUpdate(nextProps, nextState)) return false;
    const isNeedUpdate = nextProps.model !== this.popup.model;
    if(isNeedUpdate) {
      this.popup?.dispose();
      this.createModel();
    }
    return isNeedUpdate;
  }
  render(): JSX.Element {
    this.popup.model = this.model;
    let popupContainer;
    if(this.model.isModal) {
      popupContainer = ReactDOM.createPortal(<PopupModalContainer model={this.popup}></PopupModalContainer>, this.popup.container);
    } else {
      popupContainer = ReactDOM.createPortal(<PopupDropdownContainer model={this.popup}></PopupDropdownContainer>, this.popup.container);
    }
    return <div ref={this.containerRef}>{popupContainer}</div>;
  }
}

ReactElementFactory.Instance.registerElement(
  "sv-popup",
  (props: IPopupProps) => {
    return React.createElement(Popup, props);
  }
);

export class PopupContainer extends SurveyElementBase<any, any> {
  public prevIsVisible: boolean = false;
  constructor(props: any) {
    super(props);
  }
  handleKeydown = (event: any) => {
    this.model.onKeyDown(event);
  };
  get model(): PopupBaseViewModel {
    return this.props.model;
  }
  protected getStateElement(): Base {
    return this.model;
  }
  clickInside = (ev: any) => {
    ev.stopPropagation();
  };
  componentDidUpdate(prevProps: any, prevState: any) {
    super.componentDidUpdate(prevProps, prevState);
    if (!this.prevIsVisible && this.model.isVisible) {
      this.model.updateOnShowing();
    }
    this.prevIsVisible = this.model.isVisible;
  }
  renderContainer(PopupBaseViewModel: PopupBaseViewModel): JSX.Element {
    const headerPopup = PopupBaseViewModel.showHeader ? this.renderHeaderPopup(PopupBaseViewModel) : null;
    const headerContent = !!PopupBaseViewModel.title ? this.renderHeaderContent() : null;
    const content = this.renderContent();
    const footerContent = PopupBaseViewModel.showFooter ? this.renderFooter(this.model) : null;
    return (
      <div
        className="sv-popup__container"
        style={{
          left: PopupBaseViewModel.left,
          top: PopupBaseViewModel.top,
          height: PopupBaseViewModel.height,
          width: PopupBaseViewModel.width,
          minWidth: PopupBaseViewModel.minWidth,
        }}
        onClick={(ev: any) => {
          this.clickInside(ev);
        }}
      >
        <div className="sv-popup__shadow">
          {headerPopup}
          <div className="sv-popup__body-content">
            {headerContent}
            <div className="sv-popup__scrolling-content">
              {content}
            </div>
            {footerContent}
          </div>
        </div>
      </div>
    );
  }
  renderHeaderContent(): JSX.Element {
    return <div className="sv-popup__body-header">{this.model.title}</div>;
  }
  renderContent(): JSX.Element {
    const contentComponent = ReactElementFactory.Instance.createElement(
      this.model.contentComponentName,
      this.model.contentComponentData
    );
    return <div className="sv-popup__content">{contentComponent}</div>;
  }
  renderCancelButton(popuModel: PopupBaseViewModel): JSX.Element| null {
    return (
      <button
        type="button"
        className="sv-popup__body-footer-item sv-popup__button sv-popup__button--cancel"
        onClick={() => {
          popuModel.cancel();
        }}
      >
        {popuModel.cancelButtonText}
      </button>
    );
  }
  protected renderHeaderPopup(popupModel: PopupBaseViewModel): JSX.Element | null {
    return null;
  }
  protected renderFooter(popuModel: PopupBaseViewModel): JSX.Element | null {
    return (
      <div className="sv-popup__body-footer">
        {this.renderCancelButton(popuModel)}
      </div>
    );
  }
  render(): JSX.Element {
    const container = this.renderContainer(this.model);
    const className = new CssClassBuilder()
      .append("sv-popup")
      .append(this.model.styleClass)
      .toString();
    const style = { display: this.model.isVisible ? "" : "none", };
    return (
      <div
        tabIndex={-1}
        className={className}
        style={style}
        onClick={(e: any) => {
          this.model.clickOutside();
          e.stopPropagation();
        }}
        onKeyDown={this.handleKeydown}
      >
        {container}
      </div>
    );
  }
}
export class PopupDropdownContainer extends PopupContainer {

  protected renderHeaderPopup(popupModel: PopupBaseViewModel): JSX.Element | null {
    const popupDropdownModel = popupModel as PopupDropdownViewModel;
    if(!popupDropdownModel) return null;

    return (
      <span
        style={{
          left: popupDropdownModel.pointerTarget.left,
          top: popupDropdownModel.pointerTarget.top,
        }}
        className="sv-popup__pointer"
      ></span>
    );
  }
}
export class PopupModalContainer extends PopupContainer {

  protected renderFooter(popuModel: PopupBaseViewModel): JSX.Element | null {
    const popupModalModel = popuModel as PopupModalViewModel;
    if(!popupModalModel) return null;

    return (
      <div className="sv-popup__body-footer">
        {this.renderCancelButton(popupModalModel)}
        {this.renderApplyButton(popupModalModel)}
      </div>
    );
  }

  renderApplyButton(popupModalModel: PopupModalViewModel): JSX.Element {
    return (
      <button
        type="button"
        className="sv-popup__body-footer-item sv-popup__button sv-popup__button--apply"
        onClick={() => {
          popupModalModel.apply();
        }}
      >
        {popupModalModel.applyButtonText}
      </button>
    );
  }
}

// replace to showDialog then delete
export function showModal(
  componentName: string,
  data: any,
  onApply: () => boolean,
  onCancel?: () => void,
  cssClass?: string,
  title?: string,
  displayMode: "popup" | "overlay" = "popup"
) {
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
  showDialog(options);
}
export function showDialog(dialogOptions: IDialogOptions) {
  dialogOptions.onHide = () => { {
    ReactDOM.unmountComponentAtNode(popupViewModel.container);
    popupViewModel.unmountPopupContainer();
  } };
  const popupViewModel: PopupBaseViewModel = createPopupModalViewModel(dialogOptions);
  ReactDOM.render(<PopupModalContainer model={popupViewModel} />, popupViewModel.container);

  popupViewModel.model.isVisible = true;
}

settings.showModal = showModal;
