import { settings } from "../settings";
import { DomDocumentHelper } from "../global_variables_utils";

// old-name: new-name
export const renamedIcons: any = {
  "changecamera": "flip-24x24",
  "clear": "clear-24x24",
  "cancel": "cancel-24x24",
  "closecamera": "close-24x24",
  "defaultfile": "file-72x72",
  "choosefile": "folder-24x24",
  "file": "toolbox-file-24x24",
  "left": "chevronleft-16x16",
  "modernbooleancheckchecked": "plus-32x32",
  "modernbooleancheckunchecked": "minus-32x32",
  "more": "more-24x24",
  "navmenu_24x24": "navmenu-24x24",
  "removefile": "error-24x24",
  "takepicture": "camera-32x32",
  "takepicture_24x24": "camera-24x24",
  "v2check": "check-16x16",
  "checked": "check-16x16",
  "v2check_24x24": "check-24x24",
  "back-to-panel_16x16": "restoredown-16x16",
  "clear_16x16": "clear-16x16",
  "close_16x16": "close-16x16",
  "collapsedetail": "collapsedetails-16x16",
  "expanddetail": "expanddetails-16x16",
  "full-screen_16x16": "maximize-16x16",
  "loading": "loading-48x48",
  "minimize_16x16": "minimize-16x16",
  "next_16x16": "chevronright-16x16",
  "previous_16x16": "chevronleft-16x16",
  "no-image": "noimage-48x48",
  "ranking-dash": "rankingundefined-16x16",
  "drag-n-drop": "drag-24x24",
  "ranking-arrows": "reorder-24x24",
  "restore_16x16": "fullsize-16x16",
  "reset": "restore-24x24",
  "search": "search-24x24",
  "average": "smiley-rate5-24x24",
  "excellent": "smiley-rate9-24x24",
  "good": "smiley-rate7-24x24",
  "normal": "smiley-rate6-24x24",
  "not-good": "smiley-rate4-24x24",
  "perfect": "smiley-rate10-24x24",
  "poor": "smiley-rate3-24x24",
  "terrible": "smiley-rate1-24x24",
  "very-good": "smiley-rate8-24x24",
  "very-poor": "smiley-rate2-24x24",
  "add_16x16": "add-16x16",
  "add_24x24": "add-24x24",
  "alert_24x24": "warning-24x24",
  "apply": "apply-24x24",
  "arrow-down": "arrowdown-24x24",
  "arrow-left": "arrowleft-24x24",
  "arrow-left_16x16": "arrowleft-16x16",
  "arrowleft": "arrowleft-16x16",
  "arrow-right": "arrowright-24x24",
  "arrow-right_16x16": "arrowright-16x16",
  "arrowright": "arrowright-16x16",
  "arrow-up": "arrowup-24x24",
  "boolean": "toolbox-boolean-24x24",
  "change-question-type_16x16": "speechbubble-16x16",
  "checkbox": "toolbox-checkbox-24x24",
  "collapse-detail_16x16": "minusbox-16x16",
  "collapse-panel": "collapse-pg-24x24",
  "collapse_16x16": "collapse-16x16",
  "color-picker": "dropper-16x16",
  "comment": "toolbox-longtext-24x24",
  "config": "wrench-24x24",
  "copy": "copy-24x24",
  "default": "toolbox-customquestion-24x24",
  "delete_16x16": "delete-16x16",
  "delete_24x24": "delete-24x24",
  "delete": "delete-24x24",
  "description-hide": "hidehint-16x16",
  "description": "hint-16x16",
  "device-desktop": "desktop-24x24",
  "device-phone": "phone-24x24",
  "device-rotate": "rotate-24x24",
  "device-tablet": "tablet-24x24",
  "download": "download-24x24",
  "drag-area-indicator": "drag-24x24",
  "drag-area-indicator_24x16": "draghorizontal-24x16",
  "v2dragelement_16x16": "draghorizontal-24x16",
  "drop-down-arrow": "chevrondown-24x24",
  "drop-down-arrow_16x16": "chevrondown-16x16",
  "chevron_16x16": "chevrondown-16x16",
  "dropdown": "toolbox-dropdown-24x24",
  "duplicate_16x16": "copy-16x16",
  "edit": "edit-24x24",
  "edit_16x16": "edit-16x16",
  "editing-finish": "finishedit-24x24",
  "error": "error-16x16",
  "expand-detail_16x16": "plusbox-16x16",
  "expand-panel": "expand-pg-24x24",
  "expand_16x16": "expand-16x16",
  "expression": "toolbox-expression-24x24",
  "fast-entry": "textedit-24x24",
  "fix": "fix-24x24",
  "html": "toolbox-html-24x24",
  "image": "toolbox-image-24x24",
  "imagepicker": "toolbox-imagepicker-24x24",
  "import": "import-24x24",
  "invisible-items": "invisible-24x24",
  "language": "language-24x24",
  "load": "import-24x24",
  "logic-collapse": "collapse-24x24",
  "logic-expand": "expand-24x24",
  "logo": "image-48x48",
  "matrix": "toolbox-matrix-24x24",
  "matrixdropdown": "toolbox-multimatrix-24x24",
  "matrixdynamic": "toolbox-dynamicmatrix-24x24",
  "multipletext": "toolbox-multipletext-24x24",
  "panel": "toolbox-panel-24x24",
  "paneldynamic": "toolbox-dynamicpanel-24x24",
  "preview": "preview-24x24",
  "radiogroup": "toolbox-radiogroup-24x24",
  "ranking": "toolbox-ranking-24x24",
  "rating": "toolbox-rating-24x24",
  "slider": "toolbox-slider-24x24",
  "redo": "redo-24x24",
  "remove_16x16": "remove-16x16",
  "required": "required-16x16",
  "save": "save-24x24",
  "select-page": "selectpage-24x24",
  "settings": "settings-24x24",
  "settings_16x16": "settings-16x16",
  "signaturepad": "toolbox-signature-24x24",
  "switch-active_16x16": "switchon-16x16",
  "switch-inactive_16x16": "switchoff-16x16",
  "tagbox": "toolbox-tagbox-24x24",
  "text": "toolbox-singleline-24x24",
  "theme": "theme-24x24",
  "toolbox": "toolbox-24x24",
  "undo": "undo-24x24",
  "visible": "visible-24x24",
  "wizard": "wand-24x24",
  "searchclear": "clear-16x16",
  "chevron-16x16": "chevrondown-16x16",
  "chevron": "chevrondown-24x24",
  "progressbuttonv2": "arrowleft-16x16",
  "right": "chevronright-16x16",
  "add-lg": "add-24x24",
  "add": "add-24x24",
};

