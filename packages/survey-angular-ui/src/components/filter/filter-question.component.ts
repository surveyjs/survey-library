import { Component } from "@angular/core";
import { FilterChip, QuestionFilterModel } from "survey-core";
import { QuestionAngular } from "../../question";
import { AngularComponentFactory } from "../../component-factory";

// The Filter Control (#11890), as packages/survey-react-ui/src/components/filter/filter.tsx draws it.
// The chips row is its own component: it watches the layout that cuts the row to one row. The chips'
// popups are drawn outside the chips row: on a phone the row scrolls sideways, and iOS Safari keeps a
// fixed popup inside such a row.
@Component({
  selector: "sv-ng-filter-question",
  templateUrl: "./filter-question.component.html"
})
export class FilterQuestionComponent extends QuestionAngular<QuestionFilterModel> {
  public trackChipBy = (_: number, chip: FilterChip): string => chip.id;
  public onSearchInput(event: any): void {
    this.model.searchString = event.target.value;
  }
}

AngularComponentFactory.Instance.registerComponent("filter-question", FilterQuestionComponent);
