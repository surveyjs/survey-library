import * as React from "react";
import * as ReactDOM from "react-dom";
import { Base, Action } from "survey-core";
import { ReactElementFactory } from "../../element-factory";
import { SurveyElementBase } from "../../reactquestion_element";
import { attachKey2click } from "../../reactSurvey";
import { SvgIcon } from "../svg-icon/svg-icon";

interface IActionBarItemProps {
  item: Action;
}

export class SurveyBreadcrumbsItem extends SurveyElementBase<
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
    const className = this.item.getActionBarItemCss();
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

ReactElementFactory.Instance.registerElement("sv-breadcrumbs-item", (props) => {
  return React.createElement(SurveyBreadcrumbsItem, props);
});
