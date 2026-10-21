import { Component, Input } from "@angular/core";
import { AngularComponentFactory } from "../../component-factory";
import { BaseAngular } from "../../base-angular";
import { Action } from "survey-core";

// One level of the sort bar: an item of the bar that holds the level's own action bar (field, direction, remove).
@Component({
  selector: "sv-ng-sort-bar-level",
  templateUrl: "./sort-bar-level.component.html",
  styles: [":host { display: none }"]
})
export class SortBarLevelComponent extends BaseAngular<Action> {
  @Input() model!: Action;
  getModel(): Action {
    return this.model;
  }
}

AngularComponentFactory.Instance.registerComponent("sv-sort-bar-level", SortBarLevelComponent);
