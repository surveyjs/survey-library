export interface SurveyTemplateRendererTemplateData {
  name: string;
  data: any;
  nodes?: HTMLElement[];
  afterRender: (el: HTMLElement, context: any) => void;
}
export interface SurveyTemplateRendererViewModel {
  componentData: any;
  templateData: SurveyTemplateRendererTemplateData;
}