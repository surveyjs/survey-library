import { DomDocumentHelper, DomWindowHelper } from "./global_variables_utils";
import { ItemValue } from "./itemvalue";
import { property, Serializer } from "./jsonobject";
import { Question } from "./question";
import { PropertyNameArray } from "../src/propertyNameArray";
import { SurveyError } from "./survey-error";
import { CustomError } from "./error";
import { settings } from "./settings";

function createSVGElement(name: string): SVGElement {
  const document = DomDocumentHelper.getDocument();
  return document.createElementNS("http://www.w3.org/2000/svg", name);
}

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
  public get isMultiSelect(): boolean {
    return this.isDesignMode ? false : this.multiSelect;
  }

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

  @property() selectedArea: ImageMapArea | undefined;

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

    if (name === "isSelectedInDesigner" && newValue === false) {
      this.selectedArea = undefined;
    }
    if (name === "multiSelect")this.clearValue();

    if ([
      "idleStrokeColor", "idleStrokeWidth", "idleFillColor",
      "hoverStrokeColor", "hoverStrokeWidth", "hoverFillColor",
      "selectedStrokeColor", "selectedStrokeWidth", "selectedFillColor"
    ].indexOf(name) > -1)this.updateCSSVariables();

    if (["areas", "shape", "selectedArea", "hoveredUID"].indexOf(name) > -1)this.renderSVG();
  }

  protected getValueCore() {
    var value = super.getValueCore();
    if (!this.isMultiSelect && Array.isArray(value) && value.length === 0) {
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
    if (this.isMultiSelect) {
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

    if (this.bg) {
      this.bg.removeEventListener("load", this.onBgImageLoaded);
    }

    if (this.svg) {
      this.svg.removeEventListener("click", this.onClickHandler);
      this.svg.removeEventListener("mouseover", this.onMouseOverHandler);
      this.svg.removeEventListener("mouseout", this.onMouseOutHandler);
      this.svg.removeEventListener("mousedown", this.onMouseDownHandler);
      this.svg.removeEventListener("mouseup", this.onMouseUpHandler);
      this.svg.removeEventListener("mousemove", this.onMouseMoveHandler);
    }
  }

  onBgImageLoaded = () => {
    if (!this.svg || !this.bg) return;
    this.svg.setAttribute("viewBox", `0 0 ${ this.bg.naturalWidth } ${ this.bg.naturalHeight }`);
    this.renderSVG();
  };

  onClickHandler = (event: MouseEvent) => {
    if (this.isInDesignMode && this.selectedArea) {
      const idx = (event.target as HTMLElement).dataset["idx"];
      if (idx) {
        this.selectedArea.removeCoord(Number(idx));
      } else {
        const [x, y] = this.scaleCoordsToSVG([event.offsetX, event.offsetY]);
        this.selectedArea.addCoord(x, y);
      }
      this.drawAreaControls();
      return;
    }
    const uid = (event.target as HTMLElement).dataset["uid"];
    if (!uid) return;
    const item = this.areas.find(i => i.uniqueId === Number(uid));
    this.mapItemToggle(item);
  };

  onMouseOverHandler = (event: MouseEvent) => {
    if (this.isInDesignMode && this.selectedArea) return;
    const uid = (event.target as HTMLElement).dataset["uid"];
    if (!uid) return;
    this.hoveredUID = Number(uid);
  };

  onMouseOutHandler = () => {
    this.hoveredUID = null;
  };

  onMouseDownHandler = (event: MouseEvent) => {
    if ((event.target as HTMLElement).dataset["idx"] !== undefined) {
      this.activeControlPoint = event.target as SVGElement;
    }
  };

  onMouseUpHandler = () => {
    this.activeControlPoint = null;
  };

  onMouseMoveHandler = (event: MouseEvent) => {
    if (!this.activeControlPoint) return;

    const [x, y] = this.scaleCoordsToSVG([event.offsetX, event.offsetY]);

    const idx = Number(this.activeControlPoint.dataset["idx"]);
    const item = this.selectedArea;

    item.setCoord(idx, x, y);
  };

  public initImageMap(el: HTMLElement): void {

    if (!el) return;

    this.bg = el.querySelector(`#${this.id}-bg`) as HTMLImageElement;
    this.svg = el.querySelector(`#${this.id}-svg`) as SVGElement;

    this.bg.addEventListener("load", this.onBgImageLoaded);

    this.svg.removeEventListener("click", this.onClickHandler);
    this.svg.addEventListener("click", this.onClickHandler);

    this.svg.removeEventListener("mouseover", this.onMouseOverHandler);
    this.svg.addEventListener("mouseover", this.onMouseOverHandler);

    this.svg.removeEventListener("mouseout", this.onMouseOutHandler);
    this.svg.addEventListener("mouseout", this.onMouseOutHandler);

    this.svg.removeEventListener("mousedown", this.onMouseDownHandler);
    this.svg.addEventListener("mousedown", this.onMouseDownHandler);

    this.svg.removeEventListener("mouseup", this.onMouseUpHandler);
    this.svg.addEventListener("mouseup", this.onMouseUpHandler);

    this.svg.removeEventListener("mousemove", this.onMouseMoveHandler);
    this.svg.addEventListener("mousemove", this.onMouseMoveHandler);

    this.updateCSSVariables();
  }

  public scaleCoordsToSVG([x, y]): [number, number] {
    if (!this.svg || !this.bg) return [x, y];
    const scale = (this.svg as SVGGraphicsElement).getScreenCTM().a;
    return [x / scale, y / scale];
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
      if (variables[key] == undefined || variables[key] === null) {
        delete variables[key];
      }
    }

    return Object.keys(variables).map((key) => `${key}: ${variables[key]}`).join("; ");
  }

  public updateCSSVariables(): void {

    if (!this.svg) return;

    const variables = this.getCSSVariables();
    if (!variables.length)this.svg.removeAttribute("style");
    else this.svg.setAttribute("style", variables);
  }

  public dispose(): void {
    super.dispose();
  }

  requestAnimationFrameId: number;
  public renderSVG(): void {
    if (!this.svg) return;
    if (this.requestAnimationFrameId) return;

    this.requestAnimationFrameId = requestAnimationFrame(() => {
      this.requestAnimationFrameId = null;
      this.svg.innerHTML = "";
      for (const areas of this.areas) {
        areas.render(this.svg);
      }
      this.drawAreaControls();
    });
  }

  protected onCheckForErrors(errors: Array<SurveyError>, isOnValueChanged: boolean, fireCallback: boolean): void {
    super.onCheckForErrors(errors, isOnValueChanged, fireCallback);
    if (this.isMultiSelect) {
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
    if (this.isMultiSelect) {
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

  public mapItemToggle(item: ImageMapArea): void {
    if (this.isInDesignMode) {
      this.selectedArea = (this.selectedArea === item ? undefined : item);
      return;
    }
    if (this.isReadOnly || !item.enabled) return;
    if (!this.isMultiSelect) {
      this.value = (this.value === item.value ? undefined : item.value);
      return;
    }
    this.value = new PropertyNameArray(this.value, this.valuePropertyName).toggle(item.value, this.maxSelectedAreas);
  }

  public isItemSelected(item: ImageMapArea): boolean {
    if (this.isInDesignMode) return this.selectedArea === item;
    if (!this.isMultiSelect) return this.value === item.value;
    return new PropertyNameArray(this.value, this.valuePropertyName).contains(item.value);
  }

  public isItemHovered(item: ImageMapArea): boolean {
    if (!this.hoveredUID) return false;
    const hoveredItem = this.areas.find(i => i.uniqueId === this.hoveredUID);
    if (!hoveredItem) return false;
    return this.isInDesignMode ? item.uniqueId === this.hoveredUID : item.value === hoveredItem.value;
  }

  public createControlPoint(x, y, idx) {

    const circle = createSVGElement("circle");
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", "4");
    circle.setAttribute("class", this.cssClasses.svgControlPoint);
    circle.dataset["idx"] = idx.toString();

    return circle;
  }

  controlPoints: SVGElement[] = [];
  activeControlPoint: SVGElement;
  public drawAreaControls(): void {

    // TODO: remove recreation of control points on each call
    if (!this.isInDesignMode) return;

    for (const control of this.controlPoints) {
      if (control.parentNode !== this.svg) continue;
      this.svg.removeChild(control);
    }

    this.controlPoints = [];

    const item = this.areas.find(area => area === this.selectedArea);
    if (!item) return;

    const shape = item.getShape();
    const coords = item.getCoords();

    switch(shape) {
      case "rect":
        for (let i = 0; i < 4; i += 2) {
          const controlPoint = this.createControlPoint(coords[i], coords[i + 1], this.controlPoints.length);
          this.svg.appendChild(controlPoint);
          this.controlPoints.push(controlPoint);
        }
        break;
      case "circle":
        for (const [x, y] of [
          [coords[0], coords[1]],
          [Number(coords[0]) + Number(coords[2]), coords[1]]
        ]) {
          const controlPoint = this.createControlPoint(x, y, this.controlPoints.length);
          this.svg.appendChild(controlPoint);
          this.controlPoints.push(controlPoint);
        }
        break;
      case "poly":
        for (let i = 0; i < coords.length; i += 2) {
          const controlPoint = this.createControlPoint(coords[i], coords[i + 1], this.controlPoints.length);
          this.svg.appendChild(controlPoint);
          this.controlPoints.push(controlPoint);
        }
        break;
    }
  }
}

export class ImageMapArea extends ItemValue {

  constructor(value: any) {
    super(value);
  }

  public getBaseType(): string {
    return "imagemaparea";
  }

  protected onPropertyValueChanged(name: string, oldValue: any, newValue: any): void {
    super.onPropertyValueChanged(name, oldValue, newValue);

    const owner = this.locOwner as QuestionImageMapModel;

    if ([
      "idleStrokeColor", "idleStrokeWidth", "idleFillColor",
      "hoverStrokeColor", "hoverStrokeWidth", "hoverFillColor",
      "selectedStrokeColor", "selectedStrokeWidth", "selectedFillColor"
    ].indexOf(name) > -1)this.updateCSSVariables();

    if (name === "shape") {
      owner.renderSVG();
    }

    if (name === "coords") {
      this.draw();
      owner.renderSVG();
    }
  }

  @property() shape: string;
  public getShape(): string {
    const owner = this.locOwner as QuestionImageMapModel;
    return this.shape === "inherit" ? owner?.shape : this.shape;
  }

  @property() coords: string;
  public getCoords(): string[] {

    const shape = this.getShape();
    let coords = this.coords ? this.coords.split(",").map(c => c.trim()).filter(c => c !== "") : [];

    switch(shape) {
      case "rect":
        coords = (coords.length < 4 ? ["10", "10", "100", "50"] : coords);
        break;
      case "circle":
        coords = (coords.length < 3 ? ["50", "50", "40"] : coords);
        break;
      case "poly":
        coords = (!coords.length ? ["50", "10", "90", "90", "10", "90"] : coords);
        break;
    }

    return coords;
  }
  public getSVGCoords(): string[] {

    const coords = this.getCoords();
    const shape = this.getShape();

    switch(shape) {
      case "rect":
        let [x1, y1, x2, y2] = coords.map(Number);
        const x = Math.min(x1, x2);
        const y = Math.min(y1, y2);
        const width = Math.abs(x2 - x1);
        const height = Math.abs(y2 - y1);
        return [x, y, width, height].map(e => e.toString());
      case "circle":
        return [coords[0], coords[1], coords[2]];
      case "poly":
        return coords;
    }

  }
  public addCoord(x, y) {
    const shape = this.getShape();
    if (shape !== "poly") return;
    const coords = this.getCoords();
    this.coords = coords + `,${x},${y}`;
  }
  public removeCoord(idx: number) {
    const shape = this.getShape();
    if (shape !== "poly") return;
    const coords = this.getCoords();
    if (coords.length / 2 <= 3) return;
    coords.splice(idx * 2, 2);
    this.coords = coords.join(",");
  }
  public setCoord(idx: number, x: number, y: number) {

    const coords = this.getCoords();
    const shape = this.getShape();

    switch(shape) {
      case "rect":
        if (idx < 0 || idx > 1) return;
        coords[idx * 2] = x.toString();
        coords[idx * 2 + 1] = y.toString();
        break;
      case "circle":
        if (idx < 0 || idx > 1) return;
        if (idx === 0) {
          coords[idx * 2] = x.toString();
          coords[idx * 2 + 1] = y.toString();
        } else {
          const cx = Number(coords[0]);
          const cy = Number(coords[1]);
          coords[2] = Math.sqrt((x - cx) * (x - cx) + (y - cy) * (y - cy)).toString();
        }
        break;
      case "poly":
        coords[idx * 2] = x.toString();
        coords[idx * 2 + 1] = y.toString();
        break;
    }

    this.coords = coords.join(",");
  }

  public draw(): void {

    const shape = this.getShape();

    switch(shape) {
      case "rect":
        let [x, y, width, height] = this.getSVGCoords();
        this.svg.setAttribute("x", x);
        this.svg.setAttribute("y", y);
        this.svg.setAttribute("width", width);
        this.svg.setAttribute("height", height);
        break;
      case "circle":
        const [cx, cy, r] = this.getSVGCoords();
        this.svg.setAttribute("cx", cx);
        this.svg.setAttribute("cy", cy);
        this.svg.setAttribute("r", r);
        break;
      case "poly":
        this.svg.setAttribute("points", this.getSVGCoords().join(","));
        break;
    }
  }

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

    el.setAttribute("title", this.text ? this.text : "");

    if (!this.visible) return;
    if (el.ownerSVGElement === container) return;
    container.appendChild(el);
  }

  public svg: SVGElement;
  public getSVGElement() {

    const shape = this.getShape();

    if (this.svg && this.svg.tagName === shape) {
      return this.svg;
    }

    const document = DomDocumentHelper.getDocument();

    const el = document.createElementNS("http://www.w3.org/2000/svg", shape === "poly" ? "polygon" : shape);
    el.dataset["uid"] = this.uniqueId.toString();
    this.svg = el;

    this.draw();

    return this.svg;
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
      if (variables[key] == undefined || variables[key] === null) {
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

    const variables = this.getCSSVariables();
    if (!variables.length)this.svg.removeAttribute("style");
    else this.svg.setAttribute("style", variables);
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
    { name: "shape", choices: ["inherit", "circle", "rect", "poly"], default: "inherit" },
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

    { name: "shape", choices: ["circle", "rect", "poly"], default: "poly", },

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

