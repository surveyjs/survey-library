import { DomDocumentHelper, DomWindowHelper } from "./global_variables_utils";
import { ItemValue } from "./itemvalue";
import { property, Serializer } from "./jsonobject";
import { Question } from "./question";
import { SurveyModel } from "./survey";
import { PropertyNameArray } from "../src/propertyNameArray";
import { SurveyError } from "./survey-error";
import { CustomError } from "./error";
import { settings } from "./settings";

type DrawStyle = { strokeColor: string, fillColor: string, strokeLineWidth: number }

export class QuestionImageMapModel extends Question {

  constructor(name: string) {
    super(name);
    this.createItemValues("areas");
  }

  bg: HTMLImageElement;
  svg: SVGElement;

  @property() imageLink: string;
  @property() areas: ImageMapArea[];
  @property() hoveredUID: number;
  @property() valuePropertyName: string;
  @property({ defaultValue: true }) multiSelect: boolean;

  public get maxSelectedAreas(): number {
    return this.getPropertyValue("maxSelectedAreas");
  }
  public set maxSelectedAreas(val: number) {
    if (val < 0) val = 0;
    this.setPropertyValue("maxSelectedAreas", val);
  }

  public get minSelectedAreas(): number {
    return this.getPropertyValue("minSelectedAreas");
  }
  public set minSelectedAreas(val: number) {
    if (val < 0) val = 0;
    this.setPropertyValue("minSelectedAreas", val);
  }

  @property() shape: string;

  @property() idleStrokeColor: string;
  @property() idleStrokeWidth: number;
  @property() idleFillColor: string;

  @property() hoverStrokeColor: string;
  @property() hoverStrokeWidth: number;
  @property() hoverFillColor: string;

  @property() selectedStrokeColor: string;
  @property() selectedStrokeWidth: number;
  @property() selectedFillColor: string;

  public getType(): string {
    return "imagemap";
  }

  protected onValueChanged() {
    super.onValueChanged();
    this.renderSVG();
  }

  public localeChanged() {
    super.localeChanged();
    this.renderSVG();
  }

  protected onPropertyValueChanged(name: string, oldValue: any, newValue: any): void {
    super.onPropertyValueChanged(name, oldValue, newValue);

    if (name === "multiSelect")this.clearValue();

    let styleProperties = [
      "idleStrokeColor", "idleStrokeWidth", "idleFillColor",
      "hoverStrokeColor", "hoverStrokeWidth", "hoverFillColor",
      "selectedStrokeColor", "selectedStrokeWidth", "selectedFillColor"
    ];
    if (styleProperties.indexOf(name) > -1)this.updateCSSVariables();

    if (name === "areas")this.renderSVG();
    if (name === "hoveredUID") {
      this.updateItemsCssByUID(oldValue);
      this.updateItemsCssByUID(newValue);
    }
  }

  public updateItemsCssByUID(uid: number) {

    if (!uid) return;
    const item = this.areas.find(i => i.uniqueId === uid);
    if (!item) return;
    const items = this.areas.filter(i => i.value === item.value);
    for (const e of items) {
      e.updateCSSClasses();
    }
  }

  protected getValueCore() {
    var value = super.getValueCore();
    if (!this.multiSelect && Array.isArray(value) && value.length === 0) {
      return undefined;
    }
    return value;
  }

  protected runConditionCore(properties: any): void {
    super.runConditionCore(properties);

    ItemValue.runEnabledConditionsForItems(this.areas, undefined, properties);
    let isChanged = ItemValue.runConditionsForItems(this.areas, undefined, undefined, properties, true);

    if (isChanged) {
      const clearIf = this.getClearIfInvisible();
      if (clearIf == "onHidden" || clearIf == "onHiddenContainer") { this.clearIncorrectValues(); }
      this.renderSVG();
    }
  }

  protected clearValueIfInvisibleCore(reason: string): void {
    super.clearValueIfInvisibleCore(reason);
    this.clearIncorrectValues();
  }

  public clearIncorrectValues(): void {
    super.clearIncorrectValues();
    if (!this.value) return;
    if (this.multiSelect) {
      this.value = this.value.filter((val: any) => {
        const item = this.areas.find(i => i.value === val);
        return !!item && item.isVisible;
      });
    } else {
      let found = this.areas.find(i => i.value === this.value);
      if (!found || !found.isVisible) {
        this.value = undefined;
      }
    }
  }

