import { ExpressionRunner } from "./conditions";
import { HashTable } from "./helpers";
import { ItemValue } from "./itemvalue";
import { property, propertyArray, Serializer } from "./jsonobject";
import { QuestionRatingModel } from "./question_rating";
import { QuestionFactory } from "./questionfactory";
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { DragOrClickHelper } from "./utils/dragOrClickHelper";

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
    if (this.segmentCount) {
      return (this.max - this.min) / this.segmentCount;
    }
    return this.getPropertyValue("step");
  }
  public set step(val: number) {
    this.setPropertyValue("step", val);
  }
  @property({ defaultValue: null }) segmentCount: number | null;
  @property({ defaultValue: true }) showLabels: boolean;
  @property({ defaultValue: true }) showEdgeLabels: boolean;
  public get labelCount(): number { // TODO interval count?
    if (this.labels.length > 0) return this.labels.length;
    if (this.tickSize) {
      return Math.round(100 / this.tickSize) + 2;
    }
    return this.getPropertyValue("labelCount");
  }
  public set labelCount(val: number) {
    this.setPropertyValue("labelCount", val);
  }
  @propertyArray({ }) labels: ItemValue[];
  @property({ defaultValue: true }) allowDragRange: boolean;
  @property({ defaultValue: null }) tickSize: number | null;
  @property({ defaultValue: true }) allowSwap: boolean;

  constructor(name: string) {
    super(name);
    this.createNewArray("value");
    this.createItemValues("labels");
    this.dragOrClickHelper = new DragOrClickHelper(null, false);
  }

  public getType(): string {
    return "slider";
  }

  public get rootCss(): string {
    return new CssClassBuilder()
      .append(this.cssClasses.root)
      .append(this.cssClasses.rootSingleMode, this.sliderType === "single")
      .append(this.cssClasses.rootNegativeScaleMode, this.isNegativeScale)
      .toString();
  }

  public get thumbContainerCss(): string {
    return new CssClassBuilder()
      .append(this.cssClasses.thumbContainer)
      .append(this.cssClasses.thumbContainerIndeterminateMode, this.isIndeterminate)
      .toString();
  }

  public get renderedmaxRangeLength(): number {
    return this.maxRangeLength ?? this.max - this.min;
  }

  public get renderedminRangeLength(): number {
    return this.minRangeLength ?? this.step;
  }

  public isIndeterminate: boolean = false;
  public get isNegativeScale():boolean {
    return this.min < 0;
  }
  @property({ defaultValue: null }) focusedThumb: number | null; // TODO probably need to be just internal not property
  public dragOrClickHelper: DragOrClickHelper;

  public getRenderedValue = () => {
    const { max, min, renderedmaxRangeLength: maxRangeLength, sliderType } = this;
    let result;

    if (sliderType === "single") {
      result = this.value;
      if (typeof result === "undefined" || result.length === 0) {
        this.isIndeterminate = true;
        return min >= 0 ? [min] : [0];
      } else {
        return [result];
      }
    }

    result = this.value.slice();

    if (result.length === 0) {
      const fullRange = max - min;
      this.isIndeterminate = true;
      if (fullRange > maxRangeLength) return [(fullRange - maxRangeLength) / 2, (fullRange + maxRangeLength) / 2];
      return [min, max]; // TODO support several values 3 and more
    }

    return result;
  };

  public ensureMaxRangeBorders = (newValue:number, inputNumber):number => {
    const { renderedmaxRangeLength, getRenderedValue } = this;
    const value:number[] = getRenderedValue();
    const oldValue = value[inputNumber];

    let isOutOfRange = false;

    value[inputNumber] = newValue;

    for (let i = 0; i < value.length - 1; i++) {
      if (Math.abs(value[i] - value[i + 1]) > renderedmaxRangeLength) {
        isOutOfRange = true;
        break;
      }
    }

    return isOutOfRange ? oldValue : newValue;
  };

  public ensureMinRangeBorders = (newValue:number, inputNumber):number => {
    const { renderedminRangeLength, getRenderedValue } = this;
    const value:number[] = getRenderedValue();
    const oldValue = value[inputNumber];

    let isOutOfRange = false;

    value[inputNumber] = newValue;

    for (let i = 0; i < value.length - 1; i++) {
      if (Math.abs(value[i] - value[i + 1]) < renderedminRangeLength) {
        isOutOfRange = true;
        break;
      }
    }

    return isOutOfRange ? oldValue : newValue;
  };

  public handlePointerDown = (event: PointerEvent): void => {
    const choice = ItemValue.getItemByValue(this.visibleChoices, this.draggedChoiceValue);
    this.dragDropRankingChoices.startDrag(event, choice, this, this.draggedTargetNode);
  };

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
      name: "segmentCount:number",
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
      name: "labelCount:number",
      default: 6
    },
    {
      name: "maxRangeLength:number",
      // defaultFunc: (obj: QuestionSliderModel): number => {
      //   return obj.max;
      // }
    },
    {
      name: "minRangeLength:number"
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
      name: "labels:itemvalue[]",
    },
    {
      name: "allowDragRange:boolean",
      default: true
    },
    {
      name: "allowSwap:boolean",
      default: true
    }
  ],
  function () {
    return new QuestionSliderModel("");
  },
  "question", // TODO maybe rating ?
);
QuestionFactory.Instance.registerQuestion("slider", (name) => {
  return new QuestionSliderModel(name);
});
