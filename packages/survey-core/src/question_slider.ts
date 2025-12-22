import { Action } from "./actions/action";
import { ComputedUpdater } from "./base";
import { ExpressionRunner } from "./conditions";
import { DomDocumentHelper } from "./global_variables_utils";
import { HashTable, Helpers } from "./helpers";
import { ItemValue } from "./itemvalue";
import { property, propertyArray, Serializer } from "./jsonobject";
import { ILocalizableOwner, LocalizableString } from "./localizablestring";
import { Question } from "./question";
import { QuestionFactory } from "./questionfactory";
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { DragOrClickHelper } from "./utils/dragOrClickHelper";

interface ISliderLabelItemOwner extends ILocalizableOwner{
  getTextByItem(item: ItemValue):string;
}
export class SliderLabelItemValue extends ItemValue {
  protected getBaseType(): string {
    return "sliderlabel";
  }
  protected onGetText(text:string):string {
    if (!!text || !this.locOwner) return super.onGetText(text);
    return (this.locOwner as ISliderLabelItemOwner).getTextByItem(this);
  }
  protected getCorrectValue(value: any) {
    if (typeof value === "number") return value;
    if (Helpers.isNumber(value)) {
      return parseFloat(value.toString());
    }
    return this.value || 0;
  }
  public get showValue(): boolean {
    return this.getPropertyValue("showValue", false);
  }
  public set showValue(val: boolean) {
    this.setPropertyValue("showValue", val);
  }
}

/**
 * A class that describes the Slider question type.
 *
 * [View Slider Demo](https://surveyjs.io/form-library/examples/single-value-slider-input/ (linkStyle))
 *
 * [View Range Slider Demo](https://surveyjs.io/form-library/examples/dual-range-slider-input/ (linkStyle))
 */
