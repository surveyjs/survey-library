import { ISurveyImpl } from "./base-interfaces";
import { DragDropRankingChoices } from "./dragdrop/ranking-choices";
import { DragDropRankingSelectToRank } from "./dragdrop/ranking-select-to-rank";
import { ItemValue } from "./itemvalue";
import { property, Serializer } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import { QuestionCheckboxModel } from "./question_checkbox";
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { IsMobile } from "./utils/devices";
import { Helpers } from "./helpers";
import { settings } from "../src/settings";

/**
 * A class that describes the Ranking question type.
 *
 * [View Demo](https://surveyjs.io/form-library/examples/questiontype-ranking/ (linkStyle))
 */
export class QuestionRankingModel extends QuestionCheckboxModel {
  private domNode: HTMLElement = null;

  constructor(name: string) {
    super(name);
    this.createNewArray("rankingChoices");
    this.registerFunctionOnPropertyValueChanged("selectToRankEnabled", () => {
      this.clearValue();
      this.setDragDropRankingChoices();
      this.updateRankingChoices();
    });
  }

  protected getDefaultItemComponent(): string {
    return "";
  }

  public getType(): string {
    return "ranking";
  }

  public getItemTabIndex(item: ItemValue) {
    return this.isDesignMode ? undefined : 0;
  }

