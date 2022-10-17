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
    const requiredTextInfo = element.requiredTextInfo ? (
      this.renderRequiredTextInfo()
    ) : null;
    return (
      <div className={element.cssHeader} onClick={element.clickTitleFunction}>
        {requiredTextInfo}
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
  protected renderRequiredTextInfo(
  ): JSX.Element {
    var getSpaceSpan = (key: any) => {
      return (
        <span data-key={key} key={key}>
          &nbsp;
        </span>
      );
    };
    var spans = [];
    spans.push(
      SurveyElementBase.renderLocString(this.element.locRequiredTextInfo, null, "q_info")
    );
    spans.push(getSpaceSpan("req-sp"));
    spans.push(<span
      className={this.element.cssClasses.requiredText || this.element.cssClasses.panel.requiredText}
      aria-hidden={true}
    >
      {this.element.requiredText}
    </span>);
    return <div className={this.element.cssDescription}><>{spans}</></div>;
  }
}