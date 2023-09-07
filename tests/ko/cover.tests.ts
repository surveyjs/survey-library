import { Cover } from "../../src/knockout/components/cover/cover";

export default QUnit.module("cover");

QUnit.only("logoStyle",
  function (assert) {
    const cover = new Cover();

    assert.deepEqual({
      order: 1,
      "align-self": "flex-end"
    }, cover.logoStyle, "default logoStyle");

    cover.logoPositionX = "left";
    assert.deepEqual({
      order: 1,
      "align-self": "flex-start"
    }, cover.logoStyle, "logoStyle left");

    cover.logoPositionX = "center";
    assert.deepEqual({
      order: 1,
      "align-self": "center"
    }, cover.logoStyle, "logoStyle center");
  }
);

QUnit.only("titleStyle",
  function (assert) {
    const cover = new Cover();

    assert.deepEqual({
      order: 2,
      "align-self": "flex-start"
    }, cover.titleStyle, "default titleStyle");

    cover.titlePositionX = "right";
    assert.deepEqual({
      order: 2,
      "align-self": "flex-end"
    }, cover.titleStyle, "titleStyle right");

    cover.titlePositionX = "center";
    assert.deepEqual({
      order: 2,
      "align-self": "center"
    }, cover.titleStyle, "titleStyle center");
  }
);

QUnit.only("descriptionPositionX",
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
  }
);