import * as React from "react";
import { ItemValue } from "../itemvalue";
import { LocalizableString } from "../localizablestring";
import { QuestionBase } from "../questionbase";
import { ISurveyCreator } from "./reactquestion";

export class SurveyLocString extends React.Component<any, any> {
  private locStr: LocalizableString;
  private style: any = null;
  constructor(props: any) {
    super(props);
    this.setProperties(props);
    this.state = { changed: 0 };
  }
  componentWillReceiveProps(nextProps: any) {
    this.setProperties(nextProps);
  }
  private setProperties(props: any) {
    this.locStr = props.locStr;
    this.style = props.style;
    var self = this;
    this.locStr.onChanged = function() {
      self.setState({ changed: self.state.changed + 1 });
    };
  }
  render(): JSX.Element {
    if (!this.locStr) return null;
    if (this.locStr.hasHtml) {
      let htmlValue = { __html: this.locStr.renderedHtml };
      return <span style={this.style} dangerouslySetInnerHTML={htmlValue} />;
    }
    return <span style={this.style}>{this.locStr.renderedHtml}</span>;
  }
}

export class SurveyElementBase extends React.Component<any, any> {
  public static renderLocString(
    locStr: LocalizableString,
    style: any = null
  ): JSX.Element {
    return <SurveyLocString locStr={locStr} style={style} />;
  }
  protected isDisplayMode: boolean;
  constructor(props: any) {
    super(props);
    this.isDisplayMode = props.isDisplayMode || false;
  }
  componentWillReceiveProps(nextProps: any) {
    this.isDisplayMode = nextProps.isDisplayMode || false;
  }
  protected renderLocString(
    locStr: LocalizableString,
    style: any = null
  ): JSX.Element {
    return SurveyElementBase.renderLocString(locStr, style);
  }
}

export class ReactSurveyElement extends SurveyElementBase {
  protected cssClasses: any;
  constructor(props: any) {
    super(props);
    this.cssClasses = props.cssClasses;
  }
  componentWillReceiveProps(nextProps: any) {
    super.componentWillReceiveProps(nextProps);
    this.cssClasses = nextProps.cssClasses;
  }
}

export class SurveyQuestionElementBase extends SurveyElementBase {
  protected questionBase: QuestionBase;
  protected creator: ISurveyCreator;
  constructor(props: any) {
    super(props);
    this.questionBase = props.question;
    this.creator = props.creator;
  }
  componentWillReceiveProps(nextProps: any) {
    super.componentWillReceiveProps(nextProps);
    this.questionBase = nextProps.question;
    this.creator = nextProps.creator;
  }
  public shouldComponentUpdate(): boolean {
    return (
      !this.questionBase.customWidget ||
      !!this.questionBase.customWidgetData.isNeedRender ||
      !!this.questionBase.customWidget.widgetJson.render
    );
  }
}
