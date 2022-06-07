import { Component, Input } from "@angular/core";
import { QuestionAngular } from "../question";
import { QuestionImagePickerModel, QuestionMatrixModel } from "survey-core";
import { AngularComponentFactory } from "../component-factory";

@Component({
  selector: "sv-ng-matrix-question",
  templateUrl: "./matrix.component.html"
})
export class MatrixQuestionComponent extends QuestionAngular<QuestionMatrixModel> {
  public onChange(row: any, column: any): void {
    if (this.model.isInputReadOnly) return;
    row.value = column.value;
  }
  trackRowByFn(i: number, row: any): string {
    return "column-" + row.name + "-" + i;
  }
  trackColumnByFn(i: number, column: any): string {
    return "column-" + column.value + "-" + i;
  }
}

AngularComponentFactory.Instance.registerComponent("matrix-question", MatrixQuestionComponent);