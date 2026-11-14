import { LintContext } from "./rule";
import { SurveyLintReasons } from "./reasons";
import { equalsCI, isBuiltInVariable, isListedVariable, isValueQuestion } from "./expression-utils";
import { DataScopeRecord, ElementRecord } from "./symbols";
import { getAllNestedScopes, getAllRecordLevels, getContainerKeyPath } from "./data-nesting";
import { builtInSpelling, relatedOf, reportDerivedKeyCollision } from "./name-shadowing-common";

const reasons = SurveyLintReasons["name/shadowing"];

// name/shadowing for the keys of nesting containers (nested data): a key equal to a built-in variable,
// a key a variable answers first, and a key spelling the comment or totals key of a question in the
// same object.

// A container key spelling a built-in: the survey answers only the bare {key} itself, while a path
// into the container's object ({key.street}) still reaches the object, so the key is not
// unreachable - only the object as a whole is. When a variable of that name exists too, a path may
// read the variable instead (containerKeyShadowed reports it), so the path clause is left out.
function reportContainerBuiltIn(ctx: LintContext, scope: DataScopeRecord, nameKind: string, path: string,
  container: ElementRecord, isPathShadowed: boolean): void {
  const key = scope.key;
  if (!isBuiltInVariable(key)) return;
  // the example names a key that holds a value: a display-only question (html) stores nothing
  const innerKeys = scope.questions.names().filter(name => scope.questions.get(name).some(isValueQuestion));
  const examplePath = key + "." + (innerKeys.length > 0 ? innerKeys[0] : "x");
  const messageData: any = { name: key, nameKind: nameKind, builtIn: builtInSpelling(key) };
  if (!isPathShadowed) messageData.examplePath = examplePath;
  ctx.report({
    message: "The " + nameKind + " \"" + key + "\" of this " + container.type +
      " is also a built-in survey variable - only the bare {" + key + "} reads the built-in value" +
      (isPathShadowed ? "." : "; {" + examplePath + "} still reaches the " + container.type + "'s object."),
    path: path,
    reason: reasons.builtInVariable,
    messageData: messageData,
    elementName: container.name,
    elementType: container.type,
  });
}

// What answers {key} before a container key of the survey data: a calculated value, a host variable or
// a variable a trigger sets. Variables are read first in expressions, and
// a calculated value with includeIntoResult writes the same key of the survey data. Only a key of the
// survey data itself: inside a container, the container's object answers first.
function findVariableOver(ctx: LintContext, key: string): { kind: string, name: string, path?: string } | undefined {
  const cv = ctx.index.calculatedValues.get(key);
  if (!!cv) return { kind: "calculatedValue", name: cv.name, path: cv.path };
  if (isListedVariable(key, ctx.options)) return { kind: "variable", name: key };
  const definitionName = ctx.index.definitionVariables.get(key);
  if (!!definitionName) return { kind: "variable", name: definitionName };
  const trigger = ctx.index.triggers.filter(trg => !!trg.json && trg.json.isVariable === true &&
    typeof trg.json.setToName === "string" && equalsCI(trg.json.setToName, key))[0];
  if (!!trigger) return { kind: "trigger", name: trigger.json.setToName, path: trigger.path };
  return undefined;
}

const VARIABLE_KIND_TEXT: { [kind: string]: string } = {
  calculatedValue: "calculated value", variable: "host variable", trigger: "variable a trigger sets",
};

// The <name>-Comment and <matrix>-total keys the runtime derives, spelled by a container key in the same
// object: the comment or the totals overwrite the container's object, or the other way round.
function checkContainerDerivedKeys(ctx: LintContext, scope: DataScopeRecord): void {
  scope.children.forEach(children => children.forEach(child => child.containers.forEach(container =>
    reportDerivedKeyCollision(ctx, container, child.key, scope, undefined, getContainerKeyPath(container)))));
}

function checkRootContainerKeys(ctx: LintContext): void {
  ctx.index.rootScope.children.forEach(scopes => scopes.forEach(scope => {
    const record = scope.containers[0];
    if (!record || !record.json) return;
    const path = getContainerKeyPath(record);
    const nameKind = record.container.dataKeySource === "valueName" ? "valueName" : "name";
    const over = findVariableOver(ctx, scope.key);
    reportContainerBuiltIn(ctx, scope, nameKind, path, record, !!over);
    if (!over) return;
    ctx.report({
      message: "The " + record.type + " \"" + record.name + "\" stores its questions' values under \"" + scope.key +
        "\", which is also a " + VARIABLE_KIND_TEXT[over.kind] + " - {" + scope.key + "} and {" + scope.key +
        ".x} read the variable first.",
      path: path,
      reason: reasons.containerKeyShadowed,
      messageData: { name: record.name, key: scope.key, kind: over.kind, variable: over.name },
      elementName: record.name,
      elementType: record.type,
      related: relatedOf(scope.containers).concat(over.path ? [{ path: over.path }] : []),
    });
  }));
}

export function checkContainerKeys(ctx: LintContext): void {
  checkRootContainerKeys(ctx);
  // the records' levels too, but not checkRootContainerKeys: a key inside a record meets no variable
  [ctx.index.rootScope].concat(getAllNestedScopes(ctx.index), getAllRecordLevels(ctx.index))
    .forEach(scope => checkContainerDerivedKeys(ctx, scope));
}
