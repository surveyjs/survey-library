import React from "react";
import { SurveyModel } from "survey-core";
import { ReactElementFactory } from "../../element-factory";

interface ILogoImageProps {
  data: SurveyModel;
}

export class LogoImage extends React.Component<ILogoImageProps, any> {
  constructor(props: ILogoImageProps) {
    super(props);
  }
  private get survey(): SurveyModel {
    return this.props.data;
  }
  public render() {
    const content: JSX.Element[] = [];
    content.push(
      <div key={"logo-image"} className={this.survey.logoClassNames}>
        <img
          className={this.survey.css.logoImage}
          src={this.survey.locLogo.renderedHtml}
          alt={this.survey.locTitle.renderedHtml}
          width={this.survey.logoWidth ? this.survey.logoWidth : undefined}
          height={this.survey.logoHeight ? this.survey.logoHeight : undefined}
          style={{ objectFit: this.survey.logoFit as any }}
        />
      </div>
    );
    return <>{content}</>;
  }
}

ReactElementFactory.Instance.registerElement("sv-logo-image", (props: ILogoImageProps) => {
  return React.createElement(LogoImage, props);
});
