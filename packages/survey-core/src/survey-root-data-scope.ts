import type { Question } from "./question";
import type { PanelModelBase } from "./panel";
import type { IValueGetterContext } from "./conditions/conditionProcessValue";
import { ValueGetter } from "./conditions/conditionProcessValue";
import { Helpers, HashTable } from "./helpers";
import { PanelDataScope, DataKeyIndex, IDataScope, getElementDataScope, getRecordDataScope, asScopeObject, isKnownDataKey } from "./panel-data-scope";

// One write of a survey data key, created where the value is written and passed down the write's steps
// (the changing event, the validation, the triggers, the notification, auto-advance).
//   name: the key the write or the request is for (a survey write: the top-level key written);
//   questionName: the name of the question the write reports (onValueChanged); a code write gets the
//     question named like the key, set by the survey when no container owns the key;
//   writer: the question that wrote, when the survey must not look it up by the key: a question inside a
//     nesting container (its data path goes below the key), or a question that asks to advance itself.
export interface IValueWrite {
  name: string;
  questionName?: string;
  writer?: Question;
}

// What the root data scope reads from its survey. The survey is the root scope itself: an element whose
// value scope is the host is a top-level element.
export interface ISurveyRootDataScopeHost extends IDataScope {
  readonly pages: Array<PanelModelBase>;
  readonly isLoadingFromJson: boolean;
  getAllQuestions(): Array<Question>;
  getQuestionByName(name: string): Question;
  getValueGetterContext(): IValueGetterContext;
}

// Writes value into obj under the path, copying the objects on the way (obj may hold the stored objects).
// isOwnObj: obj and the objects in it were built by the caller (server data), no copy is needed.
export function setValueByPath(obj: any, path: Array<string>, value: any, isOwnObj?: boolean): void {
  for (let i = 0; i < path.length - 1; i++) {
    const cur = asScopeObject(obj[path[i]]);
    obj[path[i]] = !cur ? {} : isOwnObj ? cur : Object.assign({}, cur);
    obj = obj[path[i]];
  }
  obj[path[path.length - 1]] = value;
}

// The survey's part of nested data: the root data-key index (top-level questions and root containers), the
// data shape version, the root containers by key and by path, and the keys a write of a container key
// changes for triggers and conditions. The survey owns one and delegates to it; it reaches the survey only
// through the host.
export class SurveyRootDataScope {
  // One counter for every survey: a panel moved to another survey must not find its index current there.
  private static shapeVersionCounter: number = 0;
  private isUsedValue: boolean = false;
  private shapeVersion: number = ++SurveyRootDataScope.shapeVersionCounter;
  // The root index. Its questions are kept up as elements are added, removed and renamed (questionAdded /
  // questionRemoved), in the order added, as the value-name hash was: the survey without nesting pays
  // nothing new. Once a container nests, the whole index follows the data shape on its first read after a
  // change: the questions are synced (syncRootQuestions) and the root containers (the active scopes not
  // inside another one) are added again.
  private index = new DataKeyIndex();
  private indexVersion: number;
  // getStoredValue: a root key's stored value, without the copy the survey's getValue makes.
  constructor(private host: ISurveyRootDataScopeHost, private getStoredValue: (key: string) => any) { }

