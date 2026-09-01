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
    // a keyName naming no column / template question, which disables duplicate-key validation
    keyNameNotFound: "keyNameNotFound",
  }),
  "reference/self": Object.freeze({
    selfReference: "selfReference",
  }),
  "name/duplicate": Object.freeze({
    elementNames: "elementNames",
    calculatedValueNames: "calculatedValueNames",
    calculatedValueShadowsElement: "calculatedValueShadowsElement",
  }),
  // a name that resolves somewhere else than the JSON suggests: the survey answers it first,
  // or a second declaration writes the same data key
  "name/shadowing": Object.freeze({
    builtInVariable: "builtInVariable",
    valueNameShadowsElement: "valueNameShadowsElement",
    commentKeyCollision: "commentKeyCollision",
    totalKeyCollision: "totalKeyCollision",
    variableShadowsQuestion: "variableShadowsQuestion",
  }),
  // a key that matches no property of the class the JSON says it belongs to
  "property/unknown": Object.freeze({
    unknownProperty: "unknownProperty",
  }),
  // a value the property cannot hold, or one the runtime reads as something else
  "property/invalid-value": Object.freeze({
    notInChoices: "notInChoices",
    outOfRange: "outOfRange",
    // a valueName with a "." in it, which references read as a path
    valueNameDotted: "valueNameDotted",
  }),
  // a property the JSON states and the runtime does not keep
  "property/dead": Object.freeze({
    notSerializable: "notSerializable",
    // one property written under both its names, where only the later key survives
    aliasDuplicate: "aliasDuplicate",
    // min/max/step on an inputType that has no bounds
    inertMinMax: "inertMinMax",
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
  // today only the decidable part of "can never evaluate true": a condition built from constants,
  // either written inline or reached through a reference to a constant source. Satisfiability
  // reasoning extends this rule with its own reasons later.
  "expression/contradiction": Object.freeze({
    alwaysFalse: "alwaysFalse",
    // the constants are reached through a reference, e.g. a calculated value of "1 + 1"
    alwaysFalseViaConstants: "alwaysFalseViaConstants",
    // no value the question is allowed to hold satisfies the comparison
    outOfRange: "outOfRange",
    // two requirements on one reference that cannot hold together
    unsatisfiable: "unsatisfiable",
  }),
  "expression/meaningless-condition": Object.freeze({
    alwaysTrue: "alwaysTrue",
    // arithmetic at the root of a condition never produces a boolean
    notABoolean: "notABoolean",
    // a constant branch, a comparison of two constants, or an operand compared with itself
    meaninglessFragment: "meaninglessFragment",
    alwaysTrueViaConstants: "alwaysTrueViaConstants",
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
  "validator/unknown-type": Object.freeze({
    unknownType: "unknownType",
    noType: "noType",
  }),
  // a validator that cannot do the job it was written for
  "validator/dead": Object.freeze({
    unsupportedForQuestion: "unsupportedForQuestion",
    minAboveMax: "minAboveMax",
    minCountAboveChoices: "minCountAboveChoices",
    invalidRegex: "invalidRegex",
    emptyExpression: "emptyExpression",
  }),
  // value writers (setValue/reset/default expressions, triggers, calculated values) in a loop
  "cycle/value-write": Object.freeze({
    self: "self",
    loop: "loop",
  }),
  // a value written in the JSON that the question it belongs to can never hold
  "value/not-a-choice": Object.freeze({
    defaultValue: "defaultValue",
    correctAnswer: "correctAnswer",
    triggerSetValue: "triggerSetValue",
    defaultRowValue: "defaultRowValue",
    defaultPanelValue: "defaultPanelValue",
    unknownRowKey: "unknownRowKey",
    unknownColumnKey: "unknownColumnKey",
    unknownQuestionKey: "unknownQuestionKey",
    // copyvalue source and target that cannot exchange a value
    copyValueShape: "copyValueShape",
    copyValueNoOverlap: "copyValueNoOverlap",
  }),
  // authored count and bound constraints the runtime silently reconciles
  "element/count-contradiction": Object.freeze({
    minAboveMax: "minAboveMax",
    countOutOfBounds: "countOutOfBounds",
    // a step wider than the whole range it steps through
    stepAboveRange: "stepAboveRange",
    // more selections required than the choices can offer together
    minAboveChoicesCount: "minAboveChoicesCount",
  }),
  // dead through the cascade: the visibleIf demands a value of a never-visible question
  // two items of one itemvalue array holding the same value, and a listed choice colliding
  // with a built-in item the question also shows
  "choices/duplicate": Object.freeze({
    duplicateValue: "duplicateValue",
    specialItemCollision: "specialItemCollision",
  }),
  "element/never-visible": Object.freeze({
    dependsOnDeadValue: "dependsOnDeadValue",
  }),
  "page/empty": Object.freeze({
    emptyTemplate: "emptyTemplate",
    noElements: "noElements",
    noRenderableElements: "noRenderableElements",
    // detailElements while detailPanelMode stays "none" (the default) - never rendered
    detailElementsHidden: "detailElementsHidden",
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
