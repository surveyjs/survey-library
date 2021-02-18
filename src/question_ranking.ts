import { throws } from "assert";
import SortableLib from "sortablejs";
import { ItemValue } from "./itemvalue";
import { Serializer } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import { QuestionSelectBase } from "./question_baseselect";
import { QuestionCheckboxModel } from "./question_checkbox";
import { IsMobile } from "./utils/is-mobile";

const Sortable = <any>SortableLib;

/**
 * A Model for a ranking question
 */
export class QuestionRankingModel extends QuestionCheckboxModel {
  private domNode: HTMLElement = null;
  private sortableInst: any = null;

  constructor(name: string) {
    super(name);
  }

  public getType(): string {
    return "ranking";
  }

  public get isIndeterminate() {
    return !this.value || this.value.length === 0;
  }

  public get rootClass() {
    const css = this.cssClasses;
    if (IsMobile) return css.root + " " + css.rootMobileMod;
    return css.root;
  }

  public getNumberByIndex(index: number) {
    return this.isIndeterminate ? "\u2013" : index + 1 + "";
  }

  public get rankingChoices() {
    const value = this.value;
    const visibleChoices = this.visibleChoices;

    if (this.isIndeterminate) {
      return visibleChoices;
    }

    return this.mergeValueAndVisibleChoices(value, visibleChoices);
  }

  //cross framework initialization
  public afterRenderQuestionElement(el: any) {
    if (!!el) {
      this.initSortable(el);
    }
    super.afterRenderQuestionElement(el);
  }
  //cross framework destroy
  public beforeDestroyQuestionElement(el: any) {
    if (this.sortableInst) this.sortableInst.destroy();
    super.beforeDestroyQuestionElement(el);
  }

  public handleKeydown = (event: any) => {
    const key = event.key;
    const array = this.domNode.querySelectorAll("." + this.cssClasses.item);
    const index = [].indexOf.call(array, event.target);

    if (key === "ArrowUp" && index) {
      this.handleArrowUp(index);
    }
    if (key === "ArrowDown" && index !== array.length - 1) {
      this.handleArrowDown(index);
    }
  };

  // to make "carry forward" feature work properly with ranking
  protected onVisibleChoicesChanged() {
    super.onVisibleChoicesChanged();

    const otherQuestionActiveChoices = (<any>this).otherQuestionActiveChoices;

    if (this.isIndeterminate || !otherQuestionActiveChoices) return;

    if (otherQuestionActiveChoices.length === 0) {
      this.value = [];
    } else {
      this.value = this.rankingChoices.map((choice) => choice.text);
    }
  }

  private mergeValueAndVisibleChoices(value: any, visibleChoices: Array<ItemValue>) {
    const length = visibleChoices.length;
    let result: Array<ItemValue> = [];

    result.length = length;

    for (var i = 0; i < length; i++) {
      const choice = visibleChoices[i];
      const index = value.indexOf(choice.text);

      if (index !== -1) {
        result.splice(index, 1, choice);
      } else {
        result.splice(result.length - 1, 0, choice);
      }
    }

    result = result.filter((choice) => !!choice);

    return result;
  }

  private initSortable(domNode: HTMLElement) {
    if (!domNode) return;
    const self = this;
    self.domNode = domNode;

    self.sortableInst = new Sortable(domNode, {
      animation: 100,
      forceFallback: true,
      delay: 200,
      delayOnTouchOnly: true,
      handle: IsMobile
        ? "." + self.cssClasses.itemIconContainer
        : "." + self.cssClasses.itemContent,
      ghostClass: self.cssClasses.itemGhostMod,
      dragClass: self.cssClasses.itemDragMod,
      onStart(evt: any) {
        (<any>Sortable.ghost.style.opacity) = 1;
        domNode.className += " " + self.cssClasses.rootDragMod;
        if (self.isIndeterminate) {
          self.setGhostText(evt.oldIndex + 1);
        }
      },
      onEnd() {
        domNode.className = domNode.className.replace(
          " " + self.cssClasses.rootDragMod,
          ""
        );
        self.setValue();
      },
      onChange(evt: any) {
        if (!self.isIndeterminate) self.syncNumbers();
        self.setGhostText(evt.newIndex + 1);
      },
    });
  }

  private handleArrowUp = (index: number) => {
    const array = this.sortableInst.toArray();
    this.moveArrayItemBack(array, index);
    this.sortableInst.sort(array);
    this.syncNumbers();
    this.setValue();
    this.focusItem(index - 1);
  };

  private handleArrowDown = (index: number) => {
    const array = this.sortableInst.toArray();
    this.moveArrayItemForward(array, index);
    this.sortableInst.sort(array);
    this.syncNumbers();
    this.setValue();
    this.focusItem(index + 1);
  };

  private moveArrayItemBack = (array: string[], index: number) => {
    const temp = array[index];
    array[index] = array[index - 1];
    array[index - 1] = temp;
  };

  private moveArrayItemForward = (array: string[], index: number) => {
    const temp = array[index];
    array[index] = array[index + 1];
    array[index + 1] = temp;
  };

  private focusItem = (index: number) => {
    const itemsNodes: any = this.domNode.querySelectorAll(
      "." + this.cssClasses.item
    );
    itemsNodes[index].focus();
  };

  private setValue = () => {
    let value: string[] = [];
    const textNodes = this.domNode.querySelectorAll(
      "." + this.cssClasses.itemText
    );
    textNodes.forEach((textNode: any, index) => {
      value.push(textNode.innerText);
    });
    this.value = value;
  };

  private syncNumbers = () => {
    if (!this.domNode) return;
    const indexNodes = this.domNode.querySelectorAll(
      "." + this.cssClasses.itemIndex
    );
    indexNodes.forEach((indexNode: any, index) => {
      indexNode.innerText = this.getNumberByIndex(index);
    });
  };

  private setGhostText = (text: string) => {
    const indexNodes = this.domNode.querySelectorAll(
      "." + this.cssClasses.itemIndex
    );
    const ghostNode = indexNodes[indexNodes.length - 1];
    (<any>ghostNode).innerText = text;
  };
}

Serializer.addClass(
  "ranking",
  [
    { name: "hasNone", visible: false },
    { name: "noneText", visible: false },
    { name: "hasSelectAll", visible: false },
    { name: "selectAllText", visible: false },
    { name: "colCount:number", visible: false },
  ],
  function () {
    return new QuestionRankingModel("");
  },
  "checkbox"
);
QuestionFactory.Instance.registerQuestion("ranking", (name) => {
  var q = new QuestionRankingModel(name);
  q.choices = QuestionFactory.DefaultChoices;
  return q;
});
