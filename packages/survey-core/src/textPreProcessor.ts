import { Helpers } from "./helpers";
import { Question } from "./question";
import { PanelModel } from "./panel";
import { ISurvey, ITextProcessor, ITextProcessorProp, ITextProcessorResult } from "./base-interfaces";
import { ProcessValue } from "./conditionProcessValue";

export class TextPreProcessorItem {
  public start: number;
  public end: number;
}

export class TextPreProcessorValue {
  constructor(public name: string, public returnDisplayValue: boolean) {
    this.isExists = false;
    this.canProcess = true;
  }
  public value: any;
  public isExists: boolean;
  public canProcess: boolean;
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
    if (!this.onProcess) return text;
    const items = this.getItems(text);
    for (let i = items.length - 1; i >= 0; i--) {
      const item = items[i];
      const name = this.getName(text.substring(item.start + 1, item.end));
      if (!!name) {
        const textValue = new TextPreProcessorValue(name, returnDisplayValue === true);
        this.onProcess(textValue);
        if (!textValue.isExists) {
          if (textValue.canProcess) {
            this.hasAllValuesOnLastRunValue = false;
          }
        }
        if(textValue.isExists || replaceUndefinedValues) {
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
          if(this.isValidItemName(text.substring(start + 1, i - 1))) {
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

export class QuestionTextProcessor implements ITextProcessor {
  private textPreProcessor: TextPreProcessor;
  constructor(protected variableName: string) {
    this.textPreProcessor = new TextPreProcessor();
    this.textPreProcessor.onProcess = (textValue: TextPreProcessorValue) => {
      this.getProcessedTextValue(textValue);
    };
  }
  public processValue(
    name: string,
    returnDisplayValue: boolean
  ): TextPreProcessorValue {
    return this.textPreProcessor.processValue(name, returnDisplayValue);
  }
  protected get survey(): ISurvey {
    return null;
  }
  protected get panel(): PanelModel {
    return null;
  }
  protected getValues(): any {
    return !!this.panel ? this.panel.getValue() : null;
  }
  protected getQuestionByName(name: string): Question {
    return !!this.panel
      ? <Question>this.panel.getQuestionByValueName(name)
      : null;
  }
  protected getParentTextProcessor(): ITextProcessor { return null; }
  protected onCustomProcessText(textValue: TextPreProcessorValue): boolean {
    return false;
  }
  protected getQuestionDisplayText(question: Question): string {
    return question.displayValue;
  }
  //ITextProcessor
  private getProcessedTextValue(textValue: TextPreProcessorValue) {
    if (!textValue) return;
    if (this.onCustomProcessText(textValue)) return;
    var firstName = new ProcessValue().getFirstName(textValue.name);
    textValue.isExists = firstName == this.variableName;
    textValue.canProcess = textValue.isExists;
    if (!textValue.canProcess) return;
    //name should start with the variable name
    textValue.name = textValue.name.replace(this.variableName + ".", "");
    var firstName = new ProcessValue().getFirstName(textValue.name);
    var question = this.getQuestionByName(firstName);
    var values = {};
    if (question) {
      (<any>values)[firstName] = textValue.returnDisplayValue
        ? this.getQuestionDisplayText(question)
        : question.value;
    } else {
      var allValues = !!this.panel ? this.getValues() : null;
      if (allValues) {
        (<any>values)[firstName] = allValues[firstName];
      }
    }
    textValue.value = new ProcessValue().getValue(textValue.name, values);
  }
  processText(text: string, returnDisplayValue: boolean): string {
    const params = { text: text, returnDisplayValue: returnDisplayValue };
    return this.processTextEx(params).text;
  }
  processTextEx(params: ITextProcessorProp): ITextProcessorResult {
    const res: ITextProcessorResult = { hasAllValuesOnLastRun: true, text: params.text };
    if(!params.runAtDesign && this.survey?.isDesignMode) return res;
    const processors = new Array<ITextProcessor>();
    this.addTextPreProcessor(processors, this.textPreProcessor);
    this.addTextPreProcessor(processors, this.getParentTextProcessor());
    this.addTextPreProcessor(processors, this.survey);
    for (let i = 0; i < processors.length; i++) {
      const processor = processors[i];
      params.text = res.text;
      const processorRes = processor.processTextEx(params);
      res.text = processorRes.text;
      res.hasAllValuesOnLastRun = res.hasAllValuesOnLastRun && processorRes.hasAllValuesOnLastRun;
    }
    return res;
  }
  private addTextPreProcessor(list: Array<ITextProcessor>, textProcessor: ITextProcessor): void {
    if(!textProcessor || list.indexOf(textProcessor) > -1) return;
    list.push(textProcessor);
  }
}
