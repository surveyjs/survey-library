import React from "react";
import ReactDOM from "react-dom";
import { PopupModel, PopupBaseViewModel, createPopupModalViewModel, CssClassBuilder, settings } from "survey-core";
import { ReactElementFactory } from "../../element-factory";
import { SurveyElementBase } from "../../reactquestion_element";

interface IPopupProps {
  model: PopupModel;
}

export class Popup extends SurveyElementBase<IPopupProps, any> {
  private popup: PopupBaseViewModel;
  private containerRef: React.RefObject<HTMLDivElement>;
  constructor(props: IPopupProps) {
    super(props);
    this.containerRef = React.createRef();
    this.popup = new PopupBaseViewModel(this.props.model);
    this.popup.createPopupContainer();
  }
  get model(): PopupModel {
    return this.props.model;
  }
  protected getStateElement() {
    return this.model;
  }
  componentDidMount() {
    super.componentDidMount();
    this.popup.mountPopupContainer();
    this.popup.targetElement = this.containerRef.current.parentElement;
  }
  componentWillUnmount() {
    this.popup.destroyPopupContainer();
  }
  shouldComponentUpdate(nextProps: IPopupProps) {
    return nextProps.model !== this.popup.model;
  }
  render() {
    this.popup.model = this.model;
    const popupContainer = ReactDOM.createPortal(
      <PopupContainer model={this.popup}></PopupContainer>,
      this.popup.container
    );
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
  protected getStateElement() {
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
  renderContainer() {
    const pointer = this.model.showPointer ? this.renderPointer() : null;
    const header = !!this.model.title ? this.renderHeader() : null;
    const content = this.renderContent();
    const footer = this.model.showFooter ? this.renderFooter() : null;
    return (
      <div
        className="sv-popup__container"
        style={{
          left: this.model.left,
          top: this.model.top,
          height: this.model.height,
        }}
        onClick={(ev: any) => {
          this.clickInside(ev);
        }}
      >
        <div className="sv-popup_shadow">
          {pointer}
          {header}
          <div className="sv-popup__scrolling-content">
            {content}
          </div>
          {footer}
        </div>
      </div>
    );
  }
  renderPointer() {
    return (
      <span
        style={{
          left: this.model.pointerTarget.left,
          top: this.model.pointerTarget.top,
        }}
        className="sv-popup__pointer"
      ></span>
    );
  }
  renderHeader() {
    return <div className="sv-popup__header">{this.model.title}</div>;
  }
  renderContent() {
    const contentComponent = ReactElementFactory.Instance.createElement(
      this.model.contentComponentName,
      this.model.contentComponentData
    );
    return <div className="sv-popup__content">{contentComponent}</div>;
  }
  renderCancelButton() {
    return (
      <button
        type="button"
        className="sv-popup__footer-item sv-popup__button sv-popup__button--cancel"
        onClick={() => {
          this.model.cancel();
        }}
      >
        {this.model.cancelButtonText}
      </button>
    );
  }
  renderApplyButton() {
    return (
      <button
        type="button"
        className="sv-popup__footer-item sv-popup__button sv-popup__button--apply"
        onClick={() => {
          this.model.apply();
        }}
      >
        {this.model.applyButtonText}
      </button>
    );
  }
  renderFooter() {
    return (
      <div className="sv-popup__footer">
        {this.renderCancelButton()}
        {this.model.isModal ? this.renderApplyButton() : null}
      </div>
    );
  }
  render() {
    const container = this.renderContainer();
    const className = new CssClassBuilder()
      .append("sv-popup").append(this.model.styleClass).toString();
    const style = {
      display: this.model.isVisible ? "" : "none",
    };
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

export function showModal(
  componentName: string,
  data: any,
  onApply: () => boolean,
  onCancel?: () => void,
  cssClass?: string,
  title?: string,
  displayMode: "popup" | "overlay" = "popup"
) {
  const popupViewModel: PopupBaseViewModel = createPopupModalViewModel(
    componentName,
    data,
    onApply,
    onCancel,
    () => {
      ReactDOM.unmountComponentAtNode(popupViewModel.container);
      popupViewModel.destroyPopupContainer();
    },
    undefined,
    cssClass,
    title,
    displayMode
  );
  ReactDOM.render(<PopupContainer model={popupViewModel} />, popupViewModel.container);

  popupViewModel.model.isVisible = true;
}

settings.showModal = showModal;