export class QuestionSliderModel extends Question implements ISliderLabelItemOwner {
  /**
   * Specifies whether the slider allows selecting a single value (`"single"`) or a value range (`"range"`).
   *
   * Possible values:
   *
   * - `"single"` (default)
   * - `"range"`
   *
   * [View Slider Demo](https://surveyjs.io/form-library/examples/single-value-slider-input/ (linkStyle))
   *
   * [View Range Slider Demo](https://surveyjs.io/form-library/examples/dual-range-slider-input/ (linkStyle))
   */
  @property({ defaultValue: "single" }) sliderType: "range" | "single";
  /**
   * Defines the maximum value on the slider scale.
   *
   * Default value: 100
   *
   * [View Slider Demo](https://surveyjs.io/form-library/examples/single-value-slider-input/ (linkStyle))
   *
   * [View Range Slider Demo](https://surveyjs.io/form-library/examples/dual-range-slider-input/ (linkStyle))
   * @see maxValueExpression
   */
  @property({ defaultValue: 100 }) max: number;
  /**
   * Defines the minimum value on the slider scale.
   *
   * Default value: 0
   *
   * [View Slider Demo](https://surveyjs.io/form-library/examples/single-value-slider-input/ (linkStyle))
   *
   * [View Range Slider Demo](https://surveyjs.io/form-library/examples/dual-range-slider-input/ (linkStyle))
   * @see minValueExpression
   */
  @property({ defaultValue: 0 }) min: number;
  /**
   * An expression that dynamically calculates the maximum scale value. Overrides the static [`max`](#max) property if defined.
   *
   * [Expressions](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#expressions (linkStyle))
   */
  @property({ defaultValue: null }) maxValueExpression: string | null;
  /**
   * An expression that dynamically calculates the minimum scale value. Overrides the static [`min`](#min) property if defined.
   *
   * [Expressions](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#expressions (linkStyle))
   */
  @property({ defaultValue: null }) minValueExpression: string | null;
  /**
   * Specifies the maximum length between the two thumbs of a range slider. Applies only if [`sliderType`](#sliderType) is `"range"`.
   *
   * Default value: `null`
   *
   * [View Demo](https://surveyjs.io/form-library/examples/dual-range-slider-input/ (linkStyle))
   */
  @property({ defaultValue: null }) maxRangeLength: number | null;
  /**
   * Specifies the minimum length between the two thumbs of a range slider. Applies only if [`sliderType`](#sliderType) is `"range"`.
   *
   * Default value: `null`
   *
   * [View Demo](https://surveyjs.io/form-library/examples/dual-range-slider-input/ (linkStyle))
   */
  @property({ defaultValue: null }) minRangeLength: number | null;
  /**
   * A formatting string for thumb tooltips. You can use `{0}` as a placeholder for a tooltip's numeric value.
   *
   * Default value: `"{0}"`
   * @see tooltipVisibility
   */
  @property({ defaultValue: "{0}" }) tooltipFormat: string;
  /**
   * A formatting string for [auto-generated](#labelCount) or [custom labels](#customLabels). You can use `{0}` as a placeholder for the label's numeric value.
   *
   * Default value: `"{0}"`
   *
   * [View Demo](https://surveyjs.io/form-library/examples/customize-slider-scale-labels/ (linkStyle))
   *
   * > If you are using custom labels, `labelFormat` affects only those that do not define the `text` property.
   * @see showLabels
   * @see tooltipFormat
   */
  @property({ defaultValue: "{0}" }) labelFormat: string;
  /**
   * Controls the visibility of thumb tooltips.
   *
   * Possible values:
   *
   * - `"auto"` (default) - Tooltips appear when the thumb or selected range is hovered or focused.
   * - `"always"`- Tooltips are always visible.
   * - `"never"` - Tooltips are never displayed.
   * @see tooltipFormat
   */
  @property({ defaultValue: "auto" }) tooltipVisibility: "auto" | "always" | "never";
  /**
   * Sets the interval between selectable scale values.
   *
   * Default value: 1
   *
   * [View Slider Demo](https://surveyjs.io/form-library/examples/single-value-slider-input/ (linkStyle))
   *
   * [View Range Slider Demo](https://surveyjs.io/form-library/examples/dual-range-slider-input/ (linkStyle))
   */
  public get step(): number {
    // if (this.segmentCount) {
    //   return (this.renderedMax - this.renderedMin) / this.segmentCount;
    // }
    return this.getPropertyValue("step");
  }
  public set step(val: number) {
    this.setPropertyValue("step", val);
  }
  // @property({ defaultValue: null }) segmentCount: number | null;
  /**
   * Specifies whether the slider displays value labels along the scale.
   *
   * Default value: `true`
   *
   * [View Demo](https://surveyjs.io/form-library/examples/customize-slider-scale-labels/ (linkStyle))
   * @see labelCount
   * @see customLabels
   * @see labelFormat
   */
  @property({ defaultValue: true }) showLabels: boolean;
  /**
   * Defines how many auto-generated labels should be displayed along the slider scale. Ignored if the [`customLabels`](#customLabels) property is set.
   *
   * Default value: -1 (the number of labels is calculated automatically based on the [`min`](#min) and [`max`](#max) values)
   *
   * [View Demo](https://surveyjs.io/form-library/examples/customize-slider-scale-labels/ (linkStyle))
   * @see showLabels
   * @see labelFormat
   */
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
  @property({ defaultValue: true }) autoGenerate: boolean;
  /**
   * Specifies custom scale labels. Overrides auto-generated labels if defined.
   *
   * This property accepts an array of numbers or objects with the following fields:
   *
   * - `value`: `number`\
   * The scale value where the label should appear.
   *
   * - `text`: `string`\
   * The label text to display.
   *
   * - `showValue`: `boolean`\
   * Specifies whether to display the numeric value alongside the label text. Default value: `false`.
   *
   * Numbers and objects can be combined in the same array. For instance, the following slider configuration adds textual labels for the minimum and maximum scale values and numeric labels for intermediate points. The extreme labels also display their corresponding values.
   *
   * ```js
   * const surveyJson = {
   *   "elements": [
   *     {
   *       "type": "slider",
   *       // ...
   *       "customLabels": [
   *         { "value": 0, "text": "Lowest", "showValue": true },
   *         20,
   *         40
   *         60
   *         80,
   *         { "value": 100, "text": "Highest", "showValue": true }
   *       ]
   *     }
   *   ]
   * };
   * ```
   *
   * [View Demo](https://surveyjs.io/form-library/examples/customize-slider-scale-labels/ (linkStyle))
   * @see showLabels
   * @see labelCount
   * @see labelFormat
   */
  public get customLabels(): SliderLabelItemValue[] {
    return this.getPropertyValue("customLabels");
  }
  public set customLabels(val: SliderLabelItemValue[]) {
    this.setPropertyValue("customLabels", val);
  }
  @property({ defaultValue: true }) allowDragRange: boolean;
  @property({ defaultValue: null }) tickSize: number | null;
  /**
   * Allows the start and end thumbs to cross over each other. If `false`, the thumbs cannot be swapped. Applies only if [`sliderType`](#sliderType) is `"range"`.
   *
   * Default value: `false` if [`minRangeLength`](#minRangeLength) is defined, `true` otherwise.
   */
  public get allowSwap(): boolean {
    if (this.minRangeLength) return false;
    return this.getPropertyValue("allowSwap", true);
  }
  public set allowSwap(val: boolean) {
    this.setPropertyValue("allowSwap", val);
  }
  /**
   * Specifies whether to display a button that clears the selected slider value and resets it to `undefined`.
   *
   * Default value: `false`
   */
  @property({ defaultValue: false }) allowClear: boolean;

