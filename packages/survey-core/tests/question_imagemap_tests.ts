// import { QuestionImageMapModel } from "../src/question_imagemap";
// import { SurveyModel } from "../src/survey";

// export default QUnit.module("imagemap");

// QUnit.test("Register and load from json", (assert) => {

//   const model = new SurveyModel({
//     elements: [
//       {
//         type: "imagemap",
//         name: "q1",
//         imageLink: "imageLink_url",
//         areas: [
//           {
//             value: "val1",
//             text: "val1_text",
//             coords: "x1,y1,x2,y2,x3,y3,x4,y4"
//           },
//           {
//             value: "val2",
//             text: "val2_text",
//             shape: "rect",
//             coords: "x1,y1,x2,y2",
//           },
//           {
//             value: "val2",
//             text: "val2_text",
//             shape: "circle",
//             coords: "x1,y1,r1"
//           },
//         ]
//       }
//     ]
//   });
//   const q1 = <QuestionImageMapModel>model.getQuestionByName("q1");

//   assert.equal(q1.getType(), "imagemap", "type is imagemap");
//   assert.equal(q1.imageLink, "imageLink_url", "imageLink is imageLink_url");
//   assert.equal(q1.areas.length, 3, "imageMap.length is 2");

//   assert.equal(q1.areas[0].getType(), "imagemaparea", "areas[0] type is imagemaparea");

//   assert.equal(q1.areas[0].value, "val1", "[0].value must be val1");
//   assert.equal(q1.areas[0].shape, "inherit", "default shape must be inherit");
//   assert.equal(q1.areas[0].getShape(), "poly", "default shape must be poly");
//   assert.equal(q1.areas[0].coords, "x1,y1,x2,y2,x3,y3,x4,y4", "coords must be set");

//   assert.equal(q1.areas[1].value, "val2", "[1].value must be val2");
//   assert.equal(q1.areas[1].shape, "rect", "second item shape must be rect");

//   q1.shape = "circle";
//   assert.equal(q1.areas[0].shape, "inherit", "shape must be inherit #2");
//   assert.equal(q1.areas[0].getShape(), "circle", "shape must be circle");
//   assert.equal(q1.areas[1].shape, "rect", "second item shape must be rect still");
// });

// QUnit.test("Check toggle and multiSelect change", (assert) => {

//   const model = new SurveyModel({
//     elements: [
//       {
//         type: "imagemap",
//         name: "q1",
//         imageLink: "imageLink_url",
//         areas: [
//           {
//             value: "val1",
//             text: "val1_text",
//             coords: "x1,y1,x2,y2,x3,y3,x4,y4"
//           },
//           {
//             value: "val2",
//             text: "val2_text",
//             shape: "rect",
//             coords: "x1,y1,x2,y2"
//           },
//           {
//             value: "val2",
//             text: "val2_text",
//             shape: "circle",
//             coords: "x1,y1,r1"
//           },
//         ]
//       }
//     ]
//   });
//   const q1 = <QuestionImageMapModel>model.getQuestionByName("q1");

//   assert.equal(q1.value, undefined, "value must be undefined initially");
//   assert.equal(q1.multiSelect, true, "multiSelect is true by default");

//   q1.mapItemTooggle(q1.areas[0]);
//   assert.deepEqual(q1.value, ["val1"], "value must be ['val1'] after first tooggle");
//   assert.equal(q1.isItemSelected(q1.areas[0]), true, "must be selected after first click");
//   assert.equal(q1.isItemSelected(q1.areas[1]), false, "must not be selected after first click");

//   q1.mapItemTooggle(q1.areas[0]);
//   assert.deepEqual(q1.value, [], "value must be [] untoggling off item");

//   q1.mapItemTooggle(q1.areas[0]);
//   q1.mapItemTooggle(q1.areas[1]);
//   assert.deepEqual(q1.value, ["val1", "val2"], "value must be ['val1', 'val2'] after selecting two items");

//   q1.readOnly = true;
//   q1.mapItemTooggle(q1.areas[1]);
//   q1.mapItemTooggle(q1.areas[2]);
//   assert.deepEqual(q1.value, ["val1", "val2"], "value must be unchanged in readOnly mode");
//   q1.readOnly = false;

