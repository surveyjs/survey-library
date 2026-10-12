import { describe, test, expect, beforeEach } from "vitest";
import { ComponentCollection, SurveyModel, Serializer } from "survey-core";
import { CollaborationPlugin } from "../../src/plugins/collaboration/index";
import { ICollabOut } from "../../src/plugins/collaboration/collab-messages";

// Diagnostic suite: does collaboration behave correctly on COMPOSITE questions,
// whose value is one object under the composite's own name?

function collect(plugin: CollaborationPlugin): Array<ICollabOut> {
  const sent: Array<ICollabOut> = [];
  plugin.onEvent.add((_sender, o) => sent.push(o.message));
  return sent;
}
function values(sent: Array<ICollabOut>): Array<any> {
  return sent.filter((m) => m.type === "value");
}
function link(from: CollaborationPlugin, to: CollaborationPlugin): void {
  from.onEvent.add((_sender, o) => {
    if (o.message.type === "value") to.apply(o.message);
  });
}

// The shared vitest setup clears ComponentCollection after EVERY test
// (tests/vitest.setup.ts), so registration has to run per test.
// ---- the user's own example, verbatim in behaviour ----
const SHIPPING = "collabshipping";
const SELFCLEAR = "collabselfclear";
const WITHMATRIX = "collabwithmatrix";
const WITHCOMMENT = "collabwithcomment";
let authorValueChanged: Array<string> = [];
let authorValueSet: Array<string> = [];
function registerComponents(): void {
  ComponentCollection.Instance.add({
    name: SHIPPING,
    elementsJSON: [
      { type: "comment", name: "businessAddress", title: "Business Address", isRequired: true },
      { type: "boolean", name: "shippingSameAsBusiness", title: "Same as business", defaultValue: true },
      {
        type: "comment", name: "shippingAddress", title: "Shipping Address",
        enableIf: "{composite.shippingSameAsBusiness} <> true", isRequired: true,
      },
    ],
    onInit() {
      Serializer.addProperty(SHIPPING, { name: "titleLocation", visible: false, default: "hidden" });
    },
    onValueChanged(question: any, propertyName: string) {
      authorValueChanged.push(propertyName);
      const businessAddress = question.contentPanel.getQuestionByName("businessAddress");
      const shippingAddress = question.contentPanel.getQuestionByName("shippingAddress");
      const shippingSameAsBusiness = question.contentPanel.getQuestionByName("shippingSameAsBusiness");
      if (propertyName === "businessAddress") {
        if (shippingSameAsBusiness.value == true) shippingAddress.value = businessAddress.value;
      }
      if (propertyName === "shippingSameAsBusiness") {
        shippingAddress.value = shippingSameAsBusiness.value == true ? businessAddress.value : "";
      }
    },
    onValueSet(_question: any, newValue: any) {
      authorValueSet.push(JSON.stringify(newValue));
    },
  } as any);

  // A composite whose OWN cascade lives on the receiver: an invisible nested question
  // is cleared locally, which writes the same key the peer value arrived under.
  ComponentCollection.Instance.add({
    name: SELFCLEAR,
    elementsJSON: [
      { type: "boolean", name: "flag" },
      { type: "text", name: "detail", visibleIf: "{composite.flag} = true" },
    ],
  });

  // A composite containing a matrixdynamic, to see what the row events emit.
  ComponentCollection.Instance.add({
    name: WITHMATRIX,
    elementsJSON: [
      { type: "text", name: "label" },
      { type: "matrixdynamic", name: "rows", rowCount: 1, columns: [{ name: "c1", cellType: "text" }] },
    ],
  });

  // A composite with a nested comment box ("Other" text on a checkbox).
  ComponentCollection.Instance.add({
    name: WITHCOMMENT,
    elementsJSON: [
      { type: "checkbox", name: "picks", choices: [1, 2], showOtherItem: true },
    ],
  });
}

beforeEach(() => {
  registerComponents();
  authorValueChanged = [];
  authorValueSet = [];
});

