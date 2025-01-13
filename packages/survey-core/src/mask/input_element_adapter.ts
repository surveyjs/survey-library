import { InputMaskBase } from "./mask_base";
import { ITextInputParams } from "./mask_utils";

export class InputElementAdapter {
  private prevUnmaskedValue: string = undefined;

  constructor(private inputMaskInstance: InputMaskBase, private inputElement: HTMLInputElement, value?: any) {
    let _value: any = value;
    if (_value === null || _value === undefined) {
      _value = "";
    }
    this.inputElement.value = inputMaskInstance.getMaskedValue(_value);
    this.prevUnmaskedValue = _value;

    inputMaskInstance.onPropertyChanged.add(this.inputMaskInstancePropertyChangedHandler);
    this.addInputEventListener();
  }

  inputMaskInstancePropertyChangedHandler = (sender: any, options: any) => {
    if (options.name !== "saveMaskedValue") {
      const maskedValue = this.inputMaskInstance.getMaskedValue(this.prevUnmaskedValue);
      this.inputElement.value = maskedValue;
    }
  }

  clickHandler = (event: any) => {
    if (this.inputElement.value == this.inputMaskInstance.getMaskedValue("")) {
      this.inputElement.setSelectionRange(0, 0);
    }
  };

  beforeInputHandler = (event: any) => {
    const args = this.createArgs(event);
    const result = this.inputMaskInstance.processInput(args);
    this.inputElement.value = result.value;
    this.inputElement.setSelectionRange(result.caretPosition, result.caretPosition);
    if (!result.cancelPreventDefault) {
      event.preventDefault();
    }
  };

  changeHandler = (event: any) => {
    const result = this.inputMaskInstance.processInput({ prevValue: "", insertedChars: event.target.value, selectionStart: 0, selectionEnd: 0 });
    this.inputElement.value = result.value;
  }

  public createArgs(event: any): ITextInputParams {
    const args: ITextInputParams = {
      insertedChars: event.data,
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
      this.inputElement.addEventListener("focus", this.clickHandler);
      this.inputElement.addEventListener("change", this.changeHandler);
    }
  }
  public removeInputEventListener(): void {
    if (!!this.inputElement) {
      this.inputElement.removeEventListener("beforeinput", this.beforeInputHandler);
      this.inputElement.removeEventListener("click", this.clickHandler);
      this.inputElement.removeEventListener("focus", this.clickHandler);
      this.inputElement.removeEventListener("change", this.changeHandler);
    }
  }
  public dispose(): void {
    this.removeInputEventListener();
    this.inputElement = undefined as any;
    this.inputMaskInstance.onPropertyChanged.remove(this.inputMaskInstancePropertyChangedHandler);
  }
}