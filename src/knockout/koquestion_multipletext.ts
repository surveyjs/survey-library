import * as ko from "knockout";
import { QuestionMultipleTextModel, MultipleTextItemModel } from "survey-core";
import { QuestionTextModel } from "survey-core";
import { QuestionImplementor } from "./koquestion";
import { QuestionTextImplementor } from "./koquestion_text";
import { Serializer } from "survey-core";
import { QuestionFactory } from "survey-core";
import { MultipleTextEditorModel } from "survey-core";
import { MutlipleTextRow } from "survey-core";
import { ImplementorBase } from "./kobase";

export class koMultipleTextEditorModel extends MultipleTextEditorModel {
  private _implementor: QuestionTextImplementor;
  constructor(name: string) {
    super(name);
  }
  protected onBaseCreating() {
    super.onBaseCreating();
    this._implementor = new QuestionTextImplementor(this);
  }
  public dispose(): void {
    this._implementor.dispose();
    this._implementor = undefined;
    super.dispose();
  }
}

export class MultipleTextItem extends MultipleTextItemModel {
  constructor(name: any = null, title: string = null) {
    super(name, title);
  }
  protected createEditor(name: string): QuestionTextModel {
    return new koMultipleTextEditorModel(name);
  }
}

export class QuestionMultipleTextImplementor extends QuestionImplementor {
    koRecalc: any;
    constructor(question: QuestionMultipleText) {
      super(question);
      this.koRecalc = ko.observable(0);
      this.setObservaleObj(
        "koItemCss",
        ko.pureComputed(() => {
          this.koRecalc();
          return this.question.getItemCss();
        })
      );
      this.setObservaleObj(
        "koItemTitleCss",
        ko.pureComputed(() => {
          this.koRecalc();
          return this.question.getItemTitleCss();
        })
      );
    }
}

export class QuestionMultipleText extends QuestionMultipleTextModel {
  private _implementor: QuestionMultipleTextImplementor;
  koRows: any;
  constructor(name: string) {
    super(name);
  }
  protected onBaseCreating() {
    super.onBaseCreating();
    this._implementor = new QuestionMultipleTextImplementor(this);
  }
  protected onRowCreated(row: MutlipleTextRow): MutlipleTextRow {
    new ImplementorBase(row);
    return row;
  }
  protected createTextItem(name: string, title: string): MultipleTextItemModel {
    return new MultipleTextItem(name, title);
  }
  public dispose(): void {
    this._implementor.dispose();
    this._implementor = undefined;
    this.koRows = undefined;
    super.dispose();
  }
}

Serializer.overrideClassCreator("multipletextitem", function() {
  return new MultipleTextItem("");
});

Serializer.overrideClassCreator("multipletext", function() {
  return new QuestionMultipleText("");
});

QuestionFactory.Instance.registerQuestion("multipletext", name => {
  var q = new QuestionMultipleText(name);
  QuestionMultipleTextModel.addDefaultItems(q);
  return q;
});
