import SortableLib from "sortablejs";
import { ISurvey, ISurveyImpl } from "./base-interfaces";
import { DragDropRankingChoices } from "./dragdrop/ranking-choices";
import { ItemValue } from "./itemvalue";
import { property, Serializer } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import { QuestionCheckboxModel } from "./question_checkbox";
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { IsMobile } from "./utils/is-mobile";
import { Helpers } from "./helpers";

const Sortable = <any>SortableLib;

/**
 * A Model for a ranking question
 */
export class QuestionRankingModel extends QuestionCheckboxModel {
  private domNode: HTMLElement = null;
  private sortableInst: any = null;

  constructor(name: string) {
    super(name);
    this.createNewArray("rankingChoices");
  }

  public getType(): string {
    return "ranking";
  }

  public get rootClass(): string {
    return new CssClassBuilder()
      .append(this.cssClasses.root)
      .append(this.cssClasses.rootMobileMod, IsMobile)
      .append(this.cssClasses.rootDisabled, !this.allowStartDrag)
      .toString();
  }

  protected getItemClassCore(item: ItemValue, options: any): string {
    const itemIndex = this.rankingChoices.indexOf(item);
    const dropTargetIndex = this.rankingChoices.indexOf(this.currentDropTarget);

    return new CssClassBuilder()
      .append(super.getItemClassCore(item, options))
      .append(this.cssClasses.itemGhostMod, this.currentDropTarget === item)
      .append(
        "sv-dragdrop-movedown",
        itemIndex === dropTargetIndex + 1 && this.dropTargetNodeMove === "down"
      )
      .append(
        "sv-dragdrop-moveup",
        itemIndex === dropTargetIndex - 1 && this.dropTargetNodeMove === "up"
      )
      .toString();
  }

  protected isItemCurrentDropTarget(item: ItemValue): boolean {
    if (this.fallbackToSortableJS) return false;
    return this.dragDropRankingChoices.dropTarget === item;
  }

  public get ghostPositionCssClass(): string {
    if (this.ghostPosition === "top")
      return this.cssClasses.dragDropGhostPositionTop;
    if (this.ghostPosition === "bottom")
      return this.cssClasses.dragDropGhostPositionBottom;
    return "";
  }

  public getNumberByIndex(index: number): string {
    return this.isEmpty() ? "\u2013" : index + 1 + "";
  }

  public setSurveyImpl(value: ISurveyImpl, isLight?: boolean) {
    super.setSurveyImpl(value, isLight);
    this.updateRankingChoices();
  }
  public isAnswerCorrect(): boolean {
    return Helpers.isArraysEqual(this.value, this.correctAnswer, false);
  }
  onSurveyValueChanged(newValue: any) {
    super.onSurveyValueChanged(newValue);
    if (this.isLoadingFromJson) return;
    this.updateRankingChoices();
  }

  protected onVisibleChoicesChanged = (): void => {
    super.onVisibleChoicesChanged();

    // ranking question with only one choice doesn't make sense
    if (this.visibleChoices.length === 1) {
      this.value = [];
      this.updateRankingChoices();
      return;
    }

    if (this.isEmpty()) {
      this.updateRankingChoices();
      return;
    }

    if (this.visibleChoices.length > this.value.length)
      this.addToValueByVisibleChoices();
    if (this.visibleChoices.length < this.value.length)
      this.removeFromValueByVisibleChoices();
    this.updateRankingChoices();
  };

  public localeChanged = (): void => {
    super.localeChanged();
    this.updateRankingChoices();
  };

  private addToValueByVisibleChoices() {
    const newValue = this.value.slice();

    this.visibleChoices.forEach((choice) => {
      if (newValue.indexOf(choice.value) === -1) {
        newValue.push(choice.value);
      }
    });
    this.value = newValue;
  }

  private removeFromValueByVisibleChoices() {
    const newValue = this.value.slice();

    this.value.forEach((valueItem: string, index: number) => {
      let isValueItemToRemove = true;
      this.visibleChoices.forEach((choice) => {
        if (choice.value === valueItem) isValueItemToRemove = false;
      });
      isValueItemToRemove && newValue.splice(index, 1);
    });

    this.value = newValue;
  }

  public get rankingChoices(): Array<ItemValue> {
    return this.getPropertyValue("rankingChoices", []);
  }

