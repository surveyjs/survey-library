import { Selector, fixture, test, ClientFunction } from "testcafe";
import { frameworks, url, initSurvey, getSurveyResult } from "../helper";
const title = "Input mask";

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}`;

  test("Save unmasked value", async (t) => {
    await initSurvey(framework, {
      focusFirstQuestionAutomatic: true,
      questions: [
        {
          name: "name",
          type: "text",
          maskType: "pattern",
          maskSettings: {
            pattern: "+99-99"
          }
        }]
    });

    await t
      .pressKey("1 2 3 4")
      .expect(Selector("input").value).eql("+12-34")
      .click("input[value=Complete]");

    const surveyResult = await getSurveyResult();
    await t.expect(surveyResult).eql({
      name: "1234",
    });
  });

  test("Cursor position on click", async (t) => {
    await initSurvey(framework, {
      focusFirstQuestionAutomatic: true,
      questions: [
        {
          name: "name",
          type: "text",
          maskType: "pattern",
          maskSettings: {
            pattern: "+99-99"
          }
        },
        {
          name: "name1",
          type: "text",
          defaultValue: "1234",
          maskType: "pattern",
          maskSettings: {
            pattern: "+99-99"
          }
        }]
    });

    var getCursor =
      ClientFunction(() => {
        return (document.activeElement as HTMLInputElement).selectionStart;
      });

    await t
      .expect(getCursor()).eql(0)
      .click(Selector(".sv_q_text_root").nth(0))
      .expect(getCursor()).eql(0);
    await t
      .click(Selector(".sv_q_text_root").nth(1))
      .expect(getCursor()).eql(6);
  });

});