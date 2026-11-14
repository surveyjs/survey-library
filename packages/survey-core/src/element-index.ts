import type { ISurveyElement } from "./base-interfaces";
import type { Question } from "./question";
import { DataKeyHash } from "./data-key-index";

// The elements of one owner by name, and its questions by value name. The owner decides which elements enter:
// the index has no rule of its own about pages, panels or data scopes.
// The library does not keep names unique across types (the Creator does), so a name gives a list, and a lookup
// takes the first element of the kind it asks for. Within a name the order is the order added.
// The index remembers the name and the value name it holds each element under. A name can change without a
// notification (a name set while the JSON loads), so the name a caller would pass is not always that one.
export class ElementIndex {
  private names = new DataKeyHash<ISurveyElement>();
  private valueNames = new DataKeyHash<ISurveyElement>();
  private heldNames = new WeakMap<ISurveyElement, string>();
  private heldValueNames = new WeakMap<ISurveyElement, string>();

  // An element without a name is held under "", so a later rename finds it: no lookup answers "".
  // A question without a value name is not held by value name: no key of the data is its.
  public add(el: ISurveyElement): void {
    ElementIndex.hold(this.names, this.heldNames, el, el.name || "");
    if (el.isQuestion) {
      ElementIndex.hold(this.valueNames, this.heldValueNames, el, (<Question><any>el).getValueName() || undefined);
    }
  }
  public remove(el: ISurveyElement): void {
    ElementIndex.hold(this.names, this.heldNames, el, undefined);
    ElementIndex.hold(this.valueNames, this.heldValueNames, el, undefined);
  }
  // The element's name may have changed. Only an element the index holds moves, and one whose name is the
  // same keeps its place among the elements of that name. A value name alone is not looked at: the owner
  // reports a question's change by remove and add.
  public renamed(el: ISurveyElement): void {
    const name = this.heldNames.get(el);
    if (name === undefined || name === (el.name || "")) return;
    this.remove(el);
    this.add(el);
  }
  public clear(): void {
    this.names = new DataKeyHash<ISurveyElement>();
    this.valueNames = new DataKeyHash<ISurveyElement>();
    this.heldNames = new WeakMap<ISurveyElement, string>();
    this.heldValueNames = new WeakMap<ISurveyElement, string>();
  }
  // The first element of the kind under the name, or null. caseInsensitive with exactFirst: an element with the
  // exact name wins; without it, the first one whose lower-case name matches.
  public find(name: string, isKind: (el: ISurveyElement) => boolean, caseInsensitive?: boolean, exactFirst?: boolean): any {
    if (!name) return null;
    if (!caseInsensitive || exactFirst) {
      const res = ElementIndex.firstOfKind(this.names.get(name), isKind);
      if (!!res || !caseInsensitive) return res;
    }
    return ElementIndex.firstOfKind(this.names.get(name, true), isKind);
  }
  // The list as stored: read it, do not change it.
  public getQuestionsByValueName(valueName: string, caseInsensitive?: boolean): Array<Question> {
    return <Array<Question>><any>this.valueNames.get(valueName, caseInsensitive);
  }
  // Puts el under key, taking it from the key it was held under; key undefined: only takes it out.
  private static hold(hash: DataKeyHash<ISurveyElement>, held: WeakMap<ISurveyElement, string>, el: ISurveyElement, key: string): void {
    const heldKey = held.get(el);
    if (heldKey === key) return;
    if (heldKey !== undefined) {
      hash.remove(heldKey, el);
      held.delete(el);
    }
    if (key !== undefined) {
      hash.add(key, el);
      held.set(el, key);
    }
  }
  private static firstOfKind(list: Array<ISurveyElement>, isKind: (el: ISurveyElement) => boolean): ISurveyElement {
    for (let i = 0; i < list.length; i++) {
      if (isKind(list[i])) return list[i];
    }
    return null;
  }
}
