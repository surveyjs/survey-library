export interface IActionBarItem {
  /**
   * Unique string id
   */
  id: string;
  /**
   * Set this property to false to make the toolbar item invisible.
   */
  visible?: any;
  /**
   * Toolbar item title
   */
  title?: any;
  /**
   * Toolbar item tooltip
   */
  tooltip?: any;
  /**
   * Set this property to false to disable the toolbar item.
   */
  enabled?: any;
  /**
   * Set this property to false to hide the toolbar item title.
   */
  showTitle?: any;
  /**
   * A callback that calls on toolbar item click.
   */
  action?: (context?: any) => void;
  /**
   * Toolbar item css class
   */
  css?: any;
  /**
   * Toolbar inner element css class
   */
  innerCss?: any;
  /**
   * Toolbar item data object. Used as data for custom template or component rendering
   */
  data?: any;
  popupModel?: any; //TODO: temp, use data insted
  isActive?: any; //TODO: temp
  needSeparator?: any; //TODO: temp
  /**
   * Toolbar item template name
   */
  template?: string;
  /**
   * Toolbar item component name
   */
  component?: any;
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
