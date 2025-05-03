import { Action } from "./actions/action";
import { ComputedUpdater } from "./base";
import { IQuestion } from "./base-interfaces";
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
  @property({ defaultValue: "auto" }) tooltipVisibility: "auto" | /*"always" |*/ "never";
  public get step(): number {
    if (this.segmentCount) {
      return (this.renderedMax - this.renderedMin) / this.segmentCount;
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
    if (this.customLabels.length > 0) return this.customLabels.length;
    if (this.tickSize) {
      return Math.round(100 / this.tickSize) + 2;
    }
    return this.getPropertyValue("labelCount");
  }
  public set labelCount(val: number) {
    this.setPropertyValue("labelCount", val);
  }
  //@property({ defaultValue: true }) autoGenerate: boolean;
  @propertyArray({ }) customLabels: ItemValue[];
  @property({ defaultValue: true }) allowDragRange: boolean;
  @property({ defaultValue: null }) tickSize: number | null;
  @property({ defaultValue: true }) allowSwap: boolean;
  /**
   * Specifies whether to display a button that clears the question value.
   *
   * Default value: `false`
   */
  @property({ defaultValue: false }) allowClear: boolean;

  constructor(name: string) {
    super(name);
    this.createNewArray("value");
    this.createItemValues("customLabels");
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
      .append(this.cssClasses.rootAnimatedThumbMode, !!this.animatedThumb)
      .toString();
  }

  public get thumbContainerCss(): string {
    return new CssClassBuilder()
      .append(this.cssClasses.thumbContainer)
      .append(this.cssClasses.thumbContainerIndeterminateMode, this.isIndeterminate)
      .toString();
  }

  public get renderedMax(): number {
    return this.max <= this.min ? 100 : this.max;
  }

  public get renderedMin(): number {
    return this.min >= this.max ? 0 : this.min;
  }

  public get renderedMaxRangeLength(): number {
    return this.maxRangeLength ?? this.renderedMax - this.renderedMin;
  }

  public get renderedMinRangeLength(): number {
    return this.minRangeLength ?? this.step;
  }

  public isIndeterminate = false;
  public get isNegativeScale():boolean {
    return this.renderedMin < 0;
  }
  @property({ defaultValue: null }) focusedThumb: number | null;
  @property({ defaultValue: null }) animatedThumb: boolean | null;
  public dragOrClickHelper: DragOrClickHelper;

  public getRenderedValue = ():number[] => {
    const { renderedMax: max, renderedMin: min, renderedMaxRangeLength, sliderType } = this;
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
      if (Math.abs(fullRange) > renderedMaxRangeLength) {
        const range = (fullRange - renderedMaxRangeLength) / 2;
        return [(min + range), (max - range)];
      }
      return [min, max]; // TODO support several values 3 and more
    }

    return result;
  };

  public getTrackPercentLeft = ():number => {
    const { getRenderedValue, sliderType, renderedMin: min } = this;
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
    const { getRenderedValue, sliderType, renderedMax: max } = this;
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
    const { renderedMax: max, renderedMin: min } = this;
    const fullRange = max - min;
    return (Math.abs(value - min) / fullRange) * 100;
  };

  public ensureMaxRangeBorders = (newValue:number, inputNumber):number => {
    const { renderedMaxRangeLength, getRenderedValue } = this;
    const value:number[] = getRenderedValue();
    const oldValue = value[inputNumber];

    let isOutOfRange = false;

    value[inputNumber] = newValue;

    for (let i = 0; i < value.length - 1; i++) {
      if (Math.abs(value[i] - value[i + 1]) > renderedMaxRangeLength) {
        isOutOfRange = true;
        break;
      }
    }

    return isOutOfRange ? oldValue : newValue;
  };

  public ensureMinRangeBorders = (newValue:number, inputNumber):number => {
    const { renderedMinRangeLength, getRenderedValue, allowSwap, renderedMin: min, renderedMax: max } = this;
    const value:number[] = getRenderedValue();
    const oldValue = value[inputNumber];

    let isOutOfRange = false;

    value[inputNumber] = newValue;

    for (let i = 0; i < value.length - 1; i++) {
      if (Math.abs(value[i] - value[i + 1]) < renderedMinRangeLength) {
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
    const { step, renderedMin: min, renderedMax: max } = this;

    const maxByStep = min + Math.trunc((max - min) / step) * step;
    let result = min + Math.round((value - min) / step) * step;
    result = Math.min(maxByStep, result);
    return result;
  };

  public handleRangeOnChange = (event: InputEvent): void => {
    if (!this.isRangeMoving) return;
    const { renderedMax: max, renderedMin: min, getRenderedValue } = this;
    const inputNode = <HTMLInputElement>event.target;
    const diff = this.oldInputValue - +inputNode.value;
    this.oldInputValue = +inputNode.value;

    const renderedValue = getRenderedValue();
    let borderArrived = false;
    for (let i = 0; i < renderedValue.length; i++) {
      const newVal = renderedValue[i] - diff;
      if (newVal <= max && newVal >= min) {
        renderedValue[i] -= diff;
      } else {
        borderArrived = true;
      }
    }

    if (borderArrived) { borderArrived = false; return; }
    this.setSliderValue(renderedValue);
  };

  public prepareInputRangeForMoving = (event: PointerEvent, rootNode: HTMLElement): void => {
    const { renderedMax: max, renderedMin: min } = this;

    this.isRangeMoving = true;
    this.animatedThumb = false;

    //const inputNode = this.rangeInputRef.current;
    const inputNode = <HTMLInputElement>event.target;
    inputNode.style.setProperty("--sjs-range-slider-range-input-thumb-width", "20px");
    inputNode.style.setProperty("--sjs-range-slider-range-input-thumb-left", "initial");
    inputNode.style.setProperty("--sjs-range-slider-range-input-thumb-position", "static");

    const leftPercent = ((event.clientX - rootNode.getBoundingClientRect().x) / rootNode.getBoundingClientRect().width) * 100;
    const newInputValue = leftPercent / 100 * (max - min) + min;
    inputNode.value = "" + newInputValue;
    this.oldInputValue = newInputValue;
  };

  public handleRangePointerUp = (event: PointerEvent, rootNode: HTMLElement) => {
    const { step, getRenderedValue, getClosestToStepValue } = this;
    const inputNode = <HTMLInputElement>event.target;

    if (this.isRangeMoving) {
      this.refreshInputRange(inputNode);
      this.isRangeMoving = false;
      if (step) {
        // const input = this.rangeInputRef.current as HTMLInputElement; //TODO
        inputNode.step = "" + step;

        const renderedValue:number[] = getRenderedValue();
        for (let i = 0; i < renderedValue.length; i++) {
          renderedValue[i] = getClosestToStepValue(renderedValue[i]);
        }
        this.setSliderValue(renderedValue);
      }
      return;
    }

    // const inputNode = this.rangeInputRef.current;
    inputNode.style.setProperty("--sjs-range-slider-range-input-thumb-width", "0px");
    inputNode.style.setProperty("--sjs-range-slider-range-input-thumb-left", "initial");
    inputNode.style.setProperty("--sjs-range-slider-range-input-thumb-position", "static");
    this.setValueByClickOnPath(event, rootNode);
  };

  public refreshInputRange = (inputNode: HTMLInputElement):void => {
    const { allowDragRange, getRenderedValue, getPercent } = this;
    if (!allowDragRange) return;
    //if (!this.rangeInputRef.current) return;
    if (!inputNode) return;
    const renderedValue = getRenderedValue();
    const percentLastValue = getPercent(renderedValue[renderedValue.length - 1]);
    const percentFirstValue = getPercent(renderedValue[0]);
    let percent: number = percentLastValue - percentFirstValue;

    //const inputNode = this.rangeInputRef.current;
    inputNode.style.setProperty("--sjs-range-slider-range-input-thumb-width", `calc(${percent}% - 20px - 20px)`); //TODO 20px is thumb width remove hardcode
    inputNode.style.setProperty("--sjs-range-slider-range-input-thumb-left", `calc(${percentFirstValue}% + 20px)`);
    inputNode.style.setProperty("--sjs-range-slider-range-input-thumb-position", "absolute");
  };

  public setSliderValue = (newValue) => {
    if (!this.isReadOnly && !this.isDisabledAttr && !this.isPreviewStyle && !this.isDisabledStyle) {
      this.value = newValue;
    }
  };

  public setValueByClickOnPath = (event: PointerEvent, rootNode: HTMLElement) => {
    const { renderedMax: max, renderedMin: min } = this;

    const percent = ((event.clientX - rootNode.getBoundingClientRect().x) / rootNode.getBoundingClientRect().width) * 100;
    let newValue = Math.round(percent / 100 * (max - min) + min);

    this.setValueByClick(newValue, event.target as HTMLInputElement);
  };

  public setValueByClick = (newValue: number, inputNode: HTMLInputElement) => {
    const { step, getClosestToStepValue, ensureMaxRangeBorders, ensureMinRangeBorders, getRenderedValue, refreshInputRange, setSliderValue } = this;

    this.animatedThumb = true;

    const renderedValue = getRenderedValue();
    let thumbIndex = 0;

    for (let i = 0; i < renderedValue.length; i++) {
      const currentMinValueDiff = Math.abs(renderedValue[thumbIndex] - newValue);
      const newMinValueDiff = Math.abs(renderedValue[i] - newValue);
      if (newMinValueDiff < currentMinValueDiff) {
        thumbIndex = i;
      }
    }

    if (renderedValue.length > 1) {
      newValue = ensureMaxRangeBorders(newValue, thumbIndex);
      newValue = ensureMinRangeBorders(newValue, thumbIndex);
    }
    renderedValue[thumbIndex] = newValue;

    if (step) {
      const currentValue = getRenderedValue();
      for (let i = 0; i < renderedValue.length; i++) {
        const currentValueStep = currentValue[i] / step;
        const newValueStep = renderedValue[i] / step;
        const newValueRound = Math.round(newValueStep);

        if (newValueRound === currentValueStep) {
          if (newValueStep > currentValueStep) {
            renderedValue[i] = renderedValue[i] + step;
          } else if (newValueStep < currentValueStep) {
            renderedValue[i] = renderedValue[i] - step;
          }
        }

        renderedValue[i] = getClosestToStepValue(renderedValue[i]);
      }
    }

    setSliderValue(renderedValue);
    //refreshInputRange(this.rangeInputRef.current);
    refreshInputRange(inputNode);
  };

  // public endLoadingFromJson() {
  //   super.endLoadingFromJson();
  //   if (this.jsonObj.customLabels !== undefined) {
  //     this.autoGenerate = false;
  //   }
  // }

  protected runConditionCore(values: HashTable<any>, properties: HashTable<any>): void {
    super.runConditionCore(values, properties);

    if (this.maxValueExpression) {
      let maxRunner: ExpressionRunner = this.getDefaultRunner(this.defaultExpressionRunner, this.maxValueExpression);

      if (!!maxRunner && maxRunner.canRun) {
        maxRunner.onRunComplete = (res) => {
          this.max = res ?? this.renderedMax;
        };
        maxRunner.run(values, properties);
      }
    }

    if (this.minValueExpression) {
      let minRunner: ExpressionRunner = this.getDefaultRunner(this.defaultExpressionRunner, this.minValueExpression);

      if (!!minRunner && minRunner.canRun) {
        minRunner.onRunComplete = (res) => {
          this.min = res ?? this.renderedMin;
        };
        minRunner.run(values, properties);
      }
    }
  }

  protected initPropertyDependencies() {
    this.registerSychProperties(["segmentCount"],
      () => {
        if (this.segmentCount) {
          this.step = (this.renderedMax - this.renderedMin) / this.segmentCount;
        }
      });
    this.registerSychProperties(["step"],
      () => {
        if (this.step) {
          this.segmentCount = (this.renderedMax - this.renderedMin) / this.step;
        }
      });
  }

  protected setNewValue(newValue: any) {
    super.setNewValue(newValue);
    if (this.isIndeterminate) {
      this.isIndeterminate = false;
    }
  }

  protected getDefaultTitleActions(): Array<Action> {
    const actions = [];
    if (!this.isDesignMode) {
      const clearAction = new Action(
        {
          locTitleName: "clearCaption",
          id: `sv-clr-btn-${this.id}`,
          action: () => { this.clearValue(true); },
          innerCss: this.cssClasses.clearButton,
          visible: <any>new ComputedUpdater(() => this.allowClear && !this.isReadOnly)
        }
      );
      actions.push(clearAction);
    }
    return actions;
  }

  private isRangeMoving = false;
  private oldInputValue: number | null = null;
}

Serializer.addClass(
  "slider",
  [
    {
      name: "sliderType",
      category: "sliderSettings",
      default: "range",
      choices: ["range", "single"],
      visibleIndex: 1
    },
    // {
    //   name: "autoGenerate",
    //   category: "sliderSettings",
    //   default: true,
    //   visibleIndex: 2,
    //   choices: [true, false]
    // },
    {
      name: "min:number",
      category: "sliderSettings",
      default: 0,
      visibleIndex: 3
    },
    {
      name: "max:number",
      category: "sliderSettings",
      default: 100,
      visibleIndex: 4
    },
    {
      name: "step:number",
      category: "sliderSettings",
      default: 1,
      visibleIndex: 5,
      // visibleIf: function (obj: any) {
      //   return obj.autoGenerate;
      // },
    },
    {
      name: "segmentCount:number",
      category: "sliderSettings",
      visibleIndex: 6,
      // visibleIf: function (obj: any) {
      //   return obj.autoGenerate;
      // },
    },
    {
      name: "minValueExpression",
      category: "sliderSettings",
      visibleIndex: 7,
      type: "condition"
    },
    {
      name: "maxValueExpression",
      category: "sliderSettings",
      visibleIndex: 8,
      type: "condition"
    },
    {
      name: "minRangeLength:number",
      category: "sliderSettings",
      visibleIf: function (obj: any) {
        return obj.sliderType === "range";
      },
      visibleIndex: 9,
    },
    {
      name: "maxRangeLength:number",
      category: "sliderSettings",
      visibleIf: function (obj: any) {
        return obj.sliderType === "range";
      },
      visibleIndex: 10,
    },
    {
      name: "customLabels:itemvalue[]",
      category: "sliderSettings",
      visibleIndex: 11,
      // visibleIf: function (obj: any) {
      //   return !obj.autoGenerate;
      // },
    },
    {
      name: "showLabels:boolean",
      category: "sliderSettings",
      visibleIndex: 12,
      default: true,
    },
    {
      name: "tooltipVisibility:string",
      category: "sliderSettings",
      default: "auto",
      visibleIndex: 13,
      choices: ["auto", "never"]
    },
    {
      name: "labelFormat:string",
      category: "sliderSettings",
      visibleIndex: 14,
      default: "{0}"
    },
    {
      name: "tooltipFormat:string",
      category: "sliderSettings",
      visibleIndex: 15,
      default: "{0}"
    },
    {
      name: "allowDragRange:boolean",
      category: "sliderSettings",
      visibleIndex: 16,
      default: true,
      visibleIf: function (obj: any) {
        return obj.sliderType === "range";
      },
    },
    {
      name: "allowSwap:boolean",
      category: "sliderSettings",
      visibleIndex: 17,
      default: true,
      visibleIf: function (obj: any) {
        return obj.sliderType === "range";
      },
    },
    {
      name: "showEdgeLabels:boolean",
      category: "sliderSettings",
      visibleIndex: 18,
      default: true
    },
    {
      name: "labelCount:number",
      category: "sliderSettings",
      visibleIndex: 19,
      default: 6,
      // visibleIf: function (obj: any) {
      //   return obj.autoGenerate;
      // },
    },
    {
      name: "allowClear:boolean",
      category: "sliderSettings",
      visibleIndex: 20,
      default: false,
    },
  ],
  function () {
    return new QuestionSliderModel("");
  },
  "question",
);
QuestionFactory.Instance.registerQuestion("slider", (name) => {
  return new QuestionSliderModel(name);
});
