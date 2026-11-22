// The dataNesting modes that nest a container without a valueName under its name, and the container
// kinds each applies to ("Nest Every Panel or Page" in docs/design-survey-nested-data.md).
const byNameModes: { [mode: string]: Array<string> } = {
  panel: ["panel"],
  page: ["page"],
  panelAndPage: ["panel", "page"]
};
// The dataNesting rule: the key a container of kind stores its elements' values under, or "" when it does not
// nest. The kind: "panel" or "page" on the survey's data; "record" for a panel inside a record or a records
// template; "" for a container that never nests (the single-page container, a record panel or a template itself,
// a composite's content panel and the panels in it).
//   "none": never; "auto" (and an unknown mode): under valueName;
//   "panel" / "page" / "panelAndPage": under valueName, else name for the containers of that kind.
// No by-name mode lists "record", so a panel inside a record nests under valueName only. Where a container is
// decides the kind: ContainerDataNesting.getKeyAt for the runtime, and the linter's walker asks with the same kinds.
export function getDataNestingKey(dataNesting: string, kind: string, valueName: string, name: string): string {
  if (dataNesting === "none" || !kind) return "";
  if (!!valueName) return valueName;
  const kinds = byNameModes[dataNesting];
  return !!kinds && kinds.indexOf(kind) > -1 ? name || "" : "";
}
