import { IDynamicDataSort } from "./dynamic-data-interfaces";

/* The text form of a sort - what the questions serialize as "sortBy" and what a Creator editor, the
   tester and the linter read. `field[+|-]` tokens separated by ";", in priority order:

     "price-;name"  ->  price descending, then name ascending
     "name+"        ->  name ascending
     ""             ->  no sort

   The direction is a one-character suffix and not a word on purpose: question and column names may
   contain spaces, so "total price desc" is ambiguous and "total price-" is not. Only the LAST
   character of a token is read as the marker, so a field with a "-" or a "+" inside (net-price)
   needs no escaping, and a field that itself ends with a marker round-trips because the writer
   spells its ascending direction out ("a-" ascending is written "a-+").
   ";" is the only separator: every accepted separator is one more character a field name cannot
   contain, and a column named "Last, First" is likelier than a user who types a comma here. A field
   that contains ";" cannot be represented - it is written as it is, and it does not parse back. */

export function parseDynamicDataSort(text: string): Array<IDynamicDataSort> {
  const res: Array<IDynamicDataSort> = [];
  if (typeof text !== "string" || !text) return res;
  text.split(";").forEach((token: string): void => {
    const trimmed = token.trim();
    if (!trimmed) return;
    const marker = trimmed[trimmed.length - 1];
    const hasMarker = marker === "+" || marker === "-";
    const field = (hasMarker ? trimmed.substring(0, trimmed.length - 1) : trimmed).trim();
    // A token that is only a marker names no field, and a field that is already in the sort keeps
    // the priority of its first occurrence: it is the primary key either way.
    if (!field || res.some((item: IDynamicDataSort): boolean => item.field === field)) return;
    res.push({ field: field, direction: hasMarker && marker === "-" ? "desc" : "asc" });
  });
  return res;
}

export function dynamicDataSortToString(sort: Array<IDynamicDataSort>): string {
  if (!Array.isArray(sort)) return "";
  const parts: Array<string> = [];
  sort.forEach((item: IDynamicDataSort): void => {
    const field = !!item && typeof item.field === "string" ? item.field : "";
    if (!field) return;
    if (item.direction === "desc") {
      parts.push(field + "-");
      return;
    }
    const last = field[field.length - 1];
    parts.push(last === "+" || last === "-" ? field + "+" : field);
  });
  return parts.join(";");
}
