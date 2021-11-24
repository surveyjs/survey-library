import * as React from "react";
import { Helpers } from "survey-core";
import { LocalizableString } from "survey-core";
import { Question } from "survey-core";
import { SurveyElement } from "survey-core";
import { ISurveyCreator } from "./reactquestion";
import { Base, ArrayChanges } from "survey-core";
import { ReactElementFactory } from "./element-factory";
import { ReactSurveyModel } from "./reactsurveymodel";

export class SurveyElementBase<P, S> extends React.Component<P, S> {
  public static renderLocString(
    locStr: LocalizableString,
    style: any = null,
    key?: string
  ): JSX.Element {
    return ReactElementFactory.Instance.createElement(locStr.renderAs, {
      locStr: locStr.renderAsData,
      style: style,
      key: key,
    });
  }
  private changedStatePropNameValue: string;
  constructor(props: any) {
    super(props);
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
    if (!this.canRender()) {
      return null;
    }

    this.startEndRendering(1);
    var res = this.renderElement();
    this.startEndRendering(-1);

    res = this.wrapElement(res);

    this.changedStatePropNameValue = undefined;
    return res;
  }
  protected wrapElement(element: JSX.Element): JSX.Element {
    return element;
  }
  protected get isRendering(): boolean {
    var stateEl: any = this.getStateElement();
    return !!stateEl && stateEl.reactRendering > 0;
  }
  protected getRenderedElement(): Base {
    return this.getStateElement();
  }
  private startEndRendering(val: number) {
    var stateEl: any = this.getRenderedElement();
    if (!!stateEl) {
      if (!stateEl.reactRendering) stateEl.reactRendering = 0;
      stateEl.reactRendering += val;
    }
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
  protected getStateElements(): Array<Base> {
    var el = this.getStateElement();
    return !!el ? [el] : [];
  }
  protected getStateElement(): Base {
    return null;
  }
  protected get isDisplayMode(): boolean {
    const props: any = this.props;
    return props.isDisplayMode || false;
  }
  protected renderLocString(
    locStr: LocalizableString,
    style: any = null
  ): JSX.Element {
    return SurveyElementBase.renderLocString(locStr, style);
  }
  private makeBaseElementReact(stateElement: Base) {
    if (!stateElement) return;
    stateElement.iteratePropertiesHash((hash, key) => {
      if (!this.canUsePropInState(key)) return;
      var val: any = hash[key];
      if (Array.isArray(val)) {
        var val: any = val;
        val["onArrayChanged"] = (arrayChanges: ArrayChanges) => {
          if (this.isRendering) return;
          this.changedStatePropNameValue = key;
          this.setState((state: any) => {
            var newState: { [index: string]: any } = {};
            newState[key] = val;
            return newState as S;
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
        if (!this.canUsePropInState(key)) return;
        if (this.isRendering) return;
        this.changedStatePropNameValue = key;
        this.setState((state: any) => {
          var newState: { [index: string]: any } = {};
          newState[key] = val;
          return newState as S;
        });
      }
    };
  }
  protected canUsePropInState(key: string): boolean {
    return true;
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

export class ReactSurveyElement extends SurveyElementBase<any, any> {
  constructor(props: any) {
    super(props);
  }
  protected get cssClasses(): any {
    return this.props.cssClasses;
  }
}

export class SurveyQuestionElementBase extends SurveyElementBase<any, any> {
  control: HTMLElement;
  constructor(props: any) {
    super(props);
  }
  componentDidUpdate(prevProps: any, prevState: any) {
    super.componentDidUpdate(prevProps, prevState);
    this.updateDomElement();
  }
  componentDidMount() {
    super.componentDidMount();
    this.updateDomElement();
  }
  componentWillUnmount() {
    super.componentWillUnmount();
    if (!!this.questionBase) {
      this.questionBase.beforeDestroyQuestionElement(this.control);
    }
  }
  protected updateDomElement() {
    const el: HTMLElement = this.control;
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
  protected getRenderedElement(): Base {
    return this.questionBase;
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
  protected get isDisplayMode(): boolean {
    const props: any = this.props;
    return (
      props.isDisplayMode ||
      (!!this.questionBase && this.questionBase.isInputReadOnly) || false
    );
  }
  protected wrapCell(
    cell: any,
    element: JSX.Element,
    reason: string
  ): JSX.Element {
    if (!reason) {
      return element;
    }
    const survey: ReactSurveyModel = this.questionBase
      .survey as ReactSurveyModel;
    let wrapper: JSX.Element;
    if (survey) {
      wrapper = survey.wrapMatrixCell(element, cell, reason);
    }
    return wrapper ?? element;
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
      this.setValueCore(event.target.value);
    }
  };
  protected setValueCore(newValue: any) {
    this.questionBase.value = newValue;
  }
  protected getValueCore(): any {
    return this.questionBase.value;
  }
  protected updateDomElement() {
    if (!!this.control) {
      const control: any = this.control;
      const newValue = this.getValueCore();
      if (!Helpers.isTwoValueEquals(newValue, control.value)) {
        control.value = this.getValue(newValue);
      }
    }
    super.updateDomElement();
  }
  private getValue(val: any): any {
    if (Helpers.isValueEmpty(val)) return "";
    return val;
  }
}
