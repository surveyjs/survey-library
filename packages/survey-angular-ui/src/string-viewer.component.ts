import { ChangeDetectorRef, Component, Input, OnChanges, OnDestroy } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { LocalizableString } from "survey-core";

@Component({
  selector: "sv-ng-string-viewer, string-viewer, '[sv-ng-string-viewer]'",
  templateUrl: "./string-viewer.component.html",
  styleUrls: ["./string-viewer.component.scss"]
})
export class StringViewerComponent implements OnChanges, OnDestroy {
  @Input() model: any;
  constructor(private changeDetectorRef: ChangeDetectorRef) {}
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
    _locString.onChanged = () => { this.content = _locString.renderedHtml; this.changeDetectorRef.detectChanges(); };
  }
  ngOnDestroy(): void {
    this.model.onChanged = () => {};
  }
}