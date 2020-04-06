import { Question } from "./question";
import { Serializer } from "./jsonobject";
import {
  ISurveyImpl,
  ISurveyData,
  ISurvey,
  ITextProcessor,
  IPanel,
  IElement,
  SurveyElement,
} from "./base";

export class CustomQuestionJSON {
  public constructor(public name: string, public json: any) {
    var self = this;
    Serializer.addClass(
      name,
      [],
      function (json: any) {
        return new QuestionCustomModel(json.name, self);
      },
      "question"
    );
  }
}

export class CustomQuestionCollection {
  public static Instance: CustomQuestionCollection = new CustomQuestionCollection();
  private customQuestionValues: Array<CustomQuestionJSON> = [];
  public add(json: any) {
    if (!json) return;
    let name = json.name;
    if (!name) {
      throw "Attribute name is missed";
    }
    if (!!this.getCustomQuestionByName(name)) {
      throw (
        "There is already registered custom question with name '" + name + "'"
      );
    }
    if (!!Serializer.findClass(name)) {
      throw "There is already class with name '" + name + "'";
    }
    this.customQuestionValues.push(new CustomQuestionJSON(name, json));
  }
  public getCustomQuestionByName(name: string): CustomQuestionJSON {
    for (var i = 0; i < this.customQuestionValues.length; i++) {
      if (this.customQuestionValues[i].name == name)
        return this.customQuestionValues[i];
    }
    return null;
  }
  public clear() {
    for (var i = 0; i < this.customQuestionValues.length; i++) {
      Serializer.removeClass(this.customQuestionValues[i].name);
    }
    this.customQuestionValues = [];
  }
}

export class QuestionCustomModel extends Question
  implements ISurveyImpl, ISurveyData, IPanel {
  private questionWrapper: Question;
  constructor(public name: string, public customQuestion: CustomQuestionJSON) {
    super(name);
    this.questionWrapper = this.createQuestion();
  }
  public getType(): string {
    return !!this.customQuestion ? this.customQuestion.name : "custom";
  }
  public get question(): Question {
    return this.questionWrapper;
  }
  public setSurveyImpl(value: ISurveyImpl) {
    super.setSurveyImpl(value);
    this.initElement(this.question);
  }
  protected setQuestionValue(newValue: any, updateIsAnswered: boolean = true) {
    super.setQuestionValue(newValue, updateIsAnswered);
    if (!!this.question) {
      this.question.value = newValue;
    }
  }
  onSurveyValueChanged(newValue: any) {
    super.onSurveyValueChanged(newValue);
    if (!!this.question) {
      this.question.onSurveyValueChanged(newValue);
    }
  }
  protected createQuestion(): Question {
    var json = this.customQuestion.json;
    if (!!json.questionJSON) {
      var qType = json.questionJSON.type;
      if (!qType || !Serializer.findClass(qType))
        throw "type attribute in questionJSON is empty or incorrect";
      var res = <Question>Serializer.createClass(qType, json.questionJSON);
      this.initElement(res);
      return res;
    }
    return null;
  }
  private initElement(el: SurveyElement) {
    if (!el) return;
    el.setSurveyImpl(this);
    (<Question>el).parent = this;
  }
  //ISurveyImpl
  geSurveyData(): ISurveyData {
    return this;
  }
  getSurvey(): ISurvey {
    return this.survey;
  }
  getTextProcessor(): ITextProcessor {
    return this.textProcessor;
  }
  //ISurveyData
  getValue(name: string): any {
    return !!this.data ? this.data.getValue(this.name) : null;
  }
  setValue(
    name: string,
    newValue: any,
    locNotification: any,
    allowNotifyValueChanged?: boolean
  ): any {
    if (!this.data) return;
    this.data.setValue(
      this.name,
      newValue,
      locNotification,
      allowNotifyValueChanged
    );
  }
  getVariable(name: string): any {
    return !!this.data ? this.data.getVariable(name) : null;
  }
  setVariable(name: string, newValue: any): void {
    if (!this.data) return;
    this.data.setVariable(name, newValue);
  }
  getComment(name: string): string {
    return !!this.data ? this.data.getComment(this.name) : "";
  }
  setComment(name: string, newValue: string, locNotification: any): any {
    if (!this.data) return;
    this.data.setComment(this.name, newValue, locNotification);
  }
  getAllValues(): any {
    return !!this.data ? this.data.getAllValues() : {};
  }
  getFilteredValues(): any {
    return !!this.data ? this.data.getFilteredValues() : {};
  }
  getFilteredProperties(): any {
    return !!this.data ? this.data.getFilteredProperties() : {};
  }
  //IPanel
  addElement(element: IElement, index: number) {}
  removeElement(element: IElement): boolean {
    return false;
  }
  getQuestionTitleLocation(): string {
    return "left";
  }
  getChildrenLayoutType(): string {
    return "row";
  }
  elementWidthChanged(el: IElement) {}
  get elements(): Array<IElement> {
    return [];
  }
  indexOf(el: IElement): number {
    return -1;
  }
}
