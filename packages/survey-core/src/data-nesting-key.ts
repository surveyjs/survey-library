import type { IPanel } from "./base-interfaces";
import type { Question } from "./question";

// Where a container is for nested data, found by ContainerDataNesting.getPlace:
//   "survey": on the survey's data (or in a nesting container on it); the dataNesting table applies (N3);
//   "record": a panel inside a dynamic panel's or a matrix detail panel's record, at any depth: it nests under
//   its valueName only, and "none" switches it off (RN3);
//   "template": a panel inside such a record's template (the designer's dynamic panel template, a matrix's
//   detail panel template): it never nests there, its valueName applies to the records built from it;
//   "": never - a record panel itself (RN6), a composite's content panel and the panels in it (N5).
export type DataNestingPlace = "survey" | "record" | "template" | "";
// The kind of container the dataNesting table looks up: "panel" or "page" on the survey's data, "record" for a
// panel inside a record, "" for a container that never nests.
export type DataNestingKind = "panel" | "page" | "record" | "";
// The kind the table looks up for a container of containerKind at place. A template panel never nests itself,
// while the records built from it nest a panel under its valueName: forRecords asks for that key instead (the
// Creator asks it before a rename, on the template).
export function getDataNestingKindAt(place: DataNestingPlace, containerKind: DataNestingKind, forRecords: boolean): DataNestingKind {
  if (place === "survey") return containerKind;
  return place === "record" || place === "template" && forRecords ? "record" : "";
}
// What holds a panel at the top of a container chain answers where the panels in it keep their values: the
// question the panel is a template or a record panel of (a dynamic panel, a matrix), or the panel's data (a
// record item, a nesting scope, a composite). The place detection asks it, so a new container-like question
// implements it instead of adding a branch to the panel.
export interface IDataNestingPlaceOwner {
  // The place of the panels inside panel; undefined when panel is not one this object holds. A question is asked
  // about the panels it is the design owner or the parent question of; a panel's data only about a panel at the
  // top of a chain, so it may answer without checking the panel.
  getChildDataNestingPlace(panel: IPanel): DataNestingPlace;
  // A record item: the records question of the panels it is the data of. A question that answers "template" is the
  // records question itself and needs no such member.
  getRecordsQuestion?(): Question;
}
export function getDataNestingPlaceOwner(obj: any): IDataNestingPlaceOwner {
  return !!obj && typeof obj.getChildDataNestingPlace === "function" ? <IDataNestingPlaceOwner>obj : undefined;
}

// The dataNesting modes that nest a container without a valueName under its name, and the container
// kinds each applies to (decisions N3).
const byNameModes: { [mode: string]: Array<string> } = {
  panel: ["panel"],
  page: ["page"],
  panelAndPage: ["panel", "page"]
};
// The rule of decisions N3: the key a container stores its elements' values under, or "" when it does
// not nest. kind is "panel" or "page", "record" for a panel inside a dynamic panel's or a detail panel's
// record, "" for a container that never nests (the single-page container, a record panel itself, a
// composite's content).
//   "none": never; "auto" (and an unknown mode): under valueName;
//   "panel" / "page" / "panelAndPage": under valueName, else name for the containers of that kind.
// No by-name mode lists "record": inside a record only an explicit valueName nests (RN3). Where a container
// is, is the owner's: PanelModelBase.getDataScopeKey().
export function getDataNestingKey(dataNesting: string, kind: string, valueName: string, name: string): string {
  if (dataNesting === "none" || !kind) return "";
  if (!!valueName) return valueName;
  const kinds = byNameModes[dataNesting];
  return !!kinds && kinds.indexOf(kind) > -1 ? name || "" : "";
}
