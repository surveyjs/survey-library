import { Component, Input } from "@angular/core";
import { QuestionMatrixDynamicModel } from "survey-core";
import { AngularComponentFactory } from "../../component-factory";

@Component({
  selector: "sv-ng-placeholder-matrixdynamic",
  templateUrl: "./matrixdynamicplaceholder.component.html"
})
export class MatrixDynamicPlaceholderComponent {
  @Input() question!: QuestionMatrixDynamicModel;

  addRowClick() {
    this.question.addRowUI();
  }
}
AngularComponentFactory.Instance.registerComponent("sv-ng-placeholder-matrixdynamic", MatrixDynamicPlaceholderComponent);