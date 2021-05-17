import React from "react";
import { SurveyModel } from "survey-core";
import { SurveyElementBase } from "../../reactquestion_element";
import { ReactElementFactory } from "../../element-factory";

interface ISurveyHeaderProps {
  survey: SurveyModel;
}

export class SurveyHeader extends React.Component<ISurveyHeaderProps, any> {
  private get survey(): SurveyModel {
    return this.props.survey;
  }
  private get css(): any {
    return this.survey.css;
  }
  
  private renderTitle(): JSX.Element {
    let title: JSX.Element = null;
    let description: JSX.Element = null;
    if (this.survey.title && this.survey.showTitle) {
      title = SurveyElementBase.renderLocString(this.survey.locTitle);
      description = SurveyElementBase.renderLocString(this.survey.locDescription);
    }
    return title ? (
      <div className={this.css.headerText} style={{ maxWidth: this.survey.titleMaxWidth }}>
        <h3 className={this.css.title}>{title}</h3>
        <h5 className={this.css.description}>{description}</h5>
      </div>
    ) : null;
  }

  public render(): JSX.Element {
    if ((!this.survey.title || !this.survey.showTitle) && !this.survey.hasLogo) {
      return null;
    }
    const title: JSX.Element = this.renderTitle();
    const style: any = { objectFit: this.survey.logoFit };
    let imageBefore: JSX.Element = null;
    const imageAfter: JSX.Element[] = [];
    if (this.survey.isLogoBefore) {
      imageBefore = (
        <div className={this.survey.logoClassNames}>
          <img
            className={this.survey.css.logoImage}
            src={this.survey.locLogo.renderedHtml}
            alt={this.survey.locTitle.renderedHtml}
            width={this.survey.logoWidth ? this.survey.logoWidth : undefined}
            height={
              this.survey.logoHeight ? this.survey.logoHeight : undefined
            }
            style={style}
          />
        </div>
      );
    }
    if (this.survey.isLogoAfter) {
      imageAfter.push(
        <div className={this.survey.logoClassNames}>
          <img
            className={this.survey.css.logoImage}
            src={this.survey.locLogo.renderedHtml}
            alt={this.survey.locTitle.renderedHtml}
            width={this.survey.logoWidth ? this.survey.logoWidth : undefined}
            height={
              this.survey.logoHeight ? this.survey.logoHeight : undefined
            }
            style={style}
          />
        </div>
      );
      imageAfter.push(<div className="sv-logo--right-tail"></div>);
    }
    return (
      <div className={this.css.header}>
        {imageBefore}
        {title}
        {imageAfter}
      </div>
    );
  }
}

ReactElementFactory.Instance.registerElement("survey-header", (props: ISurveyHeaderProps) => {
  return React.createElement(SurveyHeader, props);
});
