import { describe, test, expect, afterEach } from "vitest";
import { SurveyModel } from "survey-core";
import { CollaborationPlugin } from "../../src/plugins/collaboration/index";
import { COLLAB_BAR_ELEMENT_ID, COLLAB_BAR_INDEX } from "../../src/plugins/collaboration/bar/bar-model";

const json = { elements: [{ type: "text", name: "q1" }] };

let plugins: Array<CollaborationPlugin> = [];
afterEach(() => {
  plugins.splice(0).forEach((p) => p.dispose());
  document.body.querySelectorAll(".collab-presence-layer").forEach((el) => el.remove());
});

function make(options: any = {}): { survey: SurveyModel, plugin: CollaborationPlugin } {
  const survey = new SurveyModel(json);
  const plugin = new CollaborationPlugin(survey, options);
  plugins.push(plugin);
  return { survey, plugin };
}

function titles(plugin: CollaborationPlugin): Array<string> {
  // The spacer and the collapsed overflow carry no title; only real rows matter here.
  return plugin.bar.container.actions
    .filter((a) => a.visible !== false && !!a.title)
    .map((a) => a.title);
}

describe("the bar reaches the survey through the existing layout slot", () => {
  test("it is contributed as a header layout element rendered by sv-action-bar", () => {
    const { survey, plugin } = make();
    const content = survey.getContainerContent("header" as any);
    const element = content.filter((e: any) => e.id === COLLAB_BAR_ELEMENT_ID)[0];
    // No new component in any UI package and no new property on SurveyModel: the
    // action bar the library already registers everywhere does the rendering.
    expect(element).toBeTruthy();
    expect(element.component).toBe("sv-action-bar");
    expect(element.data).toBe(plugin.bar.container);
    expect((plugin.bar.container as any).containerCss).toBe("sv-collab-bar");
  });

  // contentTop is where this used to live, and every one of its problems came from
  // that: it renders inside .sd-body (a wrapper div, a 40px top padding, and a
  // containing block too short for sticky) and only while a page is showing.
  test("it is NOT in contentTop, whose container is what caused the placement bugs", () => {
    const { survey } = make();
    expect(survey.getContainerContent("contentTop" as any)).toHaveLength(0);
  });

  // The strip shares the header container with the theme's advanced header (-100)
  // and the top progress bar (-150); getContainerContent sorts on index, so this is
  // the only thing keeping the strip the outermost chrome.
  // headerView defaults to "advanced", so on a default form the title IS a layout
  // element in this same container - and getContainerContent sorts on index. This is
  // what puts the strip above the title without any CSS at all in that case; the
  // order:-1 rule covers headerView: "basic", where the title is not a layout element.
  test("it sorts before the advanced header and the top progress bar", () => {
    const { survey } = make();
    const content = survey.getContainerContent("header" as any);
    expect(content[0].id).toBe(COLLAB_BAR_ELEMENT_ID);
    expect(content.filter((e: any) => e.id === "advanced-header")).toHaveLength(1);
    expect(COLLAB_BAR_INDEX).toBeLessThan(-150);
  });

  test("dispose removes it again", () => {
    const { survey, plugin } = make();
    plugin.dispose();
    plugins.length = 0;
    const content = survey.getContainerContent("header" as any);
    expect(content.filter((e: any) => e.id === COLLAB_BAR_ELEMENT_ID)).toHaveLength(0);
  });

  test("a survey without the plugin gets no layout element of ours", () => {
    const survey = new SurveyModel(json);
    // The header container is NOT empty by default - headerView is "advanced", so the
    // survey's own title lives here as a layout element too. That is exactly why the
    // strip needs an index rather than relying on insertion order.
    const content = survey.getContainerContent("header" as any);
    expect(content.filter((e: any) => e.id === COLLAB_BAR_ELEMENT_ID)).toHaveLength(0);
  });
});

describe("bar contents", () => {
  test("info rows are rendered verbatim and nothing is inferred from them", () => {
    const { plugin } = make({ info: [{ label: "Room", value: "abc" }, { label: "Framework", value: "React" }] });
    expect(titles(plugin)).toContain("Room: abc");
    expect(titles(plugin)).toContain("Framework: React");
  });

  test("no info means no rows", () => {
    const { plugin } = make();
    expect(titles(plugin).filter((t) => t.indexOf(":") > 0)).toHaveLength(0);
  });

  test("the invite button appears only when a link provider is given", () => {
    const withLink = make({ getInviteLink: () => "https://example.test/?room=abc" });
    expect(titles(withLink.plugin)).toContain("Invite");
    const without = make();
    expect(titles(without.plugin)).not.toContain("Invite");
  });

  test("status is shown only when it is not the expected one", () => {
    const { plugin } = make();
    const status = () => plugin.bar.container.actions.filter((a) => a.id === "collab-status")[0];
    plugin.apply({ type: "status", status: "closed" });
    expect(status().visible).toBe(true);
    expect(status().title).toBe("Disconnected");
    // "connected" is the state the form is supposed to be in: saying so is noise.
    plugin.apply({ type: "init", values: {} });
    expect(status().visible).toBe(false);
  });
});

