import { AfterViewChecked, Component, ElementRef, Input, ViewChild } from "@angular/core";
import { SurveyModel } from "survey-core";
import { EmbeddedViewContentComponent } from "../../embedded-view-content.component";

// The page of an editor survey of the Filter Control: the Filters dialog's fields, a "condition"
// popup's, and a preset dialog's form and survey. It is drawn as a page, not as a whole Survey (a
// Survey inside another survey's question would put a <form> inside a <form>). A survey made anew
// (another tab's form) is drawn anew: element ids restart in every survey.
@Component({
  selector: "sv-ng-filter-editor-page",
  templateUrl: "./filter-editor-page.component.html",
  styleUrls: ["../../hide-host.scss"]
})
export class FilterEditorPageComponent extends EmbeddedViewContentComponent implements AfterViewChecked {
  @Input() survey!: SurveyModel;
  @Input() disposed?: boolean;
  @Input() className!: string;
  @ViewChild("root") rootRef?: ElementRef<HTMLElement>;
  public get surveys(): Array<SurveyModel> {
    return !this.disposed && !!this.survey ? [this.survey] : [];
  }
  public trackBySurvey(_: number, survey: SurveyModel): number {
    return survey.uniqueId;
  }
  // The Survey component would set this; a page rendered on its own leaves it to its host.
  override ngAfterViewChecked(): void {
    super.ngAfterViewChecked();
    if (!this.disposed && !!this.survey && !!this.rootRef) {
      this.survey.rootElement = this.rootRef.nativeElement;
    }
  }
}
