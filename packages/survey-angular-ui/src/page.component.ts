import { AfterViewInit, Component, ElementRef, Input, ViewChild } from "@angular/core";
import { PageModel, SurveyModel } from "survey-core";
import { BaseAngular } from "./base-angular";
@Component({
  selector: "page",
  templateUrl: "./page.component.html",
  styleUrls: ["./page.component.scss"]
})
export class PageComponent extends BaseAngular<PageModel> implements AfterViewInit {
  @Input() model!: PageModel;
  @Input() survey?: SurveyModel;
  @ViewChild("pageContainer", { static: true, read: ElementRef }) pageContainerRef!: ElementRef<HTMLDivElement>;
  protected getModel(): PageModel {
    return this.model;
  }
  ngAfterViewInit(): void {
    this.model.survey?.afterRenderPage(this.pageContainerRef.nativeElement);
  }
}