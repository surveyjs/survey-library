import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { DropdownMultiSelectListModel } from "survey-core";

@Component({
  selector: "sv-ng-tagbox, '[sv-ng-tagbox]'",
  templateUrl: "./tagbox.component.html"
})
export class TagboxComponent implements OnDestroy, OnInit {
    @Input() model: any;
    private dropdownListModel!: DropdownMultiSelectListModel;

    get dropdownModel(): DropdownMultiSelectListModel {
      return this.dropdownListModel;
    }

    getModel() {
      return this.model;
    }

    ngOnInit(): void {
      this.dropdownListModel = this.model.dropdownListModel || new DropdownMultiSelectListModel(this.model);
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
    keyhandler(event: any) {
      this.dropdownListModel?.keyHandler(event);
    }
    blur(event: any) {
      this.dropdownListModel?.onBlur(event);
    }
}