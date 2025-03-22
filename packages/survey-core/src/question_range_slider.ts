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
      .append(this.cssClasses.rootSingleMode, !Array.isArray(this.value))
      .toString();
  }

  public get max(): number {
    return 100;
  }

  public get min(): number {
    return 0;
  }

  public get step(): number {
    return 0;
  }

  public get minSelectedRange(): number {
    return 10;
  }

  public get maxSelectedRange(): number {
    return 80;
  }

  public get ticksCount(): number {
    if (this.customTicks) return this.customTicks.length;
    if (this.tickSize) {
      return Math.round(100 / this.tickSize) + 2;
    }
    return 6;
  }

  public get tickSize(): number {
    return 25;
  }

  public get customTicks(): {text: string, value: number}[] | null {
    return null;
    // return [
    //   {
    //     text: "min",
    //     value: 0
    //   },
    //   {
    //     text: "25%",
    //     value: 25
    //   },
    //   {
    //     text: "50%",
    //     value: 50
    //   },
    //   {
    //     text: "75%",
    //     value: 75
    //   },
    //   {
    //     text: "max",
    //     value: 100
    //   }
    // ];
  }

  public get isShowTicks(): boolean {
    return true;
  }

  public get isShowMinMaxTicks(): boolean {
    return true;
  }

  public get valueFormat(): string {
    return "%";
  }

  public isIndeterminate: boolean = false;

  protected onCreating(): void {
    super.onCreating();
    this.createNewArray("value");
  }

  protected setNewValue(newValue: any) {
    super.setNewValue(newValue);
    if (this.isIndeterminate) {
      this.isIndeterminate = false;
    }
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
