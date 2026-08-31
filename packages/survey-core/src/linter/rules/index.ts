import { ILintRule } from "../rule";
import { expressionSyntaxRule } from "./expression-syntax";
import { referenceUnknownRule } from "./reference-unknown";
import { referenceSelfRule } from "./reference-self";
import { nameDuplicateRule } from "./name-duplicate";
import { elementUnknownTypeRule } from "./element-unknown-type";
import { expressionUnknownFunctionRule } from "./expression-unknown-function";
import { cycleCalculatedValueRule } from "./cycle-calculated-value";
import { cycleTriggerRule } from "./cycle-trigger";
import { expressionUnknownChoiceRule } from "./expression-unknown-choice";
import { expressionTypeMismatchRule } from "./expression-type-mismatch";
import { expressionContradictionRule } from "./expression-contradiction";
import { expressionMeaninglessConditionRule } from "./expression-meaningless-condition";
import { choicesDeadSourceRule } from "./choices-dead-source";
import { triggerUnknownTargetRule } from "./trigger-unknown-target";
import { triggerUnknownTypeRule } from "./trigger-unknown-type";
import { valueNotAChoiceRule } from "./value-not-a-choice";
import { pageEmptyRule } from "./page-empty";

// The run order, which the findings are sorted out of anyway (by path, then rule id): a rule
// never reads what another one reported, so the order is a reading order, not a dependency.
// Kept in step with the import order above; linter-rules-registry.tests.ts pins that every
// rule file reaches this list.
export const allRules: Array<ILintRule> = [
  expressionSyntaxRule,
  referenceUnknownRule,
  referenceSelfRule,
  nameDuplicateRule,
  elementUnknownTypeRule,
  expressionUnknownFunctionRule,
  cycleCalculatedValueRule,
  cycleTriggerRule,
  expressionUnknownChoiceRule,
  expressionTypeMismatchRule,
  expressionContradictionRule,
  expressionMeaninglessConditionRule,
  choicesDeadSourceRule,
  triggerUnknownTargetRule,
  triggerUnknownTypeRule,
  valueNotAChoiceRule,
  pageEmptyRule,
];
