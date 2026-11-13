import { Component } from "@angular/core";
import { QuestionFilterModel, filterUIStrings } from "survey-core";
import { QuestionAngular } from "../../question";
import { AngularComponentFactory } from "../../component-factory";

// The Filter Control (#11890), as packages/survey-react-ui/src/components/filter/filter.tsx draws it.
// The chips row is its own component: it watches the layout that cuts the row to one row.
@Component({
  selector: "sv-ng-filter-question",
  templateUrl: "./filter-question.component.html"
})
export class FilterQuestionComponent extends QuestionAngular<QuestionFilterModel> {
  public get searchLabel(): string {
    return filterUIStrings.searchLabel;
  }
  public onSearchInput(event: any): void {
    this.model.searchString = event.target.value;
  }
}

AngularComponentFactory.Instance.registerComponent("filter-question", FilterQuestionComponent);
