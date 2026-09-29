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

// One row of a Filter Control's own conditions (as opposed to a preset FilterItem's expression
// text): a field, an operator and the value the operator needs. field is the field's valueName,
// the same key the built expression names the field by ({valueName} operator value).
export interface IFilterCondition {
  field: string;
  operator: string;
  value?: any;
}
// The end-user state of a Filter Control. Only what the respondent changed is kept here: what the
// JSON authored is already in the JSON and is restored by loading it.
export interface IFilterElementUIState {
  // The name of the applied item. "" means the respondent switched the default item off, which is
  // not the same as "not stored" - the restore has to be able to say that.
  activeItemName?: string;
  searchString?: string;
  searchFields?: Array<string>;
  // The respondent's unsaved edits - the full set, not a diff against the preset. Stored only when
  // there are any: over an active preset only when they change it ([] = its conditions were
  // cleared), with no preset only when not empty.
  conditions?: Array<IFilterCondition>;
  // Presets the respondent saved edits into, by name. Kept as conditions and not as expression
  // text: the preset's expression is rebuilt from them on restore, with nothing to parse back.
  items?: { [name: string]: { conditions: Array<IFilterCondition> } };
}
export interface IElementUIState {
  collapsed?: boolean;
  activePanelIndex?: number; // For Dynamic panel only, current Tab index
  // MERGE(V3): keep `shown`; master (V2) names this progress flag `passed`. Keep V3 on merge.
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
  component?: string;
  template?: string;
  data?: any;
  index?: number;
  getData?: () => any;
  processResponsiveness?: (width: number) => void;
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
