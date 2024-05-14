import React from "react";
import { Question, PanelModel, QuestionPanelDynamicModel } from "survey-core";
import { SurveyActionBar } from "./components/action-bar/action-bar";
import { TitleElement } from "./components/title/title-element";
import { SurveyElementBase } from "./reactquestion_element";

export class SurveyElementHeader extends React.Component<any, any> {
  private get element(): Question | PanelModel {
    return this.props.element;
  }
  public render(): JSX.Element {
    const element = this.element;
    const title = element.hasTitle ? (
      <TitleElement element={element}></TitleElement>
    ) : null;
    const description = element.hasDescriptionUnderTitle
      ? SurveyElementBase.renderQuestionDescription(this.element)
      : null;

    const additionalTitleToolbarElement = element.hasAdditionalTitleToolbar ? <SurveyActionBar model={element.additionalTitleToolbar}></SurveyActionBar> : null;

    return (
      <div className={element.cssHeader} onClick={(e) => element.clickTitleFunction && element.clickTitleFunction(e.nativeEvent)}>
        {title}
        {description}
        {additionalTitleToolbarElement}
      </div>
    );
  }
}