  constructor(name: string) {
    super(name);
    this.createItemValues("customLabels");
    this.dragOrClickHelper = new DragOrClickHelper(null, false);
    this.initPropertyDependencies();
  }
  protected onPropertyValueChanged(name: string, oldValue: any, newValue: any): void {
    super.onPropertyValueChanged(name, oldValue, newValue);
    const resetLabelsProps = ["min", "max", "step", "autoGenerate", "labelFormat", "labelCount"];
    if (resetLabelsProps.indexOf(name) > -1) {
      this.resetPropertyValue("generatedLabels");
      this.locStrsChanged();
    }
    const resetRenderedValueProps = ["min", "max", "step", "maxRangeLength", "minRangeLength", "sliderType"];
    if (resetRenderedValueProps.indexOf(name) > -1) {
      this.resetPropertyValue("renderedValue");
    }
  }
  @property({ defaultValue: null }) focusedThumb: number | null;
  @property({ defaultValue: null }) animatedThumb: boolean | null;
  public dragOrClickHelper: DragOrClickHelper;
  public get generatedLabels(): ItemValue[] {
    return this.getPropertyValue("generatedLabels", undefined, () => this.calcGeneratedLabels());
  }
  public get renderedValue(): number[] {
    return this.getPropertyValue("renderedValue", undefined, () => this.calcRenderedValue());
  }
  public set renderedValue(val: number[]) {
    this.setPropertyValue("renderedValue", val);
  }

  public getType(): string {
    return "slider";
  }

  public get rootCss(): string {
    return new CssClassBuilder()
      .append(this.cssClasses.root)
      .append(this.cssClasses.rootSingleMode, this.sliderType === "single")
      .append(this.cssClasses.rootNegativeScaleMode, !!this.isNegativeScale)
      .append(this.cssClasses.rootDesignMode, !!this.isDesignMode)
      .append(this.cssClasses.rootAnimatedThumbMode, !!this.animatedThumb)
      .append(this.cssClasses.rootTooltipsAlwaysMode, this.tooltipVisibility === "always")
      .append(this.cssClasses.rootLabelsShowValueTextMode, this.isLabelsShowValueText)
      .toString();
  }

  public getThumbContainerCss = (thumbNumber: number): string => {
    return new CssClassBuilder()
      .append(this.cssClasses.thumbContainer)
      .append(this.cssClasses.thumbContainerIndeterminateMode, !!this.isIndeterminate)
      .append(this.cssClasses.thumbContainerFocusedMode, thumbNumber === this.focusedThumb)
      .toString();
  };

  public get tooltipCss(): string {
    return new CssClassBuilder()
      .append(this.cssClasses.tooltip)
      .append(this.cssClasses.tooltipOnHoverMode, this.tooltipVisibility === "auto")
      .toString();
  }

  public getLabelCss = (locText: LocalizableString): string => {
    return new CssClassBuilder()
      .append(this.cssClasses.label)
      .append(this.cssClasses.labelLongMod, locText.renderedHtml.length > 10)
      .toString();
  };

  public get renderedLabelCount(): number {
    return this.labelCount < 0 ? 6 : this.labelCount;
  }

  public get renderedMax(): number {
    return this.max; // TODO
  }

  public get renderedMin(): number {
    return this.min; // TODO
  }

