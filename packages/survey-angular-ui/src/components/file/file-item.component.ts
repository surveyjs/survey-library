import { Component, Input } from "@angular/core";
import { EmbeddedViewContentComponent } from "../../embedded-view-content.component";
import { QuestionFileModel } from "survey-core";
import { AngularComponentFactory } from "../../component-factory";

@Component({
  templateUrl: "./file-item.component.html",
  selector: "sv-ng-file-item",
  styleUrls: ["../../hide-host.scss"]
})
export class FileItemComponent extends EmbeddedViewContentComponent {
    @Input() item!: any;
    @Input() question!: QuestionFileModel;
}

AngularComponentFactory.Instance.registerComponent("sv-file-item", FileItemComponent);