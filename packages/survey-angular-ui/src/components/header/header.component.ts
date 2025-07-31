import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import { AngularComponentFactory } from "../../component-factory";
import { BaseAngular } from "../../base-angular";
import { Cover, CoverCell, SurveyModel } from "survey-core";

@Component({
  selector: "sv-header, sv-ng-header",
  templateUrl: "./header.component.html",
  styles: [":host { display: none }"]
})
export class HeaderComponent extends BaseAngular<Cover> {
  @Input() model!: Cover;
  @Input() survey!: SurveyModel;
  @ViewChild("container") container!: ElementRef<HTMLDivElement>;
  getModel(): Cover {
    this.model.survey = this.survey;
    return this.model;
  }
  private shouldProcessResponsiveness: boolean = false;
  protected override onModelChanged(): void {
    super.onModelChanged();
    this.shouldProcessResponsiveness = true;
  }
  ngAfterViewInit() {
    this.shouldProcessResponsiveness = true;
  }
  override ngAfterViewChecked(): void {
    super.ngAfterViewChecked();
    if (this.shouldProcessResponsiveness) {
      this.model.processResponsiveness();
      this.shouldProcessResponsiveness = false;
    }
  }
}

AngularComponentFactory.Instance.registerComponent("sv-header", HeaderComponent);