import { SurveyModel } from "../../src/survey";
import { QuestionPanelDynamicModel } from "../../src/question_paneldynamic";

export function records(count: number, create: (i: number) => any): Array<any> {
  const res: Array<any> = [];
  for (let i = 0; i < count; i++) {
    res.push(create(i));
  }
  return res;
}
export function createPanel(json: any, data: Array<any>): QuestionPanelDynamicModel {
  const survey = new SurveyModel({ elements: [Object.assign({ type: "paneldynamic", name: "pd" }, json)] });
  survey.data = { pd: data };
  return <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
}
