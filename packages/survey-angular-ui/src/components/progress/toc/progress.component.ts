import { Component, Input, OnChanges, OnInit, SimpleChanges, ChangeDetectorRef } from "@angular/core";
import { createTOCListModel, ListModel, SurveyModel } from "survey-core";
import { AngularComponentFactory } from "../../../component-factory";

@Component({
  selector: "sv-progress-toc, sv-ng-progress-toc",
  templateUrl: "./progress.component.html"
  })
export class ProgressTocComponent implements OnChanges, OnInit {
  public listModel!: ListModel;
  public containerCss = "sv_progress-toc";
  @Input() model!: SurveyModel;
  private createProgressTOCModel() {
    this.listModel = createTOCListModel(this.model);
  }
  ngOnInit(): void {
    this.createProgressTOCModel();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.createProgressTOCModel();
  }
}
AngularComponentFactory.Instance.registerComponent("sv-progress-toc", ProgressTocComponent);
