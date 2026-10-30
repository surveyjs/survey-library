import { Base, ComputedUpdater } from "../base";
import type { Action, IAction } from "../actions/action";
import { settings } from "../settings";
import type { IDialogOptions } from "../popup";
import type { PopupBaseViewModel } from "../popup-view-model";
import type { SurveyModel } from "../survey";
import type { Question } from "../question";
import type { QuestionMatrixDynamicModel } from "../question_matrixdynamic";
import type { MatrixDropdownRowModelBase } from "../question_matrixdropdownbase";
import type { GetMatrixRowActionsEvent, MatrixCellValueChangedEvent, MatrixAllowRemoveRowEvent } from "../survey-events-api";
import { createBoxShadowResetVariables } from "../utils/base-theme-init";
import { focusElement } from "../utils/focus-utils";
import { getActiveElement } from "../utils/dom-utils";
import { ISortCriterion, SortDirection } from "../dynamic-data/dynamic-data-interfaces";
import { getFirstSortDirection, getSortDirectionItems, ISortDirectionItem } from "./records-sort-directions";
import { copySort, getShownSortField, isFocusInsideOrIdle, isSameSort } from "./records-sort-items";
import type { IRecordsSortBarOwner, IRecordsSortField } from "./records-sort-bar";

// What the dialog gets from the sort bar that opens it.
export interface IRecordsSortDialogOptions {
  // The field the first row shows while nothing is sorted: the one the bar's first level shows.
  shownField: string;
  // The respondent's sort, through the bar, which keeps the field it shows (IRecordsSortBarOwner.sortByUser).
  sortByUser(criteria: Array<ISortCriterion>): boolean;
  // A sort was applied: the bar shows it.
  onApplied(): void;
}

/* survey.ts registers the creator of the dialog's survey. A static import of SurveyModel here would close an
   import cycle: survey.ts imports the question classes, and they import this file through the records bar. */
let createDialogSurvey: () => SurveyModel;
export function registerRecordsSortDialogSurvey(creator: () => SurveyModel): void {
  createDialogSurvey = creator;
}

// The matrix of the dialog: one row per sort level.
const matrixName = "levels";
const numberColumn = "number";
const fieldColumn = "field";
const directionColumn = "direction";
// The direction value of a row that does not sort: Default.
const noSortValue = "none";
// Default is the first row's only: every row has the choice, and this hides it in the later ones.
const noSortVisibleIf = "{rowIndex} = 1";
// The inner matrix's rows get this class too: the drag shortcut is a copy of a row placed outside the dialog.
const dialogRowClass = "sd-sort-dialog__row";

interface ISortDialogLevel {
  field: string;
  direction: string;
}

/* The "Sort by" dialog that "..." opens: the sort bar with its levels in rows (SD03). What a level can or cannot
   do in the bar, a row can or cannot do here; the one difference is that the dialog is a draft, which sorts
   nothing until Apply (SD04). The content is a survey with one dynamic matrix, shown through the "survey"
   component that every renderer registers: a row per level with the matrix's drag handle, the level's number,
   a field dropdown, a direction dropdown and, after the first row, the matrix's remove button. A row other
   than the first always has a direction, and a Default row is always alone: Apply then clears the sort. A field
   is in one row at most (SD07). The footer's Add New and Apply are the modal's. */
export class RecordsSortDialogModel extends Base {
  private surveyValue: SurveyModel;
  private matrix: QuestionMatrixDynamicModel;
  private popupViewModel: PopupBaseViewModel;
  private addAction: Action;
  private applyAction: Action;
  private isUpdating = false;
  private isWritingValue = false;

