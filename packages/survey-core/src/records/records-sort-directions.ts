import { DynamicDataFieldType, SortDirection } from "../dynamic-data/dynamic-data-interfaces";

// A direction a field can be sorted in, and the name of the localization string that labels it.
export interface ISortDirectionItem {
  direction: SortDirection;
  locStringName: string;
}

/* The two directions a field of this data type is sorted in, in the order a respondent meets them: a
   number and a date start with the largest or the newest value, everything else - a string, a boolean,
   a field of unknown type - alphabetically. A header click and the sort bar read the same order. */
export function getSortDirectionItems(dataType: DynamicDataFieldType): Array<ISortDirectionItem> {
  if (dataType === "number") {
    return [{ direction: "desc", locStringName: "sortHighLowText" }, { direction: "asc", locStringName: "sortLowHighText" }];
  }
  if (dataType === "date") {
    return [{ direction: "desc", locStringName: "sortNewestFirstText" }, { direction: "asc", locStringName: "sortOldestFirstText" }];
  }
  return [{ direction: "asc", locStringName: "sortAZText" }, { direction: "desc", locStringName: "sortZAText" }];
}
// The direction the first click on a field applies.
export function getFirstSortDirection(dataType: DynamicDataFieldType): SortDirection {
  return getSortDirectionItems(dataType)[0].direction;
}
export function getSortDirectionLocStringName(dataType: DynamicDataFieldType, direction: SortDirection): string {
  const item = getSortDirectionItems(dataType).filter((item: ISortDirectionItem): boolean => item.direction === direction)[0];
  return !!item ? item.locStringName : undefined;
}
