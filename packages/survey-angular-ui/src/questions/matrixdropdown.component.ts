import { Component } from "@angular/core";
import { QuestionAngular } from "../question";
import { QuestionMatrixDropdownModel } from "survey-core";
import { AngularComponentFactory } from "../component-factory";

@Component({
  selector: "sv-ng-matrixdropdown-question",
  templateUrl: "./matrixdropdown.component.html"
})
export class MatrixDropdownComponent extends QuestionAngular<QuestionMatrixDropdownModel> {}

AngularComponentFactory.Instance.registerComponent("matrixdropdown-question", MatrixDropdownComponent);