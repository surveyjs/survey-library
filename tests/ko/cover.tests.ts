import { Cover } from "../../src/knockout/components/cover/cover";
import { SurveyModel } from "../../src/survey";

export default QUnit.module("cover");

QUnit.test("logoStyle",
  function (assert) {
    const cover = new Cover();

    assert.deepEqual({
      order: 1,
      "align-self": "flex-end",
      "align-items": undefined
    }, cover.logoStyle, "default logoStyle");

    cover.logoPositionX = "left";
    assert.deepEqual({
      order: 1,
      "align-self": "flex-start",
      "align-items": undefined
    }, cover.logoStyle, "logoStyle left");

    cover.logoPositionX = "center";
    assert.deepEqual({
      order: 1,
      "align-self": "center",
      "align-items": undefined
    }, cover.logoStyle, "logoStyle center");

    cover.logoPositionY = "middle";
    assert.deepEqual({
      order: 2,
      "align-self": "center",
      "align-items": "center"
    }, cover.logoStyle, "logoStyle middle");

    cover.logoPositionY = "bottom";
    assert.deepEqual({
      order: 3,
      "align-self": "center",
      "align-items": "flex-end"
    }, cover.logoStyle, "logoStyle bottom");
  }
);

QUnit.test("titleStyle",
  function (assert) {
    const cover = new Cover();

    assert.deepEqual({
      order: 3,
      "align-self": "flex-start"
    }, cover.titleStyle, "default titleStyle");

    cover.titlePositionX = "right";
    assert.deepEqual({
      order: 3,
      "align-self": "flex-end"
    }, cover.titleStyle, "titleStyle right");

    cover.titlePositionX = "center";
    assert.deepEqual({
      order: 3,
      "align-self": "center"
    }, cover.titleStyle, "titleStyle center");

    cover.titlePositionY = "top";
    assert.deepEqual({
      order: 1,
      "align-self": "center"
    }, cover.titleStyle, "titleStyle top");

    cover.titlePositionY = "middle";
    assert.deepEqual({
      order: 2,
      "align-self": "center"
    }, cover.titleStyle, "titleStyle middle");
  }
);

QUnit.test("descriptionPositionX",
  function (assert) {
    const cover = new Cover();

    assert.deepEqual({
      order: 3,
      "align-self": "flex-start"
    }, cover.descriptionStyle, "default descriptionStyle");

    cover.descriptionPositionX = "right";
    assert.deepEqual({
      order: 3,
      "align-self": "flex-end"
    }, cover.descriptionStyle, "descriptionStyle right");

    cover.descriptionPositionX = "center";
    assert.deepEqual({
      order: 3,
      "align-self": "center"
    }, cover.descriptionStyle, "descriptionStyle center");

    cover.descriptionPositionY = "top";
    assert.deepEqual({
      order: 1,
      "align-self": "center"
    }, cover.descriptionStyle, "descriptionStyle top");

    cover.descriptionPositionY = "middle";
    assert.deepEqual({
      order: 2,
      "align-self": "center"
    }, cover.descriptionStyle, "descriptionStyle middle");
  }
);

QUnit.test("contentClasses",
  function (assert) {
    const cover = new Cover();
    cover.survey = new SurveyModel();

    assert.equal(cover.survey.widthMode, "auto", "default widthMode");
    assert.equal(cover.areaWidth, "survey", "default areaWidth");
    assert.equal(cover.contentClasses, "sv-conver__content sv-conver__content--static", "default contentClasses");

    cover.survey.widthMode = "responsive";
    assert.equal(cover.contentClasses, "sv-conver__content sv-conver__content--responsive", "survey.widthMode is responsive");

    cover.survey.widthMode = "static";
    assert.equal(cover.contentClasses, "sv-conver__content sv-conver__content--static", "survey.widthMode is static");

    cover.areaWidth = "container";
    assert.equal(cover.contentClasses, "sv-conver__content sv-conver__content--responsive", "areaWidth is container");
  }
);

QUnit.test("backgroundImageStyle",
  function (assert) {
    const cover = new Cover();
    cover.backgroundImage = "some_url";

    assert.deepEqual(cover.backgroundImageStyle, {
      opacity: 1,
      backgroundImage: "url(some_url)",
      backgroundSize: "cover",
    }, "default backgroundImageStyle");

    cover.backgroundImageFit = "fill";
    assert.deepEqual(cover.backgroundImageStyle, {
      opacity: 1,
      backgroundImage: "url(some_url)",
      backgroundSize: "100% 100%",
    }, "backgroundImageFit is fill");

    cover.backgroundImageFit = "contain";
    assert.deepEqual(cover.backgroundImageStyle, {
      opacity: 1,
      backgroundImage: "url(some_url)",
      backgroundSize: "contain",
    }, "backgroundImageFit is contain");
  }
);