import { Action } from "./actions/action";
import { LocalizableString } from "./localizablestring";

export class QuestionSingleInputSummaryItem {
  constructor(public locText: LocalizableString, public btnEdit: Action, public btnRemove: Action) {
  }
  public get showRemove(): boolean { return !!this.btnRemove; }
}

export class QuestionSingleInputSummary {
  constructor(public noEntry: LocalizableString) {
  }
  public items: Array<QuestionSingleInputSummaryItem> = [];
  public dispose(): void {
    this.items.forEach((item) => {
      item.btnEdit?.dispose();
      item.btnRemove?.dispose();
    });
  }
}