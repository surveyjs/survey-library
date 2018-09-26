import { HashTable } from "./helpers";
import { Question } from "./question";
import { IElement } from "./base";
import { surveyLocalization } from "./surveyStrings";

//TODO replace completely with ElementFactory
export class QuestionFactory {
  public static Instance: QuestionFactory = new QuestionFactory();
  public static get DefaultChoices(): string[] {
    return [
      surveyLocalization.getString("choices_Item") + "1",
      surveyLocalization.getString("choices_Item") + "2",
      surveyLocalization.getString("choices_Item") + "3"
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
  private creatorHash: HashTable<(name: string) => Question> = {};

  public registerQuestion(
    questionType: string,
    questionCreator: (name: string) => Question
  ) {
    this.creatorHash[questionType] = questionCreator;
  }
  public clear() {
    this.creatorHash = {};
  }
  public getAllTypes(): Array<string> {
    var result = new Array<string>();
    for (var key in this.creatorHash) {
      result.push(key);
    }
    return result.sort();
  }
  public createQuestion(questionType: string, name: string): Question {
    var creator = this.creatorHash[questionType];
    if (creator == null) return null;
    return creator(name);
  }
}

export class ElementFactory {
  public static Instance: ElementFactory = new ElementFactory();
  private creatorHash: HashTable<(name: string) => IElement> = {};

  public registerElement(
    elementType: string,
    elementCreator: (name: string) => IElement
  ) {
    this.creatorHash[elementType] = elementCreator;
  }
  public clear() {
    this.creatorHash = {};
  }
  public getAllTypes(): Array<string> {
    var result = QuestionFactory.Instance.getAllTypes();
    for (var key in this.creatorHash) {
      result.push(key);
    }
    return result.sort();
  }
  public createElement(elementType: string, name: string): IElement {
    var creator = this.creatorHash[elementType];
    if (creator == null)
      return QuestionFactory.Instance.createQuestion(elementType, name);
    return creator(name);
  }
}
