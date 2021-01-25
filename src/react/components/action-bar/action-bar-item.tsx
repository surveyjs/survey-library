import React from "react";
import { ReactElementFactory } from "../../element-factory";
import { SvgIcon } from "../svg-icon/svg-icon";

export class ActionBarItem extends React.Component<any, any> {
  get item() {
    return this.props.item;
  }
  render() {
    const className =
      "sv-action-bar-item " +
      this.item.innerCss +
      (this.item.isActive ? " sv-action-bar-item--active" : "");
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
        onClick={this.item.action}
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
      this.item.iconName
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
