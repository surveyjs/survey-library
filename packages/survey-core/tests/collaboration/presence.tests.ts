import { describe, test, expect, beforeEach, afterEach } from "vitest";
import { SurveyModel } from "survey-core";
import { CollaborationPlugin } from "../../src/plugins/collaboration/index";
import { IPresenceState, pageKey, resolvePage } from "../../src/plugins/collaboration/presence/presence-state";
import { presenceColorSlot, presenceInitials } from "../../src/plugins/collaboration/presence/presence-envelope";
import { PresenceRoster } from "../../src/plugins/collaboration/presence/presence-roster";

const twoPages = {
  pages: [
    { name: "p1", elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }] },
    { name: "p2", elements: [{ type: "text", name: "q3" }] }
  ]
};

// A survey root with real question nodes, so the overlay has something to decorate.
function renderRoot(names: Array<string>): HTMLElement {
  const root = document.createElement("div");
  names.forEach((name) => {
    const node = document.createElement("div");
    node.setAttribute("data-name", name);
    // jsdom reports zero-sized rects; the overlay only needs non-zero for cursors.
    root.appendChild(node);
  });
  document.body.appendChild(root);
  return root;
}

let roots: Array<HTMLElement> = [];
afterEach(() => {
  roots.splice(0).forEach((r) => r.remove());
  document.body.querySelectorAll(".collab-presence-layer").forEach((el) => el.remove());
});

function attach(survey: SurveyModel, names: Array<string>): HTMLElement {
  const root = renderRoot(names);
  roots.push(root);
  (survey as any).rootElement = root;
  return root;
}

describe("presence state codecs", () => {
  test("pageKey round-trips; survey-core auto-names pages, so the name is the key", () => {
    // Both pages need a question: survey-core leaves an empty page out of visiblePages,
    // and resolvePage refuses an invisible page on purpose.
    const survey = new SurveyModel({
      pages: [{ elements: [{ type: "text", name: "q1" }] }, { name: "p2", elements: [{ type: "text", name: "q2" }] }]
    });
    const first = survey.pages[0];
    // A page loaded from JSON always ends up with a name ("page1" here), so the
    // "#index" branch below is a fallback rather than the usual path.
    expect(pageKey(survey, first)).toBe(first.name);
    expect(resolvePage(survey, pageKey(survey, first))).toBe(first);
    expect(resolvePage(survey, "p2")).toBe(survey.pages[1]);
  });
  test("resolvePage still understands an index key from a peer", () => {
    const survey = new SurveyModel(twoPages);
    expect(resolvePage(survey, "#1")).toBe(survey.pages[1]);
    expect(resolvePage(survey, "#99")).toBeNull();
  });
  test("resolvePage returns null for an unknown page", () => {
    const survey = new SurveyModel(twoPages);
    expect(resolvePage(survey, "nope")).toBeNull();
    expect(resolvePage(survey, "")).toBeNull();
  });
  test("initials and colour slots are stable and identical on every client", () => {
    expect(presenceInitials("Ann Smith")).toBe("AS");
    expect(presenceInitials("Madonna")).toBe("MA");
    expect(presenceInitials("   ")).toBe("?");
    expect(presenceColorSlot("abc")).toBe(presenceColorSlot("abc"));
    // Slot 0 is the theme's "unknown user" grey, so a participant never gets it:
    // being painted the colour that means "nobody" reads as a rendering failure.
    for (const id of ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l"]) {
      expect(presenceColorSlot(id)).toBeGreaterThanOrEqual(1);
      expect(presenceColorSlot(id)).toBeLessThanOrEqual(9);
    }
  });
});

describe("presence roster", () => {
  let roster: PresenceRoster;
  beforeEach(() => { roster = new PresenceRoster(); });

  test("upsert, remove and clear each report once", () => {
    let fired = 0;
    roster.onPeersChanged.add(() => fired++);
    roster.upsertPeer({ clientId: "a", name: "Ann", state: { page: null, focus: null } });
    expect(fired).toBe(1);
    expect(roster.peers.size).toBe(1);
    roster.removePeer("a");
    expect(fired).toBe(2);
    // Removing something that is not there changes nothing and says nothing.
    roster.removePeer("a");
    expect(fired).toBe(2);
    roster.clear();
    expect(fired).toBe(2);
  });
  test("an entry without a state is refused", () => {
    roster.upsertPeer(<any>{ clientId: "a", name: "Ann" });
    expect(roster.peers.size).toBe(0);
  });
});