  public afterRenderQuestionElement(el: HTMLElement) {
    if (DomWindowHelper.isAvailable()) {
      if (!!el) {
        this.initImageMap(el);
      }
    }
    super.afterRenderQuestionElement(el);
  }

  public beforeDestroyQuestionElement(el: HTMLElement) {
    super.beforeDestroyQuestionElement(el);
    // TODO: remove event listeners
  }

  public initImageMap(el: HTMLElement): void {

    if (!el) return;

    this.bg = el.querySelector(`#${this.id}-bg`) as HTMLImageElement;
    this.svg = el.querySelector(`#${this.id}-svg`) as SVGElement;

    this.bg.addEventListener("load", () => {
      this.svg.setAttribute("viewBox", `0 0 ${ this.bg.naturalWidth } ${ this.bg.naturalHeight }`);
      this.renderSVG();
    });

    el.addEventListener("click", (event) => {

      const uid = (event.target as HTMLElement).dataset["uid"];
      if (!uid) return;
      const item = this.areas.find(i => i.uniqueId === Number(uid));
      this.mapItemTooggle(item);
    });

    el.addEventListener("mouseover", (event: MouseEvent) => {
      const uid = (event.target as HTMLElement).dataset["uid"];
      if (!uid) return;
      this.hoveredUID = Number(uid);
    });

    el.addEventListener("mouseout", (event) => {
      this.hoveredUID = null;
    });

    this.updateCSSVariables();
  }

  public updateCSSVariables(): void {

    if (!this.svg) return;

    this.svg.style.removeProperty("--sd-imagemap-idle-fill-color");
    if (this.idleFillColor)this.svg.style.setProperty("--sd-imagemap-idle-fill-color", this.idleFillColor);
    this.svg.style.removeProperty("--sd-imagemap-idle-stroke-color");
    if (this.idleStrokeColor)this.svg.style.setProperty("--sd-imagemap-idle-stroke-color", this.idleStrokeColor);
    this.svg.style.removeProperty("--sd-imagemap-idle-stroke-width");
    if (this.idleStrokeWidth)this.svg.style.setProperty("--sd-imagemap-idle-stroke-width", this.idleStrokeWidth.toString());

    this.svg.style.removeProperty("--sd-imagemap-hover-fill-color");
    if (this.hoverFillColor)this.svg.style.setProperty("--sd-imagemap-hover-fill-color", this.hoverFillColor);
    this.svg.style.removeProperty("--sd-imagemap-hover-stroke-color");
    if (this.hoverStrokeColor)this.svg.style.setProperty("--sd-imagemap-hover-stroke-color", this.hoverStrokeColor);
    this.svg.style.removeProperty("--sd-imagemap-hover-stroke-width");
    if (this.hoverStrokeWidth)this.svg.style.setProperty("--sd-imagemap-hover-stroke-width", this.hoverStrokeWidth.toString());

    this.svg.style.removeProperty("--sd-imagemap-selected-fill-color");
    if (this.selectedFillColor)this.svg.style.setProperty("--sd-imagemap-selected-fill-color", this.selectedFillColor);
    this.svg.style.removeProperty("--sd-imagemap-selected-stroke-color");
    if (this.selectedStrokeColor)this.svg.style.setProperty("--sd-imagemap-selected-stroke-color", this.selectedStrokeColor);
    this.svg.style.removeProperty("--sd-imagemap-selected-stroke-width");
    if (this.selectedStrokeWidth)this.svg.style.setProperty("--sd-imagemap-selected-stroke-width", this.selectedStrokeWidth.toString());
  }

  public dispose(): void {
    super.dispose();
  }

  public renderSVG(): void {

    if (!this.svg) return;
    this.svg.innerHTML = "";

    for (const areas of this.areas) {
      areas.render(this.svg);
    }
  }

  protected onCheckForErrors(errors: Array<SurveyError>, isOnValueChanged: boolean, fireCallback: boolean): void {
    super.onCheckForErrors(errors, isOnValueChanged, fireCallback);
    if (this.multiSelect) {
      const length = Array.isArray(this.value) ? this.value.length : 0;
      if (this.maxSelectedAreas > 0 && length > this.maxSelectedAreas) {
        errors.push(new CustomError(
          this.getLocalizationFormatString("maxSelectError", this.maxSelectedAreas),
          this
        ));
      }
      if (this.minSelectedAreas > 0 && length < this.minSelectedAreas) {
        errors.push(new CustomError(
          this.getLocalizationFormatString("minSelectError", this.minSelectedAreas),
          this
        ));
      }
    }
  }

