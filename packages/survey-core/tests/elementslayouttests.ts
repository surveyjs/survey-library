import { PageModel } from "../src/page";

export default QUnit.module("ElementsLayout");

function percentageToNum(width: string): Number {
  width = width.replace("%", "");
  return parseFloat(width);
}
QUnit.test("Simple layout test", function(assert) {
  var page = new PageModel();
  page.addNewQuestion("text", "q1");
  page.addNewQuestion("text", "q2");
  assert.equal(page.rows.length, 2, "There are two rows");
  assert.equal(
    percentageToNum(page.questions[0].renderWidth),
    100,
    "The render width is 100%"
  );
  page.questions[1].startWithNewLine = false;
  assert.equal(page.rows.length, 1, "There is one row");
  assert.equal(
    percentageToNum(page.questions[0].renderWidth),
    50,
    "The render width is 50%"
  );
});
QUnit.test("Two panels test", function(assert) {
  var page = new PageModel();
  var panel1 = page.addNewPanel("p1");
  var panel2 = page.addNewPanel("p2");
  panel2.startWithNewLine = false;
  panel1.addNewQuestion("text", "p1_q1");
  panel2.addNewQuestion("text", "p1_q2");
  assert.equal(page.rows.length, 1, "There is one row");
  assert.equal(
    percentageToNum(page.elements[0].renderWidth),
    50,
    "1. The render width is 50%"
  );
  panel2.elements[0].visible = false;
  assert.equal(
    percentageToNum(page.elements[0].renderWidth),
    100,
    "2. The panel1 render width is 100%"
  );
  assert.equal(
    page.elements[1].renderWidth,
    "",
    "2. The panel2 render width is empty"
  );
  panel2.elements[0].visible = true;
  assert.equal(
    percentageToNum(page.elements[0].renderWidth),
    50,
    "3. The panel1 render width is 50% again"
  );
  assert.equal(
    percentageToNum(page.elements[1].renderWidth),
    50,
    "3. The panel2 The render width is 50% again"
  );
});
