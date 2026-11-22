import type { Question } from "./question";
import type { PanelModelBase } from "./panel";
import type { SurveyModel } from "./survey";
import { ValueGetter } from "./conditions/conditionProcessValue";
import { Helpers, HashTable } from "./helpers";
import type { PanelDataScope } from "./panel-data-scope";
import { DataKeysScope, getRecordDataScope, getKeyHolderScope, forEachChoicePanel } from "./panel-data-scope";
import type { ISurveyDataElement, IElement } from "./base-interfaces";
import { IDataScope, getElementDataScope, getInnerLevels } from "./data-key-index";
import { asScopeObject } from "./data-object-utils";

// One write of a survey data key, created where the value is written and passed down the write's steps
// (the changing event, the validation, the triggers, the notification, auto-advance).
//   name: the key the write or the request is for (a survey write: the top-level key written);
//   question: the question that wrote, carried by the write (ISurveyData.setValue): onValueChanged reports it;
//   questionName: a code write's report, the question named like the key, set by the survey when no container
//     owns the key;
//   writer: the question that wrote, when the survey must not look it up by the key: a question inside a
//     nesting container (its data path goes below the key), or a question that asks to advance itself.
export interface IValueWrite {
  name: string;
  question?: Question;
  questionName?: string;
  writer?: Question;
}

// The survey's part of nested data: the root's keys (top-level questions and root containers), the root
// containers by key and by path, and the keys a write of a container key changes for triggers and
// conditions. The survey owns one (SurveyModel.getRootDataScope()) and is its host.
// It follows the survey's notifications in the data scopes' instances (ElementIndex): the root's own, and below the
// root the instance of the scope that holds the element (getKeyHolderScope) and those of the scopes inside it. An
// element appended last in a scope's document order is added in place, and so is a root question's new key; any
// other change drops the instance, which the base's walk (DataKeysScope) builds again on its next read.
export class SurveyRootDataScope extends DataKeysScope {
  private isUsedValue: boolean = false;
  // getStoredValue: a root key's stored value, without the copy the survey's getValue makes.
  constructor(private host: SurveyModel, private getStoredValue: (key: string) => any) {
    super();
  }

