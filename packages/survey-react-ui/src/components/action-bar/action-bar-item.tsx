import React from "react";
import { Base, Action } from "survey-core";
import { ReactElementFactory } from "../../element-factory";
import { SurveyElementBase } from "../../reactquestion_element";
import { attachKey2click } from "../../reactSurvey";
import { SvgIcon } from "../svg-icon/svg-icon";
import { SurveyActionBarSeparator } from "./action-bar-separator";

interface IActionBarItemProps {
  item: Action;
  mode?: "large" | "small";
}

export class SurveyAction extends SurveyElementBase<IActionBarItemProps, any> {
  private ref: React.RefObject<any>;
  private ref2: React.RefObject<any>;
  constructor(props: any) {
    super(props);
    this.ref = React.createRef();
    this.ref2 = React.createRef();
  }
  get item() {
    return this.props.item;
  }
  protected getStateElement(): Base {
    return this.item;
  }

  shouldComponentUpdate(nextProps: any, nextState: any): boolean {
    return super.shouldComponentUpdate(nextProps, nextState);
  }

  renderElement() {
    //refactor
    const itemClass = this.item.getActionRootCss();
    const separator = this.item.needSeparator ? (
      <SurveyActionBarSeparator></SurveyActionBarSeparator>
    ) : null;

    const itemComponent = ReactElementFactory.Instance.createElement(
      this.item.component || "sv-action-bar-item",
      {
        item: this.item,
      }
    );
    const testElements = this.item.renderTest ? <>
      <div style={{ width: 0, height: 0, overflow: "hidden" }} ref={node => node && node.setAttribute("inert", "")}>
        <div style={{ width: "max-content" }} ref={this.ref}>
          {separator}
          { ReactElementFactory.Instance.createElement(
            this.item.component || "sv-action-bar-item",
            {
              item: this.item,
              mode: "large"
            }
          )}
        </div>
      </div>
      <div style={{ width: 0, height: 0, overflow: "hidden" }} ref={node => node && node.setAttribute("inert", "")}>
        <div style={{ minWidth: "max-content", width: "100%" }} ref={this.ref2}>
          {separator}
          { ReactElementFactory.Instance.createElement(
            this.item.component || "sv-action-bar-item",
            {
              item: this.item,
              mode: "small"
            }
          )}
        </div>
      </div>
    </> : null;
    return (
      <div className={itemClass} id={this.item.id}>
        <div className="sv-action__content">
          {separator}
          {itemComponent}
        </div>
        {testElements}
      </div>
    );
  }
  componentDidMount(): void {
    super.componentDidMount();
    this.item.getTestMaxElementCallback = () => this.ref.current;
    this.item.getTestMinElementCallback = () => this.ref2.current;
  }
}

export class SurveyActionBarItem extends SurveyElementBase<
  IActionBarItemProps,
  any
> {
  get item(): Action {
    return this.props.item;
  }
  protected getStateElement(): Base {
    return this.item;
  }

  renderElement() {
    return <>{this.renderInnerButton()}</>;
  }

  renderText() {
    if (!this.item.getHasTitle(this.props.mode ?? this.item.mode)) return null;
    const titleClass = this.item.getActionBarItemTitleCss();
    return <span className={titleClass}>{this.item.title}</span>;
  }

  renderButtonContent() {
    const text = this.renderText();
    const svgIcon = !!this.item.iconName ? (
      <SvgIcon
        className={this.item.cssClasses.itemIcon}
        size={this.item.iconSize}
        iconName={this.item.iconName}
        title={this.item.tooltip || this.item.title}
      ></SvgIcon>
    ) : null;
    return (
      <>
        {svgIcon}
        {text}
      </>
    );
  }

  renderInnerButton() {
    const className = this.item.getActionBarItemCss(this.props.mode ?? this.item.mode);
    const title = this.item.tooltip || this.item.title;
    const buttonContent = this.renderButtonContent();
    const tabIndex = this.item.disableTabStop ? -1 : undefined;
    const button = attachKey2click(
      <button
        className={className}
        type="button"
        disabled={this.item.disabled}
        onMouseDown={(args) => this.item.doMouseDown(args)}
        onFocus={(args) => this.item.doFocus(args)}
        onClick={(args) => this.item.doAction(args)}
        title={title}
        tabIndex={tabIndex}
        aria-checked={this.item.ariaChecked}
        aria-expanded={this.item.ariaExpanded}
        role={this.item.ariaRole}
      >
        {buttonContent}
      </button>, this.item, { processEsc: false });

    return button;
  }
}

ReactElementFactory.Instance.registerElement("sv-action-bar-item", (props) => {
  return React.createElement(SurveyActionBarItem, props);
});