  private updateRankingChoices(): ItemValue[] {
    const newRankingChoices: ItemValue[] = [];

    // ranking question with only one choice doesn't make sense
    if (this.visibleChoices.length === 1) {
      this.setPropertyValue("rankingChoices", newRankingChoices);
      return;
    }

    if (this.isEmpty()) {
      this.setPropertyValue("rankingChoices", this.visibleChoices);
      return;
    }

    this.value.forEach((valueItem: string) => {
      this.visibleChoices.forEach((choice) => {
        if (choice.value === valueItem) newRankingChoices.push(choice);
      });
    });
    this.setPropertyValue("rankingChoices", newRankingChoices);
  }

  public dragDropRankingChoices: DragDropRankingChoices;
  @property({ defaultValue: null }) currentDropTarget: ItemValue;
  @property({ defaultValue: null }) dropTargetNodeMove: string;

  endLoadingFromJson(): void {
    super.endLoadingFromJson();
    if (!this.fallbackToSortableJS) {
      this.dragDropRankingChoices = new DragDropRankingChoices(this.survey);
    }
  }

  public handlePointerDown = (
    event: PointerEvent,
    choice: ItemValue,
    node: HTMLElement
  ): void => {
    if (this.allowStartDrag) {
      this.dragDropRankingChoices.startDrag(event, choice, this, node);
    }
  };

  private get allowStartDrag() {
    return !this.isReadOnly && !this.isDesignMode;
  }

  //cross framework initialization
  public afterRenderQuestionElement(el: HTMLElement): void {
    this.domNode = el;
    if (!!el && this.fallbackToSortableJS) {
      this.initSortable(el);
    }
    super.afterRenderQuestionElement(el);
  }
  //cross framework destroy
  public beforeDestroyQuestionElement(el: HTMLElement): void {
    if (this.sortableInst) this.sortableInst.destroy();
    super.beforeDestroyQuestionElement(el);
  }

  public handleKeydown = (event: KeyboardEvent, choice: ItemValue): void => {
    const key: any = event.key;
    const index = this.rankingChoices.indexOf(choice);

    if (key === "ArrowUp" && index) {
      this.handleArrowUp(index, choice);
    }
    if (key === "ArrowDown" && index !== this.rankingChoices.length - 1) {
      this.handleArrowDown(index, choice);
    }
  };

  protected supportSelectAll(): boolean {
    return false;
  }
  public supportOther(): boolean {
    return false;
  }
  public supportNone(): boolean {
    return false;
  }

  private initSortable(domNode: HTMLElement) {
    if (!domNode) return;
    const self: QuestionRankingModel = this;
    if (!this.allowStartDrag) return;

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
        if (self.isEmpty()) {
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
        if (!self.isEmpty()) self.syncNumbers();
        self.setGhostText(evt.newIndex + 1);
      },
    });
  }

  public get fallbackToSortableJS(): boolean {
    return this.getPropertyValue("fallbackToSortableJS");
  }
  public set fallbackToSortableJS(val: boolean) {
    this.setPropertyValue("fallbackToSortableJS", val);
  }

  private handleArrowUp = (index: number, choice: ItemValue) => {
    const choices = this.rankingChoices;
    choices.splice(index, 1);
    choices.splice(index - 1, 0, choice);
    this.setValue();
    setTimeout(() => {
      this.focusItem(index - 1);
    }, 1);
  };

  private handleArrowDown = (index: number, choice: ItemValue) => {
    const choices = this.rankingChoices;
    choices.splice(index, 1);
    choices.splice(index + 1, 0, choice);
    this.setValue();
    setTimeout(() => {
      this.focusItem(index + 1);
    }, 1);
  };

  private focusItem = (index: number) => {
    const itemsNodes: any = this.domNode.querySelectorAll(
      "." + this.cssClasses.item
    );
    itemsNodes[index].focus();
  };

  public setValue = (): void => {
    const value: string[] = [];
    this.rankingChoices.forEach((choice: ItemValue) => {
      value.push(choice.value);
    });
    this.value = value;
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
    {
      name: "fallbackToSortableJS",
      default: false,
      visible: false,
      isSerializable: false,
    },
  ],
  function () {
    return new QuestionRankingModel("");
  },
  "checkbox"
);

QuestionFactory.Instance.registerQuestion("ranking", (name) => {
  const q: QuestionRankingModel = new QuestionRankingModel(name);
  q.choices = QuestionFactory.DefaultChoices;
  return q;
});
