import SortableLib from "sortablejs";
import { ItemValue } from "./itemvalue";
import { Serializer } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import { QuestionCheckboxModel } from "./question_checkbox";
import { CssClassBuilder } from "./utils/cssClassBuilder";
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
    return new CssClassBuilder()
      .append(this.cssClasses.root)
      .append(this.cssClasses.rootMobileMod, IsMobile)
      .toString();
  }

  public getNumberByIndex(index: number) {
    return this.isIndeterminate ? "\u2013" : index + 1 + "";
  }

  public get rankingChoices() {
    let result: ItemValue[] = [];
    const value: any = this.value;
    const visibleChoices: ItemValue[] = this.removeOtherChoiceFromChoices(
      this.visibleChoices
    );

    if (this.isIndeterminate) {
      result = visibleChoices;
    } else {
      result = this.mergeValueAndVisibleChoices(value, visibleChoices);
    }

    // ranking question with only one choice doesn't make sense
    if (result.length === 1) result = [];

    return result;
  }

  private removeOtherChoiceFromChoices(choices: ItemValue[]) {
    const result = choices;
    choices.forEach((choice: ItemValue, index: number) => {
      if (choice.value === "other") {
        result.splice(index, 1); // remove other choice
      }
    });
    return result;
  }

  //cross framework initialization
  public afterRenderQuestionElement(el: HTMLElement) {
    if (!!el) {
      this.initSortable(el);
    }
    super.afterRenderQuestionElement(el);
  }
  //cross framework destroy
  public beforeDestroyQuestionElement(el: HTMLElement) {
    if (this.sortableInst) this.sortableInst.destroy();
    super.beforeDestroyQuestionElement(el);
  }

  public handleKeydown = (event: any) => {
    const key: any = event.key;
    const array: NodeListOf<Element> = this.domNode.querySelectorAll(
      "." + this.cssClasses.item
    );
    const index: number = [].indexOf.call(array, event.target);

    if (key === "ArrowUp" && index) {
      this.handleArrowUp(index);
    }
    if (key === "ArrowDown" && index !== array.length - 1) {
      this.handleArrowDown(index);
    }
  };

  protected supportSelectAll() {
    return false;
  }
  public supportOther() {
    return false;
  }
  public supportNone() {
    return false;
  }

  // to make "carry forward" feature work properly with ranking
  protected onVisibleChoicesChanged() {
    super.onVisibleChoicesChanged();

    if (this.isIndeterminate) return;
    this.value = this.rankingChoices.map(choice => choice.value);
  }

  private mergeValueAndVisibleChoices(
    value: any,
    visibleChoices: Array<ItemValue>
  ) {
    const length: number = visibleChoices.length;
    let result: Array<ItemValue> = [];
    result.length = length;
    for (let i = 0; i < length; i++) {
      const choice = visibleChoices[i];
      const index = value.indexOf(choice.value);

      if (index !== -1) {
        result.splice(index, 1, choice);
      } else {
        result.splice(result.length - 1, 0, choice);
      }
    }
    result = result.filter(choice => !!choice);
    return result;
  }

  private initSortable(domNode: HTMLElement) {
    if (!domNode) return;
    const self: QuestionRankingModel = this;
    self.domNode = domNode;
    if (this.isReadOnly) return;
    if (this.isDesignMode) return;

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
        self.setValueFromUI();
      },
      onChange(evt: any) {
        if (!self.isIndeterminate) self.syncNumbers();
        self.setGhostText(evt.newIndex + 1);
      },
    });
  }

  private handleArrowUp = (index: number) => {
    const array: string[] = this.sortableInst.toArray();
    this.moveArrayItemBack(array, index);
    this.sortableInst.sort(array);
    this.syncNumbers();
    this.setValueFromUI();
    this.focusItem(index - 1);
  };

  private handleArrowDown = (index: number) => {
    const array: string[] = this.sortableInst.toArray();
    this.moveArrayItemForward(array, index);
    this.sortableInst.sort(array);
    this.syncNumbers();
    this.setValueFromUI();
    this.focusItem(index + 1);
  };

  private moveArrayItemBack = (array: string[], index: number) => {
    [array[index], array[index - 1]] = [array[index - 1], array[index]];
  };

  private moveArrayItemForward = (array: string[], index: number) => {
    [array[index], array[index + 1]] = [array[index + 1], array[index]];
  };

  private focusItem = (index: number) => {
    const itemsNodes: any = this.domNode.querySelectorAll(
      "." + this.cssClasses.item
    );
    itemsNodes[index].focus();
  };

  private setValueFromUI = () => {
    const value: string[] = [];
    const textNodes = this.domNode.querySelectorAll(
      "." + this.cssClasses.controlLabel
    );
    textNodes.forEach((textNode: any, index) => {
      const innerText: string = textNode.innerText;
      this.visibleChoices.forEach((visibleChoice: ItemValue) => {
        if (innerText === visibleChoice.text) {
          value.push(visibleChoice.value);
        }
      });
    });
    this.value = value;
  };

  private syncNumbers = () => {
    if (!this.domNode) return;
    const selector: string =
      "." +
      this.cssClasses.item +
      ":not(." +
      this.cssClasses.itemDragMod +
      ")" +
      " ." +
      this.cssClasses.itemIndex;

    const indexNodes: NodeListOf<Element> = this.domNode.querySelectorAll(
      selector
    );
    indexNodes.forEach((indexNode: any, index) => {
      indexNode.innerText = this.getNumberByIndex(index);
    });
  };

  private setGhostText = (text: string) => {
    const indexNodes: NodeListOf<Element> = this.domNode.querySelectorAll(
      "." + this.cssClasses.itemIndex
    );
    const ghostNode: Element = indexNodes[indexNodes.length - 1];
    (<any>ghostNode).innerText = text;
  };

  public getIconHoverCss(): string {
    return new CssClassBuilder()
      .append(this.cssClasses.itemIcon)
      .append(this.cssClasses.itemIconHoverMod)
      .toString();
  }

  public getIconFocusCss(): string {
    return new CssClassBuilder()
      .append(this.cssClasses.itemIcon)
      .append(this.cssClasses.itemIconFocusMod)
      .toString();
  }
}

Serializer.addClass(
  "ranking",
  [
    { name: "hasOther", visible: false, isSerializable: false },
    { name: "otherText", visible: false, isSerializable: false },
    { name: "otherErrorText", visible: false, isSerializable: false },
    { name: "storeOthersAsComment", visible: false, isSerializable: false },
    { name: "hasNone", visible: false, isSerializable: false },
    { name: "noneText", visible: false, isSerializable: false },
    { name: "hasSelectAll", visible: false, isSerializable: false },
    { name: "selectAllText", visible: false, isSerializable: false },
    { name: "colCount:number", visible: false, isSerializable: false },
    { name: "maxSelectedChoices", visible: false, isSerializable: false },
  ],
  function() {
    return new QuestionRankingModel("");
  },
  "checkbox"
);

QuestionFactory.Instance.registerQuestion("ranking", name => {
  const q: QuestionRankingModel = new QuestionRankingModel(name);
  q.choices = QuestionFactory.DefaultChoices;
  return q;
});
