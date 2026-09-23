import { describe, test, expect } from "vitest";
import { SurveyModel } from "survey-core";
import { CollaborationPlugin } from "../../src/plugins/collaboration/index";
import { ICollabIn, ICollabOut } from "../../src/plugins/collaboration/collab-messages";

function collect(plugin: CollaborationPlugin): Array<ICollabOut> {
  const sent: Array<ICollabOut> = [];
  plugin.onEvent.add((_sender, o) => sent.push(o.message));
  return sent;
}

const simpleJson = {
  elements: [
    { type: "text", name: "q1" },
    { type: "text", name: "q2" }
  ]
};

describe("value sync: outgoing", () => {
  test("a local edit produces one value message", () => {
    const survey = new SurveyModel(simpleJson);
    const plugin = new CollaborationPlugin(survey);
    const sent = collect(plugin);
    survey.setValue("q1", "hello");
    expect(sent).toEqual([{ type: "value", key: "q1", value: "hello" }]);
  });
  test("a comment travels under the protocol suffix, not survey.commentSuffix", () => {
    const survey = new SurveyModel({ elements: [{ type: "checkbox", name: "q1", choices: [1, 2], showOtherItem: true }] });
    survey.commentSuffix = "-SOMETHING-ELSE";
    const plugin = new CollaborationPlugin(survey);
    const sent = collect(plugin);
    survey.setComment("q1", "note");
    expect(sent).toHaveLength(1);
    expect((sent[0] as any).key).toBe("q1\u0000comment");
    expect((sent[0] as any).value).toBe("note");
  });
  test("an oversized value is refused and reported on the question", () => {
    const survey = new SurveyModel(simpleJson);
    const plugin = new CollaborationPlugin(survey, { maxValueChars: 32 });
    const sent = collect(plugin);
    survey.setValue("q1", "x".repeat(200));
    expect(sent).toHaveLength(0);
    expect(survey.getQuestionByName("q1").errors).toHaveLength(1);
  });
});

describe("value sync: incoming", () => {
  test("an applied value does not echo back", () => {
    const survey = new SurveyModel(simpleJson);
    const plugin = new CollaborationPlugin(survey);
    const sent = collect(plugin);
    plugin.apply({ type: "value", key: "q1", value: "from peer" });
    expect(survey.getValue("q1")).toBe("from peer");
    expect(sent).toHaveLength(0);
  });
  test("a comment message reaches setComment", () => {
    const survey = new SurveyModel({ elements: [{ type: "checkbox", name: "q1", choices: [1, 2], showOtherItem: true }] });
    const plugin = new CollaborationPlugin(survey);
    plugin.apply({ type: "value", key: "q1\u0000comment", value: "peer note" });
    expect(survey.getComment("q1")).toBe("peer note");
  });
  // The guard is the NAME being applied, not a blanket flag: survey-core writes OTHER
  // questions as a consequence of the one applied, and peers that cannot re-derive that
  // cascade must still be told about it.
  test("a cascade caused by an applied value IS emitted", () => {
    const survey = new SurveyModel({
      clearInvisibleValues: "onHidden",
      elements: [
        { type: "boolean", name: "has" },
        { type: "text", name: "years", visibleIf: "{has} = true" }
      ]
    });
    survey.setValue("has", true);
    survey.setValue("years", "5");
    const plugin = new CollaborationPlugin(survey);
    const sent = collect(plugin);
    plugin.apply({ type: "value", key: "has", value: false });
    expect(sent.some((m) => (m as any).key === "years")).toBeTruthy();
    expect(sent.some((m) => (m as any).key === "has")).toBeFalsy();
  });
  test("an unknown message type is ignored in silence", () => {
    const survey = new SurveyModel(simpleJson);
    const plugin = new CollaborationPlugin(survey);
    const sent = collect(plugin);
    expect(() => plugin.apply(<ICollabIn><any>{ type: "something-new", payload: 1 })).not.toThrow();
    expect(sent).toHaveLength(0);
  });
});

