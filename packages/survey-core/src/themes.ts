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
   * An object with [advanced survey header settings](https://surveyjs.io/form-library/documentation/api-reference/iheader). Applies when the [`headerView`](https://surveyjs.io/form-library/documentation/api-reference/itheme#headerView) property is set to `"advanced"`.
   */
  header?: IHeader;
  /**
   * Specifies whether the survey header uses only basic appearance settings or applies advanced settings from the survey theme.
   *
   * Possible values:
   *
   * - `"basic"` (default)\
   * A basic header view applies only the [`title`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#title), [`description`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#description), and logo-related properties ([`logo`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#logo), [`logoPosition`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#logoPosition), etc.).
   *
   * - `"advanced"`\
   * An advanced header view applies the same properties as the basic view, plus [header settings](https://surveyjs.io/form-library/documentation/api-reference/iheader) from the [survey theme](https://surveyjs.io/form-library/documentation/api-reference/itheme#header). The advanced view features a more flexible header layout, a capability to specify a background image, and other settings that give a more professional look to the survey header.
   *
   * [View Demo](https://surveyjs.io/form-library/examples/brand-your-survey-header/ (linkStyle))
   */
  headerView?: "advanced" | "basic";
  /**
   * An object with CSS variables.
   */
  cssVariables?: { [index: string]: string };
}

/**
 * A survey header configuration interface.
 *
 * An `IHeader` object configures advanced survey header appearance settings. To apply them, you need to assign the object to the [`header`](https://surveyjs.io/form-library/documentation/api-reference/itheme#header) property of your theme configuration and set the [`headerView`](https://surveyjs.io/form-library/documentation/api-reference/itheme#headerView) property to `"advanced"`.
 */
export interface IHeader {
  /**
   * The height of the survey header in pixels.
   *
   * Default value: 256
   */
  height?: number;
  /**
   * The height of the survey header on smartphones, measured in pixels.
   *
   * Default value: 0 (the height is calculated automatically to accommodate the header's content).
   */
  mobileHeight?: number;
  /**
   * A string value that specifies whether the header spans the width of the survey or that of the survey container.
   *
   * Possible values:
   *
   * - `"survey"`\
   * The header width is the same as the survey width.
   * - `"container"` (default)\
   * The header width is the same as the survey container width.
   *
   * @see [SurveyModel.width](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#width)
   * @see [SurveyModel.widthMode](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#widthMode)
   */
  inheritWidthFrom?: "survey" | "container";
  /**
   * The width of the header area that contains the survey [title](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#title) and [description](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#description), measured in pixels.
   *
   * Default value: 512
   */
  textAreaWidth?: number;

  // textGlowEnabled: boolean;

  /**
   * A Boolean value that specifies whether the header overlaps the survey content.
   *
   * Default value: `false`
   */
  overlapEnabled?: boolean;
  /**
   * An image to display in the background of the header. Accepts a base64 or URL string value.
   */
  backgroundImage?: string;
  /**
   * A value from 0 to 1 that specifies how transparent the [background image](#backgroundImage) should be: 0 makes the image completely transparent, and 1 makes it opaque.
   */
  backgroundImageOpacity?: number;
  /**
   * A string value that specifies how to resize a [background image](#backgroundImage) to fit it into the header.
   *
   * Possible values:
   *
   * - `"cover"` (default)\
   * Scales the image to the smallest possible size that fills the header. The image preserves its aspect ratio but can be cropped if the header's proportions differ from that of the element.
   * - `"fill"`\
   * Stretches the image to fill the entire header.
   * - `"contain"`\
   * Scales the image to the largest possible size without cropping or stretching it.
   * - `"tile"`\
   * Tiles as many copies of the image as needed to fill the entire header.
   */
  backgroundImageFit?: "cover" | "fill" | "contain" | "tile";
  /**
   * A string value that specifies the logo position within the header in the horizontal direction.
   *
   * Possible values:
   *
   * - `"right"` (default)
   * - `"left"`
   * - `"center"`
   *
   * To specify a logo, set `SurveyModel`'s [`logo`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#logo) property.
   */
  logoPositionX?: HorizontalAlignment;
  /**
   * A string value that specifies the logo position within the header in the vertical direction.
   *
   * Possible values:
   *
   * - `"top"` (default)
   * - `"bottom"`
   * - `"middle"`
   *
   * To specify a logo, set `SurveyModel`'s [`logo`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#logo) property.
   */
  logoPositionY?: VerticalAlignment;
  /**
   * A string value that specifies the survey title position within the header in the horizontal direction.
   *
   * Possible values:
   *
   * - `"left"` (default)
   * - `"right"`
   * - `"center"`
   *
   * To specify a survey title, set `SurveyModel`'s [`title`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#title) property.
   */
  titlePositionX?: HorizontalAlignment;
  /**
   * A string value that specifies the survey title position within the header in the vertical direction.
   *
   * Possible values:
   *
   * - `"bottom"` (default)
   * - `"top"`
   * - `"middle"`
   *
   * To specify a survey title, set `SurveyModel`'s [`title`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#title) property.
   */
  titlePositionY?: VerticalAlignment;
  /**
   * A string value that specifies the survey description position within the header in the horizontal direction.
   *
   * Possible values:
   *
   * - `"left"` (default)
   * - `"right"`
   * - `"center"`
   *
   * To specify a survey description, set `SurveyModel`'s [`description`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#description) property.
   */
  descriptionPositionX?: HorizontalAlignment;
  /**
   * A string value that specifies the survey description position within the header in the vertical direction.
   *
   * Possible values:
   *
   * - `"bottom"` (default)
   * - `"top"`
   * - `"middle"`
   *
   * To specify a survey description, set `SurveyModel`'s [`description`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#description) property.
   */
  descriptionPositionY?: VerticalAlignment;
}