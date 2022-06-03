import { Component, Input } from "@angular/core";
import { PageModel, QuestionRowModel } from "survey-core";
import { BaseAngular } from "./base-angular";
@Component({
  selector: "sv-ng-row, '[sv-ng-row]'",
  templateUrl: "./row.component.html",
})
export class RowComponent extends BaseAngular<QuestionRowModel> {
  @Input() row!: QuestionRowModel;
  protected getModel(): QuestionRowModel {
    return this.row;
  }
}