import { Question } from "./question";
import { Serializer } from "./jsonobject";

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
    this.customQuestionValues = [];
  }
}

export class QuestionCustomModel extends Question {
  constructor(public name: string, public customQuestion: CustomQuestionJSON) {
    super(name);
  }
  public getType(): string {
    return !!this.customQuestion ? this.customQuestion.name : "custom";
  }
}
