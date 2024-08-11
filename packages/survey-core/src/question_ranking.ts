import { ISurveyImpl } from "./base-interfaces";
import { DragDropRankingChoices } from "./dragdrop/ranking-choices";
import { DragDropRankingSelectToRank } from "./dragdrop/ranking-select-to-rank";
import { ItemValue } from "./itemvalue";
import { property, propertyArray, Serializer } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import { QuestionCheckboxModel } from "./question_checkbox";
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { IsMobile } from "./utils/devices";
import { Helpers } from "./helpers";
import { settings } from "../src/settings";
import { AnimationGroup, IAnimationGroupConsumer } from "./utils/animation";
import { DragOrClickHelper } from "./utils/dragOrClickHelper";
import { classesToSelector } from "./utils/utils";

/**
 * A class that describes the Ranking question type.
 *
 * [View Demo](https://surveyjs.io/form-library/examples/questiontype-ranking/ (linkStyle))
 */
export class QuestionRankingModel extends QuestionCheckboxModel {
  private domNode: HTMLElement = null;
  private dragOrClickHelper: DragOrClickHelper;

  constructor(name: string) {
    super(name);
    this.registerFunctionOnPropertyValueChanged("selectToRankEnabled", () => {
      this.clearValue(true);
      this.setDragDropRankingChoices();
      this.updateRankingChoicesSync();
    });
    this.dragOrClickHelper = new DragOrClickHelper(this.startDrag);
  }

  public getType(): string {
    return "ranking";
  }

  public getItemTabIndex(item: ItemValue) {
    if (this.isDesignMode || item.disabled) return undefined;
    return 0;
  }
  protected supportContainerQueries() {
    return this.selectToRankEnabled;
  }
  public get rootClass(): string {
    return new CssClassBuilder()
      .append(this.cssClasses.root)
      .append(this.cssClasses.rootMobileMod, this.isMobileMode())
      .append(this.cssClasses.rootDisabled, this.isDisabledStyle)
      .append(this.cssClasses.rootReadOnly, this.isReadOnlyStyle)
      .append(this.cssClasses.rootPreview, this.isPreviewStyle)
      .append(this.cssClasses.rootDesignMode, !!this.isDesignMode)
      .append(this.cssClasses.itemOnError, this.hasCssError())
      .append(this.cssClasses.rootDragHandleAreaIcon, settings.rankingDragHandleArea === "icon")
      .append(this.cssClasses.rootSelectToRankMod, this.selectToRankEnabled)
      .append(this.cssClasses.rootSelectToRankEmptyValueMod, this.isEmpty())
      .append(this.cssClasses.rootSelectToRankAlignHorizontal, this.selectToRankEnabled && this.renderedSelectToRankAreasLayout === "horizontal")
      .append(this.cssClasses.rootSelectToRankAlignVertical, this.selectToRankEnabled && this.renderedSelectToRankAreasLayout === "vertical")
      .toString();
  }
  protected isItemSelectedCore(item: ItemValue): boolean {
    if(this.selectToRankEnabled) {
      return super.isItemSelectedCore(item);
    }
    return true;
  }
  protected getItemClassCore(item: ItemValue, options: any): string {
    return new CssClassBuilder()
      .append(super.getItemClassCore(item, options))
      .append(this.cssClasses.itemGhostMod, this.currentDropTarget === item)
      .toString();
  }

