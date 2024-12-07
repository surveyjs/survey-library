import { Question } from "./question";
import { property, Serializer } from "./jsonobject";
import { Helpers } from "./helpers";
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { LocalizableString } from "./localizablestring";
import { Base } from "./base";
import { ISurveyImpl } from "./base-interfaces";

export class CharacterCounter extends Base {
  @property() remainingCharacterCounter: string;
  public updateRemainingCharacterCounter(newValue: string, maxLength: number): void {
    this.remainingCharacterCounter = Helpers.getRemainingCharacterCounterText(newValue, maxLength);
  }
}

/**
 * A base class for the [Single-Line Input](https://surveyjs.io/form-library/documentation/questiontextmodel) and [Long Text](https://surveyjs.io/form-library/documentation/questioncommentmodel) question types.
 */
export class QuestionTextBase extends Question {
  constructor(name: string) {
    super(name);
  }
  protected isTextValue(): boolean {
    return true;
  }
  /**
   * The maximum text length measured in characters. Assign 0 if the length should be unlimited.
   *
   * Default value: -1 (inherits the actual value from the `SurveyModel`'s [`maxTextLength`](https://surveyjs.io/form-library/documentation/surveymodel#maxTextLength) property).
   */
  public get maxLength(): number {
    return this.getPropertyValue("maxLength");
  }
  public set maxLength(val: number) {
    this.setPropertyValue("maxLength", val);
    this.updateRemainingCharacterCounter(this.value);
  }
  public getMaxLength(): any {
    return Helpers.getMaxLength(this.maxLength, this.survey ? this.survey.maxTextLength : -1);
  }
  public characterCounter = new CharacterCounter();
  public updateRemainingCharacterCounter(newValue: string): void {
    this.characterCounter.updateRemainingCharacterCounter(newValue, this.getMaxLength());
  }

  /**
   * A placeholder for the input field.
   */
  @property({ localizable: true, onSet: (val, target) => target.resetRenderedPlaceholder() })
  public placeholder: string;
  public get placeHolder(): string { return this.placeholder; }
  public set placeHolder(val: string) { this.placeholder = val; }
  public get locPlaceHolder(): LocalizableString { return this.locPlaceholder; }

  public getType(): string {
    return "textbase";
  }
  isEmpty(): boolean {
    return super.isEmpty() || this.value === "";
  }
  /**
   * Specifies when to update the question value.
   *
   * Possible values:
   *
   * - `"onBlur"` - Updates the value after the input field loses focus.
   * - `"onTyping"` - Updates the value on every key press.
   * - `"default"` (default) - Inherits the value from the `SurveyModel`'s [`textUpdateMode`](https://surveyjs.io/form-library/documentation/surveymodel#textUpdateMode) property.
   *
   * > Do not use the `"onTyping"` mode if your survey contains many expressions. Expressions are reevaluated each time a question value is changed. In `"onTyping"` mode, the question value changes frequently. This may cause performance degradation.
   */
  public get textUpdateMode(): string {
    return this.getPropertyValue("textUpdateMode");
  }
  public set textUpdateMode(val: string) {
    this.setPropertyValue("textUpdateMode", val);
  }
  protected getIsInputTextUpdate(): boolean {
    if (this.textUpdateMode == "default") return super.getIsInputTextUpdate();
    return this.textUpdateMode == "onTyping";
  }
  public get renderedPlaceholder(): string {
    const func = (): string => {
      return this.hasPlaceholder() ? this.placeHolder : undefined;
    };
    return this.getPropertyValue("renderedPlaceholder", undefined, func);
  }
  protected onReadOnlyChanged(): void {
    super.onReadOnlyChanged();
    this.resetRenderedPlaceholder();
  }
  public localeChanged(): void {
    super.localeChanged();
    this.resetRenderedPlaceholder();
  }
  protected supportEmptyValidation(): boolean { return true; }
  protected resetRenderedPlaceholder(): void {
    this.resetPropertyValue("renderedPlaceholder");
  }
  protected hasPlaceholder(): boolean {
    return !this.isReadOnly;
  }
  protected setNewValue(newValue: any): void {
    super.setNewValue(newValue);
    this.updateRemainingCharacterCounter(newValue);
  }
  protected setQuestionValue(newValue: any, updateIsAnswered: boolean = true): void {
    super.setQuestionValue(newValue, updateIsAnswered);
    this.updateRemainingCharacterCounter(newValue);
  }
  protected convertToCorrectValue(val: any): any {
    if(Array.isArray(val)) return val.join(this.getValueSeparator());
    return val;
  }
  protected getValueSeparator(): string { return ", "; }
  protected getControlCssClassBuilder(): CssClassBuilder {
    return new CssClassBuilder()
      .append(this.cssClasses.root)
      .append(this.cssClasses.onError, this.hasCssError())
      .append(this.cssClasses.controlDisabled, this.isDisabledStyle)
      .append(this.cssClasses.controlReadOnly, this.isReadOnlyStyle)
      .append(this.cssClasses.controlPreview, this.isPreviewStyle);
  }
  public getControlClass(): string {
    return this.getControlCssClassBuilder().toString();
  }

  //a11y
  public get isNewA11yStructure(): boolean {
    return true;
  }
  // EO a11y

  public onKeyDownPreprocess: (event: any) => void;
}
Serializer.addClass(
  "textbase", [],
  function() {
    return new QuestionTextBase("");
  },
  "question"
);