//   q1.mapItemTooggle(q1.areas[0]);
//   assert.deepEqual(q1.value, ["val2"], "value must be ['val2'] after toggling first item off");

//   q1.multiSelect = false;
//   assert.equal(q1.multiSelect, false, "multiSelect must be false now");
//   assert.equal(q1.value, undefined, "value must be undefined #1");

//   q1.mapItemTooggle(q1.areas[0]);
//   assert.equal(q1.value, "val1", "Single: value must be val1");
//   assert.equal(q1.isItemSelected(q1.areas[0]), true, "Single: imageMap[0] must be selected");
//   assert.equal(q1.isItemSelected(q1.areas[1]), false, "Single: imageMap[1] must not be selected");

//   q1.mapItemTooggle(q1.areas[0]);
//   assert.equal(q1.value, undefined, "Single: value must be undefined after toggling off");

//   q1.mapItemTooggle(q1.areas[1]);
//   assert.equal(q1.value, "val2", "Single: value must be val2");
//   assert.equal(q1.isItemSelected(q1.areas[0]), false, "Single: imageMap[0] must not be selected");
//   assert.equal(q1.isItemSelected(q1.areas[1]), true, "Single: imageMap[1] must be selected");

//   q1.multiSelect = true;
//   assert.equal(q1.multiSelect, true, "multiSelect must be true now");
//   assert.equal(q1.value, undefined, "value must be undefined #2");
// });

// QUnit.test("Check scaleCoords", (assert) => {
//   const model = new SurveyModel({
//     elements: [
//       {
//         type: "imagemap",
//         name: "q1",
//         areas: [
//           {
//             value: "v1",
//             coords: "10,20,30,40,50,60"
//           },
//         ]
//       }
//     ]
//   });
//   const q1 = <QuestionImageMapModel>model.getQuestionByName("q1");
//   const coords = q1.areas[0].coords.split(",").map(Number);
//   assert.deepEqual(q1.getItemCoords(q1.areas[0], 2), coords.map(e => e * 2), "scale by 2 works");
//   assert.deepEqual(q1.getItemCoords(q1.areas[0], .5), coords.map(e => e * 0.5), "scale by 0.5 works");
// });

// QUnit.test("Check init", (assert) => {

//   var done = assert.async(4);

//   const model: QuestionImageMapModel = new QuestionImageMapModel("");
//   const imageDataURL = "data:image/svg+xml;base64," + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="100%" height="100%" fill="#DDDDDD"/></svg>');

//   let container = document.createElement("div");
//   container.innerHTML = `
//     <img id="imagemap-${ model.id }-background" src="${ imageDataURL }" />
//     <canvas id="imagemap-${ model.id }-canvas-selected"></canvas>
//     <canvas id="imagemap-${ model.id }-canvas-hover"></canvas>
//     <canvas id="imagemap-${ model.id }-canvas-preview"></canvas>
//     <map></map>
//   `;

//   let renderImageMapCalls = 0;
//   const renderImageMap = model.renderImageMap;
//   model.renderImageMap = () => {
//     renderImageMapCalls++;
//     renderImageMap.apply(model);
//   };
//   setTimeout(() => {
//     assert.equal(renderImageMapCalls, 1, "renderImageMap must be called 1 time after initImageMap");
//     done();
//   }, 10);

//   let renderPreviewCanvasCalls = 0;
//   const renderPreviewCanvas = model.renderPreviewCanvas;
//   model.renderPreviewCanvas = () => {
//     renderPreviewCanvasCalls++;
//     renderPreviewCanvas.apply(model);
//   };
//   setTimeout(() => {
//     assert.equal(renderPreviewCanvasCalls, 1, "renderPreviewCanvas must be called 1 time after initImageMap");
//     done();
//   }, 10);

//   let renderSelectedCanvasCalls = 0;
//   const renderSelectedCanvas = model.renderSelectedCanvas;
//   model.renderSelectedCanvas = () => {
//     renderSelectedCanvasCalls++;
//     renderSelectedCanvas.apply(model);
//   };
//   setTimeout(() => {
//     assert.equal(renderSelectedCanvasCalls, 1, "renderSelectedCanvas must be called 1 time after initImageMap");
//     done();
//   }, 10);

