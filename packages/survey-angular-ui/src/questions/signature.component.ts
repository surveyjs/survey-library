import { Component } from "@angular/core";
import { QuestionAngular } from "../question";
import { QuestionSignaturePadModel } from "survey-core";
import { AngularComponentFactory } from "../component-factory";

@Component({
  selector: "sv-ng-signature-component",
  templateUrl: "./signature.component.html"
  })
export class SignaturePadQuestionComponent extends QuestionAngular<QuestionSignaturePadModel> {}

AngularComponentFactory.Instance.registerComponent("signaturepad-question", SignaturePadQuestionComponent);