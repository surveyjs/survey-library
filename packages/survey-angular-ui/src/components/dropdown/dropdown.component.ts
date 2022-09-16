import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { DropdownListModel, Helpers } from "survey-core";
import { BaseAngular } from "../../base-angular";

@Component({
  selector: "sv-ng-dropdown, '[sv-ng-dropdown]'",
  templateUrl: "./dropdown.component.html"
})
export class DropdownComponent extends BaseAngular implements OnDestroy, OnInit {
    @Input() model: any;
    @ViewChild("inputElement") inputElementRef!: ElementRef<HTMLDivElement>;

    private dropdownListModel!: DropdownListModel;

    get dropdownModel(): DropdownListModel {
      return this.dropdownListModel;
    }
    protected getModel() {
      return this.model;
    }

    override ngOnInit(): void {
      super.ngOnInit();
      this.dropdownListModel = this.model.dropdownListModel || new DropdownListModel(this.model);
    }

    override ngOnDestroy() {
      super.ngOnDestroy();
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
      this.updateInputDomElement();
    }
    inputChange(event: any) {
      this.detectChanges();
    }
    updateInputDomElement() {
      if (!!this.inputElementRef?.nativeElement) {
        const control: any = this.inputElementRef.nativeElement;
        const newValue = this.model.filterString;
        if (!Helpers.isTwoValueEquals(newValue, control.value)) {
          control.value = this.model.filterString || "";
        }
      }
    }
}