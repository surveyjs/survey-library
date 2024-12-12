import React from "react";
import { Base, PopupModel, PopupBaseViewModel, PopupDropdownViewModel, IDialogOptions, createDialogOptions, createPopupModalViewModel, createPopupViewModel, CssClassBuilder, settings } from "survey-core";
import { ReactElementFactory } from "../../element-factory";
import { SurveyElementBase } from "../../reactquestion_element";
import { SurveyActionBar } from "../action-bar/action-bar";

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
    this.popup = createPopupViewModel(this.props.model);
  }
  private setTargetElement(): void {
    const container = this.containerRef.current as HTMLElement;
    this.popup.setComponentElement(container);
  }
  componentDidMount(): void {
    super.componentDidMount();
    this.setTargetElement();
  }
  componentDidUpdate(prevProps: any, prevState: any) {
    super.componentDidUpdate(prevProps, prevState);
    this.setTargetElement();
  }
  componentWillUnmount(): void {
    super.componentWillUnmount();
    this.popup.resetComponentElement();
  }
  shouldComponentUpdate(nextProps: IPopupProps, nextState: any) {
    if (!super.shouldComponentUpdate(nextProps, nextState)) return false;
    const isNeedUpdate = nextProps.model !== this.popup.model;
    if (isNeedUpdate) {
      this.popup?.dispose();
      this.createModel();
    }
    return isNeedUpdate;
  }
  render(): React.JSX.Element {
    this.popup.model = this.model;
    let popupContainer;
    if (this.model.isModal) {
      popupContainer = <PopupContainer model={this.popup}></PopupContainer>;
    } else {
      popupContainer = <PopupDropdownContainer model={this.popup}></PopupDropdownContainer>;
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
    if (!this.model.isPositionSet && this.model.isVisible) {
      this.model.updateOnShowing();
    }
  }
  renderContainer(popupBaseViewModel: PopupBaseViewModel): React.JSX.Element {
    const headerPopup = popupBaseViewModel.showHeader ? this.renderHeaderPopup(popupBaseViewModel) : null;
    const headerContent = !!popupBaseViewModel.title ? this.renderHeaderContent() : null;
    const content = this.renderContent();
    const footerContent = popupBaseViewModel.showFooter ? this.renderFooter(this.model) : null;
    return (
      <div
        className="sv-popup__container"
        style={{
          left: popupBaseViewModel.left,
          top: popupBaseViewModel.top,
          height: popupBaseViewModel.height,
          width: popupBaseViewModel.width,
          minWidth: popupBaseViewModel.minWidth,
        }}
        onClick={(ev: any) => {
          this.clickInside(ev);
        }}
      >
        {headerPopup}
        <div className="sv-popup__body-content">
          {headerContent}
          <div className="sv-popup__scrolling-content">
            {content}
          </div>
          {footerContent}
        </div>
      </div>
    );
  }
  renderHeaderContent(): React.JSX.Element {
    return <div className="sv-popup__body-header">{this.model.title}</div>;
  }
  renderContent(): React.JSX.Element {
    const contentComponent = ReactElementFactory.Instance.createElement(
      this.model.contentComponentName,
      this.model.contentComponentData
    );
    return <div className="sv-popup__content">{contentComponent}</div>;
  }

  protected renderHeaderPopup(popupModel: PopupBaseViewModel): React.JSX.Element | null {
    return null;
  }
  protected renderFooter(popuModel: PopupBaseViewModel): React.JSX.Element | null {
    return (
      <div className="sv-popup__body-footer">
        <SurveyActionBar model={popuModel.footerToolbar}></SurveyActionBar>
      </div>
    );
  }
  render(): React.JSX.Element {
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
          this.model.clickOutside(e);
        }}
        onKeyDown={this.handleKeydown}
      >
        {container}
      </div>
    );
  }
  componentDidMount(): void {
    super.componentDidMount();
    if (this.model.isVisible) {
      this.model.updateOnShowing();
    }
  }
}
export class PopupDropdownContainer extends PopupContainer {

  protected renderHeaderPopup(popupModel: PopupBaseViewModel): React.JSX.Element | null {
    const popupDropdownModel = popupModel as PopupDropdownViewModel;
    if (!popupDropdownModel) return null;

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