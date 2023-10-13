import { Action, QuestionFileModel } from "survey-core";
import { AngularComponentFactory } from "../../component-factory";
import { Component, Input } from "@angular/core";
import { EmbeddedViewContentComponent } from "../../embedded-view-content.component";
@Component({
  selector: "sv-ng-choose-file-btn",
  templateUrl: "./choose-file.component.html"
})
export class ChooseFileBtn extends EmbeddedViewContentComponent {
    @Input() data: any;
    @Input() model!: Action;
    public get question(): QuestionFileModel {
      return (this.model && this.model.data.question) || this.data.question;
    }
}
AngularComponentFactory.Instance.registerComponent("sv-file-choose-btn", ChooseFileBtn);