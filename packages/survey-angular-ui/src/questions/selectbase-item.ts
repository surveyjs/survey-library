import { Component, Input } from "@angular/core";
import { BaseAngular } from "../base-angular";
import { Base, ItemValue } from "survey-core";

@Component({
  selector: "['sv-ng-selectbase-item'], sv-ng-selebase-item",
  templateUrl: "./selectbase-item.html",
  styles: [":host { display: none; }"]
})
export class SelectBaseItemComponent extends BaseAngular<ItemValue> {
  @Input() question!: any;
  @Input() model!: ItemValue | any;
  @Input() inputType!: string;
  @Input() showLabel: boolean = true;
  protected getModel(): ItemValue {
    return this.model;
  }
}
