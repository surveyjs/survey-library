import { Cover } from "../src/cover";
import { SurveyModel } from "../src/survey";

export default QUnit.module("cover");

QUnit.test("logoStyle",
  function (assert) {
    const cover = new Cover();

    assert.deepEqual({
      gridColumn: 3,
      gridRow: 1,
      justifyContent: "flex-end",
      alignItems: "flex-start",
    }, cover.logoStyle, "default logoStyle");

    cover.logoPositionX = "left";
    assert.deepEqual({
      gridColumn: 1,
      gridRow: 1,
      justifyContent: "flex-start",
      alignItems: "flex-start",
    }, cover.logoStyle, "logoStyle left");

    cover.logoPositionX = "center";
    assert.deepEqual({
      gridColumn: 2,
      gridRow: 1,
      justifyContent: "center",
      alignItems: "flex-start",
    }, cover.logoStyle, "logoStyle center");

    cover.logoPositionY = "middle";
    assert.deepEqual({
      gridColumn: 2,
      gridRow: 2,
      justifyContent: "center",
      alignItems: "center",
    }, cover.logoStyle, "logoStyle middle");

    cover.logoPositionY = "bottom";
    assert.deepEqual({
      gridColumn: 2,
      gridRow: 3,
      justifyContent: "center",
      alignItems: "flex-end",
    }, cover.logoStyle, "logoStyle bottom");
  }
);

QUnit.test("titleStyle",
  function (assert) {
    const cover = new Cover();

    assert.deepEqual({
      maxWidth: "512px",
      gridColumn: 1,
      gridRow: 3,
      justifyContent: "flex-start",
      alignItems: "flex-end",
    }, cover.titleStyle, "default titleStyle");

    cover.titlePositionX = "right";
    assert.deepEqual({
      maxWidth: "512px",
      gridColumn: 3,
      gridRow: 3,
      justifyContent: "flex-end",
      alignItems: "flex-end",
    }, cover.titleStyle, "titleStyle right");

    cover.titlePositionX = "center";
    assert.deepEqual({
      maxWidth: "512px",
      gridColumn: 2,
      gridRow: 3,
      justifyContent: "center",
      alignItems: "flex-end",
    }, cover.titleStyle, "titleStyle center");

    cover.titlePositionY = "top";
    assert.deepEqual({
      maxWidth: "512px",
      gridColumn: 2,
      gridRow: 1,
      justifyContent: "center",
      alignItems: "flex-start",
    }, cover.titleStyle, "titleStyle top");

    cover.titlePositionY = "middle";
    assert.deepEqual({
      maxWidth: "512px",
      gridColumn: 2,
      gridRow: 2,
      justifyContent: "center",
      alignItems: "center",
    }, cover.titleStyle, "titleStyle middle");
  }
);

QUnit.test("descriptionPositionX",
  function (assert) {
    const cover = new Cover();

    assert.deepEqual({
      maxWidth: "512px",
      gridColumn: 1,
      gridRow: 4,
      justifyContent: "flex-start",
      alignItems: "flex-end",
    }, cover.descriptionStyle, "default descriptionStyle");

    cover.descriptionPositionX = "right";
    assert.deepEqual({
      maxWidth: "512px",
      gridColumn: 3,
      gridRow: 3,
      justifyContent: "flex-end",
      alignItems: "flex-end",
    }, cover.descriptionStyle, "descriptionStyle right");

    cover.descriptionPositionX = "center";
    assert.deepEqual({
      maxWidth: "512px",
      gridColumn: 2,
      gridRow: 3,
      justifyContent: "center",
      alignItems: "flex-end",
    }, cover.descriptionStyle, "descriptionStyle center");

    cover.descriptionPositionY = "top";
    assert.deepEqual({
      maxWidth: "512px",
      gridColumn: 2,
      gridRow: 1,
      justifyContent: "center",
      alignItems: "flex-start",
    }, cover.descriptionStyle, "descriptionStyle top");

    cover.descriptionPositionY = "middle";
    assert.deepEqual({
      maxWidth: "512px",
      gridColumn: 2,
      gridRow: 2,
      justifyContent: "center",
      alignItems: "center",
    }, cover.descriptionStyle, "descriptionStyle middle");
  }
);

QUnit.test("update grid row: all elements center+middle", function (assert) {
  const cover = new Cover();

  cover.logoPositionX = "center";
  cover.logoPositionY = "middle";
  cover.titlePositionX = "center";
  cover.titlePositionY = "middle";
  cover.descriptionPositionX = "center";
  cover.descriptionPositionY = "middle";

  assert.equal(cover.logoStyle.gridRow, 2, "logoStyle.gridRow");
  assert.equal(cover.logoStyle.gridColumn, 2, "logoStyle.gridColumn");
  assert.equal(cover.titleStyle.gridRow, 3, "titleStyle.gridRow");
  assert.equal(cover.titleStyle.gridColumn, 2, "titleStyle.gridColumn");
  assert.equal(cover.descriptionStyle.gridRow, 4, "descriptionStyle.gridRow");
  assert.equal(cover.descriptionStyle.gridColumn, 2, "descriptionStyle.gridColumn");
});

QUnit.test("update grid row: 2 elements into one cell", function (assert) {
  const cover = new Cover();

  cover.logoPositionX = "right";
  cover.logoPositionY = "top";
  cover.titlePositionX = "right";
  cover.titlePositionY = "top";
  cover.descriptionPositionX = "center";
  cover.descriptionPositionY = "middle";

  assert.equal(cover.logoStyle.gridRow, 1, "logoStyle.gridRow");
  assert.equal(cover.logoStyle.gridColumn, 3, "logoStyle.gridColumn");
  assert.equal(cover.titleStyle.gridRow, 2, "titleStyle.gridRow");
  assert.equal(cover.titleStyle.gridColumn, 3, "titleStyle.gridColumn");
  assert.equal(cover.descriptionStyle.gridRow, 3, "descriptionStyle.gridRow");
  assert.equal(cover.descriptionStyle.gridColumn, 2, "descriptionStyle.gridColumn");
});

QUnit.test("update grid row: 2 elements into one row and different columns", function (assert) {
  const cover = new Cover();

  cover.logoPositionX = "right";
  cover.logoPositionY = "top";
  cover.titlePositionX = "left";
  cover.titlePositionY = "top";
  cover.descriptionPositionX = "center";
  cover.descriptionPositionY = "middle";

  assert.equal(cover.logoStyle.gridRow, 1, "logoStyle.gridRow");
  assert.equal(cover.logoStyle.gridColumn, 3, "logoStyle.gridColumn");
  assert.equal(cover.titleStyle.gridRow, 1, "titleStyle.gridRow");
  assert.equal(cover.titleStyle.gridColumn, 1, "titleStyle.gridColumn");
  assert.equal(cover.descriptionStyle.gridRow, 2, "descriptionStyle.gridRow");
  assert.equal(cover.descriptionStyle.gridColumn, 2, "descriptionStyle.gridColumn");
});

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