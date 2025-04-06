import { ExpressionRunner } from "./conditions";
import { HashTable } from "./helpers";
import { ItemValue } from "./itemvalue";
import { property, propertyArray, Serializer } from "./jsonobject";
import { QuestionRatingModel } from "./question_rating";
import { QuestionFactory } from "./questionfactory";
import { CssClassBuilder } from "./utils/cssClassBuilder";

/**
 * A class that describes the Range Slider question type.
 *
 * [View Demo](https://surveyjs.io/form-library/examples/... (linkStyle))
 */
export class QuestionSliderModel extends QuestionRatingModel {
  @property({ defaultValue: "range" }) sliderType: "range" | "single";
  @property({ defaultValue: 100 }) max: number;
  @property({ defaultValue: 0 }) min: number;
  @property({ defaultValue: null }) maxValueExpression: string | null;
  @property({ defaultValue: null }) minValueExpression: string | null;
  @property({ defaultValue: null }) maxRangeLength: number | null;
  @property({ defaultValue: null }) minRangeLength: number | null;
  @property({ defaultValue: "{0}" }) tooltipFormat: string;
  @property({ defaultValue: "{0}" }) labelFormat: string;
  @property({ defaultValue: "always" }) tooltipVisibility: "onhover" | "always" | "never";
  public get step(): number {
    if (this.snapToTicks) {
      return (this.max - this.min) / (this.tickCount - 1);
    }
    return this.getPropertyValue("step");
  }
  public set step(val: number) {
    this.setPropertyValue("step", val);
  }

  @property({ defaultValue: false }) snapToTicks: boolean;
  @property({ defaultValue: true }) showLabels: boolean;
  @property({ defaultValue: true }) showEdgeLabels: boolean;
  public get tickCount(): number { // TODO interval count?
    if (this.ticks.length > 0) return this.ticks.length;
    if (this.tickSize) {
      return Math.round(100 / this.tickSize) + 2;
    }
    return this.getPropertyValue("tickCount");
  }
  public set tickCount(val: number) {
    this.setPropertyValue("tickCount", val);
  }
  @property({ defaultValue: null }) tickSize: number | null;
  @propertyArray({ }) ticks: ItemValue[];

  @property({ defaultValue: null }) focusedThumb: number | null;

  constructor(name: string) {
    super(name);
    this.createNewArray("value");
    this.createItemValues("ticks");
  }

  public getType(): string {
    return "slider";
  }

  public get rootCss(): string {
    return new CssClassBuilder()
      .append(this.cssClasses.root)
      .append(this.cssClasses.rootSingleMode, !Array.isArray(this.value))
      .toString();
  }

  public get renderedmaxRangeLength(): number {
    return this.maxRangeLength ?? this.max;
  }

  public get renderedminRangeLength(): number {
    return this.minRangeLength ?? this.step;
  }

  public isIndeterminate: boolean = false;

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
  "slider",
  [
    {
      name: "sliderType:string",
      default: "range",
    },
    {
      name: "showLabels:boolean",
      default: true
    },
    {
      name: "tooltipFormat:string",
      default: "{0}"
    },
    {
      name: "tooltipVisibility:string",
      default: "always"
    },
    {
      name: "labelFormat:string",
      default: "{0}"
    },
    {
      name: "showEdgeLabels:boolean",
      default: true
    },
    {
      name: "snapToTicks",
      default: false
    },
    {
      name: "min:number",
      default: 0,
    },
    {
      name: "max:number",
      default: 100,
    },
    {
      name: "step:number",
      default: 1,
    },
    {
      name: "tickCount:number",
      default: 6
    },
    {
      name: "maxRangeLength: number",
      // defaultFunc: (obj: QuestionSliderModel): number => {
      //   return obj.max;
      // }
    },
    {
      name: "minRangeLength: number"
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
      name: "ticks:itemvalue[]",
    },
  ],
  function () {
    return new QuestionSliderModel("");
  },
  "question", // TODO maybe rating ?
);
QuestionFactory.Instance.registerQuestion("slider", (name) => {
  return new QuestionSliderModel(name);
});
