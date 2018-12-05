import { JsonObject } from "./jsonobject";
import { HashTable, Helpers } from "./helpers";
import {
  IPage,
  IPanel,
  IElement,
  ISurveyElement,
  IQuestion,
  SurveyElement
} from "./base";
import { Question } from "./question";
import { DragDropInfo, PanelModelBase, QuestionRowModel } from "./panel";

/**
 * The page object. It has elements collection, that contains questions and panels.
 */
export class PageModel extends PanelModelBase implements IPage {
  private hasShownValue: boolean = false;
  constructor(public name: string = "") {
    super(name);
    var self = this;
    this.locTitle.onRenderedHtmlCallback = function(text) {
      if (self.num > 0) return self.num + ". " + text;
      return text;
    };
  }
  public getType(): string {
    return "page";
  }
  public toString(): string {
    return this.name;
  }
  public get isPage() {
    return true;
  }
  public onFirstRendering() {
    if (this.wasShown) return;
    super.onFirstRendering();
  }
  /**
   * The visible index of the page. It has values from 0 to visible page count - 1.
   * @see SurveyModel.visiblePages
   * @see SurveyModel.pages
   */
  public get visibleIndex(): number {
    return this.getPropertyValue("visibleIndex", -1);
  }
  public set visibleIndex(val: number) {
    this.setPropertyValue("visibleIndex", val);
  }
  /**
   * Returns true, if the page is started page in the survey. It can be shown on the start only and the end-user could not comeback to it after it passed it.
   */
  public get isStarted(): boolean {
    return this.survey && this.survey.isPageStarted(this);
  }
  getIsPageVisible(exceptionQuestion: IQuestion): boolean {
    if (this.isStarted) return false;
    return super.getIsPageVisible(exceptionQuestion);
  }
  public get num() {
    return this.getPropertyValue("num", -1);
  }
  public set num(val: number) {
    if (this.num == val) return;
    this.setPropertyValue("num", val);
    this.onNumChanged(val);
  }
  /**
   * Set this property to "hide" to make "Prev", "Next" and "Complete" buttons are invisible for this page. Set this property to "show" to make these buttons visible, even if survey showNavigationButtons property is false.
   * @see SurveyMode.showNavigationButtons
   */
  public get navigationButtonsVisibility(): string {
    return this.getPropertyValue("navigationButtonsVisibility", "inherit");
  }
  public set navigationButtonsVisibility(val: string) {
    this.setPropertyValue("navigationButtonsVisibility", val.toLowerCase());
  }
  /**
   * The property returns true, if the page has been shown to the end-user.
   */
  public get wasShown(): boolean {
    return this.hasShownValue;
  }
  get hasShown(): boolean {
    return this.wasShown;
  }
  public setWasShown(val: boolean) {
    if (val == this.hasShownValue) return;
    this.hasShownValue = val;
    if (this.isDesignMode) return;
    if (val == true && this.areQuestionsRandomized) {
      this.randomizeElements();
    }
  }
  private isRandomizing = false;
  private randomizeElements() {
    if (this.isRandomizing) return;
    this.isRandomizing = true;
    var oldElements = [];
    var elements = this.elements;
    for (var i = 0; i < elements.length; i++) {
      oldElements.push(elements[i]);
    }
    var newElements = Helpers.randomizeArray<IElement>(oldElements);
    this.elements.splice(0, this.elements.length);
    for (var i = 0; i < newElements.length; i++) {
      this.elements.push(newElements[i]);
    }
    this.isRandomizing = false;
  }
  /**
   * The property returns true, if the elements are randomized on the page
   * @see hasShown
   * @see questionsOrder
   * @see SurveyModel.questionsOrder
   */
  public get areQuestionsRandomized(): boolean {
    var order =
      this.questionsOrder == "default" && this.survey
        ? this.survey.questionsOrder
        : this.questionsOrder;
    return order == "random";
  }
  /**
   * Use this property to randomize questions. Set it to 'random' to randomize questions, 'initial' to keep them in the same order or 'default' to use the Survey questionsOrder property
   * @see SurveyModel.questionsOrder
   * @see areQuestionsRandomized
   */
  public get questionsOrder() {
    return this.getPropertyValue("questionsOrder", "default");
  }
  public set questionsOrder(val: string) {
    this.setPropertyValue("questionsOrder", val);
  }
  /**
   * Call it to focus the input on the first question
   */
  public focusFirstQuestion() {
    var q = this.getFirstQuestionToFocus();
    if (!!q) {
      q.focus();
    }
  }
  /**
   * Call it to focus the input of the first question that has an error.
   */
  public focusFirstErrorQuestion() {
    var q = this.getFirstQuestionToFocus(true);
    if (!!q) {
      q.focus();
    }
  }
  /**
   * Call it to scroll to the page top.
   */
  public scrollToTop() {
    SurveyElement.ScrollElementToTop(this.id);
  }
  /**
   * Time in seconds end-user spent on this page
   */
  public get timeSpent(): number {
    return this.getPropertyValue("timeSpent", 0);
  }
  public set timeSpent(val: number) {
    this.setPropertyValue("timeSpent", val);
  }
  /**
   * Returns the list of all panels in the page
   */
  public getPanels(
    visibleOnly: boolean = false,
    includingDesignTime: boolean = false
  ): Array<IPanel> {
    var result = new Array<IPanel>();
    this.addPanelsIntoList(result, visibleOnly, includingDesignTime);
    return result;
  }
  /**
   * The maximum time in seconds that end-user has to complete the page. If the value is 0 or less, the end-user has unlimited number of time to finish the page.
   * @see startTimer
   * @see SurveyModel.maxTimeToFinishPage
   */
  public get maxTimeToFinish(): number {
    return this.getPropertyValue("maxTimeToFinish", 0);
  }
  public set maxTimeToFinish(val: number) {
    this.setPropertyValue("maxTimeToFinish", val);
  }
  protected onNumChanged(value: number) {}
  protected onVisibleChanged() {
    if (this.isRandomizing) return;
    super.onVisibleChanged();
    if (this.survey != null) {
      this.survey.pageVisibilityChanged(this, this.isVisible);
    }
  }
  private dragDropInfo: DragDropInfo;
  public dragDropStart(
    src: IElement,
    target: IElement,
    nestedPanelDepth: number = -1
  ) {
    this.dragDropInfo = new DragDropInfo(src, target, nestedPanelDepth);
  }
  public dragDropMoveTo(
    destination: ISurveyElement,
    isBottom: boolean = false,
    isEdge: boolean = false
  ): boolean {
    if (!this.dragDropInfo) return false;
    this.dragDropInfo.destination = destination;
    this.dragDropInfo.isBottom = isBottom;
    this.dragDropInfo.isEdge = isEdge;
    if (!this.dragDropCanDropTagert()) return false;
    if (!this.dragDropCanDropSource() || !this.dragDropAllowFromSurvey()) {
      if (!!this.dragDropInfo.source) {
        var row = this.dragDropFindRow(this.dragDropInfo.target);
        this.updateRowsRemoveElementFromRow(this.dragDropInfo.target, row);
      }
      return false;
    }
    this.dragDropAddTarget(this.dragDropInfo);
    return true;
  }
  private dragDropAllowFromSurvey(): boolean {
    var dest = this.dragDropInfo.destination;
    if (!dest || !this.survey) return true;
    var insertBefore: IElement = null;
    var insertAfter: IElement = null;
    var parent =
      dest.isPage || (!this.dragDropInfo.isEdge && (<IElement>dest).isPanel)
        ? dest
        : (<IElement>dest).parent;
    if (!dest.isPage) {
      var container = (<IElement>dest).parent;
      if (!!container) {
        var elements = (<PanelModelBase>container).elements;
        var index = elements.indexOf(<IElement>dest);
        if (index > -1) {
          insertBefore = <IElement>dest;
          insertAfter = <IElement>dest;
          if (this.dragDropInfo.isBottom) {
            insertBefore =
              index < elements.length - 1 ? elements[index + 1] : null;
          } else {
            insertAfter = index > 0 ? elements[index - 1] : null;
          }
        }
      }
    }
    var options = {
      target: this.dragDropInfo.target,
      source: this.dragDropInfo.source,
      parent: parent,
      insertAfter: insertAfter,
      insertBefore: insertBefore
    };
    return this.survey.dragAndDropAllow(options);
  }
  public dragDropFinish(isCancel: boolean = false): IElement {
    if (!this.dragDropInfo) return;
    var target = this.dragDropInfo.target;
    var row = this.dragDropFindRow(target);
    if (!isCancel) {
      var targetIndex = this.dragDropGetElementIndex(target, row);
      var src = this.dragDropInfo.source;
      if (!!src && !!src.parent) {
        var srcIndex = (<PanelModelBase>src.parent).elements.indexOf(src);
        if (!!row && row.panel == src.parent && targetIndex > srcIndex) {
          targetIndex--;
        }
        if (!!row) {
          src.parent.removeElement(src);
        }
      }
      this.updateRowsRemoveElementFromRow(target, row);
      if (!!row && targetIndex > -1) {
        row.panel.addElement(target, targetIndex);
      }
    } else {
      this.updateRowsRemoveElementFromRow(target, row);
    }
    this.dragDropInfo = null;
    return !isCancel ? target : null;
  }
  private dragDropGetElementIndex(
    target: IElement,
    row: QuestionRowModel
  ): number {
    if (!row) return -1;
    var index = row.elements.indexOf(target);
    if (row.index == 0) return index;
    var prevRow = row.panel.rows[row.index - 1];
    var prevElement = prevRow.elements[prevRow.elements.length - 1];
    return index + row.panel.elements.indexOf(prevElement) + 1;
  }
  private dragDropCanDropTagert(): boolean {
    var destination = this.dragDropInfo.destination;
    if (!destination || destination.isPage) return true;
    return this.dragDropCanDropCore(
      this.dragDropInfo.target,
      <IElement>destination
    );
  }
  private dragDropCanDropSource(): boolean {
    var source = this.dragDropInfo.source;
    if (!source) return true;
    var destination = <IElement>this.dragDropInfo.destination;
    if (!this.dragDropCanDropCore(source, destination)) return false;
    return this.dragDropCanDropNotNext(
      source,
      destination,
      this.dragDropInfo.isEdge,
      this.dragDropInfo.isBottom
    );
  }
  private dragDropCanDropCore(
    target: IElement,
    destination: IElement
  ): boolean {
    if (!destination) return true;
    if (this.dragDropIsSameElement(destination, target)) return false;
    if (target.isPanel) {
      var pnl = <PanelModelBase>(<any>target);
      if (
        pnl.containsElement(destination) ||
        !!pnl.getElementByName(destination.name)
      )
        return false;
    }
    return true;
  }
  private dragDropCanDropNotNext(
    source: IElement,
    destination: IElement,
    isEdge: boolean,
    isBottom: boolean
  ): boolean {
    if (!destination || (destination.isPanel && !isEdge)) return true;
    if (source.parent !== destination.parent) return true;
    var pnl = <PanelModelBase>source.parent;
    var srcIndex = pnl.elements.indexOf(source);
    var destIndex = pnl.elements.indexOf(destination);
    if (destIndex < srcIndex && !isBottom) destIndex--;
    if (isBottom) destIndex++;
    return srcIndex < destIndex
      ? destIndex - srcIndex > 1
      : srcIndex - destIndex > 0;
  }

  private dragDropIsSameElement(el1: IElement, el2: IElement) {
    return el1 == el2 || el1.name == el2.name;
  }
}

JsonObject.metaData.addClass(
  "page",
  [
    {
      name: "navigationButtonsVisibility",
      default: "inherit",
      choices: ["inherit", "show", "hide"]
    },
    {
      name: "questionsOrder",
      default: "default",
      choices: ["default", "initial", "random"]
    },
    { name: "maxTimeToFinish:number", default: 0 }
  ],
  function() {
    return new PageModel();
  },
  "panelbase"
);
