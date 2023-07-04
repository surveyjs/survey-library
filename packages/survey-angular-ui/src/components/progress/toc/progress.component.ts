import { Component, Input, OnChanges, OnInit, SimpleChanges, ChangeDetectorRef } from "@angular/core";
import { EmbeddedViewContentComponent } from "../../../embedded-view-content.component";
import { createTOCListModel, getTocRootCss, ListModel, SurveyModel, TOCModel } from "survey-core";
import { AngularComponentFactory } from "../../../component-factory";

@Component({
  selector: "sv-progress-toc, sv-ng-progress-toc",
  templateUrl: "./progress.component.html",
  styles: [":host { display: none; }"]
})
export class ProgressTocComponent extends EmbeddedViewContentComponent implements OnChanges, OnInit {
  public tocModel!: TOCModel;
  @Input() model!: SurveyModel;
  private createProgressTOCModel() {
    this.tocModel = new TOCModel(this.model);
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
