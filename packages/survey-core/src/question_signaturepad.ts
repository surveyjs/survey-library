import { property, Serializer } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import SignaturePad from "signature_pad";
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { SurveyModel } from "./survey";
import { ConsoleWarnings } from "./console-warnings";
import { ITheme } from "./themes";
import { dataUrl2File, FileLoader, QuestionFileModelBase } from "./question_file";
import { isBase64URL } from "./utils/utils";
import { DomDocumentHelper, DomWindowHelper } from "./global_variables_utils";

var defaultWidth = 300;
var defaultHeight = 200;

/**
 * A class that describes the Signature question type.
 *
 * [View Demo](https://surveyjs.io/form-library/examples/signature-pad-widget-javascript/ (linkStyle))
 */
export class QuestionSignaturePadModel extends QuestionFileModelBase {
  @property({ defaultValue: false }) hasDrawnStroke: boolean;
  @property({ defaultValue: false }) isReadyForUpload: boolean;

  protected onPropertyValueChanged(name: string, oldValue: any, newValue: any): void {
    super.onPropertyValueChanged(name, oldValue, newValue);
    if (name === "penColor" || name === "backgroundColor" || name === "backgroundImage") {
      if (this.signaturePad) {
        this.updateColors(this.signaturePad);
      }
    }
  }
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
    if (DomWindowHelper.isAvailable()) {
      if (!!el) {
        if (!this.isDesignMode) {
          this.initSignaturePad(el);
        }
        this.element = el;
      }
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

      if (refresh) {
        this.loadPreview(this.value);
      }
    }
  }

  private fromUrl(url: string): void {
    this.isFileLoading = true;
    if (isBase64URL(url)) {
      this.fromDataUrl(url);
      this.isFileLoading = false;
    } else {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = url;
      img.onload = () => {
        if (!!this.canvas) {
          const canvas = DomDocumentHelper.createElement("canvas") as HTMLCanvasElement;
          canvas.width = this.containerWidth;
          canvas.height = this.containerHeight;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          var dataURL = canvas.toDataURL(this.getFormat());
          this.fromDataUrl(dataURL);
        }
        this.isFileLoading = false;
      };
      img.onerror = () => {
        this.isFileLoading = false;
      };
    }
  }
  private fromDataUrl(data: string) {
    this._loadedData = data;
    if (this.signaturePad) {
      let ratio = 1;
      let scale = this.scale;

      if (this.dataFormat === "svg") {
        const devicePixelRatio = DomWindowHelper.getDevicePixelRatio();
        ratio = devicePixelRatio || 1;
        scale = 1;
      }

      const options = {
        width: this.canvas.width * scale / ratio,
        height: this.canvas.height * scale / ratio
      };
      this.signaturePad.fromDataURL(data, options);
    }
  }
  private _loadedData: string = undefined;
  public get loadedData(): string {
    return this._loadedData;
  }
  protected loadPreview(newValue: any): void {
    if (!newValue) {
      if (this.signaturePad && this.canvas) {
        this.canvas.getContext("2d").clearRect(0, 0, this.canvas.width * this.scale, this.canvas.height * this.scale);
        this.signaturePad.clear();
      }
      this.hasDrawnStroke = false;
      this.valueWasChangedFromLastUpload = false;
      return;
    }
    if (this.storeDataAsText) {
      this.fromDataUrl(newValue);
    } else {
      if (this.loadedData) {
        this.fromDataUrl(this.loadedData);
      } else {
        var newValues = !!newValue ? [newValue] : [];
        if (!!this._previewLoader) {
          this._previewLoader.dispose();
        }
        this.isFileLoading = true;
        this._previewLoader = new FileLoader(this, (status, loaded) => {
          if (status === "success" && loaded && loaded.length > 0 && loaded[0].content) {
            this.fromDataUrl(loaded[0].content);
            this.isFileLoading = false;
          } else if (status === "skipped") {
            this.fromUrl(newValue);
          }
          this._previewLoader.dispose();
          this._previewLoader = undefined;
        });
        this._previewLoader.load(newValues);
      }
    }
  }

  protected onChangeQuestionValue(newValue: any): void {
    super.onChangeQuestionValue(newValue);
    if (!this.isLoadingFromJson) {
      this._loadedData = undefined;
      this.loadPreview(newValue);
    }
  }

  public onSurveyLoad(): void {
    super.onSurveyLoad();
    this.loadPreview(this.value);
  }

  private updateValueHandler = () => {
    this._loadedData = undefined;
    this.scaleCanvas(true, true);
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
      this.hasDrawnStroke = true;
      canvas.focus();
    }, { once: false });

    (signaturePad as any).addEventListener("endStroke", () => {
      if (this.storeDataAsText) {
        this.updateValue();
      } else {
        this.valueWasChangedFromLastUpload = true;
      }
    }, { once: false });

    this.updateValueHandler();
    this.readOnlyChangedCallback();
    var propertyChangedHandler = (sender: any, options: any) => {
      if (options.name === "signatureWidth" || options.name === "signatureHeight") {
        if (!this.valueIsUpdatingInternally)this.updateValueHandler();
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
  @property({ onSetting: (val: string) => correctFormatData(val) }) dataFormat: string;
  /**
   * Specifies the width of the signature area. Accepts positive integer numbers.
   *
   * [View Demo](https://surveyjs.io/form-library/examples/signature-pad-widget-javascript/ (linkStyle))
   */
  @property() signatureWidth: number;
  /**
   * Specifies the height of the signature area. Accepts positive integer numbers.
   */
  @property() signatureHeight: number;
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
  @property() height: number;

  /**
   * Specifies whether to display a button that clears the signature area.
   *
   * Default value: `true`
   */
  @property() allowClear: boolean;
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
   *
   * [View Demo](https://surveyjs.io/form-library/examples/upload-signature-pad-data-to-server/ (linkStyle))
   * @see backgroundColor
   */
  @property() penColor: string;
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
  @property() backgroundColor: string;
  /**
   * An image to display in the background of the signature area. Accepts a base64 or URL string value.
   * @see backgroundColor
   */
  @property() backgroundImage: string;

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
    const isDrawing = this.hasDrawnStroke;
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
  @property({ localizable: { defaultStr: "signaturePlaceHolder", markdown: true } }) placeholder: string;

  /**
   * A placeholder text for the signature area in read-only or preview mode. Applies when the [`showPlaceholder`](#showPlaceholder) property is `true`.
   */
  @property({ localizable: { defaultStr: "signaturePlaceHolderReadOnly", markdown: true } }) placeholderReadOnly: string;
  protected onBlurCore(event: any): void {
    super.onBlurCore(event);
    if (!this.storeDataAsText) {
      if (!this.element.contains(event.relatedTarget)) {
        if (!this.valueWasChangedFromLastUpload) return;
        this.uploadFiles([dataUrl2File(this.signaturePad.toDataURL(this.getFormat()), this.name + "." + correctFormatData(this.dataFormat), this.getFormat())], "signature");
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
  public clearValue(keepComment?: boolean, fromUI?: boolean): void {
    this.valueWasChangedFromLastUpload = false;
    super.clearValue(keepComment, fromUI);
    this._loadedData = undefined;
    this.loadPreview(this.value);
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
    { name: "signatureWidth:number", default: 300 },
    { name: "signatureHeight:number", default: 200 },
    { name: "signatureAutoScaleEnabled:boolean", default: false },
    { name: "penMinWidth:number", default: 0.5 },
    { name: "penMaxWidth:number", default: 2.5 },
    //need to remove this property
    { name: "height:number", visible: false },
    { name: "allowClear:boolean", default: true },
    { name: "showPlaceholder:boolean", default: true },
    {
      name: "placeholder:text",
      serializationProperty: "locPlaceholder",
      dependsOn: "showPlaceholder",
      visibleIf: (obj: QuestionSignaturePadModel) => obj.showPlaceholder
    },
    {
      name: "placeholderReadOnly:text",
      serializationProperty: "locPlaceholderReadOnly",
      dependsOn: "showPlaceholder",
      visibleIf: (obj: QuestionSignaturePadModel) => obj.showPlaceholder
    },
    { name: "backgroundImage:file" },
    { name: "penColor:color" },
    { name: "backgroundColor:color" },
    {
      name: "dataFormat",
      default: "png",
      choices: [
        { value: "png", text: "PNG" },
        { value: "jpeg", text: "JPEG" },
        { value: "svg", text: "SVG" },
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