describe("presence capture", () => {
  test("the current page is reported as soon as it changes", () => {
    const survey = new SurveyModel(twoPages);
    attach(survey, ["q1", "q2"]);
    const plugin = new CollaborationPlugin(survey, { presenceCoalesceMs: 0 });
    const sent: Array<any> = [];
    plugin.onEvent.add((_s, o) => sent.push(o.message));

    survey.nextPage();
    const presence = sent.filter((m) => m.type === "presence");
    expect(presence.length).toBeGreaterThan(0);
    expect(presence[presence.length - 1].state.page).toBe("p2");
    expect(presence[presence.length - 1].retain).toBe(true);
    plugin.dispose();
  });

  test("a retained frame carries no cursor, an ephemeral one does", () => {
    const survey = new SurveyModel(twoPages);
    attach(survey, ["q1"]);
    const plugin = new CollaborationPlugin(survey, { presenceCoalesceMs: 0 });
    const retained = plugin.getState(true) as IPresenceState;
    const ephemeral = plugin.getState(false) as IPresenceState;
    // A stored cursor would be replayed to a late joiner as a ghost arrow.
    expect("cur" in retained).toBe(false);
    expect("cur" in ephemeral).toBe(true);
    plugin.dispose();
  });

  test("focus climbs to the top-level question", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "matrixdynamic", name: "m", rowCount: 1,
        columns: [{ name: "c1", cellType: "text" }]
      }]
    });
    attach(survey, ["m"]);
    const plugin = new CollaborationPlugin(survey, { presenceCoalesceMs: 0 });
    const sent: Array<any> = [];
    plugin.onEvent.add((_s, o) => sent.push(o.message));

    const matrix: any = survey.getQuestionByName("m");
    const cell = matrix.visibleRows[0].cells[0].question;
    survey.onFocusInQuestion.fire(survey, { question: cell } as any);

    const presence = sent.filter((m) => m.type === "presence");
    // The cell name is not unique across the survey; the matrix name is.
    expect(presence[presence.length - 1].state.focus).toBe("m");
    plugin.dispose();
  });
});

