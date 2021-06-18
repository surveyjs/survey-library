import React from "react";
import { SurveyModel } from "survey-core";
import { SurveyElementBase } from "../../reactquestion_element";
import { ReactElementFactory } from "../../element-factory";

interface ISurveyHeaderProps {
  survey: SurveyModel;
}

export class SurveyHeader extends React.Component<ISurveyHeaderProps, any> {
  constructor(props: ISurveyHeaderProps) {
    super(props);
    this.state = { changed: 0 };
  }

  private get survey(): SurveyModel {
    return this.props.survey;
  }
  private get css(): any {
    return this.survey.css;
  }
  
  componentDidMount() {
    const self: SurveyHeader = this;
    this.survey.locLogo.onChanged = function () {
      self.setState({ changed: self.state.changed + 1 });
    };
  }
  componentWillUnmount() {
    this.survey.locLogo.onChanged = function () {};
  }


  private renderTitle(): JSX.Element {
    let title: JSX.Element = null;
    let description: JSX.Element = null;
    if (this.survey.title && this.survey.showTitle || this.survey.isDesignMode) {
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

  private renderLogoImage(isRender: boolean): JSX.Element {
    if (!isRender) return null;
    const componentName: string = this.survey.getElementWrapperComponentName(this.survey, "logo-image");
    const componentData: any = this.survey.getElementWrapperComponentData(this.survey, "logo-image");
    return ReactElementFactory.Instance.createElement(componentName, { data: componentData });
  }

  public render(): JSX.Element {
    if ((!this.survey.title || !this.survey.showTitle) &&
      !this.survey.hasLogo && !this.survey.isDesignMode) {
      return null;
    }
    return (
      <div className={this.css.header}>
        {this.renderLogoImage(this.survey.isLogoBefore)}
        {this.renderTitle()}
        {this.renderLogoImage(this.survey.isLogoAfter)}
      </div>
    );
  }
}

ReactElementFactory.Instance.registerElement("survey-header", (props: ISurveyHeaderProps) => {
  return React.createElement(SurveyHeader, props);
});
