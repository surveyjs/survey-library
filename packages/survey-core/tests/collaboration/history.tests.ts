import { describe, test, expect, afterEach } from "vitest";
import { ComponentCollection, SurveyModel } from "survey-core";
import { CollaborationPlugin } from "../../src/plugins/collaboration/index";
import { IPresencePeerEntry } from "../../src/plugins/collaboration/presence/presence-envelope";
import { MAX_HISTORY_TEXT } from "../../src/plugins/collaboration/history/history-entry";

const threeQuestions = {
  elements: [
    { type: "text", name: "q1" },
    { type: "text", name: "q2" },
    { type: "text", name: "q3" }
  ]
};

let plugins: Array<CollaborationPlugin> = [];
let roots: Array<HTMLElement> = [];

afterEach(() => {
  plugins.splice(0).forEach((plugin) => plugin.dispose());
  roots.splice(0).forEach((root) => root.remove());
  document.body.querySelectorAll(".collab-presence-layer").forEach((el) => el.remove());
});

function make(json: any, options?: any): { survey: SurveyModel, plugin: CollaborationPlugin } {
  const survey = new SurveyModel(json);
  const plugin = new CollaborationPlugin(survey, options);
  plugins.push(plugin);
  return { survey, plugin };
}

function join(plugin: CollaborationPlugin, entry?: Partial<IPresencePeerEntry>): void {
  plugin.apply({
    type: "peer",
    peer: { clientId: "p1", name: "Ann", colorIndex: 3, state: { page: null, focus: null }, ...(entry || {}) },
  } as any);
}

function historyAction(plugin: CollaborationPlugin): any {
  return plugin.bar.container.actions.filter((action) => action.id === "collab-history")[0];
}

// A survey root shaped like a rendered one: the strip, the title and the form body
// are siblings inside the container, and the panel becomes a fourth.
let host: HTMLElement;

function attach(survey: SurveyModel): HTMLElement {
  const root = document.createElement("div");
  const container = document.createElement("div");
  container.className = "sd-container-modern";
  ["sv-collab-bar", "sv-header", "sv-components-row"].forEach((css) => {
    const child = document.createElement("div");
    child.className = css;
    container.appendChild(child);
  });
  root.appendChild(container);
  document.body.appendChild(root);
  roots.push(root);
  (survey as any).rootElement = root;
  host = container;
  return container;
}

// jsdom reports every box as zero, so a height has to be faked to test that the
// panel measures at all.
function fakeHeight(el: Element, height: number): void {
  (el as any).getBoundingClientRect = () => ({ height, width: 0, top: 0, left: 0, right: 0, bottom: height, x: 0, y: 0 });
}

function panel(root: ParentNode = document.body): HTMLElement | null {
  return root.querySelector(".sv-collab-changes");
}

function rows(): Array<HTMLElement> {
  return Array.prototype.slice.call(host.querySelectorAll(".sv-collab-changes__row"));
}

function textOf(row: HTMLElement, part: string): string {
  return (row.querySelector(".sv-collab-changes__" + part) as HTMLElement)?.textContent ?? "";
}

