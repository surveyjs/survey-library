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
 * A Model for signature pad question.
 */
export class QuestionSignaturePadModel extends Question {
  @property({ defaultValue: false }) isDrawingValue: boolean;
  protected getCssRoot(cssClasses: any): string {
    return new CssClassBuilder()
      .append(super.getCssRoot(cssClasses))
      .append(cssClasses.small, this.width.toString() === "300")
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
    var buttonEl = el.getElementsByTagName("button")[0];
    var signaturePad = new SignaturePad(canvas, { backgroundColor: "#ffffff" });
    if (this.isInputReadOnly) {
      signaturePad.off();
    }

    buttonEl.onclick = () => {
      this.value = undefined;
    };

    this.readOnlyChangedCallback = () => {
      if (!this.allowClear || this.isInputReadOnly) {
        signaturePad.off();
        buttonEl.style.display = "none";
      } else {
        signaturePad.on();
        buttonEl.style.display = "block";
      }
    };

    signaturePad.penColor = this.penColor;
    signaturePad.backgroundColor = this.backgroundColor;
    signaturePad.onBegin = () => {
      this.isDrawingValue = true;
      canvas.focus();
    };
    signaturePad.onEnd = () => {
      this.isDrawingValue = false;
      this.updateValue();
    };
    var updateValueHandler = () => {
      var data = this.value;
      canvas.width = this.width || defaultWidth;
      canvas.height = this.height || defaultHeight;
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
      if (options.name === "width" || options.name === "height") {
        updateValueHandler();
      }
      if(options.name === "value") {
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
   * Use it to set the specific dataFormat for the signature pad image data.
   * formats: "" (default) - png, "image/jpeg" - jpeg, "image/svg+xml" - svg
   */
  @property({ defaultValue: "" }) dataFormat: string;

  /**
   * Use it to set the specific width for the signature pad.
   */
  public get width(): string {
    return this.getPropertyValue("width");
  }
  public set width(val: string) {
    this.setPropertyValue("width", val);
  }
  /**
   * Use it to set the specific height for the signature pad.
   */
  public get height(): string {
    return this.getPropertyValue("height");
  }
  public set height(val: string) {
    this.setPropertyValue("height", val);
  }
  /**
   * Use it to clear content of the signature pad.
   */
  public get allowClear(): boolean {
    return this.getPropertyValue("allowClear");
  }
  public set allowClear(val: boolean) {
    this.setPropertyValue("allowClear", val);
  }
  /**
   * Use it to set pen color for the signature pad.
   */
  public get penColor(): string {
    return this.getPropertyValue("penColor");
  }
  public set penColor(val: string) {
    this.setPropertyValue("penColor", val);
  }
  /**
   * Use it to set background color for the signature pad.
   */
  public get backgroundColor(): string {
    return this.getPropertyValue("backgroundColor");
  }
  public set backgroundColor(val: string) {
    this.setPropertyValue("backgroundColor", val);
  }
  /**
   * The clear signature button caption.
   */
  get clearButtonCaption(): string {
    return surveyLocalization.getString("clearCaption");
  }

  public needShowPlaceholder(): boolean {
    return !this.isDrawingValue && this.isEmpty();
  }

  get placeHolderText(): string {
    return surveyLocalization.getString("signaturePlaceHolder");
  }
}

Serializer.addClass(
  "signaturepad",
  [
    {
      name: "width:number",
      category: "general",
      default: 300,
    },
    {
      name: "height:number",
      category: "general",
      default: 200,
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
  function() {
    return new QuestionSignaturePadModel("");
  },
  "question"
);
QuestionFactory.Instance.registerQuestion("signaturepad", (name) => {
  return new QuestionSignaturePadModel(name);
});
