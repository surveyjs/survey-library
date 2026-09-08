import { Question, QuestionValueType } from "./question";
import { ISelectQuestion } from "./question_baseselect";
import { ItemValue } from "./itemvalue";
import { QuestionTextBase } from "./question_textbase";
import { QuestionTextModel } from "./question_text";
import { QuestionSliderModel } from "./question_slider";
import { QuestionCheckboxModel } from "./question_checkbox";
import { QuestionRatingModel } from "./question_rating";
import { QuestionMultipleTextModel } from "./question_multipletext";
import { QuestionCustomModel, QuestionCompositeModel } from "./question_custom";

// One plain record per question: what a consumer that cannot render the model - a chat or voice
// front end, an AI agent, the tester, a JSON -> text generator - needs in order to ask for a value
// and to accept one back. Nothing is derived here that the model can answer: the value type, the
// items to offer, the role of each item and whether a question can be answered at all are asked of
// the question (Question.getValueType(), isSelectQuestion(), hasPlainInput, ISelectQuestion), and
// the questions this layer reaches for a property of their own are named by their class, never by
// a table of type strings. Everything is read through the live model, so visibleIf, enableIf,
// requiredIf, choicesVisibleIf, the locale and the text piping are already applied.
//
// Keys are emitted only when they carry information: no "description: undefined", no empty arrays,
// no "disabled: false". A consumer that sees a key can act on it.

export interface IQuestionChoiceDescription {
  value: any;
  // only when it differs from String(value)
  text?: string;
  // choicesEnableIf said no
  disabled?: true;
  // the "other" item: a free-text comment is expected with it
  other?: true;
  // selecting this item clears every other selection
  none?: true;
}

export interface IQuestionConstraints {
  // numbers, or ISO date strings for the date input types
  min?: any;
  max?: any;
  minLength?: number;
  maxLength?: number;
  minCount?: number;
  maxCount?: number;
  step?: number;
  regex?: string;
  format?: "email";
  mask?: { type: string, pattern?: string, min?: any, max?: any };
  // an ExpressionValidator, opaque to the consumer
  expression?: string;
  allowDigits?: false;
}

export interface IQuestionDescription {
  name: string;
  // the question's getType(); a single custom component reports the type of its content question
  type: string;
  title: string;
  description?: string;
  required: boolean;
  valueType: QuestionValueType;
  // isReadOnly with a non-empty enableIf: answerable again once the expression turns true
  disabled?: true;
  // no plain input: file, signaturepad, imagepicker, imagemap, html, image, expression
  unsupported?: true;
  choices?: Array<IQuestionChoiceDescription>;
  // choicesByUrl not loaded / choicesLazyLoadEnabled: the set cannot be enumerated
  choicesUnknown?: true;
  inputType?: string;
  constraints?: IQuestionConstraints;
  rateValues?: Array<IQuestionChoiceDescription>;
  minRateDescription?: string;
  maxRateDescription?: string;
  // showCommentArea / other: a name + settings.commentSuffix text is accepted as well
  comment?: { required: boolean };
  // multipletext items, composite content
  items?: Array<IQuestionDescription>;
}

export interface IQuestionDescriptionOptions {
  // include questions the consumer cannot answer (readOnly, non-input); default false -> undefined
  includeReadOnly?: boolean;
}

function isEmptyValue(val: any): boolean {
  return val === undefined || val === null || val === "";
}

function describeItem(question: ISelectQuestion, item: ItemValue): IQuestionChoiceDescription {
  const res: IQuestionChoiceDescription = { value: item.value };
  const text = item.locText.textOrHtml;
  if (!isEmptyValue(text) && text !== String(item.value)) {
    res.text = text;
  }
  if (!item.isEnabled) res.disabled = true;
  if (question.isOtherItem(item)) res.other = true;
  if (question.isNoneItem(item)) res.none = true;
  return res;
}

function toPositiveNumber(val: any): number | undefined {
  const num = typeof val === "string" && val !== "" ? Number(val) : val;
  if (typeof num !== "number" || isNaN(num) || num <= 0) return undefined;
  return num;
}

function setNumber(constraints: any, key: string, val: any): void {
  if (constraints[key] !== undefined) return;
  const num = toPositiveNumber(val);
  if (num !== undefined) constraints[key] = num;
}

