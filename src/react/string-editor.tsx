import React from "react";
import { LocalizableString } from "survey-core";
import { ReactElementFactory } from "./element-factory";

export class SurveyLocStringEditor extends React.Component<any, any> {
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
  onInput = (event: any) => {
    this.locStr.text = event.target.innerText;
  };
  onClick = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
  };
  render(): JSX.Element {
    if (!this.locStr) {
      return null;
    }
    if (this.locStr.hasHtml) {
      const htmlValue = { __html: this.locStr.renderedHtml };
      return (
        <span
          className="sv-string-editor"
          contentEditable="true"
          suppressContentEditableWarning={true}
          style={this.style}
          dangerouslySetInnerHTML={htmlValue}
          onBlur={this.onInput}
          onClick={this.onClick}
        />
      );
    }
    return (
      <span
        className="sv-string-editor"
        contentEditable="true"
        suppressContentEditableWarning={true}
        style={this.style}
        onBlur={this.onInput}
        onClick={this.onClick}
      >
        {this.locStr.renderedHtml}
      </span>
    );
  }
}

ReactElementFactory.Instance.registerElement(
  LocalizableString.editableRenderer,
  (props) => {
    return React.createElement(SurveyLocStringEditor, props);
  }
);