  // Whether a container of this survey has nested once: the records skip their nesting walks until then.
  public get isUsed(): boolean {
    return this.isUsedValue;
  }
  // Called on every attach of a nesting container. On the first one the root is built again: a walk made before it
  // found no active scope of this survey's.
  public used(): void {
    if (this.isUsedValue) return;
    this.isUsedValue = true;
    this.resetDataKeyIndex();
  }
  // The walk of the pages. A question is the root's when its value is a key of the survey data (before a container
  // has nested, every question's is); a root container is an active scope with no active scope above it.
  protected getScopeElements(): Array<IElement> {
    return <Array<IElement>><any>this.host.pages;
  }
  protected isScopeQuestion(q: Question): boolean {
    return q.getValueScope() === this.host;
  }
  protected isOwnDataScope(scope: PanelDataScope): boolean {
    return !scope.getParentActiveScope();
  }
  // The survey's flat structure holds the root's names.
  protected isScopeName(el: ISurveyDataElement): boolean {
    return false;
  }
  protected holdsChoicePanels(): boolean {
    return true;
  }
  // An element joined a container (questionAdded, panelAdded, a page added). The instance of the scope it joined
  // takes it in place when it comes last in that scope's document order (dataKeyElementAdded); otherwise that
  // instance is dropped. That scope is the root for an element whose data is the survey's. Below the root the
  // instances of the scopes inside the element are dropped too, and a choice panel the element brings is the root's
  // still: the root's is dropped.
  public elementAdded(el: IElement): void {
    const scope = getKeyHolderScope((<any>el).data);
    if (!!scope) {
      scope.dataKeyElementAdded(el);
      if (this.dropScopesInside(el)) {
        this.resetDataKeyIndex();
      }
      return;
    }
    // An element with no data (a dynamic panel's template question) is in no walk of the pages.
    if (!(<any>el).data) return;
    // A read while el was attached (a dynamic panel's readiness) may have built the root with a part of el in it
    // (a choice panel's question, a question taken off its page: they stay bound to the survey), ahead of el's
    // elements that were not attached yet: an append would not keep document order.
    if (this.holdsInside(el)) {
      this.resetDataKeyIndex();
    } else {
      this.dataKeyElementAdded(el);
    }
  }
  // An element left its container (questionRemoved, panelRemoved, a page removed). Below the root, the container
  // dropped the instance that held it (PanelModelBase.onRemoveElement); the instances of the scopes inside it are
  // dropped here, and the root's when it holds the element or one inside it (a choice panel's question included).
  // A panel that comes back builds the instances inside it again (ContainerDataNesting.elementsAttached).
  public elementRemoved(el: IElement): void {
    const index = this.builtDataKeyIndex;
    let held = false;
    this.forEachInside(el, (inner: ISurveyDataElement): void => {
      if (!inner.isQuestion) {
        (<PanelModelBase><any>inner).getDataScope()?.resetDataKeyIndex();
      }
      held = held || !!index && index.has(inner);
    });
    if (held) {
      this.resetDataKeyIndex();
    }
  }
  // setPage moved the element, or took it off its page, with no add or remove notification. The container it left
  // dropped the instance that held it, and an attach drops a panel's own instance and those inside it. The instance
  // of the scope it joined is dropped, and so is the root's (an element taken off its page leaves it; one moved
  // within the root takes its new place).
  public elementMoved(el: IElement): void {
    getKeyHolderScope((<any>el).data)?.resetDataKeyIndex();
    this.resetDataKeyIndex();
  }
  // questionRenamed: below the root, the instance of the scope that holds the question is dropped (its name and its
  // key changed). The root's holds no names: the question takes its new key in place and keeps its place in document
  // order (reKey does nothing for a question it does not hold). A build instead would walk every page after each
  // rename that is followed by a read.
  public questionRenamed(question: Question): void {
    getKeyHolderScope(question.data)?.resetDataKeyIndex();
    this.builtDataKeyIndex?.reKey(question, question.getValueName());
  }
  // elementRenamed: a panel's name changed, or its load ended. The instance below the root that holds it by name is
  // dropped. Not for a panel that has a scope: its key change drops that instance, once (at runtime through
  // PanelModelBase.onDataScopeKeyChanged, at the load end through PanelModelBase.endLoadingFromJson).
  public panelRenamed(panel: PanelModelBase): void {
    if (!panel.getDataScope()) {
      getKeyHolderScope(panel.data)?.resetDataKeyIndex();
    }
  }
  // A container started or stopped holding data, or changed its key. The instances it touches are dropped: its own,
  // the one that holds it or its elements, and the root's. The root's is dropped as a whole, not only for the
  // container's elements: a question whose data is the container's scope can be outside the container (a template
  // question moved onto a page), and its value scope follows that scope. A choice panel linked to the survey or
  // dropped calls this too (question_baseselect.ts): its questions are the root's.
  public dataScopeKeysChanged(panel: PanelModelBase): void {
    panel.getDataScope()?.resetDataKeyIndex();
    getKeyHolderScope(panel.data)?.resetDataKeyIndex();
    this.resetDataKeyIndex();
  }
  // The instances of the scopes inside el (el's own included) are dropped. Returns whether el brings a choice panel:
  // its questions are the root's.
  private dropScopesInside(el: IElement): boolean {
    let res = false;
    this.forEachInside(el, (inner: ISurveyDataElement): void => {
      if (inner.isQuestion) {
        forEachChoicePanel(inner, (): void => { res = true; });
      } else {
        (<PanelModelBase><any>inner).getDataScope()?.resetDataKeyIndex();
      }
    });
    return res;
  }
  // The element and every element inside it: a panel's elements, and a select question's choice panels.
  private forEachInside(el: IElement, callback: (el: ISurveyDataElement) => void): void {
    callback(<ISurveyDataElement><any>el);
    if (el.isQuestion) {
      forEachChoicePanel(el, (panel: IElement): void => this.forEachInside(panel, callback));
      return;
    }
    const elements: Array<IElement> = (<any>el).elements;
    if (Array.isArray(elements)) {
      elements.forEach(inner => this.forEachInside(inner, callback));
    }
  }
  // Whether the root's instance holds an element inside el already.
  private holdsInside(el: IElement): boolean {
    const index = this.builtDataKeyIndex;
    if (!index) return false;
    let res = false;
    this.forEachInside(el, (inner: ISurveyDataElement): void => {
      res = res || inner !== <any>el && index.has(inner);
    });
    return res;
  }
  // A container's key or the survey's dataNesting (no panel) changed: the containers whose key changed
  // re-attach their elements, and the values of the questions follow. The data does not move.
  public dataScopeChanged(panel?: PanelModelBase): void {
    if (!panel) {
      this.updateDataScopeAttachments();
      // The panels inside a record are not attached again (RN3): a records question builds its objects' instances
      // again.
      this.host.getAllQuestions(false, true).forEach(q => (<any>q).resetDataKeyIndexes?.());
      this.resetDataKeyIndex();
    } else {
      this.dataScopeKeysChanged(panel);
    }
    if (!this.isUsedValue || this.host.isLoadingFromJson) return;
    const questions = !!panel ? panel.questions : this.host.getAllQuestions();
    questions.forEach(q => {
      const data = q.getValueScope();
      const valueName = q.getValueName();
      q.updateValueFromSurvey(data.getValue(valueName), false);
      if (q.requireUpdateCommentValue) {
        q.updateCommentFromSurvey(data.getComment(valueName));
      }
    });
  }
  private updateDataScopeAttachments(): void {
    this.forEachPagePanel(panel => panel.updateDataScopeAttachment());
    // Built again after the whole walk: a read while it went down saw a panel deeper in that was not attached yet.
    this.forEachPagePanel(panel => panel.getDataScope()?.resetDataKeyIndex());
  }
  // The pages and every panel inside them, a container before the panels inside it.
  private forEachPagePanel(callback: (panel: PanelModelBase) => void): void {
    const visit = (panel: PanelModelBase): void => {
      callback(panel);
      const elements = panel.elements;
      for (let i = 0; i < elements.length; i++) {
        if (elements[i].isPanel) visit(<PanelModelBase><any>elements[i]);
      }
    };
    this.host.pages.forEach(page => visit(page));
  }

