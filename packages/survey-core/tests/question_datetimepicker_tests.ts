import { SurveyModel } from "../src/survey";
import { Serializer } from "../src/jsonobject";
import { QuestionFactory } from "../src/questionfactory";
import { QuestionDateTimePickerModel } from "../src/question_datetimepicker";
import { CalendarModel } from "../src/calendar/calendar";
import { CalendarItem } from "../src/calendar/interfaces";
import { InputMaskDateTime } from "../src/mask/mask_datetime";

import { describe, test, expect, vi, afterEach } from "vitest";

function d(year: number, month: number, day: number): Date {
  return new Date(year, month - 1, day);
}
function createQuestion(json: any = {}, surveyJson: any = {}): QuestionDateTimePickerModel {
  const survey = new SurveyModel(Object.assign({ elements: [Object.assign({ type: "datetimepicker", name: "q1" }, json)] }, surveyJson));
  return <QuestionDateTimePickerModel>survey.getQuestionByName("q1");
}
function findDay(calendar: CalendarModel, date: Date): CalendarItem {
  return calendar.months[0].days.filter(item => !item.isOutside && item.date.getTime() === date.getTime())[0];
}

describe("QuestionDateTimePickerModel", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  test("Registration and defaults", () => {
    const q = createQuestion();
    expect(q.getType()).toBe("datetimepicker");
    expect(Serializer.createClass("datetimepicker")).toBeInstanceOf(QuestionDateTimePickerModel);
    expect(QuestionFactory.Instance.createQuestion("datetimepicker", "q2")).toBeInstanceOf(QuestionDateTimePickerModel);
    expect(q.pickerType).toBe("date");
    expect(q.range).toBe(false);
    expect(q.allowClear).toBe(true);
    expect(q.min).toBeUndefined();
    expect(q.max).toBeUndefined();
    expect(q.getValueType()).toBe("string");
    expect(Serializer.findProperty("datetimepicker", "pickerType").getChoices(q)).toEqual(["date"]);
  });

  test("The mask is a localeDate datetime mask", () => {
    const q = createQuestion();
    const mask = <InputMaskDateTime>q.maskSettings;
    expect(mask.getType()).toBe("datetimemask");
    expect(mask.patternPreset).toBe("localeDate");
    expect(mask.activePattern).toBe("mm/dd/yyyy");
    expect(q.inputValue).toBe("mm/dd/yyyy");
  });

  test("Calendar and popup", () => {
    const q = createQuestion();
    expect(q.calendar).toBeInstanceOf(CalendarModel);
    expect(q.popupModel.contentComponentName).toBe("sv-calendar");
    expect(q.popupModel.contentComponentData.model).toBe(q.calendar);
    expect(q.popupModel.isVisible).toBe(false);
  });

  test("toJSON with defaults", () => {
    const q = createQuestion();
    expect(q.toJSON()).toEqual({ name: "q1" });
  });

  test("fromJSON / toJSON", () => {
    const json = {
      name: "q1",
      min: "2026-01-01",
      max: "2026-12-31",
      minValueExpression: "today()",
      maxValueExpression: "today(30)",
      placeholder: "Pick a date",
      allowClear: false,
      pattern: "dd.mm.yyyy"
    };
    const q = new QuestionDateTimePickerModel("q1");
    q.fromJSON(json);
    expect(q.min).toBe("2026-01-01");
    expect(q.max).toBe("2026-12-31");
    expect(q.placeholder).toBe("Pick a date");
    expect(q.allowClear).toBe(false);
    expect(q.pattern).toBe("dd.mm.yyyy");
    expect((<InputMaskDateTime>q.maskSettings).pattern).toBe("dd.mm.yyyy");
    expect(q.toJSON()).toEqual(json);
  });

  test("The mask settings are not serializable, only the pattern is", () => {
    expect(Serializer.findProperty("datetimepicker", "maskSettings")).toBeFalsy();
    expect(Serializer.findProperty("datetimepicker", "pattern")).toBeTruthy();
    const q = createQuestion({ pattern: "yyyy-mm-dd", min: "2026-01-01" });
    q.value = "2026-11-09";
    expect(q.inputValue).toBe("2026-11-09");
    expect(q.toJSON()).toEqual({ name: "q1", pattern: "yyyy-mm-dd", min: "2026-01-01" });
    q.pattern = "";
    expect(q.inputValue).toBe("11/09/2026");
    expect(q.toJSON()).toEqual({ name: "q1", min: "2026-01-01" });
  });

  test("min and max are passed to the mask", () => {
    const q = createQuestion({ min: "2026-01-01", max: "2026-12-31" });
    const mask = <InputMaskDateTime>q.maskSettings;
    expect(mask.min).toBe("2026-01-01");
    expect(mask.max).toBe("2026-12-31");
    q.min = "2026-02-01";
    expect(mask.min).toBe("2026-02-01");
    q.max = undefined;
    expect(mask.max).toBeUndefined();
  });

  test("min and max expressions are passed to the mask", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(2026, 10, 9, 15, 30));
    const q = createQuestion({ minValueExpression: "today(-1)", maxValueExpression: "today(30)" });
    const mask = <InputMaskDateTime>q.maskSettings;
    expect(mask.min).toBe("2026-11-08");
    expect(mask.max).toBe("2026-12-09");
  });

  test("The mask rejects a manually typed date out of min and max", () => {
    const q = createQuestion({ min: "2026-01-01", max: "2026-12-31" });
    const result = q.maskSettings.processInput({ insertedChars: "1", selectionStart: 6, selectionEnd: 6, prevValue: "04/05/yyyy", inputDirection: "forward" });
    expect(result.value).toBe("04/05/yyyy");
    const accepted = q.maskSettings.processInput({ insertedChars: "2", selectionStart: 6, selectionEnd: 6, prevValue: "04/05/yyyy", inputDirection: "forward" });
    expect(accepted.value).toBe("04/05/2yyy");
  });

  test("Changing min and max keeps the input adapters, changing the pattern recreates them", () => {
    const q = createQuestion();
    const root = document.createElement("div");
    root.appendChild(document.createElement("input"));
    q.afterRenderQuestionElement(root);
    const adapters = (<any>q).maskInputAdapters.slice();
    expect(adapters).toHaveLength(1);
    q.min = "2026-01-01";
    q.maxValueExpression = "today(30)";
    expect((<any>q).maskInputAdapters).toEqual(adapters);
    q.pattern = "dd.mm.yyyy";
    expect((<any>q).maskInputAdapters[0]).not.toBe(adapters[0]);
    expect(root.querySelector("input").value).toBe("dd.mm.yyyy");
    q.beforeDestroyQuestionElement(root);
  });

  test("Value is shown in the input and in the calendar", () => {
    const q = createQuestion();
    q.value = "2026-11-09";
    expect(q.inputValue).toBe("11/09/2026");
    expect(q.calendar.value.getTime()).toBe(d(2026, 11, 9).getTime());
    expect(q.calendar.viewDate.getTime()).toBe(d(2026, 11, 1).getTime());

    q.clearValue();
    expect(q.inputValue).toBe("mm/dd/yyyy");
    expect(q.calendar.value).toBeUndefined();
  });

  test("Value from survey data", () => {
    const q = createQuestion();
    q.survey.data = { q1: "2025-03-17" };
    expect(q.inputValue).toBe("03/17/2025");
    expect(q.calendar.value.getTime()).toBe(d(2025, 3, 17).getTime());
  });

  test("A complete date in the input sets the value and the calendar month", () => {
    const q = createQuestion();
    q.inputValue = "12/25/2027";
    expect(q.value).toBe("2027-12-25");
    expect(q.calendar.value.getTime()).toBe(d(2027, 12, 25).getTime());
    expect(q.calendar.viewDate.getTime()).toBe(d(2027, 12, 1).getTime());
  });

  test("An incomplete date in the input is kept and does not set the value", () => {
    const q = createQuestion();
    q.value = "2026-11-09";
    q.inputValue = "12/25/yyyy";
    expect(q.value).toBeUndefined();
    expect(q.inputValue).toBe("12/25/yyyy");
    expect(q.calendar.value).toBeUndefined();
  });

  test("Selecting a day in the calendar sets the value and closes the popup", () => {
    const q = createQuestion();
    q.value = "2026-11-09";
    q.togglePopup();
    expect(q.popupModel.isVisible).toBe(true);
    q.calendar.selectItem(findDay(q.calendar, d(2026, 11, 20)));
    expect(q.value).toBe("2026-11-20");
    expect(q.inputValue).toBe("11/20/2026");
    expect(q.popupModel.isVisible).toBe(false);
  });

  test("Opening the popup resets the calendar view", () => {
    const q = createQuestion();
    q.value = "2026-11-09";
    q.calendar.zoom = "year";
    q.calendar.next();
    q.togglePopup();
    expect(q.calendar.zoom).toBe("day");
    expect(q.calendar.viewDate.getTime()).toBe(d(2026, 11, 1).getTime());
    q.togglePopup();
    expect(q.popupModel.isVisible).toBe(false);
  });

  test("Calendar button opens the popup", () => {
    const q = createQuestion();
    const button = q.editorButtons.getActionById("calendar");
    expect(button).toBeTruthy();
    expect(button.enabled).toBe(true);
    button.action();
    expect(q.popupModel.isVisible).toBe(true);
    button.action();
    expect(q.popupModel.isVisible).toBe(false);
  });

  test("Clear button", () => {
    const q = createQuestion();
    const button = q.editorButtons.getActionById("clear");
    expect(button.visible).toBe(false);
    q.value = "2026-11-09";
    expect(button.visible).toBe(true);
    button.action();
    expect(q.isEmpty()).toBe(true);
    expect(q.inputValue).toBe("mm/dd/yyyy");
    expect(button.visible).toBe(false);

    q.allowClear = false;
    q.value = "2026-11-09";
    expect(button.visible).toBe(false);
  });

  test("Clear button clears an incomplete entry", () => {
    const q = createQuestion();
    q.value = "2026-11-09";
    q.inputValue = "12/25/yyyy";
    q.clearInput();
    expect(q.inputValue).toBe("mm/dd/yyyy");
    expect(q.isEmpty()).toBe(true);
  });

  test("readOnly: the popup does not open", () => {
    const q = createQuestion({ readOnly: true });
    q.togglePopup();
    expect(q.popupModel.isVisible).toBe(false);
    expect(q.editorButtons.getActionById("calendar").enabled).toBe(false);

    q.readOnly = false;
    expect(q.editorButtons.getActionById("calendar").enabled).toBe(true);
    q.togglePopup();
    expect(q.popupModel.isVisible).toBe(true);
    q.readOnly = true;
    expect(q.popupModel.isVisible).toBe(false);
  });

  test("readOnly survey and design mode: the popup does not open", () => {
    let q = createQuestion({}, { readOnly: true });
    q.togglePopup();
    expect(q.popupModel.isVisible).toBe(false);

    q = createQuestion();
    q.survey.setDesignMode(true);
    q.togglePopup();
    expect(q.popupModel.isVisible).toBe(false);
  });

  test("Clear button is hidden in readOnly mode", () => {
    const q = createQuestion({ defaultValue: "2026-11-09" });
    expect(q.editorButtons.getActionById("clear").visible).toBe(true);
    q.readOnly = true;
    expect(q.editorButtons.getActionById("clear").visible).toBe(false);
  });

  test("min and max are passed to the calendar", () => {
    const q = createQuestion({ min: "2026-11-05", max: "2026-11-20" });
    expect(q.renderedMin).toBe("2026-11-05");
    expect(q.renderedMax).toBe("2026-11-20");
    expect(q.calendar.min.getTime()).toBe(d(2026, 11, 5).getTime());
    expect(q.calendar.max.getTime()).toBe(d(2026, 11, 20).getTime());

    q.min = undefined;
    expect(q.calendar.min).toBeUndefined();
    q.max = "2026-12-31";
    expect(q.calendar.max.getTime()).toBe(d(2026, 12, 31).getTime());
  });

  test("min cannot be greater than max", () => {
    const q = createQuestion({ max: "2026-11-10" });
    q.min = "2026-12-01";
    expect(q.min).toBe("2026-11-10");
    q.min = "2026-11-01";
    q.max = "2026-10-01";
    expect(q.max).toBe("2026-11-01");
  });

  test("min and max as expressions", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(2026, 10, 9, 15, 0));
    const q = createQuestion({ minValueExpression: "today()", maxValueExpression: "today(10)" });
    expect(q.renderedMin).toBe("2026-11-09");
    expect(q.renderedMax).toBe("2026-11-19");
    expect(q.calendar.min.getTime()).toBe(d(2026, 11, 9).getTime());
    expect(q.calendar.max.getTime()).toBe(d(2026, 11, 19).getTime());
  });

  test("min as =expression", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(2026, 10, 9));
    const q = createQuestion({ min: "=today(-1)" });
    expect(q.minValueExpression).toBe("today(-1)");
    expect(q.renderedMin).toBe("2026-11-08");
  });

  test("min and max expressions depending on another question", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "start", inputType: "date" },
        { type: "datetimepicker", name: "q1", minValueExpression: "{start}" }
      ]
    });
    const q = <QuestionDateTimePickerModel>survey.getQuestionByName("q1");
    expect(q.calendar.min).toBeUndefined();
    survey.setValue("start", "2026-11-15");
    expect(q.renderedMin).toBe("2026-11-15");
    expect(q.calendar.min.getTime()).toBe(d(2026, 11, 15).getTime());
  });

  test("Required error", () => {
    const q = createQuestion({ isRequired: true });
    expect(q.validate()).toBe(false);
    expect(q.errors.map(error => error.getErrorType())).toEqual(["required"]);
    q.value = "2026-11-09";
    expect(q.validate()).toBe(true);
  });

  test("An incomplete entry reports the incomplete pattern error instead of required", () => {
    const q = createQuestion({ isRequired: true });
    q.inputValue = "12/25/yyyy";
    expect(q.validate()).toBe(false);
    expect(q.errors.map(error => error.getErrorType())).toEqual(["patternincompleteerror"]);

    const q2 = createQuestion();
    q2.inputValue = "12/yy/yyyy";
    expect(q2.validate()).toBe(false);
    expect(q2.errors.map(error => error.getErrorType())).toEqual(["patternincompleteerror"]);
  });

  test("min and max errors", () => {
    const q = createQuestion({ min: "2026-11-05", max: "2026-11-20" });
    q.value = "2026-11-04";
    expect(q.validate()).toBe(false);
    expect(q.errors).toHaveLength(1);
    expect(q.errors[0].text).toBe("The value should not be less than 11/05/2026");

    q.value = "2026-11-21";
    expect(q.validate()).toBe(false);
    expect(q.errors[0].text).toBe("The value should not be greater than 11/20/2026");

    q.value = "2026-11-20";
    expect(q.validate()).toBe(true);
  });

  test("Custom min and max error texts", () => {
    const q = createQuestion({ min: "2026-11-05", minErrorText: "Not before {0}" });
    q.value = "2026-11-01";
    q.validate();
    expect(q.errors[0].text).toBe("Not before 11/05/2026");
    expect(q.toJSON().minErrorText).toBe("Not before {0}");
  });

  test("A value of a wrong type is reported", () => {
    const survey = new SurveyModel({ elements: [{ type: "datetimepicker", name: "q1" }] });
    expect(survey.setData({ q1: "2026-11-09" })).toEqual([]);
    const issues = survey.setData({ q1: "not a date" });
    expect(issues.map(issue => issue.type)).toEqual(["invalidValueType"]);
    expect(survey.setData({ q1: "2026-13-45" }).map(issue => issue.type)).toEqual(["invalidValueType"]);
    expect(survey.setData({ q1: 5 }).map(issue => issue.type)).toEqual(["invalidValueType"]);
  });

  test("Locale change updates the input", () => {
    const q = createQuestion();
    q.value = "2026-11-09";
    q.survey.locale = "de";
    expect(q.inputValue).toBe("09.11.2026");
    q.survey.locale = "";
    expect(q.inputValue).toBe("11/09/2026");
  });

  test("Mask pattern change updates the input", () => {
    const q = createQuestion();
    q.value = "2026-11-09";
    q.pattern = "yyyy/mm/dd";
    expect(q.inputValue).toBe("2026/11/09");
  });
});

