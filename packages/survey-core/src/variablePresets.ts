import type { IPanel, ISurveyElement } from "./base-interfaces";
import { IncorrectValueError } from "./error";
import { Helpers, ISurveyDateProvider } from "./helpers";
import { ItemValue } from "./itemvalue";
import { Serializer } from "./jsonobject";
import { Question } from "./question";
import { QuestionSelectBase } from "./question_baseselect";
import { SurveyModel } from "./survey";
import { SurveyElement } from "./survey-element";
import { getLocaleString } from "./surveyStrings";

// A host application injects runtime values into a survey through setVariable() - a customer tier, a
// role, a number of employees - and the survey reads them in visibleIf, defaultValueExpression and
// calculated values. Those names appear nowhere in the survey JSON, so the tester and the linter
// cannot tell a legitimate host variable from a typo. This module carries what both of them need:
// the variable definition - one ordinary survey JSON whose questions are the variables - and the
// named presets of values for it. A definition question's data key (valueName when set, otherwise
// name) is the variable name; its type, choices and validators are everything that is known about
// the variable. There is no second schema. The definition's data is the shape of the variables: a
// panel or a page that nests its questions' values (nested data) describes an object variable, set
// as { users: { tier: "gold" } } and read as {users.tier}.
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
  // the variable name or the path into an object variable, as the host sets it ("users.tier"), in
  // the definition's spelling
  variable: string;
  // the definition question's name; differs from "variable" when valueName is set or the question is
  // inside an object variable. For an object variable given a value that is no object, the name of
  // the panel or page that describes it.
  question: string;
  // the error texts as the survey renders them
  errors: Array<string>;
}
export interface ISurveyVariableValidationResult {
  // keys of the checked object that are no variable of the definition, in input order, and keys
  // inside an object variable that it does not declare, as paths ("users.nope"); both in the input's
  // spelling
  unknownVariables: Array<string>;
  errors: Array<ISurveyVariableError>;
  isValid: boolean;
}