describe("init: authoritative state", () => {
  test("init emits nothing even when the loaded values trigger a cascade", () => {
    const survey = new SurveyModel({
      clearInvisibleValues: "onHidden",
      elements: [
        { type: "boolean", name: "has" },
        { type: "text", name: "years", visibleIf: "{has} = true" }
      ]
    });
    const plugin = new CollaborationPlugin(survey);
    const sent = collect(plugin);
    plugin.apply({ type: "init", values: { has: false, years: "5" } });
    // Scoped to value records on purpose: init also announces our own presence,
    // which is a different channel and must not be counted here.
    expect(sent.filter((m) => m.type === "value")).toHaveLength(0);
  });
  test("init erases keys it does not carry", () => {
    const survey = new SurveyModel(simpleJson);
    const plugin = new CollaborationPlugin(survey);
    survey.setValue("q1", "stale");
    survey.setValue("q2", "kept");
    plugin.apply({ type: "init", values: { q2: "kept" } });
    expect(survey.getValue("q1")).toBeUndefined();
    expect(survey.getValue("q2")).toBe("kept");
  });
  test("init marks the plugin connected", () => {
    const survey = new SurveyModel(simpleJson);
    const plugin = new CollaborationPlugin(survey);
    expect(plugin.status).toBe("connecting");
    plugin.apply({ type: "init", values: {} });
    expect(plugin.status).toBe("connected");
  });
  test("getSnapshot round-trips through init, comments included", () => {
    const source = new SurveyModel({ elements: [{ type: "checkbox", name: "q1", choices: [1, 2], showOtherItem: true }] });
    const sourcePlugin = new CollaborationPlugin(source);
    source.setValue("q1", [1]);
    source.setComment("q1", "why");

    const target = new SurveyModel({ elements: [{ type: "checkbox", name: "q1", choices: [1, 2], showOtherItem: true }] });
    const targetPlugin = new CollaborationPlugin(target);
    targetPlugin.apply({ type: "init", values: sourcePlugin.getSnapshot() });

    expect(target.getValue("q1")).toEqual([1]);
    expect(target.getComment("q1")).toBe("why");
  });
});

// The most valuable test here: two models wired to each other through a fake relay,
// exactly as two browser tabs would be, with no network and no server.
describe("two models converge through a fake relay", () => {
  test("edits on both sides end in the same data", () => {
    const json = {
      elements: [
        { type: "text", name: "name" },
        { type: "boolean", name: "has" },
        { type: "text", name: "years", visibleIf: "{has} = true" }
      ]
    };
    const a = new SurveyModel(json);
    const b = new SurveyModel(json);
    const pluginA = new CollaborationPlugin(a);
    const pluginB = new CollaborationPlugin(b);

    const link = (from: CollaborationPlugin, to: CollaborationPlugin) => {
      from.onEvent.add((_sender, o) => {
        if (o.message.type === "value") to.apply(o.message);
      });
    };
    link(pluginA, pluginB);
    link(pluginB, pluginA);

    a.setValue("name", "Ann");
    b.setValue("has", true);
    b.setValue("years", "7");
    a.setValue("name", "Anna");

    expect(b.getValue("name")).toBe("Anna");
    expect(a.getValue("has")).toBe(true);
    expect(a.getValue("years")).toBe("7");
    expect(a.data).toEqual(b.data);
  });

  test("clearing a matrixdynamic cell does not drop the peer rows", () => {
    const json = {
      elements: [{
        type: "matrixdynamic", name: "m", rowCount: 2,
        columns: [{ name: "c1", cellType: "text" }]
      }]
    };
    const a = new SurveyModel(json);
    const b = new SurveyModel(json);
    const pluginA = new CollaborationPlugin(a);
    const pluginB = new CollaborationPlugin(b);
    pluginA.onEvent.add((_s, o) => { if (o.message.type === "value") pluginB.apply(o.message); });

    const matrix: any = a.getQuestionByName("m");
    matrix.visibleRows[0].cells[0].question.value = "x";
    expect((b.getQuestionByName("m") as any).rowCount).toBe(2);

    // Clearing the only filled cell makes survey-core collapse the value to [] while
    // the sender keeps its rows on screen. Relaying that raw [] would drop the peer to
    // rowCount 0 and its rows would vanish - hence the pad to the sender rowCount.
    const sent: Array<any> = [];
    pluginA.onEvent.add((_s, o) => sent.push(o.message));
    matrix.visibleRows[0].cells[0].question.value = undefined;

    expect(matrix.rowCount).toBe(2);
    expect(sent[sent.length - 1].value).toEqual([{}, {}]);
    expect((b.getQuestionByName("m") as any).rowCount).toBe(2);
  });
});
