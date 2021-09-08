import React from "react";
import { SurveyElement, doKey2ClickUp } from "survey-core";
import { SurveyElementBase } from "../../reactquestion_element";
import { TitleActions } from "./title-actions";

export class TitleElement extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }
  private get element(): SurveyElement {
    return this.props.element;
  }
  render(): JSX.Element {
    const element = this.element;
    if(!element) return null;
    let titleContent;
    let onClick = null;
    let onKeyUp = null;
    if (!element.hasTitleActions) {
      const text = SurveyElementBase.renderLocString(element.locTitle);
      titleContent = <>{text}</>;
    } else {
      onClick = () => {
        return element.toggleState();
      };
      onKeyUp = (evt: any) => {
        doKey2ClickUp(evt.nativeEvent);
      };
      titleContent = (
        <>
          <TitleActions element={element} cssClasses={element.cssClasses}></TitleActions>
        </>
      );
    }

    const CustomTag = element.titleTagName as keyof JSX.IntrinsicElements;
    return (
      <CustomTag
        className={element.cssTitle}
        aria-label={element.locTitle.renderedHtml}
        id={element.ariaTitleId}
        tabIndex={element.titleTabIndex}
        aria-expanded={element.titleAriaExpanded}
        onClick={onClick}
        onKeyUp={onKeyUp}
      >
        {titleContent}
      </CustomTag>
    );
  }
}
