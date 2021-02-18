import React from "react";
import ReactDOM from "react-dom";
import { PopupModel, PopupViewModel } from "../../../popup";
import { ReactElementFactory } from "../../element-factory";
import { SurveyElementBase } from "../../reactquestion_element";

interface IPopupProps {
  model: PopupModel;
}

export class Popup extends SurveyElementBase<IPopupProps, any> {
  private container: any;
  private popup: PopupViewModel;
  private containerRef: React.RefObject<HTMLDivElement>;
  constructor(props: IPopupProps) {
    super(props);
    this.containerRef = React.createRef();
    this.popup = new PopupViewModel(this.props.model);
  }

  get model(): PopupModel {
    return this.props.model;
  }

  protected getStateElement() {
    return this.model;
  }

  componentDidMount() {
    super.componentDidMount();
    this.popup.targetElement = this.containerRef.current.parentElement;
  }

  render() {
    return (
      <div ref={this.containerRef}>
        <PopupContainer model={this.popup}></PopupContainer>
      </div>
    );
  }
  componentWillUnmount() {
    this.container.remove();
    this.container = undefined;
    super.componentWillUnmount();
  }
}

ReactElementFactory.Instance.registerElement("sv-popup", (props) => {
  return React.createElement(Popup, (props as any) as IPopupProps);
});

export class PopupContainer extends SurveyElementBase<any, any> {
  private container: HTMLElement;

  constructor(props: any) {
    super(props);
    this.container = document.createElement("div");
    document.body.appendChild(this.container);
    this.model.container = this.container;
  }
  get model(): PopupViewModel {
    return this.props.model;
  }

  protected getStateElement() {
    return this.model;
  }

  clickInside = (ev: any) => {
    ev.stopPropagation();
  };

  renderContainer() {
    const pointer = this.model.showPointer ? this.renderPointer() : null;
    const header = this.renderHeader();
    const content = this.renderContent();
    const footer = this.model.isModal ? this.renderFooter() : null;

    return (
      <div
        className="sv-popup__container"
        style={{ left: this.model.left, top: this.model.top }}
        onClick={(ev: any) => {
          this.clickInside(ev);
        }}
      >
        {pointer}
        {header}
        {content}
        {footer}
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
    return <div className="sv-popup__header"></div>;
  }

  renderContent() {
    const contentComponent = ReactElementFactory.Instance.createElement(
      this.model.contentComponentName,
      this.model.contentComponentData
    );
    return <div className="sv-popup__content">{contentComponent}</div>;
  }
  renderFooter() {
    return (
      <div className="sv-popup__footer">
        <button
          onClick={() => {
            this.model.cancel();
          }}
        >
          {this.model.cancelButtonText}
        </button>
        <button
          onClick={() => {
            this.model.apply();
          }}
        >
          {this.model.applyButtonText}
        </button>
      </div>
    );
  }

  render() {
    const container = this.renderContainer();
    var className = "sv-popup " + this.model.styleClass;
    const style = {
      display: this.model.isVisible ? "block" : "none",
    };
    var content = (
      <div
        className={className}
        style={style}
        onClick={(e: any) => {
          this.model.clickOutside();
          e.stopPropagation();
        }}
      >
        {container}
      </div>
    );

    return ReactDOM.createPortal(content, this.container);
  }
}
