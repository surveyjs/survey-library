// import { resolveObjectURL } from "buffer";
// import { QuestionImageMapModel } from "../src/question_imagemap";
// import { SurveyModel } from "../src/survey";

// export default QUnit.module("imagemap");

// QUnit.only("Register and load from json", function (assert) {

//   const model = new SurveyModel({
//     elements: [
//       {
//         type: "imagemap",
//         name: "q1",
//         imageLink: "imageLink_url",
//         imageMap: [
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
//             hoverStrokeColor: "#ffff00",
//             hoverStrokeSize: 2,
//             hoverFillColor: "#FF00FF",
//             selectedStrokeColor: "#00FFFF",
//             selectedStrokeSize: 3,
//             selectedFillColor: "#0000FF"

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
//   assert.equal(q1.imageMap.length, 3, "imageMap.length is 2");

//   assert.equal(q1.imageMap[0].getType(), "imagemapitem", "areas[0] type is imagemaparea");

//   assert.equal(q1.imageMap[0].value, "val1", "[0].value must be val1");
//   assert.equal(q1.imageMap[0].shape, "poly", "default shape must be poly");
//   assert.equal(q1.imageMap[0].coords, "x1,y1,x2,y2,x3,y3,x4,y4", "coords must be set");
//   assert.equal(q1.imageMap[0].hoverStrokeColor, "rgba(255, 0, 0, 1)", "default hoverStrokeColor must be rgba(255, 0, 0, 1)");
//   assert.equal(q1.imageMap[0].hoverStrokeSize, 1, "default hoverStrokeSize must be 1");
//   assert.equal(q1.imageMap[0].hoverFillColor, "rgba(255, 0, 0, 0.25)", "default hoverFillColor must be rgba(255, 0, 0, 0.25)");
//   assert.equal(q1.imageMap[0].selectedStrokeColor, "rgba(0, 0, 0, 1)", "default selectedStrokeColor must be rgba(0, 0, 0, 1)");
//   assert.equal(q1.imageMap[0].selectedStrokeSize, 1, "default selectedStrokeSize must be 1");
//   assert.equal(q1.imageMap[0].selectedFillColor, "rgba(0, 0, 0, 0.25)", "default selectedFillColor must be rgba(0, 0, 0, 0.25)");

//   assert.equal(q1.imageMap[1].value, "val2", "[1].value must be val2");
//   assert.equal(q1.imageMap[1].shape, "rect", "second item shape must be rect");
//   assert.equal(q1.imageMap[1].hoverStrokeColor, "#ffff00", "second item hoverStrokeColor must be #ffff00");
//   assert.equal(q1.imageMap[1].hoverStrokeSize, 2, "second item hoverStrokeSize must be 2");
//   assert.equal(q1.imageMap[1].hoverFillColor, "#FF00FF", "second item hoverFillColor must be #FF00FF");
//   assert.equal(q1.imageMap[1].selectedStrokeColor, "#00FFFF", "second item selectedStrokeColor must be #00FFFF");
//   assert.equal(q1.imageMap[1].selectedStrokeSize, 3, "second item selectedStrokeSize must be 3");
//   assert.equal(q1.imageMap[1].selectedFillColor, "#0000FF", "second item selectedFillColor must be #0000FF");
// });

// QUnit.only("Check toggle and multiSelect change", function (assert) {

//   const model = new SurveyModel({
//     elements: [
//       {
//         type: "imagemap",
//         name: "q1",
//         imageLink: "imageLink_url",
//         imageMap: [
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

//   q1.mapItemTooggle(q1.imageMap[0]);
//   assert.deepEqual(q1.value, ["val1"], "value must be ['val1'] after first tooggle");
//   assert.equal(q1.isItemSelected(q1.imageMap[0]), true, "must be selected after first click");
//   assert.equal(q1.isItemSelected(q1.imageMap[1]), false, "must not be selected after first click");

