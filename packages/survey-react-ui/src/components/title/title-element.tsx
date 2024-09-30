import React from "react";
import { SurveyElementCore, doKey2ClickUp } from "survey-core";
import { TitleActions } from "./title-actions";

export class TitleElement extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }
  private get element(): SurveyElementCore {
    return this.props.element;
  }
  render(): JSX.Element | any {
    const element = this.element;
    if (!element || !element.hasTitle) return null;
    const ariaLabel = element.titleAriaLabel || undefined;
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
        {titleContent}
      </CustomTag>
    );
  }
}
