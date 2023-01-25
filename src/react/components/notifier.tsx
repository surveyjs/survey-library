import React from "react";
import { Base, Notifier } from "survey-core";
import { SurveyElementBase } from "../reactquestion_element";
import { ReactElementFactory } from "../element-factory";
import { SurveyActionBar } from "./action-bar/action-bar";

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
    const style = { display: this.notifier.active ? "" : "none" };

    return (
      <div className={this.notifier.css} style={style}>
        <span>{this.notifier.message}</span>
        <SurveyActionBar model={this.notifier.actionBar}></SurveyActionBar>
      </div>
    );
  }
}

ReactElementFactory.Instance.registerElement("sv-notifier", (props) => {
  return React.createElement(NotifierComponent, props);
});