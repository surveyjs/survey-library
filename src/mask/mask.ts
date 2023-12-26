import { IMaskedValue } from "./mask_utils";

export class InputMaskBase {
  protected _prevSelectionStart: number;
  constructor(protected input: HTMLInputElement, protected mask: any) {
    this.applyValue(mask);
    this.addInputEventListener();
  }

  protected getMaskedValue(mask: any): string {
    return this.input.value;
  }
  protected processMaskedValue(mask: any): IMaskedValue {
    return { text: this.input.value, cursorPosition: this.input.selectionStart };
  }
  applyValue(mask: any) {
    if(!!this.input) {
      this.input.value = this.getMaskedValue(mask);
    }
  }
  protected updateMaskedString(mask: any): void {
    if(!!this.input) {
      const result = this.processMaskedValue(mask);
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