  constructor(private owner: IRecordsSortBarOwner, private options: IRecordsSortDialogOptions) {
    super();
    // An omitted direction is ascending: an imported level always sorts.
    const levels: Array<ISortDialogLevel> = copySort(owner.sortCriteria).map((item: ISortCriterion): ISortDialogLevel => ({ field: item.field, direction: item.direction }));
    if (levels.length === 0 && !!options.shownField) {
      levels.push({ field: options.shownField, direction: noSortValue });
    }
    this.createSurvey(levels);
    this.update();
  }
  public getType(): string {
    return "recordssortdialog";
  }
  // The survey the modal shows; its matrix holds the draft.
  public get survey(): SurveyModel {
    return this.surveyValue;
  }
  // Add New is enabled while the first row sorts, the draft has fewer than maxSortLevel rows and an offered field no row has.
  public get canAddRow(): boolean {
    return this.getPropertyValue("canAddRow", false);
  }
  // No sort can be made while a page is read or a page move waits for its validators.
  public get canApply(): boolean {
    const isDataLoading = this.owner.isDataLoading;
    const isPageMovePending = this.owner.isPageMovePending;
    return !isDataLoading && !isPageMovePending;
  }
  // The sort Apply makes: the rows that have a direction, in order. The number column is not a part of it.
  public getCriteria(): Array<ISortCriterion> {
    return this.getLevels().filter((level: ISortDialogLevel): boolean => level.direction === "asc" || level.direction === "desc")
      .map((level: ISortDialogLevel): ISortCriterion => ({ field: level.field, direction: <SortDirection>level.direction }));
  }
  /* Adds a row with the first offered field that no row has, in its type's first direction, as "+" does in the
     bar. The focus stays on Add New; when the new row disables it, the focus moves to the new row's field (the
     table is rendered again). */
  public addRow(): void {
    const free = this.getFreeField();
    if (!this.canAddRow || !free || !this.matrix) return;
    const hadFocus = !!this.addAction && isFocusInsideOrIdle(this.owner, this.addAction);
    this.matrix.addRowByIndex({ [fieldColumn]: free.field, [directionColumn]: getFirstSortDirection(free.dataType) }, this.matrix.rowCount);
    this.update();
    if (hadFocus && !this.canAddRow) {
      // Unless the respondent has gone on meanwhile: the focus is still on the disabled Add New or on nothing.
      this.focusField(this.matrix.visibleRows.length - 1, (): boolean => !!this.addAction && isFocusInsideOrIdle(this.owner, this.addAction));
    }
  }
  // Takes a row out of the draft; the first row is not removed, as in the bar. The focus moves to the field of the row before.
  public removeRow(index: number): void {
    const matrix = this.matrix;
    if (!matrix || index < 1 || index >= matrix.visibleRows.length) return;
    const hadFocus = this.isFocusInsideOrIdle();
    matrix.removeRow(index, false);
    this.update();
    if (hadFocus) {
      // The focused remove button left with its row: the focus is on nothing until it moves.
      this.focusField(index - 1, (): boolean => this.isFocusIdle());
    }
  }
  /* Apply: the rows that have a direction become the sort, through the bar's validated sort. A draft equal
     to the current sort (both with their directions normalized) sorts nothing. The dialog closes even
     when the page validation refuses the sort: its errors are on the page, behind the overlay (SD06). */
  public apply(): boolean {
    if (!this.canApply) return false;
    const criteria = this.getCriteria();
    if (!isSameSort(criteria, this.owner.sortCriteria)) {
      this.options.sortByUser(criteria);
      this.options.onApplied();
    }
    return true;
  }
  /* Sets what every row shows from the draft (its choices, texts and labels), Add New, Apply and the title.
     It runs after every change of the matrix's value - a pick, a move, an add or a removal. The bar calls it
     on each of its own updates while the dialog is open: a locale change and the loading states reach it there. */
  public update(): void {
    if (this.isDisposed || !this.matrix || this.isUpdating) return;
    this.isUpdating = true;
    try {
      this.updateSurvey();
      const levels = this.getLevels();
      const fields = this.owner.sortFields;
      this.matrix.visibleRows.forEach((row: MatrixDropdownRowModelBase, index: number): void => {
        this.updateRow(row, index, levels, fields);
      });
      const isFirstRowSorting = levels.length > 0 && levels[0].direction !== noSortValue;
      this.setPropertyValue("canAddRow", isFirstRowSorting && levels.length < this.owner.maxSortLevel && !!this.getFreeField());
      this.updateFooter();
    } finally {
      this.isUpdating = false;
    }
  }
  /* Takes over the modal that shows the dialog: its footer gets Add New at the start and keeps Apply, and
     Cancel is hidden - the close button and Esc drop the draft. */
  public attach(popupViewModel: PopupBaseViewModel): void {
    this.popupViewModel = popupViewModel;
    // The modal focuses its first input as it opens: the first row's field, not the drag handle before it.
    const first = this.getCellQuestion(0, fieldColumn);
    if (!!first) {
      popupViewModel.model.focusFirstInputSelector = "#" + first.inputId;
    }
    const toolbar = popupViewModel.footerToolbar;
    const cancel = toolbar.getActionById("cancel");
    if (!!cancel) cancel.visible = false;
    this.applyAction = toolbar.getActionById("apply");
    this.addAction = toolbar.addAction({
      id: "sv-sort-dialog-add",
      visibleIndex: 0,
      title: "",
      action: (): void => { this.addRow(); }
    });
    this.updateFooter();
  }
  // Closes the modal without applying anything.
  public close(): void {
    const popupViewModel = this.popupViewModel;
    if (!!popupViewModel && !popupViewModel.isDisposed && popupViewModel.model.isVisible) {
      popupViewModel.model.hide();
    }
  }
  // The footer's actions belong to the modal, which disposes them.
  public dispose(): void {
    const survey = this.surveyValue;
    this.surveyValue = undefined;
    this.matrix = undefined;
    this.popupViewModel = undefined;
    this.addAction = undefined;
    this.applyAction = undefined;
    super.dispose();
    if (!!survey && !survey.isDisposed) {
      survey.dispose();
    }
  }