//   q1.mapItemTooggle(q1.imageMap[0]);
//   assert.deepEqual(q1.value, [], "value must be [] untoggling off item");

//   q1.mapItemTooggle(q1.imageMap[0]);
//   q1.mapItemTooggle(q1.imageMap[1]);
//   assert.deepEqual(q1.value, ["val1", "val2"], "value must be ['val1', 'val2'] after selecting two items");

//   q1.mapItemTooggle(q1.imageMap[0]);
//   assert.deepEqual(q1.value, ["val2"], "value must be ['val2'] after toggling first item off");

//   q1.multiSelect = false;
//   assert.equal(q1.multiSelect, false, "multiSelect must be false now");
//   assert.equal(q1.value, undefined, "value must be undefined #1");

//   q1.mapItemTooggle(q1.imageMap[0]);
//   assert.equal(q1.value, "val1", "Single: value must be val1");
//   assert.equal(q1.isItemSelected(q1.imageMap[0]), true, "Single: imageMap[0] must be selected");
//   assert.equal(q1.isItemSelected(q1.imageMap[1]), false, "Single: imageMap[1] must not be selected");

//   q1.mapItemTooggle(q1.imageMap[1]);
//   assert.equal(q1.value, "val2", "Single: value must be val2");
//   assert.equal(q1.isItemSelected(q1.imageMap[0]), false, "Single: imageMap[0] must not be selected");
//   assert.equal(q1.isItemSelected(q1.imageMap[1]), true, "Single: imageMap[1] must be selected");

//   q1.multiSelect = true;
//   assert.equal(q1.multiSelect, true, "multiSelect must be true now");
//   assert.equal(q1.value, undefined, "value must be undefined #2");
// });

// QUnit.only("Check scaleCoords", function (assert) {

//   const model = new QuestionImageMapModel("");
//   const coords = "10,20,30,40,50,60".split(",").map(Number);

//   model.backgroundImage = { width: 200, naturalWidth: 100 } as HTMLImageElement;
//   assert.equal(model.scaleCoords(coords).join(","), coords.map(e => e * 2).join(","), "scale by .5 works");

//   model.backgroundImage = { width: 100, naturalWidth: 200 } as HTMLImageElement;
//   assert.equal(model.scaleCoords(coords).join(","), coords.map(e => e * .5).join(","), "scale by 2 works");
// });

// QUnit.only("Check init", function (assert) {

//   const model = new QuestionImageMapModel("");

