import { ExpressionRunner } from "./conditions";
import { HashTable } from "./helpers";
import { ItemValue } from "./itemvalue";
import { property, propertyArray, Serializer } from "./jsonobject";
import { Question } from "./question";
import { QuestionFactory } from "./questionfactory";
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { DragOrClickHelper } from "./utils/dragOrClickHelper";

/**
 * A class that describes the Range Slider question type.
 *
 * [View Demo](https://surveyjs.io/form-library/examples/... (linkStyle))
 */
export class QuestionSliderModel extends Question {
  @property({ defaultValue: "range" }) sliderType: "range" | "single";
  @property({ defaultValue: 100 }) max: number;
  @property({ defaultValue: 0 }) min: number;
  @property({ defaultValue: null }) maxValueExpression: string | null;
  @property({ defaultValue: null }) minValueExpression: string | null;
  @property({ defaultValue: null }) maxRangeLength: number | null;
  @property({ defaultValue: null }) minRangeLength: number | null;
  @property({ defaultValue: "{0}" }) tooltipFormat: string;
  @property({ defaultValue: "{0}" }) labelFormat: string;
  @property({ defaultValue: "onhover" }) tooltipVisibility: "onhover" | "always" | "never";
  public get step(): number {
    if (this.labels.length > 0) {
      return (this.max - this.min) / (this.labels.length - 1);
    }
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
  public get labelCount(): number {
    if (this.labels.length > 0) return this.labels.length;
    if (this.tickSize) {
      return Math.round(100 / this.tickSize) + 2;
    }
    return this.getPropertyValue("labelCount");
  }
  public set labelCount(val: number) {
    this.setPropertyValue("labelCount", val);
  }
  @property({ defaultValue: true }) autoGenerate: boolean;
  @propertyArray({ }) labels: ItemValue[];
  @property({ defaultValue: true }) allowDragRange: boolean;
  @property({ defaultValue: null }) tickSize: number | null;
  @property({ defaultValue: true }) allowSwap: boolean;

  constructor(name: string) {
    super(name);
    this.createNewArray("value");
    this.createItemValues("labels");
    this.dragOrClickHelper = new DragOrClickHelper(null, false);
    this.initPropertyDependencies();
  }

  public getType(): string {
    return "slider";
  }

  public get rootCss(): string {
    return new CssClassBuilder()
      .append(this.cssClasses.root)
      .append(this.cssClasses.rootSingleMode, this.sliderType === "single")
      .append(this.cssClasses.rootNegativeScaleMode, this.isNegativeScale)
      .append(this.cssClasses.rootDesignMode, !!this.isDesignMode)
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

  public isIndeterminate = false;
  public get isNegativeScale():boolean {
    return this.min < 0;
  }
  @property({ defaultValue: null }) focusedThumb: number | null; // TODO probably need to be just internal not property
  public dragOrClickHelper: DragOrClickHelper;

  public getRenderedValue = ():number[] => {
    const { max, min, renderedmaxRangeLength, sliderType } = this;
    let result;

    if (sliderType === "single") {
      result = this.value;
      if (typeof result === "undefined" || result.length === 0) {
        this.isIndeterminate = true;
        return this.isNegativeScale ? [Math.min(max, 0)] : [min];
      } else {
        return [result];
      }
    }

    result = this.value.slice();

    if (result.length === 0) {
      const fullRange = max - min;
      this.isIndeterminate = true;
      if (Math.abs(fullRange) > renderedmaxRangeLength) {
        const range = (fullRange - renderedmaxRangeLength) / 2;
        return [(min + range), (max - range)];
      }
      return [min, max]; // TODO support several values 3 and more
    }

    return result;
  };

  public getTrackPercentLeft = ():number => {
    const { getRenderedValue, sliderType, min } = this;
    const value = getRenderedValue();
    let result;
    if (sliderType === "single") {
      if (value[0] > 0) {
        result = this.getPercent(Math.max(0, min));
      } else {
        result = this.getPercent(value[0]);
      }
    } else {
      result = this.getPercent(Math.min(...value));
    }

    return result;
  };

  public getTrackPercentRight = ():number => {
    const { getRenderedValue, sliderType, max } = this;
    const value = getRenderedValue();
    let result;

    if (sliderType === "single") {
      if (value[0] > 0) {
        result = this.getPercent(value[0]);
      } else {
        result = this.getPercent(Math.min(0, max));
      }
    } else {
      result = this.getPercent(Math.max(...value));
    }

    return 100 - result;
  };

  public getPercent = (value:number):number => {
    const { max, min } = this;
    const fullRange = max - min;
    return (Math.abs(value - min) / fullRange) * 100;
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
    const { renderedminRangeLength, getRenderedValue, allowSwap, min, max } = this;
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

    if (!allowSwap) {
      const prevValue = inputNumber > 0 ? value[inputNumber - 1] : min;
      const nextValue = inputNumber < value.length - 1 ? value[inputNumber + 1] : max;
      if (newValue <= prevValue || newValue >= nextValue) {
        isOutOfRange = true;
      }
    }

    return isOutOfRange ? oldValue : newValue;
  };

  public handlePointerDown = (event: PointerEvent): void => {
    const choice = ItemValue.getItemByValue(this.visibleChoices, this.draggedChoiceValue);
    this.dragDropRankingChoices.startDrag(event, choice, this, this.draggedTargetNode);
  };

  public getClosestToStepValue = (value: number): number => {
    const { step, min, max } = this;

    const maxByStep = min + Math.trunc((max - min) / step) * step;
    let result = min + Math.round((value - min) / step) * step;
    result = Math.min(maxByStep, result);
    return result;
  };

  public endLoadingFromJson() {
    super.endLoadingFromJson();
    if (this.jsonObj.labels !== undefined) {
      this.autoGenerate = false;
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

  protected initPropertyDependencies() {
    this.registerSychProperties(["segmentCount"],
      () => {
        if (this.segmentCount) {
          this.step = (this.max - this.min) / this.segmentCount;
        }
      });
    this.registerSychProperties(["step"],
      () => {
        if (this.step) {
          this.segmentCount = (this.max - this.min) / this.step;
        }
      });
  }

  protected setNewValue(newValue: any) {
    super.setNewValue(newValue);
    if (this.isIndeterminate) {
      this.isIndeterminate = false;
    }
  }
}

Serializer.addClass(
  "slider",
  [
    {
      name: "sliderType",
      default: "range",
      choices: ["range", "single"],
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
      default: "onhover",
      choices: ["onhover", "never"],
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
      visibleIf: function (obj: any) {
        return obj.autoGenerate;
      },
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
      visibleIf: function (obj: any) {
        return obj.autoGenerate;
      },
    },
    {
      name: "labelCount:number",
      default: 6,
      visibleIf: function (obj: any) {
        return obj.autoGenerate;
      },
    },
    {
      name: "maxRangeLength:number",
      visibleIf: function (obj: any) {
        return obj.sliderType === "range";
      },
    },
    {
      name: "minRangeLength:number",
      visibleIf: function (obj: any) {
        return obj.sliderType === "range";
      },
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
      name: "autoGenerate",
      default: true,
      choices: [true, false]
    },
    {
      name: "labels:itemvalue[]",
      visibleIf: function (obj: any) {
        return !obj.autoGenerate;
      },
    },
    {
      name: "allowDragRange:boolean",
      default: true,
      visibleIf: function (obj: any) {
        return obj.sliderType === "range";
      },
    },
    {
      name: "allowSwap:boolean",
      default: true,
      visibleIf: function (obj: any) {
        return obj.sliderType === "range";
      },
    }
  ],
  function () {
    return new QuestionSliderModel("");
  },
  "question",
);
QuestionFactory.Instance.registerQuestion("slider", (name) => {
  return new QuestionSliderModel(name);
});
