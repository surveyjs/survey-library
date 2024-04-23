import ReactDOM from "react-dom";
import React from "react";
import { Base, PopupModel, PopupBaseViewModel, PopupDropdownViewModel, IDialogOptions, createDialogOptions, createPopupModalViewModel, createPopupViewModel, CssClassBuilder, settings } from "survey-core";
import { ReactElementFactory } from "../../element-factory";
import { SurveyElementBase } from "../../reactquestion_element";
import { SurveyActionBar } from "../action-bar/action-bar";

interface IPopupProps {
  model: PopupModel;
  getTarget?: (container: HTMLElement) => HTMLElement;
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
    this.popup = createPopupViewModel(this.props.model, undefined as any);
  }
  private setTargetElement(): void {
    const container = this.containerRef.current as HTMLElement;
    this.popup.setComponentElement(container, this.props.getTarget ? this.props.getTarget(container) : undefined);
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
  renderContainer(popupBaseViewModel: PopupBaseViewModel): JSX.Element {
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

  protected renderHeaderPopup(popupModel: PopupBaseViewModel): JSX.Element | null {
    return null;
  }
  protected renderFooter(popuModel: PopupBaseViewModel): JSX.Element | null {
    return (
      <div className="sv-popup__body-footer">
        <SurveyActionBar model={popuModel.footerToolbar}></SurveyActionBar>
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
          this.model.clickOutside(e);
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

// replace to showDialog then delete
export function showModal(
  componentName: string,
  data: any,
  onApply: () => boolean,
  onCancel?: () => void,
  cssClass?: string,
  title?: string,
  displayMode: "popup" | "overlay" = "popup"
): PopupBaseViewModel {
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
  return showDialog(options);
}
export function showDialog(dialogOptions: IDialogOptions, rootElement?: HTMLElement): PopupBaseViewModel {
  const popupViewModel: PopupBaseViewModel = createPopupModalViewModel(dialogOptions, rootElement);
  const onVisibilityChangedCallback = (
    _: PopupBaseViewModel,
    options: { isVisible: boolean }
  ) => {
    if (!options.isVisible) {
      ReactDOM.unmountComponentAtNode(popupViewModel.container);
      popupViewModel.dispose();
    }
  };
  popupViewModel.onVisibilityChanged.add(onVisibilityChangedCallback);

  ReactDOM.render(<PopupContainer model={popupViewModel} />, popupViewModel.container);
  popupViewModel.model.isVisible = true;

  return popupViewModel;
}

settings.showModal = showModal;
settings.showDialog = showDialog;