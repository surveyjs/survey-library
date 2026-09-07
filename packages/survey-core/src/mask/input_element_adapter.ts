import { InputMaskBase } from "./mask_base";
import { ITextInputParams, normalizeInputDigits } from "./mask_utils";

export class InputElementAdapter {
  private prevUnmaskedValue: string = undefined;
  private maskedEmptyValue : string;

  private setInputValue(value: string) {
    if (this.inputElement.maxLength >= 0 && this.inputElement.maxLength < value.length) {
      value = value.slice(0, this.inputElement.maxLength);
    }
    this.inputElement.value = value;
  }
  public updateInputValue() {
    if (!!this.inputElement.placeholder && this.inputElement.value == this.maskedEmptyValue) {
      this.inputElement.value = "";
    }
  }
  constructor(private inputMaskInstance: InputMaskBase, private inputElement: HTMLInputElement, value?: any) {
    let _value: any = value;
    if (_value === null || _value === undefined) {
      _value = "";
    }
    this.updateMaskedEmptyValue();
    this.setInputValue(inputMaskInstance.getMaskedValueBySaveMode(_value));
    this.updateInputValue();
    this.prevUnmaskedValue = _value;

    inputMaskInstance.onPropertyChanged.add(this.inputMaskInstancePropertyChangedHandler);
    this.addInputEventListener();
  }

  private updateMaskedEmptyValue(): void {
    this.maskedEmptyValue = this.inputMaskInstance.getMaskedValue("");
  }
  inputMaskInstancePropertyChangedHandler = (sender: any, options: any) => {
    if (options.name !== "saveMaskedValue") {
      // the empty mask depends on mask settings and on the locale, so the cache used for
      // empty-value detection has to be refreshed together with the displayed value
      this.updateMaskedEmptyValue();
      const maskedValue = this.inputMaskInstance.getMaskedValue(this.prevUnmaskedValue);
      this.setInputValue(maskedValue);
      this.updateInputValue();
    }
  };
  // The text currently displayed in the element. While an entry is in progress it is ahead of
  // the question model: masked keystrokes are written here directly and reach the model only
  // on blur or change.
  public get inputElementText(): string {
    return !!this.inputElement ? this.inputElement.value : undefined;
  }
  // While the element is focused an entry may be in progress, so its text leads the model.
  // getRootNode() resolves the focus owner inside a shadow root as well as in the document.
  public get isInputElementFocused(): boolean {
    if (!this.inputElement) return false;
    const root: any = !!this.inputElement.getRootNode ? this.inputElement.getRootNode() : this.inputElement.ownerDocument;
    return !!root && root.activeElement === this.inputElement;
  }
  // Displays an already masked text, e.g. an incomplete entry that is not stored as a value.
  public updateInputElementText(value: string): void {
    this.setInputValue(value);
    this.updateInputValue();
  }
  public updateInputElementValue(value: any): void {
    if (value === null || value === undefined) {
      value = "";
    }
    const maskedValue = this.inputMaskInstance.getMaskedValueBySaveMode(value);
    if (this.inputElement.value !== maskedValue) {
      this.setInputValue(maskedValue);
      this.updateInputValue();
    }
    this.prevUnmaskedValue = value;
  }
  clickHandler = (event: any) => {
    if (this.inputElement.value == this.maskedEmptyValue) {
      this.inputElement.setSelectionRange(0, 0);
    }
  };

  focusHandler = (event: any) => {
    if (!!this.inputElement.placeholder && this.inputElement.value == "") {
      this.setInputValue(this.maskedEmptyValue);
    }
    this.clickHandler(event);
  };

  blurHandler = (event: any) => {
    this.updateInputValue();
  };

  beforeInputHandler = (event: any) => {
    if (this.inputElement.readOnly) {
      event.preventDefault();
      return;
    }
    const args = this.createArgs(event);
    const result = this.inputMaskInstance.processInput(args);
    this.setInputValue(result.value);
    this.inputElement.setSelectionRange(result.caretPosition, result.caretPosition);
    if (!result.cancelPreventDefault) {
      event.preventDefault();
    }
  };

  changeHandler = (event: any) => {
    // the paste / autofill fallback: the whole element text is re-run through the mask
    const result = this.inputMaskInstance.processInput({ prevValue: "", insertedChars: normalizeInputDigits(event.target.value), selectionStart: 0, selectionEnd: 0 });
    this.setInputValue(result.value);
  };

  public createArgs(event: any): ITextInputParams {
    const args: ITextInputParams = {
      insertedChars: normalizeInputDigits(event.data),
      selectionStart: event.target.selectionStart,
      selectionEnd: event.target.selectionEnd,
      prevValue: event.target.value,
      inputDirection: "forward"
    };

    if (event.inputType === "deleteContentBackward") {
      args.inputDirection = "backward";

      if (args.selectionStart === args.selectionEnd) {
        args.selectionStart = Math.max(args.selectionStart - 1, 0);
      }
    }
    if (event.inputType === "deleteContentForward" && args.selectionStart === args.selectionEnd) {
      args.selectionEnd += 1;
    }

    return args;
  }
  public addInputEventListener(): void {
    if (!!this.inputElement) {
      this.inputElement.addEventListener("beforeinput", this.beforeInputHandler);
      this.inputElement.addEventListener("click", this.clickHandler);
      this.inputElement.addEventListener("focus", this.focusHandler);
      this.inputElement.addEventListener("blur", this.blurHandler);
      this.inputElement.addEventListener("change", this.changeHandler);
    }
  }
  public removeInputEventListener(): void {
    if (!!this.inputElement) {
      this.inputElement.removeEventListener("beforeinput", this.beforeInputHandler);
      this.inputElement.removeEventListener("click", this.clickHandler);
      this.inputElement.removeEventListener("focus", this.focusHandler);
      this.inputElement.removeEventListener("blur", this.blurHandler);
      this.inputElement.removeEventListener("change", this.changeHandler);
    }
  }
  public dispose(): void {
    this.removeInputEventListener();
    this.inputElement = undefined as any;
    this.inputMaskInstance.onPropertyChanged.remove(this.inputMaskInstancePropertyChangedHandler);
  }
}