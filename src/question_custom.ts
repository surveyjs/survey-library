import { Question } from "./question";
import { Serializer, CustomPropertiesCollection } from "./jsonobject";
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
        return CustomQuestionCollection.Instance.createQuestion(
          !!json ? json.name : "",
          self
        );
      },
      "question"
    );
    this.onInit();
  }
  public onInit() {
    if (!this.json.onInit) return;
    this.json.onInit();
  }
  public onPropertyChanged(
    question: Question,
    propertyName: string,
    newValue: any
  ) {
    if (!this.json.onPropertyChanged) return;
    this.json.onPropertyChanged(question, propertyName, newValue);
  }
  public get isComposite() {
    return !!this.json.elementsJSON;
  }
}

export class CustomQuestionCollection {
  public static Instance: CustomQuestionCollection = new CustomQuestionCollection();
  private customQuestionValues: Array<CustomQuestionJSON> = [];
  public onCreateComposite: (
    name: string,
    questionJSON: CustomQuestionJSON
  ) => QuestionCompositeModel;
  public onCreateCustom: (
    name: string,
    questionJSON: CustomQuestionJSON
  ) => QuestionCustomModel;
  public onAddingJson: (name: string, isComposite: boolean) => void;
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
    var customQuestion = new CustomQuestionJSON(name, json);
    if (!!this.onAddingJson)
      this.onAddingJson(name, customQuestion.isComposite);
    this.customQuestionValues.push(customQuestion);
  }
  public get items(): Array<CustomQuestionJSON> {
    return this.customQuestionValues;
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
  public createQuestion(
    name: string,
    questionJSON: CustomQuestionJSON
  ): Question {
    if (!!questionJSON.isComposite)
      return this.createCompositeModel(name, questionJSON);
    return this.createCustomModel(name, questionJSON);
  }
  protected createCompositeModel(
    name: string,
    questionJSON: CustomQuestionJSON
  ): QuestionCompositeModel {
    if (!!this.onCreateComposite)
      return this.onCreateComposite(name, questionJSON);
    return new QuestionCompositeModel(name, questionJSON);
  }
  protected createCustomModel(
    name: string,
    questionJSON: CustomQuestionJSON
  ): QuestionCustomModel {
    if (!!this.onCreateCustom) return this.onCreateCustom(name, questionJSON);
    return new QuestionCustomModel(name, questionJSON);
  }
}

export abstract class QuestionCustomModelBase extends Question
  implements ISurveyImpl, ISurveyData, IPanel {
  constructor(public name: string, public customQuestion: CustomQuestionJSON) {
    super(name);
    CustomPropertiesCollection.createProperties(this);
  }
  public getType(): string {
    return !!this.customQuestion ? this.customQuestion.name : "custom";
  }
  protected onPropertyValueChanged(name: string, oldValue: any, newValue: any) {
    super.onPropertyValueChanged(name, oldValue, newValue);
    if (!!this.customQuestion) {
      this.customQuestion.onPropertyChanged(this, name, newValue);
    }
  }
  public onFirstRendering() {
    var el = this.getElement();
    if (!!el) {
      el.onFirstRendering();
    }
    super.onFirstRendering();
  }
  protected abstract getElement(): SurveyElement;
  protected initElement(el: SurveyElement) {
    if (!el) return;
    el.setSurveyImpl(this);
    el.disableDesignActions = true;
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
    SurveyElement.CreateDisabledDesignElements = true;
    this.questionWrapper = this.createQuestion();
    SurveyElement.CreateDisabledDesignElements = false;
  }
  public getTemplate(): string {
    return "custom";
  }
  protected getElement(): SurveyElement {
    return this.contentQuestion;
  }
  public hasErrors(fireCallback: boolean = true, rec: any = null): boolean {
    if (!this.contentQuestion) return false;
    var res = this.contentQuestion.hasErrors(fireCallback, rec);
    this.errors = [];
    for (var i = 0; i < this.contentQuestion.errors.length; i++) {
      this.errors.push(this.contentQuestion.errors[i]);
    }
    return res;
  }
  public get contentQuestion(): Question {
    return this.questionWrapper;
  }
  protected createQuestion(): Question {
    var json = this.customQuestion.json;
    if (!!json.questionJSON) {
      var qType = json.questionJSON.type;
      if (!qType || !Serializer.findClass(qType))
        throw "type attribute in questionJSON is empty or incorrect";
      var res = <Question>Serializer.createClass(qType);
      this.initElement(res);
      res.fromJSON(json.questionJSON);
      return res;
    }
    return null;
  }
  public setSurveyImpl(value: ISurveyImpl) {
    super.setSurveyImpl(value);
    this.initElement(this.contentQuestion);
  }
  protected setQuestionValue(newValue: any, updateIsAnswered: boolean = true) {
    super.setQuestionValue(newValue, updateIsAnswered);
    if (!!this.contentQuestion) {
      this.contentQuestion.value = newValue;
    }
  }
  onSurveyValueChanged(newValue: any) {
    super.onSurveyValueChanged(newValue);
    if (!!this.contentQuestion) {
      this.contentQuestion.onSurveyValueChanged(newValue);
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
    SurveyElement.CreateDisabledDesignElements = true;
    this.panelWrapper = this.createPanel();
    SurveyElement.CreateDisabledDesignElements = false;
  }
  public getTemplate(): string {
    return "composite";
  }
  protected getElement(): SurveyElement {
    return this.contentPanel;
  }
  public get contentPanel(): PanelModel {
    return this.panelWrapper;
  }
  public hasErrors(fireCallback: boolean = true, rec: any = null): boolean {
    if (!this.contentPanel) return false;
    return this.contentPanel.hasErrors(fireCallback, false, rec);
  }
  protected createPanel(): PanelModel {
    var res = <PanelModel>Serializer.createClass("panel");
    var elJSON = this.customQuestion.json.elementsJSON;
    if (!!elJSON) {
      res.fromJSON({ elements: elJSON });
    }
    this.initElement(res);
    res.readOnly = this.isReadOnly;
    return res;
  }
  protected onReadOnlyChanged() {
    if (!!this.contentPanel) {
      this.contentPanel.readOnly = this.isReadOnly;
    }
    super.onReadOnlyChanged();
  }
  public onSurveyLoad() {
    if (!!this.contentPanel) {
      this.contentPanel.readOnly = this.isReadOnly;
    }
    super.onSurveyLoad();
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
    var questions = this.contentPanel.questions;
    for (var i = 0; i < questions.length; i++) {
      var key = questions[i].getValueName();
      questions[i].value = !!newValue ? newValue[key] : undefined;
    }
  }
}
