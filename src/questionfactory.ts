import { HashTable } from "./helpers";
import { Question } from "./question";
import { IElement } from "./base-interfaces";
import { surveyLocalization } from "./surveyStrings";
import { Serializer } from "./jsonobject";
import { ComponentCollection } from "./question_custom";

export class QuestionFactory {
  public static Instance: QuestionFactory = new QuestionFactory();
  public static get DefaultChoices(): string[] {
    return [
      surveyLocalization.getString("choices_Item") + "1",
      surveyLocalization.getString("choices_Item") + "2",
      surveyLocalization.getString("choices_Item") + "3",
    ];
  }
  public static get DefaultColums(): string[] {
    var colName = surveyLocalization.getString("matrix_column") + " ";
    return [colName + "1", colName + "2", colName + "3"];
  }
  public static get DefaultRows(): string[] {
    var rowName = surveyLocalization.getString("matrix_row") + " ";
    return [rowName + "1", rowName + "2"];
  }
  public static get DefaultMutlipleTextItems(): string[] {
    var itemName = surveyLocalization.getString("multipletext_itemname");
    return [itemName + "1", itemName + "2"];
  }
  public registerQuestion(questionType: string, questionCreator: (name: string) => Question): void {
    ElementFactory.Instance.registerElement(questionType, questionCreator);
  }
  public registerCustomQuestion(questionType: string) : void {
    ElementFactory.Instance.registerCustomQuestion(questionType);
  }
  public unregisterElement(elementType: string, removeFromSerializer: boolean = false): void {
    ElementFactory.Instance.unregisterElement(elementType, removeFromSerializer);
  }
  public clear(): void {
    ElementFactory.Instance.clear();
  }
  public getAllTypes(): Array<string> {
    return ElementFactory.Instance.getAllTypes();
  }
  public createQuestion(questionType: string, name: string): Question {
    return <Question>ElementFactory.Instance.createElement(questionType, name);
  }
}

export class ElementFactory {
  public static Instance: ElementFactory = new ElementFactory();
  private creatorHash: HashTable<(name: string) => IElement> = {};

  public registerElement(elementType: string, elementCreator: (name: string) => IElement): void {
    this.creatorHash[elementType] = elementCreator;
  }
  public registerCustomQuestion = (questionType: string) : void => {
    const creator = (name: string): Question => {
      const el = Serializer.createClass(questionType);
      if(!!el) el.name = name;
      return el;
    };
    this.registerElement(questionType, creator);
  }
  public clear(): void {
    this.creatorHash = {};
  }
  public unregisterElement(elementType: string, removeFromSerializer: boolean = false): void {
    delete this.creatorHash[elementType];
    if (removeFromSerializer) {
      Serializer.removeClass(elementType);
    }
  }
  public getAllTypes(): Array<string> {
    var result = new Array<string>();
    for (var key in this.creatorHash) {
      result.push(key);
    }
    return result.sort();
  }
  public createElement(elementType: string, name: string): IElement {
    var creator = this.creatorHash[elementType];
    if (!!creator) return creator(name);
    const compJSON = ComponentCollection.Instance.getCustomQuestionByName(elementType);
    if(!!compJSON) return ComponentCollection.Instance.createQuestion(name, compJSON);
    return null;
  }
}