describe("history: attribution", () => {
  test("a peer edit is recorded with the name and colour slot the roster knows", () => {
    const { plugin } = make(threeQuestions);
    join(plugin);
    plugin.apply({ type: "value", from: "p1", key: "q1", value: "hello" } as any);

    expect(plugin.history.entries).toHaveLength(1);
    const entry = plugin.history.entries[0];
    expect(entry.clientId).toBe("p1");
    expect(entry.name).toBe("Ann");
    expect(entry.colorIndex).toBe(3);
    expect(entry.questionName).toBe("q1");
    expect(entry.text).toBe("hello");
  });

  test("an author who has left stays named in the entries they left behind", () => {
    const { plugin } = make(threeQuestions);
    join(plugin);
    plugin.apply({ type: "value", from: "p1", key: "q1", value: "hello" } as any);
    plugin.apply({ type: "peer-left", clientId: "p1" });

    expect(plugin.peers.size).toBe(0);
    // The entry holds a snapshot, not a roster lookup.
    expect(plugin.history.entries[0].name).toBe("Ann");
    expect(plugin.history.entries[0].colorIndex).toBe(3);
  });

  test("an edit from someone the roster does not know is nameless on slot 0", () => {
    const { plugin } = make(threeQuestions);
    // A peer that has sent no presence, then a relay that stamps no `from` at all.
    plugin.apply({ type: "value", from: "ghost", key: "q1", value: "a" } as any);
    plugin.apply({ type: "value", key: "q2", value: "b" } as any);

    expect(plugin.history.entries.map((e) => [e.clientId, e.name, e.colorIndex]))
      .toEqual([["ghost", "", 0], ["", "", 0]]);
  });

  test("our own edit is recorded as ours", () => {
    const { survey, plugin } = make(threeQuestions);
    survey.setValue("q1", "mine");

    expect(plugin.history.entries).toHaveLength(1);
    expect(plugin.history.entries[0].clientId).toBeNull();
  });

  test("a cascade of a peer edit is credited to that peer, not to us", () => {
    const { plugin } = make({
      elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }],
      triggers: [{ type: "setvalue", expression: "{q1} = 'go'", setToName: "q2", setValue: "done" }],
    });
    join(plugin);
    plugin.apply({ type: "value", from: "p1", key: "q1", value: "go" } as any);

    const byQuestion = new Map(plugin.history.entries.map((e) => [e.questionName, e]));
    // The trigger wrote q2 locally and that edit goes out as ours - but it happened
    // because of Ann, and the log says so.
    expect(byQuestion.get("q2")?.text).toBe("done");
    expect(byQuestion.get("q2")?.clientId).toBe("p1");
    expect(byQuestion.get("q1")?.clientId).toBe("p1");
  });
});

describe("history: keeping the log usable", () => {
  test("consecutive edits of one question by one author collapse into one entry", () => {
    const { plugin } = make(threeQuestions);
    join(plugin);
    plugin.apply({ type: "value", from: "p1", key: "q1", value: "a" } as any);
    plugin.apply({ type: "value", from: "p1", key: "q1", value: "ab" } as any);
    plugin.apply({ type: "value", from: "p1", key: "q1", value: "abc" } as any);

    expect(plugin.history.entries).toHaveLength(1);
    expect(plugin.history.entries[0].text).toBe("abc");
  });

  test("edits of different questions stay separate entries", () => {
    const { plugin } = make(threeQuestions);
    join(plugin);
    plugin.apply({ type: "value", from: "p1", key: "q1", value: "a" } as any);
    plugin.apply({ type: "value", from: "p1", key: "q2", value: "b" } as any);

    expect(plugin.history.entries.map((e) => e.questionName)).toEqual(["q1", "q2"]);
  });

  test("the log is bounded: the oldest entries fall out", () => {
    const { plugin } = make(threeQuestions, { historyLimit: 2 });
    join(plugin);
    plugin.apply({ type: "value", from: "p1", key: "q1", value: "a" } as any);
    plugin.apply({ type: "value", from: "p1", key: "q2", value: "b" } as any);
    plugin.apply({ type: "value", from: "p1", key: "q3", value: "c" } as any);

    expect(plugin.history.entries.map((e) => e.questionName)).toEqual(["q2", "q3"]);
  });

  test("a file answer reads as changed, never as its content", () => {
    const { plugin } = make({ elements: [{ type: "file", name: "q1" }] });
    join(plugin);
    const content = "data:image/png;base64," + "A".repeat(5000);
    plugin.apply({
      type: "value", from: "p1", key: "q1",
      value: [{ name: "plan.png", type: "image/png", content }],
    } as any);

    const entry = plugin.history.entries[0];
    expect(entry.text).toBe("changed");
    expect(entry.text.length).toBeLessThanOrEqual(MAX_HISTORY_TEXT);
  });

  test("a long answer is truncated", () => {
    const { plugin } = make(threeQuestions);
    join(plugin);
    plugin.apply({ type: "value", from: "p1", key: "q1", value: "x".repeat(500) } as any);

    expect(plugin.history.entries[0].text).toHaveLength(MAX_HISTORY_TEXT);
  });

  test("clearing an answer reads as cleared rather than as a blank entry", () => {
    const { plugin } = make(threeQuestions);
    join(plugin);
    plugin.apply({ type: "value", from: "p1", key: "q1", value: "a" } as any);
    plugin.apply({ type: "value", from: "p1", key: "q1", value: "" } as any);

    expect(plugin.history.entries).toHaveLength(1);
    expect(plugin.history.entries[0].text).toBe("cleared");
  });
});