  public getContainerClasses(containerType?: string) {
    let isEmpty = false;
    const isToContainer = containerType === "to";
    const isFromContainer = containerType === "from";

    if (isToContainer) {
      isEmpty = this.renderedRankingChoices.length === 0;
    } else if (isFromContainer) {
      isEmpty = this.renderedUnRankingChoices.length === 0;
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

  private updateRankingChoicesSync() {
    this.blockAnimations();
    this.updateRankingChoices();
    this.releaseAnimations();
  }

  public setSurveyImpl(value: ISurveyImpl, isLight?: boolean) {
    super.setSurveyImpl(value, isLight);
    this.setDragDropRankingChoices();
    this.updateRankingChoicesSync();
  }
  public isAnswerCorrect(): boolean {
    return Helpers.isArraysEqual(this.value, this.correctAnswer, false);
  }
  get requireStrictCompare(): boolean { return true; }
  onSurveyValueChanged(newValue: any) {
    super.onSurveyValueChanged(newValue);
    if (this.isLoadingFromJson) return;
    this.updateRankingChoices();
  }
  onSurveyLoad(): void {
    this.blockAnimations();
    super.onSurveyLoad();
    this.updateRankingChoices();
    this.releaseAnimations();
  }

  protected onVisibleChoicesChanged = (): void => {
    super.onVisibleChoicesChanged();

    if (this.carryForwardStartUnranked && !this.isValueSetByUser && !this.selectToRankEnabled && !this.defaultValue) {
      this.value = [];
    }

    // ranking question with only one choice doesn't make sense
    if (this.visibleChoices.length === 1 && !this.selectToRankEnabled) {
      this.value = [];
      this.value.push(this.visibleChoices[0].value);
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
    this.updateRankingChoicesSync();
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

  private getChoicesAnimationOptions(isRankingChoices: boolean): Required<IAnimationGroupConsumer<ItemValue>> {
    return {
      getKey(item: ItemValue) {
        return item.value;
      },
      getRerenderEvent: () => {
        return this.onElementRerendered;
      },
      isAnimationEnabled: () => this.animationAllowed && !this.isDesignMode && this.isVisible && !!this.domNode,
      getReorderOptions: (item: ItemValue, movedForward: boolean) => {
        let cssClass = "";
        if(item !== this.currentDropTarget) {
          cssClass = movedForward ? "sv-dragdrop-movedown" : "sv-dragdrop-moveup";
        }
        return { cssClass };
      },
      getLeaveOptions: (item: ItemValue) => {
        const choices = isRankingChoices ? this.renderedRankingChoices : this.renderedUnRankingChoices;
        if(this.renderedSelectToRankAreasLayout == "vertical" && choices.length == 1 && choices.indexOf(item) >= 0) {
          return { cssClass: "sv-ranking-item--animate-item-removing-empty" };
        }
        return { cssClass: "sv-ranking-item--animate-item-removing", onBeforeRunAnimation: (el) => {
          el.style.setProperty("--animation-height", el.offsetHeight + "px");
        } };
      },
      getEnterOptions: (item: ItemValue) => {
        const choices = isRankingChoices ? this.renderedRankingChoices : this.renderedUnRankingChoices;
        if(this.renderedSelectToRankAreasLayout == "vertical" && choices.length == 1 && choices.indexOf(item) >= 0) {
          return { cssClass: "sv-ranking-item--animate-item-adding-empty" };
        }
        return { cssClass: "sv-ranking-item--animate-item-adding", onBeforeRunAnimation: (el) => {
          el.style.setProperty("--animation-height", el.offsetHeight + "px");
        } };
      },
      getAnimatedElement: (item: ItemValue) => {
        const cssClasses = this.cssClasses;
        let containerSelector = "";
        if(this.selectToRankEnabled) {
          if(!isRankingChoices && cssClasses.containerFromMode) {
            containerSelector = classesToSelector(cssClasses.containerFromMode);
          } else if(isRankingChoices && cssClasses.containerToMode) {
            containerSelector = classesToSelector(cssClasses.containerToMode);
          }
        }
        const index = isRankingChoices ? this.renderedRankingChoices.indexOf(item) : this.renderedUnRankingChoices.indexOf(item);
        return this.domNode?.querySelector(`${containerSelector} [data-sv-drop-target-ranking-item='${index}']`);
      },
      allowSyncRemovalAddition: true
    };
  }

  private _rankingChoicesAnimation = new AnimationGroup(this.getChoicesAnimationOptions(true), (val) => {
    this._renderedRankingChoices = val;
  }, () => this.renderedRankingChoices)
  public get rankingChoicesAnimation(): AnimationGroup<ItemValue> {
    return this._rankingChoicesAnimation;
  }
  private _unRankingChoicesAnimation = new AnimationGroup(this.getChoicesAnimationOptions(false), (val) => {
    this._renderedUnRankingChoices = val;
  }, () => this.renderedUnRankingChoices)
  public get unRankingChoicesAnimation(): AnimationGroup<ItemValue> {
    return this._unRankingChoicesAnimation;
  }

  @propertyArray(
    {
      onSet: (val, target: QuestionRankingModel) => target.updateRenderedRankingChoices(),
      onRemove: (_: ItemValue, _i: number, target: QuestionRankingModel) => target.updateRenderedRankingChoices(),
      onPush: (_: ItemValue, _i: number, target: QuestionRankingModel) => target.updateRenderedRankingChoices(),
    }) public rankingChoices: Array<ItemValue> = [];
  @propertyArray(
    { onSet: (val, target: QuestionRankingModel) => target.updateRenderedUnRankingChoices(),
      onRemove: (_: ItemValue, _i: number, target: QuestionRankingModel) => target.updateRenderedUnRankingChoices(),
      onPush: (_: ItemValue, _i: number, target: QuestionRankingModel) => target.updateRenderedUnRankingChoices(),
    }
  ) public unRankingChoices: Array<ItemValue> = [];

  @propertyArray() private _renderedRankingChoices: Array<ItemValue> = [];
  @propertyArray() private _renderedUnRankingChoices: Array<ItemValue> = [];

  public get renderedRankingChoices(): Array<ItemValue> {
    return this._renderedRankingChoices;
  }

  public set renderedRankingChoices(val: Array<ItemValue>) {
    this.rankingChoicesAnimation.sync(val);
  }
  public get renderedUnRankingChoices(): Array<ItemValue> {
    return this._renderedUnRankingChoices;
  }
  public set renderedUnRankingChoices(val: Array<ItemValue>) {
    this.unRankingChoicesAnimation.sync(val);
  }

  private updateRenderedRankingChoices() {
    this.renderedRankingChoices = this.rankingChoices;
  }

  private updateRenderedUnRankingChoices() {
    this.renderedUnRankingChoices = this.unRankingChoices;
  }

  private updateRankingChoices(forceUpdate = false): ItemValue[] {
    if (this.selectToRankEnabled) {
      this.updateRankingChoicesSelectToRankMode(forceUpdate);
      return;
    }

    const newRankingChoices: ItemValue[] = [];

    // ranking question with only one choice doesn't make sense
    // if (this.visibleChoices.length === 1) {
    //   this.setPropertyValue("rankingChoices", newRankingChoices);
    //   return;
    // }

    if (forceUpdate) this.rankingChoices = [];

    if (this.isEmpty()) {
      this.rankingChoices = this.visibleChoices;
      return;
    }

    this.value.forEach((valueItem: string) => {
      this.visibleChoices.forEach((choice) => {
        if (choice.value === valueItem) newRankingChoices.push(choice);
      });
    });
    this.rankingChoices = newRankingChoices;
  }
  public updateUnRankingChoices(newRankingChoices: Array<ItemValue>) {
    const unRankingChoices: ItemValue[] = [];
    this.visibleChoices.forEach((choice) => {
      unRankingChoices.push(choice);
    });
    newRankingChoices.forEach((rankingChoice: ItemValue) => {
      unRankingChoices.forEach((choice, index) => {
        if (choice.value === rankingChoice.value) unRankingChoices.splice(index, 1);
      });
    });
    this.unRankingChoices = unRankingChoices;
  }
  private updateRankingChoicesSelectToRankMode(forceUpdate:boolean) {
    const newRankingChoices: ItemValue[] = [];
    if(!this.isEmpty()) {
      this.value.forEach((valueItem: string) => {
        this.visibleChoices.forEach((choice) => {
          if (choice.value === valueItem) newRankingChoices.push(choice);
        });
      });
    }
    this.updateUnRankingChoices(newRankingChoices);
    this.rankingChoices = newRankingChoices;
  }

  public dragDropRankingChoices: DragDropRankingChoices;
  @property({ defaultValue: null }) currentDropTarget: ItemValue;

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

  private draggedChoiceValue: any;
  private draggedTargetNode: HTMLElement;
  public handlePointerDown = (
    event: PointerEvent,
    choice: ItemValue,
    node: HTMLElement
  ): void => {
    const target: HTMLElement = <HTMLElement>event.target;

    if (!this.isDragStartNodeValid(target)) return;

    if (
      this.isAllowStartDrag(target, choice)
    )
    {
      this.draggedChoiceValue = choice.value;
      this.draggedTargetNode = node;
      this.dragOrClickHelper.onPointerDown(event);
    }
  };

  public startDrag = (event: PointerEvent): void => {
    const choice = ItemValue.getItemByValue(this.activeChoices, this.draggedChoiceValue);
    this.dragDropRankingChoices.startDrag(event, choice, this, this.draggedTargetNode);
  }

  public handlePointerUp = (
    event: PointerEvent,
    choice: ItemValue,
    node: HTMLElement
  ): void => {
    if (!this.selectToRankEnabled) return;

    const target: HTMLElement = <HTMLElement>event.target;

    if (
      this.isAllowStartDrag(target, choice)
    ) {
      this.handleKeydownSelectToRank(<any>event, choice, " ", false);
    }
  };

  private isDragStartNodeValid(target: HTMLElement): boolean {
    if (settings.rankingDragHandleArea === "icon") {
      return target.classList.contains(this.cssClasses.itemIconHoverMod);
    }

    return true;
  }

  private isAllowStartDrag(target: HTMLElement, choice: ItemValue) {
    return !this.isReadOnly &&
           !this.isDesignMode &&
           this.canStartDragDueMaxSelectedChoices(target) &&
           this.canStartDragDueItemEnabled(choice);
  }

  private canStartDragDueMaxSelectedChoices(target: HTMLElement):boolean {
    if (!this.selectToRankEnabled) return true;

    let fromContainer: HTMLElement = target.closest("[data-ranking='from-container']");
    if (fromContainer) {
      return this.checkMaxSelectedChoicesUnreached();
    }
    return true;
  }

  private canStartDragDueItemEnabled(item: ItemValue): boolean {
    return item.enabled;
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
    this.domNode = undefined;
    super.beforeDestroyQuestionElement(el);
  }

  public handleKeydown = (event: KeyboardEvent, choice: ItemValue): void => {
    if (this.isReadOnlyAttr) return;
    if (!this.isDesignMode) {
      const key: any = event.key;
      const index = this.rankingChoices.indexOf(choice);

      if (this.selectToRankEnabled) {
        this.handleKeydownSelectToRank(event, choice);
        return;
      }
      if((key === "ArrowUp" && index) || (key === "ArrowDown" && index !== this.rankingChoices.length - 1)) {
        const toIndex = key == "ArrowUp" ? index - 1 : index + 1;
        this.dragDropRankingChoices.reorderRankedItem(this, index, toIndex);
        this.setValueAfterKeydown(toIndex, "", true, event);
      }
    }
  };

  protected supportSelectAll(): boolean { return false; }
  public supportOther(): boolean { return false; }
  public supportNone(): boolean { return false; }
  public supportRefuse(): boolean { return false; }
  public supportDontKnow(): boolean { return false; }

  public handleKeydownSelectToRank(event: KeyboardEvent, movedElement: ItemValue, hardKey?:string, isNeedFocus: boolean = true): void {
    if (this.isDesignMode) return;

    let key: any = event.key;
    if (hardKey) key = hardKey;
    if(key !== " " && key !== "ArrowUp" && key !== "ArrowDown") return;

    const dnd:any = this.dragDropRankingChoices; //????
    const rankingChoices = this.rankingChoices;
    const isMovedElementRanked = rankingChoices.indexOf(movedElement) !== -1;
    const choices = isMovedElementRanked ? rankingChoices : this.unRankingChoices;
    const fromIndex = choices.indexOf(movedElement);
    if(fromIndex < 0) return;
    let toIndex;

    if (key === " " && !isMovedElementRanked) {
      if (!this.checkMaxSelectedChoicesUnreached() || !this.canStartDragDueItemEnabled(movedElement)) return;
      toIndex = this.value.length;
      dnd.selectToRank(this, fromIndex, toIndex);
      this.setValueAfterKeydown(toIndex, "to-container", isNeedFocus, event);
      return;
    }
    if(!isMovedElementRanked) return;
    if (key === " ") {
      dnd.unselectFromRank(this, fromIndex);
      toIndex = this.unRankingChoices.indexOf(movedElement); //'this.' leads to actual array after the 'unselectFromRank' method
      this.setValueAfterKeydown(toIndex, "from-container", isNeedFocus, event);
      return;
    }
    const delta = key === "ArrowUp" ? -1 : (key === "ArrowDown" ? 1 : 0);
    if(delta === 0) return;
    toIndex = fromIndex + delta;
    if(toIndex < 0 || toIndex >= rankingChoices.length) return;
    dnd.reorderRankedItem(this, fromIndex, toIndex);
    this.setValueAfterKeydown(toIndex, "to-container", isNeedFocus, event);
  }

  private setValueAfterKeydown(index: number, container: string, isNeedFocus: boolean = true, event: KeyboardEvent) {
    this.setValue();

    if (isNeedFocus) {
      setTimeout(() => {
        this.focusItem(index, container);
      }, 1);
    }
    event && event.preventDefault();
  }

  private focusItem = (index: number, container?: string) => {
    if(!this.domNode) return;
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

  public isValueSetByUser = false;
  public setValue = (): void => {
    const value: string[] = [];
    this.rankingChoices.forEach((choice: ItemValue) => {
      value.push(choice.value);
    });
    this.value = value;
    this.isValueSetByUser = true;
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

  protected getDefaultItemComponent(): string {
    return "sv-ranking-item";
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

  @property({ defaultValue: true }) carryForwardStartUnranked: boolean;

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
    return this.getPropertyValue("selectToRankAreasLayout");
  }
  public set selectToRankAreasLayout(val: string) {
    this.setPropertyValue("selectToRankAreasLayout", val);
  }

  public get renderedSelectToRankAreasLayout(): string {
    if (this.isMobileMode()) return "vertical";
    return this.selectToRankAreasLayout;
  }

  public isMobileMode(): boolean {
    return IsMobile;
  }

  /**
   * A placeholder displayed in the area for ranked choices. Applies when [`selectToRankEnabled`](https://surveyjs.io/form-library/documentation/api-reference/ranking-question-model#selectToRankEnabled) is `true`.
   */
  @property({ localizable: { defaultStr: "selectToRankEmptyRankedAreaText" } }) selectToRankEmptyRankedAreaText: string;
  /**
   * A placeholder displayed in the area for unranked choices. Applies when [`selectToRankEnabled`](https://surveyjs.io/form-library/documentation/api-reference/ranking-question-model#selectToRankEnabled) is `true`.
   */
  @property({ localizable: { defaultStr: "selectToRankEmptyUnrankedAreaText" } }) selectToRankEmptyUnrankedAreaText: string;

  public get useFullItemSizeForShortcut(): boolean {
    return this.getPropertyValue("useFullItemSizeForShortcut");
  }
  public set useFullItemSizeForShortcut(val: boolean) {
    this.setPropertyValue("useFullItemSizeForShortcut", val);
  }

  public get dragDropSvgIcon(): string {
    return this.cssClasses.dragDropSvgIconId || "#icon-drag-n-drop";
  }
  public get arrowsSvgIcon(): string {
    return this.cssClasses.arrowsSvgIconId || "#icon-ranking-arrows";
  }
  public get dashSvgIcon(): string {
    return this.cssClasses.dashSvgIconId || "#icon-ranking-dash";
  }

  //a11y
  public get isNewA11yStructure(): boolean {
    return false;
  }
  // EO a11y
}

Serializer.addClass(
  "ranking",
  [
    { name: "showOtherItem", visible: false, isSerializable: false },
    { name: "otherText", visible: false, isSerializable: false },
    { name: "otherErrorText", visible: false, isSerializable: false },
    { name: "storeOthersAsComment", visible: false, isSerializable: false },
    { name: "showNoneItem", visible: false, isSerializable: false },
    { name: "showRefuseItem", visible: false, isSerializable: false },
    { name: "showDontKnowItem", visible: false, isSerializable: false },
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
      name: "selectToRankEmptyRankedAreaText:text",
      serializationProperty: "locSelectToRankEmptyRankedAreaText",
      category: "general",
      dependsOn: "selectToRankEnabled",
      visibleIf: (obj: any) => {
        return !!obj.selectToRankEnabled;
      },
    },
    {
      name: "selectToRankEmptyUnrankedAreaText:text",
      serializationProperty: "locSelectToRankEmptyUnrankedAreaText",
      category: "general",
      dependsOn: "selectToRankEnabled",
      visibleIf: (obj: any) => {
        return !!obj.selectToRankEnabled;
      },
    },
    {
      name: "maxSelectedChoices:number",
      visible: true,
      default: 0,
      dependsOn: "selectToRankEnabled",
      visibleIf: (obj: any) => {
        return !!obj.selectToRankEnabled;
      },
      isSerializable: true
    },
    { name: "minSelectedChoices:number",
      visible: true,
      default: 0,
      dependsOn: "selectToRankEnabled",
      visibleIf: (obj: any) => {
        return !!obj.selectToRankEnabled;
      },
      isSerializable: true
    },
    { name: "itemComponent", visible: false, default: "sv-ranking-item" },
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