  public get rootClass(): string {
    return new CssClassBuilder()
      .append(this.cssClasses.root)
      .append(this.cssClasses.rootMobileMod, IsMobile)
      .append(this.cssClasses.rootDisabled, this.isReadOnly)
      .append(this.cssClasses.rootDesignMode, !!this.isDesignMode)
      .append(this.cssClasses.itemOnError, this.errors.length > 0)
      .append(this.cssClasses.rootDragHandleAreaIcon, settings.rankingDragHandleArea === "icon")
      .append(this.cssClasses.rootSelectToRankMod, this.selectToRankEnabled)
      .append(this.cssClasses.rootSelectToRankAlignHorizontal, this.selectToRankEnabled && this.selectToRankAreasLayout === "horizontal")
      .append(this.cssClasses.rootSelectToRankAlignVertical, this.selectToRankEnabled && this.selectToRankAreasLayout === "vertical")
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

  public getContainerClasses(containerType?: string) {
    let isEmpty = false;
    const isToContainer = containerType === "to";
    const isFromContainer = containerType === "from";

    if (isToContainer) {
      isEmpty = this.rankingChoices.length === 0;
    } else if (isFromContainer) {
      isEmpty = this.unRankingChoices.length === 0;
    }

    return new CssClassBuilder()
      .append(this.cssClasses.container)
      .append(this.cssClasses.containerToMode, isToContainer)
      .append(this.cssClasses.containerFromMode, isFromContainer)
      .append(this.cssClasses.containerEmptyMode, isEmpty)
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

  public getItemIndexClasses(item: ItemValue) {
    let noNumber;

    if (this.selectToRankEnabled) {
      noNumber = this.unRankingChoices.indexOf(item) !== -1;
    } else {
      noNumber = this.isEmpty();
    }

    return new CssClassBuilder()
      .append(this.cssClasses.itemIndex)
      .append(this.cssClasses.itemIndexEmptyMode, noNumber)
      .toString();
  }

  public getNumberByIndex(index: number): string {
    return this.isEmpty() ? "" : index + 1 + "";
  }

  public setSurveyImpl(value: ISurveyImpl, isLight?: boolean) {
    super.setSurveyImpl(value, isLight);
    this.setDragDropRankingChoices();
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

    if (this.selectToRankEnabled) {
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
    const choices = this.visibleChoices;
    for(let i = this.value.length - 1; i >= 0; i --) {
      if(!ItemValue.getItemByValue(choices, this.value[i])) {
        newValue.splice(i, 1);
      }
    }
    this.value = newValue;
  }

  public get rankingChoices(): Array<ItemValue> {
    return this.getPropertyValue("rankingChoices", []);
  }

  public get unRankingChoices(): Array<ItemValue> {
    const unRankingChoices: ItemValue[] = [];
    const rankingChoices = this.rankingChoices;

    this.visibleChoices.forEach((choice) => {
      unRankingChoices.push(choice);
    });

    rankingChoices.forEach((rankingChoice: ItemValue) => {
      unRankingChoices.forEach((choice, index) => {
        if (choice.value === rankingChoice.value) unRankingChoices.splice(index, 1);
      });
    });

    return unRankingChoices;
  }

  private updateRankingChoices(forceUpdate = false): ItemValue[] {
    if (this.selectToRankEnabled) {
      this.updateRankingChoicesSelectToRankMode(forceUpdate);
      return;
    }

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

  private updateRankingChoicesSelectToRankMode(forceUpdate:boolean) {
    if (this.isEmpty()) {
      this.setPropertyValue("rankingChoices", []);
      return;
    }

    const newRankingChoices: ItemValue[] = [];

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

    this.setDragDropRankingChoices();
  }

  private setDragDropRankingChoices() {
    this.dragDropRankingChoices = this.createDragDropRankingChoices();
  }
  protected createDragDropRankingChoices() {
    if (this.selectToRankEnabled)
      return new DragDropRankingSelectToRank(this.survey, null, this.longTap);
    return new DragDropRankingChoices(this.survey, null, this.longTap);
  }

  public handlePointerDown = (
    event: PointerEvent,
    choice: ItemValue,
    node: HTMLElement
  ): void => {

    const target: HTMLElement = <HTMLElement>event.target;

    if (!this.isDragStartNodeValid(target)) return;

    if (this.allowStartDrag && this.canStartDragDueMaxSelectedChoices(target)) {
      this.dragDropRankingChoices.startDrag(event, choice, this, node);
    }
  };

  private isDragStartNodeValid(target: HTMLElement): boolean {
    if (settings.rankingDragHandleArea === "icon") {
      return target.classList.contains(this.cssClasses.itemIconHoverMod);
    }

    return true;
  }

  private get allowStartDrag() {
    return !this.isReadOnly && !this.isDesignMode;
  }

  private canStartDragDueMaxSelectedChoices(target: HTMLElement):boolean {
    if (!this.selectToRankEnabled) return true;

    let fromContainer: HTMLElement = target.closest("[data-ranking='from-container']");
    if (fromContainer) {
      return this.checkMaxSelectedChoicesUnreached();
    }
    return true;
  }

  public checkMaxSelectedChoicesUnreached() {
    if (this.maxSelectedChoices < 1) return true;
    var val = this.value;
    var len = !Array.isArray(val) ? 0 : val.length;
    return len < this.maxSelectedChoices;
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
    if (!this.isDesignMode) {
      const key: any = event.key;
      let index = this.rankingChoices.indexOf(choice);

      if (this.selectToRankEnabled) {
        this.handleKeydownSelectToRank(event, choice);
        return;
      }

      if (key === "ArrowUp" && index) {
        this.handleArrowUp(index, choice);
        event.preventDefault();
      }
      if (key === "ArrowDown" && index !== this.rankingChoices.length - 1) {
        this.handleArrowDown(index, choice);
        event.preventDefault();
      }
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

  public handleKeydownSelectToRank(event: KeyboardEvent, movedElement: ItemValue) {
    if (this.isDesignMode) return;

    const dnd:any = this.dragDropRankingChoices; //????
    const key: any = event.key;
    const rankingChoices = this.rankingChoices;
    const unRankingChoices = this.unRankingChoices;

    const isMovedElementRanked = rankingChoices.indexOf(movedElement) !== -1;
    const isMovedElementUnRanked = !isMovedElementRanked;

    let fromIndex;
    let toIndex;

    if ((key === " " || key === "Enter") && isMovedElementUnRanked) {
      fromIndex = unRankingChoices.indexOf(movedElement);
      toIndex = 0;
      dnd.selectToRank(this, fromIndex, toIndex);
      this.setValueAfterKeydown(toIndex, "to-container");
      return;
    }

    if ((key === " " || key === "Enter") && isMovedElementRanked) {
      fromIndex = rankingChoices.indexOf(movedElement);
      dnd.unselectFromRank(this, fromIndex);
      toIndex = this.unRankingChoices.indexOf(movedElement); //'this.' leads to actual array after the 'unselectFromRank' method
      this.setValueAfterKeydown(toIndex, "from-container");
      return;
    }

    if (key === "ArrowUp" && isMovedElementRanked) {
      fromIndex = rankingChoices.indexOf(movedElement);
      toIndex = fromIndex - 1;

      if (fromIndex < 0) return;

      dnd.reorderRankedItem(this, fromIndex, toIndex);
      this.setValueAfterKeydown(toIndex, "to-container");
      return;
    }

    if (key === "ArrowDown" && isMovedElementRanked) {
      fromIndex = rankingChoices.indexOf(movedElement);
      toIndex = fromIndex + 1;

      if (toIndex >= rankingChoices.length) return;

      dnd.reorderRankedItem(this, fromIndex, toIndex);
      this.setValueAfterKeydown(toIndex, "to-container");
      return;
    }
  }

  private setValueAfterKeydown(index: number, container: string) {
    this.setValue();
    setTimeout(() => {
      this.focusItem(index, container);
    }, 1);
    event.preventDefault();
  }

  private focusItem = (index: number, container?: string) => {
    if (this.selectToRankEnabled && container) {
      const containerSelector = "[data-ranking='" + container + "']";
      const itemsNodes: any = this.domNode.querySelectorAll(
        containerSelector + " " + "." + this.cssClasses.item
      );
      itemsNodes[index].focus();
    } else {
      const itemsNodes: any = this.domNode.querySelectorAll(
        "." + this.cssClasses.item
      );
      itemsNodes[index].focus();
    }
  };

  public setValue = (): void => {
    const value: string[] = [];
    this.rankingChoices.forEach((choice: ItemValue) => {
      value.push(choice.value);
    });
    this.value = value;
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
   * Specifies whether to use a long tap (press and hold) gesture to start dragging.
   *
   * Default value: `true`
   *
   * Disable this property if you want to start dragging when users perform a scroll gesture.
  */
  public get longTap(): boolean {
    return this.getPropertyValue("longTap");
  }
  public set longTap(val: boolean) {
    this.setPropertyValue("longTap", val);
  }

  /**
   * Specifies whether users can select choices they want to rank.
   *
   * When you enable this property, the Ranking question displays two areas for ranked and unranked choices. To order choices, users should first drag them from the unranked to the ranked area. Use this mode if you want to let users order only the choices they select.
   *
   * Default value: `false`
   * @see selectToRankAreasLayout
  */
  public get selectToRankEnabled(): boolean {
    return this.getPropertyValue("selectToRankEnabled", false);
  }
  public set selectToRankEnabled(val: boolean) {
    this.setPropertyValue("selectToRankEnabled", val);
  }

  /**
   * Specifies the layout of the ranked and unranked areas. Applies when [`selectToRankEnabled`](https://surveyjs.io/form-library/documentation/api-reference/ranking-question-model#selectToRankEnabled) is `true`.
   *
   * Possible values:
   *
   * - `"horizontal"` (default) - The ranked and unranked areas are positioned next to each other. Users drag and drop choices between them in the horizontal direction.
   * - `"vertical"`- The ranked area is positioned above the unranked area. Users drag and drop choices between them in the vertical direction.
   * @see selectToRankAreasLayout
  */
  public get selectToRankAreasLayout(): string {
    if (IsMobile) return "vertical";
    return this.getPropertyValue("selectToRankAreasLayout", "horizontal");
  }
  public set selectToRankAreasLayout(val: string) {
    this.setPropertyValue("selectToRankAreasLayout", val);
  }

  @property({ localizable: { defaultStr: "selectToRankEmptyRankedAreaText" } }) selectToRankEmptyRankedAreaText: string;
  @property({ localizable: { defaultStr: "selectToRankEmptyUnrankedAreaText" } }) selectToRankEmptyUnrankedAreaText: string;

  public get useFullItemSizeForShortcut(): boolean {
    return this.getPropertyValue("useFullItemSizeForShortcut");
  }
  public set useFullItemSizeForShortcut(val: boolean) {
    this.setPropertyValue("useFullItemSizeForShortcut", val);
  }
}

Serializer.addClass(
  "ranking",
  [
    { name: "showOtherItem", visible: false, isSerializable: false },
    { name: "otherText", visible: false, isSerializable: false },
    { name: "otherErrorText", visible: false, isSerializable: false },
    { name: "storeOthersAsComment", visible: false, isSerializable: false },
    { name: "showNoneItem", visible: false, isSerializable: false },
    { name: "noneText", visible: false, isSerializable: false },
    { name: "showSelectAllItem", visible: false, isSerializable: false },
    { name: "selectAllText", visible: false, isSerializable: false },
    { name: "colCount:number", visible: false, isSerializable: false },
    { name: "separateSpecialChoices", visible: false, isSerializable: false },
    {
      name: "longTap",
      default: true,
      visible: false,
      isSerializable: false,
    },
    {
      name: "selectToRankEnabled:switch",
      default: false,
      visible: true,
      isSerializable: true,
    },
    {
      name: "selectToRankAreasLayout",
      default: "horizontal",
      choices: ["horizontal", "vertical"],
      dependsOn: "selectToRankEnabled",
      visibleIf: (obj: any) => {
        return !!obj.selectToRankEnabled;
      },
      visible: true,
      isSerializable: true,
    },
    {
      name: "maxSelectedChoices:number",
      visible: true,
      default: 0,
      dependsOn: "selectToRankEnabled",
      visibleIf: (obj: any) => {
        return !!obj.selectToRankEnabled;
      },
      isSerializable: false
    },
    { name: "minSelectedChoices:number",
      visible: true,
      default: 0,
      dependsOn: "selectToRankEnabled",
      visibleIf: (obj: any) => {
        return !!obj.selectToRankEnabled;
      },
      isSerializable: false
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
