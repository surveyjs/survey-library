import { IInterviewChanges, IInterviewDocument, IInterviewError } from "./interview-types";
import { toYaml } from "./yaml";

// The one place the interview turns a document into text. Everything else builds an
// IInterviewDocument and hands it over: tier 04 for single mode, tier 05 for batch mode. Nothing
// here reads a model - a document is plain records - and nothing anywhere else assembles Markdown
// or YAML by hand.
//
// The shape is a Markdown heading and one fenced yaml block:
//
//   # <title>
//
//   ```yaml
//   <the document, minus its title>
//   ```
//
// A chat UI strips the heading and renders the block; an agent looks for the first fenced yaml
// block. Both need the document to start the same way every time, which is why a survey with no
// title still gets a heading.

const DEFAULT_TITLE = "Survey";
const FENCE = "```";
// Non-empty lists only, always in this order.
const CHANGE_KEYS: Array<keyof IInterviewChanges> = ["becameVisible", "becameHidden", "becameRequired"];

export function renderInterviewDocument(doc: IInterviewDocument): string {
  return "# " + getHeading(doc) + "\n\n" + FENCE + "yaml\n" + toYaml(getBody(doc)) + FENCE + "\n";
}

function getHeading(doc: IInterviewDocument): string {
  const title = !!doc && typeof doc.title === "string" ? doc.title.trim() : "";
  return title.length > 0 ? title : DEFAULT_TITLE;
}

// The title is the heading, not a key of the block, and the sections come out in one fixed order
// whatever order the document was built in. An optional section that carries nothing is left out
// rather than written as an empty container: a consumer tests for the key. "current: null" is not
// such a case - "nothing left to ask" is information, and single mode says it explicitly.
function getBody(doc: IInterviewDocument): any {
  const res: any = {};
  if (!!doc.progress) {
    res.progress = { answered: doc.progress.answered, remainingRequired: doc.progress.remainingRequired };
  }
  if (hasValues(doc.answered)) {
    res.answered = doc.answered;
  }
  const changes = getChanges(doc.changes);
  if (!!changes) {
    res.changes = changes;
  }
  if (!!doc.errors && doc.errors.length > 0) {
    res.errors = doc.errors.map(error => getError(error));
  }
  if (doc.current !== undefined) {
    res.current = doc.current;
  }
  if (!!doc.items) {
    res.items = doc.items;
  }
  return res;
}

function hasValues(map: any): boolean {
  return !!map && Object.keys(map).some(key => map[key] !== undefined);
}

function getChanges(changes: Partial<IInterviewChanges>): any {
  if (!changes) return undefined;
  const res: any = {};
  CHANGE_KEYS.forEach(key => {
    const list = changes[key];
    if (!!list && list.length > 0) {
      res[key] = list;
    }
  });
  return Object.keys(res).length > 0 ? res : undefined;
}

function getError(error: IInterviewError): any {
  const res: any = { name: error.name, message: error.message };
  if (!!error.code) {
    res.code = error.code;
  }
  return res;
}
