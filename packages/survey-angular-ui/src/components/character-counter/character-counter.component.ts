import { Component, Input } from "@angular/core";
import { CharacterCounter } from "survey-core";
import { EmbeddedViewContentComponent } from "../../embedded-view-content.component";
import { AngularComponentFactory } from "../../component-factory";
import { BaseAngular } from "../../base-angular";

@Component({
  selector: "sv-ng-character-counter",
  templateUrl: "./character-counter.component.html",
  styles: [":host { display: none; }"],
  })
export class CharacterCounterComponent extends BaseAngular {
  @Input() counter!: CharacterCounter;
  @Input() remainingCharacterCounter!: string;

  getModel() {
    return this.counter;
  }

}

AngularComponentFactory.Instance.registerComponent("character-counter", CharacterCounterComponent);