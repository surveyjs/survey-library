import { HashTable } from "./helpers";
import { Question } from "./question";
import { IElement } from "./base-interfaces";
import { getLocaleString } from "./surveyStrings";
import { Serializer } from "./jsonobject";
import { ComponentCollection } from "./question_custom";

export class QuestionFactory {
  public static Instance: QuestionFactory = new QuestionFactory();
  public static get DefaultChoices(): string[] {
    const choice = getLocaleString("choices_Item");
    return [choice + "1", choice + "2", choice + "3"];
  }
  public static get DefaultColums(): string[] {
    var colName = getLocaleString("matrix_column") + " ";
    return [colName + "1", colName + "2", colName + "3"];
  }
  public static get DefaultRows(): string[] {
    var rowName = getLocaleString("matrix_row") + " ";
    return [rowName + "1", rowName + "2"];
  }
  public static get DefaultMutlipleTextItems(): string[] {
    var itemName = getLocaleString("multipletext_itemname");
    return [itemName + "1", itemName + "2"];
  }
  public registerQuestion(questionType: string, questionCreator: (name: string) => Question, showInToolbox: boolean = true): void {
    ElementFactory.Instance.registerElement(questionType, questionCreator, showInToolbox);
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
  private creatorHash: HashTable<{showInToolbox: boolean, creator: (name: string) => IElement}> = {};

  public registerElement(elementType: string, elementCreator: (name: string) => IElement, showInToolbox: boolean = true): void {
    this.creatorHash[elementType] = { showInToolbox: showInToolbox, creator: elementCreator };
  }
  public registerCustomQuestion = (questionType: string, showInToolbox: boolean = true) : void => {
    const creator = (name: string): Question => {
      const el = Serializer.createClass(questionType);
      if(!!el) el.name = name;
      return el;
    };
    this.registerElement(questionType, creator, showInToolbox);
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
  public getAllToolboxTypes(): Array<string> {
    return this.getAllTypesCore(true);
  }
  public getAllTypes(): Array<string> {
    return this.getAllTypesCore(false);
  }
  public createElement(elementType: string, name: string): IElement {
    var item = this.creatorHash[elementType];
    if (!!item && !!item.creator) return item.creator(name);
    const compJSON = ComponentCollection.Instance.getCustomQuestionByName(elementType);
    if(!!compJSON) return ComponentCollection.Instance.createQuestion(name, compJSON);
    return null;
  }
  private getAllTypesCore(showInToolboxOnly: boolean): Array<string> {
    var result = new Array<string>();
    for (var key in this.creatorHash) {
      if(!showInToolboxOnly || this.creatorHash[key].showInToolbox) {
        result.push(key);
      }
    }
    return result.sort();
  }
}