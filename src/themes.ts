export type ImageFit = "auto" | "contain" | "cover";
export type ImageAttachment = "fixed" | "scroll";

export interface ITheme {
  themeName?: string;
  colorPalette?: string;
  isPanelless?: boolean;
  backgroundImage?: string;
  backgroundImageFit?: ImageFit;
  backgroundImageAttachment?: ImageAttachment;
  backgroundOpacity?: number;
  cover?: {[index: string]: any};
  cssVariables?: { [index: string]: string };
}