  protected convertToCorrectValue(val: any): any {
    if (this.multiSelect) {
      val = new PropertyNameArray(val, this.valuePropertyName).convert(val);
    }
    return super.convertToCorrectValue(val);
  }

  public getDisplayValueCore(keysAsText: boolean, value: any): any {

    if (!value) return value;
    if (!Array.isArray(value)) value = [value];

    value = value.map((e: any) => {
      if (typeof e === "object") {
        return this.valuePropertyName ? e[this.valuePropertyName] : undefined;
      }
      return e;
    }).filter(e => e !== undefined);

    value = value.map(e =>{
      return this.areas.find(item => item.value === e)?.text || undefined;
    }).filter(e => e !== undefined).join(settings.choicesSeparator);

    return value;
  }

  public mapItemTooggle(item: ImageMapArea): void {
    if (this.readOnly || !item.enabled) return;
    if (!this.multiSelect) {
      this.value = (this.value === item.value ? undefined : item.value);
      return;
    }
    this.value = new PropertyNameArray(this.value, this.valuePropertyName).toggle(item.value, this.maxSelectedAreas);
  }

  public isItemSelected(item: ImageMapArea): boolean {

    if (this.isInDesignMode) {
      return item.uniqueId === (this.value[0] ? this.value[0] : this.value);
    }

    if (!this.multiSelect) return this.value === item.value;
    return new PropertyNameArray(this.value, this.valuePropertyName).contains(item.value);
  }

  public isItemHovered(item: ImageMapArea): boolean {
    if (!this.hoveredUID) return false;
    const hoveredItem = this.areas.find(i => i.uniqueId === this.hoveredUID);
    if (!hoveredItem) return false;
    return this.isInDesignMode ? item.uniqueId === this.hoveredUID : item.value === hoveredItem.value;
  }
}

export class ImageMapArea extends ItemValue {

  constructor(value: any) {
    super(value);
  }

  public getBaseType(): string {
    return "imagemaparea";
  }

  public svg: SVGElement;

  protected onPropertyValueChanged(name: string, oldValue: any, newValue: any): void {
    super.onPropertyValueChanged(name, oldValue, newValue);

    let styleProperties = [
      "idleStrokeColor", "idleStrokeWidth", "idleFillColor",
      "hoverStrokeColor", "hoverStrokeWidth", "hoverFillColor",
      "selectedStrokeColor", "selectedStrokeWidth", "selectedFillColor"
    ];

    if (styleProperties.indexOf(name) > -1)this.updateCSSVariables();
  }

  @property() shape: string;
  public getShape(): string {
    const owner = this.locOwner as QuestionImageMapModel;
    return this.shape === "inherit" ? owner?.shape : this.shape;
  }

  @property() coords: string;

  @property() idleFillColor: string;
  @property() idleStrokeColor: string;
  @property() idleStrokeWidth: number;

  @property() hoverFillColor: string;
  @property() hoverStrokeColor: string;
  @property() hoverStrokeWidth: number;

  @property() selectedFillColor: string;
  @property() selectedStrokeColor: string;
  @property() selectedStrokeWidth: number;

  public render(container: SVGElement) {

    if (!container) return;

    const el = this.getSVGElement();

    this.updateCSSVariables();
    this.updateCSSClasses();

    container.appendChild(el);
  }

  public getSVGElement() {

    if (this.svg) return this.svg;

    const document = DomDocumentHelper.getDocument();
    const shape = this.getShape();
    const coords = this.coords;

    const el = document.createElementNS("http://www.w3.org/2000/svg", shape);

    el.setAttribute("title", this.text ? this.text : "");
    el.dataset["uid"] = this.uniqueId.toString();

    switch(shape) {
      case "rect":
        const [x, y, w, h] = coords.split(",");
        el.setAttribute("x", x);
        el.setAttribute("y", y);
        el.setAttribute("width", (Number(w) - Number(x)).toString());
        el.setAttribute("height", (Number(h) - Number(y)).toString());
        break;
      case "circle":
        const [cx, cy, r] = coords.split(",");
        el.setAttribute("cx", cx);
        el.setAttribute("cy", cy);
        el.setAttribute("r", r);
        break;
      case "polygon":
        el.setAttribute("points", coords);
        break;
    }

    this.svg = el;

    return el;
  }

