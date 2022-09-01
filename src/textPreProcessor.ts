import { Helpers } from "./helpers";
import { Question } from "./question";
import { PanelModel } from "./panel";
import { ISurvey, ITextProcessor } from "./base-interfaces";
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
  public process(
    text: string,
    returnDisplayValue: boolean = false,
    doEncoding: boolean = false
  ): string {
    this.hasAllValuesOnLastRunValue = true;
    if (!text) return text;
    if (!this.onProcess) return text;
    var items = this.getItems(text);
    for (var i = items.length - 1; i >= 0; i--) {
      var item = items[i];
      var name = this.getName(text.substring(item.start + 1, item.end));
      if (!name) continue;
      var textValue = new TextPreProcessorValue(name, returnDisplayValue);
      this.onProcess(textValue);
      if (!textValue.isExists) {
        if (textValue.canProcess) {
          this.hasAllValuesOnLastRunValue = false;
        }
        continue;
      }
      if (Helpers.isValueEmpty(textValue.value)) {
        this.hasAllValuesOnLastRunValue = false;
      }
      var replacedValue = !Helpers.isValueEmpty(textValue.value)
        ? textValue.value
        : "";
      if (doEncoding) {
        replacedValue = encodeURIComponent(replacedValue);
      }
      text =
        text.substring(0, item.start) + replacedValue + text.substring(item.end + 1);
    }
    return text;
  }
  public processValue(
    name: string,
    returnDisplayValue: boolean
  ): TextPreProcessorValue {
    var textValue = new TextPreProcessorValue(name, returnDisplayValue);
    if (!!this.onProcess) {
      this.onProcess(textValue);
    }
    return textValue;
  }
  public get hasAllValuesOnLastRun() {
    return !!this.hasAllValuesOnLastRunValue;
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
          items.push(item);
        }
        start = -1;
      }
    }
    return items;
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
    if(this.survey && this.survey.isDesignMode) return text;
    text = this.textPreProcessor.process(text, returnDisplayValue);
    text = this.processTextCore(this.getParentTextProcessor(), text, returnDisplayValue);
    return this.processTextCore(this.survey, text, returnDisplayValue);
  }
  processTextEx(text: string, returnDisplayValue: boolean): any {
    text = this.processText(text, returnDisplayValue);
    var hasAllValuesOnLastRun = this.textPreProcessor.hasAllValuesOnLastRun;
    var res = { hasAllValuesOnLastRun: true, text: text };
    if (this.survey) {
      res = this.survey.processTextEx(text, returnDisplayValue, false);
    }
    res.hasAllValuesOnLastRun =
      res.hasAllValuesOnLastRun && hasAllValuesOnLastRun;
    return res;
  }
  private processTextCore(textProcessor: ITextProcessor, text: string, returnDisplayValue: boolean) {
    if(!textProcessor) return text;
    return textProcessor.processText(text, returnDisplayValue);
  }
}
