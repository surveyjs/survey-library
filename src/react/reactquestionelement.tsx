import * as React from "react";
import { ItemValue } from "../itemvalue";
import { LocalizableString } from "../localizablestring";
import { QuestionBase } from "../questionbase";
import { ISurveyCreator } from "./reactquestion";

export class SurveyElementBase extends React.Component<any, any> {
  public static renderLocString(
    locStr: LocalizableString,
    style: any = null
  ): JSX.Element {
    if (locStr.hasHtml) {
      let htmlValue = { __html: locStr.renderedHtml };
      return <span style={style} dangerouslySetInnerHTML={htmlValue} />;
    }
    return <span style={style}>{locStr.renderedHtml}</span>;
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
