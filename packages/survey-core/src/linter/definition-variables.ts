import { SurveyVariablePresets } from "survey-core";
import { closestMatch } from "./levenshtein";
import { ParsedRefSegment, SurveyIndex } from "./symbols";

// The host's variable definition ("Host Variables" in docs/design-survey-nested-data.md). Its root variables are in
// index.definitionVariables; every path below them is read from index.definitionPresets, matched as the runtime
// matches a variable's object.

// The fields of the definition's object variables ("users.tier").
export function getDefinitionFieldPaths(index: SurveyIndex): Array<string> {
  if (!index.definitionPresets) return [];
  // no variable key holds a dot, so a dotted path is below a root variable
  return index.definitionPresets.getVariablePaths().filter(path => path.indexOf(".") > -1);
}

// An inner question's own name ({tier}) reads nothing at runtime - the host sets { users: { tier } } - so a field
// whose last key is that name comes before any near miss of the root names and the fields.
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

// {users.tier}: an object variable (a panel or page that nests) has the fields its questions write, and one it does
// not declare reads undefined at runtime. Below a question's field nothing is checked, as for a flat variable.
// No variable key holds a dot, so each segment is one key.
export function isUnknownDefinitionPath(segments: Array<ParsedRefSegment>, index: SurveyIndex): boolean {
  const presets = index.definitionPresets;
  if (segments.length < 2 || getPathKind(presets, segments[0].name) !== "object") return false;
  let path = segments[0].name;
  for (let i = 1; i < segments.length; i++) {
    path += "." + segments[i].name;
    const kind = getPathKind(presets, path);
    if (!kind) return true;
    if (kind === "question") return false;
  }
  return false;
}

// A path the presets answer with a question is a field, even where a container shares its key; one
// they know without a question is an object variable.
function getPathKind(presets: SurveyVariablePresets | undefined, path: string): "object" | "question" | undefined {
  if (!presets) return undefined;
  if (!!presets.getVariableQuestion(path)) return "question";
  return presets.hasVariable(path) ? "object" : undefined;
}
