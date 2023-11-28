import { processValueWithPattern, getMaskedValueByPattern, getUnmaskedValueByPattern } from "./mask_utils";

export class InputMaskBase {
  private _prevSelectionStart: number;
  constructor(private input: HTMLInputElement, private mask: string) {
    this.applyValue(mask);
    this.addInputEventListener();
  }

  applyValue(mask: string) {
    if(!!this.input) {
      this.input.value = getMaskedValueByPattern(getUnmaskedValueByPattern(this.input.value, mask, false), mask);
    }
  }
  updateMaskedString(mask: string): void {
    if(!!this.input) {
      const result = processValueWithPattern(this.input.value, mask, this._prevSelectionStart, this.input.selectionStart);
      this.input.value = result.text;
      this.input.setSelectionRange(result.cursorPosition, result.cursorPosition);
    }
  }

  keydownHandler = (event: any) => {
    this._prevSelectionStart = event.target.selectionStart;
  };

  inputHandler = (event: any) => {
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