import { Component } from "@angular/core";
import { QuestionAngular } from "../question";
import { QuestionMatrixModel } from "survey-core";
import { AngularComponentFactory } from "../component-factory";
import { SurveyBaseProviders } from "../component-depth";

@Component({
  providers: SurveyBaseProviders,
  selector: "sv-ng-matrix-question",
  templateUrl: "./matrix.component.html",
  styleUrls: ["../hide-host.scss"]
})
export class MatrixQuestionComponent extends QuestionAngular<QuestionMatrixModel> {
  override ngOnInit() {
    this.model.visibleRowsChangedCallback = () => {
      this.update();
    };
    super.ngOnInit();
  }
  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.model.visibleRowsChangedCallback = () => {};
  }
  public onCellChanged(row: any, column: any): void {
    row.cellClick(column);
    this.update();
  }
  trackRowByFn(i: number, row: any): string {
    return row.uniqueId;
  }
  trackColumnByFn(i: number, column: any): string {
    return column.uniqueId;
  }
}

AngularComponentFactory.Instance.registerComponent("matrix-question", MatrixQuestionComponent);