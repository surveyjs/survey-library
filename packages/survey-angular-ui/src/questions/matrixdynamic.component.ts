import { Component } from "@angular/core";
import { QuestionAngular } from "../question";
import { QuestionMatrixDynamicModel } from "survey-core";
import { AngularComponentFactory } from "../component-factory";

@Component({
  selector: "sv-ng-matrixdynamic-question",
  templateUrl: "./matrixdynamic.component.html"
})
export class MatrixDynamicComponent extends QuestionAngular<QuestionMatrixDynamicModel> {}

AngularComponentFactory.Instance.registerComponent("matrixdynamic-question", MatrixDynamicComponent);