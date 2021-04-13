import { SurveyElement } from "./base";

export interface SurveyElementTemplateData {
  name: string;
  data: SurveyElement;
  afterRender: (el: HTMLElement, context: SurveyElement) => void;
}

export interface SurveyElementViewModel {
  componentData: any;
  templateData: SurveyElementTemplateData;
}
