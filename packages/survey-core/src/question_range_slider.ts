import { ExpressionRunner } from "./conditions";
import { HashTable } from "./helpers";
import { ItemValue } from "./itemvalue";
import { property, Serializer } from "./jsonobject";
import { QuestionRatingModel } from "./question_rating";
import { QuestionFactory } from "./questionfactory";
import { CssClassBuilder } from "./utils/cssClassBuilder";

/**
 * A class that describes the Range Slider question type.
 *
 * [View Demo](https://surveyjs.io/form-library/examples/... (linkStyle))
 */
export class QuestionRangeSliderModel extends QuestionRatingModel {
  @property({ defaultValue: null }) focusedThumb: number | null;
  @property({ defaultValue: 100 }) max: number;
  @property({ defaultValue: 0 }) min: number;
  @property({ defaultValue: null }) maxValueExpression: string | null;
  @property({ defaultValue: null }) minValueExpression: string | null;
  @property({ getDefaultValue: function() { return this.max; } }) maxSelectedRange: number;
  @property({ defaultValue: 0 }) minSelectedRange: number;
  @property({ defaultValue: "" }) valueFormat: string;
  public get step(): number {
    if (this.isDiscreteValueByStep) {
      return (this.max - this.min) / (this.ticksCount - 1);
    }
    return this.getPropertyValue("step");
  }
  public set step(val: number) {
    this.setPropertyValue("step", val);
  }
  @property({ defaultValue: false }) isDiscreteValueByStep: boolean;

  @property({ defaultValue: true }) isShowTicks: boolean;
  @property({ defaultValue: true }) isShowMinMaxTicks: boolean;
  public get ticksCount(): number { // TODO interval count?
    if (this.customTicks.length > 0) return this.customTicks.length;
    if (this.tickSize) {
      return Math.round(100 / this.tickSize) + 2;
    }
    return this.getPropertyValue("ticksCount");
  }
  public set ticksCount(val: number) {
    this.setPropertyValue("ticksCount", val);
  }
  @property({ defaultValue: null }) tickSize: number | null;
  @property({ defaultValue: [] }) customTicks: ItemValue[];
  //  customTicks: [
  //     {
  //       text: "min",
  //       value: 0
  //     },
  //     {
  //       text: "25%",
  //       value: 25
  //     },
  //     {
  //       text: "Very long label which has to be located well!",
  //       value: 50
  //     },
  //     {
  //       text: "75%",
  //       value: 75
  //     },
  //     {
  //       text: "max",
  //       value: 100
  //     }
  //   ]

  public getType(): string {
    return "rangeslider";
  }

  public get rootCss(): string {
    return new CssClassBuilder()
      .append(this.cssClasses.root)
      .append(this.cssClasses.rootSingleMode, !Array.isArray(this.value))
      .toString();
  }

  public isIndeterminate: boolean = false;
  public isSingleMode: boolean = true;

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

  protected runConditionCore(values: HashTable<any>, properties: HashTable<any>): void {
    super.runConditionCore(values, properties);

    if (this.maxValueExpression) {
      let maxRunner: ExpressionRunner = this.getDefaultRunner(this.defaultExpressionRunner, this.maxValueExpression);

      if (!!maxRunner && maxRunner.canRun) {
        maxRunner.onRunComplete = (res) => {
          this.max = res ?? this.max;
        };
        maxRunner.run(values, properties);
      }
    }

    if (this.minValueExpression) {
      let minRunner: ExpressionRunner = this.getDefaultRunner(this.defaultExpressionRunner, this.minValueExpression);

      if (!!minRunner && minRunner.canRun) {
        minRunner.onRunComplete = (res) => {
          this.min = res ?? this.min;
        };
        minRunner.run(values, properties);
      }
    }
  }
}

Serializer.addClass(
  "rangeslider",
  [
    {
      name: "step:number",
      default: 1,
    },
    {
      name: "ticksCount:number",
      default: 6
    },
    {
      name: "maxValueExpression",
      type: "condition"
    },
    {
      name: "minValueExpression",
      type: "condition"
    },
    {
      name: "customTicks:itemvalue[]",
    },
  ],
  function () {
    return new QuestionRangeSliderModel("");
  },
  "question", // TODO maybe rating ?
);
QuestionFactory.Instance.registerQuestion("rangeslider", (name) => {
  return new QuestionRangeSliderModel(name);
});
