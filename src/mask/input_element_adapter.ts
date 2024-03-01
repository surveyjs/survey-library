import { InputMaskBase } from "./mask_base";
import { ITextInputParams } from "./mask_utils";

export class InputElementAdapter {
  constructor(private inputMaskInstance: InputMaskBase, private inputElement: HTMLInputElement, value: string = "") {
    this.inputElement.value = inputMaskInstance.getMaskedValue(value);
    this.addInputEventListener();
  }

  beforeInputHandler = (event: any) => {
    const args = this.createArgs(event);
    const result = this.inputMaskInstance.processInput(args);
    this.inputElement.value = result.value;
    this.inputElement.setSelectionRange(result.caretPosition, result.caretPosition);
    if(!result.cancelPreventDefault) {
      event.preventDefault();
    }
  };

  blurInputHandler = (event: any) => {
    const unmaskedValue = this.inputMaskInstance.getUnmaskedValue(event.target.value);
    const maskedValue = this.inputMaskInstance.getMaskedValue(unmaskedValue);
    this.inputElement.value = maskedValue;
  };

  public createArgs(event: any): ITextInputParams {
    const args: ITextInputParams = {
      insertedChars: event.data,
      selectionStart: event.target.selectionStart,
      selectionEnd: event.target.selectionEnd,
      prevValue: event.target.value,
      inputDirection: "forward"
    };
    switch (event.inputType) {
      case "deleteContentBackward": {
        args.selectionStart = Math.max(args.selectionStart - 1, 0);
        args.inputDirection = "backward";
        break;
      }
      case "deleteContentForward": {
        args.selectionEnd += 1;
        break;
      }
    }
    return args;
  }
  public addInputEventListener(): void {
    if (!!this.inputElement) {
      this.inputElement.addEventListener("beforeinput", this.beforeInputHandler);
      this.inputElement.addEventListener("blur", this.blurInputHandler);
    }
  }
  public removeInputEventListener(): void {
    if (!!this.inputElement) {
      this.inputElement.removeEventListener("beforeinput", this.beforeInputHandler);
      this.inputElement.removeEventListener("blur", this.blurInputHandler);
    }
  }
  public dispose(): void {
    this.removeInputEventListener();
  }
}