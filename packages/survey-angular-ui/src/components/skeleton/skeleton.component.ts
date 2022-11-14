import { Component, Input } from "@angular/core";
import { EmbeddedViewContentComponent } from "../../embedded-view-content.component";
import { AngularComponentFactory } from "../../component-factory";

@Component({
  selector: "sv-skeleton",
  templateUrl: "./skeleton.component.html",
  styleUrls: ["../../hide-host.scss"]
})
export class SkeletonComponent extends EmbeddedViewContentComponent {
  @Input() element: any;
}

AngularComponentFactory.Instance.registerComponent("sv-skeleton", SkeletonComponent);