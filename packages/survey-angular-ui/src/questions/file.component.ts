import { Component, Pipe, PipeTransform } from "@angular/core";
import { QuestionAngular } from "../question";
import { QuestionFileModel } from "survey-core";
import { AngularComponentFactory } from "../component-factory";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";

@Component({
  selector: "sv-ng-file-question",
  templateUrl: "./file.component.html",
  styleUrls: []
})
export class FileQuestionComponent extends QuestionAngular<QuestionFileModel> {
  trackFilesFn: (index: number) => string = (index: number): string => {
    return this.model.inputId + "_" + index;
  }
}

AngularComponentFactory.Instance.registerComponent("file-question", FileQuestionComponent);