import { SurveyModel } from "../survey";
import { Question } from "../question";

// Enter in a single-line box of a filter's editor - a chip's popup, "Save as...", the Filters dialog,
// a preset dialog - applies what the box is part of, as its main button does. Only a plain Enter: not
// with a modifier and not one an IME is composing with. A multi-line box (a preset's text, the AI
// description) is a comment question and keeps Enter for a new line.
export function isFilterApplyEnter(event: any): boolean {
  if (!event || (event.key !== "Enter" && event.keyCode !== 13)) return false;
  if (event.shiftKey || event.ctrlKey || event.altKey || event.metaKey) return false;
  return !event.isComposing && event.keyCode !== 229 && !event.defaultPrevented;
}
// Every text question of the survey, those added later too: an editor makes a value box anew for
// another operator, a preset dialog adds the fields' panels. A read-only box applies nothing.
export function setupApplyOnEnter(survey: SurveyModel, onEnter: () => void): void {
  const setup = (question: Question): void => {
    if (!question || question.getType() !== "text") return;
    (<any>question).onKeyDownPreprocess = (event: any): void => {
      if (!isFilterApplyEnter(event) || question.isReadOnly || survey.isDisplayMode) return;
      // The box writes its text on blur or on keyup: on keydown the value may not have it yet.
      const text = !!event.target ? event.target.value : undefined;
      if (typeof text === "string" && (<any>question).inputValue !== text) {
        (<any>question).inputValue = text;
      }
      event.preventDefault();
      // After the key's own handler: applying closes the popup or the dialog and disposes this
      // survey, and the handler still reads the question's survey once this returns.
      setTimeout((): void => {
        if (!survey.isDisposed) onEnter();
      }, 0);
    };
  };
  survey.getAllQuestions(false, false, true).forEach(setup);
  survey.onQuestionAdded.add((_: SurveyModel, options: any): void => { setup(options.question); });
}
