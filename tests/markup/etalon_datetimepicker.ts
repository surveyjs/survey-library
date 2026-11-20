import { registerMarkupTests } from "./helper";

// The dates are in 1990, so the current date never gets into the rendered calendar.
function openCalendar(survey: any, zoom?: string): void {
  const question = survey.getQuestionByName("name");
  question.popupModel.isVisible = true;
  if (!!zoom) {
    question.calendar.zoom = zoom;
  }
}
function getCalendarElement(): HTMLElement {
  return document.querySelector(".sv-popup.sv-datetimepicker-popup .sv-popup__container") as HTMLElement;
}

registerMarkupTests(
  [
    {
      name: "Date-time picker: Single Mode",
      json: {
        elements: [{ name: "name", type: "datetimepicker", titleLocation: "hidden" }]
      },
      snapshot: "datetimepicker-single",
    },
    {
      name: "Date-time picker: Single Mode with value and placeholder",
      json: {
        elements: [{ name: "name", type: "datetimepicker", defaultValue: "1990-03-15", placeholder: "Pick a date", titleLocation: "hidden" }]
      },
      snapshot: "datetimepicker-single-value",
    },
    {
      name: "Date-time picker: Range Mode",
      json: {
        elements: [{ name: "name", type: "datetimepicker", range: true, defaultValue: ["1990-03-10", "1990-03-20"], startPlaceholder: "From", titleLocation: "hidden" }]
      },
      snapshot: "datetimepicker-range",
    },
    {
      name: "Date-time picker: Read-only",
      json: {
        elements: [{ name: "name", type: "datetimepicker", readOnly: true, defaultValue: "1990-03-15", titleLocation: "hidden" }]
      },
      snapshot: "datetimepicker-readonly",
    },
    {
      name: "Date-time picker: Calendar, day zoom",
      json: {
        elements: [{ name: "name", type: "datetimepicker", defaultValue: "1990-03-15", min: "1990-03-05", titleLocation: "hidden" }]
      },
      initSurvey: (survey) => openCalendar(survey),
      getElement: getCalendarElement,
      snapshot: "datetimepicker-calendar-day",
      removeIds: true
    },
    {
      name: "Date-time picker: Calendar, month zoom",
      json: {
        elements: [{ name: "name", type: "datetimepicker", defaultValue: "1990-03-15", max: "1990-10-31", titleLocation: "hidden" }]
      },
      initSurvey: (survey) => openCalendar(survey, "month"),
      getElement: getCalendarElement,
      snapshot: "datetimepicker-calendar-month",
      removeIds: true
    },
    {
      name: "Date-time picker: Calendar, year zoom",
      json: {
        elements: [{ name: "name", type: "datetimepicker", defaultValue: "1990-03-15", min: "1982-01-01", titleLocation: "hidden" }]
      },
      initSurvey: (survey) => openCalendar(survey, "year"),
      getElement: getCalendarElement,
      snapshot: "datetimepicker-calendar-year",
      removeIds: true
    },
    {
      name: "Date-time picker: Calendar, range",
      json: {
        elements: [{ name: "name", type: "datetimepicker", range: true, defaultValue: ["1990-03-10", "1990-03-20"], titleLocation: "hidden" }]
      },
      initSurvey: (survey) => openCalendar(survey),
      getElement: getCalendarElement,
      snapshot: "datetimepicker-calendar-range",
      removeIds: true
    },
    {
      name: "Date-time picker: Calendar, range of one day",
      json: {
        elements: [{ name: "name", type: "datetimepicker", range: true, defaultValue: ["1990-03-10", "1990-03-10"], titleLocation: "hidden" }]
      },
      initSurvey: (survey) => openCalendar(survey),
      getElement: getCalendarElement,
      snapshot: "datetimepicker-calendar-range-single",
      removeIds: true
    }
  ]
);
