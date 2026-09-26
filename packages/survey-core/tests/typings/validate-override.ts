// A compile-time fixture, not a unit test: vitest does not type-check and nothing else in the package
// type-checks the tests, so `npm run test:types` compiles this file on its own.
// It guards the source compatibility of validate(): an application subclass that overrides the
// positional signature must keep compiling. It also compiles the SurveyModel.setData() surface and
// proves, through the @ts-expect-error lines below, that validate() has no options form and that
// data verification has no page, panel or question entry point.
import { Question } from "../../src/question";
import { QuestionTextModel } from "../../src/question_text";
import { PanelModel } from "../../src/panel";
import { PageModel } from "../../src/page";
import { SurveyModel } from "../../src/survey";
import { IDataIssue, IDataVerificationOptions } from "../../src/base-interfaces";

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

// The keys of T without its index signature: the members the class really declares.
type DeclaredKeys<T> = keyof { [K in keyof T as string extends K ? never : number extends K ? never : K]: T[K] };

export function callValidateAndSetData(): Array<boolean> {
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

  const issues: Array<IDataIssue> = survey.setData({});
  const path: string = issues.length > 0 ? issues[0].path : "";
  const expressionResult: any = issues.length > 0 ? issues[0].expressionResult : undefined;
  res.push(path === "" && expressionResult === undefined);
  const options: IDataVerificationOptions = { reportUnknownProperties: false };
  const withOptions: Array<IDataIssue> = survey.setData({}, options);
  res.push(withOptions.length === 0);
  res.push(survey.setData({}, { reportInvalidValueTypes: false }).length === 0);
  res.push(survey.setData({}, { reportInvalidChoiceValues: false }).length === 0);
  res.push(survey.setData({}, { reportExpressionResultMismatches: true }).length === 0);
  res.push(survey.setData(null).length === 0);

  // @ts-expect-error an unknown option member is not accepted, so this fixture is really type-checked
  res.push(survey.setData({}, { unknownOption: true }).length === 0);
  // Question has an index signature, so question.verifyData() compiles whatever the class declares.
  // @ts-expect-error data verification has no question-level entry point: not a declared member
  const questionMember: DeclaredKeys<Question> = "verifyData";
  res.push(!!questionMember);
  // @ts-expect-error data verification has no panel-level entry point
  res.push(panel.verifyData().length === 0);
  // @ts-expect-error the options form of validate() is gone
  res.push(survey.validate({ fireCallback: false }));
  return res;
}
