import React from "react";
import { SurveyElement, SurveyElementCore, doKey2ClickUp } from "survey-core";
import { TitleActions } from "./title-actions";
import { SvgIcon } from "../svg-icon/svg-icon";

export class TitleElement extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }
  private get element(): SurveyElement {
    return this.props.element;
  }
  renderTitleExpandableSvg() {
    if (!this.element.getCssTitleExpandableSvg()) return null;
    let iconName = this.element.isExpanded ? "icon-collapse-16x16" : "icon-expand-16x16";

    return <SvgIcon
      className={this.element.getCssTitleExpandableSvg()}
      iconName={iconName}
      size={"auto"}
    ></SvgIcon>;
  }
  render(): React.JSX.Element | any {
    const element = this.element;
    if (!element || !element.hasTitle) return null;
    const ariaLabel = element.titleAriaLabel || undefined;

    const titleExpandableSvg = this.renderTitleExpandableSvg();

    const titleContent = (
      <TitleActions
        element={element}
        cssClasses={element.cssClasses}
      ></TitleActions>
    );

    let onClick: undefined | ((e: any) => void) = undefined;
    let onKeyUp: undefined | ((e: any) => void) = undefined;
    if (element.hasTitleEvents) {
      onKeyUp = (evt: any) => {
        doKey2ClickUp(evt.nativeEvent);
      };
    }

    const CustomTag = element.titleTagName as keyof JSX.IntrinsicElements;
    return (
      <CustomTag
        className={element.cssTitle}
        id={element.ariaTitleId}
        aria-label={ariaLabel}
        tabIndex={element.titleTabIndex}
        aria-expanded={element.titleAriaExpanded}
        role={element.titleAriaRole}
        onClick={onClick}
        onKeyUp={onKeyUp}
      >
        {titleExpandableSvg}
        {titleContent}
      </CustomTag>
    );
  }
}
