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

  public get maxValueExpression(): any {
    return this.getPropertyValue("maxValueExpression");
  }
  public set maxValueExpression(val: any) {
    this.setPropertyValue("maxValueExpression", val);
  }
  public get minValueExpression(): any {
    return this.getPropertyValue("minValueExpression");
  }
  public set minValueExpression(val: any) {
    this.setPropertyValue("minValueExpression", val);
  }
  protected runConditionCore(values: HashTable<any>, properties: HashTable<any>): void {
    super.runConditionCore(values, properties);
    let maxRunner: ExpressionRunner = this.getDefaultRunner(this.defaultExpressionRunner, this.maxValueExpression);
    let minRunner: ExpressionRunner = this.getDefaultRunner(this.defaultExpressionRunner, this.minValueExpression);

    if (!!maxRunner && maxRunner.canRun) {
      maxRunner.onRunComplete = (res) => {
        this.max = res ?? this.max;
      };
      maxRunner.run(values, properties);
    }

    if (!!minRunner && minRunner.canRun) {
      minRunner.onRunComplete = (res) => {
        this.min = res ?? this.min;
      };
      minRunner.run(values, properties);
    }
  }

  public get step(): number {
    if (this.isDiscreteValueByStep) {
      return (this.max - this.min) / (this.ticksCount - 1);
    }
    return 1;
  }

  public get isDiscreteValueByStep(): boolean {
    return false;
  }

  public get minSelectedRange(): number {
    return 10;
  }

  public get maxSelectedRange(): number {
    return 100;
  }

  public get ticksCount(): number { // TODO interval
    if (this.customTicks.length > 0) return this.customTicks.length;
    if (this.tickSize) {
      return Math.round(100 / this.tickSize) + 2;
    }
    return 6;
  }

  public get tickSize(): number {
    return null;
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
  [
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
