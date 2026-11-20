import * as React from "react";
import { SurveyModel } from "survey-core";
import { ReactElementFactory } from "../../element-factory";
import { SurveyElementBase } from "../../reactquestion_element";

interface ILogoImageProps {
  data: SurveyModel;
}

export class LogoImage extends SurveyElementBase<ILogoImageProps, any> {
  constructor(props: ILogoImageProps) {
    super(props);
  }
  private get survey(): SurveyModel {
    return this.props.data;
  }
  public renderElement() {
    const content: React.JSX.Element[] = [];
    content.push(
      <div key={"logo-image"} className={this.survey.logoClassNames}>
        <img
          className={this.survey.css.logoImage}
          src={this.survey.renderedLogoURL || null}
          alt={this.survey.locTitle.renderedHtml}
          width={this.survey.renderedLogoWidth}
          height={this.survey.renderedLogoHeight}
          style={{ objectFit: this.survey.logoFit as any, width: this.survey.renderedStyleLogoWidth, height: this.survey.renderedStyleLogoHeight }}
        />
      </div>
    );
    return <>{content}</>;
  }
}

ReactElementFactory.Instance.registerElement("sv-logo-image", (props: ILogoImageProps) => {
  return React.createElement(LogoImage, props);
});
