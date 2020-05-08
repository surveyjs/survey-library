import * as React from "react";
import { SurveyModel } from "../survey";
import { SurveyWindowModel } from "../surveyWindow";

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
