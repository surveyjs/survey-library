import { ChangeDetectorRef, Component, DoCheck, Input, OnChanges, OnDestroy, SimpleChanges } from "@angular/core";
import { LocalizableString } from "survey-core";
import { AngularComponentFactory } from "./component-factory";

@Component({
  selector: "sv-ng-string-viewer, string-viewer, '[sv-ng-string-viewer]'",
  templateUrl: "./string-viewer.component.html",
  styleUrls: ["./string-viewer.component.scss"]
})
export class StringViewerComponent implements DoCheck {
  @Input() model!: LocalizableString;
  className: string = "";
  private previousModel: LocalizableString | undefined;
  constructor(private changeDetectorRef: ChangeDetectorRef) {}
  ngDoCheck(): void {
    if(this.model !== this.previousModel) {
      this.className = this.model.allowLineBreaks ? "sv-string-viewer sv-string-viewer--multiline" : "sv-string-viewer";
      if(!!this.previousModel) {
        this.clearOnChanged(this.previousModel);
      }
      if(!!this.model) {
        this.model.onChanged = () => { this.changeDetectorRef.detectChanges(); };
      }
      this.previousModel = this.model;
    }
  }
  clearOnChanged(model: LocalizableString) {
    model.onChanged = () => {};
  }
  ngOnDestroy(): void {
    !!this.model && this.clearOnChanged(this.model);
  }
}
AngularComponentFactory.Instance.registerComponent(LocalizableString.defaultRenderer, StringViewerComponent);