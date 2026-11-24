import { ILintRule, LintContext } from "../rule";
import { SurveyLintReasons } from "../reasons";
import { isValueQuestion } from "../expression-utils";
import { forEachContainerKey, getContainerKeyPath } from "../data-nesting";
import { getDataKeyRecords } from "../record-fields";
import { relatedOf } from "../message-utils";

const reasons = SurveyLintReasons["nesting/key-conflict"];

// Nested data: a nesting container's key equal to the data key of a question in the same object puts the
// container's object and the question's value under one key. The runtime allows it - last write wins - but
// it is never intended: the question shows the object, and an answer to it replaces every value of the
// container. Two containers on one key share one object (an address split across two pages), and a key
// equal to the name of a question inside the container is another level: neither is reported. Keys are
// compared exactly, as the runtime stores them. Inside a dynamic panel or a matrix each record is a level
// of its own: a matrix record holds its columns too. A container keyed by its name next to a question
// keyed by its own name is name/duplicate's finding (both names are in one name scope), so it is not
// reported twice.
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
