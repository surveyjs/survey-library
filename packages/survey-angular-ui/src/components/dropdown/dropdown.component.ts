import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import { DropdownListModel, Helpers } from "survey-core";

@Component({
  selector: "sv-ng-dropdown, '[sv-ng-dropdown]'",
  templateUrl: "./dropdown.component.html"
})
export class DropdownComponent implements OnDestroy, OnInit, OnChanges {
    @Input() model: any;
    @ViewChild("inputElement") inputElementRef!: ElementRef<HTMLDivElement>;

    private dropdownListModel!: DropdownListModel;

    get dropdownModel(): DropdownListModel {
      return this.dropdownListModel;
    }

    ngOnInit(): void {
      this.dropdownListModel = this.model.dropdownListModel || new DropdownListModel(this.model);
    }

    ngOnDestroy() {
      this.dropdownListModel?.dispose();
    }

    ngOnChanges(changes: SimpleChanges): void {
      this.updateInputDomElement();
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
      this.updateInputDomElement();
    }
    inputChange(event: any) {
      this.dropdownModel.filterString = event.target.value;
    }
    inputKeyUp(event: any) {
      this.dropdownModel.filterString = event.target.value;
      this.dropdownModel.inputKeyUpHandler(event);
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