// One jsdom document has a single activeElement, so a two-client exchange is simulated by
// moving the focus (and the survey root) to whichever client is about to receive.
function attachFocusedInput(survey: SurveyModel, questionName: string, text: string) {
  const root = document.createElement("div");
  const node = document.createElement("div");
  node.setAttribute("data-name", questionName);
  const input = document.createElement("input");
  input.id = (survey.getQuestionByName(questionName) as any).inputId;
  input.value = text;
  node.appendChild(input);
  root.appendChild(node);
  document.body.appendChild(root);
  (survey as any).rootElement = root;
  return { root, input };
}

const shippingJson = { elements: [{ type: SHIPPING, name: "shipping" }] };

describe("composite: outgoing", () => {
  test("a nested edit is emitted under the composite's own key", () => {
    const survey = new SurveyModel(shippingJson);
    const plugin = new CollaborationPlugin(survey);
    const sent = collect(plugin);
    const composite: any = survey.getQuestionByName("shipping");
    composite.contentPanel.getQuestionByName("businessAddress").value = "1 Main St";

    values(sent).forEach((m) => expect(m.key).toBe("shipping"));
    expect(values(sent).length).toBeGreaterThan(0);
  });

  test("the last emitted object carries the cascade, not just the edited field", () => {
    const survey = new SurveyModel(shippingJson);
    const plugin = new CollaborationPlugin(survey);
    const sent = collect(plugin);
    const composite: any = survey.getQuestionByName("shipping");
    composite.contentPanel.getQuestionByName("businessAddress").value = "1 Main St";

    const last = values(sent)[values(sent).length - 1];
    expect(last.value.businessAddress).toBe("1 Main St");
    expect(last.value.shippingAddress).toBe("1 Main St");
  });

  test("toggling the boolean emits the cleared shipping address", () => {
    const survey = new SurveyModel(shippingJson);
    const plugin = new CollaborationPlugin(survey);
    const composite: any = survey.getQuestionByName("shipping");
    composite.contentPanel.getQuestionByName("businessAddress").value = "1 Main St";
    const sent = collect(plugin);
    composite.contentPanel.getQuestionByName("shippingSameAsBusiness").value = false;

    const last = values(sent)[values(sent).length - 1];
    expect(last.value.businessAddress).toBe("1 Main St");
    expect(last.value.shippingAddress === "" || last.value.shippingAddress === undefined).toBe(true);
  });
});

describe("composite: incoming", () => {
  test("a peer object lands in every nested question", () => {
    const survey = new SurveyModel(shippingJson);
    const plugin = new CollaborationPlugin(survey);
    plugin.apply({
      type: "value", key: "shipping",
      value: { businessAddress: "9 Oak Rd", shippingSameAsBusiness: false, shippingAddress: "5 Pine Ave" },
    });
    const composite: any = survey.getQuestionByName("shipping");
    expect(composite.contentPanel.getQuestionByName("businessAddress").value).toBe("9 Oak Rd");
    expect(composite.contentPanel.getQuestionByName("shippingAddress").value).toBe("5 Pine Ave");
    expect(composite.contentPanel.getQuestionByName("shippingSameAsBusiness").value).toBe(false);
  });

  test("an applied composite value does not echo back", () => {
    const survey = new SurveyModel(shippingJson);
    const plugin = new CollaborationPlugin(survey);
    const sent = collect(plugin);
    plugin.apply({ type: "value", key: "shipping", value: { businessAddress: "9 Oak Rd" } });
    expect(values(sent)).toHaveLength(0);
  });

  test("onValueChanged does not run on the receiver, onValueSet does", () => {
    const survey = new SurveyModel(shippingJson);
    const plugin = new CollaborationPlugin(survey);
    authorValueChanged = [];
    authorValueSet = [];
    plugin.apply({ type: "value", key: "shipping", value: { businessAddress: "9 Oak Rd" } });

    // survey-core only calls onValueChanged for edits made through the UI, so
    // cross-field logic that must run everywhere belongs in onValueSet.
    expect(authorValueChanged).toEqual([]);
    expect(authorValueSet).toHaveLength(1);
  });

  test("enableIf {composite.x} is re-evaluated on the receiver", () => {
    const survey = new SurveyModel(shippingJson);
    const plugin = new CollaborationPlugin(survey);
    const composite: any = survey.getQuestionByName("shipping");
    const nested = composite.contentPanel.getQuestionByName("shippingAddress");
    // defaultValue true -> the nested field starts read-only
    expect(nested.isReadOnly).toBe(true);

    plugin.apply({ type: "value", key: "shipping", value: { shippingSameAsBusiness: false } });
    expect(nested.isReadOnly).toBe(false);

    plugin.apply({ type: "value", key: "shipping", value: { shippingSameAsBusiness: true } });
    expect(nested.isReadOnly).toBe(true);
  });

  test("an applied value raises no required error the receiver did not cause", () => {
    const survey = new SurveyModel(shippingJson);
    const plugin = new CollaborationPlugin(survey);
    plugin.apply({ type: "value", key: "shipping", value: { businessAddress: "9 Oak Rd" } });
    const composite: any = survey.getQuestionByName("shipping");
    expect(composite.errors.length).toBe(0);
  });

  test("a receiver-side cascade into the SAME key is swallowed by the echo guard", () => {
    const json = { clearInvisibleValues: "onHidden", elements: [{ type: SELFCLEAR, name: "sc" }] };
    const a = new SurveyModel(json);
    const b = new SurveyModel(json);
    const pluginA = new CollaborationPlugin(a);
    const pluginB = new CollaborationPlugin(b);
    link(pluginA, pluginB);
    link(pluginB, pluginA);

    const ca: any = a.getQuestionByName("sc");
    ca.contentPanel.getQuestionByName("flag").value = true;
    ca.contentPanel.getQuestionByName("detail").value = "kept";
    expect(b.getValue("sc").detail).toBe("kept");

    // Hiding the nested question makes EVERY client clear it locally - a write to the
    // same key the peer value arrived under.
    ca.contentPanel.getQuestionByName("flag").value = false;
    expect(a.data).toEqual(b.data);
  });
});

