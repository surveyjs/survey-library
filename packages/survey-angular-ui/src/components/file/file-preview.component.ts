import { Action, QuestionFileModel, QuestionFilePage } from "survey-core";
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
    trackPagesFn(_: number, page: QuestionFilePage): string {
      return page.id;
    }
}
AngularComponentFactory.Instance.registerComponent("sv-file-preview", FilePreviewComponent);