//   let renderHoverCanvasCalls = 0;
//   const renderHoverCanvas = model.renderHoverCanvas;
//   model.renderHoverCanvas = () => {
//     renderHoverCanvasCalls++;
//     renderHoverCanvas.apply(model);
//   };
//   setTimeout(() => {
//     assert.equal(renderHoverCanvasCalls, 1, "renderHoverCanvas must be called 1 time after initImageMap");
//     done();
//   }, 10);

//   model.initImageMap(container);
// });

// QUnit.test("Check map render", (assert) => {

//   var done = assert.async();
//   const imageDataURL = "data:image/svg+xml;base64," + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"></svg>');

//   const model = new SurveyModel({
//     elements: [
//       {
//         type: "imagemap",
//         name: "q1",
//         areas: [
//           {
//             "value": "val1",
//             "coords": "100,200,300,400"
//           },
//           {
//             "value": "val2",
//             "shape": "rect",
//             "coords": "100,200,300,400"
//           },
//           {
//             "value": "val3",
//             "shape": "circle",
//             "coords": "150,200,100"
//           },
//         ]
//       }
//     ]
//   });

//   const q1 = <QuestionImageMapModel>model.getQuestionByName("q1");

//   let container = document.createElement("div");
//   container.innerHTML = `
//     <img id="imagemap-${ q1.id }-background" src="${ imageDataURL }" />
//     <canvas id="imagemap-${ q1.id }-canvas-selected"></canvas>
//     <canvas id="imagemap-${ q1.id }-canvas-hover"></canvas>
//     <map></map>
//   `;

//   q1.initImageMap(container);

//   setTimeout(() =>{

//     let map = container.querySelector("map");

//     assert.equal(
//       map?.innerHTML,
//       `<area shape="poly" coords="100,200,300,400" title="val1" data-value="${q1.areas[0].uniqueId}"><area shape="rect" coords="100,200,300,400" title="val2" data-value="${q1.areas[1].uniqueId}"><area shape="circle" coords="150,200,100" title="val3" data-value="${q1.areas[2].uniqueId}">`,
//       "Map render correct");

//     q1.backgroundImage.width = 200;
//     q1.renderImageMap();
//     assert.equal(
//       map?.innerHTML,
//       `<area shape="poly" coords="50,100,150,200" title="val1" data-value="${q1.areas[0].uniqueId}"><area shape="rect" coords="50,100,150,200" title="val2" data-value="${q1.areas[1].uniqueId}"><area shape="circle" coords="75,100,50" title="val3" data-value="${q1.areas[2].uniqueId}">`,
//       "Map render correct (smaller)");

//     q1.backgroundImage.width = 800;
//     q1.renderImageMap();
//     assert.equal(
//       map?.innerHTML,
//       `<area shape="poly" coords="200,400,600,800" title="val1" data-value="${q1.areas[0].uniqueId}"><area shape="rect" coords="200,400,600,800" title="val2" data-value="${q1.areas[1].uniqueId}"><area shape="circle" coords="300,400,200" title="val3" data-value="${q1.areas[2].uniqueId}">`,
//       "Map render correct (bigger)");

//     done();
//   }, 10);
// });

// QUnit.test("draw styles without defaults", (assert) => {

//   const model = new SurveyModel({
//     elements: [
//       {
//         type: "imagemap",
//         name: "q1",
//         imageLink: "imageLink_url",
//         areas: [
//           {
//             value: "val1",
//             coords: "x1,y1,x2,y2"
//           },
//           {
//             value: "val2",
//             coords: "x1,y1,x2,y2",
//             idleFillColor: "itemidleFillColor",
//             idleStrokeColor: "itemidleStrokeColor",
//             idleStrokeWidth: 11,
//             hoverFillColor: "itemHoverFillColor",
//             hoverStrokeColor: "itemHoverStrokeColor",
//             hoverStrokeWidth: 22,
//             selectedFillColor: "itemSelectedFillColor",
//             selectedStrokeColor: "itemSelectedStrokeColor",
//             selectedStrokeWidth: 33,
//           },
//         ],
//       }
//     ]
//   });
//   const q1 = <QuestionImageMapModel>model.getQuestionByName("q1");