describe("presence overlay", () => {
  test("a peer focus stamps the attribute and the colour on the real node", () => {
    const survey = new SurveyModel(twoPages);
    const root = attach(survey, ["q1", "q2"]);
    root.style.setProperty("--sjs2-color-utility-user-bg-color-4", "#e6194b");
    const plugin = new CollaborationPlugin(survey);

    plugin.apply({
      type: "peer",
      peer: { clientId: "a", name: "Ann", colorIndex: 4, state: { page: "p1", focus: "q1" } }
    });

    const node = root.querySelector("[data-name=\"q1\"]") as HTMLElement;
    expect(node.getAttribute("data-collab-focus")).toBe("on");
    expect(node.style.getPropertyValue("--collab-peer-color")).toBe("#e6194b");
    expect((root.querySelector("[data-name=\"q2\"]") as HTMLElement).hasAttribute("data-collab-focus")).toBe(false);
    plugin.dispose();
  });

  test("a peer leaving removes the decoration", () => {
    const survey = new SurveyModel(twoPages);
    const root = attach(survey, ["q1"]);
    const plugin = new CollaborationPlugin(survey);
    plugin.apply({ type: "peer", peer: { clientId: "a", name: "Ann", state: { page: "p1", focus: "q1" } } });
    plugin.apply({ type: "peer-left", clientId: "a" });
    expect((root.querySelector("[data-name=\"q1\"]") as HTMLElement).hasAttribute("data-collab-focus")).toBe(false);
    plugin.dispose();
  });

  test("a closed connection clears the roster, so no ring is left behind", () => {
    const survey = new SurveyModel(twoPages);
    const root = attach(survey, ["q1"]);
    const plugin = new CollaborationPlugin(survey);
    plugin.apply({ type: "peer", peer: { clientId: "a", name: "Ann", state: { page: "p1", focus: "q1" } } });
    plugin.apply({ type: "status", status: "closed" });
    expect(plugin.peers.size).toBe(0);
    expect((root.querySelector("[data-name=\"q1\"]") as HTMLElement).hasAttribute("data-collab-focus")).toBe(false);
    plugin.dispose();
  });

  test("init replaces the roster wholesale", () => {
    const survey = new SurveyModel(twoPages);
    attach(survey, ["q1", "q2"]);
    const plugin = new CollaborationPlugin(survey);
    plugin.apply({ type: "peer", peer: { clientId: "gone", name: "Old", state: { page: "p1", focus: "q1" } } });
    plugin.apply({
      type: "init",
      values: {},
      peers: [{ clientId: "new", name: "New", state: { page: "p1", focus: "q2" } }]
    });
    expect(plugin.peers.has("gone")).toBe(false);
    expect(plugin.peers.has("new")).toBe(true);
    plugin.dispose();
  });

  test("two surveys on one page do not decorate each other", () => {
    const a = new SurveyModel(twoPages);
    const b = new SurveyModel(twoPages);
    const rootA = attach(a, ["q1"]);
    const rootB = attach(b, ["q1"]);
    const pluginA = new CollaborationPlugin(a);
    const pluginB = new CollaborationPlugin(b);

    pluginA.apply({ type: "peer", peer: { clientId: "x", name: "X", state: { page: "p1", focus: "q1" } } });

    expect((rootA.querySelector("[data-name=\"q1\"]") as HTMLElement).hasAttribute("data-collab-focus")).toBe(true);
    expect((rootB.querySelector("[data-name=\"q1\"]") as HTMLElement).hasAttribute("data-collab-focus")).toBe(false);
    pluginA.dispose();
    pluginB.dispose();
  });

  test("dispose leaves no attribute on a survey that outlives the plugin", () => {
    const survey = new SurveyModel(twoPages);
    const root = attach(survey, ["q1"]);
    const plugin = new CollaborationPlugin(survey);
    plugin.apply({ type: "peer", peer: { clientId: "a", name: "Ann", state: { page: "p1", focus: "q1" } } });
    plugin.dispose();
    expect((root.querySelector("[data-name=\"q1\"]") as HTMLElement).hasAttribute("data-collab-focus")).toBe(false);
    expect(document.body.querySelector(".collab-presence-layer")).toBeNull();
  });
});

describe("presence can be switched off", () => {
  test("every delegating member stays callable and silent", () => {
    const survey = new SurveyModel(twoPages);
    attach(survey, ["q1"]);
    const plugin = new CollaborationPlugin(survey, { presence: false });
    const sent: Array<any> = [];
    plugin.onEvent.add((_s, o) => sent.push(o.message));

    expect(() => plugin.apply({ type: "peer", peer: { clientId: "a", name: "A", state: {} } })).not.toThrow();
    expect(() => plugin.apply({ type: "peer-left", clientId: "a" })).not.toThrow();
    expect(() => plugin.goToParticipant("a")).not.toThrow();
    expect(plugin.peers.size).toBe(0);
    expect(plugin.getState(false)).toEqual({ page: null, focus: null });
    // An inert event still hands out a subscribable object rather than undefined.
    expect(() => plugin.onPeersChanged.add(() => {})).not.toThrow();

    survey.nextPage();
    expect(sent.filter((m) => m.type === "presence")).toHaveLength(0);
    // Values still sync with presence off.
    survey.setValue("q1", "x");
    expect(sent.filter((m) => m.type === "value")).toHaveLength(1);
    plugin.dispose();
  });
});

