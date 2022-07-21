import { ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, SimpleChanges } from "@angular/core";
import { LocalizableString } from "survey-core";
import { AngularComponentFactory } from "./component-factory";

@Component({
  selector: "sv-ng-string-viewer, string-viewer, '[sv-ng-string-viewer]'",
  templateUrl: "./string-viewer.component.html",
  styleUrls: ["./string-viewer.component.scss"]
})
export class StringViewerComponent implements OnChanges, OnDestroy {
  @Input() model: any;
  constructor(private changeDetectorRef: ChangeDetectorRef) {}
  ngOnChanges(changes: SimpleChanges): void {
    const currentValue = changes["model"].currentValue;
    const previousValue = changes["model"].previousValue;
    currentValue.onChanged = () => { this.changeDetectorRef.detectChanges(); };
    !!previousValue && this.clearOnChanged(previousValue);
  }
  clearOnChanged(model: LocalizableString) {
    model.onChanged = () => {};
  }
  ngOnDestroy(): void {
    !!this.model && this.clearOnChanged(this.model);
  }
}
AngularComponentFactory.Instance.registerComponent(LocalizableString.defaultRenderer, StringViewerComponent);