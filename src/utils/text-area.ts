import { increaseHeightByContent } from "./utils";

export interface ITextArea {
  question: any;
  id: string;
  className: string;
  isDisabledAttr: boolean;
  isReadOnlyAttr?: boolean;
  placeholder: string;
  autoGrow: boolean;
  maxLength: number;
  rows: number;
  cols?: number;
  getTextValue?: () => any;
  onTextAreaChange?: (event: any) => void;
  onTextAreaInput?: (event: any) => void;
  onTextAreaKeyDown?: (event: any) => void;

  ariaRequired: "true" | "false";
  ariaLabel: string;
  ariaInvalid?: "true" | "false";
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  ariaErrormessage?: string;
}

export class TextAreaModel {
  private element: HTMLElement;

  constructor(private options: ITextArea) { }

  public setElement(element: HTMLElement | null): void {
    if (!!element) {
      this.element = element;
    }
  }

  public getTextValue(): string {
    if (!!this.options.getTextValue)
      return this.options.getTextValue();
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
  get question(): any {
    return this.options.question;
  }
  get id(): string {
    return this.options.id;
  }
  get placeholder(): string {
    return this.options.placeholder;
  }
  get className(): string {
    return this.options.className;
  }
  get maxLength(): number {
    return this.options.maxLength;
  }
  get autoGrow(): boolean {
    return this.options.autoGrow;
  }
  get rows(): number {
    return this.options.rows;
  }
  get cols(): number | undefined {
    return this.options.cols;
  }
  get isDisabledAttr(): boolean {
    return this.options.isDisabledAttr;
  }
  get isReadOnlyAttr(): boolean | undefined {
    return this.options.isReadOnlyAttr;
  }
  get ariaRequired(): "true" | "false" {
    return this.options.ariaRequired;
  }
  get ariaLabel(): string {
    return this.options.ariaLabel;
  }
  get ariaInvalid(): "true" | "false" {
    return this.options.ariaInvalid;
  }
  get ariaLabelledBy(): string {
    return this.options.ariaLabelledBy;
  }
  get ariaDescribedBy(): string {
    return this.options.ariaDescribedBy;
  }
  get ariaErrormessage(): string {
    return this.options.ariaErrormessage;
  }
}