  // The active scopes whose object is the top-level key: the root containers with this key.
  public getRootScopes(key: string): Array<PanelDataScope> {
    return this.getDataKeyIndex().getScopes(key);
  }
  public isScopeKey(key: string): boolean {
    return this.getRootScopes(key).length > 0;
  }
  // The scopes whose object is at the data path: [] gives the survey, ["address"] the root containers with
  // the key "address", ["page1", "address"] the containers with the key "address" inside them (each may
  // be more than one).
  public getScopesByPath(path: Array<string>): Array<IDataScope> {
    if (path.length === 0) return [this.host];
    // The survey's keys are the root's (SurveyModel.getDataKeyIndex).
    let res = this.getInner(path[0]);
    for (let i = 1; i < path.length && res.length > 0; i++) {
      res = getInnerLevels(res, path[i]);
    }
    return res;
  }
  // The questions that hold the same value as question: its value name in the indexes of the scopes at its
  // value scope's data path (two containers sharing a key share their object). At the root these are
  // the survey's getQuestionsByValueName. A question inside a record is looked up at the root, as one
  // directly in a record always was: its data path starts at the record, not at the survey data.
  public getQuestionsSharingValue(question: Question): Array<Question> {
    const res: Array<Question> = [];
    const path = !getRecordDataScope(question.data) ? question.getValueScope().getDataPath() : [];
    let scopes = this.getScopesByPath(path);
    // A container no index reaches (one taken off its page): its own scope holds the value.
    if (scopes.length === 0) scopes = [question.getValueScope()];
    scopes.forEach(scope => res.push(...scope.getDataKeyIndex().getQuestions(question.getValueName())));
    return res;
  }

  // The question that wrote the key valueName through a data scope: its data path goes below the key.
  // Only then: a top-level writer would change the question onValueChanging reports and which questions
  // sharing a value name are validated.
  public getWriter(valueName: string, question: Question): Question {
    if (!question || !this.isUsedValue) return undefined;
    const path = question.getDataPath();
    return path.length > 1 && path[0] === valueName ? question : undefined;
  }
  // A code write of a key reports the question named like it, unless the key is a container key. The survey finds
  // by a bare name only its own questions (scoped names 05, O1), whose values are keys of the survey data.
  public isCodeWriteQuestionName(name: string): boolean {
    return !this.isUsedValue || !this.isScopeKey(name);
  }

