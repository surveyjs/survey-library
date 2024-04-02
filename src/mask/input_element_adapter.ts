import { InputMaskBase } from "./mask_base";
import { ITextInputParams } from "./mask_utils";

export class InputElementAdapter {
  private prevUnmaskedValue: string = undefined;

  constructor(private inputMaskInstance: InputMaskBase, private inputElement: HTMLInputElement, value: string = "") {
    this.inputElement.value = inputMaskInstance.getMaskedValue(value);
    this.prevUnmaskedValue = value;

    inputMaskInstance.onPropertyChanged.add(this.inputMaskInstancePropertyChangedHandler);
    this.addInputEventListener();
  }

  inputMaskInstancePropertyChangedHandler = (sender: any, options: any) => {
    if(options.name !== "saveMaskedValue") {
      const maskedValue = this.inputMaskInstance.getMaskedValue(this.prevUnmaskedValue);
      this.inputElement.value = maskedValue;
    }
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

  public createArgs(event: any): ITextInputParams {
    const args: ITextInputParams = {
      insertedChars: event.data,
      selectionStart: event.target.selectionStart,
      selectionEnd: event.target.selectionEnd,
      prevValue: event.target.value,
      inputDirection: "forward"
    };

    if(event.inputType === "deleteContentBackward") {
      args.inputDirection = "backward";

      if(args.selectionStart === args.selectionEnd) {
        args.selectionStart = Math.max(args.selectionStart - 1, 0);
      }
    }
    if(event.inputType === "deleteContentForward" && args.selectionStart === args.selectionEnd) {
      args.selectionEnd += 1;
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
    this.inputMaskInstance.onPropertyChanged.remove(this.inputMaskInstancePropertyChangedHandler);
  }
}