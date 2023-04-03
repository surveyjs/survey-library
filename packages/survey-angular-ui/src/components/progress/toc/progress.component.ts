import { Component, Input, OnChanges, OnInit, SimpleChanges, ChangeDetectorRef } from "@angular/core";
import { EmbeddedViewContentComponent } from "../../../embedded-view-content.component";
import { createTOCListModel, getTocRootCss, ListModel, SurveyModel } from "survey-core";
import { AngularComponentFactory } from "../../../component-factory";

@Component({
  selector: "sv-progress-toc, sv-ng-progress-toc",
  templateUrl: "./progress.component.html",
  styles: [":host { display: none; }"]
})
export class ProgressTocComponent extends EmbeddedViewContentComponent implements OnChanges, OnInit {
  public listModel!: ListModel;
  public containerCss = "sv_progress-toc";
  @Input() model!: SurveyModel;
  private createProgressTOCModel() {
    this.containerCss = getTocRootCss(this.model);
    this.listModel = createTOCListModel(this.model);
  }
  override ngOnInit(): void {
    super.ngOnInit();
    this.createProgressTOCModel();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.createProgressTOCModel();
  }
}
AngularComponentFactory.Instance.registerComponent("sv-progress-toc", ProgressTocComponent);
