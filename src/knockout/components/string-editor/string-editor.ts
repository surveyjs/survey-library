/* eslint-disable no-restricted-globals */
import * as ko from "knockout";
import { LocalizableString } from "survey-core";
const template = require("./string-editor.html");

export class StringEditorViewModel {
  constructor(public locString: any) {}
  get koHasHtml() {
    return this.locString.koHasHtml();
  }
  get editValue() {
    return this.locString.koRenderedHtml();
  }
  set editValue(value) {
    this.locString.searchElement = undefined;
    this.locString.text = value;
  }
  onInput(sender: StringEditorViewModel, event: any) {
    sender.editValue = event.target.innerText;
  }
  onClick(sender: StringEditorViewModel, event: any) {
    event.stopPropagation();
  }
  public dispose(): void {
    this.locString.onSearchChanged = undefined;
  }
}

function getSearchElement(element: any): any {
  while (!!element && element.nodeName !== "SPAN") {
    var elements = element.parentElement.getElementsByClassName(
      "sv-string-editor"
    );
    element = elements.length > 0 ? elements[0] : undefined;
  }
  if (!!element && element.childNodes.length > 0) return element;
  return null;
}

function resetLocalizationSpan(element: any, locStr: any) {
  while (element.childNodes.length > 1) {
    element.removeChild(element.childNodes[1]);
  }
  element.childNodes[0].textContent = locStr.renderedHtml;
}

function applyLocStrOnSearchChanged(element: any, locStr: any) {
  locStr.onSearchChanged = () => {
    if (locStr.searchElement == undefined) {
      locStr.searchElement = getSearchElement(element);
    }
    if (locStr.searchElement == null) return;
    const el = locStr.searchElement;
    if (!locStr.highlightDiv) {
      locStr.highlightDiv = document.createElement("span");
      locStr.highlightDiv.style.backgroundColor = "lightgray";
    }
    if (locStr.searchIndex != undefined) {
      resetLocalizationSpan(el, locStr);
      const rng: Range = document.createRange();
      rng.setStart(el.childNodes[0], locStr.searchIndex);
      rng.setEnd(
        el.childNodes[0],
        locStr.searchIndex + locStr.searchText.length
      );
      rng.surroundContents(locStr.highlightDiv);
    } else {
      resetLocalizationSpan(el, locStr);
      locStr.searchElement = undefined;
    }
  };
}

ko.components.register(LocalizableString.editableRenderer, {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      const locStr = params.locString;
      applyLocStrOnSearchChanged(componentInfo.element, locStr);
      return new StringEditorViewModel(locStr);
    },
  },
  template: template
});
