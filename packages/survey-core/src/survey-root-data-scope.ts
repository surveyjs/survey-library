import type { Question } from "./question";
import type { PanelModelBase } from "./panel";
import type { IValueGetterContext } from "./conditions/conditionProcessValue";
import { ValueGetter } from "./conditions/conditionProcessValue";
import { Helpers, HashTable } from "./helpers";
import type { PanelDataScope, ObjectDataScope } from "./panel-data-scope";
import { getRecordDataScope, getKeyHolderScope } from "./panel-data-scope";
import type { ISurveyDataElement, IElement } from "./base-interfaces";
import { IDataKeys, IDataScope, getElementDataScope, isKnownDataKey } from "./data-key-index";
import { asScopeObject } from "./data-object-utils";
import { ElementIndex } from "./element-index";

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

// What the root data scope reads from its survey. The survey is the root scope itself: an element whose
// value scope is the host is a top-level element.
export interface ISurveyRootDataScopeHost extends IDataScope {
  readonly pages: Array<PanelModelBase>;
  readonly isLoadingFromJson: boolean;
  getAllQuestions(visibleOnly?: boolean, includeDesignTime?: boolean): Array<Question>;
  getQuestionByName(name: string): Question;
  getValueGetterContext(): IValueGetterContext;
}

// The survey's part of nested data: the root's keys (top-level questions and root containers), the root
// containers by key and by path, and the keys a write of a container key changes for triggers and
// conditions. The survey owns one and delegates to it; it reaches the survey only through the host.
// It keeps the data scopes' instances (ElementIndex) up: the root's own, and the instances below the root
// through the scope that holds each element.
export class SurveyRootDataScope {
  private isUsedValue: boolean = false;
  // elements: the survey's flat structure, by name. Which of its questions are the root's is decided when it
  // adds, removes or renames one (questionIndexed), and at each event that moves values between scopes. They
  // keep the order added by value name: the flat structure's stamps.
  // getStoredValue: a root key's stored value, without the copy the survey's getValue makes.
  constructor(private host: ISurveyRootDataScopeHost, private elements: ElementIndex, private getStoredValue: (key: string) => any) { }
  // The root's instance: built on the first read. A question added, removed or renamed changes it in place; any
  // other change builds it again on the next read.
  private index: ElementIndex;
  // The scope below the root whose instance held each element when it was built or the element was added: what a
  // removal, a rename or a move takes the element from. A hint, not the truth: an instance built again elsewhere
  // may hold it now (hold).
  private holders = new WeakMap<ISurveyDataElement, ObjectDataScope>();

