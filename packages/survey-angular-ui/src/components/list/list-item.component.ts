import { AfterViewInit, Component, Input } from "@angular/core";
import { ListModel, Action, IAction } from "survey-core";
import { BaseAngular } from "../../base-angular";
import { AngularComponentFactory } from "../../component-factory";

@Component({
  selector: "sv-ng-list-item, '[sv-ng-list-item]'",
  templateUrl: "./list-item.component.html",
  styleUrls: ["../../hide-host.scss"],
})

export class ListItemComponent extends BaseAngular implements AfterViewInit {
  @Input() element: any;
  @Input() model!: Action;
  @Input() listModel!: ListModel;

  get elementId() {
    return (this.model as IAction)?.elementId;
  }

  get ariaSelected(): string | undefined {
    return this.listModel.getA11yItemAriaSelected(this.model);
  }
  get ariaChecked(): string | undefined {
    return this.listModel.getA11yItemAriaChecked(this.model);
  }
  get class(): string {
    return this.listModel.getItemClass(this.model);
  }
  get itemStyle(): any {
    return this.listModel.getItemStyle(this.model);
  }
  click(event: any): void {
    this.listModel.onItemClick(this.model);
    event.stopPropagation();
  }
  pointerdown(event: any): void {
    this.listModel.onPointerDown(event, this.model);
  }
  get itemComponent(): string {
    return this.model.component || this.listModel.itemComponent;
  }

  getModel() {
    return this.model;
  }

  ngAfterViewInit(): void {
    this.listModel.onLastItemRended(this.model);
  }
}

AngularComponentFactory.Instance.registerComponent("sv-list-item", ListItemComponent);