//   assert.deepEqual(q1.areas[0].getIdleStyle(), {
//     "fillColor": "transparent",
//     "strokeColor": "transparent",
//     "strokeLineWidth": 0
//   }, "default preview style");

//   assert.deepEqual(q1.areas[0].getHoverStyle(), {
//     "fillColor": "#FF00FF",
//     "strokeColor": "#FF00FF",
//     "strokeLineWidth": 2
//   }, "default hover style");

//   assert.deepEqual(q1.areas[0].getSelectedStyle(), {
//     "fillColor": "#FF00FF",
//     "strokeColor": "#FF00FF",
//     "strokeLineWidth": 2
//   }, "default selected style");

//   assert.deepEqual(q1.areas[1].getIdleStyle(), {
//     "fillColor": "itemidleFillColor",
//     "strokeColor": "itemidleStrokeColor",
//     "strokeLineWidth": 11
//   }, "defined preview style");

//   assert.deepEqual(q1.areas[1].getHoverStyle(), {
//     "fillColor": "itemHoverFillColor",
//     "strokeColor": "itemHoverStrokeColor",
//     "strokeLineWidth": 22
//   }, "defined hover style");

//   assert.deepEqual(q1.areas[1].getSelectedStyle(), {
//     "fillColor": "itemSelectedFillColor",
//     "strokeColor": "itemSelectedStrokeColor",
//     "strokeLineWidth": 33
//   }, "defined selected style");
// });

// QUnit.test("draw styles with defaults", (assert) => {

//   const model = new SurveyModel({
//     elements: [
//       {
//         type: "imagemap",
//         name: "q1",
//         imageLink: "imageLink_url",
//         areas: [
//           {
//             value: "val1",
//             coords: "x1,y1,x2,y2"
//           },
//           {
//             value: "val2",
//             coords: "x1,y1,x2,y2",
//             idleFillColor: "itemidleFillColor",
//             idleStrokeColor: "itemidleStrokeColor",
//             idleStrokeWidth: 11,
//             hoverFillColor: "itemHoverFillColor",
//             hoverStrokeColor: "itemHoverStrokeColor",
//             hoverStrokeWidth: 22,
//             selectedFillColor: "itemSelectedFillColor",
//             selectedStrokeColor: "itemSelectedStrokeColor",
//             selectedStrokeWidth: 33,
//           },
//         ],
//         idleFillColor: "defaultidleFillColor",
//         idleStrokeColor: "defaultidleStrokeColor",
//         idleStrokeWidth: 1,
//         hoverFillColor: "defaultHoverFillColor",
//         hoverStrokeColor: "defaultHoverStrokeColor",
//         hoverStrokeWidth: 2,
//         selectedFillColor: "defaultSelectedFillColor",
//         selectedStrokeColor: "defaultSelectedStrokeColor",
//         selectedStrokeWidth: 3,
//       }
//     ]
//   });
//   const q1 = <QuestionImageMapModel>model.getQuestionByName("q1");

//   assert.deepEqual(q1.areas[0].getIdleStyle(), {
//     "fillColor": "defaultidleFillColor",
//     "strokeColor": "defaultidleStrokeColor",
//     "strokeLineWidth": 1
//   }, "default preview style");

//   assert.deepEqual(q1.areas[0].getHoverStyle(), {
//     "fillColor": "defaultHoverFillColor",
//     "strokeColor": "defaultHoverStrokeColor",
//     "strokeLineWidth": 2
//   }, "default hover style");

//   assert.deepEqual(q1.areas[0].getSelectedStyle(), {
//     "fillColor": "defaultSelectedFillColor",
//     "strokeColor": "defaultSelectedStrokeColor",
//     "strokeLineWidth": 3
//   }, "default selected style");

//   assert.deepEqual(q1.areas[1].getIdleStyle(), {
//     "fillColor": "itemidleFillColor",
//     "strokeColor": "itemidleStrokeColor",
//     "strokeLineWidth": 11
//   }, "defined preview style");

//   assert.deepEqual(q1.areas[1].getHoverStyle(), {
//     "fillColor": "itemHoverFillColor",
//     "strokeColor": "itemHoverStrokeColor",
//     "strokeLineWidth": 22
//   }, "defined hover style");

