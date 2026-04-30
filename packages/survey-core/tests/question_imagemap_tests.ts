import { QuestionImageMapModel } from "../src/question_imagemap";
import { SurveyModel } from "../src/survey";
import { Serializer } from "../src/jsonobject";

import { describe, test, expect, beforeEach, afterEach } from "vitest";
describe("imagemap", () => {
  // Recipe A: synchronous requestAnimationFrame queue. jsdom's RAF is wired to
  // setTimeout(cb, 16) by default and to setTimeout(cb, 0) by tests/vitest.setup.ts;
  // either variant defers execution past the synchronous test flow these tests rely on.
  // Override per-suite so callbacks are queued and flushed deterministically with flushRAF().
  let rafCallbacks: FrameRequestCallback[] = [];
  let originalRAF: typeof window.requestAnimationFrame;
  let originalCAF: typeof window.cancelAnimationFrame;
  beforeEach(() => {
    rafCallbacks = [];
    originalRAF = window.requestAnimationFrame;
    originalCAF = window.cancelAnimationFrame;
    window.requestAnimationFrame = ((cb: FrameRequestCallback) => {
      rafCallbacks.push(cb);
      return rafCallbacks.length;
    }) as any;
    window.cancelAnimationFrame = ((id: number) => {
      if (id > 0 && id <= rafCallbacks.length) rafCallbacks[id - 1] = () => { /* cancelled */ };
    }) as any;
  });
  afterEach(() => {
    window.requestAnimationFrame = originalRAF;
    window.cancelAnimationFrame = originalCAF;
  });
  function flushRAF(times = 5) {
    for (let i = 0; i < times; i++) {
      if (rafCallbacks.length === 0) return;
      const cbs = rafCallbacks;
      rafCallbacks = [];
      cbs.forEach((cb) => cb(performance.now()));
    }
  }

  const i400x400 = "data:image/svg+xml;base64," + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"></svg>');

  function createRenderContainer(model: QuestionImageMapModel, image: string): HTMLElement {

    const container = document.createElement("div");
    container.innerHTML = `
    <img id="${ model.id }-bg" src="${ image }" />
    <svg id="${ model.id }-svg"></svg>
  `;

    return container;
  }

  test("Register and load from json", () => {

    const model = new SurveyModel({
      elements: [
        {
          type: "imagemap",
          name: "q1",
          imageLink: "imageLink_url",
          areas: [
            {
              value: "val1",
              text: "val1_text",
              coords: "x1,y1,x2,y2,x3,y3,x4,y4"
            },
            {
              value: "val2",
              text: "val2_text",
              shape: "rect",
              coords: "x1,y1,x2,y2",
            },
            {
              value: "val2",
              text: "val2_text",
              shape: "circle",
              coords: "x1,y1,r1"
            },
          ]
        }
      ]
    });
    const q1 = <QuestionImageMapModel>model.getQuestionByName("q1");

    expect(q1.getType(), "type is imagemap").toLooseEqual("imagemap");
    expect(q1.imageLink, "imageLink is imageLink_url").toLooseEqual("imageLink_url");
    expect(q1.areas.length, "imageMap.length is 2").toLooseEqual(3);

    expect(q1.areas[0].getType(), "areas[0] type is imagemaparea").toLooseEqual("imagemaparea");

    expect(q1.areas[0].value, "[0].value must be val1").toLooseEqual("val1");
    expect(q1.areas[0].shape, "default shape must be inherit").toLooseEqual("inherit");
    expect(q1.areas[0].getShape(), "default shape must be poly").toLooseEqual("poly");
    expect(q1.areas[0].coords, "coords must be set").toLooseEqual("x1,y1,x2,y2,x3,y3,x4,y4");

    expect(q1.areas[1].value, "[1].value must be val2").toLooseEqual("val2");
    expect(q1.areas[1].shape, "second item shape must be rect").toLooseEqual("rect");

    q1.shape = "circle";
    expect(q1.areas[0].shape, "shape must be inherit #2").toLooseEqual("inherit");
    expect(q1.areas[0].getShape(), "shape must be circle").toLooseEqual("circle");
    expect(q1.areas[1].shape, "second item shape must be rect still").toLooseEqual("rect");
  });

  test("Check toggle and multiSelect change", () => {

    const model = new SurveyModel({
      elements: [
        {
          type: "imagemap",
          name: "q1",
          imageLink: "imageLink_url",
          areas: [
            {
              value: "val1",
              text: "val1_text",
              coords: "x1,y1,x2,y2,x3,y3,x4,y4"
            },
            {
              value: "val2",
              text: "val2_text",
              shape: "rect",
              coords: "x1,y1,x2,y2"
            },
            {
              value: "val2",
              text: "val2_text",
              shape: "circle",
              coords: "x1,y1,r1"
            },
          ]
        }
      ]
    });
    const q1 = <QuestionImageMapModel>model.getQuestionByName("q1");

    expect(q1.value, "value must be undefined initially").toLooseEqual(undefined);
    expect(q1.multiSelect, "multiSelect is true by default").toLooseEqual(true);

    q1.mapItemToggle(q1.areas[0]);
    expect(q1.value, "value must be ['val1'] after first tooggle").toEqualValues(["val1"]);
    expect(q1.isItemSelected(q1.areas[0]), "must be selected after first click").toLooseEqual(true);
    expect(q1.isItemSelected(q1.areas[1]), "must not be selected after first click").toLooseEqual(false);

    q1.mapItemToggle(q1.areas[0]);
    expect(q1.value, "value must be [] untoggling off item").toEqualValues([]);

    q1.mapItemToggle(q1.areas[0]);
    q1.mapItemToggle(q1.areas[1]);
    expect(q1.value, "value must be ['val1', 'val2'] after selecting two items").toEqualValues(["val1", "val2"]);

    q1.readOnly = true;
    q1.mapItemToggle(q1.areas[1]);
    q1.mapItemToggle(q1.areas[2]);
    expect(q1.value, "value must be unchanged in readOnly mode").toEqualValues(["val1", "val2"]);
    q1.readOnly = false;

    model.readOnly = true;
    q1.mapItemToggle(q1.areas[1]);
    q1.mapItemToggle(q1.areas[2]);
    expect(q1.value, "value must be unchanged in survey readOnly mode").toEqualValues(["val1", "val2"]);
    model.readOnly = false;

    q1.mapItemToggle(q1.areas[0]);
    expect(q1.value, "value must be ['val2'] after toggling first item off").toEqualValues(["val2"]);

    q1.multiSelect = false;
    expect(q1.multiSelect, "multiSelect must be false now").toLooseEqual(false);
    expect(q1.value, "value must be undefined #1").toLooseEqual(undefined);

    q1.mapItemToggle(q1.areas[0]);
    expect(q1.value, "Single: value must be val1").toLooseEqual("val1");
    expect(q1.isItemSelected(q1.areas[0]), "Single: imageMap[0] must be selected").toLooseEqual(true);
    expect(q1.isItemSelected(q1.areas[1]), "Single: imageMap[1] must not be selected").toLooseEqual(false);

    q1.mapItemToggle(q1.areas[0]);
    expect(q1.value, "Single: value must be undefined after toggling off").toLooseEqual(undefined);

    q1.mapItemToggle(q1.areas[1]);
    expect(q1.value, "Single: value must be val2").toLooseEqual("val2");
    expect(q1.isItemSelected(q1.areas[0]), "Single: imageMap[0] must not be selected").toLooseEqual(false);
    expect(q1.isItemSelected(q1.areas[1]), "Single: imageMap[1] must be selected").toLooseEqual(true);

    q1.multiSelect = true;
    expect(q1.multiSelect, "multiSelect must be true now").toLooseEqual(true);
    expect(q1.value, "value must be undefined #2").toLooseEqual(undefined);
  });

  test("Check init", () => {
    const model: QuestionImageMapModel = new QuestionImageMapModel("");
    const imageDataURL = "data:image/svg+xml;base64," + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="100%" height="100%" fill="#DDDDDD"/></svg>');

    const container = document.createElement("div");
    container.innerHTML = `
    <img id="${ model.id }-bg" src="${ imageDataURL }" />
    <svg id="${ model.id }-svg"></svg>
  `;

    let renderSVGCount = 0;
    const renderSVG = model.renderSVG;
    model.renderSVG = () => {
      renderSVGCount++;
      renderSVG.apply(model);
    };

    model.initImageMap(container);
    // jsdom does not load <img> resources, so the "load" event never fires.
    // Dispatch it manually to invoke onBgImageLoaded -> renderSVG.
    const bg = container.querySelector(`#${model.id}-bg`) as HTMLImageElement;
    bg.dispatchEvent(new Event("load"));
    flushRAF();
    expect(renderSVGCount, "renderSVG must be called 1 time after init").toLooseEqual(1);
  });

  test("Check svg render", () => {
    const model = new SurveyModel({
      elements: [
        {
          type: "imagemap",
          name: "q1",
          areas: [
            {
              "value": "val1",
              "coords": "100,200,300,400"
            },
            {
              "value": "val2",
              "shape": "rect",
              "coords": "100,200,300,400"
            },
            {
              "value": "val3",
              "shape": "circle",
              "coords": "150,200,100"
            },
          ]
        }
      ]
    });

    const q1 = <QuestionImageMapModel>model.getQuestionByName("q1");

    const container = createRenderContainer(q1, i400x400);
    q1.initImageMap(container);
    (container.querySelector(`#${q1.id}-bg`) as HTMLImageElement).dispatchEvent(new Event("load"));
    flushRAF();

    expect(q1.areas[0].svg.outerHTML, "area[0] SVG incorrect").toLooseEqual(`<polygon data-uid="${ q1.areas[0].uniqueId }" points="${ q1.areas[0].coords }" class="${ q1.areas[0].getCSSClasses() }" title="${ q1.areas[0].title }"></polygon>`);

    let a1coords = q1.areas[1].coords.split(",").map(Number);
    expect(q1.areas[1].svg.outerHTML, "area[1] SVG incorrect").toLooseEqual(`<rect data-uid="${ q1.areas[1].uniqueId }" x="${ a1coords[0] }" y="${ a1coords[1] }" width="${ a1coords[2] - a1coords[0] }" height="${ a1coords[3] - a1coords[1] }" class="${ q1.areas[1].getCSSClasses() }" title="${ q1.areas[1].title }"></rect>`);

    let a2coords = q1.areas[2].coords.split(",").map(Number);
    expect(q1.areas[2].svg.outerHTML, "area[2] SVG incorrect").toLooseEqual(`<circle data-uid="${ q1.areas[2].uniqueId }" cx="${ a2coords[0] }" cy="${ a2coords[1] }" r="${ a2coords[2] }" class="${ q1.areas[2].getCSSClasses() }" title="${ q1.areas[2].title }"></circle>`);
  });

  test("css variables", () => {

    const model = new SurveyModel({
      elements: [
        {
          type: "imagemap",
          name: "q1",
          imageLink: "imageLink_url",
          areas: [
            {
              value: "val1",
              coords: "x1,y1,x2,y2"
            },
            {
              value: "val2",
              coords: "x1,y1,x2,y2",
              idleFillColor: "ifc",
              idleStrokeColor: "isc",
              idleStrokeWidth: 1,
              hoverFillColor: "hfc",
              hoverStrokeColor: "hsc",
              hoverStrokeWidth: 2,
              selectedFillColor: "sfc",
              selectedStrokeColor: "ssc",
              selectedStrokeWidth: 3,
            },
          ],
        }
      ]
    });
    const q1 = <QuestionImageMapModel>model.getQuestionByName("q1");

    expect(q1.getCSSVariables(), "question css variables empty by default").toLooseEqual("");

    q1.idleFillColor = "dfc";
    q1.idleStrokeColor = "dsc";
    q1.idleStrokeWidth = 1;
    q1.hoverFillColor = "dhc";
    q1.hoverStrokeColor = "dsc";
    q1.hoverStrokeWidth = 2;
    q1.selectedFillColor = "dsc";
    q1.selectedStrokeColor = "dsc";
    q1.selectedStrokeWidth = 3;

    expect(q1.getCSSVariables(), "question css variables correct").toLooseEqual("--sd-imagemap-idle-fill-color: dfc; --sd-imagemap-idle-stroke-color: dsc; --sd-imagemap-idle-stroke-width: 1; --sd-imagemap-hover-fill-color: dhc; --sd-imagemap-hover-stroke-color: dsc; --sd-imagemap-hover-stroke-width: 2; --sd-imagemap-selected-fill-color: dsc; --sd-imagemap-selected-stroke-color: dsc; --sd-imagemap-selected-stroke-width: 3");

    expect(q1.areas[0].getCSSVariables(), "area[1] css variables correct").toLooseEqual("");

    expect(q1.areas[1].getCSSVariables(), "area[1] css variables correct").toLooseEqual("--sd-imagemap-idle-fill-color: ifc; --sd-imagemap-idle-stroke-color: isc; --sd-imagemap-idle-stroke-width: 1; --sd-imagemap-hover-fill-color: hfc; --sd-imagemap-hover-stroke-color: hsc; --sd-imagemap-hover-stroke-width: 2; --sd-imagemap-selected-fill-color: sfc; --sd-imagemap-selected-stroke-color: ssc; --sd-imagemap-selected-stroke-width: 3");
  });

  test("Check set value and multiSelect change with valuePropertyName", () => {

    const model = new SurveyModel({
      elements: [
        {
          type: "imagemap",
          name: "q1",
          imageLink: "imageLink_url",
          valuePropertyName: "state",
        }
      ]
    });
    const q1 = <QuestionImageMapModel>model.getQuestionByName("q1");

    q1.value = ["TX"];
    expect(q1.value, "value is set correctly as array").toEqualValues([{ state: "TX" }]);

    q1.value = "TX";
    expect(q1.value, "value is set correctly as string").toEqualValues([{ state: "TX" }]);
  });

  test("check defaultValue with valuePropertyName", () => {

    const model = new SurveyModel({
      elements: [
        {
          type: "imagemap",
          name: "q1",
          imageLink: "imageLink_url",
          valuePropertyName: "state",
          defaultValue: ["TX"]
        }
      ]
    });
    const q1 = <QuestionImageMapModel>model.getQuestionByName("q1");

    expect(q1.value, "defaultValue is set correctly").toEqualValues([{ state: "TX" }]);
  });

  test("check maxSelectedChoices via mapItemTooggle", () => {

    const model = new SurveyModel({
      elements: [
        {
          type: "imagemap",
          name: "q1",
          maxSelectedAreas: 2,
          areas: [
            {
              value: "val1",
            },
            {
              value: "val2",
            },
            {
              value: "val3",
            }
          ]
        }
      ]
    });

    const q1 = <QuestionImageMapModel>model.getQuestionByName("q1");

    q1.mapItemToggle(q1.areas[0]);
    q1.mapItemToggle(q1.areas[1]);
    q1.mapItemToggle(q1.areas[2]);

    expect(q1.value, "the third item is not added, max is 2").toEqualValues(["val1", "val2"]);
  });

  test("check minSelectedAreas + maxSelectedChoices and errors", () => {

    const model = new SurveyModel({
      elements: [
        {
          type: "imagemap",
          name: "q1",
          minSelectedAreas: 2,
          maxSelectedAreas: 3
        }
      ]
    });

    const q1 = <QuestionImageMapModel>model.getQuestionByName("q1");

    q1.value = ["val1"];
    expect(q1.validate(), "there is only one item, min is 2").toLooseEqual(false);
    expect(q1.errors.length, "there is one error").toLooseEqual(1);

    q1.value = ["val1", "val2"];
    expect(q1.validate(), "there are two items, min is 2").toLooseEqual(true);
    expect(q1.errors.length, "there is no error").toLooseEqual(0);

    q1.value = ["val1", "val2", "val3", "val4"];
    expect(q1.validate(), "there are four items, max is 3").toLooseEqual(false);
    expect(q1.errors.length, "there is one error").toLooseEqual(1);
  });

  test("check getDisplayValue without valuePropertyName", () => {

    const model = new SurveyModel({
      elements: [
        {
          type: "imagemap",
          name: "q1",
          areas: [
            {
              value: "val1",
              text: "val1_text",
            },
            {
              value: "val2",
              text: "val2_text",
            },
            {
              value: "val3",
              text: "val3_text",
            },
          ]
        }
      ]
    });
    const q1 = <QuestionImageMapModel>model.getQuestionByName("q1");

    expect(q1.getDisplayValue(false, "val1"), "display value for single item").toLooseEqual("val1_text");
    expect(q1.getDisplayValue(false, ["val1", "val2"]), "display value for multiple items").toLooseEqual("val1_text, val2_text");
    expect(q1.getDisplayValue(false, ["val1", "val10", "val2"]), "display value for multiple items with one wrong").toLooseEqual("val1_text, val2_text");
    expect(q1.getDisplayValue(false, [{ value: "val1" }]), "display value for wrong item").toLooseEqual("");
  });

  test("check getDisplayValue with valuePropertyName", () => {

    const model = new SurveyModel({
      elements: [
        {
          type: "imagemap",
          name: "q1",
          valuePropertyName: "state",
          areas: [
            {
              value: "val1",
              text: "val1_text",
            },
            {
              value: "val2",
              text: "val2_text",
            },
            {
              value: "val3",
              text: "val3_text",
            },
          ]
        }
      ]
    });
    const q1 = <QuestionImageMapModel>model.getQuestionByName("q1");

    expect(q1.getDisplayValue(false, "val1"), "display value for single item").toLooseEqual("val1_text");
    expect(q1.getDisplayValue(false, ["val1", "val2"]), "display value for multiple items").toLooseEqual("val1_text, val2_text");

    expect(q1.getDisplayValue(false, { state: "val1" }), "display value for single (object) item").toLooseEqual("val1_text");
    expect(q1.getDisplayValue(false, [{ state: "val1" }]), "display value for single (array) item").toLooseEqual("val1_text");
    expect(q1.getDisplayValue(false, [{ state: "val1" }, { state: "val2" }]), "display value for multiple items").toLooseEqual("val1_text, val2_text");

    expect(q1.getDisplayValue(false, { wrong: "val1" }), "display value for single wrong (object) item").toLooseEqual("");
    expect(q1.getDisplayValue(false, [{ wrong: "val1" }, { wrong: "val1" }]), "display value for single wrong (object) item").toLooseEqual("");
    expect(q1.getDisplayValue(false, [{ wrong: "val1" }, { state: "val2" }, { state: "val10" }]), "display value for multiple items with 2 wrong").toLooseEqual("val2_text");
  });

  test("visibleIf render", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "checkbox", name: "q1", choices: [1, 2, 3, 4] },
        {
          type: "imagemap",
          name: "q2",
          areas: [
            { value: "a", coords: "1" },
            { value: "b", coords: "2", visibleIf: "{q1} contains 1" },
            { value: "c", coords: "3", visibleIf: "{q1} contains 2" },
            { value: "d", coords: "4", visibleIf: "{q1} contains 2" },
            { value: "e", coords: "5", visibleIf: "{q1} contains 1" },
          ]
        }
      ]
    });

    const q1 = survey.getQuestionByName("q1");
    const q2 = <QuestionImageMapModel>survey.getQuestionByName("q2");

    const container = createRenderContainer(q2, i400x400);

    q2.initImageMap(container);
    (container.querySelector(`#${q2.id}-bg`) as HTMLImageElement).dispatchEvent(new Event("load"));
    flushRAF();

    expect(q2.svg.innerHTML, "check #1").toLooseEqual(q2.areas[0].svg.outerHTML);

    q1.value = [1];
    flushRAF();
    expect(q2.svg.innerHTML, "check #2").toLooseEqual(q2.areas[0].svg.outerHTML + q2.areas[1].svg.outerHTML + q2.areas[4].svg.outerHTML);

    q1.value = [2];
    flushRAF();
    expect(q2.svg.innerHTML, "check #3").toLooseEqual(q2.areas[0].svg.outerHTML + q2.areas[2].svg.outerHTML + q2.areas[3].svg.outerHTML);

    q1.value = [3];
    flushRAF();
    expect(q2.svg.innerHTML, "check #4").toLooseEqual(q2.areas[0].svg.outerHTML);
  });

  test("visibleIf clear incorrect values", () => {

    const survey = new SurveyModel({
      elements: [
        { type: "checkbox", name: "q1", choices: [1, 2, 3] },
        {
          type: "imagemap",
          name: "q2",
          clearIfInvisible: "none",
          areas: [
            { value: "a" },
            { value: "b", visibleIf: "{q1} contains 1" },
            { value: "c", visibleIf: "{q1} contains 2" },
          ]
        }
      ]
    });

    const q1 = survey.getQuestionByName("q1");
    const q2 = <QuestionImageMapModel>survey.getQuestionByName("q2");

    q2.value = ["a", "b", "c"];
    survey.tryComplete();
    expect(q2.value, "value is not changed if clearIfInvisible == 'none'").toEqualValues(["a", "b", "c"]);
    survey.clear();

    q2.clearIfInvisible = "onComplete";

    q2.value = ["a", "b", "c"];
    survey.tryComplete();
    expect(q2.value, "only 'a' remains after complete").toEqualValues(["a"]);
    survey.clear();

    q1.value = [1];
    q2.value = ["a", "b", "c"];
    survey.tryComplete();
    expect(q2.value, "only 'a' and 'b' remain after complete").toEqualValues(["a", "b"]);
    survey.clear();

    q2.multiSelect = false;

    q1.value = undefined;
    q2.value = "b";
    survey.tryComplete();
    expect(q2.value, "single: value unset after complete").toLooseEqual(undefined);
    survey.clear();

    q2.value = "a";
    expect(q2.value, "single: value is 'a'").toLooseEqual("a");
    survey.clear();

    q1.value = [1];
    q2.value = "b";
    expect(q2.value, "single: value is 'b'").toLooseEqual("b");
  });

  test("check dependent question visibility with clearIfInvisible:onHidden", () => {

    const survey = new SurveyModel({
      elements: [
        { type: "checkbox", name: "q1", choices: [1, 2, 3] },
        {
          type: "imagemap",
          name: "q2",
          clearIfInvisible: "onHidden",
          areas: [
            { value: "a" },
            { value: "b", visibleIf: "{q1} contains 1" },
            { value: "c", visibleIf: "{q1} contains 2" },
          ]
        },
        {
          type: "checkbox",
          name: "q3",
          visibleIf: "{q2} contains 'c'",
        }
      ]
    });

    const q1 = survey.getQuestionByName("q1");
    const q2 = <QuestionImageMapModel>survey.getQuestionByName("q2");
    const q3 = survey.getQuestionByName("q3");

    q2.value = ["a", "b", "c"];
    expect(q2.value, "q2.value is correct").toEqualValues(["a", "b", "c"]);
    expect(q3.isVisible, "q3 is visible").toLooseEqual(true);

    q1.value = [1];
    expect(q2.value, "q2.value is correct after q1 change to [1]").toEqualValues(["a", "b"]);
    expect(q3.isVisible, "q3 is not visible").toLooseEqual(false);
  });

  test("Locale change test", () => {
    const model = new SurveyModel({
      elements: [
        {
          type: "imagemap",
          name: "q2",
          areas: [
            {
              value: "v1",
              coords: "",
              text: {
                default: "v1_text",
                de: "v1_text_de"
              },
            },
            {
              value: "v2",
              coords: "",
              text: "v2_text",
            }
          ]
        }
      ]
    });

    const q2 = <QuestionImageMapModel>model.getQuestionByName("q2");

    const container = createRenderContainer(q2, i400x400);
    q2.initImageMap(container);
    (container.querySelector(`#${q2.id}-bg`) as HTMLImageElement).dispatchEvent(new Event("load"));
    flushRAF();

    expect(q2.areas[0].text, "v1 default locale text").toLooseEqual("v1_text");
    expect(q2.areas[1].text, "v2 default locale text").toLooseEqual("v2_text");

    let calls = 0;
    const renderSVG = q2.renderSVG;
    q2.renderSVG = () => {
      calls++;
      renderSVG.call(q2);
    };

    model.locale = "de";

    expect(calls, "renderSVG called on locale change").toLooseEqual(1);
    flushRAF();

    expect(q2.areas[0].text, "v1 'de' locale text").toLooseEqual("v1_text_de");
    expect(q2.areas[0].svg.outerHTML, "area[0] 'de' locale svg render").toLooseEqual(`<polygon data-uid="${ q2.areas[0].uniqueId }" points="${ q2.areas[0].getCoords() }" class="sd-imagemap-svg-item" title="${ q2.areas[0].text }"></polygon>`);

    expect(q2.areas[1].text, "v2 'de' locale text").toLooseEqual("v2_text");
    expect(q2.areas[1].svg.outerHTML, "area[1] 'de' locale svg render").toLooseEqual(`<polygon data-uid="${ q2.areas[1].uniqueId }" points="${ q2.areas[1].getCoords() }" class="sd-imagemap-svg-item" title="${ q2.areas[1].text }"></polygon>`);

    expect(q2.svg.innerHTML, "svg innerHTML on 'de' locale").toLooseEqual(q2.areas[0].svg.outerHTML + q2.areas[1].svg.outerHTML);
  });

  test("enableIf", () => {

    const survey = new SurveyModel({
      elements: [
        { type: "boolean", name: "q1" },
        {
          type: "imagemap",
          name: "q2",
          areas: [
            { value: "a" },
            { value: "b", enableIf: "{q1} = true" },
          ]
        }
      ]
    });

    const q1 = survey.getQuestionByName("q1");
    const q2 = <QuestionImageMapModel>survey.getQuestionByName("q2");

    expect(q2.areas[0].isEnabled, "area[0] is enabled by default").toLooseEqual(true);
    expect(q2.areas[1].isEnabled, "area[1] is disabled initially").toLooseEqual(false);
    q2.mapItemToggle(q2.areas[0]);
    q2.mapItemToggle(q2.areas[1]);
    expect(q2.value, "area[1] is disabled, so not added to value").toEqualValues(["a"]);
    q1.value = true;
    q2.mapItemToggle(q2.areas[1]);
    expect(q2.areas[0].isEnabled, "area[0] is enabled still").toLooseEqual(true);
    expect(q2.areas[1].isEnabled, "area[1] is enabled now").toLooseEqual(true);
    expect(q2.value, "area[1] is enabled, so added to value").toEqualValues(["a", "b"]);
  });

  test("Value is not unique", () => {
    expect(Serializer.findProperty("imagemaparea", "value").isUnique, "imagemaparea.value is not unique").toLooseEqual(false);
  });

  test("control points in design mode", () => {
    const model = new SurveyModel({
      elements: [
        {
          type: "imagemap",
          name: "q2",
          areas: [
            {
              value: "v1",
              shape: "rect",
              coords: "1,2,3,4",
            },
            {
              value: "v2",
              shape: "poly",
              coords: "1,2,3,4,5,6,7,8,9,10",
            },
            {
              value: "v3",
              shape: "circle",
              coords: "1,2,3",
            },
          ]
        }
      ]
    });

    model.setDesignMode(true);

    const q2 = <QuestionImageMapModel>model.getQuestionByName("q2");
    const container = createRenderContainer(q2, i400x400);

    q2.initImageMap(container);
    (container.querySelector(`#${q2.id}-bg`) as HTMLImageElement).dispatchEvent(new Event("load"));
    flushRAF();

    expect(q2.createControlPoint(1, 2, 3).outerHTML, "createControlPoint created correctly").toLooseEqual("<circle cx=\"1\" cy=\"2\" r=\"4\" class=\"sd-imagemap-control-point\" data-idx=\"3\"></circle>");

    expect(q2.svg.childNodes.length, "No control points initially").toLooseEqual(q2.areas.length);

    q2.selectedArea = q2.areas[0];
    flushRAF();
    expect(q2.svg.childNodes.length, "Control points created for rect #1").toLooseEqual(q2.areas.length + 2);
    q2.selectedArea = undefined;
    flushRAF();
    expect(q2.svg.childNodes.length, "Control points removed").toLooseEqual(q2.areas.length);
    q2.selectedArea = q2.areas[1];
    flushRAF();
    expect(q2.svg.childNodes.length, "Control points created for poly").toLooseEqual(q2.areas.length + 5);
    q2.selectedArea = q2.areas[0];
    flushRAF();
    expect(q2.svg.childNodes.length, "Control points created for rect #2").toLooseEqual(q2.areas.length + 2);
    q2.selectedArea = q2.areas[1];
    q2.areas[1].addCoord(11, 12);
    q2.renderSVG();
    flushRAF();
    expect(q2.svg.childNodes.length, "Control point added for poly").toLooseEqual(q2.areas.length + 6);
    expect(q2.areas[1].coords, "New coord added correctly").toLooseEqual("1,2,3,4,5,6,7,8,9,10,11,12");
    q2.areas[1].removeCoord(1);
    q2.renderSVG();
    flushRAF();
    expect(q2.svg.childNodes.length, "Control removed").toLooseEqual(q2.areas.length + 5);
    expect(q2.areas[1].coords, "Coord removed correctly").toLooseEqual("1,2,5,6,7,8,9,10,11,12");
    q2.selectedArea = q2.areas[0];
    q2.areas[0].addCoord(5, 6);
    q2.renderSVG();
    flushRAF();
    expect(q2.svg.childNodes.length, "No new control point for rect").toLooseEqual(q2.areas.length + 2);
    expect(q2.areas[0].coords, "No coords changed for rect #1").toLooseEqual("1,2,3,4");
    q2.areas[0].removeCoord(1);
    q2.renderSVG();
    flushRAF();
    expect(q2.svg.childNodes.length, "No new control point for rect").toLooseEqual(q2.areas.length + 2);
    expect(q2.areas[0].coords, "No coords changed for rect #2").toLooseEqual("1,2,3,4");
    q2.selectedArea = q2.areas[2];
    q2.areas[2].addCoord(5, 6);
    q2.renderSVG();
    flushRAF();
    expect(q2.svg.childNodes.length, "No new control point for circle").toLooseEqual(q2.areas.length + 2);
    expect(q2.areas[2].coords, "No coords changed for circle #1").toLooseEqual("1,2,3");
    q2.areas[2].removeCoord(1);
    q2.renderSVG();
    flushRAF();
    expect(q2.svg.childNodes.length, "No new control point for circle").toLooseEqual(q2.areas.length + 2);
    expect(q2.areas[2].coords, "No coords changed for circle #2").toLooseEqual("1,2,3");
  });
});