function isStricter(val: any, current: any, isMax: boolean): boolean {
  const toComparable = (v: any) => typeof v === "string" && v !== "" && !isNaN(Number(v)) ? Number(v) : v;
  const a = toComparable(val);
  const b = toComparable(current);
  if (typeof a !== typeof b) return false;
  return isMax ? a < b : a > b;
}

// min, max and maxLength may be declared twice - by the question and by a validator. What a
// respondent has to satisfy is the stricter of the two; every other key is written once.
function setBound(constraints: any, key: string, val: any, isMax: boolean): void {
  if (isEmptyValue(val)) return;
  if (constraints[key] === undefined || isStricter(val, constraints[key], isMax)) {
    constraints[key] = val;
  }
}

function setMaxLength(constraints: IQuestionConstraints, val: any): void {
  const num = toPositiveNumber(val);
  if (num === undefined) return;
  if (constraints.maxLength === undefined || num < constraints.maxLength) {
    constraints.maxLength = num;
  }
}

function addMaskConstraint(constraints: IQuestionConstraints, question: QuestionTextModel): void {
  const maskType = question.maskType;
  if (!maskType || maskType === "none") return;
  const maskSettings: any = question.maskSettings;
  if (!maskSettings) return;
  const mask: { type: string, pattern?: string, min?: any, max?: any } = { type: maskType };
  // A datetime mask resolves its pattern from patternPreset when the JSON authored none.
  const pattern = maskSettings.activePattern || maskSettings.pattern;
  if (!isEmptyValue(pattern)) mask.pattern = pattern;
  if (!isEmptyValue(maskSettings.min)) mask.min = maskSettings.min;
  if (!isEmptyValue(maskSettings.max)) mask.max = maskSettings.max;
  constraints.mask = mask;
}

// A validator's custom text is not described: it surfaces as the error text when the validator
// fires, and a consumer that gets the bound can say it in its own words.
function addValidatorConstraints(constraints: IQuestionConstraints, question: Question): void {
  (question.validators || []).forEach((validator: any) => {
    switch(validator.getType()) {
      case "numericvalidator":
        if (!isEmptyValue(validator.minValue)) setBound(constraints, "min", validator.minValue, false);
        if (!isEmptyValue(validator.maxValue)) setBound(constraints, "max", validator.maxValue, true);
        break;
      case "textvalidator":
        setNumber(constraints, "minLength", validator.minLength);
        setMaxLength(constraints, validator.maxLength);
        if (validator.allowDigits === false) constraints.allowDigits = false;
        break;
      case "answercountvalidator":
        setNumber(constraints, "minCount", validator.minCount);
        setNumber(constraints, "maxCount", validator.maxCount);
        break;
      case "regexvalidator":
        if (!isEmptyValue(validator.regex) && constraints.regex === undefined) {
          constraints.regex = validator.regex;
        }
        break;
      case "emailvalidator":
        constraints.format = "email";
        break;
      case "expressionvalidator":
        if (!isEmptyValue(validator.expression) && constraints.expression === undefined) {
          constraints.expression = validator.expression;
        }
        break;
    }
  });
}

function getConstraints(question: Question): IQuestionConstraints | undefined {
  const res: IQuestionConstraints = {};
  if (question instanceof QuestionTextModel && question.isMinMaxType) {
    // renderedMin/renderedMax, never the raw min/max: an "=expression" written into min lands in
    // minValueExpression and only the rendered pair holds its result. The bound is reported only
    // when the question declares one - for a date input the rendered pair otherwise falls back to
    // settings.minDate/settings.maxDate, which the question never asked for.
    if (!isEmptyValue(question.min) || !!question.minValueExpression) {
      setBound(res, "min", question.renderedMin, false);
    }
    if (!isEmptyValue(question.max) || !!question.maxValueExpression) {
      setBound(res, "max", question.renderedMax, true);
    }
  }
  if (question instanceof QuestionTextBase) {
    // getMaxLength() honours survey.maxTextLength and returns null where the input type ignores it.
    setMaxLength(res, question.getMaxLength());
  }
  if (question instanceof QuestionTextModel) {
    setNumber(res, "step", question.step);
    addMaskConstraint(res, question);
  }
  if (question instanceof QuestionSliderModel) {
    setBound(res, "min", question.min, false);
    setBound(res, "max", question.max, true);
    setNumber(res, "step", question.step);
  }
  if (question instanceof QuestionCheckboxModel) {
    setNumber(res, "minCount", question.minSelectedChoices);
    setNumber(res, "maxCount", question.maxSelectedChoices);
  }
  addValidatorConstraints(res, question);
  return Object.keys(res).length > 0 ? res : undefined;
}

