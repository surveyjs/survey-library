import { QuestionImageMapModel } from "../src/question_imagemap";
import { SurveyModel } from "../src/survey";
import { Serializer } from "../src/jsonobject";

export default QUnit.module("imagemap");

const i400x400 = "data:image/svg+xml;base64," + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"></svg>');

function createRenderContainer(model: QuestionImageMapModel, image: string): HTMLElement {

  const container = document.createElement("div");
  container.innerHTML = `
    <img id="${ model.id }-bg" src="${ image }" />
    <svg id="${ model.id }-svg"></svg>
  `;

  return container;
}

QUnit.test("Register and load from json", (assert) => {

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

  assert.equal(q1.getType(), "imagemap", "type is imagemap");
  assert.equal(q1.imageLink, "imageLink_url", "imageLink is imageLink_url");
  assert.equal(q1.areas.length, 3, "imageMap.length is 2");

  assert.equal(q1.areas[0].getType(), "imagemaparea", "areas[0] type is imagemaparea");

  assert.equal(q1.areas[0].value, "val1", "[0].value must be val1");
  assert.equal(q1.areas[0].shape, "inherit", "default shape must be inherit");
  assert.equal(q1.areas[0].getShape(), "poly", "default shape must be poly");
  assert.equal(q1.areas[0].coords, "x1,y1,x2,y2,x3,y3,x4,y4", "coords must be set");

  assert.equal(q1.areas[1].value, "val2", "[1].value must be val2");
  assert.equal(q1.areas[1].shape, "rect", "second item shape must be rect");

  q1.shape = "circle";
  assert.equal(q1.areas[0].shape, "inherit", "shape must be inherit #2");
  assert.equal(q1.areas[0].getShape(), "circle", "shape must be circle");
  assert.equal(q1.areas[1].shape, "rect", "second item shape must be rect still");
});

QUnit.test("Check toggle and multiSelect change", (assert) => {

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

  assert.equal(q1.value, undefined, "value must be undefined initially");
  assert.equal(q1.multiSelect, true, "multiSelect is true by default");

  q1.mapItemToggle(q1.areas[0]);
  assert.deepEqual(q1.value, ["val1"], "value must be ['val1'] after first tooggle");
  assert.equal(q1.isItemSelected(q1.areas[0]), true, "must be selected after first click");
  assert.equal(q1.isItemSelected(q1.areas[1]), false, "must not be selected after first click");

  q1.mapItemToggle(q1.areas[0]);
  assert.deepEqual(q1.value, [], "value must be [] untoggling off item");

  q1.mapItemToggle(q1.areas[0]);
  q1.mapItemToggle(q1.areas[1]);
  assert.deepEqual(q1.value, ["val1", "val2"], "value must be ['val1', 'val2'] after selecting two items");

  q1.readOnly = true;
  q1.mapItemToggle(q1.areas[1]);
  q1.mapItemToggle(q1.areas[2]);
  assert.deepEqual(q1.value, ["val1", "val2"], "value must be unchanged in readOnly mode");
  q1.readOnly = false;

  q1.mapItemToggle(q1.areas[0]);
  assert.deepEqual(q1.value, ["val2"], "value must be ['val2'] after toggling first item off");

  q1.multiSelect = false;
  assert.equal(q1.multiSelect, false, "multiSelect must be false now");
  assert.equal(q1.value, undefined, "value must be undefined #1");

  q1.mapItemToggle(q1.areas[0]);
  assert.equal(q1.value, "val1", "Single: value must be val1");
  assert.equal(q1.isItemSelected(q1.areas[0]), true, "Single: imageMap[0] must be selected");
  assert.equal(q1.isItemSelected(q1.areas[1]), false, "Single: imageMap[1] must not be selected");

  q1.mapItemToggle(q1.areas[0]);
  assert.equal(q1.value, undefined, "Single: value must be undefined after toggling off");

  q1.mapItemToggle(q1.areas[1]);
  assert.equal(q1.value, "val2", "Single: value must be val2");
  assert.equal(q1.isItemSelected(q1.areas[0]), false, "Single: imageMap[0] must not be selected");
  assert.equal(q1.isItemSelected(q1.areas[1]), true, "Single: imageMap[1] must be selected");

  q1.multiSelect = true;
  assert.equal(q1.multiSelect, true, "multiSelect must be true now");
  assert.equal(q1.value, undefined, "value must be undefined #2");
});

