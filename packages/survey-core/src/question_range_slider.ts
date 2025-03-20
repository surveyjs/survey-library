import { Serializer } from "./jsonobject";
import { QuestionRatingModel } from "./question_rating";
import { QuestionFactory } from "./questionfactory";
import { CssClassBuilder } from "./utils/cssClassBuilder";

/**
 * A class that describes the Range Slider question type.
 *
 * [View Demo](https://surveyjs.io/form-library/examples/... (linkStyle))
 */
export class QuestionRangeSliderModel extends QuestionRatingModel {
  public getType(): string {
    return "rangeslider";
  }

  public get rootCss(): string {
    return new CssClassBuilder()
      .append(this.cssClasses.root)
      .toString();
  }

  public get max(): number {
    return 50;
  }

  public get min(): number {
    return 0;
  }

  public get step(): number {
    return 1;
  }

  public get minDiff(): number {
    return 10;
  }

  public get ticks(): number {
    return 6;
  }

  protected onCreating(): void {
    super.onCreating();
    this.createNewArray("value");
  }
}

Serializer.addClass(
  "rangeslider",
  [],
  function () {
    return new QuestionRangeSliderModel("");
  },
  "question" // TODO maybe rating ?
);
QuestionFactory.Instance.registerQuestion("rangeslider", (name) => {
  return new QuestionRangeSliderModel(name);
});