function describeNested(questions: Array<Question>, options: IQuestionDescriptionOptions): Array<IQuestionDescription> {
  const res: Array<IQuestionDescription> = [];
  questions.forEach(question => {
    if (!question || !question.isVisible) return;
    const item = describeQuestion(question, options);
    if (!!item) res.push(item);
  });
  return res;
}

export function describeQuestion(question: Question, options?: IQuestionDescriptionOptions): IQuestionDescription | undefined {
  if (!question) return undefined;
  const includeReadOnly = !!options && options.includeReadOnly === true;
  let disabled = false;
  if (question.isReadOnly) {
    // enableIf writes into readOnly (question.ts), so after evaluation the two are one flag. A
    // question that carries the expression can become answerable again and is described as
    // disabled; one that does not is read-only for good and nobody can answer it.
    if (!includeReadOnly && !question.enableIf) return undefined;
    disabled = true;
  }
  // A single custom component is described through the question it wraps - that is where the items
  // and the constraints live - under the name and the title of the component. A composite keeps its
  // own identity and lists its content questions.
  const composite = question instanceof QuestionCompositeModel ? question : undefined;
  const target: Question = question instanceof QuestionCustomModel && !!question.contentQuestion ?
    question.contentQuestion : question;
  const type = !!composite ? "composite" : target.getType();

  const res: any = {};
  res.name = question.name;
  res.type = type;
  res.title = question.processedTitle || question.name;
  const description = question.locDescription.textOrHtml;
  if (!isEmptyValue(description)) res.description = description;
  res.required = question.isRequired;
  res.valueType = target.getValueType();
  if (disabled) res.disabled = true;

  if (!target.hasPlainInput) {
    // Still named, typed and titled, so a consumer can say "there is a signature field here".
    res.unsupported = true;
    return res;
  }

  let items: Array<IQuestionChoiceDescription> = [];
  if (target.isSelectQuestion()) {
    const select = <ISelectQuestion><any>target;
    if (select.hasUnknownChoices) {
      res.choicesUnknown = true;
    } else {
      items = select.getValueChoices().map(item => describeItem(select, item));
      // A Rating reports its items under their own key; every other pick-one question uses choices.
      if (items.length > 0 && !(target instanceof QuestionRatingModel)) res.choices = items;
    }
  }
  if (target instanceof QuestionTextModel && target.inputType !== "text") {
    res.inputType = target.inputType;
  }
  const constraints = getConstraints(target);
  if (!!constraints) res.constraints = constraints;
  if (target instanceof QuestionRatingModel) {
    // The generated items already reflect rateMin/rateMax/rateStep when rateValues is empty.
    if (items.length > 0) res.rateValues = items;
    if (!isEmptyValue(target.minRateDescription)) {
      res.minRateDescription = target.locMinRateDescription.textOrHtml;
    }
    if (!isEmptyValue(target.maxRateDescription)) {
      res.maxRateDescription = target.locMaxRateDescription.textOrHtml;
    }
  }
  // requireUpdateCommentValue is the question's own answer to "a comment belongs to this value".
  // The model requires the text only for the "other" item (OtherEmptyError); a comment area on its
  // own is optional.
  if (target.requireUpdateCommentValue) {
    res.comment = { required: items.some(item => item.other === true) };
  }
  if (!!composite) {
    const nested = describeNested(composite.contentPanel.questions, options || {});
    if (nested.length > 0) res.items = nested;
  } else if (target instanceof QuestionMultipleTextModel) {
    // item.editor is a real QuestionTextModel, so the text rules above apply to it unchanged.
    const nested = describeNested(target.items.map(item => item.editor), options || {});
    if (nested.length > 0) res.items = nested;
  }
  return res;
}
