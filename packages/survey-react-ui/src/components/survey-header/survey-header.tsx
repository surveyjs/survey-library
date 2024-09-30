import React from "react";
import { SurveyModel } from "survey-core";
import { SurveyElementBase } from "../../reactquestion_element";
import { ReactElementFactory } from "../../element-factory";
import { TitleElement } from "../title/title-element";

interface ISurveyHeaderProps {
  survey: SurveyModel;
}

export class SurveyHeader extends React.Component<ISurveyHeaderProps, any> {
  constructor(props: ISurveyHeaderProps) {
    super(props);
    this.state = { changed: 0 };
    this.rootRef = React.createRef();
  }

  private get survey(): SurveyModel {
    return this.props.survey;
  }
  private get css(): any {
    return this.survey.css;
  }
  private rootRef: React.RefObject<HTMLDivElement>;

  componentDidMount() {
    const self: SurveyHeader = this;
    this.survey.afterRenderHeader(this.rootRef.current as HTMLDivElement);
    this.survey.locLogo.onChanged = function () {
      self.setState({ changed: self.state.changed + 1 });
    };
  }
  componentWillUnmount() {
    this.survey.locLogo.onChanged = function () { };
  }

  private renderTitle(): JSX.Element | null {
    if (!this.survey.renderedHasTitle) return null;
    const description = SurveyElementBase.renderLocString(
      this.survey.locDescription
    );
    return (
      <div
        className={this.css.headerText}
        style={{ maxWidth: this.survey.titleMaxWidth }}
      >
        <TitleElement element={this.survey}></TitleElement>
        {this.survey.renderedHasDescription ? <div className={this.css.description}>{description}</div> : null}
      </div>
    );
  }

  private renderLogoImage(isRender: boolean): JSX.Element | null {
    if (!isRender) return null;
    const componentName: string = this.survey.getElementWrapperComponentName(
      this.survey,
      "logo-image"
    );
    const componentData: any = this.survey.getElementWrapperComponentData(
      this.survey,
      "logo-image"
    );
    return ReactElementFactory.Instance.createElement(componentName, {
      data: componentData,
    });
  }
  public render(): JSX.Element | null {
    if (!this.survey.renderedHasHeader) return null;
    return (
      <div className={this.css.header} ref={this.rootRef}>
        {this.renderLogoImage(this.survey.isLogoBefore)}
        {this.renderTitle()}
        {this.renderLogoImage(this.survey.isLogoAfter)}
        <div className={this.css.headerClose}></div>
      </div>
    );
  }
}

ReactElementFactory.Instance.registerElement(
  "survey-header",
  (props: ISurveyHeaderProps) => {
    return React.createElement(SurveyHeader, props);
  }
);
