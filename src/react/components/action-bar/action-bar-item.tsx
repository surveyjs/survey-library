import React from "react";
import { AdaptiveActionBarItemWrapper } from "survey-core";
import { Base, Action } from "survey-core";
import { ReactElementFactory } from "../../element-factory";
import { SurveyElementBase } from "../../reactquestion_element";
import { SvgIcon } from "../svg-icon/svg-icon";
import { SurveyActionBarSeparator } from "./action-bar-separator";

interface IActionBarItemProps {
  item: Action;
}

export class SurveyAction extends SurveyElementBase<
  IActionBarItemProps,
  any
> {
  get item() {
    return this.props.item;
  }
  protected getStateElement(): Base {
    return this.item;
  }

  render() {
    const itemClass =
      "sv-action " +
      this.item.css +
      (!this.item.isVisible ? " sv-action--hidden" : "");
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
        {separator}
        {itemComponent}
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

  render() {
    return <>{this.renderInnerButton()}</>;
  }

  renderText() {
    if (this.item.hasTitle) {
      var titleClass =
        "sv-action-bar-item__title " +
        (!!this.item.iconName ? "sv-action-bar-item__title--with-icon" : "");
      return <span className={titleClass}> {this.item.title}</span>;
    } else return null;
  }

  renderButtonContent() {
    const text = this.renderText();
    const svgIcon = !!this.item.iconName ? (
      <SvgIcon
        className="sv-action-bar-item__icon"
        size={24}
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
    const className =
      "sv-action-bar-item " +
      this.item.innerCss +
      (this.item.active ? " sv-action-bar-item--active" : "");
    const title = this.item.tooltip || this.item.title;
    const buttonContent = this.renderButtonContent();
    const button = (
      <button
        className={className}
        disabled={this.item.disabled}
        onClick={() => this.item.action(this.item)}
        title={title}
      >
        {buttonContent}
      </button>
    );

    return button;
  }
}

ReactElementFactory.Instance.registerElement(
  "sv-action-bar-item",
  (props) => {
    return React.createElement(SurveyActionBarItem, props);
  }
);
