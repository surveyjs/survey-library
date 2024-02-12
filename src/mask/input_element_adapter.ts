import { InputMaskBase } from "./mask_base";
import { ITextMaskInputArgs } from "./mask_manager";

export class InputElementAdapter {
  constructor(private inputMaskInstance: InputMaskBase, private inputElement: HTMLInputElement, value: string = "") {
    this.inputElement.value = inputMaskInstance.getMaskedValue(value);
    this.addInputEventListener();
  }

  beforeInputHandler = (event: any) => {
    const args = this.createArgs(event);
    const result = this.inputMaskInstance.processInput(args);
    this.inputElement.value = result.text;
    this.inputElement.setSelectionRange(result.cursorPosition, result.cursorPosition);
    if(!result.cancelPreventDefault) {
      event.preventDefault();
    }
  };

  blurInputHandler = (event: any) => {
    const result = this.inputMaskInstance.getMaskedValue(event.target.value);
    this.inputElement.value = result;
  };

  public createArgs(event: any): ITextMaskInputArgs {
    const args: ITextMaskInputArgs = {
      insertedCharacters: event.data,
      selectionStart: event.target.selectionStart,
      selectionEnd: event.target.selectionEnd,
      prevValue: event.target.value,
      inputDirection: "leftToRight"
    };
    switch (event.inputType) {
      case "deleteContentBackward": {
        args.selectionStart = Math.max(args.selectionStart - 1, 0);
        args.inputDirection = "rightToLeft";
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