import type { IElement, ISurveyDataElement } from "./base-interfaces";
import type { Question } from "./question";
import { DataKeyIndex, isKnownDataKey } from "./data-key-index";
import { asScopeObject } from "./data-object-utils";

// A key inside a nesting panel's object of a record that no element of the levels knows, by its path from the
// record (["address", "foo"]), with the key's value.
export interface IRecordNestedKey {
  path: Array<string>;
  value: any;
}

// The keys of one level of the records a template builds (RN3): its questions under their value names and its
// nesting panels under their keys (PanelModelBase.getRecordDataNestingKey), each with the level of its own
// keys. Built from the elements whatever they are attached to: a dynamic panel's template, a matrix's detail
// panel template, or the panel of one record. The owner-level rules of the records read it.
export class RecordKeyLevel {
  public readonly index = new DataKeyIndex();
  private levels = new Map<ISurveyDataElement, RecordKeyLevel>();
  constructor(elements: Array<IElement>) {
    this.addElements(elements);
  }
  private addElements(elements: Array<IElement>): void {
    (elements || []).forEach((el: any): void => {
      if (el.isPanel) {
        const key = el.getRecordDataNestingKey();
        if (!key) {
          this.addElements(el.elements);
        } else {
          this.index.add(key, el);
          this.levels.set(el, new RecordKeyLevel(el.elements));
        }
      } else if (el.isQuestion) {
        this.index.add(el.getValueName(), el);
      }
    });
  }
  // The levels of the nesting panels on a key: panels sharing a key share its object (D4).
  public getLevels(key: string, caseInsensitive?: boolean): Array<RecordKeyLevel> {
    return this.index.getElements(key, caseInsensitive).filter(el => !el.isQuestion).map(el => this.levels.get(el));
  }
  public getQuestion(key: string, caseInsensitive?: boolean): Question {
    return this.index.getQuestions(key, caseInsensitive)[0] || undefined;
  }
  public isKnownKey(key: string): boolean {
    return isKnownDataKey(this.index, key);
  }
  // The levels that share one key (D4) read as one: the question of the first level that has one, and the
  // levels on a key of all of them.
  public static getQuestionOf(levels: Array<RecordKeyLevel>, key: string, caseInsensitive?: boolean): Question {
    for (let i = 0; i < levels.length; i++) {
      const res = levels[i].getQuestion(key, caseInsensitive);
      if (!!res) return res;
    }
    return undefined;
  }
  public static getLevelsOf(levels: Array<RecordKeyLevel>, key: string, caseInsensitive?: boolean): Array<RecordKeyLevel> {
    const res: Array<RecordKeyLevel> = [];
    levels.forEach(level => res.push(...level.getLevels(key, caseInsensitive)));
    return res;
  }
  // The keys no element of the levels knows inside the objects of obj's nesting keys, with their values.
  // obj's own keys are the owner's rule (isRecordKeyUnknown).
  public getNestedUnknownKeys(obj: any): Array<IRecordNestedKey> {
    const res: Array<IRecordNestedKey> = [];
    const collect = (levels: Array<RecordKeyLevel>, val: any, path: Array<string>): void => {
      const inner = asScopeObject(val);
      if (!inner) return;
      Object.keys(inner).forEach(key => {
        const next = RecordKeyLevel.getLevelsOf(levels, key);
        if (next.length > 0) {
          collect(next, inner[key], path.concat([key]));
        } else if (!levels.some(level => level.isKnownKey(key))) {
          res.push({ path: path.concat([key]), value: inner[key] });
        }
      });
    };
    const record = asScopeObject(obj);
    if (!!record) {
      Object.keys(record).forEach(key => {
        const levels = this.getLevels(key);
        if (levels.length > 0) collect(levels, record[key], [key]);
      });
    }
    return res;
  }
  // The paths of getNestedUnknownKeys: [["address", "foo"]].
  public getNestedUnknownPaths(obj: any): Array<Array<string>> {
    return this.getNestedUnknownKeys(obj).map(item => item.path);
  }
}
// Whether a panel among the elements, at any depth, nests in the records built from them (RN3).
export function hasRecordDataNesting(elements: Array<IElement>): boolean {
  return (elements || []).some((el: any): boolean => el.isPanel && (!!el.getRecordDataNestingKey() || hasRecordDataNesting(el.elements)));
}
