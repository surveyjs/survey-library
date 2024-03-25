import { DomDocumentHelper } from "./global_variables_utils";

export class ElementHelper {
  static focusElement(element: Element) {
    element && (<HTMLElement>element).focus();
  }
  static visibility(node: Element): boolean {
    var style = DomDocumentHelper.getComputedStyle(node);
    if (style.display === "none" || style.visibility === "hidden") return false;
    return node.parentElement ? this.visibility(node.parentElement) : true;
  }
  static getNextElementPreorder(element: Element): Element {
    const result = !!element.nextElementSibling ? element.nextElementSibling : element.parentElement.firstElementChild;
    if(this.visibility(result)) {
      return result;
    } else {
      return this.getNextElementPreorder(result);
    }
  }
  static getNextElementPostorder(element: Element): Element {
    const result = !!element.previousElementSibling ? element.previousElementSibling : element.parentElement.lastElementChild;
    if(this.visibility(result)) {
      return result;
    } else {
      return this.getNextElementPostorder(result);
    }
  }
  static hasHorizontalScroller(element: HTMLElement): boolean {
    if (!!element) {
      return element.scrollWidth > element.offsetWidth;
    }
    return false;
  }
  static hasVerticalScroller(element: HTMLElement): boolean {
    if (!!element) {
      return element.scrollHeight > element.offsetHeight;
    }
    return false;
  }
}