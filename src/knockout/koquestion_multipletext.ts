import * as ko from "knockout";
import {
  QuestionMultipleTextModel,
  MultipleTextItemModel
} from "../question_multipletext";
import { QuestionTextModel } from "../question_text";
import { QuestionImplementor } from "./koquestion";
import { QuestionText } from "./koquestion_text";
import { Question } from "../question";
import { Serializer } from "../jsonobject";
import { QuestionFactory } from "../questionfactory";

export class MultipleTextItem extends MultipleTextItemModel {
  constructor(public name: any = null, title: string = null) {
    super(name, title);
  }
  protected createEditor(name: string): QuestionTextModel {
    return new QuestionText(name);
  }
}

export class QuestionMultipleText extends QuestionMultipleTextModel {
  koRows: any;
  constructor(public name: string) {
    super(name);
    this.koRows = ko.observableArray(this.getRows());
    this.colCountChangedCallback = () => {
      this.onColCountChanged();
    };
    this.onColCountChanged();
  }
  protected onBaseCreating() {
    super.onBaseCreating();
    new QuestionImplementor(this);
  }
  protected onColCountChanged() {
    this.koRows(this.getRows());
  }
  protected createTextItem(name: string, title: string): MultipleTextItemModel {
    return new MultipleTextItem(name, title);
  }
}

Serializer.overrideClassCreator("multipletextitem", function() {
  return new MultipleTextItem("");
});

Serializer.overrideClassCreator("multipletext", function() {
  return new QuestionMultipleText("");
});

QuestionFactory.Instance.registerQuestion("multipletext", name => {
  var q = new QuestionMultipleText(name);
  q.addItem("text1");
  q.addItem("text2");
  return q;
});
