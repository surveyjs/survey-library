import type { ISurveyElement, ISurveyDataElement } from "./base-interfaces";
import type { Question } from "./question";
import type { PanelDataScope } from "./panel-data-scope";
import { DataKeyHash, IDataKeys, getElementDataScope } from "./data-key-index";

// Elements by name, or the keys of one data scope. One class, used two ways:
// - By name (the survey's flat structure): add, remove, renamed, find. The owner decides which elements enter:
//   the index has no rule of its own about pages, panels or data scopes. The library does not keep names unique
//   across types (the Creator does), so a name gives a list, and a lookup takes the first element of the kind it
//   asks for. Within a name the order is the order added. The index remembers the name it holds each element
//   under: a name can change without a notification (a name set while the JSON loads), so the name a caller
//   would pass is not always that one.
// - By key (a data scope's instance): addKeyed, removeKeyed, reKey and the IDataKeys reads. Questions under their
//   value name and active containers under their key; for one key the questions come first. elements holds each
//   element once: in document order for a scope below the root (the lists read it), in no order read by anyone
//   for the root. Each key's list follows the rank the owner gives, or the order of elements.
export class ElementIndex implements IDataKeys {
  private names = new DataKeyHash<ISurveyElement>();
  private heldNames = new WeakMap<ISurveyElement, string>();
  // The order added by value name (getStamp). A question gets a new stamp whenever it is held under another value
  // name, the way a value-name hash would push it to the end of the new name's list.
  private heldValueNames = new WeakMap<ISurveyElement, string>();
  private stamps = new WeakMap<ISurveyElement, number>();
  private stampCount = 0;

  private questionKeys = new DataKeyHash();
  private containerKeys = new DataKeyHash();
  private heldKeys = new WeakMap<ISurveyDataElement, string>();
  public readonly elements: Array<ISurveyDataElement> = [];

  // rank: the position of a keyed element among the elements of its key; undefined puts it last. Without it, the
  // order of elements.
  constructor(private rank?: (el: ISurveyDataElement) => number) { }

  // An element without a name is held under "", so a later rename finds it: no lookup answers "".
  public add(el: ISurveyElement): void {
    ElementIndex.hold(this.names, this.heldNames, el, el.name || "");
    if (!el.isQuestion) return;
    const valueName = (<Question><any>el).getValueName() || "";
    if (this.heldValueNames.get(el) === valueName) return;
    this.heldValueNames.set(el, valueName);
    this.stamps.set(el, ++this.stampCount);
  }
  public remove(el: ISurveyElement): void {
    ElementIndex.hold(this.names, this.heldNames, el, undefined);
    this.heldValueNames.delete(el);
    this.stamps.delete(el);
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
    this.heldNames = new WeakMap<ISurveyElement, string>();
    this.heldValueNames = new WeakMap<ISurveyElement, string>();
    this.stamps = new WeakMap<ISurveyElement, number>();
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
  // A held question's place in the order added by value name, and the value name it holds it under; undefined
  // for an element it does not hold by name.
  public getStamp(el: ISurveyElement): number {
    return this.stamps.get(el);
  }
  public getHeldValueName(el: ISurveyElement): string {
    return this.heldValueNames.get(el);
  }
  // Each element held by name, once, in no order.
  public forEachHeld(callback: (el: ISurveyElement) => void): void {
    this.names.forEach(callback);
  }

  // By key.
  public has(el: ISurveyDataElement): boolean {
    return this.heldKeys.has(el);
  }
  // Appended to elements: the owner adds in its order, or builds the instance again. An element without a key is
  // in elements only (a walk reaches a question with no name). An element already held is not added again.
  public addKeyed(el: ISurveyDataElement, key: string): void {
    if (this.heldKeys.has(el)) return;
    this.heldKeys.set(el, key || "");
    this.elements.push(el);
    if (!!key) {
      this.getKeyHash(el).insert(key, el, this.getRank);
    }
  }
  public removeKeyed(el: ISurveyDataElement): void {
    const key = this.heldKeys.get(el);
    if (key === undefined) return;
    this.heldKeys.delete(el);
    this.elements.splice(this.elements.indexOf(el), 1);
    if (!!key) {
      this.getKeyHash(el).remove(key, el);
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
  public getHeldKey(el: ISurveyDataElement): string {
    return this.heldKeys.get(el);
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
  private getKeyHash(el: ISurveyDataElement): DataKeyHash {
    return el.isQuestion ? this.questionKeys : this.containerKeys;
  }
  private getRank = (el: ISurveyDataElement): number => {
    return !!this.rank ? this.rank(el) : this.elements.indexOf(el);
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
