import { Component, Input, ViewChild, ViewContainerRef } from "@angular/core";
import { BaseAngular } from "../../base-angular";
import { EmbeddedViewContentComponent } from "../../embedded-view-content.component";
import { AngularComponentFactory } from "../../component-factory";
import { Cover, CoverCell, SurveyModel } from "survey-core";

@Component({
  selector: "sv-ng-header-cell",
  templateUrl: "./header-cell.component.html",
  styles: [":host { display: none; }"],
})
export class HeaderCellComponent extends EmbeddedViewContentComponent {
  @Input() model!: CoverCell;
  @ViewChild("actionContent", { read: ViewContainerRef, static: true }) actionContent!: ViewContainerRef;
}

AngularComponentFactory.Instance.registerComponent("sv-header-cell", HeaderCellComponent);