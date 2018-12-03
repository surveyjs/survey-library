import { JsonObject } from "./jsonobject";
import { IElement } from "./base";
import { PanelModel } from "./panel";
import { LocalizableString } from "./localizablestring";
import { Question } from "./question";

export class FlowPanelItem {
  public locText: LocalizableString;
  public question: Question;
}

/**
 * The flow panel object. It is a container with flow layout where you can mix questions with mardown text.
 *
 */
export class FlowPanelModel extends PanelModel {
  static contentElementNamePrefix = "element:";
  constructor(name: string = "") {
    super(name);
    this.createNewArray("items");
    this.createLocalizableString("content", this, true);
    var self = this;
    this.registerFunctionOnPropertyValueChanged("content", function() {
      self.onContentChanged();
    });
  }
  public getType(): string {
    return "flowpanel";
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
  public get items(): Array<FlowPanelItem> {
    return this.getPropertyValue("items", []);
  }
  public set items(val: Array<FlowPanelItem>) {
    if (!val) val = [];
    this.setPropertyValue("items", val);
  }
  protected onContentChanged(): any {
    var items = new Array<FlowPanelItem>();
    //contentElementNamePrefix
    var regEx = /{(.*?(element:)[^$].*?)}/g;
    var str = this.content;
    var startIndex = 0;
    var res = null;
    while ((res = regEx.exec(str)) !== null) {
      if (res.index > startIndex) {
        items.push(this.createTextItem(str, startIndex, res.index));
        startIndex = res.index;
      }
      var question = this.getQuestionFromText(res[0]);
      if (!!question) {
        items.push(this.createQuestionItem(question));
      } else {
        items.push(
          this.createTextItem(str, startIndex, res.index + res[0].length)
        );
      }
      startIndex = res.index + res[0].length;
    }
    if (startIndex < str.length) {
      items.push(this.createTextItem(str, startIndex, str.length));
    }
    this.items = items;
  }
  private getQuestionFromText(str: string): Question {
    str = str.substr(1, str.length - 2);
    str = str.replace(FlowPanelModel.contentElementNamePrefix, "").trim();
    return this.getQuestionByName(str);
  }
  protected createTextItem(
    str: string,
    startPos: number,
    endPos: number
  ): FlowPanelItem {
    var res = new FlowPanelItem();
    res.locText = new LocalizableString(this, true);
    res.locText.text = str.substr(startPos, endPos - startPos);
    return res;
  }
  protected createQuestionItem(question: Question): FlowPanelItem {
    var res = new FlowPanelItem();
    res.question = question;
    return res;
  }
  protected onAddElement(element: IElement, index: number) {
    super.onAddElement(element, index);
    this.addElementToContent(element);
  }
  protected onRemoveElement(element: IElement) {
    var searchStr = this.getElementContentText(element);
    this.content = this.content.replace(searchStr, "");
    super.onRemoveElement(element);
  }
  private addElementToContent(element: IElement) {
    if (this.isLoadingFromJson) return;
    this.content = this.content + this.getElementContentText(element);
  }
  private getElementContentText(element: IElement) {
    return "{" + FlowPanelModel.contentElementNamePrefix + element.name + "}";
  }
}

JsonObject.metaData.addClass(
  "flowpanel",
  [{ name: "content:text", serializationProperty: "locContent" }],
  function() {
    return new FlowPanelModel();
  },
  "panel"
);
