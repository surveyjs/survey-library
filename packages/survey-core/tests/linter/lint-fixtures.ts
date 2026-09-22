// The surveys property/required and property/not-an-array are demonstrated on. Two files read
// them: linter-runtime-parity compares each against what the deserializer really does, and the
// rule's own tests read the finding it produces - so a claim and the parity behind it are never
// made about two different surveys.
//
// The deserializer reports the first missing property of an object only, which is why every
// required fixture leaves out one property per object.

export interface LintFixture {
  title: string;
  json: any;
}

export const REQUIRED_FIXTURES: { [key: string]: LintFixture } = {
  questionWithoutName: {
    title: "a question without a name",
    json: { pages: [{ name: "p1", elements: [{ type: "text" }] }] },
  },
  emptyName: {
    title: "a question with an empty name",
    json: { elements: [{ type: "text", name: "" }] },
  },
  columnAndItemWithoutName: {
    title: "a column and an item without a name",
    json: {
      elements: [
        { type: "matrixdynamic", name: "m1", columns: [{ cellType: "text" }] },
        { type: "multipletext", name: "mt1", items: [{ title: "t" }] },
      ],
    },
  },
  multipleTextWithoutItems: {
    title: "a multiple text without items",
    json: { elements: [{ type: "multipletext", name: "mt1" }] },
  },
  calculatedValueWithoutName: {
    title: "a calculated value without a name",
    json: { elements: [{ type: "text", name: "q1" }], calculatedValues: [{ expression: "1" }] },
  },
  triggersWithoutTargets: {
    title: "triggers without their targets",
    json: {
      elements: [{ type: "text", name: "q1" }],
      triggers: [
        { type: "setvalue", expression: "{q1} = 1", setValue: 2 },
        { type: "copyvalue", expression: "{q1} = 1", setToName: "q1" },
        { type: "skip", expression: "{q1} = 1" },
      ],
    },
  },
  choiceWithoutValue: {
    title: "a choice without a value is left alone",
    json: { elements: [{ type: "checkbox", name: "q1", choices: [{ text: "a" }] }] },
  },
  complete: {
    title: "a survey with every required property",
    json: {
      pages: [{ name: "p1", elements: [
        { type: "text", name: "q1" },
        { type: "matrixdynamic", name: "m1", columns: [{ name: "c1" }] },
        { type: "multipletext", name: "mt1", items: [{ name: "i1" }] },
      ] }],
      calculatedValues: [{ name: "cv", expression: "1" }],
      triggers: [{ type: "setvalue", expression: "{q1} = 1", setToName: "q1" }],
    },
  },
};

export const NOT_AN_ARRAY_FIXTURES: { [key: string]: LintFixture } = {
  elementsObject: {
    title: "one element object under elements",
    json: { pages: [{ name: "p1", elements: { type: "text", name: "q1" } }] },
  },
  questionsAlias: {
    title: "one element object under the questions alias",
    json: { pages: [{ name: "p1", questions: { type: "text", name: "q1" } }] },
  },
  pagesObject: {
    title: "one page object under pages",
    json: { pages: { name: "p1", elements: [{ type: "text", name: "q1" }] } },
  },
  choicesScalar: {
    title: "a string under choices",
    json: { elements: [{ type: "checkbox", name: "q1", choices: "a" }] },
  },
  columnAndItemObjects: {
    title: "one column object and one item object",
    json: {
      elements: [
        { type: "matrixdynamic", name: "m1", columns: { name: "c1" } },
        { type: "multipletext", name: "mt1", items: { name: "i1" } },
      ],
    },
  },
  triggerAndValidatorObjects: {
    title: "one trigger object and one validator object",
    json: {
      elements: [{ type: "text", name: "q1", validators: { type: "numeric" } }],
      triggers: { type: "complete", expression: "{q1} = 1" },
    },
  },
  clean: {
    title: "a survey the serializer accepts whole",
    json: {
      pages: [{ name: "p1", elements: [{ type: "checkbox", name: "q1", choices: ["a"], validators: [] }] }],
      triggers: [],
    },
  },
};