describe("composite: init and defaults", () => {
  test("init with an empty state emits nothing", () => {
    const survey = new SurveyModel(shippingJson);
    const plugin = new CollaborationPlugin(survey);
    const sent = collect(plugin);
    plugin.apply({ type: "init", values: {} });
    expect(values(sent)).toHaveLength(0);
  });

  test("an empty init erases a NESTED default that the schema declares", () => {
    const survey = new SurveyModel(shippingJson);
    const plugin = new CollaborationPlugin(survey);
    expect(survey.getValue("shipping")).toEqual({ shippingSameAsBusiness: true });
    plugin.apply({ type: "init", values: {} });
    // The schema says the box is ticked; after joining an empty room it is not.
    expect(survey.getValue("shipping")).toBeUndefined();
  });

  test("CONTROL an empty init erases a TOP-LEVEL default the same way", () => {
    const survey = new SurveyModel({
      elements: [{ type: "boolean", name: "flag", defaultValue: true }],
    });
    const plugin = new CollaborationPlugin(survey);
    expect(survey.getValue("flag")).toBe(true);
    plugin.apply({ type: "init", values: {} });
    expect(survey.getValue("flag")).toBeUndefined();
  });

  test("a late joiner adopts the room state instead of its own nested defaults", () => {
    const author = new SurveyModel(shippingJson);
    const authorPlugin = new CollaborationPlugin(author);
    const composite: any = author.getQuestionByName("shipping");
    composite.contentPanel.getQuestionByName("shippingSameAsBusiness").value = false;
    composite.contentPanel.getQuestionByName("businessAddress").value = "9 Oak Rd";
    composite.contentPanel.getQuestionByName("shippingAddress").value = "5 Pine Ave";

    const joiner = new SurveyModel(shippingJson);
    const joinerPlugin = new CollaborationPlugin(joiner);
    const sent = collect(joinerPlugin);
    joinerPlugin.apply({ type: "init", values: authorPlugin.getSnapshot() });

    expect(joiner.data).toEqual(author.data);
    expect(values(sent)).toHaveLength(0);
  });

  test("getSnapshot round-trips a composite with a nested comment", () => {
    const json = { elements: [{ type: WITHCOMMENT, name: "wc" }] };
    const source = new SurveyModel(json);
    const sourcePlugin = new CollaborationPlugin(source);
    const sc: any = source.getQuestionByName("wc");
    sc.contentPanel.getQuestionByName("picks").value = [1, "other"];
    sc.contentPanel.getQuestionByName("picks").comment = "why";

    const target = new SurveyModel(json);
    const targetPlugin = new CollaborationPlugin(target);
    targetPlugin.apply({ type: "init", values: sourcePlugin.getSnapshot() });

    expect(target.data).toEqual(source.data);
    const tc: any = target.getQuestionByName("wc");
    expect(tc.contentPanel.getQuestionByName("picks").comment).toBe("why");
  });
});

