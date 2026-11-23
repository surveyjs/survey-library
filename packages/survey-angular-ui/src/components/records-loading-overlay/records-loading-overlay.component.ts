import { Component, Input } from "@angular/core";
import { QuestionRecordsModel } from "survey-core";
import { BaseAngular } from "../../base-angular";
import { AngularComponentFactory } from "../../component-factory";
import { SurveyBaseProviders } from "../../component-depth";

// Covers the records of a question while its data source reads a page (QuestionRecordsModel.isDataLoading).
@Component({
  providers: SurveyBaseProviders,
  selector: "sv-ng-records-loading-overlay",
  templateUrl: "./records-loading-overlay.component.html",
  styleUrls: ["../../hide-host.scss"],
})
export class RecordsLoadingOverlayComponent extends BaseAngular {
  @Input() question!: QuestionRecordsModel;

  getModel() {
    return this.question;
  }
}

AngularComponentFactory.Instance.registerComponent("sv-records-loading-overlay", RecordsLoadingOverlayComponent);
