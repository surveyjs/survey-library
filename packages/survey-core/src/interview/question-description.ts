import {
  QuestionCheckboxModel, QuestionCompositeModel, QuestionCustomModel, QuestionMatrixDynamicModel,
  QuestionMultipleTextModel, QuestionPanelDynamicModel, QuestionRatingModel, QuestionSliderModel,
  QuestionTextBase, QuestionTextModel, settings,
} from "survey-core";
import type { ISelectQuestion, ItemValue, Question, QuestionValueType } from "survey-core";

// One plain record per question: what a consumer that cannot render the model - a chat or voice
// front end, an AI agent, a JSON -> text generator - needs in order to ask for a value
// and to accept one back. Nothing is derived here that the model can answer: the value type, the
// items to offer, the role of each item and whether a question can be answered at all are asked of
// the question (Question.getValueType(), isSelectQuestion(), hasPlainInput, ISelectQuestion), and
// the questions this layer reaches for a property of their own are named by their class, never by
// a table of type strings. Everything is read through the live model, so visibleIf, enableIf,
// requiredIf, choicesVisibleIf, the locale and the text piping are already applied.
//
// Keys are emitted only when they carry information: no "description: undefined", no empty arrays,
// no "disabled: false". A consumer that sees a key can act on it. One empty array does carry it:
// "choices: []" says nothing can be chosen now - an empty choicesFromQuestion source, an empty list.

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

