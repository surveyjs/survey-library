import * as ko from "knockout";
import { JsonObject } from "../jsonobject";
import { QuestionFactory } from "../questionfactory";
import { QuestionFileModel } from "../question_file";
import { QuestionImplementor } from "./koquestion";
import { Question } from "../question";

export class QuestionFileImplementor extends QuestionImplementor {
  koState = ko.observable<string>("empty");
  koHasValue = ko.computed(() => this.koState() === "loaded");
  koData = ko.computed(() => {
    if (this.koHasValue()) {
      return (<QuestionFileModel>this.question).previewValue;
    }
    return [];
  });
  koInputTitle = ko.observable<string>();

  constructor(question: Question) {
    super(question);
    var self = this;
    this.question["koData"] = this.koData;
    this.question["koHasValue"] = this.koHasValue;
    this.question["koInputTitle"] = this.koInputTitle;
    var updateState = state => {
      this.koState(state);
      this.koInputTitle((<QuestionFileModel>this.question).inputTitle);
    };
    (<QuestionFileModel>this.question).onStateChanged.add((sender, options) => {
      updateState(options.state);
    });
    this.question["dochange"] = (data, event) => {
      var src = event.target || event.srcElement;
      self.onChange(src);
    };
    this.question["doclean"] = (data, event) => {
      var src = event.target || event.srcElement;
      var input = src.parentElement.querySelectorAll("input")[0];
      (<QuestionFileModel>this.question).clear();
      input.value = "";
    };
  }
  protected updateValue(newValue: any) {
    super.updateValue(newValue);
  }
  private onChange(src: any) {
    if (!window["FileReader"]) return;
    if (!src || !src.files || src.files.length < 1) return;
    let files = [];
    for (let i = 0; i < src.files.length; i++) {
      files.push(src.files[i]);
    }
    (<QuestionFileModel>this.question).loadFiles(files);
  }
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
