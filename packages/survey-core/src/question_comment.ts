import { property, Serializer } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import { QuestionTextBase } from "./question_textbase";
import { settings } from "./settings";
import { ITextArea, TextAreaModel } from "./utils/text-area";
import { Helpers } from "./helpers";

/**
 * A class that describes the Long Text question type.
 *
 * [View Demo](https://surveyjs.io/form-library/examples/questiontype-comment/ (linkStyle))
 */
export class QuestionCommentModel extends QuestionTextBase {
  private element: HTMLElement;
  private textAreaModelValue: TextAreaModel;

  constructor(name: string) {
    super(name);
  }
  public get textAreaModel(): TextAreaModel {
    if(!this.textAreaModelValue) {
      this.textAreaModelValue = new TextAreaModel(this.getTextAreaOptions());
    }
    return this.textAreaModelValue;
  }
  private getTextAreaOptions(): ITextArea {
    const _this = this;
    const updateQuestionValue = (newValue: any) => {
      if (!Helpers.isTwoValueEquals(_this.value, newValue, false, true, false)) {
        _this.value = newValue;
      }
    };

    const options: ITextArea = {
      question: this,
      id: () => this.inputId,
      propertyName: "value",
      className: () => this.className,
      placeholder: () => this.renderedPlaceholder,
      isDisabledAttr: () => this.isDisabledAttr,
      isReadOnlyAttr: () => this.isReadOnlyAttr,
      autoGrow: () => this.renderedAutoGrow,
      maxLength: () => this.getMaxLength(),
      rows: () => this.rows,
      cols: () => this.cols,
      ariaRequired: () => this.a11y_input_ariaRequired,
      ariaLabel: () => this.a11y_input_ariaLabel,
      ariaLabelledBy: () => this.a11y_input_ariaLabelledBy,
      ariaDescribedBy: () => this.a11y_input_ariaDescribedBy,
      ariaInvalid: () => this.a11y_input_ariaInvalid,
      ariaErrormessage: () => this.a11y_input_ariaErrormessage,
      getTextValue: () => { return this.value; },
      onTextAreaChange: (e) => { updateQuestionValue(e.target.value); },
      onTextAreaInput: (event) => { this.onInput(event); },
      onTextAreaKeyDown: (event) => { this.onKeyDown(event); },
      onTextAreaFocus: (event) => { this.onFocus(event); },
      onTextAreaBlur: (event) => { this.onBlur(event); }
    };
    return options;
  }
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
  public get autoGrow(): boolean | undefined {
    return this.getPropertyValue("autoGrow");
  }
  public set autoGrow(val: boolean | undefined) {
    this.setPropertyValue("autoGrow", val);
  }
  public get renderedAutoGrow(): boolean {
    const autoGrow = this.autoGrow;
    return autoGrow === undefined && this.survey ? this.survey.autoGrowComment : !!autoGrow;
  }
  /**
   * Specifies whether to display a resize handle for the comment area.
   *
   * Default value: `true` (inherited from `SurveyModel`'s [`allowResizeComment`](https://surveyjs.io/form-library/documentation/surveymodel#allowResizeComment) property)
   * @see autoGrow
   */
  public get allowResize(): boolean | undefined {
    return this.getPropertyValue("allowResize");
  }
  public set allowResize(val: boolean | undefined) {
    this.setPropertyValue("allowResize", val);
  }
  public get renderedAllowResize(): boolean {
    const res = this.allowResize;
    if (res === undefined && this.survey) {
      return this.survey.allowResizeComment;
    } else {
      return !!res;
    }
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
    super.afterRenderQuestionElement(el);
  }
  public beforeDestroyQuestionElement(el: HTMLElement): void {
    super.beforeDestroyQuestionElement(el);
    this.element = undefined;
  }
  public onInput(event: any): void {
    if (this.isInputTextUpdate)
      this.value = event.target.value;
    this.updateRemainingCharacterCounter(event.target.value);
  }
  protected onBlurCore(event: any): void {
    super.onBlurCore(event);
  }
  public onKeyDown(event: any): void {
    this.onKeyDownPreprocess && this.onKeyDownPreprocess(event);
    if (!this.acceptCarriageReturn && (event.key === "Enter" || event.keyCode === 13)) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
  protected setNewValue(newValue: string): any {
    if (!this.acceptCarriageReturn && !!newValue) {
      // eslint-disable-next-line no-control-regex
      newValue = newValue.replace(new RegExp("(\r\n|\n|\r)", "gm"), "");
    }
    super.setNewValue(newValue);
  }
  protected getValueSeparator(): string { return "\n"; }
  protected notifyStateChanged(prevState: string): void {
    super.notifyStateChanged(prevState);
    if (!this.isCollapsed) {
      this.textAreaModel.updateElement();
    }
  }
  public get className(): string {
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
    { name: "autoGrow:boolean", defaultFunc: () => undefined },
    { name: "allowResize:boolean", defaultFunc: () => undefined },
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
