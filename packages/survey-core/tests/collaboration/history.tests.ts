import { describe, test, expect, afterEach } from "vitest";
import { SurveyModel } from "survey-core";
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

  test("a file answer is described by its name, never by its content", () => {
    const { plugin } = make({ elements: [{ type: "file", name: "q1" }] });
    join(plugin);
    const content = "data:image/png;base64," + "A".repeat(5000);
    plugin.apply({
      type: "value", from: "p1", key: "q1",
      value: [{ name: "plan.png", type: "image/png", content }],
    } as any);

    const entry = plugin.history.entries[0];
    expect(entry.text).toBe("plan.png");
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
    plugin.apply({ type: "value", from: "p1", key: "q1", value: "" } as any);

    expect(plugin.history.entries[0].text).toBe("cleared");
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
