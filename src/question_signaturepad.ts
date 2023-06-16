import { property, Serializer } from "./jsonobject";
import { surveyLocalization } from "./surveyStrings";
import { QuestionFactory } from "./questionfactory";
import { Question } from "./question";
import SignaturePad from "signature_pad";
import { CssClassBuilder } from "./utils/cssClassBuilder";

var defaultWidth = 300;
var defaultHeight = 200;

function resizeCanvas(canvas: HTMLCanvasElement) {
  var context: any = canvas.getContext("2d");
  var devicePixelRatio = window.devicePixelRatio || 1;
  var backingStoreRatio =
    context.webkitBackingStorePixelRatio ||
    context.mozBackingStorePixelRatio ||
    context.msBackingStorePixelRatio ||
    context.oBackingStorePixelRatio ||
    context.backingStorePixelRatio ||
    1;

  var ratio = devicePixelRatio / backingStoreRatio;

  var oldWidth = canvas.width;
  var oldHeight = canvas.height;

  canvas.width = oldWidth * ratio;
  canvas.height = oldHeight * ratio;

  canvas.style.width = oldWidth + "px";
  canvas.style.height = oldHeight + "px";

  context.scale(ratio, ratio);
}

/**
 * A class that describes the Signature Page question type.
 *
 * [View Demo](https://surveyjs.io/form-library/examples/signature-pad-widget-javascript/ (linkStyle))
 */
export class QuestionSignaturePadModel extends Question {
  @property({ defaultValue: false }) isDrawingValue: boolean;
  protected getCssRoot(cssClasses: any): string {
    return new CssClassBuilder()
      .append(super.getCssRoot(cssClasses))
      .append(cssClasses.small, this.signatureWidth.toString() === "300")
      .toString();
  }

  protected updateValue() {
    if (this.signaturePad) {
      var data = this.signaturePad.toDataURL(this.dataFormat);
      this.value = data;
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
    }
    super.afterRenderQuestionElement(el);
  }
  public beforeDestroyQuestionElement(el: HTMLElement) {
    if (!!el) {
      this.destroySignaturePad(el);
    }
  }

  initSignaturePad(el: HTMLElement) {
    var canvas: any = el.getElementsByTagName("canvas")[0];
    var signaturePad = new SignaturePad(canvas, { backgroundColor: "#ffffff" });
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

    signaturePad.penColor = this.penColor;
    signaturePad.backgroundColor = this.backgroundColor;

    signaturePad.addEventListener("beginStroke", () => {
      this.isDrawingValue = true;
      canvas.focus();
    }, { once: true });

    signaturePad.addEventListener("endStroke", () => {
      this.isDrawingValue = false;
      this.updateValue();
    }, { once: true });

    var updateValueHandler = () => {
      var data = this.value;
      canvas.width = this.signatureWidth || defaultWidth;
      canvas.height = this.signatureHeight || defaultHeight;
      resizeCanvas(canvas);
      if (!data) {
        signaturePad.clear();
      } else {
        signaturePad.fromDataURL(data);
      }
    };
    updateValueHandler();
    this.readOnlyChangedCallback();
    this.signaturePad = signaturePad;
    var propertyChangedHandler = (sender: any, options: any) => {
      if (options.name === "signatureWidth" || options.name === "signatureHeight" || options.name === "value") {
        updateValueHandler();
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
   * - `""` (default) - PNG
   * - `"image/jpeg"` - JPEG
   * - `"image/svg+xml"` - SVG
   */
  @property({ defaultValue: "" }) dataFormat: string;

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
    return !this.isInputReadOnly && this.allowClear;
  }
  /**
   * Specifies a color for the pen. Accepts hexadecimal colors (`"#FF0000"`), RGB colors (`"rgb(255,0,0)"`), or color names (`"red"`).
   * @see backgroundColor
   */
  public get penColor(): string {
    return this.getPropertyValue("penColor");
  }
  public set penColor(val: string) {
    this.setPropertyValue("penColor", val);
  }
  /**
   * Specifies a color for the signature area background.  Accepts hexadecimal colors (`"#FF0000"`), RGB colors (`"rgb(255,0,0)"`), or color names (`"red"`).
   * @see penColor
   */
  public get backgroundColor(): string {
    return this.getPropertyValue("backgroundColor");
  }
  public set backgroundColor(val: string) {
    this.setPropertyValue("backgroundColor", val);
  }
  get clearButtonCaption(): string {
    return this.getLocalizationString("clearCaption");
  }

  public needShowPlaceholder(): boolean {
    return !this.isDrawingValue && this.isEmpty();
  }

  get placeHolderText(): string {
    return this.getLocalizationString("signaturePlaceHolder");
  }
  endLoadingFromJson(): void {
    super.endLoadingFromJson();
    //todo: need to remove this code
    if(this.signatureWidth === 300 && !!this.width && typeof this.width === "number" && this.width) {
      // eslint-disable-next-line no-console
      console.warn("Use signatureWidth property to set width for the signature pad");
      this.signatureWidth = this.width;
      this.width = undefined;
    }
    if(this.signatureHeight === 200 && !!this.height) {
      // eslint-disable-next-line no-console
      console.warn("Use signatureHeight property to set width for the signature pad");
      this.signatureHeight = this.height;
      this.height = undefined;
    }
  }
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
    {
      name: "penColor:color",
      category: "general",
      default: "#1ab394",
    },
    {
      name: "backgroundColor:color",
      category: "general",
      default: "#ffffff",
    },
    {
      name: "dataFormat",
      category: "general",
      default: "",
      choices: [
        { value: "", text: "PNG" },
        { value: "image/jpeg", text: "JPEG" },
        { value: "image/svg+xml", text: "SVG" },
      ],
    },
    { name: "defaultValue", visible: false },
    { name: "correctAnswer", visible: false },
  ],
  function () {
    return new QuestionSignaturePadModel("");
  },
  "question"
);
QuestionFactory.Instance.registerQuestion("signaturepad", (name) => {
  return new QuestionSignaturePadModel(name);
});
