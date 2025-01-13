import { MultipleTextCell, MultipleTextItemModel, MutlipleTextRow, QuestionMultipleTextModel, QuestionTextModel } from "survey-core";
import { Component, Input } from "@angular/core";
import { BaseAngular } from "../base-angular";

@Component({
  selector: "sv-ng-multipletext-row",
  templateUrl: "./multipletextrow.component.html",
  styleUrls: ["../hide-host.scss"]
})
export class MultipleTextRowComponent extends BaseAngular<MutlipleTextRow> {
  @Input() question!: QuestionMultipleTextModel;
  @Input() model!: MutlipleTextRow;
  protected getModel(): MutlipleTextRow {
    return this.model;
  }
  trackItemBy (_: number, cell: MultipleTextCell): string {
    return "item" + cell.item.editor.id;
  }
}
