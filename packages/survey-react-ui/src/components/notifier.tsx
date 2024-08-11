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
    if(!this.notifier.isDisplayed) return null;

    const style = { visibility: this.notifier.active ? "visible" : "hidden" } as React.CSSProperties;

    return (
      <div className={this.notifier.css} style={style} role="alert" aria-live="polite">
        <span>{this.notifier.message}</span>
        <SurveyActionBar model={this.notifier.actionBar}></SurveyActionBar>
      </div>
    );
  }
}

ReactElementFactory.Instance.registerElement("sv-notifier", (props) => {
  return React.createElement(NotifierComponent, props);
});