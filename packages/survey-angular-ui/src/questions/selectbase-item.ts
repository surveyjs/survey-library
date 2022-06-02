import { Component, Input } from "@angular/core";
import { BaseAngular } from "src/base-angular";
import { Base, ItemValue } from "survey-core";

@Component({
  selector: "['sv-ng-selectbase-item'], sv-ng-selebase-item",
  templateUrl: "./selectbase-item.html",
  styleUrls: ["./radiogroup-item.component.scss"]
})
export class SelectBaseItemComponent extends BaseAngular {
  @Input() question!: any;
  @Input() model!: ItemValue | any;
  @Input() inputType!: string;
  protected getModel(): Base {
    return this.model;
  }
}