QUnit.test("Check init", (assert) => {

  var done = assert.async(1);

  const model: QuestionImageMapModel = new QuestionImageMapModel("");
  const imageDataURL = "data:image/svg+xml;base64," + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="100%" height="100%" fill="#DDDDDD"/></svg>');

  let container = document.createElement("div");
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
  setTimeout(() => {
    assert.equal(renderSVGCount, 1, "renderSVG must be called 1 time after init");
    done();
  }, 10);

  model.initImageMap(container);
});

QUnit.test("Check svg render", (assert) => {

  var done = assert.async();

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

  setTimeout(() =>{

    assert.equal(
      q1.areas[0].svg.outerHTML,
      `<polygon data-uid="${ q1.areas[0].uniqueId }" points="${ q1.areas[0].coords }" class="${ q1.areas[0].getCSSClasses() }" title="${ q1.areas[0].title }"></polygon>`,
      "area[0] SVG incorrect");

    let a1coords = q1.areas[1].coords.split(",").map(Number);
    assert.equal(
      q1.areas[1].svg.outerHTML,
      `<rect data-uid="${ q1.areas[1].uniqueId }" x="${ a1coords[0] }" y="${ a1coords[1] }" width="${ a1coords[2] - a1coords[0] }" height="${ a1coords[3] - a1coords[1] }" class="${ q1.areas[1].getCSSClasses() }" title="${ q1.areas[1].title }"></rect>`,
      "area[1] SVG incorrect");

    let a2coords = q1.areas[2].coords.split(",").map(Number);
    assert.equal(
      q1.areas[2].svg.outerHTML,
      `<circle data-uid="${ q1.areas[2].uniqueId }" cx="${ a2coords[0] }" cy="${ a2coords[1] }" r="${ a2coords[2] }" class="${ q1.areas[2].getCSSClasses() }" title="${ q1.areas[2].title }"></circle>`,
      "area[2] SVG incorrect");

    done();
  }, 10);
});

QUnit.test("css variables", (assert) => {

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

  assert.equal(
    q1.getCSSVariables(),
    "",
    "question css variables empty by default"
  );

  q1.idleFillColor = "dfc";
  q1.idleStrokeColor = "dsc";
  q1.idleStrokeWidth = 1;
  q1.hoverFillColor = "dhc";
  q1.hoverStrokeColor = "dsc";
  q1.hoverStrokeWidth = 2;
  q1.selectedFillColor = "dsc";
  q1.selectedStrokeColor = "dsc";
  q1.selectedStrokeWidth = 3;

  assert.equal(
    q1.getCSSVariables(),
    "--sd-imagemap-idle-fill-color: dfc; --sd-imagemap-idle-stroke-color: dsc; --sd-imagemap-idle-stroke-width: 1; --sd-imagemap-hover-fill-color: dhc; --sd-imagemap-hover-stroke-color: dsc; --sd-imagemap-hover-stroke-width: 2; --sd-imagemap-selected-fill-color: dsc; --sd-imagemap-selected-stroke-color: dsc; --sd-imagemap-selected-stroke-width: 3",
    "question css variables correct"
  );

  assert.equal(
    q1.areas[0].getCSSVariables(),
    "",
    "area[1] css variables correct"
  );

  assert.equal(
    q1.areas[1].getCSSVariables(),
    "--sd-imagemap-idle-fill-color: ifc; --sd-imagemap-idle-stroke-color: isc; --sd-imagemap-idle-stroke-width: 1; --sd-imagemap-hover-fill-color: hfc; --sd-imagemap-hover-stroke-color: hsc; --sd-imagemap-hover-stroke-width: 2; --sd-imagemap-selected-fill-color: sfc; --sd-imagemap-selected-stroke-color: ssc; --sd-imagemap-selected-stroke-width: 3",
    "area[1] css variables correct"
  );
});

QUnit.test("Check set value and multiSelect change with valuePropertyName", (assert) => {

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
  assert.deepEqual(q1.value, [{ state: "TX" }], "value is set correctly as array");

  q1.value = "TX";
  assert.deepEqual(q1.value, [{ state: "TX" }], "value is set correctly as string");
});

QUnit.test("check defaultValue with valuePropertyName", (assert) => {

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

  assert.deepEqual(q1.value, [{ state: "TX" }], "defaultValue is set correctly");
});

