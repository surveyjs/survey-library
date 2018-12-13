import * as ko from "knockout";
import {
  QuestionMultipleTextModel,
  MultipleTextItemModel
} from "../question_multipletext";
import { QuestionTextModel } from "../question_text";
import { QuestionImplementor } from "./koquestion";
import { QuestionText } from "./koquestion_text";
import { Question } from "../question";
import { JsonObject } from "../jsonobject";
import { QuestionFactory } from "../questionfactory";

export class MultipleTextItem extends MultipleTextItemModel {
  constructor(public name: any = null, title: string = null) {
    super(name, title);
  }
  protected createEditor(name: string): QuestionTextModel {
    return new QuestionText(name);
  }
}

export class QuestionMultipleTextImplementor extends QuestionImplementor {
  koRows: any;
  constructor(question: Question) {
    super(question);
    this.koRows = ko.observableArray(
      (<QuestionMultipleTextModel>this.question).getRows()
    );
    (<any>this.question)["koRows"] = this.koRows;
    this.onColCountChanged();
    var self = this;
    (<QuestionMultipleTextModel>this
      .question).colCountChangedCallback = function() {
      self.onColCountChanged();
    };
  }
  protected onColCountChanged() {
    this.koRows((<QuestionMultipleTextModel>this.question).getRows());
  }
}

export class QuestionMultipleText extends QuestionMultipleTextModel {
  constructor(public name: string) {
    super(name);
    new QuestionMultipleTextImplementor(this);
  }
  protected createTextItem(name: string, title: string): MultipleTextItemModel {
    return new MultipleTextItem(name, title);
  }
}

JsonObject.metaData.overrideClassCreatore("multipletextitem", function() {
  return new MultipleTextItem("");
});

JsonObject.metaData.overrideClassCreatore("multipletext", function() {
  return new QuestionMultipleText("");
});

QuestionFactory.Instance.registerQuestion("multipletext", name => {
  var q = new QuestionMultipleText(name);
  q.addItem("text1");
  q.addItem("text2");
  return q;
});