  // The changed keys below a container key, with their old and new values: the value name and the name of
  // each inner question whose value or comment changed (and its comment key), and the key of each inner
  // container whose object changed, so an expression reading {street} re-runs. Empty for a key that is
  // no container key.
  public getChangedKeys(key: string, newValue: any, oldValue: any): HashTable<{ newValue: any, oldValue: any }> {
    const res: HashTable<{ newValue: any, oldValue: any }> = {};
    if (!this.isUsedValue) return res;
    const getMember = (obj: any, name: string): any => asScopeObject(obj)?.[name];
    const add = (name: string, oldVal: any, newVal: any): void => {
      if (!Object.prototype.hasOwnProperty.call(res, name)) res[name] = { newValue: newVal, oldValue: oldVal };
    };
    const isEqual = (x: any, y: any): boolean => Helpers.isTwoValueEquals(x, y, false, true, false);
    const collect = (scope: PanelDataScope, oldObj: any, newObj: any): void => scope.getDataKeyIndex().elements.forEach(el => {
      const inner = getElementDataScope(el);
      if (!!inner) {
        const oldVal = getMember(oldObj, inner.key);
        const newVal = getMember(newObj, inner.key);
        if (isEqual(oldVal, newVal)) return;
        add(inner.key, oldVal, newVal);
        collect(inner, oldVal, newVal);
        return;
      }
      const q = <Question>el;
      const valueName = q.getValueName();
      const oldVal = getMember(oldObj, valueName);
      const newVal = getMember(newObj, valueName);
      const commentKey = Helpers.getCommentKey(valueName);
      const oldComment = getMember(oldObj, commentKey);
      const newComment = getMember(newObj, commentKey);
      const isCommentChanged = !isEqual(oldComment, newComment);
      if (isEqual(oldVal, newVal) && !isCommentChanged) return;
      add(valueName, oldVal, newVal);
      if (q.name !== valueName) add(q.name, oldVal, newVal);
      if (isCommentChanged) {
        add(commentKey, oldComment, newComment);
        if (q.name !== valueName) add(Helpers.getCommentKey(q.name), oldComment, newComment);
      }
    });
    this.getRootScopes(key).forEach(scope => collect(scope, oldValue, newValue));
    return res;
  }
  // The trigger keys of a question's value: each key of its data path with its value. Not its name: a trigger is
  // the survey's, and the survey does not find an inner question by its name (O3). A key already there stays.
  // belowRoot: only a path that goes below the root, as runTriggers and performNext add (their root keys come
  // from the data and the question's name); returns whether the keys were added.
  public addTriggerKeys(keys: any, question: Question, belowRoot?: boolean): boolean {
    const path = question.getDataPath();
    if (path.length === 0 || belowRoot && path.length < 2) return false;
    const has = (name: string): boolean => Object.prototype.hasOwnProperty.call(keys, name);
    const add = (name: string, val: any): void => {
      if (!has(name)) keys[name] = val;
    };
    // A root key is read once: several questions (and containers) may share it.
    if (!has(path[0])) keys[path[0]] = this.host.getValue(path[0]);
    // Below the root, the stored value (not keys[path[0]]: runTriggers holds the filtered values there).
    let val = this.getStoredValue(path[0]);
    for (let i = 1; i < path.length; i++) {
      val = asScopeObject(val)?.[path[i]];
      add(path[i], val);
    }
    return true;
  }
  // ISurveyTriggerOwner: whether the changed keys are only the ones a write of the question that name resolves
  // to reports (its data path and its name): a setvalue / copyvalue trigger then skips the change of its own
  // target. A top-level question's write reports one key, which the trigger checks itself.
  public isOwnValueKeys(name: string, keys: Array<string>): boolean {
    if (!this.isUsedValue || !name || keys.length === 0) return false;
    const info = new ValueGetter().getValueInfo({ name: name, context: this.host.getValueGetterContext() });
    const q = <Question>info.question;
    const own = !!q ? q.getDataPath() : [];
    if (own.length < 2) return false;
    // Not the comment key: a comment change of the target runs the trigger, as it does for a top-level one.
    own.push(q.name);
    return keys.every(key => own.indexOf(key) > -1);
  }
}
