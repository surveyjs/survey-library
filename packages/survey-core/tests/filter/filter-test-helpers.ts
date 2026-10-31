import { SurveyModel } from "../../src/survey";
import { QuestionFilterModel } from "../../src/question_filter";

const baseFields = [
  { name: "name" },
  { name: "country", fieldType: "dropdown", choices: [
    { value: "de", text: "Germany" }, { value: "fr", text: "France" }, { value: "gb", text: "Great Britain" }] },
  { name: "age", fieldType: "text", inputType: "number" }
];
// A standalone control. "over" replaces any key of the default json, including fields and items.
export function createFilter(over: any = {}): QuestionFilterModel {
  const json = Object.assign({ type: "filter", name: "f1", fields: baseFields,
    items: [{ name: "adults", expression: "{age} > 18" }, { name: "kids", expression: "{age} <= 18" }] }, over);
  const survey = new SurveyModel({ elements: [json] });
  return <QuestionFilterModel>survey.getQuestionByName("f1");
}
export function createSurvey(over: any = {}): SurveyModel {
  const json = Object.assign({ type: "filter", name: "f1", showSearch: true, fields: baseFields,
    items: [{ name: "adults", expression: "{age} > 18" }, { name: "kids", expression: "{age} <= 18" }],
    defaultItem: "adults" }, over);
  return new SurveyModel({ elements: [json] });
}
// A control bound to a matrix, with the matrix already holding three records.
export function createBound(): SurveyModel {
  const survey = new SurveyModel({ elements: [
    { type: "matrixdynamic", name: "m", columns: [{ name: "country" }, { name: "price" }] },
    { type: "filter", name: "f1", source: "m", items: [{ name: "de", expression: "{country} = 'de'" }] }] });
  (<any>survey.getQuestionByName("m")).value =
    [{ country: "de", price: 50 }, { country: "fr", price: 500 }, { country: "gb", price: 5 }];
  return survey;
}
// The records the search tests assert against: index 0 and 2 contain "an" in the name.
export const records = [
  { name: "Frank", country: "de", age: 30 },
  { name: "Bob", country: "fr", age: 12 },
  { name: "Hannah", country: "gb", age: 40 }
];
