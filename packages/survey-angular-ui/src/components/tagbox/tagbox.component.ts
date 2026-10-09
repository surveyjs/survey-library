import { Component, Input } from "@angular/core";
import { DropdownMultiSelectListModel, DropdownMultiSelectRenderState } from "survey-core";

@Component({
  selector: "sv-ng-tagbox, '[sv-ng-tagbox]'",
  templateUrl: "./tagbox.component.html"
})
export class TagboxComponent {
    @Input() model: any;

    // Creates the model: used by the event handlers.
    get dropdownModel(): DropdownMultiSelectListModel {
      return this.model?.dropdownListModel;
    }
    // Everything the closed control renders. It does not create DropdownListModel.
    get renderState(): DropdownMultiSelectRenderState {
      return this.model?.dropdownRenderState;
    }
    // An editable control mounts the popup, which needs the model; the filter subscribes to it.
    get stateModel(): DropdownMultiSelectListModel {
      return this.model.isInputReadOnly ? this.model.dropdownListModelValue : this.model.dropdownListModel;
    }

    getModel() {
      return this.model;
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
      this.model?.onBlur(event);
    }
    focus(event: any) {
      this.model?.onFocus(event);
    }
}