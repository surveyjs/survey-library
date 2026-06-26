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

export interface IElementUIState {
  collapsed?: boolean;
  activePanelIndex?: number; // For Dynamic panel only, current Tab index
  shown?: boolean; // For Page only, indicates that the respondent has already seen the page (progress state)
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
