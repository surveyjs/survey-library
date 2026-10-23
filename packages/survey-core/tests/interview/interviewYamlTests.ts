// @vitest-environment node

import { toYaml } from "survey-core/interview";
import { load } from "js-yaml";

import { describe, expect, test } from "vitest";

// The emitter is text in, text out: no model, no DOM, which is why this file runs in the node
// environment. What it has to guarantee is that the string a survey holds is the string a consumer
// parses back, so the last block here reads every fixture with js-yaml - a real parser, on purpose:
// a second parser written next to the emitter would only agree with its own assumptions.

function yamlOf(value: any): string {
  return toYaml(value);
}

function scalarLine(value: any): string {
  const text = toYaml({ k: value });
  return text.substring("k: ".length, text.length - 1);
}

describe("interview yaml (issue #11818)", () => {
  test("Scalars other than strings", () => {
    expect(scalarLine(null)).toBe("null");
    // undefined has no key of its own to be skipped from inside a sequence.
    expect(yamlOf({ k: [undefined] })).toBe("k: [null]\n");
    expect(scalarLine(true)).toBe("true");
    expect(scalarLine(false)).toBe("false");
    expect(scalarLine(0)).toBe("0");
    expect(scalarLine(55)).toBe("55");
    expect(scalarLine(-1.5)).toBe("-1.5");
    expect(scalarLine(1e21)).toBe("1e+21");
    expect(scalarLine(Number.NaN)).toBe("\"NaN\"");
    expect(scalarLine(Number.POSITIVE_INFINITY)).toBe("\"Infinity\"");
    expect(yamlOf("plain")).toBe("plain\n");
    expect(yamlOf(7)).toBe("7\n");
    expect(yamlOf(null)).toBe("null\n");
  });

  test("A Date is its ISO string, quoted", () => {
    expect(scalarLine(new Date(Date.UTC(2024, 0, 1, 10, 30)))).toBe("\"2024-01-01T10:30:00.000Z\"");
  });

  test("Strings a parser would type are quoted", () => {
    // Each of these comes back as a boolean, a number, a date, null or a syntax error when it is
    // left bare - and every one of them is a value a survey can legitimately hold.
    const quoted = [
      "", "Yes", "No", "yes", "no", "TRUE", "False", "on", "OFF", "null", "NULL", "~",
      "1", "0", "-3", "1.5", ".5", "1e3", "0x1f", "1_000", ".inf", "2024-01-01", "2024-1-1",
      "2024-01-01T10:30:00Z", "a: b", "#x", "a #b", " x", "x ", "x:", "[x]", "{x}", "- x", "? x",
      ": x", "*x", "&x", "!x", "|x", ">x", "'x", "\"x", "%x", "@x", "`x", "x\ny", "x\ty",
    ];
    quoted.forEach(text => {
      expect(scalarLine(text), "\"" + text + "\" must be quoted").toBe(JSON.stringify(text));
    });
  });

  test("Strings that can only be strings stay bare", () => {
    const bare = [
      "Dog", "Cat", "Other", "petType", "q-1", "q_1", "Do you have a pet?", "Do you have a pet",
      "The value should not be greater than 40", "a#b", "a,b", "a[b]", "x:y", "10 apples",
      "e-mail@example.com", "1 000", "v1.5.0",
    ];
    bare.forEach(text => {
      expect(scalarLine(text), "\"" + text + "\" must stay bare").toBe(text);
    });
  });

  test("Keys are bare only when they read as identifiers", () => {
    expect(yamlOf({ name: 1 })).toBe("name: 1\n");
    expect(yamlOf({ becameVisible: 1 })).toBe("becameVisible: 1\n");
    expect(yamlOf({ "q-1": 1, "_q": 2 })).toBe("q-1: 1\n_q: 2\n");
    // An address is not an identifier, and a word a parser types is not a key we dare leave bare.
    expect(yamlOf({ "medications[0].dose": "5mg" })).toBe("\"medications[0].dose\": 5mg\n");
    expect(yamlOf({ "matrix.row.column": 1 })).toBe("\"matrix.row.column\": 1\n");
    expect(yamlOf({ "a b": 1 })).toBe("\"a b\": 1\n");
    expect(yamlOf({ "true": 1 })).toBe("\"true\": 1\n");
    expect(yamlOf({ "no": 1 })).toBe("\"no\": 1\n");
    expect(yamlOf({ "null": 1 })).toBe("\"null\": 1\n");
    expect(yamlOf({ "on": 1 })).toBe("\"on\": 1\n");
    expect(yamlOf({ "1": 1 })).toBe("\"1\": 1\n");
    expect(yamlOf({ "2024-01-01": 1 })).toBe("\"2024-01-01\": 1\n");
  });

  test("A sequence of scalars is written inline", () => {
    expect(yamlOf({ becameVisible: ["petType", "petAge"] })).toBe("becameVisible: [petType, petAge]\n");
    expect(yamlOf({ k: [1, true, null, "Yes"] })).toBe("k: [1, true, null, \"Yes\"]\n");
    expect(yamlOf(["a", "b"])).toBe("[a, b]\n");
  });

  test("A flow sequence quotes what its own delimiters would split", () => {
    // "a,b" is one value; bare in a flow sequence it would be read as two.
    expect(yamlOf({ k: ["a,b", "c"] })).toBe("k: [\"a,b\", c]\n");
    expect(yamlOf({ k: ["[x]", "{y}", "c"] })).toBe("k: [\"[x]\", \"{y}\", c]\n");
    // The same string in block context keeps its comma without quotes: nothing splits there.
    expect(scalarLine("a,b")).toBe("a,b");
    expect(yamlOf({ k: [{ v: "a,b" }] })).toBe("k:\n  - v: a,b\n");
  });

  test("A sequence goes block when the line would pass 80 columns", () => {
    const fits = new Array(76).join("x");
    expect(fits.length).toBe(75);
    // "k: " (3) + "[" + 75 + "]" = 80 columns exactly.
    expect(yamlOf({ k: [fits] })).toBe("k: [" + fits + "]\n");
    const passes = fits + "x";
    expect(yamlOf({ k: [passes] })).toBe("k:\n  - " + passes + "\n");
  });

  test("A sequence of maps is a block sequence that starts on the dash line", () => {
    expect(yamlOf({ choices: [{ value: "Yes" }, { value: "No" }] }))
      .toBe("choices:\n  - value: \"Yes\"\n  - value: \"No\"\n");
    expect(yamlOf({ choices: [{ value: "Dog", text: "A dog" }, { value: "Other", other: true }] }))
      .toBe("choices:\n  - value: Dog\n    text: A dog\n  - value: Other\n    other: true\n");
    expect(yamlOf([{ name: "q1" }, { name: "q2" }])).toBe("- name: q1\n- name: q2\n");
  });

  test("Nested maps and sequences indent by two", () => {
    expect(yamlOf({ a: { b: { c: 1 } } })).toBe("a:\n  b:\n    c: 1\n");
    expect(yamlOf({ current: { name: "q1", constraints: { min: 0, max: 40 } } }))
      .toBe("current:\n  name: q1\n  constraints:\n    min: 0\n    max: 40\n");
    expect(yamlOf({ items: [{ name: "q1", choices: [{ value: 1 }] }] }))
      .toBe("items:\n  - name: q1\n    choices:\n      - value: 1\n");
    expect(yamlOf({ k: [[{ a: 1 }, { b: 2 }]] })).toBe("k:\n  - - a: 1\n    - b: 2\n");
    const long = new Array(90).join("y");
    expect(yamlOf({ k: [[long]] })).toBe("k:\n  - - " + long + "\n");
  });

  test("The indent option widens the map levels", () => {
    expect(yamlOf({ a: { b: 1 } })).toBe("a:\n  b: 1\n");
    expect(toYaml({ a: { b: 1 } }, { indent: 4 })).toBe("a:\n    b: 1\n");
    // A dash and its space are two columns whatever the option says: a map under a dash has to
    // start where the dash line's text starts.
    expect(toYaml({ a: [{ b: 1, c: 2 }] }, { indent: 4 })).toBe("a:\n    - b: 1\n      c: 2\n");
  });

  test("A key whose value is undefined is not written", () => {
    expect(yamlOf({ a: 1, b: undefined, c: 2 })).toBe("a: 1\nc: 2\n");
    expect(yamlOf({ a: { b: undefined } })).toBe("a: {}\n");
    expect(yamlOf({ current: { name: "q1", description: undefined, required: false } }))
      .toBe("current:\n  name: q1\n  required: false\n");
  });

  test("Empty containers are written in flow form", () => {
    expect(yamlOf({ a: {}, b: [] })).toBe("a: {}\nb: []\n");
    expect(yamlOf({ a: [{}, []] })).toBe("a:\n  - {}\n  - []\n");
    expect(yamlOf({})).toBe("{}\n");
    expect(yamlOf([])).toBe("[]\n");
  });

  test("Keys keep the order they were inserted in", () => {
    const doc: any = {};
    doc.current = { name: "q1" };
    doc.progress = { remainingRequired: 1, answered: 0 };
    // The emitter never sorts: the document decides the order, and that is the renderer's job.
    expect(yamlOf(doc)).toBe("current:\n  name: q1\nprogress:\n  remainingRequired: 1\n  answered: 0\n");
  });
});

