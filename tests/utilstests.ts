import { IAction } from "../src/actions/action";
import { defaultListCss } from "../src/list";
import { createSvg, doKey2ClickDown, doKey2ClickUp, sanitizeEditableContent, configConfirmDialog } from "../src/utils/utils";
import { mouseInfo } from "../src/utils/devices";
import { PopupBaseViewModel } from "../src/popup-view-model";
import { PopupModel } from "../src/popup";
import { AnimationBoolean, AnimationGroup, AnimationGroupUtils, AnimationPropertyUtils, AnimationUtils } from "../src/utils/animation";

export default QUnit.module("utils");
function checkSanitizer(element, text, selectionNodeIndex, selectionStart, cleanLineBreaks = true) {
  element.innerHTML = text;
  const selection = document.getSelection();
  let range = document.createRange();
  if (selectionNodeIndex >= 0) {
    range.setStart(element.childNodes[selectionNodeIndex], selectionStart);
  }
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
  sanitizeEditableContent(element, cleanLineBreaks);
  range = document.getSelection().getRangeAt(0);
  if (element.childNodes.length > 0) range.setStart(element.childNodes[0], 0);
  return {
    text: element.innerHTML,
    plainText: element.innerText,
    position: selection?.toString().length,
    offset: range.endOffset,
    nodeText: range.endContainer.textContent
  };
}
QUnit.test(
  "utils: sanitizer",
  function (assert) {
    var element: HTMLSpanElement = document.createElement("span");
    document.body.appendChild(element);
    element.contentEditable = "true";
    element.focus();

    var res = checkSanitizer(element, "sometext", 0, 2);
    assert.equal(res.text, "sometext");
    assert.equal(res.offset, 2);

    var res = checkSanitizer(element, "some<br/>text", 0, 2);
    assert.equal(res.text, "sometext");
    assert.equal(res.offset, 2);

    var res = checkSanitizer(element, "sometex<b>t</b>", 1, 1);
    assert.equal(res.text, "sometext");
    assert.equal(res.offset, 8);

    var res = checkSanitizer(element, "some<b>t</b>ext", 2, 1);
    assert.equal(res.text, "sometext");
    assert.equal(res.offset, 6);

    var res = checkSanitizer(element, "", -1, 0);
    assert.equal(res.text, "");
    assert.equal(res.offset, 0);

    element.remove();
  }
);

QUnit.test(
  "utils: sanitizer with linebreaks",
  function (assert) {
    var element: HTMLSpanElement = document.createElement("span");
    document.body.appendChild(element);
    element.contentEditable = "true";

    var res = checkSanitizer(element, "some<br/>text", 0, 2, false);
    assert.equal(res.plainText, "some\ntext");
    assert.equal(res.offset, 2);
    assert.equal(res.nodeText, "some");

    var res = checkSanitizer(element, "some<br/>text<br/><br/>", 3, 0, false);
    assert.equal(res.plainText, "some\ntext\n\n");
    assert.equal(res.position, 10);

    var res = checkSanitizer(element, "some<br/>text<br/>and more", 2, 3, false);
    assert.equal(res.plainText, "some\ntext\nand more");
    assert.equal(res.offset, 3);
    assert.equal(res.nodeText, "text");

    element.remove();
  }
);

QUnit.test(
  "utils: sanitizer with grapheme clusters",
  function (assert) {
    var element: HTMLSpanElement = document.createElement("span");
    document.body.appendChild(element);
    element.contentEditable = "true";

    var res = checkSanitizer(element, "พุธ", 0, 2, false);
    assert.equal(res.plainText.length, 3);
    assert.equal(res.plainText, "พุธ");
    assert.equal(res.offset, 2);
    assert.equal(res.nodeText, "พุธ");

    var res = checkSanitizer(element, "sพุธe", 0, 3, false);
    assert.equal(res.plainText.length, 5);
    assert.equal(res.plainText, "sพุธe");
    assert.equal(res.offset, 3);
    assert.equal(res.nodeText, "sพุธe");

    var res = checkSanitizer(element, "พุธs<br/>พุธe", 2, 2, false);
    assert.equal(res.plainText, "พุธs\nพุธe");
    assert.equal(res.offset, 2);
    assert.equal(res.nodeText, "พุธe");

    element.remove();
  }
);

