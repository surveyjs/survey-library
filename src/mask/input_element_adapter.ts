import { InputMaskBase } from "./mask_base";
import { ITextMaskInputArgs } from "./mask_manager";

export class InputElementAdapter {
  constructor(private mask: InputMaskBase, private inputElement: HTMLInputElement, value: string = "") {
    this.inputElement.value = mask.getMaskedValue(value, true);
    this.addInputEventListener();
  }

  beforeInputHandler = (event: any) => {
    const args = this.createArgs(event);
    const result = this.mask.processInput(args);
    this.inputElement.value = result.text;
    this.inputElement.setSelectionRange(result.cursorPosition, result.cursorPosition);
    if(!result.cancelPreventDefault) {
      event.preventDefault();
    }
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
    }
  }
  public removeInputEventListener(): void {
    if (!!this.inputElement) {
      this.inputElement.removeEventListener("beforeinput", this.beforeInputHandler);
    }
  }
  public dispose(): void {
    this.removeInputEventListener();
  }
}