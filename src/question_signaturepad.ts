import { property, Serializer } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import SignaturePad from "signature_pad";
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { SurveyModel } from "./survey";
import { ConsoleWarnings } from "./console-warnings";
import { ITheme } from "./themes";
import { dataUrl2File, QuestionFileModelBase } from "./question_file";

var defaultWidth = 300;
var defaultHeight = 200;

/**
 * A class that describes the Signature question type.
 *
 * [View Demo](https://surveyjs.io/form-library/examples/signature-pad-widget-javascript/ (linkStyle))
 */
export class QuestionSignaturePadModel extends QuestionFileModelBase {
  @property({ defaultValue: false }) isDrawingValue: boolean;
  @property({ defaultValue: false }) isReadyForUpload: boolean;

  private getPenColorFromTheme(): string {
    const _survey = this.survey as SurveyModel;
    return !!_survey && !!_survey.themeVariables && _survey.themeVariables["--sjs-primary-backcolor"];
  }
  private updateColors(signaturePad: SignaturePad) {
    const penColorFromTheme = this.getPenColorFromTheme();
    const penColorProperty = this.getPropertyByName("penColor");
    signaturePad.penColor = this.penColor || penColorFromTheme || penColorProperty.defaultValue || "#1ab394";

    const backgroundColorProperty = this.getPropertyByName("backgroundColor");
    const backgroundColorFromTheme = penColorFromTheme ? "transparent" : undefined;
    const background = !!this.backgroundImage ? "transparent" : this.backgroundColor;
    signaturePad.backgroundColor = background || backgroundColorFromTheme || backgroundColorProperty.defaultValue || "#ffffff";
  }

  protected getCssRoot(cssClasses: any): string {
    return new CssClassBuilder()
      .append(super.getCssRoot(cssClasses))
      .append(cssClasses.small, this.signatureWidth.toString() === "300")
      .toString();
  }

  protected getFormat() {
    return this.dataFormat === "jpeg" ? "image/jpeg" :
      (this.dataFormat === "svg" ? "image/svg+xml" : "");
  }
  protected updateValue() {
    if (this.signaturePad) {
      var data = this.signaturePad.toDataURL(this.getFormat());
      this.valueIsUpdatingInternally = true;
      this.value = data;
      this.valueIsUpdatingInternally = false;
    }
  }

  constructor(name: string) {
    super(name);
  }
  public getType(): string {
    return "signaturepad";
  }
  public afterRenderQuestionElement(el: HTMLElement) {
    if (!!el) {
      this.initSignaturePad(el);
      this.element = el;
    }
    super.afterRenderQuestionElement(el);
  }
  public beforeDestroyQuestionElement(el: HTMLElement) {
    if (!!el) {
      this.destroySignaturePad(el);
    }
  }
  public themeChanged(theme: ITheme): void {
    if (!!this.signaturePad) {
      this.updateColors(this.signaturePad);
    }
  }
  private canvas: any;
  private element: any;
  private scale: number;
  private valueIsUpdatingInternally: boolean = false;
  @property({ defaultValue: false }) valueWasChangedFromLastUpload: boolean;

  private resizeCanvas() {
    this.canvas.width = this.containerWidth;
    this.canvas.height = this.containerHeight;
  }

  private scaleCanvas(refresh: boolean = true, resize: boolean = false) {
    const canvas = this.canvas;
    const scale = canvas.offsetWidth / this.containerWidth;
    if (this.scale != scale || resize) {
      this.scale = scale;
      canvas.style.width = this.renderedCanvasWidth;
      this.resizeCanvas();
      this.signaturePad.minWidth = this.penMinWidth * scale;
      this.signaturePad.maxWidth = this.penMaxWidth * scale;
      canvas.getContext("2d").scale(1 / scale, 1 / scale);

      if (refresh) this.refreshCanvas();
    }
  }
  private fromDataUrl(data: string) {
    this.signaturePad.fromDataURL(data, { width: this.canvas.width * this.scale, height: this.canvas.height * this.scale });
  }

