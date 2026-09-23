// A compile-time fixture, not a unit test: vitest does not type-check and nothing else in the package
// type-checks the tests, so `npm run test:types` compiles this file on its own.
// It guards the source compatibility of validate(): an application subclass that overrides the
// positional signature must keep compiling. It also compiles the verifyData() surface and proves,
// through the @ts-expect-error lines below, that validate() has no options form.
import { Question } from "../../src/question";
import { QuestionTextModel } from "../../src/question_text";
import { PanelModel } from "../../src/panel";
import { PageModel } from "../../src/page";
import { SurveyModel } from "../../src/survey";
import { IDataIssue } from "../../src/base-interfaces";

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

export function callValidateAndVerifyData(): Array<boolean> {
  const res: Array<boolean> = [];
  const survey = new SurveyModel();
  res.push(survey.validate(false, true));
  res.push(survey.validate(true, false, (hasErrors: boolean): void => { res.push(hasErrors); }, true));

  const page = survey.pages[0];
  res.push(page.validate(true, false));

  const panel = new PanelModel("p");
  res.push(panel.validate(false));

  const question = new QuestionTextModel("q");
  res.push(question.validate(true, false, false, undefined, false));
  res.push(question.isValueCorrect({ unknownProperties: true }));

  res.push(new QuestionWithShortOverride("q").validate(true));
  res.push(new PanelWithOverride("p").validate(true, false));
  res.push(new PageWithShortOverride("page").validate(false));
  res.push(new SurveyWithOverride().validate(true, false));

  const issues: Array<IDataIssue> = survey.verifyData();
  const segments: Array<string | number> = issues.length > 0 ? issues[0].segments : [];
  res.push(segments.length === 0);
  res.push(survey.verifyData({ valueTypes: true, choiceValues: true, unknownProperties: true }).length === 0);
  res.push(survey.verifyData({ data: {}, changedValues: true }).length === 0);
  res.push(page.verifyData({ unknownProperties: false }).length === 0);
  res.push(panel.verifyData().length === 0);
  res.push(question.verifyData({ choiceValues: false }).length === 0);

  // @ts-expect-error an unknown option member is not accepted, so this fixture is really type-checked
  res.push(survey.verifyData({ unknownOption: true }).length === 0);
  // @ts-expect-error data is a survey-level option only
  res.push(question.verifyData({ data: {} }).length === 0);
  // @ts-expect-error changedValues is a survey-level option only
  res.push(panel.verifyData({ changedValues: true }).length === 0);
  // @ts-expect-error the options form of validate() is gone
  res.push(survey.validate({ fireCallback: false }));
  return res;
}
