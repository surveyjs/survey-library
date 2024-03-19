import { IAction } from "../src/actions/action";
import { defaultListCss } from "../src/list";
import { createSvg, doKey2ClickDown, doKey2ClickUp, sanitizeEditableContent, configConfirmDialog } from "../src/utils/utils";
import { mouseInfo } from "../src/utils/devices";
import { PopupBaseViewModel } from "../src/popup-view-model";
import { PopupModel } from "../src/popup";

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