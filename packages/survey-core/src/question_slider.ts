import { Action } from "./actions/action";
import { ComputedUpdater } from "./base";
import { ExpressionRunner } from "./conditions";
import { DomDocumentHelper } from "./global_variables_utils";
import { HashTable } from "./helpers";
import { ItemValue } from "./itemvalue";
import { property, propertyArray, Serializer } from "./jsonobject";
import { ILocalizableOwner, LocalizableString } from "./localizablestring";
import { Question } from "./question";
import { QuestionFactory } from "./questionfactory";
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { DragOrClickHelper } from "./utils/dragOrClickHelper";

interface ISliderLabelItemOwner extends ILocalizableOwner{
  getTextByItem(item: ItemValue, text: string):string;
}
export class SliderLabelItemValue extends ItemValue {
  protected getBaseType(): string {
    return "sliderlabel";
  }
  protected onGetText(text:string):string {
    const owner:ISliderLabelItemOwner = this.locOwner as any;
    if (!owner) return super.onGetText(text);
    return owner.getTextByItem(this, text);
  }
}

/**
 * A class that describes the Range Slider question type.
 *
 * [View Demo](https://surveyjs.io/form-library/examples/... (linkStyle))
 */
export class QuestionSliderModel extends Question implements ISliderLabelItemOwner {
  @property({ defaultValue: "single" }) sliderType: "range" | "single";
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
    // if (this.segmentCount) {
    //   return (this.renderedMax - this.renderedMin) / this.segmentCount;
    // }
    return this.getPropertyValue("step");
  }
  public set step(val: number) {
    this.setPropertyValue("step", val);
  }
  // @property({ defaultValue: null }) segmentCount: number | null;
  @property({ defaultValue: true }) showLabels: boolean;
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
  public get customLabels(): ItemValue[] {
    return this.getPropertyValue("customLabels");
  }
  public set customLabels(val: ItemValue[]) {
    this.setPropertyValue("customLabels", val);
  }
  @property({ defaultValue: true }) allowDragRange: boolean;
  @property({ defaultValue: null }) tickSize: number | null;
  public get allowSwap(): boolean {
    if (this.minRangeLength) return false;
    return this.getPropertyValue("allowSwap", true);
  }
  public set allowSwap(val: boolean) {
    this.setPropertyValue("allowSwap", val);
  }
  /**
   * Specifies whether to display a button that clears the question value.
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
  @property({ defaultValue: null }) focusedThumb: number | null;
  @property({ defaultValue: null }) animatedThumb: boolean | null;
  public dragOrClickHelper: DragOrClickHelper;
  public get generatedLabels(): ItemValue[] {
    return this.getPropertyValue("generatedLabels", undefined, () => this.calcGeneratedLabels());
  }
  get tooltipVisibilityPG(): boolean {
    return this.tooltipVisibility === "auto";
  }
  set tooltipVisibilityPG(newValue: boolean) {
    this.tooltipVisibility = newValue ? "auto" : "never";
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
    const { renderedMax: max, renderedMin: min, renderedValue } = this;
    const inputNode = <HTMLInputElement>event.target;
    const diff = this.oldInputValue - +inputNode.value;
    this.oldInputValue = +inputNode.value;

    let borderArrived = false;
    for (let i = 0; i < renderedValue.length; i++) {
      const newVal = renderedValue[i] - diff;
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
      inputNode.step = "0.1";
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
      this.refreshInputRange(inputNode);
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

  public refreshInputRange = (inputNode: HTMLInputElement | null):void => {
    const { allowDragRange, renderedValue, getPercent } = this;
    if (!allowDragRange) return;
    //if (!this.rangeInputRef.current) return;
    if (!inputNode) return;
    const percentLastValue = getPercent(renderedValue[renderedValue.length - 1]);
    const percentFirstValue = getPercent(renderedValue[0]);
    let percent: number = percentLastValue - percentFirstValue;

    //const inputNode = this.rangeInputRef.current;
    inputNode.style.setProperty("--sjs-range-slider-range-input-thumb-width", `calc(${percent}% - 20px - 20px)`); //TODO 20px is thumb width remove hardcode
    inputNode.style.setProperty("--sjs-range-slider-range-input-thumb-left", `calc(${percentFirstValue}% + 20px)`);
    inputNode.style.setProperty("--sjs-range-slider-range-input-thumb-position", "absolute");
  };

  public setSliderValue = (newValue: number | number[]) => { // TODO move to setNewValue
    if (!this.isReadOnly && !this.isDisabledAttr && !this.isPreviewStyle && !this.isDisabledStyle) {
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

  public setValueByClick = (newValue: number, inputNode: HTMLInputElement) => {
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
    refreshInputRange(inputNode);
  };

  public handleOnChange = (event: InputEvent, inputNumber: number): void => {
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
        const input:any = DomDocumentHelper.getDocument().getElementById(`sjs-slider-input-${i}`); //TODO
        input.step = 0.1;
      }
    }
    const value = this.value;
    this.oldValue = Array.isArray(value) ? value.slice() : value;
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
        const input:any = DomDocumentHelper.getDocument().getElementById(`sjs-slider-input-${i}`); //TODO
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
    refreshInputRange(inputNode);
    this.oldValue = null;
  };

  public handleKeyDown = (event: KeyboardEvent) => {
    this.oldValue = this.renderedValue;
    this.animatedThumb = true;
  };

  public handleKeyUp = (event: KeyboardEvent) => {
    this.oldValue = null;
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

  public getTextByItem(item: ItemValue, text: string): string {
    if (text) return text;
    const res = this.getLabelText(this.renderedLabels.indexOf(item));
    return this.labelFormat.replace("{0}", "" + res);
  }

  public getLabelText = (labelNumber: number):string => {
    const { step, renderedMax: max, renderedMin: min, labelCount, formatNumber } = this;
    const fullRange = max - min;
    const isDecimal = step % 1 != 0;
    const count = labelCount - 1;
    let labelStep = count === 0 ? 0 : labelNumber * fullRange / count;
    return isDecimal ? "" + formatNumber(labelStep + min) : "" + Math.round(labelStep + min);
  };

  public getLabelPosition = (labelNumber: number):number => {
    const { max, min, labelCount, customLabels } = this;
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
  }

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
    this.registerFunctionOnPropertiesValueChanged(["min", "max", "step", "autoGenerate", "labelFormat", "labelCount"],
      () => {
        this.resetPropertyValue("generatedLabels");
        this.locStrsChanged();
      }
    );
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
    this.registerFunctionOnPropertiesValueChanged(["min", "max", "step", "maxRangeLength", "minRangeLength"],
      () => {
        this.resetPropertyValue("renderedValue");
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
          action: () => { this.clearValue(true); },
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
      result = this.value;
      if (typeof result === "undefined" || result.length === 0) {
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

    return result;
  };

  private calcGeneratedLabels() : Array<SliderLabelItemValue> {
    const labels:SliderLabelItemValue[] = [];
    for (let i = 0; i < this.labelCount; i++) {
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
      value.forEach((el, i) => {
        if (el < this.min) value[i] = this.min;
        if (el > this.max) value[i] = this.max;
      });
    }
    return value;
  }
}

function getCorrectMinMax(min: any, max: any, isMax: boolean, step: number): any {
  let val = isMax ? max : min;
  if (min >= max) return isMax ? min + step : max - step;
  return val;
}

Serializer.addClass(
  "sliderlabel",
  [],
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
      visible: false,
      choices: ["auto", "never"]
    },
    {
      name: "tooltipVisibilityPG:boolean",
      default: true,
      isSerializable: false,
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
      default: 6,
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