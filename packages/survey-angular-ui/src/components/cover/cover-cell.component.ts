import { Component, Input, ViewChild, ViewContainerRef } from "@angular/core";
import { BaseAngular } from "../../base-angular";
import { EmbeddedViewContentComponent } from "../../embedded-view-content.component";
import { AngularComponentFactory } from "../../component-factory";
import { Cover, CoverCell, SurveyModel } from "survey-core";

@Component({
  selector: "sv-ng-cover-cell",
  templateUrl: "./cover-cell.component.html",
  styles: [":host { display: none; }"],
})
export class CoverCellComponent extends EmbeddedViewContentComponent {
  @Input() model!: CoverCell;
  @ViewChild("actionContent", { read: ViewContainerRef, static: true }) actionContent!: ViewContainerRef;
}

AngularComponentFactory.Instance.registerComponent("sv-cover-cell", CoverCellComponent);