function findRangeDay(calendar: CalendarModel, date: Date): CalendarItem {
  for (const month of calendar.months) {
    const item = month.days.filter(day => !day.isOutside && day.date.getTime() === date.getTime())[0];
    if (!!item) return item;
  }
  return undefined;
}
function errorTypes(q: QuestionDateTimePickerModel): Array<string> {
  return q.errors.map(error => error.getErrorType());
}

describe("QuestionDateTimePickerModel range", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  test("Range properties: defaults and serialization", () => {
    const q = createQuestion({ range: true });
    expect(q.getValueType()).toBe("array");
    expect(q.calendar.range).toBe(true);
    expect(q.startPlaceholder).toBeFalsy();
    expect(q.endPlaceholder).toBeFalsy();
    expect(q.rangeErrorText).toBe("The start date cannot be later than the end date.");
    expect(q.toJSON()).toEqual({ name: "q1", range: true });

    const json = { name: "q1", range: true, startPlaceholder: "From", endPlaceholder: "To", rangeErrorText: "Wrong range" };
    const q2 = new QuestionDateTimePickerModel("q1");
    q2.fromJSON(json);
    expect(q2.startPlaceholder).toBe("From");
    expect(q2.endPlaceholder).toBe("To");
    expect(q2.rangeErrorText).toBe("Wrong range");
    expect(q2.toJSON()).toEqual(json);
  });

  test("Both field masks get min and max, before and after the end mask is created", () => {
    const q = createQuestion({ range: true, min: "2026-01-01" });
    const root = document.createElement("div");
    root.appendChild(document.createElement("input"));
    root.appendChild(document.createElement("input"));
    q.afterRenderQuestionElement(root);
    const endMask = <InputMaskDateTime>(<any>q).endMask;
    expect(endMask).not.toBe(q.maskSettings);
    expect(endMask.min).toBe("2026-01-01");
    q.max = "2026-12-31";
    expect(endMask.max).toBe("2026-12-31");
    expect((<InputMaskDateTime>q.maskSettings).max).toBe("2026-12-31");
    q.beforeDestroyQuestionElement(root);
  });

  test("The pattern changes the format of both fields", () => {
    const q = createQuestion({ range: true, defaultValue: ["2026-11-05", "2026-11-09"] });
    const root = document.createElement("div");
    root.appendChild(document.createElement("input"));
    root.appendChild(document.createElement("input"));
    q.afterRenderQuestionElement(root);
    q.pattern = "dd.mm.yyyy";
    expect(q.startInputValue).toBe("05.11.2026");
    expect(q.endInputValue).toBe("09.11.2026");
    const inputs = root.querySelectorAll("input");
    expect(inputs[0].value).toBe("05.11.2026");
    expect(inputs[1].value).toBe("09.11.2026");
    q.beforeDestroyQuestionElement(root);
  });

  test("Range properties are visible only in range mode", () => {
    const q = createQuestion();
    ["startPlaceholder", "endPlaceholder", "rangeErrorText"].forEach(name => {
      const prop = Serializer.findProperty("datetimepicker", name);
      q.range = false;
      expect(prop.isVisible("", q), name + " hidden").toBe(false);
      q.range = true;
      expect(prop.isVisible("", q), name + " visible").toBe(true);
    });
  });

  test("Value is shown in both fields and in the calendar", () => {
    const q = createQuestion({ range: true });
    expect(q.startInputValue).toBe("mm/dd/yyyy");
    expect(q.endInputValue).toBe("mm/dd/yyyy");
    q.value = ["2026-11-05", "2026-11-12"];
    expect(q.startInputValue).toBe("11/05/2026");
    expect(q.endInputValue).toBe("11/12/2026");
    expect(q.calendar.value.map((date: Date) => date.getTime())).toEqual([d(2026, 11, 5).getTime(), d(2026, 11, 12).getTime()]);
    q.clearValue();
    expect(q.startInputValue).toBe("mm/dd/yyyy");
    expect(q.endInputValue).toBe("mm/dd/yyyy");
    expect(q.calendar.value).toBeUndefined();
  });

  test("Value is written only when both fields are complete and start <= end", () => {
    const q = createQuestion({ range: true });
    q.startInputValue = "11/05/2026";
    expect(q.isEmpty()).toBe(true);
    expect(q.startInputValue).toBe("11/05/2026");
    q.endInputValue = "11/1m/yyyy";
    expect(q.isEmpty()).toBe(true);
    q.endInputValue = "11/12/2026";
    expect(q.value).toEqual(["2026-11-05", "2026-11-12"]);
    q.endInputValue = "11/05/2026";
    expect(q.value, "a single day range").toEqual(["2026-11-05", "2026-11-05"]);
  });

  test("A previously written value is cleared, drafts are kept", () => {
    const q = createQuestion({ range: true });
    q.value = ["2026-11-05", "2026-11-12"];
    q.endInputValue = "11/1m/yyyy";
    expect(q.isEmpty()).toBe(true);
    expect(q.startInputValue).toBe("11/05/2026");
    expect(q.endInputValue).toBe("11/1m/yyyy");

    q.value = ["2026-11-05", "2026-11-12"];
    q.startInputValue = "11/20/2026";
    expect(q.isEmpty(), "start > end").toBe(true);
    expect(q.startInputValue).toBe("11/20/2026");
    expect(q.endInputValue).toBe("11/12/2026");
    q.endInputValue = "11/25/2026";
    expect(q.value).toEqual(["2026-11-20", "2026-11-25"]);
  });

  test("A complete date in a field updates the calendar view and selection", () => {
    const q = createQuestion({ range: true });
    q.startInputValue = "03/10/2027";
    expect(q.calendar.viewDate.getTime()).toBe(d(2027, 3, 1).getTime());
    expect(q.calendar.rangeStart.getTime()).toBe(d(2027, 3, 10).getTime());
    q.endInputValue = "05/02/2027";
    expect(q.calendar.viewDate.getTime()).toBe(d(2027, 5, 1).getTime());
    expect(q.calendar.rangeStart).toBeUndefined();
    expect(q.calendar.value.map((date: Date) => date.getTime())).toEqual([d(2027, 3, 10).getTime(), d(2027, 5, 2).getTime()]);
  });

  test("Selecting a range in the calendar fills both fields and closes the popup", () => {
    const q = createQuestion({ range: true });
    q.value = ["2026-11-05", "2026-11-12"];
    q.togglePopup();
    q.calendar.selectItem(findRangeDay(q.calendar, d(2026, 11, 20)));
    expect(q.startInputValue).toBe("11/20/2026");
    expect(q.endInputValue).toBe("mm/dd/yyyy");
    expect(q.isEmpty()).toBe(true);
    expect(q.popupModel.isVisible).toBe(true);
    q.calendar.selectItem(findRangeDay(q.calendar, d(2026, 11, 3)));
    expect(q.value).toEqual(["2026-11-03", "2026-11-20"]);
    expect(q.startInputValue).toBe("11/03/2026");
    expect(q.endInputValue).toBe("11/20/2026");
    expect(q.popupModel.isVisible).toBe(false);
  });

  test("First click, close, open, second click", () => {
    const q = createQuestion({ range: true });
    q.togglePopup();
    q.calendar.selectItem(findRangeDay(q.calendar, d(2026, 11, 10)));
    q.togglePopup();
    expect(q.popupModel.isVisible).toBe(false);
    expect(q.startInputValue).toBe("11/10/2026");
    expect(q.isEmpty()).toBe(true);

    q.calendar.setRangeStart(undefined);
    q.togglePopup();
    expect(q.calendar.rangeStart.getTime()).toBe(d(2026, 11, 10).getTime());
    expect(q.calendar.viewDate.getTime()).toBe(d(2026, 11, 1).getTime());
    q.calendar.selectItem(findRangeDay(q.calendar, d(2026, 11, 15)));
    expect(q.value).toEqual(["2026-11-10", "2026-11-15"]);
    expect(q.popupModel.isVisible).toBe(false);
  });

  test("Opening the popup with an edited start draft takes it as rangeStart", () => {
    const q = createQuestion({ range: true });
    q.startInputValue = "02/14/2027";
    q.calendar.setRangeStart(undefined);
    q.togglePopup();
    expect(q.calendar.rangeStart.getTime()).toBe(d(2027, 2, 14).getTime());
    expect(q.calendar.viewDate.getTime()).toBe(d(2027, 2, 1).getTime());
  });

  test("Each range field has its own calendar and clear buttons", () => {
    const q = createQuestion({ range: true });
    expect(q.getEditorButtons(0)).toBe(q.startEditorButtons);
    expect(q.getEditorButtons(1)).toBe(q.endEditorButtons);
    expect(q.startEditorButtons).not.toBe(q.endEditorButtons);
    [q.startEditorButtons, q.endEditorButtons].forEach(buttons => {
      expect(buttons.actions.map(action => action.id)).toEqual(["clear", "calendar"]);
    });

    q.endEditorButtons.getActionById("calendar").action();
    expect(q.popupModel.isVisible).toBe(true);
    expect(q.startEditorButtons.getActionById("calendar").popupActive).toBe(true);
    expect(q.endEditorButtons.getActionById("calendar").popupActive).toBe(true);
    q.popupModel.hide();
    expect(q.endEditorButtons.getActionById("calendar").popupActive).toBe(false);
  });

  test("A range clear button clears its own field", () => {
    const q = createQuestion({ range: true });
    const startClear = q.startEditorButtons.getActionById("clear");
    const endClear = q.endEditorButtons.getActionById("clear");
    expect(startClear.visible).toBe(false);
    expect(endClear.visible).toBe(false);

    q.startInputValue = "11/05/2026";
    expect(startClear.visible, "a draft can be cleared").toBe(true);
    expect(endClear.visible).toBe(false);
    startClear.action();
    expect(q.startInputValue).toBe("mm/dd/yyyy");
    expect(q.calendar.rangeStart).toBeUndefined();

    q.value = ["2026-11-05", "2026-11-12"];
    expect(startClear.visible).toBe(true);
    expect(endClear.visible).toBe(true);
    endClear.action();
    expect(q.isEmpty(), "the value needs both fields").toBe(true);
    expect(q.startInputValue).toBe("11/05/2026");
    expect(q.endInputValue).toBe("mm/dd/yyyy");
    expect(endClear.visible).toBe(false);
    expect(startClear.visible).toBe(true);
  });

  test("A range clear button updates its input element", () => {
    const q = createQuestion({ range: true, defaultValue: ["2026-11-05", "2026-11-12"] });
    const root = document.createElement("div");
    root.appendChild(document.createElement("input"));
    root.appendChild(document.createElement("input"));
    q.afterRenderQuestionElement(root);
    const inputs = root.querySelectorAll("input");
    expect(inputs[1].value).toBe("11/12/2026");
    q.endEditorButtons.getActionById("clear").action();
    expect(inputs[0].value).toBe("11/05/2026");
    expect(inputs[1].value).toBe("mm/dd/yyyy");
    q.beforeDestroyQuestionElement(root);
  });

  test("Required: both fields are needed", () => {
    const q = createQuestion({ range: true, isRequired: true });
    expect(q.validate()).toBe(false);
    expect(errorTypes(q)).toEqual(["required"]);
    q.startInputValue = "11/05/2026";
    expect(q.validate()).toBe(false);
    expect(errorTypes(q)).toEqual(["required"]);
    q.endInputValue = "11/12/2026";
    expect(q.validate()).toBe(true);
  });

  test("An incomplete field replaces required with the incomplete pattern error", () => {
    const q = createQuestion({ range: true, isRequired: true });
    q.startInputValue = "11/05/2026";
    q.endInputValue = "11/1m/yyyy";
    expect(q.validate()).toBe(false);
    expect(errorTypes(q)).toEqual(["patternincompleteerror"]);

    const q2 = createQuestion({ range: true });
    q2.startInputValue = "1m/dd/yyyy";
    expect(q2.validate()).toBe(false);
    expect(errorTypes(q2)).toEqual(["patternincompleteerror"]);
  });

  test("start > end reports the range error", () => {
    const q = createQuestion({ range: true, isRequired: true });
    q.startInputValue = "11/20/2026";
    q.endInputValue = "11/12/2026";
    expect(q.validate()).toBe(false);
    expect(q.errors).toHaveLength(1);
    expect(q.errors[0].text).toBe("The start date cannot be later than the end date.");
    q.endInputValue = "11/25/2026";
    expect(q.validate()).toBe(true);
  });

  test("The range error text follows the locale", () => {
    const q = createQuestion({ range: true, rangeErrorText: { default: "Wrong range", de: "Falscher Bereich" } });
    q.startInputValue = "11/20/2026";
    q.endInputValue = "11/12/2026";
    q.validate();
    expect(q.errors[0].text).toBe("Wrong range");
    q.survey.locale = "de";
    expect(q.startInputValue, "the drafts are reformatted").toBe("20.11.2026");
    expect(q.endInputValue).toBe("12.11.2026");
    expect(q.errors[0].text).toBe("Falscher Bereich");
    q.survey.locale = "";
  });

  test("min and max errors for each field", () => {
    const q = createQuestion({ range: true, min: "2026-11-05", max: "2026-11-20" });
    q.startInputValue = "11/01/2026";
    q.endInputValue = "11/10/2026";
    expect(q.validate()).toBe(false);
    expect(q.errors.map(error => error.text)).toEqual(["The value should not be less than 11/05/2026"]);
    q.startInputValue = "11/06/2026";
    q.endInputValue = "11/25/2026";
    expect(q.validate()).toBe(false);
    expect(q.errors.map(error => error.text)).toEqual(["The value should not be greater than 11/20/2026"]);
    q.endInputValue = "11/20/2026";
    expect(q.validate()).toBe(true);
  });

  test("A value of a wrong type is reported in range mode", () => {
    const survey = new SurveyModel({ elements: [{ type: "datetimepicker", name: "q1", range: true }] });
    expect(survey.setData({ q1: ["2026-11-05", "2026-11-12"] })).toEqual([]);
    expect(survey.setData({ q1: "2026-11-05" }).map(issue => issue.type)).toEqual(["invalidValueType"]);
    expect(survey.setData({ q1: ["2026-11-05"] }).map(issue => issue.type)).toEqual(["invalidValueType"]);
    expect(survey.setData({ q1: ["2026-11-05", "bad"] }).map(issue => issue.type)).toEqual(["invalidValueType"]);
    expect(survey.setData({ q1: ["2026-11-12", "2026-11-05"] }).map(issue => issue.type)).toEqual(["invalidValueType"]);
  });

  test("Switching range converts the value", () => {
    const q = createQuestion();
    q.value = "2026-11-05";
    q.range = true;
    expect(q.value).toEqual(["2026-11-05", "2026-11-05"]);
    expect(q.startInputValue).toBe("11/05/2026");
    expect(q.endInputValue).toBe("11/05/2026");
    expect(q.calendar.range).toBe(true);
    q.value = ["2026-11-05", "2026-11-12"];
    q.range = false;
    expect(q.value).toBe("2026-11-05");
    expect(q.inputValue).toBe("11/05/2026");
    expect(q.calendar.range).toBe(false);
    expect(q.calendar.value.getTime()).toBe(d(2026, 11, 5).getTime());
    expect(q.getValueType()).toBe("string");
  });

  test("Switching range drops the drafts", () => {
    const q = createQuestion({ range: true });
    q.startInputValue = "11/05/2026";
    q.range = false;
    expect(q.isEmpty()).toBe(true);
    expect(q.inputValue).toBe("mm/dd/yyyy");
    q.range = true;
    expect(q.startInputValue).toBe("mm/dd/yyyy");
  });

  test("Range value from JSON and survey data", () => {
    const survey = new SurveyModel({ elements: [{ type: "datetimepicker", name: "q1", range: true, defaultValue: ["2026-01-02", "2026-01-09"] }] });
    const q = <QuestionDateTimePickerModel>survey.getQuestionByName("q1");
    expect(q.startInputValue).toBe("01/02/2026");
    expect(q.endInputValue).toBe("01/09/2026");
    survey.data = { q1: ["2026-02-02", "2026-02-09"] };
    expect(q.startInputValue).toBe("02/02/2026");
    expect(q.endInputValue).toBe("02/09/2026");
  });

  test("Render helpers", () => {
    const q = createQuestion();
    expect(q.getRootClass()).toBe("sd-datetimepicker");
    expect(q.getFieldClass()).toBe("sd-formbox sd-datetimepicker__field");
    expect(q.getEditorButtons(0)).toBe(q.editorButtons);
    expect(q.getControlClass()).toBe("sd-formbox__input sd-datetimepicker__input");
    expect(q.startInputId).toBe(q.inputId);
    expect(q.endInputId).toBe(q.inputId + "_end");
    expect(q.rangeSeparatorText).toBe("\u2013");
    expect(q.popupModel.cssClass).toBe("sv-datetimepicker-popup");
    expect(q.editorButtons.containerCss).toBe("sd-formbox__group");
    expect(q.editorButtons.getActionById("calendar").iconName).toBe("icon-calendar-24x24");
    expect(q.editorButtons.getActionById("clear").iconName).toBe("icon-cancel-24x24");
    expect(q.renderedInputValue, "an empty mask is not rendered").toBe("");
    expect(q.renderedPlaceholder, "the mask pattern is the default placeholder").toBe("mm/dd/yyyy");
    q.placeholder = "Pick a date";
    expect(q.renderedPlaceholder).toBe("Pick a date");
    q.inputValue = "11/0d/yyyy";
    expect(q.renderedInputValue).toBe("11/0d/yyyy");
    q.range = true;
    expect(q.getRootClass()).toBe("sd-datetimepicker sd-datetimepicker--range");
    expect(q.getFieldClass()).toBe("sd-formbox sd-datetimepicker__field");
    expect(q.renderedStartInputValue).toBe("");
    expect(q.renderedEndInputValue).toBe("");
    expect(q.renderedStartPlaceholder).toBe("mm/dd/yyyy");
    q.startInputValue = "11/05/2026";
    q.endPlaceholder = "To";
    expect(q.renderedStartInputValue).toBe("11/05/2026");
    expect(q.renderedEndPlaceholder).toBe("To");
    q.readOnly = true;
    expect(q.getRootClass()).toBe("sd-datetimepicker sd-datetimepicker--range");
    expect(q.getFieldClass()).toBe("sd-formbox sd-datetimepicker__field sd-formbox--readonly");
    expect(q.startEditorButtons.getActionById("calendar").enabled).toBe(false);
    expect(q.endEditorButtons.getActionById("calendar").enabled).toBe(false);
  });

  test("Single mode is not affected", () => {
    const q = createQuestion();
    q.inputValue = "11/05/2026";
    expect(q.value).toBe("2026-11-05");
    q.togglePopup();
    q.calendar.selectItem(findDay(q.calendar, d(2026, 11, 7)));
    expect(q.value).toBe("2026-11-07");
    expect(q.popupModel.isVisible).toBe(false);
  });
});