export function createIActionArray(count: number): Array<IAction> {
  let result: Array<IAction> = [];
  for (let index = 0; index < count; ++index) {
    result.push(<IAction>{ id: "test" + index, title: "test" + index });
  }
  return result;
}

export function createListContainerHtmlElement(): HTMLElement {
  const element = document.createElement("div");
  const innerElement = document.createElement("div");
  innerElement.className = defaultListCss.itemsContainer;
  innerElement.style.width = "200px";
  innerElement.style.height = "100px";

  const listContainerElement = document.createElement("div");
  listContainerElement.style.width = "200px";
  listContainerElement.style.height = "1000px";
  listContainerElement.scrollTop = 0;
  listContainerElement.scrollLeft = 0;

  document.body.appendChild(element);
  element.appendChild(innerElement);
  innerElement.appendChild(listContainerElement);
  return element;
}

QUnit.test(
  "utils: createSvg",
  function (assert) {
    var element: HTMLSpanElement = document.createElement("svg");
    element.innerHTML = "<use></use>";
    document.body.appendChild(element);
    createSvg(16, 0, 0, "test", element, "titletext");
    assert.equal(element.querySelector("use")?.getAttribute("xlink:href"), "#test");
    assert.equal(element.querySelectorAll("title").length, 1);
    assert.equal(element.querySelector("title")?.innerHTML, "titletext");

    createSvg(16, 0, 0, "test", element, "titletext2");
    assert.equal(element.querySelector("use")?.getAttribute("xlink:href"), "#test");
    assert.equal(element.querySelectorAll("title").length, 1);
    assert.equal(element.querySelector("title")?.innerHTML, "titletext2");

    element.remove();
  }
);

QUnit.test(
  "utils: keytoclick - skip UP if there was no DOWN",
  function (assert) {
    var clicked = false;
    var event = {
      keyCode: 13,
      target: { click: () => { clicked = true; } },
      preventDefault: () => { }
    };

    doKey2ClickUp(event as any);
    assert.ok(clicked);
    clicked = false;
    doKey2ClickDown(event as any);
    doKey2ClickUp(event as any);
    assert.ok(clicked);
    clicked = false;

    doKey2ClickUp(event as any, undefined);
    assert.ok(clicked);
    clicked = false;
    doKey2ClickDown(event as any, undefined);
    doKey2ClickUp(event as any, undefined);
    assert.ok(clicked);
    clicked = false;

    var options = {};
    doKey2ClickUp(event as any, options);
    assert.notOk(clicked);
    doKey2ClickDown(event as any, options);
    doKey2ClickUp(event as any, options);
    assert.ok(clicked);
  }
);

QUnit.test(
  "utils: keytoclick - support tab keyup",
  function (assert) {
    var classAdded = "";
    var event = {
      keyCode: 9,
      target: {
        classList: {
          contains: () => false,
          add: (cl) => classAdded = cl
        }
      },
      preventDefault: () => { }
    };

    var options = {};
    doKey2ClickUp(event as any, options);
    assert.equal(classAdded, "sv-focused--by-key");
  }
);