  // Whether a container of this survey has nested once: the records skip their nesting walks until then.
  public get isUsed(): boolean {
    return this.isUsedValue;
  }
  // Called on every attach of a nesting container; the root's questions change on the first one only.
  public used(): void {
    if (this.isUsedValue) return;
    this.isUsedValue = true;
    this.index = undefined;
  }
  public getDataKeyIndex(): ElementIndex {
    if (!this.index) {
      const res = new ElementIndex((el: ISurveyDataElement): number => el.isQuestion ? this.elements.getStamp(<any>el) : undefined);
      const questions: Array<Question> = [];
      this.elements.forEachHeld(el => {
        if (el.isQuestion && this.isRootQuestion(<Question><any>el)) questions.push(<Question><any>el);
      });
      questions.sort((a, b) => this.elements.getStamp(a) - this.elements.getStamp(b));
      questions.forEach(q => res.addKeyed(q, this.elements.getHeldValueName(q)));
      this.addRootContainers(res);
      this.index = res;
    }
    return this.index;
  }
  // The root's part of the unknown-key rule: an element's key, a question's comment or totals key.
  public isKnownKey(key: string, index?: IDataKeys): boolean {
    return isKnownDataKey(index || this.getDataKeyIndex(), key);
  }
  private isRoot(question: Question): boolean {
    return question.getValueScope() === <IDataScope>this.host;
  }
  // A question of the flat structure is the root's when its value is a key of the survey data. Before a
  // container has nested, every one is.
  private isRootQuestion(question: Question): boolean {
    return !this.isUsedValue || this.isRoot(question);
  }
  // The root containers: the active scopes not inside another one, by a walk of the pages in document order. It
  // stops at the first active scope on each branch.
  private addRootContainers(index: ElementIndex): void {
    if (!this.isUsedValue) return;
    const collect = (panel: PanelModelBase): void => {
      const scope = panel.getDataScope();
      if (!!scope && scope.isActive) {
        index.addKeyed(panel, scope.key);
        return;
      }
      panel.elements.forEach(el => el.isPanel && collect(<PanelModelBase><any>el));
    };
    this.host.pages.forEach(page => collect(page));
  }
  // The flat structure added, removed or renamed the question, or its value may live elsewhere now: the root holds
  // it or not, under the value name the flat structure holds it under, at its stamp.
  public questionIndexed(question: Question): void {
    const index = this.index;
    if (!index) return;
    if (this.elements.getStamp(question) === undefined || !this.isRootQuestion(question)) {
      index.removeKeyed(question);
    } else if (index.has(question)) {
      index.reKey(question, this.elements.getHeldValueName(question));
    } else {
      index.addKeyed(question, this.elements.getHeldValueName(question));
    }
  }
  // Built again on the next read: the flat structure was cleared (survey.fromJSON), or a page left the survey
  // (doOnPageRemoved detaches it after the pages callback, and a template question inside keeps its old data).
  public resetDataKeyIndex(): void {
    this.index = undefined;
  }
  // A scope below the root built its instance from these elements.
  public dataKeyIndexBuilt(scope: ObjectDataScope, elements: Array<ISurveyDataElement>): void {
    elements.forEach(el => this.hold(el, scope));
  }
  // An element is held by one instance below the root: one built while the element moved (setPage sends its call
  // when the move ends) takes it from the instance that held it before.
  private hold(el: ISurveyDataElement, scope: ObjectDataScope): void {
    const prev = this.holders.get(el);
    if (!!prev && prev !== scope) {
      prev.builtDataKeyIndex?.removeKeyed(el);
    }
    this.holders.set(el, scope);
  }
  // A container, or a question with elements inside it (a records question's template, a composite's content):
  // the flat structure may hold questions inside it that its add or removal does not report.
  private static hasInnerElements(el: IElement): boolean {
    return !el.isQuestion || (<any>el).isContainer === true;
  }
  // An element joined a container (questionAdded, panelAdded, a page added, the end of a move). The instance of
  // the scope it joined takes its part in place when it comes last in that scope's document order; otherwise that
  // instance is built again. The root takes a question in place, and is built again for a container.
  public elementAdded(el: IElement): void {
    if (SurveyRootDataScope.hasInnerElements(el)) {
      this.index = undefined;
    } else {
      // A question the flat structure holds already (one renamed inside a template, or one added back) may have
      // another value scope now.
      this.questionIndexed(<Question><any>el);
    }
    const scope = getKeyHolderScope((<any>el).data);
    const added = !!scope ? scope.dataKeyElementAdded(el) : undefined;
    if (!!added) {
      added.forEach(inner => this.hold(inner, scope));
    }
  }
  // An element left its container: it and every element inside it leave the instances the map names. A panel that
  // comes back builds the instances inside it again (ContainerDataNesting.elementsAttached).
  public elementRemoved(el: IElement): void {
    this.forEachInside(el, (inner: ISurveyDataElement): void => {
      this.holders.get(inner)?.builtDataKeyIndex?.removeKeyed(inner);
      this.holders.delete(inner);
    });
    if (SurveyRootDataScope.hasInnerElements(el)) {
      this.index = undefined;
    }
  }
  // setPage moved the element, or took it off its page: its data is the new one already, and the map still names
  // where it was. The move attached the element again, and a read while it was added may have built an instance
  // with it in place, so nothing is patched: the instances that held it and those inside it are built again, and
  // so is the root's (an element taken off its page keeps its old data and follows that scope). The flat structure
  // keeps it.
  public elementMoved(el: IElement): void {
    this.forEachInside(el, (inner: ISurveyDataElement): void => {
      this.holders.get(inner)?.resetDataKeyIndex();
      this.holders.delete(inner);
      if (!inner.isQuestion) {
        (<PanelModelBase><any>inner).getDataScope()?.resetDataKeyIndex();
      }
    });
    if (!!el.parent) {
      this.elementAdded(el);
    }
    this.index = undefined;
  }
  // questionRenamed: the question's key in the instance below the root that holds it. The root follows the flat
  // structure (questionIndexed).
  public questionRenamed(question: Question): void {
    const index = this.holders.get(question)?.builtDataKeyIndex;
    if (!!index && index.has(question)) {
      index.reKey(question, question.getValueName());
    }
  }
  // elementRenamed: a panel's name changed, or its load ended. A key loaded in place (fromJSON) sends no other
  // notification, so a panel that has a scope is treated as a changed key: the instances are only dropped here.
  public panelRenamed(panel: PanelModelBase): void {
    if (!!panel.getDataScope()) {
      this.dataScopeKeysChanged(panel);
    }
  }
  // A container started or stopped holding data, or changed its key. The instances it touches are built again:
  // its own, the one that holds it or its elements, and the root's. The root's questions are read again as a whole,
  // not only the container's: a question whose data is the container's scope can be outside the container (taken
  // off its page, or a template question moved out), and its value scope follows that scope.
  public dataScopeKeysChanged(panel: PanelModelBase): void {
    panel.getDataScope()?.resetDataKeyIndex();
    this.holders.get(panel)?.resetDataKeyIndex();
    getKeyHolderScope(panel.data)?.resetDataKeyIndex();
    this.index = undefined;
  }
  // The element and every element inside it.
  private forEachInside(el: IElement, callback: (el: ISurveyDataElement) => void): void {
    callback(<ISurveyDataElement><any>el);
    const elements: Array<IElement> = (<any>el).elements;
    if (!el.isQuestion && Array.isArray(elements)) {
      elements.forEach(inner => this.forEachInside(inner, callback));
    }
  }
  // A container's key or the survey's dataNesting (no panel) changed: the containers whose key changed
  // re-attach their elements, and the values of the questions follow. The data does not move.
  public dataScopeChanged(panel?: PanelModelBase): void {
    if (!panel) {
      this.updateDataScopeAttachments();
      // The panels inside a record are not attached again (RN3): a records question builds its objects' instances
      // again.
      this.host.getAllQuestions(false, true).forEach(q => (<any>q).resetDataKeyIndexes?.());
      this.index = undefined;
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
    let res: Array<IDataScope> = [this.host];
    for (let i = 0; i < path.length && res.length > 0; i++) {
      const next: Array<IDataScope> = [];
      res.forEach(scope => next.push(...scope.getDataKeyIndex().getScopes(path[i])));
      res = next;
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
    // A container no index reaches (a panel inside a choice item): its own scope holds the value.
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
  // A code write of a key reports the question named like it, unless the key is a container key or that
  // question's value lives inside a container (its name is no key of the survey data).
  public isCodeWriteQuestionName(name: string): boolean {
    if (!this.isUsedValue) return true;
    const q = this.host.getQuestionByName(name);
    return !this.isScopeKey(name) && (!q || this.isRoot(q));
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
  // The trigger keys of a question's value: each key of its data path with its value,
  // and below the root its name ({street} finds an inner question by its name). A key already there stays.
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
    if (path.length > 1) add(question.name, val);
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
