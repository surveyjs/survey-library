import React from "react";
import { Base, Notifier } from "survey-core";
import { SurveyElementBase } from "../reactquestion_element";
import { ReactElementFactory } from "../element-factory";

export interface INotifierComponentProps {
  notifier: Notifier;
}

export class NotifierComponent extends SurveyElementBase<INotifierComponentProps, any> {
  get notifier(): Notifier {
    return this.props.notifier;
  }
  protected getStateElement(): Base {
    return this.notifier;
  }

  renderElement(): JSX.Element | null {
    if (!this.notifier.active) {
      return null;
    }
    return (
      <div className={this.notifier.css}>
        <span>{this.notifier.message}</span>
      </div>
    );
  }
}

ReactElementFactory.Instance.registerElement("sv-notifier", (props) => {
  return React.createElement(NotifierComponent, props);
});