import { Helpers } from "./helpers";
import { ISurvey, ITextProcessor, ITextProcessorProp, ITextProcessorResult } from "./base-interfaces";
import { IObjectValueContext, ValueGetter } from "./conditionProcessValue";

export class TextPreProcessorItem {
  public start: number;
  public end: number;
}

export class TextPreProcessorValue {
  constructor(public name: string, public returnDisplayValue: boolean) {
    this.isExists = false;
  }
  public value: any;
  public isExists: boolean;
  public obj: any;
}

export class TextPreProcessor {
  private _unObservableValues: any = [undefined];
  private get hasAllValuesOnLastRunValue(): boolean {
    return this._unObservableValues[0];
  }
  private set hasAllValuesOnLastRunValue(val: boolean) {
    this._unObservableValues[0] = val;
  }
  public onProcess: (textValue: TextPreProcessorValue) => void;
  public process(text: string, returnDisplayValue?: boolean, doEncoding?: boolean,
    replaceUndefinedValues?: boolean): string {
    this.hasAllValuesOnLastRunValue = true;
    if (!text) return text;
    if (!this.canProcess()) return text;
    const items = this.getItems(text);
    for (let i = items.length - 1; i >= 0; i--) {
      const item = items[i];
      const name = this.getName(text.substring(item.start + 1, item.end));
      if (!!name) {
        const textValue = new TextPreProcessorValue(name, returnDisplayValue === true);
        this.onProcessValue(textValue);
        if (!textValue.isExists) {
          this.hasAllValuesOnLastRunValue = false;
        }
        if (textValue.isExists || replaceUndefinedValues) {
          if (Helpers.isValueEmpty(textValue.value)) {
            this.hasAllValuesOnLastRunValue = false;
          }
          var replacedValue = !Helpers.isValueEmpty(textValue.value)
            ? textValue.value
            : "";
          if (doEncoding) {
            replacedValue = encodeURIComponent(replacedValue);
          }
          text = text.substring(0, item.start) + replacedValue + text.substring(item.end + 1);
        }
      }
    }
    return text;
  }
  protected canProcess(): boolean { return !!this.onProcess; }
  protected onProcessValue(textValue: TextPreProcessorValue) {
    this.onProcess && this.onProcess(textValue);
  }
  public processValue(name: string, returnDisplayValue: boolean): TextPreProcessorValue {
    var textValue = new TextPreProcessorValue(name, returnDisplayValue);
    if (!!this.onProcess) {
      this.onProcess(textValue);
    }
    return textValue;
  }
  public get hasAllValuesOnLastRun() { return !!this.hasAllValuesOnLastRunValue; }
  public processText(text: string, returnDisplayValue: boolean): string {
    return this.process(text, returnDisplayValue);
  }
  public processTextEx(params: ITextProcessorProp): ITextProcessorResult {
    const res = { hasAllValuesOnLastRun: true, text: params.text };
    res.text = this.process(params.text, params.returnDisplayValue, params.doEncoding, params.replaceUndefinedValues);
    res.hasAllValuesOnLastRun = this.hasAllValuesOnLastRun;
    return res;
  }
  private getItems(text: string): Array<TextPreProcessorItem> {
    var items = [];
    var length = text.length;
    var start = -1;
    var ch = "";
    for (var i = 0; i < length; i++) {
      ch = text[i];
      if (ch == "{") start = i;
      if (ch == "}") {
        if (start > -1) {
          var item = new TextPreProcessorItem();
          item.start = start;
          item.end = i;
          if (this.isValidItemName(text.substring(start + 1, i))) {
            items.push(item);
          }
        }
        start = -1;
      }
    }
    return items;
  }
  private isValidItemName(name: string): boolean {
    return !!name && name.indexOf(":") < 0;
  }
  private getName(name: string): string {
    if (!name) return;
    return name.trim();
  }
}
export class TextContextProcessor extends TextPreProcessor {
  private context: IObjectValueContext;
  constructor(private obj: IObjectValueContext) {
    super();
  }
  protected canProcess(): boolean { return true; }
  protected onProcessValue(textValue: TextPreProcessorValue) {
    this.getProcessedTextValue(textValue);
    textValue.obj = this.getContextObj();
    super.onProcessValue(textValue);
  }
  public processText(text: string, returnDisplayValue: boolean): string {
    const params: ITextProcessorProp = { text: text, returnDisplayValue: returnDisplayValue };
    return this.processTextEx(params).text;
  }
  public processTextEx(params: ITextProcessorProp): ITextProcessorResult {
    if (!params.runAtDesign && this.survey?.isDesignMode) return { hasAllValuesOnLastRun: true, text: params.text };
    this.context = params.context;
    return super.processTextEx(params);
  }
  private get survey(): ISurvey {
    const obj = <any>this.obj;
    return obj.getSurvey ? obj.getSurvey() : null;
  }
  private getContextObj(): IObjectValueContext {
    return this.context || this.obj;
  }
  private getProcessedTextValue(textValue: TextPreProcessorValue) {
    const name = textValue.name.toLocaleLowerCase();
    const context = this.getContextObj();
    const res = new ValueGetter().getValueInfo({ name: name, context: context.getValueGetterContext(), isText: true, isDisplayValue: textValue.returnDisplayValue });
    if (res.isFound) {
      textValue.isExists = res.isFound;
      textValue.value = res.value;
    }
  }
}