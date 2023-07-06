export type ImageFit = "auto" | "contain" |"cover";
export type ImagePosition = "fixed" | "scroll";

export interface ITheme {
  cssVariables?: {[index: string]: string};
  backgroundImage?: string;
  backgroundImageFit?: ImageFit;
  backgroundImagePosition?: ImagePosition;
  backgroundOpacity?: number;
  isCompact?: boolean;
}
