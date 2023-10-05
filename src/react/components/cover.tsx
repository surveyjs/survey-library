import React from "react";
import { Base, SurveyModel, Cover, CoverCell } from "survey-core";
import { SurveyElementBase } from "../reactquestion_element";
import { ReactElementFactory } from "../element-factory";
import { TitleElement } from "./title/title-element";

export interface ILayoutElementProps<T = Base> {
  survey: SurveyModel;
  model: T;
}

export class CoverCellComponent extends React.Component<any, any> {
  get model(): CoverCell {
    return this.props.model;
  }
  private renderLogoImage(): JSX.Element | null {
    const componentName: string = this.model.survey.getElementWrapperComponentName(
      this.model.survey,
      "logo-image"
    );
    const componentData: any = this.model.survey.getElementWrapperComponentData(
      this.model.survey,
      "logo-image"
    );
    return ReactElementFactory.Instance.createElement(componentName, {
      data: componentData,
    });
  }

  render(): JSX.Element | null {
    return (<div className={this.model.css} style={this.model.style}>
      <div className="sv-cover__cell-content" style={this.model.contentStyle}>
        {this.model.showLogo ? (<div className="sv-cover__logo">
          {this.renderLogoImage()}
        </div>) : null}
        {this.model.showTitle ? (<div className="sv-cover__title" style={{ maxWidth: this.model.textAreaWidth }}>
          {/* {ReactElementFactory.Instance.createElement("survey-element-title", { element: this.model.survey })} */}
          <TitleElement element={this.model.survey}/>
        </div>) : null}
        {this.model.showDescription ? (<div className="sv-cover__description" style={{ maxWidth: this.model.textAreaWidth }}>
          <h5 className={this.model.survey.css.description}>
            {SurveyElementBase.renderLocString(this.model.survey.locDescription)}
          </h5>
        </div>) : null}
      </div>
    </div>);
  }
}

export class CoverComponent extends SurveyElementBase<ILayoutElementProps<Cover>, any> {
  get model(): Cover {
    return this.props.model;
  }
  protected getStateElement(): Base {
    return this.model;
  }

  renderElement(): JSX.Element | null {
    this.model.survey = this.props.survey;

    if(!(this.props.survey.headerView === "advanced" && this.props.survey.renderedHasHeader)) {
      return null;
    }

    return (
      <div className={this.model.coverClasses} style={{ height: this.model.renderedHeight }}>
        {this.model.backgroundImage ? <div style={this.model.backgroundImageStyle} className={this.model.backgroundImageClasses}></div> : null}
        <div className={this.model.contentClasses}>
          {this.model.cells.map((cell, index) => <CoverCellComponent key={index} model={cell}/>)}
        </div>
      </div>
    );
  }
}

ReactElementFactory.Instance.registerElement("sv-cover", (props) => {
  return React.createElement(CoverComponent, props);
});