// The log describes what changed in THIS survey, not what travelled: a message that
// changes nothing here - a value we already hold, a row that carries no answer - leaves
// no entry.
describe("history: only what actually changed", () => {
  const matrixJson = {
    elements: [{ type: "matrixdynamic", name: "m", rowCount: 1, columns: [{ name: "a", cellType: "text" }] }]
  };

  test("a peer value we already hold leaves no entry", () => {
    const { survey, plugin } = make(threeQuestions);
    join(plugin);
    survey.setValue("q1", "mine");
    plugin.apply({ type: "value", from: "p1", key: "q1", value: "mine" } as any);

    expect(plugin.history.entries.map((e) => e.clientId)).toEqual([null]);
  });

  test("the same value from a second peer leaves no second entry", () => {
    const { plugin } = make(threeQuestions);
    join(plugin);
    plugin.apply({ type: "peer", peer: { clientId: "p2", name: "Bob", colorIndex: 4, state: { page: null, focus: null } } } as any);
    plugin.apply({ type: "value", from: "p1", key: "q1", value: "a" } as any);
    plugin.apply({ type: "value", from: "p2", key: "q1", value: "a" } as any);

    expect(plugin.history.entries.map((e) => e.name)).toEqual(["Ann"]);
  });

  test("adding an empty row leaves no entry", () => {
    // No merge window, so a second entry could not hide inside the first one.
    const { survey, plugin } = make(matrixJson, { historyMergeMs: -1 });
    survey.setValue("m", [{ a: "1" }]);
    expect(plugin.history.entries).toHaveLength(1);

    (survey.getQuestionByName("m") as any).addRow();
    expect(plugin.history.entries).toHaveLength(1);
  });

  test("a peer's row that holds no answer leaves no entry", () => {
    const { plugin } = make(matrixJson);
    join(plugin);
    plugin.apply({ type: "init", values: { m: [{ a: "1" }] }, peers: [] });
    plugin.apply({ type: "value", from: "p1", key: "m", value: [{ a: "1" }, {}] } as any);
    expect(plugin.history.entries).toHaveLength(0);
  });

  test("empty rows arriving in an empty matrix leave no entry", () => {
    const { plugin } = make(matrixJson);
    join(plugin);
    plugin.apply({ type: "value", from: "p1", key: "m", value: [{}, {}] } as any);
    expect(plugin.history.entries).toHaveLength(0);
  });

  test("a comment is recorded under its question", () => {
    const { survey, plugin } = make({ elements: [{ type: "dropdown", name: "q1", choices: ["a"], showOtherItem: true }] });
    survey.commentSuffix = "-SOMETHING-ELSE";
    survey.setComment("q1", "note");

    const entry = plugin.history.entries[0];
    expect([entry.questionName, entry.isComment, entry.text]).toEqual(["q1", true, "note"]);
  });
});

describe("history: the session boundary", () => {
  test("init clears what was recorded before it", () => {
    const { plugin } = make(threeQuestions);
    join(plugin);
    plugin.apply({ type: "value", from: "p1", key: "q1", value: "a" } as any);
    expect(plugin.history.entries).toHaveLength(1);

    // A reconnect: init replaces the state wholesale, so the old entries describe
    // something that is no longer there.
    plugin.apply({ type: "init", values: { q1: "server wins" }, peers: [] });
    expect(plugin.history.entries).toHaveLength(0);
  });

  test("switching the history off leaves the rest of the plugin working", () => {
    const { survey, plugin } = make(threeQuestions, { history: false });
    expect(plugin.history).toBeUndefined();
    plugin.apply({ type: "value", from: "p1", key: "q1", value: "a" } as any);
    survey.setValue("q2", "b");

    expect(survey.getValue("q1")).toBe("a");
  });
});

