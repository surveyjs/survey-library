import { DomDocumentHelper } from "../global_variables_utils";
import { Question } from "../question";
import { CharacterCounter } from "../question_textbase";

export function increaseHeightByContent(element: HTMLElement, getComputedStyle?: (elt: Element) => any) {
  if (!element) return;
  if (!getComputedStyle) getComputedStyle = (elt: Element) => { return DomDocumentHelper.getComputedStyle(elt); };
  const rows = parseFloat(element.getAttribute("rows") || "2");
  const style = getComputedStyle(element);
  const oldOverlow = style.overflowY;
  const lineHeight = parseFloat(style.lineHeight);
  if (!!element.scrollHeight) {
    const paddingBorderWidth = (parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth) + parseFloat(style.paddingBottom) + parseFloat(style.paddingTop));
    let currentLinesCount = (element.scrollHeight - paddingBorderWidth) / lineHeight;
    const setHeight = (linesCount: number) => { element.style.height = linesCount * lineHeight + paddingBorderWidth + "px"; };
    setHeight(currentLinesCount);
    element.style.overflowY = "hidden";
    while(element.scrollHeight <= element.offsetHeight && currentLinesCount > rows) {
      currentLinesCount--;
      setHeight(currentLinesCount);
    }
    element.style.overflowY = oldOverlow;
    if (element.scrollHeight > element.offsetHeight) {
      currentLinesCount++;
      setHeight(currentLinesCount);
    }
  } else {
    element.style.height = "auto";
  }
}
interface ITextAreaCssClasses {
    root?: string;
    group?: string;
    grip?: string;
    control?: string;
    gripIconId?: string;
    characterCounter?: string;
}
export interface ITextArea {
  question: any;
  id: () => string;
  propertyNames: Array<string>;
  cssClasses: () => ITextAreaCssClasses;
  isDisabledAttr: () => boolean;
  isReadOnlyAttr?: () => boolean;
  placeholder: () => string;
  autoGrow: () => boolean;
  maxLength: () => number;
  rows: () => number;
  cols?: () => number;
  getTextValue?: () => any;
  onTextAreaChange?: (event: any) => void;
  onTextAreaInput?: (event: any) => void;
  onTextAreaKeyDown?: (event: any) => void;
  onTextAreaBlur?: (event: any) => void;
  onTextAreaFocus?: (event: any) => void;
  characterCounter?: () => CharacterCounter;
  ariaRequired: () => "true" | "false";
  ariaLabel: () => string;
  ariaInvalid?: () => "true" | "false";
  ariaLabelledBy?: () => string;
  ariaDescribedBy?: () => string;
  ariaErrormessage?: () => string;
}

export class TextAreaModel {
  private element: HTMLTextAreaElement;

  public updateElement(): void {
    if (this.element && this.autoGrow) {
      setTimeout(() => increaseHeightByContent(this.element), 1);
    }
  }

  private onPropertyChangedCallback = () => {
    if (this.element) {
      this.element.value = this.getTextValue();
      this.updateElement();
    }
  };

  constructor(private options: ITextArea) {
    this.question.registerFunctionOnPropertiesValueChanged(this.options.propertyNames, this.onPropertyChangedCallback, "__textarea");
  }

  public setElement(element: HTMLTextAreaElement | null): void {
    if (!!element) {
      this.element = element;
      this.updateElement();
    }
  }
  public resetElement(): void {
    this.element = undefined as any;
  }

  public getTextValue(): string {
    if (!!this.options.getTextValue)
      return this.options.getTextValue() || "";
    return "";
  }
  public onTextAreaChange(event: any): void {
    if (!!this.options.onTextAreaChange)
      this.options.onTextAreaChange(event);
  }
  public onTextAreaInput(event: any): void {
    if (!!this.options.onTextAreaInput)
      this.options.onTextAreaInput(event);

    if (this.element && this.autoGrow) {
      increaseHeightByContent(this.element);
    }
  }
  public onTextAreaKeyDown(event: any): void {
    if (!!this.options.onTextAreaKeyDown)
      this.options.onTextAreaKeyDown(event);
  }
  public onTextAreaBlur(event: any): void {
    this.onTextAreaChange(event);
    if (!!this.options.onTextAreaBlur)
      this.options.onTextAreaBlur(event);
  }
  public onTextAreaFocus(event: any): void {
    if (!!this.options.onTextAreaFocus)
      this.options.onTextAreaFocus(event);
    if (this.isReadOnlyAttr) {
      event?.target?.select();
    }
  }
  get question(): Question {
    return this.options.question as Question;
  }
  get id(): string {
    return this.options.id();
  }
  get placeholder(): string {
    return this.options.placeholder();
  }
  getCssClasses(): ITextAreaCssClasses {
    return this.options.cssClasses();
  }
  get characterCounter(): CharacterCounter {
    return this.options.characterCounter && this.options.characterCounter();
  }
  get maxLength(): number {
    if (this.options.maxLength)
      return this.options.maxLength();
  }
  get autoGrow(): boolean {
    if (this.options.autoGrow)
      return this.options.autoGrow();
  }
  get rows(): number {
    if (this.options.rows)
      return this.options.rows();
  }
  get cols(): number | undefined {
    if (this.options.cols)
      return this.options.cols();
  }
  get isDisabledAttr(): boolean {
    return this.options.isDisabledAttr();
  }
  get isReadOnlyAttr(): boolean | undefined {
    if (this.options.isReadOnlyAttr)
      return this.options.isReadOnlyAttr();
  }
  get ariaRequired(): "true" | "false" {
    if (this.options.ariaRequired)
      return this.options.ariaRequired();
  }
  get ariaLabel(): string {
    if (this.options.ariaLabel)
      return this.options.ariaLabel();
  }
  get ariaInvalid(): "true" | "false" {
    if (this.options.ariaInvalid)
      return this.options.ariaInvalid();
  }
  get ariaLabelledBy(): string {
    if (this.options.ariaLabelledBy)
      return this.options.ariaLabelledBy();
  }
  get ariaDescribedBy(): string {
    if (this.options.ariaDescribedBy)
      return this.options.ariaDescribedBy();
  }
  get ariaErrormessage(): string {
    if (this.options.ariaErrormessage)
      return this.options.ariaErrormessage();
  }
  public dispose(): void {
    if (this.question) {
      this.question.unRegisterFunctionOnPropertiesValueChanged(this.options.propertyNames, "__textarea");
    }
    this.resetElement();
  }
}