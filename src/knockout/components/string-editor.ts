import * as ko from "knockout";
import { LocalizableString } from "../../localizablestring";

const template = require("./string-editor.html");

export class StringEditorViewModel {
  private locString: any;
  constructor(params: any) {
    this.locString = params.locString;
  }
  get koHasHtml() {
    return this.locString.koHasHtml;
  }
  get editValue() {
    return this.locString.koRenderedHtml();
  }
  set editValue(value) {
    this.locString.text = value;
  }
  onInput(sender: StringEditorViewModel, event: any) {
    sender.editValue = event.target.innerText;
  }
  onClick(sender: StringEditorViewModel, event: any) {
    event.stopPropagation();
  }
}

ko.components.register(LocalizableString.editableRenderer, {
  viewModel: StringEditorViewModel,
  template: template,
});