describe("history: the changes panel", () => {
  test("the button sits at the far right of the strip", () => {
    const { plugin } = make(threeQuestions);
    join(plugin);

    const actions = plugin.bar.container.actions;
    expect(actions[actions.length - 1].id).toBe("collab-history");
  });

  test("the button is a plain toggle that reports its state", () => {
    const { survey, plugin } = make(threeQuestions);
    const row = attach(survey);
    const action = historyAction(plugin);
    expect(action.visible).toBe(true);
    // A real button, like Invite beside it - not the flat default of the strip.
    expect(action.appearance).toEqual({ style: "brand", mode: "primary", size: "x-small" });
    expect(action.active).toBeFalsy();
    expect(panel(row)).toBeNull();

    action.action();
    expect(action.active).toBe(true);
    expect(panel(row)).not.toBeNull();

    action.action();
    expect(action.active).toBe(false);
    expect(panel(row)).toBeNull();
  });

  test("the panel docks into the survey container, beside the title and the form", () => {
    const { survey, plugin } = make(threeQuestions);
    const container = attach(survey);
    plugin.toggleHistory();

    const node = panel(container) as HTMLElement;
    // A sibling of the strip and the title, not of the row that holds the form body:
    // that row starts below the title, and docking there left a gap under the strip.
    expect(node.parentElement).toBe(container);
    // Appended last, so the framework never has to remove a child it did not create
    // from the middle of its own list.
    expect(container.lastElementChild).toBe(node);
  });

  test("an empty history says so", () => {
    const { survey, plugin } = make(threeQuestions);
    attach(survey);
    plugin.toggleHistory();

    expect(rows()).toHaveLength(0);
    expect((host.querySelector(".sv-collab-changes__empty") as HTMLElement).textContent)
      .toBe("Nothing has changed yet");
  });

  test("entries are listed newest first, with the author's initials and colour slot", () => {
    const { survey, plugin } = make(threeQuestions);
    attach(survey);
    join(plugin);
    plugin.apply({ type: "value", from: "p1", key: "q1", value: "a" } as any);
    plugin.apply({ type: "value", from: "p1", key: "q2", value: "b" } as any);
    plugin.toggleHistory();

    const list = rows();
    expect(list).toHaveLength(2);
    expect(list.map((r) => textOf(r, "what"))).toEqual(["q2", "q1"]);
    expect(list.map((r) => textOf(r, "value"))).toEqual(["b", "a"]);
    expect(textOf(list[0], "who")).toBe("Ann");
    const avatar = list[0].querySelector(".sv-collab-changes__avatar") as HTMLElement;
    expect(avatar.textContent).toBe("AN");
    expect(avatar.classList.contains("sv-collab-changes__avatar--color-3")).toBe(true);
  });

  test("an open panel picks up later edits", () => {
    const { survey, plugin } = make(threeQuestions);
    attach(survey);
    plugin.toggleHistory();
    expect(rows()).toHaveLength(0);

    join(plugin);
    plugin.apply({ type: "value", from: "p1", key: "q1", value: "a" } as any);
    expect(rows()).toHaveLength(1);
  });

  test("our own edit reads as ours, on the neutral slot", () => {
    const { survey, plugin } = make(threeQuestions);
    attach(survey);
    survey.setValue("q1", "mine");
    plugin.toggleHistory();

    const row = rows()[0];
    expect(textOf(row, "who")).toBe("You");
    expect((row.querySelector(".sv-collab-changes__avatar") as HTMLElement)
      .classList.contains("sv-collab-changes__avatar--color-0")).toBe(true);
  });

  test("a name from a peer is text, never markup", () => {
    const { survey, plugin } = make(threeQuestions);
    attach(survey);
    plugin.apply({
      type: "peer",
      peer: { clientId: "p2", name: "<img src=x onerror=1>", colorIndex: 2, state: { page: null, focus: null } },
    } as any);
    plugin.apply({ type: "value", from: "p2", key: "q1", value: "<b>bold</b>" } as any);
    plugin.toggleHistory();

    const row = rows()[0];
    expect(textOf(row, "who")).toBe("<img src=x onerror=1>");
    expect(textOf(row, "value")).toBe("<b>bold</b>");
    expect(row.querySelector("img")).toBeNull();
    expect(row.querySelector("b")).toBeNull();
  });

  test("clicking a row goes to the question it changed", () => {
    const { survey, plugin } = make({
      pages: [
        { name: "p1", elements: [{ type: "text", name: "q1" }] },
        { name: "p2", elements: [{ type: "text", name: "q2" }] },
      ],
    });
    attach(survey);
    join(plugin);
    plugin.apply({ type: "value", from: "p1", key: "q2", value: "b" } as any);
    plugin.toggleHistory();

    expect(survey.currentPage.name).toBe("p1");
    (rows()[0].querySelector(".sv-collab-changes__row") ?? rows()[0]).dispatchEvent(new MouseEvent("click"));
    // Navigating to a peer's question switches the page but never focuses it.
    expect(survey.currentPage.name).toBe("p2");
  });

  test("disposing the plugin takes the panel with it", () => {
    const { survey, plugin } = make(threeQuestions);
    const row = attach(survey);
    plugin.toggleHistory();
    expect(panel(row)).not.toBeNull();

    plugin.dispose();
    expect(panel(row)).toBeNull();
  });
});

