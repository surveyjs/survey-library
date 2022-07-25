import { Component, Input } from "@angular/core";
import { IElement, QuestionRowModel } from "survey-core";
import { BaseAngular } from "./base-angular";
@Component({
  selector: "sv-ng-row",
  templateUrl: "./row.component.html",
  styleUrls: ["./hide-host.scss"]
})
export class RowComponent extends BaseAngular<QuestionRowModel> {
  @Input() row!: QuestionRowModel;
  protected getModel(): QuestionRowModel {
    return this.row;
  }
  trackElementBy (index: number, element: IElement): string {
    return element.name + index;
  }
}