QUnit.test(
  "utils: devices: isTouch",
  function (assert) {
    mouseInfo.hasMouse = true;
    assert.equal(mouseInfo.isTouch, false, "isTouch, #1");
    mouseInfo.hasMouse = false;
    const hasTouchEvent = mouseInfo.hasTouchEvent;
    assert.equal(mouseInfo.isTouch, hasTouchEvent, "isTouch, #2. hasTouch in window: " + hasTouchEvent);
    if (!hasTouchEvent) {
      window["ontouchstart"] = () => { };
    }
    mouseInfo.hasMouse = true;
    assert.equal(mouseInfo.isTouch, false, "isTouch, #3");
    mouseInfo.hasMouse = false;
    assert.equal(mouseInfo.isTouch, true, "isTouch, #4");
    mouseInfo.hasMouse = true;
    if (!hasTouchEvent) {
      window["ontouchstart"] = undefined;
    }
  }
);

QUnit.test(
  "utils: configConfirmDialog",
  function (assert) {
    const popupViewModel = new PopupBaseViewModel(new PopupModel("", undefined));
    configConfirmDialog(popupViewModel);
    assert.equal(popupViewModel.width, "min-content");
  }
);

QUnit.test("Test animation utils: getAnimationsCount", (assert) => {
  const animationUtils = new AnimationPropertyUtils();
  const element = document.createElement("div");
  document.body.appendChild(element);
  assert.equal(animationUtils["getAnimationsCount"](element), 0);
  element.style.animationName = "animation1, animation2";
  assert.equal(animationUtils["getAnimationsCount"](element), 2);
  element.style.animationName = "animation1";
  assert.equal(animationUtils["getAnimationsCount"](element), 1);
});

QUnit.test("Test animation utils: getAnimationDuration", (assert) => {
  const animationUtils = new AnimationPropertyUtils();
  const element = document.createElement("div");
  document.body.appendChild(element);
  assert.equal(animationUtils["getAnimationDuration"](element), 0);
  element.style.animationDuration = "5s, 3ms";
  assert.equal(animationUtils["getAnimationDuration"](element), 5000);
  element.style.animationDuration = "3s";
  assert.equal(animationUtils["getAnimationDuration"](element), 3000);

  element.style.animationDuration = "5s, 3ms, 2s";
  element.style.animationDelay = "4ms, 3s";
  assert.equal(animationUtils["getAnimationDuration"](element), 5004);
  element.style.animationDuration = "5s, 3ms, 6s";
  element.style.animationDelay = "3ms, 1s";
  assert.equal(animationUtils["getAnimationDuration"](element), 6003);
  element.remove();
});

QUnit.test("Test animation utils: getAnimationDuration", (assert) => {
  const animationUtils = new AnimationPropertyUtils();
  const element = document.createElement("div");
  document.body.appendChild(element);
  assert.equal(animationUtils["getAnimationDuration"](element), 0);
  element.style.animationDuration = "5s, 3ms";
  assert.equal(animationUtils["getAnimationDuration"](element), 5000);
  element.style.animationDuration = "3s";
  assert.equal(animationUtils["getAnimationDuration"](element), 3000);

  element.style.animationDuration = "5s, 3ms, 2s";
  element.style.animationDelay = "4ms, 3s";
  assert.equal(animationUtils["getAnimationDuration"](element), 5004);
  element.style.animationDuration = "5s, 3ms, 6s";
  element.style.animationDelay = "3ms, 1s";
  assert.equal(animationUtils["getAnimationDuration"](element), 6003);
  element.remove();
});

