import * as ko from "knockout";
import { Serializer, QuestionFactory, QuestionFileModel, getOriginalEvent } from "survey-core";
import { QuestionImplementor } from "./koquestion";

class QuestionFileImplementor extends QuestionImplementor {
  public koRecalc: any;
  constructor(question: QuestionFile) {
    super(question);
    this.koRecalc = ko.observable(0);
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
    this.setObservaleObj("ko", ko.observable<string>());
    this.setObservaleObj("koInputTitle", ko.computed<string>(() => {
      this.koRecalc();
      return this.question.inputTitle;
    }));
    this.setObservaleObj(
      "koChooseFileCss",
      ko.pureComputed(() => {
        return this.question.getChooseFileCss();
      })
    );
    this.setCallbackFunc("koGetChooseButtonText", () => {
      this.question.koState();
      return this.question.chooseButtonText;
    });
    this.setCallbackFunc("ondrop", (data: any, event: any) => {
      this.question.onDrop(getOriginalEvent(event));
    });
    this.setCallbackFunc("ondragover", (data: any, event: any) => {
      this.question.onDragOver(getOriginalEvent(event));
    });
    this.setCallbackFunc("ondragenter", (data: any, event: any) => {
      this.question.onDragEnter(getOriginalEvent(event));
    });
    this.setCallbackFunc("ondragleave", (data: any, event: any) => {
      this.question.onDragLeave(getOriginalEvent(event));
    });
    this.setCallbackFunc("dochange", (data: any, event: any) => {
      this.question.doChange(getOriginalEvent(event));
    });
    this.setCallbackFunc("doclean", (data: any, event: any) => {
      this.question.doClean(getOriginalEvent(event));
    });
    this.setCallbackFunc("doremovefile", (data: any, event: any) => {
      this.question.doRemoveFile(data);
    });
    this.setCallbackFunc("dodownload", (data: any, event: any) => {
      this.question.doDownloadFile(getOriginalEvent(event), data);
      return true;
    });
  }
}

export class QuestionFile extends QuestionFileModel {
  private _implementor: QuestionFileImplementor;
  private updateState = (sender: QuestionFileModel, options: any) => {
    this.koState(options.state);
    this._implementor.koRecalc(this._implementor.koRecalc() + 1);
  };
  constructor(name: string) {
    super(name);
    this.onUploadStateChanged.add(this.updateState);
    this.updateState(this, { state: this.currentState });
  }
  protected onBaseCreating() {
    super.onBaseCreating();
    this._implementor = new QuestionFileImplementor(this);
  }
  public dispose(): void {
    this.onUploadStateChanged.remove(this.updateState);
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
