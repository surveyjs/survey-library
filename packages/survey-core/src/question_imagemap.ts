import { DomDocumentHelper, DomWindowHelper } from "./global_variables_utils";
import { ItemValue } from "./itemvalue";
import { property, Serializer } from "./jsonobject";
import { Question } from "./question";
import { SurveyModel } from "./survey";
import { PropertyNameArray } from "../src/propertyNameArray";
import { SurveyError } from "./survey-error";
import { CustomError } from "./error";

type DrawStyle = { strokeColor: string, fillColor: string, strokeLineWidth: number }

export class QuestionImageMapModel extends Question {
  constructor(name: string) {
    super(name);
    this.createItemValues("imageMap");
  }

  backgroundImage: HTMLImageElement;
  selectedCanvas: HTMLCanvasElement;
  hoverCanvas: HTMLCanvasElement;
  imageMapMap: HTMLMapElement;

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
    this.selectedCanvas = el.querySelector(`#imagemap-${this.id}-canvas-selected`) as HTMLCanvasElement;
    this.hoverCanvas = el.querySelector(`#imagemap-${this.id}-canvas-hover`) as HTMLCanvasElement;
    this.imageMapMap = el.querySelector("map") as HTMLMapElement;

    this.imageMapMap.onclick = (event) => {
      let target = event.target as HTMLElement;
      let value = target.dataset.value;
      let item = this.imageMap.find(i => i.value === value);
      this.mapItemTooggle(item);
    };

    this.imageMapMap.onmouseover = (event) => {
      let target = event.target as HTMLElement;
      let value = target.dataset.value;
      for (const item of this.imageMap.filter(i => i.value === value)) {
        this.drawShape(this.hoverCanvas, item.shape, item.coords.split(",").map(Number), item.getHoverStyle());
      }
    };

    this.imageMapMap.onmouseout = (event) => {
      this.clearCanvas(this.hoverCanvas);
    };