QUnit.test("Test animation utils: onAnimationEnd", (assert) => {
  const done = assert.async();
  const animationUtils = new AnimationUtils();
  const element = document.createElement("div");
  document.body.appendChild(element);
  let log = "";
  animationUtils["onAnimationEnd"](element, () => {
    log += "->updated";
  }, { } as any);
  assert.equal(log, "->updated");
  assert.ok(animationUtils["cancelQueue"].length == 0);
  element.style.animationName = "animation1, animation2";
  element.style.animationDuration = "1s";
  log = "";
  animationUtils["onAnimationEnd"](element, () => {
    log += "->updated";
  }, { } as any);
  assert.equal(log, "");
  element.dispatchEvent(new AnimationEvent("animationend"));
  assert.equal(log, "");
  element.dispatchEvent(new AnimationEvent("animationend"));
  assert.equal(log, "->updated");
  assert.ok(animationUtils["cancelQueue"].length == 0);

  element.style.animationName = "animation1";
  element.style.animationDuration = "1s";
  log = "";
  animationUtils["onAnimationEnd"](element, () => {
    log += "->updated";
  }, { } as any);
  assert.equal(log, "");
  element.dispatchEvent(new AnimationEvent("animationend"));
  assert.equal(log, "->updated");
  assert.ok(animationUtils["cancelQueue"].length == 0);

  element.style.animationName = "animation1";
  element.style.animationDuration = "1ms";
  log = "";
  animationUtils["onAnimationEnd"](element, () => {
    log += "->updated";
  }, { } as any);
  assert.equal(log, "");
  animationUtils.cancel();
  assert.ok(animationUtils["cancelQueue"].length == 0);

  element.style.animationName = "animation1";
  element.style.animationDuration = "1ms";
  log = "";
  animationUtils["onAnimationEnd"](element, () => {
    log += "->updated";
  }, { } as any);
  assert.equal(log, "");
  setTimeout(() => {
    assert.equal(log, "->updated");
    assert.ok(animationUtils["cancelQueue"].length == 0);
    element.remove();
    done();
  }, 11);
});
QUnit.test("Test animation utils: enter animation", (assert) => {
  const oldRequestAnimationFrame = window.requestAnimationFrame;
  window.requestAnimationFrame = ((cb) => cb()) as any;
  const animationUtils = new AnimationPropertyUtils();
  const element = document.createElement("div");
  element.style.animationName = "animation1";
  element.style.animationDuration = "1s";
  document.body.appendChild(element);
  let log = "";
  animationUtils.onEnter(() => element, {
    onAfterRunAnimation: (element) => {
      assert.equal(element, element);
      log+= "->afterRunAnimation";
    },
    onBeforeRunAnimation: (element) => {
      assert.equal(element, element);
      log+= "->beforeRunAnimation";
    },
    cssClass: "enter"
  });
  assert.equal(log, "->beforeRunAnimation");
  assert.ok(element.classList.contains("enter"));
  element.dispatchEvent(new AnimationEvent("animationend"));
  assert.equal(log, "->beforeRunAnimation->afterRunAnimation");
  assert.notOk(element.classList.contains("enter"));
  window.requestAnimationFrame = oldRequestAnimationFrame;
});

QUnit.test("Test animation utils: leave animation", (assert) => {
  const done = assert.async();
  const oldRequestAnimationFrame = window.requestAnimationFrame;
  window.requestAnimationFrame = (cb) => setTimeout(cb);
  const animationUtils = new AnimationPropertyUtils();
  const element = document.createElement("div");
  element.style.animationName = "animation1";
  element.style.animationDuration = "1s";
  document.body.appendChild(element);
  let log = "";
  animationUtils.onLeave(() => element, () => {
    log += "->updated";
  }, {
    onAfterRunAnimation: (element) => {
      assert.equal(element, element);
      log+= "->afterRunAnimation";
    },
    onBeforeRunAnimation: (element) => {
      assert.equal(element, element);
      log+= "->beforeRunAnimation";
    },
    cssClass: "leave"
  });
  assert.equal(log, "->beforeRunAnimation");
  assert.ok(element.classList.contains("leave"));
  element.dispatchEvent(new AnimationEvent("animationend"));
  assert.equal(log, "->beforeRunAnimation->afterRunAnimation->updated");
  assert.ok(element.classList.contains("leave"));
  setTimeout(() => {
    assert.notOk(element.classList.contains("leave"));
    window.requestAnimationFrame = oldRequestAnimationFrame;
    done();
  }, 10);
});

