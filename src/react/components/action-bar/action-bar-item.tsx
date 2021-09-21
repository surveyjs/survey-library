import React from "react";
import { Base, Action } from "survey-core";
import { ReactElementFactory } from "../../element-factory";
import { SurveyElementBase } from "../../reactquestion_element";
import { attachKey2click } from "../../reactSurvey";
import { SvgIcon } from "../svg-icon/svg-icon";
import { SurveyActionBarSeparator } from "./action-bar-separator";

interface IActionBarItemProps {
  item: Action;
}

export class SurveyAction extends SurveyElementBase<IActionBarItemProps, any> {
  get item() {
    return this.props.item;
  }
  protected getStateElement(): Base {
    return this.item;
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
    return (
      <span className={itemClass} id={this.item.id}>
        <div className="sv-action__content">
          {separator}
          {itemComponent}
        </div>
      </span>
    );
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
    if (!this.item.hasTitle) return null;
    const titleClass = this.item.getActionBarItemCss();
    return <span className={titleClass}> {this.item.title}</span>;
  }

  renderButtonContent() {
    const text = this.renderText();
    const svgIcon = !!this.item.iconName ? (
      <SvgIcon
        className="sv-action-bar-item__icon"
        size={this.item.iconSize}
        iconName={this.item.iconName}
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
    const className = this.item.getActionBarItemActiveCss();
    const title = this.item.tooltip || this.item.title;
    const buttonContent = this.renderButtonContent();
    const tabIndex = this.item.disableTabStop ? -1 : undefined;
    const button = attachKey2click(
      <button
        className={className}
        type="button"
        disabled={this.item.disabled}
        onClick={() => this.item.action(this.item)}
        title={title}
        tabIndex={tabIndex}
      >
        {buttonContent}
      </button>, null, { processEsc: false });

    return button;
  }
}

ReactElementFactory.Instance.registerElement("sv-action-bar-item", (props) => {
  return React.createElement(SurveyActionBarItem, props);
});
