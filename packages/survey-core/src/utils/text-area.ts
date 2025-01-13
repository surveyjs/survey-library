import { increaseHeightByContent } from "./utils";
import { Question } from "../question";

export interface ITextArea {
  question: any;
  id: () => string;
  propertyName: string;
  className: () => string;
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
  }

  constructor(private options: ITextArea) {
    this.question.registerFunctionOnPropertyValueChanged(this.options.propertyName, this.onPropertyChangedCallback, "__textarea");
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
  get className(): string {
    return this.options.className();
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
      this.question.unRegisterFunctionOnPropertyValueChanged(this.options.propertyName, "__textarea");
    }
    this.resetElement();
  }
}