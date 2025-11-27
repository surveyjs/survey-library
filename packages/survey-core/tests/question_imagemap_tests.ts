import { QuestionImageMapModel } from "../src/question_imagemap";
import { SurveyModel } from "../src/survey";

export default QUnit.module("image map");

QUnit.test("Single: Register and load from json", function (assert) {

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

  assert.equal(q1.getType(), "imagemap", "type is imagemap");
  assert.equal(q1.imageLink, "imageLink_url", "imageLink is imageLink_url");
  assert.equal(q1.imageMap.length, 3, "imageMap.length is 2");
  assert.equal(q1.imageMap[0].getType(), "imagemapitem", "areas[0] type is imagemaparea");
  assert.equal(q1.imageMap[0].value, "val1", "[0].value must be val1");
  assert.equal(q1.imageMap[0].shape, "poly", "default shape must be poly");
  assert.equal(q1.imageMap[0].coords, "x1,y1,x2,y2,x3,y3,x4,y4", "coords must be set");

  assert.equal(q1.imageMap[1].value, "val2", "[1].value must be val2");
  assert.equal(q1.imageMap[1].shape, "rect", "second item shape must be rect");
});

QUnit.test("Single: Check toggle", function (assert) {

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

  assert.equal(q1.value, undefined, "value muyst be undefined initially");

  q1.mapItemTooggle(q1.imageMap[0]);
  assert.deepEqual(q1.value, ["val1"], "value must be ['val1'] after first click");
  assert.equal(q1.isItemSelected(q1.imageMap[0]), true, "must be selected after first click");
  assert.equal(q1.isItemSelected(q1.imageMap[1]), false, "must not be selected after first click");

  q1.mapItemTooggle(q1.imageMap[0]);
  assert.deepEqual(q1.value, [], "value must be [] after second click");
});