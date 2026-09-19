// A compile-time fixture, not a unit test: vitest does not type-check and nothing else in the package
// type-checks the tests, so `npm run test:types` compiles this file on its own.
// It guards the source compatibility of validate(): an application subclass that overrides the
// positional signature must keep compiling. Overload declarations break exactly these subclasses
// with TS2416, a single signature whose first parameter is a union does not.
import { Question } from "../../src/question";
import { QuestionTextModel } from "../../src/question_text";
import { PanelModel } from "../../src/panel";
import { PageModel } from "../../src/page";
import { SurveyModel } from "../../src/survey";

// The full positional signature.
export class QuestionWithFullOverride extends QuestionTextModel {
  public validate(fireCallback: boolean = true, focusFirstError: boolean = false, isOnValueChanged: boolean = false,
    callbackResult?: (res: boolean, question: Question) => void, isOnValueChanging?: boolean): boolean {
    return super.validate(fireCallback, focusFirstError, isOnValueChanged, callbackResult, isOnValueChanging);
  }
}
// A shorter signature, the way application code often writes it.
export class QuestionWithShortOverride extends QuestionTextModel {
  public validate(fireCallback: boolean = true): boolean {
    return super.validate(fireCallback);
  }
}
export class PanelWithOverride extends PanelModel {
  public validate(fireCallback: boolean = true, focusFirstError: boolean = false,
    callbackResult?: (res: boolean, question: Question) => void): boolean {
    return super.validate(fireCallback, focusFirstError, callbackResult);
  }
}
export class PageWithShortOverride extends PageModel {
  public validate(fireCallback: boolean = true): boolean {
    return super.validate(fireCallback, true);
  }
}
export class SurveyWithOverride extends SurveyModel {
  public validate(fireCallback: boolean = true, focusFirstError: boolean = false,
    onAsyncValidation?: (hasErrors: boolean) => void, changeCurrentPage?: boolean): boolean {
    return super.validate(fireCallback, focusFirstError, onAsyncValidation, changeCurrentPage);
  }
}

export function callBothForms(): Array<boolean> {
  const res: Array<boolean> = [];
  const survey = new SurveyModel();
  res.push(survey.validate(false, true));
  res.push(survey.validate({ fireCallback: false, focusFirstError: true, changeCurrentPage: true, valueChecks: { unknownKeys: true } }));
  res.push(survey.validate({
    onAsyncCompleted: (isValid: boolean, question: Question): void => {
      res.push(isValid && !!question);
    }
  }));
  survey.validationValueChecks = { valueType: true, choices: true, unknownKeys: false };

  const page = survey.pages[0];
  res.push(page.validate(true, false));
  res.push(page.validate({ valueChecks: { choices: false } }));

  const panel = new PanelModel("p");
  res.push(panel.validate(false));
  res.push(panel.validate({ fireCallback: false }));

  const question = new QuestionTextModel("q");
  res.push(question.validate(true, false, false, undefined, false));
  res.push(question.validate({ fireCallback: true, valueChecks: { valueType: true } }));
  res.push(question.isValueCorrect({ unknownKeys: true }));

  res.push(new QuestionWithShortOverride("q").validate(true));
  res.push(new PanelWithOverride("p").validate(true, false));
  res.push(new PageWithShortOverride("page").validate(false));
  res.push(new SurveyWithOverride().validate(true, false));

  // @ts-expect-error an unknown option member is not accepted, so this fixture is really type-checked
  res.push(survey.validate({ unknownOption: true }));
  return res;
}