describe("composite: matrixdynamic inside a composite", () => {
  test("a row event inside a composite is keyed by the composite, not the nested matrix", () => {
    const json = { elements: [{ type: WITHMATRIX, name: "wm" }] };
    const survey = new SurveyModel(json);
    const plugin = new CollaborationPlugin(survey);
    const sent = collect(plugin);
    const composite: any = survey.getQuestionByName("wm");
    const matrix: any = composite.contentPanel.getQuestionByName("rows");
    matrix.addRow();

    // The nested matrix is not a key of survey.data; its rows live inside the
    // composite's object, so that is what has to go on the wire.
    expect(values(sent)).toHaveLength(1);
    expect(values(sent)[0].key).toBe("wm");
    expect(values(sent)[0].value.rows).toHaveLength(2);
  });

  test("an empty row added inside a composite reaches the peer", () => {
    const json = { elements: [{ type: WITHMATRIX, name: "wm" }] };
    const a = new SurveyModel(json);
    const b = new SurveyModel(json);
    const pluginA = new CollaborationPlugin(a);
    const pluginB = new CollaborationPlugin(b);
    link(pluginA, pluginB);

    const ca: any = a.getQuestionByName("wm");
    const matrixA: any = ca.contentPanel.getQuestionByName("rows");
    matrixA.addRow();

    const cb: any = b.getQuestionByName("wm");
    const matrixB: any = cb.contentPanel.getQuestionByName("rows");
    expect(matrixA.rowCount).toBe(2);
    expect(matrixB.rowCount).toBe(2);
  });

  test("a row removed inside a composite reaches the peer", () => {
    const json = { elements: [{ type: WITHMATRIX, name: "wm" }] };
    const a = new SurveyModel(json);
    const b = new SurveyModel(json);
    const pluginA = new CollaborationPlugin(a);
    const pluginB = new CollaborationPlugin(b);
    link(pluginA, pluginB);

    const ca: any = a.getQuestionByName("wm");
    const matrixA: any = ca.contentPanel.getQuestionByName("rows");
    matrixA.addRow();
    matrixA.addRow();
    const cb: any = b.getQuestionByName("wm");
    const matrixB: any = cb.contentPanel.getQuestionByName("rows");
    expect(matrixB.rowCount).toBe(3);

    // Removing is the half survey-core does NOT reconcile on its own: the shorter array
    // reads as "equal" to what the receiver holds, so nothing is assigned.
    matrixA.removeRow(2);
    expect(matrixA.rowCount).toBe(2);
    expect(matrixB.rowCount).toBe(2);
  });

  test("clearing the last filled cell of a nested matrix does not drop the peer rows", () => {
    const json = { elements: [{ type: WITHMATRIX, name: "wm" }] };
    const a = new SurveyModel(json);
    const b = new SurveyModel(json);
    const pluginA = new CollaborationPlugin(a);
    const pluginB = new CollaborationPlugin(b);
    link(pluginA, pluginB);

    const ca: any = a.getQuestionByName("wm");
    const matrixA: any = ca.contentPanel.getQuestionByName("rows");
    matrixA.addRow();
    matrixA.visibleRows[0].cells[0].question.value = "x";
    const cb: any = b.getQuestionByName("wm");
    const matrixB: any = cb.contentPanel.getQuestionByName("rows");
    expect(matrixB.rowCount).toBe(2);

    // survey-core collapses the value while the sender keeps its rows on screen; relaying
    // that raw collapse would empty the peer - the same gap the top level pads around.
    matrixA.visibleRows[0].cells[0].question.value = undefined;
    expect(matrixA.rowCount).toBe(2);
    expect(matrixB.rowCount).toBe(2);
  });

  test("a row added inside a composite reaches the peer", () => {
    const json = { elements: [{ type: WITHMATRIX, name: "wm" }] };
    const a = new SurveyModel(json);
    const b = new SurveyModel(json);
    const pluginA = new CollaborationPlugin(a);
    const pluginB = new CollaborationPlugin(b);
    link(pluginA, pluginB);

    const ca: any = a.getQuestionByName("wm");
    const matrixA: any = ca.contentPanel.getQuestionByName("rows");
    matrixA.addRow();
    matrixA.visibleRows[0].cells[0].question.value = "x";

    const cb: any = b.getQuestionByName("wm");
    const matrixB: any = cb.contentPanel.getQuestionByName("rows");
    expect(matrixB.rowCount).toBe(matrixA.rowCount);
    expect(b.data).toEqual(a.data);
  });
});

