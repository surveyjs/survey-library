import { ISurvey, ISurveyImpl } from "./base-interfaces";
import { DragDropRankingChoices } from "./dragdrop/ranking-choices";
import { ItemValue } from "./itemvalue";
import { property, Serializer } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import { QuestionCheckboxModel } from "./question_checkbox";
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { IsMobile } from "./utils/devices";
import { Helpers } from "./helpers";
import { QuestionSelectBase } from "./question_baseselect";

/**
 * A Model for a ranking question
 */
export class QuestionRankingModel extends QuestionCheckboxModel {
  private domNode: HTMLElement = null;

  constructor(name: string) {
    super(name);
    this.createNewArray("rankingChoices");
  }

  protected getDefaultItemComponent(): string {
    return "";
  }

  public getType(): string {
    return "ranking";
  }

  public get rootClass(): string {
    return new CssClassBuilder()
      .append(this.cssClasses.root)
      .append(this.cssClasses.rootMobileMod, IsMobile)
      .append(this.cssClasses.rootDisabled, this.isReadOnly)
      .append(this.cssClasses.rootDesignMode, !!this.isDesignMode)
      .append(this.cssClasses.itemOnError, this.errors.length > 0)
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

  private updateRankingChoices(forceUpdate = false): ItemValue[] {
    const newRankingChoices: ItemValue[] = [];

    // ranking question with only one choice doesn't make sense
    if (this.visibleChoices.length === 1) {
      this.setPropertyValue("rankingChoices", newRankingChoices);
      return;
    }

    if (forceUpdate) this.setPropertyValue("rankingChoices", []);

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
    this.dragDropRankingChoices = new DragDropRankingChoices(this.survey, null, this.longTap);
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
    super.afterRenderQuestionElement(el);
  }
  //cross framework destroy
  public beforeDestroyQuestionElement(el: HTMLElement): void {
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

  protected getChoicesFromQuestion(question: QuestionSelectBase): Array<ItemValue> {
    const res = super.getChoicesFromQuestion(question);
    if(this.choicesFromQuestionMode === "selected" && question.isOtherSelected && !!question.comment) {
      res.push(new ItemValue(question.otherItem.value, question.comment));
    }
    return res;
  }

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

  /**
   * For mobile devices. Set this property to false, to disable the "long tap" before drag start. Default is true.
  */
  public get longTap(): boolean {
    return this.getPropertyValue("longTap");
  }
  public set longTap(val: boolean) {
    this.setPropertyValue("longTap", val);
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
      name: "longTap",
      default: true,
      visible: false,
      isSerializable: false,
    },
    { name: "itemComponent", visible: false, default: "" }
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
