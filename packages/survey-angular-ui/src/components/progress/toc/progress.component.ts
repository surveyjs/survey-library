import { Component, Input, OnChanges, OnInit, SimpleChanges, AfterViewInit, ChangeDetectorRef } from "@angular/core";
import { EmbeddedViewContentComponent } from "../../../embedded-view-content.component";
import { createTOCListModel, getTocRootCss, ListModel, SurveyModel, TOCModel } from "survey-core";
import { AngularComponentFactory } from "../../../component-factory";

@Component({
  selector: "sv-navigation-toc, sv-ng-navigation-toc",
  templateUrl: "./progress.component.html",
  styles: [":host { display: none; }"]
})
export class ProgressTocComponent extends EmbeddedViewContentComponent implements AfterViewInit, OnChanges, OnInit {
  @Input() survey!: SurveyModel;
  @Input() model!: TOCModel;
  override ngOnInit(): void {
    super.ngOnInit();
  }
  ngAfterViewInit() {
    this.model.updateStickyTOCSize(this.survey.rootElement);
  }
  ngOnChanges(changes: SimpleChanges): void {
  }
}
AngularComponentFactory.Instance.registerComponent("sv-navigation-toc", ProgressTocComponent);
