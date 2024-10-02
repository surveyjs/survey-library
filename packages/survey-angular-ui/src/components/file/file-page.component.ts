import { Component, Input } from "@angular/core";
import { BaseAngular } from "../../base-angular";
import { QuestionFileModel, QuestionFilePage } from "survey-core";

@Component({
    templateUrl: "./file-page.component.html",
    selector: "sv-ng-file-page",
    styleUrls: ["../../hide-host.scss"]
})
export class FilePageComponent extends BaseAngular<QuestionFilePage> {
    @Input() page!: QuestionFilePage;
    @Input() question!: QuestionFileModel;
    protected override getModel() {
        return this.page;
    }
}