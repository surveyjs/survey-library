import { Component, Input, OnInit } from "@angular/core";
import { DropdownMultiSelectListModel } from "survey-core";

@Component({
  selector: "sv-ng-tagbox, '[sv-ng-tagbox]'",
  templateUrl: "./tagbox.component.html"
})
export class TagboxComponent implements OnInit {
    @Input() model: any;

    get dropdownModel(): DropdownMultiSelectListModel {
      return this.model?.dropdownListModel;
    }

    getModel() {
      return this.model;
    }

    ngOnInit(): void {
      if (!this.model.dropdownListModel) {
        this.model.dropdownListModel = new DropdownMultiSelectListModel(this.model);
      }
    }

    click(event: any) {
      this.dropdownModel?.onClick(event);
    }
  chevronPointerDown(event: any) {
    this.dropdownModel?.chevronPointerDown(event);
    }
    clear(event: any) {
      this.dropdownModel?.onClear(event);
    }
    keyhandler(event: any) {
      this.dropdownModel?.keyHandler(event);
    }
    blur(event: any) {
      this.dropdownModel?.onBlur(event);
    }
}