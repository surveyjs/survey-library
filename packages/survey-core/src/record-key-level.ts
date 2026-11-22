import type { IElement, ISurveyDataElement } from "./base-interfaces";
import type { Question } from "./question";
import type { PanelModelBase } from "./panel";
import type { IDataKeyLevel } from "./data-key-index";
import { isKnownDataKey, forEachUnknownKey } from "./data-key-index";
import { ElementIndex } from "./element-index";
import { asScopeObject } from "./data-object-utils";

// A key inside a nesting panel's object of a record that no element of the levels knows, by its path from the
// record (["address", "foo"]), with the key's value.
interface IRecordNestedKey {
  path: Array<string>;
  value: any;
}

// The keys of one level of the records a template builds: its questions under their value names and its
// nesting panels under their keys (PanelModelBase.getRecordDataNestingKey), each with the level of its own
// keys. Built from the elements whatever they are attached to: a dynamic panel's template, a matrix's detail
// panel template, or the panel of one record. The owner-level rules of the records read it.
export class RecordKeyLevel implements IDataKeyLevel {
  // Its keys only: no lookup of a level goes by name.
  public readonly index = new ElementIndex();
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
          this.index.addKeyed(el, key);
          this.levels.set(el, new RecordKeyLevel(el.elements));
        }
      } else if (el.isQuestion) {
        this.index.addKeyed(el, el.getValueName());
      }
    });
  }
  // The levels of the nesting panels on a key: panels sharing a key share its object.
  public getInner(key: string, caseInsensitive?: boolean): Array<RecordKeyLevel> {
    return this.index.getElements(key, caseInsensitive).filter(el => !el.isQuestion).map(el => this.levels.get(el));
  }
  public getQuestion(key: string, caseInsensitive?: boolean): Question {
    return this.index.getQuestions(key, caseInsensitive)[0] || undefined;
  }
  public isKnownKey(key: string): boolean {
    return isKnownDataKey(this.index, key);
  }
  // The levels that share one key read as one: the question of the first level that has one. Their levels on a
  // key are getInnerLevels.
  public static getQuestionOf(levels: Array<RecordKeyLevel>, key: string, caseInsensitive?: boolean): Question {
    for (let i = 0; i < levels.length; i++) {
      const res = levels[i].getQuestion(key, caseInsensitive);
      if (!!res) return res;
    }
    return undefined;
  }
  // The keys no element of the levels knows inside the objects of obj's nesting keys, with their values.
  // obj's own keys are the owner's rule (isRecordKeyUnknown).
  public getNestedUnknownKeys(obj: any): Array<IRecordNestedKey> {
    const res: Array<IRecordNestedKey> = [];
    const record = asScopeObject(obj);
    if (!!record) {
      Object.keys(record).forEach(key => {
        const levels = this.getInner(key);
        if (levels.length > 0) {
          forEachUnknownKey(levels, record[key], [key], (path: Array<string>, value: any): void => { res.push({ path, value }); });
        }
      });
    }
    return res;
  }
}
// Whether a panel among the elements, at any depth, nests in the records built from them.
export function hasRecordDataNesting(elements: Array<IElement>): boolean {
  return (elements || []).some((el: any): boolean => el.isPanel && (!!el.getRecordDataNestingKey() || hasRecordDataNesting(el.elements)));
}
// Whether a nesting panel stands between the element and the template it is in: the element's value is then a
// key of that panel's object, one level deeper than the record. The record's filter and sort fields leave it out,
// and the property grid offers it no filter settings. The element is one of template.questions: a composite's
// inner question would get a wrong answer, since getRecordDataNestingKey() doesn't know it is inside a composite.
export function isInRecordNestingPanel(element: Question, template: PanelModelBase): boolean {
  let el: any = element.parent;
  while(!!el && el !== template) {
    if (!!el.getRecordDataNestingKey()) return true;
    el = el.parent;
  }
  return false;
}
