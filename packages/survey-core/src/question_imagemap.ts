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

  backgroundImage: HTMLImageElement;

  previewCanvas: HTMLCanvasElement;
  selectedCanvas: HTMLCanvasElement;
  hoverCanvas: HTMLCanvasElement;

  imageMapMap: HTMLMapElement;
  hoveredItemValue: string;

  public getType(): string {
    return "imagemap";
  }

  public supportResponsiveness(): boolean {
    return true;
  }

  protected getObservedElementSelector(): string {
    return "#imagemap-" + this.id + "-background";
  }

  public processResponsiveness() {
    this.renderImageMap();
  }

  protected onValueChanged(): void {
    super.onValueChanged();
    this.renderSelectedCanvas();
  }

  protected onPropertyValueChanged(name: string, oldValue: any, newValue: any): void {
    super.onPropertyValueChanged(name, oldValue, newValue);
    if (name === "multiSelect") {
      this.clearValue();
    }
  }

  protected getValueCore() {
    var value = super.getValueCore();
    if (!this.multiSelect && Array.isArray(value) && value.length === 0) {
      return undefined;
    }
    return value;
  }

  public afterRenderQuestionElement(el: HTMLElement) {
    if (DomWindowHelper.isAvailable()) {
      if (!!el) {
        if (!this.isDesignMode) {
          this.initImageMap(el);
        }
        this.element = el;
      }
    }
    super.afterRenderQuestionElement(el);
  }

  public initImageMap(el: HTMLElement): void {

    if (!el) return;

    this.backgroundImage = el.querySelector(`#imagemap-${this.id}-background`) as HTMLImageElement;
    this.previewCanvas = el.querySelector(`#imagemap-${this.id}-canvas-preview`) as HTMLCanvasElement;
    this.selectedCanvas = el.querySelector(`#imagemap-${this.id}-canvas-selected`) as HTMLCanvasElement;
    this.hoverCanvas = el.querySelector(`#imagemap-${this.id}-canvas-hover`) as HTMLCanvasElement;
    this.imageMapMap = el.querySelector("map") as HTMLMapElement;

    this.imageMapMap.onclick = (event) => {
      let target = event.target as HTMLElement;
      let value = target.dataset.value;
      let item = this.areas.find(i => i.value === value);
      this.mapItemTooggle(item);
    };

    this.imageMapMap.onmouseover = (event: MouseEvent) => {
      this.hoveredItemValue = (event.target as HTMLElement).dataset.value;
      this.renderPreviewCanvas();
      this.renderHoverCanvas();
    };

    this.imageMapMap.onmouseout = (event) => {
      this.hoveredItemValue = null;
      this.renderPreviewCanvas();
      this.renderHoverCanvas();
    };

    this.backgroundImage.onload = (event) => {
      this.renderImageMap();
      this.renderPreviewCanvas();
      this.renderSelectedCanvas();
      this.renderHoverCanvas();
    };
  }

  public scaleCoords(coords: number[]): number[] {
    let scale = this.backgroundImage.width / this.backgroundImage.naturalWidth;
    return coords.map((coord) => coord * scale);
  }

  public drawShape(canvas: HTMLCanvasElement, shape: string, coords: number[], style: DrawStyle): void {

    let ctx = canvas.getContext("2d");

    ctx.beginPath();

    ctx.strokeStyle = style.strokeColor;
    ctx.lineWidth = style.strokeLineWidth;

    ctx.fillStyle = style.fillColor;

    switch(shape) {
      case "rect":
        ctx.rect(coords[0], coords[1], coords[2] - coords[0], coords[3] - coords[1]);
        break;
      case "circle":
        ctx.arc(coords[0], coords[1], coords[2], 0, 2 * Math.PI);
        break;
      case "poly":
        for (let i = 0; i < coords.length; i += 2) {
          ctx.lineTo(coords[i], coords[i + 1]);
        }
        ctx.closePath();
        break;
    }

    ctx.stroke();
    ctx.fill();
  }

  public clearCanvas(canvas: HTMLCanvasElement): void {
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  public renderImageMap(): void {
    this.imageMapMap.innerHTML = "";
    if (!this.areas) return;
    for (let item of this.areas) {
      let area = DomDocumentHelper.createElement("area") as HTMLAreaElement;
      area.shape = item.shape;
      area.coords = this.scaleCoords(item.coords.split(",").map(Number)).join(",");
      if (item.text) {
        area.title = item.text;
      }
      area.dataset["value"] = item.value;
      this.imageMapMap.appendChild(area);
    }
  }

  public renderPreviewCanvas(): void {
    if (!this.previewCanvas) return;
    this.clearCanvas(this.previewCanvas);
    this.previewCanvas.width = this.backgroundImage.naturalWidth;
    this.previewCanvas.height = this.backgroundImage.naturalHeight;

    if (!this.areas) return;
    for (const item of this.areas) {
      this.drawShape(this.previewCanvas, item.shape, item.coords.split(",").map(Number), item.getIdleStyle());
    }
  }

  public renderSelectedCanvas(): void {
    if (!this.selectedCanvas) return;
    this.clearCanvas(this.selectedCanvas);
    this.selectedCanvas.width = this.backgroundImage.naturalWidth;
    this.selectedCanvas.height = this.backgroundImage.naturalHeight;
    if (!this.areas) return;
    for (const item of this.areas) {
      if (!this.isItemSelected(item)) continue;
      this.drawShape(this.selectedCanvas, item.shape, item.coords.split(",").map(Number), item.getSelectedStyle());
    }
  }

  public renderHoverCanvas(): void {
    if (!this.hoverCanvas) return;
    this.clearCanvas(this.hoverCanvas);
    this.hoverCanvas.width = this.backgroundImage.naturalWidth;
    this.hoverCanvas.height = this.backgroundImage.naturalHeight;

    if (!this.hoveredItemValue) return;
    const items = this.imageMap.filter(i => i.value === this.hoveredItemValue);
    for (const item of items) {
      this.drawShape(this.hoverCanvas, item.shape, item.coords.split(",").map(Number), item.getHoverStyle());
    }

    this.hoverCanvas.classList.add("sd-imagemap-canvas-hover--hidden");
    this.hoverCanvas.getBoundingClientRect(); // Trigger reflow to restart the hover animation
    this.hoverCanvas.classList.remove("sd-imagemap-canvas-hover--hidden");
  }

  @property() imageLink: string;
  @property() areas: ImageMapArea[];
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

  @property() idleStrokeColor: string;
  @property() idleStrokeWidth: number;
  @property() idleFillColor: string;

  @property() hoverStrokeColor: string;
  @property() hoverStrokeWidth: number;
  @property() hoverFillColor: string;

  @property() selectedStrokeColor: string;
  @property() selectedStrokeWidth: number;
  @property() selectedFillColor: string;

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

  public mapItemTooggle(item: ImageMapArea): void {
    if (!this.multiSelect) {
      this.value = (this.value === item.value ? undefined : item.value);
      return;
    }

    this.value = new PropertyNameArray(this.value, this.valuePropertyName).toggle(item.value, this.maxSelectedAreas);
  }

  public isItemSelected(item: ImageMapArea): boolean {
    if (!this.multiSelect) return this.value === item.value;
    return new PropertyNameArray(this.value, this.valuePropertyName).contains(item.value);
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
}

export class ImageMapArea extends ItemValue {

  constructor(value: any) {
    super(value);
  }

  public getBaseType(): string {
    return "imagemaparea";
  }

  public get shape(): string {
    const owner = this.locOwner as any;
    return this.getPropertyValue("shape") || owner?.shape || "poly";
  }
  public set shape(val: string) {
    this.setPropertyValue("shape", val);
  }

  @property() coords: string;

  @property() idleFillColor: string;
  @property() idleStrokeColor: string;
  @property() idleStrokeWidth: number;
  public getIdleStyle(): DrawStyle {
    const owner = this.locOwner as any;
    return {
      strokeColor: this.idleStrokeColor ?? owner?.idleStrokeColor ?? "transparent",
      fillColor: this.idleFillColor ?? owner?.idleFillColor ?? "transparent",
      strokeLineWidth: this.idleStrokeWidth ?? owner?.idleStrokeWidth ?? 0
    };
  }

  @property() hoverFillColor: string;
  @property() hoverStrokeColor: string;
  @property() hoverStrokeWidth: number;
  public getHoverStyle(): DrawStyle {
    const owner = this.locOwner as any;
    const survey = this.getSurvey() as SurveyModel;
    return {
      strokeColor: this.hoverStrokeColor ?? owner?.hoverStrokeColor ?? survey?.themeVariables["--sjs-secondary-backcolor"] ?? "#FF00FF",
      fillColor: this.hoverFillColor ?? owner?.hoverFillColor ?? survey?.themeVariables["--sjs-secondary-backcolor-light"] ?? "#FF00FF",
      strokeLineWidth: this.hoverStrokeWidth ?? owner?.hoverStrokeWidth ?? 2
    };
  }

  @property() selectedFillColor: string;
  @property() selectedStrokeColor: string;
  @property() selectedStrokeWidth: number;
  public getSelectedStyle(): DrawStyle {
    const owner = this.locOwner as any;
    const survey = this.getSurvey() as SurveyModel;
    return {
      strokeColor: this.selectedStrokeColor ?? owner?.selectedStrokeColor ?? survey?.themeVariables["--sjs-primary-backcolor"] ?? "#FF00FF",
      fillColor: this.selectedFillColor ?? owner?.selectedFillColor ?? survey?.themeVariables["--sjs-primary-backcolor-light"] ?? "#FF00FF",
      strokeLineWidth: this.selectedStrokeWidth ?? owner?.selectedStrokeWidth ?? 2
    };
  }
}

Serializer.addClass("imagemaparea",
  [
    { name: "shape", choices: ["circle", "rect", "poly"] },
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
    { name: "imageLink:file", category: "general" },
    { name: "areas:imagemaparea[]", category: "general" },
    { name: "multiSelect:boolean", default: true, category: "general" },
    { name: "valuePropertyName", category: "data" },

    { name: "shape", choices: ["circle", "rect", "poly"], default: "poly", category: "general" },

    { name: "idleFillColor:color", category: "appearance" },
    { name: "idleStrokeColor:color", category: "appearance" },
    { name: "idleStrokeWidth:number", category: "appearance" },

    { name: "hoverFillColor:color", category: "appearance" },
    { name: "hoverStrokeColor:color", category: "appearance" },
    { name: "hoverStrokeWidth:number", category: "appearance" },

    { name: "selectedFillColor:color", category: "appearance" },
    { name: "selectedStrokeColor:color", category: "appearance" },
    { name: "selectedStrokeWidth:number", category: "appearance" },

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