    this.backgroundImage.onload = (event) => {
      this.renderImageMap();
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
    if (!this.imageMap) return;
    for (let item of this.imageMap) {
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

  public renderSelectedCanvas(): void {
    if (!this.selectedCanvas) return;
    this.clearCanvas(this.selectedCanvas);
    this.selectedCanvas.width = this.backgroundImage.naturalWidth;
    this.selectedCanvas.height = this.backgroundImage.naturalHeight;
    if (!this.imageMap) return;
    for (const item of this.imageMap) {
      if (!this.isItemSelected(item)) continue;
      this.drawShape(this.selectedCanvas, item.shape, item.coords.split(",").map(Number), item.getSelectedStyle());
    }
  }

  public renderHoverCanvas(): void {
    if (!this.hoverCanvas) return;
    this.clearCanvas(this.hoverCanvas);
    this.hoverCanvas.width = this.backgroundImage.naturalWidth;
    this.hoverCanvas.height = this.backgroundImage.naturalHeight;
  }

  public get imageLink() {
    return this.getPropertyValue("imageLink");
  }
  public set imageLink(val: string) {
    this.setPropertyValue("imageLink", val);
  }

  public get imageMap(): ImageMapItem[] {
    return this.getPropertyValue("imageMap");
  }
  public set imageMap(val: ImageMapItem[]) {
    this.setPropertyValue("imageMap", val);
  }

  public get valuePropertyName(): string {
    return this.getPropertyValue("valuePropertyName");
  }
  public set valuePropertyName(val: string) {
    this.setPropertyValue("valuePropertyName", val);
  }

  @property({ defaultValue: true }) multiSelect: boolean;

  public get maxSelectedChoices(): number {
    return this.getPropertyValue("maxSelectedChoices");
  }
  public set maxSelectedChoices(val: number) {
    if (val < 0) val = 0;
    this.setPropertyValue("maxSelectedChoices", val);
  }

  protected onCheckForErrors(errors: Array<SurveyError>, isOnValueChanged: boolean, fireCallback: boolean): void {
    super.onCheckForErrors(errors, isOnValueChanged, fireCallback);
    if (this.multiSelect) {
      const length = Array.isArray(this.value) ? this.value.length : 0;
      if (this.maxSelectedChoices > 0 && length > this.maxSelectedChoices) {
        errors.push(new CustomError(
          this.getLocalizationFormatString("maxSelectError", this.maxSelectedChoices),
          this
        ));
      }
      if (this.minSelectedChoices > 0 && length < this.minSelectedChoices) {
        errors.push(new CustomError(
          this.getLocalizationFormatString("minSelectError", this.minSelectedChoices),
          this
        ));
      }
    }
  }

  public get minSelectedChoices(): number {
    return this.getPropertyValue("minSelectedChoices");
  }
  public set minSelectedChoices(val: number) {
    if (val < 0) val = 0;
    this.setPropertyValue("minSelectedChoices", val);
  }

  protected convertToCorrectValue(val: any): any {

    if (this.multiSelect) {
      val = new PropertyNameArray(val, this.valuePropertyName).convert(val);
    }
    return super.convertToCorrectValue(val);
  }

  public mapItemTooggle(item: ImageMapItem): void {
    if (!this.multiSelect) {
      this.value = (this.value === item.value ? undefined : item.value);
      return;
    }

    this.value = new PropertyNameArray(this.value, this.valuePropertyName).toggle(item.value, this.maxSelectedChoices);
  }

  public isItemSelected(item: ImageMapItem): boolean {
    if (!this.multiSelect) return this.value === item.value;
    return new PropertyNameArray(this.value, this.valuePropertyName).contains(item.value);
  }
}

export class ImageMapItem extends ItemValue {

  constructor(value: any) {
    super(value);
  }

  public getBaseType(): string {
    return "imagemapitem";
  }

  @property() shape: string;
  @property() coords: string;

  @property() hoverStrokeColor: string;
  @property() hoverStrokeSize: number;
  @property() hoverFillColor: string;
  public getHoverStyle(): DrawStyle {
    const survey = this.getSurvey() as SurveyModel;
    return {
      strokeColor: this.getPropertyValue("hoverStrokeColor") ?? survey?.themeVariables["--sjs-secondary-backcolor"] ?? "#FF00FF",
      fillColor: this.getPropertyValue("hoverFillColor") ?? survey?.themeVariables["--sjs-secondary-backcolor-light"] ?? "#FF00FF",
      strokeLineWidth: this.getPropertyValue("hoverStrokeSize") ?? 2
    };
  }

  @property() selectedStrokeColor: string;
  @property() selectedStrokeSize: number;
  @property() selectedFillColor: string;
  public getSelectedStyle(): DrawStyle {
    const survey = this.getSurvey() as SurveyModel;
    return {
      strokeColor: this.getPropertyValue("selectedStrokeColor") ?? survey?.themeVariables["--sjs-primary-backcolor"] ?? "#FF00FF",
      fillColor: this.getPropertyValue("selectedFillColor") ?? survey?.themeVariables["--sjs-primary-backcolor-light"] ?? "#FF00FF",
      strokeLineWidth: this.getPropertyValue("selectedStrokeSize") ?? 2
    };
  }
}

Serializer.addClass("imagemapitem",
  [
    { name: "shape", choices: ["circle", "rect", "poly"], default: "poly" },
    { name: "coords:string", locationInTable: "detail" },

    { name: "hoverStrokeColor:color", locationInTable: "detail" },
    { name: "hoverStrokeSize:number", locationInTable: "detail" },
    { name: "hoverFillColor:color", locationInTable: "detail" },

    { name: "selectedStrokeColor:color", locationInTable: "detail" },
    { name: "selectedStrokeSize:number", locationInTable: "detail" },
    { name: "selectedFillColor:color", locationInTable: "detail" },
  ],
  () => new ImageMapItem(""),
  "itemvalue"
);

Serializer.addClass(
  "imagemap",
  [
    { name: "imageLink:file", category: "general" },
    { name: "imageMap:imagemapitem[]", category: "general" },
    { name: "multiSelect:boolean", default: true, category: "general" },
    { name: "valuePropertyName", category: "data" },
    { name: "maxSelectedChoices:number", default: 0,
      onSettingValue: (obj: any, val: any): any => {
        if (val <= 0) return 0;
        const min = obj.minSelectedChoices;
        return min > 0 && val < min ? min : val;
      }
    },
    { name: "minSelectedChoices:number", default: 0,
      onSettingValue: (obj: any, val: any): any => {
        if (val <= 0) return 0;
        const max = obj.maxSelectedChoices;
        return max > 0 && val > max ? max : val;
      }
    },
  ],
  () => new QuestionImageMapModel(""),
  "question"
);

