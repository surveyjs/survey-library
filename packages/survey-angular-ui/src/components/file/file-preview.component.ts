import { Action, QuestionFileModel } from "survey-core";
import { AngularComponentFactory } from "../../component-factory";
import { Component, Input } from "@angular/core";
import { EmbeddedViewContentComponent } from "../../embedded-view-content.component";
@Component({
  selector: "sv-ng-file-preview",
  templateUrl: "./file-preview.component.html"
})
export class FilePreviewComponent extends EmbeddedViewContentComponent {
    @Input() question!: QuestionFileModel;
    trackFilesFn: (index: number) => string = (index: number): string => {
      return this.question.inputId + "_" + index;
    }
}
AngularComponentFactory.Instance.registerComponent("sv-file-preview", FilePreviewComponent);