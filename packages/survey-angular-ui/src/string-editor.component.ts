import { Component, Input } from "@angular/core";
import { LocalizableString } from "survey-core";
import { AngularComponentFactory } from "./component-factory";

@Component({
  selector: "sv-ng-string-editor",
  templateUrl: "./string-editor.component.html"
})
export class StringEditorComponent {
  @Input() model!: LocalizableString;
  @Input() textClass?: string;
  onInput = (event: any) => {
    this.model.text = event.target.innerText;
  };
  onClick = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
  };
  className: string = "";
  ngOnInit(): void {
    this.className = this.model.getStringViewerClassName(this.textClass);
  }
}
AngularComponentFactory.Instance.registerComponent(LocalizableString.editableRenderer, StringEditorComponent);