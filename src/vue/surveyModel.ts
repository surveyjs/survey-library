import Vue from "vue";
import { SurveyModel } from "../survey";
import { SurveyWindowModel } from "../surveyWindow";
import { PageModel } from "../page";
import { IQuestion, IElement } from "../base";
import { surveyCss } from "../defaultCss/cssstandard";

export class VueSurveyModel extends SurveyModel {
  public static updatePropertiesHash(obj: any) {
    obj.setPropertyValueCoreHandler = function(
      propertiesHash: any,
      name: string,
      val: any
    ) {
      Vue.set(propertiesHash, name, val);
    };
  }
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

  protected setPropertyValueCore(propertiesHash: any, name: string, val: any) {
    Vue.set(propertiesHash, name, val);
  }
  questionAdded(
    question: IQuestion,
    index: number,
    parentPanel: any,
    rootPanel: any
  ) {
    VueSurveyModel.updatePropertiesHash(question);
    super.questionAdded(question, index, parentPanel, rootPanel);
  }
  protected doOnPageAdded(page: PageModel) {
    VueSurveyModel.updatePropertiesHash(page);
    super.doOnPageAdded(page);
  }
  panelAdded(panel: IElement, index: number, parentPanel: any, rootPanel: any) {
    VueSurveyModel.updatePropertiesHash(panel);
    super.panelAdded(panel, index, parentPanel, rootPanel);
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
