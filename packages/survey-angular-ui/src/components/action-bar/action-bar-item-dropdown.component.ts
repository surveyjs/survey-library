import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import { ActionDropdownViewModel } from "survey-core";
import { BaseAngular } from "../../base-angular";
import { AngularComponentFactory } from "../../component-factory";

@Component({
  selector: "sv-action-bar-item-dropdown",
  templateUrl: "./action-bar-item-dropdown.component.html",
  styleUrls: ["../../hide-host.scss"]
})
export class ActionBarItemDropdownComponent extends BaseAngular {
  @Input() model: any
  @ViewChild("buttonElement") buttonElement!: ElementRef<HTMLDivElement>;
  public targetElementRef: { setCurrent?: (currentEl: HTMLElement) => void } = { };
  protected viewModel!: ActionDropdownViewModel;

  protected getModel() {
    return this.model;
  }
  override ngOnInit(): void {
    super.ngOnInit();
    this.viewModel = new ActionDropdownViewModel(this.model);
  }
  ngAfterViewInit(): void {
    if(!!this.buttonElement?.nativeElement) {
      this.targetElementRef.setCurrent && this.targetElementRef.setCurrent(this.buttonElement?.nativeElement as any);
    }
  }
  override ngOnDestroy(): void {
    this.viewModel.dispose();
    super.ngOnDestroy();
  }
}

AngularComponentFactory.Instance.registerComponent("sv-action-bar-item-dropdown", ActionBarItemDropdownComponent);