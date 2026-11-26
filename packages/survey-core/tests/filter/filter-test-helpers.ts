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
    presets: [{ name: "adults", expression: "{age} > 18" }, { name: "kids", expression: "{age} <= 18" }] }, over);
  const survey = new SurveyModel({ elements: [json] });
  return <QuestionFilterModel>survey.getQuestionByName("f1");
}
// The list the presets' chip opens: a row per preset, ids "sv-filter-preset-<name>".
export function presetList(q: QuestionFilterModel): any {
  return (<any>q.chipsToolbar.getActionById("sv-filter-presets")).popupModel.contentComponentData.model;
}
// A preset picked in that list, as a click on its row picks it.
export function pickPreset(q: QuestionFilterModel, name: string): void {
  const list = presetList(q);
  list.onItemClick(list.getActionById("sv-filter-preset-" + name));
}
export function createSurvey(over: any = {}): SurveyModel {
  const json = Object.assign({ type: "filter", name: "f1", showSearchBar: true, fields: baseFields,
    presets: [{ name: "adults", expression: "{age} > 18" }, { name: "kids", expression: "{age} <= 18" }],
    defaultPreset: "adults" }, over);
  return new SurveyModel({ elements: [json] });
}
// A control bound to a matrix, with the matrix already holding three records.
export function createBound(): SurveyModel {
  const survey = new SurveyModel({ elements: [
    { type: "matrixdynamic", name: "m", columns: [{ name: "country" }, { name: "price" }] },
    { type: "filter", name: "f1", targetQuestion: "m", presets: [{ name: "de", expression: "{country} = 'de'" }] }] });
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
// The survey raises no event when a control's filter changes: an application reads the control's
// combinedExpression, which changes once per change (a batch publishes it at its end). Tests that count
// changes of the filter count changes of it.
export function onCombinedExpressionChanged(q: QuestionFilterModel, handler: (expression: string) => void): void {
  q.registerPropertyChangedHandlers(["combinedExpression"], (): void => { handler(q.combinedExpression); });
}
// The writes a control makes into its target question - what re-filters the records.
export function countTargetWrites(target: any): Array<string> {
  const writes: Array<string> = [];
  const original = target.setControlFilter.bind(target);
  target.setControlFilter = (key: string, expression: string): void => { writes.push(expression); original(key, expression); };
  return writes;
}