//   assert.deepEqual(q1.areas[1].getSelectedStyle(), {
//     "fillColor": "itemSelectedFillColor",
//     "strokeColor": "itemSelectedStrokeColor",
//     "strokeLineWidth": 33,
//   }, "defined selected style");
// });

// QUnit.test("Check set value and multiSelect change with valuePropertyName", (assert) => {

//   const model = new SurveyModel({
//     elements: [
//       {
//         type: "imagemap",
//         name: "q1",
//         imageLink: "imageLink_url",
//         valuePropertyName: "state",
//       }
//     ]
//   });
//   const q1 = <QuestionImageMapModel>model.getQuestionByName("q1");

//   q1.value = ["TX"];
//   assert.deepEqual(q1.value, [{ state: "TX" }], "value is set correctly as array");

//   q1.value = "TX";
//   assert.deepEqual(q1.value, [{ state: "TX" }], "value is set correctly as string");
// });

// QUnit.test("check defaultValue with valuePropertyName", (assert) => {

//   const model = new SurveyModel({
//     elements: [
//       {
//         type: "imagemap",
//         name: "q1",
//         imageLink: "imageLink_url",
//         valuePropertyName: "state",
//         defaultValue: ["TX"]
//       }
//     ]
//   });
//   const q1 = <QuestionImageMapModel>model.getQuestionByName("q1");

//   assert.deepEqual(q1.value, [{ state: "TX" }], "defaultValue is set correctly");
// });

// QUnit.test("check maxSelectedChoices via mapItemTooggle", (assert) => {

//   const model = new SurveyModel({
//     elements: [
//       {
//         type: "imagemap",
//         name: "q1",
//         maxSelectedAreas: 2,
//         areas: [
//           {
//             value: "val1",
//           },
//           {
//             value: "val2",
//           },
//           {
//             value: "val3",
//           }
//         ]
//       }
//     ]
//   });

//   const q1 = <QuestionImageMapModel>model.getQuestionByName("q1");

//   q1.mapItemTooggle(q1.areas[0]);
//   q1.mapItemTooggle(q1.areas[1]);
//   q1.mapItemTooggle(q1.areas[2]);

//   assert.deepEqual(q1.value, ["val1", "val2"], "the third item is not added, max is 2");
// });

// QUnit.test("check minSelectedAreas + maxSelectedChoices and errors", (assert) => {

//   const model = new SurveyModel({
//     elements: [
//       {
//         type: "imagemap",
//         name: "q1",
//         minSelectedAreas: 2,
//         maxSelectedAreas: 3
//       }
//     ]
//   });

//   const q1 = <QuestionImageMapModel>model.getQuestionByName("q1");

//   q1.value = ["val1"];
//   assert.equal(q1.validate(), false, "there is only one item, min is 2");
//   assert.equal(q1.errors.length, 1, "there is one error");

//   q1.value = ["val1", "val2"];
//   assert.equal(q1.validate(), true, "there are two items, min is 2");
//   assert.equal(q1.errors.length, 0, "there is no error");

//   q1.value = ["val1", "val2", "val3", "val4"];
//   assert.equal(q1.validate(), false, "there are four items, max is 3");
//   assert.equal(q1.errors.length, 1, "there is one error");
// });

// QUnit.test("check getDisplayValue without valuePropertyName", (assert) => {

//   const model = new SurveyModel({
//     elements: [
//       {
//         type: "imagemap",
//         name: "q1",
//         areas: [
//           {
//             value: "val1",
//             text: "val1_text",
//           },
//           {
//             value: "val2",
//             text: "val2_text",
//           },
//           {
//             value: "val3",
//             text: "val3_text",
//           },
//         ]
//       }
//     ]
//   });
//   const q1 = <QuestionImageMapModel>model.getQuestionByName("q1");

//   assert.equal(q1.getDisplayValue(false, "val1"), "val1_text", "display value for single item");
//   assert.equal(q1.getDisplayValue(false, ["val1", "val2"]), "val1_text, val2_text", "display value for multiple items");
//   assert.equal(q1.getDisplayValue(false, ["val1", "val10", "val2"]), "val1_text, val2_text", "display value for multiple items with one wrong");
//   assert.equal(q1.getDisplayValue(false, [{ value: "val1" }]), "", "display value for wrong item");
// });

