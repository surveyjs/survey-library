import React from "react";
import { LocalizableString } from "survey-core";
import { ReactElementFactory } from "./element-factory";

export class SurveyLocStringViewer extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.rootRef = React.createRef();
  }
  private rootRef: React.RefObject<HTMLSpanElement>;
  private get locStr(): LocalizableString {
    return this.props.locStr;
  }
  private get style(): any {
    return this.props.style;
  }
  componentDidMount() {
    this.reactOnStrChanged();
  }
  componentWillUnmount() {
    if (!this.locStr) return;
    this.locStr.onStringChanged.remove(this.onChangedHandler);
  }
  componentDidUpdate(prevProps: any, prevState: any) {
    if(!!prevProps.locStr) {
      prevProps.locStr.onStringChanged.remove(this.onChangedHandler);
    }
    this.reactOnStrChanged();
  }
  private isRendering: boolean;
  private onChangedHandler = (sender: any, options: any) => {
    if(this.isRendering) return;
    this.setState({ changed: !!this.state && this.state.changed ? this.state.changed + 1 : 1 });
  }
  private reactOnStrChanged() {
    if (!this.locStr) return;
    this.locStr.onStringChanged.add(this.onChangedHandler);
  }
  render(): JSX.Element | null {
    if (!this.locStr) return null;
    this.isRendering = true;
    const strEl = this.renderString();
    this.isRendering = false;
    return strEl;
  }
  protected renderString(): JSX.Element {
    const className = this.locStr.allowLineBreaks ? "sv-string-viewer sv-string-viewer--multiline" : "sv-string-viewer";
    if (this.locStr.hasHtml) {
      let htmlValue = { __html: this.locStr.renderedHtml };
      return <span ref={this.rootRef} className={className} style={this.style} dangerouslySetInnerHTML={htmlValue} />;
    }
    return <span ref={this.rootRef} className={className} style={this.style}>{this.locStr.renderedHtml}</span>;
  }
}

ReactElementFactory.Instance.registerElement(
  LocalizableString.defaultRenderer,
  (props) => {
    return React.createElement(SurveyLocStringViewer, props);
  }
);
