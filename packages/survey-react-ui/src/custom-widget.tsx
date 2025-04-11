import * as React from "react";
import { SurveyQuestionElementBase } from "./reactquestion_element";

export class SurveyCustomWidget extends SurveyQuestionElementBase {
  private widgetRef: React.RefObject<HTMLDivElement>;
  constructor(props: any) {
    super(props);
    this.widgetRef = React.createRef();
  }
  private _afterRender() {
    if (this.questionBase.customWidget) {
      let el = this.widgetRef.current;
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
      let el = this.widgetRef.current;
      if (!!el) {
        this.questionBase.customWidget.willUnmount(this.questionBase, el);
      }
    }
  }
  protected canRender(): boolean {
    return super.canRender() && this.questionBase.visible;
  }
  protected renderElement(): React.JSX.Element {
    let customWidget = this.questionBase.customWidget;

    if (customWidget.isDefaultRender) {
      return (
        <div ref={this.widgetRef}>
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
        return <div ref={this.widgetRef} dangerouslySetInnerHTML={htmlValue} />;
      }
    }
    return <div ref={this.widgetRef}>{widget}</div>;
  }
}
