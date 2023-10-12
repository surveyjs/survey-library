import { HorizontalAlignment, VerticalAlignment } from "./base-interfaces";

export type ImageFit = "auto" | "contain" | "cover";
export type ImageAttachment = "fixed" | "scroll";

/**
 * A theme configuration interface.
 *
 * `ITheme` objects are used to apply predefined themes or create custom themes. Refer to the following help topic for more information:
 *
 * [Themes & Styles](https://surveyjs.io/form-library/documentation/manage-default-themes-and-styles (linkStyle))
 */
export interface ITheme {
  /**
   * A theme name.
   */
  themeName?: string;
  /**
   * A color palette.
   *
   * Possible values:
   *
   * - `"light"`
   * - `"dark"`
   */
  colorPalette?: string;
  /**
   * A Boolean value that specifies whether survey questions are displayed within panels (`false`) or without them (`true`).
   */
  isPanelless?: boolean;
  /**
   * An image to display as survey background. This property accepts a hyperlink or a data URL.
   */
  backgroundImage?: string;
  /**
   * A string value that specifies how to resize the [background image](#backgroundImage) to fit it into its container.
   *
   * Possible values:
   *
   * - `"auto"`
   * - `"contain"`
   * - `"cover"`
   *
   * Refer to the description of the [`background-size`](https://developer.mozilla.org/en-US/docs/Web/CSS/background-size#values) CSS property values on MDN for detailed information on the possible values.
   */
  backgroundImageFit?: ImageFit;
  /**
   * A string value that specifies whether the [background image](#backgroundImage) is fixed in its position or scrolled along with the survey.
   *
   * Possible values:
   *
   * - `"fixed"`
   * - `"scroll"`
   */
  backgroundImageAttachment?: ImageAttachment;
  /**
   * A value from 0 to 1 that specifies how transparent the [background image](#backgroundImage) should be: 0 makes the image completely transparent, and 1 makes it opaque.
   */
  backgroundOpacity?: number;
  /**
   * An object with survey header settings.
   */
  header?: IHeader;
  /**
   * An object with CSS variables.
   */
  cssVariables?: { [index: string]: string };
}

export interface IHeader {
  height: number;
  inheritWidthFrom: "survey" | "page";
  textAreaWidth: number;
  // textGlowEnabled: boolean;
  overlapEnabled: boolean;
  backgroundImage: string;
  backgroundImageOpacity: number;
  backgroundImageFit: "cover" | "fill" | "contain" | "tile";
  logoPositionX: HorizontalAlignment;
  logoPositionY: VerticalAlignment;
  titlePositionX: HorizontalAlignment;
  titlePositionY: VerticalAlignment;
  descriptionPositionX: HorizontalAlignment;
  descriptionPositionY: VerticalAlignment;
}