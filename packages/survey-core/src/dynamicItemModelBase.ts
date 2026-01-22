import { IQuestion, ISurvey, ISurveyData, ISurveyImpl, ITextProcessor } from "./base-interfaces";
import { IObjectValueContext, IValueGetterContext, IValueGetterContextGetValueParams, IValueGetterInfo, VariableGetterContext } from "./conditionProcessValue";
import { Question, QuestionItemValueGetterContext } from "./question";
import { TextContextProcessor } from "./textPreProcessor";

export interface IDynamicItemModelData {
    getSurvey(): ISurvey;
    getItemData(item: ISurveyData): any;
    getItemIndex(item: ISurveyData): number;
    getValueGetterContext(isUnwrapped?: boolean): IValueGetterContext;
    getFilteredData(): any;
}

export abstract class DynamicItemGetterContext extends QuestionItemValueGetterContext {
  constructor(protected item: DynamicItemModelBase) {
    super();
  }
  protected getIndex(): number { return this.item.getIndex(); }
  protected getQuestionData(): Question { return <Question>(<any>this.item.data); }
  protected get questionName(): string {
    return "";
  }
  protected abstract getSpecificValue(params: IValueGetterContextGetValueParams): IValueGetterInfo;
  protected abstract getNextName(): string;
  protected abstract getPrevName(): string;
  protected get variableName(): string {
    return this.item.getVariableName();
  }
  protected abstract getItemValue(name: string): any;
  public getValue(params: IValueGetterContextGetValueParams): IValueGetterInfo {
    const path = params.path;
    if (path.length === 0) return undefined;

    if (path.length === 1) {
      const val = this.getItemValue(path[0].name);
      if (val !== undefined) {
        return { isFound: true, value: val, context: this };
      }

      if (this.questionName && path[0].name === this.questionName) {
        const matrix = this.item.data;
        return { isFound: true, context: matrix.getValueGetterContext(), value: matrix.getFilteredData() };
      }
    }

    if (path.length > 1) {
      const dIndex = path[0].name === this.getPrevName() ? -1 : path[0].name === this.getNextName() ? 1 : 0;
      if (dIndex !== 0) {
        const index = this.visibleIndex + dIndex;
        const item = this.getVisibleItem(index);
        if (!item) return { isFound: true, value: undefined, context: this };
        path[0].name = this.variableName;
        return item.getValueGetterContext().getValue(params);
      }
    }

    const res = this.getSpecificValue(params);
    if (res) return res;

    const isVarPrefix = path[0].name === this.variableName;
    if (isVarPrefix || !params.isRoot) {
      if (isVarPrefix) {
        path.shift();
      }
      let res = super.getValue(params);
      if (!!res && res.isFound) return res;
      const allValues = this.item.getAllValues();
      if (params.isRoot) {
        res = this.getValueFromBindedQuestions(path, allValues);
        if (!!res) return res;
      }
      return new VariableGetterContext(allValues).getValue(params);
    }
    return undefined;
  }
  protected updateValueByItem(name: string, res: IValueGetterInfo): void {
    const qs = this.item.getQuestionsByValueName(name, true);
    if (qs.length > 0) {
      res.isFound = true;
      res.obj = qs[0];
      res.context = qs[0].getValueGetterContext();
    }
  }
  protected abstract getVisibleItem(idx: number): DynamicItemModelBase;
  protected abstract get visibleIndex(): number;
}

export abstract class DynamicItemModelBase implements ISurveyData, ISurveyImpl, IObjectValueContext {

  private textPreProcessor: TextContextProcessor;
  constructor(public data: IDynamicItemModelData) {
    this.textPreProcessor = new TextContextProcessor(this);
  }
  abstract getValueGetterContext(): IValueGetterContext;
  getSurveyData(): ISurveyData {
    return this;
  }
  getTextProcessor(): ITextProcessor {
    return this.textPreProcessor;
  }

  public abstract getQuestionsByValueName(name: string, caseInsensitive?: boolean): Array<Question>;
  public abstract getVariableName(): string;
  protected abstract getQuestionByName(name: string): IQuestion;

  public abstract getIndex(): number;

  getSurvey(): ISurvey {
    return this.data ? this.data.getSurvey() : null;
  }
  getValue(name: string): any {
    return this.getAllValues()[name];
  }
  abstract setValue(name: string, newValue: any): void;

  getAllValues(): any {
    return this.data.getItemData(this);
  }

  abstract getComment(name: string): string;
  abstract setComment(name: string, newValue: string, locNotification: boolean): void;

  getFilteredProperties(): any {
    return { survey: this.getSurvey(), [this.getVariableName()]: this };
  }
  findQuestionByName(name: string): IQuestion {

    if (!name) return undefined;
    const prefix = this.getVariableName() + ".";
    if (name.indexOf(prefix) === 0) {
      return this.getQuestionByName(name.substring(prefix.length));
    }
    const survey = this.getSurvey();
    return !!survey ? survey.getQuestionByName(name) : null;
  }
}