// One data key of the definition: a variable at the root, a field of an object variable below it.
// A key may carry both a question and a nesting container (decisions D4 allows that at runtime), and
// two containers with one key are one node with the fields of both.
interface IVariableNode {
  key: string;
  parent?: IVariableNode;
  question?: Question;
  container?: SurveyElement;
  // lower-cased key -> node; Object.create(null), as the root table
  children: { [key: string]: IVariableNode };
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
  private pathsValue: Array<string>;
  private rootValue: IVariableNode;

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
  // The root data keys: what the host passes to setVariables. An object variable is one name.
  public getVariableNames(): Array<string> {
    return this.getNames().slice();
  }
  // The leaves a condition can test: every question of the definition outside a record, as its data
  // path joined with "." ("users.tier"), in document order. Without nesting it equals
  // getVariableNames(). The Creator's condition editor and expression assistant list these.
  public getVariablePaths(): Array<string> {
    this.getNames();
    return this.pathsValue.slice();
  }
  // name is a root key or a path into an object variable; every segment matches ignoring case, as
  // the runtime reads a variable's object. An object variable is a variable, but no question.
  public hasVariable(name: string): boolean {
    return !!this.findNode(name);
  }
  public getVariableQuestion(name: string): Question {
    const node = this.findNode(name);
    return !!node ? node.question : undefined;
  }
  // The question, or the panel or page that describes an object variable ("users"), for a root key
  // or a path. The definition model stays private: this is how a consumer reaches one of its elements.
  public getVariableElement(name: string): SurveyElement {
    const node = this.findNode(name);
    return !!node ? node.question || node.container : undefined;
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
      const invalidNodes: Array<IVariableNode> = [];
      const data = this.mapRecord(variables, this.getRoot(), "", res, invalidNodes);
      const model = this.getModel();
      if (!!model) {
        this.assignData(model, data);
        // fireCallback must be true: Question.validateElementCore assigns this.errors only under that
        // flag, so with false every question reads as clean afterwards. Asynchronous validators of the
        // definition are not awaited - the synchronous verdict is what a preset check reports.
        model.validate(true, false);
        this.collectErrors(model, res.errors, invalidNodes);
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
    this.pathsValue = undefined;
    this.rootValue = undefined;
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
    this.pathsValue = [];
    // Object.create(null): a variable named "constructor" or "toString" has to be addressable rather
    // than resolve to a prototype member.
    this.rootValue = { key: "", children: Object.create(null) };
    const model = this.getModel();
    if (!model) return;
    // The elements in document order, keyed by their data paths (decisions R6): a question is a leaf,
    // a panel or a page that nests is an object variable. The walk never enters a question, so a
    // question inside a dynamic panel template, a matrix cell or a composite's content produces no
    // key: the question that holds the record is the one variable (N5; the data path of a question
    // inside a record is relative to the record, records-nesting RN4). A container that does not nest
    // has no data path and is transparent.
    model.pages.forEach(page => this.addElement(page));
  }
  private addElement(element: SurveyElement): void {
    const path = element.getDataPath();
    if (element.isQuestion) {
      if (path.length === 0) return;
      const node = this.addNode(path);
      // Two definition questions sharing a data key are one variable, as they are one data key.
      if (!node.question) {
        node.question = <Question>element;
        // A joined path is listed once: a dotted key "a.b" and a nesting key "a" holding "b" spell
        // the same path (D11), and the lookup answers it with the dotted key.
        const joined = this.getNodePath(node);
        if (this.pathsValue.indexOf(joined) < 0) {
          this.pathsValue.push(joined);
        }
      }
      return;
    }
    if (path.length > 0) {
      const node = this.addNode(path);
      // Two containers with one key share one object (D4): the first one describes it.
      if (!node.container) node.container = element;
    }
    if (element.isPanel || element.isPage) {
      (<IPanel><ISurveyElement>element).elements.forEach(el => this.addElement(<SurveyElement><ISurveyElement>el));
    }
  }
  private addNode(path: Array<string>): IVariableNode {
    let node = this.rootValue;
    path.forEach(key => {
      const lowerKey = key.toLowerCase();
      let child = node.children[lowerKey];
      if (!child) {
        child = { key: key, parent: node, children: Object.create(null) };
        node.children[lowerKey] = child;
        const isRoot = node === this.rootValue;
        if (isRoot) {
          this.namesValue.push(key);
        }
      }
      node = child;
    });
    return node;
  }
  // The path of a node in the definition's spelling: the first element that wrote a key spells it.
  private getNodePath(node: IVariableNode): string {
    const keys: Array<string> = [];
    for (let cur = node; !!cur && cur !== this.rootValue; cur = cur.parent) {
      keys.unshift(cur.key);
    }
    return keys.join(".");
  }
  // A path is split at "." but a key may hold a dot itself (decisions D11: a dotted valueName is a
  // literal key, and the runtime resolves {users.a.b} to it), so at every level the longest run of
  // segments that is a key is tried first, and a shorter one when the rest of the path finds nothing.
  private findNode(name: string): IVariableNode {
    if (!name || typeof name !== "string") return undefined;
    return this.findNodeIn(this.getRoot(), name.toLowerCase().split("."), 0);
  }
  private findNodeIn(parent: IVariableNode, segments: Array<string>, start: number): IVariableNode {
    for (let end = segments.length; end > start; end--) {
      const child = parent.children[segments.slice(start, end).join(".")];
      if (!child) continue;
      if (end === segments.length) return child;
      const res = this.findNodeIn(child, segments, end);
      if (!!res) return res;
    }
    return undefined;
  }
  private getNames(): Array<string> {
    if (!this.namesValue) {
      this.buildNames();
    }
    return this.namesValue;
  }
  private getRoot(): IVariableNode {
    this.getNames();
    return this.rootValue;
  }
  // The input keys of one object, mapped to the definition's spelling. The value hash and a nesting
  // container's object are case-sensitive - getDataFromValueHash is a plain valuesHash[key] - so a
  // known key is stored under the definition's spelling at every level: { Users: { Tier: "gold" } }
  // assigned as written would leave the definition question "tier" empty and a required one failing,
  // while the runtime reads {users.tier} from it. Two input keys differing only by case are one
  // variable, and the last one in input order wins: that is what the Object.keys order gives, and no
  // consumer produces such a pair. An input key is a literal key, never a path: the host sets
  // { users: { tier } }, and a key "users.tier" is a variable of that very name.
  private mapRecord(values: any, parent: IVariableNode, prefix: string,
    res: ISurveyVariableValidationResult, invalidNodes: Array<IVariableNode>): any {
    const data: any = {};
    Object.keys(values).forEach(key => {
      const node = parent.children[key.toLowerCase()];
      if (!node) {
        // in the input's spelling at every level, so that a consumer can address the key it was given
        res.unknownVariables.push(prefix + key);
        return;
      }
      data[node.key] = this.mapValue(values[key], node, prefix + key, res, invalidNodes);
    });
    return data;
  }
  private mapValue(value: any, node: IVariableNode, inputPath: string,
    res: ISurveyVariableValidationResult, invalidNodes: Array<IVariableNode>): any {
    // A question owns its value as a whole: a multiple text's or a dynamic panel's object is checked
    // by the question itself. That holds when a question and a nesting container share the key too
    // (allowed at runtime by D4, a linter error): which one owns the object is ambiguous, so its keys
    // are neither respelled nor checked.
    if (!!node.question || !node.container) return value;
    // An absent object variable is no value: its fields validate as empty, a required one included.
    if (value === undefined || value === null) return value;
    if (!this.isRecord(value)) {
      // One error on the object variable. Its fields stay empty, and the errors that only follow from
      // that (a required field) are not reported in addition: collectErrors skips them. A shape check,
      // made before the data is assigned, so it does not depend on the container's visibility - as
      // an unknown key does not.
      invalidNodes.push(node);
      const error = new IncorrectValueError(null, <any>node.container);
      res.errors.push({ variable: this.getNodePath(node), question: node.container.name, errors: [error.locText.textOrHtml] });
      return undefined;
    }
    return this.mapRecord(value, node, inputPath + ".", res, invalidNodes);
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
  private collectErrors(model: SurveyModel, errors: Array<ISurveyVariableError>, invalidNodes: Array<IVariableNode>): void {
    const visibleQuestions = model.getAllQuestions(true);
    model.getAllQuestions().forEach(question => {
      const path = question.getDataPath();
      if (this.isInInvalidNode(path, invalidNodes)) return;
      // getAllErrors(), not errors: a dynamic panel or a matrix keeps its own errors empty and reports
      // through the nested question that failed. Every nested error is attributed to the variable that
      // owns it - the variable is the unit the host sets, and which cell failed is in the error text.
      const texts = question.getAllErrors().map(error => error.locText.textOrHtml);
      if (visibleQuestions.indexOf(question) > -1) {
        this.addChoiceErrors(question, texts);
      }
      if (texts.length === 0) return;
      // the path the host sets; for a question outside an object variable that is its value name
      errors.push({ variable: path.length > 0 ? path.join(".") : question.getValueName(), question: question.name, errors: texts });
    });
  }
  // Whether the question's key lies under an object variable that was given a value that is no object.
  private isInInvalidNode(path: Array<string>, invalidNodes: Array<IVariableNode>): boolean {
    if (invalidNodes.length === 0) return false;
    let node = this.getRoot();
    for (let i = 0; i < path.length - 1 && !!node; i++) {
      node = node.children[path[i].toLowerCase()];
      if (invalidNodes.indexOf(node) > -1) return true;
    }
    return false;
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