describe("participants", () => {
  const peer = (id: string, name: string) => ({
    type: "peer" as const,
    peer: { clientId: id, name, state: { page: null, focus: null } },
  });

  test("a chip carries initials, a full-name tooltip and a colour-slot class", () => {
    const { plugin } = make();
    plugin.apply(peer("a", "Ann Smith"));
    const chip = plugin.bar.container.actions.filter((a) => a.id === "collab-peer-a")[0];
    expect(chip.title).toBe("AS");
    expect(chip.tooltip).toBe("Ann Smith");
    // A class, not an inline hex: the theme slot keeps the avatar legible in both
    // light and dark palettes.
    expect(chip.innerCss).toContain("sv-collab-bar__avatar");
    expect(chip.innerCss).toMatch(/sv-collab-bar__avatar--color-\d/);
  });

  // The strip uses the library's own compact action size instead of overriding padding
  // and font-size in CSS. The size is set on the CONTAINER, and this is why: chips are
  // rebuilt from scratch on every roster change, so an implementation that applied the
  // appearance once to the actions present at the time would leave every later
  // participant at the default size.
  test("a chip created after the appearance was set is still compact", () => {
    const { plugin } = make();
    plugin.apply(peer("a", "Ann"));
    plugin.apply(peer("b", "Bob"));

    const chips = ["a", "b"].map((id) =>
      plugin.bar.container.actions.filter((action) => action.id === "collab-peer-" + id)[0]);
    chips.forEach((chip) => expect(chip.getActionBarItemCss()).toContain("sd-action--x-small"));
  });

  // Invite carries its own appearance, and an action's own appearance overrides the
  // container's. Left alone it would stay 40px tall and hold the whole strip at that
  // height, which is the thing this change is meant to remove.
  test("the Invite button is compact too, despite its own appearance", () => {
    const { plugin } = make({ getInviteLink: () => "https://example.test/room" });
    const invite = plugin.bar.container.actions.filter((a) => a.id === "collab-invite")[0];
    expect(invite.getActionBarItemCss()).toContain("sd-action--x-small");
    // ...without losing what makes it the primary button.
    expect(invite.getActionBarItemCss()).toContain("sd-action--brand");
  });

  // The avatars overlap into a stack, and which of them is pulled back is decided
  // HERE rather than by a CSS sibling selector. Angular renders a hidden
  // <sv-ng-action> host between action-bar items, so `+`, `:first-child` and
  // `:nth-child` all miss there - silently, and only in that one framework.
  test("every chip but the first is marked as stacked, on the wrapper", () => {
    const { plugin } = make();
    plugin.apply(peer("a", "Ann"));
    plugin.apply(peer("b", "Bob"));
    plugin.apply(peer("c", "Cara"));

    const chips = ["a", "b", "c"].map((id) =>
      plugin.bar.container.actions.filter((action) => action.id === "collab-peer-" + id)[0]);
    chips.forEach((chip) => expect(chip.css).toContain("sv-collab-bar__participant"));
    expect(chips[0].css).not.toContain("--stacked");
    expect(chips[1].css).toContain("sv-collab-bar__participant--stacked");
    expect(chips[2].css).toContain("sv-collab-bar__participant--stacked");

    // css goes on the wrapper div and innerCss on the button; mixing them up would
    // put the pull-back on the circle and leave the wrapper holding the old width.
    chips.forEach((chip) => expect(chip.innerCss).not.toContain("sv-collab-bar__participant"));
  });

  test("clicking a chip follows that participant", () => {
    const followed: Array<string> = [];
    const { plugin } = make({ onParticipantClick: (id: string) => followed.push(id) });
    plugin.apply(peer("a", "Ann"));
    plugin.bar.container.actions.filter((a) => a.id === "collab-peer-a")[0].action();
    expect(followed).toEqual(["a"]);
  });

  test("participants beyond the limit collapse into an overflow action", () => {
    const { plugin } = make({ maxVisibleParticipants: 2 });
    plugin.apply(peer("a", "Ann"));
    plugin.apply(peer("b", "Bob"));
    plugin.apply(peer("c", "Cate"));
    const overflow = plugin.bar.container.actions.filter((a) => a.id === "collab-overflow")[0];
    expect(overflow.visible).toBe(true);
    expect(overflow.title).toBe("+1");
    expect(plugin.bar.container.actions.filter((a) => a.id.indexOf("collab-peer-") === 0)).toHaveLength(2);
  });

  test("an unchanged roster does not rebuild the actions", () => {
    const { plugin } = make();
    plugin.apply(peer("a", "Ann"));
    const before = plugin.bar.container.actions.filter((a) => a.id === "collab-peer-a")[0];
    // Presence fires on every cursor move; rebuilding twenty times a second would
    // be both wasteful and visibly jumpy.
    plugin.apply({
      type: "peer",
      peer: { clientId: "a", name: "Ann", state: { page: null, focus: "q1" } },
    });
    const after = plugin.bar.container.actions.filter((a) => a.id === "collab-peer-a")[0];
    expect(after).toBe(before);
  });

  test("the roster empties when the connection closes", () => {
    const { plugin } = make();
    plugin.apply(peer("a", "Ann"));
    plugin.apply({ type: "status", status: "closed" });
    expect(plugin.bar.container.actions.filter((a) => a.id.indexOf("collab-peer-") === 0)).toHaveLength(0);
  });
});

describe("the bar can be switched off", () => {
  test("no layout element, and the delegating members stay silent", () => {
    const survey = new SurveyModel(json);
    const plugin = new CollaborationPlugin(survey, { bar: false });
    plugins.push(plugin);
    expect(survey.getContainerContent("header" as any)
      .filter((e: any) => e.id === COLLAB_BAR_ELEMENT_ID)).toHaveLength(0);
    expect(plugin.bar).toBeUndefined();
    expect(() => plugin.apply({ type: "status", status: "closed" })).not.toThrow();
  });
});
