import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { DropdownListModel, PopupModel } from "survey-core";

@Component({
  selector: "sv-ng-dropdown, '[sv-ng-dropdown]'",
  templateUrl: "./dropdown.component.html"
})
export class DropdownComponent implements OnDestroy, OnInit {
    @Input() model: any;
    private dropdownListModel!: DropdownListModel;

    get popupModel(): PopupModel {
      return this.dropdownListModel.popupModel;
    }

    ngOnInit(): void {
      this.dropdownListModel = this.model.dropdownListModel || new DropdownListModel(this.model);
    }

    ngOnDestroy() {
      if (!!this.dropdownListModel) {
        this.dropdownListModel.dispose();
      }
    }

    click(event: any) {
      this.model.dropdownListModel?.onClick(event);
    }
    clear(event: any) {
      this.model.dropdownListModel?.onClear(event);
    }
    keyup(event: any) {
      this.model.dropdownListModel?.onKeyUp(event);
    }
    blur(event: any) {
      this.model.dropdownListModel?.onBlur(event);
    }
}