import * as ko from "knockout";
import { JsonObject } from "../jsonobject";
import { QuestionFactory } from "../questionfactory";
import { QuestionFileModel } from "../question_file";
import { QuestionImplementor } from "./koquestion";
import { Question } from "../question";

export class QuestionFileImplementor extends QuestionImplementor {
  koDataUpdater = ko.observable(0);
  koData: any;
  koHasValue = ko.observable(false);
  constructor(question: Question) {
    super(question);
    var self = this;
    this.koData = ko.computed(() => {
      self.koDataUpdater();
      return (<QuestionFileModel>self.question).previewValue;
    });
    this.question["koData"] = this.koData;
    this.question["koHasValue"] = this.koHasValue;
    (<QuestionFileModel>this.question).previewValueLoadedCallback =
      self.onLoadPreview;
    this.question["dochange"] = (data, event) => {
      var src = event.target || event.srcElement;
      self.onChange(src);
    };
    this.question["doclean"] = (data, event) => {
      var src = event.target || event.srcElement;
      (<QuestionFileModel>this.question).clear();
      src.parentElement.querySelectorAll("input")[0].value = "";
      this.koHasValue(false);
    };
  }
  private onChange(src: any) {
    if (!window["FileReader"]) return;
    if (!src || !src.files || src.files.length < 1) return;
    let files = [];
    for (let i = 0; i < src.files.length; i++) {
      files.push(src.files[i]);
    }
    (<QuestionFileModel>this.question).loadFiles(files);
    this.koHasValue(true);
  }
  onLoadPreview = () => {
    this.koDataUpdater(this.koDataUpdater() + 1);
  };
}

export class QuestionFile extends QuestionFileModel {
  constructor(public name: string) {
    super(name);
    new QuestionFileImplementor(this);
  }
}

JsonObject.metaData.overrideClassCreatore("file", function() {
  return new QuestionFile("");
});
QuestionFactory.Instance.registerQuestion("file", name => {
  return new QuestionFile(name);
});