describe("announcing ourselves", () => {
  // Capture stays silent until something actually changes, so without an explicit
  // announcement nobody learns we are here until we happen to move - and we are
  // missing from every late joiner bootstrap. Found by an end-to-end run where two
  // idle participants could not see each other at all.
  test("init sends a retained frame even when nothing has changed locally", () => {
    const survey = new SurveyModel(twoPages);
    attach(survey, ["q1"]);
    const plugin = new CollaborationPlugin(survey, { presenceCoalesceMs: 0 });
    const sent: Array<any> = [];
    plugin.onEvent.add((_s, o) => sent.push(o.message));

    plugin.apply({ type: "init", values: {}, peers: [] });

    const presence = sent.filter((m) => m.type === "presence");
    expect(presence).toHaveLength(1);
    expect(presence[0].retain).toBe(true);
    expect(presence[0].state.page).toBe("p1");
    plugin.dispose();
  });
});

describe("one participant is one colour", () => {
  // The ring, the badge, the cursor and the avatar in the strip are drawn by three
  // different mechanisms. If they do not resolve the same source a participant shows
  // up in two colours at once and the colour stops identifying anybody - which is
  // exactly what an end-to-end screenshot caught. The theme's colour slot is that
  // single source; the relay assigns the slot NUMBER and never a colour.
  const peer = (colorIndex?: number) => ({
    type: "peer" as const,
    peer: {
      clientId: "a", name: "Ann", colorIndex,
      state: { page: "p1", focus: "q1" },
    },
  });

  test("the ring and the cursor resolve the slot the relay assigned", () => {
    const survey = new SurveyModel(twoPages);
    const root = attach(survey, ["q1"]);
    // The themed root is where the slots live; the cursor layer sits outside it,
    // which is why the value has to be resolved rather than left as a var().
    root.style.setProperty("--sjs2-color-utility-user-bg-color-3", "#123456");
    root.style.setProperty("--sjs2-color-utility-user-fg-on-color-3", "#abcdef");

    const plugin = new CollaborationPlugin(survey);
    plugin.apply(peer(3));

    const node = root.querySelector("[data-name=\"q1\"]") as HTMLElement;
    expect(node.style.getPropertyValue("--collab-peer-color")).toBe("#123456");

    const colors = plugin.presence.scene.peerColors(plugin.peers.get("a")!);
    expect(colors).toEqual({ bg: "#123456", fg: "#abcdef" });
    plugin.dispose();
  });

  test("a page with no theme slots falls back to one neutral grey", () => {
    const survey = new SurveyModel(twoPages);
    const root = attach(survey, ["q1"]);
    const plugin = new CollaborationPlugin(survey);
    plugin.apply(peer(3));
    // Only reachable without survey-core's theme, where the form is unstyled anyway.
    expect((root.querySelector("[data-name=\"q1\"]") as HTMLElement)
      .style.getPropertyValue("--collab-peer-color")).toBe("#808080");
    plugin.dispose();
  });

  // The slot used to be resolved separately by the ring, the cursor and the strip,
  // each with its own "?? hash the id" fallback. Three copies of one decision is how
  // they drifted apart; the roster now resolves it once, and this pins that down for
  // the case the copies disagreed on - a relay that assigns no slot at all.
  test("a relay that assigns no slot still paints one participant one colour", () => {
    const survey = new SurveyModel(twoPages);
    const root = attach(survey, ["q1"]);
    const slot = presenceColorSlot("a");
    root.style.setProperty("--sjs2-color-utility-user-bg-color-" + slot, "#abcabc");

    const plugin = new CollaborationPlugin(survey);
    plugin.apply(peer(undefined));

    expect((root.querySelector("[data-name=\"q1\"]") as HTMLElement)
      .style.getPropertyValue("--collab-peer-color")).toBe("#abcabc");
    const chip = plugin.bar.container.actions.filter((a) => a.id === "collab-peer-a")[0];
    expect(chip.innerCss).toContain("sv-collab-bar__avatar--color-" + slot);
    plugin.dispose();
  });

  test("the strip avatar is painted from the same slot index", () => {
    const survey = new SurveyModel(twoPages);
    attach(survey, ["q1"]);
    const plugin = new CollaborationPlugin(survey);
    plugin.apply(peer(3));
    const chip = plugin.bar.container.actions.filter((a) => a.id === "collab-peer-a")[0];
    // Same index as peerColors resolves, so the class and the ring agree by construction.
    expect(chip.innerCss).toContain("sv-collab-bar__avatar--color-3");
    plugin.dispose();
  });
});
