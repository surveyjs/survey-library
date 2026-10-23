// A YAML emitter for the subset the interview documents use: maps, sequences and scalars. No
// anchors, no tags, no block scalars, no multi-document streams - and no dependency: survey-core
// ships none and a sub-bundle may import nothing but "survey-core" (overview 2.5). It is a pure
// function of plain data; nothing here knows that a SurveyModel exists.
//
// The one thing it has to get right is quoting. A consumer parses this text with a real YAML
// parser, and a value that comes back as a boolean, a number or a date where the survey said the
// string "Yes" is a data bug in someone else's code. So everything a parser could read as something
// other than a string is quoted, and the tests read every fixture back with js-yaml rather than
// with a second parser of our own, which would only share the assumptions made here.

const DEFAULT_INDENT = 2;
// A sequence of scalars is written inline while the whole line, the key included, stays inside the
// width a document is comfortable to read at; past it the items go one per line.
const MAX_FLOW_WIDTH = 80;

// A key is written bare only when it looks like an identifier. An address - "medications[0].dose",
// "matrix.row.column" - therefore comes out quoted; the consumer parses it as a string either way.
const BARE_KEY_REGEX = /^[A-Za-z_][A-Za-z0-9_-]*$/;
// Words a parser types for us if we leave them bare: "Yes" would arrive as a boolean.
const RESERVED_REGEX = /^(?:true|false|yes|no|on|off|null|~)$/i;
const NUMBER_REGEX = /^[-+]?(?:\d[\d_]*(?:\.[\d_]*)?|\.[\d_]+)(?:[eE][-+]?\d+)?$/;
const RADIX_NUMBER_REGEX = /^[-+]?0(?:x[0-9a-fA-F_]+|o[0-7_]+|b[01_]+)$/;
const SPECIAL_NUMBER_REGEX = /^[-+]?\.(?:inf|nan)$/i;
// js-yaml resolves both forms into a Date with its default schema, so both are quoted.
const DATE_REGEX = /^\d{4}-\d{1,2}-\d{1,2}$/;
const TIMESTAMP_REGEX = /^\d{4}-\d{1,2}-\d{1,2}(?:[Tt]|[ \t]+)\d{1,2}:\d{2}:\d{2}/;
// The characters that start something other than a plain scalar, plus leading whitespace.
const INDICATOR_START_REGEX = /^[-?:,[\]{}#&*!|>'"%@`\s]/;
// A flow sequence delimits its items with these, so a string carrying one is quoted there even
// though it is bare in block context: ["a,b"] must never come out as [a,b], which is two values.
const FLOW_INDICATOR_REGEX = /[,[\]{}]/;

export function toYaml(value: any, options?: { indent?: number }): string {
  const unit = getIndentUnit(options);
  const lines: Array<string> = [];
  writeRoot(value, unit, lines);
  return lines.join("\n") + "\n";
}

function getIndentUnit(options?: { indent?: number }): string {
  const size = !!options && typeof options.indent === "number" && options.indent > 0
    ? Math.floor(options.indent) : DEFAULT_INDENT;
  return new Array(size + 1).join(" ");
}

function writeRoot(value: any, unit: string, lines: Array<string>): void {
  if (isScalarValue(value)) {
    lines.push(formatScalar(value, false));
    return;
  }
  if (Array.isArray(value)) {
    const flow = getFlowSequence(value, 0);
    if (flow !== undefined) {
      lines.push(flow);
    } else {
      writeSequence(value, "", unit, lines);
    }
    return;
  }
  if (getKeys(value).length === 0) {
    lines.push("{}");
    return;
  }
  writeMap(value, "", unit, lines);
}

// Keys come out in insertion order: the documents are built with a fixed key order and the emitter
// never sorts. A key whose value is undefined does not exist for YAML - there is no way to write it
// that a parser would not read back as null.
function getKeys(value: any): Array<string> {
  return Object.keys(value).filter(key => value[key] !== undefined);
}

function writeMap(map: any, pad: string, unit: string, lines: Array<string>): void {
  getKeys(map).forEach(key => {
    const value = map[key];
    const prefix = pad + formatKey(key) + ":";
    if (isScalarValue(value)) {
      lines.push(prefix + " " + formatScalar(value, false));
      return;
    }
    if (Array.isArray(value)) {
      const flow = getFlowSequence(value, prefix.length + 1);
      if (flow !== undefined) {
        lines.push(prefix + " " + flow);
      } else {
        lines.push(prefix);
        writeSequence(value, pad + unit, unit, lines);
      }
      return;
    }
    if (getKeys(value).length === 0) {
      lines.push(prefix + " {}");
      return;
    }
    lines.push(prefix);
    writeMap(value, pad + unit, unit, lines);
  });
}

function writeSequence(value: Array<any>, pad: string, unit: string, lines: Array<string>): void {
  const dash = pad + "- ";
  // A map or a nested sequence starts on the dash line and continues under the text after the dash,
  // which is where its own indentation begins - two columns, whatever the indent option says.
  const childPad = pad + "  ";
  value.forEach(item => {
    if (isScalarValue(item)) {
      lines.push(dash + formatScalar(item, false));
      return;
    }
    const sub: Array<string> = [];
    if (Array.isArray(item)) {
      const flow = getFlowSequence(item, dash.length);
      if (flow !== undefined) {
        lines.push(dash + flow);
        return;
      }
      writeSequence(item, childPad, unit, sub);
    } else {
      if (getKeys(item).length === 0) {
        lines.push(dash + "{}");
        return;
      }
      writeMap(item, childPad, unit, sub);
    }
    sub[0] = dash + sub[0].substring(childPad.length);
    sub.forEach(line => lines.push(line));
  });
}

function getFlowSequence(value: Array<any>, prefixLength: number): string {
  if (value.length === 0) return "[]";
  for (let i = 0; i < value.length; i++) {
    if (!isScalarValue(value[i])) return undefined;
  }
  const text = "[" + value.map(item => formatScalar(item, true)).join(", ") + "]";
  return prefixLength + text.length <= MAX_FLOW_WIDTH ? text : undefined;
}

function isScalarValue(value: any): boolean {
  return value === null || value === undefined || typeof value !== "object" || value instanceof Date;
}

function formatKey(key: string): string {
  return BARE_KEY_REGEX.test(key) && isPlainSafe(key, false) ? key : quote(key);
}

function formatScalar(value: any, isFlow: boolean): string {
  if (value === null || value === undefined) return "null";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "number") return isFinite(value) ? String(value) : quote(String(value));
  if (typeof value === "string") return isPlainSafe(value, isFlow) ? value : quote(value);
  // Defensive: the documents hold JSON already, but a Date that reached one is a date, not the
  // "[object Date]" that String() would produce.
  if (value instanceof Date) {
    return quote(isNaN(value.getTime()) ? String(value) : value.toISOString());
  }
  return quote(String(value));
}