  public get renderedMaxRangeLength(): number {
    return this.maxRangeLength ?? this.renderedMax - this.renderedMin;
  }

  public get renderedMinRangeLength(): number {
    return this.minRangeLength ?? this.step;
  }

  public get renderedLabels(): Array<ItemValue> {
    const generatedLabels = this.generatedLabels; // need this const due to observability reasons
    const customLabels = this.customLabels; // need this const due to observability reasons
    if (this.autoGenerate) return generatedLabels;
    return customLabels;
  }

  public isIndeterminate = false;
  public get isNegativeScale():boolean {
    return this.renderedMin < 0;
  }

  public getTrackPercentLeft = ():number => {
    const { renderedValue, sliderType, renderedMin: min } = this;
    let result;
    if (sliderType === "single") {
      if (renderedValue[0] > 0) {
        result = this.getPercent(Math.max(0, min));
      } else {
        result = this.getPercent(renderedValue[0]);
      }
    } else {
      result = this.getPercent(Math.min(...renderedValue));
    }

    return result;
  };

  public getTrackPercentRight = ():number => {
    const { renderedValue, sliderType, renderedMax: max } = this;
    let result;

    if (sliderType === "single") {
      if (renderedValue[0] > 0) {
        result = this.getPercent(renderedValue[0]);
      } else {
        result = this.getPercent(Math.min(0, max));
      }
    } else {
      result = this.getPercent(Math.max(...renderedValue));
    }

    return 100 - result;
  };

  public getPercent = (value:number):number => {
    const { renderedMax: max, renderedMin: min } = this;
    const fullRange = max - min;
    return (Math.abs(value - min) / fullRange) * 100;
  };