export function getNewIconName(iconName: string): string {
  const prefix = "icon-";
  const nameWithoutPrefix = iconName.replace(prefix, "");
  const result = renamedIcons[nameWithoutPrefix] || nameWithoutPrefix;
  return prefix + result;
}

export function getCustomNewIconNameIfExists(iconName: string): string {
  let result = (<any>settings.customIcons)[iconName];
  if (result) return getNewIconName(result);

  iconName = getNewIconName(iconName);
  result = (<any>settings.customIcons)[iconName];
  if (result) return result;

  return null;
}

export function createSvg(
  size: number | string,
  width: number,
  height: number,
  iconName: string,
  svgElem: any,
  title: string,
): void {
  if (!svgElem) return;
  if (size !== "auto") {
    svgElem.style.width = (size || width || 16) + "px";
    svgElem.style.height = (size || height || 16) + "px";
  }
  const node: any = svgElem.childNodes[0];
  const realIconName = getIconNameFromProxy(iconName);
  node.setAttributeNS(
    "http://www.w3.org/1999/xlink",
    "xlink:href",
    "#" + realIconName
  );

  let titleElement = svgElem.getElementsByTagName("title")[0];
  if (!title) {
    if (!!titleElement) {
      svgElem.removeChild(titleElement);
    }
    return;
  } else {
    if (!titleElement) {
      titleElement = DomDocumentHelper.getDocument().createElementNS("http://www.w3.org/2000/svg", "title");
      svgElem.appendChild(titleElement);
    }
  }
  titleElement.textContent = title;
}

export function getIconNameFromProxy(iconName: string): string {
  const customIconName = getCustomNewIconNameIfExists(iconName);
  return customIconName || getNewIconName(iconName);
}
