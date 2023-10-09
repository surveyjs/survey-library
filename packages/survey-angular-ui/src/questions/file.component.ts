import { Component } from "@angular/core";
import { QuestionAngular } from "../question";
import { QuestionFileModel } from "survey-core";
import { AngularComponentFactory } from "../component-factory";
@Component({
  selector: "sv-ng-file-question",
  templateUrl: "./file.component.html",
  styleUrls: []
})
export class FileQuestionComponent extends QuestionAngular<QuestionFileModel> {}

AngularComponentFactory.Instance.registerComponent("file-question", FileQuestionComponent);