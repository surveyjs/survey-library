import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from "@angular/core";
import { PageModel, SurveyModel } from "survey-core";
import { BaseAngular } from "./base-angular";
import { AngularComponentFactory } from "./component-factory";
import { SurveyBaseProviders } from "./component-depth";
@Component({
  providers: SurveyBaseProviders,
  selector: "sv-page, page, sv-ng-page",
  templateUrl: "./page.component.html",
  styleUrls: ["./hide-host.scss"]
})
export class PageComponent extends BaseAngular<PageModel> {
  @Input() model!: PageModel;
  @Input() survey?: SurveyModel;
  @ViewChild("pageContainer", { static: false, read: ElementRef }) pageContainerRef!: ElementRef<HTMLDivElement>;
  protected getModel(): PageModel {
    return this.model;
  }
  protected override onModelChanged(): void {
    if (!!this.pageContainerRef && this.pageContainerRef.nativeElement) {
      this.model.afterRender(this.pageContainerRef.nativeElement);
    }
  }
  protected override afterViewInit(): void {
    if (this.model.survey) {
      this.model.afterRender(this.pageContainerRef?.nativeElement);
    }
  }
  override ngOnDestroy() {
    super.ngOnDestroy();
    this.model.beforeDestroy();
  }
}

AngularComponentFactory.Instance.registerComponent("sv-page", PageComponent);