QUnit.test("check maxSelectedChoices via mapItemTooggle", (assert) => {

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

  assert.deepEqual(q1.value, ["val1", "val2"], "the third item is not added, max is 2");
});

QUnit.test("check minSelectedAreas + maxSelectedChoices and errors", (assert) => {

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
  assert.equal(q1.validate(), false, "there is only one item, min is 2");
  assert.equal(q1.errors.length, 1, "there is one error");

  q1.value = ["val1", "val2"];
  assert.equal(q1.validate(), true, "there are two items, min is 2");
  assert.equal(q1.errors.length, 0, "there is no error");

  q1.value = ["val1", "val2", "val3", "val4"];
  assert.equal(q1.validate(), false, "there are four items, max is 3");
  assert.equal(q1.errors.length, 1, "there is one error");
});

QUnit.test("check getDisplayValue without valuePropertyName", (assert) => {

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

  assert.equal(q1.getDisplayValue(false, "val1"), "val1_text", "display value for single item");
  assert.equal(q1.getDisplayValue(false, ["val1", "val2"]), "val1_text, val2_text", "display value for multiple items");
  assert.equal(q1.getDisplayValue(false, ["val1", "val10", "val2"]), "val1_text, val2_text", "display value for multiple items with one wrong");
  assert.equal(q1.getDisplayValue(false, [{ value: "val1" }]), "", "display value for wrong item");
});

QUnit.test("check getDisplayValue with valuePropertyName", (assert) => {

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

  assert.equal(q1.getDisplayValue(false, "val1"), "val1_text", "display value for single item");
  assert.equal(q1.getDisplayValue(false, ["val1", "val2"]), "val1_text, val2_text", "display value for multiple items");

  assert.equal(q1.getDisplayValue(false, { state: "val1" }), "val1_text", "display value for single (object) item");
  assert.equal(q1.getDisplayValue(false, [{ state: "val1" }]), "val1_text", "display value for single (array) item");
  assert.equal(q1.getDisplayValue(false, [{ state: "val1" }, { state: "val2" }]), "val1_text, val2_text", "display value for multiple items");

  assert.equal(q1.getDisplayValue(false, { wrong: "val1" }), "", "display value for single wrong (object) item");
  assert.equal(q1.getDisplayValue(false, [{ wrong: "val1" }, { wrong: "val1" }]), "", "display value for single wrong (object) item");
  assert.equal(q1.getDisplayValue(false, [{ wrong: "val1" }, { state: "val2" }, { state: "val10" }]), "val2_text", "display value for multiple items with 2 wrong");
});

QUnit.test("visibleIf render", (assert) => {

  const done = assert.async();
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

  let container = createRenderContainer(q2, i400x400);

  q2.initImageMap(container);

  setTimeout(() => {

    assert.equal(
      q2.svg.innerHTML,
      q2.areas[0].svg.outerHTML,
      "check #1"
    );

    q1.value = [1];
    assert.equal(
      q2.svg.innerHTML,
      q2.areas[0].svg.outerHTML + q2.areas[1].svg.outerHTML + q2.areas[4].svg.outerHTML,
      "check #2"
    );

    q1.value = [2];
    assert.equal(
      q2.svg.innerHTML,
      q2.areas[0].svg.outerHTML + q2.areas[2].svg.outerHTML + q2.areas[3].svg.outerHTML,
      "check #3"
    );

    q1.value = [3];
    assert.equal(
      q2.svg.innerHTML,
      q2.areas[0].svg.outerHTML,
      "check #4"
    );

    done();

  }, 10);
});

QUnit.test("visibleIf clear incorrect values", (assert) => {

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
  assert.deepEqual(q2.value, ["a", "b", "c"], "value is not changed if clearIfInvisible == 'none'");
  survey.clear();

  q2.clearIfInvisible = "onComplete";

  q2.value = ["a", "b", "c"];
  survey.tryComplete();
  assert.deepEqual(q2.value, ["a"], "only 'a' remains after complete");
  survey.clear();

  q1.value = [1];
  q2.value = ["a", "b", "c"];
  survey.tryComplete();
  assert.deepEqual(q2.value, ["a", "b"], "only 'a' and 'b' remain after complete");
  survey.clear();

  q2.multiSelect = false;

  q1.value = undefined;
  q2.value = "b";
  survey.tryComplete();
  assert.equal(q2.value, undefined, "single: value unset after complete");
  survey.clear();

  q2.value = "a";
  assert.equal(q2.value, "a", "single: value is 'a'");
  survey.clear();

  q1.value = [1];
  q2.value = "b";
  assert.equal(q2.value, "b", "single: value is 'b'");
});

