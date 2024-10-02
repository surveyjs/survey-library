import { Component, Input } from "@angular/core";
import { EmbeddedViewContentComponent } from "../../embedded-view-content.component";
import { QuestionFileModel } from "survey-core";

@Component({
  templateUrl: "./file-item.component.html",
  selector: "sv-ng-file-item",
  styleUrls: ["../../hide-host.scss"]
})
export class FileItemComponent extends EmbeddedViewContentComponent {
    @Input() item!: any;
    @Input() question!: QuestionFileModel;
}