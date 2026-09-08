import { Helpers, ISurveyDateProvider } from "./helpers";
import { ItemValue } from "./itemvalue";
import { Serializer } from "./jsonobject";
import { Question } from "./question";
import { QuestionSelectBase } from "./question_baseselect";
import { SurveyModel } from "./survey";
import { getLocaleString } from "./surveyStrings";

// A host application injects runtime values into a survey through setVariable() - a customer tier, a
// role, a number of employees - and the survey reads them in visibleIf, defaultValueExpression and
// calculated values. Those names appear nowhere in the survey JSON, so the tester and the linter
// cannot tell a legitimate host variable from a typo. This module carries what both of them need:
// the variable definition - one ordinary survey JSON whose questions are the variables - and the
// named presets of values for it. A definition question's data key (valueName when set, otherwise
// name) is the variable name; its type, choices and validators are everything that is known about
// the variable. There is no second schema.
export interface ISurveyVariablePreset {
  name: string;
  description?: string;
  variables: { [name: string]: any };
}
export interface ISurveyVariablePresets {
  definition?: any;
  presets?: Array<ISurveyVariablePreset>;
}
export interface ISurveyVariableError {
  // the data key - the variable name as the host sets it
  variable: string;
  // the definition question's name; differs from "variable" when valueName is set
  question: string;
  // the error texts as the survey renders them
  errors: Array<string>;
}
export interface ISurveyVariableValidationResult {
  // keys of the checked object that are no variable of the definition, in input order
  unknownVariables: Array<string>;
  errors: Array<ISurveyVariableError>;
  isValid: boolean;
}

// The runtime companion of the container above: it builds the definition model, derives the variable
// names from it and validates a set of values against it. It holds no notion of a "current preset",
// applies nothing to a survey and merges nothing - how a preset is chosen and what it is applied to
// is the consumer's business. It is not a Base: nothing here is serialized, reactive or eventful.
export class SurveyVariablePresets {
  private sourceValue: ISurveyVariablePresets;
  private dateProvider: ISurveyDateProvider;
  private definitionModel: SurveyModel;
  // The model is built lazily, once, on first need: the companion is created per test and per lint,
  // and most of them never need it.
  private surveyValue: SurveyModel;
  private isDisposedValue: boolean;
  private namesValue: Array<string>;
  private questionsValue: { [name: string]: Question };