QUnit.test("check dependent question visibility with clearIfInvisible:onHidden", (assert) => {

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
  assert.deepEqual(q2.value, ["a", "b", "c"], "q2.value is correct");
  assert.equal(q3.isVisible, true, "q3 is visible");

  q1.value = [1];
  assert.deepEqual(q2.value, ["a", "b"], "q2.value is correct after q1 change to [1]");
  assert.equal(q3.isVisible, false, "q3 is not visible");
});

QUnit.test("Locale change test", (assert) => {

  const done = assert.async();

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

  let container = createRenderContainer(q2, i400x400);
  q2.initImageMap(container);

  setTimeout(() => {

    assert.equal(q2.areas[0].text, "v1_text", "v1 default locale text");
    assert.equal(q2.areas[1].text, "v2_text", "v2 default locale text");

    let calls = 0;
    const renderSVG = q2.renderSVG;
    q2.renderSVG = () => {
      calls++;
      renderSVG.call(q2);
    };

    model.locale = "de";

    assert.equal(calls, 1, "renderSVG called on locale change");

    assert.equal(q2.areas[0].text, "v1_text_de", "v1 'de' locale text");
    assert.equal(
      q2.areas[0].svg.outerHTML,
      `<polygon data-uid="${ q2.areas[0].uniqueId }" points="${ q2.areas[0].getCoords() }" class="sd-imagemap-svg-item" title="${ q2.areas[0].text }"></polygon>`,
      "area[0] 'de' locale svg render"
    );

    assert.equal(q2.areas[1].text, "v2_text", "v2 'de' locale text");
    assert.equal(
      q2.areas[1].svg.outerHTML,
      `<polygon data-uid="${ q2.areas[1].uniqueId }" points="${ q2.areas[1].getCoords() }" class="sd-imagemap-svg-item" title="${ q2.areas[1].text }"></polygon>`,
      "area[1] 'de' locale svg render"
    );

    assert.equal(q2.svg.innerHTML,
      q2.areas[0].svg.outerHTML + q2.areas[1].svg.outerHTML,
      "svg innerHTML on 'de' locale"
    );

    done();

  }, 10);

});

QUnit.test("enableIf", (assert) => {

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

  assert.equal(q2.areas[0].isEnabled, true, "area[0] is enabled by default");
  assert.equal(q2.areas[1].isEnabled, false, "area[1] is disabled initially");
  q2.mapItemToggle(q2.areas[0]);
  q2.mapItemToggle(q2.areas[1]);
  assert.deepEqual(q2.value, ["a"], "area[1] is disabled, so not added to value");
  q1.value = true;
  q2.mapItemToggle(q2.areas[1]);
  assert.equal(q2.areas[0].isEnabled, true, "area[0] is enabled still");
  assert.equal(q2.areas[1].isEnabled, true, "area[1] is enabled now");
  assert.deepEqual(q2.value, ["a", "b"], "area[1] is enabled, so added to value");
});

QUnit.test("Value is not unique", (assert) => {
  assert.equal(Serializer.findProperty("imagemaparea", "value").isUnique, false, "imagemaparea.value is not unique");
});

QUnit.test("control points render in design mode", (assert) => {

  const done = assert.async();

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
  let container = createRenderContainer(q2, i400x400);
  q2.initImageMap(container);

  setTimeout(() => {

    assert.equal(q2.svg.childNodes.length, q2.areas.length, "No control points initially");
    q2.selectedArea = q2.areas[0];
    assert.equal(q2.svg.childNodes.length, q2.areas.length + 2, "Control points created");
    q2.selectedArea = undefined;
    assert.equal(q2.svg.childNodes.length, q2.areas.length, "Control points removed");
    q2.selectedArea = q2.areas[1];
    assert.equal(q2.svg.childNodes.length, q2.areas.length + 5, "Control points created for poly");
    q2.selectedArea = q2.areas[0];
    assert.equal(q2.svg.childNodes.length, q2.areas.length + 2, "Control points created");

    done();
  }, 100);
});