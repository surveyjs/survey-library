import React from "react";
import { AdaptiveActionBarItemWrapper } from "../../../action-bar";
import { Base } from "../../../base";
import { ReactElementFactory } from "../../element-factory";
import { SurveyElementBase } from "../../reactquestion_element";
import { SvgIcon } from "../svg-icon/svg-icon";
import { ActionBarSeparator } from "./action-bar-separator";

interface IActionBarItemProps {
  item: AdaptiveActionBarItemWrapper;
}

export class ActionBarItem extends SurveyElementBase<IActionBarItemProps, any> {
  get item(): AdaptiveActionBarItemWrapper {
    return this.props.item;
  }
  protected getStateElement(): Base {
    return this.item;
  }

  render() {
    const itemClass =
      "sv-action " + (!this.item.isVisible ? "sv-action--hidden" : "");
    const separator = this.item.needSeparator ? (
      <ActionBarSeparator></ActionBarSeparator>
    ) : null;
    return (
      <span className={itemClass}>
        {separator}
        {this.renderInnerButton()}
      </span>
    );
  }

  renderInnerButton() {
    const className =
      "sv-action-bar-item " +
      this.item.innerCss +
      (this.item.active ? " sv-action-bar-item--active" : "");
    const title = this.item.tooltip || this.item.title;
    const isDisabled = this.item.enabled !== undefined && !this.item.enabled;
    const text = this.renderText();
    const svgIcon = !!this.item.iconName ? (
      <SvgIcon
        cssClasses="sv-action-bar-item__icon"
        size={24}
        iconName={this.item.iconName}
      ></SvgIcon>
    ) : null;
    const button = (
      <button
        className={className}
        disabled={isDisabled}
        onClick={() => this.item.action(this.item)}
        title={title}
      >
        {svgIcon}
        {text}
      </button>
    );

    return button;
  }

  renderText() {
    if (
      this.item.showTitle === undefined ||
      this.item.showTitle ||
      !this.item.iconName
    ) {
      var titleClass =
        "sv-action-bar-item__title " +
        (!!this.item.iconName ? "sv-action-bar-item__title--with-icon" : "");
      return <span className={titleClass}> {this.item.title}</span>;
    } else return null;
  }
}

ReactElementFactory.Instance.registerElement("sv-action-bar-item", (props) => {
  return React.createElement(ActionBarItem, props);
});
