export interface SurveyTemplateRendererTemplateData {
  name: string;
  data: any;
  afterRender: (el: HTMLElement, context: any) => void;
}
export interface SurveyTemplateRendererViewModel {
  componentData: any;
  templateData: SurveyTemplateRendererTemplateData;
}