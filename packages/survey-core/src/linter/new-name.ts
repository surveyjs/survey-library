import { SurveyIndex } from "./symbols";
import { ISurveyLintOptions } from "./types";

// The three words a host has for a new element. Asked with an element kind or with the class the
// deserializer would build: a matrix column, a multiple-text item and a calculated value are all
// named the way a question is, which is how a Creator names them too.
function normalizeNameKind(kind: string): string {
  if (kind === "page") return "page";
  if (kind === "panel" || kind === "flowpanel") return "panel";
  return "question";
}

// The English spelling, and the smallest number that is free: the same name a Creator would
// build, minus the word it would translate.
function defaultName(nameKind: string, taken: Array<string>): string {
  // a Set, never an object literal keyed by a name out of the document: "constructor" and its
  // kin are names an author may write, which is what name/reserved is about
  const used = new Set<string>(taken);
  let index = 1;
  while(used.has(nameKind + index)) index++;
  return nameKind + index;
}

// Every name the document spells, whatever it belongs to: a fresh name must clear a matrix
// column and a multiple-text item as much as a question.
function takenNames(index: SurveyIndex): Array<string> {
  const res: Array<string> = [];
  index.allElements.forEach(record => { if (!!record.name) res.push(record.name); });
  index.calculatedValueList.forEach(cv => { if (!!cv.name) res.push(cv.name); });
  return res;
}

// Names new elements for the fixes of one run. The host is asked first - a Creator spells a
// question in the language its user works in, and the linter has only the English word - and the
// names already handed out join the taken ones, so two duplicates never get one name.
export function createNameFactory(index: SurveyIndex,
  options: ISurveyLintOptions): (kind: string) => string {
  // the document is walked once; every name handed out joins the list it is checked against
  const taken = takenNames(index);
  return (kind: string): string => {
    const nameKind = normalizeNameKind(kind);
    const custom = options.newElementName;
    // the host gets a copy: what it does with the list is its own business
    const res = typeof custom === "function"
      ? custom(nameKind, taken.slice()) : defaultName(nameKind, taken);
    taken.push(res);
    return res;
  };
}
