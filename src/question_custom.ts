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
  IConditionRunner,
} from "./base";
import { PanelModel } from "./panel";
import { Helpers, HashTable } from "./helpers";
import { ItemValue } from "./itemvalue";

export class ComponentQuestionJSON {
  public constructor(public name: string, public json: any) {
    var self = this;
    Serializer.addClass(
      name,
      [],
      function (json: any) {
        return ComponentCollection.Instance.createQuestion(
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
  public onCreated(question: Question) {
    if (!this.json.onCreated) return;
    this.json.onCreated(question);
  }
  public onLoaded(question: Question) {
    if (!this.json.onLoaded) return;
    this.json.onLoaded(question);
  }
  public onAfterRender(question: Question, htmlElement: any) {
    if (!this.json.onAfterRender) return;
    this.json.onAfterRender(question, htmlElement);
  }
  public onAfterRenderContentElement(
    question: Question,
    element: Question,
    htmlElement: any
  ) {
    if (!this.json.onAfterRenderContentElement) return;
    this.json.onAfterRenderContentElement(question, element, htmlElement);
  }
  public onPropertyChanged(
    question: Question,
    propertyName: string,
    newValue: any
  ) {
    if (!this.json.onPropertyChanged) return;
    this.json.onPropertyChanged(question, propertyName, newValue);
  }
  public onItemValuePropertyChanged(
    question: Question,
    item: ItemValue,
    propertyName: string,
    name: string,
    newValue: any
  ) {
    if (!this.json.onItemValuePropertyChanged) return;
    this.json.onItemValuePropertyChanged(question, {
      obj: item,
      propertyName: propertyName,
      name: name,
      newValue: newValue,
    });
  }
  public get isComposite() {
    return !!this.json.elementsJSON || !!this.json.createElements;
  }
}

export class ComponentCollection {
  public static Instance: ComponentCollection = new ComponentCollection();
  private customQuestionValues: Array<ComponentQuestionJSON> = [];
  public onCreateComposite: (
    name: string,
    questionJSON: ComponentQuestionJSON
  ) => QuestionCompositeModel;
  public onCreateCustom: (
    name: string,
    questionJSON: ComponentQuestionJSON
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
    var customQuestion = new ComponentQuestionJSON(name, json);
    if (!!this.onAddingJson)
      this.onAddingJson(name, customQuestion.isComposite);
    this.customQuestionValues.push(customQuestion);
  }
  public get items(): Array<ComponentQuestionJSON> {
    return this.customQuestionValues;
  }
  public getCustomQuestionByName(name: string): ComponentQuestionJSON {
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
    questionJSON: ComponentQuestionJSON
  ): Question {
    if (!!questionJSON.isComposite)
      return this.createCompositeModel(name, questionJSON);
    return this.createCustomModel(name, questionJSON);
  }
  protected createCompositeModel(
    name: string,
    questionJSON: ComponentQuestionJSON
  ): QuestionCompositeModel {
    if (!!this.onCreateComposite)
      return this.onCreateComposite(name, questionJSON);
    return new QuestionCompositeModel(name, questionJSON);
  }
  protected createCustomModel(
    name: string,
    questionJSON: ComponentQuestionJSON
  ): QuestionCustomModel {
    if (!!this.onCreateCustom) return this.onCreateCustom(name, questionJSON);
    return new QuestionCustomModel(name, questionJSON);
  }
}

export abstract class QuestionCustomModelBase extends Question
  implements ISurveyImpl, ISurveyData, IPanel {
  constructor(
    public name: string,
    public customQuestion: ComponentQuestionJSON
  ) {
    super(name);
    CustomPropertiesCollection.createProperties(this);
    SurveyElement.CreateDisabledDesignElements = true;
    this.createWrapper();
    SurveyElement.CreateDisabledDesignElements = false;
    if (!!this.customQuestion) {
      this.customQuestion.onCreated(this);
    }
  }
  public getType(): string {
    return !!this.customQuestion ? this.customQuestion.name : "custom";
  }
  protected createWrapper() {}
  protected onPropertyValueChanged(name: string, oldValue: any, newValue: any) {
    super.onPropertyValueChanged(name, oldValue, newValue);
    if (!!this.customQuestion && !this.isLoadingFromJson) {
      this.customQuestion.onPropertyChanged(this, name, newValue);
    }
  }
  public itemValuePropertyChanged(
    item: ItemValue,
    name: string,
    oldValue: any,
    newValue: any
  ) {
    super.itemValuePropertyChanged(item, name, oldValue, newValue);
    if (!!this.customQuestion && !this.isLoadingFromJson) {
      this.customQuestion.onItemValuePropertyChanged(
        this,
        item,
        item.ownerPropertyName,
        name,
        newValue
      );
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
  public setSurveyImpl(value: ISurveyImpl) {
    super.setSurveyImpl(value);
    this.initElement(this.getElement());
  }
  public onSurveyLoad() {
    super.onSurveyLoad();
    if (!!this.getElement()) {
      this.getElement().onSurveyLoad();
      this.customQuestion.onLoaded(this);
    }
  }
  public afterRenderQuestionElement(el: any) {
    //Do nothing
  }
  public afterRender(el: any) {
    super.afterRender(el);
    if (!!this.customQuestion) {
      this.customQuestion.onAfterRender(this, el);
    }
  }
  protected setQuestionValue(newValue: any, updateIsAnswered: boolean = true) {
    super.setQuestionValue(newValue, updateIsAnswered);
    this.updateElementCss();
  }
  protected setNewValue(newValue: any) {
    super.setNewValue(newValue);
    this.updateElementCss();
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
    var newName = this.convertDataName(name);
    this.data.setValue(
      newName,
      this.convertDataValue(name, newValue),
      locNotification,
      allowNotifyValueChanged
    );
    this.updateIsAnswered();
    this.updateElementCss();
  }
  protected convertDataName(name: string): string {
    return this.getValueName();
  }
  protected convertDataValue(name: string, newValue: any): any {
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
  getQuestionStartIndex(): string {
    return this.getStartIndex();
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
  public getTemplate(): string {
    return "custom";
  }
  protected createWrapper() {
    this.questionWrapper = this.createQuestion();
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
    if (!res) {
      res = super.hasErrors(fireCallback, rec);
    }
    this.updateElementCss();
    return res;
  }
  public focus(onError: boolean = false) {
    if (!!this.contentQuestion) {
      this.contentQuestion.focus(onError);
    } else {
      super.focus(onError);
    }
  }
  public get contentQuestion(): Question {
    return this.questionWrapper;
  }
  protected createQuestion(): Question {
    var json = this.customQuestion.json;
    var res = null;
    if (!!json.questionJSON) {
      var qType = json.questionJSON.type;
      if (!qType || !Serializer.findClass(qType))
        throw "type attribute in questionJSON is empty or incorrect";
      res = <Question>Serializer.createClass(qType);
      this.initElement(res);
      res.fromJSON(json.questionJSON);
    } else {
      if (!!json.createQuestion) {
        res = json.createQuestion();
        this.initElement(res);
      }
    }
    if (!!res && !res.name) {
      res.name = "question";
    }
    return res;
  }
  public onSurveyLoad() {
    super.onSurveyLoad();
    if (!this.contentQuestion) return;
    if (this.isEmpty() && !this.contentQuestion.isEmpty()) {
      this.value = this.contentQuestion.value;
    }
  }
  public runCondition(values: HashTable<any>, properties: HashTable<any>) {
    super.runCondition(values, properties);
    if (!!this.contentQuestion) {
      this.contentQuestion.runCondition(values, properties);
    }
  }
  protected convertDataName(name: string): string {
    if (!this.contentQuestion) return super.convertDataName(name);
    var newName = name.replace(
      this.contentQuestion.getValueName(),
      this.getValueName()
    );
    return newName.indexOf(this.getValueName()) == 0
      ? newName
      : super.convertDataName(name);
  }
  protected convertDataValue(name: string, newValue: any): any {
    return this.convertDataName(name) == super.convertDataName(name)
      ? this.contentQuestion.value
      : newValue;
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
      (<Question>el).afterRenderQuestionCallback = (
        question: Question,
        element: any
      ) => {
        if (!!this.customQuestion) {
          this.customQuestion.onAfterRenderContentElement(
            this,
            question,
            element
          );
        }
      };
    }
  }
  protected updateElementCssCore(cssClasses: any) {
    if (!!this.contentQuestion) {
      cssClasses = this.contentQuestion.cssClasses;
    }
    super.updateElementCssCore(cssClasses);
  }
}

export class QuestionCompositeModel extends QuestionCustomModelBase {
  private panelWrapper: PanelModel;
  protected createWrapper() {
    this.panelWrapper = this.createPanel();
  }
  public getTemplate(): string {
    return "composite";
  }
  protected getCssType(): string {
    return "composite";
  }
  protected getElement(): SurveyElement {
    return this.contentPanel;
  }
  public get contentPanel(): PanelModel {
    return this.panelWrapper;
  }
  public hasErrors(fireCallback: boolean = true, rec: any = null): boolean {
    var res = super.hasErrors(fireCallback, rec);
    if (!this.contentPanel) return res;
    return this.contentPanel.hasErrors(fireCallback, false, rec) || res;
  }
  public updateElementCss() {
    super.updateElementCss();
    if (this.contentPanel) {
      this.contentPanel.updateElementCss();
    }
  }
  protected createPanel(): PanelModel {
    var res = <PanelModel>Serializer.createClass("panel");
    res.showQuestionNumbers = "off";
    var json = this.customQuestion.json;
    if (!!json.elementsJSON) {
      res.fromJSON({ elements: json.elementsJSON });
    }
    if (!!json.createElements) {
      json.createElements(res);
    }
    this.initElement(res);
    res.readOnly = this.isReadOnly;
    this.setAfterRenderCallbacks(res);
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
      this.setIsContentElement(this.contentPanel);
    }
    super.onSurveyLoad();
  }
  private setIsContentElement(panel: PanelModel) {
    panel.isContentElement = true;
    var elements = panel.elements;
    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];
      if (el.isPanel) {
        this.setIsContentElement(<PanelModel>el);
      } else {
        (<Question>el).isContentElement = true;
      }
    }
  }
  public setVisibleIndex(val: number): number {
    var res = super.setVisibleIndex(val);
    if (this.isVisible && !!this.contentPanel) {
      res += this.contentPanel.setVisibleIndex(val);
    }
    return res;
  }
  public runCondition(values: HashTable<any>, properties: HashTable<any>) {
    super.runCondition(values, properties);
    if (!!this.contentPanel) {
      var oldComposite = values.composite;
      values.composite = this.contentPanel.getValue();
      this.contentPanel.runCondition(values, properties);
      delete values["composite"];
      if (!!oldComposite) {
        values.composite = oldComposite;
      }
    }
  }
  getValue(name: string): any {
    var val = this.value;
    return !!val ? val[name] : null;
  }
  protected convertDataValue(name: string, newValue: any): any {
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
  private setAfterRenderCallbacks(panel: PanelModel) {
    if (!panel || !this.customQuestion) return;
    var questions = panel.questions;
    for (var i = 0; i < questions.length; i++) {
      questions[i].afterRenderQuestionCallback = (
        question: Question,
        element: any
      ) => {
        this.customQuestion.onAfterRenderContentElement(
          this,
          question,
          element
        );
      };
    }
  }
}
