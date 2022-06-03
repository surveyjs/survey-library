import { Component, Input } from "@angular/core";
import { PageModel } from "survey-core";
import { BaseAngular } from "./base-angular";
@Component({
  selector: "page",
  templateUrl: "./page.component.html",
  styleUrls: ["./page.component.scss"]
})
export class PageComponent extends BaseAngular<PageModel> {
  @Input() model!: PageModel;
  protected getModel(): PageModel {
    return this.model;
  }
}