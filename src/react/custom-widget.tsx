import * as React from "react";
import { SurveyQuestionElementBase } from "./reactquestionelement";

export class SurveyCustomWidget extends SurveyQuestionElementBase {
  constructor(props: any) {
    super(props);
  }
  private _afterRender() {
    if (this.questionBase.customWidget) {
      let el = this.refs["widget"];
      if (!!el) {
        this.questionBase.customWidget.afterRender(this.questionBase, el);
        this.questionBase.customWidgetData.isNeedRender = false;
      }
    }
  }
  componentDidMount() {
    super.componentDidMount();
    if (this.questionBase) {
      this._afterRender();
    }
  }
  componentDidUpdate(prevProps: any, prevState: any) {
    super.componentDidUpdate(prevProps, prevState);
    var isDefaultRender =
      !!this.questionBase.customWidget &&
      this.questionBase.customWidget.isDefaultRender;
    if (this.questionBase && !isDefaultRender) {
      this._afterRender();
    }
  }
  componentWillUnmount() {
    super.componentWillUnmount();
    if (this.questionBase.customWidget) {
      let el = this.refs["widget"];
      if (!!el) {
        this.questionBase.customWidget.willUnmount(this.questionBase, el);
      }
    }
  }
  render(): JSX.Element {
    if (!this.questionBase || !this.creator) {
      return null;
    }
    if (!this.questionBase.visible) {
      return null;
    }

    let customWidget = this.questionBase.customWidget;

    if (customWidget.isDefaultRender) {
      return (
        <div ref="widget">
          {this.creator.createQuestionElement(this.questionBase)}
        </div>
      );
    }

    let widget = null;
    if (customWidget.widgetJson.render) {
      widget = customWidget.widgetJson.render(this.questionBase);
    } else {
      if (customWidget.htmlTemplate) {
        let htmlValue = { __html: customWidget.htmlTemplate };
        return <div ref="widget" dangerouslySetInnerHTML={htmlValue} />;
      }
    }
    return <div ref="widget">{widget}</div>;
  }
}
