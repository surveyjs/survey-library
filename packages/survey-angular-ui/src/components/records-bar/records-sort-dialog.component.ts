import { Component, Input } from "@angular/core";
import { AngularComponentFactory } from "../../component-factory";
import { BaseAngular } from "../../base-angular";
import { ActionContainer, RecordsSortDialogModel } from "survey-core";

// The content of the "Sort by" dialog: one action bar per row (field, direction, remove).
@Component({
  selector: "sv-ng-records-sort-dialog",
  templateUrl: "./records-sort-dialog.component.html",
  styles: [":host { display: none }"]
})
export class RecordsSortDialogComponent extends BaseAngular<RecordsSortDialogModel> {
  @Input() model!: RecordsSortDialogModel;
  getModel(): RecordsSortDialogModel {
    return this.model;
  }
  public trackRowBy(_: number, row: ActionContainer): number {
    return row.uniqueId;
  }
}

AngularComponentFactory.Instance.registerComponent("sv-records-sort-dialog", RecordsSortDialogComponent);
