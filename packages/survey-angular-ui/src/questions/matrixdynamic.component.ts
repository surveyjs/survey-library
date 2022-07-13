import { Component, Input } from "@angular/core";
import { QuestionAngular } from "../question";
import { QuestionImagePickerModel, QuestionMatrixDropdownModel, QuestionMatrixDynamicModel } from "survey-core";
import { AngularComponentFactory } from "../component-factory";

@Component({
  selector: "sv-ng-matrixdynamic-question",
  templateUrl: "./matrixdynamic.component.html"
})
export class MatrixDynamicComponent extends QuestionAngular<QuestionMatrixDynamicModel> {
  override ngOnDestroy(): void {
    super.ngOnDestroy();
    debugger;
  }
}

AngularComponentFactory.Instance.registerComponent("matrixdynamic-question", MatrixDynamicComponent);