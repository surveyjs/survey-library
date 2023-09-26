import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import { AngularComponentFactory } from "../../component-factory";
import { BaseAngular } from "../../base-angular";
import { Cover, CoverCell, SurveyModel } from "survey-core";

@Component({
  selector: "sv-cover, sv-ng-cover",
  templateUrl: "./cover.component.html",
  styles: [":host { display: none }"]
})
export class CoverComponent extends BaseAngular<Cover> {
  @Input() model!: Cover;
  @Input() survey!: SurveyModel;
  @ViewChild("container") container!: ElementRef<HTMLDivElement>;
  getModel(): Cover {
    this.model.survey = this.survey;
    return this.model;
  }
}

AngularComponentFactory.Instance.registerComponent("sv-cover", CoverComponent);