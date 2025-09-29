import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from "@angular/core";
import { PageModel, SurveyModel } from "survey-core";
import { BaseAngular } from "./base-angular";
import { AngularComponentFactory } from "./component-factory";
@Component({
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
      this.model.survey.afterRenderPage(this.pageContainerRef.nativeElement);
    }
  }
  ngAfterViewInit(): void {
    this.model.survey?.afterRenderPage(this.pageContainerRef?.nativeElement);
  }
}

AngularComponentFactory.Instance.registerComponent("sv-page", PageComponent);