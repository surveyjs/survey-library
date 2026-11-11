import { closestMatch } from "./levenshtein";
import { ParsedRefSegment, SurveyIndex } from "./symbols";

// The host's variable definition (decisions V1-V5), as the walker snapshots it into the index:
// index.definitionVariables holds its root variables, index.definitionPaths every path into its data.

// The fields of the definition's object variables ("users.tier"): what a condition can test below
// a root variable. Built on the first ask and kept on the index for the run.
export function getDefinitionFieldPaths(index: SurveyIndex): Array<string> {
  if (!index.definitionFieldPaths) {
    const res: Array<string> = [];
    index.definitionPaths.forEach((kind, path) => {
      // a root variable is no field, a dotted one ("a.b" of a flat definition) included
      if (kind === "question" && path.indexOf(".") > -1 && !index.definitionVariables.has(path)) res.push(path);
    });
    index.definitionFieldPaths = res;
  }
  return index.definitionFieldPaths;
}

// The name a misspelled host variable most likely meant. An inner question's own name ({tier}) reads
// nothing at runtime - the host sets { users: { tier } } - so a field of an object variable whose last
// key is that name is the answer before any near miss. Then the closest of the root names and the
// fields.
export function suggestDefinitionVariable(name: string, index: SurveyIndex): string | undefined {
  const field = findDefinitionFieldByKey(name, index);
  if (!!field) return field;
  return closestMatch(name, index.definitionVariables.names().concat(getDefinitionFieldPaths(index)));
}

export function findDefinitionFieldByKey(name: string, index: SurveyIndex): string | undefined {
  if (!name) return undefined;
  const tail = "." + name.toLowerCase();
  return getDefinitionFieldPaths(index).filter(path => path.toLowerCase().endsWith(tail))[0];
}

// {users.tier}: a variable the definition describes as an object (a panel or page that nests) has the
// fields its questions write, and a field it does not declare reads undefined at runtime. Whether the
// segments name a path below such a variable that the definition does not declare. Below a question's
// field nothing is checked, as for a flat variable. Segments are joined longest first: a key may hold a
// dot (decisions D11).
export function isUnknownDefinitionPath(segments: Array<ParsedRefSegment>, index: SurveyIndex): boolean {
  if (segments.length < 2 || index.definitionPaths.get(segments[0].name) !== "object") return false;
  for (let end = segments.length - 1; end > 0; end--) {
    const kind = index.definitionPaths.get(segments.slice(0, end + 1).map(seg => seg.name).join("."));
    if (!kind) continue;
    if (end === segments.length - 1 || kind === "question") return false;
    break;
  }
  return true;
}
