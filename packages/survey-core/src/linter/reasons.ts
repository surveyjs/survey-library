// The values below are public API: a host UI localizes on the (ruleId, reason) pair, the way the
// Builder UI localizes on SurveyTestIssueCodes. Keep them stable - later work extends these
// objects, it does not rename their members.

// One entry per rule, listing every branch of that rule's message.
export const SurveyLintReasons = Object.freeze({
  "expression/syntax": Object.freeze({
    unparsable: "unparsable",
  }),
  "reference/unknown": Object.freeze({
    // no question, panel, page, calculated value or variable with that name
    notFound: "notFound",
    // the root resolved, a segment inside the container did not
    inContainer: "inContainer",
    // the name is not found inside the scope its prefix names
    scopedUnknown: "scopedUnknown",
  }),
  "reference/self": Object.freeze({
    selfReference: "selfReference",
  }),
  "name/duplicate": Object.freeze({
    elementNames: "elementNames",
    calculatedValueNames: "calculatedValueNames",
    calculatedValueShadowsElement: "calculatedValueShadowsElement",
  }),
  "element/unknown-type": Object.freeze({
    unknownType: "unknownType",
  }),
  "expression/unknown-function": Object.freeze({
    notRegistered: "notRegistered",
  }),
  "cycle/calculated-value": Object.freeze({
    self: "self",
    loop: "loop",
  }),
  "cycle/trigger": Object.freeze({
    self: "self",
    loop: "loop",
  }),
  "expression/unknown-choice": Object.freeze({
    // the operator compares by equality: the value is not among the choices
    notAmongChoices: "notAmongChoices",
    // the operator compares by substring: no choice value contains the value
    noChoiceContains: "noChoiceContains",
  }),
  // these values already shipped inside messageData.reason
  "expression/type-mismatch": Object.freeze({
    "no-value": "no-value",
    "non-scalar": "non-scalar",
    "boolean-ordering": "boolean-ordering",
    "text-ordering": "text-ordering",
    "date-vs-number": "date-vs-number",
    "number-vs-string": "number-vs-string",
    "array-vs-scalar": "array-vs-scalar",
    "boolean-vs-const": "boolean-vs-const",
  }),
  // today only the decidable part of "can never evaluate true": a condition built entirely from
  // constants. Satisfiability reasoning extends this rule with its own reasons later.
  "expression/contradiction": Object.freeze({
    alwaysFalse: "alwaysFalse",
  }),
  "expression/meaningless-condition": Object.freeze({
    alwaysTrue: "alwaysTrue",
    // arithmetic at the root of a condition never produces a boolean
    notABoolean: "notABoolean",
    // a constant branch, a comparison of two constants, or an operand compared with itself
    meaninglessFragment: "meaninglessFragment",
  }),
  // these values already shipped inside messageData.reason
  "choices/dead-source": Object.freeze({
    missing: "missing",
    self: "self",
    "not-a-source": "not-a-source",
    "missing-field": "missing-field",
  }),
  "trigger/unknown-target": Object.freeze({
    pageNotFound: "pageNotFound",
    segmentNotFound: "segmentNotFound",
    rootNotFound: "rootNotFound",
  }),
  "trigger/unknown-type": Object.freeze({
    unknownType: "unknownType",
    noType: "noType",
  }),
  "page/empty": Object.freeze({
    emptyTemplate: "emptyTemplate",
    noElements: "noElements",
    noRenderableElements: "noRenderableElements",
  }),
});

// The hint reference/unknown appends when a scoped prefix or a bare name is used outside the
// container that would give it a meaning. Orthogonal to the reasons above: any base message of
// reference/unknown can carry any of these.
export const SurveyLintHintReasons = Object.freeze({
  // "{name}." is only meaningful inside a matrix cell or a matrix detail panel
  rowScopePrefix: "rowScopePrefix",
  // "{name}" is only meaningful inside a matrix cell or a matrix detail panel
  rowScopeStandalone: "rowScopeStandalone",
  panelScopePrefix: "panelScopePrefix",
  panelSiblingPrefix: "panelSiblingPrefix",
  panelStandalone: "panelStandalone",
  itemScope: "itemScope",
  compositeScopePrefix: "compositeScopePrefix",
  // the name exists in the surrounding container and only needs its prefix
  matrixColumn: "matrixColumn",
  panelQuestion: "panelQuestion",
});

// ILintReproduction.reason - what the steps demonstrate.
export const SurveyLintReproductionReasons = Object.freeze({
  selfReference: "selfReference",
  calculatedValueCycle: "calculatedValueCycle",
  triggerCycle: "triggerCycle",
  noChoiceEquals: "noChoiceEquals",
  noChoiceContains: "noChoiceContains",
  missingTriggerTarget: "missingTriggerTarget",
});

// messageData.suggestionReason of expression/type-mismatch: the finding's own "suggestion" is
// English prose, so a host that localizes needs the reason instead.
export const SurveyLintSuggestionReasons = Object.freeze({
  setNumberInputType: "setNumberInputType",
  useContainsOrAnyof: "useContainsOrAnyof",
});
