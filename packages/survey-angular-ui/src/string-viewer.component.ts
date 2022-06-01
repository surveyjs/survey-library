import { Component, Input } from "@angular/core";
import { Observable, Subject, BehaviorSubject } from "rxjs";
import { SurveyModel, PageModel, LocalizableString } from "survey-core";
import { ImplementorBase } from "./implementor-base";

@Component({
  selector: "sv-ng-string-viewer, string-viewer, '[sv-ng-string-viewer]'",
  templateUrl: "./string-viewer.component.html",
  styleUrls: ["./string-viewer.component.scss"]
})
export class StringViewerComponent {
  @Input() model: any;
  constructor() {
  }
  _content = new BehaviorSubject<string>("");
  get content(): string {
    return this._content.value;
  }
  set content(text: string) {
    this._content.next(text);
  }

  ngOnChanges(changes: any): void {
    const _locString = changes.model.currentValue as LocalizableString;
    this.content = _locString.renderedHtml;
    _locString.onChanged = () => this.content = _locString.renderedHtml;
  }
}