import { ChangeDetectorRef, Component, Input, ViewContainerRef } from "@angular/core";
import { ButtonGroupItemModel, PanelModel, Question } from "survey-core";
import { BaseAngular } from "./base-angular";

@Component({
  selector: "sv-ng-element",
  templateUrl: "./element.component.html"
})
export class ElementComponent extends BaseAngular<PanelModel | Question> {
 @Input() model!: PanelModel | Question;
 protected getModel(): PanelModel | Question {
   return this.model;
 }
 protected override onModelChanged(): void {
   debugger;
 }
}