  private fromUrl(url: string): void {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = url;
    img.onload = ()=>{
      const ctx = this.canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      var dataURL = this.canvas.toDataURL(this.getFormat());
      this.fromDataUrl(dataURL);
    };
  }
  private refreshCanvas() {
    if(!this.canvas) return;
    if (!this.value) {
      this.canvas.getContext("2d").clearRect(0, 0, this.canvas.width * this.scale, this.canvas.height * this.scale);
      this.signaturePad.clear();
      this.valueWasChangedFromLastUpload = false;
    } else {
      if(this.storeDataAsText) {
        this.fromDataUrl(this.value);
      } else {
        this.fromUrl(this.value);
      }
    }
  }

  private updateValueHandler = () => {
    this.scaleCanvas(false, true);
    this.refreshCanvas();
  };

  initSignaturePad(el: HTMLElement) {
    var canvas: any = el.getElementsByTagName("canvas")[0];
    this.canvas = canvas;
    this.resizeCanvas();
    var signaturePad = new SignaturePad(canvas, { backgroundColor: "#ffffff" });
    this.signaturePad = signaturePad;
    if (this.isInputReadOnly) {
      signaturePad.off();
    }

    this.readOnlyChangedCallback = () => {
      if (this.isInputReadOnly) {
        signaturePad.off();
      } else {
        signaturePad.on();
      }
    };

    this.updateColors(signaturePad);

    (signaturePad as any).addEventListener("beginStroke", () => {
      this.scaleCanvas();
      this.isDrawingValue = true;
      canvas.focus();
    }, { once: false });

    (signaturePad as any).addEventListener("endStroke", () => {
      this.isDrawingValue = false;
      if(this.storeDataAsText) {
        this.updateValue();
      } else {
        this.valueWasChangedFromLastUpload = true;
      }
    }, { once: false });

    this.updateValueHandler();
    this.readOnlyChangedCallback();
    var propertyChangedHandler = (sender: any, options: any) => {
      if (options.name === "signatureWidth" || options.name === "signatureHeight" || options.name === "value") {
        if (!this.valueIsUpdatingInternally) this.updateValueHandler();
      }
    };
    this.onPropertyChanged.add(propertyChangedHandler);
    this.signaturePad.propertyChangedHandler = propertyChangedHandler;
  }
  destroySignaturePad(el: HTMLElement) {
    if (this.signaturePad) {
      this.onPropertyChanged.remove(this.signaturePad.propertyChangedHandler);
      this.signaturePad.off();
    }
    this.readOnlyChangedCallback = null;
    this.signaturePad = null;
  }

  /**
   * Specifies the format in which to store the signature image.
   *
   * Possible values:
   *
   * - `"png"` (default)
   * - `"jpeg"`
   * - `"svg"`
   */
  public get dataFormat(): string {
    return this.getPropertyValue("dataFormat");
  }
  public set dataFormat(val: string) {
    this.setPropertyValue("dataFormat", correctFormatData(val));
  }
  /**
   * Specifies the width of the signature area. Accepts positive integer numbers.
   */
  public get signatureWidth(): number {
    return this.getPropertyValue("signatureWidth");
  }
  public set signatureWidth(val: number) {
    this.setPropertyValue("signatureWidth", val);
  }
  /**
   * Specifies the height of the signature area. Accepts positive integer numbers.
   */
  public get signatureHeight(): number {
    return this.getPropertyValue("signatureHeight");
  }
  public set signatureHeight(val: number) {
    this.setPropertyValue("signatureHeight", val);
  }
  /**
   * Specifies whether the signature area should be scaled to fit into the question width.
   *
   * Default value: `false`
   *
   * This property auto-scales the signature area to fill all available width within the question box while maintaining the default 3:2 aspect ratio. If you set [custom width](#signatureWidth) and [height](#signatureHeight) values, the setting will keep the aspect ratio of these dimensions.
   *
   * > The signature area is scaled only for display. The image saved in survey results will have dimensions specified by the [`signatureHeight`](#signatureHeight) and [`signatureWidth`](#signatureWidth) properties.
   */
  @property() signatureAutoScaleEnabled: boolean;
  /**
   * Speicifies the minimum width of pen strokes, measured in pixels.
   *
   * Default value: 0.5
   */
  @property() penMinWidth: number;
  /**
   * Speicifies the maximum width of pen strokes, measured in pixels.
   *
   * Default value: 2.5
   */
  @property() penMaxWidth: number;

