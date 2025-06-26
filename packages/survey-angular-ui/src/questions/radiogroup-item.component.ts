import { Component, Input } from "@angular/core";
@Component({
  selector: "sv-ng-radiogroup-item, '[sv-ng-radiogroup-item]'",
  templateUrl: "./radiogroup-item.component.html",
  styleUrls: ["./radiogroup-item.component.scss"]
})
export class RadiogroupItemComponent {
  @Input() question: any;
  @Input() model: any;
  @Input() ariaLabel?: string;
  constructor() {
  }
  onChange(event: any) {
    this.question.clickItemHandler(this.model);
  }
}
