import Vue from "vue";
import { SurveyModel } from "../survey";
import { SurveyWindowModel } from "../surveyWindow";
import { surveyCss } from "../defaultCss/cssstandard";

export class VueSurveyModel extends SurveyModel {
  renderCallback: () => void;
  public render() {
    if (this.renderCallback) {
      this.renderCallback();
    }
  }
  protected onLoadSurveyFromService() {
    this.render();
  }
  protected onLoadingSurveyFromService() {
    this.render();
  }
  get css() {
    return surveyCss.getCss();
  }
  set css(value: any) {
    this.mergeValues(value, this.css);
  }
  public setDataValueCore(valuesHash: any, key: string, value: any) {
    Vue.set(valuesHash, key, value);
  }
  public deleteDataValueCore(valuesHash: any, key: string) {
    Vue.delete(valuesHash, key);
  }
  public doAfterRenderSurvey(el: any) {
    this.afterRenderSurvey(el);
  }
  public doAfterRenderHeader(el: any) {
    this.afterRenderHeader(el);
  }
}

export class VueSurveyWindowModel extends SurveyWindowModel {
  constructor(jsonObj: any, initialModel: SurveyModel = null) {
    super(jsonObj, initialModel);
  }
  protected createSurvey(jsonObj: any): SurveyModel {
    return new VueSurveyModel(jsonObj);
  }
}

SurveyModel.platform = "vue";
