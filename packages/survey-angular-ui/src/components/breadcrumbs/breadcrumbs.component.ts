import { Component, Input } from "@angular/core";
import { ActionContainer } from "survey-core";

@Component({
  selector: "sv-breadcrumbs",
  templateUrl: "./breadcrumbs.component.html",
  //styles: [":host { display: none; }"],
})
export class BreadcrumbsComponent {
  @Input() model!: ActionContainer;
  @Input() css!: any;
}