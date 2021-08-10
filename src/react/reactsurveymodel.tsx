import { SurveyModel, QuestionMatrixDropdownRenderedCell, SurveyWindowModel, SurveyElement, QuestionRowModel, ItemValue, QuestionSelectBase } from "survey-core";
import { ReactElementFactory } from "./element-factory";

export class ReactSurveyModel extends SurveyModel {
  renderCallback: () => void;
  constructor(jsonObj: any = null) {
    super(jsonObj);
  }
  public render() {
    if (this.renderCallback) {
      this.renderCallback();
    }
  }
  public mergeCss(src: any, dest: any) {
    this.mergeValues(src, dest);
  }
  public doAfterRenderSurvey(el: any) {
    this.afterRenderSurvey(el);
  }
  protected onLoadSurveyFromService() {
    if (!!this.currentPage) {
      this.currentPage.setWasShown(false);
      this.currentPage.onFirstRendering();
    }
    this.render();
  }
  protected onLoadingSurveyFromService() {
    this.render();
  }
  public setCompletedState(value: string, text: string) {
    super.setCompletedState(value, text);
    this.render();
  }
  public start(): boolean {
    var res = super.start();
    this.render();
    return res;
  }

  public wrapRow(element: JSX.Element, row: QuestionRowModel): JSX.Element {
    const componentName = this.getRowWrapperComponentName(row);
    const componentData = this.getRowWrapperComponentData(row);
    return ReactElementFactory.Instance.createElement(componentName, {
      element,
      row,
      componentData,
    });
  }

  public wrapElement(element: JSX.Element, question: SurveyElement): JSX.Element {
    const componentName = this.getElementWrapperComponentName(question);
    const componentData = this.getElementWrapperComponentData(question);
    return ReactElementFactory.Instance.createElement(componentName, {
      element,
      question,
      componentData,
    });
  }

  public wrapItemValue(element: JSX.Element, question: QuestionSelectBase, item: ItemValue): JSX.Element {
    const componentName = this.getItemValueWrapperComponentName(item, question);
    const componentData = this.getItemValueWrapperComponentData(item, question);
    return ReactElementFactory.Instance.createElement(componentName, {
      key: element.key,
      element,
      question,
      item,
      componentData,
    });
  }

  public wrapMatrixCell(element: JSX.Element, cell: QuestionMatrixDropdownRenderedCell, reason: string = "cell"): JSX.Element {
    const componentName = this.getElementWrapperComponentName(cell, reason);
    const componentData = this.getElementWrapperComponentData(cell, reason);
    return ReactElementFactory.Instance.createElement(componentName, {
      element,
      cell,
      componentData,
    });
  }
}

export class ReactWindowModel extends SurveyWindowModel {
  constructor(jsonObj: any = null, model: ReactSurveyModel = null) {
    super(jsonObj, model);
  }
  protected createSurvey(jsonObj: any): SurveyModel {
    return new ReactSurveyModel(jsonObj);
  }
  public get renderCallback(): () => void {
    return this.survey.renderCallback;
  }
  public set renderCallback(val: () => void) {
    this.survey.renderCallback = val;
  }
}

SurveyModel.platform = "react";