  private get containerHeight(): any {
    return this.signatureHeight || defaultHeight;
  }

  private get containerWidth(): any {
    return this.signatureWidth || defaultWidth;
  }

  public get renderedCanvasWidth(): string {
    return this.signatureAutoScaleEnabled ? "100%" : this.containerWidth + "px";
  }

  //todo: need to remove this property
  public get height(): number {
    return this.getPropertyValue("height");
  }
  public set height(val: number) {
    this.setPropertyValue("height", val);
  }

  /**
   * Specifies whether to display a button that clears the signature area.
   *
   * Default value: `true`
   */
  public get allowClear(): boolean {
    return this.getPropertyValue("allowClear");
  }
  public set allowClear(val: boolean) {
    this.setPropertyValue("allowClear", val);
  }
  public get canShowClearButton(): boolean {
    const hasSignature = !this.nothingIsDrawn();
    const isUploading = this.isUploading;
    return !this.isInputReadOnly && this.allowClear && hasSignature && !isUploading;
  }
  /**
   * Specifies a color for the pen.
   *
   * This property accepts color values in the following formats:
   *
   * - Hexadecimal colors (`"#FF0000"`)
   * - RGB colors (`"rgb(255,0,0)"`)
   * - Color names (`"red"`)
   * @see backgroundColor
   */
  public get penColor(): string {
    return this.getPropertyValue("penColor");
  }
  public set penColor(val: string) {
    this.setPropertyValue("penColor", val);
    !!this.signaturePad && this.updateColors(this.signaturePad);
  }
  /**
   * Specifies a color for the signature area background. Ignored if [`backgroundImage`](#backgroundImage) is set.
   *
   * This property accepts color values in the following formats:
   *
   * - Hexadecimal colors (`"#FF0000"`)
   * - RGB colors (`"rgb(255,0,0)"`)
   * - Color names (`"red"`)
   * @see penColor
   */
  public get backgroundColor(): string {
    return this.getPropertyValue("backgroundColor");
  }
  public set backgroundColor(val: string) {
    this.setPropertyValue("backgroundColor", val);
    !!this.signaturePad && this.updateColors(this.signaturePad);
  }
  /**
   * An image to display in the background of the signature area. Accepts a base64 or URL string value.
   * @see backgroundColor
   */
  public get backgroundImage(): string {
    return this.getPropertyValue("backgroundImage");
  }
  public set backgroundImage(val: string) {
    this.setPropertyValue("backgroundImage", val);
    !!this.signaturePad && this.updateColors(this.signaturePad);
  }
  get clearButtonCaption(): string {
    return this.getLocalizationString("clearCaption");
  }
  /**
   * A Boolean value that specifies whether to show the placeholder text in the signature area.
   *
   * Default value: `true`
   *
   * Use the [`placeholder`](#placeholder) and [`placeholderReadOnly`](#placeholderReadOnly) properties to specify placeholder texts for the signature area in edit mode and in read-only or preview mode.
   */
  @property({}) showPlaceholder: boolean;

  public get locRenderedPlaceholder() {
    return this.isReadOnly ? this.locPlaceholderReadOnly : this.locPlaceholder;
  }

  public nothingIsDrawn(): boolean {
    const isDrawing = this.isDrawingValue;
    const isEmpty = this.isEmpty();
    const isUploading = this.isUploading;
    const valueWasChangedFromLastUpload = this.valueWasChangedFromLastUpload;
    return !isDrawing && isEmpty && !isUploading && !valueWasChangedFromLastUpload;
  }

  public needShowPlaceholder(): boolean {
    return this.showPlaceholder && this.nothingIsDrawn();
  }
  /**
   * A placeholder text for the signature area. Applies when the [`showPlaceholder`](#showPlaceholder) property is `true`.
   */
  @property({ localizable: { defaultStr: "signaturePlaceHolder" } }) placeholder: string;

