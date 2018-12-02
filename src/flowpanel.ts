import { IElement } from "./base";
import { PanelModelBase } from "./panel";

/**
 * The flow panel object. It is a container with flow layout where you can mix questions with mardown text.
 *
 */
export class FlowPanelModel extends PanelModelBase {
  static contentElementName = "element";
  constructor(name: string) {
    super(name);
  }
  public get content(): string {
    return this.getPropertyValue("content", "");
  }
  public set content(val: string) {
    this.setPropertyValue("content", val);
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
    return "{" + FlowPanelModel.contentElementName + ":" + element.name + "}";
  }
}