// QUnit.test("check getDisplayValue with valuePropertyName", (assert) => {

//   const model = new SurveyModel({
//     elements: [
//       {
//         type: "imagemap",
//         name: "q1",
//         valuePropertyName: "state",
//         areas: [
//           {
//             value: "val1",
//             text: "val1_text",
//           },
//           {
//             value: "val2",
//             text: "val2_text",
//           },
//           {
//             value: "val3",
//             text: "val3_text",
//           },
//         ]
//       }
//     ]
//   });
//   const q1 = <QuestionImageMapModel>model.getQuestionByName("q1");

//   assert.equal(q1.getDisplayValue(false, "val1"), "val1_text", "display value for single item");
//   assert.equal(q1.getDisplayValue(false, ["val1", "val2"]), "val1_text, val2_text", "display value for multiple items");

//   assert.equal(q1.getDisplayValue(false, { state: "val1" }), "val1_text", "display value for single (object) item");
//   assert.equal(q1.getDisplayValue(false, [{ state: "val1" }]), "val1_text", "display value for single (array) item");
//   assert.equal(q1.getDisplayValue(false, [{ state: "val1" }, { state: "val2" }]), "val1_text, val2_text", "display value for multiple items");

//   assert.equal(q1.getDisplayValue(false, { wrong: "val1" }), "", "display value for single wrong (object) item");
//   assert.equal(q1.getDisplayValue(false, [{ wrong: "val1" }, { wrong: "val1" }]), "", "display value for single wrong (object) item");
//   assert.equal(q1.getDisplayValue(false, [{ wrong: "val1" }, { state: "val2" }, { state: "val10" }]), "val2_text", "display value for multiple items with 2 wrong");
// });

// QUnit.test("items visibleIf render", (assert) => {

//   const done = assert.async();
//   const survey = new SurveyModel({
//     elements: [
//       { type: "checkbox", name: "q1", choices: [1, 2, 3, 4] },
//       {
//         type: "imagemap",
//         name: "q2",
//         areas: [
//           { value: "a", coords: "1" },
//           { value: "b", coords: "2", visibleIf: "{q1} contains 1" },
//           { value: "c", coords: "3", visibleIf: "{q1} contains 2" },
//           { value: "d", coords: "4", visibleIf: "{q1} contains 2" },
//           { value: "e", coords: "5", visibleIf: "{q1} contains 1" },
//         ]
//       }
//     ]
//   });

//   const q1 = survey.getQuestionByName("q1");
//   const q2 = <QuestionImageMapModel>survey.getQuestionByName("q2");

//   const imageDataURL = "data:image/svg+xml;base64," + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"></svg>');

//   let container = document.createElement("div");
//   container.innerHTML = `
//     <img id="imagemap-${ q2.id }-background" src="${ imageDataURL }" />
//     <canvas id="imagemap-${ q2.id }-canvas-selected"></canvas>
//     <canvas id="imagemap-${ q2.id }-canvas-hover"></canvas>
//     <map></map>
//   `;
//   const HTMLMap = container.querySelector("map");

//   q2.initImageMap(container);

//   setTimeout(() => {

//     assert.equal(q2.visibleAreas.map(e => e.value).join(","), "a", "visibleAreas #1");
//     assert.equal(
//       HTMLMap?.innerHTML,
//       `<area shape="poly" coords="1" title="a" data-value="${q2.areas[0].uniqueId}">`,
//       "HTMLMap #1"
//     );

//     q1.value = [1];
//     assert.equal(q2.visibleAreas.map(e => e.value).join(","), "a,b,e", "visibleAreas #2");
//     assert.equal(
//       HTMLMap?.innerHTML,
//       `<area shape="poly" coords="1" title="a" data-value="${q2.areas[0].uniqueId}"><area shape="poly" coords="2" title="b" data-value="${q2.areas[1].uniqueId}"><area shape="poly" coords="5" title="e" data-value="${q2.areas[4].uniqueId}">`,
//       "HTMLMap #2"
//     );