  /**
   * A placeholder text for the signature area in read-only or preview mode. Applies when the [`showPlaceholder`](#showPlaceholder) property is `true`.
   */
  @property({ localizable: { defaultStr: "signaturePlaceHolderReadOnly" } }) placeholderReadOnly: string;
  public onBlur = (event: any): void => {
    if (!this.storeDataAsText) {
      if (!this.element.contains(event.relatedTarget)) {
        if (!this.valueWasChangedFromLastUpload) return;
        this.uploadFiles([dataUrl2File(this.signaturePad.toDataURL(this.getFormat()), this.name + "." + correctFormatData(this.dataFormat), this.getFormat())]);
        this.valueWasChangedFromLastUpload = false;
      }
    }
  }
  protected uploadResultItemToValue(r: any) {
    return r.content;
  }
  protected setValueFromResult(arg: any) {
    this.valueIsUpdatingInternally = true;
    this.value = arg?.length ? arg.map((r: any) => r.content)[0] : undefined;
    this.valueIsUpdatingInternally = false;
  }
  public clearValue(): void {
    this.valueWasChangedFromLastUpload = false;
    super.clearValue();
    this.refreshCanvas();
  }
  endLoadingFromJson(): void {
    super.endLoadingFromJson();
    //todo: need to remove this code
    if (this.signatureWidth === 300 && !!this.width && typeof this.width === "number" && this.width) {
      ConsoleWarnings.warn("Use signatureWidth property to set width for the signature pad");
      this.signatureWidth = this.width;
      this.width = undefined;
    }
    if (this.signatureHeight === 200 && !!this.height) {
      ConsoleWarnings.warn("Use signatureHeight property to set width for the signature pad");
      this.signatureHeight = this.height;
      this.height = undefined;
    }
  }
}

function correctFormatData(val: string): string {
  if (!val) val = "png";
  val = val.replace("image/", "").replace("+xml", "");
  if (val !== "jpeg" && val !== "svg") val = "png";
  return val;
}

Serializer.addClass(
  "signaturepad",
  [
    {
      name: "signatureWidth:number",
      category: "general",
      default: 300,
    },
    {
      name: "signatureHeight:number",
      category: "general",
      default: 200,
    },
    {
      name: "signatureAutoScaleEnabled:boolean",
      category: "general",
      default: false,
    },
    {
      name: "penMinWidth:number",
      category: "general",
      default: 0.5,
    },
    {
      name: "penMaxWidth:number",
      category: "general",
      default: 2.5,
    },
    //need to remove this property
    {
      name: "height:number",
      category: "general",
      visible: false
    },
    {
      name: "allowClear:boolean",
      category: "general",
      default: true,
    },
    { name: "showPlaceholder:boolean", category: "general", default: true },
    {
      name: "placeholder:text",
      serializationProperty: "locPlaceholder",
      category: "general",
      dependsOn: "showPlaceholder",
      visibleIf: (obj: QuestionSignaturePadModel) => obj.showPlaceholder
    },
    {
      name: "placeholderReadOnly:text",
      serializationProperty: "locPlaceholderReadOnly",
      category: "general",
      dependsOn: "showPlaceholder",
      visibleIf: (obj: QuestionSignaturePadModel) => obj.showPlaceholder
    },
    {
      name: "backgroundImage:file",
      category: "general",
    },
    {
      name: "penColor:color",
      category: "general",
    },
    {
      name: "backgroundColor:color",
      category: "general",
    },
    {
      name: "dataFormat",
      category: "general",
      default: "png",
      choices: [
        { value: "png", text: "PNG" },
        { value: "image/jpeg", text: "JPEG" },
        { value: "image/svg+xml", text: "SVG" },
      ],
      onSettingValue: (obj: any, val: any): any => {
        return correctFormatData(val);
      }
    },
    { name: "defaultValue", visible: false },
    { name: "correctAnswer", visible: false },
    { name: "storeDataAsText:boolean", default: true },
    { name: "waitForUpload:boolean", default: false },

  ],
  function () {
    return new QuestionSignaturePadModel("");
  },
  "question"
);
QuestionFactory.Instance.registerQuestion("signaturepad", (name) => {
  return new QuestionSignaturePadModel(name);
});
