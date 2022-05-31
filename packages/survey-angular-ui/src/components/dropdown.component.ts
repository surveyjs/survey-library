import { Component, Input } from "@angular/core";
import { ImplementorBase } from "../implementor-base";

@Component({
  selector: "sv-dropdown",
  templateUrl: "./dropdown.component.html"
})
export class DropdownComponent {
  @Input() model: any;

  constructor() {
  }

  ngOnChanges(changes: any): void {
    new ImplementorBase(changes.model.currentValue);
  }
  // onClick(): boolean | void {
  //   this.question?.onOpenedCallBack();
  // }
}