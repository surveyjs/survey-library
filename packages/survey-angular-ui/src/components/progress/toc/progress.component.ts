import { Component, Input, OnChanges, OnInit, SimpleChanges, ChangeDetectorRef } from "@angular/core";
import { EmbeddedViewContentComponent } from "../../../embedded-view-content.component";
import { createTOCListModel, getTocRootCss, ListModel, SurveyModel, TOCModel } from "survey-core";
import { AngularComponentFactory } from "../../../component-factory";

@Component({
  selector: "sv-navigation-toc, sv-ng-navigation-toc",
  templateUrl: "./progress.component.html",
  styles: [":host { display: none; }"]
})
export class ProgressTocComponent extends EmbeddedViewContentComponent implements OnChanges, OnInit {
  @Input() model!: TOCModel;
  override ngOnInit(): void {
    super.ngOnInit();
  }
  ngOnChanges(changes: SimpleChanges): void {
  }
}
AngularComponentFactory.Instance.registerComponent("sv-navigation-toc", ProgressTocComponent);
