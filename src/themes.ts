export type ImageFit = "auto" | "contain" |"cover";
export type ImageAttachment = "fixed" | "scroll";

export interface ITheme {
  cssVariables?: {[index: string]: string};
  backgroundImage?: string;
  backgroundImageFit?: ImageFit;
  backgroundImageAttachment?: ImageAttachment;
  backgroundOpacity?: number;
  isCompact?: boolean;
}
