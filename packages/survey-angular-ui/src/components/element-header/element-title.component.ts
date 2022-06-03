import { Component, Input } from "@angular/core";

@Component({
  selector: "sv-ng-element-title",
  templateUrl: "./element-title.component.html"
})
export class ElementTitleComponent {
  @Input() element: any;
  constructor() {
  }
}