describe("history: the panel stays put while the form scrolls", () => {
  test("it hands CSS the strip height and the form viewport", () => {
    const { survey, plugin } = make(threeQuestions);
    const container = attach(survey);
    fakeHeight((survey as any).rootElement, 800);
    fakeHeight(container.querySelector(".sv-collab-bar") as Element, 49);

    plugin.toggleHistory();

    const node = panel(container) as HTMLElement;
    // Nothing in survey-core publishes the height of the sticky strip, so the panel
    // measures it: without this the panel would start underneath it.
    expect(node.style.getPropertyValue("--sv-collab-changes-top")).toBe("49px");
    // And the height of the form's viewport, because a percentage would resolve
    // against the grid area, which is as tall as the whole form.
    expect(node.style.getPropertyValue("--sv-collab-changes-max")).toBe("800px");
  });

  test("with no strip the panel starts at the top", () => {
    const { survey, plugin } = make(threeQuestions, { bar: false });
    const container = attach(survey);
    container.querySelector(".sv-collab-bar")?.remove();
    fakeHeight((survey as any).rootElement, 600);

    plugin.toggleHistory();

    expect((panel(container) as HTMLElement).style.getPropertyValue("--sv-collab-changes-top"))
      .toBe("0px");
  });

  test("closing the panel stops it watching for resizes", () => {
    const { survey, plugin } = make(threeQuestions);
    attach(survey);
    plugin.toggleHistory();
    const observer = (plugin.historyPanel as any).sizeObserver;
    expect(observer).toBeDefined();

    plugin.toggleHistory();
    expect((plugin.historyPanel as any).sizeObserver).toBeUndefined();
  });
});

