import React from "react";
import { LocalizableString } from "survey-core";
import { ReactElementFactory } from "./element-factory";

export class SurveyLocStringViewer extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { changed: 0 };
  }
  private get locStr(): LocalizableString {
    return this.props.locStr;
  }
  private get style(): any {
    return this.props.style;
  }
  componentDidMount() {
    if (!this.locStr) return;
    var self = this;
    this.locStr.onChanged = function () {
      self.setState({ changed: self.state.changed + 1 });
    };
  }
  componentWillUnmount() {
    if (!this.locStr) return;
    this.locStr.onChanged = function () {};
  }
  render(): JSX.Element {
    if (!this.locStr) return null;
    if (this.locStr.hasHtml) {
      let htmlValue = { __html: this.locStr.renderedHtml };
      return <span className="sv-string-viewer" style={this.style} dangerouslySetInnerHTML={htmlValue} />;
    }
    return <span className="sv-string-viewer" style={this.style}>{this.locStr.renderedHtml}</span>;
  }
}

ReactElementFactory.Instance.registerElement(
  LocalizableString.defaultRenderer,
  (props) => {
    return React.createElement(SurveyLocStringViewer, props);
  }
);