//     q1.value = [2];
//     assert.equal(q2.visibleAreas.map(e => e.value).join(","), "a,c,d", "visibleAreas #3");
//     assert.equal(
//       HTMLMap?.innerHTML,
//       `<area shape="poly" coords="1" title="a" data-value="${q2.areas[0].uniqueId}"><area shape="poly" coords="3" title="c" data-value="${q2.areas[2].uniqueId}"><area shape="poly" coords="4" title="d" data-value="${q2.areas[3].uniqueId}">`,
//       "HTMLMap #3"
//     );

//     q1.value = [3];
//     assert.equal(q2.visibleAreas.map(e => e.value).join(","), "a", "visibleAreas #4");
//     assert.equal(
//       HTMLMap?.innerHTML,
//       `<area shape="poly" coords="1" title="a" data-value="${q2.areas[0].uniqueId}">`,
//       "HTMLMap #4"
//     );

//     done();

//   }, 10);
// });

// QUnit.test("items visibleIf clear incorrect values", (assert) => {

//   const survey = new SurveyModel({
//     elements: [
//       { type: "checkbox", name: "q1", choices: [1, 2, 3] },
//       {
//         type: "imagemap",
//         name: "q2",
//         clearIfInvisible: "none",
//         areas: [
//           { value: "a" },
//           { value: "b", visibleIf: "{q1} contains 1" },
//           { value: "c", visibleIf: "{q1} contains 2" },
//         ]
//       }
//     ]
//   });

//   const q1 = survey.getQuestionByName("q1");
//   const q2 = <QuestionImageMapModel>survey.getQuestionByName("q2");

//   q2.value = ["a", "b", "c"];
//   survey.tryComplete();
//   assert.deepEqual(q2.value, ["a", "b", "c"], "value is not changed if clearIfInvisible == 'none'");
//   survey.clear();

//   q2.clearIfInvisible = "onComplete";

//   q2.value = ["a", "b", "c"];
//   survey.tryComplete();
//   assert.deepEqual(q2.value, ["a"], "only 'a' remains after complete");
//   survey.clear();

//   q1.value = [1];
//   q2.value = ["a", "b", "c"];
//   survey.tryComplete();
//   assert.deepEqual(q2.value, ["a", "b"], "only 'a' and 'b' remain after complete");
//   survey.clear();

//   q2.multiSelect = false;

//   q1.value = undefined;
//   q2.value = "b";
//   survey.tryComplete();
//   assert.equal(q2.value, undefined, "single: value unset after complete");
//   survey.clear();

//   q2.value = "a";
//   assert.equal(q2.value, "a", "single: value is 'a'");
//   survey.clear();

//   q1.value = [1];
//   q2.value = "b";
//   assert.equal(q2.value, "b", "single: value is 'b'");
// });

// QUnit.test("check dependent question visibility with clearIfInvisible:onHidden", (assert) => {

//   const survey = new SurveyModel({
//     elements: [
//       { type: "checkbox", name: "q1", choices: [1, 2, 3] },
//       {
//         type: "imagemap",
//         name: "q2",
//         clearIfInvisible: "onHidden",
//         areas: [
//           { value: "a" },
//           { value: "b", visibleIf: "{q1} contains 1" },
//           { value: "c", visibleIf: "{q1} contains 2" },
//         ]
//       },
//       {
//         type: "checkbox",
//         name: "q3",
//         visibleIf: "{q2} contains 'c'",
//       }
//     ]
//   });

//   const q1 = survey.getQuestionByName("q1");
//   const q2 = <QuestionImageMapModel>survey.getQuestionByName("q2");
//   const q3 = survey.getQuestionByName("q3");

//   q2.value = ["a", "b", "c"];
//   assert.deepEqual(q2.value, ["a", "b", "c"], "q2.value is correct");
//   assert.equal(q3.isVisible, true, "q3 is visible");

//   q1.value = [1];
//   assert.deepEqual(q2.value, ["a", "b"], "q2.value is correct after q1 change to [1]");
//   assert.equal(q3.isVisible, false, "q3 is not visible");
// });

// QUnit.test("Locale change test", (assert) => {

//   const imageDataURL = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIiB2aWV3Qm94PSIwIDAgNjAwIDYwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI0RERERERCIvPjwvc3ZnPg==";

