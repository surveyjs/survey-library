import { ItemValue } from "./itemvalue";

export interface SurveyItemValueTemplateData {
  name: string;
  data: ItemValue;
}

export interface SurveyItemValueViewModel {
  componentData: any;
  templateData: SurveyItemValueTemplateData;
}
