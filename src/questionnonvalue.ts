import { Question } from "./question";
import { JsonObject } from "./jsonobject";
import { SurveyError } from "./base";

/**
 * A Model for non value question. This question doesn't add any new functionality. It hides some properties, including the value.
 */
export class QuestionNonValue extends Question {
  constructor(public name: string) {
    super(name);
  }
  public getType(): string {
    return "nonvalue";
  }
  public get hasInput(): boolean {
    return false;
  }
  public get hasTitle(): boolean {
    return false;
  }
  public getTitleLocation(): string {
    return "";
  }
  public get hasComment(): boolean {
    return false;
  }
  public getAllErrors(): Array<SurveyError> {
    return [];
  }
  public supportGoNextPageAutomatic() {
    return false;
  }
  public addConditionNames(names: Array<string>) {}
  public getConditionJson(operator: string = null, path: string = null): any {
    return null;
  }
}
JsonObject.metaData.addClass(
  "nonvalue",
  [
    { name: "title", visible: false },
    { name: "description", visible: false },
    { name: "commentText", visible: false },
    { name: "valueName", visible: false },
    { name: "enableIf", visible: false },
    { name: "defaultValue", visible: false },
    { name: "correctAnswer", visible: false },
    { name: "isRequired", visible: false },
    { name: "requiredErrorText", visible: false },
    { name: "readOnly", visible: false },
    { name: "validators", visible: false }
  ],
  function() {
    return new QuestionNonValue("");
  },
  "question"
);