  public getCSSVariables(): string {

    const variables = {
      "--sd-imagemap-idle-fill-color": this.idleFillColor,
      "--sd-imagemap-idle-stroke-color": this.idleStrokeColor,
      "--sd-imagemap-idle-stroke-width": this.idleStrokeWidth,
      "--sd-imagemap-hover-fill-color": this.hoverFillColor,
      "--sd-imagemap-hover-stroke-color": this.hoverStrokeColor,
      "--sd-imagemap-hover-stroke-width": this.hoverStrokeWidth,
      "--sd-imagemap-selected-fill-color": this.selectedFillColor,
      "--sd-imagemap-selected-stroke-color": this.selectedStrokeColor,
      "--sd-imagemap-selected-stroke-width": this.selectedStrokeWidth,
    };

    for (const key in variables) {
      if (!variables[key]) {
        delete variables[key];
      }
    }

    return Object.keys(variables).map((key) => `${key}: ${variables[key]}`).join("; ");
  }

  public getCSSClasses(): string {

    const owner = this.locOwner as QuestionImageMapModel;

    if (!owner) return "";

    const classes = owner.cssClasses;

    const isSelected = owner.isItemSelected(this);
    const isHovered = owner.isItemHovered(this);
    const isEnabled = this.enabled;

    if (!isEnabled) return classes.svgItemDisabled;
    if (isSelected) return classes.svgItemSelected;
    if (isHovered) return classes.svgItemHovered;

    return classes.svgItem;
  }

  public updateCSSVariables(): void {

    if (!this.svg) return;

    this.svg.setAttribute("style", this.getCSSVariables());
  }

  public updateCSSClasses(): void {

    if (!this.svg) return;

    this.svg.setAttribute("class", this.getCSSClasses());
  }
}

Serializer.addClass(
  "imagemaparea",
  [
    { name: "value", isUnique: false },
    { name: "shape", choices: ["inherit", "circle", "rect", "polygon"], default: "inherit" },
    { name: "coords:string", locationInTable: "detail" },

    { name: "idleFillColor:color", locationInTable: "detail" },
    { name: "idleStrokeColor:color", locationInTable: "detail" },
    { name: "idleStrokeWidth:number", locationInTable: "detail" },

    { name: "hoverFillColor:color", locationInTable: "detail" },
    { name: "hoverStrokeColor:color", locationInTable: "detail" },
    { name: "hoverStrokeWidth:number", locationInTable: "detail" },

    { name: "selectedFillColor:color", locationInTable: "detail" },
    { name: "selectedStrokeColor:color", locationInTable: "detail" },
    { name: "selectedStrokeWidth:number", locationInTable: "detail" },
  ],
  () => new ImageMapArea(""),
  "itemvalue"
);

Serializer.addClass(
  "imagemap",
  [
    { name: "imageLink:file", },
    { name: "areas:imagemaparea[]", },
    { name: "multiSelect:boolean", default: true, },
    { name: "valuePropertyName" },

    { name: "shape", choices: ["circle", "rect", "polygon"], default: "polygon", },

    { name: "idleFillColor:color" },
    { name: "idleStrokeColor:color" },
    { name: "idleStrokeWidth:number" },

    { name: "hoverFillColor:color" },
    { name: "hoverStrokeColor:color" },
    { name: "hoverStrokeWidth:number" },

    { name: "selectedFillColor:color" },
    { name: "selectedStrokeColor:color" },
    { name: "selectedStrokeWidth:number" },

    {
      name: "maxSelectedAreas:number",
      default: 0,
      onSettingValue: (obj: any, val: any): any => {
        if (val <= 0) return 0;
        const min = obj.minSelectedAreas;
        return min > 0 && val < min ? min : val;
      }
    },
    {
      name: "minSelectedAreas:number",
      default: 0,
      onSettingValue: (obj: any, val: any): any => {
        if (val <= 0) return 0;
        const max = obj.maxSelectedAreas;
        return max > 0 && val > max ? max : val;
      }
    },
  ],
  () => new QuestionImageMapModel(""),
  "question"
);

