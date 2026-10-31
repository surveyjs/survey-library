import { toCssClasses } from "./cssClassBuilder";

// Table rendering logic shared by the single-select matrix and the dropdown matrices.
// Internal: not exported from entries.

export function isMatrixColumnsAutoWidth(isMobile: boolean, columns: Array<any>): boolean {
  return !isMobile && !columns.some(col => !!col.width);
}
export function getMatrixTableCss(cssClasses: any, columnsAutoWidth: boolean, showHeader: boolean, verticalAlign: string): string {
  return toCssClasses(
    cssClasses.root,
    columnsAutoWidth && cssClasses.columnsAutoWidth,
    !showHeader && cssClasses.noHeader,
    verticalAlign === "top" && cssClasses.rootVerticalAlignTop,
    verticalAlign === "middle" && cssClasses.rootVerticalAlignMiddle
  );
}
export function getMatrixTableBodyCss(cssClasses: any, alternateRows: boolean, isMobile: boolean): string {
  return toCssClasses(cssClasses.body, alternateRows && !isMobile && cssClasses.bodyAlternativeRows);
}
export function getMatrixTableWrapperCss(cssClasses: any, titleLocation: string): string {
  return toCssClasses(cssClasses.tableWrapper, titleLocation == "left" && cssClasses.tableWrapperLeft);
}
export function getMatrixCellAriaLabel(rowString: string, columnString: string, row: any, column: any, directRowTitle?: string): string {
  let rowTitle: string = row.locText && row.locText.renderedHtml ? row.locText.renderedHtml : "";
  if (directRowTitle) rowTitle = directRowTitle;
  const columnTitle: string = column.locTitle && column.locTitle.renderedHtml ? column.locTitle.renderedHtml : "";
  const rowLabel: string = (rowString || "row").toLocaleLowerCase();
  const columnLabel: string = (columnString || "column").toLocaleLowerCase();
  return `${rowLabel} ${rowTitle}, ${columnLabel} ${columnTitle}`;
}