// A matrix, a dynamic panel, multiple text and a composite have an OBJECT for a display
// value, or an array of them. The entry spells it out instead of printing
// "[object Object]".
describe("history: answers that are objects", () => {
  test("a matrix reads as its rows and columns", () => {
    const { plugin } = make({
      elements: [{
        type: "matrix", name: "q1",
        columns: [{ value: "c1", text: "Good" }, { value: "c2", text: "Bad" }],
        rows: [{ value: "r1", text: "Quality" }, { value: "r2", text: "Price" }],
      }]
    });
    join(plugin);
    plugin.apply({ type: "value", from: "p1", key: "q1", value: { r1: "c1", r2: "c2" } } as any);

    expect(plugin.history.entries[0].text).toBe("Quality: Good, Price: Bad");
  });

  test("a dropdown matrix brackets each row's cells", () => {
    const { plugin } = make({
      elements: [{
        type: "matrixdropdown", name: "q1",
        columns: [{ name: "a", title: "A", cellType: "text" }, { name: "b", title: "B", cellType: "text" }],
        rows: [{ value: "row1", text: "Row 1" }, { value: "row2", text: "Row 2" }],
      }]
    });
    join(plugin);
    plugin.apply({ type: "value", from: "p1", key: "q1", value: { row1: { a: "1" }, row2: { a: "2", b: "3" } } } as any);

    expect(plugin.history.entries[0].text).toBe("Row 1: (A: 1), Row 2: (A: 2, B: 3)");
  });

  test("a dynamic matrix lists its rows, separated by semicolons", () => {
    const { plugin } = make({
      elements: [{
        type: "matrixdynamic", name: "q1", rowCount: 2,
        columns: [{ name: "a", title: "A", cellType: "text" }, { name: "b", title: "B", cellType: "text" }],
      }]
    });
    join(plugin);
    plugin.apply({ type: "value", from: "p1", key: "q1", value: [{ a: "1", b: "2" }, { a: "3" }] } as any);

    expect(plugin.history.entries[0].text).toBe("A: 1, B: 2; A: 3");
  });

  test("a dynamic panel lists its panels and skips the empty ones", () => {
    const { plugin } = make({
      elements: [{ type: "paneldynamic", name: "q1", panelCount: 3, templateElements: [{ type: "text", name: "t", title: "T" }] }]
    });
    join(plugin);
    plugin.apply({ type: "value", from: "p1", key: "q1", value: [{ t: "hi" }, {}, { t: "yo" }] } as any);

    expect(plugin.history.entries[0].text).toBe("T: hi; T: yo");
  });

  test("multiple text reads as its items", () => {
    const { plugin } = make({
      elements: [{ type: "multipletext", name: "q1", items: [{ name: "first", title: "First" }, { name: "last", title: "Last" }] }]
    });
    join(plugin);
    plugin.apply({ type: "value", from: "p1", key: "q1", value: { first: "Ann", last: "Lee" } } as any);

    expect(plugin.history.entries[0].text).toBe("First: Ann, Last: Lee");
  });

  function registerAddress(): void {
    ComponentCollection.Instance.add({
      name: "collabhistoryaddress",
      elementsJSON: [
        { type: "text", name: "street", title: "Street" },
        { type: "matrixdynamic", name: "items", title: "Items", columns: [{ name: "sku", title: "SKU", cellType: "text" }] },
      ],
    });
  }

  test("a composite reads as its fields, with a nested matrix in brackets", () => {
    registerAddress();
    const { survey, plugin } = make({ elements: [{ type: "collabhistoryaddress", name: "q1" }] });
    attach(survey);
    join(plugin);
    plugin.apply({
      type: "value", from: "p1", key: "q1",
      value: { street: "Main 5", items: [{ sku: "X1" }, { sku: "Y2" }] },
    } as any);
    plugin.toggleHistory();

    expect(plugin.history.entries[0].text).toBe("Street: Main 5, Items: (SKU: X1; SKU: Y2)");
    // What the panel shows, which is where "[object Object]" was seen.
    expect(textOf(rows()[0], "value")).toBe("Street: Main 5, Items: (SKU: X1; SKU: Y2)");
  });

  test("our own edit of a composite field reads as the whole composite", () => {
    registerAddress();
    const { survey, plugin } = make({ elements: [{ type: "collabhistoryaddress", name: "q1" }] });
    (survey.getQuestionByName("q1") as any).contentPanel.getQuestionByName("street").value = "Main 5";

    const entry = plugin.history.entries[0];
    expect([entry.clientId, entry.text]).toEqual([null, "Street: Main 5"]);
  });

  test("a value with no question behind it is spelled out, not serialized", () => {
    const { plugin } = make(threeQuestions);
    join(plugin);
    plugin.apply({ type: "value", from: "p1", key: "nosuch", value: { a: "1", b: ["x", "y"] } } as any);

    expect(plugin.history.entries[0].text).toBe("a: 1, b: (x, y)");
  });

  test("a matrix whose rows are left holding nothing reads as cleared", () => {
    const { plugin } = make({
      elements: [{ type: "matrixdynamic", name: "q1", rowCount: 2, columns: [{ name: "a", title: "A", cellType: "text" }] }]
    });
    join(plugin);
    plugin.apply({ type: "value", from: "p1", key: "q1", value: [{ a: "1" }, {}] } as any);
    plugin.apply({ type: "value", from: "p1", key: "q1", value: [{}, {}] } as any);

    expect(plugin.history.entries).toHaveLength(1);
    expect(plugin.history.entries[0].text).toBe("cleared");
  });
});

