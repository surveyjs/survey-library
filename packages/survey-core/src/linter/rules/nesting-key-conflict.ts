import { ILintRule, LintContext } from "../rule";
import { SurveyLintReasons } from "../reasons";
import { isValueQuestion } from "../expression-utils";
import { forEachContainerKey, getContainerKeyPath } from "../data-nesting";
import { getDataKeyRecords } from "../record-fields";
import { relatedOf } from "../message-utils";

const reasons = SurveyLintReasons["nesting/key-conflict"];

// Nested data: a container's key equal to the data key of a question in the same object puts the object and the
// value under one key. The runtime allows it (last write wins), but an answer replaces every value of the container.
// Not reported: two containers on one key (they share one object), a key equal to a question inside the container
// (another level), and a name-keyed container next to a question of that name (name/duplicate reports it). Keys
// are compared exactly, as the runtime stores them; each record of a dynamic panel or a matrix is a level of its own.
export const nestingKeyConflictRule: ILintRule = {
  id: "nesting/key-conflict",
  defaultSeverity: "error",
  run(ctx: LintContext): void {
    forEachContainerKey(ctx.index, (scope, child) => {
      // a display-only question (html, image) stores nothing under its key
      const questions = getDataKeyRecords(ctx.index, child.key, scope).filter(isValueQuestion);
      child.containers.forEach(container => {
        const others = container.container.dataKeySource === "name"
          ? questions.filter(record => record.kind !== "question" || record.name !== child.key) : questions;
        if (others.length === 0) return;
        const question = others[0];
        ctx.report({
          message: "The " + container.type + " \"" + (container.name || child.key) + "\" stores its questions' values in an object under \"" +
            child.key + "\", which is also the data key of " + question.type + " \"" + question.name +
            "\" - one key cannot hold both: an answer to \"" + question.name + "\" replaces the object, and the question shows it.",
          path: getContainerKeyPath(container),
          reason: reasons.questionKey,
          messageData: { name: container.name, key: child.key, questionName: question.name, questionType: question.type },
          elementName: container.name,
          elementType: container.type,
          related: relatedOf([container].concat(others)),
        });
      });
    });
  },
};
