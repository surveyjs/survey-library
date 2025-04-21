import { Component, Input } from "@angular/core";
import { ActionContainer } from "survey-core";
import { BaseAngular } from "../../base-angular";
@Component({
  selector: "sv-breadcrumbs",
  templateUrl: "./breadcrumbs.component.html",
  //styles: [":host { display: none; }"],
})
export class BreadcrumbsComponent extends BaseAngular {
  @Input() model!: ActionContainer;
  @Input() css!: any;

  getModel() {
    return this.model;
  }
}