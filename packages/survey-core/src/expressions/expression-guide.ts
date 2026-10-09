// A compact English guide to the expression syntax, for tools that write expressions: an AI
// assistant in Survey Creator, the LLM authoring guide. Every example is data, so the tests run each
// one through the parser - an example shown as valid parses, one shown as invalid does not - and the
// guide cannot drift from the grammar (grammar.pegjs). Raise the version whenever the text changes,
// so a tool that caches a prompt built from it knows the prompt is stale.

export interface IExpressionGuideExample {
  expression: string;
  isValid: boolean;
  // why the example is written this way, or why it does not parse
  note?: string;
}

export interface IExpressionGuideSection {
  title: string;
  text: string;
  examples: Array<IExpressionGuideExample>;
}

export const expressionGuideVersion = "1";

const valid = (expression: string, note?: string): IExpressionGuideExample => ({ expression: expression, isValid: true, note: note });
const invalid = (expression: string, note: string): IExpressionGuideExample => ({ expression: expression, isValid: false, note: note });

export const expressionGuideSections: Array<IExpressionGuideSection> = [
  {
    title: "References",
    text: "Wrap the name of a question, a calculated value or a variable in curly braces. Names are not case-sensitive. A dot reaches into a composite value: an item of a multiple-text question, a cell of a matrix. A choice is compared by its value, never by its display text.",
    examples: [
      valid("{age} >= 18"),
      valid("{country} = 'us'", "'us' is the choice value; its text may be \"United States\""),
      valid("{address.city} notempty", "the city item of a multiple-text question"),
      valid("{matrix.row1.col1} = 5", "a cell of a matrix: row value, then column name"),
      invalid("{{age} >= 18}", "the whole expression is never wrapped in braces"),
    ],
  },
  {
    title: "Literals",
    text: "Strings go in single or double quotes. Numbers are written as is. Booleans are true and false. A date is compared as a string in the format 'YYYY-MM-DD' or through a date function. An array is written in square brackets.",
    examples: [
      valid("{name} = 'John'"),
      valid("{count} > 2.5"),
      valid("{agree} = true"),
      valid("{start} > '2024-01-31'"),
      valid("{colors} = ['red', 'blue']", "true only when exactly these values are selected"),
    ],
  },
  {
    title: "Comparison",
    text: "= (also == and equal), != (also <> and notequal), <, >, <= (lessorequal), >= (greaterorequal). Equality is loose: 5 equals '5'.",
    examples: [
      valid("{q1} = 10"),
      valid("{q1} == 10"),
      valid("{q1} equal 10"),
      valid("{q1} != 10"),
      valid("{q1} <> 10"),
      valid("{q1} notequal 10"),
      valid("{q1} < 10"),
      valid("{q1} less 10"),
      valid("{q1} > 10"),
      valid("{q1} greater 10"),
      valid("{q1} <= 10"),
      valid("{q1} lessorequal 10"),
      valid("{q1} >= 10"),
      valid("{q1} greaterorequal 10"),
      invalid("{q1} === 10", "there is no strict equality; write ="),
    ],
  },
  {
    title: "Logic",
    text: "and (also &&), or (also ||), negation with ! or negate. Parentheses group. The word not does not exist: write ! or negate.",
    examples: [
      valid("{q1} = 1 and {q2} = 2"),
      valid("{q1} = 1 && {q2} = 2"),
      valid("{q1} = 1 or {q2} = 2"),
      valid("{q1} = 1 || {q2} = 2"),
      valid("!({q1} = 1)"),
      valid("negate ({q1} = 1)"),
      valid("({q1} = 1 or {q2} = 2) and {q3} notempty"),
      invalid("not ({q1} = 1)", "write ! or negate instead of not"),
    ],
  },
  {
    title: "Empty values",
    text: "empty holds when a question has no answer; notempty holds when it has one.",
    examples: [
      valid("{q1} empty"),
      valid("{q1} notempty"),
    ],
  },
  {
    title: "Several values",
    text: "A multi-select question (checkboxes, tag box, ranking) holds an array. contains (also contain and *=) tests that the array holds a value, notcontains (also notcontain) that it does not. anyof holds when any of the listed values is selected, allof when all of them are, noneof when none is. For a single-value question, anyof and noneof test whether the value is one of the listed ones.",
    examples: [
      valid("{colors} contains 'red'"),
      valid("{colors} contain 'red'"),
      valid("{colors} *= 'red'"),
      valid("{colors} notcontains 'red'"),
      valid("{colors} notcontain 'red'"),
      valid("{colors} anyof ['red', 'blue']"),
      valid("{colors} allof ['red', 'blue']"),
      valid("{colors} noneof ['red', 'blue']"),
      valid("{country} anyof ['us', 'ca']", "a single-value question: one of the listed values"),
    ],
  },
  {
    title: "Arithmetic",
    text: "+, -, *, /, % (remainder) and ^ (also power). + also joins strings.",
    examples: [
      valid("{price} * {quantity}"),
      valid("({q1} + {q2}) / 2"),
      valid("{q1} % 2 = 0"),
      valid("{q1} ^ 2"),
      valid("{q1} power 2"),
      valid("{firstName} + ' ' + {lastName}"),
    ],
  },
  {
    title: "Scopes",
    text: "Inside a dynamic panel, {panel.name} reads a question of the same panel entry, {prevPanel.name} and {nextPanel.name} of the neighbours, {panelIndex} is the entry's index. Inside a matrix, {row.name} reads a cell of the same row, {rowIndex} is the row's index. In choicesVisibleIf and similar item conditions, {item} is the value of the item being tested. {self} is the element the expression belongs to. A bare {name} inside a panel or a matrix reads the survey-level question, not the one of the same entry.",
    examples: [
      valid("{panel.hasCar} = true"),
      valid("{prevPanel.total} > 0"),
      valid("{panelIndex} > 0"),
      valid("{row.quantity} > 0"),
      valid("{rowIndex} = 1"),
      valid("{item} != 'none'"),
      valid("{item} notempty and {item} != {otherChoice}"),
    ],
  },
  {
    title: "Functions",
    text: "A function is called by its name with arguments in parentheses. iif(condition, valueIfTrue, valueIfFalse) chooses a value. Date functions: today(), age({birthdate}), dateDiff({from}, {to}, 'days'), dateAdd({date}, 7, 'days'), year(), month(), day(). The inArray family reads an array value (a dynamic matrix or panel): its second argument is a quoted field name, its last an optional condition over the item's own fields.",
    examples: [
      valid("iif({score} > 50, 'pass', 'fail')"),
      valid("age({birthdate}) >= 18"),
      valid("{start} >= today()"),
      valid("dateDiff({start}, {end}, 'days') <= 30"),
      valid("dateAdd({start}, 7, 'days') > today()"),
      valid("sum({q1}, {q2}, {q3}) > 10"),
      valid("sumInArray({orders}, 'total') > 100"),
      valid("countInArray({orders}, 'quantity', {quantity} > 0) >= 1"),
      valid("round({q1} / 3, 2)"),
    ],
  },
  {
    title: "Derived keys",
    text: "{name-Comment} is the comment of a question (its 'Other' text or comment box). {matrix-total.column} is the total of a matrix column.",
    examples: [
      valid("{q1-Comment} notempty"),
      valid("{orders-total.price} > 100"),
    ],
  },
];

// The guide as plain text: one section after another, valid examples first, then what does not parse.
export function getExpressionGuideText(): string {
  const lines: Array<string> = ["SurveyJS expression syntax (guide version " + expressionGuideVersion + ")"];
  expressionGuideSections.forEach(section => {
    lines.push("");
    lines.push("## " + section.title);
    lines.push(section.text);
    const ok = section.examples.filter(ex => ex.isValid);
    const bad = section.examples.filter(ex => !ex.isValid);
    if (ok.length > 0) {
      lines.push("Examples:");
      ok.forEach(ex => lines.push("  " + ex.expression + (ex.note ? "    // " + ex.note : "")));
    }
    if (bad.length > 0) {
      lines.push("Does not parse:");
      bad.forEach(ex => lines.push("  " + ex.expression + "    // " + ex.note));
    }
  });
  return lines.join("\n");
}
