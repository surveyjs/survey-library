import { Selector, fixture, test, ClientFunction } from "testcafe";
import { frameworks, url, initSurvey, getSurveyResult, setTimeZoneUnsafe, getTimeZone } from "../helper";
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
      .click(Selector(".sd-text").nth(0))
      .expect(getCursor()).eql(0);
    await t
      .click(Selector(".sd-text").nth(1))
      .expect(getCursor()).eql(6);
  });

  test("An invalid value is not always cleared", async (t) => {
    await initSurvey(framework, {
      focusFirstQuestionAutomatic: true,
      pages: [
        {
          name: "page1",
          elements: [
            {
              type: "text",
              name: "question1",
              maskType: "pattern",
              maskSettings: {
                pattern: "99999",
              },
            },
          ],
        },
      ],
    });
    const emptyValue = "_____";

    await t
      .expect(Selector("input").value).eql(emptyValue)

      .pressKey("1 2 3 4")
      .expect(Selector("input").value).eql("1234_")

      .pressKey("tab")
      .expect(Selector("input").value).eql(emptyValue)

      .click("input")
      .pressKey("1 2 3")
      .expect(Selector("input").value).eql("123__")

      .pressKey("tab")
      .expect(Selector("input").value).eql(emptyValue);
  });

  test("mask and maxlength", async (t) => {
    await initSurvey(framework, {
      focusFirstQuestionAutomatic: true,
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "text",
              "name": "question1",
              "maskType": "numeric",
              "maxLength": 2
            }
          ]
        }
      ]
    });

    await t
      .expect(Selector("input").value).eql("")

      .pressKey("1")
      .expect(Selector("input").value).eql("1")

      .pressKey("2")
      .expect(Selector("input").value).eql("12")

      .pressKey("3")
      .expect(Selector("input").value).eql("12");
  });

  test("Test mask in western timezone", async (t) => {
    if (framework === "vue") return;
    const oldTimeZone = await getTimeZone();
    await setTimeZoneUnsafe(t, "America/Los_Angeles");
    await initSurvey(framework, {
      focusFirstQuestionAutomatic: true,
      questions: [
        {
          name: "name",
          type: "text",
          maskType: "datetime",
          maskSettings: {
            pattern: "HH:MM"
          }
        }, {
          "type": "text",
          "name": "yearInput",
          "title": "Year Input (Input Mask)",
          "maskType": "datetime",
          "maskSettings": {
            "pattern": "yyyy"
          },
          "placeholder": "YYYY"
        }]
    });

    await t
      .expect(getTimeZone()).eql("America/Los_Angeles")
      .pressKey("1 2 3 4 tab 2 0 2 2 tab")
      .expect(Selector("input").nth(0).value).eql("12:34")
      .expect(Selector("input").nth(1).value).eql("2022")
      .click("input[value=Complete]");

    const surveyResult = await getSurveyResult();
    await t.expect(surveyResult).eql({
      name: "12:34",
      yearInput: "2022"
    });
    await setTimeZoneUnsafe(t, oldTimeZone);
  });
});
