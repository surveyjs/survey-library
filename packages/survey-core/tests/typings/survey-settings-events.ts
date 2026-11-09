// A compile-time fixture, not a unit test: vitest does not type-check and nothing else in the package
// type-checks the tests, so `npm run test:types` compiles this file on its own.
// It guards the type of the constructor's `events` option: the names come from SurveyModel's events,
// and each handler is typed from its event, so a misspelled name or a wrong options type does not compile.
import { SurveyModel } from "../../src/survey";
import { ISurveyOptions, SurveyEventHandlers } from "../../src/survey-settings";
import { CompleteEvent, QuestionCreatedEvent, ValueChangedEvent } from "../../src/survey-events-api";

function saveResults(sender: SurveyModel, options: CompleteEvent): void { }
function notify(sender: SurveyModel, options: CompleteEvent): void { }

export const survey = new SurveyModel({}, {
  comparator: { caseSensitive: true },
  events: {
    onQuestionCreated: (sender, options) => { options.question.name.toUpperCase(); },
    onComplete: [saveResults, notify],
    onCompleting: (sender, options) => { options.allow = false; },
    onValueChanged: (sender: SurveyModel, options: ValueChangedEvent) => { sender.setVariable(options.name, options.value); },
    onPropertyChanged: (sender, options) => { },
    onVisibleChanged: (sender, options) => { },
    onStarted: undefined
  }
});

export const options: ISurveyOptions = {
  events: {
    // @ts-expect-error: a misspelled event name
    onCompleted: saveResults
  }
};
export const wrongOptionsType: SurveyEventHandlers = {
  // @ts-expect-error: the handler's options type is not the event's
  onComplete: (sender: SurveyModel, options: QuestionCreatedEvent) => { }
};
export const wrongOptionsMember: SurveyEventHandlers = {
  // @ts-expect-error: CompleteEvent has no `question`
  onComplete: (sender, options) => options.question
};
export const wrongArrayItem: SurveyEventHandlers = {
  // @ts-expect-error: an array item with a wrong options type
  onComplete: [saveResults, (sender: SurveyModel, options: QuestionCreatedEvent) => { }]
};
export const notAFunction: SurveyEventHandlers = {
  // @ts-expect-error: a value that is not a handler
  onComplete: "save"
};
export const protectedEvent: SurveyEventHandlers = {
  // @ts-expect-error: a protected event is not a key
  _onElementRerendered: () => { }
};
export const notAnEvent: SurveyEventHandlers = {
  // @ts-expect-error: a property that is not an event
  title: () => { }
};