//   const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="100%" height="100%" fill="#DDDDDD"/><path fill="#999999" d="m155.52 171.08-17.16 21-2 2.48q1.68-.84 3.62-1.3t4.18-.46q3.28 0 6.38 1.08t5.46 3.26 3.8 5.42 1.44 7.56q0 4.04-1.48 7.58t-4.16 6.18-6.46 4.16-8.34 1.52q-4.64 0-8.32-1.48t-6.28-4.14-3.98-6.4-1.38-8.3q0-4.08 1.66-8.38t5.14-8.94l13.8-18.52q.72-.96 2.1-1.64t3.18-.68zm-14.92 50.4q2.36 0 4.34-.8t3.4-2.24 2.22-3.38.8-4.22q0-2.48-.76-4.46t-2.16-3.36-3.36-2.1-4.32-.72-4.28.8-3.28 2.22-2.12 3.36-.76 4.18q0 2.4.66 4.38t1.96 3.38 3.22 2.18 4.44.78M208.28 200q0 7.56-1.62 13.14t-4.48 9.22-6.76 5.42-8.42 1.78-8.38-1.78-6.7-5.42-4.44-9.22-1.6-13.14q0-7.6 1.6-13.16t4.44-9.2 6.7-5.42 8.38-1.78 8.42 1.78 6.76 5.42 4.48 9.2 1.62 13.16m-10.2 0q0-6.28-.92-10.4t-2.46-6.56-3.54-3.42-4.16-.98q-2.12 0-4.1.98t-3.5 3.42-2.42 6.56-.9 10.4.9 10.4 2.42 6.56 3.5 3.42 4.1.98q2.16 0 4.16-.98t3.54-3.42 2.46-6.56.92-10.4m56.6 0q0 7.56-1.62 13.14t-4.48 9.22-6.76 5.42-8.42 1.78-8.38-1.78-6.7-5.42-4.44-9.22-1.6-13.14q0-7.6 1.6-13.16t4.44-9.2 6.7-5.42 8.38-1.78 8.42 1.78 6.76 5.42 4.48 9.2 1.62 13.16m-10.2 0q0-6.28-.92-10.4t-2.46-6.56-3.54-3.42-4.16-.98q-2.12 0-4.1.98t-3.5 3.42-2.42 6.56-.9 10.4.9 10.4 2.42 6.56 3.5 3.42 4.1.98q2.16 0 4.16-.98t3.54-3.42 2.46-6.56.92-10.4m73.72 15.68-5.24 5.16-13.56-13.56-13.68 13.64-5.24-5.16 13.68-13.72L281.12 189l5.2-5.2 13.04 13.04 12.96-12.96 5.28 5.2-13 13zm34.64-8.56h17.6V188.2q0-2.68.36-5.92zm26.2 0h7.28v5.72q0 .8-.52 1.38t-1.48.58h-5.28v14.12h-8.6V214.8h-24.4q-1 0-1.76-.62t-.96-1.54l-1.04-5 27.4-36.6h9.36zm53.72-7.12q0 7.56-1.62 13.14t-4.48 9.22-6.76 5.42-8.42 1.78-8.38-1.78-6.7-5.42-4.44-9.22-1.6-13.14q0-7.6 1.6-13.16t4.44-9.2 6.7-5.42 8.38-1.78 8.42 1.78 6.76 5.42 4.48 9.2 1.62 13.16m-10.2 0q0-6.28-.92-10.4t-2.46-6.56-3.54-3.42-4.16-.98q-2.12 0-4.1.98t-3.5 3.42-2.42 6.56-.9 10.4.9 10.4 2.42 6.56 3.5 3.42 4.1.98q2.16 0 4.16-.98t3.54-3.42 2.46-6.56.92-10.4m56.6 0q0 7.56-1.62 13.14t-4.48 9.22-6.76 5.42-8.42 1.78-8.38-1.78-6.7-5.42-4.44-9.22-1.6-13.14q0-7.6 1.6-13.16t4.44-9.2 6.7-5.42 8.38-1.78 8.42 1.78 6.76 5.42 4.48 9.2 1.62 13.16m-10.2 0q0-6.28-.92-10.4t-2.46-6.56-3.54-3.42-4.16-.98q-2.12 0-4.1.98t-3.5 3.42-2.42 6.56-.9 10.4.9 10.4 2.42 6.56 3.5 3.42 4.1.98q2.16 0 4.16-.98t3.54-3.42 2.46-6.56.92-10.4"/></svg>';
//   const dataurl = "data:image/svg+xml;base64," + btoa(svg);

//   let container = document.createElement("div");
//   container.innerHTML = `
//     <img id="imagemap-${model.id}-background" src="${dataurl}" />
//     <canvas id="imagemap-${model.id}-canvas-selected"></canvas>
//     <canvas id="imagemap-${model.id}-canvas-hover"></canvas>
//     <map></map>
//   `;

//   model.initImageMap(container);

//   assert.equal(1, 1, "background image initialized");

//   // const coords = "10,20,30,40,50,60".split(",").map(Number);

//   // model.backgroundImage = { width: 200, naturalWidth: 100 } as HTMLImageElement;
//   // assert.equal(model.scaleCoords(coords).join(","), coords.map(e => e * 2).join(","), "scale by .5 works");

//   // model.backgroundImage = { width: 100, naturalWidth: 200 } as HTMLImageElement;
//   // assert.equal(model.scaleCoords(coords).join(","), coords.map(e => e * .5).join(","), "scale by 2 works");
// });