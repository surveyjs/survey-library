import { DomDocumentHelper, DomWindowHelper } from "./global_variables_utils";
import { ItemValue } from "./itemvalue";
import { property, Serializer } from "./jsonobject";
import { Question } from "./question";

export class QuestionImageMapModel extends Question {
  constructor(name: string) { super(name); }

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
        this.drawShape(this.hoverCanvas, item.shape, item.coords.split(",").map(Number), {
          strokeColor: item.hoverStrokeColor,
          strokeLineWidth: item.hoverStrokeSize,
          fillColor: item.hoverFillColor,
        });
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

  public drawShape(canvas: HTMLCanvasElement, shape: string, coords: number[], style: { strokeColor: string, fillColor: string, strokeLineWidth: number }): void {

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
      this.drawShape(this.selectedCanvas, item.shape, item.coords.split(",").map(Number), {
        strokeColor: item.selectedStrokeColor,
        strokeLineWidth: item.selectedStrokeSize,
        fillColor: item.selectedFillColor,
      });
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

  @property() multiSelect: boolean;

  public mapItemTooggle(item: ImageMapItem): void {

    if (!this.multiSelect) {
      this.value = item.value;
      return;
    }

    if (this.isItemSelected(item)) {
      const newValue = (this.value || []).filter((e: any) => e !== item.value);
      this.value = newValue.length ? newValue : undefined;
    } else {
      this.value = [...(this.value || []), item.value];
    }
  }

  public isItemSelected(item: ImageMapItem): boolean {
    if (!this.multiSelect) {
      return this.value === item.value;
    }
    return (this.value || []).includes(item.value);
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

  @property() selectedStrokeColor: string;
  @property() selectedStrokeSize: number;
  @property() selectedFillColor: string;
}

Serializer.addClass("imagemapitem",
  [
    { name: "shape", choices: ["circle", "rect", "poly"], default: "poly" },
    { name: "coords:string", locationInTable: "detail" },

    { name: "hoverStrokeColor:color", default: "rgba(255, 0, 0, 1)", locationInTable: "detail" },
    { name: "hoverStrokeSize:number", default: 1, locationInTable: "detail" },
    { name: "hoverFillColor:color", default: "rgba(255, 0, 0, 0.25)", locationInTable: "detail" },

    { name: "selectedStrokeColor:color", default: "rgba(0, 0, 0, 1)", locationInTable: "detail" },
    { name: "selectedStrokeSize:number", default: 1, locationInTable: "detail" },
    { name: "selectedFillColor:color", default: "rgba(0, 0, 0, 0.25)", locationInTable: "detail" },
  ],
  () => new ImageMapItem(""),
  "itemvalue"
);

Serializer.addClass(
  "imagemap",
  [
    { name: "imageLink:file", category: "general" },
    { name: "imageMap:imagemapitem[]", category: "general" },
    { name: "multiSelect:boolean", default: true, category: "general" }
  ],
  () => new QuestionImageMapModel(""),
  "question"
);

