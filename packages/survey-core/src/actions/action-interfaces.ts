import { LocalizableString } from "../localizablestring";
import { ComputedUpdater } from "../base";

export type actionModeType = "large" | "small" | "popup" | "removed";

/**
 * An action item.
 *
 * Action items are used in the Toolbar, matrix rows, titles of pages, panels, questions, and other survey elements.
 *
 * [View Demo](https://surveyjs.io/form-library/examples/add-custom-navigation-button/ (linkStyle))
 */
export interface IAction {
  /**
   * A unique action item identifier.
   *
   * [View Demo](https://surveyjs.io/form-library/examples/add-custom-navigation-button/ (linkStyle))
   */
  id?: string;
  /**
   * Specifies the action item's visibility.
   * @see enabled
   * @see active
   */
  visible?: boolean | ComputedUpdater<boolean>;
  /**
   * The action item's title.
   *
   * [View Demo](https://surveyjs.io/form-library/examples/add-custom-navigation-button/ (linkStyle))
   * @see showTitle
   * @see disableShrink
   */
  title?: string;
  titles?: { [locale: string]: string };
  locTitle?: LocalizableString;
  locTitleName?: string;
  /**
   * The action item's tooltip.
   */
  tooltip?: string;
  locTooltipName?: string;
  /**
   * Specifies whether users can interact with the action item.
   * @see active
   * @see visible
   */
  enabled?: boolean | ComputedUpdater<boolean>;
  enabledIf?: () => boolean;
  /**
   * Specifies the visibility of the action item's title.
   * @see title
   * @see disableShrink
   */
  showTitle?: boolean;
  /**
   * A function that is executed when users click the action item.
   *
   * [View Demo](https://surveyjs.io/form-library/examples/add-custom-navigation-button/ (linkStyle))
   */
  action?: (context?: any) => void;
  onFocus?: (isMouse: boolean, event: any) => void;
  /**
   * One or several CSS classes that you want to apply to the outer `<div>` element.
   *
   * In the markup, an action item is rendered as an `<input>` or `<button>` wrapped in a `<div>`. The `css` property applies classes to the `<div>` element.
   *
   * To apply several classes, separate them with a space character: `"myclass1 myclass2"`.
   *
   * [View Demo](https://surveyjs.io/form-library/examples/add-custom-navigation-button/ (linkStyle))
   * @see innerCss
   */
  css?: string;
  /**
   * One or several CSS classes that you want to apply to the inner `<input>` or `<button>` element.
   *
   * In the markup, an action item is rendered as an `<input>` or `<button>` wrapped in a `<div>`. The `innerCss` property applies classes to the `<input>`/`<button>` element.
   *
   * To apply several classes, separate them with a space character: `"myclass1 myclass2"`.
   *
   * [View Demo](https://surveyjs.io/form-library/examples/add-custom-navigation-button/ (linkStyle))
   * @see css
   */
  innerCss?: string;
  /**
   * The action item's data object. Use it to pass required data to a custom template or component.
   */
  data?: any;
  popupModel?: any; //TODO: temp, use data instead
  needSeparator?: boolean; //TODO: temp
  /**
   * Specifies whether the action item is active.
   *
   * Use this property as a flag to specify different action item appearances in different states.
   * @see enabled
   * @see visible
   */
  active?: boolean;
  pressed?: boolean;
  /**
   * Specifies the name of a template used to render the action item.
   * @see component
   */
  template?: string;
  /**
   * Specifies the name of a component used to render the action item.
   */
  component?: string;
  /**
   * The action item's icon name.
   * @see iconSize
   */
  iconName?: string;
  /**
   * The action item's icon size in pixels.
   * @see iconName
   */
  iconSize?: number | string;
  /**
   * The action item's location in a matrix question's row.
   *
   * The following values are available:
   *
   * - `"start"` - The action item is located at the beginning of the row.
   * - `"end"` - The action is located at the end of the row.
   */
  location?: string;
  /**
   * Set this property to `true` if you want to disable keyboard navigation for the action item (sets the `tabIndex` attribute to -1).
   */
  disableTabStop?: boolean;

  /**
   * Set this property to `true` if you want the item's `title` to be always visible.
   * If you set it to `false`, the `title` hides when the screen space is limited, and the item displays only the icon.
   * @see title
   * @see iconName
   */
  disableShrink?: boolean;
  disableHide?: boolean;
  mode?: actionModeType;
  /**
   * A number that specifies the action's position relative to other actions.
   *
   * [View Demo](https://surveyjs.io/form-library/examples/add-custom-navigation-button/ (linkStyle))
   */
  visibleIndex?: number;
  needSpace?: boolean;
  ariaChecked?: boolean;
  ariaExpanded?: boolean;
  ariaLabelledBy?: string;
  ariaRole?: string;
  elementId?: string;
  items?: Array<IAction>;
  markerIconName?: string;
  showPopup?: () => void;
  hidePopup?: () => void;
}