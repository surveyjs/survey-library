import type { Base } from "../base";
import type { IPage, IQuestion, ISurveyElement } from "../base-interfaces";

export interface IScrollElementToTopOptions {
  element: ISurveyElement;
  question: IQuestion;
  page?: IPage;
  id: string;
  scrollIfVisible?: boolean;
  scrollIntoViewOptions?: ScrollIntoViewOptions;
  passedRootElement?: HTMLElement;
  onScolledCallback?: () => void;
}

// One row of a Filter Control's own conditions (as opposed to a preset FilterPreset's expression
// text): a field, an operator and the value the operator needs. field is the field's valueName,
// the same key the built expression names the field by ({valueName} operator value).
export interface IFilterCondition {
  field: string;
  operator: string;
  value?: any;
}
// The state of a Filter Control that the Filters dialog edits and applies as one: the preset it has
// on while it is as it was (conditions undefined - the preset's own text applies), or the conditions
// that apply instead, and the search text.
export interface IFilterState {
  selectedPreset: string;
  conditions?: Array<IFilterCondition>;
  // The control's own filter as a text the fields cannot show (applyFilter); conditions is undefined then.
  expression?: string;
  searchString: string;
}
// One preset's change (Edit Preset's Apply or Delete), applied with any others as one change: deleted,
// or reset to what the JSON authored and then given a new title and filter - each optional. The
// filter is conditions, or expression for a preset edited as text.
export interface IFilterPresetEdit {
  name: string;
  title?: string;
  conditions?: Array<IFilterCondition>;
  expression?: string;
  isReset?: boolean;
  isDeleted?: boolean;
}
// A preset the respondent added, as uiState keeps it: its title and its expression.
export interface IFilterUserPresetState {
  name: string;
  title: string;
  expression: string;
  allowEdit?: boolean;
  allowDelete?: boolean;
  allowCopy?: boolean;
}
// The end-user state of a Filter Control. Only what the respondent changed is kept here: what the
// JSON authored is already in the JSON and is restored by loading it.
export interface IFilterElementUIState {
  // The name of the selected preset. "" means the respondent turned the default preset off, which is
  // not the same as "not stored" - the restore has to be able to say that.
  selectedPreset?: string;
  searchString?: string;
  searchFields?: Array<string>;
  // The respondent's own filter as text: the conditions of the fields, or a text applyFilter() took.
  // Stored only when there is one.
  expression?: string;
  // Authored presets the respondent changed, by name: what changed of one - its title, its expression,
  // its permissions (Edit Preset, updatePreset()).
  presets?: { [name: string]: IFilterSavedPresetState };
  // The presets the respondent added, in their order.
  userPresets?: Array<IFilterUserPresetState>;
  // The authored presets the respondent deleted, by name.
  deletedPresets?: Array<string>;
}
// An authored preset the respondent changed, as uiState keeps it - see IFilterElementUIState.presets.
export interface IFilterSavedPresetState {
  expression?: string;
  title?: string;
  allowEdit?: boolean;
  allowDelete?: boolean;
  allowCopy?: boolean;
}
export interface IElementUIState {
  collapsed?: boolean;
  activePanelIndex?: number; // For Dynamic panel only, current Tab index
  // MERGE(V3): keep `shown`; master (V2) names this progress flag `passed`. Keep V3 on merge.
  // Keep the `filter` member below on merge too.
  shown?: boolean; // For Page only, indicates that the respondent has already seen the page (progress state)
  filter?: IFilterElementUIState; // For the Filter Control only
}
export interface ISurveyUIState {
  pages?: { [key:string]: IElementUIState };
  panels?: { [key:string]: IElementUIState };
  questions?: { [key:string]: IElementUIState };
  activeElementName?: string;
  currentPageName?: string;
  randomSeed?: number;
}

export interface IWrapperObject {
  getOriginalObj(): Base;
  getClassNameProperty(): string;
}

export type ISurveyEnvironment = {
  root: Document | ShadowRoot,
  rootElement: HTMLElement | ShadowRoot,
  popupMountContainer: HTMLElement | string,
  svgMountContainer: HTMLElement | string,
  stylesSheetsMountContainer: HTMLElement,
}

export type LayoutElementContainer = "header" | "footer" | "left" | "right" | "contentTop" | "contentBottom" | "center";
export type HorizontalAlignment = "left" | "center" | "right";
export type VerticalAlignment = "top" | "middle" | "bottom";

export interface ISurveyLayoutElement {
  id: string;
  container?: LayoutElementContainer | Array<LayoutElementContainer>;
  isInContainer?: (container: LayoutElementContainer) => boolean;
  component: string;
  data?: any;
  index?: number;
  getData?: () => any;
  processResponsiveness?: (width: number) => void;
}

// A part of a container: one element on its own, or neighbouring elements of the same
// group that are rendered inside one wrapper with the group's css class.
export interface ISurveyLayoutElementGroup {
  key: string;
  name?: string;
  css?: string;
  elements: Array<ISurveyLayoutElement>;
}

export interface ILayoutElementModel {
  createLayoutElements(): Array<ISurveyLayoutElement>;
}

export interface IDropdownMenuOptions {
  menuType: "dropdown" | "popup" | "overlay";
  deviceType: "mobile" | "tablet" | "desktop";
  hasTouchScreen: boolean;
  screenHeight: number;
  screenWidth: number;
}
