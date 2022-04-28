import React from "react";
import { PanelModel } from "../panel";
import { Question } from "../question";
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
      ? this.renderDescription()
      : null;
    return (
      <div className={element.cssHeader} onClick={element.clickTitleFunction}>
        {title}
        {description}
      </div>
    );
  }
  protected renderDescription(
  ): JSX.Element {
    var descriptionText = SurveyElementBase.renderLocString(
      this.element.locDescription
    );
    return <div className={this.element.cssDescription}>{descriptionText}</div>;
  }
}