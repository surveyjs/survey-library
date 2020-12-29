import { PopupUtils } from "../../src/knockout/components/popup/popup-utils";

export default QUnit.module("Popup");

const targetRect = {
  left: 20,
  top: 20,
  width: 50,
  height: 50,
  right: 70,
  bottom: 70,
};

QUnit.test("Check calculatePosition method", (assert) => {
  assert.deepEqual(
    PopupUtils.calculatePosition(<any>targetRect, 10, 20, "top", "left", false),
    { left: 0, top: 10 }
  );

  assert.deepEqual(
    PopupUtils.calculatePosition(
      <any>targetRect,
      10,
      20,
      "top",
      "center",
      false
    ),
    { left: 35, top: 10 }
  );

  assert.deepEqual(
    PopupUtils.calculatePosition(
      <any>targetRect,
      10,
      20,
      "top",
      "right",
      false
    ),
    { left: 70, top: 10 }
  );
  assert.deepEqual(
    PopupUtils.calculatePosition(
      <any>targetRect,
      10,
      20,
      "middle",
      "left",
      false
    ),
    { left: 0, top: 40 }
  );
  assert.deepEqual(
    PopupUtils.calculatePosition(
      <any>targetRect,
      10,
      20,
      "middle",
      "center",
      false
    ),
    { left: 35, top: 40 }
  );
  assert.deepEqual(
    PopupUtils.calculatePosition(
      <any>targetRect,
      10,
      20,
      "middle",
      "right",
      false
    ),
    { left: 70, top: 40 }
  );

  assert.deepEqual(
    PopupUtils.calculatePosition(
      <any>targetRect,
      10,
      20,
      "bottom",
      "left",
      false
    ),
    { left: 0, top: 70 }
  );
  assert.deepEqual(
    PopupUtils.calculatePosition(
      <any>targetRect,
      10,
      20,
      "bottom",
      "center",
      false
    ),
    { left: 35, top: 70 }
  );
  assert.deepEqual(
    PopupUtils.calculatePosition(
      <any>targetRect,
      10,
      20,
      "bottom",
      "right",
      false
    ),
    { left: 70, top: 70 }
  );

  //cases with pointer
  assert.deepEqual(
    PopupUtils.calculatePosition(<any>targetRect, 10, 20, "top", "left", true),
    { left: 0, top: 60 }
  );

  assert.deepEqual(
    PopupUtils.calculatePosition(<any>targetRect, 10, 20, "top", "right", true),
    { left: 70, top: 60 }
  );

  assert.deepEqual(
    PopupUtils.calculatePosition(
      <any>targetRect,
      10,
      20,
      "bottom",
      "left",
      true
    ),
    { left: 0, top: 20 }
  );

  assert.deepEqual(
    PopupUtils.calculatePosition(
      <any>targetRect,
      10,
      20,
      "bottom",
      "right",
      true
    ),
    { left: 70, top: 20 }
  );
});

QUnit.test("Check calculatateDirection method", (assert) => {
  assert.deepEqual(PopupUtils.calculatePopupDirection("top", "left"), "left");

  assert.deepEqual(PopupUtils.calculatePopupDirection("top", "center"), "top");

  assert.deepEqual(PopupUtils.calculatePopupDirection("top", "right"), "right");
  assert.deepEqual(
    PopupUtils.calculatePopupDirection("middle", "left"),
    "left"
  );
  assert.deepEqual(
    PopupUtils.calculatePopupDirection("middle", "center"),
    undefined
  );
  assert.deepEqual(
    PopupUtils.calculatePopupDirection("middle", "right"),
    "right"
  );
  assert.deepEqual(
    PopupUtils.calculatePopupDirection("bottom", "left"),
    "left"
  );
  assert.deepEqual(
    PopupUtils.calculatePopupDirection("bottom", "center"),
    "bottom"
  );
  assert.deepEqual(
    PopupUtils.calculatePopupDirection("bottom", "right"),
    "right"
  );
});

QUnit.test("Check calculatePointer target method", (assert) => {
  assert.deepEqual(
    PopupUtils.calculatePointerTarget(<any>targetRect, 10, 10, "top", "left"),
    { left: 10, top: 35 }
  );

  assert.deepEqual(
    PopupUtils.calculatePointerTarget(<any>targetRect, 10, 10, "top", "center"),
    { left: 35, top: 10 }
  );

  assert.deepEqual(
    PopupUtils.calculatePointerTarget(<any>targetRect, 10, 10, "top", "right"),
    { left: 60, top: 35 }
  );
  assert.deepEqual(
    PopupUtils.calculatePointerTarget(
      <any>targetRect,
      10,
      10,
      "middle",
      "left"
    ),
    { left: 10, top: 35 }
  );
  assert.deepEqual(
    PopupUtils.calculatePointerTarget(
      <any>targetRect,
      10,
      20,
      "middle",
      "center"
    ),
    { left: NaN, top: NaN }
  );
  assert.deepEqual(
    PopupUtils.calculatePointerTarget(
      <any>targetRect,
      10,
      10,
      "middle",
      "right"
    ),
    { left: 60, top: 35 }
  );

  assert.deepEqual(
    PopupUtils.calculatePointerTarget(
      <any>targetRect,
      10,
      10,
      "bottom",
      "left"
    ),
    { left: 10, top: 35 }
  );
  assert.deepEqual(
    PopupUtils.calculatePointerTarget(
      <any>targetRect,
      10,
      10,
      "bottom",
      "center"
    ),
    { left: 35, top: 60 }
  );
  assert.deepEqual(
    PopupUtils.calculatePointerTarget(
      <any>targetRect,
      10,
      10,
      "bottom",
      "right"
    ),
    { left: 60, top: 35 }
  );
});
