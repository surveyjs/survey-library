import { IAction } from "../src/actions/action";
import { Question } from "../src/question";
import { sanitizeEditableContent } from "../src/utils/utils";

export default QUnit.module("utils");
function checkSanitizer(element, text, selectionNodeIndex, selectionStart) {
  element.innerHTML = text;
  const selection = document.getSelection();
  const range = document.createRange();
  if(selectionNodeIndex >= 0) {
    range.setStart(element.childNodes[selectionNodeIndex], selectionStart);
  }
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);

  sanitizeEditableContent(element);
  const newSelection = document.getSelection();
  return {
    text: element.innerHTML,
    offset: newSelection.getRangeAt(0).startOffset
  };
}
QUnit.test(
  "utils: sanitizer",
  function(assert) {
    var element: HTMLSpanElement = document.createElement("span");
    document.body.appendChild(element);
    element.contentEditable = "true";

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

export function createIActionArray(count: number): Array<IAction> {
  let result: Array<IAction> = [];
  for (let index = 0; index < count; ++index) {
    result.push(<IAction>{ id: "test" + index, title: "test" + index });
  }
  return result;
}