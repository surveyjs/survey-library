import { checkValueByPattern, getMaskedValueByPattern, getUnmaskedValueByPattern } from "./mask_utils";

export class InputMaskBase {
  private _prevSelectionStart: number;
  constructor(private input: HTMLInputElement, private mask: string) {
    this.applyValue(mask);
    this.addInputEventListener();
  }

  applyValue(mask: string) {
    if(!!this.input) {
      const value = getMaskedValueByPattern(getUnmaskedValueByPattern(this.input.value, mask, false), mask);
      this.input.value = value.text;
    }
  }
  updateMaskedString(mask: string): void {
    if(!!this.input) {
      const prevSelectionStart = this.input.selectionStart;
      const value = getMaskedValueByPattern(getUnmaskedValueByPattern(this.input.value, mask, false), mask);
      // this.input.value = value.text;
      this.input.value = checkValueByPattern(this.input.value, mask, this._prevSelectionStart, this.input.selectionStart);
      // this.input.setSelectionRange(value.cursorPosition, value.cursorPosition);
      this.input.setSelectionRange(prevSelectionStart, prevSelectionStart);
    }
  }

  keydownHandler = (event: any) => {
    console.log("key - " + event.key + ", code - " + event.code + ", selectionStart - " + event.target.selectionStart);
    this._prevSelectionStart = event.target.selectionStart;
    // this.updateMaskedString(this.mask);
  };

  inputHandler = (event: any) => {
    console.log("data - " + event.data + ", selectionStart - " + event.target.selectionStart);
    this.updateMaskedString(this.mask);
  };
  public addInputEventListener(): void {
    if (!!this.input) {
      this.input.addEventListener("input", this.inputHandler);
      this.input.addEventListener("keydown", this.keydownHandler);
      // this.input.addEventListener("click", this.inputHandler);
      // this.input.addEventListener("focus", this.inputHandler);
      // this.input.addEventListener("blur", this.inputHandler);
    }
  }
  public removeInputEventListener(): void {
    if (!!this.input) {
      this.input.removeEventListener("input", this.inputHandler);
      this.input.removeEventListener("keydown", this.keydownHandler);
    }
  }
  public dispose(): void {
    this.removeInputEventListener();
  }
}