  public ensureMaxRangeBorders = (newValue:number, inputNumber:number):number => {
    const { renderedMaxRangeLength, renderedValue } = this;
    const value:number[] = renderedValue.slice();
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

  public ensureMinRangeBorders = (newValue:number, inputNumber:number):number => {
    const { renderedMinRangeLength, renderedValue, allowSwap, renderedMin: min, renderedMax: max } = this;
    const value:number[] = renderedValue.slice();
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

  public getClosestToStepValue = (value: number): number => {
    const { step, renderedMin: min, renderedMax: max } = this;

    const maxByStep = min + Math.trunc((max - min) / step) * step;
    let result = min + Math.round((value - min) / step) * step;
    result = Math.min(maxByStep, result);
    return result;
  };

  public handleRangeOnChange = (event: InputEvent): void => {
    if (!this.isRangeMoving) return;
    if (!this.isAllowToChange()) return;
    const { renderedMax: max, renderedMin: min, renderedValue, ensureMaxRangeBorders, ensureMinRangeBorders } = this;
    const inputNode = <HTMLInputElement>event.target;
    const diff = this.oldInputValue - +inputNode.value;
    this.oldInputValue = +inputNode.value;

    let borderArrived = false;
    for (let i = 0; i < renderedValue.length; i++) {
      let newVal = renderedValue[i] - diff;
      newVal = ensureMaxRangeBorders(newVal, i);
      newVal = ensureMinRangeBorders(newVal, i);
      if (newVal <= max && newVal >= min) {
        renderedValue.splice(i, 1, newVal);
      } else {
        borderArrived = true;
      }
    }

    if (borderArrived) { borderArrived = false; return; }
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

  public handleRangePointerDown = (event: PointerEvent, rootNode: HTMLElement) => {
    const { dragOrClickHelper, allowDragRange, step, prepareInputRangeForMoving } = this;
    const inputNode = <HTMLInputElement>event.target;

    if (step) {
      inputNode.step = "0.01";
    }

    if (allowDragRange) {
      dragOrClickHelper.dragHandler = () => { prepareInputRangeForMoving.call(this, event, rootNode); };
      dragOrClickHelper.onPointerDown(event);
    }
  };

  public handleRangePointerUp = (event: PointerEvent, rootNode: HTMLElement) => {
    const { step, renderedValue, getClosestToStepValue } = this;
    const inputNode = <HTMLInputElement>event.target;

    if (this.isRangeMoving) {
      this.refreshInputRange();
      this.isRangeMoving = false;
      if (step) {
        // const input = this.rangeInputRef.current as HTMLInputElement; //TODO
        inputNode.step = "" + step;

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

  public refreshInputRange = (inputRef?: HTMLElement):void => {
    const { allowDragRange, renderedValue, getPercent } = this;
    if (!allowDragRange) return;
    //if (!this.rangeInputRef.current) return;
    const input:HTMLElement = inputRef || this.questionRootElement.querySelector("#" + this.id + "-sjs-slider-input-range-input"); //TODO

    if (!input) return;
    const percentLastValue = getPercent(renderedValue[renderedValue.length - 1]);
    const percentFirstValue = getPercent(renderedValue[0]);
    let percent: number = percentLastValue - percentFirstValue;

    //const inputNode = this.rangeInputRef.current;
    input.style.setProperty("--sjs-range-slider-range-input-thumb-width", `calc(${percent}% - 20px - 20px)`); //TODO 20px is thumb width remove hardcode
    input.style.setProperty("--sjs-range-slider-range-input-thumb-left", `calc(${percentFirstValue}% + 20px)`);
    input.style.setProperty("--sjs-range-slider-range-input-thumb-position", "absolute");
  };

  public setSliderValue = (newValue: number | number[]) => { // TODO move to setNewValue
    if (this.isAllowToChange()) {
      let result;
      if (this.sliderType === "single") {
        result = Array.isArray(newValue) ? newValue[0] : newValue;
      } else if (this.sliderType === "range") {
        result = newValue;
      }
      this.value = result;
      this.resetPropertyValue("renderedValue");
    }
  };

  public setValueByClickOnPath = (event: PointerEvent, rootNode: HTMLElement) => {
    const { renderedMax: max, renderedMin: min } = this;
    let isRtl = DomDocumentHelper.getComputedStyle(DomDocumentHelper.getBody()).direction == "rtl";

    let percent = ((event.clientX - rootNode.getBoundingClientRect().x) / rootNode.getBoundingClientRect().width) * 100;
    if (isRtl) percent = 100 - percent;

    let newValue = percent / 100 * (max - min) + min;
    this.setValueByClick(newValue, event.target as HTMLInputElement);
  };

  public setValueByClick = (newValue: number, inputNode?: HTMLInputElement) => {
    const { step, getClosestToStepValue, ensureMaxRangeBorders, ensureMinRangeBorders, renderedValue, refreshInputRange, setSliderValue } = this;

    this.animatedThumb = true;

    const value = renderedValue.slice();
    let thumbIndex = 0;

    for (let i = 0; i < value.length; i++) {
      const currentMinValueDiff = Math.abs(value[thumbIndex] - newValue);
      const newMinValueDiff = Math.abs(value[i] - newValue);
      if (newMinValueDiff < currentMinValueDiff) {
        thumbIndex = i;
      }
    }

    if (value.length > 1) {
      newValue = ensureMaxRangeBorders(newValue, thumbIndex);
      newValue = ensureMinRangeBorders(newValue, thumbIndex);
    }
    value[thumbIndex] = newValue;

    if (step) {
      const currentValue = renderedValue.slice();
      for (let i = 0; i < value.length; i++) {
        const currentValueStep = currentValue[i] / step;
        const newValueStep = value[i] / step;
        const newValueRound = Math.round(newValueStep);

        if (newValueRound === currentValueStep) {
          if (newValueStep > currentValueStep) {
            value[i] = value[i] + step;
          } else if (newValueStep < currentValueStep) {
            value[i] = value[i] - step;
          }
        }

        value[i] = getClosestToStepValue(value[i]);
      }
    }

    setSliderValue(value);
    //refreshInputRange(this.rangeInputRef.current);
    refreshInputRange();
  };

  public handleOnChange = (event: InputEvent, inputNumber: number): void => {
    if (!this.isAllowToChange()) return;
    if (this.oldValue === null) return; // Firefox raise one more OnChange after PointerUp and break the value
    const { allowSwap, ensureMaxRangeBorders, ensureMinRangeBorders, renderedValue } = this;
    const inputNode = <HTMLInputElement>event.target;

    let newValue: number = +inputNode.value;

    if (renderedValue.length > 1) {
      newValue = ensureMaxRangeBorders(newValue, inputNumber);
      if (!allowSwap) {
        newValue = ensureMinRangeBorders(newValue, inputNumber);
      }
    }

    renderedValue.splice(inputNumber, 1, newValue);
  };

  public handlePointerDown = (e: PointerEvent)=> {
    const { step, renderedValue } = this;
    if (step) {
      for (let i = 0; i < renderedValue.length; i++) {
        const input:any = this.questionRootElement.querySelector("#" + this.id + `-sjs-slider-input-${i}`); //TODO
        input.step = 0.01;
      }
    }
    this.oldValue = this.renderedValue;
    this.animatedThumb = false;
  };

  public handlePointerUp = (event:PointerEvent) => {
    event.stopPropagation();
    const { step, focusedThumb, renderedValue, allowSwap, renderedMinRangeLength, getClosestToStepValue, refreshInputRange, setSliderValue } = this;
    const focusedThumbValue = renderedValue[focusedThumb];
    const inputNode = <HTMLInputElement>event.target;

    renderedValue.sort((a, b)=>a - b);

    this.focusedThumb = renderedValue.indexOf(focusedThumbValue);
    if (step) {
      for (let i = 0; i < renderedValue.length; i++) {
        renderedValue[i] = getClosestToStepValue(renderedValue[i]);
        const input:any = this.questionRootElement.querySelector("#" + this.id + `-sjs-slider-input-${i}`); //TODO
        input.step = step;
      }
    }

    if (allowSwap) {
      for (let i = 0; i < renderedValue.length - 1; i++) {
        if (Math.abs(renderedValue[i] - renderedValue[i + 1]) < renderedMinRangeLength) {
          this.setPropertyValue("renderedValue", <number[]>this.oldValue);
          break;
        }
      }
    }

    setSliderValue(renderedValue);
    refreshInputRange();
    this.oldValue = null;
  };

  public handleKeyDown = (event: KeyboardEvent) => {
    this.oldValue = this.renderedValue;
    this.animatedThumb = true;
  };

  public handleKeyUp = (event: KeyboardEvent) => {
    this.oldValue = null;
    this.setSliderValue(this.renderedValue);
  };

  public handleOnFocus = (inputNumber: number): void => {
    this.focusedThumb = inputNumber;
  };

  public handleOnBlur = (): void => {
    this.focusedThumb = null;
  };

  public handleLabelPointerUp = (event: PointerEvent, newValue: number) => {
    const inputNode = <HTMLInputElement>event.target;
    if (isNaN(newValue)) return;
    this.setValueByClick(newValue, inputNode);
  };

  public getTooltipValue = (tooltipNumber: number):string => {
    const { step, getClosestToStepValue, renderedValue, tooltipFormat, formatNumber } = this;
    let value = renderedValue[tooltipNumber];
    value = step ? getClosestToStepValue(value) : value;
    value = formatNumber(value);
    return tooltipFormat.replace("{0}", "" + value);
  };

  public getTextByItem(item: ItemValue): string {
    const res = item.value.toString();
    return this.labelFormat.replace("{0}", "" + res);
  }

  public getLabelText = (labelNumber: number):string => {
    const { step, renderedMax: max, renderedMin: min, renderedLabelCount: labelCount, formatNumber } = this;
    const fullRange = max - min;
    const isDecimal = step % 1 != 0;
    const count = labelCount - 1;
    let labelStep = count === 0 ? 0 : labelNumber * fullRange / count;
    return isDecimal ? "" + formatNumber(labelStep + min) : "" + Math.round(labelStep + min);
  };

  public getLabelPosition = (labelNumber: number):number => {
    const { max, min, renderedLabelCount: labelCount, customLabels } = this;
    const count = labelCount - 1;
    if (count === 0) return 0;
    const fullRange = max - min;
    const labelStep = min + labelNumber * fullRange / count;
    return labelStep;
  };

  public endLoadingFromJson() {
    super.endLoadingFromJson();
    if (this.jsonObj.customLabels !== undefined) {
      this.autoGenerate = false;
    }
    if (!this.isDesignMode && this.sliderType === "range") {
      this.createNewArray("value");
    }
  }

  public updateValueFromSurvey(newValue: any, clearData: boolean): void {
    newValue = this.ensureValueRespectMinMax(newValue);
    super.updateValueFromSurvey(newValue, clearData);
    if (this.isIndeterminate) {
      this.isIndeterminate = false;
    }
    this.resetPropertyValue("renderedValue");
  }

  public itemValuePropertyChanged(item: ItemValue, name: string, oldValue: any, newValue: any): void {
    if (this.autoGenerate === true) {
      const index = this.generatedLabels.indexOf(item);
      this.autoGenerate = false;
      this.setPropertyValue("customLabels", this.calcGeneratedLabels());
      item = this.customLabels[index];
    }
    if (name === "text") {
      if (Number.isFinite(+newValue)) {
        item.value = +newValue;
      } else {
        item.text = newValue;
      }
    }
    super.itemValuePropertyChanged(item, name, oldValue, newValue);
  }

  public afterRenderQuestionElement(el: HTMLElement): void {
    super.afterRenderQuestionElement(el);
    this.questionRootElement = el;
  }
  public beforeDestroyQuestionElement(el: HTMLElement): void {
    super.beforeDestroyQuestionElement(el);
    this.questionRootElement = undefined;
  }

  protected runConditionCore(properties: HashTable<any>): void {
    super.runConditionCore(properties);
    this.runExpressionByProperty("maxValueExpression", properties, (value: number) => {
      this.max = value ?? this.renderedMax;
    });
    this.runExpressionByProperty("minValueExpression", properties, (value: number) => {
      this.min = value ?? this.renderedMin;
    });
  }
  protected initPropertyDependencies() {
    // this.registerSychProperties(["segmentCount"],
    //   () => {
    //     if (this.segmentCount) {
    //       this.step = (this.renderedMax - this.renderedMin) / this.segmentCount;
    //     }
    //   }
    // );
    // this.registerSychProperties(["step"],
    //   () => {
    //     if (this.step) {
    //       this.segmentCount = (this.renderedMax - this.renderedMin) / this.step;
    //     }
    //   }
    // );
    this.registerSychProperties(["autoGenerate"],
      () => {
        if (!this.autoGenerate && this.customLabels.length === 0) {
          this.setPropertyValue("customLabels", this.calcGeneratedLabels());
        }
        if (this.autoGenerate) {
          this.customLabels.splice(0, this.customLabels.length);
        }
      }
    );
  }

  protected setNewValue(newValue: any): void {
    newValue = this.ensureValueRespectMinMax(newValue);
    super.setNewValue(newValue);
    if (this.isIndeterminate) {
      this.isIndeterminate = false;
    }
    this.resetPropertyValue("renderedValue");
  }

  protected setDefaultValue() {
    super.setDefaultValue();
    const val = this.defaultValue;
    if (this.sliderType === "single" && Array.isArray(val)) {
      this.setSliderValue(val);
    }
    this.resetPropertyValue("renderedValue");
  }

  protected getDefaultTitleActions(): Array<Action> {
    const actions = [];
    if (!this.isDesignMode) {
      const clearAction = new Action(
        {
          locTitleName: "clearCaption",
          id: `sv-clr-btn-${this.id}`,
          action: () => { this.clearValueFromUI(); },
          innerCss: this.cssClasses.clearButton,
          visible: <any>new ComputedUpdater(() => this.allowClear && !this.isReadOnly)
        }
      );
      actions.push(clearAction);
    }
    return actions;
  }

  protected getItemValueType():string {
    return "sliderlabel";
  }

  protected createLabelItem(value: number) {
    const res = new SliderLabelItemValue(value);
    res.locOwner = this;
    return res;
  }

  private isRangeMoving = false;
  private oldInputValue: number | null = null;
  private oldValue: number | number[] | null = null;

  private calcRenderedValue = ():number[] => {
    const { renderedMax: max, renderedMin: min, renderedMaxRangeLength, getClosestToStepValue, sliderType } = this;
    let result;

    if (sliderType === "single") {
      result = this.ensureValueRespectMinMax(this.value);
      if (typeof result === "undefined" || result === null || result.length === 0) {
        this.isIndeterminate = true;
        return this.isNegativeScale ? [Math.min(max, 0)] : [min];
      } else {
        return Array.isArray(result) ? [result[0]] : [result];
      }
    }

    result = Array.isArray(this.value) ? this.value.slice() : [];

    if (result.length === 0) {
      const fullRange = max - min;
      this.isIndeterminate = true;
      if (Math.abs(fullRange) > renderedMaxRangeLength) {
        const range = (fullRange - renderedMaxRangeLength) / 2;
        return [getClosestToStepValue(min + range), getClosestToStepValue(max - range)];
      }
      return [min, max]; // TODO support several values 3 and more
    }

    return result.map(v=>this.ensureValueRespectMinMax(v));
  };

  private calcGeneratedLabels() : Array<SliderLabelItemValue> {
    const labels:SliderLabelItemValue[] = [];
    for (let i = 0; i < this.renderedLabelCount; i++) {
      labels.push(this.createLabelItem(this.getLabelPosition(i)));
    }
    return labels;
  }

  private formatNumber(number:number) {
    return parseFloat(number.toFixed(4));
  }

  private ensureValueRespectMinMax(value: number[] | number):number[] | number {
    if (!Array.isArray(value)) {
      if (value < this.min) value = this.min;
      if (value > this.max) value = this.max;
    } else {
      value.forEach((el, i, array) => {
        if (el < this.min) value[i] = this.min;
        if (el > this.max) value[i] = this.max;
        if (i === 0) {
          if (typeof el === "undefined" || el === null) value[i] = this.min;
        } else if (i === array.length - 1) {
          if (typeof el === "undefined" || el === null) value[i] = this.max;
        }
      });
    }
    return value;
  }

  private isAllowToChange():boolean {
    return !this.isReadOnly && !this.isDisabledAttr && !this.isPreviewStyle && !this.isDisabledStyle;
  }

  private get isLabelsShowValueText(): boolean {
    return !!this.customLabels.find(l => l.showValue);
  }

  private questionRootElement: HTMLElement;
}

function getCorrectMinMax(min: any, max: any, isMax: boolean, step: number): any {
  let val = isMax ? max : min;
  if (min >= max) return isMax ? min + step : max - step;
  return val;
}

Serializer.addClass(
  "sliderlabel",
  [
    { name: "!value:number" },
    { name: "visibleIf", visible: false },
    { name: "enableIf", visible: false },
    { name: "showValue:boolean", locationInTable: "detail", default: false }
  ],
  (value: any) => new SliderLabelItemValue(value),
  "itemvalue"
);

Serializer.addClass(
  "slider",
  [
    {
      name: "sliderType",
      default: "single",
      choices: ["single", "range"],
    },
    {
      name: "autoGenerate",
      default: true,
      isSerializable: false,
      choices: [true, false]
    },
    {
      name: "min:number",
      default: 0,
      onSettingValue: (obj: any, val: any): any => {
        return getCorrectMinMax(val, obj.max, false, obj.step);
      },
    },
    {
      name: "max:number",
      default: 100,
      onSettingValue: (obj: any, val: any): any => {
        return getCorrectMinMax(obj.min, val, true, obj.step);
      },
    },
    {
      name: "step:number",
      default: 1,
      // visibleIf: function (obj: any) {
      //   return obj.autoGenerate;
      // },
    },
    // {
    //   name: "segmentCount:number",
    //   // visibleIf: function (obj: any) {
    //   //   return obj.autoGenerate;
    //   // },
    // },
    {
      name: "minValueExpression",
      type: "expression"
    },
    {
      name: "maxValueExpression",
      type: "expression"
    },
    {
      name: "minRangeLength:number",
      visibleIf: function (obj: any) {
        return obj.sliderType === "range";
      },
    },
    {
      name: "maxRangeLength:number",
      visibleIf: function (obj: any) {
        return obj.sliderType === "range";
      }
    },
    {
      name: "customLabels:sliderlabel[]",
      visibleIf: function (obj: any) {
        return !obj.autoGenerate;
      },
    },
    {
      name: "showLabels:boolean",
      default: true,
    },
    {
      name: "tooltipVisibility:string",
      default: "auto",
      choices: ["auto", "always", "never"]
    },
    {
      name: "labelFormat:string",
      default: "{0}"
    },
    {
      name: "tooltipFormat:string",
      default: "{0}"
    },
    {
      name: "allowDragRange:boolean",
      default: true,
      visible: false,
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
    },
    {
      name: "labelCount:number",
      default: -1,
      visibleIf: function (obj: any) {
        return obj.autoGenerate;
      },
    },
    {
      name: "allowClear:boolean",
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