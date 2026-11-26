import type { IObjectValueContext, IValueGetterContext, IValueGetterContextGetValueParams, IValueGetterInfo } from "../conditions/conditionProcessValue";
import type { Question } from "../question";
import type { PanelDataScope } from "./panel-data-scope";
import { PropertyGetterContext, ValueGetterContextCore, stripUnwrapPostfix } from "../conditions/conditionProcessValue";
import { Helpers } from "../helpers";
import { RecordKeyLevel } from "./record-key-level";
import { getInnerLevels } from "./data-key-index";

// What one data level answers a name with (updateValueByDataLevel). getCommentValue: the comment a question
// of the level stores; without it a comment key answers in the metadata mode only.
export interface IDataLevelFinder {
  findQuestion(name: string): Question;
  findInnerContext(name: string): IValueGetterContext;
  getCommentValue?(owner: Question): any;
}
// The name step of a context over the keys of one data level, ignoring letter case: an empty question still
// answers. A scope's and a template level's context strip the unwrap postfix first; a record's does not.
export function updateValueByDataLevel(name: string, res: IValueGetterInfo, finder: IDataLevelFinder): void {
  const question = finder.findQuestion(name);
  if (!!question) {
    res.isFound = true;
    res.obj = question;
    res.context = question.getValueGetterContext();
    return;
  }
  const inner = finder.findInnerContext(name);
  if (!!inner) {
    res.isFound = true;
    res.context = inner;
    return;
  }
  if (!res.isMetadata && !finder.getCommentValue) return;
  const baseName = Helpers.getNameOfCommentKey(name, true);
  const owner = !!baseName ? finder.findQuestion(baseName) : null;
  if (!!owner) {
    // The stored comment, as a top-level {q-Comment} reads the raw data key; the metadata mode names the
    // question instead.
    res.isFound = true;
    if (res.isMetadata) {
      res.obj = owner;
      res.isComment = true;
      return;
    }
    res.value = finder.getCommentValue(owner);
  }
}
abstract class DataLevelValueGetterContext extends ValueGetterContextCore implements IDataLevelFinder {
  protected isSearchNameRevert(): boolean { return true; }
  public abstract findQuestion(name: string): Question;
  public abstract findInnerContext(name: string): IValueGetterContext;
  public abstract getCommentValue(owner: Question): any;
  protected updateValueByItem(name: string, res: IValueGetterInfo): void {
    updateValueByDataLevel(stripUnwrapPostfix(name, res), res, this);
  }
}

// The expression context of the active scopes that share one key (one scope unless two containers share it). As
// an inner element's context an unanswered name falls back to the parent's context through getRootObj; reached
// through a path from outside ({address.street}) it answers the rest of the path only, and the survey falls back
// to the raw data.
export class PanelDataScopeValueGetterContext extends DataLevelValueGetterContext {
  constructor(private scopes: Array<PanelDataScope>) {
    super();
  }
  public getValue(params: IValueGetterContextGetValueParams): IValueGetterInfo {
    const path = params.path;
    if (path.length === 0) return { isFound: true, value: this.scopes[0].getObjectValue(), context: this };
    // A property path ({$details.isVisible}) names a panel of the scope first, letter case ignored, as the survey
    // reads one of its own.
    if (params.isProperty && path.length > 1) {
      const panel = this.scopes[0].findOwnElement(path[0].name, (el: any): boolean => !el.isQuestion, true, false);
      if (!!panel) return new PropertyGetterContext(panel).getValue({ path: path.slice(1), isRoot: false, index: -1 });
    }
    return super.getValue(params);
  }
  getRootObj(): IObjectValueContext {
    return this.scopes[0].parentData;
  }
  // The changed names a write reports, as the parent's context gives them: inside a record, the record's, so an
  // inner question's {street} re-runs on a write of the record. The survey's context gives none.
  getContextKeys(keys?: any): { [key: string]: any } {
    const root = this.getRootObj();
    const ctx = root?.getValueGetterContext();
    return !!ctx && typeof ctx.getContextKeys === "function" ? ctx.getContextKeys(keys) : {};
  }
  // The scopes' indexes, letter case ignored: a question of the first scope that has one wins.
  public findQuestion(name: string): Question {
    for (let i = 0; i < this.scopes.length; i++) {
      const res = this.scopes[i].getDataKeyIndex().getQuestions(name, true);
      if (res.length > 0) return res[0];
    }
    return null;
  }
  public findInnerContext(name: string): IValueGetterContext {
    const inner = getInnerLevels(this.scopes, name, true);
    return inner.length > 0 ? new PanelDataScopeValueGetterContext(inner) : undefined;
  }
  public getCommentValue(owner: Question): any {
    return owner.getValueScope().getValue(Helpers.getCommentKey(owner.getValueName()));
  }
}
// The levels a records template's nesting panels build (RecordKeyLevel), as an expression context of the
// metadata mode at design time: a template's nesting panel has no scope (place "template"), so its keys come
// from the template's elements. It holds no values. rootObj: where an unanswered name goes on to.
export class RecordKeyLevelValueGetterContext extends DataLevelValueGetterContext {
  constructor(private levels: Array<RecordKeyLevel>, private rootObj?: IObjectValueContext) {
    super();
  }
  public getValue(params: IValueGetterContextGetValueParams): IValueGetterInfo {
    if (params.path.length === 0) return { isFound: true, value: undefined, context: this };
    return super.getValue(params);
  }
  getRootObj(): IObjectValueContext {
    return this.rootObj;
  }
  public findQuestion(name: string): Question {
    return RecordKeyLevel.getQuestionOf(this.levels, name, true) || null;
  }
  public findInnerContext(name: string): IValueGetterContext {
    const inner = getInnerLevels(this.levels, name, true);
    return inner.length > 0 ? new RecordKeyLevelValueGetterContext(inner) : undefined;
  }
  public getCommentValue(owner: Question): any {
    return undefined;
  }
}
