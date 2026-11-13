// The dataNesting modes that nest a container without a valueName under its name, and the container
// kinds each applies to ("Nest Every Panel or Page" in docs/design-survey-nested-data.md).
const byNameModes: { [mode: string]: Array<string> } = {
  panel: ["panel"],
  page: ["page"],
  panelAndPage: ["panel", "page"]
};
// The dataNesting rule on the survey's data: the key a container of kind ("panel" or "page"; "" for one that
// never nests, the single-page container) stores its elements' values under, or "" when it does not nest.
//   "none": never; "auto" (and an unknown mode): under valueName;
//   "panel" / "page" / "panelAndPage": under valueName, else name for the containers of that kind.
// A kind no by-name mode lists ("record": the linter asks it for a panel inside a record) nests under valueName
// only. Where a container is decides the kind: ContainerDataNesting.
export function getDataNestingKey(dataNesting: string, kind: string, valueName: string, name: string): string {
  if (dataNesting === "none" || !kind) return "";
  if (!!valueName) return valueName;
  const kinds = byNameModes[dataNesting];
  return !!kinds && kinds.indexOf(kind) > -1 ? name || "" : "";
}
