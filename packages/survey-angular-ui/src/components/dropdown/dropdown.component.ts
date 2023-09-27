import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { DropdownListModel, Helpers } from "survey-core";
import { BaseAngular } from "../../base-angular";

@Component({
  selector: "sv-ng-dropdown, '[sv-ng-dropdown]'",
  templateUrl: "./dropdown.component.html"
})
export class DropdownComponent extends BaseAngular implements OnInit {
    @Input() model: any;
    @ViewChild("inputElement") inputElementRef!: ElementRef<HTMLDivElement>;
    get dropdownModel(): DropdownListModel {
      return this.model?.dropdownListModel;
    }
    protected getModel() {
      return this.model.dropdownListModel;
    }

    override ngOnInit(): void {
      super.ngOnInit();
      if (!this.model.dropdownListModel) {
        this.model.dropdownListModel = new DropdownListModel(this.model);
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
      this.updateInputDomElement();
    }
    focus(event: any) {
      this.dropdownModel?.onFocus(event);
    }
    inputChange(event: any) {
      this.detectChanges();
    }
    updateInputDomElement() {
      if (!!this.inputElementRef?.nativeElement) {
        const control: any = this.inputElementRef.nativeElement;
        const newValue = this.model.inputStringRendered;
        if (!Helpers.isTwoValueEquals(newValue, control.value, false, true, false)) {
          control.value = this.model.inputStringRendered || "";
        }
      }
    }
}