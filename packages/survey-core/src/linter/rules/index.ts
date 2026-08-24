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
import { choicesDeadSourceRule } from "./choices-dead-source";
import { triggerUnknownTargetRule } from "./trigger-unknown-target";
import { triggerUnknownTypeRule } from "./trigger-unknown-type";
import { pageEmptyRule } from "./page-empty";

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
  choicesDeadSourceRule,
  triggerUnknownTargetRule,
  triggerUnknownTypeRule,
  pageEmptyRule,
];
