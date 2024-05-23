import { IAction } from "../src/actions/action";
import { defaultListCss } from "../src/list";
import { createSvg, doKey2ClickDown, doKey2ClickUp, sanitizeEditableContent, configConfirmDialog, mergeValues, compareArrays } from "../src/utils/utils";
import { mouseInfo } from "../src/utils/devices";
import { PopupBaseViewModel } from "../src/popup-view-model";
import { PopupModel } from "../src/popup";
import { AnimationBoolean, AnimationGroup, AnimationGroupUtils, AnimationPropertyUtils, AnimationTab, AnimationUtils, IAnimationConsumer, IAnimationGroupConsumer } from "../src/utils/animation";
import { EventBase } from "../src/base";

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

QUnit.test("Test animation utils: check cancel animation works correctly when mutliple animations applied", (assert) => {
  const animationUtils = new AnimationUtils();
  const element = document.createElement("div");
  element.style.animationName = "animation1, animation2";
  element.style.animationDuration = "1s";
  document.body.appendChild(element);
  let log = "";

  animationUtils["onAnimationEnd"](element, () => {
    log += "->updated1";
  }, { } as any);

  animationUtils["onAnimationEnd"](element, () => {
    log += "->updated2";
  }, { } as any);

  animationUtils["onAnimationEnd"](element, () => {
    log += "->updated3";
  }, { } as any);

  assert.equal(log, "");
  animationUtils.cancel();
  assert.equal(log, "->updated1->updated2->updated3");
  assert.ok(animationUtils["cancelQueue"].length == 0);
});

QUnit.test("Test animation utils: enter animation", (assert) => {
  const oldRequestAnimationFrame = window.requestAnimationFrame;
  window.requestAnimationFrame = ((cb) => cb()) as any;
  const animationUtils = new AnimationPropertyUtils();
  const htmlElement = document.createElement("div");
  htmlElement.style.animationName = "animation1";
  htmlElement.style.animationDuration = "1s";
  document.body.appendChild(htmlElement);
  let log = "";
  const animationOptions: IAnimationConsumer = {
    getRerenderEvent: () => new EventBase(),
    getLeaveOptions() {
      return {} as any;
    },
    isAnimationEnabled() {
      return true;
    },
    getAnimatedElement() {
      return htmlElement;
    },
    getEnterOptions() {
      return {
        onAfterRunAnimation: (element) => {
          assert.equal(element, element);
          log+= "->afterRunAnimation";
        },
        onBeforeRunAnimation: (element) => {
          assert.equal(element, element);
          log+= "->beforeRunAnimation";
        },
        cssClass: "enter"
      };
    }
  };
  animationUtils.onEnter(animationOptions);
  assert.equal(log, "->beforeRunAnimation");
  assert.ok(htmlElement.classList.contains("enter"));
  htmlElement.dispatchEvent(new AnimationEvent("animationend"));
  assert.equal(log, "->beforeRunAnimation->afterRunAnimation");
  assert.notOk(htmlElement.classList.contains("enter"));
  window.requestAnimationFrame = oldRequestAnimationFrame;
});

