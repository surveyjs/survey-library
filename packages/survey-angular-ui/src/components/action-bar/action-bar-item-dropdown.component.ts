import { Component, Input } from "@angular/core";
import { ActionDropdownViewModel, getActionDropdownButtonTarget } from "survey-core";
import { BaseAngular } from "../../base-angular";
import { AngularComponentFactory } from "../../component-factory";

@Component({
  selector: "sv-action-bar-item-dropdown",
  templateUrl: "./action-bar-item-dropdown.component.html",
  styleUrls: ["../../hide-host.scss"]
})
export class ActionBarItemDropdownComponent extends BaseAngular {
  @Input() model: any
  public getTarget: (container: HTMLElement) => HTMLElement = getActionDropdownButtonTarget;
  protected viewModel!: ActionDropdownViewModel;

  protected getModel() {
    return this.model;
  }
  override ngOnInit(): void {
    super.ngOnInit();
    this.viewModel = new ActionDropdownViewModel(this.model);
  }
  override ngOnDestroy(): void {
    this.viewModel.dispose();
    super.ngOnDestroy();
  }
}

AngularComponentFactory.Instance.registerComponent("sv-action-bar-item-dropdown", ActionBarItemDropdownComponent);