  // definitionModel is the definition the host built itself. A JSON definition is what a document
  // stores, but an application that already has the model - one with custom question types, custom
  // functions or a state its JSON cannot express - hands it over instead of a JSON to load again. It
  // wins over source.definition, which is then never loaded. What the host gives up is the model's
  // data: validateVariables clears it and assigns the values it checks, so a definition model is an
  // instrument, not a survey the host is showing to someone at the same time.
  constructor(source?: ISurveyVariablePresets,
    options?: { dateProvider?: ISurveyDateProvider, definitionModel?: SurveyModel }) {
    // The container is the host's object: it is never cloned and never written to. An absent one
    // becomes an empty container so that every method below reads it the same way.
    this.sourceValue = source || {};
    if (!!options) {
      this.dateProvider = options.dateProvider;
      this.definitionModel = options.definitionModel;
    }
  }
  public get source(): ISurveyVariablePresets {
    return this.sourceValue;
  }
  public get hasDefinition(): boolean {
    if (this.isDisposedValue) return false;
    return !!this.definitionModel || this.isRecord(this.sourceValue.definition);
  }
  public getVariableNames(): Array<string> {
    return this.getNames().slice();
  }
  public hasVariable(name: string): boolean {
    return !!this.getVariableQuestion(name);
  }
  public getVariableQuestion(name: string): Question {
    if (!name || typeof name !== "string") return undefined;
    return this.getQuestions()[name.toLowerCase()];
  }
  // Preset names are case-sensitive: a name is an identifier the author typed, like a start name in
  // the tester. Variable names are not: setVariable() lower-cases what the host sets.
  public getPresetNames(): Array<string> {
    return this.getPresets().map(preset => preset.name);
  }
  public getPreset(name: string): ISurveyVariablePreset {
    if (!name) return undefined;
    const presets = this.getPresets();
    for (let i = 0; i < presets.length; i++) {
      if (presets[i].name === name) return presets[i];
    }
    return undefined;
  }
  public validateVariables(variables: any): ISurveyVariableValidationResult {
    const res: ISurveyVariableValidationResult = { unknownVariables: [], errors: [], isValid: true };
    // A non-object argument is nothing to check, not something wrong: a test or a preset that carries
    // no variables validates clean.
    if (this.isRecord(variables)) {
      const data: any = {};
      Object.keys(variables).forEach(key => {
        const question = this.getVariableQuestion(key);
        if (!question) {
          res.unknownVariables.push(key);
        } else {
          // The value hash is case-sensitive - getDataFromValueHash is a plain valuesHash[key] - so a
          // known key is stored under the definition's spelling: { Tier: "gold" } assigned as written
          // would leave the definition question "tier" empty and a required one failing. Two input
          // keys differing only by case are one variable, and the last one in input order wins: that
          // is what the Object.keys order gives, and no consumer produces such a pair.
          data[question.getValueName()] = variables[key];
        }
      });
      const model = this.getModel();
      if (!!model) {
        this.assignData(model, data);
        // fireCallback must be true: Question.validateElementCore assigns this.errors only under that
        // flag, so with false every question reads as clean afterwards. Asynchronous validators of the
        // definition are not awaited - the synchronous verdict is what a preset check reports.
        model.validate(true, false);
        this.collectErrors(model, res.errors);
      }
    }
    res.isValid = res.unknownVariables.length === 0 && res.errors.length === 0;
    return res;
  }
  public dispose(): void {
    // A disposed companion never builds a second model - hasDefinition is false from here on - so
    // every definition-derived method behaves as with no definition. The presets are plain data and
    // keep working: they need no model.
    this.isDisposedValue = true;
    this.namesValue = undefined;
    this.questionsValue = undefined;
    // Only a model this companion created is disposed: a definition model the host handed in is the
    // host's object and may well outlive the check it was borrowed for.
    if (!!this.surveyValue && this.surveyValue !== this.definitionModel) {
      this.surveyValue.dispose();
    }
    this.surveyValue = undefined;
    this.definitionModel = undefined;
  }
  // Not Helpers.isValueObject: that one is "instanceof Object", and a dictionary built with
  // Object.create(null) - which is what a careful consumer hands over, so that a variable named
  // "constructor" cannot read back off a prototype - is not an instance of anything.
  private isRecord(val: any): boolean {
    return !!val && typeof val === "object" && !Array.isArray(val);
  }
  private getPresets(): Array<ISurveyVariablePreset> {
    const presets = this.sourceValue.presets;
    if (!Array.isArray(presets)) return [];
    return presets.filter(preset => !!preset && !!preset.name);
  }
  private getModel(): SurveyModel {
    if (!!this.surveyValue) return this.surveyValue;
    if (!this.hasDefinition) return undefined;
    let survey = this.definitionModel;
    if (!!survey) {
      // A model the host handed in is taken as it is - nothing is loaded into it and nothing is
      // copied. A clock given next to it still applies: the definition's expressions run again on
      // every validateVariables call, while whatever ran when the host built the model read the clock
      // the model had then.
      if (!!this.dateProvider) {
        survey.dateProvider = this.dateProvider;
      }
    } else {
      survey = new SurveyModel();
      // The clock is pinned before the JSON is loaded: an expression that runs while the model is
      // being built - a defaultValueExpression calling today() - has to read the same moment as the
      // rest.
      if (!!this.dateProvider) {
        survey.dateProvider = this.dateProvider;
      }
      // A deep copy: the serializer normalizes what it loads, and the container belongs to the host.
      survey.fromJSON(Helpers.getUnbindValue(this.sourceValue.definition));
    }
    // Set here and on a host model too, because the verdict depends on it: without it a select
    // question clears a value outside its choices instead of reporting it (clearIncorrectValues), and
    // an unlisted value would vanish and validate clean. After fromJSON, so that a definition carrying
    // the property itself does not turn it off.
    survey.keepIncorrectValues = true;
    this.surveyValue = survey;
    return survey;
  }
  private buildNames(): void {
    this.namesValue = [];
    // Object.create(null): a variable named "constructor" or "toString" has to be addressable rather
    // than resolve to a prototype member.
    this.questionsValue = Object.create(null);
    const model = this.getModel();
    if (!model) return;
    // The default arguments: top-level questions only. A question inside a dynamic panel template or
    // a matrix cell produces no root data key - the panel or the matrix itself is the one variable.
    model.getAllQuestions().forEach(question => {
      const name = question.getValueName();
      if (!name) return;
      const key = name.toLowerCase();
      // Two definition questions sharing a valueName are one variable, as they are one data key.
      if (!!this.questionsValue[key]) return;
      this.questionsValue[key] = question;
      this.namesValue.push(name);
    });
  }
  private getNames(): Array<string> {
    if (!this.namesValue) {
      this.buildNames();
    }
    return this.namesValue;
  }
  private getQuestions(): { [name: string]: Question } {
    if (!this.questionsValue) {
      this.buildNames();
    }
    return this.questionsValue;
  }
  private assignData(model: SurveyModel, data: any): void {
    // Errors are cleared by hand: validate() rewrites the errors of the questions it reaches, but a
    // question that this call hides by a visibleIf is not reached and would keep the errors of the
    // previous call.
    model.pages.forEach(page => page.clearErrors());
    // The same three steps on every call, the first one included, so that a verdict never depends on
    // what the previous call left behind.
    model.clear(true, true);
    // Raw values: the definition validates, it does not convert. What the caller applies to its own
    // survey is the caller's decision.
    model.data = data;
  }
  private collectErrors(model: SurveyModel, errors: Array<ISurveyVariableError>): void {
    const visibleQuestions = model.getAllQuestions(true);
    model.getAllQuestions().forEach(question => {
      // getAllErrors(), not errors: a dynamic panel or a matrix keeps its own errors empty and reports
      // through the nested question that failed. Every nested error is attributed to the variable that
      // owns it - the variable is the unit the host sets, and which cell failed is in the error text.
      const texts = question.getAllErrors().map(error => error.locText.textOrHtml);
      if (visibleQuestions.indexOf(question) > -1) {
        this.addChoiceErrors(question, texts);
      }
      if (texts.length === 0) return;
      errors.push({ variable: question.getValueName(), question: question.name, errors: texts });
    });
  }
  // No validator checks that a value is one of the choices: the survey clears such a value instead,
  // and this model keeps it (keepIncorrectValues). So the membership is checked here, and only for the
  // questions validate() reached - a question hidden by a visibleIf is not checked either.
  private addChoiceErrors(question: Question, texts: Array<string>): void {
    if (!Serializer.isDescendantOf(question.getType(), "selectbase")) return;
    const select = <QuestionSelectBase>question;
    // Choices the question does not have say nothing about the value: one that loads them on demand
    // has none until something asks, and one that loads them from a url has none until the service
    // answers - isReady is what says whether it did. A host that serves that url - the tester answers
    // it from the case - gets the loaded choices checked like any others.
    if (select.choicesLazyLoadEnabled) return;
    if (!!select.choicesByUrl.url && !select.isReady) return;
    const value = select.value;
    if (Helpers.isValueEmpty(value)) return;
    const values = Array.isArray(value) ? value : [value];
    values.forEach(val => {
      if (Helpers.isValueEmpty(val)) return;
      // visibleChoices already carries the other/none/refuse/don't-know items the question shows.
      if (!!ItemValue.getItemByValue(select.visibleChoices, val)) return;
      // A question that keeps the "other" answer in its own value (storeOthersAsComment = false) has a
      // value that is deliberately not a choice, and the model maps it back to the other item itself.
      if (select.isOtherSelected && !select.getStoreOthersAsComment()) return;
      texts.push((<any>getLocaleString("variableValueNotInChoices", question.getLocale()))["format"](val));
    });
  }
}
