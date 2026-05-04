import { PageModel } from "../src/page";

import { describe, test, expect } from "vitest";
describe("ElementsLayout", () => {
  function percentageToNum(width: string): number {
    width = width.replace("%", "");
    return parseFloat(width);
  }
  test("Simple layout test", () => {
    var page = new PageModel();
    page.addNewQuestion("text", "q1");
    page.addNewQuestion("text", "q2");
    expect(page.rows.length, "There are two rows").toBe(2);
    expect(percentageToNum(page.questions[0].renderWidth), "The render width is 100%").toBe(100);
    page.questions[1].startWithNewLine = false;
    expect(page.rows.length, "There is one row").toBe(1);
    expect(percentageToNum(page.questions[0].renderWidth), "The render width is 50%").toBe(50);
  });
  test("Two panels test", () => {
    var page = new PageModel();
    var panel1 = page.addNewPanel("p1");
    var panel2 = page.addNewPanel("p2");
    panel2.startWithNewLine = false;
    panel1.addNewQuestion("text", "p1_q1");
    panel2.addNewQuestion("text", "p1_q2");
    expect(page.rows.length, "There is one row").toBe(1);
    expect(percentageToNum(page.elements[0].renderWidth), "1. The render width is 50%").toBe(50);
    panel2.elements[0].visible = false;
    expect(percentageToNum(page.elements[0].renderWidth), "2. The panel1 render width is 100%").toBe(100);
    expect(page.elements[1].renderWidth, "2. The panel2 render width is empty").toBe("");
    panel2.elements[0].visible = true;
    expect(percentageToNum(page.elements[0].renderWidth), "3. The panel1 render width is 50% again").toBe(50);
    expect(percentageToNum(page.elements[1].renderWidth), "3. The panel2 The render width is 50% again").toBe(50);
  });
});
