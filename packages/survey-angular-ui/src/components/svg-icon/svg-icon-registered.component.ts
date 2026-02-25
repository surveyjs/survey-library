import { Component, Input } from "@angular/core";
import { AngularComponentFactory } from "../../component-factory";
import { EmbeddedViewContentComponent } from "../../embedded-view-content.component";
import { SurveyModel } from "survey-core";

@Component({
  selector: "sv-svg-icon",
  templateUrl: "./svg-icon-registered.component.html",
  styleUrls: ["../../hide-host.scss"]
})
export class SvgIconRegisteredComponent extends EmbeddedViewContentComponent {
  @Input() size?: number | string;
  @Input() width?: number;
  @Input() height?: number;
  @Input() iconName!: string;
  @Input() className?: string;
  @Input() css?: string;
  @Input() title?: string;
}
AngularComponentFactory.Instance.registerComponent("sv-svg-icon", SvgIconRegisteredComponent);