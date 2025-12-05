import { QuestionImageMapModel } from "../src/question_imagemap";
import { SurveyModel } from "../src/survey";

export default QUnit.module("imagemap");

QUnit.test("Register and load from json", function (assert) {

  const model = new SurveyModel({
    elements: [
      {
        type: "imagemap",
        name: "q1",
        imageLink: "imageLink_url",
        imageMap: [
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
            hoverStrokeColor: "#ffff00",
            hoverStrokeSize: 2,
            hoverFillColor: "#FF00FF",
            selectedStrokeColor: "#00FFFF",
            selectedStrokeSize: 3,
            selectedFillColor: "#0000FF"

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
  assert.equal(q1.imageMap.length, 3, "imageMap.length is 2");

  assert.equal(q1.imageMap[0].getType(), "imagemapitem", "areas[0] type is imagemaparea");

  assert.equal(q1.imageMap[0].value, "val1", "[0].value must be val1");
  assert.equal(q1.imageMap[0].shape, "poly", "default shape must be poly");
  assert.equal(q1.imageMap[0].coords, "x1,y1,x2,y2,x3,y3,x4,y4", "coords must be set");
  assert.equal(q1.imageMap[0].hoverStrokeColor, "rgba(255, 0, 0, 1)", "default hoverStrokeColor must be rgba(255, 0, 0, 1)");
  assert.equal(q1.imageMap[0].hoverStrokeSize, 1, "default hoverStrokeSize must be 1");
  assert.equal(q1.imageMap[0].hoverFillColor, "rgba(255, 0, 0, 0.25)", "default hoverFillColor must be rgba(255, 0, 0, 0.25)");
  assert.equal(q1.imageMap[0].selectedStrokeColor, "rgba(0, 0, 0, 1)", "default selectedStrokeColor must be rgba(0, 0, 0, 1)");
  assert.equal(q1.imageMap[0].selectedStrokeSize, 1, "default selectedStrokeSize must be 1");
  assert.equal(q1.imageMap[0].selectedFillColor, "rgba(0, 0, 0, 0.25)", "default selectedFillColor must be rgba(0, 0, 0, 0.25)");

  assert.equal(q1.imageMap[1].value, "val2", "[1].value must be val2");
  assert.equal(q1.imageMap[1].shape, "rect", "second item shape must be rect");
  assert.equal(q1.imageMap[1].hoverStrokeColor, "#ffff00", "second item hoverStrokeColor must be #ffff00");
  assert.equal(q1.imageMap[1].hoverStrokeSize, 2, "second item hoverStrokeSize must be 2");
  assert.equal(q1.imageMap[1].hoverFillColor, "#FF00FF", "second item hoverFillColor must be #FF00FF");
  assert.equal(q1.imageMap[1].selectedStrokeColor, "#00FFFF", "second item selectedStrokeColor must be #00FFFF");
  assert.equal(q1.imageMap[1].selectedStrokeSize, 3, "second item selectedStrokeSize must be 3");
  assert.equal(q1.imageMap[1].selectedFillColor, "#0000FF", "second item selectedFillColor must be #0000FF");
});

QUnit.test("Check toggle and multiSelect change", function (assert) {

  const model = new SurveyModel({
    elements: [
      {
        type: "imagemap",
        name: "q1",
        imageLink: "imageLink_url",
        imageMap: [
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

  q1.mapItemTooggle(q1.imageMap[0]);
  assert.deepEqual(q1.value, ["val1"], "value must be ['val1'] after first tooggle");
  assert.equal(q1.isItemSelected(q1.imageMap[0]), true, "must be selected after first click");
  assert.equal(q1.isItemSelected(q1.imageMap[1]), false, "must not be selected after first click");

  q1.mapItemTooggle(q1.imageMap[0]);
  assert.deepEqual(q1.value, [], "value must be [] untoggling off item");

  q1.mapItemTooggle(q1.imageMap[0]);
  q1.mapItemTooggle(q1.imageMap[1]);
  assert.deepEqual(q1.value, ["val1", "val2"], "value must be ['val1', 'val2'] after selecting two items");

  q1.mapItemTooggle(q1.imageMap[0]);
  assert.deepEqual(q1.value, ["val2"], "value must be ['val2'] after toggling first item off");

  q1.multiSelect = false;
  assert.equal(q1.multiSelect, false, "multiSelect must be false now");
  assert.equal(q1.value, undefined, "value must be undefined #1");

  q1.mapItemTooggle(q1.imageMap[0]);
  assert.equal(q1.value, "val1", "Single: value must be val1");
  assert.equal(q1.isItemSelected(q1.imageMap[0]), true, "Single: imageMap[0] must be selected");
  assert.equal(q1.isItemSelected(q1.imageMap[1]), false, "Single: imageMap[1] must not be selected");

  q1.mapItemTooggle(q1.imageMap[1]);
  assert.equal(q1.value, "val2", "Single: value must be val2");
  assert.equal(q1.isItemSelected(q1.imageMap[0]), false, "Single: imageMap[0] must not be selected");
  assert.equal(q1.isItemSelected(q1.imageMap[1]), true, "Single: imageMap[1] must be selected");

  q1.multiSelect = true;
  assert.equal(q1.multiSelect, true, "multiSelect must be true now");
  assert.equal(q1.value, undefined, "value must be undefined #2");
});

QUnit.test("Check scaleCoords", function (assert) {

  const model = new QuestionImageMapModel("");
  const coords = "10,20,30,40,50,60".split(",").map(Number);

  model.backgroundImage = { width: 200, naturalWidth: 100 } as HTMLImageElement;
  assert.equal(model.scaleCoords(coords).join(","), coords.map(e => e * 2).join(","), "scale by .5 works");

  model.backgroundImage = { width: 100, naturalWidth: 200 } as HTMLImageElement;
  assert.equal(model.scaleCoords(coords).join(","), coords.map(e => e * .5).join(","), "scale by 2 works");
});

QUnit.test("Check init", function (assert) {

  var done = assert.async(3);

  const model: QuestionImageMapModel = new QuestionImageMapModel("");
  const imageDataURL = "data:image/svg+xml;base64," + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="100%" height="100%" fill="#DDDDDD"/></svg>');

  let container = document.createElement("div");
  container.innerHTML = `
    <img id="imagemap-${ model.id }-background" src="${ imageDataURL }" />
    <canvas id="imagemap-${ model.id }-canvas-selected"></canvas>
    <canvas id="imagemap-${ model.id }-canvas-hover"></canvas>
    <map></map>
  `;

  let renderImageMapCalls = 0;
  const renderImageMap = model.renderImageMap;
  model.renderImageMap = () => {
    renderImageMapCalls++;
    renderImageMap.apply(model);
  };
  setTimeout(() => {
    assert.equal(renderImageMapCalls, 1, "renderImageMap must be called 1 time after initImageMap");
    done();
  }, 10);

  let renderSelectedCanvasCalls = 0;
  const renderSelectedCanvas = model.renderSelectedCanvas;
  model.renderSelectedCanvas = () => {
    renderSelectedCanvasCalls++;
    renderSelectedCanvas.apply(model);
  };
  setTimeout(() => {
    assert.equal(renderSelectedCanvasCalls, 1, "renderSelectedCanvas must be called 1 time after initImageMap");
    done();
  }, 10);

  let renderHoverCanvasCalls = 0;
  const renderHoverCanvas = model.renderHoverCanvas;
  model.renderHoverCanvas = () => {
    renderHoverCanvasCalls++;
    renderHoverCanvas.apply(model);
  };
  setTimeout(() => {
    assert.equal(renderHoverCanvasCalls, 1, "renderHoverCanvas must be called 1 time after initImageMap");
    done();
  }, 10);

  model.initImageMap(container);
});