// A double-quoted YAML scalar accepts every escape JSON produces, so a multi-line string - an HTML
// description - stays one line per key and the consumer's parser stays trivial.
function quote(text: string): string {
  return JSON.stringify(text);
}

function isPlainSafe(text: string, isFlow: boolean): boolean {
  if (text.length === 0) return false;
  if (RESERVED_REGEX.test(text)) return false;
  if (isNumberLike(text) || isDateLike(text)) return false;
  if (INDICATOR_START_REGEX.test(text)) return false;
  // A trailing space is lost when a plain scalar is read back, and a trailing colon turns the
  // scalar into a key.
  if (/[\s:]$/.test(text)) return false;
  if (text.indexOf(": ") >= 0 || text.indexOf(" #") >= 0) return false;
  if (hasControlCharacter(text)) return false;
  if (isFlow && FLOW_INDICATOR_REGEX.test(text)) return false;
  return true;
}

function isNumberLike(text: string): boolean {
  return NUMBER_REGEX.test(text) || RADIX_NUMBER_REGEX.test(text) || SPECIAL_NUMBER_REGEX.test(text);
}

function isDateLike(text: string): boolean {
  return DATE_REGEX.test(text) || TIMESTAMP_REGEX.test(text);
}

// Newlines and tabs included: neither survives a plain scalar.
function hasControlCharacter(text: string): boolean {
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    if (code < 0x20 || code === 0x7f) return true;
  }
  return false;
}
