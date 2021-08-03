import * as ko from "knockout";
import { Serializer,
      Question,
      QuestionFactory,
      QuestionFileModel,
      confirmAction,
      detectIEOrEdge,
      loadFileFromBase64
} from "survey-core";
import { QuestionImplementor } from "./koquestion";

class QuestionFileImplementor extends QuestionImplementor {
  constructor(question: Question) {
    super(question);
    this.setObservaleObj("koState", ko.observable<string>("empty"));
    this.setObservaleObj(
      "koHasValue",
      ko.computed(() => this.question.koState() === "loaded")
    );
    this.setObservaleObj(
      "koData",
      ko.computed(() => {
        if (this.question.koHasValue()) {
          return this.question.previewValue;
        }
        return [];
      })
    );
    this.setObservaleObj("koInputTitle", ko.observable<string>());
    this.setObservaleObj(
      "koChooseFileCss",
      ko.pureComputed(() => {
          return this.question.getChooseFileCss();
      })
    );
    this.setCallbackFunc("ondrop", (data: any, event: any) => {
      if (this.question.isReadOnly) return false;
      event.preventDefault();
      let src = event.originalEvent
        ? event.originalEvent.dataTransfer
        : event.dataTransfer;
      this.onChange(src);
    });
    this.setCallbackFunc("ondragover", (data: any, event: any) => {
      if (this.question.isReadOnly) {
        event.returnValue = false;
        return false;
      }
      let dataTransfer = event.originalEvent
        ? event.originalEvent.dataTransfer
        : event.dataTransfer;
      dataTransfer.dropEffect = "copy";
      event.preventDefault();
    });
    this.setCallbackFunc("dochange", (data: any, event: any) => {
      var src = event.target || event.srcElement;
      this.onChange(src);
    });
    this.setCallbackFunc("doclean", (data: any, event: any) => {
      var src = event.target || event.srcElement;
      if (this.question.needConfirmRemoveFile) {
        var isConfirmed = confirmAction(this.question.confirmRemoveAllMessage);
        if (!isConfirmed) return;
      }
      var input = src.parentElement.querySelectorAll("input")[0];
      this.question.clear();
      input.value = "";
    });
    this.setCallbackFunc("doremovefile", (data: any, event: any) => {
      if (this.question.needConfirmRemoveFile) {
        var isConfirmed = confirmAction(
          this.question.getConfirmRemoveMessage(data.name)
        );
        if (!isConfirmed) return;
      }
      this.question.removeFile(data);
    });
    this.setCallbackFunc("dodownload", (data: any, event: any) => {
      if (detectIEOrEdge()) {
        loadFileFromBase64(data.content, data.name);
      } else {
        return true;
      }
    });
  }
  private onChange(src: any) {
    if (!(<any>window)["FileReader"]) return;
    if (!src || !src.files || src.files.length < 1) return;
    let files = [];
    let allowCount = this.question.allowMultiple ? src.files.length : 1;
    for (let i = 0; i < allowCount; i++) {
      files.push(src.files[i]);
    }
    src.value = "";
    this.question.loadFiles(files);
  }
}

export class QuestionFile extends QuestionFileModel {
  private _implementor: QuestionFileImplementor;
  constructor(name: string) {
    super(name);
    var updateState = (state: any) => {
      this.koState(state);
      this.koInputTitle(this.inputTitle);
    };
    this.onStateChanged.add((sender, options) => {
      updateState(options.state);
    });
  }
  protected onBaseCreating() {
    super.onBaseCreating();
    this._implementor = new QuestionFileImplementor(this);
  }
  public dispose() {
    this._implementor.dispose();
    this._implementor = undefined;
    super.dispose();
  }
}

Serializer.overrideClassCreator("file", function() {
  return new QuestionFile("");
});
QuestionFactory.Instance.registerQuestion("file", name => {
  return new QuestionFile(name);
});
