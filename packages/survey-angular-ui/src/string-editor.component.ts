import { ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, SimpleChanges } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { LocalizableString } from "survey-core";
import { AngularComponentFactory } from "./component-factory";

@Component({
  selector: "sv-ng-string-editor",
  templateUrl: "./string-editor.component.html"
})
export class StringEditorComponent {
  @Input() model!: LocalizableString;

  onInput = (event: any) => {
    this.model.text = event.target.innerText;
  };
  onClick = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
  };
}
AngularComponentFactory.Instance.registerComponent(LocalizableString.editableRenderer, StringEditorComponent);