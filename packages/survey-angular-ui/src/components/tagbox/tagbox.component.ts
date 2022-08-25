import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { DropdownListModel, PopupModel } from "survey-core";

@Component({
  selector: "sv-ng-tagbox, '[sv-ng-tagbox]'",
  templateUrl: "./tagbox.component.html"
})
export class TagboxComponent implements OnDestroy, OnInit {
    @Input() model: any;
    private dropdownListModel!: DropdownListModel;

    get dropdownModel():DropdownListModel {
      return this.dropdownListModel;
    }

    ngOnInit(): void {
      this.dropdownListModel = this.model.dropdownListModel || new DropdownListModel(this.model);
    }

    ngOnDestroy() {
      this.dropdownListModel?.dispose();
    }

    click(event: any) {
      this.dropdownListModel?.onClick(event);
    }
    clear(event: any) {
      this.dropdownListModel?.onClear(event);
    }
    keyup(event: any) {
      this.dropdownListModel?.onKeyUp(event);
    }
    blur(event: any) {
      this.dropdownListModel?.onBlur(event);
    }
}