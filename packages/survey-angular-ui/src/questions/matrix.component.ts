import { Component } from "@angular/core";
import { QuestionAngular } from "../question";
import { QuestionMatrixModel } from "survey-core";
import { AngularComponentFactory } from "../component-factory";

@Component({
  selector: "sv-ng-matrix-question",
  templateUrl: "./matrix.component.html",
  styleUrls: ["../hide-host.scss"]
})
export class MatrixQuestionComponent extends QuestionAngular<QuestionMatrixModel> {
  override ngOnInit() {
    this.model.visibleRowsChangedCallback = () => {
      this.detectChanges();
    };
    super.ngOnInit();
  }
  public onCellChanged(row: any, column: any): void {
    row.value = column.value;
    this.detectChanges();
  }
  trackRowByFn(i: number, row: any): string {
    return "column-" + row.name + "-" + i;
  }
  trackColumnByFn(i: number, column: any): string {
    return "column-" + column.value + "-" + i;
  }
}

AngularComponentFactory.Instance.registerComponent("matrix-question", MatrixQuestionComponent);