QUnit.test("Test animation utils: group enter animation", (assert) => {
  const oldRequestAnimationFrame = window.requestAnimationFrame;
  window.requestAnimationFrame = ((cb) => cb()) as any;
  const animationUtils = new AnimationGroupUtils<number>();
  const elements = [0, 1, 2];
  const htmlElements = elements.map(() => {
    const element = document.createElement("div");
    element.style.animationName = "animation1";
    element.style.animationDuration = "1s";
    document.body.appendChild(element);
    return element;
  });
  let log = "";
  animationUtils.onEnter((i: number) => htmlElements[i], (i) => {
    return {
      onAfterRunAnimation: (element) => {
        assert.equal(element, element);
        log+= "->afterRunAnimation_" + i;
      },
      onBeforeRunAnimation: (element) => {
        assert.equal(element, element);
        log+= "->beforeRunAnimation_" + i;
      },
      cssClass: "enter_" + i
    };
  }, [0, 1, 2]);
  assert.equal(log, "->beforeRunAnimation_0->beforeRunAnimation_1->beforeRunAnimation_2");
  assert.ok(htmlElements[0].classList.contains("enter_0"));
  assert.ok(htmlElements[1].classList.contains("enter_1"));
  assert.ok(htmlElements[2].classList.contains("enter_2"));

  log = "";
  htmlElements[0].dispatchEvent(new AnimationEvent("animationend"));
  htmlElements[1].dispatchEvent(new AnimationEvent("animationend"));
  htmlElements[2].dispatchEvent(new AnimationEvent("animationend"));

  assert.equal(log, "->afterRunAnimation_0->afterRunAnimation_1->afterRunAnimation_2");
  assert.notOk(htmlElements[0].classList.contains("enter_0"));
  assert.notOk(htmlElements[1].classList.contains("enter_1"));
  assert.notOk(htmlElements[2].classList.contains("enter_2"));

  htmlElements.forEach(el => el.remove());
  window.requestAnimationFrame = oldRequestAnimationFrame;
});

QUnit.test("Test animation utils: group leave animation", (assert) => {
  const done = assert.async();
  const oldRequestAnimationFrame = window.requestAnimationFrame;
  window.requestAnimationFrame = (cb) => setTimeout(cb);
  const animationUtils = new AnimationGroupUtils<number>();
  const elements = [0, 1, 2];
  const htmlElements = elements.map(() => {
    const element = document.createElement("div");
    element.style.animationName = "animation1";
    element.style.animationDuration = "1s";
    document.body.appendChild(element);
    return element;
  });
  let log = "";
  animationUtils.onLeave((i: number) => htmlElements[i], () => {
    log+="->updated";
  }, (i) => {
    return {
      onAfterRunAnimation: (element) => {
        assert.equal(element, element);
        log+= "->afterRunAnimation_" + i;
      },
      onBeforeRunAnimation: (element) => {
        assert.equal(element, element);
        log+= "->beforeRunAnimation_" + i;
      },
      cssClass: "leave_" + i
    };
  }, [0, 1, 2]);
  assert.equal(log, "->beforeRunAnimation_0->beforeRunAnimation_1->beforeRunAnimation_2");
  assert.ok(htmlElements[0].classList.contains("leave_0"));
  assert.ok(htmlElements[1].classList.contains("leave_1"));
  assert.ok(htmlElements[2].classList.contains("leave_2"));

  log = "";
  htmlElements[0].dispatchEvent(new AnimationEvent("animationend"));
  htmlElements[1].dispatchEvent(new AnimationEvent("animationend"));
  htmlElements[2].dispatchEvent(new AnimationEvent("animationend"));

  assert.equal(log, "->afterRunAnimation_0->afterRunAnimation_1->afterRunAnimation_2->updated");
  assert.ok(htmlElements[0].classList.contains("leave_0"));
  assert.ok(htmlElements[1].classList.contains("leave_1"));
  assert.ok(htmlElements[2].classList.contains("leave_2"));

  setTimeout(() => {
    assert.notOk(htmlElements[0].classList.contains("leave_0"));
    assert.notOk(htmlElements[1].classList.contains("leave_1"));
    assert.notOk(htmlElements[2].classList.contains("leave_2"));
    htmlElements.forEach(el => el.remove());
    window.requestAnimationFrame = oldRequestAnimationFrame;
    done();
  }, 10);
});

