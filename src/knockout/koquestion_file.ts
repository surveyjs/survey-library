import * as ko from "knockout";
import { Serializer } from "../jsonobject";
import { QuestionFactory } from "../questionfactory";
import { QuestionFileModel } from "../question_file";
import { QuestionImplementor } from "./koquestion";
import { Question } from "../question";
import {
  confirmAction,
  detectIEOrEdge,
  loadFileFromBase64
} from "../utils/utils";

export class QuestionFile extends QuestionFileModel {
  koState: any = ko.observable<string>("empty");
  koHasValue: any = ko.computed(() => this.koState() === "loaded");
  koData: any = ko.computed(() => {
    if (this.koHasValue()) {
      return this.previewValue;
    }
    return [];
  });
  koInputTitle: any = ko.observable<string>();
  koChooseFileClass: any = ko.pureComputed(() => {
    return (
      this.koCss().chooseFile +
      (this.isReadOnly ? " " + this.koCss().disabled : "")
    );
  });
  constructor(public name: string) {
    super(name);
    var self = this;
    var updateState = (state: any) => {
      this.koState(state);
      this.koInputTitle(this.inputTitle);
    };
    this.onStateChanged.add((sender, options) => {
      updateState(options.state);
    });
    (<any>this)["ondrop"] = (data: any, event: any) => {
      event.preventDefault();
      let src = event.originalEvent
        ? event.originalEvent.dataTransfer
        : event.dataTransfer;
      this.onChange(src);
    };
    (<any>this)["ondragover"] = (data: any, event: any) => {
      event.preventDefault();
    };
    (<any>this)["dochange"] = (data: any, event: any) => {
      var src = event.target || event.srcElement;
      self.onChange(src);
    };
    (<any>this)["doclean"] = (data: any, event: any) => {
      var src = event.target || event.srcElement;
      if (this.needConfirmRemoveFile) {
        var isConfirmed = confirmAction(this.confirmRemoveAllMessage);
        if (!isConfirmed) return;
      }
      var input = src.parentElement.querySelectorAll("input")[0];
      this.clear();
      input.value = "";
    };
    (<any>this)["doremovefile"] = (data: any, event: any) => {
      if (this.needConfirmRemoveFile) {
        var isConfirmed = confirmAction(
          this.getConfirmRemoveMessage(data.name)
        );
        if (!isConfirmed) return;
      }
      this.removeFile(data);
    };
    (<any>this)["dodownload"] = (data: any, event: any) => {
      if (detectIEOrEdge()) {
        loadFileFromBase64(data.content, data.name);
      } else {
        return true;
      }
    };
  }
  protected onBaseCreating() {
    super.onBaseCreating();
    new QuestionImplementor(this);
  }
  private onChange(src: any) {
    if (!(<any>window)["FileReader"]) return;
    if (!src || !src.files || src.files.length < 1) return;
    let files = [];
    let allowCount = this.allowMultiple ? src.files.length : 1;
    for (let i = 0; i < allowCount; i++) {
      files.push(src.files[i]);
    }
    src.value = "";
    this.loadFiles(files);
  }
}

Serializer.overrideClassCreator("file", function() {
  return new QuestionFile("");
});
QuestionFactory.Instance.registerQuestion("file", name => {
  return new QuestionFile(name);
});
