import { Component, Input } from "@angular/core";
import { PanelModel, Question, QuestionRowModel } from "survey-core";
import { BaseAngular } from "./base-angular";
@Component({
  selector: "sv-ng-row",
  templateUrl: "./row.component.html",
})
export class RowComponent extends BaseAngular<QuestionRowModel> {
  @Input() row!: QuestionRowModel;
  protected getModel(): QuestionRowModel {
    return this.row;
  }
  trackElementBy (index: number, element: Question | PanelModel): string {
    return element.name + index;
  }
}