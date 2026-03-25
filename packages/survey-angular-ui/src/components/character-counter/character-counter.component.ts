import { Component, Input } from "@angular/core";
import { CharacterCounter, ICharacterCounterAction } from "survey-core";
import { EmbeddedViewContentComponent } from "../../embedded-view-content.component";
import { AngularComponentFactory } from "../../component-factory";
import { BaseAngular } from "../../base-angular";

@Component({
  selector: "sv-ng-character-counter",
  templateUrl: "./character-counter.component.html",
  styles: [":host { display: none; }"],
})
export class CharacterCounterComponent extends BaseAngular {
  @Input() counter?: CharacterCounter;
  @Input() remainingCharacterCounter?: string;
  @Input() model?: ICharacterCounterAction;
  get counterModel() {
    return this.model ? this.model.data.counter : this.counter;
  }
  get remainingCharacterCounterClass() {
    return this.model ? this.model.data.remainingCharacterCounter : this.remainingCharacterCounter;
  }
  getModel() {
    return this.counterModel as CharacterCounter;
  }

}
AngularComponentFactory.Instance.registerComponent("sv-character-counter", CharacterCounterComponent);
AngularComponentFactory.Instance.registerComponent("character-counter", CharacterCounterComponent);