// A file or a signature is data, not an answer anyone can read in a log - whether it
// travels as base64 (storeDataAsText) or as a storage URL. The entry says only that it
// changed, and says it for any question that holds one, however deep.
describe("history: files and signatures", () => {
  const png = "data:image/png;base64," + "A".repeat(5000);

  function textAfter(json: any, value: any): string {
    const { plugin } = make(json);
    join(plugin);
    plugin.apply({ type: "value", from: "p1", key: "q1", value } as any);
    return plugin.history.entries[0].text;
  }

  test("a file stored as a URL reads as changed", () => {
    expect(textAfter(
      { elements: [{ type: "file", name: "q1", storeDataAsText: false }] },
      [{ name: "plan.png", type: "image/png", content: "/api/rooms/r1/files/0f3c" }]
    )).toBe("changed");
  });

  test("a signature reads as changed in both storage modes", () => {
    expect(textAfter({ elements: [{ type: "signaturepad", name: "q1" }] }, png)).toBe("changed");
    expect(textAfter(
      { elements: [{ type: "signaturepad", name: "q1", storeDataAsText: false }] },
      "/api/rooms/r1/files/77ab"
    )).toBe("changed");
  });

  test("a composite holding a file reads as changed, even for an edit of its text", () => {
    ComponentCollection.Instance.add({
      name: "collabhistorydocs",
      elementsJSON: [
        { type: "text", name: "title", title: "Title" },
        { type: "panel", name: "inner", elements: [{ type: "file", name: "doc", title: "Doc" }] },
      ],
    });
    const { survey, plugin } = make({ elements: [{ type: "collabhistorydocs", name: "q1" }] });
    (survey.getQuestionByName("q1") as any).contentPanel.getQuestionByName("title").value = "Plan";

    expect(plugin.history.entries[0].text).toBe("changed");
  });

  test("a dynamic panel whose template holds a signature reads as changed", () => {
    expect(textAfter(
      { elements: [{ type: "paneldynamic", name: "q1", panelCount: 0, templateElements: [{ type: "signaturepad", name: "sig" }, { type: "text", name: "t" }] }] },
      [{ sig: png, t: "Ann" }]
    )).toBe("changed");
  });

  test("a single-question component over a file or a signature reads as changed", () => {
    ComponentCollection.Instance.add({ name: "collabhistoryonefile", questionJSON: { type: "file" } });
    ComponentCollection.Instance.add({ name: "collabhistoryonesig", questionJSON: { type: "signaturepad" } });

    expect(textAfter({ elements: [{ type: "collabhistoryonefile", name: "q1" }] },
      [{ name: "plan.png", type: "image/png", content: png }])).toBe("changed");
    expect(textAfter({ elements: [{ type: "collabhistoryonesig", name: "q1" }] }, png)).toBe("changed");
  });

  // A dynamic panel builds its panels only once its page is rendered, so on a page this
  // participant has not opened yet its nested questions are not there to be asked.
  test("a dynamic panel on a page not opened yet still reads as changed", () => {
    const pages = (panel: any) => ({ pages: [{ elements: [{ type: "text", name: "q0" }] }, { elements: [panel] }] });
    const withSignature = { type: "paneldynamic", name: "q1", templateElements: [{ type: "signaturepad", name: "sig" }, { type: "text", name: "t" }] };
    const withFile = { type: "paneldynamic", name: "q1", templateElements: [{ type: "file", name: "f" }] };

    expect(textAfter(pages(withSignature), [{ sig: "/api/rooms/r1/files/77ab", t: "Ann" }])).toBe("changed");
    expect(textAfter(pages(withSignature), [{ sig: png, t: "Ann" }, { sig: png, t: "Bob" }])).toBe("changed");
    expect(textAfter(pages(withFile), [{ f: [{ name: "plan.png", type: "image/png", content: png }] }])).toBe("changed");
  });

  test("a composite holding such a dynamic panel on a page not opened yet reads as changed", () => {
    ComponentCollection.Instance.add({
      name: "collabhistorypeople",
      elementsJSON: [
        { type: "text", name: "title", title: "Title" },
        { type: "paneldynamic", name: "people", templateElements: [{ type: "signaturepad", name: "sig" }] },
      ],
    });
    const json = { pages: [{ elements: [{ type: "text", name: "q0" }] }, { elements: [{ type: "collabhistorypeople", name: "q1" }] }] };

    expect(textAfter(json, { title: "Plan", people: [{ sig: "/api/rooms/r1/files/77ab" }] })).toBe("changed");
  });

  test("our own value for such a dynamic panel reads as changed too", () => {
    const { survey, plugin } = make({
      pages: [
        { elements: [{ type: "text", name: "q0" }] },
        { elements: [{ type: "paneldynamic", name: "q1", templateElements: [{ type: "signaturepad", name: "sig" }] }] },
      ]
    });
    survey.setValue("q1", [{ sig: png }]);

    expect(plugin.history.entries[0].text).toBe("changed");
  });

  test("clearing a file still reads as cleared", () => {
    const { plugin } = make({ elements: [{ type: "file", name: "q1" }] });
    join(plugin);
    plugin.apply({ type: "value", from: "p1", key: "q1", value: [{ name: "plan.png", type: "image/png", content: png }] } as any);
    plugin.apply({ type: "value", from: "p1", key: "q1", value: [] } as any);

    expect(plugin.history.entries[0].text).toBe("cleared");
  });
});
