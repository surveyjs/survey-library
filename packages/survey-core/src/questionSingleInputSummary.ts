import { Action } from "./actions/action";
import { LocalizableString } from "./localizablestring";

export class QuestionSingleInputSummaryItem {
  constructor(public locText: LocalizableString, public btnEdit: Action, public btnRemove: Action) {
  }
}

export class QuestionSingleInputSummary {
  constructor(public noEntry: LocalizableString, public bntAdd: Action) {
  }
  public items: Array<QuestionSingleInputSummaryItem> = [];
  public dispose(): void {
    this.bntAdd?.dispose();
    this.items.forEach((item) => {
      item.btnEdit?.dispose();
      item.btnRemove?.dispose();
    });
  }
}