QUnit.test("Test animation property: boolean", (assert) => {
  const oldRequestAnimationFrame = window.requestAnimationFrame;
  window.requestAnimationFrame = ((cb) => cb()) as any;
  let value: boolean = false;
  const element = document.createElement("div");
  element.style.animationName = "animation1";
  element.style.animationDuration = "1s";
  document.body.appendChild(element);
  let log = "";
  const animation = new AnimationBoolean({
    getEnterOptions: () => {
      return {
        onBeforeRunAnimation: () => {
          log += "->before-enter";
        },
        onAfterRunAnimation: () => {
          log += "->after-enter";
        },
        cssClass: "enter",
      };
    },
    isAnimationEnabled: () => {
      return true;
    },
    getAnimatedElement: () => {
      return element;
    },
    getLeaveOptions: () => {
      return {
        onBeforeRunAnimation: () => {
          log += "->before-leave";
        },
        onAfterRunAnimation: () => {
          log += "->after-leave";
        },
        cssClass: "leave"
      };
    }
  }, (val: boolean) => {
    value = val;
    log += `->updated: ${val}`;
  }, () => value);
  animation["_sync"](true);
  element.dispatchEvent(new AnimationEvent("animationend"));
  assert.equal(log, "->updated: true->before-enter->after-enter");

  log = "";
  animation["_sync"](false);
  element.dispatchEvent(new AnimationEvent("animationend"));
  assert.equal(log, "->before-leave->after-leave->updated: false");

  window.requestAnimationFrame = oldRequestAnimationFrame;
});
QUnit.test("Test animation property: array", (assert) => {
  const oldRequestAnimationFrame = window.requestAnimationFrame;
  window.requestAnimationFrame = ((cb) => cb()) as any;
  let value: boolean = false;
  let elements = [0, 3];
  const htmlElements = [0, 1, 2, 3].map(() => {
    const element = document.createElement("div");
    element.style.animationName = "animation1";
    element.style.animationDuration = "1s";
    document.body.appendChild(element);
    return element;
  });
  let log = "";
  const animation = new AnimationGroup<number>({
    getEnterOptions: (i) => {
      return {
        onBeforeRunAnimation: () => {
          log += `->before-enter_${i}`;
        },
        onAfterRunAnimation: () => {
          log += `->after-enter_${i}`;
        },
        cssClass: "enter"
      };
    },
    isAnimationEnabled: () => {
      return true;
    },
    getAnimatedElement: (i) => {
      return htmlElements[i];
    },
    getLeaveOptions: (i) => {
      return {
        onBeforeRunAnimation: () => {
          log += `->before-leave_${i}`;
        },
        onAfterRunAnimation: () => {
          log += `->after-leave_${i}`;
        },
        cssClass: "leave"
      };
    }
  }, (val: Array<number>) => {
    elements = val;
    log += `->updated: ${val}`;
  }, () => elements);
  animation["_sync"]([0, 1, 2, 3]);
  htmlElements[1].dispatchEvent(new AnimationEvent("animationend"));
  htmlElements[2].dispatchEvent(new AnimationEvent("animationend"));
  assert.equal(log, "->before-enter_1->before-enter_2->updated: 0,1,2,3->after-enter_1->after-enter_2");

  log = "";
  animation["_sync"]([1, 2]);
  htmlElements[0].dispatchEvent(new AnimationEvent("animationend"));
  htmlElements[3].dispatchEvent(new AnimationEvent("animationend"));
  assert.equal(log, "->before-leave_0->before-leave_3->after-leave_0->after-leave_3->updated: 1,2");

  window.requestAnimationFrame = oldRequestAnimationFrame;
});
