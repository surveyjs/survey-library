import { Serializer } from "./jsonobject";
import { IElement, IQuestion } from "./base";
import { PanelModel } from "./panel";
import { LocalizableString } from "./localizablestring";
import { Question } from "./question";

/**
 * The flow panel object. It is a container with flow layout where you can mix questions with mardown text.
 *
 */
export class FlowPanelModel extends PanelModel {
  static contentElementNamePrefix = "element:";
  public contentChangedCallback: () => void;
  public onGetHtmlForQuestion: (question: Question) => string;
  public onCustomHtmlProducing: () => string;
  constructor(name: string = "") {
    super(name);
    this.createLocalizableString("content", this, true);
    var self = this;
    this.registerFunctionOnPropertyValueChanged("content", function() {
      self.onContentChanged();
    });
  }
  public getType(): string {
    return "flowpanel";
  }
  getChildrenLayoutType(): string {
    return "flow";
  }
  onSurveyLoad(): any {
    super.onSurveyLoad();
    this.onContentChanged();
  }
  public get content(): string {
    return this.getLocalizableStringText("content");
  }
  public set content(val: string) {
    this.setLocalizableStringText("content", val);
  }
  public get locContent(): LocalizableString {
    return this.getLocalizableString("content");
  }
  public get html(): string {
    return this.getPropertyValue("html", "");
  }
  public set html(val: string) {
    this.setPropertyValue("html", val);
  }
  protected onContentChanged(): any {
    var html = "";
    if (!!this.onCustomHtmlProducing) {
      html = this.onCustomHtmlProducing();
    } else {
      html = this.produceHtml();
    }
    this.html = html;
    if (!!this.contentChangedCallback) this.contentChangedCallback();
  }
  public produceHtml(): string {
    var html = [];
    //contentElementNamePrefix
    var regEx = /{(.*?(element:)[^$].*?)}/g;
    var str = this.content;
    var startIndex = 0;
    var res = null;
    while ((res = regEx.exec(str)) !== null) {
      if (res.index > startIndex) {
        html.push(str.substr(startIndex, res.index - startIndex));
        startIndex = res.index;
      }
      var question = this.getQuestionFromText(res[0]);
      if (!!question) {
        html.push(this.getHtmlForQuestion(question));
      } else {
        html.push(
          str.substr(startIndex, res.index + res[0].length - startIndex)
        );
      }
      startIndex = res.index + res[0].length;
    }
    if (startIndex < str.length) {
      html.push(str.substr(startIndex, str.length - startIndex));
    }
    return html.join("").replace(new RegExp("<br>", "g"), "<br/>");
  }
  public getQuestionFromText(str: string): Question {
    str = str.substr(1, str.length - 2);
    str = str.replace(FlowPanelModel.contentElementNamePrefix, "").trim();
    return this.getQuestionByName(str);
  }
  protected getHtmlForQuestion(question: Question): string {
    if (!!this.onGetHtmlForQuestion) return this.onGetHtmlForQuestion(question);
    return "";
  }
  protected getQuestionHtmlId(question: Question): string {
    return this.name + "_" + question.id;
  }
  protected onAddElement(element: IElement, index: number) {
    super.onAddElement(element, index);
    this.addElementToContent(element);
    element.renderWidth = "";
  }
  protected onRemoveElement(element: IElement) {
    var searchStr = this.getElementContentText(element);
    this.content = this.content.replace(searchStr, "");
    super.onRemoveElement(element);
  }
  dragDropMoveElement(src: IElement, target: IElement, targetIndex: number) {}
  private addElementToContent(element: IElement) {
    if (this.isLoadingFromJson) return;
    var text = this.getElementContentText(element);
    if (!this.insertTextAtCursor(text)) {
      this.content = this.content + text;
    }
  }
  private insertTextAtCursor(text: string, prevName: string = null): boolean {
    if (!this.isDesignMode || (!window && !window.getSelection)) return false;
    let sel = window.getSelection();
    if (sel.getRangeAt && sel.rangeCount) {
      let range = sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(text));
      var self = <any>this;
      if (self.getContent) {
        var str = self.getContent(prevName);
        this.content = str;
      }
      return true;
    }
    return false;
  }
  public getElementContentText(element: IElement) {
    return "{" + FlowPanelModel.contentElementNamePrefix + element.name + "}";
  }
}

Serializer.addClass(
  "flowpanel",
  [{ name: "content:html", serializationProperty: "locContent" }],
  function() {
    return new FlowPanelModel();
  },
  "panel"
);
