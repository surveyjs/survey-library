import React from "react";
import { ReactElementFactory } from "../../element-factory";

export class SurveyActionBarSeparator extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }
  render() {
    var className = `sv-action-bar-separator ${this.props.cssClasses}`;
    return <div className={className}></div>;
  }
}
ReactElementFactory.Instance.registerElement(
  "sv-action-bar-separator",
  (props) => {
    return React.createElement(SurveyActionBarSeparator, props);
  }
);