describe("interview yaml parses back with a real parser (issue #11818)", () => {
  const fixtures: { [name: string]: any } = {
    "the pet survey document": {
      progress: { answered: 1, remainingRequired: 1 },
      answered: { hasPet: "Yes" },
      changes: { becameVisible: ["petType", "petAge"], becameRequired: ["petType"] },
      current: {
        name: "petType", type: "dropdown", title: "What kind?", required: true,
        choices: [{ value: "Dog" }, { value: "Cat" }, { value: "Other" }],
      },
    },
    "addresses as keys and as values": {
      answered: { "medications[0].dose": "5mg", "matrix.row.column": "a,b" },
      changes: { becameVisible: ["medications[1].name", "matrix.row2.column"] },
    },
    "delimiters inside a flow sequence": { changes: { becameVisible: ["a,b", "[x]", "{y}", "c"] } },
    "words a parser types, as keys and as values": {
      answered: {
        "true": "true", "no": "no", "1": "1", "2024-01-01": "2024-01-01", "~": "~", "": "",
      },
      changes: { becameVisible: ["yes", "off", "1e3", "0x1f"] },
    },
    "an html description": {
      current: {
        name: "consent", type: "boolean", title: "Consent",
        description: "<b>Note</b>: read clause #1 before you answer",
        required: true,
      },
    },
    "a multi-line string": {
      current: { name: "q1", type: "comment", title: "Tell us more", description: "first line\nsecond line\tafter a tab" },
    },
    "an answered map holding arrays and objects": {
      answered: { colors: ["red", "green"], contact: { email: "a@b.c", phone: "" }, count: 3, agreed: false, note: null },
    },
    "empty containers and a null current": {
      progress: { answered: 0, remainingRequired: 0 },
      answered: { list: [], map: {} },
      current: null,
    },
  };

  Object.keys(fixtures).forEach(name => {
    test("It reads back unchanged: " + name, () => {
      const value = fixtures[name];
      expect(load(toYaml(value))).toEqual(value);
    });
  });

  test("Every scalar of the quoting tests reads back as the string it was", () => {
    const strings = [
      "", "Yes", "No", "yes", "null", "~", "1", "1e3", "0x1f", "1_000", "2024-01-01",
      "2024-01-01T10:30:00Z", "a: b", "#x", "a #b", " x", "x ", "x:", "[x]", "a,b", "- x", "x\ny",
      "x\ty", "Dog", "Do you have a pet?", "The value should not be greater than 40",
    ];
    const map: any = {};
    strings.forEach((text, index) => { map["s" + index] = text; });
    expect(load(toYaml(map))).toEqual(map);
    // The same strings as the items of a sequence, where the flow delimiters apply as well.
    expect(load(toYaml({ list: strings }))).toEqual({ list: strings });
  });
});
