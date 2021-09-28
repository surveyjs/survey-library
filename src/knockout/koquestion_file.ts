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
import { getOriginalEvent } from "../utils/utils";

class QuestionFileImplementor extends QuestionImplementor {
  constructor(question: QuestionFile) {
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
      this.question.onDrop(getOriginalEvent(event));
    });
    this.setCallbackFunc("ondragover", (data: any, event: any) => {
      this.question.onDragOver(getOriginalEvent(event));
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