  // Whether a container of this survey has nested once: the records skip their nesting walks until then.
  public get isUsed(): boolean {
    return this.isUsedValue;
  }
  public used(): void {
    if (this.isUsedValue) return;
    this.isUsedValue = true;
    this.shapeChanged();
  }
  // The scopes' indexes (PanelDataScope.getDataKeyIndex()) and the root's containers are built, and the root's
  // questions synced, on their first read after the data shape changed: an element added, removed, moved or
  // renamed, a container key or dataNesting changed, a survey loaded. Shape changes are rare; a write reads
  // the index.
  public shapeChanged(): void {
    this.shapeVersion = ++SurveyRootDataScope.shapeVersionCounter;
  }
  public getShapeVersion(): number {
    return this.shapeVersion;
  }
  public getDataKeyIndex(): DataKeyIndex {
    if (this.isUsedValue && this.indexVersion !== this.shapeVersion) {
      this.indexVersion = this.shapeVersion;
      this.syncRootQuestions();
      const index = this.index;
      index.clearContainers();
      const collect = (panel: PanelModelBase): void => {
        const scope = panel.getDataScope();
        if (!!scope && scope.isActive) {
          index.addKey(scope.key, panel);
          return;
        }
        panel.elements.forEach(el => el.isPanel && collect(<PanelModelBase><any>el));
      };
      this.host.pages.forEach(page => collect(page));
    }
    return this.index;
  }
  // The root's part of the unknown-key rule: an element's key, a question's comment or totals key.
  public isKnownKey(key: string): boolean {
    return isKnownDataKey(this.getDataKeyIndex(), key);
  }
  // A question's value name, when its value is a key of the survey data.
  public questionAdded(question: Question): void {
    if (this.isRoot(question)) {
      this.index.addKey(question.getValueName(), question);
    }
  }
  public questionRemoved(valueName: string, question: Question): void {
    this.index.removeKey(valueName, question);
  }
  public clearQuestions(): void {
    this.index.clearQuestions();
  }
  // A container key or dataNesting changed which questions are top-level: they are added again, in document order.
  public rebuildRootQuestions(): void {
    this.index.clearQuestions();
    this.host.pages.forEach(page => page.questions.forEach(q => this.questionAdded(q)));
  }
  // An element moved with `page = otherPage` sends no add or remove notification, yet a nesting page it leaves or
  // enters changes whether its questions are top-level. Each page question is added when it became top-level
  // and removed when it no longer is; the others keep their place, so the order added stays. A question the
  // pages do not hold (a dynamic panel's template) is left as the incremental path put it. A move and its
  // reverse between two reads leave a question where it was; with a read between them, it comes last.
  private syncRootQuestions(): void {
    const index = this.index;
    this.host.pages.forEach(page => page.questions.forEach(q => {
      const valueName = q.getValueName();
      const isIn = index.getQuestions(valueName).indexOf(q) > -1;
      const isRoot = this.isRoot(q);
      if (isRoot && !isIn) index.addKey(valueName, q);
      if (!isRoot && isIn) index.removeKey(valueName, q);
    }));
  }
  private isRoot(question: Question): boolean {
    return question.getValueScope() === <IDataScope>this.host;
  }
  // A container's key or the survey's dataNesting (no panel) changed: the containers whose key changed
  // re-attach their elements (D8), and the root index's questions and the values of the questions follow.
  // The data does not move.
  public dataScopeChanged(panel?: PanelModelBase): void {
    if (!panel) {
      this.updateDataScopeAttachments();
    }
    this.shapeChanged();
    if (!this.isUsedValue) return;
    this.rebuildRootQuestions();
    if (this.host.isLoadingFromJson) return;
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
    const update = (panel: PanelModelBase): void => {
      panel.updateDataScopeAttachment();
      const elements = panel.elements;
      for (let i = 0; i < elements.length; i++) {
        if (elements[i].isPanel) update(<PanelModelBase><any>elements[i]);
      }
    };
    this.host.pages.forEach(page => update(page));
  }

  // The active scopes whose object is the top-level key: the root containers with this key.
  public getRootScopes(key: string): Array<PanelDataScope> {
    return this.getDataKeyIndex().getScopes(key);
  }
  public isScopeKey(key: string): boolean {
    return this.getRootScopes(key).length > 0;
  }
  // The scopes whose object is at the data path: [] gives the survey, ["address"] the root containers with
  // the key "address", ["page1", "address"] the containers with the key "address" inside them (D4: each may
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
  // value scope's data path (D4: two containers sharing a key share their object). At the root these are
  // the survey's getQuestionsByValueName. A question inside a record is looked up at the root, as one
  // directly in a record always was: its data path starts at the record (RN4), not at the survey data.
  public getQuestionsSharingValue(question: Question): Array<Question> {
    const res: Array<Question> = [];
    const path = !getRecordDataScope(question.data) ? question.getValueScope().getDataPath() : [];
    this.getScopesByPath(path)
      .forEach(scope => res.push(...scope.getDataKeyIndex().getQuestions(question.getValueName())));
    return res;
  }

  // The question that wrote the key valueName through a data scope, found by the name a scope's write passes
  // (ISurveyData.setValue carries a question's name, not the question): its data path goes below the key.
  // Only then: a top-level writer would change the question onValueChanging reports and which questions
  // sharing a value name are validated (D1).
  public getWriter(valueName: string, questionName: string): Question {
    if (!questionName || !this.isUsedValue) return undefined;
    const q = this.host.getQuestionByName(questionName);
    const path = !!q ? q.getDataPath() : [];
    return path.length > 1 && path[0] === valueName ? q : undefined;
  }
  // D13: a code write of a key reports the question named like it, unless the key is a container key or that
  // question's value lives inside a container (its name is no key of the survey data).
  public isCodeWriteQuestionName(name: string): boolean {
    if (!this.isUsedValue) return true;
    const q = this.host.getQuestionByName(name);
    return !this.isScopeKey(name) && (!q || this.isRoot(q));
  }

  // The changed keys below a container key, with their old and new values: the value name and the name of
  // each inner question whose value or comment changed (and its comment key), and the key of each inner
  // container whose object changed (design-01 1.5). Empty for a key that is no container key.
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
  // The trigger keys of a question's value (design-01 1.5): each key of its data path with its value,
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
  // target (design-01 1.8). A top-level question's write reports one key, which the trigger checks itself.
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
