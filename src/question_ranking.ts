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
  domNode: HTMLElement = null;
  sortableInst: any = null;

  constructor(name: string) {
    super(name);
  }

  public get rankingChoices() {
    return this.syncChoices();
  }

  public get isIndeterminate() {
    return !this.value || this.value.length === 0;
  }

  public getType(): string {
    return "ranking";
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

  public syncChoices() {
    const value = this.value;
    const unrankedChoices = this.visibleChoices;
    let rankedChoices: Array<ItemValue> = [];

    if (!value || value.length === 0) {
      return this.visibleChoices;
    }
    rankedChoices.length = unrankedChoices.length;

    for (var i = 0; i < unrankedChoices.length; i++) {
      const choice = unrankedChoices[i];
      const index = value.indexOf(choice.text);

      if (index !== -1) {
        rankedChoices.splice(index, 1, choice);
      } else {
        rankedChoices.splice(rankedChoices.length - 1, 0, choice);
      }
    }

    rankedChoices = rankedChoices.filter((choice) => !!choice);

    this.value = rankedChoices.map((choice) => choice.text);
    return rankedChoices;
  }

  public initSortable(domNode: HTMLElement) {
    if (!domNode) return;
    const self = this;
    self.domNode = domNode;

    self.sortableInst = new Sortable(domNode, {
      animation: 100,
      forceFallback: true,
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
        self.setGhostText(evt.newIndex + 1);
      },
    });
  }

  get rootClass() {
    const css = this.cssClasses;
    if (IsMobile) return css.root + " " + css.rootMobileMod;
    return css.root;
  }

  handleKeydown = (event: any) => {
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

  handleArrowUp = (index: number) => {
    const array = this.sortableInst.toArray();
    this.moveArrayItemBack(array, index);
    this.sortableInst.sort(array);
    this.setValue();
    this.focusItem(index - 1);
  };

  handleArrowDown = (index: number) => {
    const array = this.sortableInst.toArray();
    this.moveArrayItemForward(array, index);
    this.sortableInst.sort(array);
    this.setValue();
    this.focusItem(index + 1);
  };

  moveArrayItemBack = (array: string[], index: number) => {
    const temp = array[index];
    array[index] = array[index - 1];
    array[index - 1] = temp;
  };

  moveArrayItemForward = (array: string[], index: number) => {
    const temp = array[index];
    array[index] = array[index + 1];
    array[index + 1] = temp;
  };

  focusItem = (index: number) => {
    const itemsNodes: any = this.domNode.querySelectorAll(
      "." + this.cssClasses.item
    );
    itemsNodes[index].focus();
  };

  setValue = () => {
    let value: string[] = [];
    const textNodes = this.domNode.querySelectorAll(
      "." + this.cssClasses.itemText
    );
    textNodes.forEach((textNode: any, index) => {
      value.push(textNode.innerText);
    });
    this.value = value;
  };

  setGhostText = (text: string) => {
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