QUnit.test("Test animation utils: leave animation", (assert) => {
  const done = assert.async();
  const oldRequestAnimationFrame = window.requestAnimationFrame;
  window.requestAnimationFrame = (cb) => setTimeout(cb);
  const animationUtils = new AnimationPropertyUtils();
  const htmlElement = document.createElement("div");
  htmlElement.style.animationName = "animation1";
  htmlElement.style.animationDuration = "1s";
  document.body.appendChild(htmlElement);
  let log = "";
  const animationOptions: IAnimationConsumer = {
    getRerenderEvent: () => new EventBase(),
    getLeaveOptions() {
      return {
        onAfterRunAnimation: (element) => {
          assert.equal(element, element);
          log+= "->afterRunAnimation";
        },
        onBeforeRunAnimation: (element) => {
          assert.equal(element, element);
          log+= "->beforeRunAnimation";
        },
        cssClass: "leave"
      };
    },
    isAnimationEnabled() {
      return true;
    },
    getAnimatedElement() {
      return htmlElement;
    },
    getEnterOptions() {
      return {} as any;
    }
  };
  animationUtils.onLeave(animationOptions, () => {
    log += "->updated";
  },);
  assert.equal(log, "->beforeRunAnimation");
  assert.ok(htmlElement.classList.contains("leave"));
  htmlElement.dispatchEvent(new AnimationEvent("animationend"));
  assert.equal(log, "->beforeRunAnimation->afterRunAnimation->updated");
  assert.ok(htmlElement.classList.contains("leave"));
  setTimeout(() => {
    setTimeout(() => {
      assert.notOk(htmlElement.classList.contains("leave"));
      window.requestAnimationFrame = oldRequestAnimationFrame;
      htmlElement.remove();
      done();
    });
  });
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
  const animationOptions: IAnimationGroupConsumer<number> = {
    getRerenderEvent: () => new EventBase(),
    getEnterOptions(i) {
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
    },
    getLeaveOptions() {
      return {} as any;
    },
    isAnimationEnabled() {
      return true;
    },
    getAnimatedElement(i) {
      return htmlElements[i];
    }
  };
  animationUtils.runGroupAnimation(animationOptions, [0, 1, 2], [], []);
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
  const animationOptions: IAnimationGroupConsumer<number> = {
    getRerenderEvent: () => new EventBase(),
    getLeaveOptions(i) {
      {
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
      }
    },
    isAnimationEnabled() {
      return true;
    },
    getAnimatedElement(i) {
      return htmlElements[i];
    }
  };
  animationUtils.runGroupAnimation(animationOptions, [], [0, 1, 2], [], () => {
    log+="->updated";
  });
  setTimeout(() => {
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
      setTimeout(() => {
        assert.notOk(htmlElements[0].classList.contains("leave_0"));
        assert.notOk(htmlElements[1].classList.contains("leave_1"));
        assert.notOk(htmlElements[2].classList.contains("leave_2"));
        htmlElements.forEach(el => el.remove());
        window.requestAnimationFrame = oldRequestAnimationFrame;
        done();
      });
    });
  });
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
  const rerenderEvent = new EventBase();
  const animation = new AnimationBoolean({
    getRerenderEvent: () => rerenderEvent as any,
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
  animation["animationOptions"].getRerenderEvent().fire(undefined as any, undefined);
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
  let elements = [0, 3];
  const htmlElements = [0, 1, 2, 3].map(() => {
    const element = document.createElement("div");
    element.style.animationName = "animation1";
    element.style.animationDuration = "1s";
    document.body.appendChild(element);
    return element;
  });
  let log = "";
  const rerenderEvent = new EventBase();
  const animation = new AnimationGroup<number>({
    getRerenderEvent: () => rerenderEvent as any,
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
  animation["animationOptions"].getRerenderEvent().fire(undefined as any, undefined);
  htmlElements[1].dispatchEvent(new AnimationEvent("animationend"));
  htmlElements[2].dispatchEvent(new AnimationEvent("animationend"));
  assert.equal(log, "->updated: 0,1,2,3->before-enter_1->before-enter_2->after-enter_1->after-enter_2");

  log = "";
  animation["_sync"]([1, 2]);
  htmlElements[0].dispatchEvent(new AnimationEvent("animationend"));
  htmlElements[3].dispatchEvent(new AnimationEvent("animationend"));
  assert.equal(log, "->before-leave_0->before-leave_3->after-leave_0->after-leave_3->updated: 1,2");

  window.requestAnimationFrame = oldRequestAnimationFrame;
});

QUnit.test("Test animation tab", (assert) => {
  const oldRequestAnimationFrame = window.requestAnimationFrame;
  window.requestAnimationFrame = ((cb) => cb()) as any;
  let elements = [0];
  const htmlElements = [0, 1].map(() => {
    const element = document.createElement("div");
    element.style.animationName = "animation1";
    element.style.animationDuration = "1s";
    document.body.appendChild(element);
    return element;
  });
  let log = "";
  const rerenderEvent = new EventBase();
  const animation = new AnimationTab<number>({
    getRerenderEvent: () => rerenderEvent as any,
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
  }, () => elements, (newValue: number[], oldValue: number[]) => {
    return ([] as number[]).concat(newValue, oldValue);
  },);
  animation["_sync"]([1]);
  assert.deepEqual(elements, [1, 0]);
  assert.equal(log, "->updated: 1,0");
  log = "";
  animation["animationOptions"].getRerenderEvent().fire(undefined as any, undefined);
  htmlElements[0].dispatchEvent(new AnimationEvent("animationend"));
  htmlElements[1].dispatchEvent(new AnimationEvent("animationend"));
  assert.equal(log, "->before-enter_1->before-leave_0->after-leave_0->after-enter_1->updated: 1");
  assert.deepEqual(elements, [1]);
  log = "";
  animation["_sync"]([0]);
  assert.deepEqual(elements, [0, 1]);
  assert.equal(log, "->updated: 0,1");
  log = "";
  animation["animationOptions"].getRerenderEvent().fire(undefined as any, undefined);
  htmlElements[0].dispatchEvent(new AnimationEvent("animationend"));
  htmlElements[1].dispatchEvent(new AnimationEvent("animationend"));
  assert.equal(log, "->before-enter_0->before-leave_1->after-enter_0->after-leave_1->updated: 0");
  assert.deepEqual(elements, [0]);

  window.requestAnimationFrame = oldRequestAnimationFrame;
});

QUnit.test("Check onNextRender and cancel", (assert) => {
  const oldRequestAnimationFrame = window.requestAnimationFrame;
  const oldCancelAnimationFrame = window.cancelAnimationFrame;
  let id = 0;
  let log = "";
  let latestCb;
  window.requestAnimationFrame = (cb: any) => {
    let rafId = ++id;
    latestCb = () => { log+= `->running: ${id}`; cb(); };
    log+= `->raf: ${rafId}`;
    return rafId;
  };
  window.cancelAnimationFrame = (id) => { log+= `->canceled: ${id}`; };
  const animation = new AnimationUtils();
  animation["onNextRender"](() => {
    log+="->updated";
  });
  animation.cancel();
  assert.equal(log, "->raf: 1->updated->canceled: 1");
  id = 0;
  log = "";
  animation["onNextRender"](() => {
    log+="->updated";
  });
  latestCb();
  animation.cancel();
  assert.equal(log, "->raf: 1->running: 1->raf: 2->updated->canceled: 2");
  id = 0;
  log = "";
  animation["onNextRender"](() => {
    log+="->updated";
  });
  latestCb();
  latestCb();
  assert.equal(log, "->raf: 1->running: 1->raf: 2->running: 2->updated");
  log = "";
  animation.cancel();
  assert.equal(log, "");

  window.requestAnimationFrame = oldRequestAnimationFrame;
  window.cancelAnimationFrame = oldCancelAnimationFrame;
});

QUnit.test("Test animation property: check latest update persists", (assert) => {
  const done = assert.async();
  let value: boolean = false;
  let animationEnabled = false;
  const animation = new AnimationBoolean({
    getRerenderEvent: () => new EventBase(),
    getEnterOptions: () => {
      return {
        cssClass: "enter",
      };
    },
    isAnimationEnabled: () => {
      return animationEnabled;
    },
    getAnimatedElement: () => {
      return undefined as any;
    },
    getLeaveOptions: () => {
      return {
        cssClass: "leave"
      };
    }
  }, (val: boolean) => {
    value = val;
  }, () => value);
  animationEnabled = true;
  animation.sync(true);
  animationEnabled = false;
  animation.sync(false);
  setTimeout(() => {
    assert.notOk(value);
    animationEnabled = false;
    animation.sync(true);
    assert.ok(value);
    animation.sync(false);
    setTimeout(() => {
      assert.notOk(value);
      done();
    });
  });
});

QUnit.test("test compareArrays function", (assert) => {
  let res: any = compareArrays([0, 1, 2, 3, 4], [5, 3, 6, 1, 7], (i) => i);
  assert.deepEqual(res.deletedItems, [0, 2, 4]);
  assert.deepEqual(res.addedItems, [5, 6, 7]);
  assert.deepEqual(res.reorderedItems, [{ item: 3, movedForward: false }, { item: 1, movedForward: true }]);
  assert.deepEqual(res.mergedItems, [5, 0, 3, 6, 2, 1, 7, 4]);

  res = compareArrays([0, 1, 2, 3, 4], [3, 1], (i) => i);
  assert.deepEqual(res.deletedItems, [0, 2, 4]);
  assert.deepEqual(res.addedItems, []);
  assert.deepEqual(res.reorderedItems, [{ item: 3, movedForward: false }, { item: 1, movedForward: true }]);
  assert.deepEqual(res.mergedItems, [0, 3, 2, 1, 4]);

  res = compareArrays([1, 3], [5, 3, 6, 1, 7], (i) => i);
  assert.deepEqual(res.deletedItems, []);
  assert.deepEqual(res.addedItems, [5, 6, 7]);
  assert.deepEqual(res.reorderedItems, [{ item: 3, movedForward: false }, { item: 1, movedForward: true }]);
  assert.deepEqual(res.mergedItems, [5, 3, 6, 1, 7]);

  res = compareArrays([0, 1, 2, 3, 4], [5, 1, 6, 3, 7], (i) => i);
  assert.deepEqual(res.deletedItems, [0, 2, 4]);
  assert.deepEqual(res.addedItems, [5, 6, 7]);
  assert.deepEqual(res.reorderedItems, []);
  assert.deepEqual(res.mergedItems, [5, 0, 1, 6, 2, 3, 7, 4]);

  res = compareArrays([0, 1, 2, 3, 4], [], (i) => i);
  assert.deepEqual(res.deletedItems, [0, 1, 2, 3, 4]);
  assert.deepEqual(res.addedItems, []);
  assert.deepEqual(res.reorderedItems, []);
  assert.deepEqual(res.mergedItems, [0, 1, 2, 3, 4]);

  res = compareArrays([], [5, 1, 6, 3, 7], (i) => i);
  assert.deepEqual(res.deletedItems, []);
  assert.deepEqual(res.addedItems, [5, 1, 6, 3, 7]);
  assert.deepEqual(res.reorderedItems, []);
  assert.deepEqual(res.mergedItems, [5, 1, 6, 3, 7]);

  res = compareArrays([{ value: 0 }, { value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }], [{ value: 5 }, { value: 3 }, { value: 6 }, { value: 1 }, { value: 7 }], (item) => item.value);
  assert.deepEqual(res.deletedItems, [{ value: 0 }, { value: 2 }, { value: 4 }]);
  assert.deepEqual(res.addedItems, [{ value: 5 }, { value: 6 }, { value: 7 }]);
  assert.deepEqual(res.reorderedItems, [{ item: { value: 3 }, movedForward: false }, { item: { value: 1 }, movedForward: true }]);
  assert.deepEqual(res.mergedItems, [{ value: 5 }, { value: 0 }, { value: 3 }, { value: 6 }, { value: 2 }, { value: 1 }, { value: 7 }, { value: 4 }]);

  res = compareArrays([{ value: 0 }, { value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }], [{ value: 5 }, { value: 3 }, { value: 6 }, { value: 1 }, { value: 7 }], (item) => item);
  assert.deepEqual(res.deletedItems, [{ value: 0 }, { value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }]);
  assert.deepEqual(res.addedItems, [{ value: 5 }, { value: 3 }, { value: 6 }, { value: 1 }, { value: 7 }]);
  assert.deepEqual(res.reorderedItems, []);
  assert.deepEqual(res.mergedItems, [{ value: 5 }, { value: 3 }, { value: 6 }, { value: 1 }, { value: 7 }, { value: 0 }, { value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }]);

  assert.throws(() => compareArrays([{ value: 0 }, { value: 0 }], [], (item) => item.value), new Error("keys must be unique"));
  assert.throws(() => compareArrays([], [{ value: 1 }, { value: 1 }], (item) => item.value), new Error("keys must be unique"));
});

QUnit.test("test onNextRender function", (assert) => {
  let rerenderEvent = new EventBase();
  const animation = new AnimationBoolean({
    getRerenderEvent() {
      return rerenderEvent;
    }
  } as any, () => {}, () => undefined as any);

  let log = "";
  animation["onNextRender"](() => {
    log+= "->callback";
  }, () => {
    log+= "->cancelled";
  });
  assert.equal(log, "");
  rerenderEvent.fire(undefined, undefined);
  assert.equal(log, "->callback");
  assert.ok(rerenderEvent.isEmpty);
  assert.notOk(!!animation["cancelCallback"]);

  log ="";
  animation["onNextRender"](() => {
    log+= "->callback";
  }, () => {
    log+= "->cancelled";
  });
  assert.equal(log, "");
  animation.cancel();
  assert.equal(log, "->cancelled");
  assert.ok(rerenderEvent.isEmpty);
  assert.notOk(!!animation["cancelCallback"]);

  log = "";
  rerenderEvent = undefined as any;
  let latestRafCb: any;
  let rafId = 0;
  const oldRequestAnimationFrame = window.requestAnimationFrame;
  const oldCancelAnimationFrame = window.cancelAnimationFrame;
  window.requestAnimationFrame = ((cb) => {
    rafId++;
    latestRafCb = () => { log+= `->running: ${rafId}`; cb(); };
    log+= `->raf: ${rafId}`;
    return rafId;
  }) as any;
  window.cancelAnimationFrame = (() => {
    log+= `->canceled raf: ${rafId}`;
  }) as any;

  animation["onNextRender"](() => {
    log+= "->callback";
  }, () => {
    log+= "->cancelled";
  });
  assert.equal(log, "->raf: 1");
  log = "";
  latestRafCb();
  assert.equal(log, "->running: 1->callback");
  assert.notOk(!!animation["cancelCallback"]);

  log ="";
  animation["onNextRender"](() => {
    log+= "->callback";
  }, () => {
    log+= "->cancelled";
  });
  assert.equal(log, "->raf: 2");
  log = "";
  animation.cancel();
  assert.equal(log, "->cancelled->canceled raf: 2");
  assert.notOk(!!animation["cancelCallback"]);

  window.requestAnimationFrame = oldRequestAnimationFrame;
  window.cancelAnimationFrame = oldCancelAnimationFrame;
});