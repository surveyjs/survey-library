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
    (<any>this.question)["koData"] = this.koData;
    (<any>this.question)["koHasValue"] = this.koHasValue;
    (<any>this.question)["koInputTitle"] = this.koInputTitle;
    var updateState = (state:any) => {
      this.koState(state);
      this.koInputTitle((<QuestionFileModel>this.question).inputTitle);
    };
    (<QuestionFileModel>this.question).onStateChanged.add((sender, options) => {
      updateState(options.state);
    });
    (<any>this.question)["dochange"] = (data:any, event:any) => {
      var src = event.target || event.srcElement;
      self.onChange(src);
    };
    (<any>this.question)["doclean"] = (data:any, event:any) => {
      var src = event.target || event.srcElement;
      var input = src.parentElement.querySelectorAll("input")[0];
      (<QuestionFileModel>this.question).clear();
      input.value = "";
    };
    (<any>this.question)["doremovefile"] = (data:any, event:any) => {
      (<QuestionFileModel>this.question).removeFile(data);
    };
  }
  protected updateValue(newValue: any) {
    super.updateValue(newValue);
  }
  private onChange(src: any) {
    if (!(<any>window)["FileReader"]) return;
    if (!src || !src.files || src.files.length < 1) return;
    let files = [];
    for (let i = 0; i < src.files.length; i++) {
      files.push(src.files[i]);
    }
    src.value = "";
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
