import { Question, IConditionObject } from "./question";
import { Serializer } from "./jsonobject";
import { SurveyError } from "./survey-error";

/**
 * A base class for question types that cannot have a value ([Html](https://surveyjs.io/form-library/documentation/questionhtmlmodel), [Image](https://surveyjs.io/form-library/documentation/questionimagemodel)).
 *
 * This class does not implement new functionality&mdash;it only redefines default values of certain properties inherited from the [`Question`](https://surveyjs.io/form-library/documentation/question) class.
 */
export class QuestionNonValue extends Question {
  constructor(name: string) {
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
  public hasErrors(fireCallback: boolean = true, rec: any = null): boolean {
    return false;
  }
  public getAllErrors(): Array<SurveyError> {
    return [];
  }
  public supportAutoAdvance(): boolean {
    return false;
  }
  public addConditionObjectsByContext(
    objects: Array<IConditionObject>,
    context: any
  ) { }
  public getConditionJson(operator: string = null, path: string = null): any {
    return null;
  }
  public get ariaRole(): string {
    return null;
  }
  public get ariaRequired(): any {
    return null;
  }
}
Serializer.addClass(
  "nonvalue",
  [
    { name: "title", visible: false },
    { name: "description", visible: false },
    { name: "valueName", visible: false },
    { name: "enableIf", visible: false },
    { name: "defaultValue", visible: false },
    { name: "correctAnswer", visible: false },
    { name: "clearIfInvisible", visible: false },
    { name: "isRequired", visible: false, isSerializable: false },
    { name: "requiredErrorText", visible: false },
    { name: "readOnly", visible: false },
    { name: "requiredIf", visible: false },
    { name: "validators", visible: false },
    { name: "titleLocation", visible: false },
    { name: "showCommentArea", visible: false },
    { name: "useDisplayValuesInDynamicTexts", alternativeName: "useDisplayValuesInTitle", visible: false },
  ],
  function () {
    return new QuestionNonValue("");
  },
  "question"
);
