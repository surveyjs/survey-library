import { Component, Input } from "@angular/core";

@Component({
  selector: "sv-ng-dropdown, '[sv-ng-dropdown]'",
  templateUrl: "./dropdown.component.html"
})
export class DropdownComponent {
    @Input() model: any;

    click(e: any) {
      this.model.onClick(e);
    }

    clear(e:any) {
      this.model.onClear(e);
    }
}