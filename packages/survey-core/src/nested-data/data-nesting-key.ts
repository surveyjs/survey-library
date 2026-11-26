// The dataNesting modes that nest a container without a valueName under its name, and the container
// kinds each applies to ("Nest Every Panel or Page" in docs/design-survey-nested-data.md).
const byNameModes: { [mode: string]: Array<string> } = {
  panel: ["panel"],
  page: ["page"],
  panelAndPage: ["panel", "page"]
};
// kind: "panel" or "page" on the survey's data; "record" inside a record or a records template, which no by-name
// mode lists, so it nests under valueName only; "" for a container that never nests.
export function getDataNestingKey(dataNesting: string, kind: string, valueName: string, name: string): string {
  if (dataNesting === "none" || !kind) return "";
  if (!!valueName) return valueName;
  const kinds = byNameModes[dataNesting];
  return !!kinds && kinds.indexOf(kind) > -1 ? name || "" : "";
}
