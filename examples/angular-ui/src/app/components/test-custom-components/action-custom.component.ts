import { Component, Input, OnInit } from "@angular/core";
import { AngularComponentFactory } from "survey-angular-ui";
import { Action } from "survey-core";

@Component({
  selector: "svc-custom-action",
  templateUrl: "./action-custom.component.html"
})
export class CustomActionComponent {
  @Input() model!: Action;
}

AngularComponentFactory.Instance.registerComponent("svc-custom-action", CustomActionComponent);