//   const model = new SurveyModel({
//     elements: [
//       {
//         type: "imagemap",
//         name: "q2",
//         areas: [
//           {
//             value: "v1",
//             text: {
//               default: "v1_text",
//               de: "v1_text_de"
//             },
//           },
//           {
//             value: "v2",
//             text: "v2_text",
//           }
//         ]
//       }
//     ]
//   });

//   const q2 = <QuestionImageMapModel>model.getQuestionByName("q2");

//   let container = document.createElement("div");
//   container.innerHTML = `
//     <img id="imagemap-${ q2.id }-background" src="${ imageDataURL }" />
//     <canvas id="imagemap-${ q2.id }-canvas-selected"></canvas>
//     <canvas id="imagemap-${ q2.id }-canvas-hover"></canvas>
//     <map></map>
//   `;

//   assert.equal(q2.areas[0].text, "v1_text", "v1 default locale text");
//   assert.equal(q2.areas[1].text, "v2_text", "v2 default locale text");

//   let calls = 0;
//   const renderImageMap = q2.renderImageMap;
//   q2.renderImageMap = () => {
//     calls++;
//     renderImageMap.apply(model);
//   };

//   model.locale = "de";

//   assert.equal(q2.areas[0].text, "v1_text_de", "v1 de locale text");
//   assert.equal(q2.areas[1].text, "v2_text", "v2 de locale text");
//   assert.equal(calls, 1, "renderImageMap called on locale change");

// });

// QUnit.test("Uniq value", (assert) => {
//   assert.equal(true, true); // TODO implement uniq value test
// });

// QUnit.test("enableIf", (assert) => {

//   const survey = new SurveyModel({
//     elements: [
//       { type: "boolean", name: "q1" },
//       {
//         type: "imagemap",
//         name: "q2",
//         areas: [
//           { value: "a" },
//           { value: "b", enableIf: "{q1} = true" },
//         ]
//       }
//     ]
//   });

//   const q1 = survey.getQuestionByName("q1");
//   const q2 = <QuestionImageMapModel>survey.getQuestionByName("q2");

//   assert.equal(q2.areas[0].isEnabled, true, "area[0] is enabled by default");
//   assert.equal(q2.areas[1].isEnabled, false, "area[1] is disabled initially");
//   q2.mapItemTooggle(q2.areas[0]);
//   q2.mapItemTooggle(q2.areas[1]);
//   assert.deepEqual(q2.value, ["a"], "area[1] is disabled, so not added to value");
//   q1.value = true;
//   q2.mapItemTooggle(q2.areas[1]);
//   assert.equal(q2.areas[0].isEnabled, true, "area[0] is enabled still");
//   assert.equal(q2.areas[1].isEnabled, true, "area[1] is enabled now");
//   assert.deepEqual(q2.value, ["a", "b"], "area[1] is enabled, so added to value");
// });

// QUnit.test("isInDesignMode coords", (assert) => {

//   const survey = new SurveyModel({
//     elements: [
//       {
//         type: "imagemap",
//         name: "q1",
//         areas: [
//           { value: "a" },
//           { value: "b", shape: "rect" },
//           { value: "b", shape: "circle" },
//         ]
//       }
//     ]
//   });

//   const q1 = <QuestionImageMapModel>survey.getQuestionByName("q1");

//   assert.equal(q1.isInDesignMode, false, "question is not in design mode initially");
//   assert.deepEqual(q1.getItemCoords(q1.areas[0]), [], "not in design mode, no coords");
//   assert.deepEqual(q1.getItemCoords(q1.areas[1]), [], "not in design mode, no coords");
//   assert.deepEqual(q1.getItemCoords(q1.areas[2]), [], "not in design mode, no coords");

//   survey.setDesignMode(true);
//   assert.equal(q1.isInDesignMode, true, "question is in design mode");
//   assert.deepEqual(q1.getItemCoords(q1.areas[0]), [20, 20, 100, 20, 100, 100, 20, 100], "in design mode, has coords");
//   assert.deepEqual(q1.getItemCoords(q1.areas[1]), [20, 20, 100, 100], "in design mode, has coords");
//   assert.deepEqual(q1.getItemCoords(q1.areas[2]), [60, 60, 40], "in design mode, has coords");

// });