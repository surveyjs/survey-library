import { Component, Input } from "@angular/core";
import { AngularComponentFactory } from "../component-factory";

@Component({
  selector: "sv-ng-radiogroup-question",
  templateUrl: "./radiogroup.component.html",
  styleUrls: ["./radiogroup.component.scss"]
})
export class RadiogroupComponent {
  @Input() model: any;
  constructor() {
  }
}

AngularComponentFactory.Instance.registerComponent("radiogroup-question", RadiogroupComponent);