  /* The survey shows the matrix only: no title, numbers, navigation or own add button. It takes the outer
     survey's look: its root has no theme root class, so it inherits the variables of the survey it is shown
     under, and its own box-shadow resets inherit too. --sd-mobile-width 0 keeps its width from making it
     mobile; it follows the outer survey's isMobile instead (DG03). */
  private createSurvey(levels: Array<ISortDialogLevel>): void {
    const survey = createDialogSurvey();
    survey.css = { rootTheme: "", matrixdynamic: { row: survey.css.matrixdynamic.row + " " + dialogRowClass } };
    survey.showNavigationButtons = false;
    survey.showQuestionNumbers = "off";
    survey.fitToContainer = false;
    survey.gridLayoutEnabled = false;
    // The outer survey already renders the icons.
    survey.needRenderIcons = false;
    const cssVariables: { [index: string]: string } = { "--sd-mobile-width": "0px" };
    Object.keys(createBoxShadowResetVariables()).forEach((name: string): void => { cssVariables[name] = "inherit"; });
    survey.applyTheme({ cssVariables: cssVariables });
    survey.fromJSON({
      elements: [{
        type: "matrixdynamic",
        name: matrixName,
        titleLocation: "hidden",
        showHeader: false,
        allowRowReorder: true,
        allowAddRows: false,
        minRowCount: 0,
        rowCount: 0,
        columns: [
          { name: numberColumn, cellType: "expression", expression: "{rowIndex}" },
          { name: fieldColumn, cellType: "dropdown", searchEnabled: false, allowClear: false },
          { name: directionColumn, cellType: "dropdown", searchEnabled: false, allowClear: false }
        ]
      }]
    });
    this.surveyValue = survey;
    this.matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName(matrixName);
    // The first row has no remove button, as level 1 in the bar: it is out of the Tab order, and its cell stays empty.
    survey.onMatrixRenderRemoveButton.add((_: SurveyModel, options: MatrixAllowRemoveRowEvent): void => { options.allow = options.rowIndex > 0; });
    survey.onGetMatrixRowActions.add((_: SurveyModel, options: GetMatrixRowActionsEvent): void => { this.onGetRowActions(options); });
    survey.onMatrixCellValueChanged.add((_: SurveyModel, options: MatrixCellValueChangedEvent): void => { this.onCellValueChanged(options); });
    // A move changes the matrix value only; the field and direction cells raise no cell event then.
    survey.onValueChanged.add((): void => { this.update(); });
    this.updateSurvey();
    this.isWritingValue = true;
    try {
      this.matrix.value = levels.map((level: ISortDialogLevel): any => ({ [fieldColumn]: level.field, [directionColumn]: level.direction }));
    } finally {
      this.isWritingValue = false;
    }
  }
  // The outer survey's locale and isMobile.
  private updateSurvey(): void {
    const survey = this.surveyValue;
    const locale = this.owner.getLocOwner().getLocale() || "";
    if (survey.locale !== locale) {
      survey.locale = locale;
    }
    this.setPropertyValue("locale", locale);
    survey.setIsMobile(this.owner.isMobile);
  }
  private getLevels(): Array<ISortDialogLevel> {
    const value = !!this.matrix ? this.matrix.value : undefined;
    if (!Array.isArray(value)) return [];
    return value.map((item: any): ISortDialogLevel => ({ field: !!item ? item[fieldColumn] : undefined, direction: !!item ? item[directionColumn] : undefined }));
  }
  private getCellQuestion(index: number, column: string): Question {
    const row = !!this.matrix ? this.matrix.visibleRows[index] : undefined;
    return !!row ? row.getQuestionByName(column) : undefined;
  }
  /* The handle's and the remove button's names follow the row's position (getRowNumber, which the matrix gives
     its handle) and the locale. The remove button removes through the dialog, which moves the focus itself; the
     remove column stays with a single row (minRowCount 0). */
  private onGetRowActions(options: GetMatrixRowActionsEvent): void {
    const owner = this.owner;
    const actions = <Array<Action>>options.actions;
    const drag = actions.filter((item: IAction): boolean => item.id === "drag-drop")[0];
    const remove = actions.filter((item: IAction): boolean => item.id === "remove-row")[0];
    const row = options.row;
    const getRowNumber = (): number => !!drag ? drag.data.getRowNumber() : this.matrix.visibleRows.indexOf(row) + 1;
    // An updater collects its dependencies on its first run: the locale and the row number are both read.
    const getLabel = (strName: string): string => {
      this.getPropertyValue("locale");
      return owner.getLocalizationFormatString(strName, getRowNumber());
    };
    if (!!drag) {
      drag.ariaLabel = <any>new ComputedUpdater(() => getLabel("sortMoveLevelAriaLabel"));
    }
    if (!!remove) {
      // The title is the matrix's own localizable string: the label goes to the tooltip and the accessible name.
      remove.ariaLabel = <any>new ComputedUpdater(() => getLabel("sortRemoveLevelText"));
      remove.tooltip = <any>new ComputedUpdater(() => getLabel("sortRemoveLevelText"));
      remove.action = (): void => { this.removeRow(this.matrix.visibleRows.indexOf(row)); };
      // Grey as the handle (the design's quaternary neutral button), not the alert style of the matrix's remove button.
      remove.appearance = Object.assign({}, remove.appearance, { style: "neutral" });
    }
  }
  /* As in the bar: Default clears the whole sort, so the later rows leave the draft, and a field pick takes the
     new field's first direction, in a Default row too. */
  private onCellValueChanged(options: MatrixCellValueChangedEvent): void {
    if (this.isWritingValue || !options.value) return;
    if (options.columnName === directionColumn && options.value === noSortValue) {
      for (let i = this.matrix.visibleRows.length - 1; i > 0; i--) {
        this.matrix.removeRow(i, false);
      }
      return;
    }
    if (options.columnName !== fieldColumn) return;
    const direction = options.getCellQuestion(directionColumn);
    if (!direction || !direction.value) return;
    const dataType = getShownSortField(this.owner, this.owner.sortFields, options.value).dataType;
    direction.value = getFirstSortDirection(dataType);
  }
  /* A row by its position: the field list without the other rows' fields (and the fallback item of a field the
     owner does not offer), the direction list, where Default is hidden after the first row, and the labels of
     its dropdowns. */
  private updateRow(row: MatrixDropdownRowModelBase, index: number, levels: Array<ISortDialogLevel>, fields: Array<IRecordsSortField>): void {
    const owner = this.owner;
    const level = levels[index];
    if (!level) return;
    const shown = getShownSortField(owner, fields, level.field);
    const otherFields = levels.filter((_: ISortDialogLevel, i: number): boolean => i !== index).map((item: ISortDialogLevel): string => item.field);
    const fieldChoices = fields.filter((item: IRecordsSortField): boolean => otherFields.indexOf(item.field) < 0)
      .map((item: IRecordsSortField): any => ({ value: item.field, text: item.title }));
    if (shown.isFallback) {
      fieldChoices.push({ value: shown.field, text: shown.title });
    }
    const fieldQuestion = row.getQuestionByName(fieldColumn);
    this.setChoices(fieldQuestion, fieldChoices);
    this.setCellLabel(fieldQuestion, index === 0 ? owner.getLocalizationString("sortFieldAriaLabel") : owner.getLocalizationFormatString("sortLevelFieldAriaLabel", index + 1));

    const directionChoices: Array<any> = [{ value: noSortValue, text: owner.getLocalizationString("sortDefaultText"), visibleIf: noSortVisibleIf }];
    getSortDirectionItems(shown.dataType).forEach((item: ISortDirectionItem): void => {
      directionChoices.push({ value: item.direction, text: owner.getLocalizationString(item.locStringName) });
    });
    const directionQuestion = row.getQuestionByName(directionColumn);
    this.setChoices(directionQuestion, directionChoices);
    this.setCellLabel(directionQuestion, index === 0 ? owner.getLocalizationString("sortDirectionAriaLabel") : owner.getLocalizationFormatString("sortLevelDirectionAriaLabel", index + 1));
  }
  // Choices are set only when what they show changed, so an open list keeps its items.
  private setChoices(question: any, choices: Array<any>): void {
    if (!question) return;
    const current = JSON.stringify(question.choices.map((item: any): any => ({ value: item.value, text: item.text, visibleIf: item.visibleIf || undefined })));
    if (current !== JSON.stringify(choices)) {
      question.choices = choices;
    }
  }
  /* The accessible name of a cell's editor is its title, which the matrix computes as "row N, column C"; the
     dialog names it as the bar names a level's dropdown, and tells the renderers when the name changes. */
  private cellLabels: { [id: string]: string } = {};
  private setCellLabel(question: Question, label: string): void {
    if (!question || this.cellLabels[question.id] === label) return;
    const isNew = this.cellLabels[question.id] === undefined;
    this.cellLabels[question.id] = label;
    question.locTitle.onGetTextCallback = (): string => this.cellLabels[question.id];
    if (!isNew) {
      question.locTitle.strChanged();
    }
  }
  private updateFooter(): void {
    const owner = this.owner;
    if (!!this.popupViewModel && !this.popupViewModel.isDisposed) {
      this.popupViewModel.model.title = owner.getLocalizationString("sortByText");
    }
    if (!!this.addAction) {
      this.addAction.title = owner.getLocalizationString("sortAddNewText");
      this.addAction.enabled = this.canAddRow;
    }
    if (!!this.applyAction) {
      this.applyAction.title = owner.getLocalizationString("modalApplyButtonText");
      this.applyAction.enabled = this.canApply;
    }
  }
  private getFreeField(): IRecordsSortField {
    const levels = this.getLevels();
    return this.owner.sortFields.filter((item: IRecordsSortField): boolean => !levels.some((level: ISortDialogLevel): boolean => level.field === item.field))[0];
  }
  private isFocusIdle(): boolean {
    const active = getActiveElement();
    return !active || active === active.ownerDocument.body;
  }
  // Is the focus in the dialog's survey, or on nothing (<body>)? A removed row takes its focused button with it.
  private isFocusInsideOrIdle(): boolean {
    const active = getActiveElement();
    if (this.isFocusIdle()) return true;
    const root = !!this.surveyValue ? this.surveyValue.rootElement : undefined;
    return !!root && root.contains(active);
  }
  // The field of a row, rendered later (an add renders the table again), while canMove says the focus may still move.
  private focusField(index: number, canMove: () => boolean): void {
    const question = this.getCellQuestion(index, fieldColumn);
    if (!question) return;
    const id = question.inputId;
    focusElement((): HTMLElement => {
      const root = !!this.surveyValue ? this.surveyValue.rootElement : undefined;
      return !!root && canMove() ? root.querySelector("#" + id) : null;
    }, true);
  }
}

/* Opens the dialog in a modal through settings.showDialog, which each renderer sets. The modal is placed
   under the survey's root element, so a survey in a shadow root shows it with its styles, and the dialog's
   survey inherits the theme variables of the survey it is shown under. onClosed runs once the modal has hidden,
   whatever closed it: Apply, the close button, Esc or the bar. */
export function showRecordsSortDialog(dialog: RecordsSortDialogModel, owner: IRecordsSortBarOwner, onClosed: () => void): PopupBaseViewModel {
  if (!settings.showDialog) return undefined;
  const survey = dialog.survey;
  const popupViewModel: PopupBaseViewModel = settings.showDialog(<IDialogOptions>{
    componentName: "survey",
    data: { model: survey, survey: survey },
    title: owner.getLocalizationString("sortByText"),
    showCloseButton: true,
    displayMode: "popup",
    isFocusedContent: true,
    onApply: (): boolean => dialog.apply(),
    onCancel: (): void => { },
    onHide: (): void => { onClosed(); },
    cssClass: "sv-popup--records-sort"
  }, owner.getRootElement());
  if (!!popupViewModel) {
    dialog.attach(popupViewModel);
  }
  return popupViewModel;
}
