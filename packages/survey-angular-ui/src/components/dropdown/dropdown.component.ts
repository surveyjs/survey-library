import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { DropdownListModel, DropdownRenderState, Helpers } from "survey-core";
import { BaseAngular } from "../../base-angular";

@Component({
  selector: "sv-ng-dropdown, '[sv-ng-dropdown]'",
  templateUrl: "./dropdown.component.html"
})
export class DropdownComponent extends BaseAngular implements OnInit {
  @Input() model: any;
  @ViewChild("inputElement") inputElementRef!: ElementRef<HTMLDivElement>;
  // Creates the model: used by the event handlers and the popup.
  get dropdownModel(): DropdownListModel {
    return this.model?.dropdownListModel;
  }
  // Everything the closed control renders. It does not create DropdownListModel.
  get renderState(): DropdownRenderState {
    return this.model?.dropdownRenderState || this.model?.dropdownListModel;
  }
  get inputStringRendered(): string {
    return this.renderState.inputStringRendered;
  }
  set inputStringRendered(val: string) {
    this.dropdownModel.inputStringRendered = val;
  }
  // An editable control mounts the popup, which needs the model. Otherwise the model is created on an interaction,
  // and ngDoCheck subscribes to it on the next change detection.
  protected getModel() {
    return this.model.isInputReadOnly ? this.model.dropdownListModelValue : this.model.dropdownListModel;
  }

  override ngOnInit(): void {
    super.ngOnInit();
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
    this.model.onBlur(event);
    this.updateInputDomElement();
  }
  focus(event: any) {
    this.model.onFocus(event);
  }
  inputChange(event: any) {
    this.detectChanges();
  }
  updateInputDomElement() {
    if (!!this.inputElementRef?.nativeElement) {
      const control: any = this.inputElementRef.nativeElement;
      const newValue = this.model.inputStringRendered;
      if (!Helpers.isTwoValueEquals(newValue, control.value, false, true, false)) {
        control.value = this.renderState.inputStringRendered || "";
      }
    }
  }
}