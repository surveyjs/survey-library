import React from "react";
import { Base, SurveyModel, Cover, CoverCell } from "survey-core";
import { SurveyElementBase } from "../reactquestion_element";
import { ReactElementFactory } from "../element-factory";
import { TitleElement } from "./title/title-element";

export interface ILayoutElementProps<T = Base> {
  survey: SurveyModel;
  model: T;
}

export class HeaderMobile extends React.Component<any, any> {
  get model(): Cover {
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
    return (<div className="sv-header--mobile">
      {this.model.survey.hasLogo ? (<div className="sv-header__logo">
        {this.renderLogoImage()}
      </div>) : null}
      {this.model.survey.hasTitle ? (<div className="sv-header__title" style={{ maxWidth: this.model.textAreaWidth }}>
        {/* {ReactElementFactory.Instance.createElement("survey-element-title", { element: this.model.survey })} */}
        <TitleElement element={this.model.survey}/>
      </div>) : null}
      {this.model.survey.renderedHasDescription ? (<div className="sv-header__description" style={{ maxWidth: this.model.textAreaWidth }}>
        <div className={this.model.survey.css.description}>
          {SurveyElementBase.renderLocString(this.model.survey.locDescription)}
        </div>
      </div>) : null}
    </div>);
  }
}

export class HeaderCell extends React.Component<any, any> {
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
      <div className="sv-header__cell-content" style={this.model.contentStyle}>
        {this.model.showLogo ? (<div className="sv-header__logo">
          {this.renderLogoImage()}
        </div>) : null}
        {this.model.showTitle ? (<div className="sv-header__title" style={{ maxWidth: this.model.textAreaWidth }}>
          {/* {ReactElementFactory.Instance.createElement("survey-element-title", { element: this.model.survey })} */}
          <TitleElement element={this.model.survey}/>
        </div>) : null}
        {this.model.showDescription ? (<div className="sv-header__description" style={{ maxWidth: this.model.textAreaWidth }}>
          <div className={this.model.survey.css.description}>
            {SurveyElementBase.renderLocString(this.model.survey.locDescription)}
          </div>
        </div>) : null}
      </div>
    </div>);
  }
}

export class Header extends SurveyElementBase<ILayoutElementProps<Cover>, any> {
  get model(): Cover {
    return this.props.model;
  }
  protected getStateElement(): Base {
    return this.model;
  }

  renderElement(): JSX.Element | null {
    this.model.survey = this.props.survey;

    if(!(this.props.survey.headerView === "advanced")) {
      return null;
    }

    let headerContent: JSX.Element | null = null;
    if(this.props.survey.isMobile) {
      headerContent = <HeaderMobile model={this.model}/>;
    } else {
      headerContent = (<div className={this.model.contentClasses} style={{ maxWidth: this.model.maxWidth }}>
        {this.model.cells.map((cell, index) => <HeaderCell key={index} model={cell}/>)}
      </div>);
    }

    return (
      <div className={this.model.headerClasses} style={{ height: this.model.renderedHeight }}>
        {this.model.backgroundImage ? <div style={this.model.backgroundImageStyle} className={this.model.backgroundImageClasses}></div> : null}
        {headerContent}
      </div>
    );
  }
}

ReactElementFactory.Instance.registerElement("sv-header", (props) => {
  return React.createElement(Header, props);
});