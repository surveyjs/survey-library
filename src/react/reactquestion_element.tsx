import * as React from "react";
import { Helpers } from "../helpers";
import { LocalizableString } from "../localizablestring";
import { Question } from "../question";
import { ISurveyCreator } from "./reactquestion";
import { Base, ITitleOwner, ArrayChanges } from "../base";

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
      return <span style={this.style} dangerouslySetInnerHTML={htmlValue} />;
    }
    return <span style={this.style}>{this.locStr.renderedHtml}</span>;
  }
}

export class SurveyElementBase extends React.Component<any, any> {
  public static renderLocString(
    locStr: LocalizableString,
    style: any = null,
    key?: string
  ): JSX.Element {
    return <SurveyLocString locStr={locStr} style={style} key={key} />;
  }
  private isRenderingValue: boolean;
  private changedStatePropNameValue: string;
  private nonStateProps: Array<string> = [];
  constructor(props: any) {
    super(props);
    this.modifyNonStateProps(this.nonStateProps);
  }
  componentDidMount() {
    this.makeBaseElementsReact();
  }
  componentWillUnmount() {
    this.unMakeBaseElementsReact();
  }
  componentDidUpdate(prevProps: any, prevState: any) {
    this.makeBaseElementsReact();
  }
  render(): JSX.Element {
    if (!this.canRender()) return null;
    this.isRenderingValue = true;
    var res = this.renderElement();
    this.isRenderingValue = false;
    this.changedStatePropNameValue = undefined;
    return res;
  }
  protected get isRendering(): boolean {
    return this.isRenderingValue;
  }
  protected canRender(): boolean {
    return true;
  }
  protected renderElement(): JSX.Element {
    return null;
  }
  protected get changedStatePropName(): string {
    return this.changedStatePropNameValue;
  }
  private makeBaseElementsReact() {
    var els = this.getStateElements();
    for (var i = 0; i < els.length; i++) {
      this.makeBaseElementReact(els[i]);
    }
  }
  private unMakeBaseElementsReact() {
    var els = this.getStateElements();
    for (var i = 0; i < els.length; i++) {
      this.unMakeBaseElementReact(els[i]);
    }
  }
  protected modifyNonStateProps(nonStateProps: Array<string>) {}
  protected getStateElements(): Array<Base> {
    var el = this.getStateElement();
    return !!el ? [el] : [];
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

  private titleKeyIndex = 0;
  private titleKeyPrefix = "-titleKey-";
  private getTitleKey = (element: ITitleOwner) => {
    this.titleKeyIndex++;
    return element.name + this.titleKeyPrefix + this.titleKeyIndex;
  };
  protected renderTitleSpans(element: ITitleOwner, cssClasses: any) {
    var getSpaceSpan = () => {
      return (
        <span
          data-key={this.getTitleKey(element)}
          key={this.getTitleKey(element)}
        >
          &nbsp;
        </span>
      );
    };
    var spans = [];
    if (element.isRequireTextOnStart) {
      spans.push(this.renderRequireText(element, cssClasses));
      spans.push(getSpaceSpan());
    }
    var questionNumber = element.no;
    if (questionNumber) {
      spans.push(
        <span
          data-key={this.getTitleKey(element)}
          key={this.getTitleKey(element)}
          className={cssClasses.number}
          style={{ position: "static" }}
          aria-hidden={true}
        >
          {questionNumber}
        </span>
      );
      spans.push(getSpaceSpan());
    }
    if (element.isRequireTextBeforeTitle) {
      spans.push(this.renderRequireText(element, cssClasses));
      spans.push(getSpaceSpan());
    }
    spans.push(
      SurveyElementBase.renderLocString(
        element.locTitle,
        null,
        this.getTitleKey(element)
      )
    );
    if (element.isRequireTextAfterTitle) {
      spans.push(getSpaceSpan());
      spans.push(this.renderRequireText(element, cssClasses));
    }
    return spans;
  }
  private renderRequireText(
    element: ITitleOwner,
    cssClasses: any
  ): JSX.Element {
    return (
      <span
        data-key={this.getTitleKey(element)}
        key={this.getTitleKey(element)}
        className={cssClasses.requiredText || cssClasses.panel.requiredText}
        aria-hidden={true}
      >
        {element.requiredText}
      </span>
    );
  }
  private makeBaseElementReact(stateElement: Base) {
    if (!stateElement) return;
    stateElement.iteratePropertiesHash((hash, key) => {
      if (this.nonStateProps.indexOf(key) > -1) return;
      var val: any = hash[key];
      if (Array.isArray(val)) {
        var val: any = val;
        val["onArrayChanged"] = (arrayChanges: ArrayChanges) => {
          if (this.isRendering) return;
          this.changedStatePropNameValue = key;
          this.setState((state: any) => {
            var newState: { [index: string]: any } = {};
            newState[key] = val;
            return newState;
          });
        };
      }
    });
    stateElement.setPropertyValueCoreHandler = (
      hash: any,
      key: string,
      val: any
    ) => {
      if (hash[key] !== val) {
        hash[key] = val;
        if (this.isRendering) return;
        this.changedStatePropNameValue = key;
        this.setState((state: any) => {
          var newState: { [index: string]: any } = {};
          newState[key] = val;
          return newState;
        });
      }
    };
  }
  private unMakeBaseElementReact(stateElement: Base) {
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
  control: any;
  constructor(props: any) {
    super(props);
  }
  componentDidUpdate(prevProps: any, prevState: any) {
    super.componentDidUpdate(prevProps, prevState);
    this.updateDomElement();
  }
  componentDidMount() {
    this.updateDomElement();
  }
  componentWillUnmount() {
    super.componentWillUnmount();
    if (!!this.questionBase) {
      this.questionBase.beforeDestroyQuestionElement(this.control);
    }
  }
  protected updateDomElement() {
    var el = this.control;
    if (!!el) {
      if (el.getAttribute("data-rendered") !== "r") {
        el.setAttribute("data-rendered", "r");
        this.questionBase.afterRenderQuestionElement(el);
      }
    }
  }
  protected get questionBase(): Question {
    return this.props.question;
  }
  protected get creator(): ISurveyCreator {
    return this.props.creator;
  }
  protected canRender(): boolean {
    return !!this.questionBase && !!this.creator;
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
  constructor(props: any) {
    super(props);
    this.updateValueOnEvent = this.updateValueOnEvent.bind(this);
  }
  protected get question(): T {
    return this.questionBase as T;
  }
  updateValueOnEvent = (event: any) => {
    if (
      !Helpers.isTwoValueEquals(this.questionBase.value, event.target.value)
    ) {
      this.questionBase.value = event.target.value;
    }
  };
  protected updateDomElement() {
    if (!!this.control) {
      this.control.value = this.getValue(this.questionBase.value);
    }
    super.updateDomElement();
  }
  private getValue(val: any): any {
    if (Helpers.isValueEmpty(val)) return "";
    return val;
  }
}