describe("composite: two models through a fake relay", () => {
  test("sequential edits to different fields converge and keep both", () => {
    const a = new SurveyModel(shippingJson);
    const b = new SurveyModel(shippingJson);
    const pluginA = new CollaborationPlugin(a);
    const pluginB = new CollaborationPlugin(b);
    link(pluginA, pluginB);
    link(pluginB, pluginA);

    const ca: any = a.getQuestionByName("shipping");
    const cb: any = b.getQuestionByName("shipping");
    ca.contentPanel.getQuestionByName("businessAddress").value = "9 Oak Rd";
    cb.contentPanel.getQuestionByName("shippingSameAsBusiness").value = false;
    cb.contentPanel.getQuestionByName("shippingAddress").value = "5 Pine Ave";

    expect(a.data).toEqual(b.data);
    expect(a.getValue("shipping").businessAddress).toBe("9 Oak Rd");
    expect(a.getValue("shipping").shippingAddress).toBe("5 Pine Ave");
  });

  test("CHARACTERISATION concurrent edits to different fields of one composite", () => {
    // A deferred relay: both sides edit before either message is delivered.
    const a = new SurveyModel(shippingJson);
    const b = new SurveyModel(shippingJson);
    const pluginA = new CollaborationPlugin(a);
    const pluginB = new CollaborationPlugin(b);
    const queue: Array<() => void> = [];
    pluginA.onEvent.add((_s, o) => {
      if (o.message.type === "value") queue.push(() => pluginB.apply(o.message as any));
    });
    pluginB.onEvent.add((_s, o) => {
      if (o.message.type === "value") queue.push(() => pluginA.apply(o.message as any));
    });

    const ca: any = a.getQuestionByName("shipping");
    const cb: any = b.getQuestionByName("shipping");
    ca.contentPanel.getQuestionByName("businessAddress").value = "9 Oak Rd";
    cb.contentPanel.getQuestionByName("shippingSameAsBusiness").value = false;
    queue.forEach((deliver) => deliver());

    // Recorded, not demanded: each client applies its OWN edit first and the peer's
    // second, so with one key per composite the two sides end on different objects.
    expect(a.data).not.toEqual(b.data);
  });

  test("CONTROL the same concurrency on two SCALAR questions converges", () => {
    const json = { elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }] };
    const a = new SurveyModel(json);
    const b = new SurveyModel(json);
    const pluginA = new CollaborationPlugin(a);
    const pluginB = new CollaborationPlugin(b);
    const queue: Array<() => void> = [];
    pluginA.onEvent.add((_s, o) => {
      if (o.message.type === "value") queue.push(() => pluginB.apply(o.message as any));
    });
    pluginB.onEvent.add((_s, o) => {
      if (o.message.type === "value") queue.push(() => pluginA.apply(o.message as any));
    });

    a.setValue("q1", "from A");
    b.setValue("q2", "from B");
    queue.forEach((deliver) => deliver());

    expect(a.data).toEqual(b.data);
  });

  test("CONTROL two clients writing the SAME scalar key also diverge", () => {
    const json = { elements: [{ type: "text", name: "q1" }] };
    const a = new SurveyModel(json);
    const b = new SurveyModel(json);
    const pluginA = new CollaborationPlugin(a);
    const pluginB = new CollaborationPlugin(b);
    const queue: Array<() => void> = [];
    pluginA.onEvent.add((_s, o) => {
      if (o.message.type === "value") queue.push(() => pluginB.apply(o.message as any));
    });
    pluginB.onEvent.add((_s, o) => {
      if (o.message.type === "value") queue.push(() => pluginA.apply(o.message as any));
    });

    a.setValue("q1", "from A");
    b.setValue("q1", "from B");
    queue.forEach((deliver) => deliver());

    // Same shape of divergence: it is a property of one key, not of composites.
    expect(a.data).not.toEqual(b.data);
  });
});

