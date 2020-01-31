import * as React from "react";
import { Helpers } from "../helpers";
import { LocalizableString } from "../localizablestring";
import { Question } from "../question";
import { ISurveyCreator } from "./reactquestion";
import { Base } from "../base";

export class SurveyLocString extends React.Component<any, any> {
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
  constructor(props: any) {
    super(props);
  }
  componentDidMount() {
    this.makeBaseElementReact();
  }
  componentWillUnmount() {
    this.unMakeBaseElementReact();
  }
  componentDidUpdate(prevProps: any, prevState: any) {
    this.makeBaseElementReact();
  }
  protected getStateElement(): Base {
    return null;
  }
  protected get isDisplayMode(): boolean {
    return this.props.isDisplayMode || false;
  }
  protected renderLocString(
    locStr: LocalizableString,
    style: any = null
  ): JSX.Element {
    return SurveyElementBase.renderLocString(locStr, style);
  }
  protected makeBaseElementReact() {
    var stateElement = this.getStateElement();
    if (!stateElement) return;
    stateElement.iteratePropertiesHash((hash, key) => {
      var val: any = hash[key];
      if (Array.isArray(val)) {
        var val: any = val;
        val["onArrayChanged"] = () =>
          this.setState((state: any) => {
            var newState: { [index: string]: any } = {};
            newState[key] = val;
            return newState;
          });
      }
    });
    stateElement.setPropertyValueCoreHandler = (
      hash: any,
      key: string,
      val: any
    ) => {
      if (hash[key] !== val) {
        hash[key] = val;
        this.setState((state: any) => {
          var newState: { [index: string]: any } = {};
          newState[key] = val;
          return newState;
        });
      }
    };
  }
  protected unMakeBaseElementReact() {
    var stateElement = this.getStateElement();
    if (!stateElement) return;
    stateElement.setPropertyValueCoreHandler = undefined;
    stateElement.iteratePropertiesHash((hash, key) => {
      var val: any = hash[key];
      if (Array.isArray(val)) {
        var val: any = val;
        val["onArrayChanged"] = () => {};
      }
    });
  }
}

export class ReactSurveyElement extends SurveyElementBase {
  constructor(props: any) {
    super(props);
  }
  protected get cssClasses(): any {
    return this.props.cssClasses;
  }
}

export class SurveyQuestionElementBase extends SurveyElementBase {
  constructor(props: any) {
    super(props);
  }
  protected get questionBase(): Question {
    return this.props.question;
  }
  protected get creator(): ISurveyCreator {
    return this.props.creator;
  }
  public shouldComponentUpdate(): boolean {
    return (
      !this.questionBase.customWidget ||
      !!this.questionBase.customWidgetData.isNeedRender ||
      !!this.questionBase.customWidget.widgetJson.isDefaultRender ||
      !!this.questionBase.customWidget.widgetJson.render
    );
  }
}

export class SurveyQuestionUncontrolledElement<
  T extends Question
> extends SurveyQuestionElementBase {
  control: any;
  constructor(props: any) {
    super(props);
    this.updateValueOnEvent = this.updateValueOnEvent.bind(this);
  }
  protected get question(): T {
    return this.questionBase as T;
  }
  getSnapshotBeforeUpdate(prevProps: any, prevState: any): any {
    if (!!this.control) {
      this.control.value = this.getValue(this.questionBase.value);
    }
    return null;
  }
  componentDidMount() {
    if (!!this.control) {
      this.control.value = this.getValue(this.questionBase.value);
    }
  }
  updateValueOnEvent = (event: any) => {
    this.questionBase.value = event.target.value;
  };
  private getValue(val: any): any {
    if (Helpers.isValueEmpty(val)) return "";
    return val;
  }
}
