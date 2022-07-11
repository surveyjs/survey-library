import { Component, Input } from "@angular/core";
import { EmbeddedViewContentComponent } from "../../embedded-view-content.component";

@Component({
  selector: "sv-ng-element-title",
  templateUrl: "./element-title.component.html"
})
export class ElementTitleComponent extends EmbeddedViewContentComponent {
  @Input() element: any;
}