describe("composite: the caret's own field", () => {
  test("two people typing in one scalar field do not bounce a value for ever", () => {
    const json = { elements: [{ type: "text", name: "q1" }] };
    const a = new SurveyModel(json);
    const b = new SurveyModel(json);
    const pluginA = new CollaborationPlugin(a, { presence: false, bar: false });
    const pluginB = new CollaborationPlugin(b, { presence: false, bar: false });
    const clientA = attachFocusedInput(a, "q1", "AAA");
    const clientB = attachFocusedInput(b, "q1", "BBB");

    const queue: Array<{ to: "a" | "b", message: any }> = [];
    pluginA.onEvent.add((_s, o) => { if (o.message.type === "value") queue.push({ to: "b", message: o.message }); });
    pluginB.onEvent.add((_s, o) => { if (o.message.type === "value") queue.push({ to: "a", message: o.message }); });

    clientA.input.focus();
    a.setValue("q1", "AAA");
    clientB.input.focus();
    b.setValue("q1", "BBB");

    // The peer answered THIS key, so it wins and the exchange settles - restoring the
    // local text here would make every message beget another one.
    let delivered = 0;
    while(queue.length > 0 && delivered < 40) {
      const item = queue.shift();
      delivered++;
      if (item.to === "a") { clientA.input.focus(); pluginA.apply(item.message); } else { clientB.input.focus(); pluginB.apply(item.message); }
    }
    expect(queue.length).toBe(0);

    clientA.root.remove();
    clientB.root.remove();
  });
});

describe("composite: containers that are not composites", () => {
  test("a matrixdropdown value is relayed untouched", () => {
    const json = {
      elements: [{
        type: "matrixdropdown", name: "md", rows: ["r1"],
        columns: [{ name: "col1", cellType: WITHMATRIX }],
      }],
    };
    const a = new SurveyModel(json);
    const b = new SurveyModel(json);
    const pluginA = new CollaborationPlugin(a);
    const pluginB = new CollaborationPlugin(b);
    link(pluginA, pluginB);

    a.setValue("md", { r1: { col1: { label: "x" } } });
    expect(b.data).toEqual(a.data);
    expect(Object.keys(b.getValue("md"))).toEqual(["r1"]);
  });

  test("a row added inside a dynamic panel is keyed by the panel, not by the matrix", () => {
    const json = {
      elements: [{
        type: "paneldynamic", name: "p", panelCount: 1,
        templateElements: [{ type: "matrixdynamic", name: "rows", rowCount: 1, columns: [{ name: "c1", cellType: "text" }] }],
      }],
    };
    const survey = new SurveyModel(json);
    const plugin = new CollaborationPlugin(survey);
    const sent = collect(plugin);
    const panel: any = survey.getQuestionByName("p");
    panel.panels[0].getQuestionByName("rows").addRow();

    values(sent).forEach((m) => expect(m.key).toBe("p"));
  });

  test("a single-question custom type stays silent rather than inventing a key", () => {
    const SINGLE = "collabsingle";
    ComponentCollection.Instance.add({
      name: SINGLE,
      questionJSON: { type: "matrixdynamic", name: "inner", rowCount: 1, columns: [{ name: "c1", cellType: "text" }] },
    });
    const survey = new SurveyModel({ elements: [{ type: SINGLE, name: "s1" }] });
    const plugin = new CollaborationPlugin(survey);
    const sent = collect(plugin);
    (survey.getQuestionByName("s1") as any).contentQuestion.addRow();

    // Its content question carries no parentQuestion, so the owner cannot be resolved -
    // and a key no peer can interpret is worse than a row that does not travel.
    expect(values(sent)).toHaveLength(0);
  });

  test("a composite with valueName travels under the value name", () => {
    const survey = new SurveyModel({ elements: [{ type: SHIPPING, name: "shipName", valueName: "shipValue" }] });
    const plugin = new CollaborationPlugin(survey);
    const sent = collect(plugin);
    const composite: any = survey.getQuestionByName("shipName");
    composite.contentPanel.getQuestionByName("businessAddress").value = "1 Main St";

    expect(values(sent)[0].key).toBe("shipValue");
  });
});
