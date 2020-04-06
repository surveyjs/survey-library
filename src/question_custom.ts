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
import { PanelModel } from "./panel";
import { Helpers } from "./helpers";

export class CustomQuestionJSON {
  public constructor(public name: string, public json: any) {
    var self = this;
    Serializer.addClass(
      name,
      [],
      function (json: any) {
        if (!!self.IsComposite)
          return new QuestionCompositeModel(json.name, self);
        return new QuestionCustomModel(json.name, self);
      },
      "question"
    );
  }
  public get IsComposite() {
    return !!this.json.elementsJSON;
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

export class QuestionCustomModelBase extends Question
  implements ISurveyImpl, ISurveyData, IPanel {
  constructor(public name: string, public customQuestion: CustomQuestionJSON) {
    super(name);
  }
  public getType(): string {
    return !!this.customQuestion ? this.customQuestion.name : "custom";
  }
  protected initElement(el: SurveyElement) {
    if (!el) return;
    el.setSurveyImpl(this);
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
    return this.value;
  }
  setValue(
    name: string,
    newValue: any,
    locNotification: any,
    allowNotifyValueChanged?: boolean
  ): any {
    if (!this.data) return;
    this.data.setValue(
      this.getValueName(),
      this.convertValue(name, newValue),
      locNotification,
      allowNotifyValueChanged
    );
  }
  protected convertValue(name: string, newValue: any): any {
    return newValue;
  }
  getVariable(name: string): any {
    return !!this.data ? this.data.getVariable(name) : null;
  }
  setVariable(name: string, newValue: any): void {
    if (!this.data) return;
    this.data.setVariable(name, newValue);
  }
  getComment(name: string): string {
    return !!this.data ? this.data.getComment(this.getValueName()) : "";
  }
  setComment(name: string, newValue: string, locNotification: any): any {
    if (!this.data) return;
    this.data.setComment(this.getValueName(), newValue, locNotification);
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

export class QuestionCustomModel extends QuestionCustomModelBase {
  private questionWrapper: Question;
  constructor(public name: string, public customQuestion: CustomQuestionJSON) {
    super(name, customQuestion);
    this.questionWrapper = this.createQuestion();
  }
  public get question(): Question {
    return this.questionWrapper;
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
  protected initElement(el: SurveyElement) {
    super.initElement(el);
    if (!!el) {
      (<Question>el).parent = this;
    }
  }
}

export class QuestionCompositeModel extends QuestionCustomModelBase {
  private panelWrapper: PanelModel;
  constructor(public name: string, public customQuestion: CustomQuestionJSON) {
    super(name, customQuestion);
    this.panelWrapper = this.createPanel();
  }
  public get panel(): PanelModel {
    return this.panelWrapper;
  }
  protected createPanel(): PanelModel {
    var res = this.createPanelCore();
    var elJSON = this.customQuestion.json.elementsJSON;
    if (!!elJSON) {
      res.fromJSON({ elements: elJSON });
    }
    this.initElement(res);
    return res;
  }
  protected createPanelCore(): PanelModel {
    return new PanelModel("panel");
  }
  getValue(name: string): any {
    var val = this.value;
    return !!val ? val[name] : null;
  }
  protected convertValue(name: string, newValue: any): any {
    var val = this.value;
    if (!val) val = {};
    if (Helpers.isValueEmpty(newValue)) {
      delete val[name];
    } else {
      val[name] = newValue;
    }
    return val;
  }
  protected setQuestionValue(newValue: any, updateIsAnswered: boolean = true) {
    super.setQuestionValue(newValue, updateIsAnswered);
    var questions = this.panel.questions;
    for (var i = 0; i < questions.length; i++) {
      var key = questions[i].getValueName();
      questions[i].value = !!newValue ? newValue[key] : undefined;
    }
  }
}
