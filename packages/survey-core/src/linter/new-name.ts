import { SurveyIndex } from "./symbols";
import { ISurveyLintOptions } from "./types";

// The three words a host has for a new element. A matrix column and a multiple-text item are
// named the way a question is, which is how a Creator names them too.
function normalizeNameKind(kind: string): string {
  return kind === "page" || kind === "panel" ? kind : "question";
}

// The English spelling, and the smallest number that is free: the same name a Creator would
// build, minus the word it would translate.
function defaultName(nameKind: string, taken: Array<string>): string {
  const used: { [name: string]: boolean } = {};
  taken.forEach(name => { used[name] = true; });
  let index = 1;
  while(used[nameKind + index]) index++;
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
  const handedOut: Array<string> = [];
  return (kind: string): string => {
    const taken = takenNames(index).concat(handedOut);
    const nameKind = normalizeNameKind(kind);
    const custom = options.newElementName;
    const res = typeof custom === "function" ? custom(nameKind, taken) : defaultName(nameKind, taken);
    handedOut.push(res);
    return res;
  };
}
