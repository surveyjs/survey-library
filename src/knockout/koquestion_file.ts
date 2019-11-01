import * as ko from "knockout";
import { Serializer } from "../jsonobject";
import { QuestionFactory } from "../questionfactory";
import { QuestionFileModel } from "../question_file";
import { QuestionImplementor } from "./koquestion";
import { Question } from "../question";
import { confirmAction } from "../utils/utils";

export class QuestionFileImplementor extends QuestionImplementor {
  koState: any = ko.observable<string>("empty");
  koHasValue: any = ko.computed(() => this.koState() === "loaded");
  koData: any = ko.computed(() => {
    if (this.koHasValue()) {
      return (<QuestionFileModel>this.question).previewValue;
    }
    return [];
  });
  koInputTitle: any = ko.observable<string>();
  koChooseFileClass: any = ko.pureComputed(() => {
    return (
      this.question.koCss().chooseFile +
      (this.question.isReadOnly ? " " + this.question.koCss().disabled : "")
    );
  });
  constructor(question: Question) {
    super(question);
    var self = this;
    (<any>this.question)["koData"] = this.koData;
    (<any>this.question)["koHasValue"] = this.koHasValue;
    (<any>this.question)["koInputTitle"] = this.koInputTitle;
    (<any>this.question)["koChooseFileClass"] = this.koChooseFileClass;
    var updateState = (state: any) => {
      this.koState(state);
      this.koInputTitle((<QuestionFileModel>this.question).inputTitle);
    };
    (<QuestionFileModel>this.question).onStateChanged.add((sender, options) => {
      updateState(options.state);
    });
    (<any>this.question)["ondrop"] = (data: any, event: any) => {
      event.preventDefault();
      let src = event.originalEvent
        ? event.originalEvent.dataTransfer
        : event.dataTransfer;
      this.onChange(src);
    };
    (<any>this.question)["ondragover"] = (data: any, event: any) => {
      event.preventDefault();
    };
    (<any>this.question)["dochange"] = (data: any, event: any) => {
      var src = event.target || event.srcElement;
      self.onChange(src);
    };
    (<any>this.question)["doclean"] = (data: any, event: any) => {
      var src = event.target || event.srcElement;
      if (question.needConfirmRemoveFile) {
        var isConfirmed = confirmAction(question.confirmRemoveAllMessage);
        if (!isConfirmed) return;
      }
      var input = src.parentElement.querySelectorAll("input")[0];
      (<QuestionFileModel>this.question).clear();
      input.value = "";
    };
    (<any>this.question)["doremovefile"] = (data: any, event: any) => {
      if (question.needConfirmRemoveFile) {
        var isConfirmed = confirmAction(question.getConfirmRemoveMessage(data.name));
        if (!isConfirmed) return;
      }
      (<QuestionFileModel>this.question).removeFile(data);
    };
  }
  private onChange(src: any) {
    if (!(<any>window)["FileReader"]) return;
    if (!src || !src.files || src.files.length < 1) return;
    let files = [];
    let allowCount = (<QuestionFileModel>this.question).allowMultiple
      ? src.files.length
      : 1;
    for (let i = 0; i < allowCount; i++) {
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

Serializer.overrideClassCreator("file", function() {
  return new QuestionFile("");
});
QuestionFactory.Instance.registerQuestion("file", name => {
  return new QuestionFile(name);
});
