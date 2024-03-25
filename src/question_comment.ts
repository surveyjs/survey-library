import { Question } from "./question";
import { Serializer } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import { LocalizableString } from "./localizablestring";
import { QuestionTextBase } from "./question_textbase";
import { increaseHeightByContent } from "./utils/utils";
import { settings } from "./settings";

/**
 * A class that describes the Long Text question type.
 *
 * [View Demo](https://surveyjs.io/form-library/examples/questiontype-comment/ (linkStyle))
 */
export class QuestionCommentModel extends QuestionTextBase {
  private element: HTMLElement;
  /**
   * Specifies the visible height of the comment area, measured in lines.
   *
   * The value of this property is passed on to the `rows` attribute of the underlying `<textarea>` element.
   */
  public get rows(): number {
    return this.getPropertyValue("rows");
  }
  public set rows(val: number) {
    this.setPropertyValue("rows", val);
  }
  public get cols(): number {
    return this.getPropertyValue("cols");
  }
  public set cols(val: number) {
    this.setPropertyValue("cols", val);
  }
  /**
   * Specifies whether the question allows line breaks.
   *
   * When this property is enabled, a user can press Enter to insert line breaks. They are saved as `\n` in survey results. The Comment question also recognizes and interprets the `\n` sequence as a line break when you set the question `value` in code.
   */
  public get acceptCarriageReturn(): boolean {
    return this.getPropertyValue("acceptCarriageReturn");
  }
  public set acceptCarriageReturn(val: boolean) {
    this.setPropertyValue("acceptCarriageReturn", val);
  }
  /**
   * Specifies whether the comment area automatically increases its height to accomodate multi-line content.
   *
   * Default value: `false` (inherited from `SurveyModel`'s [`autoGrowComment`](https://surveyjs.io/form-library/documentation/surveymodel#autoGrowComment) property)
   * @see allowResize
   */
  public get autoGrow(): boolean {
    return this.getPropertyValue("autoGrow") || (this.survey && this.survey.autoGrowComment);
  }
  public set autoGrow(val: boolean) {
    this.setPropertyValue("autoGrow", val);
  }
  /**
   * Specifies whether to display a resize handle for the comment area.
   *
   * Default value: `true` (inherited from `SurveyModel`'s [`allowResizeComment`](https://surveyjs.io/form-library/documentation/surveymodel#allowResizeComment) property)
   * @see autoGrow
   */
  public get allowResize(): boolean {
    return this.getPropertyValue("allowResize");
  }
  public set allowResize(val: boolean) {
    this.setPropertyValue("allowResize", val);
  }
  public get renderedAllowResize(): boolean {
    return this.allowResize && (this.survey && this.survey.allowResizeComment) && !this.isPreviewStyle && !this.isReadOnlyStyle;
  }
  public get resizeStyle() {
    return this.renderedAllowResize ? "both" : "none";
  }
  public getType(): string {
    return "comment";
  }
  public afterRenderQuestionElement(el: HTMLElement): void {
    const { root } = settings.environment;
    this.element = root.getElementById(this.inputId) || el;
    this.updateElement();
    super.afterRenderQuestionElement(el);
  }
  public updateElement(): void {
    if (this.element && this.autoGrow) {
      setTimeout(() => increaseHeightByContent(this.element), 1);
    }
  }
  public beforeDestroyQuestionElement(el: HTMLElement): void {
    super.beforeDestroyQuestionElement(el);
    this.element = undefined;
  }
  public onInput(event: any): void {
    if (this.isInputTextUpdate)
      this.value = event.target.value;
    else
      this.updateElement();
    this.updateRemainingCharacterCounter(event.target.value);
  }
  public onKeyDown(event: any): void {
    this.onKeyDownPreprocess && this.onKeyDownPreprocess(event);
    if (!this.acceptCarriageReturn && (event.key === "Enter" || event.keyCode === 13)) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
  protected setQuestionValue(newValue: any, updateIsAnswered: boolean = true): void {
    super.setQuestionValue(newValue, updateIsAnswered);
    this.updateElement();
  }
  onValueChanged(): void {
    super.onValueChanged();
    this.updateElement();
  }
  protected setNewValue(newValue: string): any {
    if (!this.acceptCarriageReturn && !!newValue) {
      // eslint-disable-next-line no-control-regex
      newValue = newValue.replace(new RegExp("(\r\n|\n|\r)", "gm"), "");
    }
    super.setNewValue(newValue);
  }
  protected getValueSeparator(): string { return "\n"; }
  public get className() {
    return (this.cssClasses ? this.getControlClass() : "panel-comment-root") || undefined;
  }

}
Serializer.addClass(
  "comment",
  [
    { name: "maxLength:number", default: -1 },
    { name: "cols:number", default: 50, visible: false, isSerializable: false },
    { name: "rows:number", default: 4 },
    { name: "placeholder",
      alternativeName: "placeHolder",
      serializationProperty: "locPlaceholder" },
    {
      name: "textUpdateMode",
      default: "default",
      choices: ["default", "onBlur", "onTyping"],
    },
    { name: "autoGrow:boolean" },
    { name: "allowResize:boolean", default: true },
    { name: "acceptCarriageReturn:boolean", default: true, visible: false }
  ],
  function () {
    return new QuestionCommentModel("");
  },
  "textbase"
);
QuestionFactory.Instance.registerQuestion("comment", (name) => {
  return new QuestionCommentModel(name);
});
