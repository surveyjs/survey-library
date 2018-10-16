import * as React from "react";
import { SurveyModel } from "../survey";
import { SurveyWindowModel } from "../surveyWindow";
import { surveyCss } from "../defaultCss/cssstandard";

export class ReactSurveyModel extends SurveyModel {
  renderCallback: () => void;
  constructor(jsonObj: any = null) {
    super(jsonObj);
  }
  get css() {
    return surveyCss.getCss();
  }
  set css(value: any) {
    this.mergeValues(value, this.css);
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
    this.render();
  }
  protected onLoadingSurveyFromService() {
    this.render();
  }
  protected setCompletedState(value: string, text: string) {
    super.setCompletedState(value, text);
    this.render();
  }
  public start() {
    super.start();
    this.render();
  }
}

export class ReactWindowModel extends SurveyWindowModel {
  renderCallback: () => void;
  constructor(jsonObj: any = null, model: ReactSurveyModel = null) {
    super(jsonObj, model);
  }
  //public get reactSurvey(): ReactSurveyModel { return <ReactSurveyModel>this.survey; }
  protected createSurvey(jsonObj: any): SurveyModel {
    return new ReactSurveyModel(jsonObj);
  }
}

SurveyModel.platform = "react";
