import { Component, Input } from "@angular/core";
import { EmbeddedViewContentComponent } from "../../embedded-view-content.component";

@Component({
  selector: "sv-ng-element-title-actions",
  templateUrl: "./title-actions.component.html",
  styleUrls: ["../../hide-host.scss"]
})
export class ElementTitleActionsComponent extends EmbeddedViewContentComponent {
  @Input() element: any;
  @Input() renderActions: any = true;
  get cssClasses() {
    return (this.element.isPanel ? this.element.cssClasses.panel : this.element.cssClasses) || {};
  }
}