import { Component, Input } from "@angular/core";
import { BaseAngular } from "../../base-angular";
import { Base, Notifier } from "survey-core";

@Component({
  selector: "sv-notifier",
  templateUrl: "./notifier.component.html",
  styles: [":host { display: none; }"]
  })
export class NotifierComponent extends BaseAngular<Notifier> {
  @Input() notifier!: Notifier;
  protected getStateElement(): Base {
    return this.notifier;
  }
  protected getModel(): Notifier {
    return this.notifier;
  }
}