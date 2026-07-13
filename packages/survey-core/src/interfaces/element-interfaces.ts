import type { HashTable } from "../helpers";
import type { LocalizableString } from "../localizablestring";
import type { AdaptiveActionContainer } from "../actions/adaptive-container";
import type { PanelLayoutColumnModel } from "../panel-layout-column";
import type { ISurveyImpl } from "./survey-interfaces";
import type { ISurveyErrorOwner } from "./validation-interfaces";
import type { IElementUIState } from "./ui-interfaces";

export interface IConditionRunner {
  runCondition(properties: HashTable<any>): any;
}
export interface IShortcutText {
  shortcutText: string;
}
export interface ISurveyElement extends IShortcutText {
  name: string;
  isVisible: boolean;
  isReadOnly: boolean;
  isPage: boolean;
  isPanel: boolean;
  isQuestion: boolean;
  containsErrors: boolean;
  parent: IPanel;
  skeletonComponentName: string;
  setSurveyImpl(value: ISurveyImpl, isLight?: boolean): any;
  onSurveyLoad(): any;
  onFirstRendering(): any;
  getType(): string;
  setVisibleIndex(value: number): number;
  locStrsChanged(): any;
  delete(doDispose?: boolean): void;
  toggleState(): void;
  stateChangedCallback(): void;
  getTitleToolbar(): AdaptiveActionContainer;
  isCollapsed: boolean;
  isExpanded: boolean;
  expand(): void;
  collapse(): void;
  uiState: IElementUIState;
}
export interface IElement extends IConditionRunner, ISurveyElement {
  visible: boolean;
  renderWidth: string;
  width: string;
  isExpanded: boolean;
  isCollapsed: boolean;
  rightIndent: number;
  startWithNewLine: boolean;
  colSpan?: number;
  registerPropertyChangedHandlers(propertyNames: Array<string>, handler: any, key: string): void;
  registerFunctionOnPropertyValueChanged(name: string, func: any, key: string): void;
  unRegisterFunctionOnPropertyValueChanged(name: string, key: string): void;
  getPanels(): Array<IPanel>;
  getLayoutType(): string;
  isLayoutTypeSupported(layoutType: string): boolean;
  removeElement(el: IElement): boolean;
  onAnyValueChanged(name: string, questionName: string): void;
  updateCustomWidgets(): any;
  clearIncorrectValues(): any;
  clearErrors(): any;
  dispose(): void;
  needResponsiveWidth(): boolean;
  updateRootStyle(): void;
  updateElementVisibility(): void;
  ensureRowsVisibility(): void;
}

export interface IQuestion extends IElement, ISurveyErrorOwner {
  hasTitle: boolean;
  isEmpty(): boolean;
  onSurveyValueChanged(newValue: any): any;
  updateValueFromSurvey(newValue: any, clearData: boolean): void;
  updateCommentFromSurvey(newValue: any): any;
  supportAutoAdvance(): boolean;
  clearUnusedValues(): any;
  getDisplayValue(keysAsText: boolean, value: any): any;
  getValueName(): string;
  clearValue(): any;
  clearValueIfInvisible(): any;
  isAnswerCorrect(): boolean;
  updateValueWithDefaults(): any;
  getQuestionFromArray(name: string, index: number): IQuestion;
  value: any;
  survey: any;
}
export interface IParentElement {
  addElement(element: IElement, index: number): any;
  removeElement(element: IElement): boolean;
  isReadOnly: boolean;
}

export interface IPanel extends ISurveyElement, IParentElement {
  getChildrenLayoutType(): string;
  getQuestionTitleLocation(): string;
  getQuestionTitleWidth(): string;
  getQuestionStartIndex(): string;
  getQuestionErrorLocation(): string;
  getColumsForElement(el: IElement): Array<PanelLayoutColumnModel>;
  updateColumns(): void;
  parent: IPanel;
  elementWidthChanged(el: IElement): any;
  indexOf(el: IElement): number;
  elements: Array<IElement>;
  ensureRowsVisibility(): void;
  validateContainerOnly(): void;
}
export interface IPage extends IPanel, IConditionRunner {
  isStartPage: boolean;
}
export interface ITitleOwner {
  name: string;
  no: string;
  requiredMark: string;
  cssTitleNumber: string;
  cssRequiredMark?: string;
  isRequireTextOnStart: boolean;
  isRequireTextBeforeTitle: boolean;
  isRequireTextAfterTitle: boolean;
  locTitle: LocalizableString;
  locRenderedTitle: LocalizableString;
}
export interface IProgressInfo {
  questionCount: number;
  answeredQuestionCount: number;
  requiredQuestionCount: number;
  requiredAnsweredQuestionCount: number;
}
