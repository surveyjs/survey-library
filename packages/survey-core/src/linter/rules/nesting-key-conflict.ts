import { ILintRule, LintContext } from "../rule";
import { DataScopeRecord } from "../symbols";
import { SurveyLintReasons } from "../reasons";
import { getContainerKeyPath } from "../data-nesting";
import { getDataKeyRecords } from "../record-fields";

const reasons = SurveyLintReasons["nesting/key-conflict"];

// Nested data, design-01 4.2 and decisions D4: a nesting container's key equal to the data key of a
// question in the same object puts the container's object and the question's value under one key. The
// runtime allows it - last write wins - but it is never intended: the question shows the object, and
// an answer to it replaces every value of the container. Two containers on one key share one object
// (D4), and a key equal to the name of a question inside the container is another level (4.4): neither
// is reported. Keys are compared exactly, as the runtime stores them.
function checkScope(ctx: LintContext, scope: DataScopeRecord): void {
  scope.children.forEach(children => children.forEach(child => {
    checkScope(ctx, child);
    // a display-only question (html, image) stores nothing under its key
    const questions = getDataKeyRecords(ctx.index, undefined, child.key, scope)
      .filter(record => !record.valueType || record.valueType.shape !== "none");
    if (questions.length === 0) return;
    const question = questions[0];
    child.containers.forEach(container => {
      ctx.report({
        message: "The " + container.type + " \"" + (container.name || child.key) + "\" stores its questions' values in an object under \"" +
          child.key + "\", which is also the data key of " + question.type + " \"" + question.name +
          "\" - one key cannot hold both: an answer to \"" + question.name + "\" replaces the object, and the question shows it.",
        path: getContainerKeyPath(container),
        reason: reasons.questionKey,
        messageData: { name: container.name, key: child.key, questionName: question.name, questionType: question.type },
        elementName: container.name,
        elementType: container.type,
        related: [{ path: container.path, elementName: container.name }].concat(
          questions.map(record => ({ path: record.path, elementName: record.name }))),
      });
    });
  }));
}

export const nestingKeyConflictRule: ILintRule = {
  id: "nesting/key-conflict",
  defaultSeverity: "error",
  run(ctx: LintContext): void {
    checkScope(ctx, ctx.index.rootScope);
  },
};