// An input mask as it resolved for the question, the regional format and maskSettings applied. The
// stored value is a number (numeric, currency), an ISO string in valueFormat (datetime), or - with
// saveMaskedValue - the text the input shows.
export interface IQuestionMask {
  type: string;
  // the pattern mask's pattern, or the datetime mask's display pattern ("dd.mm.yyyy")
  pattern?: string;
  // datetime: the ISO shape stored without saveMaskedValue ("YYYY-MM-DD")
  valueFormat?: string;
  decimalSeparator?: string;
  thousandsSeparator?: string;
  precision?: number;
  allowNegativeValues?: false;
  currencySymbol?: string;
  currencyPattern?: string;
  // numeric, currency: 1234.5 as the input shows it ("1'234.5 CHF")
  example?: string;
  min?: any;
  max?: any;
  saveMaskedValue?: true;
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
  // the regex validator's caseInsensitive
  regexFlags?: "i";
  format?: "email";
  mask?: IQuestionMask;
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
  // read-only now, and an enableIf - its own, or one of a panel, a page or a container it is in -
  // makes it answerable again once the expression turns true
  disabled?: true;
  // no plain input: file, signaturepad, imagepicker, imagemap, html, image, expression
  unsupported?: true;
  choices?: Array<IQuestionChoiceDescription>;
  // choicesByUrl not loaded, waiting for its parameters or failed / choicesLazyLoadEnabled: the set
  // cannot be enumerated
  choicesUnknown?: true;
  // the model's text for a choicesByUrl request that failed, next to choicesUnknown
  choicesError?: string;
  inputType?: string;
  constraints?: IQuestionConstraints;
  rateValues?: Array<IQuestionChoiceDescription>;
  minRateDescription?: string;
  maxRateDescription?: string;
  // showCommentArea / other: a name + settings.commentSuffix text is accepted as well. "required"
  // means required when the "other" item is selected, never required on its own.
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

// A count or a length may be declared twice too - by the question and by a validator - and the
// stricter one is what a respondent has to satisfy: the largest minimum, the smallest maximum.
function setCount(constraints: any, key: string, val: any, isMax: boolean): void {
  const num = toPositiveNumber(val);
  if (num === undefined) return;
  const current = constraints[key];
  if (current === undefined || (isMax ? num < current : num > current)) constraints[key] = num;
}

// Of two steps neither is stricter, so the first one declared - the question's own - is kept.
function setStep(constraints: IQuestionConstraints, val: any): void {
  if (constraints.step !== undefined) return;
  const num = toPositiveNumber(val);
  if (num !== undefined) constraints.step = num;
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

// What the mask resolved - survey.locale, then survey.regionalFormat, then the question's own
// maskSettings - read off the mask's own getters. Never getFormatValue() and never
// survey.regionalFormat: both skip the maskSettings overrides. A mask the input type ignores (any
// inputType but text and tel) is not described: the input is the browser's own.
function addMaskConstraint(constraints: IQuestionConstraints, question: QuestionTextModel): void {
  if (question.maskTypeIsEmpty) return;
  const maskSettings: any = question.maskSettings;
  if (!maskSettings) return;
  const maskType = question.maskType;
  const mask: IQuestionMask = { type: maskType };
  // A datetime mask resolves its pattern from patternPreset when the JSON authored none.
  const pattern = maskType === "datetime" ? maskSettings.activePattern : maskSettings.pattern;
  if (!isEmptyValue(pattern)) mask.pattern = pattern;
  if (maskType === "datetime") {
    const valueFormat = getMaskValueFormat(maskSettings);
    if (!!valueFormat) mask.valueFormat = valueFormat;
  }
  if (maskType === "numeric" || maskType === "currency") {
    mask.decimalSeparator = maskSettings.decimalSeparator;
    mask.thousandsSeparator = maskSettings.thousandsSeparator;
    mask.precision = maskSettings.precision;
    if (maskSettings.allowNegativeValues === false) mask.allowNegativeValues = false;
  }
  if (maskType === "currency") {
    if (!isEmptyValue(maskSettings.currencySymbol)) mask.currencySymbol = maskSettings.currencySymbol;
    if (!isEmptyValue(maskSettings.activeCurrencyPattern)) mask.currencyPattern = maskSettings.activeCurrencyPattern;
  }
  if (maskType === "numeric" || maskType === "currency") {
    // The input's own rendering of one number, so a reader sees the separators and the symbol in place.
    // None when the number is outside the mask's bounds: the mask renders nothing then.
    const example = maskSettings.getMaskedValue(MASK_EXAMPLE_NUMBER);
    if (!isEmptyValue(example)) mask.example = example;
  }
  if (!isEmptyValue(maskSettings.min)) mask.min = maskSettings.min;
  if (!isEmptyValue(maskSettings.max)) mask.max = maskSettings.max;
  if (maskSettings.saveMaskedValue === true) mask.saveMaskedValue = true;
  constraints.mask = mask;
}

const MASK_EXAMPLE_NUMBER = 1234.5;

// The ISO shapes a datetime mask can store, longest first, each with a sample.
const MASK_VALUE_FORMATS: Array<{ format: string, sample: string }> = [
  { format: "YYYY-MM-DDTHH:mm:ss", sample: "2024-05-01T10:30:15" },
  { format: "YYYY-MM-DDTHH:mm", sample: "2024-05-01T10:30" },
  { format: "YYYY-MM-DD", sample: "2024-05-01" },
  { format: "YYYY-MM", sample: "2024-05" },
  { format: "YYYY", sample: "2024" },
  { format: "HH:mm:ss", sample: "10:30:15" },
  { format: "HH:mm", sample: "10:30" },
];

// The shape a datetime mask stores without saveMaskedValue: the first one whose sample comes back
// unchanged through the mask, so the mask itself is the parser. Undefined for a pattern that stores
// nothing the mask reads back ("mm/dd", "HH"): no value survives it.
export function getMaskValueFormat(mask: any): string | undefined {
  for (let i = 0; i < MASK_VALUE_FORMATS.length; i++) {
    const sample = MASK_VALUE_FORMATS[i].sample;
    if (mask.getUnmaskedValue(mask.getMaskedValue(sample)) === sample) return MASK_VALUE_FORMATS[i].format;
  }
  return undefined;
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
        setCount(constraints, "minLength", validator.minLength, false);
        setMaxLength(constraints, validator.maxLength);
        if (validator.allowDigits === false) constraints.allowDigits = false;
        break;
      case "answercountvalidator":
        setCount(constraints, "minCount", validator.minCount, false);
        setCount(constraints, "maxCount", validator.maxCount, true);
        break;
      case "regexvalidator":
        if (!isEmptyValue(validator.regex) && constraints.regex === undefined) {
          constraints.regex = validator.regex;
          if (validator.caseInsensitive === true) constraints.regexFlags = "i";
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
    setStep(res, question.step);
    addMaskConstraint(res, question);
  }
  if (question instanceof QuestionSliderModel) {
    setBound(res, "min", question.min, false);
    setBound(res, "max", question.max, true);
    setStep(res, question.step);
  }
  if (question instanceof QuestionCheckboxModel) {
    setCount(res, "minCount", question.minSelectedChoices, false);
    setCount(res, "maxCount", question.maxSelectedChoices, true);
  }
  // How many entries a dynamic container takes. A ceiling nobody set is not a constraint: both
  // maximums fall back to a global default - settings.panel.maxPanelCount, settings.matrix.maxRowCount -
  // that the survey never asked for, and a minimum of zero says nothing either.
  if (question instanceof QuestionPanelDynamicModel) {
    setCount(res, "minCount", question.minPanelCount, false);
    if (question.maxPanelCount < settings.panel.maxPanelCount) {
      setCount(res, "maxCount", question.maxPanelCount, true);
    }
  }
  if (question instanceof QuestionMatrixDynamicModel) {
    setCount(res, "minCount", question.minRowCount, false);
    if (question.maxRowCount < settings.matrix.maxRowCount) {
      setCount(res, "maxCount", question.maxRowCount, true);
    }
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

// A choicesByUrl whose result cannot be used once it stopped loading: a request that failed, or a
// URL that still waits for the values its {placeholders} name. The model then neither lists choices
// from it nor clears a value against them (canClearIncorrectValues), so the set is unknown, not
// empty. undefined when the question has no usable-or-not URL to speak of; "" when the result is
// unusable with no error to name; the model's text when the request failed.
function getChoicesByUrlError(question: Question): string | undefined {
  const byUrl: any = (<any>question).choicesByUrl;
  if (!byUrl || byUrl.isEmpty !== false || byUrl.canUseResult) return undefined;
  return !!byUrl.error ? byUrl.error.getText() : "";
}

// enableIf writes into readOnly (question.ts, panel.ts), so after evaluation the two are one flag,
// and a question is read-only when it or anything it is in - a panel, a page, the container
// question of a dynamic panel, a matrix or a composite - is. It can become answerable again when
// every element of that chain that is read-only now carries an enableIf: the expression may turn
// true. One read-only element without an expression - a readOnly property, a read-only container -
// or display mode keeps it read-only for good, whatever the other expressions do.
function canBecomeEnabled(question: Question): boolean {
  if (!!question.survey && question.survey.isDisplayMode) return false;
  const chain: Array<any> = [];
  const pending: Array<any> = [question];
  while(pending.length > 0) {
    const element = pending.pop();
    if (!element || chain.indexOf(element) > -1) continue;
    chain.push(element);
    pending.push(element.parent, element.parentQuestion);
  }
  // A container copies its own read-only state onto the panels it holds outside the page tree - an
  // entry of a dynamic panel, a composite's content panel, a detail panel - so their readOnly is
  // not a source of its own: the container question in the chain is.
  const isContainerPanel = (element: any): boolean => element.isPanel === true && !element.parent;
  const readOnly = chain.filter(element => element.readOnly === true && !isContainerPanel(element));
  // Read-only for a reason no element states - a matrix row's own rule (readOnlyCallback) - is
  // nothing an enableIf of the chain controls.
  if (readOnly.length === 0) return false;
  return readOnly.every(element => !!element.enableIf);
}

export function describeQuestion(question: Question, options?: IQuestionDescriptionOptions): IQuestionDescription | undefined {
  if (!question) return undefined;
  const includeReadOnly = !!options && options.includeReadOnly === true;
  let disabled = false;
  if (question.isReadOnly) {
    if (!includeReadOnly && !canBecomeEnabled(question)) return undefined;
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
  // processedTitle falls back to the name itself when the question has no title.
  res.title = question.processedTitle;
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
    const byUrlError = getChoicesByUrlError(target);
    if (select.hasUnknownChoices || byUrlError !== undefined) {
      res.choicesUnknown = true;
      if (!!byUrlError) res.choicesError = byUrlError;
    } else {
      items = select.getValueChoices().map(item => describeItem(select, item));
      // A Rating reports its items under their own key; every other pick-one question uses choices,
      // and an empty list says that nothing can be chosen now - the value would be cleared.
      if (!(target instanceof QuestionRatingModel)) res.choices = items;
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
  // The model requires the text only for the "other" item (OtherEmptyError), so "required: true"
  // means required when "other" is selected, and never on its own. A comment area alone is optional.
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
