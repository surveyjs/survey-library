export interface IActionBarItem {
  /**
   * Unique string id
   */
  id: string;
  /**
   * Set this property to false to make the toolbar item invisible.
   */
  visible?: boolean;
  /**
   * Toolbar item title
   */
  title?: string;
  /**
   * Toolbar item tooltip
   */
  tooltip?: string;
  /**
   * Set this property to false to disable the toolbar item.
   */
  enabled?: boolean;
  /**
   * Set this property to false to hide the toolbar item title.
   */
  showTitle?: (() => boolean) | boolean;
  /**
   * A callback that calls on toolbar item click.
   */
  action?: (context?: any) => void;
  /**
   * Toolbar item css class
   */
  css?: string;
  /**
   * Toolbar inner element css class
   */
  innerCss?: string;
  /**
   * Toolbar item data object. Used as data for custom template or component rendering
   */
  data?: any;
  popupModel?: any; //TODO: temp, use data instead
  isActive?: boolean; //TODO: temp
  needSeparator?: boolean; //TODO: temp
  /**
   * Toolbar item template name
   */
  template?: string;
  /**
   * Toolbar item component name
   */
  component?: string;
  /**
   * Toolbar item icon name
   */
  iconName?: string;
  /**
   * Toolbar item child items. Can be used as contianer for options
   */
  items?: any;
}

/**
 * The toolbar item description.
 */
