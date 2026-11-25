import type { ISurveyElement, ISurveyDataElement } from "./base-interfaces";
import type { Question } from "./question";
import type { PanelDataScope } from "./panel-data-scope";
import { DataKeyHash, getElementDataScope } from "./data-key-index";

// Elements by name, or the keys of one data scope or of one level of records. By name, a name gives a list: the
// library does not keep names unique across types (the Creator does). The index remembers the name it holds each
// element under, since a name can change without a notification (a name set while the JSON loads). By key, the
// questions of a key come before its containers, and elements holds each element once, in document order. A scope's
// instance changes in place only by an append and by a root question's new key; any other change drops it.
export class ElementIndex {
  private names = new DataKeyHash<ISurveyElement>();
  private heldNames = new WeakMap<ISurveyElement, string>();

  private questionKeys = new DataKeyHash();
  private containerKeys = new DataKeyHash();
  private heldKeys = new WeakMap<ISurveyDataElement, string>();
  public readonly elements: Array<ISurveyDataElement> = [];

  // An element without a name is held under "", so a later rename finds it: no lookup answers "".
  public add(el: ISurveyElement): void {
    ElementIndex.hold(this.names, this.heldNames, el, el.name || "");
  }
  public remove(el: ISurveyElement): void {
    ElementIndex.hold(this.names, this.heldNames, el, undefined);
  }
  // The element's name may have changed. Only an element the index holds moves, and one whose name is the
  // same keeps its place among the elements of that name.
  public renamed(el: ISurveyElement): void {
    const name = this.heldNames.get(el);
    if (name === undefined || name === (el.name || "")) return;
    this.remove(el);
    this.add(el);
  }
  public clear(): void {
    this.names = new DataKeyHash<ISurveyElement>();
    this.heldNames = new WeakMap<ISurveyElement, string>();
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

  // By key.
  public has(el: ISurveyDataElement): boolean {
    return this.heldKeys.has(el);
  }
  // Appended: the owner adds in document order, or builds the instance again. An element without a key is in
  // elements only (a walk reaches a question with no name).
  public addKeyed(el: ISurveyDataElement, key: string): void {
    if (this.heldKeys.has(el)) return;
    this.heldKeys.set(el, key || "");
    this.elements.push(el);
    if (!!key) {
      this.getKeyHash(el).add(key, el);
    }
  }
  // A held element under another key: its place in elements stays, and it takes its rank in the new key's list.
  public reKey(el: ISurveyDataElement, key: string): void {
    const heldKey = this.heldKeys.get(el);
    key = key || "";
    if (heldKey === undefined || heldKey === key) return;
    const hash = this.getKeyHash(el);
    if (!!heldKey) hash.remove(heldKey, el);
    this.heldKeys.set(el, key);
    if (!!key) hash.insert(key, el, this.getRank);
  }
  public getElements(key: string, caseInsensitive?: boolean): Array<ISurveyDataElement> {
    const questions = this.questionKeys.get(key, caseInsensitive);
    const containers = this.containerKeys.get(key, caseInsensitive);
    return containers.length === 0 ? questions : questions.concat(containers);
  }
  // The list as stored: read it, do not change it.
  public getQuestions(key: string, caseInsensitive?: boolean): Array<Question> {
    return <Array<Question>><any>this.questionKeys.get(key, caseInsensitive);
  }
  public getScopes(key: string, caseInsensitive?: boolean): Array<PanelDataScope> {
    return this.containerKeys.get(key, caseInsensitive).map(el => getElementDataScope(el));
  }
  public hasScopes(): boolean {
    return !this.containerKeys.isEmpty();
  }
  private getKeyHash(el: ISurveyDataElement): DataKeyHash {
    return el.isQuestion ? this.questionKeys : this.containerKeys;
  }
  private getRank = (el: ISurveyDataElement): number => {
    return this.elements.indexOf(el);
  };
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
